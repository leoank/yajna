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
            .env("YAJNA_CACHE", self.root.join(".cache"))
            // reproducible date IDs: EXP-20261021-000001 of the counter days is EXP-20261021-000001 here
            .env("YAJNA_FIXED_TIME", "2026-10-21T00:00:00Z");
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
    assert!(out
        .stdout
        .contains("experiments/EXP-20261021-000001-escrt-timing.md"));

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

    let out = v.run(&["new", "run", "--experiment", "EXP-20261021-000001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let re = regex_lite(&out.stdout, "runs/RUN-");
    assert!(re, "{}", out.stdout);
    let run = v.path(&out);
    assert!(v.read(&run).contains("experiment: EXP-20261021-000001"));

    let out = v.run(&[
        "log",
        "Started",
        "induction",
        "for",
        "[[EXP-20261021-000001]]",
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
        .contains("- 09:10 Started induction for [[EXP-20261021-000001]]\n"));

    let output =
        "training...\n===RESULT=== {\"loss\": 0.42, \"steps\": 3000, \"tag\": \"baseline\"}\n";
    let out = v.run_with(
        &["result", "--experiment", "EXP-20261021-000001"],
        Some(output),
        &[],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    let tsv = v.root.join(
        "notes/projects/PRJ-0001-archaeal-division/experiments/EXP-20261021-000001/results.tsv",
    );
    assert!(tsv.is_file());
    let run_page = v.path(&out);
    let page = v.read(&run_page);
    assert!(page.contains("status: done\n"), "{page}");
    assert!(page.contains("| loss | 0.42 |"), "{page}");
    let out = v.run_with(
        &["result", "--experiment", "EXP-20261021-000001"],
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
fn missing_title_is_an_error_without_a_terminal() {
    let v = vault();
    let out = v.run(&["new", "experiment"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr.contains("a title is required for an experiment"),
        "{}",
        out.stderr
    );
    let out = v.run(&["new", "protocol"]);
    assert!(
        out.stderr.contains("required for a protocol"),
        "{}",
        out.stderr
    );
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
            .contains("experiments/EXP-20261021-000001-interactive-one.md"),
        "{}",
        out.stdout
    );
    let out = v.run_with(
        &["new"],
        None,
        &[("YAJNA_ANSWERS", "run\nEXP-20261021-000001\ncompute")],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("runs/RUN-"));
    let run = v.read(&v.path(&out));
    assert!(run.contains("kind: compute"));
    assert!(run.contains("experiment: EXP-20261021-000001"));
    // The scripted answer for a run's kind may be empty: the default (first enum value) wins.
    let out = v.run_with(
        &["new"],
        None,
        &[("YAJNA_ANSWERS", "run\nEXP-20261021-000001\n")],
    );
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
    let arch = v.read(&v.root.join("code/toy-model/docs/architecture.md"));
    assert!(
        arch.starts_with("# Toy model: architecture") && arch.contains("[[PRJ-0001]]"),
        "{arch}"
    );
    assert!(v
        .read(&v.root.join("code/toy-model/docs/decisions/README.md"))
        .contains("ADR-0001"));
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
fn flags_a_type_has_no_field_for_are_errors() {
    let v = vault();
    // a project has no kind: --kind used to be dropped silently
    let out = v.run(&["new", "project", "P", "--kind", "code"]);
    assert_eq!(out.code, 1);
    assert!(out.stderr.contains("--code"), "{}", out.stderr);
    assert_eq!(v.run(&["new", "project", "P"]).code, 0);
    let out = v.run(&[
        "new",
        "experiment",
        "E",
        "--project",
        "PRJ-0001",
        "--kind",
        "bench",
    ]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr
            .contains("--kind does not apply to experiment pages"),
        "{}",
        out.stderr
    );
    let out = v.run(&["new", "protocol", "Pr", "--project", "PRJ-0001"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr.contains("--project does not apply"),
        "{}",
        out.stderr
    );

    // a kind outside the schema fails here, not at the next validate
    let out = v.run(&["new", "run", "--project", "PRJ-0001", "--kind", "compte"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr.contains("bench, compute, assembly, calibration"),
        "{}",
        out.stderr
    );
    let out = v.run(&["new", "material", "M", "--kind", "plasmid"]);
    assert_eq!(out.code, 0, "{}", out.stderr);

    // a protocol's kind comes from --kind (it was always written as bench)
    let out = v.run(&["new", "protocol", "Pr", "--kind", "compute"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(v.read(&v.path(&out)).contains("\nkind: compute "));
    let out = v.run(&["new", "protocol", "Pr2"]);
    assert!(v.read(&v.path(&out)).contains("\nkind: bench "));

    let out = v.run(&["new", "experiment", "E", "--project", "PRJ-0001"]);
    let exp = v.path(&out);
    let id = v
        .read(&exp)
        .split("id: ")
        .nth(1)
        .unwrap()
        .lines()
        .next()
        .unwrap()
        .to_string();
    let out = v.run(&["result", "--experiment", &id, "--kind", "gpu"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr
            .contains("--kind gpu: run kind must be one of bench, compute"),
        "{}",
        out.stderr
    );
    let out = v.run(&["import", "benchling", "nothing", "--status", "done"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr
            .contains("--status done: experiment status must be one of"),
        "{}",
        out.stderr
    );
    assert_eq!(v.run(&["validate"]).code, 0);
}

#[test]
fn namespaced_links_need_a_registered_repo() {
    let v = vault();
    v.run(&["new", "project", "P"]);
    let out = v.run(&["new", "experiment", "E", "--project", "PRJ-0001"]);
    let exp = v.path(&out);
    fs::write(
        &exp,
        v.read(&exp) + "\nSee [[rc2s2/EXP-20261021-000003]] and [[yajna/PRO-0012@2]].\n",
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
    fs::create_dir_all(v.root.join("docs")).unwrap();
    fs::write(v.root.join("docs/architecture.md"), "mine\n").unwrap();
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
    assert!(
        page.contains("## Progress") && page.contains("`docs/architecture.md`"),
        "{page}"
    );
    assert_eq!(
        v.read(&v.root.join("docs/architecture.md")),
        "mine\n",
        "existing docs are kept"
    );
    assert!(v
        .read(&v.root.join("docs/decisions/README.md"))
        .contains("ADR-0001"));
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
    // a new repo gives experiments date IDs (ADR-0022)
    let exp = v.read(&v.path(&out));
    let exp_id = exp
        .lines()
        .find_map(|l| l.strip_prefix("id: "))
        .unwrap()
        .to_string();
    assert!(regex_like_date_id(&exp_id), "{exp_id}");
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert_eq!(
        out.stdout.trim(),
        format!("notes/experiments/{exp_id}-timing.md")
    );
    assert!(v.read(&v.path(&out)).contains("project: PRJ-0001\n"));
    let out = v.run(&["new", "run", "--experiment", &exp_id, "--kind", "compute"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.starts_with("notes/runs/RUN-"), "{}", out.stdout);
    let out = v.run_with(
        &["result", "--experiment", &exp_id],
        Some("===RESULT=== {\"loss\": 0.5}\n"),
        &[],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(v
        .root
        .join(format!("notes/experiments/{exp_id}/results.tsv"))
        .is_file());
    let out = v.run_with(
        &["new"],
        None,
        &[("YAJNA_ANSWERS", "experiment\nInteractive")],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout.contains("-interactive.md") && out.stdout.contains("notes/experiments/EXP-2"),
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
    assert_eq!(
        v.run(&["new", "run", "--experiment", "EXP-20261021-000001"])
            .code,
        0
    );
    fs::create_dir_all(
        v.root
            .join("notes/projects/PRJ-0002-toy-model/experiments/EXP-20261021-000001"),
    )
    .unwrap();
    fs::write(
        v.root
            .join("notes/projects/PRJ-0002-toy-model/experiments/EXP-20261021-000001/notes.txt"),
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
    let exp = v.read(
        &v.root
            .join("notes/experiments/EXP-20261021-000001-timing.md"),
    );
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
        .join("notes/experiments/EXP-20261021-000001/notes.txt")
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
    assert!(counters.ends_with("PRJ: 1\n"), "{counters}");
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
    let exp_path = v
        .root
        .join("notes/experiments/EXP-20261021-000001-timing.md");
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
        .join("notes/experiments/EXP-20261021-000001-timing.md")
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
            .replace("influenced_by: []", "influenced_by: [EXP-20261021-000001]"),
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
            &["result", "--experiment", "EXP-20261021-000001"],
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
        v.read(&prj) + "- [[EXP-20261021-000001]] timing of ESCRT recruitment, positive\n- [[EXP-20261021-000002]] the same under confinement\n- [[EXP-20261021-000003]] membrane tension as a confound\n",
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
            "Thawed [[MAT-0001]] for [[EXP-20261021-000001]]",
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
            "Drafted [[EXP-20261021-000002]]"
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
        out.stdout.contains("EXP-20261021-000001  (materials)"),
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
            .contains("2026-10-15 09:10 [tester] Thawed [[MAT-0001]] for [[EXP-20261021-000001]]"),
        "{}",
        out.stdout
    );
    assert!(
        out.stdout
            .contains("experiment EXP-20261021-000001 (materials)  ESCRT timing"),
        "{}",
        out.stdout
    );
    let out = v.run(&["timeline", "EXP-20261021-000001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert_eq!(out.stdout.matches("run RUN-").count(), 3, "{}", out.stdout);
    assert!(out.stdout.contains("loss=0.31"), "{}", out.stdout);
    assert!(
        out.stdout
            .contains("experiment EXP-20261021-000002 (influenced_by)"),
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
        out.stdout.contains("EXP-20261021-000002") && out.stdout.contains("<- EXP-20261021-000001"),
        "{}",
        out.stdout
    );

    // "all runs for EXP-20261021-000001 by metric"
    let out = v.run(&["runs", "EXP-20261021-000001", "--by", "loss"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let rows: Vec<&str> = out.stdout.lines().skip(1).collect();
    assert_eq!(rows.len(), 3, "{}", out.stdout);
    assert!(rows[0].ends_with("0.31\t0.001"), "{}", out.stdout);
    assert!(rows[2].contains("0.42"), "{}", out.stdout);
    let out = v.run(&["runs", "EXP-20261021-000001", "--by", "loss", "--desc"]);
    assert!(
        out.stdout.lines().nth(1).unwrap().contains("0.42"),
        "{}",
        out.stdout
    );
    assert_eq!(
        v.run(&["runs", "EXP-20261021-000001", "--by", "nothing"])
            .code,
        1
    );
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
        project.contains("<div class=\"tree\"><svg")
            && project.contains(">EXP-20261021</tspan><tspan"),
        "date IDs label on two lines in a scrolling box"
    );
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
    let exp = v.read(&out_dir.join("EXP-20261021-000001.html"));
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
        mat.contains("Linked from") && mat.contains("EXP-20261021-000001.html"),
        "{mat}"
    );
    assert!(out_dir.join("ref-shih2015cloning.html").is_file());
    let log = v.read(&out_dir.join("log.html"));
    assert!(
        log.contains("agent:planner") && log.contains("<a href=\"EXP-20261021-000002.html\">"),
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
            "EXP-20261021-000001",
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
        stub.contains("Re-creates RUN-") && stub.contains("for EXP-20261021-000001"),
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
            "EXP-20261021-000001",
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
            "EXP-20261021-000001",
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
fn links_in_code_are_text() {
    let v = vault();
    v.run(&["new", "project", "P"]);
    let prj = v.root.join("notes/projects/PRJ-0001-p/README.md");
    fs::write(
        &prj,
        v.read(&prj) + "\nWrite `[[EXP-0042]]` or `@citekey`; in a block:\n```\n[[nope/EXP-1]] @nobody\n```\n",
    )
    .unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    let out_dir = v.root.join("site");
    assert_eq!(v.run(&["site", "--out", out_dir.to_str().unwrap()]).code, 0);
    assert!(v
        .read(&out_dir.join("PRJ-0001.html"))
        .contains("<code>[[EXP-0042]]</code>"));
}

#[test]
fn listed_experiments_and_runs_need_a_description() {
    let v = vault();
    v.run(&["new", "project", "P"]);
    v.run(&["new", "experiment", "E", "--project", "PRJ-0001"]);
    let prj = v.root.join("notes/projects/PRJ-0001-p/README.md");
    fs::write(&prj, v.read(&prj) + "- [[EXP-20261021-000001]]\n").unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stdout
            .contains("EXP-20261021-000001 is listed without a short description"),
        "{}",
        out.stdout
    );
    fs::write(
        &prj,
        v.read(&prj).replace(
            "- [[EXP-20261021-000001]]\n",
            "- [[EXP-20261021-000001]] what it asks, in one line\n",
        ),
    )
    .unwrap();
    assert_eq!(v.run(&["validate"]).code, 0);
    // a bare link in prose is fine; a bare listed run is not
    let exp = walk(&v.root.join("notes/projects/PRJ-0001-p/experiments"))
        .into_iter()
        .find(|p| p.extension().map(|e| e == "md").unwrap_or(false))
        .unwrap();
    v.run(&["new", "run", "--experiment", "EXP-20261021-000001"]);
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
    let real_time = [("YAJNA_FIXED_TIME", "")];
    git(&v.root, &["checkout", "-q", "-b", "toy/aero"]);
    assert_eq!(v.run(&["new", "project", "Branch one"]).code, 0);
    // experiments carry date IDs, so making them on both branches never collides
    assert_eq!(
        v.run_with(
            &["new", "experiment", "Branch exp", "--project", "PRJ-0001"],
            None,
            &real_time
        )
        .code,
        0
    );
    git(&v.root, &["add", "-A"]);
    git(&v.root, &["commit", "-q", "-m", "branch"]);
    let out = v.run(&["validate", "--against", "main"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    // main allocates PRJ-0002 too
    git(&v.root, &["checkout", "-q", "main"]);
    assert_eq!(v.run(&["new", "project", "Main one"]).code, 0);
    assert_eq!(
        v.run_with(
            &["new", "experiment", "Main exp", "--project", "PRJ-0001"],
            None,
            &real_time
        )
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
        out.stdout.contains("PRJ-0002 was also created on main"),
        "{}",
        out.stdout
    );
    assert!(
        out.stdout.contains("yajna renumber PRJ-0002"),
        "{}",
        out.stdout
    );
    assert!(
        !out.stdout.contains("EXP-"),
        "experiments do not collide: {}",
        out.stdout
    );
    // the fix: renumber on the branch, then the merge is clean
    let out = v.run(&["renumber", "PRJ-0002", "PRJ-0003"]);
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
    fs::write(
        v.root.join("yajna.toml"),
        v.read(&v.root.join("yajna.toml")) + "[repos]\nother = \"github:x/other\"\n",
    )
    .unwrap();
    assert_eq!(v.run(&["new", "project", "Toy"]).code, 0);
    assert_eq!(v.run(&["new", "protocol", "Transformation"]).code, 0);
    assert_eq!(
        v.run(&["new", "experiment", "Timing", "--project", "PRJ-0001"])
            .code,
        0
    );
    let exp = first_md(&v.root.join("notes/projects/PRJ-0001-toy/experiments"));
    fs::write(
        &exp,
        v.read(&exp)
            .replace("protocols: []", "protocols: [PRO-0001@1]")
            + "\nUses [[PRO-0001@2|it]], not PRO-00011 or [[other/PRO-0001]].\n",
    )
    .unwrap();
    assert_eq!(
        v.run(&["log", "ran [[PRO-0001]]", "--time", "09:00"]).code,
        0
    );

    let out = v.run(&["renumber", "PRO-0001", "PRO-0007"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(v
        .root
        .join("notes/protocols/PRO-0007-transformation.md")
        .is_file());
    assert!(!v
        .root
        .join("notes/protocols/PRO-0001-transformation.md")
        .exists());
    assert!(v
        .read(&v.root.join("notes/protocols/PRO-0007-transformation.md"))
        .contains("id: PRO-0007\n"));
    let page = v.read(&exp);
    assert!(page.contains("protocols: [PRO-0007@1]"), "{page}");
    assert!(
        page.contains("[[PRO-0007@2|it]]")
            && page.contains("PRO-00011")
            && page.contains("[[other/PRO-0001]]"),
        "{page}"
    );
    assert!(v
        .read(&v.root.join("notes/counters.yaml"))
        .contains("PRO: 7\n"));
    assert_eq!(v.run(&["validate"]).code, 0);

    // without a new ID the next free one is taken; projects move their directory
    let out = v.run(&["renumber", "PRJ-0001"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(v
        .root
        .join("notes/projects/PRJ-0002-toy/README.md")
        .is_file());
    let moved = first_md(&v.root.join("notes/projects/PRJ-0002-toy/experiments"));
    assert!(v.read(&moved).contains("project: PRJ-0002\n"));
    assert_eq!(v.run(&["validate"]).code, 0);

    assert_eq!(
        v.run(&["renumber", "PRO-0007", "PRJ-0009"]).code,
        1,
        "prefix kept"
    );
    assert_eq!(v.run(&["renumber", "PRO-0099"]).code, 1, "unknown id");
    let out = v.run(&["renumber", "EXP-20261021-000001"]);
    assert_eq!(out.code, 1, "date ids never collide");
    assert!(out.stderr.contains("migrate-ids"), "{}", out.stderr);
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
        "EXP-20261021-000001",
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
        v.run(&["worktree", "EXP-20261021-000001", "x"]).code,
        1,
        "a project is required"
    );
}

#[test]
fn export_bundles_what_changed_since_the_last_export() {
    let v = git_lab();
    let out_dir = v.root.join("eln");
    let out = |args: &[&str]| {
        let mut a = vec!["export", "--out", out_dir.to_str().unwrap()];
        a.extend_from_slice(args);
        v.run(&a)
    };
    // the first export takes everything
    let r = out(&[]);
    assert_eq!(r.code, 0, "{}{}", r.stdout, r.stderr);
    assert!(r.stdout.contains("2 page(s), all pages"), "{}", r.stdout);
    let bundles: Vec<PathBuf> = fs::read_dir(&out_dir)
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.is_dir())
        .collect();
    assert_eq!(bundles.len(), 1);
    let b = &bundles[0];
    let name = b.file_name().unwrap().to_string_lossy().to_string();
    assert!(name.starts_with("eln-yajna-"), "{name}");
    assert!(out_dir.join(format!("{name}.tar.gz")).is_file());
    for f in [
        "index.html",
        "manifest.json",
        "SHA256SUMS",
        "PRJ-0001.html",
        "EXP-20261021-000001.html",
    ] {
        assert!(b.join(f).is_file(), "{f}");
    }
    assert!(b
        .join("source/notes/projects/PRJ-0001-toy/README.md")
        .is_file());
    let manifest: serde_json::Value =
        serde_json::from_str(&v.read(&b.join("manifest.json"))).unwrap();
    let head = git(&v.root, &["rev-parse", "HEAD"]);
    assert_eq!(manifest["commit"], head.trim());
    assert_eq!(manifest["pages"].as_array().unwrap().len(), 2);
    let sums = v.read(&b.join("SHA256SUMS"));
    assert!(
        sums.contains("  EXP-20261021-000001.html\n") && sums.contains("  manifest.json\n"),
        "{sums}"
    );
    assert!(
        fs::metadata(b.join("index.html"))
            .unwrap()
            .permissions()
            .readonly(),
        "read-only"
    );
    let record = v.root.join("notes/exports.tsv");
    assert!(v
        .read(&record)
        .starts_with("exported_at\tcommit\tbundle\tpages\tselection\n"));

    // uncommitted changes are refused, so a bundle always matches its commit
    let r = out(&[]);
    assert_eq!(r.code, 1, "exports.tsv itself is uncommitted");
    assert!(r.stderr.contains("uncommitted changes"), "{}", r.stderr);
    git(&v.root, &["add", "-A"]);
    git(&v.root, &["commit", "-q", "-m", "export recorded"]);
    let r = out(&[]);
    assert_eq!(r.code, 0);
    assert!(r.stdout.contains("nothing to export"), "{}", r.stdout);

    // a change to a page and to a run's sidecar exports just those pages
    let exp = first_md(&v.root.join("notes/projects/PRJ-0001-toy/experiments"));
    fs::write(
        &exp,
        v.read(&exp)
            + "\nSee [[PRJ-0001]] and [[EXP-20261021-000002]] and `[[EXP-20261021-000009]]`.\n",
    )
    .unwrap();
    assert_eq!(
        v.run(&["new", "experiment", "Second", "--project", "PRJ-0001"])
            .code,
        0
    );
    git(&v.root, &["add", "-A"]);
    git(&v.root, &["commit", "-q", "-m", "work"]);
    let r = out(&["--dry-run"]);
    assert!(
        r.stdout
            .contains("2 page(s) would be exported (changed since"),
        "{}",
        r.stdout
    );
    std::thread::sleep(std::time::Duration::from_millis(1100));
    let r = out(&[]);
    assert_eq!(r.code, 0, "{}{}", r.stdout, r.stderr);
    let newest = fs::read_dir(&out_dir)
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.is_dir() && p != b)
        .max()
        .unwrap();
    let html = v.read(&newest.join("EXP-20261021-000001.html"));
    assert!(
        html.contains("<a href=\"EXP-20261021-000002.html\">EXP-20261021-000002</a>"),
        "in the bundle: linked"
    );
    assert!(
        !html.contains("PRJ-0001.html") && html.contains("PRJ-0001"),
        "outside the bundle: plain text"
    );
    assert!(
        html.contains("<code>[[EXP-20261021-000009]]</code>"),
        "code spans untouched"
    );
    assert!(!newest.join("PRJ-0001.html").exists());
    assert_eq!(v.read(&record).lines().count(), 3);

    // named pages, and errors
    git(&v.root, &["add", "-A"]);
    git(&v.root, &["commit", "-q", "-m", "second export"]);
    let r = out(&["PRJ-0001", "--dry-run"]);
    assert!(
        r.stdout
            .contains("1 page(s) would be exported (named: PRJ-0001)"),
        "{}",
        r.stdout
    );
    assert_eq!(out(&["EXP-0099"]).code, 1);
}

#[test]
fn import_benchling_genbank_and_entries() {
    let v = vault();
    assert_eq!(v.run(&["new", "project", "Cloning"]).code, 0);
    let src = v.root.join("export");
    fs::create_dir_all(src.join("seq")).unwrap();
    fs::write(
        src.join("seq/plasmids.gb"),
        "LOCUS       pYJ001        2686 bp    DNA     circular SYN 19-OCT-2026\nDEFINITION  pUC19 backbone with sfGFP.\nFEATURES             Location/Qualifiers\n     CDS             100..817\n                     /label=\"sfGFP\"\nORIGIN\n        1 tcgcgcgttt\n//\nLOCUS       pYJ002        3000 bp    DNA     circular SYN 19-OCT-2026\n//\n",
    )
    .unwrap();
    fs::write(
        src.join("entry.json"),
        r#"{"id": "etr_abc", "displayId": "EXP123", "name": "Cloning sfGFP: day one",
            "createdAt": "2026-03-04T10:00:00Z", "modifiedAt": "2026-03-05T12:00:00Z",
            "creator": {"handle": "ank", "name": "Ankur"}, "webURL": "https://x.benchling.com/e/etr_abc",
            "days": [{"date": "2026-03-04", "notes": [
                {"type": "text", "text": "Digest with @EcoRI, ask @sam"},
                {"type": "list_checkbox", "checked": true, "text": "gel run"},
                {"type": "list_checkbox", "checked": false, "text": "sequence"},
                {"type": "table", "table": {"name": "Gel", "columnLabels": ["lane", "band"], "rows": [{"cells": [{"text": "1"}, {"text": "2.7 kb"}]}]}},
                {"type": "registration_table"}]}]}"#,
    )
    .unwrap();
    let srcs = src.to_str().unwrap();
    let out = v.run(&[
        "import",
        "benchling",
        srcs,
        "--project",
        "PRJ-0001",
        "--dry-run",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("would import 3"), "{}", out.stdout);
    assert!(!v.root.join("notes/materials/MAT-0001-pyj001.md").exists());

    let out = v.run(&["import", "benchling", srcs, "--project", "PRJ-0001"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(
        out.stdout.contains("imported 3, skipped 0"),
        "{}",
        out.stdout
    );
    let mat = v.read(&v.root.join("notes/materials/MAT-0001-pyj001.md"));
    assert!(
        mat.contains("kind: plasmid")
            && mat.contains("benchling: genbank:pYJ001")
            && mat.contains("source: Benchling"),
        "{mat}"
    );
    assert!(
        mat.contains("pUC19 backbone with sfGFP. 2686 bp circular DNA."),
        "{mat}"
    );
    assert!(mat.contains("| CDS | sfGFP | 100..817 |"), "{mat}");
    let gb = v.read(&v.root.join("notes/materials/MAT-0001/pyj001.gb"));
    assert!(
        gb.starts_with("LOCUS       pYJ001")
            && gb.trim_end().ends_with("//")
            && !gb.contains("pYJ002")
    );
    let exp = v.read(&v.root.join(
        "notes/projects/PRJ-0001-cloning/experiments/EXP-20261021-000001-cloning-sfgfp-day-one.md",
    ));
    assert!(
        exp.contains("title: \"Cloning sfGFP: day one\"") && exp.contains("status: concluded\n"),
        "{exp}"
    );
    assert!(
        exp.contains("created: 2026-03-04\n") && exp.contains("benchling: entry:etr_abc"),
        "{exp}"
    );
    assert!(
        exp.contains("## 2026-03-04\n") && exp.contains("&#64;EcoRI"),
        "{exp}"
    );
    assert!(exp.contains("- [x] gel run\n- [ ] sequence\n"), "{exp}");
    assert!(
        exp.contains("| 1 | 2.7 kb |") && exp.contains("`registration_table` part is not imported"),
        "{exp}"
    );
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);

    // a second import changes nothing
    let out = v.run(&["import", "benchling", srcs, "--project", "PRJ-0001"]);
    assert!(
        out.stdout.contains("imported 0, skipped 3"),
        "{}",
        out.stdout
    );
    // entries need a project; junk is refused
    let out = v.run(&[
        "import",
        "benchling",
        src.join("entry.json").to_str().unwrap(),
    ]);
    assert_eq!(
        out.code, 0,
        "already imported entries need nothing: {}",
        out.stderr
    );
    fs::write(src.join("other.json"), r#"{"id": "etr_new", "name": "N"}"#).unwrap();
    let out = v.run(&[
        "import",
        "benchling",
        src.join("other.json").to_str().unwrap(),
    ]);
    assert_eq!(out.code, 1);
    assert!(out.stderr.contains("--project"), "{}", out.stderr);
    fs::write(src.join("bad.json"), r#"{"x": 1}"#).unwrap();
    assert_eq!(
        v.run(&[
            "import",
            "benchling",
            src.join("bad.json").to_str().unwrap(),
            "--project",
            "PRJ-0001"
        ])
        .code,
        1
    );
}

/// What the fake Google API has seen and holds.
#[derive(Default)]
struct Drive {
    docs: std::collections::BTreeMap<String, (String, String)>, // id -> (last html upload, yajna_hash)
    uploads: usize,
    comments: std::collections::BTreeMap<String, Vec<serde_json::Value>>,
    resolved: Vec<String>,
    folders: std::collections::BTreeMap<String, serde_json::Value>, // id -> its metadata
    parents: std::collections::BTreeMap<String, Vec<String>>,       // doc or folder -> parents
    moves: usize,
    props: std::collections::BTreeMap<String, serde_json::Value>, // doc -> appProperties
    revisions: std::collections::BTreeMap<String, Vec<(String, String)>>, // doc -> (export, who)
}

/// Drive's Markdown export of an uploaded doc, as far as the tests need it: the header in
/// bold, headings bold, paragraphs on one line, list items as `> *`, links kept.
fn export_of(html: &str) -> String {
    let tag = regex::Regex::new(r"<[^>]+>").unwrap();
    let link = regex::Regex::new(r#"<a href="([^"]*)">([^<]*)</a>"#).unwrap();
    let block = regex::Regex::new(r"(?s)<(p|h1|h2|h3|li)>(.*?)</(?:p|h1|h2|h3|li)>").unwrap();
    let mut out: Vec<String> = Vec::new();
    for c in block.captures_iter(html) {
        let text = link.replace_all(&c[2], "[$2]($1)");
        let text = tag
            .replace_all(&text, "")
            .split_whitespace()
            .collect::<Vec<_>>()
            .join(" ")
            .replace("&quot;", "\"")
            .replace("&amp;", "&");
        out.push(match &c[1] {
            "h1" => format!("# **{text}**"),
            "h2" => format!("## **{text}**"),
            "h3" => format!("### **{text}**"),
            "li" => format!("> * {text}"),
            _ if out.is_empty() => format!(
                "**{}**",
                text.replacen(' ', "** ", 1).trim_end_matches("**")
            ),
            _ => text,
        });
    }
    out.join("\n\n")
}

impl Drive {
    /// The folder path a doc sits in, from its parent's `yajna_path` ("" for the root).
    fn path_of(&self, id: &str) -> Option<String> {
        let parent = self.parents.get(id)?.first()?;
        let folder = self.folders.get(parent)?;
        Some(
            folder["appProperties"]["yajna_path"]
                .as_str()
                .unwrap_or("")
                .to_string(),
        )
    }
}

/// A query parameter of a request target, percent-decoded.
fn query_param(target: &str, name: &str) -> Option<String> {
    let q = target.split_once('?')?.1;
    let raw = q
        .split('&')
        .find_map(|kv| kv.strip_prefix(&format!("{name}=")))?;
    let bytes = raw.as_bytes();
    let mut out = Vec::new();
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%' && i + 2 < bytes.len() {
            out.push(u8::from_str_radix(&raw[i + 1..i + 3], 16).unwrap());
            i += 3;
        } else {
            out.push(if bytes[i] == b'+' { b' ' } else { bytes[i] });
            i += 1;
        }
    }
    Some(String::from_utf8(out).unwrap())
}

/// A fake of the Drive endpoints `yajna sync` uses, on a free port.
fn fake_drive() -> (String, std::sync::Arc<std::sync::Mutex<Drive>>) {
    use std::io::{BufRead, BufReader, Read, Write};
    let listener = std::net::TcpListener::bind("127.0.0.1:0").unwrap();
    let base = format!("http://{}", listener.local_addr().unwrap());
    let state = std::sync::Arc::new(std::sync::Mutex::new(Drive::default()));
    let st = state.clone();
    let base_url = base.clone();
    std::thread::spawn(move || {
        for stream in listener.incoming() {
            let mut stream = stream.unwrap();
            let mut reader = BufReader::new(stream.try_clone().unwrap());
            let mut line = String::new();
            reader.read_line(&mut line).unwrap();
            let mut parts = line.split_whitespace();
            let (method, target) = (
                parts.next().unwrap_or("").to_string(),
                parts.next().unwrap_or("").to_string(),
            );
            let mut len = 0;
            loop {
                let mut h = String::new();
                reader.read_line(&mut h).unwrap();
                if h.trim().is_empty() {
                    break;
                }
                if let Some(v) = h.to_ascii_lowercase().strip_prefix("content-length:") {
                    len = v.trim().parse().unwrap();
                }
            }
            let mut body = vec![0; len];
            reader.read_exact(&mut body).unwrap();
            let body = String::from_utf8_lossy(&body).to_string();
            let path = target.split('?').next().unwrap().to_string();
            let mut d = st.lock().unwrap();
            let seg: Vec<&str> = path.trim_start_matches('/').split('/').collect();
            let hash_of = |b: &str| {
                b.split("\"yajna_hash\":\"")
                    .nth(1)
                    .map(|r| r[..r.find('"').unwrap()].to_string())
                    .unwrap_or_default()
            };
            let html_of = |b: &str| b[b.find("<html>").unwrap_or(0)..].to_string();
            // the JSON metadata part of a multipart upload
            let meta_of = |b: &str| -> serde_json::Value {
                b.split("\r\n\r\n")
                    .nth(1)
                    .and_then(|r| r.split("\r\n--").next())
                    .and_then(|m| serde_json::from_str(m).ok())
                    .unwrap_or_default()
            };
            let ids_of = |v: &serde_json::Value| -> Vec<String> {
                v.as_array()
                    .map(|a| {
                        a.iter()
                            .filter_map(|x| x.as_str().map(str::to_string))
                            .collect()
                    })
                    .unwrap_or_default()
            };
            let reply = match (method.as_str(), seg.as_slice()) {
                ("POST", ["upload", "drive", "v3", "files"]) => {
                    let id = format!("doc{}", d.docs.len() + 1);
                    d.docs.insert(id.clone(), (html_of(&body), hash_of(&body)));
                    let export = export_of(&html_of(&body));
                    d.revisions
                        .entry(id.clone())
                        .or_default()
                        .push((export, "Ank".into()));
                    let parents = ids_of(&meta_of(&body)["parents"]);
                    d.parents.insert(id.clone(), parents);
                    d.uploads += 1;
                    serde_json::json!({"id": id})
                }
                ("POST", ["drive", "v3", "files"]) => {
                    let meta: serde_json::Value = serde_json::from_str(&body).unwrap();
                    assert_eq!(meta["mimeType"], "application/vnd.google-apps.folder");
                    let id = format!("folder{}", d.folders.len() + 1);
                    d.parents.insert(id.clone(), ids_of(&meta["parents"]));
                    d.folders.insert(id.clone(), meta);
                    serde_json::json!({"id": id})
                }
                ("GET", ["drive", "v3", "files"]) => {
                    // only the appProperties clauses yajna sends: key='k' and value='v'
                    let q = query_param(&target, "q").unwrap();
                    let pairs: Vec<(String, String)> = q
                        .split("key='")
                        .skip(1)
                        .map(|c| {
                            let k = c[..c.find('\'').unwrap()].to_string();
                            let v = c.split("value='").nth(1).unwrap();
                            (k, v[..v.find('\'').unwrap()].to_string())
                        })
                        .collect();
                    let files: Vec<serde_json::Value> = d
                        .folders
                        .iter()
                        .filter(|(_, m)| {
                            pairs
                                .iter()
                                .all(|(k, v)| m["appProperties"][k] == v.as_str())
                        })
                        .map(|(id, _)| serde_json::json!({"id": id}))
                        .collect();
                    serde_json::json!({"files": files})
                }
                ("PATCH", ["drive", "v3", "files", id]) if !target.contains("addParents") => {
                    let meta: serde_json::Value = serde_json::from_str(&body).unwrap();
                    let props = d
                        .props
                        .entry(id.to_string())
                        .or_insert(serde_json::json!({}));
                    for (k, v) in meta["appProperties"].as_object().into_iter().flatten() {
                        if v.is_null() {
                            props.as_object_mut().unwrap().remove(k);
                        } else {
                            props[k] = v.clone();
                        }
                    }
                    serde_json::json!({"id": id})
                }
                ("PATCH", ["drive", "v3", "files", id]) => {
                    let add = query_param(&target, "addParents").unwrap_or_default();
                    let remove = query_param(&target, "removeParents").unwrap_or_default();
                    let entry = d.parents.entry(id.to_string()).or_default();
                    entry.retain(|p| !remove.split(',').any(|r| r == p));
                    entry.push(add);
                    d.moves += 1;
                    serde_json::json!({"id": id})
                }
                ("PATCH", ["upload", "drive", "v3", "files", id]) => {
                    d.docs
                        .insert(id.to_string(), (html_of(&body), hash_of(&body)));
                    let export = export_of(&html_of(&body));
                    d.revisions
                        .entry(id.to_string())
                        .or_default()
                        .push((export, "Ank".into()));
                    let props = d
                        .props
                        .entry(id.to_string())
                        .or_insert(serde_json::json!({}));
                    for (k, v) in meta_of(&body)["appProperties"]
                        .as_object()
                        .into_iter()
                        .flatten()
                    {
                        props[k] = v.clone();
                    }
                    d.uploads += 1;
                    serde_json::json!({"id": id})
                }
                ("GET", ["drive", "v3", "files", id]) => {
                    let h = d.docs.get(*id).map(|x| x.1.clone()).unwrap_or_default();
                    let parents = d.parents.get(*id).cloned().unwrap_or_default();
                    let mut props = d.props.get(*id).cloned().unwrap_or(serde_json::json!({}));
                    props["yajna_hash"] = h.into();
                    serde_json::json!({"id": id, "trashed": false, "appProperties": props, "parents": parents})
                }
                ("GET", ["drive", "v3", "files", id, "revisions"]) => {
                    let revs: Vec<serde_json::Value> = d
                        .revisions
                        .get(*id)
                        .into_iter()
                        .flatten()
                        .enumerate()
                        .map(|(n, (_, who))| serde_json::json!({"id": (n + 1).to_string(), "lastModifyingUser": {"displayName": who}}))
                        .collect();
                    serde_json::json!({"revisions": revs})
                }
                ("GET", ["drive", "v3", "files", id, "revisions", rev]) => {
                    serde_json::json!({"exportLinks": {"text/markdown": format!("{base_url}/export/{id}/{rev}")}})
                }
                ("GET", ["drive", "v3", "files", id, "export"]) => {
                    serde_json::Value::String(d.revisions[*id].last().unwrap().0.clone())
                }
                ("GET", ["export", id, rev]) => {
                    let n: usize = rev.parse().unwrap();
                    serde_json::Value::String(d.revisions[*id][n - 1].0.clone())
                }
                ("GET", ["drive", "v3", "files", id, "comments"]) => {
                    serde_json::json!({"comments": d.comments.get(*id).cloned().unwrap_or_default()})
                }
                ("POST", ["drive", "v3", "files", id, "comments", cid, "replies"]) => {
                    assert!(body.contains("\"resolve\""), "{body}");
                    let cid = cid.to_string();
                    for c in d.comments.get_mut(*id).into_iter().flatten() {
                        if c["id"] == cid.as_str() {
                            c["resolved"] = true.into();
                        }
                    }
                    d.resolved.push(cid);
                    serde_json::json!({"id": "r1"})
                }
                _ => serde_json::json!({"error": format!("{method} {path}")}),
            };
            // an export is text, everything else JSON
            let text = match reply {
                serde_json::Value::String(s) => s,
                other => other.to_string(),
            };
            write!(stream, "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{text}", text.len()).unwrap();
        }
    });
    (base, state)
}

#[test]
fn mirror_pages_pull_doc_edits_as_a_merge_and_publish_only_when_committed() {
    let v = vault();
    git(&v.root, &["init", "-q", "-b", "main"]);
    git(&v.root, &["add", "-A"]);
    git(&v.root, &["commit", "-q", "-m", "lab"]);
    let out = v.run(&[
        "new",
        "doc",
        "Plan",
        "--kind",
        "note",
        "--dir",
        "notes/docs",
    ]);
    let page = v.path(&out);
    let text = v.read(&page).replace(
        "sync: {provider: gdoc, mode: publish}",
        "sync: {provider: gdoc, mode: mirror}",
    );
    let fm = &text[..text.find("\n---\n").unwrap() + 5];
    let body = "\n## Purpose\nWe grow the strain at 30C for two days, with `yajna` keeping the\nnotes, and measure the doubling time.\n\n## Next steps\n- [ ] order media\n- [ ] book the reader\n";
    fs::write(&page, format!("{fm}{body}")).unwrap();
    let (base, drive) = fake_drive();
    let env = [("YAJNA_GDOC_API", base.as_str()), ("YAJNA_GDOC_TOKEN", "t")];
    let sync = |args: &[&str]| {
        let mut a = vec!["sync"];
        a.extend_from_slice(args);
        v.run_with(&a, None, &env)
    };
    let commit = |msg: &str| {
        git(&v.root, &["add", "-A"]);
        git(&v.root, &["commit", "-q", "-m", msg]);
    };

    // a mirror page publishes only what is committed
    let out = sync(&[]);
    assert!(out.stdout.contains("it is not committed"), "{}", out.stdout);
    assert_eq!(
        drive.lock().unwrap().uploads,
        0,
        "no doc for a page that cannot publish"
    );
    commit("plan");
    let out = sync(&[]);
    assert!(
        out.stdout.contains("1 published"),
        "{}{}",
        out.stdout,
        out.stderr
    );
    let doc = v
        .read(&page)
        .split("doc_id: ")
        .nth(1)
        .unwrap()
        .split('}')
        .next()
        .unwrap()
        .to_string();
    let props = drive.lock().unwrap().props[&doc].clone();
    let head = git(&v.root, &["rev-parse", "HEAD"]);
    assert_eq!(props["yajna_commit"], head.trim(), "{props}");
    assert_eq!(props["yajna_rev"], "2", "{props}");
    assert!(drive.lock().unwrap().docs[&doc]
        .0
        .contains("edits and comments here come back"));
    commit("doc id");
    assert!(sync(&["pull"]).stdout.contains("no edits in the doc"));

    // someone edits the doc; the repo changes another line meanwhile
    let edit = |d: &mut Drive, from: &str, to: &str, who: &str| {
        let revs = d.revisions.get_mut(&doc).unwrap();
        let now = revs.last().unwrap().0.clone();
        assert!(now.contains(from), "{now}");
        revs.push((now.replace(from, to), who.to_string()));
    };
    edit(
        &mut drive.lock().unwrap(),
        "at 30C for two days",
        "at 37C for two days",
        "Sam Lee",
    );
    edit(
        &mut drive.lock().unwrap(),
        "☐ book the reader",
        "☑ book the reader",
        "Sam Lee",
    );
    fs::write(
        &page,
        v.read(&page).replace("order media", "order YPD media"),
    )
    .unwrap();
    commit("ypd");
    let out = sync(&[]);
    assert!(
        out.stdout
            .contains("the doc has edits that are not in the page"),
        "{}",
        out.stdout
    );
    let uploads = drive.lock().unwrap().uploads;

    let out = sync(&["pull"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(
        out.stdout.contains("pulled notes/docs/")
            && out
                .stdout
                .contains("2 edited line(s) from the doc by Sam Lee"),
        "{}",
        out.stdout
    );
    let pulled = v.read(&page);
    assert!(
        pulled.contains("We grow the strain at 37C for two days, with `yajna` keeping the\nnotes,")
            && pulled.contains("- [ ] order YPD media\n- [x] book the reader\n"),
        "{pulled}"
    );
    assert!(
        git(&v.root, &["status", "--porcelain"]).contains(" M notes/docs/"),
        "pull commits nothing"
    );

    // edits thrown away after a pull are still the doc's: sync refuses, a pull brings them again
    git(&v.root, &["checkout", "--", "."]);
    let out = sync(&[]);
    assert!(
        out.stdout
            .contains("the doc has edits that are not in the page"),
        "{}",
        out.stdout
    );
    let out = sync(&["pull"]);
    assert!(
        out.stdout
            .contains("2 edited line(s) from the doc by Sam Lee"),
        "{}",
        out.stdout
    );
    assert_eq!(v.read(&page), pulled);
    let out = sync(&["pull"]);
    assert!(
        out.stdout
            .contains("the doc's edits by Sam Lee are already in the page"),
        "{}",
        out.stdout
    );
    assert_eq!(drive.lock().unwrap().uploads, uploads);

    // overlapping edits on both sides are left as markers; validate and sync refuse them
    commit("pulled");
    edit(
        &mut drive.lock().unwrap(),
        "measure the doubling time",
        "measure the lag phase",
        "Sam Lee",
    );
    fs::write(
        &page,
        v.read(&page)
            .replace("measure the doubling time", "measure the growth rate"),
    )
    .unwrap();
    commit("growth rate");
    let out = sync(&[]);
    assert!(
        out.stdout
            .contains("the doc has edits that are not in the page"),
        "a line changed on both sides is not resolved before a pull shows it: {}",
        out.stdout
    );
    let out = sync(&["pull"]);
    assert!(
        out.stdout.contains("1 conflict(s) left as markers"),
        "{}",
        out.stdout
    );
    let conflicted = v.read(&page);
    assert!(
        conflicted.contains("<<<<<<< this page") && conflicted.contains(">>>>>>> the doc"),
        "{conflicted}"
    );
    assert_eq!(v.run(&["validate"]).code, 1);
    assert!(sync(&[]).stdout.contains("conflict markers"));

    // resolved and committed, the next sync publishes over the pulled edits
    let resolved = regex::Regex::new(r"(?s)<<<<<<< this page\n.*?>>>>>>> the doc\n")
        .unwrap()
        .replace(
            &conflicted,
            "notes, and measure the growth rate and the lag phase.\n",
        )
        .into_owned();
    fs::write(&page, resolved).unwrap();
    assert_eq!(
        v.run(&["validate"]).code,
        0,
        "{}",
        v.run(&["validate"]).stdout
    );
    commit("resolved");
    let out = sync(&[]);
    assert!(out.stdout.contains("1 published"), "{}", out.stdout);
    let d = drive.lock().unwrap();
    assert!(d.docs[&doc].0.contains("growth rate and the lag phase"));
    assert_eq!(
        d.props[&doc]["yajna_rev"],
        d.revisions[&doc].len().to_string()
    );
    assert!(d.props[&doc].get("yajna_pulled").is_none());
}

#[test]
fn sync_publishes_and_pulls_comments_back() {
    let v = vault();
    v.run(&["new", "project", "Archaea"]);
    v.run(&["new", "protocol", "Transformation"]);
    v.run(&["new", "experiment", "Timing", "--project", "PRJ-0001"]);
    let prj = v.root.join("notes/projects/PRJ-0001-archaea/README.md");
    let exp = first_md(&v.root.join("notes/projects/PRJ-0001-archaea/experiments"));
    for p in [&prj, &exp] {
        fs::write(
            p,
            v.read(p).replace(
                "\ntags: []\n",
                "\ntags: []\nsync: {provider: gdoc, mode: publish}\n",
            ),
        )
        .unwrap();
    }
    fs::write(
        &exp,
        v.read(&exp)
            + "\nPart of [[PRJ-0001|the project]]; not [[PRO-0001]].\n\n- [ ] open\n- [x] done\n",
    )
    .unwrap();
    assert_eq!(v.run(&["validate"]).code, 0);
    let (base, drive) = fake_drive();
    let env = [("YAJNA_GDOC_API", base.as_str()), ("YAJNA_GDOC_TOKEN", "t")];
    let sync = |args: &[&str]| {
        let mut a = vec!["sync"];
        a.extend_from_slice(args);
        v.run_with(&a, None, &env)
    };

    let out = sync(&["--dry-run"]);
    assert!(out.stdout.contains("create a new doc"), "{}", out.stdout);
    assert_eq!(drive.lock().unwrap().uploads, 0, "dry run is offline");

    // first sync: both pages get a doc, their IDs land in the frontmatter, links point at docs
    let out = sync(&[]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(
        out.stdout.contains("2 page(s) synced: 2 published"),
        "{}",
        out.stdout
    );
    let prj_text = v.read(&prj);
    assert!(
        prj_text.contains("sync: {provider: gdoc, mode: publish, doc_id: doc"),
        "{prj_text}"
    );
    let exp_doc = v
        .read(&exp)
        .split("doc_id: ")
        .nth(1)
        .unwrap()
        .split('}')
        .next()
        .unwrap()
        .to_string();
    let prj_doc = prj_text
        .split("doc_id: ")
        .nth(1)
        .unwrap()
        .split('}')
        .next()
        .unwrap()
        .to_string();
    let html = drive.lock().unwrap().docs[&exp_doc].0.clone();
    assert!(
        html.contains(&format!(
            "href=\"https://docs.google.com/document/d/{prj_doc}/edit\">the project</a>"
        )),
        "{html}"
    );
    assert!(
        html.contains("not PRO-0001") && html.contains("<b>EXP-20261021-000001</b>"),
        "{html}"
    );
    // Docs drops <input> on import, so task state travels as a character
    assert!(
        html.contains("☐ open") && html.contains("☑ done") && !html.contains("<input"),
        "{html}"
    );
    assert_eq!(v.run(&["validate"]).code, 0);
    // docs mirror the notebook's folders without notes/, under one root named after it
    {
        let d = drive.lock().unwrap();
        assert_eq!(
            d.path_of(&prj_doc).as_deref(),
            Some("projects/PRJ-0001-archaea")
        );
        assert_eq!(
            d.path_of(&exp_doc).as_deref(),
            Some("projects/PRJ-0001-archaea/experiments")
        );
        let roots: Vec<_> = d
            .folders
            .values()
            .filter(|m| m["appProperties"]["yajna_notebook"].is_string())
            .collect();
        assert_eq!(roots.len(), 1);
        assert_eq!(
            d.folders.len(),
            4,
            "root, projects, the project, experiments"
        );
    }

    // nothing changed: nothing uploaded, no folder made twice, nothing moved
    let before = drive.lock().unwrap().uploads;
    let out = sync(&[]);
    assert!(out.stdout.contains("0 published"), "{}", out.stdout);
    assert!(out.stdout.contains("0 moved"), "{}", out.stdout);
    assert_eq!(drive.lock().unwrap().uploads, before);
    assert_eq!(drive.lock().unwrap().folders.len(), 4);

    // a comment in the doc comes back under ## Review, and is not republished into the doc
    drive.lock().unwrap().comments.insert(prj_doc.clone(), vec![serde_json::json!({
        "id": "c1", "author": {"displayName": "The PI"}, "content": "Is this @ 37C?",
        "quotedFileContent": {"value": "Current belief"}, "createdTime": "2026-10-19T10:00:00Z", "resolved": false,
        "replies": [{"author": {"displayName": "Ank"}, "content": "yes", "createdTime": "2026-10-19T11:00:00Z"}]})]);
    let out = sync(&[]);
    assert!(out.stdout.contains("1 new comment(s)"), "{}", out.stdout);
    let prj_text = v.read(&prj);
    assert!(prj_text.contains("## Review\n") && prj_text.contains("- [ ] The PI, 2026-10-19 on \"Current belief\": Is this &#64; 37C? <!-- gdoc:c1 -->\n  - Ank, 2026-10-19: yes\n"), "{prj_text}");
    assert!(
        !drive.lock().unwrap().docs[&prj_doc].0.contains("The PI"),
        "Review stays out of the doc"
    );
    assert_eq!(v.run(&["validate"]).code, 0);
    assert!(v.run(&["tasks"]).stdout.contains("Review: The PI"));

    // ticking it resolves the comment in the doc; editing the page republishes
    fs::write(
        &prj,
        v.read(&prj)
            .replace("- [ ] The PI", "- [x] The PI")
            .replace("## Open questions", "## Open questions\n- Is 37C right?"),
    )
    .unwrap();
    let out = sync(&["PRJ-0001"]);
    assert!(
        out.stdout
            .contains("1 page(s) synced: 1 published, 0 new comment(s), 1 resolved"),
        "{}",
        out.stdout
    );
    assert_eq!(drive.lock().unwrap().resolved, vec!["c1"]);
    assert!(drive.lock().unwrap().docs[&prj_doc]
        .0
        .contains("Is 37C right?"));
    let out = sync(&[]);
    assert!(
        out.stdout
            .contains("0 published, 0 new comment(s), 0 resolved"),
        "{}",
        out.stdout
    );

    // other modes are skipped, other providers too
    fs::write(&exp, v.read(&exp).replace("mode: publish", "mode: import")).unwrap();
    let out = sync(&[]);
    assert!(
        out.stdout.contains("mode import is not built yet"),
        "{}",
        out.stdout
    );
    let out = v.run_with(
        &["sync"],
        None,
        &[("YAJNA_GDOC_CREDENTIALS", "/nonexistent")],
    );
    assert_eq!(out.code, 1);
    assert!(out.stderr.contains("yajna sync login"), "{}", out.stderr);
}

#[test]
fn migrate_ids_moves_experiments_to_date_ids_the_same_way_everywhere() {
    // a notebook from before ADR-0022: counter experiments, a run and a session with the
    // old 4-character suffix
    let v = vault();
    assert_eq!(v.run(&["new", "project", "Toy"]).code, 0);
    let dir = v.root.join("notes/projects/PRJ-0001-toy");
    let page = |id: &str, ty: &str, extra: &str| {
        format!("---\nid: {id}\ntype: {ty}\nschema_version: 1\ntitle: {id} page\nproject: PRJ-0001\ncreated: 2026-10-16\nauthor: tester\n{extra}---\n")
    };
    fs::create_dir_all(dir.join("experiments/EXP-0002")).unwrap();
    fs::create_dir_all(dir.join("runs/RUN-20261016-k7f3")).unwrap();
    fs::write(
        dir.join("experiments/EXP-0001-first.md"),
        page("EXP-0001", "experiment", "status: concluded\n"),
    )
    .unwrap();
    fs::write(
        dir.join("experiments/EXP-0002-second.md"),
        page(
            "EXP-0002",
            "experiment",
            "status: active\ninfluenced_by: [EXP-0001]\n",
        ) + "\n## Runs\n- [[RUN-20261016-k7f3]] the sweep point\n\nData in `notes/projects/PRJ-0001-toy/experiments/EXP-0002/results.tsv`.\n",
    )
    .unwrap();
    fs::write(
        dir.join("experiments/EXP-0002/results.tsv"),
        "run\tfinished\tloss\nRUN-20261016-k7f3\t2026-10-16T09:31+01:00\t0.5\n",
    )
    .unwrap();
    fs::write(
        dir.join("runs/RUN-20261016-k7f3/run.sh"),
        "#!/bin/sh\necho RUN-20261016-k7f3\n",
    )
    .unwrap();
    fs::write(dir.join("runs/RUN-20261016-k7f3.md"), page("RUN-20261016-k7f3", "run",
        "kind: compute\nexperiment: EXP-0002\nstatus: done\nstarted: 2026-10-16T09:30+01:00\nscript: notes/projects/PRJ-0001-toy/runs/RUN-20261016-k7f3/run.sh\n")).unwrap();
    fs::write(v.root.join("notes/agents/AGS-20261016-ab2c.md"), "---\nid: AGS-20261016-ab2c\ntype: agent_session\nschema_version: 1\ntitle: s\nmodel: x\nstarted: 2026-10-16T07:00+01:00\ncreated_entities: [EXP-0001, RUN-20261016-k7f3]\noutcome: done\ncreated: 2026-10-16\nauthor: agent:claude\n---\n").unwrap();
    fs::write(
        v.root.join("notes/counters.yaml"),
        "PRJ: 1\nEXP: 2\nPRO: 0\n",
    )
    .unwrap();
    let prj = dir.join("README.md");
    fs::write(
        &prj,
        v.read(&prj)
            + "- [[EXP-0001]] the first\n- [[EXP-0002]] the second, after [[EXP-0001@1|it]]\n",
    )
    .unwrap();
    assert_eq!(
        v.run(&[
            "log",
            "ran [[RUN-20261016-k7f3]] for [[EXP-0002]]",
            "--date",
            "2026-10-16",
            "--time",
            "09:31"
        ])
        .code,
        0
    );
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "the legacy notebook is valid: {}", out.stdout);
    git(&v.root, &["init", "-q", "-b", "main"]);
    git(&v.root, &["add", "-A"]);
    git(&v.root, &["commit", "-q", "-m", "legacy"]);
    let other = empty();
    git(
        &v.root,
        &[
            "worktree",
            "add",
            "-q",
            "-b",
            "side",
            other.root.join("w").to_str().unwrap(),
        ],
    );
    let w = Vault {
        _dir: tempfile::tempdir().unwrap(),
        root: other.root.join("w"),
    };

    let dry = v.run(&["migrate-ids", "--dry-run"]);
    assert!(
        dry.stdout.contains("4 page(s) would be migrated"),
        "{}",
        dry.stdout
    );
    let out = v.run(&["migrate-ids"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    let out_w = w.run(&["migrate-ids"]);
    assert_eq!(out_w.code, 0, "{}", out_w.stderr);
    let mapping = |o: &str| -> std::collections::BTreeMap<String, String> {
        o.lines()
            .filter(|l| !l.starts_with("renamed") && l.contains(" -> "))
            .map(|l| {
                let m = l.split("  ").next().unwrap();
                let (a, b) = m.split_once(" -> ").unwrap();
                (a.to_string(), b.to_string())
            })
            .collect()
    };
    let map = mapping(&out.stdout);
    assert_eq!(
        map,
        mapping(&out_w.stdout),
        "every worktree migrates to the same IDs"
    );
    let (n1, n2, run, ags) = (
        &map["EXP-0001"],
        &map["EXP-0002"],
        &map["RUN-20261016-k7f3"],
        &map["AGS-20261016-ab2c"],
    );
    assert!(
        regex_like_date_id(n1) && regex_like_date_id(n2) && n1 < n2,
        "{map:?}"
    );
    // a run keeps its day and takes its recorded time of day: 08:30 UTC is 306000 tenths
    assert!(
        run.starts_with("RUN-20261016-9atg") && regex_like_date_id(run),
        "{run}"
    );
    assert!(ags.starts_with("AGS-20261016-6jy0"), "{ags}");

    let exps = dir.join("experiments");
    let page2 = v.read(&exps.join(format!("{n2}-second.md")));
    assert!(
        page2.contains(&format!("id: {n2}\nprevious_id: EXP-0002\n")),
        "{page2}"
    );
    assert!(
        page2.contains(&format!("influenced_by: [{n1}]"))
            && page2.contains(&format!("- [[{run}]] the sweep point")),
        "{page2}"
    );
    assert!(
        page2.contains(&format!("experiments/{n2}/results.tsv")),
        "paths are rewritten too: {page2}"
    );
    let tsv = v.read(&exps.join(n2).join("results.tsv"));
    assert!(
        tsv.contains(&format!("\n{run}\t")),
        "results.tsv names the new run: {tsv}"
    );
    let run_page = v.read(&dir.join("runs").join(format!("{run}.md")));
    assert!(
        run_page.contains(&format!("experiment: {n2}\n"))
            && run_page.contains(&format!(
                "script: notes/projects/PRJ-0001-toy/runs/{run}/run.sh"
            )),
        "{run_page}"
    );
    assert!(
        dir.join("runs").join(run).join("run.sh").is_file(),
        "the run's folder moved"
    );
    let agent = v.read(&v.root.join("notes/agents").join(format!("{ags}.md")));
    assert!(
        agent.contains(&format!("created_entities: [{n1}, {run}]")),
        "{agent}"
    );
    let prj_text = v.read(&prj);
    assert!(
        prj_text.contains(&format!("- [[{n2}]] the second, after [[{n1}@1|it]]")),
        "{prj_text}"
    );
    assert!(!v.read(&v.root.join("notes/counters.yaml")).contains("EXP:"));
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);

    // old IDs still find their pages and are written as the current ones
    let out = v.run(&["show", "RUN-20261016-k7f3"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.starts_with(run.as_str()), "{}", out.stdout);
    let out = v.run(&["new", "run", "--experiment", "EXP-0002"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(v
        .read(&v.path(&out))
        .contains(&format!("experiment: {n2}\n")));
    assert_eq!(v.run(&["validate"]).code, 0);
    fs::write(&prj, v.read(&prj) + "\nSee [[EXP-0001]].\n").unwrap();
    let out = v.run(&["validate"]);
    assert!(
        out.stdout
            .contains(&format!("link to EXP-0001, which is now {n1}")),
        "{}",
        out.stdout
    );
    fs::write(&prj, v.read(&prj).replace("\nSee [[EXP-0001]].\n", "")).unwrap();
    // a re-run repairs a path the first pass missed and leaves prose that names an old ID
    let note = v.root.join("notes/agents").join(format!("{ags}.md"));
    fs::write(
        &note,
        v.read(&note)
            + "\nEXP-0002 became a date ID; data in `experiments/EXP-0002/results.tsv`.\n",
    )
    .unwrap();
    let out = v.run(&["migrate-ids"]);
    assert!(out.stdout.contains("nothing to migrate"), "{}", out.stdout);
    let text = v.read(&note);
    assert!(
        text.contains(&format!(
            "\nEXP-0002 became a date ID; data in `experiments/{n2}/results.tsv`.\n"
        )),
        "{text}"
    );
}

#[test]
fn docs_go_where_asked_and_sync() {
    let v = vault();
    assert_eq!(v.run(&["new", "project", "Thesis"]).code, 0);
    // a thesis folder with an ordinary pandoc file already in it
    fs::create_dir_all(v.root.join("thesis")).unwrap();
    fs::write(
        v.root.join("thesis/chapter1.md"),
        "---\ntitle: Chapter 1\nbibliography: refs.bib\n---\nText.\n",
    )
    .unwrap();

    let out = v.run(&[
        "new",
        "doc",
        "Committee meeting",
        "--kind",
        "meeting",
        "--dir",
        "thesis/meetings",
        "--project",
        "PRJ-0001",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert_eq!(
        out.stdout.trim(),
        "thesis/meetings/DOC-20261021-000001-committee-meeting.md"
    );
    assert!(
        out.stderr.contains("registered thesis/ under [docs]"),
        "{}",
        out.stderr
    );
    let cfg = v.read(&v.root.join("yajna.toml"));
    assert!(cfg.contains("\n[docs]\ndirs = [\"thesis\"]"), "{cfg}");
    let page = v.read(&v.path(&out));
    assert!(
        page.contains("kind: meeting\n")
            && page.contains("sync: {provider: gdoc, mode: publish}")
            && page.contains("### Actions")
            && page.contains("### Transcript"),
        "{page}"
    );
    let date = page
        .split("\ndate: ")
        .nth(1)
        .unwrap()
        .split(' ')
        .next()
        .unwrap();
    assert!(
        page.contains("project: PRJ-0001\n") && page.contains(&format!("\n## {date}\n")),
        "{page}"
    );
    fs::write(v.path(&out), page.replace("### Actions\nEach action as a checkbox with who and by when; `yajna tasks` lists the open ones.\n- [ ] \n", "### Actions\n- [ ] send the slides to the committee\n")).unwrap();

    // a second doc in the registered folder; the default location; the folder question
    let out = v.run(&[
        "new",
        "doc",
        "Budget",
        "--kind",
        "admin",
        "--dir",
        "thesis/admin",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(!out.stderr.contains("registered"), "already covered");
    assert_eq!(
        v.read(&v.root.join("yajna.toml"))
            .matches("dirs = ")
            .count(),
        1
    );
    let out = v.run(&["new", "doc", "Lab rota"]);
    assert_eq!(
        out.stdout.trim(),
        "notes/docs/DOC-20261021-000003-lab-rota.md",
        "{}",
        out.stderr
    );
    assert!(v.read(&v.path(&out)).contains("kind: note "));
    let out = v.run_with(
        &["new"],
        None,
        &[(
            "YAJNA_ANSWERS",
            "doc\nVisa letter\nlogistics\nthesis/logistics",
        )],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout
            .contains("thesis/logistics/DOC-20261021-000004-visa-letter.md"),
        "{}",
        out.stdout
    );

    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(
        out.stdout.contains("5 page(s)"),
        "the pandoc chapter is not a page: {}",
        out.stdout
    );
    assert!(v
        .run(&["tasks"])
        .stdout
        .contains("send the slides to the committee"));
    let out = v.run(&["sync", "--dry-run"]);
    assert!(
        out.stdout.contains(
            "thesis/meetings/DOC-20261021-000001-committee-meeting.md: create a new doc in thesis/meetings"
        ) && out.stdout.contains("notes/docs/DOC-20261021-000003-lab-rota.md: create a new doc in docs"),
        "{}",
        out.stdout
    );
    // docs outside the vault keep their repo path in Drive, and follow the page when it moves
    let (base, drive) = fake_drive();
    let env = [("YAJNA_GDOC_API", base.as_str()), ("YAJNA_GDOC_TOKEN", "t")];
    let out = v.run_with(&["sync"], None, &env);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    let meeting = v
        .root
        .join("thesis/meetings/DOC-20261021-000001-committee-meeting.md");
    let doc_of = |p: &Path| {
        v.read(p)
            .split("doc_id: ")
            .nth(1)
            .unwrap()
            .split('}')
            .next()
            .unwrap()
            .to_string()
    };
    let meeting_doc = doc_of(&meeting);
    let rota_doc = doc_of(&v.root.join("notes/docs/DOC-20261021-000003-lab-rota.md"));
    assert_eq!(
        drive.lock().unwrap().path_of(&meeting_doc).as_deref(),
        Some("thesis/meetings")
    );
    assert_eq!(
        drive.lock().unwrap().path_of(&rota_doc).as_deref(),
        Some("docs")
    );
    fs::create_dir_all(v.root.join("thesis/archive")).unwrap();
    fs::rename(
        &meeting,
        v.root
            .join("thesis/archive/DOC-20261021-000001-committee-meeting.md"),
    )
    .unwrap();
    let out = v.run_with(&["sync"], None, &env);
    assert!(
        out.stdout.contains(
            "moved thesis/archive/DOC-20261021-000001-committee-meeting.md -> thesis/archive"
        ) && out.stdout.contains("1 moved"),
        "{}",
        out.stdout
    );
    assert_eq!(
        drive.lock().unwrap().path_of(&meeting_doc).as_deref(),
        Some("thesis/archive")
    );
    assert_eq!(drive.lock().unwrap().moves, 1);
    let site = v.root.join("site");
    assert_eq!(v.run(&["site", "--out", site.to_str().unwrap()]).code, 0);
    assert!(v.read(&site.join("index.html")).contains("<h2>Docs</h2>"));
    assert!(site.join("DOC-20261021-000001.html").is_file());

    assert_eq!(v.run(&["new", "doc", "X", "--dir", "../outside"]).code, 1);
    assert_eq!(
        v.run(&[
            "new",
            "experiment",
            "E",
            "--project",
            "PRJ-0001",
            "--dir",
            "thesis"
        ])
        .code,
        1
    );
}

#[test]
fn citations_resolve_in_the_page_bibliography_and_render_through_pandoc() {
    let v = vault();
    let out = v.run(&[
        "new", "doc", "Proposal", "--kind", "proposal", "--dir", "thesis",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let page = v.path(&out);
    // Zotero writes italics in titles as HTML
    let bib = "@article{shih2015cloning,\n title={A versatile microfluidic device for <i>Escherichia coli</i>},\n author={Shih, Steve and Moraes, Christopher},\n year={2015},\n journal={ACS Synth Biol}\n}\n";
    fs::write(v.root.join("thesis/refs.bib"), bib).unwrap();
    let text = v
        .read(&page)
        .replacen("\ntags: []\n", "\ntags: []\nbibliography: refs.bib\n", 1);
    fs::write(
        &page,
        format!("{text}\nBuilds on [@shih2015cloning].\n- [ ] ask the committee\n"),
    )
    .unwrap();
    // the page's own bibliography counts for validation
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    fs::write(&page, v.read(&page) + "And @nobody2020.\n").unwrap();
    let out = v.run(&["validate"]);
    assert!(
        out.stdout
            .contains("citation @nobody2020 not in references/library.bib or thesis/refs.bib"),
        "{}",
        out.stdout
    );
    fs::write(&page, v.read(&page).replace("And @nobody2020.\n", "")).unwrap();

    let (base, drive) = fake_drive();
    let env = [("YAJNA_GDOC_API", base.as_str()), ("YAJNA_GDOC_TOKEN", "t")];
    assert!(v
        .run(&["sync", "--dry-run"])
        .stdout
        .contains("citations through pandoc"));
    // without pandoc the page is skipped with the reason, and nothing else breaks
    let out = v.run_with(&["sync"], None, &[env[0], env[1], ("PATH", "/nonexistent")]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(
        out.stdout
            .contains("rendering citations needs pandoc on PATH"),
        "{}",
        out.stdout
    );
    // with pandoc: author-year citations and a reference list, task state as characters
    let out = v.run_with(&["sync"], None, &env);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(out.stdout.contains("1 published"), "{}", out.stdout);
    let html = drive
        .lock()
        .unwrap()
        .docs
        .values()
        .next()
        .unwrap()
        .0
        .clone();
    assert!(
        html.contains("Shih and Moraes 2015")
            && html.contains(">References</h2>")
            && html.contains("A Versatile Microfluidic Device for <em><span>Escherichia</span> <span class=\"nocase\">coli</span></em>")
            && html.contains("<p style=\"margin-top:0;margin-bottom:8pt;line-height:1.3;font-size:10pt\">Shih, Steve")
            && !html.contains("csl-entry")
            && !html.contains("id=\"refs\"")
            && !html.contains("&lt;i&gt;")
            && html.contains("☐ ask the committee")
            && !html.contains("@shih2015cloning"),
        "{html}"
    );
    // a missing bibliography file is a validation problem
    fs::remove_file(v.root.join("thesis/refs.bib")).unwrap();
    let out = v.run(&["validate"]);
    assert!(
        out.stdout
            .contains("bibliography thesis/refs.bib does not exist"),
        "{}",
        out.stdout
    );
}

#[test]
fn adopt_makes_pages_of_existing_files() {
    let v = vault();
    assert_eq!(v.run(&["new", "project", "Thesis"]).code, 0);
    let bib = "@article{shih2015cloning,\n title={A versatile microfluidic device},\n author={Shih, Steve},\n year={2015}\n}\n";
    let adopt = |file: &Path, extra: &[&str]| {
        let f = file.to_str().unwrap().to_string();
        let mut a = vec!["adopt", f.as_str()];
        a.extend_from_slice(extra);
        v.run(&a)
    };

    // a plain markdown file with a .bib beside it: a proposal doc, kept where it is
    fs::create_dir_all(v.root.join("thesis/proposals")).unwrap();
    let src = v.root.join("thesis/proposals/g2a-proposal.md");
    fs::write(&src, "## Question\nWhy? [@shih2015cloning]\n").unwrap();
    fs::write(v.root.join("thesis/proposals/g2a-proposal.bib"), bib).unwrap();
    let out = adopt(&src, &["--kind", "proposal", "--dry-run"]);
    assert!(
        out.stdout
            .contains("would become a doc (proposal) titled \"g2a proposal\"")
            && out.stdout.contains("with bibliography g2a-proposal.bib"),
        "{}",
        out.stdout
    );
    assert!(src.is_file(), "a dry run changes nothing");
    let out = adopt(&src, &["--kind", "proposal", "--title", "G2A proposal"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert_eq!(
        out.stdout.trim(),
        "thesis/proposals/DOC-20261021-000001-g2a-proposal.md"
    );
    assert!(!src.exists());
    let page = v.read(&v.path(&out));
    assert!(
        page.contains("title: G2A proposal\n")
            && page.contains("kind: proposal")
            && page.contains("sync: {provider: gdoc, mode: publish}")
            && page.contains(
                "bibliography: g2a-proposal.bib\n---\n\n## Question\nWhy? [@shih2015cloning]\n"
            )
            && !page.contains("## Purpose"),
        "{page}"
    );
    assert!(v
        .read(&v.root.join("yajna.toml"))
        .contains("dirs = [\"thesis\"]"));
    assert_eq!(adopt(&v.path(&out), &[]).code, 1, "already a page");

    // a pandoc file: its own keys stay, title is the page's, author becomes authors
    let src = v.root.join("thesis/chapter2.md");
    fs::write(
        &src,
        "---\ntitle: \"Chapter 2: methods\"\nauthor: Ank Kumar\nlang: en-GB\n---\n# Chapter 2: methods\n\nText.\n",
    )
    .unwrap();
    let out = adopt(&src, &["--kind", "report"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let page = v.read(&v.path(&out));
    assert!(
        page.contains("title: \"Chapter 2: methods\"")
            && page.contains("\nauthors: Ank Kumar\n")
            && page.contains("\nlang: en-GB\n")
            && page.ends_with("---\n\nText.\n"),
        "{page}"
    );

    // other types move to where they live; their flags work as for `new`
    fs::create_dir_all(v.root.join("old")).unwrap();
    let src = v.root.join("old/pcr.md");
    fs::write(&src, "# PCR\n\n## Steps\n1. Mix. {duration: 5m}\n").unwrap();
    let out = adopt(&src, &["--type", "protocol", "--kind", "compute"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert_eq!(out.stdout.trim(), "notes/protocols/PRO-0001-pcr.md");
    assert!(v.read(&v.path(&out)).contains("\nkind: compute "));
    let src = v.root.join("old/spike.md");
    fs::write(&src, "Tried a thing.\n").unwrap();
    assert_eq!(
        adopt(&src, &["--type", "experiment"]).code,
        1,
        "needs --project"
    );
    let out = adopt(&src, &["--type", "experiment", "--project", "PRJ-0001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out
        .stdout
        .contains("notes/projects/PRJ-0001-thesis/experiments/EXP-"));

    // frontmatter yajna writes itself is refused before anything is made
    let src = v.root.join("old/done.md");
    fs::write(&src, "---\nstatus: done\n---\nx\n").unwrap();
    let out = adopt(&src, &[]);
    assert_eq!(out.code, 1);
    assert!(out.stderr.contains("sets status"), "{}", out.stderr);
    assert!(src.is_file());
    assert_eq!(adopt(Path::new("/etc/hosts"), &[]).code, 1);

    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
}

/// Start `yajna <args> --port 0 --out <root>/site` and return the child and its address.
fn spawn_server(v: &Vault, args: &[&str]) -> (std::process::Child, String) {
    use std::io::{BufRead, BufReader};
    let mut child = Command::new(env!("CARGO_BIN_EXE_yajna"))
        .arg("--root")
        .arg(&v.root)
        .args(args)
        .args(["--port", "0", "--out"])
        .arg(v.root.join("site"))
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
    (child, url)
}

/// A raw HTTP/1.1 GET with the given Host header; the whole response as text.
fn http_get(addr: &str, host: &str, path: &str) -> String {
    use std::io::{Read, Write};
    let mut s = std::net::TcpStream::connect(addr).unwrap();
    write!(
        s,
        "GET {path} HTTP/1.1\r\nHost: {host}\r\nConnection: close\r\n\r\n"
    )
    .unwrap();
    let mut body = String::new();
    s.read_to_string(&mut body).unwrap();
    body
}

#[test]
fn serve_answers_http_rerenders_and_checks_the_host() {
    let v = indexed_lab();
    let (mut child, addr) = spawn_server(&v, &["serve", "--host", "box.tail1234.ts.net"]);
    let get = |path: &str| http_get(&addr, "localhost:8765", path);
    let home = get("/");
    assert!(home.starts_with("HTTP/1.1 200 OK"), "{home}");
    assert!(
        home.contains("text/html") && home.contains("Archaeal division"),
        "{home}"
    );
    assert!(get("/EXP-20261021-000001.html").contains("ESCRT timing"));
    assert!(get("/nope.html").starts_with("HTTP/1.1 404"));
    assert!(
        get("/../yajna.toml").starts_with("HTTP/1.1 404"),
        "no traversal"
    );
    assert!(
        get("/..%2Fyajna.toml").starts_with("HTTP/1.1 404"),
        "no encoded traversal"
    );
    // DNS rebinding: a page elsewhere reaching the port by another name is refused
    let foreign = http_get(&addr, "evil.example", "/");
    assert!(foreign.starts_with("HTTP/1.1 403"), "{foreign}");
    assert!(!foreign.contains("Archaeal"));
    assert!(http_get(&addr, "box.tail1234.ts.net", "/").starts_with("HTTP/1.1 200"));
    // a change in the vault shows up on the next request
    std::thread::sleep(std::time::Duration::from_millis(20));
    assert_eq!(v.run(&["new", "equipment", "Spinning disk"]).code, 0);
    assert!(
        get("/EQP-0001.html").contains("Spinning disk"),
        "re-rendered after a change"
    );
    child.kill().unwrap();
    let _ = child.wait();

    // `site --serve` is the same server
    let (mut child, addr) = spawn_server(&v, &["site", "--serve"]);
    assert!(http_get(&addr, "127.0.0.1", "/EQP-0001.html").contains("Spinning disk"));
    assert!(http_get(&addr, "evil.example", "/").starts_with("HTTP/1.1 403"));
    child.kill().unwrap();
    let _ = child.wait();
}

/// A raw HTTP/1.1 GET with extra header lines: (status line, headers, body bytes).
fn http_req(addr: &str, path: &str, extra: &[&str]) -> (String, String, Vec<u8>) {
    use std::io::{Read, Write};
    let mut s = std::net::TcpStream::connect(addr).unwrap();
    let mut req = format!("GET {path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n");
    for h in extra {
        req.push_str(h);
        req.push_str("\r\n");
    }
    req.push_str("\r\n");
    s.write_all(req.as_bytes()).unwrap();
    let mut buf = Vec::new();
    s.read_to_end(&mut buf).unwrap();
    let split = buf.windows(4).position(|w| w == b"\r\n\r\n").unwrap();
    let head = String::from_utf8_lossy(&buf[..split]).to_string();
    let (status, headers) = head.split_once("\r\n").unwrap_or((&head, ""));
    (
        status.to_string(),
        headers.to_lowercase(),
        buf[split + 4..].to_vec(),
    )
}

fn api_json(addr: &str, path: &str) -> (String, serde_json::Value) {
    let (status, _, body) = http_req(addr, path, &[]);
    (status, serde_json::from_slice(&body).unwrap())
}

#[test]
fn serve_files_api_lists_reads_and_refuses() {
    let v = indexed_lab();
    let scratch = tempfile::tempdir().unwrap();
    let s = scratch.path();
    // code/: a script, a binary, an image, a big directory, excluded things, a link out
    let code = v.root.join("code");
    fs::create_dir_all(code.join("big")).unwrap();
    for i in 0..1203 {
        fs::write(code.join(format!("big/f{i:04}.txt")), "").unwrap();
    }
    fs::write(code.join("run.py"), "print('hi')\n").unwrap();
    fs::write(code.join("data.bin"), b"\x00\x01\x02").unwrap();
    fs::write(code.join("plot.png"), b"\x89PNG\r\n\x1a\n").unwrap();
    for d in [".git", "node_modules", "out"] {
        fs::create_dir_all(code.join(d)).unwrap();
        fs::write(code.join(d).join("x"), "x").unwrap();
    }
    fs::write(code.join("out/model.ckpt"), "w").unwrap();
    std::os::unix::fs::symlink(s, code.join("scratch-link")).unwrap();
    // the scratch root outside the repo, with a loop back to itself
    let log: String = (0..100).map(|i| format!("line {i:03}\n")).collect();
    fs::write(s.join("train.log"), &log).unwrap();
    std::os::unix::fs::symlink(s, s.join("again")).unwrap();
    let cfg = v.root.join("yajna.toml");
    let base = v.read(&cfg);
    fs::write(
        &cfg,
        format!(
            "{base}\n[files]\nexclude = [\"node_modules\"]\n\n[[files.roots]]\nname = \"code\"\npath = \"code\"\nexclude = [\"*.ckpt\"]\n\n[[files.roots]]\nname = \"scratch\"\npath = \"{}\"\nwatch = \"poll\"\n\n[[files.roots]]\nname = \"gone\"\npath = \"$YAJNA_TEST_SURELY_UNSET/runs\"\n",
            s.display()
        ),
    )
    .unwrap();
    assert_eq!(v.run(&["validate"]).code, 0);

    let (mut child, addr) = spawn_server(&v, &["serve"]);
    let (status, roots) = api_json(&addr, "/api/files/roots");
    assert!(status.ends_with("200 OK"), "{status}");
    let names: Vec<(&str, bool, &str)> = roots
        .as_array()
        .unwrap()
        .iter()
        .map(|r| {
            (
                r["name"].as_str().unwrap(),
                r["exists"].as_bool().unwrap(),
                r["watch"].as_str().unwrap(),
            )
        })
        .collect();
    assert_eq!(
        names,
        [
            ("code", true, "auto"),
            ("scratch", true, "poll"),
            ("gone", false, "auto")
        ]
    );

    // directories first, excluded names absent, links resolved
    let (_, l) = api_json(&addr, "/api/files/list?path=code");
    let entries: Vec<(&str, &str)> = l["entries"]
        .as_array()
        .unwrap()
        .iter()
        .map(|e| (e["name"].as_str().unwrap(), e["kind"].as_str().unwrap()))
        .collect();
    assert_eq!(
        entries,
        [
            ("big", "dir"),
            ("out", "dir"),
            ("scratch-link", "dir"),
            ("data.bin", "file"),
            ("plot.png", "file"),
            ("run.py", "file"),
        ]
    );
    let link = &l["entries"][2];
    assert_eq!(link["link"].as_str().unwrap(), s.to_str().unwrap());
    assert_eq!(l["entries"][5]["size"], 12);
    let (_, out) = api_json(&addr, "/api/files/list?path=code/out");
    assert_eq!(out["total"], 1, "*.ckpt excluded in this root: {out}");

    // pages of 500
    let (_, p0) = api_json(&addr, "/api/files/list?path=code/big");
    assert_eq!(
        (p0["total"].as_u64(), p0["next"].as_u64()),
        (Some(1203), Some(500))
    );
    assert_eq!(p0["entries"].as_array().unwrap().len(), 500);
    assert_eq!(p0["entries"][0]["name"], "f0000.txt");
    let (_, p2) = api_json(&addr, "/api/files/list?path=code/big&cursor=1000");
    assert_eq!(p2["entries"].as_array().unwrap().len(), 203);
    assert!(p2.get("next").is_none());

    // through the link out of the repo, and a loop is shown, not entered
    let (_, via) = api_json(&addr, "/api/files/list?path=code/scratch-link");
    let kinds: Vec<(&str, &str)> = via["entries"]
        .as_array()
        .unwrap()
        .iter()
        .map(|e| (e["name"].as_str().unwrap(), e["kind"].as_str().unwrap()))
        .collect();
    assert_eq!(kinds, [("again", "loop"), ("train.log", "file")]);
    assert!(http_req(&addr, "/api/files/list?path=scratch/again", &[])
        .0
        .contains("404"));

    // stat: text, binary, image
    let (_, st) = api_json(&addr, "/api/files/stat?path=code/run.py");
    assert_eq!(
        (st["kind"].as_str(), st["text"].as_bool()),
        (Some("file"), Some(true))
    );
    assert_eq!(st["mime"], "text/plain; charset=utf-8");
    let (_, st) = api_json(&addr, "/api/files/stat?path=code/data.bin");
    assert_eq!(
        (st["text"].as_bool(), st["mime"].as_str()),
        (Some(false), Some("application/octet-stream"))
    );
    let (_, st) = api_json(&addr, "/api/files/stat?path=code/plot.png");
    assert_eq!(st["mime"], "image/png");
    let (_, st) = api_json(&addr, "/api/files/stat?path=code/scratch-link");
    assert_eq!(
        (st["kind"].as_str(), st["link"].as_str()),
        (Some("dir"), s.to_str())
    );

    // raw: whole, a range, the tail, past the end, unchanged
    let (status, headers, body) = http_req(&addr, "/api/files/raw?path=scratch/train.log", &[]);
    assert!(status.ends_with("200 OK"), "{status}");
    assert_eq!(body, log.as_bytes());
    assert!(headers.contains("accept-ranges: bytes"), "{headers}");
    assert!(
        headers.contains("content-security-policy: sandbox"),
        "{headers}"
    );
    assert!(
        headers.contains("x-content-type-options: nosniff"),
        "{headers}"
    );
    let (status, headers, body) = http_req(
        &addr,
        "/api/files/raw?path=scratch/train.log",
        &["Range: bytes=9-17"],
    );
    assert!(status.contains("206"), "{status}");
    assert!(
        headers.contains("content-range: bytes 9-17/900"),
        "{headers}"
    );
    assert_eq!(body, b"line 001\n");
    let (_, _, body) = http_req(
        &addr,
        "/api/files/raw?path=scratch/train.log",
        &["Range: bytes=-9"],
    );
    assert_eq!(body, b"line 099\n");
    let (status, headers, _) = http_req(
        &addr,
        "/api/files/raw?path=scratch/train.log",
        &["Range: bytes=900-"],
    );
    assert!(
        status.contains("416") && headers.contains("content-range: bytes */900"),
        "{status}"
    );
    let etag = headers
        .lines()
        .find_map(|l| l.strip_prefix("etag: "))
        .unwrap()
        .to_string();
    let (status, _, body) = http_req(
        &addr,
        "/api/files/raw?path=scratch/train.log",
        &[&format!("If-None-Match: {etag}")],
    );
    assert!(status.contains("304") && body.is_empty(), "{status}");

    // refusals
    for (path, code) in [
        ("/api/files/raw?path=code/../yajna.toml", "400"),
        ("/api/files/list?path=code//big", "400"),
        ("/api/files/raw?path=code/.git/x", "404"),
        ("/api/files/raw?path=code/node_modules/x", "404"),
        ("/api/files/raw?path=code/out/model.ckpt", "404"),
        ("/api/files/raw?path=nope/x", "404"),
        ("/api/files/list?path=gone", "404"),
        ("/api/files/raw?path=code/big", "400"),
        ("/api/files/list?path=code/run.py", "400"),
    ] {
        let (status, _, body) = http_req(&addr, path, &[]);
        assert!(
            status.contains(code),
            "{path}: {status} {}",
            String::from_utf8_lossy(&body)
        );
    }
    let (_, gone) = api_json(&addr, "/api/files/list?path=gone");
    assert!(
        gone["error"]
            .as_str()
            .unwrap()
            .contains("not on this machine"),
        "{gone}"
    );
    assert!(http_get(&addr, "evil.example", "/api/files/roots").starts_with("HTTP/1.1 403"));
    child.kill().unwrap();
    let _ = child.wait();

    // a broken [files] table fails validate and stops serve from starting
    fs::write(
        &cfg,
        format!("{base}\n[[files.roots]]\nname = \"a b\"\npath = \"x\"\n\n[[files.roots]]\nname = \"x\"\npath = \"x\"\nwatch = \"sometimes\"\n\n[[files.roots]]\nname = \"y\"\npath = \"y\"\nexclude = [\"[\"]\n"),
    )
    .unwrap();
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1, "{}", out.stdout);
    let all = format!("{}{}", out.stdout, out.stderr);
    for want in ["root name \"a b\"", "watch \"sometimes\"", "exclude \"[\""] {
        assert!(all.contains(want), "{want}: {all}");
    }
    let out = v.run(&["serve", "--port", "0"]);
    assert_eq!(out.code, 1);
    assert!(out.stderr.contains("watch \"sometimes\""), "{}", out.stderr);
}

#[test]
fn serve_files_viewer_render_and_site_links() {
    let v = indexed_lab();
    // a project with a code directory, and a markdown file with raw HTML in it
    let code = v.root.join("code/archaeal-division");
    fs::create_dir_all(&code).unwrap();
    fs::write(
        code.join("NOTES.md"),
        "# Notes\n\n<script>alert(1)</script>\n",
    )
    .unwrap();
    let prj = v
        .root
        .join("notes/projects/PRJ-0001-archaeal-division/README.md");
    let text = v.read(&prj);
    let text = if text.contains("code: null") {
        text.replace("code: null", "code: code/archaeal-division")
    } else {
        text.replacen("status:", "code: code/archaeal-division\nstatus:", 1)
    };
    fs::write(&prj, text).unwrap();
    assert_eq!(v.run(&["validate"]).code, 0);

    let (mut child, addr) = spawn_server(&v, &["serve"]);
    // the viewer itself, from the bundle in the binary
    let (status, headers, body) = http_req(&addr, "/files/", &[]);
    assert!(
        status.ends_with("200 OK") && headers.contains("text/html"),
        "{status}"
    );
    assert!(String::from_utf8_lossy(&body).contains("app.js"));
    let (status, headers, _) = http_req(&addr, "/files/app.js", &[]);
    assert!(
        status.ends_with("200 OK") && headers.contains("text/javascript"),
        "{status}"
    );
    assert!(http_req(&addr, "/files/nope.js", &[]).0.contains("404"));
    let (_, info) = api_json(&addr, "/api/info");
    assert_eq!(info["version"], env!("CARGO_PKG_VERSION"));

    // markdown as the site renders it, with the page's ID, and raw HTML as text
    let (status, r) = api_json(
        &addr,
        "/api/files/render?path=notes/projects/PRJ-0001-archaeal-division/README.md",
    );
    assert!(status.ends_with("200 OK"), "{status} {r}");
    assert_eq!(r["id"], "PRJ-0001");
    assert!(
        r["html"]
            .as_str()
            .unwrap()
            .contains("href=\"EXP-20261021-000001.html\""),
        "{r}"
    );
    let (_, r) = api_json(
        &addr,
        "/api/files/render?path=code/archaeal-division/NOTES.md",
    );
    let html = r["html"].as_str().unwrap();
    assert!(
        html.contains("&lt;script&gt;") && !html.contains("<script>"),
        "{html}"
    );
    assert!(r.get("id").is_none());

    // the served site links the viewer, and the project's code into it
    let home = http_get(&addr, "localhost", "/");
    assert!(home.contains("<a href=\"files/\">files</a>"), "{home}");
    let page = http_get(&addr, "localhost", "/PRJ-0001.html");
    assert!(
        page.contains("<a href=\"files/#code/archaeal-division\">code/archaeal-division</a>"),
        "{page}"
    );
    child.kill().unwrap();
    let _ = child.wait();

    // a static export has neither
    let out = v.root.join("export");
    assert_eq!(v.run(&["site", "--out", out.to_str().unwrap()]).code, 0);
    assert!(!v.read(&out.join("index.html")).contains("files/"));
    assert!(!v.read(&out.join("PRJ-0001.html")).contains("files/#"));
}

/// An open `/api/events` stream: its `change` events as JSON, read until one matches.
struct Events {
    lines: std::io::Lines<std::io::BufReader<std::net::TcpStream>>,
}

impl Events {
    fn open(addr: &str, watch: &[&str]) -> Events {
        use std::io::{BufRead, Write};
        let q: Vec<String> = watch.iter().map(|w| format!("watch={w}")).collect();
        let mut s = std::net::TcpStream::connect(addr).unwrap();
        write!(
            s,
            "GET /api/events?{} HTTP/1.1\r\nHost: localhost\r\nAccept: text/event-stream\r\n\r\n",
            q.join("&")
        )
        .unwrap();
        s.set_read_timeout(Some(std::time::Duration::from_millis(500)))
            .unwrap();
        Events {
            lines: std::io::BufReader::new(s).lines(),
        }
    }

    /// The first change event `want` accepts within `secs` seconds.
    fn until(
        &mut self,
        secs: u64,
        want: impl Fn(&serde_json::Value) -> bool,
    ) -> Option<serde_json::Value> {
        let deadline = std::time::Instant::now() + std::time::Duration::from_secs(secs);
        while std::time::Instant::now() < deadline {
            match self.lines.next() {
                Some(Ok(line)) => {
                    if let Some(data) = line
                        .strip_prefix("data: ")
                        .or_else(|| line.strip_prefix("data:"))
                    {
                        if let Ok(v) = serde_json::from_str::<serde_json::Value>(data) {
                            if want(&v) {
                                return Some(v);
                            }
                        }
                    }
                }
                Some(Err(_)) => continue, // a read timeout: look at the clock again
                None => return None,
            }
        }
        None
    }
}

#[test]
fn serve_events_follow_changes_by_watching_and_polling() {
    let v = indexed_lab();
    let code = v.root.join("code");
    fs::create_dir_all(&code).unwrap();
    fs::write(code.join("train.log"), "step 1\n").unwrap();
    let scratch = tempfile::tempdir().unwrap();
    fs::write(scratch.path().join("out.log"), "a\n").unwrap();
    let cfg = v.root.join("yajna.toml");
    let base = v.read(&cfg);
    fs::write(
        &cfg,
        format!(
            "{base}\n[[files.roots]]\nname = \"code\"\npath = \"code\"\n\n[[files.roots]]\nname = \"scratch\"\npath = \"{}\"\nwatch = \"poll\"\n",
            scratch.path().display()
        ),
    )
    .unwrap();
    let (mut child, addr) = spawn_server(&v, &["serve"]);
    let (_, roots) = api_json(&addr, "/api/files/roots");
    assert_eq!(roots[0]["live"], "notify", "{roots}");
    assert_eq!(roots[1]["live"], "poll", "{roots}");

    let mut ev = Events::open(
        &addr,
        &["code/train.log", "code", "scratch/out.log", "code/nope.log"],
    );
    // first, each path as it is now
    let mut initial = std::collections::BTreeMap::new();
    while initial.len() < 4 {
        let e = ev
            .until(5, |_| true)
            .expect("the initial state of every path");
        initial.insert(e["path"].as_str().unwrap().to_string(), e);
    }
    let log = &initial["code/train.log"];
    assert_eq!(
        (log["kind"].as_str(), log["size"].as_u64()),
        (Some("file"), Some(7))
    );
    assert_eq!(initial["code"]["kind"], "dir");
    assert_eq!(initial["scratch/out.log"]["size"], 2);
    assert_eq!(initial["code/nope.log"]["exists"], false);
    let is = |p: &'static str| move |e: &serde_json::Value| e["path"] == p;

    // a log that grows, watched through filesystem events
    let mut f = fs::OpenOptions::new()
        .append(true)
        .open(code.join("train.log"))
        .unwrap();
    std::io::Write::write_all(&mut f, b"step 2\n").unwrap();
    drop(f);
    let grew = ev
        .until(5, |e| e["path"] == "code/train.log" && e["size"] == 14)
        .expect("the append arrives");
    assert_eq!(grew["exists"], true);
    // a new file in a watched directory
    fs::write(code.join("plot.png"), "x").unwrap();
    assert!(ev.until(5, is("code")).is_some(), "the directory changed");
    // a polled root sees an append within its two seconds
    fs::write(scratch.path().join("out.log"), "a\nb\n").unwrap();
    assert!(ev
        .until(6, |e| e["path"] == "scratch/out.log" && e["size"] == 4)
        .is_some());
    // a removed file
    fs::remove_file(code.join("train.log")).unwrap();
    assert!(ev
        .until(5, |e| e["path"] == "code/train.log" && e["exists"] == false)
        .is_some());
    child.kill().unwrap();
    let _ = child.wait();
}

/// `EXP-20261021-0k3m9x`: a date ID with the 6-character time-sortable suffix.
fn regex_like_date_id(id: &str) -> bool {
    let parts: Vec<&str> = id.split('-').collect();
    parts.len() == 3
        && parts[1].len() == 8
        && parts[1].chars().all(|c| c.is_ascii_digit())
        && parts[2].len() == 6
        && parts[2]
            .chars()
            .all(|c| "0123456789abcdefghjkmnpqrstvwxyz".contains(c))
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
