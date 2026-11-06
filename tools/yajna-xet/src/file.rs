//! Files in and out: packing files' chunks into xorbs with their recipes, and rebuilding a
//! file from its recipe. Deduplication comes with the stores (`docs/data.md` step 3); here
//! every chunk is stored.

use std::collections::HashMap;
use std::io::{Read, Write};

use sha2::{Digest, Sha256};

use crate::chunk::Chunker;
use crate::hash::{chunk_hash, file_hash, verification_hash, Hash};
use crate::shard::{FileInfo, Term};
use crate::xorb::{self, Compression, Xorb, MAX_XORB_BYTES, MAX_XORB_CHUNKS};
use crate::Error;

/// A term before its xorb is closed: chunks `start..end` of the `seq`-th xorb.
struct Pending {
    seq: usize,
    start: u32,
    end: u32,
    bytes: u32,
    hashes: Vec<Hash>,
}

/// Packs files into xorbs: a xorb closes when the next chunk would take it past 64 MiB or
/// 8192 chunks, and is handed to `sink` then; files share xorbs.
pub struct Packer<'s> {
    compression: Compression,
    sink: Box<dyn FnMut(Xorb) -> Result<(), Error> + 's>,
    chunks: Vec<Vec<u8>>,
    bytes: usize,
    file_starts: Vec<usize>,
    seq: usize,
    closed: HashMap<usize, Hash>,
    files: Vec<(Hash, Vec<Pending>, Hash)>,
}

impl<'s> Packer<'s> {
    pub fn new(compression: Compression, sink: impl FnMut(Xorb) -> Result<(), Error> + 's) -> Self {
        Packer {
            compression,
            sink: Box::new(sink),
            chunks: Vec::new(),
            bytes: 0,
            file_starts: Vec::new(),
            seq: 0,
            closed: HashMap::new(),
            files: Vec::new(),
        }
    }

    /// Chunk and pack one file; its recipe comes from `finish`.
    pub fn add(&mut self, mut reader: impl Read) -> Result<Hash, Error> {
        let mut chunker = Chunker::new();
        let mut sha = Sha256::new();
        let mut leaves = Vec::new();
        let mut pending: Vec<Pending> = Vec::new();
        let mut buf = vec![0u8; 1 << 20];
        let mut carry: Vec<u8> = Vec::new();
        let mut first = true;
        loop {
            let n = reader.read(&mut buf)?;
            let data = &buf[..n];
            sha.update(data);
            let lens = if n == 0 { chunker.finish().into_iter().collect() } else { chunker.push(data) };
            // the chunks completed by this read: what was carried over, then `data`
            let mut at = 0;
            for len in lens {
                let from_carry = len.min(carry.len());
                let mut chunk = carry.drain(..from_carry).collect::<Vec<u8>>();
                chunk.extend_from_slice(&data[at..at + len - from_carry]);
                at += len - from_carry;
                self.put(chunk, &mut pending, &mut leaves, &mut first)?;
            }
            carry.extend_from_slice(&data[at..]);
            if n == 0 {
                break;
            }
        }
        let hash = file_hash(&leaves);
        self.files.push((hash, pending, Hash::from_sha256(sha.finalize().into())));
        Ok(hash)
    }

    fn put(&mut self, chunk: Vec<u8>, pending: &mut Vec<Pending>, leaves: &mut Vec<(Hash, u64)>, first: &mut bool) -> Result<(), Error> {
        if self.bytes + chunk.len() > MAX_XORB_BYTES || self.chunks.len() + 1 > MAX_XORB_CHUNKS {
            self.close()?;
        }
        // compression is chosen afresh where a xorb or a file starts
        let is_first = std::mem::take(first);
        if self.chunks.is_empty() || is_first {
            self.file_starts.push(self.chunks.len());
        }
        let h = chunk_hash(&chunk);
        leaves.push((h, chunk.len() as u64));
        let index = self.chunks.len() as u32;
        match pending.last_mut() {
            Some(p) if p.seq == self.seq && p.end == index => {
                p.end += 1;
                p.bytes += chunk.len() as u32;
                p.hashes.push(h);
            }
            _ => pending.push(Pending { seq: self.seq, start: index, end: index + 1, bytes: chunk.len() as u32, hashes: vec![h] }),
        }
        self.bytes += chunk.len();
        self.chunks.push(chunk);
        Ok(())
    }

    fn close(&mut self) -> Result<(), Error> {
        if self.chunks.is_empty() {
            return Ok(());
        }
        let refs: Vec<&[u8]> = self.chunks.iter().map(|c| &c[..]).collect();
        let x = xorb::serialize(&refs, &self.file_starts, self.compression, true)?;
        self.closed.insert(self.seq, x.footer.hash);
        (self.sink)(x)?;
        self.chunks.clear();
        self.bytes = 0;
        self.file_starts.clear();
        self.seq += 1;
        Ok(())
    }

    /// Close the last xorb and give every file's recipe, with verification hashes and sha256.
    pub fn finish(mut self) -> Result<Vec<FileInfo>, Error> {
        self.close()?;
        let closed = std::mem::take(&mut self.closed);
        Ok(self
            .files
            .drain(..)
            .map(|(hash, pending, sha)| {
                let verification = pending.iter().map(|p| verification_hash(&p.hashes)).collect();
                let terms = pending
                    .into_iter()
                    .map(|p| Term { xorb: closed[&p.seq], unpacked_bytes: p.bytes, start: p.start, end: p.end })
                    .collect();
                FileInfo { hash, terms, verification: Some(verification), sha256: Some(sha) }
            })
            .collect())
    }
}

