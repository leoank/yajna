// Mermaid diagrams in rendered markdown: a ```mermaid block arrives as a code block and is
// drawn here in its place. Split off by the bundler and loaded only when a page has one.

import mermaid from 'mermaid';

let drawn = 0;

/** Draw each `code.language-mermaid` block, replacing its `<pre>`; one that does not parse
 * keeps its source with the error under it. `strict` keeps a diagram from running script
 * or carrying raw HTML, since the markdown may be a file a run wrote. */
export async function drawMermaid(blocks: HTMLElement[]): Promise<void> {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default',
  });
  for (const code of blocks) {
    const pre = code.closest('pre') ?? code;
    if (!pre.isConnected) continue;
    const id = `mermaid-${++drawn}`;
    try {
      const { svg } = await mermaid.render(id, code.textContent ?? '');
      const figure = document.createElement('div');
      figure.className = 'mermaid';
      figure.innerHTML = svg;
      pre.replaceWith(figure);
    } catch (e) {
      // mermaid leaves its scratch element behind when a diagram fails
      document.getElementById(`d${id}`)?.remove();
      document.getElementById(id)?.remove();
      const note = document.createElement('div');
      note.className = 'mermaid-error';
      note.textContent = `Mermaid could not draw this: ${e instanceof Error ? e.message : String(e)}`;
      pre.after(note);
    }
  }
}
