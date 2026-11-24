// The notebook's screens: the overview, a page of any type, a type's list, the log, the
// tasks and the reviews. Each draws what it has at once and skeletons for what it has not.

import { useState, type ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ChevronRight, FileCode2, GitBranch, Info } from 'lucide-react';
import { fetchers, keys, useList, useOverview, usePage, useProjects, useWorktrees, type Overview as OverviewData, type Page, type ProjectScope } from './api';
import { at, scope } from './base';
import { Link } from './router';
import { dirty, Shell } from './Shell';
import { Empty, Failed, Folders, Html, Log, PageLink, PageRow, Sk, SkPage, SkRows, Status, typeLabel } from './ui';

export function Overview() {
  const { data, error, refetch } = useOverview();
  if (data?.scope) return <ProjectHome data={data} />;
  return <LabOverview data={data} error={error} refetch={refetch} />;
}

/** Where a project is worked on, how far ahead of the served checkout, and what is
 * uncommitted there. */
function Where({ p }: { p?: ProjectScope }) {
  const home = p?.worktrees.find((w) => w.home);
  if (!home) return null;
  const bits = [home.name];
  if (home.ahead) bits.push(`${home.ahead} ahead`);
  if (dirty(home)) bits.push(`${dirty(home)} uncommitted`);
  return (
    <span className="where" title="The worktree this project is worked on in">
      <GitBranch size={12} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bits.join(' · ')}</span>
    </span>
  );
}

