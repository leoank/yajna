// The files viewer of `yajna serve` (docs/files-viewer.md 6): the tree, the editor area,
// the status line.

import './viewers/text';
import './viewers/markdown';
import './viewers/image';
import './viewers/binary';
import './viewers/review';
import { api, base, setLocal, setToken } from './api';
import { Changes, baseOf, notebookBase, placeFromUrl, placeToUrl, worktrees, type Worktree } from './changes';
import { ReviewList } from './reviews';
import { Tree } from './tree';
import { Workbench, parseHash, type Status } from './workbench';
import { Live } from './live';

const WIDTH_KEY = 'yajna-files:sidebar';

/** `files/changes`: the changes view as a page of its own, phone-first (ADR-0038). */
async function changesPage() {
  document.body.className = 'yc-page';
  const info = await api.info().catch(() => null);
  document.title = `${info?.notebook ?? 'notebook'} · changes`;
  const view = new Changes(
    placeFromUrl(),
    (p, replace) => (replace ? history.replaceState(null, '', placeToUrl(p)) : history.pushState(null, '', placeToUrl(p))),
    (path, w) => (location.href = `${baseOf(w)}/files/#${encodeURI(path)}`),
  );
  document.body.replaceChildren(view.element);
  window.addEventListener('popstate', () => view.go(placeFromUrl(), false));
}

/** The worktree this viewer shows, among the notebook's. */
function shownHere(list: Worktree[]): Worktree | undefined {
  return base === notebookBase ? list.find((w) => w.current) : list.find((w) => base.endsWith(`/${w.url.replace(/\/$/, '')}`));
}

/** The worktree picker in the top bar, and the uncommitted count on the sidebar's Changes. */
async function worktreeBits(count: HTMLElement) {
  const pick = document.querySelector('#worktree') as HTMLSelectElement;
  let shown = '';
  const load = async () => {
    const list = await worktrees().catch(() => null);
    if (!list) return;
    const here = shownHere(list);
    const n = here ? (here.changed ?? 0) + (here.staged ?? 0) + (here.untracked ?? 0) + (here.conflicted ?? 0) : 0;
    count.textContent = n ? String(n) : '';
    const key = JSON.stringify(list.map((w) => w.name));
    if (key === shown || list.length < 2) return;
    shown = key;
    pick.replaceChildren(...list.map((w) => new Option(w.name, w.name, false, w === here)));
    pick.hidden = false;
    pick.onchange = () => {
      const w = list.find((x) => x.name === pick.value);
      if (w) location.href = `${baseOf(w)}/files/`;
    };
  };
  await load();
  window.setInterval(() => void load(), 5000);
}

async function main() {
  if (/\/files\/changes\/?$/.test(location.pathname)) return changesPage();
  // the token of `yajna serve --review`, kept in memory and out of the address bar
  const token = new URLSearchParams(location.search).get('token');
  if (token) {
    setToken(token);
    history.replaceState(null, '', location.pathname + location.hash);
  }
  const [info, roots] = await Promise.all([api.info(), api.roots()]);
  setLocal(info.local === true);
  document.title = `${info.notebook} · files`;
  document.querySelector('#notebook')!.textContent = info.notebook;
  document.querySelector('#version')!.textContent = `yajna ${info.version}`;

  const statusPath = document.querySelector('#status-path')!;
  const statusLeft = document.querySelector('#status-left')!;
  const statusRight = document.querySelector('#status-right')!;
  const statusLive = document.querySelector('#status-live') as HTMLElement;
  const modes = new Map(roots.map((r) => [r.name, r.live]));
  let stream: 'live' | 'connecting' | 'idle' = 'idle';
  let shown: Status | null = null;
  // how the active file is kept current: by events, by polling, or not at all
  const showLive = () => {
    const mode = shown ? modes.get(shown.path.split('/')[0]) : undefined;
    const text =
      !shown || !mode
        ? ''
        : mode === 'off'
          ? 'not live'
          : stream === 'connecting'
            ? 'reconnecting…'
            : mode === 'poll'
              ? 'live, polled every 2 s'
              : 'live';
    statusLive.textContent = text;
    statusLive.className = text.startsWith('live') ? 'on' : '';
  };
  const showStatus = (s: Status | null) => {
    shown = s;
    statusPath.textContent = s?.path ?? '';
    statusLeft.textContent = s?.left ?? '';
    statusRight.textContent = s?.right ?? '';
    showLive();
  };

  let bench: Workbench;
  const live = new Live(
    (c) => (c.kind === 'dir' ? tree.dirChanged(c) : bench.fileChanged(c)),
    (s) => ((stream = s), showLive()),
  );
  // review tabs read their review themselves; only files are watched
  const watch = () => live.set([...bench.paths().filter((p) => !p.startsWith('review:') && p !== 'changes:'), ...tree.expanded()]);
  const tree = new Tree(roots, (path, pin) => bench.open(path, { pin }), () => watch());
  const list = new ReviewList((id) => bench.open(`review:${id}`, { pin: true }));
  // what is uncommitted here and in the other worktrees (ADR-0038)
  const changes = document.createElement('div');
  changes.className = 'yc-side';
  changes.title = 'What is changed, staged and committed in the worktrees';
  const label = document.createElement('span');
  label.textContent = 'Changes';
  const count = document.createElement('span');
  count.className = 'yr-count';
  changes.append(label, count);
  changes.addEventListener('click', () => bench.open('changes:', { pin: true }));
  document.querySelector('#sidebar')!.append(changes, list.element, tree.element);
  void worktreeBits(count);

  bench = new Workbench(
    document.querySelector('#editor')!,
    `yajna-files:${info.notebook}`,
    showStatus,
    (path) => {
      if (path && parseHash(location.hash)?.path !== path) history.replaceState(null, '', `#${encodeURI(path)}`);
    },
    () => watch(),
  );
  // the file a link asked for: read before the saved layout is restored, because
  // restoring activates the last tab, and that rewrites the URL
  const requested = location.hash;
  bench.restore();

  const fromHash = (hash = location.hash) => {
    const h = parseHash(hash);
    if (!h) return;
    bench.open(h.path, { pin: true, from: h.from, to: h.to });
    void tree.reveal(h.path);
  };
  window.addEventListener('hashchange', () => fromHash());
  fromHash(requested);

  // the sidebar's width, dragged on its edge
  const sidebar = document.querySelector('#sidebar') as HTMLElement;
  const saved = Number(localStorage.getItem(WIDTH_KEY) ?? 0);
  if (saved > 120) sidebar.style.width = `${saved}px`;
  const sash = document.querySelector('#sash') as HTMLElement;
  sash.addEventListener('pointerdown', (e) => {
    sash.setPointerCapture(e.pointerId);
    const move = (m: PointerEvent) => (sidebar.style.width = `${Math.max(120, Math.min(m.clientX, window.innerWidth - 200))}px`);
    const up = () => {
      sash.removeEventListener('pointermove', move);
      try {
        localStorage.setItem(WIDTH_KEY, String(sidebar.offsetWidth));
      } catch {
        /* a convenience */
      }
    };
    sash.addEventListener('pointermove', move);
    sash.addEventListener('pointerup', up, { once: true });
  });
}

main().catch((err) => {
  document.body.textContent = `The files viewer could not start: ${(err as Error).message}`;
});
