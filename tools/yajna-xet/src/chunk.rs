//! Content-defined chunking (huggingface.co/docs/xet/chunking): a 64-bit gear hash over the
//! bytes, a boundary where its top 16 bits are zero, never before 8 KiB, always at 128 KiB.

use crate::gear::GEAR;

pub const TARGET_CHUNK_SIZE: usize = 64 * 1024;
pub const MIN_CHUNK_SIZE: usize = TARGET_CHUNK_SIZE / 8;
pub const MAX_CHUNK_SIZE: usize = TARGET_CHUNK_SIZE * 2;
const MASK: u64 = 0xFFFF_0000_0000_0000;
/// The gear hash forgets a byte after 64 shifts, so hashing may start this far before the
/// first place a boundary is allowed, as xet-core does, with the same boundaries.
const WINDOW: usize = 64;

/// A streaming chunker: feed bytes in any pieces, get the same boundaries.
#[derive(Default)]
pub struct Chunker {
    hash: u64,
    /// bytes of the current chunk seen so far
    len: usize,
}

impl Chunker {
    pub fn new() -> Self {
        Self::default()
    }

    /// The lengths of the chunks completed by `data`, in order. The bytes after the last
    /// completed chunk belong to the next one; `finish` ends it.
    pub fn push(&mut self, data: &[u8]) -> Vec<usize> {
        let mut out = Vec::new();
        let mut at = 0;
        while at < data.len() {
            // skip what cannot affect the first allowed boundary
            if self.len + WINDOW < MIN_CHUNK_SIZE {
                let skip = (MIN_CHUNK_SIZE - self.len - WINDOW - 1).min(data.len() - at);
                at += skip;
                self.len += skip;
            }
            let mut cut = false;
            while at < data.len() {
                self.hash = (self.hash << 1).wrapping_add(GEAR[data[at] as usize]);
                at += 1;
                self.len += 1;
                if self.len >= MAX_CHUNK_SIZE || (self.len >= MIN_CHUNK_SIZE && self.hash & MASK == 0) {
                    cut = true;
                    break;
                }
            }
            if cut {
                out.push(self.len);
                self.len = 0;
                self.hash = 0;
            }
        }
        out
    }

    /// The length of the last chunk, if any bytes are pending.
    pub fn finish(&mut self) -> Option<usize> {
        let len = std::mem::take(&mut self.len);
        self.hash = 0;
        (len > 0).then_some(len)
    }
}

/// The chunk lengths of a whole buffer.
pub fn chunk_lengths(data: &[u8]) -> Vec<usize> {
    let mut c = Chunker::new();
    let mut out = c.push(data);
    out.extend(c.finish());
    out
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
    fn small_and_empty_files() {
        assert_eq!(chunk_lengths(&[]), Vec::<usize>::new());
        assert_eq!(chunk_lengths(&[7]), vec![1]);
        assert_eq!(chunk_lengths(&[0; 8191]), vec![8191]);
    }

    #[test]
    fn zeros_cut_at_the_maximum() {
        // the hash of a run of one byte value settles and may never match
        let lens = chunk_lengths(&vec![0u8; 3 * MAX_CHUNK_SIZE + 5]);
        assert!(lens.iter().all(|&l| (MIN_CHUNK_SIZE..=MAX_CHUNK_SIZE).contains(&l) || l == 5));
        assert_eq!(lens.iter().sum::<usize>(), 3 * MAX_CHUNK_SIZE + 5);
    }

    #[test]
    fn pieces_do_not_change_boundaries_and_sizes_stay_in_bounds() {
        let data = bytes(5_000_000, 42);
        let whole = chunk_lengths(&data);
        let mut c = Chunker::new();
        let mut pieces = Vec::new();
        for piece in data.chunks(7_777) {
            pieces.extend(c.push(piece));
        }
        pieces.extend(c.finish());
        assert_eq!(whole, pieces);
        assert_eq!(whole.iter().sum::<usize>(), data.len());
        let (last, rest) = whole.split_last().unwrap();
        assert!(rest.iter().all(|&l| (MIN_CHUNK_SIZE..=MAX_CHUNK_SIZE).contains(&l)));
        assert!(*last <= MAX_CHUNK_SIZE);
        // about 64 KiB on average
        let mean = data.len() / whole.len();
        assert!((40_000..100_000).contains(&mean), "{mean}");
    }

    #[test]
    fn an_insertion_changes_only_nearby_chunks() {
        let data = bytes(3_000_000, 7);
        let mut edited = data.clone();
        edited.splice(1_500_000..1_500_000, [1, 2, 3]);
        let a = chunk_lengths(&data);
        let b = chunk_lengths(&edited);
        let ends = |l: &[usize]| l.iter().scan(0, |s, x| { *s += x; Some(*s) }).collect::<Vec<_>>();
        let (ea, eb) = (ends(&a), ends(&b));
        let shifted: std::collections::HashSet<usize> =
            eb.iter().filter(|&&e| e > 1_500_000).map(|e| e - 3).collect();
        let kept = ea.iter().filter(|&&e| e <= 1_500_000 || shifted.contains(&e)).count();
        assert!(ea.len() - kept <= 2, "{} of {} boundaries moved", ea.len() - kept, ea.len());
    }
}
