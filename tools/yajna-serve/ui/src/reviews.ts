// The reviews in the sidebar (docs/review.md 7.2): unfinished ones first, each opening a
// review tab; read again every few seconds, and hidden while there are none.

import { reviews, type ReviewSummary } from './api';

const EVERY = 5000;

export class ReviewList {
  readonly element = document.createElement('section');
  private list = document.createElement('ul');
  private shown = '';

  constructor(private open: (id: string) => void) {
    this.element.className = 'yr-side';
    this.element.hidden = true;
    const head = document.createElement('div');
    head.className = 'yr-side-head';
    head.textContent = 'Reviews';
    this.element.append(head, this.list);
    void this.load();
    window.setInterval(() => void this.load(), EVERY);
  }

  private async load() {
    const all = await reviews.list().catch(() => [] as ReviewSummary[]);
    const key = JSON.stringify(all);
    if (key === this.shown) return;
    this.shown = key;
    const unfinished = (r: ReviewSummary) => (r.status === 'open' || r.status === 'changes_requested' ? 0 : 1);
    all.sort((a, b) => unfinished(a) - unfinished(b) || b.id.localeCompare(a.id));
    this.list.replaceChildren();
    for (const r of all) {
      const li = document.createElement('li');
      li.className = `yr-side-item yr-${r.status}`;
      li.title = `${r.id}\n${r.kind} ${r.ref}\n${r.status}${r.elsewhere ? `\nin ${r.elsewhere}` : ''}`;
      const title = document.createElement('span');
      title.className = 'yr-label';
      title.textContent = r.title || r.id;
      const count = document.createElement('span');
      count.className = 'yr-count';
      count.textContent = r.open ? String(r.open) : r.status === 'open' ? '' : r.status.replace('_', ' ');
      li.append(title, count);
      li.addEventListener('click', () => this.open(r.id));
      this.list.append(li);
    }
    this.element.hidden = all.length === 0;
  }
}
