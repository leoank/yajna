// A small router over the History API, relative to the app's base: the app has a handful
// of routes and must work under any prefix, which needs nothing bigger.

import { createContext, useContext, useEffect, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { base } from './base';

export type Route =
  | { name: 'home' }
  | { name: 'page'; id: string }
  | { name: 'collection'; type: string }
  | { name: 'log' }
  | { name: 'tasks' }
  | { name: 'reviews' }
  | { name: 'changes'; search: URLSearchParams }
  | { name: 'files'; path: string }
  | { name: 'missing'; path: string };

/** The route of a path relative to the base, `p/EXP-…`. */
export function parse(rel: string, search = ''): Route {
  const path = rel.replace(/^\/+/, '');
  const [head, ...rest] = path.split('/');
  const tail = rest.join('/');
  switch (head) {
    case '':
      return { name: 'home' };
    case 'p':
      return tail ? { name: 'page', id: decodeURIComponent(tail) } : { name: 'home' };
    case 'c':
      return { name: 'collection', type: decodeURIComponent(tail) };
    case 'log':
      return { name: 'log' };
    case 'tasks':
      return { name: 'tasks' };
    case 'reviews':
      return { name: 'reviews' };
    case 'changes':
      return { name: 'changes', search: new URLSearchParams(search) };
    case 'files':
      return { name: 'files', path: decodeURIComponent(tail) };
    default:
      return { name: 'missing', path };
  }
}

function current(): Route {
  const rel = location.pathname.startsWith(base) ? location.pathname.slice(base.length) : location.pathname;
  return parse(rel, location.search);
}

const Ctx = createContext<Route>({ name: 'home' });
const listeners = new Set<() => void>();

/** Go to `to`, a path relative to the base (`p/EXP-…`, `changes?wt=…`). */
export function navigate(to: string, replace = false) {
  const url = `${base}/${to.replace(/^\/+/, '')}`;
  if (replace) history.replaceState(null, '', url);
  else history.pushState(null, '', url);
  window.scrollTo?.(0, 0);
  listeners.forEach((l) => l());
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(current);
  useEffect(() => {
    const update = () => setRoute(current());
    listeners.add(update);
    window.addEventListener('popstate', update);
    return () => {
      listeners.delete(update);
      window.removeEventListener('popstate', update);
    };
  }, []);
  return <Ctx.Provider value={route}>{children}</Ctx.Provider>;
}

export const useRoute = () => useContext(Ctx);

/** A link within the app: a plain click navigates without a reload; others open as usual. */
export function Link({ to, onNavigate, ...props }: { to: string; onNavigate?: () => void } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    props.onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
    onNavigate?.();
  };
  return <a {...props} href={`${base}/${to}`} onClick={click} />;
}

/** A link in HTML the server rendered (`EXP-….html`, `files/#root/path`) as an app route. */
export function routeOfHref(href: string): string | null {
  const page = /^(?:\.\/)?([A-Z]{2,4}-[A-Za-z0-9-]+)\.html(#.*)?$/.exec(href);
  if (page) return `p/${page[1]}`;
  const file = /^(?:\.\/)?files\/#(.+)$/.exec(href);
  if (file) return `files/${file[1]}`;
  return null;
}
