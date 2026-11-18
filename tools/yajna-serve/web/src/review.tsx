// A review in the app (docs/review.md 7.2, ADR-0041): its overview with the summary, the
// verdict and every thread; its changed files, what changed since the last round, each fix
// on its own and the work not in it yet; a file as a one-column diff with its threads at
// their lines. Where this viewer writes (the socket, or --review), it replies, resolves,
// reopens, comments on picked lines or the whole review, and approves or asks for changes;
// every write carries the page's version, so a page that changed meanwhile is read again.

import { useMemo, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, ChevronRight, CornerDownRight, MessageSquare, RotateCcw } from 'lucide-react';
import { ApiError, getJson, postJson, useInfo } from './api';
import { hunks, whole, type DHunk } from './linediff';
import { Link, navigate } from './router';
import { Shell } from './Shell';
import { Empty, Failed, Html, PageLink, Sk, SkPage, Status } from './ui';

interface Anchor {
  raw: string;
  path?: string;
  from?: number;
  to?: number;
  heading?: string;
  commit?: string;
}
interface Reply {
  when: string;
  author: string;
  action: 'addressed' | 'resolved' | 'reopened' | null;
  commit: string | null;
  text: string;
}
interface Thread {
  n: number;
  state: 'open' | 'addressed' | 'resolved' | 'outdated';
  anchor: Anchor;
  quote: string[];
  replies: Reply[];
}
interface ChangedFile {
  status: string;
  path: string;
  old?: string;
}
interface Fix {
  commit: string;
  parent: string;
  subject: string;
  threads: number[];
  files: ChangedFile[];
}
interface Review {
  id: string;
  title: string;
  status: string;
  kind: string;
  ref: string;
  base: string;
  head: string;
  about: string[];
  author: string;
  summary: string;
  files: ChangedFile[];
  rounds: string[];
  since: { from: string; files: ChangedFile[] } | null;
  fixes: Fix[];
  unreviewed: ChangedFile[];
  threads: Thread[];
  problems: string[];
  version: string;
}

const q = encodeURIComponent;
const key = (id: string) => ['review', id];
const short = (s: string) => s.slice(0, 7);
const tones: Record<string, string> = { open: 'run', addressed: 'warn', resolved: 'ok', outdated: '' };

/** Which file is shown, and between which commits: the review's base and head, a round's or
 * a fix's two commits, or the head and the working tree (`work`). */
interface Shown {
  path: string;
  old?: string;
  work?: boolean;
  from?: string;
  to?: string;
}

function useReview(id: string) {
  return useQuery({ queryKey: key(id), queryFn: () => getJson<Review>(`/api/reviews/${q(id)}`), refetchInterval: 4000 });
}

/** A write to the review with its version; a page changed meanwhile is read again and the
 * write is refused, never lost silently. */
function useWrite(id: string, onDone?: () => void) {
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const m = useMutation({
    mutationFn: async ({ action, body }: { action: string; body: Record<string, unknown> }) => {
      const r = qc.getQueryData<Review>(key(id));
      return postJson<Review>(`/api/reviews/${q(id)}/${action}`, { version: r?.version, ...body });
    },
    onSuccess: (r) => {
      setError(null);
      qc.setQueryData(key(id), r);
      onDone?.();
    },
    onError: (e) => {
      setError(e instanceof ApiError && e.status === 409 ? 'The review changed while you wrote; it has been read again. Send it again.' : (e as Error).message);
      void qc.invalidateQueries({ queryKey: key(id) });
    },
  });
  return { ...m, error };
}

function Writer({ id, action, body, placeholder, label, extra, rows = 2, onDone }: { id: string; action: string; body: Record<string, unknown>; placeholder: string; label: string; extra?: ReactNode; rows?: number; onDone?: () => void }) {
  const [text, setText] = useState('');
  const w = useWrite(id, () => {
    setText('');
    onDone?.();
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
      <textarea
        className="input"
        rows={rows}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && text.trim()) w.mutate({ action, body: { ...body, text } });
        }}
      />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
        {w.error && <span style={{ color: 'var(--bad)', fontSize: 12.5, flex: 1 }}>{w.error}</span>}
        {extra}
        <button className="btn primary" disabled={!text.trim() || w.isPending} onClick={() => w.mutate({ action, body: { ...body, text } })}>
          {label}
        </button>
      </div>
    </div>
  );
}

