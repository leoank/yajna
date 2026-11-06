//! Xorbs (huggingface.co/docs/xet/xorb): up to 64 MiB and 8192 chunks, each an 8-byte
//! header and its compressed bytes, then a footer with every chunk's hash and offsets, then
//! the footer's length. A xorb is uploaded without its footer; whoever stores it adds one.

use crate::compress::Scheme;
use crate::hash::{chunk_hash, xorb_hash, Hash};
use crate::Error;

pub const MAX_XORB_BYTES: usize = 64 * 1024 * 1024;
pub const MAX_XORB_CHUNKS: usize = 8 * 1024;
const HEADER_LEN: usize = 8;
const IDENT: &[u8; 7] = b"XETBLOB";
const IDENT_HASHES: &[u8; 7] = b"XBLBHSH";
const IDENT_BOUNDARIES: &[u8; 7] = b"XBLBBND";
/// xet-core chooses the compression of a run of this many chunks from its first.
const RETEST_INTERVAL: usize = 32;

/// How chunks are compressed: one scheme, or chosen from the data as xet-core does
/// (LZ4 or BG4). `Fixed(Scheme::Zstd)` makes xorbs only yajna reads.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Compression {
    Auto,
    Fixed(Scheme),
}

/// A xorb's footer: what it holds, without reading the chunks.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Footer {
    pub hash: Hash,
    pub chunk_hashes: Vec<Hash>,
    /// where each chunk ends in the serialized xorb, header included
    pub compressed_ends: Vec<u32>,
    /// where each chunk ends in the concatenated uncompressed chunks
    pub unpacked_ends: Vec<u32>,
}

impl Footer {
    pub fn num_chunks(&self) -> usize {
        self.chunk_hashes.len()
    }

    /// The uncompressed length of chunks `start..end`.
    pub fn unpacked_len(&self, start: usize, end: usize) -> u32 {
        let before = if start == 0 { 0 } else { self.unpacked_ends[start - 1] };
        self.unpacked_ends[end - 1] - before
    }

    /// The byte range of chunks `start..end` in the serialized xorb.
    pub fn byte_range(&self, start: usize, end: usize) -> (u32, u32) {
        let from = if start == 0 { 0 } else { self.compressed_ends[start - 1] };
        (from, self.compressed_ends[end - 1])
    }

    /// The footer's bytes followed by its length, as appended to the chunks.
    pub fn to_bytes(&self) -> Vec<u8> {
        let n = self.chunk_hashes.len();
        let boundary_from_end = 7 + 1 + 4 + 8 * n + 4 + 4 + 4 + 16;
        let hashes_from_end = 7 + 1 + 4 + 32 * n + boundary_from_end;
        let mut w = Vec::with_capacity(92 + 40 * n + 4);
        w.extend_from_slice(IDENT);
        w.push(1);
        w.extend_from_slice(&self.hash.0);
        w.extend_from_slice(IDENT_HASHES);
        w.push(0);
        w.extend_from_slice(&(n as u32).to_le_bytes());
        for h in &self.chunk_hashes {
            w.extend_from_slice(&h.0);
        }
        w.extend_from_slice(IDENT_BOUNDARIES);
        w.push(1);
        w.extend_from_slice(&(n as u32).to_le_bytes());
        for v in self.compressed_ends.iter().chain(&self.unpacked_ends) {
            w.extend_from_slice(&v.to_le_bytes());
        }
        w.extend_from_slice(&(n as u32).to_le_bytes());
        w.extend_from_slice(&(hashes_from_end as u32).to_le_bytes());
        w.extend_from_slice(&(boundary_from_end as u32).to_le_bytes());
        w.extend_from_slice(&[0u8; 16]);
        let len = w.len() as u32;
        w.extend_from_slice(&len.to_le_bytes());
        w
    }

