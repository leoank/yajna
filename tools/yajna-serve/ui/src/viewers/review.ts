// A review (docs/review.md 7.2): its changed files as side-by-side diffs with the threads
// drawn at their lines, an overview with the summary, the verdict and every thread, the
// changes not in the review yet, and, when the server runs with --review, forms that write
// to the page as the CLI does. The page is read again every two seconds, so an agent's
// reply shows up while it is read; what is being typed survives that.

import { Compartment, EditorSelection, EditorState, StateEffect, StateField, type Range } from '@codemirror/state';
import { EditorView, Decoration, WidgetType, drawSelection, lineNumbers, showTooltip, type DecorationSet, type Tooltip } from '@codemirror/view';
import { MergeView } from '@codemirror/merge';
import { reviews, canWrite, ApiError, type Review, type Thread, type ChangedFile, type Write, type Sides } from '../api';
import { register, type Context, type Viewer } from './registry';
import { language, theme } from './text';

const POLL = 2000;
const PREFS_KEY = 'yajna-files:review';

/** What the toolbar toggles, kept per browser. */
interface Prefs {
  files: boolean;
  wrap: boolean;
  composer: boolean;
  focus: boolean;
}

function loadPrefs(): Prefs {
  const fallback = { files: true, wrap: false, composer: true, focus: false };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}') };
  } catch {
    return fallback;
  }
}

function savePrefs(p: Prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {
    /* a convenience */
  }
}

/** Focus hides the app's top bar, sidebar and status line, leaving the tabs. */
function setFocus(on: boolean) {
  document.body.classList.toggle('yr-focus', on);
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

/** A path with its directory shortened first when space runs out, and in full on hover. */
function pathEl(path: string, cls = 'yr-label'): HTMLElement {
  const box = el('span', `${cls} yr-path`);
  box.title = path;
  const cut = path.lastIndexOf('/') + 1;
  if (cut) box.append(el('span', 'yr-dir', path.slice(0, cut)));
  box.append(el('span', 'yr-base', path.slice(cut)));
  return box;
}

const lines = (a: number, b: number) => (a === b ? `line ${a}` : `lines ${a}–${b}`);

interface Action {
  label: string;
  action: string;
  thread?: string;
  needsText?: boolean;
  /** ask for the commit that addresses the thread */
  commit?: boolean;
  /** where a new thread goes; null cancels */
  at?: () => string | null;
}

interface Writer {
  review(): Review;
  /** what is being typed, by form, kept across reloads of the review */
  drafts: Map<string, string>;
  write(action: string, w: Write, key: string): Promise<void>;
  /** a file of the review at a line, or another file */
  openFile(path: string, line?: number): void;
}

function form(w: Writer, key: string, actions: Action[], placeholder: string, extra: HTMLElement[] = []): HTMLElement {
  const box = el('div', 'yr-form');
  const text = el('textarea');
  text.rows = 2;
  text.placeholder = placeholder;
  text.value = w.drafts.get(key) ?? '';
  text.addEventListener('input', () => w.drafts.set(key, text.value));
  const bar = el('div', 'yr-buttons');
  for (const a of actions) {
    const b = el('button', '', a.label);
    b.addEventListener('click', () => {
      const said = text.value.trim();
      if (a.needsText && !said) return text.focus();
      let commit: string | undefined;
      if (a.commit) {
        const c = window.prompt('The commit that addresses it (empty: the branch tip, or HEAD)', '');
        if (c === null) return;
        commit = c.trim() || undefined;
      }
      const at = a.at?.();
      if (at === null) return;
      void w.write(a.action, { thread: a.thread, text: said || undefined, commit, at }, key);
    });
    bar.append(b);
  }
  bar.append(...extra);
  // Ctrl/Cmd-Enter sends with the first button
  text.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      (bar.firstElementChild as HTMLButtonElement | null)?.click();
    }
  });
  box.append(text, bar);
  return box;
}

function threadActions(t: Thread, w: Writer): Action[] {
  const thread = `T${t.n}`;
  const human = !w.review().author.startsWith('agent:');
  const out: Action[] = [{ label: 'Reply', action: 'reply', thread, needsText: true }];
  if (t.state !== 'resolved') out.push({ label: 'Addressed…', action: 'address', thread, needsText: true, commit: true });
  if (human && t.state !== 'resolved') out.push({ label: 'Resolve', action: 'resolve', thread });
  if (t.state === 'resolved' || t.state === 'addressed') out.push({ label: 'Reopen', action: 'reopen', thread });
  return out;
}

