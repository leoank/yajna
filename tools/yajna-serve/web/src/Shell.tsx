// The frame of every screen: a sidebar with the notebook, its worktrees and its sections,
// a top bar and a drawer on a phone, a thin loading bar and one quiet line while the
// server cannot be reached.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { BookOpen, Check, ChevronsUpDown, FileText, FlaskConical, FolderTree, GitBranch, GitPullRequestArrow, House, ListChecks, Menu, ScrollText, Layers } from 'lucide-react';
import { ApiError, netState, useInfo, useOverview, useWorktrees, type Worktree } from './api';
import { base, notebookBase, shownWorktree } from './base';
import { Link, useRoute, type Route } from './router';
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

const dirty = (w: Worktree) => (w.changed ?? 0) + (w.staged ?? 0) + (w.untracked ?? 0) + (w.conflicted ?? 0);

/** Where a worktree's app is, the same screen within it. */
function worktreeUrl(w: Worktree) {
  const rel = location.pathname.slice(base.length) + location.search;
  const root = w.current ? notebookBase : `${notebookBase}/${w.url.replace(/\/$/, '')}`;
  return `${root}${rel || '/'}`;
}

function WorktreeSwitch() {
  const { data: list } = useWorktrees();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
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
  const online = useOnline();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const here = wts?.find((w) => (shownWorktree ? w.name === shownWorktree : w.current));
  const is = (r: Route['name'], extra?: (r: Route) => boolean) => route.name === r && (!extra || extra(route));
  useEffect(() => {
    document.title = `${title} · ${info?.notebook ?? 'notebook'}`;
  }, [title, info?.notebook]);
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
        <WorktreeSwitch />
        <div style={{ height: 8 }} />
        {notebook && <NavItem to="" icon={<House size={16} />} label="Overview" on={is('home')} close={close} />}
        {notebook && <NavItem to="log" icon={<ScrollText size={16} />} label="Log" on={is('log')} close={close} />}
        {notebook && <NavItem to="tasks" icon={<ListChecks size={16} />} label="Tasks" count={ov?.tasks_open} on={is('tasks')} close={close} />}
        <NavItem to="changes" icon={<GitBranch size={16} />} label="Changes" count={here ? dirty(here) : undefined} hot on={is('changes')} close={close} />
        <NavItem to="files" icon={<FolderTree size={16} />} label="Files" on={is('files')} close={close} />
        {notebook && <NavItem to="reviews" icon={<GitPullRequestArrow size={16} />} label="Reviews" on={is('reviews') || is('review')} close={close} />}
        {ov && ov.projects.length > 0 && (
          <>
            <div className="nav-head">Projects</div>
            {ov.projects.map((p) => (
              <NavItem
                key={p.id}
                to={`p/${p.id}`}
                icon={<BookOpen size={16} />}
                label={p.title}
                on={is('page', (r) => r.name === 'page' && r.id === p.id)}
                close={close}
              />
            ))}
          </>
        )}
        {ov && (
          <>
            <div className="nav-head">Pages</div>
            {ov.collections
              .filter((c) => c.type !== 'project')
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
          <div className="title">{title}</div>
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
