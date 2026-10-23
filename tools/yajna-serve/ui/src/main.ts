// The files viewer of `yajna serve` (docs/files-viewer.md 6): the tree, the editor area,
// the status line.

import './viewers/text';
import './viewers/markdown';
import './viewers/image';
import './viewers/binary';
import { api } from './api';
import { Tree } from './tree';
import { Workbench, parseHash, type Status } from './workbench';

const WIDTH_KEY = 'yajna-files:sidebar';

async function main() {
  const [info, roots] = await Promise.all([api.info(), api.roots()]);
  document.title = `${info.notebook} · files`;
  document.querySelector('#notebook')!.textContent = info.notebook;
  document.querySelector('#version')!.textContent = `yajna ${info.version}`;

  const statusPath = document.querySelector('#status-path')!;
  const statusLeft = document.querySelector('#status-left')!;
  const statusRight = document.querySelector('#status-right')!;
  const showStatus = (s: Status | null) => {
    statusPath.textContent = s?.path ?? '';
    statusLeft.textContent = s?.left ?? '';
    statusRight.textContent = s?.right ?? '';
  };

  let bench: Workbench;
  const tree = new Tree(roots, (path, pin) => bench.open(path, { pin }));
  document.querySelector('#sidebar')!.append(tree.element);

  bench = new Workbench(document.querySelector('#editor')!, `yajna-files:${info.notebook}`, showStatus, (path) => {
    if (path && parseHash(location.hash)?.path !== path) history.replaceState(null, '', `#${encodeURI(path)}`);
  });
  bench.restore();

  const fromHash = () => {
    const h = parseHash(location.hash);
    if (!h) return;
    bench.open(h.path, { pin: true, from: h.from, to: h.to });
    void tree.reveal(h.path);
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();

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
