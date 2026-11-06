//! The cases both binaries run, generated the same way on each side, and the record each
//! prints per case: one line of `key=value` fields, compared field by field by run.sh.

use std::path::Path;

pub const MAX_XORB_BYTES: usize = 64 * 1024 * 1024;
pub const MAX_XORB_CHUNKS: usize = 8 * 1024;

pub fn rng(seed: u64, n: usize) -> Vec<u8> {
    let mut x = seed.wrapping_mul(0x9E37_79B9_7F4A_7C15) | 1;
    (0..n)
        .map(|_| {
            x ^= x << 13;
            x ^= x >> 7;
            x ^= x << 17;
            (x >> 24) as u8
        })
        .collect()
}

pub const NAMES: &[&str] = &[
    "empty", "one-byte", "random-8191", "random-8192", "zeros-128KiB", "zeros-1MiB+3", "random-300MB",
    "edited-300MB", "floats-16MB", "text-16MB", "reference-csv",
];

/// A case's bytes, or None for the reference CSV when it is not at hand.
pub fn case(name: &str, reference_csv: Option<&Path>) -> Option<Vec<u8>> {
    Some(match name {
        "empty" => Vec::new(),
        "one-byte" => vec![0x42],
        "random-8191" => rng(1, 8191),
        "random-8192" => rng(2, 8192),
        "zeros-128KiB" => vec![0; 128 * 1024],
        "zeros-1MiB+3" => vec![0; 1024 * 1024 + 3],
        "random-300MB" => rng(3, 300_000_000),
        "edited-300MB" => {
            let mut d = rng(3, 300_000_000);
            d[250_000_000..250_065_536].copy_from_slice(&rng(4, 65_536));
            d.drain(200_000_000..201_048_576);
            d.insert(100_000_000, 0xAB);
            d
        }
        "floats-16MB" => (0..4_000_000u32).flat_map(|i| (i as f32 * 1e-3).to_le_bytes()).collect(),
        "text-16MB" => {
            let mut s = String::new();
            let mut i = 0u64;
            while s.len() < 16_000_000 {
                s.push_str(&format!("line {i}: the quick brown fox jumps over the lazy dog\n"));
                i += 1;
            }
            s.into_bytes()
        }
        "reference-csv" => std::fs::read(reference_csv?).expect("reading the reference CSV"),
        _ => panic!("unknown case {name}"),
    })
}

/// blake3 of some bytes, short: what the record compares for anything large.
pub fn digest(b: &[u8]) -> String {
    blake3::hash(b).to_hex()[..32].to_string()
}

/// A serialized xorb with its footer's per-upload nonce zeroed (it is outside the hash).
pub fn without_nonce(mut xorb: Vec<u8>) -> Vec<u8> {
    let n = xorb.len();
    if n >= 20 {
        xorb[n - 20..n - 16].fill(0);
    }
    xorb
}

pub struct Record {
    pub fields: Vec<(String, String)>,
}

impl Record {
    pub fn new(case: &str) -> Self {
        Record { fields: vec![("case".into(), case.into())] }
    }
    pub fn put(&mut self, k: &str, v: impl ToString) {
        self.fields.push((k.into(), v.to_string()));
    }
    pub fn line(&self) -> String {
        self.fields.iter().map(|(k, v)| format!("{k}={v}")).collect::<Vec<_>>().join(" ")
    }
}

/// Group chunk indices into xorbs: close one when the next chunk would pass 64 MiB or 8192
/// chunks (the rule tools/yajna-xet's Packer uses; xet-core's session groups the same way
/// for one file).
pub fn group(lens: &[usize]) -> Vec<std::ops::Range<usize>> {
    let mut out = Vec::new();
    let (mut start, mut bytes) = (0, 0);
    for (i, &l) in lens.iter().enumerate() {
        if bytes + l > MAX_XORB_BYTES || i - start + 1 > MAX_XORB_CHUNKS {
            out.push(start..i);
            start = i;
            bytes = 0;
        }
        bytes += l;
    }
    if start < lens.len() {
        out.push(start..lens.len());
    }
    out
}
