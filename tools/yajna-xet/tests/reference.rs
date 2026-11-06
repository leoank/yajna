//! Hugging Face's Xet reference files (tests/fixtures/README.md): our chunker, hashes and
//! shard serialization against what xet-core wrote.

use std::fs;
use std::path::PathBuf;

use yajna_xet::chunk::chunk_lengths;
use yajna_xet::hash::{chunk_hash, file_hash, verification_hash, xorb_hash};
use yajna_xet::shard::{Layout, Shard};
use yajna_xet::Hash;

const CSV: &str = "Electric_Vehicle_Population_Data_20250917.csv";

fn fixture(name: &str) -> Vec<u8> {
    let p = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests/fixtures").join(name);
    fs::read(&p).unwrap_or_else(|e| panic!("{}: {e}", p.display()))
}

fn text(name: &str) -> String {
    String::from_utf8(fixture(name)).unwrap().trim().to_string()
}

/// The `.chunks` list: a chunk hash and its length per line.
fn chunks() -> Vec<(Hash, u64)> {
    text(&format!("{CSV}.chunks"))
        .lines()
        .map(|l| {
            let (h, n) = l.split_once(' ').unwrap();
            (Hash::from_hex(h).unwrap(), n.parse().unwrap())
        })
        .collect()
}

#[test]
fn chunk_hashes_and_boundaries_of_the_first_chunks() {
    let names = [
        "b10aa1dc71c61661de92280c41a188aabc47981739b785724a099945d8dc5ce4",
        "26255591fa803b6baf25d88c315b8a6f5153d5bcfdf18ec5ef526264e0ccc907",
        "099cb228194fe640e36a6c7d274ee5ed3a714ccd557a0951d9b6b43a7292b5d1",
    ];
    let mut joined = Vec::new();
    for n in names {
        let data = fixture(&format!("{n}.chunk"));
        assert_eq!(chunk_hash(&data).hex(), n);
        joined.extend(data);
    }
    // the boundaries depend only on the bytes before them
    assert_eq!(chunk_lengths(&joined), vec![131072, 106099, 61389]);
    let list = chunks();
    assert_eq!(list[..3].iter().map(|c| c.0.hex()).collect::<Vec<_>>(), names);
}

#[test]
fn file_xorb_and_range_hashes_from_the_chunk_list() {
    let list = chunks();
    assert_eq!(list.iter().map(|c| c.1).sum::<u64>(), 63_527_244);
    assert_eq!(file_hash(&list).hex(), text(&format!("{CSV}.xet-file-hash")));
    assert_eq!(xorb_hash(&list).hex(), text(&format!("{CSV}.xet-xorb-hash")));
    let hashes: Vec<Hash> = list.iter().map(|c| c.0).collect();
    assert_eq!(
        verification_hash(&hashes).hex(),
        text("eea25d6ee393ccae385820daed127b96ef0ea034dfb7cf6da3a950ce334b7632.xorb.range-hash")
    );
}

#[test]
fn shards_parse_and_serialize_back_byte_for_byte() {
    for (name, layout) in [
        ("shard", Layout::Stored),
        ("shard.verification", Layout::Stored),
        ("shard.dedupe", Layout::Stored),
        ("shard.verification-no-footer", Layout::Upload),
    ] {
        let bytes = fixture(&format!("{CSV}.{name}"));
        let shard = Shard::parse(&bytes).unwrap_or_else(|e| panic!("{name}: {e}"));
        let ours = shard.to_bytes(layout);
        let at = ours.iter().zip(&bytes).position(|(a, b)| a != b);
        assert!(ours == bytes, "{name}: lengths {} and {}, first difference at {at:?} of {}", ours.len(), bytes.len(), bytes.len());
    }
    let with = Shard::parse(&fixture(&format!("{CSV}.shard.verification"))).unwrap();
    assert!(with.to_bytes(Layout::Upload) == fixture(&format!("{CSV}.shard.verification-no-footer")));
    let file = &with.files[&Hash::from_hex(&text(&format!("{CSV}.xet-file-hash"))).unwrap()];
    assert_eq!(file.size(), 63_527_244);
    // the sha256 Hugging Face lists for the CSV (its git LFS oid)
    assert_eq!(file.sha256.unwrap().hex(), "f41255b252f776125f2b657136654e4d4d5d2ccf8ef4db0ec186bd1981b69734");
    let list = chunks();
    let hashes: Vec<Hash> = list.iter().map(|c| c.0).collect();
    let v = file.verification.as_ref().unwrap();
    for (t, vh) in file.terms.iter().zip(v) {
        assert_eq!(verification_hash(&hashes[t.start as usize..t.end as usize]), *vh);
    }
}

#[test]
fn a_global_dedup_answer_matches_keyed_chunk_hashes() {
    let shard = Shard::parse(&fixture(&format!("{CSV}.shard.dedupe"))).unwrap();
    assert_eq!(shard.chunk_key.hex(), "1234567812345678123456781234567812345678123456781234567812345678");
    let xorb = shard.xorbs.values().next().unwrap();
    let list = chunks();
    assert_eq!(xorb.chunks.len(), list.len());
    for (entry, (h, len)) in xorb.chunks.iter().zip(&list) {
        assert_eq!(entry.hash, h.keyed(&shard.chunk_key));
        assert_eq!(entry.len as u64, *len);
    }
}
