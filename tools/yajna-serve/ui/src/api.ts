// The read-only file API of `yajna serve` (docs/files-viewer.md 5.2).

export interface Root {
  name: string;
  path: string;
  exists: boolean;
  watch: string;
  /** how changes reach the viewer: notify, poll or off */
  live: 'notify' | 'poll' | 'off';
}

export type Kind = 'dir' | 'file' | 'broken' | 'loop' | 'other';

export interface Entry {
  name: string;
  kind: Kind;
  size?: number;
  mtime?: number;
  link?: string;
}

export interface Listing {
  path: string;
  /** the directory's own mtime */
  mtime?: number;
  total: number;
  entries: Entry[];
  next?: number;
}

export interface Stat {
  path: string;
  kind: string;
  size?: number;
  mtime?: number;
  mime: string;
  text: boolean;
  link?: string;
}

export interface Rendered {
  html: string;
  id?: string;
  title?: string;
}

export interface Info {
  notebook: string;
  version: string;
  /** reviews can be written: the server runs with --review */
  review: boolean;
}

// --- reviews (docs/review.md 7.2) ---

export interface ReviewSummary {
  id: string;
  title: string;
  status: string;
  kind: string;
  ref: string;
  open: number;
  threads: number;
  /** the worktree it lives in, when not this checkout */
  elsewhere: string | null;
}

export interface Anchor {
  raw: string;
  path?: string;
  from?: number;
  to?: number;
  heading?: string;
  commit?: string;
}

export interface Reply {
  when: string;
  author: string;
  action: 'addressed' | 'resolved' | 'reopened' | null;
  commit: string | null;
  text: string;
}

export interface Thread {
  n: number;
  state: 'open' | 'addressed' | 'resolved' | 'outdated';
  anchor: Anchor;
  quote: string[];
  replies: Reply[];
}

export interface ChangedFile {
  status: string;
  path: string;
  old?: string;
}

/** A commit named in an `addressed in` reply, read on its own. */
export interface Fix {
  commit: string;
  /** its first parent, or the empty tree */
  parent: string;
  subject: string;
  /** the threads it addressed */
  threads: number[];
  files: ChangedFile[];
}

export interface Review {
  id: string;
  title: string;
  status: string;
  kind: string;
  ref: string;
  base: string;
  head: string;
  page: string;
  /** the pages the review is about besides its target */
  about: string[];
  /** who the viewer writes as */
  author: string;
  summary: string;
  files: ChangedFile[];
  /** the heads before each review update, oldest first */
  rounds: string[];
  /** what changed since the last update: its head to the head */
  since: { from: string; files: ChangedFile[] } | null;
  fixes: Fix[];
  /** changed after the head or not committed (status `?`: untracked), not in the review yet */
  unreviewed: ChangedFile[];
  threads: Thread[];
  problems: string[];
  /** the page's version, sent back with a write */
  version: string;
}

export interface Sides {
  path: string;
  base: string | null;
  head: string | null;
}

export interface Write {
  thread?: string;
  at?: string;
  text?: string;
  commit?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function json<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = await res.json().catch(() => ({ error: res.statusText }));
  if (!res.ok) throw new ApiError(res.status, body.error ?? res.statusText);
  return body as T;
}

const q = (path: string) => encodeURIComponent(path);

export const api = {
  info: () => json<Info>('/api/info'),
  roots: () => json<Root[]>('/api/files/roots'),
  list: (path: string, cursor = 0) => json<Listing>(`/api/files/list?path=${q(path)}&cursor=${cursor}`),
  stat: (path: string) => json<Stat>(`/api/files/stat?path=${q(path)}`),
  render: (path: string) => json<Rendered>(`/api/files/render?path=${q(path)}`),
};

/** The token from the URL `yajna serve --review` printed, kept in memory only. */
let token = '';
export const setToken = (t: string) => (token = t);
export const canWrite = () => token !== '';

export const reviews = {
  list: () => json<ReviewSummary[]>('/api/reviews'),
  get: (id: string) => json<Review>(`/api/reviews/${q(id)}`),
  /** a changed file at the base and head, or `between` a round's or a fix's two commits;
   * with `work`, at the head and in the working tree */
  file: (id: string, f: ChangedFile, work = false, between?: { from: string; to: string }) =>
    json<Sides>(
      `/api/reviews/${q(id)}/file?path=${q(f.path)}${f.old ? `&old=${q(f.old)}` : ''}${work ? '&work=true' : ''}${
        between ? `&from=${q(between.from)}&to=${q(between.to)}` : ''
      }`,
    ),
  /** A write; a page that changed since `version` is refused with status 409. */
  async write(id: string, action: string, version: string, w: Write): Promise<Review> {
    const res = await fetch(`/api/reviews/${q(id)}/${action}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-yajna-token': token },
      body: JSON.stringify({ version, ...w }),
    });
    const body = await res.json().catch(() => ({ error: res.statusText }));
    if (!res.ok) throw new ApiError(res.status, body.error ?? res.statusText);
    return body as Review;
  },
};

export const rawUrl = (path: string) => `/api/files/raw?path=${q(path)}`;

/** The file's bytes, or the first `limit` of them. */
export async function raw(path: string, limit?: number): Promise<ArrayBuffer> {
  const headers: Record<string, string> = limit ? { Range: `bytes=0-${limit - 1}` } : {};
  const res = await fetch(rawUrl(path), { headers });
  if (!res.ok && res.status !== 206) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, body.error ?? res.statusText);
  }
  return res.arrayBuffer();
}

export function formatSize(n?: number): string {
  if (n === undefined) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return i === 0 ? `${n} B` : `${v.toFixed(v < 10 ? 1 : 0)} ${units[i]}`;
}

export function formatTime(ms?: number): string {
  if (ms === undefined) return '';
  const d = new Date(ms);
  const pad = (x: number) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const basename = (path: string) => path.slice(path.lastIndexOf('/') + 1);
export const dirname = (path: string) => path.slice(0, Math.max(0, path.lastIndexOf('/')));

/** `rel` against the directory `dir`, both `/`-separated viewer paths; null if it climbs above the root. */
export function join(dir: string, rel: string): string | null {
  const parts = dir.split('/');
  for (const seg of rel.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') {
      if (parts.length <= 1) return null;
      parts.pop();
    } else parts.push(seg);
  }
  return parts.join('/');
}
