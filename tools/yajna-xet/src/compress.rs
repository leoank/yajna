//! Chunk compression in xorbs (huggingface.co/docs/xet/xorb): none, an LZ4 frame, or the
//! bytes grouped by position mod 4 then an LZ4 frame (BG4), chosen as xet-core chooses.

use std::io::{Read, Write};

use crate::Error;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(u8)]
pub enum Scheme {
    None = 0,
    Lz4 = 1,
    Bg4Lz4 = 2,
}

impl Scheme {
    pub fn from_u8(b: u8) -> Result<Scheme, Error> {
        match b {
            0 => Ok(Scheme::None),
            1 => Ok(Scheme::Lz4),
            2 => Ok(Scheme::Bg4Lz4),
            _ => Err(Error::Malformed(format!("unknown compression scheme {b}"))),
        }
    }

    /// xet-core's automatic choice: BG4 when the bit counts of the bytes at some position
    /// mod 4 differ from the whole's (Kullback-Leibler divergence above 0.02), else LZ4.
    pub fn choose(data: &[u8]) -> Scheme {
        let mut hist = [[0u32; 9]; 4];
        for (i, &x) in data.iter().enumerate() {
            hist[i % 4][x.count_ones() as usize] += 1;
        }
        let mut base = [1u32; 9];
        let mut totals = [0u32; 4];
        for i in 0..4 {
            for j in 0..9 {
                base[j] += hist[i][j];
                totals[i] += hist[i][j];
            }
        }
        let base_total: u32 = totals.iter().sum();
        let mut max_kl = 0f64;
        for i in 0..4 {
            let mut kl = 0.;
            for j in 0..9 {
                let p = hist[i][j] as f64 / totals[i] as f64;
                let q = base[j] as f64 / base_total as f64;
                kl += p * (p / q).ln();
            }
            // as f64::max in xet-core: a NaN (an empty or zero-count position) is ignored
            max_kl = max_kl.max(kl);
        }
        if max_kl > 0.02 {
            Scheme::Bg4Lz4
        } else {
            Scheme::Lz4
        }
    }

    pub fn compress(self, data: &[u8]) -> Vec<u8> {
        match self {
            Scheme::None => data.to_vec(),
            Scheme::Lz4 => lz4(data),
            Scheme::Bg4Lz4 => lz4(&bg4_split(data)),
        }
    }

    pub fn decompress(self, data: &[u8]) -> Result<Vec<u8>, Error> {
        match self {
            Scheme::None => Ok(data.to_vec()),
            Scheme::Lz4 => unlz4(data),
            Scheme::Bg4Lz4 => Ok(bg4_regroup(&unlz4(data)?)),
        }
    }
}

fn lz4(data: &[u8]) -> Vec<u8> {
    let mut enc = lz4_flex::frame::FrameEncoder::new(Vec::new());
    enc.write_all(data).expect("writing to a Vec");
    enc.finish().expect("finishing an LZ4 frame in a Vec")
}

fn unlz4(data: &[u8]) -> Result<Vec<u8>, Error> {
    let mut out = Vec::new();
    lz4_flex::frame::FrameDecoder::new(data)
        .read_to_end(&mut out)
        .map_err(|e| Error::Malformed(format!("LZ4 frame: {e}")))?;
    Ok(out)
}

/// The sizes of the four groups: the remainder bytes go to the first groups.
fn group_sizes(n: usize) -> [usize; 4] {
    let (split, rem) = (n / 4, n % 4);
    std::array::from_fn(|g| split + usize::from(g < rem))
}

pub(crate) fn bg4_split(data: &[u8]) -> Vec<u8> {
    let sizes = group_sizes(data.len());
    let mut out = Vec::with_capacity(data.len());
    for (g, &size) in sizes.iter().enumerate() {
        out.extend((0..size).map(|i| data[4 * i + g]));
    }
    out
}

pub(crate) fn bg4_regroup(groups: &[u8]) -> Vec<u8> {
    let sizes = group_sizes(groups.len());
    let mut out = vec![0u8; groups.len()];
    let mut start = 0;
    for (g, &size) in sizes.iter().enumerate() {
        for i in 0..size {
            out[4 * i + g] = groups[start + i];
        }
        start += size;
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn byte_grouping_round_trips_with_every_remainder() {
        for n in 0..12 {
            let data: Vec<u8> = (0..n as u8).collect();
            assert_eq!(bg4_regroup(&bg4_split(&data)), data);
        }
        assert_eq!(bg4_split(&[0, 1, 2, 3, 4, 5, 6]), vec![0, 4, 1, 5, 2, 6, 3]);
    }

    #[test]
    fn each_scheme_round_trips() {
        let data: Vec<u8> = (0..100_000u32).flat_map(|i| (i as f32).to_le_bytes()).collect();
        for s in [Scheme::None, Scheme::Lz4, Scheme::Bg4Lz4] {
            assert_eq!(s.decompress(&s.compress(&data)).unwrap(), data);
        }
    }

    #[test]
    fn floats_choose_byte_grouping_and_text_does_not() {
        let floats: Vec<u8> = (0..16_000u32).flat_map(|i| (1.0f32 + i as f32 * 1e-3).to_le_bytes()).collect();
        assert_eq!(Scheme::choose(&floats), Scheme::Bg4Lz4);
        let text = "the quick brown fox jumps over the lazy dog. ".repeat(1000);
        assert_eq!(Scheme::choose(text.as_bytes()), Scheme::Lz4);
    }
}
