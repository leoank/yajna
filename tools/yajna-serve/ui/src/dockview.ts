// dockview-core through its UMD build, which carries the stylesheet; typed from the package.
import * as umd from 'dockview-core/dist/dockview-core.js';
import type * as Dockview from 'dockview-core';

export const dv = umd as unknown as typeof Dockview;
export type * from 'dockview-core';
