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
        fs::create_dir_all(root.join("notes").join(d)).unwrap();
    }
    fs::write(
        root.join("notes/counters.yaml"),
        "PRJ: 0\nEXP: 0\nPRO: 0\nMAT: 0\nANA: 0\nEQP: 0\nBLD: 0\n",
    )
    .unwrap();
    fs::write(root.join("notes/tasks.md"), "# Tasks\n\n- [ ] \n").unwrap();
    fs::write(
        root.join("yajna.toml"),
        "shape = \"lab\"\nnamespace = \"yajna\"\nauthor = \"tester\"\nvault = \"notes\"\ntimezone = \"UTC\"\n",
    )
    .unwrap();
    Vault { _dir: dir, root }
}

/// An empty directory: for `init` and as a graduation target.
fn empty() -> Vault {
    let dir = tempfile::tempdir().unwrap();
    let root = dir.path().canonicalize().unwrap();
    Vault { _dir: dir, root }
}

const BIB: &str = "@article{shih2015cloning,\n  title = {Cloning on a {Chip}},\n  author = {Shih, Steve and Goyal, Garima},\n  year = {2015},\n  doi = {10.1021/acs.analchem.5b01905},\n  journal = {Analytical Chemistry}\n}\n\n@book{other2020,\n  title = {Unrelated},\n  year = {2020}\n}\n";

fn git(root: &Path, args: &[&str]) -> String {
    let out = Command::new("git")
        .arg("-C")
        .arg(root)
        .args(args)
        .env("GIT_AUTHOR_NAME", "t")
        .env("GIT_AUTHOR_EMAIL", "t@example.com")
        .env("GIT_COMMITTER_NAME", "t")
        .env("GIT_COMMITTER_EMAIL", "t@example.com")
        .env("GIT_CONFIG_GLOBAL", "/dev/null")
        .env("GIT_CONFIG_NOSYSTEM", "1")
        .output()
        .unwrap();
    assert!(
        out.status.success(),
        "git {args:?}: {}",
        String::from_utf8_lossy(&out.stderr)
    );
    String::from_utf8_lossy(&out.stdout).into_owned()
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
            .env_remove("YAJNA_ANSWERS")
            .env("YAJNA_CACHE", self.root.join(".cache"));
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
    let day = walk(&v.root.join("notes/log"))
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
        .join("notes/projects/PRJ-0001-archaeal-division/experiments/EXP-0001/results.tsv");
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
    assert!(v.read(&v.path(&out)).contains("code: code/toy-model"));
    assert!(v.root.join("code/toy-model/flake.nix").is_file());
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
    fs::write(v.root.join("yajna.toml"), "author = \"tester\"\nvault = \"notes\"\ntimezone = \"UTC\"\nbibliography = \"references/library.bib\"\n").unwrap();
    let out = v.run(&["ref", "shih2015cloning", "--note"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("Cloning on a Chip"), "{}", out.stdout);
    let note = v.root.join("notes/references/shih2015cloning.md");
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
            "inputs.toy-model = { url = \"path:./code/toy-model\"; inputs.nixpkgs.follows"
        ),
        "{flake}"
    );
    assert!(v
        .read(&v.root.join("code/toy-model/flake.nix"))
        .contains("flake-parts"));
    let page = v.read(&v.path(&out));
    assert!(page.contains("code: code/toy-model"));
    let readme = v.read(&v.root.join("code/toy-model/README.md"));
    assert!(readme.contains("[[PRJ-0001]]"));
    assert!(readme.contains("notes/projects/PRJ-0001-toy-model/README.md"));
    assert_eq!(v.run(&["validate"]).code, 0);
    fs::remove_dir_all(v.root.join("code/toy-model")).unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1);
    assert!(out
        .stdout
        .contains("code directory code/toy-model does not exist"));
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
    fs::write(v.root.join("yajna.toml"), "author = \"tester\"\nvault = \"notes\"\ntimezone = \"UTC\"\n[repos]\nrc2s2 = \"github:leoank/rc2s2\"\nyajna = \"github:leoank/yajna\"\n").unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
}

