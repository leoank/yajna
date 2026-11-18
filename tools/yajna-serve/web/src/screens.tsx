// The notebook's screens: the overview, a page of any type, a type's list, the log, the
// tasks and the reviews. Each draws what it has at once and skeletons for what it has not.

import { useState, type ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, FileCode2 } from 'lucide-react';
import { fetchers, keys, useList, useOverview, usePage, type Page } from './api';
import { base } from './base';
import { Link } from './router';
import { Shell } from './Shell';
import { Empty, Failed, Html, Log, PageLink, PageRow, Sk, SkPage, SkRows, Status, typeLabel } from './ui';

export function Overview() {
  const { data, error, refetch } = useOverview();
  return (
    <Shell title="Overview">
      <div className="page-head">
        <h1 className="title">{data ? data.namespace ?? 'Notebook' : <Sk w={220} h={28} />}</h1>
        <div className="sub">{data ? `${data.projects.length} projects · ${data.tasks_open} open tasks` : <Sk w={180} h={13} />}</div>
      </div>
      {error && !data && <Failed error={error} retry={refetch} />}
      <h2 className="section">Projects</h2>
      <div className="grid">
        {data
          ? data.projects.map((p) => {
              const ph = p.phases;
              return (
                <PageLink key={p.id} id={p.id} className="card pcard">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span className="id">{p.id}</span>
                    <Status s={p.status} />
                  </div>
                  <div className="pt">{p.title}</div>
                  <div className="stats">
                    <span>{p.experiments} experiments</span>
                    <span>{p.runs} runs</span>
                    {ph.total > 0 && (
                      <span>
                        {ph.done}/{ph.total} phases
                      </span>
                    )}
                  </div>
                  {ph.total > 0 && (
                    <div className="meter" title={`${ph.done} of ${ph.total} phases done`}>
                      <div style={{ width: `${(100 * ph.done) / ph.total}%` }} />
                    </div>
                  )}
                  {ph.active && <div className="sub">Now: {ph.active.title}</div>}
                </PageLink>
              );
            })
          : Array.from({ length: 3 }, (_, i) => (
              <div className="card pcard" key={i}>
                <Sk w={80} h={12} />
                <Sk w="85%" h={16} />
                <Sk w="60%" h={12} />
              </div>
            ))}
      </div>
      <h2 className="section">Recently</h2>
      <div className="card pad">{data ? data.recent.length ? <Log lines={data.recent} /> : <Empty>Nothing logged yet.</Empty> : <SkRows n={4} />}</div>
    </Shell>
  );
}

