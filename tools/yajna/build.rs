//! Windows gives the main thread 1 MB of stack, which yajna overflows before it prints
//! `--version` (seen in a debug build); link the MSVC binary with 8 MB, Linux's default.

fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    let var = |k: &str| std::env::var(k).unwrap_or_default();
    if var("CARGO_CFG_TARGET_OS") == "windows" && var("CARGO_CFG_TARGET_ENV") == "msvc" {
        println!("cargo:rustc-link-arg-bins=/STACK:8388608");
    }
}
