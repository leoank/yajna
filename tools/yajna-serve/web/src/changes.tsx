// The changes view (ADR-0038) and its actions (ADR-0040): a worktree's conflicted, staged,
// changed and untracked files and its commits, a file's diff in one column, and, where the
// server lets this viewer write, staging and unstaging a file or a hunk and committing.
// Every write names what was shown (a hunk's ID, the staged tree), so nothing unseen is
// staged or committed; a refusal says so and the view reads again.

import { useState, type ReactElement } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, ChevronRight, FileText, GitCommitHorizontal, Minus, Plus } from 'lucide-react';
import { ApiError, getJson, postJson, useInfo, useWorktrees, type Worktree } from './api';
import { base, notebookBase, shownWorktree } from './base';
import { Link, navigate } from './router';
import { Shell } from './Shell';
import { Empty, Failed, Sk, SkRows } from './ui';

interface Change {
  rel: string;
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
  tree: string | null;
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
  hunks: { header: string; id: string }[];
}

const q = encodeURIComponent;
const STATUS: Record<string, string> = { M: 'modified', T: 'type changed', A: 'added', D: 'deleted', R: 'renamed', C: 'copied', U: 'conflicted', '?': 'untracked' };

/** The API root of the worktree a changes view looks at. */
function rootOf(w: Worktree | undefined): string {
  if (!w) return base;
  return w.current ? notebookBase : `${notebookBase}/${w.url.replace(/\/$/, '')}`;
}

