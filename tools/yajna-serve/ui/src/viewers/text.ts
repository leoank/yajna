// Text and code: a read-only CodeMirror, highlighted by extension, with search, folding and
// line links. Files above the cap open as their first part until the paged view exists
// (docs/files-viewer.md 6.3, step 5).

import { EditorState, Compartment, type Extension } from '@codemirror/state';
import {
  EditorView,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  keymap,
} from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  bracketMatching,
  StreamLanguage,
  type StreamParser,
} from '@codemirror/language';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { oneDark } from '@codemirror/theme-one-dark';
import { raw, formatSize, basename } from '../api';
import { register, toolbar, message, type Context, type Viewer } from './registry';

/** Above this a file opens as its first part only. */
export const CAP = 20 << 20;
const HEAD = 256 << 10;

type Lang = Promise<Extension | null>;
const legacy = (load: () => Promise<StreamParser<unknown>>): Lang => load().then((m) => StreamLanguage.define(m));

/** The language of a file, loaded when first needed so the bundle stays small. */
function language(name: string): Lang {
  const lower = name.toLowerCase();
  if (lower === 'dockerfile') return legacy(() => import('@codemirror/legacy-modes/mode/dockerfile').then((m) => m.dockerFile));
  if (lower === 'makefile' || lower === 'justfile') return legacy(() => import('@codemirror/legacy-modes/mode/shell').then((m) => m.shell));
  const ext = lower.includes('.') ? lower.slice(lower.lastIndexOf('.') + 1) : '';
  switch (ext) {
    case 'js': case 'mjs': case 'cjs': return import('@codemirror/lang-javascript').then((m) => m.javascript());
    case 'jsx': return import('@codemirror/lang-javascript').then((m) => m.javascript({ jsx: true }));
    case 'ts': case 'mts': return import('@codemirror/lang-javascript').then((m) => m.javascript({ typescript: true }));
    case 'tsx': return import('@codemirror/lang-javascript').then((m) => m.javascript({ typescript: true, jsx: true }));
    case 'py': case 'pyi': return import('@codemirror/lang-python').then((m) => m.python());
    case 'rs': return import('@codemirror/lang-rust').then((m) => m.rust());
    case 'md': case 'markdown': return import('@codemirror/lang-markdown').then((m) => m.markdown());
    case 'json': case 'jsonl': case 'ipynb': case 'geojson': return import('@codemirror/lang-json').then((m) => m.json());
    case 'html': case 'htm': return import('@codemirror/lang-html').then((m) => m.html());
    case 'css': return import('@codemirror/lang-css').then((m) => m.css());
    case 'yaml': case 'yml': return import('@codemirror/lang-yaml').then((m) => m.yaml());
    case 'xml': case 'svg': case 'kml': return import('@codemirror/lang-xml').then((m) => m.xml());
    case 'sql': return import('@codemirror/lang-sql').then((m) => m.sql());
    case 'c': case 'h': case 'cc': case 'cpp': case 'cxx': case 'hpp': case 'cu': case 'ino': return import('@codemirror/lang-cpp').then((m) => m.cpp());
    case 'java': case 'kt': case 'kts': return import('@codemirror/lang-java').then((m) => m.java());
    case 'go': return import('@codemirror/lang-go').then((m) => m.go());
    case 'sh': case 'bash': case 'zsh': case 'envrc': return legacy(() => import('@codemirror/legacy-modes/mode/shell').then((m) => m.shell));
    case 'toml': case 'lock': return legacy(() => import('@codemirror/legacy-modes/mode/toml').then((m) => m.toml));
    case 'r': return legacy(() => import('@codemirror/legacy-modes/mode/r').then((m) => m.r));
    case 'jl': return legacy(() => import('@codemirror/legacy-modes/mode/julia').then((m) => m.julia));
    case 'diff': case 'patch': return legacy(() => import('@codemirror/legacy-modes/mode/diff').then((m) => m.diff));
    case 'ini': case 'cfg': case 'conf': case 'properties': return legacy(() => import('@codemirror/legacy-modes/mode/properties').then((m) => m.properties));
    default: return Promise.resolve(null);
  }
}

const dark = window.matchMedia('(prefers-color-scheme: dark)');
const theme = (): Extension => (dark.matches ? oneDark : syntaxHighlighting(defaultHighlightStyle, { fallback: true }));

export const textKind = {
  name: 'text',
  score: (stat: { text: boolean }) => (stat.text ? 2 : 0),
  async mount(el: HTMLElement, ctx: Context): Promise<Viewer> {
    const size = ctx.stat.size ?? 0;
    const partial = size > CAP;
    const bytes = await raw(ctx.path, partial ? HEAD : undefined);
    const doc = new TextDecoder().decode(bytes);
    const name = basename(ctx.path);
    if (/\.(md|markdown)$/i.test(name)) toolbar(el, [['Preview', () => ctx.switchTo('markdown')]]);
    if (partial) {
      message(el, `Showing the first ${formatSize(HEAD)} of ${formatSize(size)}; larger files get a paged view later.`);
    }
    const themes = new Compartment();
    const lang = await language(name).catch(() => null);
    let cursor = 'Ln 1, Col 1';
    const view = new EditorView({
      parent: el,
      state: EditorState.create({
        doc,
        extensions: [
          EditorState.readOnly.of(true),
          lineNumbers({
            domEventHandlers: {
              mousedown(v, block, event) {
                const line = v.state.doc.lineAt(block.from).number;
                const anchor = (event as MouseEvent).shiftKey ? v.state.doc.lineAt(v.state.selection.main.anchor).number : line;
                select(v, Math.min(anchor, line), Math.max(anchor, line));
                return true;
              },
            },
          }),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          foldGutter(),
          drawSelection(),
          highlightActiveLine(),
          bracketMatching(),
          highlightSelectionMatches(),
          themes.of(theme()),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          lang ?? [],
          keymap.of([...defaultKeymap, ...searchKeymap, ...foldKeymap]),
          EditorView.updateListener.of((u) => {
            if (!u.selectionSet) return;
            const head = u.state.selection.main.head;
            const line = u.state.doc.lineAt(head);
            cursor = `Ln ${line.number}, Col ${head - line.from + 1}`;
            ctx.onStatus();
          }),
          EditorView.theme({ '&': { height: '100%' }, '.cm-scroller': { overflow: 'auto' } }),
        ],
      }),
    });
    function select(v: EditorView, from: number, to: number) {
      const doc = v.state.doc;
      const a = doc.line(Math.max(1, Math.min(from, doc.lines)));
      const b = doc.line(Math.max(1, Math.min(to, doc.lines)));
      v.dispatch({ selection: { anchor: a.from, head: b.to }, scrollIntoView: true });
      ctx.onLines(a.number, b.number);
    }
    const onTheme = () => view.dispatch({ effects: themes.reconfigure(theme()) });
    dark.addEventListener('change', onTheme);
    return {
      dispose() {
        dark.removeEventListener('change', onTheme);
        view.destroy();
      },
      status: () => `${cursor} · ${view.state.doc.lines} lines${partial ? ' (first part)' : ''}`,
      reveal(from, to = from) {
        const doc = view.state.doc;
        const a = doc.line(Math.max(1, Math.min(from, doc.lines)));
        const b = doc.line(Math.max(1, Math.min(to, doc.lines)));
        view.dispatch({
          selection: { anchor: a.from, head: b.to },
          effects: EditorView.scrollIntoView(a.from, { y: 'center' }),
        });
      },
    };
  },
};

register(textKind);