function threadEl(t: Thread, w: Writer, withQuote: boolean): HTMLElement {
  const box = el('div', `yr-thread yr-${t.state}`);
  const head = el('div', 'yr-thread-head');
  head.append(el('b', '', `T${t.n}`), el('span', `yr-state yr-${t.state}`, t.state));
  const where = el('span', 'yr-anchor', t.anchor.raw);
  where.title = t.anchor.raw;
  const path = t.anchor.path;
  if (path) {
    where.classList.add('yr-link');
    where.addEventListener('click', () => w.openFile(path, t.anchor.from));
  }
  head.append(where);
  box.append(head);
  if (withQuote && t.quote.length) box.append(el('pre', 'yr-quote', t.quote.join('\n')));
  const list = el('ul', 'yr-replies');
  for (const r of t.replies) {
    const li = el('li');
    li.append(el('span', 'yr-when', r.when), ' ', el('span', r.author.startsWith('agent:') ? 'yr-agent' : 'yr-who', r.author), ' ');
    if (r.action) li.append(el('span', 'yr-action', r.action === 'addressed' ? `addressed in ${r.commit}` : r.action), ' ');
    if (r.text) li.append(r.text);
    list.append(li);
  }
  box.append(list);
  if (canWrite()) box.append(form(w, `T${t.n}`, threadActions(t, w), 'Reply…'));
  return box;
}

// --- threads and the new-thread box inside the diff ---

const setThreads = StateEffect.define<DecorationSet>();
const threadField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    for (const e of tr.effects) if (e.is(setThreads)) return e.value;
    return deco.map(tr.changes);
  },
  provide: (f) => EditorView.decorations.from(f),
});

class BoxWidget extends WidgetType {
  constructor(
    private sig: string,
    private build: () => HTMLElement,
  ) {
    super();
  }
  eq(other: BoxWidget) {
    return other.sig === this.sig;
  }
  toDOM() {
    return this.build();
  }
  ignoreEvent() {
    return true;
  }
}

/** Whether a thread's anchor is at the review's head, so its lines are in the right side. */
const atHead = (t: Thread, r: Review) => !!t.anchor.commit && r.head.startsWith(t.anchor.commit) && t.state !== 'outdated';

