// Where the app is served: the path the page's inline script worked out, without a trailing
// slash ('' at the root). Every request and route is relative to it.
declare global {
  interface Window {
    __YAJNA_BASE__?: string;
  }
}

export const base: string = (window.__YAJNA_BASE__ ?? '').replace(/\/$/, '');

const SCOPED = /\/project\/([^/]+)(?:\/w\/([^/]+))?$/;
const WORKTREE = /\/w\/([^/]+)$/;

/** The notebook's own address, without a worktree's `/w/<branch>` (ADR-0039) or a
 * project's `/project/<slug>` (ADR-0043). */
export const notebookBase = base.replace(SCOPED, '').replace(WORKTREE, '');

const dec = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** The project this app is scoped to, by its slug, and the worktree named in the address
 * when it is not the project's home (ADR-0043). */
export const scope: { slug: string; worktree: string | null } | null = (() => {
  const m = SCOPED.exec(base);
  return m ? { slug: dec(m[1]), worktree: m[2] ? dec(m[2]) : null } : null;
})();

/** The worktree this app shows, when it is served under `/w/<branch>`. */
export const shownWorktree: string | null = (() => {
  if (scope) return scope.worktree;
  const m = WORKTREE.exec(base);
  return m ? dec(m[1]) : null;
})();

/** A path within the app at another scope: `''` for *All projects*, else a project's
 * `project/<slug>/`, as `/api/projects` gives it. */
export const at = (scopeUrl: string, rel = '') => `${notebookBase}/${scopeUrl}${rel.replace(/^\/+/, '')}`;
