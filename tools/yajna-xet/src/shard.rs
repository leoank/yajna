//! Shards (huggingface.co/docs/xet/shard): files' recipes (terms of xorb hash and chunk
//! range, with verification hashes and the file's sha256) and xorbs' chunk lists (the
//! dedup index), with a footer when stored. Sections are ordered by hash, as xet-core's
//! `MDBShardInfo::serialize_from` orders them.

use std::collections::BTreeMap;

use crate::hash::{chunk_hash, Hash};
use crate::xorb::Reader;
use crate::Error;

const TAG: [u8; 32] = [
    b'H', b'F', b'R', b'e', b'p', b'o', b'M', b'e', b't', b'a', b'D', b'a', b't', b'a', 0, 85, 105, 103,
    69, 106, 123, 129, 87, 131, 165, 189, 217, 92, 205, 209, 74, 169,
];
const HEADER_VERSION: u64 = 2;
const FOOTER_VERSION: u64 = 1;
const FOOTER_LEN: usize = 200;
const HEADER_LEN: usize = 48;
const WITH_VERIFICATION: u32 = 1 << 31;
const WITH_METADATA_EXT: u32 = 1 << 30;
/// On a chunk entry: may be answered by a global dedup query (a file's first chunk).
pub const GLOBAL_DEDUP: u32 = 1 << 31;

/// One term of a file's recipe: chunks `start..end` of a xorb.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Term {
    pub xorb: Hash,
    pub unpacked_bytes: u32,
    pub start: u32,
    pub end: u32,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct FileInfo {
    pub hash: Hash,
    pub terms: Vec<Term>,
    /// one per term, when present
    pub verification: Option<Vec<Hash>>,
    /// as `Hash::from_sha256` stores it; its `hex()` is the usual sha256 hex
    pub sha256: Option<Hash>,
}

impl FileInfo {
    pub fn size(&self) -> u64 {
        self.terms.iter().map(|t| t.unpacked_bytes as u64).sum()
    }

