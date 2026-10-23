// Markdown, rendered on the server the way the site renders pages (links and citations
// resolved, raw HTML shown as text), with a toggle to the source.

import { api, dirname, join, rawUrl } from '../api';
import { register, toolbar, type Context, type Viewer } from './registry';

const SITE_PAGE = /^[\w@.-]+\.html(#.*)?$/;
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/** Point the rendered document's links and images where they belong in the viewer. */
function rewrite(body: HTMLElement, ctx: Context) {
  const dir = dirname(ctx.path);
  for (const a of body.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href') ?? '';
    if (href.startsWith('#')) continue;
    if (SCHEME.test(href)) {
      if (/^(https?|mailto):/i.test(href)) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
      } else a.removeAttribute('href');
      continue;
    }
    if (SITE_PAGE.test(href) && !href.includes('/')) {
      // a page of the notebook: the site renders it
      a.setAttribute('href', `/${href}`);
      a.setAttribute('target', '_blank');
      continue;
    }
    const target = join(dir, decodeURIComponent(href.split('#')[0]));
    if (target === null) {
      a.removeAttribute('href');
      continue;
    }
    a.setAttribute('href', `#${target}`);
    a.addEventListener('click', (e) => {
      e.preventDefault();
      ctx.open(target);
    });
  }
  for (const img of body.querySelectorAll('img[src]')) {
    const src = img.getAttribute('src') ?? '';
    if (SCHEME.test(src) || src.startsWith('/')) continue;
    const target = join(dir, decodeURIComponent(src));
    // a path that climbs out of its root cannot be served: show the alt text instead
    if (target === null) img.replaceWith(img.getAttribute('alt') ?? src);
    else img.setAttribute('src', rawUrl(target));
  }
}

register({
  name: 'markdown',
  score: (stat) => (stat.text && /\.(md|markdown)$/i.test(stat.path) && (stat.size ?? 0) <= 4 << 20 ? 3 : 0),
  async mount(el: HTMLElement, ctx: Context): Promise<Viewer> {
    const rendered = await api.render(ctx.path);
    const bar = toolbar(el, [['Source', () => ctx.switchTo('text')]]);
    if (rendered.id) {
      const a = document.createElement('a');
      a.href = `/${rendered.id}.html`;
      a.target = '_blank';
      a.textContent = `${rendered.id}${rendered.title ? ` · ${rendered.title}` : ''} → page`;
      bar.prepend(a);
    }
    const scroll = document.createElement('div');
    scroll.className = 'yv-scroll';
    const body = document.createElement('article');
    body.className = 'yv-markdown';
    body.innerHTML = rendered.html;
    rewrite(body, ctx);
    scroll.append(body);
    el.append(scroll);
    return { status: () => (rendered.id ? `page ${rendered.id}` : 'markdown') };
  },
});