function ago(secs: number): string {
  const d = Date.now() / 1000 - secs;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)} min ago`;
  if (d < 86400) return `${Math.floor(d / 3600)} h ago`;
  if (d < 86400 * 30) return `${Math.floor(d / 86400)} d ago`;
  return new Date(secs * 1000).toISOString().slice(0, 10);
}

function PathText({ rel }: { rel: string }) {
  const cut = rel.lastIndexOf('/') + 1;
  return (
    <span className="cv-path" title={rel}>
      {cut > 0 && <span className="cv-dir">{rel.slice(0, cut)}</span>}
      <span className="cv-name">{rel.slice(cut)}</span>
    </span>
  );
}

function useToast() {
  const [t, setT] = useState<{ text: string; tone: 'ok' | 'bad' } | null>(null);
  const show = (text: string, tone: 'ok' | 'bad') => {
    setT({ text, tone });
    window.setTimeout(() => setT((cur) => (cur?.text === text ? null : cur)), tone === 'bad' ? 7000 : 3000);
  };
  const el = t ? <div className={`toast ${t.tone}`} role="status">{t.text}</div> : null;
  return [el, show] as const;
}

/** The roots of a worktree's notebook: git status needs a path under one. */
function useRoot(api: string) {
  return useQuery({
    queryKey: ['roots', api],
    queryFn: async () => (await getJson<{ name: string; exists: boolean }[]>('/api/files/roots', api)).find((r) => r.exists)?.name ?? null,
    staleTime: Infinity,
  });
}

export function Changes({ search }: { search: URLSearchParams }) {
  const { data: wts, isLoading: wtLoading } = useWorktrees();
  const wt = search.get('wt');
  const file = search.get('file');
  const many = (wts?.length ?? 0) > 1;
  // one worktree, or a server of one checkout: straight to it
  const chosen: string | null = wt ?? (wts && !many ? wts[0]?.name ?? '' : shownWorktree);
  const w = wts?.find((x) => x.name === chosen);
  const go = (params: Record<string, string | undefined>) => {
    const s = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v !== undefined) s.set(k, v);
    navigate(`changes${s.size ? `?${s}` : ''}`);
  };
  if (wtLoading && !wts) {
    return (
      <Shell title="Changes">
        <SkRows />
      </Shell>
    );
  }
  if (chosen === null) return <WorktreeList list={wts ?? []} go={go} />;
  if (file) {
    return (
      <FileDiff
        wt={w}
        wtName={chosen}
        path={file}
        old={search.get('old') ?? undefined}
        from={search.get('from') ?? 'HEAD'}
        to={search.get('to') ?? 'WORK'}
        what={search.get('what') ?? ''}
        back={() => go({ wt: chosen || undefined })}
      />
    );
  }
  return <WorktreeChanges w={w} name={chosen} many={many} go={go} />;
}

function WorktreeList({ list, go }: { list: Worktree[]; go: (p: Record<string, string | undefined>) => void }) {
  const dirty = (w: Worktree) => (w.changed ?? 0) + (w.staged ?? 0) + (w.untracked ?? 0) + (w.conflicted ?? 0);
  const counts = (w: Worktree) =>
    [w.conflicted && `${w.conflicted} conflicted`, w.staged && `${w.staged} staged`, w.changed && `${w.changed} changed`, w.untracked && `${w.untracked} untracked`]
      .filter(Boolean)
      .join(' · ') || 'clean';
  return (
    <Shell title="Changes">
      <div className="page-head">
        <h1 className="title">Changes</h1>
        <div className="sub">What is uncommitted in each worktree of the notebook.</div>
      </div>
      <div className="card rows">
        {list.map((w) => (
          <div key={w.name} className="row tap" onClick={() => go({ wt: w.name })}>
            <span className="grow">
              <div className="t">{w.name}</div>
              <div className="n2">{counts(w)}</div>
            </span>
            {w.current && <span className="chip run">served here</span>}
            {dirty(w) > 0 && <span className="chip warn">{dirty(w)}</span>}
            <ChevronRight size={16} className="muted" />
          </div>
        ))}
      </div>
    </Shell>
  );
}

function WorktreeChanges({ w, name, many, go }: { w?: Worktree; name: string; many: boolean; go: (p: Record<string, string | undefined>) => void }) {
  const api = rootOf(w);
  const qc = useQueryClient();
  const { data: info } = useInfo();
  const canWrite = !!info?.review;
  const { data: root } = useRoot(api);
  const status = useQuery({
    queryKey: ['git-status', api],
    queryFn: () => getJson<Status>(`/api/git/status?path=${q(root!)}`, api),
    enabled: !!root,
    refetchInterval: 4000,
  });
  const [pages, setPages] = useState<string[]>([]);
  const log = useQuery({
    queryKey: ['git-log', api, pages.length],
    queryFn: async () => {
      const first = await getJson<{ commits: Commit[]; next?: string }>(`/api/git/log?path=${q(root!)}&limit=20`, api);
      let all = first.commits;
      let next = first.next;
      for (const _ of pages) {
        if (!next) break;
        const p = await getJson<{ commits: Commit[]; next?: string }>(`/api/git/log?path=${q(root!)}&limit=20&before=${q(next)}`, api);
        all = all.concat(p.commits);
        next = p.next;
      }
      return { commits: all, next };
    },
    enabled: !!root,
    refetchInterval: 15000,
  });
  const [toast, show] = useToast();
  const [message, setMessage] = useState('');
  const write = useMutation({
    mutationFn: ({ action, body }: { action: string; body: object }) => postJson<unknown>(`/api/git/${action}`, body, api),
    onError: (e) => {
      show(e instanceof ApiError && e.status === 409 ? `${e.message}` : (e as Error).message, 'bad');
      void qc.invalidateQueries({ queryKey: ['git-status', api] });
    },
    onSuccess: (_, v) => {
      if (v.action === 'commit') {
        setMessage('');
        show('Committed.', 'ok');
        void qc.invalidateQueries({ queryKey: ['git-log', api] });
      }
      void qc.invalidateQueries({ queryKey: ['git-status', api] });
      void qc.invalidateQueries({ queryKey: ['worktrees'] });
    },
  });
  const s = status.data;
  const sync = s ? [s.ahead ? `${s.ahead} ahead` : '', s.behind ? `${s.behind} behind` : ''].filter(Boolean).join(', ') : '';
  const open = (c: Change, from: string, to: string, what: string) => {
    if (!c.path) return;
    const old = c.old && c.path.endsWith(c.rel) ? c.path.slice(0, c.path.length - c.rel.length) + c.old : undefined;
    go({ wt: name || undefined, file: c.path, old, from, to, what });
  };
  const section = (title: string, files: Change[], from: string, to: string, act?: 'stage' | 'unstage') =>
    files.length > 0 && (
      <>
        <h2 className="section">
          {title} <span className="n">{files.length}</span>
          {canWrite && act && files.some((f) => f.path) && (
            <button
              className="btn small"
              style={{ marginLeft: 'auto', textTransform: 'none', letterSpacing: 0 }}
              disabled={write.isPending}
              onClick={() => files.filter((f) => f.path).forEach((f) => write.mutate({ action: act, body: { path: f.path, old: undefined } }))}
            >
              {act === 'stage' ? 'Stage all' : 'Unstage all'}
            </button>
          )}
        </h2>
        <div className="card rows">
          {files.map((c) => (
            <div key={`${title}${c.rel}`} className={`row${c.path ? ' tap' : ''}`} onClick={() => open(c, from, to, title.toLowerCase())}>
              <span className={`cv-status cv-s-${c.status === '?' ? 'u' : c.status}`} title={STATUS[c.status] ?? c.status}>
                {c.status}
              </span>
              <span className="grow">
                <PathText rel={c.rel} />
                {c.old && <div className="n2">from {c.old}</div>}
                {!c.path && <div className="n2">under no root of the viewer</div>}
              </span>
              {canWrite && act && c.path && (
                <button
                  className="btn small"
                  title={act === 'stage' ? 'Stage this file' : 'Unstage this file'}
                  disabled={write.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    const old = c.old && c.path!.endsWith(c.rel) ? c.path!.slice(0, c.path!.length - c.rel.length) + c.old : undefined;
                    write.mutate({ action: act, body: { path: c.path, old } });
                  }}
                >
                  {act === 'stage' ? <Plus size={13} /> : <Minus size={13} />}
                </button>
              )}
            </div>
          ))}
        </div>
      </>
    );
  return (
    <Shell title={`Changes · ${name || 'here'}`}>
      <div className="page-head">
        <div className="crumbs">
          {many && <Link to="changes">Changes</Link>}
          {many && <span>/</span>}
          <span>worktree</span>
        </div>
        <h1 className="title">{name || s?.branch || 'This checkout'}</h1>
        <div className="sub">{s ? [s.upstream && `${s.upstream}${sync ? `: ${sync}` : ''}`, s.head?.slice(0, 7)].filter(Boolean).join(' · ') : <Sk w={160} h={13} />}</div>
      </div>
      {status.error && !s && <Failed error={status.error} retry={status.refetch} />}
      {!s && !status.error && <SkRows n={4} />}
      {s && (
        <>
          {section('Conflicted', s.conflicted, 'HEAD', 'WORK')}
          {section('Staged', s.staged, 'HEAD', 'INDEX', 'unstage')}
          {canWrite && s.staged.length > 0 && (
            <div className="card pad" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <textarea className="input" rows={3} placeholder="What these changes do, and why" value={message} onChange={(e) => setMessage(e.target.value)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="muted" style={{ fontSize: 12.5, flex: 1 }}>
                  Commits the {s.staged.length} staged file{s.staged.length === 1 ? '' : 's'} as git is set up on that machine.
                </span>
                <button
                  className="btn primary"
                  disabled={!message.trim() || write.isPending || !s.tree}
                  onClick={() => write.mutate({ action: 'commit', body: { path: root, message, tree: s.tree } })}
                >
                  <GitCommitHorizontal size={15} /> Commit
                </button>
              </div>
            </div>
          )}
          {section('Changed', s.unstaged, 'INDEX', 'WORK', 'stage')}
          {section('Untracked', s.untracked, 'HEAD', 'WORK', 'stage')}
          {!s.conflicted.length && !s.staged.length && !s.unstaged.length && !s.untracked.length && (
            <div className="card">
              <Empty>
                <Check size={16} style={{ verticalAlign: '-3px' }} /> Nothing uncommitted.
              </Empty>
            </div>
          )}
        </>
      )}
      <h2 className="section">Commits</h2>
      {!log.data ? (
        <SkRows n={5} />
      ) : (
        <div className="card rows">
          {log.data.commits.map((c) => (
            <CommitRow key={c.sha} c={c} open={open} />
          ))}
        </div>
      )}
      {log.data?.next && (
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <button className="btn" onClick={() => setPages([...pages, log.data!.next!])} disabled={log.isFetching}>
            Older commits
          </button>
        </div>
      )}
      {toast}
    </Shell>
  );
}

function CommitRow({ c, open }: { c: Commit; open: (c: Change, from: string, to: string, what: string) => void }) {
  const [shown, setShown] = useState(false);
  return (
    <>
      <div className="row tap" onClick={() => setShown(!shown)}>
        <ChevronRight size={15} className="muted" style={{ transform: shown ? 'rotate(90deg)' : undefined, transition: 'transform 120ms' }} />
        <span className="grow">
          <div className="t">{c.subject}</div>
          <div className="n2">
            <span className="mono">{c.short}</span> · {c.author} · {ago(c.time)} · {c.files.length} file{c.files.length === 1 ? '' : 's'}
          </div>
        </span>
      </div>
      {shown &&
        c.files.map((f) => (
          <div
            key={f.rel}
            className={`row${f.path && c.parents.length ? ' tap' : ''}`}
            style={{ paddingLeft: 40 }}
            onClick={() => c.parents.length && open(f, `${c.sha}^`, c.sha, `${c.short} ${c.subject}`)}
          >
            <span className={`cv-status cv-s-${f.status}`}>{f.status}</span>
            <span className="grow">
              <PathText rel={f.rel} />
            </span>
          </div>
        ))}
    </>
  );
}

/** A unified diff in one column: old and new line numbers, then the line; each hunk with its
 * own stage or unstage when that is possible. */
function DiffLines({ d, act, onHunk, busy }: { d: Diff; act?: 'stage' | 'unstage'; onHunk: (id: string) => void; busy: boolean }) {
  const rows: ReactElement[] = [];
  let o = 0;
  let n = 0;
  let inHunk = false;
  let h = -1;
  const notes: string[] = [];
  d.diff.split('\n').forEach((line, i) => {
    const m = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(.*)$/.exec(line);
    if (m) {
      inHunk = true;
      h += 1;
      o = Number(m[1]);
      n = Number(m[2]);
      const hunk = d.hunks[h];
      rows.push(
        <div className="cv-hunk" key={i}>
          <span className="grow">{m[3].trim() ? `⋯ ${m[3].trim()}` : '⋯'}</span>
          {act && hunk && (
            <button className="btn small" disabled={busy} onClick={() => onHunk(hunk.id)}>
              {act === 'stage' ? <Plus size={12} /> : <Minus size={12} />} {act === 'stage' ? 'Stage hunk' : 'Unstage hunk'}
            </button>
          )}
        </div>,
      );
    } else if (!inHunk) {
      if (/^(new file|deleted file|rename from|rename to|similarity|Binary files|old mode|new mode)/.test(line)) notes.push(line);
    } else if (line.startsWith('+')) rows.push(<Line key={i} cls="add" a="" b={String(n++)} text={line.slice(1)} />);
    else if (line.startsWith('-')) rows.push(<Line key={i} cls="del" a={String(o++)} b="" text={line.slice(1)} />);
    else if (line.startsWith(' ')) rows.push(<Line key={i} cls="" a={String(o++)} b={String(n++)} text={line.slice(1)} />);
    else if (line.startsWith('\\')) rows.push(<Line key={i} cls="meta" a="" b="" text={line.slice(2)} />);
    else if (line.startsWith('diff ')) inHunk = false;
  });
  return (
    <div className="cv-diff">
      {notes.length > 0 && <div className="cv-notes">{notes.map((t, i) => <div key={i}>{t}</div>)}</div>}
      {rows}
    </div>
  );
}

function Line({ cls, a, b, text }: { cls: string; a: string; b: string; text: string }) {
  return (
    <div className={`cv-line ${cls}`}>
      <span className="cv-no">{a}</span>
      <span className="cv-no">{b}</span>
      <span className="cv-text">{text}</span>
    </div>
  );
}

function FileDiff({ wt, wtName, path, old, from, to, what, back }: { wt?: Worktree; wtName: string; path: string; old?: string; from: string; to: string; what: string; back: () => void }) {
  const api = rootOf(wt);
  const qc = useQueryClient();
  const { data: info } = useInfo();
  const live = to === 'WORK' || to === 'INDEX';
  const act: 'stage' | 'unstage' | undefined = !info?.review ? undefined : from === 'INDEX' && to === 'WORK' ? 'stage' : from === 'HEAD' && to === 'INDEX' ? 'unstage' : undefined;
  const key = ['git-diff', api, path, old, from, to];
  const diff = useQuery({
    queryKey: key,
    queryFn: () => getJson<Diff>(`/api/git/diff?path=${q(path)}&from=${q(from)}&to=${q(to)}${old ? `&old=${q(old)}` : ''}`, api),
    refetchInterval: live ? 4000 : false,
    staleTime: live ? 0 : Infinity,
  });
  const [toast, show] = useToast();
  const write = useMutation({
    mutationFn: (body: object) => postJson<unknown>(`/api/git/${act}`, body, api),
    onError: (e) => show((e as Error).message, 'bad'),
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: key });
      void qc.invalidateQueries({ queryKey: ['git-status', api] });
    },
  });
  const name = path.slice(path.lastIndexOf('/') + 1);
  const d = diff.data;
  return (
    <Shell title={name} wide>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="page-head">
          <div className="crumbs">
            <button className="btn small" onClick={back}>
              <ArrowLeft size={13} /> {wtName || 'Changes'}
            </button>
            <span>{what}</span>
          </div>
          <h1 className="title" style={{ fontSize: 20, wordBreak: 'break-all' }}>{name}</h1>
          <div className="head-row">
            <span className="sub" style={{ wordBreak: 'break-all' }}>{path}</span>
            {live && (
              <Link to={`files/${path}`} className="btn small">
                <FileText size={13} /> Open file
              </Link>
            )}
            {act && (
              <button className="btn small" disabled={write.isPending} onClick={() => write.mutate({ path, old })}>
                {act === 'stage' ? <Plus size={13} /> : <Minus size={13} />} {act === 'stage' ? 'Stage file' : 'Unstage file'}
              </button>
            )}
          </div>
        </div>
        {diff.error && !d ? (
          <Failed error={diff.error} retry={diff.refetch} />
        ) : !d ? (
          <div className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[70, 90, 55, 80, 65, 85].map((w, i) => (
              <Sk key={i} w={`${w}%`} h={12} />
            ))}
          </div>
        ) : d.binary ? (
          <div className="card"><Empty>A binary file: no lines to show.</Empty></div>
        ) : !d.diff.trim() ? (
          <div className="card"><Empty>No differences.</Empty></div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <DiffLines d={d} act={act} busy={write.isPending} onHunk={(hunk) => write.mutate({ path, old, hunk })} />
          </div>
        )}
        {d?.truncated && <div className="muted" style={{ marginTop: 10 }}>The diff is cut off: it is over 4 MB.</div>}
      </div>
      {toast}
    </Shell>
  );
}
