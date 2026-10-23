// Everything else: what the file is, a download link, and a look inside as text or hex.

import { raw, rawUrl, formatSize, formatTime, basename } from '../api';
import { register, toolbar, type Context, type Viewer } from './registry';

const HEX_BYTES = 64 << 10;

register({
  name: 'binary',
  score: () => 1,
  async mount(el: HTMLElement, ctx: Context): Promise<Viewer> {
    const bar = toolbar(el, [
      ['Open as text', () => ctx.switchTo('text')],
      ['Open as hex', () => ctx.switchTo('hex')],
    ]);
    const a = document.createElement('a');
    a.href = rawUrl(ctx.path);
    a.download = basename(ctx.path);
    a.textContent = 'Download';
    bar.append(a);
    const table = document.createElement('table');
    table.className = 'yv-meta';
    const rows: [string, string][] = [
      ['path', ctx.path],
      ['size', `${formatSize(ctx.stat.size)} (${ctx.stat.size ?? 0} bytes)`],
      ['modified', formatTime(ctx.stat.mtime)],
      ['type', ctx.stat.mime],
    ];
    if (ctx.stat.link) rows.push(['symlink to', ctx.stat.link]);
    for (const [k, v] of rows) {
      const tr = table.insertRow();
      tr.insertCell().textContent = k;
      tr.insertCell().textContent = v;
    }
    el.append(table);
    return { status: () => ctx.stat.mime };
  },
});

register({
  name: 'hex',
  score: () => 0,
  async mount(el: HTMLElement, ctx: Context): Promise<Viewer> {
    const bytes = new Uint8Array(await raw(ctx.path, HEX_BYTES));
    const lines: string[] = [];
    for (let off = 0; off < bytes.length; off += 16) {
      const row = bytes.subarray(off, off + 16);
      const hex = Array.from(row, (b) => b.toString(16).padStart(2, '0')).join(' ');
      const text = Array.from(row, (b) => (b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : '.')).join('');
      lines.push(`${off.toString(16).padStart(8, '0')}  ${hex.padEnd(47)}  ${text}`);
    }
    toolbar(el, [['Back', () => ctx.switchTo('binary')]]);
    const pre = document.createElement('pre');
    pre.className = 'yv-hex';
    pre.textContent = lines.join('\n');
    el.append(pre);
    const shown = bytes.length < (ctx.stat.size ?? 0) ? ` (first ${formatSize(bytes.length)})` : '';
    return { status: () => `hex${shown}` };
  },
});
