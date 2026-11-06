//! The cases through tools/yajna-xet, and Hugging Face's reference xorb and shard read
//! with it.

use std::collections::HashMap;
use std::path::PathBuf;

use xet_compare::*;
use yajna_xet::file::{reconstruct, Packer};
use yajna_xet::hash::{chunk_hash, file_hash};
use yajna_xet::shard::{Layout, Shard, XorbInfo};
use yajna_xet::xorb::{self, Compression, Xorb};

fn main() {
    let csv = std::env::args().nth(1).map(PathBuf::from);
    for name in NAMES {
        let Some(data) = case(name, csv.as_deref()) else { continue };
        let mut r = Record::new(name);
        r.put("size", data.len());
        let lens = yajna_xet::chunk::chunk_lengths(&data);
        let mut at = 0;
        let leaves: Vec<_> = lens
            .iter()
            .map(|&l| {
                let h = chunk_hash(&data[at..at + l]);
                at += l;
                (h, l as u64)
            })
            .collect();
        let ends: Vec<u8> = lens.iter().scan(0u64, |s, &l| { *s += l as u64; Some(*s) }).flat_map(|e| e.to_le_bytes()).collect();
        r.put("chunks", lens.len());
        r.put("boundaries", digest(&ends));
        r.put("chunk_hashes", digest(&leaves.iter().flat_map(|l| l.0 .0).collect::<Vec<u8>>()));
        r.put("file_hash", file_hash(&leaves).hex());

        let mut xorbs: Vec<Xorb> = Vec::new();
        let mut p = Packer::new(Compression::Auto, |x: Xorb| {
            xorbs.push(x);
            Ok(())
        });
        p.add(&data[..]).expect("packing");
        let file = p.finish().expect("finishing").remove(0);
        r.put(
            "xorbs",
            if xorbs.is_empty() {
                "-".into()
            } else {
                xorbs.iter().map(|x| format!("{}:{}:{}", x.footer.hash.hex(), x.bytes.len(), digest(&without_nonce(x.bytes.clone())))).collect::<Vec<_>>().join(",")
            },
        );
        let mut shard = Shard::default();
        for x in &xorbs {
            // xet-core's client leaves the serialized size at 0 in the shards it writes
            shard.xorbs.insert(x.footer.hash, XorbInfo::from_footer(&x.footer, 0));
        }
        shard.files.insert(file.hash, file.clone());
        r.put("shard_indexed", digest(&shard.to_bytes(Layout::Indexed)));
        r.put("shard_upload", digest(&shard.to_bytes(Layout::Upload)));
        // and back
        let by_hash: HashMap<_, _> = xorbs.iter().map(|x| (x.footer.hash, x.bytes.clone())).collect();
        let mut out = Vec::new();
        reconstruct(&file, |h| Ok(by_hash[h].clone()), &mut out).expect("reconstructing");
        assert!(out == data, "{name} did not come back");
        println!("{}", r.line());
    }
    // Hugging Face's reference xorb, read with our code, rebuilds the CSV from the reference shard
    if let (Some(csv), Some(xorb_path), Some(shard_path)) = (csv, std::env::args().nth(2), std::env::args().nth(3)) {
        let data = std::fs::read(&csv).unwrap();
        let reference = std::fs::read(&xorb_path).unwrap();
        let shard = Shard::parse(&std::fs::read(&shard_path).unwrap()).unwrap();
        let file = shard.files.values().next().unwrap();
        let term = &file.terms[0];
        // the reference file holds 796 chunks and then 4 bytes, "XETB": the start of a footer
        // ident, cut off. Its chunks are what is checked; the stray bytes are reported.
        let stray = reference.len() >= 4 && reference[reference.len() - 4..] == *b"XETB";
        let chunks = if stray { &reference[..reference.len() - 4] } else { &reference[..] };
        let with_footer = match xorb::Footer::parse(chunks) {
            Ok(_) => chunks.to_vec(),
            Err(_) => xorb::add_footer(chunks, &term.xorb).expect("adding the footer to the reference xorb"),
        };
        let footer = xorb::verify(&with_footer).expect("verifying the reference xorb");
        let mut out = Vec::new();
        reconstruct(file, |_| Ok(with_footer.clone()), &mut out).expect("reconstructing the reference CSV");
        let mut r = Record::new("reference-xorb");
        r.put("had_footer", xorb::Footer::parse(&reference).is_ok());
        r.put("stray_tail", stray);
        r.put("chunks", footer.num_chunks());
        r.put("rebuilds_csv", out == data);
        r.put("bytes", digest(&without_nonce(with_footer)));
        println!("{}", r.line());
    }
}
