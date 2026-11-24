// The server's APIs (docs/files-viewer.md 5.2) as typed fetches, read through TanStack
// Query so a slow network shows what was last known while it asks again (ADR-0041).

import { QueryClient, keepPreviousData, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { base, notebookBase } from './base';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** A JSON GET under `root` (the app's base by default). */
export async function getJson<T>(url: string, root = base): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${root}${url}`);
  } catch {
    netState.set(false);
    throw new ApiError(0, 'The server could not be reached.');
  }
  netState.set(true);
  const body = await res.json().catch(() => ({ error: res.statusText }));
  if (!res.ok) throw new ApiError(res.status, body.error ?? res.statusText);
  return body as T;
}

/** Whether the server was reachable at the last request, for the one *Reconnecting…* line. */
export const netState = (() => {
  let online = true;
  const subs = new Set<(v: boolean) => void>();
  return {
    get: () => online,
    set(v: boolean) {
      if (v === online) return;
      online = v;
      subs.forEach((s) => s(v));
    },
    subscribe(f: (v: boolean) => void) {
      subs.add(f);
      return () => void subs.delete(f);
    },
  };
})();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // what was read stays on screen while it is read again
      staleTime: 15_000,
      gcTime: 30 * 60_000,
      // a server that is not there is asked again, more slowly each time; a refusal is not
      retry: (n, e) => (e instanceof ApiError && e.status >= 400 && e.status < 500 ? false : n < 6),
      retryDelay: (n) => Math.min(800 * 2 ** n, 15_000),
      refetchOnWindowFocus: true,
      placeholderData: (prev: unknown) => prev,
    },
  },
});

// --- the shapes ------------------------------------------------------------------------

export interface Summary {
  id: string;
  type: string;
  title: string;
  status: string | null;
  outcome: string | null;
  /** concluded by an agent, not yet approved by a human (ADR-0042) */
  draft?: boolean;
  kind: string | null;
  project: string | null;
  experiment: string | null;
  created: string | null;
  author: string | null;
  tags: string[];
  note?: string;
}

export interface LogLine {
  date: string;
  time: string;
  author: string;
  html: string;
  path: string;
  line: number;
}

export interface Overview {
  namespace: string | null;
  shape: string;
  projects: (Summary & { experiments: number; runs: number; phases: { done: number; total: number; active: Summary | null } })[];
  collections: { type: string; label: string; count: number }[];
  recent: LogLine[];
  tasks_open: number;
}

export interface Page extends Summary {
  path: string;
  /** The page's directory in the files view, when it lies under a root. */
  dir?: string | null;
  html: string;
  fields: { key: string; value: string; ids: string[]; file: string | null }[];
  phases?: (Summary & { items: { done: number; total: number } })[];
  experiments?: Summary[];
  tree?: string;
  items?: { done: number; total: number };
  runs?: { columns: string[]; rows: (Summary & { finished: string | null; metrics: Record<string, string> })[] };
  backlinks: (Summary & { context: string })[];
  log: LogLine[];
}

/** What `/api/search` answers: the best pages with the passage where the words are, and
 * the newest log lines with them. */
export interface SearchResult {
  pages: (Summary & { snippet: string | null })[];
  pages_total: number;
  log: LogLine[];
  log_total: number;
}

export interface Task {
  done: boolean;
  page: Summary | null;
  path: string;
  line: number;
  section: string | null;
  html: string;
}

export interface Info {
  notebook: string;
  version: string;
  review: boolean;
  local?: boolean;
}

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

export interface ReviewSummary {
  id: string;
  title: string;
  status: string;
  kind: string;
  ref: string;
  open: number;
  threads: number;
  elsewhere: string | null;
}

// --- the queries -----------------------------------------------------------------------

type Opts<T> = Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>;
const q = encodeURIComponent;

export const keys = {
  info: ['info'] as const,
  overview: ['overview'] as const,
  page: (id: string) => ['page', id] as const,
  list: (type?: string, project?: string) => ['list', type ?? '', project ?? ''] as const,
  log: (skip: number) => ['log', skip] as const,
  tasks: (done: boolean) => ['tasks', done] as const,
  reviews: ['reviews'] as const,
  worktrees: ['worktrees'] as const,
  search: (text: string, limit: number) => ['search', text, limit] as const,
};

export const fetchers = {
  info: () => getJson<Info>('/api/info'),
  overview: () => getJson<Overview>('/api/notebook'),
  page: (id: string) => getJson<Page>(`/api/pages/${q(id)}`),
  list: (type?: string, project?: string) =>
    getJson<Summary[]>(`/api/pages?${type ? `type=${q(type)}` : ''}${project ? `&project=${q(project)}` : ''}`),
  log: (skip: number) => getJson<{ total: number; entries: LogLine[] }>(`/api/log?skip=${skip}&limit=100`),
  tasks: (done: boolean) => getJson<Task[]>(`/api/tasks?done=${done}`),
  reviews: () => getJson<ReviewSummary[]>('/api/reviews'),
  search: (text: string, limit: number) => getJson<SearchResult>(`/api/search?q=${q(text)}&limit=${limit}`),
  // the notebook's own list, whichever worktree this app shows
  worktrees: async () => {
    try {
      return (await getJson<{ worktrees: Worktree[] }>('/api/worktrees', notebookBase)).worktrees;
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return [] as Worktree[];
      throw e;
    }
  },
};

export const useInfo = () => useQuery({ queryKey: keys.info, queryFn: fetchers.info, staleTime: Infinity });
export const useOverview = () => useQuery({ queryKey: keys.overview, queryFn: fetchers.overview });
export const usePage = (id: string) => useQuery({ queryKey: keys.page(id), queryFn: () => fetchers.page(id) });
export const useList = (type?: string, project?: string, o: Opts<Summary[]> = {}) =>
  useQuery({ queryKey: keys.list(type, project), queryFn: () => fetchers.list(type, project), ...o });
/** Search as it is typed: nothing for fewer than two characters, the last answer kept
 * while the next one comes. */
export const useSearch = (text: string, limit = 50) =>
  useQuery({
    queryKey: keys.search(text.trim(), limit),
    queryFn: () => fetchers.search(text.trim(), limit),
    enabled: text.trim().length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
export const useWorktrees = () => useQuery({ queryKey: keys.worktrees, queryFn: fetchers.worktrees, refetchInterval: 10_000 });

/** Read a page before it is opened: on hover or focus of a link to it. */
export const prefetchPage = (id: string) => void queryClient.prefetchQuery({ queryKey: keys.page(id), queryFn: () => fetchers.page(id) });

// --- writes (ADR-0040) -------------------------------------------------------------------

/** `yajna serve --review`'s token from the URL, kept in memory and out of the address bar. */
let token = '';
export function takeToken() {
  const t = new URLSearchParams(location.search).get('token');
  if (t) {
    token = t;
    const s = new URLSearchParams(location.search);
    s.delete('token');
    history.replaceState(null, '', location.pathname + (s.size ? `?${s}` : '') + location.hash);
  }
}

export async function postJson<T>(url: string, body: unknown, root = base): Promise<T> {
  const res = await fetch(`${root}${url}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-yajna-token': token },
    body: JSON.stringify(body),
  });
  const out = await res.json().catch(() => ({ error: res.statusText }));
  if (!res.ok) throw new ApiError(res.status, out.error ?? res.statusText);
  return out as T;
}