function Fields({ p }: { p: Page }) {
  const value = (f: Page['fields'][number]) => {
    if (f.file)
      return (
        <Link to={`files/${f.file}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <FileCode2 size={13} /> {f.value}
        </Link>
      );
    if (!f.ids.length) return f.value;
    // the IDs in it as links, the rest as text
    const parts: (string | ReactElement)[] = [];
    let rest = f.value;
    for (const id of f.ids) {
      const at = rest.indexOf(id);
      if (at < 0) continue;
      parts.push(rest.slice(0, at), <PageLink key={id + parts.length} id={id} />);
      rest = rest.slice(at + id.length);
    }
    parts.push(rest);
    return parts;
  };
  const shown = p.fields.filter((f) => !['status', 'outcome', 'project', 'experiment'].includes(f.key));
  if (!shown.length) return null;
  return (
    <details className="card pad" style={{ marginBottom: 22 }} open={p.type !== 'project'}>
      <summary className="muted" style={{ cursor: 'pointer', fontSize: 13 }}>Details</summary>
      <dl className="fields" style={{ marginTop: 12 }}>
        {shown.map((f) => (
          <div key={f.key} style={{ display: 'contents' }}>
            <dt>{f.key.replace(/_/g, ' ')}</dt>
            <dd>{value(f)}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

function Runs({ p }: { p: Page }) {
  const r = p.runs;
  if (!r || !r.rows.length) return null;
  return (
    <>
      <h2 className="section">
        Runs <span className="n">{r.rows.length}</span>
      </h2>
      <div className="card table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Run</th>
              <th>Status</th>
              <th>In short</th>
              {r.columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {r.rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <PageLink id={row.id} className="id" />
                </td>
                <td>
                  <Status s={row.status} />
                </td>
                <td>{row.note ?? <span className="muted">{row.finished ?? ''}</span>}</td>
                {r.columns.map((c) => (
                  <td key={c} className="num">
                    {row.metrics[c] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function PageView({ id }: { id: string }) {
  const { data: p, error, refetch, isPlaceholderData } = usePage(id);
  // the previous page stays while this one is read; it is dimmed, not mistaken for this one
  const shown = p && p.id === id ? p : undefined;
  const [tab, setTab] = useState<'page' | 'tree'>('page');
  return (
    <Shell title={shown?.title ?? id}>
      {error && !shown ? (
        <Failed error={error} retry={refetch} />
      ) : !shown ? (
        <SkPage />
      ) : (
        <div style={{ opacity: isPlaceholderData ? 0.6 : 1, transition: 'opacity 150ms' }}>
          <div className="page-head">
            <div className="crumbs">
              {shown.project && shown.project !== shown.id && (
                <>
                  <PageLink id={shown.project} /> <span>/</span>
                </>
              )}
              {shown.experiment && (
                <>
                  <PageLink id={shown.experiment} /> <span>/</span>
                </>
              )}
              <span className="type">{typeLabel(shown.type)}</span>
              <span className="id">{shown.id}</span>
            </div>
            <h1 className="title">{shown.title}</h1>
            <div className="head-row">
              <Status s={shown.status} outcome={shown.outcome} />
              {shown.kind && <span className="chip">{shown.kind}</span>}
              {shown.items && shown.items.total > 0 && (
                <span className="chip">
                  {shown.items.done}/{shown.items.total} done
                </span>
              )}
              {shown.tags.map((t) => (
                <span key={t} className="chip">
                  #{t}
                </span>
              ))}
              <span className="muted" style={{ fontSize: 12.5 }}>
                {[shown.created, shown.author].filter(Boolean).join(' · ')}
              </span>
            </div>
          </div>
          {shown.tree && (
            <div className="segs" style={{ marginBottom: 16 }}>
              <button className={tab === 'page' ? 'on' : ''} onClick={() => setTab('page')}>
                Page
              </button>
              <button className={tab === 'tree' ? 'on' : ''} onClick={() => setTab('tree')}>
                Experiment tree
              </button>
            </div>
          )}
          {tab === 'tree' && shown.tree ? (
            <div className="card tree">
              <Html html={shown.tree} className="" />
            </div>
          ) : (
            <>
              <Fields p={shown} />
              {shown.phases && shown.phases.length > 0 && (
                <>
                  <h2 className="section" style={{ marginTop: 0 }}>
                    Phases <span className="n">{shown.phases.length}</span>
                  </h2>
                  <div className="card rows" style={{ marginBottom: 22 }}>
                    {shown.phases.map((ph) => (
                      <PageLink key={ph.id} id={ph.id} className="row">
                        <span className="grow">
                          <div className="t">{ph.title}</div>
                          {ph.items.total > 0 && (
                            <div className="meter" style={{ marginTop: 6, maxWidth: 260 }}>
                              <div style={{ width: `${(100 * ph.items.done) / ph.items.total}%` }} />
                            </div>
                          )}
                        </span>
                        {ph.items.total > 0 && (
                          <span className="muted" style={{ fontSize: 12.5 }}>
                            {ph.items.done}/{ph.items.total}
                          </span>
                        )}
                        <Status s={ph.status} />
                      </PageLink>
                    ))}
                  </div>
                </>
              )}
              <div className="card pad">
                <Html html={shown.html} />
              </div>
              {shown.experiments && shown.experiments.length > 0 && (
                <>
                  <h2 className="section">
                    Experiments <span className="n">{shown.experiments.length}</span>
                  </h2>
                  <div className="card rows">
                    {shown.experiments.map((e) => (
                      <PageRow key={e.id} p={e} />
                    ))}
                  </div>
                </>
              )}
              <Runs p={shown} />
              {shown.backlinks.length > 0 && (
                <>
                  <h2 className="section">
                    Linked from <span className="n">{shown.backlinks.length}</span>
                  </h2>
                  <div className="card rows">
                    {shown.backlinks.map((b) => (
                      <PageRow key={b.id} p={b} />
                    ))}
                  </div>
                </>
              )}
              {shown.log.length > 0 && (
                <>
                  <h2 className="section">Log</h2>
                  <div className="card pad">
                    <Log lines={shown.log} />
                  </div>
                </>
              )}
              <div className="muted" style={{ fontSize: 12.5, marginTop: 18 }}>
                <Link to={`files/${shown.path.startsWith('notes/') ? shown.path : shown.path}`} style={{ display: 'none' }} />
                {shown.path}
              </div>
            </>
          )}
        </div>
      )}
    </Shell>
  );
}

const LABELS: Record<string, string> = {
  experiment: 'Experiments', run: 'Runs', protocol: 'Protocols', material: 'Materials', equipment: 'Equipment', build: 'Builds',
  analysis: 'Analyses', artifact: 'Artifacts', doc: 'Docs', review: 'Reviews', agent_session: 'Agent sessions', phase: 'Phases', project: 'Projects',
};

export function Collection({ type }: { type: string }) {
  const { data, error, refetch } = useList(type);
  const [filter, setFilter] = useState('');
  const shown = (data ?? []).filter((p) => !filter || `${p.id} ${p.title} ${p.note ?? ''}`.toLowerCase().includes(filter.toLowerCase()));
  const label = LABELS[type] ?? typeLabel(type);
  return (
    <Shell title={label}>
      <div className="page-head">
        <h1 className="title">{label}</h1>
        <div className="sub">{data ? `${data.length} pages` : <Sk w={80} h={13} />}</div>
      </div>
      <input className="input" placeholder="Filter by ID, title or note" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginBottom: 14 }} />
      {error && !data ? <Failed error={error} retry={refetch} /> : !data ? <SkRows /> : shown.length ? (
        <div className="card rows">
          {shown.map((p) => (
            <PageRow key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <Empty>Nothing matches.</Empty>
      )}
    </Shell>
  );
}

export function LogScreen() {
  const [pages, setPages] = useState(1);
  const queries = Array.from({ length: pages }, (_, i) => i * 100);
  return (
    <Shell title="Log">
      <div className="page-head">
        <h1 className="title">Log</h1>
      </div>
      <div className="card pad">
        {queries.map((skip) => (
          <LogPage key={skip} skip={skip} more={skip === queries[queries.length - 1] ? () => setPages(pages + 1) : undefined} />
        ))}
      </div>
    </Shell>
  );
}

function LogPage({ skip, more }: { skip: number; more?: () => void }) {
  const { data, error, refetch } = useQuery({ queryKey: keys.log(skip), queryFn: () => fetchers.log(skip) });
  if (error && !data) return <Failed error={error} retry={refetch} />;
  if (!data) return <SkRows n={5} />;
  return (
    <>
      <Log lines={data.entries} />
      {more && skip + 100 < data.total && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="btn" onClick={more}>
            Older
          </button>
        </div>
      )}
    </>
  );
}

export function Tasks() {
  const [done, setDone] = useState(false);
  const { data, error, refetch } = useQuery({ queryKey: keys.tasks(done), queryFn: () => fetchers.tasks(done) });
  const groups = new Map<string, NonNullable<typeof data>>();
  for (const t of data ?? []) {
    const k = t.page?.id ?? t.path;
    groups.set(k, [...(groups.get(k) ?? []), t]);
  }
  return (
    <Shell title="Tasks">
      <div className="page-head">
        <h1 className="title">Tasks</h1>
        <div className="segs" style={{ alignSelf: 'flex-start' }}>
          <button className={!done ? 'on' : ''} onClick={() => setDone(false)}>
            Open
          </button>
          <button className={done ? 'on' : ''} onClick={() => setDone(true)}>
            All
          </button>
        </div>
      </div>
      {error && !data ? <Failed error={error} retry={refetch} /> : !data ? <SkRows /> : !data.length ? <Empty>No open tasks.</Empty> : (
        [...groups.entries()].map(([k, ts]) => (
          <div key={k} style={{ marginBottom: 18 }}>
            <h2 className="section" style={{ margin: '0 0 8px', textTransform: 'none', letterSpacing: 0, fontSize: 13.5, color: 'var(--text-2)' }}>
              {ts[0].page ? <PageLink id={ts[0].page.id}>{ts[0].page.title}</PageLink> : k}
            </h2>
            <div className="card rows">
              {ts.map((t, i) => (
                <div className="row" key={i}>
                  <input type="checkbox" checked={t.done} readOnly style={{ accentColor: 'var(--accent)' }} />
                  <Html html={t.html} className="grow" />
                  {t.section && <span className="muted" style={{ fontSize: 12 }}>{t.section}</span>}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </Shell>
  );
}

export function Reviews() {
  const { data, error, refetch } = useQuery({ queryKey: keys.reviews, queryFn: fetchers.reviews });
  const order = (s: string) => (s === 'open' || s === 'changes_requested' ? 0 : 1);
  const all = [...(data ?? [])].sort((a, b) => order(a.status) - order(b.status) || b.id.localeCompare(a.id));
  return (
    <Shell title="Reviews">
      <div className="page-head">
        <h1 className="title">Reviews</h1>
        <div className="sub">Threads and diffs open in the review viewer.</div>
      </div>
      {error && !data ? <Failed error={error} retry={refetch} /> : !data ? <SkRows /> : !all.length ? <Empty>No reviews yet.</Empty> : (
        <div className="card rows">
          {all.map((r) => (
            <a key={r.id} className="row" href={`${base}/classic/#review:${encodeURIComponent(r.id)}`}>
              <span className="id">{r.id}</span>
              <span className="grow">
                <div className="t">{r.title || r.id}</div>
                <div className="n2">
                  {r.kind} {r.ref}
                  {r.elsewhere ? ` · in ${r.elsewhere}` : ''}
                </div>
              </span>
              {r.open > 0 && <span className="chip run">{r.open} open</span>}
              <Status s={r.status} />
              <ArrowUpRight size={14} className="muted" />
            </a>
          ))}
        </div>
      )}
    </Shell>
  );
}

export function Missing({ path }: { path: string }) {
  return (
    <Shell title="Not found">
      <Empty>
        Nothing at <code>{path}</code>. <Link to="">Back to the overview</Link>
      </Empty>
    </Shell>
  );
}
