// Live updates (docs/files-viewer.md 5.5): one event stream naming the open files and the
// expanded directories, opened again, after a short pause, whenever that set changes.

export interface Change {
  path: string;
  kind: 'file' | 'dir';
  exists: boolean;
  size?: number;
  mtime?: number;
}

export type State = 'live' | 'connecting' | 'idle';

export class Live {
  private source?: EventSource;
  private paths = new Set<string>();
  private timer?: number;

  constructor(
    private onChange: (c: Change) => void,
    private onState: (s: State) => void,
  ) {}

  /** Watch exactly these paths. */
  set(paths: Iterable<string>) {
    const next = new Set(paths);
    if (next.size === this.paths.size && [...next].every((p) => this.paths.has(p))) return;
    this.paths = next;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.connect(), 300);
  }

  private connect() {
    this.source?.close();
    this.source = undefined;
    if (this.paths.size === 0) {
      this.onState('idle');
      return;
    }
    const query = [...this.paths].map((p) => `watch=${encodeURIComponent(p)}`).join('&');
    const es = new EventSource(`/api/events?${query}`);
    this.onState('connecting');
    es.addEventListener('open', () => this.onState('live'));
    // EventSource reconnects by itself; the server then sends every path's state again
    es.addEventListener('error', () => this.onState('connecting'));
    es.addEventListener('change', (e) => this.onChange(JSON.parse((e as MessageEvent).data) as Change));
    this.source = es;
  }
}