function LabOverview({ data, error, refetch }: { data?: OverviewData; error: Error | null; refetch: () => void }) {
  const { data: pj } = useProjects();
  const scopes = new Map((pj?.projects ?? []).map((p) => [p.id, p]));
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
              const sc = scopes.get(p.id);
              const body = (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span className="id">{p.id}</span>
                    <span style={{ display: 'flex', gap: 6 }}>
                      {p.needs > 0 && (
                        <span className="chip need" title="Draft conclusions and pages waiting for review">
                          {p.needs} for you
                        </span>
                      )}
                      <Status s={p.status} />
                    </span>
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
                  <Where p={sc} />
                </>
              );
              // a lab's project opens as its scope (ADR-0043), else as its page
              return sc ? (
                <a key={p.id} href={at(sc.url)} className="card pcard">
                  {body}
                </a>
              ) : (
                <PageLink key={p.id} id={p.id} className="card pcard">
                  {body}
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

/** A project's home in its scope (ADR-0043): the project, what waits for a human, its
 * folders, what is uncommitted, its latest lines. */
function ProjectHome({ data }: { data: OverviewData }) {
  const sc = data.scope!;
  const card = data.projects[0];
  const { data: pj } = useProjects();
  const { data: wts } = useWorktrees();
  const mine = pj?.projects.find((p) => p.id === sc.id);
  const shown = mine?.worktrees.find((w) => (scope?.worktree ? w.name === scope.worktree : w.home)) ?? wts?.find((w) => w.current);
  const needs = data.needs ?? [];
  const ph = card?.phases;
  return (
    <Shell title={sc.title}>
      <div className="page-head">
        <div className="crumbs">
          <span className="type">project</span>
          <span className="id">{sc.id}</span>
        </div>
        <h1 className="title">{sc.title}</h1>
        <div className="head-row">
          {card && <Status s={card.status} />}
          <Where p={mine} />
          <PageLink id={sc.id} className="btn small">
            Project page <ArrowRight size={13} />
          </PageLink>
        </div>
      </div>
      {card && (
        <div className="card pad" style={{ marginBottom: 22 }}>
          <div className="stats" style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13 }}>
            <Link to="c/experiment">{card.experiments} experiments</Link>
            <Link to="c/run">{card.runs} runs</Link>
            <Link to="tasks">{data.tasks_open} open tasks</Link>
            {shown && (
              <Link to="changes">
                {dirty(shown)} uncommitted in {shown.name}
              </Link>
            )}
          </div>
          {ph && ph.total > 0 && (
            <div style={{ marginTop: 14 }}>
              <div className="meter" title={`${ph.done} of ${ph.total} phases done`}>
                <div style={{ width: `${(100 * ph.done) / ph.total}%` }} />
              </div>
              <div className="sub" style={{ marginTop: 8, fontSize: 13 }}>
                {ph.done}/{ph.total} phases{ph.active && <> · now <PageLink id={ph.active.id}>{ph.active.title}</PageLink></>}
              </div>
            </div>
          )}
        </div>
      )}
      <h2 className="section">
        Needs you {needs.length > 0 && <span className="n">{needs.length}</span>}
      </h2>
      {needs.length ? (
        <div className="card rows" style={{ marginBottom: 6 }}>
          {needs.map((n) => (
            <PageLink key={n.id} id={n.id} className="row">
              <span className="grow">
                <div className="id">{n.id}</div>
                <div className="t">{n.title}</div>
              </span>
              <span className="need-chips">
                <span className="chip need">{n.why}</span>
                <Status s={n.status} outcome={n.outcome} />
              </span>
            </PageLink>
          ))}
        </div>
      ) : (
        <div className="card pad muted" style={{ fontSize: 13 }}>
          Nothing waiting: no draft conclusions or pages under review.
        </div>
      )}
      {sc.folders.length > 0 && (
        <>
          <h2 className="section">Folders</h2>
          <Folders folders={sc.folders} />
        </>
      )}
      <h2 className="section">Recently</h2>
      <div className="card pad">{data.recent.length ? <Log lines={data.recent} /> : <Empty>Nothing logged about this project yet.</Empty>}</div>
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
  const { data: pj } = useProjects();
  // under the served checkout, a page of a project worked on in a worktree ahead of it is
  // an old copy (ADR-0043)
  const ahead = !scope && shown?.project ? pj?.projects.find((x) => x.id === shown.project) : undefined;
  const aheadHome = ahead?.worktrees.find((w) => w.home && !w.current && (w.ahead ?? 0) > 0);
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
              <Status s={shown.status} outcome={shown.outcome} draft={shown.draft} />
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
          {ahead && aheadHome && (
            <div className="banner">
              <Info size={15} />
              <span style={{ flex: 1, minWidth: 0 }}>
                {ahead.title} is worked on in <b>{aheadHome.name}</b>, {aheadHome.ahead} commits ahead of this copy.
              </span>
              <a className="btn small" href={at(ahead.url, `p/${shown.id}`)}>
                Open the current one <ArrowRight size={13} />
              </a>
            </div>
          )}
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
                <Html html={shown.html} dir={shown.dir ?? undefined} />
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
  const [everyone, setEveryone] = useState(false);
  const order = (s: string) => (s === 'open' || s === 'changes_requested' ? 0 : 1);
  // in a project's scope, the reviews of its branches (ADR-0043)
  const mine = (r: { ref: string }) => !scope || everyone || r.ref.startsWith(`${scope.slug}/`);
  const all = [...(data ?? [])].filter(mine).sort((a, b) => order(a.status) - order(b.status) || b.id.localeCompare(a.id));
  const hidden = (data?.length ?? 0) - all.length;
  return (
    <Shell title="Reviews">
      <div className="page-head">
        <h1 className="title">Reviews</h1>
        <div className="sub">
          {scope && !everyone ? `Reviews of ${scope.slug}’s branches, unfinished first.` : 'Reviews of every worktree, unfinished first.'}
          {scope && (hidden > 0 || everyone) && (
            <>
              {' '}
              <button className="linkish" style={{ font: "inherit" }} onClick={() => setEveryone(!everyone)}>
                {everyone ? `Only ${scope.slug}’s` : `Show all (${hidden} more)`}
              </button>
            </>
          )}
        </div>
      </div>
      {error && !data ? <Failed error={error} retry={refetch} /> : !data ? <SkRows /> : !all.length ? <Empty>No reviews yet.</Empty> : (
        <div className="card rows">
          {all.map((r) => (
            <Link key={r.id} className="row" to={`reviews/${encodeURIComponent(r.id)}`}>
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
              <ChevronRight size={14} className="muted" />
            </Link>
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
