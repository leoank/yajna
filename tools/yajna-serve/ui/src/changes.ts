// The changes view (ADR-0038): what is uncommitted, staged and recently committed in the
// notebook's worktrees, read on a phone as well as on a desktop. It opens on the worktrees
// and how much is uncommitted in each (ADR-0039), then one worktree's staged, changed,
// untracked and conflicted files and its commits, then one file's unified diff in a single
// column, from which the file opens in the viewer. Read-only; it reads again every few
// seconds while it is shown, so an agent's work shows up as it happens.
//
// The same element is a page of its own, `files/changes`, with the browser's history, and
// a tab of the workbench, `changes:`, with a back button of its own.

import { ApiError, base } from './api';
import { register, type Context, type Viewer } from './viewers/registry';

const EVERY = 4000;

export interface Worktree {
  name: string;
  branch: string | null;
  path: string;
  head: string | null;
  current: boolean;
  url: string;
  changed?: number;
  staged?: number;
  untracked?: number;
  conflicted?: number;
}

interface Change {
  rel: string;
  /** the files API's path, when a root shows it */
  path: string | null;
  status: string;
  old?: string;
}

interface Status {
  branch: string | null;
  head: string | null;
  upstream: string | null;
  ahead: number;
  behind: number;
  unstaged: Change[];
  staged: Change[];
  untracked: Change[];
  conflicted: Change[];
}

interface Commit {
  sha: string;
  short: string;
  author: string;
  time: number;
  parents: string[];
  subject: string;
  files: Change[];
}

interface Diff {
  diff: string;
  binary: boolean;
  truncated: boolean;
}

/** Where a view is: the worktree list, a worktree, or one file's diff in one. */
export interface Place {
  wt?: string;
  /** a file's diff: its path, the other side of a rename, and the two points */
  file?: string;
  old?: string;
  from?: string;
  to?: string;
  /** what the diff is of, for its heading */
  what?: string;
}

/** The notebook's own address, without a worktree's `/w/<branch>`. */
export const notebookBase = base.replace(/\/w\/[^/]+$/, '');

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = await res.json().catch(() => ({ error: res.statusText }));
  if (!res.ok) throw new ApiError(res.status, body.error ?? res.statusText);
  return body as T;
}

const q = encodeURIComponent;