/// Rebuild a file from its recipe into `out`, fetching whole xorbs (with footer) through
/// `fetch`, and check every chunk, the file hash and, when recorded, the sha256.
pub fn reconstruct(file: &FileInfo, mut fetch: impl FnMut(&Hash) -> Result<Vec<u8>, Error>, out: &mut impl Write) -> Result<u64, Error> {
    let mut leaves = Vec::new();
    let mut sha = Sha256::new();
    let mut written = 0u64;
    let mut cache: Option<(Hash, Vec<u8>, xorb::Footer)> = None;
    for t in &file.terms {
        if cache.as_ref().map(|c| c.0) != Some(t.xorb) {
            let bytes = fetch(&t.xorb)?;
            let footer = xorb::Footer::parse(&bytes)?;
            if footer.hash != t.xorb {
                return Err(Error::HashMismatch(format!("xorb {} fetched for {}", footer.hash, t.xorb)));
            }
            cache = Some((t.xorb, bytes, footer));
        }
        let (_, bytes, footer) = cache.as_ref().unwrap();
        let (start, end) = (t.start as usize, t.end as usize);
        if start >= end || end > footer.num_chunks() {
            return Err(Error::Malformed(format!("term {}..{} of xorb {} with {} chunks", start, end, t.xorb, footer.num_chunks())));
        }
        let (from, to) = footer.byte_range(start, end);
        let chunks = xorb::unpack_chunks(&bytes[from as usize..to as usize], end - start)?;
        for (i, c) in chunks.iter().enumerate() {
            let h = chunk_hash(c);
            if h != footer.chunk_hashes[start + i] {
                return Err(Error::HashMismatch(format!("chunk {} of xorb {}", start + i, t.xorb)));
            }
            leaves.push((h, c.len() as u64));
            sha.update(c);
            out.write_all(c)?;
            written += c.len() as u64;
        }
    }
    if file_hash(&leaves) != file.hash {
        return Err(Error::HashMismatch(format!("file {}", file.hash)));
    }
    if let Some(expected) = file.sha256 {
        if Hash::from_sha256(sha.finalize().into()) != expected {
            return Err(Error::HashMismatch(format!("sha256 of file {}", file.hash)));
        }
    }
    Ok(written)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn bytes(n: usize, seed: u64) -> Vec<u8> {
        let mut x = seed;
        (0..n)
            .map(|_| {
                x ^= x << 13;
                x ^= x >> 7;
                x ^= x << 17;
                x as u8
            })
            .collect()
    }

    #[test]
    fn files_pack_into_shared_xorbs_and_come_back() {
        let a = bytes(3_000_000, 1);
        let b = bytes(500_000, 2);
        let empty: Vec<u8> = Vec::new();
        let mut xorbs = HashMap::new();
        let mut p = Packer::new(Compression::Auto, |x: Xorb| {
            xorbs.insert(x.footer.hash, x.bytes);
            Ok(())
        });
        p.add(&a[..]).unwrap();
        p.add(&b[..]).unwrap();
        p.add(&empty[..]).unwrap();
        let files = p.finish().unwrap();
        assert_eq!(xorbs.len(), 1, "small files share one xorb");
        assert_eq!(files[0].terms[0].xorb, files[1].terms[0].xorb);
        assert_eq!(files[1].terms[0].start, files[0].terms[0].end);
        assert_eq!(files[2].hash, Hash::default());
        assert!(files[2].terms.is_empty());
        for (f, data) in files.iter().zip([&a, &b, &empty]) {
            let mut out = Vec::new();
            reconstruct(f, |h| Ok(xorbs[h].clone()), &mut out).unwrap();
            assert_eq!(&out, data);
            assert_eq!(f.size(), data.len() as u64);
        }
        // a tampered sha256 is caught
        let mut bad = files[0].clone();
        bad.sha256 = Some(Hash::default());
        assert!(matches!(reconstruct(&bad, |h| Ok(xorbs[h].clone()), &mut Vec::new()), Err(Error::HashMismatch(_))));
    }

    #[test]
    fn a_large_file_spans_xorbs_and_the_chunking_matches_one_pass() {
        let data = bytes(70 * 1024 * 1024, 3);
        let mut xorbs = HashMap::new();
        let mut p = Packer::new(Compression::Fixed(crate::compress::Scheme::None), |x: Xorb| {
            assert!(x.footer.unpacked_ends.last().copied().unwrap() as usize <= MAX_XORB_BYTES);
            xorbs.insert(x.footer.hash, x.bytes);
            Ok(())
        });
        let hash = p.add(&data[..]).unwrap();
        let files = p.finish().unwrap();
        assert_eq!(xorbs.len(), 2);
        assert_eq!(files[0].terms.len(), 2);
        let lens = crate::chunk::chunk_lengths(&data);
        let mut at = 0;
        let leaves: Vec<_> = lens.iter().map(|&l| { let h = chunk_hash(&data[at..at + l]); at += l; (h, l as u64) }).collect();
        assert_eq!(hash, file_hash(&leaves));
        let mut out = Vec::new();
        reconstruct(&files[0], |h| Ok(xorbs[h].clone()), &mut out).unwrap();
        assert!(out == data);
    }
}
