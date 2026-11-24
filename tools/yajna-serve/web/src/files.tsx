// Files (ADR-0028): the notebook's roots as a breadcrumb and a list, a directory a page at a
// time, and a file shown by what it is: markdown rendered, an image, text in a code view
// loaded only when one is opened. The workbench of tabs and splits is the classic viewer's.

import { lazy, Suspense, useEffect } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLive } from './live';
import { ArrowRight, ChevronRight, Download, File, FileCode2, Film, Folder, ImageIcon, Info } from 'lucide-react';
import { getJson, useOverview, useProjects } from './api';
import { at, base, scope } from './base';
import { Link, navigate } from './router';
import { Shell } from './Shell';
import { Empty, Failed, Folders, Html, Sk, SkRows } from './ui';

const Code = lazy(() => import('./code'));

interface Root {
  name: string;
  path: string;
  exists: boolean;
}
interface Entry {
  name: string;
  kind: string;
  size?: number;
  mtime?: number;
}
interface Listing {
  path: string;
  total: number;
  entries: Entry[];
  next?: number;
}
interface Stat {
  path: string;
  kind: string;
  size?: number;
  mtime?: number;
  mime: string;
  text: boolean;
}

const q = encodeURIComponent;

function size(n?: number) {
  if (n === undefined) return '';
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i++;
  }
  return i ? `${v.toFixed(v < 10 ? 1 : 0)} ${u[i]}` : `${n} B`;
}

function Crumbs({ path }: { path: string }) {
  const parts = path ? path.split('/') : [];
  return (
    <div className="crumbs">
      <Link to="files">Files</Link>
      {parts.map((p, i) => (
        <span key={i} style={{ display: 'contents' }}>
          <ChevronRight size={13} />
          {i < parts.length - 1 ? <Link to={`files/${parts.slice(0, i + 1).join('/')}`}>{p}</Link> : <span>{p}</span>}
        </span>
      ))}
    </div>
  );
}

export function Files({ path }: { path: string }) {
  // links made for the classic viewer, `files/#root/path`
  useEffect(() => {
    if (!path && location.hash.length > 1) navigate(`files/${decodeURIComponent(location.hash.slice(1)).replace(/:L\d+(-\d+)?$/, '')}`, true);
  }, [path]);
  const title = path ? path.slice(path.lastIndexOf('/') + 1) : 'Files';
  return (
    <Shell title={title}>
      <div className="page-head">
        <Crumbs path={path} />
        <h1 className="title" style={{ wordBreak: 'break-all' }}>{title}</h1>
      </div>
      <ElsewhereNote path={path} />
      {path ? <Entry path={path} /> : <Roots />}
    </Shell>
  );
}

/** Under *All projects*, a path in a project's folder that the project's own worktree has
 * newer or uncommitted work in: say so, with a link to the same path there (ADR-0043). */
function ElsewhereNote({ path }: { path: string }) {
  const { data: pj } = useProjects();
  if (scope || !path) return null;
  const p = pj?.projects.find((x) => x.folders.some((f) => path === f.path || path.startsWith(`${f.path}/`)));
  const home = p?.worktrees.find((w) => w.home && !w.current);
  if (!p || !home) return null;
  const n = (home.changed ?? 0) + (home.staged ?? 0) + (home.untracked ?? 0);
  return (
    <div className="banner">
      <Info size={15} />
      <span style={{ flex: 1, minWidth: 0 }}>
        {p.title} is worked on in <b>{home.name}</b>
        {home.ahead ? `, ${home.ahead} commits ahead of this copy` : ''}
        {n ? `${home.ahead ? ' and' : ','} ${n} files uncommitted` : ''}.
      </span>
      <a className="btn small" href={at(p.url, `files/${path}`)}>
        Open it there <ArrowRight size={13} />
      </a>
    </div>
  );
}

/** Where Files opens (ADR-0043): in a project's scope its folders, under *All projects*
 * each project's folders in its own scope; then the roots. */
