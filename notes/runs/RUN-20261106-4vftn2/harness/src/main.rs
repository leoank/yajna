//! For each data set (files in order, as versions or sessions are added to a store), what
//! would be stored: whole files (git-annex), zstd -3 of each whole file, the unique chunks
//! uncompressed, and the unique chunks packed into xorbs with LZ4, with BG4 and with the
//! automatic choice. Plus chunk-and-hash speed, ours and xet-core's, single-threaded.
//!
//!   xet-dedup <manifest.tsv> <data dir>   > measurements.tsv

use std::collections::{HashMap, HashSet};
use std::time::Instant;

use sha2::{Digest, Sha256};
use yajna_xet::chunk::chunk_lengths;
use yajna_xet::compress::Scheme;
use yajna_xet::hash::{chunk_hash, Hash};
use yajna_xet::xorb::{self, Compression, MAX_XORB_BYTES, MAX_XORB_CHUNKS};

fn rng(seed: u64, n: usize) -> Vec<u8> {
    let mut x = seed.wrapping_mul(0x9E37_79B9_7F4A_7C15) | 1;
    (0..n).map(|_| { x ^= x << 13; x ^= x >> 7; x ^= x << 17; (x >> 24) as u8 }).collect()
}

/// Versions of a CSV made the way tables change: rows appended, rows edited in place, rows
/// deleted, all at seeded positions.
fn csv_versions(base: &[u8]) -> Vec<(String, Vec<u8>)> {
    let text = std::str::from_utf8(base).expect("utf-8 CSV");
    let mut lines: Vec<&str> = text.lines().collect();
    let header = lines.remove(0);
    let join = |rows: &[String]| {
        let mut s = String::from(header);
        s.push('\n');
        for r in rows {
            s.push_str(r);
            s.push('\n');
        }
        s.into_bytes()
    };
    let rows: Vec<String> = lines.iter().map(|s| s.to_string()).collect();
    let pick = |seed: u64, n: usize| -> Vec<usize> {
        rng(seed, n * 8).chunks(8).map(|b| u64::from_le_bytes(b.try_into().unwrap()) as usize % rows.len()).collect()
    };
    let mut appended = rows.clone();
    appended.extend(pick(11, rows.len() / 100).into_iter().map(|i| rows[i].clone()));
    let mut edited = appended.clone();
    for i in pick(12, 100) {
        edited[i] = edited[i].replacen(',', ",EDITED ", 1);
    }
    let gone: HashSet<usize> = pick(13, rows.len() / 100).into_iter().collect();
    let deleted: Vec<String> = edited.iter().enumerate().filter(|(i, _)| !gone.contains(i)).map(|(_, r)| r.clone()).collect();
    vec![
        ("ev-population.csv".into(), base.to_vec()),
        ("+1% rows appended".into(), join(&appended)),
        ("+100 rows edited".into(), join(&edited)),
        ("-1% rows deleted".into(), join(&deleted)),
    ]
}

struct Totals {
    input: u64,
    whole: u64,
    zstd: u64,
    unique: u64,
    lz4: u64,
    bg4: u64,
    auto: u64,
    bg4_chosen: f64,
    added_after_first: Vec<f64>,
    ours_mbs: f64,
    xetcore_mbs: f64,
}

