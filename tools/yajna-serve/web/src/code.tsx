// A read-only code view (CodeMirror 6, ADR-0029), loaded only when a file is opened.

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

export default function Code({ url, path }: { url: string; path: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState<string | null>(null);
  useEffect(() => {
    let view: EditorView | undefined;
    let gone = false;
    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        const text = await res.text();
        const lang = await language(path);
        if (gone || !host.current) return;
        const isDark = matchMedia('(prefers-color-scheme: dark)').matches;
        view = new EditorView({
          parent: host.current,
          state: EditorState.create({
            doc: text,
            extensions: [lineNumbers(), highlightActiveLineGutter(), EditorState.readOnly.of(true), EditorView.editable.of(false), EditorView.lineWrapping, theme, syntaxHighlighting(isDark ? dark : defaultHighlightStyle), ...lang],
          }),
        });
      } catch (e) {
        setFailed((e as Error).message);
      }
    })();
    return () => {
      gone = true;
      view?.destroy();
    };
  }, [url, path]);
  if (failed) return <div className="error" style={{ margin: 12 }}>Couldn’t load the file: {failed}</div>;
  return <div ref={host} />;
}
