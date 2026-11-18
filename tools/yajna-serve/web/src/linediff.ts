// A line diff (Myers' O(ND) algorithm) of two texts, grouped into hunks with context, for
// the review's file view: the review API gives the file at base and head, not a diff.

export interface DLine {
  op: ' ' | '+' | '-';
  /** 1-based line numbers on each side, where the line is on that side */
  a?: number;
  b?: number;
  text: string;
}

export interface DHunk {
  lines: DLine[];
}

function myers(a: string[], b: string[]): DLine[] {
  const n = a.length;
  const m = b.length;
  const max = n + m;
  const v = new Int32Array(2 * max + 2);
  const trace: Int32Array[] = [];
  let found = false;
  for (let d = 0; d <= max && !found; d++) {
    trace.push(v.slice());
    for (let k = -d; k <= d; k += 2) {
      let x = k === -d || (k !== d && v[max + k - 1] < v[max + k + 1]) ? v[max + k + 1] : v[max + k - 1] + 1;
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }
      v[max + k] = x;
      if (x >= n && y >= m) {
        found = true;
        break;
      }
    }
  }
  // walk back through the snapshots to the edit script
  const out: DLine[] = [];
  let x = n;
  let y = m;
  for (let d = trace.length - 1; d >= 0; d--) {
    const vd = trace[d];
    const k = x - y;
    const prevK = k === -d || (k !== d && vd[max + k - 1] < vd[max + k + 1]) ? k + 1 : k - 1;
    const px = vd[max + prevK];
    const py = px - prevK;
    while (x > px && y > py) {
      out.push({ op: ' ', a: x, b: y, text: a[x - 1] });
      x--;
      y--;
    }
    if (d > 0) {
      if (x === px) out.push({ op: '+', b: y, text: b[--y] });
      else out.push({ op: '-', a: x, text: a[--x] });
    }
  }
  return out.reverse();
}

const split = (s: string) => (s === '' ? [] : s.replace(/\n$/, '').split('\n'));

/** The diff of `base` to `head` as hunks with `context` unchanged lines around changes; a
 * file that is all new or all gone is one hunk. Very large files are compared whole-or-not. */
export function hunks(base: string | null, head: string | null, context = 3): DHunk[] {
  const a = split(base ?? '');
  const b = split(head ?? '');
  let all: DLine[];
  if (a.length * b.length > 25e6) {
    all = [...a.map((t, i) => ({ op: '-' as const, a: i + 1, text: t })), ...b.map((t, i) => ({ op: '+' as const, b: i + 1, text: t }))];
  } else {
    all = myers(a, b);
  }
  const keep = all.map(() => false);
  all.forEach((l, i) => {
    if (l.op !== ' ') for (let j = Math.max(0, i - context); j <= Math.min(all.length - 1, i + context); j++) keep[j] = true;
  });
  const out: DHunk[] = [];
  let cur: DLine[] | null = null;
  all.forEach((l, i) => {
    if (keep[i]) {
      if (!cur) out.push({ lines: (cur = []) });
      cur.push(l);
    } else cur = null;
  });
  return out;
}

/** Every line of `head`, unchanged: for a file with threads but no changes to show. */
export function whole(head: string | null): DHunk[] {
  const b = split(head ?? '');
  return b.length ? [{ lines: b.map((t, i) => ({ op: ' ' as const, a: i + 1, b: i + 1, text: t })) }] : [];
}