function ThreadCard({ r, t, canWrite, human, onOpen }: { r: Review; t: Thread; canWrite: boolean; human: boolean; onOpen?: () => void }) {
  const [replying, setReplying] = useState(false);
  const w = useWrite(r.id);
  return (
    <div className={`card thread th-${t.state}`}>
      <div className="thread-head">
        <span className="thread-n">T{t.n}</span>
        <span className={`chip ${tones[t.state]}`}>{t.state}</span>
        {t.anchor.path ? (
          <button className="linkish" onClick={onOpen} disabled={!onOpen}>
            {t.anchor.raw}
          </button>
        ) : (
          <span className="muted">on the whole review</span>
        )}
      </div>
      {t.quote.length > 0 && <pre className="thread-quote">{t.quote.join('\n')}</pre>}
      <div className="replies">
        {t.replies.map((rep, i) => (
          <div key={i} className="reply">
            <div className="reply-who">
              <b>{rep.author}</b>
              {rep.action && <span className={`chip ${rep.action === 'resolved' ? 'ok' : rep.action === 'addressed' ? 'warn' : 'run'}`}>{rep.action}{rep.commit ? ` in ${short(rep.commit)}` : ''}</span>}
              <span className="muted">{rep.when}</span>
            </div>
            {rep.text && <div className="reply-text">{rep.text}</div>}
          </div>
        ))}
      </div>
      {canWrite && (
        <div className="thread-actions">
          {!replying && (
            <button className="btn small" onClick={() => setReplying(true)}>
              <CornerDownRight size={13} /> Reply
            </button>
          )}
          {human && t.state !== 'resolved' && (
            <button className="btn small" disabled={w.isPending} onClick={() => w.mutate({ action: 'resolve', body: { thread: `T${t.n}` } })}>
              <Check size={13} /> Resolve
            </button>
          )}
          {(t.state === 'resolved' || t.state === 'addressed') && (
            <button className="btn small" disabled={w.isPending} onClick={() => w.mutate({ action: 'reopen', body: { thread: `T${t.n}` } })}>
              <RotateCcw size={13} /> Reopen
            </button>
          )}
          {w.error && <span style={{ color: 'var(--bad)', fontSize: 12.5 }}>{w.error}</span>}
        </div>
      )}
      {canWrite && replying && <Writer id={r.id} action="reply" body={{ thread: `T${t.n}` }} placeholder="Your reply… (⌘/Ctrl-Enter sends)" label="Reply" onDone={() => setReplying(false)} extra={<button className="btn" onClick={() => setReplying(false)}>Cancel</button>} />}
    </div>
  );
}

