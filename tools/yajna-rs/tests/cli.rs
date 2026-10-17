//! End-to-end checks of the binary against a throwaway vault. These mirror the Python
//! CLI's test suite; parity between the two is judged by them.

use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};

struct Vault {
    _dir: tempfile::TempDir,
    root: PathBuf,
}

fn vault() -> Vault {
    let dir = tempfile::tempdir().unwrap();
    let root = dir.path().to_path_buf();
    for d in [
        "projects",
        "protocols",
        "materials",
        "equipment",
        "builds",
        "agents",
        "log",
        "references",
    ] {
        fs::create_dir_all(root.join("lab").join(d)).unwrap();
    }
    fs::write(
        root.join("lab/counters.yaml"),
        "PRJ: 0\nEXP: 0\nPRO: 0\nMAT: 0\nANA: 0\nEQP: 0\nBLD: 0\n",
    )
    .unwrap();
    fs::write(root.join("lab/tasks.md"), "# Tasks\n\n- [ ] \n").unwrap();
    fs::write(
        root.join("yajna.toml"),
        "author = \"tester\"\nvault = \"lab\"\ntimezone = \"UTC\"\n",
    )
    .unwrap();
    Vault { _dir: dir, root }
}

struct Out {
    code: i32,
    stdout: String,
    stderr: String,
}

impl Vault {
    fn run(&self, args: &[&str]) -> Out {
        self.run_with(args, None, &[])
    }

    fn run_with(&self, args: &[&str], stdin: Option<&str>, env: &[(&str, &str)]) -> Out {
        let mut cmd = Command::new(env!("CARGO_BIN_EXE_yajna"));
        cmd.arg("--root")
            .arg(&self.root)
            .args(args)
            .env_remove("EDITOR")
            .env_remove("YAJNA_ANSWERS");
        for (k, v) in env {
            cmd.env(k, v);
        }
        cmd.stdin(if stdin.is_some() {
            Stdio::piped()
        } else {
            Stdio::null()
        })
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
        let mut child = cmd.spawn().unwrap();
        if let Some(text) = stdin {
            child
                .stdin
                .take()
                .unwrap()
                .write_all(text.as_bytes())
                .unwrap();
        }
        let out = child.wait_with_output().unwrap();
        Out {
            code: out.status.code().unwrap_or(-1),
            stdout: String::from_utf8_lossy(&out.stdout).into_owned(),
            stderr: String::from_utf8_lossy(&out.stderr).into_owned(),
        }
    }

    fn path(&self, out: &Out) -> PathBuf {
        self.root.join(out.stdout.lines().next().unwrap().trim())
    }

    fn read(&self, p: &Path) -> String {
        fs::read_to_string(p).unwrap()
    }
}