#[test]
fn init_lab() {
    let v = empty();
    let out = v.run(&["init", "lab", "--namespace", "mylab", "--author", "tester"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(v.root.join("notes/counters.yaml").is_file());
    assert!(v.root.join("notes/protocols").is_dir());
    assert!(v.root.join("references/library.bib").is_file());
    let cfg = v.read(&v.root.join("yajna.toml"));
    assert!(cfg.contains("shape = \"lab\""), "{cfg}");
    assert!(cfg.contains("namespace = \"mylab\""), "{cfg}");
    assert!(cfg.contains("[repos]"), "{cfg}");
    let out = v.run(&["new", "project", "Archaeal division"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(v.read(&v.path(&out)).contains("author: tester"));
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert_eq!(v.run(&["init", "lab"]).code, 1, "a second init must refuse");
}

#[test]
fn init_project_in_a_code_repo() {
    let v = empty();
    fs::write(v.root.join("README.md"), "# toy\n").unwrap();
    let out = v.run(&[
        "init",
        "project",
        "Toy model: a colon",
        "--namespace",
        "toy",
        "--author",
        "tester",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let page = v.read(&v.root.join("notes/README.md"));
    assert!(page.contains("id: PRJ-0001\n"), "{page}");
    assert!(page.contains("title: \"Toy model: a colon\"\n"), "{page}");
    assert!(page.contains("\ncode: .  "), "{page}");
    assert!(v.root.join("notes/references/library.bib").is_file());
    assert!(!v.root.join("notes/projects").exists());
    let cfg = v.read(&v.root.join("yajna.toml"));
    assert!(cfg.contains("shape = \"project\""), "{cfg}");
    assert!(
        cfg.contains("bibliography = \"notes/references/library.bib\""),
        "{cfg}"
    );

    // no --project needed: the repo's one project is implied
    let out = v.run(&["new", "experiment", "Timing"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert_eq!(out.stdout.trim(), "notes/experiments/EXP-0001-timing.md");
    assert!(v.read(&v.path(&out)).contains("project: PRJ-0001\n"));
    let out = v.run(&[
        "new",
        "run",
        "--experiment",
        "EXP-0001",
        "--kind",
        "compute",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.starts_with("notes/runs/RUN-"), "{}", out.stdout);
    let out = v.run_with(
        &["result", "--experiment", "EXP-0001"],
        Some("===RESULT=== {\"loss\": 0.5}\n"),
        &[],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(v
        .root
        .join("notes/experiments/EXP-0001/results.tsv")
        .is_file());
    let out = v.run_with(
        &["new"],
        None,
        &[("YAJNA_ANSWERS", "experiment\nInteractive")],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout.contains("EXP-0002-interactive.md"),
        "{}",
        out.stdout
    );

    for shared in ["protocol", "material", "equipment", "build", "project"] {
        let out = v.run(&["new", shared, "Nope"]);
        assert_eq!(
            out.code, 1,
            "{shared} must not be created in a project repo"
        );
    }
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
}

/// A lab with a code-bearing project, an experiment that cites and links shared pages,
/// a run and a reading note: the input to import and graduation.
fn lab_with_project() -> Vault {
    let v = vault();
    fs::create_dir_all(v.root.join("references")).unwrap();
    fs::write(v.root.join("references/library.bib"), BIB).unwrap();
    fs::write(
        v.root.join("flake.nix"),
        "{\n# projects: registered by yajna new project --code\n}\n",
    )
    .unwrap();
    assert_eq!(v.run(&["new", "project", "Other"]).code, 0);
    assert_eq!(v.run(&["new", "protocol", "Transformation"]).code, 0);
    assert_eq!(
        v.run(&["new", "material", "Strain", "--kind", "strain"])
            .code,
        0
    );
    let out = v.run(&["new", "project", "Toy model", "--code"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let out = v.run(&["new", "experiment", "Timing", "--project", "PRJ-0002"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let exp = v.path(&out);
    fs::write(
        &exp,
        v.read(&exp).replace("protocols: []", "protocols: [PRO-0001]")
            + "\nUses [[PRO-0001@1|the protocol]] and [[MAT-0001]] after [[PRJ-0001]]; see [@shih2015cloning].\n",
    )
    .unwrap();
    assert_eq!(v.run(&["ref", "shih2015cloning", "--note"]).code, 0);
    assert_eq!(v.run(&["new", "run", "--experiment", "EXP-0001"]).code, 0);
    fs::create_dir_all(
        v.root
            .join("notes/projects/PRJ-0002-toy-model/experiments/EXP-0001"),
    )
    .unwrap();
    fs::write(
        v.root
            .join("notes/projects/PRJ-0002-toy-model/experiments/EXP-0001/notes.txt"),
        "sidecar\n",
    )
    .unwrap();
    assert_eq!(v.run(&["validate"]).code, 0);
    v
}

#[test]
fn init_project_from_a_lab() {
    let lab = lab_with_project();
    let v = empty();
    fs::write(v.root.join("flake.nix"), "{ }\n").unwrap();
    let out = v.run(&[
        "init",
        "project",
        "PRJ-0002",
        "--from",
        lab.root.to_str().unwrap(),
        "--namespace",
        "toy",
    ]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);

    let page = v.read(&v.root.join("notes/README.md"));
    assert!(
        page.contains("id: PRJ-0001\norigin: yajna/PRJ-0002\n"),
        "{page}"
    );
    assert!(page.contains("code: .\n"), "{page}");
    assert!(page.contains("title: Toy model\n"), "{page}");
    let exp = v.read(&v.root.join("notes/experiments/EXP-0001-timing.md"));
    assert!(exp.contains("project: PRJ-0001\n"), "{exp}");
    assert!(exp.contains("protocols: [yajna/PRO-0001]\n"), "{exp}");
    assert!(
        exp.contains(
            "[[yajna/PRO-0001@1|the protocol]] and [[yajna/MAT-0001]] after [[yajna/PRJ-0001]]"
        ),
        "{exp}"
    );
    assert!(v
        .root
        .join("notes/experiments/EXP-0001/notes.txt")
        .is_file());
    assert_eq!(walk(&v.root.join("notes/runs")).len(), 1);
    assert!(v
        .read(&walk(&v.root.join("notes/runs"))[0])
        .contains("project: PRJ-0001\n"));
    assert!(v.root.join("notes/references/shih2015cloning.md").is_file());
    let bib = v.read(&v.root.join("notes/references/library.bib"));
    assert!(bib.contains("@article{shih2015cloning,"), "{bib}");
    assert!(!bib.contains("other2020"), "{bib}");
    let counters = v.read(&v.root.join("notes/counters.yaml"));
    assert!(counters.contains("PRJ: 1\nEXP: 1\nANA: 0\n"), "{counters}");
    let cfg = v.read(&v.root.join("yajna.toml"));
    assert!(cfg.contains("namespace = \"toy\""), "{cfg}");
    assert!(cfg.contains("\nyajna = { path = \""), "{cfg}");
    assert!(
        v.read(&v.root.join("flake.nix")) == "{ }\n",
        "the code tree is untouched"
    );

    // the lab is checked out at the registered path, so its IDs are resolved
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    let exp_path = v.root.join("notes/experiments/EXP-0001-timing.md");
    fs::write(&exp_path, exp + "\nAlso [[yajna/PRO-0099]].\n").unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stdout.contains("link to unknown id yajna/PRO-0099"),
        "{}",
        out.stdout
    );

    assert_eq!(
        v.run(&[
            "init",
            "project",
            "PRJ-0002",
            "--from",
            lab.root.to_str().unwrap()
        ])
        .code,
        1
    );
    let lab_v = empty();
    let out = lab_v.run(&[
        "init",
        "project",
        "PRJ-0042",
        "--from",
        lab.root.to_str().unwrap(),
        "--namespace",
        "x",
    ]);
    assert_eq!(out.code, 1);
    assert!(out.stderr.contains("PRJ-0042"));
}

#[test]
fn graduate_moves_code_and_notebook() {
    let lab = lab_with_project();
    git(&lab.root, &["init", "-q", "-b", "main"]);
    git(&lab.root, &["add", "-A"]);
    git(&lab.root, &["commit", "-q", "-m", "lab"]);
    assert!(lab
        .read(&lab.root.join("flake.nix"))
        .contains("inputs.toy-model = "));
    let into = empty();
    git(&into.root, &["init", "-q", "-b", "main"]);

    let out = lab.run(&[
        "graduate",
        "PRJ-0002",
        "--to",
        "github:leoank/toy",
        "--into",
        into.root.to_str().unwrap(),
    ]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);

    // the code tree is the new repo's root, with its history
    assert!(into
        .read(&into.root.join("flake.nix"))
        .contains("flake-parts"));
    assert!(
        into.read(&into.root.join("README.md"))
            .contains("[[PRJ-0002]]"),
        "the code tree is untouched"
    );
    assert_eq!(
        git(&into.root, &["rev-list", "--count", "HEAD"]).trim(),
        "1"
    );
    assert!(git(&into.root, &["status", "--porcelain"]).contains("notes/"));
    assert!(git(&lab.root, &["branch", "--list", "graduate/*"])
        .trim()
        .is_empty());
    let page = into.read(&into.root.join("notes/README.md"));
    assert!(page.contains("origin: yajna/PRJ-0002\n"), "{page}");
    assert!(into
        .root
        .join("notes/experiments/EXP-0001-timing.md")
        .is_file());

    // the lab page points onward
    let moved = lab.read(&lab.root.join("notes/projects/PRJ-0002-toy-model/README.md"));
    assert!(moved.contains("status: moved\n"), "{moved}");
    assert!(
        moved.contains("code: github:leoank/toy\ncontinued_in: toy/PRJ-0001\n"),
        "{moved}"
    );
    assert!(
        moved.contains("---\n\nContinued in [[toy/PRJ-0001]].\n\n## Introduction"),
        "{moved}"
    );
    assert!(!lab
        .read(&lab.root.join("flake.nix"))
        .contains("inputs.toy-model"));
    let cfg = lab.read(&lab.root.join("yajna.toml"));
    assert!(
        cfg.contains("\n[repos]\ntoy = { url = \"github:leoank/toy\", path = \""),
        "{cfg}"
    );

    let out = lab.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    let out = into.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert_eq!(
        lab.run(&[
            "graduate",
            "PRJ-0002",
            "--to",
            "github:leoank/toy",
            "--into",
            into.root.to_str().unwrap()
        ])
        .code,
        1
    );
}

/// A lab with two themed experiments, runs with metrics, a protocol, a material, a
/// reading note and log lines: what the index, the queries and the site are tested on.
fn indexed_lab() -> Vault {
    let v = vault();
    fs::create_dir_all(v.root.join("references")).unwrap();
    fs::write(v.root.join("references/library.bib"), BIB).unwrap();
    assert_eq!(v.run(&["new", "project", "Archaeal division"]).code, 0);
    assert_eq!(v.run(&["new", "protocol", "Transformation"]).code, 0);
    let out = v.run(&["new", "material", "Strain xyz", "--kind", "strain"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let out = v.run(&["new", "experiment", "ESCRT timing", "--project", "PRJ-0001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let e1 = v.path(&out);
    fs::write(
        &e1,
        v.read(&e1)
            .replace("status: planned", "status: concluded")
            .replace("outcome: null", "outcome: positive")
            .replace("tags: []", "tags: [timing]")
            .replace("materials: []", "materials: [MAT-0001]")
            .replace("protocols: []", "protocols: [PRO-0001@1]")
            + "\nBuilds on [@shih2015cloning]; see [[PRO-0001|the protocol]].\n\n- [ ] repeat at 37C\n",
    )
    .unwrap();
    let out = v.run(&[
        "new",
        "experiment",
        "ESCRT timing under confinement",
        "--project",
        "PRJ-0001",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let e2 = v.path(&out);
    fs::write(
        &e2,
        v.read(&e2)
            .replace("tags: []", "tags: [timing]")
            .replace("influenced_by: []", "influenced_by: [EXP-0001]"),
    )
    .unwrap();
    let out = v.run(&[
        "new",
        "experiment",
        "Membrane tension",
        "--project",
        "PRJ-0001",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let e3 = v.path(&out);
    fs::write(&e3, v.read(&e3).replace("tags: []", "tags: [mechanics]")).unwrap();
    for (loss, lr) in [("0.42", "0.01"), ("0.31", "0.001"), ("0.35", "0.003")] {
        let out = v.run_with(
            &["result", "--experiment", "EXP-0001"],
            Some(&format!(
                "===RESULT=== {{\"loss\": {loss}, \"lr\": {lr}}}\n"
            )),
            &[],
        );
        assert_eq!(out.code, 0, "{}", out.stderr);
    }
    // the project page lists its experiments with one line each, the experiment its runs
    let prj = v
        .root
        .join("notes/projects/PRJ-0001-archaeal-division/README.md");
    fs::write(
        &prj,
        v.read(&prj) + "- [[EXP-0001]] timing of ESCRT recruitment, positive\n- [[EXP-0002]] the same under confinement\n- [[EXP-0003]] membrane tension as a confound\n",
    )
    .unwrap();
    let first_run = walk(
        &v.root
            .join("notes/projects/PRJ-0001-archaeal-division/runs"),
    )
    .into_iter()
    .find(|p| p.extension().map(|e| e == "md").unwrap_or(false))
    .unwrap();
    let first_run_id = first_run.file_stem().unwrap().to_string_lossy().to_string();
    fs::write(
        &e1,
        v.read(&e1) + &format!("\n- [[{first_run_id}]] the baseline sweep point\n"),
    )
    .unwrap();
    assert_eq!(v.run(&["ref", "shih2015cloning", "--note"]).code, 0);
    assert_eq!(
        v.run(&[
            "log",
            "Thawed [[MAT-0001]] for [[EXP-0001]]",
            "--date",
            "2026-10-15",
            "--time",
            "09:10"
        ])
        .code,
        0
    );
    assert_eq!(
        v.run(&[
            "log",
            "--author",
            "agent:planner",
            "--date",
            "2026-10-16",
            "--time",
            "11:00",
            "Drafted [[EXP-0002]]"
        ])
        .code,
        0
    );
    assert_eq!(v.run(&["validate"]).code, 0);
    v
}

#[test]
fn index_is_a_rebuilt_cache_of_a_valid_vault() {
    let v = indexed_lab();
    let out = v.run(&["index"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("10 entities"), "{}", out.stdout);
    assert!(
        out.stdout.contains("3 runs results") || out.stdout.contains("6 run results"),
        "{}",
        out.stdout
    );
    assert!(out.stdout.contains("2 log entries"), "{}", out.stdout);
    assert!(out.stdout.contains("3 mentions"), "{}", out.stdout);
    let db = walk(&v.root.join(".cache"))
        .into_iter()
        .find(|p| p.extension().map(|e| e == "sqlite").unwrap_or(false))
        .expect("index file");
    let built = db.metadata().unwrap().modified().unwrap();
    // a later page makes the index stale; the next query rebuilds it
    std::thread::sleep(std::time::Duration::from_millis(20));
    assert_eq!(v.run(&["new", "equipment", "Spinning disk"]).code, 0);
    let out = v.run(&["show", "EQP-0001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("Spinning disk"), "{}", out.stdout);
    assert!(
        db.metadata().unwrap().modified().unwrap() > built,
        "index rebuilt"
    );
    // an invalid vault has no index
    fs::write(
        v.root.join("notes/equipment/EQP-0001-spinning-disk.md"),
        "---\nid: EQP-0001\ntype: equipment\n---\n",
    )
    .unwrap();
    let out = v.run(&["index"]);
    assert_eq!(out.code, 1);
    assert!(out.stderr.contains("problem"), "{}", out.stderr);
}

#[test]
fn show_timeline_tree_runs() {
    let v = indexed_lab();
    let out = v.run(&["show", "MAT-0001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout.contains("EXP-0001  (materials)"),
        "{}",
        out.stdout
    );
    assert!(out.stdout.contains("log mentions: 1"), "{}", out.stdout);

    // "everything I did with MAT-0001": the experiment that lists it and the log line
    let out = v.run(&["timeline", "MAT-0001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout.contains("created material MAT-0001 by tester"),
        "{}",
        out.stdout
    );
    // the log line is dated before the page was created, so it comes first
    assert!(out.stdout.starts_with("2026-10-15 09:10"), "{}", out.stdout);
    assert!(
        out.stdout
            .contains("2026-10-15 09:10 [tester] Thawed [[MAT-0001]] for [[EXP-0001]]"),
        "{}",
        out.stdout
    );
    assert!(
        out.stdout
            .contains("experiment EXP-0001 (materials)  ESCRT timing"),
        "{}",
        out.stdout
    );
    let out = v.run(&["timeline", "EXP-0001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert_eq!(out.stdout.matches("run RUN-").count(), 3, "{}", out.stdout);
    assert!(out.stdout.contains("loss=0.31"), "{}", out.stdout);
    assert!(
        out.stdout.contains("experiment EXP-0002 (influenced_by)"),
        "{}",
        out.stdout
    );

    let out = v.run(&["tree", "PRJ-0001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("\ntiming\n"), "{}", out.stdout);
    assert!(out.stdout.contains("\nmechanics\n"), "{}", out.stdout);
    assert!(out.stdout.contains("concluded/positive"), "{}", out.stdout);
    assert!(out.stdout.contains("(3 runs)"), "{}", out.stdout);
    assert!(
        out.stdout.contains("EXP-0002") && out.stdout.contains("<- EXP-0001"),
        "{}",
        out.stdout
    );

    // "all runs for EXP-0001 by metric"
    let out = v.run(&["runs", "EXP-0001", "--by", "loss"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let rows: Vec<&str> = out.stdout.lines().skip(1).collect();
    assert_eq!(rows.len(), 3, "{}", out.stdout);
    assert!(rows[0].ends_with("0.31\t0.001"), "{}", out.stdout);
    assert!(rows[2].contains("0.42"), "{}", out.stdout);
    let out = v.run(&["runs", "EXP-0001", "--by", "loss", "--desc"]);
    assert!(
        out.stdout.lines().nth(1).unwrap().contains("0.42"),
        "{}",
        out.stdout
    );
    assert_eq!(v.run(&["runs", "EXP-0001", "--by", "nothing"]).code, 1);
    assert_eq!(v.run(&["runs", "PRO-0001"]).code, 1);
    assert_eq!(v.run(&["show", "EXP-0099"]).code, 1);
}

#[test]
fn site_renders_tree_links_and_log() {
    let v = indexed_lab();
    let out_dir = v.root.join("site");
    let out = v.run(&["site", "--out", out_dir.to_str().unwrap()]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("page(s)"), "{}", out.stdout);
    let project = v.read(&out_dir.join("PRJ-0001.html"));
    assert!(project.contains("<svg"), "tree on the project page");
    assert!(
        project.contains("stroke-dasharray"),
        "influence edge is dotted"
    );
    assert!(
        project.contains("fill=\"#4caf50\""),
        "positive outcome is green"
    );
    assert!(
        project.contains(">timing<") && project.contains(">mechanics<"),
        "{project}"
    );
    assert!(
        project.contains("<h2>Experiments</h2>") && project.contains("the same under confinement"),
        "{project}"
    );
    let exp = v.read(&out_dir.join("EXP-0001.html"));
    assert!(
        exp.contains("<a href=\"PRO-0001.html\">the protocol</a>"),
        "{exp}"
    );
    assert!(
        exp.contains("<a href=\"ref-shih2015cloning.html\">@shih2015cloning</a>"),
        "{exp}"
    );
    assert!(
        exp.contains("<a href=\"MAT-0001.html\""),
        "material in the frontmatter table"
    );
    assert!(
        exp.contains("<h2>Runs</h2>") && exp.contains("0.31"),
        "{exp}"
    );
    assert!(
        exp.contains("<th>in short</th>") && exp.contains("the baseline sweep point"),
        "{exp}"
    );
    assert!(
        exp.contains("<h2>Log</h2>") && exp.contains("Thawed"),
        "{exp}"
    );
    let mat = v.read(&out_dir.join("MAT-0001.html"));
    assert!(
        mat.contains("Linked from") && mat.contains("EXP-0001.html"),
        "{mat}"
    );
    assert!(out_dir.join("ref-shih2015cloning.html").is_file());
    let log = v.read(&out_dir.join("log.html"));
    assert!(
        log.contains("agent:planner") && log.contains("<a href=\"EXP-0002.html\">"),
        "{log}"
    );
    assert!(v
        .read(&out_dir.join("tasks.html"))
        .contains("repeat at 37C"));
    assert!(v
        .read(&out_dir.join("index.html"))
        .contains("Archaeal division"));
}

#[test]
fn agents_author_their_pages_and_runs_carry_a_script() {
    let v = vault();
    v.run(&["new", "project", "P"]);
    v.run(&["new", "experiment", "E", "--project", "PRJ-0001"]);
    // --author on new, and YAJNA_AUTHOR as the session-wide default
    let out = v.run(&["new", "agent", "Plan", "--author", "agent:claude"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(v.read(&v.path(&out)).contains("author: agent:claude\n"));
    let out = v.run_with(
        &[
            "new",
            "run",
            "--experiment",
            "EXP-0001",
            "--kind",
            "compute",
            "--script",
            "notes/projects/PRJ-0001-p/runs/run.sh",
        ],
        None,
        &[("YAJNA_AUTHOR", "agent:claude")],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    let page = v.read(&v.path(&out));
    assert!(page.contains("author: agent:claude\n"), "{page}");
    assert!(
        page.contains("script: notes/projects/PRJ-0001-p/runs/run.sh"),
        "{page}"
    );
    assert!(page.contains("## Reproduce"), "{page}");
    let script = v.root.join("notes/projects/PRJ-0001-p/runs/run.sh");
    let stub = v.read(&script);
    assert!(stub.starts_with("#!/usr/bin/env bash"), "{stub}");
    assert!(
        stub.contains("Re-creates RUN-") && stub.contains("for EXP-0001"),
        "{stub}"
    );
    // the human's log file stays the human's even when an agent logs
    let out = v.run_with(
        &["log", "did a thing", "--time", "10:00"],
        None,
        &[("YAJNA_AUTHOR", "agent:claude")],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains(".agent-claude.md"), "{}", out.stdout);
    let out = v.run(&["log", "human thing", "--time", "10:01"]);
    assert!(!out.stdout.contains(".agent-claude.md"), "{}", out.stdout);
    // result records the script that produced the line, which must exist
    let out = v.run_with(
        &[
            "result",
            "--experiment",
            "EXP-0001",
            "--script",
            "notes/projects/PRJ-0001-p/runs/run.sh",
        ],
        Some("===RESULT=== {\"loss\": 0.1}\n"),
        &[("YAJNA_AUTHOR", "agent:claude")],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    let page = v.read(&v.path(&out));
    assert!(
        page.contains("author: agent:claude\n")
            && page.contains("script: notes/projects/PRJ-0001-p/runs/run.sh\n"),
        "{page}"
    );
    let out = v.run_with(
        &[
            "result",
            "--experiment",
            "EXP-0001",
            "--script",
            "nowhere.sh",
        ],
        Some("===RESULT=== {\"loss\": 0.1}\n"),
        &[],
    );
    assert_eq!(out.code, 1);
    assert_eq!(v.run(&["validate"]).code, 0);
    // a script that disappears fails validation
    fs::remove_file(&script).unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stdout
            .contains("script notes/projects/PRJ-0001-p/runs/run.sh does not exist"),
        "{}",
        out.stdout
    );
    assert_eq!(
        v.run(&[
            "new",
            "experiment",
            "X",
            "--project",
            "PRJ-0001",
            "--script",
            "x.sh"
        ])
        .code,
        1
    );
}

#[test]
fn skill_is_embedded_and_installed() {
    let v = vault();
    let out = v.run(&["skill", "--print"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout.starts_with("---\nname: yajna\n"),
        "{}",
        out.stdout
    );
    assert!(out.stdout.contains("YAJNA_AUTHOR=agent:<name>"));
    let out = v.run(&["skill"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert_eq!(out.stdout.trim(), ".claude/skills/yajna/SKILL.md");
    assert!(v
        .read(&v.root.join(".claude/skills/yajna/SKILL.md"))
        .contains("Reproducible runs"));
    let fresh = empty();
    assert_eq!(
        fresh
            .run(&["init", "project", "T", "--namespace", "t", "--author", "a"])
            .code,
        0
    );
    assert!(fresh.root.join(".claude/skills/yajna/SKILL.md").is_file());
}

#[test]
fn listed_experiments_and_runs_need_a_description() {
    let v = vault();
    v.run(&["new", "project", "P"]);
    v.run(&["new", "experiment", "E", "--project", "PRJ-0001"]);
    let prj = v.root.join("notes/projects/PRJ-0001-p/README.md");
    fs::write(&prj, v.read(&prj) + "- [[EXP-0001]]\n").unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stdout
            .contains("EXP-0001 is listed without a short description"),
        "{}",
        out.stdout
    );
    fs::write(
        &prj,
        v.read(&prj).replace(
            "- [[EXP-0001]]\n",
            "- [[EXP-0001]] what it asks, in one line\n",
        ),
    )
    .unwrap();
    assert_eq!(v.run(&["validate"]).code, 0);
    // a bare link in prose is fine; a bare listed run is not
    let exp = walk(&v.root.join("notes/projects/PRJ-0001-p/experiments"))
        .into_iter()
        .find(|p| p.extension().map(|e| e == "md").unwrap_or(false))
        .unwrap();
    v.run(&["new", "run", "--experiment", "EXP-0001"]);
    let run_id = walk(&v.root.join("notes/projects/PRJ-0001-p/runs"))
        .into_iter()
        .find(|p| p.extension().map(|e| e == "md").unwrap_or(false))
        .unwrap()
        .file_stem()
        .unwrap()
        .to_string_lossy()
        .to_string();
    fs::write(
        &exp,
        v.read(&exp) + &format!("\nSee [[PRJ-0001]].\n- [[{run_id}]]\n"),
    )
    .unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stdout
            .contains(&format!("{run_id} is listed without a short description")),
        "{}",
        out.stdout
    );
}

fn first_md(dir: &Path) -> PathBuf {
    let mut pages: Vec<PathBuf> = walk(dir)
        .into_iter()
        .filter(|p| p.extension().map(|e| e == "md").unwrap_or(false))
        .collect();
    pages.sort();
    pages.remove(0)
}

/// A committed lab with one project and one experiment, on branch `main`.
fn git_lab() -> Vault {
    let v = vault();
    assert_eq!(v.run(&["new", "project", "Toy"]).code, 0);
    assert_eq!(
        v.run(&["new", "experiment", "First", "--project", "PRJ-0001"])
            .code,
        0
    );
    git(&v.root, &["init", "-q", "-b", "main"]);
    git(&v.root, &["add", "-A"]);
    git(&v.root, &["commit", "-q", "-m", "lab"]);
    v
}

#[test]
fn validate_against_finds_ids_allocated_on_both_branches() {
    let v = git_lab();
    git(&v.root, &["checkout", "-q", "-b", "toy/aero"]);
    assert_eq!(
        v.run(&["new", "experiment", "Branch one", "--project", "PRJ-0001"])
            .code,
        0
    );
    git(&v.root, &["add", "-A"]);
    git(&v.root, &["commit", "-q", "-m", "branch"]);
    // nothing on main yet: no collision
    let out = v.run(&["validate", "--against", "main"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    // main allocates EXP-0002 too
    git(&v.root, &["checkout", "-q", "main"]);
    assert_eq!(
        v.run(&["new", "experiment", "Main one", "--project", "PRJ-0001"])
            .code,
        0
    );
    assert_eq!(v.run(&["new", "protocol", "Shared"]).code, 0);
    git(&v.root, &["add", "-A"]);
    git(&v.root, &["commit", "-q", "-m", "main"]);
    git(&v.root, &["checkout", "-q", "toy/aero"]);
    assert_eq!(
        v.run(&["validate"]).code,
        0,
        "each branch is valid on its own"
    );
    let out = v.run(&["validate", "--against", "main"]);
    assert_eq!(out.code, 1, "{}{}", out.stdout, out.stderr);
    assert!(
        out.stdout.contains("EXP-0002 was also created on main"),
        "{}",
        out.stdout
    );
    assert!(
        out.stdout.contains("yajna renumber EXP-0002"),
        "{}",
        out.stdout
    );
    // the fix: renumber on the branch, then the merge is clean
    let out = v.run(&["renumber", "EXP-0002", "EXP-0003"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    git(&v.root, &["add", "-A"]);
    git(&v.root, &["commit", "-q", "-m", "renumber"]);
    let out = v.run(&["validate", "--against", "main"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(
        out.stderr.contains("merge main before allocating"),
        "{}",
        out.stderr
    );
    assert_eq!(v.run(&["validate", "--against", "nope"]).code, 1);
}

#[test]
fn renumber_moves_page_sidecar_and_every_reference() {
    let v = vault();
    assert_eq!(v.run(&["new", "project", "Toy"]).code, 0);
    assert_eq!(
        v.run(&["new", "experiment", "Timing", "--project", "PRJ-0001"])
            .code,
        0
    );
    let out = v.run_with(
        &["result", "--experiment", "EXP-0001"],
        Some("===RESULT=== {\"loss\": 0.5}\n"),
        &[],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    let prj = v.root.join("notes/projects/PRJ-0001-toy/README.md");
    fs::write(&prj, v.read(&prj) + "- [[EXP-0001]] timing, in short\n\nSee [[EXP-0001@2|it]], not EXP-00011 or [[other/EXP-0001]].\n").unwrap();
    fs::write(
        v.root.join("yajna.toml"),
        v.read(&v.root.join("yajna.toml")) + "[repos]\nother = \"github:x/other\"\n",
    )
    .unwrap();
    assert_eq!(
        v.run(&["log", "ran [[EXP-0001]]", "--time", "09:00"]).code,
        0
    );

    let out = v.run(&["renumber", "EXP-0001", "EXP-0007"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    let exps = v.root.join("notes/projects/PRJ-0001-toy/experiments");
    assert!(exps.join("EXP-0007-timing.md").is_file());
    assert!(!exps.join("EXP-0001-timing.md").exists());
    assert!(exps.join("EXP-0007/results.tsv").is_file(), "sidecar moved");
    assert!(v
        .read(&exps.join("EXP-0007-timing.md"))
        .contains("id: EXP-0007\n"));
    let page = v.read(&prj);
    assert!(page.contains("- [[EXP-0007]] timing, in short"), "{page}");
    assert!(
        page.contains("[[EXP-0007@2|it]]")
            && page.contains("EXP-00011")
            && page.contains("[[other/EXP-0001]]"),
        "{page}"
    );
    let run = first_md(&v.root.join("notes/projects/PRJ-0001-toy/runs"));
    assert!(v.read(&run).contains("experiment: EXP-0007\n"));
    assert!(v
        .read(&v.root.join("notes/counters.yaml"))
        .contains("EXP: 7\n"));
    assert_eq!(v.run(&["validate"]).code, 0);
    assert_eq!(v.run(&["timeline", "EXP-0007"]).code, 0);

    // without a new ID the next free one is taken; projects move their directory
    let out = v.run(&["renumber", "PRJ-0001"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(v
        .root
        .join("notes/projects/PRJ-0002-toy/README.md")
        .is_file());
    let exp = v.read(
        &v.root
            .join("notes/projects/PRJ-0002-toy/experiments/EXP-0007-timing.md"),
    );
    assert!(exp.contains("project: PRJ-0002\n"), "{exp}");
    assert_eq!(v.run(&["validate"]).code, 0);

    assert_eq!(
        v.run(&["renumber", "EXP-0007", "PRJ-0009"]).code,
        1,
        "prefix kept"
    );
    assert_eq!(v.run(&["renumber", "EXP-0099"]).code, 1, "unknown id");
    let r = run.file_stem().unwrap().to_string_lossy().to_string();
    assert_eq!(v.run(&["renumber", &r]).code, 1, "volume ids never collide");
}

#[test]
fn worktree_branches_with_its_own_author() {
    let v = git_lab();
    let wt = empty();
    let target = wt.root.join("aero");
    let out = v.run(&[
        "worktree",
        "PRJ-0001",
        "Aero map",
        "--path",
        target.to_str().unwrap(),
    ]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(
        out.stdout.contains("branch   toy/aero-map"),
        "{}",
        out.stdout
    );
    assert_eq!(
        git(&target, &["rev-parse", "--abbrev-ref", "HEAD"]).trim(),
        "toy/aero-map"
    );
    assert_eq!(
        fs::read_to_string(target.join(".yajna/author")).unwrap(),
        "agent:claude-toy-aero-map\n"
    );
    assert!(
        git(&target, &["status", "--porcelain"]).trim().is_empty(),
        "the author file is not tracked"
    );
    // pages and log lines made in the worktree carry the worktree's author
    let w = Vault {
        _dir: tempfile::tempdir().unwrap(),
        root: target.clone(),
    };
    let out = w.run(&["log", "first step", "--time", "10:00"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout.contains(".agent-claude-toy-aero-map.md"),
        "{}",
        out.stdout
    );
    let out = w.run(&[
        "new",
        "run",
        "--experiment",
        "EXP-0001",
        "--kind",
        "compute",
    ]);
    assert!(w
        .read(&w.path(&out))
        .contains("author: agent:claude-toy-aero-map\n"));
    // YAJNA_AUTHOR still wins
    let out = w.run_with(
        &["log", "x", "--time", "10:01"],
        None,
        &[("YAJNA_AUTHOR", "agent:other")],
    );
    assert!(out.stdout.contains(".agent-other.md"), "{}", out.stdout);
    assert_eq!(
        v.run(&[
            "worktree",
            "PRJ-0001",
            "Aero map",
            "--path",
            target.to_str().unwrap()
        ])
        .code,
        1
    );
    assert_eq!(
        v.run(&["worktree", "EXP-0001", "x"]).code,
        1,
        "a project is required"
    );
}

#[test]
fn site_serve_answers_http_and_rerenders() {
    use std::io::{BufRead, BufReader, Read, Write};
    let v = indexed_lab();
    let out_dir = v.root.join("site");
    let mut child = Command::new(env!("CARGO_BIN_EXE_yajna"))
        .arg("--root")
        .arg(&v.root)
        .args(["site", "--serve", "--port", "0", "--out"])
        .arg(&out_dir)
        .env("YAJNA_CACHE", v.root.join(".cache"))
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .unwrap();
    let mut lines = BufReader::new(child.stdout.take().unwrap()).lines();
    let url = loop {
        let line = lines.next().unwrap().unwrap();
        if let Some(rest) = line.strip_prefix("serving http://") {
            break rest
                .split(' ')
                .next()
                .unwrap()
                .trim_end_matches('/')
                .to_string();
        }
    };
    let get = |path: &str| -> String {
        let mut s = std::net::TcpStream::connect(&url).unwrap();
        write!(s, "GET {path} HTTP/1.1\r\nHost: x\r\n\r\n").unwrap();
        let mut body = String::new();
        s.read_to_string(&mut body).unwrap();
        body
    };
    let home = get("/");
    assert!(home.starts_with("HTTP/1.1 200 OK"), "{home}");
    assert!(
        home.contains("text/html") && home.contains("Archaeal division"),
        "{home}"
    );
    assert!(get("/EXP-0001.html").contains("ESCRT timing"));
    assert!(get("/nope.html").starts_with("HTTP/1.1 404"));
    assert!(
        get("/../yajna.toml").starts_with("HTTP/1.1 404"),
        "no traversal"
    );
    // a change in the vault shows up on the next request
    std::thread::sleep(std::time::Duration::from_millis(20));
    assert_eq!(v.run(&["new", "equipment", "Spinning disk"]).code, 0);
    assert!(
        get("/EQP-0001.html").contains("Spinning disk"),
        "re-rendered after a change"
    );
    child.kill().unwrap();
    let _ = child.wait();
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
