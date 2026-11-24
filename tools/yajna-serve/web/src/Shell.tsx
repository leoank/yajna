// The frame of every screen: a sidebar with the notebook, its scope (a project, or all of
// them, ADR-0043) or worktree, and its sections; a top bar and a drawer on a phone, a thin
// loading bar and one quiet line while the server cannot be reached.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { BookOpen, Boxes, Check, ChevronsUpDown, FileText, FlaskConical, FolderTree, GitBranch, GitPullRequestArrow, House, ListChecks, Menu, ScrollText, Layers, Search } from 'lucide-react';
import { ApiError, netState, useInfo, useOverview, useProjects, useWorktrees, type ProjectScope, type Worktree } from './api';
import { at, base, notebookBase, scope, shownWorktree } from './base';
import { Link, useRoute, type Route } from './router';
import { SearchBox } from './search';
import { typeLabel } from './ui';

function useOnline() {
  const [on, setOn] = useState(netState.get());
  useEffect(() => netState.subscribe(setOn), []);
  return on;
}

/** The thin bar at the top, shown only when a request takes long enough to notice. */
function Loading() {
  const busy = useIsFetching() > 0;
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!busy) return setShown(false);
    const t = setTimeout(() => setShown(true), 300);
    return () => clearTimeout(t);
  }, [busy]);
  return shown ? <div className="progress-bar" /> : null;
}

export const dirty = (w: Worktree) => (w.changed ?? 0) + (w.staged ?? 0) + (w.untracked ?? 0) + (w.conflicted ?? 0);

/** The same screen at another address: a worktree's or a project's, `url` relative to the
 * notebook ('' for the served checkout). A changes view's worktree is not carried over. */
function sameScreen(url: string) {
  const path = location.pathname.slice(base.length);
  const rel = path.startsWith('/changes') ? '/changes' : path + location.search;
  return `${notebookBase}/${url.replace(/\/$/, '')}${rel || '/'}`.replace(/^\/\//, '/');
}

/** Where a worktree's app is, the same screen within it. */
function worktreeUrl(w: Worktree) {
  return sameScreen(w.current ? '' : w.url);
}

/** Close a menu on a click outside it. */
function useOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const f = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close();
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('mousedown', f);
    document.addEventListener('keydown', k);
    return () => {
      document.removeEventListener('mousedown', f);
      document.removeEventListener('keydown', k);
    };
  }, [open]);
  return ref;
}

function wtNote(w: Worktree & { ahead?: number }) {
  const bits = [];
  if (w.ahead) bits.push(`${w.ahead} ahead`);
  if (dirty(w)) bits.push(`${dirty(w)} uncommitted`);
  return bits.join(' · ');
}

/** The scope switcher of a lab (ADR-0043): *All projects*, or one project shown from its
 * own worktree, each project's other worktrees under it, and the worktrees of no project.
 * The worktree shown is the line under the choice. */