export async function worktrees(): Promise<Worktree[] | null> {
  try {
    return (await get<{ worktrees: Worktree[] }>(`${notebookBase}/api/worktrees`)).worktrees;
  } catch (e) {
    // served for its own checkout only
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

/** Where a worktree's API is: the notebook's own for the checkout served, else its prefix. */
export const baseOf = (w: Worktree | null) => (!w || w.current ? notebookBase : `${notebookBase}/${w.url.replace(/\/$/, '')}`);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function ago(secs: number): string {
  const d = Date.now() / 1000 - secs;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)} min ago`;
  if (d < 86400) return `${Math.floor(d / 3600)} h ago`;
  if (d < 86400 * 30) return `${Math.floor(d / 86400)} d ago`;
  return new Date(secs * 1000).toISOString().slice(0, 10);
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

function counts(w: Worktree): string {
  const parts = [
    w.conflicted ? `${w.conflicted} conflicted` : '',
    w.staged ? `${w.staged} staged` : '',
    w.changed ? `${w.changed} changed` : '',
    w.untracked ? `${w.untracked} untracked` : '',
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'clean';
}

/** A path with its directory dimmed, the name in full. */
function pathEl(rel: string): HTMLElement {
  const box = el('span', 'yc-path');
  const cut = rel.lastIndexOf('/') + 1;
  if (cut) box.append(el('span', 'yc-dir', rel.slice(0, cut)));
  box.append(el('span', 'yc-name', rel.slice(cut)));
  return box;
}

const STATUS: Record<string, string> = { M: 'modified', T: 'type changed', A: 'added', D: 'deleted', R: 'renamed', C: 'copied', U: 'conflicted', '?': 'untracked' };

/** A unified diff, one column: old and new line numbers, then the line. */
export function diffEl(text: string): HTMLElement {
  const box = el('div', 'yc-diff');
  let o = 0;
  let n = 0;
  let inHunk = false;
  const notes: string[] = [];
  const row = (cls: string, a: string, b: string, line: string) => {
    const r = el('div', `yc-line ${cls}`);
    r.append(el('span', 'yc-no', a), el('span', 'yc-no', b), el('span', 'yc-text', line));
    box.append(r);
  };
  for (const line of text.split('\n')) {
    const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(.*)$/.exec(line);
    if (hunk) {
      inHunk = true;
      o = Number(hunk[1]);
      n = Number(hunk[2]);
      row('yc-hunk', '', '', hunk[3].trim() ? `⋯ ${hunk[3].trim()}` : '⋯');
    } else if (!inHunk) {
      if (/^(new file|deleted file|rename from|rename to|similarity|Binary files|old mode|new mode)/.test(line)) notes.push(line);
    } else if (line.startsWith('+')) row('yc-add', '', String(n++), line.slice(1));
    else if (line.startsWith('-')) row('yc-del', String(o++), '', line.slice(1));
    else if (line.startsWith(' ')) row('yc-ctx', String(o++), String(n++), line.slice(1));
    else if (line.startsWith('\\')) row('yc-meta', '', '', line.slice(2));
    else if (line.startsWith('diff ')) inHunk = false;
  }
  if (notes.length) {
    const head = el('div', 'yc-notes');
    for (const t of notes) head.append(el('div', '', t));
    box.prepend(head);
  }
  return box;
}

export class Changes {
  readonly element = el('div', 'yc');
  private head = el('div', 'yc-head');
  private body = el('div', 'yc-body');
  private place: Place;
  private list: Worktree[] | null = null;
  private shown = '';
  private timer = 0;
  private loads = 0;
  private more: Map<string, Commit[]> = new Map();

  constructor(
    start: Place,
    /** moved to another place: the page records it in history */
    private onMove: (p: Place, replace: boolean) => void,
    /** a file in a worktree, to open in the viewer */
    private openFile: (path: string, w: Worktree | null) => void,
  ) {
    this.place = start;
    this.element.append(this.head, this.body);
    void this.load();
    this.timer = window.setInterval(() => {
      if (document.visibilityState === 'visible' && this.element.isConnected) void this.load(true);
    }, EVERY);
  }

  dispose() {
    window.clearInterval(this.timer);
  }

  /** Show `p`; from history, without recording it again. */
  go(p: Place, record = true) {
    this.place = p;
    this.shown = '';
    this.more.clear();
    this.moreNext = undefined;
    if (record) this.onMove(p, false);
    void this.load();
  }

  back() {
    const p = this.place;
    this.go(p.file ? { wt: p.wt } : {});
  }

  private wt(): Worktree | null {
    if (!this.list) return null;
    return this.list.find((w) => w.name === this.place.wt) ?? null;
  }

  private async load(quiet = false) {
    const token = ++this.loads;
    try {
      this.list = await worktrees();
      // one checkout only, or only one worktree: straight to it
      if (!this.place.wt && (this.list === null || this.list.length === 1)) {
        const only = this.list?.[0];
        this.place = { ...this.place, wt: only?.name ?? '' };
        this.onMove(this.place, true);
      }
      if (token !== this.loads) return;
      if (this.place.file) await this.showDiff(token, quiet);
      else if (this.place.wt !== undefined) await this.showWorktree(token);
      else this.showList();
    } catch (e) {
      if (token !== this.loads || quiet) return;
      this.header(this.place.wt ?? 'Changes', this.place.wt !== undefined);
      this.body.replaceChildren(el('div', 'yc-message', (e as Error).message));
    }
  }

  private header(title: string, back: boolean, sub = '') {
    const h = this.head;
    h.replaceChildren();
    if (back) {
      const b = el('button', 'yc-back', '‹');
      b.title = 'Back';
      b.setAttribute('aria-label', 'Back');
      b.addEventListener('click', () => this.back());
      h.append(b);
    }
    const t = el('div', 'yc-title');
    t.append(el('div', 'yc-name', title));
    if (sub) t.append(el('div', 'yc-sub', sub));
    h.append(t);
  }

  /** Replace the body only when what it shows changed, keeping the scroll. */
  private draw(key: string, build: () => HTMLElement[]) {
    if (key === this.shown) return;
    this.shown = key;
    const top = this.body.scrollTop;
    this.body.replaceChildren(...build());
    this.body.scrollTop = top;
  }

  private showList() {
    const list = this.list ?? [];
    this.header('Worktrees', false, plural(list.length, 'worktree'));
    this.draw(JSON.stringify(list), () => {
      const ul = el('ul', 'yc-list');
      for (const w of list) {
        const li = el('li', 'yc-row yc-tap');
        const main = el('div', 'yc-main');
        main.append(el('div', 'yc-name', w.name));
        main.append(el('div', 'yc-sub', counts(w)));
        li.append(main);
        if (w.current) li.append(el('span', 'yc-badge', 'here'));
        const dirty = (w.changed ?? 0) + (w.staged ?? 0) + (w.untracked ?? 0) + (w.conflicted ?? 0);
        if (dirty) li.append(el('span', 'yc-count', String(dirty)));
        li.addEventListener('click', () => this.go({ wt: w.name }));
        ul.append(li);
      }
      return [ul];
    });
  }

  private async showWorktree(token: number) {
    const w = this.wt();
    const at = baseOf(w);
    const roots = await get<{ name: string; exists: boolean }[]>(`${at}/api/files/roots`);
    const root = roots.find((r) => r.exists);
    if (!root) throw new Error('no root of this notebook is on this machine');
    const [s, log] = await Promise.all([
      get<Status>(`${at}/api/git/status?path=${q(root.name)}`),
      get<{ commits: Commit[]; next?: string }>(`${at}/api/git/log?path=${q(root.name)}&limit=20`),
    ]);
    if (token !== this.loads) return;
    const sync = [s.ahead ? `${s.ahead} ahead` : '', s.behind ? `${s.behind} behind` : ''].filter(Boolean).join(', ');
    const name = this.place.wt || s.branch || 'this checkout';
    this.header(name, (this.list?.length ?? 0) > 1, [s.upstream ? `${s.upstream}${sync ? `: ${sync}` : ''}` : '', s.head?.slice(0, 7) ?? ''].filter(Boolean).join(' · '));
    const older = [...this.more.values()].flat();
    this.draw(JSON.stringify([s, log, older.length]), () => {
      const out: HTMLElement[] = [];
      const section = (title: string, files: Change[], from: string, to: string) => {
        if (!files.length) return;
        out.push(el('h3', 'yc-section', `${title} · ${files.length}`));
        const ul = el('ul', 'yc-list');
        for (const c of files) ul.append(this.fileRow(c, from, to, title.toLowerCase()));
        out.push(ul);
      };
      section('Conflicted', s.conflicted, 'HEAD', 'WORK');
      section('Staged', s.staged, 'HEAD', 'INDEX');
      section('Changed', s.unstaged, 'INDEX', 'WORK');
      section('Untracked', s.untracked, 'HEAD', 'WORK');
      if (!s.conflicted.length && !s.staged.length && !s.unstaged.length && !s.untracked.length) {
        out.push(el('div', 'yc-message', 'Nothing uncommitted.'));
      }
      out.push(el('h3', 'yc-section', 'Commits'));
      const ul = el('ul', 'yc-list');
      for (const c of [...log.commits, ...older]) ul.append(this.commitRow(c));
      out.push(ul);
      // where the next page starts: after the first page, or after the last one loaded
      const cursor = older.length ? this.moreNext : log.next;
      if (cursor) {
        const b = el('button', 'yc-more', 'Older commits');
        b.addEventListener('click', async () => {
          b.disabled = true;
          const page = await get<{ commits: Commit[]; next?: string }>(`${at}/api/git/log?path=${q(root.name)}&limit=20&before=${q(cursor)}`);
          this.moreNext = page.next;
          this.more.set(cursor, page.commits);
          this.shown = '';
          void this.load(true);
        });
        out.push(b);
      }
      return out;
    });
  }

  private moreNext?: string;

  private fileRow(c: Change, from: string, to: string, what: string): HTMLElement {
    const li = el('li', `yc-row yc-file${c.path ? ' yc-tap' : ' yc-off'}`);
    const s = el('span', `yc-status yc-s-${c.status === '?' ? 'u' : c.status}`, c.status);
    s.title = STATUS[c.status] ?? c.status;
    const main = el('div', 'yc-main');
    main.append(pathEl(c.rel));
    if (c.old) main.append(el('div', 'yc-sub', `from ${c.old}`));
    if (!c.path) main.append(el('div', 'yc-sub', 'under no root of the viewer'));
    li.append(s, main);
    if (c.path) {
      const path = c.path;
      // the other side of a rename, under the same root
      const old = c.old && path.endsWith(c.rel) ? path.slice(0, path.length - c.rel.length) + c.old : undefined;
      li.addEventListener('click', () => this.go({ wt: this.place.wt, file: path, old, from, to, what }));
    }
    return li;
  }

  private commitRow(c: Commit): HTMLElement {
    const li = el('li', 'yc-commit');
    const row = el('div', 'yc-row yc-tap');
    const main = el('div', 'yc-main');
    main.append(el('div', 'yc-subject', c.subject));
    main.append(el('div', 'yc-sub', `${c.short} · ${c.author} · ${ago(c.time)} · ${plural(c.files.length, 'file')}`));
    row.append(main);
    const files = el('ul', 'yc-list yc-nested');
    files.hidden = true;
    row.addEventListener('click', () => {
      if (files.hidden && !files.childElementCount) {
        // the first commit has no parent to compare with
        const from = c.parents.length ? `${c.sha}^` : '';
        for (const f of c.files) {
          if (from) files.append(this.fileRow(f, from, c.sha, `${c.short} ${c.subject}`));
          else files.append(el('li', 'yc-row yc-off', f.rel));
        }
      }
      files.hidden = !files.hidden;
      li.classList.toggle('yc-open', !files.hidden);
    });
    li.append(row, files);
    return li;
  }

  private async showDiff(token: number, quiet: boolean) {
    const p = this.place;
    const w = this.wt();
    const at = baseOf(w);
    const url = `${at}/api/git/diff?path=${q(p.file!)}&from=${q(p.from ?? 'HEAD')}&to=${q(p.to ?? 'WORK')}${p.old ? `&old=${q(p.old)}` : ''}`;
    // a diff of committed points does not change; only one reaching into the work tree is read again
    if (quiet && p.to !== 'WORK' && p.to !== 'INDEX') return;
    const d = await get<Diff>(url);
    if (token !== this.loads) return;
    const rel = p.file!.slice(p.file!.indexOf('/') + 1);
    this.header(rel.slice(rel.lastIndexOf('/') + 1), true, `${p.what ?? ''}${p.what ? ' · ' : ''}${this.place.wt ?? ''}`);
    this.draw(JSON.stringify(d), () => {
      const out: HTMLElement[] = [];
      const bar = el('div', 'yc-bar');
      bar.append(pathEl(p.file!));
      if (p.to === 'WORK' || p.to === 'INDEX') {
        const open = el('button', 'yc-open-file', 'Open');
        open.addEventListener('click', () => this.openFile(p.file!, w));
        bar.append(open);
      }
      out.push(bar);
      if (d.binary) out.push(el('div', 'yc-message', 'A binary file: no lines to show.'));
      else if (!d.diff.trim()) out.push(el('div', 'yc-message', 'No differences.'));
      else out.push(diffEl(d.diff));
      if (d.truncated) out.push(el('div', 'yc-message', 'The diff is cut off: it is over 4 MB.'));
      return out;
    });
  }
}

/** A place in the page's address: `?wt=<name>&file=<path>&from=&to=&old=&what=`. */
export function placeFromUrl(): Place {
  const s = new URLSearchParams(location.search);
  const p: Place = {};
  for (const k of ['wt', 'file', 'old', 'from', 'to', 'what'] as const) {
    const v = s.get(k);
    if (v !== null) p[k] = v;
  }
  return p;
}

export function placeToUrl(p: Place): string {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) if (v !== undefined) s.set(k, v);
  const qs = s.toString();
  return location.pathname + (qs ? `?${qs}` : '');
}

// the workbench's tab, `changes:`
register({
  name: 'changes',
  score: (stat) => (stat.kind === 'changes' ? 100 : 0),
  async mount(box: HTMLElement, ctx: Context): Promise<Viewer> {
    const view = new Changes(
      {},
      () => {},
      // a file of the worktree this viewer shows opens in a tab; another's in its own viewer
      (path, w) => (baseOf(w) === base ? ctx.open(path) : window.open(`${baseOf(w)}/files/#${encodeURI(path)}`, '_blank')),
    );
    box.append(view.element);
    box.classList.add('yc-tab');
    return { dispose: () => view.dispose() };
  },
});
