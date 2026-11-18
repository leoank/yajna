// A read-only code view (CodeMirror 6, ADR-0029), loaded only when a file is opened. When
// the file grows on disk only the new bytes are fetched and appended (a run's log), and a
// log follows its end while the page is scrolled to it; a file rewritten is read again.

import { useEffect, useRef, useState } from 'react';
import { EditorState, type Extension } from '@codemirror/state';
import { EditorView, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import { syntaxHighlighting, defaultHighlightStyle, HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

async function language(path: string): Promise<Extension[]> {
  const ext = path.slice(path.lastIndexOf('.') + 1).toLowerCase();
  switch (ext) {
    case 'py':
      return [(await import('@codemirror/lang-python')).python()];
    case 'rs':
      return [(await import('@codemirror/lang-rust')).rust()];
    case 'js':
    case 'mjs':
    case 'ts':
    case 'tsx':
    case 'jsx':
      return [(await import('@codemirror/lang-javascript')).javascript({ typescript: ext.startsWith('t'), jsx: ext.endsWith('x') })];
    case 'json':
      return [(await import('@codemirror/lang-json')).json()];
    case 'yaml':
    case 'yml':
      return [(await import('@codemirror/lang-yaml')).yaml()];
    case 'md':
      return [(await import('@codemirror/lang-markdown')).markdown()];
    default:
      return [];
  }
}

const dark = HighlightStyle.define([
  { tag: t.keyword, color: '#c792ea' },
  { tag: [t.string, t.special(t.string)], color: '#a5d6a7' },
  { tag: [t.number, t.bool], color: '#f78c6c' },
  { tag: t.comment, color: '#75757f', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.definition(t.variableName)], color: '#82aaff' },
  { tag: t.typeName, color: '#ffcb6b' },
]);

const theme = EditorView.theme({
  '&': { fontSize: '12.5px', backgroundColor: 'transparent', color: 'var(--text)' },
  '.cm-content': { fontFamily: 'var(--mono)', padding: '10px 0' },
  '.cm-gutters': { backgroundColor: 'transparent', color: 'var(--text-3)', border: 'none' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent' },
  '&.cm-focused': { outline: 'none' },
});

const atPageEnd = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
const toPageEnd = () => window.scrollTo({ top: document.documentElement.scrollHeight });

export default function Code({ url, path, size, mtime, follow, start = 0 }: { url: string; path: string; size: number; mtime: number; follow: boolean; start?: number }) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | undefined>(undefined);
  /** bytes shown, and what decodes them across appends */
  const loaded = useRef(0);
  const decoder = useRef(new TextDecoder());
  const [failed, setFailed] = useState<string | null>(null);

  // the file, read whole: when opened, and when it shrank or was rewritten
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    let gone = false;
    (async () => {
      try {
        // a large file from `start` on: its tail
        const res = await fetch(url, start > 0 ? { headers: { Range: `bytes=${start}-` } } : undefined);
        if (!res.ok) throw new Error(res.statusText);
        let bytes = new Uint8Array(await res.arrayBuffer());
        if (start > 0) {
          // from the first whole line
          const nl = bytes.indexOf(10);
          if (nl >= 0) bytes = bytes.subarray(nl + 1);
        }
        const lang = await language(path);
        if (gone || !host.current) return;
        decoder.current = new TextDecoder();
        const text = decoder.current.decode(bytes, { stream: true });
        loaded.current = start > 0 ? size : bytes.length;
        view.current?.destroy();
        const isDark = matchMedia('(prefers-color-scheme: dark)').matches;
        view.current = new EditorView({
          parent: host.current,
          state: EditorState.create({
            doc: text,
            // a tail's line numbers would count from where it starts, not the file's start
            extensions: [...(start > 0 ? [] : [lineNumbers(), highlightActiveLineGutter()]), EditorState.readOnly.of(true), EditorView.editable.of(false), EditorView.lineWrapping, theme, syntaxHighlighting(isDark ? dark : defaultHighlightStyle), ...lang],
          }),
        });
        // a log opens at its end
        if (follow) requestAnimationFrame(toPageEnd);
      } catch (e) {
        setFailed((e as Error).message);
      }
    })();
    return () => {
      gone = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, path, generation, follow, start]);
  useEffect(() => () => view.current?.destroy(), []);

  // the file changed on disk: grown, append what is new; else read it again
  const lastMtime = useRef(mtime);
  useEffect(() => {
    const v = view.current;
    if (!v || mtime === lastMtime.current) return;
    lastMtime.current = mtime;
    if (size < loaded.current) return setGeneration((g) => g + 1);
    if (size === loaded.current) return setGeneration((g) => g + 1);
    const stick = atPageEnd();
    const from = loaded.current;
    (async () => {
      const res = await fetch(url, { headers: { Range: `bytes=${from}-${size - 1}` } });
      if (res.status !== 206) return setGeneration((g) => g + 1);
      const more = new Uint8Array(await res.arrayBuffer());
      if (loaded.current !== from) return;
      loaded.current = from + more.length;
      v.dispatch({ changes: { from: v.state.doc.length, insert: decoder.current.decode(more, { stream: true }) } });
      // kept at the end when it was there before the new lines came
      if (stick) requestAnimationFrame(toPageEnd);
    })().catch(() => setGeneration((g) => g + 1));
  }, [size, mtime, url, follow]);

  if (failed) return <div className="error" style={{ margin: 12 }}>Couldn’t load the file: {failed}</div>;
  return <div ref={host} />;
}
