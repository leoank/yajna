// The editor area: dockview groups of tabs, VS Code's way. A single click opens a preview
// tab (italic) that the next one replaces; a double click, or interacting with it, keeps
// it. Ctrl/Cmd-\ splits the active tab to the right. The layout is saved per notebook,
// and the URL names the active file and lines.

import { dv, type DockviewApi, type IDockviewPanel, type GroupPanelPartInitParameters, type TabPartInitParameters, type IContentRenderer, type ITabRenderer, type PanelUpdateEvent, type Parameters, type IWatermarkRenderer, type IHeaderActionsRenderer, type DockviewGroupPanel } from './dockview';
import { api, basename, formatSize, formatTime, ApiError, type Stat } from './api';
import { reviewKind } from './viewers/review';
import { pick, byName, message, type Context, type Viewer } from './viewers/registry';
import type { Change } from './live';

export interface Params extends Parameters {
  path: string;
  pinned?: boolean;
  /** a viewer chosen by hand (open as text, source) */
  kind?: string;
  /** changed on disk while the tab was not in view */
  changed?: boolean;
  /** deleted on disk */
  gone?: boolean;
}

export interface Status {
  path: string;
  left: string;
  right: string;
}

const dark = window.matchMedia('(prefers-color-scheme: dark)');
const theme = () => (dark.matches ? dv.themeDark : dv.themeLight);

