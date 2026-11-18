// Where the app is served: the path the page's inline script worked out, without a trailing
// slash ('' at the root). Every request and route is relative to it.
declare global {
  interface Window {
    __YAJNA_BASE__?: string;
  }
}

export const base: string = (window.__YAJNA_BASE__ ?? '').replace(/\/$/, '');

/** The notebook's own address, without a worktree's `/w/<branch>` (ADR-0039). */
export const notebookBase = base.replace(/\/w\/[^/]+$/, '');

/** The worktree this app shows, when it is served under `/w/<branch>`. */
export const shownWorktree: string | null = (() => {
  const m = /\/w\/([^/]+)$/.exec(base);
  return m ? decodeURIComponent(m[1]) : null;
})();
