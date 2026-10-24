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