/** The parsed URL hash: `#<path>` or `#<path>:L12-30`. */
export function parseHash(hash: string): { path: string; from?: number; to?: number } | null {
  const h = decodeURIComponent(hash.replace(/^#/, ''));
  if (!h) return null;
  const m = /^(.*):L(\d+)(?:-(\d+))?$/.exec(h);
  if (!m) return { path: h };
  return { path: m[1], from: Number(m[2]), to: Number(m[3] ?? m[2]) };
}

class Tab implements ITabRenderer {
  readonly element = document.createElement('div');
  private title = document.createElement('span');
  init(p: TabPartInitParameters) {
    this.element.className = 'yw-tab';
    this.title.className = 'yw-tab-title';
    const close = document.createElement('span');
    close.className = 'yw-tab-close';
    close.textContent = '×';
    close.title = 'Close';
    close.addEventListener('click', (e) => (e.stopPropagation(), p.api.close()));
    this.element.addEventListener('auxclick', (e) => e.button === 1 && p.api.close());
    this.element.addEventListener('dblclick', () => p.api.updateParameters({ pinned: true }));
    this.element.append(this.title, close);
    this.render(p.params as Params);
  }
  update(e: PanelUpdateEvent) {
    this.render(e.params as Params);
  }
  private render(p: Params) {
    this.title.textContent = basename(p.path);
    this.element.title = p.path;
    this.element.classList.toggle('yw-preview', !p.pinned);
    this.element.classList.toggle('yw-changed', !!p.changed);
    this.element.classList.toggle('yw-gone', !!p.gone);
    this.element.title = p.gone ? `${p.path} (deleted on disk)` : p.path;
  }
}

class Panel implements IContentRenderer {
  readonly element = document.createElement('div');
  private viewer?: Viewer;
  private loads = 0;
  private params!: Params;
  private stat?: Stat;
  private api!: GroupPanelPartInitParameters['api'];

  constructor(private bench: Workbench) {
    this.element.className = 'yw-panel';
    // using a preview tab keeps it
    this.element.addEventListener('pointerdown', () => this.pin(), { capture: true });
  }

  init(p: GroupPanelPartInitParameters) {
    this.api = p.api;
    this.params = p.params as Params;
    // a tab brought into view has been seen
    p.api.onDidVisibilityChange((e) => {
      if (e.isVisible && this.params.changed) this.api.updateParameters({ changed: false });
    });
    void this.load();
  }

  update(e: PanelUpdateEvent) {
    const next = { ...this.params, ...e.params } as Params;
    const reload = next.path !== this.params.path || next.kind !== this.params.kind;
    if (next.path !== this.params.path) this.bench.watchChanged();
    this.params = next;
    if (reload) void this.load();
  }

  /** The file changed on disk: show it in place when the viewer can, else load it again. */
  async changed(c: Change) {
    if (!c.exists) {
      if (!this.params.gone) this.api.updateParameters({ gone: true });
      this.bench.refreshStatus();
      return;
    }
    const s = this.stat;
    if (!this.params.gone && s && s.size === c.size && s.mtime === c.mtime) return; // nothing new
    if (this.params.gone) this.api.updateParameters({ gone: false });
    const next: Stat | undefined = s && { ...s, size: c.size, mtime: c.mtime };
    const shown = next && this.viewer?.follow ? await this.viewer.follow(next).catch(() => false) : false;
    if (shown) this.stat = next;
    else await this.load();
    if (!this.api.isVisible) this.api.updateParameters({ changed: true });
    this.bench.refreshStatus();
  }

  get gone() {
    return !!this.params.gone;
  }

  private pin() {
    if (!this.params.pinned) this.api.updateParameters({ pinned: true });
  }

  get path() {
    return this.params.path;
  }

  reveal(from: number, to?: number) {
    this.viewer?.reveal?.(from, to);
  }

  status(): Status {
    const s = this.stat;
    const left = this.params.gone
      ? 'deleted on disk'
      : s
        ? [formatSize(s.size), formatTime(s.mtime)].filter(Boolean).join(' · ')
        : '';
    return { path: this.params.path, left, right: this.viewer?.status?.() ?? '' };
  }

  private async load() {
    this.viewer?.dispose?.();
    this.viewer = undefined;
    // each load draws into its own box, so a slower earlier load cannot draw into this one
    const token = ++this.loads;
    const box = document.createElement('div');
    box.className = 'yw-box';
    this.element.replaceChildren(box);
    const path = this.params.path;
    try {
      // a review tab, `review:<ID>`, is not a file
      const review = path.startsWith('review:');
      this.stat = review ? { path, kind: 'review', mime: 'review', text: false } : await api.stat(path);
      if (token !== this.loads) return;
      const kind = review ? reviewKind : (this.params.kind && byName(this.params.kind)) || pick(this.stat);
      const ctx: Context = {
        path,
        stat: this.stat,
        open: (p) => this.bench.open(p, { pin: true }),
        switchTo: (k) => this.api.updateParameters({ kind: k, pinned: true }),
        onLines: (from, to) => this.bench.onLines(this, from, to),
        onStatus: () => this.bench.refreshStatus(),
      };
      const viewer = await kind.mount(box, ctx);
      if (token !== this.loads) {
        viewer.dispose?.();
        return;
      }
      this.viewer = viewer;
      const pending = this.bench.takeReveal(path);
      if (pending) this.viewer.reveal?.(pending.from, pending.to);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404 && this.bench.restoring) {
        // a file saved in the layout has gone
        this.api.close();
        return;
      }
      if (token === this.loads) message(box, `${path}: ${(err as Error).message}`);
    }
    if (token === this.loads) this.bench.loaded(this);
  }

  dispose() {
    this.viewer?.dispose?.();
  }
}

class Watermark implements IWatermarkRenderer {
  readonly element = document.createElement('div');
  init() {
    this.element.className = 'yw-watermark';
    this.element.innerHTML =
      '<p>Open a file from the tree.</p><p>A click previews it, a double click keeps it open.<br>Drag a tab to an edge to split, or press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> <kbd>\\</kbd>.</p>';
  }
}

class GroupActions implements IHeaderActionsRenderer {
  readonly element = document.createElement('div');
  constructor(private bench: Workbench, private group: DockviewGroupPanel) {}
  init() {
    this.element.className = 'yw-actions';
    const split = document.createElement('button');
    split.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor"/><line x1="8" y1="2.5" x2="8" y2="13.5" stroke="currentColor"/></svg>';
    split.title = 'Split right (Ctrl/⌘ \\)';
    split.addEventListener('click', () => this.bench.splitRight(this.group.activePanel));
    this.element.append(split);
  }
  dispose() {}
}

export class Workbench {
  readonly api: DockviewApi;
  restoring = false;
  private panels = new Map<string, Panel>();
  private reveals = new Map<string, { from: number; to?: number }>();
  private counter = 0;

  constructor(
    el: HTMLElement,
    private storageKey: string,
    private onStatus: (s: Status | null) => void,
    private onActive: (path: string | null) => void,
    /** the set of open files changed */
    private onWatch: () => void,
  ) {
    this.api = dv.createDockview(el, {
      theme: theme(),
      createComponent: ({ id }) => {
        const panel = new Panel(this);
        this.panels.set(id, panel);
        return panel;
      },
      createTabComponent: () => new Tab(),
      createWatermarkComponent: () => new Watermark(),
      createRightHeaderActionComponent: (group) => new GroupActions(this, group),
    });
    dark.addEventListener('change', () => this.api.updateOptions({ theme: theme() }));
    this.api.onDidActivePanelChange(() => {
      const panel = this.active();
      this.onActive(panel?.path ?? null);
      this.refreshStatus();
    });
    this.api.onDidRemovePanel((p) => {
      this.panels.delete(p.id);
      this.onWatch();
    });
    this.api.onDidAddPanel(() => this.onWatch());
    let timer: number | undefined;
    this.api.onDidLayoutChange(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => this.save(), 300);
    });
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        this.splitRight(this.api.activePanel);
      }
    });
  }

  watchChanged() {
    this.onWatch();
  }

  /** The paths the open tabs show. */
  paths(): string[] {
    return [...new Set([...this.panels.values()].map((p) => p.path))];
  }

  /** A watched file changed: every tab that shows it follows. */
  fileChanged(c: Change) {
    for (const panel of this.panels.values()) if (panel.path === c.path) void panel.changed(c);
  }

  private active(): Panel | undefined {
    const p = this.api.activePanel;
    return p ? this.panels.get(p.id) : undefined;
  }

  refreshStatus() {
    this.onStatus(this.active()?.status() ?? null);
  }

  /** A tab finished showing its file: the URL and status line follow it if it is active. */
  loaded(panel: Panel) {
    if (this.active() === panel) this.onActive(panel.path);
    this.refreshStatus();
  }

  onLines(panel: Panel, from: number, to: number) {
    if (this.active() === panel) {
      const lines = from === to ? `L${from}` : `L${from}-${to}`;
      history.replaceState(null, '', `#${encodeURI(panel.path)}:${lines}`);
    }
  }

  takeReveal(path: string) {
    const r = this.reveals.get(path);
    this.reveals.delete(path);
    return r;
  }

  private newId(path: string) {
    return `${path}#${++this.counter}-${Date.now().toString(36)}`;
  }

  /** Show `path` in the active group: the tab already there, the preview tab replaced, or a new tab. */
  open(path: string, opts: { pin?: boolean; from?: number; to?: number } = {}) {
    const group = this.api.activeGroup;
    const existing = group?.panels.find((p) => (p.params as Params | undefined)?.path === path);
    if (opts.from !== undefined) this.reveals.set(path, { from: opts.from, to: opts.to });
    if (existing) {
      existing.api.setActive();
      if (opts.pin) existing.api.updateParameters({ pinned: true });
      if (opts.from !== undefined) {
        this.panels.get(existing.id)?.reveal(opts.from, opts.to);
        this.reveals.delete(path);
      }
      return;
    }
    const preview = group?.panels.find((p) => !(p.params as Params | undefined)?.pinned);
    const params: Params = { path, pinned: !!opts.pin };
    if (preview) {
      // the preview tab takes the new file
      preview.api.updateParameters(params);
      preview.api.setActive();
      return;
    }
    this.api.addPanel({
      id: this.newId(path),
      component: 'viewer',
      tabComponent: 'tab',
      params,
      ...(group ? { position: { referenceGroup: group } } : {}),
    });
  }

  splitRight(panel?: IDockviewPanel) {
    if (!panel) return;
    const params = { ...(panel.params as Params), pinned: true };
    panel.api.updateParameters({ pinned: true });
    this.api.addPanel({
      id: this.newId(params.path),
      component: 'viewer',
      tabComponent: 'tab',
      params,
      position: { referenceGroup: panel.group, direction: 'right' },
    });
  }

  private save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.api.toJSON()));
    } catch {
      /* storage full or blocked: the layout is a convenience */
    }
  }

  /** Bring back the saved layout; files that have gone are dropped as their tabs load. */
  restore() {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(this.storageKey);
    } catch {
      return;
    }
    if (!saved) return;
    this.restoring = true;
    try {
      this.api.fromJSON(JSON.parse(saved));
    } catch {
      this.api.clear();
    }
    window.setTimeout(() => (this.restoring = false), 2000);
  }
}