function lineOf(t: Thread, view: EditorView): number | null {
  const doc = view.state.doc;
  if (t.anchor.to) return Math.min(t.anchor.to, doc.lines);
  if (t.anchor.heading) {
    for (let i = 1; i <= doc.lines; i++) {
      const text = doc.line(i).text;
      if (text.startsWith('#') && text.replace(/^#+/, '').trim() === t.anchor.heading) return i;
    }
  }
  return null;
}

/** The lines a selection covers, whole lines, in the right side. */
function selectedLines(state: EditorState): { a: number; b: number } {
  const sel = state.selection.main;
  const a = state.doc.lineAt(sel.from).number;
  // a selection that ends at the start of a line does not take that line
  let b = state.doc.lineAt(sel.to).number;
  if (b > a && state.doc.line(b).from === sel.to) b--;
  return { a, b };
}

/** The button that floats over a selection in the right side: comment right there. */
function commentTooltip(start: (a: number, b: number) => void) {
  const make = (state: EditorState): Tooltip | null => {
    const sel = state.selection.main;
    if (sel.empty) return null;
    const { a, b } = selectedLines(state);
    // above the first line, clear of the box that opens under the last
    return {
      pos: sel.from,
      above: true,
      create: () => {
        const dom = el('button', 'yr-float', `Comment on ${lines(a, b)}`);
        dom.addEventListener('mousedown', (e) => e.preventDefault());
        dom.addEventListener('click', () => start(a, b));
        return { dom };
      },
    };
  };
  return StateField.define<Tooltip | null>({
    create: make,
    update: (tip, tr) => (tr.selection ? make(tr.state) : tip),
    provide: (f) => showTooltip.from(f),
  });
}

/** Clicking a line number selects the line; shift-click extends to it. */
function numberSelect() {
  let from = 1;
  return lineNumbers({
    domEventHandlers: {
      mousedown(view, block, event) {
        const doc = view.state.doc;
        const n = doc.lineAt(block.from).number;
        if (!(event as MouseEvent).shiftKey) from = n;
        const [a, b] = from <= n ? [from, n] : [n, from];
        view.dispatch({ selection: EditorSelection.range(doc.line(a).from, doc.line(b).to) });
        return true;
      },
    },
  });
}

/** Changed words as a deeper tint of their line, instead of the merge view's underlines. */
const diffLook = EditorView.theme({
  '&.cm-merge-a .cm-changedText, .cm-deletedChunk .cm-deletedText': { background: 'rgba(238, 68, 51, 0.3)' },
  '&.cm-merge-b .cm-changedText': { background: 'rgba(34, 187, 34, 0.3)' },
});

// --- the viewer ---

/** The file shown: a changed file of the review, or (work) one not in it yet. */
interface Shown {
  path: string;
  work: boolean;
}

const sameShown = (a: Shown | null, b: Shown | null) => a?.path === b?.path && a?.work === b?.work;

export const reviewKind = {
  name: 'review',
  score: () => 0,
  async mount(root: HTMLElement, ctx: Context): Promise<Viewer> {
    const id = ctx.path.replace(/^review:/, '');
    let current = await reviews.get(id);
    const prefs = loadPrefs();
    setFocus(prefs.focus);
    /** the file shown, or null for the overview */
    let selected: Shown | null = null;
    let diff: { shown: Shown; head: string; sides: Sides; view: MergeView; wrap: Compartment } | undefined;
    /** a new thread being written inside the diff, on these lines */
    let draft: { path: string; a: number; b: number } | null = null;
    /** the lines picked in the right side, for the comment box */
    let picked: { a: number; b: number } | null = null;
    /** a line to bring into view once the file is shown */
    let goTo: number | undefined;
    let busy = false;
    let disposed = false;

    const top = el('div', 'yr-top');
    const notice = el('div', 'yr-notice');
    const body = el('div', 'yr-body');
    const files = el('ul', 'yr-files');
    const main = el('div', 'yr-main');
    body.append(files, main);
    root.append(top, notice, body);

    const say = (text: string) => {
      notice.textContent = text;
      notice.hidden = !text;
    };
    say('');

    const inlineKey = (path: string) => `inline:${path}`;

    const writer: Writer = {
      review: () => current,
      drafts: new Map(),
      async write(action, w, key) {
        if (busy) return;
        busy = true;
        try {
          current = await reviews.write(id, action, current.version, w);
          writer.drafts.delete(key);
          if (draft && key === inlineKey(draft.path)) draft = null;
          say('');
          render();
        } catch (e) {
          if (e instanceof ApiError && e.status === 409) {
            current = await reviews.get(id);
            render();
            say(`${e.message}. What you wrote is kept; send it again.`);
          } else say((e as Error).message);
        } finally {
          busy = false;
        }
      },
      openFile(path, line) {
        if (current.files.some((f) => f.path === path)) {
          selected = { path, work: false };
          goTo = line;
          render();
        } else ctx.open(path);
      },
    };

    function toggle(label: string, key: keyof Prefs, hint: string) {
      const b = el('button', 'yr-toggle', label);
      b.title = hint;
      b.setAttribute('aria-pressed', String(prefs[key]));
      b.addEventListener('click', () => {
        prefs[key] = !prefs[key];
        savePrefs(prefs);
        if (key === 'focus') setFocus(prefs.focus);
        if (key === 'wrap' && diff) {
          const ext = prefs.wrap ? EditorView.lineWrapping : [];
          for (const v of [diff.view.a, diff.view.b]) v.dispatch({ effects: diff.wrap.reconfigure(ext) });
        }
        layout();
        header();
        if (key === 'composer' && selected) void file(true);
      });
      return b;
    }

    function header() {
      const r = current;
      top.replaceChildren();
      const row = el('div', 'yr-row');
      const title = el('div', 'yr-title');
      title.append(el('b', '', r.id), ` ${r.title}`);
      const tools = el('div', 'yr-tools');
      tools.append(
        toggle('Files', 'files', 'Show the list of files'),
        toggle('Wrap', 'wrap', 'Wrap long lines in the diffs'),
        toggle('Comment box', 'composer', 'Keep a comment box for the selected lines above the diff'),
        toggle('Focus', 'focus', 'Hide the top bar, the sidebar and the status line (Esc leaves)'),
      );
      row.append(title, tools);
      const meta = el('div', 'yr-meta');
      meta.append(
        el('span', `yr-status yr-${r.status}`, r.status.replace('_', ' ')),
        ` ${r.kind} ${r.ref} · ${r.base.slice(0, 7)}..${r.head.slice(0, 7)} · `,
        canWrite() ? `writing as ${r.author}` : 'read-only: open the URL yajna serve --review printed to write',
      );
      top.append(row, meta);
    }

    function layout() {
      files.hidden = !prefs.files;
    }

    function fileList() {
      files.replaceChildren();
      const item = (label: HTMLElement, shown: Shown | null, count: number, cls = '') => {
        const li = el('li', `${cls} ${sameShown(selected, shown) ? 'yr-on' : ''}`);
        li.append(label);
        if (count) li.append(el('span', 'yr-count', String(count)));
        li.addEventListener('click', () => {
          selected = shown;
          render();
        });
        files.append(li);
      };
      const unsettled = current.threads.filter((t) => t.state === 'open' || t.state === 'addressed').length;
      item(el('span', 'yr-label', 'Overview'), null, unsettled, 'yr-overview');
      for (const f of current.files) {
        const n = current.threads.filter((t) => t.anchor.path === f.path && t.state !== 'resolved').length;
        const label = el('span', 'yr-entry');
        label.append(el('span', `yr-fs yr-fs-${f.status}`, f.status), pathEl(f.path));
        if (f.old) label.title = `${f.old} → ${f.path}`;
        item(label, { path: f.path, work: false }, n);
      }
      if (current.unreviewed.length) {
        const head = el('li', 'yr-group', 'Not in the review yet');
        head.title = 'Committed after the review’s head, or not committed: commit, then yajna review update';
        files.append(head);
        for (const f of current.unreviewed) {
          const label = el('span', 'yr-entry');
          label.append(el('span', `yr-fs yr-fs-${f.status === '?' ? 'A' : f.status}`, f.status), pathEl(f.path));
          item(label, { path: f.path, work: true }, 0, 'yr-work');
        }
      }
    }

    function overview() {
      diff?.view.destroy();
      diff = undefined;
      main.replaceChildren();
      main.classList.remove('yr-split');
      const r = current;
      const sum = el('section', 'yr-summary');
      sum.append(el('h3', '', 'Summary'), el('div', 'yr-pre', r.summary || '(none yet)'));
      if (canWrite() && !['merged', 'closed'].includes(r.status)) {
        const verdicts: Action[] = [{ label: 'Request changes', action: 'request-changes', needsText: true }];
        if (!r.author.startsWith('agent:')) verdicts.unshift({ label: 'Approve', action: 'approve' });
        sum.append(form(writer, 'verdict', verdicts, 'A reason, or a word with the approval…'));
      }
      main.append(sum);
      for (const p of r.problems) main.append(el('div', 'yr-problem', p));
      const shown = el('section', 'yr-threads');
      const count = (s: string) => r.threads.filter((t) => t.state === s).length;
      const counts = ['open', 'addressed', 'outdated', 'resolved']
        .map((s) => [s, count(s)] as const)
        .filter(([, n]) => n)
        .map(([s, n]) => `${n} ${s}`)
        .join(' · ');
      shown.append(el('h3', '', `Threads${counts ? ` · ${counts}` : ''}`));
      if (!r.threads.length) shown.append(el('p', 'yr-muted', 'No threads yet. Select lines in a file to comment on them.'));
      // every thread, the general ones first, then by file in the order of the files
      const order = (t: Thread) => {
        if (!t.anchor.path) return -1;
        const i = r.files.findIndex((f) => f.path === t.anchor.path);
        return i < 0 ? r.files.length : i;
      };
      const sorted = [...r.threads].sort((a, b) => order(a) - order(b) || a.n - b.n);
      let group: string | undefined;
      for (const t of sorted) {
        const name = t.anchor.path ?? 'General';
        if (name !== group) {
          group = name;
          const h = el('h4', 'yr-group-head');
          if (t.anchor.path) {
            const p = t.anchor.path;
            const link = pathEl(p, 'yr-link');
            link.addEventListener('click', () => writer.openFile(p));
            h.append(link);
          } else h.textContent = name;
          shown.append(h);
        }
        shown.append(threadEl(t, writer, true));
      }
      if (canWrite()) shown.append(form(writer, 'general', [{ label: 'Comment', action: 'comment', needsText: true }], 'A comment on the whole review…'));
      main.append(shown);
    }

    function decorations(view: EditorView, path: string): DecorationSet {
      const r = current;
      const ranges: Range<Decoration>[] = [];
      for (const t of r.threads.filter((t) => t.anchor.path === path && atHead(t, r))) {
        const line = lineOf(t, view);
        if (line === null) continue;
        const widget = new BoxWidget(JSON.stringify(t) + canWrite(), () => threadEl(t, writer, false));
        ranges.push(Decoration.widget({ widget, block: true, side: 1 }).range(view.state.doc.line(line).to));
      }
      if (draft && draft.path === path && draft.b <= view.state.doc.lines) {
        const { a, b } = draft;
        const widget = new BoxWidget(`draft:${path}:${a}-${b}`, () => {
          const box = el('div', 'yr-thread yr-draft');
          box.append(el('div', 'yr-thread-head', `New thread on ${lines(a, b)}`));
          const cancel = el('button', '', 'Cancel');
          cancel.addEventListener('click', () => {
            draft = null;
            view.dispatch({ effects: setThreads.of(decorations(view, path)) });
          });
          const at = () => (a === b ? `${path}:${a}` : `${path}:${a}-${b}`);
          box.append(form(writer, inlineKey(path), [{ label: 'Comment', action: 'comment', needsText: true, at }], 'Your comment… (Ctrl-Enter sends)', [cancel]));
          requestAnimationFrame(() => box.querySelector('textarea')?.focus());
          return box;
        });
        ranges.push(Decoration.widget({ widget, block: true, side: 2 }).range(view.state.doc.line(b).to));
      }
      return Decoration.set(ranges, true);
    }

    /** The sticky box above the diff: comment on whatever lines are picked on the right. */
    function composer(path: string): HTMLElement {
      const box = el('div', 'yr-compose');
      const label = el('div', 'yr-picked');
      const show = () => {
        label.textContent = picked
          ? `On ${lines(picked.a, picked.b)}`
          : 'Select lines on the right, or click their numbers (shift-click for a range)';
      };
      show();
      const at = () => {
        if (!picked) {
          say('Pick the lines first: select them on the right, or click their numbers.');
          return null;
        }
        const { a, b } = picked;
        return a === b ? `${path}:${a}` : `${path}:${a}-${b}`;
      };
      const f = form(writer, `new:${path}`, [{ label: 'Comment', action: 'comment', needsText: true, at }], 'A comment on the picked lines… (Ctrl-Enter sends)');
      (f.querySelector('textarea') as HTMLTextAreaElement).rows = 1;
      box.append(label, f);
      (box as HTMLElement & { show?: () => void }).show = show;
      return box;
    }

    /** Show the selected file; `again` builds its diff afresh even when nothing changed. */
    async function file(again = false) {
      const r = current;
      const shown = selected;
      if (!shown) return;
      const f = (shown.work ? r.unreviewed : r.files).find((x) => x.path === shown.path)!;
      if (!again && diff && sameShown(diff.shown, shown) && diff.head === r.head && !shown.work) {
        // the same file at the same head: only the threads change
        const v = diff.view.b;
        v.dispatch({ effects: setThreads.of(decorations(v, f.path)) });
        afterDiff(f);
        return;
      }
      const sides = await reviews.file(id, f, shown.work);
      if (disposed || !sameShown(selected, shown)) return;
      if (!again && diff && sameShown(diff.shown, shown) && diff.sides.base === sides.base && diff.sides.head === sides.head) return;
      const keep = diff && sameShown(diff.shown, shown) ? (main.querySelector('.yr-scroll')?.scrollTop ?? 0) : 0;
      diff?.view.destroy();
      diff = undefined;
      picked = null;
      const lang = await language(f.path.slice(f.path.lastIndexOf('/') + 1)).catch(() => null);
      if (disposed || !sameShown(selected, shown)) return;
      const wrap = new Compartment();
      const ext = [diffLook, EditorState.readOnly.of(true), EditorView.editable.of(false), theme(), lang ?? [], wrap.of(prefs.wrap ? EditorView.lineWrapping : [])];
      const writable = canWrite() && !shown.work && f.status !== 'D';
      // the comment box stays above the part that scrolls
      main.replaceChildren();
      main.classList.add('yr-split');
      const scroll = el('div', 'yr-scroll');
      if (shown.work) {
        main.append(
          el(
            'p',
            'yr-muted yr-extras',
            `Not in the review: the head ${r.head.slice(0, 7)} against the working tree. Commit it and run yajna review update ${r.id} to comment on it.`,
          ),
        );
      }
      const compose = writable && prefs.composer ? composer(f.path) : null;
      if (compose) main.append(compose);
      const box = el('div', 'yr-diff');
      scroll.append(box, el('div', 'yr-extras'));
      main.append(scroll);
      const start = (a: number, b: number) => {
        draft = { path: f.path, a, b };
        view.b.dispatch({ effects: setThreads.of(decorations(view.b, f.path)) });
      };
      const right = writable
        ? [
            numberSelect(),
            drawSelection(),
            threadField,
            commentTooltip(start),
            EditorView.updateListener.of((u) => {
              if (!u.selectionSet) return;
              // a click picks its line, a selection its lines
              picked = selectedLines(u.state);
              (compose as (HTMLElement & { show?: () => void }) | null)?.show?.();
            }),
          ]
        : [lineNumbers(), threadField];
      const view = new MergeView({
        a: { doc: sides.base ?? '', extensions: [...ext, lineNumbers()] },
        b: { doc: sides.head ?? '', extensions: [...ext, ...right] },
        parent: box,
        collapseUnchanged: { margin: 4, minSize: 8 },
        gutter: true,
      });
      diff = { shown, head: r.head, sides, view, wrap };
      // threads anchor to the head; the working tree's lines are not theirs
      if (!shown.work) view.b.dispatch({ effects: setThreads.of(decorations(view.b, f.path)) });
      if (sides.head === null) box.before(el('p', 'yr-muted yr-extras', shown.work ? 'Deleted in the working tree.' : 'Deleted at the head: nothing to comment on here.'));
      afterDiff(f);
      if (goTo && goTo <= view.b.state.doc.lines) {
        const pos = view.b.state.doc.line(goTo).from;
        requestAnimationFrame(() => view.b.dispatch({ effects: EditorView.scrollIntoView(pos, { y: 'center' }) }));
      } else scroll.scrollTop = keep;
      goTo = undefined;
    }

    /** Below a diff: this file's threads at other commits, which have no lines here. */
    function afterDiff(f: ChangedFile) {
      const extras = main.querySelector('.yr-diff + .yr-extras');
      if (!extras) return;
      extras.replaceChildren();
      if (selected?.work) return;
      const elsewhere = current.threads.filter((t) => t.anchor.path === f.path && !atHead(t, current));
      if (elsewhere.length) extras.append(el('h3', '', 'Threads at other commits'));
      for (const t of elsewhere) extras.append(threadEl(t, writer, true));
    }

    function render() {
      header();
      layout();
      fileList();
      const list = selected?.work ? current.unreviewed : current.files;
      if (!selected || !list.some((x) => x.path === selected!.path)) {
        selected = null;
        overview();
      } else void file();
      ctx.onStatus();
    }

    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && prefs.focus && !(e.target instanceof HTMLTextAreaElement)) {
        prefs.focus = false;
        savePrefs(prefs);
        setFocus(false);
        header();
      }
    };
    document.addEventListener('keydown', escape);

    render();
    const timer = window.setInterval(async () => {
      if (busy) return;
      const next = await reviews.get(id).catch(() => null);
      if (!next || busy) return;
      const moved = JSON.stringify(next.unreviewed) !== JSON.stringify(current.unreviewed);
      if (next.version !== current.version || moved) {
        current = next;
        render();
      } else if (selected?.work) {
        // a file not in the review changes on disk without the list changing
        void file();
      }
    }, POLL);

    return {
      dispose() {
        disposed = true;
        window.clearInterval(timer);
        document.removeEventListener('keydown', escape);
        setFocus(false);
        diff?.view.destroy();
      },
      status: () => {
        const open = current.threads.filter((t) => t.state === 'open' || t.state === 'addressed').length;
        const later = current.unreviewed.length ? ` · ${current.unreviewed.length} files not in the review yet` : '';
        return `${current.status.replace('_', ' ')} · ${open} of ${current.threads.length} threads unsettled${later}`;
      },
    };
  },
};

register(reviewKind);