export function ReviewView({ id, search }: { id: string; search: URLSearchParams }) {
  const { data: r, error, refetch } = useReview(id);
  const { data: info } = useInfo();
  const canWrite = !!info?.review;
  const tab = search.get('tab') ?? 'overview';
  const shown: Shown | null = search.get('file')
    ? { path: search.get('file')!, old: search.get('old') ?? undefined, work: search.get('work') === '1', from: search.get('from') ?? undefined, to: search.get('to') ?? undefined }
    : null;
  const go = (p: Record<string, string | undefined>) => {
    const s = new URLSearchParams();
    for (const [k, v] of Object.entries(p)) if (v) s.set(k, v);
    navigate(`reviews/${q(id)}${s.size ? `?${s}` : ''}`);
  };
  const openFile = (s: Shown) => go({ tab: 'files', file: s.path, old: s.old, work: s.work ? '1' : undefined, from: s.from, to: s.to });
  const summary = useQuery({ queryKey: ['page', id], queryFn: () => getJson<{ html: string }>(`/api/pages/${q(id)}`), retry: false });
  const summaryHtml = useMemo(() => {
    const h = summary.data?.html;
    if (!h) return null;
    const start = h.search(/<h2[^>]*>Summary<\/h2>/);
    const end = h.search(/<h2[^>]*>Threads<\/h2>/);
    return start >= 0 ? h.slice(h.indexOf('</h2>', start) + 5, end > start ? end : undefined) : null;
  }, [summary.data]);

  if (error && !r) return <Shell title={id}><Failed error={error} retry={refetch} /></Shell>;
  if (!r) return <Shell title={id}><SkPage /></Shell>;
  const human = !r.author.startsWith('agent:');
  const open = r.threads.filter((t) => t.state === 'open' || t.state === 'addressed');
  const threadOpen = (t: Thread) => {
    if (!t.anchor.path) return undefined;
    if (t.anchor.commit === 'work') return () => openFile({ path: t.anchor.path!, work: true });
    if (t.anchor.commit && !r.head.startsWith(t.anchor.commit)) {
      const fx = r.fixes.find((f) => f.commit.startsWith(t.anchor.commit!));
      if (fx) return () => openFile({ path: t.anchor.path!, from: fx.parent, to: fx.commit });
    }
    return () => openFile({ path: t.anchor.path! });
  };
  return (
    <Shell title={r.title || id} wide={!!shown}>
      <div style={shown ? { maxWidth: 1100, margin: '0 auto' } : undefined}>
        <div className="page-head">
          <div className="crumbs">
            <Link to="reviews">Reviews</Link> <span>/</span> <span className="id">{r.id}</span>
          </div>
          <h1 className="title">{r.title || r.id}</h1>
          <div className="head-row">
            <Status s={r.status} />
            <span className="chip">{r.kind} {r.ref}</span>
            <span className="muted mono" style={{ fontSize: 12 }}>{short(r.base)}..{short(r.head)}</span>
            {r.about.map((a) => <PageLink key={a} id={a} className="chip" />)}
          </div>
        </div>
        <div className="segs" style={{ marginBottom: 18 }}>
          <button className={tab === 'overview' && !shown ? 'on' : ''} onClick={() => go({})}>Overview</button>
          <button className={tab === 'threads' ? 'on' : ''} onClick={() => go({ tab: 'threads' })}>Threads {open.length > 0 && <span className="chip run" style={{ height: 18, marginLeft: 4 }}>{open.length}</span>}</button>
          <button className={tab === 'files' ? 'on' : ''} onClick={() => go({ tab: 'files' })}>Files {r.files.length + r.unreviewed.length}</button>
        </div>
        {shown ? (
          <ReviewFile r={r} shown={shown} canWrite={canWrite} human={human} back={() => go({ tab: 'files' })} />
        ) : tab === 'files' ? (
          <FileLists r={r} openFile={openFile} />
        ) : tab === 'threads' ? (
          r.threads.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[...r.threads].sort((a, b) => Number(a.state === 'resolved') - Number(b.state === 'resolved') || a.n - b.n).map((t) => (
                <ThreadCard key={t.n} r={r} t={t} canWrite={canWrite} human={human} onOpen={threadOpen(t)} />
              ))}
            </div>
          ) : (
            <div className="card"><Empty>No threads yet.</Empty></div>
          )
        ) : (
          <>
            {r.problems.length > 0 && (
              <div className="error" style={{ marginBottom: 14, flexDirection: 'column', alignItems: 'flex-start' }}>
                {r.problems.map((p, i) => <div key={i}>{p}</div>)}
              </div>
            )}
            <div className="card pad">
              {summaryHtml?.trim() ? <Html html={summaryHtml} /> : summary.isLoading ? <Sk h={13} /> : r.summary.trim() ? <div className="prose" style={{ whiteSpace: 'pre-wrap' }}>{r.summary}</div> : <span className="muted">No summary yet.</span>}
            </div>
            {canWrite && human && (r.status === 'open' || r.status === 'changes_requested') && (
              <Verdict r={r} />
            )}
            <h2 className="section">Threads <span className="n">{open.length} open of {r.threads.length}</span></h2>
            {open.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {open.map((t) => <ThreadCard key={t.n} r={r} t={t} canWrite={canWrite} human={human} onOpen={threadOpen(t)} />)}
              </div>
            ) : (
              <div className="card"><Empty>No open threads.</Empty></div>
            )}
            {canWrite && (
              <div className="card pad" style={{ marginTop: 14 }}>
                <div className="muted" style={{ fontSize: 13 }}><MessageSquare size={13} style={{ verticalAlign: -2 }} /> A comment on the whole review</div>
                <Writer id={r.id} action="comment" body={{}} placeholder="What should change… (⌘/Ctrl-Enter sends)" label="Comment" />
              </div>
            )}
          </>
        )}
      </div>
    </Shell>
  );
}