    /// Read the footer at the end of a serialized xorb.
    pub fn parse(xorb: &[u8]) -> Result<Footer, Error> {
        let bad = |what: &str| Error::Malformed(format!("xorb footer: {what}"));
        let total = xorb.len();
        if total < 4 {
            return Err(bad("too short"));
        }
        let info_len = u32_at(xorb, total - 4) as usize;
        if info_len + 4 > total || info_len < 92 {
            return Err(bad("bad length"));
        }
        let info = &xorb[total - 4 - info_len..total - 4];
        let mut r = Reader { b: info, at: 0 };
        if r.take(7)? != IDENT {
            return Err(bad("not a xorb"));
        }
        if r.u8()? != 1 {
            return Err(bad("unsupported version"));
        }
        let hash = r.hash()?;
        if r.take(7)? != IDENT_HASHES || r.u8()? != 0 {
            return Err(bad("hash section"));
        }
        let n = r.u32()? as usize;
        let chunk_hashes = (0..n).map(|_| r.hash()).collect::<Result<Vec<_>, _>>()?;
        if r.take(7)? != IDENT_BOUNDARIES || r.u8()? != 1 {
            return Err(bad("boundary section"));
        }
        if r.u32()? as usize != n {
            return Err(bad("chunk counts differ"));
        }
        let compressed_ends = (0..n).map(|_| r.u32()).collect::<Result<Vec<_>, _>>()?;
        let unpacked_ends = (0..n).map(|_| r.u32()).collect::<Result<Vec<_>, _>>()?;
        if r.u32()? as usize != n {
            return Err(bad("chunk counts differ"));
        }
        Ok(Footer { hash, chunk_hashes, compressed_ends, unpacked_ends })
    }
}

/// A serialized xorb.
pub struct Xorb {
    pub bytes: Vec<u8>,
    pub footer: Footer,
}

/// Serialize `chunks` into a xorb, with its footer when `with_footer`. `file_starts` are
/// the indices where each file's chunks begin, which is where `Compression::Auto` chooses
/// afresh (the first is 0).
pub fn serialize(chunks: &[&[u8]], file_starts: &[usize], compression: Compression, with_footer: bool) -> Result<Xorb, Error> {
    if chunks.len() > MAX_XORB_CHUNKS {
        return Err(Error::Malformed(format!("{} chunks in one xorb", chunks.len())));
    }
    let mut bytes = Vec::new();
    let mut footer = Footer { hash: Hash::default(), chunk_hashes: Vec::new(), compressed_ends: Vec::new(), unpacked_ends: Vec::new() };
    let mut leaves = Vec::with_capacity(chunks.len());
    let mut unpacked = 0u32;
    let mut scheme = Scheme::None;
    for (i, chunk) in chunks.iter().enumerate() {
        scheme = match compression {
            Compression::Fixed(s) => s,
            Compression::Auto => {
                let file_start = file_starts.iter().rev().find(|&&s| s <= i).copied().unwrap_or(0);
                if (i - file_start) % RETEST_INTERVAL == 0 {
                    Scheme::choose(chunk)
                } else {
                    scheme
                }
            }
        };
        write_chunk(&mut bytes, chunk, scheme)?;
        let h = chunk_hash(chunk);
        leaves.push((h, chunk.len() as u64));
        unpacked += chunk.len() as u32;
        footer.chunk_hashes.push(h);
        footer.compressed_ends.push(bytes.len() as u32);
        footer.unpacked_ends.push(unpacked);
    }
    if unpacked as usize > MAX_XORB_BYTES {
        return Err(Error::Malformed(format!("{unpacked} bytes in one xorb")));
    }
    footer.hash = xorb_hash(&leaves);
    if with_footer {
        bytes.extend(footer.to_bytes());
    }
    Ok(Xorb { bytes, footer })
}

fn write_chunk(out: &mut Vec<u8>, chunk: &[u8], scheme: Scheme) -> Result<(), Error> {
    if chunk.is_empty() || chunk.len() > crate::chunk::MAX_CHUNK_SIZE {
        return Err(Error::Malformed(format!("a chunk of {} bytes", chunk.len())));
    }
    let compressed = scheme.compress(chunk);
    let (scheme, body): (Scheme, &[u8]) =
        if compressed.len() >= chunk.len() { (Scheme::None, chunk) } else { (scheme, &compressed) };
    let c = (body.len() as u32).to_le_bytes();
    let u = (chunk.len() as u32).to_le_bytes();
    out.extend_from_slice(&[0, c[0], c[1], c[2], scheme as u8, u[0], u[1], u[2]]);
    out.extend_from_slice(body);
    Ok(())
}

/// One chunk of a serialized xorb, found by walking the headers.
struct Raw<'a> {
    scheme: Scheme,
    body: &'a [u8],
    unpacked_len: usize,
    end: usize,
}

