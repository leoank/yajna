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
            .env_remove("VISUAL")
            .env_remove("YAJNA_ANSWERS")
            .env("YAJNA_CACHE", self.root.join(".cache"))
            // the user registry (ADR-0032) stays out of the real home
            .env("XDG_STATE_HOME", self.root.join(".cache/state"))
            .env("XDG_CONFIG_HOME", self.root.join(".cache/config"))
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

    fill_experiments(&v.root);
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
    let out = v.run(&["new", "agent", "Plate layout", "--author", "agent:claude"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let ags = v.path(&out);
    assert!(v.read(&ags).contains("finished: null"));
    fs::write(
        &ags,
        v.read(&ags)
            .replace("harness: \"\"", "harness: claude-code"),
    )
    .unwrap();
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
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
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
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
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
    fill_experiments(&v.root);
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
    fill_experiments(&v.root);
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
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
    // a run whose script and page name the lab's layout
    let script = "notes/projects/PRJ-0002-toy-model/runs/bench/run.sh";
    let out = lab.run(&[
        "new",
        "run",
        "--experiment",
        "EXP-20261021-000001",
        "--script",
        script,
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let run = lab.path(&out);
    fs::write(
        &run,
        lab.read(&run) + "\nReproduce: `nix develop ./code/toy-model -c " + script + "`.\n",
    )
    .unwrap();
    let mut sh = fs::OpenOptions::new()
        .append(true)
        .open(lab.root.join(script))
        .unwrap();
    writeln!(sh, "cargo run --manifest-path code/toy-model/Cargo.toml").unwrap();
    // a loose todo of the project, which goes along
    let out = lab.run(&["todo", "--in", "PRJ-0002", "tune the model"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
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
    // paths name the project repo's layout: notes/ for the notebook, the root for the code
    let run = run
        .strip_prefix(lab.root.join("notes/projects/PRJ-0002-toy-model"))
        .unwrap();
    let page = into.read(&into.root.join("notes").join(run));
    assert!(page.contains("script: notes/runs/bench/run.sh"), "{page}");
    assert!(
        page.contains("Reproduce: `nix develop . -c notes/runs/bench/run.sh`."),
        "{page}"
    );
    let sh = into.root.join("notes/runs/bench/run.sh");
    assert!(into
        .read(&sh)
        .contains("cargo run --manifest-path Cargo.toml\n"));
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        assert_ne!(fs::metadata(&sh).unwrap().permissions().mode() & 0o111, 0);
    }

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

    assert!(into
        .read(&into.root.join("notes/tasks.md"))
        .contains("- [ ] tune the model\n"));
    let tasks = lab.read(&lab.root.join("notes/tasks.md"));
    assert!(
        tasks.contains("## PRJ-0002 Toy model\n\nMoved to `notes/tasks.md` in [[toy/PRJ-0001]]")
            && !tasks.contains("tune the model"),
        "{tasks}"
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
    // the planner's session that day
    let out = v.run(&[
        "new",
        "agent",
        "Plan the timing work",
        "--author",
        "agent:planner",
    ]);
    let ags = v.path(&out);
    let text = v.read(&ags);
    let started = text.lines().find(|l| l.starts_with("started:")).unwrap();
    fs::write(
        &ags,
        text.replace(started, "started: 2026-10-16T10:00+01:00")
            .replace("harness: \"\"", "harness: claude-code"),
    )
    .unwrap();
    fill_experiments(&v.root);
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
    v
}

#[test]
fn index_is_a_rebuilt_cache_of_a_valid_vault() {
    let v = indexed_lab();
    let out = v.run(&["index"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("11 entities"), "{}", out.stdout);
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
    let ags = v.path(&out);
    assert!(v.read(&ags).contains("author: agent:claude\n"));
    fs::write(
        &ags,
        v.read(&ags)
            .replace("harness: \"\"", "harness: claude-code"),
    )
    .unwrap();
    fill_experiments(&v.root);
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
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
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
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
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
            &["new", "experiment", "Branch exp", "--project", "PRJ-0002"],
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
            + "\nUses [[PRO-0001@1|it]], not PRO-00011 or [[other/PRO-0001]].\n",
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
        page.contains("[[PRO-0007@1|it]]")
            && page.contains("PRO-00011")
            && page.contains("[[other/PRO-0001]]"),
        "{page}"
    );
    assert!(v
        .read(&v.root.join("notes/counters.yaml"))
        .contains("PRO: 7\n"));
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);

    // without a new ID the next free one is taken; projects move their directory
    let out = v.run(&["renumber", "PRJ-0001"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    assert!(v
        .root
        .join("notes/projects/PRJ-0002-toy/README.md")
        .is_file());
    let moved = first_md(&v.root.join("notes/projects/PRJ-0002-toy/experiments"));
    assert!(v.read(&moved).contains("project: PRJ-0002\n"));
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);

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
    // keep the project page out of this export: new listed the experiment on it
    git(
        &v.root,
        &["checkout", "--", "notes/projects/PRJ-0001-toy/README.md"],
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
    // an import is the past: what Benchling does not have is still to be written, and
    // `--since` lets the notebook pass while it is
    let out = v.run(&["validate"]);
    assert!(
        out.code == 1
            && out.stdout.contains("concluded without an outcome")
            && out.stdout.contains("concluded with no Conclusion written"),
        "{}",
        out.stdout
    );
    let out = v.run(&["validate", "--since", "2026-10-01"]);
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
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
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
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
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
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
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
    // written before the conventions were checked
    let out = v.run(&["validate", "--since", "2026-10-17"]);
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
    let out = v.run(&["validate", "--since", "2026-10-17"]);
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
    let out = v.run(&["validate", "--since", "2026-10-17"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
    fs::write(&prj, v.read(&prj) + "\nSee [[EXP-0001]].\n").unwrap();
    let out = v.run(&["validate", "--since", "2026-10-17"]);
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
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);

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
    let out = v.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);

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

/// Fill what `yajna new experiment` leaves for the author in every experiment under `root`
/// (Question, Hypothesis, Plan, Success criteria), as an author does before the first run.
fn fill_experiments(root: &Path) {
    for p in walk(&root.join("notes")) {
        let Ok(text) = fs::read_to_string(&p) else {
            continue;
        };
        if !text.contains("\ntype: experiment\n") {
            continue;
        }
        let filled = text
            .replace("## Question\n\n", "## Question\nDoes it hold?\n\n")
            .replace(
                "If H1 is true we expect ... ; if false we expect ...",
                "If it holds, the runs agree.",
            )
            .replace("## Plan\n1. \n", "## Plan\n1. Run it.\n")
            .replace(
                "## Success criteria\n\n",
                "## Success criteria\nThe runs agree.\n\n",
            );
        fs::write(&p, filled).unwrap();
    }
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

/// A home for the user registry, and yajna run from any directory with it (ADR-0032).
struct Home {
    dir: tempfile::TempDir,
}

impl Home {
    fn new() -> Home {
        Home {
            dir: tempfile::tempdir().unwrap(),
        }
    }

    fn config(&self, text: &str) {
        let p = self.dir.path().join("config/yajna/config.toml");
        fs::create_dir_all(p.parent().unwrap()).unwrap();
        fs::write(p, text).unwrap();
    }

    fn run(&self, cwd: &Path, args: &[&str], env: &[(&str, &str)]) -> Out {
        let mut cmd = Command::new(env!("CARGO_BIN_EXE_yajna"));
        cmd.current_dir(cwd)
            .args(args)
            .env_remove("EDITOR")
            .env_remove("VISUAL")
            .env_remove("YAJNA_ANSWERS")
            .env_remove("YAJNA_AUTHOR")
            .env("YAJNA_CACHE", self.dir.path().join("cache"))
            .env("XDG_STATE_HOME", self.dir.path().join("state"))
            .env("XDG_CONFIG_HOME", self.dir.path().join("config"))
            .env("GIT_AUTHOR_NAME", "t")
            .env("GIT_AUTHOR_EMAIL", "t@example.com")
            .env("GIT_COMMITTER_NAME", "t")
            .env("GIT_COMMITTER_EMAIL", "t@example.com")
            .env("GIT_CONFIG_GLOBAL", "/dev/null")
            .env("GIT_CONFIG_NOSYSTEM", "1")
            .stdin(Stdio::null());
        for (k, v) in env {
            cmd.env(k, v);
        }
        let out = cmd.output().unwrap();
        Out {
            code: out.status.code().unwrap_or(-1),
            stdout: String::from_utf8_lossy(&out.stdout).into_owned(),
            stderr: String::from_utf8_lossy(&out.stderr).into_owned(),
        }
    }
}

#[test]
fn todos_and_log_lines_from_anywhere() {
    let home = Home::new();
    let lab = vault();
    let lab_root = lab.root.canonicalize().unwrap();
    assert_eq!(lab.run(&["new", "project", "Vesicle imaging"]).code, 0);
    git(&lab_root, &["init", "-q", "-b", "main"]);
    git(&lab_root, &["add", "-A"]);
    git(&lab_root, &["commit", "-q", "-m", "lab"]);
    let elsewhere = empty();
    let away = elsewhere.root.as_path();

    // outside any notebook, nothing is known yet
    let out = home.run(away, &["log", "x"], &[]);
    assert_eq!(out.code, 1);
    assert!(out.stderr.contains("--in"), "{}", out.stderr);
    // running yajna in the lab records it
    assert_eq!(home.run(&lab_root, &["validate"], &[]).code, 0);
    let out = home.run(away, &["repos"], &[]);
    assert!(
        out.stdout.contains("yajna") && out.stdout.contains(lab_root.to_str().unwrap()),
        "{}",
        out.stdout
    );

    // a log line into a project of the lab, committed alone
    fs::write(lab_root.join("notes/scratch.md"), "not mine\n").unwrap();
    let out = home.run(
        away,
        &["log", "--in", "yajna/vesicle", "re-imaged scene 3"],
        &[],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    let log = lab.read(
        &lab_root.join("notes/log/2026").join(
            fs::read_dir(lab_root.join("notes/log/2026"))
                .unwrap()
                .next()
                .unwrap()
                .unwrap()
                .file_name(),
        ),
    );
    assert!(log.contains(" [[PRJ-0001]] re-imaged scene 3\n"), "{log}");
    assert_eq!(
        git(&lab_root, &["log", "-1", "--format=%s"]).trim(),
        "docs(notes): log"
    );
    assert_eq!(
        git(&lab_root, &["status", "--porcelain"]).trim(),
        "?? notes/scratch.md"
    );

    // todos: the lab's list, a project's section, tokens
    let out = home.run(
        away,
        &[
            "todo",
            "--in",
            "yajna",
            "order agarose",
            "--due",
            "2020-01-01",
            "-p",
            "2",
        ],
        &[],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    let out = home.run(
        away,
        &["todo", "--in", "yajna/PRJ-0001", "image scene 4", "-p", "1"],
        &[],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    let out = home.run(away, &["todo", "--in", "yajna", "clean the bench"], &[]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let tasks = lab.read(&lab_root.join("notes/tasks.md"));
    assert!(
        tasks.ends_with(
            "- [ ] order agarose due:2020-01-01 p:2\n- [ ] clean the bench\n\n## PRJ-0001 Vesicle imaging\n\n- [ ] image scene 4 p:1\n"
        ),
        "{tasks}"
    );
    assert_eq!(
        git(&lab_root, &["log", "-1", "--format=%s"]).trim(),
        "docs(notes): todo"
    );
    assert_eq!(home.run(&lab_root, &["validate"], &[]).code, 0);

    // a project's listing, and every listing: overdue first, then priority
    let out = home.run(away, &["tasks", "--in", "yajna/vesicle"], &[]);
    assert!(out.stdout.contains("image scene 4"), "{}", out.stdout);
    assert!(!out.stdout.contains("agarose"), "{}", out.stdout);
    let out = home.run(away, &["tasks", "--all"], &[]);
    let lines: Vec<&str> = out.stdout.lines().collect();
    assert!(
        lines[0].starts_with("  1! yajna:notes/tasks.md:") && lines[0].contains("order agarose"),
        "{}",
        out.stdout
    );
    assert!(lines[1].contains("image scene 4"), "{}", out.stdout);
    assert!(lines[2].contains("clean the bench"), "{}", out.stdout);

    // tick by number from that listing; a stale number is refused
    let out = home.run(away, &["todo", "done", "2"], &[]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let tasks = lab.read(&lab_root.join("notes/tasks.md"));
    assert!(tasks.contains("- [x] image scene 4 p:1 done:"), "{tasks}");
    assert_eq!(
        git(&lab_root, &["log", "-1", "--format=%s"]).trim(),
        "docs(notes): todo done"
    );
    assert_eq!(home.run(away, &["todo", "done", "2"], &[]).code, 1);
    // and by words
    let out = home.run(away, &["todo", "done", "--in", "yajna", "bench"], &[]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(lab
        .read(&lab_root.join("notes/tasks.md"))
        .contains("- [x] clean the bench done:"));

    // a file with changes of its own is written but not committed
    let tasks = lab.read(&lab_root.join("notes/tasks.md"));
    fs::write(lab_root.join("notes/tasks.md"), tasks + "- [ ] by hand\n").unwrap();
    let out = home.run(away, &["todo", "--in", "yajna", "after the hand edit"], &[]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stderr.contains("left uncommitted"), "{}", out.stderr);
    assert!(git(&lab_root, &["status", "--porcelain"]).contains("notes/tasks.md"));
    git(&lab_root, &["checkout", "--", "notes/tasks.md"]);

    // -e: one entry per paragraph
    let editor = "sh -c 'printf \"first\\nline\\n\\nsecond\\n\" >> \"$1\"' sh";
    let out = home.run(
        away,
        &["todo", "--in", "yajna", "-e"],
        &[("EDITOR", editor)],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    let tasks = lab.read(&lab_root.join("notes/tasks.md"));
    assert!(
        tasks.contains("- [ ] first line\n- [ ] second\n"),
        "{tasks}"
    );
    let out = home.run(away, &["log", "--in", "yajna", "-e"], &[("EDITOR", "true")]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(out.stdout.contains("nothing added"), "{}", out.stdout);

    // the default notebook, outside any
    home.config("default = \"yajna\"\n");
    let out = home.run(away, &["log", "from the default"], &[]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout.starts_with("yajna: notes/log/"),
        "{}",
        out.stdout
    );

    // from a worktree, --in writes to the main checkout; without it, to the worktree
    let wt = elsewhere.root.join("wt");
    git(
        &lab_root,
        &["worktree", "add", "-q", "-b", "side", wt.to_str().unwrap()],
    );
    let out = home.run(&wt, &["todo", "--in", "yajna", "from the side branch"], &[]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(lab
        .read(&lab_root.join("notes/tasks.md"))
        .contains("from the side branch"));
    assert!(!fs::read_to_string(wt.join("notes/tasks.md"))
        .unwrap()
        .contains("from the side branch"));
    let out = home.run(&wt, &["todo", "on the branch"], &[]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(fs::read_to_string(wt.join("notes/tasks.md"))
        .unwrap()
        .contains("on the branch"));
    assert!(
        git(&wt, &["status", "--porcelain"]).contains("notes/tasks.md"),
        "left uncommitted where you are"
    );

    // validation: a heading that names no project, a bad token
    fs::write(
        lab_root.join("notes/tasks.md"),
        "# Tasks\n\n- [ ] x p:7\n\n## PRJ-0099 Gone\n",
    )
    .unwrap();
    let out = home.run(&lab_root, &["validate"], &[]);
    assert_eq!(out.code, 1);
    assert!(
        out.stdout.contains("p:7: priority is 1, 2 or 3"),
        "{}",
        out.stdout
    );
    assert!(
        out.stdout.contains("PRJ-0099 is not a project here"),
        "{}",
        out.stdout
    );
}

#[test]
fn review_a_branch_a_range_and_a_page() {
    let home = Home::new();
    let lab = vault();
    let root = lab.root.canonicalize().unwrap();
    assert_eq!(lab.run(&["new", "project", "Toy model"]).code, 0);
    fs::create_dir_all(root.join("code")).unwrap();
    fs::write(root.join("code/x.py"), "a = 1\nb = 2\nc = 3\n").unwrap();
    git(&root, &["init", "-q", "-b", "main"]);
    git(&root, &["add", "-A"]);
    git(&root, &["commit", "-q", "-m", "lab"]);
    let main_tip = git(&root, &["rev-parse", "HEAD"]).trim().to_string();

    // an agent's branch in its own worktree, with one commit
    let spot = empty();
    let wt = spot.root.join("speedup");
    let out = lab.run(&[
        "worktree",
        "PRJ-0001",
        "speedup",
        "--path",
        wt.to_str().unwrap(),
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    fs::write(wt.join("code/x.py"), "a = 1\nb = 20\nc = 30\n").unwrap();
    git(&wt, &["commit", "-q", "-am", "faster"]);

    // a review of the branch is written on the branch
    let out = lab.run(&["review", "open", "toy-model/speedup"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let rev_path = PathBuf::from(out.stdout.lines().next().unwrap());
    assert!(
        rev_path.starts_with(&wt)
            && rev_path
                .to_string_lossy()
                .contains("notes/projects/PRJ-0001-toy-model/reviews/REV-20261021-"),
        "{}",
        out.stdout
    );
    let id = rev_path.file_name().unwrap().to_string_lossy()[..19].to_string();
    let page = fs::read_to_string(&rev_path).unwrap();
    assert!(page.contains("target:\n  kind: branch"), "{page}");
    assert!(page.contains(&format!("base: {main_tip}\n")), "{page}");
    assert!(page.contains("project: PRJ-0001\n"), "{page}");

    // ank comments from main, on lines and in general
    let out = lab.run(&[
        "review",
        "comment",
        &id,
        "--at",
        "code/x.py:2-3",
        "why",
        "these",
        "numbers?",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let out = lab.run(&["review", "comment", &id, "add a test"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert_eq!(
        lab.run(&["review", "comment", &id, "--at", "code/x.py:3-9", "x"])
            .code,
        1
    );
    let page = fs::read_to_string(&rev_path).unwrap();
    assert!(
        page.contains("### T1 (open) code/x.py:2-3 @ ")
            && page.contains("```py\nb = 20\nc = 30\n```\n- 2026-")
            && page.contains(" tester: why these numbers?\n\n### T2 (open) general\n- "),
        "{page}"
    );
    let out = lab.run(&["review", "list"]);
    assert!(
        out.stdout.contains(&id) && out.stdout.contains("2/2 open") && out.stdout.contains("(in "),
        "{}",
        out.stdout
    );

    // the agent addresses T1 with a commit on the branch; it may not resolve
    fs::write(wt.join("code/x.py"), "a = 1\nb = 20  # measured\nc = 30\n").unwrap();
    git(&wt, &["commit", "-q", "-am", "explain"]);
    let out = home.run(
        &wt,
        &[
            "review",
            "address",
            &id,
            "T1",
            "explained",
            "in",
            "a",
            "comment",
        ],
        &[],
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    let out = home.run(&wt, &["review", "resolve", &id, "T1"], &[]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr.contains("only a human resolves"),
        "{}",
        out.stderr
    );
    // a commit that is not on the branch does not address anything
    fs::write(root.join("notes/other.md"), "x\n").unwrap();
    git(&root, &["add", "-A"]);
    git(&root, &["commit", "-q", "-m", "elsewhere"]);
    let out = lab.run(&["review", "address", &id, "T2", "--commit", "HEAD", "done"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr.contains("is not on toy-model/speedup"),
        "{}",
        out.stderr
    );

    // ank resolves from main; the page validates on the branch
    let out = lab.run(&["review", "resolve", &id, "T1", "thanks"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let page = fs::read_to_string(&rev_path).unwrap();
    assert!(
        page.contains("### T1 (resolved) code/x.py:2-3 @ "),
        "{page}"
    );
    assert!(
        page.contains(" agent:claude-toy-model-speedup addressed in "),
        "{page}"
    );
    assert!(page.contains(" tester resolved: thanks\n"), "{page}");
    let out = home.run(&wt, &["validate"], &[]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    let out = lab.run(&["review", "show", &id]);
    assert!(
        out.stdout.contains("### T1 (resolved)") && out.stdout.contains("### T2 (open) general"),
        "{}",
        out.stdout
    );
    let out = lab.run(&["review", "show", &id, "--diff"]);
    assert!(out.stdout.contains("+b = 20"), "{}", out.stdout);

    // validation catches what the CLI refuses
    fs::write(
        &rev_path,
        page.replace(" tester resolved: thanks", " agent:claude resolved"),
    )
    .unwrap();
    let out = home.run(&wt, &["validate"], &[]);
    assert_eq!(out.code, 1);
    assert!(
        out.stdout.contains("only a human resolves a thread"),
        "{}",
        out.stdout
    );
    fs::write(&rev_path, &page).unwrap();

    // a range and a page, reviewed on main
    let out = lab.run(&[
        "review",
        "open",
        &format!("{main_tip}..HEAD"),
        "--project",
        "PRJ-0001",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout
            .starts_with("notes/projects/PRJ-0001-toy-model/reviews/REV-"),
        "{}",
        out.stdout
    );
    let out = lab.run(&["review", "open", "PRJ-0001"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let page_rev = lab.path(&out);
    let pid = page_rev.file_name().unwrap().to_string_lossy()[..19].to_string();
    let out = lab.run(&[
        "review",
        "comment",
        &pid,
        "--at",
        "notes/projects/PRJ-0001-toy-model/README.md#Introduction",
        "say",
        "what",
        "it",
        "is",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(lab
        .read(&page_rev)
        .contains("### T1 (open) notes/projects/PRJ-0001-toy-model/README.md#Introduction @ "));
    let out = lab.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    let out = lab.run(&["new", "review", "x"]);
    assert_eq!(out.code, 1);
    assert!(out.stderr.contains("yajna review open"), "{}", out.stderr);
}

#[test]
fn review_a_run_an_experiment_a_phase_and_update() {
    let lab = vault();
    let root = lab.root.canonicalize().unwrap();
    let commit = |msg: &str| {
        git(&root, &["add", "notes", "code"]);
        git(&root, &["commit", "-q", "-m", msg]);
        git(&root, &["rev-parse", "HEAD"]).trim().to_string()
    };
    let out = lab.run(&["new", "project", "Toy model"]);
    let prj = lab.path(&out);
    let text = lab
        .read(&prj)
        .replace("code: null", "code: code/toy-model")
        .replace(
            "- [ ] \n",
            "- [x] Setup of the model\n- [ ] Speed it up\n- [ ] Write it down\n",
        );
    fs::write(&prj, text).unwrap();
    let file: Vec<String> = (1..=12).map(|i| format!("line{i} = {i}")).collect();
    fs::create_dir_all(root.join("code/toy-model")).unwrap();
    fs::write(root.join("code/toy-model/x.py"), file.join("\n") + "\n").unwrap();
    git(&root, &["init", "-q", "-b", "main"]);
    let c0 = commit("lab");

    // a phase starts where it says
    let out = lab.run(&["phase", "start", "PRJ-0001", "speed"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        lab.read(&prj)
            .contains(&format!("- [ ] Speed it up (since {})\n", &c0[..7])),
        "{}",
        lab.read(&prj)
    );
    assert_eq!(lab.run(&["phase", "start", "PRJ-0001", "it"]).code, 1);
    assert_eq!(lab.run(&["phase", "start", "PRJ-0001", "setup"]).code, 1);
    let c1 = commit("start");

    // an experiment, and two runs at two commits
    let out = lab.run(&[
        "new",
        "experiment",
        "Does it scale",
        "--project",
        "PRJ-0001",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let exp_path = lab.path(&out);
    let exp = exp_path.file_name().unwrap().to_string_lossy()[..19].to_string();
    commit("experiment");
    let ran = |at: &str, started: &str| {
        let out = lab.run(&["new", "run", "--experiment", &exp, "--kind", "compute"]);
        assert_eq!(out.code, 0, "{}", out.stderr);
        let path = lab.path(&out);
        let text = lab.read(&path).replace(
            "status: planned",
            // quoted: a short SHA of digits alone would be a number
            &format!("status: done\nstarted: {started}\ncommit: \"{at}\""),
        );
        fs::write(&path, text).unwrap();
        path.file_stem().unwrap().to_string_lossy().to_string()
    };
    let mut changed = file.clone();
    changed[1] = "line2 = 20".to_string();
    fs::write(root.join("code/toy-model/x.py"), changed.join("\n") + "\n").unwrap();
    let c3 = commit("faster");
    let run1 = ran(&c3, "2026-10-21T10:00Z");
    commit("run 1");
    changed[2] = "line3 = 30".to_string();
    fs::write(root.join("code/toy-model/x.py"), changed.join("\n") + "\n").unwrap();
    let c5 = commit("fastest");
    let run2 = ran(&c5[..7], "2026-10-21T11:00Z");
    commit("run 2");

    // a run against the run before it; the first run against the experiment's start
    let open = |args: &[&str]| {
        let out = lab.run(&[&["review", "open"], args].concat());
        assert_eq!(out.code, 0, "{}", out.stderr);
        let path = lab.path(&out);
        (
            path.file_name().unwrap().to_string_lossy()[..19].to_string(),
            lab.read(&path),
            path,
        )
    };
    let (_, page, _) = open(&[&run2]);
    assert!(
        page.contains("  kind: run   ")
            && page.contains(&format!("\n  ref: {run2}\n"))
            && page.contains(&format!("base: {c3}\nhead: {c5}\n"))
            && page.contains(&format!(
                "Base: the commit of the previous run, [[{run1}]]."
            ))
            && page.contains("code/toy-model"),
        "{page}"
    );
    let (rid2, _, _) = open(&[&run2]);
    let out = lab.run(&["review", "show", &rid2, "--diff"]);
    assert!(
        out.stdout.contains("+line3 = 30") && !out.stdout.contains("+line2 = 20"),
        "{}",
        out.stdout
    );
    let (_, page, _) = open(&[&run1]);
    assert!(
        page.contains(&format!("base: {c1}\nhead: {c3}\n")),
        "{page}"
    );

    // an open experiment runs to now; a concluded one to its last run
    let (_, page, _) = open(&[&exp]);
    let now = git(&root, &["rev-parse", "HEAD"]).trim().to_string();
    assert!(
        page.contains(&format!("base: {c1}\nhead: {now}\n")),
        "{page}"
    );
    fs::write(
        &exp_path,
        lab.read(&exp_path)
            .replace("status: planned", "status: concluded"),
    )
    .unwrap();
    let (_, page, _) = open(&[&exp]);
    assert!(page.contains(&format!("head: {c5}\n")), "{page}");

    // a phase from its (since …) to now, then to the commit that ticked it; the next one
    // from that tick, said to be inferred
    let (_, page, _) = open(&["PRJ-0001", "--phase", "speed"]);
    assert!(
        page.contains("\n  ref: PRJ-0001\n  phase: Speed it up\nbase: ")
            && page.contains(&format!("base: {c0}\nhead: {now}\n")),
        "{page}"
    );
    fs::write(
        &prj,
        lab.read(&prj)
            .replace("- [ ] Speed it up", "- [x] Speed it up"),
    )
    .unwrap();
    let ticked = commit("sped up");
    let (_, page, _) = open(&["PRJ-0001", "--phase", "speed"]);
    assert!(page.contains(&format!("head: {ticked}\n")), "{page}");
    let (_, page, _) = open(&["PRJ-0001", "--phase", "write"]);
    assert!(
        page.contains(&format!("base: {ticked}\n"))
            && page.contains(
                "Base inferred: the commit that ticked the item before it, \"Speed it up\""
            ),
        "{page}"
    );
    let out = lab.run(&["review", "open", "PRJ-0001", "--phase", "it"]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr.contains("Progress items; say more"),
        "{}",
        out.stderr
    );

    // update: a thread follows its lines through a rename; one whose lines went is outdated
    fs::write(
        &exp_path,
        lab.read(&exp_path)
            .replace("status: concluded", "status: active"),
    )
    .unwrap();
    commit("reopened");
    let (rid, _, rpath) = open(&[&exp]);
    commit("review");
    let at = |at: &str| {
        let out = lab.run(&["review", "comment", &rid, "--at", at, "look"]);
        assert_eq!(out.code, 0, "{}", out.stderr);
    };
    at("code/toy-model/x.py:9-10");
    at("code/toy-model/x.py:5");
    at(&format!("{}#Question", rel_of(&lab.root, &exp_path)));
    lab.run(&["review", "comment", &rid, "in general"]);
    commit("comments");
    git(&root, &["mv", "code/toy-model/x.py", "code/toy-model/y.py"]);
    let mut moved = vec!["import os".to_string(), "import sys".to_string()];
    moved.extend(changed.iter().filter(|l| !l.starts_with("line5 ")).cloned());
    fs::write(root.join("code/toy-model/y.py"), moved.join("\n") + "\n").unwrap();
    let c9 = commit("renamed");
    let out = lab.run(&["review", "update", &rid]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let page = lab.read(&rpath);
    let s = &c9[..7];
    assert!(
        page.contains(&format!("head: {c9}\n"))
            && page.contains(&format!("### T1 (open) code/toy-model/y.py:10-11 @ {s}\n"))
            && page.contains("### T2 (outdated) code/toy-model/x.py:5 @ ")
            && page.contains(&format!("#Question @ {s}\n"))
            && page.contains("### T4 (open) general\n"),
        "{}\n{page}",
        out.stdout
    );
    let out = lab.run(&["review", "update", &rid]);
    assert!(out.stdout.contains("already"), "{}", out.stdout);
    fill_experiments(&root);
    let out = lab.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
}

fn rel_of(root: &Path, p: &Path) -> String {
    p.strip_prefix(root).unwrap().to_string_lossy().to_string()
}

#[test]
fn review_approve_request_changes_merge_and_todo() {
    let home = Home::new();
    let lab = vault();
    let root = lab.root.canonicalize().unwrap();
    assert_eq!(lab.run(&["new", "project", "Toy model"]).code, 0);
    let out = lab.run(&["new", "experiment", "Q", "--project", "PRJ-0001"]);
    let exp_path = lab.path(&out);
    let exp = exp_path.file_name().unwrap().to_string_lossy()[..19].to_string();
    fs::write(
        &exp_path,
        lab.read(&exp_path)
            .replacen("\n---\n", "\nreview: pending\n---\n", 1),
    )
    .unwrap();
    fs::create_dir_all(root.join("code")).unwrap();
    fs::write(root.join("code/x.py"), "a = 1\nb = 2\n").unwrap();
    git(&root, &["init", "-q", "-b", "main"]);
    git(&root, &["add", "notes", "code", "yajna.toml"]);
    git(&root, &["commit", "-q", "-m", "lab"]);

    let spot = empty();
    let wt = spot.root.join("speedup");
    let out = lab.run(&[
        "worktree",
        "PRJ-0001",
        "speedup",
        "--path",
        wt.to_str().unwrap(),
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    fs::write(wt.join("code/x.py"), "a = 1\nb = 20\n").unwrap();
    git(&wt, &["commit", "-q", "-am", "faster"]);
    let out = lab.run(&["review", "open", "toy-model/speedup"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let rev_path = PathBuf::from(out.stdout.lines().next().unwrap());
    let id = rev_path.file_name().unwrap().to_string_lossy()[..19].to_string();
    let out = lab.run(&["review", "comment", &id, "--at", "code/x.py:2", "why 20?"]);
    assert_eq!(out.code, 0, "{}", out.stderr);

    // nothing merges or is approved while a thread is open, and no agent approves
    let out = home.run(&root, &["review", "merge", &id], &[]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr.contains("the review is open, not approved")
            && out.stderr.contains("threads T1 (open) are not resolved"),
        "{}",
        out.stderr
    );
    let out = lab.run(&["review", "approve", &id]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr.contains("settle first: T1 (open)"),
        "{}",
        out.stderr
    );
    let out = home.run(&wt, &["review", "approve", &id], &[]);
    assert!(
        out.stderr.contains("only a human approves"),
        "{}",
        out.stderr
    );
    let out = lab.run(&["review", "request-changes", &id, "explain", "20"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let page = fs::read_to_string(&rev_path).unwrap();
    assert!(
        page.contains("status: changes_requested # open | ")
            && page.contains(" tester requested changes: explain 20\n\n## Threads"),
        "{page}"
    );

    // the agent sees what it owes, and validate --against says the review is unfinished
    let out = home.run(&wt, &["review", "todo"], &[]);
    assert!(
        out.stdout
            .contains(&format!("{id} T1 (open) code/x.py:2 @ "))
            && out.stdout.contains(" tester: why 20?"),
        "{}",
        out.stdout
    );
    let out = home.run(&wt, &["validate", "--against", "main"], &[]);
    assert!(
        out.stderr.contains(&format!(
            "{id} reviews toy-model/speedup and is changes_requested with 1 thread(s) unsettled"
        )),
        "{}",
        out.stderr
    );
    fs::write(wt.join("code/x.py"), "a = 1\nb = 20  # measured\n").unwrap();
    git(&wt, &["commit", "-q", "-am", "explain"]);
    let out = home.run(&wt, &["review", "address", &id, "T1", "explained"], &[]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(home
        .run(&wt, &["review", "todo"], &[])
        .stdout
        .contains("no open threads"));
    assert_eq!(lab.run(&["review", "resolve", &id, "T1"]).code, 0);
    let out = lab.run(&["review", "approve", &id, "good"]);
    assert_eq!(out.code, 0, "{}", out.stderr);

    // the review must be committed on the branch before it merges
    let out = home.run(&root, &["review", "merge", &id], &[]);
    assert_eq!(out.code, 1);
    assert!(
        out.stderr
            .contains("commit them on toy-model/speedup first"),
        "{}",
        out.stderr
    );
    git(&wt, &["add", "notes"]);
    git(&wt, &["commit", "-q", "-m", "review"]);
    let tip = git(&wt, &["rev-parse", "HEAD"]).trim().to_string();
    let out = home.run(&root, &["review", "merge", &id], &[]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);
    let rel_page = rev_path.strip_prefix(&wt).unwrap();
    let merged = fs::read_to_string(root.join(rel_page)).unwrap();
    assert!(
        merged.contains("status: merged            # open | ")
            && merged.contains(&format!("merge: {tip}\n"))
            && merged.contains(" tester approved: good\n- ")
            && merged.contains(" tester merged into main\n"),
        "{merged}"
    );
    let parents = git(&root, &["log", "-1", "--format=%P"]);
    assert!(parents.trim().ends_with(&tip), "{parents}");
    assert!(lab.read(&root.join("code/x.py")).contains("# measured"));
    assert_eq!(home.run(&root, &["review", "merge", &id], &[]).code, 1);
    let out = lab.run(&["validate"]);
    assert_eq!(out.code, 0, "{}{}", out.stdout, out.stderr);

    // approving a page review signs the page
    let out = lab.run(&["review", "open", &exp]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let pid = lab.path(&out).file_name().unwrap().to_string_lossy()[..19].to_string();
    let out = lab.run(&["review", "approve", &pid]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout.contains(&format!("review: approved in {pid}")),
        "{}",
        out.stdout
    );
    assert!(!lab.read(&exp_path).contains("review: pending"));
    assert!(lab
        .run(&["review", "merge", &pid])
        .stderr
        .contains("only a branch review is merged"));
}

/// One HTTP/1.1 request to the server at `addr`: (status, body).
fn http(
    addr: &str,
    method: &str,
    path: &str,
    headers: &[(&str, &str)],
    body: &str,
) -> (u16, String) {
    use std::io::Read;
    let mut s = std::net::TcpStream::connect(addr).unwrap();
    let mut req = format!(
        "{method} {path} HTTP/1.1\r\nHost: {addr}\r\nConnection: close\r\nContent-Length: {}\r\n",
        body.len()
    );
    for (k, v) in headers {
        req.push_str(&format!("{k}: {v}\r\n"));
    }
    req.push_str("\r\n");
    req.push_str(body);
    s.write_all(req.as_bytes()).unwrap();
    let mut out = String::new();
    s.read_to_string(&mut out).unwrap();
    let status = out[9..12].parse().unwrap();
    let body = out.split_once("\r\n\r\n").map_or("", |(_, b)| b);
    // a chunked body: the JSON is on the line after the first size
    let body = match body.split_once("\r\n") {
        Some((size, rest)) if u64::from_str_radix(size.trim(), 16).is_ok() => {
            rest.rsplit_once("\r\n0").map_or(rest, |(b, _)| b)
        }
        _ => body,
    };
    (status, body.to_string())
}

#[test]
fn serve_review_writes_only_with_the_token_and_never_over_a_change() {
    use std::io::BufRead;
    let lab = vault();
    let root = lab.root.canonicalize().unwrap();
    fs::create_dir_all(root.join("code")).unwrap();
    fs::write(root.join("code/x.py"), "a = 1\n").unwrap();
    git(&root, &["init", "-q", "-b", "main"]);
    git(&root, &["add", "-A"]);
    git(&root, &["commit", "-q", "-m", "one"]);
    fs::write(root.join("code/x.py"), "a = 1\nb = 2\n").unwrap();
    git(&root, &["commit", "-q", "-am", "two"]);
    let out = lab.run(&["review", "open", "HEAD~1..HEAD"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let page = lab.path(&out);
    let id = page.file_name().unwrap().to_string_lossy()[..19].to_string();
    assert_eq!(
        lab.run(&["review", "comment", &id, "--at", "code/x.py:2", "why b?"])
            .code,
        0
    );

    let mut child = Command::new(env!("CARGO_BIN_EXE_yajna"))
        .arg("--root")
        .arg(&root)
        .args(["serve", "--review", "--port", "0"])
        .env("YAJNA_CACHE", root.join(".cache"))
        .env("XDG_STATE_HOME", root.join(".cache/state"))
        .env("XDG_CONFIG_HOME", root.join(".cache/config"))
        .env_remove("YAJNA_AUTHOR")
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .unwrap();
    let mut lines = std::io::BufReader::new(child.stdout.take().unwrap()).lines();
    let url = lines
        .by_ref()
        .map(|l| l.unwrap())
        .find_map(|l| l.strip_prefix("reviews, writable: ").map(str::to_string))
        .unwrap();
    let (addr, token) = {
        let rest = url.strip_prefix("http://").unwrap();
        let (addr, q) = rest.split_once("/files/?token=").unwrap();
        (addr.to_string(), q.to_string())
    };
    let origin = format!("http://{addr}");
    let version = |body: &str| {
        let v: serde_json::Value = serde_json::from_str(body).unwrap();
        v["version"].as_str().unwrap().to_string()
    };
    let (status, body) = http(&addr, "GET", "/api/info", &[], "");
    assert!(
        status == 200 && body.contains("\"review\":true"),
        "{status} {body}"
    );
    let (status, body) = http(&addr, "GET", "/api/reviews", &[], "");
    assert!(status == 200 && body.contains(&id), "{status} {body}");
    let (_, body) = http(&addr, "GET", &format!("/api/reviews/{id}"), &[], "");
    assert!(body.contains("\"quote\":[\"b = 2\"]"), "{body}");
    let v = version(&body);
    let reply =
        |v: &str| format!("{{\"version\":\"{v}\",\"thread\":\"T1\",\"text\":\"from the viewer\"}}");
    let post = |headers: &[(&str, &str)], body: &str| {
        let mut h = vec![("Content-Type", "application/json")];
        h.extend_from_slice(headers);
        http(&addr, "POST", &format!("/api/reviews/{id}/reply"), &h, body)
    };
    // no token, a wrong one, another origin
    assert_eq!(post(&[("Origin", &origin)], &reply(&v)).0, 403);
    assert_eq!(
        post(&[("Origin", &origin), ("X-Yajna-Token", "0")], &reply(&v)).0,
        403
    );
    assert_eq!(
        post(
            &[("Origin", "http://evil.example"), ("X-Yajna-Token", &token)],
            &reply(&v)
        )
        .0,
        403
    );
    // an agent replies from the CLI meanwhile: the viewer's write is refused, not lost
    assert_eq!(
        lab.run(&[
            "review",
            "reply",
            &id,
            "T1",
            "--author",
            "agent:claude",
            "b is new"
        ])
        .code,
        0
    );
    let (status, body) = post(
        &[("Origin", &origin), ("X-Yajna-Token", &token)],
        &reply(&v),
    );
    assert!(
        status == 409 && body.contains("changed since you read it"),
        "{status} {body}"
    );
    let (_, body) = http(&addr, "GET", &format!("/api/reviews/{id}"), &[], "");
    let (status, body) = post(
        &[("Origin", &origin), ("X-Yajna-Token", &token)],
        &reply(&version(&body)),
    );
    assert!(
        status == 200 && body.contains("from the viewer"),
        "{status} {body}"
    );
    // what is not in the review yet: a change in the working tree and a new file, but not
    // the review page, which is not committed either
    fs::write(root.join("code/x.py"), "a = 1\nb = 3\n").unwrap();
    fs::write(root.join("code/y.py"), "c = 1\n").unwrap();
    let (_, body) = http(&addr, "GET", &format!("/api/reviews/{id}"), &[], "");
    let v: serde_json::Value = serde_json::from_str(&body).unwrap();
    let later: Vec<String> = v["unreviewed"]
        .as_array()
        .unwrap()
        .iter()
        .map(|f| {
            format!(
                "{} {}",
                f["status"].as_str().unwrap(),
                f["path"].as_str().unwrap()
            )
        })
        .collect();
    assert!(
        later.contains(&"M code/x.py".to_string()) && later.contains(&"? code/y.py".to_string()),
        "{later:?}"
    );
    assert!(!later.iter().any(|f| f.ends_with(".md")), "{later:?}");
    let (status, body) = http(
        &addr,
        "GET",
        &format!("/api/reviews/{id}/file?path=code/x.py&work=true"),
        &[],
        "",
    );
    let sides: serde_json::Value = serde_json::from_str(&body).unwrap();
    assert!(
        status == 200 && sides["base"] == "a = 1\nb = 2\n" && sides["head"] == "a = 1\nb = 3\n",
        "{status} {body}"
    );
    let (status, _) = http(
        &addr,
        "GET",
        &format!("/api/reviews/{id}/file?path=../x.py&work=true"),
        &[],
        "",
    );
    assert_eq!(status, 404);
    child.kill().unwrap();
    let _ = child.wait();
    let text = lab.read(&page);
    assert!(
        text.contains(" agent:claude: b is new\n- ") && text.contains(" tester: from the viewer\n"),
        "{text}"
    );
    let out = lab.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
}

#[test]
fn conventions_are_checked_from_a_date() {
    let v = vault();
    let today = today();
    assert_eq!(v.run(&["new", "project", "P"]).code, 0);
    assert_eq!(v.run(&["new", "protocol", "Prep"]).code, 0);
    let out = v.run(&[
        "new",
        "experiment",
        "Does it hold?",
        "--project",
        "PRJ-0001",
    ]);
    let exp = v.path(&out);
    let eid = exp.file_name().unwrap().to_string_lossy()[..19].to_string();
    // new lists a page on its parent at once
    let prj = v.read(&v.root.join("notes/projects/PRJ-0001-p/README.md"));
    assert!(
        prj.contains(&format!("- [[{eid}]] Does it hold?\n")),
        "{prj}"
    );
    let agent = [("YAJNA_AUTHOR", "agent:claude")];
    let out = v.run_with(
        &["new", "run", "--experiment", &eid, "--kind", "compute"],
        None,
        &agent,
    );
    assert_eq!(out.code, 0, "{}", out.stderr);
    let rid = v.path(&out).file_stem().unwrap().to_string_lossy()[..19].to_string();
    assert!(v
        .read(&exp)
        .contains(&format!("- [[{rid}]] compute run, not yet described\n")));
    assert_eq!(
        v.run_with(&["log", "ran it", "--time", "10:00"], None, &agent)
            .code,
        0
    );
    let log = v
        .root
        .join(format!("notes/log/{}/{today}.agent-claude.md", &today[..4]));
    fs::write(&log, v.read(&log) + "an unstamped line\n").unwrap();
    fs::write(
        &exp,
        v.read(&exp)
            .replace("status: planned", "status: concluded")
            .replacen("\n---\n", "\nreview: approved\n---\n", 1)
            .replace("## Runs\n", "## Runs\nUses [[PRO-0001@3]].\n"),
    )
    .unwrap();
    fs::write(v.root.join("notes/broken.md"), "---\nid: [\n---\n\nbody\n").unwrap();

    let out = v.run(&["validate"]);
    assert_eq!(out.code, 1);
    for expected in [
        &format!("agent:claude logged on {today} but has no session page"),
        "an agent's compute run has a script that re-creates it",
        "concluded without an outcome",
        "concluded with no Conclusion written",
        "Question is still the template's, and the experiment has runs",
        "review: approved without an approval record",
        "PRO-0001@3: PRO-0001 is at version 1",
        "not a log line (`- HH:MM text`): an unstamped line",
        "notes/broken.md: the frontmatter does not parse",
    ] {
        assert!(out.stdout.contains(expected), "{expected}\n{}", out.stdout);
    }
    // from a later day only what is checked whatever the date is left
    let out = v.run(&["validate", "--since", "2099-01-01"]);
    assert!(
        out.code == 1
            && out.stdout.contains("PRO-0001@3")
            && out.stdout.contains("does not parse")
            && !out.stdout.contains("session page")
            && !out.stdout.contains("concluded"),
        "{}",
        out.stdout
    );
    assert_eq!(v.run(&["validate", "--since", "21-10-2026"]).code, 1);

    // a human signs a pending page off directly; an agent cannot
    fs::write(
        &exp,
        v.read(&exp).replace("review: approved", "review: pending"),
    )
    .unwrap();
    assert_eq!(v.run_with(&["approve", &eid], None, &agent).code, 1);
    let out = v.run(&["approve", &eid]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(v.read(&exp).contains(&format!(
        "review: approved\napproval: {{by: tester, on: {today}}}\n"
    )));
    let out = v.run(&["approve", &eid]);
    assert!(
        out.stderr.contains("does not wait for review"),
        "{}",
        out.stderr
    );
    let out = v.run(&["validate"]);
    assert!(!out.stdout.contains("approval record"), "{}", out.stdout);
}

#[test]
fn review_about_signs_its_pages_and_a_range_moves_on() {
    let lab = vault();
    let today = today();
    let root = lab.root.canonicalize().unwrap();
    assert_eq!(lab.run(&["new", "project", "Toy"]).code, 0);
    let out = lab.run(&["new", "experiment", "Q", "--project", "PRJ-0001"]);
    let exp_path = lab.path(&out);
    let exp = exp_path.file_name().unwrap().to_string_lossy()[..19].to_string();
    fs::write(
        &exp_path,
        lab.read(&exp_path)
            .replacen("\n---\n", "\nreview: pending\n---\n", 1),
    )
    .unwrap();
    let out = lab.run(&["new", "run", "--experiment", &exp]);
    let run = lab.path(&out).file_stem().unwrap().to_string_lossy()[..19].to_string();
    fs::create_dir_all(root.join("code")).unwrap();
    fs::write(root.join("code/x.py"), "a = 1\n").unwrap();
    git(&root, &["init", "-q", "-b", "main"]);
    let commit = |msg: &str| {
        git(&root, &["add", "notes", "code", "yajna.toml"]);
        git(&root, &["commit", "-q", "-m", msg]);
        git(&root, &["rev-parse", "HEAD"]).trim().to_string()
    };
    let c1 = commit("one");
    fs::write(root.join("code/x.py"), "a = 2\n").unwrap();
    let c2 = commit("two");

    let range = format!("{c1}..{c2}");
    let out = lab.run(&["review", "open", &range, "--about", "EXP-20991231-zzzzzz"]);
    assert_eq!(out.code, 1, "an unknown page");
    let out = lab.run(&[
        "review",
        "open",
        &range,
        "--about",
        &exp,
        "--title",
        "The feature",
    ]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let rev_path = lab.path(&out);
    let rid = rev_path.file_name().unwrap().to_string_lossy()[..19].to_string();
    assert!(lab.read(&rev_path).contains(&format!("about: [{exp}]")));
    let out = lab.run(&["review", "about", &rid, &run, &exp]);
    assert!(
        out.stdout.contains(&format!("is about {exp}, {run}")),
        "{}",
        out.stdout
    );
    let out = lab.run(&["review", "list", "--target", &run]);
    assert!(out.stdout.contains(&rid), "{}", out.stdout);

    // a past range moves on to the commits that answer it, never back
    fs::write(root.join("code/x.py"), "a = 3\n").unwrap();
    let c3 = commit("three");
    let out = lab.run(&["review", "update", &rid, "--to", &c1]);
    assert!(out.stderr.contains("does not come after"), "{}", out.stderr);
    let out = lab.run(&["review", "update", &rid, "--to", "HEAD"]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    let page = lab.read(&rev_path);
    assert!(
        page.contains(&format!("head: {c3}\n")) && page.contains(&format!("ref: {c1}..{c3}\n")),
        "{page}"
    );
    let out = lab.run(&["review", "update", &rid]);
    assert!(out.stdout.contains("already"), "{}", out.stdout);

    // approving signs what it is about, in the review
    let out = lab.run(&["review", "approve", &rid]);
    assert_eq!(out.code, 0, "{}", out.stderr);
    assert!(
        out.stdout
            .contains(&format!("{exp}: review: approved in {rid}")),
        "{}",
        out.stdout
    );
    assert!(lab.read(&exp_path).contains(&format!(
        "review: approved\napproval: {{by: tester, on: {today}, in: {rid}}}\n"
    )));
    fill_experiments(&root);
    let out = lab.run(&["validate"]);
    assert_eq!(out.code, 0, "{}", out.stdout);
    // an approval naming a review that does not cover the page
    fs::write(
        &rev_path,
        lab.read(&rev_path)
            .replace(&format!("about: [{exp}, {run}]"), "about: []"),
    )
    .unwrap();
    let out = lab.run(&["validate"]);
    assert!(
        out.stdout.contains(&format!(
            "approved in {rid}, which neither reviews nor is about {exp}"
        )),
        "{}",
        out.stdout
    );
}

#[test]
fn validate_against_keeps_shared_pages_on_main_and_a_branch_on_one_project() {
    let v = git_lab();
    assert_eq!(v.run(&["new", "protocol", "Prep"]).code, 0);
    assert_eq!(v.run(&["new", "project", "Two"]).code, 0);
    git(&v.root, &["add", "-A"]);
    git(&v.root, &["commit", "-q", "-m", "shared"]);
    git(&v.root, &["checkout", "-q", "-b", "toy/x"]);
    let pro = v.root.join("notes/protocols/PRO-0001-prep.md");
    fs::write(&pro, v.read(&pro) + "\nA change.\n").unwrap();
    let out = v.run(&["validate", "--against", "main"]);
    assert!(
        out.code == 1
            && out
                .stdout
                .contains("PRO-0001 is a shared entity edited on this branch; edit it on main"),
        "{}{}",
        out.stdout,
        out.stderr
    );
    git(&v.root, &["checkout", "--", "notes"]);
    for p in ["PRJ-0001-toy", "PRJ-0002-two"] {
        let page = v.root.join(format!("notes/projects/{p}/README.md"));
        fs::write(&page, v.read(&page) + "\nMore.\n").unwrap();
    }
    let out = v.run(&["validate", "--against", "main"]);
    assert!(
        out.stdout
            .contains("this branch changes 2 projects (PRJ-0001, PRJ-0002)"),
        "{}",
        out.stdout
    );
}

/// Today in UTC, the timezone of the scratch notebooks.
fn today() -> String {
    let out = Command::new("date")
        .args(["-u", "+%Y-%m-%d"])
        .output()
        .unwrap();
    String::from_utf8_lossy(&out.stdout).trim().to_string()
}