function Verdict({ r }: { r: Review }) {
  const w = useWrite(r.id);
  const [asking, setAsking] = useState(false);
  return (
    <div className="card pad" style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, flex: 1 }}>Your verdict</span>
        <button className="btn" onClick={() => setAsking(!asking)}>Request changes</button>
        <button className="btn primary" disabled={w.isPending} onClick={() => w.mutate({ action: 'approve', body: {} })}>
          <Check size={14} /> Approve
        </button>
      </div>
      {w.error && <div style={{ color: 'var(--bad)', fontSize: 12.5, marginTop: 8 }}>{w.error}</div>}
      {asking && <Writer id={r.id} action="request-changes" body={{}} placeholder="What has to change first" label="Request changes" onDone={() => setAsking(false)} />}
    </div>
  );
}

function FileLists({ r, openFile }: { r: Review; openFile: (s: Shown) => void }) {
  const count = (path: string, sha: string) => r.threads.filter((t) => t.anchor.path === path && !!t.anchor.commit && sha.startsWith(t.anchor.commit) && t.state !== 'resolved').length;
  const list = (title: string, sub: string, files: ChangedFile[], shown: (f: ChangedFile) => Shown, sha: string) =>
    files.length > 0 && (
      <>
        <h2 className="section">{title} <span className="n">{files.length}</span></h2>
        {sub && <div className="sub" style={{ margin: '-4px 0 8px' }}>{sub}</div>}
        <div className="card rows">
          {files.map((f) => {
            const n = count(f.path, sha);
            return (
              <div key={`${title}${f.path}`} className="row tap" onClick={() => openFile(shown(f))}>
                <span className={`cv-status cv-s-${f.status === '?' ? 'u' : f.status}`}>{f.status}</span>
                <span className="grow">
                  <span className="cv-path" title={f.path}>
                    {f.path.includes('/') && <span className="cv-dir">{f.path.slice(0, f.path.lastIndexOf('/') + 1)}</span>}
                    <span className="cv-name">{f.path.slice(f.path.lastIndexOf('/') + 1)}</span>
                  </span>
                  {f.old && <div className="n2">from {f.old}</div>}
                </span>
                {n > 0 && <span className="chip run"><MessageSquare size={11} /> {n}</span>}
                <ChevronRight size={16} className="muted" />
              </div>
            );
          })}
        </div>
      </>
    );
  return (
    <>
      {list('Changes', `${short(r.base)}..${short(r.head)}`, r.files, (f) => ({ path: f.path, old: f.old }), r.head)}
      {r.since && list(`Since round ${r.rounds.length}`, `What changed since the last review update, ${short(r.since.from)}..${short(r.head)}`, r.since.files, (f) => ({ path: f.path, old: f.old, from: r.since!.from, to: r.head }), r.head)}
      {r.fixes.map((fx) => <div key={fx.commit}>{list(`Fix ${short(fx.commit)}`, `${fx.subject}${fx.threads.length ? ` · addresses ${fx.threads.map((n) => `T${n}`).join(', ')}` : ''}`, fx.files, (f) => ({ path: f.path, old: f.old, from: fx.parent, to: fx.commit }), fx.commit)}</div>)}
      {list('Not in the review yet', 'Committed after its head, or not committed; comments here are anchored @ work when not committed', r.unreviewed, (f) => ({ path: f.path, work: true }), 'work')}
      {!r.files.length && !r.unreviewed.length && <div className="card"><Empty>No changed files.</Empty></div>}
    </>
  );
}