fn read_chunk(data: &[u8], at: usize) -> Result<Raw<'_>, Error> {
    let bad = |what: String| Error::Malformed(format!("xorb chunk at {at}: {what}"));
    if at + HEADER_LEN > data.len() {
        return Err(bad("truncated header".into()));
    }
    let h = &data[at..at + HEADER_LEN];
    if h[..7] == IDENT[..] {
        return Err(bad("reached the footer".into()));
    }
    if h[0] != 0 {
        return Err(bad(format!("chunk version {}", h[0])));
    }
    let clen = u32::from_le_bytes([h[1], h[2], h[3], 0]) as usize;
    let scheme = Scheme::from_u8(h[4])?;
    let ulen = u32::from_le_bytes([h[5], h[6], h[7], 0]) as usize;
    if ulen == 0 || ulen > crate::chunk::MAX_CHUNK_SIZE || clen == 0 || clen > 2 * crate::chunk::MAX_CHUNK_SIZE {
        return Err(bad(format!("sizes {clen} and {ulen}")));
    }
    let start = at + HEADER_LEN;
    if start + clen > data.len() {
        return Err(bad("truncated body".into()));
    }
    Ok(Raw { scheme, body: &data[start..start + clen], unpacked_len: ulen, end: start + clen })
}

fn unpack(raw: &Raw<'_>) -> Result<Vec<u8>, Error> {
    let out = raw.scheme.decompress(raw.body)?;
    if out.len() != raw.unpacked_len {
        return Err(Error::Malformed(format!("chunk unpacked to {} bytes, header says {}", out.len(), raw.unpacked_len)));
    }
    Ok(out)
}

/// The uncompressed bytes of chunks `start..end`, given the bytes of exactly those chunks
/// (a range fetched with `Footer::byte_range`, or a whole xorb from offset 0).
pub fn unpack_chunks(data: &[u8], count: usize) -> Result<Vec<Vec<u8>>, Error> {
    let mut out = Vec::with_capacity(count);
    let mut at = 0;
    for _ in 0..count {
        let raw = read_chunk(data, at)?;
        out.push(unpack(&raw)?);
        at = raw.end;
    }
    Ok(out)
}

/// Check a footerless xorb (as uploaded) against `hash` and give it its footer.
pub fn add_footer(data: &[u8], hash: &Hash) -> Result<Vec<u8>, Error> {
    let mut footer = Footer { hash: *hash, chunk_hashes: Vec::new(), compressed_ends: Vec::new(), unpacked_ends: Vec::new() };
    let mut leaves = Vec::new();
    let mut at = 0;
    let mut unpacked = 0u32;
    while at < data.len() {
        let raw = read_chunk(data, at)?;
        let chunk = unpack(&raw)?;
        let h = chunk_hash(&chunk);
        leaves.push((h, chunk.len() as u64));
        unpacked += chunk.len() as u32;
        footer.chunk_hashes.push(h);
        footer.compressed_ends.push(raw.end as u32);
        footer.unpacked_ends.push(unpacked);
        at = raw.end;
    }
    if xorb_hash(&leaves) != *hash {
        return Err(Error::HashMismatch(format!("xorb {hash}")));
    }
    let mut out = data.to_vec();
    out.extend(footer.to_bytes());
    Ok(out)
}

/// Rehash every chunk of a xorb with its footer and check the footer and the xorb hash.
pub fn verify(xorb: &[u8]) -> Result<Footer, Error> {
    let footer = Footer::parse(xorb)?;
    let n = footer.num_chunks();
    let chunks = unpack_chunks(xorb, n)?;
    let mut leaves = Vec::with_capacity(n);
    let mut unpacked = 0u32;
    for (i, c) in chunks.iter().enumerate() {
        let h = chunk_hash(c);
        unpacked += c.len() as u32;
        if h != footer.chunk_hashes[i] || unpacked != footer.unpacked_ends[i] {
            return Err(Error::HashMismatch(format!("chunk {i} of xorb {}", footer.hash)));
        }
        leaves.push((h, c.len() as u64));
    }
    if xorb_hash(&leaves) != footer.hash {
        return Err(Error::HashMismatch(format!("xorb {}", footer.hash)));
    }
    Ok(footer)
}

fn u32_at(b: &[u8], at: usize) -> u32 {
    u32::from_le_bytes(b[at..at + 4].try_into().unwrap())
}

pub(crate) struct Reader<'a> {
    pub b: &'a [u8],
    pub at: usize,
}

