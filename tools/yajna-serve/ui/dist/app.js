import{A as be,Aa as Ga,B as ua,Ba as yi,C as wi,Ca as Pa,D as ce,Da as Ro,E as pa,Ea as za,F as va,G as sn,Ga as Wt,H as ga,Ha as Ta,I as ma,J as fa,K as Io,L as ba,M as wa,N as _a,O as an,P as Mo,Q as Qt,R as ya,S as dn,a as Zt,aa as xa,b as wt,ba as ne,c as sa,d as aa,e as da,g as la,h as bi,ha as ln,i as ue,j as St,ja as Da,k as Ze,l as $t,m as Nt,ma as ka,n as ca,na as cn,o as Ie,oa as _i,pa as Lo,q as Re,qa as Oo,r as gt,s as on,u as Eo,v as _t,w as rn,x as ha,y as Ye,ya as Sa,z as Vt,za as Ca}from"./chunks/chunk-LXR5EDXL.js";import{a as su,b as au}from"./chunks/chunk-Y6SLVHK3.js";var Ml=su((jn,Il)=>{(function(r,o){typeof jn=="object"&&typeof Il<"u"?o(jn):typeof define=="function"&&define.amd?define(["exports"],o):(r=typeof globalThis<"u"?globalThis:r||self,o(r["dockview-core"]={}))})(jn,function(r){if(Object.defineProperties(r,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),typeof document<"u"){let e=document.createElement("style");e.textContent=`.dv-drop-target-container {
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
}`,document.head.appendChild(e)}var o,a=class{constructor(){}},d=class extends a{constructor(e,t,i,n){super(),this.viewId=e,this.groupId=t,this.panelId=i,this.tabGroupId=n}},c=class extends a{constructor(e,t){super(),this.viewId=e,this.paneId=t}},h=class Tl{constructor(){}static getInstance(){return Tl.INSTANCE}hasData(t){return t&&t===this.proto}clearData(t){this.hasData(t)&&(this.proto=void 0,this.data=void 0)}getData(t){if(this.hasData(t))return this.data}setData(t,i){i&&(this.data=t,this.proto=i)}};o=h,h.INSTANCE=new o;function v(){let e=h.getInstance();if(e.hasData(d.prototype))return e.getData(d.prototype)[0]}function m(){let e=h.getInstance();if(e.hasData(c.prototype))return e.getData(c.prototype)[0]}let w;(function(e){e.NONE={dispose:()=>{}};function t(i){return{dispose:()=>{i()}}}e.from=t})(w||(w={}));var x=class{get isDisposed(){return this._isDisposed}constructor(...e){this._isDisposed=!1,this._disposables=new Set(e)}addDisposables(...e){e.forEach(t=>this._disposables.add(t))}removeDisposable(e){this._disposables.delete(e)}dispose(){this._isDisposed||(this._isDisposed=!0,this._disposables.forEach(e=>e.dispose()),this._disposables.clear())}},S=class{constructor(){this._disposable=w.NONE}get value(){return this._disposable===w.NONE?void 0:this._disposable}set value(e){this._disposable&&this._disposable.dispose(),this._disposable=e}dispose(){this._disposable&&(this._disposable.dispose(),this._disposable=w.NONE)}};let P;(function(e){e.any=(...t)=>i=>{let n=t.map(s=>s(i));return{dispose:()=>{n.forEach(s=>{s.dispose()})}}}})(P||(P={}));var z=class{constructor(){this._defaultPrevented=!1}get defaultPrevented(){return this._defaultPrevented}preventDefault(){this._defaultPrevented=!0}},L=class{constructor(){this._isAccepted=!1}get isAccepted(){return this._isAccepted}accept(){this._isAccepted=!0}},V=class{constructor(){this.events=new Map}get size(){return this.events.size}add(e,t){this.events.set(e,t)}delete(e){this.events.delete(e)}clear(){this.events.clear()}},H=class Al{static create(){var t;return new Al((t=new Error("listener stacktrace").stack)!==null&&t!==void 0?t:"")}constructor(t){this.value=t}print(){console.warn("dockview: stacktrace",this.value)}},N=class{constructor(e,t){this.callback=e,this.stacktrace=t}},G=class vt{static setLeakageMonitorEnabled(t){t!==vt.ENABLE_TRACKING&&vt.MEMORY_LEAK_WATCHER.clear(),vt.ENABLE_TRACKING=t}get value(){return this._last}constructor(t){this.options=t,this._listeners=[],this._disposed=!1}get event(){return this._event||(this._event=t=>{var i;!((i=this.options)===null||i===void 0)&&i.replay&&this._last!==void 0&&t(this._last);let n=new N(t,vt.ENABLE_TRACKING?H.create():void 0);return this._listeners.push(n),{dispose:()=>{let s=this._listeners.indexOf(n);s>-1?this._listeners.splice(s,1):vt.ENABLE_TRACKING}}},vt.ENABLE_TRACKING&&vt.MEMORY_LEAK_WATCHER.add(this._event,H.create())),this._event}fire(t){var i;if(this._pauseTokens!==void 0&&this._pauseTokens.size>0)return;!((i=this.options)===null||i===void 0)&&i.replay&&(this._last=t);let n=this._listeners,s=n.length;if(s!==0){if(s===1){n[0].callback(t);return}for(let l of n.slice())l.callback(t)}}pause(){var t;let i={};return(t=this._pauseTokens)!==null&&t!==void 0||(this._pauseTokens=new Set),this._pauseTokens.add(i),w.from(()=>{var n;return(n=this._pauseTokens)===null||n===void 0?void 0:n.delete(i)})}dispose(){this._disposed||(this._disposed=!0,this._listeners.length>0&&(vt.ENABLE_TRACKING?queueMicrotask(()=>{for(let i of this._listeners){var t;console.warn("dockview: stacktrace",(t=i.stacktrace)===null||t===void 0?void 0:t.print())}this._listeners=[]}):this._listeners=[]),vt.ENABLE_TRACKING&&this._event&&vt.MEMORY_LEAK_WATCHER.delete(this._event))}};G.ENABLE_TRACKING=!1,G.MEMORY_LEAK_WATCHER=new V;function O(e,t,i,n){return e.addEventListener(t,i,n),{dispose:()=>{e.removeEventListener(t,i,n)}}}var ye=class{constructor(){this._onFired=new G,this._currentFireCount=0,this._queued=!1,this.onEvent=e=>{let t=this._currentFireCount;return this._onFired.event(()=>{this._currentFireCount>t&&e()})}}fire(){this._currentFireCount++,!this._queued&&(this._queued=!0,queueMicrotask(()=>{this._queued=!1,this._onFired.fire()}))}dispose(){this._onFired.dispose()}},R=class extends x{constructor(e){super(),this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._value=null,this.addDisposables(this._onDidChange,U(e,t=>{let i=t.target.scrollWidth>t.target.clientWidth,n=t.target.scrollHeight>t.target.clientHeight;this._value={hasScrollX:i,hasScrollY:n},this._onDidChange.fire(this._value)}))}};function U(e,t){let i=new Set,n=new ResizeObserver(s=>{let l=!1,u;u=requestAnimationFrame(()=>{l=!0,u!==void 0&&i.delete(u);let p=s[0];t(p)}),l||i.add(u)});return n.observe(e),{dispose:()=>{n.unobserve(e),n.disconnect();for(let s of i)cancelAnimationFrame(s);i.clear()}}}let F=(e,...t)=>{for(let i of t)e.classList.contains(i)&&e.classList.remove(i)},J=(e,...t)=>{for(let i of t)e.classList.contains(i)||e.classList.add(i)},A=(e,t,i)=>{let n=e.classList.contains(t);i&&!n&&e.classList.add(t),!i&&n&&e.classList.remove(t)};function te(e,t){for(;e;){if(e===t)return!0;e=e.parentNode}return!1}function ke(e){return new nt(e)}var nt=class extends x{constructor(e){super(),this._onDidFocus=new G,this.onDidFocus=this._onDidFocus.event,this._onDidBlur=new G,this.onDidBlur=this._onDidBlur.event,this.addDisposables(this._onDidFocus,this._onDidBlur);let t=te($i(e),e),i=!1,n=()=>{i=!1,t||(t=!0,this._onDidFocus.fire())},s=()=>{t&&(i=!0,globalThis.setTimeout(()=>{i&&(i=!1,t=!1,this._onDidBlur.fire())},0))};this._refreshStateHandler=()=>{te($i(e),e)!==t&&(t?s():n())},this.addDisposables(O(e,"focus",n,!0)),this.addDisposables(O(e,"blur",s,!0))}refreshState(){this._refreshStateHandler()}};let Ne="dv-quasiPreventDefault";function Ve(e){e[Ne]=!0}function hi(e){return e[Ne]}function ui(e,t){var i,n;let s=(i=(n=e.composedPath)===null||n===void 0?void 0:n.call(e))!==null&&i!==void 0?i:[];if(s.length>0)return t.some(u=>s.includes(u));let l=e.target;return l instanceof Node&&t.some(u=>u.contains(l))}function Y(e){let t=[],i=e.getRootNode();for(;ie(i);)t.push(i),i=i.host.getRootNode();return t}function ae(e,t){let i=t?.getRootNode(),n=e,s=n.getRootNode();for(;s!==i&&ie(s);)n=s.host,s=n.getRootNode();return n}function Q(e,t,i={}){let n=Array.from(t),{nonce:s}=i,l=typeof s=="function"?s(e):s;for(let u of n){if(u.href){let f=e.createElement("link");f.href=u.href,f.type=u.type,f.rel="stylesheet",l&&f.setAttribute("nonce",l),e.head.appendChild(f);continue}let p=[];try{u.cssRules&&(p=Array.from(u.cssRules).map(f=>f.cssText))}catch(f){console.warn("dockview: failed to access stylesheet rules due to security restrictions",f)}let g=e.createDocumentFragment();for(let f of p){let b=e.createElement("style");l&&b.setAttribute("nonce",l),b.appendChild(e.createTextNode(f)),g.appendChild(b)}e.head.appendChild(g)}}function oe(e){let{left:t,top:i,width:n,height:s}=e.getBoundingClientRect();return{left:t+window.scrollX,top:i+window.scrollY,width:n,height:s}}function le(e){let t=e;for(;t?.parentNode;){if(t.parentNode===document)return!0;t.parentNode instanceof DocumentFragment?t=t.parentNode.host:t=t.parentNode}return!1}function ie(e){return!!e&&e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&"host"in e&&!!e.host}function pe(e){var t;let i=e.getRootNode();return i!==e&&typeof i.elementsFromPoint=="function"?i:(t=e.ownerDocument)!==null&&t!==void 0?t:document}function he(e,t){e.dataset.testid=t}function de(e,t){let i=[];function n(s){if(s.nodeType===Node.ELEMENT_NODE){e.includes(s.tagName)&&i.push(s),s.shadowRoot&&n(s.shadowRoot);for(let l of s.children)n(l)}}return n(t instanceof Document?t.documentElement:t),i}function ge(e=document){let t=de(["IFRAME","WEBVIEW"],e),i=new WeakMap;for(let n of t)i.set(n,n.style.pointerEvents),n.style.pointerEvents="none";return{release:()=>{for(let s of t){var n;s.style.pointerEvents=(n=i.get(s))!==null&&n!==void 0?n:"auto"}t.splice(0,t.length)}}}function Se(e=document){let t=e instanceof Document?e:e.ownerDocument,i=t?.documentElement;if(!t||!i)return{release:()=>{}};let n=["user-select","-webkit-user-select"],s=n.map(u=>[u,i.style.getPropertyValue(u)]);for(let u of n)i.style.setProperty(u,"none");let l=u=>u.preventDefault();return t.addEventListener("selectstart",l),{release:()=>{t.removeEventListener("selectstart",l);for(let[u,p]of s)p?i.style.setProperty(u,p):i.style.removeProperty(u)}}}function Pe(e){function t(s){let l=[];for(let u=0;u<s.classList.length;u++)l.push(s.classList.item(u));return l}let i,n=e;for(;n!==null&&(i=t(n).find(s=>s.startsWith("dockview-theme-")),typeof i!="string");){if(n.parentElement===null){let s=n.getRootNode();n=ie(s)?s.host:null;continue}n=n.parentElement}return i}var We=class{constructor(e){this.element=e,this._classNames=[]}setClassNames(e){for(let t of this._classNames)A(this.element,t,!1);this._classNames=e.split(" ").filter(t=>t.trim().length>0);for(let t of this._classNames)A(this.element,t,!0)}};let Oi=100;function It(e,t){let i=oe(e),n=oe(t);return!(i.left<n.left||i.left+i.width>n.left+n.width||i.top<n.top||i.top+i.height>n.top+n.height)}function jt(e){let t=new G,i=e.screenX,n=e.screenY,s,l=0,u=!1,p=()=>{if(u||e.closed)return;let f=e.screenX,b=e.screenY;(f!==i||b!==n)&&(clearTimeout(s),s=setTimeout(()=>{t.fire()},Oi),i=f,n=b),l=requestAnimationFrame(p)};p();let g=t.dispose.bind(t);return t.dispose=()=>{u||(u=!0,cancelAnimationFrame(l),clearTimeout(s)),g()},t}function Zn(e,t){let i;return new x(O(e,"resize",()=>{clearTimeout(i),i=setTimeout(()=>{t()},Oi)}))}function Ri(e,t,i){var n;let s=(n=i?.buffer)!==null&&n!==void 0?n:10,l=e.getBoundingClientRect(),u=t.getBoundingClientRect(),p=0,g=0,f=l.left-u.left,b=l.top-u.top,_=l.bottom-u.bottom,y=l.right-u.right;f<s?p=s-f:y>s&&(p=-s-y),b<s?g=s-b:_>s&&(g=-_-s),(p!==0||g!==0)&&(e.style.transform=`translate(${p}px, ${g}px)`)}function Ke(e){let t=e;for(;t&&(t.style.zIndex==="auto"||t.style.zIndex==="");)t=t.parentElement;return t}function He(e=document){var t,i;let n=(t=e.defaultView)===null||t===void 0||(i=t.matchMedia)===null||i===void 0?void 0:i.call(t,"(prefers-reduced-motion: reduce)");return!!n?.matches}function pi(e){let t=e.ownerDocument.defaultView;if(!t)return"";let i=e;for(;i;){let n=t.getComputedStyle(i).backgroundColor;if(n&&n!=="transparent"&&!/,\s*0\)\s*$/.test(n))return n;i=i.parentElement}return""}function $i(e){var t;let i=e.getRootNode(),n=i.nodeType===Node.DOCUMENT_NODE?i:e.ownerDocument;return n&&typeof n.hasFocus=="function"&&!n.hasFocus()?null:(t=i.activeElement)!==null&&t!==void 0?t:null}function Ar(e){var t;let i=e.getRootNode();return ie(i)?i:((t=e.ownerDocument)!==null&&t!==void 0?t:document).body}function Er(e,t,i,n,s,l,u){try{var p=e[l](u),g=p.value}catch(f){i(f);return}p.done?t(g):Promise.resolve(g).then(n,s)}function Ir(e){return function(){var t=this,i=arguments;return new Promise(function(n,s){var l=e.apply(t,i);function u(g){Er(l,n,s,u,p,"next",g)}function p(g){Er(l,n,s,u,p,"throw",g)}u(void 0)})}}function $l(e){let t=Qn(e);if(t)throw t}let Nl=new Set(["javascript:","data:","blob:","vbscript:","file:"]),Vl=250;function Qn(e,t=globalThis.location){let i;try{i=new URL(e,t.href)}catch{return new Error(`dockview: invalid popout URL: ${e}`)}if(Nl.has(i.protocol))return new Error(`dockview: popout URL must not use the "${i.protocol}" protocol, which would run in the opener's context; got: ${e}`);if(!(i.protocol===t.protocol&&i.host===t.host))return new Error(`dockview: popout URL must be same-origin with the page (${t.protocol}//${t.host}); got: ${e}`)}var Wl=class extends x{get window(){var e,t;return(e=(t=this._window)===null||t===void 0?void 0:t.value)!==null&&e!==void 0?e:null}get failure(){return this._failure}constructor(e,t,i){super(),this.target=e,this.className=t,this.options=i,this._onWillClose=new G,this.onWillClose=this._onWillClose.event,this._onDidClose=new G,this.onDidClose=this._onDidClose.event,this._window=null,this.addDisposables(this._onWillClose,this._onDidClose,{dispose:()=>{this.close()}})}dimensions(){if(!this._window)return null;let e=this._window.value.screenX;return{top:this._window.value.screenY,left:e,width:this._window.value.innerWidth,height:this._window.value.innerHeight}}close(){var e,t;let i=this._window;i&&(this._window=null,this._onWillClose.fire(),(e=(t=this.options).onWillClose)===null||e===void 0||e.call(t,{id:this.target,window:i.value}),i.disposable.dispose(),this._onDidClose.fire())}open(){var e=this;return Ir(function*(){var t,i;if(e._window)throw new Error("instance of popout window is already open");let n=`${e.options.url}`;$l(n);let s=Object.entries({top:e.options.top,left:e.options.left,width:e.options.width,height:e.options.height}).map(([g,f])=>`${g}=${f}`).join(","),l=window.open(n,e.target,s);if(!l)return e._failure={reason:"blocked"},null;let u=new x;e._window={value:l,disposable:u},u.addDisposables(w.from(()=>{l.close()}),e.watchForClose(l),O(globalThis.window,"beforeunload",()=>{e.close()}));let p=e.createPopoutWindowContainer();return e.className&&p.classList.add(e.className),(t=(i=e.options).onDidOpen)===null||t===void 0||t.call(i,{id:e.target,window:l}),new Promise(g=>{let f=b=>{e._failure={reason:"unscriptable",error:b instanceof Error?b:new Error(String(b))},e.close(),g(null)};try{l.addEventListener("unload",()=>{})}catch(b){f(b);return}u.addDisposables(e.onWillClose(()=>{var b;(b=e._failure)!==null&&b!==void 0||(e._failure={reason:"closed"}),g(null)})),l.addEventListener("load",()=>{try{var b,_,y;let C=l.document;C.title=document.title,C.body.appendChild(p),Q(C,[...Array.from(globalThis.document.styleSheets),...(b=globalThis.document.adoptedStyleSheets)!==null&&b!==void 0?b:[]],{nonce:e.options.nonce});let T=[];for(let M=(_=(y=e.options).styleRoot)===null||_===void 0?void 0:_.call(y);ie(M);M=M.host.getRootNode()){var D,k;T.push(...Array.from((D=M.styleSheets)!==null&&D!==void 0?D:[]),...(k=M.adoptedStyleSheets)!==null&&k!==void 0?k:[])}T.length>0&&Q(C,T,{nonce:e.options.nonce}),O(l,"beforeunload",()=>{e.close()}),g(p)}catch(C){f(C)}})})})()}watchForClose(e){if(typeof e.closed!="boolean")return w.NONE;let t=setInterval(()=>{e.closed&&this.close()},Vl);return w.from(()=>{clearInterval(t)})}createPopoutWindowContainer(){let e=document.createElement("div");return e.classList.add("dv-popout-window"),e.id="dv-popout-window",e.style.position="absolute",e.style.width="100%",e.style.height="100%",e.style.top="0px",e.style.left="0px",e}};function ot(e){if(e.length===0)throw new Error("Invalid tail call");return[e.slice(0,e.length-1),e[e.length-1]]}function eo(e,t){if(e.length!==t.length)return!1;for(let i=0;i<e.length;i++)if(e[i]!==t[i])return!1;return!0}function to(e,t){let i=e.indexOf(t);i>-1&&(e.splice(i,1),e.unshift(t))}function Ni(e,t){let i=e.indexOf(t);i>-1&&(e.splice(i,1),e.push(t))}function Hl(e,t){for(let i=0;i<e.length;i++){let n=e[i];if(t(n))return i}return-1}function Mr(e,t){let i=e.indexOf(t);return i>-1?(e.splice(i,1),!0):!1}let De=(e,t,i)=>t>i?t:Math.min(i,Math.max(e,t)),io=()=>{let e=1;return{next:()=>(e++).toString()}},rt=(e,t)=>{let i=[];if(typeof t!="number"&&(t=e,e=0),e<=t)for(let n=e;n<t;n++)i.push(n);else for(let n=e;n>t;n--)i.push(n);return i};var Bl=class{set size(e){this._size=e}setContainerGeometry(e,t){this._appliedStyles[e]!==t&&(this._appliedStyles[e]=t,this.container.style[e]=t)}get size(){return this._size}get cachedVisibleSize(){return this._cachedVisibleSize}get visible(){return this._cachedVisibleSize===void 0}get minimumSize(){return this.visible?this.view.minimumSize:0}get viewMinimumSize(){return this.view.minimumSize}get maximumSize(){return this.visible?this.view.maximumSize:0}get viewMaximumSize(){return this.view.maximumSize}get priority(){return this.view.priority}get snap(){return!!this.view.snap}set enabled(e){this.container.style.pointerEvents=e?"":"none"}constructor(e,t,i,n){this.container=e,this.view=t,this.disposable=n,this._cachedVisibleSize=void 0,this._appliedStyles={},typeof i=="number"?(this._size=i,this._cachedVisibleSize=void 0,e.classList.add("visible")):(this._size=0,this._cachedVisibleSize=i.cachedVisibleSize)}setVisible(e,t){if(e!==this.visible){if(e){var i;let n=(i=this._cachedVisibleSize)!==null&&i!==void 0?i:0;this._cachedVisibleSize=void 0,this.size=De(n,this.viewMinimumSize,this.viewMaximumSize)}else this._cachedVisibleSize=typeof t=="number"?t:this.size,this.size=0;this.container.classList.toggle("visible",e),this.view.setVisible&&this.view.setVisible(e)}}dispose(){return this.disposable.dispose(),this.view}};let Fl=(function(e){return e.HORIZONTAL="HORIZONTAL",e.VERTICAL="VERTICAL",e})({}),Ul=(function(e){return e[e.MAXIMUM=0]="MAXIMUM",e[e.MINIMUM=1]="MINIMUM",e[e.DISABLED=2]="DISABLED",e[e.ENABLED=3]="ENABLED",e})({}),Yl=(function(e){return e.Low="low",e.High="high",e.Normal="normal",e})({});function Lr(e,t,i){e.appliedLeft!==t&&(e.appliedLeft=t,e.container.style.left=t),e.appliedTop!==i&&(e.appliedTop=i,e.container.style.top=i)}let Ce;(function(e){e.Distribute={type:"distribute"};function t(n){return{type:"split",index:n}}e.Split=t;function i(n){return{type:"invisible",cachedVisibleSize:n}}e.Invisible=i})(Ce||(Ce={}));var Dt=class{get contentSize(){return this._contentSize}get size(){return this._size}set size(e){this._size=e}get orthogonalSize(){return this._orthogonalSize}set orthogonalSize(e){this._orthogonalSize=e}get length(){return this.viewItems.length}get proportions(){return this._proportions?[...this._proportions]:void 0}get proportionalLayout(){return this._proportionalLayout}set proportionalLayout(e){this._proportionalLayout!==e&&(this._proportionalLayout=e,e?this.saveProportions():this._proportions=void 0)}get orientation(){return this._orientation}set orientation(e){this._orientation=e;let t=this.size;this.size=this.orthogonalSize,this.orthogonalSize=t,F(this.element,"dv-horizontal","dv-vertical"),this.element.classList.add(this.orientation=="HORIZONTAL"?"dv-horizontal":"dv-vertical")}get minimumSize(){return this.viewItems.reduce((e,t)=>e+t.minimumSize,0)}get maximumSize(){return this.length===0?Number.POSITIVE_INFINITY:this.viewItems.reduce((e,t)=>e+t.maximumSize,0)}get startSnappingEnabled(){return this._startSnappingEnabled}set startSnappingEnabled(e){this._startSnappingEnabled!==e&&(this._startSnappingEnabled=e,this.updateSashEnablement())}get endSnappingEnabled(){return this._endSnappingEnabled}set endSnappingEnabled(e){this._endSnappingEnabled!==e&&(this._endSnappingEnabled=e,this.updateSashEnablement())}get disabled(){return this._disabled}set disabled(e){this._disabled=e,A(this.element,"dv-splitview-disabled",e)}get margin(){return this._margin}get marginShare(){let e=0;for(let t of this.viewItems)t.visible&&e++;return this.marginShareFor(e)}set margin(e){this._margin=e,A(this.element,"dv-splitview-has-margin",e!==0)}constructor(e,t){var i,n;this.container=e,this.viewItems=[],this.sashes=[],this._size=0,this._orthogonalSize=0,this._contentSize=0,this._proportions=void 0,this._startSnappingEnabled=!0,this._endSnappingEnabled=!0,this._disabled=!1,this._margin=0,this._onDidSashEnd=new G,this.onDidSashEnd=this._onDidSashEnd.event,this._onDidAddView=new G,this.onDidAddView=this._onDidAddView.event,this._onDidRemoveView=new G,this.onDidRemoveView=this._onDidRemoveView.event,this.resize=(s,l,u=this.viewItems.map(D=>D.size),p,g,f=Number.NEGATIVE_INFINITY,b=Number.POSITIVE_INFINITY,_,y)=>{if(s<0||s>this.viewItems.length)return 0;let D=rt(s,-1),k=rt(s+1,this.viewItems.length);if(g)for(let K of g)to(D,K),to(k,K);if(p)for(let K of p)Ni(D,K),Ni(k,K);let C=D.reduce((K,ee)=>K+this.viewItems[ee].minimumSize-u[ee],0),T=D.reduce((K,ee)=>K+this.viewItems[ee].maximumSize-u[ee],0),M=k.length===0?Number.POSITIVE_INFINITY:k.reduce((K,ee)=>K+u[ee]-this.viewItems[ee].minimumSize,0),I=k.length===0?Number.NEGATIVE_INFINITY:k.reduce((K,ee)=>K+u[ee]-this.viewItems[ee].maximumSize,0),E=Math.max(C,I),$=Math.min(M,T),X=!1;if(_){let K=this.viewItems[_.index],ee=l>=_.limitDelta;X=ee!==K.visible,K.setVisible(ee,_.size)}if(!X&&y){let K=this.viewItems[y.index],ee=l<y.limitDelta;X=ee!==K.visible,K.setVisible(ee,y.size)}if(X)return this.resize(s,l,u,p,g,f,b);let Z=De(l,E,$),W=0,B=Z;for(let K of D){let ee=this.viewItems[K],we=u[K],ve=De(we+B,ee.minimumSize,ee.maximumSize),fe=ve-we;W+=fe,B-=fe,ee.size=ve}let re=W;for(let K of k){let ee=this.viewItems[K],we=u[K],ve=De(we-re,ee.minimumSize,ee.maximumSize),fe=ve-we;re+=fe,ee.size=ve}return l},this._orientation=(i=t.orientation)!==null&&i!==void 0?i:"VERTICAL",this.element=this.createContainer(),this.margin=(n=t.margin)!==null&&n!==void 0?n:0,this._proportionalLayout=t.proportionalLayout===void 0?!0:!!t.proportionalLayout,this.viewContainer=this.createViewContainer(),this.sashContainer=this.createSashContainer(),this.element.appendChild(this.sashContainer),this.element.appendChild(this.viewContainer),this.container.appendChild(this.element),this.style(t.styles),t.descriptor&&(this._size=t.descriptor.size,t.descriptor.views.forEach((s,l)=>{let u=s.visible===void 0||s.visible?s.size:{type:"invisible",cachedVisibleSize:s.size},p=s.view;this.addView(p,u,l,!0)}),this._contentSize=this.viewItems.reduce((s,l)=>s+l.size,0),this.saveProportions())}style(e){e?.separatorBorder==="transparent"?(F(this.element,"dv-separator-border"),this.element.style.removeProperty("--dv-separator-border")):(J(this.element,"dv-separator-border"),e?.separatorBorder&&this.element.style.setProperty("--dv-separator-border",e.separatorBorder))}isViewVisible(e){if(e<0||e>=this.viewItems.length)throw new Error("Index out of bounds");return this.viewItems[e].visible}setViewVisible(e,t){if(e<0||e>=this.viewItems.length)throw new Error("Index out of bounds");let i=this.viewItems[e];i.setVisible(t,i.size),this.distributeEmptySpace(e),this.layoutViews(),this.saveProportions()}getViewSize(e){return e<0||e>=this.viewItems.length?-1:this.viewItems[e].size}resizeView(e,t){if(e<0||e>=this.viewItems.length)return;let i=rt(this.viewItems.length).filter(u=>u!==e),n=[...i.filter(u=>this.viewItems[u].priority==="low"),e],s=i.filter(u=>this.viewItems[u].priority==="high"),l=this.viewItems[e];t=Math.round(t),t=De(t,l.minimumSize,Math.min(l.maximumSize,this._size)),l.size=t,this.relayout(n,s)}getViews(){return this.viewItems.map(e=>e.view)}onDidChange(e,t){let i=this.viewItems.indexOf(e);if(i<0||i>=this.viewItems.length)return;t=typeof t=="number"?t:e.size,t=De(t,e.minimumSize,e.maximumSize),e.size=t;let n=rt(this.viewItems.length).filter(u=>u!==i),s=[...n.filter(u=>this.viewItems[u].priority==="low"),i],l=n.filter(u=>this.viewItems[u].priority==="high");this.relayout([...s,i],l)}addView(e,t=Ce.Distribute,i=this.viewItems.length,n){let s=document.createElement("div");s.className="dv-view",s.appendChild(e.element);let l;if(typeof t=="number")l=t;else if(t.type==="split"){let g=this.viewItems[t.index];if(g){let f=Math.floor(g.size/2);l=g.size-f,g.size=f}else l=this.getViewSize(t.index)/2}else t.type==="invisible"?l={cachedVisibleSize:t.cachedVisibleSize}:l=e.minimumSize;let u=e.onDidChange(g=>this.onDidChange(p,g.size)),p=new Bl(s,e,l,{dispose:()=>{u.dispose(),s.remove()}});if(i===this.viewItems.length?this.viewContainer.appendChild(s):this.viewContainer.insertBefore(s,this.viewContainer.children.item(i)),this.viewItems.splice(i,0,p),this.viewItems.length>1){let g=document.createElement("div");g.className="dv-sash";let f=_=>{var y;for(let _e of this.viewItems)_e.enabled=!1;let D=(y=g.ownerDocument)!==null&&y!==void 0?y:document,k=ge(D),C=this._orientation==="HORIZONTAL"?_.clientX:_.clientY,T=Hl(this.sashes,_e=>_e.container===g),M=this.viewItems.map(_e=>_e.size),I,E,$=rt(T,-1),X=rt(T+1,this.viewItems.length),Z=$.reduce((_e,me)=>_e+(this.viewItems[me].minimumSize-M[me]),0),W=$.reduce((_e,me)=>_e+(this.viewItems[me].viewMaximumSize-M[me]),0),B=X.length===0?Number.POSITIVE_INFINITY:X.reduce((_e,me)=>_e+(M[me]-this.viewItems[me].minimumSize),0),re=X.length===0?Number.NEGATIVE_INFINITY:X.reduce((_e,me)=>_e+(M[me]-this.viewItems[me].viewMaximumSize),0),K=Math.max(Z,re),ee=Math.min(B,W),we=this.findFirstSnapIndex($),ve=this.findFirstSnapIndex(X);if(typeof we=="number"){let _e=this.viewItems[we],me=Math.floor(_e.viewMinimumSize/2);I={index:we,limitDelta:_e.visible?K-me:K+me,size:_e.size}}if(typeof ve=="number"){let _e=this.viewItems[ve],me=Math.floor(_e.viewMinimumSize/2);E={index:ve,limitDelta:_e.visible?ee+me:ee-me,size:_e.size}}let fe=_e=>{let me=(this._orientation==="HORIZONTAL"?_e.clientX:_e.clientY)-C;this.resize(T,me,M,void 0,void 0,K,ee,I,E),this.distributeEmptySpace(),this.layoutViews()},Ae=()=>{for(let _e of this.viewItems)_e.enabled=!0;k.release(),this.saveProportions(),D.removeEventListener("pointermove",fe),D.removeEventListener("pointerup",Ae),D.removeEventListener("pointercancel",Ae),D.removeEventListener("contextmenu",Ae),this._onDidSashEnd.fire(void 0)};D.addEventListener("pointermove",fe),D.addEventListener("pointerup",Ae),D.addEventListener("pointercancel",Ae),D.addEventListener("contextmenu",Ae)};g.addEventListener("pointerdown",f);let b={container:g,disposable:()=>{g.removeEventListener("pointerdown",f),g.remove()}};this.sashContainer.appendChild(g),this.sashes.push(b)}n||this.relayout([i]),!n&&typeof t!="number"&&t.type==="distribute"&&this.distributeViewSizes(),this._onDidAddView.fire(e)}distributeViewSizes(){let e=[],t=0;for(let u of this.viewItems)u.maximumSize-u.minimumSize>0&&(e.push(u),t+=u.size);let i=Math.floor(t/e.length);for(let u of e)u.size=De(i,u.minimumSize,u.maximumSize);let n=rt(this.viewItems.length),s=n.filter(u=>this.viewItems[u].priority==="low"),l=n.filter(u=>this.viewItems[u].priority==="high");this.relayout(s,l)}removeView(e,t,i=!1){let n=this.viewItems.splice(e,1)[0];if(n.dispose(),this.viewItems.length>=1){let s=Math.max(e-1,0);this.sashes.splice(s,1)[0].disposable()}return i||this.relayout(),t?.type==="distribute"&&this.distributeViewSizes(),this._onDidRemoveView.fire(n.view),n.view}getViewCachedVisibleSize(e){if(e<0||e>=this.viewItems.length)throw new Error("Index out of bounds");return this.viewItems[e].cachedVisibleSize}moveView(e,t){let i=this.getViewCachedVisibleSize(e),n=i===void 0?this.getViewSize(e):Ce.Invisible(i),s=this.removeView(e,void 0,!0);this.addView(s,n,t)}layout(e,t){let i=Math.max(this.size,this._contentSize);if(this.size=e,this.orthogonalSize=t,this._proportions||this.saveProportions(),this.proportions){let n=0;for(let s=0;s<this.viewItems.length;s++){let l=this.viewItems[s],u=this.proportions[s];typeof u=="number"?n+=u:e-=l.size}for(let s=0;s<this.viewItems.length;s++){let l=this.viewItems[s],u=this.proportions[s];typeof u=="number"&&n>0&&(l.size=De(Math.round(u*e/n),l.minimumSize,l.maximumSize))}}else{let n=rt(this.viewItems.length),s=n.filter(u=>this.viewItems[u].priority==="low"),l=n.filter(u=>this.viewItems[u].priority==="high");this.resize(this.viewItems.length-1,e-i,void 0,s,l)}this.distributeEmptySpace(),this.layoutViews()}relayout(e,t){let i=this.viewItems.reduce((n,s)=>n+s.size,0);this.resize(this.viewItems.length-1,this._size-i,void 0,e,t),this.distributeEmptySpace(),this.layoutViews(),this.saveProportions()}distributeEmptySpace(e){let t=0;for(let l of this.viewItems)t+=l.size;let i=this.size-t;if(i===0)return;let n=rt(this.viewItems.length-1,-1),s=!1;for(let l of this.viewItems)if(l.priority==="low"||l.priority==="high"){s=!0;break}if(s){let l=n.filter(p=>this.viewItems[p].priority==="low"),u=n.filter(p=>this.viewItems[p].priority==="high");for(let p of u)to(n,p);for(let p of l)Ni(n,p)}typeof e=="number"&&Ni(n,e);for(let l=0;i!==0&&l<n.length;l++){let u=this.viewItems[n[l]],p=De(u.size+i,u.minimumSize,u.maximumSize),g=p-u.size;i-=g,u.size=p}}saveProportions(){if(!this.proportionalLayout)return;let e=0;for(let t of this.viewItems)e+=t.size;e>0&&(this._proportions=this.viewItems.map(t=>t.visible?t.size/e:void 0))}layoutViews(){let e=0,t=0;for(let g of this.viewItems)e+=g.size,g.visible&&t++;if(this._contentSize=e,this.updateSashEnablement(),this.viewItems.length===0)return;let i=Math.max(0,t-1),n=this.marginShareFor(t),s=0,l=[],u=4,p=0;this.viewItems.forEach((g,f)=>{s+=this.viewItems[f].size,l.push(s),p+=g.visible?1:0;let b=g.visible?g.size-n:0,_=Math.max(0,p-1),y=f===0||_===0?0:l[f-1]+_/i*n;if(f<this.viewItems.length-1){let D=g.visible?y+b-u/2+this.margin/2:y,k=this.sashes[f];this._orientation==="HORIZONTAL"&&Lr(k,`${D}px`,"0px"),this._orientation==="VERTICAL"&&Lr(k,"0px",`${D}px`)}this._orientation==="HORIZONTAL"&&(g.setContainerGeometry("width",`${b}px`),g.setContainerGeometry("left",`${y}px`),g.setContainerGeometry("top",""),g.setContainerGeometry("height","")),this._orientation==="VERTICAL"&&(g.setContainerGeometry("height",`${b}px`),g.setContainerGeometry("top",`${y}px`),g.setContainerGeometry("width",""),g.setContainerGeometry("left","")),g.view.layout(b,this._orthogonalSize)})}marginShareFor(e){let t=Math.max(0,e-1);return this._margin*t/Math.max(1,e)}findFirstSnapIndex(e){for(let t of e){let i=this.viewItems[t];if(i.visible&&i.snap)return t}for(let t of e){let i=this.viewItems[t];if(i.visible&&i.maximumSize-i.minimumSize>0)return;if(!i.visible&&i.snap)return t}}updateSashEnablement(){if(this.sashes.length===0)return;let e=!1,t=this.viewItems.map(p=>e=p.size-p.minimumSize>0||e);e=!1;let i=this.viewItems.map(p=>e=p.maximumSize-p.size>0||e),n=[...this.viewItems].reverse();e=!1;let s=n.map(p=>e=p.size-p.minimumSize>0||e).reverse();e=!1;let l=n.map(p=>e=p.maximumSize-p.size>0||e).reverse(),u=0;for(let p=0;p<this.sashes.length;p++){let g=this.sashes[p],f=this.viewItems[p];u+=f.size;let b=!(t[p]&&l[p+1]),_=!(i[p]&&s[p+1]);if(b&&_){let y=rt(p,-1),D=rt(p+1,this.viewItems.length),k=this.findFirstSnapIndex(y),C=this.findFirstSnapIndex(D),T=typeof k=="number"&&!this.viewItems[k].visible,M=typeof C=="number"&&!this.viewItems[C].visible;T&&s[p]&&(u>0||this.startSnappingEnabled)?this.updateSash(g,1):M&&t[p]&&(u<this._contentSize||this.endSnappingEnabled)?this.updateSash(g,0):this.updateSash(g,2)}else b&&!_?this.updateSash(g,1):!b&&_?this.updateSash(g,0):this.updateSash(g,3)}}updateSash(e,t){A(e.container,"dv-disabled",t===2),A(e.container,"dv-enabled",t===3),A(e.container,"dv-maximum",t===0),A(e.container,"dv-minimum",t===1)}createViewContainer(){let e=document.createElement("div");return e.className="dv-view-container",e}createSashContainer(){let e=document.createElement("div");return e.className="dv-sash-container",e}createContainer(){let e=document.createElement("div");return e.className=`dv-split-view-container ${this._orientation==="HORIZONTAL"?"dv-horizontal":"dv-vertical"}`,e}dispose(){this._onDidSashEnd.dispose(),this._onDidAddView.dispose(),this._onDidRemoveView.dispose();for(let e=0;e<this.element.children.length;e++)if(this.element.children.item(e)===this.element){this.element.remove();break}for(let e of this.viewItems)e.dispose();this.element.remove()}};let ql=Object.keys({orientation:void 0,descriptor:void 0,proportionalLayout:void 0,styles:void 0,margin:void 0,disableAutoResizing:void 0,className:void 0});var Vi=class extends x{get onDidAddView(){return this.splitview.onDidAddView}get onDidRemoveView(){return this.splitview.onDidRemoveView}get minimumSize(){return this.splitview.minimumSize}get maximumSize(){return this.splitview.maximumSize}get orientation(){return this.splitview.orientation}get size(){return this.splitview.size}get orthogonalSize(){return this.splitview.orthogonalSize}constructor(e,t){var i;super(),this.paneItems=[],this.skipAnimation=!1,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._orientation=(i=t.orientation)!==null&&i!==void 0?i:"VERTICAL",this.element=document.createElement("div"),this.element.className="dv-pane-container",e.appendChild(this.element),this.splitview=new Dt(this.element,{orientation:this._orientation,proportionalLayout:!1,descriptor:t.descriptor}),this.getPanes().forEach(n=>{let s=new x(n.onDidChangeExpansionState(()=>{this.setupAnimation(),this._onDidChange.fire(void 0)})),l={pane:n,disposable:{dispose:()=>{s.dispose()}}};this.paneItems.push(l),n.orthogonalSize=this.splitview.orthogonalSize}),this.addDisposables(this._onDidChange,this.splitview.onDidSashEnd(()=>{this._onDidChange.fire(void 0)}),this.splitview.onDidAddView(()=>{this._onDidChange.fire()}),this.splitview.onDidRemoveView(()=>{this._onDidChange.fire()}))}setViewVisible(e,t){this.splitview.setViewVisible(e,t)}addPane(e,t,i=this.splitview.length,n=!1){let s=e.onDidChangeExpansionState(()=>{this.setupAnimation(),this._onDidChange.fire(void 0)}),l={pane:e,disposable:{dispose:()=>{s.dispose()}}};this.paneItems.splice(i,0,l),e.orthogonalSize=this.splitview.orthogonalSize,this.splitview.addView(e,t,i,n)}getViewSize(e){return this.splitview.getViewSize(e)}getViewCachedVisibleSize(e){return this.splitview.getViewCachedVisibleSize(e)}getPanes(){return this.splitview.getViews()}removePane(e,t){let i=this.paneItems.splice(e,1)[0];return this.splitview.removeView(e),t?.skipDispose||(i.disposable.dispose(),i.pane.dispose()),i}moveView(e,t){if(e===t)return;let i=this.removePane(e,{skipDispose:!0});i.disposable.dispose(),this.skipAnimation=!0;try{this.addPane(i.pane,i.pane.size,t,!1)}finally{this.skipAnimation=!1}}layout(e,t){this.splitview.layout(e,t)}setupAnimation(){this.skipAnimation||(this.animationTimer&&(clearTimeout(this.animationTimer),this.animationTimer=void 0),J(this.element,"dv-animated"),this.animationTimer=setTimeout(()=>{this.animationTimer=void 0,F(this.element,"dv-animated")},200))}dispose(){super.dispose(),this.animationTimer&&(clearTimeout(this.animationTimer),this.animationTimer=void 0),this.paneItems.forEach(e=>{e.disposable.dispose(),e.pane.dispose()}),this.paneItems=[],this.splitview.dispose(),this.element.remove()}},Ee=class{get minimumWidth(){return this.view.minimumWidth}get maximumWidth(){return this.view.maximumWidth}get minimumHeight(){return this.view.minimumHeight}get maximumHeight(){return this.view.maximumHeight}get priority(){return this.view.priority}get snap(){return this.view.snap}get minimumSize(){return this.orientation==="HORIZONTAL"?this.minimumHeight:this.minimumWidth}get maximumSize(){return this.orientation==="HORIZONTAL"?this.maximumHeight:this.maximumWidth}get minimumOrthogonalSize(){return this.orientation==="HORIZONTAL"?this.minimumWidth:this.minimumHeight}get maximumOrthogonalSize(){return this.orientation==="HORIZONTAL"?this.maximumWidth:this.maximumHeight}get orthogonalSize(){return this._orthogonalSize}get size(){return this._size}get element(){return this.view.element}get width(){return this.orientation==="HORIZONTAL"?this.orthogonalSize:this.size}get height(){return this.orientation==="HORIZONTAL"?this.size:this.orthogonalSize}constructor(e,t,i,n=0){this.view=e,this.orientation=t,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._orthogonalSize=i,this._size=n,this._disposable=this.view.onDidChange(s=>{s?this._onDidChange.fire({size:this.orientation==="VERTICAL"?s.width:s.height,orthogonalSize:this.orientation==="VERTICAL"?s.height:s.width}):this._onDidChange.fire({})})}setVisible(e){this.view.setVisible&&this.view.setVisible(e)}layout(e,t){this._size=e,this._orthogonalSize=t,this.view.layout(this.width,this.height)}dispose(){this._onDidChange.dispose(),this._disposable.dispose()}},ze=class qn extends x{get width(){return this.orientation==="HORIZONTAL"?this.size:this.orthogonalSize}get height(){return this.orientation==="HORIZONTAL"?this.orthogonalSize:this.size}get minimumSize(){if(this._cachedMinimumSize===void 0){let t=0;for(let i=0;i<this.children.length;i++)this.splitview.isViewVisible(i)&&(t=Math.max(t,this.children[i].minimumOrthogonalSize));this._cachedMinimumSize=t}return this._cachedMinimumSize}get maximumSize(){if(this._cachedMaximumSize===void 0){let t=Number.POSITIVE_INFINITY;for(let i=0;i<this.children.length;i++)this.splitview.isViewVisible(i)&&(t=Math.min(t,this.children[i].maximumOrthogonalSize));this._cachedMaximumSize=t}return this._cachedMaximumSize}get minimumOrthogonalSize(){return this.splitview.minimumSize}get maximumOrthogonalSize(){return this.splitview.maximumSize}get orthogonalSize(){return this._orthogonalSize}get size(){return this._size}get minimumWidth(){return this.orientation==="HORIZONTAL"?this.minimumOrthogonalSize:this.minimumSize}get minimumHeight(){return this.orientation==="HORIZONTAL"?this.minimumSize:this.minimumOrthogonalSize}get maximumWidth(){return this.orientation==="HORIZONTAL"?this.maximumOrthogonalSize:this.maximumSize}get maximumHeight(){return this.orientation==="HORIZONTAL"?this.maximumSize:this.maximumOrthogonalSize}get priority(){var t;return(t=this._cachedPriority)!==null&&t!==void 0||(this._cachedPriority=this.computePriority()),this._cachedPriority}computePriority(){if(this.children.length===0)return"normal";let t=!1,i=!1;for(let s of this.children){var n;let l=(n=s.priority)!==null&&n!==void 0?n:"normal";l==="high"?t=!0:l==="low"&&(i=!0)}return t?"high":i?"low":"normal"}invalidateCachedSizes(){this._cachedMinimumSize=void 0,this._cachedMaximumSize=void 0,this._cachedPriority=void 0}get disabled(){return this.splitview.disabled}set disabled(t){this.splitview.disabled=t}get margin(){return this.splitview.margin}set margin(t){this.splitview.margin=t,this.children.forEach(i=>{i instanceof qn&&(i.margin=t)})}get proportionalLayout(){return this.splitview.proportionalLayout}set proportionalLayout(t){this.splitview.proportionalLayout=t,this.children.forEach(i=>{i instanceof qn&&(i.proportionalLayout=t)})}constructor(t,i,n,s,l,u,p,g){if(super(),this.orientation=t,this.styles=n,this._childrenDisposable=w.NONE,this.children=[],this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._onDidVisibilityChange=new G,this.onDidVisibilityChange=this._onDidVisibilityChange.event,this._orthogonalSize=l,this._size=s,this.element=document.createElement("div"),this.element.className="dv-branch-node",g){let f={views:g.map(b=>{var _;return{view:b.node,size:b.node.size,visible:(_=b.visible)!==null&&_!==void 0?_:!0}}),size:this.orthogonalSize};this.children=g.map(b=>b.node),this.splitview=new Dt(this.element,{orientation:this.orientation,descriptor:f,proportionalLayout:i,styles:n,margin:p})}else this.splitview=new Dt(this.element,{orientation:this.orientation,proportionalLayout:i,styles:n,margin:p}),this.splitview.layout(this.size,this.orthogonalSize);this.disabled=u,this.addDisposables(this._onDidChange,this._onDidVisibilityChange,this.splitview.onDidSashEnd(()=>{this._onDidChange.fire({})})),this.setupChildrenEvents()}setVisible(t){}isChildVisible(t){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.isViewVisible(t)}setChildVisible(t,i){if(t<0||t>=this.children.length)throw new Error("Invalid index");if(this.splitview.isViewVisible(t)===i)return;let n=this.splitview.contentSize===0;this.splitview.setViewVisible(t,i),this.invalidateCachedSizes();let s=this.splitview.contentSize===0;(i&&n||!i&&s)&&this._onDidVisibilityChange.fire({visible:i})}moveChild(t,i){if(t===i)return;if(t<0||t>=this.children.length)throw new Error("Invalid from index");t<i&&i--,this.splitview.moveView(t,i);let n=this._removeChild(t);this._addChild(n,i)}getChildSize(t){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.getViewSize(t)}resizeChild(t,i){if(t<0||t>=this.children.length)throw new Error("Invalid index");this.splitview.resizeView(t,i)}layout(t,i){this._size=i,this._orthogonalSize=t,this.splitview.layout(i,t)}addChild(t,i,n,s){if(n<0||n>this.children.length)throw new Error("Invalid index");this.splitview.addView(t,i,n,s),this._addChild(t,n)}getChildCachedVisibleSize(t){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.getViewCachedVisibleSize(t)}removeChild(t,i){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.removeView(t,i),this._removeChild(t)}_addChild(t,i){this.children.splice(i,0,t),this.setupChildrenEvents()}_removeChild(t){let[i]=this.children.splice(t,1);return this.setupChildrenEvents(),i}setupChildrenEvents(){this.invalidateCachedSizes(),this._childrenDisposable.dispose(),this._childrenDisposable=new x(P.any(...this.children.map(t=>t.onDidChange))(t=>{this.invalidateCachedSizes(),this._onDidChange.fire({size:t.orthogonalSize})}),...this.children.map((t,i)=>t instanceof qn?t.onDidVisibilityChange(({visible:n})=>{this.setChildVisible(i,n)}):w.NONE))}dispose(){this._childrenDisposable.dispose(),this.splitview.dispose(),this.children.forEach(t=>t.dispose()),super.dispose()}};function no(e,t){if(e instanceof Ee)return e;if(e instanceof ze)return no(e.children[t?e.children.length-1:0],t);throw new Error("invalid node")}function oo(e,t,i,n=1){let s=e.getChildCachedVisibleSize(t);return s===void 0?i:Ce.Invisible(Math.round(s*n))}function Or(e,t,i){if(e instanceof ze){let n=new ze(e.orientation,e.proportionalLayout,e.styles,t,i,e.disabled,e.margin);for(let s=e.children.length-1;s>=0;s--){let l=e.children[s];n.addChild(Or(l,l.size,l.orthogonalSize),oo(e,s,l.size),0,!0)}return n}else return new Ee(e.view,e.orientation,i)}function ro(e,t,i){if(e instanceof ze){let n=new ze(st(e.orientation),e.proportionalLayout,e.styles,t,i,e.disabled,e.margin),s=0,l=e.size===0?1:t/e.size;for(let u=e.children.length-1;u>=0;u--){let p=e.children[u],g=p instanceof ze?p.orthogonalSize:p.size,f=e.size===0?0:Math.round(t*g/e.size);s+=f,u===0&&(f+=t-s),n.addChild(ro(p,i,f),oo(e,u,f,l),0,!0)}return n}else return new Ee(e.view,st(e.orientation),i)}function Rr(e){let t=e.parentElement;if(!t)throw new Error("Invalid grid element");let i=t.firstElementChild,n=0;for(;i!==e&&i!==t.lastElementChild&&i;)i=i.nextElementSibling,n++;return n}function xe(e){let t=e.parentElement;if(!t)throw new Error("Invalid grid element");if(/\bdv-grid-view\b/.test(t.className))return[];let i=Rr(t),n=t.parentElement.parentElement.parentElement;return[...xe(n),i]}function Be(e,t,i){if(so(e,t)===Wi(i)){let[n,s]=ot(t),l=s;return(i==="right"||i==="bottom")&&(l+=1),[...n,l]}else{let n=i==="right"||i==="bottom"?1:0;return[...t,n]}}function Wi(e){return e==="top"||e==="bottom"?"VERTICAL":"HORIZONTAL"}function so(e,t){return t.length%2===0?st(e):e}let st=e=>e==="HORIZONTAL"?"VERTICAL":"HORIZONTAL";function $r(e){return!!e.children}let ao=(e,t)=>{let i=t==="VERTICAL"?e.box.width:e.box.height;if(!$r(e))return typeof e.cachedVisibleSize=="number"?{type:"leaf",data:e.view.toJSON(),size:e.cachedVisibleSize,visible:!1}:{type:"leaf",data:e.view.toJSON(),size:i};let n=e.children.map(s=>ao(s,st(t)));return typeof e.cachedVisibleSize=="number"?{type:"branch",data:n,size:e.cachedVisibleSize,visible:!1}:{type:"branch",data:n,size:i}};var lo=class{get length(){return this._root?this._root.children.length:0}get orientation(){return this.root.orientation}set orientation(e){if(this.root.orientation===e)return;let{size:t,orthogonalSize:i}=this.root;this.root=ro(this.root,i,t),this.root.layout(t,i)}get width(){return this.root.width}get height(){return this.root.height}get minimumWidth(){return this.root.minimumWidth}get minimumHeight(){return this.root.minimumHeight}get maximumWidth(){return this.root.maximumWidth}get maximumHeight(){return this.root.maximumHeight}get locked(){return this._locked}set locked(e){this._locked=e;let t=[this.root];for(;t.length>0;){let i=t.pop();i instanceof ze&&(i.disabled=e,t.push(...i.children))}}get margin(){return this._margin}set margin(e){this._margin=e,this.root.margin=e}maximizedView(){var e;return(e=this._maximizedNode)===null||e===void 0?void 0:e.leaf.view}hasMaximizedView(){return this._maximizedNode!==void 0}maximizeView(e){var t;let i=xe(e.element),[n,s]=this.getNode(i);if(!(s instanceof Ee)||((t=this._maximizedNode)===null||t===void 0?void 0:t.leaf)===s)return;this.hasMaximizedView()&&this.exitMaximizedView(),ao(this.getView(),this.orientation);let l=[];function u(p,g){for(let f=0;f<p.children.length;f++){let b=p.children[f];b instanceof Ee?b!==g&&(p.isChildVisible(f)?p.setChildVisible(f,!1):l.push(b)):u(b,g)}}u(this.root,s),this._maximizedNode={leaf:s,hiddenOnMaximize:l},this._onDidMaximizedNodeChange.fire({view:s.view,isMaximized:!0})}exitMaximizedView(){if(!this._maximizedNode)return;let e=this._maximizedNode.hiddenOnMaximize;function t(n){for(let s=n.children.length-1;s>=0;s--){let l=n.children[s];l instanceof Ee?e.includes(l)||n.setChildVisible(s,!0):t(l)}}t(this.root);let i=this._maximizedNode.leaf;this._maximizedNode=void 0,this._onDidMaximizedNodeChange.fire({view:i.view,isMaximized:!1})}serialize(){let e=this.maximizedView(),t;e&&(t=xe(e.element));let i=this._onDidMaximizedNodeChange.pause();try{this.hasMaximizedView()&&this.exitMaximizedView();let n={root:ao(this.getView(),this.orientation),width:this.width,height:this.height,orientation:this.orientation};return t&&(n.maximizedNode={location:t}),e&&this.maximizeView(e),n}finally{i.dispose()}}dispose(){this.disposable.dispose(),this._onDidChange.dispose(),this._onDidMaximizedNodeChange.dispose(),this._onDidViewVisibilityChange.dispose(),this.root.dispose(),this._maximizedNode=void 0,this.element.remove()}clear(){let e=this.root.orientation;this.root=new ze(e,this.proportionalLayout,this.styles,this.root.size,this.root.orthogonalSize,this.locked,this.margin)}deserialize(e,t){let i=e.orientation,n=i==="VERTICAL"?e.height:e.width;if(this._deserialize(e.root,i,t,n),this.layout(e.width,e.height),e.maximizedNode){let s=e.maximizedNode.location,[l,u]=this.getNode(s);if(!(u instanceof Ee))return;this.maximizeView(u.view)}}_deserialize(e,t,i,n){this.root=this._deserializeNode(e,t,i,n)}_deserializeNode(e,t,i,n){let s;if(e.type==="branch"){let u=e.data.map(p=>({node:this._deserializeNode(p,st(t),i,e.size),visible:p.visible}));s=new ze(t,this.proportionalLayout,this.styles,e.size,n,this.locked,this.margin,u)}else{let u=i.fromJSON(e);if(typeof e.visible=="boolean"){var l;(l=u.setVisible)===null||l===void 0||l.call(u,e.visible)}s=new Ee(u,t,n,e.size)}return s}get root(){return this._root}set root(e){let t=this._root;t&&(t.dispose(),this._maximizedNode=void 0,t.element.remove()),this._root=e,this.element.appendChild(this._root.element),this.disposable.value=this._root.onDidChange(i=>{this._onDidChange.fire(i)})}normalize(){if(!this._root||this._root.children.length!==1)return;let e=this.root,t=e.children[0];if(t instanceof Ee)return;e.element.remove();let i=e.removeChild(0);e.dispose(),i.dispose(),this._root=Or(t,t.size,t.orthogonalSize),this.element.appendChild(this._root.element),this.disposable.value=this._root.onDidChange(n=>{this._onDidChange.fire(n)})}insertOrthogonalSplitviewAtRoot(){if(!this._root)return;let e=this.root;if(e.element.remove(),this._root=new ze(st(e.orientation),this.proportionalLayout,this.styles,this.root.orthogonalSize,this.root.size,this.locked,this.margin),e.children.length!==0)if(e.children.length===1){let t=e.children[0];e.removeChild(0).dispose(),e.dispose(),this._root.addChild(ro(t,t.orthogonalSize,t.size),Ce.Distribute,0)}else this._root.addChild(e,Ce.Distribute,0);this.element.appendChild(this._root.element),this.disposable.value=this._root.onDidChange(t=>{this._onDidChange.fire(t)})}next(e){return this.progmaticSelect(e)}previous(e){return this.progmaticSelect(e,!0)}getView(e){let t=e?this.getNode(e)[1]:this.root;return this._getViews(t,this.orientation)}_getViews(e,t,i){let n={height:e.height,width:e.width};if(e instanceof Ee)return{box:n,view:e.view,cachedVisibleSize:i};let s=[];for(let l=0;l<e.children.length;l++){let u=e.children[l],p=e.getChildCachedVisibleSize(l);s.push(this._getViews(u,st(t),p))}return{box:n,children:s,cachedVisibleSize:i}}progmaticSelect(e,t=!1){let[i,n]=this.getNode(e);if(!(n instanceof Ee))throw new TypeError("invalid location");for(let s=i.length-1;s>-1;s--){let l=i[s],u=e[s]||0;if(t?u-1>-1:u+1<l.children.length)return no(l.children[t?u-1:u+1],t)}return no(this.root,t)}get proportionalLayout(){return this.root.proportionalLayout}set proportionalLayout(e){this.root.proportionalLayout=e}constructor(e,t,i,n,s){this.styles=t,this._locked=!1,this._margin=0,this._maximizedNode=void 0,this.disposable=new S,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._onDidViewVisibilityChange=new G,this.onDidViewVisibilityChange=this._onDidViewVisibilityChange.event,this._onDidMaximizedNodeChange=new G,this.onDidMaximizedNodeChange=this._onDidMaximizedNodeChange.event,this.element=document.createElement("div"),this.element.className="dv-grid-view",this._locked=n??!1,this._margin=s??0,this.root=new ze(i,e,t,0,0,this.locked,this.margin)}isViewVisible(e){let[t,i]=ot(e),[,n]=this.getNode(t);if(!(n instanceof ze))throw new TypeError("Invalid from location");return n.isChildVisible(i)}setViewVisible(e,t){this.hasMaximizedView()&&this.exitMaximizedView();let[i,n]=ot(e),[,s]=this.getNode(i);if(!(s instanceof ze))throw new TypeError("Invalid from location");this._onDidViewVisibilityChange.fire(),s.setChildVisible(n,t)}moveView(e,t,i){this.hasMaximizedView()&&this.exitMaximizedView();let[,n]=this.getNode(e);if(!(n instanceof ze))throw new TypeError("Invalid location");n.moveChild(t,i)}addView(e,t,i){this.hasMaximizedView()&&this.exitMaximizedView();let[n,s]=ot(i),[l,u]=this.getNode(n);if(u instanceof ze){let p=new Ee(e,st(u.orientation),u.orthogonalSize);u.addChild(p,t,s)}else{let[p,...g]=[...l].reverse(),[f,...b]=[...n].reverse(),_=0,y=p.getChildCachedVisibleSize(f);typeof y=="number"&&(_=Ce.Invisible(y)),p.removeChild(f).dispose();let D=new ze(u.orientation,this.proportionalLayout,this.styles,u.size,u.orthogonalSize,this.locked,this.margin);p.addChild(D,u.size,f);let k=new Ee(u.view,p.orientation,u.size);D.addChild(k,_,0),typeof t!="number"&&t.type==="split"&&(t={type:"split",index:0});let C=new Ee(e,p.orientation,u.size);D.addChild(C,t,s)}}remove(e,t){let i=xe(e.element);return this.removeView(i,t)}removeView(e,t){this.hasMaximizedView()&&this.exitMaximizedView();let[i,n]=ot(e),[s,l]=this.getNode(i);if(!(l instanceof ze))throw new TypeError("Invalid location");let u=l.children[n];if(!(u instanceof Ee))throw new TypeError("Invalid location");if(l.removeChild(n,t),u.dispose(),l.children.length!==1)return u.view;let p=l.children[0];if(s.length===0)return p instanceof Ee||(l.removeChild(0,t),this.root=p),u.view;let[g,...f]=[...s].reverse(),[b,..._]=[...i].reverse(),y=l.isChildVisible(0);l.removeChild(0,t);let D=g.children.map((k,C)=>g.getChildSize(C));if(g.removeChild(b,t).dispose(),p instanceof ze){D.splice(b,1,...p.children.map(k=>k.size));for(let k=0;k<p.children.length;k++){let C=p.children[k],T=oo(p,k,C.size);g.addChild(C,!y&&typeof T=="number"?Ce.Invisible(T):T,b+k)}for(;p.children.length>0;)p.removeChild(0)}else{let k=new Ee(p.view,st(p.orientation),p.size),C=y?p.orthogonalSize:Ce.Invisible(p.orthogonalSize);g.addChild(k,C,b)}p.dispose();for(let k=0;k<D.length;k++)g.resizeChild(k,D[k]);return u.view}layout(e,t){let[i,n]=this.root.orientation==="HORIZONTAL"?[t,e]:[e,t];this.root.layout(i,n)}getNode(e,t=this.root,i=[]){if(e.length===0)return[i,t];if(!(t instanceof ze))throw new TypeError("Invalid location");let[n,...s]=e;if(n<0||n>=t.children.length)throw new Error("Invalid location");let l=t.children[n];return i.push(t),this.getNode(s,l,i)}};let jl=Object.keys({disableAutoResizing:void 0,proportionalLayout:void 0,orientation:void 0,hideBorders:void 0,className:void 0});var co=class extends x{get element(){return this._element}get disableResizing(){return this._disableResizing}set disableResizing(e){this._disableResizing=e}constructor(e,t=!1){super(),this._lastWidth=-1,this._lastHeight=-1,this._disableResizing=t,this._element=e,this.addDisposables(U(this._element,i=>{if(this.isDisposed||this.disableResizing||!this._element.offsetParent||!le(this._element))return;let n=Math.round(i.contentRect.width),s=Math.round(i.contentRect.height);n===this._lastWidth&&s===this._lastHeight||(this._lastWidth=n,this._lastHeight=s,this.layout(n,s))}))}layoutFromElement(){if(this.disableResizing||!this._element.offsetParent||!le(this._element))return;let e=Math.round(this._element.clientWidth),t=Math.round(this._element.clientHeight);e===0||t===0||this.layout(e,t)}};let Kl=io();function vi(e){switch(e){case"left":return"left";case"right":return"right";case"above":return"top";case"below":return"bottom";default:return"center"}}var ho=class extends co{get id(){return this._id}get size(){return this._groups.size}get groups(){return Array.from(this._groups.values()).map(e=>e.value)}get width(){return this.gridview.width}get height(){return this.gridview.height}get minimumHeight(){return this.gridview.minimumHeight}get maximumHeight(){return this.gridview.maximumHeight}get minimumWidth(){return this.gridview.minimumWidth}get maximumWidth(){return this.gridview.maximumWidth}get activeGroup(){return this._activeGroup}get locked(){return this.gridview.locked}set locked(e){this.gridview.locked=e}constructor(e,t){var i;super(document.createElement("div"),t.disableAutoResizing),this._id=Kl.next(),this._groups=new Map,this._onDidRemove=new G,this.onDidRemove=this._onDidRemove.event,this._onDidAdd=new G,this.onDidAdd=this._onDidAdd.event,this._onDidMaximizedChange=new G,this.onDidMaximizedChange=this._onDidMaximizedChange.event,this._onDidActiveChange=new G,this.onDidActiveChange=this._onDidActiveChange.event,this._bufferOnDidLayoutChange=new ye,this.onDidLayoutChange=this._bufferOnDidLayoutChange.onEvent,this._onDidViewVisibilityChangeMicroTaskQueue=new ye,this.onDidViewVisibilityChangeMicroTaskQueue=this._onDidViewVisibilityChangeMicroTaskQueue.onEvent,this.element.style.height="100%",this.element.style.width="100%",this._classNames=new We(this.element),this._classNames.setClassNames((i=t.className)!==null&&i!==void 0?i:""),e.appendChild(this.element),this.gridview=new lo(!!t.proportionalLayout,t.styles,t.orientation,t.locked,t.margin),this.gridview.locked=!!t.locked,this.element.appendChild(this.gridview.element),this.layout(0,0,!0),this.addDisposables(this.gridview.onDidMaximizedNodeChange(n=>{this._onDidMaximizedChange.fire({panel:n.view,isMaximized:n.isMaximized})}),this.gridview.onDidViewVisibilityChange(()=>this._onDidViewVisibilityChangeMicroTaskQueue.fire()),this.onDidViewVisibilityChangeMicroTaskQueue(()=>{this.forceRelayout()}),w.from(()=>{this.element.remove()}),this.gridview.onDidChange(()=>{this._bufferOnDidLayoutChange.fire()}),P.any(this.onDidAdd,this.onDidRemove,this.onDidActiveChange)(()=>{this._bufferOnDidLayoutChange.fire()}),this._onDidMaximizedChange,this._onDidViewVisibilityChangeMicroTaskQueue,this._bufferOnDidLayoutChange)}setVisible(e,t){this.gridview.setViewVisible(xe(e.element),t),this._bufferOnDidLayoutChange.fire()}isVisible(e){return this.gridview.isViewVisible(xe(e.element))}updateOptions(e){if("proportionalLayout"in e){var t;this.gridview.proportionalLayout=(t=e.proportionalLayout)!==null&&t!==void 0?t:!0}if(e.orientation&&(this.gridview.orientation=e.orientation),"styles"in e,"disableAutoResizing"in e){var i;this.disableResizing=(i=e.disableAutoResizing)!==null&&i!==void 0?i:!1}if("locked"in e){var n;this.locked=(n=e.locked)!==null&&n!==void 0?n:!1}if("margin"in e){var s;this.gridview.margin=(s=e.margin)!==null&&s!==void 0?s:0}if("className"in e){var l;this._classNames.setClassNames((l=e.className)!==null&&l!==void 0?l:"")}}maximizeGroup(e){this.gridview.maximizeView(e),this.doSetGroupActive(e)}isMaximizedGroup(e){return this.gridview.maximizedView()===e}exitMaximizedGroup(){this.gridview.exitMaximizedView()}hasMaximizedGroup(){return this.gridview.hasMaximizedView()}doAddGroup(e,t=[0],i,n=this.gridview){n.addView(e,i??Ce.Distribute,t),this._onDidAdd.fire(e)}doRemoveGroup(e,t){if(!this._groups.has(e.id))throw new Error("invalid operation");let i=this._groups.get(e.id),n=this.gridview.remove(e,Ce.Distribute);if(i&&!t?.skipDispose&&(i.disposable.dispose(),i.value.dispose(),this._groups.delete(e.id),this._onDidRemove.fire(e)),!t?.skipActive&&this._activeGroup===e){let s=Array.from(this._groups.values());this.doSetGroupActive(s.length>0?s[0].value:void 0)}return n}getPanel(e){var t;return(t=this._groups.get(e))===null||t===void 0?void 0:t.value}doSetGroupActive(e){this._activeGroup!==e&&(this._activeGroup&&this._activeGroup.setActive(!1),e&&e.setActive(!0),this._activeGroup=e,this._onDidActiveChange.fire(e))}removeGroup(e){this.doRemoveGroup(e)}activateNext(e){var t,i;if((t=e)!==null&&t!==void 0||(e={}),!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}let n=xe(e.group.element),s=(i=this.gridview.next(n))===null||i===void 0?void 0:i.view;this.doSetGroupActive(s)}activatePrevious(e){var t,i;if((t=e)!==null&&t!==void 0||(e={}),!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}let n=xe(e.group.element),s=(i=this.gridview.previous(n))===null||i===void 0?void 0:i.view;this.doSetGroupActive(s)}forceRelayout(){this.layout(this.width,this.height,!0)}layout(e,t,i){(i||e!==this.width||t!==this.height)&&(this.gridview.element.style.height=`${t}px`,this.gridview.element.style.width=`${e}px`,this.gridview.layout(e,t))}dispose(){this._onDidActiveChange.dispose(),this._onDidAdd.dispose(),this._onDidRemove.dispose();for(let e of this.groups)e.dispose();this.gridview.dispose(),super.dispose()}};function gi(e){"@babel/helpers - typeof";return gi=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},gi(e)}function Jl(e,t){if(gi(e)!="object"||!e)return e;var i=e[Symbol.toPrimitive];if(i!==void 0){var n=i.call(e,t||"default");if(gi(n)!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Xl(e){var t=Jl(e,"string");return gi(t)=="symbol"?t:t+""}function Zl(e,t,i){return(t=Xl(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function Nr(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(s){return Object.getOwnPropertyDescriptor(e,s).enumerable})),i.push.apply(i,n)}return i}function j(e){for(var t=1;t<arguments.length;t++){var i=arguments[t]!=null?arguments[t]:{};t%2?Nr(Object(i),!0).forEach(function(n){Zl(e,n,i[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):Nr(Object(i)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(i,n))})}return e}function Ql(e,t){return e==="center"?`Tab into ${t}`:`Split ${e} of ${t}`}function ec(e,t){return e==="center"?`docked into ${t}`:`split ${e} of ${t}`}let Hi={panelOpened:e=>`${e} opened`,panelClosed:e=>`${e} closed`,groupMaximized:e=>`${e} maximized`,groupRestored:e=>`${e} restored`,groupFloated:e=>`${e} floated`,groupDocked:e=>`${e} docked`,groupPoppedOut:e=>`${e} opened in a new window`,closeTab:e=>`Close ${e}`,closeTabPlain:()=>"Close",movePickTarget:(e,t,i,n)=>`Moving ${e}. Target ${t}, ${i} of ${n}. Enter to choose where, Escape to cancel.`,movePickEdge:(e,t)=>`${Ql(e,t)}. Arrows to change, Enter to confirm, Escape to go back.`,moveCommitted:(e,t,i)=>`${e} ${ec(i,t)}.`,moveCancelled:()=>"Move cancelled.",moveNotAllowed:()=>"That move is not allowed.",moveFloated:e=>`${e} floated.`};function uo(e){return e?j(j({},Hi),e):Hi}var Vr=class{get minimumSize(){return this.component.minimumSize}get maximumSize(){return this.component.maximumSize}get width(){return this.component.width}get height(){return this.component.height}get length(){return this.component.length}get orientation(){return this.component.orientation}get panels(){return this.component.panels}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidAddView(){return this.component.onDidAddView}get onDidRemoveView(){return this.component.onDidRemoveView}constructor(e){this.component=e}removePanel(e,t){this.component.removePanel(e,t)}focus(){this.component.focus()}getPanel(e){return this.component.getPanel(e)}layout(e,t){return this.component.layout(e,t)}addPanel(e){return this.component.addPanel(e)}movePanel(e,t){this.component.movePanel(e,t)}fromJSON(e){this.component.fromJSON(e)}toJSON(){return this.component.toJSON()}clear(){this.component.clear()}updateOptions(e){this.component.updateOptions(e)}dispose(){this.component.dispose()}},Kt=class{get minimumSize(){return this.component.minimumSize}get maximumSize(){return this.component.maximumSize}get width(){return this.component.width}get height(){return this.component.height}get panels(){return this.component.panels}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get onDidAddView(){return this.component.onDidAddView}get onDidRemoveView(){return this.component.onDidRemoveView}get onDidDrop(){return this.component.onDidDrop}get onUnhandledDragOver(){return this.component.onUnhandledDragOver}constructor(e){this.component=e}removePanel(e){this.component.removePanel(e)}getPanel(e){return this.component.getPanel(e)}movePanel(e,t){this.component.movePanel(e,t)}focus(){this.component.focus()}layout(e,t){this.component.layout(e,t)}addPanel(e){return this.component.addPanel(e)}fromJSON(e){this.component.fromJSON(e)}toJSON(){return this.component.toJSON()}clear(){this.component.clear()}updateOptions(e){this.component.updateOptions(e)}dispose(){this.component.dispose()}},Wr=class{get width(){return this.component.width}get height(){return this.component.height}get minimumHeight(){return this.component.minimumHeight}get maximumHeight(){return this.component.maximumHeight}get minimumWidth(){return this.component.minimumWidth}get maximumWidth(){return this.component.maximumWidth}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidAddPanel(){return this.component.onDidAddGroup}get onDidRemovePanel(){return this.component.onDidRemoveGroup}get onDidActivePanelChange(){return this.component.onDidActiveGroupChange}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get panels(){return this.component.groups}get orientation(){return this.component.orientation}set orientation(e){this.component.updateOptions({orientation:e})}constructor(e){this.component=e}focus(){this.component.focus()}layout(e,t,i=!1){this.component.layout(e,t,i)}addPanel(e){return this.component.addPanel(e)}removePanel(e,t){this.component.removePanel(e,t)}movePanel(e,t){this.component.movePanel(e,t)}getPanel(e){return this.component.getPanel(e)}fromJSON(e){return this.component.fromJSON(e)}toJSON(){return this.component.toJSON()}clear(){this.component.clear()}updateOptions(e){this.component.updateOptions(e)}dispose(){this.component.dispose()}},Bi=class{get id(){return this.component.id}get width(){return this.component.width}get height(){return this.component.height}get minimumHeight(){return this.component.minimumHeight}get maximumHeight(){return this.component.maximumHeight}get minimumWidth(){return this.component.minimumWidth}get maximumWidth(){return this.component.maximumWidth}get size(){return this.component.size}get tabGroupColors(){return this.component.tabGroupColorPalette.entries()}get totalPanels(){return this.component.totalPanels}get onDidActiveGroupChange(){return this.component.onDidActiveGroupChange}get onDidAddGroup(){return this.component.onDidAddGroup}get onDidRemoveGroup(){return this.component.onDidRemoveGroup}get onDidActivePanelChange(){return this.component.onDidActivePanelChange}get onDidPanelPinnedChange(){return this.component.onDidPanelPinnedChange}get onDidAddPanel(){return this.component.onDidAddPanel}get onDidRemovePanel(){return this.component.onDidRemovePanel}get onDidMovePanel(){return this.component.onDidMovePanel}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidDrop(){return this.component.onDidDrop}get onWillDrop(){return this.component.onWillDrop}get onWillMutateLayout(){return this.component.onWillMutateLayout}get onDidMutateLayout(){return this.component.onDidMutateLayout}get onWillShowOverlay(){return this.component.onWillShowOverlay}get onWillDragGroup(){return this.component.onWillDragGroup}get onWillDragPanel(){return this.component.onWillDragPanel}get onUnhandledDragOver(){return this.component.onUnhandledDragOver}get dndCapabilities(){return this.component.dndCapabilities}get onDidPopoutGroupSizeChange(){return this.component.onDidPopoutGroupSizeChange}get onDidPopoutGroupPositionChange(){return this.component.onDidPopoutGroupPositionChange}get onDidAddPopoutGroup(){return this.component.onDidAddPopoutGroup}get onDidRemovePopoutGroup(){return this.component.onDidRemovePopoutGroup}get onDidOpenPopoutWindowFail(){return this.component.onDidOpenPopoutWindowFail}get onWillClosePopoutWindow(){return this.component.onWillClosePopoutWindow}getPopouts(){return this.component.getPopouts()}get onDidCreateTabGroup(){return this.component.onDidCreateTabGroup}get onDidDestroyTabGroup(){return this.component.onDidDestroyTabGroup}get onDidAddPanelToTabGroup(){return this.component.onDidAddPanelToTabGroup}get onDidRemovePanelFromTabGroup(){return this.component.onDidRemovePanelFromTabGroup}get onDidTabGroupChange(){return this.component.onDidTabGroupChange}get onDidTabGroupCollapsedChange(){return this.component.onDidTabGroupCollapsedChange}get panels(){return this.component.panels}get groups(){return this.component.groups}adjacentGroupInDirection(e,t){return this.component.adjacentGroupInDirection(e,t)}get activePanel(){return this.component.activePanel}get activeGroup(){return this.component.activeGroup}get messages(){return uo(this.component.options.messages)}constructor(e){this.component=e}focus(){this.component.focus()}getPanel(e){return this.component.getGroupPanel(e)}layout(e,t,i=!1){this.component.layout(e,t,i)}addPanel(e){return this.component.withOrigin("api",()=>this.component.addPanel(e))}removePanel(e,t){this.component.withOrigin("api",()=>this.component.removePanel(e,t))}addGroup(e){return this.component.withOrigin("api",()=>this.component.addGroup(e))}closeAllGroups(){return this.component.withOrigin("api",()=>this.component.closeAllGroups())}removeGroup(e){this.component.withOrigin("api",()=>this.component.removeGroup(e))}getGroup(e){return this.component.getPanel(e)}addFloatingGroup(e,t){return this.component.withOrigin("api",()=>this.component.addFloatingGroup(e,t))}fromJSON(e,t){this.component.withOrigin("api",()=>this.component.fromJSON(e,t))}toJSON(){return this.component.toJSON()}clear(){this.component.withOrigin("api",()=>this.component.clear())}undo(){this.component.undo()}redo(){this.component.redo()}get canUndo(){return this.component.canUndo}get canRedo(){return this.component.canRedo}clearHistory(){this.component.clearHistory()}get onDidChangeHistory(){return this.component.onDidChangeHistory}get smartGuidesEnabled(){return this.component.smartGuidesEnabled}setSmartGuidesEnabled(e){this.component.setSmartGuidesEnabled(e)}updateSmartGuidesOptions(e){this.component.updateSmartGuidesOptions(e)}get onDidSnapFloat(){return this.component.onDidSnapFloat}get onDidSnapTogether(){return this.component.onDidSnapTogether}get popoutRestorationPromise(){return this.component.popoutRestorationPromise}activateNext(e){this.component.activateNext(e)}activatePrevious(e){this.component.activatePrevious(e)}moveToNext(e){this.activateNext(e)}moveToPrevious(e){this.activatePrevious(e)}maximizeGroup(e){this.component.withOrigin("api",()=>this.component.maximizeGroup(e.group))}hasMaximizedGroup(){return this.component.hasMaximizedGroup()}exitMaximizedGroup(){this.component.withOrigin("api",()=>this.component.exitMaximizedGroup())}get onDidMaximizedGroupChange(){return this.component.onDidMaximizedGroupChange}addPopoutGroup(e,t){return this.component.withOrigin("api",()=>this.component.addPopoutGroup(e,t))}addEdgeGroup(e,t){return this.component.addEdgeGroup(e,t)}revealEdgeGroupWithData(e,t,i){this.component.revealEdgeGroupWithData(e,t,i)}getEdgeGroup(e){return this.component.getEdgeGroup(e)}setEdgeGroupVisible(e,t){this.component.setEdgeGroupVisible(e,t)}isEdgeGroupVisible(e){return this.component.isEdgeGroupVisible(e)}removeEdgeGroup(e){this.component.removeEdgeGroup(e)}pinEdgeGroup(e){this.component.pinEdgeGroup(e)}autoHideEdgeGroup(e){this.component.autoHideEdgeGroup(e)}peekEdgeGroup(e,t){this.component.peekEdgeGroup(e,t)}updateOptions(e){this.component.updateOptions(e)}_getGroupModel(e){let t=this.component.getPanel(e);if(!t)throw new Error(`dockview: group '${e}' not found`);return t.model}createTabGroup(e){let t=this._getGroupModel(e.groupId);return this.component.withOrigin("api",()=>t.createTabGroup({label:e.label,color:e.color,componentParams:e.componentParams}))}dissolveTabGroup(e){let t=this._getGroupModel(e.groupId);this.component.withOrigin("api",()=>t.dissolveTabGroup(e.tabGroupId))}addPanelToTabGroup(e){let t=this._getGroupModel(e.groupId);this.component.withOrigin("api",()=>t.addPanelToTabGroup(e.tabGroupId,e.panelId,e.index))}removePanelFromTabGroup(e){let t=this._getGroupModel(e.groupId);this.component.withOrigin("api",()=>t.removePanelFromTabGroup(e.panelId))}getTabGroups(e){return this._getGroupModel(e.groupId).getTabGroups()}getTabGroupForPanel(e){return this._getGroupModel(e.groupId).getTabGroupForPanel(e.panelId)}moveTabGroup(e){this._getGroupModel(e.groupId).moveTabGroup(e.tabGroupId,e.index)}dispose(){this.component.dispose()}},Hr=class extends x{constructor(e,t){super(),this.element=e,this.callbacks=t,this.target=null,this.registerListeners()}onDragEnter(e){this.target=e.target,this.callbacks.onDragEnter(e)}onDragOver(e){e.preventDefault(),this.callbacks.onDragOver&&this.callbacks.onDragOver(e)}onDragLeave(e){this.target===e.target&&(this.target=null,this.callbacks.onDragLeave(e))}onDragEnd(e){this.target=null,this.callbacks.onDragEnd(e)}onDrop(e){this.callbacks.onDrop(e)}registerListeners(){this.addDisposables(O(this.element,"dragenter",e=>{this.onDragEnter(e)},!0)),this.addDisposables(O(this.element,"dragover",e=>{this.onDragOver(e)},!0)),this.addDisposables(O(this.element,"dragleave",e=>{this.onDragLeave(e)})),this.addDisposables(O(this.element,"dragend",e=>{this.onDragEnd(e)})),this.addDisposables(O(this.element,"drop",e=>{this.onDrop(e)}))}};let tc={value:50,type:"percentage"},ic=100,nc=100;function po(){let e=document.createElement("div");e.className="dv-drop-target-dropzone";let t=document.createElement("div");return t.className="dv-drop-target-selection",e.appendChild(t),{dropzone:e,selection:t}}function Br(e,t,i,n){var s,l,u;let p=(s=n?.smallWidthBoundary)!==null&&s!==void 0?s:ic,g=(l=n?.smallHeightBoundary)!==null&&l!==void 0?l:nc,f=t<p,b=i<g,_=e==="left",y=e==="right",D=e==="top",k=e==="bottom",C=!f&&y,T=!f&&_,M=!b&&D,I=!b&&k,E=1,$=(u=n?.size)!==null&&u!==void 0?u:tc;return $.type==="percentage"?E=De($.value,0,100)/100:((C||T)&&(E=De(0,$.value,t)/t),(M||I)&&(E=De(0,$.value,i)/i)),{isSmallX:f,isSmallY:b,isLeft:_,isRight:y,isTop:D,isBottom:k,rightClass:C,leftClass:T,topClass:M,bottomClass:I,size:E}}function Fr(e,t,i,n,s){let l=Br(t,i,n,s),{rightClass:u,leftClass:p,topClass:g,bottomClass:f,size:b}=l,_={top:"0px",left:"0px",width:"100%",height:"100%"};u?(_.left=`${100*(1-b)}%`,_.width=`${100*b}%`):p?_.width=`${100*b}%`:g?_.height=`${100*b}%`:f&&(_.top=`${100*(1-b)}%`,_.height=`${100*b}%`),l.isSmallX&&l.isLeft&&(_.width="4px"),l.isSmallX&&l.isRight&&(_.left=`${i-4}px`,_.width="4px"),l.isSmallY&&l.isTop&&(_.height="4px"),l.isSmallY&&l.isBottom&&(_.top=`${n-4}px`,_.height="4px"),e.style.top=_.top,e.style.left=_.left,e.style.width=_.width,e.style.height=_.height,e.style.visibility="visible",(!e.style.transform||e.style.transform==="")&&(e.style.transform="translate3d(0, 0, 0)");let y=l.isSmallX&&(l.isLeft||l.isRight)||l.isSmallY&&(l.isTop||l.isBottom);A(e,"dv-drop-target-small-vertical",l.isSmallY),A(e,"dv-drop-target-small-horizontal",l.isSmallX),A(e,"dv-drop-target-selection-line",y),A(e,"dv-drop-target-left",l.isLeft),A(e,"dv-drop-target-right",l.isRight),A(e,"dv-drop-target-top",l.isTop),A(e,"dv-drop-target-bottom",l.isBottom),A(e,"dv-drop-target-center",t==="center")}function oc(e,t){let i=`${Math.round(t.top)}px`,n=`${Math.round(t.left)}px`,s=`${Math.round(t.width)}px`,l=`${Math.round(t.height)}px`;return e.style.top!==i||e.style.left!==n||e.style.width!==s||e.style.height!==l}function rc(e,t){e.style.top=`${Math.round(t.top)}px`,e.style.left=`${Math.round(t.left)}px`,e.style.width=`${Math.round(t.width)}px`,e.style.height=`${Math.round(t.height)}px`,e.style.visibility="visible",(!e.style.transform||e.style.transform==="")&&(e.style.transform="translate3d(0, 0, 0)")}function Ur(e){let t=Br(e.quadrant,e.width,e.height,e.overlayModel),{rightClass:i,leftClass:n,topClass:s,bottomClass:l,size:u}=t,p=e.outlineElement.getBoundingClientRect(),g=e.targetModel.getElements(void 0,e.outlineElement),f=g.root,b=g.overlay,_=f.getBoundingClientRect(),y=p.top-_.top,D=p.left-_.left,k={top:y,left:D,width:e.width,height:e.height};return i?(k.left=D+e.width*(1-u),k.width=e.width*u):n?k.width=e.width*u:s?k.height=e.height*u:l&&(k.top=y+e.height*(1-u),k.height=e.height*u),t.isSmallX&&t.isLeft&&(k.width=4),t.isSmallX&&t.isRight&&(k.left=D+e.width-4,k.width=4),t.isSmallY&&t.isTop&&(k.height=4),t.isSmallY&&t.isBottom&&(k.top=y+e.height-4,k.height=4),oc(b,k)?(rc(b,k),b.className=`dv-drop-target-anchor${e.className?` ${e.className}`:""}`,A(b,"dv-drop-target-left",t.isLeft),A(b,"dv-drop-target-right",t.isRight),A(b,"dv-drop-target-top",t.isTop),A(b,"dv-drop-target-bottom",t.isBottom),A(b,"dv-drop-target-anchor-line",t.isSmallX&&(t.isLeft||t.isRight)||t.isSmallY&&(t.isTop||t.isBottom)),A(b,"dv-drop-target-center",e.quadrant==="center"),g.changed&&(A(b,"dv-drop-target-anchor-container-changed",!0),setTimeout(()=>{A(b,"dv-drop-target-anchor-container-changed",!1)},10)),{boundsChanged:!0,targetChanged:g.changed}):{boundsChanged:!1,targetChanged:g.changed}}var Yr=class extends z{get nativeEvent(){return this.options.nativeEvent}get position(){return this.options.position}get edge(){return!!this.options.edge}get edgeGroup(){return!!this.options.edgeGroup}constructor(e){super(),this.options=e}};function vo(e){switch(e){case"above":return"top";case"below":return"bottom";case"left":return"left";case"right":return"right";case"within":return"center";default:throw new Error(`invalid direction '${e}'`)}}function qr(e){switch(e){case"top":return"above";case"bottom":return"below";case"left":return"left";case"right":return"right";case"center":return"within";default:throw new Error(`invalid position '${e}'`)}}let sc={value:20,type:"percentage"};var go=class Mi extends x{get disabled(){return this._disabled}set disabled(t){this._disabled=t}get state(){return this._state}constructor(t,i){super(),this.element=t,this.options=i,this._edge=!1,this._onDrop=new G,this.onDrop=this._onDrop.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._disabled=!1,this._acceptedTargetZonesSet=new Set(this.options.acceptedTargetZones),this.dnd=new Hr(this.element,{onDragEnter:()=>{var n,s;(n=(s=this.options).getOverrideTarget)===null||n===void 0||(n=n.call(s))===null||n===void 0||n.getElements()},onDragOver:n=>{var s,l,u,p,g,f,b;if(this._disabled){this.clearOwnOverlay();return}Mi.ACTUAL_TARGET=this;let _=(s=(l=this.options).getOverrideTarget)===null||s===void 0?void 0:s.call(l);if(this._acceptedTargetZonesSet.size===0){this.clearOwnOverlay();return}let y=(u=(p=(g=this.options).getOverlayOutline)===null||p===void 0?void 0:p.call(g))!==null&&u!==void 0?u:this.element,D=y.offsetWidth,k=y.offsetHeight;if(D===0||k===0)return;let C=y.getBoundingClientRect(),T=((f=n.clientX)!==null&&f!==void 0?f:0)-C.left,M=((b=n.clientY)!==null&&b!==void 0?b:0)-C.top,I=this.resolvePosition(T,M,D,k,n);if(this.isAlreadyUsed(n)){this.removeDropTarget();return}if(I===null){this.clearOwnOverlay();return}let E=I.position;if(!this.options.canDisplayOverlay(n,E)){this.clearOwnOverlay();return}let $=new Yr({nativeEvent:n,position:E,edge:I.edge,edgeGroup:I.edgeGroup});if(this._onWillShowOverlay.fire($),$.defaultPrevented){this.clearOwnOverlay();return}if(this.markAsUsed(n),I.edge){this.clearOwnOverlay(),this._state=E,this._edge=!0;return}if(this._edge=!1,!_){if(!this.targetElement){let X=po();this.targetElement=X.dropzone,this.overlayElement=X.selection,this._state="center",y.classList.add("dv-drop-target"),y.append(this.targetElement)}}this.toggleClasses(E,D,k),this._state=E},onDragLeave:()=>{var n,s;let l=(n=(s=this.options).getOverrideTarget)===null||n===void 0?void 0:n.call(s);if(l){var u;this._state=void 0,this._edge=!1,(u=l.scheduleClear)===null||u===void 0||u.call(l);return}this.removeDropTarget()},onDragEnd:n=>{var s,l;let u=(s=(l=this.options).getOverrideTarget)===null||s===void 0?void 0:s.call(l);u&&Mi.ACTUAL_TARGET===this&&this._state&&(n.stopPropagation(),this._onDrop.fire({position:this._state,nativeEvent:n,edge:this._edge})),this.removeDropTarget(),u?.clear()},onDrop:n=>{var s,l;n.preventDefault();let u=this._state,p=this._edge;this.removeDropTarget(),(s=(l=this.options).getOverrideTarget)===null||s===void 0||(s=s.call(l))===null||s===void 0||s.clear(),u&&(n.stopPropagation(),this._onDrop.fire({position:u,nativeEvent:n,edge:p}))}}),this.addDisposables(this._onDrop,this._onWillShowOverlay,this.dnd)}setTargetZones(t){this._acceptedTargetZonesSet=new Set(t)}setOverlayModel(t){this.options.overlayModel=t}dispose(){this.removeDropTarget(),super.dispose()}markAsUsed(t){t[Mi.USED_EVENT_ID]=!0}isAlreadyUsed(t){let i=t[Mi.USED_EVENT_ID];return typeof i=="boolean"&&i}toggleClasses(t,i,n){var s,l;let u=(s=(l=this.options).getOverrideTarget)===null||s===void 0?void 0:s.call(l);if(u){var p,g,f;Ur({outlineElement:(p=(g=(f=this.options).getOverlayOutline)===null||g===void 0?void 0:g.call(f))!==null&&p!==void 0?p:this.element,targetModel:u,quadrant:t,width:i,height:n,overlayModel:this.options.overlayModel,className:this.options.className});return}this.overlayElement&&Fr(this.overlayElement,t,i,n,this.options.overlayModel)}resolvePosition(t,i,n,s,l){var u,p;let g=(u=(p=this.options).getPositionResolver)===null||u===void 0?void 0:u.call(p);if(g){let b=g.resolve({x:t,y:i,width:n,height:s,zones:this._acceptedTargetZonesSet,event:l});return b?{position:b.position,edge:!!b.edge,edgeGroup:!!b.edgeGroup}:null}let f=this.calculateQuadrant(this._acceptedTargetZonesSet,t,i,n,s);return f?{position:f,edge:!1,edgeGroup:!1}:null}calculateQuadrant(t,i,n,s,l){var u,p;let g=(u=(p=this.options.overlayModel)===null||p===void 0?void 0:p.activationSize)!==null&&u!==void 0?u:sc;return g.type==="percentage"?jr(t,i,n,s,l,g.value):Kr(t,i,n,s,l,g.value)}clearOwnOverlay(){let t=this._state!==void 0;if(this.removeDropTarget(),t){var i,n;(i=(n=this.options).getOverrideTarget)===null||i===void 0||(i=i.call(n))===null||i===void 0||i.clear()}}removeDropTarget(){if(this._state=void 0,this._edge=!1,this.targetElement){var t;(t=this.targetElement.parentElement)===null||t===void 0||t.classList.remove("dv-drop-target"),this.targetElement.remove(),this.targetElement=void 0,this.overlayElement=void 0}}showOverlay(t){var i,n,s,l,u;let p=(i=(n=this.options).getOverrideTarget)===null||i===void 0?void 0:i.call(n),g=(s=(l=(u=this.options).getOverlayOutline)===null||l===void 0?void 0:l.call(u))!==null&&s!==void 0?s:this.element,f=g.offsetWidth,b=g.offsetHeight;if(!p&&!this.targetElement){let _=po();this.targetElement=_.dropzone,this.overlayElement=_.selection,g.classList.add("dv-drop-target"),g.append(this.targetElement)}this.toggleClasses(t,f,b),this._state=t}clearOverlay(){var t,i;this.removeDropTarget(),(t=(i=this.options).getOverrideTarget)===null||t===void 0||(t=t.call(i))===null||t===void 0||t.clear(),this._state=void 0}};go.USED_EVENT_ID="__dockview_droptarget_event_is_used__";function jr(e,t,i,n,s,l){let u=100*t/n,p=100*i/s;return e.has("left")&&u<l?"left":e.has("right")&&u>100-l?"right":e.has("top")&&p<l?"top":e.has("bottom")&&p>100-l?"bottom":e.has("center")?"center":null}function Kr(e,t,i,n,s,l){return e.has("left")&&t<l?"left":e.has("right")&&t>n-l?"right":e.has("top")&&i<l?"top":e.has("bottom")&&i>s-l?"bottom":e.has("center")?"center":null}function ac(e,t,i){var n,s,l;J(t,"dv-dragged"),t.style.top="-9999px",t.style.position="absolute",(i?.owner?Ar(i.owner):((n=i?.ownerDocument)!==null&&n!==void 0?n:document).body).appendChild(t),e.setDragImage(t,(s=i?.x)!==null&&s!==void 0?s:0,(l=i?.y)!==null&&l!==void 0?l:0),setTimeout(()=>{F(t,"dv-dragged"),t.remove()},0)}var Fi=class Li extends x{static getInstance(){var t;return(t=Li._instance)!==null&&t!==void 0||(Li._instance=new Li),Li._instance}constructor(){super(),this._targets=new Set,this._targetByElement=new Map,this._onDragStart=new G,this.onDragStart=this._onDragStart.event,this._onDragMove=new G,this.onDragMove=this._onDragMove.event,this._onDragEnd=new G,this.onDragEnd=this._onDragEnd.event,this.addDisposables(this._onDragStart,this._onDragMove,this._onDragEnd)}get active(){return this._active}registerTarget(t){return this._targets.add(t),this._targetByElement.set(t.element,t),{dispose:()=>{this._targets.delete(t),this._targetByElement.get(t.element)===t&&this._targetByElement.delete(t.element),this._currentTarget===t&&(this._currentTarget=void 0)}}}beginDrag(t){var i,n,s,l;this._active&&this.cancel();let{pointerEvent:u,source:p}=t,g=t.getData();this._active={pointerId:u.pointerId,startX:u.clientX,startY:u.clientY,source:p},this._lastPointerEvent=u,this._onDragMoveCallback=t.onDragMove,this._onDragEndCallback=t.onDragEnd,this._dataDisposable=g,this._ghost=t.ghost,this._iframeShield=ge((i=p.ownerDocument)!==null&&i!==void 0?i:document),this._selectionShield=Se((n=p.ownerDocument)!==null&&n!==void 0?n:document);let f={clientX:u.clientX,clientY:u.clientY,pointerEvent:u};this._onDragStart.fire(f);let b=(s=(l=p.ownerDocument)===null||l===void 0?void 0:l.defaultView)!==null&&s!==void 0?s:globalThis.window;this._moveListener=O(b,"pointermove",_=>{var y;_.pointerId===((y=this._active)===null||y===void 0?void 0:y.pointerId)&&this._handleMove(_)}),this._upListener=O(b,"pointerup",_=>{var y;_.pointerId===((y=this._active)===null||y===void 0?void 0:y.pointerId)&&this._handleEnd(_,!0)}),this._cancelListener=O(b,"pointercancel",_=>{var y;_.pointerId===((y=this._active)===null||y===void 0?void 0:y.pointerId)&&this._handleEnd(_,!1)})}cancel(){var t,i;if(!this._active)return;let n=this._onDragEndCallback,s=this._lastPointerEvent;if((t=this._currentTarget)===null||t===void 0||t.handleDragLeave(),this._teardown(),(i=this._dataDisposable)===null||i===void 0||i.dispose(),this._dataDisposable=void 0,s){let l={clientX:s.clientX,clientY:s.clientY,pointerEvent:s};n?.(l,!1),this._onDragEnd.fire(l)}}_findTargetUnder(t,i){let n=(this._active?pe(this._active.source):document).elementsFromPoint(t,i);for(let l of n){let u=l;for(;u;){var s;let p=this._targetByElement.get(u);if(p&&!(!((s=p.isHitTestTransparent)===null||s===void 0)&&s.call(p)))return p;u=u.parentElement}}}_handleMove(t){var i,n;this._lastPointerEvent=t,(i=this._ghost)===null||i===void 0||i.update(t.clientX,t.clientY);let s={clientX:t.clientX,clientY:t.clientY,pointerEvent:t},l=this._findTargetUnder(t.clientX,t.clientY);if(l!==this._currentTarget){var u;(u=this._currentTarget)===null||u===void 0||u.handleDragLeave(),this._currentTarget=l}l&&l.handleDragOver(s),(n=this._onDragMoveCallback)===null||n===void 0||n.call(this,s),this._onDragMove.fire(s)}_handleEnd(t,i){let n={clientX:t.clientX,clientY:t.clientY,pointerEvent:t};if(i&&this._currentTarget)this._currentTarget.handleDrop(n);else{var s;(s=this._currentTarget)===null||s===void 0||s.handleDragLeave()}let l=this._onDragEndCallback,u=this._dataDisposable;this._teardown(),this._dataDisposable=void 0,setTimeout(()=>u?.dispose(),0),l?.(n,i),this._onDragEnd.fire(n)}_teardown(){var t,i,n,s,l,u;this._currentTarget=void 0,this._active=void 0,this._lastPointerEvent=void 0,this._onDragMoveCallback=void 0,this._onDragEndCallback=void 0,(t=this._ghost)===null||t===void 0||t.dispose(),this._ghost=void 0,(i=this._iframeShield)===null||i===void 0||i.release(),this._iframeShield=void 0,(n=this._selectionShield)===null||n===void 0||n.release(),this._selectionShield=void 0,(s=this._moveListener)===null||s===void 0||s.dispose(),(l=this._upListener)===null||l===void 0||l.dispose(),(u=this._cancelListener)===null||u===void 0||u.dispose(),this._moveListener=void 0,this._upListener=void 0,this._cancelListener=void 0}};let dc={value:20,type:"percentage"};var lc=class extends x{get disabled(){return this._disabled}set disabled(e){this._disabled=e,e&&this._removeOverlay()}get state(){return this._state}constructor(e,t){super(),this.element=e,this.options=t,this._edge=!1,this._onDrop=new G,this.onDrop=this._onDrop.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._disabled=!1,this._acceptedTargetZonesSet=new Set(t.acceptedTargetZones);let i={element:this.element,handleDragOver:n=>this._onDragOver(n),handleDragLeave:()=>this._onDragLeave(),handleDrop:n=>this._onDropEvent(n),isHitTestTransparent:t.isHitTestTransparent};this.addDisposables(this._onDrop,this._onWillShowOverlay,Fi.getInstance().registerTarget(i))}clearOverlay(){this._clearOwnOverlay()}setTargetZones(e){this._acceptedTargetZonesSet=new Set(e)}setOverlayModel(e){this.options.overlayModel=e}dispose(){this._removeOverlay(),super.dispose()}_onDragOver(e){var t,i,n,s,l;if(this._disabled){this._clearOwnOverlay();return}let u=(t=(i=this.options).getOverrideTarget)===null||t===void 0?void 0:t.call(i);if(this._acceptedTargetZonesSet.size===0){this._clearOwnOverlay();return}let p=(n=(s=(l=this.options).getOverlayOutline)===null||s===void 0?void 0:s.call(l))!==null&&n!==void 0?n:this.element,g=p.offsetWidth,f=p.offsetHeight;if(g===0||f===0)return;let b=p.getBoundingClientRect(),_=e.clientX-b.left,y=e.clientY-b.top,D=this._resolvePosition(_,y,g,f,e.pointerEvent);if(D===null){this._clearOwnOverlay();return}let k=D.position;if(!this.options.canDisplayOverlay(e.pointerEvent,k)){this._clearOwnOverlay();return}let C=new Yr({nativeEvent:e.pointerEvent,position:k,edge:D.edge});if(this._onWillShowOverlay.fire(C),C.defaultPrevented){this._clearOwnOverlay();return}if(D.edge){this._clearOwnOverlay(),this._state=k,this._edge=!0;return}if(this._edge=!1,u){Ur({outlineElement:p,targetModel:u,quadrant:k,width:g,height:f,overlayModel:this.options.overlayModel,className:this.options.className}),this._state=k;return}if(!this._targetElement){let T=po();this._targetElement=T.dropzone,this._overlayElement=T.selection,this._state="center",this.element.classList.add("dv-drop-target"),this.element.append(this._targetElement)}this._overlayElement&&Fr(this._overlayElement,k,g,f,this.options.overlayModel),this._state=k}_onDragLeave(){var e,t;let i=(e=(t=this.options).getOverrideTarget)===null||e===void 0?void 0:e.call(t);if(i){this._state=void 0,i.clear();return}this._removeOverlay()}_onDropEvent(e){var t,i;let n=this._state,s=this._edge,l=(t=(i=this.options).getOverrideTarget)===null||t===void 0?void 0:t.call(i);this._removeOverlay(),l?.clear(),n&&this._onDrop.fire({position:n,nativeEvent:e.pointerEvent,edge:s})}_resolvePosition(e,t,i,n,s){var l,u;let p=(l=(u=this.options).getPositionResolver)===null||l===void 0?void 0:l.call(u);if(p){let f=p.resolve({x:e,y:t,width:i,height:n,zones:this._acceptedTargetZonesSet,event:s});return f?{position:f.position,edge:!!f.edge}:null}let g=this._calculateQuadrant(e,t,i,n);return g?{position:g,edge:!1}:null}_calculateQuadrant(e,t,i,n){var s,l;let u=(s=(l=this.options.overlayModel)===null||l===void 0?void 0:l.activationSize)!==null&&s!==void 0?s:dc;return u.type==="percentage"?jr(this._acceptedTargetZonesSet,e,t,i,n,u.value):Kr(this._acceptedTargetZonesSet,e,t,i,n,u.value)}_clearOwnOverlay(){let e=this._state!==void 0;if(this._removeOverlay(),e){var t,i;(t=(i=this.options).getOverrideTarget)===null||t===void 0||(t=t.call(i))===null||t===void 0||t.clear()}}_removeOverlay(){if(this._edge=!1,this._targetElement){var e;this._state=void 0,(e=this._targetElement.parentElement)===null||e===void 0||e.classList.remove("dv-drop-target"),this._targetElement.remove(),this._targetElement=void 0,this._overlayElement=void 0}else this._state=void 0}};let cc=5,hc=250,uc=8;var pc=class extends x{constructor(e,t){var i;super(),this.element=e,this.options=t,this._disabled=!1,this._armed=!1,this._startX=0,this._startY=0,this._touchOnly=(i=t.touchOnly)!==null&&i!==void 0?i:!0,this.addDisposables(O(this.element,"pointerdown",n=>{this._onPointerDown(n)}))}setDisabled(e){this._disabled=e,e&&this._cancelPending()}setTouchOnly(e){this._touchOnly!==e&&(this._touchOnly=e,e&&this._cancelPending())}_shouldHandle(e){var t,i;return!(this._disabled||this._touchOnly&&e.pointerType!=="touch"&&e.pointerType!=="pen"||!((t=(i=this.options).isCancelled)===null||t===void 0)&&t.call(i,e))}_onPointerDown(e){var t,i,n,s,l,u;if(!this._shouldHandle(e))return;this._cancelPending(),this._selectionShield=Se((t=this.element.ownerDocument)!==null&&t!==void 0?t:document),this._pendingPointerId=e.pointerId,this._startX=e.clientX,this._startY=e.clientY,this._startEvent=e;let p=e.pointerType==="touch"||e.pointerType==="pen",g=this.options.touchInitiationDelay,f=(i=typeof g=="function"?g():g)!==null&&i!==void 0?i:hc;this._armed=!p||f<=0,p&&f>0&&Number.isFinite(f)&&(this._armTimer=setTimeout(()=>{this._armTimer=void 0,this._armed=!0},f));let b=(n=this.options.threshold)!==null&&n!==void 0?n:cc,_=this.options.pressTolerance,y=(s=typeof _=="function"?_():_)!==null&&s!==void 0?s:uc,D=(l=(u=this.element.ownerDocument)===null||u===void 0?void 0:u.defaultView)!==null&&l!==void 0?l:globalThis.window;this._pendingMoveListener=O(D,"pointermove",k=>{if(k.pointerId!==this._pendingPointerId)return;let C=k.clientX-this._startX,T=k.clientY-this._startY,M=Math.hypot(C,T);if(this._armed){M>=b&&this._beginDrag(k);return}M>y&&this._beginDrag(k)}),this._pendingUpListener=O(D,"pointerup",k=>{k.pointerId===this._pendingPointerId&&this._cancelPending()}),this._pendingCancelListener=O(D,"pointercancel",k=>{k.pointerId===this._pendingPointerId&&this._cancelPending()})}cancelPending(){this._cancelPending()}_cancelPending(){var e,t,i,n;(e=this._selectionShield)===null||e===void 0||e.release(),this._selectionShield=void 0,this._pendingPointerId=void 0,this._armTimer!==void 0&&(clearTimeout(this._armTimer),this._armTimer=void 0),this._armed=!1,(t=this._pendingMoveListener)===null||t===void 0||t.dispose(),(i=this._pendingUpListener)===null||i===void 0||i.dispose(),(n=this._pendingCancelListener)===null||n===void 0||n.dispose(),this._pendingMoveListener=void 0,this._pendingUpListener=void 0,this._pendingCancelListener=void 0,this._startEvent=void 0}_beginDrag(e){var t,i,n,s,l;let u=(t=this._startEvent)!==null&&t!==void 0?t:e;this._cancelPending(),(i=(n=this.options).onDragStart)===null||i===void 0||i.call(n,u);let p=(s=(l=this.options).createGhost)===null||s===void 0?void 0:s.call(l,u);Fi.getInstance().beginDrag({pointerEvent:e,source:this.element,getData:()=>this.options.getData(u),ghost:p,onDragMove:this.options.onDragMove,onDragEnd:this.options.onDragEnd})}dispose(){this._cancelPending(),super.dispose()}},vc=class{constructor(e){var t,i,n,s;this._disposed=!1,this.element=e.element,this.offsetX=(t=e.offsetX)!==null&&t!==void 0?t:0,this.offsetY=(i=e.offsetY)!==null&&i!==void 0?i:0;let l=e.owner?Ar(e.owner):document.body,u;ie(l)&&typeof this.element.showPopover=="function"&&(u=this.element.ownerDocument.createElement("div"),u.popover="manual",Object.assign(u.style,{inset:"auto",margin:"0",padding:"0",border:"0",background:"transparent",color:"inherit",overflow:"visible"}),u.appendChild(this.element),this.element.style.pointerEvents="none",this.element.style.transform="none"),this.container=(n=u)!==null&&n!==void 0?n:this.element;let p=this.container.style;p.position="fixed",p.left="0px",p.top="0px",p.pointerEvents="none",p.zIndex="99999",p.opacity=String((s=e.opacity)!==null&&s!==void 0?s:.8),p.willChange="transform",p.transform=`translate3d(${e.initialX-this.offsetX}px, ${e.initialY-this.offsetY}px, 0)`,l.appendChild(this.container),u?.showPopover()}update(e,t){this._disposed||(this.container.style.transform=`translate3d(${e-this.offsetX}px, ${t-this.offsetY}px, 0)`)}dispose(){this._disposed||(this._disposed=!0,this.element.remove(),this.container!==this.element&&this.container.remove())}},gc=class extends x{constructor(e,t){super(),this.el=e,this.opts=t,this._dataDisposable=new S,this._pointerEventsDisposable=new S,this._disabled=!!t.disabled,this.addDisposables(this._dataDisposable,this._pointerEventsDisposable,O(this.el,"dragstart",i=>{var n,s,l,u,p,g,f;if(i.defaultPrevented||this._disabled||!((n=(s=this.opts).isCancelled)===null||n===void 0)&&n.call(s,i)){i.preventDefault();return}let b=ge((l=this.el.ownerDocument)!==null&&l!==void 0?l:document);this._pointerEventsDisposable.value={dispose:()=>b.release()},this.el.classList.add("dv-dragged"),setTimeout(()=>this.el.classList.remove("dv-dragged"),0),this._dataDisposable.value=this.opts.getData(i);let _=(u=(p=this.opts).createGhost)===null||u===void 0?void 0:u.call(p,i);if(_&&i.dataTransfer){var y,D,k;if(ac(i.dataTransfer,_.element,{x:(y=_.offsetX)!==null&&y!==void 0?y:0,y:(D=_.offsetY)!==null&&D!==void 0?D:0,ownerDocument:(k=this.el.ownerDocument)!==null&&k!==void 0?k:void 0,owner:this.el}),_.dispose){let C=_.dispose;setTimeout(()=>C(),0)}}i.dataTransfer&&(i.dataTransfer.effectAllowed="move",i.dataTransfer.items.length===0&&i.dataTransfer.setData("text/plain","")),(g=(f=this.opts).onDragStart)===null||g===void 0||g.call(f,i)}),O(this.el,"dragend",i=>{var n,s;this._pointerEventsDisposable.dispose(),setTimeout(()=>this._dataDisposable.dispose(),0),(n=(s=this.opts).onDragEnd)===null||n===void 0||n.call(s,i)}))}setDisabled(e){this._disabled=e}setTouchOnly(e){}cancelPending(){}},mc=class{constructor(){this.kind="html5"}createDropTarget(e,t){return new go(e,t)}createDragSource(e,t){return new gc(e,t)}},fc=class{constructor(){this.kind="pointer"}createDropTarget(e,t){return new lc(e,t)}createDragSource(e,t){let i=t.createGhost?s=>{let l=t.createGhost(s);if(!l)return;let u=new vc({element:l.element,initialX:s.clientX,initialY:s.clientY,offsetX:l.offsetX,offsetY:l.offsetY,owner:e});if(l.dispose){let p=u.dispose.bind(u),g=l.dispose;u.dispose=()=>{p(),g()}}return u}:void 0,n=new pc(e,{getData:t.getData,isCancelled:t.isCancelled,onDragStart:t.onDragStart,onDragEnd:t.onDragEnd?s=>t.onDragEnd(s.pointerEvent):void 0,createGhost:i,touchOnly:t.touchOnly,touchInitiationDelay:t.touchInitiationDelay,pressTolerance:t.pressTolerance,threshold:t.threshold});return t.disabled&&n.setDisabled(!0),n}};let ft=new mc,at=new fc,bc=Object.keys({disableAutoResizing:void 0,disableDnd:void 0,className:void 0});var Jr=class extends L{constructor(e,t,i,n){super(),this.nativeEvent=e,this.position=t,this.getData=i,this.panel=n}},Xr=class extends z{constructor(){super()}},Zr=class extends x{get isFocused(){return this._isFocused}get isActive(){return this._isActive}get isVisible(){return this._isVisible}get width(){return this._width}get height(){return this._height}constructor(e,t){super(),this.id=e,this.component=t,this._isFocused=!1,this._isActive=!1,this._isVisible=!0,this._width=0,this._height=0,this._parameters={},this.panelUpdatesDisposable=new S,this._onDidDimensionChange=new G,this.onDidDimensionsChange=this._onDidDimensionChange.event,this._onDidChangeFocus=new G,this.onDidFocusChange=this._onDidChangeFocus.event,this._onWillFocus=new G,this.onWillFocus=this._onWillFocus.event,this._onDidVisibilityChange=new G,this.onDidVisibilityChange=this._onDidVisibilityChange.event,this._onWillVisibilityChange=new G,this.onWillVisibilityChange=this._onWillVisibilityChange.event,this._onDidActiveChange=new G,this.onDidActiveChange=this._onDidActiveChange.event,this._onActiveChange=new G,this.onActiveChange=this._onActiveChange.event,this._onDidParametersChange=new G,this.onDidParametersChange=this._onDidParametersChange.event,this.addDisposables(this.onDidFocusChange(i=>{this._isFocused=i.isFocused}),this.onDidActiveChange(i=>{this._isActive=i.isActive}),this.onDidVisibilityChange(i=>{this._isVisible=i.isVisible}),this.onDidDimensionsChange(i=>{this._width=i.width,this._height=i.height}),this.panelUpdatesDisposable,this._onDidDimensionChange,this._onDidChangeFocus,this._onDidVisibilityChange,this._onDidActiveChange,this._onWillFocus,this._onActiveChange,this._onWillFocus,this._onWillVisibilityChange,this._onDidParametersChange)}getParameters(){return this._parameters}initialize(e){this.panelUpdatesDisposable.value=this._onDidParametersChange.event(t=>{this._parameters=t,e.update({params:t})})}setVisible(e){this._onWillVisibilityChange.fire({isVisible:e})}setActive(){this._onActiveChange.fire()}updateParameters(e){this._onDidParametersChange.fire(e)}},Qr=class extends Zr{constructor(e,t){super(e,t),this._onDidConstraintsChangeInternal=new G,this.onDidConstraintsChangeInternal=this._onDidConstraintsChangeInternal.event,this._onDidConstraintsChange=new G({replay:!0}),this.onDidConstraintsChange=this._onDidConstraintsChange.event,this._onDidSizeChange=new G,this.onDidSizeChange=this._onDidSizeChange.event,this.addDisposables(this._onDidConstraintsChangeInternal,this._onDidConstraintsChange,this._onDidSizeChange)}setConstraints(e){this._onDidConstraintsChangeInternal.fire(e)}setSize(e){this._onDidSizeChange.fire(e)}},wc=class extends Qr{set pane(e){this._pane=e}constructor(e,t){super(e,t),this._onDidExpansionChange=new G({replay:!0}),this.onDidExpansionChange=this._onDidExpansionChange.event,this._onMouseEnter=new G({}),this.onMouseEnter=this._onMouseEnter.event,this._onMouseLeave=new G({}),this.onMouseLeave=this._onMouseLeave.event,this.addDisposables(this._onDidExpansionChange,this._onMouseEnter,this._onMouseLeave)}setExpanded(e){var t;(t=this._pane)===null||t===void 0||t.setExpanded(e)}get isExpanded(){var e;return!!(!((e=this._pane)===null||e===void 0)&&e.isExpanded())}},mo=class extends x{get element(){return this._element}get width(){return this._width}get height(){return this._height}get params(){var e;return(e=this._params)===null||e===void 0?void 0:e.params}constructor(e,t,i){super(),this.id=e,this.component=t,this.api=i,this._height=0,this._width=0,this._element=document.createElement("div"),this._element.tabIndex=-1,this._element.style.outline="none",this._element.style.height="100%",this._element.style.width="100%",this._element.style.overflow="hidden";let n=ke(this._element);this.addDisposables(this.api,n.onDidFocus(()=>{this.api._onDidChangeFocus.fire({isFocused:!0})}),n.onDidBlur(()=>{this.api._onDidChangeFocus.fire({isFocused:!1})}),n)}focus(){let e=new Xr;this.api._onWillFocus.fire(e),!e.defaultPrevented&&this._element.focus()}layout(e,t){this._width=e,this._height=t,this.api._onDidDimensionChange.fire({width:e,height:t}),this.part&&this._params&&this.part.update(this._params.params)}init(e){this._params=e,this.part=this.getComponent()}update(e){var t,i;this._params=j(j({},this._params),{},{params:j(j({},(t=this._params)===null||t===void 0?void 0:t.params),e.params)});for(let n of Object.keys(e.params))e.params[n]===void 0&&delete this._params.params[n];(i=this.part)===null||i===void 0||i.update({params:this._params.params})}toJSON(){var e,t;let i=(e=(t=this._params)===null||t===void 0?void 0:t.params)!==null&&e!==void 0?e:{};return{id:this.id,component:this.component,params:Object.keys(i).length>0?i:void 0}}dispose(){var e;this.api.dispose(),(e=this.part)===null||e===void 0||e.dispose(),super.dispose()}},es=class extends mo{set orientation(e){this._orientation=e}get orientation(){return this._orientation}get minimumSize(){return this.headerSize+(this.isExpanded()?this._minimumBodySize:0)}get maximumSize(){return this.headerSize+(this.isExpanded()?this._maximumBodySize:0)}get size(){return this._size}get orthogonalSize(){return this._orthogonalSize}set orthogonalSize(e){this._orthogonalSize=e}get minimumBodySize(){return this._minimumBodySize}set minimumBodySize(e){this._minimumBodySize=typeof e=="number"?e:0}get maximumBodySize(){return this._maximumBodySize}set maximumBodySize(e){this._maximumBodySize=typeof e=="number"?e:Number.POSITIVE_INFINITY}get headerVisible(){return this._headerVisible}set headerVisible(e){this._headerVisible=e,this.header.style.display=e?"":"none"}constructor(e){super(e.id,e.component,new wc(e.id,e.component)),this._onDidChangeExpansionState=new G({replay:!0}),this.onDidChangeExpansionState=this._onDidChangeExpansionState.event,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._orthogonalSize=0,this._size=0,this._isExpanded=!1,this.api.pane=this,this.api.initialize(this),this.headerSize=e.headerSize,this.headerComponent=e.headerComponent,this._minimumBodySize=e.minimumBodySize,this._maximumBodySize=e.maximumBodySize,this._isExpanded=e.isExpanded,this._headerVisible=e.isHeaderVisible,this._onDidChangeExpansionState.fire(this.isExpanded()),this._orientation=e.orientation,this.element.classList.add("dv-pane"),this.addDisposables(this.api.onWillVisibilityChange(t=>{let{isVisible:i}=t,{accessor:n}=this._params;n.setVisible(this,i)}),this.api.onDidSizeChange(t=>{this._onDidChange.fire({size:t.size})}),O(this.element,"mouseenter",t=>{this.api._onMouseEnter.fire(t)}),O(this.element,"mouseleave",t=>{this.api._onMouseLeave.fire(t)})),this.addDisposables(this._onDidChangeExpansionState,this.onDidChangeExpansionState(t=>{this.api._onDidExpansionChange.fire({isExpanded:t})}),this.api.onDidFocusChange(t=>{this.header&&(t.isFocused?J(this.header,"focused"):F(this.header,"focused"))})),this.renderOnce()}setVisible(e){this.api._onDidVisibilityChange.fire({isVisible:e})}setActive(e){this.api._onDidActiveChange.fire({isActive:e})}isExpanded(){return this._isExpanded}setExpanded(e){var t;this._isExpanded!==e&&(this._isExpanded=e,e?(this.animationTimer&&clearTimeout(this.animationTimer),this.body&&this.element.appendChild(this.body)):(this._expandedSize=this._size,this.animationTimer=setTimeout(()=>{var i;(i=this.body)===null||i===void 0||i.remove()},200)),this._onDidChange.fire(e?{size:(t=this._expandedSize)!==null&&t!==void 0?t:this.width}:{}),this._onDidChangeExpansionState.fire(e))}layout(e,t){this._size=e,this._orthogonalSize=t;let[i,n]=this.orientation==="HORIZONTAL"?[e,t]:[t,e];super.layout(i,n)}init(e){var t,i;super.init(e),typeof e.minimumBodySize=="number"&&(this.minimumBodySize=e.minimumBodySize),typeof e.maximumBodySize=="number"&&(this.maximumBodySize=e.maximumBodySize),this.bodyPart=this.getBodyComponent(),this.headerPart=this.getHeaderComponent(),this.bodyPart.init(j(j({},e),{},{api:this.api})),this.headerPart.init(j(j({},e),{},{api:this.api})),(t=this.body)===null||t===void 0||t.append(this.bodyPart.element),(i=this.header)===null||i===void 0||i.append(this.headerPart.element),typeof e.isExpanded=="boolean"&&this.setExpanded(e.isExpanded)}toJSON(){let e=this._params;return j(j({},super.toJSON()),{},{headerComponent:this.headerComponent,title:e.title})}renderOnce(){this.header=document.createElement("div"),this.header.tabIndex=0,this.header.className="dv-pane-header",this.header.style.height=`${this.headerSize}px`,this.header.style.lineHeight=`${this.headerSize}px`,this.header.style.minHeight=`${this.headerSize}px`,this.header.style.maxHeight=`${this.headerSize}px`,this.element.appendChild(this.header),this.body=document.createElement("div"),this.body.className="dv-pane-body",this.element.appendChild(this.body)}getComponent(){return{update:e=>{var t,i;(t=this.bodyPart)===null||t===void 0||t.update({params:e}),(i=this.headerPart)===null||i===void 0||i.update({params:e})},dispose:()=>{var e,t;(e=this.bodyPart)===null||e===void 0||e.dispose(),(t=this.headerPart)===null||t===void 0||t.dispose()}}}},ts=class extends es{constructor(e){super({id:e.id,component:e.component,headerComponent:e.headerComponent,orientation:e.orientation,isExpanded:e.isExpanded,isHeaderVisible:!0,headerSize:e.headerSize,minimumBodySize:e.minimumBodySize,maximumBodySize:e.maximumBodySize}),this._onDidDrop=new G,this.onDidDrop=this._onDidDrop.event,this._onUnhandledDragOver=new G,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this.accessor=e.accessor,this.addDisposables(this._onDidDrop,this._onUnhandledDragOver),e.disableDnd||this.initDragFeatures()}initDragFeatures(){if(!this.header)return;let e=this.id,t=this.accessor.id;this.header.draggable=!0;let i={getData:()=>(h.getInstance().setData([new c(t,e)],c.prototype),{dispose:()=>{h.getInstance().clearData(c.prototype)}})};this.html5DragSource=ft.createDragSource(this.header,i),this.pointerDragSource=at.createDragSource(this.header,i);let s={acceptedTargetZones:["top","bottom"],overlayModel:{activationSize:{type:"percentage",value:50}},canDisplayOverlay:(l,u)=>{let p=m();if(p&&p.paneId!==this.id&&p.viewId===this.accessor.id)return!0;let g=new Jr(l,u,m,this);return this._onUnhandledDragOver.fire(g),g.isAccepted}};this.target=ft.createDropTarget(this.element,s),this.pointerTarget=at.createDropTarget(this.element,s),this.addDisposables(this._onDidDrop,this.html5DragSource,this.pointerDragSource,this.target,this.pointerTarget,this.target.onDrop(l=>{this.onDrop(l)}),this.pointerTarget.onDrop(l=>{this.onDrop(l)}))}onDrop(e){let t=m();if(t?.viewId!==this.accessor.id){this._onDidDrop.fire(j(j({},e),{},{panel:this,api:new Kt(this.accessor),getData:m}));return}let i=this._params.containerApi,n=t.paneId,s=i.getPanel(n);if(!s){this._onDidDrop.fire(j(j({},e),{},{panel:this,getData:m,api:new Kt(this.accessor)}));return}let l=i.panels,u=l.indexOf(s),p=i.panels.indexOf(this);(e.position==="left"||e.position==="top")&&(p=Math.max(0,p-1)),(e.position==="right"||e.position==="bottom")&&(u>p&&p++,p=Math.min(l.length-1,p)),i.movePanel(u,p)}};let _c=0,yc=()=>`dv-tabpanel-${_c++}`;var is=class extends x{get element(){return this._element}get dimensions(){return this._dimensions}constructor(e,t){var i,n,s,l,u,p,g;super(),this.accessor=e,this.group=t,this.disposable=new S,this._onDidFocus=new G,this.onDidFocus=this._onDidFocus.event,this._onDidBlur=new G,this.onDidBlur=this._onDidBlur.event,this._onDidDimensionsChange=new G,this.onDidDimensionsChange=this._onDidDimensionsChange.event,this._element=document.createElement("div"),this._element.className="dv-content-container",this._element.tabIndex=-1,this._element.id=yc(),this._element.setAttribute("role","tabpanel"),this.addDisposables(this._onDidFocus,this._onDidBlur,this._onDidDimensionsChange);let f=()=>{var _;return(_=t.dropTargetContainer)===null||_===void 0?void 0:_.model},b=(_,y)=>this.group.canDisplayContentOverlay(_,y);this.dropTarget=new go(this.element,{getOverlayOutline:()=>{var _;return((_=e.options.theme)===null||_===void 0?void 0:_.dndPanelOverlay)==="group"?this.element.parentElement:null},className:"dv-drop-target-content",acceptedTargetZones:["top","bottom","left","right","center"],canDisplayOverlay:b,getOverrideTarget:f,overlayModel:(i=(n=this.accessor).resolveDropOverlayModel)===null||i===void 0?void 0:i.call(n,"content"),getPositionResolver:()=>{var _;return(_=e.getDropPositionResolver)===null||_===void 0?void 0:_.call(e)}}),this.pointerDropTarget=at.createDropTarget(this.element,{acceptedTargetZones:["top","bottom","left","right","center"],canDisplayOverlay:b,getOverlayOutline:()=>{var _;return((_=e.options.theme)===null||_===void 0?void 0:_.dndPanelOverlay)==="group"?this.element.parentElement:null},className:"dv-drop-target-content",getOverrideTarget:f,overlayModel:(s=(l=this.accessor).resolveDropOverlayModel)===null||s===void 0?void 0:s.call(l,"content"),getPositionResolver:()=>{var _;return(_=e.getDropPositionResolver)===null||_===void 0?void 0:_.call(e)}}),this.addDisposables(this.dropTarget,this.pointerDropTarget,(u=(p=(g=this.accessor).onDidOptionsChange)===null||p===void 0?void 0:p.call(g,()=>{var _,y,D;let k=(_=(y=(D=this.accessor).resolveDropOverlayModel)===null||y===void 0?void 0:y.call(D,"content"))!==null&&_!==void 0?_:{};this.dropTarget.setOverlayModel(k),this.pointerDropTarget.setOverlayModel(k)}))!==null&&u!==void 0?u:w.NONE)}show(){this.element.style.display=""}hide(){this.element.style.display="none"}setLabelledBy(e){e?this._element.setAttribute("aria-labelledby",e):this._element.removeAttribute("aria-labelledby")}renderPanel(e,t){var i;let n=((i=t?.asActive)!==null&&i!==void 0?i:!0)||this.group.isPanelActive(e);if(n||this.panel===e){var s;if(((s=this.panel)===null||s===void 0?void 0:s.view.content.element.parentElement)===this._element){var l,u;this.panel.view.content.element.remove(),(l=(u=this.panel.view.content).onHide)===null||l===void 0||l.call(u)}this.panel=e}let p;switch(e.api.renderer){case"onlyWhenVisible":if(this.group.renderContainer.detatch(e),n){var g,f;this._element.appendChild(e.view.content.element),(g=(f=e.view.content).onShow)===null||g===void 0||g.call(f)}p=this._element;break;case"always":e.view.content.element.parentElement===this._element&&e.view.content.element.remove(),p=this.group.renderContainer.attach({panel:e,referenceContainer:this});break;default:throw new Error(`dockview: invalid renderer type '${e.api.renderer}'`)}if(n){let b=ke(p);this.focusTracker=b;let _=new x;_.addDisposables(b,b.onDidFocus(()=>this._onDidFocus.fire()),b.onDidBlur(()=>this._onDidBlur.fire())),this.disposable.value=_}}openPanel(e){this.panel!==e&&this.renderPanel(e)}layout(e,t){var i;((i=this._dimensions)===null||i===void 0?void 0:i.width)===e&&this._dimensions.height===t||(this._dimensions={width:e,height:t},this._onDidDimensionsChange.fire(this._dimensions))}closePanel(){if(this.panel&&this.panel.api.renderer==="onlyWhenVisible"){var e,t;this.panel.view.content.element.remove(),(e=(t=this.panel.view.content).onHide)===null||e===void 0||e.call(t)}this.panel=void 0}dispose(){this.disposable.dispose(),super.dispose()}refreshFocusState(){var e;!((e=this.focusTracker)===null||e===void 0)&&e.refreshState&&this.focusTracker.refreshState()}};let Ui=e=>{let t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttributeNS(null,"height",e.height),t.setAttributeNS(null,"width",e.width),t.setAttributeNS(null,"viewBox",e.viewbox),t.setAttributeNS(null,"aria-hidden","false"),t.setAttributeNS(null,"focusable","false"),t.classList.add("dv-svg");let i=document.createElementNS("http://www.w3.org/2000/svg","path");return i.setAttributeNS(null,"d",e.path),t.appendChild(i),t},ns=()=>Ui({width:"11",height:"11",viewbox:"0 0 28 28",path:"M2.1 27.3L0 25.2L11.55 13.65L0 2.1L2.1 0L13.65 11.55L25.2 0L27.3 2.1L15.75 13.65L27.3 25.2L25.2 27.3L13.65 15.75L2.1 27.3Z"}),fo=()=>Ui({width:"11",height:"11",viewbox:"0 0 24 24",path:"M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"}),xc=()=>Ui({width:"11",height:"11",viewbox:"0 0 24 15",path:"M12 14.15L0 2.15L2.15 0L12 9.9L21.85 0.0499992L24 2.2L12 14.15Z"}),os=()=>Ui({width:"11",height:"11",viewbox:"0 0 15 25",path:"M2.15 24.1L0 21.95L9.9 12.05L0 2.15L2.15 0L14.2 12.05L2.15 24.1Z"}),Dc=500,kc=8;var bo=class extends x{constructor(e,t){super(),this.element=e,this.options=t,this._startX=0,this._startY=0,this.addDisposables(O(this.element,"pointerdown",i=>{this._onPointerDown(i)}))}_onPointerDown(e){var t,i,n,s,l;if((!((t=this.options.touchOnly)!==null&&t!==void 0)||t)&&e.pointerType!=="touch"&&e.pointerType!=="pen")return;this._cancelPending(),this._pointerId=e.pointerId,this._startX=e.clientX,this._startY=e.clientY;let u=(i=this.options.delay)!==null&&i!==void 0?i:Dc,p=(n=this.options.tolerance)!==null&&n!==void 0?n:kc,g=(s=(l=this.element.ownerDocument)===null||l===void 0?void 0:l.defaultView)!==null&&s!==void 0?s:globalThis.window;this._timer=setTimeout(()=>{this._timer=void 0,this._cancelPending(),this._installContextMenuGuard(g),this._installClickGuard(g),this.options.onLongPress(e)},u),this._moveListener=O(g,"pointermove",f=>{if(f.pointerId!==this._pointerId)return;let b=f.clientX-this._startX,_=f.clientY-this._startY;Math.hypot(b,_)>p&&this._cancelPending()}),this._upListener=O(g,"pointerup",f=>{f.pointerId===this._pointerId&&this._cancelPending()}),this._cancelListener=O(g,"pointercancel",f=>{f.pointerId===this._pointerId&&this._cancelPending()})}_installContextMenuGuard(e){let t,i=setTimeout(()=>t?.dispose(),500);t=O(e,"contextmenu",n=>{n.preventDefault(),clearTimeout(i),t?.dispose()},{capture:!0})}_installClickGuard(e){let t,i=setTimeout(()=>t?.dispose(),500);t=O(e,"click",n=>{ui(n,[this.element])&&(n.preventDefault(),n.stopPropagation()),clearTimeout(i),t?.dispose()},{capture:!0})}_cancelPending(){var e,t,i;this._timer!==void 0&&(clearTimeout(this._timer),this._timer=void 0),this._pointerId=void 0,(e=this._moveListener)===null||e===void 0||e.dispose(),(t=this._upListener)===null||t===void 0||t.dispose(),(i=this._cancelListener)===null||i===void 0||i.dispose(),this._moveListener=void 0,this._upListener=void 0,this._cancelListener=void 0}dispose(){this._cancelPending(),super.dispose()}};function Je(e){if(e.disableDnd)return{html5:!1,pointer:!1,pointerHandlesMouse:!1};switch(e.dndStrategy){case"pointer":return{html5:!1,pointer:!0,pointerHandlesMouse:!0};case"html5":return{html5:!0,pointer:!1,pointerHandlesMouse:!1};default:return Sc()?{html5:!1,pointer:!0,pointerHandlesMouse:!0}:{html5:!0,pointer:!0,pointerHandlesMouse:!1}}}function Sc(){if(globalThis.window===void 0||!globalThis.matchMedia)return!1;let e=globalThis.matchMedia("(pointer: coarse)").matches,t=globalThis.matchMedia("(pointer: fine)").matches;return e&&!t}let Cc=0,Gc=()=>`dv-tab-${Cc++}`;var rs=class extends x{get element(){return this._element}constructor(e,t,i){var n,s,l,u,p,g,f,b;super(),this.panel=e,this.accessor=t,this.group=i,this.content=void 0,this.panelTransfer=h.getInstance(),this._direction="horizontal",this._pinIndicator=void 0,this._onPointDown=new G,this.onPointerDown=this._onPointDown.event,this._onTabClick=new G,this.onTabClick=this._onTabClick.event,this._onDropped=new G,this.onDrop=this._onDropped.event,this._onDragStart=new G,this.onDragStart=this._onDragStart.event,this._onDragEnd=new G,this.onDragEnd=this._onDragEnd.event;let _=Je(this.accessor.options);this._element=document.createElement("div"),this._element.className="dv-tab",this._element.tabIndex=-1,this._element.draggable=_.html5,this._element.id=Gc(),this._element.setAttribute("role","tab"),this._element.setAttribute("aria-selected","false"),this._element.setAttribute("aria-label",(n=this.panel.title)!==null&&n!==void 0?n:this.panel.id),this._element.dataset.tabPanelId=this.panel.id;let y=(s=this.group)===null||s===void 0||(s=s.model)===null||s===void 0?void 0:s.contentContainerId;y&&this._element.setAttribute("aria-controls",y),A(this.element,"dv-inactive-tab",!0),this._updatePinnedClasses();let D=(C,T)=>{if(this.group.locked)return!1;let M=v();if(this.accessor.id===M?.viewId){var I;return!(((I=this.accessor.options.theme)===null||I===void 0?void 0:I.tabAnimation)==="smooth"||M.tabGroupId&&M.groupId===this.group.id&&this.group.model.getTabGroupForPanel(this.panel.id))}return this.group.model.canDisplayOverlay(C,T,"tab")};this.dropTarget=ft.createDropTarget(this._element,{acceptedTargetZones:["left","right"],overlayModel:this._buildOverlayModel(),canDisplayOverlay:D,getOverrideTarget:()=>{var C;return(C=i.model.dropTargetContainer)===null||C===void 0?void 0:C.model}}),this.pointerDropTarget=at.createDropTarget(this._element,{acceptedTargetZones:["left","right"],overlayModel:this._buildOverlayModel(),canDisplayOverlay:D,getOverrideTarget:()=>{var C;return(C=i.model.dropTargetContainer)===null||C===void 0?void 0:C.model}});let k={getData:()=>(this.panelTransfer.setData([new d(this.accessor.id,this.group.id,this.panel.id)],d.prototype),{dispose:()=>{this.panelTransfer.clearData(d.prototype)}}),createGhost:()=>({element:this._buildGhostElement(),offsetX:30,offsetY:-10}),onDragStart:C=>{var T;this._onDragStart.fire(C),!(C instanceof PointerEvent)&&((T=this.accessor.options.theme)===null||T===void 0?void 0:T.tabAnimation)==="smooth"&&requestAnimationFrame(()=>{A(this.element,"dv-tab--dragging",!0)})},onDragEnd:C=>{this._onDragEnd.fire(C)}};this.html5DragSource=ft.createDragSource(this._element,j(j({},k),{},{disabled:!_.html5})),this.pointerDragSource=at.createDragSource(this._element,j(j({},k),{},{disabled:!_.pointer,touchOnly:!_.pointerHandlesMouse,isCancelled:()=>!Je(this.accessor.options).pointer})),this.onWillShowOverlay=P.any(this.dropTarget.onWillShowOverlay,this.pointerDropTarget.onWillShowOverlay),this.addDisposables(this._onPointDown,this._onTabClick,this._onDropped,this._onDragStart,this._onDragEnd,this.accessor.onDidOptionsChange(()=>{let C=this._buildOverlayModel();this.dropTarget.setOverlayModel(C),this.pointerDropTarget.setOverlayModel(C),this._updatePinnedClasses()}),(l=(u=this.panel.api)===null||u===void 0||(p=u.onDidChangePinned)===null||p===void 0?void 0:p.call(u,()=>{this._updatePinnedClasses()}))!==null&&l!==void 0?l:{dispose:()=>{}},(g=(f=this.panel.api)===null||f===void 0||(b=f.onDidTitleChange)===null||b===void 0?void 0:b.call(f,C=>{var T;this._element.setAttribute("aria-label",(T=C.title)!==null&&T!==void 0?T:this.panel.id)}))!==null&&g!==void 0?g:{dispose:()=>{}},O(this._element,"dragend",()=>{A(this.element,"dv-tab--dragging",!1)}),this.html5DragSource,O(this._element,"pointerdown",C=>{this._onPointDown.fire(C)}),O(this._element,"click",C=>{this._onTabClick.fire(C)}),O(this._element,"contextmenu",C=>{var T;(T=this.accessor.contextMenuService)===null||T===void 0||T.show(this.panel,this.group,C)}),new bo(this._element,{onLongPress:C=>{var T;this.pointerDragSource.cancelPending(),(T=this.accessor.contextMenuService)===null||T===void 0||T.show(this.panel,this.group,C)}}),this.dropTarget.onDrop(C=>{this._onDropped.fire(C)}),this.pointerDropTarget.onDrop(C=>{this._onDropped.fire(C)}),this.dropTarget,this.pointerDropTarget,this.pointerDragSource)}_updatePinnedClasses(){var e,t,i,n;let s=(e=(t=this.panel.api)===null||t===void 0?void 0:t.isPinned)!==null&&e!==void 0?e:!1,l=s&&((i=this.accessor.options.pinnedTabs)===null||i===void 0?void 0:i.compact)===!0;A(this.element,"dv-tab--pinned",s),A(this.element,"dv-tab--pinned-compact",l);let u=s&&!(!((n=this.panel.api)===null||n===void 0)&&n.tabComponent);if(u&&!this._pinIndicator){let p=document.createElement("div");p.className="dv-tab-pin",p.appendChild(fo()),this._element.insertBefore(p,this._element.firstChild),this._pinIndicator=p}else!u&&this._pinIndicator&&(this._pinIndicator.remove(),this._pinIndicator=void 0)}setActive(e){A(this.element,"dv-active-tab",e),A(this.element,"dv-inactive-tab",!e),this._element.setAttribute("aria-selected",e?"true":"false"),this._element.tabIndex=e?0:-1}setContent(e){this.content&&this.content.element.remove(),this.content=e,this._element.appendChild(this.content.element)}_buildOverlayModel(){var e,t,i;let n=(e=(t=this.accessor).resolveDropOverlayModel)===null||e===void 0?void 0:e.call(t,"tab",this.group);if(n)return n;let s=((i=this.accessor.options.theme)===null||i===void 0?void 0:i.dndTabIndicator)==="line"?Number.POSITIVE_INFINITY:0;return{activationSize:{value:50,type:"percentage"},smallWidthBoundary:s,smallHeightBoundary:s}}setDirection(e){this._direction=e;let t=e==="vertical"?["top","bottom"]:["left","right"];this.dropTarget.setTargetZones(t),this.pointerDropTarget.setTargetZones(t)}updateDragAndDropState(){let e=Je(this.accessor.options);this._element.draggable=e.html5,this.html5DragSource.setDisabled(!e.html5),this.pointerDragSource.setDisabled(!e.pointer),this.pointerDragSource.setTouchOnly(!e.pointerHandlesMouse)}_buildGhostElement(){let e=getComputedStyle(this.element),t=this.element.cloneNode(!0),i=this._direction==="vertical",n=new Set(["writing-mode","inline-size","block-size","min-inline-size","min-block-size","max-inline-size","max-block-size","margin-inline","margin-inline-start","margin-inline-end","margin-block","margin-block-start","margin-block-end","padding-inline","padding-inline-start","padding-inline-end","padding-block","padding-block-start","padding-block-end"]);return Array.from(e).forEach(s=>{i&&n.has(s)||t.style.setProperty(s,e.getPropertyValue(s),e.getPropertyPriority(s))}),i&&(t.style.setProperty("writing-mode","horizontal-tb"),t.style.setProperty("width",e.height),t.style.setProperty("height",e.width)),t.style.position="absolute",t.classList.add("dv-tab-ghost-drag"),t}},Jt=class{get kind(){return this.options.kind}get nativeEvent(){return this.event.nativeEvent}get position(){return this.event.position}get edge(){return this.event.edge}get edgeGroup(){return this.event.edgeGroup}get defaultPrevented(){return this.event.defaultPrevented}get panel(){return this.options.panel}get api(){return this.options.api}get group(){return this.options.group}preventDefault(){this.event.preventDefault()}getData(){return this.options.getData()}constructor(e,t){this.event=e,this.options=t}};let jv=500;var ss=class extends x{get group(){return this.groupAccessor()}constructor(e){var t,i;super(),this.panelTransfer=h.getInstance(),this._onDragStart=new G,this.onDragStart=this._onDragStart.event,this._element=e.element,this.accessor=e.accessor;let n=e.group;this.groupAccessor=typeof n=="function"?n:()=>n,this.isFloatingMoveHandle=(t=e.isFloatingMoveHandle)!==null&&t!==void 0?t:(()=>!0);let s=Je(this.accessor.options);this._element.draggable=s.html5,A(this._element,"dv-draggable",s.html5||s.pointer),this.addDisposables(this._onDragStart);let l=()=>{let y=document.createElement("div"),D=globalThis.getComputedStyle(this._element),k=D.getPropertyValue("--dv-activegroup-visiblepanel-tab-background-color"),C=D.getPropertyValue("--dv-activegroup-visiblepanel-tab-color");return y.style.backgroundColor=k,y.style.color=C,y.style.padding="2px 8px",y.style.height="24px",y.style.fontSize="11px",y.style.lineHeight="20px",y.style.borderRadius="12px",y.style.whiteSpace="nowrap",y.style.boxSizing="border-box",y.style.display="inline-block",y.textContent=`Multiple Panels (${this.group.size})`,y},p={getData:()=>(this.panelTransfer.setData([new d(this.accessor.id,this.group.id,null)],d.prototype),{dispose:()=>{this.panelTransfer.clearData(d.prototype)}}),createGhost:()=>{var y,D;let k=(y=(D=this.accessor).buildGroupDragGhost)===null||y===void 0?void 0:y.call(D,this.group);return k||{element:l(),offsetX:30,offsetY:-10}},onDragStart:y=>{this._onDragStart.fire(y)}};this.html5DragSource=ft.createDragSource(this._element,j(j({},p),{},{disabled:!s.html5,isCancelled:y=>!!(this.group.api.location.type==="floating"&&this.isFloatingMoveHandle()&&!y.shiftKey||this.group.api.location.type==="edge"&&this.group.size===0)}));let g=()=>{var y;return((y=this.group)===null||y===void 0||(y=y.api)===null||y===void 0||(y=y.location)===null||y===void 0?void 0:y.type)==="floating"&&this.isFloatingMoveHandle()};this.pointerDragSource=at.createDragSource(this._element,j(j({},p),{},{disabled:!s.pointer,touchOnly:!s.pointerHandlesMouse,touchInitiationDelay:()=>g()?500:250,pressTolerance:()=>g()?1/0:8,isCancelled:()=>!Je(this.accessor.options).pointer||this.group.api.location.type==="edge"&&this.group.size===0,onDragStart:y=>{var D;(D=this.getFloatingOverlay())===null||D===void 0||D.cancelPendingDrag(),this._onDragStart.fire(y)}}));let f=new S,b=()=>{let y=this.getFloatingOverlay();f.value=y?y.onDidStartMoving(()=>{this.pointerDragSource.cancelPending()}):w.NONE};b(),this.addDisposables(f);let _=(i=this.group)===null||i===void 0||(i=i.api)===null||i===void 0?void 0:i.onDidLocationChange;_&&this.addDisposables(_(b)),this.addDisposables(this.html5DragSource,this.pointerDragSource)}updateDragAndDropState(){let e=Je(this.accessor.options);this._element.draggable=e.html5,A(this._element,"dv-draggable",e.html5||e.pointer),this.html5DragSource.setDisabled(!e.html5),this.pointerDragSource.setDisabled(!e.pointer),this.pointerDragSource.setTouchOnly(!e.pointerHandlesMouse)}getFloatingOverlay(){var e;if(this.group)return(e=this.accessor.floatingGroups)===null||e===void 0||(e=e.find(t=>t.group===this.group))===null||e===void 0?void 0:e.overlay}},Pc=class extends x{get element(){return this._element}constructor(e,t){var i,n,s,l,u,p,g;super(),this.accessor=e,this.group=t,this._onDrop=new G,this.onDrop=this._onDrop.event,this._onDragStart=new G,this.onDragStart=this._onDragStart.event,this._element=document.createElement("div"),this._element.className="dv-void-container",this.addDisposables(this._onDrop,this._onDragStart,O(this._element,"pointerdown",()=>{this.accessor.doSetGroupActive(this.group)}),O(this._element,"pointerdown",b=>{b.shiftKey&&Ve(b)},!0)),this.dragSource=new ss({element:this._element,accessor:this.accessor,group:this.group,isFloatingMoveHandle:()=>!this._element.closest(".dv-resize-container-with-titlebar")});let f=(b,_)=>{if(this.group.api.locked)return!1;let y=v();return this.accessor.id===y?.viewId?!0:t.model.canDisplayOverlay(b,_,"header_space")};this.dropTarget=ft.createDropTarget(this._element,{acceptedTargetZones:["center"],canDisplayOverlay:f,getOverrideTarget:()=>{var b;return(b=t.model.dropTargetContainer)===null||b===void 0?void 0:b.model},overlayModel:(i=(n=this.accessor).resolveDropOverlayModel)===null||i===void 0?void 0:i.call(n,"header_space",this.group)}),this.pointerDropTarget=at.createDropTarget(this._element,{acceptedTargetZones:["center"],canDisplayOverlay:f,getOverrideTarget:()=>{var b;return(b=t.model.dropTargetContainer)===null||b===void 0?void 0:b.model},overlayModel:(s=(l=this.accessor).resolveDropOverlayModel)===null||s===void 0?void 0:s.call(l,"header_space",this.group)}),this.onWillShowOverlay=P.any(this.dropTarget.onWillShowOverlay,this.pointerDropTarget.onWillShowOverlay),this.addDisposables(this.dragSource,this.dragSource.onDragStart(b=>{this._onDragStart.fire(b)}),this.dropTarget.onDrop(b=>{this._onDrop.fire(b)}),this.pointerDropTarget.onDrop(b=>{this._onDrop.fire(b)}),this.dropTarget,this.pointerDropTarget,(u=(p=(g=this.accessor).onDidOptionsChange)===null||p===void 0?void 0:p.call(g,()=>{var b,_,y;let D=(b=(_=(y=this.accessor).resolveDropOverlayModel)===null||_===void 0?void 0:_.call(y,"header_space",this.group))!==null&&b!==void 0?b:{};this.dropTarget.setOverlayModel(D),this.pointerDropTarget.setOverlayModel(D)}))!==null&&u!==void 0?u:w.NONE)}updateDragAndDropState(){this.dragSource.updateDragAndDropState()}},as=class El extends x{get element(){return this._element}get orientation(){return this._orientation}set orientation(t){this._orientation!==t&&(this._scrollOffset=0,this._orientation=t,F(this._scrollbar,"dv-scrollbar-vertical","dv-scrollbar-horizontal"),t==="vertical"?J(this._scrollbar,"dv-scrollbar-vertical"):J(this._scrollbar,"dv-scrollbar-horizontal"))}constructor(t){super(),this.scrollableElement=t,this._scrollOffset=0,this._orientation="horizontal",this._element=document.createElement("div"),this._element.className="dv-scrollable",this._scrollbar=document.createElement("div"),this._scrollbar.className="dv-scrollbar dv-scrollbar-horizontal",this.element.appendChild(t),this.element.appendChild(this._scrollbar),this.addDisposables(O(this.element,"wheel",i=>{this._scrollOffset+=i.deltaY*El.MouseWheelSpeed,this.scheduleStyleUpdate()}),O(this._scrollbar,"pointerdown",i=>{var n;i.preventDefault();let s=(n=this._scrollbar.ownerDocument)!==null&&n!==void 0?n:document;A(this.element,"dv-scrollable-scrolling",!0);let l=this._orientation==="horizontal"?i.clientX:i.clientY,u=this._scrollOffset,p=f=>{let b=this._orientation==="horizontal"?f.clientX-l:f.clientY-l,_=(this._orientation==="horizontal"?this.element.clientWidth:this.element.clientHeight)/(this._orientation==="horizontal"?this.scrollableElement.scrollWidth:this.scrollableElement.scrollHeight);this._scrollOffset=u+b/_,this.scheduleStyleUpdate()},g=()=>{A(this.element,"dv-scrollable-scrolling",!1),s.removeEventListener("pointermove",p),s.removeEventListener("pointerup",g),s.removeEventListener("pointercancel",g)};s.addEventListener("pointermove",p),s.addEventListener("pointerup",g),s.addEventListener("pointercancel",g)}),O(this.element,"scroll",()=>{this.scheduleStyleUpdate()}),O(this.scrollableElement,"scroll",()=>{this._scrollOffset=this._orientation==="horizontal"?this.scrollableElement.scrollLeft:this.scrollableElement.scrollTop,this.scheduleStyleUpdate()}),U(this.element,()=>{A(this.element,"dv-scrollable-resizing",!0),this._animationTimer&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(()=>{clearTimeout(this._animationTimer),A(this.element,"dv-scrollable-resizing",!1)},500),this.scheduleStyleUpdate()}),w.from(()=>{this._pendingStyleFrame!==void 0&&(cancelAnimationFrame(this._pendingStyleFrame),this._pendingStyleFrame=void 0)}))}scheduleStyleUpdate(){this._pendingStyleFrame===void 0&&(this._pendingStyleFrame=requestAnimationFrame(()=>{this._pendingStyleFrame=void 0,this.calculateScrollbarStyles()}))}calculateScrollbarStyles(){let t=this._orientation==="horizontal"?this.element.clientWidth:this.element.clientHeight,i=this._orientation==="horizontal"?this.scrollableElement.scrollWidth:this.scrollableElement.scrollHeight;if(i>t){let n=t*(t/i);this._orientation==="horizontal"?(this._scrollbar.style.width=`${n}px`,this._scrollbar.style.height=""):(this._scrollbar.style.height=`${n}px`,this._scrollbar.style.width=""),this._scrollOffset=De(this._scrollOffset,0,i-t),this._orientation==="horizontal"?this.scrollableElement.scrollLeft=this._scrollOffset:this.scrollableElement.scrollTop=this._scrollOffset;let s=this._scrollOffset/(i-t);this._orientation==="horizontal"?(this._scrollbar.style.left=`${(t-n)*s}px`,this._scrollbar.style.top=""):(this._scrollbar.style.top=`${(t-n)*s}px`,this._scrollbar.style.left="")}else this._orientation==="horizontal"?(this._scrollbar.style.width="0px",this._scrollbar.style.left="0px"):(this._scrollbar.style.height="0px",this._scrollbar.style.top="0px"),this._scrollOffset=0}};as.MouseWheelSpeed=1;let wo="dv-tabs-container--wrap",zc="dv-tabs-container--wrap-capped",Tc="--dv-max-tab-rows",Ac="--dv-wrap-vertical-tab-height";function ds(e,t){return typeof e=="boolean"?e:!!e?.[t]}function Yi(e){return typeof e=="boolean"?e:e?Object.values(e).some(Boolean):!1}var _o=class extends L{constructor(e,t,i,n,s){super(),this.nativeEvent=e,this.target=t,this.position=i,this.getData=n,this.group=s}};let Ec=Object.keys({disableAutoResizing:void 0,proportionalLayout:void 0,hideBorders:void 0,singleTabMode:void 0,disableFloatingGroups:void 0,floatingGroupBounds:void 0,transformFloatingGroupDrag:void 0,smartGuides:void 0,floatingGroupDragHandle:void 0,popoutUrl:void 0,nonce:void 0,defaultRenderer:void 0,defaultHeaderPosition:void 0,debug:void 0,locked:void 0,disableDnd:void 0,dndStrategy:void 0,className:void 0,noPanelsOverlay:void 0,closeEmptyGroups:void 0,dndEdges:void 0,dropPositionResolver:void 0,dndCompass:void 0,theme:void 0,disableTabsOverflowList:void 0,overflow:void 0,scrollbars:void 0,getTabContextMenuItems:void 0,getTabGroupChipContextMenuItems:void 0,createTabGroupChipComponent:void 0,createGroupDragGhostComponent:void 0,dropOverlayModel:void 0,announcements:void 0,getAnnouncement:void 0,announcer:void 0,messages:void 0,keyboardNavigation:void 0,layoutHistory:void 0,autoHideEdgeGroups:void 0,dockToEdgeGroups:void 0,edgeGroupPeek:void 0,tabGroupColors:void 0,tabGroupAccent:void 0,pinnedTabs:void 0});function ls(e){return!!e.referencePanel}function cs(e){return!!e.referenceGroup}function hs(e){return!!e.referencePanel}function us(e){return!!e.referenceGroup}let qi=[{id:"grey",value:"var(--dv-tab-group-color-grey)",label:"Grey"},{id:"blue",value:"var(--dv-tab-group-color-blue)",label:"Blue"},{id:"red",value:"var(--dv-tab-group-color-red)",label:"Red"},{id:"yellow",value:"var(--dv-tab-group-color-yellow)",label:"Yellow"},{id:"green",value:"var(--dv-tab-group-color-green)",label:"Green"},{id:"pink",value:"var(--dv-tab-group-color-pink)",label:"Pink"},{id:"purple",value:"var(--dv-tab-group-color-purple)",label:"Purple"},{id:"cyan",value:"var(--dv-tab-group-color-cyan)",label:"Cyan"},{id:"orange",value:"var(--dv-tab-group-color-orange)",label:"Orange"}];var yo=class{constructor(e,t=!0){this._entries=e.slice(),this._byId=new Map(e.map(i=>[i.id,i])),this._enabled=t}get enabled(){return this._enabled}set enabled(e){this._enabled=e}setEntries(e){this._entries=e.slice(),this._byId=new Map(e.map(t=>[t.id,t]))}entries(){return this._entries}has(e){return this._byId.has(e)}get(e){return this._byId.get(e)}defaultId(){var e;return(e=this._entries[0])===null||e===void 0?void 0:e.id}resolveValue(e){if(!this._enabled||!e)return;let t=this._byId.get(e);return t?t.value:e}};let xo;function ps(){var e;return(e=xo)!==null&&e!==void 0||(xo=new yo(qi,!0)),xo}function ji(e,t,i){let n=(i??ps()).resolveValue(t);n===void 0?e.style.removeProperty("--dv-tab-group-color"):e.style.setProperty("--dv-tab-group-color",n)}function Ki(e,t){return(t??ps()).resolveValue(e)}var vs=class extends x{get element(){return this._element}constructor(e){super(),this._palette=e,this._onClick=new G,this.onClick=this._onClick.event,this._onContextMenu=new G,this.onContextMenu=this._onContextMenu.event,this._element=document.createElement("div"),this._element.className="dv-tab-group-chip",this._element.tabIndex=0,this._label=document.createElement("span"),this._label.className="dv-tab-group-chip-label",this._element.appendChild(this._label),this.addDisposables(this._onClick,this._onContextMenu,new bo(this._element,{onLongPress:t=>{this._onContextMenu.fire(t)}}),O(this._element,"click",t=>{this._onClick.fire(t)}),O(this._element,"contextmenu",t=>{this._onContextMenu.fire(t)}))}init(e){this._tabGroup=e.tabGroup,this.updateColor(e.tabGroup.color),this.updateLabel(e.tabGroup.label),this.updateCollapsed(e.tabGroup.collapsed),this.addDisposables(e.tabGroup.onDidChange(()=>{this._tabGroup&&(this.updateColor(this._tabGroup.color),this.updateLabel(this._tabGroup.label))}),e.tabGroup.onDidCollapseChange(t=>{this.updateCollapsed(t)}),this._onClick.event(()=>{var t;(t=this._tabGroup)===null||t===void 0||t.toggle()}))}update(e){this._tabGroup=e.tabGroup,this.updateColor(e.tabGroup.color),this.updateLabel(e.tabGroup.label),this.updateCollapsed(e.tabGroup.collapsed)}updateColor(e){var t;ji(this._element,e,this._palette),A(this._element,"dv-tab-group-chip--accent-off",((t=this._palette)===null||t===void 0?void 0:t.enabled)===!1)}updateLabel(e){this._label.textContent=e,A(this._label,"dv-tab-group-chip-label--empty",!e)}updateCollapsed(e){A(this._element,"dv-tab-group-chip--collapsed",e)}};let Ic="dv-tab-group-chip-continuation",gs=8;var ms=class{get underlines(){return this._underlines}constructor(e){this._ctx=e,this._underlines=new Map,this._continuationMarkers=new Map,this._rafId=null}positionUnderlines(){requestAnimationFrame(()=>{this._positionUnderlinesSync()})}trackUnderlines(){this._rafId!==null&&cancelAnimationFrame(this._rafId);let e=performance.now(),t=250,i=()=>{this._positionUnderlinesSync(),performance.now()-e<t?this._rafId=requestAnimationFrame(i):this._rafId=null};this._rafId=requestAnimationFrame(i)}syncUnderlineElements(e){for(let t of e)if(!this._underlines.has(t)){let i=document.createElement("div");i.className="dv-tab-group-underline",this._ctx.tabsList.appendChild(i),this._underlines.set(t,i)}for(let[t,i]of this._underlines)e.has(t)||(i.remove(),this._underlines.delete(t),this._clearContinuationMarkers(t))}getUnderline(e){return this._underlines.get(e)}dispose(){this._rafId!==null&&(cancelAnimationFrame(this._rafId),this._rafId=null);for(let[,e]of this._underlines)e.remove();this._underlines.clear(),this._clearContinuationMarkers()}_syncContinuationMarkers(e,t){let i=this._continuationMarkers.get(e);for(i||(i=[],this._continuationMarkers.set(e,i));i.length<t;){let n=document.createElement("div");n.className=Ic,this._ctx.tabsList.appendChild(n),i.push(n)}for(;i.length>t;){let n=i.pop();n?.remove()}return i}_clearContinuationMarkers(e){if(e===void 0){for(let[,i]of this._continuationMarkers)for(let n of i)n.remove();this._continuationMarkers.clear();return}let t=this._continuationMarkers.get(e);if(t){for(let i of t)i.remove();this._continuationMarkers.delete(e)}}_positionUnderlinesSync(){let e=this._ctx.tabsList.getBoundingClientRect(),t=this._ctx.getTabGroups(),i=this._ctx.getDirection()==="vertical",n=this._ctx.tabsList.classList.contains(wo);n||this._clearContinuationMarkers();let s=i?e.width:e.height,l=this._ctx.getActivePanelId(),u=this._ctx.getTabMap();for(let p of t){let g=this._underlines.get(p.id);if(!g)continue;let f=p.panelIds;if(f.length===0){g.style.display="none";continue}if(g.style.display="",n){this._positionWrappedUnderline(g,p,e,u,i);continue}let b=this._ctx.getChipElement(p.id),_;if(b){let M=b.getBoundingClientRect(),I=getComputedStyle(b),E=i?Number.parseFloat(I.marginTop)||0:Number.parseFloat(I.marginLeft)||0;_=i?M.top-e.top-E:M.left-e.left-E}else{let M=f[0],I=u.get(M);if(I){let E=I.value.element.getBoundingClientRect();_=i?E.top-e.top:E.left-e.left}else _=0}let y=f[f.length-1],D=u.get(y);if(!D){i?(g.style.top=`${_}px`,g.style.height="0px",g.style.left="",g.style.width=""):(g.style.left=`${_}px`,g.style.width="0px",g.style.top="",g.style.height="");continue}let k=D.value.element.getBoundingClientRect(),C=i?k.bottom-e.top:k.right-e.left,T=C-_;if((p.collapsed||p.panelIds.some(M=>{let I=u.get(M);return I?.value.element.classList.contains("dv-tab--group-expanding")}))&&b){let M=b.getBoundingClientRect(),I=i?M.top+M.height/2-e.top:M.left+M.width/2-e.left,E=0,$=0;for(let Z of p.panelIds){let W=u.get(Z);if(!W)continue;let B=W.value.element;i?(E+=B.getBoundingClientRect().height,$+=B.scrollHeight):(E+=B.getBoundingClientRect().width,$+=B.scrollWidth)}let X=$>0?Math.min(1,E/$):0;_=I+(_-I)*X,C=I+(C-I)*X,T=Math.max(0,C-_)}i?(g.style.top=`${_}px`,g.style.height=`${Math.max(0,T)}px`,g.style.left="",g.style.width="",g.style.bottom=""):(g.style.left=`${_}px`,g.style.width=`${Math.max(0,T)}px`,g.style.top="",g.style.height="",g.style.bottom=""),this.applyShape(g,p,_,T,s,l,e,i)}}_positionWrappedUnderline(e,t,i,n,s){let u=Ki(t.color,this._ctx.getColorPalette());if(u===void 0){e.style.display="none",this._clearContinuationMarkers(t.id);return}let{runs:p,firstRun:g}=this._computeWrappedRuns(t,i,n,s);if(p.length===0){e.style.display="none",this._clearContinuationMarkers(t.id);return}this._positionContinuationMarkers(t.id,p,g,u,s);let f=Math.min(...p.map(E=>E.left)),b=Math.max(...p.map(E=>E.right)),_=Math.min(...p.map(E=>E.top)),y=Math.max(...p.map(E=>E.bottom)),D=s?Math.max(0,b-f):i.width,k=s?i.height:Math.max(0,y-_);e.style.left=s?`${f}px`:"0px",e.style.top=s?"0px":`${_}px`,e.style.bottom="auto",e.style.width=`${D}px`,e.style.height=`${k}px`,e.style.backgroundColor="";let{svg:C,path:T}=this.ensureSvgPath(e);C.setAttribute("width",String(D)),C.setAttribute("height",String(k)),T.setAttribute("stroke",u),T.setAttribute("stroke-width",String(2));let M=this._ctx.getHeaderPosition(),I=s?M==="right":M==="bottom";T.setAttribute("d",this._wrappedPathData(p,s,I,f,_,2))}_computeWrappedRuns(e,t,i,n){let s=[],l;for(let p of e.panelIds){var u;let g=i.get(p);if(!g)continue;let f=g.value.element.getBoundingClientRect();if(f.width===0&&f.height===0)continue;let b=f.top-t.top,_=f.bottom-t.top,y=f.left-t.left,D=f.right-t.left,k=n?y:b,C=s.find(T=>Math.abs((n?T.left:T.top)-k)<=2);C?(C.top=Math.min(C.top,b),C.bottom=Math.max(C.bottom,_),C.left=Math.min(C.left,y),C.right=Math.max(C.right,D)):(C={top:b,bottom:_,left:y,right:D},s.push(C)),(u=l)!==null&&u!==void 0||(l=C)}return{runs:s,firstRun:l}}_wrappedPathData(e,t,i,n,s,l){let u="";for(let p of e)if(t){let g=i?p.right-n-l/2:p.left-n+l/2;u+=`M ${g},${p.top} L ${g},${p.bottom} `}else{let g=i?p.top-s+l/2:p.bottom-s-l/2;u+=`M ${p.left},${g} L ${p.right},${g} `}return u.trim()}_positionContinuationMarkers(e,t,i,n,s){let l=t.filter(p=>p!==i),u=this._syncContinuationMarkers(e,l.length);l.forEach((p,g)=>{let f=u[g];if(f.style.backgroundColor=n,s){let b=(p.left+p.right)/2;f.style.left=`${b-gs/2}px`,f.style.top=`${p.top}px`}else{let b=(p.top+p.bottom)/2;f.style.left=`${p.left}px`,f.style.top=`${b-gs/2}px`}})}ensureSvgPath(e){let t=e.firstElementChild;if(t?.tagName==="svg")return{svg:t,path:t.firstElementChild};e.replaceChildren();let i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.style.display="block";let n=document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttribute("fill","none"),i.appendChild(n),e.appendChild(i),{svg:i,path:n}}},Mc=class extends ms{_applyStraightLine(e,t,i,n,s,l,u){let p=u?s:n,g=u?n:s;e.setAttribute("width",String(p)),e.setAttribute("height",String(g)),i.style.width=`${p}px`,i.style.height=`${g}px`,t.setAttribute("d",u?`M ${l},0 L ${l},${n}`:`M 0,${l} L ${n},${l}`)}applyShape(e,t,i,n,s,l,u,p){let f=s,b=n,_=Ki(t.color,this._ctx.getColorPalette());if(b<=0||f<=0||_===void 0){e.style.display="none";return}e.style.display="";let y;l&&t.panelIds.includes(l)&&(y=this._ctx.getTabMap().get(l));let{svg:D,path:k}=this.ensureSvgPath(e);k.setAttribute("stroke",_),k.setAttribute("stroke-width",String(2));let C=2,T=this._ctx.getHeaderPosition(),M=!p&&T==="bottom",I=p&&T==="right",E,$;if(p?(E=I?f-C:C,$=I?C:f-C):(E=M?C:f-C,$=M?f-C:C),!y){this._applyStraightLine(D,k,e,b,f,E,p);return}let X=y.value.element.getBoundingClientRect(),Z,W;if(p?(Z=Math.max(0,X.top-u.top-i),W=Math.min(b,X.bottom-u.top-i)):(Z=Math.max(0,X.left-u.left-i),W=Math.min(b,X.right-u.left-i)),W<=Z){this._applyStraightLine(D,k,e,b,f,E,p);return}let B=6,re=$>E?1:-1;if(p){let K=f,ee=b;D.setAttribute("width",String(K)),D.setAttribute("height",String(ee)),e.style.width=`${K}px`,e.style.height=`${ee}px`;let we=[`M ${E},0`,`L ${E},${Z-B}`,`Q ${E},${Z} ${E+re*B},${Z}`,`L ${$-re*B},${Z}`,`Q ${$},${Z} ${$},${Z+B}`,`L ${$},${W-B}`,`Q ${$},${W} ${$-re*B},${W}`,`L ${E+re*B},${W}`,`Q ${E},${W} ${E},${W+B}`,`L ${E},${ee}`].join(" ");k.setAttribute("d",we)}else{let K=b,ee=f;D.setAttribute("width",String(K)),D.setAttribute("height",String(ee)),e.style.width=`${K}px`,e.style.height=`${ee}px`;let we=[`M 0,${E}`,`L ${Z-B},${E}`,`Q ${Z},${E} ${Z},${E+re*B}`,`L ${Z},${$-re*B}`,`Q ${Z},${$} ${Z+B},${$}`,`L ${W-B},${$}`,`Q ${W},${$} ${W},${$-re*B}`,`L ${W},${E+re*B}`,`Q ${W},${E} ${W+B},${E}`,`L ${K},${E}`].join(" ");k.setAttribute("d",we)}}},Lc=class extends ms{applyShape(e,t,i,n,s,l,u,p){let f=Ki(t.color,this._ctx.getColorPalette());if(n<=0||f===void 0){e.style.display="none";return}e.style.display="",e.firstElementChild&&e.replaceChildren(),e.style.backgroundColor=f,p?(e.style.width="2px",e.style.height=`${n}px`):(e.style.width=`${n}px`,e.style.height="2px")}};let Oc=new Map;var Rc=class{get chipRenderers(){return this._chipRenderers}get groupUnderlines(){var e,t;return(e=(t=this._indicator)===null||t===void 0?void 0:t.underlines)!==null&&e!==void 0?e:Oc}get skipNextCollapseAnimation(){return this._skipNextCollapseAnimation}set skipNextCollapseAnimation(e){this._skipNextCollapseAnimation=e}constructor(e,t){this._ctx=e,this._callbacks=t,this._chipRenderers=new Map,this._indicator=null,this._skipNextCollapseAnimation=!1,this._pendingTransitionCleanups=new Map}update(){let e=this._ctx.group.model.getTabGroups(),t=new Set;for(let n of e)t.add(n.id),this._ensureChipForGroup(n),this._positionChipForGroup(n);for(let[n,s]of this._chipRenderers)if(!t.has(n)){var i;s.chip.element.remove(),s.chip.dispose(),(i=s.dragSourcesDisposable)===null||i===void 0||i.dispose(),s.disposable.dispose(),this._chipRenderers.delete(n)}this._updateTabGroupClasses()}refreshAccents(){for(let i of this._ctx.group.model.getTabGroups()){var e,t;let n=this._chipRenderers.get(i.id);n==null||(t=(e=n.chip).update)===null||t===void 0||t.call(e,{tabGroup:i})}this._updateTabGroupClasses()}positionAllChips(){if(this._chipRenderers.size!==0)for(let e of this._ctx.group.model.getTabGroups())this._positionChipForGroup(e)}updateDirection(){let e=this._ctx.getDirection()==="vertical";for(let[,t]of this._chipRenderers){let i=e?["top"]:["left"];t.dropTarget.setTargetZones(i),t.pointerDropTarget.setTargetZones(i)}}clearChipDropOverlays(){for(let[,i]of this._chipRenderers){var e,t;(e=i.dropTarget)===null||e===void 0||e.clearOverlay(),(t=i.pointerDropTarget)===null||t===void 0||t.clearOverlay()}}snapshotChipSizes(){let e=this._ctx.getDirection()==="vertical",t=new Map;for(let[i,n]of this._chipRenderers){let s=n.chip.element.getBoundingClientRect();t.set(i,e?s.height:s.width)}return t}positionUnderlines(){var e;(e=this._indicator)===null||e===void 0||e.positionUnderlines()}trackUnderlines(){var e;(e=this._indicator)===null||e===void 0||e.trackUnderlines()}setGroupDragImage(e,t,i){if(!e.dataTransfer)return;let n=this._ctx.getDirection()==="vertical",s=this._ctx.tabsList.cloneNode(!0);n?(s.classList.remove("dv-tabs-container-vertical","dv-vertical"),s.classList.add("dv-horizontal"),s.style.writingMode="horizontal-tb",s.style.height=`${this._ctx.tabsList.offsetWidth}px`):s.style.height=`${this._ctx.tabsList.offsetHeight}px`,s.style.width="auto",s.style.overflow="visible",s.style.pointerEvents="none";let l=Array.from(s.children),u=Array.from(this._ctx.tabsList.children);for(let D=l.length-1;D>=0;D--)u[D]!==i&&l[D].remove();let p=document.createElement("div");p.className="dv-groupview dv-active-group",p.style.position="fixed",p.style.top="-10000px",p.style.left="0px",p.style.height="auto",p.style.width="auto",p.style.pointerEvents="none";let g=document.createElement("div");g.className="dv-tabs-and-actions-container",g.style.height="auto",g.style.width="auto",p.appendChild(g),g.appendChild(s),this._ctx.accessor.element.appendChild(p);let f=s.querySelector(".dv-tab-group-chip"),b=i.getBoundingClientRect(),_=e.clientX-b.left,y=e.clientY-b.top;if(f){let D=f.getBoundingClientRect(),k=p.getBoundingClientRect(),C=D.left-k.left+_,T=D.top-k.top+y;e.dataTransfer.setDragImage(p,C,T)}else e.dataTransfer.setDragImage(p,_,y);requestAnimationFrame(()=>{p.remove()})}cleanupTransition(e){var t;(t=this._pendingTransitionCleanups.get(e))===null||t===void 0||t(),this._pendingTransitionCleanups.delete(e)}updateDragAndDropState(){let e=Je(this._ctx.accessor.options);for(let s of this._chipRenderers.values()){var t,i,n;s.chip.element.draggable=e.html5,(t=s.html5DragSource)===null||t===void 0||t.setDisabled(!e.html5),(i=s.pointerDragSource)===null||i===void 0||i.setDisabled(!e.pointer),(n=s.pointerDragSource)===null||n===void 0||n.setTouchOnly(!e.pointerHandlesMouse)}}disposeChipDrag(e){var t;let i=this._chipRenderers.get(e);i&&((t=i.dragSourcesDisposable)===null||t===void 0||t.dispose(),i.html5DragSource=void 0,i.pointerDragSource=void 0,i.dragSourcesDisposable=void 0)}_buildChipGhostElement(e){let t=getComputedStyle(e),i=e.cloneNode(!0);return Array.from(t).forEach(n=>{i.style.setProperty(n,t.getPropertyValue(n),t.getPropertyPriority(n))}),i.style.position="absolute",i}disposeAll(){var e;(e=this._indicator)===null||e===void 0||e.dispose(),this._indicator=null;for(let[,i]of this._pendingTransitionCleanups)i();this._pendingTransitionCleanups.clear();for(let[,i]of this._chipRenderers){var t;i.chip.element.remove(),i.chip.dispose(),(t=i.dragSourcesDisposable)===null||t===void 0||t.dispose(),i.disposable.dispose()}this._chipRenderers.clear()}_ensureIndicator(){var e,t,i;let n=((e=(t=this._ctx.accessor.options.theme)===null||t===void 0?void 0:t.tabGroupIndicator)!==null&&e!==void 0?e:"wrap")==="none"?Lc:Mc;this._indicator&&!(this._indicator instanceof n)&&(this._indicator.dispose(),this._indicator=null),(i=this._indicator)!==null&&i!==void 0||(this._indicator=new n({tabsList:this._ctx.tabsList,getTabGroups:()=>this._ctx.group.model.getTabGroups(),getActivePanelId:()=>{var s;return(s=this._ctx.group.activePanel)===null||s===void 0?void 0:s.id},getTabMap:()=>this._ctx.getTabMap(),getChipElement:s=>{var l;return(l=this._chipRenderers.get(s))===null||l===void 0?void 0:l.chip.element},getDirection:()=>this._ctx.getDirection(),getHeaderPosition:()=>this._ctx.group.model.headerPosition,getColorPalette:()=>this._ctx.accessor.tabGroupColorPalette}))}_createChipDragSources(e,t){let i=Je(this._ctx.accessor.options);e.element.draggable=i.html5;let n=h.getInstance(),s=()=>(n.setData([new d(this._ctx.accessor.id,this._ctx.group.id,null,t.id)],d.prototype),{dispose:()=>{n.clearData(d.prototype)}}),l=ft.createDragSource(e.element,{getData:s,disabled:!i.html5,isCancelled:()=>!Je(this._ctx.accessor.options).html5,onDragStart:g=>{"dataTransfer"in g&&g.dataTransfer&&this.setGroupDragImage(g,t,e.element),this._callbacks.onChipDragStart(t,e,g)},onDragEnd:g=>{var f,b;(f=(b=this._callbacks).onChipDragEnd)===null||f===void 0||f.call(b,t,e,g)}}),u=()=>{n.clearData(d.prototype)};e.element.addEventListener("dragend",u,{once:!0});let p=at.createDragSource(e.element,{getData:s,disabled:!i.pointer,touchOnly:!i.pointerHandlesMouse,isCancelled:()=>!Je(this._ctx.accessor.options).pointer,createGhost:()=>({element:this._buildChipGhostElement(e.element),offsetX:8,offsetY:8}),onDragStart:g=>{this._callbacks.onChipDragStart(t,e,g)}});return{html5DragSource:l,pointerDragSource:p,disposable:{dispose:()=>{l.dispose(),p.dispose(),e.element.removeEventListener("dragend",u)}}}}_ensureChipForGroup(e){let t=this._chipRenderers.get(e.id);if(t){if(!t.html5DragSource){let y=this._createChipDragSources(t.chip,e);t.html5DragSource=y.html5DragSource,t.pointerDragSource=y.pointerDragSource,t.dragSourcesDisposable=y.disposable}return}let i=this._ctx.accessor.options.createTabGroupChipComponent,n=i?i(e):new vs(this._ctx.accessor.tabGroupColorPalette);n.init({tabGroup:e,api:this._ctx.accessor.api});let s=this._createChipDragSources(n,e),l=[e.onDidChange(()=>{var y;(y=n.update)===null||y===void 0||y.call(n,{tabGroup:e}),this._updateTabGroupClasses()}),e.onDidPanelChange(()=>{this._positionChipForGroup(e),this._updateTabGroupClasses()}),e.onDidCollapseChange(()=>{this._updateTabGroupClasses()})],u=y=>{var D;(D=this._chipRenderers.get(e.id))===null||D===void 0||(D=D.pointerDragSource)===null||D===void 0||D.cancelPending(),this._callbacks.onChipContextMenu(e,y)};n instanceof vs?l.push(n.onContextMenu(u)):l.push(new bo(n.element,{onLongPress:u}),O(n.element,"contextmenu",u));let p={acceptedTargetZones:this._ctx.getDirection()==="vertical"?["top"]:["left"],overlayModel:{activationSize:{value:100,type:"percentage"}},canDisplayOverlay:(y,D)=>{if(this._ctx.group.locked||this._ctx.accessor.options.disableDnd)return!1;let k=v();if(this._ctx.accessor.id===k?.viewId){var C;return!(((C=this._ctx.accessor.options.theme)===null||C===void 0?void 0:C.tabAnimation)==="smooth"&&!k.tabGroupId)}return this._ctx.group.model.canDisplayOverlay(y,D,"tab")}},g=ft.createDropTarget(n.element,p),f=at.createDropTarget(n.element,p),b=y=>{this._callbacks.onChipDrop(e,y)};l.push(g,g.onDrop(b),f,f.onDrop(b));let _=new x(...l);this._chipRenderers.set(e.id,{chip:n,html5DragSource:s.html5DragSource,pointerDragSource:s.pointerDragSource,dragSourcesDisposable:s.disposable,disposable:_,dropTarget:g,pointerDropTarget:f}),e.collapsed&&(this._skipNextCollapseAnimation=!0)}_positionChipForGroup(e){let t=this._chipRenderers.get(e.id);if(!t)return;let i=t.chip.element,n=e.panelIds;if(n.length===0){i.remove();return}let s=n[0],l=this._ctx.getTabMap().get(s);if(!l){i.remove();return}let u=l.value.element;i.nextSibling!==u&&this._ctx.tabsList.insertBefore(i,u)}_updateTabGroupClasses(){let e=this._ctx.group.model.getTabGroups(),t=this._ctx.getTabs(),i=this._ctx.getTabMap(),n=!1,s=new Map;for(let p of e)for(let g of p.panelIds)s.set(g,p);for(let p of t){let g=p.value,f=g.panel.id,b=s.get(f),_=!!b;if(A(g.element,"dv-tab--grouped",_),b){let y=b.panelIds,D=y[0]===f,k=y[y.length-1]===f;A(g.element,"dv-tab--group-first",D),A(g.element,"dv-tab--group-last",k),ji(g.element,b.color,this._ctx.accessor.tabGroupColorPalette);let C=g.element.classList.contains("dv-tab--group-collapsed");if(!b.collapsed&&C){var l;n=!0,g.element.classList.remove("dv-tab--group-collapsed"),g.element.classList.add("dv-tab--group-expanding"),(l=this._pendingTransitionCleanups.get(f))===null||l===void 0||l();let T=()=>{g.element.classList.remove("dv-tab--group-expanding"),g.element.style.removeProperty("width"),g.element.removeEventListener("transitionend",T),clearTimeout(M),this._pendingTransitionCleanups.delete(f)},M=setTimeout(T,300);this._pendingTransitionCleanups.set(f,T),g.element.addEventListener("transitionend",T)}}else A(g.element,"dv-tab--group-first",!1),A(g.element,"dv-tab--group-last",!1),g.element.classList.remove("dv-tab--group-collapsed","dv-tab--group-expanding"),g.element.style.removeProperty("width"),g.element.style.removeProperty("--dv-tab-group-color")}let u=new Set;for(let p of e)if(u.add(p.id),p.collapsed&&p.panelIds.some(g=>{let f=i.get(g);return f&&!f.value.element.classList.contains("dv-tab--group-collapsed")}))if(this._skipNextCollapseAnimation){let g=[];for(let f of p.panelIds){let b=i.get(f);b&&(b.value.element.style.transition="none",b.value.element.classList.add("dv-tab--group-collapsed"),g.push(b.value.element))}if(g.length>0){g[0].offsetHeight;for(let f of g)f.style.removeProperty("transition")}}else{n=!0;let g=this._ctx.getDirection()==="vertical";for(let f of p.panelIds){let b=i.get(f);if(b&&!b.value.element.classList.contains("dv-tab--group-collapsed")){let _=b.value.element.getBoundingClientRect();g?b.value.element.style.height=`${_.height}px`:b.value.element.style.width=`${_.width}px`,b.value.element.offsetHeight,b.value.element.classList.add("dv-tab--group-collapsed")}}}this._skipNextCollapseAnimation=!1,this._ensureIndicator(),this._indicator&&(this._indicator.syncUnderlineElements(u),n?this._indicator.trackUnderlines():this._indicator.positionUnderlines())}};function mi(e,t){return t==="vertical"?e.height:e.width}function Ji(e,t){return t==="vertical"?e.top:e.left}function fs(e,t){return t==="vertical"?e.clientY:e.clientX}var $c=class extends x{get _tabs(){return this.host.tabItems}get _tabMap(){return this.host.tabMap}get _tabsList(){return this.host.tabsList}get _direction(){return this.host.direction}get group(){return this.host.groupPanel}get accessor(){return this.host.component}get _tabGroupManager(){return this.host.tabGroupManager}get _wrapMode(){return this._tabsList.classList.contains(wo)}get animState(){return this._animState}set animState(e){this._animState=e}get pendingCollapse(){return this._pendingCollapse}set pendingCollapse(e){this._pendingCollapse=e}set voidContainerElement(e){this._voidContainer=e}constructor(e){super(),this.host=e,this._animState=null,this._pendingMarginCleanups=new Map,this._pendingCollapse=!1,this._flipTransitionCleanup=null,this._voidContainer=null,this._extendedDropZone=null,this._pointerInsideTabsList=!1,this._wrapIndicatorEl=null,this.addDisposables({dispose:()=>{var t;(t=this._flipTransitionCleanup)===null||t===void 0||t.call(this)}})}setExtendedDropZone(e){this._extendedDropZone=e}setExternalInsertionIndex(e){this._animState&&e!==this._animState.currentInsertionIndex&&(this._animState.currentInsertionIndex=e,this.applyDragOverTransforms())}clearExternalAnimState(){this._animState&&(this.resetTabTransforms(),this._animState.sourceIndex===-1?this._animState=null:this._animState.currentInsertionIndex=null)}snapshotTabPositions(){let e=new Map;for(let t of this._tabs)e.set(t.value.panel.id,t.value.element.getBoundingClientRect());return e}_mainAxisSize(e){return mi(e,this._direction)}_mainAxisStart(e){return Ji(e,this._direction)}_mainAxisCoord(e,t){return fs({clientX:e,clientY:t},this._direction)}get _gapMarginProperty(){return this._direction==="vertical"?"margin-top":"margin-left"}getAverageTabSize(){if(this._tabs.length===0)return 0;let e=0;for(let t of this._tabs)e+=this._mainAxisSize(t.value.element.getBoundingClientRect());return e/this._tabs.length}handlePointerDragMove(e,t){let i=pe(this._tabsList).elementFromPoint(e,t);if(!(i&&(this._tabsList.contains(i)||this._extendedDropZone&&this._extendedDropZone.contains(i)))){this._pointerInsideTabsList&&(this._pointerInsideTabsList=!1,this.processDragLeave(i));return}this._pointerInsideTabsList=!0,this.processDragOver(e,t)}handlePointerDragEnd(e){if(e&&this._animState&&this._animState.sourceIndex!==-1&&this._animState.currentInsertionIndex!==null&&this.isPointInsideTabsList(e.clientX,e.clientY)){let t=this._animState.sourceTabGroupId;if(t){let i=this._animState.currentInsertionIndex;this._animState=null,this.commitGroupMove(t,i)}else this.commitPointerReorder(e.pointerEvent)}this._pointerInsideTabsList=!1,this.resetDragAnimation()}isPointInsideTabsList(e,t){let i=pe(this._tabsList).elementFromPoint(e,t);return!!i&&this._tabsList.contains(i)}commitPointerReorder(e){let t=this._animState;if(t?.currentInsertionIndex==null)return;let i=t.currentInsertionIndex,n=t.sourceIndex,s=i-(n!==-1&&n<i?1:0);this._animState=null,this.clearWrapDropIndicator(),this.uncollapseSourceTab(t.sourceTabId),s!==n&&this.host.fireDrop({event:e,index:s,targetTabGroupId:null})}processDragOver(e,t){if(this.accessor.options.disableDnd||(this._dropStaleAnimState(),!this._animState&&!this._initAnimStateForExternalDrag()))return!1;if(this._animState.sourceIndex!==-1){var i;(i=this.group.model.dropTargetContainer)===null||i===void 0||(i=i.model)===null||i===void 0||i.clear()}return this.handleDragOver({clientX:e,clientY:t}),!0}_dropStaleAnimState(){if(!this._animState)return;let e=v();e?.tabGroupId&&e.groupId!==this.group.id&&this._animState.sourceTabGroupId!==e.tabGroupId&&(this._animState=null)}_initAnimStateForExternalDrag(){var e;let t=v();if(((e=this.accessor.options.theme)===null||e===void 0?void 0:e.tabAnimation)==="default"&&!t?.tabGroupId||!t||!(t.panelId||t.tabGroupId)||t.groupId===this.group.id)return!1;let i=this.getAverageTabSize();return this._animState=t.tabGroupId?this._makeGroupDragAnimState(t,i):this._makeTabDragAnimState(t,i),!0}_makeGroupDragAnimState(e,t){var i;let n=this.accessor.getPanel(e.groupId),s=n?.model.getTabGroups().find(u=>u.id===e.tabGroupId),l=t*((i=s?.panelIds.length)!==null&&i!==void 0?i:1)+t;return{sourceTabId:"",sourceIndex:-1,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:e.tabGroupId,sourceGroupPanelIds:s?new Set(s.panelIds):new Set,sourceChipSize:t,cursorOffsetFromDragStart:l/2,sourceGapSize:l,containerStart:this._mainAxisStart(this._tabsList.getBoundingClientRect())}}_makeTabDragAnimState(e,t){return{sourceTabId:e.panelId,sourceIndex:-1,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:null,sourceGroupPanelIds:null,sourceChipSize:0,cursorOffsetFromDragStart:t/2,sourceGapSize:t,containerStart:this._mainAxisStart(this._tabsList.getBoundingClientRect())}}processDragLeave(e){var t;if(this._animState&&!(e&&this._tabsList.contains(e))){if(e&&(!((t=this._extendedDropZone)===null||t===void 0)&&t.contains(e))){this.resetTabTransforms(),this._animState.currentInsertionIndex=null;return}this._voidContainer&&e&&(e===this._voidContainer||this._voidContainer.contains(e))||(this.resetTabTransforms(),this._animState.sourceIndex===-1?(this.clearHeaderAnchorOverlay(),this._animState=null):this._animState.currentInsertionIndex=null)}}clearHeaderAnchorOverlay(){var e;let t=this.group.model.dropTargetContainer,i=t?.renderedOutline;i&&![this._tabsList,this._voidContainer,this._extendedDropZone].some(n=>n?.contains(i))||t==null||(e=t.model)===null||e===void 0||e.clear()}handleDragOver(e){var t,i;if(!this._animState)return;if(this._wrapMode&&!this._animState.sourceTabGroupId){var n;this.handleWrappedDragOver(e.clientX,(n=e.clientY)!==null&&n!==void 0?n:0);return}let s=this._mainAxisCoord(e.clientX,(t=e.clientY)!==null&&t!==void 0?t:0),l=this._buildFirstPanelToGroupMap(),u=this._computeDragOverInsertionIndex(s,l),p=null;if(u!==null&&this._tabGroupManager.chipRenderers.size>0){let g=this._resolveInsertionAgainstTabGroups(s,u,l);u=g.insertionIndex,p=g.targetTabGroupId}u===this._animState.currentInsertionIndex&&p===this._animState.targetTabGroupId||(this._animState.currentInsertionIndex=u,this._animState.targetTabGroupId=p,((i=this.accessor.options.theme)===null||i===void 0?void 0:i.tabAnimation)==="smooth"&&this.applyDragOverTransforms())}_buildFirstPanelToGroupMap(){let e=new Map;if(this._tabGroupManager.chipRenderers.size===0)return e;for(let t of this.group.model.getTabGroups())t.id!==this._animState.sourceTabGroupId&&t.panelIds.length>0&&e.set(t.panelIds[0],t.id);return e}_computeDragOverInsertionIndex(e,t){let i=this._animState,n=i.sourceGroupPanelIds,s=e-i.cursorOffsetFromDragStart-i.containerStart,l=0,u=null;for(let b=0;b<this._tabs.length;b++){let _=this._tabs[b].value;if(_.panel.id===i.sourceTabId||n?.has(_.panel.id))continue;let y=t.get(_.panel.id);if(y){var p;let C=(p=i.chipSizes.get(y))!==null&&p!==void 0?p:0;if(l+C>s){var g;(g=u)!==null&&g!==void 0||(u=b);break}l+=C}let D=i.tabPositions.get(_.panel.id),k=this._mainAxisSize(D??_.element.getBoundingClientRect());if(l+k/2<=s)l+=k,u=b+1;else{var f;(f=u)!==null&&f!==void 0||(u=b);break}}return u}_accumulatedSizeUpTo(e,t){let i=this._animState,n=i.sourceGroupPanelIds,s=0;for(let u=0;u<this._tabs.length;u++){let p=this._tabs[u].value;if(p.panel.id===i.sourceTabId||n?.has(p.panel.id))continue;if(u>=e)break;let g=t.get(p.panel.id);if(g){var l;s+=(l=i.chipSizes.get(g))!==null&&l!==void 0?l:0}let f=i.tabPositions.get(p.panel.id);s+=this._mainAxisSize(f??p.element.getBoundingClientRect())}return s}_resolveInsertionAgainstTabGroups(e,t,i){let n=!!this._animState.sourceTabGroupId,s=this._accumulatedSizeUpTo(t,i);for(let l of this.group.model.getTabGroups()){let u=this._evaluateTabGroupForInsertion(l,e,t,s,n);if(u)return u}return{insertionIndex:t,targetTabGroupId:null}}_evaluateTabGroupForInsertion(e,t,i,n,s){let l=this._resolveGroupRange(e);if(!l)return null;let{firstIdx:u,lastIdx:p}=l,g=i>=u&&i<=p,f=!g&&i===u-1;return!g&&!f?null:s?this._resolveGroupDragTarget(i,u,p,g):this._resolveTabDragTarget(e,t,i,n,u,f)}_resolveGroupRange(e){let t=this._animState,i=t.sourceGroupPanelIds,n=e.panelIds.filter(u=>u!==t.sourceTabId&&!i?.has(u));if(n.length===0)return null;let s=this._tabs.findIndex(u=>u.value.panel.id===n[0]),l=this._tabs.findIndex(u=>u.value.panel.id===n[n.length-1]);return s===-1||l===-1?null:{firstIdx:s,lastIdx:l}}_resolveGroupDragTarget(e,t,i,n){return n?{insertionIndex:e<(t+i+1)/2?t:i+1,targetTabGroupId:null}:{insertionIndex:e,targetTabGroupId:null}}_resolveTabDragTarget(e,t,i,n,s,l){var u;let p=this._animState,g=(u=p.chipSizes.get(e.id))!==null&&u!==void 0?u:0;if(l)return this._onlySourceBetween(i,s)?t>=(e.collapsed?p.containerStart+n+g/2:p.containerStart+n+g)?{insertionIndex:s,targetTabGroupId:e.id}:{insertionIndex:i,targetTabGroupId:null}:null;let f=p.containerStart+n+g;return i===s?{insertionIndex:i,targetTabGroupId:t>=f?e.id:null}:{insertionIndex:i,targetTabGroupId:e.id}}_onlySourceBetween(e,t){let i=this._animState;for(let s=e;s<t;s++){var n;let l=this._tabs[s].value.panel.id;if(l!==i.sourceTabId&&!(!((n=i.sourceGroupPanelIds)===null||n===void 0)&&n.has(l)))return!1}return!0}handleWrappedDragOver(e,t){if(!this._animState)return;let i=this.computeWrappedInsertionIndex(e,t);i===this._animState.currentInsertionIndex&&this._animState.targetTabGroupId===null||(this._animState.currentInsertionIndex=i,this._animState.targetTabGroupId=null,this.updateWrapDropIndicator(i))}computeWrappedInsertionIndex(e,t){var i;let n=this._direction==="vertical",s=this._wrappedDragEntries();if(s.length===0)return this._tabs.length;let l=n?e:t,u=n?t:e,p=D=>n?D.left:D.top,g=D=>n?D.right:D.bottom,f=D=>n?D.top:D.left,b=D=>n?D.height:D.width,_=this._bucketWrappedLines(s,p,g),y=[...((i=_.find(D=>l>=D.start&&l<=D.end))!==null&&i!==void 0?i:this._nearestWrappedLine(_,l)).items].sort((D,k)=>f(D.rect)-f(k.rect));for(let D of y)if(u<f(D.rect)+b(D.rect)/2)return D.index;return y[y.length-1].index+1}_wrappedDragEntries(){var e,t;let i=(e=this._animState)===null||e===void 0?void 0:e.sourceTabId,n=(t=this._animState)===null||t===void 0?void 0:t.sourceGroupPanelIds,s=[];for(let l=0;l<this._tabs.length;l++){let u=this._tabs[l].value;u.panel.id!==i&&(n?.has(u.panel.id)||s.push({index:l,rect:u.element.getBoundingClientRect()}))}return s}_bucketWrappedLines(e,t,i){let n=[];for(let s of e){let l=t(s.rect),u=n.find(p=>Math.abs(p.start-l)<=2);u?(u.items.push(s),u.end=Math.max(u.end,i(s.rect))):n.push({start:l,end:i(s.rect),items:[s]})}return n.sort((s,l)=>s.start-l.start),n}_nearestWrappedLine(e,t){let i=n=>t<n.start?n.start-t:t-n.end;return e.reduce((n,s)=>i(s)<i(n)?s:n,e[0])}updateWrapDropIndicator(e){var t;this.clearWrapDropIndicator();let i=this._tabs.length;if(i===0)return;let n=(t=this._animState)===null||t===void 0?void 0:t.sourceTabId;if(e<i){let s=this._tabs[e].value.element;if(this._tabs[e].value.panel.id===n)return;s.classList.add("dv-tab--reorder-before"),this._wrapIndicatorEl=s}else{let s=this._tabs[i-1].value.element;s.classList.add("dv-tab--reorder-after"),this._wrapIndicatorEl=s}}clearWrapDropIndicator(){var e;(e=this._wrapIndicatorEl)===null||e===void 0||e.classList.remove("dv-tab--reorder-before","dv-tab--reorder-after"),this._wrapIndicatorEl=null}_removeClassInstantlyBatch(e,t){let i=[];for(let n of e)n.classList.contains(t)&&(n.style.transition="none",A(n,t,!1),i.push(n));if(i.length>0){i[0].getBoundingClientRect();for(let n of i)n.style.removeProperty("transition")}}uncollapseSourceTab(e){let t=this._tabMap.get(e);t&&this._removeClassInstantlyBatch([t.value.element],"dv-tab--dragging")}applyDragOverTransforms(e=!1){var t;if(this._wrapMode)return;if(((t=this._animState)===null||t===void 0?void 0:t.currentInsertionIndex)==null){this.resetTabTransforms();return}if(this._pendingCollapse)return;let i=this._animState.currentInsertionIndex,n=this._computeGapSize(),s=this._computeChipToShift(i);this._applyGapMargins(i,n,s,e)}_computeGapSize(){let e=this._animState;if(e.sourceTabGroupId&&e.sourceGroupPanelIds)return e.sourceGapSize;let t=e.tabPositions.get(e.sourceTabId);return t?this._mainAxisSize(t):this.getAverageTabSize()}_computeChipToShift(e){if(this._tabGroupManager.chipRenderers.size===0)return null;for(let t of this.group.model.getTabGroups()){let i=this._chipToShiftForGroup(t,e);if(i!==void 0)return i}return null}_chipToShiftForGroup(e,t){let i=this._animState;if(e.id===i.sourceTabGroupId||e.panelIds.includes(i.sourceTabId))return;let n=e.panelIds.filter(l=>{var u;return l!==i.sourceTabId&&!(!((u=i.sourceGroupPanelIds)===null||u===void 0)&&u.has(l))});if(n.length===0)return;let s=this._tabs.findIndex(l=>l.value.panel.id===n[0]);if((!i.targetTabGroupId||i.targetTabGroupId===e.id&&e.collapsed)&&!(s<t)){if(this._onlySourceBetween(t,s)){let l=this._tabGroupManager.chipRenderers.get(e.id);if(l)return l.chip.element}return null}}_applyGapMargins(e,t,i,n){let s=this._animState,l=s.sourceGroupPanelIds,u=!1;for(let[p,g]of this._tabGroupManager.chipRenderers)p!==s.sourceTabGroupId&&this._clearMargin(g.chip.element,n);i&&(this._setMargin(i,`${t}px`,n),u=!0);for(let p=0;p<this._tabs.length;p++){let g=this._tabs[p].value;g.panel.id!==s.sourceTabId&&(l?.has(g.panel.id)||(!u&&p>=e?(this._setMargin(g.element,`${t}px`,n),u=!0):this._clearMargin(g.element,n)))}this._tabGroupManager.trackUnderlines()}_shiftingClass(e){return e.classList.contains("dv-tab-group-chip")?"dv-tab-group-chip--shifting":"dv-tab--shifting"}_setMargin(e,t,i){let n=this._gapMarginProperty;i?(e.style.transition="none",e.style.setProperty(n,t),e.getBoundingClientRect(),e.style.removeProperty("transition")):e.style.setProperty(n,t),A(e,this._shiftingClass(e),!0)}_clearMargin(e,t){let i=this._shiftingClass(e),n=this._gapMarginProperty,s=this._pendingMarginCleanups.get(e);if(s&&s(),t||!e.style.getPropertyValue(n))e.style.removeProperty(n),A(e,i,!1);else{e.style.setProperty(n,"0px"),A(e,i,!0);let l=()=>{e.style.removeProperty(n),A(e,i,!1),e.removeEventListener("transitionend",l),clearTimeout(u),this._pendingMarginCleanups.delete(e)},u=setTimeout(l,300);this._pendingMarginCleanups.set(e,l),e.addEventListener("transitionend",l)}}resetTabTransforms(){this.clearWrapDropIndicator();for(let[,e]of this._pendingMarginCleanups)e();this._pendingMarginCleanups.clear();for(let e of this._tabs)e.value.element.style.removeProperty("margin-left"),e.value.element.style.removeProperty("margin-right"),e.value.element.style.removeProperty("margin-top"),e.value.element.style.removeProperty("margin-bottom"),e.value.element.style.removeProperty("transform"),A(e.value.element,"dv-tab--shifting",!1);for(let[,e]of this._tabGroupManager.chipRenderers)e.chip.element.style.removeProperty("margin-left"),e.chip.element.style.removeProperty("margin-top"),A(e.chip.element,"dv-tab-group-chip--shifting",!1);this._tabGroupManager.positionUnderlines()}commitGroupMove(e,t){let i=v();if(this._tabGroupManager.disposeChipDrag(e),this._tabGroupManager.clearChipDropOverlays(),this.group.model.getTabGroups().some(l=>l.id===e)){var n;if(((n=this.accessor.options.theme)===null||n===void 0?void 0:n.tabAnimation)==="smooth"){this._clearGroupDragClasses(e);let l=this.snapshotTabPositions();this.resetTabTransforms(),this.group.model.moveTabGroup(e,t),this.runFlipAnimation(l,"",!1)}else this._tabGroupManager.skipNextCollapseAnimation=!0,this.group.model.moveTabGroup(e,t)}else if(i){var s;this.resetTabTransforms(),this.accessor.moveGroupOrPanel({from:{groupId:i.groupId,tabGroupId:(s=i.tabGroupId)!==null&&s!==void 0?s:e},to:{group:this.group,position:"center",index:t}})}}_clearGroupDragClasses(e){let t=this._tabGroupManager.chipRenderers.get(e);t&&this._removeClassInstantlyBatch([t.chip.element],"dv-tab-group-chip--dragging"),this._removeClassInstantlyBatch(this._tabs.map(n=>n.value.element),"dv-tab--dragging");let i=this._tabGroupManager.groupUnderlines.get(e);i&&i.style.removeProperty("display"),this._tabGroupManager.skipNextCollapseAnimation=!0}resetDragAnimation(){if(this._pendingCollapse=!1,this._animState){this.resetTabTransforms(),this._animState.sourceTabGroupId?this._clearGroupDragClasses(this._animState.sourceTabGroupId):this._removeClassInstantlyBatch(this._tabs.map(e=>e.value.element),"dv-tab--dragging"),this._animState=null;for(let[,e]of this._tabGroupManager.groupUnderlines)e.style.removeProperty("display")}}runFlipAnimation(e,t,i=!1,n){if(this._wrapMode)return;let s=!1;for(let l=0;l<this._tabs.length;l++)this._applyFlipTransform(this._tabs[l],l,t,i,e,n)&&(s=!0);s&&this._scheduleFlipReset()}_applyFlipTransform(e,t,i,n,s,l){let u=this._direction==="vertical",p=e.value.panel.id;if(p===i){if(!n)return!1;let _=e.value.element.getBoundingClientRect();return e.value.element.style.transform=u?`translateY(${_.height}px)`:`translateX(${_.width}px)`,A(e.value.element,"dv-tab--shifting",!0),!0}if(l!==void 0&&(t<l.from||t>l.to))return!1;let g=s.get(p);if(!g)return!1;let f=e.value.element.getBoundingClientRect(),b=u?g.top-f.top:g.left-f.left;return Math.abs(b)<1?!1:(e.value.element.style.transform=u?`translateY(${b}px)`:`translateX(${b}px)`,A(e.value.element,"dv-tab--shifting",!0),!0)}_scheduleFlipReset(){requestAnimationFrame(()=>{var e;for(let n of this._tabs)n.value.element.style.transform&&(n.value.element.style.transform="");this._tabGroupManager.trackUnderlines(),(e=this._flipTransitionCleanup)===null||e===void 0||e.call(this);let t=n=>{if(n.propertyName==="transform"){i();for(let s of this._tabs)A(s.value.element,"dv-tab--shifting",!1);this._tabGroupManager.positionUnderlines()}},i=()=>{this._tabsList.removeEventListener("transitionend",t),this._flipTransitionCleanup=null};this._flipTransitionCleanup=i,this._tabsList.addEventListener("transitionend",t)})}},Nc=class extends x{get _animState(){return this._reorder.animState}set _animState(e){this._reorder.animState=e}get _pendingCollapse(){return this._reorder.pendingCollapse}set _pendingCollapse(e){this._reorder.pendingCollapse=e}get tabItems(){return this._tabs}get tabMap(){return this._tabMap}get tabsList(){return this._tabsList}get groupPanel(){return this.group}get component(){return this.accessor}get tabGroupManager(){return this._tabGroupManager}fireDrop(e){this._onDrop.fire(e)}setOverflowExclude(e){this._overflowExclude=e,this.refreshOverflow()}setForcedOverflow(e){this._forcedOverflow=e,this.refreshOverflow()}refreshOverflow(){this._showTabsOverflowControl&&this.toggleDropdown({reset:!1}),this._applyPinnedSticky()}setPinnedSticky(e){this._pinnedSticky!==e&&(this._pinnedSticky=e,this._applyPinnedSticky())}_applyPinnedSticky(){let e=this._pinnedSticky?this._tabs.filter(i=>this._overflowExclude(i.value.panel.id)):[];if(e.length===0&&!this._hasPinnedStickyStyling)return;for(let i of this._tabs){let n=i.value.element;n.classList.contains("dv-tab--pinned-sticky")&&(n.classList.remove("dv-tab--pinned-sticky"),n.style.removeProperty("--dv-pinned-sticky-left"))}if(e.length===0){this._hasPinnedStickyStyling=!1;return}let t=e.map(i=>i.value.element.offsetLeft);e.forEach((i,n)=>{let s=i.value.element;s.classList.add("dv-tab--pinned-sticky"),s.style.setProperty("--dv-pinned-sticky-left",`${t[n]}px`)}),this._hasPinnedStickyStyling=!0}get showTabsOverflowControl(){return this._showTabsOverflowControl}set showTabsOverflowControl(e){if(this._showTabsOverflowControl!=e)if(this._showTabsOverflowControl=e,e){let t=new R(this._tabsList);this._observerDisposable.value=new x(t,t.onDidChange(i=>{let n=i.hasScrollX||i.hasScrollY;this.toggleDropdown({reset:!n}),this._applyPinnedSticky(),this._tabGroupManager.groupUnderlines.size>0&&this._tabGroupManager.positionUnderlines()}),O(this._tabsList,"scroll",()=>{this.toggleDropdown({reset:!1}),this._applyPinnedSticky(),this._tabGroupManager.groupUnderlines.size>0&&this._tabGroupManager.positionUnderlines()}))}else this._observerDisposable.value=w.NONE}get element(){return this._element}get tabsListElement(){return this._tabsList}set voidContainer(e){var t;(t=this._voidContainerListeners)===null||t===void 0||t.dispose(),this._voidContainerListeners=null,this._reorder.voidContainerElement=e,e&&(this._voidContainerListeners=new x(O(e,"dragover",i=>{this._animState&&i.preventDefault()}),O(e,"drop",i=>{var n;!((n=this._animState)===null||n===void 0)&&n.sourceTabGroupId&&this._animState.currentInsertionIndex!==null&&(i.preventDefault(),i.stopPropagation(),this.handleVoidDrop())})))}handleVoidDrop(){var e,t;if(!(!((e=this._animState)===null||e===void 0)&&e.sourceTabGroupId))return!1;let i=this._animState.sourceTabGroupId,n=(t=this._animState.currentInsertionIndex)!==null&&t!==void 0?t:this._tabs.length;return this._animState=null,this._commitGroupMove(i,n),!0}get panels(){return this._tabs.map(e=>e.value.panel.id)}get size(){return this._tabs.length}get tabs(){return this._tabs.map(e=>e.value)}get direction(){return this._direction}set direction(e){if(this._direction!==e){this._direction=e,this._tabsList.setAttribute("aria-orientation",e==="vertical"?"vertical":"horizontal"),this._scrollbar&&(this._scrollbar.orientation=e),F(this._tabsList,"dv-horizontal","dv-vertical"),e==="vertical"?J(this._tabsList,"dv-tabs-container-vertical","dv-vertical"):(F(this._tabsList,"dv-tabs-container-vertical"),J(this._tabsList,"dv-horizontal"));for(let t of this._tabs)t.value.setDirection(e);this._tabGroupManager.updateDirection()}}constructor(e,t,i){super(),this.group=e,this.accessor=t,this._observerDisposable=new S,this._pointerActivation=new S,this._scrollbar=null,this._tabs=[],this._tabMap=new Map,this.selectedIndex=-1,this._showTabsOverflowControl=!1,this._overflowExclude=()=>!1,this._forcedOverflow=()=>!1,this._pinnedSticky=!1,this._hasPinnedStickyStyling=!1,this._direction="horizontal",this._voidContainerListeners=null,this._onTabDragStart=new G,this.onTabDragStart=this._onTabDragStart.event,this._onDrop=new G,this.onDrop=this._onDrop.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._onOverflowTabsChange=new G,this.onOverflowTabsChange=this._onOverflowTabsChange.event,this._tabsList=document.createElement("div"),this._tabsList.className="dv-tabs-container",this._tabsList.setAttribute("role","tablist"),this._tabsList.setAttribute("aria-orientation",this._direction==="vertical"?"vertical":"horizontal"),this.showTabsOverflowControl=i.showTabsOverflowControl,t.options.scrollbars==="native"?this._element=this._tabsList:(this._scrollbar=new as(this._tabsList),this._scrollbar.orientation=this.direction,this._element=this._scrollbar.element,this.addDisposables(this._scrollbar)),this._tabGroupManager=new Rc({group:this.group,accessor:this.accessor,tabsList:this._tabsList,getTabs:()=>this._tabs,getTabMap:()=>this._tabMap,getDirection:()=>this._direction},{onChipContextMenu:(s,l)=>{var u;(u=this.accessor.contextMenuService)===null||u===void 0||u.showForChip(s,this.group,l)},onChipDragStart:(s,l,u)=>{this._handleChipDragStart(s,l,u)},onChipDragEnd:()=>{this._reorder.resetDragAnimation()},onChipDrop:(s,l)=>{this._handleChipDrop(s,l)}}),this._reorder=new $c(this);let n=at.createDropTarget(this._tabsList,{acceptedTargetZones:["center"],canDisplayOverlay:()=>!1,isHitTestTransparent:()=>{let s=v();return s?.viewId!==this.accessor.id||s.groupId!==this.group.id?!0:s.panelId===null&&!s.tabGroupId}});this.addDisposables(n,this._onOverflowTabsChange,this._observerDisposable,this._pointerActivation,this._onWillShowOverlay,this._onDrop,this._onTabDragStart,this._reorder,Fi.getInstance().onDragEnd(s=>{this._reorder.handlePointerDragEnd(s)}),Fi.getInstance().onDragMove(s=>{this._reorder.handlePointerDragMove(s.clientX,s.clientY)}),O(this.element,"pointerdown",s=>{s.defaultPrevented||s.button===0&&this.accessor.doSetGroupActive(this.group)}),O(this._tabsList,"wheel",s=>{let l=this._direction==="vertical",u=l?s.deltaY||s.deltaX:s.deltaX||s.deltaY;if(u===0)return;let p=l?this._tabsList.scrollHeight-this._tabsList.clientHeight:this._tabsList.scrollWidth-this._tabsList.clientWidth;if(p<=0)return;let g=l?this._tabsList.scrollTop:this._tabsList.scrollLeft;u<0&&g<=0||u>0&&g>=p||(s.preventDefault(),s.stopPropagation(),l?this._tabsList.scrollTop=g+u:this._tabsList.scrollLeft=g+u)},{passive:!1}),O(this._tabsList,"keydown",s=>{this._onKeyDown(s)}),O(this._tabsList,"dragover",s=>{this._reorder.processDragOver(s.clientX,s.clientY)&&s.preventDefault()},!0),O(this._tabsList,"dragleave",s=>{this._reorder.processDragLeave(s.relatedTarget)},!0),O(this._tabsList,"dragend",()=>{this._reorder.resetDragAnimation()}),O(this._tabsList,"drop",s=>{var l,u,p;if(((l=this._animState)===null||l===void 0?void 0:l.currentInsertionIndex)==null||((u=this.accessor.options.theme)===null||u===void 0?void 0:u.tabAnimation)!=="smooth"&&!this._animState.sourceTabGroupId)return;s.stopPropagation(),s.preventDefault(),(p=this.group.model.dropTargetContainer)===null||p===void 0||(p=p.model)===null||p===void 0||p.clear();let g=this._animState;if(this._animState=null,this._pendingCollapse=!1,g.sourceTabGroupId){this._commitGroupMove(g.sourceTabGroupId,g.currentInsertionIndex);return}let f=g.currentInsertionIndex,b=g.sourceIndex,_=f-(b!==-1&&b<f?1:0),y=this.group.model.getTabGroupForPanel(g.sourceTabId);if(_===b&&!g.targetTabGroupId&&!y){this._reorder.uncollapseSourceTab(g.sourceTabId),this.resetTabTransforms();return}this._reorder.uncollapseSourceTab(g.sourceTabId);let D=this.snapshotTabPositions();this.resetTabTransforms(),this._onDrop.fire({event:s,index:_,targetTabGroupId:g.targetTabGroupId}),this.runFlipAnimation(D,g.sourceTabId,g.sourceIndex===-1,{from:Math.min(b,_),to:Math.max(b,_)})},!0),w.from(()=>{var s;(s=this._voidContainerListeners)===null||s===void 0||s.dispose(),this._reorder.resetDragAnimation(),this._tabGroupManager.disposeAll();for(let{value:l,disposable:u}of this._tabs)u.dispose(),l.dispose();this._tabs=[],this._tabMap.clear()}))}indexOf(e){return this._tabs.findIndex(t=>t.value.panel.id===e)}getTabId(e){var t;return(t=this._tabMap.get(e))===null||t===void 0?void 0:t.value.element.id}getPanelForTab(e){for(let{value:t}of this._tabs)if(t.element===e||t.element.contains(e))return t.panel}isActive(e){return this.selectedIndex>-1&&this._tabs[this.selectedIndex].value===e}_onKeyDown(e){let t=this._tabs.findIndex(u=>u.value.element===e.target);if(t===-1)return;let i=this._direction==="vertical",n=i?"ArrowDown":"ArrowRight",s=i?"ArrowUp":"ArrowLeft",l=this._tabs.length-1;switch(e.key){case n:e.preventDefault(),this._focusTab(Math.min(t+1,l));break;case s:e.preventDefault(),this._focusTab(Math.max(t-1,0));break;case"Home":e.preventDefault(),this._focusTab(0);break;case"End":e.preventDefault(),this._focusTab(l);break;case"Enter":case" ":e.preventDefault(),this.accessor.withOrigin("user",()=>this._tabs[t].value.panel.api.setActive());break;case"Delete":case"Backspace":e.preventDefault(),this._closeTab(t);break}}_closeTab(e){var t,i,n,s,l;let u=(t=this._tabs[e])===null||t===void 0?void 0:t.value;if(!u)return;let p=(i=(n=(s=this._tabs[e+1])===null||s===void 0?void 0:s.value)!==null&&n!==void 0?n:(l=this._tabs[e-1])===null||l===void 0?void 0:l.value)===null||i===void 0?void 0:i.panel.id;if(u.panel.api.close(),p!==void 0){let g=this._tabs.findIndex(f=>f.value.panel.id===p);g>-1&&this._focusTab(g)}}_focusTab(e){for(let t=0;t<this._tabs.length;t++)this._tabs[t].value.element.tabIndex=t===e?0:-1;this._tabs[e].value.element.focus()}focusActiveTab(){var e;if(this._tabs.length===0)return;let t=(e=this.group.activePanel)===null||e===void 0?void 0:e.id,i=t?this._tabs.findIndex(n=>n.value.panel.id===t):-1;this._focusTab(i>-1?i:0)}setActivePanel(e){let t=this._direction==="vertical";for(let i of this._tabs){let n=e.id===i.value.panel.id;i.value.setActive(n),n&&this._scrollTabIntoView(i.value.element,t)}this._tabGroupManager.groupUnderlines.size>0&&this._tabGroupManager.positionUnderlines()}_scrollTabIntoView(e,t){let i=e.parentElement;if(!i)return;let n=t?e.offsetTop:e.offsetLeft,s=t?e.offsetHeight:e.offsetWidth,l=t?i.scrollTop:i.scrollLeft,u=t?i.clientHeight:i.clientWidth;(n<l||n+s>l+u)&&(t?i.scrollTop=n:i.scrollLeft=n)}_activateOnPointerDown(e){if(!Je(this.accessor.options).html5){this.group.model.openPanel(e);return}let t=requestAnimationFrame(()=>{this._tabMap.has(e.id)&&this.group.model.openPanel(e)});this._pointerActivation.value={dispose:()=>cancelAnimationFrame(t)}}openPanel(e,t=this._tabs.length){if(this._tabMap.has(e.id))return;let i=new rs(e,this.accessor,this.group);i.setContent(e.view.tab),this._direction!=="horizontal"&&i.setDirection(this._direction);let n={value:i,disposable:new x(i.onDragStart(s=>{var l;if(this._onTabDragStart.fire({nativeEvent:s,panel:e}),((l=this.accessor.options.theme)===null||l===void 0?void 0:l.tabAnimation)==="smooth"){let u=mi(i.element.getBoundingClientRect(),this._direction),p=this._tabs.findIndex(g=>g.value===i);this._animState={sourceTabId:e.id,sourceIndex:p,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:null,sourceGroupPanelIds:null,sourceChipSize:0,cursorOffsetFromDragStart:u/2,sourceGapSize:u,containerStart:Ji(this._tabsList.getBoundingClientRect(),this._direction)},this._pendingCollapse=!0,requestAnimationFrame(()=>{var g,f;this._pendingCollapse=!1,this._animState&&(this._tabsList.classList.contains("dv-tabs-container--wrap")||(i.element.style.transition="none",A(i.element,"dv-tab--dragging",!0),i.element.offsetHeight),(f=(g=this._animState).currentInsertionIndex)!==null&&f!==void 0||(g.currentInsertionIndex=p),this.applyDragOverTransforms(!0),i.element.style.removeProperty("transition"))})}}),i.onTabClick(s=>{s.defaultPrevented||this.group.api.location.type==="edge"&&(this.group.activePanel===e?this.group.api.isCollapsed()?this.group.api.expand():this.group.api.collapse():(this.group.model.openPanel(e),this.group.api.isCollapsed()&&this.group.api.expand()))}),i.onPointerDown(s=>{if(s.defaultPrevented)return;let l=!this.accessor.options.disableFloatingGroups,u=this.group.api.location.type==="floating"&&this.size===1;if(l&&!u&&s.shiftKey){s.preventDefault();let p=this.accessor.getGroupPanel(i.panel.id),{top:g,left:f}=i.element.getBoundingClientRect(),{top:b,left:_}=this.accessor.element.getBoundingClientRect();this.accessor.addFloatingGroup(p,{x:f-_,y:g-b,inDragMode:!0});return}s.button===0&&this.group.api.location.type!=="edge"&&this.group.activePanel!==e&&this._activateOnPointerDown(e)}),i.onDrop(s=>{let l=this._animState;this._animState=null,this._pendingCollapse=!1;let u=this._tabs.findIndex(_=>_.value===i);if(l){var p;let _=s.position==="right"?u+1:u;if(l.sourceTabGroupId){var g;this._commitGroupMove(l.sourceTabGroupId,(g=l.currentInsertionIndex)!==null&&g!==void 0?g:_);return}this._reorder.uncollapseSourceTab(l.sourceTabId);let y=this.snapshotTabPositions();this.resetTabTransforms(),this._onDrop.fire({event:s.nativeEvent,index:_,targetTabGroupId:l.targetTabGroupId}),((p=this.accessor.options.theme)===null||p===void 0?void 0:p.tabAnimation)==="smooth"&&this.runFlipAnimation(y,l.sourceTabId,l.sourceIndex===-1,l.sourceIndex===-1?void 0:{from:Math.min(l.sourceIndex,_),to:Math.max(l.sourceIndex,_)})}else{var f,b;let _=this._direction==="vertical"?"bottom":"right",y=s.position===_?u+1:u,D=v(),k=D?this._tabs.findIndex(M=>M.value.panel.id===D.panelId):-1,C=y-(k!==-1&&k<y?1:0),T=(f=(b=this.group.model.getTabGroupForPanel(i.panel.id))===null||b===void 0?void 0:b.id)!==null&&f!==void 0?f:null;this._onDrop.fire({event:s.nativeEvent,index:C,targetTabGroupId:T})}}),i.onWillShowOverlay(s=>{this._onWillShowOverlay.fire(new Jt(s,{kind:"tab",panel:this.group.activePanel,api:this.accessor.api,group:this.group,getData:v}))}))};this.addTab(n,t),this._tabGroupManager.positionAllChips(),this._animState&&(this._animState.tabPositions=this.snapshotTabPositions(),this._animState.chipSizes=this._tabGroupManager.snapshotChipSizes(),this.applyDragOverTransforms())}delete(e){var t;((t=this._animState)===null||t===void 0?void 0:t.sourceTabId)===e&&(this.resetTabTransforms(),this._animState=null),this._tabGroupManager.cleanupTransition(e);let i=this.indexOf(e),n=this._tabs.splice(i,1)[0];if(this._tabMap.delete(e),n){let{value:s,disposable:l}=n;l.dispose(),s.dispose(),s.element.remove()}this._animState&&(this._animState.tabPositions=this.snapshotTabPositions(),this._animState.chipSizes=this._tabGroupManager.snapshotChipSizes(),this.applyDragOverTransforms())}addTab(e,t=this._tabs.length){if(t<0||t>this._tabs.length)throw new Error("invalid location");let i=t<this._tabs.length?this._tabs[t].value.element:null;this._tabsList.insertBefore(e.value.element,i),this._tabs=[...this._tabs.slice(0,t),e,...this._tabs.slice(t)],this._tabMap.set(e.value.panel.id,e),this.selectedIndex<0&&(this.selectedIndex=t)}toggleDropdown(e){let t=this._tabs.some(u=>!this._overflowExclude(u.value.panel.id)&&this._forcedOverflow(u.value.panel.id));if(e.reset&&!t){this._onOverflowTabsChange.fire({tabs:[],tabGroups:[],pinnedTabs:[],reset:!0});return}let i=this._tabs.filter(u=>!this._overflowExclude(u.value.panel.id)&&(this._forcedOverflow(u.value.panel.id)||!e.reset&&!It(u.value.element,this._tabsList))).map(u=>u.value.panel.id),n=e.reset?[]:this._tabs.filter(u=>this._overflowExclude(u.value.panel.id)&&u.value.element.getBoundingClientRect().width>0&&!It(u.value.element,this._tabsList)).map(u=>u.value.panel.id),s=new Set(i),l=[];for(let u of this.group.model.getTabGroups()){let p=this._tabGroupManager.chipRenderers.get(u.id),g=p&&!It(p.chip.element,this._tabsList),f=u.panelIds.length>0&&u.panelIds.every(b=>s.has(b));if((g||f)&&(l.push(u.id),u.collapsed))for(let b of u.panelIds)s.has(b)||(s.add(b),i.push(b))}this._onOverflowTabsChange.fire({tabs:i,tabGroups:l,pinnedTabs:n,reset:!1})}updateDragAndDropState(){for(let e of this._tabs)e.value.updateDragAndDropState();this._tabGroupManager.updateDragAndDropState()}updateTabGroups(){this._tabGroupManager.update()}refreshTabGroupAccent(){this._tabGroupManager.refreshAccents()}_handleChipDragStart(e,t,i){var n;let s=e.panelIds[0],l=s?this._tabs.findIndex(f=>f.value.panel.id===s):-1,u=t.element.getBoundingClientRect(),p=mi(u,this._direction);for(let f of e.panelIds){let b=this._tabMap.get(f);b&&(p+=mi(b.value.element.getBoundingClientRect(),this._direction))}if(this._animState={sourceTabId:"",sourceIndex:l,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:e.id,sourceGroupPanelIds:new Set(e.panelIds),sourceChipSize:mi(u,this._direction),cursorOffsetFromDragStart:fs(i,this._direction)-Ji(u,this._direction),sourceGapSize:p,containerStart:Ji(this._tabsList.getBoundingClientRect(),this._direction)},((n=this.accessor.options.theme)===null||n===void 0?void 0:n.tabAnimation)!=="smooth")return;let g=new Set(e.panelIds);this._pendingCollapse=!0,requestAnimationFrame(()=>{var f,b;if(this._pendingCollapse=!1,!this._animState)return;for(let D of this._tabs)g.has(D.value.panel.id)&&(D.value.element.style.transition="none",A(D.value.element,"dv-tab--dragging",!0));let _=this._tabGroupManager.chipRenderers.get(e.id);_&&(_.chip.element.style.transition="none",A(_.chip.element,"dv-tab-group-chip--dragging",!0)),this._tabsList.offsetHeight;let y=this._tabGroupManager.groupUnderlines.get(e.id);y&&(y.style.display="none"),(b=(f=this._animState).currentInsertionIndex)!==null&&b!==void 0||(f.currentInsertionIndex=l),this.applyDragOverTransforms(!0);for(let D of this._tabs)g.has(D.value.panel.id)&&D.value.element.style.removeProperty("transition");_&&_.chip.element.style.removeProperty("transition")})}_handleChipDrop(e,t){let i=e.panelIds[0];if(!i)return;let n=this._tabs.findIndex(g=>g.value.panel.id===i);if(n===-1)return;let s=v();if(s?.tabGroupId){var l;let g=this._animState;this._animState=null,this._pendingCollapse=!1,this._commitGroupMove(s.tabGroupId,(l=g?.currentInsertionIndex)!==null&&l!==void 0?l:n);return}let u=s?.groupId===this.group.id&&s?.panelId?this._tabs.findIndex(g=>g.value.panel.id===s.panelId):-1,p=n-(u!==-1&&u<n?1:0);this._onDrop.fire({event:t.nativeEvent,index:p,targetTabGroupId:null})}setExtendedDropZone(e){this._reorder.setExtendedDropZone(e)}setExternalInsertionIndex(e){this._reorder.setExternalInsertionIndex(e)}clearExternalAnimState(){this._reorder.clearExternalAnimState()}snapshotTabPositions(){return this._reorder.snapshotTabPositions()}handleDragOver(e){this._reorder.handleDragOver(e)}applyDragOverTransforms(e=!1){this._reorder.applyDragOverTransforms(e)}resetTabTransforms(){this._reorder.resetTabTransforms()}_commitGroupMove(e,t){this._reorder.commitGroupMove(e,t)}runFlipAnimation(e,t,i=!1,n){this._reorder.runFlipAnimation(e,t,i,n)}};function Vc(){let e=document.createElement("div");e.className="dv-tabs-overflow-dropdown-default";let t=document.createElement("span");t.textContent="";let i=os();return e.appendChild(i),e.appendChild(t),{element:e,update:n=>{t.textContent=`${n.tabs}`}}}var Wc=class extends x{get onTabDragStart(){return this.tabs.onTabDragStart}get panels(){return this.tabs.panels}get size(){return this.tabs.size}get hidden(){return this._hidden}set hidden(e){this._hidden=e,this.element.style.display=e?"none":""}get direction(){return this._direction}set direction(e){this._direction=e,e==="vertical"?(J(this._element,"dv-groupview-header-vertical"),J(this.rightActionsContainer,"dv-right-actions-container-vertical"),this.tabs.direction=e):(F(this._element,"dv-groupview-header-vertical"),F(this.rightActionsContainer,"dv-right-actions-container-vertical"),this.tabs.direction=e)}get element(){return this._element}get tabsListElement(){return this.tabs.tabsListElement}constructor(e,t){super(),this.accessor=e,this.group=t,this._hidden=!1,this._direction="horizontal",this._dropIndexResolver=(i,n)=>n,this._pinnedRow=void 0,this.dropdownPart=null,this._overflowTabs=[],this._overflowTabGroups=[],this._overflowPinnedTabs=[],this._dropdownDisposable=new S,this._onDrop=new G,this.onDrop=this._onDrop.event,this._onGroupDragStart=new G,this.onGroupDragStart=this._onGroupDragStart.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._element=document.createElement("div"),this._element.className="dv-tabs-and-actions-container",A(this._element,"dv-full-width-single-tab",this.accessor.options.singleTabMode==="fullwidth"),this.rightActionsContainer=document.createElement("div"),this.rightActionsContainer.className="dv-right-actions-container",this.leftActionsContainer=document.createElement("div"),this.leftActionsContainer.className="dv-left-actions-container",this.preActionsContainer=document.createElement("div"),this.preActionsContainer.className="dv-pre-actions-container",this.tabs=new Nc(t,e,{showTabsOverflowControl:!e.options.disableTabsOverflowList}),this.voidContainer=new Pc(this.accessor,this.group),this.tabs.voidContainer=this.voidContainer.element,this._element.appendChild(this.preActionsContainer),this._element.appendChild(this.tabs.element),this._element.appendChild(this.leftActionsContainer),this._element.appendChild(this.voidContainer.element),this._element.appendChild(this.rightActionsContainer),this.tabs.setExtendedDropZone(this._element),this.addDisposables(this.tabs.onDrop(i=>this._onDrop.fire(i)),this.tabs.onWillShowOverlay(i=>this._onWillShowOverlay.fire(i)),e.onDidOptionsChange(()=>{this.tabs.showTabsOverflowControl=!e.options.disableTabsOverflowList}),this.tabs.onOverflowTabsChange(i=>{this.toggleDropdown(i)}),this.tabs,this._onWillShowOverlay,this._onDrop,this._onGroupDragStart,this.voidContainer,this.voidContainer.onDragStart(i=>{this._onGroupDragStart.fire({nativeEvent:i,group:this.group})}),this.voidContainer.onDrop(i=>{this.tabs.handleVoidDrop()||this._onDrop.fire({event:i.nativeEvent,index:this.tabs.size})}),this.voidContainer.onWillShowOverlay(i=>{this._onWillShowOverlay.fire(new Jt(i,{kind:"header_space",panel:this.group.activePanel,api:this.accessor.api,group:this.group,getData:v}))}),O(this.leftActionsContainer,"dragleave",i=>{let n=i.relatedTarget;!this.leftActionsContainer.contains(n)&&!this._element.contains(n)&&this.tabs.clearExternalAnimState()}),O(this.voidContainer.element,"dragleave",i=>{let n=i.relatedTarget;this.voidContainer.element.contains(n)||(this._element.contains(n)?this.tabs.setExternalInsertionIndex(null):this.tabs.clearExternalAnimState())}),O(this.voidContainer.element,"pointerdown",i=>{if(!i.defaultPrevented&&!this.accessor.options.disableFloatingGroups&&i.shiftKey&&this.group.api.location.type!=="floating"&&this.group.api.location.type!=="edge"){i.preventDefault();let{top:n,left:s}=this.element.getBoundingClientRect(),{top:l,left:u}=this.accessor.element.getBoundingClientRect();this.accessor.addFloatingGroup(this.group,{x:s-u+20,y:n-l+20,inDragMode:!0})}}))}show(){this.hidden||(this.element.style.display="")}hide(){this._element.style.display="none"}setRightActionsElement(e){this.rightActions!==e&&(this.rightActions&&(this.rightActions.remove(),this.rightActions=void 0),e&&(this.rightActionsContainer.appendChild(e),this.rightActions=e))}setLeftActionsElement(e){this.leftActions!==e&&(this.leftActions&&(this.leftActions.remove(),this.leftActions=void 0),e&&(this.leftActionsContainer.appendChild(e),this.leftActions=e))}setPrefixActionsElement(e){this.preActions!==e&&(this.preActions&&(this.preActions.remove(),this.preActions=void 0),e&&(this.preActionsContainer.appendChild(e),this.preActions=e))}isActive(e){return this.tabs.isActive(e)}indexOf(e){return this.tabs.indexOf(e)}getTabId(e){return this.tabs.getTabId(e)}getPanelForTab(e){return this.tabs.getPanelForTab(e)}setActive(e){}delete(e){this.tabs.delete(e),this.updateClassnames()}setActivePanel(e){this.tabs.setActivePanel(e)}focusActiveTab(){this.tabs.focusActiveTab()}openPanel(e,t=this.tabs.size){this.tabs.openPanel(e,t),this.updateClassnames()}closePanel(e){this.delete(e.id)}setOverflowExclude(e){this.tabs.setOverflowExclude(e)}setForcedOverflow(e){this.tabs.setForcedOverflow(e)}setPinnedSticky(e){this.tabs.setPinnedSticky(e)}refreshOverflow(){this.tabs.refreshOverflow()}setPinnedRow(e){this._pinnedRow!==e&&(this._pinnedRow&&this._pinnedRow.remove(),this._pinnedRow=e,e&&(e.classList.add("dv-pinned-row"),this._element.insertBefore(e,this._element.firstChild)),A(this._element,"dv-tabs-and-actions-container--pinned-row",!!e))}setDropIndexResolver(e){this._dropIndexResolver=e}resolveDropIndex(e,t){return this._dropIndexResolver(e,t)}updateClassnames(){A(this._element,"dv-single-tab",this.size===1)}toggleDropdown(e){let t=e.reset?[]:e.tabs,i=e.reset?[]:e.tabGroups,n=e.reset?[]:e.pinnedTabs;this._overflowTabs=t,this._overflowTabGroups=i,this._overflowPinnedTabs=n;let s=this._overflowTabs.length+this._overflowPinnedTabs.length;if(s>0&&this.dropdownPart){this.dropdownPart.update({tabs:s});return}if(s===0){this._dropdownDisposable.dispose();return}let l=document.createElement("div");l.className="dv-tabs-overflow-dropdown-root";let u=Vc();u.update({tabs:s}),this.dropdownPart=u,l.appendChild(u.element),this.rightActionsContainer.prepend(l),this._dropdownDisposable.value=new x(w.from(()=>{var p,g;l.remove(),(p=this.dropdownPart)===null||p===void 0||(g=p.dispose)===null||g===void 0||g.call(p),this.dropdownPart=null}),O(l,"pointerdown",p=>{p.preventDefault()},{capture:!0}),O(l,"click",p=>{let g=Ke(l),f={x:p.clientX,y:p.clientY,zIndex:g?.style.zIndex?`calc(${g.style.zIndex} * 2)`:void 0},{context:b,rowRenderers:_}=this.createOverflowRenderContext(l,f),y=this.accessor.advancedOverflowService;try{y?y.renderOverflow({group:this.group,overflowTabs:[...this._overflowTabs],overflowTabGroups:[...this._overflowTabGroups],pinnedOverflowTabs:[...this._overflowPinnedTabs],context:b}):b.open(this.renderFreeOverflowList(b))}catch(D){throw _.dispose(),D}}))}createOverflowRenderContext(e,t){let i=new Set(this._overflowTabGroups),n=this.group.model.getTabGroups(),s=new Map,l=new Map;for(let f of n)if(l.set(f.id,f),i.has(f.id))for(let b of f.panelIds)s.set(b,f);let u=()=>this.accessor.getPopupServiceForGroup(this.group),p=new x,g=f=>{let b=document.createElement("div");b.className="dv-tabs-overflow-group-header";let _=document.createElement("span");_.className="dv-tabs-overflow-group-color",ji(_,f.color,this.accessor.tabGroupColorPalette),b.appendChild(_);let y=document.createElement("span");if(y.className="dv-tabs-overflow-group-label",y.textContent=f.label||f.id,b.appendChild(y),f.collapsed){let D=document.createElement("span");D.className="dv-tabs-overflow-group-collapsed-badge",D.textContent=`${f.panelIds.length}`,b.appendChild(D)}return b.addEventListener("click",()=>{u().close(),f.collapsed&&f.expand();let D=f.panelIds[0];if(D){let k=this.group.panels.find(C=>C.id===D);this.accessor.withOrigin("user",()=>k?.api.setActive())}}),b};return{context:{overflowGroupIdForPanel:f=>{var b;return(b=s.get(f))===null||b===void 0?void 0:b.id},buildGroupHeader:f=>{let b=l.get(f);if(!(!b||!i.has(b.id)))return g(b)},buildPinnedHeader:()=>{let f=document.createElement("div");f.className="dv-tabs-overflow-group-header dv-tabs-overflow-pinned-header";let b=fo();b.classList.add("dv-tabs-overflow-pinned-icon"),f.appendChild(b);let _=document.createElement("span");return _.className="dv-tabs-overflow-group-label",_.textContent="Pinned",f.appendChild(_),f},buildRow:f=>{let b=this.group.panels.find(E=>E.id===f);if(!b)return;let _=this.tabs.tabs.find(E=>E.panel.id===f),y=s.get(f),D=b.view.createTabRenderer("headerOverflow"),k=!1,C=w.from(()=>{if(!k){var E;k=!0,(E=D.dispose)===null||E===void 0||E.call(D)}});p.isDisposed?C.dispose():p.addDisposables(C);let T=D.element,M=document.createElement("div");A(M,"dv-tab",!0),A(M,"dv-active-tab",b.api.isActive),A(M,"dv-inactive-tab",!b.api.isActive),y&&A(M,"dv-tab--grouped",!0);let I=()=>{y?.collapsed&&y.expand(),_?.element.scrollIntoView({block:"nearest",inline:"nearest"}),this.accessor.withOrigin("user",()=>b.api.setActive())};return M.addEventListener("click",E=>{u().close(),!E.defaultPrevented&&I()}),M.appendChild(T),{element:M,panel:b,activate:()=>{u().close(),I()},dispose:()=>{p.removeDisposable(C),C.dispose()}}},open:f=>{u().openPopover(f,t,{onClose:()=>p.dispose()})},close:()=>u().close(),focusTrigger:()=>{e.tabIndex=-1,e.focus()}},rowRenderers:p}}renderFreeOverflowList(e){let t=document.createElement("div");t.style.overflow="auto",t.className="dv-tabs-overflow-container";let i=this._overflowPinnedTabs.map(s=>e.buildRow(s)).filter(s=>s!=null);if(i.length>0){t.appendChild(e.buildPinnedHeader());for(let s of i)t.appendChild(s.element)}let n=new Set;for(let s of this.tabs.tabs.filter(l=>this._overflowTabs.includes(l.panel.id))){let l=e.overflowGroupIdForPanel(s.panel.id);if(l&&!n.has(l)){n.add(l);let p=e.buildGroupHeader(l);p&&t.appendChild(p)}let u=e.buildRow(s.panel.id);u&&t.appendChild(u.element)}return t}updateDragAndDropState(){this.tabs.updateDragAndDropState(),this.voidContainer.updateDragAndDropState()}updateTabGroups(){this.tabs.updateTabGroups()}refreshTabGroupAccent(){this.tabs.refreshTabGroupAccent()}},Hc=class extends x{get label(){return this._label}get color(){return this._color}get componentParams(){return this._componentParams}setLabel(e){this.isDisposed||this._label===e||(this._label=e,this._onDidChange.fire())}setColor(e){if(this.isDisposed)return;let t=e===""?void 0:e;this._color!==t&&(this._color=t,this._onDidChange.fire())}setComponentParams(e){this.isDisposed||(this._componentParams=e,this._onDidChange.fire())}get collapsed(){return this._collapsed}get panelIds(){return this._panelIds}get size(){return this._panelIds.length}get isEmpty(){return this._panelIds.length===0}constructor(e,t){var i,n;super(),this.id=e,this._collapsed=!1,this._panelIds=[],this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._onDidPanelChange=new G,this.onDidPanelChange=this._onDidPanelChange.event,this._onDidCollapseChange=new G,this.onDidCollapseChange=this._onDidCollapseChange.event,this._onDidDestroy=new G,this.onDidDestroy=this._onDidDestroy.event,this._label=(i=t?.label)!==null&&i!==void 0?i:"",this._color=t?.color===""?void 0:t?.color,this._collapsed=(n=t?.collapsed)!==null&&n!==void 0?n:!1,this._componentParams=t?.componentParams,this.addDisposables(this._onDidChange,this._onDidPanelChange,this._onDidCollapseChange,this._onDidDestroy)}addPanel(e,t){if(this.isDisposed||this._panelIds.includes(e))return;let i=t===void 0?this._panelIds.length:Math.max(0,Math.min(t,this._panelIds.length));this._panelIds.splice(i,0,e),this._onDidPanelChange.fire({panelId:e,type:"add"})}removePanel(e){if(this.isDisposed)return!1;let t=this._panelIds.indexOf(e);return t===-1?!1:(this._panelIds.splice(t,1),this._onDidPanelChange.fire({panelId:e,type:"remove"}),!0)}indexOfPanel(e){return this._panelIds.indexOf(e)}containsPanel(e){return this._panelIds.includes(e)}collapse(){this.isDisposed||this._collapsed||(this._collapsed=!0,this._onDidCollapseChange.fire(!0))}expand(){this.isDisposed||!this._collapsed||(this._collapsed=!1,this._onDidCollapseChange.fire(!1))}toggle(){this._collapsed?this.expand():this.collapse()}toJSON(){let e={id:this.id,collapsed:this._collapsed,panelIds:[...this._panelIds]};return this._label&&(e.label=this._label),this._color!==void 0&&(e.color=this._color),this._componentParams!==void 0&&(e.componentParams=this._componentParams),e}dispose(){this._onDidDestroy.fire(),super.dispose()}},Xi=class extends z{get nativeEvent(){return this.options.nativeEvent}get position(){return this.options.position}get panel(){return this.options.panel}get group(){return this.options.group}get api(){return this.options.api}constructor(e){super(),this.options=e}getData(){return this.options.getData()}},Do=class extends Xi{get kind(){return this._kind}constructor(e){super(e),this._kind=e.kind}},bs=class extends x{get tabGroups(){return this._tabGroups}get element(){throw new Error("dockview: not supported")}get activePanel(){return this._activePanel}get contentContainerId(){return this.contentContainer.element.id}get contentDropTarget(){return this.contentContainer.dropTarget}get locked(){return this._locked}set locked(e){this._locked=e,A(this.container,"dv-locked-groupview",e==="no-drop-target"||e)}get isActive(){return this._isGroupActive}get panels(){return this._panels}get size(){return this._panels.length}get isEmpty(){return this._panels.length===0}get hasWatermark(){return!!(this.watermark&&this.container.contains(this.watermark.element))}get header(){return this.tabsContainer}get tabsListElement(){return this.tabsContainer.tabsListElement}getPanelForTab(e){return this.tabsContainer.getPanelForTab(e)}get isContentFocused(){let e=this.contentContainer.element,t=$i(e);return t?te(t,e):!1}get headerPosition(){var e;return(e=this._headerPosition)!==null&&e!==void 0?e:"top"}set headerPosition(e){this._headerPosition=e,this.invalidateHeaderSize(),F(this.container,"dv-groupview-header-top","dv-groupview-header-bottom","dv-groupview-header-left","dv-groupview-header-right"),J(this.container,`dv-groupview-header-${e}`);let t=e==="top"||e==="bottom"?"horizontal":"vertical",i=this._headerDirection;if(this._headerDirection=t,this.tabsContainer.direction=t,this.header.direction=t,this.panels.length>0&&this.layoutContent(),this.updateHeaderActions(),i!==void 0&&i!==t){var n;(n=this.groupPanel)===null||n===void 0||n.api._onDidHeaderDirectionChange.fire({direction:t,position:e})}}get location(){return this._location}set location(e){this._location=e,A(this.container,"dv-groupview-floating",!1),A(this.container,"dv-groupview-popout",!1),A(this.container,"dv-groupview-edge",!1);let t=i=>{this.contentContainer.dropTarget.setTargetZones(i),this.contentContainer.pointerDropTarget.setTargetZones(i)};switch(e.type){case"grid":t(["top","bottom","left","right","center"]);break;case"floating":t(["top","bottom","left","right","center"]),A(this.container,"dv-groupview-floating",!0);break;case"popout":t(["top","bottom","left","right","center"]),A(this.container,"dv-groupview-popout",!0);break;case"edge":t(["center"]),A(this.container,"dv-groupview-edge",!0);break}this.groupPanel.api._onDidLocationChange.fire({location:this.location})}constructor(e,t,i,n,s){var l,u;super(),this.container=e,this.accessor=t,this.id=i,this.options=n,this.groupPanel=s,this._isGroupActive=!1,this._locked=!1,this._location={type:"grid"},this.mostRecentlyUsed=[],this._overwriteRenderContainer=null,this._overwriteDropTargetContainer=null,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._width=0,this._height=0,this._panels=[],this._panelDisposables=new Map,this._tabGroupDisposables=new Map,this._pendingMicrotaskDisposables=new Set,this._onMove=new G,this.onMove=this._onMove.event,this._onDidDrop=new G,this.onDidDrop=this._onDidDrop.event,this._onWillDrop=new G,this.onWillDrop=this._onWillDrop.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._onTabDragStart=new G,this.onTabDragStart=this._onTabDragStart.event,this._onGroupDragStart=new G,this.onGroupDragStart=this._onGroupDragStart.event,this._onDidAddPanel=new G,this.onDidAddPanel=this._onDidAddPanel.event,this._onDidPanelTitleChange=new G,this.onDidPanelTitleChange=this._onDidPanelTitleChange.event,this._onDidPanelParametersChange=new G,this.onDidPanelParametersChange=this._onDidPanelParametersChange.event,this._onDidRemovePanel=new G,this.onDidRemovePanel=this._onDidRemovePanel.event,this._onDidActivePanelChange=new G,this.onDidActivePanelChange=this._onDidActivePanelChange.event,this._onUnhandledDragOver=new G,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this._tabGroups=[],this._tabGroupMap=new Map,this._panelToTabGroup=new Map,this._tabGroupIdCounter=0,this._pendingTabGroupUpdate=!1,this._onDidCreateTabGroup=new G,this.onDidCreateTabGroup=this._onDidCreateTabGroup.event,this._onDidDestroyTabGroup=new G,this.onDidDestroyTabGroup=this._onDidDestroyTabGroup.event,this._onDidAddPanelToTabGroup=new G,this.onDidAddPanelToTabGroup=this._onDidAddPanelToTabGroup.event,this._onDidRemovePanelFromTabGroup=new G,this.onDidRemovePanelFromTabGroup=this._onDidRemovePanelFromTabGroup.event,this._onDidTabGroupChange=new G,this.onDidTabGroupChange=this._onDidTabGroupChange.event,this._onDidTabGroupCollapsedChange=new G,this.onDidTabGroupCollapsedChange=this._onDidTabGroupCollapsedChange.event,A(this.container,"dv-groupview",!0),this.container.setAttribute("role","region"),this._api=new Bi(this.accessor),this.tabsContainer=new Wc(this.accessor,this.groupPanel),this.contentContainer=new is(this.accessor,this),e.append(this.tabsContainer.element,this.contentContainer.element),this.header.hidden=!!n.hideHeader,this.locked=(l=n.locked)!==null&&l!==void 0?l:!1,this.headerPosition=(u=n.headerPosition)!==null&&u!==void 0?u:t.defaultHeaderPosition,this.addDisposables(U(this.tabsContainer.element,()=>{if(this.isDisposed)return;let p=this.measureHeaderSize();p!==this._cachedHeaderSize&&(this._cachedHeaderSize=p,this.layout(this._width,this._height))}),this._onDidPanelTitleChange.event(()=>this.updateAccessibleLabel()),this._onTabDragStart,this._onGroupDragStart,this._onWillShowOverlay,this.tabsContainer.onTabDragStart(p=>{this._onTabDragStart.fire(p)}),this.tabsContainer.onGroupDragStart(p=>{this._onGroupDragStart.fire(p)}),this.tabsContainer.onDrop(p=>{var g;let f=v(),b=(g=f?.panelId)!==null&&g!==void 0?g:null,_=b?this.tabsContainer.resolveDropIndex(b,p.index):p.index;if(this.handleDropEvent("header",p.event,"center",_),b&&p.targetTabGroupId){let y=this._tabGroupMap.get(p.targetTabGroupId),D;if(y){let k=this._panels.findIndex(C=>C.id===b);if(k!==-1){D=0;for(let C of y.panelIds)this._panels.findIndex(T=>T.id===C)<k&&D++}}this.addPanelToTabGroup(p.targetTabGroupId,b,D)}else b&&p.targetTabGroupId===null&&this.removePanelFromTabGroup(b)}),this.contentContainer.onDidFocus(()=>{this.accessor.doSetGroupActive(this.groupPanel)}),this.contentContainer.onDidBlur(()=>{}),this.contentContainer.dropTarget.onDrop(p=>{this.handleDropEvent("content",p.nativeEvent,p.position,void 0,p.edge)}),this.contentContainer.pointerDropTarget.onDrop(p=>{this.handleDropEvent("content",p.nativeEvent,p.position,void 0,p.edge)}),this.tabsContainer.onWillShowOverlay(p=>{this._onWillShowOverlay.fire(p)}),this.contentContainer.dropTarget.onWillShowOverlay(p=>{this._onWillShowOverlay.fire(new Jt(p,{kind:"content",panel:this.activePanel,api:this._api,group:this.groupPanel,getData:v}))}),this.contentContainer.pointerDropTarget.onWillShowOverlay(p=>{this._onWillShowOverlay.fire(new Jt(p,{kind:"content",panel:this.activePanel,api:this._api,group:this.groupPanel,getData:v}))}),this._onMove,this._onDidChange,this._onDidDrop,this._onWillDrop,this._onDidAddPanel,this._onDidRemovePanel,this._onDidActivePanelChange,this._onUnhandledDragOver,this._onDidPanelTitleChange,this._onDidPanelParametersChange,this._onDidCreateTabGroup,this._onDidDestroyTabGroup,this._onDidAddPanelToTabGroup,this._onDidRemovePanelFromTabGroup,this._onDidTabGroupChange,this._onDidTabGroupCollapsedChange,this._onDidCreateTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidDestroyTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidAddPanelToTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidRemovePanelFromTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidTabGroupChange.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidTabGroupCollapsedChange.event(()=>{this._scheduleTabGroupUpdate()}))}_scheduleTabGroupUpdate(){this._pendingTabGroupUpdate||(this._pendingTabGroupUpdate=!0,queueMicrotask(()=>{this._pendingTabGroupUpdate=!1,this.isDisposed||this.tabsContainer.updateTabGroups()}))}_bracketTabGroupMutation(e){return this.accessor.mutation?this.accessor.mutation("tab-group",e):e()}createTabGroup(e){return this._bracketTabGroupMutation(()=>this._doCreateTabGroup(e))}_doCreateTabGroup(e){var t;let i=(t=e?.id)!==null&&t!==void 0?t:`tg-${this.id}-${this._tabGroupIdCounter++}`,n=new Hc(i,{label:e?.label,color:e?.color,collapsed:e?.collapsed,componentParams:e?.componentParams});return this._tabGroups.push(n),this._tabGroupMap.set(i,n),this._tabGroupDisposables.set(i,new x(n.onDidChange(()=>{this._onDidTabGroupChange.fire({tabGroup:n})}),n.onDidCollapseChange(s=>{s?this._handleGroupCollapse(n):this._handleGroupExpand(n),this._onDidTabGroupCollapsedChange.fire({tabGroup:n})}),n.onDidDestroy(()=>{this._removeTabGroupInternal(n)}))),this._onDidCreateTabGroup.fire({tabGroup:n}),n}dissolveTabGroup(e){let t=this._tabGroupMap.get(e);t&&this._bracketTabGroupMutation(()=>{let i=[...t.panelIds];for(let n of i)t.removePanel(n),this._panelToTabGroup.delete(n),this._onDidRemovePanelFromTabGroup.fire({tabGroup:t,panelId:n});t.dispose()})}addPanelToTabGroup(e,t,i){let n=this._tabGroupMap.get(e);if(!n||!this._panels.some(l=>l.id===t))return;let s=this.getTabGroupForPanel(t);s?.id!==e&&this._bracketTabGroupMutation(()=>{s&&this.removePanelFromTabGroup(t),n.addPanel(t,i),this._panelToTabGroup.set(t,n),this._enforceContiguity(n,t),this._onDidAddPanelToTabGroup.fire({tabGroup:n,panelId:t})})}movePanelWithinGroup(e,t,i){let n=this._tabGroupMap.get(e);n?.containsPanel(t)&&(n.removePanel(t),n.addPanel(t,i),this._enforceContiguity(n,t),this.tabsContainer.updateTabGroups())}movePanelBetweenGroups(e,t,i){let n=this._findTabGroupForPanel(e),s=this._tabGroupMap.get(t);s&&(n&&(n.removePanel(e),this._panelToTabGroup.delete(e),this._onDidRemovePanelFromTabGroup.fire({tabGroup:n,panelId:e}),n.isEmpty&&n.dispose()),s.addPanel(e,i),this._panelToTabGroup.set(e,s),this._enforceContiguity(s,e),this._onDidAddPanelToTabGroup.fire({tabGroup:s,panelId:e}))}moveTabGroup(e,t){let i=this._tabGroupMap.get(e);if(!i||i.panelIds.length===0)return;let n=new Set(i.panelIds),s=i.panelIds.map(g=>this._panels.find(f=>f.id===g)).filter(g=>g!==void 0);if(s.length===0)return;let l=0;for(let g=0;g<Math.min(t,this._panels.length);g++)n.has(this._panels[g].id)&&l++;for(let g of s){let f=this._panels.indexOf(g);f!==-1&&this._panels.splice(f,1)}let u=t-l,p=Math.max(0,Math.min(u,this._panels.length));this._panels.splice(p,0,...s);for(let g of this._panels)this.tabsContainer.delete(g.id);for(let g=0;g<this._panels.length;g++)this.tabsContainer.openPanel(this._panels[g],g);this.tabsContainer.updateTabGroups()}_enforceContiguity(e,t){let i=this._panels.find(p=>p.id===t);if(!i)return;let n=e.indexOfPanel(t),s=this._computeGlobalIndex(e,n),l=this._panels.indexOf(i);if(l===s)return;this._panels.splice(l,1);let u=s>l?s-1:s;this._panels.splice(u,0,i),this.tabsContainer.delete(t),this.tabsContainer.openPanel(i,u)}_computeGlobalIndex(e,t){let i=e.panelIds;if(i.length<=1){let n=this._panels.find(s=>s.id===i[0]);return n?this._panels.indexOf(n):this._panels.length}for(let n=0;n<i.length;n++){if(n===t)continue;let s=this._panels.find(l=>l.id===i[n]);if(s){let l=this._panels.indexOf(s);return Math.max(0,l+(t-n))}}return this._panels.length}removePanelFromTabGroup(e){let t=this._findTabGroupForPanel(e);t&&this._bracketTabGroupMutation(()=>{t.removePanel(e),this._panelToTabGroup.delete(e),this._onDidRemovePanelFromTabGroup.fire({tabGroup:t,panelId:e}),t.isEmpty&&t.dispose()})}getTabGroups(){return this._tabGroups}updateTabGroups(){this.tabsContainer.updateTabGroups()}refreshTabGroupAccent(){this.tabsContainer.refreshTabGroupAccent()}refreshWatermark(){if(this.watermark){var e,t;this.watermark.element.remove(),(e=(t=this.watermark).dispose)===null||e===void 0||e.call(t),this.watermark=void 0}this.updateContainer()}getTabGroupForPanel(e){return this._findTabGroupForPanel(e)}_findTabGroupForPanel(e){return this._panelToTabGroup.get(e)}_removeTabGroupInternal(e){let t=this._tabGroups.indexOf(e);if(t!==-1){this._tabGroups.splice(t,1),this._tabGroupMap.delete(e.id);for(let n of e.panelIds)this._panelToTabGroup.delete(n);this._onDidDestroyTabGroup.fire({tabGroup:e});let i=this._tabGroupDisposables.get(e.id);this._tabGroupDisposables.delete(e.id),i&&(this._pendingMicrotaskDisposables.add(i),queueMicrotask(()=>{this._pendingMicrotaskDisposables.delete(i),i.dispose()}))}}_handleGroupCollapse(e){if(!this._activePanel||!e.containsPanel(this._activePanel.id))return;let t=this._panels.indexOf(this._activePanel);for(let i=t+1;i<this._panels.length;i++){let n=this._panels[i],s=this._findTabGroupForPanel(n.id);if(!s?.collapsed){this.doSetActivePanel(n),this.updateContainer();return}}for(let i=t-1;i>=0;i--){let n=this._panels[i],s=this._findTabGroupForPanel(n.id);if(!s?.collapsed){this.doSetActivePanel(n),this.updateContainer();return}}this.contentContainer.closePanel(),this.doSetActivePanel(void 0),this.updateContainer()}_handleGroupExpand(e){if(this._activePanel)return;let t=e.panelIds[0];if(t){let i=this._panels.find(n=>n.id===t);i&&(this.doSetActivePanel(i),this.updateContainer())}}restoreTabGroups(e){for(let t of e){let i=/-(\d+)$/.exec(t.id);if(i){let n=Number.parseInt(i[1],10)+1;n>this._tabGroupIdCounter&&(this._tabGroupIdCounter=n)}}for(let t of e){let i=this.createTabGroup({id:t.id,label:t.label,color:t.color,componentParams:t.componentParams}),n=this._tabGroupMap.get(i.id);for(let s of t.panelIds)this._panels.some(l=>l.id===s)&&(i.addPanel(s),this._panelToTabGroup.set(s,n),this._enforceContiguity(n,s));t.collapsed&&i.collapse(),i.isEmpty&&i.dispose()}}focusContent(){this.contentContainer.element.focus()}focusActiveTab(){this.tabsContainer.focusActiveTab()}set renderContainer(e){this.panels.forEach(t=>{this.renderContainer.detatch(t)}),this._overwriteRenderContainer=e,this.panels.forEach(t=>{this.rerender(t)}),this.panels.length>0&&this.layoutContent()}get renderContainer(){var e;return(e=this._overwriteRenderContainer)!==null&&e!==void 0?e:this.accessor.overlayRenderContainer}set dropTargetContainer(e){this._overwriteDropTargetContainer=e}get dropTargetContainer(){var e;return this._location.type==="floating"&&this.accessor.rootDropTargetContainer.disabled?this.accessor.floatingDropTargetContainer:(e=this._overwriteDropTargetContainer)!==null&&e!==void 0?e:this.accessor.rootDropTargetContainer}initialize(){this.options.panels&&this.options.panels.forEach(e=>{this.doAddPanel(e)}),this.options.activePanel&&this.openPanel(this.options.activePanel),this.setActive(this.isActive,!0),this.updateContainer(),this.updateHeaderActions()}updateHeaderActions(){var e;(e=this.accessor.headerActionsService)===null||e===void 0||e.refresh(this.groupPanel)}attachHeaderAction(e,t){switch(e){case"left":this.tabsContainer.setLeftActionsElement(t);break;case"right":this.tabsContainer.setRightActionsElement(t);break;case"prefix":this.tabsContainer.setPrefixActionsElement(t);break}}rerender(e){this.contentContainer.renderPanel(e,{asActive:!1})}indexOf(e){return this.tabsContainer.indexOf(e.id)}toJSON(){var e;let t={views:this.tabsContainer.panels,activeView:(e=this._activePanel)===null||e===void 0?void 0:e.id,id:this.id};return this.locked!==!1&&(t.locked=this.locked),this.header.hidden&&(t.hideHeader=!0),this.headerPosition!=="top"&&(t.headerPosition=this.headerPosition),this._tabGroups.length>0&&(t.tabGroups=this._tabGroups.map(i=>i.toJSON())),t}moveToNext(e){var t,i,n;(t=e)!==null&&t!==void 0||(e={}),(n=(i=e).panel)!==null&&n!==void 0||(i.panel=this.activePanel);let s=e.panel?this.panels.indexOf(e.panel):-1,l;if(s<this.panels.length-1)l=s+1;else{if(e.suppressRoll)return;l=0}this.openPanel(this.panels[l])}moveToPrevious(e){var t,i,n;if((t=e)!==null&&t!==void 0||(e={}),(n=(i=e).panel)!==null&&n!==void 0||(i.panel=this.activePanel),!e.panel)return;let s=this.panels.indexOf(e.panel),l;if(s>0)l=s-1;else{if(e.suppressRoll)return;l=this.panels.length-1}this.openPanel(this.panels[l])}containsPanel(e){return this.panels.includes(e)}init(e){}update(e){}focus(){var e;(e=this._activePanel)===null||e===void 0||e.focus()}openPanel(e,t={}){(typeof t.index!="number"||t.index>this.panels.length)&&(t.index=this.panels.length);let i=!!t.skipSetActive;if(e.updateParentGroup(this.groupPanel,{skipSetActive:t.skipSetActive}),this.doAddPanel(e,t.index,{skipSetActive:i}),this.invalidateHeaderSize(),this._activePanel===e){this.contentContainer.renderPanel(e,{asActive:!0});return}i||this.doSetActivePanel(e),t.skipSetGroupActive||this.accessor.doSetGroupActive(this.groupPanel),t.skipSetActive||this.updateContainer()}removePanel(e,t){let i=typeof e=="string"?e:e.id,n=this._panels.find(s=>s.id===i);if(!n)throw new Error("invalid operation");return this._removePanel(n,t)}closeAllPanels(){if(this.panels.length>0){let e=[...this.panels];for(let t of e)this.doClose(t)}else this.accessor.removeGroup(this.groupPanel)}closePanel(e){this.doClose(e)}doClose(e){let t=this.panels.length===1&&this.accessor.groups.length===1;this.accessor.removePanel(e,t&&this.accessor.options.noPanelsOverlay==="emptyGroup"?{removeEmptyGroup:!1}:void 0)}isPanelActive(e){return this._activePanel===e}updateActions(e){this.tabsContainer.setRightActionsElement(e)}setActive(e,t=!1){if(!this.isDisposed&&!(!t&&this.isActive===e)){if(this._isGroupActive=e,A(this.container,"dv-active-group",e),A(this.container,"dv-inactive-group",!e),this.tabsContainer.setActive(this.isActive),!this._activePanel&&this.panels.length>0){let i=this._panels.find(n=>{let s=this._findTabGroupForPanel(n.id);return!s?.collapsed});i&&this.doSetActivePanel(i)}this.updateContainer()}}layout(e,t){this._width=e,this._height=t,this.layoutContent()}layoutContent(){var e;let{width:t,height:i}=this.contentDimensions();this.contentContainer.layout(t,i),!((e=this._activePanel)===null||e===void 0)&&e.layout&&this._activePanel.layout(t,i)}relayout(){this.invalidateHeaderSize(),this.layout(this._width,this._height)}measureHeaderSize(){let e=this.tabsContainer.element;return this.headerPosition==="top"||this.headerPosition==="bottom"?e.offsetHeight:e.offsetWidth}invalidateHeaderSize(){this._cachedHeaderSize=void 0}contentDimensions(){var e;let t=this.headerPosition==="top"||this.headerPosition==="bottom",i=(e=this._cachedHeaderSize)!==null&&e!==void 0?e:this._cachedHeaderSize=this.measureHeaderSize();return{width:t?this._width:Math.max(0,this._width-i),height:t?Math.max(0,this._height-i):this._height}}_removePanel(e,t){let i=this._activePanel===e;if(this.doRemovePanel(e),this.invalidateHeaderSize(),i&&this.panels.length>0){let n=this.mostRecentlyUsed[0];this.openPanel(n,{skipSetActive:t?.skipSetActive,skipSetGroupActive:t?.skipSetActiveGroup})}return this._activePanel&&this.panels.length===0&&this.doSetActivePanel(void 0),t?.skipSetActive||this.updateContainer(),e}doRemovePanel(e){let t=this.panels.indexOf(e);if(this._activePanel===e&&this.contentContainer.closePanel(),this.tabsContainer.delete(e.id),this._panels.splice(t,1),this.mostRecentlyUsed.includes(e)){let n=this.mostRecentlyUsed.indexOf(e);this.mostRecentlyUsed.splice(n,1)}let i=this._panelDisposables.get(e.id);i&&(i.dispose(),this._panelDisposables.delete(e.id)),this.removePanelFromTabGroup(e.id),this._onDidRemovePanel.fire({panel:e})}doAddPanel(e,t=this.panels.length,i){let n=this._panels.indexOf(e)>-1;this.tabsContainer.show(),this.contentContainer.show(),this.tabsContainer.openPanel(e,t),i?.skipSetActive?e.api.renderer==="always"&&this.contentContainer.renderPanel(e,{asActive:!1}):this.contentContainer.openPanel(e),!n&&(this.updateMru(e),this.panels.splice(t,0,e),this._panelDisposables.set(e.id,new x(e.api.onDidTitleChange(s=>this._onDidPanelTitleChange.fire(s)),e.api.onDidParametersChange(s=>this._onDidPanelParametersChange.fire(s)))),this._onDidAddPanel.fire({panel:e}))}doSetActivePanel(e){if(this._activePanel!==e){if(this._activePanel=e,e){var t,i,n;this.tabsContainer.setActivePanel(e),this.contentContainer.setLabelledBy(this.tabsContainer.getTabId(e.id)),this.contentContainer.openPanel(e),this.layoutContent(),this.updateMru(e),this.contentContainer.refreshFocusState(),this._onDidActivePanelChange.fire({panel:e,origin:(t=(i=(n=this.accessor).currentOrigin)===null||i===void 0?void 0:i.call(n))!==null&&t!==void 0?t:"user"})}this.updateAccessibleLabel()}}updateAccessibleLabel(){var e;let t=(e=this._activePanel)===null||e===void 0?void 0:e.title;t?this.container.setAttribute("aria-label",t):this.container.removeAttribute("aria-label")}updateMru(e){this.mostRecentlyUsed.includes(e)&&this.mostRecentlyUsed.splice(this.mostRecentlyUsed.indexOf(e),1),this.mostRecentlyUsed=[e,...this.mostRecentlyUsed]}updateContainer(){this.panels.forEach(n=>n.runEvents());let e=this.isEmpty||!this._activePanel;if(e&&!this.watermark){let n=this.accessor.createWatermarkComponent();n.init({containerApi:this._api,group:this.groupPanel}),this.watermark=n,O(this.watermark.element,"pointerdown",()=>{this.isActive||this.accessor.doSetGroupActive(this.groupPanel)}),this.contentContainer.element.appendChild(this.watermark.element)}if(!e&&this.watermark){var t,i;this.watermark.element.remove(),(t=(i=this.watermark).dispose)===null||t===void 0||t.call(i),this.watermark=void 0}}canDisplayOverlay(e,t,i){let n=new _o(e,i,t,v,this.accessor.getPanel(this.id));return this._onUnhandledDragOver.fire(n),n.isAccepted}canDisplayContentOverlay(e,t){if(this.locked==="no-drop-target"||this.locked&&t==="center")return!1;let i=v();return!i&&e.shiftKey&&this.location.type!=="floating"?!1:i?.viewId===this.accessor.id?!0:this.canDisplayOverlay(e,t,"content")}handleDropEvent(e,t,i,n,s){if(this.locked==="no-drop-target")return;if(e==="content"&&s){this.accessor.dockToLayoutEdge(t,i);return}function l(){switch(e){case"header":return typeof n=="number"?"tab":"header_space";case"content":return"content"}}let u=typeof n=="number"?this.panels[n]:void 0,p=new Do({nativeEvent:t,position:i,panel:u,getData:()=>v(),kind:l(),group:this.groupPanel,api:this._api});if(this._onWillDrop.fire(p),p.defaultPrevented)return;let g=v();if(g?.viewId===this.accessor.id){if(e==="content"&&g.groupId===this.id&&(i==="center"||g.panelId===null&&!g.tabGroupId)||e==="header"&&g.groupId===this.id&&g.panelId===null&&!g.tabGroupId)return;if(g.panelId===null){let{groupId:_}=g;this._onMove.fire({target:i,groupId:_,index:n,tabGroupId:g.tabGroupId});return}if(this.tabsContainer.indexOf(g.panelId)!==-1&&this.tabsContainer.size===1&&this.accessor.options.closeEmptyGroups!==!1)return;let{groupId:f,panelId:b}=g;if(this.id===f&&!i&&this.tabsContainer.indexOf(b)===n)return;this._onMove.fire({target:i,groupId:g.groupId,itemId:g.panelId,index:n})}else this._onDidDrop.fire(new Xi({nativeEvent:t,position:i,panel:u,getData:()=>v(),group:this.groupPanel,api:this._api}))}updateDragAndDropState(){this.tabsContainer.updateDragAndDropState()}dispose(){var e,t,i;super.dispose(),(e=this.watermark)===null||e===void 0||e.element.remove(),(t=this.watermark)===null||t===void 0||(i=t.dispose)===null||i===void 0||i.call(t),this.watermark=void 0;for(let n of[...this._tabGroups])n.dispose();for(let n of this._tabGroupDisposables.values())n.dispose();this._tabGroupDisposables.clear();for(let n of this._pendingMicrotaskDisposables)n.dispose();this._pendingMicrotaskDisposables.clear();for(let n of this.panels)n.dispose();this.tabsContainer.dispose(),this.contentContainer.dispose()}},ko=class extends Zr{constructor(e,t,i){super(e,t),this._onDidConstraintsChangeInternal=new G,this.onDidConstraintsChangeInternal=this._onDidConstraintsChangeInternal.event,this._onDidConstraintsChange=new G,this.onDidConstraintsChange=this._onDidConstraintsChange.event,this._onDidSizeChange=new G,this.onDidSizeChange=this._onDidSizeChange.event,this.addDisposables(this._onDidConstraintsChangeInternal,this._onDidConstraintsChange,this._onDidSizeChange),i&&this.initialize(i)}setConstraints(e){this._onDidConstraintsChangeInternal.fire(e)}setSize(e){this._onDidSizeChange.fire(e)}},ws=class extends mo{get priority(){return this._priority}get snap(){return this._snap}get minimumWidth(){return this.__minimumWidth()}get minimumHeight(){return this.__minimumHeight()}get maximumHeight(){return this.__maximumHeight()}get maximumWidth(){return this.__maximumWidth()}__minimumWidth(){let e=typeof this._minimumWidth=="function"?this._minimumWidth():this._minimumWidth;return e!==this._evaluatedMinimumWidth&&(this._evaluatedMinimumWidth=e,this.updateConstraints()),e}__maximumWidth(){let e=typeof this._maximumWidth=="function"?this._maximumWidth():this._maximumWidth;return e!==this._evaluatedMaximumWidth&&(this._evaluatedMaximumWidth=e,this.updateConstraints()),e}__minimumHeight(){let e=typeof this._minimumHeight=="function"?this._minimumHeight():this._minimumHeight;return e!==this._evaluatedMinimumHeight&&(this._evaluatedMinimumHeight=e,this.updateConstraints()),e}__maximumHeight(){let e=typeof this._maximumHeight=="function"?this._maximumHeight():this._maximumHeight;return e!==this._evaluatedMaximumHeight&&(this._evaluatedMaximumHeight=e,this.updateConstraints()),e}get isActive(){return this.api.isActive}get isVisible(){return this.api.isVisible}constructor(e,t,i,n){super(e,t,n??new ko(e,t)),this._evaluatedMinimumWidth=0,this._evaluatedMaximumWidth=Number.MAX_SAFE_INTEGER,this._evaluatedMinimumHeight=0,this._evaluatedMaximumHeight=Number.MAX_SAFE_INTEGER,this._minimumWidth=0,this._minimumHeight=0,this._maximumWidth=Number.MAX_SAFE_INTEGER,this._maximumHeight=Number.MAX_SAFE_INTEGER,this._snap=!1,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,typeof i?.minimumWidth=="number"&&(this._minimumWidth=i.minimumWidth),typeof i?.maximumWidth=="number"&&(this._maximumWidth=i.maximumWidth),typeof i?.minimumHeight=="number"&&(this._minimumHeight=i.minimumHeight),typeof i?.maximumHeight=="number"&&(this._maximumHeight=i.maximumHeight),this.api.initialize(this),this.addDisposables(this.api.onWillVisibilityChange(s=>{let{isVisible:l}=s,{accessor:u}=this._params;u.setVisible(this,l)}),this.api.onActiveChange(()=>{let{accessor:s}=this._params;s.doSetGroupActive(this)}),this.api.onDidConstraintsChangeInternal(s=>{(typeof s.minimumWidth=="number"||typeof s.minimumWidth=="function")&&(this._minimumWidth=s.minimumWidth),(typeof s.minimumHeight=="number"||typeof s.minimumHeight=="function")&&(this._minimumHeight=s.minimumHeight),(typeof s.maximumWidth=="number"||typeof s.maximumWidth=="function")&&(this._maximumWidth=s.maximumWidth),(typeof s.maximumHeight=="number"||typeof s.maximumHeight=="function")&&(this._maximumHeight=s.maximumHeight),this._onDidChange.fire(void 0)}),this.api.onDidSizeChange(s=>{this._onDidChange.fire({height:s.height,width:s.width})}),this._onDidChange)}setVisible(e){this.api._onDidVisibilityChange.fire({isVisible:e})}setActive(e){this.api._onDidActiveChange.fire({isActive:e})}init(e){e.maximumHeight&&(this._maximumHeight=e.maximumHeight),e.minimumHeight&&(this._minimumHeight=e.minimumHeight),e.maximumWidth&&(this._maximumWidth=e.maximumWidth),e.minimumWidth&&(this._minimumWidth=e.minimumWidth),this._priority=e.priority,this._snap=!!e.snap,super.init(e),typeof e.isVisible=="boolean"&&this.setVisible(e.isVisible)}updateConstraints(){this.api._onDidConstraintsChange.fire({minimumWidth:this._evaluatedMinimumWidth,maximumWidth:this._evaluatedMaximumWidth,minimumHeight:this._evaluatedMinimumHeight,maximumHeight:this._evaluatedMaximumHeight})}toJSON(){let e=super.toJSON(),t=n=>n===Number.MAX_SAFE_INTEGER?void 0:n,i=n=>n<=0?void 0:n;return j(j({},e),{},{minimumHeight:i(this.minimumHeight),maximumHeight:t(this.maximumHeight),minimumWidth:i(this.minimumWidth),maximumWidth:t(this.maximumWidth),snap:this.snap,priority:this.priority})}};let bt="dockview: DockviewGroupPanelApiImpl not initialized";var Bc=class extends ko{get location(){if(!this._group)throw new Error(bt);return this._group.model.location}get boundingBox(){if(!this._group||this._group.model.location.type==="popout")return;let e=this.accessor.element.getBoundingClientRect(),t=this._group.element.getBoundingClientRect();return{left:t.left-e.left,top:t.top-e.top,width:t.width,height:t.height}}get locked(){if(!this._group)throw new Error(bt);return this._group.locked}set locked(e){if(!this._group)throw new Error(bt);this._group.locked=e}constructor(e,t){super(e,"__dockviewgroup__"),this.accessor=t,this._isApplyingSize=!1,this._onDidLocationChange=new G,this.onDidLocationChange=this._onDidLocationChange.event,this._onDidActivePanelChange=new G,this.onDidActivePanelChange=this._onDidActivePanelChange.event,this._onDidCollapsedChange=new G,this.onDidCollapsedChange=this._onDidCollapsedChange.event,this._onDidPeekChange=new G,this.onDidPeekChange=this._onDidPeekChange.event,this._onDidHeaderDirectionChange=new G,this.onDidHeaderDirectionChange=this._onDidHeaderDirectionChange.event,this.addDisposables(this._onDidLocationChange,this._onDidActivePanelChange,this._onDidCollapsedChange,this._onDidPeekChange,this._onDidHeaderDirectionChange,this._onDidVisibilityChange.event(i=>{if(i.isVisible&&this._pendingSize){let n=this._pendingSize;this._pendingSize=void 0,super.setSize(n)}}),this.onDidDimensionsChange(i=>{var n,s;let l=i.width!==((n=this._reportedSize)===null||n===void 0?void 0:n.width)||i.height!==((s=this._reportedSize)===null||s===void 0?void 0:s.height);this._reportedSize={width:i.width,height:i.height},l&&this.isVisible&&!this._isApplyingSize&&(this._pendingSize=void 0)}))}setSize(e){(typeof e.width=="number"||typeof e.height=="number")&&(this._pendingSize=j({},e));let t=this._isApplyingSize;this._isApplyingSize=!0;try{super.setSize(e)}finally{this._isApplyingSize=t}}close(){if(this._group)return this.accessor.removeGroup(this._group)}getWindow(){return this.location.type==="popout"?this.location.getWindow():globalThis.window}setHeaderPosition(e){if(!this._group)throw new Error(bt);this._group.model.headerPosition=e}getHeaderPosition(){if(!this._group)throw new Error(bt);return this._group.model.headerPosition}moveTo(e){if(!this._group)throw new Error(bt);this.accessor.withOrigin("api",()=>{var t,i,n,s;let l=(t=e.group)!==null&&t!==void 0?t:this.accessor.addGroup({direction:qr((i=e.position)!==null&&i!==void 0?i:"right"),skipSetActive:(n=e.skipSetActive)!==null&&n!==void 0?n:!1});this.accessor.moveGroupOrPanel({from:{groupId:this._group.id},to:{group:l,position:e.group&&(s=e.position)!==null&&s!==void 0?s:"center",index:e.index},skipSetActive:e.skipSetActive})})}maximize(){if(!this._group)throw new Error(bt);this.location.type==="grid"&&this.accessor.maximizeGroup(this._group)}isMaximized(){if(!this._group)throw new Error(bt);return this.accessor.isMaximizedGroup(this._group)}exitMaximized(){if(!this._group)throw new Error(bt);this.isMaximized()&&this.accessor.exitMaximizedGroup()}collapse(){this._group&&this.accessor.setEdgeGroupCollapsed(this._group,!0)}expand(){this._group&&this.accessor.setEdgeGroupCollapsed(this._group,!1)}isCollapsed(){return this._group?this.accessor.isEdgeGroupCollapsed(this._group):!1}isPeeking(){return this._group?this.accessor.isEdgeGroupPeeking(this._group):!1}setAutoHide(e){this._group&&this.accessor.setEdgeGroupAutoHide(this._group,e)}isAutoHide(){return this._group?this.accessor.isEdgeGroupAutoHide(this._group):!1}initialize(e){this._group=e}};let Fc=100,Uc=100;var fi=class extends ws{get minimumWidth(){var e;if(typeof this._explicitConstraints.minimumWidth=="number")return this._explicitConstraints.minimumWidth;let t=(e=this.activePanel)===null||e===void 0?void 0:e.minimumWidth;return typeof t=="number"?t:super.__minimumWidth()}get minimumHeight(){var e;if(typeof this._explicitConstraints.minimumHeight=="number")return this._explicitConstraints.minimumHeight;let t=(e=this.activePanel)===null||e===void 0?void 0:e.minimumHeight;return typeof t=="number"?t:super.__minimumHeight()}get maximumWidth(){var e;if(typeof this._explicitConstraints.maximumWidth=="number")return this._explicitConstraints.maximumWidth;let t=(e=this.activePanel)===null||e===void 0?void 0:e.maximumWidth;return typeof t=="number"?t:super.__maximumWidth()}get maximumHeight(){var e;if(typeof this._explicitConstraints.maximumHeight=="number")return this._explicitConstraints.maximumHeight;let t=(e=this.activePanel)===null||e===void 0?void 0:e.maximumHeight;return typeof t=="number"?t:super.__maximumHeight()}get panels(){return this._model.panels}get activePanel(){return this._model.activePanel}get size(){return this._model.size}get model(){return this._model}get locked(){return this._model.locked}set locked(e){this._model.locked=e}get header(){return this._model.header}constructor(e,t,i){var n,s,l,u,p,g;super(t,"groupview_default",{minimumHeight:(n=(s=i.constraints)===null||s===void 0?void 0:s.minimumHeight)!==null&&n!==void 0?n:Uc,minimumWidth:(l=(u=i.constraints)===null||u===void 0?void 0:u.minimumWidth)!==null&&l!==void 0?l:Fc,maximumHeight:(p=i.constraints)===null||p===void 0?void 0:p.maximumHeight,maximumWidth:(g=i.constraints)===null||g===void 0?void 0:g.maximumWidth},new Bc(t,e)),this._explicitConstraints={},this.api.initialize(this),this._model=new bs(this.element,e,t,i,this),this.addDisposables(this.model.onDidActivePanelChange(f=>{this.api._onDidActivePanelChange.fire(f)}),this.api.onDidConstraintsChangeInternal(f=>{f.minimumWidth!==void 0&&(this._explicitConstraints.minimumWidth=typeof f.minimumWidth=="function"?f.minimumWidth():f.minimumWidth),f.minimumHeight!==void 0&&(this._explicitConstraints.minimumHeight=typeof f.minimumHeight=="function"?f.minimumHeight():f.minimumHeight),f.maximumWidth!==void 0&&(this._explicitConstraints.maximumWidth=typeof f.maximumWidth=="function"?f.maximumWidth():f.maximumWidth),f.maximumHeight!==void 0&&(this._explicitConstraints.maximumHeight=typeof f.maximumHeight=="function"?f.maximumHeight():f.maximumHeight)}))}focus(){this.api.isActive||this.api.setActive(),super.focus()}initialize(){this._model.initialize()}setActive(e){super.setActive(e),this.model.setActive(e)}layout(e,t){super.layout(e,t),this.model.layout(e,t)}relayout(){this.model.relayout()}getComponent(){return this._model}toJSON(){return this.model.toJSON()}};let Yc={name:"dark",className:"dockview-theme-dark",colorScheme:"dark"},qc={name:"light",className:"dockview-theme-light",colorScheme:"light"},jc={name:"visualStudio",className:"dockview-theme-vs",colorScheme:"dark",edgeGroupCollapsedSize:22},_s={name:"abyss",className:"dockview-theme-abyss",colorScheme:"dark",tabGroupIndicator:"none"},Kc={name:"dracula",className:"dockview-theme-dracula",colorScheme:"dark"},Jc={name:"abyssSpaced",className:"dockview-theme-abyss-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},Xc={name:"lightSpaced",className:"dockview-theme-light-spaced",colorScheme:"light",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},Zc={name:"nord",className:"dockview-theme-nord",colorScheme:"dark"},Qc={name:"nordSpaced",className:"dockview-theme-nord-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},eh={name:"catppuccinMocha",className:"dockview-theme-catppuccin-mocha",colorScheme:"dark"},th={name:"catppuccinMochaSpaced",className:"dockview-theme-catppuccin-mocha-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},ih={name:"monokai",className:"dockview-theme-monokai",colorScheme:"dark"},nh={name:"solarizedLight",className:"dockview-theme-solarized-light",colorScheme:"light"},oh={name:"solarizedLightSpaced",className:"dockview-theme-solarized-light-spaced",colorScheme:"light",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},rh={name:"githubDark",className:"dockview-theme-github-dark",colorScheme:"dark"},sh={name:"githubDarkSpaced",className:"dockview-theme-github-dark-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},ah={name:"githubLight",className:"dockview-theme-github-light",colorScheme:"light"},dh={name:"githubLightSpaced",className:"dockview-theme-github-light-spaced",colorScheme:"light",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"};var lh=class extends ko{get location(){return this.group.api.location}get title(){return this.panel.title}get isPinned(){return this.panel.isPinned}get isGroupActive(){return this.group.isActive}get renderer(){return this.panel.renderer}set group(e){let t=this._group;this._group!==e&&(this._group=e,this._onDidGroupChange.fire({}),this.setupGroupEventListeners(t),this.fireLocationChange())}get group(){return this._group}get tabComponent(){return this._tabComponent}constructor(e,t,i,n,s){super(e.id,n),this.panel=e,this.accessor=i,this._onDidTitleChange=new G,this.onDidTitleChange=this._onDidTitleChange.event,this._onDidChangePinned=new G,this.onDidChangePinned=this._onDidChangePinned.event,this._onDidActiveGroupChange=new G,this.onDidActiveGroupChange=this._onDidActiveGroupChange.event,this._onDidGroupChange=new G,this.onDidGroupChange=this._onDidGroupChange.event,this._onDidRendererChange=new G,this.onDidRendererChange=this._onDidRendererChange.event,this._onDidLocationChange=new G,this.onDidLocationChange=this._onDidLocationChange.event,this.groupEventsDisposable=new S,this._tabComponent=s,this.initialize(e),this._group=t,this.setupGroupEventListeners(),this.addDisposables(this.groupEventsDisposable,this._onDidRendererChange,this._onDidTitleChange,this._onDidChangePinned,this._onDidGroupChange,this._onDidActiveGroupChange,this._onDidLocationChange)}getWindow(){return this.group.api.getWindow()}setActive(){this.accessor.withOrigin("api",()=>super.setActive())}moveTo(e){this.accessor.withOrigin("api",()=>{var t,i;return this.accessor.moveGroupOrPanel({from:{groupId:this._group.id,panelId:this.panel.id},to:{group:(t=e.group)!==null&&t!==void 0?t:this._group,position:e.group&&(i=e.position)!==null&&i!==void 0?i:"center",index:e.index},skipSetActive:e.skipSetActive})})}setTitle(e){this.panel.setTitle(e)}setPinned(e){this.accessor.setPanelPinned(this.panel,e)}setRenderer(e){this.panel.setRenderer(e)}close(){this.group.model.closePanel(this.panel)}maximize(){this.group.api.maximize()}isMaximized(){return this.group.api.isMaximized()}exitMaximized(){this.group.api.exitMaximized()}fireLocationChange(){this.accessor.deferLocationChange(this,()=>{this.isDisposed||this._onDidLocationChange.fire({location:this.location})})}setupGroupEventListeners(e){var t;let i=(t=e?.isActive)!==null&&t!==void 0?t:!1;this.groupEventsDisposable.value=new x(this.group.api.onDidVisibilityChange(n=>{let s=!n.isVisible&&this.isVisible,l=n.isVisible&&!this.isVisible,u=this.group.model.isPanelActive(this.panel);(s||l&&u)&&this._onDidVisibilityChange.fire(n)}),this.group.api.onDidLocationChange(()=>{this.group===this.panel.group&&this.fireLocationChange()}),this.group.api.onDidActiveChange(()=>{this.group===this.panel.group&&i!==this.isGroupActive&&(i=this.isGroupActive,this._onDidActiveGroupChange.fire({isActive:this.isGroupActive}))}))}},Mt=class extends x{get params(){return this._params}get title(){return this._title}get isPinned(){return this._pinned}get group(){return this._group}get renderer(){var e;return(e=this._renderer)!==null&&e!==void 0?e:this.accessor.renderer}get minimumWidth(){return this._minimumWidth}get minimumHeight(){return this._minimumHeight}get maximumWidth(){return this._maximumWidth}get maximumHeight(){return this._maximumHeight}constructor(e,t,i,n,s,l,u,p){super(),this.id=e,this.accessor=n,this.containerApi=s,this.view=u,this._pinned=!1,this._renderer=p.renderer,this._group=l,this._minimumWidth=p.minimumWidth,this._minimumHeight=p.minimumHeight,this._maximumWidth=p.maximumWidth,this._maximumHeight=p.maximumHeight,this.api=new lh(this,this._group,n,t,i),this.addDisposables(this.api.onActiveChange(()=>{n.setActivePanel(this)}),this.api.onDidSizeChange(g=>{this.group.api.setSize(g)}),this.api.onDidRendererChange(()=>{this.group.model.rerender(this)}))}init(e){this._params=e.params,this.view.init(j(j({},e),{},{api:this.api,containerApi:this.containerApi})),this.setTitle(e.title)}focus(){let e=new Xr;this.api._onWillFocus.fire(e),!e.defaultPrevented&&(this.api.isActive||this.api.setActive())}toJSON(){return{id:this.id,contentComponent:this.view.contentComponent,tabComponent:this.view.tabComponent,params:Object.keys(this._params||{}).length>0?this._params:void 0,title:this.title,renderer:this._renderer,minimumHeight:this._minimumHeight,maximumHeight:this._maximumHeight,minimumWidth:this._minimumWidth,maximumWidth:this._maximumWidth,pinned:this._pinned?!0:void 0}}setTitle(e){e!==this.title&&(this._title=e,this.view.setTitle(e),this.api._onDidTitleChange.fire({title:e}))}setPinned(e){this._pinned!==e&&(this._pinned=e,this.api._onDidChangePinned.fire({isPinned:e}))}setRenderer(e){e!==this.renderer&&(this._renderer=e,this.api._onDidRendererChange.fire({renderer:e}))}update(e){this._params=j(j({},this._params),e.params);for(let t of Object.keys(e.params))e.params[t]===void 0&&delete this._params[t];this.view.update({params:this._params})}updateFromStateModel(e){var t,i,n,s,l;this._maximumHeight=e.maximumHeight,this._minimumHeight=e.minimumHeight,this._maximumWidth=e.maximumWidth,this._minimumWidth=e.minimumWidth,this._params=(t=e.params)!==null&&t!==void 0?t:{},this.view.update({params:this._params}),this.setTitle((i=e.title)!==null&&i!==void 0?i:this.id),this.setRenderer((n=e.renderer)!==null&&n!==void 0?n:this.accessor.renderer),this.setPinned(((s=e.pinned)!==null&&s!==void 0?s:!1)&&!!(!((l=this.accessor.options.pinnedTabs)===null||l===void 0)&&l.enabled))}updateParentGroup(e,t){this._group=e,this.api.group=this._group;let i=this._group.model.isPanelActive(this),n=this.group.api.isActive&&i;t?.skipSetActive||this.api.isActive!==n&&this.api._onDidActiveChange.fire({isActive:this.group.api.isActive&&i}),this.api.isVisible!==i&&this.api._onDidVisibilityChange.fire({isVisible:i})}runEvents(){let e=this._group.model.isPanelActive(this),t=this.group.api.isActive&&e;this.api.isActive!==t&&this.api._onDidActiveChange.fire({isActive:this.group.api.isActive&&e}),this.api.isVisible!==e&&this.api._onDidVisibilityChange.fire({isVisible:e})}layout(e,t){this.api._onDidDimensionChange.fire({width:e,height:t}),this.view.layout(e,t)}dispose(){this.api.dispose(),this.view.dispose()}},So=class extends x{get element(){return this._element}constructor(){super(),this._messages=Hi,this._element=document.createElement("div"),this._element.className="dv-default-tab",this._content=document.createElement("div"),this._content.className="dv-default-tab-content",this.action=document.createElement("div"),this.action.className="dv-default-tab-action",this.action.setAttribute("role","button"),this.action.setAttribute("tabindex","-1");let e=ns();e.setAttribute("aria-hidden","true"),this.action.appendChild(e),this._element.appendChild(this._content),this._element.appendChild(this.action),this.render()}init(e){var t;this._title=e.title,this._messages=(t=e.containerApi.messages)!==null&&t!==void 0?t:Hi,this.addDisposables(e.api.onDidTitleChange(i=>{this._title=i.title,this.render()}),O(this.action,"pointerdown",i=>{i.preventDefault()}),O(this.action,"click",i=>{i.defaultPrevented||(i.preventDefault(),e.api.close())})),this.render()}render(){if(this._content.textContent!==this._title){var e;this._content.textContent=(e=this._title)!==null&&e!==void 0?e:""}this.action.setAttribute("aria-label",this._title?this._messages.closeTab(this._title):this._messages.closeTabPlain())}},ys=class{get content(){return this._content}get tab(){return this._tab}constructor(e,t,i,n){this.accessor=e,this.id=t,this.contentComponent=i,this.tabComponent=n,this._content=this.createContentComponent(this.id,i),this._tab=this.createTabComponent(this.id,n)}createTabRenderer(e){let t=this.createTabComponent(this.id,this.tabComponent);if(this._params&&t.init(j(j({},this._params),{},{tabLocation:e})),this._updateEvent){var i;(i=t.update)===null||i===void 0||i.call(t,this._updateEvent)}return t}init(e){this._params=e,this.content.init(e),this.tab.init(j(j({},e),{},{tabLocation:"header"}))}setTitle(e){this._params&&(this._params.title=e)}layout(e,t){var i,n;(i=(n=this.content).layout)===null||i===void 0||i.call(n,e,t)}update(e){var t,i,n,s;this._updateEvent=e,(t=(i=this.content).update)===null||t===void 0||t.call(i,e),(n=(s=this.tab).update)===null||n===void 0||n.call(s,e)}dispose(){var e,t,i,n;(e=(t=this.content).dispose)===null||e===void 0||e.call(t),(i=(n=this.tab).dispose)===null||i===void 0||i.call(n)}createContentComponent(e,t){return this.accessor.options.createComponent({id:e,name:t})}createTabComponent(e,t){let i=t??this.accessor.options.defaultTabComponent;if(i){if(this.accessor.options.createTabComponent){let n=this.accessor.options.createTabComponent({id:e,name:i});return n||new So}console.warn(`dockview: tabComponent '${t}' was not found. falling back to the default tab.`)}return new So}},xs=class{constructor(e){this.accessor=e}fromJSON(e,t){var i,n,s;let l=e.id,u=e.params,p=e.title,g=e.view,f=g?g.content.id:(i=e.contentComponent)!==null&&i!==void 0?i:"unknown",b=g?(n=g.tab)===null||n===void 0?void 0:n.id:e.tabComponent,_=new ys(this.accessor,l,f,b),y=new Mt(l,f,b,this.accessor,new Bi(this.accessor),t,_,{renderer:e.renderer,minimumWidth:e.minimumWidth,minimumHeight:e.minimumHeight,maximumWidth:e.maximumWidth,maximumHeight:e.maximumHeight});return y.init({title:p??l,params:u??{}}),e.pinned&&(!((s=this.accessor.options.pinnedTabs)===null||s===void 0)&&s.enabled)&&y.setPinned(!0),y}},ch=class extends x{get element(){return this._element}constructor(){super(),this._element=document.createElement("div"),this._element.className="dv-watermark"}init(e){}},hh=class{constructor(){this._orderedList=[]}push(e){this._orderedList=[...this._orderedList.filter(t=>t!==e),e],this.update()}destroy(e){this._orderedList=this._orderedList.filter(t=>t!==e),this.update()}update(){for(let e=0;e<this._orderedList.length;e++)this._orderedList[e].setAttribute("aria-level",`${e}`),this._orderedList[e].style.zIndex=`calc(var(--dv-overlay-z-index, 999) + ${e*2})`}};let Zi=new hh;var Co=class qt extends x{set minimumInViewportWidth(t){this.options.minimumInViewportWidth=t}set minimumInViewportHeight(t){this.options.minimumInViewportHeight=t}get element(){return this._element}get isVisible(){return this._isVisible}get headerHeight(){var t,i;return(t=(i=this.options.header)===null||i===void 0?void 0:i.offsetHeight)!==null&&t!==void 0?t:0}constructor(t){super(),this.options=t,this._element=document.createElement("div"),this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._onDidChangeEnd=new G,this.onDidChangeEnd=this._onDidChangeEnd.event,this._onDidStartMoving=new G,this.onDidStartMoving=this._onDidStartMoving.event,this._dragMove=new S,this._dragCancelled=!1,this.addDisposables(this._onDidChange,this._onDidChangeEnd,this._onDidStartMoving,this._dragMove),this._element.className="dv-resize-container",this._element.setAttribute("role","dialog"),this._element.setAttribute("aria-modal","false"),this._isVisible=!0,this.setupResize("top"),this.setupResize("bottom"),this.setupResize("left"),this.setupResize("right"),this.setupResize("topleft"),this.setupResize("topright"),this.setupResize("bottomleft"),this.setupResize("bottomright"),this.options.header&&(A(this._element,"dv-resize-container-with-titlebar",!0),this._element.appendChild(this.options.header)),this._element.appendChild(this.options.content),this.options.container.appendChild(this._element),this.setBounds(j(j(j(j({height:this.options.height,width:this.options.width},"top"in this.options&&{top:this.options.top}),"bottom"in this.options&&{bottom:this.options.bottom}),"left"in this.options&&{left:this.options.left}),"right"in this.options&&{right:this.options.right})),Zi.push(this._element)}setVisible(t){t!==this.isVisible&&(this._isVisible=t,A(this.element,"dv-hidden",!this.isVisible))}bringToFront(){Zi.push(this._element)}setBounds(t={}){typeof t.height=="number"&&(this._element.style.height=`${t.height}px`),typeof t.width=="number"&&(this._element.style.width=`${t.width}px`),"top"in t&&typeof t.top=="number"&&(this._element.style.top=`${t.top}px`,this._element.style.bottom="auto",this.verticalAlignment="top"),"bottom"in t&&typeof t.bottom=="number"&&(this._element.style.bottom=`${t.bottom}px`,this._element.style.top="auto",this.verticalAlignment="bottom"),"left"in t&&typeof t.left=="number"&&(this._element.style.left=`${t.left}px`,this._element.style.right="auto",this.horiziontalAlignment="left"),"right"in t&&typeof t.right=="number"&&(this._element.style.right=`${t.right}px`,this._element.style.left="auto",this.horiziontalAlignment="right");let i=this.options.container.getBoundingClientRect(),n=this._element.getBoundingClientRect(),s=Math.max(0,this.getMinimumWidth(n.width)),l=Math.max(0,this.getMinimumHeight(n.height));if(this.verticalAlignment==="top"){let u=De(n.top-i.top,-l,Math.max(0,i.height-n.height+l));this._element.style.top=`${u}px`,this._element.style.bottom="auto"}if(this.verticalAlignment==="bottom"){let u=De(i.bottom-n.bottom,-l,Math.max(0,i.height-n.height+l));this._element.style.bottom=`${u}px`,this._element.style.top="auto"}if(this.horiziontalAlignment==="left"){let u=De(n.left-i.left,-s,Math.max(0,i.width-n.width+s));this._element.style.left=`${u}px`,this._element.style.right="auto"}if(this.horiziontalAlignment==="right"){let u=De(i.right-n.right,-s,Math.max(0,i.width-n.width+s));this._element.style.right=`${u}px`,this._element.style.left="auto"}this._onDidChange.fire()}toJSON(){let t=this.options.container.getBoundingClientRect(),i=this._element.getBoundingClientRect(),n={};return this.verticalAlignment==="top"?n.top=Number.parseFloat(this._element.style.top):this.verticalAlignment==="bottom"?n.bottom=Number.parseFloat(this._element.style.bottom):n.top=i.top-t.top,this.horiziontalAlignment==="left"?n.left=Number.parseFloat(this._element.style.left):this.horiziontalAlignment==="right"?n.right=Number.parseFloat(this._element.style.right):n.left=i.left-t.left,n.width=i.width,n.height=i.height,n}cancelPendingDrag(){this._dragMove.value&&(this._dragCancelled=!0,A(this._element,"dv-resize-container-dragging",!1),this._dragMove.value=w.NONE)}setupDrag(t,i){let n=(s,l)=>{var u,p,g;let f=null,b=!1;this._dragCancelled=!1;let _=this.options.transformDragPosition?(u=(p=(g=this.options).getSiblingBoxes)===null||p===void 0?void 0:p.call(g))!==null&&u!==void 0?u:[]:[],y=ge();if(s&&typeof l=="number"&&typeof s.setPointerCapture=="function")try{s.setPointerCapture(l)}catch{}let D=()=>{A(this._element,"dv-resize-container-dragging",!1),this._dragMove.value=w.NONE,this._onDidChangeEnd.fire()};this._dragMove.value=new x({dispose:()=>{if(y.release(),s&&typeof l=="number"&&typeof s.releasePointerCapture=="function")try{s.releasePointerCapture(l)}catch{}}},O(globalThis.window,"pointermove",k=>{var C;if(this._dragCancelled)return;let T=this.options.container.getBoundingClientRect(),M=k.clientX-T.left,I=k.clientY-T.top;A(this._element,"dv-resize-container-dragging",!0);let E=this._element.getBoundingClientRect();(C=f)!==null&&C!==void 0||(f={x:k.clientX-E.left,y:k.clientY-E.top});let $=Math.max(0,this.getMinimumWidth(E.width)),X=Math.max(0,this.getMinimumHeight(E.height)),Z=I-f.y,W=M-f.x;if(this.options.transformDragPosition){let Ae=this.options.transformDragPosition({proposed:{top:Z,left:W,width:E.width,height:E.height},container:{width:T.width,height:T.height},others:_,modifiers:{altKey:k.altKey,ctrlKey:k.ctrlKey,metaKey:k.metaKey,shiftKey:k.shiftKey}});Ae&&(Z=Ae.top,W=Ae.left)}let B=Math.max(0,T.height-E.height+X),re=Math.max(0,T.width-E.width+$),K=De(Z,-X,B),ee=De(T.height-E.height-Z,-X,B),we=De(W,-$,re),ve=De(T.width-E.width-W,-$,re),fe={};K<=ee?fe.top=K:fe.bottom=ee,we<=ve?fe.left=we:fe.right=ve,this.setBounds(fe),b||(b=!0,this._onDidStartMoving.fire())}),O(globalThis.window,"pointerup",D),O(globalThis.window,"pointercancel",D))};this.addDisposables(O(t,"pointerdown",s=>{if(s.defaultPrevented){s.preventDefault();return}hi(s)||n(t,s.pointerId)}),O(this.options.content,"pointerdown",s=>{s.defaultPrevented||hi(s)||s.shiftKey&&n(this.options.content,s.pointerId)}),O(this.options.content,"pointerdown",()=>{Zi.push(this._element)},!0)),i?.inDragMode&&n()}setupResize(t){let i=document.createElement("div");i.className=`dv-resize-handle-${t}`,this._element.appendChild(i);let n=new S;this.addDisposables(n,O(i,"pointerdown",s=>{s.preventDefault();let l=null,u=ge(),p=s.pointerId;if(typeof i.setPointerCapture=="function")try{i.setPointerCapture(p)}catch{}let g=()=>{n.dispose(),this._onDidChangeEnd.fire()};n.value=new x(O(globalThis.window,"pointermove",f=>{var b;let _=this.options.container.getBoundingClientRect(),y=this._element.getBoundingClientRect(),D=f.clientY-_.top,k=f.clientX-_.left;(b=l)!==null&&b!==void 0||(l={originalY:D,originalHeight:y.height,originalX:k,originalWidth:y.width});let C,T,M,I,E,$,X=()=>{let K=l.originalY+l.originalHeight>_.height?Math.max(0,_.height-qt.MINIMUM_HEIGHT):Math.max(0,l.originalY+l.originalHeight-qt.MINIMUM_HEIGHT);C=De(D,0,K),M=l.originalY+l.originalHeight-C,T=_.height-C-M},Z=()=>{C=l.originalY-l.originalHeight;let K=C<0&&typeof this.options.minimumInViewportHeight=="number"?-C+this.options.minimumInViewportHeight:qt.MINIMUM_HEIGHT,ee=_.height-Math.max(0,C);M=De(D-C,K,ee),T=_.height-C-M},W=()=>{let K=l.originalX+l.originalWidth>_.width?Math.max(0,_.width-qt.MINIMUM_WIDTH):Math.max(0,l.originalX+l.originalWidth-qt.MINIMUM_WIDTH);I=De(k,0,K),$=l.originalX+l.originalWidth-I,E=_.width-I-$},B=()=>{I=l.originalX-l.originalWidth;let K=I<0&&typeof this.options.minimumInViewportWidth=="number"?-I+this.options.minimumInViewportWidth:qt.MINIMUM_WIDTH,ee=_.width-Math.max(0,I);$=De(k-I,K,ee),E=_.width-I-$};switch(t){case"top":X();break;case"bottom":Z();break;case"left":W();break;case"right":B();break;case"topleft":X(),W();break;case"topright":X(),B();break;case"bottomleft":Z(),W();break;case"bottomright":Z(),B();break}let re={};C<=T?re.top=C:re.bottom=T,I<=E?re.left=I:re.right=E,re.height=M,re.width=$,this.setBounds(re)}),{dispose:()=>{if(u.release(),typeof i.releasePointerCapture=="function")try{i.releasePointerCapture(p)}catch{}}},O(globalThis.window,"pointerup",g),O(globalThis.window,"pointercancel",g))}))}getMinimumWidth(t){return typeof this.options.minimumInViewportWidth=="number"?t-this.options.minimumInViewportWidth:0}getMinimumHeight(t){return typeof this.options.minimumInViewportHeight=="number"?t-this.options.minimumInViewportHeight:0}dispose(){Zi.destroy(this._element),this._element.remove(),super.dispose()}};Co.MINIMUM_HEIGHT=20,Co.MINIMUM_WIDTH=20;var uh=class extends x{get element(){return this._element}get group(){return this._group}setGroup(e){this._group=e}constructor(e,t){super(),this.accessor=e,this._onDragStart=new G,this.onDragStart=this._onDragStart.event,this._group=t,this._element=document.createElement("div"),this._element.className="dv-floating-titlebar",this.addDisposables(this._onDragStart,O(this._element,"pointerdown",()=>{this.accessor.doSetGroupActive(this._group)}),O(this._element,"pointerdown",i=>{i.shiftKey&&Ve(i)},!0)),this.dragSource=new ss({element:this._element,accessor:this.accessor,group:()=>this._group}),this.addDisposables(this.dragSource,this.dragSource.onDragStart(i=>{this._onDragStart.fire(i)}))}updateDragAndDropState(){this.dragSource.updateDragAndDropState()}};function dt(e){return{moduleName:e.name,options:e.options,services:{[e.serviceKey]:e.create},init:e.init?(t,i)=>e.init(t,i[e.serviceKey]):void 0,dependsOn:e.dependsOn}}let ph=new Set(["AdvancedOverflow","AutoEdgeGroup","AutoHideEdgeGroup","DndCompass","KeyboardDocking","KeyboardNavigation","LayoutHistory","License","MultiRowTabs","PinnedTabs","SmartGuides"]),Ds=new Set;function ks(e,t){let i=t===void 0?[]:[].concat(t),n=i.map(u=>`\`${u}\``).join(", "),s=i.length>1?"require":"requires",l=i.length?`${n} ${s} the "${e}" module`:`The "${e}" module is required`;return ph.has(e)?`dockview: ${l}, which ships in dockview-enterprise.

  npm install dockview-enterprise
  import 'dockview-enterprise'; // self-registers every enterprise module
`:`dockview: ${l}, but it is not registered.`}function Ss(e,t){let i=`${e}|${(t===void 0?[]:[].concat(t)).join("|")}`;Ds.has(i)||(Ds.add(i),console.error(ks(e,t)))}function Fe(e,t,i){if(e!==void 0)return e;Ss(t,i)}var vh=class{constructor(){this._modules=new Map,this._services={},this._initDisposables=[]}get services(){return this._services}register(e){if(!this._modules.has(e.moduleName)){if(e.dependsOn)for(let t of e.dependsOn)this.register(t);this._modules.set(e.moduleName,e)}}initialize(e){for(let t of this._modules.values())if(t.services)for(let[i,n]of Object.entries(t.services))this._services[i]=n(e)}postConstruct(e){for(let t of this._modules.values())t.init&&this._initDisposables.push(t.init(e,this._services))}has(e){return this._modules.has(e)}dispose(){for(let e of this._initDisposables)e.dispose();this._initDisposables.length=0;for(let e of Object.values(this._services))e!==void 0&&typeof e.dispose=="function"&&e.dispose()}};let Qi=[];function gh(e){for(let t of e)Qi.some(i=>i.moduleName===t.moduleName)||Qi.push(t)}function Cs(){return[...Qi]}function mh(){Qi.length=0}let fh=[{optionKey:"smartGuides",reason:"smartGuides",moduleName:"SmartGuides",when:e=>!!e.smartGuides&&e.smartGuides.enabled!==!1},{optionKey:"layoutHistory",reason:"layoutHistory.enabled: true",moduleName:"LayoutHistory",when:e=>{var t;return((t=e.layoutHistory)===null||t===void 0?void 0:t.enabled)===!0}},{optionKey:"pinnedTabs",reason:"pinnedTabs.enabled: true",moduleName:"PinnedTabs",when:e=>{var t;return((t=e.pinnedTabs)===null||t===void 0?void 0:t.enabled)===!0}},{optionKey:"overflow",reason:"overflow.mode: 'wrap'",moduleName:"MultiRowTabs",when:e=>{var t;return((t=e.overflow)===null||t===void 0?void 0:t.mode)==="wrap"}},{optionKey:"overflow",reason:"overflow.maxRows",moduleName:"MultiRowTabs",when:e=>{var t;return((t=e.overflow)===null||t===void 0?void 0:t.maxRows)!=null}},{optionKey:"overflow",reason:"overflow.search",moduleName:"AdvancedOverflow",when:e=>{var t;return!!(!((t=e.overflow)===null||t===void 0)&&t.search)}},{optionKey:"overflow",reason:"overflow.mru",moduleName:"AdvancedOverflow",when:e=>{var t;return!!(!((t=e.overflow)===null||t===void 0)&&t.mru)}},{optionKey:"autoHideEdgeGroups",reason:"autoHideEdgeGroups",moduleName:"AutoHideEdgeGroup",when:e=>Yi(e.autoHideEdgeGroups)},{optionKey:"dockToEdgeGroups",reason:"dockToEdgeGroups",moduleName:"AutoEdgeGroup",when:e=>Yi(e.dockToEdgeGroups)},{optionKey:"dndCompass",reason:"dndCompass",moduleName:"DndCompass",when:e=>!!e.dndCompass},{optionKey:"keyboardNavigation",reason:"keyboardNavigation",moduleName:"KeyboardNavigation",when:e=>!!e.keyboardNavigation}];function bh(e,t){let i=new Map;for(let n of fh){if(!n.when(e)||t(n.moduleName))continue;let s=i.get(n.moduleName);s?s.push(n.reason):i.set(n.moduleName,[n.reason])}for(let[n,s]of i)Ss(n,s)}let kt={left:100,top:100,width:300,height:300};var wh=class extends x{get group(){return this._group}setTitleBar(e){this._titleBar=e}setAnchorGroup(e){var t;this._group=e,(t=this._titleBar)===null||t===void 0||t.setGroup(e)}constructor(e,t,i){super(),this.overlay=t,this.gridview=i,this._group=e,this.addDisposables(t,{dispose:()=>this.gridview.dispose()})}position(e){this.overlay.setBounds(e)}},_h=class{get floatingGroups(){return this._floatingGroups}constructor(e){this._floatingGroups=[],this._host=e}add(e,t,i){let n=new wh(e,t,i),s=new x(e.api.onDidActiveChange(u=>{u.isActive&&t.bringToFront()}),(()=>{let u=-1,p=-1;return U(i.element,g=>{let f=Math.round(g.contentRect.width),b=Math.round(g.contentRect.height);f===u&&b===p||(u=f,p=b,i.layout(f,b))})})()),l=()=>{var u;let p=(u=e.activePanel)===null||u===void 0?void 0:u.title;p?t.element.setAttribute("aria-label",p):t.element.removeAttribute("aria-label")};return l(),n.addDisposables(e.api.onDidActivePanelChange(()=>l()),t.onDidChange(()=>{i.layout(i.width,i.height)}),t.onDidChangeEnd(()=>{this._host.fireLayoutChange()}),e.onDidChange(u=>{t.setBounds({height:typeof u?.height=="number"?u.height+t.headerHeight:u?.height,width:u?.width})}),{dispose:()=>{s.dispose(),Mr(this._floatingGroups,n),e.model.location={type:"grid"}}}),this._floatingGroups.push(n),n}findByGroup(e){return this._floatingGroups.find(t=>t.group===e||t.gridview.element.contains(e.element))}serialize(){return this._floatingGroups.map(e=>{let t=e.gridview.serialize(),i=e.overlay.toJSON(),n=t.root;return n.type==="branch"&&n.data.length===1&&n.data[0].type==="leaf"?{data:n.data[0].data,position:i}:{grid:t,position:i}})}constrainBounds(){for(let e of this._floatingGroups)e.overlay.setBounds()}updateBounds(e){if("floatingGroupBounds"in e)for(let n of this._floatingGroups){switch(e.floatingGroupBounds){case"boundedWithinViewport":n.overlay.minimumInViewportHeight=void 0,n.overlay.minimumInViewportWidth=void 0;break;case void 0:n.overlay.minimumInViewportHeight=100,n.overlay.minimumInViewportWidth=100;break;default:var t,i;n.overlay.minimumInViewportHeight=(t=e.floatingGroupBounds)===null||t===void 0?void 0:t.minimumHeightWithinViewport,n.overlay.minimumInViewportWidth=(i=e.floatingGroupBounds)===null||i===void 0?void 0:i.minimumWidthWithinViewport}n.overlay.setBounds()}}disposeAll(){for(let e of[...this._floatingGroups])e.dispose()}dispose(){this.disposeAll()}};let Gs=dt({name:"FloatingGroup",serviceKey:"floatingGroupService",create:e=>new _h(e)});var yh=class{constructor(e){this._entries=[],this._restorationCleanups=new Set,this._restorationPromise=Promise.resolve(),this._onDidRemove=new G,this.onDidRemove=this._onDidRemove.event,this._host=e}get entries(){return this._entries}get restorationPromise(){return this._restorationPromise}add(e){this._entries.push(e)}remove(e){Mr(this._entries,e)&&!this._host.isDisposed&&this._onDidRemove.fire(e)}findByGroup(e){return this._entries.find(t=>t.popoutGroup===e||t.gridview.element.contains(e.element))}findReferenceGroupId(e){var t;return(t=this._entries.find(i=>i.popoutGroup===e))===null||t===void 0?void 0:t.referenceGroup}observeGridviewSize(e,t,i){var n;let s=(n=e.window)===null||n===void 0?void 0:n.ResizeObserver;if(!s)return;let l=-1,u=-1,p=()=>{let f=e.window;if(this._host.isDisposed||!f||f.closed)return;let b=Math.round(t.element.clientWidth),_=Math.round(t.element.clientHeight);b===l&&_===u||(l=b,u=_,b>0&&_>0&&t.layout(b,_),i.updateAllPositions())},g=new s(()=>{var f;let b=(f=e.window)===null||f===void 0?void 0:f.requestAnimationFrame;b?b.call(e.window,p):p()});return g.observe(t.element),{dispose:()=>g.disconnect()}}scheduleRestoration(e,t,i){return new Promise(n=>{let s=()=>{this._restorationCleanups.delete(s),clearTimeout(l),i?.(),n()},l=setTimeout(()=>{if(this._restorationCleanups.delete(s),this._host.isDisposed){n();return}Promise.resolve(t()).then(()=>n(),()=>n())},e);this._restorationCleanups.add(s)})}finishRestoration(e){this._restorationPromise=Promise.all(e).then(()=>{})}cancelPendingRestorations(){for(let e of[...this._restorationCleanups])e();this._restorationCleanups.clear()}serialize(){return this._entries.map(e=>{let t=e.gridview.serialize(),i=t.root,n=e.popoutGroup.api.location.type==="popout"?e.popoutGroup.api.location.popoutUrl:void 0,s={gridReferenceGroup:e.referenceGroup,position:e.window.dimensions(),url:n};return i.type==="branch"&&i.data.length===1&&i.data[0].type==="leaf"?j(j({},s),{},{data:i.data[0].data}):j(j({},s),{},{grid:t})})}disposeAll(){for(let e of[...this._entries])e.disposable.dispose()}dispose(){this.cancelPendingRestorations(),this.disposeAll(),this._onDidRemove.dispose()}};let xh=dt({name:"PopoutWindow",serviceKey:"popoutWindowService",create:e=>new yh(e)});var Dh=class{constructor(e){this._watermark=null,this._host=e}update(){if(this._host.hasVisibleGridGroup()){this._unmount();return}if(this._watermark)return;this._watermark=this._host.createWatermarkComponent(),this._watermark.init({containerApi:this._host.api});let e=document.createElement("div");e.className="dv-watermark-container",he(e,"watermark-component"),e.appendChild(this._watermark.element),this._host.mountElement.appendChild(e)}refresh(){this._unmount(),this.update()}_unmount(){var e,t;this._watermark&&(this._watermark.element.parentElement.remove(),(e=(t=this._watermark).dispose)===null||e===void 0||e.call(t),this._watermark=null)}dispose(){this._unmount()}};let kh=dt({name:"Watermark",serviceKey:"watermarkService",create:e=>new Dh(e),init:(e,t)=>(t.update(),new x(P.any(e.onDidAdd,e.onDidRemove)(()=>{t.update()}),e.onDidViewVisibilityChangeMicroTaskQueue(()=>{t.update()})))});var Sh=class{constructor(){this._edgeGroups=new Map,this._edgeGroupDisposables=new Map,this._autoHide=new WeakMap,this._autoReveal=new WeakMap}add(e,t,i){this._edgeGroups.set(e,t),this._edgeGroupDisposables.set(e,i)}remove(e){var t;(t=this._edgeGroupDisposables.get(e))===null||t===void 0||t.dispose(),this._edgeGroupDisposables.delete(e),this._edgeGroups.delete(e)}get(e){return this._edgeGroups.get(e)}has(e){return this._edgeGroups.has(e)}hasAny(){return this._edgeGroups.size>0}entries(){return this._edgeGroups.entries()}includes(e){for(let t of this._edgeGroups.values())if(t===e)return!0;return!1}findPositionOf(e){for(let[t,i]of this._edgeGroups)if(i===e)return t}setAutoHide(e,t){t===void 0?this._autoHide.delete(e):this._autoHide.set(e,t)}isAutoHide(e){return this._autoHide.get(e)}setAutoReveal(e,t){this._autoReveal.set(e,t)}isAutoReveal(e){var t;return(t=this._autoReveal.get(e))!==null&&t!==void 0?t:!1}disposeAll(){for(let e of this._edgeGroupDisposables.values())e.dispose();this._edgeGroupDisposables.clear(),this._edgeGroups.clear()}dispose(){this.disposeAll()}};let Ps=dt({name:"EdgeGroup",serviceKey:"edgeGroupService",create:()=>new Sh}),Ch={activationSize:{type:"pixels",value:10},size:{type:"pixels",value:20}},Gh={activationSize:{type:"pixels",value:32},size:{type:"pixels",value:20}};function zs(e,t){return typeof e.dndEdges=="object"&&e.dndEdges!==null?e.dndEdges:t&&Yi(e.dockToEdgeGroups)?Gh:Ch}var Ph=class{constructor(e){this._host=e;let t=(n,s)=>{let l=v();return l?l.viewId!==e.id?!1:s==="center"?e.isGridEmpty():!0:s==="center"&&!e.isGridEmpty()?!1:e.dispatchUnhandledDragOver(n,s)},i=zs(e.options,!1);this._html5Target=ft.createDropTarget(e.element,{className:"dv-drop-target-edge",canDisplayOverlay:t,acceptedTargetZones:["top","bottom","left","right","center"],overlayModel:i,getOverrideTarget:()=>e.rootDropTargetOverrideTarget(),getPositionResolver:()=>e.options.dropPositionResolver}),this._pointerTarget=at.createDropTarget(e.element,{className:"dv-drop-target-edge",canDisplayOverlay:t,acceptedTargetZones:["top","bottom","left","right","center"],overlayModel:i,getOverrideTarget:()=>e.rootDropTargetOverrideTarget(),getPositionResolver:()=>e.options.dropPositionResolver}),this.onWillShowOverlay=P.any(this._html5Target.onWillShowOverlay,this._pointerTarget.onWillShowOverlay),this.onDrop=P.any(this._html5Target.onDrop,this._pointerTarget.onDrop),this.setOptions(e.options)}setOptions(e){if("dndEdges"in e){let t=typeof e.dndEdges=="boolean"&&e.dndEdges===!1;this._html5Target.disabled=t,this._pointerTarget.disabled=t}if("dndEdges"in e||"dockToEdgeGroups"in e){let t=zs({dndEdges:"dndEdges"in e?e.dndEdges:this._host.options.dndEdges,dockToEdgeGroups:"dockToEdgeGroups"in e?e.dockToEdgeGroups:this._host.options.dockToEdgeGroups},this._host.hasEdgeDragReveal);this._html5Target.setOverlayModel(t),this._pointerTarget.setOverlayModel(t)}}dispose(){this._html5Target.dispose(),this._pointerTarget.dispose()}};let zh=dt({name:"RootDropTarget",serviceKey:"rootDropTargetService",create:e=>new Ph(e),init:(e,t)=>(t.setOptions(e.options),w.NONE)}),Th={left:"createLeftHeaderActionComponent",right:"createRightHeaderActionComponent",prefix:"createPrefixHeaderActionComponent"};var Ah=class{constructor(e){this._perGroup=new Map,this._host=e}refresh(e){if(!e?.model)return;let t=this._ensureState(e);this._refreshSlot("left",e,t.left),this._refreshSlot("right",e,t.right),this._refreshSlot("prefix",e,t.prefix)}refreshAll(){for(let e of this._host.groups)this.refresh(e)}disposeGroup(e){let t=this._perGroup.get(e);t&&(t.left.dispose(),t.right.dispose(),t.prefix.dispose(),this._perGroup.delete(e))}dispose(){for(let e of[...this._perGroup.keys()])this.disposeGroup(e)}_ensureState(e){let t=this._perGroup.get(e);return t||(t={left:new S,right:new S,prefix:new S},this._perGroup.set(e,t)),t}_refreshSlot(e,t,i){let n=this._host.options[Th[e]];if(n){let s=n(t);i.value=s,s.init({containerApi:this._host.api,api:t.api,group:t}),t.model.attachHeaderAction(e,s.element)}else i.dispose(),t.model.attachHeaderAction(e,void 0)}};let Eh=dt({name:"HeaderActions",serviceKey:"headerActionsService",create:e=>new Ah(e),init:(e,t)=>new x(e.onDidRemoveGroup(i=>{t.disposeGroup(i)}))}),Ts=e=>e==="load"||e==="clear";function en(e,t){let i=e.createElement("div");return i.className=t==="assertive"?"dv-live-region-assertive":"dv-live-region",i.setAttribute("role",t==="assertive"?"alert":"status"),i.setAttribute("aria-live",t),i.setAttribute("aria-atomic","true"),Object.assign(i.style,{position:"absolute",width:"1px",height:"1px",margin:"-1px",padding:"0",overflow:"hidden",clip:"rect(0 0 0 0)",clipPath:"inset(50%)",whiteSpace:"nowrap",border:"0"}),i}var Ih=class extends x{constructor(e){var t;super(),this._regions=new Map,this._suppressDepth=0,this._locationSubs=new Map,this._host=e;let i=e.element.ownerDocument;this._mainWindow=(t=i.defaultView)!==null&&t!==void 0?t:window;let n={polite:en(i,"polite"),assertive:en(i,"assertive")};e.element.appendChild(n.polite),e.element.appendChild(n.assertive),this._regions.set(this._mainWindow,n),this._syncPopoutRegions(),this.addDisposables({dispose:()=>this._disposeRegions()},e.onDidChangePopouts(()=>this._syncPopoutRegions()),e.onDidAddPanel(s=>this._announce(s,"open")),e.onDidRemovePanel(s=>this._announce(s,"close")),e.onWillMutateLayout(s=>{Ts(s.kind)&&this._suppressDepth++}),e.onDidMutateLayout(s=>{Ts(s.kind)&&(this._suppressDepth=Math.max(0,this._suppressDepth-1))}),e.onDidMaximizedGroupChange(s=>{let l=s.group.activePanel;l&&this._announce(l,s.isMaximized?"maximize":"restore")}),e.onDidAddGroup(s=>this._trackLocation(s)),e.onDidRemoveGroup(s=>{var l;(l=this._locationSubs.get(s.id))===null||l===void 0||l.dispose(),this._locationSubs.delete(s.id)}),{dispose:()=>{this._locationSubs.forEach(s=>s.dispose()),this._locationSubs.clear()}})}_syncPopoutRegions(){let e=this._host.element.ownerDocument,t=new Set([this._mainWindow]);for(let n of this._host.getPopoutWindows()){var i;if(n.document===e||(t.add(n),this._regions.has(n)))continue;let s=n.document,l=(i=s.body)!==null&&i!==void 0?i:s.documentElement,u={polite:en(s,"polite"),assertive:en(s,"assertive")};l.appendChild(u.polite),l.appendChild(u.assertive),this._regions.set(n,u)}for(let[n,s]of this._regions)t.has(n)||(s.polite.remove(),s.assertive.remove(),this._regions.delete(n))}_disposeRegions(){for(let e of this._regions.values())e.polite.remove(),e.assertive.remove();this._regions.clear()}_focusedRegions(){for(let[e,t]of this._regions)if(e!==this._mainWindow)try{if(e.document.hasFocus())return t}catch{}return this._regions.get(this._mainWindow)}_trackLocation(e){let t=e.api.location.type,i=e.api.onDidLocationChange(n=>{let s=n.location.type;if(s===t)return;t=s;let l=e.activePanel;if(!l)return;let u;switch(s){case"floating":u="float";break;case"popout":u="popout";break;default:u="dock";break}this._announce(l,u)});this._locationSubs.set(e.id,i)}announce(e,t="polite"){if(this._host.options.announcements===!1||this._suppressDepth>0||!e)return;let i=this._host.options.announcer;if(i){i({message:e,politeness:t});return}let n=this._focusedRegions(),s=t==="assertive"?n.assertive:n.polite;s.textContent="",s.textContent=e}_announce(e,t){var i,n;let s=(i=(n=this._host.options).getAnnouncement)===null||i===void 0?void 0:i.call(n,{kind:t,panel:e});s===null||s===""||this.announce(s??this._defaultMessage(e,t))}_defaultMessage(e,t){var i;let n=uo(this._host.options.messages),s=(i=e.title)!==null&&i!==void 0?i:e.id;switch(t){case"open":return n.panelOpened(s);case"close":return n.panelClosed(s);case"maximize":return n.groupMaximized(s);case"restore":return n.groupRestored(s);case"float":return n.groupFloated(s);case"dock":return n.groupDocked(s);case"popout":return n.groupPoppedOut(s)}}};let As=dt({name:"LiveRegion",serviceKey:"liveRegionService",create:e=>new Ih(e)}),Mh=30,Lh=-10;var Es=class{constructor(e){this.host=e}dispatchWillDragPanel(e){this.host.fireWillDragPanel(e)}dispatchWillDragGroup(e){this.host.fireWillDragGroup(e)}dispatchWillDrop(e){this.host.fireWillDrop(e)}dispatchWillShowOverlay(e){this.host.fireWillShowOverlay(e)}buildGroupDragGhost(e){let t=this.host.options.createGroupDragGhostComponent;if(!t)return;let i=t(e);return i.init({group:e,api:this.host.api}),{element:i.element,offsetX:Mh,offsetY:Lh,dispose:i.dispose?()=>{var n;return(n=i.dispose)===null||n===void 0?void 0:n.call(i)}:void 0}}resolveOverlayModel(e,t){var i,n;return(i=(n=this.host.options).dropOverlayModel)===null||i===void 0?void 0:i.call(n,{location:e,group:t})}showPreviewOverlay(e,t){let i=e.model.contentDropTarget;return i.showOverlay(t),w.from(()=>i.clearOverlay())}dispose(){}};let Is=dt({name:"AdvancedDnD",serviceKey:"advancedDnDService",create:e=>new Es(e)});var Ms=class{constructor(e){this._host=e}attachToGroup(e){return new x(e.model.onDidCreateTabGroup(t=>{this._host.fireDidCreateTabGroup(t)}),e.model.onDidDestroyTabGroup(t=>{this._host.fireDidDestroyTabGroup(t)}),e.model.onDidAddPanelToTabGroup(t=>{this._host.fireDidAddPanelToTabGroup(t)}),e.model.onDidRemovePanelFromTabGroup(t=>{this._host.fireDidRemovePanelFromTabGroup(t)}),e.model.onDidTabGroupChange(t=>{this._host.fireDidTabGroupChange(t)}),e.model.onDidTabGroupCollapsedChange(t=>{this._host.fireDidTabGroupCollapsedChange(t)}))}dispose(){}};let Ls=dt({name:"TabGroupChips",serviceKey:"tabGroupChipsService",create:e=>new Ms(e),init:(e,t)=>{let i=new Map;return new x(e.onDidAddGroup(n=>{i.set(n,t.attachToGroup(n))}),e.onDidRemoveGroup(n=>{var s;(s=i.get(n))===null||s===void 0||s.dispose(),i.delete(n)}),{dispose:()=>{for(let n of i.values())n.dispose();i.clear()}})}});function Os(e,t){var i,n;if(!((i=t.api)===null||i===void 0||(n=i.isPeeking)===null||n===void 0)&&n.call(i))return"calc(var(--dv-overlay-z-index, 999) + 100)";if(!(e instanceof HTMLElement))return;let s=Ke(e);return s?.style.zIndex?`calc(${s.style.zIndex} * 2)`:void 0}let Oh=0,Rh=()=>`dv-ctx-menu-item-${Oh++}`;function Rs(e){return typeof e=="object"}function Xe(e,t,i,n){let s=document.createElement("div");return s.className="dv-context-menu-item",s.setAttribute("role","menuitem"),n&&(s.classList.add("dv-context-menu-item--disabled"),s.setAttribute("aria-disabled","true")),s.textContent=e,n||s.addEventListener("click",()=>{i(),t()}),s}function $s(){let e=document.createElement("div");return e.className="dv-context-menu-separator",e.setAttribute("role","separator"),e}function $h(){if(globalThis.window===void 0||!globalThis.matchMedia)return!1;let e=globalThis.matchMedia("(pointer: coarse)").matches,t=globalThis.matchMedia("(pointer: fine)").matches;return e&&!t}function Nh(e){let t=document.createElement("div");t.className="dv-context-menu-rename";let i=document.createElement("input");return i.className="dv-context-menu-rename-input",i.type="text",i.placeholder="Name This Group",i.value=e.label,i.addEventListener("input",()=>{e.setLabel(i.value)}),i.addEventListener("keydown",n=>{n.key!=="Escape"&&n.key!=="Enter"&&n.stopPropagation()}),i.addEventListener("click",n=>{n.stopPropagation()}),t.appendChild(i),$h()||requestAnimationFrame(()=>{i.focus(),i.select()}),t}function Vh(e,t){let i=document.createElement("div");if(i.className="dv-context-menu-color-picker",!t.enabled)return i;for(let n of t.entries()){let s=document.createElement("div");s.className="dv-context-menu-color-swatch",s.style.setProperty("--dv-tab-group-color",n.value),n.label&&(s.title=n.label),e.color===n.id&&s.classList.add("dv-context-menu-color-swatch--selected"),s.addEventListener("click",()=>{e.setColor(n.id)}),i.appendChild(s)}return i}var Ns=class{constructor(e){this.accessor=e}buildMaximizeItem(e,t){let i=e.api.isMaximized();return Xe(i?"Restore":"Maximize",t,i?()=>e.api.exitMaximized():()=>e.api.maximize(),!i&&e.api.location.type!=="grid")}buildCollapseItem(e,t){return Xe(e.collapsed?"Expand":"Collapse",t,()=>e.toggle())}_shouldInjectPin(){let e=this.accessor.options.pinnedTabs;return!!this.accessor.pinnedTabsService&&!!e?.enabled&&e.contextMenuItem!==!1}_resolveTabItems(e,t,i){var n,s,l;let u=(n=(s=(l=this.accessor.options).getTabContextMenuItems)===null||s===void 0?void 0:s.call(l,{panel:e,group:t,api:this.accessor.api,event:i}))!==null&&n!==void 0?n:[];return this._shouldInjectPin()?["pin",...u]:u}appendComponentItem(e,t,i,n,s,l){var u,p;let g=(u=(p=this.accessor.options).createContextMenuItemComponent)===null||u===void 0?void 0:u.call(p,{id:Rh(),component:t.component});g&&(l.addDisposables(g),g.init(j(j({},i),{},{group:n,api:this.accessor.api,close:s,componentProps:t.componentProps})),e.appendChild(g.element))}buildBuiltInTabItem(e,t,i,n){switch(e){case"separator":return $s();case"close":return Xe("Close",n,()=>t.api.close());case"closeOthers":return Xe("Close Others",n,()=>{i.panels.filter(s=>s!==t).forEach(s=>s.api.close())});case"closeAll":return Xe("Close All",n,()=>{[...i.panels].forEach(s=>s.api.close())});case"closeLeft":{let s=i.panels.indexOf(t);return Xe("Close to the Left",n,()=>{i.panels.filter((l,u)=>u<s).forEach(l=>l.api.close())},s<=0)}case"closeRight":{let s=i.panels.indexOf(t);return Xe("Close to the Right",n,()=>{i.panels.filter((l,u)=>u>s).forEach(l=>l.api.close())},s===-1||s>=i.panels.length-1)}case"maximize":return this.buildMaximizeItem(t,n);case"float":return Xe("Float",n,()=>this.accessor.api.addFloatingGroup(t),t.api.location.type==="floating");case"popout":return Xe("Open in New Window",n,()=>{this.accessor.api.addPopoutGroup(t)},t.api.location.type==="popout");case"pin":return Xe(t.api.isPinned?"Unpin tab":"Pin tab",n,()=>t.api.setPinned(!t.api.isPinned));default:return}}appendConfigItem(e,t,i,n,s,l){t.element?e.appendChild(t.element):t.component?this.appendComponentItem(e,t,i,n,s,l):t.label&&e.appendChild(Xe(t.label,s,()=>{var u;return(u=t.action)===null||u===void 0?void 0:u.call(t)},t.disabled))}show(e,t,i){let n=this._resolveTabItems(e,t,i);if(n.length===0)return;i.preventDefault();let s=this.accessor.getPopupServiceForGroup(t),l=()=>s.close(),u=new x,p=document.createElement("div");p.className="dv-context-menu",p.setAttribute("role","menu");try{for(let g of n){if(Rs(g)){this.appendConfigItem(p,g,{panel:e},t,l,u);continue}let f=this.buildBuiltInTabItem(g,e,t,l);f&&p.appendChild(f)}}catch(g){throw u.dispose(),g}s.openPopover(p,{x:i.clientX,y:i.clientY,zIndex:Os(i.target,t)},{onClose:()=>u.dispose()})}showForChip(e,t,i){if(!this.accessor.options.getTabGroupChipContextMenuItems)return;let n=this.accessor.options.getTabGroupChipContextMenuItems({tabGroup:e,group:t,api:this.accessor.api,event:i});if(n.length===0)return;i.preventDefault();let s=this.accessor.getPopupServiceForGroup(t),l=()=>s.close(),u=new x,p=document.createElement("div");p.className="dv-context-menu",p.setAttribute("role","menu");try{for(let g of n)g==="separator"?p.appendChild($s()):g==="rename"?p.appendChild(Nh(e)):g==="colorPicker"?p.appendChild(Vh(e,this.accessor.tabGroupColorPalette)):g==="collapse"?p.appendChild(this.buildCollapseItem(e,l)):g==="close"?p.appendChild(Xe("Close All",l,()=>{t.panels.filter(f=>e.containsPanel(f.id)).forEach(f=>f.api.close())})):Rs(g)&&this.appendConfigItem(p,g,{tabGroup:e},t,l,u)}catch(g){throw u.dispose(),g}s.openPopover(p,{x:i.clientX,y:i.clientY,zIndex:Os(i.target,t)},{onClose:()=>u.dispose()})}};let Vs=dt({name:"ContextMenu",serviceKey:"contextMenuService",create:e=>new Ns(e)}),Wh=[Gs,xh,kh,Ps,zh,Eh,As,Is,Ls,Vs];var Hh=class{constructor(){this.cache=new WeakMap,this.currentFrameId=0,this.rafId=null}getPosition(e){let t=this.cache.get(e);if(t?.frameId===this.currentFrameId)return t.rect;this.scheduleFrameUpdate();let i=oe(e);return this.cache.set(e,{rect:i,frameId:this.currentFrameId}),i}invalidate(){this.currentFrameId++}scheduleFrameUpdate(){this.rafId||(this.rafId=requestAnimationFrame(()=>{this.currentFrameId++,this.rafId=null}))}};let Ws=-1;function Bh(){let e=document.createElement("div");return e.tabIndex=-1,e}function Xt(e,t,i){let n=`${i}px`;e[t]!==n&&(e[t]=n)}var Hs=class extends x{constructor(e,t){super(),this.element=e,this.accessor=t,this.map={},this._disposed=!1,this._generation=0,this.positionCache=new Hh,this.addDisposables(w.from(()=>{for(let i of Object.values(this.map))i.disposable.dispose(),i.destroy.dispose(),this.cancelPendingUpdate(i);this._disposed=!0}))}updateAllPositions(){if(!this._disposed){this.positionCache.invalidate();for(let e of Object.values(this.map))e.panel.api.isVisible&&e.resize&&e.resize()}}repositionPanelOverlay(e,t=!1,i){var n;if(this._disposed)return;let s=this.map[e];s&&(s.forceVisible=t,s.clip=i,this.positionCache.invalidate(),(n=s.resize)===null||n===void 0||n.call(s))}cancelPendingUpdate(e){e.pendingUpdate!==void 0&&(cancelAnimationFrame(e.pendingUpdate),e.pendingUpdate=void 0)}detatch(e){if(this.map[e.api.id]){let t=this.map[e.api.id];return t.disposable.dispose(),t.destroy.dispose(),this.cancelPendingUpdate(t),delete this.map[e.api.id],!0}return!1}attach(e){let{panel:t,referenceContainer:i}=e;if(!this.map[t.api.id]){let D=Bh();D.className="dv-render-overlay",D.style.visibility="hidden",this.map[t.api.id]={panel:t,disposable:w.NONE,destroy:w.NONE,element:D,retainPreviousGeometry:!1,positioned:!1,generation:++this._generation}}let n=this.map[t.api.id];n.referenceContainer!==i&&(n.generation=++this._generation,this.cancelPendingUpdate(n),n.referenceContainer=i,n.retainPreviousGeometry=n.positioned);let s=n.generation,l=n.element,u=t.view.content.element,p=D=>{if(!D||D.width<=0||D.height<=0)return;let k=this.map[t.api.id];!k||k.forceVisible||k.positioned&&t.api.isVisible||(Xt(l.style,"width",D.width),Xt(l.style,"height",D.height))};p(i.dimensions),u.parentElement!==l&&l.appendChild(u),l.parentElement!==this.element&&this.element.appendChild(l);let g=()=>{let D=t.api.id,k=this.map[D];if(k?.generation!==s||k.pendingUpdate!==void 0)return;k.pendingUpdate=Ws;let C=requestAnimationFrame(()=>{var T;let M=this.map[D];if(M&&(M.pendingUpdate=void 0),this.isDisposed||M?.generation!==s)return;let I=(T=M.forceVisible)!==null&&T!==void 0?T:!1,E=M.clip,$=this.positionCache.getPosition(i.element),X=this.positionCache.getPosition(this.element),Z=$.left-X.left,W=$.top-X.top,B=$.width,re=$.height;if(M.retainPreviousGeometry&&(B===0||re===0)){!t.api.isVisible&&!I&&(l.style.visibility="hidden",l.style.pointerEvents="none");return}if(M.retainPreviousGeometry=!1,M.positioned=!0,Xt(l.style,"left",Z),Xt(l.style,"top",W),Xt(l.style,"width",B),Xt(l.style,"height",re),t.api.isVisible||I?(l.style.visibility="",l.style.pointerEvents=""):(l.style.visibility="hidden",l.style.pointerEvents="none"),I?l.style.zIndex="1000":t.api.location.type!=="floating"&&(l.style.zIndex=""),E){var K,ee;let we=this.element.ownerDocument.defaultView,ve=(K=we?.scrollX)!==null&&K!==void 0?K:0,fe=(ee=we?.scrollY)!==null&&ee!==void 0?ee:0,Ae=E.top+fe,_e=E.left+ve,me=Math.max(0,Ae-$.top),Ue=Math.max(0,_e-$.left),Lt=Math.max(0,$.left+B-(E.right+ve)),Ot=Math.max(0,$.top+re-(E.bottom+fe));l.style.clipPath=`inset(${me}px ${Lt}px ${Ot}px ${Ue}px)`}else l.style.clipPath="";A(l,"dv-render-overlay-float",t.group.api.location.type==="floating")});k.pendingUpdate===Ws&&(k.pendingUpdate=C)},f=()=>{if(t.api.isVisible){var D;this.positionCache.invalidate(),g(),!((D=this.map[t.api.id])===null||D===void 0)&&D.retainPreviousGeometry&&(l.style.visibility=""),l.style.pointerEvents=""}else l.style.visibility="hidden",l.style.pointerEvents="none"},b=new S,_=()=>{t.api.location.type==="floating"?queueMicrotask(()=>{if(y.isDisposed)return;let D=this.accessor.getFloatingWindowForGroup(t.api.group);if(!D)return;let k=D.overlay.element,C=()=>{let M=Number(k.getAttribute("aria-level"));l.style.zIndex=`calc(var(--dv-overlay-z-index, 999) + ${M*2+1})`},T=new MutationObserver(()=>{C()});b.value=w.from(()=>T.disconnect()),T.observe(k,{attributeFilter:["aria-level"],attributes:!0}),C()}):l.style.zIndex=""},y=new x(b,new Hr(l,{onDragEnd:D=>{i.dropTarget.dnd.onDragEnd(D)},onDragEnter:D=>{i.dropTarget.dnd.onDragEnter(D)},onDragLeave:D=>{i.dropTarget.dnd.onDragLeave(D)},onDrop:D=>{i.dropTarget.dnd.onDrop(D)},onDragOver:D=>{i.dropTarget.dnd.onDragOver(D)}}),t.api.onDidVisibilityChange(()=>{f()}),t.api.onDidDimensionsChange(()=>{t.api.isVisible&&g()}),i.onDidDimensionsChange(D=>{p(D)}),t.api.onDidLocationChange(()=>{_()}));return this.map[t.api.id].destroy=w.from(()=>{u.parentElement===l&&u.remove(),l.remove()}),_(),queueMicrotask(()=>{this.isDisposed||f()}),this.map[t.api.id].disposable.dispose(),this.map[t.api.id].disposable=y,this.map[t.api.id].resize=g,l}},Fh=class extends x{constructor(e){super(),this.accessor=e,this.init()}init(){let e=new Set,t=new Set;this.addDisposables(this.accessor.onDidAddPanel(i=>{if(e.has(i.api.id))throw new Error(`dockview: Invalid event sequence. [onDidAddPanel] called for panel ${i.api.id} but panel already exists`);e.add(i.api.id)}),this.accessor.onDidRemovePanel(i=>{if(e.has(i.api.id))e.delete(i.api.id);else throw new Error(`dockview: Invalid event sequence. [onDidRemovePanel] called for panel ${i.api.id} but panel does not exists`)}),this.accessor.onDidAddGroup(i=>{if(t.has(i.api.id))throw new Error(`dockview: Invalid event sequence. [onDidAddGroup] called for group ${i.api.id} but group already exists`);t.add(i.api.id)}),this.accessor.onDidRemoveGroup(i=>{if(t.has(i.api.id))t.delete(i.api.id);else throw new Error(`dockview: Invalid event sequence. [onDidRemoveGroup] called for group ${i.api.id} but group does not exists`)}))}};function Uh(e){if(!e.matchMedia)return!1;let t=e.matchMedia("(pointer: coarse)").matches,i=e.matchMedia("(pointer: fine)").matches;return t&&!i}function Bs(e){var t,i,n,s,l,u,p;let g=(t=e.window)!==null&&t!==void 0?t:window,f=(i=e.capture)!==null&&i!==void 0?i:!1,b=(n=e.escape)!==null&&n!==void 0?n:!0,_=(s=e.keys)!==null&&s!==void 0?s:[],y=(l=e.outsidePointerDown)!==null&&l!==void 0?l:!0,D=(u=e.pointerDownGraceMs)!==null&&u!==void 0?u:0,k=(p=e.now)!==null&&p!==void 0?p:Date.now,C=k(),T=new x,M=I=>{var E,$;return e.isInside?e.isInside(I):ui(I,(E=($=e.elements)===null||$===void 0?void 0:$.call(e))!==null&&E!==void 0?E:[])};if((b||_.length>0)&&T.addDisposables(O(g,"keydown",I=>{(b&&I.key==="Escape"||_.includes(I.key))&&e.onDismiss()},f)),(y||e.onInsidePointerDown)&&T.addDisposables(O(g,"pointerdown",I=>{if(M(I)){var E;(E=e.onInsidePointerDown)===null||E===void 0||E.call(e,I);return}!y||k()-C<D||e.onDismiss()},f)),e.resize&&T.addDisposables(O(g,"resize",()=>{Uh(g)||e.onDismiss()})),e.focusOut){let I=()=>{var W,B,re;return(W=(B=e.anchor)===null||B===void 0?void 0:B.call(e))!==null&&W!==void 0?W:(re=e.elements)===null||re===void 0?void 0:re.call(e)[0]},E=new WeakSet,$=W=>{var B,re;if(E.has(W))return;E.add(W);let K=W.target;K instanceof Element&&((e.isFocusInside?e.isFocusInside(ae(K,I())):ui(W,(B=(re=e.elements)===null||re===void 0?void 0:re.call(e))!==null&&B!==void 0?B:[]))||e.onDismiss())},X=new Map,Z=()=>{var W,B,re;let K=new Set,ee=(W=e.anchor)===null||W===void 0?void 0:W.call(e),we=[...(B=(re=e.elements)===null||re===void 0?void 0:re.call(e))!==null&&B!==void 0?B:[],...ee?[ee]:[]];for(let ve of we)for(let fe of Y(ve))K.add(fe);for(let[ve,fe]of X)K.has(ve)||(fe.dispose(),X.delete(ve));for(let ve of K)X.has(ve)||X.set(ve,O(ve,"focusin",$,f))};T.addDisposables(O(g,"focusin",W=>{Z(),$(W)},f),{dispose:()=>{for(let[,W]of X)W.dispose();X.clear()}}),Z()}return T}var Fs=class extends x{constructor(e,t=globalThis.window){super(),this._active=null,this._activeDisposable=new S,this._root=e,this._window=t,this._element=t.document.createElement("div"),this._element.className="dv-popover-anchor",this._element.style.position="relative",this._root.prepend(this._element),this.addDisposables(w.from(()=>{this.close()}),this._activeDisposable)}updateRoot(e){e.prepend(this._element),this._root=e}openPopover(e,t,i){var n;this.close();let s=this._window.document.createElement("div");s.style.position="absolute",s.style.zIndex=(n=t.zIndex)!==null&&n!==void 0?n:"var(--dv-overlay-z-index)",s.appendChild(e);let l=this._element.getBoundingClientRect(),u=l.left,p=l.top;s.style.top=`${t.y-p}px`,s.style.left=`${t.x-u}px`,this._element.appendChild(s),this._active=s;let g=200;this._activeDisposable.value=new x(Bs({window:this._window,onDismiss:()=>this.close(),elements:()=>this._active?[this._active]:[],keys:["Enter"],pointerDownGraceMs:g,resize:!0}),i?.onClose?w.from(i.onClose):w.NONE),this._window.requestAnimationFrame(()=>{Ri(s,this._root)})}close(){this._active&&(this._active.remove(),this._activeDisposable.dispose(),this._active=null)}},Go=class extends x{get renderedOutline(){return this._model?this._outline:void 0}get disabled(){return this._disabled}set disabled(e){this.disabled!==e&&(this._disabled=e,e&&this._clearNow())}_cancelPendingClear(){this._pendingClear!==void 0&&(clearTimeout(this._pendingClear),this._pendingClear=void 0)}_clearNow(){this._cancelPendingClear(),this._model&&this._model.root.remove(),this._model=void 0}get model(){if(!this.disabled)return{clear:()=>{this._clearNow()},scheduleClear:()=>{this._pendingClear!==void 0||!this._model||(this._pendingClear=setTimeout(()=>{this._pendingClear=void 0,this._clearNow()},0))},exists:()=>!!this._model,getElements:(e,t)=>{this._cancelPendingClear();let i=this._outline!==t;if(this._outline=t,this._model)return this._model.changed=i,this._model;let n=this.createContainer(),s=this.createAnchor();if(this._model={root:n,overlay:s,changed:i},n.appendChild(s),this.element.appendChild(n),e?.target instanceof HTMLElement){let l=e.target.getBoundingClientRect(),u=this.element.getBoundingClientRect();s.style.left=`${l.left-u.left}px`,s.style.top=`${l.top-u.top}px`}return this._model}}}constructor(e,t){super(),this.element=e,this._disabled=!1,this._disabled=t.disabled,this.addDisposables(w.from(()=>{var i;(i=this.model)===null||i===void 0||i.clear()}))}createContainer(){let e=document.createElement("div");return e.className="dv-drop-target-container",e}createAnchor(){let e=document.createElement("div");return e.className="dv-drop-target-anchor",e.style.visibility="hidden",e}};let Po=["left","right","top","bottom"];function tn(e){return e==="left"||e==="right"}let Yh={marginShare:0,size:Number.POSITIVE_INFINITY};var qh=class{get _effectiveBaseCollapsed(){var e;return(e=this._measuredTabSize)!==null&&e!==void 0?e:this._baseCollapsedSize}get minimumSize(){return this._isCollapsed?this.collapsedSize:this._baseMinimumSize!==void 0?this._baseMinimumSize+this._axis.marginShare:this._effectiveBaseCollapsed+50+this._axis.marginShare}get maximumSize(){return this._isCollapsed?this.collapsedSize:this._expandedMaximumSize}get element(){return this._group.element}get isCollapsed(){return this._isCollapsed}get lastExpandedSize(){return this._lastExpandedSize}get lastExpandedContentSize(){return this._lastExpandedSize-this._axis.marginShare}get collapsedSize(){return this._effectiveBaseCollapsed+this._axis.marginShare}get configuredMinimumSize(){return this._baseMinimumSize}get configuredMaximumSize(){return this._expandedMaximumSize}get configuredCollapsedSize(){return this._baseCollapsedSize}constructor(e,t,i,n=Yh){var s,l,u;this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this.snap=!1,this.priority="low",this._isCollapsed=!1,this._isVisible=!0,this._tabSizeDisposables=new x,this._group=t,this._orientation=i,t.element.classList.add("dv-edge-group"),t.element.dataset.testid=`dv-edge-group-${e.id}`,this._baseCollapsedSize=(s=e.collapsedSize)!==null&&s!==void 0?s:35,this._baseMinimumSize=e.minimumSize,this._axis=n,this._expandedMaximumSize=(l=e.maximumSize)!==null&&l!==void 0?l:Number.POSITIVE_INFINITY,this._lastExpandedSize=(u=e.initialSize)!==null&&u!==void 0?u:200,e.collapsed&&(this._isCollapsed=!0,t.element.classList.add("dv-edge-collapsed")),this._observeTabStrip()}_observeTabStrip(){let e=this._group.element.querySelector(".dv-tabs-and-actions-container");e&&this._tabSizeDisposables.addDisposables(U(e,()=>{this._applyMeasuredTabSize(this._orientation==="vertical"?e.offsetHeight:e.offsetWidth)}))}_applyMeasuredTabSize(e){e<=0||e===this._measuredTabSize||(this._measuredTabSize=e,this._isCollapsed&&this._onDidChange.fire({size:this.collapsedSize}))}layout(e,t){!this._isCollapsed&&this._isVisible&&this._axis.size>0&&(this._lastExpandedSize=e+this._axis.marginShare),this._orientation==="horizontal"?this._group.layout(e,t):this._group.layout(t,e)}setCollapsed(e){this._isCollapsed!==e&&(this._isCollapsed=e,this._group.element.classList.toggle("dv-edge-collapsed",e))}setVisible(e){this._isVisible=e}restoreExpandedSize(e){this._lastExpandedSize=e}updateSizing(e,t){this._baseCollapsedSize=e,this._baseMinimumSize=t}dispose(){this._tabSizeDisposables.dispose(),this._onDidChange.dispose()}},jh=class{get element(){return this._dockviewElement}constructor(e,t){this._dockviewElement=e,this._layoutDockview=t,this.priority="high",this.minimumSize=100,this.maximumSize=Number.POSITIVE_INFINITY,this._onDidChange=new G,this.onDidChange=this._onDidChange.event}layout(e,t){this._layoutDockview(t,e)}setVisible(e){}dispose(){this._onDidChange.dispose()}},Kh=class{get element(){return this._element}constructor(e,t=0){this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this.minimumSize=100,this.maximumSize=Number.POSITIVE_INFINITY,this.priority="high",this._element=document.createElement("div"),this._element.className="dv-shell-middle-column",this._element.style.height="100%",this._element.style.width="100%",this._splitview=new Dt(this._element,{orientation:"VERTICAL",proportionalLayout:!1,margin:t}),this._centerIndex=0,this._splitview.addView(e,{type:"distribute"},0)}addTopView(e,t){this._splitview.addView(e,t,0),this._topIndex=0,this._centerIndex+=1,this._bottomIndex!==void 0&&(this._bottomIndex+=1)}addBottomView(e,t){let i=this._splitview.length;this._splitview.addView(e,t,i),this._bottomIndex=i}removeView(e){let t=e==="top"?this._topIndex:this._bottomIndex;t!==void 0&&(this._splitview.removeView(t),e==="top"?(this._topIndex=void 0,this._centerIndex-=1,this._bottomIndex!==void 0&&(this._bottomIndex-=1)):this._bottomIndex=void 0)}layout(e,t){this._splitview.layout(t,e)}setVisible(e){}setViewVisible(e,t){let i=e==="top"?this._topIndex:this._bottomIndex;i!==void 0&&this._splitview.setViewVisible(i,t)}isViewVisible(e){let t=e==="top"?this._topIndex:this._bottomIndex;return t!==void 0?this._splitview.isViewVisible(t):!1}getViewSize(e){let t=e==="top"?this._topIndex:this._bottomIndex;return t!==void 0?this._splitview.getViewSize(t):0}getViewCachedVisibleSize(e){let t=e==="top"?this._topIndex:this._bottomIndex;if(t!==void 0)return this._splitview.getViewCachedVisibleSize(t)}resizeView(e,t){let i=e==="top"?this._topIndex:this._bottomIndex;i!==void 0&&this._splitview.resizeView(i,t)}get axis(){return this._splitview}updateMargin(e){this._splitview.margin=e}get disabled(){return this._splitview.disabled}set disabled(e){this._splitview.disabled=e}dispose(){this._onDidChange.dispose(),this._splitview.dispose()}},Jh=class{constructor(e,t,i,n=0,s=35){this._disposables=new x,this._viewConfigs=new Map,this._pendingSizes=new Map,this._currentWidth=0,this._currentHeight=0,this._gap=n,this._defaultCollapsedSize=s,this._shellElement=document.createElement("div"),this._shellElement.className="dv-shell",this._shellElement.style.height="100%",this._shellElement.style.width="100%",this._shellElement.style.position="relative",e.appendChild(this._shellElement);let l=new jh(t,i);this._middleColumn=new Kh(l,n),this._outerSplitview=new Dt(this._shellElement,{orientation:"HORIZONTAL",proportionalLayout:!1,margin:n}),this._middleIndex=0,this._outerSplitview.addView(this._middleColumn,{type:"distribute"},0),this._disposables.addDisposables(U(this._shellElement,u=>{if(!this._shellElement.offsetParent||!le(this._shellElement))return;let p=Math.round(u.contentRect.width),g=Math.round(u.contentRect.height);p===this._currentWidth&&g===this._currentHeight||this.layout(p,g)}),this._outerSplitview,this._middleColumn,l)}get element(){return this._shellElement}get locked(){return this._outerSplitview.disabled}set locked(e){this._outerSplitview.disabled=e,this._middleColumn.disabled=e}addEdgeView(e,t,i){if(this.hasEdgeGroup(e))throw new Error(`dockview: edge group already registered at position '${e}'`);this._viewConfigs.set(e,t);let n=new qh(j({collapsedSize:this._defaultCollapsedSize},t),i,tn(e)?"horizontal":"vertical",this._axisFor(e)),s=n.isCollapsed?n.collapsedSize:n.lastExpandedSize;switch(e){case"left":this._outerSplitview.addView(n,s,0),this._leftIndex=0,this._middleIndex+=1,this._rightIndex!==void 0&&(this._rightIndex+=1),this._leftView=n;break;case"right":{let l=this._outerSplitview.length;this._outerSplitview.addView(n,s,l),this._rightIndex=l,this._rightView=n}break;case"top":this._middleColumn.addTopView(n,s),this._topView=n;break;case"bottom":this._middleColumn.addBottomView(n,s),this._bottomView=n;break}return this._disposables.addDisposables(n),!n.isCollapsed&&!this._canResize(e)&&this._pendingSizes.set(e,s),this._relayout(),n}layoutFromElement(){if(!this._shellElement.offsetParent||!le(this._shellElement))return;let e=Math.round(this._shellElement.clientWidth),t=Math.round(this._shellElement.clientHeight);e===0||t===0||this.layout(e,t)}layout(e,t){this._currentWidth=e,this._currentHeight=t,this._outerSplitview.layout(e,t),this._flushPendingSizes()}updateTheme(e,t){this._gap=e,this._defaultCollapsedSize=t,this._outerSplitview.margin=e,this._middleColumn.updateMargin(e),this._applyThemeSizing(),this._relayout()}_hasSiblingOn(e){return tn(e)?this._leftView!==void 0&&this._rightView!==void 0:this._topView!==void 0&&this._bottomView!==void 0}_axisFor(e){return tn(e)?this._outerSplitview:this._middleColumn.axis}_applyThemeSizing(){for(let t of Po){let i=this._getView(t),n=this._viewConfigs.get(t);if(i&&n){var e;i.updateSizing((e=n.collapsedSize)!==null&&e!==void 0?e:this._defaultCollapsedSize,n.minimumSize)}}}_relayout(){this._currentWidth>0&&this._currentHeight>0&&this.layout(this._currentWidth,this._currentHeight)}_slotSize(e){switch(e){case"left":return this._leftIndex===void 0?0:this._outerSplitview.getViewSize(this._leftIndex);case"right":return this._rightIndex===void 0?0:this._outerSplitview.getViewSize(this._rightIndex);case"top":case"bottom":return this._middleColumn.getViewSize(e)}}removeEdgeView(e){let t=this._getView(e);if(t){switch(e){case"left":this._outerSplitview.removeView(this._leftIndex),this._leftIndex=void 0,this._leftView=void 0,this._middleIndex-=1,this._rightIndex!==void 0&&(this._rightIndex-=1);break;case"right":this._outerSplitview.removeView(this._rightIndex),this._rightIndex=void 0,this._rightView=void 0;break;case"top":this._middleColumn.removeView("top"),this._topView=void 0;break;case"bottom":this._middleColumn.removeView("bottom"),this._bottomView=void 0;break}this._disposables.removeDisposable(t),t.dispose(),this._viewConfigs.delete(e),this._pendingSizes.delete(e),this._relayout()}}hasEdgeGroup(e){switch(e){case"top":return this._topView!==void 0;case"bottom":return this._bottomView!==void 0;case"left":return this._leftView!==void 0;case"right":return this._rightView!==void 0}}setEdgeGroupVisible(e,t){let i=this._getView(e)!==void 0&&t!==this.isEdgeGroupVisible(e);switch(e){case"left":this._leftIndex!==void 0&&this._outerSplitview.setViewVisible(this._leftIndex,t);break;case"right":this._rightIndex!==void 0&&this._outerSplitview.setViewVisible(this._rightIndex,t);break;case"top":case"bottom":this._middleColumn.setViewVisible(e,t);break}i&&this._gap>0&&this._hasSiblingOn(e)&&this._relayout(),t&&this._flushPendingSizes()}isEdgeGroupVisible(e){switch(e){case"left":return this._leftIndex!==void 0?this._outerSplitview.isViewVisible(this._leftIndex):!1;case"right":return this._rightIndex!==void 0?this._outerSplitview.isViewVisible(this._rightIndex):!1;case"top":case"bottom":return this._middleColumn.isViewVisible(e)}}setEdgeGroupCollapsed(e,t){let i=this._getView(e);i&&(i.setCollapsed(t),t?(this._pendingSizes.delete(e),this._resizeView(e,i.collapsedSize)):this.resizeEdgeGroup(e,i.lastExpandedSize))}resizeEdgeGroup(e,t){let i=this._getView(e);if(!i||!Number.isFinite(t))return;let n=Math.round(t);if(!(n<=0)){if(i.restoreExpandedSize(n),i.isCollapsed){this._pendingSizes.delete(e);return}this._canResize(e)?(this._pendingSizes.delete(e),this._resizeView(e,n)):this._pendingSizes.set(e,n)}}_canResize(e){return this.isEdgeGroupVisible(e)&&this._axisFor(e).size>0}_resizeView(e,t){switch(e){case"left":this._leftIndex!==void 0&&this._outerSplitview.resizeView(this._leftIndex,t);break;case"right":this._rightIndex!==void 0&&this._outerSplitview.resizeView(this._rightIndex,t);break;case"top":case"bottom":this._middleColumn.resizeView(e,t);break}}_flushPendingSizes(){if(this._pendingSizes.size!==0)for(let[e,t]of this._pendingSizes){let i=this._getView(e);!i||i.isCollapsed||!this._canResize(e)||(this._pendingSizes.delete(e),this._resizeView(e,t))}}isEdgeGroupCollapsed(e){var t,i;return(t=(i=this._getView(e))===null||i===void 0?void 0:i.isCollapsed)!==null&&t!==void 0?t:!1}getEdgeGroupExpandedSize(e){var t,i;return(t=(i=this._getView(e))===null||i===void 0?void 0:i.lastExpandedContentSize)!==null&&t!==void 0?t:0}_getView(e){switch(e){case"top":return this._topView;case"bottom":return this._bottomView;case"left":return this._leftView;case"right":return this._rightView}}toJSON(){let e={};for(let t of Po){let i=this._getView(t);if(!i)continue;let n=this.isEdgeGroupVisible(t);e[t]={size:this._expandedSize(i,t,n),visible:n,collapsed:i.isCollapsed||void 0,minimumSize:i.configuredMinimumSize,maximumSize:Number.isFinite(i.configuredMaximumSize)?i.configuredMaximumSize:void 0,collapsedSize:i.configuredCollapsedSize}}return e}_expandedSize(e,t,i){if(e.isCollapsed)return e.lastExpandedSize;let n=this._pendingSizes.get(t);if(n!==void 0)return n;if(!i){var s;return(s=this._cachedVisibleSize(t))!==null&&s!==void 0?s:e.lastExpandedSize}return this._slotSize(t)}_cachedVisibleSize(e){switch(e){case"left":return this._leftIndex===void 0?void 0:this._outerSplitview.getViewCachedVisibleSize(this._leftIndex);case"right":return this._rightIndex===void 0?void 0:this._outerSplitview.getViewCachedVisibleSize(this._rightIndex);case"top":case"bottom":return this._middleColumn.getViewCachedVisibleSize(e)}}fromJSON(e){for(let i of Po){var t;let n=e[i],s=this._getView(i);!n||!s||(s.restoreExpandedSize(n.size),s.setCollapsed((t=n.collapsed)!==null&&t!==void 0?t:!1),n.collapsed?(this._pendingSizes.delete(i),this._resizeView(i,s.collapsedSize)):this.resizeEdgeGroup(i,n.size),this.setEdgeGroupVisible(i,!!n.visible))}}dispose(){this._disposables.dispose(),this._shellElement.remove()}};function Us(e){e.error?console.error("dockview: failed to create popout.",e.error):e.reason==="blocked"?console.error("dockview: failed to create popout. perhaps you need to allow pop-ups for this website"):console.error(`dockview: failed to create popout (${e.reason}).`)}function Xh(e){var t;return new yo((t=e.tabGroupColors)!==null&&t!==void 0?t:qi,e.tabGroupAccent!=="off")}function nn(e){let t=e.from.activePanel;[...e.from.panels].map(i=>{let n=e.from.model.removePanel(i);return e.from.model.renderContainer.detatch(i),n}).forEach(i=>{e.to.model.openPanel(i,{skipSetActive:t!==i,skipSetGroupActive:!0})})}let zo=()=>({dispose:()=>{}}),Zh=zo;var Ys=class extends ho{fireDidCreateTabGroup(e){this._onDidCreateTabGroup.fire(e)}fireDidDestroyTabGroup(e){this._onDidDestroyTabGroup.fire(e)}fireDidAddPanelToTabGroup(e){this._onDidAddPanelToTabGroup.fire(e)}fireDidRemovePanelFromTabGroup(e){this._onDidRemovePanelFromTabGroup.fire(e)}fireDidTabGroupChange(e){this._onDidTabGroupChange.fire(e)}fireDidTabGroupCollapsedChange(e){this._onDidTabGroupCollapsedChange.fire(e)}get orientation(){return this.gridview.orientation}get totalPanels(){return this.panels.length}get panels(){return this.groups.flatMap(e=>e.panels)}get dndCapabilities(){return Je(this.options)}get options(){return this._options}get tabGroupColorPalette(){return this._tabGroupColorPalette}get activePanel(){let e=this.activeGroup;if(e)return e.activePanel}get renderer(){var e;return(e=this.options.defaultRenderer)!==null&&e!==void 0?e:"onlyWhenVisible"}get defaultHeaderPosition(){var e;return(e=this.options.defaultHeaderPosition)!==null&&e!==void 0?e:"top"}get api(){return this._api}get floatingGroups(){var e,t;return(e=(t=this._moduleRegistry)===null||t===void 0||(t=t.services.floatingGroupService)===null||t===void 0?void 0:t.floatingGroups)!==null&&e!==void 0?e:[]}getFloatingWindowForGroup(e){var t;return(t=this._floatingGroupService)===null||t===void 0?void 0:t.findByGroup(e)}_gatherFloatingGroupBoxes(e){return this.getFloatingGroupSnapshots(e).map(t=>t.box)}getFloatingContainer(){var e;return(e=this._floatingOverlayHost)!==null&&e!==void 0?e:this.gridview.element}getFloatingGroupSnapshots(e){let t=this.getFloatingContainer().getBoundingClientRect();return this.floatingGroups.filter(i=>i.group!==e).map(i=>{let n=i.overlay.element.getBoundingClientRect();return{group:i.group,box:{left:n.left-t.left,top:n.top-t.top,width:n.width,height:n.height}}})}mergeFloatInto(e,t,i){e===t||!this.getPanel(t.id)||this.moveGroupOrPanel({from:{groupId:e.id},to:{group:t,position:i}})}getGridSplitterRects(){let e=this.getFloatingContainer().getBoundingClientRect(),t=[];return this.gridview.element.querySelectorAll(".dv-sash").forEach(i=>{let n=i.getBoundingClientRect();t.push({left:n.left-e.left,top:n.top-e.top,width:n.width,height:n.height})}),t}get _smartGuidesService(){return this._moduleRegistry.services.smartGuidesService}get smartGuidesEnabled(){var e,t;return(e=(t=this._smartGuidesService)===null||t===void 0?void 0:t.enabled)!==null&&e!==void 0?e:!1}setSmartGuidesEnabled(e){var t;(t=Fe(this._smartGuidesService,"SmartGuides","api.setSmartGuidesEnabled"))===null||t===void 0||t.setEnabled(e)}updateSmartGuidesOptions(e){var t;(t=Fe(this._smartGuidesService,"SmartGuides","api.updateSmartGuidesOptions"))===null||t===void 0||t.updateOptions(e)}get onDidSnapFloat(){var e,t;return(e=(t=this._smartGuidesService)===null||t===void 0?void 0:t.onDidSnapFloat)!==null&&e!==void 0?e:zo}get onDidSnapTogether(){var e,t;return(e=(t=this._smartGuidesService)===null||t===void 0?void 0:t.onDidSnapTogether)!==null&&e!==void 0?e:zo}_buildFloatingDragTransform(e,t){let i=this.options.transformFloatingGroupDrag,n=!t;if(!(!i&&!(n&&this._smartGuidesService)))return s=>{var l,u;let p=i?.({group:e,proposed:s.proposed,container:s.container,others:s.others,modifiers:s.modifiers}),g=p?j(j({},s.proposed),p):s.proposed,f=n?(l=this._smartGuidesService)===null||l===void 0?void 0:l.transformFloatingGroupDrag({group:e,proposed:g,container:s.container,others:s.others,modifiers:s.modifiers}):void 0;return(u=f??p)!==null&&u!==void 0?u:void 0}}get _floatingGroupService(){return this._moduleRegistry.services.floatingGroupService}get _popoutWindowService(){return this._moduleRegistry.services.popoutWindowService}get _watermarkService(){return this._moduleRegistry.services.watermarkService}get _edgeGroupService(){return this._moduleRegistry.services.edgeGroupService}get _rootDropTargetService(){return this._moduleRegistry.services.rootDropTargetService}get _advancedDnDService(){return this._moduleRegistry.services.advancedDnDService}get _dndCompassService(){return this._moduleRegistry.services.dndCompassService}canDropOnGroup(e,t,i){return e.model.canDisplayContentOverlay(i,t)}getDropOverlayElement(e){var t,i;let n=e.element.querySelector(".dv-content-container");if(n)return((t=this.options.theme)===null||t===void 0?void 0:t.dndPanelOverlay)==="group"&&(i=n.parentElement)!==null&&i!==void 0?i:n}getTabsListElement(e){return e.model.header.hidden?void 0:e.model.tabsListElement}relayoutGroup(e){e.relayout()}setForcedOverflow(e,t){e.model.header.setForcedOverflow(t)}getLayoutElement(){return this.gridview.element}getDropPositionResolver(){var e;if(this.options.dropPositionResolver)return this.options.dropPositionResolver;let t=(e=this._dndCompassService)===null||e===void 0?void 0:e.resolver,i=this._moduleRegistry.services.autoEdgeGroupService;return t&&i?{resolve:n=>{var s;return(s=i.resolveEdge(n))!==null&&s!==void 0?s:t.resolve(n)}}:t??i?.resolver}dockToLayoutEdge(e,t){let i=new Do({nativeEvent:e,position:t,panel:void 0,api:this._api,group:void 0,getData:v,kind:"edge"});if(this._onWillDrop.fire(i),i.defaultPrevented)return;let n=v();if(n){var s;this.moveGroupOrPanel({from:{groupId:n.groupId,panelId:(s=n.panelId)!==null&&s!==void 0?s:void 0},to:{group:this.orthogonalize(t),position:"center"}})}else this._onDidDrop.fire(new Xi({nativeEvent:e,position:t,panel:void 0,api:this._api,group:void 0,getData:v}))}get headerActionsService(){return this._moduleRegistry.services.headerActionsService}get _layoutHistoryService(){return this._moduleRegistry.services.layoutHistoryService}undo(){var e;(e=Fe(this._layoutHistoryService,"LayoutHistory","api.undo"))===null||e===void 0||e.undo()}redo(){var e;(e=Fe(this._layoutHistoryService,"LayoutHistory","api.redo"))===null||e===void 0||e.redo()}get canUndo(){var e,t;return(e=(t=this._layoutHistoryService)===null||t===void 0?void 0:t.canUndo)!==null&&e!==void 0?e:!1}get canRedo(){var e,t;return(e=(t=this._layoutHistoryService)===null||t===void 0?void 0:t.canRedo)!==null&&e!==void 0?e:!1}clearHistory(){var e;(e=this._layoutHistoryService)===null||e===void 0||e.clear()}get onDidChangeHistory(){var e,t;return(e=(t=this._layoutHistoryService)===null||t===void 0?void 0:t.onDidChangeHistory)!==null&&e!==void 0?e:Zh}get hasEdgeDragReveal(){return!!this._moduleRegistry.services.autoEdgeGroupService}isGridEmpty(){return this.gridview.length===0}rootDropTargetOverrideTarget(){var e;return(e=this.rootDropTargetContainer)===null||e===void 0?void 0:e.model}dispatchUnhandledDragOver(e,t){let i=new _o(e,"edge",t,v);return this._onUnhandledDragOver.fire(i),i.isAccepted}fireWillDragPanel(e){this._onWillDragPanel.fire(e)}fireWillDragGroup(e){this._onWillDragGroup.fire(e)}fireWillDrop(e){this._onWillDrop.fire(e)}fireWillShowOverlay(e){this._onWillShowOverlay.fire(e)}buildGroupDragGhost(e){var t;return(t=this._advancedDnDService)===null||t===void 0?void 0:t.buildGroupDragGhost(e)}resolveDropOverlayModel(e,t){var i;return(i=this._advancedDnDService)===null||i===void 0?void 0:i.resolveOverlayModel(e,t)}get rootElement(){var e,t;return(e=(t=this._shellManager)===null||t===void 0?void 0:t.element)!==null&&e!==void 0?e:this.element}ownsElement(e){if(this.rootElement.contains(e))return!0;let t=this.rootElement.ownerDocument,i=e.ownerDocument;return!i||i===t?!1:this.getPopoutWindows().some(n=>n.document===i)}adjacentGroup(e,t){var i;if(e.api.location.type!=="grid")return;let n=xe(e.element);return(i=t?this.gridview.previous(n):this.gridview.next(n))===null||i===void 0?void 0:i.view}adjacentGroupInDirection(e,t){if(e.api.location.type!=="grid")return;let i=e.element.getBoundingClientRect(),n=i.left+i.width/2,s=i.top+i.height/2,l,u=Number.POSITIVE_INFINITY;for(let p of this.groups){if(p===e||p.api.location.type!=="grid")continue;let g=p.element.getBoundingClientRect(),f=g.left+g.width/2-n,b=g.top+g.height/2-s,_;switch(t){case"left":_=f<0&&Math.abs(f)>=Math.abs(b);break;case"right":_=f>0&&Math.abs(f)>=Math.abs(b);break;case"up":_=b<0&&Math.abs(b)>=Math.abs(f);break;default:_=b>0&&Math.abs(b)>=Math.abs(f);break}if(!_)continue;let y=f*f+b*b;y<u&&(u=y,l=p)}return l}showDropPreview(e,t){var i,n;return(i=(n=this._advancedDnDService)===null||n===void 0?void 0:n.showPreviewOverlay(e,t))!==null&&i!==void 0?i:w.NONE}announce(e){var t;(t=this._moduleRegistry.services.liveRegionService)===null||t===void 0||t.announce(e)}dockPanel(e,t,i){this.moveGroupOrPanel({from:{groupId:e.group.id,panelId:e.id},to:{group:t,position:i}})}floatPanel(e){this.addFloatingGroup(e)}get contextMenuService(){return this._moduleRegistry.services.contextMenuService}get pinnedTabsService(){return this._moduleRegistry.services.pinnedTabsService}get advancedOverflowService(){return this._moduleRegistry.services.advancedOverflowService}setPanelPinned(e,t){var i;e.isPinned!==t&&!((i=this.options.pinnedTabs)===null||i===void 0)&&i.enabled&&this.pinnedTabsService&&(e.setPinned(t),this._onDidPanelPinnedChange.fire({panel:e,isPinned:t}))}get mountElement(){return this.gridview.element}hasVisibleGridGroup(){return this.groups.some(e=>e.api.location.type==="grid"&&e.api.isVisible)}fireLayoutChange(){this._bufferOnDidLayoutChange.fire()}get popoutRestorationPromise(){var e,t;return(e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.restorationPromise)!==null&&e!==void 0?e:Promise.resolve()}constructor(e,t){var i,n,s,l,u,p;super(e,{proportionalLayout:(i=t.proportionalLayout)!==null&&i!==void 0?i:!0,orientation:"HORIZONTAL",styles:t.hideBorders?{separatorBorder:"transparent"}:void 0,disableAutoResizing:t.disableAutoResizing,locked:t.locked,margin:(n=(s=t.theme)===null||s===void 0?void 0:s.gap)!==null&&n!==void 0?n:0,className:t.className}),this.nextGroupId=io(),this._deserializer=new xs(this),this._moduleRegistry=new vh,this._onWillDragPanel=new G,this.onWillDragPanel=this._onWillDragPanel.event,this._onWillDragGroup=new G,this.onWillDragGroup=this._onWillDragGroup.event,this._onDidDrop=new G,this.onDidDrop=this._onDidDrop.event,this._onWillDrop=new G,this.onWillDrop=this._onWillDrop.event,this._mutationDepth=0,this._syncMutationDepth=0,this._pendingLocationChanges=new Map,this._openingPopoutWindows=new Set,this._origin="user",this._originDepth=0,this._onWillMutateLayout=new G,this.onWillMutateLayout=this._onWillMutateLayout.event,this._onDidMutateLayout=new G,this.onDidMutateLayout=this._onDidMutateLayout.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._onUnhandledDragOver=new G,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this._onDidRemovePanel=new G,this.onDidRemovePanel=this._onDidRemovePanel.event,this._onDidAddPanel=new G,this.onDidAddPanel=this._onDidAddPanel.event,this._onDidPopoutGroupSizeChange=new G,this.onDidPopoutGroupSizeChange=this._onDidPopoutGroupSizeChange.event,this._onDidPopoutGroupPositionChange=new G,this.onDidPopoutGroupPositionChange=this._onDidPopoutGroupPositionChange.event,this._onDidAddPopoutGroup=new G,this.onDidAddPopoutGroup=this._onDidAddPopoutGroup.event,this._onDidRemovePopoutGroup=new G,this.onDidRemovePopoutGroup=this._onDidRemovePopoutGroup.event,this._onDidChangePopouts=new G,this.onDidChangePopouts=this._onDidChangePopouts.event,this._onDidOpenPopoutWindowFail=new G,this.onDidOpenPopoutWindowFail=this._onDidOpenPopoutWindowFail.event,this._onWillClosePopoutWindow=new G,this.onWillClosePopoutWindow=this._onWillClosePopoutWindow.event,this._onDidStartFloatingGroupDrag=new G,this.onDidStartFloatingGroupDrag=this._onDidStartFloatingGroupDrag.event,this._onDidEndFloatingGroupDrag=new G,this.onDidEndFloatingGroupDrag=this._onDidEndFloatingGroupDrag.event,this._onDidLayoutFromJSON=new G,this.onDidLayoutFromJSON=this._onDidLayoutFromJSON.event,this._onDidActivePanelChange=new G({replay:!0}),this.onDidActivePanelChange=this._onDidActivePanelChange.event,this._onDidPanelPinnedChange=new G,this.onDidPanelPinnedChange=this._onDidPanelPinnedChange.event,this._onDidMovePanel=new G,this.onDidMovePanel=this._onDidMovePanel.event,this._onDidCreateTabGroup=new G,this.onDidCreateTabGroup=this._onDidCreateTabGroup.event,this._onDidDestroyTabGroup=new G,this.onDidDestroyTabGroup=this._onDidDestroyTabGroup.event,this._onDidAddPanelToTabGroup=new G,this.onDidAddPanelToTabGroup=this._onDidAddPanelToTabGroup.event,this._onDidRemovePanelFromTabGroup=new G,this.onDidRemovePanelFromTabGroup=this._onDidRemovePanelFromTabGroup.event,this._onDidTabGroupChange=new G,this.onDidTabGroupChange=this._onDidTabGroupChange.event,this._onDidTabGroupCollapsedChange=new G,this.onDidTabGroupCollapsedChange=this._onDidTabGroupCollapsedChange.event,this._onDidMaximizedGroupChange=new G,this.onDidMaximizedGroupChange=this._onDidMaximizedGroupChange.event,this._inShellLayout=!1,this._onDidRemoveGroup=new G,this.onDidRemoveGroup=this._onDidRemoveGroup.event,this._onDidEdgeGroupAutoHideChange=new G,this.onDidEdgeGroupAutoHideChange=this._onDidEdgeGroupAutoHideChange.event,this._onDidAddGroup=new G,this.onDidAddGroup=this._onDidAddGroup.event,this._onDidOptionsChange=new G,this.onDidOptionsChange=this._onDidOptionsChange.event,this._onDidActiveGroupChange=new G,this.onDidActiveGroupChange=this._onDidActiveGroupChange.event,this._peekingGroups=new Set,this._moving=!1,this._options=t,this._tabGroupColorPalette=Xh(t);let g=t.modules,f=g??[...Wh,...Cs()];for(let y of f)this._moduleRegistry.register(y);this._moduleRegistry.initialize(this),this.reportMissingOptionModules(t);let b=this._popoutWindowService;b&&this.addDisposables(b.onDidRemove(y=>{this._onDidRemovePopoutGroup.fire({id:y.popoutGroup.id,group:y.popoutGroup,window:y.getWindow()})})),this.popupService=new Fs(this.element),this.addDisposables(this.popupService,w.from(()=>{for(let y of this._openingPopoutWindows)y.dispose();this._openingPopoutWindows.clear()})),this._api=new Bi(this),this.disableResizing=!0,this.element.remove(),this._shellManager=new Jh(e,this.element,(y,D)=>this._layoutFromShell(y,D),(l=(u=t.theme)===null||u===void 0?void 0:u.gap)!==null&&l!==void 0?l:0,(p=t.theme)===null||p===void 0?void 0:p.edgeGroupCollapsedSize),this._shellManager.locked=!!t.locked,this.popupService.updateRoot(this._shellManager.element),this._shellThemeClassnames=new We(this._shellManager.element),this.rootDropTargetContainer=new Go(this._shellManager.element,{disabled:!0}),this.floatingDropTargetContainer=new Go(this._shellManager.element,{disabled:!1}),this.overlayRenderContainer=new Hs(this._shellManager.element,this),this._floatingOverlayHost=document.createElement("div"),this._floatingOverlayHost.className="dv-floating-overlay-host",this._shellManager.element.appendChild(this._floatingOverlayHost),A(this.gridview.element,"dv-dockview",!0),A(this.element,"dv-debug",!!t.debug),this.updateTheme(),t.debug&&this.addDisposables(new Fh(this)),this.addDisposables(w.from(()=>this._pendingLocationChanges.clear()),this.rootDropTargetContainer,this.floatingDropTargetContainer,O(this._shellManager.element,"dragend",()=>{var y,D;(y=this.rootDropTargetContainer.model)===null||y===void 0||y.clear(),(D=this.floatingDropTargetContainer.model)===null||D===void 0||D.clear()},!0),this.overlayRenderContainer,this._onWillDragPanel,this._onWillDragGroup,this._onWillShowOverlay,this._onDidActivePanelChange,this._onDidPanelPinnedChange,this._onDidAddPanel,this._onDidRemovePanel,this._onDidLayoutFromJSON,this._onDidDrop,this._onWillDrop,this._onWillMutateLayout,this._onDidMutateLayout,this._onDidMovePanel,this._onDidMovePanel.event(()=>{this.debouncedUpdateAllPositions()}),this._onDidAddGroup,this._onDidRemoveGroup,this._onDidEdgeGroupAutoHideChange,this._onDidActiveGroupChange,this._onUnhandledDragOver,this._onDidMaximizedGroupChange,this._onDidPopoutGroupSizeChange,this._onDidPopoutGroupPositionChange,this._onDidAddPopoutGroup,this._onDidRemovePopoutGroup,this._onDidChangePopouts,this._onDidAddPopoutGroup.event(()=>this._onDidChangePopouts.fire()),this._onDidRemovePopoutGroup.event(()=>this._onDidChangePopouts.fire()),this._onDidOpenPopoutWindowFail,this._onDidStartFloatingGroupDrag,this._onDidEndFloatingGroupDrag,this._onDidCreateTabGroup,this._onDidDestroyTabGroup,this._onDidAddPanelToTabGroup,this._onDidRemovePanelFromTabGroup,this._onDidTabGroupChange,this._onDidTabGroupCollapsedChange,P.any(this.onDidPopoutGroupSizeChange,this.onDidPopoutGroupPositionChange,this.onDidCreateTabGroup,this.onDidDestroyTabGroup,this.onDidAddPanelToTabGroup,this.onDidRemovePanelFromTabGroup,this.onDidTabGroupChange,this.onDidTabGroupCollapsedChange)(()=>{this.fireLayoutChange()}),this._onDidOptionsChange,this.onDidAdd(y=>{this._moving||this._onDidAddGroup.fire(y)}),this.onDidRemove(y=>{this._moving||this._onDidRemoveGroup.fire(y)}),this.onDidActiveChange(y=>{this._moving||this._onDidActiveGroupChange.fire(y)}),this.onDidMaximizedChange(y=>{this._onDidMaximizedGroupChange.fire({group:y.panel,isMaximized:y.isMaximized})}),P.any(this.onDidAddPanel,this.onDidRemovePanel,this.onDidAddGroup,this.onDidRemove,this.onDidRemoveGroup,this.onDidMovePanel,this.onDidActivePanelChange)(()=>{this._bufferOnDidLayoutChange.fire()}),w.from(()=>{var y;this._moduleRegistry.dispose(),(y=this._shellManager)===null||y===void 0||y.dispose()}),this._onWillClosePopoutWindow);let _=this._rootDropTargetService;_&&this.addDisposables(_.onWillShowOverlay(y=>{this.gridview.length>0&&y.position==="center"||this._onWillShowOverlay.fire(new Jt(y,{kind:"edge",panel:void 0,api:this._api,group:void 0,getData:v}))}),_.onDrop(y=>this.dockToLayoutEdge(y.nativeEvent,y.position))),this._moduleRegistry.postConstruct(this),this._shellManager.layoutFromElement()}setVisible(e,t){switch(e.api.location.type){case"grid":super.setVisible(e,t);break;case"floating":{let i=this.floatingGroups.find(n=>n.group===e);i&&(i.overlay.setVisible(t),e.api._onDidVisibilityChange.fire({isVisible:t}));break}case"popout":console.warn("dockview: You cannot hide a group that is in a popout window");break;case"edge":break}}getPopupServiceForGroup(e){var t,i;return(t=(i=this._popoutWindowService)===null||i===void 0||(i=i.findByGroup(e))===null||i===void 0?void 0:i.popupService)!==null&&t!==void 0?t:this.popupService}addPopoutGroup(e,t){return this.mutationAsync("popout",()=>this._doAddPopoutGroup(e,t))}getPopouts(){var e,t;return(e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.entries.map(i=>({id:i.popoutGroup.id,group:i.popoutGroup,window:i.getWindow()})))!==null&&e!==void 0?e:[]}getPopoutWindows(){return this.getPopouts().map(e=>e.window)}_doAddPopoutGroup(e,t){var i,n,s,l,u;let p=Fe(this._popoutWindowService,"PopoutWindow","api.addPopoutGroup");if(!p||e instanceof fi&&e.model.location.type==="edge")return Promise.resolve(!1);if(e instanceof Mt&&e.group.size===1&&this.closeEmptyGroups)return this.addPopoutGroup(e.group,t);let g=Pe(this.gridview.element),f=this.element;function b(){var I,E;if(t?.position)return t.position;let $=(e instanceof fi?e.element:(I=(E=e.group)===null||E===void 0?void 0:E.element)!==null&&I!==void 0?I:f).getBoundingClientRect();return{left:window.screenX+$.left,top:window.screenY+$.top,width:$.width,height:$.height}}let _=b(),y=(i=t==null||(n=t.overridePopoutGroup)===null||n===void 0?void 0:n.id)!==null&&i!==void 0?i:this.getNextGroupId(),D=(s=t?.popoutUrl)!==null&&s!==void 0?s:(l=this.options)===null||l===void 0?void 0:l.popoutUrl,k=D??"/popout.html",C=new Wl(`${this.id}-${y}`,g??"",{url:k,left:_.left,top:_.top,width:_.width,height:_.height,onDidOpen:t?.onDidOpen,onWillClose:I=>{var E;t==null||(E=t.onWillClose)===null||E===void 0||E.call(t,I),this._onWillClosePopoutWindow.fire(I)},nonce:(u=this.options)===null||u===void 0?void 0:u.nonce,styleRoot:()=>this.element.getRootNode()}),T=new x(C,C.onDidClose(()=>{T.dispose()}));this._openingPopoutWindows.add(T);let M=Qn(k);return(M?Promise.resolve(null):C.open()).then(I=>{var E,$;if(this._openingPopoutWindows.delete(T),this.isDisposed)return T.dispose(),!1;if(C.isDisposed){let Te=C.failure;return Te&&!this.isDisposed&&(Us(Te),this._onDidOpenPopoutWindowFail.fire(Te)),!1}let X=(E=t?.referenceGroup)!==null&&E!==void 0?E:e instanceof Mt?e.group:e,Z=e.api.location.type,W=X.element.parentElement!==null,B;if(t?.overridePopoutGridview){var re;B=(re=t.overridePopoutGroup)!==null&&re!==void 0?re:X}else W?t?.overridePopoutGroup?B=t.overridePopoutGroup:(B=this.createGroup({id:y}),I&&this._onDidAddGroup.fire(B)):B=X;if(I===null){var K;return this.handleBlockedPopout({group:B,referenceGroup:X,options:t,popoutWindowDisposable:T,failure:M?{reason:"url-refused",error:M}:(K=C.failure)!==null&&K!==void 0?K:{reason:"blocked"}}),!1}let ee=document.createElement("div");ee.className="dv-overlay-render-container";let we=new Hs(ee,this);B.model.renderContainer=we;let ve=($=t?.overridePopoutGridview)!==null&&$!==void 0?$:this.createNestedGridview();t?.overridePopoutGridview?ve.locked=this.gridview.locked:ve.addView(B,Ce.Distribute,[0]),ve.element.style.width="100%",ve.element.style.height="100%",ve.layout(C.window.innerWidth,C.window.innerHeight);let fe=!1,Ae=()=>{fe||(fe=!0,ve.dispose())},_e,me=[];if(!t?.overridePopoutGroup&&!t?.overridePopoutGridview&&W)if(e instanceof Mt){let Te=e.group;this.movingLock(()=>{let Le=X.model.removePanel(e);B.model.openPanel(Le)}),me=[{panel:e,from:Te}]}else switch(this.movingLock(()=>nn({from:X,to:B})),me=B.panels.map(Te=>({panel:Te,from:X})),Z){case"grid":X.api.setVisible(!1);break;case"floating":case"popout":var Ue;_e=(Ue=this.floatingGroups.find(Te=>Te.group.api.id===e.api.id))===null||Ue===void 0?void 0:Ue.overlay.toJSON(),this.removeGroup(X);break}I.classList.add("dv-dockview"),I.style.overflow="hidden",I.appendChild(ee),I.appendChild(ve.element);let Lt=document.createElement("div"),Ot=new Go(Lt,{disabled:this.rootDropTargetContainer.disabled});I.appendChild(Lt),B.model.dropTargetContainer=Ot;let ea=new Fs(I,C.window);if(T.addDisposables(ea),B.model.location={type:"popout",getWindow:()=>C.window,popoutUrl:D},t?.overridePopoutGridview){let Te=this.groups.filter(Le=>ve.element.contains(Le.element));for(let Le of Te)Le.model.renderContainer=we,Le.model.dropTargetContainer=Ot,Le.model.location={type:"popout",getWindow:()=>C.window,popoutUrl:D}}W&&e.api.location.type==="grid"&&e.api.setVisible(!1),this.doSetGroupAndPanelActive(B);let ta=p.observeGridviewSize(C,ve,we);ta&&T.addDisposables(ta);let ia=new S;T.addDisposables(ia);let na=Te=>{ia.value=new x(Te.api.onDidActiveChange(Le=>{if(Le.isActive){var Ao;(Ao=C.window)===null||Ao===void 0||Ao.focus()}}),Te.api.onWillFocus(()=>{var Le;(Le=C.window)===null||Le===void 0||Le.focus()}))};na(B);let oa={},ru=W&&X&&this.getPanel(X.id),Rt={window:C,popoutGroup:B,gridview:ve,overlayRenderContainer:we,dropTargetContainer:Ot,getWindow:()=>C.window,popoutUrl:D,referenceGroup:ru?X.id:void 0,popupService:ea,setAnchorGroup:Te=>{Rt.popoutGroup=Te,na(Te)},disposable:{dispose:()=>(T.dispose(),oa.returnedGroup)}},ra=jt(C.window);T.addDisposables(ra,Zn(C.window,()=>{this._onDidPopoutGroupSizeChange.fire({width:C.window.innerWidth,height:C.window.innerHeight,group:Rt.popoutGroup})}),ra.event(()=>{this._onDidPopoutGroupPositionChange.fire({screenX:C.window.screenX,screenY:C.window.screenY,group:Rt.popoutGroup})}),O(C.window,"resize",()=>{ve.layout(C.window.innerWidth,C.window.innerHeight)}),we,w.from(()=>this.disposePopoutWindow({group:B,referenceGroup:X,popoutGridview:ve,isGroupAddedToDom:W,floatingBox:_e,disposePopoutGridview:Ae,closeResult:oa}))),p.add(Rt),this._onDidAddPopoutGroup.fire({id:Rt.popoutGroup.id,group:Rt.popoutGroup,window:Rt.getWindow()});for(let{panel:Te,from:Le}of me)this.fireDidMovePanel(Te,Le);return!0}).catch(I=>(this._openingPopoutWindows.delete(T),console.error("dockview: failed to create popout.",I),!1))}handleBlockedPopout(e){let{group:t,referenceGroup:i,options:n,popoutWindowDisposable:s,failure:l}=e;if(Us(l),s.dispose(),this._onDidOpenPopoutWindowFail.fire(l),n?.overridePopoutGridview){let u=n.overridePopoutGridview,p=this.groups.filter(g=>u.element.contains(g.element));for(let g of p)this.movingLock(()=>{u.remove(g),this.redockGroupToMainGrid(g)});u.dispose(),i&&!i.api.isVisible&&i.api.setVisible(!0);return}t===i?this.gridview.element.contains(t.element)||(this.movingLock(()=>this.doAddGroup(t,[0])),t.model.location={type:"grid"}):(this.movingLock(()=>nn({from:t,to:i})),t.model.size===0&&this._groups.has(t.id)&&(t.dispose(),this._groups.delete(t.id),this._onDidRemoveGroup.fire(t))),i.api.isVisible||i.api.setVisible(!0)}redockGroupToMainGrid(e){e.model.renderContainer=this.overlayRenderContainer,e.model.dropTargetContainer=this.rootDropTargetContainer,e.model.location={type:"grid"},this.doAddGroup(e,[0])}disposePopoutWindow(e){var t;let{group:i,referenceGroup:n,popoutGridview:s,isGroupAddedToDom:l,floatingBox:u,disposePopoutGridview:p,closeResult:g}=e;if(this.isDisposed){p();return}let f=!!(!((t=this._popoutWindowService)===null||t===void 0)&&t.entries.find(k=>k.gridview===s)),b=this.groups.filter(k=>s.element.contains(k.element)),_=b.includes(i),y=_&&b.length===1,D=[];if(f){for(let k of b)if(k!==i){this.movingLock(()=>{this.doRemoveGroup(k,{skipDispose:!0,skipActive:!0,skipPopoutReturn:!0}),this.redockGroupToMainGrid(k)});for(let C of k.panels)D.push({panel:C,from:k})}}if(_&&l&&this.getPanel(n.id)){let k=[...i.panels];this.movingLock(()=>nn({from:i,to:n}));for(let C of k)D.push({panel:C,from:i});n.api.isVisible||n.api.setVisible(!0),this.getPanel(i.id)&&this.doRemoveGroup(i,{skipPopoutAssociated:!0})}else if(_&&this.getPanel(i.id)){if(i.model.renderContainer=this.overlayRenderContainer,i.model.dropTargetContainer=this.rootDropTargetContainer,g.returnedGroup=i,!f){p();return}if(u&&y)this.addFloatingGroup(i,{height:u.height,width:u.width,position:u});else{this.doRemoveGroup(i,{skipDispose:!0,skipActive:!0,skipPopoutReturn:!0}),i.model.location={type:"grid"},this.movingLock(()=>{this.doAddGroup(i,[0])});for(let k of i.panels)D.push({panel:k,from:i})}this.doSetGroupAndPanelActive(i)}p();for(let{panel:k,from:C}of D)this.fireDidMovePanel(k,C)}addFloatingGroup(e,t){this.mutation("float",()=>this._doAddFloatingGroup(e,t))}_doAddFloatingGroup(e,t){if(!Fe(this._floatingGroupService,"FloatingGroup","api.addFloatingGroup")||e instanceof fi&&e.model.location.type==="edge")return;let i,n=[];if(e instanceof Mt){let g=e.group;i=this.createGroup(),this._onDidAddGroup.fire(i),this.movingLock(()=>this.removePanel(e,{removeEmptyGroup:!1,skipDispose:!0,skipSetActiveGroup:!0})),this.removeGroupIfEmpty(g),this.movingLock(()=>i.model.openPanel(e,{skipSetGroupActive:!0})),n=[{panel:e,from:g}]}else{var s;i=e;let g=(s=this._popoutWindowService)===null||s===void 0?void 0:s.findReferenceGroupId(i),f=g?this.getPanel(g):void 0;typeof t?.skipRemoveGroup=="boolean"&&t.skipRemoveGroup||(f?(this.movingLock(()=>nn({from:e,to:f})),this.doRemoveGroup(e,{skipPopoutReturn:!0,skipPopoutAssociated:!0}),this.doRemoveGroup(f,{skipDispose:!0}),i=f,n=i.panels.map(b=>({panel:b,from:e}))):(this.doRemoveGroup(e,{skipDispose:!0,skipPopoutReturn:!0,skipPopoutAssociated:!1}),n=i.panels.map(b=>({panel:b,from:i}))))}function l(){if(t?.position){let g={};return"left"in t.position?g.left=Math.max(t.position.left,0):"right"in t.position?g.right=Math.max(t.position.right,0):g.left=kt.left,"top"in t.position?g.top=Math.max(t.position.top,0):"bottom"in t.position?g.bottom=Math.max(t.position.bottom,0):g.top=kt.top,typeof t.width=="number"?g.width=Math.max(t.width,0):g.width=kt.width,typeof t.height=="number"?g.height=Math.max(t.height,0):g.height=kt.height,g}return{left:typeof t?.x=="number"?Math.max(t.x,0):kt.left,top:typeof t?.y=="number"?Math.max(t.y,0):kt.top,width:typeof t?.width=="number"?Math.max(t.width,0):kt.width,height:typeof t?.height=="number"?Math.max(t.height,0):kt.height}}let u=l(),p=this.createNestedGridview();p.addView(i,Ce.Distribute,[0]),this.mountFloatingWindow(p,i,[i],u,{dragHandle:t?.dragHandle,inDragMode:t?.inDragMode,skipActiveGroup:t?.skipActiveGroup,disableSmartGuides:t?.disableSmartGuides});for(let{panel:g,from:f}of n)this.fireDidMovePanel(g,f)}get closeEmptyGroups(){return this.options.closeEmptyGroups!==!1}keepEmptyGroups(e){var t;return(t=e.keepEmptyGroups)!==null&&t!==void 0?t:!this.closeEmptyGroups}removeGroupIfEmpty(e){e.model.size===0&&this.closeEmptyGroups&&this.doRemoveGroup(e,{skipActive:!0})}get locked(){return this.gridview.locked}set locked(e){this.gridview.locked=e,this._shellManager&&(this._shellManager.locked=e);for(let t of this.nestedGridviews())t.locked=e}nestedGridviews(){var e,t;return[...this.floatingGroups.map(i=>i.gridview),...((e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.entries)!==null&&e!==void 0?e:[]).map(i=>i.gridview)]}createNestedGridview(e="HORIZONTAL"){var t,i;return new lo(this.gridview.proportionalLayout,this.options.hideBorders?{separatorBorder:"transparent"}:void 0,e,this.gridview.locked,(t=(i=this.options.theme)===null||i===void 0?void 0:i.gap)!==null&&t!==void 0?t:0)}mountFloatingWindow(e,t,i,n,s){var l,u,p,g,f,b,_,y,D;let k=Fe(this._floatingGroupService,"FloatingGroup","api.addFloatingGroup");if(!k)return;let C=((l=(u=s?.dragHandle)!==null&&u!==void 0?u:this.options.floatingGroupDragHandle)!==null&&l!==void 0?l:"titlebar")==="titlebar"?new uh(this,t):void 0,T=new Co(j(j({container:(p=this._floatingOverlayHost)!==null&&p!==void 0?p:this.gridview.element,content:e.element,header:C?.element},n),{},{minimumInViewportWidth:this.options.floatingGroupBounds==="boundedWithinViewport"?void 0:(g=(f=this.options.floatingGroupBounds)===null||f===void 0?void 0:f.minimumWidthWithinViewport)!==null&&g!==void 0?g:100,minimumInViewportHeight:this.options.floatingGroupBounds==="boundedWithinViewport"?void 0:(b=(_=this.options.floatingGroupBounds)===null||_===void 0?void 0:_.minimumHeightWithinViewport)!==null&&b!==void 0?b:100,transformDragPosition:this._buildFloatingDragTransform(t,(y=s?.disableSmartGuides)!==null&&y!==void 0?y:!1),getSiblingBoxes:()=>this._gatherFloatingGroupBoxes(t)})),M=(D=C?.element)!==null&&D!==void 0?D:t.element.querySelector(".dv-void-container");if(!M)throw new Error("dockview: failed to find drag handle");T.setupDrag(M,{inDragMode:typeof s?.inDragMode=="boolean"?s.inDragMode:!1});let I=k.add(t,T,e);I.addDisposables(T.onDidStartMoving(()=>this._onDidStartFloatingGroupDrag.fire(t)),T.onDidChangeEnd(()=>this._onDidEndFloatingGroupDrag.fire(t))),C&&(I.setTitleBar(C),I.addDisposables(C,w.from(()=>I.setTitleBar(void 0)),C.onDragStart(E=>{this._onWillDragGroup.fire({nativeEvent:E,group:I.group})})));for(let E of i)E.model.location={type:"floating"};s?.skipActiveGroup||this.doSetGroupAndPanelActive(t)}orthogonalize(e,t){switch(this.gridview.normalize(),e){case"top":case"bottom":this.gridview.orientation==="HORIZONTAL"&&this.gridview.insertOrthogonalSplitviewAtRoot();break;case"left":case"right":this.gridview.orientation==="VERTICAL"&&this.gridview.insertOrthogonalSplitviewAtRoot();break;default:break}switch(e){case"top":case"left":case"center":return this.createGroupAtLocation([0],void 0,t);case"bottom":case"right":return this.createGroupAtLocation([this.gridview.length],void 0,t);default:throw new Error(`dockview: unsupported position ${e}`)}}updateOptions(e){var t,i;super.updateOptions(e),this.reportMissingOptionModules(e),(t=this._floatingGroupService)===null||t===void 0||t.updateBounds(e),(i=this._rootDropTargetService)===null||i===void 0||i.setOptions(e);let n=this.options.disableDnd,s=this.options.dndStrategy;this._options=j(j({},this.options),e);let l=this.options.disableDnd,u=this.options.dndStrategy;if((n!==l||s!==u)&&this.updateDragAndDropState(),"proportionalLayout"in e){let b=this.gridview.proportionalLayout;for(let _ of this.nestedGridviews())_.proportionalLayout=b}if("theme"in e&&this.updateTheme(),"createRightHeaderActionComponent"in e||"createLeftHeaderActionComponent"in e||"createPrefixHeaderActionComponent"in e){var p;(p=this.headerActionsService)===null||p===void 0||p.refreshAll()}if("createWatermarkComponent"in e){var g;(g=this._watermarkService)===null||g===void 0||g.refresh();for(let b of this.groups)b.model.refreshWatermark()}if("tabGroupColors"in e||"tabGroupAccent"in e){var f;this._tabGroupColorPalette.setEntries((f=this._options.tabGroupColors)!==null&&f!==void 0?f:qi),this._tabGroupColorPalette.enabled=this._options.tabGroupAccent!=="off";for(let b of this.groups)b.model.refreshTabGroupAccent()}this._onDidOptionsChange.fire(),this._layoutFromShell(this.gridview.width,this.gridview.height)}reportMissingOptionModules(e){bh(e,t=>this._moduleRegistry.has(t))}layout(e,t,i){var n;this._shellManager&&!this._inShellLayout?this._shellManager.layout(e,t):super.layout(e,t,i),this._syncFloatingOverlayHost(),(n=this._moduleRegistry)===null||n===void 0||(n=n.services.floatingGroupService)===null||n===void 0||n.constrainBounds()}_syncFloatingOverlayHost(){if(!this._floatingOverlayHost||!this._shellManager)return;let e=this._shellManager.element.getBoundingClientRect(),t=this.element.getBoundingClientRect(),i=this._floatingOverlayHost;i.style.left=`${t.left-e.left}px`,i.style.top=`${t.top-e.top}px`,i.style.width=`${t.width}px`,i.style.height=`${t.height}px`}_layoutFromShell(e,t){this._inShellLayout=!0,this.layout(e,t,!0),this._inShellLayout=!1}forceRelayout(){this._shellManager?this._layoutFromShell(this.width,this.height):super.forceRelayout()}addEdgeGroup(e,t){let i=this._edgeGroupService;if(!i)throw new Error(ks("EdgeGroup","api.addEdgeGroup"));if(i.has(e))throw new Error(`dockview: edge group already exists at position '${e}'`);return this.mutation("add",()=>{let n=this.createGroup({id:t.id});n.model.location={type:"edge",position:e},n.model.headerPosition=e;let s=n.onDidChange(u=>{var p;if(!u)return;let g=tn(e)?u.width:u.height;typeof g=="number"&&((p=this._shellManager)===null||p===void 0||p.resizeEdgeGroup(e,g))}),l=n.model.onDidRemovePanel(()=>{n.model.isEmpty&&(i.isAutoReveal(n)?queueMicrotask(()=>{var u;n.model.isEmpty&&(!((u=this._edgeGroupService)===null||u===void 0)&&u.includes(n))&&this.removeEdgeGroup(e)}):this.setEdgeGroupCollapsed(n,!0))});return i.add(e,n,new x(l,s)),t.autoHide!==void 0&&i.setAutoHide(n,t.autoHide),t.autoReveal!==void 0&&i.setAutoReveal(n,t.autoReveal),this._onDidAddGroup.fire(n),this._shellManager.addEdgeView(e,t,n),n.api})}revealEdgeGroupWithData(e,t,i){let n=this._edgeGroupService;n&&this.mutation("add",()=>{var s;let l=n.get(e);l||(this.addEdgeGroup(e,{id:this.getNextGroupId(),autoReveal:!0,autoHide:i?.autoHide,collapsed:!0}),l=n.get(e)),l&&this.moveGroupOrPanel({from:{groupId:t.groupId,panelId:(s=t.panelId)!==null&&s!==void 0?s:void 0},to:{group:l,position:"center"}})})}getEdgeGroup(e){var t;return(t=this._edgeGroupService)===null||t===void 0||(t=t.get(e))===null||t===void 0?void 0:t.api}getEdgeGroupPanel(e){var t;return(t=this._edgeGroupService)===null||t===void 0?void 0:t.get(e)}pinEdgeGroup(e){var t;(t=Fe(this._moduleRegistry.services.autoHideEdgeGroupService,"AutoHideEdgeGroup","api.pinEdgeGroup"))===null||t===void 0||t.pin(e)}autoHideEdgeGroup(e){var t;(t=Fe(this._moduleRegistry.services.autoHideEdgeGroupService,"AutoHideEdgeGroup","api.autoHideEdgeGroup"))===null||t===void 0||t.autoHide(e)}peekEdgeGroup(e,t){var i;(i=Fe(this._moduleRegistry.services.autoHideEdgeGroupService,"AutoHideEdgeGroup","api.peekEdgeGroup"))===null||i===void 0||i.peek(e,t)}get overlayRoot(){return this.rootElement}getDropZoneRect(){return this.element.getBoundingClientRect()}getEdgeGroupExpandedSize(e){var t,i;return(t=(i=this._shellManager)===null||i===void 0?void 0:i.getEdgeGroupExpandedSize(e))!==null&&t!==void 0?t:0}repositionPanelOverlay(e,t,i){this.overlayRenderContainer.repositionPanelOverlay(e.api.id,t,i)}setEdgeGroupVisible(e,t){this._shellManager.setEdgeGroupVisible(e,t)}isEdgeGroupVisible(e){return this._shellManager.isEdgeGroupVisible(e)}removeEdgeGroup(e){let t=Fe(this._edgeGroupService,"EdgeGroup","api.removeEdgeGroup");if(!t)return;let i=t.get(e);if(!i)throw new Error(`dockview: no edge group exists at position '${e}'`);this.mutation("remove",()=>{for(let n of[...i.panels])this.removePanel(n,{removeEmptyGroup:!1,skipDispose:!1});this._shellManager.removeEdgeView(e),t.remove(e),i.dispose(),this._groups.delete(i.id),this._onDidRemoveGroup.fire(i),this.activateFallbackGroupIfRemoved(i)})}setEdgeGroupCollapsed(e,t){var i;let n=(i=this._edgeGroupService)===null||i===void 0?void 0:i.findPositionOf(e);n&&this._shellManager.isEdgeGroupCollapsed(n)!==t&&(this._shellManager.setEdgeGroupCollapsed(n,t),e.api._onDidCollapsedChange.fire({isCollapsed:t}))}isEdgeGroupCollapsed(e){var t;let i=(t=this._edgeGroupService)===null||t===void 0?void 0:t.findPositionOf(e);return i?this._shellManager.isEdgeGroupCollapsed(i):!1}isEdgeGroupPeeking(e){return this._peekingGroups.has(e)}setEdgeGroupPeeking(e,t){this._peekingGroups.has(e)!==t&&(t?this._peekingGroups.add(e):this._peekingGroups.delete(e),e.api._onDidPeekChange.fire({isPeeking:t}))}isEdgeGroupAutoHide(e){var t,i;let n=(t=this._edgeGroupService)===null||t===void 0?void 0:t.isAutoHide(e);if(n!==void 0)return n;let s=(i=this._edgeGroupService)===null||i===void 0?void 0:i.findPositionOf(e);return s===void 0?!1:ds(this.options.autoHideEdgeGroups,s)}setEdgeGroupAutoHide(e,t){let i=this._edgeGroupService;i?.includes(e)&&(i.setAutoHide(e,t),this._onDidEdgeGroupAutoHideChange.fire(e))}updateDragAndDropState(){for(let e of this.groups)e.model.updateDragAndDropState()}focus(){var e;(e=this.activeGroup)===null||e===void 0||e.focus()}getGroupPanel(e){return this.panels.find(t=>t.id===e)}setActivePanel(e){e.group.model.openPanel(e),this.doSetGroupAndPanelActive(e.group)}activateNext(e={}){var t;if(!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}if(e.includePanel&&e.group&&e.group.activePanel!==e.group.panels[e.group.panels.length-1]){e.group.model.moveToNext({suppressRoll:!0});return}let i=xe(e.group.element),n=(t=this.gridview.next(i))===null||t===void 0?void 0:t.view;this.doSetGroupAndPanelActive(n)}activatePrevious(e={}){var t;if(!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}if(e.includePanel&&e.group&&e.group.activePanel!==e.group.panels[0]){e.group.model.moveToPrevious({suppressRoll:!0});return}let i=xe(e.group.element),n=(t=this.gridview.previous(i))===null||t===void 0?void 0:t.view;n&&this.doSetGroupAndPanelActive(n)}toJSON(){var e,t,i,n,s;let l=this.gridview.serialize(),u=this.panels.reduce((_,y)=>(_[y.id]=y.toJSON(),_),{}),p=(e=(t=this._floatingGroupService)===null||t===void 0?void 0:t.serialize())!==null&&e!==void 0?e:[],g=(i=(n=this._popoutWindowService)===null||n===void 0?void 0:n.serialize())!==null&&i!==void 0?i:[],f={grid:l,panels:u,activeGroup:(s=this.activeGroup)===null||s===void 0?void 0:s.id};p.length>0&&(f.floatingGroups=p),g.length>0&&(f.popoutGroups=g);let b=this._serializeEdgeGroups();return b&&(f.edgeGroups=b),f}_serializeEdgeGroups(){var e;if(!(!((e=this._edgeGroupService)===null||e===void 0)&&e.hasAny()))return;let t=this._shellManager.toJSON();for(let[i,n]of this._edgeGroupService.entries()){let s=t[i];if(!s)continue;if(this._edgeGroupService.isAutoReveal(n)&&n.model.isEmpty){delete t[i];continue}s.group=n.toJSON(),this._edgeGroupService.isAutoReveal(n)&&(s.autoReveal=!0);let l=this._edgeGroupService.isAutoHide(n);l!==void 0&&(s.autoHide=l)}return t}fromJSON(e,t){this.mutation("load",()=>this._doFromJSON(e,t))}_doFromJSON(e,t){var i,n;if((i=this._popoutWindowService)===null||i===void 0||i.cancelPendingRestorations(),typeof e!="object"||e===null)throw new Error("dockview: serialized layout must be a non-null object");if(!e.grid||((n=e.grid.root)===null||n===void 0?void 0:n.type)!=="branch"||!Array.isArray(e.grid.root.data))throw new Error("dockview: root must be of type branch");let s=new Map,l=new Map,u=[],p=[],g=()=>{for(let E of p)try{E.dispose()}catch($){console.error("dockview: failed to dispose a temporary group created for reuseExistingPanels",$)}p.length=0};if(t?.reuseExistingPanels){let E=Object.keys(e.panels),$,X=()=>{let Z=this.createGroup(),W=this._groups.get(Z.api.id);return this._groups.delete(Z.api.id),p.push(w.from(()=>{var B;this.movingLock(()=>{for(let re of Z.panels.slice())Z.model.removePanel(re)}),W?.disposable.dispose(),(B=this.headerActionsService)===null||B===void 0||B.disposeGroup(Z),Z.dispose()})),Z};try{for(let Z of this.panels)if(E.includes(Z.api.id)){s.set(Z.api.id,Z);let W;if(Z.api.renderer==="always"&&Z.api.isVisible)W=X();else{var f;(f=$)!==null&&f!==void 0||($=X()),W=$}l.set(Z.api.id,W),u.push({panel:Z,temporaryGroup:W})}this.movingLock(()=>{u.forEach(({panel:Z,temporaryGroup:W})=>{this.moveGroupOrPanel({from:{groupId:Z.api.group.api.id,panelId:Z.api.id},to:{group:W,position:"center"},keepEmptyGroups:!0})})}),this.clear()}catch(Z){throw g(),Z}}else this.clear();let{grid:b,panels:_,activeGroup:y}=e;try{var D,k,C,T,M;let E=this.width,$=this.height,X=W=>{let{id:B,locked:re,hideHeader:K,headerPosition:ee,views:we,activeView:ve}=W;if(typeof B!="string")throw new TypeError("dockview: group id must be of type string");let fe=this.createGroup({id:B,locked:!!re,hideHeader:!!K,headerPosition:ee});this._onDidAddGroup.fire(fe);let Ae=[],_e=we.filter(me=>_[me]);for(let me of _e){let Ue=s.get(me),Lt=l.get(me);if(Lt&&Ue)this.movingLock(()=>{Lt.model.removePanel(Ue)}),Ae.push(Ue),Ue.updateFromStateModel(_[me]);else{let Ot=this._deserializer.fromJSON(_[me],fe);Ae.push(Ot)}}for(let me of Ae){let Ue=typeof ve=="string"&&ve===me.id;s.has(me.api.id)?this.movingLock(()=>{fe.model.openPanel(me,{skipSetActive:!Ue,skipSetGroupActive:!0})}):fe.model.openPanel(me,{skipSetActive:!Ue,skipSetGroupActive:!0})}return W.tabGroups&&W.tabGroups.length>0&&fe.model.restoreTabGroups(W.tabGroups),!fe.activePanel&&fe.panels.length>0&&fe.model.openPanel(fe.panels[fe.panels.length-1],{skipSetGroupActive:!0}),fe};this.gridview.deserialize(b,{fromJSON:W=>X(W.data)}),this._layoutFromShell(E,$),e.edgeGroups&&this.deserializeEdgeGroups(e.edgeGroups,_,s,l),this.deserializeFloatingWindows((D=e.floatingGroups)!==null&&D!==void 0?D:[],X);let Z=this.deserializePopoutWindows((k=e.popoutGroups)!==null&&k!==void 0?k:[],X);if((C=this._popoutWindowService)===null||C===void 0||C.finishRestoration(Z),(T=this._floatingGroupService)===null||T===void 0||T.constrainBounds(),typeof y=="string"){let W=this.getPanel(y);W&&this.doSetGroupAndPanelActive(W)}(M=this._watermarkService)===null||M===void 0||M.update()}catch(E){var I;console.error("dockview: failed to deserialize layout. Reverting changes",E);for(let $ of this.groups)for(let X of $.panels)this.removePanel(X,{removeEmptyGroup:!1,skipDispose:!1});for(let $ of this.groups)$.dispose(),this._groups.delete($.id),this._onDidRemoveGroup.fire($);throw(I=this._floatingGroupService)===null||I===void 0||I.disposeAll(),this.clear(),E}finally{g()}this.debouncedUpdateAllPositions(),this._onDidLayoutFromJSON.fire()}deserializeNestedGridview(e,t){let i=this.createNestedGridview(e.orientation),n=[];return i.deserialize(e,{fromJSON:s=>{let l=t(s.data);return n.push(l),l}}),{gridview:i,members:n}}deserializeEdgeGroups(e,t,i,n){let s=Fe(this._edgeGroupService,"EdgeGroup","fromJSON edge restoration");if(s){for(let u of["top","bottom","left","right"]){let p=e[u];if(p&&!s.has(u)){var l;let g=p.group,f=(l=g?.id)!==null&&l!==void 0?l:`${u}-group`;this.addEdgeGroup(u,{id:f,autoReveal:p.autoReveal,autoHide:p.autoHide,minimumSize:p.minimumSize,maximumSize:p.maximumSize,collapsedSize:p.collapsedSize})}}for(let[u,p]of s.entries()){let g=e[u],f=g?.group;if(f){let{views:b,activeView:_}=f,y=[];for(let D of b){if(!t[D])continue;let k=i.get(D),C=n.get(D);if(C&&k)this.movingLock(()=>{C.model.removePanel(k)}),y.push(k),k.updateFromStateModel(t[D]);else{let T=this._deserializer.fromJSON(t[D],p);y.push(T)}}for(let D of y){let k=_===D.id;i.has(D.api.id)?this.movingLock(()=>{p.model.openPanel(D,{skipSetActive:!k,skipSetGroupActive:!0})}):p.model.openPanel(D,{skipSetActive:!k,skipSetGroupActive:!0})}f.tabGroups&&f.tabGroups.length>0&&p.model.restoreTabGroups(f.tabGroups),!p.activePanel&&p.panels.length>0&&p.model.openPanel(p.panels[p.panels.length-1],{skipSetGroupActive:!0})}}this._shellManager.fromJSON(e)}}deserializeFloatingWindows(e,t){for(let i of e){let{data:n,grid:s,position:l}=i;if(s){let{gridview:u,members:p}=this.deserializeNestedGridview(s,t);if(p.length===0)continue;this.mountFloatingWindow(u,p[0],p,l,{inDragMode:!1})}else if(n){let u=t(n);this.addFloatingGroup(u,{position:l,width:l.width,height:l.height,skipRemoveGroup:!0,inDragMode:!1})}}}deserializePopoutWindows(e,t){let i=e.length>0?Fe(this._popoutWindowService,"PopoutWindow","fromJSON popout restoration"):this._popoutWindowService;return i?e.flatMap((n,s)=>{let{data:l,grid:u,position:p,gridReferenceGroup:g,url:f}=n,b,_=[];if(u){let D=this.deserializeNestedGridview(u,t);if(b=D.gridview,_=D.members,_.length===0)return b.dispose(),[]}let y=u?_[0]:t(l);return i.scheduleRestoration(s*100,()=>this.addPopoutGroup(y,{position:p??void 0,overridePopoutGroup:g?y:void 0,overridePopoutGridview:b,referenceGroup:g?this.getPanel(g):void 0,popoutUrl:f}),()=>{for(let D of _.length>0?_:[y])if(!this.isDisposed&&this._groups.has(D.id)&&D.element.parentElement===null){for(let k of[...D.panels])this.removePanel(k,{removeEmptyGroup:!1});D.dispose(),this._groups.delete(D.id),this._onDidRemoveGroup.fire(D)}})}):[]}clear(){this.mutation("clear",()=>this._doClear())}_doClear(){let e=Array.from(this._groups.values()).map(n=>n.value),t=!!this.activeGroup;for(let n of e){var i;if(!((i=this._edgeGroupService)===null||i===void 0)&&i.includes(n)){let s=[...n.panels];for(let l of s)this.removePanel(l,{removeEmptyGroup:!1});continue}this.removeGroup(n,{skipActive:!0})}t&&this.doSetGroupAndPanelActive(void 0),this.gridview.clear()}closeAllGroups(){this.mutation("remove",()=>{let e=Array.from(this._groups.values()).map(t=>t.value);for(let t of e){if(!this._groups.has(t.id))continue;t.model.closeAllPanels();let i=this.options.noPanelsOverlay==="emptyGroup"&&this._groups.size===1;!this.closeEmptyGroups&&!i&&this._groups.has(t.id)&&t.model.size===0&&this.removeGroup(t,{skipActive:!0})}})}addPanel(e){return this.mutation("add",()=>this._doAddPanel(e))}_doAddPanel(e){if(this.panels.some(b=>b.id===e.id))throw new Error(`dockview: panel with id ${e.id} already exists`);let t;if(e.position&&e.floating)throw new Error("dockview: you can only provide one of: position, floating as arguments to .addPanel(...)");let i={width:e.initialWidth,height:e.initialHeight},n,s=b=>!!e.inactive&&b.model.size>0;if(e.position)if(ls(e.position)){let b=typeof e.position.referencePanel=="string"?this.getGroupPanel(e.position.referencePanel):e.position.referencePanel;if(n=e.position.index,!b){var l;let _=typeof e.position.referencePanel=="string"?e.position.referencePanel:(l=e.position.referencePanel)===null||l===void 0?void 0:l.id;throw new Error(`dockview: referencePanel '${_}' does not exist`)}t=this.findGroup(b)}else if(cs(e.position)){var u;if(t=typeof e.position.referenceGroup=="string"?(u=this._groups.get(e.position.referenceGroup))===null||u===void 0?void 0:u.value:e.position.referenceGroup,n=e.position.index,!t){var p;let b=typeof e.position.referenceGroup=="string"?e.position.referenceGroup:(p=e.position.referenceGroup)===null||p===void 0?void 0:p.id;throw new Error(`dockview: referenceGroup '${b}' does not exist`)}}else{let b=this.orthogonalize(vo(e.position.direction)),_=this.createPanel(e,b);return b.model.openPanel(_,{skipSetActive:s(b),skipSetGroupActive:e.inactive,index:n}),e.inactive||this.doSetGroupAndPanelActive(b),b.api.setSize({height:i?.height,width:i?.width}),_}else t=this.activeGroup;let g;if(t){var f;let b=vi(((f=e.position)===null||f===void 0?void 0:f.direction)||"within");if(e.floating){let _=this.createGroup();this._onDidAddGroup.fire(_);let y=typeof e.floating=="object"&&e.floating!==null?e.floating:{};this.addFloatingGroup(_,j(j({},y),{},{inDragMode:!1,skipRemoveGroup:!0,skipActiveGroup:!0})),g=this.createPanel(e,_),_.model.openPanel(g,{skipSetActive:s(_),skipSetGroupActive:e.inactive,index:n})}else if(t.api.location.type==="floating"||t.api.location.type==="edge"||b==="center")g=this.createPanel(e,t),t.model.openPanel(g,{skipSetActive:s(t),skipSetGroupActive:e.inactive,index:n}),t.api.setSize({width:i?.width,height:i?.height}),e.inactive||this.doSetGroupAndPanelActive(t);else{let _=xe(t.element),y=Be(this.gridview.orientation,_,b),D=this.createGroupAtLocation(y,this.orientationAtLocation(y)==="VERTICAL"?i?.height:i?.width);g=this.createPanel(e,D),D.model.openPanel(g,{skipSetActive:s(D),skipSetGroupActive:e.inactive,index:n}),e.inactive||this.doSetGroupAndPanelActive(D)}}else if(e.floating){let b=this.createGroup();this._onDidAddGroup.fire(b);let _=typeof e.floating=="object"&&e.floating!==null?e.floating:{};this.addFloatingGroup(b,j(j({},_),{},{inDragMode:!1,skipRemoveGroup:!0,skipActiveGroup:!0})),g=this.createPanel(e,b),b.model.openPanel(g,{skipSetActive:s(b),skipSetGroupActive:e.inactive,index:n})}else{let b=this.createGroupAtLocation([0],this.gridview.orientation==="VERTICAL"?i?.height:i?.width);g=this.createPanel(e,b),b.model.openPanel(g,{skipSetActive:s(b),skipSetGroupActive:e.inactive,index:n}),e.inactive||this.doSetGroupAndPanelActive(b)}return g}removePanel(e,t){this.mutation("remove",()=>{var i;return this._doRemovePanel(e,{removeEmptyGroup:(i=t?.removeEmptyGroup)!==null&&i!==void 0?i:this.closeEmptyGroups,skipDispose:t?.skipDispose,skipSetActiveGroup:t?.skipSetActiveGroup})})}_doRemovePanel(e,t){let i=e.group;if(!i)throw new Error(`dockview: cannot remove panel ${e.id}. it's missing a group.`);i.model.removePanel(e,{skipSetActiveGroup:t.skipSetActiveGroup}),t.skipDispose||(e.group.model.renderContainer.detatch(e),e.dispose()),i.size===0&&t.removeEmptyGroup&&this.removeGroup(i,{skipActive:t.skipSetActiveGroup})}createWatermarkComponent(){return this.options.createWatermarkComponent?this.options.createWatermarkComponent():new ch}addGroup(e){return this.mutation("add",()=>this._doAddGroup(e))}_doAddGroup(e){if(e){let s;if(hs(e)){var t;let b=typeof e.referencePanel=="string"?this.panels.find(y=>y.id===e.referencePanel):e.referencePanel,_=typeof e.referencePanel=="string"?e.referencePanel:(t=e.referencePanel)===null||t===void 0?void 0:t.id;if(!b)throw new Error(`dockview: reference panel ${_} does not exist`);if(s=this.findGroup(b),!s)throw new Error(`dockview: reference group for reference panel ${_} does not exist`)}else if(us(e)){var i;if(s=typeof e.referenceGroup=="string"?(i=this._groups.get(e.referenceGroup))===null||i===void 0?void 0:i.value:e.referenceGroup,!s){var n;let b=typeof e.referenceGroup=="string"?e.referenceGroup:(n=e.referenceGroup)===null||n===void 0?void 0:n.id;throw new Error(`dockview: reference group ${b} does not exist`)}}else{let b=this.orthogonalize(vo(e.direction),e);return e.skipSetActive||this.doSetGroupAndPanelActive(b),b}let l=vi(e.direction||"within"),u=xe(s.element),p=Be(this.gridview.orientation,u,l),g=this.createGroup(e),f=this.getLocationOrientation(p)==="VERTICAL"?e.initialHeight:e.initialWidth;return this.doAddGroup(g,p,f),e.skipSetActive||this.doSetGroupAndPanelActive(g),g}else{let s=this.createGroup(e);return this.doAddGroup(s),this.doSetGroupAndPanelActive(s),s}}getLocationOrientation(e){return e.length%2==0&&this.gridview.orientation==="HORIZONTAL"?"HORIZONTAL":"VERTICAL"}removeGroup(e,t){this.mutation("remove",()=>this.doRemoveGroup(e,t))}detachFromNestedWindow(e){var t,i;let n=(t=this._floatingGroupService)===null||t===void 0?void 0:t.findByGroup(e);if(n){let l=this.nestedWindowMembers(e);return l.length<=1?!1:(n.gridview.remove(e),n.group===e&&n.setAnchorGroup(l.find(u=>u!==e)),!0)}let s=(i=this._popoutWindowService)===null||i===void 0?void 0:i.findByGroup(e);if(s){let l=this.nestedWindowMembers(e);return l.length<=1?!1:(s.gridview.remove(e),s.popoutGroup===e&&s.setAnchorGroup(l.find(u=>u!==e)),!0)}return!1}disposeGroupRecord(e){e.dispose(),this._groups.delete(e.id),this._onDidRemoveGroup.fire(e)}activateFallbackGroupIfRemoved(e,t){if(!t&&this._activeGroup===e){let i=Array.from(this._groups.values());this.doSetGroupAndPanelActive(i.length>0?i[0].value:void 0)}}doRemoveGroup(e,t){var i;if(!((i=this._edgeGroupService)===null||i===void 0)&&i.includes(e))return e;let n=[...e.panels];if(!t?.skipDispose)for(let b of n){var s;this.removePanel(b,{removeEmptyGroup:!1,skipDispose:(s=t?.skipDispose)!==null&&s!==void 0?s:!1})}let l=this.activePanel;if(e.api.location.type==="floating"){var u;let b=(u=this._floatingGroupService)===null||u===void 0?void 0:u.findByGroup(e);if(!b)throw new Error("dockview: failed to find floating group");return this.detachFromNestedWindow(e)?(t?.skipDispose?e.model.location={type:"grid"}:this.disposeGroupRecord(e),this.activateFallbackGroupIfRemoved(e,t?.skipActive),e):(t?.skipDispose||this.disposeGroupRecord(e),b.dispose(),this.activateFallbackGroupIfRemoved(e,t?.skipActive),e)}if(e.api.location.type==="popout"){var p,g;let b=(p=this._popoutWindowService)===null||p===void 0?void 0:p.findByGroup(e);if(!b)throw new Error("dockview: failed to find popout group");if(this.detachFromNestedWindow(e))return t?.skipDispose?e.model.location={type:"grid"}:this.disposeGroupRecord(e),this.activateFallbackGroupIfRemoved(e,t?.skipActive),e;if(!t?.skipDispose){if(!t?.skipPopoutAssociated){let y=b.referenceGroup?this.getPanel(b.referenceGroup):void 0;y?.panels.length===0&&(this.closeEmptyGroups||!y.api.isVisible)&&this.removeGroup(y)}b.popoutGroup.dispose(),this._groups.delete(e.id),this._onDidRemoveGroup.fire(e)}(g=this._popoutWindowService)===null||g===void 0||g.remove(b);let _=b.disposable.dispose();return!t?.skipPopoutReturn&&_&&(this.doAddGroup(_,[0]),this.doSetGroupAndPanelActive(_)),this.activateFallbackGroupIfRemoved(e,t?.skipActive),b.popoutGroup}if(!this.gridview.element.contains(e.element)){if(!t?.skipDispose){let b=this._groups.get(e.id);b?.disposable.dispose(),this.disposeGroupRecord(e)}return this.activateFallbackGroupIfRemoved(e,t?.skipActive),e}let f=super.doRemoveGroup(e,t);return t?.skipActive||this.activePanel!==l&&this.fireActivePanelChange(this.activePanel),f}debouncedUpdateAllPositions(){this._updatePositionsFrameId!==void 0&&cancelAnimationFrame(this._updatePositionsFrameId),this._updatePositionsFrameId=requestAnimationFrame(()=>{var e,t;this._updatePositionsFrameId=void 0,this.overlayRenderContainer.updateAllPositions();for(let i of(e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.entries)!==null&&e!==void 0?e:[])i.overlayRenderContainer.updateAllPositions()})}movingLock(e){let t=this._moving;try{return this._moving=!0,e()}finally{this._moving=t}}mutation(e,t){let i=this.openMutation(e);this._syncMutationDepth++;try{return t()}finally{this._syncMutationDepth--,this._syncMutationDepth===0&&this.releaseDisposedActiveGroup(),i()}}mutationAsync(e,t){var i=this;return Ir(function*(){let n=i.openMutation(e);try{return yield t()}finally{n()}})()}openMutation(e){let t=this._origin;return this._mutationDepth===0&&this._onWillMutateLayout.fire({kind:e,origin:t}),this._mutationDepth++,()=>{this._mutationDepth--,this._mutationDepth===0&&(this.releaseDisposedActiveGroup(),this.flushLocationChanges(),this._onDidMutateLayout.fire({kind:e,origin:t}))}}releaseDisposedActiveGroup(){var e;!this.isDisposed&&(!((e=this._activeGroup)===null||e===void 0)&&e.model.isDisposed)&&this.activateFallbackGroupIfRemoved(this._activeGroup)}deferLocationChange(e,t){if(this._mutationDepth===0){t();return}this._pendingLocationChanges.set(e,t)}flushLocationChanges(){if(this._pendingLocationChanges.size===0)return;let e=Array.from(this._pendingLocationChanges.values());this._pendingLocationChanges.clear();for(let t of e)t()}currentOrigin(){return this._origin}withOrigin(e,t){if(this._originDepth>0||this._mutationDepth>0)return t();let i=this._origin;this._origin=e,this._originDepth++;try{return t()}finally{this._originDepth--,this._origin=i}}fireActivePanelChange(e){this._onDidActivePanelChange.fire({panel:e,origin:this._origin})}fireDidMovePanel(e,t){this._onDidMovePanel.fire({panel:e,from:t,to:e.group})}moveGroupOrPanel(e){this.mutation("move",()=>this._doMoveGroupOrPanel(e))}_doMoveGroupOrPanel(e){var t;let i=e.to.group,n=e.from.groupId,s=e.from.panelId,l=e.to.position,u=e.to.index,p=n?(t=this._groups.get(n))===null||t===void 0?void 0:t.value:void 0;if(!p)throw new Error(`dockview: Failed to find group id ${n}`);if(s===void 0){e.from.tabGroupId?this.moveTabGroupToGroup({sourceGroup:p,tabGroupId:e.from.tabGroupId,destinationGroup:i,destinationTarget:l,destinationIndex:u,skipSetActive:e.skipSetActive,keepEmptyGroups:e.keepEmptyGroups}):this.moveGroup({from:{group:p},to:{group:i,position:l},skipSetActive:e.skipSetActive});return}if(!l||l==="center"){let f=this.movingLock(()=>p.model.removePanel(s,{skipSetActive:!1,skipSetActiveGroup:!0}));if(!f)throw new Error(`dockview: No panel with id ${s}`);!this.keepEmptyGroups(e)&&p.model.size===0&&p!==i&&this.doRemoveGroup(p,{skipActive:!0});let b=i.model.size===0;this.movingLock(()=>{var _;return i.model.openPanel(f,{index:u,skipSetActive:((_=e.skipSetActive)!==null&&_!==void 0?_:!1)&&!b,skipSetGroupActive:!0})}),e.skipSetActive||this.doSetGroupAndPanelActive(i),this.fireDidMovePanel(f,p)}else{let f=this.getGridviewForGroup(i),b=xe(i.element),_=Be(f.orientation,b,l);if(p.size<2&&!this.keepEmptyGroups(e)){let[y,D]=ot(_);if(p.api.location.type==="grid"&&f===this.gridview){let[M,I]=ot(xe(p.element));if(eo(M,y)){this.gridview.moveView(M,I,D),this.fireDidMovePanel(this.getGroupPanel(s),p);return}}if(p.api.location.type==="popout"&&this.nestedWindowMembers(p).length<=1){var g;let M=(g=this._popoutWindowService)===null||g===void 0?void 0:g.findByGroup(p);if(!M)return;let I=this.movingLock(()=>M.popoutGroup.model.removePanel(M.popoutGroup.panels[0],{skipSetActive:!0,skipSetActiveGroup:!0}));this.doRemoveGroup(p,{skipActive:!0});let E=Be(f.orientation,xe(i.element),l),$=this.createGroupAtLocation(E,this.dropSizing(xe(i.element)),void 0,f);this.movingLock(()=>$.model.openPanel(I,{skipSetActive:!0})),this.doSetGroupAndPanelActive($),this.fireDidMovePanel(this.getGroupPanel(s),p);return}if(p.api.location.type==="edge"){let M=this.movingLock(()=>p.model.removePanel(s,{skipSetActive:!1,skipSetActiveGroup:!0}));if(!M)throw new Error(`dockview: No panel with id ${s}`);let I=this.createGroupAtLocation(_,this.dropSizing(b),void 0,f);this.movingLock(()=>I.model.openPanel(M,{skipSetGroupActive:!0})),this.doSetGroupAndPanelActive(I),this.fireDidMovePanel(M,p);return}let k=this.movingLock(()=>this.doRemoveGroup(p,{skipActive:!0,skipDispose:!0})),C=xe(i.element),T=Be(f.orientation,C,l);this.movingLock(()=>this.doAddGroup(k,T,this.dropSizing(C),f)),this.setGroupLocationForRoot(k,f),this.doSetGroupAndPanelActive(k),this.fireDidMovePanel(this.getGroupPanel(s),p)}else{let y=this.movingLock(()=>p.model.removePanel(s,{skipSetActive:!1,skipSetActiveGroup:!0}));if(!y)throw new Error(`dockview: No panel with id ${s}`);let D=Be(f.orientation,b,l),k=this.createGroupAtLocation(D,this.dropSizing(b),void 0,f);this.movingLock(()=>k.model.openPanel(y,{skipSetGroupActive:!0})),this.doSetGroupAndPanelActive(k),this.fireDidMovePanel(y,p)}}}moveTabGroupToGroup(e){let{sourceGroup:t,tabGroupId:i,destinationGroup:n,destinationTarget:s,destinationIndex:l}=e,u=t.model.getTabGroups().find(T=>T.id===i);if(!u||u.panelIds.length===0)return;let p=u.label,g=u.color,f=u.collapsed,b=u.componentParams,_=[...u.panelIds],y=s&&s!=="center"?xe(n.element):void 0,D=this.movingLock(()=>_.map(T=>t.model.removePanel(T,{skipSetActive:!1,skipSetActiveGroup:!0})).filter(T=>T!==void 0));if(D.length===0)return;let k=T=>{this.movingLock(()=>{for(let I of D)T.model.openPanel(I,{index:l,skipSetActive:!0,skipSetGroupActive:!0})});let M=T.model.createTabGroup({label:p,color:g,collapsed:f,componentParams:b});for(let I of D)T.model.addPanelToTabGroup(M.id,I.id);e.skipSetActive||this.doSetGroupAndPanelActive(T);for(let I of D)this.fireDidMovePanel(I,t)},C;if(!s||s==="center"||!y)C=n;else{let T=Be(this.gridview.orientation,y,s);C=this.createGroupAtLocation(T,this.dropSizing(y))}!this.keepEmptyGroups(e)&&t.model.size===0&&t!==C&&this.doRemoveGroup(t,{skipActive:!0}),k(C)}moveGroup(e){this.mutation("move",()=>this._doMoveGroup(e))}maximizeGroup(e){this.mutation("maximize",()=>super.maximizeGroup(e))}exitMaximizedGroup(){this.mutation("maximize",()=>super.exitMaximizedGroup())}_doMoveGroup(e){var t;let i=e.from.group,n=e.to.group,s=e.to.position;if(s==="center"&&i===n)return;let l=i,u;if(s==="center"){let _=i.activePanel,y=i.model.getTabGroups().map(k=>({label:k.label,color:k.color,collapsed:k.collapsed,componentParams:k.componentParams,panelIds:[...k.panelIds]})),D=this.movingLock(()=>[...i.panels].map(k=>i.model.removePanel(k.id,{skipSetActive:!0})));i?.model.size===0&&this.doRemoveGroup(i,{skipActive:!0}),this.movingLock(()=>{for(let k of D)n.model.openPanel(k,{skipSetActive:k!==_,skipSetGroupActive:!0})}),u=D;for(let k of y){let C=n.model.createTabGroup({label:k.label,color:k.color,collapsed:k.collapsed,componentParams:k.componentParams});for(let T of k.panelIds)n.model.addPanelToTabGroup(C.id,T)}e.skipSetActive!==!0?this.doSetGroupAndPanelActive(n):this.activePanel||this.doSetGroupAndPanelActive(n)}else{let _=(()=>{if(i.api.location.type==="edge"||n.api.location.type==="edge")return!1;let y=this.getGridviewForGroup(i);if(y!==this.getGridviewForGroup(n))return!1;let D,k;try{D=xe(i.element),k=xe(n.element)}catch{return!1}return D.length===0||k.length===0?!1:eo(ot(D)[0],ot(k)[0])&&so(y.orientation,k)===Wi(s)})();if(i.api.location.type==="edge"){let y=i.activePanel,D=i.model.getTabGroups().map(C=>({label:C.label,color:C.color,collapsed:C.collapsed,componentParams:C.componentParams,panelIds:[...C.panelIds]})),k=this.movingLock(()=>[...i.panels].map(C=>i.model.removePanel(C.id,{skipSetActive:!0})));l=this.createGroup(),this._onDidAddGroup.fire(l),this.movingLock(()=>{for(let C of k)l.model.openPanel(C,{skipSetActive:C!==y,skipSetGroupActive:!0})});for(let C of D){let T=l.model.createTabGroup({label:C.label,color:C.color,collapsed:C.collapsed,componentParams:C.componentParams});for(let M of C.panelIds)l.model.addPanelToTabGroup(T.id,M)}}else switch(i.api.location.type){case"grid":this.gridview.removeView(xe(i.element));break;case"floating":{var p;let y=(p=this._floatingGroupService)===null||p===void 0?void 0:p.findByGroup(i);if(!y)throw new Error("dockview: failed to find floating group");this.detachFromNestedWindow(i)||y.dispose();break}case"popout":{var g,f;let y=(g=this._popoutWindowService)===null||g===void 0?void 0:g.findByGroup(i);if(!y)throw new Error("dockview: failed to find popout group");if(this.detachFromNestedWindow(i))break;if((f=this._popoutWindowService)===null||f===void 0||f.remove(y),y.referenceGroup){let D=this.getPanel(y.referenceGroup);D&&!D.api.isVisible&&this.doRemoveGroup(D,{skipActive:!0})}y.window.dispose();break}}if(n.api.location.type==="grid"||n.api.location.type==="floating"||n.api.location.type==="popout"){let y=this.getGridviewForGroup(n),D=xe(n.element),k=Be(y.orientation,D,s),C;if(_)C=Wi(s)==="HORIZONTAL"?i.api.width:i.api.height;else{var b;C=Ce.Split((b=D[D.length-1])!==null&&b!==void 0?b:0)}y.addView(l,C,k),this.setGroupLocationForRoot(l,y)}}if(((t=u)!==null&&t!==void 0?t:l.panels).forEach(_=>{this.fireDidMovePanel(_,i)}),this.debouncedUpdateAllPositions(),e.skipSetActive===!1){let _=n??i;this.doSetGroupAndPanelActive(_)}else l!==i&&e.skipSetActive!==!0&&this.doSetGroupAndPanelActive(l)}doSetGroupActive(e){var t;super.doSetGroupActive(e);let i=this.activePanel;!this._moving&&i!==((t=this._onDidActivePanelChange.value)===null||t===void 0?void 0:t.panel)&&this.fireActivePanelChange(i)}doSetGroupAndPanelActive(e){var t;super.doSetGroupActive(e);let i=this.activePanel;e&&this.hasMaximizedGroup()&&!this.isMaximizedGroup(e)&&this.exitMaximizedGroup(),!this._moving&&i!==((t=this._onDidActivePanelChange.value)===null||t===void 0?void 0:t.panel)&&this.fireActivePanelChange(i)}getNextGroupId(){let e=this.nextGroupId.next();for(;this._groups.has(e);)e=this.nextGroupId.next();return e}createGroup(e){var t;(t=e)!==null&&t!==void 0||(e={});let i=e?.id;if(i&&this._groups.has(e.id)&&(console.warn(`dockview: Duplicate group id ${e?.id}. reassigning group id to avoid errors`),i=void 0),!i)for(i=this.nextGroupId.next();this._groups.has(i);)i=this.nextGroupId.next();let n=new fi(this,i,e);if(n.init({params:{},accessor:this}),!this._groups.has(n.id)){let s=new x(n.model.onTabDragStart(l=>{var u;(u=this._advancedDnDService)===null||u===void 0||u.dispatchWillDragPanel(l)}),n.model.onGroupDragStart(l=>{var u;(u=this._advancedDnDService)===null||u===void 0||u.dispatchWillDragGroup(l)}),n.model.onMove(l=>{let{groupId:u,itemId:p,target:g,index:f,tabGroupId:b}=l;this.moveGroupOrPanel({from:{groupId:u,panelId:p,tabGroupId:b},to:{group:n,position:g,index:f}})}),n.model.onDidDrop(l=>{this._onDidDrop.fire(l)}),n.model.onWillDrop(l=>{var u;(u=this._advancedDnDService)===null||u===void 0||u.dispatchWillDrop(l)}),n.model.onWillShowOverlay(l=>{var u;if(this.options.disableDnd){l.preventDefault();return}(u=this._advancedDnDService)===null||u===void 0||u.dispatchWillShowOverlay(l)}),n.model.onUnhandledDragOver(l=>{this._onUnhandledDragOver.fire(l)}),n.model.onDidAddPanel(l=>{this._moving||this._onDidAddPanel.fire(l.panel)}),n.model.onDidRemovePanel(l=>{this._moving||this._onDidRemovePanel.fire(l.panel)}),n.model.onDidActivePanelChange(l=>{var u;this._moving||l.panel===this.activePanel&&((u=this._onDidActivePanelChange.value)===null||u===void 0?void 0:u.panel)!==l.panel&&this.fireActivePanelChange(l.panel)}),P.any(n.model.onDidPanelTitleChange,n.model.onDidPanelParametersChange)(()=>{this._bufferOnDidLayoutChange.fire()}));this._groups.set(n.id,{value:n,disposable:s})}return n.initialize(),n}createPanel(e,t){var i,n,s;let l=e.component,u=(i=e.tabComponent)!==null&&i!==void 0?i:this.options.defaultTabComponent,p=new ys(this,e.id,l,u),g=new Mt(e.id,l,u,this,this._api,t,p,{renderer:e.renderer,minimumWidth:e.minimumWidth,minimumHeight:e.minimumHeight,maximumWidth:e.maximumWidth,maximumHeight:e.maximumHeight});return g.init({title:(n=e.title)!==null&&n!==void 0?n:e.id,params:(s=e?.params)!==null&&s!==void 0?s:{}}),g}dropSizing(e){return Ce.Split(e.length===0?0:e[e.length-1])}createGroupAtLocation(e,t,i,n=this.gridview){let s=this.createGroup(i);return this.doAddGroup(s,e,t,n),this.setGroupLocationForRoot(s,n),s}setGroupLocationForRoot(e,t){var i;let n=(i=this._popoutWindowService)===null||i===void 0?void 0:i.entries.find(s=>s.gridview===t);if(n){e.model.renderContainer!==n.overlayRenderContainer&&(e.model.renderContainer=n.overlayRenderContainer),e.model.dropTargetContainer=n.dropTargetContainer,e.model.location={type:"popout",getWindow:n.getWindow,popoutUrl:n.popoutUrl};return}e.model.renderContainer!==this.overlayRenderContainer&&(e.model.renderContainer=this.overlayRenderContainer),e.model.dropTargetContainer=this.rootDropTargetContainer,e.model.location=t===this.gridview?{type:"grid"}:{type:"floating"}}getGridviewForGroup(e){var t,i;let n=(t=this._floatingGroupService)===null||t===void 0?void 0:t.findByGroup(e);if(n)return n.gridview;let s=(i=this._popoutWindowService)===null||i===void 0?void 0:i.findByGroup(e);return s?s.gridview:this.gridview}nestedWindowMembers(e){let t=this.getGridviewForGroup(e);return t===this.gridview?[]:this.groups.filter(i=>t.element.contains(i.element))}findGroup(e){var t;return(t=Array.from(this._groups.values()).find(i=>i.value.model.containsPanel(e)))===null||t===void 0?void 0:t.value}orientationAtLocation(e){let t=this.gridview.orientation;return e.length%2==1?t:st(t)}updateTheme(){var e,t,i,n,s,l;let u=(e=this._options.theme)!==null&&e!==void 0?e:_s;(t=this._shellThemeClassnames)===null||t===void 0||t.setClassNames(u.className);let p=(i=u.gap)!==null&&i!==void 0?i:0;this.gridview.margin=p;for(let _ of this.nestedGridviews())_.margin=p;if((n=this._shellManager)===null||n===void 0||n.updateTheme(p,(s=u.edgeGroupCollapsedSize)!==null&&s!==void 0?s:35),u.dndOverlayBorder===void 0){var g;this.element.style.removeProperty("--dv-drag-over-border"),(g=this._shellManager)===null||g===void 0||g.element.style.removeProperty("--dv-drag-over-border")}else{var f;this.element.style.setProperty("--dv-drag-over-border",u.dndOverlayBorder),(f=this._shellManager)===null||f===void 0||f.element.style.setProperty("--dv-drag-over-border",u.dndOverlayBorder)}u.dndOverlayMounting==="absolute"?this.rootDropTargetContainer.disabled=!1:this.rootDropTargetContainer.disabled=!0;let b=((l=u.tabGroupIndicator)!==null&&l!==void 0?l:"wrap")==="none";A(this.element,"dv-tab-group-indicator-none",b),this._shellManager&&A(this._shellManager.element,"dv-tab-group-indicator-none",b);for(let _ of this.groups)_.model.updateTabGroups()}},qs=class extends ho{get orientation(){return this.gridview.orientation}set orientation(e){this.gridview.orientation=e}get options(){return this._options}get deserializer(){return this._deserializer}set deserializer(e){this._deserializer=e}constructor(e,t){var i;super(e,{proportionalLayout:(i=t.proportionalLayout)!==null&&i!==void 0?i:!0,orientation:t.orientation,styles:t.hideBorders?{separatorBorder:"transparent"}:void 0,disableAutoResizing:t.disableAutoResizing,className:t.className}),this._onDidLayoutfromJSON=new G,this.onDidLayoutFromJSON=this._onDidLayoutfromJSON.event,this._onDidRemoveGroup=new G,this.onDidRemoveGroup=this._onDidRemoveGroup.event,this._onDidAddGroup=new G,this.onDidAddGroup=this._onDidAddGroup.event,this._onDidActiveGroupChange=new G,this.onDidActiveGroupChange=this._onDidActiveGroupChange.event,this._options=t,this.addDisposables(this._onDidAddGroup,this._onDidRemoveGroup,this._onDidActiveGroupChange,this.onDidAdd(n=>{this._onDidAddGroup.fire(n)}),this.onDidRemove(n=>{this._onDidRemoveGroup.fire(n)}),this.onDidActiveChange(n=>{this._onDidActiveGroupChange.fire(n)})),this.layoutFromElement()}updateOptions(e){super.updateOptions(e);let t=typeof e.orientation=="string"&&this.gridview.orientation!==e.orientation;this._options=j(j({},this.options),e),t&&(this.gridview.orientation=e.orientation),this.layout(this.gridview.width,this.gridview.height,!0)}removePanel(e){this.removeGroup(e)}toJSON(){var e;return{grid:this.gridview.serialize(),activePanel:(e=this.activeGroup)===null||e===void 0?void 0:e.id}}setVisible(e,t){this.gridview.setViewVisible(xe(e.element),t)}setActive(e){this._groups.forEach((t,i)=>{t.value.setActive(e===t.value)})}focus(){var e;(e=this.activeGroup)===null||e===void 0||e.focus()}fromJSON(e){this.clear();let{grid:t,activePanel:i}=e;try{let n=[],s=this.width,l=this.height;if(this.gridview.deserialize(t,{fromJSON:u=>{let{data:p}=u,g=this.options.createComponent({id:p.id,name:p.component});return n.push(()=>g.init({params:p.params,minimumWidth:p.minimumWidth,maximumWidth:p.maximumWidth,minimumHeight:p.minimumHeight,maximumHeight:p.maximumHeight,priority:p.priority,snap:!!p.snap,accessor:this,isVisible:u.visible})),this._onDidAddGroup.fire(g),this.registerPanel(g),g}}),this.layout(s,l,!0),n.forEach(u=>u()),typeof i=="string"){let u=this.getPanel(i);u&&this.doSetGroupActive(u)}}catch(n){for(let s of this.groups)s.dispose(),this._groups.delete(s.id),this._onDidRemoveGroup.fire(s);throw this.clear(),n}this._onDidLayoutfromJSON.fire()}clear(){let e=this.activeGroup,t=Array.from(this._groups.values());for(let i of t)i.disposable.dispose(),this.doRemoveGroup(i.value,{skipActive:!0});e&&this.doSetGroupActive(void 0),this.gridview.clear()}movePanel(e,t){var i;let n=(i=this._groups.get(t.reference))===null||i===void 0?void 0:i.value;if(!n)throw new Error(`reference group ${t.reference} does not exist`);let s=vi(t.direction);if(s==="center")throw new Error(`${s} not supported as an option`);let l=xe(n.element),u=Be(this.gridview.orientation,l,s),p=this.gridview.remove(e);this.doAddGroup(p,u,t.size)}addPanel(e){var t,i,n;let s=(t=e.location)!==null&&t!==void 0?t:[0];if(!((i=e.position)===null||i===void 0)&&i.referencePanel){var l;let p=(l=this._groups.get(e.position.referencePanel))===null||l===void 0?void 0:l.value;if(!p)throw new Error(`reference group ${e.position.referencePanel} does not exist`);let g=vi(e.position.direction);if(g==="center")throw new Error(`${g} not supported as an option`);{let f=xe(p.element);s=Be(this.gridview.orientation,f,g)}}let u=this.options.createComponent({id:e.id,name:e.component});return u.init({params:(n=e.params)!==null&&n!==void 0?n:{},minimumWidth:e.minimumWidth,maximumWidth:e.maximumWidth,minimumHeight:e.minimumHeight,maximumHeight:e.maximumHeight,priority:e.priority,snap:!!e.snap,accessor:this,isVisible:!0}),this.doAddGroup(u,s,e.size),this.registerPanel(u),this.doSetGroupActive(u),u}registerPanel(e){let t=new x(e.api.onDidFocusChange(i=>{i.isFocused&&this._groups.forEach(n=>{let s=n.value;s.setActive(s===e)})}));this._groups.set(e.id,{value:e,disposable:t})}moveGroup(e,t,i){let n=this.getPanel(t);if(!n)throw new Error("invalid operation");let s=xe(e.element),[l,u]=ot(Be(this.gridview.orientation,s,i)),[p,g]=ot(xe(n.element));if(eo(p,l)){this.gridview.moveView(p,g,u);return}let f=this.doRemoveGroup(n,{skipActive:!0,skipDispose:!0}),b=xe(e.element),_=Be(this.gridview.orientation,b,i);this.doAddGroup(f,_)}removeGroup(e){super.removeGroup(e)}dispose(){super.dispose(),this._onDidLayoutfromJSON.dispose()}},js=class extends co{get panels(){return this.splitview.getViews()}get options(){return this._options}get length(){return this._panels.size}get orientation(){return this.splitview.orientation}get splitview(){return this._splitview}set splitview(e){this._splitview&&this._splitview.dispose(),this._splitview=e,this._splitviewChangeDisposable.value=new x(this._splitview.onDidSashEnd(()=>{this._onDidLayoutChange.fire(void 0)}),this._splitview.onDidAddView(t=>this._onDidAddView.fire(t)),this._splitview.onDidRemoveView(t=>this._onDidRemoveView.fire(t)))}get minimumSize(){return this.splitview.minimumSize}get maximumSize(){return this.splitview.maximumSize}get height(){return this.splitview.orientation==="HORIZONTAL"?this.splitview.orthogonalSize:this.splitview.size}get width(){return this.splitview.orientation==="HORIZONTAL"?this.splitview.size:this.splitview.orthogonalSize}constructor(e,t){var i;super(document.createElement("div"),t.disableAutoResizing),this._splitviewChangeDisposable=new S,this._panels=new Map,this._onDidLayoutfromJSON=new G,this.onDidLayoutFromJSON=this._onDidLayoutfromJSON.event,this._onDidAddView=new G,this.onDidAddView=this._onDidAddView.event,this._onDidRemoveView=new G,this.onDidRemoveView=this._onDidRemoveView.event,this._onDidLayoutChange=new G,this.onDidLayoutChange=this._onDidLayoutChange.event,this.element.style.height="100%",this.element.style.width="100%",this._classNames=new We(this.element),this._classNames.setClassNames((i=t.className)!==null&&i!==void 0?i:""),e.appendChild(this.element),this._options=t,this.splitview=new Dt(this.element,t),this.addDisposables(this._onDidAddView,this._onDidLayoutfromJSON,this._onDidRemoveView,this._onDidLayoutChange),this.layoutFromElement()}updateOptions(e){if("className"in e){var t;this._classNames.setClassNames((t=e.className)!==null&&t!==void 0?t:"")}if("disableResizing"in e){var i;this.disableResizing=(i=e.disableAutoResizing)!==null&&i!==void 0?i:!1}typeof e.orientation=="string"&&(this.splitview.orientation=e.orientation),this._options=j(j({},this.options),e),this.splitview.layout(this.splitview.size,this.splitview.orthogonalSize)}focus(){var e;(e=this._activePanel)===null||e===void 0||e.focus()}movePanel(e,t){this.splitview.moveView(e,t)}setVisible(e,t){let i=this.panels.indexOf(e);this.splitview.setViewVisible(i,t)}setActive(e,t){this._activePanel=e,this.panels.filter(i=>i!==e).forEach(i=>{i.api._onDidActiveChange.fire({isActive:!1}),t||i.focus()}),e.api._onDidActiveChange.fire({isActive:!0}),t||e.focus()}removePanel(e,t){let i=this._panels.get(e.id);if(!i)throw new Error(`unknown splitview panel ${e.id}`);i.dispose(),this._panels.delete(e.id);let n=this.panels.indexOf(e);this.splitview.removeView(n,t).dispose();let s=this.panels;s.length>0&&this.setActive(s[s.length-1])}getPanel(e){return this.panels.find(t=>t.id===e)}addPanel(e){var t;if(this._panels.has(e.id))throw new Error(`panel ${e.id} already exists`);let i=this.options.createComponent({id:e.id,name:e.component});i.orientation=this.splitview.orientation,i.init({params:(t=e.params)!==null&&t!==void 0?t:{},minimumSize:e.minimumSize,maximumSize:e.maximumSize,snap:e.snap,priority:e.priority,accessor:this});let n=typeof e.size=="number"?e.size:Ce.Distribute,s=typeof e.index=="number"?e.index:void 0;return this.splitview.addView(i,n,s),this.doAddView(i),this.setActive(i),i}layout(e,t){let[i,n]=this.splitview.orientation==="HORIZONTAL"?[e,t]:[t,e];this.splitview.layout(i,n)}doAddView(e){let t=e.api.onDidFocusChange(i=>{i.isFocused&&this.setActive(e,!0)});this._panels.set(e.id,t)}toJSON(){var e;return{views:this.splitview.getViews().map((t,i)=>({size:this.splitview.getViewSize(i),data:t.toJSON(),snap:!!t.snap,priority:t.priority})),activeView:(e=this._activePanel)===null||e===void 0?void 0:e.id,size:this.splitview.size,orientation:this.splitview.orientation}}fromJSON(e){this.clear();let{views:t,orientation:i,size:n,activeView:s}=e,l=[],u=this.width,p=this.height;if(this.splitview=new Dt(this.element,{orientation:i,proportionalLayout:this.options.proportionalLayout,descriptor:{size:n,views:t.map(g=>{let f=g.data;if(this._panels.has(f.id))throw new Error(`panel ${f.id} already exists`);let b=this.options.createComponent({id:f.id,name:f.component});return l.push(()=>{var _;b.init({params:(_=f.params)!==null&&_!==void 0?_:{},minimumSize:f.minimumSize,maximumSize:f.maximumSize,snap:g.snap,priority:g.priority,accessor:this})}),b.orientation=i,this.doAddView(b),setTimeout(()=>{this._onDidAddView.fire(b)},0),{size:g.size,view:b}})}}),this.layout(u,p),l.forEach(g=>g()),typeof s=="string"){let g=this.getPanel(s);g&&this.setActive(g)}this._onDidLayoutfromJSON.fire()}clear(){for(let e of this._panels.values())e.dispose();for(this._panels.clear();this.splitview.length>0;)this.splitview.removeView(0,Ce.Distribute,!0).dispose()}dispose(){for(let t of this._panels.values())t.dispose();this._panels.clear();let e=this.splitview.getViews();this._splitviewChangeDisposable.dispose(),this.splitview.dispose();for(let t of e)t.dispose();this.element.remove(),super.dispose()}},Ks=class extends x{get element(){return this._element}constructor(){super(),this._expandedIcon=xc(),this._collapsedIcon=os(),this.disposable=new S,this.apiRef={api:null},this._element=document.createElement("div"),this.element.className="dv-default-header",this._content=document.createElement("span"),this._expander=document.createElement("div"),this._expander.className="dv-pane-header-icon",this.element.appendChild(this._expander),this.element.appendChild(this._content),this.addDisposables(O(this._element,"click",()=>{var e;(e=this.apiRef.api)===null||e===void 0||e.setExpanded(!this.apiRef.api.isExpanded)}))}init(e){this.apiRef.api=e.api,this._content.textContent=e.title,this.updateIcon(),this.disposable.value=e.api.onDidExpansionChange(()=>{this.updateIcon()})}updateIcon(){var e;let t=!!(!((e=this.apiRef.api)===null||e===void 0)&&e.isExpanded);A(this._expander,"collapsed",!t),t?(this._expander.contains(this._collapsedIcon)&&this._collapsedIcon.remove(),this._expander.contains(this._expandedIcon)||this._expander.appendChild(this._expandedIcon)):(this._expander.contains(this._expandedIcon)&&this._expandedIcon.remove(),this._expander.contains(this._collapsedIcon)||this._expander.appendChild(this._collapsedIcon))}update(e){}dispose(){this.disposable.dispose(),super.dispose()}};let Qh=io(),Js=22,Xs=0,Zs=Number.MAX_SAFE_INTEGER;var To=class extends ts{constructor(e){super({accessor:e.accessor,id:e.id,component:e.component,headerComponent:e.headerComponent,orientation:e.orientation,isExpanded:e.isExpanded,disableDnd:e.disableDnd,headerSize:e.headerSize,minimumBodySize:e.minimumBodySize,maximumBodySize:e.maximumBodySize}),this.options=e}getBodyComponent(){return this.options.body}getHeaderComponent(){return this.options.header}},Qs=class extends co{get id(){return this._id}get panels(){return this.paneview.getPanes()}set paneview(e){this._paneview=e,this._disposable.value=new x(this._paneview.onDidChange(()=>{this._onDidLayoutChange.fire(void 0)}),this._paneview.onDidAddView(t=>this._onDidAddView.fire(t)),this._paneview.onDidRemoveView(t=>this._onDidRemoveView.fire(t)))}get paneview(){return this._paneview}get minimumSize(){return this.paneview.minimumSize}get maximumSize(){return this.paneview.maximumSize}get height(){return this.paneview.orientation==="HORIZONTAL"?this.paneview.orthogonalSize:this.paneview.size}get width(){return this.paneview.orientation==="HORIZONTAL"?this.paneview.size:this.paneview.orthogonalSize}get options(){return this._options}constructor(e,t){var i;super(document.createElement("div"),t.disableAutoResizing),this._id=Qh.next(),this._disposable=new S,this._viewDisposables=new Map,this._onDidLayoutfromJSON=new G,this.onDidLayoutFromJSON=this._onDidLayoutfromJSON.event,this._onDidLayoutChange=new G,this.onDidLayoutChange=this._onDidLayoutChange.event,this._onDidDrop=new G,this.onDidDrop=this._onDidDrop.event,this._onDidAddView=new G,this.onDidAddView=this._onDidAddView.event,this._onDidRemoveView=new G,this.onDidRemoveView=this._onDidRemoveView.event,this._onUnhandledDragOver=new G,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this.element.style.height="100%",this.element.style.width="100%",this.addDisposables(this._onDidLayoutChange,this._onDidLayoutfromJSON,this._onDidDrop,this._onDidAddView,this._onDidRemoveView,this._onUnhandledDragOver),this._classNames=new We(this.element),this._classNames.setClassNames((i=t.className)!==null&&i!==void 0?i:""),e.appendChild(this.element),this._options=t,this.paneview=new Vi(this.element,{orientation:"VERTICAL"}),this.addDisposables(this._disposable)}setVisible(e,t){let i=this.panels.indexOf(e);this.paneview.setViewVisible(i,t)}focus(){}updateOptions(e){if("className"in e){var t;this._classNames.setClassNames((t=e.className)!==null&&t!==void 0?t:"")}if("disableAutoResizing"in e){var i;this.disableResizing=(i=e.disableAutoResizing)!==null&&i!==void 0?i:!1}this._options=j(j({},this.options),e)}addPanel(e){var t,i,n;let s=this.options.createComponent({id:e.id,name:e.component}),l;e.headerComponent&&this.options.createHeaderComponent&&(l=this.options.createHeaderComponent({id:e.id,name:e.headerComponent})),(t=l)!==null&&t!==void 0||(l=new Ks);let u=new To({id:e.id,component:e.component,headerComponent:e.headerComponent,header:l,body:s,orientation:"VERTICAL",isExpanded:!!e.isExpanded,disableDnd:!!this.options.disableDnd,accessor:this,headerSize:(i=e.headerSize)!==null&&i!==void 0?i:Js,minimumBodySize:Xs,maximumBodySize:Zs});this.doAddPanel(u);let p=typeof e.size=="number"?e.size:Ce.Distribute,g=typeof e.index=="number"?e.index:void 0;return u.init({params:(n=e.params)!==null&&n!==void 0?n:{},minimumBodySize:e.minimumBodySize,maximumBodySize:e.maximumBodySize,isExpanded:e.isExpanded,title:e.title,containerApi:new Kt(this),accessor:this}),this.paneview.addPane(u,p,g),u.orientation=this.paneview.orientation,u}removePanel(e){let t=this.panels.indexOf(e);this.paneview.removePane(t),this.doRemovePanel(e)}movePanel(e,t){this.paneview.moveView(e,t)}getPanel(e){return this.panels.find(t=>t.id===e)}layout(e,t){let[i,n]=this.paneview.orientation==="HORIZONTAL"?[e,t]:[t,e];this.paneview.layout(i,n)}toJSON(){let e=i=>i===Number.MAX_SAFE_INTEGER||i===Number.POSITIVE_INFINITY?void 0:i,t=i=>i<=0?void 0:i;return{views:this.paneview.getPanes().map((i,n)=>{let s=this.paneview.getViewCachedVisibleSize(n),l=typeof s=="number";return j({size:l?s:this.paneview.getViewSize(n),data:i.toJSON(),minimumSize:t(i.minimumBodySize),maximumSize:e(i.maximumBodySize),headerSize:i.headerSize,expanded:i.isExpanded()},l?{visible:!1}:{})}),size:this.paneview.size}}fromJSON(e){this.clear();let{views:t,size:i}=e,n=[],s=this.width,l=this.height;this.paneview.dispose(),this.paneview=new Vi(this.element,{orientation:"VERTICAL",descriptor:{size:i,views:t.map(u=>{var p,g,f,b;let _=u.data,y=this.options.createComponent({id:_.id,name:_.component}),D;_.headerComponent&&this.options.createHeaderComponent&&(D=this.options.createHeaderComponent({id:_.id,name:_.headerComponent})),(p=D)!==null&&p!==void 0||(D=new Ks);let k=new To({id:_.id,component:_.component,headerComponent:_.headerComponent,header:D,body:y,orientation:"VERTICAL",isExpanded:!!u.expanded,disableDnd:!!this.options.disableDnd,accessor:this,headerSize:(g=u.headerSize)!==null&&g!==void 0?g:Js,minimumBodySize:(f=u.minimumSize)!==null&&f!==void 0?f:Xs,maximumBodySize:(b=u.maximumSize)!==null&&b!==void 0?b:Zs});return this.doAddPanel(k),n.push(()=>{var C;k.init({params:(C=_.params)!==null&&C!==void 0?C:{},minimumBodySize:u.minimumSize,maximumBodySize:u.maximumSize,title:_.title,isExpanded:!!u.expanded,containerApi:new Kt(this),accessor:this}),k.orientation=this.paneview.orientation}),setTimeout(()=>{this._onDidAddView.fire(k)},0),{size:u.size,view:k,visible:u.visible}})}}),this.layout(s,l),n.forEach(u=>u()),this._onDidLayoutfromJSON.fire()}clear(){for(let[i,n]of this._viewDisposables.entries())n.dispose();this._viewDisposables.clear();let e=this.width,t=this.height;this.paneview.dispose(),this.paneview=new Vi(this.element,{orientation:"VERTICAL"}),this.layout(e,t)}doAddPanel(e){let t=new x(e.onDidDrop(i=>{this._onDidDrop.fire(i)}),e.onUnhandledDragOver(i=>{this._onUnhandledDragOver.fire(i)}));this._viewDisposables.set(e.id,t)}doRemovePanel(e){let t=this._viewDisposables.get(e.id);t&&(t.dispose(),this._viewDisposables.delete(e.id))}dispose(){super.dispose();for(let[e,t]of this._viewDisposables.entries())t.dispose();this._viewDisposables.clear(),this.element.remove(),this.paneview.dispose()}},eu=class extends mo{get priority(){return this._priority}set orientation(e){this._orientation=e}get orientation(){return this._orientation}get minimumSize(){let e=typeof this._minimumSize=="function"?this._minimumSize():this._minimumSize;return e!==this._evaluatedMinimumSize&&(this._evaluatedMinimumSize=e,this.updateConstraints()),e}get maximumSize(){let e=typeof this._maximumSize=="function"?this._maximumSize():this._maximumSize;return e!==this._evaluatedMaximumSize&&(this._evaluatedMaximumSize=e,this.updateConstraints()),e}get snap(){return this._snap}constructor(e,t){super(e,t,new Qr(e,t)),this._evaluatedMinimumSize=0,this._evaluatedMaximumSize=Number.POSITIVE_INFINITY,this._minimumSize=0,this._maximumSize=Number.POSITIVE_INFINITY,this._snap=!1,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this.api.initialize(this),this.addDisposables(this._onDidChange,this.api.onWillVisibilityChange(i=>{let{isVisible:n}=i,{accessor:s}=this._params;s.setVisible(this,n)}),this.api.onActiveChange(()=>{let{accessor:i}=this._params;i.setActive(this)}),this.api.onDidConstraintsChangeInternal(i=>{(typeof i.minimumSize=="number"||typeof i.minimumSize=="function")&&(this._minimumSize=i.minimumSize),(typeof i.maximumSize=="number"||typeof i.maximumSize=="function")&&(this._maximumSize=i.maximumSize),this.updateConstraints()}),this.api.onDidSizeChange(i=>{this._onDidChange.fire({size:i.size})}))}setVisible(e){this.api._onDidVisibilityChange.fire({isVisible:e})}setActive(e){this.api._onDidActiveChange.fire({isActive:e})}layout(e,t){let[i,n]=this.orientation==="HORIZONTAL"?[e,t]:[t,e];super.layout(i,n)}init(e){super.init(e),this._priority=e.priority,e.minimumSize&&(this._minimumSize=e.minimumSize),e.maximumSize&&(this._maximumSize=e.maximumSize),e.snap&&(this._snap=e.snap)}toJSON(){let e=i=>i===Number.MAX_SAFE_INTEGER||i===Number.POSITIVE_INFINITY?void 0:i,t=i=>i<=0?void 0:i;return j(j({},super.toJSON()),{},{minimumSize:t(this.minimumSize),maximumSize:e(this.maximumSize)})}updateConstraints(){this.api._onDidConstraintsChange.fire({maximumSize:this._evaluatedMaximumSize,minimumSize:this._evaluatedMinimumSize})}};function tu(e,t){return new Ys(e,t).api}function iu(e,t){return new Vr(new js(e,t))}function nu(e,t){return new Wr(new qs(e,t))}function ou(e,t){return new Kt(new Qs(e,t))}r.AdvancedDnDModule=Is,r.AdvancedDnDService=Es,r.BaseGrid=ho,r.ContentContainer=is,r.ContextMenuController=Ns,r.ContextMenuModule=Vs,r.DEFAULT_TAB_GROUP_COLORS=qi,r.DefaultDockviewDeserialzier=xs,r.DefaultTab=So,r.DockviewApi=Bi,r.DockviewComponent=Ys,r.DockviewCompositeDisposable=x,r.DockviewDidDropEvent=Xi,Object.defineProperty(r,"DockviewDisposable",{enumerable:!0,get:function(){return w}}),r.DockviewEmitter=G,Object.defineProperty(r,"DockviewEvent",{enumerable:!0,get:function(){return P}}),r.DockviewGroupPanel=fi,r.DockviewGroupPanelModel=bs,r.DockviewMutableDisposable=S,r.DockviewPanel=Mt,r.DockviewUnhandledDragOverEvent=_o,r.DockviewWillDropEvent=Do,r.DockviewWillShowOverlayLocationEvent=Jt,r.DraggablePaneviewPanel=ts,r.EdgeGroupModule=Ps,r.FloatingGroupModule=Gs,r.Gridview=lo,r.GridviewApi=Wr,r.GridviewComponent=qs,r.GridviewPanel=ws,r.LayoutPriority=Yl,r.LiveRegionModule=As,r.LocalSelectionTransfer=h,r.OVERFLOW_MAX_TAB_ROWS_VARIABLE=Tc,r.OVERFLOW_WRAP_TABS_CAPPED_CLASS=zc,r.OVERFLOW_WRAP_TABS_CLASS=wo,r.OVERFLOW_WRAP_TABS_VERTICAL_TAB_HEIGHT_VARIABLE=Ac,r.Orientation=Fl,r.PROPERTY_KEYS_DOCKVIEW=Ec,r.PROPERTY_KEYS_GRIDVIEW=jl,r.PROPERTY_KEYS_PANEVIEW=bc,r.PROPERTY_KEYS_SPLITVIEW=ql,r.PaneFramework=To,r.PaneTransfer=c,r.PanelTransfer=d,r.Paneview=Vi,r.PaneviewApi=Kt,r.PaneviewComponent=Qs,r.PaneviewPanel=es,r.PaneviewUnhandledDragOverEvent=Jr,r.SashState=Ul,Object.defineProperty(r,"Sizing",{enumerable:!0,get:function(){return Ce}}),r.Splitview=Dt,r.SplitviewApi=Vr,r.SplitviewComponent=js,r.SplitviewPanel=eu,r.Tab=rs,r.TabGroupChipsModule=Ls,r.TabGroupChipsService=Ms,r.TabGroupColorPalette=yo,r.applyTabGroupAccent=ji,r.clearRegisteredModules=mh,r.createCloseButton=ns,r.createDismissableLayer=Bs,r.createDockview=tu,r.createGridview=nu,r.createPaneview=ou,r.createPinButton=fo,r.createSplitview=iu,r.defineModule=dt,r.directionToPosition=vo,r.findRelativeZIndexParent=Ke,r.getActiveElement=$i,r.getDirectionOrientation=Wi,r.getGridLocation=xe,r.getLocationOrientation=so,r.getPaneData=m,r.getPanelData=v,r.getPopoutUrlError=Qn,r.getRegisteredModules=Cs,r.getRelativeLocation=Be,r.indexInParent=Rr,r.isAnyEdgeGroupEnabled=Yi,r.isEdgeGroupEnabled=ds,r.isGridBranchNode=$r,r.isGroupOptionsWithGroup=us,r.isGroupOptionsWithPanel=hs,r.isPanelOptionsWithGroup=cs,r.isPanelOptionsWithPanel=ls,r.orthogonal=st,r.positionToDirection=qr,r.prefersReducedMotion=He,r.registerModules=gh,r.resolveMessages=uo,r.resolveOpaqueBackground=pi,r.resolveTabGroupAccent=Ki,r.themeAbyss=_s,r.themeAbyssSpaced=Jc,r.themeCatppuccinMocha=eh,r.themeCatppuccinMochaSpaced=th,r.themeDark=Yc,r.themeDracula=Kc,r.themeGithubDark=rh,r.themeGithubDarkSpaced=sh,r.themeGithubLight=ah,r.themeGithubLightSpaced=dh,r.themeLight=qc,r.themeLightSpaced=Xc,r.themeMonokai=ih,r.themeNord=Zc,r.themeNordSpaced=Qc,r.themeSolarizedLight=nh,r.themeSolarizedLightSpaced=oh,r.themeVisualStudio=jc,r.toTarget=vi})});var du=r=>{let{state:o}=r,a=o.doc.lineAt(o.selection.main.from),d=Bo(r.state,a.from);return d.line?lu(r):d.block?hu(r):!1};function Ho(r,o){return({state:a,dispatch:d})=>{if(a.readOnly)return!1;let c=r(o,a);return c?(d(a.update(c)),!0):!1}}var lu=Ho(vu,0);var cu=Ho(Va,0);var hu=Ho((r,o)=>Va(r,o,pu(o)),0);function Bo(r,o){let a=r.languageDataAt("commentTokens",o,1);return a.length?a[0]:{}}var xi=50;function uu(r,{open:o,close:a},d,c){let h=r.sliceDoc(d-xi,d),v=r.sliceDoc(c,c+xi),m=/\s*$/.exec(h)[0].length,w=/^\s*/.exec(v)[0].length,x=h.length-m;if(h.slice(x-o.length,x)==o&&v.slice(w,w+a.length)==a)return{open:{pos:d-m,margin:m&&1},close:{pos:c+w,margin:w&&1}};let S,P;c-d<=2*xi?S=P=r.sliceDoc(d,c):(S=r.sliceDoc(d,d+xi),P=r.sliceDoc(c-xi,c));let z=/^\s*/.exec(S)[0].length,L=/\s*$/.exec(P)[0].length,V=P.length-L-a.length;return S.slice(z,z+o.length)==o&&P.slice(V,V+a.length)==a?{open:{pos:d+z+o.length,margin:/\s/.test(S.charAt(z+o.length))?1:0},close:{pos:c-L-a.length,margin:/\s/.test(P.charAt(V-1))?1:0}}:null}function pu(r){let o=[];for(let a of r.selection.ranges){let d=r.doc.lineAt(a.from),c=a.to<=d.to?d:r.doc.lineAt(a.to);c.from>d.from&&c.from==a.to&&(c=a.to==d.to+1?d:r.doc.lineAt(a.to-1));let h=o.length-1;h>=0&&o[h].to>d.from?o[h].to=c.to:o.push({from:d.from+/^\s*/.exec(d.text)[0].length,to:c.to})}return o}function Va(r,o,a=o.selection.ranges){let d=a.map(h=>Bo(o,h.from).block);if(!d.every(h=>h))return null;let c=a.map((h,v)=>uu(o,d[v],h.from,h.to));if(r!=2&&!c.every(h=>h))return{changes:o.changes(a.map((h,v)=>c[v]?[]:[{from:h.from,insert:d[v].open+" "},{from:h.to,insert:" "+d[v].close}]))};if(r!=1&&c.some(h=>h)){let h=[];for(let v=0,m;v<c.length;v++)if(m=c[v]){let w=d[v],{open:x,close:S}=m;h.push({from:x.pos-w.open.length,to:x.pos+x.margin},{from:S.pos-S.margin,to:S.pos+w.close.length})}return{changes:h}}return null}function vu(r,o,a=o.selection.ranges){let d=[],c=-1;e:for(let{from:h,to:v}of a){let m=d.length,w=1e9,x;for(let S=h;S<=v;){let P=o.doc.lineAt(S);if(x==null&&(x=Bo(o,P.from).line,!x))continue e;if(P.from>c&&(h==v||v>P.from)){c=P.from;let z=/^\s*/.exec(P.text)[0].length,L=z==P.length,V=P.text.slice(z,z+x.length)==x?z:-1;z<P.text.length&&z<w&&(w=z),d.push({line:P,comment:V,token:x,indent:z,empty:L,single:!1})}S=P.to+1}if(w<1e9)for(let S=m;S<d.length;S++)d[S].indent<d[S].line.text.length&&(d[S].indent=w);d.length==m+1&&(d[m].single=!0)}if(r!=2&&d.some(h=>h.comment<0&&(!h.empty||h.single))){let h=[];for(let{line:m,token:w,indent:x,empty:S,single:P}of d)(P||!S)&&h.push({from:m.from+x,insert:w+" "});let v=o.changes(h);return{changes:v,selection:o.selection.map(v,1)}}else if(r!=1&&d.some(h=>h.comment>=0)){let h=[];for(let{line:v,comment:m,token:w}of d)if(m>=0){let x=v.from+m,S=x+w.length;v.text[S-v.from]==" "&&S++,h.push({from:x,to:S})}return{changes:h}}return null}var Aa=ca.define();var gu=St.define();var Ht=class r{constructor(o,a,d,c,h){this.changes=o,this.effects=a,this.mapped=d,this.startSelection=c,this.selectionsAfter=h}setSelAfter(o){return new r(this.changes,this.effects,this.mapped,this.startSelection,o)}toJSON(){var o,a,d;return{changes:(o=this.changes)===null||o===void 0?void 0:o.toJSON(),mapped:(a=this.mapped)===null||a===void 0?void 0:a.toJSON(),startSelection:(d=this.startSelection)===null||d===void 0?void 0:d.toJSON(),selectionsAfter:this.selectionsAfter.map(c=>c.toJSON())}}static fromJSON(o){return new r(o.changes&&bi.fromJSON(o.changes),[],o.mapped&&la.fromJSON(o.mapped),o.startSelection&&ue.fromJSON(o.startSelection),o.selectionsAfter.map(ue.fromJSON))}static fromTransaction(o,a){let d=Qe;for(let c of o.startState.facet(gu)){let h=c(o);h.length&&(d=d.concat(h))}return!d.length&&o.changes.empty?null:new r(o.changes.invert(o.startState.doc),d,void 0,a||o.startState.selection,Qe)}static selection(o){return new r(void 0,Qe,void 0,void 0,o)}};function No(r,o,a,d){let c=o+1>a+20?o-a-1:0,h=r.slice(c,o);return h.push(d),h}function mu(r,o){let a=[],d=!1;return r.iterChangedRanges((c,h)=>a.push(c,h)),o.iterChangedRanges((c,h,v,m)=>{for(let w=0;w<a.length;){let x=a[w++],S=a[w++];m>=x&&v<=S&&(d=!0)}}),d}function fu(r,o){return r.ranges.length==o.ranges.length&&r.ranges.filter((a,d)=>a.empty!=o.ranges[d].empty).length===0}function Wa(r,o){return r.length?o.length?r.concat(o):r:o}var Qe=[],bu=200;function wu(r,o){if(r.length){let a=r[r.length-1],d=a.selectionsAfter.slice(Math.max(0,a.selectionsAfter.length-bu));return d.length&&d[d.length-1].eq(o)?r:(d.push(o),No(r,r.length-1,1e9,a.setSelAfter(d)))}else return[Ht.selection([o])]}function _u(r){let o=r[r.length-1],a=r.slice();return a[r.length-1]=o.setSelAfter(o.selectionsAfter.slice(0,o.selectionsAfter.length-1)),a}function $o(r,o){if(!r.length)return r;let a=r.length,d=Qe;for(;a;){let c=yu(r[a-1],o,d);if(c.changes&&!c.changes.empty||c.effects.length){let h=r.slice(0,a);return h[a-1]=c,h}else o=c.mapped,a--,d=c.selectionsAfter}return d.length?[Ht.selection(d)]:Qe}function yu(r,o,a){let d=Wa(r.selectionsAfter.length?r.selectionsAfter.map(m=>m.map(o)):Qe,a);if(!r.changes)return Ht.selection(d);let c=r.changes.map(o),h=o.mapDesc(r.changes,!0),v=r.mapped?r.mapped.composeDesc(h):h;return new Ht(c,Ie.mapEffects(r.effects,o),v,r.startSelection.map(h),d)}var xu=/^(input\.type|delete)($|\.)/,un=class r{constructor(o,a,d=0,c=void 0){this.done=o,this.undone=a,this.prevTime=d,this.prevUserEvent=c}isolate(){return this.prevTime?new r(this.done,this.undone):this}addChanges(o,a,d,c,h){let v=this.done,m=v[v.length-1];return m&&m.changes&&!m.changes.empty&&o.changes&&(!d||xu.test(d))&&(!m.selectionsAfter.length&&a-this.prevTime<c.newGroupDelay&&c.joinToEvent(h,mu(m.changes,o.changes))||d=="input.type.compose")?v=No(v,v.length-1,c.minDepth,new Ht(o.changes.compose(m.changes),Wa(Ie.mapEffects(o.effects,m.changes),m.effects),m.mapped,m.startSelection,Qe)):v=No(v,v.length,c.minDepth,o),new r(v,Qe,a,d)}addSelection(o,a,d,c){let h=this.done.length?this.done[this.done.length-1].selectionsAfter:Qe;return h.length>0&&a-this.prevTime<c&&d==this.prevUserEvent&&d&&/^select($|\.)/.test(d)&&fu(h[h.length-1],o)?this:new r(wu(this.done,o),this.undone,a,d)}addMapping(o){return new r($o(this.done,o),$o(this.undone,o),this.prevTime,this.prevUserEvent)}pop(o,a,d){let c=o==0?this.done:this.undone;if(c.length==0)return null;let h=c[c.length-1],v=h.selectionsAfter[0]||(h.startSelection?h.startSelection.map(h.changes.invertedDesc,1):a.selection);if(d&&h.selectionsAfter.length)return a.update({selection:h.selectionsAfter[h.selectionsAfter.length-1],annotations:Aa.of({side:o,rest:_u(c),selection:v}),userEvent:o==0?"select.undo":"select.redo",scrollIntoView:!0});if(h.changes){let m=c.length==1?Qe:c.slice(0,c.length-1);return h.mapped&&(m=$o(m,h.mapped)),a.update({changes:h.changes,selection:h.startSelection,effects:h.effects,annotations:Aa.of({side:o,rest:m,selection:v}),filter:!1,userEvent:o==0?"undo":"redo",scrollIntoView:!0})}else return null}};un.empty=new un(Qe,Qe);function ei(r,o){return ue.create(r.ranges.map(o),r.mainIndex)}function lt(r,o){return r.update({selection:o,scrollIntoView:!0,userEvent:"select"})}function ct({state:r,dispatch:o},a){let d=ei(r.selection,a);return d.eq(r.selection,!0)?!1:(o(lt(r,d)),!0)}function pn(r,o){return ue.cursor(o?r.to:r.from)}function Ha(r,o){return ct(r,a=>a.empty?r.moveByChar(a,o):pn(a,o))}function Me(r){return r.textDirectionAt(r.state.selection.main.head)==ua.LTR}var Ba=r=>Ha(r,!Me(r)),Fa=r=>Ha(r,Me(r));function Ua(r,o){return ct(r,a=>a.empty?r.moveByGroup(a,o):pn(a,o))}var Du=r=>Ua(r,!Me(r)),ku=r=>Ua(r,Me(r));var eg=typeof Intl<"u"&&Intl.Segmenter?new Intl.Segmenter(void 0,{granularity:"word"}):null;function Su(r,o,a){if(o.type.prop(a))return!0;let d=o.to-o.from;return d&&(d>2||/[^\s,.;:]/.test(r.sliceDoc(o.from,o.to)))||o.firstChild}function vn(r,o,a){let d=ln(r).resolveInner(o.head),c=a?dn.closedBy:dn.openedBy;for(let w=o.head;;){let x=a?d.childAfter(w):d.childBefore(w);if(!x)break;Su(r,x,c)?d=x:w=a?x.to:x.from}let h=d.type.prop(c),v,m;return h&&(v=a?Wt(r,d.from,1):Wt(r,d.to,-1))&&v.matched?m=a?v.end.to:v.end.from:m=a?d.to:d.from,ue.cursor(m,a?-1:1)}var Cu=r=>ct(r,o=>vn(r.state,o,!Me(r))),Gu=r=>ct(r,o=>vn(r.state,o,Me(r)));function Ya(r,o){return ct(r,a=>{if(!a.empty)return pn(a,o);let d=r.moveVertically(a,o);return d.head!=a.head?d:r.moveToLineBoundary(a,o)})}var qa=r=>Ya(r,!1),ja=r=>Ya(r,!0);function Ka(r){let o=r.scrollDOM.clientHeight<r.scrollDOM.scrollHeight-2,a=0,d=0,c;if(o){for(let h of r.state.facet(ce.scrollMargins)){let v=h(r);v?.top&&(a=Math.max(v?.top,a)),v?.bottom&&(d=Math.max(v?.bottom,d))}c=r.scrollDOM.clientHeight-a-d}else c=(r.dom.ownerDocument.defaultView||window).innerHeight;return{marginTop:a,marginBottom:d,selfScroll:o,height:Math.max(r.defaultLineHeight,c-5)}}function Ja(r,o){let a=Ka(r),{state:d}=r,c=ei(d.selection,v=>v.empty?r.moveVertically(v,o,a.height):pn(v,o));if(c.eq(d.selection))return!1;let h;if(a.selfScroll){let v=r.coordsAtPos(d.selection.main.head),m=r.scrollDOM.getBoundingClientRect(),w=m.top+a.marginTop,x=m.bottom-a.marginBottom;v&&v.top>w&&v.bottom<x&&(h=ce.scrollIntoView(c.main.head,{y:"start",yMargin:v.top-w}))}return r.dispatch(lt(d,c),{effects:h}),!0}var Ea=r=>Ja(r,!1),Vo=r=>Ja(r,!0);function Ct(r,o,a){let d=r.lineBlockAt(o.head),c=r.moveToLineBoundary(o,a);if(c.head==o.head&&c.head!=(a?d.to:d.from)&&(c=r.moveToLineBoundary(o,a,!1)),!a&&c.head==d.from&&d.length){let h=/^\s*/.exec(r.state.sliceDoc(d.from,Math.min(d.from+100,d.to)))[0].length;h&&o.head!=d.from+h&&(c=ue.cursor(d.from+h))}return c}var Pu=r=>ct(r,o=>Ct(r,o,!0)),zu=r=>ct(r,o=>Ct(r,o,!1)),Tu=r=>ct(r,o=>Ct(r,o,!Me(r))),Au=r=>ct(r,o=>Ct(r,o,Me(r))),Eu=r=>ct(r,o=>r.moveToLineBoundary(o,!1,!1)),Iu=r=>ct(r,o=>r.moveToLineBoundary(o,!0,!1));function Mu(r,o,a){let d=!1,c=ei(r.selection,h=>{let v=Wt(r,h.head,-1)||Wt(r,h.head,1)||h.head>0&&Wt(r,h.head-1,1)||h.head<r.doc.length&&Wt(r,h.head+1,-1);if(!v||!v.end)return h;d=!0;let m=v.start.from==h.head?v.end.to:v.end.from;return a?ue.range(h.anchor,m):ue.cursor(m)});return d?(o(lt(r,c)),!0):!1}var Lu=({state:r,dispatch:o})=>Mu(r,o,!1);function et(r,o,a){let d=ei(r.state.selection,c=>{c.undirectional&&c.head>=c.anchor!=o&&(c=ue.range(c.head,c.anchor));let h=a(c);return ue.range(c.anchor,h.head,h.goalColumn,h.bidiLevel||void 0,h.assoc)});return d.eq(r.state.selection)?!1:(r.dispatch(lt(r.state,d)),!0)}function Xa(r,o){return et(r,o,a=>r.moveByChar(a,o))}var Za=r=>Xa(r,!Me(r)),Qa=r=>Xa(r,Me(r));function ed(r,o){return et(r,o,a=>r.moveByGroup(a,o))}var Ou=r=>ed(r,!Me(r)),Ru=r=>ed(r,Me(r));var $u=r=>{let o=!Me(r);return et(r,o,a=>vn(r.state,a,o))},Nu=r=>{let o=Me(r);return et(r,o,a=>vn(r.state,a,o))};function td(r,o){return et(r,o,a=>r.moveVertically(a,o))}var id=r=>td(r,!1),nd=r=>td(r,!0);function od(r,o){return et(r,o,a=>r.moveVertically(a,o,Ka(r).height))}var Ia=r=>od(r,!1),Ma=r=>od(r,!0),Vu=r=>et(r,!0,o=>Ct(r,o,!0)),Wu=r=>et(r,!1,o=>Ct(r,o,!1)),Hu=r=>{let o=!Me(r);return et(r,o,a=>Ct(r,a,o))},Bu=r=>{let o=Me(r);return et(r,o,a=>Ct(r,a,o))},Fu=r=>et(r,!1,o=>ue.cursor(r.lineBlockAt(o.head).from)),Uu=r=>et(r,!0,o=>ue.cursor(r.lineBlockAt(o.head).to)),La=({state:r,dispatch:o})=>(o(lt(r,{anchor:0})),!0),Oa=({state:r,dispatch:o})=>(o(lt(r,{anchor:r.doc.length})),!0),Ra=({state:r,dispatch:o})=>(o(lt(r,{anchor:r.selection.main.anchor,head:0})),!0),$a=({state:r,dispatch:o})=>(o(lt(r,{anchor:r.selection.main.anchor,head:r.doc.length})),!0),Yu=({state:r,dispatch:o})=>(o(r.update({selection:{anchor:0,head:r.doc.length},userEvent:"select"})),!0),qu=({state:r,dispatch:o})=>{let a=gn(r).map(({from:d,to:c})=>ue.undirectionalRange(d,Math.min(c+1,r.doc.length)));return o(r.update({selection:ue.create(a),userEvent:"select"})),!0},ju=({state:r,dispatch:o})=>{let a=ei(r.selection,d=>{let c=ln(r),h=c.resolveStack(d.from,1);if(d.empty){let v=c.resolveStack(d.from,-1);v.node.from>=h.node.from&&v.node.to<=h.node.to&&(h=v)}for(let v=h;v;v=v.next){let{node:m}=v;if((m.from<d.from&&m.to>=d.to||m.to>d.to&&m.from<=d.from)&&v.next)return ue.undirectionalRange(m.from,m.to)}return d});return a.eq(r.selection)?!1:(o(lt(r,a)),!0)};function rd(r,o){let{state:a}=r,d=a.selection,c=a.selection.ranges.slice();for(let h of a.selection.ranges){let v=a.doc.lineAt(h.head);if(o?v.to<r.state.doc.length:v.from>0)for(let m=h;;){let w=r.moveVertically(m,o);if(w.head<v.from||w.head>v.to){c.some(x=>x.head==w.head)||c.push(w);break}else{if(w.head==m.head)break;m=w}}}return c.length==d.ranges.length?!1:(r.dispatch(lt(a,ue.create(c,c.length-1))),!0)}var Ku=r=>rd(r,!1),Ju=r=>rd(r,!0),Xu=({state:r,dispatch:o})=>{let a=r.selection,d=null;return a.ranges.length>1?d=ue.create([a.main]):a.main.empty||(d=ue.create([ue.cursor(a.main.head)])),d?(o(lt(r,d)),!0):!1};function Di(r,o){if(r.state.readOnly)return!1;let a="delete.selection",{state:d}=r,c=d.changeByRange(h=>{let{from:v,to:m}=h;if(v==m){let w=o(h);w<v?(a="delete.backward",w=hn(r,w,!1)):w>v&&(a="delete.forward",w=hn(r,w,!0)),v=Math.min(v,w),m=Math.max(m,w)}else v=hn(r,v,!1),m=hn(r,m,!0);return v==m?{range:h}:{changes:{from:v,to:m},range:ue.cursor(v,v<h.head?-1:1)}});return c.changes.empty?!1:(r.dispatch(d.update(c,{scrollIntoView:!0,userEvent:a,effects:a=="delete.selection"?ce.announce.of(d.phrase("Selection deleted")):void 0})),!0)}function hn(r,o,a){if(r instanceof ce)for(let d of r.state.facet(ce.atomicRanges).map(c=>c(r)))d.between(o,o,(c,h)=>{c<o&&h>o&&(o=a?h:c)});return o}var sd=(r,o,a)=>Di(r,d=>{let c=d.from,{state:h}=r,v=h.doc.lineAt(c),m,w;if(a&&!o&&c>v.from&&c<v.from+200&&!/[^ \t]/.test(m=v.text.slice(0,c-v.from))){if(m[m.length-1]=="	")return c-1;let x=rn(m,h.tabSize),S=x%cn(h)||cn(h);for(let P=0;P<S&&m[m.length-1-P]==" ";P++)c--;w=c}else w=wt(v.text,c-v.from,o,o)+v.from,w==c&&v.number!=(o?h.doc.lines:1)?w+=o?1:-1:!o&&/[\ufe00-\ufe0f]/.test(v.text.slice(w-v.from,c-v.from))&&(w=wt(v.text,w-v.from,!1,!1)+v.from);return w}),Wo=r=>sd(r,!1,!0);var ad=r=>sd(r,!0,!1),dd=(r,o)=>Di(r,a=>{let d=a.head,{state:c}=r,h=c.doc.lineAt(d),v=c.charCategorizer(d);for(let m=null;;){if(d==(o?h.to:h.from)){d==a.head&&h.number!=(o?c.doc.lines:1)&&(d+=o?1:-1);break}let w=wt(h.text,d-h.from,o)+h.from,x=h.text.slice(Math.min(d,w)-h.from,Math.max(d,w)-h.from),S=v(x);if(m!=null&&S!=m)break;(x!=" "||d!=a.head)&&(m=S),d=w}return d}),ld=r=>dd(r,!1),Zu=r=>dd(r,!0);var Qu=r=>Di(r,o=>{let a=r.lineBlockAt(o.head).to;return o.head<a?a:Math.min(r.state.doc.length,o.head+1)});var ep=r=>Di(r,o=>{let a=r.moveToLineBoundary(o,!1).head;return o.head>a?a:Math.max(0,o.head-1)}),tp=r=>Di(r,o=>{let a=r.moveToLineBoundary(o,!0).head;return o.head<a?a:Math.min(r.state.doc.length,o.head+1)});var ip=({state:r,dispatch:o})=>{if(r.readOnly)return!1;let a=r.changeByRange(d=>({changes:{from:d.from,to:d.to,insert:Zt.of(["",""])},range:ue.cursor(d.from)}));return o(r.update(a,{scrollIntoView:!0,userEvent:"input"})),!0},np=({state:r,dispatch:o})=>{if(r.readOnly)return!1;let a=r.changeByRange(d=>{if(!d.empty||d.from==0||d.from==r.doc.length)return{range:d};let c=d.from,h=r.doc.lineAt(c),v=c==h.from?c-1:wt(h.text,c-h.from,!1)+h.from,m=c==h.to?c+1:wt(h.text,c-h.from,!0)+h.from;return{changes:{from:v,to:m,insert:r.doc.slice(c,m).append(r.doc.slice(v,c))},range:ue.cursor(m)}});return a.changes.empty?!1:(o(r.update(a,{scrollIntoView:!0,userEvent:"move.character"})),!0)};function gn(r){let o=[],a=-1;for(let d of r.selection.ranges){let c=r.doc.lineAt(d.from),h=r.doc.lineAt(d.to);if(!d.empty&&d.to==h.from&&(h=r.doc.lineAt(d.to-1)),a>=c.number){let v=o[o.length-1];v.to=h.to,v.ranges.push(d)}else o.push({from:c.from,to:h.to,ranges:[d]});a=h.number+1}return o}function cd(r,o,a){if(r.readOnly)return!1;let d=[],c=[];for(let h of gn(r)){if(a?h.to==r.doc.length:h.from==0)continue;let v=r.doc.lineAt(a?h.to+1:h.from-1),m=v.length+1;if(a){d.push({from:h.to,to:v.to},{from:h.from,insert:v.text+r.lineBreak});for(let w of h.ranges)c.push(ue.range(Math.min(r.doc.length,w.anchor+m),Math.min(r.doc.length,w.head+m)))}else{d.push({from:v.from,to:h.from},{from:h.to,insert:r.lineBreak+v.text});for(let w of h.ranges)c.push(ue.range(w.anchor-m,w.head-m))}}return d.length?(o(r.update({changes:d,scrollIntoView:!0,selection:ue.create(c,r.selection.mainIndex),userEvent:"move.line"})),!0):!1}var op=({state:r,dispatch:o})=>cd(r,o,!1),rp=({state:r,dispatch:o})=>cd(r,o,!0);function hd(r,o,a){if(r.readOnly)return!1;let d=[];for(let h of gn(r))a?d.push({from:h.from,insert:r.doc.slice(h.from,h.to)+r.lineBreak}):d.push({from:h.to,insert:r.lineBreak+r.doc.slice(h.from,h.to)});let c=r.changes(d);return o(r.update({changes:c,selection:r.selection.map(c,a?1:-1),scrollIntoView:!0,userEvent:"input.copyline"})),!0}var sp=({state:r,dispatch:o})=>hd(r,o,!1),ap=({state:r,dispatch:o})=>hd(r,o,!0),dp=r=>{if(r.state.readOnly)return!1;let{state:o}=r,a=o.changes(gn(o).map(({from:c,to:h})=>(c>0?c--:h<o.doc.length&&h++,{from:c,to:h}))),d=ei(o.selection,c=>{let h;if(r.lineWrapping){let v=r.lineBlockAt(c.head),m=r.coordsAtPos(c.head,c.assoc||1);m&&(h=v.bottom+r.documentTop-m.bottom+r.defaultLineHeight/2)}return r.moveVertically(c,!0,h)}).map(a);return r.dispatch({changes:a,selection:d,scrollIntoView:!0,userEvent:"delete.line"}),!0};function lp(r,o){if(/\(\)|\[\]|\{\}/.test(r.sliceDoc(o-1,o+1)))return{from:o,to:o};let a=ln(r).resolveInner(o),d=a.childBefore(o),c=a.childAfter(o),h;return d&&c&&d.to<=o&&c.from>=o&&(h=d.type.prop(dn.closedBy))&&h.indexOf(c.name)>-1&&r.doc.lineAt(d.to).from==r.doc.lineAt(c.from).from&&!/\S/.test(r.sliceDoc(d.to,c.from))?{from:d.to,to:c.from}:null}var Na=ud(!1),cp=ud(!0);function ud(r){return({state:o,dispatch:a})=>{if(o.readOnly)return!1;let d=o.changeByRange(c=>{let{from:h,to:v}=c,m=o.doc.lineAt(h),w=!r&&h==v&&lp(o,h);r&&(h=v=(v<=m.to?m:o.doc.lineAt(v)).to);let x=new Oo(o,{simulateBreak:h,simulateDoubleBreak:!!w}),S=Lo(x,h);for(S==null&&(S=rn(/^\s*/.exec(o.doc.lineAt(h).text)[0],o.tabSize));v<m.to&&/\s/.test(m.text[v-m.from]);)v++;w?{from:h,to:v}=w:h>m.from&&h<m.from+100&&!/\S/.test(m.text.slice(0,h))&&(h=m.from);let P=["",_i(o,S)];return w&&P.push(_i(o,x.lineIndent(m.from,-1))),{changes:{from:h,to:v,insert:Zt.of(P)},range:ue.cursor(h+1+P[1].length)}});return a(o.update(d,{scrollIntoView:!0,userEvent:"input"})),!0}}function Fo(r,o){let a=-1;return r.changeByRange(d=>{let c=[];for(let v=d.from;v<=d.to;){let m=r.doc.lineAt(v);m.number>a&&(d.empty||d.to>m.from)&&(o(m,c,d),a=m.number),v=m.to+1}let h=r.changes(c);return{changes:c,range:ue.range(h.mapPos(d.anchor,1),h.mapPos(d.head,1))}})}var hp=({state:r,dispatch:o})=>{if(r.readOnly)return!1;let a=Object.create(null),d=new Oo(r,{overrideIndentation:h=>{let v=a[h];return v??-1}}),c=Fo(r,(h,v,m)=>{let w=Lo(d,h.from);if(w==null)return;/\S/.test(h.text)||(w=0);let x=/^\s*/.exec(h.text)[0],S=_i(r,w);(x!=S||m.from<h.from+x.length)&&(a[h.from]=w,v.push({from:h.from,to:h.from+x.length,insert:S}))});return c.changes.empty||o(r.update(c,{userEvent:"indent"})),!0},up=({state:r,dispatch:o})=>r.readOnly?!1:(o(r.update(Fo(r,(a,d)=>{d.push({from:a.from,insert:r.facet(ka)})}),{userEvent:"input.indent"})),!0),pp=({state:r,dispatch:o})=>r.readOnly?!1:(o(r.update(Fo(r,(a,d)=>{let c=/^\s*/.exec(a.text)[0];if(!c)return;let h=rn(c,r.tabSize),v=0,m=_i(r,Math.max(0,h-cn(r)));for(;v<c.length&&v<m.length&&c.charCodeAt(v)==m.charCodeAt(v);)v++;d.push({from:a.from+v,to:a.from+c.length,insert:m.slice(v)})}),{userEvent:"delete.dedent"})),!0),vp=r=>(r.setTabFocusMode(),!0);var gp=[{key:"Ctrl-b",run:Ba,shift:Za,preventDefault:!0},{key:"Ctrl-f",run:Fa,shift:Qa},{key:"Ctrl-p",run:qa,shift:id},{key:"Ctrl-n",run:ja,shift:nd},{key:"Ctrl-a",run:Eu,shift:Fu},{key:"Ctrl-e",run:Iu,shift:Uu},{key:"Ctrl-d",run:ad},{key:"Ctrl-h",run:Wo},{key:"Ctrl-k",run:Qu},{key:"Ctrl-Alt-h",run:ld},{key:"Ctrl-o",run:ip},{key:"Ctrl-t",run:np},{key:"Ctrl-v",run:Vo}],mp=[{key:"ArrowLeft",run:Ba,shift:Za,preventDefault:!0},{key:"Mod-ArrowLeft",mac:"Alt-ArrowLeft",run:Du,shift:Ou,preventDefault:!0},{mac:"Cmd-ArrowLeft",run:Tu,shift:Hu,preventDefault:!0},{key:"ArrowRight",run:Fa,shift:Qa,preventDefault:!0},{key:"Mod-ArrowRight",mac:"Alt-ArrowRight",run:ku,shift:Ru,preventDefault:!0},{mac:"Cmd-ArrowRight",run:Au,shift:Bu,preventDefault:!0},{key:"ArrowUp",run:qa,shift:id,preventDefault:!0},{mac:"Cmd-ArrowUp",run:La,shift:Ra},{mac:"Ctrl-ArrowUp",run:Ea,shift:Ia},{key:"ArrowDown",run:ja,shift:nd,preventDefault:!0},{mac:"Cmd-ArrowDown",run:Oa,shift:$a},{mac:"Ctrl-ArrowDown",run:Vo,shift:Ma},{key:"PageUp",run:Ea,shift:Ia},{key:"PageDown",run:Vo,shift:Ma},{key:"Home",run:zu,shift:Wu,preventDefault:!0},{key:"Mod-Home",run:La,shift:Ra},{key:"End",run:Pu,shift:Vu,preventDefault:!0},{key:"Mod-End",run:Oa,shift:$a},{key:"Enter",run:Na,shift:Na},{key:"Mod-a",run:Yu},{key:"Backspace",run:Wo,shift:Wo,preventDefault:!0},{key:"Delete",run:ad,preventDefault:!0},{key:"Mod-Backspace",mac:"Alt-Backspace",run:ld,preventDefault:!0},{key:"Mod-Delete",mac:"Alt-Delete",run:Zu,preventDefault:!0},{mac:"Mod-Backspace",run:ep,preventDefault:!0},{mac:"Mod-Delete",run:tp,preventDefault:!0}].concat(gp.map(r=>({mac:r.key,run:r.run,shift:r.shift}))),pd=[{key:"Alt-ArrowLeft",mac:"Ctrl-ArrowLeft",run:Cu,shift:$u},{key:"Alt-ArrowRight",mac:"Ctrl-ArrowRight",run:Gu,shift:Nu},{key:"Alt-ArrowUp",run:op},{key:"Shift-Alt-ArrowUp",run:sp},{key:"Alt-ArrowDown",run:rp},{key:"Shift-Alt-ArrowDown",run:ap},{key:"Mod-Alt-ArrowUp",run:Ku},{key:"Mod-Alt-ArrowDown",run:Ju},{key:"Escape",run:Xu},{key:"Mod-Enter",run:cp},{key:"Alt-l",mac:"Ctrl-l",run:qu},{key:"Mod-i",run:ju,preventDefault:!0},{key:"Mod-[",run:pp},{key:"Mod-]",run:up},{key:"Mod-Alt-\\",run:hp},{key:"Shift-Mod-k",run:dp},{key:"Shift-Mod-\\",run:Lu},{key:"Mod-/",run:du},{key:"Alt-A",mac:"Ctrl-A",run:cu},{key:"Ctrl-m",mac:"Shift-Alt-m",run:vp}].concat(mp);var vd=typeof String.prototype.normalize=="function"?r=>r.normalize("NFKD"):r=>r,Pt=class{constructor(o,a,d=0,c=o.length,h,v){this.test=v,this.value={from:0,to:0,precise:!1},this.done=!1,this.matches=[],this.buffer="",this.bufferPos=0,this.iter=o.iterRange(d,c),this.bufferStart=d,this.normalize=h?m=>h(vd(m)):vd,this.query=this.normalize(a)}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return-1;this.bufferPos=0,this.buffer=this.iter.value}return sa(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let o=this.peek();if(o<0)return this.done=!0,this;let a=aa(o),d=this.bufferStart+this.bufferPos;this.bufferPos+=da(o);let c=this.normalize(a);if(c.length)for(let h=0,v=d,m=!0;;h++){let w=c.charCodeAt(h),x=this.match(w,v,m,this.bufferPos+this.bufferStart,h==c.length-1);if(x)return this.value=x,this;if(h==c.length-1)break;m&&h<a.length&&a.charCodeAt(h)==w?v++:m=!1}}}match(o,a,d,c,h){let v=null;for(let m=0;m<this.matches.length;){let w=this.matches[m],x=!1;this.query.charCodeAt(w.index)==o&&(w.index==this.query.length-1?v={from:w.from,to:c,precise:h&&w.precise}:(w.index++,x=!0)),x?m++:this.matches.splice(m,1)}return this.query.charCodeAt(0)==o&&(this.query.length==1?v={from:a,to:c,precise:d&&h}:this.matches.push({from:a,index:1,precise:d})),v&&this.test&&!this.test(v.from,v.to,this.buffer,this.bufferStart)&&(v=null),v}};typeof Symbol<"u"&&(Pt.prototype[Symbol.iterator]=function(){return this});var fd={from:-1,to:-1,match:/.*/.exec(""),precise:!0},Jo="gm"+(/x/.unicode==null?"":"u"),bn=class{constructor(o,a,d,c=0,h=o.length){if(this.text=o,this.to=h,this.curLine="",this.done=!1,this.value=fd,/\\[sWDnr]|\n|\r|\[\^/.test(a))return new _n(o,a,d,c,h);this.re=new RegExp(a,Jo+(d?.ignoreCase?"i":"")),this.test=d?.test,this.iter=o.iter();let v=o.lineAt(c);this.curLineStart=v.from,this.matchPos=yn(o,c),this.getLine(this.curLineStart)}getLine(o){this.iter.next(o),this.iter.lineBreak?this.curLine="":(this.curLine=this.iter.value,this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart)),this.iter.next())}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1,this.curLineStart>this.to?this.curLine="":this.getLine(0)}next(){for(let o=this.matchPos-this.curLineStart;;){this.re.lastIndex=o;let a=this.matchPos<=this.to&&this.re.exec(this.curLine);if(a){let d=this.curLineStart+a.index,c=d+a[0].length;if(this.matchPos=yn(this.text,c+(d==c?1:0)),d==this.curLineStart+this.curLine.length&&this.nextLine(),(d<c||d>this.value.to)&&(!this.test||this.test(d,c,a)))return this.value={from:d,to:c,precise:!0,match:a},this;o=this.matchPos-this.curLineStart}else if(this.curLineStart+this.curLine.length<this.to)this.nextLine(),o=0;else return this.done=!0,this}}},Uo=new WeakMap,wn=class r{constructor(o,a){this.from=o,this.text=a}get to(){return this.from+this.text.length}static get(o,a,d){let c=Uo.get(o);if(!c||c.from>=d||c.to<=a){let m=new r(a,o.sliceString(a,d));return Uo.set(o,m),m}if(c.from==a&&c.to==d)return c;let{text:h,from:v}=c;return v>a&&(h=o.sliceString(a,v)+h,v=a),c.to<d&&(h+=o.sliceString(c.to,d)),Uo.set(o,new r(v,h)),new r(a,h.slice(a-v,d-v))}},_n=class{constructor(o,a,d,c,h){this.text=o,this.to=h,this.done=!1,this.value=fd,this.matchPos=yn(o,c),this.re=new RegExp(a,Jo+(d?.ignoreCase?"i":"")),this.test=d?.test,this.flat=wn.get(o,c,this.chunkEnd(c+5e3))}chunkEnd(o){return o>=this.to?this.to:this.text.lineAt(o).to}next(){for(;;){let o=this.re.lastIndex=this.matchPos-this.flat.from,a=this.re.exec(this.flat.text);if(a&&!a[0]&&a.index==o&&(this.re.lastIndex=o+1,a=this.re.exec(this.flat.text)),a){let d=this.flat.from+a.index,c=d+a[0].length;if((this.flat.to>=this.to||a.index+a[0].length<=this.flat.text.length-10)&&(!this.test||this.test(d,c,a)))return this.value={from:d,to:c,precise:!0,match:a},this.matchPos=yn(this.text,c+(d==c?1:0)),this}if(this.flat.to==this.to)return this.done=!0,this;this.flat=wn.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+this.flat.text.length*2))}}};typeof Symbol<"u"&&(bn.prototype[Symbol.iterator]=_n.prototype[Symbol.iterator]=function(){return this});function fp(r){try{return new RegExp(r,Jo),!0}catch{return!1}}function yn(r,o){if(o>=r.length)return o;let a=r.lineAt(o),d;for(;o<a.to&&(d=a.text.charCodeAt(o-a.from))>=56320&&d<57344;)o++;return o}var bp=r=>{let o=_a(r,"cm-goto-line");if(o){let v=o.dom.querySelector("input[type=text]");return v&&v.select(),!0}let{state:a}=r,d=String(a.doc.lineAt(r.state.selection.main.head).number),{close:c,result:h}=wa(r,{class:"cm-goto-line",label:a.phrase("Go to line"),input:{type:"text",name:"line",value:d},focus:!0,submitLabel:a.phrase("go")});return h.then(v=>{let m=v&&/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(v.elements.line.value);if(!m){r.dispatch({effects:c});return}let w=a.doc.lineAt(a.selection.main.head),[,x,S,P,z]=m,L=P?+P.slice(1):0,V=S?+S:w.number;if(S&&z){let G=V/100;x&&(G=G*(x=="-"?-1:1)+w.number/a.doc.lines),V=Math.round(a.doc.lines*G)}else S&&x&&(V=V*(x=="-"?-1:1)+w.number);let H=a.doc.line(Math.max(1,Math.min(a.doc.lines,V))),N=ue.cursor(H.from+Math.max(0,Math.min(L,H.length)));r.dispatch({effects:[c,ce.scrollIntoView(N.from,{y:"center"})],selection:N})}),!0},wp={highlightWordAroundCursor:!1,minSelectionLength:1,maxMatches:100,wholeWords:!1},bd=St.define({combine(r){return on(r,wp,{highlightWordAroundCursor:(o,a)=>o||a,minSelectionLength:Math.min,maxMatches:Math.min})}});function wd(r){let o=[kp,Dp];return r&&o.push(bd.of(r)),o}var _p=be.mark({class:"cm-selectionMatch"}),yp=be.mark({class:"cm-selectionMatch cm-selectionMatch-main"});function gd(r,o,a,d){return(a==0||r(o.sliceDoc(a-1,a))!=Re.Word)&&(d==o.doc.length||r(o.sliceDoc(d,d+1))!=Re.Word)}function xp(r,o,a,d){return r(o.sliceDoc(a,a+1))==Re.Word&&r(o.sliceDoc(d-1,d))==Re.Word}var Dp=wi.fromClass(class{constructor(r){this.decorations=this.getDeco(r)}update(r){(r.selectionSet||r.docChanged||r.viewportChanged)&&(this.decorations=this.getDeco(r.view))}getDeco(r){let o=r.state.facet(bd),{state:a}=r,d=a.selection;if(d.ranges.length>1)return be.none;let c=d.main,h,v=null;if(c.empty){if(!o.highlightWordAroundCursor)return be.none;let w=a.wordAt(c.head);if(!w)return be.none;v=a.charCategorizer(c.head),h=a.sliceDoc(w.from,w.to)}else{let w=c.to-c.from;if(w<o.minSelectionLength||w>200)return be.none;if(o.wholeWords){if(h=a.sliceDoc(c.from,c.to),v=a.charCategorizer(c.head),!(gd(v,a,c.from,c.to)&&xp(v,a,c.from,c.to)))return be.none}else if(h=a.sliceDoc(c.from,c.to),!h)return be.none}let m=[];for(let w of r.visibleRanges){let x=new Pt(a.doc,h,w.from,w.to);for(;!x.next().done;){let{from:S,to:P}=x.value;if((!v||gd(v,a,S,P))&&(c.empty&&S<=c.from&&P>=c.to?m.push(yp.range(S,P)):(S>=c.to||P<=c.from)&&m.push(_p.range(S,P)),m.length>o.maxMatches))return be.none}}return be.set(m)}},{decorations:r=>r.decorations}),kp=ce.baseTheme({".cm-selectionMatch":{backgroundColor:"#99ff7780"},".cm-searchMatch .cm-selectionMatch":{backgroundColor:"transparent"}}),Sp=({state:r,dispatch:o})=>{let{selection:a}=r,d=ue.create(a.ranges.map(c=>r.wordAt(c.head)||ue.cursor(c.head)),a.mainIndex);return d.eq(a)?!1:(o(r.update({selection:d})),!0)};function Cp(r,o){let{main:a,ranges:d}=r.selection,c=r.wordAt(a.head),h=c&&c.from==a.from&&c.to==a.to;for(let v=!1,m=new Pt(r.doc,o,d[d.length-1].to);;)if(m.next(),m.done){if(v)return null;m=new Pt(r.doc,o,0,Math.max(0,d[d.length-1].from-1)),v=!0}else{if(v&&d.some(w=>w.from==m.value.from))continue;if(h){let w=r.wordAt(m.value.from);if(!w||w.from!=m.value.from||w.to!=m.value.to)continue}return m.value}}var Gp=({state:r,dispatch:o})=>{let{ranges:a}=r.selection;if(a.some(h=>h.from===h.to))return Sp({state:r,dispatch:o});let d=r.sliceDoc(a[0].from,a[0].to);if(r.selection.ranges.some(h=>r.sliceDoc(h.from,h.to)!=d))return!1;let c=Cp(r,d);return c?(o(r.update({selection:r.selection.addRange(ue.range(c.from,c.to),!1),effects:ce.scrollIntoView(c.to)})),!0):!1},ni=St.define({combine(r){return on(r,{top:!1,caseSensitive:!1,literal:!1,regexp:!1,wholeWord:!1,createPanel:o=>new Ko(o),scrollToMatch:o=>ce.scrollIntoView(o)})}});var xn=class{constructor(o){this.search=o.search,this.caseSensitive=!!o.caseSensitive,this.literal=!!o.literal,this.regexp=!!o.regexp,this.replace=o.replace||"",this.valid=!!this.search&&(!this.regexp||fp(this.search)),this.unquoted=this.unquote(this.search),this.wholeWord=!!o.wholeWord,this.test=o.test}unquote(o){return this.literal?o:o.replace(/\\([nrt\\])/g,(a,d)=>d=="n"?`
`:d=="r"?"\r":d=="t"?"	":"\\")}eq(o){return this.search==o.search&&this.replace==o.replace&&this.caseSensitive==o.caseSensitive&&this.regexp==o.regexp&&this.wholeWord==o.wholeWord&&this.test==o.test}create(){return this.regexp?new qo(this):new Yo(this)}getCursor(o,a=0,d){let c=o.doc?o:gt.create({doc:o});return d==null&&(d=c.doc.length),this.regexp?ii(this,c,a,d):ti(this,c,a,d)}},Dn=class{constructor(o){this.spec=o}};function Pp(r,o,a){return(d,c,h,v)=>{if(a&&!a(d,c,h,v))return!1;let m=d>=v&&c<=v+h.length?h.slice(d-v,c-v):o.doc.sliceString(d,c);return r(m,o,d,c)}}function ti(r,o,a,d){let c;return r.wholeWord&&(c=zp(o.doc,o.charCategorizer(o.selection.main.head))),r.test&&(c=Pp(r.test,o,c)),new Pt(o.doc,r.unquoted,a,d,r.caseSensitive?void 0:h=>h.toLowerCase(),c)}function zp(r,o){return(a,d,c,h)=>((h>a||h+c.length<d)&&(h=Math.max(0,a-2),c=r.sliceString(h,Math.min(r.length,d+2))),(o(kn(c,a-h))!=Re.Word||o(Sn(c,a-h))!=Re.Word)&&(o(Sn(c,d-h))!=Re.Word||o(kn(c,d-h))!=Re.Word))}var Yo=class extends Dn{constructor(o){super(o)}nextMatch(o,a,d){let c=ti(this.spec,o,d,o.doc.length).nextOverlapping();if(c.done){let h=Math.min(o.doc.length,a+this.spec.unquoted.length);c=ti(this.spec,o,0,h).nextOverlapping()}return c.done||c.value.from==a&&c.value.to==d?null:c.value}prevMatchInRange(o,a,d){for(let c=d;;){let h=Math.max(a,c-1e4-this.spec.unquoted.length),v=ti(this.spec,o,h,c),m=null;for(;!v.nextOverlapping().done;)m=v.value;if(m)return m;if(h==a)return null;c-=1e4}}prevMatch(o,a,d){let c=this.prevMatchInRange(o,0,a);return c||(c=this.prevMatchInRange(o,Math.max(0,d-this.spec.unquoted.length),o.doc.length)),c&&(c.from!=a||c.to!=d)?c:null}getReplacement(o){return this.spec.unquote(this.spec.replace)}matchAll(o,a){let d=ti(this.spec,o,0,o.doc.length),c=[];for(;!d.next().done;){if(c.length>=a)return null;c.push(d.value)}return c}highlight(o,a,d,c){let h=ti(this.spec,o,Math.max(0,a-this.spec.unquoted.length),Math.min(d+this.spec.unquoted.length,o.doc.length));for(;!h.next().done;)c(h.value.from,h.value.to)}};function Tp(r,o,a){return(d,c,h)=>(!a||a(d,c,h))&&r(h[0],o,d,c)}function ii(r,o,a,d){let c;return r.wholeWord&&(c=Ap(o.charCategorizer(o.selection.main.head))),r.test&&(c=Tp(r.test,o,c)),new bn(o.doc,r.search,{ignoreCase:!r.caseSensitive,test:c},a,d)}function kn(r,o){return r.slice(wt(r,o,!1),o)}function Sn(r,o){return r.slice(o,wt(r,o))}function Ap(r){return(o,a,d)=>!d[0].length||(r(kn(d.input,d.index))!=Re.Word||r(Sn(d.input,d.index))!=Re.Word)&&(r(Sn(d.input,d.index+d[0].length))!=Re.Word||r(kn(d.input,d.index+d[0].length))!=Re.Word)}var qo=class extends Dn{nextMatch(o,a,d){let c=ii(this.spec,o,d,o.doc.length).next();return c.done&&(c=ii(this.spec,o,0,a).next()),c.done?null:c.value}prevMatchInRange(o,a,d){for(let c=1;;c++){let h=Math.max(a,d-c*1e4),v=ii(this.spec,o,h,d),m=null;for(;!v.next().done;)m=v.value;if(m&&(h==a||m.from>h+10))return m;if(h==a)return null}}prevMatch(o,a,d){return this.prevMatchInRange(o,0,a)||this.prevMatchInRange(o,d,o.doc.length)}getReplacement(o){return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g,(a,d)=>{if(d=="&")return o.match[0];if(d=="$")return"$";for(let c=d.length;c>0;c--){let h=+d.slice(0,c);if(h>0&&h<o.match.length)return o.match[h]+d.slice(c)}return a})}matchAll(o,a){let d=ii(this.spec,o,0,o.doc.length),c=[];for(;!d.next().done;){if(c.length>=a)return null;c.push(d.value)}return c}highlight(o,a,d,c){let h=ii(this.spec,o,Math.max(0,a-250),Math.min(d+250,o.doc.length));for(;!h.next().done;)c(h.value.from,h.value.to)}},Si=Ie.define(),Xo=Ie.define(),Gt=Ze.define({create(r){return new ki(jo(r).create(),null)},update(r,o){for(let a of o.effects)a.is(Si)?r=new ki(a.value.create(),r.panel):a.is(Xo)&&(r=new ki(r.query,a.value?Zo:null));return r},provide:r=>ba.from(r,o=>o.panel)});var ki=class{constructor(o,a){this.query=o,this.panel=a}},Ep=be.mark({class:"cm-searchMatch"}),Ip=be.mark({class:"cm-searchMatch cm-searchMatch-selected"}),Mp=wi.fromClass(class{constructor(r){this.view=r,this.decorations=this.highlight(r.state.field(Gt))}update(r){let o=r.state.field(Gt);(o!=r.startState.field(Gt)||r.docChanged||r.selectionSet||r.viewportChanged)&&(this.decorations=this.highlight(o))}highlight({query:r,panel:o}){if(!o||!r.spec.valid)return be.none;let{view:a}=this,d=new _t;for(let c=0,h=a.visibleRanges,v=h.length;c<v;c++){let{from:m,to:w}=h[c];for(;c<v-1&&w>h[c+1].from-500;)w=h[++c].to;r.highlight(a.state,m,w,(x,S)=>{let P=a.state.selection.ranges.some(z=>z.from==x&&z.to==S);d.add(x,S,P?Ip:Ep)})}return d.finish()}},{decorations:r=>r.decorations});function Ci(r){return o=>{let a=o.state.field(Gt,!1);return a&&a.query.spec.valid?r(o,a):xd(o)}}var Cn=Ci((r,{query:o})=>{let{to:a}=r.state.selection.main,d=o.nextMatch(r.state,a,a);if(!d)return!1;let c=ue.single(d.from,d.to),h=r.state.facet(ni);return r.dispatch({selection:c,effects:[Qo(r,d),h.scrollToMatch(c.main,r)],userEvent:"select.search"}),yd(r),!0}),Gn=Ci((r,{query:o})=>{let{state:a}=r,{from:d}=a.selection.main,c=o.prevMatch(a,d,d);if(!c)return!1;let h=ue.single(c.from,c.to),v=r.state.facet(ni);return r.dispatch({selection:h,effects:[Qo(r,c),v.scrollToMatch(h.main,r)],userEvent:"select.search"}),yd(r),!0}),Lp=Ci((r,{query:o})=>{let a=o.matchAll(r.state,1e3);return!a||!a.length?!1:(r.dispatch({selection:ue.create(a.map(d=>ue.range(d.from,d.to))),userEvent:"select.search.matches"}),!0)}),Op=({state:r,dispatch:o})=>{let a=r.selection;if(a.ranges.length>1||a.main.empty)return!1;let{from:d,to:c}=a.main,h=[],v=0;for(let m=new Pt(r.doc,r.sliceDoc(d,c));!m.next().done;){if(h.length>1e3)return!1;m.value.from==d&&(v=h.length),h.push(ue.range(m.value.from,m.value.to))}return o(r.update({selection:ue.create(h,v),userEvent:"select.search.matches"})),!0},md=Ci((r,{query:o})=>{let{state:a}=r,{from:d,to:c}=a.selection.main;if(a.readOnly)return!1;let h=o.nextMatch(a,d,d);if(!h)return!1;let v=h,m=[],w,x,S=[];v.precise?v.from==d&&v.to==c&&(x=a.toText(o.getReplacement(v)),m.push({from:v.from,to:v.to,insert:x}),v=o.nextMatch(a,v.from,v.to),S.push(ce.announce.of(a.phrase("replaced match on line $",a.doc.lineAt(d).number)+"."))):v=o.nextMatch(a,v.from,v.to);let P=r.state.changes(m);return v&&(w=ue.single(v.from,v.to).map(P),S.push(Qo(r,v)),S.push(a.facet(ni).scrollToMatch(w.main,r))),r.dispatch({changes:P,selection:w,effects:S,userEvent:"input.replace"}),!0}),Rp=Ci((r,{query:o})=>{if(r.state.readOnly)return!1;let a=[];for(let c of o.matchAll(r.state,1e9)){let{from:h,to:v,precise:m}=c;m&&a.push({from:h,to:v,insert:o.getReplacement(c)})}if(!a.length)return!1;let d=r.state.phrase("replaced $ matches",a.length)+".";return r.dispatch({changes:a,effects:ce.announce.of(d),userEvent:"input.replace.all"}),!0});function Zo(r){return r.state.facet(ni).createPanel(r)}function jo(r,o){var a,d,c,h,v;let m=r.selection.main,w=m.empty||m.to>m.from+100?"":r.sliceDoc(m.from,m.to);if(o&&!w)return o;let x=r.facet(ni);return new xn({search:((a=o?.literal)!==null&&a!==void 0?a:x.literal)?w:w.replace(/\n/g,"\\n"),caseSensitive:(d=o?.caseSensitive)!==null&&d!==void 0?d:x.caseSensitive,literal:(c=o?.literal)!==null&&c!==void 0?c:x.literal,regexp:(h=o?.regexp)!==null&&h!==void 0?h:x.regexp,wholeWord:(v=o?.wholeWord)!==null&&v!==void 0?v:x.wholeWord})}function _d(r){let o=Io(r,Zo);return o&&o.dom.querySelector("[main-field]")}function yd(r){let o=_d(r);o&&o==r.root.activeElement&&o.select()}var xd=r=>{let o=r.state.field(Gt,!1);if(o&&o.panel){let a=_d(r);if(a&&a!=r.root.activeElement){let d=jo(r.state,o.query.spec);d.valid&&r.dispatch({effects:Si.of(d)}),a.focus(),a.select()}}else r.dispatch({effects:[Xo.of(!0),o?Si.of(jo(r.state,o.query.spec)):Ie.appendConfig.of(Np)]});return!0},Dd=r=>{let o=r.state.field(Gt,!1);if(!o||!o.panel)return!1;let a=Io(r,Zo);return a&&a.dom.contains(r.root.activeElement)&&r.focus(),r.dispatch({effects:Xo.of(!1)}),!0},kd=[{key:"Mod-f",run:xd,scope:"editor search-panel"},{key:"F3",run:Cn,shift:Gn,scope:"editor search-panel",preventDefault:!0},{key:"Mod-g",run:Cn,shift:Gn,scope:"editor search-panel",preventDefault:!0},{key:"Escape",run:Dd,scope:"editor search-panel"},{key:"Mod-Shift-l",run:Op},{key:"Mod-Alt-g",run:bp},{key:"Mod-d",run:Gp,preventDefault:!0}],Ko=class{constructor(o){this.view=o;let a=this.query=o.state.field(Gt).query.spec;this.commit=this.commit.bind(this),this.searchField=Ye("input",{value:a.search,placeholder:qe(o,"Find"),"aria-label":qe(o,"Find"),class:"cm-textfield",name:"search",form:"","main-field":"true",onchange:this.commit,onkeyup:this.commit}),this.replaceField=Ye("input",{value:a.replace,placeholder:qe(o,"Replace"),"aria-label":qe(o,"Replace"),class:"cm-textfield",name:"replace",form:"",onchange:this.commit,onkeyup:this.commit}),this.caseField=Ye("input",{type:"checkbox",name:"case",form:"",checked:a.caseSensitive,onchange:this.commit}),this.reField=Ye("input",{type:"checkbox",name:"re",form:"",checked:a.regexp,onchange:this.commit}),this.wordField=Ye("input",{type:"checkbox",name:"word",form:"",checked:a.wholeWord,onchange:this.commit});function d(c,h,v){return Ye("button",{class:"cm-button",name:c,onclick:h,type:"button"},v)}this.dom=Ye("div",{onkeydown:c=>this.keydown(c),class:"cm-search"},[this.searchField,d("next",()=>Cn(o),[qe(o,"next")]),d("prev",()=>Gn(o),[qe(o,"previous")]),d("select",()=>Lp(o),[qe(o,"all")]),Ye("label",null,[this.caseField,qe(o,"match case")]),Ye("label",null,[this.reField,qe(o,"regexp")]),Ye("label",null,[this.wordField,qe(o,"by word")]),...o.state.readOnly?[]:[Ye("br"),this.replaceField,d("replace",()=>md(o),[qe(o,"replace")]),d("replaceAll",()=>Rp(o),[qe(o,"replace all")])],Ye("button",{name:"close",onclick:()=>Dd(o),"aria-label":qe(o,"close"),type:"button"},["\xD7"])])}commit(){let o=new xn({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});o.eq(this.query)||(this.query=o,this.view.dispatch({effects:Si.of(o)}))}keydown(o){va(this.view,o,"search-panel")?o.preventDefault():o.keyCode==13&&o.target==this.searchField?(o.preventDefault(),(o.shiftKey?Gn:Cn)(this.view)):o.keyCode==13&&o.target==this.replaceField&&(o.preventDefault(),md(this.view))}update(o){for(let a of o.transactions)for(let d of a.effects)d.is(Si)&&!d.value.eq(this.query)&&this.setQuery(d.value)}setQuery(o){this.query=o,this.searchField.value=o.search,this.replaceField.value=o.replace,this.caseField.checked=o.caseSensitive,this.reField.checked=o.regexp,this.wordField.checked=o.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(ni).top}};function qe(r,o){return r.state.phrase(o)}var mn=30,fn=/[\s\.,:;?!]/;function Qo(r,{from:o,to:a}){let d=r.state.doc.lineAt(o),c=r.state.doc.lineAt(a).to,h=Math.max(d.from,o-mn),v=Math.min(c,a+mn),m=r.state.sliceDoc(h,v);if(h!=d.from){for(let w=0;w<mn;w++)if(!fn.test(m[w+1])&&fn.test(m[w])){m=m.slice(w);break}}if(v!=c){for(let w=m.length-1;w>m.length-mn;w--)if(!fn.test(m[w-1])&&fn.test(m[w])){m=m.slice(0,w);break}}return ce.announce.of(`${r.state.phrase("current match")}. ${m} ${r.state.phrase("on line")} ${d.number}.`)}var $p=ce.baseTheme({".cm-panel.cm-search":{padding:"2px 6px 4px",position:"relative","& [name=close]":{position:"absolute",top:"0",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",padding:0,margin:0},"& input, & button, & label":{margin:".2em .6em .2em 0"},"& input[type=checkbox]":{marginRight:".2em"},"& label":{fontSize:"80%",whiteSpace:"pre"}},"&light .cm-searchMatch":{backgroundColor:"#ffff0054"},"&dark .cm-searchMatch":{backgroundColor:"#00ffff8a"},"&light .cm-searchMatch-selected":{backgroundColor:"#ff6a0054"},"&dark .cm-searchMatch-selected":{backgroundColor:"#ff00ff8a"}}),Np=[Gt,$t.low(Mp),$p];var Vp="#e5c07b",Sd="#e06c75",Wp="#56b6c2",Hp="#ffffff",Pn="#abb2bf",tr="#7d8799",Bp="#61afef",Fp="#98c379",Cd="#d19a66",Up="#c678dd",Yp="#21252b",Gd="#2c313a",Pd="#282c34",er="#353a42",qp="#3E4451",zd="#528bff";var jp=ce.theme({"&":{color:Pn,backgroundColor:Pd},".cm-content":{caretColor:zd},".cm-cursor, .cm-dropCursor":{borderLeftColor:zd},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:qp},".cm-panels":{backgroundColor:Yp,color:Pn},".cm-panels.cm-panels-top":{borderBottom:"2px solid black"},".cm-panels.cm-panels-bottom":{borderTop:"2px solid black"},".cm-searchMatch":{backgroundColor:"#72a1ff59",outline:"1px solid #457dff"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"#6199ff2f"},".cm-activeLine":{backgroundColor:"#6699ff0b"},".cm-selectionMatch":{backgroundColor:"#aafe661a"},"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bad0f847"},".cm-gutters":{backgroundColor:Pd,color:tr,border:"none"},".cm-activeLineGutter":{backgroundColor:Gd},".cm-foldPlaceholder":{backgroundColor:"transparent",border:"none",color:"#ddd"},".cm-tooltip":{border:"none",backgroundColor:er},".cm-tooltip .cm-tooltip-arrow:before":{borderTopColor:"transparent",borderBottomColor:"transparent"},".cm-tooltip .cm-tooltip-arrow:after":{borderTopColor:er,borderBottomColor:er},".cm-tooltip-autocomplete":{"& > ul > li[aria-selected]":{backgroundColor:Gd,color:Pn}}},{dark:!0}),Kp=Ga.define([{tag:ne.keyword,color:Up},{tag:[ne.name,ne.deleted,ne.character,ne.propertyName,ne.macroName],color:Sd},{tag:[ne.function(ne.variableName),ne.labelName],color:Bp},{tag:[ne.color,ne.constant(ne.name),ne.standard(ne.name)],color:Cd},{tag:[ne.definition(ne.name),ne.separator],color:Pn},{tag:[ne.typeName,ne.className,ne.number,ne.changed,ne.annotation,ne.modifier,ne.self,ne.namespace],color:Vp},{tag:[ne.operator,ne.operatorKeyword,ne.url,ne.escape,ne.regexp,ne.link,ne.special(ne.string)],color:Wp},{tag:[ne.meta,ne.comment],color:tr},{tag:ne.strong,fontWeight:"bold"},{tag:ne.emphasis,fontStyle:"italic"},{tag:ne.strikethrough,textDecoration:"line-through"},{tag:ne.link,color:tr,textDecoration:"underline"},{tag:ne.heading,fontWeight:"bold",color:Sd},{tag:[ne.atom,ne.bool,ne.special(ne.variableName)],color:Cd},{tag:[ne.processingInstruction,ne.string,ne.inserted],color:Fp},{tag:ne.invalid,color:Hp}]),Td=[jp,yi(Kp)];var tt=class extends Error{constructor(a,d){super(d);this.status=a}},ut=location.pathname.replace(/\/files(\/.*)?$/,"");async function zt(r){let o=await fetch(ut+r),a=await o.json().catch(()=>({error:o.statusText}));if(!o.ok)throw new tt(o.status,a.error??o.statusText);return a}var ht=r=>encodeURIComponent(r),it={info:()=>zt("/api/info"),roots:()=>zt("/api/files/roots"),list:(r,o=0)=>zt(`/api/files/list?path=${ht(r)}&cursor=${o}`),stat:r=>zt(`/api/files/stat?path=${ht(r)}`),render:r=>zt(`/api/files/render?path=${ht(r)}`)},ir="",Ad=r=>ir=r,Ed=!1,Id=r=>Ed=r,Bt=()=>ir!==""||Ed,Tt={list:()=>zt("/api/reviews"),get:r=>zt(`/api/reviews/${ht(r)}`),file:(r,o,a=!1,d)=>zt(`/api/reviews/${ht(r)}/file?path=${ht(o.path)}${o.old?`&old=${ht(o.old)}`:""}${a?"&work=true":""}${d?`&from=${ht(d.from)}&to=${ht(d.to)}`:""}`),async write(r,o,a,d){let c=await fetch(`${ut}/api/reviews/${ht(r)}/${o}`,{method:"POST",headers:{"content-type":"application/json","x-yajna-token":ir},body:JSON.stringify({version:a,...d})}),h=await c.json().catch(()=>({error:c.statusText}));if(!c.ok)throw new tt(c.status,h.error??c.statusText);return h}},mt=r=>`${ut}/api/files/raw?path=${ht(r)}`;async function zn(r,o){let a=o?{Range:`bytes=0-${o-1}`}:{},d=await fetch(mt(r),{headers:a});if(!d.ok&&d.status!==206){let c=await d.json().catch(()=>({error:d.statusText}));throw new tt(d.status,c.error??d.statusText)}return d.arrayBuffer()}function pt(r){if(r===void 0)return"";let o=["B","KB","MB","GB","TB"],a=0,d=r;for(;d>=1024&&a<o.length-1;)d/=1024,a++;return a===0?`${r} B`:`${d.toFixed(d<10?1:0)} ${o[a]}`}function oi(r){if(r===void 0)return"";let o=new Date(r),a=d=>String(d).padStart(2,"0");return`${o.getFullYear()}-${a(o.getMonth()+1)}-${a(o.getDate())} ${a(o.getHours())}:${a(o.getMinutes())}`}var ri=r=>r.slice(r.lastIndexOf("/")+1),Md=r=>r.slice(0,Math.max(0,r.lastIndexOf("/")));function nr(r,o){let a=r.split("/");for(let d of o.split("/"))if(!(d===""||d==="."))if(d===".."){if(a.length<=1)return null;a.pop()}else a.push(d);return a.join("/")}var or=[];function je(r){or.push(r)}function Ld(r){return or.reduce((o,a)=>a.score(r)>o.score(r)?a:o)}function Od(r){return or.find(o=>o.name===r)}function yt(r,o){let a=document.createElement("div");a.className="yv-toolbar";for(let[d,c]of o){let h=document.createElement("button");h.textContent=d,h.addEventListener("click",c),a.append(h)}return r.append(a),a}function Tn(r,o){let a=document.createElement("div");a.className="yv-message",a.textContent=o,r.append(a)}var Jp=20<<20,Xp=/\.(log|out|err|jsonl)$/i,Rd=262144,At=r=>r().then(o=>Ta.define(o));function sr(r){let o=r.toLowerCase();if(o==="dockerfile")return At(()=>import("./chunks/dockerfile-TDCXA4IX.js").then(d=>d.dockerFile));if(o==="makefile"||o==="justfile")return At(()=>import("./chunks/shell-HLB6RCIG.js").then(d=>d.shell));switch(o.includes(".")?o.slice(o.lastIndexOf(".")+1):""){case"js":case"mjs":case"cjs":return import("./chunks/dist-YE4AEP22.js").then(d=>d.javascript());case"jsx":return import("./chunks/dist-YE4AEP22.js").then(d=>d.javascript({jsx:!0}));case"ts":case"mts":return import("./chunks/dist-YE4AEP22.js").then(d=>d.javascript({typescript:!0}));case"tsx":return import("./chunks/dist-YE4AEP22.js").then(d=>d.javascript({typescript:!0,jsx:!0}));case"py":case"pyi":return import("./chunks/dist-BV4HXKYH.js").then(d=>d.python());case"rs":return import("./chunks/dist-D4NV6QXD.js").then(d=>d.rust());case"md":case"markdown":return import("./chunks/dist-AKSF6TDI.js").then(d=>d.markdown());case"json":case"jsonl":case"ipynb":case"geojson":return import("./chunks/dist-KWLPF5KA.js").then(d=>d.json());case"html":case"htm":return import("./chunks/dist-L4JFAPNW.js").then(d=>d.html());case"css":return import("./chunks/dist-NDBJBCXG.js").then(d=>d.css());case"yaml":case"yml":return import("./chunks/dist-NQGHKK4K.js").then(d=>d.yaml());case"xml":case"svg":case"kml":return import("./chunks/dist-RS2XUQEW.js").then(d=>d.xml());case"sql":return import("./chunks/dist-2UKQMOYA.js").then(d=>d.sql());case"c":case"h":case"cc":case"cpp":case"cxx":case"hpp":case"cu":case"ino":return import("./chunks/dist-Y6BKZC7F.js").then(d=>d.cpp());case"java":case"kt":case"kts":return import("./chunks/dist-RMM3FGGV.js").then(d=>d.java());case"go":return import("./chunks/dist-K4WIMV6T.js").then(d=>d.go());case"sh":case"bash":case"zsh":case"envrc":return At(()=>import("./chunks/shell-HLB6RCIG.js").then(d=>d.shell));case"toml":case"lock":return At(()=>import("./chunks/toml-2FIUC2XM.js").then(d=>d.toml));case"r":return At(()=>import("./chunks/r-QSW6TDDB.js").then(d=>d.r));case"jl":return At(()=>import("./chunks/julia-AO5DTZHL.js").then(d=>d.julia));case"diff":case"patch":return At(()=>import("./chunks/diff-4PD2G225.js").then(d=>d.diff));case"ini":case"cfg":case"conf":case"properties":return At(()=>import("./chunks/properties-2P7YL4U6.js").then(d=>d.properties));default:return Promise.resolve(null)}}var rr=window.matchMedia("(prefers-color-scheme: dark)"),An=()=>rr.matches?Td:yi(Ro,{fallback:!0}),Zp={name:"text",score:r=>r.text?2:0,async mount(r,o){let a=o.stat.size??0,d=a>Jp,c=await zn(o.path,d?Rd:void 0),h=new TextDecoder,v=h.decode(c,{stream:!0}),m=c.byteLength,w=a,x=ri(o.path);/\.(md|markdown)$/i.test(x)&&yt(r,[["Preview",()=>o.switchTo("markdown")]]),d&&Tn(r,`Showing the first ${pt(Rd)} of ${pt(a)}; larger files get a paged view later.`);let S=new Nt,P=await sr(x).catch(()=>null),z="Ln 1, Col 1",L=new ce({parent:r,state:gt.create({doc:v,extensions:[gt.readOnly.of(!0),Qt({domEventHandlers:{mousedown(R,U,F){let J=R.state.doc.lineAt(U.from).number,A=F.shiftKey?R.state.doc.lineAt(R.state.selection.main.anchor).number:J;return V(R,Math.min(A,J),Math.max(A,J)),!0}}}),ya(),ga(),Ca(),sn(),ma(),za(),wd(),S.of(An()),yi(Ro,{fallback:!0}),P??[],pa.of([...pd,...kd,...Sa]),ce.updateListener.of(R=>{if(!R.selectionSet)return;let U=R.state.selection.main.head,F=R.state.doc.lineAt(U);z=`Ln ${F.number}, Col ${U-F.from+1}`,o.onStatus()}),ce.theme({"&":{height:"100%"},".cm-scroller":{overflow:"auto"}})]})});function V(R,U,F){let J=R.state.doc,A=J.line(Math.max(1,Math.min(U,J.lines))),te=J.line(Math.max(1,Math.min(F,J.lines)));R.dispatch({selection:{anchor:A.from,head:te.to},scrollIntoView:!0}),o.onLines(A.number,te.number)}let H=()=>{let R=L.scrollDOM;return R.scrollTop+R.clientHeight>=R.scrollHeight-4},N=()=>L.dispatch({effects:ce.scrollIntoView(L.state.doc.length,{y:"end"})}),G=Xp.test(x)&&!d;G&&requestAnimationFrame(N);let O=0;for(let R of["wheel","pointerdown","keydown","touchstart"])L.scrollDOM.addEventListener(R,()=>O=Date.now(),{passive:!0});L.scrollDOM.addEventListener("scroll",()=>{if(Date.now()-O>1e3)return;let R=H();R!==G&&(G=R,o.onStatus())});let ye=()=>L.dispatch({effects:S.reconfigure(An())});return rr.addEventListener("change",ye),{dispose(){rr.removeEventListener("change",ye),L.destroy()},status:()=>`${z} \xB7 ${L.state.doc.lines} lines${d?` (first part of ${pt(w)})`:""}${!d&&G?" \xB7 following":""}`,async follow(R){let U=R.size??0;if(d)return w=U,!0;if(U<=m)return!1;let F=await fetch(mt(o.path),{headers:{Range:`bytes=${m}-${U-1}`}});if(F.status!==206)return!1;let J=new Uint8Array(await F.arrayBuffer()),A=G||H();return L.dispatch({changes:{from:L.state.doc.length,insert:h.decode(J,{stream:!0})}}),m+=J.byteLength,w=m,A&&(G=!0,N()),!0},reveal(R,U=R){let F=L.state.doc,J=F.line(Math.max(1,Math.min(R,F.lines))),A=F.line(Math.max(1,Math.min(U,F.lines)));L.dispatch({selection:{anchor:J.from,head:A.to},effects:ce.scrollIntoView(J.from,{y:"center"})})}}}};je(Zp);var Qp=/^[\w@.-]+\.html(#.*)?$/,$d=/^[a-z][a-z0-9+.-]*:/i;function Nd(r,o){let a=Md(o.path);for(let d of r.querySelectorAll("a[href]")){let c=d.getAttribute("href")??"";if(c.startsWith("#"))continue;if($d.test(c)){/^(https?|mailto):/i.test(c)?(d.setAttribute("target","_blank"),d.setAttribute("rel","noopener")):d.removeAttribute("href");continue}if(Qp.test(c)&&!c.includes("/")){d.setAttribute("href",`/${c}`),d.setAttribute("target","_blank");continue}let h=nr(a,decodeURIComponent(c.split("#")[0]));if(h===null){d.removeAttribute("href");continue}d.setAttribute("href",`#${h}`),d.addEventListener("click",v=>{v.preventDefault(),o.open(h)})}for(let d of r.querySelectorAll("img[src]")){let c=d.getAttribute("src")??"";if($d.test(c)||c.startsWith("/"))continue;let h=nr(a,decodeURIComponent(c));h===null?d.replaceWith(d.getAttribute("alt")??c):d.setAttribute("src",mt(h))}}je({name:"markdown",score:r=>r.text&&/\.(md|markdown)$/i.test(r.path)&&(r.size??0)<=4<<20?3:0,async mount(r,o){let a=await it.render(o.path),d=yt(r,[["Source",()=>o.switchTo("text")]]);if(a.id){let v=document.createElement("a");v.href=`/${a.id}.html`,v.target="_blank",v.textContent=`${a.id}${a.title?` \xB7 ${a.title}`:""} \u2192 page`,d.prepend(v)}let c=document.createElement("div");c.className="yv-scroll";let h=document.createElement("article");return h.className="yv-markdown",h.innerHTML=a.html,Nd(h,o),c.append(h),r.append(c),{status:()=>a.id?`page ${a.id}`:"markdown",async follow(){let v=await it.render(o.path),m=c.scrollTop;return h.innerHTML=v.html,Nd(h,o),c.scrollTop=m,!0}}}});var ev=/^image\/(png|jpeg|gif|webp|avif|bmp|x-icon|svg\+xml)$/,tv=40;je({name:"image",score:r=>ev.test(r.mime)?3:0,async mount(r,o){let a=document.createElement("div");a.className="yv-image";let d=document.createElement("img");d.alt=o.path,d.draggable=!1,d.src=`${mt(o.path)}&t=${o.stat.mtime??0}`,a.append(d);let c=yt(r,[]);r.append(a),await d.decode().catch(()=>{});let h=1,v=0,m=0,w=!0,x=()=>({w:a.clientWidth,h:a.clientHeight,nw:d.naturalWidth||1,nh:d.naturalHeight||1}),S=()=>{let{w:R,h:U,nw:F,nh:J}=x();return Math.min(1,R/F,U/J)};function P(){let{w:R,h:U,nw:F,nh:J}=x(),A=F*h,te=J*h;v=A<=R?(R-A)/2:Math.min(0,Math.max(R-A,v)),m=te<=U?(U-te)/2:Math.min(0,Math.max(U-te,m)),d.style.transform=`translate(${v}px, ${m}px) scale(${h})`,o.onStatus()}function z(R,U,F){let J=Math.min(tv,Math.max(S()/4,R));v=U-(U-v)*J/h,m=F-(F-m)*J/h,h=J,w=!1,P()}function L(){h=S(),w=!0,P()}let V=R=>{let U=a.getBoundingClientRect();return[R.clientX-U.left,R.clientY-U.top]};a.addEventListener("wheel",R=>{R.preventDefault();let U=R.deltaMode===1?16:R.deltaMode===2?a.clientHeight:1,F=Math.exp(-R.deltaY*U*(R.ctrlKey?.01:.002)),[J,A]=V(R);z(h*F,J,A)},{passive:!1});let H=new Map,N=null,G=()=>{let[R,U]=[...H.values()];return{d:Math.hypot(R.x-U.x,R.y-U.y),mx:(R.x+U.x)/2,my:(R.y+U.y)/2}};a.addEventListener("pointerdown",R=>{a.setPointerCapture(R.pointerId);let[U,F]=V(R);H.set(R.pointerId,{x:U,y:F}),H.size===2&&(N={d:G().d||1,s:h}),a.classList.add("yv-dragging")}),a.addEventListener("pointermove",R=>{let U=H.get(R.pointerId);if(!U)return;let[F,J]=V(R);if(H.set(R.pointerId,{x:F,y:J}),N&&H.size===2){let{d:A,mx:te,my:ke}=G();z(N.s*A/N.d,te,ke)}else H.size===1&&(v+=F-U.x,m+=J-U.y,P())});let O=R=>{H.delete(R.pointerId),H.size<2&&(N=null),H.size||a.classList.remove("yv-dragging")};a.addEventListener("pointerup",O),a.addEventListener("pointercancel",O),a.addEventListener("dblclick",R=>{let[U,F]=V(R);w&&S()<1?z(1,U,F):L()});let ye=new ResizeObserver(()=>w?L():P());ye.observe(a);for(let[R,U]of[["Fit",L],["1:1",()=>z(1,a.clientWidth/2,a.clientHeight/2)]]){let F=document.createElement("button");F.textContent=R,F.addEventListener("click",U),c.append(F)}return L(),{dispose:()=>ye.disconnect(),async follow(R){let[U,F]=[d.naturalWidth,d.naturalHeight];return d.src=`${mt(o.path)}&t=${R.mtime??Date.now()}`,await d.decode().catch(()=>{}),w||U!==d.naturalWidth||F!==d.naturalHeight?L():P(),!0},status:()=>`${d.naturalWidth}\xD7${d.naturalHeight} \xB7 ${Math.round(h*100)}%`}}});var iv=65536;je({name:"binary",score:()=>1,async mount(r,o){let a=yt(r,[["Open as text",()=>o.switchTo("text")],["Open as hex",()=>o.switchTo("hex")]]),d=document.createElement("a");d.href=mt(o.path),d.download=ri(o.path),d.textContent="Download",a.append(d);let c=document.createElement("table");c.className="yv-meta";let h=[["path",o.path],["size",`${pt(o.stat.size)} (${o.stat.size??0} bytes)`],["modified",oi(o.stat.mtime)],["type",o.stat.mime]];o.stat.link&&h.push(["symlink to",o.stat.link]);for(let[v,m]of h){let w=c.insertRow();w.insertCell().textContent=v,w.insertCell().textContent=m}return r.append(c),{status:()=>o.stat.mime}}});je({name:"hex",score:()=>0,async mount(r,o){let a=new Uint8Array(await zn(o.path,iv)),d=[];for(let v=0;v<a.length;v+=16){let m=a.subarray(v,v+16),w=Array.from(m,S=>S.toString(16).padStart(2,"0")).join(" "),x=Array.from(m,S=>S>=32&&S<127?String.fromCharCode(S):".").join("");d.push(`${v.toString(16).padStart(8,"0")}  ${w.padEnd(47)}  ${x}`)}yt(r,[["Back",()=>o.switchTo("binary")]]);let c=document.createElement("pre");c.className="yv-hex",c.textContent=d.join(`
`),r.append(c);let h=a.length<(o.stat.size??0)?` (first ${pt(a.length)})`:"";return{status:()=>`hex${h}`}}});var Ge=class r{constructor(o,a,d,c){this.fromA=o,this.toA=a,this.fromB=d,this.toB=c}offset(o,a=o){return new r(this.fromA+o,this.toA+o,this.fromB+a,this.toB+a)}};function Ut(r,o,a,d,c,h){if(r==d)return[];let v=mr(r,o,a,d,c,h),m=fr(r,o+v,a,d,c+v,h);o+=v,a-=m,c+=v,h-=m;let w=a-o,x=h-c;if(!w||!x)return[new Ge(o,a,c,h)];if(w>x){let P=r.slice(o,a).indexOf(d.slice(c,h));if(P>-1)return[new Ge(o,o+P,c,c),new Ge(o+P+x,a,h,h)]}else if(x>w){let P=d.slice(c,h).indexOf(r.slice(o,a));if(P>-1)return[new Ge(o,o,c,c+P),new Ge(a,a,c+P+w,h)]}if(w==1||x==1)return[new Ge(o,a,c,h)];let S=sl(r,o,a,d,c,h);if(S){let[P,z,L]=S;return Ut(r,o,P,d,c,z).concat(Ut(r,P+L,a,d,z+L,h))}return nv(r,o,a,d,c,h)}var Gi=1e9,Pi=0,gr=!1;function nv(r,o,a,d,c,h){let v=a-o,m=h-c;if(Gi<1e9&&Math.min(v,m)>Gi*16||Pi>0&&Date.now()>Pi)return Math.min(v,m)>Gi*64?[new Ge(o,a,c,h)]:Vd(r,o,a,d,c,h);let w=Math.ceil((v+m)/2);ar.reset(w),dr.reset(w);let x=(L,V)=>r.charCodeAt(o+L)==d.charCodeAt(c+V),S=(L,V)=>r.charCodeAt(a-L-1)==d.charCodeAt(h-V-1),P=(v-m)%2!=0?dr:null,z=P?null:ar;for(let L=0;L<w;L++){if(L>Gi||Pi>0&&!(L&63)&&Date.now()>Pi)return Vd(r,o,a,d,c,h);let V=ar.advance(L,v,m,w,P,!1,x)||dr.advance(L,v,m,w,z,!0,S);if(V)return ov(r,o,a,o+V[0],d,c,h,c+V[1])}return[new Ge(o,a,c,h)]}var On=class{constructor(){this.vec=[]}reset(o){this.len=o<<1;for(let a=0;a<this.len;a++)this.vec[a]=-1;this.vec[o+1]=0,this.start=this.end=0}advance(o,a,d,c,h,v,m){for(let w=-o+this.start;w<=o-this.end;w+=2){let x=c+w,S=w==-o||w!=o&&this.vec[x-1]<this.vec[x+1]?this.vec[x+1]:this.vec[x-1]+1,P=S-w;for(;S<a&&P<d&&m(S,P);)S++,P++;if(this.vec[x]=S,S>a)this.end+=2;else if(P>d)this.start+=2;else if(h){let z=c+(a-d)-w;if(z>=0&&z<this.len&&h.vec[z]!=-1)if(v){let L=h.vec[z];if(L>=a-S)return[L,c+L-z]}else{let L=a-h.vec[z];if(S>=L)return[S,P]}}}return null}},ar=new On,dr=new On;function ov(r,o,a,d,c,h,v,m){let w=!1;return!ai(r,d)&&++d==a&&(w=!0),!ai(c,m)&&++m==v&&(w=!0),w?[new Ge(o,a,h,v)]:Ut(r,o,d,c,h,m).concat(Ut(r,d,a,c,m,v))}function rl(r,o){let a=1,d=Math.min(r,o);for(;a<d;)a=a<<1;return a}function mr(r,o,a,d,c,h){if(o==a||o==h||r.charCodeAt(o)!=d.charCodeAt(c))return 0;let v=rl(a-o,h-c);for(let m=o,w=c;;){let x=m+v,S=w+v;if(x>a||S>h||r.slice(m,x)!=d.slice(w,S)){if(v==1)return m-o-(ai(r,m)?0:1);v=v>>1}else{if(x==a||S==h)return x-o;m=x,w=S}}}function fr(r,o,a,d,c,h){if(o==a||c==h||r.charCodeAt(a-1)!=d.charCodeAt(h-1))return 0;let v=rl(a-o,h-c);for(let m=a,w=h;;){let x=m-v,S=w-v;if(x<o||S<c||r.slice(x,m)!=d.slice(S,w)){if(v==1)return a-m-(ai(r,m)?0:1);v=v>>1}else{if(x==o||S==c)return a-x;m=x,w=S}}}function lr(r,o,a,d,c,h,v,m){let w=d.slice(c,h),x=null;for(;;){if(x||v<m)return x;for(let S=o+v;;){ai(r,S)||S++;let P=S+v;if(ai(r,P)||(P+=P==S+1?1:-1),P>=a)break;let z=r.slice(S,P),L=-1;for(;(L=w.indexOf(z,L+1))!=-1;){let V=mr(r,P,a,d,c+L+z.length,h),H=fr(r,o,S,d,c,c+L),N=z.length+V+H;(!x||x[2]<N)&&(x=[S-H,c+L-H,N])}S=P}if(m<0)return x;v=v>>1}}function sl(r,o,a,d,c,h){let v=a-o,m=h-c;if(v<m){let w=sl(d,c,h,r,o,a);return w&&[w[1],w[0],w[2]]}return v<4||m*2<v?null:lr(r,o,a,d,c,h,Math.floor(v/4),-1)}function Vd(r,o,a,d,c,h){gr=!0;let v=a-o,m=h-c,w;if(v<m){let z=lr(d,c,h,r,o,a,Math.floor(v/6),50);w=z&&[z[1],z[0],z[2]]}else w=lr(r,o,a,d,c,h,Math.floor(m/6),50);if(!w)return[new Ge(o,a,c,h)];let[x,S,P]=w;return Ut(r,o,x,d,c,S).concat(Ut(r,x+P,a,d,S+P,h))}function al(r,o){for(let a=1;a<r.length;a++){let d=r[a-1],c=r[a];d.toA>c.fromA-o&&d.toB>c.fromB-o&&(r[a-1]=new Ge(d.fromA,c.toA,d.fromB,c.toB),r.splice(a--,1))}}function rv(r,o,a){for(;;){al(a,1);let d=!1;for(let c=0;c<a.length;c++){let h=a[c],v,m;(v=mr(r,h.fromA,h.toA,o,h.fromB,h.toB))&&(h=a[c]=new Ge(h.fromA+v,h.toA,h.fromB+v,h.toB)),(m=fr(r,h.fromA,h.toA,o,h.fromB,h.toB))&&(h=a[c]=new Ge(h.fromA,h.toA-m,h.fromB,h.toB-m));let w=h.toA-h.fromA,x=h.toB-h.fromB;if(w&&x)continue;let S=h.fromA-(c?a[c-1].toA:0),P=(c<a.length-1?a[c+1].fromA:r.length)-h.toA;if(!S||!P)continue;let z=w?r.slice(h.fromA,h.toA):o.slice(h.fromB,h.toB);S<=z.length&&r.slice(h.fromA-S,h.fromA)==z.slice(z.length-S)?(a[c]=new Ge(h.fromA-S,h.toA-S,h.fromB-S,h.toB-S),d=!0):P<=z.length&&r.slice(h.toA,h.toA+P)==z.slice(0,P)&&(a[c]=new Ge(h.fromA+P,h.toA+P,h.fromB+P,h.toB+P),d=!0)}if(!d)break}return a}function sv(r,o,a){for(let d=0,c=0;c<r.length;c++){let h=r[c],v=h.toA-h.fromA,m=h.toB-h.fromB;if(v&&m||v>3||m>3){let w=c==r.length-1?o.length:r[c+1].fromA,x=h.fromA-d,S=w-h.toA,P=Hd(o,h.fromA,x),z=Wd(o,h.toA,S),L=h.fromA-P,V=z-h.toA;if((!v||!m)&&L&&V){let H=Math.max(v,m),[N,G,O]=v?[o,h.fromA,h.toA]:[a,h.fromB,h.toB];H>L&&o.slice(P,h.fromA)==N.slice(O-L,O)?(h=r[c]=new Ge(P,P+v,h.fromB-L,h.toB-L),P=h.fromA,z=Wd(o,h.toA,w-h.toA)):H>V&&o.slice(h.toA,z)==N.slice(G,G+V)&&(h=r[c]=new Ge(z-v,z,h.fromB+V,h.toB+V),z=h.toA,P=Hd(o,h.fromA,h.fromA-d)),L=h.fromA-P,V=z-h.toA}if(L||V)h=r[c]=new Ge(h.fromA-L,h.toA+V,h.fromB-L,h.toB+V);else if(v){if(!m){let H=Fd(o,h.fromA,h.toA),N,G=H<0?-1:Bd(o,h.toA,h.fromA);H>-1&&(N=H-h.fromA)<=S&&o.slice(h.fromA,H)==o.slice(h.toA,h.toA+N)?h=r[c]=h.offset(N):G>-1&&(N=h.toA-G)<=x&&o.slice(h.fromA-N,h.fromA)==o.slice(G,h.toA)&&(h=r[c]=h.offset(-N))}}else{let H=Fd(a,h.fromB,h.toB),N,G=H<0?-1:Bd(a,h.toB,h.fromB);H>-1&&(N=H-h.fromB)<=S&&a.slice(h.fromB,H)==a.slice(h.toB,h.toB+N)?h=r[c]=h.offset(N):G>-1&&(N=h.toB-G)<=x&&a.slice(h.fromB-N,h.fromB)==a.slice(G,h.toB)&&(h=r[c]=h.offset(-N))}}d=h.toA}return al(r,3),r}var Ft;try{Ft=new RegExp("[\\p{Alphabetic}\\p{Number}]","u")}catch{}function dl(r){return r>48&&r<58||r>64&&r<91||r>96&&r<123}function ll(r,o){if(o==r.length)return 0;let a=r.charCodeAt(o);return a<192?dl(a)?1:0:Ft?!ul(a)||o==r.length-1?Ft.test(String.fromCharCode(a))?1:0:Ft.test(r.slice(o,o+2))?2:0:0}function cl(r,o){if(!o)return 0;let a=r.charCodeAt(o-1);return a<192?dl(a)?1:0:Ft?!pl(a)||o==1?Ft.test(String.fromCharCode(a))?1:0:Ft.test(r.slice(o-2,o))?2:0:0}var hl=8;function Wd(r,o,a){if(o==r.length||!cl(r,o))return o;for(let d=o,c=o+a,h=0;h<hl;h++){let v=ll(r,d);if(!v||d+v>c)return d;d+=v}return o}function Hd(r,o,a){if(!o||!ll(r,o))return o;for(let d=o,c=o-a,h=0;h<hl;h++){let v=cl(r,d);if(!v||d-v<c)return d;d-=v}return o}function Bd(r,o,a){for(;o!=a;o--)if(r.charCodeAt(o-1)==10)return o;return-1}function Fd(r,o,a){for(;o!=a;o++)if(r.charCodeAt(o)==10)return o;return-1}var ul=r=>r>=55296&&r<=56319,pl=r=>r>=56320&&r<=57343;function ai(r,o){return!o||o==r.length||!ul(r.charCodeAt(o-1))||!pl(r.charCodeAt(o))}function av(r,o,a){var d;let c=a?.override;return c?c(r,o):(Gi=((d=a?.scanLimit)!==null&&d!==void 0?d:1e9)>>1,Pi=a?.timeout?Date.now()+a.timeout:0,gr=!1,rv(r,o,Ut(r,0,r.length,o,0,o.length)))}function vl(){return!gr}function gl(r,o,a){return sv(av(r,o,a),r,o)}var $e=St.define({combine:r=>r[0]}),cr=Ie.define(),ml=St.define(),Oe=Ze.define({create(r){return null},update(r,o){for(let a of o.effects)a.is(cr)&&(r=a.value);for(let a of o.state.facet(ml))r=a(r,o);return r}});var xt=class r{constructor(o,a,d,c,h,v=!0){this.changes=o,this.fromA=a,this.toA=d,this.fromB=c,this.toB=h,this.precise=v}offset(o,a){return o||a?new r(this.changes,this.fromA+o,this.toA+o,this.fromB+a,this.toB+a,this.precise):this}get endA(){return Math.max(this.fromA,this.toA-1)}get endB(){return Math.max(this.fromB,this.toB-1)}static build(o,a,d){let c=gl(o.toString(),a.toString(),d);return fl(c,o,a,0,0,vl())}static updateA(o,a,d,c,h){return Kd(jd(o,c,!0,d.length),o,a,d,h)}static updateB(o,a,d,c,h){return Kd(jd(o,c,!1,a.length),o,a,d,h)}};function Ud(r,o,a,d){let c=a.lineAt(r),h=d.lineAt(o);return c.to==r&&h.to==o&&r<a.length&&o<d.length?[r+1,o+1]:[c.from,h.from]}function Yd(r,o,a,d){let c=a.lineAt(r),h=d.lineAt(o);return c.from==r&&h.from==o?[r,o]:[c.to+1,h.to+1]}function fl(r,o,a,d,c,h){let v=[];for(let m=0;m<r.length;m++){let w=r[m],[x,S]=Ud(w.fromA+d,w.fromB+c,o,a),[P,z]=Yd(w.toA+d,w.toB+c,o,a),L=[w.offset(-x+d,-S+c)];for(;m<r.length-1;){let V=r[m+1],[H,N]=Ud(V.fromA+d,V.fromB+c,o,a);if(H>P+1&&N>z+1)break;L.push(V.offset(-x+d,-S+c)),[P,z]=Yd(V.toA+d,V.toB+c,o,a),m++}v.push(new xt(L,x,Math.max(x,P),S,Math.max(S,z),h))}return v}var En=1e3;function qd(r,o,a,d){let c=0,h=r.length;for(;;){if(c==h){let S=0,P=0;c&&({toA:S,toB:P}=r[c-1]);let z=o-(a?S:P);return[S+z,P+z]}let v=c+h>>1,m=r[v],[w,x]=a?[m.fromA,m.toA]:[m.fromB,m.toB];if(w>o)h=v;else if(x<=o)c=v+1;else return d?[m.fromA,m.fromB]:[m.toA,m.toB]}}function jd(r,o,a,d){let c=[];return o.iterChangedRanges((h,v,m,w)=>{let x=0,S=a?o.length:d,P=0,z=a?d:o.length;h>En&&([x,P]=qd(r,h-En,a,!0)),v<o.length-En&&([S,z]=qd(r,v+En,a,!1));let L=w-m-(v-h),V,[H,N]=a?[L,0]:[0,L];c.length&&(V=c[c.length-1]).toA>=x?c[c.length-1]={fromA:V.fromA,fromB:V.fromB,toA:S,toB:z,diffA:V.diffA+H,diffB:V.diffB+N}:c.push({fromA:x,toA:S,fromB:P,toB:z,diffA:H,diffB:N})}),c}function Kd(r,o,a,d,c){if(!r.length)return o;let h=[];for(let v=0,m=0,w=0,x=0;;v++){let S=v==r.length?null:r[v],P=S?S.fromA+m:a.length,z=S?S.fromB+w:d.length;for(;x<o.length;){let N=o[x];if(S&&(N.toA+m>P||N.toB+w>z))break;h.push(N.offset(m,w)),x++}if(!S)break;let L=S.toA+m+S.diffA,V=S.toB+w+S.diffB,H=gl(a.sliceString(P,L),d.sliceString(z,V),c);for(let N of fl(H,a,d,P,z,vl()))h.push(N);for(m+=S.diffA,w+=S.diffB;x<o.length;){let N=o[x];if(N.fromA+m>L&&N.fromB+w>V)break;x++}}return h}var bl={scanLimit:500},Vn=wi.fromClass(class{constructor(r){({deco:this.deco,gutter:this.gutter}=Zd(r))}update(r){(r.docChanged||r.viewportChanged||dv(r.startState,r.state)||lv(r.startState,r.state))&&({deco:this.deco,gutter:this.gutter}=Zd(r.view))}},{decorations:r=>r.deco}),In=$t.low(Mo({class:"cm-changeGutter",markers:r=>{var o;return((o=r.plugin(Vn))===null||o===void 0?void 0:o.gutter)||Eo.empty}}));function dv(r,o){return r.field(Oe,!1)!=o.field(Oe,!1)}function lv(r,o){return r.facet($e)!=o.facet($e)}var Jd=be.line({class:"cm-changedLine"}),wl=be.mark({class:"cm-changedText"}),cv=be.mark({tagName:"ins",class:"cm-insertedLine"}),hv=be.mark({tagName:"del",class:"cm-deletedLine"}),Xd=new class extends an{constructor(){super(...arguments),this.elementClass="cm-changedLineGutter"}};function uv(r,o,a,d,c,h){let v=a?r.fromA:r.fromB,m=a?r.toA:r.toB,w=0;if(v!=m){c.add(v,v,Jd),c.add(v,m,a?hv:cv),h&&h.add(v,v,Xd);for(let x=o.iterRange(v,m-1),S=v;!x.next().done;){if(x.lineBreak){S++,c.add(S,S,Jd),h&&h.add(S,S,Xd);continue}let P=S+x.value.length;if(d)for(;w<r.changes.length;){let z=r.changes[w],L=v+(a?z.fromA:z.fromB),V=v+(a?z.toA:z.toB),H=Math.max(S,L),N=Math.min(P,V);if(H<N&&c.add(H,N,wl),V<P)w++;else break}S=P}}}function Zd(r){let o=r.state.field(Oe),{side:a,highlightChanges:d,markGutter:c,overrideChunk:h}=r.state.facet($e),v=a=="a",m=new _t,w=c?new _t:null,{from:x,to:S}=r.viewport;for(let P of o){if((v?P.fromA:P.fromB)>=S)break;(v?P.toA:P.toB)>x&&(!h||!h(r.state,P,m,w))&&uv(P,r.state.doc,v,d,m,w)}return{deco:m.finish(),gutter:w&&w.finish()}}var si=class extends Vt{constructor(o){super(),this.height=o}eq(o){return this.height==o.height}toDOM(){let o=document.createElement("div");return o.className="cm-mergeSpacer",o.style.height=this.height+"px",o}updateDOM(o){return o.style.height=this.height+"px",!0}get estimatedHeight(){return this.height}ignoreEvent(){return!1}},Rn=Ie.define({map:(r,o)=>r.map(o)}),zi=Ze.define({create:()=>be.none,update:(r,o)=>{for(let a of o.effects)if(a.is(Rn))return a.value;return r.map(o.changes)},provide:r=>ce.decorations.from(r)}),Mn=.01;function Qd(r,o){if(r.size!=o.size)return!1;let a=r.iter(),d=o.iter();for(;a.value;){if(a.from!=d.from||Math.abs(a.value.spec.widget.height-d.value.spec.widget.height)>1)return!1;a.next(),d.next()}return!0}function pv(r,o,a){let d=new _t,c=new _t,h=r.state.field(zi).iter(),v=o.state.field(zi).iter(),m=0,w=0,x=0,S=0,P=r.viewport,z=o.viewport;for(let N=0;;N++){let G=N<a.length?a[N]:null,O=G?G.fromA:r.state.doc.length,ye=G?G.fromB:o.state.doc.length;if(m<O){let R=r.lineBlockAt(m).top+x,U=o.lineBlockAt(w).top+S,F=R-U;F<-Mn?(x-=F,d.add(m,m,be.widget({widget:new si(-F),block:!0,side:-1}))):F>Mn&&(S+=F,c.add(w,w,be.widget({widget:new si(F),block:!0,side:-1})))}if(O>m+1e3&&m<P.from&&O>P.from&&w<z.from&&ye>z.from){let R=Math.min(P.from-m,z.from-w);m+=R,w+=R,N--}else if(G)m=G.toA,w=G.toB;else break;for(;h.value&&h.from<m;)x-=h.value.spec.widget.height,h.next();for(;v.value&&v.from<w;)S-=v.value.spec.widget.height,v.next()}for(;h.value;)x-=h.value.spec.widget.height,h.next();for(;v.value;)S-=v.value.spec.widget.height,v.next();let L=r.contentHeight+x-(o.contentHeight+S);L<Mn?d.add(r.state.doc.length,r.state.doc.length,be.widget({widget:new si(-L),block:!0,side:1})):L>Mn&&c.add(o.state.doc.length,o.state.doc.length,be.widget({widget:new si(L),block:!0,side:1}));let V=d.finish(),H=c.finish();Qd(V,r.state.field(zi))||r.dispatch({effects:Rn.of(V)}),Qd(H,o.state.field(zi))||o.dispatch({effects:Rn.of(H)})}var hr=Ie.define({map:(r,o)=>o.mapPos(r)});var ur=class extends Vt{constructor(o){super(),this.lines=o}eq(o){return this.lines==o.lines}toDOM(o){let a=document.createElement("div");return a.className="cm-collapsedLines",a.textContent=o.state.phrase("$ unchanged lines",this.lines),a.addEventListener("click",d=>{let c=o.posAtDOM(d.target);o.dispatch({effects:hr.of(c)});let{side:h,sibling:v}=o.state.facet($e);v&&v().dispatch({effects:hr.of(vv(c,o.state.field(Oe),h=="a"))})}),a}ignoreEvent(o){return o instanceof MouseEvent}get estimatedHeight(){return 27}get type(){return"collapsed-unchanged-code"}};function vv(r,o,a){let d=0,c=0;for(let h=0;;h++){let v=h<o.length?o[h]:null;if(!v||(a?v.fromA:v.fromB)>=r)return c+(r-d);[d,c]=a?[v.toA,v.toB]:[v.toB,v.toA]}}var gv=Ze.define({create(r){return be.none},update(r,o){r=r.map(o.changes);for(let a of o.effects)a.is(hr)&&(r=r.update({filter:d=>d!=a.value}));if(r.size&&o.state.field(Oe)!=o.startState.field(Oe,!1)){let a=o.state.facet($e).side=="a",d=[];for(let c of o.state.field(Oe))r.between(a?c.fromA:c.fromB,a?c.toA:c.toB,h=>{d.push(h)});d.length&&(r=r.update({filter:c=>d.indexOf(c)<0}))}return r},provide:r=>ce.decorations.from(r)});function pr({margin:r=3,minSize:o=4}){return gv.init(a=>mv(a,r,o))}function mv(r,o,a){let d=new _t,c=r.facet($e).side=="a",h=r.field(Oe),v=1;for(let m=0;;m++){let w=m<h.length?h[m]:null,x=m?v+o:1,S=w?r.doc.lineAt(c?w.fromA:w.fromB).number-1-o:r.doc.lines,P=S-x+1;if(P>=a&&d.add(r.doc.line(x).from,r.doc.line(S).to,be.replace({widget:new ur(P),block:!0})),!w)break;v=r.doc.lineAt(Math.min(r.doc.length,c?w.toA:w.toB)).number}return d.finish()}var fv=ce.styleModule.of(new ha({".cm-mergeView":{overflowY:"auto"},".cm-mergeViewEditors":{display:"flex",alignItems:"stretch"},".cm-mergeViewEditor":{flexGrow:1,flexBasis:0,overflow:"hidden"},".cm-merge-revert":{width:"1.6em",flexGrow:0,flexShrink:0,position:"relative"},".cm-merge-revert button":{position:"absolute",display:"block",width:"100%",boxSizing:"border-box",textAlign:"center",background:"none",border:"none",font:"inherit",cursor:"pointer"}})),_l=ce.baseTheme({".cm-mergeView & .cm-scroller, .cm-mergeView &":{height:"auto !important",overflowY:"visible !important"},"&.cm-merge-a .cm-changedLine, .cm-deletedChunk":{backgroundColor:"rgba(160, 128, 100, .08)"},"&.cm-merge-b .cm-changedLine, .cm-inlineChangedLine":{backgroundColor:"rgba(100, 160, 128, .08)"},"&light.cm-merge-a .cm-changedText, &light .cm-deletedChunk .cm-deletedText":{background:"linear-gradient(#ee443366, #ee443366) bottom/100% 2px no-repeat"},"&dark.cm-merge-a .cm-changedText, &dark .cm-deletedChunk .cm-deletedText":{background:"linear-gradient(#ffaa9966, #ffaa9966) bottom/100% 2px no-repeat"},"&light.cm-merge-b .cm-changedText":{background:"linear-gradient(#22bb22aa, #22bb22aa) bottom/100% 2px no-repeat"},"&dark.cm-merge-b .cm-changedText":{background:"linear-gradient(#88ff88aa, #88ff88aa) bottom/100% 2px no-repeat"},"&.cm-merge-b .cm-deletedText":{background:"#ff000033"},".cm-insertedLine, .cm-deletedLine, .cm-deletedLine del":{textDecoration:"none"},".cm-deletedChunk":{paddingLeft:"6px","& .cm-chunkButtons":{position:"absolute",insetInlineEnd:"5px"},"& button":{border:"none",cursor:"pointer",color:"white",margin:"0 2px",borderRadius:"3px","&[name=accept]":{background:"#2a2"},"&[name=reject]":{background:"#d43"}}},".cm-collapsedLines":{padding:"5px 5px 5px 10px",cursor:"pointer","&:before":{content:'"\u299A"',marginInlineEnd:"7px"},"&:after":{content:'"\u299A"',marginInlineStart:"7px"}},"&light .cm-collapsedLines":{color:"#444",background:"linear-gradient(to bottom, transparent 0, #f3f3f3 30%, #f3f3f3 70%, transparent 100%)"},"&dark .cm-collapsedLines":{color:"#ddd",background:"linear-gradient(to bottom, transparent 0, #222 30%, #222 70%, transparent 100%)"},".cm-changeGutter":{width:"3px",paddingLeft:"1px"},"&light.cm-merge-a .cm-changedLineGutter, &light .cm-deletedLineGutter":{background:"#e43"},"&dark.cm-merge-a .cm-changedLineGutter, &dark .cm-deletedLineGutter":{background:"#fa9"},"&light.cm-merge-b .cm-changedLineGutter":{background:"#2b2"},"&dark.cm-merge-b .cm-changedLineGutter":{background:"#8f8"},".cm-inlineChangedLineGutter":{background:"#75d"}}),el=new Nt,Ln=new Nt,$n=class{constructor(o){this.revertDOM=null,this.revertToA=!1,this.revertToLeft=!1,this.measuring=-1,this.diffConf=o.diffConfig||bl;let a=[$t.low(Vn),_l,fv,zi,ce.updateListener.of(P=>{this.measuring<0&&(P.heightChanged||P.viewportChanged)&&!P.transactions.some(z=>z.effects.some(L=>L.is(Rn)))&&this.measure()})],d=[$e.of({side:"a",sibling:()=>this.b,highlightChanges:o.highlightChanges!==!1,markGutter:o.gutter!==!1})];o.gutter!==!1&&d.push(In);let c=gt.create({doc:o.a.doc,selection:o.a.selection,extensions:[o.a.extensions||[],ce.editorAttributes.of({class:"cm-merge-a"}),Ln.of(d),a]}),h=[$e.of({side:"b",sibling:()=>this.a,highlightChanges:o.highlightChanges!==!1,markGutter:o.gutter!==!1})];o.gutter!==!1&&h.push(In);let v=gt.create({doc:o.b.doc,selection:o.b.selection,extensions:[o.b.extensions||[],ce.editorAttributes.of({class:"cm-merge-b"}),Ln.of(h),a]});this.chunks=xt.build(c.doc,v.doc,this.diffConf);let m=[Oe.init(()=>this.chunks),el.of(o.collapseUnchanged?pr(o.collapseUnchanged):[])];c=c.update({effects:Ie.appendConfig.of(m)}).state,v=v.update({effects:Ie.appendConfig.of(m)}).state,this.dom=document.createElement("div"),this.dom.className="cm-mergeView",this.editorDOM=this.dom.appendChild(document.createElement("div")),this.editorDOM.className="cm-mergeViewEditors";let w=o.orientation||"a-b",x=document.createElement("div");x.className="cm-mergeViewEditor";let S=document.createElement("div");S.className="cm-mergeViewEditor",this.editorDOM.appendChild(w=="a-b"?x:S),this.editorDOM.appendChild(w=="a-b"?S:x),this.a=new ce({state:c,parent:x,root:o.root,dispatchTransactions:P=>this.dispatch(P,this.a)}),this.b=new ce({state:v,parent:S,root:o.root,dispatchTransactions:P=>this.dispatch(P,this.b)}),this.setupRevertControls(!!o.revertControls,o.revertControls=="b-to-a",o.renderRevertControl),o.parent&&o.parent.appendChild(this.dom),this.scheduleMeasure()}dispatch(o,a){if(o.some(d=>d.docChanged)){let d=o[o.length-1],c=o.reduce((v,m)=>v.compose(m.changes),bi.empty(o[0].startState.doc.length));this.chunks=a==this.a?xt.updateA(this.chunks,d.newDoc,this.b.state.doc,c,this.diffConf):xt.updateB(this.chunks,this.a.state.doc,d.newDoc,c,this.diffConf),a.update([...o,d.state.update({effects:cr.of(this.chunks)})]);let h=a==this.a?this.b:this.a;h.update([h.state.update({effects:cr.of(this.chunks)})]),this.scheduleMeasure()}else a.update(o)}reconfigure(o){if("diffConfig"in o&&(this.diffConf=o.diffConfig),"orientation"in o){let h=o.orientation!="b-a";if(h!=(this.editorDOM.firstChild==this.a.dom.parentNode)){let v=this.a.dom.parentNode,m=this.b.dom.parentNode;v.remove(),m.remove(),this.editorDOM.insertBefore(h?v:m,this.editorDOM.firstChild),this.editorDOM.appendChild(h?m:v),this.revertToLeft=!this.revertToLeft,this.revertDOM&&(this.revertDOM.textContent="")}}if("revertControls"in o||"renderRevertControl"in o){let h=!!this.revertDOM,v=this.revertToA,m=this.renderRevert;"revertControls"in o&&(h=!!o.revertControls,v=o.revertControls=="b-to-a"),"renderRevertControl"in o&&(m=o.renderRevertControl),this.setupRevertControls(h,v,m)}let a="highlightChanges"in o,d="gutter"in o,c="collapseUnchanged"in o;if(a||d||c){let h=[],v=[];if(a||d){let m=this.a.state.facet($e),w=d?o.gutter!==!1:m.markGutter,x=a?o.highlightChanges!==!1:m.highlightChanges;h.push(Ln.reconfigure([$e.of({side:"a",sibling:()=>this.b,highlightChanges:x,markGutter:w}),w?In:[]])),v.push(Ln.reconfigure([$e.of({side:"b",sibling:()=>this.a,highlightChanges:x,markGutter:w}),w?In:[]]))}if(c){let m=el.reconfigure(o.collapseUnchanged?pr(o.collapseUnchanged):[]);h.push(m),v.push(m)}this.a.dispatch({effects:h}),this.b.dispatch({effects:v})}this.scheduleMeasure()}setupRevertControls(o,a,d){this.revertToA=a,this.revertToLeft=this.revertToA==(this.editorDOM.firstChild==this.a.dom.parentNode),this.renderRevert=d,!o&&this.revertDOM?(this.revertDOM.remove(),this.revertDOM=null):o&&!this.revertDOM?(this.revertDOM=this.editorDOM.insertBefore(document.createElement("div"),this.editorDOM.firstChild.nextSibling),this.revertDOM.addEventListener("mousedown",c=>this.revertClicked(c)),this.revertDOM.className="cm-merge-revert"):this.revertDOM&&(this.revertDOM.textContent="")}scheduleMeasure(){if(this.measuring<0){let o=this.dom.ownerDocument.defaultView||window;this.measuring=o.requestAnimationFrame(()=>{this.measuring=-1,this.measure()})}}measure(){pv(this.a,this.b,this.chunks),this.revertDOM&&this.updateRevertButtons()}updateRevertButtons(){let o=this.revertDOM,a=o.firstChild,d=this.a.viewport,c=this.b.viewport;for(let h=0;h<this.chunks.length;h++){let v=this.chunks[h];if(v.fromA>d.to||v.fromB>c.to)break;if(v.fromA<d.from||v.fromB<c.from)continue;let m=this.a.lineBlockAt(v.fromA).top+"px";for(;a&&+a.dataset.chunk<h;)a=tl(a);a&&a.dataset.chunk==String(h)?(a.style.top!=m&&(a.style.top=m),a=a.nextSibling):o.insertBefore(this.renderRevertButton(m,h),a)}for(;a;)a=tl(a)}renderRevertButton(o,a){let d;if(this.renderRevert)d=this.renderRevert();else{d=document.createElement("button");let c=this.a.state.phrase("Revert this chunk");d.setAttribute("aria-label",c),d.setAttribute("title",c),d.textContent=this.revertToLeft?"\u21DC":"\u21DD"}return d.style.top=o,d.setAttribute("data-chunk",String(a)),d}revertClicked(o){let a=o.target,d;for(;a&&a.parentNode!=this.revertDOM;)a=a.parentNode;if(a&&(d=this.chunks[a.dataset.chunk])){let[c,h,v,m,w,x]=this.revertToA?[this.b,this.a,d.fromB,d.toB,d.fromA,d.toA]:[this.a,this.b,d.fromA,d.toA,d.fromB,d.toB],S=c.state.sliceDoc(v,Math.max(v,m-1));v!=m&&x<=h.state.doc.length&&(S+=c.state.lineBreak),h.dispatch({changes:{from:w,to:Math.min(h.state.doc.length,x),insert:S},userEvent:"revert"}),o.preventDefault()}}destroy(){this.a.destroy(),this.b.destroy(),this.measuring>-1&&(this.dom.ownerDocument.defaultView||window).cancelAnimationFrame(this.measuring),this.dom.remove()}};function tl(r){let o=r.nextSibling;return r.remove(),o}var bv=new class extends an{constructor(){super(...arguments),this.elementClass="cm-deletedLineGutter"}},wv=$t.low(Mo({class:"cm-changeGutter",markers:r=>{var o;return((o=r.plugin(Vn))===null||o===void 0?void 0:o.gutter)||Eo.empty},widgetMarker:(r,o)=>o instanceof Nn?bv:null}));function yl(r){var o;let a=typeof r.original=="string"?Zt.of(r.original.split(/\r?\n/)):r.original,d=r.diffConfig||bl;return[$t.low(Vn),Dv,_l,ce.editorAttributes.of({class:"cm-merge-b"}),ml.of((c,h)=>{let v=h.effects.find(m=>m.is(br));return v&&(c=xt.updateA(c,v.value.doc,h.startState.doc,v.value.changes,d)),h.docChanged&&(c=xt.updateB(c,h.state.field(di),h.newDoc,h.changes,d)),c}),$e.of({highlightChanges:r.highlightChanges!==!1,markGutter:r.gutter!==!1,syntaxHighlightDeletions:r.syntaxHighlightDeletions!==!1,syntaxHighlightDeletionsMaxLength:3e3,mergeControls:(o=r.mergeControls)!==null&&o!==void 0?o:!0,overrideChunk:r.allowInlineDiffs?Cv:void 0,side:"b"}),di.init(()=>a),r.gutter!==!1?wv:[],r.collapseUnchanged?pr(r.collapseUnchanged):[],Oe.init(c=>xt.build(a,c.doc,d))]}var br=Ie.define();var di=Ze.define({create:()=>Zt.empty,update(r,o){for(let a of o.effects)a.is(br)&&(r=a.value.doc);return r}});var il=new WeakMap,Nn=class extends Vt{constructor(o){super(),this.buildDOM=o,this.dom=null}eq(o){return this.dom==o.dom}toDOM(o){return this.dom||(this.dom=this.buildDOM(o))}};function _v(r,o,a){let d=il.get(o.changes);if(d)return d;let c=v=>{let{highlightChanges:m,syntaxHighlightDeletions:w,syntaxHighlightDeletionsMaxLength:x,mergeControls:S}=r.facet($e),P=document.createElement("div");if(P.className="cm-deletedChunk",S){let R=P.appendChild(document.createElement("div"));R.className="cm-chunkButtons";let U=J=>{J.preventDefault(),yv(v,v.posAtDOM(P))},F=J=>{J.preventDefault(),xv(v,v.posAtDOM(P))};if(typeof S=="function")R.appendChild(S("accept",U)),R.appendChild(S("reject",F));else{let J=R.appendChild(document.createElement("button"));J.name="accept",J.textContent=r.phrase("Accept"),J.onmousedown=U;let A=R.appendChild(document.createElement("button"));A.name="reject",A.textContent=r.phrase("Reject"),A.onmousedown=F}}if(a||o.fromA>=o.toA)return P;let z=v.state.field(di).sliceString(o.fromA,o.endA),L=w&&r.facet(Da),V=O(),H=o.changes,N=0,G=!1;function O(){let R=P.appendChild(document.createElement("div"));return R.className="cm-deletedLine",R.appendChild(document.createElement("del"))}function ye(R,U,F){for(let J=R;J<U;){if(z.charAt(J)==`
`){V.firstChild||V.appendChild(document.createElement("br")),V=O(),J++;continue}let A=U,te=F+(G?" cm-deletedText":""),ke=!1,nt=z.indexOf(`
`,J);if(nt>-1&&nt<U&&(A=nt),m&&N<H.length){let Ne=Math.max(0,G?H[N].toA:H[N].fromA);Ne<=A&&(A=Ne,G&&N++,ke=!0)}if(A>J){let Ne=document.createTextNode(z.slice(J,A));if(te){let Ve=V.appendChild(document.createElement("span"));Ve.className=te,Ve.appendChild(Ne)}else V.appendChild(Ne);J=A}ke&&(G=!G)}}if(L&&o.toA-o.fromA<=x){let R=L.parser.parse(z),U=0;xa(R,{style:F=>Pa(r,F)},(F,J,A)=>{F>U&&ye(U,F,""),ye(F,J,A),U=J}),ye(U,z.length,"")}else ye(0,z.length,"");return V.firstChild||V.appendChild(document.createElement("br")),P},h=be.widget({block:!0,side:-1,widget:new Nn(c)});return il.set(o.changes,h),h}function yv(r,o){let{state:a}=r,d=o??a.selection.main.head,c=r.state.field(Oe).find(w=>w.fromB<=d&&w.endB>=d);if(!c)return!1;let h=r.state.sliceDoc(c.fromB,Math.max(c.fromB,c.toB-1)),v=r.state.field(di);c.fromB!=c.toB&&c.toA<=v.length&&(h+=r.state.lineBreak);let m=bi.of({from:c.fromA,to:Math.min(v.length,c.toA),insert:h},v.length);return r.dispatch({effects:br.of({doc:m.apply(v),changes:m}),userEvent:"accept"}),!0}function xv(r,o){let{state:a}=r,d=o??a.selection.main.head,c=a.field(Oe).find(m=>m.fromB<=d&&m.endB>=d);if(!c)return!1;let v=a.field(di).sliceString(c.fromA,Math.max(c.fromA,c.toA-1));return c.fromA!=c.toA&&c.toB<=a.doc.length&&(v+=a.lineBreak),r.dispatch({changes:{from:c.fromB,to:Math.min(a.doc.length,c.toB),insert:v},userEvent:"revert"}),!0}function nl(r){let o=new _t;for(let a of r.field(Oe)){let d=r.facet($e).overrideChunk&&xl(r,a);o.add(a.fromB,a.fromB,_v(r,a,!!d))}return o.finish()}var Dv=Ze.define({create:r=>nl(r),update(r,o){return o.state.field(Oe,!1)!=o.startState.field(Oe,!1)?nl(o.state):r},provide:r=>ce.decorations.from(r)}),ol=new WeakMap;function xl(r,o){let a=ol.get(o);if(a!==void 0)return a;a=null;let d=r.field(di),c=r.doc,h=d.lineAt(o.endA).number-d.lineAt(o.fromA).number+1,v=c.lineAt(o.endB).number-c.lineAt(o.fromB).number+1;e:if(h==v&&h<10){let m=[],w=0,x=o.fromA,S=o.fromB;for(let P of o.changes){if(P.fromA<P.toA){w+=P.toA-P.fromA;let z=d.sliceString(x+P.fromA,x+P.toA);if(/\n/.test(z))break e;m.push(be.widget({widget:new vr(z),side:-1}).range(S+P.fromB))}P.fromB<P.toB&&m.push(wl.range(S+P.fromB,S+P.toB))}w<o.endA-o.fromA-h*2&&(a=m)}return ol.set(o,a),a}var vr=class extends Vt{constructor(o){super(),this.text=o}eq(o){return this.text==o.text}toDOM(o){let a=document.createElement("del");return a.className="cm-deletedText",a.textContent=this.text,a}},kv=new class extends an{constructor(){super(...arguments),this.elementClass="cm-inlineChangedLineGutter"}},Sv=be.line({class:"cm-inlineChangedLine"});function Cv(r,o,a,d){let c=xl(r,o),h=0;if(!c)return!1;for(let v=r.doc.lineAt(o.fromB);;){for(d&&d.add(v.from,v.from,kv),a.add(v.from,v.from,Sv);h<c.length&&c[h].to<=v.to;){let m=c[h++];a.add(m.from,m.to,m.value)}if(v.to>=o.endB)break;v=r.doc.lineAt(v.to+1)}return!0}var Gv=2e3,Sl="yajna-files:review";function Pv(){let r={files:!0,wrap:!1,composer:!0,focus:!1,unified:!1,split:.5};try{return{...r,...JSON.parse(localStorage.getItem(Sl)??"{}")}}catch{return r}}function Bn(r){try{localStorage.setItem(Sl,JSON.stringify(r))}catch{}}function Wn(r){document.body.classList.toggle("yr-focus",r)}function q(r,o="",a){let d=document.createElement(r);return o&&(d.className=o),a!==void 0&&(d.textContent=a),d}function Hn(r,o="yr-label"){let a=q("span",`${o} yr-path`);a.title=r;let d=r.lastIndexOf("/")+1;return d&&a.append(q("span","yr-dir",r.slice(0,d))),a.append(q("span","yr-base",r.slice(d))),a}var yr=(r,o)=>r===o?`line ${r}`:`lines ${r}\u2013${o}`;function Ti(r,o,a,d,c=[]){let h=q("div","yr-form"),v=q("textarea");v.rows=2,v.placeholder=d,v.value=r.drafts.get(o)??"",v.addEventListener("input",()=>r.drafts.set(o,v.value));let m=q("div","yr-buttons");for(let w of a){let x=q("button","",w.label);x.addEventListener("click",()=>{let S=v.value.trim();if(w.needsText&&!S)return v.focus();let P=w.on;if(w.commit){let L=window.prompt("The commit that addresses it (empty: the branch tip, or HEAD)","");if(L===null)return;P=L.trim()||void 0}let z=w.at?.();z!==null&&r.write(w.action,{thread:w.thread,text:S||void 0,commit:P,at:z},o)}),m.append(x)}return m.append(...c),v.addEventListener("keydown",w=>{w.key==="Enter"&&(w.ctrlKey||w.metaKey)&&(w.preventDefault(),m.firstElementChild?.click())}),h.append(v,m),h}function zv(r,o){let a=`T${r.n}`,d=!o.review().author.startsWith("agent:"),c=[{label:"Reply",action:"reply",thread:a,needsText:!0}];return r.state!=="resolved"&&c.push({label:"Addressed\u2026",action:"address",thread:a,needsText:!0,commit:!0}),d&&r.state!=="resolved"&&c.push({label:"Resolve",action:"resolve",thread:a}),(r.state==="resolved"||r.state==="addressed")&&c.push({label:"Reopen",action:"reopen",thread:a}),c}function wr(r,o,a){let d=q("div",`yr-thread yr-${r.state}`),c=q("div","yr-thread-head");c.append(q("b","",`T${r.n}`),q("span",`yr-state yr-${r.state}`,r.state));let h=q("span","yr-anchor",r.anchor.raw);h.title=r.anchor.raw;let v=r.anchor.path;v&&(h.classList.add("yr-link"),h.addEventListener("click",()=>o.openFile(v,r.anchor.from,r.anchor.commit))),c.append(h),d.append(c),a&&r.quote.length&&d.append(q("pre","yr-quote",r.quote.join(`
`)));let m=q("ul","yr-replies");for(let w of r.replies){let x=q("li");x.append(q("span","yr-when",w.when)," ",q("span",w.author.startsWith("agent:")?"yr-agent":"yr-who",w.author)," "),w.action&&x.append(q("span","yr-action",w.action==="addressed"?`addressed in ${w.commit}`:w.action)," "),w.text&&x.append(w.text),m.append(x)}return d.append(m),Bt()&&d.append(Ti(o,`T${r.n}`,zv(r,o),"Reply\u2026")),d}var Ai=Ie.define(),Dl=Ze.define({create:()=>be.none,update(r,o){for(let a of o.effects)if(a.is(Ai))return a.value;return r.map(o.changes)},provide:r=>ce.decorations.from(r)}),Fn=class extends Vt{constructor(a,d){super();this.sig=a;this.build=d}eq(a){return a.sig===this.sig}toDOM(){let a=q("div","yr-box");return a.append(this.build()),a}ignoreEvent(){return!0}},_r=(r,o)=>!!r.anchor.commit&&o.startsWith(r.anchor.commit)&&r.state!=="outdated";function Tv(r,o){let a=o.state.doc;if(r.anchor.to)return Math.min(r.anchor.to,a.lines);if(r.anchor.heading)for(let d=1;d<=a.lines;d++){let c=a.line(d).text;if(c.startsWith("#")&&c.replace(/^#+/,"").trim()===r.anchor.heading)return d}return null}function Cl(r){let o=r.selection.main,a=r.doc.lineAt(o.from).number,d=r.doc.lineAt(o.to).number;return d>a&&r.doc.line(d).from===o.to&&d--,{a,b:d}}function Av(r){let o=a=>{let d=a.selection.main;if(d.empty)return null;let{a:c,b:h}=Cl(a);return{pos:d.from,above:!0,create:()=>{let v=q("button","yr-float",`Comment on ${yr(c,h)}`);return v.addEventListener("mousedown",m=>m.preventDefault()),v.addEventListener("click",()=>r(c,h)),{dom:v}}}};return Ze.define({create:o,update:(a,d)=>d.selection?o(d.state):a,provide:a=>fa.from(a)})}function Ev(){let r=1;return Qt({domEventHandlers:{mousedown(o,a,d){let c=o.state.doc,h=c.lineAt(a.from).number;d.shiftKey||(r=h);let[v,m]=r<=h?[r,h]:[h,r];return o.dispatch({selection:ue.range(c.line(v).from,c.line(m).to)}),!0}}})}var Iv=ce.theme({"&.cm-merge-a .cm-changedText, .cm-deletedChunk .cm-deletedText":{background:"rgba(238, 68, 51, 0.3)"},"&.cm-merge-b .cm-changedText":{background:"rgba(34, 187, 34, 0.3)"}}),Gl={margin:4,minSize:8};function Mv(r,o,a,d,c){let h=new $n({a:{doc:o.base??"",extensions:[...a,Qt()]},b:{doc:o.head??"",extensions:[...a,...d]},parent:r,collapseUnchanged:Gl,gutter:!0}),v=h.a.dom.parentElement,m=q("div","yr-sash");m.title="Drag to resize the sides; double-click for half each",v.after(m);let w=x=>{v.style.flex=`0 0 ${(x*100).toFixed(2)}%`};return w(c.split),m.addEventListener("pointerdown",x=>{x.preventDefault(),m.setPointerCapture(x.pointerId);let S=v.parentElement.getBoundingClientRect(),P=L=>{c.split=Math.min(.85,Math.max(.15,(L.clientX-S.left)/S.width)),w(c.split)},z=()=>{m.removeEventListener("pointermove",P),Bn(c)};m.addEventListener("pointermove",P),m.addEventListener("pointerup",z,{once:!0})}),m.addEventListener("dblclick",()=>{c.split=.5,w(c.split),Bn(c)}),{b:h.b,editors:[h.a,h.b],destroy:()=>h.destroy()}}function Lv(r,o,a){let d=new ce({doc:o.head??"",extensions:[...a,yl({original:o.base??"",mergeControls:!1,gutter:!0,collapseUnchanged:Gl})],parent:r});return{b:d,editors:[d],destroy:()=>d.destroy()}}var li=(r,o)=>r?.path===o?.path&&r?.work===o?.work&&r?.between?.from===o?.between?.from&&r?.between?.to===o?.between?.to;function kl(r,o){return(o.work?r.unreviewed:o.between?r.since&&o.between.from===r.since.from&&o.between.to===r.head?r.since.files:r.fixes.find(d=>d.commit===o.between.to&&d.parent===o.between.from)?.files??[]:r.files).find(d=>d.path===o.path)}var Ov=r=>`${r.work?"work:":""}${r.between?.to??""}:${r.path}`,xr={name:"review",score:()=>0,async mount(r,o){let a=o.path.replace(/^review:/,""),d=await Tt.get(a),c=Pv();Wn(c.focus);let h=null,v,m=null,w=null,x,S=!1,P=!1,z=q("div","yr-top"),L=q("div","yr-notice"),V=q("div","yr-body"),H=q("ul","yr-files"),N=q("div","yr-main");V.append(H,N),r.append(z,L,V);let G=Y=>{L.textContent=Y,L.hidden=!Y};G("");let O=Y=>`inline:${Y}`,ye={review:()=>d,drafts:new Map,async write(Y,ae,Q){if(!S){S=!0;try{d=await Tt.write(a,Y,d.version,ae),ye.drafts.delete(Q),m&&Q===O(m.key)&&(m=null),G(""),Ve()}catch(oe){oe instanceof tt&&oe.status===409?(d=await Tt.get(a),Ve(),G(`${oe.message}. What you wrote is kept; send it again.`)):G(oe.message)}finally{S=!1}}},openFile(Y,ae,Q){let oe=Q&&!d.head.startsWith(Q)?d.fixes.find(le=>le.commit.startsWith(Q)):void 0;oe?.files.some(le=>le.path===Y)?(h={path:Y,work:!1,between:{from:oe.parent,to:oe.commit}},x=ae,Ve()):d.files.some(le=>le.path===Y)?(h={path:Y,work:!1},x=ae,Ve()):o.open(Y)}};function R(Y,ae,Q){let oe=q("button","yr-toggle",Y);return oe.title=Q,oe.setAttribute("aria-pressed",String(c[ae])),oe.addEventListener("click",()=>{if(c[ae]=!c[ae],Bn(c),ae==="focus"&&Wn(c.focus),ae==="wrap"&&v){let le=c.wrap?ce.lineWrapping:[];for(let ie of v.view.editors)ie.dispatch({effects:v.wrap.reconfigure(le)})}F(),U(),(ae==="composer"||ae==="unified")&&h&&nt(!0)}),oe}function U(){let Y=d;z.replaceChildren();let ae=q("div","yr-row"),Q=q("div","yr-title");Q.append(q("b","",Y.id),` ${Y.title}`);let oe=q("div","yr-tools");oe.append(R("Files","files","Show the list of files"),R("Unified","unified","One pane with the removed lines above the added ones, instead of two side by side"),R("Wrap","wrap","Wrap long lines in the diffs"),R("Comment box","composer","Keep a comment box for the selected lines above the diff"),R("Focus","focus","Hide the top bar, the sidebar and the status line (Esc leaves)")),ae.append(Q,oe);let le=q("div","yr-meta");le.append(q("span",`yr-status yr-${Y.status}`,Y.status.replace("_"," ")),` ${Y.kind} ${Y.ref} \xB7 ${Y.base.slice(0,7)}..${Y.head.slice(0,7)}${Y.rounds.length?` \xB7 round ${Y.rounds.length+1}`:""} \xB7 `,Bt()?`writing as ${Y.author}`:"read-only: open the URL yajna serve --review printed to write"),z.append(ae,le)}function F(){H.hidden=!c.files}function J(){H.replaceChildren();let Y=(ie,pe,he,de="")=>{let ge=q("li",`${de} ${li(h,pe)?"yr-on":""}`);ge.append(ie),he&&ge.append(q("span","yr-count",String(he))),ge.addEventListener("click",()=>{h=pe,Ve()}),H.append(ge)},ae=d.threads.filter(ie=>ie.state==="open"||ie.state==="addressed").length;Y(q("span","yr-label","Overview"),null,ae,"yr-overview");for(let ie of d.files){let pe=d.threads.filter(de=>de.anchor.path===ie.path&&de.state!=="resolved").length,he=q("span","yr-entry");he.append(q("span",`yr-fs yr-fs-${ie.status}`,ie.status),Hn(ie.path)),ie.old&&(he.title=`${ie.old} \u2192 ${ie.path}`),Y(he,{path:ie.path,work:!1},pe)}let Q=(ie,pe)=>{let he=q("li","yr-group",ie);he.title=pe,H.append(he)},oe=(ie,pe)=>{for(let he of ie){let de={path:he.path,work:!1,between:pe},ge=d.threads.filter(Pe=>Pe.anchor.path===he.path&&_r(Pe,pe.to)&&Pe.state!=="resolved").length,Se=q("span","yr-entry");Se.append(q("span",`yr-fs yr-fs-${he.status}`,he.status),Hn(he.path)),he.old&&(Se.title=`${he.old} \u2192 ${he.path}`),Y(Se,de,ge)}},le=d.since;le?.files.length&&(Q(`Since round ${d.rounds.length} \xB7 ${le.from.slice(0,7)}..${d.head.slice(0,7)}`,"What changed since the last yajna review update: the head it moved from to the head"),oe(le.files,{from:le.from,to:d.head}));for(let ie of d.fixes)ie.files.length&&(Q(`Fix ${ie.commit.slice(0,7)} \xB7 ${ie.threads.map(pe=>`T${pe}`).join(", ")}`,`${ie.subject}
This commit on its own, against its parent, whatever else came between the fixes`),oe(ie.files,{from:ie.parent,to:ie.commit}));if(d.unreviewed.length){let ie=q("li","yr-group","Not in the review yet");ie.title="Committed after the review\u2019s head, or not committed: commit, then yajna review update",H.append(ie);for(let pe of d.unreviewed){let he=q("span","yr-entry");he.append(q("span",`yr-fs yr-fs-${pe.status==="?"?"A":pe.status}`,pe.status),Hn(pe.path)),Y(he,{path:pe.path,work:!0},0,"yr-work")}}}function A(){v?.view.destroy(),v=void 0,N.replaceChildren(),N.classList.remove("yr-split");let Y=d,ae=q("section","yr-summary");if(Y.about.length){let de=q("p","yr-about","About ");Y.about.forEach((ge,Se)=>{let Pe=q("a","",ge);Pe.href=`/${ge}.html`,Pe.target="_blank",de.append(...Se?[", ",Pe]:[Pe])}),ae.append(de)}if(ae.append(q("h3","","Summary"),q("div","yr-pre",Y.summary||"(none yet)")),Bt()&&!["merged","closed"].includes(Y.status)){let de=[{label:"Request changes",action:"request-changes",needsText:!0}];Y.author.startsWith("agent:")||de.unshift({label:"Approve",action:"approve"}),ae.append(Ti(ye,"verdict",de,"A reason, or a word with the approval\u2026"))}N.append(ae);for(let de of Y.problems)N.append(q("div","yr-problem",de));let Q=q("section","yr-threads"),oe=de=>Y.threads.filter(ge=>ge.state===de).length,le=["open","addressed","outdated","resolved"].map(de=>[de,oe(de)]).filter(([,de])=>de).map(([de,ge])=>`${ge} ${de}`).join(" \xB7 ");Q.append(q("h3","",`Threads${le?` \xB7 ${le}`:""}`)),Y.threads.length||Q.append(q("p","yr-muted","No threads yet. Select lines in a file to comment on them."));let ie=de=>{if(!de.anchor.path)return-1;let ge=Y.files.findIndex(Se=>Se.path===de.anchor.path);return ge<0?Y.files.length:ge},pe=[...Y.threads].sort((de,ge)=>ie(de)-ie(ge)||de.n-ge.n),he;for(let de of pe){let ge=de.anchor.path??"General";if(ge!==he){he=ge;let Se=q("h4","yr-group-head");if(de.anchor.path){let Pe=de.anchor.path,We=Hn(Pe,"yr-link");We.addEventListener("click",()=>ye.openFile(Pe)),Se.append(We)}else Se.textContent=ge;Q.append(Se)}Q.append(wr(de,ye,!0))}Bt()&&Q.append(Ti(ye,"general",[{label:"Comment",action:"comment",needsText:!0}],"A comment on the whole review\u2026")),N.append(Q)}function te(Y,ae,Q,oe){let le=d,ie=[];for(let pe of le.threads.filter(he=>he.anchor.path===ae&&_r(he,Q))){let he=Tv(pe,Y);if(he===null)continue;let de=new Fn(JSON.stringify(pe)+Bt(),()=>wr(pe,ye,!1));ie.push(be.widget({widget:de,block:!0,side:1}).range(Y.state.doc.line(he).to))}if(m&&m.key===oe&&m.b<=Y.state.doc.lines){let{a:pe,b:he}=m,de=Q===le.head?void 0:Q,ge=new Fn(`draft:${oe}:${pe}-${he}`,()=>{let Se=q("div","yr-thread yr-draft");Se.append(q("div","yr-thread-head",`New thread on ${yr(pe,he)}`));let Pe=q("button","","Cancel");Pe.addEventListener("click",()=>{m=null,Y.dispatch({effects:Ai.of(te(Y,ae,Q,oe))})});let We=()=>pe===he?`${ae}:${pe}`:`${ae}:${pe}-${he}`;return Se.append(Ti(ye,O(oe),[{label:"Comment",action:"comment",needsText:!0,at:We,on:de}],"Your comment\u2026 (Ctrl-Enter sends)",[Pe])),requestAnimationFrame(()=>Se.querySelector("textarea")?.focus()),Se});ie.push(be.widget({widget:ge,block:!0,side:2}).range(Y.state.doc.line(he).to))}return be.set(ie,!0)}function ke(Y,ae,Q){let oe=q("div","yr-compose"),le=q("div","yr-picked"),ie=()=>{le.textContent=w?`On ${yr(w.a,w.b)}`:"Select lines on the right, or click their numbers (shift-click for a range)"};ie();let pe=()=>{if(!w)return G("Pick the lines first: select them on the right, or click their numbers."),null;let{a:de,b:ge}=w;return de===ge?`${Y}:${de}`:`${Y}:${de}-${ge}`},he=Ti(ye,`new:${ae}`,[{label:"Comment",action:"comment",needsText:!0,at:pe,on:Q}],"A comment on the picked lines\u2026 (Ctrl-Enter sends)");return he.querySelector("textarea").rows=1,oe.append(le,he),oe.show=ie,oe}async function nt(Y=!1){let ae=d,Q=h;if(!Q)return;let oe=kl(ae,Q),le=Q.between?.to??ae.head,ie=Ov(Q);if(!Y&&v&&li(v.shown,Q)&&v.head===ae.head&&!Q.work){let He=v.view.b;He.dispatch({effects:Ai.of(te(He,oe.path,le,ie))}),Ne(oe,le);return}let pe=await Tt.file(a,oe,Q.work,Q.between);if(P||!li(h,Q)||!Y&&v&&li(v.shown,Q)&&v.sides.base===pe.base&&v.sides.head===pe.head)return;let he=v&&li(v.shown,Q)?N.querySelector(".yr-scroll")?.scrollTop??0:0;v?.view.destroy(),v=void 0,w=null;let de=await sr(oe.path.slice(oe.path.lastIndexOf("/")+1)).catch(()=>null);if(P||!li(h,Q))return;let ge=new Nt,Se=[Iv,gt.readOnly.of(!0),ce.editable.of(!1),An(),de??[],ge.of(c.wrap?ce.lineWrapping:[])],Pe=Bt()&&!Q.work&&oe.status!=="D";N.replaceChildren(),N.classList.add("yr-split");let We=q("div","yr-scroll");if(Q.between&&le!==ae.head){let He=ae.fixes.find(pi=>pi.commit===le);N.append(q("p","yr-muted yr-extras",`Fix ${le.slice(0,7)}: ${He?.subject??""}, on its own against its parent. A comment here is anchored to this commit.`))}Q.work&&N.append(q("p","yr-muted yr-extras",`Not in the review: the head ${ae.head.slice(0,7)} against the working tree. Commit it and run yajna review update ${ae.id} to comment on it.`));let Oi=le===ae.head?void 0:le,It=Pe&&c.composer?ke(oe.path,ie,Oi):null;It&&N.append(It);let jt=q("div","yr-diff");We.append(jt,q("div","yr-extras")),N.append(We);let Zn=(He,pi)=>{m={key:ie,a:He,b:pi},Ke.b.dispatch({effects:Ai.of(te(Ke.b,oe.path,le,ie))})},Ri=Pe?[Ev(),sn(),Dl,Av(Zn),ce.updateListener.of(He=>{He.selectionSet&&(w=Cl(He.state),It?.show?.())})]:[Qt(),Dl],Ke=c.unified?Lv(jt,pe,[...Se,...Ri]):Mv(jt,pe,Se,Ri,c);if(v={shown:Q,head:ae.head,sides:pe,view:Ke,wrap:ge},Q.work||Ke.b.dispatch({effects:Ai.of(te(Ke.b,oe.path,le,ie))}),pe.head===null&&jt.before(q("p","yr-muted yr-extras",Q.work?"Deleted in the working tree.":"Deleted at the head: nothing to comment on here.")),Ne(oe,le),x&&x<=Ke.b.state.doc.lines){let He=Ke.b.state.doc.line(x).from;requestAnimationFrame(()=>Ke.b.dispatch({effects:ce.scrollIntoView(He,{y:"center"})}))}else We.scrollTop=he;x=void 0}function Ne(Y,ae){let Q=N.querySelector(".yr-diff + .yr-extras");if(!Q||(Q.replaceChildren(),h?.work))return;let oe=d.threads.filter(le=>le.anchor.path===Y.path&&!_r(le,ae));oe.length&&Q.append(q("h3","","Threads at other commits"));for(let le of oe)Q.append(wr(le,ye,!0))}function Ve(){U(),F(),J(),!h||!kl(d,h)?(h=null,A()):nt(),o.onStatus()}let hi=Y=>{Y.key==="Escape"&&c.focus&&!(Y.target instanceof HTMLTextAreaElement)&&(c.focus=!1,Bn(c),Wn(!1),U())};document.addEventListener("keydown",hi),Ve();let ui=window.setInterval(async()=>{if(S)return;let Y=await Tt.get(a).catch(()=>null);if(!Y||S)return;let ae=JSON.stringify(Y.unreviewed)!==JSON.stringify(d.unreviewed);Y.version!==d.version||ae?(d=Y,Ve()):h?.work&&nt()},Gv);return{dispose(){P=!0,window.clearInterval(ui),document.removeEventListener("keydown",hi),Wn(!1),v?.view.destroy()},status:()=>{let Y=d.threads.filter(Q=>Q.state==="open"||Q.state==="addressed").length,ae=d.unreviewed.length?` \xB7 ${d.unreviewed.length} files not in the review yet`:"";return`${d.status.replace("_"," ")} \xB7 ${Y} of ${d.threads.length} threads unsettled${ae}`}}}};je(xr);var Rv=4e3,Ei=ut.replace(/\/w\/[^/]+$/,"");async function ci(r){let o=await fetch(r),a=await o.json().catch(()=>({error:o.statusText}));if(!o.ok)throw new tt(o.status,a.error??o.statusText);return a}var Et=encodeURIComponent;async function Dr(){try{return(await ci(`${Ei}/api/worktrees`)).worktrees}catch(r){if(r instanceof tt&&r.status===404)return null;throw r}}var Yt=r=>!r||r.current?Ei:`${Ei}/${r.url.replace(/\/$/,"")}`;function se(r,o="",a){let d=document.createElement(r);return o&&(d.className=o),a!==void 0&&(d.textContent=a),d}function $v(r){let o=Date.now()/1e3-r;return o<60?"just now":o<3600?`${Math.floor(o/60)} min ago`:o<86400?`${Math.floor(o/3600)} h ago`:o<86400*30?`${Math.floor(o/86400)} d ago`:new Date(r*1e3).toISOString().slice(0,10)}var Pl=(r,o,a=`${o}s`)=>`${r} ${r===1?o:a}`;function Nv(r){let o=[r.conflicted?`${r.conflicted} conflicted`:"",r.staged?`${r.staged} staged`:"",r.changed?`${r.changed} changed`:"",r.untracked?`${r.untracked} untracked`:""].filter(Boolean);return o.length?o.join(" \xB7 "):"clean"}function zl(r){let o=se("span","yc-path"),a=r.lastIndexOf("/")+1;return a&&o.append(se("span","yc-dir",r.slice(0,a))),o.append(se("span","yc-name",r.slice(a))),o}var Vv={M:"modified",T:"type changed",A:"added",D:"deleted",R:"renamed",C:"copied",U:"conflicted","?":"untracked"};function Wv(r){let o=se("div","yc-diff"),a=0,d=0,c=!1,h=[],v=(m,w,x,S)=>{let P=se("div",`yc-line ${m}`);P.append(se("span","yc-no",w),se("span","yc-no",x),se("span","yc-text",S)),o.append(P)};for(let m of r.split(`
`)){let w=/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(.*)$/.exec(m);w?(c=!0,a=Number(w[1]),d=Number(w[2]),v("yc-hunk","","",w[3].trim()?`\u22EF ${w[3].trim()}`:"\u22EF")):c?m.startsWith("+")?v("yc-add","",String(d++),m.slice(1)):m.startsWith("-")?v("yc-del",String(a++),"",m.slice(1)):m.startsWith(" ")?v("yc-ctx",String(a++),String(d++),m.slice(1)):m.startsWith("\\")?v("yc-meta","","",m.slice(2)):m.startsWith("diff ")&&(c=!1):/^(new file|deleted file|rename from|rename to|similarity|Binary files|old mode|new mode)/.test(m)&&h.push(m)}if(h.length){let m=se("div","yc-notes");for(let w of h)m.append(se("div","",w));o.prepend(m)}return o}var Ii=class{constructor(o,a,d){this.onMove=a;this.openFile=d;this.place=o,this.element.append(this.head,this.body),this.load(),this.timer=window.setInterval(()=>{document.visibilityState==="visible"&&this.element.isConnected&&this.load(!0)},Rv)}element=se("div","yc");head=se("div","yc-head");body=se("div","yc-body");place;list=null;shown="";timer=0;loads=0;more=new Map;dispose(){window.clearInterval(this.timer)}go(o,a=!0){this.place=o,this.shown="",this.more.clear(),this.moreNext=void 0,a&&this.onMove(o,!1),this.load()}back(){let o=this.place;this.go(o.file?{wt:o.wt}:{})}wt(){return this.list?this.list.find(o=>o.name===this.place.wt)??null:null}async load(o=!1){let a=++this.loads;try{if(this.list=await Dr(),!this.place.wt&&(this.list===null||this.list.length===1)){let d=this.list?.[0];this.place={...this.place,wt:d?.name??""},this.onMove(this.place,!0)}if(a!==this.loads)return;this.place.file?await this.showDiff(a,o):this.place.wt!==void 0?await this.showWorktree(a):this.showList()}catch(d){if(a!==this.loads||o)return;this.header(this.place.wt??"Changes",this.place.wt!==void 0),this.body.replaceChildren(se("div","yc-message",d.message))}}header(o,a,d=""){let c=this.head;if(c.replaceChildren(),a){let v=se("button","yc-back","\u2039");v.title="Back",v.setAttribute("aria-label","Back"),v.addEventListener("click",()=>this.back()),c.append(v)}let h=se("div","yc-title");h.append(se("div","yc-name",o)),d&&h.append(se("div","yc-sub",d)),c.append(h)}draw(o,a){if(o===this.shown)return;this.shown=o;let d=this.body.scrollTop;this.body.replaceChildren(...a()),this.body.scrollTop=d}showList(){let o=this.list??[];this.header("Worktrees",!1,Pl(o.length,"worktree")),this.draw(JSON.stringify(o),()=>{let a=se("ul","yc-list");for(let d of o){let c=se("li","yc-row yc-tap"),h=se("div","yc-main");h.append(se("div","yc-name",d.name)),h.append(se("div","yc-sub",Nv(d))),c.append(h),d.current&&c.append(se("span","yc-badge","here"));let v=(d.changed??0)+(d.staged??0)+(d.untracked??0)+(d.conflicted??0);v&&c.append(se("span","yc-count",String(v))),c.addEventListener("click",()=>this.go({wt:d.name})),a.append(c)}return[a]})}async showWorktree(o){let a=this.wt(),d=Yt(a),h=(await ci(`${d}/api/files/roots`)).find(P=>P.exists);if(!h)throw new Error("no root of this notebook is on this machine");let[v,m]=await Promise.all([ci(`${d}/api/git/status?path=${Et(h.name)}`),ci(`${d}/api/git/log?path=${Et(h.name)}&limit=20`)]);if(o!==this.loads)return;let w=[v.ahead?`${v.ahead} ahead`:"",v.behind?`${v.behind} behind`:""].filter(Boolean).join(", "),x=this.place.wt||v.branch||"this checkout";this.header(x,(this.list?.length??0)>1,[v.upstream?`${v.upstream}${w?`: ${w}`:""}`:"",v.head?.slice(0,7)??""].filter(Boolean).join(" \xB7 "));let S=[...this.more.values()].flat();this.draw(JSON.stringify([v,m,S.length]),()=>{let P=[],z=(H,N,G,O)=>{if(!N.length)return;P.push(se("h3","yc-section",`${H} \xB7 ${N.length}`));let ye=se("ul","yc-list");for(let R of N)ye.append(this.fileRow(R,G,O,H.toLowerCase()));P.push(ye)};z("Conflicted",v.conflicted,"HEAD","WORK"),z("Staged",v.staged,"HEAD","INDEX"),z("Changed",v.unstaged,"INDEX","WORK"),z("Untracked",v.untracked,"HEAD","WORK"),!v.conflicted.length&&!v.staged.length&&!v.unstaged.length&&!v.untracked.length&&P.push(se("div","yc-message","Nothing uncommitted.")),P.push(se("h3","yc-section","Commits"));let L=se("ul","yc-list");for(let H of[...m.commits,...S])L.append(this.commitRow(H));P.push(L);let V=S.length?this.moreNext:m.next;if(V){let H=se("button","yc-more","Older commits");H.addEventListener("click",async()=>{H.disabled=!0;let N=await ci(`${d}/api/git/log?path=${Et(h.name)}&limit=20&before=${Et(V)}`);this.moreNext=N.next,this.more.set(V,N.commits),this.shown="",this.load(!0)}),P.push(H)}return P})}moreNext;fileRow(o,a,d,c){let h=se("li",`yc-row yc-file${o.path?" yc-tap":" yc-off"}`),v=se("span",`yc-status yc-s-${o.status==="?"?"u":o.status}`,o.status);v.title=Vv[o.status]??o.status;let m=se("div","yc-main");if(m.append(zl(o.rel)),o.old&&m.append(se("div","yc-sub",`from ${o.old}`)),o.path||m.append(se("div","yc-sub","under no root of the viewer")),h.append(v,m),o.path){let w=o.path,x=o.old&&w.endsWith(o.rel)?w.slice(0,w.length-o.rel.length)+o.old:void 0;h.addEventListener("click",()=>this.go({wt:this.place.wt,file:w,old:x,from:a,to:d,what:c}))}return h}commitRow(o){let a=se("li","yc-commit"),d=se("div","yc-row yc-tap"),c=se("div","yc-main");c.append(se("div","yc-subject",o.subject)),c.append(se("div","yc-sub",`${o.short} \xB7 ${o.author} \xB7 ${$v(o.time)} \xB7 ${Pl(o.files.length,"file")}`)),d.append(c);let h=se("ul","yc-list yc-nested");return h.hidden=!0,d.addEventListener("click",()=>{if(h.hidden&&!h.childElementCount){let v=o.parents.length?`${o.sha}^`:"";for(let m of o.files)v?h.append(this.fileRow(m,v,o.sha,`${o.short} ${o.subject}`)):h.append(se("li","yc-row yc-off",m.rel))}h.hidden=!h.hidden,a.classList.toggle("yc-open",!h.hidden)}),a.append(d,h),a}async showDiff(o,a){let d=this.place,c=this.wt(),v=`${Yt(c)}/api/git/diff?path=${Et(d.file)}&from=${Et(d.from??"HEAD")}&to=${Et(d.to??"WORK")}${d.old?`&old=${Et(d.old)}`:""}`;if(a&&d.to!=="WORK"&&d.to!=="INDEX")return;let m=await ci(v);if(o!==this.loads)return;let w=d.file.slice(d.file.indexOf("/")+1);this.header(w.slice(w.lastIndexOf("/")+1),!0,`${d.what??""}${d.what?" \xB7 ":""}${this.place.wt??""}`),this.draw(JSON.stringify(m),()=>{let x=[],S=se("div","yc-bar");if(S.append(zl(d.file)),d.to==="WORK"||d.to==="INDEX"){let P=se("button","yc-open-file","Open");P.addEventListener("click",()=>this.openFile(d.file,c)),S.append(P)}return x.push(S),m.binary?x.push(se("div","yc-message","A binary file: no lines to show.")):m.diff.trim()?x.push(Wv(m.diff)):x.push(se("div","yc-message","No differences.")),m.truncated&&x.push(se("div","yc-message","The diff is cut off: it is over 4 MB.")),x})}};function kr(){let r=new URLSearchParams(location.search),o={};for(let a of["wt","file","old","from","to","what"]){let d=r.get(a);d!==null&&(o[a]=d)}return o}function Sr(r){let o=new URLSearchParams;for(let[d,c]of Object.entries(r))c!==void 0&&o.set(d,c);let a=o.toString();return location.pathname+(a?`?${a}`:"")}je({name:"changes",score:r=>r.kind==="changes"?100:0,async mount(r,o){let a=new Ii({},()=>{},(d,c)=>Yt(c)===ut?o.open(d):window.open(`${Yt(c)}/files/#${encodeURI(d)}`,"_blank"));return r.append(a.element),r.classList.add("yc-tab"),{dispose:()=>a.dispose()}}});var Hv=5e3,Un=class{constructor(o){this.open=o;this.element.className="yr-side",this.element.hidden=!0;let a=document.createElement("div");a.className="yr-side-head",a.textContent="Reviews",this.element.append(a,this.list),this.load(),window.setInterval(()=>{this.load()},Hv)}element=document.createElement("section");list=document.createElement("ul");shown="";async load(){let o=await Tt.list().catch(()=>[]),a=JSON.stringify(o);if(a===this.shown)return;this.shown=a;let d=c=>c.status==="open"||c.status==="changes_requested"?0:1;o.sort((c,h)=>d(c)-d(h)||h.id.localeCompare(c.id)),this.list.replaceChildren();for(let c of o){let h=document.createElement("li");h.className=`yr-side-item yr-${c.status}`,h.title=`${c.id}
${c.kind} ${c.ref}
${c.status}${c.elsewhere?`
in ${c.elsewhere}`:""}`;let v=document.createElement("span");v.className="yr-label",v.textContent=c.title||c.id;let m=document.createElement("span");m.className="yr-count",m.textContent=c.open?String(c.open):c.status==="open"?"":c.status.replace("_"," "),h.append(v,m),h.addEventListener("click",()=>this.open(c.id)),this.list.append(h)}this.element.hidden=o.length===0}};var Yn=class{constructor(o,a,d){this.open=a;this.onWatch=d;this.element=document.createElement("nav"),this.element.className="yt",this.filterBox=document.createElement("input"),this.filterBox.type="search",this.filterBox.placeholder="Filter loaded files",this.filterBox.addEventListener("input",()=>this.filter()),this.list=document.createElement("div"),this.list.className="yt-list",this.element.append(this.filterBox,this.list);for(let c of o){let h={name:c.name,kind:c.exists?"dir":"broken"},v=c.live==="notify"?"live":c.live==="poll"?"polled every 2 s":"not live",m=c.exists?`${c.path}
${v}`:`${c.path} is not on this machine`;this.list.append(this.item(c.name,h,0,m))}}nodes=new Map;selected;element;list;filterBox;expanded(){return[...this.nodes.values()].filter(o=>o.loaded&&o.children&&!o.children.hidden&&o.item.isConnected).map(o=>o.path)}describe(o,a,d){o.title=[a,d.link?`\u2192 ${d.link}`:"",d.size!==void 0?pt(d.size):"",oi(d.mtime)].filter(Boolean).join(`
`)}item(o,a,d,c){let h=document.createElement("div");h.className="yt-item",h.dataset.key=`${a.kind}/${a.name}`;let v=document.createElement("div");v.className=`yt-row yt-${a.kind}${d===0?" yt-root":""}`,v.style.paddingLeft=`${d*12+6}px`,v.dataset.path=o,c?v.title=c:this.describe(v,o,a);let m=document.createElement("span");m.className="yt-twisty",m.textContent=a.kind==="dir"?"\u25B8":"";let w=document.createElement("span");w.className="yt-label",w.textContent=a.name+(a.link?" \u2197":""),v.append(m,w),h.append(v);let x={path:o,depth:d,item:h,row:v,loaded:!1,count:0};return this.nodes.set(o,x),a.kind==="dir"?v.addEventListener("click",()=>this.toggle(x)):(a.kind==="file"||a.kind==="other")&&(v.addEventListener("click",()=>(this.select(v),this.open(o,!1))),v.addEventListener("dblclick",()=>this.open(o,!0))),h}async toggle(o){let a=o.row.querySelector(".yt-twisty");if(o.children&&!o.children.hidden){o.children.hidden=!0,a.textContent="\u25B8",this.onWatch();return}a.textContent="\u25BE",o.children||(o.children=document.createElement("div"),o.item.append(o.children)),o.children.hidden=!1,o.loaded||(o.loaded=!0,await this.page(o,0)),this.onWatch()}async page(o,a){let d=o.children,c=o.depth+1,h=this.note(d,"loading\u2026",c);try{let v=await it.list(o.path,a);h.remove();for(let m of v.entries)d.append(this.item(`${o.path}/${m.name}`,m,c));o.count+=v.entries.length,o.mtime=v.mtime,this.tail(o,v.total,v.next)}catch(v){h.textContent=String(v.message)}this.filter()}tail(o,a,d){let c=o.children,h=o.depth+1;for(let v of c.querySelectorAll(":scope > .yt-note"))v.remove();if(a===0&&this.note(c,"empty",h),d!==void 0){let v=this.note(c,`show more (${d} of ${a})`,h);v.classList.add("yt-more"),v.addEventListener("click",()=>(v.remove(),this.page(o,d)))}}dirChanged(o){let a=this.nodes.get(o.path);if(!a||!a.loaded||!a.children||o.exists&&o.mtime===a.mtime)return;let d=async()=>{if(!o.exists){a.children.replaceChildren(),this.note(a.children,"deleted on disk",a.depth+1),a.count=0,a.mtime=void 0;return}let c=Math.max(a.count,1),h=[],v=0,m=0,w;for(;v!==void 0&&h.length<c;){let z=await it.list(a.path,v);h.push(...z.entries),v=z.next,m=z.total,w=z.mtime}let x=a.children,S=new Map;for(let z of x.querySelectorAll(":scope > .yt-item"))S.set(z.dataset.key,z);let P=h.map(z=>{let L=`${a.path}/${z.name}`,V=S.get(`${z.kind}/${z.name}`);return V?(S.delete(`${z.kind}/${z.name}`),this.describe(V.querySelector(":scope > .yt-row"),L,z),V):this.item(L,z,a.depth+1)});for(let z of S.values())this.forget(z);x.replaceChildren(...P),a.count=h.length,a.mtime=w,this.tail(a,m,v),this.filter(),this.onWatch()};a.busy=(a.busy??Promise.resolve()).then(d,d).catch(()=>{})}forget(o){let a=o.querySelector(":scope > .yt-row")?.dataset.path;if(a)for(let d of[...this.nodes.keys()])(d===a||d.startsWith(`${a}/`))&&this.nodes.delete(d)}note(o,a,d){let c=document.createElement("div");return c.className="yt-row yt-note",c.style.paddingLeft=`${d*12+18}px`,c.textContent=a,o.append(c),c}select(o){this.selected?.classList.remove("yt-selected"),o.classList.add("yt-selected"),this.selected=o}async reveal(o){let a=o.split("/");for(let c=1;c<a.length;c++){let h=this.nodes.get(a.slice(0,c).join("/"));if(!h)return;(!h.children||h.children.hidden)&&await this.toggle(h)}let d=this.nodes.get(o);d&&(this.select(d.row),d.row.scrollIntoView({block:"nearest"}))}filter(){let o=this.filterBox.value.trim().toLowerCase(),a=d=>{let c=d.querySelector(":scope > .yt-row"),h=d.querySelector(":scope > div:not(.yt-row)"),v=!1;if(h)for(let x of Array.from(h.children))x.classList.contains("yt-item")?v=a(x)||v:x.hidden=o!=="";let m=c?.querySelector(".yt-label")?.textContent?.toLowerCase()??"",w=o===""||v||m.includes(o);return d.hidden=!w,w};for(let d of Array.from(this.list.children))a(d),d.hidden=!1}};var Bv=au(Ml(),1),Kn=Bv;var Ol=window.matchMedia("(prefers-color-scheme: dark)"),Ll=()=>Ol.matches?Kn.themeDark:Kn.themeLight;function Tr(r){let o=decodeURIComponent(r.replace(/^#/,""));if(!o)return null;let a=/^(.*):L(\d+)(?:-(\d+))?$/.exec(o);return a?{path:a[1],from:Number(a[2]),to:Number(a[3]??a[2])}:{path:o}}var Cr=class{element=document.createElement("div");title=document.createElement("span");init(o){this.element.className="yw-tab",this.title.className="yw-tab-title";let a=document.createElement("span");a.className="yw-tab-close",a.textContent="\xD7",a.title="Close",a.addEventListener("click",d=>(d.stopPropagation(),o.api.close())),this.element.addEventListener("auxclick",d=>d.button===1&&o.api.close()),this.element.addEventListener("dblclick",()=>o.api.updateParameters({pinned:!0})),this.element.append(this.title,a),this.render(o.params)}update(o){this.render(o.params)}render(o){this.title.textContent=o.path==="changes:"?"Changes":ri(o.path),this.element.title=o.path,this.element.classList.toggle("yw-preview",!o.pinned),this.element.classList.toggle("yw-changed",!!o.changed),this.element.classList.toggle("yw-gone",!!o.gone),this.element.title=o.gone?`${o.path} (deleted on disk)`:o.path}},Gr=class{constructor(o){this.bench=o;this.element.className="yw-panel",this.element.addEventListener("pointerdown",()=>this.pin(),{capture:!0})}element=document.createElement("div");viewer;loads=0;params;stat;api;init(o){this.api=o.api,this.params=o.params,o.api.onDidVisibilityChange(a=>{a.isVisible&&this.params.changed&&this.api.updateParameters({changed:!1})}),this.load()}update(o){let a={...this.params,...o.params},d=a.path!==this.params.path||a.kind!==this.params.kind;a.path!==this.params.path&&this.bench.watchChanged(),this.params=a,d&&this.load()}async changed(o){if(!o.exists){this.params.gone||this.api.updateParameters({gone:!0}),this.bench.refreshStatus();return}let a=this.stat;if(!this.params.gone&&a&&a.size===o.size&&a.mtime===o.mtime)return;this.params.gone&&this.api.updateParameters({gone:!1});let d=a&&{...a,size:o.size,mtime:o.mtime};(d&&this.viewer?.follow?await this.viewer.follow(d).catch(()=>!1):!1)?this.stat=d:await this.load(),this.api.isVisible||this.api.updateParameters({changed:!0}),this.bench.refreshStatus()}get gone(){return!!this.params.gone}pin(){this.params.pinned||this.api.updateParameters({pinned:!0})}get path(){return this.params.path}reveal(o,a){this.viewer?.reveal?.(o,a)}status(){let o=this.stat,a=this.params.gone?"deleted on disk":o?[pt(o.size),oi(o.mtime)].filter(Boolean).join(" \xB7 "):"";return{path:this.params.path==="changes:"?"Changes":this.params.path,left:a,right:this.viewer?.status?.()??""}}async load(){this.viewer?.dispose?.(),this.viewer=void 0;let o=++this.loads,a=document.createElement("div");a.className="yw-box",this.element.replaceChildren(a);let d=this.params.path;try{let c=d.startsWith("review:"),h=d==="changes:";if(this.stat=c?{path:d,kind:"review",mime:"review",text:!1}:h?{path:d,kind:"changes",mime:"changes",text:!1}:await it.stat(d),o!==this.loads)return;let v=c?xr:this.params.kind&&Od(this.params.kind)||Ld(this.stat),m={path:d,stat:this.stat,open:S=>this.bench.open(S,{pin:!0}),switchTo:S=>this.api.updateParameters({kind:S,pinned:!0}),onLines:(S,P)=>this.bench.onLines(this,S,P),onStatus:()=>this.bench.refreshStatus()},w=await v.mount(a,m);if(o!==this.loads){w.dispose?.();return}this.viewer=w;let x=this.bench.takeReveal(d);x&&this.viewer.reveal?.(x.from,x.to)}catch(c){if(c instanceof tt&&c.status===404&&this.bench.restoring){this.api.close();return}o===this.loads&&Tn(a,`${d}: ${c.message}`)}o===this.loads&&this.bench.loaded(this)}dispose(){this.viewer?.dispose?.()}},Pr=class{element=document.createElement("div");init(){this.element.className="yw-watermark",this.element.innerHTML="<p>Open a file from the tree.</p><p>A click previews it, a double click keeps it open.<br>Drag a tab to an edge to split, or press <kbd>Ctrl</kbd>/<kbd>\u2318</kbd> <kbd>\\</kbd>.</p>"}},zr=class{constructor(o,a){this.bench=o;this.group=a}element=document.createElement("div");init(){this.element.className="yw-actions";let o=document.createElement("button");o.innerHTML='<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor"/><line x1="8" y1="2.5" x2="8" y2="13.5" stroke="currentColor"/></svg>',o.title="Split right (Ctrl/\u2318 \\)",o.addEventListener("click",()=>this.bench.splitRight(this.group.activePanel)),this.element.append(o)}dispose(){}},Jn=class{constructor(o,a,d,c,h){this.storageKey=a;this.onStatus=d;this.onActive=c;this.onWatch=h;this.api=Kn.createDockview(o,{theme:Ll(),createComponent:({id:m})=>{let w=new Gr(this);return this.panels.set(m,w),w},createTabComponent:()=>new Cr,createWatermarkComponent:()=>new Pr,createRightHeaderActionComponent:m=>new zr(this,m)}),Ol.addEventListener("change",()=>this.api.updateOptions({theme:Ll()})),this.api.onDidActivePanelChange(()=>{let m=this.active();this.onActive(m?.path??null),this.refreshStatus()}),this.api.onDidRemovePanel(m=>{this.panels.delete(m.id),this.onWatch()}),this.api.onDidAddPanel(()=>this.onWatch());let v;this.api.onDidLayoutChange(()=>{window.clearTimeout(v),v=window.setTimeout(()=>this.save(),300)}),window.addEventListener("keydown",m=>{(m.ctrlKey||m.metaKey)&&m.key==="\\"&&(m.preventDefault(),this.splitRight(this.api.activePanel))})}api;restoring=!1;panels=new Map;reveals=new Map;counter=0;watchChanged(){this.onWatch()}paths(){return[...new Set([...this.panels.values()].map(o=>o.path))]}fileChanged(o){for(let a of this.panels.values())a.path===o.path&&a.changed(o)}active(){let o=this.api.activePanel;return o?this.panels.get(o.id):void 0}refreshStatus(){this.onStatus(this.active()?.status()??null)}loaded(o){this.active()===o&&this.onActive(o.path),this.refreshStatus()}onLines(o,a,d){if(this.active()===o){let c=a===d?`L${a}`:`L${a}-${d}`;history.replaceState(null,"",`#${encodeURI(o.path)}:${c}`)}}takeReveal(o){let a=this.reveals.get(o);return this.reveals.delete(o),a}newId(o){return`${o}#${++this.counter}-${Date.now().toString(36)}`}open(o,a={}){let d=this.api.activeGroup,c=d?.panels.find(m=>m.params?.path===o);if(a.from!==void 0&&this.reveals.set(o,{from:a.from,to:a.to}),c){c.api.setActive(),a.pin&&c.api.updateParameters({pinned:!0}),a.from!==void 0&&(this.panels.get(c.id)?.reveal(a.from,a.to),this.reveals.delete(o));return}let h=d?.panels.find(m=>!m.params?.pinned),v={path:o,pinned:!!a.pin};if(h){h.api.updateParameters(v),h.api.setActive();return}this.api.addPanel({id:this.newId(o),component:"viewer",tabComponent:"tab",params:v,...d?{position:{referenceGroup:d}}:{}})}splitRight(o){if(!o)return;let a={...o.params,pinned:!0};o.api.updateParameters({pinned:!0}),this.api.addPanel({id:this.newId(a.path),component:"viewer",tabComponent:"tab",params:a,position:{referenceGroup:o.group,direction:"right"}})}save(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.api.toJSON()))}catch{}}restore(){let o=null;try{o=localStorage.getItem(this.storageKey)}catch{return}if(o){this.restoring=!0;try{this.api.fromJSON(JSON.parse(o))}catch{this.api.clear()}window.setTimeout(()=>this.restoring=!1,2e3)}}};var Xn=class{constructor(o,a){this.onChange=o;this.onState=a}source;paths=new Set;timer;set(o){let a=new Set(o);a.size===this.paths.size&&[...a].every(d=>this.paths.has(d))||(this.paths=a,window.clearTimeout(this.timer),this.timer=window.setTimeout(()=>this.connect(),300))}connect(){if(this.source?.close(),this.source=void 0,this.paths.size===0){this.onState("idle");return}let o=[...this.paths].map(d=>`watch=${encodeURIComponent(d)}`).join("&"),a=new EventSource(`${ut}/api/events?${o}`);this.onState("connecting"),a.addEventListener("open",()=>this.onState("live")),a.addEventListener("error",()=>this.onState("connecting")),a.addEventListener("change",d=>this.onChange(JSON.parse(d.data))),this.source=a}};var Rl="yajna-files:sidebar";async function Fv(){document.body.className="yc-page";let r=await it.info().catch(()=>null);document.title=`${r?.notebook??"notebook"} \xB7 changes`;let o=new Ii(kr(),(a,d)=>d?history.replaceState(null,"",Sr(a)):history.pushState(null,"",Sr(a)),(a,d)=>location.href=`${Yt(d)}/files/#${encodeURI(a)}`);document.body.replaceChildren(o.element),window.addEventListener("popstate",()=>o.go(kr(),!1))}function Uv(r){return ut===Ei?r.find(o=>o.current):r.find(o=>ut.endsWith(`/${o.url.replace(/\/$/,"")}`))}async function Yv(r){let o=document.querySelector("#worktree"),a="",d=async()=>{let c=await Dr().catch(()=>null);if(!c)return;let h=Uv(c),v=h?(h.changed??0)+(h.staged??0)+(h.untracked??0)+(h.conflicted??0):0;r.textContent=v?String(v):"";let m=JSON.stringify(c.map(w=>w.name));m===a||c.length<2||(a=m,o.replaceChildren(...c.map(w=>new Option(w.name,w.name,!1,w===h))),o.hidden=!1,o.onchange=()=>{let w=c.find(x=>x.name===o.value);w&&(location.href=`${Yt(w)}/files/`)})};await d(),window.setInterval(()=>{d()},5e3)}async function qv(){if(/\/files\/changes\/?$/.test(location.pathname))return Fv();let r=new URLSearchParams(location.search).get("token");r&&(Ad(r),history.replaceState(null,"",location.pathname+location.hash));let[o,a]=await Promise.all([it.info(),it.roots()]);Id(o.local===!0),document.title=`${o.notebook} \xB7 files`,document.querySelector("#notebook").textContent=o.notebook,document.querySelector("#version").textContent=`yajna ${o.version}`;let d=document.querySelector("#status-path"),c=document.querySelector("#status-left"),h=document.querySelector("#status-right"),v=document.querySelector("#status-live"),m=new Map(a.map(te=>[te.name,te.live])),w="idle",x=null,S=()=>{let te=x?m.get(x.path.split("/")[0]):void 0,ke=!x||!te?"":te==="off"?"not live":w==="connecting"?"reconnecting\u2026":te==="poll"?"live, polled every 2 s":"live";v.textContent=ke,v.className=ke.startsWith("live")?"on":""},P=te=>{x=te,d.textContent=te?.path??"",c.textContent=te?.left??"",h.textContent=te?.right??"",S()},z,L=new Xn(te=>te.kind==="dir"?H.dirChanged(te):z.fileChanged(te),te=>(w=te,S())),V=()=>L.set([...z.paths().filter(te=>!te.startsWith("review:")&&te!=="changes:"),...H.expanded()]),H=new Yn(a,(te,ke)=>z.open(te,{pin:ke}),()=>V()),N=new Un(te=>z.open(`review:${te}`,{pin:!0})),G=document.createElement("div");G.className="yc-side",G.title="What is changed, staged and committed in the worktrees";let O=document.createElement("span");O.textContent="Changes";let ye=document.createElement("span");ye.className="yr-count",G.append(O,ye),G.addEventListener("click",()=>z.open("changes:",{pin:!0})),document.querySelector("#sidebar").append(G,N.element,H.element),Yv(ye),z=new Jn(document.querySelector("#editor"),`yajna-files:${o.notebook}`,P,te=>{te&&Tr(location.hash)?.path!==te&&history.replaceState(null,"",`#${encodeURI(te)}`)},()=>V());let R=location.hash;z.restore();let U=(te=location.hash)=>{let ke=Tr(te);ke&&(z.open(ke.path,{pin:!0,from:ke.from,to:ke.to}),H.reveal(ke.path))};window.addEventListener("hashchange",()=>U()),U(R);let F=document.querySelector("#sidebar"),J=Number(localStorage.getItem(Rl)??0);J>120&&(F.style.width=`${J}px`);let A=document.querySelector("#sash");A.addEventListener("pointerdown",te=>{A.setPointerCapture(te.pointerId);let ke=Ne=>F.style.width=`${Math.max(120,Math.min(Ne.clientX,window.innerWidth-200))}px`,nt=()=>{A.removeEventListener("pointermove",ke);try{localStorage.setItem(Rl,String(F.offsetWidth))}catch{}};A.addEventListener("pointermove",ke),A.addEventListener("pointerup",nt,{once:!0})})}qv().catch(r=>{document.body.textContent=`The files viewer could not start: ${r.message}`});
/*! Bundled license information:

dockview-core/dist/dockview-core.js:
  (**
   * dockview-core
   * @version 8.6.1
   * @link https://github.com/dockview/dockview
   * @license MIT
   *)
*/
