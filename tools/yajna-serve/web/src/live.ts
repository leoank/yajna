// Live updates (docs/files-viewer.md 5.5): an event stream naming what is open, so a file
// that grows or a directory that changes shows it without a reload. The server watches,
// or polls on network disks, and sends each path's state again when the stream reconnects.

import { useEffect, useState } from 'react';
import { base } from './base';

export interface Change {
  path: string;
  kind: 'file' | 'dir';
  exists: boolean;
  size?: number;
  mtime?: number;
}

export type LiveState = 'live' | 'connecting' | 'off';

/** Follow `paths`; `onChange` hears each change. */
export function useLive(paths: string[], onChange: (c: Change) => void): LiveState {
  const [state, setState] = useState<LiveState>('connecting');
  const key = paths.join('\n');
  useEffect(() => {
    if (!paths.length) return setState('off');
    const query = paths.map((p) => `watch=${encodeURIComponent(p)}`).join('&');
    const es = new EventSource(`${base}/api/events?${query}`);
    setState('connecting');
    es.addEventListener('open', () => setState('live'));
    es.addEventListener('error', () => setState('connecting'));
    es.addEventListener('change', (e) => onChange(JSON.parse((e as MessageEvent).data) as Change));
    return () => es.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state;
}
