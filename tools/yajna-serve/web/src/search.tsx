// Search across the notebook (ADR-0041): a box in the sidebar that answers as it is typed
// with the best few pages, and a screen with every page and log line that has the words.

import { useEffect, useRef, useState, type KeyboardEvent as KeyEvent } from 'react';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';
import { prefetchPage, useSearch, type SearchResult } from './api';
import { base } from './base';
import { navigate, useRoute } from './router';
import { Shell } from './Shell';
import { Empty, Failed, Log, Marked, PageLink, SkRows, Status } from './ui';

/** `value`, once it has stopped changing for `ms`. */
function useSettled<T>(value: T, ms = 150): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return settled;
}

const searchUrl = (text: string) => `search${text.trim() ? `?q=${encodeURIComponent(text.trim())}` : ''}`;

/** The sidebar's box. `/` or ⌘K focuses it; the arrows pick a page and Enter opens it, or
 * the whole list when none is picked. */
export function SearchBox({ onGo }: { onGo: () => void }) {
  const route = useRoute();
  const [text, setText] = useState(route.name === 'search' ? route.q : '');
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const settled = useSettled(text);
  const { data, isFetching } = useSearch(open ? settled : '', 6);
  const pages = settled.trim().length >= 2 ? data?.pages ?? [] : [];
  useEffect(() => setPick(-1), [settled]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"]');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey)) {
        e.preventDefault();
        // on a phone the sidebar is a closed drawer: the screen has its own box
        if (input.current && input.current.offsetParent !== null && getComputedStyle(input.current).visibility !== 'hidden' && !window.matchMedia('(max-width: 860px)').matches) {
          input.current.focus();
          input.current.select();
        } else navigate(searchUrl(''));
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, []);
  const go = (to: string) => {
    setOpen(false);
    input.current?.blur();
    navigate(to);
    onGo();
  };
  const keys = (e: KeyEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setPick(Math.min(pick + 1, pages.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setPick(Math.max(pick - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (pick >= 0 && pick < pages.length) go(`p/${pages[pick].id}`);
      else if (text.trim()) go(searchUrl(text));
    } else if (e.key === 'Escape') {
      setOpen(false);
      input.current?.blur();
    }
  };
  return (
    <div className="search-box" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}>
      <SearchIcon size={14} className="icon" />
      <input
        ref={input}
        value={text}
        placeholder="Search"
        aria-label="Search the notebook"
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={keys}
      />
      {!text && <kbd>/</kbd>}
      {open && settled.trim().length >= 2 && data && (
        <div className="menu search-menu" role="listbox">
          {pages.map((p, i) => (
            <a
              key={p.id}
              className={`menu-item hit-item${i === pick ? ' on' : ''}`}
              href={`${base}/p/${p.id}`}
              role="option"
              aria-selected={i === pick}
              onMouseEnter={() => prefetchPage(p.id)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                go(`p/${p.id}`);
              }}
            >
              <span className="id">{p.id}</span>
              <span className="label">
                <Marked text={p.title} query={settled} />
              </span>
            </a>
          ))}
          {pages.length === 0 && !isFetching && <div className="menu-item muted">No page has “{settled.trim()}”</div>}
          <a
            className={`menu-item all${pick === pages.length ? ' on' : ''}`}
            href={`${base}/${searchUrl(settled)}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              go(searchUrl(text));
            }}
          >
            <span className="label">Everything with “{settled.trim()}”</span>
            <span className="meta">{data.pages_total + data.log_total}</span>
            <ArrowRight size={13} />
          </a>
        </div>
      )}
    </div>
  );
}

/** The screen: every page with the words, best first, with the passage that has them; then
 * the log lines. The address follows what is typed, so a search can be shared and the back
 * button returns to it. */
export function SearchScreen({ q }: { q: string }) {
  const [text, setText] = useState(q);
  const settled = useSettled(text, 200);
  useEffect(() => {
    if (settled.trim() !== q.trim()) navigate(searchUrl(settled), true);
  }, [settled, q]);
  const { data, error, isFetching, refetch } = useSearch(settled);
  const ready = settled.trim().length >= 2;
  return (
    <Shell title={q ? `Search: ${q}` : 'Search'}>
      <div className="page-head">
        <h1 className="title">Search</h1>
      </div>
      <div className="search-box big">
        <SearchIcon size={16} className="icon" />
        <input autoFocus value={text} placeholder="Words in a page's ID, title, tags or text, or in the log" aria-label="Search the notebook" onChange={(e) => setText(e.target.value)} />
      </div>
      {!ready ? (
        <Empty>Type at least two characters. Every word has to be in a page for it to show.</Empty>
      ) : error && !data ? (
        <Failed error={error} retry={refetch} />
      ) : !data ? (
        <SkRows />
      ) : (
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 120ms' }}>
          <Results r={data} query={settled} />
        </div>
      )}
    </Shell>
  );
}

function Results({ r, query }: { r: SearchResult; query: string }) {
  if (r.pages_total === 0 && r.log_total === 0) return <Empty>Nothing in the notebook has “{query.trim()}”.</Empty>;
  return (
    <>
      <h2 className="section">
        Pages <span className="n">{r.pages_total > r.pages.length ? `${r.pages.length} of ${r.pages_total}` : r.pages_total}</span>
      </h2>
      {r.pages.length ? (
        <div className="card rows">
          {r.pages.map((p) => (
            <PageLink key={p.id} id={p.id} className="row hit">
              <span className="grow">
                <div className="t">
                  <span className="id">{p.id}</span> <Marked text={p.title} query={query} />
                </div>
                {p.snippet && (
                  <div className="snip">
                    <Marked text={p.snippet} query={query} />
                  </div>
                )}
              </span>
              <Status s={p.status} outcome={p.outcome} draft={p.draft} />
            </PageLink>
          ))}
        </div>
      ) : (
        <Empty>No page has all of these words.</Empty>
      )}
      {r.log_total > 0 && (
        <>
          <h2 className="section">
            Log <span className="n">{r.log_total > r.log.length ? `newest ${r.log.length} of ${r.log_total}` : r.log_total}</span>
          </h2>
          <div className="card pad">
            <Log lines={r.log} mark={query} />
          </div>
        </>
      )}
    </>
  );
}
