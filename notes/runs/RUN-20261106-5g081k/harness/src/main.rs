//! Per data set of RUN-20261106-4vftn2's manifest, as fractions of the input: zstd -3 of
//! each whole file; the unique chunks with Xet's automatic LZ4/BG4 choice; and the unique
//! chunks each compressed alone with zstd at levels 3 and 19 (kept raw when that is not
//! smaller, an 8-byte header each, as a xorb would hold them), with zstd -3's speed.
//!
//!   xet-zstd <manifest.tsv> <data dir>   > zstd.tsv

use std::collections::HashSet;
use std::time::Instant;

use yajna_xet::chunk::chunk_lengths;
use yajna_xet::compress::Scheme;
use yajna_xet::hash::chunk_hash;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let dir = std::path::Path::new(&args[2]);
    let mut sets: Vec<(String, Vec<Vec<u8>>)> = Vec::new();
    for line in std::fs::read_to_string(&args[1]).unwrap().lines().skip(1) {
        let f: Vec<&str> = line.split('\t').collect();
        let set = if f[0].starts_with("imaging-") { "imaging" } else { f[0] };
        let data = std::fs::read(dir.join(f[1])).unwrap();
        match sets.iter_mut().find(|s| s.0 == set) {
            Some(s) => s.1.push(data),
            None => sets.push((set.into(), vec![data])),
        }
    }
    println!("set\tinput_MB\tzstd3_whole\tchunks_lz4_auto\tchunks_zstd3\tchunks_zstd19\tzstd3_MBps");
    for (name, files) in &sets {
        let input: usize = files.iter().map(|f| f.len()).sum();
        let whole: usize = files.iter().map(|f| zstd::bulk::compress(f, 3).unwrap().len()).sum();
        let mut seen = HashSet::new();
        let mut unique: Vec<&[u8]> = Vec::new();
        for f in files {
            let mut at = 0;
            for l in chunk_lengths(f) {
                if seen.insert(chunk_hash(&f[at..at + l])) {
                    unique.push(&f[at..at + l]);
                }
                at += l;
            }
        }
        let per = |c: &[u8], z: Vec<u8>| 8 + z.len().min(c.len());
        let lz4: usize = unique.iter().map(|c| per(c, Scheme::choose(c).compress(c))).sum();
        let t = Instant::now();
        let z3: usize = unique.iter().map(|c| per(c, zstd::bulk::compress(c, 3).unwrap())).sum();
        let mbps = unique.iter().map(|c| c.len()).sum::<usize>() as f64 / 1e6 / t.elapsed().as_secs_f64();
        let z19: usize = unique.iter().map(|c| per(c, zstd::bulk::compress(c, 19).unwrap())).sum();
        let r = |x: usize| format!("{:.3}", x as f64 / input as f64);
        println!("{name}\t{:.1}\t{}\t{}\t{}\t{}\t{mbps:.0}", input as f64 / 1e6, r(whole), r(lz4), r(z3), r(z19));
    }
}