function ReviewFile({ r, shown, canWrite, human, back }: { r: Review; shown: Shown; canWrite: boolean; human: boolean; back: () => void }) {
  const sha = shown.work ? 'work' : shown.to ?? r.head;
  const sides = useQuery({
    queryKey: ['review-file', r.id, shown.path, shown.old, shown.work, shown.from, shown.to],
    queryFn: () =>
      getJson<{ base: string | null; head: string | null }>(
        `/api/reviews/${q(r.id)}/file?path=${q(shown.path)}${shown.old ? `&old=${q(shown.old)}` : ''}${shown.work ? '&work=true' : ''}${shown.from && shown.to ? `&from=${q(shown.from)}&to=${q(shown.to)}` : ''}`,
      ),
    refetchInterval: shown.work ? 4000 : false,
  });
  // threads drawn here: on this file at this commit (or on disk, for work)
  const here = r.threads.filter((t) => t.anchor.path === shown.path && t.anchor.to && (sha === 'work' ? t.anchor.commit === 'work' : !!t.anchor.commit && sha.startsWith(t.anchor.commit)) && t.state !== 'outdated');
  const [full, setFull] = useState(false);
  const hs: DHunk[] = useMemo(() => {
    if (!sides.data) return [];
    const h = full ? hunks(sides.data.base, sides.data.head, 1e9) : hunks(sides.data.base, sides.data.head);
    return h.length ? h : here.length ? whole(sides.data.head) : [];
  }, [sides.data, full, here.length]);
  const [sel, setSel] = useState<[number, number] | null>(null);
  const pick = (n: number) => setSel((s) => (!s || s[0] !== s[1] ? [n, n] : [Math.min(s[0], n), Math.max(s[0], n)]));
  const commitFor = shown.work ? 'work' : shown.to && !r.head.startsWith(shown.to) ? shown.to : undefined;
  const at = sel && (sel[0] === sel[1] ? `${shown.path}:${sel[0]}` : `${shown.path}:${sel[0]}-${sel[1]}`);
  const name = shown.path.slice(shown.path.lastIndexOf('/') + 1);
  const what = shown.work ? 'not in the review yet' : shown.from ? `${short(shown.from)}..${short(shown.to!)}` : `${short(r.base)}..${short(r.head)}`;
  return (
    <>
      <div className="head-row" style={{ marginBottom: 12 }}>
        <button className="btn small" onClick={back}><ArrowLeft size={13} /> Files</button>
        <b style={{ wordBreak: 'break-all' }}>{name}</b>
        <span className="muted" style={{ fontSize: 12.5, wordBreak: 'break-all' }}>{shown.path} · {what}</span>
        <span style={{ flex: 1 }} />
        <button className="btn small" onClick={() => setFull(!full)}>{full ? 'Changes only' : 'Whole file'}</button>
      </div>
      {sides.error && !sides.data ? (
        <Failed error={sides.error} retry={sides.refetch} />
      ) : !sides.data ? (
        <div className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[70, 90, 55, 80].map((w, i) => <Sk key={i} w={`${w}%`} h={12} />)}</div>
      ) : !hs.length ? (
        <div className="card"><Empty>No differences.</Empty></div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="cv-diff">
            {hs.map((h, i) => (
              <div key={i}>
                <div className="cv-hunk"><span className="grow">{h.lines[0].b ? `⋯ line ${h.lines[0].b}` : '⋯'}</span></div>
                {h.lines.map((l, j) => {
                  const picked = !!sel && !!l.b && l.op !== '-' && l.b >= sel[0] && l.b <= sel[1];
                  const pickable = canWrite && l.op !== '-' && !!l.b;
                  const after = l.op !== '-' && l.b ? here.filter((t) => t.anchor.to === l.b) : [];
                  return (
                    <div key={j}>
                      <div className={`cv-line ${l.op === '+' ? 'add' : l.op === '-' ? 'del' : ''}${picked ? ' picked' : ''}${pickable ? ' pickable' : ''}`} onClick={pickable ? () => pick(l.b!) : undefined}>
                        <span className="cv-no">{l.a ?? ''}</span>
                        <span className="cv-no">{l.op === '-' ? '' : l.b ?? ''}</span>
                        <span className="cv-text">{l.text}</span>
                      </div>
                      {after.map((t) => (
                        <div key={t.n} className="inline-thread">
                          <ThreadCard r={r} t={t} canWrite={canWrite} human={human} />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      {canWrite && !sel && hs.length > 0 && <div className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>Tap a line, then another, to comment on them.</div>}
      {canWrite && sel && at && (
        <div className="card pad comment-box">
          <div style={{ fontWeight: 600 }}>Comment on {sel[0] === sel[1] ? `line ${sel[0]}` : `lines ${sel[0]}–${sel[1]}`} <span className="muted" style={{ fontWeight: 400, fontSize: 12.5 }}>{shown.work ? 'not committed yet' : `at ${short(commitFor ?? r.head)}`}</span></div>
          <Writer id={r.id} action="comment" body={{ at, commit: commitFor }} placeholder="What should change, and why" label="Comment" rows={3} onDone={() => setSel(null)} extra={<button className="btn" onClick={() => setSel(null)}>Cancel</button>} />
        </div>
      )}
    </>
  );
}
