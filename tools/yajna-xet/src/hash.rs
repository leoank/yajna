//! Hashes (huggingface.co/docs/xet/hashing): 32-byte keyed BLAKE3 digests, compared and
//! printed as four little-endian u64 words, as xet-core does.

use std::cmp::Ordering;
use std::fmt;

const DATA_KEY: [u8; 32] = [
    102, 151, 245, 119, 91, 149, 80, 222, 49, 53, 203, 172, 165, 151, 24, 28, 157, 228, 33, 16, 155,
    235, 43, 88, 180, 208, 176, 75, 147, 173, 242, 41,
];
const INTERNAL_NODE_KEY: [u8; 32] = [
    1, 126, 197, 199, 165, 71, 41, 150, 253, 148, 102, 102, 180, 138, 2, 230, 93, 221, 83, 111, 55,
    199, 109, 210, 248, 99, 82, 230, 74, 83, 113, 63,
];
const VERIFICATION_KEY: [u8; 32] = [
    127, 24, 87, 214, 206, 86, 237, 102, 18, 127, 249, 19, 231, 165, 195, 243, 164, 205, 38, 213,
    181, 219, 73, 230, 65, 36, 152, 127, 40, 251, 148, 195,
];

/// A chunk, xorb, file, verification or shard hash.
#[derive(Clone, Copy, PartialEq, Eq, Hash, Default)]
pub struct Hash(pub [u8; 32]);

impl Hash {
    /// The four little-endian u64 words the hash is read as.
    pub fn words(&self) -> [u64; 4] {
        let w = |i: usize| u64::from_le_bytes(self.0[i * 8..i * 8 + 8].try_into().unwrap());
        [w(0), w(1), w(2), w(3)]
    }

    /// The spec's string form: each word as 16 hex digits.
    pub fn hex(&self) -> String {
        let w = self.words();
        format!("{:016x}{:016x}{:016x}{:016x}", w[0], w[1], w[2], w[3])
    }

    pub fn from_hex(s: &str) -> Option<Hash> {
        if s.len() != 64 || !s.bytes().all(|b| b.is_ascii_hexdigit()) {
            return None;
        }
        let mut out = [0u8; 32];
        for i in 0..4 {
            let w = u64::from_str_radix(&s[i * 16..i * 16 + 16], 16).ok()?;
            out[i * 8..i * 8 + 8].copy_from_slice(&w.to_le_bytes());
        }
        Some(Hash(out))
    }

    /// The last word modulo `n`: the cut rule of the hash tree and global dedup eligibility.
    pub fn rem(&self, n: u64) -> u64 {
        self.words()[3] % n
    }

    /// The first word: the key of a shard's lookup tables.
    pub fn truncated(&self) -> u64 {
        self.words()[0]
    }

    /// BLAKE3 keyed with `key` over this hash (the spec's "HMAC").
    pub fn keyed(&self, key: &Hash) -> Hash {
        Hash(*blake3::keyed_hash(&key.0, &self.0).as_bytes())
    }

    /// A sha256 digest as a shard stores it: each 8-byte word big-endian, so that its
    /// string form is the usual sha256 hex (xet-core's `Sha256::from_be_bytes`).
    pub fn from_sha256(digest: [u8; 32]) -> Hash {
        let mut out = digest;
        for w in out.chunks_mut(8) {
            w.reverse();
        }
        Hash(out)
    }

    /// Chunks eligible for the global dedup query: one in 1024, by hash.
    pub fn global_dedup_eligible(&self) -> bool {
        self.rem(1024) == 0
    }
}

/// Ordered by words, as xet-core's `[u64; 4]`, which orders a shard's sections.
impl Ord for Hash {
    fn cmp(&self, other: &Self) -> Ordering {
        self.words().cmp(&other.words())
    }
}

impl PartialOrd for Hash {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl fmt::Display for Hash {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.hex())
    }
}

impl fmt::Debug for Hash {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.hex())
    }
}

/// A chunk's hash.
pub fn chunk_hash(data: &[u8]) -> Hash {
    Hash(*blake3::keyed_hash(&DATA_KEY, data).as_bytes())
}

/// The verification hash of a term: over the raw hashes of its chunks.
pub fn verification_hash(chunks: &[Hash]) -> Hash {
    let mut h = blake3::Hasher::new_keyed(&VERIFICATION_KEY);
    for c in chunks {
        h.update(&c.0);
    }
    Hash(*h.finalize().as_bytes())
}

/// The root of the content-defined hash tree over `(hash, size)` leaves: a xorb's hash.
pub fn xorb_hash(leaves: &[(Hash, u64)]) -> Hash {
    if leaves.is_empty() {
        return Hash::default();
    }
    let mut level = leaves.to_vec();
    while level.len() > 1 {
        let mut next = Vec::with_capacity(level.len() / 4 + 1);
        let mut at = 0;
        while at < level.len() {
            let end = at + next_cut(&level[at..]);
            next.push(merge(&level[at..end]));
            at = end;
        }
        level = next;
    }
    level[0].0
}

/// A file's hash: the tree's root keyed once more with a zero key; zero for an empty file.
pub fn file_hash(chunks: &[(Hash, u64)]) -> Hash {
    if chunks.is_empty() {
        return Hash::default();
    }
    xorb_hash(chunks).keyed(&Hash::default())
}

/// Where the group starting at `nodes[0]` ends: after a node whose hash is 0 mod 4, from
/// the third node on, and after at most nine; two or fewer nodes merge together.
fn next_cut(nodes: &[(Hash, u64)]) -> usize {
    if nodes.len() <= 2 {
        return nodes.len();
    }
    let end = nodes.len().min(9);
    for (i, node) in nodes.iter().enumerate().take(end).skip(2) {
        if node.0.rem(4) == 0 {
            return i + 1;
        }
    }
    end
}

fn merge(nodes: &[(Hash, u64)]) -> (Hash, u64) {
    let mut text = String::with_capacity(nodes.len() * 88);
    let mut size = 0u64;
    for (h, s) in nodes {
        text.push_str(&h.hex());
        text.push_str(" : ");
        text.push_str(&s.to_string());
        text.push('\n');
        size += s;
    }
    (Hash(*blake3::keyed_hash(&INTERNAL_NODE_KEY, text.as_bytes()).as_bytes()), size)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hex_is_little_endian_words() {
        let h = Hash(std::array::from_fn(|i| i as u8));
        // the spec's example (huggingface.co/docs/xet/api prints it with "10" missing)
        assert_eq!(h.hex(), "07060504030201000f0e0d0c0b0a090817161514131211101f1e1d1c1b1a1918");
        assert_eq!(Hash::from_hex(&h.hex()), Some(h));
        assert_eq!(Hash::from_hex("xyz"), None);
    }

    #[test]
    fn empty_inputs_hash_to_zero() {
        assert_eq!(xorb_hash(&[]), Hash::default());
        assert_eq!(file_hash(&[]), Hash::default());
    }

    #[test]
    fn one_leaf_is_its_own_root_and_the_file_hash_is_keyed() {
        let c = chunk_hash(b"hello");
        assert_eq!(xorb_hash(&[(c, 5)]), c);
        assert_eq!(file_hash(&[(c, 5)]), c.keyed(&Hash::default()));
    }
}
