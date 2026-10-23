import{A as Nn,B as ce,C as cs,D as hs,E as us,F as ps,G as vs,H as Vn,I as gs,J as ms,K as bs,L as fs,M as _s,N as ki,X as Y,a as Rn,b as Ke,ba as Ci,c as es,d as ts,e as is,fa as ws,g as ns,ga as Gi,h as os,ha as Ut,i as j,ia as Wn,j as Ft,ja as Hn,k as $n,l as rs,m as ss,n as as,o as vt,q as De,r as Bt,ra as ys,s as Di,sa as xs,ta as Ds,u as ds,ua as Yt,v as Si,va as Fn,w as ze,wa as Ss,y as Se,ya as gt,z as ls,za as ks}from"./chunks/chunk-4XSLZSQW.js";import{a as pc,b as vc}from"./chunks/chunk-Y6SLVHK3.js";var Va=pc((en,Na)=>{(function(r,s){typeof en=="object"&&typeof Na<"u"?s(en):typeof define=="function"&&define.amd?define(["exports"],s):(r=typeof globalThis<"u"?globalThis:r||self,s(r["dockview-core"]={}))})(en,function(r){if(Object.defineProperties(r,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),typeof document<"u"){let e=document.createElement("style");e.textContent=`.dv-drop-target-container {
  position: absolute;
  z-index: 9999;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  pointer-events: none;
  overflow: hidden;
  --dv-transition-duration: 300ms;
}
.dv-drop-target-container .dv-drop-target-anchor {
  position: relative;
  border: var(--dv-drag-over-border);
  background-color: var(--dv-drag-over-background-color);
  opacity: 1;
  /* GPU optimizations */
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  contain: layout paint;
  transition: opacity var(--dv-transition-duration) ease-in, top var(--dv-transition-duration) ease-out, left var(--dv-transition-duration) ease-out, width var(--dv-transition-duration) ease-out, height var(--dv-transition-duration) ease-out;
}
.dv-drop-target {
  position: relative;
  --dv-transition-duration: 70ms;
}
.dv-drop-target > .dv-drop-target-dropzone {
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  width: 100%;
  z-index: 1000;
  pointer-events: none;
}
.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  border: var(--dv-drag-over-border);
  background-color: var(--dv-drag-over-background-color);
  transition: top var(--dv-transition-duration) ease-out, left var(--dv-transition-duration) ease-out, width var(--dv-transition-duration) ease-out, height var(--dv-transition-duration) ease-out, opacity var(--dv-transition-duration) ease-out;
  will-change: transform;
  pointer-events: none;
}
.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection.dv-drop-target-top.dv-drop-target-small-vertical {
  border-top: 1px solid var(--dv-drag-over-border-color);
}
.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection.dv-drop-target-bottom.dv-drop-target-small-vertical {
  border-bottom: 1px solid var(--dv-drag-over-border-color);
}
.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection.dv-drop-target-left.dv-drop-target-small-horizontal {
  border-left: 1px solid var(--dv-drag-over-border-color);
}
.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection.dv-drop-target-right.dv-drop-target-small-horizontal {
  border-right: 1px solid var(--dv-drag-over-border-color);
}

.dv-dnd-compass {
  z-index: 1001;
}

.dv-dnd-compass-cell {
  box-sizing: border-box;
  border-radius: 2px;
  border: 1px solid var(--dv-dnd-compass-color, #1f9cf0);
  background-color: var(--dv-dnd-compass-cell-color, rgba(31, 156, 240, 0.25));
}

.dv-dnd-compass-cell-edge {
  border-style: dashed;
  background-color: var(--dv-dnd-compass-edge-cell-color, rgba(31, 156, 240, 0.12));
}

.dv-dnd-compass-cell-active {
  background-color: var(--dv-dnd-compass-active-cell-color, rgba(31, 156, 240, 0.5));
  border-style: solid;
}

.dv-dnd-compass-edge-preview {
  z-index: 1000;
  box-sizing: border-box;
  background-color: var(--dv-drag-over-background-color);
  border: var(--dv-drag-over-border);
}
.dv-dragged {
  transform: translate3d(0px, 0px, 0px); /* forces tab to be drawn on a separate layer (see https://github.com/microsoft/vscode/issues/18733) */
}

/* Applied to the ghost tab clone during drag so it shows the same border as a focused tab */
.dv-tab-ghost-drag {
  position: relative;
}
.dv-tab-ghost-drag::after {
  position: absolute;
  content: "";
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
  pointer-events: none;
  outline: 1px solid var(--dv-tab-divider-color) !important;
  outline-offset: -1px;
  z-index: 5;
}

.dv-tab {
  flex-shrink: 0;
}
.dv-tab:focus-visible, .dv-tab:has(:focus-visible) {
  position: relative;
}
.dv-tab:focus-visible::after, .dv-tab:has(:focus-visible)::after {
  position: absolute;
  content: "";
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
  pointer-events: none;
  outline: 1px solid var(--dv-tab-divider-color) !important;
  outline-offset: -1px;
  z-index: 5;
}
.dv-tab.dv-tab-dragging .dv-default-tab-action {
  background-color: var(--dv-activegroup-visiblepanel-tab-color);
}
.dv-tab.dv-active-tab .dv-default-tab .dv-default-tab-action {
  visibility: visible;
}
.dv-tab.dv-inactive-tab .dv-default-tab .dv-default-tab-action {
  visibility: hidden;
}
.dv-tab.dv-inactive-tab .dv-default-tab:hover .dv-default-tab-action {
  visibility: visible;
}
@media (hover: none) {
  .dv-tab.dv-inactive-tab .dv-default-tab .dv-default-tab-action {
    visibility: visible;
  }
}
.dv-tab .dv-default-tab {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dv-tab .dv-default-tab .dv-default-tab-content {
  flex-grow: 1;
  margin-right: 4px;
}
.dv-tab .dv-default-tab .dv-default-tab-action {
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.dv-tab .dv-default-tab .dv-default-tab-action:hover {
  border-radius: 2px;
  background-color: var(--dv-icon-hover-background-color);
}
@media (pointer: coarse) {
  .dv-tab .dv-default-tab .dv-default-tab-action {
    padding: 8px;
  }
}
.dv-tabs-overflow-dropdown-default {
  height: 100%;
  box-sizing: border-box;
  color: var(--dv-activegroup-hiddenpanel-tab-color);
  margin: var(--dv-tab-margin);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}
.dv-tabs-overflow-dropdown-default > span {
  padding-left: 0.25rem;
}
.dv-tabs-overflow-dropdown-default > svg {
  transform: rotate(90deg);
}
.dv-tabs-overflow-dropdown-default:hover {
  border-radius: 2px;
  background-color: var(--dv-icon-hover-background-color);
}
.dv-tabs-container {
  display: flex;
  position: relative;
  height: 100%;
  overflow: auto;
  scrollbar-width: thin;
  /**
   * Multi-row (wrapping) tabs. Inert until the \`MultiRowTabsModule\` toggles
   * \`.dv-tabs-container--wrap\` on this element (\`overflow.mode: 'wrap'\`):
   * tabs wrap onto multiple rows instead of clipping into the dropdown, and
   * the strip grows to fit (the header grows via the \`:has()\` rule in
   * tabsContainer.scss; the free header-aware content-sizing seam then shrinks
   * the content area to match). Restricted to horizontal headers in v1.
   */
}
.dv-tabs-container.dv-tabs-container--wrap:not(.dv-tabs-container-vertical) {
  flex-wrap: wrap;
  height: auto;
  overflow: visible;
  align-content: flex-start;
}
.dv-tabs-container.dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab {
  height: var(--dv-tabs-and-actions-container-height);
}
.dv-tabs-container.dv-tabs-container--wrap:not(.dv-tabs-container-vertical).dv-tabs-container--wrap-capped {
  max-height: calc(var(--dv-tabs-and-actions-container-height) * var(--dv-max-tab-rows));
  overflow: hidden;
}
.dv-tabs-container.dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab--reorder-before::after,
.dv-tabs-container.dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab--reorder-after::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  z-index: 10;
  pointer-events: none;
  background-color: var(--dv-drag-over-border-color);
}
.dv-tabs-container.dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab--reorder-before::after {
  left: 0;
}
.dv-tabs-container.dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab--reorder-after::after {
  right: 0;
}
.dv-tabs-container {
  /**
   * Multi-column (wrapping) tabs for a vertical (edge-group) header: the
   * mirror of the horizontal rule above with the axes swapped. The main axis
   * is vertical (bounded by the header height, so overflowing tabs wrap) and
   * the cross axis is horizontal (grows into additional columns). The header
   * grows in width via the \`:has()\` rule in tabsContainer.scss.
   *
   * Column flow direction under \`writing-mode: vertical-rl\` differs
   * between left and right header positions; this needs visual verification
   * in a real browser (jsdom lays out neither writing-mode nor flex-wrap).
   */
}
.dv-tabs-container.dv-tabs-container--wrap.dv-tabs-container-vertical {
  flex-wrap: wrap;
  width: auto;
  height: 100%;
  max-height: 100%;
  overflow: visible;
  align-content: flex-start;
}
.dv-tabs-container.dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab {
  width: var(--dv-tabs-and-actions-container-height);
  height: var(--dv-wrap-vertical-tab-height, auto);
}
.dv-tabs-container.dv-tabs-container--wrap.dv-tabs-container-vertical.dv-tabs-container--wrap-capped {
  max-width: calc(var(--dv-tabs-and-actions-container-height) * var(--dv-max-tab-rows));
  overflow: hidden;
}
.dv-tabs-container.dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab--reorder-before::after,
.dv-tabs-container.dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab--reorder-after::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 10;
  pointer-events: none;
  background-color: var(--dv-drag-over-border-color);
}
.dv-tabs-container.dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab--reorder-before::after {
  top: 0;
}
.dv-tabs-container.dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab--reorder-after::after {
  bottom: 0;
}
.dv-tabs-container {
  /* GPU optimizations for smooth scrolling */
  will-change: scroll-position;
  transform: translate3d(0, 0, 0);
  /**
   * Stop scroll-chaining at the tab strip so that wheel / trackpad
   * overscroll past the strip's edges doesn't trigger the browser's
   * swipe-to-go-back-or-forward gesture (and doesn't scroll the page
   * either). \`contain\` keeps the native bounce visuals; \`none\` would
   * also disable them.
   */
  overscroll-behavior: contain;
  /**
   * Empty space between tabs (and the scrollbar lane) keeps pan-x so a
   * flick on those areas produces native momentum scroll. The tab and
   * chip elements themselves opt out (\`touch-action: none\`) so the
   * pointer drag source owns the gesture from pointerdown - a flick on
   * a tab or chip always becomes a drag, regardless of direction.
   */
  touch-action: pan-x;
}
.dv-tabs-container.dv-tabs-container-vertical {
  width: 100%;
  height: fit-content;
  max-height: 100%;
  writing-mode: vertical-rl;
  touch-action: pan-y;
}
.dv-tabs-container.dv-horizontal .dv-tab:not(:first-child)::before, .dv-tabs-container.dv-vertical .dv-tab:not(:first-child)::before {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  pointer-events: none;
  background-color: var(--dv-tab-divider-color);
}
.dv-tabs-container.dv-horizontal .dv-tab:not(:first-child)::before {
  width: 1px;
  height: 100%;
}
.dv-tabs-container.dv-vertical .dv-tab:not(:first-child)::before {
  width: 100%;
  height: 1px;
}
.dv-tabs-container::-webkit-scrollbar {
  height: 3px;
}
.dv-tabs-container {
  /* Track */
}
.dv-tabs-container::-webkit-scrollbar-track {
  background: transparent;
}
.dv-tabs-container {
  /* Handle */
}
.dv-tabs-container::-webkit-scrollbar-thumb {
  background: var(--dv-tabs-container-scrollbar-color);
}

.dv-scrollable > .dv-tabs-container {
  overflow: hidden;
}

.dv-tab {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  outline: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  font-size: var(--dv-tab-font-size);
  margin: var(--dv-tab-margin);
  touch-action: none;
}
.dv-tab.dv-tab--shifting {
  will-change: transform, margin-left, margin-right, margin-top, margin-bottom;
  transition: transform var(--dv-transition-duration, 200ms) ease-out, margin-left var(--dv-transition-duration, 200ms) ease-out, margin-right var(--dv-transition-duration, 200ms) ease-out, margin-top var(--dv-transition-duration, 200ms) ease-out, margin-bottom var(--dv-transition-duration, 200ms) ease-out;
}
.dv-tab.dv-tab--dragging {
  width: 0 !important;
  min-width: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: width var(--dv-transition-duration, 200ms) ease-out, padding var(--dv-transition-duration, 200ms) ease-out, margin var(--dv-transition-duration, 200ms) ease-out, opacity var(--dv-transition-duration, 200ms) ease-out;
}
.dv-tab.dv-tab--group-collapsed {
  width: 0 !important;
  min-width: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: width var(--dv-transition-duration, 200ms) ease-out, padding var(--dv-transition-duration, 200ms) ease-out, margin var(--dv-transition-duration, 200ms) ease-out, opacity var(--dv-transition-duration, 200ms) ease-out;
}
.dv-tab.dv-tab--group-expanding {
  transition: width var(--dv-transition-duration, 200ms) ease-out, padding var(--dv-transition-duration, 200ms) ease-out, margin var(--dv-transition-duration, 200ms) ease-out, opacity var(--dv-transition-duration, 200ms) ease-out;
}

.dv-tab.dv-tab--pinned:has(.dv-tab-pin) {
  display: flex;
  align-items: center;
}
.dv-tab.dv-tab--pinned .dv-tab-pin {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 4px;
  opacity: 0.7;
  pointer-events: none;
}
.dv-tab.dv-tab--pinned .dv-tab-pin .dv-svg {
  width: 11px;
  height: 11px;
}
.dv-tab.dv-tab--pinned .dv-default-tab {
  min-width: 0;
}
.dv-tab.dv-tab--pinned .dv-default-tab-action {
  display: none;
}

.dv-tab.dv-tab--pinned-compact .dv-default-tab-content {
  display: none;
}
.dv-tab.dv-tab--pinned-compact .dv-tab-pin {
  margin-right: 0;
}

.dv-tabs-container:not(.dv-tabs-container--wrap):not(.dv-tabs-container-vertical) > .dv-tab.dv-tab--pinned-sticky {
  position: sticky;
  left: var(--dv-pinned-sticky-left, 0);
  z-index: 2;
}

.dv-tabs-and-actions-container.dv-tabs-and-actions-container--pinned-row {
  flex-wrap: wrap;
  height: auto;
  min-height: var(--dv-tabs-and-actions-container-height);
  align-content: flex-start;
}
.dv-tabs-and-actions-container.dv-tabs-and-actions-container--pinned-row .dv-pinned-row {
  flex: 0 0 100%;
  order: -1;
}
.dv-tabs-and-actions-container.dv-tabs-and-actions-container--pinned-row .dv-tab.dv-tab--pinned {
  display: none;
}

.dv-pinned-row {
  display: flex;
  align-items: center;
  gap: 2px;
  box-sizing: border-box;
  width: 100%;
  min-height: var(--dv-tabs-and-actions-container-height);
  padding: 2px 4px;
  background-color: var(--dv-tabs-and-actions-container-background-color);
  border-bottom: 1px solid var(--dv-tab-divider-color);
}

.dv-pinned-tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  padding: 0.25rem 0.5rem;
  font-size: var(--dv-tab-font-size);
  cursor: pointer;
  user-select: none;
  background-color: var(--dv-activegroup-hiddenpanel-tab-background-color);
  color: var(--dv-activegroup-hiddenpanel-tab-color);
}
.dv-pinned-tab.dv-pinned-tab--active {
  background-color: var(--dv-activegroup-visiblepanel-tab-background-color);
  color: var(--dv-activegroup-visiblepanel-tab-color);
}
.dv-pinned-tab .dv-pinned-tab-label {
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dv-pinned-tab .dv-pinned-tab-unpin {
  flex-shrink: 0;
  opacity: 0.6;
}
.dv-pinned-tab .dv-pinned-tab-unpin:hover {
  opacity: 1;
}
.dv-pinned-tab.dv-pinned-tab--dragging {
  opacity: 0.5;
}
.dv-pinned-tab.dv-pinned-tab--drop-before, .dv-pinned-tab.dv-pinned-tab--drop-after {
  position: relative;
}
.dv-pinned-tab.dv-pinned-tab--drop-before::after, .dv-pinned-tab.dv-pinned-tab--drop-after::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  z-index: 10;
  pointer-events: none;
  background-color: var(--dv-drag-over-border-color);
}
.dv-pinned-tab.dv-pinned-tab--drop-before::after {
  left: 0;
}
.dv-pinned-tab.dv-pinned-tab--drop-after::after {
  right: 0;
}

@media (prefers-reduced-motion: reduce) {
  .dv-tab {
    transition: none !important;
  }
  .dv-tab-group-chip {
    transition: none !important;
  }
}
.dv-tab-group-chip {
  display: inline-flex;
  align-items: center;
  align-self: center;
  padding: var(--dv-tab-group-chip-padding);
  margin: 0 8px 0 8px;
  border-radius: var(--dv-tab-group-chip-border-radius);
  font-size: var(--dv-tab-group-chip-font-size);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  box-sizing: border-box;
  line-height: 1;
  touch-action: none;
  background-color: var(--dv-tab-group-color);
  color: white;
}
.dv-tab-group-chip.dv-tab-group-chip--accent-off {
  background-color: transparent;
  color: inherit;
}
.dv-tab-group-chip.dv-tab-group-chip--shifting {
  will-change: margin-left, margin-top;
  transition: margin-left var(--dv-transition-duration, 200ms) ease-out, margin-top var(--dv-transition-duration, 200ms) ease-out;
}
.dv-tab-group-chip.dv-tab-group-chip--dragging {
  width: 0 !important;
  min-width: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: width var(--dv-transition-duration, 200ms) ease-out, padding var(--dv-transition-duration, 200ms) ease-out, margin var(--dv-transition-duration, 200ms) ease-out, opacity var(--dv-transition-duration, 200ms) ease-out;
}
.dv-tab-group-chip .dv-tab-group-chip-label--empty {
  display: none;
}
.dv-tab-group-chip:has(.dv-tab-group-chip-label--empty) {
  position: relative;
  width: 12px;
  height: 12px;
  padding: 0;
  border-radius: 50%;
}
.dv-tab-group-chip:has(.dv-tab-group-chip-label--empty)::before {
  content: "";
  position: absolute;
  inset: -8px;
}

.dv-tab-group-underline {
  position: absolute;
  bottom: 0;
  opacity: var(--dv-tab-group-line-opacity);
  pointer-events: none;
  z-index: 10;
}

.dv-tab-group-chip-continuation {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: var(--dv-tab-group-line-opacity);
  pointer-events: none;
  z-index: 10;
}

.dv-groupview-header-bottom .dv-tab-group-underline {
  bottom: auto;
  top: 0;
}

.dv-tabs-container-vertical .dv-tab-group-underline {
  bottom: auto;
  left: 0;
}

.dv-tabs-container-vertical .dv-tab-group-chip {
  margin: 8px 0 8px 0;
}
.dv-tabs-container-vertical .dv-tab-group-chip.dv-tab-group-chip--dragging {
  height: 0 !important;
  min-height: 0 !important;
  width: auto !important;
  min-width: initial !important;
  transition: height var(--dv-transition-duration, 200ms) ease-out, padding var(--dv-transition-duration, 200ms) ease-out, margin var(--dv-transition-duration, 200ms) ease-out, opacity var(--dv-transition-duration, 200ms) ease-out;
}
.dv-tabs-container-vertical .dv-tab {
  padding: 0.5rem 0.25rem;
}
.dv-tabs-container-vertical .dv-tab.dv-tab--group-collapsed {
  height: 0 !important;
  min-height: 0 !important;
  width: auto !important;
  min-width: initial !important;
  transition: height var(--dv-transition-duration, 200ms) ease-out, padding var(--dv-transition-duration, 200ms) ease-out, margin var(--dv-transition-duration, 200ms) ease-out, opacity var(--dv-transition-duration, 200ms) ease-out;
}
.dv-tabs-container-vertical .dv-tab.dv-tab--group-expanding {
  transition: height var(--dv-transition-duration, 200ms) ease-out, padding var(--dv-transition-duration, 200ms) ease-out, margin var(--dv-transition-duration, 200ms) ease-out, opacity var(--dv-transition-duration, 200ms) ease-out;
}
.dv-tabs-container-vertical .dv-tab.dv-tab--dragging {
  height: 0 !important;
  min-height: 0 !important;
  width: auto !important;
  min-width: initial !important;
  transition: height var(--dv-transition-duration, 200ms) ease-out, padding var(--dv-transition-duration, 200ms) ease-out, margin var(--dv-transition-duration, 200ms) ease-out, opacity var(--dv-transition-duration, 200ms) ease-out;
}

.dv-tabs-overflow-container {
  flex-direction: column;
  height: unset;
  font-size: var(--dv-tabs-and-actions-container-font-size);
  max-height: min(50vh, 400px);
  overflow-y: auto;
  border: 1px solid var(--dv-tab-divider-color);
  background-color: var(--dv-group-view-background-color);
  /* Scrollbar styling for webkit browsers */
}
.dv-tabs-overflow-container::-webkit-scrollbar {
  width: 6px;
}
.dv-tabs-overflow-container::-webkit-scrollbar-track {
  background: transparent;
}
.dv-tabs-overflow-container::-webkit-scrollbar-thumb {
  background: var(--dv-tabs-container-scrollbar-color);
  border-radius: 3px;
}
.dv-tabs-overflow-container {
  /* Firefox scrollbar */
  scrollbar-width: thin;
}
.dv-tabs-overflow-container .dv-tab:not(:last-child) {
  border-bottom: 1px solid var(--dv-tab-divider-color);
}
.dv-tabs-overflow-container .dv-active-tab {
  background-color: var(--dv-activegroup-visiblepanel-tab-background-color);
  color: var(--dv-activegroup-visiblepanel-tab-color);
}
.dv-tabs-overflow-container .dv-inactive-tab {
  background-color: var(--dv-activegroup-hiddenpanel-tab-background-color);
  color: var(--dv-activegroup-hiddenpanel-tab-color);
}
.dv-tabs-overflow-container .dv-tabs-overflow-group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  font-size: 0.8em;
  font-weight: 600;
  color: var(--dv-activegroup-hiddenpanel-tab-color);
  cursor: pointer;
  border-bottom: 1px solid var(--dv-tab-divider-color);
}
.dv-tabs-overflow-container .dv-tabs-overflow-group-header:hover {
  background-color: var(--dv-icon-hover-background-color);
}
.dv-tabs-overflow-container .dv-tabs-overflow-group-color {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: var(--dv-tab-group-color);
}
.dv-tabs-overflow-container .dv-tabs-overflow-group-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dv-tabs-overflow-container .dv-tabs-overflow-group-collapsed-badge {
  font-size: 0.75em;
  font-weight: 400;
  opacity: 0.7;
  padding: 1px 4px;
  border-radius: 3px;
  background-color: var(--dv-tab-divider-color);
}
.dv-tabs-overflow-container .dv-tabs-overflow-pinned-header {
  cursor: default;
}
.dv-tabs-overflow-container .dv-tabs-overflow-pinned-header:hover {
  background-color: transparent;
}
.dv-tabs-overflow-container .dv-tabs-overflow-pinned-header .dv-tabs-overflow-pinned-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  opacity: 0.7;
}
.dv-tabs-overflow-container .dv-tabs-overflow-pinned-header .dv-tabs-overflow-pinned-icon .dv-svg {
  width: 11px;
  height: 11px;
}
.dv-tabs-overflow-container .dv-tab.dv-tab--grouped {
  padding-left: 16px;
}

/*
 * Advanced overflow popover (AdvancedOverflowModule): the same container as the
 * free list, upgraded in place with a search input, a scrollable listbox, and a
 * keyboard-highlighted active row. Styles live in core so the module ships no
 * CSS; they are inert unless the module renders this body.
 */
.dv-tabs-overflow-container.dv-tabs-overflow-advanced {
  min-width: 220px;
}
.dv-tabs-overflow-container.dv-tabs-overflow-advanced .dv-tabs-overflow-search {
  box-sizing: border-box;
  width: 100%;
  padding: 6px 8px;
  border: none;
  border-bottom: 1px solid var(--dv-tab-divider-color);
  outline: none;
  font-size: inherit;
  font-family: inherit;
  color: var(--dv-activegroup-visiblepanel-tab-color);
  background-color: var(--dv-group-view-background-color);
}
.dv-tabs-overflow-container.dv-tabs-overflow-advanced .dv-tabs-overflow-list {
  display: flex;
  flex-direction: column;
  outline: none;
}
.dv-tabs-overflow-container.dv-tabs-overflow-advanced .dv-tab.dv-tabs-overflow-option--focused {
  outline: 1px solid var(--dv-tab-divider-color);
  outline-offset: -1px;
  background-color: var(--dv-icon-hover-background-color);
}
.dv-tabs-and-actions-container {
  display: flex;
  background-color: var(--dv-tabs-and-actions-container-background-color);
  flex-shrink: 0;
  box-sizing: border-box;
  height: var(--dv-tabs-and-actions-container-height);
  font-size: var(--dv-tabs-and-actions-container-font-size);
  /**
   * Multi-row (wrapping) tabs: when the tab list wraps onto multiple rows
   * (\`.dv-tabs-container--wrap\`, toggled by the \`MultiRowTabsModule\`), the
   * header grows to fit instead of clipping. Inert otherwise: the single-row
   * fixed height above is unchanged.
   */
}
.dv-tabs-and-actions-container:has(.dv-tabs-container--wrap) {
  height: auto;
  min-height: var(--dv-tabs-and-actions-container-height);
  align-items: flex-start;
}
.dv-tabs-and-actions-container:has(.dv-tabs-container--wrap) > .dv-pre-actions-container,
.dv-tabs-and-actions-container:has(.dv-tabs-container--wrap) > .dv-left-actions-container,
.dv-tabs-and-actions-container:has(.dv-tabs-container--wrap) > .dv-right-actions-container,
.dv-tabs-and-actions-container:has(.dv-tabs-container--wrap) > .dv-void-container {
  height: var(--dv-tabs-and-actions-container-height);
}
.dv-tabs-and-actions-container.dv-single-tab.dv-full-width-single-tab .dv-scrollable {
  flex-grow: 1;
}
.dv-tabs-and-actions-container.dv-single-tab.dv-full-width-single-tab .dv-tabs-container {
  flex-grow: 1;
}
.dv-tabs-and-actions-container.dv-single-tab.dv-full-width-single-tab .dv-tabs-container .dv-tab {
  flex-grow: 1;
  padding: 0px;
}
.dv-tabs-and-actions-container.dv-single-tab.dv-full-width-single-tab .dv-void-container {
  flex-grow: 0;
}
.dv-tabs-and-actions-container .dv-void-container {
  display: flex;
  flex-grow: 1;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  touch-action: none;
}
.dv-tabs-and-actions-container .dv-void-container.dv-draggable {
  cursor: grab;
}
.dv-tabs-and-actions-container .dv-right-actions-container {
  display: flex;
}
.dv-tabs-and-actions-container .dv-right-actions-container.dv-right-actions-container-vertical {
  flex-direction: column;
}
.dv-tabs-and-actions-container.dv-groupview-header-vertical {
  flex-direction: column;
  height: auto;
  width: var(--dv-tabs-and-actions-container-height);
}
.dv-tabs-and-actions-container.dv-groupview-header-vertical:has(.dv-tabs-container--wrap) {
  width: auto;
  min-width: var(--dv-tabs-and-actions-container-height);
}
.dv-tabs-and-actions-container.dv-groupview-header-vertical:has(.dv-tabs-container--wrap) > .dv-scrollable {
  align-self: stretch;
}
.dv-watermark {
  display: flex;
  height: 100%;
}
.dv-dockview {
  position: relative;
  background-color: var(--dv-group-view-background-color);
}
.dv-dockview .dv-watermark-container {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  z-index: 1;
}
.dv-dockview .dv-overlay-render-container {
  position: relative;
}

.dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {
  background-color: var(--dv-activegroup-visiblepanel-tab-background-color);
  color: var(--dv-activegroup-visiblepanel-tab-color);
}
.dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-inactive-tab {
  background-color: var(--dv-activegroup-hiddenpanel-tab-background-color);
  color: var(--dv-activegroup-hiddenpanel-tab-color);
}
.dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {
  background-color: var(--dv-inactivegroup-visiblepanel-tab-background-color);
  color: var(--dv-inactivegroup-visiblepanel-tab-color);
}
.dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-inactive-tab {
  background-color: var(--dv-inactivegroup-hiddenpanel-tab-background-color);
  color: var(--dv-inactivegroup-hiddenpanel-tab-color);
}

/**
 * when a tab is dragged we lose the above stylings because they are conditional on parent elements
 * therefore we also set some stylings for the dragging event
 **/
.dv-tab.dv-tab-dragging {
  background-color: var(--dv-activegroup-visiblepanel-tab-background-color);
  color: var(--dv-activegroup-visiblepanel-tab-color);
}

.dv-keyboard-docking-hint {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  z-index: 100;
  max-width: 90%;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  background-color: var(--dv-context-menu-background-color, var(--dv-group-view-background-color));
  color: var(--dv-activegroup-visiblepanel-tab-color);
  border: 1px solid var(--dv-tab-divider-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}
.dv-groupview {
  display: flex;
  height: 100%;
  background-color: var(--dv-group-view-background-color);
  overflow: hidden;
  flex-direction: column;
}
.dv-groupview:focus {
  outline: none;
}
.dv-groupview > .dv-content-container {
  flex-grow: 1;
  min-height: 0;
  outline: none;
}
.dv-groupview.dv-groupview-header-bottom {
  flex-direction: column-reverse;
}
.dv-groupview.dv-groupview-header-left {
  flex-direction: row;
}
.dv-groupview.dv-groupview-header-right {
  flex-direction: row-reverse;
}
.dv-groupview.dv-groupview-edge.dv-edge-collapsed > .dv-content-container {
  display: none;
}
.dv-root-wrapper {
  height: 100%;
  width: 100%;
}
.dv-grid-view,
.dv-branch-node {
  height: 100%;
  width: 100%;
}
.dv-debug .dv-resize-container .dv-resize-handle-top {
  background-color: red;
}
.dv-debug .dv-resize-container .dv-resize-handle-bottom {
  background-color: green;
}
.dv-debug .dv-resize-container .dv-resize-handle-left {
  background-color: yellow;
}
.dv-debug .dv-resize-container .dv-resize-handle-right {
  background-color: blue;
}
.dv-debug .dv-resize-container .dv-resize-handle-topleft,
.dv-debug .dv-resize-container .dv-resize-handle-topright,
.dv-debug .dv-resize-container .dv-resize-handle-bottomleft,
.dv-debug .dv-resize-container .dv-resize-handle-bottomright {
  background-color: cyan;
}

.dv-floating-overlay-host {
  position: absolute;
  pointer-events: none;
}
.dv-floating-overlay-host > .dv-resize-container {
  pointer-events: auto;
}

.dv-edge-peek {
  background-color: var(--dv-group-view-background-color);
  border: 1px solid var(--dv-separator-border);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}
.dv-edge-peek > * {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.dv-auto-edge-band {
  position: absolute;
  pointer-events: none;
  z-index: var(--dv-overlay-z-index, 999);
  background-color: var(--dv-edge-dock-indicator-color);
  box-shadow: 0 0 6px var(--dv-edge-dock-indicator-color);
}

.dv-edge-peek-header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px 0 8px;
  box-sizing: border-box;
  background-color: var(--dv-group-view-background-color);
  border: 1px solid var(--dv-separator-border);
  border-bottom: none;
  color: var(--dv-activegroup-visiblepanel-tab-color);
  font-size: 12px;
}
.dv-edge-peek-header .dv-edge-peek-pin,
.dv-edge-peek-header .dv-edge-peek-close {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  border: none;
  padding: 4px;
  color: inherit;
  background: transparent;
  outline: none;
}
.dv-edge-peek-header .dv-edge-peek-pin:hover,
.dv-edge-peek-header .dv-edge-peek-close:hover {
  border-radius: 2px;
  background-color: var(--dv-icon-hover-background-color);
}
.dv-edge-peek-header .dv-edge-peek-pin:focus-visible,
.dv-edge-peek-header .dv-edge-peek-close:focus-visible {
  border-radius: 2px;
  outline: 1px solid var(--dv-tab-divider-color);
  outline-offset: -1px;
}

.dv-edge-peek-title {
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dv-resize-container > .dv-grid-view {
  width: 100%;
  height: 100%;
}

.dv-resize-container-with-titlebar {
  display: flex;
  flex-direction: column;
}
.dv-resize-container-with-titlebar > .dv-floating-titlebar {
  flex: 0 0 auto;
}
.dv-resize-container-with-titlebar > .dv-grid-view {
  height: auto;
  flex: 1 1 0;
  min-height: 0;
}

.dv-floating-titlebar {
  box-sizing: border-box;
  flex-shrink: 0;
  height: var(--dv-floating-titlebar-height, 22px);
  background-color: var(--dv-floating-titlebar-background-color);
  border-bottom: var(--dv-floating-titlebar-border-bottom, none);
  user-select: none;
  touch-action: none;
}
.dv-floating-titlebar.dv-draggable {
  cursor: grab;
}

.dv-resize-container {
  --dv-overlay-z-index: var(--dv-overlay-z-index, 999);
  position: absolute;
  z-index: calc(var(--dv-overlay-z-index) - 2);
  background-color: var(--dv-group-view-background-color);
  border: var(--dv-floating-border);
  box-shadow: var(--dv-floating-box-shadow);
  /* GPU optimizations for floating group movement */
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}
.dv-resize-container.dv-hidden {
  display: none;
}
.dv-resize-container.dv-resize-container-dragging {
  opacity: var(--dv-floating-group-dragging-opacity);
  /* Enhanced GPU acceleration during drag */
  will-change: transform, opacity;
}
.dv-resize-container .dv-resize-handle-top,
.dv-resize-container .dv-resize-handle-bottom,
.dv-resize-container .dv-resize-handle-left,
.dv-resize-container .dv-resize-handle-right,
.dv-resize-container .dv-resize-handle-topleft,
.dv-resize-container .dv-resize-handle-topright,
.dv-resize-container .dv-resize-handle-bottomleft,
.dv-resize-container .dv-resize-handle-bottomright {
  touch-action: none;
}
.dv-resize-container .dv-resize-handle-top {
  height: 4px;
  width: calc(100% - 8px);
  left: 4px;
  top: -2px;
  z-index: var(--dv-overlay-z-index);
  position: absolute;
  cursor: ns-resize;
}
.dv-resize-container .dv-resize-handle-bottom {
  height: 4px;
  width: calc(100% - 8px);
  left: 4px;
  bottom: -2px;
  z-index: var(--dv-overlay-z-index);
  position: absolute;
  cursor: ns-resize;
}
.dv-resize-container .dv-resize-handle-left {
  height: calc(100% - 8px);
  width: 4px;
  left: -2px;
  top: 4px;
  z-index: var(--dv-overlay-z-index);
  position: absolute;
  cursor: ew-resize;
}
.dv-resize-container .dv-resize-handle-right {
  height: calc(100% - 8px);
  width: 4px;
  right: -2px;
  top: 4px;
  z-index: var(--dv-overlay-z-index);
  position: absolute;
  cursor: ew-resize;
}
.dv-resize-container .dv-resize-handle-topleft {
  height: 4px;
  width: 4px;
  top: -2px;
  left: -2px;
  z-index: var(--dv-overlay-z-index);
  position: absolute;
  cursor: nw-resize;
}
.dv-resize-container .dv-resize-handle-topright {
  height: 4px;
  width: 4px;
  right: -2px;
  top: -2px;
  z-index: var(--dv-overlay-z-index);
  position: absolute;
  cursor: ne-resize;
}
.dv-resize-container .dv-resize-handle-bottomleft {
  height: 4px;
  width: 4px;
  left: -2px;
  bottom: -2px;
  z-index: var(--dv-overlay-z-index);
  position: absolute;
  cursor: sw-resize;
}
.dv-resize-container .dv-resize-handle-bottomright {
  height: 4px;
  width: 4px;
  right: -2px;
  bottom: -2px;
  z-index: var(--dv-overlay-z-index);
  position: absolute;
  cursor: se-resize;
}
@media (pointer: coarse) {
  .dv-resize-container .dv-resize-handle-top,
  .dv-resize-container .dv-resize-handle-bottom {
    height: 16px;
    width: calc(100% - 48px);
    left: 24px;
  }
  .dv-resize-container .dv-resize-handle-top {
    top: -10px;
  }
  .dv-resize-container .dv-resize-handle-bottom {
    bottom: -10px;
  }
  .dv-resize-container .dv-resize-handle-left,
  .dv-resize-container .dv-resize-handle-right {
    width: 16px;
    height: calc(100% - 48px);
    top: 24px;
  }
  .dv-resize-container .dv-resize-handle-left {
    left: -10px;
  }
  .dv-resize-container .dv-resize-handle-right {
    right: -10px;
  }
  .dv-resize-container .dv-resize-handle-topleft,
  .dv-resize-container .dv-resize-handle-topright,
  .dv-resize-container .dv-resize-handle-bottomleft,
  .dv-resize-container .dv-resize-handle-bottomright {
    height: 24px;
    width: 24px;
  }
  .dv-resize-container .dv-resize-handle-topleft {
    top: -12px;
    left: -12px;
  }
  .dv-resize-container .dv-resize-handle-topright {
    top: -12px;
    right: -12px;
  }
  .dv-resize-container .dv-resize-handle-bottomleft {
    bottom: -12px;
    left: -12px;
  }
  .dv-resize-container .dv-resize-handle-bottomright {
    bottom: -12px;
    right: -12px;
  }
}

.dv-smart-guides {
  pointer-events: none;
  z-index: calc(var(--dv-overlay-z-index, 999) + 100);
}

.dv-smart-guide {
  background-color: var(--dv-smart-guides-color, #1f9cf0);
}

.dv-smart-guide-preview {
  box-sizing: border-box;
  background-color: var(--dv-smart-guides-preview-color, rgba(31, 156, 240, 0.18));
  border: 1px solid var(--dv-smart-guides-color, #1f9cf0);
}
.dv-render-overlay {
  --dv-overlay-z-index: var(--dv-overlay-z-index, 999);
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  contain: layout paint;
  isolation: isolate;
  /* GPU optimizations */
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}
.dv-render-overlay.dv-render-overlay-float {
  z-index: calc(var(--dv-overlay-z-index) - 1);
}

.dv-debug .dv-render-overlay {
  outline: 1px solid red;
  outline-offset: -1;
}
.dv-pane-container {
  height: 100%;
  width: 100%;
}
.dv-pane-container.dv-animated .dv-view {
  /* GPU optimizations for smooth pane animations */
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  transition: transform 0.15s ease-out;
}
.dv-pane-container .dv-view {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0px !important;
}
.dv-pane-container .dv-view:not(:first-child)::before {
  background-color: transparent !important;
}
.dv-pane-container .dv-view:not(:first-child) .dv-pane > .dv-pane-header {
  border-top: 1px solid var(--dv-paneview-header-border-color);
}
.dv-pane-container .dv-view .dv-default-header {
  background-color: var(--dv-group-view-background-color);
  color: var(--dv-activegroup-visiblepanel-tab-color);
  display: flex;
  padding: 0px 8px;
  cursor: pointer;
}
.dv-pane-container .dv-view .dv-default-header .dv-pane-header-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
.dv-pane-container .dv-view .dv-default-header > span {
  padding-left: 8px;
  flex-grow: 1;
}
.dv-pane-container:first-of-type > .dv-pane > .dv-pane-header {
  border-top: none !important;
}
.dv-pane-container .dv-pane {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.dv-pane-container .dv-pane .dv-pane-header {
  box-sizing: border-box;
  user-select: none;
  position: relative;
  outline: none;
}
.dv-pane-container .dv-pane .dv-pane-header.dv-pane-draggable {
  cursor: pointer;
}
.dv-pane-container .dv-pane .dv-pane-header:focus-visible:before, .dv-pane-container .dv-pane .dv-pane-header:has(:focus-visible):before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  content: "";
  pointer-events: none;
  outline: 1px solid;
  outline-width: -1px;
  outline-style: solid;
  outline-offset: -1px;
  outline-color: var(--dv-paneview-active-outline-color);
}
.dv-pane-container .dv-pane .dv-pane-body {
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
  position: relative;
  outline: none;
}
.dv-pane-container .dv-pane .dv-pane-body:focus-visible:before, .dv-pane-container .dv-pane .dv-pane-body:has(:focus-visible):before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  content: "";
  pointer-events: none;
  outline: 1px solid;
  outline-width: -1px;
  outline-style: solid;
  outline-offset: -1px;
  outline-color: var(--dv-paneview-active-outline-color);
}
.dv-scrollable {
  position: relative;
  overflow: hidden;
}
.dv-scrollable .dv-scrollbar {
  position: absolute;
  border-radius: 2px;
  background-color: transparent;
  /* GPU optimizations */
  will-change: background-color, transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  transition-property: background-color;
  transition-timing-function: ease-in-out;
  transition-duration: 1s;
  transition-delay: 0s;
}
.dv-scrollable .dv-scrollbar-horizontal {
  bottom: 0px;
  left: 0px;
  height: 4px;
}
.dv-scrollable .dv-scrollbar-vertical {
  right: 0px;
  top: 0px;
  width: 4px;
}
.dv-scrollable:hover .dv-scrollbar, .dv-scrollable.dv-scrollable-resizing .dv-scrollbar, .dv-scrollable.dv-scrollable-scrolling .dv-scrollbar {
  background-color: var(--dv-scrollbar-background-color, rgba(255, 255, 255, 0.25));
}
.dv-debug .dv-split-view-container .dv-sash-container .dv-sash.dv-enabled {
  background-color: black;
}
.dv-debug .dv-split-view-container .dv-sash-container .dv-sash.dv-disabled {
  background-color: orange;
}
.dv-debug .dv-split-view-container .dv-sash-container .dv-sash.dv-maximum {
  background-color: green;
}
.dv-debug .dv-split-view-container .dv-sash-container .dv-sash.dv-minimum {
  background-color: red;
}

.dv-split-view-container {
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.dv-split-view-container.dv-splitview-disabled > .dv-sash-container > .dv-sash {
  pointer-events: none;
}
.dv-split-view-container.dv-animation .dv-view,
.dv-split-view-container.dv-animation .dv-sash {
  /* GPU optimizations for smooth animations */
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  transition: transform 0.15s ease-out;
}
.dv-split-view-container.dv-horizontal {
  height: 100%;
}
.dv-split-view-container.dv-horizontal > .dv-sash-container > .dv-sash {
  height: 100%;
  width: 4px;
}
.dv-split-view-container.dv-horizontal > .dv-sash-container > .dv-sash.dv-enabled {
  cursor: ew-resize;
}
.dv-split-view-container.dv-horizontal > .dv-sash-container > .dv-sash.dv-disabled {
  cursor: default;
}
.dv-split-view-container.dv-horizontal > .dv-sash-container > .dv-sash.dv-maximum {
  cursor: w-resize;
}
.dv-split-view-container.dv-horizontal > .dv-sash-container > .dv-sash.dv-minimum {
  cursor: e-resize;
}
.dv-split-view-container.dv-horizontal > .dv-view-container > .dv-view:not(:first-child)::before {
  height: 100%;
  width: 1px;
}
.dv-split-view-container.dv-vertical {
  width: 100%;
}
.dv-split-view-container.dv-vertical > .dv-sash-container > .dv-sash {
  width: 100%;
  height: 4px;
}
.dv-split-view-container.dv-vertical > .dv-sash-container > .dv-sash.dv-enabled {
  cursor: ns-resize;
}
.dv-split-view-container.dv-vertical > .dv-sash-container > .dv-sash.dv-disabled {
  cursor: default;
}
.dv-split-view-container.dv-vertical > .dv-sash-container > .dv-sash.dv-maximum {
  cursor: n-resize;
}
.dv-split-view-container.dv-vertical > .dv-sash-container > .dv-sash.dv-minimum {
  cursor: s-resize;
}
.dv-split-view-container.dv-vertical > .dv-view-container > .dv-view {
  width: 100%;
}
.dv-split-view-container.dv-vertical > .dv-view-container > .dv-view:not(:first-child)::before {
  height: 1px;
  width: 100%;
}
.dv-split-view-container .dv-sash-container {
  height: 100%;
  width: 100%;
  position: absolute;
}
.dv-split-view-container .dv-sash-container .dv-sash {
  position: absolute;
  z-index: 99;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  touch-action: none;
  background-color: var(--dv-sash-color, transparent);
}
.dv-split-view-container .dv-sash-container .dv-sash:not(.disabled):active, .dv-split-view-container .dv-sash-container .dv-sash:not(.disabled):hover {
  background-color: var(--dv-active-sash-color, transparent);
  transition-property: background-color;
  transition-timing-function: ease-in-out;
  transition-duration: var(--dv-active-sash-transition-duration, 0.1s);
  transition-delay: var(--dv-active-sash-transition-delay, 0.5s);
}
@media (pointer: coarse) {
  .dv-split-view-container .dv-sash-container > .dv-sash:not(.dv-disabled)::before {
    content: "";
    position: absolute;
    background: transparent;
  }
  .dv-split-view-container.dv-horizontal > .dv-sash-container > .dv-sash:not(.dv-disabled)::before {
    top: 0;
    bottom: 0;
    left: -10px;
    right: -10px;
  }
  .dv-split-view-container.dv-vertical > .dv-sash-container > .dv-sash:not(.dv-disabled)::before {
    left: 0;
    right: 0;
    top: -10px;
    bottom: -10px;
  }
}
.dv-split-view-container .dv-view-container {
  position: relative;
  height: 100%;
  width: 100%;
}
.dv-split-view-container .dv-view-container .dv-view {
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  position: absolute;
}
.dv-split-view-container.dv-separator-border .dv-view:not(:first-child)::before {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  pointer-events: none;
  background-color: var(--dv-separator-border);
}
.dv-svg {
  display: inline-block;
  fill: currentcolor;
  line-height: 1;
  stroke: currentcolor;
  stroke-width: 0;
}
.dockview-theme-dark {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
}
.dockview-theme-dark .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {
  opacity: 0;
  transition: none;
}
.dockview-theme-dark {
  color-scheme: dark;
  --dv-group-view-background-color: #1e1e1e;
  --dv-tabs-and-actions-container-background-color: #252526;
  --dv-activegroup-visiblepanel-tab-background-color: #1e1e1e;
  --dv-activegroup-hiddenpanel-tab-background-color: #2d2d2d;
  --dv-inactivegroup-visiblepanel-tab-background-color: #1e1e1e;
  --dv-inactivegroup-hiddenpanel-tab-background-color: #2d2d2d;
  --dv-tab-divider-color: #1e1e1e;
  --dv-activegroup-visiblepanel-tab-color: white;
  --dv-activegroup-hiddenpanel-tab-color: #969696;
  --dv-inactivegroup-visiblepanel-tab-color: #8f8f8f;
  --dv-inactivegroup-hiddenpanel-tab-color: #626262;
  --dv-separator-border: rgb(68, 68, 68);
  --dv-paneview-header-border-color: rgba(204, 204, 204, 0.2);
}

.dockview-theme-light {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
}
.dockview-theme-light .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {
  opacity: 0;
  transition: none;
}
.dockview-theme-light {
  color-scheme: light;
  --dv-group-view-background-color: white;
  --dv-tabs-and-actions-container-background-color: #f3f3f3;
  --dv-activegroup-visiblepanel-tab-background-color: white;
  --dv-activegroup-hiddenpanel-tab-background-color: #ececec;
  --dv-inactivegroup-visiblepanel-tab-background-color: white;
  --dv-inactivegroup-hiddenpanel-tab-background-color: #ececec;
  --dv-tab-divider-color: white;
  --dv-activegroup-visiblepanel-tab-color: rgb(51, 51, 51);
  --dv-activegroup-hiddenpanel-tab-color: rgba(51, 51, 51, 0.7);
  --dv-inactivegroup-visiblepanel-tab-color: rgba(51, 51, 51, 0.7);
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(51, 51, 51, 0.35);
  --dv-separator-border: rgba(128, 128, 128, 0.35);
  --dv-paneview-header-border-color: rgb(51, 51, 51);
  --dv-scrollbar-background-color: rgba(0, 0, 0, 0.25);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  --dv-floating-border: 1px solid rgba(0, 0, 0, 0.1);
}

.dockview-theme-vs {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
}
.dockview-theme-vs .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {
  opacity: 0;
  transition: none;
}
.dockview-theme-vs {
  color-scheme: dark;
  --dv-group-view-background-color: #1e1e1e;
  --dv-tabs-and-actions-container-background-color: #252526;
  --dv-activegroup-visiblepanel-tab-background-color: #1e1e1e;
  --dv-activegroup-hiddenpanel-tab-background-color: #2d2d2d;
  --dv-inactivegroup-visiblepanel-tab-background-color: #1e1e1e;
  --dv-inactivegroup-hiddenpanel-tab-background-color: #2d2d2d;
  --dv-tab-divider-color: #1e1e1e;
  --dv-activegroup-visiblepanel-tab-color: white;
  --dv-activegroup-hiddenpanel-tab-color: #969696;
  --dv-inactivegroup-visiblepanel-tab-color: #8f8f8f;
  --dv-inactivegroup-hiddenpanel-tab-color: #626262;
  --dv-separator-border: rgb(68, 68, 68);
  --dv-paneview-header-border-color: rgba(204, 204, 204, 0.2);
  --dv-tabs-and-actions-container-background-color: #2d2d30;
  --dv-tabs-and-actions-container-height: 20px;
  --dv-tabs-and-actions-container-font-size: 11px;
  --dv-activegroup-visiblepanel-tab-background-color: #007acc;
  --dv-inactivegroup-visiblepanel-tab-background-color: #3f3f46;
  --dv-activegroup-visiblepanel-tab-color: white;
  --dv-activegroup-hiddenpanel-tab-color: white;
  --dv-inactivegroup-visiblepanel-tab-color: white;
  --dv-inactivegroup-hiddenpanel-tab-color: white;
}
.dockview-theme-vs .dv-groupview.dv-active-group > .dv-tabs-and-actions-container {
  box-sizing: content-box;
  border-bottom: 2px solid var(--dv-activegroup-visiblepanel-tab-background-color);
}
.dockview-theme-vs .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tab.dv-active-tab {
  border-top: 2px solid var(--dv-activegroup-visiblepanel-tab-background-color);
}
.dockview-theme-vs .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tab.dv-inactive-tab {
  border-top: 2px solid var(--dv-activegroup-hiddenpanel-tab-background-color);
}
.dockview-theme-vs .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container {
  box-sizing: content-box;
  border-bottom: 2px solid var(--dv-inactivegroup-visiblepanel-tab-background-color);
}
.dockview-theme-vs .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tab.dv-active-tab {
  border-top: 2px solid var(--dv-inactivegroup-visiblepanel-tab-background-color);
}
.dockview-theme-vs .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tab.dv-inactive-tab {
  border-top: 2px solid var(--dv-inactivegroup-hiddenpanel-tab-background-color);
}

.dockview-theme-abyss {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
}
.dockview-theme-abyss .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {
  opacity: 0;
  transition: none;
}
.dockview-theme-abyss {
  color-scheme: dark;
  --dv-color-abyss-dark: #000c18;
  --dv-color-abyss: #10192c;
  --dv-color-abyss-light: #1c1c2a;
  --dv-color-abyss-lighter: #2b2b4a;
  --dv-color-abyss-accent: rgb(91, 30, 207);
  --dv-color-abyss-primary-text: white;
  --dv-color-abyss-secondary-text: rgb(148, 151, 169);
  --dv-group-view-background-color: var(--dv-color-abyss-dark);
  --dv-tabs-and-actions-container-background-color: var(
      --dv-color-abyss-light
  );
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-abyss-dark
  );
  --dv-activegroup-hiddenpanel-tab-background-color: var(--dv-color-abyss);
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-abyss-dark
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: var(--dv-color-abyss);
  --dv-tab-divider-color: var(--dv-color-abyss-lighter);
  --dv-activegroup-visiblepanel-tab-color: white;
  --dv-activegroup-hiddenpanel-tab-color: rgba(255, 255, 255, 0.5);
  --dv-inactivegroup-visiblepanel-tab-color: rgba(255, 255, 255, 0.5);
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(255, 255, 255, 0.25);
  --dv-separator-border: var(--dv-color-abyss-lighter);
  --dv-paneview-header-border-color: var(--dv-color-abyss-lighter);
  --dv-paneview-active-outline-color: #596f99;
}

.dockview-theme-dracula {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
}
.dockview-theme-dracula .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {
  opacity: 0;
  transition: none;
}
.dockview-theme-dracula {
  color-scheme: dark;
  --dv-group-view-background-color: #282a36;
  --dv-tabs-and-actions-container-background-color: #191a21;
  --dv-activegroup-visiblepanel-tab-background-color: #282a36;
  --dv-activegroup-hiddenpanel-tab-background-color: #21222c;
  --dv-inactivegroup-visiblepanel-tab-background-color: #282a36;
  --dv-inactivegroup-hiddenpanel-tab-background-color: #21222c;
  --dv-tab-divider-color: #191a21;
  --dv-activegroup-visiblepanel-tab-color: rgb(248, 248, 242);
  --dv-activegroup-hiddenpanel-tab-color: rgb(98, 114, 164);
  --dv-inactivegroup-visiblepanel-tab-color: rgba(248, 248, 242, 0.5);
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(98, 114, 164, 0.5);
  --dv-separator-border: #bd93f9;
  --dv-paneview-header-border-color: #bd93f9;
  --dv-paneview-active-outline-color: #6272a4;
}
.dockview-theme-dracula .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {
  position: relative;
}
.dockview-theme-dracula .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after {
  position: absolute;
  left: 0px;
  bottom: 0px;
  content: "";
  width: 100%;
  height: 1px;
  background-color: #94527e;
  z-index: 999;
}
.dockview-theme-dracula .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {
  position: relative;
}
.dockview-theme-dracula .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after {
  position: absolute;
  left: 0px;
  bottom: 0px;
  content: "";
  width: 100%;
  height: 1px;
  background-color: #5e3d5a;
  z-index: 999;
}

.dockview-theme-nord {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
}
.dockview-theme-nord .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {
  opacity: 0;
  transition: none;
}
.dockview-theme-nord {
  color-scheme: dark;
  --dv-color-nord-polar-0: #2e3440;
  --dv-color-nord-polar-1: #3b4252;
  --dv-color-nord-polar-2: #434c5e;
  --dv-color-nord-polar-3: #4c566a;
  --dv-color-nord-frost: #88c0d0;
  --dv-color-nord-frost-2: #81a1c1;
  --dv-color-nord-snow-0: #eceff4;
  --dv-color-nord-snow-1: #d8dee9;
  --dv-group-view-background-color: var(--dv-color-nord-polar-0);
  --dv-tabs-and-actions-container-background-color: var(
      --dv-color-nord-polar-1
  );
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-nord-polar-0
  );
  --dv-activegroup-hiddenpanel-tab-background-color: var(
      --dv-color-nord-polar-2
  );
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-nord-polar-1
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: var(
      --dv-color-nord-polar-2
  );
  --dv-activegroup-visiblepanel-tab-color: var(--dv-color-nord-snow-0);
  --dv-activegroup-hiddenpanel-tab-color: var(--dv-color-nord-snow-1);
  --dv-inactivegroup-visiblepanel-tab-color: #8a9bbf;
  --dv-inactivegroup-hiddenpanel-tab-color: #5e6f8e;
  --dv-separator-border: var(--dv-color-nord-polar-3);
  --dv-paneview-active-outline-color: var(--dv-color-nord-frost);
  --dv-active-sash-color: var(--dv-color-nord-frost);
  --dv-scrollbar-background-color: rgba(76, 86, 106, 0.5);
}
.dockview-theme-nord .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {
  position: relative;
}
.dockview-theme-nord .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after {
  position: absolute;
  left: 0px;
  bottom: 0px;
  content: "";
  width: 100%;
  height: 2px;
  background-color: var(--dv-color-nord-frost);
  z-index: 999;
}
.dockview-theme-nord .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {
  position: relative;
}
.dockview-theme-nord .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after {
  position: absolute;
  left: 0px;
  bottom: 0px;
  content: "";
  width: 100%;
  height: 2px;
  background-color: var(--dv-color-nord-frost-2);
  z-index: 999;
}

.dockview-theme-nord-spaced {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
  --dv-spacing-padding: 10px;
  --dv-tab-font-size: 12px;
  --dv-border-radius: 12px;
  --dv-tab-margin-block: 0.5rem;
  --dv-tab-margin-inline: 0.25rem;
  --dv-tab-margin: var(--dv-tab-margin-block) var(--dv-tab-margin-inline);
  --dv-tabs-and-actions-container-height: 44px;
  --dv-tab-border-radius: 8px;
  --dv-sash-border-radius: 4px;
  --dv-dropdown-border-radius: 8px;
  --dv-tab-close-icon-size: 8px;
  --dv-floating-group-border: 2px solid var(--dv-group-view-background-color);
  --dv-floating-titlebar-background-color: var(
      --dv-group-view-background-color
  );
  --dv-floating-titlebar-border-bottom: none;
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
  background-color: var(--dv-group-view-background-color);
}
.dockview-theme-nord-spaced .dv-dockview {
  padding: 0;
}
.dockview-theme-nord-spaced .dv-resize-container:has(> .dv-groupview) {
  border-radius: 8px;
}
.dockview-theme-nord-spaced .dv-sash {
  border-radius: var(--dv-sash-border-radius);
}
.dockview-theme-nord-spaced .dv-drop-target-anchor {
  border-radius: calc(var(--dv-border-radius) / 4);
}
.dockview-theme-nord-spaced .dv-drop-target-anchor.dv-drop-target-content {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-resize-container {
  border-radius: var(--dv-border-radius) !important;
  border: none;
}
.dockview-theme-nord-spaced .dv-resize-container .dv-groupview {
  border: var(--dv-floating-group-border);
}
.dockview-theme-nord-spaced .dv-resize-container > .dv-grid-view {
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
}
.dockview-theme-nord-spaced .dv-resize-container-with-titlebar > .dv-grid-view {
  padding-top: 0;
}
.dockview-theme-nord-spaced .dv-resize-container-with-titlebar > .dv-floating-titlebar {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-tabs-overflow-container,
.dockview-theme-nord-spaced .dv-tabs-overflow-dropdown-default {
  border-radius: var(--dv-dropdown-border-radius);
  height: unset !important;
}
.dockview-theme-nord-spaced .dv-render-overlay {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-tab {
  border-radius: var(--dv-tab-border-radius);
}
.dockview-theme-nord-spaced .dv-tab .dv-svg {
  height: var(--dv-tab-close-icon-size);
  width: var(--dv-tab-close-icon-size);
}
.dockview-theme-nord-spaced .dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab {
  height: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-nord-spaced .dv-tabs-container-vertical .dv-tab {
  margin: var(--dv-tab-margin-inline) var(--dv-tab-margin-block);
}
.dockview-theme-nord-spaced .dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab {
  width: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-nord-spaced .dv-groupview {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-groupview .dv-tabs-and-actions-container {
  padding: 0px calc(var(--dv-border-radius) / 2);
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-groupview .dv-tabs-and-actions-container.dv-groupview-header-vertical {
  padding: calc(var(--dv-border-radius) / 2) 0;
}
.dockview-theme-nord-spaced .dv-groupview .dv-content-container {
  background-color: var(--dv-tabs-and-actions-container-background-color);
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-groupview.dv-groupview-header-bottom > .dv-tabs-and-actions-container {
  border-radius: 0 0 var(--dv-border-radius) var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-groupview.dv-groupview-header-bottom > .dv-content-container {
  border-radius: var(--dv-border-radius) var(--dv-border-radius) 0 0;
}
.dockview-theme-nord-spaced .dv-groupview.dv-groupview-header-left > .dv-tabs-and-actions-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-groupview.dv-groupview-header-left > .dv-content-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-nord-spaced .dv-groupview.dv-groupview-header-right > .dv-tabs-and-actions-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-nord-spaced .dv-groupview.dv-groupview-header-right > .dv-content-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-groupview.dv-edge-tool-window .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-groupview.dv-edge-tool-window .dv-content-container {
  border-radius: 0;
}
.dockview-theme-nord-spaced .dv-groupview.dv-edge-tool-window .dv-tabs-and-actions-container {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-edge-peek {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-edge-peek-clip {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-nord-spaced .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-nord-spaced {
  color-scheme: dark;
  --dv-color-nord-polar-0: #2e3440;
  --dv-color-nord-polar-1: #3b4252;
  --dv-color-nord-polar-2: #434c5e;
  --dv-color-nord-polar-3: #4c566a;
  --dv-color-nord-frost: #88c0d0;
  --dv-color-nord-frost-2: #81a1c1;
  --dv-color-nord-snow-0: #eceff4;
  --dv-color-nord-snow-1: #d8dee9;
  --dv-group-view-background-color: var(--dv-color-nord-polar-0);
  --dv-tabs-and-actions-container-background-color: var(
      --dv-color-nord-polar-1
  );
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-nord-polar-2
  );
  --dv-activegroup-hiddenpanel-tab-background-color: var(
      --dv-color-nord-polar-1
  );
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-nord-polar-2
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: var(
      --dv-color-nord-polar-1
  );
  --dv-activegroup-visiblepanel-tab-color: var(--dv-color-nord-snow-0);
  --dv-activegroup-hiddenpanel-tab-color: var(--dv-color-nord-snow-1);
  --dv-inactivegroup-visiblepanel-tab-color: #8a9bbf;
  --dv-inactivegroup-hiddenpanel-tab-color: #5e6f8e;
  --dv-separator-border: transparent;
  --dv-paneview-active-outline-color: var(--dv-color-nord-frost);
  --dv-active-sash-color: var(--dv-color-nord-frost);
  --dv-scrollbar-background-color: rgba(76, 86, 106, 0.5);
  --dv-floating-group-border: 2px solid var(--dv-color-nord-polar-0);
}

.dockview-theme-catppuccin-mocha {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
}
.dockview-theme-catppuccin-mocha .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {
  opacity: 0;
  transition: none;
}
.dockview-theme-catppuccin-mocha {
  color-scheme: dark;
  --dv-color-mocha-crust: #11111b;
  --dv-color-mocha-mantle: #181825;
  --dv-color-mocha-base: #1e1e2e;
  --dv-color-mocha-surface0: #313244;
  --dv-color-mocha-surface1: #45475a;
  --dv-color-mocha-text: #cdd6f4;
  --dv-color-mocha-subtext1: #bac2de;
  --dv-color-mocha-subtext0: #a6adc8;
  --dv-color-mocha-mauve: #cba6f7;
  --dv-color-mocha-lavender: #b4befe;
  --dv-group-view-background-color: var(--dv-color-mocha-base);
  --dv-tabs-and-actions-container-background-color: var(
      --dv-color-mocha-mantle
  );
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-mocha-base
  );
  --dv-activegroup-hiddenpanel-tab-background-color: var(
      --dv-color-mocha-surface0
  );
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-mocha-mantle
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: var(
      --dv-color-mocha-crust
  );
  --dv-activegroup-visiblepanel-tab-color: var(--dv-color-mocha-text);
  --dv-activegroup-hiddenpanel-tab-color: var(--dv-color-mocha-subtext1);
  --dv-inactivegroup-visiblepanel-tab-color: var(--dv-color-mocha-subtext0);
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(166, 173, 200, 0.5);
  --dv-separator-border: var(--dv-color-mocha-surface1);
  --dv-paneview-active-outline-color: var(--dv-color-mocha-mauve);
  --dv-active-sash-color: var(--dv-color-mocha-mauve);
  --dv-scrollbar-background-color: rgba(49, 50, 68, 0.8);
}
.dockview-theme-catppuccin-mocha .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {
  position: relative;
}
.dockview-theme-catppuccin-mocha .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after {
  position: absolute;
  left: 0px;
  bottom: 0px;
  content: "";
  width: 100%;
  height: 2px;
  background-color: var(--dv-color-mocha-mauve);
  z-index: 999;
}
.dockview-theme-catppuccin-mocha .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {
  position: relative;
}
.dockview-theme-catppuccin-mocha .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after {
  position: absolute;
  left: 0px;
  bottom: 0px;
  content: "";
  width: 100%;
  height: 2px;
  background-color: rgba(180, 190, 254, 0.4);
  z-index: 999;
}

.dockview-theme-catppuccin-mocha-spaced {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
  --dv-spacing-padding: 10px;
  --dv-tab-font-size: 12px;
  --dv-border-radius: 12px;
  --dv-tab-margin-block: 0.5rem;
  --dv-tab-margin-inline: 0.25rem;
  --dv-tab-margin: var(--dv-tab-margin-block) var(--dv-tab-margin-inline);
  --dv-tabs-and-actions-container-height: 44px;
  --dv-tab-border-radius: 8px;
  --dv-sash-border-radius: 4px;
  --dv-dropdown-border-radius: 8px;
  --dv-tab-close-icon-size: 8px;
  --dv-floating-group-border: 2px solid var(--dv-group-view-background-color);
  --dv-floating-titlebar-background-color: var(
      --dv-group-view-background-color
  );
  --dv-floating-titlebar-border-bottom: none;
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
  background-color: var(--dv-group-view-background-color);
}
.dockview-theme-catppuccin-mocha-spaced .dv-dockview {
  padding: 0;
}
.dockview-theme-catppuccin-mocha-spaced .dv-resize-container:has(> .dv-groupview) {
  border-radius: 8px;
}
.dockview-theme-catppuccin-mocha-spaced .dv-sash {
  border-radius: var(--dv-sash-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-drop-target-anchor {
  border-radius: calc(var(--dv-border-radius) / 4);
}
.dockview-theme-catppuccin-mocha-spaced .dv-drop-target-anchor.dv-drop-target-content {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-resize-container {
  border-radius: var(--dv-border-radius) !important;
  border: none;
}
.dockview-theme-catppuccin-mocha-spaced .dv-resize-container .dv-groupview {
  border: var(--dv-floating-group-border);
}
.dockview-theme-catppuccin-mocha-spaced .dv-resize-container > .dv-grid-view {
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
}
.dockview-theme-catppuccin-mocha-spaced .dv-resize-container-with-titlebar > .dv-grid-view {
  padding-top: 0;
}
.dockview-theme-catppuccin-mocha-spaced .dv-resize-container-with-titlebar > .dv-floating-titlebar {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-tabs-overflow-container,
.dockview-theme-catppuccin-mocha-spaced .dv-tabs-overflow-dropdown-default {
  border-radius: var(--dv-dropdown-border-radius);
  height: unset !important;
}
.dockview-theme-catppuccin-mocha-spaced .dv-render-overlay {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-tab {
  border-radius: var(--dv-tab-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-tab .dv-svg {
  height: var(--dv-tab-close-icon-size);
  width: var(--dv-tab-close-icon-size);
}
.dockview-theme-catppuccin-mocha-spaced .dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab {
  height: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-catppuccin-mocha-spaced .dv-tabs-container-vertical .dv-tab {
  margin: var(--dv-tab-margin-inline) var(--dv-tab-margin-block);
}
.dockview-theme-catppuccin-mocha-spaced .dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab {
  width: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview .dv-tabs-and-actions-container {
  padding: 0px calc(var(--dv-border-radius) / 2);
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview .dv-tabs-and-actions-container.dv-groupview-header-vertical {
  padding: calc(var(--dv-border-radius) / 2) 0;
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview .dv-content-container {
  background-color: var(--dv-tabs-and-actions-container-background-color);
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview.dv-groupview-header-bottom > .dv-tabs-and-actions-container {
  border-radius: 0 0 var(--dv-border-radius) var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview.dv-groupview-header-bottom > .dv-content-container {
  border-radius: var(--dv-border-radius) var(--dv-border-radius) 0 0;
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview.dv-groupview-header-left > .dv-tabs-and-actions-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview.dv-groupview-header-left > .dv-content-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview.dv-groupview-header-right > .dv-tabs-and-actions-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview.dv-groupview-header-right > .dv-content-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview.dv-edge-tool-window .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview.dv-edge-tool-window .dv-content-container {
  border-radius: 0;
}
.dockview-theme-catppuccin-mocha-spaced .dv-groupview.dv-edge-tool-window .dv-tabs-and-actions-container {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-edge-peek {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-edge-peek-clip {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-catppuccin-mocha-spaced {
  color-scheme: dark;
  --dv-color-mocha-crust: #11111b;
  --dv-color-mocha-mantle: #181825;
  --dv-color-mocha-base: #1e1e2e;
  --dv-color-mocha-surface0: #313244;
  --dv-color-mocha-surface1: #45475a;
  --dv-color-mocha-text: #cdd6f4;
  --dv-color-mocha-subtext1: #bac2de;
  --dv-color-mocha-subtext0: #a6adc8;
  --dv-color-mocha-mauve: #cba6f7;
  --dv-color-mocha-lavender: #b4befe;
  --dv-group-view-background-color: var(--dv-color-mocha-crust);
  --dv-tabs-and-actions-container-background-color: var(
      --dv-color-mocha-mantle
  );
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-mocha-surface0
  );
  --dv-activegroup-hiddenpanel-tab-background-color: var(
      --dv-color-mocha-mantle
  );
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-mocha-surface0
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: var(
      --dv-color-mocha-mantle
  );
  --dv-activegroup-visiblepanel-tab-color: var(--dv-color-mocha-text);
  --dv-activegroup-hiddenpanel-tab-color: var(--dv-color-mocha-subtext1);
  --dv-inactivegroup-visiblepanel-tab-color: var(--dv-color-mocha-subtext0);
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(166, 173, 200, 0.5);
  --dv-separator-border: transparent;
  --dv-paneview-active-outline-color: var(--dv-color-mocha-mauve);
  --dv-active-sash-color: var(--dv-color-mocha-mauve);
  --dv-scrollbar-background-color: rgba(49, 50, 68, 0.8);
  --dv-floating-group-border: 2px solid var(--dv-color-mocha-crust);
}

.dockview-theme-monokai {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
}
.dockview-theme-monokai .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {
  opacity: 0;
  transition: none;
}
.dockview-theme-monokai {
  color-scheme: dark;
  --dv-color-monokai-bg: #272822;
  --dv-color-monokai-bg-light: #3e3d32;
  --dv-color-monokai-comment: #75715e;
  --dv-color-monokai-fg: #f8f8f2;
  --dv-color-monokai-green: #a6e22e;
  --dv-group-view-background-color: var(--dv-color-monokai-bg);
  --dv-tabs-and-actions-container-background-color: var(
      --dv-color-monokai-bg-light
  );
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-monokai-bg
  );
  --dv-activegroup-hiddenpanel-tab-background-color: #2d2c25;
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-monokai-bg
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: #2d2c25;
  --dv-activegroup-visiblepanel-tab-color: var(--dv-color-monokai-fg);
  --dv-activegroup-hiddenpanel-tab-color: var(--dv-color-monokai-comment);
  --dv-inactivegroup-visiblepanel-tab-color: rgba(248, 248, 242, 0.5);
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(117, 113, 94, 0.5);
  --dv-separator-border: var(--dv-color-monokai-bg-light);
  --dv-paneview-active-outline-color: var(--dv-color-monokai-green);
  --dv-active-sash-color: var(--dv-color-monokai-green);
  --dv-scrollbar-background-color: rgba(117, 113, 94, 0.5);
}
.dockview-theme-monokai .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {
  position: relative;
}
.dockview-theme-monokai .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after {
  position: absolute;
  left: 0px;
  bottom: 0px;
  content: "";
  width: 100%;
  height: 2px;
  background-color: var(--dv-color-monokai-green);
  z-index: 999;
}
.dockview-theme-monokai .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {
  position: relative;
}
.dockview-theme-monokai .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after {
  position: absolute;
  left: 0px;
  bottom: 0px;
  content: "";
  width: 100%;
  height: 2px;
  background-color: rgba(166, 226, 46, 0.35);
  z-index: 999;
}

.dockview-theme-solarized-light {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
}
.dockview-theme-solarized-light .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {
  opacity: 0;
  transition: none;
}
.dockview-theme-solarized-light {
  color-scheme: light;
  --dv-color-sol-base3: #fdf6e3;
  --dv-color-sol-base2: #eee8d5;
  --dv-color-sol-base1: #93a1a1;
  --dv-color-sol-base00: #657b83;
  --dv-color-sol-base01: #586e75;
  --dv-color-sol-blue: #268bd2;
  --dv-group-view-background-color: var(--dv-color-sol-base3);
  --dv-tabs-and-actions-container-background-color: var(--dv-color-sol-base2);
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-sol-base3
  );
  --dv-activegroup-hiddenpanel-tab-background-color: #e8e2d0;
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-sol-base3
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: #e8e2d0;
  --dv-activegroup-visiblepanel-tab-color: var(--dv-color-sol-base01);
  --dv-activegroup-hiddenpanel-tab-color: var(--dv-color-sol-base00);
  --dv-inactivegroup-visiblepanel-tab-color: var(--dv-color-sol-base1);
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(147, 161, 161, 0.6);
  --dv-separator-border: var(--dv-color-sol-base2);
  --dv-paneview-active-outline-color: var(--dv-color-sol-blue);
  --dv-active-sash-color: var(--dv-color-sol-blue);
  --dv-scrollbar-background-color: rgba(101, 123, 131, 0.25);
  --dv-drag-over-background-color: rgba(38, 139, 210, 0.15);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  --dv-floating-border: 1px solid rgba(0, 0, 0, 0.1);
}

.dockview-theme-solarized-light-spaced {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
  --dv-spacing-padding: 10px;
  --dv-tab-font-size: 12px;
  --dv-border-radius: 12px;
  --dv-tab-margin-block: 0.5rem;
  --dv-tab-margin-inline: 0.25rem;
  --dv-tab-margin: var(--dv-tab-margin-block) var(--dv-tab-margin-inline);
  --dv-tabs-and-actions-container-height: 44px;
  --dv-tab-border-radius: 8px;
  --dv-sash-border-radius: 4px;
  --dv-dropdown-border-radius: 8px;
  --dv-tab-close-icon-size: 8px;
  --dv-floating-group-border: 2px solid var(--dv-group-view-background-color);
  --dv-floating-titlebar-background-color: var(
      --dv-group-view-background-color
  );
  --dv-floating-titlebar-border-bottom: none;
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
  background-color: var(--dv-group-view-background-color);
}
.dockview-theme-solarized-light-spaced .dv-dockview {
  padding: 0;
}
.dockview-theme-solarized-light-spaced .dv-resize-container:has(> .dv-groupview) {
  border-radius: 8px;
}
.dockview-theme-solarized-light-spaced .dv-sash {
  border-radius: var(--dv-sash-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-drop-target-anchor {
  border-radius: calc(var(--dv-border-radius) / 4);
}
.dockview-theme-solarized-light-spaced .dv-drop-target-anchor.dv-drop-target-content {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-resize-container {
  border-radius: var(--dv-border-radius) !important;
  border: none;
}
.dockview-theme-solarized-light-spaced .dv-resize-container .dv-groupview {
  border: var(--dv-floating-group-border);
}
.dockview-theme-solarized-light-spaced .dv-resize-container > .dv-grid-view {
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
}
.dockview-theme-solarized-light-spaced .dv-resize-container-with-titlebar > .dv-grid-view {
  padding-top: 0;
}
.dockview-theme-solarized-light-spaced .dv-resize-container-with-titlebar > .dv-floating-titlebar {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-tabs-overflow-container,
.dockview-theme-solarized-light-spaced .dv-tabs-overflow-dropdown-default {
  border-radius: var(--dv-dropdown-border-radius);
  height: unset !important;
}
.dockview-theme-solarized-light-spaced .dv-render-overlay {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-tab {
  border-radius: var(--dv-tab-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-tab .dv-svg {
  height: var(--dv-tab-close-icon-size);
  width: var(--dv-tab-close-icon-size);
}
.dockview-theme-solarized-light-spaced .dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab {
  height: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-solarized-light-spaced .dv-tabs-container-vertical .dv-tab {
  margin: var(--dv-tab-margin-inline) var(--dv-tab-margin-block);
}
.dockview-theme-solarized-light-spaced .dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab {
  width: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-solarized-light-spaced .dv-groupview {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-groupview .dv-tabs-and-actions-container {
  padding: 0px calc(var(--dv-border-radius) / 2);
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-groupview .dv-tabs-and-actions-container.dv-groupview-header-vertical {
  padding: calc(var(--dv-border-radius) / 2) 0;
}
.dockview-theme-solarized-light-spaced .dv-groupview .dv-content-container {
  background-color: var(--dv-tabs-and-actions-container-background-color);
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-groupview.dv-groupview-header-bottom > .dv-tabs-and-actions-container {
  border-radius: 0 0 var(--dv-border-radius) var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-groupview.dv-groupview-header-bottom > .dv-content-container {
  border-radius: var(--dv-border-radius) var(--dv-border-radius) 0 0;
}
.dockview-theme-solarized-light-spaced .dv-groupview.dv-groupview-header-left > .dv-tabs-and-actions-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-groupview.dv-groupview-header-left > .dv-content-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-solarized-light-spaced .dv-groupview.dv-groupview-header-right > .dv-tabs-and-actions-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-solarized-light-spaced .dv-groupview.dv-groupview-header-right > .dv-content-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-groupview.dv-edge-tool-window .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-groupview.dv-edge-tool-window .dv-content-container {
  border-radius: 0;
}
.dockview-theme-solarized-light-spaced .dv-groupview.dv-edge-tool-window .dv-tabs-and-actions-container {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-edge-peek {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-edge-peek-clip {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-solarized-light-spaced {
  color-scheme: light;
  --dv-color-sol-base3: #fdf6e3;
  --dv-color-sol-base2: #eee8d5;
  --dv-color-sol-base1: #93a1a1;
  --dv-color-sol-base00: #657b83;
  --dv-color-sol-base01: #586e75;
  --dv-color-sol-blue: #268bd2;
  --dv-drag-over-background-color: rgba(38, 139, 210, 0.1);
  --dv-group-view-background-color: var(--dv-color-sol-base2);
  --dv-tabs-and-actions-container-background-color: var(--dv-color-sol-base3);
  --dv-activegroup-visiblepanel-tab-background-color: #e8e2d0;
  --dv-activegroup-hiddenpanel-tab-background-color: var(
      --dv-color-sol-base3
  );
  --dv-inactivegroup-visiblepanel-tab-background-color: #e8e2d0;
  --dv-inactivegroup-hiddenpanel-tab-background-color: var(
      --dv-color-sol-base3
  );
  --dv-activegroup-visiblepanel-tab-color: var(--dv-color-sol-base01);
  --dv-activegroup-hiddenpanel-tab-color: var(--dv-color-sol-base00);
  --dv-inactivegroup-visiblepanel-tab-color: var(--dv-color-sol-base1);
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(147, 161, 161, 0.6);
  --dv-separator-border: transparent;
  --dv-paneview-active-outline-color: var(--dv-color-sol-blue);
  --dv-active-sash-color: var(--dv-color-sol-blue);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  --dv-floating-border: 1px solid rgba(0, 0, 0, 0.1);
  --dv-scrollbar-background-color: rgba(101, 123, 131, 0.25);
  --dv-floating-group-border: 2px solid rgba(238, 232, 213, 0.5);
}

.dockview-theme-github-dark {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
}
.dockview-theme-github-dark .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {
  opacity: 0;
  transition: none;
}
.dockview-theme-github-dark {
  color-scheme: dark;
  --dv-color-gh-canvas-default: #0d1117;
  --dv-color-gh-canvas-subtle: #161b22;
  --dv-color-gh-canvas-inset: #010409;
  --dv-color-gh-border: #30363d;
  --dv-color-gh-border-muted: #21262d;
  --dv-color-gh-fg-default: #e6edf3;
  --dv-color-gh-fg-muted: #8b949e;
  --dv-color-gh-fg-subtle: #6e7681;
  --dv-color-gh-accent: #58a6ff;
  --dv-group-view-background-color: var(--dv-color-gh-canvas-default);
  --dv-tabs-and-actions-container-background-color: var(
      --dv-color-gh-canvas-subtle
  );
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-gh-canvas-default
  );
  --dv-activegroup-hiddenpanel-tab-background-color: var(
      --dv-color-gh-canvas-subtle
  );
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-gh-canvas-default
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: var(
      --dv-color-gh-canvas-subtle
  );
  --dv-activegroup-visiblepanel-tab-color: var(--dv-color-gh-fg-default);
  --dv-activegroup-hiddenpanel-tab-color: var(--dv-color-gh-fg-muted);
  --dv-inactivegroup-visiblepanel-tab-color: var(--dv-color-gh-fg-subtle);
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(110, 118, 129, 0.5);
  --dv-separator-border: var(--dv-color-gh-border);
  --dv-paneview-active-outline-color: var(--dv-color-gh-accent);
  --dv-active-sash-color: var(--dv-color-gh-accent);
  --dv-scrollbar-background-color: rgba(48, 54, 61, 0.7);
  --dv-drag-over-background-color: rgba(88, 166, 255, 0.15);
}

.dockview-theme-github-dark-spaced {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
  --dv-spacing-padding: 10px;
  --dv-tab-font-size: 12px;
  --dv-border-radius: 12px;
  --dv-tab-margin-block: 0.5rem;
  --dv-tab-margin-inline: 0.25rem;
  --dv-tab-margin: var(--dv-tab-margin-block) var(--dv-tab-margin-inline);
  --dv-tabs-and-actions-container-height: 44px;
  --dv-tab-border-radius: 8px;
  --dv-sash-border-radius: 4px;
  --dv-dropdown-border-radius: 8px;
  --dv-tab-close-icon-size: 8px;
  --dv-floating-group-border: 2px solid var(--dv-group-view-background-color);
  --dv-floating-titlebar-background-color: var(
      --dv-group-view-background-color
  );
  --dv-floating-titlebar-border-bottom: none;
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
  background-color: var(--dv-group-view-background-color);
}
.dockview-theme-github-dark-spaced .dv-dockview {
  padding: 0;
}
.dockview-theme-github-dark-spaced .dv-resize-container:has(> .dv-groupview) {
  border-radius: 8px;
}
.dockview-theme-github-dark-spaced .dv-sash {
  border-radius: var(--dv-sash-border-radius);
}
.dockview-theme-github-dark-spaced .dv-drop-target-anchor {
  border-radius: calc(var(--dv-border-radius) / 4);
}
.dockview-theme-github-dark-spaced .dv-drop-target-anchor.dv-drop-target-content {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-resize-container {
  border-radius: var(--dv-border-radius) !important;
  border: none;
}
.dockview-theme-github-dark-spaced .dv-resize-container .dv-groupview {
  border: var(--dv-floating-group-border);
}
.dockview-theme-github-dark-spaced .dv-resize-container > .dv-grid-view {
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
}
.dockview-theme-github-dark-spaced .dv-resize-container-with-titlebar > .dv-grid-view {
  padding-top: 0;
}
.dockview-theme-github-dark-spaced .dv-resize-container-with-titlebar > .dv-floating-titlebar {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-tabs-overflow-container,
.dockview-theme-github-dark-spaced .dv-tabs-overflow-dropdown-default {
  border-radius: var(--dv-dropdown-border-radius);
  height: unset !important;
}
.dockview-theme-github-dark-spaced .dv-render-overlay {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-tab {
  border-radius: var(--dv-tab-border-radius);
}
.dockview-theme-github-dark-spaced .dv-tab .dv-svg {
  height: var(--dv-tab-close-icon-size);
  width: var(--dv-tab-close-icon-size);
}
.dockview-theme-github-dark-spaced .dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab {
  height: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-github-dark-spaced .dv-tabs-container-vertical .dv-tab {
  margin: var(--dv-tab-margin-inline) var(--dv-tab-margin-block);
}
.dockview-theme-github-dark-spaced .dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab {
  width: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-github-dark-spaced .dv-groupview {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-groupview .dv-tabs-and-actions-container {
  padding: 0px calc(var(--dv-border-radius) / 2);
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-groupview .dv-tabs-and-actions-container.dv-groupview-header-vertical {
  padding: calc(var(--dv-border-radius) / 2) 0;
}
.dockview-theme-github-dark-spaced .dv-groupview .dv-content-container {
  background-color: var(--dv-tabs-and-actions-container-background-color);
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-groupview.dv-groupview-header-bottom > .dv-tabs-and-actions-container {
  border-radius: 0 0 var(--dv-border-radius) var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-groupview.dv-groupview-header-bottom > .dv-content-container {
  border-radius: var(--dv-border-radius) var(--dv-border-radius) 0 0;
}
.dockview-theme-github-dark-spaced .dv-groupview.dv-groupview-header-left > .dv-tabs-and-actions-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-groupview.dv-groupview-header-left > .dv-content-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-github-dark-spaced .dv-groupview.dv-groupview-header-right > .dv-tabs-and-actions-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-github-dark-spaced .dv-groupview.dv-groupview-header-right > .dv-content-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-groupview.dv-edge-tool-window .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-groupview.dv-edge-tool-window .dv-content-container {
  border-radius: 0;
}
.dockview-theme-github-dark-spaced .dv-groupview.dv-edge-tool-window .dv-tabs-and-actions-container {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-edge-peek {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-edge-peek-clip {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-dark-spaced {
  color-scheme: dark;
  --dv-color-gh-canvas-default: #0d1117;
  --dv-color-gh-canvas-subtle: #161b22;
  --dv-color-gh-canvas-inset: #010409;
  --dv-color-gh-border: #30363d;
  --dv-color-gh-border-muted: #21262d;
  --dv-color-gh-fg-default: #e6edf3;
  --dv-color-gh-fg-muted: #8b949e;
  --dv-color-gh-fg-subtle: #6e7681;
  --dv-color-gh-accent: #58a6ff;
  --dv-drag-over-background-color: rgba(88, 166, 255, 0.1);
  --dv-group-view-background-color: var(--dv-color-gh-canvas-inset);
  --dv-tabs-and-actions-container-background-color: var(
      --dv-color-gh-canvas-subtle
  );
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-gh-border
  );
  --dv-activegroup-hiddenpanel-tab-background-color: var(
      --dv-color-gh-canvas-subtle
  );
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-gh-border
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: var(
      --dv-color-gh-canvas-subtle
  );
  --dv-activegroup-visiblepanel-tab-color: var(--dv-color-gh-fg-default);
  --dv-activegroup-hiddenpanel-tab-color: var(--dv-color-gh-fg-muted);
  --dv-inactivegroup-visiblepanel-tab-color: var(--dv-color-gh-fg-subtle);
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(110, 118, 129, 0.5);
  --dv-separator-border: transparent;
  --dv-paneview-active-outline-color: var(--dv-color-gh-accent);
  --dv-active-sash-color: var(--dv-color-gh-accent);
  --dv-scrollbar-background-color: rgba(48, 54, 61, 0.7);
  --dv-floating-group-border: 2px solid var(--dv-color-gh-canvas-inset);
}

.dockview-theme-github-light {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
}
.dockview-theme-github-light .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {
  opacity: 0;
  transition: none;
}
.dockview-theme-github-light {
  color-scheme: light;
  --dv-color-gh-light-canvas-default: #ffffff;
  --dv-color-gh-light-canvas-subtle: #f6f8fa;
  --dv-color-gh-light-canvas-inset: #f0f6ff;
  --dv-color-gh-light-border: #d0d7de;
  --dv-color-gh-light-fg-default: #1f2328;
  --dv-color-gh-light-fg-muted: #656d76;
  --dv-color-gh-light-fg-subtle: #6e7781;
  --dv-color-gh-light-accent: #0969da;
  --dv-group-view-background-color: var(--dv-color-gh-light-canvas-default);
  --dv-tabs-and-actions-container-background-color: var(
      --dv-color-gh-light-canvas-subtle
  );
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-gh-light-canvas-default
  );
  --dv-activegroup-hiddenpanel-tab-background-color: var(
      --dv-color-gh-light-canvas-subtle
  );
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-gh-light-canvas-default
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: var(
      --dv-color-gh-light-canvas-subtle
  );
  --dv-activegroup-visiblepanel-tab-color: var(
      --dv-color-gh-light-fg-default
  );
  --dv-activegroup-hiddenpanel-tab-color: var(--dv-color-gh-light-fg-muted);
  --dv-inactivegroup-visiblepanel-tab-color: var(
      --dv-color-gh-light-fg-subtle
  );
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(110, 118, 129, 0.4);
  --dv-separator-border: var(--dv-color-gh-light-border);
  --dv-paneview-active-outline-color: var(--dv-color-gh-light-accent);
  --dv-active-sash-color: var(--dv-color-gh-light-accent);
  --dv-scrollbar-background-color: rgba(208, 215, 222, 0.5);
  --dv-drag-over-background-color: rgba(9, 105, 218, 0.1);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  --dv-floating-border: 1px solid rgba(0, 0, 0, 0.1);
}

.dockview-theme-github-light-spaced {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
  --dv-spacing-padding: 10px;
  --dv-tab-font-size: 12px;
  --dv-border-radius: 12px;
  --dv-tab-margin-block: 0.5rem;
  --dv-tab-margin-inline: 0.25rem;
  --dv-tab-margin: var(--dv-tab-margin-block) var(--dv-tab-margin-inline);
  --dv-tabs-and-actions-container-height: 44px;
  --dv-tab-border-radius: 8px;
  --dv-sash-border-radius: 4px;
  --dv-dropdown-border-radius: 8px;
  --dv-tab-close-icon-size: 8px;
  --dv-floating-group-border: 2px solid var(--dv-group-view-background-color);
  --dv-floating-titlebar-background-color: var(
      --dv-group-view-background-color
  );
  --dv-floating-titlebar-border-bottom: none;
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
  background-color: var(--dv-group-view-background-color);
}
.dockview-theme-github-light-spaced .dv-dockview {
  padding: 0;
}
.dockview-theme-github-light-spaced .dv-resize-container:has(> .dv-groupview) {
  border-radius: 8px;
}
.dockview-theme-github-light-spaced .dv-sash {
  border-radius: var(--dv-sash-border-radius);
}
.dockview-theme-github-light-spaced .dv-drop-target-anchor {
  border-radius: calc(var(--dv-border-radius) / 4);
}
.dockview-theme-github-light-spaced .dv-drop-target-anchor.dv-drop-target-content {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-resize-container {
  border-radius: var(--dv-border-radius) !important;
  border: none;
}
.dockview-theme-github-light-spaced .dv-resize-container .dv-groupview {
  border: var(--dv-floating-group-border);
}
.dockview-theme-github-light-spaced .dv-resize-container > .dv-grid-view {
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
}
.dockview-theme-github-light-spaced .dv-resize-container-with-titlebar > .dv-grid-view {
  padding-top: 0;
}
.dockview-theme-github-light-spaced .dv-resize-container-with-titlebar > .dv-floating-titlebar {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-tabs-overflow-container,
.dockview-theme-github-light-spaced .dv-tabs-overflow-dropdown-default {
  border-radius: var(--dv-dropdown-border-radius);
  height: unset !important;
}
.dockview-theme-github-light-spaced .dv-render-overlay {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-tab {
  border-radius: var(--dv-tab-border-radius);
}
.dockview-theme-github-light-spaced .dv-tab .dv-svg {
  height: var(--dv-tab-close-icon-size);
  width: var(--dv-tab-close-icon-size);
}
.dockview-theme-github-light-spaced .dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab {
  height: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-github-light-spaced .dv-tabs-container-vertical .dv-tab {
  margin: var(--dv-tab-margin-inline) var(--dv-tab-margin-block);
}
.dockview-theme-github-light-spaced .dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab {
  width: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-github-light-spaced .dv-groupview {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-groupview .dv-tabs-and-actions-container {
  padding: 0px calc(var(--dv-border-radius) / 2);
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-groupview .dv-tabs-and-actions-container.dv-groupview-header-vertical {
  padding: calc(var(--dv-border-radius) / 2) 0;
}
.dockview-theme-github-light-spaced .dv-groupview .dv-content-container {
  background-color: var(--dv-tabs-and-actions-container-background-color);
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-groupview.dv-groupview-header-bottom > .dv-tabs-and-actions-container {
  border-radius: 0 0 var(--dv-border-radius) var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-groupview.dv-groupview-header-bottom > .dv-content-container {
  border-radius: var(--dv-border-radius) var(--dv-border-radius) 0 0;
}
.dockview-theme-github-light-spaced .dv-groupview.dv-groupview-header-left > .dv-tabs-and-actions-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-groupview.dv-groupview-header-left > .dv-content-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-github-light-spaced .dv-groupview.dv-groupview-header-right > .dv-tabs-and-actions-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-github-light-spaced .dv-groupview.dv-groupview-header-right > .dv-content-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-groupview.dv-edge-tool-window .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-groupview.dv-edge-tool-window .dv-content-container {
  border-radius: 0;
}
.dockview-theme-github-light-spaced .dv-groupview.dv-edge-tool-window .dv-tabs-and-actions-container {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-edge-peek {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-edge-peek-clip {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-light-spaced .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-github-light-spaced {
  color-scheme: light;
  --dv-color-gh-light-canvas-default: #ffffff;
  --dv-color-gh-light-canvas-subtle: #f6f8fa;
  --dv-color-gh-light-border: #d0d7de;
  --dv-color-gh-light-fg-default: #1f2328;
  --dv-color-gh-light-fg-muted: #656d76;
  --dv-color-gh-light-fg-subtle: #6e7781;
  --dv-color-gh-light-accent: #0969da;
  --dv-drag-over-background-color: rgba(9, 105, 218, 0.08);
  --dv-group-view-background-color: var(--dv-color-gh-light-canvas-subtle);
  --dv-tabs-and-actions-container-background-color: var(
      --dv-color-gh-light-canvas-default
  );
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-gh-light-border
  );
  --dv-activegroup-hiddenpanel-tab-background-color: var(
      --dv-color-gh-light-canvas-default
  );
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-gh-light-border
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: var(
      --dv-color-gh-light-canvas-default
  );
  --dv-activegroup-visiblepanel-tab-color: var(
      --dv-color-gh-light-fg-default
  );
  --dv-activegroup-hiddenpanel-tab-color: var(--dv-color-gh-light-fg-muted);
  --dv-inactivegroup-visiblepanel-tab-color: var(
      --dv-color-gh-light-fg-subtle
  );
  --dv-inactivegroup-hiddenpanel-tab-color: rgba(110, 118, 129, 0.4);
  --dv-separator-border: transparent;
  --dv-paneview-active-outline-color: var(--dv-color-gh-light-accent);
  --dv-active-sash-color: var(--dv-color-gh-light-accent);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  --dv-floating-border: 1px solid rgba(0, 0, 0, 0.1);
  --dv-scrollbar-background-color: rgba(208, 215, 222, 0.5);
  --dv-floating-group-border: 2px solid rgba(208, 215, 222, 0.5);
}

.dockview-theme-abyss-spaced {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
  --dv-spacing-padding: 10px;
  --dv-tab-font-size: 12px;
  --dv-border-radius: 12px;
  --dv-tab-margin-block: 0.5rem;
  --dv-tab-margin-inline: 0.25rem;
  --dv-tab-margin: var(--dv-tab-margin-block) var(--dv-tab-margin-inline);
  --dv-tabs-and-actions-container-height: 44px;
  --dv-tab-border-radius: 8px;
  --dv-sash-border-radius: 4px;
  --dv-dropdown-border-radius: 8px;
  --dv-tab-close-icon-size: 8px;
  --dv-floating-group-border: 2px solid var(--dv-group-view-background-color);
  --dv-floating-titlebar-background-color: var(
      --dv-group-view-background-color
  );
  --dv-floating-titlebar-border-bottom: none;
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
  background-color: var(--dv-group-view-background-color);
}
.dockview-theme-abyss-spaced .dv-dockview {
  padding: 0;
}
.dockview-theme-abyss-spaced .dv-resize-container:has(> .dv-groupview) {
  border-radius: 8px;
}
.dockview-theme-abyss-spaced .dv-sash {
  border-radius: var(--dv-sash-border-radius);
}
.dockview-theme-abyss-spaced .dv-drop-target-anchor {
  border-radius: calc(var(--dv-border-radius) / 4);
}
.dockview-theme-abyss-spaced .dv-drop-target-anchor.dv-drop-target-content {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-resize-container {
  border-radius: var(--dv-border-radius) !important;
  border: none;
}
.dockview-theme-abyss-spaced .dv-resize-container .dv-groupview {
  border: var(--dv-floating-group-border);
}
.dockview-theme-abyss-spaced .dv-resize-container > .dv-grid-view {
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
}
.dockview-theme-abyss-spaced .dv-resize-container-with-titlebar > .dv-grid-view {
  padding-top: 0;
}
.dockview-theme-abyss-spaced .dv-resize-container-with-titlebar > .dv-floating-titlebar {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-tabs-overflow-container,
.dockview-theme-abyss-spaced .dv-tabs-overflow-dropdown-default {
  border-radius: var(--dv-dropdown-border-radius);
  height: unset !important;
}
.dockview-theme-abyss-spaced .dv-render-overlay {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-tab {
  border-radius: var(--dv-tab-border-radius);
}
.dockview-theme-abyss-spaced .dv-tab .dv-svg {
  height: var(--dv-tab-close-icon-size);
  width: var(--dv-tab-close-icon-size);
}
.dockview-theme-abyss-spaced .dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab {
  height: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-abyss-spaced .dv-tabs-container-vertical .dv-tab {
  margin: var(--dv-tab-margin-inline) var(--dv-tab-margin-block);
}
.dockview-theme-abyss-spaced .dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab {
  width: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-abyss-spaced .dv-groupview {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-groupview .dv-tabs-and-actions-container {
  padding: 0px calc(var(--dv-border-radius) / 2);
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-groupview .dv-tabs-and-actions-container.dv-groupview-header-vertical {
  padding: calc(var(--dv-border-radius) / 2) 0;
}
.dockview-theme-abyss-spaced .dv-groupview .dv-content-container {
  background-color: var(--dv-tabs-and-actions-container-background-color);
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-groupview.dv-groupview-header-bottom > .dv-tabs-and-actions-container {
  border-radius: 0 0 var(--dv-border-radius) var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-groupview.dv-groupview-header-bottom > .dv-content-container {
  border-radius: var(--dv-border-radius) var(--dv-border-radius) 0 0;
}
.dockview-theme-abyss-spaced .dv-groupview.dv-groupview-header-left > .dv-tabs-and-actions-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-groupview.dv-groupview-header-left > .dv-content-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-abyss-spaced .dv-groupview.dv-groupview-header-right > .dv-tabs-and-actions-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-abyss-spaced .dv-groupview.dv-groupview-header-right > .dv-content-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-groupview.dv-edge-tool-window .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-groupview.dv-edge-tool-window .dv-content-container {
  border-radius: 0;
}
.dockview-theme-abyss-spaced .dv-groupview.dv-edge-tool-window .dv-tabs-and-actions-container {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-edge-peek {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-edge-peek-clip {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-abyss-spaced .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-abyss-spaced {
  color-scheme: dark;
  --dv-color-abyss-dark: rgb(11, 6, 17);
  --dv-color-abyss: #16121f;
  --dv-color-abyss-light: #201d2b;
  --dv-color-abyss-lighter: #2a2837;
  --dv-color-abyss-accent: rgb(91, 30, 207);
  --dv-color-abyss-primary-text: white;
  --dv-color-abyss-secondary-text: rgb(148, 151, 169);
  --dv-drag-over-background-color: '';
  --dv-group-view-background-color: var(--dv-color-abyss-dark);
  --dv-tabs-and-actions-container-background-color: var(--dv-color-abyss);
  --dv-activegroup-visiblepanel-tab-background-color: var(
      --dv-color-abyss-lighter
  );
  --dv-activegroup-hiddenpanel-tab-background-color: var(
      --dv-color-abyss-light
  );
  --dv-inactivegroup-visiblepanel-tab-background-color: var(
      --dv-color-abyss-lighter
  );
  --dv-inactivegroup-hiddenpanel-tab-background-color: var(
      --dv-color-abyss-light
  );
  --dv-tab-divider-color: transparent;
  --dv-activegroup-visiblepanel-tab-color: var(--dv-color-abyss-primary-text);
  --dv-activegroup-hiddenpanel-tab-color: var(
      --dv-color-abyss-secondary-text
  );
  --dv-inactivegroup-visiblepanel-tab-color: var(
      --dv-color-abyss-primary-text
  );
  --dv-inactivegroup-hiddenpanel-tab-color: var(
      --dv-color-abyss-secondary-text
  );
  --dv-separator-border: transparent;
  --dv-paneview-header-border-color: rgb(51, 51, 51);
  --dv-active-sash-color: var(--dv-color-abyss-accent);
  --dv-floating-group-border: 2px solid var(--dv-color-abyss-dark);
}

.dockview-theme-light-spaced {
  --dv-paneview-active-outline-color: dodgerblue;
  --dv-tabs-and-actions-container-font-size: 13px;
  --dv-tabs-and-actions-container-height: 35px;
  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);
  --dv-drag-over-border-color: transparent;
  --dv-edge-dock-indicator-color: rgba(56, 139, 253, 0.9);
  --dv-tabs-container-scrollbar-color: #888;
  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
  --dv-floating-border: 1px solid rgba(255, 255, 255, 0.1);
  --dv-overlay-z-index: 999;
  --dv-tab-font-size: inherit;
  --dv-border-radius: 0px;
  --dv-tab-margin: 0;
  --dv-sash-color: transparent;
  --dv-active-sash-color: transparent;
  --dv-active-sash-transition-duration: 0.1s;
  --dv-active-sash-transition-delay: 0.5s;
  --dv-spacing-padding: 0px;
  --dv-tab-border-radius: 0px;
  --dv-sash-border-radius: 0px;
  --dv-dropdown-border-radius: 0px;
  --dv-tab-close-icon-size: inherit;
  --dv-floating-group-border: none;
  --dv-drag-over-border: none;
  --dv-floating-group-dragging-opacity: 0.5;
  --dv-floating-titlebar-height: 22px;
  --dv-floating-titlebar-background-color: var(
      --dv-tabs-and-actions-container-background-color
  );
  --dv-floating-titlebar-border-bottom: var(--dv-floating-border);
  --dv-tab-group-color-grey: #5f6368;
  --dv-tab-group-color-blue: #1a73e8;
  --dv-tab-group-color-red: #d93025;
  --dv-tab-group-color-yellow: #f9ab00;
  --dv-tab-group-color-green: #188038;
  --dv-tab-group-color-pink: #d01884;
  --dv-tab-group-color-purple: #a142f4;
  --dv-tab-group-color-cyan: #007b83;
  --dv-tab-group-color-orange: #e8710a;
  --dv-tab-group-chip-padding: 4px 8px;
  --dv-tab-group-chip-border-radius: 6px;
  --dv-tab-group-chip-font-size: 11px;
  --dv-tab-group-line-height: 2px;
  --dv-tab-group-line-opacity: 0.6;
  --dv-spacing-padding: 10px;
  --dv-tab-font-size: 12px;
  --dv-border-radius: 12px;
  --dv-tab-margin-block: 0.5rem;
  --dv-tab-margin-inline: 0.25rem;
  --dv-tab-margin: var(--dv-tab-margin-block) var(--dv-tab-margin-inline);
  --dv-tabs-and-actions-container-height: 44px;
  --dv-tab-border-radius: 8px;
  --dv-sash-border-radius: 4px;
  --dv-dropdown-border-radius: 8px;
  --dv-tab-close-icon-size: 8px;
  --dv-floating-group-border: 2px solid var(--dv-group-view-background-color);
  --dv-floating-titlebar-background-color: var(
      --dv-group-view-background-color
  );
  --dv-floating-titlebar-border-bottom: none;
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
  background-color: var(--dv-group-view-background-color);
}
.dockview-theme-light-spaced .dv-dockview {
  padding: 0;
}
.dockview-theme-light-spaced .dv-resize-container:has(> .dv-groupview) {
  border-radius: 8px;
}
.dockview-theme-light-spaced .dv-sash {
  border-radius: var(--dv-sash-border-radius);
}
.dockview-theme-light-spaced .dv-drop-target-anchor {
  border-radius: calc(var(--dv-border-radius) / 4);
}
.dockview-theme-light-spaced .dv-drop-target-anchor.dv-drop-target-content {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-resize-container {
  border-radius: var(--dv-border-radius) !important;
  border: none;
}
.dockview-theme-light-spaced .dv-resize-container .dv-groupview {
  border: var(--dv-floating-group-border);
}
.dockview-theme-light-spaced .dv-resize-container > .dv-grid-view {
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
}
.dockview-theme-light-spaced .dv-resize-container-with-titlebar > .dv-grid-view {
  padding-top: 0;
}
.dockview-theme-light-spaced .dv-resize-container-with-titlebar > .dv-floating-titlebar {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-tabs-overflow-container,
.dockview-theme-light-spaced .dv-tabs-overflow-dropdown-default {
  border-radius: var(--dv-dropdown-border-radius);
  height: unset !important;
}
.dockview-theme-light-spaced .dv-render-overlay {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-tab {
  border-radius: var(--dv-tab-border-radius);
}
.dockview-theme-light-spaced .dv-tab .dv-svg {
  height: var(--dv-tab-close-icon-size);
  width: var(--dv-tab-close-icon-size);
}
.dockview-theme-light-spaced .dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab {
  height: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-light-spaced .dv-tabs-container-vertical .dv-tab {
  margin: var(--dv-tab-margin-inline) var(--dv-tab-margin-block);
}
.dockview-theme-light-spaced .dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab {
  width: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-theme-light-spaced .dv-groupview {
  border-radius: var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-groupview .dv-tabs-and-actions-container {
  padding: 0px calc(var(--dv-border-radius) / 2);
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-groupview .dv-tabs-and-actions-container.dv-groupview-header-vertical {
  padding: calc(var(--dv-border-radius) / 2) 0;
}
.dockview-theme-light-spaced .dv-groupview .dv-content-container {
  background-color: var(--dv-tabs-and-actions-container-background-color);
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-groupview.dv-groupview-header-bottom > .dv-tabs-and-actions-container {
  border-radius: 0 0 var(--dv-border-radius) var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-groupview.dv-groupview-header-bottom > .dv-content-container {
  border-radius: var(--dv-border-radius) var(--dv-border-radius) 0 0;
}
.dockview-theme-light-spaced .dv-groupview.dv-groupview-header-left > .dv-tabs-and-actions-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-groupview.dv-groupview-header-left > .dv-content-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-light-spaced .dv-groupview.dv-groupview-header-right > .dv-tabs-and-actions-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-theme-light-spaced .dv-groupview.dv-groupview-header-right > .dv-content-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-groupview.dv-edge-tool-window .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-groupview.dv-edge-tool-window .dv-content-container {
  border-radius: 0;
}
.dockview-theme-light-spaced .dv-groupview.dv-edge-tool-window .dv-tabs-and-actions-container {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-edge-peek {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-edge-peek-clip {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-theme-light-spaced .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-theme-light-spaced {
  color-scheme: light;
  --dv-drag-over-background-color: '';
  --dv-group-view-background-color: #f6f5f9;
  --dv-tabs-and-actions-container-background-color: white;
  --dv-activegroup-visiblepanel-tab-background-color: #ededf0;
  --dv-activegroup-hiddenpanel-tab-background-color: #f9f9fa;
  --dv-inactivegroup-visiblepanel-tab-background-color: #ededf0;
  --dv-inactivegroup-hiddenpanel-tab-background-color: #f9f9fa;
  --dv-tab-divider-color: transparent;
  --dv-activegroup-visiblepanel-tab-color: rgb(104, 107, 130);
  --dv-activegroup-hiddenpanel-tab-color: rgb(148, 151, 169);
  --dv-inactivegroup-visiblepanel-tab-color: rgb(104, 107, 130);
  --dv-inactivegroup-hiddenpanel-tab-color: rgb(148, 151, 169);
  --dv-separator-border: transparent;
  --dv-paneview-header-border-color: rgb(51, 51, 51);
  --dv-active-sash-color: rgb(91, 30, 207);
  --dv-floating-box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  --dv-floating-border: 1px solid rgba(0, 0, 0, 0.1);
  --dv-scrollbar-background-color: rgba(0, 0, 0, 0.25);
  --dv-floating-group-border: 2px solid rgba(255, 255, 255, 0.1);
}

.dockview-spaced {
  --dv-spacing-padding: 10px;
  --dv-tab-font-size: 12px;
  --dv-border-radius: 12px;
  --dv-tab-margin-block: 0.5rem;
  --dv-tab-margin-inline: 0.25rem;
  --dv-tab-margin: var(--dv-tab-margin-block) var(--dv-tab-margin-inline);
  --dv-tabs-and-actions-container-height: 44px;
  --dv-tab-border-radius: 8px;
  --dv-sash-border-radius: 4px;
  --dv-dropdown-border-radius: 8px;
  --dv-tab-close-icon-size: 8px;
  --dv-floating-group-border: 2px solid var(--dv-group-view-background-color);
  --dv-floating-titlebar-background-color: var(
      --dv-group-view-background-color
  );
  --dv-floating-titlebar-border-bottom: none;
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
  background-color: var(--dv-group-view-background-color);
}
.dockview-spaced .dv-dockview {
  padding: 0;
}
.dockview-spaced .dv-resize-container:has(> .dv-groupview) {
  border-radius: 8px;
}
.dockview-spaced .dv-sash {
  border-radius: var(--dv-sash-border-radius);
}
.dockview-spaced .dv-drop-target-anchor {
  border-radius: calc(var(--dv-border-radius) / 4);
}
.dockview-spaced .dv-drop-target-anchor.dv-drop-target-content {
  border-radius: var(--dv-border-radius);
}
.dockview-spaced .dv-resize-container {
  border-radius: var(--dv-border-radius) !important;
  border: none;
}
.dockview-spaced .dv-resize-container .dv-groupview {
  border: var(--dv-floating-group-border);
}
.dockview-spaced .dv-resize-container > .dv-grid-view {
  box-sizing: border-box;
  padding: var(--dv-spacing-padding);
}
.dockview-spaced .dv-resize-container-with-titlebar > .dv-grid-view {
  padding-top: 0;
}
.dockview-spaced .dv-resize-container-with-titlebar > .dv-floating-titlebar {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-spaced .dv-tabs-overflow-container,
.dockview-spaced .dv-tabs-overflow-dropdown-default {
  border-radius: var(--dv-dropdown-border-radius);
  height: unset !important;
}
.dockview-spaced .dv-render-overlay {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-spaced .dv-tab {
  border-radius: var(--dv-tab-border-radius);
}
.dockview-spaced .dv-tab .dv-svg {
  height: var(--dv-tab-close-icon-size);
  width: var(--dv-tab-close-icon-size);
}
.dockview-spaced .dv-tabs-container--wrap:not(.dv-tabs-container-vertical) .dv-tab {
  height: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-spaced .dv-tabs-container-vertical .dv-tab {
  margin: var(--dv-tab-margin-inline) var(--dv-tab-margin-block);
}
.dockview-spaced .dv-tabs-container--wrap.dv-tabs-container-vertical .dv-tab {
  width: calc(var(--dv-tabs-and-actions-container-height) - 2 * var(--dv-tab-margin-block));
}
.dockview-spaced .dv-groupview {
  border-radius: var(--dv-border-radius);
}
.dockview-spaced .dv-groupview .dv-tabs-and-actions-container {
  padding: 0px calc(var(--dv-border-radius) / 2);
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-spaced .dv-groupview .dv-tabs-and-actions-container.dv-groupview-header-vertical {
  padding: calc(var(--dv-border-radius) / 2) 0;
}
.dockview-spaced .dv-groupview .dv-content-container {
  background-color: var(--dv-tabs-and-actions-container-background-color);
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-spaced .dv-groupview.dv-groupview-header-bottom > .dv-tabs-and-actions-container {
  border-radius: 0 0 var(--dv-border-radius) var(--dv-border-radius);
}
.dockview-spaced .dv-groupview.dv-groupview-header-bottom > .dv-content-container {
  border-radius: var(--dv-border-radius) var(--dv-border-radius) 0 0;
}
.dockview-spaced .dv-groupview.dv-groupview-header-left > .dv-tabs-and-actions-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-spaced .dv-groupview.dv-groupview-header-left > .dv-content-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-spaced .dv-groupview.dv-groupview-header-right > .dv-tabs-and-actions-container {
  border-radius: 0 var(--dv-border-radius) var(--dv-border-radius) 0;
}
.dockview-spaced .dv-groupview.dv-groupview-header-right > .dv-content-container {
  border-radius: var(--dv-border-radius) 0 0 var(--dv-border-radius);
}
.dockview-spaced .dv-groupview.dv-edge-tool-window .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}
.dockview-spaced .dv-groupview.dv-edge-tool-window .dv-content-container {
  border-radius: 0;
}
.dockview-spaced .dv-groupview.dv-edge-tool-window .dv-tabs-and-actions-container {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-spaced .dv-edge-peek {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-spaced .dv-edge-peek-clip {
  border-bottom-left-radius: var(--dv-border-radius);
  border-bottom-right-radius: var(--dv-border-radius);
}
.dockview-spaced .dv-edge-peek-header {
  border-top-left-radius: var(--dv-border-radius);
  border-top-right-radius: var(--dv-border-radius);
}

.dv-context-menu {
  min-width: 160px;
  overflow: hidden;
  background: var(--dv-context-menu-background-color, var(--dv-activegroup-hiddenpanel-tab-background-color));
  color: var(--dv-context-menu-color, var(--dv-activegroup-hiddenpanel-tab-color));
  border: 1px solid var(--dv-tab-divider-color);
  border-radius: var(--dv-border-radius);
  box-shadow: var(--dv-floating-box-shadow);
  padding: 4px 0;
}

.dv-context-menu-item {
  height: 25px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--dv-tabs-and-actions-container-font-size);
  white-space: nowrap;
  user-select: none;
}
.dv-context-menu-item:hover {
  background: var(--dv-icon-hover-background-color);
}
.dv-context-menu-item.dv-context-menu-item--disabled {
  opacity: 0.4;
  cursor: default;
  pointer-events: none;
}

.dv-context-menu-separator {
  height: 1px;
  background: var(--dv-tab-divider-color);
  margin: 4px 0;
}

.dv-context-menu-rename {
  padding: 8px 12px 4px;
}

.dv-context-menu-rename-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 1px solid var(--dv-tab-divider-color);
  border-radius: var(--dv-border-radius);
  background: inherit;
  color: var(--dv-activegroup-visiblepanel-tab-color);
  font-size: var(--dv-tabs-and-actions-container-font-size);
  outline: none;
}
.dv-context-menu-rename-input:focus {
  border-color: var(--dv-activegroup-visiblepanel-tab-color);
}
.dv-context-menu-rename-input::placeholder {
  color: var(--dv-activegroup-hiddenpanel-tab-color);
}

.dv-context-menu-color-picker {
  display: flex;
  flex-direction: row;
  gap: 6px;
  padding: 8px 12px;
  align-items: center;
}

.dv-context-menu-color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  flex-shrink: 0;
  background-color: var(--dv-tab-group-color);
}
.dv-context-menu-color-swatch:hover {
  opacity: 0.85;
}
.dv-context-menu-color-swatch.dv-context-menu-color-swatch--selected {
  outline: 2px solid var(--dv-tab-divider-color);
  outline-offset: 2px;
}

.dv-tab-group-indicator-none .dv-groupview-header-bottom .dv-tab-group-underline {
  top: auto;
  bottom: 0;
}

.dv-groupview.dv-groupview-header-bottom.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after, .dv-groupview.dv-groupview-header-bottom.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after {
  top: 0px;
  bottom: auto;
}`,document.head.appendChild(e)}var s,h=class{constructor(){}},c=class extends h{constructor(e,t,i,n){super(),this.viewId=e,this.groupId=t,this.panelId=i,this.tabGroupId=n}},p=class extends h{constructor(e,t){super(),this.viewId=e,this.paneId=t}},m=class La{constructor(){}static getInstance(){return La.INSTANCE}hasData(t){return t&&t===this.proto}clearData(t){this.hasData(t)&&(this.proto=void 0,this.data=void 0)}getData(t){if(this.hasData(t))return this.data}setData(t,i){i&&(this.data=t,this.proto=i)}};s=m,m.INSTANCE=new s;function b(){let e=m.getInstance();if(e.hasData(c.prototype))return e.getData(c.prototype)[0]}function x(){let e=m.getInstance();if(e.hasData(p.prototype))return e.getData(p.prototype)[0]}let S;(function(e){e.NONE={dispose:()=>{}};function t(i){return{dispose:()=>{i()}}}e.from=t})(S||(S={}));var C=class{get isDisposed(){return this._isDisposed}constructor(...e){this._isDisposed=!1,this._disposables=new Set(e)}addDisposables(...e){e.forEach(t=>this._disposables.add(t))}removeDisposable(e){this._disposables.delete(e)}dispose(){this._isDisposed||(this._isDisposed=!0,this._disposables.forEach(e=>e.dispose()),this._disposables.clear())}},E=class{constructor(){this._disposable=S.NONE}get value(){return this._disposable===S.NONE?void 0:this._disposable}set value(e){this._disposable&&this._disposable.dispose(),this._disposable=e}dispose(){this._disposable&&(this._disposable.dispose(),this._disposable=S.NONE)}};let $;(function(e){e.any=(...t)=>i=>{let n=t.map(o=>o(i));return{dispose:()=>{n.forEach(o=>{o.dispose()})}}}})($||($={}));var J=class{constructor(){this._defaultPrevented=!1}get defaultPrevented(){return this._defaultPrevented}preventDefault(){this._defaultPrevented=!0}},te=class{constructor(){this._isAccepted=!1}get isAccepted(){return this._isAccepted}accept(){this._isAccepted=!0}},ae=class{constructor(){this.events=new Map}get size(){return this.events.size}add(e,t){this.events.set(e,t)}delete(e){this.events.delete(e)}clear(){this.events.clear()}},le=class Ra{static create(){var t;return new Ra((t=new Error("listener stacktrace").stack)!==null&&t!==void 0?t:"")}constructor(t){this.value=t}print(){console.warn("dockview: stacktrace",this.value)}},ue=class{constructor(e,t){this.callback=e,this.stacktrace=t}},k=class Fe{static setLeakageMonitorEnabled(t){t!==Fe.ENABLE_TRACKING&&Fe.MEMORY_LEAK_WATCHER.clear(),Fe.ENABLE_TRACKING=t}get value(){return this._last}constructor(t){this.options=t,this._listeners=[],this._disposed=!1}get event(){return this._event||(this._event=t=>{var i;!((i=this.options)===null||i===void 0)&&i.replay&&this._last!==void 0&&t(this._last);let n=new ue(t,Fe.ENABLE_TRACKING?le.create():void 0);return this._listeners.push(n),{dispose:()=>{let o=this._listeners.indexOf(n);o>-1?this._listeners.splice(o,1):Fe.ENABLE_TRACKING}}},Fe.ENABLE_TRACKING&&Fe.MEMORY_LEAK_WATCHER.add(this._event,le.create())),this._event}fire(t){var i;if(this._pauseTokens!==void 0&&this._pauseTokens.size>0)return;!((i=this.options)===null||i===void 0)&&i.replay&&(this._last=t);let n=this._listeners,o=n.length;if(o!==0){if(o===1){n[0].callback(t);return}for(let a of n.slice())a.callback(t)}}pause(){var t;let i={};return(t=this._pauseTokens)!==null&&t!==void 0||(this._pauseTokens=new Set),this._pauseTokens.add(i),S.from(()=>{var n;return(n=this._pauseTokens)===null||n===void 0?void 0:n.delete(i)})}dispose(){this._disposed||(this._disposed=!0,this._listeners.length>0&&(Fe.ENABLE_TRACKING?queueMicrotask(()=>{for(let i of this._listeners){var t;console.warn("dockview: stacktrace",(t=i.stacktrace)===null||t===void 0?void 0:t.print())}this._listeners=[]}):this._listeners=[]),Fe.ENABLE_TRACKING&&this._event&&Fe.MEMORY_LEAK_WATCHER.delete(this._event))}};k.ENABLE_TRACKING=!1,k.MEMORY_LEAK_WATCHER=new ae;function M(e,t,i,n){return e.addEventListener(t,i,n),{dispose:()=>{e.removeEventListener(t,i,n)}}}var _t=class{constructor(){this._onFired=new k,this._currentFireCount=0,this._queued=!1,this.onEvent=e=>{let t=this._currentFireCount;return this._onFired.event(()=>{this._currentFireCount>t&&e()})}}fire(){this._currentFireCount++,!this._queued&&(this._queued=!0,queueMicrotask(()=>{this._queued=!1,this._onFired.fire()}))}dispose(){this._onFired.dispose()}},on=class extends C{constructor(e){super(),this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this._value=null,this.addDisposables(this._onDidChange,Ye(e,t=>{let i=t.target.scrollWidth>t.target.clientWidth,n=t.target.scrollHeight>t.target.clientHeight;this._value={hasScrollX:i,hasScrollY:n},this._onDidChange.fire(this._value)}))}};function Ye(e,t){let i=new Set,n=new ResizeObserver(o=>{let a=!1,d;d=requestAnimationFrame(()=>{a=!0,d!==void 0&&i.delete(d);let l=o[0];t(l)}),a||i.add(d)});return n.observe(e),{dispose:()=>{n.unobserve(e),n.disconnect();for(let o of i)cancelAnimationFrame(o);i.clear()}}}let be=(e,...t)=>{for(let i of t)e.classList.contains(i)&&e.classList.remove(i)},fe=(e,...t)=>{for(let i of t)e.classList.contains(i)||e.classList.add(i)},A=(e,t,i)=>{let n=e.classList.contains(t);i&&!n&&e.classList.add(t),!i&&n&&e.classList.remove(t)};function et(e,t){for(;e;){if(e===t)return!0;e=e.parentNode}return!1}function Mt(e){return new wt(e)}var wt=class extends C{constructor(e){super(),this._onDidFocus=new k,this.onDidFocus=this._onDidFocus.event,this._onDidBlur=new k,this.onDidBlur=this._onDidBlur.event,this.addDisposables(this._onDidFocus,this._onDidBlur);let t=et(oi(e),e),i=!1,n=()=>{i=!1,t||(t=!0,this._onDidFocus.fire())},o=()=>{t&&(i=!0,globalThis.setTimeout(()=>{i&&(i=!1,t=!1,this._onDidBlur.fire())},0))};this._refreshStateHandler=()=>{et(oi(e),e)!==t&&(t?o():n())},this.addDisposables(M(e,"focus",n,!0)),this.addDisposables(M(e,"blur",o,!0))}refreshState(){this._refreshStateHandler()}};let ke="dv-quasiPreventDefault";function yt(e){e[ke]=!0}function xt(e){return e[ke]}function dt(e,t){var i,n;let o=(i=(n=e.composedPath)===null||n===void 0?void 0:n.call(e))!==null&&i!==void 0?i:[];if(o.length>0)return t.some(d=>o.includes(d));let a=e.target;return a instanceof Node&&t.some(d=>d.contains(a))}function Ot(e){let t=[],i=e.getRootNode();for(;K(i);)t.push(i),i=i.host.getRootNode();return t}function ii(e,t){let i=t?.getRootNode(),n=e,o=n.getRootNode();for(;o!==i&&K(o);)n=o.host,o=n.getRootNode();return n}function ni(e,t,i={}){let n=Array.from(t),{nonce:o}=i,a=typeof o=="function"?o(e):o;for(let d of n){if(d.href){let v=e.createElement("link");v.href=d.href,v.type=d.type,v.rel="stylesheet",a&&v.setAttribute("nonce",a),e.head.appendChild(v);continue}let l=[];try{d.cssRules&&(l=Array.from(d.cssRules).map(v=>v.cssText))}catch(v){console.warn("dockview: failed to access stylesheet rules due to security restrictions",v)}let u=e.createDocumentFragment();for(let v of l){let g=e.createElement("style");a&&g.setAttribute("nonce",a),g.appendChild(e.createTextNode(v)),u.appendChild(g)}e.head.appendChild(u)}}function R(e){let{left:t,top:i,width:n,height:o}=e.getBoundingClientRect();return{left:t+window.scrollX,top:i+window.scrollY,width:n,height:o}}function U(e){let t=e;for(;t?.parentNode;){if(t.parentNode===document)return!0;t.parentNode instanceof DocumentFragment?t=t.parentNode.host:t=t.parentNode}return!1}function K(e){return!!e&&e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&"host"in e&&!!e.host}function re(e){var t;let i=e.getRootNode();return i!==e&&typeof i.elementsFromPoint=="function"?i:(t=e.ownerDocument)!==null&&t!==void 0?t:document}function B(e,t){e.dataset.testid=t}function oe(e,t){let i=[];function n(o){if(o.nodeType===Node.ELEMENT_NODE){e.includes(o.tagName)&&i.push(o),o.shadowRoot&&n(o.shadowRoot);for(let a of o.children)n(a)}}return n(t instanceof Document?t.documentElement:t),i}function q(e=document){let t=oe(["IFRAME","WEBVIEW"],e),i=new WeakMap;for(let n of t)i.set(n,n.style.pointerEvents),n.style.pointerEvents="none";return{release:()=>{for(let o of t){var n;o.style.pointerEvents=(n=i.get(o))!==null&&n!==void 0?n:"auto"}t.splice(0,t.length)}}}function ye(e=document){let t=e instanceof Document?e:e.ownerDocument,i=t?.documentElement;if(!t||!i)return{release:()=>{}};let n=["user-select","-webkit-user-select"],o=n.map(d=>[d,i.style.getPropertyValue(d)]);for(let d of n)i.style.setProperty(d,"none");let a=d=>d.preventDefault();return t.addEventListener("selectstart",a),{release:()=>{t.removeEventListener("selectstart",a);for(let[d,l]of o)l?i.style.setProperty(d,l):i.style.removeProperty(d)}}}function xe(e){function t(o){let a=[];for(let d=0;d<o.classList.length;d++)a.push(o.classList.item(d));return a}let i,n=e;for(;n!==null&&(i=t(n).find(o=>o.startsWith("dockview-theme-")),typeof i!="string");){if(n.parentElement===null){let o=n.getRootNode();n=K(o)?o.host:null;continue}n=n.parentElement}return i}var Be=class{constructor(e){this.element=e,this._classNames=[]}setClassNames(e){for(let t of this._classNames)A(this.element,t,!1);this._classNames=e.split(" ").filter(t=>t.trim().length>0);for(let t of this._classNames)A(this.element,t,!0)}};let tt=100;function Oe(e,t){let i=R(e),n=R(t);return!(i.left<n.left||i.left+i.width>n.left+n.width||i.top<n.top||i.top+i.height>n.top+n.height)}function Xe(e){let t=new k,i=e.screenX,n=e.screenY,o,a=0,d=!1,l=()=>{if(d||e.closed)return;let v=e.screenX,g=e.screenY;(v!==i||g!==n)&&(clearTimeout(o),o=setTimeout(()=>{t.fire()},tt),i=v,n=g),a=requestAnimationFrame(l)};l();let u=t.dispose.bind(t);return t.dispose=()=>{d||(d=!0,cancelAnimationFrame(a),clearTimeout(o)),u()},t}function Lt(e,t){let i;return new C(M(e,"resize",()=>{clearTimeout(i),i=setTimeout(()=>{t()},tt)}))}function Rt(e,t,i){var n;let o=(n=i?.buffer)!==null&&n!==void 0?n:10,a=e.getBoundingClientRect(),d=t.getBoundingClientRect(),l=0,u=0,v=a.left-d.left,g=a.top-d.top,f=a.bottom-d.bottom,_=a.right-d.right;v<o?l=o-v:_>o&&(l=-o-_),g<o?u=o-g:f>o&&(u=-f-o),(l!==0||u!==0)&&(e.style.transform=`translate(${l}px, ${u}px)`)}function lt(e){let t=e;for(;t&&(t.style.zIndex==="auto"||t.style.zIndex==="");)t=t.parentElement;return t}function $t(e=document){var t,i;let n=(t=e.defaultView)===null||t===void 0||(i=t.matchMedia)===null||i===void 0?void 0:i.call(t,"(prefers-reduced-motion: reduce)");return!!n?.matches}function Ba(e){let t=e.ownerDocument.defaultView;if(!t)return"";let i=e;for(;i;){let n=t.getComputedStyle(i).backgroundColor;if(n&&n!=="transparent"&&!/,\s*0\)\s*$/.test(n))return n;i=i.parentElement}return""}function oi(e){var t;let i=e.getRootNode(),n=i.nodeType===Node.DOCUMENT_NODE?i:e.ownerDocument;return n&&typeof n.hasFocus=="function"&&!n.hasFocus()?null:(t=i.activeElement)!==null&&t!==void 0?t:null}function ko(e){var t;let i=e.getRootNode();return K(i)?i:((t=e.ownerDocument)!==null&&t!==void 0?t:document).body}function Co(e,t,i,n,o,a,d){try{var l=e[a](d),u=l.value}catch(v){i(v);return}l.done?t(u):Promise.resolve(u).then(n,o)}function Go(e){return function(){var t=this,i=arguments;return new Promise(function(n,o){var a=e.apply(t,i);function d(u){Co(a,n,o,d,l,"next",u)}function l(u){Co(a,n,o,d,l,"throw",u)}d(void 0)})}}function Ua(e){let t=rn(e);if(t)throw t}let Ya=new Set(["javascript:","data:","blob:","vbscript:","file:"]),Xa=250;function rn(e,t=globalThis.location){let i;try{i=new URL(e,t.href)}catch{return new Error(`dockview: invalid popout URL: ${e}`)}if(Ya.has(i.protocol))return new Error(`dockview: popout URL must not use the "${i.protocol}" protocol, which would run in the opener's context; got: ${e}`);if(!(i.protocol===t.protocol&&i.host===t.host))return new Error(`dockview: popout URL must be same-origin with the page (${t.protocol}//${t.host}); got: ${e}`)}var Ja=class extends C{get window(){var e,t;return(e=(t=this._window)===null||t===void 0?void 0:t.value)!==null&&e!==void 0?e:null}get failure(){return this._failure}constructor(e,t,i){super(),this.target=e,this.className=t,this.options=i,this._onWillClose=new k,this.onWillClose=this._onWillClose.event,this._onDidClose=new k,this.onDidClose=this._onDidClose.event,this._window=null,this.addDisposables(this._onWillClose,this._onDidClose,{dispose:()=>{this.close()}})}dimensions(){if(!this._window)return null;let e=this._window.value.screenX;return{top:this._window.value.screenY,left:e,width:this._window.value.innerWidth,height:this._window.value.innerHeight}}close(){var e,t;let i=this._window;i&&(this._window=null,this._onWillClose.fire(),(e=(t=this.options).onWillClose)===null||e===void 0||e.call(t,{id:this.target,window:i.value}),i.disposable.dispose(),this._onDidClose.fire())}open(){var e=this;return Go(function*(){var t,i;if(e._window)throw new Error("instance of popout window is already open");let n=`${e.options.url}`;Ua(n);let o=Object.entries({top:e.options.top,left:e.options.left,width:e.options.width,height:e.options.height}).map(([u,v])=>`${u}=${v}`).join(","),a=window.open(n,e.target,o);if(!a)return e._failure={reason:"blocked"},null;let d=new C;e._window={value:a,disposable:d},d.addDisposables(S.from(()=>{a.close()}),e.watchForClose(a),M(globalThis.window,"beforeunload",()=>{e.close()}));let l=e.createPopoutWindowContainer();return e.className&&l.classList.add(e.className),(t=(i=e.options).onDidOpen)===null||t===void 0||t.call(i,{id:e.target,window:a}),new Promise(u=>{let v=g=>{e._failure={reason:"unscriptable",error:g instanceof Error?g:new Error(String(g))},e.close(),u(null)};try{a.addEventListener("unload",()=>{})}catch(g){v(g);return}d.addDisposables(e.onWillClose(()=>{var g;(g=e._failure)!==null&&g!==void 0||(e._failure={reason:"closed"}),u(null)})),a.addEventListener("load",()=>{try{var g,f,_;let D=a.document;D.title=document.title,D.body.appendChild(l),ni(D,[...Array.from(globalThis.document.styleSheets),...(g=globalThis.document.adoptedStyleSheets)!==null&&g!==void 0?g:[]],{nonce:e.options.nonce});let G=[];for(let T=(f=(_=e.options).styleRoot)===null||f===void 0?void 0:f.call(_);K(T);T=T.host.getRootNode()){var w,y;G.push(...Array.from((w=T.styleSheets)!==null&&w!==void 0?w:[]),...(y=T.adoptedStyleSheets)!==null&&y!==void 0?y:[])}G.length>0&&ni(D,G,{nonce:e.options.nonce}),M(a,"beforeunload",()=>{e.close()}),u(l)}catch(D){v(D)}})})})()}watchForClose(e){if(typeof e.closed!="boolean")return S.NONE;let t=setInterval(()=>{e.closed&&this.close()},Xa);return S.from(()=>{clearInterval(t)})}createPopoutWindowContainer(){let e=document.createElement("div");return e.classList.add("dv-popout-window"),e.id="dv-popout-window",e.style.position="absolute",e.style.width="100%",e.style.height="100%",e.style.top="0px",e.style.left="0px",e}};function Le(e){if(e.length===0)throw new Error("Invalid tail call");return[e.slice(0,e.length-1),e[e.length-1]]}function sn(e,t){if(e.length!==t.length)return!1;for(let i=0;i<e.length;i++)if(e[i]!==t[i])return!1;return!0}function an(e,t){let i=e.indexOf(t);i>-1&&(e.splice(i,1),e.unshift(t))}function ri(e,t){let i=e.indexOf(t);i>-1&&(e.splice(i,1),e.push(t))}function qa(e,t){for(let i=0;i<e.length;i++){let n=e[i];if(t(n))return i}return-1}function Po(e,t){let i=e.indexOf(t);return i>-1?(e.splice(i,1),!0):!1}let de=(e,t,i)=>t>i?t:Math.min(i,Math.max(e,t)),dn=()=>{let e=1;return{next:()=>(e++).toString()}},Re=(e,t)=>{let i=[];if(typeof t!="number"&&(t=e,e=0),e<=t)for(let n=e;n<t;n++)i.push(n);else for(let n=e;n>t;n--)i.push(n);return i};var Ka=class{set size(e){this._size=e}setContainerGeometry(e,t){this._appliedStyles[e]!==t&&(this._appliedStyles[e]=t,this.container.style[e]=t)}get size(){return this._size}get cachedVisibleSize(){return this._cachedVisibleSize}get visible(){return this._cachedVisibleSize===void 0}get minimumSize(){return this.visible?this.view.minimumSize:0}get viewMinimumSize(){return this.view.minimumSize}get maximumSize(){return this.visible?this.view.maximumSize:0}get viewMaximumSize(){return this.view.maximumSize}get priority(){return this.view.priority}get snap(){return!!this.view.snap}set enabled(e){this.container.style.pointerEvents=e?"":"none"}constructor(e,t,i,n){this.container=e,this.view=t,this.disposable=n,this._cachedVisibleSize=void 0,this._appliedStyles={},typeof i=="number"?(this._size=i,this._cachedVisibleSize=void 0,e.classList.add("visible")):(this._size=0,this._cachedVisibleSize=i.cachedVisibleSize)}setVisible(e,t){if(e!==this.visible){if(e){var i;let n=(i=this._cachedVisibleSize)!==null&&i!==void 0?i:0;this._cachedVisibleSize=void 0,this.size=de(n,this.viewMinimumSize,this.viewMaximumSize)}else this._cachedVisibleSize=typeof t=="number"?t:this.size,this.size=0;this.container.classList.toggle("visible",e),this.view.setVisible&&this.view.setVisible(e)}}dispose(){return this.disposable.dispose(),this.view}};let Za=(function(e){return e.HORIZONTAL="HORIZONTAL",e.VERTICAL="VERTICAL",e})({}),ja=(function(e){return e[e.MAXIMUM=0]="MAXIMUM",e[e.MINIMUM=1]="MINIMUM",e[e.DISABLED=2]="DISABLED",e[e.ENABLED=3]="ENABLED",e})({}),Qa=(function(e){return e.Low="low",e.High="high",e.Normal="normal",e})({});function zo(e,t,i){e.appliedLeft!==t&&(e.appliedLeft=t,e.container.style.left=t),e.appliedTop!==i&&(e.appliedTop=i,e.container.style.top=i)}let he;(function(e){e.Distribute={type:"distribute"};function t(n){return{type:"split",index:n}}e.Split=t;function i(n){return{type:"invisible",cachedVisibleSize:n}}e.Invisible=i})(he||(he={}));var it=class{get contentSize(){return this._contentSize}get size(){return this._size}set size(e){this._size=e}get orthogonalSize(){return this._orthogonalSize}set orthogonalSize(e){this._orthogonalSize=e}get length(){return this.viewItems.length}get proportions(){return this._proportions?[...this._proportions]:void 0}get proportionalLayout(){return this._proportionalLayout}set proportionalLayout(e){this._proportionalLayout!==e&&(this._proportionalLayout=e,e?this.saveProportions():this._proportions=void 0)}get orientation(){return this._orientation}set orientation(e){this._orientation=e;let t=this.size;this.size=this.orthogonalSize,this.orthogonalSize=t,be(this.element,"dv-horizontal","dv-vertical"),this.element.classList.add(this.orientation=="HORIZONTAL"?"dv-horizontal":"dv-vertical")}get minimumSize(){return this.viewItems.reduce((e,t)=>e+t.minimumSize,0)}get maximumSize(){return this.length===0?Number.POSITIVE_INFINITY:this.viewItems.reduce((e,t)=>e+t.maximumSize,0)}get startSnappingEnabled(){return this._startSnappingEnabled}set startSnappingEnabled(e){this._startSnappingEnabled!==e&&(this._startSnappingEnabled=e,this.updateSashEnablement())}get endSnappingEnabled(){return this._endSnappingEnabled}set endSnappingEnabled(e){this._endSnappingEnabled!==e&&(this._endSnappingEnabled=e,this.updateSashEnablement())}get disabled(){return this._disabled}set disabled(e){this._disabled=e,A(this.element,"dv-splitview-disabled",e)}get margin(){return this._margin}get marginShare(){let e=0;for(let t of this.viewItems)t.visible&&e++;return this.marginShareFor(e)}set margin(e){this._margin=e,A(this.element,"dv-splitview-has-margin",e!==0)}constructor(e,t){var i,n;this.container=e,this.viewItems=[],this.sashes=[],this._size=0,this._orthogonalSize=0,this._contentSize=0,this._proportions=void 0,this._startSnappingEnabled=!0,this._endSnappingEnabled=!0,this._disabled=!1,this._margin=0,this._onDidSashEnd=new k,this.onDidSashEnd=this._onDidSashEnd.event,this._onDidAddView=new k,this.onDidAddView=this._onDidAddView.event,this._onDidRemoveView=new k,this.onDidRemoveView=this._onDidRemoveView.event,this.resize=(o,a,d=this.viewItems.map(w=>w.size),l,u,v=Number.NEGATIVE_INFINITY,g=Number.POSITIVE_INFINITY,f,_)=>{if(o<0||o>this.viewItems.length)return 0;let w=Re(o,-1),y=Re(o+1,this.viewItems.length);if(u)for(let V of u)an(w,V),an(y,V);if(l)for(let V of l)ri(w,V),ri(y,V);let D=w.reduce((V,F)=>V+this.viewItems[F].minimumSize-d[F],0),G=w.reduce((V,F)=>V+this.viewItems[F].maximumSize-d[F],0),T=y.length===0?Number.POSITIVE_INFINITY:y.reduce((V,F)=>V+d[F]-this.viewItems[F].minimumSize,0),z=y.length===0?Number.NEGATIVE_INFINITY:y.reduce((V,F)=>V+d[F]-this.viewItems[F].maximumSize,0),P=Math.max(D,z),I=Math.min(T,G),W=!1;if(f){let V=this.viewItems[f.index],F=a>=f.limitDelta;W=F!==V.visible,V.setVisible(F,f.size)}if(!W&&_){let V=this.viewItems[_.index],F=a<_.limitDelta;W=F!==V.visible,V.setVisible(F,_.size)}if(W)return this.resize(o,a,d,l,u,v,g);let H=de(a,P,I),O=0,L=H;for(let V of w){let F=this.viewItems[V],ie=d[V],Z=de(ie+L,F.minimumSize,F.maximumSize),ee=Z-ie;O+=ee,L-=ee,F.size=Z}let X=O;for(let V of y){let F=this.viewItems[V],ie=d[V],Z=de(ie-X,F.minimumSize,F.maximumSize),ee=Z-ie;X+=ee,F.size=Z}return a},this._orientation=(i=t.orientation)!==null&&i!==void 0?i:"VERTICAL",this.element=this.createContainer(),this.margin=(n=t.margin)!==null&&n!==void 0?n:0,this._proportionalLayout=t.proportionalLayout===void 0?!0:!!t.proportionalLayout,this.viewContainer=this.createViewContainer(),this.sashContainer=this.createSashContainer(),this.element.appendChild(this.sashContainer),this.element.appendChild(this.viewContainer),this.container.appendChild(this.element),this.style(t.styles),t.descriptor&&(this._size=t.descriptor.size,t.descriptor.views.forEach((o,a)=>{let d=o.visible===void 0||o.visible?o.size:{type:"invisible",cachedVisibleSize:o.size},l=o.view;this.addView(l,d,a,!0)}),this._contentSize=this.viewItems.reduce((o,a)=>o+a.size,0),this.saveProportions())}style(e){e?.separatorBorder==="transparent"?(be(this.element,"dv-separator-border"),this.element.style.removeProperty("--dv-separator-border")):(fe(this.element,"dv-separator-border"),e?.separatorBorder&&this.element.style.setProperty("--dv-separator-border",e.separatorBorder))}isViewVisible(e){if(e<0||e>=this.viewItems.length)throw new Error("Index out of bounds");return this.viewItems[e].visible}setViewVisible(e,t){if(e<0||e>=this.viewItems.length)throw new Error("Index out of bounds");let i=this.viewItems[e];i.setVisible(t,i.size),this.distributeEmptySpace(e),this.layoutViews(),this.saveProportions()}getViewSize(e){return e<0||e>=this.viewItems.length?-1:this.viewItems[e].size}resizeView(e,t){if(e<0||e>=this.viewItems.length)return;let i=Re(this.viewItems.length).filter(d=>d!==e),n=[...i.filter(d=>this.viewItems[d].priority==="low"),e],o=i.filter(d=>this.viewItems[d].priority==="high"),a=this.viewItems[e];t=Math.round(t),t=de(t,a.minimumSize,Math.min(a.maximumSize,this._size)),a.size=t,this.relayout(n,o)}getViews(){return this.viewItems.map(e=>e.view)}onDidChange(e,t){let i=this.viewItems.indexOf(e);if(i<0||i>=this.viewItems.length)return;t=typeof t=="number"?t:e.size,t=de(t,e.minimumSize,e.maximumSize),e.size=t;let n=Re(this.viewItems.length).filter(d=>d!==i),o=[...n.filter(d=>this.viewItems[d].priority==="low"),i],a=n.filter(d=>this.viewItems[d].priority==="high");this.relayout([...o,i],a)}addView(e,t=he.Distribute,i=this.viewItems.length,n){let o=document.createElement("div");o.className="dv-view",o.appendChild(e.element);let a;if(typeof t=="number")a=t;else if(t.type==="split"){let u=this.viewItems[t.index];if(u){let v=Math.floor(u.size/2);a=u.size-v,u.size=v}else a=this.getViewSize(t.index)/2}else t.type==="invisible"?a={cachedVisibleSize:t.cachedVisibleSize}:a=e.minimumSize;let d=e.onDidChange(u=>this.onDidChange(l,u.size)),l=new Ka(o,e,a,{dispose:()=>{d.dispose(),o.remove()}});if(i===this.viewItems.length?this.viewContainer.appendChild(o):this.viewContainer.insertBefore(o,this.viewContainer.children.item(i)),this.viewItems.splice(i,0,l),this.viewItems.length>1){let u=document.createElement("div");u.className="dv-sash";let v=f=>{var _;for(let ne of this.viewItems)ne.enabled=!1;let w=(_=u.ownerDocument)!==null&&_!==void 0?_:document,y=q(w),D=this._orientation==="HORIZONTAL"?f.clientX:f.clientY,G=qa(this.sashes,ne=>ne.container===u),T=this.viewItems.map(ne=>ne.size),z,P,I=Re(G,-1),W=Re(G+1,this.viewItems.length),H=I.reduce((ne,Q)=>ne+(this.viewItems[Q].minimumSize-T[Q]),0),O=I.reduce((ne,Q)=>ne+(this.viewItems[Q].viewMaximumSize-T[Q]),0),L=W.length===0?Number.POSITIVE_INFINITY:W.reduce((ne,Q)=>ne+(T[Q]-this.viewItems[Q].minimumSize),0),X=W.length===0?Number.NEGATIVE_INFINITY:W.reduce((ne,Q)=>ne+(T[Q]-this.viewItems[Q].viewMaximumSize),0),V=Math.max(H,X),F=Math.min(L,O),ie=this.findFirstSnapIndex(I),Z=this.findFirstSnapIndex(W);if(typeof ie=="number"){let ne=this.viewItems[ie],Q=Math.floor(ne.viewMinimumSize/2);z={index:ie,limitDelta:ne.visible?V-Q:V+Q,size:ne.size}}if(typeof Z=="number"){let ne=this.viewItems[Z],Q=Math.floor(ne.viewMinimumSize/2);P={index:Z,limitDelta:ne.visible?F+Q:F-Q,size:ne.size}}let ee=ne=>{let Q=(this._orientation==="HORIZONTAL"?ne.clientX:ne.clientY)-D;this.resize(G,Q,T,void 0,void 0,V,F,z,P),this.distributeEmptySpace(),this.layoutViews()},ge=()=>{for(let ne of this.viewItems)ne.enabled=!0;y.release(),this.saveProportions(),w.removeEventListener("pointermove",ee),w.removeEventListener("pointerup",ge),w.removeEventListener("pointercancel",ge),w.removeEventListener("contextmenu",ge),this._onDidSashEnd.fire(void 0)};w.addEventListener("pointermove",ee),w.addEventListener("pointerup",ge),w.addEventListener("pointercancel",ge),w.addEventListener("contextmenu",ge)};u.addEventListener("pointerdown",v);let g={container:u,disposable:()=>{u.removeEventListener("pointerdown",v),u.remove()}};this.sashContainer.appendChild(u),this.sashes.push(g)}n||this.relayout([i]),!n&&typeof t!="number"&&t.type==="distribute"&&this.distributeViewSizes(),this._onDidAddView.fire(e)}distributeViewSizes(){let e=[],t=0;for(let d of this.viewItems)d.maximumSize-d.minimumSize>0&&(e.push(d),t+=d.size);let i=Math.floor(t/e.length);for(let d of e)d.size=de(i,d.minimumSize,d.maximumSize);let n=Re(this.viewItems.length),o=n.filter(d=>this.viewItems[d].priority==="low"),a=n.filter(d=>this.viewItems[d].priority==="high");this.relayout(o,a)}removeView(e,t,i=!1){let n=this.viewItems.splice(e,1)[0];if(n.dispose(),this.viewItems.length>=1){let o=Math.max(e-1,0);this.sashes.splice(o,1)[0].disposable()}return i||this.relayout(),t?.type==="distribute"&&this.distributeViewSizes(),this._onDidRemoveView.fire(n.view),n.view}getViewCachedVisibleSize(e){if(e<0||e>=this.viewItems.length)throw new Error("Index out of bounds");return this.viewItems[e].cachedVisibleSize}moveView(e,t){let i=this.getViewCachedVisibleSize(e),n=i===void 0?this.getViewSize(e):he.Invisible(i),o=this.removeView(e,void 0,!0);this.addView(o,n,t)}layout(e,t){let i=Math.max(this.size,this._contentSize);if(this.size=e,this.orthogonalSize=t,this._proportions||this.saveProportions(),this.proportions){let n=0;for(let o=0;o<this.viewItems.length;o++){let a=this.viewItems[o],d=this.proportions[o];typeof d=="number"?n+=d:e-=a.size}for(let o=0;o<this.viewItems.length;o++){let a=this.viewItems[o],d=this.proportions[o];typeof d=="number"&&n>0&&(a.size=de(Math.round(d*e/n),a.minimumSize,a.maximumSize))}}else{let n=Re(this.viewItems.length),o=n.filter(d=>this.viewItems[d].priority==="low"),a=n.filter(d=>this.viewItems[d].priority==="high");this.resize(this.viewItems.length-1,e-i,void 0,o,a)}this.distributeEmptySpace(),this.layoutViews()}relayout(e,t){let i=this.viewItems.reduce((n,o)=>n+o.size,0);this.resize(this.viewItems.length-1,this._size-i,void 0,e,t),this.distributeEmptySpace(),this.layoutViews(),this.saveProportions()}distributeEmptySpace(e){let t=0;for(let a of this.viewItems)t+=a.size;let i=this.size-t;if(i===0)return;let n=Re(this.viewItems.length-1,-1),o=!1;for(let a of this.viewItems)if(a.priority==="low"||a.priority==="high"){o=!0;break}if(o){let a=n.filter(l=>this.viewItems[l].priority==="low"),d=n.filter(l=>this.viewItems[l].priority==="high");for(let l of d)an(n,l);for(let l of a)ri(n,l)}typeof e=="number"&&ri(n,e);for(let a=0;i!==0&&a<n.length;a++){let d=this.viewItems[n[a]],l=de(d.size+i,d.minimumSize,d.maximumSize),u=l-d.size;i-=u,d.size=l}}saveProportions(){if(!this.proportionalLayout)return;let e=0;for(let t of this.viewItems)e+=t.size;e>0&&(this._proportions=this.viewItems.map(t=>t.visible?t.size/e:void 0))}layoutViews(){let e=0,t=0;for(let u of this.viewItems)e+=u.size,u.visible&&t++;if(this._contentSize=e,this.updateSashEnablement(),this.viewItems.length===0)return;let i=Math.max(0,t-1),n=this.marginShareFor(t),o=0,a=[],d=4,l=0;this.viewItems.forEach((u,v)=>{o+=this.viewItems[v].size,a.push(o),l+=u.visible?1:0;let g=u.visible?u.size-n:0,f=Math.max(0,l-1),_=v===0||f===0?0:a[v-1]+f/i*n;if(v<this.viewItems.length-1){let w=u.visible?_+g-d/2+this.margin/2:_,y=this.sashes[v];this._orientation==="HORIZONTAL"&&zo(y,`${w}px`,"0px"),this._orientation==="VERTICAL"&&zo(y,"0px",`${w}px`)}this._orientation==="HORIZONTAL"&&(u.setContainerGeometry("width",`${g}px`),u.setContainerGeometry("left",`${_}px`),u.setContainerGeometry("top",""),u.setContainerGeometry("height","")),this._orientation==="VERTICAL"&&(u.setContainerGeometry("height",`${g}px`),u.setContainerGeometry("top",`${_}px`),u.setContainerGeometry("width",""),u.setContainerGeometry("left","")),u.view.layout(g,this._orthogonalSize)})}marginShareFor(e){let t=Math.max(0,e-1);return this._margin*t/Math.max(1,e)}findFirstSnapIndex(e){for(let t of e){let i=this.viewItems[t];if(i.visible&&i.snap)return t}for(let t of e){let i=this.viewItems[t];if(i.visible&&i.maximumSize-i.minimumSize>0)return;if(!i.visible&&i.snap)return t}}updateSashEnablement(){if(this.sashes.length===0)return;let e=!1,t=this.viewItems.map(l=>e=l.size-l.minimumSize>0||e);e=!1;let i=this.viewItems.map(l=>e=l.maximumSize-l.size>0||e),n=[...this.viewItems].reverse();e=!1;let o=n.map(l=>e=l.size-l.minimumSize>0||e).reverse();e=!1;let a=n.map(l=>e=l.maximumSize-l.size>0||e).reverse(),d=0;for(let l=0;l<this.sashes.length;l++){let u=this.sashes[l],v=this.viewItems[l];d+=v.size;let g=!(t[l]&&a[l+1]),f=!(i[l]&&o[l+1]);if(g&&f){let _=Re(l,-1),w=Re(l+1,this.viewItems.length),y=this.findFirstSnapIndex(_),D=this.findFirstSnapIndex(w),G=typeof y=="number"&&!this.viewItems[y].visible,T=typeof D=="number"&&!this.viewItems[D].visible;G&&o[l]&&(d>0||this.startSnappingEnabled)?this.updateSash(u,1):T&&t[l]&&(d<this._contentSize||this.endSnappingEnabled)?this.updateSash(u,0):this.updateSash(u,2)}else g&&!f?this.updateSash(u,1):!g&&f?this.updateSash(u,0):this.updateSash(u,3)}}updateSash(e,t){A(e.container,"dv-disabled",t===2),A(e.container,"dv-enabled",t===3),A(e.container,"dv-maximum",t===0),A(e.container,"dv-minimum",t===1)}createViewContainer(){let e=document.createElement("div");return e.className="dv-view-container",e}createSashContainer(){let e=document.createElement("div");return e.className="dv-sash-container",e}createContainer(){let e=document.createElement("div");return e.className=`dv-split-view-container ${this._orientation==="HORIZONTAL"?"dv-horizontal":"dv-vertical"}`,e}dispose(){this._onDidSashEnd.dispose(),this._onDidAddView.dispose(),this._onDidRemoveView.dispose();for(let e=0;e<this.element.children.length;e++)if(this.element.children.item(e)===this.element){this.element.remove();break}for(let e of this.viewItems)e.dispose();this.element.remove()}};let ed=Object.keys({orientation:void 0,descriptor:void 0,proportionalLayout:void 0,styles:void 0,margin:void 0,disableAutoResizing:void 0,className:void 0});var si=class extends C{get onDidAddView(){return this.splitview.onDidAddView}get onDidRemoveView(){return this.splitview.onDidRemoveView}get minimumSize(){return this.splitview.minimumSize}get maximumSize(){return this.splitview.maximumSize}get orientation(){return this.splitview.orientation}get size(){return this.splitview.size}get orthogonalSize(){return this.splitview.orthogonalSize}constructor(e,t){var i;super(),this.paneItems=[],this.skipAnimation=!1,this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this._orientation=(i=t.orientation)!==null&&i!==void 0?i:"VERTICAL",this.element=document.createElement("div"),this.element.className="dv-pane-container",e.appendChild(this.element),this.splitview=new it(this.element,{orientation:this._orientation,proportionalLayout:!1,descriptor:t.descriptor}),this.getPanes().forEach(n=>{let o=new C(n.onDidChangeExpansionState(()=>{this.setupAnimation(),this._onDidChange.fire(void 0)})),a={pane:n,disposable:{dispose:()=>{o.dispose()}}};this.paneItems.push(a),n.orthogonalSize=this.splitview.orthogonalSize}),this.addDisposables(this._onDidChange,this.splitview.onDidSashEnd(()=>{this._onDidChange.fire(void 0)}),this.splitview.onDidAddView(()=>{this._onDidChange.fire()}),this.splitview.onDidRemoveView(()=>{this._onDidChange.fire()}))}setViewVisible(e,t){this.splitview.setViewVisible(e,t)}addPane(e,t,i=this.splitview.length,n=!1){let o=e.onDidChangeExpansionState(()=>{this.setupAnimation(),this._onDidChange.fire(void 0)}),a={pane:e,disposable:{dispose:()=>{o.dispose()}}};this.paneItems.splice(i,0,a),e.orthogonalSize=this.splitview.orthogonalSize,this.splitview.addView(e,t,i,n)}getViewSize(e){return this.splitview.getViewSize(e)}getViewCachedVisibleSize(e){return this.splitview.getViewCachedVisibleSize(e)}getPanes(){return this.splitview.getViews()}removePane(e,t){let i=this.paneItems.splice(e,1)[0];return this.splitview.removeView(e),t?.skipDispose||(i.disposable.dispose(),i.pane.dispose()),i}moveView(e,t){if(e===t)return;let i=this.removePane(e,{skipDispose:!0});i.disposable.dispose(),this.skipAnimation=!0;try{this.addPane(i.pane,i.pane.size,t,!1)}finally{this.skipAnimation=!1}}layout(e,t){this.splitview.layout(e,t)}setupAnimation(){this.skipAnimation||(this.animationTimer&&(clearTimeout(this.animationTimer),this.animationTimer=void 0),fe(this.element,"dv-animated"),this.animationTimer=setTimeout(()=>{this.animationTimer=void 0,be(this.element,"dv-animated")},200))}dispose(){super.dispose(),this.animationTimer&&(clearTimeout(this.animationTimer),this.animationTimer=void 0),this.paneItems.forEach(e=>{e.disposable.dispose(),e.pane.dispose()}),this.paneItems=[],this.splitview.dispose(),this.element.remove()}},me=class{get minimumWidth(){return this.view.minimumWidth}get maximumWidth(){return this.view.maximumWidth}get minimumHeight(){return this.view.minimumHeight}get maximumHeight(){return this.view.maximumHeight}get priority(){return this.view.priority}get snap(){return this.view.snap}get minimumSize(){return this.orientation==="HORIZONTAL"?this.minimumHeight:this.minimumWidth}get maximumSize(){return this.orientation==="HORIZONTAL"?this.maximumHeight:this.maximumWidth}get minimumOrthogonalSize(){return this.orientation==="HORIZONTAL"?this.minimumWidth:this.minimumHeight}get maximumOrthogonalSize(){return this.orientation==="HORIZONTAL"?this.maximumWidth:this.maximumHeight}get orthogonalSize(){return this._orthogonalSize}get size(){return this._size}get element(){return this.view.element}get width(){return this.orientation==="HORIZONTAL"?this.orthogonalSize:this.size}get height(){return this.orientation==="HORIZONTAL"?this.size:this.orthogonalSize}constructor(e,t,i,n=0){this.view=e,this.orientation=t,this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this._orthogonalSize=i,this._size=n,this._disposable=this.view.onDidChange(o=>{o?this._onDidChange.fire({size:this.orientation==="VERTICAL"?o.width:o.height,orthogonalSize:this.orientation==="VERTICAL"?o.height:o.width}):this._onDidChange.fire({})})}setVisible(e){this.view.setVisible&&this.view.setVisible(e)}layout(e,t){this._size=e,this._orthogonalSize=t,this.view.layout(this.width,this.height)}dispose(){this._onDidChange.dispose(),this._disposable.dispose()}},pe=class Qi extends C{get width(){return this.orientation==="HORIZONTAL"?this.size:this.orthogonalSize}get height(){return this.orientation==="HORIZONTAL"?this.orthogonalSize:this.size}get minimumSize(){if(this._cachedMinimumSize===void 0){let t=0;for(let i=0;i<this.children.length;i++)this.splitview.isViewVisible(i)&&(t=Math.max(t,this.children[i].minimumOrthogonalSize));this._cachedMinimumSize=t}return this._cachedMinimumSize}get maximumSize(){if(this._cachedMaximumSize===void 0){let t=Number.POSITIVE_INFINITY;for(let i=0;i<this.children.length;i++)this.splitview.isViewVisible(i)&&(t=Math.min(t,this.children[i].maximumOrthogonalSize));this._cachedMaximumSize=t}return this._cachedMaximumSize}get minimumOrthogonalSize(){return this.splitview.minimumSize}get maximumOrthogonalSize(){return this.splitview.maximumSize}get orthogonalSize(){return this._orthogonalSize}get size(){return this._size}get minimumWidth(){return this.orientation==="HORIZONTAL"?this.minimumOrthogonalSize:this.minimumSize}get minimumHeight(){return this.orientation==="HORIZONTAL"?this.minimumSize:this.minimumOrthogonalSize}get maximumWidth(){return this.orientation==="HORIZONTAL"?this.maximumOrthogonalSize:this.maximumSize}get maximumHeight(){return this.orientation==="HORIZONTAL"?this.maximumSize:this.maximumOrthogonalSize}get priority(){var t;return(t=this._cachedPriority)!==null&&t!==void 0||(this._cachedPriority=this.computePriority()),this._cachedPriority}computePriority(){if(this.children.length===0)return"normal";let t=!1,i=!1;for(let o of this.children){var n;let a=(n=o.priority)!==null&&n!==void 0?n:"normal";a==="high"?t=!0:a==="low"&&(i=!0)}return t?"high":i?"low":"normal"}invalidateCachedSizes(){this._cachedMinimumSize=void 0,this._cachedMaximumSize=void 0,this._cachedPriority=void 0}get disabled(){return this.splitview.disabled}set disabled(t){this.splitview.disabled=t}get margin(){return this.splitview.margin}set margin(t){this.splitview.margin=t,this.children.forEach(i=>{i instanceof Qi&&(i.margin=t)})}get proportionalLayout(){return this.splitview.proportionalLayout}set proportionalLayout(t){this.splitview.proportionalLayout=t,this.children.forEach(i=>{i instanceof Qi&&(i.proportionalLayout=t)})}constructor(t,i,n,o,a,d,l,u){if(super(),this.orientation=t,this.styles=n,this._childrenDisposable=S.NONE,this.children=[],this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this._onDidVisibilityChange=new k,this.onDidVisibilityChange=this._onDidVisibilityChange.event,this._orthogonalSize=a,this._size=o,this.element=document.createElement("div"),this.element.className="dv-branch-node",u){let v={views:u.map(g=>{var f;return{view:g.node,size:g.node.size,visible:(f=g.visible)!==null&&f!==void 0?f:!0}}),size:this.orthogonalSize};this.children=u.map(g=>g.node),this.splitview=new it(this.element,{orientation:this.orientation,descriptor:v,proportionalLayout:i,styles:n,margin:l})}else this.splitview=new it(this.element,{orientation:this.orientation,proportionalLayout:i,styles:n,margin:l}),this.splitview.layout(this.size,this.orthogonalSize);this.disabled=d,this.addDisposables(this._onDidChange,this._onDidVisibilityChange,this.splitview.onDidSashEnd(()=>{this._onDidChange.fire({})})),this.setupChildrenEvents()}setVisible(t){}isChildVisible(t){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.isViewVisible(t)}setChildVisible(t,i){if(t<0||t>=this.children.length)throw new Error("Invalid index");if(this.splitview.isViewVisible(t)===i)return;let n=this.splitview.contentSize===0;this.splitview.setViewVisible(t,i),this.invalidateCachedSizes();let o=this.splitview.contentSize===0;(i&&n||!i&&o)&&this._onDidVisibilityChange.fire({visible:i})}moveChild(t,i){if(t===i)return;if(t<0||t>=this.children.length)throw new Error("Invalid from index");t<i&&i--,this.splitview.moveView(t,i);let n=this._removeChild(t);this._addChild(n,i)}getChildSize(t){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.getViewSize(t)}resizeChild(t,i){if(t<0||t>=this.children.length)throw new Error("Invalid index");this.splitview.resizeView(t,i)}layout(t,i){this._size=i,this._orthogonalSize=t,this.splitview.layout(i,t)}addChild(t,i,n,o){if(n<0||n>this.children.length)throw new Error("Invalid index");this.splitview.addView(t,i,n,o),this._addChild(t,n)}getChildCachedVisibleSize(t){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.getViewCachedVisibleSize(t)}removeChild(t,i){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.removeView(t,i),this._removeChild(t)}_addChild(t,i){this.children.splice(i,0,t),this.setupChildrenEvents()}_removeChild(t){let[i]=this.children.splice(t,1);return this.setupChildrenEvents(),i}setupChildrenEvents(){this.invalidateCachedSizes(),this._childrenDisposable.dispose(),this._childrenDisposable=new C($.any(...this.children.map(t=>t.onDidChange))(t=>{this.invalidateCachedSizes(),this._onDidChange.fire({size:t.orthogonalSize})}),...this.children.map((t,i)=>t instanceof Qi?t.onDidVisibilityChange(({visible:n})=>{this.setChildVisible(i,n)}):S.NONE))}dispose(){this._childrenDisposable.dispose(),this.splitview.dispose(),this.children.forEach(t=>t.dispose()),super.dispose()}};function ln(e,t){if(e instanceof me)return e;if(e instanceof pe)return ln(e.children[t?e.children.length-1:0],t);throw new Error("invalid node")}function cn(e,t,i,n=1){let o=e.getChildCachedVisibleSize(t);return o===void 0?i:he.Invisible(Math.round(o*n))}function To(e,t,i){if(e instanceof pe){let n=new pe(e.orientation,e.proportionalLayout,e.styles,t,i,e.disabled,e.margin);for(let o=e.children.length-1;o>=0;o--){let a=e.children[o];n.addChild(To(a,a.size,a.orthogonalSize),cn(e,o,a.size),0,!0)}return n}else return new me(e.view,e.orientation,i)}function hn(e,t,i){if(e instanceof pe){let n=new pe($e(e.orientation),e.proportionalLayout,e.styles,t,i,e.disabled,e.margin),o=0,a=e.size===0?1:t/e.size;for(let d=e.children.length-1;d>=0;d--){let l=e.children[d],u=l instanceof pe?l.orthogonalSize:l.size,v=e.size===0?0:Math.round(t*u/e.size);o+=v,d===0&&(v+=t-o),n.addChild(hn(l,i,v),cn(e,d,v,a),0,!0)}return n}else return new me(e.view,$e(e.orientation),i)}function Eo(e){let t=e.parentElement;if(!t)throw new Error("Invalid grid element");let i=t.firstElementChild,n=0;for(;i!==e&&i!==t.lastElementChild&&i;)i=i.nextElementSibling,n++;return n}function se(e){let t=e.parentElement;if(!t)throw new Error("Invalid grid element");if(/\bdv-grid-view\b/.test(t.className))return[];let i=Eo(t),n=t.parentElement.parentElement.parentElement;return[...se(n),i]}function Ce(e,t,i){if(un(e,t)===ai(i)){let[n,o]=Le(t),a=o;return(i==="right"||i==="bottom")&&(a+=1),[...n,a]}else{let n=i==="right"||i==="bottom"?1:0;return[...t,n]}}function ai(e){return e==="top"||e==="bottom"?"VERTICAL":"HORIZONTAL"}function un(e,t){return t.length%2===0?$e(e):e}let $e=e=>e==="HORIZONTAL"?"VERTICAL":"HORIZONTAL";function Ao(e){return!!e.children}let pn=(e,t)=>{let i=t==="VERTICAL"?e.box.width:e.box.height;if(!Ao(e))return typeof e.cachedVisibleSize=="number"?{type:"leaf",data:e.view.toJSON(),size:e.cachedVisibleSize,visible:!1}:{type:"leaf",data:e.view.toJSON(),size:i};let n=e.children.map(o=>pn(o,$e(t)));return typeof e.cachedVisibleSize=="number"?{type:"branch",data:n,size:e.cachedVisibleSize,visible:!1}:{type:"branch",data:n,size:i}};var vn=class{get length(){return this._root?this._root.children.length:0}get orientation(){return this.root.orientation}set orientation(e){if(this.root.orientation===e)return;let{size:t,orthogonalSize:i}=this.root;this.root=hn(this.root,i,t),this.root.layout(t,i)}get width(){return this.root.width}get height(){return this.root.height}get minimumWidth(){return this.root.minimumWidth}get minimumHeight(){return this.root.minimumHeight}get maximumWidth(){return this.root.maximumWidth}get maximumHeight(){return this.root.maximumHeight}get locked(){return this._locked}set locked(e){this._locked=e;let t=[this.root];for(;t.length>0;){let i=t.pop();i instanceof pe&&(i.disabled=e,t.push(...i.children))}}get margin(){return this._margin}set margin(e){this._margin=e,this.root.margin=e}maximizedView(){var e;return(e=this._maximizedNode)===null||e===void 0?void 0:e.leaf.view}hasMaximizedView(){return this._maximizedNode!==void 0}maximizeView(e){var t;let i=se(e.element),[n,o]=this.getNode(i);if(!(o instanceof me)||((t=this._maximizedNode)===null||t===void 0?void 0:t.leaf)===o)return;this.hasMaximizedView()&&this.exitMaximizedView(),pn(this.getView(),this.orientation);let a=[];function d(l,u){for(let v=0;v<l.children.length;v++){let g=l.children[v];g instanceof me?g!==u&&(l.isChildVisible(v)?l.setChildVisible(v,!1):a.push(g)):d(g,u)}}d(this.root,o),this._maximizedNode={leaf:o,hiddenOnMaximize:a},this._onDidMaximizedNodeChange.fire({view:o.view,isMaximized:!0})}exitMaximizedView(){if(!this._maximizedNode)return;let e=this._maximizedNode.hiddenOnMaximize;function t(n){for(let o=n.children.length-1;o>=0;o--){let a=n.children[o];a instanceof me?e.includes(a)||n.setChildVisible(o,!0):t(a)}}t(this.root);let i=this._maximizedNode.leaf;this._maximizedNode=void 0,this._onDidMaximizedNodeChange.fire({view:i.view,isMaximized:!1})}serialize(){let e=this.maximizedView(),t;e&&(t=se(e.element));let i=this._onDidMaximizedNodeChange.pause();try{this.hasMaximizedView()&&this.exitMaximizedView();let n={root:pn(this.getView(),this.orientation),width:this.width,height:this.height,orientation:this.orientation};return t&&(n.maximizedNode={location:t}),e&&this.maximizeView(e),n}finally{i.dispose()}}dispose(){this.disposable.dispose(),this._onDidChange.dispose(),this._onDidMaximizedNodeChange.dispose(),this._onDidViewVisibilityChange.dispose(),this.root.dispose(),this._maximizedNode=void 0,this.element.remove()}clear(){let e=this.root.orientation;this.root=new pe(e,this.proportionalLayout,this.styles,this.root.size,this.root.orthogonalSize,this.locked,this.margin)}deserialize(e,t){let i=e.orientation,n=i==="VERTICAL"?e.height:e.width;if(this._deserialize(e.root,i,t,n),this.layout(e.width,e.height),e.maximizedNode){let o=e.maximizedNode.location,[a,d]=this.getNode(o);if(!(d instanceof me))return;this.maximizeView(d.view)}}_deserialize(e,t,i,n){this.root=this._deserializeNode(e,t,i,n)}_deserializeNode(e,t,i,n){let o;if(e.type==="branch"){let d=e.data.map(l=>({node:this._deserializeNode(l,$e(t),i,e.size),visible:l.visible}));o=new pe(t,this.proportionalLayout,this.styles,e.size,n,this.locked,this.margin,d)}else{let d=i.fromJSON(e);if(typeof e.visible=="boolean"){var a;(a=d.setVisible)===null||a===void 0||a.call(d,e.visible)}o=new me(d,t,n,e.size)}return o}get root(){return this._root}set root(e){let t=this._root;t&&(t.dispose(),this._maximizedNode=void 0,t.element.remove()),this._root=e,this.element.appendChild(this._root.element),this.disposable.value=this._root.onDidChange(i=>{this._onDidChange.fire(i)})}normalize(){if(!this._root||this._root.children.length!==1)return;let e=this.root,t=e.children[0];if(t instanceof me)return;e.element.remove();let i=e.removeChild(0);e.dispose(),i.dispose(),this._root=To(t,t.size,t.orthogonalSize),this.element.appendChild(this._root.element),this.disposable.value=this._root.onDidChange(n=>{this._onDidChange.fire(n)})}insertOrthogonalSplitviewAtRoot(){if(!this._root)return;let e=this.root;if(e.element.remove(),this._root=new pe($e(e.orientation),this.proportionalLayout,this.styles,this.root.orthogonalSize,this.root.size,this.locked,this.margin),e.children.length!==0)if(e.children.length===1){let t=e.children[0];e.removeChild(0).dispose(),e.dispose(),this._root.addChild(hn(t,t.orthogonalSize,t.size),he.Distribute,0)}else this._root.addChild(e,he.Distribute,0);this.element.appendChild(this._root.element),this.disposable.value=this._root.onDidChange(t=>{this._onDidChange.fire(t)})}next(e){return this.progmaticSelect(e)}previous(e){return this.progmaticSelect(e,!0)}getView(e){let t=e?this.getNode(e)[1]:this.root;return this._getViews(t,this.orientation)}_getViews(e,t,i){let n={height:e.height,width:e.width};if(e instanceof me)return{box:n,view:e.view,cachedVisibleSize:i};let o=[];for(let a=0;a<e.children.length;a++){let d=e.children[a],l=e.getChildCachedVisibleSize(a);o.push(this._getViews(d,$e(t),l))}return{box:n,children:o,cachedVisibleSize:i}}progmaticSelect(e,t=!1){let[i,n]=this.getNode(e);if(!(n instanceof me))throw new TypeError("invalid location");for(let o=i.length-1;o>-1;o--){let a=i[o],d=e[o]||0;if(t?d-1>-1:d+1<a.children.length)return ln(a.children[t?d-1:d+1],t)}return ln(this.root,t)}get proportionalLayout(){return this.root.proportionalLayout}set proportionalLayout(e){this.root.proportionalLayout=e}constructor(e,t,i,n,o){this.styles=t,this._locked=!1,this._margin=0,this._maximizedNode=void 0,this.disposable=new E,this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this._onDidViewVisibilityChange=new k,this.onDidViewVisibilityChange=this._onDidViewVisibilityChange.event,this._onDidMaximizedNodeChange=new k,this.onDidMaximizedNodeChange=this._onDidMaximizedNodeChange.event,this.element=document.createElement("div"),this.element.className="dv-grid-view",this._locked=n??!1,this._margin=o??0,this.root=new pe(i,e,t,0,0,this.locked,this.margin)}isViewVisible(e){let[t,i]=Le(e),[,n]=this.getNode(t);if(!(n instanceof pe))throw new TypeError("Invalid from location");return n.isChildVisible(i)}setViewVisible(e,t){this.hasMaximizedView()&&this.exitMaximizedView();let[i,n]=Le(e),[,o]=this.getNode(i);if(!(o instanceof pe))throw new TypeError("Invalid from location");this._onDidViewVisibilityChange.fire(),o.setChildVisible(n,t)}moveView(e,t,i){this.hasMaximizedView()&&this.exitMaximizedView();let[,n]=this.getNode(e);if(!(n instanceof pe))throw new TypeError("Invalid location");n.moveChild(t,i)}addView(e,t,i){this.hasMaximizedView()&&this.exitMaximizedView();let[n,o]=Le(i),[a,d]=this.getNode(n);if(d instanceof pe){let l=new me(e,$e(d.orientation),d.orthogonalSize);d.addChild(l,t,o)}else{let[l,...u]=[...a].reverse(),[v,...g]=[...n].reverse(),f=0,_=l.getChildCachedVisibleSize(v);typeof _=="number"&&(f=he.Invisible(_)),l.removeChild(v).dispose();let w=new pe(d.orientation,this.proportionalLayout,this.styles,d.size,d.orthogonalSize,this.locked,this.margin);l.addChild(w,d.size,v);let y=new me(d.view,l.orientation,d.size);w.addChild(y,f,0),typeof t!="number"&&t.type==="split"&&(t={type:"split",index:0});let D=new me(e,l.orientation,d.size);w.addChild(D,t,o)}}remove(e,t){let i=se(e.element);return this.removeView(i,t)}removeView(e,t){this.hasMaximizedView()&&this.exitMaximizedView();let[i,n]=Le(e),[o,a]=this.getNode(i);if(!(a instanceof pe))throw new TypeError("Invalid location");let d=a.children[n];if(!(d instanceof me))throw new TypeError("Invalid location");if(a.removeChild(n,t),d.dispose(),a.children.length!==1)return d.view;let l=a.children[0];if(o.length===0)return l instanceof me||(a.removeChild(0,t),this.root=l),d.view;let[u,...v]=[...o].reverse(),[g,...f]=[...i].reverse(),_=a.isChildVisible(0);a.removeChild(0,t);let w=u.children.map((y,D)=>u.getChildSize(D));if(u.removeChild(g,t).dispose(),l instanceof pe){w.splice(g,1,...l.children.map(y=>y.size));for(let y=0;y<l.children.length;y++){let D=l.children[y],G=cn(l,y,D.size);u.addChild(D,!_&&typeof G=="number"?he.Invisible(G):G,g+y)}for(;l.children.length>0;)l.removeChild(0)}else{let y=new me(l.view,$e(l.orientation),l.size),D=_?l.orthogonalSize:he.Invisible(l.orthogonalSize);u.addChild(y,D,g)}l.dispose();for(let y=0;y<w.length;y++)u.resizeChild(y,w[y]);return d.view}layout(e,t){let[i,n]=this.root.orientation==="HORIZONTAL"?[t,e]:[e,t];this.root.layout(i,n)}getNode(e,t=this.root,i=[]){if(e.length===0)return[i,t];if(!(t instanceof pe))throw new TypeError("Invalid location");let[n,...o]=e;if(n<0||n>=t.children.length)throw new Error("Invalid location");let a=t.children[n];return i.push(t),this.getNode(o,a,i)}};let td=Object.keys({disableAutoResizing:void 0,proportionalLayout:void 0,orientation:void 0,hideBorders:void 0,className:void 0});var gn=class extends C{get element(){return this._element}get disableResizing(){return this._disableResizing}set disableResizing(e){this._disableResizing=e}constructor(e,t=!1){super(),this._lastWidth=-1,this._lastHeight=-1,this._disableResizing=t,this._element=e,this.addDisposables(Ye(this._element,i=>{if(this.isDisposed||this.disableResizing||!this._element.offsetParent||!U(this._element))return;let n=Math.round(i.contentRect.width),o=Math.round(i.contentRect.height);n===this._lastWidth&&o===this._lastHeight||(this._lastWidth=n,this._lastHeight=o,this.layout(n,o))}))}layoutFromElement(){if(this.disableResizing||!this._element.offsetParent||!U(this._element))return;let e=Math.round(this._element.clientWidth),t=Math.round(this._element.clientHeight);e===0||t===0||this.layout(e,t)}};let id=dn();function Nt(e){switch(e){case"left":return"left";case"right":return"right";case"above":return"top";case"below":return"bottom";default:return"center"}}var mn=class extends gn{get id(){return this._id}get size(){return this._groups.size}get groups(){return Array.from(this._groups.values()).map(e=>e.value)}get width(){return this.gridview.width}get height(){return this.gridview.height}get minimumHeight(){return this.gridview.minimumHeight}get maximumHeight(){return this.gridview.maximumHeight}get minimumWidth(){return this.gridview.minimumWidth}get maximumWidth(){return this.gridview.maximumWidth}get activeGroup(){return this._activeGroup}get locked(){return this.gridview.locked}set locked(e){this.gridview.locked=e}constructor(e,t){var i;super(document.createElement("div"),t.disableAutoResizing),this._id=id.next(),this._groups=new Map,this._onDidRemove=new k,this.onDidRemove=this._onDidRemove.event,this._onDidAdd=new k,this.onDidAdd=this._onDidAdd.event,this._onDidMaximizedChange=new k,this.onDidMaximizedChange=this._onDidMaximizedChange.event,this._onDidActiveChange=new k,this.onDidActiveChange=this._onDidActiveChange.event,this._bufferOnDidLayoutChange=new _t,this.onDidLayoutChange=this._bufferOnDidLayoutChange.onEvent,this._onDidViewVisibilityChangeMicroTaskQueue=new _t,this.onDidViewVisibilityChangeMicroTaskQueue=this._onDidViewVisibilityChangeMicroTaskQueue.onEvent,this.element.style.height="100%",this.element.style.width="100%",this._classNames=new Be(this.element),this._classNames.setClassNames((i=t.className)!==null&&i!==void 0?i:""),e.appendChild(this.element),this.gridview=new vn(!!t.proportionalLayout,t.styles,t.orientation,t.locked,t.margin),this.gridview.locked=!!t.locked,this.element.appendChild(this.gridview.element),this.layout(0,0,!0),this.addDisposables(this.gridview.onDidMaximizedNodeChange(n=>{this._onDidMaximizedChange.fire({panel:n.view,isMaximized:n.isMaximized})}),this.gridview.onDidViewVisibilityChange(()=>this._onDidViewVisibilityChangeMicroTaskQueue.fire()),this.onDidViewVisibilityChangeMicroTaskQueue(()=>{this.forceRelayout()}),S.from(()=>{this.element.remove()}),this.gridview.onDidChange(()=>{this._bufferOnDidLayoutChange.fire()}),$.any(this.onDidAdd,this.onDidRemove,this.onDidActiveChange)(()=>{this._bufferOnDidLayoutChange.fire()}),this._onDidMaximizedChange,this._onDidViewVisibilityChangeMicroTaskQueue,this._bufferOnDidLayoutChange)}setVisible(e,t){this.gridview.setViewVisible(se(e.element),t),this._bufferOnDidLayoutChange.fire()}isVisible(e){return this.gridview.isViewVisible(se(e.element))}updateOptions(e){if("proportionalLayout"in e){var t;this.gridview.proportionalLayout=(t=e.proportionalLayout)!==null&&t!==void 0?t:!0}if(e.orientation&&(this.gridview.orientation=e.orientation),"styles"in e,"disableAutoResizing"in e){var i;this.disableResizing=(i=e.disableAutoResizing)!==null&&i!==void 0?i:!1}if("locked"in e){var n;this.locked=(n=e.locked)!==null&&n!==void 0?n:!1}if("margin"in e){var o;this.gridview.margin=(o=e.margin)!==null&&o!==void 0?o:0}if("className"in e){var a;this._classNames.setClassNames((a=e.className)!==null&&a!==void 0?a:"")}}maximizeGroup(e){this.gridview.maximizeView(e),this.doSetGroupActive(e)}isMaximizedGroup(e){return this.gridview.maximizedView()===e}exitMaximizedGroup(){this.gridview.exitMaximizedView()}hasMaximizedGroup(){return this.gridview.hasMaximizedView()}doAddGroup(e,t=[0],i,n=this.gridview){n.addView(e,i??he.Distribute,t),this._onDidAdd.fire(e)}doRemoveGroup(e,t){if(!this._groups.has(e.id))throw new Error("invalid operation");let i=this._groups.get(e.id),n=this.gridview.remove(e,he.Distribute);if(i&&!t?.skipDispose&&(i.disposable.dispose(),i.value.dispose(),this._groups.delete(e.id),this._onDidRemove.fire(e)),!t?.skipActive&&this._activeGroup===e){let o=Array.from(this._groups.values());this.doSetGroupActive(o.length>0?o[0].value:void 0)}return n}getPanel(e){var t;return(t=this._groups.get(e))===null||t===void 0?void 0:t.value}doSetGroupActive(e){this._activeGroup!==e&&(this._activeGroup&&this._activeGroup.setActive(!1),e&&e.setActive(!0),this._activeGroup=e,this._onDidActiveChange.fire(e))}removeGroup(e){this.doRemoveGroup(e)}activateNext(e){var t,i;if((t=e)!==null&&t!==void 0||(e={}),!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}let n=se(e.group.element),o=(i=this.gridview.next(n))===null||i===void 0?void 0:i.view;this.doSetGroupActive(o)}activatePrevious(e){var t,i;if((t=e)!==null&&t!==void 0||(e={}),!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}let n=se(e.group.element),o=(i=this.gridview.previous(n))===null||i===void 0?void 0:i.view;this.doSetGroupActive(o)}forceRelayout(){this.layout(this.width,this.height,!0)}layout(e,t,i){(i||e!==this.width||t!==this.height)&&(this.gridview.element.style.height=`${t}px`,this.gridview.element.style.width=`${e}px`,this.gridview.layout(e,t))}dispose(){this._onDidActiveChange.dispose(),this._onDidAdd.dispose(),this._onDidRemove.dispose();for(let e of this.groups)e.dispose();this.gridview.dispose(),super.dispose()}};function Vt(e){"@babel/helpers - typeof";return Vt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Vt(e)}function nd(e,t){if(Vt(e)!="object"||!e)return e;var i=e[Symbol.toPrimitive];if(i!==void 0){var n=i.call(e,t||"default");if(Vt(n)!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function od(e){var t=nd(e,"string");return Vt(t)=="symbol"?t:t+""}function rd(e,t,i){return(t=od(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function Io(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),i.push.apply(i,n)}return i}function N(e){for(var t=1;t<arguments.length;t++){var i=arguments[t]!=null?arguments[t]:{};t%2?Io(Object(i),!0).forEach(function(n){rd(e,n,i[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):Io(Object(i)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(i,n))})}return e}function sd(e,t){return e==="center"?`Tab into ${t}`:`Split ${e} of ${t}`}function ad(e,t){return e==="center"?`docked into ${t}`:`split ${e} of ${t}`}let di={panelOpened:e=>`${e} opened`,panelClosed:e=>`${e} closed`,groupMaximized:e=>`${e} maximized`,groupRestored:e=>`${e} restored`,groupFloated:e=>`${e} floated`,groupDocked:e=>`${e} docked`,groupPoppedOut:e=>`${e} opened in a new window`,closeTab:e=>`Close ${e}`,closeTabPlain:()=>"Close",movePickTarget:(e,t,i,n)=>`Moving ${e}. Target ${t}, ${i} of ${n}. Enter to choose where, Escape to cancel.`,movePickEdge:(e,t)=>`${sd(e,t)}. Arrows to change, Enter to confirm, Escape to go back.`,moveCommitted:(e,t,i)=>`${e} ${ad(i,t)}.`,moveCancelled:()=>"Move cancelled.",moveNotAllowed:()=>"That move is not allowed.",moveFloated:e=>`${e} floated.`};function bn(e){return e?N(N({},di),e):di}var Mo=class{get minimumSize(){return this.component.minimumSize}get maximumSize(){return this.component.maximumSize}get width(){return this.component.width}get height(){return this.component.height}get length(){return this.component.length}get orientation(){return this.component.orientation}get panels(){return this.component.panels}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidAddView(){return this.component.onDidAddView}get onDidRemoveView(){return this.component.onDidRemoveView}constructor(e){this.component=e}removePanel(e,t){this.component.removePanel(e,t)}focus(){this.component.focus()}getPanel(e){return this.component.getPanel(e)}layout(e,t){return this.component.layout(e,t)}addPanel(e){return this.component.addPanel(e)}movePanel(e,t){this.component.movePanel(e,t)}fromJSON(e){this.component.fromJSON(e)}toJSON(){return this.component.toJSON()}clear(){this.component.clear()}updateOptions(e){this.component.updateOptions(e)}dispose(){this.component.dispose()}},Dt=class{get minimumSize(){return this.component.minimumSize}get maximumSize(){return this.component.maximumSize}get width(){return this.component.width}get height(){return this.component.height}get panels(){return this.component.panels}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get onDidAddView(){return this.component.onDidAddView}get onDidRemoveView(){return this.component.onDidRemoveView}get onDidDrop(){return this.component.onDidDrop}get onUnhandledDragOver(){return this.component.onUnhandledDragOver}constructor(e){this.component=e}removePanel(e){this.component.removePanel(e)}getPanel(e){return this.component.getPanel(e)}movePanel(e,t){this.component.movePanel(e,t)}focus(){this.component.focus()}layout(e,t){this.component.layout(e,t)}addPanel(e){return this.component.addPanel(e)}fromJSON(e){this.component.fromJSON(e)}toJSON(){return this.component.toJSON()}clear(){this.component.clear()}updateOptions(e){this.component.updateOptions(e)}dispose(){this.component.dispose()}},Oo=class{get width(){return this.component.width}get height(){return this.component.height}get minimumHeight(){return this.component.minimumHeight}get maximumHeight(){return this.component.maximumHeight}get minimumWidth(){return this.component.minimumWidth}get maximumWidth(){return this.component.maximumWidth}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidAddPanel(){return this.component.onDidAddGroup}get onDidRemovePanel(){return this.component.onDidRemoveGroup}get onDidActivePanelChange(){return this.component.onDidActiveGroupChange}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get panels(){return this.component.groups}get orientation(){return this.component.orientation}set orientation(e){this.component.updateOptions({orientation:e})}constructor(e){this.component=e}focus(){this.component.focus()}layout(e,t,i=!1){this.component.layout(e,t,i)}addPanel(e){return this.component.addPanel(e)}removePanel(e,t){this.component.removePanel(e,t)}movePanel(e,t){this.component.movePanel(e,t)}getPanel(e){return this.component.getPanel(e)}fromJSON(e){return this.component.fromJSON(e)}toJSON(){return this.component.toJSON()}clear(){this.component.clear()}updateOptions(e){this.component.updateOptions(e)}dispose(){this.component.dispose()}},li=class{get id(){return this.component.id}get width(){return this.component.width}get height(){return this.component.height}get minimumHeight(){return this.component.minimumHeight}get maximumHeight(){return this.component.maximumHeight}get minimumWidth(){return this.component.minimumWidth}get maximumWidth(){return this.component.maximumWidth}get size(){return this.component.size}get tabGroupColors(){return this.component.tabGroupColorPalette.entries()}get totalPanels(){return this.component.totalPanels}get onDidActiveGroupChange(){return this.component.onDidActiveGroupChange}get onDidAddGroup(){return this.component.onDidAddGroup}get onDidRemoveGroup(){return this.component.onDidRemoveGroup}get onDidActivePanelChange(){return this.component.onDidActivePanelChange}get onDidPanelPinnedChange(){return this.component.onDidPanelPinnedChange}get onDidAddPanel(){return this.component.onDidAddPanel}get onDidRemovePanel(){return this.component.onDidRemovePanel}get onDidMovePanel(){return this.component.onDidMovePanel}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidDrop(){return this.component.onDidDrop}get onWillDrop(){return this.component.onWillDrop}get onWillMutateLayout(){return this.component.onWillMutateLayout}get onDidMutateLayout(){return this.component.onDidMutateLayout}get onWillShowOverlay(){return this.component.onWillShowOverlay}get onWillDragGroup(){return this.component.onWillDragGroup}get onWillDragPanel(){return this.component.onWillDragPanel}get onUnhandledDragOver(){return this.component.onUnhandledDragOver}get dndCapabilities(){return this.component.dndCapabilities}get onDidPopoutGroupSizeChange(){return this.component.onDidPopoutGroupSizeChange}get onDidPopoutGroupPositionChange(){return this.component.onDidPopoutGroupPositionChange}get onDidAddPopoutGroup(){return this.component.onDidAddPopoutGroup}get onDidRemovePopoutGroup(){return this.component.onDidRemovePopoutGroup}get onDidOpenPopoutWindowFail(){return this.component.onDidOpenPopoutWindowFail}get onWillClosePopoutWindow(){return this.component.onWillClosePopoutWindow}getPopouts(){return this.component.getPopouts()}get onDidCreateTabGroup(){return this.component.onDidCreateTabGroup}get onDidDestroyTabGroup(){return this.component.onDidDestroyTabGroup}get onDidAddPanelToTabGroup(){return this.component.onDidAddPanelToTabGroup}get onDidRemovePanelFromTabGroup(){return this.component.onDidRemovePanelFromTabGroup}get onDidTabGroupChange(){return this.component.onDidTabGroupChange}get onDidTabGroupCollapsedChange(){return this.component.onDidTabGroupCollapsedChange}get panels(){return this.component.panels}get groups(){return this.component.groups}adjacentGroupInDirection(e,t){return this.component.adjacentGroupInDirection(e,t)}get activePanel(){return this.component.activePanel}get activeGroup(){return this.component.activeGroup}get messages(){return bn(this.component.options.messages)}constructor(e){this.component=e}focus(){this.component.focus()}getPanel(e){return this.component.getGroupPanel(e)}layout(e,t,i=!1){this.component.layout(e,t,i)}addPanel(e){return this.component.withOrigin("api",()=>this.component.addPanel(e))}removePanel(e,t){this.component.withOrigin("api",()=>this.component.removePanel(e,t))}addGroup(e){return this.component.withOrigin("api",()=>this.component.addGroup(e))}closeAllGroups(){return this.component.withOrigin("api",()=>this.component.closeAllGroups())}removeGroup(e){this.component.withOrigin("api",()=>this.component.removeGroup(e))}getGroup(e){return this.component.getPanel(e)}addFloatingGroup(e,t){return this.component.withOrigin("api",()=>this.component.addFloatingGroup(e,t))}fromJSON(e,t){this.component.withOrigin("api",()=>this.component.fromJSON(e,t))}toJSON(){return this.component.toJSON()}clear(){this.component.withOrigin("api",()=>this.component.clear())}undo(){this.component.undo()}redo(){this.component.redo()}get canUndo(){return this.component.canUndo}get canRedo(){return this.component.canRedo}clearHistory(){this.component.clearHistory()}get onDidChangeHistory(){return this.component.onDidChangeHistory}get smartGuidesEnabled(){return this.component.smartGuidesEnabled}setSmartGuidesEnabled(e){this.component.setSmartGuidesEnabled(e)}updateSmartGuidesOptions(e){this.component.updateSmartGuidesOptions(e)}get onDidSnapFloat(){return this.component.onDidSnapFloat}get onDidSnapTogether(){return this.component.onDidSnapTogether}get popoutRestorationPromise(){return this.component.popoutRestorationPromise}activateNext(e){this.component.activateNext(e)}activatePrevious(e){this.component.activatePrevious(e)}moveToNext(e){this.activateNext(e)}moveToPrevious(e){this.activatePrevious(e)}maximizeGroup(e){this.component.withOrigin("api",()=>this.component.maximizeGroup(e.group))}hasMaximizedGroup(){return this.component.hasMaximizedGroup()}exitMaximizedGroup(){this.component.withOrigin("api",()=>this.component.exitMaximizedGroup())}get onDidMaximizedGroupChange(){return this.component.onDidMaximizedGroupChange}addPopoutGroup(e,t){return this.component.withOrigin("api",()=>this.component.addPopoutGroup(e,t))}addEdgeGroup(e,t){return this.component.addEdgeGroup(e,t)}revealEdgeGroupWithData(e,t,i){this.component.revealEdgeGroupWithData(e,t,i)}getEdgeGroup(e){return this.component.getEdgeGroup(e)}setEdgeGroupVisible(e,t){this.component.setEdgeGroupVisible(e,t)}isEdgeGroupVisible(e){return this.component.isEdgeGroupVisible(e)}removeEdgeGroup(e){this.component.removeEdgeGroup(e)}pinEdgeGroup(e){this.component.pinEdgeGroup(e)}autoHideEdgeGroup(e){this.component.autoHideEdgeGroup(e)}peekEdgeGroup(e,t){this.component.peekEdgeGroup(e,t)}updateOptions(e){this.component.updateOptions(e)}_getGroupModel(e){let t=this.component.getPanel(e);if(!t)throw new Error(`dockview: group '${e}' not found`);return t.model}createTabGroup(e){let t=this._getGroupModel(e.groupId);return this.component.withOrigin("api",()=>t.createTabGroup({label:e.label,color:e.color,componentParams:e.componentParams}))}dissolveTabGroup(e){let t=this._getGroupModel(e.groupId);this.component.withOrigin("api",()=>t.dissolveTabGroup(e.tabGroupId))}addPanelToTabGroup(e){let t=this._getGroupModel(e.groupId);this.component.withOrigin("api",()=>t.addPanelToTabGroup(e.tabGroupId,e.panelId,e.index))}removePanelFromTabGroup(e){let t=this._getGroupModel(e.groupId);this.component.withOrigin("api",()=>t.removePanelFromTabGroup(e.panelId))}getTabGroups(e){return this._getGroupModel(e.groupId).getTabGroups()}getTabGroupForPanel(e){return this._getGroupModel(e.groupId).getTabGroupForPanel(e.panelId)}moveTabGroup(e){this._getGroupModel(e.groupId).moveTabGroup(e.tabGroupId,e.index)}dispose(){this.component.dispose()}},Lo=class extends C{constructor(e,t){super(),this.element=e,this.callbacks=t,this.target=null,this.registerListeners()}onDragEnter(e){this.target=e.target,this.callbacks.onDragEnter(e)}onDragOver(e){e.preventDefault(),this.callbacks.onDragOver&&this.callbacks.onDragOver(e)}onDragLeave(e){this.target===e.target&&(this.target=null,this.callbacks.onDragLeave(e))}onDragEnd(e){this.target=null,this.callbacks.onDragEnd(e)}onDrop(e){this.callbacks.onDrop(e)}registerListeners(){this.addDisposables(M(this.element,"dragenter",e=>{this.onDragEnter(e)},!0)),this.addDisposables(M(this.element,"dragover",e=>{this.onDragOver(e)},!0)),this.addDisposables(M(this.element,"dragleave",e=>{this.onDragLeave(e)})),this.addDisposables(M(this.element,"dragend",e=>{this.onDragEnd(e)})),this.addDisposables(M(this.element,"drop",e=>{this.onDrop(e)}))}};let dd={value:50,type:"percentage"},ld=100,cd=100;function fn(){let e=document.createElement("div");e.className="dv-drop-target-dropzone";let t=document.createElement("div");return t.className="dv-drop-target-selection",e.appendChild(t),{dropzone:e,selection:t}}function Ro(e,t,i,n){var o,a,d;let l=(o=n?.smallWidthBoundary)!==null&&o!==void 0?o:ld,u=(a=n?.smallHeightBoundary)!==null&&a!==void 0?a:cd,v=t<l,g=i<u,f=e==="left",_=e==="right",w=e==="top",y=e==="bottom",D=!v&&_,G=!v&&f,T=!g&&w,z=!g&&y,P=1,I=(d=n?.size)!==null&&d!==void 0?d:dd;return I.type==="percentage"?P=de(I.value,0,100)/100:((D||G)&&(P=de(0,I.value,t)/t),(T||z)&&(P=de(0,I.value,i)/i)),{isSmallX:v,isSmallY:g,isLeft:f,isRight:_,isTop:w,isBottom:y,rightClass:D,leftClass:G,topClass:T,bottomClass:z,size:P}}function $o(e,t,i,n,o){let a=Ro(t,i,n,o),{rightClass:d,leftClass:l,topClass:u,bottomClass:v,size:g}=a,f={top:"0px",left:"0px",width:"100%",height:"100%"};d?(f.left=`${100*(1-g)}%`,f.width=`${100*g}%`):l?f.width=`${100*g}%`:u?f.height=`${100*g}%`:v&&(f.top=`${100*(1-g)}%`,f.height=`${100*g}%`),a.isSmallX&&a.isLeft&&(f.width="4px"),a.isSmallX&&a.isRight&&(f.left=`${i-4}px`,f.width="4px"),a.isSmallY&&a.isTop&&(f.height="4px"),a.isSmallY&&a.isBottom&&(f.top=`${n-4}px`,f.height="4px"),e.style.top=f.top,e.style.left=f.left,e.style.width=f.width,e.style.height=f.height,e.style.visibility="visible",(!e.style.transform||e.style.transform==="")&&(e.style.transform="translate3d(0, 0, 0)");let _=a.isSmallX&&(a.isLeft||a.isRight)||a.isSmallY&&(a.isTop||a.isBottom);A(e,"dv-drop-target-small-vertical",a.isSmallY),A(e,"dv-drop-target-small-horizontal",a.isSmallX),A(e,"dv-drop-target-selection-line",_),A(e,"dv-drop-target-left",a.isLeft),A(e,"dv-drop-target-right",a.isRight),A(e,"dv-drop-target-top",a.isTop),A(e,"dv-drop-target-bottom",a.isBottom),A(e,"dv-drop-target-center",t==="center")}function hd(e,t){let i=`${Math.round(t.top)}px`,n=`${Math.round(t.left)}px`,o=`${Math.round(t.width)}px`,a=`${Math.round(t.height)}px`;return e.style.top!==i||e.style.left!==n||e.style.width!==o||e.style.height!==a}function ud(e,t){e.style.top=`${Math.round(t.top)}px`,e.style.left=`${Math.round(t.left)}px`,e.style.width=`${Math.round(t.width)}px`,e.style.height=`${Math.round(t.height)}px`,e.style.visibility="visible",(!e.style.transform||e.style.transform==="")&&(e.style.transform="translate3d(0, 0, 0)")}function No(e){let t=Ro(e.quadrant,e.width,e.height,e.overlayModel),{rightClass:i,leftClass:n,topClass:o,bottomClass:a,size:d}=t,l=e.outlineElement.getBoundingClientRect(),u=e.targetModel.getElements(void 0,e.outlineElement),v=u.root,g=u.overlay,f=v.getBoundingClientRect(),_=l.top-f.top,w=l.left-f.left,y={top:_,left:w,width:e.width,height:e.height};return i?(y.left=w+e.width*(1-d),y.width=e.width*d):n?y.width=e.width*d:o?y.height=e.height*d:a&&(y.top=_+e.height*(1-d),y.height=e.height*d),t.isSmallX&&t.isLeft&&(y.width=4),t.isSmallX&&t.isRight&&(y.left=w+e.width-4,y.width=4),t.isSmallY&&t.isTop&&(y.height=4),t.isSmallY&&t.isBottom&&(y.top=_+e.height-4,y.height=4),hd(g,y)?(ud(g,y),g.className=`dv-drop-target-anchor${e.className?` ${e.className}`:""}`,A(g,"dv-drop-target-left",t.isLeft),A(g,"dv-drop-target-right",t.isRight),A(g,"dv-drop-target-top",t.isTop),A(g,"dv-drop-target-bottom",t.isBottom),A(g,"dv-drop-target-anchor-line",t.isSmallX&&(t.isLeft||t.isRight)||t.isSmallY&&(t.isTop||t.isBottom)),A(g,"dv-drop-target-center",e.quadrant==="center"),u.changed&&(A(g,"dv-drop-target-anchor-container-changed",!0),setTimeout(()=>{A(g,"dv-drop-target-anchor-container-changed",!1)},10)),{boundsChanged:!0,targetChanged:u.changed}):{boundsChanged:!1,targetChanged:u.changed}}var Vo=class extends J{get nativeEvent(){return this.options.nativeEvent}get position(){return this.options.position}get edge(){return!!this.options.edge}get edgeGroup(){return!!this.options.edgeGroup}constructor(e){super(),this.options=e}};function _n(e){switch(e){case"above":return"top";case"below":return"bottom";case"left":return"left";case"right":return"right";case"within":return"center";default:throw new Error(`invalid direction '${e}'`)}}function Wo(e){switch(e){case"top":return"above";case"bottom":return"below";case"left":return"left";case"right":return"right";case"center":return"within";default:throw new Error(`invalid position '${e}'`)}}let pd={value:20,type:"percentage"};var wn=class ei extends C{get disabled(){return this._disabled}set disabled(t){this._disabled=t}get state(){return this._state}constructor(t,i){super(),this.element=t,this.options=i,this._edge=!1,this._onDrop=new k,this.onDrop=this._onDrop.event,this._onWillShowOverlay=new k,this.onWillShowOverlay=this._onWillShowOverlay.event,this._disabled=!1,this._acceptedTargetZonesSet=new Set(this.options.acceptedTargetZones),this.dnd=new Lo(this.element,{onDragEnter:()=>{var n,o;(n=(o=this.options).getOverrideTarget)===null||n===void 0||(n=n.call(o))===null||n===void 0||n.getElements()},onDragOver:n=>{var o,a,d,l,u,v,g;if(this._disabled){this.clearOwnOverlay();return}ei.ACTUAL_TARGET=this;let f=(o=(a=this.options).getOverrideTarget)===null||o===void 0?void 0:o.call(a);if(this._acceptedTargetZonesSet.size===0){this.clearOwnOverlay();return}let _=(d=(l=(u=this.options).getOverlayOutline)===null||l===void 0?void 0:l.call(u))!==null&&d!==void 0?d:this.element,w=_.offsetWidth,y=_.offsetHeight;if(w===0||y===0)return;let D=_.getBoundingClientRect(),G=((v=n.clientX)!==null&&v!==void 0?v:0)-D.left,T=((g=n.clientY)!==null&&g!==void 0?g:0)-D.top,z=this.resolvePosition(G,T,w,y,n);if(this.isAlreadyUsed(n)){this.removeDropTarget();return}if(z===null){this.clearOwnOverlay();return}let P=z.position;if(!this.options.canDisplayOverlay(n,P)){this.clearOwnOverlay();return}let I=new Vo({nativeEvent:n,position:P,edge:z.edge,edgeGroup:z.edgeGroup});if(this._onWillShowOverlay.fire(I),I.defaultPrevented){this.clearOwnOverlay();return}if(this.markAsUsed(n),z.edge){this.clearOwnOverlay(),this._state=P,this._edge=!0;return}if(this._edge=!1,!f){if(!this.targetElement){let W=fn();this.targetElement=W.dropzone,this.overlayElement=W.selection,this._state="center",_.classList.add("dv-drop-target"),_.append(this.targetElement)}}this.toggleClasses(P,w,y),this._state=P},onDragLeave:()=>{var n,o;let a=(n=(o=this.options).getOverrideTarget)===null||n===void 0?void 0:n.call(o);if(a){var d;this._state=void 0,this._edge=!1,(d=a.scheduleClear)===null||d===void 0||d.call(a);return}this.removeDropTarget()},onDragEnd:n=>{var o,a;let d=(o=(a=this.options).getOverrideTarget)===null||o===void 0?void 0:o.call(a);d&&ei.ACTUAL_TARGET===this&&this._state&&(n.stopPropagation(),this._onDrop.fire({position:this._state,nativeEvent:n,edge:this._edge})),this.removeDropTarget(),d?.clear()},onDrop:n=>{var o,a;n.preventDefault();let d=this._state,l=this._edge;this.removeDropTarget(),(o=(a=this.options).getOverrideTarget)===null||o===void 0||(o=o.call(a))===null||o===void 0||o.clear(),d&&(n.stopPropagation(),this._onDrop.fire({position:d,nativeEvent:n,edge:l}))}}),this.addDisposables(this._onDrop,this._onWillShowOverlay,this.dnd)}setTargetZones(t){this._acceptedTargetZonesSet=new Set(t)}setOverlayModel(t){this.options.overlayModel=t}dispose(){this.removeDropTarget(),super.dispose()}markAsUsed(t){t[ei.USED_EVENT_ID]=!0}isAlreadyUsed(t){let i=t[ei.USED_EVENT_ID];return typeof i=="boolean"&&i}toggleClasses(t,i,n){var o,a;let d=(o=(a=this.options).getOverrideTarget)===null||o===void 0?void 0:o.call(a);if(d){var l,u,v;No({outlineElement:(l=(u=(v=this.options).getOverlayOutline)===null||u===void 0?void 0:u.call(v))!==null&&l!==void 0?l:this.element,targetModel:d,quadrant:t,width:i,height:n,overlayModel:this.options.overlayModel,className:this.options.className});return}this.overlayElement&&$o(this.overlayElement,t,i,n,this.options.overlayModel)}resolvePosition(t,i,n,o,a){var d,l;let u=(d=(l=this.options).getPositionResolver)===null||d===void 0?void 0:d.call(l);if(u){let g=u.resolve({x:t,y:i,width:n,height:o,zones:this._acceptedTargetZonesSet,event:a});return g?{position:g.position,edge:!!g.edge,edgeGroup:!!g.edgeGroup}:null}let v=this.calculateQuadrant(this._acceptedTargetZonesSet,t,i,n,o);return v?{position:v,edge:!1,edgeGroup:!1}:null}calculateQuadrant(t,i,n,o,a){var d,l;let u=(d=(l=this.options.overlayModel)===null||l===void 0?void 0:l.activationSize)!==null&&d!==void 0?d:pd;return u.type==="percentage"?Ho(t,i,n,o,a,u.value):Fo(t,i,n,o,a,u.value)}clearOwnOverlay(){let t=this._state!==void 0;if(this.removeDropTarget(),t){var i,n;(i=(n=this.options).getOverrideTarget)===null||i===void 0||(i=i.call(n))===null||i===void 0||i.clear()}}removeDropTarget(){if(this._state=void 0,this._edge=!1,this.targetElement){var t;(t=this.targetElement.parentElement)===null||t===void 0||t.classList.remove("dv-drop-target"),this.targetElement.remove(),this.targetElement=void 0,this.overlayElement=void 0}}showOverlay(t){var i,n,o,a,d;let l=(i=(n=this.options).getOverrideTarget)===null||i===void 0?void 0:i.call(n),u=(o=(a=(d=this.options).getOverlayOutline)===null||a===void 0?void 0:a.call(d))!==null&&o!==void 0?o:this.element,v=u.offsetWidth,g=u.offsetHeight;if(!l&&!this.targetElement){let f=fn();this.targetElement=f.dropzone,this.overlayElement=f.selection,u.classList.add("dv-drop-target"),u.append(this.targetElement)}this.toggleClasses(t,v,g),this._state=t}clearOverlay(){var t,i;this.removeDropTarget(),(t=(i=this.options).getOverrideTarget)===null||t===void 0||(t=t.call(i))===null||t===void 0||t.clear(),this._state=void 0}};wn.USED_EVENT_ID="__dockview_droptarget_event_is_used__";function Ho(e,t,i,n,o,a){let d=100*t/n,l=100*i/o;return e.has("left")&&d<a?"left":e.has("right")&&d>100-a?"right":e.has("top")&&l<a?"top":e.has("bottom")&&l>100-a?"bottom":e.has("center")?"center":null}function Fo(e,t,i,n,o,a){return e.has("left")&&t<a?"left":e.has("right")&&t>n-a?"right":e.has("top")&&i<a?"top":e.has("bottom")&&i>o-a?"bottom":e.has("center")?"center":null}function vd(e,t,i){var n,o,a;fe(t,"dv-dragged"),t.style.top="-9999px",t.style.position="absolute",(i?.owner?ko(i.owner):((n=i?.ownerDocument)!==null&&n!==void 0?n:document).body).appendChild(t),e.setDragImage(t,(o=i?.x)!==null&&o!==void 0?o:0,(a=i?.y)!==null&&a!==void 0?a:0),setTimeout(()=>{be(t,"dv-dragged"),t.remove()},0)}var ci=class ti extends C{static getInstance(){var t;return(t=ti._instance)!==null&&t!==void 0||(ti._instance=new ti),ti._instance}constructor(){super(),this._targets=new Set,this._targetByElement=new Map,this._onDragStart=new k,this.onDragStart=this._onDragStart.event,this._onDragMove=new k,this.onDragMove=this._onDragMove.event,this._onDragEnd=new k,this.onDragEnd=this._onDragEnd.event,this.addDisposables(this._onDragStart,this._onDragMove,this._onDragEnd)}get active(){return this._active}registerTarget(t){return this._targets.add(t),this._targetByElement.set(t.element,t),{dispose:()=>{this._targets.delete(t),this._targetByElement.get(t.element)===t&&this._targetByElement.delete(t.element),this._currentTarget===t&&(this._currentTarget=void 0)}}}beginDrag(t){var i,n,o,a;this._active&&this.cancel();let{pointerEvent:d,source:l}=t,u=t.getData();this._active={pointerId:d.pointerId,startX:d.clientX,startY:d.clientY,source:l},this._lastPointerEvent=d,this._onDragMoveCallback=t.onDragMove,this._onDragEndCallback=t.onDragEnd,this._dataDisposable=u,this._ghost=t.ghost,this._iframeShield=q((i=l.ownerDocument)!==null&&i!==void 0?i:document),this._selectionShield=ye((n=l.ownerDocument)!==null&&n!==void 0?n:document);let v={clientX:d.clientX,clientY:d.clientY,pointerEvent:d};this._onDragStart.fire(v);let g=(o=(a=l.ownerDocument)===null||a===void 0?void 0:a.defaultView)!==null&&o!==void 0?o:globalThis.window;this._moveListener=M(g,"pointermove",f=>{var _;f.pointerId===((_=this._active)===null||_===void 0?void 0:_.pointerId)&&this._handleMove(f)}),this._upListener=M(g,"pointerup",f=>{var _;f.pointerId===((_=this._active)===null||_===void 0?void 0:_.pointerId)&&this._handleEnd(f,!0)}),this._cancelListener=M(g,"pointercancel",f=>{var _;f.pointerId===((_=this._active)===null||_===void 0?void 0:_.pointerId)&&this._handleEnd(f,!1)})}cancel(){var t,i;if(!this._active)return;let n=this._onDragEndCallback,o=this._lastPointerEvent;if((t=this._currentTarget)===null||t===void 0||t.handleDragLeave(),this._teardown(),(i=this._dataDisposable)===null||i===void 0||i.dispose(),this._dataDisposable=void 0,o){let a={clientX:o.clientX,clientY:o.clientY,pointerEvent:o};n?.(a,!1),this._onDragEnd.fire(a)}}_findTargetUnder(t,i){let n=(this._active?re(this._active.source):document).elementsFromPoint(t,i);for(let a of n){let d=a;for(;d;){var o;let l=this._targetByElement.get(d);if(l&&!(!((o=l.isHitTestTransparent)===null||o===void 0)&&o.call(l)))return l;d=d.parentElement}}}_handleMove(t){var i,n;this._lastPointerEvent=t,(i=this._ghost)===null||i===void 0||i.update(t.clientX,t.clientY);let o={clientX:t.clientX,clientY:t.clientY,pointerEvent:t},a=this._findTargetUnder(t.clientX,t.clientY);if(a!==this._currentTarget){var d;(d=this._currentTarget)===null||d===void 0||d.handleDragLeave(),this._currentTarget=a}a&&a.handleDragOver(o),(n=this._onDragMoveCallback)===null||n===void 0||n.call(this,o),this._onDragMove.fire(o)}_handleEnd(t,i){let n={clientX:t.clientX,clientY:t.clientY,pointerEvent:t};if(i&&this._currentTarget)this._currentTarget.handleDrop(n);else{var o;(o=this._currentTarget)===null||o===void 0||o.handleDragLeave()}let a=this._onDragEndCallback,d=this._dataDisposable;this._teardown(),this._dataDisposable=void 0,setTimeout(()=>d?.dispose(),0),a?.(n,i),this._onDragEnd.fire(n)}_teardown(){var t,i,n,o,a,d;this._currentTarget=void 0,this._active=void 0,this._lastPointerEvent=void 0,this._onDragMoveCallback=void 0,this._onDragEndCallback=void 0,(t=this._ghost)===null||t===void 0||t.dispose(),this._ghost=void 0,(i=this._iframeShield)===null||i===void 0||i.release(),this._iframeShield=void 0,(n=this._selectionShield)===null||n===void 0||n.release(),this._selectionShield=void 0,(o=this._moveListener)===null||o===void 0||o.dispose(),(a=this._upListener)===null||a===void 0||a.dispose(),(d=this._cancelListener)===null||d===void 0||d.dispose(),this._moveListener=void 0,this._upListener=void 0,this._cancelListener=void 0}};let gd={value:20,type:"percentage"};var md=class extends C{get disabled(){return this._disabled}set disabled(e){this._disabled=e,e&&this._removeOverlay()}get state(){return this._state}constructor(e,t){super(),this.element=e,this.options=t,this._edge=!1,this._onDrop=new k,this.onDrop=this._onDrop.event,this._onWillShowOverlay=new k,this.onWillShowOverlay=this._onWillShowOverlay.event,this._disabled=!1,this._acceptedTargetZonesSet=new Set(t.acceptedTargetZones);let i={element:this.element,handleDragOver:n=>this._onDragOver(n),handleDragLeave:()=>this._onDragLeave(),handleDrop:n=>this._onDropEvent(n),isHitTestTransparent:t.isHitTestTransparent};this.addDisposables(this._onDrop,this._onWillShowOverlay,ci.getInstance().registerTarget(i))}clearOverlay(){this._clearOwnOverlay()}setTargetZones(e){this._acceptedTargetZonesSet=new Set(e)}setOverlayModel(e){this.options.overlayModel=e}dispose(){this._removeOverlay(),super.dispose()}_onDragOver(e){var t,i,n,o,a;if(this._disabled){this._clearOwnOverlay();return}let d=(t=(i=this.options).getOverrideTarget)===null||t===void 0?void 0:t.call(i);if(this._acceptedTargetZonesSet.size===0){this._clearOwnOverlay();return}let l=(n=(o=(a=this.options).getOverlayOutline)===null||o===void 0?void 0:o.call(a))!==null&&n!==void 0?n:this.element,u=l.offsetWidth,v=l.offsetHeight;if(u===0||v===0)return;let g=l.getBoundingClientRect(),f=e.clientX-g.left,_=e.clientY-g.top,w=this._resolvePosition(f,_,u,v,e.pointerEvent);if(w===null){this._clearOwnOverlay();return}let y=w.position;if(!this.options.canDisplayOverlay(e.pointerEvent,y)){this._clearOwnOverlay();return}let D=new Vo({nativeEvent:e.pointerEvent,position:y,edge:w.edge});if(this._onWillShowOverlay.fire(D),D.defaultPrevented){this._clearOwnOverlay();return}if(w.edge){this._clearOwnOverlay(),this._state=y,this._edge=!0;return}if(this._edge=!1,d){No({outlineElement:l,targetModel:d,quadrant:y,width:u,height:v,overlayModel:this.options.overlayModel,className:this.options.className}),this._state=y;return}if(!this._targetElement){let G=fn();this._targetElement=G.dropzone,this._overlayElement=G.selection,this._state="center",this.element.classList.add("dv-drop-target"),this.element.append(this._targetElement)}this._overlayElement&&$o(this._overlayElement,y,u,v,this.options.overlayModel),this._state=y}_onDragLeave(){var e,t;let i=(e=(t=this.options).getOverrideTarget)===null||e===void 0?void 0:e.call(t);if(i){this._state=void 0,i.clear();return}this._removeOverlay()}_onDropEvent(e){var t,i;let n=this._state,o=this._edge,a=(t=(i=this.options).getOverrideTarget)===null||t===void 0?void 0:t.call(i);this._removeOverlay(),a?.clear(),n&&this._onDrop.fire({position:n,nativeEvent:e.pointerEvent,edge:o})}_resolvePosition(e,t,i,n,o){var a,d;let l=(a=(d=this.options).getPositionResolver)===null||a===void 0?void 0:a.call(d);if(l){let v=l.resolve({x:e,y:t,width:i,height:n,zones:this._acceptedTargetZonesSet,event:o});return v?{position:v.position,edge:!!v.edge}:null}let u=this._calculateQuadrant(e,t,i,n);return u?{position:u,edge:!1}:null}_calculateQuadrant(e,t,i,n){var o,a;let d=(o=(a=this.options.overlayModel)===null||a===void 0?void 0:a.activationSize)!==null&&o!==void 0?o:gd;return d.type==="percentage"?Ho(this._acceptedTargetZonesSet,e,t,i,n,d.value):Fo(this._acceptedTargetZonesSet,e,t,i,n,d.value)}_clearOwnOverlay(){let e=this._state!==void 0;if(this._removeOverlay(),e){var t,i;(t=(i=this.options).getOverrideTarget)===null||t===void 0||(t=t.call(i))===null||t===void 0||t.clear()}}_removeOverlay(){if(this._edge=!1,this._targetElement){var e;this._state=void 0,(e=this._targetElement.parentElement)===null||e===void 0||e.classList.remove("dv-drop-target"),this._targetElement.remove(),this._targetElement=void 0,this._overlayElement=void 0}else this._state=void 0}};let bd=5,fd=250,_d=8;var wd=class extends C{constructor(e,t){var i;super(),this.element=e,this.options=t,this._disabled=!1,this._armed=!1,this._startX=0,this._startY=0,this._touchOnly=(i=t.touchOnly)!==null&&i!==void 0?i:!0,this.addDisposables(M(this.element,"pointerdown",n=>{this._onPointerDown(n)}))}setDisabled(e){this._disabled=e,e&&this._cancelPending()}setTouchOnly(e){this._touchOnly!==e&&(this._touchOnly=e,e&&this._cancelPending())}_shouldHandle(e){var t,i;return!(this._disabled||this._touchOnly&&e.pointerType!=="touch"&&e.pointerType!=="pen"||!((t=(i=this.options).isCancelled)===null||t===void 0)&&t.call(i,e))}_onPointerDown(e){var t,i,n,o,a,d;if(!this._shouldHandle(e))return;this._cancelPending(),this._selectionShield=ye((t=this.element.ownerDocument)!==null&&t!==void 0?t:document),this._pendingPointerId=e.pointerId,this._startX=e.clientX,this._startY=e.clientY,this._startEvent=e;let l=e.pointerType==="touch"||e.pointerType==="pen",u=this.options.touchInitiationDelay,v=(i=typeof u=="function"?u():u)!==null&&i!==void 0?i:fd;this._armed=!l||v<=0,l&&v>0&&Number.isFinite(v)&&(this._armTimer=setTimeout(()=>{this._armTimer=void 0,this._armed=!0},v));let g=(n=this.options.threshold)!==null&&n!==void 0?n:bd,f=this.options.pressTolerance,_=(o=typeof f=="function"?f():f)!==null&&o!==void 0?o:_d,w=(a=(d=this.element.ownerDocument)===null||d===void 0?void 0:d.defaultView)!==null&&a!==void 0?a:globalThis.window;this._pendingMoveListener=M(w,"pointermove",y=>{if(y.pointerId!==this._pendingPointerId)return;let D=y.clientX-this._startX,G=y.clientY-this._startY,T=Math.hypot(D,G);if(this._armed){T>=g&&this._beginDrag(y);return}T>_&&this._beginDrag(y)}),this._pendingUpListener=M(w,"pointerup",y=>{y.pointerId===this._pendingPointerId&&this._cancelPending()}),this._pendingCancelListener=M(w,"pointercancel",y=>{y.pointerId===this._pendingPointerId&&this._cancelPending()})}cancelPending(){this._cancelPending()}_cancelPending(){var e,t,i,n;(e=this._selectionShield)===null||e===void 0||e.release(),this._selectionShield=void 0,this._pendingPointerId=void 0,this._armTimer!==void 0&&(clearTimeout(this._armTimer),this._armTimer=void 0),this._armed=!1,(t=this._pendingMoveListener)===null||t===void 0||t.dispose(),(i=this._pendingUpListener)===null||i===void 0||i.dispose(),(n=this._pendingCancelListener)===null||n===void 0||n.dispose(),this._pendingMoveListener=void 0,this._pendingUpListener=void 0,this._pendingCancelListener=void 0,this._startEvent=void 0}_beginDrag(e){var t,i,n,o,a;let d=(t=this._startEvent)!==null&&t!==void 0?t:e;this._cancelPending(),(i=(n=this.options).onDragStart)===null||i===void 0||i.call(n,d);let l=(o=(a=this.options).createGhost)===null||o===void 0?void 0:o.call(a,d);ci.getInstance().beginDrag({pointerEvent:e,source:this.element,getData:()=>this.options.getData(d),ghost:l,onDragMove:this.options.onDragMove,onDragEnd:this.options.onDragEnd})}dispose(){this._cancelPending(),super.dispose()}},yd=class{constructor(e){var t,i,n,o;this._disposed=!1,this.element=e.element,this.offsetX=(t=e.offsetX)!==null&&t!==void 0?t:0,this.offsetY=(i=e.offsetY)!==null&&i!==void 0?i:0;let a=e.owner?ko(e.owner):document.body,d;K(a)&&typeof this.element.showPopover=="function"&&(d=this.element.ownerDocument.createElement("div"),d.popover="manual",Object.assign(d.style,{inset:"auto",margin:"0",padding:"0",border:"0",background:"transparent",color:"inherit",overflow:"visible"}),d.appendChild(this.element),this.element.style.pointerEvents="none",this.element.style.transform="none"),this.container=(n=d)!==null&&n!==void 0?n:this.element;let l=this.container.style;l.position="fixed",l.left="0px",l.top="0px",l.pointerEvents="none",l.zIndex="99999",l.opacity=String((o=e.opacity)!==null&&o!==void 0?o:.8),l.willChange="transform",l.transform=`translate3d(${e.initialX-this.offsetX}px, ${e.initialY-this.offsetY}px, 0)`,a.appendChild(this.container),d?.showPopover()}update(e,t){this._disposed||(this.container.style.transform=`translate3d(${e-this.offsetX}px, ${t-this.offsetY}px, 0)`)}dispose(){this._disposed||(this._disposed=!0,this.element.remove(),this.container!==this.element&&this.container.remove())}},xd=class extends C{constructor(e,t){super(),this.el=e,this.opts=t,this._dataDisposable=new E,this._pointerEventsDisposable=new E,this._disabled=!!t.disabled,this.addDisposables(this._dataDisposable,this._pointerEventsDisposable,M(this.el,"dragstart",i=>{var n,o,a,d,l,u,v;if(i.defaultPrevented||this._disabled||!((n=(o=this.opts).isCancelled)===null||n===void 0)&&n.call(o,i)){i.preventDefault();return}let g=q((a=this.el.ownerDocument)!==null&&a!==void 0?a:document);this._pointerEventsDisposable.value={dispose:()=>g.release()},this.el.classList.add("dv-dragged"),setTimeout(()=>this.el.classList.remove("dv-dragged"),0),this._dataDisposable.value=this.opts.getData(i);let f=(d=(l=this.opts).createGhost)===null||d===void 0?void 0:d.call(l,i);if(f&&i.dataTransfer){var _,w,y;if(vd(i.dataTransfer,f.element,{x:(_=f.offsetX)!==null&&_!==void 0?_:0,y:(w=f.offsetY)!==null&&w!==void 0?w:0,ownerDocument:(y=this.el.ownerDocument)!==null&&y!==void 0?y:void 0,owner:this.el}),f.dispose){let D=f.dispose;setTimeout(()=>D(),0)}}i.dataTransfer&&(i.dataTransfer.effectAllowed="move",i.dataTransfer.items.length===0&&i.dataTransfer.setData("text/plain","")),(u=(v=this.opts).onDragStart)===null||u===void 0||u.call(v,i)}),M(this.el,"dragend",i=>{var n,o;this._pointerEventsDisposable.dispose(),setTimeout(()=>this._dataDisposable.dispose(),0),(n=(o=this.opts).onDragEnd)===null||n===void 0||n.call(o,i)}))}setDisabled(e){this._disabled=e}setTouchOnly(e){}cancelPending(){}},Dd=class{constructor(){this.kind="html5"}createDropTarget(e,t){return new wn(e,t)}createDragSource(e,t){return new xd(e,t)}},Sd=class{constructor(){this.kind="pointer"}createDropTarget(e,t){return new md(e,t)}createDragSource(e,t){let i=t.createGhost?o=>{let a=t.createGhost(o);if(!a)return;let d=new yd({element:a.element,initialX:o.clientX,initialY:o.clientY,offsetX:a.offsetX,offsetY:a.offsetY,owner:e});if(a.dispose){let l=d.dispose.bind(d),u=a.dispose;d.dispose=()=>{l(),u()}}return d}:void 0,n=new wd(e,{getData:t.getData,isCancelled:t.isCancelled,onDragStart:t.onDragStart,onDragEnd:t.onDragEnd?o=>t.onDragEnd(o.pointerEvent):void 0,createGhost:i,touchOnly:t.touchOnly,touchInitiationDelay:t.touchInitiationDelay,pressTolerance:t.pressTolerance,threshold:t.threshold});return t.disabled&&n.setDisabled(!0),n}};let Je=new Dd,Ne=new Sd,kd=Object.keys({disableAutoResizing:void 0,disableDnd:void 0,className:void 0});var Bo=class extends te{constructor(e,t,i,n){super(),this.nativeEvent=e,this.position=t,this.getData=i,this.panel=n}},Uo=class extends J{constructor(){super()}},Yo=class extends C{get isFocused(){return this._isFocused}get isActive(){return this._isActive}get isVisible(){return this._isVisible}get width(){return this._width}get height(){return this._height}constructor(e,t){super(),this.id=e,this.component=t,this._isFocused=!1,this._isActive=!1,this._isVisible=!0,this._width=0,this._height=0,this._parameters={},this.panelUpdatesDisposable=new E,this._onDidDimensionChange=new k,this.onDidDimensionsChange=this._onDidDimensionChange.event,this._onDidChangeFocus=new k,this.onDidFocusChange=this._onDidChangeFocus.event,this._onWillFocus=new k,this.onWillFocus=this._onWillFocus.event,this._onDidVisibilityChange=new k,this.onDidVisibilityChange=this._onDidVisibilityChange.event,this._onWillVisibilityChange=new k,this.onWillVisibilityChange=this._onWillVisibilityChange.event,this._onDidActiveChange=new k,this.onDidActiveChange=this._onDidActiveChange.event,this._onActiveChange=new k,this.onActiveChange=this._onActiveChange.event,this._onDidParametersChange=new k,this.onDidParametersChange=this._onDidParametersChange.event,this.addDisposables(this.onDidFocusChange(i=>{this._isFocused=i.isFocused}),this.onDidActiveChange(i=>{this._isActive=i.isActive}),this.onDidVisibilityChange(i=>{this._isVisible=i.isVisible}),this.onDidDimensionsChange(i=>{this._width=i.width,this._height=i.height}),this.panelUpdatesDisposable,this._onDidDimensionChange,this._onDidChangeFocus,this._onDidVisibilityChange,this._onDidActiveChange,this._onWillFocus,this._onActiveChange,this._onWillFocus,this._onWillVisibilityChange,this._onDidParametersChange)}getParameters(){return this._parameters}initialize(e){this.panelUpdatesDisposable.value=this._onDidParametersChange.event(t=>{this._parameters=t,e.update({params:t})})}setVisible(e){this._onWillVisibilityChange.fire({isVisible:e})}setActive(){this._onActiveChange.fire()}updateParameters(e){this._onDidParametersChange.fire(e)}},Xo=class extends Yo{constructor(e,t){super(e,t),this._onDidConstraintsChangeInternal=new k,this.onDidConstraintsChangeInternal=this._onDidConstraintsChangeInternal.event,this._onDidConstraintsChange=new k({replay:!0}),this.onDidConstraintsChange=this._onDidConstraintsChange.event,this._onDidSizeChange=new k,this.onDidSizeChange=this._onDidSizeChange.event,this.addDisposables(this._onDidConstraintsChangeInternal,this._onDidConstraintsChange,this._onDidSizeChange)}setConstraints(e){this._onDidConstraintsChangeInternal.fire(e)}setSize(e){this._onDidSizeChange.fire(e)}},Cd=class extends Xo{set pane(e){this._pane=e}constructor(e,t){super(e,t),this._onDidExpansionChange=new k({replay:!0}),this.onDidExpansionChange=this._onDidExpansionChange.event,this._onMouseEnter=new k({}),this.onMouseEnter=this._onMouseEnter.event,this._onMouseLeave=new k({}),this.onMouseLeave=this._onMouseLeave.event,this.addDisposables(this._onDidExpansionChange,this._onMouseEnter,this._onMouseLeave)}setExpanded(e){var t;(t=this._pane)===null||t===void 0||t.setExpanded(e)}get isExpanded(){var e;return!!(!((e=this._pane)===null||e===void 0)&&e.isExpanded())}},yn=class extends C{get element(){return this._element}get width(){return this._width}get height(){return this._height}get params(){var e;return(e=this._params)===null||e===void 0?void 0:e.params}constructor(e,t,i){super(),this.id=e,this.component=t,this.api=i,this._height=0,this._width=0,this._element=document.createElement("div"),this._element.tabIndex=-1,this._element.style.outline="none",this._element.style.height="100%",this._element.style.width="100%",this._element.style.overflow="hidden";let n=Mt(this._element);this.addDisposables(this.api,n.onDidFocus(()=>{this.api._onDidChangeFocus.fire({isFocused:!0})}),n.onDidBlur(()=>{this.api._onDidChangeFocus.fire({isFocused:!1})}),n)}focus(){let e=new Uo;this.api._onWillFocus.fire(e),!e.defaultPrevented&&this._element.focus()}layout(e,t){this._width=e,this._height=t,this.api._onDidDimensionChange.fire({width:e,height:t}),this.part&&this._params&&this.part.update(this._params.params)}init(e){this._params=e,this.part=this.getComponent()}update(e){var t,i;this._params=N(N({},this._params),{},{params:N(N({},(t=this._params)===null||t===void 0?void 0:t.params),e.params)});for(let n of Object.keys(e.params))e.params[n]===void 0&&delete this._params.params[n];(i=this.part)===null||i===void 0||i.update({params:this._params.params})}toJSON(){var e,t;let i=(e=(t=this._params)===null||t===void 0?void 0:t.params)!==null&&e!==void 0?e:{};return{id:this.id,component:this.component,params:Object.keys(i).length>0?i:void 0}}dispose(){var e;this.api.dispose(),(e=this.part)===null||e===void 0||e.dispose(),super.dispose()}},Jo=class extends yn{set orientation(e){this._orientation=e}get orientation(){return this._orientation}get minimumSize(){return this.headerSize+(this.isExpanded()?this._minimumBodySize:0)}get maximumSize(){return this.headerSize+(this.isExpanded()?this._maximumBodySize:0)}get size(){return this._size}get orthogonalSize(){return this._orthogonalSize}set orthogonalSize(e){this._orthogonalSize=e}get minimumBodySize(){return this._minimumBodySize}set minimumBodySize(e){this._minimumBodySize=typeof e=="number"?e:0}get maximumBodySize(){return this._maximumBodySize}set maximumBodySize(e){this._maximumBodySize=typeof e=="number"?e:Number.POSITIVE_INFINITY}get headerVisible(){return this._headerVisible}set headerVisible(e){this._headerVisible=e,this.header.style.display=e?"":"none"}constructor(e){super(e.id,e.component,new Cd(e.id,e.component)),this._onDidChangeExpansionState=new k({replay:!0}),this.onDidChangeExpansionState=this._onDidChangeExpansionState.event,this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this._orthogonalSize=0,this._size=0,this._isExpanded=!1,this.api.pane=this,this.api.initialize(this),this.headerSize=e.headerSize,this.headerComponent=e.headerComponent,this._minimumBodySize=e.minimumBodySize,this._maximumBodySize=e.maximumBodySize,this._isExpanded=e.isExpanded,this._headerVisible=e.isHeaderVisible,this._onDidChangeExpansionState.fire(this.isExpanded()),this._orientation=e.orientation,this.element.classList.add("dv-pane"),this.addDisposables(this.api.onWillVisibilityChange(t=>{let{isVisible:i}=t,{accessor:n}=this._params;n.setVisible(this,i)}),this.api.onDidSizeChange(t=>{this._onDidChange.fire({size:t.size})}),M(this.element,"mouseenter",t=>{this.api._onMouseEnter.fire(t)}),M(this.element,"mouseleave",t=>{this.api._onMouseLeave.fire(t)})),this.addDisposables(this._onDidChangeExpansionState,this.onDidChangeExpansionState(t=>{this.api._onDidExpansionChange.fire({isExpanded:t})}),this.api.onDidFocusChange(t=>{this.header&&(t.isFocused?fe(this.header,"focused"):be(this.header,"focused"))})),this.renderOnce()}setVisible(e){this.api._onDidVisibilityChange.fire({isVisible:e})}setActive(e){this.api._onDidActiveChange.fire({isActive:e})}isExpanded(){return this._isExpanded}setExpanded(e){var t;this._isExpanded!==e&&(this._isExpanded=e,e?(this.animationTimer&&clearTimeout(this.animationTimer),this.body&&this.element.appendChild(this.body)):(this._expandedSize=this._size,this.animationTimer=setTimeout(()=>{var i;(i=this.body)===null||i===void 0||i.remove()},200)),this._onDidChange.fire(e?{size:(t=this._expandedSize)!==null&&t!==void 0?t:this.width}:{}),this._onDidChangeExpansionState.fire(e))}layout(e,t){this._size=e,this._orthogonalSize=t;let[i,n]=this.orientation==="HORIZONTAL"?[e,t]:[t,e];super.layout(i,n)}init(e){var t,i;super.init(e),typeof e.minimumBodySize=="number"&&(this.minimumBodySize=e.minimumBodySize),typeof e.maximumBodySize=="number"&&(this.maximumBodySize=e.maximumBodySize),this.bodyPart=this.getBodyComponent(),this.headerPart=this.getHeaderComponent(),this.bodyPart.init(N(N({},e),{},{api:this.api})),this.headerPart.init(N(N({},e),{},{api:this.api})),(t=this.body)===null||t===void 0||t.append(this.bodyPart.element),(i=this.header)===null||i===void 0||i.append(this.headerPart.element),typeof e.isExpanded=="boolean"&&this.setExpanded(e.isExpanded)}toJSON(){let e=this._params;return N(N({},super.toJSON()),{},{headerComponent:this.headerComponent,title:e.title})}renderOnce(){this.header=document.createElement("div"),this.header.tabIndex=0,this.header.className="dv-pane-header",this.header.style.height=`${this.headerSize}px`,this.header.style.lineHeight=`${this.headerSize}px`,this.header.style.minHeight=`${this.headerSize}px`,this.header.style.maxHeight=`${this.headerSize}px`,this.element.appendChild(this.header),this.body=document.createElement("div"),this.body.className="dv-pane-body",this.element.appendChild(this.body)}getComponent(){return{update:e=>{var t,i;(t=this.bodyPart)===null||t===void 0||t.update({params:e}),(i=this.headerPart)===null||i===void 0||i.update({params:e})},dispose:()=>{var e,t;(e=this.bodyPart)===null||e===void 0||e.dispose(),(t=this.headerPart)===null||t===void 0||t.dispose()}}}},qo=class extends Jo{constructor(e){super({id:e.id,component:e.component,headerComponent:e.headerComponent,orientation:e.orientation,isExpanded:e.isExpanded,isHeaderVisible:!0,headerSize:e.headerSize,minimumBodySize:e.minimumBodySize,maximumBodySize:e.maximumBodySize}),this._onDidDrop=new k,this.onDidDrop=this._onDidDrop.event,this._onUnhandledDragOver=new k,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this.accessor=e.accessor,this.addDisposables(this._onDidDrop,this._onUnhandledDragOver),e.disableDnd||this.initDragFeatures()}initDragFeatures(){if(!this.header)return;let e=this.id,t=this.accessor.id;this.header.draggable=!0;let i={getData:()=>(m.getInstance().setData([new p(t,e)],p.prototype),{dispose:()=>{m.getInstance().clearData(p.prototype)}})};this.html5DragSource=Je.createDragSource(this.header,i),this.pointerDragSource=Ne.createDragSource(this.header,i);let o={acceptedTargetZones:["top","bottom"],overlayModel:{activationSize:{type:"percentage",value:50}},canDisplayOverlay:(a,d)=>{let l=x();if(l&&l.paneId!==this.id&&l.viewId===this.accessor.id)return!0;let u=new Bo(a,d,x,this);return this._onUnhandledDragOver.fire(u),u.isAccepted}};this.target=Je.createDropTarget(this.element,o),this.pointerTarget=Ne.createDropTarget(this.element,o),this.addDisposables(this._onDidDrop,this.html5DragSource,this.pointerDragSource,this.target,this.pointerTarget,this.target.onDrop(a=>{this.onDrop(a)}),this.pointerTarget.onDrop(a=>{this.onDrop(a)}))}onDrop(e){let t=x();if(t?.viewId!==this.accessor.id){this._onDidDrop.fire(N(N({},e),{},{panel:this,api:new Dt(this.accessor),getData:x}));return}let i=this._params.containerApi,n=t.paneId,o=i.getPanel(n);if(!o){this._onDidDrop.fire(N(N({},e),{},{panel:this,getData:x,api:new Dt(this.accessor)}));return}let a=i.panels,d=a.indexOf(o),l=i.panels.indexOf(this);(e.position==="left"||e.position==="top")&&(l=Math.max(0,l-1)),(e.position==="right"||e.position==="bottom")&&(d>l&&l++,l=Math.min(a.length-1,l)),i.movePanel(d,l)}};let Gd=0,Pd=()=>`dv-tabpanel-${Gd++}`;var Ko=class extends C{get element(){return this._element}get dimensions(){return this._dimensions}constructor(e,t){var i,n,o,a,d,l,u;super(),this.accessor=e,this.group=t,this.disposable=new E,this._onDidFocus=new k,this.onDidFocus=this._onDidFocus.event,this._onDidBlur=new k,this.onDidBlur=this._onDidBlur.event,this._onDidDimensionsChange=new k,this.onDidDimensionsChange=this._onDidDimensionsChange.event,this._element=document.createElement("div"),this._element.className="dv-content-container",this._element.tabIndex=-1,this._element.id=Pd(),this._element.setAttribute("role","tabpanel"),this.addDisposables(this._onDidFocus,this._onDidBlur,this._onDidDimensionsChange);let v=()=>{var f;return(f=t.dropTargetContainer)===null||f===void 0?void 0:f.model},g=(f,_)=>this.group.canDisplayContentOverlay(f,_);this.dropTarget=new wn(this.element,{getOverlayOutline:()=>{var f;return((f=e.options.theme)===null||f===void 0?void 0:f.dndPanelOverlay)==="group"?this.element.parentElement:null},className:"dv-drop-target-content",acceptedTargetZones:["top","bottom","left","right","center"],canDisplayOverlay:g,getOverrideTarget:v,overlayModel:(i=(n=this.accessor).resolveDropOverlayModel)===null||i===void 0?void 0:i.call(n,"content"),getPositionResolver:()=>{var f;return(f=e.getDropPositionResolver)===null||f===void 0?void 0:f.call(e)}}),this.pointerDropTarget=Ne.createDropTarget(this.element,{acceptedTargetZones:["top","bottom","left","right","center"],canDisplayOverlay:g,getOverlayOutline:()=>{var f;return((f=e.options.theme)===null||f===void 0?void 0:f.dndPanelOverlay)==="group"?this.element.parentElement:null},className:"dv-drop-target-content",getOverrideTarget:v,overlayModel:(o=(a=this.accessor).resolveDropOverlayModel)===null||o===void 0?void 0:o.call(a,"content"),getPositionResolver:()=>{var f;return(f=e.getDropPositionResolver)===null||f===void 0?void 0:f.call(e)}}),this.addDisposables(this.dropTarget,this.pointerDropTarget,(d=(l=(u=this.accessor).onDidOptionsChange)===null||l===void 0?void 0:l.call(u,()=>{var f,_,w;let y=(f=(_=(w=this.accessor).resolveDropOverlayModel)===null||_===void 0?void 0:_.call(w,"content"))!==null&&f!==void 0?f:{};this.dropTarget.setOverlayModel(y),this.pointerDropTarget.setOverlayModel(y)}))!==null&&d!==void 0?d:S.NONE)}show(){this.element.style.display=""}hide(){this.element.style.display="none"}setLabelledBy(e){e?this._element.setAttribute("aria-labelledby",e):this._element.removeAttribute("aria-labelledby")}renderPanel(e,t){var i;let n=((i=t?.asActive)!==null&&i!==void 0?i:!0)||this.group.isPanelActive(e);if(n||this.panel===e){var o;if(((o=this.panel)===null||o===void 0?void 0:o.view.content.element.parentElement)===this._element){var a,d;this.panel.view.content.element.remove(),(a=(d=this.panel.view.content).onHide)===null||a===void 0||a.call(d)}this.panel=e}let l;switch(e.api.renderer){case"onlyWhenVisible":if(this.group.renderContainer.detatch(e),n){var u,v;this._element.appendChild(e.view.content.element),(u=(v=e.view.content).onShow)===null||u===void 0||u.call(v)}l=this._element;break;case"always":e.view.content.element.parentElement===this._element&&e.view.content.element.remove(),l=this.group.renderContainer.attach({panel:e,referenceContainer:this});break;default:throw new Error(`dockview: invalid renderer type '${e.api.renderer}'`)}if(n){let g=Mt(l);this.focusTracker=g;let f=new C;f.addDisposables(g,g.onDidFocus(()=>this._onDidFocus.fire()),g.onDidBlur(()=>this._onDidBlur.fire())),this.disposable.value=f}}openPanel(e){this.panel!==e&&this.renderPanel(e)}layout(e,t){var i;((i=this._dimensions)===null||i===void 0?void 0:i.width)===e&&this._dimensions.height===t||(this._dimensions={width:e,height:t},this._onDidDimensionsChange.fire(this._dimensions))}closePanel(){if(this.panel&&this.panel.api.renderer==="onlyWhenVisible"){var e,t;this.panel.view.content.element.remove(),(e=(t=this.panel.view.content).onHide)===null||e===void 0||e.call(t)}this.panel=void 0}dispose(){this.disposable.dispose(),super.dispose()}refreshFocusState(){var e;!((e=this.focusTracker)===null||e===void 0)&&e.refreshState&&this.focusTracker.refreshState()}};let hi=e=>{let t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttributeNS(null,"height",e.height),t.setAttributeNS(null,"width",e.width),t.setAttributeNS(null,"viewBox",e.viewbox),t.setAttributeNS(null,"aria-hidden","false"),t.setAttributeNS(null,"focusable","false"),t.classList.add("dv-svg");let i=document.createElementNS("http://www.w3.org/2000/svg","path");return i.setAttributeNS(null,"d",e.path),t.appendChild(i),t},Zo=()=>hi({width:"11",height:"11",viewbox:"0 0 28 28",path:"M2.1 27.3L0 25.2L11.55 13.65L0 2.1L2.1 0L13.65 11.55L25.2 0L27.3 2.1L15.75 13.65L27.3 25.2L25.2 27.3L13.65 15.75L2.1 27.3Z"}),xn=()=>hi({width:"11",height:"11",viewbox:"0 0 24 24",path:"M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"}),zd=()=>hi({width:"11",height:"11",viewbox:"0 0 24 15",path:"M12 14.15L0 2.15L2.15 0L12 9.9L21.85 0.0499992L24 2.2L12 14.15Z"}),jo=()=>hi({width:"11",height:"11",viewbox:"0 0 15 25",path:"M2.15 24.1L0 21.95L9.9 12.05L0 2.15L2.15 0L14.2 12.05L2.15 24.1Z"}),Td=500,Ed=8;var Dn=class extends C{constructor(e,t){super(),this.element=e,this.options=t,this._startX=0,this._startY=0,this.addDisposables(M(this.element,"pointerdown",i=>{this._onPointerDown(i)}))}_onPointerDown(e){var t,i,n,o,a;if((!((t=this.options.touchOnly)!==null&&t!==void 0)||t)&&e.pointerType!=="touch"&&e.pointerType!=="pen")return;this._cancelPending(),this._pointerId=e.pointerId,this._startX=e.clientX,this._startY=e.clientY;let d=(i=this.options.delay)!==null&&i!==void 0?i:Td,l=(n=this.options.tolerance)!==null&&n!==void 0?n:Ed,u=(o=(a=this.element.ownerDocument)===null||a===void 0?void 0:a.defaultView)!==null&&o!==void 0?o:globalThis.window;this._timer=setTimeout(()=>{this._timer=void 0,this._cancelPending(),this._installContextMenuGuard(u),this._installClickGuard(u),this.options.onLongPress(e)},d),this._moveListener=M(u,"pointermove",v=>{if(v.pointerId!==this._pointerId)return;let g=v.clientX-this._startX,f=v.clientY-this._startY;Math.hypot(g,f)>l&&this._cancelPending()}),this._upListener=M(u,"pointerup",v=>{v.pointerId===this._pointerId&&this._cancelPending()}),this._cancelListener=M(u,"pointercancel",v=>{v.pointerId===this._pointerId&&this._cancelPending()})}_installContextMenuGuard(e){let t,i=setTimeout(()=>t?.dispose(),500);t=M(e,"contextmenu",n=>{n.preventDefault(),clearTimeout(i),t?.dispose()},{capture:!0})}_installClickGuard(e){let t,i=setTimeout(()=>t?.dispose(),500);t=M(e,"click",n=>{dt(n,[this.element])&&(n.preventDefault(),n.stopPropagation()),clearTimeout(i),t?.dispose()},{capture:!0})}_cancelPending(){var e,t,i;this._timer!==void 0&&(clearTimeout(this._timer),this._timer=void 0),this._pointerId=void 0,(e=this._moveListener)===null||e===void 0||e.dispose(),(t=this._upListener)===null||t===void 0||t.dispose(),(i=this._cancelListener)===null||i===void 0||i.dispose(),this._moveListener=void 0,this._upListener=void 0,this._cancelListener=void 0}dispose(){this._cancelPending(),super.dispose()}};function Ee(e){if(e.disableDnd)return{html5:!1,pointer:!1,pointerHandlesMouse:!1};switch(e.dndStrategy){case"pointer":return{html5:!1,pointer:!0,pointerHandlesMouse:!0};case"html5":return{html5:!0,pointer:!1,pointerHandlesMouse:!1};default:return Ad()?{html5:!1,pointer:!0,pointerHandlesMouse:!0}:{html5:!0,pointer:!0,pointerHandlesMouse:!1}}}function Ad(){if(globalThis.window===void 0||!globalThis.matchMedia)return!1;let e=globalThis.matchMedia("(pointer: coarse)").matches,t=globalThis.matchMedia("(pointer: fine)").matches;return e&&!t}let Id=0,Md=()=>`dv-tab-${Id++}`;var Qo=class extends C{get element(){return this._element}constructor(e,t,i){var n,o,a,d,l,u,v,g;super(),this.panel=e,this.accessor=t,this.group=i,this.content=void 0,this.panelTransfer=m.getInstance(),this._direction="horizontal",this._pinIndicator=void 0,this._onPointDown=new k,this.onPointerDown=this._onPointDown.event,this._onTabClick=new k,this.onTabClick=this._onTabClick.event,this._onDropped=new k,this.onDrop=this._onDropped.event,this._onDragStart=new k,this.onDragStart=this._onDragStart.event,this._onDragEnd=new k,this.onDragEnd=this._onDragEnd.event;let f=Ee(this.accessor.options);this._element=document.createElement("div"),this._element.className="dv-tab",this._element.tabIndex=-1,this._element.draggable=f.html5,this._element.id=Md(),this._element.setAttribute("role","tab"),this._element.setAttribute("aria-selected","false"),this._element.setAttribute("aria-label",(n=this.panel.title)!==null&&n!==void 0?n:this.panel.id),this._element.dataset.tabPanelId=this.panel.id;let _=(o=this.group)===null||o===void 0||(o=o.model)===null||o===void 0?void 0:o.contentContainerId;_&&this._element.setAttribute("aria-controls",_),A(this.element,"dv-inactive-tab",!0),this._updatePinnedClasses();let w=(D,G)=>{if(this.group.locked)return!1;let T=b();if(this.accessor.id===T?.viewId){var z;return!(((z=this.accessor.options.theme)===null||z===void 0?void 0:z.tabAnimation)==="smooth"||T.tabGroupId&&T.groupId===this.group.id&&this.group.model.getTabGroupForPanel(this.panel.id))}return this.group.model.canDisplayOverlay(D,G,"tab")};this.dropTarget=Je.createDropTarget(this._element,{acceptedTargetZones:["left","right"],overlayModel:this._buildOverlayModel(),canDisplayOverlay:w,getOverrideTarget:()=>{var D;return(D=i.model.dropTargetContainer)===null||D===void 0?void 0:D.model}}),this.pointerDropTarget=Ne.createDropTarget(this._element,{acceptedTargetZones:["left","right"],overlayModel:this._buildOverlayModel(),canDisplayOverlay:w,getOverrideTarget:()=>{var D;return(D=i.model.dropTargetContainer)===null||D===void 0?void 0:D.model}});let y={getData:()=>(this.panelTransfer.setData([new c(this.accessor.id,this.group.id,this.panel.id)],c.prototype),{dispose:()=>{this.panelTransfer.clearData(c.prototype)}}),createGhost:()=>({element:this._buildGhostElement(),offsetX:30,offsetY:-10}),onDragStart:D=>{var G;this._onDragStart.fire(D),!(D instanceof PointerEvent)&&((G=this.accessor.options.theme)===null||G===void 0?void 0:G.tabAnimation)==="smooth"&&requestAnimationFrame(()=>{A(this.element,"dv-tab--dragging",!0)})},onDragEnd:D=>{this._onDragEnd.fire(D)}};this.html5DragSource=Je.createDragSource(this._element,N(N({},y),{},{disabled:!f.html5})),this.pointerDragSource=Ne.createDragSource(this._element,N(N({},y),{},{disabled:!f.pointer,touchOnly:!f.pointerHandlesMouse,isCancelled:()=>!Ee(this.accessor.options).pointer})),this.onWillShowOverlay=$.any(this.dropTarget.onWillShowOverlay,this.pointerDropTarget.onWillShowOverlay),this.addDisposables(this._onPointDown,this._onTabClick,this._onDropped,this._onDragStart,this._onDragEnd,this.accessor.onDidOptionsChange(()=>{let D=this._buildOverlayModel();this.dropTarget.setOverlayModel(D),this.pointerDropTarget.setOverlayModel(D),this._updatePinnedClasses()}),(a=(d=this.panel.api)===null||d===void 0||(l=d.onDidChangePinned)===null||l===void 0?void 0:l.call(d,()=>{this._updatePinnedClasses()}))!==null&&a!==void 0?a:{dispose:()=>{}},(u=(v=this.panel.api)===null||v===void 0||(g=v.onDidTitleChange)===null||g===void 0?void 0:g.call(v,D=>{var G;this._element.setAttribute("aria-label",(G=D.title)!==null&&G!==void 0?G:this.panel.id)}))!==null&&u!==void 0?u:{dispose:()=>{}},M(this._element,"dragend",()=>{A(this.element,"dv-tab--dragging",!1)}),this.html5DragSource,M(this._element,"pointerdown",D=>{this._onPointDown.fire(D)}),M(this._element,"click",D=>{this._onTabClick.fire(D)}),M(this._element,"contextmenu",D=>{var G;(G=this.accessor.contextMenuService)===null||G===void 0||G.show(this.panel,this.group,D)}),new Dn(this._element,{onLongPress:D=>{var G;this.pointerDragSource.cancelPending(),(G=this.accessor.contextMenuService)===null||G===void 0||G.show(this.panel,this.group,D)}}),this.dropTarget.onDrop(D=>{this._onDropped.fire(D)}),this.pointerDropTarget.onDrop(D=>{this._onDropped.fire(D)}),this.dropTarget,this.pointerDropTarget,this.pointerDragSource)}_updatePinnedClasses(){var e,t,i,n;let o=(e=(t=this.panel.api)===null||t===void 0?void 0:t.isPinned)!==null&&e!==void 0?e:!1,a=o&&((i=this.accessor.options.pinnedTabs)===null||i===void 0?void 0:i.compact)===!0;A(this.element,"dv-tab--pinned",o),A(this.element,"dv-tab--pinned-compact",a);let d=o&&!(!((n=this.panel.api)===null||n===void 0)&&n.tabComponent);if(d&&!this._pinIndicator){let l=document.createElement("div");l.className="dv-tab-pin",l.appendChild(xn()),this._element.insertBefore(l,this._element.firstChild),this._pinIndicator=l}else!d&&this._pinIndicator&&(this._pinIndicator.remove(),this._pinIndicator=void 0)}setActive(e){A(this.element,"dv-active-tab",e),A(this.element,"dv-inactive-tab",!e),this._element.setAttribute("aria-selected",e?"true":"false"),this._element.tabIndex=e?0:-1}setContent(e){this.content&&this.content.element.remove(),this.content=e,this._element.appendChild(this.content.element)}_buildOverlayModel(){var e,t,i;let n=(e=(t=this.accessor).resolveDropOverlayModel)===null||e===void 0?void 0:e.call(t,"tab",this.group);if(n)return n;let o=((i=this.accessor.options.theme)===null||i===void 0?void 0:i.dndTabIndicator)==="line"?Number.POSITIVE_INFINITY:0;return{activationSize:{value:50,type:"percentage"},smallWidthBoundary:o,smallHeightBoundary:o}}setDirection(e){this._direction=e;let t=e==="vertical"?["top","bottom"]:["left","right"];this.dropTarget.setTargetZones(t),this.pointerDropTarget.setTargetZones(t)}updateDragAndDropState(){let e=Ee(this.accessor.options);this._element.draggable=e.html5,this.html5DragSource.setDisabled(!e.html5),this.pointerDragSource.setDisabled(!e.pointer),this.pointerDragSource.setTouchOnly(!e.pointerHandlesMouse)}_buildGhostElement(){let e=getComputedStyle(this.element),t=this.element.cloneNode(!0),i=this._direction==="vertical",n=new Set(["writing-mode","inline-size","block-size","min-inline-size","min-block-size","max-inline-size","max-block-size","margin-inline","margin-inline-start","margin-inline-end","margin-block","margin-block-start","margin-block-end","padding-inline","padding-inline-start","padding-inline-end","padding-block","padding-block-start","padding-block-end"]);return Array.from(e).forEach(o=>{i&&n.has(o)||t.style.setProperty(o,e.getPropertyValue(o),e.getPropertyPriority(o))}),i&&(t.style.setProperty("writing-mode","horizontal-tb"),t.style.setProperty("width",e.height),t.style.setProperty("height",e.width)),t.style.position="absolute",t.classList.add("dv-tab-ghost-drag"),t}},St=class{get kind(){return this.options.kind}get nativeEvent(){return this.event.nativeEvent}get position(){return this.event.position}get edge(){return this.event.edge}get edgeGroup(){return this.event.edgeGroup}get defaultPrevented(){return this.event.defaultPrevented}get panel(){return this.options.panel}get api(){return this.options.api}get group(){return this.options.group}preventDefault(){this.event.preventDefault()}getData(){return this.options.getData()}constructor(e,t){this.event=e,this.options=t}};let Su=500;var er=class extends C{get group(){return this.groupAccessor()}constructor(e){var t,i;super(),this.panelTransfer=m.getInstance(),this._onDragStart=new k,this.onDragStart=this._onDragStart.event,this._element=e.element,this.accessor=e.accessor;let n=e.group;this.groupAccessor=typeof n=="function"?n:()=>n,this.isFloatingMoveHandle=(t=e.isFloatingMoveHandle)!==null&&t!==void 0?t:(()=>!0);let o=Ee(this.accessor.options);this._element.draggable=o.html5,A(this._element,"dv-draggable",o.html5||o.pointer),this.addDisposables(this._onDragStart);let a=()=>{let _=document.createElement("div"),w=globalThis.getComputedStyle(this._element),y=w.getPropertyValue("--dv-activegroup-visiblepanel-tab-background-color"),D=w.getPropertyValue("--dv-activegroup-visiblepanel-tab-color");return _.style.backgroundColor=y,_.style.color=D,_.style.padding="2px 8px",_.style.height="24px",_.style.fontSize="11px",_.style.lineHeight="20px",_.style.borderRadius="12px",_.style.whiteSpace="nowrap",_.style.boxSizing="border-box",_.style.display="inline-block",_.textContent=`Multiple Panels (${this.group.size})`,_},l={getData:()=>(this.panelTransfer.setData([new c(this.accessor.id,this.group.id,null)],c.prototype),{dispose:()=>{this.panelTransfer.clearData(c.prototype)}}),createGhost:()=>{var _,w;let y=(_=(w=this.accessor).buildGroupDragGhost)===null||_===void 0?void 0:_.call(w,this.group);return y||{element:a(),offsetX:30,offsetY:-10}},onDragStart:_=>{this._onDragStart.fire(_)}};this.html5DragSource=Je.createDragSource(this._element,N(N({},l),{},{disabled:!o.html5,isCancelled:_=>!!(this.group.api.location.type==="floating"&&this.isFloatingMoveHandle()&&!_.shiftKey||this.group.api.location.type==="edge"&&this.group.size===0)}));let u=()=>{var _;return((_=this.group)===null||_===void 0||(_=_.api)===null||_===void 0||(_=_.location)===null||_===void 0?void 0:_.type)==="floating"&&this.isFloatingMoveHandle()};this.pointerDragSource=Ne.createDragSource(this._element,N(N({},l),{},{disabled:!o.pointer,touchOnly:!o.pointerHandlesMouse,touchInitiationDelay:()=>u()?500:250,pressTolerance:()=>u()?1/0:8,isCancelled:()=>!Ee(this.accessor.options).pointer||this.group.api.location.type==="edge"&&this.group.size===0,onDragStart:_=>{var w;(w=this.getFloatingOverlay())===null||w===void 0||w.cancelPendingDrag(),this._onDragStart.fire(_)}}));let v=new E,g=()=>{let _=this.getFloatingOverlay();v.value=_?_.onDidStartMoving(()=>{this.pointerDragSource.cancelPending()}):S.NONE};g(),this.addDisposables(v);let f=(i=this.group)===null||i===void 0||(i=i.api)===null||i===void 0?void 0:i.onDidLocationChange;f&&this.addDisposables(f(g)),this.addDisposables(this.html5DragSource,this.pointerDragSource)}updateDragAndDropState(){let e=Ee(this.accessor.options);this._element.draggable=e.html5,A(this._element,"dv-draggable",e.html5||e.pointer),this.html5DragSource.setDisabled(!e.html5),this.pointerDragSource.setDisabled(!e.pointer),this.pointerDragSource.setTouchOnly(!e.pointerHandlesMouse)}getFloatingOverlay(){var e;if(this.group)return(e=this.accessor.floatingGroups)===null||e===void 0||(e=e.find(t=>t.group===this.group))===null||e===void 0?void 0:e.overlay}},Od=class extends C{get element(){return this._element}constructor(e,t){var i,n,o,a,d,l,u;super(),this.accessor=e,this.group=t,this._onDrop=new k,this.onDrop=this._onDrop.event,this._onDragStart=new k,this.onDragStart=this._onDragStart.event,this._element=document.createElement("div"),this._element.className="dv-void-container",this.addDisposables(this._onDrop,this._onDragStart,M(this._element,"pointerdown",()=>{this.accessor.doSetGroupActive(this.group)}),M(this._element,"pointerdown",g=>{g.shiftKey&&yt(g)},!0)),this.dragSource=new er({element:this._element,accessor:this.accessor,group:this.group,isFloatingMoveHandle:()=>!this._element.closest(".dv-resize-container-with-titlebar")});let v=(g,f)=>{if(this.group.api.locked)return!1;let _=b();return this.accessor.id===_?.viewId?!0:t.model.canDisplayOverlay(g,f,"header_space")};this.dropTarget=Je.createDropTarget(this._element,{acceptedTargetZones:["center"],canDisplayOverlay:v,getOverrideTarget:()=>{var g;return(g=t.model.dropTargetContainer)===null||g===void 0?void 0:g.model},overlayModel:(i=(n=this.accessor).resolveDropOverlayModel)===null||i===void 0?void 0:i.call(n,"header_space",this.group)}),this.pointerDropTarget=Ne.createDropTarget(this._element,{acceptedTargetZones:["center"],canDisplayOverlay:v,getOverrideTarget:()=>{var g;return(g=t.model.dropTargetContainer)===null||g===void 0?void 0:g.model},overlayModel:(o=(a=this.accessor).resolveDropOverlayModel)===null||o===void 0?void 0:o.call(a,"header_space",this.group)}),this.onWillShowOverlay=$.any(this.dropTarget.onWillShowOverlay,this.pointerDropTarget.onWillShowOverlay),this.addDisposables(this.dragSource,this.dragSource.onDragStart(g=>{this._onDragStart.fire(g)}),this.dropTarget.onDrop(g=>{this._onDrop.fire(g)}),this.pointerDropTarget.onDrop(g=>{this._onDrop.fire(g)}),this.dropTarget,this.pointerDropTarget,(d=(l=(u=this.accessor).onDidOptionsChange)===null||l===void 0?void 0:l.call(u,()=>{var g,f,_;let w=(g=(f=(_=this.accessor).resolveDropOverlayModel)===null||f===void 0?void 0:f.call(_,"header_space",this.group))!==null&&g!==void 0?g:{};this.dropTarget.setOverlayModel(w),this.pointerDropTarget.setOverlayModel(w)}))!==null&&d!==void 0?d:S.NONE)}updateDragAndDropState(){this.dragSource.updateDragAndDropState()}},tr=class $a extends C{get element(){return this._element}get orientation(){return this._orientation}set orientation(t){this._orientation!==t&&(this._scrollOffset=0,this._orientation=t,be(this._scrollbar,"dv-scrollbar-vertical","dv-scrollbar-horizontal"),t==="vertical"?fe(this._scrollbar,"dv-scrollbar-vertical"):fe(this._scrollbar,"dv-scrollbar-horizontal"))}constructor(t){super(),this.scrollableElement=t,this._scrollOffset=0,this._orientation="horizontal",this._element=document.createElement("div"),this._element.className="dv-scrollable",this._scrollbar=document.createElement("div"),this._scrollbar.className="dv-scrollbar dv-scrollbar-horizontal",this.element.appendChild(t),this.element.appendChild(this._scrollbar),this.addDisposables(M(this.element,"wheel",i=>{this._scrollOffset+=i.deltaY*$a.MouseWheelSpeed,this.scheduleStyleUpdate()}),M(this._scrollbar,"pointerdown",i=>{var n;i.preventDefault();let o=(n=this._scrollbar.ownerDocument)!==null&&n!==void 0?n:document;A(this.element,"dv-scrollable-scrolling",!0);let a=this._orientation==="horizontal"?i.clientX:i.clientY,d=this._scrollOffset,l=v=>{let g=this._orientation==="horizontal"?v.clientX-a:v.clientY-a,f=(this._orientation==="horizontal"?this.element.clientWidth:this.element.clientHeight)/(this._orientation==="horizontal"?this.scrollableElement.scrollWidth:this.scrollableElement.scrollHeight);this._scrollOffset=d+g/f,this.scheduleStyleUpdate()},u=()=>{A(this.element,"dv-scrollable-scrolling",!1),o.removeEventListener("pointermove",l),o.removeEventListener("pointerup",u),o.removeEventListener("pointercancel",u)};o.addEventListener("pointermove",l),o.addEventListener("pointerup",u),o.addEventListener("pointercancel",u)}),M(this.element,"scroll",()=>{this.scheduleStyleUpdate()}),M(this.scrollableElement,"scroll",()=>{this._scrollOffset=this._orientation==="horizontal"?this.scrollableElement.scrollLeft:this.scrollableElement.scrollTop,this.scheduleStyleUpdate()}),Ye(this.element,()=>{A(this.element,"dv-scrollable-resizing",!0),this._animationTimer&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(()=>{clearTimeout(this._animationTimer),A(this.element,"dv-scrollable-resizing",!1)},500),this.scheduleStyleUpdate()}),S.from(()=>{this._pendingStyleFrame!==void 0&&(cancelAnimationFrame(this._pendingStyleFrame),this._pendingStyleFrame=void 0)}))}scheduleStyleUpdate(){this._pendingStyleFrame===void 0&&(this._pendingStyleFrame=requestAnimationFrame(()=>{this._pendingStyleFrame=void 0,this.calculateScrollbarStyles()}))}calculateScrollbarStyles(){let t=this._orientation==="horizontal"?this.element.clientWidth:this.element.clientHeight,i=this._orientation==="horizontal"?this.scrollableElement.scrollWidth:this.scrollableElement.scrollHeight;if(i>t){let n=t*(t/i);this._orientation==="horizontal"?(this._scrollbar.style.width=`${n}px`,this._scrollbar.style.height=""):(this._scrollbar.style.height=`${n}px`,this._scrollbar.style.width=""),this._scrollOffset=de(this._scrollOffset,0,i-t),this._orientation==="horizontal"?this.scrollableElement.scrollLeft=this._scrollOffset:this.scrollableElement.scrollTop=this._scrollOffset;let o=this._scrollOffset/(i-t);this._orientation==="horizontal"?(this._scrollbar.style.left=`${(t-n)*o}px`,this._scrollbar.style.top=""):(this._scrollbar.style.top=`${(t-n)*o}px`,this._scrollbar.style.left="")}else this._orientation==="horizontal"?(this._scrollbar.style.width="0px",this._scrollbar.style.left="0px"):(this._scrollbar.style.height="0px",this._scrollbar.style.top="0px"),this._scrollOffset=0}};tr.MouseWheelSpeed=1;let Sn="dv-tabs-container--wrap",Ld="dv-tabs-container--wrap-capped",Rd="--dv-max-tab-rows",$d="--dv-wrap-vertical-tab-height";function ir(e,t){return typeof e=="boolean"?e:!!e?.[t]}function ui(e){return typeof e=="boolean"?e:e?Object.values(e).some(Boolean):!1}var kn=class extends te{constructor(e,t,i,n,o){super(),this.nativeEvent=e,this.target=t,this.position=i,this.getData=n,this.group=o}};let Nd=Object.keys({disableAutoResizing:void 0,proportionalLayout:void 0,hideBorders:void 0,singleTabMode:void 0,disableFloatingGroups:void 0,floatingGroupBounds:void 0,transformFloatingGroupDrag:void 0,smartGuides:void 0,floatingGroupDragHandle:void 0,popoutUrl:void 0,nonce:void 0,defaultRenderer:void 0,defaultHeaderPosition:void 0,debug:void 0,locked:void 0,disableDnd:void 0,dndStrategy:void 0,className:void 0,noPanelsOverlay:void 0,closeEmptyGroups:void 0,dndEdges:void 0,dropPositionResolver:void 0,dndCompass:void 0,theme:void 0,disableTabsOverflowList:void 0,overflow:void 0,scrollbars:void 0,getTabContextMenuItems:void 0,getTabGroupChipContextMenuItems:void 0,createTabGroupChipComponent:void 0,createGroupDragGhostComponent:void 0,dropOverlayModel:void 0,announcements:void 0,getAnnouncement:void 0,announcer:void 0,messages:void 0,keyboardNavigation:void 0,layoutHistory:void 0,autoHideEdgeGroups:void 0,dockToEdgeGroups:void 0,edgeGroupPeek:void 0,tabGroupColors:void 0,tabGroupAccent:void 0,pinnedTabs:void 0});function nr(e){return!!e.referencePanel}function or(e){return!!e.referenceGroup}function rr(e){return!!e.referencePanel}function sr(e){return!!e.referenceGroup}let pi=[{id:"grey",value:"var(--dv-tab-group-color-grey)",label:"Grey"},{id:"blue",value:"var(--dv-tab-group-color-blue)",label:"Blue"},{id:"red",value:"var(--dv-tab-group-color-red)",label:"Red"},{id:"yellow",value:"var(--dv-tab-group-color-yellow)",label:"Yellow"},{id:"green",value:"var(--dv-tab-group-color-green)",label:"Green"},{id:"pink",value:"var(--dv-tab-group-color-pink)",label:"Pink"},{id:"purple",value:"var(--dv-tab-group-color-purple)",label:"Purple"},{id:"cyan",value:"var(--dv-tab-group-color-cyan)",label:"Cyan"},{id:"orange",value:"var(--dv-tab-group-color-orange)",label:"Orange"}];var Cn=class{constructor(e,t=!0){this._entries=e.slice(),this._byId=new Map(e.map(i=>[i.id,i])),this._enabled=t}get enabled(){return this._enabled}set enabled(e){this._enabled=e}setEntries(e){this._entries=e.slice(),this._byId=new Map(e.map(t=>[t.id,t]))}entries(){return this._entries}has(e){return this._byId.has(e)}get(e){return this._byId.get(e)}defaultId(){var e;return(e=this._entries[0])===null||e===void 0?void 0:e.id}resolveValue(e){if(!this._enabled||!e)return;let t=this._byId.get(e);return t?t.value:e}};let Gn;function ar(){var e;return(e=Gn)!==null&&e!==void 0||(Gn=new Cn(pi,!0)),Gn}function vi(e,t,i){let n=(i??ar()).resolveValue(t);n===void 0?e.style.removeProperty("--dv-tab-group-color"):e.style.setProperty("--dv-tab-group-color",n)}function gi(e,t){return(t??ar()).resolveValue(e)}var dr=class extends C{get element(){return this._element}constructor(e){super(),this._palette=e,this._onClick=new k,this.onClick=this._onClick.event,this._onContextMenu=new k,this.onContextMenu=this._onContextMenu.event,this._element=document.createElement("div"),this._element.className="dv-tab-group-chip",this._element.tabIndex=0,this._label=document.createElement("span"),this._label.className="dv-tab-group-chip-label",this._element.appendChild(this._label),this.addDisposables(this._onClick,this._onContextMenu,new Dn(this._element,{onLongPress:t=>{this._onContextMenu.fire(t)}}),M(this._element,"click",t=>{this._onClick.fire(t)}),M(this._element,"contextmenu",t=>{this._onContextMenu.fire(t)}))}init(e){this._tabGroup=e.tabGroup,this.updateColor(e.tabGroup.color),this.updateLabel(e.tabGroup.label),this.updateCollapsed(e.tabGroup.collapsed),this.addDisposables(e.tabGroup.onDidChange(()=>{this._tabGroup&&(this.updateColor(this._tabGroup.color),this.updateLabel(this._tabGroup.label))}),e.tabGroup.onDidCollapseChange(t=>{this.updateCollapsed(t)}),this._onClick.event(()=>{var t;(t=this._tabGroup)===null||t===void 0||t.toggle()}))}update(e){this._tabGroup=e.tabGroup,this.updateColor(e.tabGroup.color),this.updateLabel(e.tabGroup.label),this.updateCollapsed(e.tabGroup.collapsed)}updateColor(e){var t;vi(this._element,e,this._palette),A(this._element,"dv-tab-group-chip--accent-off",((t=this._palette)===null||t===void 0?void 0:t.enabled)===!1)}updateLabel(e){this._label.textContent=e,A(this._label,"dv-tab-group-chip-label--empty",!e)}updateCollapsed(e){A(this._element,"dv-tab-group-chip--collapsed",e)}};let Vd="dv-tab-group-chip-continuation",lr=8;var cr=class{get underlines(){return this._underlines}constructor(e){this._ctx=e,this._underlines=new Map,this._continuationMarkers=new Map,this._rafId=null}positionUnderlines(){requestAnimationFrame(()=>{this._positionUnderlinesSync()})}trackUnderlines(){this._rafId!==null&&cancelAnimationFrame(this._rafId);let e=performance.now(),t=250,i=()=>{this._positionUnderlinesSync(),performance.now()-e<t?this._rafId=requestAnimationFrame(i):this._rafId=null};this._rafId=requestAnimationFrame(i)}syncUnderlineElements(e){for(let t of e)if(!this._underlines.has(t)){let i=document.createElement("div");i.className="dv-tab-group-underline",this._ctx.tabsList.appendChild(i),this._underlines.set(t,i)}for(let[t,i]of this._underlines)e.has(t)||(i.remove(),this._underlines.delete(t),this._clearContinuationMarkers(t))}getUnderline(e){return this._underlines.get(e)}dispose(){this._rafId!==null&&(cancelAnimationFrame(this._rafId),this._rafId=null);for(let[,e]of this._underlines)e.remove();this._underlines.clear(),this._clearContinuationMarkers()}_syncContinuationMarkers(e,t){let i=this._continuationMarkers.get(e);for(i||(i=[],this._continuationMarkers.set(e,i));i.length<t;){let n=document.createElement("div");n.className=Vd,this._ctx.tabsList.appendChild(n),i.push(n)}for(;i.length>t;){let n=i.pop();n?.remove()}return i}_clearContinuationMarkers(e){if(e===void 0){for(let[,i]of this._continuationMarkers)for(let n of i)n.remove();this._continuationMarkers.clear();return}let t=this._continuationMarkers.get(e);if(t){for(let i of t)i.remove();this._continuationMarkers.delete(e)}}_positionUnderlinesSync(){let e=this._ctx.tabsList.getBoundingClientRect(),t=this._ctx.getTabGroups(),i=this._ctx.getDirection()==="vertical",n=this._ctx.tabsList.classList.contains(Sn);n||this._clearContinuationMarkers();let o=i?e.width:e.height,a=this._ctx.getActivePanelId(),d=this._ctx.getTabMap();for(let l of t){let u=this._underlines.get(l.id);if(!u)continue;let v=l.panelIds;if(v.length===0){u.style.display="none";continue}if(u.style.display="",n){this._positionWrappedUnderline(u,l,e,d,i);continue}let g=this._ctx.getChipElement(l.id),f;if(g){let T=g.getBoundingClientRect(),z=getComputedStyle(g),P=i?Number.parseFloat(z.marginTop)||0:Number.parseFloat(z.marginLeft)||0;f=i?T.top-e.top-P:T.left-e.left-P}else{let T=v[0],z=d.get(T);if(z){let P=z.value.element.getBoundingClientRect();f=i?P.top-e.top:P.left-e.left}else f=0}let _=v[v.length-1],w=d.get(_);if(!w){i?(u.style.top=`${f}px`,u.style.height="0px",u.style.left="",u.style.width=""):(u.style.left=`${f}px`,u.style.width="0px",u.style.top="",u.style.height="");continue}let y=w.value.element.getBoundingClientRect(),D=i?y.bottom-e.top:y.right-e.left,G=D-f;if((l.collapsed||l.panelIds.some(T=>{let z=d.get(T);return z?.value.element.classList.contains("dv-tab--group-expanding")}))&&g){let T=g.getBoundingClientRect(),z=i?T.top+T.height/2-e.top:T.left+T.width/2-e.left,P=0,I=0;for(let H of l.panelIds){let O=d.get(H);if(!O)continue;let L=O.value.element;i?(P+=L.getBoundingClientRect().height,I+=L.scrollHeight):(P+=L.getBoundingClientRect().width,I+=L.scrollWidth)}let W=I>0?Math.min(1,P/I):0;f=z+(f-z)*W,D=z+(D-z)*W,G=Math.max(0,D-f)}i?(u.style.top=`${f}px`,u.style.height=`${Math.max(0,G)}px`,u.style.left="",u.style.width="",u.style.bottom=""):(u.style.left=`${f}px`,u.style.width=`${Math.max(0,G)}px`,u.style.top="",u.style.height="",u.style.bottom=""),this.applyShape(u,l,f,G,o,a,e,i)}}_positionWrappedUnderline(e,t,i,n,o){let d=gi(t.color,this._ctx.getColorPalette());if(d===void 0){e.style.display="none",this._clearContinuationMarkers(t.id);return}let{runs:l,firstRun:u}=this._computeWrappedRuns(t,i,n,o);if(l.length===0){e.style.display="none",this._clearContinuationMarkers(t.id);return}this._positionContinuationMarkers(t.id,l,u,d,o);let v=Math.min(...l.map(P=>P.left)),g=Math.max(...l.map(P=>P.right)),f=Math.min(...l.map(P=>P.top)),_=Math.max(...l.map(P=>P.bottom)),w=o?Math.max(0,g-v):i.width,y=o?i.height:Math.max(0,_-f);e.style.left=o?`${v}px`:"0px",e.style.top=o?"0px":`${f}px`,e.style.bottom="auto",e.style.width=`${w}px`,e.style.height=`${y}px`,e.style.backgroundColor="";let{svg:D,path:G}=this.ensureSvgPath(e);D.setAttribute("width",String(w)),D.setAttribute("height",String(y)),G.setAttribute("stroke",d),G.setAttribute("stroke-width",String(2));let T=this._ctx.getHeaderPosition(),z=o?T==="right":T==="bottom";G.setAttribute("d",this._wrappedPathData(l,o,z,v,f,2))}_computeWrappedRuns(e,t,i,n){let o=[],a;for(let l of e.panelIds){var d;let u=i.get(l);if(!u)continue;let v=u.value.element.getBoundingClientRect();if(v.width===0&&v.height===0)continue;let g=v.top-t.top,f=v.bottom-t.top,_=v.left-t.left,w=v.right-t.left,y=n?_:g,D=o.find(G=>Math.abs((n?G.left:G.top)-y)<=2);D?(D.top=Math.min(D.top,g),D.bottom=Math.max(D.bottom,f),D.left=Math.min(D.left,_),D.right=Math.max(D.right,w)):(D={top:g,bottom:f,left:_,right:w},o.push(D)),(d=a)!==null&&d!==void 0||(a=D)}return{runs:o,firstRun:a}}_wrappedPathData(e,t,i,n,o,a){let d="";for(let l of e)if(t){let u=i?l.right-n-a/2:l.left-n+a/2;d+=`M ${u},${l.top} L ${u},${l.bottom} `}else{let u=i?l.top-o+a/2:l.bottom-o-a/2;d+=`M ${l.left},${u} L ${l.right},${u} `}return d.trim()}_positionContinuationMarkers(e,t,i,n,o){let a=t.filter(l=>l!==i),d=this._syncContinuationMarkers(e,a.length);a.forEach((l,u)=>{let v=d[u];if(v.style.backgroundColor=n,o){let g=(l.left+l.right)/2;v.style.left=`${g-lr/2}px`,v.style.top=`${l.top}px`}else{let g=(l.top+l.bottom)/2;v.style.left=`${l.left}px`,v.style.top=`${g-lr/2}px`}})}ensureSvgPath(e){let t=e.firstElementChild;if(t?.tagName==="svg")return{svg:t,path:t.firstElementChild};e.replaceChildren();let i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.style.display="block";let n=document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttribute("fill","none"),i.appendChild(n),e.appendChild(i),{svg:i,path:n}}},Wd=class extends cr{_applyStraightLine(e,t,i,n,o,a,d){let l=d?o:n,u=d?n:o;e.setAttribute("width",String(l)),e.setAttribute("height",String(u)),i.style.width=`${l}px`,i.style.height=`${u}px`,t.setAttribute("d",d?`M ${a},0 L ${a},${n}`:`M 0,${a} L ${n},${a}`)}applyShape(e,t,i,n,o,a,d,l){let v=o,g=n,f=gi(t.color,this._ctx.getColorPalette());if(g<=0||v<=0||f===void 0){e.style.display="none";return}e.style.display="";let _;a&&t.panelIds.includes(a)&&(_=this._ctx.getTabMap().get(a));let{svg:w,path:y}=this.ensureSvgPath(e);y.setAttribute("stroke",f),y.setAttribute("stroke-width",String(2));let D=2,G=this._ctx.getHeaderPosition(),T=!l&&G==="bottom",z=l&&G==="right",P,I;if(l?(P=z?v-D:D,I=z?D:v-D):(P=T?D:v-D,I=T?v-D:D),!_){this._applyStraightLine(w,y,e,g,v,P,l);return}let W=_.value.element.getBoundingClientRect(),H,O;if(l?(H=Math.max(0,W.top-d.top-i),O=Math.min(g,W.bottom-d.top-i)):(H=Math.max(0,W.left-d.left-i),O=Math.min(g,W.right-d.left-i)),O<=H){this._applyStraightLine(w,y,e,g,v,P,l);return}let L=6,X=I>P?1:-1;if(l){let V=v,F=g;w.setAttribute("width",String(V)),w.setAttribute("height",String(F)),e.style.width=`${V}px`,e.style.height=`${F}px`;let ie=[`M ${P},0`,`L ${P},${H-L}`,`Q ${P},${H} ${P+X*L},${H}`,`L ${I-X*L},${H}`,`Q ${I},${H} ${I},${H+L}`,`L ${I},${O-L}`,`Q ${I},${O} ${I-X*L},${O}`,`L ${P+X*L},${O}`,`Q ${P},${O} ${P},${O+L}`,`L ${P},${F}`].join(" ");y.setAttribute("d",ie)}else{let V=g,F=v;w.setAttribute("width",String(V)),w.setAttribute("height",String(F)),e.style.width=`${V}px`,e.style.height=`${F}px`;let ie=[`M 0,${P}`,`L ${H-L},${P}`,`Q ${H},${P} ${H},${P+X*L}`,`L ${H},${I-X*L}`,`Q ${H},${I} ${H+L},${I}`,`L ${O-L},${I}`,`Q ${O},${I} ${O},${I-X*L}`,`L ${O},${P+X*L}`,`Q ${O},${P} ${O+L},${P}`,`L ${V},${P}`].join(" ");y.setAttribute("d",ie)}}},Hd=class extends cr{applyShape(e,t,i,n,o,a,d,l){let v=gi(t.color,this._ctx.getColorPalette());if(n<=0||v===void 0){e.style.display="none";return}e.style.display="",e.firstElementChild&&e.replaceChildren(),e.style.backgroundColor=v,l?(e.style.width="2px",e.style.height=`${n}px`):(e.style.width=`${n}px`,e.style.height="2px")}};let Fd=new Map;var Bd=class{get chipRenderers(){return this._chipRenderers}get groupUnderlines(){var e,t;return(e=(t=this._indicator)===null||t===void 0?void 0:t.underlines)!==null&&e!==void 0?e:Fd}get skipNextCollapseAnimation(){return this._skipNextCollapseAnimation}set skipNextCollapseAnimation(e){this._skipNextCollapseAnimation=e}constructor(e,t){this._ctx=e,this._callbacks=t,this._chipRenderers=new Map,this._indicator=null,this._skipNextCollapseAnimation=!1,this._pendingTransitionCleanups=new Map}update(){let e=this._ctx.group.model.getTabGroups(),t=new Set;for(let n of e)t.add(n.id),this._ensureChipForGroup(n),this._positionChipForGroup(n);for(let[n,o]of this._chipRenderers)if(!t.has(n)){var i;o.chip.element.remove(),o.chip.dispose(),(i=o.dragSourcesDisposable)===null||i===void 0||i.dispose(),o.disposable.dispose(),this._chipRenderers.delete(n)}this._updateTabGroupClasses()}refreshAccents(){for(let i of this._ctx.group.model.getTabGroups()){var e,t;let n=this._chipRenderers.get(i.id);n==null||(t=(e=n.chip).update)===null||t===void 0||t.call(e,{tabGroup:i})}this._updateTabGroupClasses()}positionAllChips(){if(this._chipRenderers.size!==0)for(let e of this._ctx.group.model.getTabGroups())this._positionChipForGroup(e)}updateDirection(){let e=this._ctx.getDirection()==="vertical";for(let[,t]of this._chipRenderers){let i=e?["top"]:["left"];t.dropTarget.setTargetZones(i),t.pointerDropTarget.setTargetZones(i)}}clearChipDropOverlays(){for(let[,i]of this._chipRenderers){var e,t;(e=i.dropTarget)===null||e===void 0||e.clearOverlay(),(t=i.pointerDropTarget)===null||t===void 0||t.clearOverlay()}}snapshotChipSizes(){let e=this._ctx.getDirection()==="vertical",t=new Map;for(let[i,n]of this._chipRenderers){let o=n.chip.element.getBoundingClientRect();t.set(i,e?o.height:o.width)}return t}positionUnderlines(){var e;(e=this._indicator)===null||e===void 0||e.positionUnderlines()}trackUnderlines(){var e;(e=this._indicator)===null||e===void 0||e.trackUnderlines()}setGroupDragImage(e,t,i){if(!e.dataTransfer)return;let n=this._ctx.getDirection()==="vertical",o=this._ctx.tabsList.cloneNode(!0);n?(o.classList.remove("dv-tabs-container-vertical","dv-vertical"),o.classList.add("dv-horizontal"),o.style.writingMode="horizontal-tb",o.style.height=`${this._ctx.tabsList.offsetWidth}px`):o.style.height=`${this._ctx.tabsList.offsetHeight}px`,o.style.width="auto",o.style.overflow="visible",o.style.pointerEvents="none";let a=Array.from(o.children),d=Array.from(this._ctx.tabsList.children);for(let w=a.length-1;w>=0;w--)d[w]!==i&&a[w].remove();let l=document.createElement("div");l.className="dv-groupview dv-active-group",l.style.position="fixed",l.style.top="-10000px",l.style.left="0px",l.style.height="auto",l.style.width="auto",l.style.pointerEvents="none";let u=document.createElement("div");u.className="dv-tabs-and-actions-container",u.style.height="auto",u.style.width="auto",l.appendChild(u),u.appendChild(o),this._ctx.accessor.element.appendChild(l);let v=o.querySelector(".dv-tab-group-chip"),g=i.getBoundingClientRect(),f=e.clientX-g.left,_=e.clientY-g.top;if(v){let w=v.getBoundingClientRect(),y=l.getBoundingClientRect(),D=w.left-y.left+f,G=w.top-y.top+_;e.dataTransfer.setDragImage(l,D,G)}else e.dataTransfer.setDragImage(l,f,_);requestAnimationFrame(()=>{l.remove()})}cleanupTransition(e){var t;(t=this._pendingTransitionCleanups.get(e))===null||t===void 0||t(),this._pendingTransitionCleanups.delete(e)}updateDragAndDropState(){let e=Ee(this._ctx.accessor.options);for(let o of this._chipRenderers.values()){var t,i,n;o.chip.element.draggable=e.html5,(t=o.html5DragSource)===null||t===void 0||t.setDisabled(!e.html5),(i=o.pointerDragSource)===null||i===void 0||i.setDisabled(!e.pointer),(n=o.pointerDragSource)===null||n===void 0||n.setTouchOnly(!e.pointerHandlesMouse)}}disposeChipDrag(e){var t;let i=this._chipRenderers.get(e);i&&((t=i.dragSourcesDisposable)===null||t===void 0||t.dispose(),i.html5DragSource=void 0,i.pointerDragSource=void 0,i.dragSourcesDisposable=void 0)}_buildChipGhostElement(e){let t=getComputedStyle(e),i=e.cloneNode(!0);return Array.from(t).forEach(n=>{i.style.setProperty(n,t.getPropertyValue(n),t.getPropertyPriority(n))}),i.style.position="absolute",i}disposeAll(){var e;(e=this._indicator)===null||e===void 0||e.dispose(),this._indicator=null;for(let[,i]of this._pendingTransitionCleanups)i();this._pendingTransitionCleanups.clear();for(let[,i]of this._chipRenderers){var t;i.chip.element.remove(),i.chip.dispose(),(t=i.dragSourcesDisposable)===null||t===void 0||t.dispose(),i.disposable.dispose()}this._chipRenderers.clear()}_ensureIndicator(){var e,t,i;let n=((e=(t=this._ctx.accessor.options.theme)===null||t===void 0?void 0:t.tabGroupIndicator)!==null&&e!==void 0?e:"wrap")==="none"?Hd:Wd;this._indicator&&!(this._indicator instanceof n)&&(this._indicator.dispose(),this._indicator=null),(i=this._indicator)!==null&&i!==void 0||(this._indicator=new n({tabsList:this._ctx.tabsList,getTabGroups:()=>this._ctx.group.model.getTabGroups(),getActivePanelId:()=>{var o;return(o=this._ctx.group.activePanel)===null||o===void 0?void 0:o.id},getTabMap:()=>this._ctx.getTabMap(),getChipElement:o=>{var a;return(a=this._chipRenderers.get(o))===null||a===void 0?void 0:a.chip.element},getDirection:()=>this._ctx.getDirection(),getHeaderPosition:()=>this._ctx.group.model.headerPosition,getColorPalette:()=>this._ctx.accessor.tabGroupColorPalette}))}_createChipDragSources(e,t){let i=Ee(this._ctx.accessor.options);e.element.draggable=i.html5;let n=m.getInstance(),o=()=>(n.setData([new c(this._ctx.accessor.id,this._ctx.group.id,null,t.id)],c.prototype),{dispose:()=>{n.clearData(c.prototype)}}),a=Je.createDragSource(e.element,{getData:o,disabled:!i.html5,isCancelled:()=>!Ee(this._ctx.accessor.options).html5,onDragStart:u=>{"dataTransfer"in u&&u.dataTransfer&&this.setGroupDragImage(u,t,e.element),this._callbacks.onChipDragStart(t,e,u)},onDragEnd:u=>{var v,g;(v=(g=this._callbacks).onChipDragEnd)===null||v===void 0||v.call(g,t,e,u)}}),d=()=>{n.clearData(c.prototype)};e.element.addEventListener("dragend",d,{once:!0});let l=Ne.createDragSource(e.element,{getData:o,disabled:!i.pointer,touchOnly:!i.pointerHandlesMouse,isCancelled:()=>!Ee(this._ctx.accessor.options).pointer,createGhost:()=>({element:this._buildChipGhostElement(e.element),offsetX:8,offsetY:8}),onDragStart:u=>{this._callbacks.onChipDragStart(t,e,u)}});return{html5DragSource:a,pointerDragSource:l,disposable:{dispose:()=>{a.dispose(),l.dispose(),e.element.removeEventListener("dragend",d)}}}}_ensureChipForGroup(e){let t=this._chipRenderers.get(e.id);if(t){if(!t.html5DragSource){let _=this._createChipDragSources(t.chip,e);t.html5DragSource=_.html5DragSource,t.pointerDragSource=_.pointerDragSource,t.dragSourcesDisposable=_.disposable}return}let i=this._ctx.accessor.options.createTabGroupChipComponent,n=i?i(e):new dr(this._ctx.accessor.tabGroupColorPalette);n.init({tabGroup:e,api:this._ctx.accessor.api});let o=this._createChipDragSources(n,e),a=[e.onDidChange(()=>{var _;(_=n.update)===null||_===void 0||_.call(n,{tabGroup:e}),this._updateTabGroupClasses()}),e.onDidPanelChange(()=>{this._positionChipForGroup(e),this._updateTabGroupClasses()}),e.onDidCollapseChange(()=>{this._updateTabGroupClasses()})],d=_=>{var w;(w=this._chipRenderers.get(e.id))===null||w===void 0||(w=w.pointerDragSource)===null||w===void 0||w.cancelPending(),this._callbacks.onChipContextMenu(e,_)};n instanceof dr?a.push(n.onContextMenu(d)):a.push(new Dn(n.element,{onLongPress:d}),M(n.element,"contextmenu",d));let l={acceptedTargetZones:this._ctx.getDirection()==="vertical"?["top"]:["left"],overlayModel:{activationSize:{value:100,type:"percentage"}},canDisplayOverlay:(_,w)=>{if(this._ctx.group.locked||this._ctx.accessor.options.disableDnd)return!1;let y=b();if(this._ctx.accessor.id===y?.viewId){var D;return!(((D=this._ctx.accessor.options.theme)===null||D===void 0?void 0:D.tabAnimation)==="smooth"&&!y.tabGroupId)}return this._ctx.group.model.canDisplayOverlay(_,w,"tab")}},u=Je.createDropTarget(n.element,l),v=Ne.createDropTarget(n.element,l),g=_=>{this._callbacks.onChipDrop(e,_)};a.push(u,u.onDrop(g),v,v.onDrop(g));let f=new C(...a);this._chipRenderers.set(e.id,{chip:n,html5DragSource:o.html5DragSource,pointerDragSource:o.pointerDragSource,dragSourcesDisposable:o.disposable,disposable:f,dropTarget:u,pointerDropTarget:v}),e.collapsed&&(this._skipNextCollapseAnimation=!0)}_positionChipForGroup(e){let t=this._chipRenderers.get(e.id);if(!t)return;let i=t.chip.element,n=e.panelIds;if(n.length===0){i.remove();return}let o=n[0],a=this._ctx.getTabMap().get(o);if(!a){i.remove();return}let d=a.value.element;i.nextSibling!==d&&this._ctx.tabsList.insertBefore(i,d)}_updateTabGroupClasses(){let e=this._ctx.group.model.getTabGroups(),t=this._ctx.getTabs(),i=this._ctx.getTabMap(),n=!1,o=new Map;for(let l of e)for(let u of l.panelIds)o.set(u,l);for(let l of t){let u=l.value,v=u.panel.id,g=o.get(v),f=!!g;if(A(u.element,"dv-tab--grouped",f),g){let _=g.panelIds,w=_[0]===v,y=_[_.length-1]===v;A(u.element,"dv-tab--group-first",w),A(u.element,"dv-tab--group-last",y),vi(u.element,g.color,this._ctx.accessor.tabGroupColorPalette);let D=u.element.classList.contains("dv-tab--group-collapsed");if(!g.collapsed&&D){var a;n=!0,u.element.classList.remove("dv-tab--group-collapsed"),u.element.classList.add("dv-tab--group-expanding"),(a=this._pendingTransitionCleanups.get(v))===null||a===void 0||a();let G=()=>{u.element.classList.remove("dv-tab--group-expanding"),u.element.style.removeProperty("width"),u.element.removeEventListener("transitionend",G),clearTimeout(T),this._pendingTransitionCleanups.delete(v)},T=setTimeout(G,300);this._pendingTransitionCleanups.set(v,G),u.element.addEventListener("transitionend",G)}}else A(u.element,"dv-tab--group-first",!1),A(u.element,"dv-tab--group-last",!1),u.element.classList.remove("dv-tab--group-collapsed","dv-tab--group-expanding"),u.element.style.removeProperty("width"),u.element.style.removeProperty("--dv-tab-group-color")}let d=new Set;for(let l of e)if(d.add(l.id),l.collapsed&&l.panelIds.some(u=>{let v=i.get(u);return v&&!v.value.element.classList.contains("dv-tab--group-collapsed")}))if(this._skipNextCollapseAnimation){let u=[];for(let v of l.panelIds){let g=i.get(v);g&&(g.value.element.style.transition="none",g.value.element.classList.add("dv-tab--group-collapsed"),u.push(g.value.element))}if(u.length>0){u[0].offsetHeight;for(let v of u)v.style.removeProperty("transition")}}else{n=!0;let u=this._ctx.getDirection()==="vertical";for(let v of l.panelIds){let g=i.get(v);if(g&&!g.value.element.classList.contains("dv-tab--group-collapsed")){let f=g.value.element.getBoundingClientRect();u?g.value.element.style.height=`${f.height}px`:g.value.element.style.width=`${f.width}px`,g.value.element.offsetHeight,g.value.element.classList.add("dv-tab--group-collapsed")}}}this._skipNextCollapseAnimation=!1,this._ensureIndicator(),this._indicator&&(this._indicator.syncUnderlineElements(d),n?this._indicator.trackUnderlines():this._indicator.positionUnderlines())}};function Wt(e,t){return t==="vertical"?e.height:e.width}function mi(e,t){return t==="vertical"?e.top:e.left}function hr(e,t){return t==="vertical"?e.clientY:e.clientX}var Ud=class extends C{get _tabs(){return this.host.tabItems}get _tabMap(){return this.host.tabMap}get _tabsList(){return this.host.tabsList}get _direction(){return this.host.direction}get group(){return this.host.groupPanel}get accessor(){return this.host.component}get _tabGroupManager(){return this.host.tabGroupManager}get _wrapMode(){return this._tabsList.classList.contains(Sn)}get animState(){return this._animState}set animState(e){this._animState=e}get pendingCollapse(){return this._pendingCollapse}set pendingCollapse(e){this._pendingCollapse=e}set voidContainerElement(e){this._voidContainer=e}constructor(e){super(),this.host=e,this._animState=null,this._pendingMarginCleanups=new Map,this._pendingCollapse=!1,this._flipTransitionCleanup=null,this._voidContainer=null,this._extendedDropZone=null,this._pointerInsideTabsList=!1,this._wrapIndicatorEl=null,this.addDisposables({dispose:()=>{var t;(t=this._flipTransitionCleanup)===null||t===void 0||t.call(this)}})}setExtendedDropZone(e){this._extendedDropZone=e}setExternalInsertionIndex(e){this._animState&&e!==this._animState.currentInsertionIndex&&(this._animState.currentInsertionIndex=e,this.applyDragOverTransforms())}clearExternalAnimState(){this._animState&&(this.resetTabTransforms(),this._animState.sourceIndex===-1?this._animState=null:this._animState.currentInsertionIndex=null)}snapshotTabPositions(){let e=new Map;for(let t of this._tabs)e.set(t.value.panel.id,t.value.element.getBoundingClientRect());return e}_mainAxisSize(e){return Wt(e,this._direction)}_mainAxisStart(e){return mi(e,this._direction)}_mainAxisCoord(e,t){return hr({clientX:e,clientY:t},this._direction)}get _gapMarginProperty(){return this._direction==="vertical"?"margin-top":"margin-left"}getAverageTabSize(){if(this._tabs.length===0)return 0;let e=0;for(let t of this._tabs)e+=this._mainAxisSize(t.value.element.getBoundingClientRect());return e/this._tabs.length}handlePointerDragMove(e,t){let i=re(this._tabsList).elementFromPoint(e,t);if(!(i&&(this._tabsList.contains(i)||this._extendedDropZone&&this._extendedDropZone.contains(i)))){this._pointerInsideTabsList&&(this._pointerInsideTabsList=!1,this.processDragLeave(i));return}this._pointerInsideTabsList=!0,this.processDragOver(e,t)}handlePointerDragEnd(e){if(e&&this._animState&&this._animState.sourceIndex!==-1&&this._animState.currentInsertionIndex!==null&&this.isPointInsideTabsList(e.clientX,e.clientY)){let t=this._animState.sourceTabGroupId;if(t){let i=this._animState.currentInsertionIndex;this._animState=null,this.commitGroupMove(t,i)}else this.commitPointerReorder(e.pointerEvent)}this._pointerInsideTabsList=!1,this.resetDragAnimation()}isPointInsideTabsList(e,t){let i=re(this._tabsList).elementFromPoint(e,t);return!!i&&this._tabsList.contains(i)}commitPointerReorder(e){let t=this._animState;if(t?.currentInsertionIndex==null)return;let i=t.currentInsertionIndex,n=t.sourceIndex,o=i-(n!==-1&&n<i?1:0);this._animState=null,this.clearWrapDropIndicator(),this.uncollapseSourceTab(t.sourceTabId),o!==n&&this.host.fireDrop({event:e,index:o,targetTabGroupId:null})}processDragOver(e,t){if(this.accessor.options.disableDnd||(this._dropStaleAnimState(),!this._animState&&!this._initAnimStateForExternalDrag()))return!1;if(this._animState.sourceIndex!==-1){var i;(i=this.group.model.dropTargetContainer)===null||i===void 0||(i=i.model)===null||i===void 0||i.clear()}return this.handleDragOver({clientX:e,clientY:t}),!0}_dropStaleAnimState(){if(!this._animState)return;let e=b();e?.tabGroupId&&e.groupId!==this.group.id&&this._animState.sourceTabGroupId!==e.tabGroupId&&(this._animState=null)}_initAnimStateForExternalDrag(){var e;let t=b();if(((e=this.accessor.options.theme)===null||e===void 0?void 0:e.tabAnimation)==="default"&&!t?.tabGroupId||!t||!(t.panelId||t.tabGroupId)||t.groupId===this.group.id)return!1;let i=this.getAverageTabSize();return this._animState=t.tabGroupId?this._makeGroupDragAnimState(t,i):this._makeTabDragAnimState(t,i),!0}_makeGroupDragAnimState(e,t){var i;let n=this.accessor.getPanel(e.groupId),o=n?.model.getTabGroups().find(d=>d.id===e.tabGroupId),a=t*((i=o?.panelIds.length)!==null&&i!==void 0?i:1)+t;return{sourceTabId:"",sourceIndex:-1,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:e.tabGroupId,sourceGroupPanelIds:o?new Set(o.panelIds):new Set,sourceChipSize:t,cursorOffsetFromDragStart:a/2,sourceGapSize:a,containerStart:this._mainAxisStart(this._tabsList.getBoundingClientRect())}}_makeTabDragAnimState(e,t){return{sourceTabId:e.panelId,sourceIndex:-1,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:null,sourceGroupPanelIds:null,sourceChipSize:0,cursorOffsetFromDragStart:t/2,sourceGapSize:t,containerStart:this._mainAxisStart(this._tabsList.getBoundingClientRect())}}processDragLeave(e){var t;if(this._animState&&!(e&&this._tabsList.contains(e))){if(e&&(!((t=this._extendedDropZone)===null||t===void 0)&&t.contains(e))){this.resetTabTransforms(),this._animState.currentInsertionIndex=null;return}this._voidContainer&&e&&(e===this._voidContainer||this._voidContainer.contains(e))||(this.resetTabTransforms(),this._animState.sourceIndex===-1?(this.clearHeaderAnchorOverlay(),this._animState=null):this._animState.currentInsertionIndex=null)}}clearHeaderAnchorOverlay(){var e;let t=this.group.model.dropTargetContainer,i=t?.renderedOutline;i&&![this._tabsList,this._voidContainer,this._extendedDropZone].some(n=>n?.contains(i))||t==null||(e=t.model)===null||e===void 0||e.clear()}handleDragOver(e){var t,i;if(!this._animState)return;if(this._wrapMode&&!this._animState.sourceTabGroupId){var n;this.handleWrappedDragOver(e.clientX,(n=e.clientY)!==null&&n!==void 0?n:0);return}let o=this._mainAxisCoord(e.clientX,(t=e.clientY)!==null&&t!==void 0?t:0),a=this._buildFirstPanelToGroupMap(),d=this._computeDragOverInsertionIndex(o,a),l=null;if(d!==null&&this._tabGroupManager.chipRenderers.size>0){let u=this._resolveInsertionAgainstTabGroups(o,d,a);d=u.insertionIndex,l=u.targetTabGroupId}d===this._animState.currentInsertionIndex&&l===this._animState.targetTabGroupId||(this._animState.currentInsertionIndex=d,this._animState.targetTabGroupId=l,((i=this.accessor.options.theme)===null||i===void 0?void 0:i.tabAnimation)==="smooth"&&this.applyDragOverTransforms())}_buildFirstPanelToGroupMap(){let e=new Map;if(this._tabGroupManager.chipRenderers.size===0)return e;for(let t of this.group.model.getTabGroups())t.id!==this._animState.sourceTabGroupId&&t.panelIds.length>0&&e.set(t.panelIds[0],t.id);return e}_computeDragOverInsertionIndex(e,t){let i=this._animState,n=i.sourceGroupPanelIds,o=e-i.cursorOffsetFromDragStart-i.containerStart,a=0,d=null;for(let g=0;g<this._tabs.length;g++){let f=this._tabs[g].value;if(f.panel.id===i.sourceTabId||n?.has(f.panel.id))continue;let _=t.get(f.panel.id);if(_){var l;let D=(l=i.chipSizes.get(_))!==null&&l!==void 0?l:0;if(a+D>o){var u;(u=d)!==null&&u!==void 0||(d=g);break}a+=D}let w=i.tabPositions.get(f.panel.id),y=this._mainAxisSize(w??f.element.getBoundingClientRect());if(a+y/2<=o)a+=y,d=g+1;else{var v;(v=d)!==null&&v!==void 0||(d=g);break}}return d}_accumulatedSizeUpTo(e,t){let i=this._animState,n=i.sourceGroupPanelIds,o=0;for(let d=0;d<this._tabs.length;d++){let l=this._tabs[d].value;if(l.panel.id===i.sourceTabId||n?.has(l.panel.id))continue;if(d>=e)break;let u=t.get(l.panel.id);if(u){var a;o+=(a=i.chipSizes.get(u))!==null&&a!==void 0?a:0}let v=i.tabPositions.get(l.panel.id);o+=this._mainAxisSize(v??l.element.getBoundingClientRect())}return o}_resolveInsertionAgainstTabGroups(e,t,i){let n=!!this._animState.sourceTabGroupId,o=this._accumulatedSizeUpTo(t,i);for(let a of this.group.model.getTabGroups()){let d=this._evaluateTabGroupForInsertion(a,e,t,o,n);if(d)return d}return{insertionIndex:t,targetTabGroupId:null}}_evaluateTabGroupForInsertion(e,t,i,n,o){let a=this._resolveGroupRange(e);if(!a)return null;let{firstIdx:d,lastIdx:l}=a,u=i>=d&&i<=l,v=!u&&i===d-1;return!u&&!v?null:o?this._resolveGroupDragTarget(i,d,l,u):this._resolveTabDragTarget(e,t,i,n,d,v)}_resolveGroupRange(e){let t=this._animState,i=t.sourceGroupPanelIds,n=e.panelIds.filter(d=>d!==t.sourceTabId&&!i?.has(d));if(n.length===0)return null;let o=this._tabs.findIndex(d=>d.value.panel.id===n[0]),a=this._tabs.findIndex(d=>d.value.panel.id===n[n.length-1]);return o===-1||a===-1?null:{firstIdx:o,lastIdx:a}}_resolveGroupDragTarget(e,t,i,n){return n?{insertionIndex:e<(t+i+1)/2?t:i+1,targetTabGroupId:null}:{insertionIndex:e,targetTabGroupId:null}}_resolveTabDragTarget(e,t,i,n,o,a){var d;let l=this._animState,u=(d=l.chipSizes.get(e.id))!==null&&d!==void 0?d:0;if(a)return this._onlySourceBetween(i,o)?t>=(e.collapsed?l.containerStart+n+u/2:l.containerStart+n+u)?{insertionIndex:o,targetTabGroupId:e.id}:{insertionIndex:i,targetTabGroupId:null}:null;let v=l.containerStart+n+u;return i===o?{insertionIndex:i,targetTabGroupId:t>=v?e.id:null}:{insertionIndex:i,targetTabGroupId:e.id}}_onlySourceBetween(e,t){let i=this._animState;for(let o=e;o<t;o++){var n;let a=this._tabs[o].value.panel.id;if(a!==i.sourceTabId&&!(!((n=i.sourceGroupPanelIds)===null||n===void 0)&&n.has(a)))return!1}return!0}handleWrappedDragOver(e,t){if(!this._animState)return;let i=this.computeWrappedInsertionIndex(e,t);i===this._animState.currentInsertionIndex&&this._animState.targetTabGroupId===null||(this._animState.currentInsertionIndex=i,this._animState.targetTabGroupId=null,this.updateWrapDropIndicator(i))}computeWrappedInsertionIndex(e,t){var i;let n=this._direction==="vertical",o=this._wrappedDragEntries();if(o.length===0)return this._tabs.length;let a=n?e:t,d=n?t:e,l=w=>n?w.left:w.top,u=w=>n?w.right:w.bottom,v=w=>n?w.top:w.left,g=w=>n?w.height:w.width,f=this._bucketWrappedLines(o,l,u),_=[...((i=f.find(w=>a>=w.start&&a<=w.end))!==null&&i!==void 0?i:this._nearestWrappedLine(f,a)).items].sort((w,y)=>v(w.rect)-v(y.rect));for(let w of _)if(d<v(w.rect)+g(w.rect)/2)return w.index;return _[_.length-1].index+1}_wrappedDragEntries(){var e,t;let i=(e=this._animState)===null||e===void 0?void 0:e.sourceTabId,n=(t=this._animState)===null||t===void 0?void 0:t.sourceGroupPanelIds,o=[];for(let a=0;a<this._tabs.length;a++){let d=this._tabs[a].value;d.panel.id!==i&&(n?.has(d.panel.id)||o.push({index:a,rect:d.element.getBoundingClientRect()}))}return o}_bucketWrappedLines(e,t,i){let n=[];for(let o of e){let a=t(o.rect),d=n.find(l=>Math.abs(l.start-a)<=2);d?(d.items.push(o),d.end=Math.max(d.end,i(o.rect))):n.push({start:a,end:i(o.rect),items:[o]})}return n.sort((o,a)=>o.start-a.start),n}_nearestWrappedLine(e,t){let i=n=>t<n.start?n.start-t:t-n.end;return e.reduce((n,o)=>i(o)<i(n)?o:n,e[0])}updateWrapDropIndicator(e){var t;this.clearWrapDropIndicator();let i=this._tabs.length;if(i===0)return;let n=(t=this._animState)===null||t===void 0?void 0:t.sourceTabId;if(e<i){let o=this._tabs[e].value.element;if(this._tabs[e].value.panel.id===n)return;o.classList.add("dv-tab--reorder-before"),this._wrapIndicatorEl=o}else{let o=this._tabs[i-1].value.element;o.classList.add("dv-tab--reorder-after"),this._wrapIndicatorEl=o}}clearWrapDropIndicator(){var e;(e=this._wrapIndicatorEl)===null||e===void 0||e.classList.remove("dv-tab--reorder-before","dv-tab--reorder-after"),this._wrapIndicatorEl=null}_removeClassInstantlyBatch(e,t){let i=[];for(let n of e)n.classList.contains(t)&&(n.style.transition="none",A(n,t,!1),i.push(n));if(i.length>0){i[0].getBoundingClientRect();for(let n of i)n.style.removeProperty("transition")}}uncollapseSourceTab(e){let t=this._tabMap.get(e);t&&this._removeClassInstantlyBatch([t.value.element],"dv-tab--dragging")}applyDragOverTransforms(e=!1){var t;if(this._wrapMode)return;if(((t=this._animState)===null||t===void 0?void 0:t.currentInsertionIndex)==null){this.resetTabTransforms();return}if(this._pendingCollapse)return;let i=this._animState.currentInsertionIndex,n=this._computeGapSize(),o=this._computeChipToShift(i);this._applyGapMargins(i,n,o,e)}_computeGapSize(){let e=this._animState;if(e.sourceTabGroupId&&e.sourceGroupPanelIds)return e.sourceGapSize;let t=e.tabPositions.get(e.sourceTabId);return t?this._mainAxisSize(t):this.getAverageTabSize()}_computeChipToShift(e){if(this._tabGroupManager.chipRenderers.size===0)return null;for(let t of this.group.model.getTabGroups()){let i=this._chipToShiftForGroup(t,e);if(i!==void 0)return i}return null}_chipToShiftForGroup(e,t){let i=this._animState;if(e.id===i.sourceTabGroupId||e.panelIds.includes(i.sourceTabId))return;let n=e.panelIds.filter(a=>{var d;return a!==i.sourceTabId&&!(!((d=i.sourceGroupPanelIds)===null||d===void 0)&&d.has(a))});if(n.length===0)return;let o=this._tabs.findIndex(a=>a.value.panel.id===n[0]);if((!i.targetTabGroupId||i.targetTabGroupId===e.id&&e.collapsed)&&!(o<t)){if(this._onlySourceBetween(t,o)){let a=this._tabGroupManager.chipRenderers.get(e.id);if(a)return a.chip.element}return null}}_applyGapMargins(e,t,i,n){let o=this._animState,a=o.sourceGroupPanelIds,d=!1;for(let[l,u]of this._tabGroupManager.chipRenderers)l!==o.sourceTabGroupId&&this._clearMargin(u.chip.element,n);i&&(this._setMargin(i,`${t}px`,n),d=!0);for(let l=0;l<this._tabs.length;l++){let u=this._tabs[l].value;u.panel.id!==o.sourceTabId&&(a?.has(u.panel.id)||(!d&&l>=e?(this._setMargin(u.element,`${t}px`,n),d=!0):this._clearMargin(u.element,n)))}this._tabGroupManager.trackUnderlines()}_shiftingClass(e){return e.classList.contains("dv-tab-group-chip")?"dv-tab-group-chip--shifting":"dv-tab--shifting"}_setMargin(e,t,i){let n=this._gapMarginProperty;i?(e.style.transition="none",e.style.setProperty(n,t),e.getBoundingClientRect(),e.style.removeProperty("transition")):e.style.setProperty(n,t),A(e,this._shiftingClass(e),!0)}_clearMargin(e,t){let i=this._shiftingClass(e),n=this._gapMarginProperty,o=this._pendingMarginCleanups.get(e);if(o&&o(),t||!e.style.getPropertyValue(n))e.style.removeProperty(n),A(e,i,!1);else{e.style.setProperty(n,"0px"),A(e,i,!0);let a=()=>{e.style.removeProperty(n),A(e,i,!1),e.removeEventListener("transitionend",a),clearTimeout(d),this._pendingMarginCleanups.delete(e)},d=setTimeout(a,300);this._pendingMarginCleanups.set(e,a),e.addEventListener("transitionend",a)}}resetTabTransforms(){this.clearWrapDropIndicator();for(let[,e]of this._pendingMarginCleanups)e();this._pendingMarginCleanups.clear();for(let e of this._tabs)e.value.element.style.removeProperty("margin-left"),e.value.element.style.removeProperty("margin-right"),e.value.element.style.removeProperty("margin-top"),e.value.element.style.removeProperty("margin-bottom"),e.value.element.style.removeProperty("transform"),A(e.value.element,"dv-tab--shifting",!1);for(let[,e]of this._tabGroupManager.chipRenderers)e.chip.element.style.removeProperty("margin-left"),e.chip.element.style.removeProperty("margin-top"),A(e.chip.element,"dv-tab-group-chip--shifting",!1);this._tabGroupManager.positionUnderlines()}commitGroupMove(e,t){let i=b();if(this._tabGroupManager.disposeChipDrag(e),this._tabGroupManager.clearChipDropOverlays(),this.group.model.getTabGroups().some(a=>a.id===e)){var n;if(((n=this.accessor.options.theme)===null||n===void 0?void 0:n.tabAnimation)==="smooth"){this._clearGroupDragClasses(e);let a=this.snapshotTabPositions();this.resetTabTransforms(),this.group.model.moveTabGroup(e,t),this.runFlipAnimation(a,"",!1)}else this._tabGroupManager.skipNextCollapseAnimation=!0,this.group.model.moveTabGroup(e,t)}else if(i){var o;this.resetTabTransforms(),this.accessor.moveGroupOrPanel({from:{groupId:i.groupId,tabGroupId:(o=i.tabGroupId)!==null&&o!==void 0?o:e},to:{group:this.group,position:"center",index:t}})}}_clearGroupDragClasses(e){let t=this._tabGroupManager.chipRenderers.get(e);t&&this._removeClassInstantlyBatch([t.chip.element],"dv-tab-group-chip--dragging"),this._removeClassInstantlyBatch(this._tabs.map(n=>n.value.element),"dv-tab--dragging");let i=this._tabGroupManager.groupUnderlines.get(e);i&&i.style.removeProperty("display"),this._tabGroupManager.skipNextCollapseAnimation=!0}resetDragAnimation(){if(this._pendingCollapse=!1,this._animState){this.resetTabTransforms(),this._animState.sourceTabGroupId?this._clearGroupDragClasses(this._animState.sourceTabGroupId):this._removeClassInstantlyBatch(this._tabs.map(e=>e.value.element),"dv-tab--dragging"),this._animState=null;for(let[,e]of this._tabGroupManager.groupUnderlines)e.style.removeProperty("display")}}runFlipAnimation(e,t,i=!1,n){if(this._wrapMode)return;let o=!1;for(let a=0;a<this._tabs.length;a++)this._applyFlipTransform(this._tabs[a],a,t,i,e,n)&&(o=!0);o&&this._scheduleFlipReset()}_applyFlipTransform(e,t,i,n,o,a){let d=this._direction==="vertical",l=e.value.panel.id;if(l===i){if(!n)return!1;let f=e.value.element.getBoundingClientRect();return e.value.element.style.transform=d?`translateY(${f.height}px)`:`translateX(${f.width}px)`,A(e.value.element,"dv-tab--shifting",!0),!0}if(a!==void 0&&(t<a.from||t>a.to))return!1;let u=o.get(l);if(!u)return!1;let v=e.value.element.getBoundingClientRect(),g=d?u.top-v.top:u.left-v.left;return Math.abs(g)<1?!1:(e.value.element.style.transform=d?`translateY(${g}px)`:`translateX(${g}px)`,A(e.value.element,"dv-tab--shifting",!0),!0)}_scheduleFlipReset(){requestAnimationFrame(()=>{var e;for(let n of this._tabs)n.value.element.style.transform&&(n.value.element.style.transform="");this._tabGroupManager.trackUnderlines(),(e=this._flipTransitionCleanup)===null||e===void 0||e.call(this);let t=n=>{if(n.propertyName==="transform"){i();for(let o of this._tabs)A(o.value.element,"dv-tab--shifting",!1);this._tabGroupManager.positionUnderlines()}},i=()=>{this._tabsList.removeEventListener("transitionend",t),this._flipTransitionCleanup=null};this._flipTransitionCleanup=i,this._tabsList.addEventListener("transitionend",t)})}},Yd=class extends C{get _animState(){return this._reorder.animState}set _animState(e){this._reorder.animState=e}get _pendingCollapse(){return this._reorder.pendingCollapse}set _pendingCollapse(e){this._reorder.pendingCollapse=e}get tabItems(){return this._tabs}get tabMap(){return this._tabMap}get tabsList(){return this._tabsList}get groupPanel(){return this.group}get component(){return this.accessor}get tabGroupManager(){return this._tabGroupManager}fireDrop(e){this._onDrop.fire(e)}setOverflowExclude(e){this._overflowExclude=e,this.refreshOverflow()}setForcedOverflow(e){this._forcedOverflow=e,this.refreshOverflow()}refreshOverflow(){this._showTabsOverflowControl&&this.toggleDropdown({reset:!1}),this._applyPinnedSticky()}setPinnedSticky(e){this._pinnedSticky!==e&&(this._pinnedSticky=e,this._applyPinnedSticky())}_applyPinnedSticky(){let e=this._pinnedSticky?this._tabs.filter(i=>this._overflowExclude(i.value.panel.id)):[];if(e.length===0&&!this._hasPinnedStickyStyling)return;for(let i of this._tabs){let n=i.value.element;n.classList.contains("dv-tab--pinned-sticky")&&(n.classList.remove("dv-tab--pinned-sticky"),n.style.removeProperty("--dv-pinned-sticky-left"))}if(e.length===0){this._hasPinnedStickyStyling=!1;return}let t=e.map(i=>i.value.element.offsetLeft);e.forEach((i,n)=>{let o=i.value.element;o.classList.add("dv-tab--pinned-sticky"),o.style.setProperty("--dv-pinned-sticky-left",`${t[n]}px`)}),this._hasPinnedStickyStyling=!0}get showTabsOverflowControl(){return this._showTabsOverflowControl}set showTabsOverflowControl(e){if(this._showTabsOverflowControl!=e)if(this._showTabsOverflowControl=e,e){let t=new on(this._tabsList);this._observerDisposable.value=new C(t,t.onDidChange(i=>{let n=i.hasScrollX||i.hasScrollY;this.toggleDropdown({reset:!n}),this._applyPinnedSticky(),this._tabGroupManager.groupUnderlines.size>0&&this._tabGroupManager.positionUnderlines()}),M(this._tabsList,"scroll",()=>{this.toggleDropdown({reset:!1}),this._applyPinnedSticky(),this._tabGroupManager.groupUnderlines.size>0&&this._tabGroupManager.positionUnderlines()}))}else this._observerDisposable.value=S.NONE}get element(){return this._element}get tabsListElement(){return this._tabsList}set voidContainer(e){var t;(t=this._voidContainerListeners)===null||t===void 0||t.dispose(),this._voidContainerListeners=null,this._reorder.voidContainerElement=e,e&&(this._voidContainerListeners=new C(M(e,"dragover",i=>{this._animState&&i.preventDefault()}),M(e,"drop",i=>{var n;!((n=this._animState)===null||n===void 0)&&n.sourceTabGroupId&&this._animState.currentInsertionIndex!==null&&(i.preventDefault(),i.stopPropagation(),this.handleVoidDrop())})))}handleVoidDrop(){var e,t;if(!(!((e=this._animState)===null||e===void 0)&&e.sourceTabGroupId))return!1;let i=this._animState.sourceTabGroupId,n=(t=this._animState.currentInsertionIndex)!==null&&t!==void 0?t:this._tabs.length;return this._animState=null,this._commitGroupMove(i,n),!0}get panels(){return this._tabs.map(e=>e.value.panel.id)}get size(){return this._tabs.length}get tabs(){return this._tabs.map(e=>e.value)}get direction(){return this._direction}set direction(e){if(this._direction!==e){this._direction=e,this._tabsList.setAttribute("aria-orientation",e==="vertical"?"vertical":"horizontal"),this._scrollbar&&(this._scrollbar.orientation=e),be(this._tabsList,"dv-horizontal","dv-vertical"),e==="vertical"?fe(this._tabsList,"dv-tabs-container-vertical","dv-vertical"):(be(this._tabsList,"dv-tabs-container-vertical"),fe(this._tabsList,"dv-horizontal"));for(let t of this._tabs)t.value.setDirection(e);this._tabGroupManager.updateDirection()}}constructor(e,t,i){super(),this.group=e,this.accessor=t,this._observerDisposable=new E,this._pointerActivation=new E,this._scrollbar=null,this._tabs=[],this._tabMap=new Map,this.selectedIndex=-1,this._showTabsOverflowControl=!1,this._overflowExclude=()=>!1,this._forcedOverflow=()=>!1,this._pinnedSticky=!1,this._hasPinnedStickyStyling=!1,this._direction="horizontal",this._voidContainerListeners=null,this._onTabDragStart=new k,this.onTabDragStart=this._onTabDragStart.event,this._onDrop=new k,this.onDrop=this._onDrop.event,this._onWillShowOverlay=new k,this.onWillShowOverlay=this._onWillShowOverlay.event,this._onOverflowTabsChange=new k,this.onOverflowTabsChange=this._onOverflowTabsChange.event,this._tabsList=document.createElement("div"),this._tabsList.className="dv-tabs-container",this._tabsList.setAttribute("role","tablist"),this._tabsList.setAttribute("aria-orientation",this._direction==="vertical"?"vertical":"horizontal"),this.showTabsOverflowControl=i.showTabsOverflowControl,t.options.scrollbars==="native"?this._element=this._tabsList:(this._scrollbar=new tr(this._tabsList),this._scrollbar.orientation=this.direction,this._element=this._scrollbar.element,this.addDisposables(this._scrollbar)),this._tabGroupManager=new Bd({group:this.group,accessor:this.accessor,tabsList:this._tabsList,getTabs:()=>this._tabs,getTabMap:()=>this._tabMap,getDirection:()=>this._direction},{onChipContextMenu:(o,a)=>{var d;(d=this.accessor.contextMenuService)===null||d===void 0||d.showForChip(o,this.group,a)},onChipDragStart:(o,a,d)=>{this._handleChipDragStart(o,a,d)},onChipDragEnd:()=>{this._reorder.resetDragAnimation()},onChipDrop:(o,a)=>{this._handleChipDrop(o,a)}}),this._reorder=new Ud(this);let n=Ne.createDropTarget(this._tabsList,{acceptedTargetZones:["center"],canDisplayOverlay:()=>!1,isHitTestTransparent:()=>{let o=b();return o?.viewId!==this.accessor.id||o.groupId!==this.group.id?!0:o.panelId===null&&!o.tabGroupId}});this.addDisposables(n,this._onOverflowTabsChange,this._observerDisposable,this._pointerActivation,this._onWillShowOverlay,this._onDrop,this._onTabDragStart,this._reorder,ci.getInstance().onDragEnd(o=>{this._reorder.handlePointerDragEnd(o)}),ci.getInstance().onDragMove(o=>{this._reorder.handlePointerDragMove(o.clientX,o.clientY)}),M(this.element,"pointerdown",o=>{o.defaultPrevented||o.button===0&&this.accessor.doSetGroupActive(this.group)}),M(this._tabsList,"wheel",o=>{let a=this._direction==="vertical",d=a?o.deltaY||o.deltaX:o.deltaX||o.deltaY;if(d===0)return;let l=a?this._tabsList.scrollHeight-this._tabsList.clientHeight:this._tabsList.scrollWidth-this._tabsList.clientWidth;if(l<=0)return;let u=a?this._tabsList.scrollTop:this._tabsList.scrollLeft;d<0&&u<=0||d>0&&u>=l||(o.preventDefault(),o.stopPropagation(),a?this._tabsList.scrollTop=u+d:this._tabsList.scrollLeft=u+d)},{passive:!1}),M(this._tabsList,"keydown",o=>{this._onKeyDown(o)}),M(this._tabsList,"dragover",o=>{this._reorder.processDragOver(o.clientX,o.clientY)&&o.preventDefault()},!0),M(this._tabsList,"dragleave",o=>{this._reorder.processDragLeave(o.relatedTarget)},!0),M(this._tabsList,"dragend",()=>{this._reorder.resetDragAnimation()}),M(this._tabsList,"drop",o=>{var a,d,l;if(((a=this._animState)===null||a===void 0?void 0:a.currentInsertionIndex)==null||((d=this.accessor.options.theme)===null||d===void 0?void 0:d.tabAnimation)!=="smooth"&&!this._animState.sourceTabGroupId)return;o.stopPropagation(),o.preventDefault(),(l=this.group.model.dropTargetContainer)===null||l===void 0||(l=l.model)===null||l===void 0||l.clear();let u=this._animState;if(this._animState=null,this._pendingCollapse=!1,u.sourceTabGroupId){this._commitGroupMove(u.sourceTabGroupId,u.currentInsertionIndex);return}let v=u.currentInsertionIndex,g=u.sourceIndex,f=v-(g!==-1&&g<v?1:0),_=this.group.model.getTabGroupForPanel(u.sourceTabId);if(f===g&&!u.targetTabGroupId&&!_){this._reorder.uncollapseSourceTab(u.sourceTabId),this.resetTabTransforms();return}this._reorder.uncollapseSourceTab(u.sourceTabId);let w=this.snapshotTabPositions();this.resetTabTransforms(),this._onDrop.fire({event:o,index:f,targetTabGroupId:u.targetTabGroupId}),this.runFlipAnimation(w,u.sourceTabId,u.sourceIndex===-1,{from:Math.min(g,f),to:Math.max(g,f)})},!0),S.from(()=>{var o;(o=this._voidContainerListeners)===null||o===void 0||o.dispose(),this._reorder.resetDragAnimation(),this._tabGroupManager.disposeAll();for(let{value:a,disposable:d}of this._tabs)d.dispose(),a.dispose();this._tabs=[],this._tabMap.clear()}))}indexOf(e){return this._tabs.findIndex(t=>t.value.panel.id===e)}getTabId(e){var t;return(t=this._tabMap.get(e))===null||t===void 0?void 0:t.value.element.id}getPanelForTab(e){for(let{value:t}of this._tabs)if(t.element===e||t.element.contains(e))return t.panel}isActive(e){return this.selectedIndex>-1&&this._tabs[this.selectedIndex].value===e}_onKeyDown(e){let t=this._tabs.findIndex(d=>d.value.element===e.target);if(t===-1)return;let i=this._direction==="vertical",n=i?"ArrowDown":"ArrowRight",o=i?"ArrowUp":"ArrowLeft",a=this._tabs.length-1;switch(e.key){case n:e.preventDefault(),this._focusTab(Math.min(t+1,a));break;case o:e.preventDefault(),this._focusTab(Math.max(t-1,0));break;case"Home":e.preventDefault(),this._focusTab(0);break;case"End":e.preventDefault(),this._focusTab(a);break;case"Enter":case" ":e.preventDefault(),this.accessor.withOrigin("user",()=>this._tabs[t].value.panel.api.setActive());break;case"Delete":case"Backspace":e.preventDefault(),this._closeTab(t);break}}_closeTab(e){var t,i,n,o,a;let d=(t=this._tabs[e])===null||t===void 0?void 0:t.value;if(!d)return;let l=(i=(n=(o=this._tabs[e+1])===null||o===void 0?void 0:o.value)!==null&&n!==void 0?n:(a=this._tabs[e-1])===null||a===void 0?void 0:a.value)===null||i===void 0?void 0:i.panel.id;if(d.panel.api.close(),l!==void 0){let u=this._tabs.findIndex(v=>v.value.panel.id===l);u>-1&&this._focusTab(u)}}_focusTab(e){for(let t=0;t<this._tabs.length;t++)this._tabs[t].value.element.tabIndex=t===e?0:-1;this._tabs[e].value.element.focus()}focusActiveTab(){var e;if(this._tabs.length===0)return;let t=(e=this.group.activePanel)===null||e===void 0?void 0:e.id,i=t?this._tabs.findIndex(n=>n.value.panel.id===t):-1;this._focusTab(i>-1?i:0)}setActivePanel(e){let t=this._direction==="vertical";for(let i of this._tabs){let n=e.id===i.value.panel.id;i.value.setActive(n),n&&this._scrollTabIntoView(i.value.element,t)}this._tabGroupManager.groupUnderlines.size>0&&this._tabGroupManager.positionUnderlines()}_scrollTabIntoView(e,t){let i=e.parentElement;if(!i)return;let n=t?e.offsetTop:e.offsetLeft,o=t?e.offsetHeight:e.offsetWidth,a=t?i.scrollTop:i.scrollLeft,d=t?i.clientHeight:i.clientWidth;(n<a||n+o>a+d)&&(t?i.scrollTop=n:i.scrollLeft=n)}_activateOnPointerDown(e){if(!Ee(this.accessor.options).html5){this.group.model.openPanel(e);return}let t=requestAnimationFrame(()=>{this._tabMap.has(e.id)&&this.group.model.openPanel(e)});this._pointerActivation.value={dispose:()=>cancelAnimationFrame(t)}}openPanel(e,t=this._tabs.length){if(this._tabMap.has(e.id))return;let i=new Qo(e,this.accessor,this.group);i.setContent(e.view.tab),this._direction!=="horizontal"&&i.setDirection(this._direction);let n={value:i,disposable:new C(i.onDragStart(o=>{var a;if(this._onTabDragStart.fire({nativeEvent:o,panel:e}),((a=this.accessor.options.theme)===null||a===void 0?void 0:a.tabAnimation)==="smooth"){let d=Wt(i.element.getBoundingClientRect(),this._direction),l=this._tabs.findIndex(u=>u.value===i);this._animState={sourceTabId:e.id,sourceIndex:l,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:null,sourceGroupPanelIds:null,sourceChipSize:0,cursorOffsetFromDragStart:d/2,sourceGapSize:d,containerStart:mi(this._tabsList.getBoundingClientRect(),this._direction)},this._pendingCollapse=!0,requestAnimationFrame(()=>{var u,v;this._pendingCollapse=!1,this._animState&&(this._tabsList.classList.contains("dv-tabs-container--wrap")||(i.element.style.transition="none",A(i.element,"dv-tab--dragging",!0),i.element.offsetHeight),(v=(u=this._animState).currentInsertionIndex)!==null&&v!==void 0||(u.currentInsertionIndex=l),this.applyDragOverTransforms(!0),i.element.style.removeProperty("transition"))})}}),i.onTabClick(o=>{o.defaultPrevented||this.group.api.location.type==="edge"&&(this.group.activePanel===e?this.group.api.isCollapsed()?this.group.api.expand():this.group.api.collapse():(this.group.model.openPanel(e),this.group.api.isCollapsed()&&this.group.api.expand()))}),i.onPointerDown(o=>{if(o.defaultPrevented)return;let a=!this.accessor.options.disableFloatingGroups,d=this.group.api.location.type==="floating"&&this.size===1;if(a&&!d&&o.shiftKey){o.preventDefault();let l=this.accessor.getGroupPanel(i.panel.id),{top:u,left:v}=i.element.getBoundingClientRect(),{top:g,left:f}=this.accessor.element.getBoundingClientRect();this.accessor.addFloatingGroup(l,{x:v-f,y:u-g,inDragMode:!0});return}o.button===0&&this.group.api.location.type!=="edge"&&this.group.activePanel!==e&&this._activateOnPointerDown(e)}),i.onDrop(o=>{let a=this._animState;this._animState=null,this._pendingCollapse=!1;let d=this._tabs.findIndex(f=>f.value===i);if(a){var l;let f=o.position==="right"?d+1:d;if(a.sourceTabGroupId){var u;this._commitGroupMove(a.sourceTabGroupId,(u=a.currentInsertionIndex)!==null&&u!==void 0?u:f);return}this._reorder.uncollapseSourceTab(a.sourceTabId);let _=this.snapshotTabPositions();this.resetTabTransforms(),this._onDrop.fire({event:o.nativeEvent,index:f,targetTabGroupId:a.targetTabGroupId}),((l=this.accessor.options.theme)===null||l===void 0?void 0:l.tabAnimation)==="smooth"&&this.runFlipAnimation(_,a.sourceTabId,a.sourceIndex===-1,a.sourceIndex===-1?void 0:{from:Math.min(a.sourceIndex,f),to:Math.max(a.sourceIndex,f)})}else{var v,g;let f=this._direction==="vertical"?"bottom":"right",_=o.position===f?d+1:d,w=b(),y=w?this._tabs.findIndex(T=>T.value.panel.id===w.panelId):-1,D=_-(y!==-1&&y<_?1:0),G=(v=(g=this.group.model.getTabGroupForPanel(i.panel.id))===null||g===void 0?void 0:g.id)!==null&&v!==void 0?v:null;this._onDrop.fire({event:o.nativeEvent,index:D,targetTabGroupId:G})}}),i.onWillShowOverlay(o=>{this._onWillShowOverlay.fire(new St(o,{kind:"tab",panel:this.group.activePanel,api:this.accessor.api,group:this.group,getData:b}))}))};this.addTab(n,t),this._tabGroupManager.positionAllChips(),this._animState&&(this._animState.tabPositions=this.snapshotTabPositions(),this._animState.chipSizes=this._tabGroupManager.snapshotChipSizes(),this.applyDragOverTransforms())}delete(e){var t;((t=this._animState)===null||t===void 0?void 0:t.sourceTabId)===e&&(this.resetTabTransforms(),this._animState=null),this._tabGroupManager.cleanupTransition(e);let i=this.indexOf(e),n=this._tabs.splice(i,1)[0];if(this._tabMap.delete(e),n){let{value:o,disposable:a}=n;a.dispose(),o.dispose(),o.element.remove()}this._animState&&(this._animState.tabPositions=this.snapshotTabPositions(),this._animState.chipSizes=this._tabGroupManager.snapshotChipSizes(),this.applyDragOverTransforms())}addTab(e,t=this._tabs.length){if(t<0||t>this._tabs.length)throw new Error("invalid location");let i=t<this._tabs.length?this._tabs[t].value.element:null;this._tabsList.insertBefore(e.value.element,i),this._tabs=[...this._tabs.slice(0,t),e,...this._tabs.slice(t)],this._tabMap.set(e.value.panel.id,e),this.selectedIndex<0&&(this.selectedIndex=t)}toggleDropdown(e){let t=this._tabs.some(d=>!this._overflowExclude(d.value.panel.id)&&this._forcedOverflow(d.value.panel.id));if(e.reset&&!t){this._onOverflowTabsChange.fire({tabs:[],tabGroups:[],pinnedTabs:[],reset:!0});return}let i=this._tabs.filter(d=>!this._overflowExclude(d.value.panel.id)&&(this._forcedOverflow(d.value.panel.id)||!e.reset&&!Oe(d.value.element,this._tabsList))).map(d=>d.value.panel.id),n=e.reset?[]:this._tabs.filter(d=>this._overflowExclude(d.value.panel.id)&&d.value.element.getBoundingClientRect().width>0&&!Oe(d.value.element,this._tabsList)).map(d=>d.value.panel.id),o=new Set(i),a=[];for(let d of this.group.model.getTabGroups()){let l=this._tabGroupManager.chipRenderers.get(d.id),u=l&&!Oe(l.chip.element,this._tabsList),v=d.panelIds.length>0&&d.panelIds.every(g=>o.has(g));if((u||v)&&(a.push(d.id),d.collapsed))for(let g of d.panelIds)o.has(g)||(o.add(g),i.push(g))}this._onOverflowTabsChange.fire({tabs:i,tabGroups:a,pinnedTabs:n,reset:!1})}updateDragAndDropState(){for(let e of this._tabs)e.value.updateDragAndDropState();this._tabGroupManager.updateDragAndDropState()}updateTabGroups(){this._tabGroupManager.update()}refreshTabGroupAccent(){this._tabGroupManager.refreshAccents()}_handleChipDragStart(e,t,i){var n;let o=e.panelIds[0],a=o?this._tabs.findIndex(v=>v.value.panel.id===o):-1,d=t.element.getBoundingClientRect(),l=Wt(d,this._direction);for(let v of e.panelIds){let g=this._tabMap.get(v);g&&(l+=Wt(g.value.element.getBoundingClientRect(),this._direction))}if(this._animState={sourceTabId:"",sourceIndex:a,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:e.id,sourceGroupPanelIds:new Set(e.panelIds),sourceChipSize:Wt(d,this._direction),cursorOffsetFromDragStart:hr(i,this._direction)-mi(d,this._direction),sourceGapSize:l,containerStart:mi(this._tabsList.getBoundingClientRect(),this._direction)},((n=this.accessor.options.theme)===null||n===void 0?void 0:n.tabAnimation)!=="smooth")return;let u=new Set(e.panelIds);this._pendingCollapse=!0,requestAnimationFrame(()=>{var v,g;if(this._pendingCollapse=!1,!this._animState)return;for(let w of this._tabs)u.has(w.value.panel.id)&&(w.value.element.style.transition="none",A(w.value.element,"dv-tab--dragging",!0));let f=this._tabGroupManager.chipRenderers.get(e.id);f&&(f.chip.element.style.transition="none",A(f.chip.element,"dv-tab-group-chip--dragging",!0)),this._tabsList.offsetHeight;let _=this._tabGroupManager.groupUnderlines.get(e.id);_&&(_.style.display="none"),(g=(v=this._animState).currentInsertionIndex)!==null&&g!==void 0||(v.currentInsertionIndex=a),this.applyDragOverTransforms(!0);for(let w of this._tabs)u.has(w.value.panel.id)&&w.value.element.style.removeProperty("transition");f&&f.chip.element.style.removeProperty("transition")})}_handleChipDrop(e,t){let i=e.panelIds[0];if(!i)return;let n=this._tabs.findIndex(u=>u.value.panel.id===i);if(n===-1)return;let o=b();if(o?.tabGroupId){var a;let u=this._animState;this._animState=null,this._pendingCollapse=!1,this._commitGroupMove(o.tabGroupId,(a=u?.currentInsertionIndex)!==null&&a!==void 0?a:n);return}let d=o?.groupId===this.group.id&&o?.panelId?this._tabs.findIndex(u=>u.value.panel.id===o.panelId):-1,l=n-(d!==-1&&d<n?1:0);this._onDrop.fire({event:t.nativeEvent,index:l,targetTabGroupId:null})}setExtendedDropZone(e){this._reorder.setExtendedDropZone(e)}setExternalInsertionIndex(e){this._reorder.setExternalInsertionIndex(e)}clearExternalAnimState(){this._reorder.clearExternalAnimState()}snapshotTabPositions(){return this._reorder.snapshotTabPositions()}handleDragOver(e){this._reorder.handleDragOver(e)}applyDragOverTransforms(e=!1){this._reorder.applyDragOverTransforms(e)}resetTabTransforms(){this._reorder.resetTabTransforms()}_commitGroupMove(e,t){this._reorder.commitGroupMove(e,t)}runFlipAnimation(e,t,i=!1,n){this._reorder.runFlipAnimation(e,t,i,n)}};function Xd(){let e=document.createElement("div");e.className="dv-tabs-overflow-dropdown-default";let t=document.createElement("span");t.textContent="";let i=jo();return e.appendChild(i),e.appendChild(t),{element:e,update:n=>{t.textContent=`${n.tabs}`}}}var Jd=class extends C{get onTabDragStart(){return this.tabs.onTabDragStart}get panels(){return this.tabs.panels}get size(){return this.tabs.size}get hidden(){return this._hidden}set hidden(e){this._hidden=e,this.element.style.display=e?"none":""}get direction(){return this._direction}set direction(e){this._direction=e,e==="vertical"?(fe(this._element,"dv-groupview-header-vertical"),fe(this.rightActionsContainer,"dv-right-actions-container-vertical"),this.tabs.direction=e):(be(this._element,"dv-groupview-header-vertical"),be(this.rightActionsContainer,"dv-right-actions-container-vertical"),this.tabs.direction=e)}get element(){return this._element}get tabsListElement(){return this.tabs.tabsListElement}constructor(e,t){super(),this.accessor=e,this.group=t,this._hidden=!1,this._direction="horizontal",this._dropIndexResolver=(i,n)=>n,this._pinnedRow=void 0,this.dropdownPart=null,this._overflowTabs=[],this._overflowTabGroups=[],this._overflowPinnedTabs=[],this._dropdownDisposable=new E,this._onDrop=new k,this.onDrop=this._onDrop.event,this._onGroupDragStart=new k,this.onGroupDragStart=this._onGroupDragStart.event,this._onWillShowOverlay=new k,this.onWillShowOverlay=this._onWillShowOverlay.event,this._element=document.createElement("div"),this._element.className="dv-tabs-and-actions-container",A(this._element,"dv-full-width-single-tab",this.accessor.options.singleTabMode==="fullwidth"),this.rightActionsContainer=document.createElement("div"),this.rightActionsContainer.className="dv-right-actions-container",this.leftActionsContainer=document.createElement("div"),this.leftActionsContainer.className="dv-left-actions-container",this.preActionsContainer=document.createElement("div"),this.preActionsContainer.className="dv-pre-actions-container",this.tabs=new Yd(t,e,{showTabsOverflowControl:!e.options.disableTabsOverflowList}),this.voidContainer=new Od(this.accessor,this.group),this.tabs.voidContainer=this.voidContainer.element,this._element.appendChild(this.preActionsContainer),this._element.appendChild(this.tabs.element),this._element.appendChild(this.leftActionsContainer),this._element.appendChild(this.voidContainer.element),this._element.appendChild(this.rightActionsContainer),this.tabs.setExtendedDropZone(this._element),this.addDisposables(this.tabs.onDrop(i=>this._onDrop.fire(i)),this.tabs.onWillShowOverlay(i=>this._onWillShowOverlay.fire(i)),e.onDidOptionsChange(()=>{this.tabs.showTabsOverflowControl=!e.options.disableTabsOverflowList}),this.tabs.onOverflowTabsChange(i=>{this.toggleDropdown(i)}),this.tabs,this._onWillShowOverlay,this._onDrop,this._onGroupDragStart,this.voidContainer,this.voidContainer.onDragStart(i=>{this._onGroupDragStart.fire({nativeEvent:i,group:this.group})}),this.voidContainer.onDrop(i=>{this.tabs.handleVoidDrop()||this._onDrop.fire({event:i.nativeEvent,index:this.tabs.size})}),this.voidContainer.onWillShowOverlay(i=>{this._onWillShowOverlay.fire(new St(i,{kind:"header_space",panel:this.group.activePanel,api:this.accessor.api,group:this.group,getData:b}))}),M(this.leftActionsContainer,"dragleave",i=>{let n=i.relatedTarget;!this.leftActionsContainer.contains(n)&&!this._element.contains(n)&&this.tabs.clearExternalAnimState()}),M(this.voidContainer.element,"dragleave",i=>{let n=i.relatedTarget;this.voidContainer.element.contains(n)||(this._element.contains(n)?this.tabs.setExternalInsertionIndex(null):this.tabs.clearExternalAnimState())}),M(this.voidContainer.element,"pointerdown",i=>{if(!i.defaultPrevented&&!this.accessor.options.disableFloatingGroups&&i.shiftKey&&this.group.api.location.type!=="floating"&&this.group.api.location.type!=="edge"){i.preventDefault();let{top:n,left:o}=this.element.getBoundingClientRect(),{top:a,left:d}=this.accessor.element.getBoundingClientRect();this.accessor.addFloatingGroup(this.group,{x:o-d+20,y:n-a+20,inDragMode:!0})}}))}show(){this.hidden||(this.element.style.display="")}hide(){this._element.style.display="none"}setRightActionsElement(e){this.rightActions!==e&&(this.rightActions&&(this.rightActions.remove(),this.rightActions=void 0),e&&(this.rightActionsContainer.appendChild(e),this.rightActions=e))}setLeftActionsElement(e){this.leftActions!==e&&(this.leftActions&&(this.leftActions.remove(),this.leftActions=void 0),e&&(this.leftActionsContainer.appendChild(e),this.leftActions=e))}setPrefixActionsElement(e){this.preActions!==e&&(this.preActions&&(this.preActions.remove(),this.preActions=void 0),e&&(this.preActionsContainer.appendChild(e),this.preActions=e))}isActive(e){return this.tabs.isActive(e)}indexOf(e){return this.tabs.indexOf(e)}getTabId(e){return this.tabs.getTabId(e)}getPanelForTab(e){return this.tabs.getPanelForTab(e)}setActive(e){}delete(e){this.tabs.delete(e),this.updateClassnames()}setActivePanel(e){this.tabs.setActivePanel(e)}focusActiveTab(){this.tabs.focusActiveTab()}openPanel(e,t=this.tabs.size){this.tabs.openPanel(e,t),this.updateClassnames()}closePanel(e){this.delete(e.id)}setOverflowExclude(e){this.tabs.setOverflowExclude(e)}setForcedOverflow(e){this.tabs.setForcedOverflow(e)}setPinnedSticky(e){this.tabs.setPinnedSticky(e)}refreshOverflow(){this.tabs.refreshOverflow()}setPinnedRow(e){this._pinnedRow!==e&&(this._pinnedRow&&this._pinnedRow.remove(),this._pinnedRow=e,e&&(e.classList.add("dv-pinned-row"),this._element.insertBefore(e,this._element.firstChild)),A(this._element,"dv-tabs-and-actions-container--pinned-row",!!e))}setDropIndexResolver(e){this._dropIndexResolver=e}resolveDropIndex(e,t){return this._dropIndexResolver(e,t)}updateClassnames(){A(this._element,"dv-single-tab",this.size===1)}toggleDropdown(e){let t=e.reset?[]:e.tabs,i=e.reset?[]:e.tabGroups,n=e.reset?[]:e.pinnedTabs;this._overflowTabs=t,this._overflowTabGroups=i,this._overflowPinnedTabs=n;let o=this._overflowTabs.length+this._overflowPinnedTabs.length;if(o>0&&this.dropdownPart){this.dropdownPart.update({tabs:o});return}if(o===0){this._dropdownDisposable.dispose();return}let a=document.createElement("div");a.className="dv-tabs-overflow-dropdown-root";let d=Xd();d.update({tabs:o}),this.dropdownPart=d,a.appendChild(d.element),this.rightActionsContainer.prepend(a),this._dropdownDisposable.value=new C(S.from(()=>{var l,u;a.remove(),(l=this.dropdownPart)===null||l===void 0||(u=l.dispose)===null||u===void 0||u.call(l),this.dropdownPart=null}),M(a,"pointerdown",l=>{l.preventDefault()},{capture:!0}),M(a,"click",l=>{let u=lt(a),v={x:l.clientX,y:l.clientY,zIndex:u?.style.zIndex?`calc(${u.style.zIndex} * 2)`:void 0},{context:g,rowRenderers:f}=this.createOverflowRenderContext(a,v),_=this.accessor.advancedOverflowService;try{_?_.renderOverflow({group:this.group,overflowTabs:[...this._overflowTabs],overflowTabGroups:[...this._overflowTabGroups],pinnedOverflowTabs:[...this._overflowPinnedTabs],context:g}):g.open(this.renderFreeOverflowList(g))}catch(w){throw f.dispose(),w}}))}createOverflowRenderContext(e,t){let i=new Set(this._overflowTabGroups),n=this.group.model.getTabGroups(),o=new Map,a=new Map;for(let v of n)if(a.set(v.id,v),i.has(v.id))for(let g of v.panelIds)o.set(g,v);let d=()=>this.accessor.getPopupServiceForGroup(this.group),l=new C,u=v=>{let g=document.createElement("div");g.className="dv-tabs-overflow-group-header";let f=document.createElement("span");f.className="dv-tabs-overflow-group-color",vi(f,v.color,this.accessor.tabGroupColorPalette),g.appendChild(f);let _=document.createElement("span");if(_.className="dv-tabs-overflow-group-label",_.textContent=v.label||v.id,g.appendChild(_),v.collapsed){let w=document.createElement("span");w.className="dv-tabs-overflow-group-collapsed-badge",w.textContent=`${v.panelIds.length}`,g.appendChild(w)}return g.addEventListener("click",()=>{d().close(),v.collapsed&&v.expand();let w=v.panelIds[0];if(w){let y=this.group.panels.find(D=>D.id===w);this.accessor.withOrigin("user",()=>y?.api.setActive())}}),g};return{context:{overflowGroupIdForPanel:v=>{var g;return(g=o.get(v))===null||g===void 0?void 0:g.id},buildGroupHeader:v=>{let g=a.get(v);if(!(!g||!i.has(g.id)))return u(g)},buildPinnedHeader:()=>{let v=document.createElement("div");v.className="dv-tabs-overflow-group-header dv-tabs-overflow-pinned-header";let g=xn();g.classList.add("dv-tabs-overflow-pinned-icon"),v.appendChild(g);let f=document.createElement("span");return f.className="dv-tabs-overflow-group-label",f.textContent="Pinned",v.appendChild(f),v},buildRow:v=>{let g=this.group.panels.find(P=>P.id===v);if(!g)return;let f=this.tabs.tabs.find(P=>P.panel.id===v),_=o.get(v),w=g.view.createTabRenderer("headerOverflow"),y=!1,D=S.from(()=>{if(!y){var P;y=!0,(P=w.dispose)===null||P===void 0||P.call(w)}});l.isDisposed?D.dispose():l.addDisposables(D);let G=w.element,T=document.createElement("div");A(T,"dv-tab",!0),A(T,"dv-active-tab",g.api.isActive),A(T,"dv-inactive-tab",!g.api.isActive),_&&A(T,"dv-tab--grouped",!0);let z=()=>{_?.collapsed&&_.expand(),f?.element.scrollIntoView({block:"nearest",inline:"nearest"}),this.accessor.withOrigin("user",()=>g.api.setActive())};return T.addEventListener("click",P=>{d().close(),!P.defaultPrevented&&z()}),T.appendChild(G),{element:T,panel:g,activate:()=>{d().close(),z()},dispose:()=>{l.removeDisposable(D),D.dispose()}}},open:v=>{d().openPopover(v,t,{onClose:()=>l.dispose()})},close:()=>d().close(),focusTrigger:()=>{e.tabIndex=-1,e.focus()}},rowRenderers:l}}renderFreeOverflowList(e){let t=document.createElement("div");t.style.overflow="auto",t.className="dv-tabs-overflow-container";let i=this._overflowPinnedTabs.map(o=>e.buildRow(o)).filter(o=>o!=null);if(i.length>0){t.appendChild(e.buildPinnedHeader());for(let o of i)t.appendChild(o.element)}let n=new Set;for(let o of this.tabs.tabs.filter(a=>this._overflowTabs.includes(a.panel.id))){let a=e.overflowGroupIdForPanel(o.panel.id);if(a&&!n.has(a)){n.add(a);let l=e.buildGroupHeader(a);l&&t.appendChild(l)}let d=e.buildRow(o.panel.id);d&&t.appendChild(d.element)}return t}updateDragAndDropState(){this.tabs.updateDragAndDropState(),this.voidContainer.updateDragAndDropState()}updateTabGroups(){this.tabs.updateTabGroups()}refreshTabGroupAccent(){this.tabs.refreshTabGroupAccent()}},qd=class extends C{get label(){return this._label}get color(){return this._color}get componentParams(){return this._componentParams}setLabel(e){this.isDisposed||this._label===e||(this._label=e,this._onDidChange.fire())}setColor(e){if(this.isDisposed)return;let t=e===""?void 0:e;this._color!==t&&(this._color=t,this._onDidChange.fire())}setComponentParams(e){this.isDisposed||(this._componentParams=e,this._onDidChange.fire())}get collapsed(){return this._collapsed}get panelIds(){return this._panelIds}get size(){return this._panelIds.length}get isEmpty(){return this._panelIds.length===0}constructor(e,t){var i,n;super(),this.id=e,this._collapsed=!1,this._panelIds=[],this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this._onDidPanelChange=new k,this.onDidPanelChange=this._onDidPanelChange.event,this._onDidCollapseChange=new k,this.onDidCollapseChange=this._onDidCollapseChange.event,this._onDidDestroy=new k,this.onDidDestroy=this._onDidDestroy.event,this._label=(i=t?.label)!==null&&i!==void 0?i:"",this._color=t?.color===""?void 0:t?.color,this._collapsed=(n=t?.collapsed)!==null&&n!==void 0?n:!1,this._componentParams=t?.componentParams,this.addDisposables(this._onDidChange,this._onDidPanelChange,this._onDidCollapseChange,this._onDidDestroy)}addPanel(e,t){if(this.isDisposed||this._panelIds.includes(e))return;let i=t===void 0?this._panelIds.length:Math.max(0,Math.min(t,this._panelIds.length));this._panelIds.splice(i,0,e),this._onDidPanelChange.fire({panelId:e,type:"add"})}removePanel(e){if(this.isDisposed)return!1;let t=this._panelIds.indexOf(e);return t===-1?!1:(this._panelIds.splice(t,1),this._onDidPanelChange.fire({panelId:e,type:"remove"}),!0)}indexOfPanel(e){return this._panelIds.indexOf(e)}containsPanel(e){return this._panelIds.includes(e)}collapse(){this.isDisposed||this._collapsed||(this._collapsed=!0,this._onDidCollapseChange.fire(!0))}expand(){this.isDisposed||!this._collapsed||(this._collapsed=!1,this._onDidCollapseChange.fire(!1))}toggle(){this._collapsed?this.expand():this.collapse()}toJSON(){let e={id:this.id,collapsed:this._collapsed,panelIds:[...this._panelIds]};return this._label&&(e.label=this._label),this._color!==void 0&&(e.color=this._color),this._componentParams!==void 0&&(e.componentParams=this._componentParams),e}dispose(){this._onDidDestroy.fire(),super.dispose()}},bi=class extends J{get nativeEvent(){return this.options.nativeEvent}get position(){return this.options.position}get panel(){return this.options.panel}get group(){return this.options.group}get api(){return this.options.api}constructor(e){super(),this.options=e}getData(){return this.options.getData()}},Pn=class extends bi{get kind(){return this._kind}constructor(e){super(e),this._kind=e.kind}},ur=class extends C{get tabGroups(){return this._tabGroups}get element(){throw new Error("dockview: not supported")}get activePanel(){return this._activePanel}get contentContainerId(){return this.contentContainer.element.id}get contentDropTarget(){return this.contentContainer.dropTarget}get locked(){return this._locked}set locked(e){this._locked=e,A(this.container,"dv-locked-groupview",e==="no-drop-target"||e)}get isActive(){return this._isGroupActive}get panels(){return this._panels}get size(){return this._panels.length}get isEmpty(){return this._panels.length===0}get hasWatermark(){return!!(this.watermark&&this.container.contains(this.watermark.element))}get header(){return this.tabsContainer}get tabsListElement(){return this.tabsContainer.tabsListElement}getPanelForTab(e){return this.tabsContainer.getPanelForTab(e)}get isContentFocused(){let e=this.contentContainer.element,t=oi(e);return t?et(t,e):!1}get headerPosition(){var e;return(e=this._headerPosition)!==null&&e!==void 0?e:"top"}set headerPosition(e){this._headerPosition=e,this.invalidateHeaderSize(),be(this.container,"dv-groupview-header-top","dv-groupview-header-bottom","dv-groupview-header-left","dv-groupview-header-right"),fe(this.container,`dv-groupview-header-${e}`);let t=e==="top"||e==="bottom"?"horizontal":"vertical",i=this._headerDirection;if(this._headerDirection=t,this.tabsContainer.direction=t,this.header.direction=t,this.panels.length>0&&this.layoutContent(),this.updateHeaderActions(),i!==void 0&&i!==t){var n;(n=this.groupPanel)===null||n===void 0||n.api._onDidHeaderDirectionChange.fire({direction:t,position:e})}}get location(){return this._location}set location(e){this._location=e,A(this.container,"dv-groupview-floating",!1),A(this.container,"dv-groupview-popout",!1),A(this.container,"dv-groupview-edge",!1);let t=i=>{this.contentContainer.dropTarget.setTargetZones(i),this.contentContainer.pointerDropTarget.setTargetZones(i)};switch(e.type){case"grid":t(["top","bottom","left","right","center"]);break;case"floating":t(["top","bottom","left","right","center"]),A(this.container,"dv-groupview-floating",!0);break;case"popout":t(["top","bottom","left","right","center"]),A(this.container,"dv-groupview-popout",!0);break;case"edge":t(["center"]),A(this.container,"dv-groupview-edge",!0);break}this.groupPanel.api._onDidLocationChange.fire({location:this.location})}constructor(e,t,i,n,o){var a,d;super(),this.container=e,this.accessor=t,this.id=i,this.options=n,this.groupPanel=o,this._isGroupActive=!1,this._locked=!1,this._location={type:"grid"},this.mostRecentlyUsed=[],this._overwriteRenderContainer=null,this._overwriteDropTargetContainer=null,this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this._width=0,this._height=0,this._panels=[],this._panelDisposables=new Map,this._tabGroupDisposables=new Map,this._pendingMicrotaskDisposables=new Set,this._onMove=new k,this.onMove=this._onMove.event,this._onDidDrop=new k,this.onDidDrop=this._onDidDrop.event,this._onWillDrop=new k,this.onWillDrop=this._onWillDrop.event,this._onWillShowOverlay=new k,this.onWillShowOverlay=this._onWillShowOverlay.event,this._onTabDragStart=new k,this.onTabDragStart=this._onTabDragStart.event,this._onGroupDragStart=new k,this.onGroupDragStart=this._onGroupDragStart.event,this._onDidAddPanel=new k,this.onDidAddPanel=this._onDidAddPanel.event,this._onDidPanelTitleChange=new k,this.onDidPanelTitleChange=this._onDidPanelTitleChange.event,this._onDidPanelParametersChange=new k,this.onDidPanelParametersChange=this._onDidPanelParametersChange.event,this._onDidRemovePanel=new k,this.onDidRemovePanel=this._onDidRemovePanel.event,this._onDidActivePanelChange=new k,this.onDidActivePanelChange=this._onDidActivePanelChange.event,this._onUnhandledDragOver=new k,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this._tabGroups=[],this._tabGroupMap=new Map,this._panelToTabGroup=new Map,this._tabGroupIdCounter=0,this._pendingTabGroupUpdate=!1,this._onDidCreateTabGroup=new k,this.onDidCreateTabGroup=this._onDidCreateTabGroup.event,this._onDidDestroyTabGroup=new k,this.onDidDestroyTabGroup=this._onDidDestroyTabGroup.event,this._onDidAddPanelToTabGroup=new k,this.onDidAddPanelToTabGroup=this._onDidAddPanelToTabGroup.event,this._onDidRemovePanelFromTabGroup=new k,this.onDidRemovePanelFromTabGroup=this._onDidRemovePanelFromTabGroup.event,this._onDidTabGroupChange=new k,this.onDidTabGroupChange=this._onDidTabGroupChange.event,this._onDidTabGroupCollapsedChange=new k,this.onDidTabGroupCollapsedChange=this._onDidTabGroupCollapsedChange.event,A(this.container,"dv-groupview",!0),this.container.setAttribute("role","region"),this._api=new li(this.accessor),this.tabsContainer=new Jd(this.accessor,this.groupPanel),this.contentContainer=new Ko(this.accessor,this),e.append(this.tabsContainer.element,this.contentContainer.element),this.header.hidden=!!n.hideHeader,this.locked=(a=n.locked)!==null&&a!==void 0?a:!1,this.headerPosition=(d=n.headerPosition)!==null&&d!==void 0?d:t.defaultHeaderPosition,this.addDisposables(Ye(this.tabsContainer.element,()=>{if(this.isDisposed)return;let l=this.measureHeaderSize();l!==this._cachedHeaderSize&&(this._cachedHeaderSize=l,this.layout(this._width,this._height))}),this._onDidPanelTitleChange.event(()=>this.updateAccessibleLabel()),this._onTabDragStart,this._onGroupDragStart,this._onWillShowOverlay,this.tabsContainer.onTabDragStart(l=>{this._onTabDragStart.fire(l)}),this.tabsContainer.onGroupDragStart(l=>{this._onGroupDragStart.fire(l)}),this.tabsContainer.onDrop(l=>{var u;let v=b(),g=(u=v?.panelId)!==null&&u!==void 0?u:null,f=g?this.tabsContainer.resolveDropIndex(g,l.index):l.index;if(this.handleDropEvent("header",l.event,"center",f),g&&l.targetTabGroupId){let _=this._tabGroupMap.get(l.targetTabGroupId),w;if(_){let y=this._panels.findIndex(D=>D.id===g);if(y!==-1){w=0;for(let D of _.panelIds)this._panels.findIndex(G=>G.id===D)<y&&w++}}this.addPanelToTabGroup(l.targetTabGroupId,g,w)}else g&&l.targetTabGroupId===null&&this.removePanelFromTabGroup(g)}),this.contentContainer.onDidFocus(()=>{this.accessor.doSetGroupActive(this.groupPanel)}),this.contentContainer.onDidBlur(()=>{}),this.contentContainer.dropTarget.onDrop(l=>{this.handleDropEvent("content",l.nativeEvent,l.position,void 0,l.edge)}),this.contentContainer.pointerDropTarget.onDrop(l=>{this.handleDropEvent("content",l.nativeEvent,l.position,void 0,l.edge)}),this.tabsContainer.onWillShowOverlay(l=>{this._onWillShowOverlay.fire(l)}),this.contentContainer.dropTarget.onWillShowOverlay(l=>{this._onWillShowOverlay.fire(new St(l,{kind:"content",panel:this.activePanel,api:this._api,group:this.groupPanel,getData:b}))}),this.contentContainer.pointerDropTarget.onWillShowOverlay(l=>{this._onWillShowOverlay.fire(new St(l,{kind:"content",panel:this.activePanel,api:this._api,group:this.groupPanel,getData:b}))}),this._onMove,this._onDidChange,this._onDidDrop,this._onWillDrop,this._onDidAddPanel,this._onDidRemovePanel,this._onDidActivePanelChange,this._onUnhandledDragOver,this._onDidPanelTitleChange,this._onDidPanelParametersChange,this._onDidCreateTabGroup,this._onDidDestroyTabGroup,this._onDidAddPanelToTabGroup,this._onDidRemovePanelFromTabGroup,this._onDidTabGroupChange,this._onDidTabGroupCollapsedChange,this._onDidCreateTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidDestroyTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidAddPanelToTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidRemovePanelFromTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidTabGroupChange.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidTabGroupCollapsedChange.event(()=>{this._scheduleTabGroupUpdate()}))}_scheduleTabGroupUpdate(){this._pendingTabGroupUpdate||(this._pendingTabGroupUpdate=!0,queueMicrotask(()=>{this._pendingTabGroupUpdate=!1,this.isDisposed||this.tabsContainer.updateTabGroups()}))}_bracketTabGroupMutation(e){return this.accessor.mutation?this.accessor.mutation("tab-group",e):e()}createTabGroup(e){return this._bracketTabGroupMutation(()=>this._doCreateTabGroup(e))}_doCreateTabGroup(e){var t;let i=(t=e?.id)!==null&&t!==void 0?t:`tg-${this.id}-${this._tabGroupIdCounter++}`,n=new qd(i,{label:e?.label,color:e?.color,collapsed:e?.collapsed,componentParams:e?.componentParams});return this._tabGroups.push(n),this._tabGroupMap.set(i,n),this._tabGroupDisposables.set(i,new C(n.onDidChange(()=>{this._onDidTabGroupChange.fire({tabGroup:n})}),n.onDidCollapseChange(o=>{o?this._handleGroupCollapse(n):this._handleGroupExpand(n),this._onDidTabGroupCollapsedChange.fire({tabGroup:n})}),n.onDidDestroy(()=>{this._removeTabGroupInternal(n)}))),this._onDidCreateTabGroup.fire({tabGroup:n}),n}dissolveTabGroup(e){let t=this._tabGroupMap.get(e);t&&this._bracketTabGroupMutation(()=>{let i=[...t.panelIds];for(let n of i)t.removePanel(n),this._panelToTabGroup.delete(n),this._onDidRemovePanelFromTabGroup.fire({tabGroup:t,panelId:n});t.dispose()})}addPanelToTabGroup(e,t,i){let n=this._tabGroupMap.get(e);if(!n||!this._panels.some(a=>a.id===t))return;let o=this.getTabGroupForPanel(t);o?.id!==e&&this._bracketTabGroupMutation(()=>{o&&this.removePanelFromTabGroup(t),n.addPanel(t,i),this._panelToTabGroup.set(t,n),this._enforceContiguity(n,t),this._onDidAddPanelToTabGroup.fire({tabGroup:n,panelId:t})})}movePanelWithinGroup(e,t,i){let n=this._tabGroupMap.get(e);n?.containsPanel(t)&&(n.removePanel(t),n.addPanel(t,i),this._enforceContiguity(n,t),this.tabsContainer.updateTabGroups())}movePanelBetweenGroups(e,t,i){let n=this._findTabGroupForPanel(e),o=this._tabGroupMap.get(t);o&&(n&&(n.removePanel(e),this._panelToTabGroup.delete(e),this._onDidRemovePanelFromTabGroup.fire({tabGroup:n,panelId:e}),n.isEmpty&&n.dispose()),o.addPanel(e,i),this._panelToTabGroup.set(e,o),this._enforceContiguity(o,e),this._onDidAddPanelToTabGroup.fire({tabGroup:o,panelId:e}))}moveTabGroup(e,t){let i=this._tabGroupMap.get(e);if(!i||i.panelIds.length===0)return;let n=new Set(i.panelIds),o=i.panelIds.map(u=>this._panels.find(v=>v.id===u)).filter(u=>u!==void 0);if(o.length===0)return;let a=0;for(let u=0;u<Math.min(t,this._panels.length);u++)n.has(this._panels[u].id)&&a++;for(let u of o){let v=this._panels.indexOf(u);v!==-1&&this._panels.splice(v,1)}let d=t-a,l=Math.max(0,Math.min(d,this._panels.length));this._panels.splice(l,0,...o);for(let u of this._panels)this.tabsContainer.delete(u.id);for(let u=0;u<this._panels.length;u++)this.tabsContainer.openPanel(this._panels[u],u);this.tabsContainer.updateTabGroups()}_enforceContiguity(e,t){let i=this._panels.find(l=>l.id===t);if(!i)return;let n=e.indexOfPanel(t),o=this._computeGlobalIndex(e,n),a=this._panels.indexOf(i);if(a===o)return;this._panels.splice(a,1);let d=o>a?o-1:o;this._panels.splice(d,0,i),this.tabsContainer.delete(t),this.tabsContainer.openPanel(i,d)}_computeGlobalIndex(e,t){let i=e.panelIds;if(i.length<=1){let n=this._panels.find(o=>o.id===i[0]);return n?this._panels.indexOf(n):this._panels.length}for(let n=0;n<i.length;n++){if(n===t)continue;let o=this._panels.find(a=>a.id===i[n]);if(o){let a=this._panels.indexOf(o);return Math.max(0,a+(t-n))}}return this._panels.length}removePanelFromTabGroup(e){let t=this._findTabGroupForPanel(e);t&&this._bracketTabGroupMutation(()=>{t.removePanel(e),this._panelToTabGroup.delete(e),this._onDidRemovePanelFromTabGroup.fire({tabGroup:t,panelId:e}),t.isEmpty&&t.dispose()})}getTabGroups(){return this._tabGroups}updateTabGroups(){this.tabsContainer.updateTabGroups()}refreshTabGroupAccent(){this.tabsContainer.refreshTabGroupAccent()}refreshWatermark(){if(this.watermark){var e,t;this.watermark.element.remove(),(e=(t=this.watermark).dispose)===null||e===void 0||e.call(t),this.watermark=void 0}this.updateContainer()}getTabGroupForPanel(e){return this._findTabGroupForPanel(e)}_findTabGroupForPanel(e){return this._panelToTabGroup.get(e)}_removeTabGroupInternal(e){let t=this._tabGroups.indexOf(e);if(t!==-1){this._tabGroups.splice(t,1),this._tabGroupMap.delete(e.id);for(let n of e.panelIds)this._panelToTabGroup.delete(n);this._onDidDestroyTabGroup.fire({tabGroup:e});let i=this._tabGroupDisposables.get(e.id);this._tabGroupDisposables.delete(e.id),i&&(this._pendingMicrotaskDisposables.add(i),queueMicrotask(()=>{this._pendingMicrotaskDisposables.delete(i),i.dispose()}))}}_handleGroupCollapse(e){if(!this._activePanel||!e.containsPanel(this._activePanel.id))return;let t=this._panels.indexOf(this._activePanel);for(let i=t+1;i<this._panels.length;i++){let n=this._panels[i],o=this._findTabGroupForPanel(n.id);if(!o?.collapsed){this.doSetActivePanel(n),this.updateContainer();return}}for(let i=t-1;i>=0;i--){let n=this._panels[i],o=this._findTabGroupForPanel(n.id);if(!o?.collapsed){this.doSetActivePanel(n),this.updateContainer();return}}this.contentContainer.closePanel(),this.doSetActivePanel(void 0),this.updateContainer()}_handleGroupExpand(e){if(this._activePanel)return;let t=e.panelIds[0];if(t){let i=this._panels.find(n=>n.id===t);i&&(this.doSetActivePanel(i),this.updateContainer())}}restoreTabGroups(e){for(let t of e){let i=/-(\d+)$/.exec(t.id);if(i){let n=Number.parseInt(i[1],10)+1;n>this._tabGroupIdCounter&&(this._tabGroupIdCounter=n)}}for(let t of e){let i=this.createTabGroup({id:t.id,label:t.label,color:t.color,componentParams:t.componentParams}),n=this._tabGroupMap.get(i.id);for(let o of t.panelIds)this._panels.some(a=>a.id===o)&&(i.addPanel(o),this._panelToTabGroup.set(o,n),this._enforceContiguity(n,o));t.collapsed&&i.collapse(),i.isEmpty&&i.dispose()}}focusContent(){this.contentContainer.element.focus()}focusActiveTab(){this.tabsContainer.focusActiveTab()}set renderContainer(e){this.panels.forEach(t=>{this.renderContainer.detatch(t)}),this._overwriteRenderContainer=e,this.panels.forEach(t=>{this.rerender(t)}),this.panels.length>0&&this.layoutContent()}get renderContainer(){var e;return(e=this._overwriteRenderContainer)!==null&&e!==void 0?e:this.accessor.overlayRenderContainer}set dropTargetContainer(e){this._overwriteDropTargetContainer=e}get dropTargetContainer(){var e;return this._location.type==="floating"&&this.accessor.rootDropTargetContainer.disabled?this.accessor.floatingDropTargetContainer:(e=this._overwriteDropTargetContainer)!==null&&e!==void 0?e:this.accessor.rootDropTargetContainer}initialize(){this.options.panels&&this.options.panels.forEach(e=>{this.doAddPanel(e)}),this.options.activePanel&&this.openPanel(this.options.activePanel),this.setActive(this.isActive,!0),this.updateContainer(),this.updateHeaderActions()}updateHeaderActions(){var e;(e=this.accessor.headerActionsService)===null||e===void 0||e.refresh(this.groupPanel)}attachHeaderAction(e,t){switch(e){case"left":this.tabsContainer.setLeftActionsElement(t);break;case"right":this.tabsContainer.setRightActionsElement(t);break;case"prefix":this.tabsContainer.setPrefixActionsElement(t);break}}rerender(e){this.contentContainer.renderPanel(e,{asActive:!1})}indexOf(e){return this.tabsContainer.indexOf(e.id)}toJSON(){var e;let t={views:this.tabsContainer.panels,activeView:(e=this._activePanel)===null||e===void 0?void 0:e.id,id:this.id};return this.locked!==!1&&(t.locked=this.locked),this.header.hidden&&(t.hideHeader=!0),this.headerPosition!=="top"&&(t.headerPosition=this.headerPosition),this._tabGroups.length>0&&(t.tabGroups=this._tabGroups.map(i=>i.toJSON())),t}moveToNext(e){var t,i,n;(t=e)!==null&&t!==void 0||(e={}),(n=(i=e).panel)!==null&&n!==void 0||(i.panel=this.activePanel);let o=e.panel?this.panels.indexOf(e.panel):-1,a;if(o<this.panels.length-1)a=o+1;else{if(e.suppressRoll)return;a=0}this.openPanel(this.panels[a])}moveToPrevious(e){var t,i,n;if((t=e)!==null&&t!==void 0||(e={}),(n=(i=e).panel)!==null&&n!==void 0||(i.panel=this.activePanel),!e.panel)return;let o=this.panels.indexOf(e.panel),a;if(o>0)a=o-1;else{if(e.suppressRoll)return;a=this.panels.length-1}this.openPanel(this.panels[a])}containsPanel(e){return this.panels.includes(e)}init(e){}update(e){}focus(){var e;(e=this._activePanel)===null||e===void 0||e.focus()}openPanel(e,t={}){(typeof t.index!="number"||t.index>this.panels.length)&&(t.index=this.panels.length);let i=!!t.skipSetActive;if(e.updateParentGroup(this.groupPanel,{skipSetActive:t.skipSetActive}),this.doAddPanel(e,t.index,{skipSetActive:i}),this.invalidateHeaderSize(),this._activePanel===e){this.contentContainer.renderPanel(e,{asActive:!0});return}i||this.doSetActivePanel(e),t.skipSetGroupActive||this.accessor.doSetGroupActive(this.groupPanel),t.skipSetActive||this.updateContainer()}removePanel(e,t){let i=typeof e=="string"?e:e.id,n=this._panels.find(o=>o.id===i);if(!n)throw new Error("invalid operation");return this._removePanel(n,t)}closeAllPanels(){if(this.panels.length>0){let e=[...this.panels];for(let t of e)this.doClose(t)}else this.accessor.removeGroup(this.groupPanel)}closePanel(e){this.doClose(e)}doClose(e){let t=this.panels.length===1&&this.accessor.groups.length===1;this.accessor.removePanel(e,t&&this.accessor.options.noPanelsOverlay==="emptyGroup"?{removeEmptyGroup:!1}:void 0)}isPanelActive(e){return this._activePanel===e}updateActions(e){this.tabsContainer.setRightActionsElement(e)}setActive(e,t=!1){if(!this.isDisposed&&!(!t&&this.isActive===e)){if(this._isGroupActive=e,A(this.container,"dv-active-group",e),A(this.container,"dv-inactive-group",!e),this.tabsContainer.setActive(this.isActive),!this._activePanel&&this.panels.length>0){let i=this._panels.find(n=>{let o=this._findTabGroupForPanel(n.id);return!o?.collapsed});i&&this.doSetActivePanel(i)}this.updateContainer()}}layout(e,t){this._width=e,this._height=t,this.layoutContent()}layoutContent(){var e;let{width:t,height:i}=this.contentDimensions();this.contentContainer.layout(t,i),!((e=this._activePanel)===null||e===void 0)&&e.layout&&this._activePanel.layout(t,i)}relayout(){this.invalidateHeaderSize(),this.layout(this._width,this._height)}measureHeaderSize(){let e=this.tabsContainer.element;return this.headerPosition==="top"||this.headerPosition==="bottom"?e.offsetHeight:e.offsetWidth}invalidateHeaderSize(){this._cachedHeaderSize=void 0}contentDimensions(){var e;let t=this.headerPosition==="top"||this.headerPosition==="bottom",i=(e=this._cachedHeaderSize)!==null&&e!==void 0?e:this._cachedHeaderSize=this.measureHeaderSize();return{width:t?this._width:Math.max(0,this._width-i),height:t?Math.max(0,this._height-i):this._height}}_removePanel(e,t){let i=this._activePanel===e;if(this.doRemovePanel(e),this.invalidateHeaderSize(),i&&this.panels.length>0){let n=this.mostRecentlyUsed[0];this.openPanel(n,{skipSetActive:t?.skipSetActive,skipSetGroupActive:t?.skipSetActiveGroup})}return this._activePanel&&this.panels.length===0&&this.doSetActivePanel(void 0),t?.skipSetActive||this.updateContainer(),e}doRemovePanel(e){let t=this.panels.indexOf(e);if(this._activePanel===e&&this.contentContainer.closePanel(),this.tabsContainer.delete(e.id),this._panels.splice(t,1),this.mostRecentlyUsed.includes(e)){let n=this.mostRecentlyUsed.indexOf(e);this.mostRecentlyUsed.splice(n,1)}let i=this._panelDisposables.get(e.id);i&&(i.dispose(),this._panelDisposables.delete(e.id)),this.removePanelFromTabGroup(e.id),this._onDidRemovePanel.fire({panel:e})}doAddPanel(e,t=this.panels.length,i){let n=this._panels.indexOf(e)>-1;this.tabsContainer.show(),this.contentContainer.show(),this.tabsContainer.openPanel(e,t),i?.skipSetActive?e.api.renderer==="always"&&this.contentContainer.renderPanel(e,{asActive:!1}):this.contentContainer.openPanel(e),!n&&(this.updateMru(e),this.panels.splice(t,0,e),this._panelDisposables.set(e.id,new C(e.api.onDidTitleChange(o=>this._onDidPanelTitleChange.fire(o)),e.api.onDidParametersChange(o=>this._onDidPanelParametersChange.fire(o)))),this._onDidAddPanel.fire({panel:e}))}doSetActivePanel(e){if(this._activePanel!==e){if(this._activePanel=e,e){var t,i,n;this.tabsContainer.setActivePanel(e),this.contentContainer.setLabelledBy(this.tabsContainer.getTabId(e.id)),this.contentContainer.openPanel(e),this.layoutContent(),this.updateMru(e),this.contentContainer.refreshFocusState(),this._onDidActivePanelChange.fire({panel:e,origin:(t=(i=(n=this.accessor).currentOrigin)===null||i===void 0?void 0:i.call(n))!==null&&t!==void 0?t:"user"})}this.updateAccessibleLabel()}}updateAccessibleLabel(){var e;let t=(e=this._activePanel)===null||e===void 0?void 0:e.title;t?this.container.setAttribute("aria-label",t):this.container.removeAttribute("aria-label")}updateMru(e){this.mostRecentlyUsed.includes(e)&&this.mostRecentlyUsed.splice(this.mostRecentlyUsed.indexOf(e),1),this.mostRecentlyUsed=[e,...this.mostRecentlyUsed]}updateContainer(){this.panels.forEach(n=>n.runEvents());let e=this.isEmpty||!this._activePanel;if(e&&!this.watermark){let n=this.accessor.createWatermarkComponent();n.init({containerApi:this._api,group:this.groupPanel}),this.watermark=n,M(this.watermark.element,"pointerdown",()=>{this.isActive||this.accessor.doSetGroupActive(this.groupPanel)}),this.contentContainer.element.appendChild(this.watermark.element)}if(!e&&this.watermark){var t,i;this.watermark.element.remove(),(t=(i=this.watermark).dispose)===null||t===void 0||t.call(i),this.watermark=void 0}}canDisplayOverlay(e,t,i){let n=new kn(e,i,t,b,this.accessor.getPanel(this.id));return this._onUnhandledDragOver.fire(n),n.isAccepted}canDisplayContentOverlay(e,t){if(this.locked==="no-drop-target"||this.locked&&t==="center")return!1;let i=b();return!i&&e.shiftKey&&this.location.type!=="floating"?!1:i?.viewId===this.accessor.id?!0:this.canDisplayOverlay(e,t,"content")}handleDropEvent(e,t,i,n,o){if(this.locked==="no-drop-target")return;if(e==="content"&&o){this.accessor.dockToLayoutEdge(t,i);return}function a(){switch(e){case"header":return typeof n=="number"?"tab":"header_space";case"content":return"content"}}let d=typeof n=="number"?this.panels[n]:void 0,l=new Pn({nativeEvent:t,position:i,panel:d,getData:()=>b(),kind:a(),group:this.groupPanel,api:this._api});if(this._onWillDrop.fire(l),l.defaultPrevented)return;let u=b();if(u?.viewId===this.accessor.id){if(e==="content"&&u.groupId===this.id&&(i==="center"||u.panelId===null&&!u.tabGroupId)||e==="header"&&u.groupId===this.id&&u.panelId===null&&!u.tabGroupId)return;if(u.panelId===null){let{groupId:f}=u;this._onMove.fire({target:i,groupId:f,index:n,tabGroupId:u.tabGroupId});return}if(this.tabsContainer.indexOf(u.panelId)!==-1&&this.tabsContainer.size===1&&this.accessor.options.closeEmptyGroups!==!1)return;let{groupId:v,panelId:g}=u;if(this.id===v&&!i&&this.tabsContainer.indexOf(g)===n)return;this._onMove.fire({target:i,groupId:u.groupId,itemId:u.panelId,index:n})}else this._onDidDrop.fire(new bi({nativeEvent:t,position:i,panel:d,getData:()=>b(),group:this.groupPanel,api:this._api}))}updateDragAndDropState(){this.tabsContainer.updateDragAndDropState()}dispose(){var e,t,i;super.dispose(),(e=this.watermark)===null||e===void 0||e.element.remove(),(t=this.watermark)===null||t===void 0||(i=t.dispose)===null||i===void 0||i.call(t),this.watermark=void 0;for(let n of[...this._tabGroups])n.dispose();for(let n of this._tabGroupDisposables.values())n.dispose();this._tabGroupDisposables.clear();for(let n of this._pendingMicrotaskDisposables)n.dispose();this._pendingMicrotaskDisposables.clear();for(let n of this.panels)n.dispose();this.tabsContainer.dispose(),this.contentContainer.dispose()}},zn=class extends Yo{constructor(e,t,i){super(e,t),this._onDidConstraintsChangeInternal=new k,this.onDidConstraintsChangeInternal=this._onDidConstraintsChangeInternal.event,this._onDidConstraintsChange=new k,this.onDidConstraintsChange=this._onDidConstraintsChange.event,this._onDidSizeChange=new k,this.onDidSizeChange=this._onDidSizeChange.event,this.addDisposables(this._onDidConstraintsChangeInternal,this._onDidConstraintsChange,this._onDidSizeChange),i&&this.initialize(i)}setConstraints(e){this._onDidConstraintsChangeInternal.fire(e)}setSize(e){this._onDidSizeChange.fire(e)}},pr=class extends yn{get priority(){return this._priority}get snap(){return this._snap}get minimumWidth(){return this.__minimumWidth()}get minimumHeight(){return this.__minimumHeight()}get maximumHeight(){return this.__maximumHeight()}get maximumWidth(){return this.__maximumWidth()}__minimumWidth(){let e=typeof this._minimumWidth=="function"?this._minimumWidth():this._minimumWidth;return e!==this._evaluatedMinimumWidth&&(this._evaluatedMinimumWidth=e,this.updateConstraints()),e}__maximumWidth(){let e=typeof this._maximumWidth=="function"?this._maximumWidth():this._maximumWidth;return e!==this._evaluatedMaximumWidth&&(this._evaluatedMaximumWidth=e,this.updateConstraints()),e}__minimumHeight(){let e=typeof this._minimumHeight=="function"?this._minimumHeight():this._minimumHeight;return e!==this._evaluatedMinimumHeight&&(this._evaluatedMinimumHeight=e,this.updateConstraints()),e}__maximumHeight(){let e=typeof this._maximumHeight=="function"?this._maximumHeight():this._maximumHeight;return e!==this._evaluatedMaximumHeight&&(this._evaluatedMaximumHeight=e,this.updateConstraints()),e}get isActive(){return this.api.isActive}get isVisible(){return this.api.isVisible}constructor(e,t,i,n){super(e,t,n??new zn(e,t)),this._evaluatedMinimumWidth=0,this._evaluatedMaximumWidth=Number.MAX_SAFE_INTEGER,this._evaluatedMinimumHeight=0,this._evaluatedMaximumHeight=Number.MAX_SAFE_INTEGER,this._minimumWidth=0,this._minimumHeight=0,this._maximumWidth=Number.MAX_SAFE_INTEGER,this._maximumHeight=Number.MAX_SAFE_INTEGER,this._snap=!1,this._onDidChange=new k,this.onDidChange=this._onDidChange.event,typeof i?.minimumWidth=="number"&&(this._minimumWidth=i.minimumWidth),typeof i?.maximumWidth=="number"&&(this._maximumWidth=i.maximumWidth),typeof i?.minimumHeight=="number"&&(this._minimumHeight=i.minimumHeight),typeof i?.maximumHeight=="number"&&(this._maximumHeight=i.maximumHeight),this.api.initialize(this),this.addDisposables(this.api.onWillVisibilityChange(o=>{let{isVisible:a}=o,{accessor:d}=this._params;d.setVisible(this,a)}),this.api.onActiveChange(()=>{let{accessor:o}=this._params;o.doSetGroupActive(this)}),this.api.onDidConstraintsChangeInternal(o=>{(typeof o.minimumWidth=="number"||typeof o.minimumWidth=="function")&&(this._minimumWidth=o.minimumWidth),(typeof o.minimumHeight=="number"||typeof o.minimumHeight=="function")&&(this._minimumHeight=o.minimumHeight),(typeof o.maximumWidth=="number"||typeof o.maximumWidth=="function")&&(this._maximumWidth=o.maximumWidth),(typeof o.maximumHeight=="number"||typeof o.maximumHeight=="function")&&(this._maximumHeight=o.maximumHeight),this._onDidChange.fire(void 0)}),this.api.onDidSizeChange(o=>{this._onDidChange.fire({height:o.height,width:o.width})}),this._onDidChange)}setVisible(e){this.api._onDidVisibilityChange.fire({isVisible:e})}setActive(e){this.api._onDidActiveChange.fire({isActive:e})}init(e){e.maximumHeight&&(this._maximumHeight=e.maximumHeight),e.minimumHeight&&(this._minimumHeight=e.minimumHeight),e.maximumWidth&&(this._maximumWidth=e.maximumWidth),e.minimumWidth&&(this._minimumWidth=e.minimumWidth),this._priority=e.priority,this._snap=!!e.snap,super.init(e),typeof e.isVisible=="boolean"&&this.setVisible(e.isVisible)}updateConstraints(){this.api._onDidConstraintsChange.fire({minimumWidth:this._evaluatedMinimumWidth,maximumWidth:this._evaluatedMaximumWidth,minimumHeight:this._evaluatedMinimumHeight,maximumHeight:this._evaluatedMaximumHeight})}toJSON(){let e=super.toJSON(),t=n=>n===Number.MAX_SAFE_INTEGER?void 0:n,i=n=>n<=0?void 0:n;return N(N({},e),{},{minimumHeight:i(this.minimumHeight),maximumHeight:t(this.maximumHeight),minimumWidth:i(this.minimumWidth),maximumWidth:t(this.maximumWidth),snap:this.snap,priority:this.priority})}};let qe="dockview: DockviewGroupPanelApiImpl not initialized";var Kd=class extends zn{get location(){if(!this._group)throw new Error(qe);return this._group.model.location}get boundingBox(){if(!this._group||this._group.model.location.type==="popout")return;let e=this.accessor.element.getBoundingClientRect(),t=this._group.element.getBoundingClientRect();return{left:t.left-e.left,top:t.top-e.top,width:t.width,height:t.height}}get locked(){if(!this._group)throw new Error(qe);return this._group.locked}set locked(e){if(!this._group)throw new Error(qe);this._group.locked=e}constructor(e,t){super(e,"__dockviewgroup__"),this.accessor=t,this._isApplyingSize=!1,this._onDidLocationChange=new k,this.onDidLocationChange=this._onDidLocationChange.event,this._onDidActivePanelChange=new k,this.onDidActivePanelChange=this._onDidActivePanelChange.event,this._onDidCollapsedChange=new k,this.onDidCollapsedChange=this._onDidCollapsedChange.event,this._onDidPeekChange=new k,this.onDidPeekChange=this._onDidPeekChange.event,this._onDidHeaderDirectionChange=new k,this.onDidHeaderDirectionChange=this._onDidHeaderDirectionChange.event,this.addDisposables(this._onDidLocationChange,this._onDidActivePanelChange,this._onDidCollapsedChange,this._onDidPeekChange,this._onDidHeaderDirectionChange,this._onDidVisibilityChange.event(i=>{if(i.isVisible&&this._pendingSize){let n=this._pendingSize;this._pendingSize=void 0,super.setSize(n)}}),this.onDidDimensionsChange(i=>{var n,o;let a=i.width!==((n=this._reportedSize)===null||n===void 0?void 0:n.width)||i.height!==((o=this._reportedSize)===null||o===void 0?void 0:o.height);this._reportedSize={width:i.width,height:i.height},a&&this.isVisible&&!this._isApplyingSize&&(this._pendingSize=void 0)}))}setSize(e){(typeof e.width=="number"||typeof e.height=="number")&&(this._pendingSize=N({},e));let t=this._isApplyingSize;this._isApplyingSize=!0;try{super.setSize(e)}finally{this._isApplyingSize=t}}close(){if(this._group)return this.accessor.removeGroup(this._group)}getWindow(){return this.location.type==="popout"?this.location.getWindow():globalThis.window}setHeaderPosition(e){if(!this._group)throw new Error(qe);this._group.model.headerPosition=e}getHeaderPosition(){if(!this._group)throw new Error(qe);return this._group.model.headerPosition}moveTo(e){if(!this._group)throw new Error(qe);this.accessor.withOrigin("api",()=>{var t,i,n,o;let a=(t=e.group)!==null&&t!==void 0?t:this.accessor.addGroup({direction:Wo((i=e.position)!==null&&i!==void 0?i:"right"),skipSetActive:(n=e.skipSetActive)!==null&&n!==void 0?n:!1});this.accessor.moveGroupOrPanel({from:{groupId:this._group.id},to:{group:a,position:e.group&&(o=e.position)!==null&&o!==void 0?o:"center",index:e.index},skipSetActive:e.skipSetActive})})}maximize(){if(!this._group)throw new Error(qe);this.location.type==="grid"&&this.accessor.maximizeGroup(this._group)}isMaximized(){if(!this._group)throw new Error(qe);return this.accessor.isMaximizedGroup(this._group)}exitMaximized(){if(!this._group)throw new Error(qe);this.isMaximized()&&this.accessor.exitMaximizedGroup()}collapse(){this._group&&this.accessor.setEdgeGroupCollapsed(this._group,!0)}expand(){this._group&&this.accessor.setEdgeGroupCollapsed(this._group,!1)}isCollapsed(){return this._group?this.accessor.isEdgeGroupCollapsed(this._group):!1}isPeeking(){return this._group?this.accessor.isEdgeGroupPeeking(this._group):!1}setAutoHide(e){this._group&&this.accessor.setEdgeGroupAutoHide(this._group,e)}isAutoHide(){return this._group?this.accessor.isEdgeGroupAutoHide(this._group):!1}initialize(e){this._group=e}};let Zd=100,jd=100;var Ht=class extends pr{get minimumWidth(){var e;if(typeof this._explicitConstraints.minimumWidth=="number")return this._explicitConstraints.minimumWidth;let t=(e=this.activePanel)===null||e===void 0?void 0:e.minimumWidth;return typeof t=="number"?t:super.__minimumWidth()}get minimumHeight(){var e;if(typeof this._explicitConstraints.minimumHeight=="number")return this._explicitConstraints.minimumHeight;let t=(e=this.activePanel)===null||e===void 0?void 0:e.minimumHeight;return typeof t=="number"?t:super.__minimumHeight()}get maximumWidth(){var e;if(typeof this._explicitConstraints.maximumWidth=="number")return this._explicitConstraints.maximumWidth;let t=(e=this.activePanel)===null||e===void 0?void 0:e.maximumWidth;return typeof t=="number"?t:super.__maximumWidth()}get maximumHeight(){var e;if(typeof this._explicitConstraints.maximumHeight=="number")return this._explicitConstraints.maximumHeight;let t=(e=this.activePanel)===null||e===void 0?void 0:e.maximumHeight;return typeof t=="number"?t:super.__maximumHeight()}get panels(){return this._model.panels}get activePanel(){return this._model.activePanel}get size(){return this._model.size}get model(){return this._model}get locked(){return this._model.locked}set locked(e){this._model.locked=e}get header(){return this._model.header}constructor(e,t,i){var n,o,a,d,l,u;super(t,"groupview_default",{minimumHeight:(n=(o=i.constraints)===null||o===void 0?void 0:o.minimumHeight)!==null&&n!==void 0?n:jd,minimumWidth:(a=(d=i.constraints)===null||d===void 0?void 0:d.minimumWidth)!==null&&a!==void 0?a:Zd,maximumHeight:(l=i.constraints)===null||l===void 0?void 0:l.maximumHeight,maximumWidth:(u=i.constraints)===null||u===void 0?void 0:u.maximumWidth},new Kd(t,e)),this._explicitConstraints={},this.api.initialize(this),this._model=new ur(this.element,e,t,i,this),this.addDisposables(this.model.onDidActivePanelChange(v=>{this.api._onDidActivePanelChange.fire(v)}),this.api.onDidConstraintsChangeInternal(v=>{v.minimumWidth!==void 0&&(this._explicitConstraints.minimumWidth=typeof v.minimumWidth=="function"?v.minimumWidth():v.minimumWidth),v.minimumHeight!==void 0&&(this._explicitConstraints.minimumHeight=typeof v.minimumHeight=="function"?v.minimumHeight():v.minimumHeight),v.maximumWidth!==void 0&&(this._explicitConstraints.maximumWidth=typeof v.maximumWidth=="function"?v.maximumWidth():v.maximumWidth),v.maximumHeight!==void 0&&(this._explicitConstraints.maximumHeight=typeof v.maximumHeight=="function"?v.maximumHeight():v.maximumHeight)}))}focus(){this.api.isActive||this.api.setActive(),super.focus()}initialize(){this._model.initialize()}setActive(e){super.setActive(e),this.model.setActive(e)}layout(e,t){super.layout(e,t),this.model.layout(e,t)}relayout(){this.model.relayout()}getComponent(){return this._model}toJSON(){return this.model.toJSON()}};let Qd={name:"dark",className:"dockview-theme-dark",colorScheme:"dark"},el={name:"light",className:"dockview-theme-light",colorScheme:"light"},tl={name:"visualStudio",className:"dockview-theme-vs",colorScheme:"dark",edgeGroupCollapsedSize:22},vr={name:"abyss",className:"dockview-theme-abyss",colorScheme:"dark",tabGroupIndicator:"none"},il={name:"dracula",className:"dockview-theme-dracula",colorScheme:"dark"},nl={name:"abyssSpaced",className:"dockview-theme-abyss-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},ol={name:"lightSpaced",className:"dockview-theme-light-spaced",colorScheme:"light",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},rl={name:"nord",className:"dockview-theme-nord",colorScheme:"dark"},sl={name:"nordSpaced",className:"dockview-theme-nord-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},al={name:"catppuccinMocha",className:"dockview-theme-catppuccin-mocha",colorScheme:"dark"},dl={name:"catppuccinMochaSpaced",className:"dockview-theme-catppuccin-mocha-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},ll={name:"monokai",className:"dockview-theme-monokai",colorScheme:"dark"},cl={name:"solarizedLight",className:"dockview-theme-solarized-light",colorScheme:"light"},hl={name:"solarizedLightSpaced",className:"dockview-theme-solarized-light-spaced",colorScheme:"light",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},ul={name:"githubDark",className:"dockview-theme-github-dark",colorScheme:"dark"},pl={name:"githubDarkSpaced",className:"dockview-theme-github-dark-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},vl={name:"githubLight",className:"dockview-theme-github-light",colorScheme:"light"},gl={name:"githubLightSpaced",className:"dockview-theme-github-light-spaced",colorScheme:"light",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"};var ml=class extends zn{get location(){return this.group.api.location}get title(){return this.panel.title}get isPinned(){return this.panel.isPinned}get isGroupActive(){return this.group.isActive}get renderer(){return this.panel.renderer}set group(e){let t=this._group;this._group!==e&&(this._group=e,this._onDidGroupChange.fire({}),this.setupGroupEventListeners(t),this.fireLocationChange())}get group(){return this._group}get tabComponent(){return this._tabComponent}constructor(e,t,i,n,o){super(e.id,n),this.panel=e,this.accessor=i,this._onDidTitleChange=new k,this.onDidTitleChange=this._onDidTitleChange.event,this._onDidChangePinned=new k,this.onDidChangePinned=this._onDidChangePinned.event,this._onDidActiveGroupChange=new k,this.onDidActiveGroupChange=this._onDidActiveGroupChange.event,this._onDidGroupChange=new k,this.onDidGroupChange=this._onDidGroupChange.event,this._onDidRendererChange=new k,this.onDidRendererChange=this._onDidRendererChange.event,this._onDidLocationChange=new k,this.onDidLocationChange=this._onDidLocationChange.event,this.groupEventsDisposable=new E,this._tabComponent=o,this.initialize(e),this._group=t,this.setupGroupEventListeners(),this.addDisposables(this.groupEventsDisposable,this._onDidRendererChange,this._onDidTitleChange,this._onDidChangePinned,this._onDidGroupChange,this._onDidActiveGroupChange,this._onDidLocationChange)}getWindow(){return this.group.api.getWindow()}setActive(){this.accessor.withOrigin("api",()=>super.setActive())}moveTo(e){this.accessor.withOrigin("api",()=>{var t,i;return this.accessor.moveGroupOrPanel({from:{groupId:this._group.id,panelId:this.panel.id},to:{group:(t=e.group)!==null&&t!==void 0?t:this._group,position:e.group&&(i=e.position)!==null&&i!==void 0?i:"center",index:e.index},skipSetActive:e.skipSetActive})})}setTitle(e){this.panel.setTitle(e)}setPinned(e){this.accessor.setPanelPinned(this.panel,e)}setRenderer(e){this.panel.setRenderer(e)}close(){this.group.model.closePanel(this.panel)}maximize(){this.group.api.maximize()}isMaximized(){return this.group.api.isMaximized()}exitMaximized(){this.group.api.exitMaximized()}fireLocationChange(){this.accessor.deferLocationChange(this,()=>{this.isDisposed||this._onDidLocationChange.fire({location:this.location})})}setupGroupEventListeners(e){var t;let i=(t=e?.isActive)!==null&&t!==void 0?t:!1;this.groupEventsDisposable.value=new C(this.group.api.onDidVisibilityChange(n=>{let o=!n.isVisible&&this.isVisible,a=n.isVisible&&!this.isVisible,d=this.group.model.isPanelActive(this.panel);(o||a&&d)&&this._onDidVisibilityChange.fire(n)}),this.group.api.onDidLocationChange(()=>{this.group===this.panel.group&&this.fireLocationChange()}),this.group.api.onDidActiveChange(()=>{this.group===this.panel.group&&i!==this.isGroupActive&&(i=this.isGroupActive,this._onDidActiveGroupChange.fire({isActive:this.isGroupActive}))}))}},ct=class extends C{get params(){return this._params}get title(){return this._title}get isPinned(){return this._pinned}get group(){return this._group}get renderer(){var e;return(e=this._renderer)!==null&&e!==void 0?e:this.accessor.renderer}get minimumWidth(){return this._minimumWidth}get minimumHeight(){return this._minimumHeight}get maximumWidth(){return this._maximumWidth}get maximumHeight(){return this._maximumHeight}constructor(e,t,i,n,o,a,d,l){super(),this.id=e,this.accessor=n,this.containerApi=o,this.view=d,this._pinned=!1,this._renderer=l.renderer,this._group=a,this._minimumWidth=l.minimumWidth,this._minimumHeight=l.minimumHeight,this._maximumWidth=l.maximumWidth,this._maximumHeight=l.maximumHeight,this.api=new ml(this,this._group,n,t,i),this.addDisposables(this.api.onActiveChange(()=>{n.setActivePanel(this)}),this.api.onDidSizeChange(u=>{this.group.api.setSize(u)}),this.api.onDidRendererChange(()=>{this.group.model.rerender(this)}))}init(e){this._params=e.params,this.view.init(N(N({},e),{},{api:this.api,containerApi:this.containerApi})),this.setTitle(e.title)}focus(){let e=new Uo;this.api._onWillFocus.fire(e),!e.defaultPrevented&&(this.api.isActive||this.api.setActive())}toJSON(){return{id:this.id,contentComponent:this.view.contentComponent,tabComponent:this.view.tabComponent,params:Object.keys(this._params||{}).length>0?this._params:void 0,title:this.title,renderer:this._renderer,minimumHeight:this._minimumHeight,maximumHeight:this._maximumHeight,minimumWidth:this._minimumWidth,maximumWidth:this._maximumWidth,pinned:this._pinned?!0:void 0}}setTitle(e){e!==this.title&&(this._title=e,this.view.setTitle(e),this.api._onDidTitleChange.fire({title:e}))}setPinned(e){this._pinned!==e&&(this._pinned=e,this.api._onDidChangePinned.fire({isPinned:e}))}setRenderer(e){e!==this.renderer&&(this._renderer=e,this.api._onDidRendererChange.fire({renderer:e}))}update(e){this._params=N(N({},this._params),e.params);for(let t of Object.keys(e.params))e.params[t]===void 0&&delete this._params[t];this.view.update({params:this._params})}updateFromStateModel(e){var t,i,n,o,a;this._maximumHeight=e.maximumHeight,this._minimumHeight=e.minimumHeight,this._maximumWidth=e.maximumWidth,this._minimumWidth=e.minimumWidth,this._params=(t=e.params)!==null&&t!==void 0?t:{},this.view.update({params:this._params}),this.setTitle((i=e.title)!==null&&i!==void 0?i:this.id),this.setRenderer((n=e.renderer)!==null&&n!==void 0?n:this.accessor.renderer),this.setPinned(((o=e.pinned)!==null&&o!==void 0?o:!1)&&!!(!((a=this.accessor.options.pinnedTabs)===null||a===void 0)&&a.enabled))}updateParentGroup(e,t){this._group=e,this.api.group=this._group;let i=this._group.model.isPanelActive(this),n=this.group.api.isActive&&i;t?.skipSetActive||this.api.isActive!==n&&this.api._onDidActiveChange.fire({isActive:this.group.api.isActive&&i}),this.api.isVisible!==i&&this.api._onDidVisibilityChange.fire({isVisible:i})}runEvents(){let e=this._group.model.isPanelActive(this),t=this.group.api.isActive&&e;this.api.isActive!==t&&this.api._onDidActiveChange.fire({isActive:this.group.api.isActive&&e}),this.api.isVisible!==e&&this.api._onDidVisibilityChange.fire({isVisible:e})}layout(e,t){this.api._onDidDimensionChange.fire({width:e,height:t}),this.view.layout(e,t)}dispose(){this.api.dispose(),this.view.dispose()}},Tn=class extends C{get element(){return this._element}constructor(){super(),this._messages=di,this._element=document.createElement("div"),this._element.className="dv-default-tab",this._content=document.createElement("div"),this._content.className="dv-default-tab-content",this.action=document.createElement("div"),this.action.className="dv-default-tab-action",this.action.setAttribute("role","button"),this.action.setAttribute("tabindex","-1");let e=Zo();e.setAttribute("aria-hidden","true"),this.action.appendChild(e),this._element.appendChild(this._content),this._element.appendChild(this.action),this.render()}init(e){var t;this._title=e.title,this._messages=(t=e.containerApi.messages)!==null&&t!==void 0?t:di,this.addDisposables(e.api.onDidTitleChange(i=>{this._title=i.title,this.render()}),M(this.action,"pointerdown",i=>{i.preventDefault()}),M(this.action,"click",i=>{i.defaultPrevented||(i.preventDefault(),e.api.close())})),this.render()}render(){if(this._content.textContent!==this._title){var e;this._content.textContent=(e=this._title)!==null&&e!==void 0?e:""}this.action.setAttribute("aria-label",this._title?this._messages.closeTab(this._title):this._messages.closeTabPlain())}},gr=class{get content(){return this._content}get tab(){return this._tab}constructor(e,t,i,n){this.accessor=e,this.id=t,this.contentComponent=i,this.tabComponent=n,this._content=this.createContentComponent(this.id,i),this._tab=this.createTabComponent(this.id,n)}createTabRenderer(e){let t=this.createTabComponent(this.id,this.tabComponent);if(this._params&&t.init(N(N({},this._params),{},{tabLocation:e})),this._updateEvent){var i;(i=t.update)===null||i===void 0||i.call(t,this._updateEvent)}return t}init(e){this._params=e,this.content.init(e),this.tab.init(N(N({},e),{},{tabLocation:"header"}))}setTitle(e){this._params&&(this._params.title=e)}layout(e,t){var i,n;(i=(n=this.content).layout)===null||i===void 0||i.call(n,e,t)}update(e){var t,i,n,o;this._updateEvent=e,(t=(i=this.content).update)===null||t===void 0||t.call(i,e),(n=(o=this.tab).update)===null||n===void 0||n.call(o,e)}dispose(){var e,t,i,n;(e=(t=this.content).dispose)===null||e===void 0||e.call(t),(i=(n=this.tab).dispose)===null||i===void 0||i.call(n)}createContentComponent(e,t){return this.accessor.options.createComponent({id:e,name:t})}createTabComponent(e,t){let i=t??this.accessor.options.defaultTabComponent;if(i){if(this.accessor.options.createTabComponent){let n=this.accessor.options.createTabComponent({id:e,name:i});return n||new Tn}console.warn(`dockview: tabComponent '${t}' was not found. falling back to the default tab.`)}return new Tn}},mr=class{constructor(e){this.accessor=e}fromJSON(e,t){var i,n,o;let a=e.id,d=e.params,l=e.title,u=e.view,v=u?u.content.id:(i=e.contentComponent)!==null&&i!==void 0?i:"unknown",g=u?(n=u.tab)===null||n===void 0?void 0:n.id:e.tabComponent,f=new gr(this.accessor,a,v,g),_=new ct(a,v,g,this.accessor,new li(this.accessor),t,f,{renderer:e.renderer,minimumWidth:e.minimumWidth,minimumHeight:e.minimumHeight,maximumWidth:e.maximumWidth,maximumHeight:e.maximumHeight});return _.init({title:l??a,params:d??{}}),e.pinned&&(!((o=this.accessor.options.pinnedTabs)===null||o===void 0)&&o.enabled)&&_.setPinned(!0),_}},bl=class extends C{get element(){return this._element}constructor(){super(),this._element=document.createElement("div"),this._element.className="dv-watermark"}init(e){}},fl=class{constructor(){this._orderedList=[]}push(e){this._orderedList=[...this._orderedList.filter(t=>t!==e),e],this.update()}destroy(e){this._orderedList=this._orderedList.filter(t=>t!==e),this.update()}update(){for(let e=0;e<this._orderedList.length;e++)this._orderedList[e].setAttribute("aria-level",`${e}`),this._orderedList[e].style.zIndex=`calc(var(--dv-overlay-z-index, 999) + ${e*2})`}};let fi=new fl;var En=class ft extends C{set minimumInViewportWidth(t){this.options.minimumInViewportWidth=t}set minimumInViewportHeight(t){this.options.minimumInViewportHeight=t}get element(){return this._element}get isVisible(){return this._isVisible}get headerHeight(){var t,i;return(t=(i=this.options.header)===null||i===void 0?void 0:i.offsetHeight)!==null&&t!==void 0?t:0}constructor(t){super(),this.options=t,this._element=document.createElement("div"),this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this._onDidChangeEnd=new k,this.onDidChangeEnd=this._onDidChangeEnd.event,this._onDidStartMoving=new k,this.onDidStartMoving=this._onDidStartMoving.event,this._dragMove=new E,this._dragCancelled=!1,this.addDisposables(this._onDidChange,this._onDidChangeEnd,this._onDidStartMoving,this._dragMove),this._element.className="dv-resize-container",this._element.setAttribute("role","dialog"),this._element.setAttribute("aria-modal","false"),this._isVisible=!0,this.setupResize("top"),this.setupResize("bottom"),this.setupResize("left"),this.setupResize("right"),this.setupResize("topleft"),this.setupResize("topright"),this.setupResize("bottomleft"),this.setupResize("bottomright"),this.options.header&&(A(this._element,"dv-resize-container-with-titlebar",!0),this._element.appendChild(this.options.header)),this._element.appendChild(this.options.content),this.options.container.appendChild(this._element),this.setBounds(N(N(N(N({height:this.options.height,width:this.options.width},"top"in this.options&&{top:this.options.top}),"bottom"in this.options&&{bottom:this.options.bottom}),"left"in this.options&&{left:this.options.left}),"right"in this.options&&{right:this.options.right})),fi.push(this._element)}setVisible(t){t!==this.isVisible&&(this._isVisible=t,A(this.element,"dv-hidden",!this.isVisible))}bringToFront(){fi.push(this._element)}setBounds(t={}){typeof t.height=="number"&&(this._element.style.height=`${t.height}px`),typeof t.width=="number"&&(this._element.style.width=`${t.width}px`),"top"in t&&typeof t.top=="number"&&(this._element.style.top=`${t.top}px`,this._element.style.bottom="auto",this.verticalAlignment="top"),"bottom"in t&&typeof t.bottom=="number"&&(this._element.style.bottom=`${t.bottom}px`,this._element.style.top="auto",this.verticalAlignment="bottom"),"left"in t&&typeof t.left=="number"&&(this._element.style.left=`${t.left}px`,this._element.style.right="auto",this.horiziontalAlignment="left"),"right"in t&&typeof t.right=="number"&&(this._element.style.right=`${t.right}px`,this._element.style.left="auto",this.horiziontalAlignment="right");let i=this.options.container.getBoundingClientRect(),n=this._element.getBoundingClientRect(),o=Math.max(0,this.getMinimumWidth(n.width)),a=Math.max(0,this.getMinimumHeight(n.height));if(this.verticalAlignment==="top"){let d=de(n.top-i.top,-a,Math.max(0,i.height-n.height+a));this._element.style.top=`${d}px`,this._element.style.bottom="auto"}if(this.verticalAlignment==="bottom"){let d=de(i.bottom-n.bottom,-a,Math.max(0,i.height-n.height+a));this._element.style.bottom=`${d}px`,this._element.style.top="auto"}if(this.horiziontalAlignment==="left"){let d=de(n.left-i.left,-o,Math.max(0,i.width-n.width+o));this._element.style.left=`${d}px`,this._element.style.right="auto"}if(this.horiziontalAlignment==="right"){let d=de(i.right-n.right,-o,Math.max(0,i.width-n.width+o));this._element.style.right=`${d}px`,this._element.style.left="auto"}this._onDidChange.fire()}toJSON(){let t=this.options.container.getBoundingClientRect(),i=this._element.getBoundingClientRect(),n={};return this.verticalAlignment==="top"?n.top=Number.parseFloat(this._element.style.top):this.verticalAlignment==="bottom"?n.bottom=Number.parseFloat(this._element.style.bottom):n.top=i.top-t.top,this.horiziontalAlignment==="left"?n.left=Number.parseFloat(this._element.style.left):this.horiziontalAlignment==="right"?n.right=Number.parseFloat(this._element.style.right):n.left=i.left-t.left,n.width=i.width,n.height=i.height,n}cancelPendingDrag(){this._dragMove.value&&(this._dragCancelled=!0,A(this._element,"dv-resize-container-dragging",!1),this._dragMove.value=S.NONE)}setupDrag(t,i){let n=(o,a)=>{var d,l,u;let v=null,g=!1;this._dragCancelled=!1;let f=this.options.transformDragPosition?(d=(l=(u=this.options).getSiblingBoxes)===null||l===void 0?void 0:l.call(u))!==null&&d!==void 0?d:[]:[],_=q();if(o&&typeof a=="number"&&typeof o.setPointerCapture=="function")try{o.setPointerCapture(a)}catch{}let w=()=>{A(this._element,"dv-resize-container-dragging",!1),this._dragMove.value=S.NONE,this._onDidChangeEnd.fire()};this._dragMove.value=new C({dispose:()=>{if(_.release(),o&&typeof a=="number"&&typeof o.releasePointerCapture=="function")try{o.releasePointerCapture(a)}catch{}}},M(globalThis.window,"pointermove",y=>{var D;if(this._dragCancelled)return;let G=this.options.container.getBoundingClientRect(),T=y.clientX-G.left,z=y.clientY-G.top;A(this._element,"dv-resize-container-dragging",!0);let P=this._element.getBoundingClientRect();(D=v)!==null&&D!==void 0||(v={x:y.clientX-P.left,y:y.clientY-P.top});let I=Math.max(0,this.getMinimumWidth(P.width)),W=Math.max(0,this.getMinimumHeight(P.height)),H=z-v.y,O=T-v.x;if(this.options.transformDragPosition){let ge=this.options.transformDragPosition({proposed:{top:H,left:O,width:P.width,height:P.height},container:{width:G.width,height:G.height},others:f,modifiers:{altKey:y.altKey,ctrlKey:y.ctrlKey,metaKey:y.metaKey,shiftKey:y.shiftKey}});ge&&(H=ge.top,O=ge.left)}let L=Math.max(0,G.height-P.height+W),X=Math.max(0,G.width-P.width+I),V=de(H,-W,L),F=de(G.height-P.height-H,-W,L),ie=de(O,-I,X),Z=de(G.width-P.width-O,-I,X),ee={};V<=F?ee.top=V:ee.bottom=F,ie<=Z?ee.left=ie:ee.right=Z,this.setBounds(ee),g||(g=!0,this._onDidStartMoving.fire())}),M(globalThis.window,"pointerup",w),M(globalThis.window,"pointercancel",w))};this.addDisposables(M(t,"pointerdown",o=>{if(o.defaultPrevented){o.preventDefault();return}xt(o)||n(t,o.pointerId)}),M(this.options.content,"pointerdown",o=>{o.defaultPrevented||xt(o)||o.shiftKey&&n(this.options.content,o.pointerId)}),M(this.options.content,"pointerdown",()=>{fi.push(this._element)},!0)),i?.inDragMode&&n()}setupResize(t){let i=document.createElement("div");i.className=`dv-resize-handle-${t}`,this._element.appendChild(i);let n=new E;this.addDisposables(n,M(i,"pointerdown",o=>{o.preventDefault();let a=null,d=q(),l=o.pointerId;if(typeof i.setPointerCapture=="function")try{i.setPointerCapture(l)}catch{}let u=()=>{n.dispose(),this._onDidChangeEnd.fire()};n.value=new C(M(globalThis.window,"pointermove",v=>{var g;let f=this.options.container.getBoundingClientRect(),_=this._element.getBoundingClientRect(),w=v.clientY-f.top,y=v.clientX-f.left;(g=a)!==null&&g!==void 0||(a={originalY:w,originalHeight:_.height,originalX:y,originalWidth:_.width});let D,G,T,z,P,I,W=()=>{let V=a.originalY+a.originalHeight>f.height?Math.max(0,f.height-ft.MINIMUM_HEIGHT):Math.max(0,a.originalY+a.originalHeight-ft.MINIMUM_HEIGHT);D=de(w,0,V),T=a.originalY+a.originalHeight-D,G=f.height-D-T},H=()=>{D=a.originalY-a.originalHeight;let V=D<0&&typeof this.options.minimumInViewportHeight=="number"?-D+this.options.minimumInViewportHeight:ft.MINIMUM_HEIGHT,F=f.height-Math.max(0,D);T=de(w-D,V,F),G=f.height-D-T},O=()=>{let V=a.originalX+a.originalWidth>f.width?Math.max(0,f.width-ft.MINIMUM_WIDTH):Math.max(0,a.originalX+a.originalWidth-ft.MINIMUM_WIDTH);z=de(y,0,V),I=a.originalX+a.originalWidth-z,P=f.width-z-I},L=()=>{z=a.originalX-a.originalWidth;let V=z<0&&typeof this.options.minimumInViewportWidth=="number"?-z+this.options.minimumInViewportWidth:ft.MINIMUM_WIDTH,F=f.width-Math.max(0,z);I=de(y-z,V,F),P=f.width-z-I};switch(t){case"top":W();break;case"bottom":H();break;case"left":O();break;case"right":L();break;case"topleft":W(),O();break;case"topright":W(),L();break;case"bottomleft":H(),O();break;case"bottomright":H(),L();break}let X={};D<=G?X.top=D:X.bottom=G,z<=P?X.left=z:X.right=P,X.height=T,X.width=I,this.setBounds(X)}),{dispose:()=>{if(d.release(),typeof i.releasePointerCapture=="function")try{i.releasePointerCapture(l)}catch{}}},M(globalThis.window,"pointerup",u),M(globalThis.window,"pointercancel",u))}))}getMinimumWidth(t){return typeof this.options.minimumInViewportWidth=="number"?t-this.options.minimumInViewportWidth:0}getMinimumHeight(t){return typeof this.options.minimumInViewportHeight=="number"?t-this.options.minimumInViewportHeight:0}dispose(){fi.destroy(this._element),this._element.remove(),super.dispose()}};En.MINIMUM_HEIGHT=20,En.MINIMUM_WIDTH=20;var _l=class extends C{get element(){return this._element}get group(){return this._group}setGroup(e){this._group=e}constructor(e,t){super(),this.accessor=e,this._onDragStart=new k,this.onDragStart=this._onDragStart.event,this._group=t,this._element=document.createElement("div"),this._element.className="dv-floating-titlebar",this.addDisposables(this._onDragStart,M(this._element,"pointerdown",()=>{this.accessor.doSetGroupActive(this._group)}),M(this._element,"pointerdown",i=>{i.shiftKey&&yt(i)},!0)),this.dragSource=new er({element:this._element,accessor:this.accessor,group:()=>this._group}),this.addDisposables(this.dragSource,this.dragSource.onDragStart(i=>{this._onDragStart.fire(i)}))}updateDragAndDropState(){this.dragSource.updateDragAndDropState()}};function Ve(e){return{moduleName:e.name,options:e.options,services:{[e.serviceKey]:e.create},init:e.init?(t,i)=>e.init(t,i[e.serviceKey]):void 0,dependsOn:e.dependsOn}}let wl=new Set(["AdvancedOverflow","AutoEdgeGroup","AutoHideEdgeGroup","DndCompass","KeyboardDocking","KeyboardNavigation","LayoutHistory","License","MultiRowTabs","PinnedTabs","SmartGuides"]),br=new Set;function fr(e,t){let i=t===void 0?[]:[].concat(t),n=i.map(d=>`\`${d}\``).join(", "),o=i.length>1?"require":"requires",a=i.length?`${n} ${o} the "${e}" module`:`The "${e}" module is required`;return wl.has(e)?`dockview: ${a}, which ships in dockview-enterprise.

  npm install dockview-enterprise
  import 'dockview-enterprise'; // self-registers every enterprise module
`:`dockview: ${a}, but it is not registered.`}function _r(e,t){let i=`${e}|${(t===void 0?[]:[].concat(t)).join("|")}`;br.has(i)||(br.add(i),console.error(fr(e,t)))}function Ge(e,t,i){if(e!==void 0)return e;_r(t,i)}var yl=class{constructor(){this._modules=new Map,this._services={},this._initDisposables=[]}get services(){return this._services}register(e){if(!this._modules.has(e.moduleName)){if(e.dependsOn)for(let t of e.dependsOn)this.register(t);this._modules.set(e.moduleName,e)}}initialize(e){for(let t of this._modules.values())if(t.services)for(let[i,n]of Object.entries(t.services))this._services[i]=n(e)}postConstruct(e){for(let t of this._modules.values())t.init&&this._initDisposables.push(t.init(e,this._services))}has(e){return this._modules.has(e)}dispose(){for(let e of this._initDisposables)e.dispose();this._initDisposables.length=0;for(let e of Object.values(this._services))e!==void 0&&typeof e.dispose=="function"&&e.dispose()}};let _i=[];function xl(e){for(let t of e)_i.some(i=>i.moduleName===t.moduleName)||_i.push(t)}function wr(){return[..._i]}function Dl(){_i.length=0}let Sl=[{optionKey:"smartGuides",reason:"smartGuides",moduleName:"SmartGuides",when:e=>!!e.smartGuides&&e.smartGuides.enabled!==!1},{optionKey:"layoutHistory",reason:"layoutHistory.enabled: true",moduleName:"LayoutHistory",when:e=>{var t;return((t=e.layoutHistory)===null||t===void 0?void 0:t.enabled)===!0}},{optionKey:"pinnedTabs",reason:"pinnedTabs.enabled: true",moduleName:"PinnedTabs",when:e=>{var t;return((t=e.pinnedTabs)===null||t===void 0?void 0:t.enabled)===!0}},{optionKey:"overflow",reason:"overflow.mode: 'wrap'",moduleName:"MultiRowTabs",when:e=>{var t;return((t=e.overflow)===null||t===void 0?void 0:t.mode)==="wrap"}},{optionKey:"overflow",reason:"overflow.maxRows",moduleName:"MultiRowTabs",when:e=>{var t;return((t=e.overflow)===null||t===void 0?void 0:t.maxRows)!=null}},{optionKey:"overflow",reason:"overflow.search",moduleName:"AdvancedOverflow",when:e=>{var t;return!!(!((t=e.overflow)===null||t===void 0)&&t.search)}},{optionKey:"overflow",reason:"overflow.mru",moduleName:"AdvancedOverflow",when:e=>{var t;return!!(!((t=e.overflow)===null||t===void 0)&&t.mru)}},{optionKey:"autoHideEdgeGroups",reason:"autoHideEdgeGroups",moduleName:"AutoHideEdgeGroup",when:e=>ui(e.autoHideEdgeGroups)},{optionKey:"dockToEdgeGroups",reason:"dockToEdgeGroups",moduleName:"AutoEdgeGroup",when:e=>ui(e.dockToEdgeGroups)},{optionKey:"dndCompass",reason:"dndCompass",moduleName:"DndCompass",when:e=>!!e.dndCompass},{optionKey:"keyboardNavigation",reason:"keyboardNavigation",moduleName:"KeyboardNavigation",when:e=>!!e.keyboardNavigation}];function kl(e,t){let i=new Map;for(let n of Sl){if(!n.when(e)||t(n.moduleName))continue;let o=i.get(n.moduleName);o?o.push(n.reason):i.set(n.moduleName,[n.reason])}for(let[n,o]of i)_r(n,o)}let nt={left:100,top:100,width:300,height:300};var Cl=class extends C{get group(){return this._group}setTitleBar(e){this._titleBar=e}setAnchorGroup(e){var t;this._group=e,(t=this._titleBar)===null||t===void 0||t.setGroup(e)}constructor(e,t,i){super(),this.overlay=t,this.gridview=i,this._group=e,this.addDisposables(t,{dispose:()=>this.gridview.dispose()})}position(e){this.overlay.setBounds(e)}},Gl=class{get floatingGroups(){return this._floatingGroups}constructor(e){this._floatingGroups=[],this._host=e}add(e,t,i){let n=new Cl(e,t,i),o=new C(e.api.onDidActiveChange(d=>{d.isActive&&t.bringToFront()}),(()=>{let d=-1,l=-1;return Ye(i.element,u=>{let v=Math.round(u.contentRect.width),g=Math.round(u.contentRect.height);v===d&&g===l||(d=v,l=g,i.layout(v,g))})})()),a=()=>{var d;let l=(d=e.activePanel)===null||d===void 0?void 0:d.title;l?t.element.setAttribute("aria-label",l):t.element.removeAttribute("aria-label")};return a(),n.addDisposables(e.api.onDidActivePanelChange(()=>a()),t.onDidChange(()=>{i.layout(i.width,i.height)}),t.onDidChangeEnd(()=>{this._host.fireLayoutChange()}),e.onDidChange(d=>{t.setBounds({height:typeof d?.height=="number"?d.height+t.headerHeight:d?.height,width:d?.width})}),{dispose:()=>{o.dispose(),Po(this._floatingGroups,n),e.model.location={type:"grid"}}}),this._floatingGroups.push(n),n}findByGroup(e){return this._floatingGroups.find(t=>t.group===e||t.gridview.element.contains(e.element))}serialize(){return this._floatingGroups.map(e=>{let t=e.gridview.serialize(),i=e.overlay.toJSON(),n=t.root;return n.type==="branch"&&n.data.length===1&&n.data[0].type==="leaf"?{data:n.data[0].data,position:i}:{grid:t,position:i}})}constrainBounds(){for(let e of this._floatingGroups)e.overlay.setBounds()}updateBounds(e){if("floatingGroupBounds"in e)for(let n of this._floatingGroups){switch(e.floatingGroupBounds){case"boundedWithinViewport":n.overlay.minimumInViewportHeight=void 0,n.overlay.minimumInViewportWidth=void 0;break;case void 0:n.overlay.minimumInViewportHeight=100,n.overlay.minimumInViewportWidth=100;break;default:var t,i;n.overlay.minimumInViewportHeight=(t=e.floatingGroupBounds)===null||t===void 0?void 0:t.minimumHeightWithinViewport,n.overlay.minimumInViewportWidth=(i=e.floatingGroupBounds)===null||i===void 0?void 0:i.minimumWidthWithinViewport}n.overlay.setBounds()}}disposeAll(){for(let e of[...this._floatingGroups])e.dispose()}dispose(){this.disposeAll()}};let yr=Ve({name:"FloatingGroup",serviceKey:"floatingGroupService",create:e=>new Gl(e)});var Pl=class{constructor(e){this._entries=[],this._restorationCleanups=new Set,this._restorationPromise=Promise.resolve(),this._onDidRemove=new k,this.onDidRemove=this._onDidRemove.event,this._host=e}get entries(){return this._entries}get restorationPromise(){return this._restorationPromise}add(e){this._entries.push(e)}remove(e){Po(this._entries,e)&&!this._host.isDisposed&&this._onDidRemove.fire(e)}findByGroup(e){return this._entries.find(t=>t.popoutGroup===e||t.gridview.element.contains(e.element))}findReferenceGroupId(e){var t;return(t=this._entries.find(i=>i.popoutGroup===e))===null||t===void 0?void 0:t.referenceGroup}observeGridviewSize(e,t,i){var n;let o=(n=e.window)===null||n===void 0?void 0:n.ResizeObserver;if(!o)return;let a=-1,d=-1,l=()=>{let v=e.window;if(this._host.isDisposed||!v||v.closed)return;let g=Math.round(t.element.clientWidth),f=Math.round(t.element.clientHeight);g===a&&f===d||(a=g,d=f,g>0&&f>0&&t.layout(g,f),i.updateAllPositions())},u=new o(()=>{var v;let g=(v=e.window)===null||v===void 0?void 0:v.requestAnimationFrame;g?g.call(e.window,l):l()});return u.observe(t.element),{dispose:()=>u.disconnect()}}scheduleRestoration(e,t,i){return new Promise(n=>{let o=()=>{this._restorationCleanups.delete(o),clearTimeout(a),i?.(),n()},a=setTimeout(()=>{if(this._restorationCleanups.delete(o),this._host.isDisposed){n();return}Promise.resolve(t()).then(()=>n(),()=>n())},e);this._restorationCleanups.add(o)})}finishRestoration(e){this._restorationPromise=Promise.all(e).then(()=>{})}cancelPendingRestorations(){for(let e of[...this._restorationCleanups])e();this._restorationCleanups.clear()}serialize(){return this._entries.map(e=>{let t=e.gridview.serialize(),i=t.root,n=e.popoutGroup.api.location.type==="popout"?e.popoutGroup.api.location.popoutUrl:void 0,o={gridReferenceGroup:e.referenceGroup,position:e.window.dimensions(),url:n};return i.type==="branch"&&i.data.length===1&&i.data[0].type==="leaf"?N(N({},o),{},{data:i.data[0].data}):N(N({},o),{},{grid:t})})}disposeAll(){for(let e of[...this._entries])e.disposable.dispose()}dispose(){this.cancelPendingRestorations(),this.disposeAll(),this._onDidRemove.dispose()}};let zl=Ve({name:"PopoutWindow",serviceKey:"popoutWindowService",create:e=>new Pl(e)});var Tl=class{constructor(e){this._watermark=null,this._host=e}update(){if(this._host.hasVisibleGridGroup()){this._unmount();return}if(this._watermark)return;this._watermark=this._host.createWatermarkComponent(),this._watermark.init({containerApi:this._host.api});let e=document.createElement("div");e.className="dv-watermark-container",B(e,"watermark-component"),e.appendChild(this._watermark.element),this._host.mountElement.appendChild(e)}refresh(){this._unmount(),this.update()}_unmount(){var e,t;this._watermark&&(this._watermark.element.parentElement.remove(),(e=(t=this._watermark).dispose)===null||e===void 0||e.call(t),this._watermark=null)}dispose(){this._unmount()}};let El=Ve({name:"Watermark",serviceKey:"watermarkService",create:e=>new Tl(e),init:(e,t)=>(t.update(),new C($.any(e.onDidAdd,e.onDidRemove)(()=>{t.update()}),e.onDidViewVisibilityChangeMicroTaskQueue(()=>{t.update()})))});var Al=class{constructor(){this._edgeGroups=new Map,this._edgeGroupDisposables=new Map,this._autoHide=new WeakMap,this._autoReveal=new WeakMap}add(e,t,i){this._edgeGroups.set(e,t),this._edgeGroupDisposables.set(e,i)}remove(e){var t;(t=this._edgeGroupDisposables.get(e))===null||t===void 0||t.dispose(),this._edgeGroupDisposables.delete(e),this._edgeGroups.delete(e)}get(e){return this._edgeGroups.get(e)}has(e){return this._edgeGroups.has(e)}hasAny(){return this._edgeGroups.size>0}entries(){return this._edgeGroups.entries()}includes(e){for(let t of this._edgeGroups.values())if(t===e)return!0;return!1}findPositionOf(e){for(let[t,i]of this._edgeGroups)if(i===e)return t}setAutoHide(e,t){t===void 0?this._autoHide.delete(e):this._autoHide.set(e,t)}isAutoHide(e){return this._autoHide.get(e)}setAutoReveal(e,t){this._autoReveal.set(e,t)}isAutoReveal(e){var t;return(t=this._autoReveal.get(e))!==null&&t!==void 0?t:!1}disposeAll(){for(let e of this._edgeGroupDisposables.values())e.dispose();this._edgeGroupDisposables.clear(),this._edgeGroups.clear()}dispose(){this.disposeAll()}};let xr=Ve({name:"EdgeGroup",serviceKey:"edgeGroupService",create:()=>new Al}),Il={activationSize:{type:"pixels",value:10},size:{type:"pixels",value:20}},Ml={activationSize:{type:"pixels",value:32},size:{type:"pixels",value:20}};function Dr(e,t){return typeof e.dndEdges=="object"&&e.dndEdges!==null?e.dndEdges:t&&ui(e.dockToEdgeGroups)?Ml:Il}var Ol=class{constructor(e){this._host=e;let t=(n,o)=>{let a=b();return a?a.viewId!==e.id?!1:o==="center"?e.isGridEmpty():!0:o==="center"&&!e.isGridEmpty()?!1:e.dispatchUnhandledDragOver(n,o)},i=Dr(e.options,!1);this._html5Target=Je.createDropTarget(e.element,{className:"dv-drop-target-edge",canDisplayOverlay:t,acceptedTargetZones:["top","bottom","left","right","center"],overlayModel:i,getOverrideTarget:()=>e.rootDropTargetOverrideTarget(),getPositionResolver:()=>e.options.dropPositionResolver}),this._pointerTarget=Ne.createDropTarget(e.element,{className:"dv-drop-target-edge",canDisplayOverlay:t,acceptedTargetZones:["top","bottom","left","right","center"],overlayModel:i,getOverrideTarget:()=>e.rootDropTargetOverrideTarget(),getPositionResolver:()=>e.options.dropPositionResolver}),this.onWillShowOverlay=$.any(this._html5Target.onWillShowOverlay,this._pointerTarget.onWillShowOverlay),this.onDrop=$.any(this._html5Target.onDrop,this._pointerTarget.onDrop),this.setOptions(e.options)}setOptions(e){if("dndEdges"in e){let t=typeof e.dndEdges=="boolean"&&e.dndEdges===!1;this._html5Target.disabled=t,this._pointerTarget.disabled=t}if("dndEdges"in e||"dockToEdgeGroups"in e){let t=Dr({dndEdges:"dndEdges"in e?e.dndEdges:this._host.options.dndEdges,dockToEdgeGroups:"dockToEdgeGroups"in e?e.dockToEdgeGroups:this._host.options.dockToEdgeGroups},this._host.hasEdgeDragReveal);this._html5Target.setOverlayModel(t),this._pointerTarget.setOverlayModel(t)}}dispose(){this._html5Target.dispose(),this._pointerTarget.dispose()}};let Ll=Ve({name:"RootDropTarget",serviceKey:"rootDropTargetService",create:e=>new Ol(e),init:(e,t)=>(t.setOptions(e.options),S.NONE)}),Rl={left:"createLeftHeaderActionComponent",right:"createRightHeaderActionComponent",prefix:"createPrefixHeaderActionComponent"};var $l=class{constructor(e){this._perGroup=new Map,this._host=e}refresh(e){if(!e?.model)return;let t=this._ensureState(e);this._refreshSlot("left",e,t.left),this._refreshSlot("right",e,t.right),this._refreshSlot("prefix",e,t.prefix)}refreshAll(){for(let e of this._host.groups)this.refresh(e)}disposeGroup(e){let t=this._perGroup.get(e);t&&(t.left.dispose(),t.right.dispose(),t.prefix.dispose(),this._perGroup.delete(e))}dispose(){for(let e of[...this._perGroup.keys()])this.disposeGroup(e)}_ensureState(e){let t=this._perGroup.get(e);return t||(t={left:new E,right:new E,prefix:new E},this._perGroup.set(e,t)),t}_refreshSlot(e,t,i){let n=this._host.options[Rl[e]];if(n){let o=n(t);i.value=o,o.init({containerApi:this._host.api,api:t.api,group:t}),t.model.attachHeaderAction(e,o.element)}else i.dispose(),t.model.attachHeaderAction(e,void 0)}};let Nl=Ve({name:"HeaderActions",serviceKey:"headerActionsService",create:e=>new $l(e),init:(e,t)=>new C(e.onDidRemoveGroup(i=>{t.disposeGroup(i)}))}),Sr=e=>e==="load"||e==="clear";function wi(e,t){let i=e.createElement("div");return i.className=t==="assertive"?"dv-live-region-assertive":"dv-live-region",i.setAttribute("role",t==="assertive"?"alert":"status"),i.setAttribute("aria-live",t),i.setAttribute("aria-atomic","true"),Object.assign(i.style,{position:"absolute",width:"1px",height:"1px",margin:"-1px",padding:"0",overflow:"hidden",clip:"rect(0 0 0 0)",clipPath:"inset(50%)",whiteSpace:"nowrap",border:"0"}),i}var Vl=class extends C{constructor(e){var t;super(),this._regions=new Map,this._suppressDepth=0,this._locationSubs=new Map,this._host=e;let i=e.element.ownerDocument;this._mainWindow=(t=i.defaultView)!==null&&t!==void 0?t:window;let n={polite:wi(i,"polite"),assertive:wi(i,"assertive")};e.element.appendChild(n.polite),e.element.appendChild(n.assertive),this._regions.set(this._mainWindow,n),this._syncPopoutRegions(),this.addDisposables({dispose:()=>this._disposeRegions()},e.onDidChangePopouts(()=>this._syncPopoutRegions()),e.onDidAddPanel(o=>this._announce(o,"open")),e.onDidRemovePanel(o=>this._announce(o,"close")),e.onWillMutateLayout(o=>{Sr(o.kind)&&this._suppressDepth++}),e.onDidMutateLayout(o=>{Sr(o.kind)&&(this._suppressDepth=Math.max(0,this._suppressDepth-1))}),e.onDidMaximizedGroupChange(o=>{let a=o.group.activePanel;a&&this._announce(a,o.isMaximized?"maximize":"restore")}),e.onDidAddGroup(o=>this._trackLocation(o)),e.onDidRemoveGroup(o=>{var a;(a=this._locationSubs.get(o.id))===null||a===void 0||a.dispose(),this._locationSubs.delete(o.id)}),{dispose:()=>{this._locationSubs.forEach(o=>o.dispose()),this._locationSubs.clear()}})}_syncPopoutRegions(){let e=this._host.element.ownerDocument,t=new Set([this._mainWindow]);for(let n of this._host.getPopoutWindows()){var i;if(n.document===e||(t.add(n),this._regions.has(n)))continue;let o=n.document,a=(i=o.body)!==null&&i!==void 0?i:o.documentElement,d={polite:wi(o,"polite"),assertive:wi(o,"assertive")};a.appendChild(d.polite),a.appendChild(d.assertive),this._regions.set(n,d)}for(let[n,o]of this._regions)t.has(n)||(o.polite.remove(),o.assertive.remove(),this._regions.delete(n))}_disposeRegions(){for(let e of this._regions.values())e.polite.remove(),e.assertive.remove();this._regions.clear()}_focusedRegions(){for(let[e,t]of this._regions)if(e!==this._mainWindow)try{if(e.document.hasFocus())return t}catch{}return this._regions.get(this._mainWindow)}_trackLocation(e){let t=e.api.location.type,i=e.api.onDidLocationChange(n=>{let o=n.location.type;if(o===t)return;t=o;let a=e.activePanel;if(!a)return;let d;switch(o){case"floating":d="float";break;case"popout":d="popout";break;default:d="dock";break}this._announce(a,d)});this._locationSubs.set(e.id,i)}announce(e,t="polite"){if(this._host.options.announcements===!1||this._suppressDepth>0||!e)return;let i=this._host.options.announcer;if(i){i({message:e,politeness:t});return}let n=this._focusedRegions(),o=t==="assertive"?n.assertive:n.polite;o.textContent="",o.textContent=e}_announce(e,t){var i,n;let o=(i=(n=this._host.options).getAnnouncement)===null||i===void 0?void 0:i.call(n,{kind:t,panel:e});o===null||o===""||this.announce(o??this._defaultMessage(e,t))}_defaultMessage(e,t){var i;let n=bn(this._host.options.messages),o=(i=e.title)!==null&&i!==void 0?i:e.id;switch(t){case"open":return n.panelOpened(o);case"close":return n.panelClosed(o);case"maximize":return n.groupMaximized(o);case"restore":return n.groupRestored(o);case"float":return n.groupFloated(o);case"dock":return n.groupDocked(o);case"popout":return n.groupPoppedOut(o)}}};let kr=Ve({name:"LiveRegion",serviceKey:"liveRegionService",create:e=>new Vl(e)}),Wl=30,Hl=-10;var Cr=class{constructor(e){this.host=e}dispatchWillDragPanel(e){this.host.fireWillDragPanel(e)}dispatchWillDragGroup(e){this.host.fireWillDragGroup(e)}dispatchWillDrop(e){this.host.fireWillDrop(e)}dispatchWillShowOverlay(e){this.host.fireWillShowOverlay(e)}buildGroupDragGhost(e){let t=this.host.options.createGroupDragGhostComponent;if(!t)return;let i=t(e);return i.init({group:e,api:this.host.api}),{element:i.element,offsetX:Wl,offsetY:Hl,dispose:i.dispose?()=>{var n;return(n=i.dispose)===null||n===void 0?void 0:n.call(i)}:void 0}}resolveOverlayModel(e,t){var i,n;return(i=(n=this.host.options).dropOverlayModel)===null||i===void 0?void 0:i.call(n,{location:e,group:t})}showPreviewOverlay(e,t){let i=e.model.contentDropTarget;return i.showOverlay(t),S.from(()=>i.clearOverlay())}dispose(){}};let Gr=Ve({name:"AdvancedDnD",serviceKey:"advancedDnDService",create:e=>new Cr(e)});var Pr=class{constructor(e){this._host=e}attachToGroup(e){return new C(e.model.onDidCreateTabGroup(t=>{this._host.fireDidCreateTabGroup(t)}),e.model.onDidDestroyTabGroup(t=>{this._host.fireDidDestroyTabGroup(t)}),e.model.onDidAddPanelToTabGroup(t=>{this._host.fireDidAddPanelToTabGroup(t)}),e.model.onDidRemovePanelFromTabGroup(t=>{this._host.fireDidRemovePanelFromTabGroup(t)}),e.model.onDidTabGroupChange(t=>{this._host.fireDidTabGroupChange(t)}),e.model.onDidTabGroupCollapsedChange(t=>{this._host.fireDidTabGroupCollapsedChange(t)}))}dispose(){}};let zr=Ve({name:"TabGroupChips",serviceKey:"tabGroupChipsService",create:e=>new Pr(e),init:(e,t)=>{let i=new Map;return new C(e.onDidAddGroup(n=>{i.set(n,t.attachToGroup(n))}),e.onDidRemoveGroup(n=>{var o;(o=i.get(n))===null||o===void 0||o.dispose(),i.delete(n)}),{dispose:()=>{for(let n of i.values())n.dispose();i.clear()}})}});function Tr(e,t){var i,n;if(!((i=t.api)===null||i===void 0||(n=i.isPeeking)===null||n===void 0)&&n.call(i))return"calc(var(--dv-overlay-z-index, 999) + 100)";if(!(e instanceof HTMLElement))return;let o=lt(e);return o?.style.zIndex?`calc(${o.style.zIndex} * 2)`:void 0}let Fl=0,Bl=()=>`dv-ctx-menu-item-${Fl++}`;function Er(e){return typeof e=="object"}function Ae(e,t,i,n){let o=document.createElement("div");return o.className="dv-context-menu-item",o.setAttribute("role","menuitem"),n&&(o.classList.add("dv-context-menu-item--disabled"),o.setAttribute("aria-disabled","true")),o.textContent=e,n||o.addEventListener("click",()=>{i(),t()}),o}function Ar(){let e=document.createElement("div");return e.className="dv-context-menu-separator",e.setAttribute("role","separator"),e}function Ul(){if(globalThis.window===void 0||!globalThis.matchMedia)return!1;let e=globalThis.matchMedia("(pointer: coarse)").matches,t=globalThis.matchMedia("(pointer: fine)").matches;return e&&!t}function Yl(e){let t=document.createElement("div");t.className="dv-context-menu-rename";let i=document.createElement("input");return i.className="dv-context-menu-rename-input",i.type="text",i.placeholder="Name This Group",i.value=e.label,i.addEventListener("input",()=>{e.setLabel(i.value)}),i.addEventListener("keydown",n=>{n.key!=="Escape"&&n.key!=="Enter"&&n.stopPropagation()}),i.addEventListener("click",n=>{n.stopPropagation()}),t.appendChild(i),Ul()||requestAnimationFrame(()=>{i.focus(),i.select()}),t}function Xl(e,t){let i=document.createElement("div");if(i.className="dv-context-menu-color-picker",!t.enabled)return i;for(let n of t.entries()){let o=document.createElement("div");o.className="dv-context-menu-color-swatch",o.style.setProperty("--dv-tab-group-color",n.value),n.label&&(o.title=n.label),e.color===n.id&&o.classList.add("dv-context-menu-color-swatch--selected"),o.addEventListener("click",()=>{e.setColor(n.id)}),i.appendChild(o)}return i}var Ir=class{constructor(e){this.accessor=e}buildMaximizeItem(e,t){let i=e.api.isMaximized();return Ae(i?"Restore":"Maximize",t,i?()=>e.api.exitMaximized():()=>e.api.maximize(),!i&&e.api.location.type!=="grid")}buildCollapseItem(e,t){return Ae(e.collapsed?"Expand":"Collapse",t,()=>e.toggle())}_shouldInjectPin(){let e=this.accessor.options.pinnedTabs;return!!this.accessor.pinnedTabsService&&!!e?.enabled&&e.contextMenuItem!==!1}_resolveTabItems(e,t,i){var n,o,a;let d=(n=(o=(a=this.accessor.options).getTabContextMenuItems)===null||o===void 0?void 0:o.call(a,{panel:e,group:t,api:this.accessor.api,event:i}))!==null&&n!==void 0?n:[];return this._shouldInjectPin()?["pin",...d]:d}appendComponentItem(e,t,i,n,o,a){var d,l;let u=(d=(l=this.accessor.options).createContextMenuItemComponent)===null||d===void 0?void 0:d.call(l,{id:Bl(),component:t.component});u&&(a.addDisposables(u),u.init(N(N({},i),{},{group:n,api:this.accessor.api,close:o,componentProps:t.componentProps})),e.appendChild(u.element))}buildBuiltInTabItem(e,t,i,n){switch(e){case"separator":return Ar();case"close":return Ae("Close",n,()=>t.api.close());case"closeOthers":return Ae("Close Others",n,()=>{i.panels.filter(o=>o!==t).forEach(o=>o.api.close())});case"closeAll":return Ae("Close All",n,()=>{[...i.panels].forEach(o=>o.api.close())});case"closeLeft":{let o=i.panels.indexOf(t);return Ae("Close to the Left",n,()=>{i.panels.filter((a,d)=>d<o).forEach(a=>a.api.close())},o<=0)}case"closeRight":{let o=i.panels.indexOf(t);return Ae("Close to the Right",n,()=>{i.panels.filter((a,d)=>d>o).forEach(a=>a.api.close())},o===-1||o>=i.panels.length-1)}case"maximize":return this.buildMaximizeItem(t,n);case"float":return Ae("Float",n,()=>this.accessor.api.addFloatingGroup(t),t.api.location.type==="floating");case"popout":return Ae("Open in New Window",n,()=>{this.accessor.api.addPopoutGroup(t)},t.api.location.type==="popout");case"pin":return Ae(t.api.isPinned?"Unpin tab":"Pin tab",n,()=>t.api.setPinned(!t.api.isPinned));default:return}}appendConfigItem(e,t,i,n,o,a){t.element?e.appendChild(t.element):t.component?this.appendComponentItem(e,t,i,n,o,a):t.label&&e.appendChild(Ae(t.label,o,()=>{var d;return(d=t.action)===null||d===void 0?void 0:d.call(t)},t.disabled))}show(e,t,i){let n=this._resolveTabItems(e,t,i);if(n.length===0)return;i.preventDefault();let o=this.accessor.getPopupServiceForGroup(t),a=()=>o.close(),d=new C,l=document.createElement("div");l.className="dv-context-menu",l.setAttribute("role","menu");try{for(let u of n){if(Er(u)){this.appendConfigItem(l,u,{panel:e},t,a,d);continue}let v=this.buildBuiltInTabItem(u,e,t,a);v&&l.appendChild(v)}}catch(u){throw d.dispose(),u}o.openPopover(l,{x:i.clientX,y:i.clientY,zIndex:Tr(i.target,t)},{onClose:()=>d.dispose()})}showForChip(e,t,i){if(!this.accessor.options.getTabGroupChipContextMenuItems)return;let n=this.accessor.options.getTabGroupChipContextMenuItems({tabGroup:e,group:t,api:this.accessor.api,event:i});if(n.length===0)return;i.preventDefault();let o=this.accessor.getPopupServiceForGroup(t),a=()=>o.close(),d=new C,l=document.createElement("div");l.className="dv-context-menu",l.setAttribute("role","menu");try{for(let u of n)u==="separator"?l.appendChild(Ar()):u==="rename"?l.appendChild(Yl(e)):u==="colorPicker"?l.appendChild(Xl(e,this.accessor.tabGroupColorPalette)):u==="collapse"?l.appendChild(this.buildCollapseItem(e,a)):u==="close"?l.appendChild(Ae("Close All",a,()=>{t.panels.filter(v=>e.containsPanel(v.id)).forEach(v=>v.api.close())})):Er(u)&&this.appendConfigItem(l,u,{tabGroup:e},t,a,d)}catch(u){throw d.dispose(),u}o.openPopover(l,{x:i.clientX,y:i.clientY,zIndex:Tr(i.target,t)},{onClose:()=>d.dispose()})}};let Mr=Ve({name:"ContextMenu",serviceKey:"contextMenuService",create:e=>new Ir(e)}),Jl=[yr,zl,El,xr,Ll,Nl,kr,Gr,zr,Mr];var ql=class{constructor(){this.cache=new WeakMap,this.currentFrameId=0,this.rafId=null}getPosition(e){let t=this.cache.get(e);if(t?.frameId===this.currentFrameId)return t.rect;this.scheduleFrameUpdate();let i=R(e);return this.cache.set(e,{rect:i,frameId:this.currentFrameId}),i}invalidate(){this.currentFrameId++}scheduleFrameUpdate(){this.rafId||(this.rafId=requestAnimationFrame(()=>{this.currentFrameId++,this.rafId=null}))}};let Or=-1;function Kl(){let e=document.createElement("div");return e.tabIndex=-1,e}function kt(e,t,i){let n=`${i}px`;e[t]!==n&&(e[t]=n)}var Lr=class extends C{constructor(e,t){super(),this.element=e,this.accessor=t,this.map={},this._disposed=!1,this._generation=0,this.positionCache=new ql,this.addDisposables(S.from(()=>{for(let i of Object.values(this.map))i.disposable.dispose(),i.destroy.dispose(),this.cancelPendingUpdate(i);this._disposed=!0}))}updateAllPositions(){if(!this._disposed){this.positionCache.invalidate();for(let e of Object.values(this.map))e.panel.api.isVisible&&e.resize&&e.resize()}}repositionPanelOverlay(e,t=!1,i){var n;if(this._disposed)return;let o=this.map[e];o&&(o.forceVisible=t,o.clip=i,this.positionCache.invalidate(),(n=o.resize)===null||n===void 0||n.call(o))}cancelPendingUpdate(e){e.pendingUpdate!==void 0&&(cancelAnimationFrame(e.pendingUpdate),e.pendingUpdate=void 0)}detatch(e){if(this.map[e.api.id]){let t=this.map[e.api.id];return t.disposable.dispose(),t.destroy.dispose(),this.cancelPendingUpdate(t),delete this.map[e.api.id],!0}return!1}attach(e){let{panel:t,referenceContainer:i}=e;if(!this.map[t.api.id]){let w=Kl();w.className="dv-render-overlay",w.style.visibility="hidden",this.map[t.api.id]={panel:t,disposable:S.NONE,destroy:S.NONE,element:w,retainPreviousGeometry:!1,positioned:!1,generation:++this._generation}}let n=this.map[t.api.id];n.referenceContainer!==i&&(n.generation=++this._generation,this.cancelPendingUpdate(n),n.referenceContainer=i,n.retainPreviousGeometry=n.positioned);let o=n.generation,a=n.element,d=t.view.content.element,l=w=>{if(!w||w.width<=0||w.height<=0)return;let y=this.map[t.api.id];!y||y.forceVisible||y.positioned&&t.api.isVisible||(kt(a.style,"width",w.width),kt(a.style,"height",w.height))};l(i.dimensions),d.parentElement!==a&&a.appendChild(d),a.parentElement!==this.element&&this.element.appendChild(a);let u=()=>{let w=t.api.id,y=this.map[w];if(y?.generation!==o||y.pendingUpdate!==void 0)return;y.pendingUpdate=Or;let D=requestAnimationFrame(()=>{var G;let T=this.map[w];if(T&&(T.pendingUpdate=void 0),this.isDisposed||T?.generation!==o)return;let z=(G=T.forceVisible)!==null&&G!==void 0?G:!1,P=T.clip,I=this.positionCache.getPosition(i.element),W=this.positionCache.getPosition(this.element),H=I.left-W.left,O=I.top-W.top,L=I.width,X=I.height;if(T.retainPreviousGeometry&&(L===0||X===0)){!t.api.isVisible&&!z&&(a.style.visibility="hidden",a.style.pointerEvents="none");return}if(T.retainPreviousGeometry=!1,T.positioned=!0,kt(a.style,"left",H),kt(a.style,"top",O),kt(a.style,"width",L),kt(a.style,"height",X),t.api.isVisible||z?(a.style.visibility="",a.style.pointerEvents=""):(a.style.visibility="hidden",a.style.pointerEvents="none"),z?a.style.zIndex="1000":t.api.location.type!=="floating"&&(a.style.zIndex=""),P){var V,F;let ie=this.element.ownerDocument.defaultView,Z=(V=ie?.scrollX)!==null&&V!==void 0?V:0,ee=(F=ie?.scrollY)!==null&&F!==void 0?F:0,ge=P.top+ee,ne=P.left+Z,Q=Math.max(0,ge-I.top),Pe=Math.max(0,ne-I.left),ht=Math.max(0,I.left+L-(P.right+Z)),ut=Math.max(0,I.top+X-(P.bottom+ee));a.style.clipPath=`inset(${Q}px ${ht}px ${ut}px ${Pe}px)`}else a.style.clipPath="";A(a,"dv-render-overlay-float",t.group.api.location.type==="floating")});y.pendingUpdate===Or&&(y.pendingUpdate=D)},v=()=>{if(t.api.isVisible){var w;this.positionCache.invalidate(),u(),!((w=this.map[t.api.id])===null||w===void 0)&&w.retainPreviousGeometry&&(a.style.visibility=""),a.style.pointerEvents=""}else a.style.visibility="hidden",a.style.pointerEvents="none"},g=new E,f=()=>{t.api.location.type==="floating"?queueMicrotask(()=>{if(_.isDisposed)return;let w=this.accessor.getFloatingWindowForGroup(t.api.group);if(!w)return;let y=w.overlay.element,D=()=>{let T=Number(y.getAttribute("aria-level"));a.style.zIndex=`calc(var(--dv-overlay-z-index, 999) + ${T*2+1})`},G=new MutationObserver(()=>{D()});g.value=S.from(()=>G.disconnect()),G.observe(y,{attributeFilter:["aria-level"],attributes:!0}),D()}):a.style.zIndex=""},_=new C(g,new Lo(a,{onDragEnd:w=>{i.dropTarget.dnd.onDragEnd(w)},onDragEnter:w=>{i.dropTarget.dnd.onDragEnter(w)},onDragLeave:w=>{i.dropTarget.dnd.onDragLeave(w)},onDrop:w=>{i.dropTarget.dnd.onDrop(w)},onDragOver:w=>{i.dropTarget.dnd.onDragOver(w)}}),t.api.onDidVisibilityChange(()=>{v()}),t.api.onDidDimensionsChange(()=>{t.api.isVisible&&u()}),i.onDidDimensionsChange(w=>{l(w)}),t.api.onDidLocationChange(()=>{f()}));return this.map[t.api.id].destroy=S.from(()=>{d.parentElement===a&&d.remove(),a.remove()}),f(),queueMicrotask(()=>{this.isDisposed||v()}),this.map[t.api.id].disposable.dispose(),this.map[t.api.id].disposable=_,this.map[t.api.id].resize=u,a}},Zl=class extends C{constructor(e){super(),this.accessor=e,this.init()}init(){let e=new Set,t=new Set;this.addDisposables(this.accessor.onDidAddPanel(i=>{if(e.has(i.api.id))throw new Error(`dockview: Invalid event sequence. [onDidAddPanel] called for panel ${i.api.id} but panel already exists`);e.add(i.api.id)}),this.accessor.onDidRemovePanel(i=>{if(e.has(i.api.id))e.delete(i.api.id);else throw new Error(`dockview: Invalid event sequence. [onDidRemovePanel] called for panel ${i.api.id} but panel does not exists`)}),this.accessor.onDidAddGroup(i=>{if(t.has(i.api.id))throw new Error(`dockview: Invalid event sequence. [onDidAddGroup] called for group ${i.api.id} but group already exists`);t.add(i.api.id)}),this.accessor.onDidRemoveGroup(i=>{if(t.has(i.api.id))t.delete(i.api.id);else throw new Error(`dockview: Invalid event sequence. [onDidRemoveGroup] called for group ${i.api.id} but group does not exists`)}))}};function jl(e){if(!e.matchMedia)return!1;let t=e.matchMedia("(pointer: coarse)").matches,i=e.matchMedia("(pointer: fine)").matches;return t&&!i}function Rr(e){var t,i,n,o,a,d,l;let u=(t=e.window)!==null&&t!==void 0?t:window,v=(i=e.capture)!==null&&i!==void 0?i:!1,g=(n=e.escape)!==null&&n!==void 0?n:!0,f=(o=e.keys)!==null&&o!==void 0?o:[],_=(a=e.outsidePointerDown)!==null&&a!==void 0?a:!0,w=(d=e.pointerDownGraceMs)!==null&&d!==void 0?d:0,y=(l=e.now)!==null&&l!==void 0?l:Date.now,D=y(),G=new C,T=z=>{var P,I;return e.isInside?e.isInside(z):dt(z,(P=(I=e.elements)===null||I===void 0?void 0:I.call(e))!==null&&P!==void 0?P:[])};if((g||f.length>0)&&G.addDisposables(M(u,"keydown",z=>{(g&&z.key==="Escape"||f.includes(z.key))&&e.onDismiss()},v)),(_||e.onInsidePointerDown)&&G.addDisposables(M(u,"pointerdown",z=>{if(T(z)){var P;(P=e.onInsidePointerDown)===null||P===void 0||P.call(e,z);return}!_||y()-D<w||e.onDismiss()},v)),e.resize&&G.addDisposables(M(u,"resize",()=>{jl(u)||e.onDismiss()})),e.focusOut){let z=()=>{var O,L,X;return(O=(L=e.anchor)===null||L===void 0?void 0:L.call(e))!==null&&O!==void 0?O:(X=e.elements)===null||X===void 0?void 0:X.call(e)[0]},P=new WeakSet,I=O=>{var L,X;if(P.has(O))return;P.add(O);let V=O.target;V instanceof Element&&((e.isFocusInside?e.isFocusInside(ii(V,z())):dt(O,(L=(X=e.elements)===null||X===void 0?void 0:X.call(e))!==null&&L!==void 0?L:[]))||e.onDismiss())},W=new Map,H=()=>{var O,L,X;let V=new Set,F=(O=e.anchor)===null||O===void 0?void 0:O.call(e),ie=[...(L=(X=e.elements)===null||X===void 0?void 0:X.call(e))!==null&&L!==void 0?L:[],...F?[F]:[]];for(let Z of ie)for(let ee of Ot(Z))V.add(ee);for(let[Z,ee]of W)V.has(Z)||(ee.dispose(),W.delete(Z));for(let Z of V)W.has(Z)||W.set(Z,M(Z,"focusin",I,v))};G.addDisposables(M(u,"focusin",O=>{H(),I(O)},v),{dispose:()=>{for(let[,O]of W)O.dispose();W.clear()}}),H()}return G}var $r=class extends C{constructor(e,t=globalThis.window){super(),this._active=null,this._activeDisposable=new E,this._root=e,this._window=t,this._element=t.document.createElement("div"),this._element.className="dv-popover-anchor",this._element.style.position="relative",this._root.prepend(this._element),this.addDisposables(S.from(()=>{this.close()}),this._activeDisposable)}updateRoot(e){e.prepend(this._element),this._root=e}openPopover(e,t,i){var n;this.close();let o=this._window.document.createElement("div");o.style.position="absolute",o.style.zIndex=(n=t.zIndex)!==null&&n!==void 0?n:"var(--dv-overlay-z-index)",o.appendChild(e);let a=this._element.getBoundingClientRect(),d=a.left,l=a.top;o.style.top=`${t.y-l}px`,o.style.left=`${t.x-d}px`,this._element.appendChild(o),this._active=o;let u=200;this._activeDisposable.value=new C(Rr({window:this._window,onDismiss:()=>this.close(),elements:()=>this._active?[this._active]:[],keys:["Enter"],pointerDownGraceMs:u,resize:!0}),i?.onClose?S.from(i.onClose):S.NONE),this._window.requestAnimationFrame(()=>{Rt(o,this._root)})}close(){this._active&&(this._active.remove(),this._activeDisposable.dispose(),this._active=null)}},An=class extends C{get renderedOutline(){return this._model?this._outline:void 0}get disabled(){return this._disabled}set disabled(e){this.disabled!==e&&(this._disabled=e,e&&this._clearNow())}_cancelPendingClear(){this._pendingClear!==void 0&&(clearTimeout(this._pendingClear),this._pendingClear=void 0)}_clearNow(){this._cancelPendingClear(),this._model&&this._model.root.remove(),this._model=void 0}get model(){if(!this.disabled)return{clear:()=>{this._clearNow()},scheduleClear:()=>{this._pendingClear!==void 0||!this._model||(this._pendingClear=setTimeout(()=>{this._pendingClear=void 0,this._clearNow()},0))},exists:()=>!!this._model,getElements:(e,t)=>{this._cancelPendingClear();let i=this._outline!==t;if(this._outline=t,this._model)return this._model.changed=i,this._model;let n=this.createContainer(),o=this.createAnchor();if(this._model={root:n,overlay:o,changed:i},n.appendChild(o),this.element.appendChild(n),e?.target instanceof HTMLElement){let a=e.target.getBoundingClientRect(),d=this.element.getBoundingClientRect();o.style.left=`${a.left-d.left}px`,o.style.top=`${a.top-d.top}px`}return this._model}}}constructor(e,t){super(),this.element=e,this._disabled=!1,this._disabled=t.disabled,this.addDisposables(S.from(()=>{var i;(i=this.model)===null||i===void 0||i.clear()}))}createContainer(){let e=document.createElement("div");return e.className="dv-drop-target-container",e}createAnchor(){let e=document.createElement("div");return e.className="dv-drop-target-anchor",e.style.visibility="hidden",e}};let In=["left","right","top","bottom"];function yi(e){return e==="left"||e==="right"}let Ql={marginShare:0,size:Number.POSITIVE_INFINITY};var ec=class{get _effectiveBaseCollapsed(){var e;return(e=this._measuredTabSize)!==null&&e!==void 0?e:this._baseCollapsedSize}get minimumSize(){return this._isCollapsed?this.collapsedSize:this._baseMinimumSize!==void 0?this._baseMinimumSize+this._axis.marginShare:this._effectiveBaseCollapsed+50+this._axis.marginShare}get maximumSize(){return this._isCollapsed?this.collapsedSize:this._expandedMaximumSize}get element(){return this._group.element}get isCollapsed(){return this._isCollapsed}get lastExpandedSize(){return this._lastExpandedSize}get lastExpandedContentSize(){return this._lastExpandedSize-this._axis.marginShare}get collapsedSize(){return this._effectiveBaseCollapsed+this._axis.marginShare}get configuredMinimumSize(){return this._baseMinimumSize}get configuredMaximumSize(){return this._expandedMaximumSize}get configuredCollapsedSize(){return this._baseCollapsedSize}constructor(e,t,i,n=Ql){var o,a,d;this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this.snap=!1,this.priority="low",this._isCollapsed=!1,this._isVisible=!0,this._tabSizeDisposables=new C,this._group=t,this._orientation=i,t.element.classList.add("dv-edge-group"),t.element.dataset.testid=`dv-edge-group-${e.id}`,this._baseCollapsedSize=(o=e.collapsedSize)!==null&&o!==void 0?o:35,this._baseMinimumSize=e.minimumSize,this._axis=n,this._expandedMaximumSize=(a=e.maximumSize)!==null&&a!==void 0?a:Number.POSITIVE_INFINITY,this._lastExpandedSize=(d=e.initialSize)!==null&&d!==void 0?d:200,e.collapsed&&(this._isCollapsed=!0,t.element.classList.add("dv-edge-collapsed")),this._observeTabStrip()}_observeTabStrip(){let e=this._group.element.querySelector(".dv-tabs-and-actions-container");e&&this._tabSizeDisposables.addDisposables(Ye(e,()=>{this._applyMeasuredTabSize(this._orientation==="vertical"?e.offsetHeight:e.offsetWidth)}))}_applyMeasuredTabSize(e){e<=0||e===this._measuredTabSize||(this._measuredTabSize=e,this._isCollapsed&&this._onDidChange.fire({size:this.collapsedSize}))}layout(e,t){!this._isCollapsed&&this._isVisible&&this._axis.size>0&&(this._lastExpandedSize=e+this._axis.marginShare),this._orientation==="horizontal"?this._group.layout(e,t):this._group.layout(t,e)}setCollapsed(e){this._isCollapsed!==e&&(this._isCollapsed=e,this._group.element.classList.toggle("dv-edge-collapsed",e))}setVisible(e){this._isVisible=e}restoreExpandedSize(e){this._lastExpandedSize=e}updateSizing(e,t){this._baseCollapsedSize=e,this._baseMinimumSize=t}dispose(){this._tabSizeDisposables.dispose(),this._onDidChange.dispose()}},tc=class{get element(){return this._dockviewElement}constructor(e,t){this._dockviewElement=e,this._layoutDockview=t,this.priority="high",this.minimumSize=100,this.maximumSize=Number.POSITIVE_INFINITY,this._onDidChange=new k,this.onDidChange=this._onDidChange.event}layout(e,t){this._layoutDockview(t,e)}setVisible(e){}dispose(){this._onDidChange.dispose()}},ic=class{get element(){return this._element}constructor(e,t=0){this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this.minimumSize=100,this.maximumSize=Number.POSITIVE_INFINITY,this.priority="high",this._element=document.createElement("div"),this._element.className="dv-shell-middle-column",this._element.style.height="100%",this._element.style.width="100%",this._splitview=new it(this._element,{orientation:"VERTICAL",proportionalLayout:!1,margin:t}),this._centerIndex=0,this._splitview.addView(e,{type:"distribute"},0)}addTopView(e,t){this._splitview.addView(e,t,0),this._topIndex=0,this._centerIndex+=1,this._bottomIndex!==void 0&&(this._bottomIndex+=1)}addBottomView(e,t){let i=this._splitview.length;this._splitview.addView(e,t,i),this._bottomIndex=i}removeView(e){let t=e==="top"?this._topIndex:this._bottomIndex;t!==void 0&&(this._splitview.removeView(t),e==="top"?(this._topIndex=void 0,this._centerIndex-=1,this._bottomIndex!==void 0&&(this._bottomIndex-=1)):this._bottomIndex=void 0)}layout(e,t){this._splitview.layout(t,e)}setVisible(e){}setViewVisible(e,t){let i=e==="top"?this._topIndex:this._bottomIndex;i!==void 0&&this._splitview.setViewVisible(i,t)}isViewVisible(e){let t=e==="top"?this._topIndex:this._bottomIndex;return t!==void 0?this._splitview.isViewVisible(t):!1}getViewSize(e){let t=e==="top"?this._topIndex:this._bottomIndex;return t!==void 0?this._splitview.getViewSize(t):0}getViewCachedVisibleSize(e){let t=e==="top"?this._topIndex:this._bottomIndex;if(t!==void 0)return this._splitview.getViewCachedVisibleSize(t)}resizeView(e,t){let i=e==="top"?this._topIndex:this._bottomIndex;i!==void 0&&this._splitview.resizeView(i,t)}get axis(){return this._splitview}updateMargin(e){this._splitview.margin=e}get disabled(){return this._splitview.disabled}set disabled(e){this._splitview.disabled=e}dispose(){this._onDidChange.dispose(),this._splitview.dispose()}},nc=class{constructor(e,t,i,n=0,o=35){this._disposables=new C,this._viewConfigs=new Map,this._pendingSizes=new Map,this._currentWidth=0,this._currentHeight=0,this._gap=n,this._defaultCollapsedSize=o,this._shellElement=document.createElement("div"),this._shellElement.className="dv-shell",this._shellElement.style.height="100%",this._shellElement.style.width="100%",this._shellElement.style.position="relative",e.appendChild(this._shellElement);let a=new tc(t,i);this._middleColumn=new ic(a,n),this._outerSplitview=new it(this._shellElement,{orientation:"HORIZONTAL",proportionalLayout:!1,margin:n}),this._middleIndex=0,this._outerSplitview.addView(this._middleColumn,{type:"distribute"},0),this._disposables.addDisposables(Ye(this._shellElement,d=>{if(!this._shellElement.offsetParent||!U(this._shellElement))return;let l=Math.round(d.contentRect.width),u=Math.round(d.contentRect.height);l===this._currentWidth&&u===this._currentHeight||this.layout(l,u)}),this._outerSplitview,this._middleColumn,a)}get element(){return this._shellElement}get locked(){return this._outerSplitview.disabled}set locked(e){this._outerSplitview.disabled=e,this._middleColumn.disabled=e}addEdgeView(e,t,i){if(this.hasEdgeGroup(e))throw new Error(`dockview: edge group already registered at position '${e}'`);this._viewConfigs.set(e,t);let n=new ec(N({collapsedSize:this._defaultCollapsedSize},t),i,yi(e)?"horizontal":"vertical",this._axisFor(e)),o=n.isCollapsed?n.collapsedSize:n.lastExpandedSize;switch(e){case"left":this._outerSplitview.addView(n,o,0),this._leftIndex=0,this._middleIndex+=1,this._rightIndex!==void 0&&(this._rightIndex+=1),this._leftView=n;break;case"right":{let a=this._outerSplitview.length;this._outerSplitview.addView(n,o,a),this._rightIndex=a,this._rightView=n}break;case"top":this._middleColumn.addTopView(n,o),this._topView=n;break;case"bottom":this._middleColumn.addBottomView(n,o),this._bottomView=n;break}return this._disposables.addDisposables(n),!n.isCollapsed&&!this._canResize(e)&&this._pendingSizes.set(e,o),this._relayout(),n}layoutFromElement(){if(!this._shellElement.offsetParent||!U(this._shellElement))return;let e=Math.round(this._shellElement.clientWidth),t=Math.round(this._shellElement.clientHeight);e===0||t===0||this.layout(e,t)}layout(e,t){this._currentWidth=e,this._currentHeight=t,this._outerSplitview.layout(e,t),this._flushPendingSizes()}updateTheme(e,t){this._gap=e,this._defaultCollapsedSize=t,this._outerSplitview.margin=e,this._middleColumn.updateMargin(e),this._applyThemeSizing(),this._relayout()}_hasSiblingOn(e){return yi(e)?this._leftView!==void 0&&this._rightView!==void 0:this._topView!==void 0&&this._bottomView!==void 0}_axisFor(e){return yi(e)?this._outerSplitview:this._middleColumn.axis}_applyThemeSizing(){for(let t of In){let i=this._getView(t),n=this._viewConfigs.get(t);if(i&&n){var e;i.updateSizing((e=n.collapsedSize)!==null&&e!==void 0?e:this._defaultCollapsedSize,n.minimumSize)}}}_relayout(){this._currentWidth>0&&this._currentHeight>0&&this.layout(this._currentWidth,this._currentHeight)}_slotSize(e){switch(e){case"left":return this._leftIndex===void 0?0:this._outerSplitview.getViewSize(this._leftIndex);case"right":return this._rightIndex===void 0?0:this._outerSplitview.getViewSize(this._rightIndex);case"top":case"bottom":return this._middleColumn.getViewSize(e)}}removeEdgeView(e){let t=this._getView(e);if(t){switch(e){case"left":this._outerSplitview.removeView(this._leftIndex),this._leftIndex=void 0,this._leftView=void 0,this._middleIndex-=1,this._rightIndex!==void 0&&(this._rightIndex-=1);break;case"right":this._outerSplitview.removeView(this._rightIndex),this._rightIndex=void 0,this._rightView=void 0;break;case"top":this._middleColumn.removeView("top"),this._topView=void 0;break;case"bottom":this._middleColumn.removeView("bottom"),this._bottomView=void 0;break}this._disposables.removeDisposable(t),t.dispose(),this._viewConfigs.delete(e),this._pendingSizes.delete(e),this._relayout()}}hasEdgeGroup(e){switch(e){case"top":return this._topView!==void 0;case"bottom":return this._bottomView!==void 0;case"left":return this._leftView!==void 0;case"right":return this._rightView!==void 0}}setEdgeGroupVisible(e,t){let i=this._getView(e)!==void 0&&t!==this.isEdgeGroupVisible(e);switch(e){case"left":this._leftIndex!==void 0&&this._outerSplitview.setViewVisible(this._leftIndex,t);break;case"right":this._rightIndex!==void 0&&this._outerSplitview.setViewVisible(this._rightIndex,t);break;case"top":case"bottom":this._middleColumn.setViewVisible(e,t);break}i&&this._gap>0&&this._hasSiblingOn(e)&&this._relayout(),t&&this._flushPendingSizes()}isEdgeGroupVisible(e){switch(e){case"left":return this._leftIndex!==void 0?this._outerSplitview.isViewVisible(this._leftIndex):!1;case"right":return this._rightIndex!==void 0?this._outerSplitview.isViewVisible(this._rightIndex):!1;case"top":case"bottom":return this._middleColumn.isViewVisible(e)}}setEdgeGroupCollapsed(e,t){let i=this._getView(e);i&&(i.setCollapsed(t),t?(this._pendingSizes.delete(e),this._resizeView(e,i.collapsedSize)):this.resizeEdgeGroup(e,i.lastExpandedSize))}resizeEdgeGroup(e,t){let i=this._getView(e);if(!i||!Number.isFinite(t))return;let n=Math.round(t);if(!(n<=0)){if(i.restoreExpandedSize(n),i.isCollapsed){this._pendingSizes.delete(e);return}this._canResize(e)?(this._pendingSizes.delete(e),this._resizeView(e,n)):this._pendingSizes.set(e,n)}}_canResize(e){return this.isEdgeGroupVisible(e)&&this._axisFor(e).size>0}_resizeView(e,t){switch(e){case"left":this._leftIndex!==void 0&&this._outerSplitview.resizeView(this._leftIndex,t);break;case"right":this._rightIndex!==void 0&&this._outerSplitview.resizeView(this._rightIndex,t);break;case"top":case"bottom":this._middleColumn.resizeView(e,t);break}}_flushPendingSizes(){if(this._pendingSizes.size!==0)for(let[e,t]of this._pendingSizes){let i=this._getView(e);!i||i.isCollapsed||!this._canResize(e)||(this._pendingSizes.delete(e),this._resizeView(e,t))}}isEdgeGroupCollapsed(e){var t,i;return(t=(i=this._getView(e))===null||i===void 0?void 0:i.isCollapsed)!==null&&t!==void 0?t:!1}getEdgeGroupExpandedSize(e){var t,i;return(t=(i=this._getView(e))===null||i===void 0?void 0:i.lastExpandedContentSize)!==null&&t!==void 0?t:0}_getView(e){switch(e){case"top":return this._topView;case"bottom":return this._bottomView;case"left":return this._leftView;case"right":return this._rightView}}toJSON(){let e={};for(let t of In){let i=this._getView(t);if(!i)continue;let n=this.isEdgeGroupVisible(t);e[t]={size:this._expandedSize(i,t,n),visible:n,collapsed:i.isCollapsed||void 0,minimumSize:i.configuredMinimumSize,maximumSize:Number.isFinite(i.configuredMaximumSize)?i.configuredMaximumSize:void 0,collapsedSize:i.configuredCollapsedSize}}return e}_expandedSize(e,t,i){if(e.isCollapsed)return e.lastExpandedSize;let n=this._pendingSizes.get(t);if(n!==void 0)return n;if(!i){var o;return(o=this._cachedVisibleSize(t))!==null&&o!==void 0?o:e.lastExpandedSize}return this._slotSize(t)}_cachedVisibleSize(e){switch(e){case"left":return this._leftIndex===void 0?void 0:this._outerSplitview.getViewCachedVisibleSize(this._leftIndex);case"right":return this._rightIndex===void 0?void 0:this._outerSplitview.getViewCachedVisibleSize(this._rightIndex);case"top":case"bottom":return this._middleColumn.getViewCachedVisibleSize(e)}}fromJSON(e){for(let i of In){var t;let n=e[i],o=this._getView(i);!n||!o||(o.restoreExpandedSize(n.size),o.setCollapsed((t=n.collapsed)!==null&&t!==void 0?t:!1),n.collapsed?(this._pendingSizes.delete(i),this._resizeView(i,o.collapsedSize)):this.resizeEdgeGroup(i,n.size),this.setEdgeGroupVisible(i,!!n.visible))}}dispose(){this._disposables.dispose(),this._shellElement.remove()}};function Nr(e){e.error?console.error("dockview: failed to create popout.",e.error):e.reason==="blocked"?console.error("dockview: failed to create popout. perhaps you need to allow pop-ups for this website"):console.error(`dockview: failed to create popout (${e.reason}).`)}function oc(e){var t;return new Cn((t=e.tabGroupColors)!==null&&t!==void 0?t:pi,e.tabGroupAccent!=="off")}function xi(e){let t=e.from.activePanel;[...e.from.panels].map(i=>{let n=e.from.model.removePanel(i);return e.from.model.renderContainer.detatch(i),n}).forEach(i=>{e.to.model.openPanel(i,{skipSetActive:t!==i,skipSetGroupActive:!0})})}let Mn=()=>({dispose:()=>{}}),rc=Mn;var Vr=class extends mn{fireDidCreateTabGroup(e){this._onDidCreateTabGroup.fire(e)}fireDidDestroyTabGroup(e){this._onDidDestroyTabGroup.fire(e)}fireDidAddPanelToTabGroup(e){this._onDidAddPanelToTabGroup.fire(e)}fireDidRemovePanelFromTabGroup(e){this._onDidRemovePanelFromTabGroup.fire(e)}fireDidTabGroupChange(e){this._onDidTabGroupChange.fire(e)}fireDidTabGroupCollapsedChange(e){this._onDidTabGroupCollapsedChange.fire(e)}get orientation(){return this.gridview.orientation}get totalPanels(){return this.panels.length}get panels(){return this.groups.flatMap(e=>e.panels)}get dndCapabilities(){return Ee(this.options)}get options(){return this._options}get tabGroupColorPalette(){return this._tabGroupColorPalette}get activePanel(){let e=this.activeGroup;if(e)return e.activePanel}get renderer(){var e;return(e=this.options.defaultRenderer)!==null&&e!==void 0?e:"onlyWhenVisible"}get defaultHeaderPosition(){var e;return(e=this.options.defaultHeaderPosition)!==null&&e!==void 0?e:"top"}get api(){return this._api}get floatingGroups(){var e,t;return(e=(t=this._moduleRegistry)===null||t===void 0||(t=t.services.floatingGroupService)===null||t===void 0?void 0:t.floatingGroups)!==null&&e!==void 0?e:[]}getFloatingWindowForGroup(e){var t;return(t=this._floatingGroupService)===null||t===void 0?void 0:t.findByGroup(e)}_gatherFloatingGroupBoxes(e){return this.getFloatingGroupSnapshots(e).map(t=>t.box)}getFloatingContainer(){var e;return(e=this._floatingOverlayHost)!==null&&e!==void 0?e:this.gridview.element}getFloatingGroupSnapshots(e){let t=this.getFloatingContainer().getBoundingClientRect();return this.floatingGroups.filter(i=>i.group!==e).map(i=>{let n=i.overlay.element.getBoundingClientRect();return{group:i.group,box:{left:n.left-t.left,top:n.top-t.top,width:n.width,height:n.height}}})}mergeFloatInto(e,t,i){e===t||!this.getPanel(t.id)||this.moveGroupOrPanel({from:{groupId:e.id},to:{group:t,position:i}})}getGridSplitterRects(){let e=this.getFloatingContainer().getBoundingClientRect(),t=[];return this.gridview.element.querySelectorAll(".dv-sash").forEach(i=>{let n=i.getBoundingClientRect();t.push({left:n.left-e.left,top:n.top-e.top,width:n.width,height:n.height})}),t}get _smartGuidesService(){return this._moduleRegistry.services.smartGuidesService}get smartGuidesEnabled(){var e,t;return(e=(t=this._smartGuidesService)===null||t===void 0?void 0:t.enabled)!==null&&e!==void 0?e:!1}setSmartGuidesEnabled(e){var t;(t=Ge(this._smartGuidesService,"SmartGuides","api.setSmartGuidesEnabled"))===null||t===void 0||t.setEnabled(e)}updateSmartGuidesOptions(e){var t;(t=Ge(this._smartGuidesService,"SmartGuides","api.updateSmartGuidesOptions"))===null||t===void 0||t.updateOptions(e)}get onDidSnapFloat(){var e,t;return(e=(t=this._smartGuidesService)===null||t===void 0?void 0:t.onDidSnapFloat)!==null&&e!==void 0?e:Mn}get onDidSnapTogether(){var e,t;return(e=(t=this._smartGuidesService)===null||t===void 0?void 0:t.onDidSnapTogether)!==null&&e!==void 0?e:Mn}_buildFloatingDragTransform(e,t){let i=this.options.transformFloatingGroupDrag,n=!t;if(!(!i&&!(n&&this._smartGuidesService)))return o=>{var a,d;let l=i?.({group:e,proposed:o.proposed,container:o.container,others:o.others,modifiers:o.modifiers}),u=l?N(N({},o.proposed),l):o.proposed,v=n?(a=this._smartGuidesService)===null||a===void 0?void 0:a.transformFloatingGroupDrag({group:e,proposed:u,container:o.container,others:o.others,modifiers:o.modifiers}):void 0;return(d=v??l)!==null&&d!==void 0?d:void 0}}get _floatingGroupService(){return this._moduleRegistry.services.floatingGroupService}get _popoutWindowService(){return this._moduleRegistry.services.popoutWindowService}get _watermarkService(){return this._moduleRegistry.services.watermarkService}get _edgeGroupService(){return this._moduleRegistry.services.edgeGroupService}get _rootDropTargetService(){return this._moduleRegistry.services.rootDropTargetService}get _advancedDnDService(){return this._moduleRegistry.services.advancedDnDService}get _dndCompassService(){return this._moduleRegistry.services.dndCompassService}canDropOnGroup(e,t,i){return e.model.canDisplayContentOverlay(i,t)}getDropOverlayElement(e){var t,i;let n=e.element.querySelector(".dv-content-container");if(n)return((t=this.options.theme)===null||t===void 0?void 0:t.dndPanelOverlay)==="group"&&(i=n.parentElement)!==null&&i!==void 0?i:n}getTabsListElement(e){return e.model.header.hidden?void 0:e.model.tabsListElement}relayoutGroup(e){e.relayout()}setForcedOverflow(e,t){e.model.header.setForcedOverflow(t)}getLayoutElement(){return this.gridview.element}getDropPositionResolver(){var e;if(this.options.dropPositionResolver)return this.options.dropPositionResolver;let t=(e=this._dndCompassService)===null||e===void 0?void 0:e.resolver,i=this._moduleRegistry.services.autoEdgeGroupService;return t&&i?{resolve:n=>{var o;return(o=i.resolveEdge(n))!==null&&o!==void 0?o:t.resolve(n)}}:t??i?.resolver}dockToLayoutEdge(e,t){let i=new Pn({nativeEvent:e,position:t,panel:void 0,api:this._api,group:void 0,getData:b,kind:"edge"});if(this._onWillDrop.fire(i),i.defaultPrevented)return;let n=b();if(n){var o;this.moveGroupOrPanel({from:{groupId:n.groupId,panelId:(o=n.panelId)!==null&&o!==void 0?o:void 0},to:{group:this.orthogonalize(t),position:"center"}})}else this._onDidDrop.fire(new bi({nativeEvent:e,position:t,panel:void 0,api:this._api,group:void 0,getData:b}))}get headerActionsService(){return this._moduleRegistry.services.headerActionsService}get _layoutHistoryService(){return this._moduleRegistry.services.layoutHistoryService}undo(){var e;(e=Ge(this._layoutHistoryService,"LayoutHistory","api.undo"))===null||e===void 0||e.undo()}redo(){var e;(e=Ge(this._layoutHistoryService,"LayoutHistory","api.redo"))===null||e===void 0||e.redo()}get canUndo(){var e,t;return(e=(t=this._layoutHistoryService)===null||t===void 0?void 0:t.canUndo)!==null&&e!==void 0?e:!1}get canRedo(){var e,t;return(e=(t=this._layoutHistoryService)===null||t===void 0?void 0:t.canRedo)!==null&&e!==void 0?e:!1}clearHistory(){var e;(e=this._layoutHistoryService)===null||e===void 0||e.clear()}get onDidChangeHistory(){var e,t;return(e=(t=this._layoutHistoryService)===null||t===void 0?void 0:t.onDidChangeHistory)!==null&&e!==void 0?e:rc}get hasEdgeDragReveal(){return!!this._moduleRegistry.services.autoEdgeGroupService}isGridEmpty(){return this.gridview.length===0}rootDropTargetOverrideTarget(){var e;return(e=this.rootDropTargetContainer)===null||e===void 0?void 0:e.model}dispatchUnhandledDragOver(e,t){let i=new kn(e,"edge",t,b);return this._onUnhandledDragOver.fire(i),i.isAccepted}fireWillDragPanel(e){this._onWillDragPanel.fire(e)}fireWillDragGroup(e){this._onWillDragGroup.fire(e)}fireWillDrop(e){this._onWillDrop.fire(e)}fireWillShowOverlay(e){this._onWillShowOverlay.fire(e)}buildGroupDragGhost(e){var t;return(t=this._advancedDnDService)===null||t===void 0?void 0:t.buildGroupDragGhost(e)}resolveDropOverlayModel(e,t){var i;return(i=this._advancedDnDService)===null||i===void 0?void 0:i.resolveOverlayModel(e,t)}get rootElement(){var e,t;return(e=(t=this._shellManager)===null||t===void 0?void 0:t.element)!==null&&e!==void 0?e:this.element}ownsElement(e){if(this.rootElement.contains(e))return!0;let t=this.rootElement.ownerDocument,i=e.ownerDocument;return!i||i===t?!1:this.getPopoutWindows().some(n=>n.document===i)}adjacentGroup(e,t){var i;if(e.api.location.type!=="grid")return;let n=se(e.element);return(i=t?this.gridview.previous(n):this.gridview.next(n))===null||i===void 0?void 0:i.view}adjacentGroupInDirection(e,t){if(e.api.location.type!=="grid")return;let i=e.element.getBoundingClientRect(),n=i.left+i.width/2,o=i.top+i.height/2,a,d=Number.POSITIVE_INFINITY;for(let l of this.groups){if(l===e||l.api.location.type!=="grid")continue;let u=l.element.getBoundingClientRect(),v=u.left+u.width/2-n,g=u.top+u.height/2-o,f;switch(t){case"left":f=v<0&&Math.abs(v)>=Math.abs(g);break;case"right":f=v>0&&Math.abs(v)>=Math.abs(g);break;case"up":f=g<0&&Math.abs(g)>=Math.abs(v);break;default:f=g>0&&Math.abs(g)>=Math.abs(v);break}if(!f)continue;let _=v*v+g*g;_<d&&(d=_,a=l)}return a}showDropPreview(e,t){var i,n;return(i=(n=this._advancedDnDService)===null||n===void 0?void 0:n.showPreviewOverlay(e,t))!==null&&i!==void 0?i:S.NONE}announce(e){var t;(t=this._moduleRegistry.services.liveRegionService)===null||t===void 0||t.announce(e)}dockPanel(e,t,i){this.moveGroupOrPanel({from:{groupId:e.group.id,panelId:e.id},to:{group:t,position:i}})}floatPanel(e){this.addFloatingGroup(e)}get contextMenuService(){return this._moduleRegistry.services.contextMenuService}get pinnedTabsService(){return this._moduleRegistry.services.pinnedTabsService}get advancedOverflowService(){return this._moduleRegistry.services.advancedOverflowService}setPanelPinned(e,t){var i;e.isPinned!==t&&!((i=this.options.pinnedTabs)===null||i===void 0)&&i.enabled&&this.pinnedTabsService&&(e.setPinned(t),this._onDidPanelPinnedChange.fire({panel:e,isPinned:t}))}get mountElement(){return this.gridview.element}hasVisibleGridGroup(){return this.groups.some(e=>e.api.location.type==="grid"&&e.api.isVisible)}fireLayoutChange(){this._bufferOnDidLayoutChange.fire()}get popoutRestorationPromise(){var e,t;return(e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.restorationPromise)!==null&&e!==void 0?e:Promise.resolve()}constructor(e,t){var i,n,o,a,d,l;super(e,{proportionalLayout:(i=t.proportionalLayout)!==null&&i!==void 0?i:!0,orientation:"HORIZONTAL",styles:t.hideBorders?{separatorBorder:"transparent"}:void 0,disableAutoResizing:t.disableAutoResizing,locked:t.locked,margin:(n=(o=t.theme)===null||o===void 0?void 0:o.gap)!==null&&n!==void 0?n:0,className:t.className}),this.nextGroupId=dn(),this._deserializer=new mr(this),this._moduleRegistry=new yl,this._onWillDragPanel=new k,this.onWillDragPanel=this._onWillDragPanel.event,this._onWillDragGroup=new k,this.onWillDragGroup=this._onWillDragGroup.event,this._onDidDrop=new k,this.onDidDrop=this._onDidDrop.event,this._onWillDrop=new k,this.onWillDrop=this._onWillDrop.event,this._mutationDepth=0,this._syncMutationDepth=0,this._pendingLocationChanges=new Map,this._openingPopoutWindows=new Set,this._origin="user",this._originDepth=0,this._onWillMutateLayout=new k,this.onWillMutateLayout=this._onWillMutateLayout.event,this._onDidMutateLayout=new k,this.onDidMutateLayout=this._onDidMutateLayout.event,this._onWillShowOverlay=new k,this.onWillShowOverlay=this._onWillShowOverlay.event,this._onUnhandledDragOver=new k,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this._onDidRemovePanel=new k,this.onDidRemovePanel=this._onDidRemovePanel.event,this._onDidAddPanel=new k,this.onDidAddPanel=this._onDidAddPanel.event,this._onDidPopoutGroupSizeChange=new k,this.onDidPopoutGroupSizeChange=this._onDidPopoutGroupSizeChange.event,this._onDidPopoutGroupPositionChange=new k,this.onDidPopoutGroupPositionChange=this._onDidPopoutGroupPositionChange.event,this._onDidAddPopoutGroup=new k,this.onDidAddPopoutGroup=this._onDidAddPopoutGroup.event,this._onDidRemovePopoutGroup=new k,this.onDidRemovePopoutGroup=this._onDidRemovePopoutGroup.event,this._onDidChangePopouts=new k,this.onDidChangePopouts=this._onDidChangePopouts.event,this._onDidOpenPopoutWindowFail=new k,this.onDidOpenPopoutWindowFail=this._onDidOpenPopoutWindowFail.event,this._onWillClosePopoutWindow=new k,this.onWillClosePopoutWindow=this._onWillClosePopoutWindow.event,this._onDidStartFloatingGroupDrag=new k,this.onDidStartFloatingGroupDrag=this._onDidStartFloatingGroupDrag.event,this._onDidEndFloatingGroupDrag=new k,this.onDidEndFloatingGroupDrag=this._onDidEndFloatingGroupDrag.event,this._onDidLayoutFromJSON=new k,this.onDidLayoutFromJSON=this._onDidLayoutFromJSON.event,this._onDidActivePanelChange=new k({replay:!0}),this.onDidActivePanelChange=this._onDidActivePanelChange.event,this._onDidPanelPinnedChange=new k,this.onDidPanelPinnedChange=this._onDidPanelPinnedChange.event,this._onDidMovePanel=new k,this.onDidMovePanel=this._onDidMovePanel.event,this._onDidCreateTabGroup=new k,this.onDidCreateTabGroup=this._onDidCreateTabGroup.event,this._onDidDestroyTabGroup=new k,this.onDidDestroyTabGroup=this._onDidDestroyTabGroup.event,this._onDidAddPanelToTabGroup=new k,this.onDidAddPanelToTabGroup=this._onDidAddPanelToTabGroup.event,this._onDidRemovePanelFromTabGroup=new k,this.onDidRemovePanelFromTabGroup=this._onDidRemovePanelFromTabGroup.event,this._onDidTabGroupChange=new k,this.onDidTabGroupChange=this._onDidTabGroupChange.event,this._onDidTabGroupCollapsedChange=new k,this.onDidTabGroupCollapsedChange=this._onDidTabGroupCollapsedChange.event,this._onDidMaximizedGroupChange=new k,this.onDidMaximizedGroupChange=this._onDidMaximizedGroupChange.event,this._inShellLayout=!1,this._onDidRemoveGroup=new k,this.onDidRemoveGroup=this._onDidRemoveGroup.event,this._onDidEdgeGroupAutoHideChange=new k,this.onDidEdgeGroupAutoHideChange=this._onDidEdgeGroupAutoHideChange.event,this._onDidAddGroup=new k,this.onDidAddGroup=this._onDidAddGroup.event,this._onDidOptionsChange=new k,this.onDidOptionsChange=this._onDidOptionsChange.event,this._onDidActiveGroupChange=new k,this.onDidActiveGroupChange=this._onDidActiveGroupChange.event,this._peekingGroups=new Set,this._moving=!1,this._options=t,this._tabGroupColorPalette=oc(t);let u=t.modules,v=u??[...Jl,...wr()];for(let _ of v)this._moduleRegistry.register(_);this._moduleRegistry.initialize(this),this.reportMissingOptionModules(t);let g=this._popoutWindowService;g&&this.addDisposables(g.onDidRemove(_=>{this._onDidRemovePopoutGroup.fire({id:_.popoutGroup.id,group:_.popoutGroup,window:_.getWindow()})})),this.popupService=new $r(this.element),this.addDisposables(this.popupService,S.from(()=>{for(let _ of this._openingPopoutWindows)_.dispose();this._openingPopoutWindows.clear()})),this._api=new li(this),this.disableResizing=!0,this.element.remove(),this._shellManager=new nc(e,this.element,(_,w)=>this._layoutFromShell(_,w),(a=(d=t.theme)===null||d===void 0?void 0:d.gap)!==null&&a!==void 0?a:0,(l=t.theme)===null||l===void 0?void 0:l.edgeGroupCollapsedSize),this._shellManager.locked=!!t.locked,this.popupService.updateRoot(this._shellManager.element),this._shellThemeClassnames=new Be(this._shellManager.element),this.rootDropTargetContainer=new An(this._shellManager.element,{disabled:!0}),this.floatingDropTargetContainer=new An(this._shellManager.element,{disabled:!1}),this.overlayRenderContainer=new Lr(this._shellManager.element,this),this._floatingOverlayHost=document.createElement("div"),this._floatingOverlayHost.className="dv-floating-overlay-host",this._shellManager.element.appendChild(this._floatingOverlayHost),A(this.gridview.element,"dv-dockview",!0),A(this.element,"dv-debug",!!t.debug),this.updateTheme(),t.debug&&this.addDisposables(new Zl(this)),this.addDisposables(S.from(()=>this._pendingLocationChanges.clear()),this.rootDropTargetContainer,this.floatingDropTargetContainer,M(this._shellManager.element,"dragend",()=>{var _,w;(_=this.rootDropTargetContainer.model)===null||_===void 0||_.clear(),(w=this.floatingDropTargetContainer.model)===null||w===void 0||w.clear()},!0),this.overlayRenderContainer,this._onWillDragPanel,this._onWillDragGroup,this._onWillShowOverlay,this._onDidActivePanelChange,this._onDidPanelPinnedChange,this._onDidAddPanel,this._onDidRemovePanel,this._onDidLayoutFromJSON,this._onDidDrop,this._onWillDrop,this._onWillMutateLayout,this._onDidMutateLayout,this._onDidMovePanel,this._onDidMovePanel.event(()=>{this.debouncedUpdateAllPositions()}),this._onDidAddGroup,this._onDidRemoveGroup,this._onDidEdgeGroupAutoHideChange,this._onDidActiveGroupChange,this._onUnhandledDragOver,this._onDidMaximizedGroupChange,this._onDidPopoutGroupSizeChange,this._onDidPopoutGroupPositionChange,this._onDidAddPopoutGroup,this._onDidRemovePopoutGroup,this._onDidChangePopouts,this._onDidAddPopoutGroup.event(()=>this._onDidChangePopouts.fire()),this._onDidRemovePopoutGroup.event(()=>this._onDidChangePopouts.fire()),this._onDidOpenPopoutWindowFail,this._onDidStartFloatingGroupDrag,this._onDidEndFloatingGroupDrag,this._onDidCreateTabGroup,this._onDidDestroyTabGroup,this._onDidAddPanelToTabGroup,this._onDidRemovePanelFromTabGroup,this._onDidTabGroupChange,this._onDidTabGroupCollapsedChange,$.any(this.onDidPopoutGroupSizeChange,this.onDidPopoutGroupPositionChange,this.onDidCreateTabGroup,this.onDidDestroyTabGroup,this.onDidAddPanelToTabGroup,this.onDidRemovePanelFromTabGroup,this.onDidTabGroupChange,this.onDidTabGroupCollapsedChange)(()=>{this.fireLayoutChange()}),this._onDidOptionsChange,this.onDidAdd(_=>{this._moving||this._onDidAddGroup.fire(_)}),this.onDidRemove(_=>{this._moving||this._onDidRemoveGroup.fire(_)}),this.onDidActiveChange(_=>{this._moving||this._onDidActiveGroupChange.fire(_)}),this.onDidMaximizedChange(_=>{this._onDidMaximizedGroupChange.fire({group:_.panel,isMaximized:_.isMaximized})}),$.any(this.onDidAddPanel,this.onDidRemovePanel,this.onDidAddGroup,this.onDidRemove,this.onDidRemoveGroup,this.onDidMovePanel,this.onDidActivePanelChange)(()=>{this._bufferOnDidLayoutChange.fire()}),S.from(()=>{var _;this._moduleRegistry.dispose(),(_=this._shellManager)===null||_===void 0||_.dispose()}),this._onWillClosePopoutWindow);let f=this._rootDropTargetService;f&&this.addDisposables(f.onWillShowOverlay(_=>{this.gridview.length>0&&_.position==="center"||this._onWillShowOverlay.fire(new St(_,{kind:"edge",panel:void 0,api:this._api,group:void 0,getData:b}))}),f.onDrop(_=>this.dockToLayoutEdge(_.nativeEvent,_.position))),this._moduleRegistry.postConstruct(this),this._shellManager.layoutFromElement()}setVisible(e,t){switch(e.api.location.type){case"grid":super.setVisible(e,t);break;case"floating":{let i=this.floatingGroups.find(n=>n.group===e);i&&(i.overlay.setVisible(t),e.api._onDidVisibilityChange.fire({isVisible:t}));break}case"popout":console.warn("dockview: You cannot hide a group that is in a popout window");break;case"edge":break}}getPopupServiceForGroup(e){var t,i;return(t=(i=this._popoutWindowService)===null||i===void 0||(i=i.findByGroup(e))===null||i===void 0?void 0:i.popupService)!==null&&t!==void 0?t:this.popupService}addPopoutGroup(e,t){return this.mutationAsync("popout",()=>this._doAddPopoutGroup(e,t))}getPopouts(){var e,t;return(e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.entries.map(i=>({id:i.popoutGroup.id,group:i.popoutGroup,window:i.getWindow()})))!==null&&e!==void 0?e:[]}getPopoutWindows(){return this.getPopouts().map(e=>e.window)}_doAddPopoutGroup(e,t){var i,n,o,a,d;let l=Ge(this._popoutWindowService,"PopoutWindow","api.addPopoutGroup");if(!l||e instanceof Ht&&e.model.location.type==="edge")return Promise.resolve(!1);if(e instanceof ct&&e.group.size===1&&this.closeEmptyGroups)return this.addPopoutGroup(e.group,t);let u=xe(this.gridview.element),v=this.element;function g(){var z,P;if(t?.position)return t.position;let I=(e instanceof Ht?e.element:(z=(P=e.group)===null||P===void 0?void 0:P.element)!==null&&z!==void 0?z:v).getBoundingClientRect();return{left:window.screenX+I.left,top:window.screenY+I.top,width:I.width,height:I.height}}let f=g(),_=(i=t==null||(n=t.overridePopoutGroup)===null||n===void 0?void 0:n.id)!==null&&i!==void 0?i:this.getNextGroupId(),w=(o=t?.popoutUrl)!==null&&o!==void 0?o:(a=this.options)===null||a===void 0?void 0:a.popoutUrl,y=w??"/popout.html",D=new Ja(`${this.id}-${_}`,u??"",{url:y,left:f.left,top:f.top,width:f.width,height:f.height,onDidOpen:t?.onDidOpen,onWillClose:z=>{var P;t==null||(P=t.onWillClose)===null||P===void 0||P.call(t,z),this._onWillClosePopoutWindow.fire(z)},nonce:(d=this.options)===null||d===void 0?void 0:d.nonce,styleRoot:()=>this.element.getRootNode()}),G=new C(D,D.onDidClose(()=>{G.dispose()}));this._openingPopoutWindows.add(G);let T=rn(y);return(T?Promise.resolve(null):D.open()).then(z=>{var P,I;if(this._openingPopoutWindows.delete(G),this.isDisposed)return G.dispose(),!1;if(D.isDisposed){let ve=D.failure;return ve&&!this.isDisposed&&(Nr(ve),this._onDidOpenPopoutWindowFail.fire(ve)),!1}let W=(P=t?.referenceGroup)!==null&&P!==void 0?P:e instanceof ct?e.group:e,H=e.api.location.type,O=W.element.parentElement!==null,L;if(t?.overridePopoutGridview){var X;L=(X=t.overridePopoutGroup)!==null&&X!==void 0?X:W}else O?t?.overridePopoutGroup?L=t.overridePopoutGroup:(L=this.createGroup({id:_}),z&&this._onDidAddGroup.fire(L)):L=W;if(z===null){var V;return this.handleBlockedPopout({group:L,referenceGroup:W,options:t,popoutWindowDisposable:G,failure:T?{reason:"url-refused",error:T}:(V=D.failure)!==null&&V!==void 0?V:{reason:"blocked"}}),!1}let F=document.createElement("div");F.className="dv-overlay-render-container";let ie=new Lr(F,this);L.model.renderContainer=ie;let Z=(I=t?.overridePopoutGridview)!==null&&I!==void 0?I:this.createNestedGridview();t?.overridePopoutGridview?Z.locked=this.gridview.locked:Z.addView(L,he.Distribute,[0]),Z.element.style.width="100%",Z.element.style.height="100%",Z.layout(D.window.innerWidth,D.window.innerHeight);let ee=!1,ge=()=>{ee||(ee=!0,Z.dispose())},ne,Q=[];if(!t?.overridePopoutGroup&&!t?.overridePopoutGridview&&O)if(e instanceof ct){let ve=e.group;this.movingLock(()=>{let we=W.model.removePanel(e);L.model.openPanel(we)}),Q=[{panel:e,from:ve}]}else switch(this.movingLock(()=>xi({from:W,to:L})),Q=L.panels.map(ve=>({panel:ve,from:W})),H){case"grid":W.api.setVisible(!1);break;case"floating":case"popout":var Pe;ne=(Pe=this.floatingGroups.find(ve=>ve.group.api.id===e.api.id))===null||Pe===void 0?void 0:Pe.overlay.toJSON(),this.removeGroup(W);break}z.classList.add("dv-dockview"),z.style.overflow="hidden",z.appendChild(F),z.appendChild(Z.element);let ht=document.createElement("div"),ut=new An(ht,{disabled:this.rootDropTargetContainer.disabled});z.appendChild(ht),L.model.dropTargetContainer=ut;let Jr=new $r(z,D.window);if(G.addDisposables(Jr),L.model.location={type:"popout",getWindow:()=>D.window,popoutUrl:w},t?.overridePopoutGridview){let ve=this.groups.filter(we=>Z.element.contains(we.element));for(let we of ve)we.model.renderContainer=ie,we.model.dropTargetContainer=ut,we.model.location={type:"popout",getWindow:()=>D.window,popoutUrl:w}}O&&e.api.location.type==="grid"&&e.api.setVisible(!1),this.doSetGroupAndPanelActive(L);let qr=l.observeGridviewSize(D,Z,ie);qr&&G.addDisposables(qr);let Kr=new E;G.addDisposables(Kr);let Zr=ve=>{Kr.value=new C(ve.api.onDidActiveChange(we=>{if(we.isActive){var Ln;(Ln=D.window)===null||Ln===void 0||Ln.focus()}}),ve.api.onWillFocus(()=>{var we;(we=D.window)===null||we===void 0||we.focus()}))};Zr(L);let jr={},uc=O&&W&&this.getPanel(W.id),pt={window:D,popoutGroup:L,gridview:Z,overlayRenderContainer:ie,dropTargetContainer:ut,getWindow:()=>D.window,popoutUrl:w,referenceGroup:uc?W.id:void 0,popupService:Jr,setAnchorGroup:ve=>{pt.popoutGroup=ve,Zr(ve)},disposable:{dispose:()=>(G.dispose(),jr.returnedGroup)}},Qr=Xe(D.window);G.addDisposables(Qr,Lt(D.window,()=>{this._onDidPopoutGroupSizeChange.fire({width:D.window.innerWidth,height:D.window.innerHeight,group:pt.popoutGroup})}),Qr.event(()=>{this._onDidPopoutGroupPositionChange.fire({screenX:D.window.screenX,screenY:D.window.screenY,group:pt.popoutGroup})}),M(D.window,"resize",()=>{Z.layout(D.window.innerWidth,D.window.innerHeight)}),ie,S.from(()=>this.disposePopoutWindow({group:L,referenceGroup:W,popoutGridview:Z,isGroupAddedToDom:O,floatingBox:ne,disposePopoutGridview:ge,closeResult:jr}))),l.add(pt),this._onDidAddPopoutGroup.fire({id:pt.popoutGroup.id,group:pt.popoutGroup,window:pt.getWindow()});for(let{panel:ve,from:we}of Q)this.fireDidMovePanel(ve,we);return!0}).catch(z=>(this._openingPopoutWindows.delete(G),console.error("dockview: failed to create popout.",z),!1))}handleBlockedPopout(e){let{group:t,referenceGroup:i,options:n,popoutWindowDisposable:o,failure:a}=e;if(Nr(a),o.dispose(),this._onDidOpenPopoutWindowFail.fire(a),n?.overridePopoutGridview){let d=n.overridePopoutGridview,l=this.groups.filter(u=>d.element.contains(u.element));for(let u of l)this.movingLock(()=>{d.remove(u),this.redockGroupToMainGrid(u)});d.dispose(),i&&!i.api.isVisible&&i.api.setVisible(!0);return}t===i?this.gridview.element.contains(t.element)||(this.movingLock(()=>this.doAddGroup(t,[0])),t.model.location={type:"grid"}):(this.movingLock(()=>xi({from:t,to:i})),t.model.size===0&&this._groups.has(t.id)&&(t.dispose(),this._groups.delete(t.id),this._onDidRemoveGroup.fire(t))),i.api.isVisible||i.api.setVisible(!0)}redockGroupToMainGrid(e){e.model.renderContainer=this.overlayRenderContainer,e.model.dropTargetContainer=this.rootDropTargetContainer,e.model.location={type:"grid"},this.doAddGroup(e,[0])}disposePopoutWindow(e){var t;let{group:i,referenceGroup:n,popoutGridview:o,isGroupAddedToDom:a,floatingBox:d,disposePopoutGridview:l,closeResult:u}=e;if(this.isDisposed){l();return}let v=!!(!((t=this._popoutWindowService)===null||t===void 0)&&t.entries.find(y=>y.gridview===o)),g=this.groups.filter(y=>o.element.contains(y.element)),f=g.includes(i),_=f&&g.length===1,w=[];if(v){for(let y of g)if(y!==i){this.movingLock(()=>{this.doRemoveGroup(y,{skipDispose:!0,skipActive:!0,skipPopoutReturn:!0}),this.redockGroupToMainGrid(y)});for(let D of y.panels)w.push({panel:D,from:y})}}if(f&&a&&this.getPanel(n.id)){let y=[...i.panels];this.movingLock(()=>xi({from:i,to:n}));for(let D of y)w.push({panel:D,from:i});n.api.isVisible||n.api.setVisible(!0),this.getPanel(i.id)&&this.doRemoveGroup(i,{skipPopoutAssociated:!0})}else if(f&&this.getPanel(i.id)){if(i.model.renderContainer=this.overlayRenderContainer,i.model.dropTargetContainer=this.rootDropTargetContainer,u.returnedGroup=i,!v){l();return}if(d&&_)this.addFloatingGroup(i,{height:d.height,width:d.width,position:d});else{this.doRemoveGroup(i,{skipDispose:!0,skipActive:!0,skipPopoutReturn:!0}),i.model.location={type:"grid"},this.movingLock(()=>{this.doAddGroup(i,[0])});for(let y of i.panels)w.push({panel:y,from:i})}this.doSetGroupAndPanelActive(i)}l();for(let{panel:y,from:D}of w)this.fireDidMovePanel(y,D)}addFloatingGroup(e,t){this.mutation("float",()=>this._doAddFloatingGroup(e,t))}_doAddFloatingGroup(e,t){if(!Ge(this._floatingGroupService,"FloatingGroup","api.addFloatingGroup")||e instanceof Ht&&e.model.location.type==="edge")return;let i,n=[];if(e instanceof ct){let u=e.group;i=this.createGroup(),this._onDidAddGroup.fire(i),this.movingLock(()=>this.removePanel(e,{removeEmptyGroup:!1,skipDispose:!0,skipSetActiveGroup:!0})),this.removeGroupIfEmpty(u),this.movingLock(()=>i.model.openPanel(e,{skipSetGroupActive:!0})),n=[{panel:e,from:u}]}else{var o;i=e;let u=(o=this._popoutWindowService)===null||o===void 0?void 0:o.findReferenceGroupId(i),v=u?this.getPanel(u):void 0;typeof t?.skipRemoveGroup=="boolean"&&t.skipRemoveGroup||(v?(this.movingLock(()=>xi({from:e,to:v})),this.doRemoveGroup(e,{skipPopoutReturn:!0,skipPopoutAssociated:!0}),this.doRemoveGroup(v,{skipDispose:!0}),i=v,n=i.panels.map(g=>({panel:g,from:e}))):(this.doRemoveGroup(e,{skipDispose:!0,skipPopoutReturn:!0,skipPopoutAssociated:!1}),n=i.panels.map(g=>({panel:g,from:i}))))}function a(){if(t?.position){let u={};return"left"in t.position?u.left=Math.max(t.position.left,0):"right"in t.position?u.right=Math.max(t.position.right,0):u.left=nt.left,"top"in t.position?u.top=Math.max(t.position.top,0):"bottom"in t.position?u.bottom=Math.max(t.position.bottom,0):u.top=nt.top,typeof t.width=="number"?u.width=Math.max(t.width,0):u.width=nt.width,typeof t.height=="number"?u.height=Math.max(t.height,0):u.height=nt.height,u}return{left:typeof t?.x=="number"?Math.max(t.x,0):nt.left,top:typeof t?.y=="number"?Math.max(t.y,0):nt.top,width:typeof t?.width=="number"?Math.max(t.width,0):nt.width,height:typeof t?.height=="number"?Math.max(t.height,0):nt.height}}let d=a(),l=this.createNestedGridview();l.addView(i,he.Distribute,[0]),this.mountFloatingWindow(l,i,[i],d,{dragHandle:t?.dragHandle,inDragMode:t?.inDragMode,skipActiveGroup:t?.skipActiveGroup,disableSmartGuides:t?.disableSmartGuides});for(let{panel:u,from:v}of n)this.fireDidMovePanel(u,v)}get closeEmptyGroups(){return this.options.closeEmptyGroups!==!1}keepEmptyGroups(e){var t;return(t=e.keepEmptyGroups)!==null&&t!==void 0?t:!this.closeEmptyGroups}removeGroupIfEmpty(e){e.model.size===0&&this.closeEmptyGroups&&this.doRemoveGroup(e,{skipActive:!0})}get locked(){return this.gridview.locked}set locked(e){this.gridview.locked=e,this._shellManager&&(this._shellManager.locked=e);for(let t of this.nestedGridviews())t.locked=e}nestedGridviews(){var e,t;return[...this.floatingGroups.map(i=>i.gridview),...((e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.entries)!==null&&e!==void 0?e:[]).map(i=>i.gridview)]}createNestedGridview(e="HORIZONTAL"){var t,i;return new vn(this.gridview.proportionalLayout,this.options.hideBorders?{separatorBorder:"transparent"}:void 0,e,this.gridview.locked,(t=(i=this.options.theme)===null||i===void 0?void 0:i.gap)!==null&&t!==void 0?t:0)}mountFloatingWindow(e,t,i,n,o){var a,d,l,u,v,g,f,_,w;let y=Ge(this._floatingGroupService,"FloatingGroup","api.addFloatingGroup");if(!y)return;let D=((a=(d=o?.dragHandle)!==null&&d!==void 0?d:this.options.floatingGroupDragHandle)!==null&&a!==void 0?a:"titlebar")==="titlebar"?new _l(this,t):void 0,G=new En(N(N({container:(l=this._floatingOverlayHost)!==null&&l!==void 0?l:this.gridview.element,content:e.element,header:D?.element},n),{},{minimumInViewportWidth:this.options.floatingGroupBounds==="boundedWithinViewport"?void 0:(u=(v=this.options.floatingGroupBounds)===null||v===void 0?void 0:v.minimumWidthWithinViewport)!==null&&u!==void 0?u:100,minimumInViewportHeight:this.options.floatingGroupBounds==="boundedWithinViewport"?void 0:(g=(f=this.options.floatingGroupBounds)===null||f===void 0?void 0:f.minimumHeightWithinViewport)!==null&&g!==void 0?g:100,transformDragPosition:this._buildFloatingDragTransform(t,(_=o?.disableSmartGuides)!==null&&_!==void 0?_:!1),getSiblingBoxes:()=>this._gatherFloatingGroupBoxes(t)})),T=(w=D?.element)!==null&&w!==void 0?w:t.element.querySelector(".dv-void-container");if(!T)throw new Error("dockview: failed to find drag handle");G.setupDrag(T,{inDragMode:typeof o?.inDragMode=="boolean"?o.inDragMode:!1});let z=y.add(t,G,e);z.addDisposables(G.onDidStartMoving(()=>this._onDidStartFloatingGroupDrag.fire(t)),G.onDidChangeEnd(()=>this._onDidEndFloatingGroupDrag.fire(t))),D&&(z.setTitleBar(D),z.addDisposables(D,S.from(()=>z.setTitleBar(void 0)),D.onDragStart(P=>{this._onWillDragGroup.fire({nativeEvent:P,group:z.group})})));for(let P of i)P.model.location={type:"floating"};o?.skipActiveGroup||this.doSetGroupAndPanelActive(t)}orthogonalize(e,t){switch(this.gridview.normalize(),e){case"top":case"bottom":this.gridview.orientation==="HORIZONTAL"&&this.gridview.insertOrthogonalSplitviewAtRoot();break;case"left":case"right":this.gridview.orientation==="VERTICAL"&&this.gridview.insertOrthogonalSplitviewAtRoot();break;default:break}switch(e){case"top":case"left":case"center":return this.createGroupAtLocation([0],void 0,t);case"bottom":case"right":return this.createGroupAtLocation([this.gridview.length],void 0,t);default:throw new Error(`dockview: unsupported position ${e}`)}}updateOptions(e){var t,i;super.updateOptions(e),this.reportMissingOptionModules(e),(t=this._floatingGroupService)===null||t===void 0||t.updateBounds(e),(i=this._rootDropTargetService)===null||i===void 0||i.setOptions(e);let n=this.options.disableDnd,o=this.options.dndStrategy;this._options=N(N({},this.options),e);let a=this.options.disableDnd,d=this.options.dndStrategy;if((n!==a||o!==d)&&this.updateDragAndDropState(),"proportionalLayout"in e){let g=this.gridview.proportionalLayout;for(let f of this.nestedGridviews())f.proportionalLayout=g}if("theme"in e&&this.updateTheme(),"createRightHeaderActionComponent"in e||"createLeftHeaderActionComponent"in e||"createPrefixHeaderActionComponent"in e){var l;(l=this.headerActionsService)===null||l===void 0||l.refreshAll()}if("createWatermarkComponent"in e){var u;(u=this._watermarkService)===null||u===void 0||u.refresh();for(let g of this.groups)g.model.refreshWatermark()}if("tabGroupColors"in e||"tabGroupAccent"in e){var v;this._tabGroupColorPalette.setEntries((v=this._options.tabGroupColors)!==null&&v!==void 0?v:pi),this._tabGroupColorPalette.enabled=this._options.tabGroupAccent!=="off";for(let g of this.groups)g.model.refreshTabGroupAccent()}this._onDidOptionsChange.fire(),this._layoutFromShell(this.gridview.width,this.gridview.height)}reportMissingOptionModules(e){kl(e,t=>this._moduleRegistry.has(t))}layout(e,t,i){var n;this._shellManager&&!this._inShellLayout?this._shellManager.layout(e,t):super.layout(e,t,i),this._syncFloatingOverlayHost(),(n=this._moduleRegistry)===null||n===void 0||(n=n.services.floatingGroupService)===null||n===void 0||n.constrainBounds()}_syncFloatingOverlayHost(){if(!this._floatingOverlayHost||!this._shellManager)return;let e=this._shellManager.element.getBoundingClientRect(),t=this.element.getBoundingClientRect(),i=this._floatingOverlayHost;i.style.left=`${t.left-e.left}px`,i.style.top=`${t.top-e.top}px`,i.style.width=`${t.width}px`,i.style.height=`${t.height}px`}_layoutFromShell(e,t){this._inShellLayout=!0,this.layout(e,t,!0),this._inShellLayout=!1}forceRelayout(){this._shellManager?this._layoutFromShell(this.width,this.height):super.forceRelayout()}addEdgeGroup(e,t){let i=this._edgeGroupService;if(!i)throw new Error(fr("EdgeGroup","api.addEdgeGroup"));if(i.has(e))throw new Error(`dockview: edge group already exists at position '${e}'`);return this.mutation("add",()=>{let n=this.createGroup({id:t.id});n.model.location={type:"edge",position:e},n.model.headerPosition=e;let o=n.onDidChange(d=>{var l;if(!d)return;let u=yi(e)?d.width:d.height;typeof u=="number"&&((l=this._shellManager)===null||l===void 0||l.resizeEdgeGroup(e,u))}),a=n.model.onDidRemovePanel(()=>{n.model.isEmpty&&(i.isAutoReveal(n)?queueMicrotask(()=>{var d;n.model.isEmpty&&(!((d=this._edgeGroupService)===null||d===void 0)&&d.includes(n))&&this.removeEdgeGroup(e)}):this.setEdgeGroupCollapsed(n,!0))});return i.add(e,n,new C(a,o)),t.autoHide!==void 0&&i.setAutoHide(n,t.autoHide),t.autoReveal!==void 0&&i.setAutoReveal(n,t.autoReveal),this._onDidAddGroup.fire(n),this._shellManager.addEdgeView(e,t,n),n.api})}revealEdgeGroupWithData(e,t,i){let n=this._edgeGroupService;n&&this.mutation("add",()=>{var o;let a=n.get(e);a||(this.addEdgeGroup(e,{id:this.getNextGroupId(),autoReveal:!0,autoHide:i?.autoHide,collapsed:!0}),a=n.get(e)),a&&this.moveGroupOrPanel({from:{groupId:t.groupId,panelId:(o=t.panelId)!==null&&o!==void 0?o:void 0},to:{group:a,position:"center"}})})}getEdgeGroup(e){var t;return(t=this._edgeGroupService)===null||t===void 0||(t=t.get(e))===null||t===void 0?void 0:t.api}getEdgeGroupPanel(e){var t;return(t=this._edgeGroupService)===null||t===void 0?void 0:t.get(e)}pinEdgeGroup(e){var t;(t=Ge(this._moduleRegistry.services.autoHideEdgeGroupService,"AutoHideEdgeGroup","api.pinEdgeGroup"))===null||t===void 0||t.pin(e)}autoHideEdgeGroup(e){var t;(t=Ge(this._moduleRegistry.services.autoHideEdgeGroupService,"AutoHideEdgeGroup","api.autoHideEdgeGroup"))===null||t===void 0||t.autoHide(e)}peekEdgeGroup(e,t){var i;(i=Ge(this._moduleRegistry.services.autoHideEdgeGroupService,"AutoHideEdgeGroup","api.peekEdgeGroup"))===null||i===void 0||i.peek(e,t)}get overlayRoot(){return this.rootElement}getDropZoneRect(){return this.element.getBoundingClientRect()}getEdgeGroupExpandedSize(e){var t,i;return(t=(i=this._shellManager)===null||i===void 0?void 0:i.getEdgeGroupExpandedSize(e))!==null&&t!==void 0?t:0}repositionPanelOverlay(e,t,i){this.overlayRenderContainer.repositionPanelOverlay(e.api.id,t,i)}setEdgeGroupVisible(e,t){this._shellManager.setEdgeGroupVisible(e,t)}isEdgeGroupVisible(e){return this._shellManager.isEdgeGroupVisible(e)}removeEdgeGroup(e){let t=Ge(this._edgeGroupService,"EdgeGroup","api.removeEdgeGroup");if(!t)return;let i=t.get(e);if(!i)throw new Error(`dockview: no edge group exists at position '${e}'`);this.mutation("remove",()=>{for(let n of[...i.panels])this.removePanel(n,{removeEmptyGroup:!1,skipDispose:!1});this._shellManager.removeEdgeView(e),t.remove(e),i.dispose(),this._groups.delete(i.id),this._onDidRemoveGroup.fire(i),this.activateFallbackGroupIfRemoved(i)})}setEdgeGroupCollapsed(e,t){var i;let n=(i=this._edgeGroupService)===null||i===void 0?void 0:i.findPositionOf(e);n&&this._shellManager.isEdgeGroupCollapsed(n)!==t&&(this._shellManager.setEdgeGroupCollapsed(n,t),e.api._onDidCollapsedChange.fire({isCollapsed:t}))}isEdgeGroupCollapsed(e){var t;let i=(t=this._edgeGroupService)===null||t===void 0?void 0:t.findPositionOf(e);return i?this._shellManager.isEdgeGroupCollapsed(i):!1}isEdgeGroupPeeking(e){return this._peekingGroups.has(e)}setEdgeGroupPeeking(e,t){this._peekingGroups.has(e)!==t&&(t?this._peekingGroups.add(e):this._peekingGroups.delete(e),e.api._onDidPeekChange.fire({isPeeking:t}))}isEdgeGroupAutoHide(e){var t,i;let n=(t=this._edgeGroupService)===null||t===void 0?void 0:t.isAutoHide(e);if(n!==void 0)return n;let o=(i=this._edgeGroupService)===null||i===void 0?void 0:i.findPositionOf(e);return o===void 0?!1:ir(this.options.autoHideEdgeGroups,o)}setEdgeGroupAutoHide(e,t){let i=this._edgeGroupService;i?.includes(e)&&(i.setAutoHide(e,t),this._onDidEdgeGroupAutoHideChange.fire(e))}updateDragAndDropState(){for(let e of this.groups)e.model.updateDragAndDropState()}focus(){var e;(e=this.activeGroup)===null||e===void 0||e.focus()}getGroupPanel(e){return this.panels.find(t=>t.id===e)}setActivePanel(e){e.group.model.openPanel(e),this.doSetGroupAndPanelActive(e.group)}activateNext(e={}){var t;if(!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}if(e.includePanel&&e.group&&e.group.activePanel!==e.group.panels[e.group.panels.length-1]){e.group.model.moveToNext({suppressRoll:!0});return}let i=se(e.group.element),n=(t=this.gridview.next(i))===null||t===void 0?void 0:t.view;this.doSetGroupAndPanelActive(n)}activatePrevious(e={}){var t;if(!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}if(e.includePanel&&e.group&&e.group.activePanel!==e.group.panels[0]){e.group.model.moveToPrevious({suppressRoll:!0});return}let i=se(e.group.element),n=(t=this.gridview.previous(i))===null||t===void 0?void 0:t.view;n&&this.doSetGroupAndPanelActive(n)}toJSON(){var e,t,i,n,o;let a=this.gridview.serialize(),d=this.panels.reduce((f,_)=>(f[_.id]=_.toJSON(),f),{}),l=(e=(t=this._floatingGroupService)===null||t===void 0?void 0:t.serialize())!==null&&e!==void 0?e:[],u=(i=(n=this._popoutWindowService)===null||n===void 0?void 0:n.serialize())!==null&&i!==void 0?i:[],v={grid:a,panels:d,activeGroup:(o=this.activeGroup)===null||o===void 0?void 0:o.id};l.length>0&&(v.floatingGroups=l),u.length>0&&(v.popoutGroups=u);let g=this._serializeEdgeGroups();return g&&(v.edgeGroups=g),v}_serializeEdgeGroups(){var e;if(!(!((e=this._edgeGroupService)===null||e===void 0)&&e.hasAny()))return;let t=this._shellManager.toJSON();for(let[i,n]of this._edgeGroupService.entries()){let o=t[i];if(!o)continue;if(this._edgeGroupService.isAutoReveal(n)&&n.model.isEmpty){delete t[i];continue}o.group=n.toJSON(),this._edgeGroupService.isAutoReveal(n)&&(o.autoReveal=!0);let a=this._edgeGroupService.isAutoHide(n);a!==void 0&&(o.autoHide=a)}return t}fromJSON(e,t){this.mutation("load",()=>this._doFromJSON(e,t))}_doFromJSON(e,t){var i,n;if((i=this._popoutWindowService)===null||i===void 0||i.cancelPendingRestorations(),typeof e!="object"||e===null)throw new Error("dockview: serialized layout must be a non-null object");if(!e.grid||((n=e.grid.root)===null||n===void 0?void 0:n.type)!=="branch"||!Array.isArray(e.grid.root.data))throw new Error("dockview: root must be of type branch");let o=new Map,a=new Map,d=[],l=[],u=()=>{for(let P of l)try{P.dispose()}catch(I){console.error("dockview: failed to dispose a temporary group created for reuseExistingPanels",I)}l.length=0};if(t?.reuseExistingPanels){let P=Object.keys(e.panels),I,W=()=>{let H=this.createGroup(),O=this._groups.get(H.api.id);return this._groups.delete(H.api.id),l.push(S.from(()=>{var L;this.movingLock(()=>{for(let X of H.panels.slice())H.model.removePanel(X)}),O?.disposable.dispose(),(L=this.headerActionsService)===null||L===void 0||L.disposeGroup(H),H.dispose()})),H};try{for(let H of this.panels)if(P.includes(H.api.id)){o.set(H.api.id,H);let O;if(H.api.renderer==="always"&&H.api.isVisible)O=W();else{var v;(v=I)!==null&&v!==void 0||(I=W()),O=I}a.set(H.api.id,O),d.push({panel:H,temporaryGroup:O})}this.movingLock(()=>{d.forEach(({panel:H,temporaryGroup:O})=>{this.moveGroupOrPanel({from:{groupId:H.api.group.api.id,panelId:H.api.id},to:{group:O,position:"center"},keepEmptyGroups:!0})})}),this.clear()}catch(H){throw u(),H}}else this.clear();let{grid:g,panels:f,activeGroup:_}=e;try{var w,y,D,G,T;let P=this.width,I=this.height,W=O=>{let{id:L,locked:X,hideHeader:V,headerPosition:F,views:ie,activeView:Z}=O;if(typeof L!="string")throw new TypeError("dockview: group id must be of type string");let ee=this.createGroup({id:L,locked:!!X,hideHeader:!!V,headerPosition:F});this._onDidAddGroup.fire(ee);let ge=[],ne=ie.filter(Q=>f[Q]);for(let Q of ne){let Pe=o.get(Q),ht=a.get(Q);if(ht&&Pe)this.movingLock(()=>{ht.model.removePanel(Pe)}),ge.push(Pe),Pe.updateFromStateModel(f[Q]);else{let ut=this._deserializer.fromJSON(f[Q],ee);ge.push(ut)}}for(let Q of ge){let Pe=typeof Z=="string"&&Z===Q.id;o.has(Q.api.id)?this.movingLock(()=>{ee.model.openPanel(Q,{skipSetActive:!Pe,skipSetGroupActive:!0})}):ee.model.openPanel(Q,{skipSetActive:!Pe,skipSetGroupActive:!0})}return O.tabGroups&&O.tabGroups.length>0&&ee.model.restoreTabGroups(O.tabGroups),!ee.activePanel&&ee.panels.length>0&&ee.model.openPanel(ee.panels[ee.panels.length-1],{skipSetGroupActive:!0}),ee};this.gridview.deserialize(g,{fromJSON:O=>W(O.data)}),this._layoutFromShell(P,I),e.edgeGroups&&this.deserializeEdgeGroups(e.edgeGroups,f,o,a),this.deserializeFloatingWindows((w=e.floatingGroups)!==null&&w!==void 0?w:[],W);let H=this.deserializePopoutWindows((y=e.popoutGroups)!==null&&y!==void 0?y:[],W);if((D=this._popoutWindowService)===null||D===void 0||D.finishRestoration(H),(G=this._floatingGroupService)===null||G===void 0||G.constrainBounds(),typeof _=="string"){let O=this.getPanel(_);O&&this.doSetGroupAndPanelActive(O)}(T=this._watermarkService)===null||T===void 0||T.update()}catch(P){var z;console.error("dockview: failed to deserialize layout. Reverting changes",P);for(let I of this.groups)for(let W of I.panels)this.removePanel(W,{removeEmptyGroup:!1,skipDispose:!1});for(let I of this.groups)I.dispose(),this._groups.delete(I.id),this._onDidRemoveGroup.fire(I);throw(z=this._floatingGroupService)===null||z===void 0||z.disposeAll(),this.clear(),P}finally{u()}this.debouncedUpdateAllPositions(),this._onDidLayoutFromJSON.fire()}deserializeNestedGridview(e,t){let i=this.createNestedGridview(e.orientation),n=[];return i.deserialize(e,{fromJSON:o=>{let a=t(o.data);return n.push(a),a}}),{gridview:i,members:n}}deserializeEdgeGroups(e,t,i,n){let o=Ge(this._edgeGroupService,"EdgeGroup","fromJSON edge restoration");if(o){for(let d of["top","bottom","left","right"]){let l=e[d];if(l&&!o.has(d)){var a;let u=l.group,v=(a=u?.id)!==null&&a!==void 0?a:`${d}-group`;this.addEdgeGroup(d,{id:v,autoReveal:l.autoReveal,autoHide:l.autoHide,minimumSize:l.minimumSize,maximumSize:l.maximumSize,collapsedSize:l.collapsedSize})}}for(let[d,l]of o.entries()){let u=e[d],v=u?.group;if(v){let{views:g,activeView:f}=v,_=[];for(let w of g){if(!t[w])continue;let y=i.get(w),D=n.get(w);if(D&&y)this.movingLock(()=>{D.model.removePanel(y)}),_.push(y),y.updateFromStateModel(t[w]);else{let G=this._deserializer.fromJSON(t[w],l);_.push(G)}}for(let w of _){let y=f===w.id;i.has(w.api.id)?this.movingLock(()=>{l.model.openPanel(w,{skipSetActive:!y,skipSetGroupActive:!0})}):l.model.openPanel(w,{skipSetActive:!y,skipSetGroupActive:!0})}v.tabGroups&&v.tabGroups.length>0&&l.model.restoreTabGroups(v.tabGroups),!l.activePanel&&l.panels.length>0&&l.model.openPanel(l.panels[l.panels.length-1],{skipSetGroupActive:!0})}}this._shellManager.fromJSON(e)}}deserializeFloatingWindows(e,t){for(let i of e){let{data:n,grid:o,position:a}=i;if(o){let{gridview:d,members:l}=this.deserializeNestedGridview(o,t);if(l.length===0)continue;this.mountFloatingWindow(d,l[0],l,a,{inDragMode:!1})}else if(n){let d=t(n);this.addFloatingGroup(d,{position:a,width:a.width,height:a.height,skipRemoveGroup:!0,inDragMode:!1})}}}deserializePopoutWindows(e,t){let i=e.length>0?Ge(this._popoutWindowService,"PopoutWindow","fromJSON popout restoration"):this._popoutWindowService;return i?e.flatMap((n,o)=>{let{data:a,grid:d,position:l,gridReferenceGroup:u,url:v}=n,g,f=[];if(d){let w=this.deserializeNestedGridview(d,t);if(g=w.gridview,f=w.members,f.length===0)return g.dispose(),[]}let _=d?f[0]:t(a);return i.scheduleRestoration(o*100,()=>this.addPopoutGroup(_,{position:l??void 0,overridePopoutGroup:u?_:void 0,overridePopoutGridview:g,referenceGroup:u?this.getPanel(u):void 0,popoutUrl:v}),()=>{for(let w of f.length>0?f:[_])if(!this.isDisposed&&this._groups.has(w.id)&&w.element.parentElement===null){for(let y of[...w.panels])this.removePanel(y,{removeEmptyGroup:!1});w.dispose(),this._groups.delete(w.id),this._onDidRemoveGroup.fire(w)}})}):[]}clear(){this.mutation("clear",()=>this._doClear())}_doClear(){let e=Array.from(this._groups.values()).map(n=>n.value),t=!!this.activeGroup;for(let n of e){var i;if(!((i=this._edgeGroupService)===null||i===void 0)&&i.includes(n)){let o=[...n.panels];for(let a of o)this.removePanel(a,{removeEmptyGroup:!1});continue}this.removeGroup(n,{skipActive:!0})}t&&this.doSetGroupAndPanelActive(void 0),this.gridview.clear()}closeAllGroups(){this.mutation("remove",()=>{let e=Array.from(this._groups.values()).map(t=>t.value);for(let t of e){if(!this._groups.has(t.id))continue;t.model.closeAllPanels();let i=this.options.noPanelsOverlay==="emptyGroup"&&this._groups.size===1;!this.closeEmptyGroups&&!i&&this._groups.has(t.id)&&t.model.size===0&&this.removeGroup(t,{skipActive:!0})}})}addPanel(e){return this.mutation("add",()=>this._doAddPanel(e))}_doAddPanel(e){if(this.panels.some(g=>g.id===e.id))throw new Error(`dockview: panel with id ${e.id} already exists`);let t;if(e.position&&e.floating)throw new Error("dockview: you can only provide one of: position, floating as arguments to .addPanel(...)");let i={width:e.initialWidth,height:e.initialHeight},n,o=g=>!!e.inactive&&g.model.size>0;if(e.position)if(nr(e.position)){let g=typeof e.position.referencePanel=="string"?this.getGroupPanel(e.position.referencePanel):e.position.referencePanel;if(n=e.position.index,!g){var a;let f=typeof e.position.referencePanel=="string"?e.position.referencePanel:(a=e.position.referencePanel)===null||a===void 0?void 0:a.id;throw new Error(`dockview: referencePanel '${f}' does not exist`)}t=this.findGroup(g)}else if(or(e.position)){var d;if(t=typeof e.position.referenceGroup=="string"?(d=this._groups.get(e.position.referenceGroup))===null||d===void 0?void 0:d.value:e.position.referenceGroup,n=e.position.index,!t){var l;let g=typeof e.position.referenceGroup=="string"?e.position.referenceGroup:(l=e.position.referenceGroup)===null||l===void 0?void 0:l.id;throw new Error(`dockview: referenceGroup '${g}' does not exist`)}}else{let g=this.orthogonalize(_n(e.position.direction)),f=this.createPanel(e,g);return g.model.openPanel(f,{skipSetActive:o(g),skipSetGroupActive:e.inactive,index:n}),e.inactive||this.doSetGroupAndPanelActive(g),g.api.setSize({height:i?.height,width:i?.width}),f}else t=this.activeGroup;let u;if(t){var v;let g=Nt(((v=e.position)===null||v===void 0?void 0:v.direction)||"within");if(e.floating){let f=this.createGroup();this._onDidAddGroup.fire(f);let _=typeof e.floating=="object"&&e.floating!==null?e.floating:{};this.addFloatingGroup(f,N(N({},_),{},{inDragMode:!1,skipRemoveGroup:!0,skipActiveGroup:!0})),u=this.createPanel(e,f),f.model.openPanel(u,{skipSetActive:o(f),skipSetGroupActive:e.inactive,index:n})}else if(t.api.location.type==="floating"||t.api.location.type==="edge"||g==="center")u=this.createPanel(e,t),t.model.openPanel(u,{skipSetActive:o(t),skipSetGroupActive:e.inactive,index:n}),t.api.setSize({width:i?.width,height:i?.height}),e.inactive||this.doSetGroupAndPanelActive(t);else{let f=se(t.element),_=Ce(this.gridview.orientation,f,g),w=this.createGroupAtLocation(_,this.orientationAtLocation(_)==="VERTICAL"?i?.height:i?.width);u=this.createPanel(e,w),w.model.openPanel(u,{skipSetActive:o(w),skipSetGroupActive:e.inactive,index:n}),e.inactive||this.doSetGroupAndPanelActive(w)}}else if(e.floating){let g=this.createGroup();this._onDidAddGroup.fire(g);let f=typeof e.floating=="object"&&e.floating!==null?e.floating:{};this.addFloatingGroup(g,N(N({},f),{},{inDragMode:!1,skipRemoveGroup:!0,skipActiveGroup:!0})),u=this.createPanel(e,g),g.model.openPanel(u,{skipSetActive:o(g),skipSetGroupActive:e.inactive,index:n})}else{let g=this.createGroupAtLocation([0],this.gridview.orientation==="VERTICAL"?i?.height:i?.width);u=this.createPanel(e,g),g.model.openPanel(u,{skipSetActive:o(g),skipSetGroupActive:e.inactive,index:n}),e.inactive||this.doSetGroupAndPanelActive(g)}return u}removePanel(e,t){this.mutation("remove",()=>{var i;return this._doRemovePanel(e,{removeEmptyGroup:(i=t?.removeEmptyGroup)!==null&&i!==void 0?i:this.closeEmptyGroups,skipDispose:t?.skipDispose,skipSetActiveGroup:t?.skipSetActiveGroup})})}_doRemovePanel(e,t){let i=e.group;if(!i)throw new Error(`dockview: cannot remove panel ${e.id}. it's missing a group.`);i.model.removePanel(e,{skipSetActiveGroup:t.skipSetActiveGroup}),t.skipDispose||(e.group.model.renderContainer.detatch(e),e.dispose()),i.size===0&&t.removeEmptyGroup&&this.removeGroup(i,{skipActive:t.skipSetActiveGroup})}createWatermarkComponent(){return this.options.createWatermarkComponent?this.options.createWatermarkComponent():new bl}addGroup(e){return this.mutation("add",()=>this._doAddGroup(e))}_doAddGroup(e){if(e){let o;if(rr(e)){var t;let g=typeof e.referencePanel=="string"?this.panels.find(_=>_.id===e.referencePanel):e.referencePanel,f=typeof e.referencePanel=="string"?e.referencePanel:(t=e.referencePanel)===null||t===void 0?void 0:t.id;if(!g)throw new Error(`dockview: reference panel ${f} does not exist`);if(o=this.findGroup(g),!o)throw new Error(`dockview: reference group for reference panel ${f} does not exist`)}else if(sr(e)){var i;if(o=typeof e.referenceGroup=="string"?(i=this._groups.get(e.referenceGroup))===null||i===void 0?void 0:i.value:e.referenceGroup,!o){var n;let g=typeof e.referenceGroup=="string"?e.referenceGroup:(n=e.referenceGroup)===null||n===void 0?void 0:n.id;throw new Error(`dockview: reference group ${g} does not exist`)}}else{let g=this.orthogonalize(_n(e.direction),e);return e.skipSetActive||this.doSetGroupAndPanelActive(g),g}let a=Nt(e.direction||"within"),d=se(o.element),l=Ce(this.gridview.orientation,d,a),u=this.createGroup(e),v=this.getLocationOrientation(l)==="VERTICAL"?e.initialHeight:e.initialWidth;return this.doAddGroup(u,l,v),e.skipSetActive||this.doSetGroupAndPanelActive(u),u}else{let o=this.createGroup(e);return this.doAddGroup(o),this.doSetGroupAndPanelActive(o),o}}getLocationOrientation(e){return e.length%2==0&&this.gridview.orientation==="HORIZONTAL"?"HORIZONTAL":"VERTICAL"}removeGroup(e,t){this.mutation("remove",()=>this.doRemoveGroup(e,t))}detachFromNestedWindow(e){var t,i;let n=(t=this._floatingGroupService)===null||t===void 0?void 0:t.findByGroup(e);if(n){let a=this.nestedWindowMembers(e);return a.length<=1?!1:(n.gridview.remove(e),n.group===e&&n.setAnchorGroup(a.find(d=>d!==e)),!0)}let o=(i=this._popoutWindowService)===null||i===void 0?void 0:i.findByGroup(e);if(o){let a=this.nestedWindowMembers(e);return a.length<=1?!1:(o.gridview.remove(e),o.popoutGroup===e&&o.setAnchorGroup(a.find(d=>d!==e)),!0)}return!1}disposeGroupRecord(e){e.dispose(),this._groups.delete(e.id),this._onDidRemoveGroup.fire(e)}activateFallbackGroupIfRemoved(e,t){if(!t&&this._activeGroup===e){let i=Array.from(this._groups.values());this.doSetGroupAndPanelActive(i.length>0?i[0].value:void 0)}}doRemoveGroup(e,t){var i;if(!((i=this._edgeGroupService)===null||i===void 0)&&i.includes(e))return e;let n=[...e.panels];if(!t?.skipDispose)for(let g of n){var o;this.removePanel(g,{removeEmptyGroup:!1,skipDispose:(o=t?.skipDispose)!==null&&o!==void 0?o:!1})}let a=this.activePanel;if(e.api.location.type==="floating"){var d;let g=(d=this._floatingGroupService)===null||d===void 0?void 0:d.findByGroup(e);if(!g)throw new Error("dockview: failed to find floating group");return this.detachFromNestedWindow(e)?(t?.skipDispose?e.model.location={type:"grid"}:this.disposeGroupRecord(e),this.activateFallbackGroupIfRemoved(e,t?.skipActive),e):(t?.skipDispose||this.disposeGroupRecord(e),g.dispose(),this.activateFallbackGroupIfRemoved(e,t?.skipActive),e)}if(e.api.location.type==="popout"){var l,u;let g=(l=this._popoutWindowService)===null||l===void 0?void 0:l.findByGroup(e);if(!g)throw new Error("dockview: failed to find popout group");if(this.detachFromNestedWindow(e))return t?.skipDispose?e.model.location={type:"grid"}:this.disposeGroupRecord(e),this.activateFallbackGroupIfRemoved(e,t?.skipActive),e;if(!t?.skipDispose){if(!t?.skipPopoutAssociated){let _=g.referenceGroup?this.getPanel(g.referenceGroup):void 0;_?.panels.length===0&&(this.closeEmptyGroups||!_.api.isVisible)&&this.removeGroup(_)}g.popoutGroup.dispose(),this._groups.delete(e.id),this._onDidRemoveGroup.fire(e)}(u=this._popoutWindowService)===null||u===void 0||u.remove(g);let f=g.disposable.dispose();return!t?.skipPopoutReturn&&f&&(this.doAddGroup(f,[0]),this.doSetGroupAndPanelActive(f)),this.activateFallbackGroupIfRemoved(e,t?.skipActive),g.popoutGroup}if(!this.gridview.element.contains(e.element)){if(!t?.skipDispose){let g=this._groups.get(e.id);g?.disposable.dispose(),this.disposeGroupRecord(e)}return this.activateFallbackGroupIfRemoved(e,t?.skipActive),e}let v=super.doRemoveGroup(e,t);return t?.skipActive||this.activePanel!==a&&this.fireActivePanelChange(this.activePanel),v}debouncedUpdateAllPositions(){this._updatePositionsFrameId!==void 0&&cancelAnimationFrame(this._updatePositionsFrameId),this._updatePositionsFrameId=requestAnimationFrame(()=>{var e,t;this._updatePositionsFrameId=void 0,this.overlayRenderContainer.updateAllPositions();for(let i of(e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.entries)!==null&&e!==void 0?e:[])i.overlayRenderContainer.updateAllPositions()})}movingLock(e){let t=this._moving;try{return this._moving=!0,e()}finally{this._moving=t}}mutation(e,t){let i=this.openMutation(e);this._syncMutationDepth++;try{return t()}finally{this._syncMutationDepth--,this._syncMutationDepth===0&&this.releaseDisposedActiveGroup(),i()}}mutationAsync(e,t){var i=this;return Go(function*(){let n=i.openMutation(e);try{return yield t()}finally{n()}})()}openMutation(e){let t=this._origin;return this._mutationDepth===0&&this._onWillMutateLayout.fire({kind:e,origin:t}),this._mutationDepth++,()=>{this._mutationDepth--,this._mutationDepth===0&&(this.releaseDisposedActiveGroup(),this.flushLocationChanges(),this._onDidMutateLayout.fire({kind:e,origin:t}))}}releaseDisposedActiveGroup(){var e;!this.isDisposed&&(!((e=this._activeGroup)===null||e===void 0)&&e.model.isDisposed)&&this.activateFallbackGroupIfRemoved(this._activeGroup)}deferLocationChange(e,t){if(this._mutationDepth===0){t();return}this._pendingLocationChanges.set(e,t)}flushLocationChanges(){if(this._pendingLocationChanges.size===0)return;let e=Array.from(this._pendingLocationChanges.values());this._pendingLocationChanges.clear();for(let t of e)t()}currentOrigin(){return this._origin}withOrigin(e,t){if(this._originDepth>0||this._mutationDepth>0)return t();let i=this._origin;this._origin=e,this._originDepth++;try{return t()}finally{this._originDepth--,this._origin=i}}fireActivePanelChange(e){this._onDidActivePanelChange.fire({panel:e,origin:this._origin})}fireDidMovePanel(e,t){this._onDidMovePanel.fire({panel:e,from:t,to:e.group})}moveGroupOrPanel(e){this.mutation("move",()=>this._doMoveGroupOrPanel(e))}_doMoveGroupOrPanel(e){var t;let i=e.to.group,n=e.from.groupId,o=e.from.panelId,a=e.to.position,d=e.to.index,l=n?(t=this._groups.get(n))===null||t===void 0?void 0:t.value:void 0;if(!l)throw new Error(`dockview: Failed to find group id ${n}`);if(o===void 0){e.from.tabGroupId?this.moveTabGroupToGroup({sourceGroup:l,tabGroupId:e.from.tabGroupId,destinationGroup:i,destinationTarget:a,destinationIndex:d,skipSetActive:e.skipSetActive,keepEmptyGroups:e.keepEmptyGroups}):this.moveGroup({from:{group:l},to:{group:i,position:a},skipSetActive:e.skipSetActive});return}if(!a||a==="center"){let v=this.movingLock(()=>l.model.removePanel(o,{skipSetActive:!1,skipSetActiveGroup:!0}));if(!v)throw new Error(`dockview: No panel with id ${o}`);!this.keepEmptyGroups(e)&&l.model.size===0&&l!==i&&this.doRemoveGroup(l,{skipActive:!0});let g=i.model.size===0;this.movingLock(()=>{var f;return i.model.openPanel(v,{index:d,skipSetActive:((f=e.skipSetActive)!==null&&f!==void 0?f:!1)&&!g,skipSetGroupActive:!0})}),e.skipSetActive||this.doSetGroupAndPanelActive(i),this.fireDidMovePanel(v,l)}else{let v=this.getGridviewForGroup(i),g=se(i.element),f=Ce(v.orientation,g,a);if(l.size<2&&!this.keepEmptyGroups(e)){let[_,w]=Le(f);if(l.api.location.type==="grid"&&v===this.gridview){let[T,z]=Le(se(l.element));if(sn(T,_)){this.gridview.moveView(T,z,w),this.fireDidMovePanel(this.getGroupPanel(o),l);return}}if(l.api.location.type==="popout"&&this.nestedWindowMembers(l).length<=1){var u;let T=(u=this._popoutWindowService)===null||u===void 0?void 0:u.findByGroup(l);if(!T)return;let z=this.movingLock(()=>T.popoutGroup.model.removePanel(T.popoutGroup.panels[0],{skipSetActive:!0,skipSetActiveGroup:!0}));this.doRemoveGroup(l,{skipActive:!0});let P=Ce(v.orientation,se(i.element),a),I=this.createGroupAtLocation(P,this.dropSizing(se(i.element)),void 0,v);this.movingLock(()=>I.model.openPanel(z,{skipSetActive:!0})),this.doSetGroupAndPanelActive(I),this.fireDidMovePanel(this.getGroupPanel(o),l);return}if(l.api.location.type==="edge"){let T=this.movingLock(()=>l.model.removePanel(o,{skipSetActive:!1,skipSetActiveGroup:!0}));if(!T)throw new Error(`dockview: No panel with id ${o}`);let z=this.createGroupAtLocation(f,this.dropSizing(g),void 0,v);this.movingLock(()=>z.model.openPanel(T,{skipSetGroupActive:!0})),this.doSetGroupAndPanelActive(z),this.fireDidMovePanel(T,l);return}let y=this.movingLock(()=>this.doRemoveGroup(l,{skipActive:!0,skipDispose:!0})),D=se(i.element),G=Ce(v.orientation,D,a);this.movingLock(()=>this.doAddGroup(y,G,this.dropSizing(D),v)),this.setGroupLocationForRoot(y,v),this.doSetGroupAndPanelActive(y),this.fireDidMovePanel(this.getGroupPanel(o),l)}else{let _=this.movingLock(()=>l.model.removePanel(o,{skipSetActive:!1,skipSetActiveGroup:!0}));if(!_)throw new Error(`dockview: No panel with id ${o}`);let w=Ce(v.orientation,g,a),y=this.createGroupAtLocation(w,this.dropSizing(g),void 0,v);this.movingLock(()=>y.model.openPanel(_,{skipSetGroupActive:!0})),this.doSetGroupAndPanelActive(y),this.fireDidMovePanel(_,l)}}}moveTabGroupToGroup(e){let{sourceGroup:t,tabGroupId:i,destinationGroup:n,destinationTarget:o,destinationIndex:a}=e,d=t.model.getTabGroups().find(G=>G.id===i);if(!d||d.panelIds.length===0)return;let l=d.label,u=d.color,v=d.collapsed,g=d.componentParams,f=[...d.panelIds],_=o&&o!=="center"?se(n.element):void 0,w=this.movingLock(()=>f.map(G=>t.model.removePanel(G,{skipSetActive:!1,skipSetActiveGroup:!0})).filter(G=>G!==void 0));if(w.length===0)return;let y=G=>{this.movingLock(()=>{for(let z of w)G.model.openPanel(z,{index:a,skipSetActive:!0,skipSetGroupActive:!0})});let T=G.model.createTabGroup({label:l,color:u,collapsed:v,componentParams:g});for(let z of w)G.model.addPanelToTabGroup(T.id,z.id);e.skipSetActive||this.doSetGroupAndPanelActive(G);for(let z of w)this.fireDidMovePanel(z,t)},D;if(!o||o==="center"||!_)D=n;else{let G=Ce(this.gridview.orientation,_,o);D=this.createGroupAtLocation(G,this.dropSizing(_))}!this.keepEmptyGroups(e)&&t.model.size===0&&t!==D&&this.doRemoveGroup(t,{skipActive:!0}),y(D)}moveGroup(e){this.mutation("move",()=>this._doMoveGroup(e))}maximizeGroup(e){this.mutation("maximize",()=>super.maximizeGroup(e))}exitMaximizedGroup(){this.mutation("maximize",()=>super.exitMaximizedGroup())}_doMoveGroup(e){var t;let i=e.from.group,n=e.to.group,o=e.to.position;if(o==="center"&&i===n)return;let a=i,d;if(o==="center"){let f=i.activePanel,_=i.model.getTabGroups().map(y=>({label:y.label,color:y.color,collapsed:y.collapsed,componentParams:y.componentParams,panelIds:[...y.panelIds]})),w=this.movingLock(()=>[...i.panels].map(y=>i.model.removePanel(y.id,{skipSetActive:!0})));i?.model.size===0&&this.doRemoveGroup(i,{skipActive:!0}),this.movingLock(()=>{for(let y of w)n.model.openPanel(y,{skipSetActive:y!==f,skipSetGroupActive:!0})}),d=w;for(let y of _){let D=n.model.createTabGroup({label:y.label,color:y.color,collapsed:y.collapsed,componentParams:y.componentParams});for(let G of y.panelIds)n.model.addPanelToTabGroup(D.id,G)}e.skipSetActive!==!0?this.doSetGroupAndPanelActive(n):this.activePanel||this.doSetGroupAndPanelActive(n)}else{let f=(()=>{if(i.api.location.type==="edge"||n.api.location.type==="edge")return!1;let _=this.getGridviewForGroup(i);if(_!==this.getGridviewForGroup(n))return!1;let w,y;try{w=se(i.element),y=se(n.element)}catch{return!1}return w.length===0||y.length===0?!1:sn(Le(w)[0],Le(y)[0])&&un(_.orientation,y)===ai(o)})();if(i.api.location.type==="edge"){let _=i.activePanel,w=i.model.getTabGroups().map(D=>({label:D.label,color:D.color,collapsed:D.collapsed,componentParams:D.componentParams,panelIds:[...D.panelIds]})),y=this.movingLock(()=>[...i.panels].map(D=>i.model.removePanel(D.id,{skipSetActive:!0})));a=this.createGroup(),this._onDidAddGroup.fire(a),this.movingLock(()=>{for(let D of y)a.model.openPanel(D,{skipSetActive:D!==_,skipSetGroupActive:!0})});for(let D of w){let G=a.model.createTabGroup({label:D.label,color:D.color,collapsed:D.collapsed,componentParams:D.componentParams});for(let T of D.panelIds)a.model.addPanelToTabGroup(G.id,T)}}else switch(i.api.location.type){case"grid":this.gridview.removeView(se(i.element));break;case"floating":{var l;let _=(l=this._floatingGroupService)===null||l===void 0?void 0:l.findByGroup(i);if(!_)throw new Error("dockview: failed to find floating group");this.detachFromNestedWindow(i)||_.dispose();break}case"popout":{var u,v;let _=(u=this._popoutWindowService)===null||u===void 0?void 0:u.findByGroup(i);if(!_)throw new Error("dockview: failed to find popout group");if(this.detachFromNestedWindow(i))break;if((v=this._popoutWindowService)===null||v===void 0||v.remove(_),_.referenceGroup){let w=this.getPanel(_.referenceGroup);w&&!w.api.isVisible&&this.doRemoveGroup(w,{skipActive:!0})}_.window.dispose();break}}if(n.api.location.type==="grid"||n.api.location.type==="floating"||n.api.location.type==="popout"){let _=this.getGridviewForGroup(n),w=se(n.element),y=Ce(_.orientation,w,o),D;if(f)D=ai(o)==="HORIZONTAL"?i.api.width:i.api.height;else{var g;D=he.Split((g=w[w.length-1])!==null&&g!==void 0?g:0)}_.addView(a,D,y),this.setGroupLocationForRoot(a,_)}}if(((t=d)!==null&&t!==void 0?t:a.panels).forEach(f=>{this.fireDidMovePanel(f,i)}),this.debouncedUpdateAllPositions(),e.skipSetActive===!1){let f=n??i;this.doSetGroupAndPanelActive(f)}else a!==i&&e.skipSetActive!==!0&&this.doSetGroupAndPanelActive(a)}doSetGroupActive(e){var t;super.doSetGroupActive(e);let i=this.activePanel;!this._moving&&i!==((t=this._onDidActivePanelChange.value)===null||t===void 0?void 0:t.panel)&&this.fireActivePanelChange(i)}doSetGroupAndPanelActive(e){var t;super.doSetGroupActive(e);let i=this.activePanel;e&&this.hasMaximizedGroup()&&!this.isMaximizedGroup(e)&&this.exitMaximizedGroup(),!this._moving&&i!==((t=this._onDidActivePanelChange.value)===null||t===void 0?void 0:t.panel)&&this.fireActivePanelChange(i)}getNextGroupId(){let e=this.nextGroupId.next();for(;this._groups.has(e);)e=this.nextGroupId.next();return e}createGroup(e){var t;(t=e)!==null&&t!==void 0||(e={});let i=e?.id;if(i&&this._groups.has(e.id)&&(console.warn(`dockview: Duplicate group id ${e?.id}. reassigning group id to avoid errors`),i=void 0),!i)for(i=this.nextGroupId.next();this._groups.has(i);)i=this.nextGroupId.next();let n=new Ht(this,i,e);if(n.init({params:{},accessor:this}),!this._groups.has(n.id)){let o=new C(n.model.onTabDragStart(a=>{var d;(d=this._advancedDnDService)===null||d===void 0||d.dispatchWillDragPanel(a)}),n.model.onGroupDragStart(a=>{var d;(d=this._advancedDnDService)===null||d===void 0||d.dispatchWillDragGroup(a)}),n.model.onMove(a=>{let{groupId:d,itemId:l,target:u,index:v,tabGroupId:g}=a;this.moveGroupOrPanel({from:{groupId:d,panelId:l,tabGroupId:g},to:{group:n,position:u,index:v}})}),n.model.onDidDrop(a=>{this._onDidDrop.fire(a)}),n.model.onWillDrop(a=>{var d;(d=this._advancedDnDService)===null||d===void 0||d.dispatchWillDrop(a)}),n.model.onWillShowOverlay(a=>{var d;if(this.options.disableDnd){a.preventDefault();return}(d=this._advancedDnDService)===null||d===void 0||d.dispatchWillShowOverlay(a)}),n.model.onUnhandledDragOver(a=>{this._onUnhandledDragOver.fire(a)}),n.model.onDidAddPanel(a=>{this._moving||this._onDidAddPanel.fire(a.panel)}),n.model.onDidRemovePanel(a=>{this._moving||this._onDidRemovePanel.fire(a.panel)}),n.model.onDidActivePanelChange(a=>{var d;this._moving||a.panel===this.activePanel&&((d=this._onDidActivePanelChange.value)===null||d===void 0?void 0:d.panel)!==a.panel&&this.fireActivePanelChange(a.panel)}),$.any(n.model.onDidPanelTitleChange,n.model.onDidPanelParametersChange)(()=>{this._bufferOnDidLayoutChange.fire()}));this._groups.set(n.id,{value:n,disposable:o})}return n.initialize(),n}createPanel(e,t){var i,n,o;let a=e.component,d=(i=e.tabComponent)!==null&&i!==void 0?i:this.options.defaultTabComponent,l=new gr(this,e.id,a,d),u=new ct(e.id,a,d,this,this._api,t,l,{renderer:e.renderer,minimumWidth:e.minimumWidth,minimumHeight:e.minimumHeight,maximumWidth:e.maximumWidth,maximumHeight:e.maximumHeight});return u.init({title:(n=e.title)!==null&&n!==void 0?n:e.id,params:(o=e?.params)!==null&&o!==void 0?o:{}}),u}dropSizing(e){return he.Split(e.length===0?0:e[e.length-1])}createGroupAtLocation(e,t,i,n=this.gridview){let o=this.createGroup(i);return this.doAddGroup(o,e,t,n),this.setGroupLocationForRoot(o,n),o}setGroupLocationForRoot(e,t){var i;let n=(i=this._popoutWindowService)===null||i===void 0?void 0:i.entries.find(o=>o.gridview===t);if(n){e.model.renderContainer!==n.overlayRenderContainer&&(e.model.renderContainer=n.overlayRenderContainer),e.model.dropTargetContainer=n.dropTargetContainer,e.model.location={type:"popout",getWindow:n.getWindow,popoutUrl:n.popoutUrl};return}e.model.renderContainer!==this.overlayRenderContainer&&(e.model.renderContainer=this.overlayRenderContainer),e.model.dropTargetContainer=this.rootDropTargetContainer,e.model.location=t===this.gridview?{type:"grid"}:{type:"floating"}}getGridviewForGroup(e){var t,i;let n=(t=this._floatingGroupService)===null||t===void 0?void 0:t.findByGroup(e);if(n)return n.gridview;let o=(i=this._popoutWindowService)===null||i===void 0?void 0:i.findByGroup(e);return o?o.gridview:this.gridview}nestedWindowMembers(e){let t=this.getGridviewForGroup(e);return t===this.gridview?[]:this.groups.filter(i=>t.element.contains(i.element))}findGroup(e){var t;return(t=Array.from(this._groups.values()).find(i=>i.value.model.containsPanel(e)))===null||t===void 0?void 0:t.value}orientationAtLocation(e){let t=this.gridview.orientation;return e.length%2==1?t:$e(t)}updateTheme(){var e,t,i,n,o,a;let d=(e=this._options.theme)!==null&&e!==void 0?e:vr;(t=this._shellThemeClassnames)===null||t===void 0||t.setClassNames(d.className);let l=(i=d.gap)!==null&&i!==void 0?i:0;this.gridview.margin=l;for(let f of this.nestedGridviews())f.margin=l;if((n=this._shellManager)===null||n===void 0||n.updateTheme(l,(o=d.edgeGroupCollapsedSize)!==null&&o!==void 0?o:35),d.dndOverlayBorder===void 0){var u;this.element.style.removeProperty("--dv-drag-over-border"),(u=this._shellManager)===null||u===void 0||u.element.style.removeProperty("--dv-drag-over-border")}else{var v;this.element.style.setProperty("--dv-drag-over-border",d.dndOverlayBorder),(v=this._shellManager)===null||v===void 0||v.element.style.setProperty("--dv-drag-over-border",d.dndOverlayBorder)}d.dndOverlayMounting==="absolute"?this.rootDropTargetContainer.disabled=!1:this.rootDropTargetContainer.disabled=!0;let g=((a=d.tabGroupIndicator)!==null&&a!==void 0?a:"wrap")==="none";A(this.element,"dv-tab-group-indicator-none",g),this._shellManager&&A(this._shellManager.element,"dv-tab-group-indicator-none",g);for(let f of this.groups)f.model.updateTabGroups()}},Wr=class extends mn{get orientation(){return this.gridview.orientation}set orientation(e){this.gridview.orientation=e}get options(){return this._options}get deserializer(){return this._deserializer}set deserializer(e){this._deserializer=e}constructor(e,t){var i;super(e,{proportionalLayout:(i=t.proportionalLayout)!==null&&i!==void 0?i:!0,orientation:t.orientation,styles:t.hideBorders?{separatorBorder:"transparent"}:void 0,disableAutoResizing:t.disableAutoResizing,className:t.className}),this._onDidLayoutfromJSON=new k,this.onDidLayoutFromJSON=this._onDidLayoutfromJSON.event,this._onDidRemoveGroup=new k,this.onDidRemoveGroup=this._onDidRemoveGroup.event,this._onDidAddGroup=new k,this.onDidAddGroup=this._onDidAddGroup.event,this._onDidActiveGroupChange=new k,this.onDidActiveGroupChange=this._onDidActiveGroupChange.event,this._options=t,this.addDisposables(this._onDidAddGroup,this._onDidRemoveGroup,this._onDidActiveGroupChange,this.onDidAdd(n=>{this._onDidAddGroup.fire(n)}),this.onDidRemove(n=>{this._onDidRemoveGroup.fire(n)}),this.onDidActiveChange(n=>{this._onDidActiveGroupChange.fire(n)})),this.layoutFromElement()}updateOptions(e){super.updateOptions(e);let t=typeof e.orientation=="string"&&this.gridview.orientation!==e.orientation;this._options=N(N({},this.options),e),t&&(this.gridview.orientation=e.orientation),this.layout(this.gridview.width,this.gridview.height,!0)}removePanel(e){this.removeGroup(e)}toJSON(){var e;return{grid:this.gridview.serialize(),activePanel:(e=this.activeGroup)===null||e===void 0?void 0:e.id}}setVisible(e,t){this.gridview.setViewVisible(se(e.element),t)}setActive(e){this._groups.forEach((t,i)=>{t.value.setActive(e===t.value)})}focus(){var e;(e=this.activeGroup)===null||e===void 0||e.focus()}fromJSON(e){this.clear();let{grid:t,activePanel:i}=e;try{let n=[],o=this.width,a=this.height;if(this.gridview.deserialize(t,{fromJSON:d=>{let{data:l}=d,u=this.options.createComponent({id:l.id,name:l.component});return n.push(()=>u.init({params:l.params,minimumWidth:l.minimumWidth,maximumWidth:l.maximumWidth,minimumHeight:l.minimumHeight,maximumHeight:l.maximumHeight,priority:l.priority,snap:!!l.snap,accessor:this,isVisible:d.visible})),this._onDidAddGroup.fire(u),this.registerPanel(u),u}}),this.layout(o,a,!0),n.forEach(d=>d()),typeof i=="string"){let d=this.getPanel(i);d&&this.doSetGroupActive(d)}}catch(n){for(let o of this.groups)o.dispose(),this._groups.delete(o.id),this._onDidRemoveGroup.fire(o);throw this.clear(),n}this._onDidLayoutfromJSON.fire()}clear(){let e=this.activeGroup,t=Array.from(this._groups.values());for(let i of t)i.disposable.dispose(),this.doRemoveGroup(i.value,{skipActive:!0});e&&this.doSetGroupActive(void 0),this.gridview.clear()}movePanel(e,t){var i;let n=(i=this._groups.get(t.reference))===null||i===void 0?void 0:i.value;if(!n)throw new Error(`reference group ${t.reference} does not exist`);let o=Nt(t.direction);if(o==="center")throw new Error(`${o} not supported as an option`);let a=se(n.element),d=Ce(this.gridview.orientation,a,o),l=this.gridview.remove(e);this.doAddGroup(l,d,t.size)}addPanel(e){var t,i,n;let o=(t=e.location)!==null&&t!==void 0?t:[0];if(!((i=e.position)===null||i===void 0)&&i.referencePanel){var a;let l=(a=this._groups.get(e.position.referencePanel))===null||a===void 0?void 0:a.value;if(!l)throw new Error(`reference group ${e.position.referencePanel} does not exist`);let u=Nt(e.position.direction);if(u==="center")throw new Error(`${u} not supported as an option`);{let v=se(l.element);o=Ce(this.gridview.orientation,v,u)}}let d=this.options.createComponent({id:e.id,name:e.component});return d.init({params:(n=e.params)!==null&&n!==void 0?n:{},minimumWidth:e.minimumWidth,maximumWidth:e.maximumWidth,minimumHeight:e.minimumHeight,maximumHeight:e.maximumHeight,priority:e.priority,snap:!!e.snap,accessor:this,isVisible:!0}),this.doAddGroup(d,o,e.size),this.registerPanel(d),this.doSetGroupActive(d),d}registerPanel(e){let t=new C(e.api.onDidFocusChange(i=>{i.isFocused&&this._groups.forEach(n=>{let o=n.value;o.setActive(o===e)})}));this._groups.set(e.id,{value:e,disposable:t})}moveGroup(e,t,i){let n=this.getPanel(t);if(!n)throw new Error("invalid operation");let o=se(e.element),[a,d]=Le(Ce(this.gridview.orientation,o,i)),[l,u]=Le(se(n.element));if(sn(l,a)){this.gridview.moveView(l,u,d);return}let v=this.doRemoveGroup(n,{skipActive:!0,skipDispose:!0}),g=se(e.element),f=Ce(this.gridview.orientation,g,i);this.doAddGroup(v,f)}removeGroup(e){super.removeGroup(e)}dispose(){super.dispose(),this._onDidLayoutfromJSON.dispose()}},Hr=class extends gn{get panels(){return this.splitview.getViews()}get options(){return this._options}get length(){return this._panels.size}get orientation(){return this.splitview.orientation}get splitview(){return this._splitview}set splitview(e){this._splitview&&this._splitview.dispose(),this._splitview=e,this._splitviewChangeDisposable.value=new C(this._splitview.onDidSashEnd(()=>{this._onDidLayoutChange.fire(void 0)}),this._splitview.onDidAddView(t=>this._onDidAddView.fire(t)),this._splitview.onDidRemoveView(t=>this._onDidRemoveView.fire(t)))}get minimumSize(){return this.splitview.minimumSize}get maximumSize(){return this.splitview.maximumSize}get height(){return this.splitview.orientation==="HORIZONTAL"?this.splitview.orthogonalSize:this.splitview.size}get width(){return this.splitview.orientation==="HORIZONTAL"?this.splitview.size:this.splitview.orthogonalSize}constructor(e,t){var i;super(document.createElement("div"),t.disableAutoResizing),this._splitviewChangeDisposable=new E,this._panels=new Map,this._onDidLayoutfromJSON=new k,this.onDidLayoutFromJSON=this._onDidLayoutfromJSON.event,this._onDidAddView=new k,this.onDidAddView=this._onDidAddView.event,this._onDidRemoveView=new k,this.onDidRemoveView=this._onDidRemoveView.event,this._onDidLayoutChange=new k,this.onDidLayoutChange=this._onDidLayoutChange.event,this.element.style.height="100%",this.element.style.width="100%",this._classNames=new Be(this.element),this._classNames.setClassNames((i=t.className)!==null&&i!==void 0?i:""),e.appendChild(this.element),this._options=t,this.splitview=new it(this.element,t),this.addDisposables(this._onDidAddView,this._onDidLayoutfromJSON,this._onDidRemoveView,this._onDidLayoutChange),this.layoutFromElement()}updateOptions(e){if("className"in e){var t;this._classNames.setClassNames((t=e.className)!==null&&t!==void 0?t:"")}if("disableResizing"in e){var i;this.disableResizing=(i=e.disableAutoResizing)!==null&&i!==void 0?i:!1}typeof e.orientation=="string"&&(this.splitview.orientation=e.orientation),this._options=N(N({},this.options),e),this.splitview.layout(this.splitview.size,this.splitview.orthogonalSize)}focus(){var e;(e=this._activePanel)===null||e===void 0||e.focus()}movePanel(e,t){this.splitview.moveView(e,t)}setVisible(e,t){let i=this.panels.indexOf(e);this.splitview.setViewVisible(i,t)}setActive(e,t){this._activePanel=e,this.panels.filter(i=>i!==e).forEach(i=>{i.api._onDidActiveChange.fire({isActive:!1}),t||i.focus()}),e.api._onDidActiveChange.fire({isActive:!0}),t||e.focus()}removePanel(e,t){let i=this._panels.get(e.id);if(!i)throw new Error(`unknown splitview panel ${e.id}`);i.dispose(),this._panels.delete(e.id);let n=this.panels.indexOf(e);this.splitview.removeView(n,t).dispose();let o=this.panels;o.length>0&&this.setActive(o[o.length-1])}getPanel(e){return this.panels.find(t=>t.id===e)}addPanel(e){var t;if(this._panels.has(e.id))throw new Error(`panel ${e.id} already exists`);let i=this.options.createComponent({id:e.id,name:e.component});i.orientation=this.splitview.orientation,i.init({params:(t=e.params)!==null&&t!==void 0?t:{},minimumSize:e.minimumSize,maximumSize:e.maximumSize,snap:e.snap,priority:e.priority,accessor:this});let n=typeof e.size=="number"?e.size:he.Distribute,o=typeof e.index=="number"?e.index:void 0;return this.splitview.addView(i,n,o),this.doAddView(i),this.setActive(i),i}layout(e,t){let[i,n]=this.splitview.orientation==="HORIZONTAL"?[e,t]:[t,e];this.splitview.layout(i,n)}doAddView(e){let t=e.api.onDidFocusChange(i=>{i.isFocused&&this.setActive(e,!0)});this._panels.set(e.id,t)}toJSON(){var e;return{views:this.splitview.getViews().map((t,i)=>({size:this.splitview.getViewSize(i),data:t.toJSON(),snap:!!t.snap,priority:t.priority})),activeView:(e=this._activePanel)===null||e===void 0?void 0:e.id,size:this.splitview.size,orientation:this.splitview.orientation}}fromJSON(e){this.clear();let{views:t,orientation:i,size:n,activeView:o}=e,a=[],d=this.width,l=this.height;if(this.splitview=new it(this.element,{orientation:i,proportionalLayout:this.options.proportionalLayout,descriptor:{size:n,views:t.map(u=>{let v=u.data;if(this._panels.has(v.id))throw new Error(`panel ${v.id} already exists`);let g=this.options.createComponent({id:v.id,name:v.component});return a.push(()=>{var f;g.init({params:(f=v.params)!==null&&f!==void 0?f:{},minimumSize:v.minimumSize,maximumSize:v.maximumSize,snap:u.snap,priority:u.priority,accessor:this})}),g.orientation=i,this.doAddView(g),setTimeout(()=>{this._onDidAddView.fire(g)},0),{size:u.size,view:g}})}}),this.layout(d,l),a.forEach(u=>u()),typeof o=="string"){let u=this.getPanel(o);u&&this.setActive(u)}this._onDidLayoutfromJSON.fire()}clear(){for(let e of this._panels.values())e.dispose();for(this._panels.clear();this.splitview.length>0;)this.splitview.removeView(0,he.Distribute,!0).dispose()}dispose(){for(let t of this._panels.values())t.dispose();this._panels.clear();let e=this.splitview.getViews();this._splitviewChangeDisposable.dispose(),this.splitview.dispose();for(let t of e)t.dispose();this.element.remove(),super.dispose()}},Fr=class extends C{get element(){return this._element}constructor(){super(),this._expandedIcon=zd(),this._collapsedIcon=jo(),this.disposable=new E,this.apiRef={api:null},this._element=document.createElement("div"),this.element.className="dv-default-header",this._content=document.createElement("span"),this._expander=document.createElement("div"),this._expander.className="dv-pane-header-icon",this.element.appendChild(this._expander),this.element.appendChild(this._content),this.addDisposables(M(this._element,"click",()=>{var e;(e=this.apiRef.api)===null||e===void 0||e.setExpanded(!this.apiRef.api.isExpanded)}))}init(e){this.apiRef.api=e.api,this._content.textContent=e.title,this.updateIcon(),this.disposable.value=e.api.onDidExpansionChange(()=>{this.updateIcon()})}updateIcon(){var e;let t=!!(!((e=this.apiRef.api)===null||e===void 0)&&e.isExpanded);A(this._expander,"collapsed",!t),t?(this._expander.contains(this._collapsedIcon)&&this._collapsedIcon.remove(),this._expander.contains(this._expandedIcon)||this._expander.appendChild(this._expandedIcon)):(this._expander.contains(this._expandedIcon)&&this._expandedIcon.remove(),this._expander.contains(this._collapsedIcon)||this._expander.appendChild(this._collapsedIcon))}update(e){}dispose(){this.disposable.dispose(),super.dispose()}};let sc=dn(),Br=22,Ur=0,Yr=Number.MAX_SAFE_INTEGER;var On=class extends qo{constructor(e){super({accessor:e.accessor,id:e.id,component:e.component,headerComponent:e.headerComponent,orientation:e.orientation,isExpanded:e.isExpanded,disableDnd:e.disableDnd,headerSize:e.headerSize,minimumBodySize:e.minimumBodySize,maximumBodySize:e.maximumBodySize}),this.options=e}getBodyComponent(){return this.options.body}getHeaderComponent(){return this.options.header}},Xr=class extends gn{get id(){return this._id}get panels(){return this.paneview.getPanes()}set paneview(e){this._paneview=e,this._disposable.value=new C(this._paneview.onDidChange(()=>{this._onDidLayoutChange.fire(void 0)}),this._paneview.onDidAddView(t=>this._onDidAddView.fire(t)),this._paneview.onDidRemoveView(t=>this._onDidRemoveView.fire(t)))}get paneview(){return this._paneview}get minimumSize(){return this.paneview.minimumSize}get maximumSize(){return this.paneview.maximumSize}get height(){return this.paneview.orientation==="HORIZONTAL"?this.paneview.orthogonalSize:this.paneview.size}get width(){return this.paneview.orientation==="HORIZONTAL"?this.paneview.size:this.paneview.orthogonalSize}get options(){return this._options}constructor(e,t){var i;super(document.createElement("div"),t.disableAutoResizing),this._id=sc.next(),this._disposable=new E,this._viewDisposables=new Map,this._onDidLayoutfromJSON=new k,this.onDidLayoutFromJSON=this._onDidLayoutfromJSON.event,this._onDidLayoutChange=new k,this.onDidLayoutChange=this._onDidLayoutChange.event,this._onDidDrop=new k,this.onDidDrop=this._onDidDrop.event,this._onDidAddView=new k,this.onDidAddView=this._onDidAddView.event,this._onDidRemoveView=new k,this.onDidRemoveView=this._onDidRemoveView.event,this._onUnhandledDragOver=new k,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this.element.style.height="100%",this.element.style.width="100%",this.addDisposables(this._onDidLayoutChange,this._onDidLayoutfromJSON,this._onDidDrop,this._onDidAddView,this._onDidRemoveView,this._onUnhandledDragOver),this._classNames=new Be(this.element),this._classNames.setClassNames((i=t.className)!==null&&i!==void 0?i:""),e.appendChild(this.element),this._options=t,this.paneview=new si(this.element,{orientation:"VERTICAL"}),this.addDisposables(this._disposable)}setVisible(e,t){let i=this.panels.indexOf(e);this.paneview.setViewVisible(i,t)}focus(){}updateOptions(e){if("className"in e){var t;this._classNames.setClassNames((t=e.className)!==null&&t!==void 0?t:"")}if("disableAutoResizing"in e){var i;this.disableResizing=(i=e.disableAutoResizing)!==null&&i!==void 0?i:!1}this._options=N(N({},this.options),e)}addPanel(e){var t,i,n;let o=this.options.createComponent({id:e.id,name:e.component}),a;e.headerComponent&&this.options.createHeaderComponent&&(a=this.options.createHeaderComponent({id:e.id,name:e.headerComponent})),(t=a)!==null&&t!==void 0||(a=new Fr);let d=new On({id:e.id,component:e.component,headerComponent:e.headerComponent,header:a,body:o,orientation:"VERTICAL",isExpanded:!!e.isExpanded,disableDnd:!!this.options.disableDnd,accessor:this,headerSize:(i=e.headerSize)!==null&&i!==void 0?i:Br,minimumBodySize:Ur,maximumBodySize:Yr});this.doAddPanel(d);let l=typeof e.size=="number"?e.size:he.Distribute,u=typeof e.index=="number"?e.index:void 0;return d.init({params:(n=e.params)!==null&&n!==void 0?n:{},minimumBodySize:e.minimumBodySize,maximumBodySize:e.maximumBodySize,isExpanded:e.isExpanded,title:e.title,containerApi:new Dt(this),accessor:this}),this.paneview.addPane(d,l,u),d.orientation=this.paneview.orientation,d}removePanel(e){let t=this.panels.indexOf(e);this.paneview.removePane(t),this.doRemovePanel(e)}movePanel(e,t){this.paneview.moveView(e,t)}getPanel(e){return this.panels.find(t=>t.id===e)}layout(e,t){let[i,n]=this.paneview.orientation==="HORIZONTAL"?[e,t]:[t,e];this.paneview.layout(i,n)}toJSON(){let e=i=>i===Number.MAX_SAFE_INTEGER||i===Number.POSITIVE_INFINITY?void 0:i,t=i=>i<=0?void 0:i;return{views:this.paneview.getPanes().map((i,n)=>{let o=this.paneview.getViewCachedVisibleSize(n),a=typeof o=="number";return N({size:a?o:this.paneview.getViewSize(n),data:i.toJSON(),minimumSize:t(i.minimumBodySize),maximumSize:e(i.maximumBodySize),headerSize:i.headerSize,expanded:i.isExpanded()},a?{visible:!1}:{})}),size:this.paneview.size}}fromJSON(e){this.clear();let{views:t,size:i}=e,n=[],o=this.width,a=this.height;this.paneview.dispose(),this.paneview=new si(this.element,{orientation:"VERTICAL",descriptor:{size:i,views:t.map(d=>{var l,u,v,g;let f=d.data,_=this.options.createComponent({id:f.id,name:f.component}),w;f.headerComponent&&this.options.createHeaderComponent&&(w=this.options.createHeaderComponent({id:f.id,name:f.headerComponent})),(l=w)!==null&&l!==void 0||(w=new Fr);let y=new On({id:f.id,component:f.component,headerComponent:f.headerComponent,header:w,body:_,orientation:"VERTICAL",isExpanded:!!d.expanded,disableDnd:!!this.options.disableDnd,accessor:this,headerSize:(u=d.headerSize)!==null&&u!==void 0?u:Br,minimumBodySize:(v=d.minimumSize)!==null&&v!==void 0?v:Ur,maximumBodySize:(g=d.maximumSize)!==null&&g!==void 0?g:Yr});return this.doAddPanel(y),n.push(()=>{var D;y.init({params:(D=f.params)!==null&&D!==void 0?D:{},minimumBodySize:d.minimumSize,maximumBodySize:d.maximumSize,title:f.title,isExpanded:!!d.expanded,containerApi:new Dt(this),accessor:this}),y.orientation=this.paneview.orientation}),setTimeout(()=>{this._onDidAddView.fire(y)},0),{size:d.size,view:y,visible:d.visible}})}}),this.layout(o,a),n.forEach(d=>d()),this._onDidLayoutfromJSON.fire()}clear(){for(let[i,n]of this._viewDisposables.entries())n.dispose();this._viewDisposables.clear();let e=this.width,t=this.height;this.paneview.dispose(),this.paneview=new si(this.element,{orientation:"VERTICAL"}),this.layout(e,t)}doAddPanel(e){let t=new C(e.onDidDrop(i=>{this._onDidDrop.fire(i)}),e.onUnhandledDragOver(i=>{this._onUnhandledDragOver.fire(i)}));this._viewDisposables.set(e.id,t)}doRemovePanel(e){let t=this._viewDisposables.get(e.id);t&&(t.dispose(),this._viewDisposables.delete(e.id))}dispose(){super.dispose();for(let[e,t]of this._viewDisposables.entries())t.dispose();this._viewDisposables.clear(),this.element.remove(),this.paneview.dispose()}},ac=class extends yn{get priority(){return this._priority}set orientation(e){this._orientation=e}get orientation(){return this._orientation}get minimumSize(){let e=typeof this._minimumSize=="function"?this._minimumSize():this._minimumSize;return e!==this._evaluatedMinimumSize&&(this._evaluatedMinimumSize=e,this.updateConstraints()),e}get maximumSize(){let e=typeof this._maximumSize=="function"?this._maximumSize():this._maximumSize;return e!==this._evaluatedMaximumSize&&(this._evaluatedMaximumSize=e,this.updateConstraints()),e}get snap(){return this._snap}constructor(e,t){super(e,t,new Xo(e,t)),this._evaluatedMinimumSize=0,this._evaluatedMaximumSize=Number.POSITIVE_INFINITY,this._minimumSize=0,this._maximumSize=Number.POSITIVE_INFINITY,this._snap=!1,this._onDidChange=new k,this.onDidChange=this._onDidChange.event,this.api.initialize(this),this.addDisposables(this._onDidChange,this.api.onWillVisibilityChange(i=>{let{isVisible:n}=i,{accessor:o}=this._params;o.setVisible(this,n)}),this.api.onActiveChange(()=>{let{accessor:i}=this._params;i.setActive(this)}),this.api.onDidConstraintsChangeInternal(i=>{(typeof i.minimumSize=="number"||typeof i.minimumSize=="function")&&(this._minimumSize=i.minimumSize),(typeof i.maximumSize=="number"||typeof i.maximumSize=="function")&&(this._maximumSize=i.maximumSize),this.updateConstraints()}),this.api.onDidSizeChange(i=>{this._onDidChange.fire({size:i.size})}))}setVisible(e){this.api._onDidVisibilityChange.fire({isVisible:e})}setActive(e){this.api._onDidActiveChange.fire({isActive:e})}layout(e,t){let[i,n]=this.orientation==="HORIZONTAL"?[e,t]:[t,e];super.layout(i,n)}init(e){super.init(e),this._priority=e.priority,e.minimumSize&&(this._minimumSize=e.minimumSize),e.maximumSize&&(this._maximumSize=e.maximumSize),e.snap&&(this._snap=e.snap)}toJSON(){let e=i=>i===Number.MAX_SAFE_INTEGER||i===Number.POSITIVE_INFINITY?void 0:i,t=i=>i<=0?void 0:i;return N(N({},super.toJSON()),{},{minimumSize:t(this.minimumSize),maximumSize:e(this.maximumSize)})}updateConstraints(){this.api._onDidConstraintsChange.fire({maximumSize:this._evaluatedMaximumSize,minimumSize:this._evaluatedMinimumSize})}};function dc(e,t){return new Vr(e,t).api}function lc(e,t){return new Mo(new Hr(e,t))}function cc(e,t){return new Oo(new Wr(e,t))}function hc(e,t){return new Dt(new Xr(e,t))}r.AdvancedDnDModule=Gr,r.AdvancedDnDService=Cr,r.BaseGrid=mn,r.ContentContainer=Ko,r.ContextMenuController=Ir,r.ContextMenuModule=Mr,r.DEFAULT_TAB_GROUP_COLORS=pi,r.DefaultDockviewDeserialzier=mr,r.DefaultTab=Tn,r.DockviewApi=li,r.DockviewComponent=Vr,r.DockviewCompositeDisposable=C,r.DockviewDidDropEvent=bi,Object.defineProperty(r,"DockviewDisposable",{enumerable:!0,get:function(){return S}}),r.DockviewEmitter=k,Object.defineProperty(r,"DockviewEvent",{enumerable:!0,get:function(){return $}}),r.DockviewGroupPanel=Ht,r.DockviewGroupPanelModel=ur,r.DockviewMutableDisposable=E,r.DockviewPanel=ct,r.DockviewUnhandledDragOverEvent=kn,r.DockviewWillDropEvent=Pn,r.DockviewWillShowOverlayLocationEvent=St,r.DraggablePaneviewPanel=qo,r.EdgeGroupModule=xr,r.FloatingGroupModule=yr,r.Gridview=vn,r.GridviewApi=Oo,r.GridviewComponent=Wr,r.GridviewPanel=pr,r.LayoutPriority=Qa,r.LiveRegionModule=kr,r.LocalSelectionTransfer=m,r.OVERFLOW_MAX_TAB_ROWS_VARIABLE=Rd,r.OVERFLOW_WRAP_TABS_CAPPED_CLASS=Ld,r.OVERFLOW_WRAP_TABS_CLASS=Sn,r.OVERFLOW_WRAP_TABS_VERTICAL_TAB_HEIGHT_VARIABLE=$d,r.Orientation=Za,r.PROPERTY_KEYS_DOCKVIEW=Nd,r.PROPERTY_KEYS_GRIDVIEW=td,r.PROPERTY_KEYS_PANEVIEW=kd,r.PROPERTY_KEYS_SPLITVIEW=ed,r.PaneFramework=On,r.PaneTransfer=p,r.PanelTransfer=c,r.Paneview=si,r.PaneviewApi=Dt,r.PaneviewComponent=Xr,r.PaneviewPanel=Jo,r.PaneviewUnhandledDragOverEvent=Bo,r.SashState=ja,Object.defineProperty(r,"Sizing",{enumerable:!0,get:function(){return he}}),r.Splitview=it,r.SplitviewApi=Mo,r.SplitviewComponent=Hr,r.SplitviewPanel=ac,r.Tab=Qo,r.TabGroupChipsModule=zr,r.TabGroupChipsService=Pr,r.TabGroupColorPalette=Cn,r.applyTabGroupAccent=vi,r.clearRegisteredModules=Dl,r.createCloseButton=Zo,r.createDismissableLayer=Rr,r.createDockview=dc,r.createGridview=cc,r.createPaneview=hc,r.createPinButton=xn,r.createSplitview=lc,r.defineModule=Ve,r.directionToPosition=_n,r.findRelativeZIndexParent=lt,r.getActiveElement=oi,r.getDirectionOrientation=ai,r.getGridLocation=se,r.getLocationOrientation=un,r.getPaneData=x,r.getPanelData=b,r.getPopoutUrlError=rn,r.getRegisteredModules=wr,r.getRelativeLocation=Ce,r.indexInParent=Eo,r.isAnyEdgeGroupEnabled=ui,r.isEdgeGroupEnabled=ir,r.isGridBranchNode=Ao,r.isGroupOptionsWithGroup=sr,r.isGroupOptionsWithPanel=rr,r.isPanelOptionsWithGroup=or,r.isPanelOptionsWithPanel=nr,r.orthogonal=$e,r.positionToDirection=Wo,r.prefersReducedMotion=$t,r.registerModules=xl,r.resolveMessages=bn,r.resolveOpaqueBackground=Ba,r.resolveTabGroupAccent=gi,r.themeAbyss=vr,r.themeAbyssSpaced=nl,r.themeCatppuccinMocha=al,r.themeCatppuccinMochaSpaced=dl,r.themeDark=Qd,r.themeDracula=il,r.themeGithubDark=ul,r.themeGithubDarkSpaced=pl,r.themeGithubLight=vl,r.themeGithubLightSpaced=gl,r.themeLight=el,r.themeLightSpaced=ol,r.themeMonokai=ll,r.themeNord=rl,r.themeNordSpaced=sl,r.themeSolarizedLight=cl,r.themeSolarizedLightSpaced=hl,r.themeVisualStudio=tl,r.toTarget=Nt})});var gc=r=>{let{state:s}=r,h=s.doc.lineAt(s.selection.main.from),c=qn(r.state,h.from);return c.line?mc(r):c.block?fc(r):!1};function Jn(r,s){return({state:h,dispatch:c})=>{if(h.readOnly)return!1;let p=r(s,h);return p?(c(h.update(p)),!0):!1}}var mc=Jn(yc,0);var bc=Jn(Os,0);var fc=Jn((r,s)=>Os(r,s,wc(s)),0);function qn(r,s){let h=r.languageDataAt("commentTokens",s,1);return h.length?h[0]:{}}var Xt=50;function _c(r,{open:s,close:h},c,p){let m=r.sliceDoc(c-Xt,c),b=r.sliceDoc(p,p+Xt),x=/\s*$/.exec(m)[0].length,S=/^\s*/.exec(b)[0].length,C=m.length-x;if(m.slice(C-s.length,C)==s&&b.slice(S,S+h.length)==h)return{open:{pos:c-x,margin:x&&1},close:{pos:p+S,margin:S&&1}};let E,$;p-c<=2*Xt?E=$=r.sliceDoc(c,p):(E=r.sliceDoc(c,c+Xt),$=r.sliceDoc(p-Xt,p));let J=/^\s*/.exec(E)[0].length,te=/\s*$/.exec($)[0].length,ae=$.length-te-h.length;return E.slice(J,J+s.length)==s&&$.slice(ae,ae+h.length)==h?{open:{pos:c+J+s.length,margin:/\s/.test(E.charAt(J+s.length))?1:0},close:{pos:p-te-h.length,margin:/\s/.test($.charAt(ae-1))?1:0}}:null}function wc(r){let s=[];for(let h of r.selection.ranges){let c=r.doc.lineAt(h.from),p=h.to<=c.to?c:r.doc.lineAt(h.to);p.from>c.from&&p.from==h.to&&(p=h.to==c.to+1?c:r.doc.lineAt(h.to-1));let m=s.length-1;m>=0&&s[m].to>c.from?s[m].to=p.to:s.push({from:c.from+/^\s*/.exec(c.text)[0].length,to:p.to})}return s}function Os(r,s,h=s.selection.ranges){let c=h.map(m=>qn(s,m.from).block);if(!c.every(m=>m))return null;let p=h.map((m,b)=>_c(s,c[b],m.from,m.to));if(r!=2&&!p.every(m=>m))return{changes:s.changes(h.map((m,b)=>p[b]?[]:[{from:m.from,insert:c[b].open+" "},{from:m.to,insert:" "+c[b].close}]))};if(r!=1&&p.some(m=>m)){let m=[];for(let b=0,x;b<p.length;b++)if(x=p[b]){let S=c[b],{open:C,close:E}=x;m.push({from:C.pos-S.open.length,to:C.pos+C.margin},{from:E.pos-E.margin,to:E.pos+S.close.length})}return{changes:m}}return null}function yc(r,s,h=s.selection.ranges){let c=[],p=-1;e:for(let{from:m,to:b}of h){let x=c.length,S=1e9,C;for(let E=m;E<=b;){let $=s.doc.lineAt(E);if(C==null&&(C=qn(s,$.from).line,!C))continue e;if($.from>p&&(m==b||b>$.from)){p=$.from;let J=/^\s*/.exec($.text)[0].length,te=J==$.length,ae=$.text.slice(J,J+C.length)==C?J:-1;J<$.text.length&&J<S&&(S=J),c.push({line:$,comment:ae,token:C,indent:J,empty:te,single:!1})}E=$.to+1}if(S<1e9)for(let E=x;E<c.length;E++)c[E].indent<c[E].line.text.length&&(c[E].indent=S);c.length==x+1&&(c[x].single=!0)}if(r!=2&&c.some(m=>m.comment<0&&(!m.empty||m.single))){let m=[];for(let{line:x,token:S,indent:C,empty:E,single:$}of c)($||!E)&&m.push({from:x.from+C,insert:S+" "});let b=s.changes(m);return{changes:b,selection:s.selection.map(b,1)}}else if(r!=1&&c.some(m=>m.comment>=0)){let m=[];for(let{line:b,comment:x,token:S}of c)if(x>=0){let C=b.from+x,E=C+S.length;b.text[E-b.from]==" "&&E++,m.push({from:C,to:E})}return{changes:m}}return null}var Cs=as.define();var xc=Ft.define();var mt=class r{constructor(s,h,c,p,m){this.changes=s,this.effects=h,this.mapped=c,this.startSelection=p,this.selectionsAfter=m}setSelAfter(s){return new r(this.changes,this.effects,this.mapped,this.startSelection,s)}toJSON(){var s,h,c;return{changes:(s=this.changes)===null||s===void 0?void 0:s.toJSON(),mapped:(h=this.mapped)===null||h===void 0?void 0:h.toJSON(),startSelection:(c=this.startSelection)===null||c===void 0?void 0:c.toJSON(),selectionsAfter:this.selectionsAfter.map(p=>p.toJSON())}}static fromJSON(s){return new r(s.changes&&os.fromJSON(s.changes),[],s.mapped&&ns.fromJSON(s.mapped),s.startSelection&&j.fromJSON(s.startSelection),s.selectionsAfter.map(j.fromJSON))}static fromTransaction(s,h){let c=Ie;for(let p of s.startState.facet(xc)){let m=p(s);m.length&&(c=c.concat(m))}return!c.length&&s.changes.empty?null:new r(s.changes.invert(s.startState.doc),c,void 0,h||s.startState.selection,Ie)}static selection(s){return new r(void 0,Ie,void 0,void 0,s)}};function Un(r,s,h,c){let p=s+1>h+20?s-h-1:0,m=r.slice(p,s);return m.push(c),m}function Dc(r,s){let h=[],c=!1;return r.iterChangedRanges((p,m)=>h.push(p,m)),s.iterChangedRanges((p,m,b,x)=>{for(let S=0;S<h.length;){let C=h[S++],E=h[S++];x>=C&&b<=E&&(c=!0)}}),c}function Sc(r,s){return r.ranges.length==s.ranges.length&&r.ranges.filter((h,c)=>h.empty!=s.ranges[c].empty).length===0}function Ls(r,s){return r.length?s.length?r.concat(s):r:s}var Ie=[],kc=200;function Cc(r,s){if(r.length){let h=r[r.length-1],c=h.selectionsAfter.slice(Math.max(0,h.selectionsAfter.length-kc));return c.length&&c[c.length-1].eq(s)?r:(c.push(s),Un(r,r.length-1,1e9,h.setSelAfter(c)))}else return[mt.selection([s])]}function Gc(r){let s=r[r.length-1],h=r.slice();return h[r.length-1]=s.setSelAfter(s.selectionsAfter.slice(0,s.selectionsAfter.length-1)),h}function Bn(r,s){if(!r.length)return r;let h=r.length,c=Ie;for(;h;){let p=Pc(r[h-1],s,c);if(p.changes&&!p.changes.empty||p.effects.length){let m=r.slice(0,h);return m[h-1]=p,m}else s=p.mapped,h--,c=p.selectionsAfter}return c.length?[mt.selection(c)]:Ie}function Pc(r,s,h){let c=Ls(r.selectionsAfter.length?r.selectionsAfter.map(x=>x.map(s)):Ie,h);if(!r.changes)return mt.selection(c);let p=r.changes.map(s),m=s.mapDesc(r.changes,!0),b=r.mapped?r.mapped.composeDesc(m):m;return new mt(p,vt.mapEffects(r.effects,s),b,r.startSelection.map(m),c)}var zc=/^(input\.type|delete)($|\.)/,zi=class r{constructor(s,h,c=0,p=void 0){this.done=s,this.undone=h,this.prevTime=c,this.prevUserEvent=p}isolate(){return this.prevTime?new r(this.done,this.undone):this}addChanges(s,h,c,p,m){let b=this.done,x=b[b.length-1];return x&&x.changes&&!x.changes.empty&&s.changes&&(!c||zc.test(c))&&(!x.selectionsAfter.length&&h-this.prevTime<p.newGroupDelay&&p.joinToEvent(m,Dc(x.changes,s.changes))||c=="input.type.compose")?b=Un(b,b.length-1,p.minDepth,new mt(s.changes.compose(x.changes),Ls(vt.mapEffects(s.effects,x.changes),x.effects),x.mapped,x.startSelection,Ie)):b=Un(b,b.length,p.minDepth,s),new r(b,Ie,h,c)}addSelection(s,h,c,p){let m=this.done.length?this.done[this.done.length-1].selectionsAfter:Ie;return m.length>0&&h-this.prevTime<p&&c==this.prevUserEvent&&c&&/^select($|\.)/.test(c)&&Sc(m[m.length-1],s)?this:new r(Cc(this.done,s),this.undone,h,c)}addMapping(s){return new r(Bn(this.done,s),Bn(this.undone,s),this.prevTime,this.prevUserEvent)}pop(s,h,c){let p=s==0?this.done:this.undone;if(p.length==0)return null;let m=p[p.length-1],b=m.selectionsAfter[0]||(m.startSelection?m.startSelection.map(m.changes.invertedDesc,1):h.selection);if(c&&m.selectionsAfter.length)return h.update({selection:m.selectionsAfter[m.selectionsAfter.length-1],annotations:Cs.of({side:s,rest:Gc(p),selection:b}),userEvent:s==0?"select.undo":"select.redo",scrollIntoView:!0});if(m.changes){let x=p.length==1?Ie:p.slice(0,p.length-1);return m.mapped&&(x=Bn(x,m.mapped)),h.update({changes:m.changes,selection:m.startSelection,effects:m.effects,annotations:Cs.of({side:s,rest:x,selection:b}),filter:!1,userEvent:s==0?"undo":"redo",scrollIntoView:!0})}else return null}};zi.empty=new zi(Ie,Ie);function Ct(r,s){return j.create(r.ranges.map(s),r.mainIndex)}function We(r,s){return r.update({selection:s,scrollIntoView:!0,userEvent:"select"})}function He({state:r,dispatch:s},h){let c=Ct(r.selection,h);return c.eq(r.selection,!0)?!1:(s(We(r,c)),!0)}function Ti(r,s){return j.cursor(s?r.to:r.from)}function Rs(r,s){return He(r,h=>h.empty?r.moveByChar(h,s):Ti(h,s))}function _e(r){return r.textDirectionAt(r.state.selection.main.head)==ls.LTR}var $s=r=>Rs(r,!_e(r)),Ns=r=>Rs(r,_e(r));function Vs(r,s){return He(r,h=>h.empty?r.moveByGroup(h,s):Ti(h,s))}var Tc=r=>Vs(r,!_e(r)),Ec=r=>Vs(r,_e(r));var Tu=typeof Intl<"u"&&Intl.Segmenter?new Intl.Segmenter(void 0,{granularity:"word"}):null;function Ac(r,s,h){if(s.type.prop(h))return!0;let c=s.to-s.from;return c&&(c>2||/[^\s,.;:]/.test(r.sliceDoc(s.from,s.to)))||s.firstChild}function Ei(r,s,h){let c=Ci(r).resolveInner(s.head),p=h?ki.closedBy:ki.openedBy;for(let S=s.head;;){let C=h?c.childAfter(S):c.childBefore(S);if(!C)break;Ac(r,C,p)?c=C:S=h?C.to:C.from}let m=c.type.prop(p),b,x;return m&&(b=h?gt(r,c.from,1):gt(r,c.to,-1))&&b.matched?x=h?b.end.to:b.end.from:x=h?c.to:c.from,j.cursor(x,h?-1:1)}var Ic=r=>He(r,s=>Ei(r.state,s,!_e(r))),Mc=r=>He(r,s=>Ei(r.state,s,_e(r)));function Ws(r,s){return He(r,h=>{if(!h.empty)return Ti(h,s);let c=r.moveVertically(h,s);return c.head!=h.head?c:r.moveToLineBoundary(h,s)})}var Hs=r=>Ws(r,!1),Fs=r=>Ws(r,!0);function Bs(r){let s=r.scrollDOM.clientHeight<r.scrollDOM.scrollHeight-2,h=0,c=0,p;if(s){for(let m of r.state.facet(ce.scrollMargins)){let b=m(r);b?.top&&(h=Math.max(b?.top,h)),b?.bottom&&(c=Math.max(b?.bottom,c))}p=r.scrollDOM.clientHeight-h-c}else p=(r.dom.ownerDocument.defaultView||window).innerHeight;return{marginTop:h,marginBottom:c,selfScroll:s,height:Math.max(r.defaultLineHeight,p-5)}}function Us(r,s){let h=Bs(r),{state:c}=r,p=Ct(c.selection,b=>b.empty?r.moveVertically(b,s,h.height):Ti(b,s));if(p.eq(c.selection))return!1;let m;if(h.selfScroll){let b=r.coordsAtPos(c.selection.main.head),x=r.scrollDOM.getBoundingClientRect(),S=x.top+h.marginTop,C=x.bottom-h.marginBottom;b&&b.top>S&&b.bottom<C&&(m=ce.scrollIntoView(p.main.head,{y:"start",yMargin:b.top-S}))}return r.dispatch(We(c,p),{effects:m}),!0}var Gs=r=>Us(r,!1),Yn=r=>Us(r,!0);function ot(r,s,h){let c=r.lineBlockAt(s.head),p=r.moveToLineBoundary(s,h);if(p.head==s.head&&p.head!=(h?c.to:c.from)&&(p=r.moveToLineBoundary(s,h,!1)),!h&&p.head==c.from&&c.length){let m=/^\s*/.exec(r.state.sliceDoc(c.from,Math.min(c.from+100,c.to)))[0].length;m&&s.head!=c.from+m&&(p=j.cursor(c.from+m))}return p}var Oc=r=>He(r,s=>ot(r,s,!0)),Lc=r=>He(r,s=>ot(r,s,!1)),Rc=r=>He(r,s=>ot(r,s,!_e(r))),$c=r=>He(r,s=>ot(r,s,_e(r))),Nc=r=>He(r,s=>r.moveToLineBoundary(s,!1,!1)),Vc=r=>He(r,s=>r.moveToLineBoundary(s,!0,!1));function Wc(r,s,h){let c=!1,p=Ct(r.selection,m=>{let b=gt(r,m.head,-1)||gt(r,m.head,1)||m.head>0&&gt(r,m.head-1,1)||m.head<r.doc.length&&gt(r,m.head+1,-1);if(!b||!b.end)return m;c=!0;let x=b.start.from==m.head?b.end.to:b.end.from;return h?j.range(m.anchor,x):j.cursor(x)});return c?(s(We(r,p)),!0):!1}var Hc=({state:r,dispatch:s})=>Wc(r,s,!1);function Me(r,s,h){let c=Ct(r.state.selection,p=>{p.undirectional&&p.head>=p.anchor!=s&&(p=j.range(p.head,p.anchor));let m=h(p);return j.range(p.anchor,m.head,m.goalColumn,m.bidiLevel||void 0,m.assoc)});return c.eq(r.state.selection)?!1:(r.dispatch(We(r.state,c)),!0)}function Ys(r,s){return Me(r,s,h=>r.moveByChar(h,s))}var Xs=r=>Ys(r,!_e(r)),Js=r=>Ys(r,_e(r));function qs(r,s){return Me(r,s,h=>r.moveByGroup(h,s))}var Fc=r=>qs(r,!_e(r)),Bc=r=>qs(r,_e(r));var Uc=r=>{let s=!_e(r);return Me(r,s,h=>Ei(r.state,h,s))},Yc=r=>{let s=_e(r);return Me(r,s,h=>Ei(r.state,h,s))};function Ks(r,s){return Me(r,s,h=>r.moveVertically(h,s))}var Zs=r=>Ks(r,!1),js=r=>Ks(r,!0);function Qs(r,s){return Me(r,s,h=>r.moveVertically(h,s,Bs(r).height))}var Ps=r=>Qs(r,!1),zs=r=>Qs(r,!0),Xc=r=>Me(r,!0,s=>ot(r,s,!0)),Jc=r=>Me(r,!1,s=>ot(r,s,!1)),qc=r=>{let s=!_e(r);return Me(r,s,h=>ot(r,h,s))},Kc=r=>{let s=_e(r);return Me(r,s,h=>ot(r,h,s))},Zc=r=>Me(r,!1,s=>j.cursor(r.lineBlockAt(s.head).from)),jc=r=>Me(r,!0,s=>j.cursor(r.lineBlockAt(s.head).to)),Ts=({state:r,dispatch:s})=>(s(We(r,{anchor:0})),!0),Es=({state:r,dispatch:s})=>(s(We(r,{anchor:r.doc.length})),!0),As=({state:r,dispatch:s})=>(s(We(r,{anchor:r.selection.main.anchor,head:0})),!0),Is=({state:r,dispatch:s})=>(s(We(r,{anchor:r.selection.main.anchor,head:r.doc.length})),!0),Qc=({state:r,dispatch:s})=>(s(r.update({selection:{anchor:0,head:r.doc.length},userEvent:"select"})),!0),eh=({state:r,dispatch:s})=>{let h=Ai(r).map(({from:c,to:p})=>j.undirectionalRange(c,Math.min(p+1,r.doc.length)));return s(r.update({selection:j.create(h),userEvent:"select"})),!0},th=({state:r,dispatch:s})=>{let h=Ct(r.selection,c=>{let p=Ci(r),m=p.resolveStack(c.from,1);if(c.empty){let b=p.resolveStack(c.from,-1);b.node.from>=m.node.from&&b.node.to<=m.node.to&&(m=b)}for(let b=m;b;b=b.next){let{node:x}=b;if((x.from<c.from&&x.to>=c.to||x.to>c.to&&x.from<=c.from)&&b.next)return j.undirectionalRange(x.from,x.to)}return c});return h.eq(r.selection)?!1:(s(We(r,h)),!0)};function ea(r,s){let{state:h}=r,c=h.selection,p=h.selection.ranges.slice();for(let m of h.selection.ranges){let b=h.doc.lineAt(m.head);if(s?b.to<r.state.doc.length:b.from>0)for(let x=m;;){let S=r.moveVertically(x,s);if(S.head<b.from||S.head>b.to){p.some(C=>C.head==S.head)||p.push(S);break}else{if(S.head==x.head)break;x=S}}}return p.length==c.ranges.length?!1:(r.dispatch(We(h,j.create(p,p.length-1))),!0)}var ih=r=>ea(r,!1),nh=r=>ea(r,!0),oh=({state:r,dispatch:s})=>{let h=r.selection,c=null;return h.ranges.length>1?c=j.create([h.main]):h.main.empty||(c=j.create([j.cursor(h.main.head)])),c?(s(We(r,c)),!0):!1};function Jt(r,s){if(r.state.readOnly)return!1;let h="delete.selection",{state:c}=r,p=c.changeByRange(m=>{let{from:b,to:x}=m;if(b==x){let S=s(m);S<b?(h="delete.backward",S=Pi(r,S,!1)):S>b&&(h="delete.forward",S=Pi(r,S,!0)),b=Math.min(b,S),x=Math.max(x,S)}else b=Pi(r,b,!1),x=Pi(r,x,!0);return b==x?{range:m}:{changes:{from:b,to:x},range:j.cursor(b,b<m.head?-1:1)}});return p.changes.empty?!1:(r.dispatch(c.update(p,{scrollIntoView:!0,userEvent:h,effects:h=="delete.selection"?ce.announce.of(c.phrase("Selection deleted")):void 0})),!0)}function Pi(r,s,h){if(r instanceof ce)for(let c of r.state.facet(ce.atomicRanges).map(p=>p(r)))c.between(s,s,(p,m)=>{p<s&&m>s&&(s=h?m:p)});return s}var ta=(r,s,h)=>Jt(r,c=>{let p=c.from,{state:m}=r,b=m.doc.lineAt(p),x,S;if(h&&!s&&p>b.from&&p<b.from+200&&!/[^ \t]/.test(x=b.text.slice(0,p-b.from))){if(x[x.length-1]=="	")return p-1;let C=Si(x,m.tabSize),E=C%Gi(m)||Gi(m);for(let $=0;$<E&&x[x.length-1-$]==" ";$++)p--;S=p}else S=Ke(b.text,p-b.from,s,s)+b.from,S==p&&b.number!=(s?m.doc.lines:1)?S+=s?1:-1:!s&&/[\ufe00-\ufe0f]/.test(b.text.slice(S-b.from,p-b.from))&&(S=Ke(b.text,S-b.from,!1,!1)+b.from);return S}),Xn=r=>ta(r,!1,!0);var ia=r=>ta(r,!0,!1),na=(r,s)=>Jt(r,h=>{let c=h.head,{state:p}=r,m=p.doc.lineAt(c),b=p.charCategorizer(c);for(let x=null;;){if(c==(s?m.to:m.from)){c==h.head&&m.number!=(s?p.doc.lines:1)&&(c+=s?1:-1);break}let S=Ke(m.text,c-m.from,s)+m.from,C=m.text.slice(Math.min(c,S)-m.from,Math.max(c,S)-m.from),E=b(C);if(x!=null&&E!=x)break;(C!=" "||c!=h.head)&&(x=E),c=S}return c}),oa=r=>na(r,!1),rh=r=>na(r,!0);var sh=r=>Jt(r,s=>{let h=r.lineBlockAt(s.head).to;return s.head<h?h:Math.min(r.state.doc.length,s.head+1)});var ah=r=>Jt(r,s=>{let h=r.moveToLineBoundary(s,!1).head;return s.head>h?h:Math.max(0,s.head-1)}),dh=r=>Jt(r,s=>{let h=r.moveToLineBoundary(s,!0).head;return s.head<h?h:Math.min(r.state.doc.length,s.head+1)});var lh=({state:r,dispatch:s})=>{if(r.readOnly)return!1;let h=r.changeByRange(c=>({changes:{from:c.from,to:c.to,insert:Rn.of(["",""])},range:j.cursor(c.from)}));return s(r.update(h,{scrollIntoView:!0,userEvent:"input"})),!0},ch=({state:r,dispatch:s})=>{if(r.readOnly)return!1;let h=r.changeByRange(c=>{if(!c.empty||c.from==0||c.from==r.doc.length)return{range:c};let p=c.from,m=r.doc.lineAt(p),b=p==m.from?p-1:Ke(m.text,p-m.from,!1)+m.from,x=p==m.to?p+1:Ke(m.text,p-m.from,!0)+m.from;return{changes:{from:b,to:x,insert:r.doc.slice(p,x).append(r.doc.slice(b,p))},range:j.cursor(x)}});return h.changes.empty?!1:(s(r.update(h,{scrollIntoView:!0,userEvent:"move.character"})),!0)};function Ai(r){let s=[],h=-1;for(let c of r.selection.ranges){let p=r.doc.lineAt(c.from),m=r.doc.lineAt(c.to);if(!c.empty&&c.to==m.from&&(m=r.doc.lineAt(c.to-1)),h>=p.number){let b=s[s.length-1];b.to=m.to,b.ranges.push(c)}else s.push({from:p.from,to:m.to,ranges:[c]});h=m.number+1}return s}function ra(r,s,h){if(r.readOnly)return!1;let c=[],p=[];for(let m of Ai(r)){if(h?m.to==r.doc.length:m.from==0)continue;let b=r.doc.lineAt(h?m.to+1:m.from-1),x=b.length+1;if(h){c.push({from:m.to,to:b.to},{from:m.from,insert:b.text+r.lineBreak});for(let S of m.ranges)p.push(j.range(Math.min(r.doc.length,S.anchor+x),Math.min(r.doc.length,S.head+x)))}else{c.push({from:b.from,to:m.from},{from:m.to,insert:r.lineBreak+b.text});for(let S of m.ranges)p.push(j.range(S.anchor-x,S.head-x))}}return c.length?(s(r.update({changes:c,scrollIntoView:!0,selection:j.create(p,r.selection.mainIndex),userEvent:"move.line"})),!0):!1}var hh=({state:r,dispatch:s})=>ra(r,s,!1),uh=({state:r,dispatch:s})=>ra(r,s,!0);function sa(r,s,h){if(r.readOnly)return!1;let c=[];for(let m of Ai(r))h?c.push({from:m.from,insert:r.doc.slice(m.from,m.to)+r.lineBreak}):c.push({from:m.to,insert:r.lineBreak+r.doc.slice(m.from,m.to)});let p=r.changes(c);return s(r.update({changes:p,selection:r.selection.map(p,h?1:-1),scrollIntoView:!0,userEvent:"input.copyline"})),!0}var ph=({state:r,dispatch:s})=>sa(r,s,!1),vh=({state:r,dispatch:s})=>sa(r,s,!0),gh=r=>{if(r.state.readOnly)return!1;let{state:s}=r,h=s.changes(Ai(s).map(({from:p,to:m})=>(p>0?p--:m<s.doc.length&&m++,{from:p,to:m}))),c=Ct(s.selection,p=>{let m;if(r.lineWrapping){let b=r.lineBlockAt(p.head),x=r.coordsAtPos(p.head,p.assoc||1);x&&(m=b.bottom+r.documentTop-x.bottom+r.defaultLineHeight/2)}return r.moveVertically(p,!0,m)}).map(h);return r.dispatch({changes:h,selection:c,scrollIntoView:!0,userEvent:"delete.line"}),!0};function mh(r,s){if(/\(\)|\[\]|\{\}/.test(r.sliceDoc(s-1,s+1)))return{from:s,to:s};let h=Ci(r).resolveInner(s),c=h.childBefore(s),p=h.childAfter(s),m;return c&&p&&c.to<=s&&p.from>=s&&(m=c.type.prop(ki.closedBy))&&m.indexOf(p.name)>-1&&r.doc.lineAt(c.to).from==r.doc.lineAt(p.from).from&&!/\S/.test(r.sliceDoc(c.to,p.from))?{from:c.to,to:p.from}:null}var Ms=aa(!1),bh=aa(!0);function aa(r){return({state:s,dispatch:h})=>{if(s.readOnly)return!1;let c=s.changeByRange(p=>{let{from:m,to:b}=p,x=s.doc.lineAt(m),S=!r&&m==b&&mh(s,m);r&&(m=b=(b<=x.to?x:s.doc.lineAt(b)).to);let C=new Hn(s,{simulateBreak:m,simulateDoubleBreak:!!S}),E=Wn(C,m);for(E==null&&(E=Si(/^\s*/.exec(s.doc.lineAt(m).text)[0],s.tabSize));b<x.to&&/\s/.test(x.text[b-x.from]);)b++;S?{from:m,to:b}=S:m>x.from&&m<x.from+100&&!/\S/.test(x.text.slice(0,m))&&(m=x.from);let $=["",Ut(s,E)];return S&&$.push(Ut(s,C.lineIndent(x.from,-1))),{changes:{from:m,to:b,insert:Rn.of($)},range:j.cursor(m+1+$[1].length)}});return h(s.update(c,{scrollIntoView:!0,userEvent:"input"})),!0}}function Kn(r,s){let h=-1;return r.changeByRange(c=>{let p=[];for(let b=c.from;b<=c.to;){let x=r.doc.lineAt(b);x.number>h&&(c.empty||c.to>x.from)&&(s(x,p,c),h=x.number),b=x.to+1}let m=r.changes(p);return{changes:p,range:j.range(m.mapPos(c.anchor,1),m.mapPos(c.head,1))}})}var fh=({state:r,dispatch:s})=>{if(r.readOnly)return!1;let h=Object.create(null),c=new Hn(r,{overrideIndentation:m=>{let b=h[m];return b??-1}}),p=Kn(r,(m,b,x)=>{let S=Wn(c,m.from);if(S==null)return;/\S/.test(m.text)||(S=0);let C=/^\s*/.exec(m.text)[0],E=Ut(r,S);(C!=E||x.from<m.from+C.length)&&(h[m.from]=S,b.push({from:m.from,to:m.from+C.length,insert:E}))});return p.changes.empty||s(r.update(p,{userEvent:"indent"})),!0},_h=({state:r,dispatch:s})=>r.readOnly?!1:(s(r.update(Kn(r,(h,c)=>{c.push({from:h.from,insert:r.facet(ws)})}),{userEvent:"input.indent"})),!0),wh=({state:r,dispatch:s})=>r.readOnly?!1:(s(r.update(Kn(r,(h,c)=>{let p=/^\s*/.exec(h.text)[0];if(!p)return;let m=Si(p,r.tabSize),b=0,x=Ut(r,Math.max(0,m-Gi(r)));for(;b<p.length&&b<x.length&&p.charCodeAt(b)==x.charCodeAt(b);)b++;c.push({from:h.from+b,to:h.from+p.length,insert:x.slice(b)})}),{userEvent:"delete.dedent"})),!0),yh=r=>(r.setTabFocusMode(),!0);var xh=[{key:"Ctrl-b",run:$s,shift:Xs,preventDefault:!0},{key:"Ctrl-f",run:Ns,shift:Js},{key:"Ctrl-p",run:Hs,shift:Zs},{key:"Ctrl-n",run:Fs,shift:js},{key:"Ctrl-a",run:Nc,shift:Zc},{key:"Ctrl-e",run:Vc,shift:jc},{key:"Ctrl-d",run:ia},{key:"Ctrl-h",run:Xn},{key:"Ctrl-k",run:sh},{key:"Ctrl-Alt-h",run:oa},{key:"Ctrl-o",run:lh},{key:"Ctrl-t",run:ch},{key:"Ctrl-v",run:Yn}],Dh=[{key:"ArrowLeft",run:$s,shift:Xs,preventDefault:!0},{key:"Mod-ArrowLeft",mac:"Alt-ArrowLeft",run:Tc,shift:Fc,preventDefault:!0},{mac:"Cmd-ArrowLeft",run:Rc,shift:qc,preventDefault:!0},{key:"ArrowRight",run:Ns,shift:Js,preventDefault:!0},{key:"Mod-ArrowRight",mac:"Alt-ArrowRight",run:Ec,shift:Bc,preventDefault:!0},{mac:"Cmd-ArrowRight",run:$c,shift:Kc,preventDefault:!0},{key:"ArrowUp",run:Hs,shift:Zs,preventDefault:!0},{mac:"Cmd-ArrowUp",run:Ts,shift:As},{mac:"Ctrl-ArrowUp",run:Gs,shift:Ps},{key:"ArrowDown",run:Fs,shift:js,preventDefault:!0},{mac:"Cmd-ArrowDown",run:Es,shift:Is},{mac:"Ctrl-ArrowDown",run:Yn,shift:zs},{key:"PageUp",run:Gs,shift:Ps},{key:"PageDown",run:Yn,shift:zs},{key:"Home",run:Lc,shift:Jc,preventDefault:!0},{key:"Mod-Home",run:Ts,shift:As},{key:"End",run:Oc,shift:Xc,preventDefault:!0},{key:"Mod-End",run:Es,shift:Is},{key:"Enter",run:Ms,shift:Ms},{key:"Mod-a",run:Qc},{key:"Backspace",run:Xn,shift:Xn,preventDefault:!0},{key:"Delete",run:ia,preventDefault:!0},{key:"Mod-Backspace",mac:"Alt-Backspace",run:oa,preventDefault:!0},{key:"Mod-Delete",mac:"Alt-Delete",run:rh,preventDefault:!0},{mac:"Mod-Backspace",run:ah,preventDefault:!0},{mac:"Mod-Delete",run:dh,preventDefault:!0}].concat(xh.map(r=>({mac:r.key,run:r.run,shift:r.shift}))),da=[{key:"Alt-ArrowLeft",mac:"Ctrl-ArrowLeft",run:Ic,shift:Uc},{key:"Alt-ArrowRight",mac:"Ctrl-ArrowRight",run:Mc,shift:Yc},{key:"Alt-ArrowUp",run:hh},{key:"Shift-Alt-ArrowUp",run:ph},{key:"Alt-ArrowDown",run:uh},{key:"Shift-Alt-ArrowDown",run:vh},{key:"Mod-Alt-ArrowUp",run:ih},{key:"Mod-Alt-ArrowDown",run:nh},{key:"Escape",run:oh},{key:"Mod-Enter",run:bh},{key:"Alt-l",mac:"Ctrl-l",run:eh},{key:"Mod-i",run:th,preventDefault:!0},{key:"Mod-[",run:wh},{key:"Mod-]",run:_h},{key:"Mod-Alt-\\",run:fh},{key:"Shift-Mod-k",run:gh},{key:"Shift-Mod-\\",run:Hc},{key:"Mod-/",run:gc},{key:"Alt-A",mac:"Ctrl-A",run:bc},{key:"Ctrl-m",mac:"Shift-Alt-m",run:yh}].concat(Dh);var la=typeof String.prototype.normalize=="function"?r=>r.normalize("NFKD"):r=>r,st=class{constructor(s,h,c=0,p=s.length,m,b){this.test=b,this.value={from:0,to:0,precise:!1},this.done=!1,this.matches=[],this.buffer="",this.bufferPos=0,this.iter=s.iterRange(c,p),this.bufferStart=c,this.normalize=m?x=>m(la(x)):la,this.query=this.normalize(h)}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return-1;this.bufferPos=0,this.buffer=this.iter.value}return es(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let s=this.peek();if(s<0)return this.done=!0,this;let h=ts(s),c=this.bufferStart+this.bufferPos;this.bufferPos+=is(s);let p=this.normalize(h);if(p.length)for(let m=0,b=c,x=!0;;m++){let S=p.charCodeAt(m),C=this.match(S,b,x,this.bufferPos+this.bufferStart,m==p.length-1);if(C)return this.value=C,this;if(m==p.length-1)break;x&&m<h.length&&h.charCodeAt(m)==S?b++:x=!1}}}match(s,h,c,p,m){let b=null;for(let x=0;x<this.matches.length;){let S=this.matches[x],C=!1;this.query.charCodeAt(S.index)==s&&(S.index==this.query.length-1?b={from:S.from,to:p,precise:m&&S.precise}:(S.index++,C=!0)),C?x++:this.matches.splice(x,1)}return this.query.charCodeAt(0)==s&&(this.query.length==1?b={from:h,to:p,precise:c&&m}:this.matches.push({from:h,index:1,precise:c})),b&&this.test&&!this.test(b.from,b.to,this.buffer,this.bufferStart)&&(b=null),b}};typeof Symbol<"u"&&(st.prototype[Symbol.iterator]=function(){return this});var ua={from:-1,to:-1,match:/.*/.exec(""),precise:!0},io="gm"+(/x/.unicode==null?"":"u"),Oi=class{constructor(s,h,c,p=0,m=s.length){if(this.text=s,this.to=m,this.curLine="",this.done=!1,this.value=ua,/\\[sWDnr]|\n|\r|\[\^/.test(h))return new Ri(s,h,c,p,m);this.re=new RegExp(h,io+(c?.ignoreCase?"i":"")),this.test=c?.test,this.iter=s.iter();let b=s.lineAt(p);this.curLineStart=b.from,this.matchPos=$i(s,p),this.getLine(this.curLineStart)}getLine(s){this.iter.next(s),this.iter.lineBreak?this.curLine="":(this.curLine=this.iter.value,this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart)),this.iter.next())}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1,this.curLineStart>this.to?this.curLine="":this.getLine(0)}next(){for(let s=this.matchPos-this.curLineStart;;){this.re.lastIndex=s;let h=this.matchPos<=this.to&&this.re.exec(this.curLine);if(h){let c=this.curLineStart+h.index,p=c+h[0].length;if(this.matchPos=$i(this.text,p+(c==p?1:0)),c==this.curLineStart+this.curLine.length&&this.nextLine(),(c<p||c>this.value.to)&&(!this.test||this.test(c,p,h)))return this.value={from:c,to:p,precise:!0,match:h},this;s=this.matchPos-this.curLineStart}else if(this.curLineStart+this.curLine.length<this.to)this.nextLine(),s=0;else return this.done=!0,this}}},Zn=new WeakMap,Li=class r{constructor(s,h){this.from=s,this.text=h}get to(){return this.from+this.text.length}static get(s,h,c){let p=Zn.get(s);if(!p||p.from>=c||p.to<=h){let x=new r(h,s.sliceString(h,c));return Zn.set(s,x),x}if(p.from==h&&p.to==c)return p;let{text:m,from:b}=p;return b>h&&(m=s.sliceString(h,b)+m,b=h),p.to<c&&(m+=s.sliceString(p.to,c)),Zn.set(s,new r(b,m)),new r(h,m.slice(h-b,c-b))}},Ri=class{constructor(s,h,c,p,m){this.text=s,this.to=m,this.done=!1,this.value=ua,this.matchPos=$i(s,p),this.re=new RegExp(h,io+(c?.ignoreCase?"i":"")),this.test=c?.test,this.flat=Li.get(s,p,this.chunkEnd(p+5e3))}chunkEnd(s){return s>=this.to?this.to:this.text.lineAt(s).to}next(){for(;;){let s=this.re.lastIndex=this.matchPos-this.flat.from,h=this.re.exec(this.flat.text);if(h&&!h[0]&&h.index==s&&(this.re.lastIndex=s+1,h=this.re.exec(this.flat.text)),h){let c=this.flat.from+h.index,p=c+h[0].length;if((this.flat.to>=this.to||h.index+h[0].length<=this.flat.text.length-10)&&(!this.test||this.test(c,p,h)))return this.value={from:c,to:p,precise:!0,match:h},this.matchPos=$i(this.text,p+(c==p?1:0)),this}if(this.flat.to==this.to)return this.done=!0,this;this.flat=Li.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+this.flat.text.length*2))}}};typeof Symbol<"u"&&(Oi.prototype[Symbol.iterator]=Ri.prototype[Symbol.iterator]=function(){return this});function Sh(r){try{return new RegExp(r,io),!0}catch{return!1}}function $i(r,s){if(s>=r.length)return s;let h=r.lineAt(s),c;for(;s<h.to&&(c=h.text.charCodeAt(s-h.from))>=56320&&c<57344;)s++;return s}var kh=r=>{let s=bs(r,"cm-goto-line");if(s){let b=s.dom.querySelector("input[type=text]");return b&&b.select(),!0}let{state:h}=r,c=String(h.doc.lineAt(r.state.selection.main.head).number),{close:p,result:m}=ms(r,{class:"cm-goto-line",label:h.phrase("Go to line"),input:{type:"text",name:"line",value:c},focus:!0,submitLabel:h.phrase("go")});return m.then(b=>{let x=b&&/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(b.elements.line.value);if(!x){r.dispatch({effects:p});return}let S=h.doc.lineAt(h.selection.main.head),[,C,E,$,J]=x,te=$?+$.slice(1):0,ae=E?+E:S.number;if(E&&J){let k=ae/100;C&&(k=k*(C=="-"?-1:1)+S.number/h.doc.lines),ae=Math.round(h.doc.lines*k)}else E&&C&&(ae=ae*(C=="-"?-1:1)+S.number);let le=h.doc.line(Math.max(1,Math.min(h.doc.lines,ae))),ue=j.cursor(le.from+Math.max(0,Math.min(te,le.length)));r.dispatch({effects:[p,ce.scrollIntoView(ue.from,{y:"center"})],selection:ue})}),!0},Ch={highlightWordAroundCursor:!1,minSelectionLength:1,maxMatches:100,wholeWords:!1},pa=Ft.define({combine(r){return Di(r,Ch,{highlightWordAroundCursor:(s,h)=>s||h,minSelectionLength:Math.min,maxMatches:Math.min})}});function va(r){let s=[Eh,Th];return r&&s.push(pa.of(r)),s}var Gh=Se.mark({class:"cm-selectionMatch"}),Ph=Se.mark({class:"cm-selectionMatch cm-selectionMatch-main"});function ca(r,s,h,c){return(h==0||r(s.sliceDoc(h-1,h))!=De.Word)&&(c==s.doc.length||r(s.sliceDoc(c,c+1))!=De.Word)}function zh(r,s,h,c){return r(s.sliceDoc(h,h+1))==De.Word&&r(s.sliceDoc(c-1,c))==De.Word}var Th=Nn.fromClass(class{constructor(r){this.decorations=this.getDeco(r)}update(r){(r.selectionSet||r.docChanged||r.viewportChanged)&&(this.decorations=this.getDeco(r.view))}getDeco(r){let s=r.state.facet(pa),{state:h}=r,c=h.selection;if(c.ranges.length>1)return Se.none;let p=c.main,m,b=null;if(p.empty){if(!s.highlightWordAroundCursor)return Se.none;let S=h.wordAt(p.head);if(!S)return Se.none;b=h.charCategorizer(p.head),m=h.sliceDoc(S.from,S.to)}else{let S=p.to-p.from;if(S<s.minSelectionLength||S>200)return Se.none;if(s.wholeWords){if(m=h.sliceDoc(p.from,p.to),b=h.charCategorizer(p.head),!(ca(b,h,p.from,p.to)&&zh(b,h,p.from,p.to)))return Se.none}else if(m=h.sliceDoc(p.from,p.to),!m)return Se.none}let x=[];for(let S of r.visibleRanges){let C=new st(h.doc,m,S.from,S.to);for(;!C.next().done;){let{from:E,to:$}=C.value;if((!b||ca(b,h,E,$))&&(p.empty&&E<=p.from&&$>=p.to?x.push(Ph.range(E,$)):(E>=p.to||$<=p.from)&&x.push(Gh.range(E,$)),x.length>s.maxMatches))return Se.none}}return Se.set(x)}},{decorations:r=>r.decorations}),Eh=ce.baseTheme({".cm-selectionMatch":{backgroundColor:"#99ff7780"},".cm-searchMatch .cm-selectionMatch":{backgroundColor:"transparent"}}),Ah=({state:r,dispatch:s})=>{let{selection:h}=r,c=j.create(h.ranges.map(p=>r.wordAt(p.head)||j.cursor(p.head)),h.mainIndex);return c.eq(h)?!1:(s(r.update({selection:c})),!0)};function Ih(r,s){let{main:h,ranges:c}=r.selection,p=r.wordAt(h.head),m=p&&p.from==h.from&&p.to==h.to;for(let b=!1,x=new st(r.doc,s,c[c.length-1].to);;)if(x.next(),x.done){if(b)return null;x=new st(r.doc,s,0,Math.max(0,c[c.length-1].from-1)),b=!0}else{if(b&&c.some(S=>S.from==x.value.from))continue;if(m){let S=r.wordAt(x.value.from);if(!S||S.from!=x.value.from||S.to!=x.value.to)continue}return x.value}}var Mh=({state:r,dispatch:s})=>{let{ranges:h}=r.selection;if(h.some(m=>m.from===m.to))return Ah({state:r,dispatch:s});let c=r.sliceDoc(h[0].from,h[0].to);if(r.selection.ranges.some(m=>r.sliceDoc(m.from,m.to)!=c))return!1;let p=Ih(r,c);return p?(s(r.update({selection:r.selection.addRange(j.range(p.from,p.to),!1),effects:ce.scrollIntoView(p.to)})),!0):!1},zt=Ft.define({combine(r){return Di(r,{top:!1,caseSensitive:!1,literal:!1,regexp:!1,wholeWord:!1,createPanel:s=>new to(s),scrollToMatch:s=>ce.scrollIntoView(s)})}});var Ni=class{constructor(s){this.search=s.search,this.caseSensitive=!!s.caseSensitive,this.literal=!!s.literal,this.regexp=!!s.regexp,this.replace=s.replace||"",this.valid=!!this.search&&(!this.regexp||Sh(this.search)),this.unquoted=this.unquote(this.search),this.wholeWord=!!s.wholeWord,this.test=s.test}unquote(s){return this.literal?s:s.replace(/\\([nrt\\])/g,(h,c)=>c=="n"?`
`:c=="r"?"\r":c=="t"?"	":"\\")}eq(s){return this.search==s.search&&this.replace==s.replace&&this.caseSensitive==s.caseSensitive&&this.regexp==s.regexp&&this.wholeWord==s.wholeWord&&this.test==s.test}create(){return this.regexp?new Qn(this):new jn(this)}getCursor(s,h=0,c){let p=s.doc?s:Bt.create({doc:s});return c==null&&(c=p.doc.length),this.regexp?Pt(this,p,h,c):Gt(this,p,h,c)}},Vi=class{constructor(s){this.spec=s}};function Oh(r,s,h){return(c,p,m,b)=>{if(h&&!h(c,p,m,b))return!1;let x=c>=b&&p<=b+m.length?m.slice(c-b,p-b):s.doc.sliceString(c,p);return r(x,s,c,p)}}function Gt(r,s,h,c){let p;return r.wholeWord&&(p=Lh(s.doc,s.charCategorizer(s.selection.main.head))),r.test&&(p=Oh(r.test,s,p)),new st(s.doc,r.unquoted,h,c,r.caseSensitive?void 0:m=>m.toLowerCase(),p)}function Lh(r,s){return(h,c,p,m)=>((m>h||m+p.length<c)&&(m=Math.max(0,h-2),p=r.sliceString(m,Math.min(r.length,c+2))),(s(Wi(p,h-m))!=De.Word||s(Hi(p,h-m))!=De.Word)&&(s(Hi(p,c-m))!=De.Word||s(Wi(p,c-m))!=De.Word))}var jn=class extends Vi{constructor(s){super(s)}nextMatch(s,h,c){let p=Gt(this.spec,s,c,s.doc.length).nextOverlapping();if(p.done){let m=Math.min(s.doc.length,h+this.spec.unquoted.length);p=Gt(this.spec,s,0,m).nextOverlapping()}return p.done||p.value.from==h&&p.value.to==c?null:p.value}prevMatchInRange(s,h,c){for(let p=c;;){let m=Math.max(h,p-1e4-this.spec.unquoted.length),b=Gt(this.spec,s,m,p),x=null;for(;!b.nextOverlapping().done;)x=b.value;if(x)return x;if(m==h)return null;p-=1e4}}prevMatch(s,h,c){let p=this.prevMatchInRange(s,0,h);return p||(p=this.prevMatchInRange(s,Math.max(0,c-this.spec.unquoted.length),s.doc.length)),p&&(p.from!=h||p.to!=c)?p:null}getReplacement(s){return this.spec.unquote(this.spec.replace)}matchAll(s,h){let c=Gt(this.spec,s,0,s.doc.length),p=[];for(;!c.next().done;){if(p.length>=h)return null;p.push(c.value)}return p}highlight(s,h,c,p){let m=Gt(this.spec,s,Math.max(0,h-this.spec.unquoted.length),Math.min(c+this.spec.unquoted.length,s.doc.length));for(;!m.next().done;)p(m.value.from,m.value.to)}};function Rh(r,s,h){return(c,p,m)=>(!h||h(c,p,m))&&r(m[0],s,c,p)}function Pt(r,s,h,c){let p;return r.wholeWord&&(p=$h(s.charCategorizer(s.selection.main.head))),r.test&&(p=Rh(r.test,s,p)),new Oi(s.doc,r.search,{ignoreCase:!r.caseSensitive,test:p},h,c)}function Wi(r,s){return r.slice(Ke(r,s,!1),s)}function Hi(r,s){return r.slice(s,Ke(r,s))}function $h(r){return(s,h,c)=>!c[0].length||(r(Wi(c.input,c.index))!=De.Word||r(Hi(c.input,c.index))!=De.Word)&&(r(Hi(c.input,c.index+c[0].length))!=De.Word||r(Wi(c.input,c.index+c[0].length))!=De.Word)}var Qn=class extends Vi{nextMatch(s,h,c){let p=Pt(this.spec,s,c,s.doc.length).next();return p.done&&(p=Pt(this.spec,s,0,h).next()),p.done?null:p.value}prevMatchInRange(s,h,c){for(let p=1;;p++){let m=Math.max(h,c-p*1e4),b=Pt(this.spec,s,m,c),x=null;for(;!b.next().done;)x=b.value;if(x&&(m==h||x.from>m+10))return x;if(m==h)return null}}prevMatch(s,h,c){return this.prevMatchInRange(s,0,h)||this.prevMatchInRange(s,c,s.doc.length)}getReplacement(s){return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g,(h,c)=>{if(c=="&")return s.match[0];if(c=="$")return"$";for(let p=c.length;p>0;p--){let m=+c.slice(0,p);if(m>0&&m<s.match.length)return s.match[m]+c.slice(p)}return h})}matchAll(s,h){let c=Pt(this.spec,s,0,s.doc.length),p=[];for(;!c.next().done;){if(p.length>=h)return null;p.push(c.value)}return p}highlight(s,h,c,p){let m=Pt(this.spec,s,Math.max(0,h-250),Math.min(c+250,s.doc.length));for(;!m.next().done;)p(m.value.from,m.value.to)}},Kt=vt.define(),no=vt.define(),rt=$n.define({create(r){return new qt(eo(r).create(),null)},update(r,s){for(let h of s.effects)h.is(Kt)?r=new qt(h.value.create(),r.panel):h.is(no)&&(r=new qt(r.query,h.value?oo:null));return r},provide:r=>gs.from(r,s=>s.panel)});var qt=class{constructor(s,h){this.query=s,this.panel=h}},Nh=Se.mark({class:"cm-searchMatch"}),Vh=Se.mark({class:"cm-searchMatch cm-searchMatch-selected"}),Wh=Nn.fromClass(class{constructor(r){this.view=r,this.decorations=this.highlight(r.state.field(rt))}update(r){let s=r.state.field(rt);(s!=r.startState.field(rt)||r.docChanged||r.selectionSet||r.viewportChanged)&&(this.decorations=this.highlight(s))}highlight({query:r,panel:s}){if(!s||!r.spec.valid)return Se.none;let{view:h}=this,c=new ds;for(let p=0,m=h.visibleRanges,b=m.length;p<b;p++){let{from:x,to:S}=m[p];for(;p<b-1&&S>m[p+1].from-500;)S=m[++p].to;r.highlight(h.state,x,S,(C,E)=>{let $=h.state.selection.ranges.some(J=>J.from==C&&J.to==E);c.add(C,E,$?Vh:Nh)})}return c.finish()}},{decorations:r=>r.decorations});function Zt(r){return s=>{let h=s.state.field(rt,!1);return h&&h.query.spec.valid?r(s,h):ba(s)}}var Fi=Zt((r,{query:s})=>{let{to:h}=r.state.selection.main,c=s.nextMatch(r.state,h,h);if(!c)return!1;let p=j.single(c.from,c.to),m=r.state.facet(zt);return r.dispatch({selection:p,effects:[ro(r,c),m.scrollToMatch(p.main,r)],userEvent:"select.search"}),ma(r),!0}),Bi=Zt((r,{query:s})=>{let{state:h}=r,{from:c}=h.selection.main,p=s.prevMatch(h,c,c);if(!p)return!1;let m=j.single(p.from,p.to),b=r.state.facet(zt);return r.dispatch({selection:m,effects:[ro(r,p),b.scrollToMatch(m.main,r)],userEvent:"select.search"}),ma(r),!0}),Hh=Zt((r,{query:s})=>{let h=s.matchAll(r.state,1e3);return!h||!h.length?!1:(r.dispatch({selection:j.create(h.map(c=>j.range(c.from,c.to))),userEvent:"select.search.matches"}),!0)}),Fh=({state:r,dispatch:s})=>{let h=r.selection;if(h.ranges.length>1||h.main.empty)return!1;let{from:c,to:p}=h.main,m=[],b=0;for(let x=new st(r.doc,r.sliceDoc(c,p));!x.next().done;){if(m.length>1e3)return!1;x.value.from==c&&(b=m.length),m.push(j.range(x.value.from,x.value.to))}return s(r.update({selection:j.create(m,b),userEvent:"select.search.matches"})),!0},ha=Zt((r,{query:s})=>{let{state:h}=r,{from:c,to:p}=h.selection.main;if(h.readOnly)return!1;let m=s.nextMatch(h,c,c);if(!m)return!1;let b=m,x=[],S,C,E=[];b.precise?b.from==c&&b.to==p&&(C=h.toText(s.getReplacement(b)),x.push({from:b.from,to:b.to,insert:C}),b=s.nextMatch(h,b.from,b.to),E.push(ce.announce.of(h.phrase("replaced match on line $",h.doc.lineAt(c).number)+"."))):b=s.nextMatch(h,b.from,b.to);let $=r.state.changes(x);return b&&(S=j.single(b.from,b.to).map($),E.push(ro(r,b)),E.push(h.facet(zt).scrollToMatch(S.main,r))),r.dispatch({changes:$,selection:S,effects:E,userEvent:"input.replace"}),!0}),Bh=Zt((r,{query:s})=>{if(r.state.readOnly)return!1;let h=[];for(let p of s.matchAll(r.state,1e9)){let{from:m,to:b,precise:x}=p;x&&h.push({from:m,to:b,insert:s.getReplacement(p)})}if(!h.length)return!1;let c=r.state.phrase("replaced $ matches",h.length)+".";return r.dispatch({changes:h,effects:ce.announce.of(c),userEvent:"input.replace.all"}),!0});function oo(r){return r.state.facet(zt).createPanel(r)}function eo(r,s){var h,c,p,m,b;let x=r.selection.main,S=x.empty||x.to>x.from+100?"":r.sliceDoc(x.from,x.to);if(s&&!S)return s;let C=r.facet(zt);return new Ni({search:((h=s?.literal)!==null&&h!==void 0?h:C.literal)?S:S.replace(/\n/g,"\\n"),caseSensitive:(c=s?.caseSensitive)!==null&&c!==void 0?c:C.caseSensitive,literal:(p=s?.literal)!==null&&p!==void 0?p:C.literal,regexp:(m=s?.regexp)!==null&&m!==void 0?m:C.regexp,wholeWord:(b=s?.wholeWord)!==null&&b!==void 0?b:C.wholeWord})}function ga(r){let s=Vn(r,oo);return s&&s.dom.querySelector("[main-field]")}function ma(r){let s=ga(r);s&&s==r.root.activeElement&&s.select()}var ba=r=>{let s=r.state.field(rt,!1);if(s&&s.panel){let h=ga(r);if(h&&h!=r.root.activeElement){let c=eo(r.state,s.query.spec);c.valid&&r.dispatch({effects:Kt.of(c)}),h.focus(),h.select()}}else r.dispatch({effects:[no.of(!0),s?Kt.of(eo(r.state,s.query.spec)):vt.appendConfig.of(Yh)]});return!0},fa=r=>{let s=r.state.field(rt,!1);if(!s||!s.panel)return!1;let h=Vn(r,oo);return h&&h.dom.contains(r.root.activeElement)&&r.focus(),r.dispatch({effects:no.of(!1)}),!0},_a=[{key:"Mod-f",run:ba,scope:"editor search-panel"},{key:"F3",run:Fi,shift:Bi,scope:"editor search-panel",preventDefault:!0},{key:"Mod-g",run:Fi,shift:Bi,scope:"editor search-panel",preventDefault:!0},{key:"Escape",run:fa,scope:"editor search-panel"},{key:"Mod-Shift-l",run:Fh},{key:"Mod-Alt-g",run:kh},{key:"Mod-d",run:Mh,preventDefault:!0}],to=class{constructor(s){this.view=s;let h=this.query=s.state.field(rt).query.spec;this.commit=this.commit.bind(this),this.searchField=ze("input",{value:h.search,placeholder:Te(s,"Find"),"aria-label":Te(s,"Find"),class:"cm-textfield",name:"search",form:"","main-field":"true",onchange:this.commit,onkeyup:this.commit}),this.replaceField=ze("input",{value:h.replace,placeholder:Te(s,"Replace"),"aria-label":Te(s,"Replace"),class:"cm-textfield",name:"replace",form:"",onchange:this.commit,onkeyup:this.commit}),this.caseField=ze("input",{type:"checkbox",name:"case",form:"",checked:h.caseSensitive,onchange:this.commit}),this.reField=ze("input",{type:"checkbox",name:"re",form:"",checked:h.regexp,onchange:this.commit}),this.wordField=ze("input",{type:"checkbox",name:"word",form:"",checked:h.wholeWord,onchange:this.commit});function c(p,m,b){return ze("button",{class:"cm-button",name:p,onclick:m,type:"button"},b)}this.dom=ze("div",{onkeydown:p=>this.keydown(p),class:"cm-search"},[this.searchField,c("next",()=>Fi(s),[Te(s,"next")]),c("prev",()=>Bi(s),[Te(s,"previous")]),c("select",()=>Hh(s),[Te(s,"all")]),ze("label",null,[this.caseField,Te(s,"match case")]),ze("label",null,[this.reField,Te(s,"regexp")]),ze("label",null,[this.wordField,Te(s,"by word")]),...s.state.readOnly?[]:[ze("br"),this.replaceField,c("replace",()=>ha(s),[Te(s,"replace")]),c("replaceAll",()=>Bh(s),[Te(s,"replace all")])],ze("button",{name:"close",onclick:()=>fa(s),"aria-label":Te(s,"close"),type:"button"},["\xD7"])])}commit(){let s=new Ni({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});s.eq(this.query)||(this.query=s,this.view.dispatch({effects:Kt.of(s)}))}keydown(s){hs(this.view,s,"search-panel")?s.preventDefault():s.keyCode==13&&s.target==this.searchField?(s.preventDefault(),(s.shiftKey?Bi:Fi)(this.view)):s.keyCode==13&&s.target==this.replaceField&&(s.preventDefault(),ha(this.view))}update(s){for(let h of s.transactions)for(let c of h.effects)c.is(Kt)&&!c.value.eq(this.query)&&this.setQuery(c.value)}setQuery(s){this.query=s,this.searchField.value=s.search,this.replaceField.value=s.replace,this.caseField.checked=s.caseSensitive,this.reField.checked=s.regexp,this.wordField.checked=s.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(zt).top}};function Te(r,s){return r.state.phrase(s)}var Ii=30,Mi=/[\s\.,:;?!]/;function ro(r,{from:s,to:h}){let c=r.state.doc.lineAt(s),p=r.state.doc.lineAt(h).to,m=Math.max(c.from,s-Ii),b=Math.min(p,h+Ii),x=r.state.sliceDoc(m,b);if(m!=c.from){for(let S=0;S<Ii;S++)if(!Mi.test(x[S+1])&&Mi.test(x[S])){x=x.slice(S);break}}if(b!=p){for(let S=x.length-1;S>x.length-Ii;S--)if(!Mi.test(x[S-1])&&Mi.test(x[S])){x=x.slice(0,S);break}}return ce.announce.of(`${r.state.phrase("current match")}. ${x} ${r.state.phrase("on line")} ${c.number}.`)}var Uh=ce.baseTheme({".cm-panel.cm-search":{padding:"2px 6px 4px",position:"relative","& [name=close]":{position:"absolute",top:"0",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",padding:0,margin:0},"& input, & button, & label":{margin:".2em .6em .2em 0"},"& input[type=checkbox]":{marginRight:".2em"},"& label":{fontSize:"80%",whiteSpace:"pre"}},"&light .cm-searchMatch":{backgroundColor:"#ffff0054"},"&dark .cm-searchMatch":{backgroundColor:"#00ffff8a"},"&light .cm-searchMatch-selected":{backgroundColor:"#ff6a0054"},"&dark .cm-searchMatch-selected":{backgroundColor:"#ff00ff8a"}}),Yh=[rt,rs.low(Wh),Uh];var Xh="#e5c07b",wa="#e06c75",Jh="#56b6c2",qh="#ffffff",Ui="#abb2bf",ao="#7d8799",Kh="#61afef",Zh="#98c379",ya="#d19a66",jh="#c678dd",Qh="#21252b",xa="#2c313a",Da="#282c34",so="#353a42",eu="#3E4451",Sa="#528bff";var tu=ce.theme({"&":{color:Ui,backgroundColor:Da},".cm-content":{caretColor:Sa},".cm-cursor, .cm-dropCursor":{borderLeftColor:Sa},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:eu},".cm-panels":{backgroundColor:Qh,color:Ui},".cm-panels.cm-panels-top":{borderBottom:"2px solid black"},".cm-panels.cm-panels-bottom":{borderTop:"2px solid black"},".cm-searchMatch":{backgroundColor:"#72a1ff59",outline:"1px solid #457dff"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"#6199ff2f"},".cm-activeLine":{backgroundColor:"#6699ff0b"},".cm-selectionMatch":{backgroundColor:"#aafe661a"},"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bad0f847"},".cm-gutters":{backgroundColor:Da,color:ao,border:"none"},".cm-activeLineGutter":{backgroundColor:xa},".cm-foldPlaceholder":{backgroundColor:"transparent",border:"none",color:"#ddd"},".cm-tooltip":{border:"none",backgroundColor:so},".cm-tooltip .cm-tooltip-arrow:before":{borderTopColor:"transparent",borderBottomColor:"transparent"},".cm-tooltip .cm-tooltip-arrow:after":{borderTopColor:so,borderBottomColor:so},".cm-tooltip-autocomplete":{"& > ul > li[aria-selected]":{backgroundColor:xa,color:Ui}}},{dark:!0}),iu=Ds.define([{tag:Y.keyword,color:jh},{tag:[Y.name,Y.deleted,Y.character,Y.propertyName,Y.macroName],color:wa},{tag:[Y.function(Y.variableName),Y.labelName],color:Kh},{tag:[Y.color,Y.constant(Y.name),Y.standard(Y.name)],color:ya},{tag:[Y.definition(Y.name),Y.separator],color:Ui},{tag:[Y.typeName,Y.className,Y.number,Y.changed,Y.annotation,Y.modifier,Y.self,Y.namespace],color:Xh},{tag:[Y.operator,Y.operatorKeyword,Y.url,Y.escape,Y.regexp,Y.link,Y.special(Y.string)],color:Jh},{tag:[Y.meta,Y.comment],color:ao},{tag:Y.strong,fontWeight:"bold"},{tag:Y.emphasis,fontStyle:"italic"},{tag:Y.strikethrough,textDecoration:"line-through"},{tag:Y.link,color:ao,textDecoration:"underline"},{tag:Y.heading,fontWeight:"bold",color:wa},{tag:[Y.atom,Y.bool,Y.special(Y.variableName)],color:ya},{tag:[Y.processingInstruction,Y.string,Y.inserted],color:Zh},{tag:Y.invalid,color:qh}]),ka=[tu,Yt(iu)];var Tt=class extends Error{constructor(h,c){super(c);this.status=h}};async function jt(r){let s=await fetch(r),h=await s.json().catch(()=>({error:s.statusText}));if(!s.ok)throw new Tt(s.status,h.error??s.statusText);return h}var Yi=r=>encodeURIComponent(r),Ze={info:()=>jt("/api/info"),roots:()=>jt("/api/files/roots"),list:(r,s=0)=>jt(`/api/files/list?path=${Yi(r)}&cursor=${s}`),stat:r=>jt(`/api/files/stat?path=${Yi(r)}`),render:r=>jt(`/api/files/render?path=${Yi(r)}`)},bt=r=>`/api/files/raw?path=${Yi(r)}`;async function Xi(r,s){let h=s?{Range:`bytes=0-${s-1}`}:{},c=await fetch(bt(r),{headers:h});if(!c.ok&&c.status!==206){let p=await c.json().catch(()=>({error:c.statusText}));throw new Tt(c.status,p.error??c.statusText)}return c.arrayBuffer()}function Ue(r){if(r===void 0)return"";let s=["B","KB","MB","GB","TB"],h=0,c=r;for(;c>=1024&&h<s.length-1;)c/=1024,h++;return h===0?`${r} B`:`${c.toFixed(c<10?1:0)} ${s[h]}`}function Et(r){if(r===void 0)return"";let s=new Date(r),h=c=>String(c).padStart(2,"0");return`${s.getFullYear()}-${h(s.getMonth()+1)}-${h(s.getDate())} ${h(s.getHours())}:${h(s.getMinutes())}`}var At=r=>r.slice(r.lastIndexOf("/")+1),Ca=r=>r.slice(0,Math.max(0,r.lastIndexOf("/")));function lo(r,s){let h=r.split("/");for(let c of s.split("/"))if(!(c===""||c==="."))if(c===".."){if(h.length<=1)return null;h.pop()}else h.push(c);return h.join("/")}var co=[];function je(r){co.push(r)}function Ga(r){return co.reduce((s,h)=>h.score(r)>s.score(r)?h:s)}function Pa(r){return co.find(s=>s.name===r)}function Qe(r,s){let h=document.createElement("div");h.className="yv-toolbar";for(let[c,p]of s){let m=document.createElement("button");m.textContent=c,m.addEventListener("click",p),h.append(m)}return r.append(h),h}function Ji(r,s){let h=document.createElement("div");h.className="yv-message",h.textContent=s,r.append(h)}var nu=20<<20,za=262144,at=r=>r().then(s=>ks.define(s));function ou(r){let s=r.toLowerCase();if(s==="dockerfile")return at(()=>import("./chunks/dockerfile-TDCXA4IX.js").then(c=>c.dockerFile));if(s==="makefile"||s==="justfile")return at(()=>import("./chunks/shell-HLB6RCIG.js").then(c=>c.shell));switch(s.includes(".")?s.slice(s.lastIndexOf(".")+1):""){case"js":case"mjs":case"cjs":return import("./chunks/dist-IB46GHWQ.js").then(c=>c.javascript());case"jsx":return import("./chunks/dist-IB46GHWQ.js").then(c=>c.javascript({jsx:!0}));case"ts":case"mts":return import("./chunks/dist-IB46GHWQ.js").then(c=>c.javascript({typescript:!0}));case"tsx":return import("./chunks/dist-IB46GHWQ.js").then(c=>c.javascript({typescript:!0,jsx:!0}));case"py":case"pyi":return import("./chunks/dist-IDZHZPPR.js").then(c=>c.python());case"rs":return import("./chunks/dist-TIKNV5X7.js").then(c=>c.rust());case"md":case"markdown":return import("./chunks/dist-EQSZZ2HQ.js").then(c=>c.markdown());case"json":case"jsonl":case"ipynb":case"geojson":return import("./chunks/dist-LDACZDSM.js").then(c=>c.json());case"html":case"htm":return import("./chunks/dist-K7SHAYC2.js").then(c=>c.html());case"css":return import("./chunks/dist-NU7LLDRC.js").then(c=>c.css());case"yaml":case"yml":return import("./chunks/dist-G4IJMWTS.js").then(c=>c.yaml());case"xml":case"svg":case"kml":return import("./chunks/dist-RV43Z5CL.js").then(c=>c.xml());case"sql":return import("./chunks/dist-TXO63IQK.js").then(c=>c.sql());case"c":case"h":case"cc":case"cpp":case"cxx":case"hpp":case"cu":case"ino":return import("./chunks/dist-GBZZZVDO.js").then(c=>c.cpp());case"java":case"kt":case"kts":return import("./chunks/dist-OAWJORRC.js").then(c=>c.java());case"go":return import("./chunks/dist-UXYX75YG.js").then(c=>c.go());case"sh":case"bash":case"zsh":case"envrc":return at(()=>import("./chunks/shell-HLB6RCIG.js").then(c=>c.shell));case"toml":case"lock":return at(()=>import("./chunks/toml-2FIUC2XM.js").then(c=>c.toml));case"r":return at(()=>import("./chunks/r-QSW6TDDB.js").then(c=>c.r));case"jl":return at(()=>import("./chunks/julia-AO5DTZHL.js").then(c=>c.julia));case"diff":case"patch":return at(()=>import("./chunks/diff-4PD2G225.js").then(c=>c.diff));case"ini":case"cfg":case"conf":case"properties":return at(()=>import("./chunks/properties-2P7YL4U6.js").then(c=>c.properties));default:return Promise.resolve(null)}}var ho=window.matchMedia("(prefers-color-scheme: dark)"),Ta=()=>ho.matches?ka:Yt(Fn,{fallback:!0}),ru={name:"text",score:r=>r.text?2:0,async mount(r,s){let h=s.stat.size??0,c=h>nu,p=await Xi(s.path,c?za:void 0),m=new TextDecoder().decode(p),b=At(s.path);/\.(md|markdown)$/i.test(b)&&Qe(r,[["Preview",()=>s.switchTo("markdown")]]),c&&Ji(r,`Showing the first ${Ue(za)} of ${Ue(h)}; larger files get a paged view later.`);let x=new ss,S=await ou(b).catch(()=>null),C="Ln 1, Col 1",E=new ce({parent:r,state:Bt.create({doc:m,extensions:[Bt.readOnly.of(!0),fs({domEventHandlers:{mousedown(te,ae,le){let ue=te.state.doc.lineAt(ae.from).number,k=le.shiftKey?te.state.doc.lineAt(te.state.selection.main.anchor).number:ue;return $(te,Math.min(k,ue),Math.max(k,ue)),!0}}}),_s(),ps(),xs(),us(),vs(),Ss(),va(),x.of(Ta()),Yt(Fn,{fallback:!0}),S??[],cs.of([...da,..._a,...ys]),ce.updateListener.of(te=>{if(!te.selectionSet)return;let ae=te.state.selection.main.head,le=te.state.doc.lineAt(ae);C=`Ln ${le.number}, Col ${ae-le.from+1}`,s.onStatus()}),ce.theme({"&":{height:"100%"},".cm-scroller":{overflow:"auto"}})]})});function $(te,ae,le){let ue=te.state.doc,k=ue.line(Math.max(1,Math.min(ae,ue.lines))),M=ue.line(Math.max(1,Math.min(le,ue.lines)));te.dispatch({selection:{anchor:k.from,head:M.to},scrollIntoView:!0}),s.onLines(k.number,M.number)}let J=()=>E.dispatch({effects:x.reconfigure(Ta())});return ho.addEventListener("change",J),{dispose(){ho.removeEventListener("change",J),E.destroy()},status:()=>`${C} \xB7 ${E.state.doc.lines} lines${c?" (first part)":""}`,reveal(te,ae=te){let le=E.state.doc,ue=le.line(Math.max(1,Math.min(te,le.lines))),k=le.line(Math.max(1,Math.min(ae,le.lines)));E.dispatch({selection:{anchor:ue.from,head:k.to},effects:ce.scrollIntoView(ue.from,{y:"center"})})}}}};je(ru);var su=/^[\w@.-]+\.html(#.*)?$/,Ea=/^[a-z][a-z0-9+.-]*:/i;function au(r,s){let h=Ca(s.path);for(let c of r.querySelectorAll("a[href]")){let p=c.getAttribute("href")??"";if(p.startsWith("#"))continue;if(Ea.test(p)){/^(https?|mailto):/i.test(p)?(c.setAttribute("target","_blank"),c.setAttribute("rel","noopener")):c.removeAttribute("href");continue}if(su.test(p)&&!p.includes("/")){c.setAttribute("href",`/${p}`),c.setAttribute("target","_blank");continue}let m=lo(h,decodeURIComponent(p.split("#")[0]));if(m===null){c.removeAttribute("href");continue}c.setAttribute("href",`#${m}`),c.addEventListener("click",b=>{b.preventDefault(),s.open(m)})}for(let c of r.querySelectorAll("img[src]")){let p=c.getAttribute("src")??"";if(Ea.test(p)||p.startsWith("/"))continue;let m=lo(h,decodeURIComponent(p));m===null?c.replaceWith(c.getAttribute("alt")??p):c.setAttribute("src",bt(m))}}je({name:"markdown",score:r=>r.text&&/\.(md|markdown)$/i.test(r.path)&&(r.size??0)<=4<<20?3:0,async mount(r,s){let h=await Ze.render(s.path),c=Qe(r,[["Source",()=>s.switchTo("text")]]);if(h.id){let b=document.createElement("a");b.href=`/${h.id}.html`,b.target="_blank",b.textContent=`${h.id}${h.title?` \xB7 ${h.title}`:""} \u2192 page`,c.prepend(b)}let p=document.createElement("div");p.className="yv-scroll";let m=document.createElement("article");return m.className="yv-markdown",m.innerHTML=h.html,au(m,s),p.append(m),r.append(p),{status:()=>h.id?`page ${h.id}`:"markdown"}}});typeof window<"u"&&(window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach),typeof window.CustomEvent!="function"&&(window.CustomEvent=function(s,h){h=h||{bubbles:!1,cancelable:!1,detail:null};var c=document.createEvent("CustomEvent");return c.initCustomEvent(s,h.bubbles,h.cancelable,h.detail),c}));var du=typeof document<"u"&&!!document.documentMode,uo;function lu(){return uo||(uo=document.createElement("div").style)}var Aa=["webkit","moz","ms"],qi={};function fo(r){if(qi[r])return qi[r];let s=lu();if(r in s)return qi[r]=r;let h=r[0].toUpperCase()+r.slice(1),c=Aa.length;for(;c--;){let p=`${Aa[c]}${h}`;if(p in s)return qi[r]=p}}function Ki(r,s){return parseFloat(s[fo(r)])||0}function Zi(r,s,h=window.getComputedStyle(r)){let c=s==="border"?"Width":"";return{left:Ki(`${s}Left${c}`,h),right:Ki(`${s}Right${c}`,h),top:Ki(`${s}Top${c}`,h),bottom:Ki(`${s}Bottom${c}`,h)}}function It(r,s,h){r.style[fo(s)]=h}function cu(r,s){let h=fo("transform");It(r,"transition",`${h} ${s.duration}ms ${s.easing}`)}function hu(r,{x:s,y:h,scale:c,isSVG:p},m){if(It(r,"transform",`scale(${c}) translate(${s}px, ${h}px)`),p&&du){let b=window.getComputedStyle(r).getPropertyValue("transform");r.setAttribute("transform",b)}}function po(r){let s=r.parentNode;(!s||s.nodeType!==1)&&(s=document.documentElement);let h=window.getComputedStyle(r),c=window.getComputedStyle(s),p=r.getBoundingClientRect(),m=s.getBoundingClientRect();return{elem:{style:h,width:p.width,height:p.height,top:p.top,bottom:p.bottom,left:p.left,right:p.right,margin:Zi(r,"margin",h),border:Zi(r,"border",h)},parent:{style:c,width:m.width,height:m.height,top:m.top,bottom:m.bottom,left:m.left,right:m.right,padding:Zi(s,"padding",c),border:Zi(s,"border",c)}}}var Qt={down:"mousedown",move:"mousemove",up:"mouseup mouseleave"};typeof window<"u"&&(typeof window.PointerEvent=="function"?Qt={down:"pointerdown",move:"pointermove",up:"pointerup pointerleave pointercancel"}:typeof window.TouchEvent=="function"&&(Qt={down:"touchstart",move:"touchmove",up:"touchend touchcancel"}));function vo(r,s,h,c){Qt[r].split(" ").forEach(p=>{s.addEventListener(p,h,c)})}function go(r,s,h){Qt[r].split(" ").forEach(c=>{s.removeEventListener(c,h)})}function Ma(r,s){let h=r.length;for(;h--;)if(r[h].pointerId===s.pointerId)return h;return-1}function bo(r,s){let h;if(s.touches){h=0;for(let c of s.touches)c.pointerId=h++,bo(r,c);return}h=Ma(r,s),h>-1&&r.splice(h,1),r.push(s)}function uu(r,s){if(s.touches){for(;r.length;)r.pop();return}let h=Ma(r,s);h>-1&&r.splice(h,1)}function Ia(r){r=r.slice(0);let s=r.pop(),h;for(;h=r.pop();)s={clientX:(h.clientX-s.clientX)/2+s.clientX,clientY:(h.clientY-s.clientY)/2+s.clientY};return s}function mo(r){if(r.length<2)return 0;let s=r[0],h=r[1];return Math.sqrt(Math.pow(Math.abs(h.clientX-s.clientX),2)+Math.pow(Math.abs(h.clientY-s.clientY),2))}function pu(r){let s=r;for(;s&&s.parentNode;){if(s.parentNode===document)return!0;s=s.parentNode instanceof ShadowRoot?s.parentNode.host:s.parentNode}return!1}function vu(r){return(r.getAttribute("class")||"").trim()}function gu(r,s){return r.nodeType===1&&` ${vu(r)} `.indexOf(` ${s} `)>-1}function mu(r,s){for(let h=r;h!=null;h=h.parentNode)if(gu(h,s.excludeClass)||s.exclude.indexOf(h)>-1)return!0;return!1}var bu=/^http:[\w\.\/]+svg$/;function fu(r){return bu.test(r.namespaceURI)&&r.nodeName.toLowerCase()!=="svg"}function _u(r){let s={};for(let h in r)r.hasOwnProperty(h)&&(s[h]=r[h]);return s}var Oa={animate:!1,canvas:!1,cursor:"move",disablePan:!1,disableZoom:!1,disableXAxis:!1,disableYAxis:!1,duration:200,easing:"ease-in-out",exclude:[],excludeClass:"panzoom-exclude",handleStartEvent:r=>{r.preventDefault(),r.stopPropagation()},maxScale:4,minScale:.125,overflow:"hidden",panOnlyWhenZoomed:!1,pinchAndPan:!1,relative:!1,setTransform:hu,startX:0,startY:0,startScale:1,step:.3,touchAction:"none"};function _o(r,s){if(!r)throw new Error("Panzoom requires an element as an argument");if(r.nodeType!==1)throw new Error("Panzoom requires an element with a nodeType of 1");if(!pu(r))throw new Error("Panzoom should be called on elements that have been attached to the DOM");s={...Oa,...s};let h=fu(r),c=r.parentNode;c.style.overflow=s.overflow,c.style.userSelect="none",c.style.touchAction=s.touchAction,(s.canvas?c:r).style.cursor=s.cursor,r.style.userSelect="none",r.style.touchAction=s.touchAction,It(r,"transformOrigin",typeof s.origin=="string"?s.origin:h?"0 0":"50% 50%");function p(){c.style.overflow="",c.style.userSelect="",c.style.touchAction="",c.style.cursor="",r.style.cursor="",r.style.userSelect="",r.style.touchAction="",It(r,"transformOrigin","")}function m(R={}){for(let U in R)R.hasOwnProperty(U)&&(s[U]=R[U]);(R.hasOwnProperty("cursor")||R.hasOwnProperty("canvas"))&&(c.style.cursor=r.style.cursor="",(s.canvas?c:r).style.cursor=s.cursor),R.hasOwnProperty("overflow")&&(c.style.overflow=R.overflow),R.hasOwnProperty("touchAction")&&(c.style.touchAction=R.touchAction,r.style.touchAction=R.touchAction)}let b=0,x=0,S=1,C=!1;le(s.startScale,{animate:!1,force:!0}),setTimeout(()=>{ae(s.startX,s.startY,{animate:!1,force:!0})});function E(R,U,K){if(K.silent)return;let re=new CustomEvent(R,{detail:U});r.dispatchEvent(re)}function $(R,U,K){let re={x:b,y:x,scale:S,isSVG:h,originalEvent:K};return requestAnimationFrame(()=>{typeof U.animate=="boolean"&&(U.animate?cu(r,U):It(r,"transition","none")),U.setTransform(r,re,U),E(R,re,U),E("panzoomchange",re,U)}),re}function J(R,U,K,re){let B={...s,...re},oe={x:b,y:x,opts:B};if(!re?.force&&(B.disablePan||B.panOnlyWhenZoomed&&S===B.startScale))return oe;if(R=parseFloat(R),U=parseFloat(U),B.disableXAxis||(oe.x=(B.relative?b:0)+R),B.disableYAxis||(oe.y=(B.relative?x:0)+U),B.contain){let q=po(r),ye=q.elem.width/S,xe=q.elem.height/S,Be=ye*K,tt=xe*K,Oe=(Be-ye)/2,Xe=(tt-xe)/2;if(B.contain==="inside"){let Lt=(-q.elem.margin.left-q.parent.padding.left+Oe)/K,Rt=(q.parent.width-Be-q.parent.padding.left-q.elem.margin.left-q.parent.border.left-q.parent.border.right+Oe)/K;oe.x=Math.max(Math.min(oe.x,Rt),Lt);let lt=(-q.elem.margin.top-q.parent.padding.top+Xe)/K,$t=(q.parent.height-tt-q.parent.padding.top-q.elem.margin.top-q.parent.border.top-q.parent.border.bottom+Xe)/K;oe.y=Math.max(Math.min(oe.y,$t),lt)}else if(B.contain==="outside"){let Lt=(-(Be-q.parent.width)-q.parent.padding.left-q.parent.border.left-q.parent.border.right+Oe)/K,Rt=(Oe-q.parent.padding.left)/K;oe.x=Math.max(Math.min(oe.x,Rt),Lt);let lt=(-(tt-q.parent.height)-q.parent.padding.top-q.parent.border.top-q.parent.border.bottom+Xe)/K,$t=(Xe-q.parent.padding.top)/K;oe.y=Math.max(Math.min(oe.y,$t),lt)}}return B.roundPixels&&(oe.x=Math.round(oe.x),oe.y=Math.round(oe.y)),oe}function te(R,U){let K={...s,...U},re={scale:S,opts:K};if(!U?.force&&K.disableZoom)return re;let B=s.minScale,oe=s.maxScale;if(K.contain){let q=po(r),ye=q.elem.width/S,xe=q.elem.height/S;if(ye>1&&xe>1){let Be=q.parent.width-q.parent.border.left-q.parent.border.right,tt=q.parent.height-q.parent.border.top-q.parent.border.bottom,Oe=Be/ye,Xe=tt/xe;s.contain==="inside"?oe=Math.min(oe,Oe,Xe):s.contain==="outside"&&(B=Math.max(B,Oe,Xe))}}return re.scale=Math.min(Math.max(R,B),oe),re}function ae(R,U,K,re){let B=J(R,U,S,K);return b!==B.x||x!==B.y?(b=B.x,x=B.y,$("panzoompan",B.opts,re)):{x:b,y:x,scale:S,isSVG:h,originalEvent:re}}function le(R,U,K){let re=te(R,U),B=re.opts;if(!U?.force&&B.disableZoom)return;R=re.scale;let oe=b,q=x;if(B.focal){let xe=B.focal;oe=(xe.x/R-xe.x/S+b*R)/R,q=(xe.y/R-xe.y/S+x*R)/R}let ye=J(oe,q,R,{relative:!1,force:!0});return b=ye.x,x=ye.y,S=R,$("panzoomzoom",B,K)}function ue(R,U){let K={...s,animate:!0,...U};return le(S*Math.exp((R?1:-1)*K.step),K)}function k(R){return ue(!0,R)}function M(R){return ue(!1,R)}function _t(R,U,K,re){let B=po(r),oe={width:B.parent.width-B.parent.padding.left-B.parent.padding.right-B.parent.border.left-B.parent.border.right,height:B.parent.height-B.parent.padding.top-B.parent.padding.bottom-B.parent.border.top-B.parent.border.bottom},q=U.clientX-B.parent.left-B.parent.padding.left-B.parent.border.left-B.elem.margin.left,ye=U.clientY-B.parent.top-B.parent.padding.top-B.parent.border.top-B.elem.margin.top;h||(q-=B.elem.width/S/2,ye-=B.elem.height/S/2);let xe={x:q/oe.width*(oe.width*R),y:ye/oe.height*(oe.height*R)};return le(R,{...K,animate:!1,focal:xe},re)}function on(R,U){R.preventDefault();let K={...s,...U,animate:!1},B=(R.deltaY===0&&R.deltaX?R.deltaX:R.deltaY)<0?1:-1,oe=te(S*Math.exp(B*K.step/3),K).scale;return _t(oe,R,K,R)}function Ye(R){let U={...s,animate:!0,force:!0,...R};S=te(U.startScale,U).scale;let K=J(U.startX,U.startY,S,U);return b=K.x,x=K.y,$("panzoomreset",U)}let be,fe,A,et,Mt,wt,ke=[];function yt(R){if(mu(R.target,s))return;bo(ke,R),C=!0,s.handleStartEvent(R),be=b,fe=x,E("panzoomstart",{x:b,y:x,scale:S,isSVG:h,originalEvent:R},s);let U=Ia(ke);A=U.clientX,et=U.clientY,Mt=S,wt=mo(ke)}function xt(R){if(!C||be===void 0||fe===void 0||A===void 0||et===void 0)return;bo(ke,R);let U=Ia(ke),K=ke.length>1,re=S;if(K){wt===0&&(wt=mo(ke));let B=mo(ke)-wt;re=te(B*s.step/80+Mt).scale,_t(re,U,{animate:!1},R)}(!K||s.pinchAndPan)&&ae(be+(U.clientX-A)/re,fe+(U.clientY-et)/re,{animate:!1},R)}function dt(R){ke.length===1&&E("panzoomend",{x:b,y:x,scale:S,isSVG:h,originalEvent:R},s),uu(ke,R),C&&(C=!1,be=fe=A=et=void 0)}let Ot=!1;function ii(){Ot||(Ot=!0,vo("down",s.canvas?c:r,yt),vo("move",document,xt,{passive:!0}),vo("up",document,dt,{passive:!0}))}function ni(){Ot=!1,go("down",s.canvas?c:r,yt),go("move",document,xt),go("up",document,dt)}return s.noBind||ii(),{bind:ii,destroy:ni,eventNames:Qt,getPan:()=>({x:b,y:x}),getScale:()=>S,getOptions:()=>_u(s),handleDown:yt,handleMove:xt,handleUp:dt,pan:ae,reset:Ye,resetStyle:p,setOptions:m,setStyle:(R,U)=>It(r,R,U),zoom:le,zoomIn:k,zoomOut:M,zoomToPoint:_t,zoomWithWheel:on}}_o.defaultOptions=Oa;var wu=/^image\/(png|jpeg|gif|webp|avif|bmp|x-icon|svg\+xml)$/;je({name:"image",score:r=>wu.test(r.mime)?3:0,async mount(r,s){let h=document.createElement("div");h.className="yv-image";let c=document.createElement("img");c.alt=s.path,c.src=`${bt(s.path)}&t=${s.stat.mtime??0}`,h.append(c);let p=Qe(r,[]);r.append(h),await c.decode().catch(()=>{});let m=_o(c,{maxScale:40,minScale:.05,step:.15});h.addEventListener("wheel",b=>{m.zoomWithWheel(b),s.onStatus()});for(let[b,x]of[["Fit",()=>m.reset()],["1:1",()=>m.zoom(c.naturalWidth/Math.max(1,c.clientWidth))]]){let S=document.createElement("button");S.textContent=b,S.addEventListener("click",()=>(x(),s.onStatus())),p.append(S)}return{dispose:()=>m.destroy(),status:()=>`${c.naturalWidth}\xD7${c.naturalHeight} \xB7 ${Math.round(m.getScale()*c.clientWidth*100/Math.max(1,c.naturalWidth))}%`}}});var yu=65536;je({name:"binary",score:()=>1,async mount(r,s){let h=Qe(r,[["Open as text",()=>s.switchTo("text")],["Open as hex",()=>s.switchTo("hex")]]),c=document.createElement("a");c.href=bt(s.path),c.download=At(s.path),c.textContent="Download",h.append(c);let p=document.createElement("table");p.className="yv-meta";let m=[["path",s.path],["size",`${Ue(s.stat.size)} (${s.stat.size??0} bytes)`],["modified",Et(s.stat.mtime)],["type",s.stat.mime]];s.stat.link&&m.push(["symlink to",s.stat.link]);for(let[b,x]of m){let S=p.insertRow();S.insertCell().textContent=b,S.insertCell().textContent=x}return r.append(p),{status:()=>s.stat.mime}}});je({name:"hex",score:()=>0,async mount(r,s){let h=new Uint8Array(await Xi(s.path,yu)),c=[];for(let b=0;b<h.length;b+=16){let x=h.subarray(b,b+16),S=Array.from(x,E=>E.toString(16).padStart(2,"0")).join(" "),C=Array.from(x,E=>E>=32&&E<127?String.fromCharCode(E):".").join("");c.push(`${b.toString(16).padStart(8,"0")}  ${S.padEnd(47)}  ${C}`)}Qe(r,[["Back",()=>s.switchTo("binary")]]);let p=document.createElement("pre");p.className="yv-hex",p.textContent=c.join(`
`),r.append(p);let m=h.length<(s.stat.size??0)?` (first ${Ue(h.length)})`:"";return{status:()=>`hex${m}`}}});var ji=class{constructor(s,h){this.open=h;this.element=document.createElement("nav"),this.element.className="yt",this.filterBox=document.createElement("input"),this.filterBox.type="search",this.filterBox.placeholder="Filter loaded files",this.filterBox.addEventListener("input",()=>this.filter()),this.list=document.createElement("div"),this.list.className="yt-list",this.element.append(this.filterBox,this.list);for(let c of s){let p={name:c.name,kind:c.exists?"dir":"broken"},m=c.exists?c.path:`${c.path} is not on this machine`;this.list.append(this.item(c.name,p,0,m))}}nodes=new Map;selected;element;list;filterBox;item(s,h,c,p){let m=document.createElement("div");m.className="yt-item";let b=document.createElement("div");b.className=`yt-row yt-${h.kind}${c===0?" yt-root":""}`,b.style.paddingLeft=`${c*12+6}px`,b.dataset.path=s,b.title=p??[s,h.link?`\u2192 ${h.link}`:"",h.size!==void 0?Ue(h.size):"",Et(h.mtime)].filter(Boolean).join(`
`);let x=document.createElement("span");x.className="yt-twisty",x.textContent=h.kind==="dir"?"\u25B8":"";let S=document.createElement("span");S.className="yt-label",S.textContent=h.name+(h.link?" \u2197":""),b.append(x,S),m.append(b);let C={path:s,row:b,loaded:!1};return this.nodes.set(s,C),h.kind==="dir"?b.addEventListener("click",()=>this.toggle(C,m,c)):(h.kind==="file"||h.kind==="other")&&(b.addEventListener("click",()=>(this.select(b),this.open(s,!1))),b.addEventListener("dblclick",()=>this.open(s,!0))),m}async toggle(s,h,c){let p=s.row.querySelector(".yt-twisty");if(s.children&&!s.children.hidden){s.children.hidden=!0,p.textContent="\u25B8";return}p.textContent="\u25BE",s.children||(s.children=document.createElement("div"),h.append(s.children)),s.children.hidden=!1,s.loaded||(s.loaded=!0,await this.page(s,c+1,0))}async page(s,h,c){let p=s.children,m=this.note(p,"loading\u2026",h);try{let b=await Ze.list(s.path,c);m.remove();for(let x of b.entries)p.append(this.item(`${s.path}/${x.name}`,x,h));if(b.total===0&&this.note(p,"empty",h),b.next!==void 0){let x=this.note(p,`show more (${b.next} of ${b.total})`,h);x.classList.add("yt-more"),x.addEventListener("click",()=>(x.remove(),this.page(s,h,b.next)))}}catch(b){m.textContent=String(b.message)}this.filter()}note(s,h,c){let p=document.createElement("div");return p.className="yt-row yt-note",p.style.paddingLeft=`${c*12+18}px`,p.textContent=h,s.append(p),p}select(s){this.selected?.classList.remove("yt-selected"),s.classList.add("yt-selected"),this.selected=s}async reveal(s){let h=s.split("/");for(let p=1;p<h.length;p++){let m=h.slice(0,p).join("/"),b=this.nodes.get(m);if(!b)return;if(!b.children||b.children.hidden){let x=b.row.parentElement,S=p-1;await this.toggle(b,x,S)}}let c=this.nodes.get(s);c&&(this.select(c.row),c.row.scrollIntoView({block:"nearest"}))}filter(){let s=this.filterBox.value.trim().toLowerCase(),h=c=>{let p=c.querySelector(":scope > .yt-row"),m=c.querySelector(":scope > div:not(.yt-row)"),b=!1;if(m)for(let C of Array.from(m.children))C.classList.contains("yt-item")?b=h(C)||b:C.hidden=s!=="";let x=p?.querySelector(".yt-label")?.textContent?.toLowerCase()??"",S=s===""||b||x.includes(s);return c.hidden=!S,S};for(let c of Array.from(this.list.children))h(c),c.hidden=!1}};var xu=vc(Va(),1),tn=xu;var Ha=window.matchMedia("(prefers-color-scheme: dark)"),Wa=()=>Ha.matches?tn.themeDark:tn.themeLight;function So(r){let s=decodeURIComponent(r.replace(/^#/,""));if(!s)return null;let h=/^(.*):L(\d+)(?:-(\d+))?$/.exec(s);return h?{path:h[1],from:Number(h[2]),to:Number(h[3]??h[2])}:{path:s}}var wo=class{element=document.createElement("div");title=document.createElement("span");init(s){this.element.className="yw-tab",this.title.className="yw-tab-title";let h=document.createElement("span");h.className="yw-tab-close",h.textContent="\xD7",h.title="Close",h.addEventListener("click",c=>(c.stopPropagation(),s.api.close())),this.element.addEventListener("auxclick",c=>c.button===1&&s.api.close()),this.element.addEventListener("dblclick",()=>s.api.updateParameters({pinned:!0})),this.element.append(this.title,h),this.render(s.params)}update(s){this.render(s.params)}render(s){this.title.textContent=At(s.path),this.element.title=s.path,this.element.classList.toggle("yw-preview",!s.pinned)}},yo=class{constructor(s){this.bench=s;this.element.className="yw-panel",this.element.addEventListener("pointerdown",()=>this.pin(),{capture:!0})}element=document.createElement("div");viewer;loads=0;params;stat;api;init(s){this.api=s.api,this.params=s.params,this.load()}update(s){let h={...this.params,...s.params},c=h.path!==this.params.path||h.kind!==this.params.kind;this.params=h,c&&this.load()}pin(){this.params.pinned||this.api.updateParameters({pinned:!0})}get path(){return this.params.path}reveal(s,h){this.viewer?.reveal?.(s,h)}status(){let s=this.stat,h=s?[Ue(s.size),Et(s.mtime)].filter(Boolean).join(" \xB7 "):"";return{path:this.params.path,left:h,right:this.viewer?.status?.()??""}}async load(){this.viewer?.dispose?.(),this.viewer=void 0;let s=++this.loads,h=document.createElement("div");h.className="yw-box",this.element.replaceChildren(h);let c=this.params.path;try{if(this.stat=await Ze.stat(c),s!==this.loads)return;let p=this.params.kind&&Pa(this.params.kind)||Ga(this.stat),m={path:c,stat:this.stat,open:S=>this.bench.open(S,{pin:!0}),switchTo:S=>this.api.updateParameters({kind:S,pinned:!0}),onLines:(S,C)=>this.bench.onLines(this,S,C),onStatus:()=>this.bench.refreshStatus()},b=await p.mount(h,m);if(s!==this.loads){b.dispose?.();return}this.viewer=b;let x=this.bench.takeReveal(c);x&&this.viewer.reveal?.(x.from,x.to)}catch(p){if(p instanceof Tt&&p.status===404&&this.bench.restoring){this.api.close();return}s===this.loads&&Ji(h,`${c}: ${p.message}`)}s===this.loads&&this.bench.loaded(this)}dispose(){this.viewer?.dispose?.()}},xo=class{element=document.createElement("div");init(){this.element.className="yw-watermark",this.element.innerHTML="<p>Open a file from the tree.</p><p>A click previews it, a double click keeps it open.<br>Drag a tab to an edge to split, or press <kbd>Ctrl</kbd>/<kbd>\u2318</kbd> <kbd>\\</kbd>.</p>"}},Do=class{constructor(s,h){this.bench=s;this.group=h}element=document.createElement("div");init(){this.element.className="yw-actions";let s=document.createElement("button");s.innerHTML='<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor"/><line x1="8" y1="2.5" x2="8" y2="13.5" stroke="currentColor"/></svg>',s.title="Split right (Ctrl/\u2318 \\)",s.addEventListener("click",()=>this.bench.splitRight(this.group.activePanel)),this.element.append(s)}dispose(){}},nn=class{constructor(s,h,c,p){this.storageKey=h;this.onStatus=c;this.onActive=p;this.api=tn.createDockview(s,{theme:Wa(),createComponent:({id:b})=>{let x=new yo(this);return this.panels.set(b,x),x},createTabComponent:()=>new wo,createWatermarkComponent:()=>new xo,createRightHeaderActionComponent:b=>new Do(this,b)}),Ha.addEventListener("change",()=>this.api.updateOptions({theme:Wa()})),this.api.onDidActivePanelChange(()=>{let b=this.active();this.onActive(b?.path??null),this.refreshStatus()}),this.api.onDidRemovePanel(b=>this.panels.delete(b.id));let m;this.api.onDidLayoutChange(()=>{window.clearTimeout(m),m=window.setTimeout(()=>this.save(),300)}),window.addEventListener("keydown",b=>{(b.ctrlKey||b.metaKey)&&b.key==="\\"&&(b.preventDefault(),this.splitRight(this.api.activePanel))})}api;restoring=!1;panels=new Map;reveals=new Map;counter=0;active(){let s=this.api.activePanel;return s?this.panels.get(s.id):void 0}refreshStatus(){this.onStatus(this.active()?.status()??null)}loaded(s){this.active()===s&&this.onActive(s.path),this.refreshStatus()}onLines(s,h,c){if(this.active()===s){let p=h===c?`L${h}`:`L${h}-${c}`;history.replaceState(null,"",`#${encodeURI(s.path)}:${p}`)}}takeReveal(s){let h=this.reveals.get(s);return this.reveals.delete(s),h}newId(s){return`${s}#${++this.counter}-${Date.now().toString(36)}`}open(s,h={}){let c=this.api.activeGroup,p=c?.panels.find(x=>x.params?.path===s);if(h.from!==void 0&&this.reveals.set(s,{from:h.from,to:h.to}),p){p.api.setActive(),h.pin&&p.api.updateParameters({pinned:!0}),h.from!==void 0&&(this.panels.get(p.id)?.reveal(h.from,h.to),this.reveals.delete(s));return}let m=c?.panels.find(x=>!x.params?.pinned),b={path:s,pinned:!!h.pin};if(m){m.api.updateParameters(b),m.api.setActive();return}this.api.addPanel({id:this.newId(s),component:"viewer",tabComponent:"tab",params:b,...c?{position:{referenceGroup:c}}:{}})}splitRight(s){if(!s)return;let h={...s.params,pinned:!0};s.api.updateParameters({pinned:!0}),this.api.addPanel({id:this.newId(h.path),component:"viewer",tabComponent:"tab",params:h,position:{referenceGroup:s.group,direction:"right"}})}save(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.api.toJSON()))}catch{}}restore(){let s=null;try{s=localStorage.getItem(this.storageKey)}catch{return}if(s){this.restoring=!0;try{this.api.fromJSON(JSON.parse(s))}catch{this.api.clear()}window.setTimeout(()=>this.restoring=!1,2e3)}}};var Fa="yajna-files:sidebar";async function Du(){let[r,s]=await Promise.all([Ze.info(),Ze.roots()]);document.title=`${r.notebook} \xB7 files`,document.querySelector("#notebook").textContent=r.notebook,document.querySelector("#version").textContent=`yajna ${r.version}`;let h=document.querySelector("#status-path"),c=document.querySelector("#status-left"),p=document.querySelector("#status-right"),m=J=>{h.textContent=J?.path??"",c.textContent=J?.left??"",p.textContent=J?.right??""},b,x=new ji(s,(J,te)=>b.open(J,{pin:te}));document.querySelector("#sidebar").append(x.element),b=new nn(document.querySelector("#editor"),`yajna-files:${r.notebook}`,m,J=>{J&&So(location.hash)?.path!==J&&history.replaceState(null,"",`#${encodeURI(J)}`)}),b.restore();let S=()=>{let J=So(location.hash);J&&(b.open(J.path,{pin:!0,from:J.from,to:J.to}),x.reveal(J.path))};window.addEventListener("hashchange",S),S();let C=document.querySelector("#sidebar"),E=Number(localStorage.getItem(Fa)??0);E>120&&(C.style.width=`${E}px`);let $=document.querySelector("#sash");$.addEventListener("pointerdown",J=>{$.setPointerCapture(J.pointerId);let te=le=>C.style.width=`${Math.max(120,Math.min(le.clientX,window.innerWidth-200))}px`,ae=()=>{$.removeEventListener("pointermove",te);try{localStorage.setItem(Fa,String(C.offsetWidth))}catch{}};$.addEventListener("pointermove",te),$.addEventListener("pointerup",ae,{once:!0})})}Du().catch(r=>{document.body.textContent=`The files viewer could not start: ${r.message}`});
/*! Bundled license information:

dockview-core/dist/dockview-core.js:
  (**
   * dockview-core
   * @version 8.6.1
   * @link https://github.com/dockview/dockview
   * @license MIT
   *)
*/