function ScopeSwitch({ projects, others }: { projects: ProjectScope[]; others: (Worktree & { ahead?: number })[] }) {
  const { data: wts } = useWorktrees();
  const [open, setOpen] = useState(false);
  const ref = useOutside(open, () => setOpen(false));
  const mine = scope ? projects.find((p) => p.slug === scope!.slug) : undefined;
  const current = wts?.find((w) => w.current);
  // the worktree on screen: the one named in the address, the project's home, or the
  // served checkout
  const shown = scope
    ? mine?.worktrees.find((w) => (scope!.worktree ? w.name === scope!.worktree : w.home)) ?? current
    : shownWorktree
      ? wts?.find((w) => w.name === shownWorktree)
      : current;
  const label = mine ? mine.title : shownWorktree && !scope ? shownWorktree : 'All projects';
  return (
    <div className="wt-switch" ref={ref}>
      <button className="wt-button scope" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="menu" title="What this shows: one project, or all of them">
        {mine ? <BookOpen size={15} /> : shownWorktree ? <GitBranch size={15} /> : <Boxes size={15} />}
        <span className="label">
          <span className="scope-name">{label}</span>
          {shown && (
            <span className="scope-wt">
              <GitBranch size={11} /> {shown.name}
              {dirty(shown) > 0 && ` · ${dirty(shown)} uncommitted`}
            </span>
          )}
        </span>
        <ChevronsUpDown size={14} className="muted" />
      </button>
      {open && (
        <div className="menu scope-menu" role="menu">
          <a className="menu-item" href={sameScreen('')} role="menuitem">
            <span className="tick">{!scope && !shownWorktree && <Check size={14} />}</span>
            <span className="label">
              All projects
              {current && <span className="sub">{current.name}</span>}
            </span>
          </a>
          <div className="menu-head">Projects</div>
          {projects.map((p) => {
            const home = p.worktrees.find((w) => w.home);
            const rest = p.worktrees.filter((w) => !w.home);
            const here = mine?.id === p.id;
            return (
              <div key={p.id}>
                <a className="menu-item" href={sameScreen(p.url)} role="menuitem">
                  <span className="tick">{here && !scope?.worktree && <Check size={14} />}</span>
                  <span className="label">
                    {p.title}
                    <span className="sub">{home ? [home.name, wtNote(home)].filter(Boolean).join(' · ') : 'no worktree of its own'}</span>
                  </span>
                </a>
                {rest.map((w) => (
                  <a key={w.name} className="menu-item nested" href={sameScreen(w.url)} role="menuitem">
                    <span className="tick">{here && scope?.worktree === w.name && <Check size={14} />}</span>
                    <GitBranch size={12} className="muted" />
                    <span className="label">
                      {w.name}
                      {wtNote(w) && <span className="sub">{wtNote(w)}</span>}
                    </span>
                  </a>
                ))}
              </div>
            );
          })}
          {others.length > 0 && (
            <>
              <div className="menu-head">Other worktrees</div>
              {others.map((w) => (
                <a key={w.name} className="menu-item" href={worktreeUrl(w)} role="menuitem">
                  <span className="tick">{!scope && shownWorktree === w.name && <Check size={14} />}</span>
                  <span className="label">
                    {w.name}
                    {wtNote(w) && <span className="sub">{wtNote(w)}</span>}
                  </span>
                </a>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function WorktreeSwitch() {
  const { data: list } = useWorktrees();
  const [open, setOpen] = useState(false);
  const ref = useOutside(open, () => setOpen(false));
  if (!list || list.length < 2) return null;
  const here = shownWorktree ? list.find((w) => w.name === shownWorktree) : list.find((w) => w.current);
  return (
    <div className="wt-switch" ref={ref}>
      <button className="wt-button" onClick={() => setOpen(!open)} aria-expanded={open} title="The worktree shown">
        <GitBranch size={14} />
        <span className="label">{here?.name ?? 'worktree'}</span>
        <ChevronsUpDown size={14} className="muted" />
      </button>
      {open && (
        <div className="menu" role="menu">
          {list.map((w) => (
            <a key={w.name} className="menu-item" href={worktreeUrl(w)} role="menuitem" style={{ color: 'inherit', textDecoration: 'none' }}>
              <span style={{ width: 14 }}>{w === here && <Check size={14} />}</span>
              <span className="label">{w.name}</span>
              {dirty(w) > 0 && <span className="meta">{dirty(w)}</span>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function NavItem({ to, icon, label, count, hot, on, close }: { to: string; icon: ReactNode; label: string; count?: number | string; hot?: boolean; on: boolean; close: () => void }) {
  return (
    <Link to={to} className={`nav-item${on ? ' on' : ''}`} onNavigate={close}>
      {icon}
      <span className="label">{label}</span>
      {count !== undefined && count !== 0 && <span className={`count${hot ? ' hot' : ''}`}>{count}</span>}
    </Link>
  );
}

const ICONS: Record<string, ReactNode> = {
  experiment: <FlaskConical size={16} />,
  run: <Layers size={16} />,
  protocol: <ListChecks size={16} />,
  review: <GitPullRequestArrow size={16} />,
};

export function Shell({ title, wide, children }: { title: string; wide?: boolean; children: ReactNode }) {
  const route = useRoute();
  const { data: info } = useInfo();
  const { data: ov, error: ovError } = useOverview();
  // a directory served alone (saarthi's node, `dir_router`) has files and changes only
  const notebook = !(ovError instanceof ApiError && ovError.status === 404);
  const { data: wts } = useWorktrees();
  const { data: pj } = useProjects();
  const scoped = !!ov?.scope;
  const online = useOnline();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const mine = scope ? pj?.projects.find((p) => p.slug === scope!.slug) : undefined;
  const here = scope
    ? mine?.worktrees.find((w) => (scope!.worktree ? w.name === scope!.worktree : w.home)) ?? wts?.find((w) => w.current)
    : wts?.find((w) => (shownWorktree ? w.name === shownWorktree : w.current));
  const is = (r: Route['name'], extra?: (r: Route) => boolean) => route.name === r && (!extra || extra(route));
  useEffect(() => {
    const sc = ov?.scope ? ov.scope.slug ?? ov.scope.title : null;
    document.title = [title, sc !== title && sc !== null ? sc : null, info?.notebook ?? 'notebook'].filter(Boolean).join(' · ');
  }, [title, info?.notebook, ov?.scope]);
  const name = ov?.namespace ?? info?.notebook ?? '';
  return (
    <div className={`shell${open ? ' open' : ''}`}>
      <Loading />
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">{(name || 'y').slice(0, 1).toUpperCase()}</div>
          <div style={{ minWidth: 0 }}>
            <div className="brand-name">{name || ' '}</div>
            <div className="brand-sub">{ov ? `${ov.shape} notebook` : ' '}</div>
          </div>
        </div>
        {pj && pj.projects.length > 0 ? <ScopeSwitch projects={pj.projects} others={pj.others} /> : <WorktreeSwitch />}
        {notebook && <SearchBox onGo={close} />}
        <div style={{ height: 8 }} />
        {notebook && <NavItem to="" icon={<House size={16} />} label={scoped ? 'Home' : 'Overview'} on={is('home')} close={close} />}
        {notebook && <NavItem to="log" icon={<ScrollText size={16} />} label="Log" on={is('log')} close={close} />}
        {notebook && <NavItem to="tasks" icon={<ListChecks size={16} />} label="Tasks" count={ov?.tasks_open} on={is('tasks')} close={close} />}
        <NavItem to="changes" icon={<GitBranch size={16} />} label="Changes" count={here ? dirty(here) : undefined} hot on={is('changes')} close={close} />
        <NavItem to="files" icon={<FolderTree size={16} />} label="Files" on={is('files')} close={close} />
        {notebook && <NavItem to="reviews" icon={<GitPullRequestArrow size={16} />} label="Reviews" on={is('reviews') || is('review')} close={close} />}
        {ov && !scoped && ov.projects.length > 0 && (
          <>
            <div className="nav-head">Projects</div>
            {ov.projects.map((p) => {
              // a lab's project opens as its scope, from its own worktree (ADR-0043)
              const sc = pj?.projects.find((x) => x.id === p.id);
              return sc ? (
                <a key={p.id} href={at(sc.url)} className="nav-item">
                  <BookOpen size={16} />
                  <span className="label">{p.title}</span>
                  {p.needs > 0 && <span className="count hot" title="Waiting for you">{p.needs}</span>}
                </a>
              ) : (
                <NavItem
                  key={p.id}
                  to={`p/${p.id}`}
                  icon={<BookOpen size={16} />}
                  label={p.title}
                  on={is('page', (r) => r.name === 'page' && r.id === p.id)}
                  close={close}
                />
              );
            })}
          </>
        )}
        {ov && (
          <>
            <div className="nav-head">Pages</div>
            {ov.collections
              .filter((c) => c.type !== 'project' && !c.lab_wide)
              .map((c) => (
                <NavItem
                  key={c.type}
                  to={`c/${c.type}`}
                  icon={ICONS[c.type] ?? <FileText size={16} />}
                  label={c.label}
                  count={c.count}
                  on={is('collection', (r) => r.name === 'collection' && r.type === c.type)}
                  close={close}
                />
              ))}
          </>
        )}
        {ov && scoped && ov.collections.some((c) => c.lab_wide) && (
          <>
            <div className="nav-head">Lab-wide</div>
            {ov.collections
              .filter((c) => c.lab_wide)
              .map((c) => (
                <NavItem
                  key={c.type}
                  to={`c/${c.type}`}
                  icon={ICONS[c.type] ?? <FileText size={16} />}
                  label={c.label}
                  count={c.count}
                  on={is('collection', (r) => r.name === 'collection' && r.type === c.type)}
                  close={close}
                />
              ))}
          </>
        )}
        <div style={{ flex: 1 }} />
        <div className="brand-sub" style={{ padding: '14px 8px 0' }}>{info ? `yajna ${info.version}` : ''}</div>
      </aside>
      <div className="scrim" onClick={close} />
      <div className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Open the menu">
            <Menu size={20} />
          </button>
          <div className="title">
            {ov?.scope && title !== ov.scope.title && <span className="scope-chip">{ov.scope.slug ?? ov.scope.title}</span>}
            {title}
          </div>
          {notebook && route.name !== 'search' && (
            <Link to="search" className="icon-btn" aria-label="Search">
              <Search size={19} />
            </Link>
          )}
        </header>
        <main className={`content${wide ? ' wide' : ''}`}>{children}</main>
      </div>
      {!online && (
        <div className="netline" role="status">
          <span className="dot" /> Reconnecting…
        </div>
      )}
    </div>
  );
}

export { typeLabel };