function Roots() {
  const { data: ov } = useOverview();
  const { data: pj } = useProjects();
  const sc = ov?.scope;
  const others = !sc ? (pj?.projects ?? []).filter((p) => p.folders.length) : [];
  return (
    <>
      {sc && sc.folders.length > 0 && (
        <>
          <h2 className="section" style={{ marginTop: 0 }}>{sc.title}</h2>
          <Folders folders={sc.folders} />
        </>
      )}
      {others.length > 0 && (
        <>
          <h2 className="section" style={{ marginTop: 0 }}>Projects</h2>
          <div className="card rows">
            {others.map((p) => (
              <div key={p.id} className="row" style={{ flexWrap: 'wrap', rowGap: 6 }}>
                <span className="grow" style={{ minWidth: 160 }}>
                  <div className="t">{p.title}</div>
                  <div className="n2">{p.home ?? 'no worktree of its own'}</div>
                </span>
                <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {p.folders.map((f) => (
                    <a key={f.path} className="chip" href={at(p.url, `files/${f.path}`)} title={f.path}>
                      <Folder size={12} style={{ marginRight: 4 }} /> {f.label}
                    </a>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      {(sc?.folders.length || others.length) ? <h2 className="section">Roots</h2> : null}
      <RootList />
    </>
  );
}

function RootList() {
  const { data, error, refetch } = useQuery({ queryKey: ['roots'], queryFn: () => getJson<Root[]>('/api/files/roots'), staleTime: Infinity });
  if (error && !data) return <Failed error={error} retry={refetch} />;
  if (!data) return <SkRows n={3} />;
  return (
    <div className="card rows">
      {data.map((r) => (
        <Link key={r.name} to={`files/${r.name}`} className="row" style={r.exists ? undefined : { opacity: 0.5, pointerEvents: 'none' }}>
          <Folder size={16} className="muted" />
          <span className="grow">
            <div className="t">{r.name}</div>
            <div className="n2">{r.exists ? r.path : `${r.path} (not on this machine)`}</div>
          </span>
          <ChevronRight size={16} className="muted" />
        </Link>
      ))}
    </div>
  );
}

function Entry({ path }: { path: string }) {
  const { data: st, error, refetch } = useQuery({ queryKey: ['stat', path], queryFn: () => getJson<Stat>(`/api/files/stat?path=${q(path)}`) });
  if (error && !st) return <Failed error={error} retry={refetch} />;
  if (!st || st.path.replace(/\/$/, '') !== path.replace(/\/$/, '')) return <SkRows n={6} />;
  if (st.kind === 'dir') return <Dir path={path} />;
  return <FileView st={st} />;
}

function Dir({ path }: { path: string }) {
  const qc = useQueryClient();
  useLive([path], (c) => c.kind === 'dir' && void qc.invalidateQueries({ queryKey: ['list', path] }));
  const list = useInfiniteQuery({
    queryKey: ['list', path],
    queryFn: ({ pageParam }) => getJson<Listing>(`/api/files/list?path=${q(path)}&cursor=${pageParam}`),
    initialPageParam: 0,
    getNextPageParam: (l) => l.next,
  });
  if (list.error && !list.data) return <Failed error={list.error} retry={list.refetch} />;
  if (!list.data) return <SkRows n={8} />;
  const entries = list.data.pages.flatMap((p) => p.entries);
  if (!entries.length) return <div className="card"><Empty>An empty directory.</Empty></div>;
  return (
    <>
      <div className="card rows">
        {entries.map((e) => (
          <Link key={e.name} to={`files/${path}/${e.name}`} className="row">
            {e.kind === 'dir' ? <Folder size={16} style={{ color: 'var(--accent)' }} /> : /\.(png|jpe?g|gif|svg|webp)$/i.test(e.name) ? <ImageIcon size={16} className="muted" /> : /\.(mp4|m4v|webm|mov|ogv)$/i.test(e.name) ? <Film size={16} className="muted" /> : /\.(md|txt)$/i.test(e.name) ? <File size={16} className="muted" /> : <FileCode2 size={16} className="muted" />}
            <span className="grow t">{e.name}</span>
            <span className="muted" style={{ fontSize: 12.5 }}>{e.kind === 'dir' ? '' : size(e.size)}</span>
          </Link>
        ))}
      </div>
      {list.hasNextPage && (
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <button className="btn" onClick={() => list.fetchNextPage()} disabled={list.isFetchingNextPage}>
            More ({list.data.pages[0].total - entries.length} left)
          </button>
        </div>
      )}
    </>
  );
}

/** Text larger than this opens at its end: the last TAIL bytes, followed as it grows. */
const TEXT_CAP = 4 << 20;
const TAIL = 1 << 20;

const LOGS = /\.(log|out|err|jsonl)$/i;

function FileView({ st }: { st: Stat }) {
  const qc = useQueryClient();
  // the file as it changes on disk: its stat read again, a rendered page rendered again
  const live = useLive([st.path], (c) => {
    if (c.kind !== 'file') return;
    void qc.invalidateQueries({ queryKey: ['stat', st.path] });
    void qc.invalidateQueries({ queryKey: ['render', st.path] });
  });
  const raw = `${base}/api/files/raw?path=${q(st.path)}`;
  const md = /\.(md|markdown)$/i.test(st.path);
  const img = st.mime.startsWith('image/');
  const video = st.mime.startsWith('video/');
  const meta = (
    <div className="head-row" style={{ marginBottom: 14 }}>
      <span className="chip">{st.mime}</span>
      <span className="muted" style={{ fontSize: 12.5 }}>{size(st.size)}</span>
      {live === 'live' && <span className="chip ok" title="Changes on disk show here as they happen"><span className="dot" /> live</span>}
      {live === 'connecting' && <span className="chip warn">reconnecting…</span>}
      <a className="btn small" href={raw} download>
        <Download size={13} /> Raw
      </a>
    </div>
  );
  if (md) {
    return (
      <>
        {meta}
        <Rendered path={st.path} />
      </>
    );
  }
  if (img) {
    return (
      <>
        {meta}
        <div className="card pad" style={{ display: 'grid', placeItems: 'center' }}>
          <img src={`${raw}&v=${st.mtime ?? 0}`} alt={st.path} style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </>
    );
  }
  if (video) {
    return (
      <>
        {meta}
        <div className="card pad" style={{ display: 'grid', placeItems: 'center' }}>
          <video key={st.mtime ?? 0} src={`${raw}&v=${st.mtime ?? 0}`} controls playsInline preload="metadata" style={{ maxWidth: '100%', maxHeight: '75vh', background: '#000' }} />
        </div>
      </>
    );
  }
  if (st.text) {
    const big = (st.size ?? 0) > TEXT_CAP;
    return (
      <>
        {meta}
        {big && <div className="muted" style={{ fontSize: 12.5, margin: '-6px 0 10px' }}>The last {size(TAIL)} of {size(st.size)}, followed as it grows; Raw has the whole file.</div>}
        <div className="card" style={{ overflow: 'hidden' }}>
          <Suspense fallback={<div className="pad" style={{ padding: 16 }}><Sk h={12} /></div>}>
            <Code url={raw} path={st.path} size={st.size ?? 0} mtime={st.mtime ?? 0} follow={big || LOGS.test(st.path)} start={big ? (st.size ?? 0) - TAIL : 0} />
          </Suspense>
        </div>
      </>
    );
  }
  return (
    <>
      {meta}
      <div className="card"><Empty>{st.text ? 'Too large to show here; download it.' : 'A binary file; download it.'}</Empty></div>
    </>
  );
}

function Rendered({ path }: { path: string }) {
  const { data, error, refetch } = useQuery({ queryKey: ['render', path], queryFn: () => getJson<{ html: string }>(`/api/files/render?path=${q(path)}`) });
  if (error && !data) return <Failed error={error} retry={refetch} />;
  if (!data) return <div className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[90, 75, 85, 60].map((w, i) => <Sk key={i} w={`${w}%`} h={13} />)}</div>;
  return (
    <div className="card pad">
      <Html html={data.html} dir={path.replace(/\/?[^/]*$/, '')} />
    </div>
  );
}
