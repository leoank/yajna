// Images the browser can draw, with wheel and pinch zoom, fit and 1:1. SVG is shown as an
// image, never inline, so its scripts do not run.

import Panzoom from '@panzoom/panzoom';
import { rawUrl } from '../api';
import { register, toolbar, type Context, type Viewer } from './registry';

const DRAWABLE = /^image\/(png|jpeg|gif|webp|avif|bmp|x-icon|svg\+xml)$/;

register({
  name: 'image',
  score: (stat) => (DRAWABLE.test(stat.mime) ? 3 : 0),
  async mount(el: HTMLElement, ctx: Context): Promise<Viewer> {
    const stage = document.createElement('div');
    stage.className = 'yv-image';
    const img = document.createElement('img');
    img.alt = ctx.path;
    img.src = `${rawUrl(ctx.path)}&t=${ctx.stat.mtime ?? 0}`;
    stage.append(img);
    const bar = toolbar(el, []);
    el.append(stage);
    await img.decode().catch(() => undefined);
    // panzoom measures the element, so it has to be in the page first
    const pz = Panzoom(img, { maxScale: 40, minScale: 0.05, step: 0.15 });
    stage.addEventListener('wheel', (e) => {
      pz.zoomWithWheel(e);
      ctx.onStatus();
    });
    for (const [label, action] of [
      ['Fit', () => pz.reset()],
      ['1:1', () => pz.zoom(img.naturalWidth / Math.max(1, img.clientWidth))],
    ] as [string, () => void][]) {
      const b = document.createElement('button');
      b.textContent = label;
      b.addEventListener('click', () => (action(), ctx.onStatus()));
      bar.append(b);
    }
    return {
      dispose: () => pz.destroy(),
      status: () =>
        `${img.naturalWidth}×${img.naturalHeight} · ${Math.round((pz.getScale() * img.clientWidth * 100) / Math.max(1, img.naturalWidth))}%`,
    };
  },
});
