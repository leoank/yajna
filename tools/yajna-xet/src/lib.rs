//! The Xet storage format, written from Hugging Face's specification
//! (huggingface.co/docs/xet, v1.1.0) and checked against xet-core 1.8.0: content-defined
//! chunks, keyed BLAKE3 hashes, xorbs and shards. yajna's data stores are built on it
//! (`docs/data.md`, ADR-0035); it knows bytes, not notebooks or stores.

pub mod chunk;
pub mod compress;
pub mod file;
mod gear;
pub mod hash;
pub mod shard;
pub mod xorb;

pub use hash::Hash;

#[derive(Debug)]
pub enum Error {
    Io(std::io::Error),
    /// bytes that do not follow the format
    Malformed(String),
    /// bytes that do not hash to what names them
    HashMismatch(String),
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Error::Io(e) => write!(f, "{e}"),
            Error::Malformed(s) => write!(f, "malformed: {s}"),
            Error::HashMismatch(s) => write!(f, "hash mismatch: {s}"),
        }
    }
}

impl std::error::Error for Error {}

impl From<std::io::Error> for Error {
    fn from(e: std::io::Error) -> Self {
        Error::Io(e)
    }
}
