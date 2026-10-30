// Images the browser can draw, with wheel and pinch zoom about the pointer, drag to pan,
// fit and 1:1. The image never leaves the view: smaller than it, it is centred; larger, its
// edges cannot come inside. SVG is shown as an image, never inline, so its scripts do not
// run.

import { rawUrl } from '../api';
import { register, toolbar, type Context, type Viewer } from './registry';

const DRAWABLE = /^image\/(png|jpeg|gif|webp|avif|bmp|x-icon|svg\+xml)$/;
const MAX = 40;

register({
  name: 'image',
  score: (stat) => (DRAWABLE.test(stat.mime) ? 3 : 0),
  async mount(el: HTMLElement, ctx: Context): Promise<Viewer> {
    const stage = document.createElement('div');
    stage.className = 'yv-image';
    const img = document.createElement('img');
    img.alt = ctx.path;
    img.draggable = false;
    img.src = `${rawUrl(ctx.path)}&t=${ctx.stat.mtime ?? 0}`;
    stage.append(img);
    const bar = toolbar(el, []);
    el.append(stage);
    await img.decode().catch(() => undefined);

    // the image at its natural size, moved by (x, y) and scaled by s from its top left
    let s = 1;
    let x = 0;
    let y = 0;
    /** whether the view is at Fit, so a resize fits again */
    let fitted = true;
    const size = () => ({ w: stage.clientWidth, h: stage.clientHeight, nw: img.naturalWidth || 1, nh: img.naturalHeight || 1 });
    const fitScale = () => {
      const { w, h, nw, nh } = size();
      return Math.min(1, w / nw, h / nh);
    };

    /** Keep the image in view, then draw it. */
    function apply() {
      const { w, h, nw, nh } = size();
      const sw = nw * s;
      const sh = nh * s;
      x = sw <= w ? (w - sw) / 2 : Math.min(0, Math.max(w - sw, x));
      y = sh <= h ? (h - sh) / 2 : Math.min(0, Math.max(h - sh, y));
      img.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
      ctx.onStatus();
    }

    /** Scale to `next`, keeping the point (cx, cy) of the stage where it is. */
    function zoomTo(next: number, cx: number, cy: number) {
      const clamped = Math.min(MAX, Math.max(fitScale() / 4, next));
      x = cx - ((cx - x) * clamped) / s;
      y = cy - ((cy - y) * clamped) / s;
      s = clamped;
      fitted = false;
      apply();
    }

    function fit() {
      s = fitScale();
      fitted = true;
      apply();
    }

    const local = (e: { clientX: number; clientY: number }) => {
      const r = stage.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };

    // a wheel notch or a trackpad pinch (ctrl + wheel) zooms by how far it moved, not by a
    // step per event: a trackpad sends dozens of small events per gesture
    stage.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? stage.clientHeight : 1;
        const factor = Math.exp(-e.deltaY * unit * (e.ctrlKey ? 0.01 : 0.002));
        const [cx, cy] = local(e);
        zoomTo(s * factor, cx, cy);
      },
      { passive: false },
    );

    // one pointer drags, two pinch
    const pointers = new Map<number, { x: number; y: number }>();
    let pinch: { d: number; s: number } | null = null;
    const spread = () => {
      const [a, b] = [...pointers.values()];
      return { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
    };
    stage.addEventListener('pointerdown', (e) => {
      stage.setPointerCapture(e.pointerId);
      const [px, py] = local(e);
      pointers.set(e.pointerId, { x: px, y: py });
      if (pointers.size === 2) pinch = { d: spread().d || 1, s };
      stage.classList.add('yv-dragging');
    });
    stage.addEventListener('pointermove', (e) => {
      const was = pointers.get(e.pointerId);
      if (!was) return;
      const [px, py] = local(e);
      pointers.set(e.pointerId, { x: px, y: py });
      if (pinch && pointers.size === 2) {
        const { d, mx, my } = spread();
        zoomTo((pinch.s * d) / pinch.d, mx, my);
      } else if (pointers.size === 1) {
        x += px - was.x;
        y += py - was.y;
        apply();
      }
    });
    const up = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (!pointers.size) stage.classList.remove('yv-dragging');
    };
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);
    // double-click: 1:1 at the pointer, or back to Fit
    stage.addEventListener('dblclick', (e) => {
      const [cx, cy] = local(e);
      if (fitted && fitScale() < 1) zoomTo(1, cx, cy);
      else fit();
    });

    const resize = new ResizeObserver(() => (fitted ? fit() : apply()));
    resize.observe(stage);

    for (const [label, action] of [
      ['Fit', fit],
      ['1:1', () => zoomTo(1, stage.clientWidth / 2, stage.clientHeight / 2)],
    ] as [string, () => void][]) {
      const b = document.createElement('button');
      b.textContent = label;
      b.addEventListener('click', action);
      bar.append(b);
    }
    fit();

    return {
      dispose: () => resize.disconnect(),
      // a plot a run rewrites: the new image, at the same zoom unless its size changed
      async follow(next) {
        const [w, h] = [img.naturalWidth, img.naturalHeight];
        img.src = `${rawUrl(ctx.path)}&t=${next.mtime ?? Date.now()}`;
        await img.decode().catch(() => undefined);
        if (fitted || w !== img.naturalWidth || h !== img.naturalHeight) fit();
        else apply();
        return true;
      },
      status: () => `${img.naturalWidth}×${img.naturalHeight} · ${Math.round(s * 100)}%`,
    };
  },
});
