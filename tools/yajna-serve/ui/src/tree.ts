// The tree of roots on the left: directories expand lazily, a page of entries at a time;
// a click previews a file, a double click keeps it open. Expanded directories are watched,
// and a change merges the new listing in place, keeping what is expanded below it.

import { api, formatSize, formatTime, type Entry, type Root } from './api';
import type { Change } from './live';

type Open = (path: string, pin: boolean) => void;

interface Node {
  path: string;
  depth: number;
  item: HTMLElement;
  row: HTMLElement;
  children?: HTMLElement;
  loaded: boolean;
  /** entries shown, and the directory's mtime when they were read */
  count: number;
  mtime?: number;
  busy?: Promise<void>;
}

export class Tree {
  private nodes = new Map<string, Node>();
  private selected?: HTMLElement;
  readonly element: HTMLElement;
  private list: HTMLElement;
  private filterBox: HTMLInputElement;

  constructor(
    roots: Root[],
    private open: Open,
    /** the set of expanded directories changed */
    private onWatch: () => void,
  ) {
    this.element = document.createElement('nav');
    this.element.className = 'yt';
    this.filterBox = document.createElement('input');
    this.filterBox.type = 'search';
    this.filterBox.placeholder = 'Filter loaded files';
    this.filterBox.addEventListener('input', () => this.filter());
    this.list = document.createElement('div');
    this.list.className = 'yt-list';
    this.element.append(this.filterBox, this.list);
    for (const r of roots) {
      const entry: Entry = { name: r.name, kind: r.exists ? 'dir' : 'broken' };
      const live = r.live === 'notify' ? 'live' : r.live === 'poll' ? 'polled every 2 s' : 'not live';
      const title = r.exists ? `${r.path}\n${live}` : `${r.path} is not on this machine`;
      this.list.append(this.item(r.name, entry, 0, title));
    }
  }

  /** The directories open in the tree, which the server should watch. */
  expanded(): string[] {
    return [...this.nodes.values()]
      .filter((n) => n.loaded && n.children && !n.children.hidden && n.item.isConnected)
      .map((n) => n.path);
  }

  private describe(row: HTMLElement, path: string, e: Entry) {
    row.title = [path, e.link ? `→ ${e.link}` : '', e.size !== undefined ? formatSize(e.size) : '', formatTime(e.mtime)]
      .filter(Boolean)
      .join('\n');
  }

  private item(path: string, e: Entry, depth: number, title?: string): HTMLElement {
    const li = document.createElement('div');
    li.className = 'yt-item';
    li.dataset.key = `${e.kind}/${e.name}`;
    const row = document.createElement('div');
    row.className = `yt-row yt-${e.kind}${depth === 0 ? ' yt-root' : ''}`;
    row.style.paddingLeft = `${depth * 12 + 6}px`;
    row.dataset.path = path;
    if (title) row.title = title;
    else this.describe(row, path, e);
    const twisty = document.createElement('span');
    twisty.className = 'yt-twisty';
    twisty.textContent = e.kind === 'dir' ? '▸' : '';
    const label = document.createElement('span');
    label.className = 'yt-label';
    label.textContent = e.name + (e.link ? ' ↗' : '');
    row.append(twisty, label);
    li.append(row);
    const node: Node = { path, depth, item: li, row, loaded: false, count: 0 };
    this.nodes.set(path, node);
    if (e.kind === 'dir') {
      row.addEventListener('click', () => this.toggle(node));
    } else if (e.kind === 'file' || e.kind === 'other') {
      row.addEventListener('click', () => (this.select(row), this.open(path, false)));
      row.addEventListener('dblclick', () => this.open(path, true));
    }
    return li;
  }

  private async toggle(node: Node): Promise<void> {
    const twisty = node.row.querySelector('.yt-twisty')!;
    if (node.children && !node.children.hidden) {
      node.children.hidden = true;
      twisty.textContent = '▸';
      this.onWatch();
      return;
    }
    twisty.textContent = '▾';
    if (!node.children) {
      node.children = document.createElement('div');
      node.item.append(node.children);
    }
    node.children.hidden = false;
    if (!node.loaded) {
      node.loaded = true;
      await this.page(node, 0);
    }
    this.onWatch();
  }

  private async page(node: Node, cursor: number): Promise<void> {
    const box = node.children!;
    const depth = node.depth + 1;
    const loading = this.note(box, 'loading…', depth);
    try {
      const l = await api.list(node.path, cursor);
      loading.remove();
      for (const e of l.entries) box.append(this.item(`${node.path}/${e.name}`, e, depth));
      node.count += l.entries.length;
      node.mtime = l.mtime;
      this.tail(node, l.total, l.next);
    } catch (err) {
      loading.textContent = String((err as Error).message);
    }
    this.filter();
  }

