// Pieces every screen uses: status chips, skeletons, error and empty states, rendered HTML
// whose links stay in the app, and the log's timeline.

import { useEffect, useRef, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { ApiError, prefetchPage, type LogLine, type Summary } from './api';
import { Link, navigate, routeOfHref } from './router';

/** What a status means, as a colour: done or supported, running, waiting, failed. */
export function tone(s: string | null | undefined): '' | 'ok' | 'run' | 'warn' | 'bad' {
  switch ((s ?? '').toLowerCase()) {
    case 'done':
    case 'complete':
    case 'completed':
    case 'supported':
    case 'approved':
    case 'merged':
    case 'success':
      return 'ok';
    case 'active':
    case 'running':
    case 'in_progress':
    case 'open':
      return 'run';
    case 'planned':
    case 'pending':
    case 'changes_requested':
    case 'inconclusive':
    case 'paused':
      return 'warn';
    case 'failed':
    case 'aborted':
    case 'refuted':
    case 'abandoned':
    case 'closed':
      return 'bad';
    default:
      return '';
  }
}

export function Status({ s, outcome }: { s?: string | null; outcome?: string | null }) {
  if (!s && !outcome) return null;
  return (
    <>
      {s && (
        <span className={`chip ${tone(s)}`}>
          <span className="dot" />
          {s.replace(/_/g, ' ')}
        </span>
      )}
      {outcome && <span className={`chip ${tone(outcome)}`}>{outcome}</span>}
    </>
  );
}

export const typeLabel = (t: string) => t.replace(/_/g, ' ');

/** A link to a page that reads it on hover, so it opens at once. */
export function PageLink({ id, children, className }: { id: string; children?: ReactNode; className?: string }) {
  return (
    <Link to={`p/${id}`} className={className} onMouseEnter={() => prefetchPage(id)} onFocus={() => prefetchPage(id)}>
      {children ?? id}
    </Link>
  );
}

export function Sk({ w = '100%', h = 14, r }: { w?: number | string; h?: number; r?: number }) {
  return <div className="sk" style={{ width: w, height: h, borderRadius: r }} />;
}

/** The shape of a list while it loads. */
export function SkRows({ n = 6 }: { n?: number }) {
  return (
    <div className="card">
      {Array.from({ length: n }, (_, i) => (
        <div className="row" key={i}>
          <Sk w={84} h={12} />
          <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Sk w={`${55 + ((i * 17) % 35)}%`} h={13} />
          </div>
          <Sk w={58} h={18} r={9} />
        </div>
      ))}
    </div>
  );
}

export function SkPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Sk w={180} h={12} />
      <Sk w="62%" h={28} />
      <div style={{ display: 'flex', gap: 8 }}>
        <Sk w={70} h={22} r={11} />
        <Sk w={90} h={22} r={11} />
      </div>
      <div style={{ height: 12 }} />
      {[92, 88, 95, 70, 84, 60].map((w, i) => (
        <Sk key={i} w={`${w}%`} h={13} />
      ))}
    </div>
  );
}

/** One sentence and the control that does something about it. */
export function Failed({ error, retry }: { error: unknown; retry?: () => void }) {
  const gone = error instanceof ApiError && error.status === 404;
  return (
    <div className="error">
      <div style={{ flex: 1 }}>{gone ? 'There is nothing here.' : error instanceof ApiError && error.status === 0 ? 'Couldn’t reach the notebook.' : `Couldn’t load this: ${(error as Error).message}`}</div>
      {retry && !gone && (
        <button className="btn small" onClick={retry}>
          <RefreshCw size={13} /> Try again
        </button>
      )}
    </div>
  );
}

/** HTML the server rendered (yajna's own markdown renderer, raw HTML shown as text); its
 * links to pages and files open in the app. */
export function Html({ html, className = 'prose' }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const click = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      if (!a || e.metaKey || e.ctrlKey || e.button !== 0) return;
      const to = routeOfHref(a.getAttribute('href') ?? '');
      if (to) {
        e.preventDefault();
        navigate(to);
      }
    };
    const hover = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      const to = a && routeOfHref(a.getAttribute('href') ?? '');
      if (to?.startsWith('p/')) prefetchPage(to.slice(2));
    };
    el.addEventListener('click', click);
    el.addEventListener('mouseover', hover);
    return () => {
      el.removeEventListener('click', click);
      el.removeEventListener('mouseover', hover);
    };
  }, []);
  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Log lines grouped by day, newest first as given. */
export function Log({ lines }: { lines: LogLine[] }) {
  const days: [string, LogLine[]][] = [];
  for (const l of lines) {
    const last = days[days.length - 1];
    if (last && last[0] === l.date) last[1].push(l);
    else days.push([l.date, [l]]);
  }
  return (
    <div className="log">
      {days.map(([day, ls]) => (
        <div key={day}>
          <div className="log-day">{day}</div>
          {ls.map((l, i) => (
            <div className="log-line" key={i}>
              <div className="time">{l.time}</div>
              <div>
                <Html html={l.html} className="what" />
                <div className="who">{l.author}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** A row of a list of pages: its ID, title and line, its status. */
export function PageRow({ p }: { p: Summary }) {
  return (
    <PageLink id={p.id} className="row">
      <span className="id">{p.id}</span>
      <span className="grow">
        <div className="t">{p.title}</div>
        {p.note && <div className="n2">{p.note}</div>}
      </span>
      <Status s={p.status} outcome={p.outcome} />
    </PageLink>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}
