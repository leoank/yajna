//! Which project a page or a log line belongs to, for a project's scope in `yajna serve`
//! (ADR-0043). Conservative: what is not clearly one project's is left to *All projects*.

use std::collections::{BTreeSet, HashMap};

use crate::index::{Entity, Index};
use crate::vault::NS_ID_RE;

/// Page types every project shares; a scope lists them apart, as lab-wide.
const LAB_WIDE: [&str; 3] = ["protocol", "material", "equipment"];

pub(crate) struct Membership {
    owner: HashMap<String, String>,
}

/// A page that belongs to no project and that every project may use: a protocol, a
/// material, equipment, or a build of no project.
pub(crate) fn lab_wide(e: &Entity) -> bool {
    LAB_WIDE.contains(&e.etype.as_str()) || (e.etype == "build" && e.project.is_none())
}

impl Membership {
    /// A page belongs to the project it names in `project` (a project page to itself). A
    /// page that names none (an agent session, a review, a doc) belongs to a project when
    /// every page it links to that belongs to a project belongs to that one.
    pub(crate) fn of(ix: &Index) -> Membership {
        let all = ix.entities("", &[]);
        let mut owner: HashMap<String, String> = HashMap::new();
        for e in &all {
            if e.etype == "project" {
                owner.insert(e.id.clone(), e.id.clone());
            } else if let Some(p) = &e.project {
                owner.insert(e.id.clone(), p.clone());
            }
        }
        let mut targets: HashMap<String, BTreeSet<String>> = HashMap::new();
        for (src, dst) in ix.local_links() {
            if let Some(p) = owner.get(&dst) {
                targets.entry(src).or_default().insert(p.clone());
            }
        }
        for e in &all {
            if owner.contains_key(&e.id) || lab_wide(e) {
                continue;
            }
            if let Some(ps) = targets.get(&e.id) {
                if ps.len() == 1 {
                    owner.insert(e.id.clone(), ps.iter().next().cloned().unwrap_or_default());
                }
            }
        }
        Membership { owner }
    }

    /// The project `id` belongs to, if one.
    pub(crate) fn owner(&self, id: &str) -> Option<&str> {
        self.owner.get(id).map(String::as_str)
    }

    pub(crate) fn belongs(&self, id: &str, project: &str) -> bool {
        self.owner(id) == Some(project)
    }

    /// The projects a log line names pages of; empty when it names none, and then it is
    /// shown under *All projects* only.
    pub(crate) fn of_line(&self, text: &str) -> BTreeSet<String> {
        NS_ID_RE
            .captures_iter(text)
            .filter(|c| c.get(1).is_none())
            .filter_map(|c| self.owner(&c[2]).map(str::to_string))
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn m(pairs: &[(&str, &str)]) -> Membership {
        Membership { owner: pairs.iter().map(|(a, b)| (a.to_string(), b.to_string())).collect() }
    }

    #[test]
    fn a_line_belongs_to_the_projects_it_names() {
        let m = m(&[("PRJ-0001", "PRJ-0001"), ("EXP-0002", "PRJ-0001"), ("EXP-0003", "PRJ-0002")]);
        assert_eq!(m.of_line("ran [[EXP-0002]]").into_iter().collect::<Vec<_>>(), ["PRJ-0001"]);
        assert_eq!(m.of_line("[[EXP-0002]] against [[EXP-0003]]").len(), 2);
        // nothing named, a protocol only, or another notebook's page: no project
        assert!(m.of_line("fixed the build").is_empty());
        assert!(m.of_line("used [[PRO-0004]]").is_empty());
        assert!(m.of_line("see [[other/EXP-0002]]").is_empty());
    }
}
