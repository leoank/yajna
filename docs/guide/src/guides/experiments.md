# Experiments

An experiment is one question, asked on purpose: what you expect, how you will find out,
and in the end what you found. It belongs to a project and collects the runs that answer
it.

```sh
yajna new experiment "Does a 42C pulse slow growth?" --project PRJ-0001
```

In a project-shaped repository, `--project` is not needed.

## Before the first run

Fill in four sections:

- **Question**: one sentence that a run can answer.
- **Hypothesis and predictions**: what you expect and what you would see if you are wrong.
  *If H1 is true we expect …; if false we expect …*
- **Plan**: the steps, with the protocols and materials they use linked.
- **Success criteria**: how you will know the question is answered.

Writing these first is what separates an experiment from a pile of runs. It also tells an
agent what it is supposed to be doing.

In the frontmatter, list the protocols, materials and builds it uses
(`protocols: [PRO-0012@3]`, `materials: [MAT-0210]`), and put a theme first in `tags`:
`yajna tree` and the site's experiment tree group by it.

## While it runs

Record runs (see [Runs and results](runs.md)) and list each one under *Runs* with a line on
what it tried and what it showed. Keep `status` current:

```text
planned → active → concluded
             ↓
           paused / abandoned
```

## Concluding

When the question is answered, set `status: concluded`, set `outcome`, and write the
*Conclusion*: once, by you.

| Outcome | Means |
|---------|-------|
| `positive` | The hypothesis held. |
| `negative` | It did not. A negative result is a result; record it as carefully. |
| `inconclusive` | The runs could not tell. Say why. |
| `infra` | The experiment was about tooling or setup rather than a hypothesis. |

Then go back to the project page: rewrite the experiment's line under *Experiments* with
what came of it, update *Current belief*, and add anything that failed to *What not to try
again*.

## Lineage

An experiment that exists because of an earlier one says so:

```yaml
influenced_by: [EXP-20261019-a3f9k2]
```

`yajna tree` prints `<- EXP-…` for it, and the site draws it as a dotted edge in the
project's experiment tree. Over months this is the map of how the project actually
thought, dead ends included.

## Analyses and artifacts

Two more page types hang off a project:

- **Analysis** (`yajna new analysis "<title>" --project PRJ-0001`): work on the data of one
  or more runs, such as a statistical comparison or a set of figures.
- **Artifact** (`yajna new artifact "<title>" --project PRJ-0001`): a result worth naming
  and pointing at, such as a dataset, a model checkpoint or a time-lapse. The page
  describes it and says where the bytes are; large files stay out of git.