fn measure(files: &[(String, Vec<u8>)]) -> Totals {
    let input: u64 = files.iter().map(|f| f.1.len() as u64).sum();
    let mut seen_files = HashSet::new();
    let (mut whole, mut zstd_total) = (0u64, 0u64);
    for (_, d) in files {
        if seen_files.insert(<[u8; 32]>::from(Sha256::digest(d))) {
            whole += d.len() as u64;
            zstd_total += zstd::bulk::compress(d, 3).unwrap().len() as u64;
        }
    }
    // unique chunks in order of first appearance, and what each file adds
    let mut seen: HashMap<Hash, ()> = HashMap::new();
    let mut unique_chunks: Vec<&[u8]> = Vec::new();
    let mut added = Vec::new();
    let t = Instant::now();
    for (_, d) in files {
        let mut at = 0;
        let mut new = 0u64;
        for l in chunk_lengths(d) {
            let c = &d[at..at + l];
            at += l;
            if seen.insert(chunk_hash(c), ()).is_none() {
                unique_chunks.push(c);
                new += l as u64;
            }
        }
        added.push(new as f64 / d.len().max(1) as f64);
    }
    let ours_mbs = input as f64 / 1e6 / t.elapsed().as_secs_f64();
    let t = Instant::now();
    for (_, d) in files {
        let chunks = xet_data::deduplication::Chunker::default().next_block(d, true);
        std::hint::black_box(chunks.len());
    }
    let xetcore_mbs = input as f64 / 1e6 / t.elapsed().as_secs_f64();
    let unique: u64 = unique_chunks.iter().map(|c| c.len() as u64).sum();
    let pack = |compression: Compression| -> u64 {
        let mut total = 0u64;
        let (mut start, mut bytes) = (0usize, 0usize);
        let mut flush = |range: std::ops::Range<usize>| {
            if !range.is_empty() {
                total += xorb::serialize(&unique_chunks[range], &[0], compression, true).unwrap().bytes.len() as u64;
            }
        };
        for (i, c) in unique_chunks.iter().enumerate() {
            if bytes + c.len() > MAX_XORB_BYTES || i - start + 1 > MAX_XORB_CHUNKS {
                flush(start..i);
                start = i;
                bytes = 0;
            }
            bytes += c.len();
        }
        flush(start..unique_chunks.len());
        total
    };
    let bg4_chosen = unique_chunks.iter().step_by(32).filter(|c| Scheme::choose(c) == Scheme::Bg4Lz4).count() as f64
        / unique_chunks.iter().step_by(32).count().max(1) as f64;
    Totals {
        input,
        whole,
        zstd: zstd_total,
        unique,
        lz4: pack(Compression::Fixed(Scheme::Lz4)),
        bg4: pack(Compression::Fixed(Scheme::Bg4Lz4)),
        auto: pack(Compression::Auto),
        bg4_chosen,
        added_after_first: added[1..].to_vec(),
        ours_mbs,
        xetcore_mbs,
    }
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let (manifest, dir) = (&args[1], std::path::Path::new(&args[2]));
    let mut sets: Vec<(String, Vec<(String, Vec<u8>)>)> = Vec::new();
    for line in std::fs::read_to_string(manifest).unwrap().lines().skip(1) {
        let f: Vec<&str> = line.split('\t').collect();
        let data = std::fs::read(dir.join(f[1])).unwrap();
        let set = if f[0] == "tables-edits" { "tables-edits" } else { f[0] };
        match sets.iter_mut().find(|s| s.0 == set) {
            Some(s) => s.1.push((f[1].into(), data)),
            None => sets.push((set.into(), vec![(f[1].into(), data)])),
        }
    }
    for s in sets.iter_mut().filter(|s| s.0 == "tables-edits") {
        s.1 = csv_versions(&s.1[0].1);
    }
    // the other sample after the time-lapse: what one sample shares with another
    let both: Vec<(String, Vec<u8>)> = sets.iter().filter(|s| s.0.starts_with("imaging-")).flat_map(|s| s.1.clone()).collect();
    sets.retain(|s| s.0 != "imaging-other-sample");
    sets.push(("imaging-two-samples".into(), both));
    let base = rng(3, 100_000_000);
    let mut edited = base.clone();
    edited[75_000_000..75_065_536].copy_from_slice(&rng(4, 65_536));
    edited.drain(50_000_000..51_048_576);
    edited.insert(25_000_000, 0xAB);
    sets.push(("synthetic-edits".into(), vec![("random-100MB".into(), base), ("edited".into(), edited)]));

    println!("set\tfiles\tinput_MB\twhole_files\tzstd3_whole\tunique_chunks\txorbs_lz4\txorbs_bg4\txorbs_auto\tbg4_chosen\tadded_per_later_file\tchunk_MBps_ours\tchunk_MBps_xetcore");
    let r = |x: u64, input: u64| format!("{:.3}", x as f64 / input as f64);
    let (mut tin, mut twhole, mut tauto) = (0u64, 0u64, 0u64);
    for (name, files) in &sets {
        let t = measure(files);
        tin += t.input;
        twhole += t.whole;
        tauto += t.auto;
        let added = t.added_after_first.iter().map(|a| format!("{a:.3}")).collect::<Vec<_>>().join(",");
        println!(
            "{name}\t{}\t{:.1}\t{}\t{}\t{}\t{}\t{}\t{}\t{:.2}\t{}\t{:.0}\t{:.0}",
            files.len(), t.input as f64 / 1e6, r(t.whole, t.input), r(t.zstd, t.input), r(t.unique, t.input),
            r(t.lz4, t.input), r(t.bg4, t.input), r(t.auto, t.input), t.bg4_chosen,
            if added.is_empty() { "-".into() } else { added }, t.ours_mbs, t.xetcore_mbs
        );
        eprintln!("{name} done");
    }
    eprintln!(
        "===RESULT=== {{\"sets\": {}, \"input_MB\": {:.1}, \"whole_files\": {:.3}, \"xorbs_auto\": {:.3}}}",
        sets.len(), tin as f64 / 1e6, twhole as f64 / tin as f64, tauto as f64 / tin as f64
    );
}
