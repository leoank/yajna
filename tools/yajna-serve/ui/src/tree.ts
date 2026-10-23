// The tree of roots on the left: directories expand lazily, a page of entries at a time;
// a click previews a file, a double click keeps it open.

import { api, formatSize, formatTime, type Entry, type Root } from './api';

type Open = (path: string, pin: boolean) => void;

interface Node {
  path: string;
  row: HTMLElement;
  children?: HTMLElement;
  loaded: boolean;
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
      const title = r.exists ? r.path : `${r.path} is not on this machine`;
      this.list.append(this.item(r.name, entry, 0, title));
    }
  }

  private item(path: string, e: Entry, depth: number, title?: string): HTMLElement {
    const li = document.createElement('div');
    li.className = 'yt-item';
    const row = document.createElement('div');
    row.className = `yt-row yt-${e.kind}${depth === 0 ? ' yt-root' : ''}`;
    row.style.paddingLeft = `${depth * 12 + 6}px`;
    row.dataset.path = path;
    row.title =
      title ??
      [path, e.link ? `→ ${e.link}` : '', e.size !== undefined ? formatSize(e.size) : '', formatTime(e.mtime)]
        .filter(Boolean)
        .join('\n');
    const twisty = document.createElement('span');
    twisty.className = 'yt-twisty';
    twisty.textContent = e.kind === 'dir' ? '▸' : '';
    const label = document.createElement('span');
    label.className = 'yt-label';
    label.textContent = e.name + (e.link ? ' ↗' : '');
    row.append(twisty, label);
    li.append(row);
    const node: Node = { path, row, loaded: false };
    this.nodes.set(path, node);
    if (e.kind === 'dir') {
      row.addEventListener('click', () => this.toggle(node, li, depth));
    } else if (e.kind === 'file' || e.kind === 'other') {
      row.addEventListener('click', () => (this.select(row), this.open(path, false)));
      row.addEventListener('dblclick', () => this.open(path, true));
    }
    return li;
  }

  private async toggle(node: Node, li: HTMLElement, depth: number): Promise<void> {
    const twisty = node.row.querySelector('.yt-twisty')!;
    if (node.children && !node.children.hidden) {
      node.children.hidden = true;
      twisty.textContent = '▸';
      return;
    }
    twisty.textContent = '▾';
    if (!node.children) {
      node.children = document.createElement('div');
      li.append(node.children);
    }
    node.children.hidden = false;
    if (!node.loaded) {
      node.loaded = true;
      await this.page(node, depth + 1, 0);
    }
  }

  private async page(node: Node, depth: number, cursor: number): Promise<void> {
    const box = node.children!;
    const loading = this.note(box, 'loading…', depth);
    try {
      const l = await api.list(node.path, cursor);
      loading.remove();
      for (const e of l.entries) box.append(this.item(`${node.path}/${e.name}`, e, depth));
      if (l.total === 0) this.note(box, 'empty', depth);
      if (l.next !== undefined) {
        const more = this.note(box, `show more (${l.next} of ${l.total})`, depth);
        more.classList.add('yt-more');
        more.addEventListener('click', () => (more.remove(), this.page(node, depth, l.next!)));
      }
    } catch (err) {
      loading.textContent = String((err as Error).message);
    }
    this.filter();
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
      const dir = parts.slice(0, i).join('/');
      const node = this.nodes.get(dir);
      if (!node) return;
      if (!node.children || node.children.hidden) {
        const li = node.row.parentElement!;
        const depth = i - 1;
        await this.toggle(node, li, depth);
      }
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
      if (kids) for (const child of Array.from(kids.children) as HTMLElement[]) {
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