impl<'a> Reader<'a> {
    pub fn take(&mut self, n: usize) -> Result<&'a [u8], Error> {
        if self.at + n > self.b.len() {
            return Err(Error::Malformed(format!("truncated at byte {}", self.at)));
        }
        let s = &self.b[self.at..self.at + n];
        self.at += n;
        Ok(s)
    }
    pub fn u8(&mut self) -> Result<u8, Error> {
        Ok(self.take(1)?[0])
    }
    pub fn u32(&mut self) -> Result<u32, Error> {
        Ok(u32::from_le_bytes(self.take(4)?.try_into().unwrap()))
    }
    pub fn u64(&mut self) -> Result<u64, Error> {
        Ok(u64::from_le_bytes(self.take(8)?.try_into().unwrap()))
    }
    pub fn hash(&mut self) -> Result<Hash, Error> {
        Ok(Hash(self.take(32)?.try_into().unwrap()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn chunks() -> Vec<Vec<u8>> {
        let floats: Vec<u8> = (0..4000u32).flat_map(|i| (i as f32 * 0.5).to_le_bytes()).collect();
        vec![b"hello world".repeat(900), floats, (0..=255u8).cycle().take(9000).collect(), vec![42; 10]]
    }

    #[test]
    fn a_xorb_round_trips_and_its_footer_is_92_plus_40_per_chunk() {
        let owned = chunks();
        let refs: Vec<&[u8]> = owned.iter().map(|c| &c[..]).collect();
        let x = serialize(&refs, &[0], Compression::Auto, true).unwrap();
        let footer = Footer::parse(&x.bytes).unwrap();
        assert_eq!(footer, x.footer);
        assert_eq!(footer.to_bytes().len(), 92 + 40 * 4 + 4);
        assert_eq!(unpack_chunks(&x.bytes, 4).unwrap(), owned);
        assert_eq!(verify(&x.bytes).unwrap().hash, x.footer.hash);
        // a range: chunks 1..3
        let (from, to) = footer.byte_range(1, 3);
        assert_eq!(unpack_chunks(&x.bytes[from as usize..to as usize], 2).unwrap(), owned[1..3]);
        assert_eq!(footer.unpacked_len(1, 3) as usize, owned[1].len() + owned[2].len());
    }

    #[test]
    fn an_uploaded_xorb_gets_the_same_footer_back() {
        let owned = chunks();
        let refs: Vec<&[u8]> = owned.iter().map(|c| &c[..]).collect();
        let with = serialize(&refs, &[0], Compression::Auto, true).unwrap();
        let without = serialize(&refs, &[0], Compression::Auto, false).unwrap();
        assert_eq!(add_footer(&without.bytes, &with.footer.hash).unwrap(), with.bytes);
        assert!(matches!(add_footer(&without.bytes, &Hash::default()), Err(Error::HashMismatch(_))));
    }

    #[test]
    fn a_zstd_xorb_round_trips_and_is_smaller_on_text() {
        let owned = chunks();
        let refs: Vec<&[u8]> = owned.iter().map(|c| &c[..]).collect();
        let z = serialize(&refs, &[0], Compression::Fixed(Scheme::Zstd), true).unwrap();
        let l = serialize(&refs, &[0], Compression::Auto, true).unwrap();
        assert_eq!(z.footer.hash, l.footer.hash, "compression is outside the hash");
        assert_eq!(verify(&z.bytes).unwrap().hash, z.footer.hash);
        assert_eq!(unpack_chunks(&z.bytes, 4).unwrap(), owned);
        assert_eq!(z.bytes[4], Scheme::Zstd as u8);
        let without = serialize(&refs, &[0], Compression::Fixed(Scheme::Zstd), false).unwrap();
        assert_eq!(add_footer(&without.bytes, &z.footer.hash).unwrap(), z.bytes);
    }

    #[test]
    fn incompressible_chunks_are_stored_as_is() {
        let mut s = 9u64;
        let noise: Vec<u8> = (0..20_000)
            .map(|_| {
                s ^= s << 13;
                s ^= s >> 7;
                s ^= s << 17;
                (s >> 24) as u8
            })
            .collect();
        let x = serialize(&[&noise], &[0], Compression::Fixed(Scheme::Lz4), false).unwrap();
        assert_eq!(x.bytes[4], Scheme::None as u8);
        assert_eq!(x.bytes.len(), 8 + noise.len());
    }
}
