//! The cases through xet-core 1.8.0.

use std::path::PathBuf;
use std::sync::Arc;

use sha2::{Digest, Sha256};
use xet_compare::*;
use xet_core_structures::merklehash::{MerkleHash, file_hash};
use xet_core_structures::metadata_shard::chunk_verification::range_hash_from_chunks;
use xet_core_structures::metadata_shard::file_structs::*;
use xet_core_structures::metadata_shard::shard_in_memory::MDBInMemoryShard;
use xet_core_structures::metadata_shard::xorb_structs::MDBXorbInfo;
use xet_core_structures::metadata_shard::MDBShardInfo;
use xet_core_structures::xorb_object::{RawXorbData, SerializedXorbObject};
use xet_data::deduplication::Chunker;

fn main() {
    let csv = std::env::args().nth(1).map(PathBuf::from);
    for name in NAMES {
        let Some(data) = case(name, csv.as_deref()) else { continue };
        let mut r = Record::new(name);
        r.put("size", data.len());
        let chunks = Chunker::default().next_block(&data, true);
        let lens: Vec<usize> = chunks.iter().map(|c| c.data.len()).collect();
        let ends: Vec<u8> = lens.iter().scan(0u64, |s, &l| { *s += l as u64; Some(*s) }).flat_map(|e| e.to_le_bytes()).collect();
        r.put("chunks", chunks.len());
        r.put("boundaries", digest(&ends));
        r.put("chunk_hashes", digest(&chunks.iter().flat_map(|c| c.hash.as_bytes().to_vec()).collect::<Vec<u8>>()));
        let leaves: Vec<(MerkleHash, u64)> = chunks.iter().map(|c| (c.hash, c.data.len() as u64)).collect();
        r.put("file_hash", file_hash(&leaves).hex());
        let sha: [u8; 32] = Sha256::digest(&data).into();

        let mut shard = MDBInMemoryShard::default();
        let mut segments = Vec::new();
        let mut verification = Vec::new();
        let mut xorbs = Vec::new();
        for range in group(&lens) {
            let raw = RawXorbData::from_chunks(&chunks[range.clone()], vec![0]);
            let info: MDBXorbInfo = raw.xorb_info.clone();
            let hash = raw.hash();
            let ser = SerializedXorbObject::from_xorb(raw, true, "auto", 32).expect("serializing a xorb");
            xorbs.push(format!("{}:{}:{}", hash.hex(), ser.serialized_data.len(), digest(&without_nonce(ser.serialized_data))));
            shard.add_xorb_block(Arc::new(info)).expect("adding a xorb");
            segments.push(FileDataSequenceEntry::new(hash, lens[range.clone()].iter().sum::<usize>(), 0, range.len()));
            verification.push(FileVerificationEntry::new(range_hash_from_chunks(&chunks[range].iter().map(|c| c.hash).collect::<Vec<_>>())));
        }
        r.put("xorbs", if xorbs.is_empty() { "-".into() } else { xorbs.join(",") });
        let header = FileDataSequenceHeader::new(file_hash(&leaves), segments.len(), true, true);
        shard
            .add_file_reconstruction_info(MDBFileInfo {
                metadata: header,
                segments,
                verification,
                metadata_ext: Some(FileMetadataExt::new(MerkleHash::from_be_bytes(sha))),
            })
            .expect("adding the file");
        let mut indexed = Vec::new();
        let info = MDBShardInfo::serialize_from(&mut indexed, &shard, None).expect("serializing the shard");
        // the upload form: cut at the lookup tables, footer size 0 (read_shard_to_bytes_remove_footer)
        let mut upload = indexed[..info.metadata.file_lookup_offset as usize].to_vec();
        upload[40..48].fill(0);
        r.put("shard_indexed", digest(&indexed));
        r.put("shard_upload", digest(&upload));
        println!("{}", r.line());
    }
}