    fn entries(&self) -> usize {
        1 + self.terms.len() + self.verification.as_ref().map_or(0, |v| v.len()) + usize::from(self.sha256.is_some())
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ChunkEntry {
    pub hash: Hash,
    /// where the chunk starts in the xorb's uncompressed bytes
    pub start: u32,
    pub len: u32,
    pub flags: u32,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct XorbInfo {
    pub hash: Hash,
    pub chunks: Vec<ChunkEntry>,
    /// the uncompressed size of all its chunks
    pub unpacked_bytes: u32,
    /// the size of the serialized xorb
    pub serialized_bytes: u32,
}

impl XorbInfo {
    /// The chunk list of a xorb from its footer.
    pub fn from_footer(footer: &crate::xorb::Footer, serialized_bytes: u32) -> XorbInfo {
        let mut start = 0;
        let chunks = footer
            .chunk_hashes
            .iter()
            .zip(&footer.unpacked_ends)
            .map(|(h, &end)| {
                let e = ChunkEntry { hash: *h, start, len: end - start, flags: 0 };
                start = end;
                e
            })
            .collect();
        XorbInfo { hash: footer.hash, chunks, unpacked_bytes: start, serialized_bytes }
    }
}

/// How a shard is written.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Layout {
    /// no footer: what a client uploads
    Upload,
    /// a footer and no lookup tables: what the CAS server stores and Hugging Face's
    /// reference files hold
    Stored,
    /// a footer and lookup tables by truncated hash: xet-core's local shard cache
    Indexed,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Shard {
    pub files: BTreeMap<Hash, FileInfo>,
    pub xorbs: BTreeMap<Hash, XorbInfo>,
    /// keys the chunk hashes of a global dedup answer; zero when they are plain
    pub chunk_key: Hash,
    pub created: u64,
    pub key_expiry: u64,
}

impl Default for Shard {
    fn default() -> Self {
        Shard { files: BTreeMap::new(), xorbs: BTreeMap::new(), chunk_key: Hash::default(), created: 0, key_expiry: u64::MAX }
    }
}

impl Shard {
    pub fn to_bytes(&self, layout: Layout) -> Vec<u8> {
        let with_footer = layout != Layout::Upload;
        let mut w = Vec::new();
        w.extend_from_slice(&TAG);
        put64(&mut w, HEADER_VERSION);
        put64(&mut w, if with_footer { FOOTER_LEN as u64 } else { 0 });

        let file_info_offset = w.len() as u64;
        let mut file_lookup = Vec::with_capacity(self.files.len());
        let mut index = 0u32;
        for (hash, f) in &self.files {
            file_lookup.push((hash.truncated(), index));
            let mut flags = 0;
            if f.verification.is_some() {
                flags |= WITH_VERIFICATION;
            }
            if f.sha256.is_some() {
                flags |= WITH_METADATA_EXT;
            }
            w.extend_from_slice(&f.hash.0);
            put32(&mut w, flags);
            put32(&mut w, f.terms.len() as u32);
            put64(&mut w, 0);
            for t in &f.terms {
                w.extend_from_slice(&t.xorb.0);
                put32(&mut w, 0);
                put32(&mut w, t.unpacked_bytes);
                put32(&mut w, t.start);
                put32(&mut w, t.end);
            }
            for v in f.verification.iter().flatten() {
                w.extend_from_slice(&v.0);
                w.extend_from_slice(&[0; 16]);
            }
            if let Some(sha) = f.sha256 {
                w.extend_from_slice(&sha.0);
                w.extend_from_slice(&[0; 16]);
            }
            index += f.entries() as u32;
        }
        bookend(&mut w);

        let xorb_info_offset = w.len() as u64;
        let mut xorb_lookup = Vec::with_capacity(self.xorbs.len());
        let mut chunk_lookup = Vec::new();
        let mut index = 0u32;
        for (hash, x) in &self.xorbs {
            xorb_lookup.push((hash.truncated(), index));
            w.extend_from_slice(&x.hash.0);
            put32(&mut w, 0);
            put32(&mut w, x.chunks.len() as u32);
            put32(&mut w, x.unpacked_bytes);
            put32(&mut w, x.serialized_bytes);
            for (i, c) in x.chunks.iter().enumerate() {
                w.extend_from_slice(&c.hash.0);
                put32(&mut w, c.start);
                put32(&mut w, c.len);
                put32(&mut w, c.flags);
                put32(&mut w, 0);
                chunk_lookup.push((c.hash.truncated(), (index, i as u32)));
            }
            index += 1 + x.chunks.len() as u32;
        }
        bookend(&mut w);
        if !with_footer {
            return w;
        }

        if layout == Layout::Stored {
            file_lookup.clear();
            xorb_lookup.clear();
            chunk_lookup.clear();
        }
        // as xet-core: an unstable sort by the truncated chunk hash
        chunk_lookup.sort_unstable_by_key(|e| e.0);
        let file_lookup_offset = w.len() as u64;
        for (k, v) in &file_lookup {
            put64(&mut w, *k);
            put32(&mut w, *v);
        }
        let xorb_lookup_offset = w.len() as u64;
        for (k, v) in &xorb_lookup {
            put64(&mut w, *k);
            put32(&mut w, *v);
        }
        let chunk_lookup_offset = w.len() as u64;
        for (k, (a, b)) in &chunk_lookup {
            put64(&mut w, *k);
            put32(&mut w, *a);
            put32(&mut w, *b);
        }
        let footer_offset = w.len() as u64;
        put64(&mut w, FOOTER_VERSION);
        for v in [
            file_info_offset,
            xorb_info_offset,
            file_lookup_offset,
            file_lookup.len() as u64,
            xorb_lookup_offset,
            xorb_lookup.len() as u64,
            chunk_lookup_offset,
            chunk_lookup.len() as u64,
        ] {
            put64(&mut w, v);
        }
        w.extend_from_slice(&self.chunk_key.0);
        put64(&mut w, self.created);
        put64(&mut w, self.key_expiry);
        w.extend_from_slice(&[0; 48]);
        put64(&mut w, self.xorbs.values().map(|x| x.serialized_bytes as u64).sum());
        put64(&mut w, self.files.values().map(FileInfo::size).sum());
        put64(&mut w, self.xorbs.values().map(|x| x.unpacked_bytes as u64).sum());
        put64(&mut w, footer_offset);
        w
    }

    /// The hash a shard is stored under: the chunk hash of its stored bytes.
    pub fn hash(&self) -> Hash {
        chunk_hash(&self.to_bytes(Layout::Stored))
    }

    /// Read a shard, with or without footer; its lookup tables are not needed.
    pub fn parse(bytes: &[u8]) -> Result<Shard, Error> {
        let bad = |what: &str| Error::Malformed(format!("shard: {what}"));
        let mut r = Reader { b: bytes, at: 0 };
        if r.take(32)? != TAG {
            return Err(bad("not a shard"));
        }
        if r.u64()? != HEADER_VERSION {
            return Err(bad("unsupported header version"));
        }
        let footer_len = r.u64()? as usize;
        let mut shard = Shard::default();
        loop {
            let hash = r.hash()?;
            let flags = r.u32()?;
            let n = r.u32()? as usize;
            r.take(8)?;
            if hash.0 == [0xff; 32] {
                break;
            }
            let mut terms = Vec::with_capacity(n);
            for _ in 0..n {
                let xorb = r.hash()?;
                r.u32()?;
                terms.push(Term { xorb, unpacked_bytes: r.u32()?, start: r.u32()?, end: r.u32()? });
            }
            let verification = if flags & WITH_VERIFICATION != 0 {
                let mut v = Vec::with_capacity(n);
                for _ in 0..n {
                    v.push(r.hash()?);
                    r.take(16)?;
                }
                Some(v)
            } else {
                None
            };
            let sha256 = if flags & WITH_METADATA_EXT != 0 {
                let s = r.hash()?;
                r.take(16)?;
                Some(s)
            } else {
                None
            };
            shard.files.insert(hash, FileInfo { hash, terms, verification, sha256 });
        }
        loop {
            let hash = r.hash()?;
            r.u32()?;
            let n = r.u32()? as usize;
            let unpacked_bytes = r.u32()?;
            let serialized_bytes = r.u32()?;
            if hash.0 == [0xff; 32] {
                break;
            }
            let mut chunks = Vec::with_capacity(n);
            for _ in 0..n {
                let h = r.hash()?;
                let (start, len, flags) = (r.u32()?, r.u32()?, r.u32()?);
                r.u32()?;
                chunks.push(ChunkEntry { hash: h, start, len, flags });
            }
            shard.xorbs.insert(hash, XorbInfo { hash, chunks, unpacked_bytes, serialized_bytes });
        }
        if footer_len != 0 {
            if footer_len != FOOTER_LEN || bytes.len() < HEADER_LEN + FOOTER_LEN {
                return Err(bad("bad footer"));
            }
            let mut f = Reader { b: &bytes[bytes.len() - FOOTER_LEN..], at: 0 };
            if f.u64()? != FOOTER_VERSION {
                return Err(bad("unsupported footer version"));
            }
            f.take(64)?;
            shard.chunk_key = f.hash()?;
            shard.created = f.u64()?;
            shard.key_expiry = f.u64()?;
        }
        Ok(shard)
    }
}

fn bookend(w: &mut Vec<u8>) {
    w.extend_from_slice(&[0xff; 32]);
    w.extend_from_slice(&[0; 16]);
}

fn put32(w: &mut Vec<u8>, v: u32) {
    w.extend_from_slice(&v.to_le_bytes());
}

fn put64(w: &mut Vec<u8>, v: u64) {
    w.extend_from_slice(&v.to_le_bytes());
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::hash::chunk_hash;

    fn sample() -> Shard {
        let x = chunk_hash(b"xorb");
        let c: Vec<Hash> = (0..3u8).map(|i| chunk_hash(&[i])).collect();
        let mut s = Shard::default();
        s.xorbs.insert(x, XorbInfo {
            hash: x,
            chunks: c.iter().enumerate().map(|(i, h)| ChunkEntry { hash: *h, start: 10 * i as u32, len: 10, flags: 0 }).collect(),
            unpacked_bytes: 30,
            serialized_bytes: 70,
        });
        let f = chunk_hash(b"file");
        s.files.insert(f, FileInfo {
            hash: f,
            terms: vec![Term { xorb: x, unpacked_bytes: 20, start: 0, end: 2 }],
            verification: Some(vec![crate::hash::verification_hash(&c[..2])]),
            sha256: Some(Hash([7; 32])),
        });
        s
    }

    #[test]
    fn a_shard_round_trips_with_and_without_footer() {
        let s = sample();
        let uploaded = s.to_bytes(Layout::Upload);
        let stored = s.to_bytes(Layout::Stored);
        let indexed = s.to_bytes(Layout::Indexed);
        for bytes in [&uploaded, &stored, &indexed] {
            assert_eq!(Shard::parse(bytes).unwrap(), s);
        }
        // header 48, file header + 1 term + 1 verification + sha256 + bookend, xorb header
        // + 3 chunks + bookend; footer 200; lookups 12 + 12 + 3 * 16
        assert_eq!(uploaded.len(), 48 + 5 * 48 + 5 * 48);
        assert_eq!(stored.len(), uploaded.len() + 200);
        assert_eq!(indexed.len(), stored.len() + 12 + 12 + 48);
    }
}