#[test]
fn new_log_result_tasks_validate() {
    let v = vault();
    let out = v.run(&["new", "project", "Archaeal division"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("PRJ-0001-archaeal-division/README.md"));

    let out = v.run(&["new", "experiment", "ESCRT timing", "--project", "PRJ-0001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("experiments/EXP-0001-escrt-timing.md"));

    assert_eq!(
        v.run(&["new", "material", "Strain xyz", "--kind", "strain"])
            .code,
        0
    );
    let out = v.run(&["new", "protocol", "Transformation"]);
    assert_eq!(out.code, 0);
    let pro = v.path(&out);
    let text = v.read(&pro).replace(
        "1. First step. {duration: 5m}\n2. \n",
        "1. Thaw [[MAT-0001]] on ice. {duration: 15m, materials: [MAT-0001], check: \"tube on ice\"}\n2. Spin at 4000 g. {duration: 10m, wait: true}\n3. Plain step with no attributes.\n",
    );
    fs::write(&pro, text).unwrap();

    let out = v.run(&["new", "run", "--experiment", "EXP-0001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let re = regex_lite(&out.stdout, "runs/RUN-");
    assert!(re, "{}", out.stdout);
    let run = v.path(&out);
    assert!(v.read(&run).contains("experiment: EXP-0001"));

    let out = v.run(&[
        "log",
        "Started",
        "induction",
        "for",
        "[[EXP-0001]]",
        "--time",
        "09:10",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let day = walk(&v.root.join("lab/log"))
        .into_iter()
        .find(|p| p.extension().map(|e| e == "md").unwrap_or(false))
        .unwrap();
    assert!(v
        .read(&day)
        .contains("- 09:10 Started induction for [[EXP-0001]]\n"));

    let output =
        "training...\n===RESULT=== {\"loss\": 0.42, \"steps\": 3000, \"tag\": \"baseline\"}\n";
    let out = v.run_with(&["result", "--experiment", "EXP-0001"], Some(output), &[]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let tsv = v
        .root
        .join("lab/projects/PRJ-0001-archaeal-division/experiments/EXP-0001/results.tsv");
    assert!(tsv.is_file());
    let run_page = v.path(&out);
    let page = v.read(&run_page);
    assert!(page.contains("status: done\n"), "{page}");
    assert!(page.contains("| loss | 0.42 |"), "{page}");
    let out = v.run_with(
        &["result", "--experiment", "EXP-0001"],
        Some("===RESULT=== {\"loss\": 0.40, \"steps\": 3000, \"lr\": 0.001}\n"),
        &[],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    let tsv_text = v.read(&tsv);
    let lines: Vec<&str> = tsv_text.lines().collect();
    assert_eq!(
        lines[0].split('\t').collect::<Vec<_>>(),
        vec!["run", "finished", "loss", "steps", "tag", "lr"]
    );
    assert_eq!(lines.len(), 3);
    assert!(lines[1].ends_with("baseline\t"), "{}", lines[1]);

    let out = v.run(&["tasks"]);
    assert_eq!(out.code, 0);
    assert!(!out.stdout.contains("counters"));

    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(out.stdout.contains("valid"));
}

#[test]
fn validate_catches_problems() {
    let v = vault();
    v.run(&["new", "project", "P"]);
    let out = v.run(&["new", "experiment", "E", "--project", "PRJ-0001"]);
    let exp = v.path(&out);
    fs::write(
        &exp,
        v.read(&exp)
            .replace("status: planned", "status: bogus")
            .replace("materials: []", "materials: [MAT-0099]"),
    )
    .unwrap();
    let out = v.run(&["new", "protocol", "Bad steps"]);
    let pro = v.path(&out);
    fs::write(
        &pro,
        v.read(&pro).replace(
            "1. First step. {duration: 5m}\n2. \n",
            "1. Ok. {duration: 5m}\n3. Skipped number. {duration: nonsense}\n",
        ),
    )
    .unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stdout.contains("status:") && out.stdout.contains("is not one of"),
        "{}",
        out.stdout
    );
    assert!(
        out.stdout.contains("link to unknown id MAT-0099"),
        "{}",
        out.stdout
    );
    assert!(
        out.stdout.contains("step numbering: expected 2, found 3"),
        "{}",
        out.stdout
    );
    assert!(out.stdout.contains("duration"), "{}", out.stdout);
}

#[test]
fn title_with_colon_and_unfinished_agent_page() {
    let v = vault();
    v.run(&["new", "project", "P"]);
    let out = v.run(&[
        "new",
        "experiment",
        "Ratio: a vs b",
        "--project",
        "PRJ-0001",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(v.read(&v.path(&out)).contains("title: \"Ratio: a vs b\"\n"));
    let out = v.run(&["new", "agent", "Plate layout"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(v.read(&v.path(&out)).contains("finished: null"));
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
}

#[test]
fn interactive_new() {
    let v = vault();
    v.run(&["new", "project", "P"]);
    let out = v.run_with(
        &["new"],
        None,
        &[("YAJNA_ANSWERS", "experiment\nInteractive one\nPRJ-0001")],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout
            .contains("experiments/EXP-0001-interactive-one.md"),
        "{}",
        out.stdout
    );
    let out = v.run_with(
        &["new"],
        None,
        &[("YAJNA_ANSWERS", "run\nEXP-0001\ncompute")],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("runs/RUN-"));
    let run = v.read(&v.path(&out));
    assert!(run.contains("kind: compute"));
    assert!(run.contains("experiment: EXP-0001"));
    // The scripted answer for a run's kind may be empty: the default (first enum value) wins.
    let out = v.run_with(&["new"], None, &[("YAJNA_ANSWERS", "run\nEXP-0001\n")]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(v.read(&v.path(&out)).contains("kind: bench"));
}

#[test]
fn interactive_project_with_code() {
    let v = vault();
    let out = v.run_with(
        &["new"],
        None,
        &[("YAJNA_ANSWERS", "project\nToy model\ny")],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("PRJ-0001-toy-model/README.md"));
    assert!(v.read(&v.path(&out)).contains("code: projects/toy-model"));
    assert!(v.root.join("projects/toy-model/flake.nix").is_file());
}

#[test]
fn ref_and_citation_check() {
    let v = vault();
    fs::create_dir_all(v.root.join("references")).unwrap();
    fs::write(
        v.root.join("references/library.bib"),
        "@article{shih2015cloning,\n  title = {Cloning on a {Chip}},\n  author = {Shih, Steve and Goyal, Garima},\n  year = {2015},\n  doi = {10.1021/acs.analchem.5b01905},\n  journal = {Analytical Chemistry}\n}\n",
    )
    .unwrap();
    fs::write(v.root.join("yajna.toml"), "author = \"tester\"\nvault = \"lab\"\ntimezone = \"UTC\"\nbibliography = \"references/library.bib\"\n").unwrap();
    let out = v.run(&["ref", "shih2015cloning", "--note"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("Cloning on a Chip"), "{}", out.stdout);
    let note = v.root.join("lab/references/shih2015cloning.md");
    assert!(note.is_file());
    let text = v.read(&note);
    assert!(text.contains("doi: 10.1021/acs.analchem.5b01905"));
    assert!(text.contains("year: 2015"));
    fs::write(
        &note,
        text.replace("[[PRJ-0001]]", "") + "\nBuilds on [@shih2015cloning] and @nobody2020.\n",
    )
    .unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stdout
            .contains("citation @nobody2020 not in references/library.bib"),
        "{}",
        out.stdout
    );
    assert!(!out.stdout.contains("shih2015cloning not in"));
    assert_eq!(v.run(&["ref", "nobody2020"]).code, 1);
}

#[test]
fn project_code_scaffold() {
    let v = vault();
    fs::write(
        v.root.join("flake.nix"),
        "{\n# projects: registered by yajna new project --code\n}\n",
    )
    .unwrap();
    let out = v.run(&["new", "project", "Toy model", "--code"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let flake = v.read(&v.root.join("flake.nix"));
    assert!(
        flake.contains(
            "inputs.toy-model = { url = \"path:./projects/toy-model\"; inputs.nixpkgs.follows"
        ),
        "{flake}"
    );
    assert!(v
        .read(&v.root.join("projects/toy-model/flake.nix"))
        .contains("flake-parts"));
    let page = v.read(&v.path(&out));
    assert!(page.contains("code: projects/toy-model"));
    let readme = v.read(&v.root.join("projects/toy-model/README.md"));
    assert!(readme.contains("[[PRJ-0001]]"));
    assert!(readme.contains("lab/projects/PRJ-0001-toy-model/README.md"));
    assert_eq!(v.run(&["validate"]).code, 0);
    fs::remove_dir_all(v.root.join("projects/toy-model")).unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1);
    assert!(out
        .stdout
        .contains("code directory projects/toy-model does not exist"));
    assert_eq!(v.run(&["new", "protocol", "P", "--code"]).code, 1);
}

#[test]
fn missing_project_is_an_error() {
    let v = vault();
    let out = v.run(&["new", "experiment", "E", "--project", "PRJ-0042"]);
    assert_eq!(out.code, 1);
    assert!(out.stderr.contains("PRJ-0042"));
    let out = v.run(&["new", "experiment", "E"]);
    assert_eq!(out.code, 1);
    assert!(out.stderr.contains("--project"));
}

#[test]
fn namespaced_links_need_a_registered_repo() {
    let v = vault();
    v.run(&["new", "project", "P"]);
    let out = v.run(&["new", "experiment", "E", "--project", "PRJ-0001"]);
    let exp = v.path(&out);
    fs::write(
        &exp,
        v.read(&exp) + "\nSee [[rc2s2/EXP-0003]] and [[yajna/PRO-0012@2]].\n",
    )
    .unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stdout.contains("namespace rc2s2 not in [repos]"),
        "{}",
        out.stdout
    );
    fs::write(v.root.join("yajna.toml"), "author = \"tester\"\nvault = \"lab\"\ntimezone = \"UTC\"\n[repos]\nrc2s2 = \"github:leoank/rc2s2\"\nyajna = \"github:leoank/yajna\"\n").unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
}

fn walk(dir: &Path) -> Vec<PathBuf> {
    let mut out = Vec::new();
    if let Ok(rd) = fs::read_dir(dir) {
        for e in rd.flatten() {
            let p = e.path();
            if p.is_dir() {
                out.extend(walk(&p));
            } else {
                out.push(p);
            }
        }
    }
    out
}

fn regex_lite(text: &str, needle: &str) -> bool {
    text.contains(needle) && text.trim().ends_with(".md")
}
