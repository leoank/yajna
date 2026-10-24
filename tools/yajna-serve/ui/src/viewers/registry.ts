// Viewers are modules: each says how well it fits a file, and mounts into a tab's element.
// The highest score opens a file; the others are offered by name (open as text, as hex).

import type { Stat } from '../api';

export interface Viewer {
  dispose?(): void;
  /** right-hand side of the status line */
  status?(): string;
  /** select lines and scroll to them (1-based, inclusive) */
  reveal?(from: number, to?: number): void;
  /** the file changed on disk: show `next` in place and say so, or false to be reloaded */
  follow?(next: Stat): Promise<boolean>;
}

export interface Context {
  path: string;
  stat: Stat;
  /** open another file in the viewer */
  open(path: string): void;
  /** show this file in another viewer, in the same tab */
  switchTo(kind: string): void;
  /** the selected lines changed: update the URL */
  onLines(from: number, to: number): void;
  /** the status line's text changed */
  onStatus(): void;
}

export interface Kind {
  name: string;
  /** 0: never chosen on its own */
  score(stat: Stat): number;
  mount(el: HTMLElement, ctx: Context): Promise<Viewer>;
}

const kinds: Kind[] = [];

export function register(kind: Kind) {
  kinds.push(kind);
}

export function pick(stat: Stat): Kind {
  return kinds.reduce((best, k) => (k.score(stat) > best.score(stat) ? k : best));
}

export function byName(name: string): Kind | undefined {
  return kinds.find((k) => k.name === name);
}

export function toolbar(el: HTMLElement, buttons: [string, () => void][]): HTMLElement {
  const bar = document.createElement('div');
  bar.className = 'yv-toolbar';
  for (const [label, action] of buttons) {
    const b = document.createElement('button');
    b.textContent = label;
    b.addEventListener('click', action);
    bar.append(b);
  }
  el.append(bar);
  return bar;
}

export function message(el: HTMLElement, text: string): void {
  const m = document.createElement('div');
  m.className = 'yv-message';
  m.textContent = text;
  el.append(m);
}