  /** The notes after a directory's entries: empty, or more to show. */
  private tail(node: Node, total: number, next?: number) {
    const box = node.children!;
    const depth = node.depth + 1;
    for (const n of box.querySelectorAll(':scope > .yt-note')) n.remove();
    if (total === 0) this.note(box, 'empty', depth);
    if (next !== undefined) {
      const more = this.note(box, `show more (${next} of ${total})`, depth);
      more.classList.add('yt-more');
      more.addEventListener('click', () => (more.remove(), this.page(node, next)));
    }
  }

  /** A watched directory changed: read it again and merge, keeping what is expanded. */
  dirChanged(c: Change) {
    const node = this.nodes.get(c.path);
    if (!node || !node.loaded || !node.children) return;
    if (c.exists && c.mtime === node.mtime) return; // what the tree shows already
    const run = async () => {
      if (!c.exists) {
        node.children!.replaceChildren();
        this.note(node.children!, 'deleted on disk', node.depth + 1);
        node.count = 0;
        node.mtime = undefined;
        return;
      }
      const want = Math.max(node.count, 1);
      const entries: Entry[] = [];
      let cursor: number | undefined = 0;
      let total = 0;
      let mtime: number | undefined;
      while (cursor !== undefined && entries.length < want) {
        const l = await api.list(node.path, cursor);
        entries.push(...l.entries);
        cursor = l.next;
        total = l.total;
        mtime = l.mtime;
      }
      const box = node.children!;
      const old = new Map<string, HTMLElement>();
      for (const li of box.querySelectorAll<HTMLElement>(':scope > .yt-item')) old.set(li.dataset.key!, li);
      const items = entries.map((e) => {
        const path = `${node.path}/${e.name}`;
        const kept = old.get(`${e.kind}/${e.name}`);
        if (!kept) return this.item(path, e, node.depth + 1);
        old.delete(`${e.kind}/${e.name}`);
        this.describe(kept.querySelector(':scope > .yt-row')!, path, e);
        return kept;
      });
      for (const li of old.values()) this.forget(li);
      box.replaceChildren(...items);
      node.count = entries.length;
      node.mtime = mtime;
      this.tail(node, total, cursor);
      this.filter();
      this.onWatch();
    };
    // one refresh at a time per directory; a change during one starts another after it
    node.busy = (node.busy ?? Promise.resolve()).then(run, run).catch(() => undefined);
  }

  /** Drop a removed row and everything below it from the index of nodes. */
  private forget(li: HTMLElement) {
    const path = li.querySelector<HTMLElement>(':scope > .yt-row')?.dataset.path;
    if (!path) return;
    for (const key of [...this.nodes.keys()]) {
      if (key === path || key.startsWith(`${path}/`)) this.nodes.delete(key);
    }
  }

  private note(box: HTMLElement, text: string, depth: number): HTMLElement {
    const n = document.createElement('div');
    n.className = 'yt-row yt-note';
    n.style.paddingLeft = `${depth * 12 + 18}px`;
    n.textContent = text;
    box.append(n);
    return n;
  }

  private select(row: HTMLElement) {
    this.selected?.classList.remove('yt-selected');
    row.classList.add('yt-selected');
    this.selected = row;
  }

  /** Expand the directories down to `path` and mark it. */
  async reveal(path: string): Promise<void> {
    const parts = path.split('/');
    for (let i = 1; i < parts.length; i++) {
      const node = this.nodes.get(parts.slice(0, i).join('/'));
      if (!node) return;
      if (!node.children || node.children.hidden) await this.toggle(node);
    }
    const node = this.nodes.get(path);
    if (node) {
      this.select(node.row);
      node.row.scrollIntoView({ block: 'nearest' });
    }
  }

  /** Hide loaded rows that neither match the filter nor contain a match. */
  private filter() {
    const needle = this.filterBox.value.trim().toLowerCase();
    const visit = (item: HTMLElement): boolean => {
      const row = item.querySelector(':scope > .yt-row') as HTMLElement | null;
      const kids = item.querySelector(':scope > div:not(.yt-row)') as HTMLElement | null;
      let any = false;
      if (kids)
        for (const child of Array.from(kids.children) as HTMLElement[]) {
          if (child.classList.contains('yt-item')) any = visit(child) || any;
          else child.hidden = needle !== '';
        }
      const label = row?.querySelector('.yt-label')?.textContent?.toLowerCase() ?? '';
      const show = needle === '' || any || label.includes(needle);
      item.hidden = !show;
      return show;
    };
    for (const item of Array.from(this.list.children) as HTMLElement[]) {
      visit(item);
      item.hidden = false; // the roots stay
    }
  }
}
