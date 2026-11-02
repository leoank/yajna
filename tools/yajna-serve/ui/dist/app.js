import{A as me,Aa as fa,B as ia,Ba as mi,C as vi,Ca as ba,D as de,Da as To,E as na,Ea as wa,F as oa,G as Zi,Ga as $t,H as ra,Ha as _a,I as sa,J as aa,K as Co,L as da,M as la,N as ca,O as Qi,P as Go,Q as Jt,R as ha,S as en,a as jt,aa as ua,b as mt,ba as ie,c as Ks,d as Xs,e as Zs,g as Qs,h as pi,ha as tn,i as ce,j as Dt,ja as pa,k as je,l as Lt,m as Ot,ma as va,n as ea,na as nn,o as Ae,oa as gi,pa as Po,q as Le,qa as zo,r as ct,s as Ki,u as So,v as ft,w as Xi,x as ta,y as Be,ya as ga,z as Rt,za as ma}from"./chunks/chunk-LXR5EDXL.js";import{a as Yh,b as qh}from"./chunks/chunk-Y6SLVHK3.js";var _l=Yh((Wn,wl)=>{(function(r,o){typeof Wn=="object"&&typeof wl<"u"?o(Wn):typeof define=="function"&&define.amd?define(["exports"],o):(r=typeof globalThis<"u"?globalThis:r||self,o(r["dockview-core"]={}))})(Wn,function(r){if(Object.defineProperties(r,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),typeof document<"u"){let e=document.createElement("style");e.textContent=`.dv-drop-target-container {
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
}`,document.head.appendChild(e)}var o,a=class{constructor(){}},d=class extends a{constructor(e,t,i,n){super(),this.viewId=e,this.groupId=t,this.panelId=i,this.tabGroupId=n}},h=class extends a{constructor(e,t){super(),this.viewId=e,this.paneId=t}},u=class ml{constructor(){}static getInstance(){return ml.INSTANCE}hasData(t){return t&&t===this.proto}clearData(t){this.hasData(t)&&(this.proto=void 0,this.data=void 0)}getData(t){if(this.hasData(t))return this.data}setData(t,i){i&&(this.data=t,this.proto=i)}};o=u,u.INSTANCE=new o;function g(){let e=u.getInstance();if(e.hasData(d.prototype))return e.getData(d.prototype)[0]}function b(){let e=u.getInstance();if(e.hasData(h.prototype))return e.getData(h.prototype)[0]}let w;(function(e){e.NONE={dispose:()=>{}};function t(i){return{dispose:()=>{i()}}}e.from=t})(w||(w={}));var D=class{get isDisposed(){return this._isDisposed}constructor(...e){this._isDisposed=!1,this._disposables=new Set(e)}addDisposables(...e){e.forEach(t=>this._disposables.add(t))}removeDisposable(e){this._disposables.delete(e)}dispose(){this._isDisposed||(this._isDisposed=!0,this._disposables.forEach(e=>e.dispose()),this._disposables.clear())}},C=class{constructor(){this._disposable=w.NONE}get value(){return this._disposable===w.NONE?void 0:this._disposable}set value(e){this._disposable&&this._disposable.dispose(),this._disposable=e}dispose(){this._disposable&&(this._disposable.dispose(),this._disposable=w.NONE)}};let P;(function(e){e.any=(...t)=>i=>{let n=t.map(s=>s(i));return{dispose:()=>{n.forEach(s=>{s.dispose()})}}}})(P||(P={}));var T=class{constructor(){this._defaultPrevented=!1}get defaultPrevented(){return this._defaultPrevented}preventDefault(){this._defaultPrevented=!0}},R=class{constructor(){this._isAccepted=!1}get isAccepted(){return this._isAccepted}accept(){this._isAccepted=!0}},V=class{constructor(){this.events=new Map}get size(){return this.events.size}add(e,t){this.events.set(e,t)}delete(e){this.events.delete(e)}clear(){this.events.clear()}},j=class fl{static create(){var t;return new fl((t=new Error("listener stacktrace").stack)!==null&&t!==void 0?t:"")}constructor(t){this.value=t}print(){console.warn("dockview: stacktrace",this.value)}},H=class{constructor(e,t){this.callback=e,this.stacktrace=t}},G=class lt{static setLeakageMonitorEnabled(t){t!==lt.ENABLE_TRACKING&&lt.MEMORY_LEAK_WATCHER.clear(),lt.ENABLE_TRACKING=t}get value(){return this._last}constructor(t){this.options=t,this._listeners=[],this._disposed=!1}get event(){return this._event||(this._event=t=>{var i;!((i=this.options)===null||i===void 0)&&i.replay&&this._last!==void 0&&t(this._last);let n=new H(t,lt.ENABLE_TRACKING?j.create():void 0);return this._listeners.push(n),{dispose:()=>{let s=this._listeners.indexOf(n);s>-1?this._listeners.splice(s,1):lt.ENABLE_TRACKING}}},lt.ENABLE_TRACKING&&lt.MEMORY_LEAK_WATCHER.add(this._event,j.create())),this._event}fire(t){var i;if(this._pauseTokens!==void 0&&this._pauseTokens.size>0)return;!((i=this.options)===null||i===void 0)&&i.replay&&(this._last=t);let n=this._listeners,s=n.length;if(s!==0){if(s===1){n[0].callback(t);return}for(let l of n.slice())l.callback(t)}}pause(){var t;let i={};return(t=this._pauseTokens)!==null&&t!==void 0||(this._pauseTokens=new Set),this._pauseTokens.add(i),w.from(()=>{var n;return(n=this._pauseTokens)===null||n===void 0?void 0:n.delete(i)})}dispose(){this._disposed||(this._disposed=!0,this._listeners.length>0&&(lt.ENABLE_TRACKING?queueMicrotask(()=>{for(let i of this._listeners){var t;console.warn("dockview: stacktrace",(t=i.stacktrace)===null||t===void 0?void 0:t.print())}this._listeners=[]}):this._listeners=[]),lt.ENABLE_TRACKING&&this._event&&lt.MEMORY_LEAK_WATCHER.delete(this._event))}};G.ENABLE_TRACKING=!1,G.MEMORY_LEAK_WATCHER=new V;function O(e,t,i,n){return e.addEventListener(t,i,n),{dispose:()=>{e.removeEventListener(t,i,n)}}}var _e=class{constructor(){this._onFired=new G,this._currentFireCount=0,this._queued=!1,this.onEvent=e=>{let t=this._currentFireCount;return this._onFired.event(()=>{this._currentFireCount>t&&e()})}}fire(){this._currentFireCount++,!this._queued&&(this._queued=!0,queueMicrotask(()=>{this._queued=!1,this._onFired.fire()}))}dispose(){this._onFired.dispose()}},$=class extends D{constructor(e){super(),this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._value=null,this.addDisposables(this._onDidChange,B(e,t=>{let i=t.target.scrollWidth>t.target.clientWidth,n=t.target.scrollHeight>t.target.clientHeight;this._value={hasScrollX:i,hasScrollY:n},this._onDidChange.fire(this._value)}))}};function B(e,t){let i=new Set,n=new ResizeObserver(s=>{let l=!1,c;c=requestAnimationFrame(()=>{l=!0,c!==void 0&&i.delete(c);let p=s[0];t(p)}),l||i.add(c)});return n.observe(e),{dispose:()=>{n.unobserve(e),n.disconnect();for(let s of i)cancelAnimationFrame(s);i.clear()}}}let L=(e,...t)=>{for(let i of t)e.classList.contains(i)&&e.classList.remove(i)},F=(e,...t)=>{for(let i of t)e.classList.contains(i)||e.classList.add(i)},E=(e,t,i)=>{let n=e.classList.contains(t);i&&!n&&e.classList.add(t),!i&&n&&e.classList.remove(t)};function xe(e,t){for(;e;){if(e===t)return!0;e=e.parentNode}return!1}function ut(e){return new pt(e)}var pt=class extends D{constructor(e){super(),this._onDidFocus=new G,this.onDidFocus=this._onDidFocus.event,this._onDidBlur=new G,this.onDidBlur=this._onDidBlur.event,this.addDisposables(this._onDidFocus,this._onDidBlur);let t=xe(Ai(e),e),i=!1,n=()=>{i=!1,t||(t=!0,this._onDidFocus.fire())},s=()=>{t&&(i=!0,globalThis.setTimeout(()=>{i&&(i=!1,t=!1,this._onDidBlur.fire())},0))};this._refreshStateHandler=()=>{xe(Ai(e),e)!==t&&(t?s():n())},this.addDisposables(O(e,"focus",n,!0)),this.addDisposables(O(e,"blur",s,!0))}refreshState(){this._refreshStateHandler()}};let Xe="dv-quasiPreventDefault";function Re(e){e[Xe]=!0}function si(e){return e[Xe]}function ai(e,t){var i,n;let s=(i=(n=e.composedPath)===null||n===void 0?void 0:n.call(e))!==null&&i!==void 0?i:[];if(s.length>0)return t.some(c=>s.includes(c));let l=e.target;return l instanceof Node&&t.some(c=>c.contains(l))}function Y(e){let t=[],i=e.getRootNode();for(;te(i);)t.push(i),i=i.host.getRootNode();return t}function re(e,t){let i=t?.getRootNode(),n=e,s=n.getRootNode();for(;s!==i&&te(s);)n=s.host,s=n.getRootNode();return n}function Q(e,t,i={}){let n=Array.from(t),{nonce:s}=i,l=typeof s=="function"?s(e):s;for(let c of n){if(c.href){let m=e.createElement("link");m.href=c.href,m.type=c.type,m.rel="stylesheet",l&&m.setAttribute("nonce",l),e.head.appendChild(m);continue}let p=[];try{c.cssRules&&(p=Array.from(c.cssRules).map(m=>m.cssText))}catch(m){console.warn("dockview: failed to access stylesheet rules due to security restrictions",m)}let v=e.createDocumentFragment();for(let m of p){let f=e.createElement("style");l&&f.setAttribute("nonce",l),f.appendChild(e.createTextNode(m)),v.appendChild(f)}e.head.appendChild(v)}}function ne(e){let{left:t,top:i,width:n,height:s}=e.getBoundingClientRect();return{left:t+window.scrollX,top:i+window.scrollY,width:n,height:s}}function ae(e){let t=e;for(;t?.parentNode;){if(t.parentNode===document)return!0;t.parentNode instanceof DocumentFragment?t=t.parentNode.host:t=t.parentNode}return!1}function te(e){return!!e&&e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&"host"in e&&!!e.host}function he(e){var t;let i=e.getRootNode();return i!==e&&typeof i.elementsFromPoint=="function"?i:(t=e.ownerDocument)!==null&&t!==void 0?t:document}function le(e,t){e.dataset.testid=t}function se(e,t){let i=[];function n(s){if(s.nodeType===Node.ELEMENT_NODE){e.includes(s.tagName)&&i.push(s),s.shadowRoot&&n(s.shadowRoot);for(let l of s.children)n(l)}}return n(t instanceof Document?t.documentElement:t),i}function pe(e=document){let t=se(["IFRAME","WEBVIEW"],e),i=new WeakMap;for(let n of t)i.set(n,n.style.pointerEvents),n.style.pointerEvents="none";return{release:()=>{for(let s of t){var n;s.style.pointerEvents=(n=i.get(s))!==null&&n!==void 0?n:"auto"}t.splice(0,t.length)}}}function De(e=document){let t=e instanceof Document?e:e.ownerDocument,i=t?.documentElement;if(!t||!i)return{release:()=>{}};let n=["user-select","-webkit-user-select"],s=n.map(c=>[c,i.style.getPropertyValue(c)]);for(let c of n)i.style.setProperty(c,"none");let l=c=>c.preventDefault();return t.addEventListener("selectstart",l),{release:()=>{t.removeEventListener("selectstart",l);for(let[c,p]of s)p?i.style.setProperty(c,p):i.style.removeProperty(c)}}}function Ce(e){function t(s){let l=[];for(let c=0;c<s.classList.length;c++)l.push(s.classList.item(c));return l}let i,n=e;for(;n!==null&&(i=t(n).find(s=>s.startsWith("dockview-theme-")),typeof i!="string");){if(n.parentElement===null){let s=n.getRootNode();n=te(s)?s.host:null;continue}n=n.parentElement}return i}var $e=class{constructor(e){this.element=e,this._classNames=[]}setClassNames(e){for(let t of this._classNames)E(this.element,t,!1);this._classNames=e.split(" ").filter(t=>t.trim().length>0);for(let t of this._classNames)E(this.element,t,!0)}};let zi=100;function Tt(e,t){let i=ne(e),n=ne(t);return!(i.left<n.left||i.left+i.width>n.left+n.width||i.top<n.top||i.top+i.height>n.top+n.height)}function Ft(e){let t=new G,i=e.screenX,n=e.screenY,s,l=0,c=!1,p=()=>{if(c||e.closed)return;let m=e.screenX,f=e.screenY;(m!==i||f!==n)&&(clearTimeout(s),s=setTimeout(()=>{t.fire()},zi),i=m,n=f),l=requestAnimationFrame(p)};p();let v=t.dispose.bind(t);return t.dispose=()=>{c||(c=!0,cancelAnimationFrame(l),clearTimeout(s)),v()},t}function Un(e,t){let i;return new D(O(e,"resize",()=>{clearTimeout(i),i=setTimeout(()=>{t()},zi)}))}function Ti(e,t,i){var n;let s=(n=i?.buffer)!==null&&n!==void 0?n:10,l=e.getBoundingClientRect(),c=t.getBoundingClientRect(),p=0,v=0,m=l.left-c.left,f=l.top-c.top,_=l.bottom-c.bottom,y=l.right-c.right;m<s?p=s-m:y>s&&(p=-s-y),f<s?v=s-f:_>s&&(v=-_-s),(p!==0||v!==0)&&(e.style.transform=`translate(${p}px, ${v}px)`)}function Ue(e){let t=e;for(;t&&(t.style.zIndex==="auto"||t.style.zIndex==="");)t=t.parentElement;return t}function Ne(e=document){var t,i;let n=(t=e.defaultView)===null||t===void 0||(i=t.matchMedia)===null||i===void 0?void 0:i.call(t,"(prefers-reduced-motion: reduce)");return!!n?.matches}function di(e){let t=e.ownerDocument.defaultView;if(!t)return"";let i=e;for(;i;){let n=t.getComputedStyle(i).backgroundColor;if(n&&n!=="transparent"&&!/,\s*0\)\s*$/.test(n))return n;i=i.parentElement}return""}function Ai(e){var t;let i=e.getRootNode(),n=i.nodeType===Node.DOCUMENT_NODE?i:e.ownerDocument;return n&&typeof n.hasFocus=="function"&&!n.hasFocus()?null:(t=i.activeElement)!==null&&t!==void 0?t:null}function yr(e){var t;let i=e.getRootNode();return te(i)?i:((t=e.ownerDocument)!==null&&t!==void 0?t:document).body}function xr(e,t,i,n,s,l,c){try{var p=e[l](c),v=p.value}catch(m){i(m);return}p.done?t(v):Promise.resolve(v).then(n,s)}function Dr(e){return function(){var t=this,i=arguments;return new Promise(function(n,s){var l=e.apply(t,i);function c(v){xr(l,n,s,c,p,"next",v)}function p(v){xr(l,n,s,c,p,"throw",v)}c(void 0)})}}function kl(e){let t=Yn(e);if(t)throw t}let Sl=new Set(["javascript:","data:","blob:","vbscript:","file:"]),Cl=250;function Yn(e,t=globalThis.location){let i;try{i=new URL(e,t.href)}catch{return new Error(`dockview: invalid popout URL: ${e}`)}if(Sl.has(i.protocol))return new Error(`dockview: popout URL must not use the "${i.protocol}" protocol, which would run in the opener's context; got: ${e}`);if(!(i.protocol===t.protocol&&i.host===t.host))return new Error(`dockview: popout URL must be same-origin with the page (${t.protocol}//${t.host}); got: ${e}`)}var Gl=class extends D{get window(){var e,t;return(e=(t=this._window)===null||t===void 0?void 0:t.value)!==null&&e!==void 0?e:null}get failure(){return this._failure}constructor(e,t,i){super(),this.target=e,this.className=t,this.options=i,this._onWillClose=new G,this.onWillClose=this._onWillClose.event,this._onDidClose=new G,this.onDidClose=this._onDidClose.event,this._window=null,this.addDisposables(this._onWillClose,this._onDidClose,{dispose:()=>{this.close()}})}dimensions(){if(!this._window)return null;let e=this._window.value.screenX;return{top:this._window.value.screenY,left:e,width:this._window.value.innerWidth,height:this._window.value.innerHeight}}close(){var e,t;let i=this._window;i&&(this._window=null,this._onWillClose.fire(),(e=(t=this.options).onWillClose)===null||e===void 0||e.call(t,{id:this.target,window:i.value}),i.disposable.dispose(),this._onDidClose.fire())}open(){var e=this;return Dr(function*(){var t,i;if(e._window)throw new Error("instance of popout window is already open");let n=`${e.options.url}`;kl(n);let s=Object.entries({top:e.options.top,left:e.options.left,width:e.options.width,height:e.options.height}).map(([v,m])=>`${v}=${m}`).join(","),l=window.open(n,e.target,s);if(!l)return e._failure={reason:"blocked"},null;let c=new D;e._window={value:l,disposable:c},c.addDisposables(w.from(()=>{l.close()}),e.watchForClose(l),O(globalThis.window,"beforeunload",()=>{e.close()}));let p=e.createPopoutWindowContainer();return e.className&&p.classList.add(e.className),(t=(i=e.options).onDidOpen)===null||t===void 0||t.call(i,{id:e.target,window:l}),new Promise(v=>{let m=f=>{e._failure={reason:"unscriptable",error:f instanceof Error?f:new Error(String(f))},e.close(),v(null)};try{l.addEventListener("unload",()=>{})}catch(f){m(f);return}c.addDisposables(e.onWillClose(()=>{var f;(f=e._failure)!==null&&f!==void 0||(e._failure={reason:"closed"}),v(null)})),l.addEventListener("load",()=>{try{var f,_,y;let S=l.document;S.title=document.title,S.body.appendChild(p),Q(S,[...Array.from(globalThis.document.styleSheets),...(f=globalThis.document.adoptedStyleSheets)!==null&&f!==void 0?f:[]],{nonce:e.options.nonce});let z=[];for(let M=(_=(y=e.options).styleRoot)===null||_===void 0?void 0:_.call(y);te(M);M=M.host.getRootNode()){var x,k;z.push(...Array.from((x=M.styleSheets)!==null&&x!==void 0?x:[]),...(k=M.adoptedStyleSheets)!==null&&k!==void 0?k:[])}z.length>0&&Q(S,z,{nonce:e.options.nonce}),O(l,"beforeunload",()=>{e.close()}),v(p)}catch(S){m(S)}})})})()}watchForClose(e){if(typeof e.closed!="boolean")return w.NONE;let t=setInterval(()=>{e.closed&&this.close()},Cl);return w.from(()=>{clearInterval(t)})}createPopoutWindowContainer(){let e=document.createElement("div");return e.classList.add("dv-popout-window"),e.id="dv-popout-window",e.style.position="absolute",e.style.width="100%",e.style.height="100%",e.style.top="0px",e.style.left="0px",e}};function Ze(e){if(e.length===0)throw new Error("Invalid tail call");return[e.slice(0,e.length-1),e[e.length-1]]}function qn(e,t){if(e.length!==t.length)return!1;for(let i=0;i<e.length;i++)if(e[i]!==t[i])return!1;return!0}function jn(e,t){let i=e.indexOf(t);i>-1&&(e.splice(i,1),e.unshift(t))}function Ei(e,t){let i=e.indexOf(t);i>-1&&(e.splice(i,1),e.push(t))}function Pl(e,t){for(let i=0;i<e.length;i++){let n=e[i];if(t(n))return i}return-1}function kr(e,t){let i=e.indexOf(t);return i>-1?(e.splice(i,1),!0):!1}let ye=(e,t,i)=>t>i?t:Math.min(i,Math.max(e,t)),Jn=()=>{let e=1;return{next:()=>(e++).toString()}},Qe=(e,t)=>{let i=[];if(typeof t!="number"&&(t=e,e=0),e<=t)for(let n=e;n<t;n++)i.push(n);else for(let n=e;n>t;n--)i.push(n);return i};var zl=class{set size(e){this._size=e}setContainerGeometry(e,t){this._appliedStyles[e]!==t&&(this._appliedStyles[e]=t,this.container.style[e]=t)}get size(){return this._size}get cachedVisibleSize(){return this._cachedVisibleSize}get visible(){return this._cachedVisibleSize===void 0}get minimumSize(){return this.visible?this.view.minimumSize:0}get viewMinimumSize(){return this.view.minimumSize}get maximumSize(){return this.visible?this.view.maximumSize:0}get viewMaximumSize(){return this.view.maximumSize}get priority(){return this.view.priority}get snap(){return!!this.view.snap}set enabled(e){this.container.style.pointerEvents=e?"":"none"}constructor(e,t,i,n){this.container=e,this.view=t,this.disposable=n,this._cachedVisibleSize=void 0,this._appliedStyles={},typeof i=="number"?(this._size=i,this._cachedVisibleSize=void 0,e.classList.add("visible")):(this._size=0,this._cachedVisibleSize=i.cachedVisibleSize)}setVisible(e,t){if(e!==this.visible){if(e){var i;let n=(i=this._cachedVisibleSize)!==null&&i!==void 0?i:0;this._cachedVisibleSize=void 0,this.size=ye(n,this.viewMinimumSize,this.viewMaximumSize)}else this._cachedVisibleSize=typeof t=="number"?t:this.size,this.size=0;this.container.classList.toggle("visible",e),this.view.setVisible&&this.view.setVisible(e)}}dispose(){return this.disposable.dispose(),this.view}};let Tl=(function(e){return e.HORIZONTAL="HORIZONTAL",e.VERTICAL="VERTICAL",e})({}),Al=(function(e){return e[e.MAXIMUM=0]="MAXIMUM",e[e.MINIMUM=1]="MINIMUM",e[e.DISABLED=2]="DISABLED",e[e.ENABLED=3]="ENABLED",e})({}),El=(function(e){return e.Low="low",e.High="high",e.Normal="normal",e})({});function Sr(e,t,i){e.appliedLeft!==t&&(e.appliedLeft=t,e.container.style.left=t),e.appliedTop!==i&&(e.appliedTop=i,e.container.style.top=i)}let ke;(function(e){e.Distribute={type:"distribute"};function t(n){return{type:"split",index:n}}e.Split=t;function i(n){return{type:"invisible",cachedVisibleSize:n}}e.Invisible=i})(ke||(ke={}));var yt=class{get contentSize(){return this._contentSize}get size(){return this._size}set size(e){this._size=e}get orthogonalSize(){return this._orthogonalSize}set orthogonalSize(e){this._orthogonalSize=e}get length(){return this.viewItems.length}get proportions(){return this._proportions?[...this._proportions]:void 0}get proportionalLayout(){return this._proportionalLayout}set proportionalLayout(e){this._proportionalLayout!==e&&(this._proportionalLayout=e,e?this.saveProportions():this._proportions=void 0)}get orientation(){return this._orientation}set orientation(e){this._orientation=e;let t=this.size;this.size=this.orthogonalSize,this.orthogonalSize=t,L(this.element,"dv-horizontal","dv-vertical"),this.element.classList.add(this.orientation=="HORIZONTAL"?"dv-horizontal":"dv-vertical")}get minimumSize(){return this.viewItems.reduce((e,t)=>e+t.minimumSize,0)}get maximumSize(){return this.length===0?Number.POSITIVE_INFINITY:this.viewItems.reduce((e,t)=>e+t.maximumSize,0)}get startSnappingEnabled(){return this._startSnappingEnabled}set startSnappingEnabled(e){this._startSnappingEnabled!==e&&(this._startSnappingEnabled=e,this.updateSashEnablement())}get endSnappingEnabled(){return this._endSnappingEnabled}set endSnappingEnabled(e){this._endSnappingEnabled!==e&&(this._endSnappingEnabled=e,this.updateSashEnablement())}get disabled(){return this._disabled}set disabled(e){this._disabled=e,E(this.element,"dv-splitview-disabled",e)}get margin(){return this._margin}get marginShare(){let e=0;for(let t of this.viewItems)t.visible&&e++;return this.marginShareFor(e)}set margin(e){this._margin=e,E(this.element,"dv-splitview-has-margin",e!==0)}constructor(e,t){var i,n;this.container=e,this.viewItems=[],this.sashes=[],this._size=0,this._orthogonalSize=0,this._contentSize=0,this._proportions=void 0,this._startSnappingEnabled=!0,this._endSnappingEnabled=!0,this._disabled=!1,this._margin=0,this._onDidSashEnd=new G,this.onDidSashEnd=this._onDidSashEnd.event,this._onDidAddView=new G,this.onDidAddView=this._onDidAddView.event,this._onDidRemoveView=new G,this.onDidRemoveView=this._onDidRemoveView.event,this.resize=(s,l,c=this.viewItems.map(x=>x.size),p,v,m=Number.NEGATIVE_INFINITY,f=Number.POSITIVE_INFINITY,_,y)=>{if(s<0||s>this.viewItems.length)return 0;let x=Qe(s,-1),k=Qe(s+1,this.viewItems.length);if(v)for(let K of v)jn(x,K),jn(k,K);if(p)for(let K of p)Ei(x,K),Ei(k,K);let S=x.reduce((K,ee)=>K+this.viewItems[ee].minimumSize-c[ee],0),z=x.reduce((K,ee)=>K+this.viewItems[ee].maximumSize-c[ee],0),M=k.length===0?Number.POSITIVE_INFINITY:k.reduce((K,ee)=>K+c[ee]-this.viewItems[ee].minimumSize,0),I=k.length===0?Number.NEGATIVE_INFINITY:k.reduce((K,ee)=>K+c[ee]-this.viewItems[ee].maximumSize,0),A=Math.max(S,I),N=Math.min(M,z),X=!1;if(_){let K=this.viewItems[_.index],ee=l>=_.limitDelta;X=ee!==K.visible,K.setVisible(ee,_.size)}if(!X&&y){let K=this.viewItems[y.index],ee=l<y.limitDelta;X=ee!==K.visible,K.setVisible(ee,y.size)}if(X)return this.resize(s,l,c,p,v,m,f);let Z=ye(l,A,N),W=0,U=Z;for(let K of x){let ee=this.viewItems[K],fe=c[K],ue=ye(fe+U,ee.minimumSize,ee.maximumSize),ge=ue-fe;W+=ge,U-=ge,ee.size=ue}let oe=W;for(let K of k){let ee=this.viewItems[K],fe=c[K],ue=ye(fe-oe,ee.minimumSize,ee.maximumSize),ge=ue-fe;oe+=ge,ee.size=ue}return l},this._orientation=(i=t.orientation)!==null&&i!==void 0?i:"VERTICAL",this.element=this.createContainer(),this.margin=(n=t.margin)!==null&&n!==void 0?n:0,this._proportionalLayout=t.proportionalLayout===void 0?!0:!!t.proportionalLayout,this.viewContainer=this.createViewContainer(),this.sashContainer=this.createSashContainer(),this.element.appendChild(this.sashContainer),this.element.appendChild(this.viewContainer),this.container.appendChild(this.element),this.style(t.styles),t.descriptor&&(this._size=t.descriptor.size,t.descriptor.views.forEach((s,l)=>{let c=s.visible===void 0||s.visible?s.size:{type:"invisible",cachedVisibleSize:s.size},p=s.view;this.addView(p,c,l,!0)}),this._contentSize=this.viewItems.reduce((s,l)=>s+l.size,0),this.saveProportions())}style(e){e?.separatorBorder==="transparent"?(L(this.element,"dv-separator-border"),this.element.style.removeProperty("--dv-separator-border")):(F(this.element,"dv-separator-border"),e?.separatorBorder&&this.element.style.setProperty("--dv-separator-border",e.separatorBorder))}isViewVisible(e){if(e<0||e>=this.viewItems.length)throw new Error("Index out of bounds");return this.viewItems[e].visible}setViewVisible(e,t){if(e<0||e>=this.viewItems.length)throw new Error("Index out of bounds");let i=this.viewItems[e];i.setVisible(t,i.size),this.distributeEmptySpace(e),this.layoutViews(),this.saveProportions()}getViewSize(e){return e<0||e>=this.viewItems.length?-1:this.viewItems[e].size}resizeView(e,t){if(e<0||e>=this.viewItems.length)return;let i=Qe(this.viewItems.length).filter(c=>c!==e),n=[...i.filter(c=>this.viewItems[c].priority==="low"),e],s=i.filter(c=>this.viewItems[c].priority==="high"),l=this.viewItems[e];t=Math.round(t),t=ye(t,l.minimumSize,Math.min(l.maximumSize,this._size)),l.size=t,this.relayout(n,s)}getViews(){return this.viewItems.map(e=>e.view)}onDidChange(e,t){let i=this.viewItems.indexOf(e);if(i<0||i>=this.viewItems.length)return;t=typeof t=="number"?t:e.size,t=ye(t,e.minimumSize,e.maximumSize),e.size=t;let n=Qe(this.viewItems.length).filter(c=>c!==i),s=[...n.filter(c=>this.viewItems[c].priority==="low"),i],l=n.filter(c=>this.viewItems[c].priority==="high");this.relayout([...s,i],l)}addView(e,t=ke.Distribute,i=this.viewItems.length,n){let s=document.createElement("div");s.className="dv-view",s.appendChild(e.element);let l;if(typeof t=="number")l=t;else if(t.type==="split"){let v=this.viewItems[t.index];if(v){let m=Math.floor(v.size/2);l=v.size-m,v.size=m}else l=this.getViewSize(t.index)/2}else t.type==="invisible"?l={cachedVisibleSize:t.cachedVisibleSize}:l=e.minimumSize;let c=e.onDidChange(v=>this.onDidChange(p,v.size)),p=new zl(s,e,l,{dispose:()=>{c.dispose(),s.remove()}});if(i===this.viewItems.length?this.viewContainer.appendChild(s):this.viewContainer.insertBefore(s,this.viewContainer.children.item(i)),this.viewItems.splice(i,0,p),this.viewItems.length>1){let v=document.createElement("div");v.className="dv-sash";let m=_=>{var y;for(let be of this.viewItems)be.enabled=!1;let x=(y=v.ownerDocument)!==null&&y!==void 0?y:document,k=pe(x),S=this._orientation==="HORIZONTAL"?_.clientX:_.clientY,z=Pl(this.sashes,be=>be.container===v),M=this.viewItems.map(be=>be.size),I,A,N=Qe(z,-1),X=Qe(z+1,this.viewItems.length),Z=N.reduce((be,ve)=>be+(this.viewItems[ve].minimumSize-M[ve]),0),W=N.reduce((be,ve)=>be+(this.viewItems[ve].viewMaximumSize-M[ve]),0),U=X.length===0?Number.POSITIVE_INFINITY:X.reduce((be,ve)=>be+(M[ve]-this.viewItems[ve].minimumSize),0),oe=X.length===0?Number.NEGATIVE_INFINITY:X.reduce((be,ve)=>be+(M[ve]-this.viewItems[ve].viewMaximumSize),0),K=Math.max(Z,oe),ee=Math.min(U,W),fe=this.findFirstSnapIndex(N),ue=this.findFirstSnapIndex(X);if(typeof fe=="number"){let be=this.viewItems[fe],ve=Math.floor(be.viewMinimumSize/2);I={index:fe,limitDelta:be.visible?K-ve:K+ve,size:be.size}}if(typeof ue=="number"){let be=this.viewItems[ue],ve=Math.floor(be.viewMinimumSize/2);A={index:ue,limitDelta:be.visible?ee+ve:ee-ve,size:be.size}}let ge=be=>{let ve=(this._orientation==="HORIZONTAL"?be.clientX:be.clientY)-S;this.resize(z,ve,M,void 0,void 0,K,ee,I,A),this.distributeEmptySpace(),this.layoutViews()},ze=()=>{for(let be of this.viewItems)be.enabled=!0;k.release(),this.saveProportions(),x.removeEventListener("pointermove",ge),x.removeEventListener("pointerup",ze),x.removeEventListener("pointercancel",ze),x.removeEventListener("contextmenu",ze),this._onDidSashEnd.fire(void 0)};x.addEventListener("pointermove",ge),x.addEventListener("pointerup",ze),x.addEventListener("pointercancel",ze),x.addEventListener("contextmenu",ze)};v.addEventListener("pointerdown",m);let f={container:v,disposable:()=>{v.removeEventListener("pointerdown",m),v.remove()}};this.sashContainer.appendChild(v),this.sashes.push(f)}n||this.relayout([i]),!n&&typeof t!="number"&&t.type==="distribute"&&this.distributeViewSizes(),this._onDidAddView.fire(e)}distributeViewSizes(){let e=[],t=0;for(let c of this.viewItems)c.maximumSize-c.minimumSize>0&&(e.push(c),t+=c.size);let i=Math.floor(t/e.length);for(let c of e)c.size=ye(i,c.minimumSize,c.maximumSize);let n=Qe(this.viewItems.length),s=n.filter(c=>this.viewItems[c].priority==="low"),l=n.filter(c=>this.viewItems[c].priority==="high");this.relayout(s,l)}removeView(e,t,i=!1){let n=this.viewItems.splice(e,1)[0];if(n.dispose(),this.viewItems.length>=1){let s=Math.max(e-1,0);this.sashes.splice(s,1)[0].disposable()}return i||this.relayout(),t?.type==="distribute"&&this.distributeViewSizes(),this._onDidRemoveView.fire(n.view),n.view}getViewCachedVisibleSize(e){if(e<0||e>=this.viewItems.length)throw new Error("Index out of bounds");return this.viewItems[e].cachedVisibleSize}moveView(e,t){let i=this.getViewCachedVisibleSize(e),n=i===void 0?this.getViewSize(e):ke.Invisible(i),s=this.removeView(e,void 0,!0);this.addView(s,n,t)}layout(e,t){let i=Math.max(this.size,this._contentSize);if(this.size=e,this.orthogonalSize=t,this._proportions||this.saveProportions(),this.proportions){let n=0;for(let s=0;s<this.viewItems.length;s++){let l=this.viewItems[s],c=this.proportions[s];typeof c=="number"?n+=c:e-=l.size}for(let s=0;s<this.viewItems.length;s++){let l=this.viewItems[s],c=this.proportions[s];typeof c=="number"&&n>0&&(l.size=ye(Math.round(c*e/n),l.minimumSize,l.maximumSize))}}else{let n=Qe(this.viewItems.length),s=n.filter(c=>this.viewItems[c].priority==="low"),l=n.filter(c=>this.viewItems[c].priority==="high");this.resize(this.viewItems.length-1,e-i,void 0,s,l)}this.distributeEmptySpace(),this.layoutViews()}relayout(e,t){let i=this.viewItems.reduce((n,s)=>n+s.size,0);this.resize(this.viewItems.length-1,this._size-i,void 0,e,t),this.distributeEmptySpace(),this.layoutViews(),this.saveProportions()}distributeEmptySpace(e){let t=0;for(let l of this.viewItems)t+=l.size;let i=this.size-t;if(i===0)return;let n=Qe(this.viewItems.length-1,-1),s=!1;for(let l of this.viewItems)if(l.priority==="low"||l.priority==="high"){s=!0;break}if(s){let l=n.filter(p=>this.viewItems[p].priority==="low"),c=n.filter(p=>this.viewItems[p].priority==="high");for(let p of c)jn(n,p);for(let p of l)Ei(n,p)}typeof e=="number"&&Ei(n,e);for(let l=0;i!==0&&l<n.length;l++){let c=this.viewItems[n[l]],p=ye(c.size+i,c.minimumSize,c.maximumSize),v=p-c.size;i-=v,c.size=p}}saveProportions(){if(!this.proportionalLayout)return;let e=0;for(let t of this.viewItems)e+=t.size;e>0&&(this._proportions=this.viewItems.map(t=>t.visible?t.size/e:void 0))}layoutViews(){let e=0,t=0;for(let v of this.viewItems)e+=v.size,v.visible&&t++;if(this._contentSize=e,this.updateSashEnablement(),this.viewItems.length===0)return;let i=Math.max(0,t-1),n=this.marginShareFor(t),s=0,l=[],c=4,p=0;this.viewItems.forEach((v,m)=>{s+=this.viewItems[m].size,l.push(s),p+=v.visible?1:0;let f=v.visible?v.size-n:0,_=Math.max(0,p-1),y=m===0||_===0?0:l[m-1]+_/i*n;if(m<this.viewItems.length-1){let x=v.visible?y+f-c/2+this.margin/2:y,k=this.sashes[m];this._orientation==="HORIZONTAL"&&Sr(k,`${x}px`,"0px"),this._orientation==="VERTICAL"&&Sr(k,"0px",`${x}px`)}this._orientation==="HORIZONTAL"&&(v.setContainerGeometry("width",`${f}px`),v.setContainerGeometry("left",`${y}px`),v.setContainerGeometry("top",""),v.setContainerGeometry("height","")),this._orientation==="VERTICAL"&&(v.setContainerGeometry("height",`${f}px`),v.setContainerGeometry("top",`${y}px`),v.setContainerGeometry("width",""),v.setContainerGeometry("left","")),v.view.layout(f,this._orthogonalSize)})}marginShareFor(e){let t=Math.max(0,e-1);return this._margin*t/Math.max(1,e)}findFirstSnapIndex(e){for(let t of e){let i=this.viewItems[t];if(i.visible&&i.snap)return t}for(let t of e){let i=this.viewItems[t];if(i.visible&&i.maximumSize-i.minimumSize>0)return;if(!i.visible&&i.snap)return t}}updateSashEnablement(){if(this.sashes.length===0)return;let e=!1,t=this.viewItems.map(p=>e=p.size-p.minimumSize>0||e);e=!1;let i=this.viewItems.map(p=>e=p.maximumSize-p.size>0||e),n=[...this.viewItems].reverse();e=!1;let s=n.map(p=>e=p.size-p.minimumSize>0||e).reverse();e=!1;let l=n.map(p=>e=p.maximumSize-p.size>0||e).reverse(),c=0;for(let p=0;p<this.sashes.length;p++){let v=this.sashes[p],m=this.viewItems[p];c+=m.size;let f=!(t[p]&&l[p+1]),_=!(i[p]&&s[p+1]);if(f&&_){let y=Qe(p,-1),x=Qe(p+1,this.viewItems.length),k=this.findFirstSnapIndex(y),S=this.findFirstSnapIndex(x),z=typeof k=="number"&&!this.viewItems[k].visible,M=typeof S=="number"&&!this.viewItems[S].visible;z&&s[p]&&(c>0||this.startSnappingEnabled)?this.updateSash(v,1):M&&t[p]&&(c<this._contentSize||this.endSnappingEnabled)?this.updateSash(v,0):this.updateSash(v,2)}else f&&!_?this.updateSash(v,1):!f&&_?this.updateSash(v,0):this.updateSash(v,3)}}updateSash(e,t){E(e.container,"dv-disabled",t===2),E(e.container,"dv-enabled",t===3),E(e.container,"dv-maximum",t===0),E(e.container,"dv-minimum",t===1)}createViewContainer(){let e=document.createElement("div");return e.className="dv-view-container",e}createSashContainer(){let e=document.createElement("div");return e.className="dv-sash-container",e}createContainer(){let e=document.createElement("div");return e.className=`dv-split-view-container ${this._orientation==="HORIZONTAL"?"dv-horizontal":"dv-vertical"}`,e}dispose(){this._onDidSashEnd.dispose(),this._onDidAddView.dispose(),this._onDidRemoveView.dispose();for(let e=0;e<this.element.children.length;e++)if(this.element.children.item(e)===this.element){this.element.remove();break}for(let e of this.viewItems)e.dispose();this.element.remove()}};let Il=Object.keys({orientation:void 0,descriptor:void 0,proportionalLayout:void 0,styles:void 0,margin:void 0,disableAutoResizing:void 0,className:void 0});var Ii=class extends D{get onDidAddView(){return this.splitview.onDidAddView}get onDidRemoveView(){return this.splitview.onDidRemoveView}get minimumSize(){return this.splitview.minimumSize}get maximumSize(){return this.splitview.maximumSize}get orientation(){return this.splitview.orientation}get size(){return this.splitview.size}get orthogonalSize(){return this.splitview.orthogonalSize}constructor(e,t){var i;super(),this.paneItems=[],this.skipAnimation=!1,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._orientation=(i=t.orientation)!==null&&i!==void 0?i:"VERTICAL",this.element=document.createElement("div"),this.element.className="dv-pane-container",e.appendChild(this.element),this.splitview=new yt(this.element,{orientation:this._orientation,proportionalLayout:!1,descriptor:t.descriptor}),this.getPanes().forEach(n=>{let s=new D(n.onDidChangeExpansionState(()=>{this.setupAnimation(),this._onDidChange.fire(void 0)})),l={pane:n,disposable:{dispose:()=>{s.dispose()}}};this.paneItems.push(l),n.orthogonalSize=this.splitview.orthogonalSize}),this.addDisposables(this._onDidChange,this.splitview.onDidSashEnd(()=>{this._onDidChange.fire(void 0)}),this.splitview.onDidAddView(()=>{this._onDidChange.fire()}),this.splitview.onDidRemoveView(()=>{this._onDidChange.fire()}))}setViewVisible(e,t){this.splitview.setViewVisible(e,t)}addPane(e,t,i=this.splitview.length,n=!1){let s=e.onDidChangeExpansionState(()=>{this.setupAnimation(),this._onDidChange.fire(void 0)}),l={pane:e,disposable:{dispose:()=>{s.dispose()}}};this.paneItems.splice(i,0,l),e.orthogonalSize=this.splitview.orthogonalSize,this.splitview.addView(e,t,i,n)}getViewSize(e){return this.splitview.getViewSize(e)}getViewCachedVisibleSize(e){return this.splitview.getViewCachedVisibleSize(e)}getPanes(){return this.splitview.getViews()}removePane(e,t){let i=this.paneItems.splice(e,1)[0];return this.splitview.removeView(e),t?.skipDispose||(i.disposable.dispose(),i.pane.dispose()),i}moveView(e,t){if(e===t)return;let i=this.removePane(e,{skipDispose:!0});i.disposable.dispose(),this.skipAnimation=!0;try{this.addPane(i.pane,i.pane.size,t,!1)}finally{this.skipAnimation=!1}}layout(e,t){this.splitview.layout(e,t)}setupAnimation(){this.skipAnimation||(this.animationTimer&&(clearTimeout(this.animationTimer),this.animationTimer=void 0),F(this.element,"dv-animated"),this.animationTimer=setTimeout(()=>{this.animationTimer=void 0,L(this.element,"dv-animated")},200))}dispose(){super.dispose(),this.animationTimer&&(clearTimeout(this.animationTimer),this.animationTimer=void 0),this.paneItems.forEach(e=>{e.disposable.dispose(),e.pane.dispose()}),this.paneItems=[],this.splitview.dispose(),this.element.remove()}},Te=class{get minimumWidth(){return this.view.minimumWidth}get maximumWidth(){return this.view.maximumWidth}get minimumHeight(){return this.view.minimumHeight}get maximumHeight(){return this.view.maximumHeight}get priority(){return this.view.priority}get snap(){return this.view.snap}get minimumSize(){return this.orientation==="HORIZONTAL"?this.minimumHeight:this.minimumWidth}get maximumSize(){return this.orientation==="HORIZONTAL"?this.maximumHeight:this.maximumWidth}get minimumOrthogonalSize(){return this.orientation==="HORIZONTAL"?this.minimumWidth:this.minimumHeight}get maximumOrthogonalSize(){return this.orientation==="HORIZONTAL"?this.maximumWidth:this.maximumHeight}get orthogonalSize(){return this._orthogonalSize}get size(){return this._size}get element(){return this.view.element}get width(){return this.orientation==="HORIZONTAL"?this.orthogonalSize:this.size}get height(){return this.orientation==="HORIZONTAL"?this.size:this.orthogonalSize}constructor(e,t,i,n=0){this.view=e,this.orientation=t,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._orthogonalSize=i,this._size=n,this._disposable=this.view.onDidChange(s=>{s?this._onDidChange.fire({size:this.orientation==="VERTICAL"?s.width:s.height,orthogonalSize:this.orientation==="VERTICAL"?s.height:s.width}):this._onDidChange.fire({})})}setVisible(e){this.view.setVisible&&this.view.setVisible(e)}layout(e,t){this._size=e,this._orthogonalSize=t,this.view.layout(this.width,this.height)}dispose(){this._onDidChange.dispose(),this._disposable.dispose()}},Ge=class Vn extends D{get width(){return this.orientation==="HORIZONTAL"?this.size:this.orthogonalSize}get height(){return this.orientation==="HORIZONTAL"?this.orthogonalSize:this.size}get minimumSize(){if(this._cachedMinimumSize===void 0){let t=0;for(let i=0;i<this.children.length;i++)this.splitview.isViewVisible(i)&&(t=Math.max(t,this.children[i].minimumOrthogonalSize));this._cachedMinimumSize=t}return this._cachedMinimumSize}get maximumSize(){if(this._cachedMaximumSize===void 0){let t=Number.POSITIVE_INFINITY;for(let i=0;i<this.children.length;i++)this.splitview.isViewVisible(i)&&(t=Math.min(t,this.children[i].maximumOrthogonalSize));this._cachedMaximumSize=t}return this._cachedMaximumSize}get minimumOrthogonalSize(){return this.splitview.minimumSize}get maximumOrthogonalSize(){return this.splitview.maximumSize}get orthogonalSize(){return this._orthogonalSize}get size(){return this._size}get minimumWidth(){return this.orientation==="HORIZONTAL"?this.minimumOrthogonalSize:this.minimumSize}get minimumHeight(){return this.orientation==="HORIZONTAL"?this.minimumSize:this.minimumOrthogonalSize}get maximumWidth(){return this.orientation==="HORIZONTAL"?this.maximumOrthogonalSize:this.maximumSize}get maximumHeight(){return this.orientation==="HORIZONTAL"?this.maximumSize:this.maximumOrthogonalSize}get priority(){var t;return(t=this._cachedPriority)!==null&&t!==void 0||(this._cachedPriority=this.computePriority()),this._cachedPriority}computePriority(){if(this.children.length===0)return"normal";let t=!1,i=!1;for(let s of this.children){var n;let l=(n=s.priority)!==null&&n!==void 0?n:"normal";l==="high"?t=!0:l==="low"&&(i=!0)}return t?"high":i?"low":"normal"}invalidateCachedSizes(){this._cachedMinimumSize=void 0,this._cachedMaximumSize=void 0,this._cachedPriority=void 0}get disabled(){return this.splitview.disabled}set disabled(t){this.splitview.disabled=t}get margin(){return this.splitview.margin}set margin(t){this.splitview.margin=t,this.children.forEach(i=>{i instanceof Vn&&(i.margin=t)})}get proportionalLayout(){return this.splitview.proportionalLayout}set proportionalLayout(t){this.splitview.proportionalLayout=t,this.children.forEach(i=>{i instanceof Vn&&(i.proportionalLayout=t)})}constructor(t,i,n,s,l,c,p,v){if(super(),this.orientation=t,this.styles=n,this._childrenDisposable=w.NONE,this.children=[],this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._onDidVisibilityChange=new G,this.onDidVisibilityChange=this._onDidVisibilityChange.event,this._orthogonalSize=l,this._size=s,this.element=document.createElement("div"),this.element.className="dv-branch-node",v){let m={views:v.map(f=>{var _;return{view:f.node,size:f.node.size,visible:(_=f.visible)!==null&&_!==void 0?_:!0}}),size:this.orthogonalSize};this.children=v.map(f=>f.node),this.splitview=new yt(this.element,{orientation:this.orientation,descriptor:m,proportionalLayout:i,styles:n,margin:p})}else this.splitview=new yt(this.element,{orientation:this.orientation,proportionalLayout:i,styles:n,margin:p}),this.splitview.layout(this.size,this.orthogonalSize);this.disabled=c,this.addDisposables(this._onDidChange,this._onDidVisibilityChange,this.splitview.onDidSashEnd(()=>{this._onDidChange.fire({})})),this.setupChildrenEvents()}setVisible(t){}isChildVisible(t){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.isViewVisible(t)}setChildVisible(t,i){if(t<0||t>=this.children.length)throw new Error("Invalid index");if(this.splitview.isViewVisible(t)===i)return;let n=this.splitview.contentSize===0;this.splitview.setViewVisible(t,i),this.invalidateCachedSizes();let s=this.splitview.contentSize===0;(i&&n||!i&&s)&&this._onDidVisibilityChange.fire({visible:i})}moveChild(t,i){if(t===i)return;if(t<0||t>=this.children.length)throw new Error("Invalid from index");t<i&&i--,this.splitview.moveView(t,i);let n=this._removeChild(t);this._addChild(n,i)}getChildSize(t){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.getViewSize(t)}resizeChild(t,i){if(t<0||t>=this.children.length)throw new Error("Invalid index");this.splitview.resizeView(t,i)}layout(t,i){this._size=i,this._orthogonalSize=t,this.splitview.layout(i,t)}addChild(t,i,n,s){if(n<0||n>this.children.length)throw new Error("Invalid index");this.splitview.addView(t,i,n,s),this._addChild(t,n)}getChildCachedVisibleSize(t){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.getViewCachedVisibleSize(t)}removeChild(t,i){if(t<0||t>=this.children.length)throw new Error("Invalid index");return this.splitview.removeView(t,i),this._removeChild(t)}_addChild(t,i){this.children.splice(i,0,t),this.setupChildrenEvents()}_removeChild(t){let[i]=this.children.splice(t,1);return this.setupChildrenEvents(),i}setupChildrenEvents(){this.invalidateCachedSizes(),this._childrenDisposable.dispose(),this._childrenDisposable=new D(P.any(...this.children.map(t=>t.onDidChange))(t=>{this.invalidateCachedSizes(),this._onDidChange.fire({size:t.orthogonalSize})}),...this.children.map((t,i)=>t instanceof Vn?t.onDidVisibilityChange(({visible:n})=>{this.setChildVisible(i,n)}):w.NONE))}dispose(){this._childrenDisposable.dispose(),this.splitview.dispose(),this.children.forEach(t=>t.dispose()),super.dispose()}};function Kn(e,t){if(e instanceof Te)return e;if(e instanceof Ge)return Kn(e.children[t?e.children.length-1:0],t);throw new Error("invalid node")}function Xn(e,t,i,n=1){let s=e.getChildCachedVisibleSize(t);return s===void 0?i:ke.Invisible(Math.round(s*n))}function Cr(e,t,i){if(e instanceof Ge){let n=new Ge(e.orientation,e.proportionalLayout,e.styles,t,i,e.disabled,e.margin);for(let s=e.children.length-1;s>=0;s--){let l=e.children[s];n.addChild(Cr(l,l.size,l.orthogonalSize),Xn(e,s,l.size),0,!0)}return n}else return new Te(e.view,e.orientation,i)}function Zn(e,t,i){if(e instanceof Ge){let n=new Ge(et(e.orientation),e.proportionalLayout,e.styles,t,i,e.disabled,e.margin),s=0,l=e.size===0?1:t/e.size;for(let c=e.children.length-1;c>=0;c--){let p=e.children[c],v=p instanceof Ge?p.orthogonalSize:p.size,m=e.size===0?0:Math.round(t*v/e.size);s+=m,c===0&&(m+=t-s),n.addChild(Zn(p,i,m),Xn(e,c,m,l),0,!0)}return n}else return new Te(e.view,et(e.orientation),i)}function Gr(e){let t=e.parentElement;if(!t)throw new Error("Invalid grid element");let i=t.firstElementChild,n=0;for(;i!==e&&i!==t.lastElementChild&&i;)i=i.nextElementSibling,n++;return n}function we(e){let t=e.parentElement;if(!t)throw new Error("Invalid grid element");if(/\bdv-grid-view\b/.test(t.className))return[];let i=Gr(t),n=t.parentElement.parentElement.parentElement;return[...we(n),i]}function Ve(e,t,i){if(Qn(e,t)===Mi(i)){let[n,s]=Ze(t),l=s;return(i==="right"||i==="bottom")&&(l+=1),[...n,l]}else{let n=i==="right"||i==="bottom"?1:0;return[...t,n]}}function Mi(e){return e==="top"||e==="bottom"?"VERTICAL":"HORIZONTAL"}function Qn(e,t){return t.length%2===0?et(e):e}let et=e=>e==="HORIZONTAL"?"VERTICAL":"HORIZONTAL";function Pr(e){return!!e.children}let eo=(e,t)=>{let i=t==="VERTICAL"?e.box.width:e.box.height;if(!Pr(e))return typeof e.cachedVisibleSize=="number"?{type:"leaf",data:e.view.toJSON(),size:e.cachedVisibleSize,visible:!1}:{type:"leaf",data:e.view.toJSON(),size:i};let n=e.children.map(s=>eo(s,et(t)));return typeof e.cachedVisibleSize=="number"?{type:"branch",data:n,size:e.cachedVisibleSize,visible:!1}:{type:"branch",data:n,size:i}};var to=class{get length(){return this._root?this._root.children.length:0}get orientation(){return this.root.orientation}set orientation(e){if(this.root.orientation===e)return;let{size:t,orthogonalSize:i}=this.root;this.root=Zn(this.root,i,t),this.root.layout(t,i)}get width(){return this.root.width}get height(){return this.root.height}get minimumWidth(){return this.root.minimumWidth}get minimumHeight(){return this.root.minimumHeight}get maximumWidth(){return this.root.maximumWidth}get maximumHeight(){return this.root.maximumHeight}get locked(){return this._locked}set locked(e){this._locked=e;let t=[this.root];for(;t.length>0;){let i=t.pop();i instanceof Ge&&(i.disabled=e,t.push(...i.children))}}get margin(){return this._margin}set margin(e){this._margin=e,this.root.margin=e}maximizedView(){var e;return(e=this._maximizedNode)===null||e===void 0?void 0:e.leaf.view}hasMaximizedView(){return this._maximizedNode!==void 0}maximizeView(e){var t;let i=we(e.element),[n,s]=this.getNode(i);if(!(s instanceof Te)||((t=this._maximizedNode)===null||t===void 0?void 0:t.leaf)===s)return;this.hasMaximizedView()&&this.exitMaximizedView(),eo(this.getView(),this.orientation);let l=[];function c(p,v){for(let m=0;m<p.children.length;m++){let f=p.children[m];f instanceof Te?f!==v&&(p.isChildVisible(m)?p.setChildVisible(m,!1):l.push(f)):c(f,v)}}c(this.root,s),this._maximizedNode={leaf:s,hiddenOnMaximize:l},this._onDidMaximizedNodeChange.fire({view:s.view,isMaximized:!0})}exitMaximizedView(){if(!this._maximizedNode)return;let e=this._maximizedNode.hiddenOnMaximize;function t(n){for(let s=n.children.length-1;s>=0;s--){let l=n.children[s];l instanceof Te?e.includes(l)||n.setChildVisible(s,!0):t(l)}}t(this.root);let i=this._maximizedNode.leaf;this._maximizedNode=void 0,this._onDidMaximizedNodeChange.fire({view:i.view,isMaximized:!1})}serialize(){let e=this.maximizedView(),t;e&&(t=we(e.element));let i=this._onDidMaximizedNodeChange.pause();try{this.hasMaximizedView()&&this.exitMaximizedView();let n={root:eo(this.getView(),this.orientation),width:this.width,height:this.height,orientation:this.orientation};return t&&(n.maximizedNode={location:t}),e&&this.maximizeView(e),n}finally{i.dispose()}}dispose(){this.disposable.dispose(),this._onDidChange.dispose(),this._onDidMaximizedNodeChange.dispose(),this._onDidViewVisibilityChange.dispose(),this.root.dispose(),this._maximizedNode=void 0,this.element.remove()}clear(){let e=this.root.orientation;this.root=new Ge(e,this.proportionalLayout,this.styles,this.root.size,this.root.orthogonalSize,this.locked,this.margin)}deserialize(e,t){let i=e.orientation,n=i==="VERTICAL"?e.height:e.width;if(this._deserialize(e.root,i,t,n),this.layout(e.width,e.height),e.maximizedNode){let s=e.maximizedNode.location,[l,c]=this.getNode(s);if(!(c instanceof Te))return;this.maximizeView(c.view)}}_deserialize(e,t,i,n){this.root=this._deserializeNode(e,t,i,n)}_deserializeNode(e,t,i,n){let s;if(e.type==="branch"){let c=e.data.map(p=>({node:this._deserializeNode(p,et(t),i,e.size),visible:p.visible}));s=new Ge(t,this.proportionalLayout,this.styles,e.size,n,this.locked,this.margin,c)}else{let c=i.fromJSON(e);if(typeof e.visible=="boolean"){var l;(l=c.setVisible)===null||l===void 0||l.call(c,e.visible)}s=new Te(c,t,n,e.size)}return s}get root(){return this._root}set root(e){let t=this._root;t&&(t.dispose(),this._maximizedNode=void 0,t.element.remove()),this._root=e,this.element.appendChild(this._root.element),this.disposable.value=this._root.onDidChange(i=>{this._onDidChange.fire(i)})}normalize(){if(!this._root||this._root.children.length!==1)return;let e=this.root,t=e.children[0];if(t instanceof Te)return;e.element.remove();let i=e.removeChild(0);e.dispose(),i.dispose(),this._root=Cr(t,t.size,t.orthogonalSize),this.element.appendChild(this._root.element),this.disposable.value=this._root.onDidChange(n=>{this._onDidChange.fire(n)})}insertOrthogonalSplitviewAtRoot(){if(!this._root)return;let e=this.root;if(e.element.remove(),this._root=new Ge(et(e.orientation),this.proportionalLayout,this.styles,this.root.orthogonalSize,this.root.size,this.locked,this.margin),e.children.length!==0)if(e.children.length===1){let t=e.children[0];e.removeChild(0).dispose(),e.dispose(),this._root.addChild(Zn(t,t.orthogonalSize,t.size),ke.Distribute,0)}else this._root.addChild(e,ke.Distribute,0);this.element.appendChild(this._root.element),this.disposable.value=this._root.onDidChange(t=>{this._onDidChange.fire(t)})}next(e){return this.progmaticSelect(e)}previous(e){return this.progmaticSelect(e,!0)}getView(e){let t=e?this.getNode(e)[1]:this.root;return this._getViews(t,this.orientation)}_getViews(e,t,i){let n={height:e.height,width:e.width};if(e instanceof Te)return{box:n,view:e.view,cachedVisibleSize:i};let s=[];for(let l=0;l<e.children.length;l++){let c=e.children[l],p=e.getChildCachedVisibleSize(l);s.push(this._getViews(c,et(t),p))}return{box:n,children:s,cachedVisibleSize:i}}progmaticSelect(e,t=!1){let[i,n]=this.getNode(e);if(!(n instanceof Te))throw new TypeError("invalid location");for(let s=i.length-1;s>-1;s--){let l=i[s],c=e[s]||0;if(t?c-1>-1:c+1<l.children.length)return Kn(l.children[t?c-1:c+1],t)}return Kn(this.root,t)}get proportionalLayout(){return this.root.proportionalLayout}set proportionalLayout(e){this.root.proportionalLayout=e}constructor(e,t,i,n,s){this.styles=t,this._locked=!1,this._margin=0,this._maximizedNode=void 0,this.disposable=new C,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._onDidViewVisibilityChange=new G,this.onDidViewVisibilityChange=this._onDidViewVisibilityChange.event,this._onDidMaximizedNodeChange=new G,this.onDidMaximizedNodeChange=this._onDidMaximizedNodeChange.event,this.element=document.createElement("div"),this.element.className="dv-grid-view",this._locked=n??!1,this._margin=s??0,this.root=new Ge(i,e,t,0,0,this.locked,this.margin)}isViewVisible(e){let[t,i]=Ze(e),[,n]=this.getNode(t);if(!(n instanceof Ge))throw new TypeError("Invalid from location");return n.isChildVisible(i)}setViewVisible(e,t){this.hasMaximizedView()&&this.exitMaximizedView();let[i,n]=Ze(e),[,s]=this.getNode(i);if(!(s instanceof Ge))throw new TypeError("Invalid from location");this._onDidViewVisibilityChange.fire(),s.setChildVisible(n,t)}moveView(e,t,i){this.hasMaximizedView()&&this.exitMaximizedView();let[,n]=this.getNode(e);if(!(n instanceof Ge))throw new TypeError("Invalid location");n.moveChild(t,i)}addView(e,t,i){this.hasMaximizedView()&&this.exitMaximizedView();let[n,s]=Ze(i),[l,c]=this.getNode(n);if(c instanceof Ge){let p=new Te(e,et(c.orientation),c.orthogonalSize);c.addChild(p,t,s)}else{let[p,...v]=[...l].reverse(),[m,...f]=[...n].reverse(),_=0,y=p.getChildCachedVisibleSize(m);typeof y=="number"&&(_=ke.Invisible(y)),p.removeChild(m).dispose();let x=new Ge(c.orientation,this.proportionalLayout,this.styles,c.size,c.orthogonalSize,this.locked,this.margin);p.addChild(x,c.size,m);let k=new Te(c.view,p.orientation,c.size);x.addChild(k,_,0),typeof t!="number"&&t.type==="split"&&(t={type:"split",index:0});let S=new Te(e,p.orientation,c.size);x.addChild(S,t,s)}}remove(e,t){let i=we(e.element);return this.removeView(i,t)}removeView(e,t){this.hasMaximizedView()&&this.exitMaximizedView();let[i,n]=Ze(e),[s,l]=this.getNode(i);if(!(l instanceof Ge))throw new TypeError("Invalid location");let c=l.children[n];if(!(c instanceof Te))throw new TypeError("Invalid location");if(l.removeChild(n,t),c.dispose(),l.children.length!==1)return c.view;let p=l.children[0];if(s.length===0)return p instanceof Te||(l.removeChild(0,t),this.root=p),c.view;let[v,...m]=[...s].reverse(),[f,..._]=[...i].reverse(),y=l.isChildVisible(0);l.removeChild(0,t);let x=v.children.map((k,S)=>v.getChildSize(S));if(v.removeChild(f,t).dispose(),p instanceof Ge){x.splice(f,1,...p.children.map(k=>k.size));for(let k=0;k<p.children.length;k++){let S=p.children[k],z=Xn(p,k,S.size);v.addChild(S,!y&&typeof z=="number"?ke.Invisible(z):z,f+k)}for(;p.children.length>0;)p.removeChild(0)}else{let k=new Te(p.view,et(p.orientation),p.size),S=y?p.orthogonalSize:ke.Invisible(p.orthogonalSize);v.addChild(k,S,f)}p.dispose();for(let k=0;k<x.length;k++)v.resizeChild(k,x[k]);return c.view}layout(e,t){let[i,n]=this.root.orientation==="HORIZONTAL"?[t,e]:[e,t];this.root.layout(i,n)}getNode(e,t=this.root,i=[]){if(e.length===0)return[i,t];if(!(t instanceof Ge))throw new TypeError("Invalid location");let[n,...s]=e;if(n<0||n>=t.children.length)throw new Error("Invalid location");let l=t.children[n];return i.push(t),this.getNode(s,l,i)}};let Ml=Object.keys({disableAutoResizing:void 0,proportionalLayout:void 0,orientation:void 0,hideBorders:void 0,className:void 0});var io=class extends D{get element(){return this._element}get disableResizing(){return this._disableResizing}set disableResizing(e){this._disableResizing=e}constructor(e,t=!1){super(),this._lastWidth=-1,this._lastHeight=-1,this._disableResizing=t,this._element=e,this.addDisposables(B(this._element,i=>{if(this.isDisposed||this.disableResizing||!this._element.offsetParent||!ae(this._element))return;let n=Math.round(i.contentRect.width),s=Math.round(i.contentRect.height);n===this._lastWidth&&s===this._lastHeight||(this._lastWidth=n,this._lastHeight=s,this.layout(n,s))}))}layoutFromElement(){if(this.disableResizing||!this._element.offsetParent||!ae(this._element))return;let e=Math.round(this._element.clientWidth),t=Math.round(this._element.clientHeight);e===0||t===0||this.layout(e,t)}};let Ll=Jn();function li(e){switch(e){case"left":return"left";case"right":return"right";case"above":return"top";case"below":return"bottom";default:return"center"}}var no=class extends io{get id(){return this._id}get size(){return this._groups.size}get groups(){return Array.from(this._groups.values()).map(e=>e.value)}get width(){return this.gridview.width}get height(){return this.gridview.height}get minimumHeight(){return this.gridview.minimumHeight}get maximumHeight(){return this.gridview.maximumHeight}get minimumWidth(){return this.gridview.minimumWidth}get maximumWidth(){return this.gridview.maximumWidth}get activeGroup(){return this._activeGroup}get locked(){return this.gridview.locked}set locked(e){this.gridview.locked=e}constructor(e,t){var i;super(document.createElement("div"),t.disableAutoResizing),this._id=Ll.next(),this._groups=new Map,this._onDidRemove=new G,this.onDidRemove=this._onDidRemove.event,this._onDidAdd=new G,this.onDidAdd=this._onDidAdd.event,this._onDidMaximizedChange=new G,this.onDidMaximizedChange=this._onDidMaximizedChange.event,this._onDidActiveChange=new G,this.onDidActiveChange=this._onDidActiveChange.event,this._bufferOnDidLayoutChange=new _e,this.onDidLayoutChange=this._bufferOnDidLayoutChange.onEvent,this._onDidViewVisibilityChangeMicroTaskQueue=new _e,this.onDidViewVisibilityChangeMicroTaskQueue=this._onDidViewVisibilityChangeMicroTaskQueue.onEvent,this.element.style.height="100%",this.element.style.width="100%",this._classNames=new $e(this.element),this._classNames.setClassNames((i=t.className)!==null&&i!==void 0?i:""),e.appendChild(this.element),this.gridview=new to(!!t.proportionalLayout,t.styles,t.orientation,t.locked,t.margin),this.gridview.locked=!!t.locked,this.element.appendChild(this.gridview.element),this.layout(0,0,!0),this.addDisposables(this.gridview.onDidMaximizedNodeChange(n=>{this._onDidMaximizedChange.fire({panel:n.view,isMaximized:n.isMaximized})}),this.gridview.onDidViewVisibilityChange(()=>this._onDidViewVisibilityChangeMicroTaskQueue.fire()),this.onDidViewVisibilityChangeMicroTaskQueue(()=>{this.forceRelayout()}),w.from(()=>{this.element.remove()}),this.gridview.onDidChange(()=>{this._bufferOnDidLayoutChange.fire()}),P.any(this.onDidAdd,this.onDidRemove,this.onDidActiveChange)(()=>{this._bufferOnDidLayoutChange.fire()}),this._onDidMaximizedChange,this._onDidViewVisibilityChangeMicroTaskQueue,this._bufferOnDidLayoutChange)}setVisible(e,t){this.gridview.setViewVisible(we(e.element),t),this._bufferOnDidLayoutChange.fire()}isVisible(e){return this.gridview.isViewVisible(we(e.element))}updateOptions(e){if("proportionalLayout"in e){var t;this.gridview.proportionalLayout=(t=e.proportionalLayout)!==null&&t!==void 0?t:!0}if(e.orientation&&(this.gridview.orientation=e.orientation),"styles"in e,"disableAutoResizing"in e){var i;this.disableResizing=(i=e.disableAutoResizing)!==null&&i!==void 0?i:!1}if("locked"in e){var n;this.locked=(n=e.locked)!==null&&n!==void 0?n:!1}if("margin"in e){var s;this.gridview.margin=(s=e.margin)!==null&&s!==void 0?s:0}if("className"in e){var l;this._classNames.setClassNames((l=e.className)!==null&&l!==void 0?l:"")}}maximizeGroup(e){this.gridview.maximizeView(e),this.doSetGroupActive(e)}isMaximizedGroup(e){return this.gridview.maximizedView()===e}exitMaximizedGroup(){this.gridview.exitMaximizedView()}hasMaximizedGroup(){return this.gridview.hasMaximizedView()}doAddGroup(e,t=[0],i,n=this.gridview){n.addView(e,i??ke.Distribute,t),this._onDidAdd.fire(e)}doRemoveGroup(e,t){if(!this._groups.has(e.id))throw new Error("invalid operation");let i=this._groups.get(e.id),n=this.gridview.remove(e,ke.Distribute);if(i&&!t?.skipDispose&&(i.disposable.dispose(),i.value.dispose(),this._groups.delete(e.id),this._onDidRemove.fire(e)),!t?.skipActive&&this._activeGroup===e){let s=Array.from(this._groups.values());this.doSetGroupActive(s.length>0?s[0].value:void 0)}return n}getPanel(e){var t;return(t=this._groups.get(e))===null||t===void 0?void 0:t.value}doSetGroupActive(e){this._activeGroup!==e&&(this._activeGroup&&this._activeGroup.setActive(!1),e&&e.setActive(!0),this._activeGroup=e,this._onDidActiveChange.fire(e))}removeGroup(e){this.doRemoveGroup(e)}activateNext(e){var t,i;if((t=e)!==null&&t!==void 0||(e={}),!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}let n=we(e.group.element),s=(i=this.gridview.next(n))===null||i===void 0?void 0:i.view;this.doSetGroupActive(s)}activatePrevious(e){var t,i;if((t=e)!==null&&t!==void 0||(e={}),!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}let n=we(e.group.element),s=(i=this.gridview.previous(n))===null||i===void 0?void 0:i.view;this.doSetGroupActive(s)}forceRelayout(){this.layout(this.width,this.height,!0)}layout(e,t,i){(i||e!==this.width||t!==this.height)&&(this.gridview.element.style.height=`${t}px`,this.gridview.element.style.width=`${e}px`,this.gridview.layout(e,t))}dispose(){this._onDidActiveChange.dispose(),this._onDidAdd.dispose(),this._onDidRemove.dispose();for(let e of this.groups)e.dispose();this.gridview.dispose(),super.dispose()}};function ci(e){"@babel/helpers - typeof";return ci=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ci(e)}function Ol(e,t){if(ci(e)!="object"||!e)return e;var i=e[Symbol.toPrimitive];if(i!==void 0){var n=i.call(e,t||"default");if(ci(n)!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Rl(e){var t=Ol(e,"string");return ci(t)=="symbol"?t:t+""}function $l(e,t,i){return(t=Rl(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function zr(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(s){return Object.getOwnPropertyDescriptor(e,s).enumerable})),i.push.apply(i,n)}return i}function J(e){for(var t=1;t<arguments.length;t++){var i=arguments[t]!=null?arguments[t]:{};t%2?zr(Object(i),!0).forEach(function(n){$l(e,n,i[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):zr(Object(i)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(i,n))})}return e}function Nl(e,t){return e==="center"?`Tab into ${t}`:`Split ${e} of ${t}`}function Vl(e,t){return e==="center"?`docked into ${t}`:`split ${e} of ${t}`}let Li={panelOpened:e=>`${e} opened`,panelClosed:e=>`${e} closed`,groupMaximized:e=>`${e} maximized`,groupRestored:e=>`${e} restored`,groupFloated:e=>`${e} floated`,groupDocked:e=>`${e} docked`,groupPoppedOut:e=>`${e} opened in a new window`,closeTab:e=>`Close ${e}`,closeTabPlain:()=>"Close",movePickTarget:(e,t,i,n)=>`Moving ${e}. Target ${t}, ${i} of ${n}. Enter to choose where, Escape to cancel.`,movePickEdge:(e,t)=>`${Nl(e,t)}. Arrows to change, Enter to confirm, Escape to go back.`,moveCommitted:(e,t,i)=>`${e} ${Vl(i,t)}.`,moveCancelled:()=>"Move cancelled.",moveNotAllowed:()=>"That move is not allowed.",moveFloated:e=>`${e} floated.`};function oo(e){return e?J(J({},Li),e):Li}var Tr=class{get minimumSize(){return this.component.minimumSize}get maximumSize(){return this.component.maximumSize}get width(){return this.component.width}get height(){return this.component.height}get length(){return this.component.length}get orientation(){return this.component.orientation}get panels(){return this.component.panels}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidAddView(){return this.component.onDidAddView}get onDidRemoveView(){return this.component.onDidRemoveView}constructor(e){this.component=e}removePanel(e,t){this.component.removePanel(e,t)}focus(){this.component.focus()}getPanel(e){return this.component.getPanel(e)}layout(e,t){return this.component.layout(e,t)}addPanel(e){return this.component.addPanel(e)}movePanel(e,t){this.component.movePanel(e,t)}fromJSON(e){this.component.fromJSON(e)}toJSON(){return this.component.toJSON()}clear(){this.component.clear()}updateOptions(e){this.component.updateOptions(e)}dispose(){this.component.dispose()}},Ut=class{get minimumSize(){return this.component.minimumSize}get maximumSize(){return this.component.maximumSize}get width(){return this.component.width}get height(){return this.component.height}get panels(){return this.component.panels}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get onDidAddView(){return this.component.onDidAddView}get onDidRemoveView(){return this.component.onDidRemoveView}get onDidDrop(){return this.component.onDidDrop}get onUnhandledDragOver(){return this.component.onUnhandledDragOver}constructor(e){this.component=e}removePanel(e){this.component.removePanel(e)}getPanel(e){return this.component.getPanel(e)}movePanel(e,t){this.component.movePanel(e,t)}focus(){this.component.focus()}layout(e,t){this.component.layout(e,t)}addPanel(e){return this.component.addPanel(e)}fromJSON(e){this.component.fromJSON(e)}toJSON(){return this.component.toJSON()}clear(){this.component.clear()}updateOptions(e){this.component.updateOptions(e)}dispose(){this.component.dispose()}},Ar=class{get width(){return this.component.width}get height(){return this.component.height}get minimumHeight(){return this.component.minimumHeight}get maximumHeight(){return this.component.maximumHeight}get minimumWidth(){return this.component.minimumWidth}get maximumWidth(){return this.component.maximumWidth}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidAddPanel(){return this.component.onDidAddGroup}get onDidRemovePanel(){return this.component.onDidRemoveGroup}get onDidActivePanelChange(){return this.component.onDidActiveGroupChange}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get panels(){return this.component.groups}get orientation(){return this.component.orientation}set orientation(e){this.component.updateOptions({orientation:e})}constructor(e){this.component=e}focus(){this.component.focus()}layout(e,t,i=!1){this.component.layout(e,t,i)}addPanel(e){return this.component.addPanel(e)}removePanel(e,t){this.component.removePanel(e,t)}movePanel(e,t){this.component.movePanel(e,t)}getPanel(e){return this.component.getPanel(e)}fromJSON(e){return this.component.fromJSON(e)}toJSON(){return this.component.toJSON()}clear(){this.component.clear()}updateOptions(e){this.component.updateOptions(e)}dispose(){this.component.dispose()}},Oi=class{get id(){return this.component.id}get width(){return this.component.width}get height(){return this.component.height}get minimumHeight(){return this.component.minimumHeight}get maximumHeight(){return this.component.maximumHeight}get minimumWidth(){return this.component.minimumWidth}get maximumWidth(){return this.component.maximumWidth}get size(){return this.component.size}get tabGroupColors(){return this.component.tabGroupColorPalette.entries()}get totalPanels(){return this.component.totalPanels}get onDidActiveGroupChange(){return this.component.onDidActiveGroupChange}get onDidAddGroup(){return this.component.onDidAddGroup}get onDidRemoveGroup(){return this.component.onDidRemoveGroup}get onDidActivePanelChange(){return this.component.onDidActivePanelChange}get onDidPanelPinnedChange(){return this.component.onDidPanelPinnedChange}get onDidAddPanel(){return this.component.onDidAddPanel}get onDidRemovePanel(){return this.component.onDidRemovePanel}get onDidMovePanel(){return this.component.onDidMovePanel}get onDidLayoutFromJSON(){return this.component.onDidLayoutFromJSON}get onDidLayoutChange(){return this.component.onDidLayoutChange}get onDidDrop(){return this.component.onDidDrop}get onWillDrop(){return this.component.onWillDrop}get onWillMutateLayout(){return this.component.onWillMutateLayout}get onDidMutateLayout(){return this.component.onDidMutateLayout}get onWillShowOverlay(){return this.component.onWillShowOverlay}get onWillDragGroup(){return this.component.onWillDragGroup}get onWillDragPanel(){return this.component.onWillDragPanel}get onUnhandledDragOver(){return this.component.onUnhandledDragOver}get dndCapabilities(){return this.component.dndCapabilities}get onDidPopoutGroupSizeChange(){return this.component.onDidPopoutGroupSizeChange}get onDidPopoutGroupPositionChange(){return this.component.onDidPopoutGroupPositionChange}get onDidAddPopoutGroup(){return this.component.onDidAddPopoutGroup}get onDidRemovePopoutGroup(){return this.component.onDidRemovePopoutGroup}get onDidOpenPopoutWindowFail(){return this.component.onDidOpenPopoutWindowFail}get onWillClosePopoutWindow(){return this.component.onWillClosePopoutWindow}getPopouts(){return this.component.getPopouts()}get onDidCreateTabGroup(){return this.component.onDidCreateTabGroup}get onDidDestroyTabGroup(){return this.component.onDidDestroyTabGroup}get onDidAddPanelToTabGroup(){return this.component.onDidAddPanelToTabGroup}get onDidRemovePanelFromTabGroup(){return this.component.onDidRemovePanelFromTabGroup}get onDidTabGroupChange(){return this.component.onDidTabGroupChange}get onDidTabGroupCollapsedChange(){return this.component.onDidTabGroupCollapsedChange}get panels(){return this.component.panels}get groups(){return this.component.groups}adjacentGroupInDirection(e,t){return this.component.adjacentGroupInDirection(e,t)}get activePanel(){return this.component.activePanel}get activeGroup(){return this.component.activeGroup}get messages(){return oo(this.component.options.messages)}constructor(e){this.component=e}focus(){this.component.focus()}getPanel(e){return this.component.getGroupPanel(e)}layout(e,t,i=!1){this.component.layout(e,t,i)}addPanel(e){return this.component.withOrigin("api",()=>this.component.addPanel(e))}removePanel(e,t){this.component.withOrigin("api",()=>this.component.removePanel(e,t))}addGroup(e){return this.component.withOrigin("api",()=>this.component.addGroup(e))}closeAllGroups(){return this.component.withOrigin("api",()=>this.component.closeAllGroups())}removeGroup(e){this.component.withOrigin("api",()=>this.component.removeGroup(e))}getGroup(e){return this.component.getPanel(e)}addFloatingGroup(e,t){return this.component.withOrigin("api",()=>this.component.addFloatingGroup(e,t))}fromJSON(e,t){this.component.withOrigin("api",()=>this.component.fromJSON(e,t))}toJSON(){return this.component.toJSON()}clear(){this.component.withOrigin("api",()=>this.component.clear())}undo(){this.component.undo()}redo(){this.component.redo()}get canUndo(){return this.component.canUndo}get canRedo(){return this.component.canRedo}clearHistory(){this.component.clearHistory()}get onDidChangeHistory(){return this.component.onDidChangeHistory}get smartGuidesEnabled(){return this.component.smartGuidesEnabled}setSmartGuidesEnabled(e){this.component.setSmartGuidesEnabled(e)}updateSmartGuidesOptions(e){this.component.updateSmartGuidesOptions(e)}get onDidSnapFloat(){return this.component.onDidSnapFloat}get onDidSnapTogether(){return this.component.onDidSnapTogether}get popoutRestorationPromise(){return this.component.popoutRestorationPromise}activateNext(e){this.component.activateNext(e)}activatePrevious(e){this.component.activatePrevious(e)}moveToNext(e){this.activateNext(e)}moveToPrevious(e){this.activatePrevious(e)}maximizeGroup(e){this.component.withOrigin("api",()=>this.component.maximizeGroup(e.group))}hasMaximizedGroup(){return this.component.hasMaximizedGroup()}exitMaximizedGroup(){this.component.withOrigin("api",()=>this.component.exitMaximizedGroup())}get onDidMaximizedGroupChange(){return this.component.onDidMaximizedGroupChange}addPopoutGroup(e,t){return this.component.withOrigin("api",()=>this.component.addPopoutGroup(e,t))}addEdgeGroup(e,t){return this.component.addEdgeGroup(e,t)}revealEdgeGroupWithData(e,t,i){this.component.revealEdgeGroupWithData(e,t,i)}getEdgeGroup(e){return this.component.getEdgeGroup(e)}setEdgeGroupVisible(e,t){this.component.setEdgeGroupVisible(e,t)}isEdgeGroupVisible(e){return this.component.isEdgeGroupVisible(e)}removeEdgeGroup(e){this.component.removeEdgeGroup(e)}pinEdgeGroup(e){this.component.pinEdgeGroup(e)}autoHideEdgeGroup(e){this.component.autoHideEdgeGroup(e)}peekEdgeGroup(e,t){this.component.peekEdgeGroup(e,t)}updateOptions(e){this.component.updateOptions(e)}_getGroupModel(e){let t=this.component.getPanel(e);if(!t)throw new Error(`dockview: group '${e}' not found`);return t.model}createTabGroup(e){let t=this._getGroupModel(e.groupId);return this.component.withOrigin("api",()=>t.createTabGroup({label:e.label,color:e.color,componentParams:e.componentParams}))}dissolveTabGroup(e){let t=this._getGroupModel(e.groupId);this.component.withOrigin("api",()=>t.dissolveTabGroup(e.tabGroupId))}addPanelToTabGroup(e){let t=this._getGroupModel(e.groupId);this.component.withOrigin("api",()=>t.addPanelToTabGroup(e.tabGroupId,e.panelId,e.index))}removePanelFromTabGroup(e){let t=this._getGroupModel(e.groupId);this.component.withOrigin("api",()=>t.removePanelFromTabGroup(e.panelId))}getTabGroups(e){return this._getGroupModel(e.groupId).getTabGroups()}getTabGroupForPanel(e){return this._getGroupModel(e.groupId).getTabGroupForPanel(e.panelId)}moveTabGroup(e){this._getGroupModel(e.groupId).moveTabGroup(e.tabGroupId,e.index)}dispose(){this.component.dispose()}},Er=class extends D{constructor(e,t){super(),this.element=e,this.callbacks=t,this.target=null,this.registerListeners()}onDragEnter(e){this.target=e.target,this.callbacks.onDragEnter(e)}onDragOver(e){e.preventDefault(),this.callbacks.onDragOver&&this.callbacks.onDragOver(e)}onDragLeave(e){this.target===e.target&&(this.target=null,this.callbacks.onDragLeave(e))}onDragEnd(e){this.target=null,this.callbacks.onDragEnd(e)}onDrop(e){this.callbacks.onDrop(e)}registerListeners(){this.addDisposables(O(this.element,"dragenter",e=>{this.onDragEnter(e)},!0)),this.addDisposables(O(this.element,"dragover",e=>{this.onDragOver(e)},!0)),this.addDisposables(O(this.element,"dragleave",e=>{this.onDragLeave(e)})),this.addDisposables(O(this.element,"dragend",e=>{this.onDragEnd(e)})),this.addDisposables(O(this.element,"drop",e=>{this.onDrop(e)}))}};let Wl={value:50,type:"percentage"},Hl=100,Bl=100;function ro(){let e=document.createElement("div");e.className="dv-drop-target-dropzone";let t=document.createElement("div");return t.className="dv-drop-target-selection",e.appendChild(t),{dropzone:e,selection:t}}function Ir(e,t,i,n){var s,l,c;let p=(s=n?.smallWidthBoundary)!==null&&s!==void 0?s:Hl,v=(l=n?.smallHeightBoundary)!==null&&l!==void 0?l:Bl,m=t<p,f=i<v,_=e==="left",y=e==="right",x=e==="top",k=e==="bottom",S=!m&&y,z=!m&&_,M=!f&&x,I=!f&&k,A=1,N=(c=n?.size)!==null&&c!==void 0?c:Wl;return N.type==="percentage"?A=ye(N.value,0,100)/100:((S||z)&&(A=ye(0,N.value,t)/t),(M||I)&&(A=ye(0,N.value,i)/i)),{isSmallX:m,isSmallY:f,isLeft:_,isRight:y,isTop:x,isBottom:k,rightClass:S,leftClass:z,topClass:M,bottomClass:I,size:A}}function Mr(e,t,i,n,s){let l=Ir(t,i,n,s),{rightClass:c,leftClass:p,topClass:v,bottomClass:m,size:f}=l,_={top:"0px",left:"0px",width:"100%",height:"100%"};c?(_.left=`${100*(1-f)}%`,_.width=`${100*f}%`):p?_.width=`${100*f}%`:v?_.height=`${100*f}%`:m&&(_.top=`${100*(1-f)}%`,_.height=`${100*f}%`),l.isSmallX&&l.isLeft&&(_.width="4px"),l.isSmallX&&l.isRight&&(_.left=`${i-4}px`,_.width="4px"),l.isSmallY&&l.isTop&&(_.height="4px"),l.isSmallY&&l.isBottom&&(_.top=`${n-4}px`,_.height="4px"),e.style.top=_.top,e.style.left=_.left,e.style.width=_.width,e.style.height=_.height,e.style.visibility="visible",(!e.style.transform||e.style.transform==="")&&(e.style.transform="translate3d(0, 0, 0)");let y=l.isSmallX&&(l.isLeft||l.isRight)||l.isSmallY&&(l.isTop||l.isBottom);E(e,"dv-drop-target-small-vertical",l.isSmallY),E(e,"dv-drop-target-small-horizontal",l.isSmallX),E(e,"dv-drop-target-selection-line",y),E(e,"dv-drop-target-left",l.isLeft),E(e,"dv-drop-target-right",l.isRight),E(e,"dv-drop-target-top",l.isTop),E(e,"dv-drop-target-bottom",l.isBottom),E(e,"dv-drop-target-center",t==="center")}function Fl(e,t){let i=`${Math.round(t.top)}px`,n=`${Math.round(t.left)}px`,s=`${Math.round(t.width)}px`,l=`${Math.round(t.height)}px`;return e.style.top!==i||e.style.left!==n||e.style.width!==s||e.style.height!==l}function Ul(e,t){e.style.top=`${Math.round(t.top)}px`,e.style.left=`${Math.round(t.left)}px`,e.style.width=`${Math.round(t.width)}px`,e.style.height=`${Math.round(t.height)}px`,e.style.visibility="visible",(!e.style.transform||e.style.transform==="")&&(e.style.transform="translate3d(0, 0, 0)")}function Lr(e){let t=Ir(e.quadrant,e.width,e.height,e.overlayModel),{rightClass:i,leftClass:n,topClass:s,bottomClass:l,size:c}=t,p=e.outlineElement.getBoundingClientRect(),v=e.targetModel.getElements(void 0,e.outlineElement),m=v.root,f=v.overlay,_=m.getBoundingClientRect(),y=p.top-_.top,x=p.left-_.left,k={top:y,left:x,width:e.width,height:e.height};return i?(k.left=x+e.width*(1-c),k.width=e.width*c):n?k.width=e.width*c:s?k.height=e.height*c:l&&(k.top=y+e.height*(1-c),k.height=e.height*c),t.isSmallX&&t.isLeft&&(k.width=4),t.isSmallX&&t.isRight&&(k.left=x+e.width-4,k.width=4),t.isSmallY&&t.isTop&&(k.height=4),t.isSmallY&&t.isBottom&&(k.top=y+e.height-4,k.height=4),Fl(f,k)?(Ul(f,k),f.className=`dv-drop-target-anchor${e.className?` ${e.className}`:""}`,E(f,"dv-drop-target-left",t.isLeft),E(f,"dv-drop-target-right",t.isRight),E(f,"dv-drop-target-top",t.isTop),E(f,"dv-drop-target-bottom",t.isBottom),E(f,"dv-drop-target-anchor-line",t.isSmallX&&(t.isLeft||t.isRight)||t.isSmallY&&(t.isTop||t.isBottom)),E(f,"dv-drop-target-center",e.quadrant==="center"),v.changed&&(E(f,"dv-drop-target-anchor-container-changed",!0),setTimeout(()=>{E(f,"dv-drop-target-anchor-container-changed",!1)},10)),{boundsChanged:!0,targetChanged:v.changed}):{boundsChanged:!1,targetChanged:v.changed}}var Or=class extends T{get nativeEvent(){return this.options.nativeEvent}get position(){return this.options.position}get edge(){return!!this.options.edge}get edgeGroup(){return!!this.options.edgeGroup}constructor(e){super(),this.options=e}};function so(e){switch(e){case"above":return"top";case"below":return"bottom";case"left":return"left";case"right":return"right";case"within":return"center";default:throw new Error(`invalid direction '${e}'`)}}function Rr(e){switch(e){case"top":return"above";case"bottom":return"below";case"left":return"left";case"right":return"right";case"center":return"within";default:throw new Error(`invalid position '${e}'`)}}let Yl={value:20,type:"percentage"};var ao=class Gi extends D{get disabled(){return this._disabled}set disabled(t){this._disabled=t}get state(){return this._state}constructor(t,i){super(),this.element=t,this.options=i,this._edge=!1,this._onDrop=new G,this.onDrop=this._onDrop.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._disabled=!1,this._acceptedTargetZonesSet=new Set(this.options.acceptedTargetZones),this.dnd=new Er(this.element,{onDragEnter:()=>{var n,s;(n=(s=this.options).getOverrideTarget)===null||n===void 0||(n=n.call(s))===null||n===void 0||n.getElements()},onDragOver:n=>{var s,l,c,p,v,m,f;if(this._disabled){this.clearOwnOverlay();return}Gi.ACTUAL_TARGET=this;let _=(s=(l=this.options).getOverrideTarget)===null||s===void 0?void 0:s.call(l);if(this._acceptedTargetZonesSet.size===0){this.clearOwnOverlay();return}let y=(c=(p=(v=this.options).getOverlayOutline)===null||p===void 0?void 0:p.call(v))!==null&&c!==void 0?c:this.element,x=y.offsetWidth,k=y.offsetHeight;if(x===0||k===0)return;let S=y.getBoundingClientRect(),z=((m=n.clientX)!==null&&m!==void 0?m:0)-S.left,M=((f=n.clientY)!==null&&f!==void 0?f:0)-S.top,I=this.resolvePosition(z,M,x,k,n);if(this.isAlreadyUsed(n)){this.removeDropTarget();return}if(I===null){this.clearOwnOverlay();return}let A=I.position;if(!this.options.canDisplayOverlay(n,A)){this.clearOwnOverlay();return}let N=new Or({nativeEvent:n,position:A,edge:I.edge,edgeGroup:I.edgeGroup});if(this._onWillShowOverlay.fire(N),N.defaultPrevented){this.clearOwnOverlay();return}if(this.markAsUsed(n),I.edge){this.clearOwnOverlay(),this._state=A,this._edge=!0;return}if(this._edge=!1,!_){if(!this.targetElement){let X=ro();this.targetElement=X.dropzone,this.overlayElement=X.selection,this._state="center",y.classList.add("dv-drop-target"),y.append(this.targetElement)}}this.toggleClasses(A,x,k),this._state=A},onDragLeave:()=>{var n,s;let l=(n=(s=this.options).getOverrideTarget)===null||n===void 0?void 0:n.call(s);if(l){var c;this._state=void 0,this._edge=!1,(c=l.scheduleClear)===null||c===void 0||c.call(l);return}this.removeDropTarget()},onDragEnd:n=>{var s,l;let c=(s=(l=this.options).getOverrideTarget)===null||s===void 0?void 0:s.call(l);c&&Gi.ACTUAL_TARGET===this&&this._state&&(n.stopPropagation(),this._onDrop.fire({position:this._state,nativeEvent:n,edge:this._edge})),this.removeDropTarget(),c?.clear()},onDrop:n=>{var s,l;n.preventDefault();let c=this._state,p=this._edge;this.removeDropTarget(),(s=(l=this.options).getOverrideTarget)===null||s===void 0||(s=s.call(l))===null||s===void 0||s.clear(),c&&(n.stopPropagation(),this._onDrop.fire({position:c,nativeEvent:n,edge:p}))}}),this.addDisposables(this._onDrop,this._onWillShowOverlay,this.dnd)}setTargetZones(t){this._acceptedTargetZonesSet=new Set(t)}setOverlayModel(t){this.options.overlayModel=t}dispose(){this.removeDropTarget(),super.dispose()}markAsUsed(t){t[Gi.USED_EVENT_ID]=!0}isAlreadyUsed(t){let i=t[Gi.USED_EVENT_ID];return typeof i=="boolean"&&i}toggleClasses(t,i,n){var s,l;let c=(s=(l=this.options).getOverrideTarget)===null||s===void 0?void 0:s.call(l);if(c){var p,v,m;Lr({outlineElement:(p=(v=(m=this.options).getOverlayOutline)===null||v===void 0?void 0:v.call(m))!==null&&p!==void 0?p:this.element,targetModel:c,quadrant:t,width:i,height:n,overlayModel:this.options.overlayModel,className:this.options.className});return}this.overlayElement&&Mr(this.overlayElement,t,i,n,this.options.overlayModel)}resolvePosition(t,i,n,s,l){var c,p;let v=(c=(p=this.options).getPositionResolver)===null||c===void 0?void 0:c.call(p);if(v){let f=v.resolve({x:t,y:i,width:n,height:s,zones:this._acceptedTargetZonesSet,event:l});return f?{position:f.position,edge:!!f.edge,edgeGroup:!!f.edgeGroup}:null}let m=this.calculateQuadrant(this._acceptedTargetZonesSet,t,i,n,s);return m?{position:m,edge:!1,edgeGroup:!1}:null}calculateQuadrant(t,i,n,s,l){var c,p;let v=(c=(p=this.options.overlayModel)===null||p===void 0?void 0:p.activationSize)!==null&&c!==void 0?c:Yl;return v.type==="percentage"?$r(t,i,n,s,l,v.value):Nr(t,i,n,s,l,v.value)}clearOwnOverlay(){let t=this._state!==void 0;if(this.removeDropTarget(),t){var i,n;(i=(n=this.options).getOverrideTarget)===null||i===void 0||(i=i.call(n))===null||i===void 0||i.clear()}}removeDropTarget(){if(this._state=void 0,this._edge=!1,this.targetElement){var t;(t=this.targetElement.parentElement)===null||t===void 0||t.classList.remove("dv-drop-target"),this.targetElement.remove(),this.targetElement=void 0,this.overlayElement=void 0}}showOverlay(t){var i,n,s,l,c;let p=(i=(n=this.options).getOverrideTarget)===null||i===void 0?void 0:i.call(n),v=(s=(l=(c=this.options).getOverlayOutline)===null||l===void 0?void 0:l.call(c))!==null&&s!==void 0?s:this.element,m=v.offsetWidth,f=v.offsetHeight;if(!p&&!this.targetElement){let _=ro();this.targetElement=_.dropzone,this.overlayElement=_.selection,v.classList.add("dv-drop-target"),v.append(this.targetElement)}this.toggleClasses(t,m,f),this._state=t}clearOverlay(){var t,i;this.removeDropTarget(),(t=(i=this.options).getOverrideTarget)===null||t===void 0||(t=t.call(i))===null||t===void 0||t.clear(),this._state=void 0}};ao.USED_EVENT_ID="__dockview_droptarget_event_is_used__";function $r(e,t,i,n,s,l){let c=100*t/n,p=100*i/s;return e.has("left")&&c<l?"left":e.has("right")&&c>100-l?"right":e.has("top")&&p<l?"top":e.has("bottom")&&p>100-l?"bottom":e.has("center")?"center":null}function Nr(e,t,i,n,s,l){return e.has("left")&&t<l?"left":e.has("right")&&t>n-l?"right":e.has("top")&&i<l?"top":e.has("bottom")&&i>s-l?"bottom":e.has("center")?"center":null}function ql(e,t,i){var n,s,l;F(t,"dv-dragged"),t.style.top="-9999px",t.style.position="absolute",(i?.owner?yr(i.owner):((n=i?.ownerDocument)!==null&&n!==void 0?n:document).body).appendChild(t),e.setDragImage(t,(s=i?.x)!==null&&s!==void 0?s:0,(l=i?.y)!==null&&l!==void 0?l:0),setTimeout(()=>{L(t,"dv-dragged"),t.remove()},0)}var Ri=class Pi extends D{static getInstance(){var t;return(t=Pi._instance)!==null&&t!==void 0||(Pi._instance=new Pi),Pi._instance}constructor(){super(),this._targets=new Set,this._targetByElement=new Map,this._onDragStart=new G,this.onDragStart=this._onDragStart.event,this._onDragMove=new G,this.onDragMove=this._onDragMove.event,this._onDragEnd=new G,this.onDragEnd=this._onDragEnd.event,this.addDisposables(this._onDragStart,this._onDragMove,this._onDragEnd)}get active(){return this._active}registerTarget(t){return this._targets.add(t),this._targetByElement.set(t.element,t),{dispose:()=>{this._targets.delete(t),this._targetByElement.get(t.element)===t&&this._targetByElement.delete(t.element),this._currentTarget===t&&(this._currentTarget=void 0)}}}beginDrag(t){var i,n,s,l;this._active&&this.cancel();let{pointerEvent:c,source:p}=t,v=t.getData();this._active={pointerId:c.pointerId,startX:c.clientX,startY:c.clientY,source:p},this._lastPointerEvent=c,this._onDragMoveCallback=t.onDragMove,this._onDragEndCallback=t.onDragEnd,this._dataDisposable=v,this._ghost=t.ghost,this._iframeShield=pe((i=p.ownerDocument)!==null&&i!==void 0?i:document),this._selectionShield=De((n=p.ownerDocument)!==null&&n!==void 0?n:document);let m={clientX:c.clientX,clientY:c.clientY,pointerEvent:c};this._onDragStart.fire(m);let f=(s=(l=p.ownerDocument)===null||l===void 0?void 0:l.defaultView)!==null&&s!==void 0?s:globalThis.window;this._moveListener=O(f,"pointermove",_=>{var y;_.pointerId===((y=this._active)===null||y===void 0?void 0:y.pointerId)&&this._handleMove(_)}),this._upListener=O(f,"pointerup",_=>{var y;_.pointerId===((y=this._active)===null||y===void 0?void 0:y.pointerId)&&this._handleEnd(_,!0)}),this._cancelListener=O(f,"pointercancel",_=>{var y;_.pointerId===((y=this._active)===null||y===void 0?void 0:y.pointerId)&&this._handleEnd(_,!1)})}cancel(){var t,i;if(!this._active)return;let n=this._onDragEndCallback,s=this._lastPointerEvent;if((t=this._currentTarget)===null||t===void 0||t.handleDragLeave(),this._teardown(),(i=this._dataDisposable)===null||i===void 0||i.dispose(),this._dataDisposable=void 0,s){let l={clientX:s.clientX,clientY:s.clientY,pointerEvent:s};n?.(l,!1),this._onDragEnd.fire(l)}}_findTargetUnder(t,i){let n=(this._active?he(this._active.source):document).elementsFromPoint(t,i);for(let l of n){let c=l;for(;c;){var s;let p=this._targetByElement.get(c);if(p&&!(!((s=p.isHitTestTransparent)===null||s===void 0)&&s.call(p)))return p;c=c.parentElement}}}_handleMove(t){var i,n;this._lastPointerEvent=t,(i=this._ghost)===null||i===void 0||i.update(t.clientX,t.clientY);let s={clientX:t.clientX,clientY:t.clientY,pointerEvent:t},l=this._findTargetUnder(t.clientX,t.clientY);if(l!==this._currentTarget){var c;(c=this._currentTarget)===null||c===void 0||c.handleDragLeave(),this._currentTarget=l}l&&l.handleDragOver(s),(n=this._onDragMoveCallback)===null||n===void 0||n.call(this,s),this._onDragMove.fire(s)}_handleEnd(t,i){let n={clientX:t.clientX,clientY:t.clientY,pointerEvent:t};if(i&&this._currentTarget)this._currentTarget.handleDrop(n);else{var s;(s=this._currentTarget)===null||s===void 0||s.handleDragLeave()}let l=this._onDragEndCallback,c=this._dataDisposable;this._teardown(),this._dataDisposable=void 0,setTimeout(()=>c?.dispose(),0),l?.(n,i),this._onDragEnd.fire(n)}_teardown(){var t,i,n,s,l,c;this._currentTarget=void 0,this._active=void 0,this._lastPointerEvent=void 0,this._onDragMoveCallback=void 0,this._onDragEndCallback=void 0,(t=this._ghost)===null||t===void 0||t.dispose(),this._ghost=void 0,(i=this._iframeShield)===null||i===void 0||i.release(),this._iframeShield=void 0,(n=this._selectionShield)===null||n===void 0||n.release(),this._selectionShield=void 0,(s=this._moveListener)===null||s===void 0||s.dispose(),(l=this._upListener)===null||l===void 0||l.dispose(),(c=this._cancelListener)===null||c===void 0||c.dispose(),this._moveListener=void 0,this._upListener=void 0,this._cancelListener=void 0}};let jl={value:20,type:"percentage"};var Jl=class extends D{get disabled(){return this._disabled}set disabled(e){this._disabled=e,e&&this._removeOverlay()}get state(){return this._state}constructor(e,t){super(),this.element=e,this.options=t,this._edge=!1,this._onDrop=new G,this.onDrop=this._onDrop.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._disabled=!1,this._acceptedTargetZonesSet=new Set(t.acceptedTargetZones);let i={element:this.element,handleDragOver:n=>this._onDragOver(n),handleDragLeave:()=>this._onDragLeave(),handleDrop:n=>this._onDropEvent(n),isHitTestTransparent:t.isHitTestTransparent};this.addDisposables(this._onDrop,this._onWillShowOverlay,Ri.getInstance().registerTarget(i))}clearOverlay(){this._clearOwnOverlay()}setTargetZones(e){this._acceptedTargetZonesSet=new Set(e)}setOverlayModel(e){this.options.overlayModel=e}dispose(){this._removeOverlay(),super.dispose()}_onDragOver(e){var t,i,n,s,l;if(this._disabled){this._clearOwnOverlay();return}let c=(t=(i=this.options).getOverrideTarget)===null||t===void 0?void 0:t.call(i);if(this._acceptedTargetZonesSet.size===0){this._clearOwnOverlay();return}let p=(n=(s=(l=this.options).getOverlayOutline)===null||s===void 0?void 0:s.call(l))!==null&&n!==void 0?n:this.element,v=p.offsetWidth,m=p.offsetHeight;if(v===0||m===0)return;let f=p.getBoundingClientRect(),_=e.clientX-f.left,y=e.clientY-f.top,x=this._resolvePosition(_,y,v,m,e.pointerEvent);if(x===null){this._clearOwnOverlay();return}let k=x.position;if(!this.options.canDisplayOverlay(e.pointerEvent,k)){this._clearOwnOverlay();return}let S=new Or({nativeEvent:e.pointerEvent,position:k,edge:x.edge});if(this._onWillShowOverlay.fire(S),S.defaultPrevented){this._clearOwnOverlay();return}if(x.edge){this._clearOwnOverlay(),this._state=k,this._edge=!0;return}if(this._edge=!1,c){Lr({outlineElement:p,targetModel:c,quadrant:k,width:v,height:m,overlayModel:this.options.overlayModel,className:this.options.className}),this._state=k;return}if(!this._targetElement){let z=ro();this._targetElement=z.dropzone,this._overlayElement=z.selection,this._state="center",this.element.classList.add("dv-drop-target"),this.element.append(this._targetElement)}this._overlayElement&&Mr(this._overlayElement,k,v,m,this.options.overlayModel),this._state=k}_onDragLeave(){var e,t;let i=(e=(t=this.options).getOverrideTarget)===null||e===void 0?void 0:e.call(t);if(i){this._state=void 0,i.clear();return}this._removeOverlay()}_onDropEvent(e){var t,i;let n=this._state,s=this._edge,l=(t=(i=this.options).getOverrideTarget)===null||t===void 0?void 0:t.call(i);this._removeOverlay(),l?.clear(),n&&this._onDrop.fire({position:n,nativeEvent:e.pointerEvent,edge:s})}_resolvePosition(e,t,i,n,s){var l,c;let p=(l=(c=this.options).getPositionResolver)===null||l===void 0?void 0:l.call(c);if(p){let m=p.resolve({x:e,y:t,width:i,height:n,zones:this._acceptedTargetZonesSet,event:s});return m?{position:m.position,edge:!!m.edge}:null}let v=this._calculateQuadrant(e,t,i,n);return v?{position:v,edge:!1}:null}_calculateQuadrant(e,t,i,n){var s,l;let c=(s=(l=this.options.overlayModel)===null||l===void 0?void 0:l.activationSize)!==null&&s!==void 0?s:jl;return c.type==="percentage"?$r(this._acceptedTargetZonesSet,e,t,i,n,c.value):Nr(this._acceptedTargetZonesSet,e,t,i,n,c.value)}_clearOwnOverlay(){let e=this._state!==void 0;if(this._removeOverlay(),e){var t,i;(t=(i=this.options).getOverrideTarget)===null||t===void 0||(t=t.call(i))===null||t===void 0||t.clear()}}_removeOverlay(){if(this._edge=!1,this._targetElement){var e;this._state=void 0,(e=this._targetElement.parentElement)===null||e===void 0||e.classList.remove("dv-drop-target"),this._targetElement.remove(),this._targetElement=void 0,this._overlayElement=void 0}else this._state=void 0}};let Kl=5,Xl=250,Zl=8;var Ql=class extends D{constructor(e,t){var i;super(),this.element=e,this.options=t,this._disabled=!1,this._armed=!1,this._startX=0,this._startY=0,this._touchOnly=(i=t.touchOnly)!==null&&i!==void 0?i:!0,this.addDisposables(O(this.element,"pointerdown",n=>{this._onPointerDown(n)}))}setDisabled(e){this._disabled=e,e&&this._cancelPending()}setTouchOnly(e){this._touchOnly!==e&&(this._touchOnly=e,e&&this._cancelPending())}_shouldHandle(e){var t,i;return!(this._disabled||this._touchOnly&&e.pointerType!=="touch"&&e.pointerType!=="pen"||!((t=(i=this.options).isCancelled)===null||t===void 0)&&t.call(i,e))}_onPointerDown(e){var t,i,n,s,l,c;if(!this._shouldHandle(e))return;this._cancelPending(),this._selectionShield=De((t=this.element.ownerDocument)!==null&&t!==void 0?t:document),this._pendingPointerId=e.pointerId,this._startX=e.clientX,this._startY=e.clientY,this._startEvent=e;let p=e.pointerType==="touch"||e.pointerType==="pen",v=this.options.touchInitiationDelay,m=(i=typeof v=="function"?v():v)!==null&&i!==void 0?i:Xl;this._armed=!p||m<=0,p&&m>0&&Number.isFinite(m)&&(this._armTimer=setTimeout(()=>{this._armTimer=void 0,this._armed=!0},m));let f=(n=this.options.threshold)!==null&&n!==void 0?n:Kl,_=this.options.pressTolerance,y=(s=typeof _=="function"?_():_)!==null&&s!==void 0?s:Zl,x=(l=(c=this.element.ownerDocument)===null||c===void 0?void 0:c.defaultView)!==null&&l!==void 0?l:globalThis.window;this._pendingMoveListener=O(x,"pointermove",k=>{if(k.pointerId!==this._pendingPointerId)return;let S=k.clientX-this._startX,z=k.clientY-this._startY,M=Math.hypot(S,z);if(this._armed){M>=f&&this._beginDrag(k);return}M>y&&this._beginDrag(k)}),this._pendingUpListener=O(x,"pointerup",k=>{k.pointerId===this._pendingPointerId&&this._cancelPending()}),this._pendingCancelListener=O(x,"pointercancel",k=>{k.pointerId===this._pendingPointerId&&this._cancelPending()})}cancelPending(){this._cancelPending()}_cancelPending(){var e,t,i,n;(e=this._selectionShield)===null||e===void 0||e.release(),this._selectionShield=void 0,this._pendingPointerId=void 0,this._armTimer!==void 0&&(clearTimeout(this._armTimer),this._armTimer=void 0),this._armed=!1,(t=this._pendingMoveListener)===null||t===void 0||t.dispose(),(i=this._pendingUpListener)===null||i===void 0||i.dispose(),(n=this._pendingCancelListener)===null||n===void 0||n.dispose(),this._pendingMoveListener=void 0,this._pendingUpListener=void 0,this._pendingCancelListener=void 0,this._startEvent=void 0}_beginDrag(e){var t,i,n,s,l;let c=(t=this._startEvent)!==null&&t!==void 0?t:e;this._cancelPending(),(i=(n=this.options).onDragStart)===null||i===void 0||i.call(n,c);let p=(s=(l=this.options).createGhost)===null||s===void 0?void 0:s.call(l,c);Ri.getInstance().beginDrag({pointerEvent:e,source:this.element,getData:()=>this.options.getData(c),ghost:p,onDragMove:this.options.onDragMove,onDragEnd:this.options.onDragEnd})}dispose(){this._cancelPending(),super.dispose()}},ec=class{constructor(e){var t,i,n,s;this._disposed=!1,this.element=e.element,this.offsetX=(t=e.offsetX)!==null&&t!==void 0?t:0,this.offsetY=(i=e.offsetY)!==null&&i!==void 0?i:0;let l=e.owner?yr(e.owner):document.body,c;te(l)&&typeof this.element.showPopover=="function"&&(c=this.element.ownerDocument.createElement("div"),c.popover="manual",Object.assign(c.style,{inset:"auto",margin:"0",padding:"0",border:"0",background:"transparent",color:"inherit",overflow:"visible"}),c.appendChild(this.element),this.element.style.pointerEvents="none",this.element.style.transform="none"),this.container=(n=c)!==null&&n!==void 0?n:this.element;let p=this.container.style;p.position="fixed",p.left="0px",p.top="0px",p.pointerEvents="none",p.zIndex="99999",p.opacity=String((s=e.opacity)!==null&&s!==void 0?s:.8),p.willChange="transform",p.transform=`translate3d(${e.initialX-this.offsetX}px, ${e.initialY-this.offsetY}px, 0)`,l.appendChild(this.container),c?.showPopover()}update(e,t){this._disposed||(this.container.style.transform=`translate3d(${e-this.offsetX}px, ${t-this.offsetY}px, 0)`)}dispose(){this._disposed||(this._disposed=!0,this.element.remove(),this.container!==this.element&&this.container.remove())}},tc=class extends D{constructor(e,t){super(),this.el=e,this.opts=t,this._dataDisposable=new C,this._pointerEventsDisposable=new C,this._disabled=!!t.disabled,this.addDisposables(this._dataDisposable,this._pointerEventsDisposable,O(this.el,"dragstart",i=>{var n,s,l,c,p,v,m;if(i.defaultPrevented||this._disabled||!((n=(s=this.opts).isCancelled)===null||n===void 0)&&n.call(s,i)){i.preventDefault();return}let f=pe((l=this.el.ownerDocument)!==null&&l!==void 0?l:document);this._pointerEventsDisposable.value={dispose:()=>f.release()},this.el.classList.add("dv-dragged"),setTimeout(()=>this.el.classList.remove("dv-dragged"),0),this._dataDisposable.value=this.opts.getData(i);let _=(c=(p=this.opts).createGhost)===null||c===void 0?void 0:c.call(p,i);if(_&&i.dataTransfer){var y,x,k;if(ql(i.dataTransfer,_.element,{x:(y=_.offsetX)!==null&&y!==void 0?y:0,y:(x=_.offsetY)!==null&&x!==void 0?x:0,ownerDocument:(k=this.el.ownerDocument)!==null&&k!==void 0?k:void 0,owner:this.el}),_.dispose){let S=_.dispose;setTimeout(()=>S(),0)}}i.dataTransfer&&(i.dataTransfer.effectAllowed="move",i.dataTransfer.items.length===0&&i.dataTransfer.setData("text/plain","")),(v=(m=this.opts).onDragStart)===null||v===void 0||v.call(m,i)}),O(this.el,"dragend",i=>{var n,s;this._pointerEventsDisposable.dispose(),setTimeout(()=>this._dataDisposable.dispose(),0),(n=(s=this.opts).onDragEnd)===null||n===void 0||n.call(s,i)}))}setDisabled(e){this._disabled=e}setTouchOnly(e){}cancelPending(){}},ic=class{constructor(){this.kind="html5"}createDropTarget(e,t){return new ao(e,t)}createDragSource(e,t){return new tc(e,t)}},nc=class{constructor(){this.kind="pointer"}createDropTarget(e,t){return new Jl(e,t)}createDragSource(e,t){let i=t.createGhost?s=>{let l=t.createGhost(s);if(!l)return;let c=new ec({element:l.element,initialX:s.clientX,initialY:s.clientY,offsetX:l.offsetX,offsetY:l.offsetY,owner:e});if(l.dispose){let p=c.dispose.bind(c),v=l.dispose;c.dispose=()=>{p(),v()}}return c}:void 0,n=new Ql(e,{getData:t.getData,isCancelled:t.isCancelled,onDragStart:t.onDragStart,onDragEnd:t.onDragEnd?s=>t.onDragEnd(s.pointerEvent):void 0,createGhost:i,touchOnly:t.touchOnly,touchInitiationDelay:t.touchInitiationDelay,pressTolerance:t.pressTolerance,threshold:t.threshold});return t.disabled&&n.setDisabled(!0),n}};let vt=new ic,tt=new nc,oc=Object.keys({disableAutoResizing:void 0,disableDnd:void 0,className:void 0});var Vr=class extends R{constructor(e,t,i,n){super(),this.nativeEvent=e,this.position=t,this.getData=i,this.panel=n}},Wr=class extends T{constructor(){super()}},Hr=class extends D{get isFocused(){return this._isFocused}get isActive(){return this._isActive}get isVisible(){return this._isVisible}get width(){return this._width}get height(){return this._height}constructor(e,t){super(),this.id=e,this.component=t,this._isFocused=!1,this._isActive=!1,this._isVisible=!0,this._width=0,this._height=0,this._parameters={},this.panelUpdatesDisposable=new C,this._onDidDimensionChange=new G,this.onDidDimensionsChange=this._onDidDimensionChange.event,this._onDidChangeFocus=new G,this.onDidFocusChange=this._onDidChangeFocus.event,this._onWillFocus=new G,this.onWillFocus=this._onWillFocus.event,this._onDidVisibilityChange=new G,this.onDidVisibilityChange=this._onDidVisibilityChange.event,this._onWillVisibilityChange=new G,this.onWillVisibilityChange=this._onWillVisibilityChange.event,this._onDidActiveChange=new G,this.onDidActiveChange=this._onDidActiveChange.event,this._onActiveChange=new G,this.onActiveChange=this._onActiveChange.event,this._onDidParametersChange=new G,this.onDidParametersChange=this._onDidParametersChange.event,this.addDisposables(this.onDidFocusChange(i=>{this._isFocused=i.isFocused}),this.onDidActiveChange(i=>{this._isActive=i.isActive}),this.onDidVisibilityChange(i=>{this._isVisible=i.isVisible}),this.onDidDimensionsChange(i=>{this._width=i.width,this._height=i.height}),this.panelUpdatesDisposable,this._onDidDimensionChange,this._onDidChangeFocus,this._onDidVisibilityChange,this._onDidActiveChange,this._onWillFocus,this._onActiveChange,this._onWillFocus,this._onWillVisibilityChange,this._onDidParametersChange)}getParameters(){return this._parameters}initialize(e){this.panelUpdatesDisposable.value=this._onDidParametersChange.event(t=>{this._parameters=t,e.update({params:t})})}setVisible(e){this._onWillVisibilityChange.fire({isVisible:e})}setActive(){this._onActiveChange.fire()}updateParameters(e){this._onDidParametersChange.fire(e)}},Br=class extends Hr{constructor(e,t){super(e,t),this._onDidConstraintsChangeInternal=new G,this.onDidConstraintsChangeInternal=this._onDidConstraintsChangeInternal.event,this._onDidConstraintsChange=new G({replay:!0}),this.onDidConstraintsChange=this._onDidConstraintsChange.event,this._onDidSizeChange=new G,this.onDidSizeChange=this._onDidSizeChange.event,this.addDisposables(this._onDidConstraintsChangeInternal,this._onDidConstraintsChange,this._onDidSizeChange)}setConstraints(e){this._onDidConstraintsChangeInternal.fire(e)}setSize(e){this._onDidSizeChange.fire(e)}},rc=class extends Br{set pane(e){this._pane=e}constructor(e,t){super(e,t),this._onDidExpansionChange=new G({replay:!0}),this.onDidExpansionChange=this._onDidExpansionChange.event,this._onMouseEnter=new G({}),this.onMouseEnter=this._onMouseEnter.event,this._onMouseLeave=new G({}),this.onMouseLeave=this._onMouseLeave.event,this.addDisposables(this._onDidExpansionChange,this._onMouseEnter,this._onMouseLeave)}setExpanded(e){var t;(t=this._pane)===null||t===void 0||t.setExpanded(e)}get isExpanded(){var e;return!!(!((e=this._pane)===null||e===void 0)&&e.isExpanded())}},lo=class extends D{get element(){return this._element}get width(){return this._width}get height(){return this._height}get params(){var e;return(e=this._params)===null||e===void 0?void 0:e.params}constructor(e,t,i){super(),this.id=e,this.component=t,this.api=i,this._height=0,this._width=0,this._element=document.createElement("div"),this._element.tabIndex=-1,this._element.style.outline="none",this._element.style.height="100%",this._element.style.width="100%",this._element.style.overflow="hidden";let n=ut(this._element);this.addDisposables(this.api,n.onDidFocus(()=>{this.api._onDidChangeFocus.fire({isFocused:!0})}),n.onDidBlur(()=>{this.api._onDidChangeFocus.fire({isFocused:!1})}),n)}focus(){let e=new Wr;this.api._onWillFocus.fire(e),!e.defaultPrevented&&this._element.focus()}layout(e,t){this._width=e,this._height=t,this.api._onDidDimensionChange.fire({width:e,height:t}),this.part&&this._params&&this.part.update(this._params.params)}init(e){this._params=e,this.part=this.getComponent()}update(e){var t,i;this._params=J(J({},this._params),{},{params:J(J({},(t=this._params)===null||t===void 0?void 0:t.params),e.params)});for(let n of Object.keys(e.params))e.params[n]===void 0&&delete this._params.params[n];(i=this.part)===null||i===void 0||i.update({params:this._params.params})}toJSON(){var e,t;let i=(e=(t=this._params)===null||t===void 0?void 0:t.params)!==null&&e!==void 0?e:{};return{id:this.id,component:this.component,params:Object.keys(i).length>0?i:void 0}}dispose(){var e;this.api.dispose(),(e=this.part)===null||e===void 0||e.dispose(),super.dispose()}},Fr=class extends lo{set orientation(e){this._orientation=e}get orientation(){return this._orientation}get minimumSize(){return this.headerSize+(this.isExpanded()?this._minimumBodySize:0)}get maximumSize(){return this.headerSize+(this.isExpanded()?this._maximumBodySize:0)}get size(){return this._size}get orthogonalSize(){return this._orthogonalSize}set orthogonalSize(e){this._orthogonalSize=e}get minimumBodySize(){return this._minimumBodySize}set minimumBodySize(e){this._minimumBodySize=typeof e=="number"?e:0}get maximumBodySize(){return this._maximumBodySize}set maximumBodySize(e){this._maximumBodySize=typeof e=="number"?e:Number.POSITIVE_INFINITY}get headerVisible(){return this._headerVisible}set headerVisible(e){this._headerVisible=e,this.header.style.display=e?"":"none"}constructor(e){super(e.id,e.component,new rc(e.id,e.component)),this._onDidChangeExpansionState=new G({replay:!0}),this.onDidChangeExpansionState=this._onDidChangeExpansionState.event,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._orthogonalSize=0,this._size=0,this._isExpanded=!1,this.api.pane=this,this.api.initialize(this),this.headerSize=e.headerSize,this.headerComponent=e.headerComponent,this._minimumBodySize=e.minimumBodySize,this._maximumBodySize=e.maximumBodySize,this._isExpanded=e.isExpanded,this._headerVisible=e.isHeaderVisible,this._onDidChangeExpansionState.fire(this.isExpanded()),this._orientation=e.orientation,this.element.classList.add("dv-pane"),this.addDisposables(this.api.onWillVisibilityChange(t=>{let{isVisible:i}=t,{accessor:n}=this._params;n.setVisible(this,i)}),this.api.onDidSizeChange(t=>{this._onDidChange.fire({size:t.size})}),O(this.element,"mouseenter",t=>{this.api._onMouseEnter.fire(t)}),O(this.element,"mouseleave",t=>{this.api._onMouseLeave.fire(t)})),this.addDisposables(this._onDidChangeExpansionState,this.onDidChangeExpansionState(t=>{this.api._onDidExpansionChange.fire({isExpanded:t})}),this.api.onDidFocusChange(t=>{this.header&&(t.isFocused?F(this.header,"focused"):L(this.header,"focused"))})),this.renderOnce()}setVisible(e){this.api._onDidVisibilityChange.fire({isVisible:e})}setActive(e){this.api._onDidActiveChange.fire({isActive:e})}isExpanded(){return this._isExpanded}setExpanded(e){var t;this._isExpanded!==e&&(this._isExpanded=e,e?(this.animationTimer&&clearTimeout(this.animationTimer),this.body&&this.element.appendChild(this.body)):(this._expandedSize=this._size,this.animationTimer=setTimeout(()=>{var i;(i=this.body)===null||i===void 0||i.remove()},200)),this._onDidChange.fire(e?{size:(t=this._expandedSize)!==null&&t!==void 0?t:this.width}:{}),this._onDidChangeExpansionState.fire(e))}layout(e,t){this._size=e,this._orthogonalSize=t;let[i,n]=this.orientation==="HORIZONTAL"?[e,t]:[t,e];super.layout(i,n)}init(e){var t,i;super.init(e),typeof e.minimumBodySize=="number"&&(this.minimumBodySize=e.minimumBodySize),typeof e.maximumBodySize=="number"&&(this.maximumBodySize=e.maximumBodySize),this.bodyPart=this.getBodyComponent(),this.headerPart=this.getHeaderComponent(),this.bodyPart.init(J(J({},e),{},{api:this.api})),this.headerPart.init(J(J({},e),{},{api:this.api})),(t=this.body)===null||t===void 0||t.append(this.bodyPart.element),(i=this.header)===null||i===void 0||i.append(this.headerPart.element),typeof e.isExpanded=="boolean"&&this.setExpanded(e.isExpanded)}toJSON(){let e=this._params;return J(J({},super.toJSON()),{},{headerComponent:this.headerComponent,title:e.title})}renderOnce(){this.header=document.createElement("div"),this.header.tabIndex=0,this.header.className="dv-pane-header",this.header.style.height=`${this.headerSize}px`,this.header.style.lineHeight=`${this.headerSize}px`,this.header.style.minHeight=`${this.headerSize}px`,this.header.style.maxHeight=`${this.headerSize}px`,this.element.appendChild(this.header),this.body=document.createElement("div"),this.body.className="dv-pane-body",this.element.appendChild(this.body)}getComponent(){return{update:e=>{var t,i;(t=this.bodyPart)===null||t===void 0||t.update({params:e}),(i=this.headerPart)===null||i===void 0||i.update({params:e})},dispose:()=>{var e,t;(e=this.bodyPart)===null||e===void 0||e.dispose(),(t=this.headerPart)===null||t===void 0||t.dispose()}}}},Ur=class extends Fr{constructor(e){super({id:e.id,component:e.component,headerComponent:e.headerComponent,orientation:e.orientation,isExpanded:e.isExpanded,isHeaderVisible:!0,headerSize:e.headerSize,minimumBodySize:e.minimumBodySize,maximumBodySize:e.maximumBodySize}),this._onDidDrop=new G,this.onDidDrop=this._onDidDrop.event,this._onUnhandledDragOver=new G,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this.accessor=e.accessor,this.addDisposables(this._onDidDrop,this._onUnhandledDragOver),e.disableDnd||this.initDragFeatures()}initDragFeatures(){if(!this.header)return;let e=this.id,t=this.accessor.id;this.header.draggable=!0;let i={getData:()=>(u.getInstance().setData([new h(t,e)],h.prototype),{dispose:()=>{u.getInstance().clearData(h.prototype)}})};this.html5DragSource=vt.createDragSource(this.header,i),this.pointerDragSource=tt.createDragSource(this.header,i);let s={acceptedTargetZones:["top","bottom"],overlayModel:{activationSize:{type:"percentage",value:50}},canDisplayOverlay:(l,c)=>{let p=b();if(p&&p.paneId!==this.id&&p.viewId===this.accessor.id)return!0;let v=new Vr(l,c,b,this);return this._onUnhandledDragOver.fire(v),v.isAccepted}};this.target=vt.createDropTarget(this.element,s),this.pointerTarget=tt.createDropTarget(this.element,s),this.addDisposables(this._onDidDrop,this.html5DragSource,this.pointerDragSource,this.target,this.pointerTarget,this.target.onDrop(l=>{this.onDrop(l)}),this.pointerTarget.onDrop(l=>{this.onDrop(l)}))}onDrop(e){let t=b();if(t?.viewId!==this.accessor.id){this._onDidDrop.fire(J(J({},e),{},{panel:this,api:new Ut(this.accessor),getData:b}));return}let i=this._params.containerApi,n=t.paneId,s=i.getPanel(n);if(!s){this._onDidDrop.fire(J(J({},e),{},{panel:this,getData:b,api:new Ut(this.accessor)}));return}let l=i.panels,c=l.indexOf(s),p=i.panels.indexOf(this);(e.position==="left"||e.position==="top")&&(p=Math.max(0,p-1)),(e.position==="right"||e.position==="bottom")&&(c>p&&p++,p=Math.min(l.length-1,p)),i.movePanel(c,p)}};let sc=0,ac=()=>`dv-tabpanel-${sc++}`;var Yr=class extends D{get element(){return this._element}get dimensions(){return this._dimensions}constructor(e,t){var i,n,s,l,c,p,v;super(),this.accessor=e,this.group=t,this.disposable=new C,this._onDidFocus=new G,this.onDidFocus=this._onDidFocus.event,this._onDidBlur=new G,this.onDidBlur=this._onDidBlur.event,this._onDidDimensionsChange=new G,this.onDidDimensionsChange=this._onDidDimensionsChange.event,this._element=document.createElement("div"),this._element.className="dv-content-container",this._element.tabIndex=-1,this._element.id=ac(),this._element.setAttribute("role","tabpanel"),this.addDisposables(this._onDidFocus,this._onDidBlur,this._onDidDimensionsChange);let m=()=>{var _;return(_=t.dropTargetContainer)===null||_===void 0?void 0:_.model},f=(_,y)=>this.group.canDisplayContentOverlay(_,y);this.dropTarget=new ao(this.element,{getOverlayOutline:()=>{var _;return((_=e.options.theme)===null||_===void 0?void 0:_.dndPanelOverlay)==="group"?this.element.parentElement:null},className:"dv-drop-target-content",acceptedTargetZones:["top","bottom","left","right","center"],canDisplayOverlay:f,getOverrideTarget:m,overlayModel:(i=(n=this.accessor).resolveDropOverlayModel)===null||i===void 0?void 0:i.call(n,"content"),getPositionResolver:()=>{var _;return(_=e.getDropPositionResolver)===null||_===void 0?void 0:_.call(e)}}),this.pointerDropTarget=tt.createDropTarget(this.element,{acceptedTargetZones:["top","bottom","left","right","center"],canDisplayOverlay:f,getOverlayOutline:()=>{var _;return((_=e.options.theme)===null||_===void 0?void 0:_.dndPanelOverlay)==="group"?this.element.parentElement:null},className:"dv-drop-target-content",getOverrideTarget:m,overlayModel:(s=(l=this.accessor).resolveDropOverlayModel)===null||s===void 0?void 0:s.call(l,"content"),getPositionResolver:()=>{var _;return(_=e.getDropPositionResolver)===null||_===void 0?void 0:_.call(e)}}),this.addDisposables(this.dropTarget,this.pointerDropTarget,(c=(p=(v=this.accessor).onDidOptionsChange)===null||p===void 0?void 0:p.call(v,()=>{var _,y,x;let k=(_=(y=(x=this.accessor).resolveDropOverlayModel)===null||y===void 0?void 0:y.call(x,"content"))!==null&&_!==void 0?_:{};this.dropTarget.setOverlayModel(k),this.pointerDropTarget.setOverlayModel(k)}))!==null&&c!==void 0?c:w.NONE)}show(){this.element.style.display=""}hide(){this.element.style.display="none"}setLabelledBy(e){e?this._element.setAttribute("aria-labelledby",e):this._element.removeAttribute("aria-labelledby")}renderPanel(e,t){var i;let n=((i=t?.asActive)!==null&&i!==void 0?i:!0)||this.group.isPanelActive(e);if(n||this.panel===e){var s;if(((s=this.panel)===null||s===void 0?void 0:s.view.content.element.parentElement)===this._element){var l,c;this.panel.view.content.element.remove(),(l=(c=this.panel.view.content).onHide)===null||l===void 0||l.call(c)}this.panel=e}let p;switch(e.api.renderer){case"onlyWhenVisible":if(this.group.renderContainer.detatch(e),n){var v,m;this._element.appendChild(e.view.content.element),(v=(m=e.view.content).onShow)===null||v===void 0||v.call(m)}p=this._element;break;case"always":e.view.content.element.parentElement===this._element&&e.view.content.element.remove(),p=this.group.renderContainer.attach({panel:e,referenceContainer:this});break;default:throw new Error(`dockview: invalid renderer type '${e.api.renderer}'`)}if(n){let f=ut(p);this.focusTracker=f;let _=new D;_.addDisposables(f,f.onDidFocus(()=>this._onDidFocus.fire()),f.onDidBlur(()=>this._onDidBlur.fire())),this.disposable.value=_}}openPanel(e){this.panel!==e&&this.renderPanel(e)}layout(e,t){var i;((i=this._dimensions)===null||i===void 0?void 0:i.width)===e&&this._dimensions.height===t||(this._dimensions={width:e,height:t},this._onDidDimensionsChange.fire(this._dimensions))}closePanel(){if(this.panel&&this.panel.api.renderer==="onlyWhenVisible"){var e,t;this.panel.view.content.element.remove(),(e=(t=this.panel.view.content).onHide)===null||e===void 0||e.call(t)}this.panel=void 0}dispose(){this.disposable.dispose(),super.dispose()}refreshFocusState(){var e;!((e=this.focusTracker)===null||e===void 0)&&e.refreshState&&this.focusTracker.refreshState()}};let $i=e=>{let t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttributeNS(null,"height",e.height),t.setAttributeNS(null,"width",e.width),t.setAttributeNS(null,"viewBox",e.viewbox),t.setAttributeNS(null,"aria-hidden","false"),t.setAttributeNS(null,"focusable","false"),t.classList.add("dv-svg");let i=document.createElementNS("http://www.w3.org/2000/svg","path");return i.setAttributeNS(null,"d",e.path),t.appendChild(i),t},qr=()=>$i({width:"11",height:"11",viewbox:"0 0 28 28",path:"M2.1 27.3L0 25.2L11.55 13.65L0 2.1L2.1 0L13.65 11.55L25.2 0L27.3 2.1L15.75 13.65L27.3 25.2L25.2 27.3L13.65 15.75L2.1 27.3Z"}),co=()=>$i({width:"11",height:"11",viewbox:"0 0 24 24",path:"M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"}),dc=()=>$i({width:"11",height:"11",viewbox:"0 0 24 15",path:"M12 14.15L0 2.15L2.15 0L12 9.9L21.85 0.0499992L24 2.2L12 14.15Z"}),jr=()=>$i({width:"11",height:"11",viewbox:"0 0 15 25",path:"M2.15 24.1L0 21.95L9.9 12.05L0 2.15L2.15 0L14.2 12.05L2.15 24.1Z"}),lc=500,cc=8;var ho=class extends D{constructor(e,t){super(),this.element=e,this.options=t,this._startX=0,this._startY=0,this.addDisposables(O(this.element,"pointerdown",i=>{this._onPointerDown(i)}))}_onPointerDown(e){var t,i,n,s,l;if((!((t=this.options.touchOnly)!==null&&t!==void 0)||t)&&e.pointerType!=="touch"&&e.pointerType!=="pen")return;this._cancelPending(),this._pointerId=e.pointerId,this._startX=e.clientX,this._startY=e.clientY;let c=(i=this.options.delay)!==null&&i!==void 0?i:lc,p=(n=this.options.tolerance)!==null&&n!==void 0?n:cc,v=(s=(l=this.element.ownerDocument)===null||l===void 0?void 0:l.defaultView)!==null&&s!==void 0?s:globalThis.window;this._timer=setTimeout(()=>{this._timer=void 0,this._cancelPending(),this._installContextMenuGuard(v),this._installClickGuard(v),this.options.onLongPress(e)},c),this._moveListener=O(v,"pointermove",m=>{if(m.pointerId!==this._pointerId)return;let f=m.clientX-this._startX,_=m.clientY-this._startY;Math.hypot(f,_)>p&&this._cancelPending()}),this._upListener=O(v,"pointerup",m=>{m.pointerId===this._pointerId&&this._cancelPending()}),this._cancelListener=O(v,"pointercancel",m=>{m.pointerId===this._pointerId&&this._cancelPending()})}_installContextMenuGuard(e){let t,i=setTimeout(()=>t?.dispose(),500);t=O(e,"contextmenu",n=>{n.preventDefault(),clearTimeout(i),t?.dispose()},{capture:!0})}_installClickGuard(e){let t,i=setTimeout(()=>t?.dispose(),500);t=O(e,"click",n=>{ai(n,[this.element])&&(n.preventDefault(),n.stopPropagation()),clearTimeout(i),t?.dispose()},{capture:!0})}_cancelPending(){var e,t,i;this._timer!==void 0&&(clearTimeout(this._timer),this._timer=void 0),this._pointerId=void 0,(e=this._moveListener)===null||e===void 0||e.dispose(),(t=this._upListener)===null||t===void 0||t.dispose(),(i=this._cancelListener)===null||i===void 0||i.dispose(),this._moveListener=void 0,this._upListener=void 0,this._cancelListener=void 0}dispose(){this._cancelPending(),super.dispose()}};function Ye(e){if(e.disableDnd)return{html5:!1,pointer:!1,pointerHandlesMouse:!1};switch(e.dndStrategy){case"pointer":return{html5:!1,pointer:!0,pointerHandlesMouse:!0};case"html5":return{html5:!0,pointer:!1,pointerHandlesMouse:!1};default:return hc()?{html5:!1,pointer:!0,pointerHandlesMouse:!0}:{html5:!0,pointer:!0,pointerHandlesMouse:!1}}}function hc(){if(globalThis.window===void 0||!globalThis.matchMedia)return!1;let e=globalThis.matchMedia("(pointer: coarse)").matches,t=globalThis.matchMedia("(pointer: fine)").matches;return e&&!t}let uc=0,pc=()=>`dv-tab-${uc++}`;var Jr=class extends D{get element(){return this._element}constructor(e,t,i){var n,s,l,c,p,v,m,f;super(),this.panel=e,this.accessor=t,this.group=i,this.content=void 0,this.panelTransfer=u.getInstance(),this._direction="horizontal",this._pinIndicator=void 0,this._onPointDown=new G,this.onPointerDown=this._onPointDown.event,this._onTabClick=new G,this.onTabClick=this._onTabClick.event,this._onDropped=new G,this.onDrop=this._onDropped.event,this._onDragStart=new G,this.onDragStart=this._onDragStart.event,this._onDragEnd=new G,this.onDragEnd=this._onDragEnd.event;let _=Ye(this.accessor.options);this._element=document.createElement("div"),this._element.className="dv-tab",this._element.tabIndex=-1,this._element.draggable=_.html5,this._element.id=pc(),this._element.setAttribute("role","tab"),this._element.setAttribute("aria-selected","false"),this._element.setAttribute("aria-label",(n=this.panel.title)!==null&&n!==void 0?n:this.panel.id),this._element.dataset.tabPanelId=this.panel.id;let y=(s=this.group)===null||s===void 0||(s=s.model)===null||s===void 0?void 0:s.contentContainerId;y&&this._element.setAttribute("aria-controls",y),E(this.element,"dv-inactive-tab",!0),this._updatePinnedClasses();let x=(S,z)=>{if(this.group.locked)return!1;let M=g();if(this.accessor.id===M?.viewId){var I;return!(((I=this.accessor.options.theme)===null||I===void 0?void 0:I.tabAnimation)==="smooth"||M.tabGroupId&&M.groupId===this.group.id&&this.group.model.getTabGroupForPanel(this.panel.id))}return this.group.model.canDisplayOverlay(S,z,"tab")};this.dropTarget=vt.createDropTarget(this._element,{acceptedTargetZones:["left","right"],overlayModel:this._buildOverlayModel(),canDisplayOverlay:x,getOverrideTarget:()=>{var S;return(S=i.model.dropTargetContainer)===null||S===void 0?void 0:S.model}}),this.pointerDropTarget=tt.createDropTarget(this._element,{acceptedTargetZones:["left","right"],overlayModel:this._buildOverlayModel(),canDisplayOverlay:x,getOverrideTarget:()=>{var S;return(S=i.model.dropTargetContainer)===null||S===void 0?void 0:S.model}});let k={getData:()=>(this.panelTransfer.setData([new d(this.accessor.id,this.group.id,this.panel.id)],d.prototype),{dispose:()=>{this.panelTransfer.clearData(d.prototype)}}),createGhost:()=>({element:this._buildGhostElement(),offsetX:30,offsetY:-10}),onDragStart:S=>{var z;this._onDragStart.fire(S),!(S instanceof PointerEvent)&&((z=this.accessor.options.theme)===null||z===void 0?void 0:z.tabAnimation)==="smooth"&&requestAnimationFrame(()=>{E(this.element,"dv-tab--dragging",!0)})},onDragEnd:S=>{this._onDragEnd.fire(S)}};this.html5DragSource=vt.createDragSource(this._element,J(J({},k),{},{disabled:!_.html5})),this.pointerDragSource=tt.createDragSource(this._element,J(J({},k),{},{disabled:!_.pointer,touchOnly:!_.pointerHandlesMouse,isCancelled:()=>!Ye(this.accessor.options).pointer})),this.onWillShowOverlay=P.any(this.dropTarget.onWillShowOverlay,this.pointerDropTarget.onWillShowOverlay),this.addDisposables(this._onPointDown,this._onTabClick,this._onDropped,this._onDragStart,this._onDragEnd,this.accessor.onDidOptionsChange(()=>{let S=this._buildOverlayModel();this.dropTarget.setOverlayModel(S),this.pointerDropTarget.setOverlayModel(S),this._updatePinnedClasses()}),(l=(c=this.panel.api)===null||c===void 0||(p=c.onDidChangePinned)===null||p===void 0?void 0:p.call(c,()=>{this._updatePinnedClasses()}))!==null&&l!==void 0?l:{dispose:()=>{}},(v=(m=this.panel.api)===null||m===void 0||(f=m.onDidTitleChange)===null||f===void 0?void 0:f.call(m,S=>{var z;this._element.setAttribute("aria-label",(z=S.title)!==null&&z!==void 0?z:this.panel.id)}))!==null&&v!==void 0?v:{dispose:()=>{}},O(this._element,"dragend",()=>{E(this.element,"dv-tab--dragging",!1)}),this.html5DragSource,O(this._element,"pointerdown",S=>{this._onPointDown.fire(S)}),O(this._element,"click",S=>{this._onTabClick.fire(S)}),O(this._element,"contextmenu",S=>{var z;(z=this.accessor.contextMenuService)===null||z===void 0||z.show(this.panel,this.group,S)}),new ho(this._element,{onLongPress:S=>{var z;this.pointerDragSource.cancelPending(),(z=this.accessor.contextMenuService)===null||z===void 0||z.show(this.panel,this.group,S)}}),this.dropTarget.onDrop(S=>{this._onDropped.fire(S)}),this.pointerDropTarget.onDrop(S=>{this._onDropped.fire(S)}),this.dropTarget,this.pointerDropTarget,this.pointerDragSource)}_updatePinnedClasses(){var e,t,i,n;let s=(e=(t=this.panel.api)===null||t===void 0?void 0:t.isPinned)!==null&&e!==void 0?e:!1,l=s&&((i=this.accessor.options.pinnedTabs)===null||i===void 0?void 0:i.compact)===!0;E(this.element,"dv-tab--pinned",s),E(this.element,"dv-tab--pinned-compact",l);let c=s&&!(!((n=this.panel.api)===null||n===void 0)&&n.tabComponent);if(c&&!this._pinIndicator){let p=document.createElement("div");p.className="dv-tab-pin",p.appendChild(co()),this._element.insertBefore(p,this._element.firstChild),this._pinIndicator=p}else!c&&this._pinIndicator&&(this._pinIndicator.remove(),this._pinIndicator=void 0)}setActive(e){E(this.element,"dv-active-tab",e),E(this.element,"dv-inactive-tab",!e),this._element.setAttribute("aria-selected",e?"true":"false"),this._element.tabIndex=e?0:-1}setContent(e){this.content&&this.content.element.remove(),this.content=e,this._element.appendChild(this.content.element)}_buildOverlayModel(){var e,t,i;let n=(e=(t=this.accessor).resolveDropOverlayModel)===null||e===void 0?void 0:e.call(t,"tab",this.group);if(n)return n;let s=((i=this.accessor.options.theme)===null||i===void 0?void 0:i.dndTabIndicator)==="line"?Number.POSITIVE_INFINITY:0;return{activationSize:{value:50,type:"percentage"},smallWidthBoundary:s,smallHeightBoundary:s}}setDirection(e){this._direction=e;let t=e==="vertical"?["top","bottom"]:["left","right"];this.dropTarget.setTargetZones(t),this.pointerDropTarget.setTargetZones(t)}updateDragAndDropState(){let e=Ye(this.accessor.options);this._element.draggable=e.html5,this.html5DragSource.setDisabled(!e.html5),this.pointerDragSource.setDisabled(!e.pointer),this.pointerDragSource.setTouchOnly(!e.pointerHandlesMouse)}_buildGhostElement(){let e=getComputedStyle(this.element),t=this.element.cloneNode(!0),i=this._direction==="vertical",n=new Set(["writing-mode","inline-size","block-size","min-inline-size","min-block-size","max-inline-size","max-block-size","margin-inline","margin-inline-start","margin-inline-end","margin-block","margin-block-start","margin-block-end","padding-inline","padding-inline-start","padding-inline-end","padding-block","padding-block-start","padding-block-end"]);return Array.from(e).forEach(s=>{i&&n.has(s)||t.style.setProperty(s,e.getPropertyValue(s),e.getPropertyPriority(s))}),i&&(t.style.setProperty("writing-mode","horizontal-tb"),t.style.setProperty("width",e.height),t.style.setProperty("height",e.width)),t.style.position="absolute",t.classList.add("dv-tab-ghost-drag"),t}},Yt=class{get kind(){return this.options.kind}get nativeEvent(){return this.event.nativeEvent}get position(){return this.event.position}get edge(){return this.event.edge}get edgeGroup(){return this.event.edgeGroup}get defaultPrevented(){return this.event.defaultPrevented}get panel(){return this.options.panel}get api(){return this.options.api}get group(){return this.options.group}preventDefault(){this.event.preventDefault()}getData(){return this.options.getData()}constructor(e,t){this.event=e,this.options=t}};let Cv=500;var Kr=class extends D{get group(){return this.groupAccessor()}constructor(e){var t,i;super(),this.panelTransfer=u.getInstance(),this._onDragStart=new G,this.onDragStart=this._onDragStart.event,this._element=e.element,this.accessor=e.accessor;let n=e.group;this.groupAccessor=typeof n=="function"?n:()=>n,this.isFloatingMoveHandle=(t=e.isFloatingMoveHandle)!==null&&t!==void 0?t:(()=>!0);let s=Ye(this.accessor.options);this._element.draggable=s.html5,E(this._element,"dv-draggable",s.html5||s.pointer),this.addDisposables(this._onDragStart);let l=()=>{let y=document.createElement("div"),x=globalThis.getComputedStyle(this._element),k=x.getPropertyValue("--dv-activegroup-visiblepanel-tab-background-color"),S=x.getPropertyValue("--dv-activegroup-visiblepanel-tab-color");return y.style.backgroundColor=k,y.style.color=S,y.style.padding="2px 8px",y.style.height="24px",y.style.fontSize="11px",y.style.lineHeight="20px",y.style.borderRadius="12px",y.style.whiteSpace="nowrap",y.style.boxSizing="border-box",y.style.display="inline-block",y.textContent=`Multiple Panels (${this.group.size})`,y},p={getData:()=>(this.panelTransfer.setData([new d(this.accessor.id,this.group.id,null)],d.prototype),{dispose:()=>{this.panelTransfer.clearData(d.prototype)}}),createGhost:()=>{var y,x;let k=(y=(x=this.accessor).buildGroupDragGhost)===null||y===void 0?void 0:y.call(x,this.group);return k||{element:l(),offsetX:30,offsetY:-10}},onDragStart:y=>{this._onDragStart.fire(y)}};this.html5DragSource=vt.createDragSource(this._element,J(J({},p),{},{disabled:!s.html5,isCancelled:y=>!!(this.group.api.location.type==="floating"&&this.isFloatingMoveHandle()&&!y.shiftKey||this.group.api.location.type==="edge"&&this.group.size===0)}));let v=()=>{var y;return((y=this.group)===null||y===void 0||(y=y.api)===null||y===void 0||(y=y.location)===null||y===void 0?void 0:y.type)==="floating"&&this.isFloatingMoveHandle()};this.pointerDragSource=tt.createDragSource(this._element,J(J({},p),{},{disabled:!s.pointer,touchOnly:!s.pointerHandlesMouse,touchInitiationDelay:()=>v()?500:250,pressTolerance:()=>v()?1/0:8,isCancelled:()=>!Ye(this.accessor.options).pointer||this.group.api.location.type==="edge"&&this.group.size===0,onDragStart:y=>{var x;(x=this.getFloatingOverlay())===null||x===void 0||x.cancelPendingDrag(),this._onDragStart.fire(y)}}));let m=new C,f=()=>{let y=this.getFloatingOverlay();m.value=y?y.onDidStartMoving(()=>{this.pointerDragSource.cancelPending()}):w.NONE};f(),this.addDisposables(m);let _=(i=this.group)===null||i===void 0||(i=i.api)===null||i===void 0?void 0:i.onDidLocationChange;_&&this.addDisposables(_(f)),this.addDisposables(this.html5DragSource,this.pointerDragSource)}updateDragAndDropState(){let e=Ye(this.accessor.options);this._element.draggable=e.html5,E(this._element,"dv-draggable",e.html5||e.pointer),this.html5DragSource.setDisabled(!e.html5),this.pointerDragSource.setDisabled(!e.pointer),this.pointerDragSource.setTouchOnly(!e.pointerHandlesMouse)}getFloatingOverlay(){var e;if(this.group)return(e=this.accessor.floatingGroups)===null||e===void 0||(e=e.find(t=>t.group===this.group))===null||e===void 0?void 0:e.overlay}},vc=class extends D{get element(){return this._element}constructor(e,t){var i,n,s,l,c,p,v;super(),this.accessor=e,this.group=t,this._onDrop=new G,this.onDrop=this._onDrop.event,this._onDragStart=new G,this.onDragStart=this._onDragStart.event,this._element=document.createElement("div"),this._element.className="dv-void-container",this.addDisposables(this._onDrop,this._onDragStart,O(this._element,"pointerdown",()=>{this.accessor.doSetGroupActive(this.group)}),O(this._element,"pointerdown",f=>{f.shiftKey&&Re(f)},!0)),this.dragSource=new Kr({element:this._element,accessor:this.accessor,group:this.group,isFloatingMoveHandle:()=>!this._element.closest(".dv-resize-container-with-titlebar")});let m=(f,_)=>{if(this.group.api.locked)return!1;let y=g();return this.accessor.id===y?.viewId?!0:t.model.canDisplayOverlay(f,_,"header_space")};this.dropTarget=vt.createDropTarget(this._element,{acceptedTargetZones:["center"],canDisplayOverlay:m,getOverrideTarget:()=>{var f;return(f=t.model.dropTargetContainer)===null||f===void 0?void 0:f.model},overlayModel:(i=(n=this.accessor).resolveDropOverlayModel)===null||i===void 0?void 0:i.call(n,"header_space",this.group)}),this.pointerDropTarget=tt.createDropTarget(this._element,{acceptedTargetZones:["center"],canDisplayOverlay:m,getOverrideTarget:()=>{var f;return(f=t.model.dropTargetContainer)===null||f===void 0?void 0:f.model},overlayModel:(s=(l=this.accessor).resolveDropOverlayModel)===null||s===void 0?void 0:s.call(l,"header_space",this.group)}),this.onWillShowOverlay=P.any(this.dropTarget.onWillShowOverlay,this.pointerDropTarget.onWillShowOverlay),this.addDisposables(this.dragSource,this.dragSource.onDragStart(f=>{this._onDragStart.fire(f)}),this.dropTarget.onDrop(f=>{this._onDrop.fire(f)}),this.pointerDropTarget.onDrop(f=>{this._onDrop.fire(f)}),this.dropTarget,this.pointerDropTarget,(c=(p=(v=this.accessor).onDidOptionsChange)===null||p===void 0?void 0:p.call(v,()=>{var f,_,y;let x=(f=(_=(y=this.accessor).resolveDropOverlayModel)===null||_===void 0?void 0:_.call(y,"header_space",this.group))!==null&&f!==void 0?f:{};this.dropTarget.setOverlayModel(x),this.pointerDropTarget.setOverlayModel(x)}))!==null&&c!==void 0?c:w.NONE)}updateDragAndDropState(){this.dragSource.updateDragAndDropState()}},Xr=class bl extends D{get element(){return this._element}get orientation(){return this._orientation}set orientation(t){this._orientation!==t&&(this._scrollOffset=0,this._orientation=t,L(this._scrollbar,"dv-scrollbar-vertical","dv-scrollbar-horizontal"),t==="vertical"?F(this._scrollbar,"dv-scrollbar-vertical"):F(this._scrollbar,"dv-scrollbar-horizontal"))}constructor(t){super(),this.scrollableElement=t,this._scrollOffset=0,this._orientation="horizontal",this._element=document.createElement("div"),this._element.className="dv-scrollable",this._scrollbar=document.createElement("div"),this._scrollbar.className="dv-scrollbar dv-scrollbar-horizontal",this.element.appendChild(t),this.element.appendChild(this._scrollbar),this.addDisposables(O(this.element,"wheel",i=>{this._scrollOffset+=i.deltaY*bl.MouseWheelSpeed,this.scheduleStyleUpdate()}),O(this._scrollbar,"pointerdown",i=>{var n;i.preventDefault();let s=(n=this._scrollbar.ownerDocument)!==null&&n!==void 0?n:document;E(this.element,"dv-scrollable-scrolling",!0);let l=this._orientation==="horizontal"?i.clientX:i.clientY,c=this._scrollOffset,p=m=>{let f=this._orientation==="horizontal"?m.clientX-l:m.clientY-l,_=(this._orientation==="horizontal"?this.element.clientWidth:this.element.clientHeight)/(this._orientation==="horizontal"?this.scrollableElement.scrollWidth:this.scrollableElement.scrollHeight);this._scrollOffset=c+f/_,this.scheduleStyleUpdate()},v=()=>{E(this.element,"dv-scrollable-scrolling",!1),s.removeEventListener("pointermove",p),s.removeEventListener("pointerup",v),s.removeEventListener("pointercancel",v)};s.addEventListener("pointermove",p),s.addEventListener("pointerup",v),s.addEventListener("pointercancel",v)}),O(this.element,"scroll",()=>{this.scheduleStyleUpdate()}),O(this.scrollableElement,"scroll",()=>{this._scrollOffset=this._orientation==="horizontal"?this.scrollableElement.scrollLeft:this.scrollableElement.scrollTop,this.scheduleStyleUpdate()}),B(this.element,()=>{E(this.element,"dv-scrollable-resizing",!0),this._animationTimer&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(()=>{clearTimeout(this._animationTimer),E(this.element,"dv-scrollable-resizing",!1)},500),this.scheduleStyleUpdate()}),w.from(()=>{this._pendingStyleFrame!==void 0&&(cancelAnimationFrame(this._pendingStyleFrame),this._pendingStyleFrame=void 0)}))}scheduleStyleUpdate(){this._pendingStyleFrame===void 0&&(this._pendingStyleFrame=requestAnimationFrame(()=>{this._pendingStyleFrame=void 0,this.calculateScrollbarStyles()}))}calculateScrollbarStyles(){let t=this._orientation==="horizontal"?this.element.clientWidth:this.element.clientHeight,i=this._orientation==="horizontal"?this.scrollableElement.scrollWidth:this.scrollableElement.scrollHeight;if(i>t){let n=t*(t/i);this._orientation==="horizontal"?(this._scrollbar.style.width=`${n}px`,this._scrollbar.style.height=""):(this._scrollbar.style.height=`${n}px`,this._scrollbar.style.width=""),this._scrollOffset=ye(this._scrollOffset,0,i-t),this._orientation==="horizontal"?this.scrollableElement.scrollLeft=this._scrollOffset:this.scrollableElement.scrollTop=this._scrollOffset;let s=this._scrollOffset/(i-t);this._orientation==="horizontal"?(this._scrollbar.style.left=`${(t-n)*s}px`,this._scrollbar.style.top=""):(this._scrollbar.style.top=`${(t-n)*s}px`,this._scrollbar.style.left="")}else this._orientation==="horizontal"?(this._scrollbar.style.width="0px",this._scrollbar.style.left="0px"):(this._scrollbar.style.height="0px",this._scrollbar.style.top="0px"),this._scrollOffset=0}};Xr.MouseWheelSpeed=1;let uo="dv-tabs-container--wrap",gc="dv-tabs-container--wrap-capped",mc="--dv-max-tab-rows",fc="--dv-wrap-vertical-tab-height";function Zr(e,t){return typeof e=="boolean"?e:!!e?.[t]}function Ni(e){return typeof e=="boolean"?e:e?Object.values(e).some(Boolean):!1}var po=class extends R{constructor(e,t,i,n,s){super(),this.nativeEvent=e,this.target=t,this.position=i,this.getData=n,this.group=s}};let bc=Object.keys({disableAutoResizing:void 0,proportionalLayout:void 0,hideBorders:void 0,singleTabMode:void 0,disableFloatingGroups:void 0,floatingGroupBounds:void 0,transformFloatingGroupDrag:void 0,smartGuides:void 0,floatingGroupDragHandle:void 0,popoutUrl:void 0,nonce:void 0,defaultRenderer:void 0,defaultHeaderPosition:void 0,debug:void 0,locked:void 0,disableDnd:void 0,dndStrategy:void 0,className:void 0,noPanelsOverlay:void 0,closeEmptyGroups:void 0,dndEdges:void 0,dropPositionResolver:void 0,dndCompass:void 0,theme:void 0,disableTabsOverflowList:void 0,overflow:void 0,scrollbars:void 0,getTabContextMenuItems:void 0,getTabGroupChipContextMenuItems:void 0,createTabGroupChipComponent:void 0,createGroupDragGhostComponent:void 0,dropOverlayModel:void 0,announcements:void 0,getAnnouncement:void 0,announcer:void 0,messages:void 0,keyboardNavigation:void 0,layoutHistory:void 0,autoHideEdgeGroups:void 0,dockToEdgeGroups:void 0,edgeGroupPeek:void 0,tabGroupColors:void 0,tabGroupAccent:void 0,pinnedTabs:void 0});function Qr(e){return!!e.referencePanel}function es(e){return!!e.referenceGroup}function ts(e){return!!e.referencePanel}function is(e){return!!e.referenceGroup}let Vi=[{id:"grey",value:"var(--dv-tab-group-color-grey)",label:"Grey"},{id:"blue",value:"var(--dv-tab-group-color-blue)",label:"Blue"},{id:"red",value:"var(--dv-tab-group-color-red)",label:"Red"},{id:"yellow",value:"var(--dv-tab-group-color-yellow)",label:"Yellow"},{id:"green",value:"var(--dv-tab-group-color-green)",label:"Green"},{id:"pink",value:"var(--dv-tab-group-color-pink)",label:"Pink"},{id:"purple",value:"var(--dv-tab-group-color-purple)",label:"Purple"},{id:"cyan",value:"var(--dv-tab-group-color-cyan)",label:"Cyan"},{id:"orange",value:"var(--dv-tab-group-color-orange)",label:"Orange"}];var vo=class{constructor(e,t=!0){this._entries=e.slice(),this._byId=new Map(e.map(i=>[i.id,i])),this._enabled=t}get enabled(){return this._enabled}set enabled(e){this._enabled=e}setEntries(e){this._entries=e.slice(),this._byId=new Map(e.map(t=>[t.id,t]))}entries(){return this._entries}has(e){return this._byId.has(e)}get(e){return this._byId.get(e)}defaultId(){var e;return(e=this._entries[0])===null||e===void 0?void 0:e.id}resolveValue(e){if(!this._enabled||!e)return;let t=this._byId.get(e);return t?t.value:e}};let go;function ns(){var e;return(e=go)!==null&&e!==void 0||(go=new vo(Vi,!0)),go}function Wi(e,t,i){let n=(i??ns()).resolveValue(t);n===void 0?e.style.removeProperty("--dv-tab-group-color"):e.style.setProperty("--dv-tab-group-color",n)}function Hi(e,t){return(t??ns()).resolveValue(e)}var os=class extends D{get element(){return this._element}constructor(e){super(),this._palette=e,this._onClick=new G,this.onClick=this._onClick.event,this._onContextMenu=new G,this.onContextMenu=this._onContextMenu.event,this._element=document.createElement("div"),this._element.className="dv-tab-group-chip",this._element.tabIndex=0,this._label=document.createElement("span"),this._label.className="dv-tab-group-chip-label",this._element.appendChild(this._label),this.addDisposables(this._onClick,this._onContextMenu,new ho(this._element,{onLongPress:t=>{this._onContextMenu.fire(t)}}),O(this._element,"click",t=>{this._onClick.fire(t)}),O(this._element,"contextmenu",t=>{this._onContextMenu.fire(t)}))}init(e){this._tabGroup=e.tabGroup,this.updateColor(e.tabGroup.color),this.updateLabel(e.tabGroup.label),this.updateCollapsed(e.tabGroup.collapsed),this.addDisposables(e.tabGroup.onDidChange(()=>{this._tabGroup&&(this.updateColor(this._tabGroup.color),this.updateLabel(this._tabGroup.label))}),e.tabGroup.onDidCollapseChange(t=>{this.updateCollapsed(t)}),this._onClick.event(()=>{var t;(t=this._tabGroup)===null||t===void 0||t.toggle()}))}update(e){this._tabGroup=e.tabGroup,this.updateColor(e.tabGroup.color),this.updateLabel(e.tabGroup.label),this.updateCollapsed(e.tabGroup.collapsed)}updateColor(e){var t;Wi(this._element,e,this._palette),E(this._element,"dv-tab-group-chip--accent-off",((t=this._palette)===null||t===void 0?void 0:t.enabled)===!1)}updateLabel(e){this._label.textContent=e,E(this._label,"dv-tab-group-chip-label--empty",!e)}updateCollapsed(e){E(this._element,"dv-tab-group-chip--collapsed",e)}};let wc="dv-tab-group-chip-continuation",rs=8;var ss=class{get underlines(){return this._underlines}constructor(e){this._ctx=e,this._underlines=new Map,this._continuationMarkers=new Map,this._rafId=null}positionUnderlines(){requestAnimationFrame(()=>{this._positionUnderlinesSync()})}trackUnderlines(){this._rafId!==null&&cancelAnimationFrame(this._rafId);let e=performance.now(),t=250,i=()=>{this._positionUnderlinesSync(),performance.now()-e<t?this._rafId=requestAnimationFrame(i):this._rafId=null};this._rafId=requestAnimationFrame(i)}syncUnderlineElements(e){for(let t of e)if(!this._underlines.has(t)){let i=document.createElement("div");i.className="dv-tab-group-underline",this._ctx.tabsList.appendChild(i),this._underlines.set(t,i)}for(let[t,i]of this._underlines)e.has(t)||(i.remove(),this._underlines.delete(t),this._clearContinuationMarkers(t))}getUnderline(e){return this._underlines.get(e)}dispose(){this._rafId!==null&&(cancelAnimationFrame(this._rafId),this._rafId=null);for(let[,e]of this._underlines)e.remove();this._underlines.clear(),this._clearContinuationMarkers()}_syncContinuationMarkers(e,t){let i=this._continuationMarkers.get(e);for(i||(i=[],this._continuationMarkers.set(e,i));i.length<t;){let n=document.createElement("div");n.className=wc,this._ctx.tabsList.appendChild(n),i.push(n)}for(;i.length>t;){let n=i.pop();n?.remove()}return i}_clearContinuationMarkers(e){if(e===void 0){for(let[,i]of this._continuationMarkers)for(let n of i)n.remove();this._continuationMarkers.clear();return}let t=this._continuationMarkers.get(e);if(t){for(let i of t)i.remove();this._continuationMarkers.delete(e)}}_positionUnderlinesSync(){let e=this._ctx.tabsList.getBoundingClientRect(),t=this._ctx.getTabGroups(),i=this._ctx.getDirection()==="vertical",n=this._ctx.tabsList.classList.contains(uo);n||this._clearContinuationMarkers();let s=i?e.width:e.height,l=this._ctx.getActivePanelId(),c=this._ctx.getTabMap();for(let p of t){let v=this._underlines.get(p.id);if(!v)continue;let m=p.panelIds;if(m.length===0){v.style.display="none";continue}if(v.style.display="",n){this._positionWrappedUnderline(v,p,e,c,i);continue}let f=this._ctx.getChipElement(p.id),_;if(f){let M=f.getBoundingClientRect(),I=getComputedStyle(f),A=i?Number.parseFloat(I.marginTop)||0:Number.parseFloat(I.marginLeft)||0;_=i?M.top-e.top-A:M.left-e.left-A}else{let M=m[0],I=c.get(M);if(I){let A=I.value.element.getBoundingClientRect();_=i?A.top-e.top:A.left-e.left}else _=0}let y=m[m.length-1],x=c.get(y);if(!x){i?(v.style.top=`${_}px`,v.style.height="0px",v.style.left="",v.style.width=""):(v.style.left=`${_}px`,v.style.width="0px",v.style.top="",v.style.height="");continue}let k=x.value.element.getBoundingClientRect(),S=i?k.bottom-e.top:k.right-e.left,z=S-_;if((p.collapsed||p.panelIds.some(M=>{let I=c.get(M);return I?.value.element.classList.contains("dv-tab--group-expanding")}))&&f){let M=f.getBoundingClientRect(),I=i?M.top+M.height/2-e.top:M.left+M.width/2-e.left,A=0,N=0;for(let Z of p.panelIds){let W=c.get(Z);if(!W)continue;let U=W.value.element;i?(A+=U.getBoundingClientRect().height,N+=U.scrollHeight):(A+=U.getBoundingClientRect().width,N+=U.scrollWidth)}let X=N>0?Math.min(1,A/N):0;_=I+(_-I)*X,S=I+(S-I)*X,z=Math.max(0,S-_)}i?(v.style.top=`${_}px`,v.style.height=`${Math.max(0,z)}px`,v.style.left="",v.style.width="",v.style.bottom=""):(v.style.left=`${_}px`,v.style.width=`${Math.max(0,z)}px`,v.style.top="",v.style.height="",v.style.bottom=""),this.applyShape(v,p,_,z,s,l,e,i)}}_positionWrappedUnderline(e,t,i,n,s){let c=Hi(t.color,this._ctx.getColorPalette());if(c===void 0){e.style.display="none",this._clearContinuationMarkers(t.id);return}let{runs:p,firstRun:v}=this._computeWrappedRuns(t,i,n,s);if(p.length===0){e.style.display="none",this._clearContinuationMarkers(t.id);return}this._positionContinuationMarkers(t.id,p,v,c,s);let m=Math.min(...p.map(A=>A.left)),f=Math.max(...p.map(A=>A.right)),_=Math.min(...p.map(A=>A.top)),y=Math.max(...p.map(A=>A.bottom)),x=s?Math.max(0,f-m):i.width,k=s?i.height:Math.max(0,y-_);e.style.left=s?`${m}px`:"0px",e.style.top=s?"0px":`${_}px`,e.style.bottom="auto",e.style.width=`${x}px`,e.style.height=`${k}px`,e.style.backgroundColor="";let{svg:S,path:z}=this.ensureSvgPath(e);S.setAttribute("width",String(x)),S.setAttribute("height",String(k)),z.setAttribute("stroke",c),z.setAttribute("stroke-width",String(2));let M=this._ctx.getHeaderPosition(),I=s?M==="right":M==="bottom";z.setAttribute("d",this._wrappedPathData(p,s,I,m,_,2))}_computeWrappedRuns(e,t,i,n){let s=[],l;for(let p of e.panelIds){var c;let v=i.get(p);if(!v)continue;let m=v.value.element.getBoundingClientRect();if(m.width===0&&m.height===0)continue;let f=m.top-t.top,_=m.bottom-t.top,y=m.left-t.left,x=m.right-t.left,k=n?y:f,S=s.find(z=>Math.abs((n?z.left:z.top)-k)<=2);S?(S.top=Math.min(S.top,f),S.bottom=Math.max(S.bottom,_),S.left=Math.min(S.left,y),S.right=Math.max(S.right,x)):(S={top:f,bottom:_,left:y,right:x},s.push(S)),(c=l)!==null&&c!==void 0||(l=S)}return{runs:s,firstRun:l}}_wrappedPathData(e,t,i,n,s,l){let c="";for(let p of e)if(t){let v=i?p.right-n-l/2:p.left-n+l/2;c+=`M ${v},${p.top} L ${v},${p.bottom} `}else{let v=i?p.top-s+l/2:p.bottom-s-l/2;c+=`M ${p.left},${v} L ${p.right},${v} `}return c.trim()}_positionContinuationMarkers(e,t,i,n,s){let l=t.filter(p=>p!==i),c=this._syncContinuationMarkers(e,l.length);l.forEach((p,v)=>{let m=c[v];if(m.style.backgroundColor=n,s){let f=(p.left+p.right)/2;m.style.left=`${f-rs/2}px`,m.style.top=`${p.top}px`}else{let f=(p.top+p.bottom)/2;m.style.left=`${p.left}px`,m.style.top=`${f-rs/2}px`}})}ensureSvgPath(e){let t=e.firstElementChild;if(t?.tagName==="svg")return{svg:t,path:t.firstElementChild};e.replaceChildren();let i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.style.display="block";let n=document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttribute("fill","none"),i.appendChild(n),e.appendChild(i),{svg:i,path:n}}},_c=class extends ss{_applyStraightLine(e,t,i,n,s,l,c){let p=c?s:n,v=c?n:s;e.setAttribute("width",String(p)),e.setAttribute("height",String(v)),i.style.width=`${p}px`,i.style.height=`${v}px`,t.setAttribute("d",c?`M ${l},0 L ${l},${n}`:`M 0,${l} L ${n},${l}`)}applyShape(e,t,i,n,s,l,c,p){let m=s,f=n,_=Hi(t.color,this._ctx.getColorPalette());if(f<=0||m<=0||_===void 0){e.style.display="none";return}e.style.display="";let y;l&&t.panelIds.includes(l)&&(y=this._ctx.getTabMap().get(l));let{svg:x,path:k}=this.ensureSvgPath(e);k.setAttribute("stroke",_),k.setAttribute("stroke-width",String(2));let S=2,z=this._ctx.getHeaderPosition(),M=!p&&z==="bottom",I=p&&z==="right",A,N;if(p?(A=I?m-S:S,N=I?S:m-S):(A=M?S:m-S,N=M?m-S:S),!y){this._applyStraightLine(x,k,e,f,m,A,p);return}let X=y.value.element.getBoundingClientRect(),Z,W;if(p?(Z=Math.max(0,X.top-c.top-i),W=Math.min(f,X.bottom-c.top-i)):(Z=Math.max(0,X.left-c.left-i),W=Math.min(f,X.right-c.left-i)),W<=Z){this._applyStraightLine(x,k,e,f,m,A,p);return}let U=6,oe=N>A?1:-1;if(p){let K=m,ee=f;x.setAttribute("width",String(K)),x.setAttribute("height",String(ee)),e.style.width=`${K}px`,e.style.height=`${ee}px`;let fe=[`M ${A},0`,`L ${A},${Z-U}`,`Q ${A},${Z} ${A+oe*U},${Z}`,`L ${N-oe*U},${Z}`,`Q ${N},${Z} ${N},${Z+U}`,`L ${N},${W-U}`,`Q ${N},${W} ${N-oe*U},${W}`,`L ${A+oe*U},${W}`,`Q ${A},${W} ${A},${W+U}`,`L ${A},${ee}`].join(" ");k.setAttribute("d",fe)}else{let K=f,ee=m;x.setAttribute("width",String(K)),x.setAttribute("height",String(ee)),e.style.width=`${K}px`,e.style.height=`${ee}px`;let fe=[`M 0,${A}`,`L ${Z-U},${A}`,`Q ${Z},${A} ${Z},${A+oe*U}`,`L ${Z},${N-oe*U}`,`Q ${Z},${N} ${Z+U},${N}`,`L ${W-U},${N}`,`Q ${W},${N} ${W},${N-oe*U}`,`L ${W},${A+oe*U}`,`Q ${W},${A} ${W+U},${A}`,`L ${K},${A}`].join(" ");k.setAttribute("d",fe)}}},yc=class extends ss{applyShape(e,t,i,n,s,l,c,p){let m=Hi(t.color,this._ctx.getColorPalette());if(n<=0||m===void 0){e.style.display="none";return}e.style.display="",e.firstElementChild&&e.replaceChildren(),e.style.backgroundColor=m,p?(e.style.width="2px",e.style.height=`${n}px`):(e.style.width=`${n}px`,e.style.height="2px")}};let xc=new Map;var Dc=class{get chipRenderers(){return this._chipRenderers}get groupUnderlines(){var e,t;return(e=(t=this._indicator)===null||t===void 0?void 0:t.underlines)!==null&&e!==void 0?e:xc}get skipNextCollapseAnimation(){return this._skipNextCollapseAnimation}set skipNextCollapseAnimation(e){this._skipNextCollapseAnimation=e}constructor(e,t){this._ctx=e,this._callbacks=t,this._chipRenderers=new Map,this._indicator=null,this._skipNextCollapseAnimation=!1,this._pendingTransitionCleanups=new Map}update(){let e=this._ctx.group.model.getTabGroups(),t=new Set;for(let n of e)t.add(n.id),this._ensureChipForGroup(n),this._positionChipForGroup(n);for(let[n,s]of this._chipRenderers)if(!t.has(n)){var i;s.chip.element.remove(),s.chip.dispose(),(i=s.dragSourcesDisposable)===null||i===void 0||i.dispose(),s.disposable.dispose(),this._chipRenderers.delete(n)}this._updateTabGroupClasses()}refreshAccents(){for(let i of this._ctx.group.model.getTabGroups()){var e,t;let n=this._chipRenderers.get(i.id);n==null||(t=(e=n.chip).update)===null||t===void 0||t.call(e,{tabGroup:i})}this._updateTabGroupClasses()}positionAllChips(){if(this._chipRenderers.size!==0)for(let e of this._ctx.group.model.getTabGroups())this._positionChipForGroup(e)}updateDirection(){let e=this._ctx.getDirection()==="vertical";for(let[,t]of this._chipRenderers){let i=e?["top"]:["left"];t.dropTarget.setTargetZones(i),t.pointerDropTarget.setTargetZones(i)}}clearChipDropOverlays(){for(let[,i]of this._chipRenderers){var e,t;(e=i.dropTarget)===null||e===void 0||e.clearOverlay(),(t=i.pointerDropTarget)===null||t===void 0||t.clearOverlay()}}snapshotChipSizes(){let e=this._ctx.getDirection()==="vertical",t=new Map;for(let[i,n]of this._chipRenderers){let s=n.chip.element.getBoundingClientRect();t.set(i,e?s.height:s.width)}return t}positionUnderlines(){var e;(e=this._indicator)===null||e===void 0||e.positionUnderlines()}trackUnderlines(){var e;(e=this._indicator)===null||e===void 0||e.trackUnderlines()}setGroupDragImage(e,t,i){if(!e.dataTransfer)return;let n=this._ctx.getDirection()==="vertical",s=this._ctx.tabsList.cloneNode(!0);n?(s.classList.remove("dv-tabs-container-vertical","dv-vertical"),s.classList.add("dv-horizontal"),s.style.writingMode="horizontal-tb",s.style.height=`${this._ctx.tabsList.offsetWidth}px`):s.style.height=`${this._ctx.tabsList.offsetHeight}px`,s.style.width="auto",s.style.overflow="visible",s.style.pointerEvents="none";let l=Array.from(s.children),c=Array.from(this._ctx.tabsList.children);for(let x=l.length-1;x>=0;x--)c[x]!==i&&l[x].remove();let p=document.createElement("div");p.className="dv-groupview dv-active-group",p.style.position="fixed",p.style.top="-10000px",p.style.left="0px",p.style.height="auto",p.style.width="auto",p.style.pointerEvents="none";let v=document.createElement("div");v.className="dv-tabs-and-actions-container",v.style.height="auto",v.style.width="auto",p.appendChild(v),v.appendChild(s),this._ctx.accessor.element.appendChild(p);let m=s.querySelector(".dv-tab-group-chip"),f=i.getBoundingClientRect(),_=e.clientX-f.left,y=e.clientY-f.top;if(m){let x=m.getBoundingClientRect(),k=p.getBoundingClientRect(),S=x.left-k.left+_,z=x.top-k.top+y;e.dataTransfer.setDragImage(p,S,z)}else e.dataTransfer.setDragImage(p,_,y);requestAnimationFrame(()=>{p.remove()})}cleanupTransition(e){var t;(t=this._pendingTransitionCleanups.get(e))===null||t===void 0||t(),this._pendingTransitionCleanups.delete(e)}updateDragAndDropState(){let e=Ye(this._ctx.accessor.options);for(let s of this._chipRenderers.values()){var t,i,n;s.chip.element.draggable=e.html5,(t=s.html5DragSource)===null||t===void 0||t.setDisabled(!e.html5),(i=s.pointerDragSource)===null||i===void 0||i.setDisabled(!e.pointer),(n=s.pointerDragSource)===null||n===void 0||n.setTouchOnly(!e.pointerHandlesMouse)}}disposeChipDrag(e){var t;let i=this._chipRenderers.get(e);i&&((t=i.dragSourcesDisposable)===null||t===void 0||t.dispose(),i.html5DragSource=void 0,i.pointerDragSource=void 0,i.dragSourcesDisposable=void 0)}_buildChipGhostElement(e){let t=getComputedStyle(e),i=e.cloneNode(!0);return Array.from(t).forEach(n=>{i.style.setProperty(n,t.getPropertyValue(n),t.getPropertyPriority(n))}),i.style.position="absolute",i}disposeAll(){var e;(e=this._indicator)===null||e===void 0||e.dispose(),this._indicator=null;for(let[,i]of this._pendingTransitionCleanups)i();this._pendingTransitionCleanups.clear();for(let[,i]of this._chipRenderers){var t;i.chip.element.remove(),i.chip.dispose(),(t=i.dragSourcesDisposable)===null||t===void 0||t.dispose(),i.disposable.dispose()}this._chipRenderers.clear()}_ensureIndicator(){var e,t,i;let n=((e=(t=this._ctx.accessor.options.theme)===null||t===void 0?void 0:t.tabGroupIndicator)!==null&&e!==void 0?e:"wrap")==="none"?yc:_c;this._indicator&&!(this._indicator instanceof n)&&(this._indicator.dispose(),this._indicator=null),(i=this._indicator)!==null&&i!==void 0||(this._indicator=new n({tabsList:this._ctx.tabsList,getTabGroups:()=>this._ctx.group.model.getTabGroups(),getActivePanelId:()=>{var s;return(s=this._ctx.group.activePanel)===null||s===void 0?void 0:s.id},getTabMap:()=>this._ctx.getTabMap(),getChipElement:s=>{var l;return(l=this._chipRenderers.get(s))===null||l===void 0?void 0:l.chip.element},getDirection:()=>this._ctx.getDirection(),getHeaderPosition:()=>this._ctx.group.model.headerPosition,getColorPalette:()=>this._ctx.accessor.tabGroupColorPalette}))}_createChipDragSources(e,t){let i=Ye(this._ctx.accessor.options);e.element.draggable=i.html5;let n=u.getInstance(),s=()=>(n.setData([new d(this._ctx.accessor.id,this._ctx.group.id,null,t.id)],d.prototype),{dispose:()=>{n.clearData(d.prototype)}}),l=vt.createDragSource(e.element,{getData:s,disabled:!i.html5,isCancelled:()=>!Ye(this._ctx.accessor.options).html5,onDragStart:v=>{"dataTransfer"in v&&v.dataTransfer&&this.setGroupDragImage(v,t,e.element),this._callbacks.onChipDragStart(t,e,v)},onDragEnd:v=>{var m,f;(m=(f=this._callbacks).onChipDragEnd)===null||m===void 0||m.call(f,t,e,v)}}),c=()=>{n.clearData(d.prototype)};e.element.addEventListener("dragend",c,{once:!0});let p=tt.createDragSource(e.element,{getData:s,disabled:!i.pointer,touchOnly:!i.pointerHandlesMouse,isCancelled:()=>!Ye(this._ctx.accessor.options).pointer,createGhost:()=>({element:this._buildChipGhostElement(e.element),offsetX:8,offsetY:8}),onDragStart:v=>{this._callbacks.onChipDragStart(t,e,v)}});return{html5DragSource:l,pointerDragSource:p,disposable:{dispose:()=>{l.dispose(),p.dispose(),e.element.removeEventListener("dragend",c)}}}}_ensureChipForGroup(e){let t=this._chipRenderers.get(e.id);if(t){if(!t.html5DragSource){let y=this._createChipDragSources(t.chip,e);t.html5DragSource=y.html5DragSource,t.pointerDragSource=y.pointerDragSource,t.dragSourcesDisposable=y.disposable}return}let i=this._ctx.accessor.options.createTabGroupChipComponent,n=i?i(e):new os(this._ctx.accessor.tabGroupColorPalette);n.init({tabGroup:e,api:this._ctx.accessor.api});let s=this._createChipDragSources(n,e),l=[e.onDidChange(()=>{var y;(y=n.update)===null||y===void 0||y.call(n,{tabGroup:e}),this._updateTabGroupClasses()}),e.onDidPanelChange(()=>{this._positionChipForGroup(e),this._updateTabGroupClasses()}),e.onDidCollapseChange(()=>{this._updateTabGroupClasses()})],c=y=>{var x;(x=this._chipRenderers.get(e.id))===null||x===void 0||(x=x.pointerDragSource)===null||x===void 0||x.cancelPending(),this._callbacks.onChipContextMenu(e,y)};n instanceof os?l.push(n.onContextMenu(c)):l.push(new ho(n.element,{onLongPress:c}),O(n.element,"contextmenu",c));let p={acceptedTargetZones:this._ctx.getDirection()==="vertical"?["top"]:["left"],overlayModel:{activationSize:{value:100,type:"percentage"}},canDisplayOverlay:(y,x)=>{if(this._ctx.group.locked||this._ctx.accessor.options.disableDnd)return!1;let k=g();if(this._ctx.accessor.id===k?.viewId){var S;return!(((S=this._ctx.accessor.options.theme)===null||S===void 0?void 0:S.tabAnimation)==="smooth"&&!k.tabGroupId)}return this._ctx.group.model.canDisplayOverlay(y,x,"tab")}},v=vt.createDropTarget(n.element,p),m=tt.createDropTarget(n.element,p),f=y=>{this._callbacks.onChipDrop(e,y)};l.push(v,v.onDrop(f),m,m.onDrop(f));let _=new D(...l);this._chipRenderers.set(e.id,{chip:n,html5DragSource:s.html5DragSource,pointerDragSource:s.pointerDragSource,dragSourcesDisposable:s.disposable,disposable:_,dropTarget:v,pointerDropTarget:m}),e.collapsed&&(this._skipNextCollapseAnimation=!0)}_positionChipForGroup(e){let t=this._chipRenderers.get(e.id);if(!t)return;let i=t.chip.element,n=e.panelIds;if(n.length===0){i.remove();return}let s=n[0],l=this._ctx.getTabMap().get(s);if(!l){i.remove();return}let c=l.value.element;i.nextSibling!==c&&this._ctx.tabsList.insertBefore(i,c)}_updateTabGroupClasses(){let e=this._ctx.group.model.getTabGroups(),t=this._ctx.getTabs(),i=this._ctx.getTabMap(),n=!1,s=new Map;for(let p of e)for(let v of p.panelIds)s.set(v,p);for(let p of t){let v=p.value,m=v.panel.id,f=s.get(m),_=!!f;if(E(v.element,"dv-tab--grouped",_),f){let y=f.panelIds,x=y[0]===m,k=y[y.length-1]===m;E(v.element,"dv-tab--group-first",x),E(v.element,"dv-tab--group-last",k),Wi(v.element,f.color,this._ctx.accessor.tabGroupColorPalette);let S=v.element.classList.contains("dv-tab--group-collapsed");if(!f.collapsed&&S){var l;n=!0,v.element.classList.remove("dv-tab--group-collapsed"),v.element.classList.add("dv-tab--group-expanding"),(l=this._pendingTransitionCleanups.get(m))===null||l===void 0||l();let z=()=>{v.element.classList.remove("dv-tab--group-expanding"),v.element.style.removeProperty("width"),v.element.removeEventListener("transitionend",z),clearTimeout(M),this._pendingTransitionCleanups.delete(m)},M=setTimeout(z,300);this._pendingTransitionCleanups.set(m,z),v.element.addEventListener("transitionend",z)}}else E(v.element,"dv-tab--group-first",!1),E(v.element,"dv-tab--group-last",!1),v.element.classList.remove("dv-tab--group-collapsed","dv-tab--group-expanding"),v.element.style.removeProperty("width"),v.element.style.removeProperty("--dv-tab-group-color")}let c=new Set;for(let p of e)if(c.add(p.id),p.collapsed&&p.panelIds.some(v=>{let m=i.get(v);return m&&!m.value.element.classList.contains("dv-tab--group-collapsed")}))if(this._skipNextCollapseAnimation){let v=[];for(let m of p.panelIds){let f=i.get(m);f&&(f.value.element.style.transition="none",f.value.element.classList.add("dv-tab--group-collapsed"),v.push(f.value.element))}if(v.length>0){v[0].offsetHeight;for(let m of v)m.style.removeProperty("transition")}}else{n=!0;let v=this._ctx.getDirection()==="vertical";for(let m of p.panelIds){let f=i.get(m);if(f&&!f.value.element.classList.contains("dv-tab--group-collapsed")){let _=f.value.element.getBoundingClientRect();v?f.value.element.style.height=`${_.height}px`:f.value.element.style.width=`${_.width}px`,f.value.element.offsetHeight,f.value.element.classList.add("dv-tab--group-collapsed")}}}this._skipNextCollapseAnimation=!1,this._ensureIndicator(),this._indicator&&(this._indicator.syncUnderlineElements(c),n?this._indicator.trackUnderlines():this._indicator.positionUnderlines())}};function hi(e,t){return t==="vertical"?e.height:e.width}function Bi(e,t){return t==="vertical"?e.top:e.left}function as(e,t){return t==="vertical"?e.clientY:e.clientX}var kc=class extends D{get _tabs(){return this.host.tabItems}get _tabMap(){return this.host.tabMap}get _tabsList(){return this.host.tabsList}get _direction(){return this.host.direction}get group(){return this.host.groupPanel}get accessor(){return this.host.component}get _tabGroupManager(){return this.host.tabGroupManager}get _wrapMode(){return this._tabsList.classList.contains(uo)}get animState(){return this._animState}set animState(e){this._animState=e}get pendingCollapse(){return this._pendingCollapse}set pendingCollapse(e){this._pendingCollapse=e}set voidContainerElement(e){this._voidContainer=e}constructor(e){super(),this.host=e,this._animState=null,this._pendingMarginCleanups=new Map,this._pendingCollapse=!1,this._flipTransitionCleanup=null,this._voidContainer=null,this._extendedDropZone=null,this._pointerInsideTabsList=!1,this._wrapIndicatorEl=null,this.addDisposables({dispose:()=>{var t;(t=this._flipTransitionCleanup)===null||t===void 0||t.call(this)}})}setExtendedDropZone(e){this._extendedDropZone=e}setExternalInsertionIndex(e){this._animState&&e!==this._animState.currentInsertionIndex&&(this._animState.currentInsertionIndex=e,this.applyDragOverTransforms())}clearExternalAnimState(){this._animState&&(this.resetTabTransforms(),this._animState.sourceIndex===-1?this._animState=null:this._animState.currentInsertionIndex=null)}snapshotTabPositions(){let e=new Map;for(let t of this._tabs)e.set(t.value.panel.id,t.value.element.getBoundingClientRect());return e}_mainAxisSize(e){return hi(e,this._direction)}_mainAxisStart(e){return Bi(e,this._direction)}_mainAxisCoord(e,t){return as({clientX:e,clientY:t},this._direction)}get _gapMarginProperty(){return this._direction==="vertical"?"margin-top":"margin-left"}getAverageTabSize(){if(this._tabs.length===0)return 0;let e=0;for(let t of this._tabs)e+=this._mainAxisSize(t.value.element.getBoundingClientRect());return e/this._tabs.length}handlePointerDragMove(e,t){let i=he(this._tabsList).elementFromPoint(e,t);if(!(i&&(this._tabsList.contains(i)||this._extendedDropZone&&this._extendedDropZone.contains(i)))){this._pointerInsideTabsList&&(this._pointerInsideTabsList=!1,this.processDragLeave(i));return}this._pointerInsideTabsList=!0,this.processDragOver(e,t)}handlePointerDragEnd(e){if(e&&this._animState&&this._animState.sourceIndex!==-1&&this._animState.currentInsertionIndex!==null&&this.isPointInsideTabsList(e.clientX,e.clientY)){let t=this._animState.sourceTabGroupId;if(t){let i=this._animState.currentInsertionIndex;this._animState=null,this.commitGroupMove(t,i)}else this.commitPointerReorder(e.pointerEvent)}this._pointerInsideTabsList=!1,this.resetDragAnimation()}isPointInsideTabsList(e,t){let i=he(this._tabsList).elementFromPoint(e,t);return!!i&&this._tabsList.contains(i)}commitPointerReorder(e){let t=this._animState;if(t?.currentInsertionIndex==null)return;let i=t.currentInsertionIndex,n=t.sourceIndex,s=i-(n!==-1&&n<i?1:0);this._animState=null,this.clearWrapDropIndicator(),this.uncollapseSourceTab(t.sourceTabId),s!==n&&this.host.fireDrop({event:e,index:s,targetTabGroupId:null})}processDragOver(e,t){if(this.accessor.options.disableDnd||(this._dropStaleAnimState(),!this._animState&&!this._initAnimStateForExternalDrag()))return!1;if(this._animState.sourceIndex!==-1){var i;(i=this.group.model.dropTargetContainer)===null||i===void 0||(i=i.model)===null||i===void 0||i.clear()}return this.handleDragOver({clientX:e,clientY:t}),!0}_dropStaleAnimState(){if(!this._animState)return;let e=g();e?.tabGroupId&&e.groupId!==this.group.id&&this._animState.sourceTabGroupId!==e.tabGroupId&&(this._animState=null)}_initAnimStateForExternalDrag(){var e;let t=g();if(((e=this.accessor.options.theme)===null||e===void 0?void 0:e.tabAnimation)==="default"&&!t?.tabGroupId||!t||!(t.panelId||t.tabGroupId)||t.groupId===this.group.id)return!1;let i=this.getAverageTabSize();return this._animState=t.tabGroupId?this._makeGroupDragAnimState(t,i):this._makeTabDragAnimState(t,i),!0}_makeGroupDragAnimState(e,t){var i;let n=this.accessor.getPanel(e.groupId),s=n?.model.getTabGroups().find(c=>c.id===e.tabGroupId),l=t*((i=s?.panelIds.length)!==null&&i!==void 0?i:1)+t;return{sourceTabId:"",sourceIndex:-1,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:e.tabGroupId,sourceGroupPanelIds:s?new Set(s.panelIds):new Set,sourceChipSize:t,cursorOffsetFromDragStart:l/2,sourceGapSize:l,containerStart:this._mainAxisStart(this._tabsList.getBoundingClientRect())}}_makeTabDragAnimState(e,t){return{sourceTabId:e.panelId,sourceIndex:-1,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:null,sourceGroupPanelIds:null,sourceChipSize:0,cursorOffsetFromDragStart:t/2,sourceGapSize:t,containerStart:this._mainAxisStart(this._tabsList.getBoundingClientRect())}}processDragLeave(e){var t;if(this._animState&&!(e&&this._tabsList.contains(e))){if(e&&(!((t=this._extendedDropZone)===null||t===void 0)&&t.contains(e))){this.resetTabTransforms(),this._animState.currentInsertionIndex=null;return}this._voidContainer&&e&&(e===this._voidContainer||this._voidContainer.contains(e))||(this.resetTabTransforms(),this._animState.sourceIndex===-1?(this.clearHeaderAnchorOverlay(),this._animState=null):this._animState.currentInsertionIndex=null)}}clearHeaderAnchorOverlay(){var e;let t=this.group.model.dropTargetContainer,i=t?.renderedOutline;i&&![this._tabsList,this._voidContainer,this._extendedDropZone].some(n=>n?.contains(i))||t==null||(e=t.model)===null||e===void 0||e.clear()}handleDragOver(e){var t,i;if(!this._animState)return;if(this._wrapMode&&!this._animState.sourceTabGroupId){var n;this.handleWrappedDragOver(e.clientX,(n=e.clientY)!==null&&n!==void 0?n:0);return}let s=this._mainAxisCoord(e.clientX,(t=e.clientY)!==null&&t!==void 0?t:0),l=this._buildFirstPanelToGroupMap(),c=this._computeDragOverInsertionIndex(s,l),p=null;if(c!==null&&this._tabGroupManager.chipRenderers.size>0){let v=this._resolveInsertionAgainstTabGroups(s,c,l);c=v.insertionIndex,p=v.targetTabGroupId}c===this._animState.currentInsertionIndex&&p===this._animState.targetTabGroupId||(this._animState.currentInsertionIndex=c,this._animState.targetTabGroupId=p,((i=this.accessor.options.theme)===null||i===void 0?void 0:i.tabAnimation)==="smooth"&&this.applyDragOverTransforms())}_buildFirstPanelToGroupMap(){let e=new Map;if(this._tabGroupManager.chipRenderers.size===0)return e;for(let t of this.group.model.getTabGroups())t.id!==this._animState.sourceTabGroupId&&t.panelIds.length>0&&e.set(t.panelIds[0],t.id);return e}_computeDragOverInsertionIndex(e,t){let i=this._animState,n=i.sourceGroupPanelIds,s=e-i.cursorOffsetFromDragStart-i.containerStart,l=0,c=null;for(let f=0;f<this._tabs.length;f++){let _=this._tabs[f].value;if(_.panel.id===i.sourceTabId||n?.has(_.panel.id))continue;let y=t.get(_.panel.id);if(y){var p;let S=(p=i.chipSizes.get(y))!==null&&p!==void 0?p:0;if(l+S>s){var v;(v=c)!==null&&v!==void 0||(c=f);break}l+=S}let x=i.tabPositions.get(_.panel.id),k=this._mainAxisSize(x??_.element.getBoundingClientRect());if(l+k/2<=s)l+=k,c=f+1;else{var m;(m=c)!==null&&m!==void 0||(c=f);break}}return c}_accumulatedSizeUpTo(e,t){let i=this._animState,n=i.sourceGroupPanelIds,s=0;for(let c=0;c<this._tabs.length;c++){let p=this._tabs[c].value;if(p.panel.id===i.sourceTabId||n?.has(p.panel.id))continue;if(c>=e)break;let v=t.get(p.panel.id);if(v){var l;s+=(l=i.chipSizes.get(v))!==null&&l!==void 0?l:0}let m=i.tabPositions.get(p.panel.id);s+=this._mainAxisSize(m??p.element.getBoundingClientRect())}return s}_resolveInsertionAgainstTabGroups(e,t,i){let n=!!this._animState.sourceTabGroupId,s=this._accumulatedSizeUpTo(t,i);for(let l of this.group.model.getTabGroups()){let c=this._evaluateTabGroupForInsertion(l,e,t,s,n);if(c)return c}return{insertionIndex:t,targetTabGroupId:null}}_evaluateTabGroupForInsertion(e,t,i,n,s){let l=this._resolveGroupRange(e);if(!l)return null;let{firstIdx:c,lastIdx:p}=l,v=i>=c&&i<=p,m=!v&&i===c-1;return!v&&!m?null:s?this._resolveGroupDragTarget(i,c,p,v):this._resolveTabDragTarget(e,t,i,n,c,m)}_resolveGroupRange(e){let t=this._animState,i=t.sourceGroupPanelIds,n=e.panelIds.filter(c=>c!==t.sourceTabId&&!i?.has(c));if(n.length===0)return null;let s=this._tabs.findIndex(c=>c.value.panel.id===n[0]),l=this._tabs.findIndex(c=>c.value.panel.id===n[n.length-1]);return s===-1||l===-1?null:{firstIdx:s,lastIdx:l}}_resolveGroupDragTarget(e,t,i,n){return n?{insertionIndex:e<(t+i+1)/2?t:i+1,targetTabGroupId:null}:{insertionIndex:e,targetTabGroupId:null}}_resolveTabDragTarget(e,t,i,n,s,l){var c;let p=this._animState,v=(c=p.chipSizes.get(e.id))!==null&&c!==void 0?c:0;if(l)return this._onlySourceBetween(i,s)?t>=(e.collapsed?p.containerStart+n+v/2:p.containerStart+n+v)?{insertionIndex:s,targetTabGroupId:e.id}:{insertionIndex:i,targetTabGroupId:null}:null;let m=p.containerStart+n+v;return i===s?{insertionIndex:i,targetTabGroupId:t>=m?e.id:null}:{insertionIndex:i,targetTabGroupId:e.id}}_onlySourceBetween(e,t){let i=this._animState;for(let s=e;s<t;s++){var n;let l=this._tabs[s].value.panel.id;if(l!==i.sourceTabId&&!(!((n=i.sourceGroupPanelIds)===null||n===void 0)&&n.has(l)))return!1}return!0}handleWrappedDragOver(e,t){if(!this._animState)return;let i=this.computeWrappedInsertionIndex(e,t);i===this._animState.currentInsertionIndex&&this._animState.targetTabGroupId===null||(this._animState.currentInsertionIndex=i,this._animState.targetTabGroupId=null,this.updateWrapDropIndicator(i))}computeWrappedInsertionIndex(e,t){var i;let n=this._direction==="vertical",s=this._wrappedDragEntries();if(s.length===0)return this._tabs.length;let l=n?e:t,c=n?t:e,p=x=>n?x.left:x.top,v=x=>n?x.right:x.bottom,m=x=>n?x.top:x.left,f=x=>n?x.height:x.width,_=this._bucketWrappedLines(s,p,v),y=[...((i=_.find(x=>l>=x.start&&l<=x.end))!==null&&i!==void 0?i:this._nearestWrappedLine(_,l)).items].sort((x,k)=>m(x.rect)-m(k.rect));for(let x of y)if(c<m(x.rect)+f(x.rect)/2)return x.index;return y[y.length-1].index+1}_wrappedDragEntries(){var e,t;let i=(e=this._animState)===null||e===void 0?void 0:e.sourceTabId,n=(t=this._animState)===null||t===void 0?void 0:t.sourceGroupPanelIds,s=[];for(let l=0;l<this._tabs.length;l++){let c=this._tabs[l].value;c.panel.id!==i&&(n?.has(c.panel.id)||s.push({index:l,rect:c.element.getBoundingClientRect()}))}return s}_bucketWrappedLines(e,t,i){let n=[];for(let s of e){let l=t(s.rect),c=n.find(p=>Math.abs(p.start-l)<=2);c?(c.items.push(s),c.end=Math.max(c.end,i(s.rect))):n.push({start:l,end:i(s.rect),items:[s]})}return n.sort((s,l)=>s.start-l.start),n}_nearestWrappedLine(e,t){let i=n=>t<n.start?n.start-t:t-n.end;return e.reduce((n,s)=>i(s)<i(n)?s:n,e[0])}updateWrapDropIndicator(e){var t;this.clearWrapDropIndicator();let i=this._tabs.length;if(i===0)return;let n=(t=this._animState)===null||t===void 0?void 0:t.sourceTabId;if(e<i){let s=this._tabs[e].value.element;if(this._tabs[e].value.panel.id===n)return;s.classList.add("dv-tab--reorder-before"),this._wrapIndicatorEl=s}else{let s=this._tabs[i-1].value.element;s.classList.add("dv-tab--reorder-after"),this._wrapIndicatorEl=s}}clearWrapDropIndicator(){var e;(e=this._wrapIndicatorEl)===null||e===void 0||e.classList.remove("dv-tab--reorder-before","dv-tab--reorder-after"),this._wrapIndicatorEl=null}_removeClassInstantlyBatch(e,t){let i=[];for(let n of e)n.classList.contains(t)&&(n.style.transition="none",E(n,t,!1),i.push(n));if(i.length>0){i[0].getBoundingClientRect();for(let n of i)n.style.removeProperty("transition")}}uncollapseSourceTab(e){let t=this._tabMap.get(e);t&&this._removeClassInstantlyBatch([t.value.element],"dv-tab--dragging")}applyDragOverTransforms(e=!1){var t;if(this._wrapMode)return;if(((t=this._animState)===null||t===void 0?void 0:t.currentInsertionIndex)==null){this.resetTabTransforms();return}if(this._pendingCollapse)return;let i=this._animState.currentInsertionIndex,n=this._computeGapSize(),s=this._computeChipToShift(i);this._applyGapMargins(i,n,s,e)}_computeGapSize(){let e=this._animState;if(e.sourceTabGroupId&&e.sourceGroupPanelIds)return e.sourceGapSize;let t=e.tabPositions.get(e.sourceTabId);return t?this._mainAxisSize(t):this.getAverageTabSize()}_computeChipToShift(e){if(this._tabGroupManager.chipRenderers.size===0)return null;for(let t of this.group.model.getTabGroups()){let i=this._chipToShiftForGroup(t,e);if(i!==void 0)return i}return null}_chipToShiftForGroup(e,t){let i=this._animState;if(e.id===i.sourceTabGroupId||e.panelIds.includes(i.sourceTabId))return;let n=e.panelIds.filter(l=>{var c;return l!==i.sourceTabId&&!(!((c=i.sourceGroupPanelIds)===null||c===void 0)&&c.has(l))});if(n.length===0)return;let s=this._tabs.findIndex(l=>l.value.panel.id===n[0]);if((!i.targetTabGroupId||i.targetTabGroupId===e.id&&e.collapsed)&&!(s<t)){if(this._onlySourceBetween(t,s)){let l=this._tabGroupManager.chipRenderers.get(e.id);if(l)return l.chip.element}return null}}_applyGapMargins(e,t,i,n){let s=this._animState,l=s.sourceGroupPanelIds,c=!1;for(let[p,v]of this._tabGroupManager.chipRenderers)p!==s.sourceTabGroupId&&this._clearMargin(v.chip.element,n);i&&(this._setMargin(i,`${t}px`,n),c=!0);for(let p=0;p<this._tabs.length;p++){let v=this._tabs[p].value;v.panel.id!==s.sourceTabId&&(l?.has(v.panel.id)||(!c&&p>=e?(this._setMargin(v.element,`${t}px`,n),c=!0):this._clearMargin(v.element,n)))}this._tabGroupManager.trackUnderlines()}_shiftingClass(e){return e.classList.contains("dv-tab-group-chip")?"dv-tab-group-chip--shifting":"dv-tab--shifting"}_setMargin(e,t,i){let n=this._gapMarginProperty;i?(e.style.transition="none",e.style.setProperty(n,t),e.getBoundingClientRect(),e.style.removeProperty("transition")):e.style.setProperty(n,t),E(e,this._shiftingClass(e),!0)}_clearMargin(e,t){let i=this._shiftingClass(e),n=this._gapMarginProperty,s=this._pendingMarginCleanups.get(e);if(s&&s(),t||!e.style.getPropertyValue(n))e.style.removeProperty(n),E(e,i,!1);else{e.style.setProperty(n,"0px"),E(e,i,!0);let l=()=>{e.style.removeProperty(n),E(e,i,!1),e.removeEventListener("transitionend",l),clearTimeout(c),this._pendingMarginCleanups.delete(e)},c=setTimeout(l,300);this._pendingMarginCleanups.set(e,l),e.addEventListener("transitionend",l)}}resetTabTransforms(){this.clearWrapDropIndicator();for(let[,e]of this._pendingMarginCleanups)e();this._pendingMarginCleanups.clear();for(let e of this._tabs)e.value.element.style.removeProperty("margin-left"),e.value.element.style.removeProperty("margin-right"),e.value.element.style.removeProperty("margin-top"),e.value.element.style.removeProperty("margin-bottom"),e.value.element.style.removeProperty("transform"),E(e.value.element,"dv-tab--shifting",!1);for(let[,e]of this._tabGroupManager.chipRenderers)e.chip.element.style.removeProperty("margin-left"),e.chip.element.style.removeProperty("margin-top"),E(e.chip.element,"dv-tab-group-chip--shifting",!1);this._tabGroupManager.positionUnderlines()}commitGroupMove(e,t){let i=g();if(this._tabGroupManager.disposeChipDrag(e),this._tabGroupManager.clearChipDropOverlays(),this.group.model.getTabGroups().some(l=>l.id===e)){var n;if(((n=this.accessor.options.theme)===null||n===void 0?void 0:n.tabAnimation)==="smooth"){this._clearGroupDragClasses(e);let l=this.snapshotTabPositions();this.resetTabTransforms(),this.group.model.moveTabGroup(e,t),this.runFlipAnimation(l,"",!1)}else this._tabGroupManager.skipNextCollapseAnimation=!0,this.group.model.moveTabGroup(e,t)}else if(i){var s;this.resetTabTransforms(),this.accessor.moveGroupOrPanel({from:{groupId:i.groupId,tabGroupId:(s=i.tabGroupId)!==null&&s!==void 0?s:e},to:{group:this.group,position:"center",index:t}})}}_clearGroupDragClasses(e){let t=this._tabGroupManager.chipRenderers.get(e);t&&this._removeClassInstantlyBatch([t.chip.element],"dv-tab-group-chip--dragging"),this._removeClassInstantlyBatch(this._tabs.map(n=>n.value.element),"dv-tab--dragging");let i=this._tabGroupManager.groupUnderlines.get(e);i&&i.style.removeProperty("display"),this._tabGroupManager.skipNextCollapseAnimation=!0}resetDragAnimation(){if(this._pendingCollapse=!1,this._animState){this.resetTabTransforms(),this._animState.sourceTabGroupId?this._clearGroupDragClasses(this._animState.sourceTabGroupId):this._removeClassInstantlyBatch(this._tabs.map(e=>e.value.element),"dv-tab--dragging"),this._animState=null;for(let[,e]of this._tabGroupManager.groupUnderlines)e.style.removeProperty("display")}}runFlipAnimation(e,t,i=!1,n){if(this._wrapMode)return;let s=!1;for(let l=0;l<this._tabs.length;l++)this._applyFlipTransform(this._tabs[l],l,t,i,e,n)&&(s=!0);s&&this._scheduleFlipReset()}_applyFlipTransform(e,t,i,n,s,l){let c=this._direction==="vertical",p=e.value.panel.id;if(p===i){if(!n)return!1;let _=e.value.element.getBoundingClientRect();return e.value.element.style.transform=c?`translateY(${_.height}px)`:`translateX(${_.width}px)`,E(e.value.element,"dv-tab--shifting",!0),!0}if(l!==void 0&&(t<l.from||t>l.to))return!1;let v=s.get(p);if(!v)return!1;let m=e.value.element.getBoundingClientRect(),f=c?v.top-m.top:v.left-m.left;return Math.abs(f)<1?!1:(e.value.element.style.transform=c?`translateY(${f}px)`:`translateX(${f}px)`,E(e.value.element,"dv-tab--shifting",!0),!0)}_scheduleFlipReset(){requestAnimationFrame(()=>{var e;for(let n of this._tabs)n.value.element.style.transform&&(n.value.element.style.transform="");this._tabGroupManager.trackUnderlines(),(e=this._flipTransitionCleanup)===null||e===void 0||e.call(this);let t=n=>{if(n.propertyName==="transform"){i();for(let s of this._tabs)E(s.value.element,"dv-tab--shifting",!1);this._tabGroupManager.positionUnderlines()}},i=()=>{this._tabsList.removeEventListener("transitionend",t),this._flipTransitionCleanup=null};this._flipTransitionCleanup=i,this._tabsList.addEventListener("transitionend",t)})}},Sc=class extends D{get _animState(){return this._reorder.animState}set _animState(e){this._reorder.animState=e}get _pendingCollapse(){return this._reorder.pendingCollapse}set _pendingCollapse(e){this._reorder.pendingCollapse=e}get tabItems(){return this._tabs}get tabMap(){return this._tabMap}get tabsList(){return this._tabsList}get groupPanel(){return this.group}get component(){return this.accessor}get tabGroupManager(){return this._tabGroupManager}fireDrop(e){this._onDrop.fire(e)}setOverflowExclude(e){this._overflowExclude=e,this.refreshOverflow()}setForcedOverflow(e){this._forcedOverflow=e,this.refreshOverflow()}refreshOverflow(){this._showTabsOverflowControl&&this.toggleDropdown({reset:!1}),this._applyPinnedSticky()}setPinnedSticky(e){this._pinnedSticky!==e&&(this._pinnedSticky=e,this._applyPinnedSticky())}_applyPinnedSticky(){let e=this._pinnedSticky?this._tabs.filter(i=>this._overflowExclude(i.value.panel.id)):[];if(e.length===0&&!this._hasPinnedStickyStyling)return;for(let i of this._tabs){let n=i.value.element;n.classList.contains("dv-tab--pinned-sticky")&&(n.classList.remove("dv-tab--pinned-sticky"),n.style.removeProperty("--dv-pinned-sticky-left"))}if(e.length===0){this._hasPinnedStickyStyling=!1;return}let t=e.map(i=>i.value.element.offsetLeft);e.forEach((i,n)=>{let s=i.value.element;s.classList.add("dv-tab--pinned-sticky"),s.style.setProperty("--dv-pinned-sticky-left",`${t[n]}px`)}),this._hasPinnedStickyStyling=!0}get showTabsOverflowControl(){return this._showTabsOverflowControl}set showTabsOverflowControl(e){if(this._showTabsOverflowControl!=e)if(this._showTabsOverflowControl=e,e){let t=new $(this._tabsList);this._observerDisposable.value=new D(t,t.onDidChange(i=>{let n=i.hasScrollX||i.hasScrollY;this.toggleDropdown({reset:!n}),this._applyPinnedSticky(),this._tabGroupManager.groupUnderlines.size>0&&this._tabGroupManager.positionUnderlines()}),O(this._tabsList,"scroll",()=>{this.toggleDropdown({reset:!1}),this._applyPinnedSticky(),this._tabGroupManager.groupUnderlines.size>0&&this._tabGroupManager.positionUnderlines()}))}else this._observerDisposable.value=w.NONE}get element(){return this._element}get tabsListElement(){return this._tabsList}set voidContainer(e){var t;(t=this._voidContainerListeners)===null||t===void 0||t.dispose(),this._voidContainerListeners=null,this._reorder.voidContainerElement=e,e&&(this._voidContainerListeners=new D(O(e,"dragover",i=>{this._animState&&i.preventDefault()}),O(e,"drop",i=>{var n;!((n=this._animState)===null||n===void 0)&&n.sourceTabGroupId&&this._animState.currentInsertionIndex!==null&&(i.preventDefault(),i.stopPropagation(),this.handleVoidDrop())})))}handleVoidDrop(){var e,t;if(!(!((e=this._animState)===null||e===void 0)&&e.sourceTabGroupId))return!1;let i=this._animState.sourceTabGroupId,n=(t=this._animState.currentInsertionIndex)!==null&&t!==void 0?t:this._tabs.length;return this._animState=null,this._commitGroupMove(i,n),!0}get panels(){return this._tabs.map(e=>e.value.panel.id)}get size(){return this._tabs.length}get tabs(){return this._tabs.map(e=>e.value)}get direction(){return this._direction}set direction(e){if(this._direction!==e){this._direction=e,this._tabsList.setAttribute("aria-orientation",e==="vertical"?"vertical":"horizontal"),this._scrollbar&&(this._scrollbar.orientation=e),L(this._tabsList,"dv-horizontal","dv-vertical"),e==="vertical"?F(this._tabsList,"dv-tabs-container-vertical","dv-vertical"):(L(this._tabsList,"dv-tabs-container-vertical"),F(this._tabsList,"dv-horizontal"));for(let t of this._tabs)t.value.setDirection(e);this._tabGroupManager.updateDirection()}}constructor(e,t,i){super(),this.group=e,this.accessor=t,this._observerDisposable=new C,this._pointerActivation=new C,this._scrollbar=null,this._tabs=[],this._tabMap=new Map,this.selectedIndex=-1,this._showTabsOverflowControl=!1,this._overflowExclude=()=>!1,this._forcedOverflow=()=>!1,this._pinnedSticky=!1,this._hasPinnedStickyStyling=!1,this._direction="horizontal",this._voidContainerListeners=null,this._onTabDragStart=new G,this.onTabDragStart=this._onTabDragStart.event,this._onDrop=new G,this.onDrop=this._onDrop.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._onOverflowTabsChange=new G,this.onOverflowTabsChange=this._onOverflowTabsChange.event,this._tabsList=document.createElement("div"),this._tabsList.className="dv-tabs-container",this._tabsList.setAttribute("role","tablist"),this._tabsList.setAttribute("aria-orientation",this._direction==="vertical"?"vertical":"horizontal"),this.showTabsOverflowControl=i.showTabsOverflowControl,t.options.scrollbars==="native"?this._element=this._tabsList:(this._scrollbar=new Xr(this._tabsList),this._scrollbar.orientation=this.direction,this._element=this._scrollbar.element,this.addDisposables(this._scrollbar)),this._tabGroupManager=new Dc({group:this.group,accessor:this.accessor,tabsList:this._tabsList,getTabs:()=>this._tabs,getTabMap:()=>this._tabMap,getDirection:()=>this._direction},{onChipContextMenu:(s,l)=>{var c;(c=this.accessor.contextMenuService)===null||c===void 0||c.showForChip(s,this.group,l)},onChipDragStart:(s,l,c)=>{this._handleChipDragStart(s,l,c)},onChipDragEnd:()=>{this._reorder.resetDragAnimation()},onChipDrop:(s,l)=>{this._handleChipDrop(s,l)}}),this._reorder=new kc(this);let n=tt.createDropTarget(this._tabsList,{acceptedTargetZones:["center"],canDisplayOverlay:()=>!1,isHitTestTransparent:()=>{let s=g();return s?.viewId!==this.accessor.id||s.groupId!==this.group.id?!0:s.panelId===null&&!s.tabGroupId}});this.addDisposables(n,this._onOverflowTabsChange,this._observerDisposable,this._pointerActivation,this._onWillShowOverlay,this._onDrop,this._onTabDragStart,this._reorder,Ri.getInstance().onDragEnd(s=>{this._reorder.handlePointerDragEnd(s)}),Ri.getInstance().onDragMove(s=>{this._reorder.handlePointerDragMove(s.clientX,s.clientY)}),O(this.element,"pointerdown",s=>{s.defaultPrevented||s.button===0&&this.accessor.doSetGroupActive(this.group)}),O(this._tabsList,"wheel",s=>{let l=this._direction==="vertical",c=l?s.deltaY||s.deltaX:s.deltaX||s.deltaY;if(c===0)return;let p=l?this._tabsList.scrollHeight-this._tabsList.clientHeight:this._tabsList.scrollWidth-this._tabsList.clientWidth;if(p<=0)return;let v=l?this._tabsList.scrollTop:this._tabsList.scrollLeft;c<0&&v<=0||c>0&&v>=p||(s.preventDefault(),s.stopPropagation(),l?this._tabsList.scrollTop=v+c:this._tabsList.scrollLeft=v+c)},{passive:!1}),O(this._tabsList,"keydown",s=>{this._onKeyDown(s)}),O(this._tabsList,"dragover",s=>{this._reorder.processDragOver(s.clientX,s.clientY)&&s.preventDefault()},!0),O(this._tabsList,"dragleave",s=>{this._reorder.processDragLeave(s.relatedTarget)},!0),O(this._tabsList,"dragend",()=>{this._reorder.resetDragAnimation()}),O(this._tabsList,"drop",s=>{var l,c,p;if(((l=this._animState)===null||l===void 0?void 0:l.currentInsertionIndex)==null||((c=this.accessor.options.theme)===null||c===void 0?void 0:c.tabAnimation)!=="smooth"&&!this._animState.sourceTabGroupId)return;s.stopPropagation(),s.preventDefault(),(p=this.group.model.dropTargetContainer)===null||p===void 0||(p=p.model)===null||p===void 0||p.clear();let v=this._animState;if(this._animState=null,this._pendingCollapse=!1,v.sourceTabGroupId){this._commitGroupMove(v.sourceTabGroupId,v.currentInsertionIndex);return}let m=v.currentInsertionIndex,f=v.sourceIndex,_=m-(f!==-1&&f<m?1:0),y=this.group.model.getTabGroupForPanel(v.sourceTabId);if(_===f&&!v.targetTabGroupId&&!y){this._reorder.uncollapseSourceTab(v.sourceTabId),this.resetTabTransforms();return}this._reorder.uncollapseSourceTab(v.sourceTabId);let x=this.snapshotTabPositions();this.resetTabTransforms(),this._onDrop.fire({event:s,index:_,targetTabGroupId:v.targetTabGroupId}),this.runFlipAnimation(x,v.sourceTabId,v.sourceIndex===-1,{from:Math.min(f,_),to:Math.max(f,_)})},!0),w.from(()=>{var s;(s=this._voidContainerListeners)===null||s===void 0||s.dispose(),this._reorder.resetDragAnimation(),this._tabGroupManager.disposeAll();for(let{value:l,disposable:c}of this._tabs)c.dispose(),l.dispose();this._tabs=[],this._tabMap.clear()}))}indexOf(e){return this._tabs.findIndex(t=>t.value.panel.id===e)}getTabId(e){var t;return(t=this._tabMap.get(e))===null||t===void 0?void 0:t.value.element.id}getPanelForTab(e){for(let{value:t}of this._tabs)if(t.element===e||t.element.contains(e))return t.panel}isActive(e){return this.selectedIndex>-1&&this._tabs[this.selectedIndex].value===e}_onKeyDown(e){let t=this._tabs.findIndex(c=>c.value.element===e.target);if(t===-1)return;let i=this._direction==="vertical",n=i?"ArrowDown":"ArrowRight",s=i?"ArrowUp":"ArrowLeft",l=this._tabs.length-1;switch(e.key){case n:e.preventDefault(),this._focusTab(Math.min(t+1,l));break;case s:e.preventDefault(),this._focusTab(Math.max(t-1,0));break;case"Home":e.preventDefault(),this._focusTab(0);break;case"End":e.preventDefault(),this._focusTab(l);break;case"Enter":case" ":e.preventDefault(),this.accessor.withOrigin("user",()=>this._tabs[t].value.panel.api.setActive());break;case"Delete":case"Backspace":e.preventDefault(),this._closeTab(t);break}}_closeTab(e){var t,i,n,s,l;let c=(t=this._tabs[e])===null||t===void 0?void 0:t.value;if(!c)return;let p=(i=(n=(s=this._tabs[e+1])===null||s===void 0?void 0:s.value)!==null&&n!==void 0?n:(l=this._tabs[e-1])===null||l===void 0?void 0:l.value)===null||i===void 0?void 0:i.panel.id;if(c.panel.api.close(),p!==void 0){let v=this._tabs.findIndex(m=>m.value.panel.id===p);v>-1&&this._focusTab(v)}}_focusTab(e){for(let t=0;t<this._tabs.length;t++)this._tabs[t].value.element.tabIndex=t===e?0:-1;this._tabs[e].value.element.focus()}focusActiveTab(){var e;if(this._tabs.length===0)return;let t=(e=this.group.activePanel)===null||e===void 0?void 0:e.id,i=t?this._tabs.findIndex(n=>n.value.panel.id===t):-1;this._focusTab(i>-1?i:0)}setActivePanel(e){let t=this._direction==="vertical";for(let i of this._tabs){let n=e.id===i.value.panel.id;i.value.setActive(n),n&&this._scrollTabIntoView(i.value.element,t)}this._tabGroupManager.groupUnderlines.size>0&&this._tabGroupManager.positionUnderlines()}_scrollTabIntoView(e,t){let i=e.parentElement;if(!i)return;let n=t?e.offsetTop:e.offsetLeft,s=t?e.offsetHeight:e.offsetWidth,l=t?i.scrollTop:i.scrollLeft,c=t?i.clientHeight:i.clientWidth;(n<l||n+s>l+c)&&(t?i.scrollTop=n:i.scrollLeft=n)}_activateOnPointerDown(e){if(!Ye(this.accessor.options).html5){this.group.model.openPanel(e);return}let t=requestAnimationFrame(()=>{this._tabMap.has(e.id)&&this.group.model.openPanel(e)});this._pointerActivation.value={dispose:()=>cancelAnimationFrame(t)}}openPanel(e,t=this._tabs.length){if(this._tabMap.has(e.id))return;let i=new Jr(e,this.accessor,this.group);i.setContent(e.view.tab),this._direction!=="horizontal"&&i.setDirection(this._direction);let n={value:i,disposable:new D(i.onDragStart(s=>{var l;if(this._onTabDragStart.fire({nativeEvent:s,panel:e}),((l=this.accessor.options.theme)===null||l===void 0?void 0:l.tabAnimation)==="smooth"){let c=hi(i.element.getBoundingClientRect(),this._direction),p=this._tabs.findIndex(v=>v.value===i);this._animState={sourceTabId:e.id,sourceIndex:p,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:null,sourceGroupPanelIds:null,sourceChipSize:0,cursorOffsetFromDragStart:c/2,sourceGapSize:c,containerStart:Bi(this._tabsList.getBoundingClientRect(),this._direction)},this._pendingCollapse=!0,requestAnimationFrame(()=>{var v,m;this._pendingCollapse=!1,this._animState&&(this._tabsList.classList.contains("dv-tabs-container--wrap")||(i.element.style.transition="none",E(i.element,"dv-tab--dragging",!0),i.element.offsetHeight),(m=(v=this._animState).currentInsertionIndex)!==null&&m!==void 0||(v.currentInsertionIndex=p),this.applyDragOverTransforms(!0),i.element.style.removeProperty("transition"))})}}),i.onTabClick(s=>{s.defaultPrevented||this.group.api.location.type==="edge"&&(this.group.activePanel===e?this.group.api.isCollapsed()?this.group.api.expand():this.group.api.collapse():(this.group.model.openPanel(e),this.group.api.isCollapsed()&&this.group.api.expand()))}),i.onPointerDown(s=>{if(s.defaultPrevented)return;let l=!this.accessor.options.disableFloatingGroups,c=this.group.api.location.type==="floating"&&this.size===1;if(l&&!c&&s.shiftKey){s.preventDefault();let p=this.accessor.getGroupPanel(i.panel.id),{top:v,left:m}=i.element.getBoundingClientRect(),{top:f,left:_}=this.accessor.element.getBoundingClientRect();this.accessor.addFloatingGroup(p,{x:m-_,y:v-f,inDragMode:!0});return}s.button===0&&this.group.api.location.type!=="edge"&&this.group.activePanel!==e&&this._activateOnPointerDown(e)}),i.onDrop(s=>{let l=this._animState;this._animState=null,this._pendingCollapse=!1;let c=this._tabs.findIndex(_=>_.value===i);if(l){var p;let _=s.position==="right"?c+1:c;if(l.sourceTabGroupId){var v;this._commitGroupMove(l.sourceTabGroupId,(v=l.currentInsertionIndex)!==null&&v!==void 0?v:_);return}this._reorder.uncollapseSourceTab(l.sourceTabId);let y=this.snapshotTabPositions();this.resetTabTransforms(),this._onDrop.fire({event:s.nativeEvent,index:_,targetTabGroupId:l.targetTabGroupId}),((p=this.accessor.options.theme)===null||p===void 0?void 0:p.tabAnimation)==="smooth"&&this.runFlipAnimation(y,l.sourceTabId,l.sourceIndex===-1,l.sourceIndex===-1?void 0:{from:Math.min(l.sourceIndex,_),to:Math.max(l.sourceIndex,_)})}else{var m,f;let _=this._direction==="vertical"?"bottom":"right",y=s.position===_?c+1:c,x=g(),k=x?this._tabs.findIndex(M=>M.value.panel.id===x.panelId):-1,S=y-(k!==-1&&k<y?1:0),z=(m=(f=this.group.model.getTabGroupForPanel(i.panel.id))===null||f===void 0?void 0:f.id)!==null&&m!==void 0?m:null;this._onDrop.fire({event:s.nativeEvent,index:S,targetTabGroupId:z})}}),i.onWillShowOverlay(s=>{this._onWillShowOverlay.fire(new Yt(s,{kind:"tab",panel:this.group.activePanel,api:this.accessor.api,group:this.group,getData:g}))}))};this.addTab(n,t),this._tabGroupManager.positionAllChips(),this._animState&&(this._animState.tabPositions=this.snapshotTabPositions(),this._animState.chipSizes=this._tabGroupManager.snapshotChipSizes(),this.applyDragOverTransforms())}delete(e){var t;((t=this._animState)===null||t===void 0?void 0:t.sourceTabId)===e&&(this.resetTabTransforms(),this._animState=null),this._tabGroupManager.cleanupTransition(e);let i=this.indexOf(e),n=this._tabs.splice(i,1)[0];if(this._tabMap.delete(e),n){let{value:s,disposable:l}=n;l.dispose(),s.dispose(),s.element.remove()}this._animState&&(this._animState.tabPositions=this.snapshotTabPositions(),this._animState.chipSizes=this._tabGroupManager.snapshotChipSizes(),this.applyDragOverTransforms())}addTab(e,t=this._tabs.length){if(t<0||t>this._tabs.length)throw new Error("invalid location");let i=t<this._tabs.length?this._tabs[t].value.element:null;this._tabsList.insertBefore(e.value.element,i),this._tabs=[...this._tabs.slice(0,t),e,...this._tabs.slice(t)],this._tabMap.set(e.value.panel.id,e),this.selectedIndex<0&&(this.selectedIndex=t)}toggleDropdown(e){let t=this._tabs.some(c=>!this._overflowExclude(c.value.panel.id)&&this._forcedOverflow(c.value.panel.id));if(e.reset&&!t){this._onOverflowTabsChange.fire({tabs:[],tabGroups:[],pinnedTabs:[],reset:!0});return}let i=this._tabs.filter(c=>!this._overflowExclude(c.value.panel.id)&&(this._forcedOverflow(c.value.panel.id)||!e.reset&&!Tt(c.value.element,this._tabsList))).map(c=>c.value.panel.id),n=e.reset?[]:this._tabs.filter(c=>this._overflowExclude(c.value.panel.id)&&c.value.element.getBoundingClientRect().width>0&&!Tt(c.value.element,this._tabsList)).map(c=>c.value.panel.id),s=new Set(i),l=[];for(let c of this.group.model.getTabGroups()){let p=this._tabGroupManager.chipRenderers.get(c.id),v=p&&!Tt(p.chip.element,this._tabsList),m=c.panelIds.length>0&&c.panelIds.every(f=>s.has(f));if((v||m)&&(l.push(c.id),c.collapsed))for(let f of c.panelIds)s.has(f)||(s.add(f),i.push(f))}this._onOverflowTabsChange.fire({tabs:i,tabGroups:l,pinnedTabs:n,reset:!1})}updateDragAndDropState(){for(let e of this._tabs)e.value.updateDragAndDropState();this._tabGroupManager.updateDragAndDropState()}updateTabGroups(){this._tabGroupManager.update()}refreshTabGroupAccent(){this._tabGroupManager.refreshAccents()}_handleChipDragStart(e,t,i){var n;let s=e.panelIds[0],l=s?this._tabs.findIndex(m=>m.value.panel.id===s):-1,c=t.element.getBoundingClientRect(),p=hi(c,this._direction);for(let m of e.panelIds){let f=this._tabMap.get(m);f&&(p+=hi(f.value.element.getBoundingClientRect(),this._direction))}if(this._animState={sourceTabId:"",sourceIndex:l,tabPositions:this.snapshotTabPositions(),chipSizes:this._tabGroupManager.snapshotChipSizes(),currentInsertionIndex:null,targetTabGroupId:null,sourceTabGroupId:e.id,sourceGroupPanelIds:new Set(e.panelIds),sourceChipSize:hi(c,this._direction),cursorOffsetFromDragStart:as(i,this._direction)-Bi(c,this._direction),sourceGapSize:p,containerStart:Bi(this._tabsList.getBoundingClientRect(),this._direction)},((n=this.accessor.options.theme)===null||n===void 0?void 0:n.tabAnimation)!=="smooth")return;let v=new Set(e.panelIds);this._pendingCollapse=!0,requestAnimationFrame(()=>{var m,f;if(this._pendingCollapse=!1,!this._animState)return;for(let x of this._tabs)v.has(x.value.panel.id)&&(x.value.element.style.transition="none",E(x.value.element,"dv-tab--dragging",!0));let _=this._tabGroupManager.chipRenderers.get(e.id);_&&(_.chip.element.style.transition="none",E(_.chip.element,"dv-tab-group-chip--dragging",!0)),this._tabsList.offsetHeight;let y=this._tabGroupManager.groupUnderlines.get(e.id);y&&(y.style.display="none"),(f=(m=this._animState).currentInsertionIndex)!==null&&f!==void 0||(m.currentInsertionIndex=l),this.applyDragOverTransforms(!0);for(let x of this._tabs)v.has(x.value.panel.id)&&x.value.element.style.removeProperty("transition");_&&_.chip.element.style.removeProperty("transition")})}_handleChipDrop(e,t){let i=e.panelIds[0];if(!i)return;let n=this._tabs.findIndex(v=>v.value.panel.id===i);if(n===-1)return;let s=g();if(s?.tabGroupId){var l;let v=this._animState;this._animState=null,this._pendingCollapse=!1,this._commitGroupMove(s.tabGroupId,(l=v?.currentInsertionIndex)!==null&&l!==void 0?l:n);return}let c=s?.groupId===this.group.id&&s?.panelId?this._tabs.findIndex(v=>v.value.panel.id===s.panelId):-1,p=n-(c!==-1&&c<n?1:0);this._onDrop.fire({event:t.nativeEvent,index:p,targetTabGroupId:null})}setExtendedDropZone(e){this._reorder.setExtendedDropZone(e)}setExternalInsertionIndex(e){this._reorder.setExternalInsertionIndex(e)}clearExternalAnimState(){this._reorder.clearExternalAnimState()}snapshotTabPositions(){return this._reorder.snapshotTabPositions()}handleDragOver(e){this._reorder.handleDragOver(e)}applyDragOverTransforms(e=!1){this._reorder.applyDragOverTransforms(e)}resetTabTransforms(){this._reorder.resetTabTransforms()}_commitGroupMove(e,t){this._reorder.commitGroupMove(e,t)}runFlipAnimation(e,t,i=!1,n){this._reorder.runFlipAnimation(e,t,i,n)}};function Cc(){let e=document.createElement("div");e.className="dv-tabs-overflow-dropdown-default";let t=document.createElement("span");t.textContent="";let i=jr();return e.appendChild(i),e.appendChild(t),{element:e,update:n=>{t.textContent=`${n.tabs}`}}}var Gc=class extends D{get onTabDragStart(){return this.tabs.onTabDragStart}get panels(){return this.tabs.panels}get size(){return this.tabs.size}get hidden(){return this._hidden}set hidden(e){this._hidden=e,this.element.style.display=e?"none":""}get direction(){return this._direction}set direction(e){this._direction=e,e==="vertical"?(F(this._element,"dv-groupview-header-vertical"),F(this.rightActionsContainer,"dv-right-actions-container-vertical"),this.tabs.direction=e):(L(this._element,"dv-groupview-header-vertical"),L(this.rightActionsContainer,"dv-right-actions-container-vertical"),this.tabs.direction=e)}get element(){return this._element}get tabsListElement(){return this.tabs.tabsListElement}constructor(e,t){super(),this.accessor=e,this.group=t,this._hidden=!1,this._direction="horizontal",this._dropIndexResolver=(i,n)=>n,this._pinnedRow=void 0,this.dropdownPart=null,this._overflowTabs=[],this._overflowTabGroups=[],this._overflowPinnedTabs=[],this._dropdownDisposable=new C,this._onDrop=new G,this.onDrop=this._onDrop.event,this._onGroupDragStart=new G,this.onGroupDragStart=this._onGroupDragStart.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._element=document.createElement("div"),this._element.className="dv-tabs-and-actions-container",E(this._element,"dv-full-width-single-tab",this.accessor.options.singleTabMode==="fullwidth"),this.rightActionsContainer=document.createElement("div"),this.rightActionsContainer.className="dv-right-actions-container",this.leftActionsContainer=document.createElement("div"),this.leftActionsContainer.className="dv-left-actions-container",this.preActionsContainer=document.createElement("div"),this.preActionsContainer.className="dv-pre-actions-container",this.tabs=new Sc(t,e,{showTabsOverflowControl:!e.options.disableTabsOverflowList}),this.voidContainer=new vc(this.accessor,this.group),this.tabs.voidContainer=this.voidContainer.element,this._element.appendChild(this.preActionsContainer),this._element.appendChild(this.tabs.element),this._element.appendChild(this.leftActionsContainer),this._element.appendChild(this.voidContainer.element),this._element.appendChild(this.rightActionsContainer),this.tabs.setExtendedDropZone(this._element),this.addDisposables(this.tabs.onDrop(i=>this._onDrop.fire(i)),this.tabs.onWillShowOverlay(i=>this._onWillShowOverlay.fire(i)),e.onDidOptionsChange(()=>{this.tabs.showTabsOverflowControl=!e.options.disableTabsOverflowList}),this.tabs.onOverflowTabsChange(i=>{this.toggleDropdown(i)}),this.tabs,this._onWillShowOverlay,this._onDrop,this._onGroupDragStart,this.voidContainer,this.voidContainer.onDragStart(i=>{this._onGroupDragStart.fire({nativeEvent:i,group:this.group})}),this.voidContainer.onDrop(i=>{this.tabs.handleVoidDrop()||this._onDrop.fire({event:i.nativeEvent,index:this.tabs.size})}),this.voidContainer.onWillShowOverlay(i=>{this._onWillShowOverlay.fire(new Yt(i,{kind:"header_space",panel:this.group.activePanel,api:this.accessor.api,group:this.group,getData:g}))}),O(this.leftActionsContainer,"dragleave",i=>{let n=i.relatedTarget;!this.leftActionsContainer.contains(n)&&!this._element.contains(n)&&this.tabs.clearExternalAnimState()}),O(this.voidContainer.element,"dragleave",i=>{let n=i.relatedTarget;this.voidContainer.element.contains(n)||(this._element.contains(n)?this.tabs.setExternalInsertionIndex(null):this.tabs.clearExternalAnimState())}),O(this.voidContainer.element,"pointerdown",i=>{if(!i.defaultPrevented&&!this.accessor.options.disableFloatingGroups&&i.shiftKey&&this.group.api.location.type!=="floating"&&this.group.api.location.type!=="edge"){i.preventDefault();let{top:n,left:s}=this.element.getBoundingClientRect(),{top:l,left:c}=this.accessor.element.getBoundingClientRect();this.accessor.addFloatingGroup(this.group,{x:s-c+20,y:n-l+20,inDragMode:!0})}}))}show(){this.hidden||(this.element.style.display="")}hide(){this._element.style.display="none"}setRightActionsElement(e){this.rightActions!==e&&(this.rightActions&&(this.rightActions.remove(),this.rightActions=void 0),e&&(this.rightActionsContainer.appendChild(e),this.rightActions=e))}setLeftActionsElement(e){this.leftActions!==e&&(this.leftActions&&(this.leftActions.remove(),this.leftActions=void 0),e&&(this.leftActionsContainer.appendChild(e),this.leftActions=e))}setPrefixActionsElement(e){this.preActions!==e&&(this.preActions&&(this.preActions.remove(),this.preActions=void 0),e&&(this.preActionsContainer.appendChild(e),this.preActions=e))}isActive(e){return this.tabs.isActive(e)}indexOf(e){return this.tabs.indexOf(e)}getTabId(e){return this.tabs.getTabId(e)}getPanelForTab(e){return this.tabs.getPanelForTab(e)}setActive(e){}delete(e){this.tabs.delete(e),this.updateClassnames()}setActivePanel(e){this.tabs.setActivePanel(e)}focusActiveTab(){this.tabs.focusActiveTab()}openPanel(e,t=this.tabs.size){this.tabs.openPanel(e,t),this.updateClassnames()}closePanel(e){this.delete(e.id)}setOverflowExclude(e){this.tabs.setOverflowExclude(e)}setForcedOverflow(e){this.tabs.setForcedOverflow(e)}setPinnedSticky(e){this.tabs.setPinnedSticky(e)}refreshOverflow(){this.tabs.refreshOverflow()}setPinnedRow(e){this._pinnedRow!==e&&(this._pinnedRow&&this._pinnedRow.remove(),this._pinnedRow=e,e&&(e.classList.add("dv-pinned-row"),this._element.insertBefore(e,this._element.firstChild)),E(this._element,"dv-tabs-and-actions-container--pinned-row",!!e))}setDropIndexResolver(e){this._dropIndexResolver=e}resolveDropIndex(e,t){return this._dropIndexResolver(e,t)}updateClassnames(){E(this._element,"dv-single-tab",this.size===1)}toggleDropdown(e){let t=e.reset?[]:e.tabs,i=e.reset?[]:e.tabGroups,n=e.reset?[]:e.pinnedTabs;this._overflowTabs=t,this._overflowTabGroups=i,this._overflowPinnedTabs=n;let s=this._overflowTabs.length+this._overflowPinnedTabs.length;if(s>0&&this.dropdownPart){this.dropdownPart.update({tabs:s});return}if(s===0){this._dropdownDisposable.dispose();return}let l=document.createElement("div");l.className="dv-tabs-overflow-dropdown-root";let c=Cc();c.update({tabs:s}),this.dropdownPart=c,l.appendChild(c.element),this.rightActionsContainer.prepend(l),this._dropdownDisposable.value=new D(w.from(()=>{var p,v;l.remove(),(p=this.dropdownPart)===null||p===void 0||(v=p.dispose)===null||v===void 0||v.call(p),this.dropdownPart=null}),O(l,"pointerdown",p=>{p.preventDefault()},{capture:!0}),O(l,"click",p=>{let v=Ue(l),m={x:p.clientX,y:p.clientY,zIndex:v?.style.zIndex?`calc(${v.style.zIndex} * 2)`:void 0},{context:f,rowRenderers:_}=this.createOverflowRenderContext(l,m),y=this.accessor.advancedOverflowService;try{y?y.renderOverflow({group:this.group,overflowTabs:[...this._overflowTabs],overflowTabGroups:[...this._overflowTabGroups],pinnedOverflowTabs:[...this._overflowPinnedTabs],context:f}):f.open(this.renderFreeOverflowList(f))}catch(x){throw _.dispose(),x}}))}createOverflowRenderContext(e,t){let i=new Set(this._overflowTabGroups),n=this.group.model.getTabGroups(),s=new Map,l=new Map;for(let m of n)if(l.set(m.id,m),i.has(m.id))for(let f of m.panelIds)s.set(f,m);let c=()=>this.accessor.getPopupServiceForGroup(this.group),p=new D,v=m=>{let f=document.createElement("div");f.className="dv-tabs-overflow-group-header";let _=document.createElement("span");_.className="dv-tabs-overflow-group-color",Wi(_,m.color,this.accessor.tabGroupColorPalette),f.appendChild(_);let y=document.createElement("span");if(y.className="dv-tabs-overflow-group-label",y.textContent=m.label||m.id,f.appendChild(y),m.collapsed){let x=document.createElement("span");x.className="dv-tabs-overflow-group-collapsed-badge",x.textContent=`${m.panelIds.length}`,f.appendChild(x)}return f.addEventListener("click",()=>{c().close(),m.collapsed&&m.expand();let x=m.panelIds[0];if(x){let k=this.group.panels.find(S=>S.id===x);this.accessor.withOrigin("user",()=>k?.api.setActive())}}),f};return{context:{overflowGroupIdForPanel:m=>{var f;return(f=s.get(m))===null||f===void 0?void 0:f.id},buildGroupHeader:m=>{let f=l.get(m);if(!(!f||!i.has(f.id)))return v(f)},buildPinnedHeader:()=>{let m=document.createElement("div");m.className="dv-tabs-overflow-group-header dv-tabs-overflow-pinned-header";let f=co();f.classList.add("dv-tabs-overflow-pinned-icon"),m.appendChild(f);let _=document.createElement("span");return _.className="dv-tabs-overflow-group-label",_.textContent="Pinned",m.appendChild(_),m},buildRow:m=>{let f=this.group.panels.find(A=>A.id===m);if(!f)return;let _=this.tabs.tabs.find(A=>A.panel.id===m),y=s.get(m),x=f.view.createTabRenderer("headerOverflow"),k=!1,S=w.from(()=>{if(!k){var A;k=!0,(A=x.dispose)===null||A===void 0||A.call(x)}});p.isDisposed?S.dispose():p.addDisposables(S);let z=x.element,M=document.createElement("div");E(M,"dv-tab",!0),E(M,"dv-active-tab",f.api.isActive),E(M,"dv-inactive-tab",!f.api.isActive),y&&E(M,"dv-tab--grouped",!0);let I=()=>{y?.collapsed&&y.expand(),_?.element.scrollIntoView({block:"nearest",inline:"nearest"}),this.accessor.withOrigin("user",()=>f.api.setActive())};return M.addEventListener("click",A=>{c().close(),!A.defaultPrevented&&I()}),M.appendChild(z),{element:M,panel:f,activate:()=>{c().close(),I()},dispose:()=>{p.removeDisposable(S),S.dispose()}}},open:m=>{c().openPopover(m,t,{onClose:()=>p.dispose()})},close:()=>c().close(),focusTrigger:()=>{e.tabIndex=-1,e.focus()}},rowRenderers:p}}renderFreeOverflowList(e){let t=document.createElement("div");t.style.overflow="auto",t.className="dv-tabs-overflow-container";let i=this._overflowPinnedTabs.map(s=>e.buildRow(s)).filter(s=>s!=null);if(i.length>0){t.appendChild(e.buildPinnedHeader());for(let s of i)t.appendChild(s.element)}let n=new Set;for(let s of this.tabs.tabs.filter(l=>this._overflowTabs.includes(l.panel.id))){let l=e.overflowGroupIdForPanel(s.panel.id);if(l&&!n.has(l)){n.add(l);let p=e.buildGroupHeader(l);p&&t.appendChild(p)}let c=e.buildRow(s.panel.id);c&&t.appendChild(c.element)}return t}updateDragAndDropState(){this.tabs.updateDragAndDropState(),this.voidContainer.updateDragAndDropState()}updateTabGroups(){this.tabs.updateTabGroups()}refreshTabGroupAccent(){this.tabs.refreshTabGroupAccent()}},Pc=class extends D{get label(){return this._label}get color(){return this._color}get componentParams(){return this._componentParams}setLabel(e){this.isDisposed||this._label===e||(this._label=e,this._onDidChange.fire())}setColor(e){if(this.isDisposed)return;let t=e===""?void 0:e;this._color!==t&&(this._color=t,this._onDidChange.fire())}setComponentParams(e){this.isDisposed||(this._componentParams=e,this._onDidChange.fire())}get collapsed(){return this._collapsed}get panelIds(){return this._panelIds}get size(){return this._panelIds.length}get isEmpty(){return this._panelIds.length===0}constructor(e,t){var i,n;super(),this.id=e,this._collapsed=!1,this._panelIds=[],this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._onDidPanelChange=new G,this.onDidPanelChange=this._onDidPanelChange.event,this._onDidCollapseChange=new G,this.onDidCollapseChange=this._onDidCollapseChange.event,this._onDidDestroy=new G,this.onDidDestroy=this._onDidDestroy.event,this._label=(i=t?.label)!==null&&i!==void 0?i:"",this._color=t?.color===""?void 0:t?.color,this._collapsed=(n=t?.collapsed)!==null&&n!==void 0?n:!1,this._componentParams=t?.componentParams,this.addDisposables(this._onDidChange,this._onDidPanelChange,this._onDidCollapseChange,this._onDidDestroy)}addPanel(e,t){if(this.isDisposed||this._panelIds.includes(e))return;let i=t===void 0?this._panelIds.length:Math.max(0,Math.min(t,this._panelIds.length));this._panelIds.splice(i,0,e),this._onDidPanelChange.fire({panelId:e,type:"add"})}removePanel(e){if(this.isDisposed)return!1;let t=this._panelIds.indexOf(e);return t===-1?!1:(this._panelIds.splice(t,1),this._onDidPanelChange.fire({panelId:e,type:"remove"}),!0)}indexOfPanel(e){return this._panelIds.indexOf(e)}containsPanel(e){return this._panelIds.includes(e)}collapse(){this.isDisposed||this._collapsed||(this._collapsed=!0,this._onDidCollapseChange.fire(!0))}expand(){this.isDisposed||!this._collapsed||(this._collapsed=!1,this._onDidCollapseChange.fire(!1))}toggle(){this._collapsed?this.expand():this.collapse()}toJSON(){let e={id:this.id,collapsed:this._collapsed,panelIds:[...this._panelIds]};return this._label&&(e.label=this._label),this._color!==void 0&&(e.color=this._color),this._componentParams!==void 0&&(e.componentParams=this._componentParams),e}dispose(){this._onDidDestroy.fire(),super.dispose()}},Fi=class extends T{get nativeEvent(){return this.options.nativeEvent}get position(){return this.options.position}get panel(){return this.options.panel}get group(){return this.options.group}get api(){return this.options.api}constructor(e){super(),this.options=e}getData(){return this.options.getData()}},mo=class extends Fi{get kind(){return this._kind}constructor(e){super(e),this._kind=e.kind}},ds=class extends D{get tabGroups(){return this._tabGroups}get element(){throw new Error("dockview: not supported")}get activePanel(){return this._activePanel}get contentContainerId(){return this.contentContainer.element.id}get contentDropTarget(){return this.contentContainer.dropTarget}get locked(){return this._locked}set locked(e){this._locked=e,E(this.container,"dv-locked-groupview",e==="no-drop-target"||e)}get isActive(){return this._isGroupActive}get panels(){return this._panels}get size(){return this._panels.length}get isEmpty(){return this._panels.length===0}get hasWatermark(){return!!(this.watermark&&this.container.contains(this.watermark.element))}get header(){return this.tabsContainer}get tabsListElement(){return this.tabsContainer.tabsListElement}getPanelForTab(e){return this.tabsContainer.getPanelForTab(e)}get isContentFocused(){let e=this.contentContainer.element,t=Ai(e);return t?xe(t,e):!1}get headerPosition(){var e;return(e=this._headerPosition)!==null&&e!==void 0?e:"top"}set headerPosition(e){this._headerPosition=e,this.invalidateHeaderSize(),L(this.container,"dv-groupview-header-top","dv-groupview-header-bottom","dv-groupview-header-left","dv-groupview-header-right"),F(this.container,`dv-groupview-header-${e}`);let t=e==="top"||e==="bottom"?"horizontal":"vertical",i=this._headerDirection;if(this._headerDirection=t,this.tabsContainer.direction=t,this.header.direction=t,this.panels.length>0&&this.layoutContent(),this.updateHeaderActions(),i!==void 0&&i!==t){var n;(n=this.groupPanel)===null||n===void 0||n.api._onDidHeaderDirectionChange.fire({direction:t,position:e})}}get location(){return this._location}set location(e){this._location=e,E(this.container,"dv-groupview-floating",!1),E(this.container,"dv-groupview-popout",!1),E(this.container,"dv-groupview-edge",!1);let t=i=>{this.contentContainer.dropTarget.setTargetZones(i),this.contentContainer.pointerDropTarget.setTargetZones(i)};switch(e.type){case"grid":t(["top","bottom","left","right","center"]);break;case"floating":t(["top","bottom","left","right","center"]),E(this.container,"dv-groupview-floating",!0);break;case"popout":t(["top","bottom","left","right","center"]),E(this.container,"dv-groupview-popout",!0);break;case"edge":t(["center"]),E(this.container,"dv-groupview-edge",!0);break}this.groupPanel.api._onDidLocationChange.fire({location:this.location})}constructor(e,t,i,n,s){var l,c;super(),this.container=e,this.accessor=t,this.id=i,this.options=n,this.groupPanel=s,this._isGroupActive=!1,this._locked=!1,this._location={type:"grid"},this.mostRecentlyUsed=[],this._overwriteRenderContainer=null,this._overwriteDropTargetContainer=null,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._width=0,this._height=0,this._panels=[],this._panelDisposables=new Map,this._tabGroupDisposables=new Map,this._pendingMicrotaskDisposables=new Set,this._onMove=new G,this.onMove=this._onMove.event,this._onDidDrop=new G,this.onDidDrop=this._onDidDrop.event,this._onWillDrop=new G,this.onWillDrop=this._onWillDrop.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._onTabDragStart=new G,this.onTabDragStart=this._onTabDragStart.event,this._onGroupDragStart=new G,this.onGroupDragStart=this._onGroupDragStart.event,this._onDidAddPanel=new G,this.onDidAddPanel=this._onDidAddPanel.event,this._onDidPanelTitleChange=new G,this.onDidPanelTitleChange=this._onDidPanelTitleChange.event,this._onDidPanelParametersChange=new G,this.onDidPanelParametersChange=this._onDidPanelParametersChange.event,this._onDidRemovePanel=new G,this.onDidRemovePanel=this._onDidRemovePanel.event,this._onDidActivePanelChange=new G,this.onDidActivePanelChange=this._onDidActivePanelChange.event,this._onUnhandledDragOver=new G,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this._tabGroups=[],this._tabGroupMap=new Map,this._panelToTabGroup=new Map,this._tabGroupIdCounter=0,this._pendingTabGroupUpdate=!1,this._onDidCreateTabGroup=new G,this.onDidCreateTabGroup=this._onDidCreateTabGroup.event,this._onDidDestroyTabGroup=new G,this.onDidDestroyTabGroup=this._onDidDestroyTabGroup.event,this._onDidAddPanelToTabGroup=new G,this.onDidAddPanelToTabGroup=this._onDidAddPanelToTabGroup.event,this._onDidRemovePanelFromTabGroup=new G,this.onDidRemovePanelFromTabGroup=this._onDidRemovePanelFromTabGroup.event,this._onDidTabGroupChange=new G,this.onDidTabGroupChange=this._onDidTabGroupChange.event,this._onDidTabGroupCollapsedChange=new G,this.onDidTabGroupCollapsedChange=this._onDidTabGroupCollapsedChange.event,E(this.container,"dv-groupview",!0),this.container.setAttribute("role","region"),this._api=new Oi(this.accessor),this.tabsContainer=new Gc(this.accessor,this.groupPanel),this.contentContainer=new Yr(this.accessor,this),e.append(this.tabsContainer.element,this.contentContainer.element),this.header.hidden=!!n.hideHeader,this.locked=(l=n.locked)!==null&&l!==void 0?l:!1,this.headerPosition=(c=n.headerPosition)!==null&&c!==void 0?c:t.defaultHeaderPosition,this.addDisposables(B(this.tabsContainer.element,()=>{if(this.isDisposed)return;let p=this.measureHeaderSize();p!==this._cachedHeaderSize&&(this._cachedHeaderSize=p,this.layout(this._width,this._height))}),this._onDidPanelTitleChange.event(()=>this.updateAccessibleLabel()),this._onTabDragStart,this._onGroupDragStart,this._onWillShowOverlay,this.tabsContainer.onTabDragStart(p=>{this._onTabDragStart.fire(p)}),this.tabsContainer.onGroupDragStart(p=>{this._onGroupDragStart.fire(p)}),this.tabsContainer.onDrop(p=>{var v;let m=g(),f=(v=m?.panelId)!==null&&v!==void 0?v:null,_=f?this.tabsContainer.resolveDropIndex(f,p.index):p.index;if(this.handleDropEvent("header",p.event,"center",_),f&&p.targetTabGroupId){let y=this._tabGroupMap.get(p.targetTabGroupId),x;if(y){let k=this._panels.findIndex(S=>S.id===f);if(k!==-1){x=0;for(let S of y.panelIds)this._panels.findIndex(z=>z.id===S)<k&&x++}}this.addPanelToTabGroup(p.targetTabGroupId,f,x)}else f&&p.targetTabGroupId===null&&this.removePanelFromTabGroup(f)}),this.contentContainer.onDidFocus(()=>{this.accessor.doSetGroupActive(this.groupPanel)}),this.contentContainer.onDidBlur(()=>{}),this.contentContainer.dropTarget.onDrop(p=>{this.handleDropEvent("content",p.nativeEvent,p.position,void 0,p.edge)}),this.contentContainer.pointerDropTarget.onDrop(p=>{this.handleDropEvent("content",p.nativeEvent,p.position,void 0,p.edge)}),this.tabsContainer.onWillShowOverlay(p=>{this._onWillShowOverlay.fire(p)}),this.contentContainer.dropTarget.onWillShowOverlay(p=>{this._onWillShowOverlay.fire(new Yt(p,{kind:"content",panel:this.activePanel,api:this._api,group:this.groupPanel,getData:g}))}),this.contentContainer.pointerDropTarget.onWillShowOverlay(p=>{this._onWillShowOverlay.fire(new Yt(p,{kind:"content",panel:this.activePanel,api:this._api,group:this.groupPanel,getData:g}))}),this._onMove,this._onDidChange,this._onDidDrop,this._onWillDrop,this._onDidAddPanel,this._onDidRemovePanel,this._onDidActivePanelChange,this._onUnhandledDragOver,this._onDidPanelTitleChange,this._onDidPanelParametersChange,this._onDidCreateTabGroup,this._onDidDestroyTabGroup,this._onDidAddPanelToTabGroup,this._onDidRemovePanelFromTabGroup,this._onDidTabGroupChange,this._onDidTabGroupCollapsedChange,this._onDidCreateTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidDestroyTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidAddPanelToTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidRemovePanelFromTabGroup.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidTabGroupChange.event(()=>{this._scheduleTabGroupUpdate()}),this._onDidTabGroupCollapsedChange.event(()=>{this._scheduleTabGroupUpdate()}))}_scheduleTabGroupUpdate(){this._pendingTabGroupUpdate||(this._pendingTabGroupUpdate=!0,queueMicrotask(()=>{this._pendingTabGroupUpdate=!1,this.isDisposed||this.tabsContainer.updateTabGroups()}))}_bracketTabGroupMutation(e){return this.accessor.mutation?this.accessor.mutation("tab-group",e):e()}createTabGroup(e){return this._bracketTabGroupMutation(()=>this._doCreateTabGroup(e))}_doCreateTabGroup(e){var t;let i=(t=e?.id)!==null&&t!==void 0?t:`tg-${this.id}-${this._tabGroupIdCounter++}`,n=new Pc(i,{label:e?.label,color:e?.color,collapsed:e?.collapsed,componentParams:e?.componentParams});return this._tabGroups.push(n),this._tabGroupMap.set(i,n),this._tabGroupDisposables.set(i,new D(n.onDidChange(()=>{this._onDidTabGroupChange.fire({tabGroup:n})}),n.onDidCollapseChange(s=>{s?this._handleGroupCollapse(n):this._handleGroupExpand(n),this._onDidTabGroupCollapsedChange.fire({tabGroup:n})}),n.onDidDestroy(()=>{this._removeTabGroupInternal(n)}))),this._onDidCreateTabGroup.fire({tabGroup:n}),n}dissolveTabGroup(e){let t=this._tabGroupMap.get(e);t&&this._bracketTabGroupMutation(()=>{let i=[...t.panelIds];for(let n of i)t.removePanel(n),this._panelToTabGroup.delete(n),this._onDidRemovePanelFromTabGroup.fire({tabGroup:t,panelId:n});t.dispose()})}addPanelToTabGroup(e,t,i){let n=this._tabGroupMap.get(e);if(!n||!this._panels.some(l=>l.id===t))return;let s=this.getTabGroupForPanel(t);s?.id!==e&&this._bracketTabGroupMutation(()=>{s&&this.removePanelFromTabGroup(t),n.addPanel(t,i),this._panelToTabGroup.set(t,n),this._enforceContiguity(n,t),this._onDidAddPanelToTabGroup.fire({tabGroup:n,panelId:t})})}movePanelWithinGroup(e,t,i){let n=this._tabGroupMap.get(e);n?.containsPanel(t)&&(n.removePanel(t),n.addPanel(t,i),this._enforceContiguity(n,t),this.tabsContainer.updateTabGroups())}movePanelBetweenGroups(e,t,i){let n=this._findTabGroupForPanel(e),s=this._tabGroupMap.get(t);s&&(n&&(n.removePanel(e),this._panelToTabGroup.delete(e),this._onDidRemovePanelFromTabGroup.fire({tabGroup:n,panelId:e}),n.isEmpty&&n.dispose()),s.addPanel(e,i),this._panelToTabGroup.set(e,s),this._enforceContiguity(s,e),this._onDidAddPanelToTabGroup.fire({tabGroup:s,panelId:e}))}moveTabGroup(e,t){let i=this._tabGroupMap.get(e);if(!i||i.panelIds.length===0)return;let n=new Set(i.panelIds),s=i.panelIds.map(v=>this._panels.find(m=>m.id===v)).filter(v=>v!==void 0);if(s.length===0)return;let l=0;for(let v=0;v<Math.min(t,this._panels.length);v++)n.has(this._panels[v].id)&&l++;for(let v of s){let m=this._panels.indexOf(v);m!==-1&&this._panels.splice(m,1)}let c=t-l,p=Math.max(0,Math.min(c,this._panels.length));this._panels.splice(p,0,...s);for(let v of this._panels)this.tabsContainer.delete(v.id);for(let v=0;v<this._panels.length;v++)this.tabsContainer.openPanel(this._panels[v],v);this.tabsContainer.updateTabGroups()}_enforceContiguity(e,t){let i=this._panels.find(p=>p.id===t);if(!i)return;let n=e.indexOfPanel(t),s=this._computeGlobalIndex(e,n),l=this._panels.indexOf(i);if(l===s)return;this._panels.splice(l,1);let c=s>l?s-1:s;this._panels.splice(c,0,i),this.tabsContainer.delete(t),this.tabsContainer.openPanel(i,c)}_computeGlobalIndex(e,t){let i=e.panelIds;if(i.length<=1){let n=this._panels.find(s=>s.id===i[0]);return n?this._panels.indexOf(n):this._panels.length}for(let n=0;n<i.length;n++){if(n===t)continue;let s=this._panels.find(l=>l.id===i[n]);if(s){let l=this._panels.indexOf(s);return Math.max(0,l+(t-n))}}return this._panels.length}removePanelFromTabGroup(e){let t=this._findTabGroupForPanel(e);t&&this._bracketTabGroupMutation(()=>{t.removePanel(e),this._panelToTabGroup.delete(e),this._onDidRemovePanelFromTabGroup.fire({tabGroup:t,panelId:e}),t.isEmpty&&t.dispose()})}getTabGroups(){return this._tabGroups}updateTabGroups(){this.tabsContainer.updateTabGroups()}refreshTabGroupAccent(){this.tabsContainer.refreshTabGroupAccent()}refreshWatermark(){if(this.watermark){var e,t;this.watermark.element.remove(),(e=(t=this.watermark).dispose)===null||e===void 0||e.call(t),this.watermark=void 0}this.updateContainer()}getTabGroupForPanel(e){return this._findTabGroupForPanel(e)}_findTabGroupForPanel(e){return this._panelToTabGroup.get(e)}_removeTabGroupInternal(e){let t=this._tabGroups.indexOf(e);if(t!==-1){this._tabGroups.splice(t,1),this._tabGroupMap.delete(e.id);for(let n of e.panelIds)this._panelToTabGroup.delete(n);this._onDidDestroyTabGroup.fire({tabGroup:e});let i=this._tabGroupDisposables.get(e.id);this._tabGroupDisposables.delete(e.id),i&&(this._pendingMicrotaskDisposables.add(i),queueMicrotask(()=>{this._pendingMicrotaskDisposables.delete(i),i.dispose()}))}}_handleGroupCollapse(e){if(!this._activePanel||!e.containsPanel(this._activePanel.id))return;let t=this._panels.indexOf(this._activePanel);for(let i=t+1;i<this._panels.length;i++){let n=this._panels[i],s=this._findTabGroupForPanel(n.id);if(!s?.collapsed){this.doSetActivePanel(n),this.updateContainer();return}}for(let i=t-1;i>=0;i--){let n=this._panels[i],s=this._findTabGroupForPanel(n.id);if(!s?.collapsed){this.doSetActivePanel(n),this.updateContainer();return}}this.contentContainer.closePanel(),this.doSetActivePanel(void 0),this.updateContainer()}_handleGroupExpand(e){if(this._activePanel)return;let t=e.panelIds[0];if(t){let i=this._panels.find(n=>n.id===t);i&&(this.doSetActivePanel(i),this.updateContainer())}}restoreTabGroups(e){for(let t of e){let i=/-(\d+)$/.exec(t.id);if(i){let n=Number.parseInt(i[1],10)+1;n>this._tabGroupIdCounter&&(this._tabGroupIdCounter=n)}}for(let t of e){let i=this.createTabGroup({id:t.id,label:t.label,color:t.color,componentParams:t.componentParams}),n=this._tabGroupMap.get(i.id);for(let s of t.panelIds)this._panels.some(l=>l.id===s)&&(i.addPanel(s),this._panelToTabGroup.set(s,n),this._enforceContiguity(n,s));t.collapsed&&i.collapse(),i.isEmpty&&i.dispose()}}focusContent(){this.contentContainer.element.focus()}focusActiveTab(){this.tabsContainer.focusActiveTab()}set renderContainer(e){this.panels.forEach(t=>{this.renderContainer.detatch(t)}),this._overwriteRenderContainer=e,this.panels.forEach(t=>{this.rerender(t)}),this.panels.length>0&&this.layoutContent()}get renderContainer(){var e;return(e=this._overwriteRenderContainer)!==null&&e!==void 0?e:this.accessor.overlayRenderContainer}set dropTargetContainer(e){this._overwriteDropTargetContainer=e}get dropTargetContainer(){var e;return this._location.type==="floating"&&this.accessor.rootDropTargetContainer.disabled?this.accessor.floatingDropTargetContainer:(e=this._overwriteDropTargetContainer)!==null&&e!==void 0?e:this.accessor.rootDropTargetContainer}initialize(){this.options.panels&&this.options.panels.forEach(e=>{this.doAddPanel(e)}),this.options.activePanel&&this.openPanel(this.options.activePanel),this.setActive(this.isActive,!0),this.updateContainer(),this.updateHeaderActions()}updateHeaderActions(){var e;(e=this.accessor.headerActionsService)===null||e===void 0||e.refresh(this.groupPanel)}attachHeaderAction(e,t){switch(e){case"left":this.tabsContainer.setLeftActionsElement(t);break;case"right":this.tabsContainer.setRightActionsElement(t);break;case"prefix":this.tabsContainer.setPrefixActionsElement(t);break}}rerender(e){this.contentContainer.renderPanel(e,{asActive:!1})}indexOf(e){return this.tabsContainer.indexOf(e.id)}toJSON(){var e;let t={views:this.tabsContainer.panels,activeView:(e=this._activePanel)===null||e===void 0?void 0:e.id,id:this.id};return this.locked!==!1&&(t.locked=this.locked),this.header.hidden&&(t.hideHeader=!0),this.headerPosition!=="top"&&(t.headerPosition=this.headerPosition),this._tabGroups.length>0&&(t.tabGroups=this._tabGroups.map(i=>i.toJSON())),t}moveToNext(e){var t,i,n;(t=e)!==null&&t!==void 0||(e={}),(n=(i=e).panel)!==null&&n!==void 0||(i.panel=this.activePanel);let s=e.panel?this.panels.indexOf(e.panel):-1,l;if(s<this.panels.length-1)l=s+1;else{if(e.suppressRoll)return;l=0}this.openPanel(this.panels[l])}moveToPrevious(e){var t,i,n;if((t=e)!==null&&t!==void 0||(e={}),(n=(i=e).panel)!==null&&n!==void 0||(i.panel=this.activePanel),!e.panel)return;let s=this.panels.indexOf(e.panel),l;if(s>0)l=s-1;else{if(e.suppressRoll)return;l=this.panels.length-1}this.openPanel(this.panels[l])}containsPanel(e){return this.panels.includes(e)}init(e){}update(e){}focus(){var e;(e=this._activePanel)===null||e===void 0||e.focus()}openPanel(e,t={}){(typeof t.index!="number"||t.index>this.panels.length)&&(t.index=this.panels.length);let i=!!t.skipSetActive;if(e.updateParentGroup(this.groupPanel,{skipSetActive:t.skipSetActive}),this.doAddPanel(e,t.index,{skipSetActive:i}),this.invalidateHeaderSize(),this._activePanel===e){this.contentContainer.renderPanel(e,{asActive:!0});return}i||this.doSetActivePanel(e),t.skipSetGroupActive||this.accessor.doSetGroupActive(this.groupPanel),t.skipSetActive||this.updateContainer()}removePanel(e,t){let i=typeof e=="string"?e:e.id,n=this._panels.find(s=>s.id===i);if(!n)throw new Error("invalid operation");return this._removePanel(n,t)}closeAllPanels(){if(this.panels.length>0){let e=[...this.panels];for(let t of e)this.doClose(t)}else this.accessor.removeGroup(this.groupPanel)}closePanel(e){this.doClose(e)}doClose(e){let t=this.panels.length===1&&this.accessor.groups.length===1;this.accessor.removePanel(e,t&&this.accessor.options.noPanelsOverlay==="emptyGroup"?{removeEmptyGroup:!1}:void 0)}isPanelActive(e){return this._activePanel===e}updateActions(e){this.tabsContainer.setRightActionsElement(e)}setActive(e,t=!1){if(!this.isDisposed&&!(!t&&this.isActive===e)){if(this._isGroupActive=e,E(this.container,"dv-active-group",e),E(this.container,"dv-inactive-group",!e),this.tabsContainer.setActive(this.isActive),!this._activePanel&&this.panels.length>0){let i=this._panels.find(n=>{let s=this._findTabGroupForPanel(n.id);return!s?.collapsed});i&&this.doSetActivePanel(i)}this.updateContainer()}}layout(e,t){this._width=e,this._height=t,this.layoutContent()}layoutContent(){var e;let{width:t,height:i}=this.contentDimensions();this.contentContainer.layout(t,i),!((e=this._activePanel)===null||e===void 0)&&e.layout&&this._activePanel.layout(t,i)}relayout(){this.invalidateHeaderSize(),this.layout(this._width,this._height)}measureHeaderSize(){let e=this.tabsContainer.element;return this.headerPosition==="top"||this.headerPosition==="bottom"?e.offsetHeight:e.offsetWidth}invalidateHeaderSize(){this._cachedHeaderSize=void 0}contentDimensions(){var e;let t=this.headerPosition==="top"||this.headerPosition==="bottom",i=(e=this._cachedHeaderSize)!==null&&e!==void 0?e:this._cachedHeaderSize=this.measureHeaderSize();return{width:t?this._width:Math.max(0,this._width-i),height:t?Math.max(0,this._height-i):this._height}}_removePanel(e,t){let i=this._activePanel===e;if(this.doRemovePanel(e),this.invalidateHeaderSize(),i&&this.panels.length>0){let n=this.mostRecentlyUsed[0];this.openPanel(n,{skipSetActive:t?.skipSetActive,skipSetGroupActive:t?.skipSetActiveGroup})}return this._activePanel&&this.panels.length===0&&this.doSetActivePanel(void 0),t?.skipSetActive||this.updateContainer(),e}doRemovePanel(e){let t=this.panels.indexOf(e);if(this._activePanel===e&&this.contentContainer.closePanel(),this.tabsContainer.delete(e.id),this._panels.splice(t,1),this.mostRecentlyUsed.includes(e)){let n=this.mostRecentlyUsed.indexOf(e);this.mostRecentlyUsed.splice(n,1)}let i=this._panelDisposables.get(e.id);i&&(i.dispose(),this._panelDisposables.delete(e.id)),this.removePanelFromTabGroup(e.id),this._onDidRemovePanel.fire({panel:e})}doAddPanel(e,t=this.panels.length,i){let n=this._panels.indexOf(e)>-1;this.tabsContainer.show(),this.contentContainer.show(),this.tabsContainer.openPanel(e,t),i?.skipSetActive?e.api.renderer==="always"&&this.contentContainer.renderPanel(e,{asActive:!1}):this.contentContainer.openPanel(e),!n&&(this.updateMru(e),this.panels.splice(t,0,e),this._panelDisposables.set(e.id,new D(e.api.onDidTitleChange(s=>this._onDidPanelTitleChange.fire(s)),e.api.onDidParametersChange(s=>this._onDidPanelParametersChange.fire(s)))),this._onDidAddPanel.fire({panel:e}))}doSetActivePanel(e){if(this._activePanel!==e){if(this._activePanel=e,e){var t,i,n;this.tabsContainer.setActivePanel(e),this.contentContainer.setLabelledBy(this.tabsContainer.getTabId(e.id)),this.contentContainer.openPanel(e),this.layoutContent(),this.updateMru(e),this.contentContainer.refreshFocusState(),this._onDidActivePanelChange.fire({panel:e,origin:(t=(i=(n=this.accessor).currentOrigin)===null||i===void 0?void 0:i.call(n))!==null&&t!==void 0?t:"user"})}this.updateAccessibleLabel()}}updateAccessibleLabel(){var e;let t=(e=this._activePanel)===null||e===void 0?void 0:e.title;t?this.container.setAttribute("aria-label",t):this.container.removeAttribute("aria-label")}updateMru(e){this.mostRecentlyUsed.includes(e)&&this.mostRecentlyUsed.splice(this.mostRecentlyUsed.indexOf(e),1),this.mostRecentlyUsed=[e,...this.mostRecentlyUsed]}updateContainer(){this.panels.forEach(n=>n.runEvents());let e=this.isEmpty||!this._activePanel;if(e&&!this.watermark){let n=this.accessor.createWatermarkComponent();n.init({containerApi:this._api,group:this.groupPanel}),this.watermark=n,O(this.watermark.element,"pointerdown",()=>{this.isActive||this.accessor.doSetGroupActive(this.groupPanel)}),this.contentContainer.element.appendChild(this.watermark.element)}if(!e&&this.watermark){var t,i;this.watermark.element.remove(),(t=(i=this.watermark).dispose)===null||t===void 0||t.call(i),this.watermark=void 0}}canDisplayOverlay(e,t,i){let n=new po(e,i,t,g,this.accessor.getPanel(this.id));return this._onUnhandledDragOver.fire(n),n.isAccepted}canDisplayContentOverlay(e,t){if(this.locked==="no-drop-target"||this.locked&&t==="center")return!1;let i=g();return!i&&e.shiftKey&&this.location.type!=="floating"?!1:i?.viewId===this.accessor.id?!0:this.canDisplayOverlay(e,t,"content")}handleDropEvent(e,t,i,n,s){if(this.locked==="no-drop-target")return;if(e==="content"&&s){this.accessor.dockToLayoutEdge(t,i);return}function l(){switch(e){case"header":return typeof n=="number"?"tab":"header_space";case"content":return"content"}}let c=typeof n=="number"?this.panels[n]:void 0,p=new mo({nativeEvent:t,position:i,panel:c,getData:()=>g(),kind:l(),group:this.groupPanel,api:this._api});if(this._onWillDrop.fire(p),p.defaultPrevented)return;let v=g();if(v?.viewId===this.accessor.id){if(e==="content"&&v.groupId===this.id&&(i==="center"||v.panelId===null&&!v.tabGroupId)||e==="header"&&v.groupId===this.id&&v.panelId===null&&!v.tabGroupId)return;if(v.panelId===null){let{groupId:_}=v;this._onMove.fire({target:i,groupId:_,index:n,tabGroupId:v.tabGroupId});return}if(this.tabsContainer.indexOf(v.panelId)!==-1&&this.tabsContainer.size===1&&this.accessor.options.closeEmptyGroups!==!1)return;let{groupId:m,panelId:f}=v;if(this.id===m&&!i&&this.tabsContainer.indexOf(f)===n)return;this._onMove.fire({target:i,groupId:v.groupId,itemId:v.panelId,index:n})}else this._onDidDrop.fire(new Fi({nativeEvent:t,position:i,panel:c,getData:()=>g(),group:this.groupPanel,api:this._api}))}updateDragAndDropState(){this.tabsContainer.updateDragAndDropState()}dispose(){var e,t,i;super.dispose(),(e=this.watermark)===null||e===void 0||e.element.remove(),(t=this.watermark)===null||t===void 0||(i=t.dispose)===null||i===void 0||i.call(t),this.watermark=void 0;for(let n of[...this._tabGroups])n.dispose();for(let n of this._tabGroupDisposables.values())n.dispose();this._tabGroupDisposables.clear();for(let n of this._pendingMicrotaskDisposables)n.dispose();this._pendingMicrotaskDisposables.clear();for(let n of this.panels)n.dispose();this.tabsContainer.dispose(),this.contentContainer.dispose()}},fo=class extends Hr{constructor(e,t,i){super(e,t),this._onDidConstraintsChangeInternal=new G,this.onDidConstraintsChangeInternal=this._onDidConstraintsChangeInternal.event,this._onDidConstraintsChange=new G,this.onDidConstraintsChange=this._onDidConstraintsChange.event,this._onDidSizeChange=new G,this.onDidSizeChange=this._onDidSizeChange.event,this.addDisposables(this._onDidConstraintsChangeInternal,this._onDidConstraintsChange,this._onDidSizeChange),i&&this.initialize(i)}setConstraints(e){this._onDidConstraintsChangeInternal.fire(e)}setSize(e){this._onDidSizeChange.fire(e)}},ls=class extends lo{get priority(){return this._priority}get snap(){return this._snap}get minimumWidth(){return this.__minimumWidth()}get minimumHeight(){return this.__minimumHeight()}get maximumHeight(){return this.__maximumHeight()}get maximumWidth(){return this.__maximumWidth()}__minimumWidth(){let e=typeof this._minimumWidth=="function"?this._minimumWidth():this._minimumWidth;return e!==this._evaluatedMinimumWidth&&(this._evaluatedMinimumWidth=e,this.updateConstraints()),e}__maximumWidth(){let e=typeof this._maximumWidth=="function"?this._maximumWidth():this._maximumWidth;return e!==this._evaluatedMaximumWidth&&(this._evaluatedMaximumWidth=e,this.updateConstraints()),e}__minimumHeight(){let e=typeof this._minimumHeight=="function"?this._minimumHeight():this._minimumHeight;return e!==this._evaluatedMinimumHeight&&(this._evaluatedMinimumHeight=e,this.updateConstraints()),e}__maximumHeight(){let e=typeof this._maximumHeight=="function"?this._maximumHeight():this._maximumHeight;return e!==this._evaluatedMaximumHeight&&(this._evaluatedMaximumHeight=e,this.updateConstraints()),e}get isActive(){return this.api.isActive}get isVisible(){return this.api.isVisible}constructor(e,t,i,n){super(e,t,n??new fo(e,t)),this._evaluatedMinimumWidth=0,this._evaluatedMaximumWidth=Number.MAX_SAFE_INTEGER,this._evaluatedMinimumHeight=0,this._evaluatedMaximumHeight=Number.MAX_SAFE_INTEGER,this._minimumWidth=0,this._minimumHeight=0,this._maximumWidth=Number.MAX_SAFE_INTEGER,this._maximumHeight=Number.MAX_SAFE_INTEGER,this._snap=!1,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,typeof i?.minimumWidth=="number"&&(this._minimumWidth=i.minimumWidth),typeof i?.maximumWidth=="number"&&(this._maximumWidth=i.maximumWidth),typeof i?.minimumHeight=="number"&&(this._minimumHeight=i.minimumHeight),typeof i?.maximumHeight=="number"&&(this._maximumHeight=i.maximumHeight),this.api.initialize(this),this.addDisposables(this.api.onWillVisibilityChange(s=>{let{isVisible:l}=s,{accessor:c}=this._params;c.setVisible(this,l)}),this.api.onActiveChange(()=>{let{accessor:s}=this._params;s.doSetGroupActive(this)}),this.api.onDidConstraintsChangeInternal(s=>{(typeof s.minimumWidth=="number"||typeof s.minimumWidth=="function")&&(this._minimumWidth=s.minimumWidth),(typeof s.minimumHeight=="number"||typeof s.minimumHeight=="function")&&(this._minimumHeight=s.minimumHeight),(typeof s.maximumWidth=="number"||typeof s.maximumWidth=="function")&&(this._maximumWidth=s.maximumWidth),(typeof s.maximumHeight=="number"||typeof s.maximumHeight=="function")&&(this._maximumHeight=s.maximumHeight),this._onDidChange.fire(void 0)}),this.api.onDidSizeChange(s=>{this._onDidChange.fire({height:s.height,width:s.width})}),this._onDidChange)}setVisible(e){this.api._onDidVisibilityChange.fire({isVisible:e})}setActive(e){this.api._onDidActiveChange.fire({isActive:e})}init(e){e.maximumHeight&&(this._maximumHeight=e.maximumHeight),e.minimumHeight&&(this._minimumHeight=e.minimumHeight),e.maximumWidth&&(this._maximumWidth=e.maximumWidth),e.minimumWidth&&(this._minimumWidth=e.minimumWidth),this._priority=e.priority,this._snap=!!e.snap,super.init(e),typeof e.isVisible=="boolean"&&this.setVisible(e.isVisible)}updateConstraints(){this.api._onDidConstraintsChange.fire({minimumWidth:this._evaluatedMinimumWidth,maximumWidth:this._evaluatedMaximumWidth,minimumHeight:this._evaluatedMinimumHeight,maximumHeight:this._evaluatedMaximumHeight})}toJSON(){let e=super.toJSON(),t=n=>n===Number.MAX_SAFE_INTEGER?void 0:n,i=n=>n<=0?void 0:n;return J(J({},e),{},{minimumHeight:i(this.minimumHeight),maximumHeight:t(this.maximumHeight),minimumWidth:i(this.minimumWidth),maximumWidth:t(this.maximumWidth),snap:this.snap,priority:this.priority})}};let gt="dockview: DockviewGroupPanelApiImpl not initialized";var zc=class extends fo{get location(){if(!this._group)throw new Error(gt);return this._group.model.location}get boundingBox(){if(!this._group||this._group.model.location.type==="popout")return;let e=this.accessor.element.getBoundingClientRect(),t=this._group.element.getBoundingClientRect();return{left:t.left-e.left,top:t.top-e.top,width:t.width,height:t.height}}get locked(){if(!this._group)throw new Error(gt);return this._group.locked}set locked(e){if(!this._group)throw new Error(gt);this._group.locked=e}constructor(e,t){super(e,"__dockviewgroup__"),this.accessor=t,this._isApplyingSize=!1,this._onDidLocationChange=new G,this.onDidLocationChange=this._onDidLocationChange.event,this._onDidActivePanelChange=new G,this.onDidActivePanelChange=this._onDidActivePanelChange.event,this._onDidCollapsedChange=new G,this.onDidCollapsedChange=this._onDidCollapsedChange.event,this._onDidPeekChange=new G,this.onDidPeekChange=this._onDidPeekChange.event,this._onDidHeaderDirectionChange=new G,this.onDidHeaderDirectionChange=this._onDidHeaderDirectionChange.event,this.addDisposables(this._onDidLocationChange,this._onDidActivePanelChange,this._onDidCollapsedChange,this._onDidPeekChange,this._onDidHeaderDirectionChange,this._onDidVisibilityChange.event(i=>{if(i.isVisible&&this._pendingSize){let n=this._pendingSize;this._pendingSize=void 0,super.setSize(n)}}),this.onDidDimensionsChange(i=>{var n,s;let l=i.width!==((n=this._reportedSize)===null||n===void 0?void 0:n.width)||i.height!==((s=this._reportedSize)===null||s===void 0?void 0:s.height);this._reportedSize={width:i.width,height:i.height},l&&this.isVisible&&!this._isApplyingSize&&(this._pendingSize=void 0)}))}setSize(e){(typeof e.width=="number"||typeof e.height=="number")&&(this._pendingSize=J({},e));let t=this._isApplyingSize;this._isApplyingSize=!0;try{super.setSize(e)}finally{this._isApplyingSize=t}}close(){if(this._group)return this.accessor.removeGroup(this._group)}getWindow(){return this.location.type==="popout"?this.location.getWindow():globalThis.window}setHeaderPosition(e){if(!this._group)throw new Error(gt);this._group.model.headerPosition=e}getHeaderPosition(){if(!this._group)throw new Error(gt);return this._group.model.headerPosition}moveTo(e){if(!this._group)throw new Error(gt);this.accessor.withOrigin("api",()=>{var t,i,n,s;let l=(t=e.group)!==null&&t!==void 0?t:this.accessor.addGroup({direction:Rr((i=e.position)!==null&&i!==void 0?i:"right"),skipSetActive:(n=e.skipSetActive)!==null&&n!==void 0?n:!1});this.accessor.moveGroupOrPanel({from:{groupId:this._group.id},to:{group:l,position:e.group&&(s=e.position)!==null&&s!==void 0?s:"center",index:e.index},skipSetActive:e.skipSetActive})})}maximize(){if(!this._group)throw new Error(gt);this.location.type==="grid"&&this.accessor.maximizeGroup(this._group)}isMaximized(){if(!this._group)throw new Error(gt);return this.accessor.isMaximizedGroup(this._group)}exitMaximized(){if(!this._group)throw new Error(gt);this.isMaximized()&&this.accessor.exitMaximizedGroup()}collapse(){this._group&&this.accessor.setEdgeGroupCollapsed(this._group,!0)}expand(){this._group&&this.accessor.setEdgeGroupCollapsed(this._group,!1)}isCollapsed(){return this._group?this.accessor.isEdgeGroupCollapsed(this._group):!1}isPeeking(){return this._group?this.accessor.isEdgeGroupPeeking(this._group):!1}setAutoHide(e){this._group&&this.accessor.setEdgeGroupAutoHide(this._group,e)}isAutoHide(){return this._group?this.accessor.isEdgeGroupAutoHide(this._group):!1}initialize(e){this._group=e}};let Tc=100,Ac=100;var ui=class extends ls{get minimumWidth(){var e;if(typeof this._explicitConstraints.minimumWidth=="number")return this._explicitConstraints.minimumWidth;let t=(e=this.activePanel)===null||e===void 0?void 0:e.minimumWidth;return typeof t=="number"?t:super.__minimumWidth()}get minimumHeight(){var e;if(typeof this._explicitConstraints.minimumHeight=="number")return this._explicitConstraints.minimumHeight;let t=(e=this.activePanel)===null||e===void 0?void 0:e.minimumHeight;return typeof t=="number"?t:super.__minimumHeight()}get maximumWidth(){var e;if(typeof this._explicitConstraints.maximumWidth=="number")return this._explicitConstraints.maximumWidth;let t=(e=this.activePanel)===null||e===void 0?void 0:e.maximumWidth;return typeof t=="number"?t:super.__maximumWidth()}get maximumHeight(){var e;if(typeof this._explicitConstraints.maximumHeight=="number")return this._explicitConstraints.maximumHeight;let t=(e=this.activePanel)===null||e===void 0?void 0:e.maximumHeight;return typeof t=="number"?t:super.__maximumHeight()}get panels(){return this._model.panels}get activePanel(){return this._model.activePanel}get size(){return this._model.size}get model(){return this._model}get locked(){return this._model.locked}set locked(e){this._model.locked=e}get header(){return this._model.header}constructor(e,t,i){var n,s,l,c,p,v;super(t,"groupview_default",{minimumHeight:(n=(s=i.constraints)===null||s===void 0?void 0:s.minimumHeight)!==null&&n!==void 0?n:Ac,minimumWidth:(l=(c=i.constraints)===null||c===void 0?void 0:c.minimumWidth)!==null&&l!==void 0?l:Tc,maximumHeight:(p=i.constraints)===null||p===void 0?void 0:p.maximumHeight,maximumWidth:(v=i.constraints)===null||v===void 0?void 0:v.maximumWidth},new zc(t,e)),this._explicitConstraints={},this.api.initialize(this),this._model=new ds(this.element,e,t,i,this),this.addDisposables(this.model.onDidActivePanelChange(m=>{this.api._onDidActivePanelChange.fire(m)}),this.api.onDidConstraintsChangeInternal(m=>{m.minimumWidth!==void 0&&(this._explicitConstraints.minimumWidth=typeof m.minimumWidth=="function"?m.minimumWidth():m.minimumWidth),m.minimumHeight!==void 0&&(this._explicitConstraints.minimumHeight=typeof m.minimumHeight=="function"?m.minimumHeight():m.minimumHeight),m.maximumWidth!==void 0&&(this._explicitConstraints.maximumWidth=typeof m.maximumWidth=="function"?m.maximumWidth():m.maximumWidth),m.maximumHeight!==void 0&&(this._explicitConstraints.maximumHeight=typeof m.maximumHeight=="function"?m.maximumHeight():m.maximumHeight)}))}focus(){this.api.isActive||this.api.setActive(),super.focus()}initialize(){this._model.initialize()}setActive(e){super.setActive(e),this.model.setActive(e)}layout(e,t){super.layout(e,t),this.model.layout(e,t)}relayout(){this.model.relayout()}getComponent(){return this._model}toJSON(){return this.model.toJSON()}};let Ec={name:"dark",className:"dockview-theme-dark",colorScheme:"dark"},Ic={name:"light",className:"dockview-theme-light",colorScheme:"light"},Mc={name:"visualStudio",className:"dockview-theme-vs",colorScheme:"dark",edgeGroupCollapsedSize:22},cs={name:"abyss",className:"dockview-theme-abyss",colorScheme:"dark",tabGroupIndicator:"none"},Lc={name:"dracula",className:"dockview-theme-dracula",colorScheme:"dark"},Oc={name:"abyssSpaced",className:"dockview-theme-abyss-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},Rc={name:"lightSpaced",className:"dockview-theme-light-spaced",colorScheme:"light",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},$c={name:"nord",className:"dockview-theme-nord",colorScheme:"dark"},Nc={name:"nordSpaced",className:"dockview-theme-nord-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},Vc={name:"catppuccinMocha",className:"dockview-theme-catppuccin-mocha",colorScheme:"dark"},Wc={name:"catppuccinMochaSpaced",className:"dockview-theme-catppuccin-mocha-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},Hc={name:"monokai",className:"dockview-theme-monokai",colorScheme:"dark"},Bc={name:"solarizedLight",className:"dockview-theme-solarized-light",colorScheme:"light"},Fc={name:"solarizedLightSpaced",className:"dockview-theme-solarized-light-spaced",colorScheme:"light",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},Uc={name:"githubDark",className:"dockview-theme-github-dark",colorScheme:"dark"},Yc={name:"githubDarkSpaced",className:"dockview-theme-github-dark-spaced",colorScheme:"dark",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"},qc={name:"githubLight",className:"dockview-theme-github-light",colorScheme:"light"},jc={name:"githubLightSpaced",className:"dockview-theme-github-light-spaced",colorScheme:"light",gap:10,edgeGroupCollapsedSize:44,dndOverlayMounting:"absolute",dndPanelOverlay:"group",dndTabIndicator:"line",dndOverlayBorder:"2px solid var(--dv-active-sash-color)"};var Jc=class extends fo{get location(){return this.group.api.location}get title(){return this.panel.title}get isPinned(){return this.panel.isPinned}get isGroupActive(){return this.group.isActive}get renderer(){return this.panel.renderer}set group(e){let t=this._group;this._group!==e&&(this._group=e,this._onDidGroupChange.fire({}),this.setupGroupEventListeners(t),this.fireLocationChange())}get group(){return this._group}get tabComponent(){return this._tabComponent}constructor(e,t,i,n,s){super(e.id,n),this.panel=e,this.accessor=i,this._onDidTitleChange=new G,this.onDidTitleChange=this._onDidTitleChange.event,this._onDidChangePinned=new G,this.onDidChangePinned=this._onDidChangePinned.event,this._onDidActiveGroupChange=new G,this.onDidActiveGroupChange=this._onDidActiveGroupChange.event,this._onDidGroupChange=new G,this.onDidGroupChange=this._onDidGroupChange.event,this._onDidRendererChange=new G,this.onDidRendererChange=this._onDidRendererChange.event,this._onDidLocationChange=new G,this.onDidLocationChange=this._onDidLocationChange.event,this.groupEventsDisposable=new C,this._tabComponent=s,this.initialize(e),this._group=t,this.setupGroupEventListeners(),this.addDisposables(this.groupEventsDisposable,this._onDidRendererChange,this._onDidTitleChange,this._onDidChangePinned,this._onDidGroupChange,this._onDidActiveGroupChange,this._onDidLocationChange)}getWindow(){return this.group.api.getWindow()}setActive(){this.accessor.withOrigin("api",()=>super.setActive())}moveTo(e){this.accessor.withOrigin("api",()=>{var t,i;return this.accessor.moveGroupOrPanel({from:{groupId:this._group.id,panelId:this.panel.id},to:{group:(t=e.group)!==null&&t!==void 0?t:this._group,position:e.group&&(i=e.position)!==null&&i!==void 0?i:"center",index:e.index},skipSetActive:e.skipSetActive})})}setTitle(e){this.panel.setTitle(e)}setPinned(e){this.accessor.setPanelPinned(this.panel,e)}setRenderer(e){this.panel.setRenderer(e)}close(){this.group.model.closePanel(this.panel)}maximize(){this.group.api.maximize()}isMaximized(){return this.group.api.isMaximized()}exitMaximized(){this.group.api.exitMaximized()}fireLocationChange(){this.accessor.deferLocationChange(this,()=>{this.isDisposed||this._onDidLocationChange.fire({location:this.location})})}setupGroupEventListeners(e){var t;let i=(t=e?.isActive)!==null&&t!==void 0?t:!1;this.groupEventsDisposable.value=new D(this.group.api.onDidVisibilityChange(n=>{let s=!n.isVisible&&this.isVisible,l=n.isVisible&&!this.isVisible,c=this.group.model.isPanelActive(this.panel);(s||l&&c)&&this._onDidVisibilityChange.fire(n)}),this.group.api.onDidLocationChange(()=>{this.group===this.panel.group&&this.fireLocationChange()}),this.group.api.onDidActiveChange(()=>{this.group===this.panel.group&&i!==this.isGroupActive&&(i=this.isGroupActive,this._onDidActiveGroupChange.fire({isActive:this.isGroupActive}))}))}},At=class extends D{get params(){return this._params}get title(){return this._title}get isPinned(){return this._pinned}get group(){return this._group}get renderer(){var e;return(e=this._renderer)!==null&&e!==void 0?e:this.accessor.renderer}get minimumWidth(){return this._minimumWidth}get minimumHeight(){return this._minimumHeight}get maximumWidth(){return this._maximumWidth}get maximumHeight(){return this._maximumHeight}constructor(e,t,i,n,s,l,c,p){super(),this.id=e,this.accessor=n,this.containerApi=s,this.view=c,this._pinned=!1,this._renderer=p.renderer,this._group=l,this._minimumWidth=p.minimumWidth,this._minimumHeight=p.minimumHeight,this._maximumWidth=p.maximumWidth,this._maximumHeight=p.maximumHeight,this.api=new Jc(this,this._group,n,t,i),this.addDisposables(this.api.onActiveChange(()=>{n.setActivePanel(this)}),this.api.onDidSizeChange(v=>{this.group.api.setSize(v)}),this.api.onDidRendererChange(()=>{this.group.model.rerender(this)}))}init(e){this._params=e.params,this.view.init(J(J({},e),{},{api:this.api,containerApi:this.containerApi})),this.setTitle(e.title)}focus(){let e=new Wr;this.api._onWillFocus.fire(e),!e.defaultPrevented&&(this.api.isActive||this.api.setActive())}toJSON(){return{id:this.id,contentComponent:this.view.contentComponent,tabComponent:this.view.tabComponent,params:Object.keys(this._params||{}).length>0?this._params:void 0,title:this.title,renderer:this._renderer,minimumHeight:this._minimumHeight,maximumHeight:this._maximumHeight,minimumWidth:this._minimumWidth,maximumWidth:this._maximumWidth,pinned:this._pinned?!0:void 0}}setTitle(e){e!==this.title&&(this._title=e,this.view.setTitle(e),this.api._onDidTitleChange.fire({title:e}))}setPinned(e){this._pinned!==e&&(this._pinned=e,this.api._onDidChangePinned.fire({isPinned:e}))}setRenderer(e){e!==this.renderer&&(this._renderer=e,this.api._onDidRendererChange.fire({renderer:e}))}update(e){this._params=J(J({},this._params),e.params);for(let t of Object.keys(e.params))e.params[t]===void 0&&delete this._params[t];this.view.update({params:this._params})}updateFromStateModel(e){var t,i,n,s,l;this._maximumHeight=e.maximumHeight,this._minimumHeight=e.minimumHeight,this._maximumWidth=e.maximumWidth,this._minimumWidth=e.minimumWidth,this._params=(t=e.params)!==null&&t!==void 0?t:{},this.view.update({params:this._params}),this.setTitle((i=e.title)!==null&&i!==void 0?i:this.id),this.setRenderer((n=e.renderer)!==null&&n!==void 0?n:this.accessor.renderer),this.setPinned(((s=e.pinned)!==null&&s!==void 0?s:!1)&&!!(!((l=this.accessor.options.pinnedTabs)===null||l===void 0)&&l.enabled))}updateParentGroup(e,t){this._group=e,this.api.group=this._group;let i=this._group.model.isPanelActive(this),n=this.group.api.isActive&&i;t?.skipSetActive||this.api.isActive!==n&&this.api._onDidActiveChange.fire({isActive:this.group.api.isActive&&i}),this.api.isVisible!==i&&this.api._onDidVisibilityChange.fire({isVisible:i})}runEvents(){let e=this._group.model.isPanelActive(this),t=this.group.api.isActive&&e;this.api.isActive!==t&&this.api._onDidActiveChange.fire({isActive:this.group.api.isActive&&e}),this.api.isVisible!==e&&this.api._onDidVisibilityChange.fire({isVisible:e})}layout(e,t){this.api._onDidDimensionChange.fire({width:e,height:t}),this.view.layout(e,t)}dispose(){this.api.dispose(),this.view.dispose()}},bo=class extends D{get element(){return this._element}constructor(){super(),this._messages=Li,this._element=document.createElement("div"),this._element.className="dv-default-tab",this._content=document.createElement("div"),this._content.className="dv-default-tab-content",this.action=document.createElement("div"),this.action.className="dv-default-tab-action",this.action.setAttribute("role","button"),this.action.setAttribute("tabindex","-1");let e=qr();e.setAttribute("aria-hidden","true"),this.action.appendChild(e),this._element.appendChild(this._content),this._element.appendChild(this.action),this.render()}init(e){var t;this._title=e.title,this._messages=(t=e.containerApi.messages)!==null&&t!==void 0?t:Li,this.addDisposables(e.api.onDidTitleChange(i=>{this._title=i.title,this.render()}),O(this.action,"pointerdown",i=>{i.preventDefault()}),O(this.action,"click",i=>{i.defaultPrevented||(i.preventDefault(),e.api.close())})),this.render()}render(){if(this._content.textContent!==this._title){var e;this._content.textContent=(e=this._title)!==null&&e!==void 0?e:""}this.action.setAttribute("aria-label",this._title?this._messages.closeTab(this._title):this._messages.closeTabPlain())}},hs=class{get content(){return this._content}get tab(){return this._tab}constructor(e,t,i,n){this.accessor=e,this.id=t,this.contentComponent=i,this.tabComponent=n,this._content=this.createContentComponent(this.id,i),this._tab=this.createTabComponent(this.id,n)}createTabRenderer(e){let t=this.createTabComponent(this.id,this.tabComponent);if(this._params&&t.init(J(J({},this._params),{},{tabLocation:e})),this._updateEvent){var i;(i=t.update)===null||i===void 0||i.call(t,this._updateEvent)}return t}init(e){this._params=e,this.content.init(e),this.tab.init(J(J({},e),{},{tabLocation:"header"}))}setTitle(e){this._params&&(this._params.title=e)}layout(e,t){var i,n;(i=(n=this.content).layout)===null||i===void 0||i.call(n,e,t)}update(e){var t,i,n,s;this._updateEvent=e,(t=(i=this.content).update)===null||t===void 0||t.call(i,e),(n=(s=this.tab).update)===null||n===void 0||n.call(s,e)}dispose(){var e,t,i,n;(e=(t=this.content).dispose)===null||e===void 0||e.call(t),(i=(n=this.tab).dispose)===null||i===void 0||i.call(n)}createContentComponent(e,t){return this.accessor.options.createComponent({id:e,name:t})}createTabComponent(e,t){let i=t??this.accessor.options.defaultTabComponent;if(i){if(this.accessor.options.createTabComponent){let n=this.accessor.options.createTabComponent({id:e,name:i});return n||new bo}console.warn(`dockview: tabComponent '${t}' was not found. falling back to the default tab.`)}return new bo}},us=class{constructor(e){this.accessor=e}fromJSON(e,t){var i,n,s;let l=e.id,c=e.params,p=e.title,v=e.view,m=v?v.content.id:(i=e.contentComponent)!==null&&i!==void 0?i:"unknown",f=v?(n=v.tab)===null||n===void 0?void 0:n.id:e.tabComponent,_=new hs(this.accessor,l,m,f),y=new At(l,m,f,this.accessor,new Oi(this.accessor),t,_,{renderer:e.renderer,minimumWidth:e.minimumWidth,minimumHeight:e.minimumHeight,maximumWidth:e.maximumWidth,maximumHeight:e.maximumHeight});return y.init({title:p??l,params:c??{}}),e.pinned&&(!((s=this.accessor.options.pinnedTabs)===null||s===void 0)&&s.enabled)&&y.setPinned(!0),y}},Kc=class extends D{get element(){return this._element}constructor(){super(),this._element=document.createElement("div"),this._element.className="dv-watermark"}init(e){}},Xc=class{constructor(){this._orderedList=[]}push(e){this._orderedList=[...this._orderedList.filter(t=>t!==e),e],this.update()}destroy(e){this._orderedList=this._orderedList.filter(t=>t!==e),this.update()}update(){for(let e=0;e<this._orderedList.length;e++)this._orderedList[e].setAttribute("aria-level",`${e}`),this._orderedList[e].style.zIndex=`calc(var(--dv-overlay-z-index, 999) + ${e*2})`}};let Ui=new Xc;var wo=class Bt extends D{set minimumInViewportWidth(t){this.options.minimumInViewportWidth=t}set minimumInViewportHeight(t){this.options.minimumInViewportHeight=t}get element(){return this._element}get isVisible(){return this._isVisible}get headerHeight(){var t,i;return(t=(i=this.options.header)===null||i===void 0?void 0:i.offsetHeight)!==null&&t!==void 0?t:0}constructor(t){super(),this.options=t,this._element=document.createElement("div"),this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this._onDidChangeEnd=new G,this.onDidChangeEnd=this._onDidChangeEnd.event,this._onDidStartMoving=new G,this.onDidStartMoving=this._onDidStartMoving.event,this._dragMove=new C,this._dragCancelled=!1,this.addDisposables(this._onDidChange,this._onDidChangeEnd,this._onDidStartMoving,this._dragMove),this._element.className="dv-resize-container",this._element.setAttribute("role","dialog"),this._element.setAttribute("aria-modal","false"),this._isVisible=!0,this.setupResize("top"),this.setupResize("bottom"),this.setupResize("left"),this.setupResize("right"),this.setupResize("topleft"),this.setupResize("topright"),this.setupResize("bottomleft"),this.setupResize("bottomright"),this.options.header&&(E(this._element,"dv-resize-container-with-titlebar",!0),this._element.appendChild(this.options.header)),this._element.appendChild(this.options.content),this.options.container.appendChild(this._element),this.setBounds(J(J(J(J({height:this.options.height,width:this.options.width},"top"in this.options&&{top:this.options.top}),"bottom"in this.options&&{bottom:this.options.bottom}),"left"in this.options&&{left:this.options.left}),"right"in this.options&&{right:this.options.right})),Ui.push(this._element)}setVisible(t){t!==this.isVisible&&(this._isVisible=t,E(this.element,"dv-hidden",!this.isVisible))}bringToFront(){Ui.push(this._element)}setBounds(t={}){typeof t.height=="number"&&(this._element.style.height=`${t.height}px`),typeof t.width=="number"&&(this._element.style.width=`${t.width}px`),"top"in t&&typeof t.top=="number"&&(this._element.style.top=`${t.top}px`,this._element.style.bottom="auto",this.verticalAlignment="top"),"bottom"in t&&typeof t.bottom=="number"&&(this._element.style.bottom=`${t.bottom}px`,this._element.style.top="auto",this.verticalAlignment="bottom"),"left"in t&&typeof t.left=="number"&&(this._element.style.left=`${t.left}px`,this._element.style.right="auto",this.horiziontalAlignment="left"),"right"in t&&typeof t.right=="number"&&(this._element.style.right=`${t.right}px`,this._element.style.left="auto",this.horiziontalAlignment="right");let i=this.options.container.getBoundingClientRect(),n=this._element.getBoundingClientRect(),s=Math.max(0,this.getMinimumWidth(n.width)),l=Math.max(0,this.getMinimumHeight(n.height));if(this.verticalAlignment==="top"){let c=ye(n.top-i.top,-l,Math.max(0,i.height-n.height+l));this._element.style.top=`${c}px`,this._element.style.bottom="auto"}if(this.verticalAlignment==="bottom"){let c=ye(i.bottom-n.bottom,-l,Math.max(0,i.height-n.height+l));this._element.style.bottom=`${c}px`,this._element.style.top="auto"}if(this.horiziontalAlignment==="left"){let c=ye(n.left-i.left,-s,Math.max(0,i.width-n.width+s));this._element.style.left=`${c}px`,this._element.style.right="auto"}if(this.horiziontalAlignment==="right"){let c=ye(i.right-n.right,-s,Math.max(0,i.width-n.width+s));this._element.style.right=`${c}px`,this._element.style.left="auto"}this._onDidChange.fire()}toJSON(){let t=this.options.container.getBoundingClientRect(),i=this._element.getBoundingClientRect(),n={};return this.verticalAlignment==="top"?n.top=Number.parseFloat(this._element.style.top):this.verticalAlignment==="bottom"?n.bottom=Number.parseFloat(this._element.style.bottom):n.top=i.top-t.top,this.horiziontalAlignment==="left"?n.left=Number.parseFloat(this._element.style.left):this.horiziontalAlignment==="right"?n.right=Number.parseFloat(this._element.style.right):n.left=i.left-t.left,n.width=i.width,n.height=i.height,n}cancelPendingDrag(){this._dragMove.value&&(this._dragCancelled=!0,E(this._element,"dv-resize-container-dragging",!1),this._dragMove.value=w.NONE)}setupDrag(t,i){let n=(s,l)=>{var c,p,v;let m=null,f=!1;this._dragCancelled=!1;let _=this.options.transformDragPosition?(c=(p=(v=this.options).getSiblingBoxes)===null||p===void 0?void 0:p.call(v))!==null&&c!==void 0?c:[]:[],y=pe();if(s&&typeof l=="number"&&typeof s.setPointerCapture=="function")try{s.setPointerCapture(l)}catch{}let x=()=>{E(this._element,"dv-resize-container-dragging",!1),this._dragMove.value=w.NONE,this._onDidChangeEnd.fire()};this._dragMove.value=new D({dispose:()=>{if(y.release(),s&&typeof l=="number"&&typeof s.releasePointerCapture=="function")try{s.releasePointerCapture(l)}catch{}}},O(globalThis.window,"pointermove",k=>{var S;if(this._dragCancelled)return;let z=this.options.container.getBoundingClientRect(),M=k.clientX-z.left,I=k.clientY-z.top;E(this._element,"dv-resize-container-dragging",!0);let A=this._element.getBoundingClientRect();(S=m)!==null&&S!==void 0||(m={x:k.clientX-A.left,y:k.clientY-A.top});let N=Math.max(0,this.getMinimumWidth(A.width)),X=Math.max(0,this.getMinimumHeight(A.height)),Z=I-m.y,W=M-m.x;if(this.options.transformDragPosition){let ze=this.options.transformDragPosition({proposed:{top:Z,left:W,width:A.width,height:A.height},container:{width:z.width,height:z.height},others:_,modifiers:{altKey:k.altKey,ctrlKey:k.ctrlKey,metaKey:k.metaKey,shiftKey:k.shiftKey}});ze&&(Z=ze.top,W=ze.left)}let U=Math.max(0,z.height-A.height+X),oe=Math.max(0,z.width-A.width+N),K=ye(Z,-X,U),ee=ye(z.height-A.height-Z,-X,U),fe=ye(W,-N,oe),ue=ye(z.width-A.width-W,-N,oe),ge={};K<=ee?ge.top=K:ge.bottom=ee,fe<=ue?ge.left=fe:ge.right=ue,this.setBounds(ge),f||(f=!0,this._onDidStartMoving.fire())}),O(globalThis.window,"pointerup",x),O(globalThis.window,"pointercancel",x))};this.addDisposables(O(t,"pointerdown",s=>{if(s.defaultPrevented){s.preventDefault();return}si(s)||n(t,s.pointerId)}),O(this.options.content,"pointerdown",s=>{s.defaultPrevented||si(s)||s.shiftKey&&n(this.options.content,s.pointerId)}),O(this.options.content,"pointerdown",()=>{Ui.push(this._element)},!0)),i?.inDragMode&&n()}setupResize(t){let i=document.createElement("div");i.className=`dv-resize-handle-${t}`,this._element.appendChild(i);let n=new C;this.addDisposables(n,O(i,"pointerdown",s=>{s.preventDefault();let l=null,c=pe(),p=s.pointerId;if(typeof i.setPointerCapture=="function")try{i.setPointerCapture(p)}catch{}let v=()=>{n.dispose(),this._onDidChangeEnd.fire()};n.value=new D(O(globalThis.window,"pointermove",m=>{var f;let _=this.options.container.getBoundingClientRect(),y=this._element.getBoundingClientRect(),x=m.clientY-_.top,k=m.clientX-_.left;(f=l)!==null&&f!==void 0||(l={originalY:x,originalHeight:y.height,originalX:k,originalWidth:y.width});let S,z,M,I,A,N,X=()=>{let K=l.originalY+l.originalHeight>_.height?Math.max(0,_.height-Bt.MINIMUM_HEIGHT):Math.max(0,l.originalY+l.originalHeight-Bt.MINIMUM_HEIGHT);S=ye(x,0,K),M=l.originalY+l.originalHeight-S,z=_.height-S-M},Z=()=>{S=l.originalY-l.originalHeight;let K=S<0&&typeof this.options.minimumInViewportHeight=="number"?-S+this.options.minimumInViewportHeight:Bt.MINIMUM_HEIGHT,ee=_.height-Math.max(0,S);M=ye(x-S,K,ee),z=_.height-S-M},W=()=>{let K=l.originalX+l.originalWidth>_.width?Math.max(0,_.width-Bt.MINIMUM_WIDTH):Math.max(0,l.originalX+l.originalWidth-Bt.MINIMUM_WIDTH);I=ye(k,0,K),N=l.originalX+l.originalWidth-I,A=_.width-I-N},U=()=>{I=l.originalX-l.originalWidth;let K=I<0&&typeof this.options.minimumInViewportWidth=="number"?-I+this.options.minimumInViewportWidth:Bt.MINIMUM_WIDTH,ee=_.width-Math.max(0,I);N=ye(k-I,K,ee),A=_.width-I-N};switch(t){case"top":X();break;case"bottom":Z();break;case"left":W();break;case"right":U();break;case"topleft":X(),W();break;case"topright":X(),U();break;case"bottomleft":Z(),W();break;case"bottomright":Z(),U();break}let oe={};S<=z?oe.top=S:oe.bottom=z,I<=A?oe.left=I:oe.right=A,oe.height=M,oe.width=N,this.setBounds(oe)}),{dispose:()=>{if(c.release(),typeof i.releasePointerCapture=="function")try{i.releasePointerCapture(p)}catch{}}},O(globalThis.window,"pointerup",v),O(globalThis.window,"pointercancel",v))}))}getMinimumWidth(t){return typeof this.options.minimumInViewportWidth=="number"?t-this.options.minimumInViewportWidth:0}getMinimumHeight(t){return typeof this.options.minimumInViewportHeight=="number"?t-this.options.minimumInViewportHeight:0}dispose(){Ui.destroy(this._element),this._element.remove(),super.dispose()}};wo.MINIMUM_HEIGHT=20,wo.MINIMUM_WIDTH=20;var Zc=class extends D{get element(){return this._element}get group(){return this._group}setGroup(e){this._group=e}constructor(e,t){super(),this.accessor=e,this._onDragStart=new G,this.onDragStart=this._onDragStart.event,this._group=t,this._element=document.createElement("div"),this._element.className="dv-floating-titlebar",this.addDisposables(this._onDragStart,O(this._element,"pointerdown",()=>{this.accessor.doSetGroupActive(this._group)}),O(this._element,"pointerdown",i=>{i.shiftKey&&Re(i)},!0)),this.dragSource=new Kr({element:this._element,accessor:this.accessor,group:()=>this._group}),this.addDisposables(this.dragSource,this.dragSource.onDragStart(i=>{this._onDragStart.fire(i)}))}updateDragAndDropState(){this.dragSource.updateDragAndDropState()}};function it(e){return{moduleName:e.name,options:e.options,services:{[e.serviceKey]:e.create},init:e.init?(t,i)=>e.init(t,i[e.serviceKey]):void 0,dependsOn:e.dependsOn}}let Qc=new Set(["AdvancedOverflow","AutoEdgeGroup","AutoHideEdgeGroup","DndCompass","KeyboardDocking","KeyboardNavigation","LayoutHistory","License","MultiRowTabs","PinnedTabs","SmartGuides"]),ps=new Set;function vs(e,t){let i=t===void 0?[]:[].concat(t),n=i.map(c=>`\`${c}\``).join(", "),s=i.length>1?"require":"requires",l=i.length?`${n} ${s} the "${e}" module`:`The "${e}" module is required`;return Qc.has(e)?`dockview: ${l}, which ships in dockview-enterprise.

  npm install dockview-enterprise
  import 'dockview-enterprise'; // self-registers every enterprise module
`:`dockview: ${l}, but it is not registered.`}function gs(e,t){let i=`${e}|${(t===void 0?[]:[].concat(t)).join("|")}`;ps.has(i)||(ps.add(i),console.error(vs(e,t)))}function We(e,t,i){if(e!==void 0)return e;gs(t,i)}var eh=class{constructor(){this._modules=new Map,this._services={},this._initDisposables=[]}get services(){return this._services}register(e){if(!this._modules.has(e.moduleName)){if(e.dependsOn)for(let t of e.dependsOn)this.register(t);this._modules.set(e.moduleName,e)}}initialize(e){for(let t of this._modules.values())if(t.services)for(let[i,n]of Object.entries(t.services))this._services[i]=n(e)}postConstruct(e){for(let t of this._modules.values())t.init&&this._initDisposables.push(t.init(e,this._services))}has(e){return this._modules.has(e)}dispose(){for(let e of this._initDisposables)e.dispose();this._initDisposables.length=0;for(let e of Object.values(this._services))e!==void 0&&typeof e.dispose=="function"&&e.dispose()}};let Yi=[];function th(e){for(let t of e)Yi.some(i=>i.moduleName===t.moduleName)||Yi.push(t)}function ms(){return[...Yi]}function ih(){Yi.length=0}let nh=[{optionKey:"smartGuides",reason:"smartGuides",moduleName:"SmartGuides",when:e=>!!e.smartGuides&&e.smartGuides.enabled!==!1},{optionKey:"layoutHistory",reason:"layoutHistory.enabled: true",moduleName:"LayoutHistory",when:e=>{var t;return((t=e.layoutHistory)===null||t===void 0?void 0:t.enabled)===!0}},{optionKey:"pinnedTabs",reason:"pinnedTabs.enabled: true",moduleName:"PinnedTabs",when:e=>{var t;return((t=e.pinnedTabs)===null||t===void 0?void 0:t.enabled)===!0}},{optionKey:"overflow",reason:"overflow.mode: 'wrap'",moduleName:"MultiRowTabs",when:e=>{var t;return((t=e.overflow)===null||t===void 0?void 0:t.mode)==="wrap"}},{optionKey:"overflow",reason:"overflow.maxRows",moduleName:"MultiRowTabs",when:e=>{var t;return((t=e.overflow)===null||t===void 0?void 0:t.maxRows)!=null}},{optionKey:"overflow",reason:"overflow.search",moduleName:"AdvancedOverflow",when:e=>{var t;return!!(!((t=e.overflow)===null||t===void 0)&&t.search)}},{optionKey:"overflow",reason:"overflow.mru",moduleName:"AdvancedOverflow",when:e=>{var t;return!!(!((t=e.overflow)===null||t===void 0)&&t.mru)}},{optionKey:"autoHideEdgeGroups",reason:"autoHideEdgeGroups",moduleName:"AutoHideEdgeGroup",when:e=>Ni(e.autoHideEdgeGroups)},{optionKey:"dockToEdgeGroups",reason:"dockToEdgeGroups",moduleName:"AutoEdgeGroup",when:e=>Ni(e.dockToEdgeGroups)},{optionKey:"dndCompass",reason:"dndCompass",moduleName:"DndCompass",when:e=>!!e.dndCompass},{optionKey:"keyboardNavigation",reason:"keyboardNavigation",moduleName:"KeyboardNavigation",when:e=>!!e.keyboardNavigation}];function oh(e,t){let i=new Map;for(let n of nh){if(!n.when(e)||t(n.moduleName))continue;let s=i.get(n.moduleName);s?s.push(n.reason):i.set(n.moduleName,[n.reason])}for(let[n,s]of i)gs(n,s)}let xt={left:100,top:100,width:300,height:300};var rh=class extends D{get group(){return this._group}setTitleBar(e){this._titleBar=e}setAnchorGroup(e){var t;this._group=e,(t=this._titleBar)===null||t===void 0||t.setGroup(e)}constructor(e,t,i){super(),this.overlay=t,this.gridview=i,this._group=e,this.addDisposables(t,{dispose:()=>this.gridview.dispose()})}position(e){this.overlay.setBounds(e)}},sh=class{get floatingGroups(){return this._floatingGroups}constructor(e){this._floatingGroups=[],this._host=e}add(e,t,i){let n=new rh(e,t,i),s=new D(e.api.onDidActiveChange(c=>{c.isActive&&t.bringToFront()}),(()=>{let c=-1,p=-1;return B(i.element,v=>{let m=Math.round(v.contentRect.width),f=Math.round(v.contentRect.height);m===c&&f===p||(c=m,p=f,i.layout(m,f))})})()),l=()=>{var c;let p=(c=e.activePanel)===null||c===void 0?void 0:c.title;p?t.element.setAttribute("aria-label",p):t.element.removeAttribute("aria-label")};return l(),n.addDisposables(e.api.onDidActivePanelChange(()=>l()),t.onDidChange(()=>{i.layout(i.width,i.height)}),t.onDidChangeEnd(()=>{this._host.fireLayoutChange()}),e.onDidChange(c=>{t.setBounds({height:typeof c?.height=="number"?c.height+t.headerHeight:c?.height,width:c?.width})}),{dispose:()=>{s.dispose(),kr(this._floatingGroups,n),e.model.location={type:"grid"}}}),this._floatingGroups.push(n),n}findByGroup(e){return this._floatingGroups.find(t=>t.group===e||t.gridview.element.contains(e.element))}serialize(){return this._floatingGroups.map(e=>{let t=e.gridview.serialize(),i=e.overlay.toJSON(),n=t.root;return n.type==="branch"&&n.data.length===1&&n.data[0].type==="leaf"?{data:n.data[0].data,position:i}:{grid:t,position:i}})}constrainBounds(){for(let e of this._floatingGroups)e.overlay.setBounds()}updateBounds(e){if("floatingGroupBounds"in e)for(let n of this._floatingGroups){switch(e.floatingGroupBounds){case"boundedWithinViewport":n.overlay.minimumInViewportHeight=void 0,n.overlay.minimumInViewportWidth=void 0;break;case void 0:n.overlay.minimumInViewportHeight=100,n.overlay.minimumInViewportWidth=100;break;default:var t,i;n.overlay.minimumInViewportHeight=(t=e.floatingGroupBounds)===null||t===void 0?void 0:t.minimumHeightWithinViewport,n.overlay.minimumInViewportWidth=(i=e.floatingGroupBounds)===null||i===void 0?void 0:i.minimumWidthWithinViewport}n.overlay.setBounds()}}disposeAll(){for(let e of[...this._floatingGroups])e.dispose()}dispose(){this.disposeAll()}};let fs=it({name:"FloatingGroup",serviceKey:"floatingGroupService",create:e=>new sh(e)});var ah=class{constructor(e){this._entries=[],this._restorationCleanups=new Set,this._restorationPromise=Promise.resolve(),this._onDidRemove=new G,this.onDidRemove=this._onDidRemove.event,this._host=e}get entries(){return this._entries}get restorationPromise(){return this._restorationPromise}add(e){this._entries.push(e)}remove(e){kr(this._entries,e)&&!this._host.isDisposed&&this._onDidRemove.fire(e)}findByGroup(e){return this._entries.find(t=>t.popoutGroup===e||t.gridview.element.contains(e.element))}findReferenceGroupId(e){var t;return(t=this._entries.find(i=>i.popoutGroup===e))===null||t===void 0?void 0:t.referenceGroup}observeGridviewSize(e,t,i){var n;let s=(n=e.window)===null||n===void 0?void 0:n.ResizeObserver;if(!s)return;let l=-1,c=-1,p=()=>{let m=e.window;if(this._host.isDisposed||!m||m.closed)return;let f=Math.round(t.element.clientWidth),_=Math.round(t.element.clientHeight);f===l&&_===c||(l=f,c=_,f>0&&_>0&&t.layout(f,_),i.updateAllPositions())},v=new s(()=>{var m;let f=(m=e.window)===null||m===void 0?void 0:m.requestAnimationFrame;f?f.call(e.window,p):p()});return v.observe(t.element),{dispose:()=>v.disconnect()}}scheduleRestoration(e,t,i){return new Promise(n=>{let s=()=>{this._restorationCleanups.delete(s),clearTimeout(l),i?.(),n()},l=setTimeout(()=>{if(this._restorationCleanups.delete(s),this._host.isDisposed){n();return}Promise.resolve(t()).then(()=>n(),()=>n())},e);this._restorationCleanups.add(s)})}finishRestoration(e){this._restorationPromise=Promise.all(e).then(()=>{})}cancelPendingRestorations(){for(let e of[...this._restorationCleanups])e();this._restorationCleanups.clear()}serialize(){return this._entries.map(e=>{let t=e.gridview.serialize(),i=t.root,n=e.popoutGroup.api.location.type==="popout"?e.popoutGroup.api.location.popoutUrl:void 0,s={gridReferenceGroup:e.referenceGroup,position:e.window.dimensions(),url:n};return i.type==="branch"&&i.data.length===1&&i.data[0].type==="leaf"?J(J({},s),{},{data:i.data[0].data}):J(J({},s),{},{grid:t})})}disposeAll(){for(let e of[...this._entries])e.disposable.dispose()}dispose(){this.cancelPendingRestorations(),this.disposeAll(),this._onDidRemove.dispose()}};let dh=it({name:"PopoutWindow",serviceKey:"popoutWindowService",create:e=>new ah(e)});var lh=class{constructor(e){this._watermark=null,this._host=e}update(){if(this._host.hasVisibleGridGroup()){this._unmount();return}if(this._watermark)return;this._watermark=this._host.createWatermarkComponent(),this._watermark.init({containerApi:this._host.api});let e=document.createElement("div");e.className="dv-watermark-container",le(e,"watermark-component"),e.appendChild(this._watermark.element),this._host.mountElement.appendChild(e)}refresh(){this._unmount(),this.update()}_unmount(){var e,t;this._watermark&&(this._watermark.element.parentElement.remove(),(e=(t=this._watermark).dispose)===null||e===void 0||e.call(t),this._watermark=null)}dispose(){this._unmount()}};let ch=it({name:"Watermark",serviceKey:"watermarkService",create:e=>new lh(e),init:(e,t)=>(t.update(),new D(P.any(e.onDidAdd,e.onDidRemove)(()=>{t.update()}),e.onDidViewVisibilityChangeMicroTaskQueue(()=>{t.update()})))});var hh=class{constructor(){this._edgeGroups=new Map,this._edgeGroupDisposables=new Map,this._autoHide=new WeakMap,this._autoReveal=new WeakMap}add(e,t,i){this._edgeGroups.set(e,t),this._edgeGroupDisposables.set(e,i)}remove(e){var t;(t=this._edgeGroupDisposables.get(e))===null||t===void 0||t.dispose(),this._edgeGroupDisposables.delete(e),this._edgeGroups.delete(e)}get(e){return this._edgeGroups.get(e)}has(e){return this._edgeGroups.has(e)}hasAny(){return this._edgeGroups.size>0}entries(){return this._edgeGroups.entries()}includes(e){for(let t of this._edgeGroups.values())if(t===e)return!0;return!1}findPositionOf(e){for(let[t,i]of this._edgeGroups)if(i===e)return t}setAutoHide(e,t){t===void 0?this._autoHide.delete(e):this._autoHide.set(e,t)}isAutoHide(e){return this._autoHide.get(e)}setAutoReveal(e,t){this._autoReveal.set(e,t)}isAutoReveal(e){var t;return(t=this._autoReveal.get(e))!==null&&t!==void 0?t:!1}disposeAll(){for(let e of this._edgeGroupDisposables.values())e.dispose();this._edgeGroupDisposables.clear(),this._edgeGroups.clear()}dispose(){this.disposeAll()}};let bs=it({name:"EdgeGroup",serviceKey:"edgeGroupService",create:()=>new hh}),uh={activationSize:{type:"pixels",value:10},size:{type:"pixels",value:20}},ph={activationSize:{type:"pixels",value:32},size:{type:"pixels",value:20}};function ws(e,t){return typeof e.dndEdges=="object"&&e.dndEdges!==null?e.dndEdges:t&&Ni(e.dockToEdgeGroups)?ph:uh}var vh=class{constructor(e){this._host=e;let t=(n,s)=>{let l=g();return l?l.viewId!==e.id?!1:s==="center"?e.isGridEmpty():!0:s==="center"&&!e.isGridEmpty()?!1:e.dispatchUnhandledDragOver(n,s)},i=ws(e.options,!1);this._html5Target=vt.createDropTarget(e.element,{className:"dv-drop-target-edge",canDisplayOverlay:t,acceptedTargetZones:["top","bottom","left","right","center"],overlayModel:i,getOverrideTarget:()=>e.rootDropTargetOverrideTarget(),getPositionResolver:()=>e.options.dropPositionResolver}),this._pointerTarget=tt.createDropTarget(e.element,{className:"dv-drop-target-edge",canDisplayOverlay:t,acceptedTargetZones:["top","bottom","left","right","center"],overlayModel:i,getOverrideTarget:()=>e.rootDropTargetOverrideTarget(),getPositionResolver:()=>e.options.dropPositionResolver}),this.onWillShowOverlay=P.any(this._html5Target.onWillShowOverlay,this._pointerTarget.onWillShowOverlay),this.onDrop=P.any(this._html5Target.onDrop,this._pointerTarget.onDrop),this.setOptions(e.options)}setOptions(e){if("dndEdges"in e){let t=typeof e.dndEdges=="boolean"&&e.dndEdges===!1;this._html5Target.disabled=t,this._pointerTarget.disabled=t}if("dndEdges"in e||"dockToEdgeGroups"in e){let t=ws({dndEdges:"dndEdges"in e?e.dndEdges:this._host.options.dndEdges,dockToEdgeGroups:"dockToEdgeGroups"in e?e.dockToEdgeGroups:this._host.options.dockToEdgeGroups},this._host.hasEdgeDragReveal);this._html5Target.setOverlayModel(t),this._pointerTarget.setOverlayModel(t)}}dispose(){this._html5Target.dispose(),this._pointerTarget.dispose()}};let gh=it({name:"RootDropTarget",serviceKey:"rootDropTargetService",create:e=>new vh(e),init:(e,t)=>(t.setOptions(e.options),w.NONE)}),mh={left:"createLeftHeaderActionComponent",right:"createRightHeaderActionComponent",prefix:"createPrefixHeaderActionComponent"};var fh=class{constructor(e){this._perGroup=new Map,this._host=e}refresh(e){if(!e?.model)return;let t=this._ensureState(e);this._refreshSlot("left",e,t.left),this._refreshSlot("right",e,t.right),this._refreshSlot("prefix",e,t.prefix)}refreshAll(){for(let e of this._host.groups)this.refresh(e)}disposeGroup(e){let t=this._perGroup.get(e);t&&(t.left.dispose(),t.right.dispose(),t.prefix.dispose(),this._perGroup.delete(e))}dispose(){for(let e of[...this._perGroup.keys()])this.disposeGroup(e)}_ensureState(e){let t=this._perGroup.get(e);return t||(t={left:new C,right:new C,prefix:new C},this._perGroup.set(e,t)),t}_refreshSlot(e,t,i){let n=this._host.options[mh[e]];if(n){let s=n(t);i.value=s,s.init({containerApi:this._host.api,api:t.api,group:t}),t.model.attachHeaderAction(e,s.element)}else i.dispose(),t.model.attachHeaderAction(e,void 0)}};let bh=it({name:"HeaderActions",serviceKey:"headerActionsService",create:e=>new fh(e),init:(e,t)=>new D(e.onDidRemoveGroup(i=>{t.disposeGroup(i)}))}),_s=e=>e==="load"||e==="clear";function qi(e,t){let i=e.createElement("div");return i.className=t==="assertive"?"dv-live-region-assertive":"dv-live-region",i.setAttribute("role",t==="assertive"?"alert":"status"),i.setAttribute("aria-live",t),i.setAttribute("aria-atomic","true"),Object.assign(i.style,{position:"absolute",width:"1px",height:"1px",margin:"-1px",padding:"0",overflow:"hidden",clip:"rect(0 0 0 0)",clipPath:"inset(50%)",whiteSpace:"nowrap",border:"0"}),i}var wh=class extends D{constructor(e){var t;super(),this._regions=new Map,this._suppressDepth=0,this._locationSubs=new Map,this._host=e;let i=e.element.ownerDocument;this._mainWindow=(t=i.defaultView)!==null&&t!==void 0?t:window;let n={polite:qi(i,"polite"),assertive:qi(i,"assertive")};e.element.appendChild(n.polite),e.element.appendChild(n.assertive),this._regions.set(this._mainWindow,n),this._syncPopoutRegions(),this.addDisposables({dispose:()=>this._disposeRegions()},e.onDidChangePopouts(()=>this._syncPopoutRegions()),e.onDidAddPanel(s=>this._announce(s,"open")),e.onDidRemovePanel(s=>this._announce(s,"close")),e.onWillMutateLayout(s=>{_s(s.kind)&&this._suppressDepth++}),e.onDidMutateLayout(s=>{_s(s.kind)&&(this._suppressDepth=Math.max(0,this._suppressDepth-1))}),e.onDidMaximizedGroupChange(s=>{let l=s.group.activePanel;l&&this._announce(l,s.isMaximized?"maximize":"restore")}),e.onDidAddGroup(s=>this._trackLocation(s)),e.onDidRemoveGroup(s=>{var l;(l=this._locationSubs.get(s.id))===null||l===void 0||l.dispose(),this._locationSubs.delete(s.id)}),{dispose:()=>{this._locationSubs.forEach(s=>s.dispose()),this._locationSubs.clear()}})}_syncPopoutRegions(){let e=this._host.element.ownerDocument,t=new Set([this._mainWindow]);for(let n of this._host.getPopoutWindows()){var i;if(n.document===e||(t.add(n),this._regions.has(n)))continue;let s=n.document,l=(i=s.body)!==null&&i!==void 0?i:s.documentElement,c={polite:qi(s,"polite"),assertive:qi(s,"assertive")};l.appendChild(c.polite),l.appendChild(c.assertive),this._regions.set(n,c)}for(let[n,s]of this._regions)t.has(n)||(s.polite.remove(),s.assertive.remove(),this._regions.delete(n))}_disposeRegions(){for(let e of this._regions.values())e.polite.remove(),e.assertive.remove();this._regions.clear()}_focusedRegions(){for(let[e,t]of this._regions)if(e!==this._mainWindow)try{if(e.document.hasFocus())return t}catch{}return this._regions.get(this._mainWindow)}_trackLocation(e){let t=e.api.location.type,i=e.api.onDidLocationChange(n=>{let s=n.location.type;if(s===t)return;t=s;let l=e.activePanel;if(!l)return;let c;switch(s){case"floating":c="float";break;case"popout":c="popout";break;default:c="dock";break}this._announce(l,c)});this._locationSubs.set(e.id,i)}announce(e,t="polite"){if(this._host.options.announcements===!1||this._suppressDepth>0||!e)return;let i=this._host.options.announcer;if(i){i({message:e,politeness:t});return}let n=this._focusedRegions(),s=t==="assertive"?n.assertive:n.polite;s.textContent="",s.textContent=e}_announce(e,t){var i,n;let s=(i=(n=this._host.options).getAnnouncement)===null||i===void 0?void 0:i.call(n,{kind:t,panel:e});s===null||s===""||this.announce(s??this._defaultMessage(e,t))}_defaultMessage(e,t){var i;let n=oo(this._host.options.messages),s=(i=e.title)!==null&&i!==void 0?i:e.id;switch(t){case"open":return n.panelOpened(s);case"close":return n.panelClosed(s);case"maximize":return n.groupMaximized(s);case"restore":return n.groupRestored(s);case"float":return n.groupFloated(s);case"dock":return n.groupDocked(s);case"popout":return n.groupPoppedOut(s)}}};let ys=it({name:"LiveRegion",serviceKey:"liveRegionService",create:e=>new wh(e)}),_h=30,yh=-10;var xs=class{constructor(e){this.host=e}dispatchWillDragPanel(e){this.host.fireWillDragPanel(e)}dispatchWillDragGroup(e){this.host.fireWillDragGroup(e)}dispatchWillDrop(e){this.host.fireWillDrop(e)}dispatchWillShowOverlay(e){this.host.fireWillShowOverlay(e)}buildGroupDragGhost(e){let t=this.host.options.createGroupDragGhostComponent;if(!t)return;let i=t(e);return i.init({group:e,api:this.host.api}),{element:i.element,offsetX:_h,offsetY:yh,dispose:i.dispose?()=>{var n;return(n=i.dispose)===null||n===void 0?void 0:n.call(i)}:void 0}}resolveOverlayModel(e,t){var i,n;return(i=(n=this.host.options).dropOverlayModel)===null||i===void 0?void 0:i.call(n,{location:e,group:t})}showPreviewOverlay(e,t){let i=e.model.contentDropTarget;return i.showOverlay(t),w.from(()=>i.clearOverlay())}dispose(){}};let Ds=it({name:"AdvancedDnD",serviceKey:"advancedDnDService",create:e=>new xs(e)});var ks=class{constructor(e){this._host=e}attachToGroup(e){return new D(e.model.onDidCreateTabGroup(t=>{this._host.fireDidCreateTabGroup(t)}),e.model.onDidDestroyTabGroup(t=>{this._host.fireDidDestroyTabGroup(t)}),e.model.onDidAddPanelToTabGroup(t=>{this._host.fireDidAddPanelToTabGroup(t)}),e.model.onDidRemovePanelFromTabGroup(t=>{this._host.fireDidRemovePanelFromTabGroup(t)}),e.model.onDidTabGroupChange(t=>{this._host.fireDidTabGroupChange(t)}),e.model.onDidTabGroupCollapsedChange(t=>{this._host.fireDidTabGroupCollapsedChange(t)}))}dispose(){}};let Ss=it({name:"TabGroupChips",serviceKey:"tabGroupChipsService",create:e=>new ks(e),init:(e,t)=>{let i=new Map;return new D(e.onDidAddGroup(n=>{i.set(n,t.attachToGroup(n))}),e.onDidRemoveGroup(n=>{var s;(s=i.get(n))===null||s===void 0||s.dispose(),i.delete(n)}),{dispose:()=>{for(let n of i.values())n.dispose();i.clear()}})}});function Cs(e,t){var i,n;if(!((i=t.api)===null||i===void 0||(n=i.isPeeking)===null||n===void 0)&&n.call(i))return"calc(var(--dv-overlay-z-index, 999) + 100)";if(!(e instanceof HTMLElement))return;let s=Ue(e);return s?.style.zIndex?`calc(${s.style.zIndex} * 2)`:void 0}let xh=0,Dh=()=>`dv-ctx-menu-item-${xh++}`;function Gs(e){return typeof e=="object"}function qe(e,t,i,n){let s=document.createElement("div");return s.className="dv-context-menu-item",s.setAttribute("role","menuitem"),n&&(s.classList.add("dv-context-menu-item--disabled"),s.setAttribute("aria-disabled","true")),s.textContent=e,n||s.addEventListener("click",()=>{i(),t()}),s}function Ps(){let e=document.createElement("div");return e.className="dv-context-menu-separator",e.setAttribute("role","separator"),e}function kh(){if(globalThis.window===void 0||!globalThis.matchMedia)return!1;let e=globalThis.matchMedia("(pointer: coarse)").matches,t=globalThis.matchMedia("(pointer: fine)").matches;return e&&!t}function Sh(e){let t=document.createElement("div");t.className="dv-context-menu-rename";let i=document.createElement("input");return i.className="dv-context-menu-rename-input",i.type="text",i.placeholder="Name This Group",i.value=e.label,i.addEventListener("input",()=>{e.setLabel(i.value)}),i.addEventListener("keydown",n=>{n.key!=="Escape"&&n.key!=="Enter"&&n.stopPropagation()}),i.addEventListener("click",n=>{n.stopPropagation()}),t.appendChild(i),kh()||requestAnimationFrame(()=>{i.focus(),i.select()}),t}function Ch(e,t){let i=document.createElement("div");if(i.className="dv-context-menu-color-picker",!t.enabled)return i;for(let n of t.entries()){let s=document.createElement("div");s.className="dv-context-menu-color-swatch",s.style.setProperty("--dv-tab-group-color",n.value),n.label&&(s.title=n.label),e.color===n.id&&s.classList.add("dv-context-menu-color-swatch--selected"),s.addEventListener("click",()=>{e.setColor(n.id)}),i.appendChild(s)}return i}var zs=class{constructor(e){this.accessor=e}buildMaximizeItem(e,t){let i=e.api.isMaximized();return qe(i?"Restore":"Maximize",t,i?()=>e.api.exitMaximized():()=>e.api.maximize(),!i&&e.api.location.type!=="grid")}buildCollapseItem(e,t){return qe(e.collapsed?"Expand":"Collapse",t,()=>e.toggle())}_shouldInjectPin(){let e=this.accessor.options.pinnedTabs;return!!this.accessor.pinnedTabsService&&!!e?.enabled&&e.contextMenuItem!==!1}_resolveTabItems(e,t,i){var n,s,l;let c=(n=(s=(l=this.accessor.options).getTabContextMenuItems)===null||s===void 0?void 0:s.call(l,{panel:e,group:t,api:this.accessor.api,event:i}))!==null&&n!==void 0?n:[];return this._shouldInjectPin()?["pin",...c]:c}appendComponentItem(e,t,i,n,s,l){var c,p;let v=(c=(p=this.accessor.options).createContextMenuItemComponent)===null||c===void 0?void 0:c.call(p,{id:Dh(),component:t.component});v&&(l.addDisposables(v),v.init(J(J({},i),{},{group:n,api:this.accessor.api,close:s,componentProps:t.componentProps})),e.appendChild(v.element))}buildBuiltInTabItem(e,t,i,n){switch(e){case"separator":return Ps();case"close":return qe("Close",n,()=>t.api.close());case"closeOthers":return qe("Close Others",n,()=>{i.panels.filter(s=>s!==t).forEach(s=>s.api.close())});case"closeAll":return qe("Close All",n,()=>{[...i.panels].forEach(s=>s.api.close())});case"closeLeft":{let s=i.panels.indexOf(t);return qe("Close to the Left",n,()=>{i.panels.filter((l,c)=>c<s).forEach(l=>l.api.close())},s<=0)}case"closeRight":{let s=i.panels.indexOf(t);return qe("Close to the Right",n,()=>{i.panels.filter((l,c)=>c>s).forEach(l=>l.api.close())},s===-1||s>=i.panels.length-1)}case"maximize":return this.buildMaximizeItem(t,n);case"float":return qe("Float",n,()=>this.accessor.api.addFloatingGroup(t),t.api.location.type==="floating");case"popout":return qe("Open in New Window",n,()=>{this.accessor.api.addPopoutGroup(t)},t.api.location.type==="popout");case"pin":return qe(t.api.isPinned?"Unpin tab":"Pin tab",n,()=>t.api.setPinned(!t.api.isPinned));default:return}}appendConfigItem(e,t,i,n,s,l){t.element?e.appendChild(t.element):t.component?this.appendComponentItem(e,t,i,n,s,l):t.label&&e.appendChild(qe(t.label,s,()=>{var c;return(c=t.action)===null||c===void 0?void 0:c.call(t)},t.disabled))}show(e,t,i){let n=this._resolveTabItems(e,t,i);if(n.length===0)return;i.preventDefault();let s=this.accessor.getPopupServiceForGroup(t),l=()=>s.close(),c=new D,p=document.createElement("div");p.className="dv-context-menu",p.setAttribute("role","menu");try{for(let v of n){if(Gs(v)){this.appendConfigItem(p,v,{panel:e},t,l,c);continue}let m=this.buildBuiltInTabItem(v,e,t,l);m&&p.appendChild(m)}}catch(v){throw c.dispose(),v}s.openPopover(p,{x:i.clientX,y:i.clientY,zIndex:Cs(i.target,t)},{onClose:()=>c.dispose()})}showForChip(e,t,i){if(!this.accessor.options.getTabGroupChipContextMenuItems)return;let n=this.accessor.options.getTabGroupChipContextMenuItems({tabGroup:e,group:t,api:this.accessor.api,event:i});if(n.length===0)return;i.preventDefault();let s=this.accessor.getPopupServiceForGroup(t),l=()=>s.close(),c=new D,p=document.createElement("div");p.className="dv-context-menu",p.setAttribute("role","menu");try{for(let v of n)v==="separator"?p.appendChild(Ps()):v==="rename"?p.appendChild(Sh(e)):v==="colorPicker"?p.appendChild(Ch(e,this.accessor.tabGroupColorPalette)):v==="collapse"?p.appendChild(this.buildCollapseItem(e,l)):v==="close"?p.appendChild(qe("Close All",l,()=>{t.panels.filter(m=>e.containsPanel(m.id)).forEach(m=>m.api.close())})):Gs(v)&&this.appendConfigItem(p,v,{tabGroup:e},t,l,c)}catch(v){throw c.dispose(),v}s.openPopover(p,{x:i.clientX,y:i.clientY,zIndex:Cs(i.target,t)},{onClose:()=>c.dispose()})}};let Ts=it({name:"ContextMenu",serviceKey:"contextMenuService",create:e=>new zs(e)}),Gh=[fs,dh,ch,bs,gh,bh,ys,Ds,Ss,Ts];var Ph=class{constructor(){this.cache=new WeakMap,this.currentFrameId=0,this.rafId=null}getPosition(e){let t=this.cache.get(e);if(t?.frameId===this.currentFrameId)return t.rect;this.scheduleFrameUpdate();let i=ne(e);return this.cache.set(e,{rect:i,frameId:this.currentFrameId}),i}invalidate(){this.currentFrameId++}scheduleFrameUpdate(){this.rafId||(this.rafId=requestAnimationFrame(()=>{this.currentFrameId++,this.rafId=null}))}};let As=-1;function zh(){let e=document.createElement("div");return e.tabIndex=-1,e}function qt(e,t,i){let n=`${i}px`;e[t]!==n&&(e[t]=n)}var Es=class extends D{constructor(e,t){super(),this.element=e,this.accessor=t,this.map={},this._disposed=!1,this._generation=0,this.positionCache=new Ph,this.addDisposables(w.from(()=>{for(let i of Object.values(this.map))i.disposable.dispose(),i.destroy.dispose(),this.cancelPendingUpdate(i);this._disposed=!0}))}updateAllPositions(){if(!this._disposed){this.positionCache.invalidate();for(let e of Object.values(this.map))e.panel.api.isVisible&&e.resize&&e.resize()}}repositionPanelOverlay(e,t=!1,i){var n;if(this._disposed)return;let s=this.map[e];s&&(s.forceVisible=t,s.clip=i,this.positionCache.invalidate(),(n=s.resize)===null||n===void 0||n.call(s))}cancelPendingUpdate(e){e.pendingUpdate!==void 0&&(cancelAnimationFrame(e.pendingUpdate),e.pendingUpdate=void 0)}detatch(e){if(this.map[e.api.id]){let t=this.map[e.api.id];return t.disposable.dispose(),t.destroy.dispose(),this.cancelPendingUpdate(t),delete this.map[e.api.id],!0}return!1}attach(e){let{panel:t,referenceContainer:i}=e;if(!this.map[t.api.id]){let x=zh();x.className="dv-render-overlay",x.style.visibility="hidden",this.map[t.api.id]={panel:t,disposable:w.NONE,destroy:w.NONE,element:x,retainPreviousGeometry:!1,positioned:!1,generation:++this._generation}}let n=this.map[t.api.id];n.referenceContainer!==i&&(n.generation=++this._generation,this.cancelPendingUpdate(n),n.referenceContainer=i,n.retainPreviousGeometry=n.positioned);let s=n.generation,l=n.element,c=t.view.content.element,p=x=>{if(!x||x.width<=0||x.height<=0)return;let k=this.map[t.api.id];!k||k.forceVisible||k.positioned&&t.api.isVisible||(qt(l.style,"width",x.width),qt(l.style,"height",x.height))};p(i.dimensions),c.parentElement!==l&&l.appendChild(c),l.parentElement!==this.element&&this.element.appendChild(l);let v=()=>{let x=t.api.id,k=this.map[x];if(k?.generation!==s||k.pendingUpdate!==void 0)return;k.pendingUpdate=As;let S=requestAnimationFrame(()=>{var z;let M=this.map[x];if(M&&(M.pendingUpdate=void 0),this.isDisposed||M?.generation!==s)return;let I=(z=M.forceVisible)!==null&&z!==void 0?z:!1,A=M.clip,N=this.positionCache.getPosition(i.element),X=this.positionCache.getPosition(this.element),Z=N.left-X.left,W=N.top-X.top,U=N.width,oe=N.height;if(M.retainPreviousGeometry&&(U===0||oe===0)){!t.api.isVisible&&!I&&(l.style.visibility="hidden",l.style.pointerEvents="none");return}if(M.retainPreviousGeometry=!1,M.positioned=!0,qt(l.style,"left",Z),qt(l.style,"top",W),qt(l.style,"width",U),qt(l.style,"height",oe),t.api.isVisible||I?(l.style.visibility="",l.style.pointerEvents=""):(l.style.visibility="hidden",l.style.pointerEvents="none"),I?l.style.zIndex="1000":t.api.location.type!=="floating"&&(l.style.zIndex=""),A){var K,ee;let fe=this.element.ownerDocument.defaultView,ue=(K=fe?.scrollX)!==null&&K!==void 0?K:0,ge=(ee=fe?.scrollY)!==null&&ee!==void 0?ee:0,ze=A.top+ge,be=A.left+ue,ve=Math.max(0,ze-N.top),He=Math.max(0,be-N.left),Et=Math.max(0,N.left+U-(A.right+ue)),It=Math.max(0,N.top+oe-(A.bottom+ge));l.style.clipPath=`inset(${ve}px ${Et}px ${It}px ${He}px)`}else l.style.clipPath="";E(l,"dv-render-overlay-float",t.group.api.location.type==="floating")});k.pendingUpdate===As&&(k.pendingUpdate=S)},m=()=>{if(t.api.isVisible){var x;this.positionCache.invalidate(),v(),!((x=this.map[t.api.id])===null||x===void 0)&&x.retainPreviousGeometry&&(l.style.visibility=""),l.style.pointerEvents=""}else l.style.visibility="hidden",l.style.pointerEvents="none"},f=new C,_=()=>{t.api.location.type==="floating"?queueMicrotask(()=>{if(y.isDisposed)return;let x=this.accessor.getFloatingWindowForGroup(t.api.group);if(!x)return;let k=x.overlay.element,S=()=>{let M=Number(k.getAttribute("aria-level"));l.style.zIndex=`calc(var(--dv-overlay-z-index, 999) + ${M*2+1})`},z=new MutationObserver(()=>{S()});f.value=w.from(()=>z.disconnect()),z.observe(k,{attributeFilter:["aria-level"],attributes:!0}),S()}):l.style.zIndex=""},y=new D(f,new Er(l,{onDragEnd:x=>{i.dropTarget.dnd.onDragEnd(x)},onDragEnter:x=>{i.dropTarget.dnd.onDragEnter(x)},onDragLeave:x=>{i.dropTarget.dnd.onDragLeave(x)},onDrop:x=>{i.dropTarget.dnd.onDrop(x)},onDragOver:x=>{i.dropTarget.dnd.onDragOver(x)}}),t.api.onDidVisibilityChange(()=>{m()}),t.api.onDidDimensionsChange(()=>{t.api.isVisible&&v()}),i.onDidDimensionsChange(x=>{p(x)}),t.api.onDidLocationChange(()=>{_()}));return this.map[t.api.id].destroy=w.from(()=>{c.parentElement===l&&c.remove(),l.remove()}),_(),queueMicrotask(()=>{this.isDisposed||m()}),this.map[t.api.id].disposable.dispose(),this.map[t.api.id].disposable=y,this.map[t.api.id].resize=v,l}},Th=class extends D{constructor(e){super(),this.accessor=e,this.init()}init(){let e=new Set,t=new Set;this.addDisposables(this.accessor.onDidAddPanel(i=>{if(e.has(i.api.id))throw new Error(`dockview: Invalid event sequence. [onDidAddPanel] called for panel ${i.api.id} but panel already exists`);e.add(i.api.id)}),this.accessor.onDidRemovePanel(i=>{if(e.has(i.api.id))e.delete(i.api.id);else throw new Error(`dockview: Invalid event sequence. [onDidRemovePanel] called for panel ${i.api.id} but panel does not exists`)}),this.accessor.onDidAddGroup(i=>{if(t.has(i.api.id))throw new Error(`dockview: Invalid event sequence. [onDidAddGroup] called for group ${i.api.id} but group already exists`);t.add(i.api.id)}),this.accessor.onDidRemoveGroup(i=>{if(t.has(i.api.id))t.delete(i.api.id);else throw new Error(`dockview: Invalid event sequence. [onDidRemoveGroup] called for group ${i.api.id} but group does not exists`)}))}};function Ah(e){if(!e.matchMedia)return!1;let t=e.matchMedia("(pointer: coarse)").matches,i=e.matchMedia("(pointer: fine)").matches;return t&&!i}function Is(e){var t,i,n,s,l,c,p;let v=(t=e.window)!==null&&t!==void 0?t:window,m=(i=e.capture)!==null&&i!==void 0?i:!1,f=(n=e.escape)!==null&&n!==void 0?n:!0,_=(s=e.keys)!==null&&s!==void 0?s:[],y=(l=e.outsidePointerDown)!==null&&l!==void 0?l:!0,x=(c=e.pointerDownGraceMs)!==null&&c!==void 0?c:0,k=(p=e.now)!==null&&p!==void 0?p:Date.now,S=k(),z=new D,M=I=>{var A,N;return e.isInside?e.isInside(I):ai(I,(A=(N=e.elements)===null||N===void 0?void 0:N.call(e))!==null&&A!==void 0?A:[])};if((f||_.length>0)&&z.addDisposables(O(v,"keydown",I=>{(f&&I.key==="Escape"||_.includes(I.key))&&e.onDismiss()},m)),(y||e.onInsidePointerDown)&&z.addDisposables(O(v,"pointerdown",I=>{if(M(I)){var A;(A=e.onInsidePointerDown)===null||A===void 0||A.call(e,I);return}!y||k()-S<x||e.onDismiss()},m)),e.resize&&z.addDisposables(O(v,"resize",()=>{Ah(v)||e.onDismiss()})),e.focusOut){let I=()=>{var W,U,oe;return(W=(U=e.anchor)===null||U===void 0?void 0:U.call(e))!==null&&W!==void 0?W:(oe=e.elements)===null||oe===void 0?void 0:oe.call(e)[0]},A=new WeakSet,N=W=>{var U,oe;if(A.has(W))return;A.add(W);let K=W.target;K instanceof Element&&((e.isFocusInside?e.isFocusInside(re(K,I())):ai(W,(U=(oe=e.elements)===null||oe===void 0?void 0:oe.call(e))!==null&&U!==void 0?U:[]))||e.onDismiss())},X=new Map,Z=()=>{var W,U,oe;let K=new Set,ee=(W=e.anchor)===null||W===void 0?void 0:W.call(e),fe=[...(U=(oe=e.elements)===null||oe===void 0?void 0:oe.call(e))!==null&&U!==void 0?U:[],...ee?[ee]:[]];for(let ue of fe)for(let ge of Y(ue))K.add(ge);for(let[ue,ge]of X)K.has(ue)||(ge.dispose(),X.delete(ue));for(let ue of K)X.has(ue)||X.set(ue,O(ue,"focusin",N,m))};z.addDisposables(O(v,"focusin",W=>{Z(),N(W)},m),{dispose:()=>{for(let[,W]of X)W.dispose();X.clear()}}),Z()}return z}var Ms=class extends D{constructor(e,t=globalThis.window){super(),this._active=null,this._activeDisposable=new C,this._root=e,this._window=t,this._element=t.document.createElement("div"),this._element.className="dv-popover-anchor",this._element.style.position="relative",this._root.prepend(this._element),this.addDisposables(w.from(()=>{this.close()}),this._activeDisposable)}updateRoot(e){e.prepend(this._element),this._root=e}openPopover(e,t,i){var n;this.close();let s=this._window.document.createElement("div");s.style.position="absolute",s.style.zIndex=(n=t.zIndex)!==null&&n!==void 0?n:"var(--dv-overlay-z-index)",s.appendChild(e);let l=this._element.getBoundingClientRect(),c=l.left,p=l.top;s.style.top=`${t.y-p}px`,s.style.left=`${t.x-c}px`,this._element.appendChild(s),this._active=s;let v=200;this._activeDisposable.value=new D(Is({window:this._window,onDismiss:()=>this.close(),elements:()=>this._active?[this._active]:[],keys:["Enter"],pointerDownGraceMs:v,resize:!0}),i?.onClose?w.from(i.onClose):w.NONE),this._window.requestAnimationFrame(()=>{Ti(s,this._root)})}close(){this._active&&(this._active.remove(),this._activeDisposable.dispose(),this._active=null)}},_o=class extends D{get renderedOutline(){return this._model?this._outline:void 0}get disabled(){return this._disabled}set disabled(e){this.disabled!==e&&(this._disabled=e,e&&this._clearNow())}_cancelPendingClear(){this._pendingClear!==void 0&&(clearTimeout(this._pendingClear),this._pendingClear=void 0)}_clearNow(){this._cancelPendingClear(),this._model&&this._model.root.remove(),this._model=void 0}get model(){if(!this.disabled)return{clear:()=>{this._clearNow()},scheduleClear:()=>{this._pendingClear!==void 0||!this._model||(this._pendingClear=setTimeout(()=>{this._pendingClear=void 0,this._clearNow()},0))},exists:()=>!!this._model,getElements:(e,t)=>{this._cancelPendingClear();let i=this._outline!==t;if(this._outline=t,this._model)return this._model.changed=i,this._model;let n=this.createContainer(),s=this.createAnchor();if(this._model={root:n,overlay:s,changed:i},n.appendChild(s),this.element.appendChild(n),e?.target instanceof HTMLElement){let l=e.target.getBoundingClientRect(),c=this.element.getBoundingClientRect();s.style.left=`${l.left-c.left}px`,s.style.top=`${l.top-c.top}px`}return this._model}}}constructor(e,t){super(),this.element=e,this._disabled=!1,this._disabled=t.disabled,this.addDisposables(w.from(()=>{var i;(i=this.model)===null||i===void 0||i.clear()}))}createContainer(){let e=document.createElement("div");return e.className="dv-drop-target-container",e}createAnchor(){let e=document.createElement("div");return e.className="dv-drop-target-anchor",e.style.visibility="hidden",e}};let yo=["left","right","top","bottom"];function ji(e){return e==="left"||e==="right"}let Eh={marginShare:0,size:Number.POSITIVE_INFINITY};var Ih=class{get _effectiveBaseCollapsed(){var e;return(e=this._measuredTabSize)!==null&&e!==void 0?e:this._baseCollapsedSize}get minimumSize(){return this._isCollapsed?this.collapsedSize:this._baseMinimumSize!==void 0?this._baseMinimumSize+this._axis.marginShare:this._effectiveBaseCollapsed+50+this._axis.marginShare}get maximumSize(){return this._isCollapsed?this.collapsedSize:this._expandedMaximumSize}get element(){return this._group.element}get isCollapsed(){return this._isCollapsed}get lastExpandedSize(){return this._lastExpandedSize}get lastExpandedContentSize(){return this._lastExpandedSize-this._axis.marginShare}get collapsedSize(){return this._effectiveBaseCollapsed+this._axis.marginShare}get configuredMinimumSize(){return this._baseMinimumSize}get configuredMaximumSize(){return this._expandedMaximumSize}get configuredCollapsedSize(){return this._baseCollapsedSize}constructor(e,t,i,n=Eh){var s,l,c;this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this.snap=!1,this.priority="low",this._isCollapsed=!1,this._isVisible=!0,this._tabSizeDisposables=new D,this._group=t,this._orientation=i,t.element.classList.add("dv-edge-group"),t.element.dataset.testid=`dv-edge-group-${e.id}`,this._baseCollapsedSize=(s=e.collapsedSize)!==null&&s!==void 0?s:35,this._baseMinimumSize=e.minimumSize,this._axis=n,this._expandedMaximumSize=(l=e.maximumSize)!==null&&l!==void 0?l:Number.POSITIVE_INFINITY,this._lastExpandedSize=(c=e.initialSize)!==null&&c!==void 0?c:200,e.collapsed&&(this._isCollapsed=!0,t.element.classList.add("dv-edge-collapsed")),this._observeTabStrip()}_observeTabStrip(){let e=this._group.element.querySelector(".dv-tabs-and-actions-container");e&&this._tabSizeDisposables.addDisposables(B(e,()=>{this._applyMeasuredTabSize(this._orientation==="vertical"?e.offsetHeight:e.offsetWidth)}))}_applyMeasuredTabSize(e){e<=0||e===this._measuredTabSize||(this._measuredTabSize=e,this._isCollapsed&&this._onDidChange.fire({size:this.collapsedSize}))}layout(e,t){!this._isCollapsed&&this._isVisible&&this._axis.size>0&&(this._lastExpandedSize=e+this._axis.marginShare),this._orientation==="horizontal"?this._group.layout(e,t):this._group.layout(t,e)}setCollapsed(e){this._isCollapsed!==e&&(this._isCollapsed=e,this._group.element.classList.toggle("dv-edge-collapsed",e))}setVisible(e){this._isVisible=e}restoreExpandedSize(e){this._lastExpandedSize=e}updateSizing(e,t){this._baseCollapsedSize=e,this._baseMinimumSize=t}dispose(){this._tabSizeDisposables.dispose(),this._onDidChange.dispose()}},Mh=class{get element(){return this._dockviewElement}constructor(e,t){this._dockviewElement=e,this._layoutDockview=t,this.priority="high",this.minimumSize=100,this.maximumSize=Number.POSITIVE_INFINITY,this._onDidChange=new G,this.onDidChange=this._onDidChange.event}layout(e,t){this._layoutDockview(t,e)}setVisible(e){}dispose(){this._onDidChange.dispose()}},Lh=class{get element(){return this._element}constructor(e,t=0){this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this.minimumSize=100,this.maximumSize=Number.POSITIVE_INFINITY,this.priority="high",this._element=document.createElement("div"),this._element.className="dv-shell-middle-column",this._element.style.height="100%",this._element.style.width="100%",this._splitview=new yt(this._element,{orientation:"VERTICAL",proportionalLayout:!1,margin:t}),this._centerIndex=0,this._splitview.addView(e,{type:"distribute"},0)}addTopView(e,t){this._splitview.addView(e,t,0),this._topIndex=0,this._centerIndex+=1,this._bottomIndex!==void 0&&(this._bottomIndex+=1)}addBottomView(e,t){let i=this._splitview.length;this._splitview.addView(e,t,i),this._bottomIndex=i}removeView(e){let t=e==="top"?this._topIndex:this._bottomIndex;t!==void 0&&(this._splitview.removeView(t),e==="top"?(this._topIndex=void 0,this._centerIndex-=1,this._bottomIndex!==void 0&&(this._bottomIndex-=1)):this._bottomIndex=void 0)}layout(e,t){this._splitview.layout(t,e)}setVisible(e){}setViewVisible(e,t){let i=e==="top"?this._topIndex:this._bottomIndex;i!==void 0&&this._splitview.setViewVisible(i,t)}isViewVisible(e){let t=e==="top"?this._topIndex:this._bottomIndex;return t!==void 0?this._splitview.isViewVisible(t):!1}getViewSize(e){let t=e==="top"?this._topIndex:this._bottomIndex;return t!==void 0?this._splitview.getViewSize(t):0}getViewCachedVisibleSize(e){let t=e==="top"?this._topIndex:this._bottomIndex;if(t!==void 0)return this._splitview.getViewCachedVisibleSize(t)}resizeView(e,t){let i=e==="top"?this._topIndex:this._bottomIndex;i!==void 0&&this._splitview.resizeView(i,t)}get axis(){return this._splitview}updateMargin(e){this._splitview.margin=e}get disabled(){return this._splitview.disabled}set disabled(e){this._splitview.disabled=e}dispose(){this._onDidChange.dispose(),this._splitview.dispose()}},Oh=class{constructor(e,t,i,n=0,s=35){this._disposables=new D,this._viewConfigs=new Map,this._pendingSizes=new Map,this._currentWidth=0,this._currentHeight=0,this._gap=n,this._defaultCollapsedSize=s,this._shellElement=document.createElement("div"),this._shellElement.className="dv-shell",this._shellElement.style.height="100%",this._shellElement.style.width="100%",this._shellElement.style.position="relative",e.appendChild(this._shellElement);let l=new Mh(t,i);this._middleColumn=new Lh(l,n),this._outerSplitview=new yt(this._shellElement,{orientation:"HORIZONTAL",proportionalLayout:!1,margin:n}),this._middleIndex=0,this._outerSplitview.addView(this._middleColumn,{type:"distribute"},0),this._disposables.addDisposables(B(this._shellElement,c=>{if(!this._shellElement.offsetParent||!ae(this._shellElement))return;let p=Math.round(c.contentRect.width),v=Math.round(c.contentRect.height);p===this._currentWidth&&v===this._currentHeight||this.layout(p,v)}),this._outerSplitview,this._middleColumn,l)}get element(){return this._shellElement}get locked(){return this._outerSplitview.disabled}set locked(e){this._outerSplitview.disabled=e,this._middleColumn.disabled=e}addEdgeView(e,t,i){if(this.hasEdgeGroup(e))throw new Error(`dockview: edge group already registered at position '${e}'`);this._viewConfigs.set(e,t);let n=new Ih(J({collapsedSize:this._defaultCollapsedSize},t),i,ji(e)?"horizontal":"vertical",this._axisFor(e)),s=n.isCollapsed?n.collapsedSize:n.lastExpandedSize;switch(e){case"left":this._outerSplitview.addView(n,s,0),this._leftIndex=0,this._middleIndex+=1,this._rightIndex!==void 0&&(this._rightIndex+=1),this._leftView=n;break;case"right":{let l=this._outerSplitview.length;this._outerSplitview.addView(n,s,l),this._rightIndex=l,this._rightView=n}break;case"top":this._middleColumn.addTopView(n,s),this._topView=n;break;case"bottom":this._middleColumn.addBottomView(n,s),this._bottomView=n;break}return this._disposables.addDisposables(n),!n.isCollapsed&&!this._canResize(e)&&this._pendingSizes.set(e,s),this._relayout(),n}layoutFromElement(){if(!this._shellElement.offsetParent||!ae(this._shellElement))return;let e=Math.round(this._shellElement.clientWidth),t=Math.round(this._shellElement.clientHeight);e===0||t===0||this.layout(e,t)}layout(e,t){this._currentWidth=e,this._currentHeight=t,this._outerSplitview.layout(e,t),this._flushPendingSizes()}updateTheme(e,t){this._gap=e,this._defaultCollapsedSize=t,this._outerSplitview.margin=e,this._middleColumn.updateMargin(e),this._applyThemeSizing(),this._relayout()}_hasSiblingOn(e){return ji(e)?this._leftView!==void 0&&this._rightView!==void 0:this._topView!==void 0&&this._bottomView!==void 0}_axisFor(e){return ji(e)?this._outerSplitview:this._middleColumn.axis}_applyThemeSizing(){for(let t of yo){let i=this._getView(t),n=this._viewConfigs.get(t);if(i&&n){var e;i.updateSizing((e=n.collapsedSize)!==null&&e!==void 0?e:this._defaultCollapsedSize,n.minimumSize)}}}_relayout(){this._currentWidth>0&&this._currentHeight>0&&this.layout(this._currentWidth,this._currentHeight)}_slotSize(e){switch(e){case"left":return this._leftIndex===void 0?0:this._outerSplitview.getViewSize(this._leftIndex);case"right":return this._rightIndex===void 0?0:this._outerSplitview.getViewSize(this._rightIndex);case"top":case"bottom":return this._middleColumn.getViewSize(e)}}removeEdgeView(e){let t=this._getView(e);if(t){switch(e){case"left":this._outerSplitview.removeView(this._leftIndex),this._leftIndex=void 0,this._leftView=void 0,this._middleIndex-=1,this._rightIndex!==void 0&&(this._rightIndex-=1);break;case"right":this._outerSplitview.removeView(this._rightIndex),this._rightIndex=void 0,this._rightView=void 0;break;case"top":this._middleColumn.removeView("top"),this._topView=void 0;break;case"bottom":this._middleColumn.removeView("bottom"),this._bottomView=void 0;break}this._disposables.removeDisposable(t),t.dispose(),this._viewConfigs.delete(e),this._pendingSizes.delete(e),this._relayout()}}hasEdgeGroup(e){switch(e){case"top":return this._topView!==void 0;case"bottom":return this._bottomView!==void 0;case"left":return this._leftView!==void 0;case"right":return this._rightView!==void 0}}setEdgeGroupVisible(e,t){let i=this._getView(e)!==void 0&&t!==this.isEdgeGroupVisible(e);switch(e){case"left":this._leftIndex!==void 0&&this._outerSplitview.setViewVisible(this._leftIndex,t);break;case"right":this._rightIndex!==void 0&&this._outerSplitview.setViewVisible(this._rightIndex,t);break;case"top":case"bottom":this._middleColumn.setViewVisible(e,t);break}i&&this._gap>0&&this._hasSiblingOn(e)&&this._relayout(),t&&this._flushPendingSizes()}isEdgeGroupVisible(e){switch(e){case"left":return this._leftIndex!==void 0?this._outerSplitview.isViewVisible(this._leftIndex):!1;case"right":return this._rightIndex!==void 0?this._outerSplitview.isViewVisible(this._rightIndex):!1;case"top":case"bottom":return this._middleColumn.isViewVisible(e)}}setEdgeGroupCollapsed(e,t){let i=this._getView(e);i&&(i.setCollapsed(t),t?(this._pendingSizes.delete(e),this._resizeView(e,i.collapsedSize)):this.resizeEdgeGroup(e,i.lastExpandedSize))}resizeEdgeGroup(e,t){let i=this._getView(e);if(!i||!Number.isFinite(t))return;let n=Math.round(t);if(!(n<=0)){if(i.restoreExpandedSize(n),i.isCollapsed){this._pendingSizes.delete(e);return}this._canResize(e)?(this._pendingSizes.delete(e),this._resizeView(e,n)):this._pendingSizes.set(e,n)}}_canResize(e){return this.isEdgeGroupVisible(e)&&this._axisFor(e).size>0}_resizeView(e,t){switch(e){case"left":this._leftIndex!==void 0&&this._outerSplitview.resizeView(this._leftIndex,t);break;case"right":this._rightIndex!==void 0&&this._outerSplitview.resizeView(this._rightIndex,t);break;case"top":case"bottom":this._middleColumn.resizeView(e,t);break}}_flushPendingSizes(){if(this._pendingSizes.size!==0)for(let[e,t]of this._pendingSizes){let i=this._getView(e);!i||i.isCollapsed||!this._canResize(e)||(this._pendingSizes.delete(e),this._resizeView(e,t))}}isEdgeGroupCollapsed(e){var t,i;return(t=(i=this._getView(e))===null||i===void 0?void 0:i.isCollapsed)!==null&&t!==void 0?t:!1}getEdgeGroupExpandedSize(e){var t,i;return(t=(i=this._getView(e))===null||i===void 0?void 0:i.lastExpandedContentSize)!==null&&t!==void 0?t:0}_getView(e){switch(e){case"top":return this._topView;case"bottom":return this._bottomView;case"left":return this._leftView;case"right":return this._rightView}}toJSON(){let e={};for(let t of yo){let i=this._getView(t);if(!i)continue;let n=this.isEdgeGroupVisible(t);e[t]={size:this._expandedSize(i,t,n),visible:n,collapsed:i.isCollapsed||void 0,minimumSize:i.configuredMinimumSize,maximumSize:Number.isFinite(i.configuredMaximumSize)?i.configuredMaximumSize:void 0,collapsedSize:i.configuredCollapsedSize}}return e}_expandedSize(e,t,i){if(e.isCollapsed)return e.lastExpandedSize;let n=this._pendingSizes.get(t);if(n!==void 0)return n;if(!i){var s;return(s=this._cachedVisibleSize(t))!==null&&s!==void 0?s:e.lastExpandedSize}return this._slotSize(t)}_cachedVisibleSize(e){switch(e){case"left":return this._leftIndex===void 0?void 0:this._outerSplitview.getViewCachedVisibleSize(this._leftIndex);case"right":return this._rightIndex===void 0?void 0:this._outerSplitview.getViewCachedVisibleSize(this._rightIndex);case"top":case"bottom":return this._middleColumn.getViewCachedVisibleSize(e)}}fromJSON(e){for(let i of yo){var t;let n=e[i],s=this._getView(i);!n||!s||(s.restoreExpandedSize(n.size),s.setCollapsed((t=n.collapsed)!==null&&t!==void 0?t:!1),n.collapsed?(this._pendingSizes.delete(i),this._resizeView(i,s.collapsedSize)):this.resizeEdgeGroup(i,n.size),this.setEdgeGroupVisible(i,!!n.visible))}}dispose(){this._disposables.dispose(),this._shellElement.remove()}};function Ls(e){e.error?console.error("dockview: failed to create popout.",e.error):e.reason==="blocked"?console.error("dockview: failed to create popout. perhaps you need to allow pop-ups for this website"):console.error(`dockview: failed to create popout (${e.reason}).`)}function Rh(e){var t;return new vo((t=e.tabGroupColors)!==null&&t!==void 0?t:Vi,e.tabGroupAccent!=="off")}function Ji(e){let t=e.from.activePanel;[...e.from.panels].map(i=>{let n=e.from.model.removePanel(i);return e.from.model.renderContainer.detatch(i),n}).forEach(i=>{e.to.model.openPanel(i,{skipSetActive:t!==i,skipSetGroupActive:!0})})}let xo=()=>({dispose:()=>{}}),$h=xo;var Os=class extends no{fireDidCreateTabGroup(e){this._onDidCreateTabGroup.fire(e)}fireDidDestroyTabGroup(e){this._onDidDestroyTabGroup.fire(e)}fireDidAddPanelToTabGroup(e){this._onDidAddPanelToTabGroup.fire(e)}fireDidRemovePanelFromTabGroup(e){this._onDidRemovePanelFromTabGroup.fire(e)}fireDidTabGroupChange(e){this._onDidTabGroupChange.fire(e)}fireDidTabGroupCollapsedChange(e){this._onDidTabGroupCollapsedChange.fire(e)}get orientation(){return this.gridview.orientation}get totalPanels(){return this.panels.length}get panels(){return this.groups.flatMap(e=>e.panels)}get dndCapabilities(){return Ye(this.options)}get options(){return this._options}get tabGroupColorPalette(){return this._tabGroupColorPalette}get activePanel(){let e=this.activeGroup;if(e)return e.activePanel}get renderer(){var e;return(e=this.options.defaultRenderer)!==null&&e!==void 0?e:"onlyWhenVisible"}get defaultHeaderPosition(){var e;return(e=this.options.defaultHeaderPosition)!==null&&e!==void 0?e:"top"}get api(){return this._api}get floatingGroups(){var e,t;return(e=(t=this._moduleRegistry)===null||t===void 0||(t=t.services.floatingGroupService)===null||t===void 0?void 0:t.floatingGroups)!==null&&e!==void 0?e:[]}getFloatingWindowForGroup(e){var t;return(t=this._floatingGroupService)===null||t===void 0?void 0:t.findByGroup(e)}_gatherFloatingGroupBoxes(e){return this.getFloatingGroupSnapshots(e).map(t=>t.box)}getFloatingContainer(){var e;return(e=this._floatingOverlayHost)!==null&&e!==void 0?e:this.gridview.element}getFloatingGroupSnapshots(e){let t=this.getFloatingContainer().getBoundingClientRect();return this.floatingGroups.filter(i=>i.group!==e).map(i=>{let n=i.overlay.element.getBoundingClientRect();return{group:i.group,box:{left:n.left-t.left,top:n.top-t.top,width:n.width,height:n.height}}})}mergeFloatInto(e,t,i){e===t||!this.getPanel(t.id)||this.moveGroupOrPanel({from:{groupId:e.id},to:{group:t,position:i}})}getGridSplitterRects(){let e=this.getFloatingContainer().getBoundingClientRect(),t=[];return this.gridview.element.querySelectorAll(".dv-sash").forEach(i=>{let n=i.getBoundingClientRect();t.push({left:n.left-e.left,top:n.top-e.top,width:n.width,height:n.height})}),t}get _smartGuidesService(){return this._moduleRegistry.services.smartGuidesService}get smartGuidesEnabled(){var e,t;return(e=(t=this._smartGuidesService)===null||t===void 0?void 0:t.enabled)!==null&&e!==void 0?e:!1}setSmartGuidesEnabled(e){var t;(t=We(this._smartGuidesService,"SmartGuides","api.setSmartGuidesEnabled"))===null||t===void 0||t.setEnabled(e)}updateSmartGuidesOptions(e){var t;(t=We(this._smartGuidesService,"SmartGuides","api.updateSmartGuidesOptions"))===null||t===void 0||t.updateOptions(e)}get onDidSnapFloat(){var e,t;return(e=(t=this._smartGuidesService)===null||t===void 0?void 0:t.onDidSnapFloat)!==null&&e!==void 0?e:xo}get onDidSnapTogether(){var e,t;return(e=(t=this._smartGuidesService)===null||t===void 0?void 0:t.onDidSnapTogether)!==null&&e!==void 0?e:xo}_buildFloatingDragTransform(e,t){let i=this.options.transformFloatingGroupDrag,n=!t;if(!(!i&&!(n&&this._smartGuidesService)))return s=>{var l,c;let p=i?.({group:e,proposed:s.proposed,container:s.container,others:s.others,modifiers:s.modifiers}),v=p?J(J({},s.proposed),p):s.proposed,m=n?(l=this._smartGuidesService)===null||l===void 0?void 0:l.transformFloatingGroupDrag({group:e,proposed:v,container:s.container,others:s.others,modifiers:s.modifiers}):void 0;return(c=m??p)!==null&&c!==void 0?c:void 0}}get _floatingGroupService(){return this._moduleRegistry.services.floatingGroupService}get _popoutWindowService(){return this._moduleRegistry.services.popoutWindowService}get _watermarkService(){return this._moduleRegistry.services.watermarkService}get _edgeGroupService(){return this._moduleRegistry.services.edgeGroupService}get _rootDropTargetService(){return this._moduleRegistry.services.rootDropTargetService}get _advancedDnDService(){return this._moduleRegistry.services.advancedDnDService}get _dndCompassService(){return this._moduleRegistry.services.dndCompassService}canDropOnGroup(e,t,i){return e.model.canDisplayContentOverlay(i,t)}getDropOverlayElement(e){var t,i;let n=e.element.querySelector(".dv-content-container");if(n)return((t=this.options.theme)===null||t===void 0?void 0:t.dndPanelOverlay)==="group"&&(i=n.parentElement)!==null&&i!==void 0?i:n}getTabsListElement(e){return e.model.header.hidden?void 0:e.model.tabsListElement}relayoutGroup(e){e.relayout()}setForcedOverflow(e,t){e.model.header.setForcedOverflow(t)}getLayoutElement(){return this.gridview.element}getDropPositionResolver(){var e;if(this.options.dropPositionResolver)return this.options.dropPositionResolver;let t=(e=this._dndCompassService)===null||e===void 0?void 0:e.resolver,i=this._moduleRegistry.services.autoEdgeGroupService;return t&&i?{resolve:n=>{var s;return(s=i.resolveEdge(n))!==null&&s!==void 0?s:t.resolve(n)}}:t??i?.resolver}dockToLayoutEdge(e,t){let i=new mo({nativeEvent:e,position:t,panel:void 0,api:this._api,group:void 0,getData:g,kind:"edge"});if(this._onWillDrop.fire(i),i.defaultPrevented)return;let n=g();if(n){var s;this.moveGroupOrPanel({from:{groupId:n.groupId,panelId:(s=n.panelId)!==null&&s!==void 0?s:void 0},to:{group:this.orthogonalize(t),position:"center"}})}else this._onDidDrop.fire(new Fi({nativeEvent:e,position:t,panel:void 0,api:this._api,group:void 0,getData:g}))}get headerActionsService(){return this._moduleRegistry.services.headerActionsService}get _layoutHistoryService(){return this._moduleRegistry.services.layoutHistoryService}undo(){var e;(e=We(this._layoutHistoryService,"LayoutHistory","api.undo"))===null||e===void 0||e.undo()}redo(){var e;(e=We(this._layoutHistoryService,"LayoutHistory","api.redo"))===null||e===void 0||e.redo()}get canUndo(){var e,t;return(e=(t=this._layoutHistoryService)===null||t===void 0?void 0:t.canUndo)!==null&&e!==void 0?e:!1}get canRedo(){var e,t;return(e=(t=this._layoutHistoryService)===null||t===void 0?void 0:t.canRedo)!==null&&e!==void 0?e:!1}clearHistory(){var e;(e=this._layoutHistoryService)===null||e===void 0||e.clear()}get onDidChangeHistory(){var e,t;return(e=(t=this._layoutHistoryService)===null||t===void 0?void 0:t.onDidChangeHistory)!==null&&e!==void 0?e:$h}get hasEdgeDragReveal(){return!!this._moduleRegistry.services.autoEdgeGroupService}isGridEmpty(){return this.gridview.length===0}rootDropTargetOverrideTarget(){var e;return(e=this.rootDropTargetContainer)===null||e===void 0?void 0:e.model}dispatchUnhandledDragOver(e,t){let i=new po(e,"edge",t,g);return this._onUnhandledDragOver.fire(i),i.isAccepted}fireWillDragPanel(e){this._onWillDragPanel.fire(e)}fireWillDragGroup(e){this._onWillDragGroup.fire(e)}fireWillDrop(e){this._onWillDrop.fire(e)}fireWillShowOverlay(e){this._onWillShowOverlay.fire(e)}buildGroupDragGhost(e){var t;return(t=this._advancedDnDService)===null||t===void 0?void 0:t.buildGroupDragGhost(e)}resolveDropOverlayModel(e,t){var i;return(i=this._advancedDnDService)===null||i===void 0?void 0:i.resolveOverlayModel(e,t)}get rootElement(){var e,t;return(e=(t=this._shellManager)===null||t===void 0?void 0:t.element)!==null&&e!==void 0?e:this.element}ownsElement(e){if(this.rootElement.contains(e))return!0;let t=this.rootElement.ownerDocument,i=e.ownerDocument;return!i||i===t?!1:this.getPopoutWindows().some(n=>n.document===i)}adjacentGroup(e,t){var i;if(e.api.location.type!=="grid")return;let n=we(e.element);return(i=t?this.gridview.previous(n):this.gridview.next(n))===null||i===void 0?void 0:i.view}adjacentGroupInDirection(e,t){if(e.api.location.type!=="grid")return;let i=e.element.getBoundingClientRect(),n=i.left+i.width/2,s=i.top+i.height/2,l,c=Number.POSITIVE_INFINITY;for(let p of this.groups){if(p===e||p.api.location.type!=="grid")continue;let v=p.element.getBoundingClientRect(),m=v.left+v.width/2-n,f=v.top+v.height/2-s,_;switch(t){case"left":_=m<0&&Math.abs(m)>=Math.abs(f);break;case"right":_=m>0&&Math.abs(m)>=Math.abs(f);break;case"up":_=f<0&&Math.abs(f)>=Math.abs(m);break;default:_=f>0&&Math.abs(f)>=Math.abs(m);break}if(!_)continue;let y=m*m+f*f;y<c&&(c=y,l=p)}return l}showDropPreview(e,t){var i,n;return(i=(n=this._advancedDnDService)===null||n===void 0?void 0:n.showPreviewOverlay(e,t))!==null&&i!==void 0?i:w.NONE}announce(e){var t;(t=this._moduleRegistry.services.liveRegionService)===null||t===void 0||t.announce(e)}dockPanel(e,t,i){this.moveGroupOrPanel({from:{groupId:e.group.id,panelId:e.id},to:{group:t,position:i}})}floatPanel(e){this.addFloatingGroup(e)}get contextMenuService(){return this._moduleRegistry.services.contextMenuService}get pinnedTabsService(){return this._moduleRegistry.services.pinnedTabsService}get advancedOverflowService(){return this._moduleRegistry.services.advancedOverflowService}setPanelPinned(e,t){var i;e.isPinned!==t&&!((i=this.options.pinnedTabs)===null||i===void 0)&&i.enabled&&this.pinnedTabsService&&(e.setPinned(t),this._onDidPanelPinnedChange.fire({panel:e,isPinned:t}))}get mountElement(){return this.gridview.element}hasVisibleGridGroup(){return this.groups.some(e=>e.api.location.type==="grid"&&e.api.isVisible)}fireLayoutChange(){this._bufferOnDidLayoutChange.fire()}get popoutRestorationPromise(){var e,t;return(e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.restorationPromise)!==null&&e!==void 0?e:Promise.resolve()}constructor(e,t){var i,n,s,l,c,p;super(e,{proportionalLayout:(i=t.proportionalLayout)!==null&&i!==void 0?i:!0,orientation:"HORIZONTAL",styles:t.hideBorders?{separatorBorder:"transparent"}:void 0,disableAutoResizing:t.disableAutoResizing,locked:t.locked,margin:(n=(s=t.theme)===null||s===void 0?void 0:s.gap)!==null&&n!==void 0?n:0,className:t.className}),this.nextGroupId=Jn(),this._deserializer=new us(this),this._moduleRegistry=new eh,this._onWillDragPanel=new G,this.onWillDragPanel=this._onWillDragPanel.event,this._onWillDragGroup=new G,this.onWillDragGroup=this._onWillDragGroup.event,this._onDidDrop=new G,this.onDidDrop=this._onDidDrop.event,this._onWillDrop=new G,this.onWillDrop=this._onWillDrop.event,this._mutationDepth=0,this._syncMutationDepth=0,this._pendingLocationChanges=new Map,this._openingPopoutWindows=new Set,this._origin="user",this._originDepth=0,this._onWillMutateLayout=new G,this.onWillMutateLayout=this._onWillMutateLayout.event,this._onDidMutateLayout=new G,this.onDidMutateLayout=this._onDidMutateLayout.event,this._onWillShowOverlay=new G,this.onWillShowOverlay=this._onWillShowOverlay.event,this._onUnhandledDragOver=new G,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this._onDidRemovePanel=new G,this.onDidRemovePanel=this._onDidRemovePanel.event,this._onDidAddPanel=new G,this.onDidAddPanel=this._onDidAddPanel.event,this._onDidPopoutGroupSizeChange=new G,this.onDidPopoutGroupSizeChange=this._onDidPopoutGroupSizeChange.event,this._onDidPopoutGroupPositionChange=new G,this.onDidPopoutGroupPositionChange=this._onDidPopoutGroupPositionChange.event,this._onDidAddPopoutGroup=new G,this.onDidAddPopoutGroup=this._onDidAddPopoutGroup.event,this._onDidRemovePopoutGroup=new G,this.onDidRemovePopoutGroup=this._onDidRemovePopoutGroup.event,this._onDidChangePopouts=new G,this.onDidChangePopouts=this._onDidChangePopouts.event,this._onDidOpenPopoutWindowFail=new G,this.onDidOpenPopoutWindowFail=this._onDidOpenPopoutWindowFail.event,this._onWillClosePopoutWindow=new G,this.onWillClosePopoutWindow=this._onWillClosePopoutWindow.event,this._onDidStartFloatingGroupDrag=new G,this.onDidStartFloatingGroupDrag=this._onDidStartFloatingGroupDrag.event,this._onDidEndFloatingGroupDrag=new G,this.onDidEndFloatingGroupDrag=this._onDidEndFloatingGroupDrag.event,this._onDidLayoutFromJSON=new G,this.onDidLayoutFromJSON=this._onDidLayoutFromJSON.event,this._onDidActivePanelChange=new G({replay:!0}),this.onDidActivePanelChange=this._onDidActivePanelChange.event,this._onDidPanelPinnedChange=new G,this.onDidPanelPinnedChange=this._onDidPanelPinnedChange.event,this._onDidMovePanel=new G,this.onDidMovePanel=this._onDidMovePanel.event,this._onDidCreateTabGroup=new G,this.onDidCreateTabGroup=this._onDidCreateTabGroup.event,this._onDidDestroyTabGroup=new G,this.onDidDestroyTabGroup=this._onDidDestroyTabGroup.event,this._onDidAddPanelToTabGroup=new G,this.onDidAddPanelToTabGroup=this._onDidAddPanelToTabGroup.event,this._onDidRemovePanelFromTabGroup=new G,this.onDidRemovePanelFromTabGroup=this._onDidRemovePanelFromTabGroup.event,this._onDidTabGroupChange=new G,this.onDidTabGroupChange=this._onDidTabGroupChange.event,this._onDidTabGroupCollapsedChange=new G,this.onDidTabGroupCollapsedChange=this._onDidTabGroupCollapsedChange.event,this._onDidMaximizedGroupChange=new G,this.onDidMaximizedGroupChange=this._onDidMaximizedGroupChange.event,this._inShellLayout=!1,this._onDidRemoveGroup=new G,this.onDidRemoveGroup=this._onDidRemoveGroup.event,this._onDidEdgeGroupAutoHideChange=new G,this.onDidEdgeGroupAutoHideChange=this._onDidEdgeGroupAutoHideChange.event,this._onDidAddGroup=new G,this.onDidAddGroup=this._onDidAddGroup.event,this._onDidOptionsChange=new G,this.onDidOptionsChange=this._onDidOptionsChange.event,this._onDidActiveGroupChange=new G,this.onDidActiveGroupChange=this._onDidActiveGroupChange.event,this._peekingGroups=new Set,this._moving=!1,this._options=t,this._tabGroupColorPalette=Rh(t);let v=t.modules,m=v??[...Gh,...ms()];for(let y of m)this._moduleRegistry.register(y);this._moduleRegistry.initialize(this),this.reportMissingOptionModules(t);let f=this._popoutWindowService;f&&this.addDisposables(f.onDidRemove(y=>{this._onDidRemovePopoutGroup.fire({id:y.popoutGroup.id,group:y.popoutGroup,window:y.getWindow()})})),this.popupService=new Ms(this.element),this.addDisposables(this.popupService,w.from(()=>{for(let y of this._openingPopoutWindows)y.dispose();this._openingPopoutWindows.clear()})),this._api=new Oi(this),this.disableResizing=!0,this.element.remove(),this._shellManager=new Oh(e,this.element,(y,x)=>this._layoutFromShell(y,x),(l=(c=t.theme)===null||c===void 0?void 0:c.gap)!==null&&l!==void 0?l:0,(p=t.theme)===null||p===void 0?void 0:p.edgeGroupCollapsedSize),this._shellManager.locked=!!t.locked,this.popupService.updateRoot(this._shellManager.element),this._shellThemeClassnames=new $e(this._shellManager.element),this.rootDropTargetContainer=new _o(this._shellManager.element,{disabled:!0}),this.floatingDropTargetContainer=new _o(this._shellManager.element,{disabled:!1}),this.overlayRenderContainer=new Es(this._shellManager.element,this),this._floatingOverlayHost=document.createElement("div"),this._floatingOverlayHost.className="dv-floating-overlay-host",this._shellManager.element.appendChild(this._floatingOverlayHost),E(this.gridview.element,"dv-dockview",!0),E(this.element,"dv-debug",!!t.debug),this.updateTheme(),t.debug&&this.addDisposables(new Th(this)),this.addDisposables(w.from(()=>this._pendingLocationChanges.clear()),this.rootDropTargetContainer,this.floatingDropTargetContainer,O(this._shellManager.element,"dragend",()=>{var y,x;(y=this.rootDropTargetContainer.model)===null||y===void 0||y.clear(),(x=this.floatingDropTargetContainer.model)===null||x===void 0||x.clear()},!0),this.overlayRenderContainer,this._onWillDragPanel,this._onWillDragGroup,this._onWillShowOverlay,this._onDidActivePanelChange,this._onDidPanelPinnedChange,this._onDidAddPanel,this._onDidRemovePanel,this._onDidLayoutFromJSON,this._onDidDrop,this._onWillDrop,this._onWillMutateLayout,this._onDidMutateLayout,this._onDidMovePanel,this._onDidMovePanel.event(()=>{this.debouncedUpdateAllPositions()}),this._onDidAddGroup,this._onDidRemoveGroup,this._onDidEdgeGroupAutoHideChange,this._onDidActiveGroupChange,this._onUnhandledDragOver,this._onDidMaximizedGroupChange,this._onDidPopoutGroupSizeChange,this._onDidPopoutGroupPositionChange,this._onDidAddPopoutGroup,this._onDidRemovePopoutGroup,this._onDidChangePopouts,this._onDidAddPopoutGroup.event(()=>this._onDidChangePopouts.fire()),this._onDidRemovePopoutGroup.event(()=>this._onDidChangePopouts.fire()),this._onDidOpenPopoutWindowFail,this._onDidStartFloatingGroupDrag,this._onDidEndFloatingGroupDrag,this._onDidCreateTabGroup,this._onDidDestroyTabGroup,this._onDidAddPanelToTabGroup,this._onDidRemovePanelFromTabGroup,this._onDidTabGroupChange,this._onDidTabGroupCollapsedChange,P.any(this.onDidPopoutGroupSizeChange,this.onDidPopoutGroupPositionChange,this.onDidCreateTabGroup,this.onDidDestroyTabGroup,this.onDidAddPanelToTabGroup,this.onDidRemovePanelFromTabGroup,this.onDidTabGroupChange,this.onDidTabGroupCollapsedChange)(()=>{this.fireLayoutChange()}),this._onDidOptionsChange,this.onDidAdd(y=>{this._moving||this._onDidAddGroup.fire(y)}),this.onDidRemove(y=>{this._moving||this._onDidRemoveGroup.fire(y)}),this.onDidActiveChange(y=>{this._moving||this._onDidActiveGroupChange.fire(y)}),this.onDidMaximizedChange(y=>{this._onDidMaximizedGroupChange.fire({group:y.panel,isMaximized:y.isMaximized})}),P.any(this.onDidAddPanel,this.onDidRemovePanel,this.onDidAddGroup,this.onDidRemove,this.onDidRemoveGroup,this.onDidMovePanel,this.onDidActivePanelChange)(()=>{this._bufferOnDidLayoutChange.fire()}),w.from(()=>{var y;this._moduleRegistry.dispose(),(y=this._shellManager)===null||y===void 0||y.dispose()}),this._onWillClosePopoutWindow);let _=this._rootDropTargetService;_&&this.addDisposables(_.onWillShowOverlay(y=>{this.gridview.length>0&&y.position==="center"||this._onWillShowOverlay.fire(new Yt(y,{kind:"edge",panel:void 0,api:this._api,group:void 0,getData:g}))}),_.onDrop(y=>this.dockToLayoutEdge(y.nativeEvent,y.position))),this._moduleRegistry.postConstruct(this),this._shellManager.layoutFromElement()}setVisible(e,t){switch(e.api.location.type){case"grid":super.setVisible(e,t);break;case"floating":{let i=this.floatingGroups.find(n=>n.group===e);i&&(i.overlay.setVisible(t),e.api._onDidVisibilityChange.fire({isVisible:t}));break}case"popout":console.warn("dockview: You cannot hide a group that is in a popout window");break;case"edge":break}}getPopupServiceForGroup(e){var t,i;return(t=(i=this._popoutWindowService)===null||i===void 0||(i=i.findByGroup(e))===null||i===void 0?void 0:i.popupService)!==null&&t!==void 0?t:this.popupService}addPopoutGroup(e,t){return this.mutationAsync("popout",()=>this._doAddPopoutGroup(e,t))}getPopouts(){var e,t;return(e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.entries.map(i=>({id:i.popoutGroup.id,group:i.popoutGroup,window:i.getWindow()})))!==null&&e!==void 0?e:[]}getPopoutWindows(){return this.getPopouts().map(e=>e.window)}_doAddPopoutGroup(e,t){var i,n,s,l,c;let p=We(this._popoutWindowService,"PopoutWindow","api.addPopoutGroup");if(!p||e instanceof ui&&e.model.location.type==="edge")return Promise.resolve(!1);if(e instanceof At&&e.group.size===1&&this.closeEmptyGroups)return this.addPopoutGroup(e.group,t);let v=Ce(this.gridview.element),m=this.element;function f(){var I,A;if(t?.position)return t.position;let N=(e instanceof ui?e.element:(I=(A=e.group)===null||A===void 0?void 0:A.element)!==null&&I!==void 0?I:m).getBoundingClientRect();return{left:window.screenX+N.left,top:window.screenY+N.top,width:N.width,height:N.height}}let _=f(),y=(i=t==null||(n=t.overridePopoutGroup)===null||n===void 0?void 0:n.id)!==null&&i!==void 0?i:this.getNextGroupId(),x=(s=t?.popoutUrl)!==null&&s!==void 0?s:(l=this.options)===null||l===void 0?void 0:l.popoutUrl,k=x??"/popout.html",S=new Gl(`${this.id}-${y}`,v??"",{url:k,left:_.left,top:_.top,width:_.width,height:_.height,onDidOpen:t?.onDidOpen,onWillClose:I=>{var A;t==null||(A=t.onWillClose)===null||A===void 0||A.call(t,I),this._onWillClosePopoutWindow.fire(I)},nonce:(c=this.options)===null||c===void 0?void 0:c.nonce,styleRoot:()=>this.element.getRootNode()}),z=new D(S,S.onDidClose(()=>{z.dispose()}));this._openingPopoutWindows.add(z);let M=Yn(k);return(M?Promise.resolve(null):S.open()).then(I=>{var A,N;if(this._openingPopoutWindows.delete(z),this.isDisposed)return z.dispose(),!1;if(S.isDisposed){let Pe=S.failure;return Pe&&!this.isDisposed&&(Ls(Pe),this._onDidOpenPopoutWindowFail.fire(Pe)),!1}let X=(A=t?.referenceGroup)!==null&&A!==void 0?A:e instanceof At?e.group:e,Z=e.api.location.type,W=X.element.parentElement!==null,U;if(t?.overridePopoutGridview){var oe;U=(oe=t.overridePopoutGroup)!==null&&oe!==void 0?oe:X}else W?t?.overridePopoutGroup?U=t.overridePopoutGroup:(U=this.createGroup({id:y}),I&&this._onDidAddGroup.fire(U)):U=X;if(I===null){var K;return this.handleBlockedPopout({group:U,referenceGroup:X,options:t,popoutWindowDisposable:z,failure:M?{reason:"url-refused",error:M}:(K=S.failure)!==null&&K!==void 0?K:{reason:"blocked"}}),!1}let ee=document.createElement("div");ee.className="dv-overlay-render-container";let fe=new Es(ee,this);U.model.renderContainer=fe;let ue=(N=t?.overridePopoutGridview)!==null&&N!==void 0?N:this.createNestedGridview();t?.overridePopoutGridview?ue.locked=this.gridview.locked:ue.addView(U,ke.Distribute,[0]),ue.element.style.width="100%",ue.element.style.height="100%",ue.layout(S.window.innerWidth,S.window.innerHeight);let ge=!1,ze=()=>{ge||(ge=!0,ue.dispose())},be,ve=[];if(!t?.overridePopoutGroup&&!t?.overridePopoutGridview&&W)if(e instanceof At){let Pe=e.group;this.movingLock(()=>{let Ie=X.model.removePanel(e);U.model.openPanel(Ie)}),ve=[{panel:e,from:Pe}]}else switch(this.movingLock(()=>Ji({from:X,to:U})),ve=U.panels.map(Pe=>({panel:Pe,from:X})),Z){case"grid":X.api.setVisible(!1);break;case"floating":case"popout":var He;be=(He=this.floatingGroups.find(Pe=>Pe.group.api.id===e.api.id))===null||He===void 0?void 0:He.overlay.toJSON(),this.removeGroup(X);break}I.classList.add("dv-dockview"),I.style.overflow="hidden",I.appendChild(ee),I.appendChild(ue.element);let Et=document.createElement("div"),It=new _o(Et,{disabled:this.rootDropTargetContainer.disabled});I.appendChild(Et),U.model.dropTargetContainer=It;let Fs=new Ms(I,S.window);if(z.addDisposables(Fs),U.model.location={type:"popout",getWindow:()=>S.window,popoutUrl:x},t?.overridePopoutGridview){let Pe=this.groups.filter(Ie=>ue.element.contains(Ie.element));for(let Ie of Pe)Ie.model.renderContainer=fe,Ie.model.dropTargetContainer=It,Ie.model.location={type:"popout",getWindow:()=>S.window,popoutUrl:x}}W&&e.api.location.type==="grid"&&e.api.setVisible(!1),this.doSetGroupAndPanelActive(U);let Us=p.observeGridviewSize(S,ue,fe);Us&&z.addDisposables(Us);let Ys=new C;z.addDisposables(Ys);let qs=Pe=>{Ys.value=new D(Pe.api.onDidActiveChange(Ie=>{if(Ie.isActive){var ko;(ko=S.window)===null||ko===void 0||ko.focus()}}),Pe.api.onWillFocus(()=>{var Ie;(Ie=S.window)===null||Ie===void 0||Ie.focus()}))};qs(U);let js={},Uh=W&&X&&this.getPanel(X.id),Mt={window:S,popoutGroup:U,gridview:ue,overlayRenderContainer:fe,dropTargetContainer:It,getWindow:()=>S.window,popoutUrl:x,referenceGroup:Uh?X.id:void 0,popupService:Fs,setAnchorGroup:Pe=>{Mt.popoutGroup=Pe,qs(Pe)},disposable:{dispose:()=>(z.dispose(),js.returnedGroup)}},Js=Ft(S.window);z.addDisposables(Js,Un(S.window,()=>{this._onDidPopoutGroupSizeChange.fire({width:S.window.innerWidth,height:S.window.innerHeight,group:Mt.popoutGroup})}),Js.event(()=>{this._onDidPopoutGroupPositionChange.fire({screenX:S.window.screenX,screenY:S.window.screenY,group:Mt.popoutGroup})}),O(S.window,"resize",()=>{ue.layout(S.window.innerWidth,S.window.innerHeight)}),fe,w.from(()=>this.disposePopoutWindow({group:U,referenceGroup:X,popoutGridview:ue,isGroupAddedToDom:W,floatingBox:be,disposePopoutGridview:ze,closeResult:js}))),p.add(Mt),this._onDidAddPopoutGroup.fire({id:Mt.popoutGroup.id,group:Mt.popoutGroup,window:Mt.getWindow()});for(let{panel:Pe,from:Ie}of ve)this.fireDidMovePanel(Pe,Ie);return!0}).catch(I=>(this._openingPopoutWindows.delete(z),console.error("dockview: failed to create popout.",I),!1))}handleBlockedPopout(e){let{group:t,referenceGroup:i,options:n,popoutWindowDisposable:s,failure:l}=e;if(Ls(l),s.dispose(),this._onDidOpenPopoutWindowFail.fire(l),n?.overridePopoutGridview){let c=n.overridePopoutGridview,p=this.groups.filter(v=>c.element.contains(v.element));for(let v of p)this.movingLock(()=>{c.remove(v),this.redockGroupToMainGrid(v)});c.dispose(),i&&!i.api.isVisible&&i.api.setVisible(!0);return}t===i?this.gridview.element.contains(t.element)||(this.movingLock(()=>this.doAddGroup(t,[0])),t.model.location={type:"grid"}):(this.movingLock(()=>Ji({from:t,to:i})),t.model.size===0&&this._groups.has(t.id)&&(t.dispose(),this._groups.delete(t.id),this._onDidRemoveGroup.fire(t))),i.api.isVisible||i.api.setVisible(!0)}redockGroupToMainGrid(e){e.model.renderContainer=this.overlayRenderContainer,e.model.dropTargetContainer=this.rootDropTargetContainer,e.model.location={type:"grid"},this.doAddGroup(e,[0])}disposePopoutWindow(e){var t;let{group:i,referenceGroup:n,popoutGridview:s,isGroupAddedToDom:l,floatingBox:c,disposePopoutGridview:p,closeResult:v}=e;if(this.isDisposed){p();return}let m=!!(!((t=this._popoutWindowService)===null||t===void 0)&&t.entries.find(k=>k.gridview===s)),f=this.groups.filter(k=>s.element.contains(k.element)),_=f.includes(i),y=_&&f.length===1,x=[];if(m){for(let k of f)if(k!==i){this.movingLock(()=>{this.doRemoveGroup(k,{skipDispose:!0,skipActive:!0,skipPopoutReturn:!0}),this.redockGroupToMainGrid(k)});for(let S of k.panels)x.push({panel:S,from:k})}}if(_&&l&&this.getPanel(n.id)){let k=[...i.panels];this.movingLock(()=>Ji({from:i,to:n}));for(let S of k)x.push({panel:S,from:i});n.api.isVisible||n.api.setVisible(!0),this.getPanel(i.id)&&this.doRemoveGroup(i,{skipPopoutAssociated:!0})}else if(_&&this.getPanel(i.id)){if(i.model.renderContainer=this.overlayRenderContainer,i.model.dropTargetContainer=this.rootDropTargetContainer,v.returnedGroup=i,!m){p();return}if(c&&y)this.addFloatingGroup(i,{height:c.height,width:c.width,position:c});else{this.doRemoveGroup(i,{skipDispose:!0,skipActive:!0,skipPopoutReturn:!0}),i.model.location={type:"grid"},this.movingLock(()=>{this.doAddGroup(i,[0])});for(let k of i.panels)x.push({panel:k,from:i})}this.doSetGroupAndPanelActive(i)}p();for(let{panel:k,from:S}of x)this.fireDidMovePanel(k,S)}addFloatingGroup(e,t){this.mutation("float",()=>this._doAddFloatingGroup(e,t))}_doAddFloatingGroup(e,t){if(!We(this._floatingGroupService,"FloatingGroup","api.addFloatingGroup")||e instanceof ui&&e.model.location.type==="edge")return;let i,n=[];if(e instanceof At){let v=e.group;i=this.createGroup(),this._onDidAddGroup.fire(i),this.movingLock(()=>this.removePanel(e,{removeEmptyGroup:!1,skipDispose:!0,skipSetActiveGroup:!0})),this.removeGroupIfEmpty(v),this.movingLock(()=>i.model.openPanel(e,{skipSetGroupActive:!0})),n=[{panel:e,from:v}]}else{var s;i=e;let v=(s=this._popoutWindowService)===null||s===void 0?void 0:s.findReferenceGroupId(i),m=v?this.getPanel(v):void 0;typeof t?.skipRemoveGroup=="boolean"&&t.skipRemoveGroup||(m?(this.movingLock(()=>Ji({from:e,to:m})),this.doRemoveGroup(e,{skipPopoutReturn:!0,skipPopoutAssociated:!0}),this.doRemoveGroup(m,{skipDispose:!0}),i=m,n=i.panels.map(f=>({panel:f,from:e}))):(this.doRemoveGroup(e,{skipDispose:!0,skipPopoutReturn:!0,skipPopoutAssociated:!1}),n=i.panels.map(f=>({panel:f,from:i}))))}function l(){if(t?.position){let v={};return"left"in t.position?v.left=Math.max(t.position.left,0):"right"in t.position?v.right=Math.max(t.position.right,0):v.left=xt.left,"top"in t.position?v.top=Math.max(t.position.top,0):"bottom"in t.position?v.bottom=Math.max(t.position.bottom,0):v.top=xt.top,typeof t.width=="number"?v.width=Math.max(t.width,0):v.width=xt.width,typeof t.height=="number"?v.height=Math.max(t.height,0):v.height=xt.height,v}return{left:typeof t?.x=="number"?Math.max(t.x,0):xt.left,top:typeof t?.y=="number"?Math.max(t.y,0):xt.top,width:typeof t?.width=="number"?Math.max(t.width,0):xt.width,height:typeof t?.height=="number"?Math.max(t.height,0):xt.height}}let c=l(),p=this.createNestedGridview();p.addView(i,ke.Distribute,[0]),this.mountFloatingWindow(p,i,[i],c,{dragHandle:t?.dragHandle,inDragMode:t?.inDragMode,skipActiveGroup:t?.skipActiveGroup,disableSmartGuides:t?.disableSmartGuides});for(let{panel:v,from:m}of n)this.fireDidMovePanel(v,m)}get closeEmptyGroups(){return this.options.closeEmptyGroups!==!1}keepEmptyGroups(e){var t;return(t=e.keepEmptyGroups)!==null&&t!==void 0?t:!this.closeEmptyGroups}removeGroupIfEmpty(e){e.model.size===0&&this.closeEmptyGroups&&this.doRemoveGroup(e,{skipActive:!0})}get locked(){return this.gridview.locked}set locked(e){this.gridview.locked=e,this._shellManager&&(this._shellManager.locked=e);for(let t of this.nestedGridviews())t.locked=e}nestedGridviews(){var e,t;return[...this.floatingGroups.map(i=>i.gridview),...((e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.entries)!==null&&e!==void 0?e:[]).map(i=>i.gridview)]}createNestedGridview(e="HORIZONTAL"){var t,i;return new to(this.gridview.proportionalLayout,this.options.hideBorders?{separatorBorder:"transparent"}:void 0,e,this.gridview.locked,(t=(i=this.options.theme)===null||i===void 0?void 0:i.gap)!==null&&t!==void 0?t:0)}mountFloatingWindow(e,t,i,n,s){var l,c,p,v,m,f,_,y,x;let k=We(this._floatingGroupService,"FloatingGroup","api.addFloatingGroup");if(!k)return;let S=((l=(c=s?.dragHandle)!==null&&c!==void 0?c:this.options.floatingGroupDragHandle)!==null&&l!==void 0?l:"titlebar")==="titlebar"?new Zc(this,t):void 0,z=new wo(J(J({container:(p=this._floatingOverlayHost)!==null&&p!==void 0?p:this.gridview.element,content:e.element,header:S?.element},n),{},{minimumInViewportWidth:this.options.floatingGroupBounds==="boundedWithinViewport"?void 0:(v=(m=this.options.floatingGroupBounds)===null||m===void 0?void 0:m.minimumWidthWithinViewport)!==null&&v!==void 0?v:100,minimumInViewportHeight:this.options.floatingGroupBounds==="boundedWithinViewport"?void 0:(f=(_=this.options.floatingGroupBounds)===null||_===void 0?void 0:_.minimumHeightWithinViewport)!==null&&f!==void 0?f:100,transformDragPosition:this._buildFloatingDragTransform(t,(y=s?.disableSmartGuides)!==null&&y!==void 0?y:!1),getSiblingBoxes:()=>this._gatherFloatingGroupBoxes(t)})),M=(x=S?.element)!==null&&x!==void 0?x:t.element.querySelector(".dv-void-container");if(!M)throw new Error("dockview: failed to find drag handle");z.setupDrag(M,{inDragMode:typeof s?.inDragMode=="boolean"?s.inDragMode:!1});let I=k.add(t,z,e);I.addDisposables(z.onDidStartMoving(()=>this._onDidStartFloatingGroupDrag.fire(t)),z.onDidChangeEnd(()=>this._onDidEndFloatingGroupDrag.fire(t))),S&&(I.setTitleBar(S),I.addDisposables(S,w.from(()=>I.setTitleBar(void 0)),S.onDragStart(A=>{this._onWillDragGroup.fire({nativeEvent:A,group:I.group})})));for(let A of i)A.model.location={type:"floating"};s?.skipActiveGroup||this.doSetGroupAndPanelActive(t)}orthogonalize(e,t){switch(this.gridview.normalize(),e){case"top":case"bottom":this.gridview.orientation==="HORIZONTAL"&&this.gridview.insertOrthogonalSplitviewAtRoot();break;case"left":case"right":this.gridview.orientation==="VERTICAL"&&this.gridview.insertOrthogonalSplitviewAtRoot();break;default:break}switch(e){case"top":case"left":case"center":return this.createGroupAtLocation([0],void 0,t);case"bottom":case"right":return this.createGroupAtLocation([this.gridview.length],void 0,t);default:throw new Error(`dockview: unsupported position ${e}`)}}updateOptions(e){var t,i;super.updateOptions(e),this.reportMissingOptionModules(e),(t=this._floatingGroupService)===null||t===void 0||t.updateBounds(e),(i=this._rootDropTargetService)===null||i===void 0||i.setOptions(e);let n=this.options.disableDnd,s=this.options.dndStrategy;this._options=J(J({},this.options),e);let l=this.options.disableDnd,c=this.options.dndStrategy;if((n!==l||s!==c)&&this.updateDragAndDropState(),"proportionalLayout"in e){let f=this.gridview.proportionalLayout;for(let _ of this.nestedGridviews())_.proportionalLayout=f}if("theme"in e&&this.updateTheme(),"createRightHeaderActionComponent"in e||"createLeftHeaderActionComponent"in e||"createPrefixHeaderActionComponent"in e){var p;(p=this.headerActionsService)===null||p===void 0||p.refreshAll()}if("createWatermarkComponent"in e){var v;(v=this._watermarkService)===null||v===void 0||v.refresh();for(let f of this.groups)f.model.refreshWatermark()}if("tabGroupColors"in e||"tabGroupAccent"in e){var m;this._tabGroupColorPalette.setEntries((m=this._options.tabGroupColors)!==null&&m!==void 0?m:Vi),this._tabGroupColorPalette.enabled=this._options.tabGroupAccent!=="off";for(let f of this.groups)f.model.refreshTabGroupAccent()}this._onDidOptionsChange.fire(),this._layoutFromShell(this.gridview.width,this.gridview.height)}reportMissingOptionModules(e){oh(e,t=>this._moduleRegistry.has(t))}layout(e,t,i){var n;this._shellManager&&!this._inShellLayout?this._shellManager.layout(e,t):super.layout(e,t,i),this._syncFloatingOverlayHost(),(n=this._moduleRegistry)===null||n===void 0||(n=n.services.floatingGroupService)===null||n===void 0||n.constrainBounds()}_syncFloatingOverlayHost(){if(!this._floatingOverlayHost||!this._shellManager)return;let e=this._shellManager.element.getBoundingClientRect(),t=this.element.getBoundingClientRect(),i=this._floatingOverlayHost;i.style.left=`${t.left-e.left}px`,i.style.top=`${t.top-e.top}px`,i.style.width=`${t.width}px`,i.style.height=`${t.height}px`}_layoutFromShell(e,t){this._inShellLayout=!0,this.layout(e,t,!0),this._inShellLayout=!1}forceRelayout(){this._shellManager?this._layoutFromShell(this.width,this.height):super.forceRelayout()}addEdgeGroup(e,t){let i=this._edgeGroupService;if(!i)throw new Error(vs("EdgeGroup","api.addEdgeGroup"));if(i.has(e))throw new Error(`dockview: edge group already exists at position '${e}'`);return this.mutation("add",()=>{let n=this.createGroup({id:t.id});n.model.location={type:"edge",position:e},n.model.headerPosition=e;let s=n.onDidChange(c=>{var p;if(!c)return;let v=ji(e)?c.width:c.height;typeof v=="number"&&((p=this._shellManager)===null||p===void 0||p.resizeEdgeGroup(e,v))}),l=n.model.onDidRemovePanel(()=>{n.model.isEmpty&&(i.isAutoReveal(n)?queueMicrotask(()=>{var c;n.model.isEmpty&&(!((c=this._edgeGroupService)===null||c===void 0)&&c.includes(n))&&this.removeEdgeGroup(e)}):this.setEdgeGroupCollapsed(n,!0))});return i.add(e,n,new D(l,s)),t.autoHide!==void 0&&i.setAutoHide(n,t.autoHide),t.autoReveal!==void 0&&i.setAutoReveal(n,t.autoReveal),this._onDidAddGroup.fire(n),this._shellManager.addEdgeView(e,t,n),n.api})}revealEdgeGroupWithData(e,t,i){let n=this._edgeGroupService;n&&this.mutation("add",()=>{var s;let l=n.get(e);l||(this.addEdgeGroup(e,{id:this.getNextGroupId(),autoReveal:!0,autoHide:i?.autoHide,collapsed:!0}),l=n.get(e)),l&&this.moveGroupOrPanel({from:{groupId:t.groupId,panelId:(s=t.panelId)!==null&&s!==void 0?s:void 0},to:{group:l,position:"center"}})})}getEdgeGroup(e){var t;return(t=this._edgeGroupService)===null||t===void 0||(t=t.get(e))===null||t===void 0?void 0:t.api}getEdgeGroupPanel(e){var t;return(t=this._edgeGroupService)===null||t===void 0?void 0:t.get(e)}pinEdgeGroup(e){var t;(t=We(this._moduleRegistry.services.autoHideEdgeGroupService,"AutoHideEdgeGroup","api.pinEdgeGroup"))===null||t===void 0||t.pin(e)}autoHideEdgeGroup(e){var t;(t=We(this._moduleRegistry.services.autoHideEdgeGroupService,"AutoHideEdgeGroup","api.autoHideEdgeGroup"))===null||t===void 0||t.autoHide(e)}peekEdgeGroup(e,t){var i;(i=We(this._moduleRegistry.services.autoHideEdgeGroupService,"AutoHideEdgeGroup","api.peekEdgeGroup"))===null||i===void 0||i.peek(e,t)}get overlayRoot(){return this.rootElement}getDropZoneRect(){return this.element.getBoundingClientRect()}getEdgeGroupExpandedSize(e){var t,i;return(t=(i=this._shellManager)===null||i===void 0?void 0:i.getEdgeGroupExpandedSize(e))!==null&&t!==void 0?t:0}repositionPanelOverlay(e,t,i){this.overlayRenderContainer.repositionPanelOverlay(e.api.id,t,i)}setEdgeGroupVisible(e,t){this._shellManager.setEdgeGroupVisible(e,t)}isEdgeGroupVisible(e){return this._shellManager.isEdgeGroupVisible(e)}removeEdgeGroup(e){let t=We(this._edgeGroupService,"EdgeGroup","api.removeEdgeGroup");if(!t)return;let i=t.get(e);if(!i)throw new Error(`dockview: no edge group exists at position '${e}'`);this.mutation("remove",()=>{for(let n of[...i.panels])this.removePanel(n,{removeEmptyGroup:!1,skipDispose:!1});this._shellManager.removeEdgeView(e),t.remove(e),i.dispose(),this._groups.delete(i.id),this._onDidRemoveGroup.fire(i),this.activateFallbackGroupIfRemoved(i)})}setEdgeGroupCollapsed(e,t){var i;let n=(i=this._edgeGroupService)===null||i===void 0?void 0:i.findPositionOf(e);n&&this._shellManager.isEdgeGroupCollapsed(n)!==t&&(this._shellManager.setEdgeGroupCollapsed(n,t),e.api._onDidCollapsedChange.fire({isCollapsed:t}))}isEdgeGroupCollapsed(e){var t;let i=(t=this._edgeGroupService)===null||t===void 0?void 0:t.findPositionOf(e);return i?this._shellManager.isEdgeGroupCollapsed(i):!1}isEdgeGroupPeeking(e){return this._peekingGroups.has(e)}setEdgeGroupPeeking(e,t){this._peekingGroups.has(e)!==t&&(t?this._peekingGroups.add(e):this._peekingGroups.delete(e),e.api._onDidPeekChange.fire({isPeeking:t}))}isEdgeGroupAutoHide(e){var t,i;let n=(t=this._edgeGroupService)===null||t===void 0?void 0:t.isAutoHide(e);if(n!==void 0)return n;let s=(i=this._edgeGroupService)===null||i===void 0?void 0:i.findPositionOf(e);return s===void 0?!1:Zr(this.options.autoHideEdgeGroups,s)}setEdgeGroupAutoHide(e,t){let i=this._edgeGroupService;i?.includes(e)&&(i.setAutoHide(e,t),this._onDidEdgeGroupAutoHideChange.fire(e))}updateDragAndDropState(){for(let e of this.groups)e.model.updateDragAndDropState()}focus(){var e;(e=this.activeGroup)===null||e===void 0||e.focus()}getGroupPanel(e){return this.panels.find(t=>t.id===e)}setActivePanel(e){e.group.model.openPanel(e),this.doSetGroupAndPanelActive(e.group)}activateNext(e={}){var t;if(!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}if(e.includePanel&&e.group&&e.group.activePanel!==e.group.panels[e.group.panels.length-1]){e.group.model.moveToNext({suppressRoll:!0});return}let i=we(e.group.element),n=(t=this.gridview.next(i))===null||t===void 0?void 0:t.view;this.doSetGroupAndPanelActive(n)}activatePrevious(e={}){var t;if(!e.group){if(!this.activeGroup)return;e.group=this.activeGroup}if(e.includePanel&&e.group&&e.group.activePanel!==e.group.panels[0]){e.group.model.moveToPrevious({suppressRoll:!0});return}let i=we(e.group.element),n=(t=this.gridview.previous(i))===null||t===void 0?void 0:t.view;n&&this.doSetGroupAndPanelActive(n)}toJSON(){var e,t,i,n,s;let l=this.gridview.serialize(),c=this.panels.reduce((_,y)=>(_[y.id]=y.toJSON(),_),{}),p=(e=(t=this._floatingGroupService)===null||t===void 0?void 0:t.serialize())!==null&&e!==void 0?e:[],v=(i=(n=this._popoutWindowService)===null||n===void 0?void 0:n.serialize())!==null&&i!==void 0?i:[],m={grid:l,panels:c,activeGroup:(s=this.activeGroup)===null||s===void 0?void 0:s.id};p.length>0&&(m.floatingGroups=p),v.length>0&&(m.popoutGroups=v);let f=this._serializeEdgeGroups();return f&&(m.edgeGroups=f),m}_serializeEdgeGroups(){var e;if(!(!((e=this._edgeGroupService)===null||e===void 0)&&e.hasAny()))return;let t=this._shellManager.toJSON();for(let[i,n]of this._edgeGroupService.entries()){let s=t[i];if(!s)continue;if(this._edgeGroupService.isAutoReveal(n)&&n.model.isEmpty){delete t[i];continue}s.group=n.toJSON(),this._edgeGroupService.isAutoReveal(n)&&(s.autoReveal=!0);let l=this._edgeGroupService.isAutoHide(n);l!==void 0&&(s.autoHide=l)}return t}fromJSON(e,t){this.mutation("load",()=>this._doFromJSON(e,t))}_doFromJSON(e,t){var i,n;if((i=this._popoutWindowService)===null||i===void 0||i.cancelPendingRestorations(),typeof e!="object"||e===null)throw new Error("dockview: serialized layout must be a non-null object");if(!e.grid||((n=e.grid.root)===null||n===void 0?void 0:n.type)!=="branch"||!Array.isArray(e.grid.root.data))throw new Error("dockview: root must be of type branch");let s=new Map,l=new Map,c=[],p=[],v=()=>{for(let A of p)try{A.dispose()}catch(N){console.error("dockview: failed to dispose a temporary group created for reuseExistingPanels",N)}p.length=0};if(t?.reuseExistingPanels){let A=Object.keys(e.panels),N,X=()=>{let Z=this.createGroup(),W=this._groups.get(Z.api.id);return this._groups.delete(Z.api.id),p.push(w.from(()=>{var U;this.movingLock(()=>{for(let oe of Z.panels.slice())Z.model.removePanel(oe)}),W?.disposable.dispose(),(U=this.headerActionsService)===null||U===void 0||U.disposeGroup(Z),Z.dispose()})),Z};try{for(let Z of this.panels)if(A.includes(Z.api.id)){s.set(Z.api.id,Z);let W;if(Z.api.renderer==="always"&&Z.api.isVisible)W=X();else{var m;(m=N)!==null&&m!==void 0||(N=X()),W=N}l.set(Z.api.id,W),c.push({panel:Z,temporaryGroup:W})}this.movingLock(()=>{c.forEach(({panel:Z,temporaryGroup:W})=>{this.moveGroupOrPanel({from:{groupId:Z.api.group.api.id,panelId:Z.api.id},to:{group:W,position:"center"},keepEmptyGroups:!0})})}),this.clear()}catch(Z){throw v(),Z}}else this.clear();let{grid:f,panels:_,activeGroup:y}=e;try{var x,k,S,z,M;let A=this.width,N=this.height,X=W=>{let{id:U,locked:oe,hideHeader:K,headerPosition:ee,views:fe,activeView:ue}=W;if(typeof U!="string")throw new TypeError("dockview: group id must be of type string");let ge=this.createGroup({id:U,locked:!!oe,hideHeader:!!K,headerPosition:ee});this._onDidAddGroup.fire(ge);let ze=[],be=fe.filter(ve=>_[ve]);for(let ve of be){let He=s.get(ve),Et=l.get(ve);if(Et&&He)this.movingLock(()=>{Et.model.removePanel(He)}),ze.push(He),He.updateFromStateModel(_[ve]);else{let It=this._deserializer.fromJSON(_[ve],ge);ze.push(It)}}for(let ve of ze){let He=typeof ue=="string"&&ue===ve.id;s.has(ve.api.id)?this.movingLock(()=>{ge.model.openPanel(ve,{skipSetActive:!He,skipSetGroupActive:!0})}):ge.model.openPanel(ve,{skipSetActive:!He,skipSetGroupActive:!0})}return W.tabGroups&&W.tabGroups.length>0&&ge.model.restoreTabGroups(W.tabGroups),!ge.activePanel&&ge.panels.length>0&&ge.model.openPanel(ge.panels[ge.panels.length-1],{skipSetGroupActive:!0}),ge};this.gridview.deserialize(f,{fromJSON:W=>X(W.data)}),this._layoutFromShell(A,N),e.edgeGroups&&this.deserializeEdgeGroups(e.edgeGroups,_,s,l),this.deserializeFloatingWindows((x=e.floatingGroups)!==null&&x!==void 0?x:[],X);let Z=this.deserializePopoutWindows((k=e.popoutGroups)!==null&&k!==void 0?k:[],X);if((S=this._popoutWindowService)===null||S===void 0||S.finishRestoration(Z),(z=this._floatingGroupService)===null||z===void 0||z.constrainBounds(),typeof y=="string"){let W=this.getPanel(y);W&&this.doSetGroupAndPanelActive(W)}(M=this._watermarkService)===null||M===void 0||M.update()}catch(A){var I;console.error("dockview: failed to deserialize layout. Reverting changes",A);for(let N of this.groups)for(let X of N.panels)this.removePanel(X,{removeEmptyGroup:!1,skipDispose:!1});for(let N of this.groups)N.dispose(),this._groups.delete(N.id),this._onDidRemoveGroup.fire(N);throw(I=this._floatingGroupService)===null||I===void 0||I.disposeAll(),this.clear(),A}finally{v()}this.debouncedUpdateAllPositions(),this._onDidLayoutFromJSON.fire()}deserializeNestedGridview(e,t){let i=this.createNestedGridview(e.orientation),n=[];return i.deserialize(e,{fromJSON:s=>{let l=t(s.data);return n.push(l),l}}),{gridview:i,members:n}}deserializeEdgeGroups(e,t,i,n){let s=We(this._edgeGroupService,"EdgeGroup","fromJSON edge restoration");if(s){for(let c of["top","bottom","left","right"]){let p=e[c];if(p&&!s.has(c)){var l;let v=p.group,m=(l=v?.id)!==null&&l!==void 0?l:`${c}-group`;this.addEdgeGroup(c,{id:m,autoReveal:p.autoReveal,autoHide:p.autoHide,minimumSize:p.minimumSize,maximumSize:p.maximumSize,collapsedSize:p.collapsedSize})}}for(let[c,p]of s.entries()){let v=e[c],m=v?.group;if(m){let{views:f,activeView:_}=m,y=[];for(let x of f){if(!t[x])continue;let k=i.get(x),S=n.get(x);if(S&&k)this.movingLock(()=>{S.model.removePanel(k)}),y.push(k),k.updateFromStateModel(t[x]);else{let z=this._deserializer.fromJSON(t[x],p);y.push(z)}}for(let x of y){let k=_===x.id;i.has(x.api.id)?this.movingLock(()=>{p.model.openPanel(x,{skipSetActive:!k,skipSetGroupActive:!0})}):p.model.openPanel(x,{skipSetActive:!k,skipSetGroupActive:!0})}m.tabGroups&&m.tabGroups.length>0&&p.model.restoreTabGroups(m.tabGroups),!p.activePanel&&p.panels.length>0&&p.model.openPanel(p.panels[p.panels.length-1],{skipSetGroupActive:!0})}}this._shellManager.fromJSON(e)}}deserializeFloatingWindows(e,t){for(let i of e){let{data:n,grid:s,position:l}=i;if(s){let{gridview:c,members:p}=this.deserializeNestedGridview(s,t);if(p.length===0)continue;this.mountFloatingWindow(c,p[0],p,l,{inDragMode:!1})}else if(n){let c=t(n);this.addFloatingGroup(c,{position:l,width:l.width,height:l.height,skipRemoveGroup:!0,inDragMode:!1})}}}deserializePopoutWindows(e,t){let i=e.length>0?We(this._popoutWindowService,"PopoutWindow","fromJSON popout restoration"):this._popoutWindowService;return i?e.flatMap((n,s)=>{let{data:l,grid:c,position:p,gridReferenceGroup:v,url:m}=n,f,_=[];if(c){let x=this.deserializeNestedGridview(c,t);if(f=x.gridview,_=x.members,_.length===0)return f.dispose(),[]}let y=c?_[0]:t(l);return i.scheduleRestoration(s*100,()=>this.addPopoutGroup(y,{position:p??void 0,overridePopoutGroup:v?y:void 0,overridePopoutGridview:f,referenceGroup:v?this.getPanel(v):void 0,popoutUrl:m}),()=>{for(let x of _.length>0?_:[y])if(!this.isDisposed&&this._groups.has(x.id)&&x.element.parentElement===null){for(let k of[...x.panels])this.removePanel(k,{removeEmptyGroup:!1});x.dispose(),this._groups.delete(x.id),this._onDidRemoveGroup.fire(x)}})}):[]}clear(){this.mutation("clear",()=>this._doClear())}_doClear(){let e=Array.from(this._groups.values()).map(n=>n.value),t=!!this.activeGroup;for(let n of e){var i;if(!((i=this._edgeGroupService)===null||i===void 0)&&i.includes(n)){let s=[...n.panels];for(let l of s)this.removePanel(l,{removeEmptyGroup:!1});continue}this.removeGroup(n,{skipActive:!0})}t&&this.doSetGroupAndPanelActive(void 0),this.gridview.clear()}closeAllGroups(){this.mutation("remove",()=>{let e=Array.from(this._groups.values()).map(t=>t.value);for(let t of e){if(!this._groups.has(t.id))continue;t.model.closeAllPanels();let i=this.options.noPanelsOverlay==="emptyGroup"&&this._groups.size===1;!this.closeEmptyGroups&&!i&&this._groups.has(t.id)&&t.model.size===0&&this.removeGroup(t,{skipActive:!0})}})}addPanel(e){return this.mutation("add",()=>this._doAddPanel(e))}_doAddPanel(e){if(this.panels.some(f=>f.id===e.id))throw new Error(`dockview: panel with id ${e.id} already exists`);let t;if(e.position&&e.floating)throw new Error("dockview: you can only provide one of: position, floating as arguments to .addPanel(...)");let i={width:e.initialWidth,height:e.initialHeight},n,s=f=>!!e.inactive&&f.model.size>0;if(e.position)if(Qr(e.position)){let f=typeof e.position.referencePanel=="string"?this.getGroupPanel(e.position.referencePanel):e.position.referencePanel;if(n=e.position.index,!f){var l;let _=typeof e.position.referencePanel=="string"?e.position.referencePanel:(l=e.position.referencePanel)===null||l===void 0?void 0:l.id;throw new Error(`dockview: referencePanel '${_}' does not exist`)}t=this.findGroup(f)}else if(es(e.position)){var c;if(t=typeof e.position.referenceGroup=="string"?(c=this._groups.get(e.position.referenceGroup))===null||c===void 0?void 0:c.value:e.position.referenceGroup,n=e.position.index,!t){var p;let f=typeof e.position.referenceGroup=="string"?e.position.referenceGroup:(p=e.position.referenceGroup)===null||p===void 0?void 0:p.id;throw new Error(`dockview: referenceGroup '${f}' does not exist`)}}else{let f=this.orthogonalize(so(e.position.direction)),_=this.createPanel(e,f);return f.model.openPanel(_,{skipSetActive:s(f),skipSetGroupActive:e.inactive,index:n}),e.inactive||this.doSetGroupAndPanelActive(f),f.api.setSize({height:i?.height,width:i?.width}),_}else t=this.activeGroup;let v;if(t){var m;let f=li(((m=e.position)===null||m===void 0?void 0:m.direction)||"within");if(e.floating){let _=this.createGroup();this._onDidAddGroup.fire(_);let y=typeof e.floating=="object"&&e.floating!==null?e.floating:{};this.addFloatingGroup(_,J(J({},y),{},{inDragMode:!1,skipRemoveGroup:!0,skipActiveGroup:!0})),v=this.createPanel(e,_),_.model.openPanel(v,{skipSetActive:s(_),skipSetGroupActive:e.inactive,index:n})}else if(t.api.location.type==="floating"||t.api.location.type==="edge"||f==="center")v=this.createPanel(e,t),t.model.openPanel(v,{skipSetActive:s(t),skipSetGroupActive:e.inactive,index:n}),t.api.setSize({width:i?.width,height:i?.height}),e.inactive||this.doSetGroupAndPanelActive(t);else{let _=we(t.element),y=Ve(this.gridview.orientation,_,f),x=this.createGroupAtLocation(y,this.orientationAtLocation(y)==="VERTICAL"?i?.height:i?.width);v=this.createPanel(e,x),x.model.openPanel(v,{skipSetActive:s(x),skipSetGroupActive:e.inactive,index:n}),e.inactive||this.doSetGroupAndPanelActive(x)}}else if(e.floating){let f=this.createGroup();this._onDidAddGroup.fire(f);let _=typeof e.floating=="object"&&e.floating!==null?e.floating:{};this.addFloatingGroup(f,J(J({},_),{},{inDragMode:!1,skipRemoveGroup:!0,skipActiveGroup:!0})),v=this.createPanel(e,f),f.model.openPanel(v,{skipSetActive:s(f),skipSetGroupActive:e.inactive,index:n})}else{let f=this.createGroupAtLocation([0],this.gridview.orientation==="VERTICAL"?i?.height:i?.width);v=this.createPanel(e,f),f.model.openPanel(v,{skipSetActive:s(f),skipSetGroupActive:e.inactive,index:n}),e.inactive||this.doSetGroupAndPanelActive(f)}return v}removePanel(e,t){this.mutation("remove",()=>{var i;return this._doRemovePanel(e,{removeEmptyGroup:(i=t?.removeEmptyGroup)!==null&&i!==void 0?i:this.closeEmptyGroups,skipDispose:t?.skipDispose,skipSetActiveGroup:t?.skipSetActiveGroup})})}_doRemovePanel(e,t){let i=e.group;if(!i)throw new Error(`dockview: cannot remove panel ${e.id}. it's missing a group.`);i.model.removePanel(e,{skipSetActiveGroup:t.skipSetActiveGroup}),t.skipDispose||(e.group.model.renderContainer.detatch(e),e.dispose()),i.size===0&&t.removeEmptyGroup&&this.removeGroup(i,{skipActive:t.skipSetActiveGroup})}createWatermarkComponent(){return this.options.createWatermarkComponent?this.options.createWatermarkComponent():new Kc}addGroup(e){return this.mutation("add",()=>this._doAddGroup(e))}_doAddGroup(e){if(e){let s;if(ts(e)){var t;let f=typeof e.referencePanel=="string"?this.panels.find(y=>y.id===e.referencePanel):e.referencePanel,_=typeof e.referencePanel=="string"?e.referencePanel:(t=e.referencePanel)===null||t===void 0?void 0:t.id;if(!f)throw new Error(`dockview: reference panel ${_} does not exist`);if(s=this.findGroup(f),!s)throw new Error(`dockview: reference group for reference panel ${_} does not exist`)}else if(is(e)){var i;if(s=typeof e.referenceGroup=="string"?(i=this._groups.get(e.referenceGroup))===null||i===void 0?void 0:i.value:e.referenceGroup,!s){var n;let f=typeof e.referenceGroup=="string"?e.referenceGroup:(n=e.referenceGroup)===null||n===void 0?void 0:n.id;throw new Error(`dockview: reference group ${f} does not exist`)}}else{let f=this.orthogonalize(so(e.direction),e);return e.skipSetActive||this.doSetGroupAndPanelActive(f),f}let l=li(e.direction||"within"),c=we(s.element),p=Ve(this.gridview.orientation,c,l),v=this.createGroup(e),m=this.getLocationOrientation(p)==="VERTICAL"?e.initialHeight:e.initialWidth;return this.doAddGroup(v,p,m),e.skipSetActive||this.doSetGroupAndPanelActive(v),v}else{let s=this.createGroup(e);return this.doAddGroup(s),this.doSetGroupAndPanelActive(s),s}}getLocationOrientation(e){return e.length%2==0&&this.gridview.orientation==="HORIZONTAL"?"HORIZONTAL":"VERTICAL"}removeGroup(e,t){this.mutation("remove",()=>this.doRemoveGroup(e,t))}detachFromNestedWindow(e){var t,i;let n=(t=this._floatingGroupService)===null||t===void 0?void 0:t.findByGroup(e);if(n){let l=this.nestedWindowMembers(e);return l.length<=1?!1:(n.gridview.remove(e),n.group===e&&n.setAnchorGroup(l.find(c=>c!==e)),!0)}let s=(i=this._popoutWindowService)===null||i===void 0?void 0:i.findByGroup(e);if(s){let l=this.nestedWindowMembers(e);return l.length<=1?!1:(s.gridview.remove(e),s.popoutGroup===e&&s.setAnchorGroup(l.find(c=>c!==e)),!0)}return!1}disposeGroupRecord(e){e.dispose(),this._groups.delete(e.id),this._onDidRemoveGroup.fire(e)}activateFallbackGroupIfRemoved(e,t){if(!t&&this._activeGroup===e){let i=Array.from(this._groups.values());this.doSetGroupAndPanelActive(i.length>0?i[0].value:void 0)}}doRemoveGroup(e,t){var i;if(!((i=this._edgeGroupService)===null||i===void 0)&&i.includes(e))return e;let n=[...e.panels];if(!t?.skipDispose)for(let f of n){var s;this.removePanel(f,{removeEmptyGroup:!1,skipDispose:(s=t?.skipDispose)!==null&&s!==void 0?s:!1})}let l=this.activePanel;if(e.api.location.type==="floating"){var c;let f=(c=this._floatingGroupService)===null||c===void 0?void 0:c.findByGroup(e);if(!f)throw new Error("dockview: failed to find floating group");return this.detachFromNestedWindow(e)?(t?.skipDispose?e.model.location={type:"grid"}:this.disposeGroupRecord(e),this.activateFallbackGroupIfRemoved(e,t?.skipActive),e):(t?.skipDispose||this.disposeGroupRecord(e),f.dispose(),this.activateFallbackGroupIfRemoved(e,t?.skipActive),e)}if(e.api.location.type==="popout"){var p,v;let f=(p=this._popoutWindowService)===null||p===void 0?void 0:p.findByGroup(e);if(!f)throw new Error("dockview: failed to find popout group");if(this.detachFromNestedWindow(e))return t?.skipDispose?e.model.location={type:"grid"}:this.disposeGroupRecord(e),this.activateFallbackGroupIfRemoved(e,t?.skipActive),e;if(!t?.skipDispose){if(!t?.skipPopoutAssociated){let y=f.referenceGroup?this.getPanel(f.referenceGroup):void 0;y?.panels.length===0&&(this.closeEmptyGroups||!y.api.isVisible)&&this.removeGroup(y)}f.popoutGroup.dispose(),this._groups.delete(e.id),this._onDidRemoveGroup.fire(e)}(v=this._popoutWindowService)===null||v===void 0||v.remove(f);let _=f.disposable.dispose();return!t?.skipPopoutReturn&&_&&(this.doAddGroup(_,[0]),this.doSetGroupAndPanelActive(_)),this.activateFallbackGroupIfRemoved(e,t?.skipActive),f.popoutGroup}if(!this.gridview.element.contains(e.element)){if(!t?.skipDispose){let f=this._groups.get(e.id);f?.disposable.dispose(),this.disposeGroupRecord(e)}return this.activateFallbackGroupIfRemoved(e,t?.skipActive),e}let m=super.doRemoveGroup(e,t);return t?.skipActive||this.activePanel!==l&&this.fireActivePanelChange(this.activePanel),m}debouncedUpdateAllPositions(){this._updatePositionsFrameId!==void 0&&cancelAnimationFrame(this._updatePositionsFrameId),this._updatePositionsFrameId=requestAnimationFrame(()=>{var e,t;this._updatePositionsFrameId=void 0,this.overlayRenderContainer.updateAllPositions();for(let i of(e=(t=this._popoutWindowService)===null||t===void 0?void 0:t.entries)!==null&&e!==void 0?e:[])i.overlayRenderContainer.updateAllPositions()})}movingLock(e){let t=this._moving;try{return this._moving=!0,e()}finally{this._moving=t}}mutation(e,t){let i=this.openMutation(e);this._syncMutationDepth++;try{return t()}finally{this._syncMutationDepth--,this._syncMutationDepth===0&&this.releaseDisposedActiveGroup(),i()}}mutationAsync(e,t){var i=this;return Dr(function*(){let n=i.openMutation(e);try{return yield t()}finally{n()}})()}openMutation(e){let t=this._origin;return this._mutationDepth===0&&this._onWillMutateLayout.fire({kind:e,origin:t}),this._mutationDepth++,()=>{this._mutationDepth--,this._mutationDepth===0&&(this.releaseDisposedActiveGroup(),this.flushLocationChanges(),this._onDidMutateLayout.fire({kind:e,origin:t}))}}releaseDisposedActiveGroup(){var e;!this.isDisposed&&(!((e=this._activeGroup)===null||e===void 0)&&e.model.isDisposed)&&this.activateFallbackGroupIfRemoved(this._activeGroup)}deferLocationChange(e,t){if(this._mutationDepth===0){t();return}this._pendingLocationChanges.set(e,t)}flushLocationChanges(){if(this._pendingLocationChanges.size===0)return;let e=Array.from(this._pendingLocationChanges.values());this._pendingLocationChanges.clear();for(let t of e)t()}currentOrigin(){return this._origin}withOrigin(e,t){if(this._originDepth>0||this._mutationDepth>0)return t();let i=this._origin;this._origin=e,this._originDepth++;try{return t()}finally{this._originDepth--,this._origin=i}}fireActivePanelChange(e){this._onDidActivePanelChange.fire({panel:e,origin:this._origin})}fireDidMovePanel(e,t){this._onDidMovePanel.fire({panel:e,from:t,to:e.group})}moveGroupOrPanel(e){this.mutation("move",()=>this._doMoveGroupOrPanel(e))}_doMoveGroupOrPanel(e){var t;let i=e.to.group,n=e.from.groupId,s=e.from.panelId,l=e.to.position,c=e.to.index,p=n?(t=this._groups.get(n))===null||t===void 0?void 0:t.value:void 0;if(!p)throw new Error(`dockview: Failed to find group id ${n}`);if(s===void 0){e.from.tabGroupId?this.moveTabGroupToGroup({sourceGroup:p,tabGroupId:e.from.tabGroupId,destinationGroup:i,destinationTarget:l,destinationIndex:c,skipSetActive:e.skipSetActive,keepEmptyGroups:e.keepEmptyGroups}):this.moveGroup({from:{group:p},to:{group:i,position:l},skipSetActive:e.skipSetActive});return}if(!l||l==="center"){let m=this.movingLock(()=>p.model.removePanel(s,{skipSetActive:!1,skipSetActiveGroup:!0}));if(!m)throw new Error(`dockview: No panel with id ${s}`);!this.keepEmptyGroups(e)&&p.model.size===0&&p!==i&&this.doRemoveGroup(p,{skipActive:!0});let f=i.model.size===0;this.movingLock(()=>{var _;return i.model.openPanel(m,{index:c,skipSetActive:((_=e.skipSetActive)!==null&&_!==void 0?_:!1)&&!f,skipSetGroupActive:!0})}),e.skipSetActive||this.doSetGroupAndPanelActive(i),this.fireDidMovePanel(m,p)}else{let m=this.getGridviewForGroup(i),f=we(i.element),_=Ve(m.orientation,f,l);if(p.size<2&&!this.keepEmptyGroups(e)){let[y,x]=Ze(_);if(p.api.location.type==="grid"&&m===this.gridview){let[M,I]=Ze(we(p.element));if(qn(M,y)){this.gridview.moveView(M,I,x),this.fireDidMovePanel(this.getGroupPanel(s),p);return}}if(p.api.location.type==="popout"&&this.nestedWindowMembers(p).length<=1){var v;let M=(v=this._popoutWindowService)===null||v===void 0?void 0:v.findByGroup(p);if(!M)return;let I=this.movingLock(()=>M.popoutGroup.model.removePanel(M.popoutGroup.panels[0],{skipSetActive:!0,skipSetActiveGroup:!0}));this.doRemoveGroup(p,{skipActive:!0});let A=Ve(m.orientation,we(i.element),l),N=this.createGroupAtLocation(A,this.dropSizing(we(i.element)),void 0,m);this.movingLock(()=>N.model.openPanel(I,{skipSetActive:!0})),this.doSetGroupAndPanelActive(N),this.fireDidMovePanel(this.getGroupPanel(s),p);return}if(p.api.location.type==="edge"){let M=this.movingLock(()=>p.model.removePanel(s,{skipSetActive:!1,skipSetActiveGroup:!0}));if(!M)throw new Error(`dockview: No panel with id ${s}`);let I=this.createGroupAtLocation(_,this.dropSizing(f),void 0,m);this.movingLock(()=>I.model.openPanel(M,{skipSetGroupActive:!0})),this.doSetGroupAndPanelActive(I),this.fireDidMovePanel(M,p);return}let k=this.movingLock(()=>this.doRemoveGroup(p,{skipActive:!0,skipDispose:!0})),S=we(i.element),z=Ve(m.orientation,S,l);this.movingLock(()=>this.doAddGroup(k,z,this.dropSizing(S),m)),this.setGroupLocationForRoot(k,m),this.doSetGroupAndPanelActive(k),this.fireDidMovePanel(this.getGroupPanel(s),p)}else{let y=this.movingLock(()=>p.model.removePanel(s,{skipSetActive:!1,skipSetActiveGroup:!0}));if(!y)throw new Error(`dockview: No panel with id ${s}`);let x=Ve(m.orientation,f,l),k=this.createGroupAtLocation(x,this.dropSizing(f),void 0,m);this.movingLock(()=>k.model.openPanel(y,{skipSetGroupActive:!0})),this.doSetGroupAndPanelActive(k),this.fireDidMovePanel(y,p)}}}moveTabGroupToGroup(e){let{sourceGroup:t,tabGroupId:i,destinationGroup:n,destinationTarget:s,destinationIndex:l}=e,c=t.model.getTabGroups().find(z=>z.id===i);if(!c||c.panelIds.length===0)return;let p=c.label,v=c.color,m=c.collapsed,f=c.componentParams,_=[...c.panelIds],y=s&&s!=="center"?we(n.element):void 0,x=this.movingLock(()=>_.map(z=>t.model.removePanel(z,{skipSetActive:!1,skipSetActiveGroup:!0})).filter(z=>z!==void 0));if(x.length===0)return;let k=z=>{this.movingLock(()=>{for(let I of x)z.model.openPanel(I,{index:l,skipSetActive:!0,skipSetGroupActive:!0})});let M=z.model.createTabGroup({label:p,color:v,collapsed:m,componentParams:f});for(let I of x)z.model.addPanelToTabGroup(M.id,I.id);e.skipSetActive||this.doSetGroupAndPanelActive(z);for(let I of x)this.fireDidMovePanel(I,t)},S;if(!s||s==="center"||!y)S=n;else{let z=Ve(this.gridview.orientation,y,s);S=this.createGroupAtLocation(z,this.dropSizing(y))}!this.keepEmptyGroups(e)&&t.model.size===0&&t!==S&&this.doRemoveGroup(t,{skipActive:!0}),k(S)}moveGroup(e){this.mutation("move",()=>this._doMoveGroup(e))}maximizeGroup(e){this.mutation("maximize",()=>super.maximizeGroup(e))}exitMaximizedGroup(){this.mutation("maximize",()=>super.exitMaximizedGroup())}_doMoveGroup(e){var t;let i=e.from.group,n=e.to.group,s=e.to.position;if(s==="center"&&i===n)return;let l=i,c;if(s==="center"){let _=i.activePanel,y=i.model.getTabGroups().map(k=>({label:k.label,color:k.color,collapsed:k.collapsed,componentParams:k.componentParams,panelIds:[...k.panelIds]})),x=this.movingLock(()=>[...i.panels].map(k=>i.model.removePanel(k.id,{skipSetActive:!0})));i?.model.size===0&&this.doRemoveGroup(i,{skipActive:!0}),this.movingLock(()=>{for(let k of x)n.model.openPanel(k,{skipSetActive:k!==_,skipSetGroupActive:!0})}),c=x;for(let k of y){let S=n.model.createTabGroup({label:k.label,color:k.color,collapsed:k.collapsed,componentParams:k.componentParams});for(let z of k.panelIds)n.model.addPanelToTabGroup(S.id,z)}e.skipSetActive!==!0?this.doSetGroupAndPanelActive(n):this.activePanel||this.doSetGroupAndPanelActive(n)}else{let _=(()=>{if(i.api.location.type==="edge"||n.api.location.type==="edge")return!1;let y=this.getGridviewForGroup(i);if(y!==this.getGridviewForGroup(n))return!1;let x,k;try{x=we(i.element),k=we(n.element)}catch{return!1}return x.length===0||k.length===0?!1:qn(Ze(x)[0],Ze(k)[0])&&Qn(y.orientation,k)===Mi(s)})();if(i.api.location.type==="edge"){let y=i.activePanel,x=i.model.getTabGroups().map(S=>({label:S.label,color:S.color,collapsed:S.collapsed,componentParams:S.componentParams,panelIds:[...S.panelIds]})),k=this.movingLock(()=>[...i.panels].map(S=>i.model.removePanel(S.id,{skipSetActive:!0})));l=this.createGroup(),this._onDidAddGroup.fire(l),this.movingLock(()=>{for(let S of k)l.model.openPanel(S,{skipSetActive:S!==y,skipSetGroupActive:!0})});for(let S of x){let z=l.model.createTabGroup({label:S.label,color:S.color,collapsed:S.collapsed,componentParams:S.componentParams});for(let M of S.panelIds)l.model.addPanelToTabGroup(z.id,M)}}else switch(i.api.location.type){case"grid":this.gridview.removeView(we(i.element));break;case"floating":{var p;let y=(p=this._floatingGroupService)===null||p===void 0?void 0:p.findByGroup(i);if(!y)throw new Error("dockview: failed to find floating group");this.detachFromNestedWindow(i)||y.dispose();break}case"popout":{var v,m;let y=(v=this._popoutWindowService)===null||v===void 0?void 0:v.findByGroup(i);if(!y)throw new Error("dockview: failed to find popout group");if(this.detachFromNestedWindow(i))break;if((m=this._popoutWindowService)===null||m===void 0||m.remove(y),y.referenceGroup){let x=this.getPanel(y.referenceGroup);x&&!x.api.isVisible&&this.doRemoveGroup(x,{skipActive:!0})}y.window.dispose();break}}if(n.api.location.type==="grid"||n.api.location.type==="floating"||n.api.location.type==="popout"){let y=this.getGridviewForGroup(n),x=we(n.element),k=Ve(y.orientation,x,s),S;if(_)S=Mi(s)==="HORIZONTAL"?i.api.width:i.api.height;else{var f;S=ke.Split((f=x[x.length-1])!==null&&f!==void 0?f:0)}y.addView(l,S,k),this.setGroupLocationForRoot(l,y)}}if(((t=c)!==null&&t!==void 0?t:l.panels).forEach(_=>{this.fireDidMovePanel(_,i)}),this.debouncedUpdateAllPositions(),e.skipSetActive===!1){let _=n??i;this.doSetGroupAndPanelActive(_)}else l!==i&&e.skipSetActive!==!0&&this.doSetGroupAndPanelActive(l)}doSetGroupActive(e){var t;super.doSetGroupActive(e);let i=this.activePanel;!this._moving&&i!==((t=this._onDidActivePanelChange.value)===null||t===void 0?void 0:t.panel)&&this.fireActivePanelChange(i)}doSetGroupAndPanelActive(e){var t;super.doSetGroupActive(e);let i=this.activePanel;e&&this.hasMaximizedGroup()&&!this.isMaximizedGroup(e)&&this.exitMaximizedGroup(),!this._moving&&i!==((t=this._onDidActivePanelChange.value)===null||t===void 0?void 0:t.panel)&&this.fireActivePanelChange(i)}getNextGroupId(){let e=this.nextGroupId.next();for(;this._groups.has(e);)e=this.nextGroupId.next();return e}createGroup(e){var t;(t=e)!==null&&t!==void 0||(e={});let i=e?.id;if(i&&this._groups.has(e.id)&&(console.warn(`dockview: Duplicate group id ${e?.id}. reassigning group id to avoid errors`),i=void 0),!i)for(i=this.nextGroupId.next();this._groups.has(i);)i=this.nextGroupId.next();let n=new ui(this,i,e);if(n.init({params:{},accessor:this}),!this._groups.has(n.id)){let s=new D(n.model.onTabDragStart(l=>{var c;(c=this._advancedDnDService)===null||c===void 0||c.dispatchWillDragPanel(l)}),n.model.onGroupDragStart(l=>{var c;(c=this._advancedDnDService)===null||c===void 0||c.dispatchWillDragGroup(l)}),n.model.onMove(l=>{let{groupId:c,itemId:p,target:v,index:m,tabGroupId:f}=l;this.moveGroupOrPanel({from:{groupId:c,panelId:p,tabGroupId:f},to:{group:n,position:v,index:m}})}),n.model.onDidDrop(l=>{this._onDidDrop.fire(l)}),n.model.onWillDrop(l=>{var c;(c=this._advancedDnDService)===null||c===void 0||c.dispatchWillDrop(l)}),n.model.onWillShowOverlay(l=>{var c;if(this.options.disableDnd){l.preventDefault();return}(c=this._advancedDnDService)===null||c===void 0||c.dispatchWillShowOverlay(l)}),n.model.onUnhandledDragOver(l=>{this._onUnhandledDragOver.fire(l)}),n.model.onDidAddPanel(l=>{this._moving||this._onDidAddPanel.fire(l.panel)}),n.model.onDidRemovePanel(l=>{this._moving||this._onDidRemovePanel.fire(l.panel)}),n.model.onDidActivePanelChange(l=>{var c;this._moving||l.panel===this.activePanel&&((c=this._onDidActivePanelChange.value)===null||c===void 0?void 0:c.panel)!==l.panel&&this.fireActivePanelChange(l.panel)}),P.any(n.model.onDidPanelTitleChange,n.model.onDidPanelParametersChange)(()=>{this._bufferOnDidLayoutChange.fire()}));this._groups.set(n.id,{value:n,disposable:s})}return n.initialize(),n}createPanel(e,t){var i,n,s;let l=e.component,c=(i=e.tabComponent)!==null&&i!==void 0?i:this.options.defaultTabComponent,p=new hs(this,e.id,l,c),v=new At(e.id,l,c,this,this._api,t,p,{renderer:e.renderer,minimumWidth:e.minimumWidth,minimumHeight:e.minimumHeight,maximumWidth:e.maximumWidth,maximumHeight:e.maximumHeight});return v.init({title:(n=e.title)!==null&&n!==void 0?n:e.id,params:(s=e?.params)!==null&&s!==void 0?s:{}}),v}dropSizing(e){return ke.Split(e.length===0?0:e[e.length-1])}createGroupAtLocation(e,t,i,n=this.gridview){let s=this.createGroup(i);return this.doAddGroup(s,e,t,n),this.setGroupLocationForRoot(s,n),s}setGroupLocationForRoot(e,t){var i;let n=(i=this._popoutWindowService)===null||i===void 0?void 0:i.entries.find(s=>s.gridview===t);if(n){e.model.renderContainer!==n.overlayRenderContainer&&(e.model.renderContainer=n.overlayRenderContainer),e.model.dropTargetContainer=n.dropTargetContainer,e.model.location={type:"popout",getWindow:n.getWindow,popoutUrl:n.popoutUrl};return}e.model.renderContainer!==this.overlayRenderContainer&&(e.model.renderContainer=this.overlayRenderContainer),e.model.dropTargetContainer=this.rootDropTargetContainer,e.model.location=t===this.gridview?{type:"grid"}:{type:"floating"}}getGridviewForGroup(e){var t,i;let n=(t=this._floatingGroupService)===null||t===void 0?void 0:t.findByGroup(e);if(n)return n.gridview;let s=(i=this._popoutWindowService)===null||i===void 0?void 0:i.findByGroup(e);return s?s.gridview:this.gridview}nestedWindowMembers(e){let t=this.getGridviewForGroup(e);return t===this.gridview?[]:this.groups.filter(i=>t.element.contains(i.element))}findGroup(e){var t;return(t=Array.from(this._groups.values()).find(i=>i.value.model.containsPanel(e)))===null||t===void 0?void 0:t.value}orientationAtLocation(e){let t=this.gridview.orientation;return e.length%2==1?t:et(t)}updateTheme(){var e,t,i,n,s,l;let c=(e=this._options.theme)!==null&&e!==void 0?e:cs;(t=this._shellThemeClassnames)===null||t===void 0||t.setClassNames(c.className);let p=(i=c.gap)!==null&&i!==void 0?i:0;this.gridview.margin=p;for(let _ of this.nestedGridviews())_.margin=p;if((n=this._shellManager)===null||n===void 0||n.updateTheme(p,(s=c.edgeGroupCollapsedSize)!==null&&s!==void 0?s:35),c.dndOverlayBorder===void 0){var v;this.element.style.removeProperty("--dv-drag-over-border"),(v=this._shellManager)===null||v===void 0||v.element.style.removeProperty("--dv-drag-over-border")}else{var m;this.element.style.setProperty("--dv-drag-over-border",c.dndOverlayBorder),(m=this._shellManager)===null||m===void 0||m.element.style.setProperty("--dv-drag-over-border",c.dndOverlayBorder)}c.dndOverlayMounting==="absolute"?this.rootDropTargetContainer.disabled=!1:this.rootDropTargetContainer.disabled=!0;let f=((l=c.tabGroupIndicator)!==null&&l!==void 0?l:"wrap")==="none";E(this.element,"dv-tab-group-indicator-none",f),this._shellManager&&E(this._shellManager.element,"dv-tab-group-indicator-none",f);for(let _ of this.groups)_.model.updateTabGroups()}},Rs=class extends no{get orientation(){return this.gridview.orientation}set orientation(e){this.gridview.orientation=e}get options(){return this._options}get deserializer(){return this._deserializer}set deserializer(e){this._deserializer=e}constructor(e,t){var i;super(e,{proportionalLayout:(i=t.proportionalLayout)!==null&&i!==void 0?i:!0,orientation:t.orientation,styles:t.hideBorders?{separatorBorder:"transparent"}:void 0,disableAutoResizing:t.disableAutoResizing,className:t.className}),this._onDidLayoutfromJSON=new G,this.onDidLayoutFromJSON=this._onDidLayoutfromJSON.event,this._onDidRemoveGroup=new G,this.onDidRemoveGroup=this._onDidRemoveGroup.event,this._onDidAddGroup=new G,this.onDidAddGroup=this._onDidAddGroup.event,this._onDidActiveGroupChange=new G,this.onDidActiveGroupChange=this._onDidActiveGroupChange.event,this._options=t,this.addDisposables(this._onDidAddGroup,this._onDidRemoveGroup,this._onDidActiveGroupChange,this.onDidAdd(n=>{this._onDidAddGroup.fire(n)}),this.onDidRemove(n=>{this._onDidRemoveGroup.fire(n)}),this.onDidActiveChange(n=>{this._onDidActiveGroupChange.fire(n)})),this.layoutFromElement()}updateOptions(e){super.updateOptions(e);let t=typeof e.orientation=="string"&&this.gridview.orientation!==e.orientation;this._options=J(J({},this.options),e),t&&(this.gridview.orientation=e.orientation),this.layout(this.gridview.width,this.gridview.height,!0)}removePanel(e){this.removeGroup(e)}toJSON(){var e;return{grid:this.gridview.serialize(),activePanel:(e=this.activeGroup)===null||e===void 0?void 0:e.id}}setVisible(e,t){this.gridview.setViewVisible(we(e.element),t)}setActive(e){this._groups.forEach((t,i)=>{t.value.setActive(e===t.value)})}focus(){var e;(e=this.activeGroup)===null||e===void 0||e.focus()}fromJSON(e){this.clear();let{grid:t,activePanel:i}=e;try{let n=[],s=this.width,l=this.height;if(this.gridview.deserialize(t,{fromJSON:c=>{let{data:p}=c,v=this.options.createComponent({id:p.id,name:p.component});return n.push(()=>v.init({params:p.params,minimumWidth:p.minimumWidth,maximumWidth:p.maximumWidth,minimumHeight:p.minimumHeight,maximumHeight:p.maximumHeight,priority:p.priority,snap:!!p.snap,accessor:this,isVisible:c.visible})),this._onDidAddGroup.fire(v),this.registerPanel(v),v}}),this.layout(s,l,!0),n.forEach(c=>c()),typeof i=="string"){let c=this.getPanel(i);c&&this.doSetGroupActive(c)}}catch(n){for(let s of this.groups)s.dispose(),this._groups.delete(s.id),this._onDidRemoveGroup.fire(s);throw this.clear(),n}this._onDidLayoutfromJSON.fire()}clear(){let e=this.activeGroup,t=Array.from(this._groups.values());for(let i of t)i.disposable.dispose(),this.doRemoveGroup(i.value,{skipActive:!0});e&&this.doSetGroupActive(void 0),this.gridview.clear()}movePanel(e,t){var i;let n=(i=this._groups.get(t.reference))===null||i===void 0?void 0:i.value;if(!n)throw new Error(`reference group ${t.reference} does not exist`);let s=li(t.direction);if(s==="center")throw new Error(`${s} not supported as an option`);let l=we(n.element),c=Ve(this.gridview.orientation,l,s),p=this.gridview.remove(e);this.doAddGroup(p,c,t.size)}addPanel(e){var t,i,n;let s=(t=e.location)!==null&&t!==void 0?t:[0];if(!((i=e.position)===null||i===void 0)&&i.referencePanel){var l;let p=(l=this._groups.get(e.position.referencePanel))===null||l===void 0?void 0:l.value;if(!p)throw new Error(`reference group ${e.position.referencePanel} does not exist`);let v=li(e.position.direction);if(v==="center")throw new Error(`${v} not supported as an option`);{let m=we(p.element);s=Ve(this.gridview.orientation,m,v)}}let c=this.options.createComponent({id:e.id,name:e.component});return c.init({params:(n=e.params)!==null&&n!==void 0?n:{},minimumWidth:e.minimumWidth,maximumWidth:e.maximumWidth,minimumHeight:e.minimumHeight,maximumHeight:e.maximumHeight,priority:e.priority,snap:!!e.snap,accessor:this,isVisible:!0}),this.doAddGroup(c,s,e.size),this.registerPanel(c),this.doSetGroupActive(c),c}registerPanel(e){let t=new D(e.api.onDidFocusChange(i=>{i.isFocused&&this._groups.forEach(n=>{let s=n.value;s.setActive(s===e)})}));this._groups.set(e.id,{value:e,disposable:t})}moveGroup(e,t,i){let n=this.getPanel(t);if(!n)throw new Error("invalid operation");let s=we(e.element),[l,c]=Ze(Ve(this.gridview.orientation,s,i)),[p,v]=Ze(we(n.element));if(qn(p,l)){this.gridview.moveView(p,v,c);return}let m=this.doRemoveGroup(n,{skipActive:!0,skipDispose:!0}),f=we(e.element),_=Ve(this.gridview.orientation,f,i);this.doAddGroup(m,_)}removeGroup(e){super.removeGroup(e)}dispose(){super.dispose(),this._onDidLayoutfromJSON.dispose()}},$s=class extends io{get panels(){return this.splitview.getViews()}get options(){return this._options}get length(){return this._panels.size}get orientation(){return this.splitview.orientation}get splitview(){return this._splitview}set splitview(e){this._splitview&&this._splitview.dispose(),this._splitview=e,this._splitviewChangeDisposable.value=new D(this._splitview.onDidSashEnd(()=>{this._onDidLayoutChange.fire(void 0)}),this._splitview.onDidAddView(t=>this._onDidAddView.fire(t)),this._splitview.onDidRemoveView(t=>this._onDidRemoveView.fire(t)))}get minimumSize(){return this.splitview.minimumSize}get maximumSize(){return this.splitview.maximumSize}get height(){return this.splitview.orientation==="HORIZONTAL"?this.splitview.orthogonalSize:this.splitview.size}get width(){return this.splitview.orientation==="HORIZONTAL"?this.splitview.size:this.splitview.orthogonalSize}constructor(e,t){var i;super(document.createElement("div"),t.disableAutoResizing),this._splitviewChangeDisposable=new C,this._panels=new Map,this._onDidLayoutfromJSON=new G,this.onDidLayoutFromJSON=this._onDidLayoutfromJSON.event,this._onDidAddView=new G,this.onDidAddView=this._onDidAddView.event,this._onDidRemoveView=new G,this.onDidRemoveView=this._onDidRemoveView.event,this._onDidLayoutChange=new G,this.onDidLayoutChange=this._onDidLayoutChange.event,this.element.style.height="100%",this.element.style.width="100%",this._classNames=new $e(this.element),this._classNames.setClassNames((i=t.className)!==null&&i!==void 0?i:""),e.appendChild(this.element),this._options=t,this.splitview=new yt(this.element,t),this.addDisposables(this._onDidAddView,this._onDidLayoutfromJSON,this._onDidRemoveView,this._onDidLayoutChange),this.layoutFromElement()}updateOptions(e){if("className"in e){var t;this._classNames.setClassNames((t=e.className)!==null&&t!==void 0?t:"")}if("disableResizing"in e){var i;this.disableResizing=(i=e.disableAutoResizing)!==null&&i!==void 0?i:!1}typeof e.orientation=="string"&&(this.splitview.orientation=e.orientation),this._options=J(J({},this.options),e),this.splitview.layout(this.splitview.size,this.splitview.orthogonalSize)}focus(){var e;(e=this._activePanel)===null||e===void 0||e.focus()}movePanel(e,t){this.splitview.moveView(e,t)}setVisible(e,t){let i=this.panels.indexOf(e);this.splitview.setViewVisible(i,t)}setActive(e,t){this._activePanel=e,this.panels.filter(i=>i!==e).forEach(i=>{i.api._onDidActiveChange.fire({isActive:!1}),t||i.focus()}),e.api._onDidActiveChange.fire({isActive:!0}),t||e.focus()}removePanel(e,t){let i=this._panels.get(e.id);if(!i)throw new Error(`unknown splitview panel ${e.id}`);i.dispose(),this._panels.delete(e.id);let n=this.panels.indexOf(e);this.splitview.removeView(n,t).dispose();let s=this.panels;s.length>0&&this.setActive(s[s.length-1])}getPanel(e){return this.panels.find(t=>t.id===e)}addPanel(e){var t;if(this._panels.has(e.id))throw new Error(`panel ${e.id} already exists`);let i=this.options.createComponent({id:e.id,name:e.component});i.orientation=this.splitview.orientation,i.init({params:(t=e.params)!==null&&t!==void 0?t:{},minimumSize:e.minimumSize,maximumSize:e.maximumSize,snap:e.snap,priority:e.priority,accessor:this});let n=typeof e.size=="number"?e.size:ke.Distribute,s=typeof e.index=="number"?e.index:void 0;return this.splitview.addView(i,n,s),this.doAddView(i),this.setActive(i),i}layout(e,t){let[i,n]=this.splitview.orientation==="HORIZONTAL"?[e,t]:[t,e];this.splitview.layout(i,n)}doAddView(e){let t=e.api.onDidFocusChange(i=>{i.isFocused&&this.setActive(e,!0)});this._panels.set(e.id,t)}toJSON(){var e;return{views:this.splitview.getViews().map((t,i)=>({size:this.splitview.getViewSize(i),data:t.toJSON(),snap:!!t.snap,priority:t.priority})),activeView:(e=this._activePanel)===null||e===void 0?void 0:e.id,size:this.splitview.size,orientation:this.splitview.orientation}}fromJSON(e){this.clear();let{views:t,orientation:i,size:n,activeView:s}=e,l=[],c=this.width,p=this.height;if(this.splitview=new yt(this.element,{orientation:i,proportionalLayout:this.options.proportionalLayout,descriptor:{size:n,views:t.map(v=>{let m=v.data;if(this._panels.has(m.id))throw new Error(`panel ${m.id} already exists`);let f=this.options.createComponent({id:m.id,name:m.component});return l.push(()=>{var _;f.init({params:(_=m.params)!==null&&_!==void 0?_:{},minimumSize:m.minimumSize,maximumSize:m.maximumSize,snap:v.snap,priority:v.priority,accessor:this})}),f.orientation=i,this.doAddView(f),setTimeout(()=>{this._onDidAddView.fire(f)},0),{size:v.size,view:f}})}}),this.layout(c,p),l.forEach(v=>v()),typeof s=="string"){let v=this.getPanel(s);v&&this.setActive(v)}this._onDidLayoutfromJSON.fire()}clear(){for(let e of this._panels.values())e.dispose();for(this._panels.clear();this.splitview.length>0;)this.splitview.removeView(0,ke.Distribute,!0).dispose()}dispose(){for(let t of this._panels.values())t.dispose();this._panels.clear();let e=this.splitview.getViews();this._splitviewChangeDisposable.dispose(),this.splitview.dispose();for(let t of e)t.dispose();this.element.remove(),super.dispose()}},Ns=class extends D{get element(){return this._element}constructor(){super(),this._expandedIcon=dc(),this._collapsedIcon=jr(),this.disposable=new C,this.apiRef={api:null},this._element=document.createElement("div"),this.element.className="dv-default-header",this._content=document.createElement("span"),this._expander=document.createElement("div"),this._expander.className="dv-pane-header-icon",this.element.appendChild(this._expander),this.element.appendChild(this._content),this.addDisposables(O(this._element,"click",()=>{var e;(e=this.apiRef.api)===null||e===void 0||e.setExpanded(!this.apiRef.api.isExpanded)}))}init(e){this.apiRef.api=e.api,this._content.textContent=e.title,this.updateIcon(),this.disposable.value=e.api.onDidExpansionChange(()=>{this.updateIcon()})}updateIcon(){var e;let t=!!(!((e=this.apiRef.api)===null||e===void 0)&&e.isExpanded);E(this._expander,"collapsed",!t),t?(this._expander.contains(this._collapsedIcon)&&this._collapsedIcon.remove(),this._expander.contains(this._expandedIcon)||this._expander.appendChild(this._expandedIcon)):(this._expander.contains(this._expandedIcon)&&this._expandedIcon.remove(),this._expander.contains(this._collapsedIcon)||this._expander.appendChild(this._collapsedIcon))}update(e){}dispose(){this.disposable.dispose(),super.dispose()}};let Nh=Jn(),Vs=22,Ws=0,Hs=Number.MAX_SAFE_INTEGER;var Do=class extends Ur{constructor(e){super({accessor:e.accessor,id:e.id,component:e.component,headerComponent:e.headerComponent,orientation:e.orientation,isExpanded:e.isExpanded,disableDnd:e.disableDnd,headerSize:e.headerSize,minimumBodySize:e.minimumBodySize,maximumBodySize:e.maximumBodySize}),this.options=e}getBodyComponent(){return this.options.body}getHeaderComponent(){return this.options.header}},Bs=class extends io{get id(){return this._id}get panels(){return this.paneview.getPanes()}set paneview(e){this._paneview=e,this._disposable.value=new D(this._paneview.onDidChange(()=>{this._onDidLayoutChange.fire(void 0)}),this._paneview.onDidAddView(t=>this._onDidAddView.fire(t)),this._paneview.onDidRemoveView(t=>this._onDidRemoveView.fire(t)))}get paneview(){return this._paneview}get minimumSize(){return this.paneview.minimumSize}get maximumSize(){return this.paneview.maximumSize}get height(){return this.paneview.orientation==="HORIZONTAL"?this.paneview.orthogonalSize:this.paneview.size}get width(){return this.paneview.orientation==="HORIZONTAL"?this.paneview.size:this.paneview.orthogonalSize}get options(){return this._options}constructor(e,t){var i;super(document.createElement("div"),t.disableAutoResizing),this._id=Nh.next(),this._disposable=new C,this._viewDisposables=new Map,this._onDidLayoutfromJSON=new G,this.onDidLayoutFromJSON=this._onDidLayoutfromJSON.event,this._onDidLayoutChange=new G,this.onDidLayoutChange=this._onDidLayoutChange.event,this._onDidDrop=new G,this.onDidDrop=this._onDidDrop.event,this._onDidAddView=new G,this.onDidAddView=this._onDidAddView.event,this._onDidRemoveView=new G,this.onDidRemoveView=this._onDidRemoveView.event,this._onUnhandledDragOver=new G,this.onUnhandledDragOver=this._onUnhandledDragOver.event,this.element.style.height="100%",this.element.style.width="100%",this.addDisposables(this._onDidLayoutChange,this._onDidLayoutfromJSON,this._onDidDrop,this._onDidAddView,this._onDidRemoveView,this._onUnhandledDragOver),this._classNames=new $e(this.element),this._classNames.setClassNames((i=t.className)!==null&&i!==void 0?i:""),e.appendChild(this.element),this._options=t,this.paneview=new Ii(this.element,{orientation:"VERTICAL"}),this.addDisposables(this._disposable)}setVisible(e,t){let i=this.panels.indexOf(e);this.paneview.setViewVisible(i,t)}focus(){}updateOptions(e){if("className"in e){var t;this._classNames.setClassNames((t=e.className)!==null&&t!==void 0?t:"")}if("disableAutoResizing"in e){var i;this.disableResizing=(i=e.disableAutoResizing)!==null&&i!==void 0?i:!1}this._options=J(J({},this.options),e)}addPanel(e){var t,i,n;let s=this.options.createComponent({id:e.id,name:e.component}),l;e.headerComponent&&this.options.createHeaderComponent&&(l=this.options.createHeaderComponent({id:e.id,name:e.headerComponent})),(t=l)!==null&&t!==void 0||(l=new Ns);let c=new Do({id:e.id,component:e.component,headerComponent:e.headerComponent,header:l,body:s,orientation:"VERTICAL",isExpanded:!!e.isExpanded,disableDnd:!!this.options.disableDnd,accessor:this,headerSize:(i=e.headerSize)!==null&&i!==void 0?i:Vs,minimumBodySize:Ws,maximumBodySize:Hs});this.doAddPanel(c);let p=typeof e.size=="number"?e.size:ke.Distribute,v=typeof e.index=="number"?e.index:void 0;return c.init({params:(n=e.params)!==null&&n!==void 0?n:{},minimumBodySize:e.minimumBodySize,maximumBodySize:e.maximumBodySize,isExpanded:e.isExpanded,title:e.title,containerApi:new Ut(this),accessor:this}),this.paneview.addPane(c,p,v),c.orientation=this.paneview.orientation,c}removePanel(e){let t=this.panels.indexOf(e);this.paneview.removePane(t),this.doRemovePanel(e)}movePanel(e,t){this.paneview.moveView(e,t)}getPanel(e){return this.panels.find(t=>t.id===e)}layout(e,t){let[i,n]=this.paneview.orientation==="HORIZONTAL"?[e,t]:[t,e];this.paneview.layout(i,n)}toJSON(){let e=i=>i===Number.MAX_SAFE_INTEGER||i===Number.POSITIVE_INFINITY?void 0:i,t=i=>i<=0?void 0:i;return{views:this.paneview.getPanes().map((i,n)=>{let s=this.paneview.getViewCachedVisibleSize(n),l=typeof s=="number";return J({size:l?s:this.paneview.getViewSize(n),data:i.toJSON(),minimumSize:t(i.minimumBodySize),maximumSize:e(i.maximumBodySize),headerSize:i.headerSize,expanded:i.isExpanded()},l?{visible:!1}:{})}),size:this.paneview.size}}fromJSON(e){this.clear();let{views:t,size:i}=e,n=[],s=this.width,l=this.height;this.paneview.dispose(),this.paneview=new Ii(this.element,{orientation:"VERTICAL",descriptor:{size:i,views:t.map(c=>{var p,v,m,f;let _=c.data,y=this.options.createComponent({id:_.id,name:_.component}),x;_.headerComponent&&this.options.createHeaderComponent&&(x=this.options.createHeaderComponent({id:_.id,name:_.headerComponent})),(p=x)!==null&&p!==void 0||(x=new Ns);let k=new Do({id:_.id,component:_.component,headerComponent:_.headerComponent,header:x,body:y,orientation:"VERTICAL",isExpanded:!!c.expanded,disableDnd:!!this.options.disableDnd,accessor:this,headerSize:(v=c.headerSize)!==null&&v!==void 0?v:Vs,minimumBodySize:(m=c.minimumSize)!==null&&m!==void 0?m:Ws,maximumBodySize:(f=c.maximumSize)!==null&&f!==void 0?f:Hs});return this.doAddPanel(k),n.push(()=>{var S;k.init({params:(S=_.params)!==null&&S!==void 0?S:{},minimumBodySize:c.minimumSize,maximumBodySize:c.maximumSize,title:_.title,isExpanded:!!c.expanded,containerApi:new Ut(this),accessor:this}),k.orientation=this.paneview.orientation}),setTimeout(()=>{this._onDidAddView.fire(k)},0),{size:c.size,view:k,visible:c.visible}})}}),this.layout(s,l),n.forEach(c=>c()),this._onDidLayoutfromJSON.fire()}clear(){for(let[i,n]of this._viewDisposables.entries())n.dispose();this._viewDisposables.clear();let e=this.width,t=this.height;this.paneview.dispose(),this.paneview=new Ii(this.element,{orientation:"VERTICAL"}),this.layout(e,t)}doAddPanel(e){let t=new D(e.onDidDrop(i=>{this._onDidDrop.fire(i)}),e.onUnhandledDragOver(i=>{this._onUnhandledDragOver.fire(i)}));this._viewDisposables.set(e.id,t)}doRemovePanel(e){let t=this._viewDisposables.get(e.id);t&&(t.dispose(),this._viewDisposables.delete(e.id))}dispose(){super.dispose();for(let[e,t]of this._viewDisposables.entries())t.dispose();this._viewDisposables.clear(),this.element.remove(),this.paneview.dispose()}},Vh=class extends lo{get priority(){return this._priority}set orientation(e){this._orientation=e}get orientation(){return this._orientation}get minimumSize(){let e=typeof this._minimumSize=="function"?this._minimumSize():this._minimumSize;return e!==this._evaluatedMinimumSize&&(this._evaluatedMinimumSize=e,this.updateConstraints()),e}get maximumSize(){let e=typeof this._maximumSize=="function"?this._maximumSize():this._maximumSize;return e!==this._evaluatedMaximumSize&&(this._evaluatedMaximumSize=e,this.updateConstraints()),e}get snap(){return this._snap}constructor(e,t){super(e,t,new Br(e,t)),this._evaluatedMinimumSize=0,this._evaluatedMaximumSize=Number.POSITIVE_INFINITY,this._minimumSize=0,this._maximumSize=Number.POSITIVE_INFINITY,this._snap=!1,this._onDidChange=new G,this.onDidChange=this._onDidChange.event,this.api.initialize(this),this.addDisposables(this._onDidChange,this.api.onWillVisibilityChange(i=>{let{isVisible:n}=i,{accessor:s}=this._params;s.setVisible(this,n)}),this.api.onActiveChange(()=>{let{accessor:i}=this._params;i.setActive(this)}),this.api.onDidConstraintsChangeInternal(i=>{(typeof i.minimumSize=="number"||typeof i.minimumSize=="function")&&(this._minimumSize=i.minimumSize),(typeof i.maximumSize=="number"||typeof i.maximumSize=="function")&&(this._maximumSize=i.maximumSize),this.updateConstraints()}),this.api.onDidSizeChange(i=>{this._onDidChange.fire({size:i.size})}))}setVisible(e){this.api._onDidVisibilityChange.fire({isVisible:e})}setActive(e){this.api._onDidActiveChange.fire({isActive:e})}layout(e,t){let[i,n]=this.orientation==="HORIZONTAL"?[e,t]:[t,e];super.layout(i,n)}init(e){super.init(e),this._priority=e.priority,e.minimumSize&&(this._minimumSize=e.minimumSize),e.maximumSize&&(this._maximumSize=e.maximumSize),e.snap&&(this._snap=e.snap)}toJSON(){let e=i=>i===Number.MAX_SAFE_INTEGER||i===Number.POSITIVE_INFINITY?void 0:i,t=i=>i<=0?void 0:i;return J(J({},super.toJSON()),{},{minimumSize:t(this.minimumSize),maximumSize:e(this.maximumSize)})}updateConstraints(){this.api._onDidConstraintsChange.fire({maximumSize:this._evaluatedMaximumSize,minimumSize:this._evaluatedMinimumSize})}};function Wh(e,t){return new Os(e,t).api}function Hh(e,t){return new Tr(new $s(e,t))}function Bh(e,t){return new Ar(new Rs(e,t))}function Fh(e,t){return new Ut(new Bs(e,t))}r.AdvancedDnDModule=Ds,r.AdvancedDnDService=xs,r.BaseGrid=no,r.ContentContainer=Yr,r.ContextMenuController=zs,r.ContextMenuModule=Ts,r.DEFAULT_TAB_GROUP_COLORS=Vi,r.DefaultDockviewDeserialzier=us,r.DefaultTab=bo,r.DockviewApi=Oi,r.DockviewComponent=Os,r.DockviewCompositeDisposable=D,r.DockviewDidDropEvent=Fi,Object.defineProperty(r,"DockviewDisposable",{enumerable:!0,get:function(){return w}}),r.DockviewEmitter=G,Object.defineProperty(r,"DockviewEvent",{enumerable:!0,get:function(){return P}}),r.DockviewGroupPanel=ui,r.DockviewGroupPanelModel=ds,r.DockviewMutableDisposable=C,r.DockviewPanel=At,r.DockviewUnhandledDragOverEvent=po,r.DockviewWillDropEvent=mo,r.DockviewWillShowOverlayLocationEvent=Yt,r.DraggablePaneviewPanel=Ur,r.EdgeGroupModule=bs,r.FloatingGroupModule=fs,r.Gridview=to,r.GridviewApi=Ar,r.GridviewComponent=Rs,r.GridviewPanel=ls,r.LayoutPriority=El,r.LiveRegionModule=ys,r.LocalSelectionTransfer=u,r.OVERFLOW_MAX_TAB_ROWS_VARIABLE=mc,r.OVERFLOW_WRAP_TABS_CAPPED_CLASS=gc,r.OVERFLOW_WRAP_TABS_CLASS=uo,r.OVERFLOW_WRAP_TABS_VERTICAL_TAB_HEIGHT_VARIABLE=fc,r.Orientation=Tl,r.PROPERTY_KEYS_DOCKVIEW=bc,r.PROPERTY_KEYS_GRIDVIEW=Ml,r.PROPERTY_KEYS_PANEVIEW=oc,r.PROPERTY_KEYS_SPLITVIEW=Il,r.PaneFramework=Do,r.PaneTransfer=h,r.PanelTransfer=d,r.Paneview=Ii,r.PaneviewApi=Ut,r.PaneviewComponent=Bs,r.PaneviewPanel=Fr,r.PaneviewUnhandledDragOverEvent=Vr,r.SashState=Al,Object.defineProperty(r,"Sizing",{enumerable:!0,get:function(){return ke}}),r.Splitview=yt,r.SplitviewApi=Tr,r.SplitviewComponent=$s,r.SplitviewPanel=Vh,r.Tab=Jr,r.TabGroupChipsModule=Ss,r.TabGroupChipsService=ks,r.TabGroupColorPalette=vo,r.applyTabGroupAccent=Wi,r.clearRegisteredModules=ih,r.createCloseButton=qr,r.createDismissableLayer=Is,r.createDockview=Wh,r.createGridview=Bh,r.createPaneview=Fh,r.createPinButton=co,r.createSplitview=Hh,r.defineModule=it,r.directionToPosition=so,r.findRelativeZIndexParent=Ue,r.getActiveElement=Ai,r.getDirectionOrientation=Mi,r.getGridLocation=we,r.getLocationOrientation=Qn,r.getPaneData=b,r.getPanelData=g,r.getPopoutUrlError=Yn,r.getRegisteredModules=ms,r.getRelativeLocation=Ve,r.indexInParent=Gr,r.isAnyEdgeGroupEnabled=Ni,r.isEdgeGroupEnabled=Zr,r.isGridBranchNode=Pr,r.isGroupOptionsWithGroup=is,r.isGroupOptionsWithPanel=ts,r.isPanelOptionsWithGroup=es,r.isPanelOptionsWithPanel=Qr,r.orthogonal=et,r.positionToDirection=Rr,r.prefersReducedMotion=Ne,r.registerModules=th,r.resolveMessages=oo,r.resolveOpaqueBackground=di,r.resolveTabGroupAccent=Hi,r.themeAbyss=cs,r.themeAbyssSpaced=Oc,r.themeCatppuccinMocha=Vc,r.themeCatppuccinMochaSpaced=Wc,r.themeDark=Ec,r.themeDracula=Lc,r.themeGithubDark=Uc,r.themeGithubDarkSpaced=Yc,r.themeGithubLight=qc,r.themeGithubLightSpaced=jc,r.themeLight=Ic,r.themeLightSpaced=Rc,r.themeMonokai=Hc,r.themeNord=$c,r.themeNordSpaced=Nc,r.themeSolarizedLight=Bc,r.themeSolarizedLightSpaced=Fc,r.themeVisualStudio=Mc,r.toTarget=li})});var jh=r=>{let{state:o}=r,a=o.doc.lineAt(o.selection.main.from),d=Oo(r.state,a.from);return d.line?Jh(r):d.block?Xh(r):!1};function Lo(r,o){return({state:a,dispatch:d})=>{if(a.readOnly)return!1;let h=r(o,a);return h?(d(a.update(h)),!0):!1}}var Jh=Lo(eu,0);var Kh=Lo(Ta,0);var Xh=Lo((r,o)=>Ta(r,o,Qh(o)),0);function Oo(r,o){let a=r.languageDataAt("commentTokens",o,1);return a.length?a[0]:{}}var fi=50;function Zh(r,{open:o,close:a},d,h){let u=r.sliceDoc(d-fi,d),g=r.sliceDoc(h,h+fi),b=/\s*$/.exec(u)[0].length,w=/^\s*/.exec(g)[0].length,D=u.length-b;if(u.slice(D-o.length,D)==o&&g.slice(w,w+a.length)==a)return{open:{pos:d-b,margin:b&&1},close:{pos:h+w,margin:w&&1}};let C,P;h-d<=2*fi?C=P=r.sliceDoc(d,h):(C=r.sliceDoc(d,d+fi),P=r.sliceDoc(h-fi,h));let T=/^\s*/.exec(C)[0].length,R=/\s*$/.exec(P)[0].length,V=P.length-R-a.length;return C.slice(T,T+o.length)==o&&P.slice(V,V+a.length)==a?{open:{pos:d+T+o.length,margin:/\s/.test(C.charAt(T+o.length))?1:0},close:{pos:h-R-a.length,margin:/\s/.test(P.charAt(V-1))?1:0}}:null}function Qh(r){let o=[];for(let a of r.selection.ranges){let d=r.doc.lineAt(a.from),h=a.to<=d.to?d:r.doc.lineAt(a.to);h.from>d.from&&h.from==a.to&&(h=a.to==d.to+1?d:r.doc.lineAt(a.to-1));let u=o.length-1;u>=0&&o[u].to>d.from?o[u].to=h.to:o.push({from:d.from+/^\s*/.exec(d.text)[0].length,to:h.to})}return o}function Ta(r,o,a=o.selection.ranges){let d=a.map(u=>Oo(o,u.from).block);if(!d.every(u=>u))return null;let h=a.map((u,g)=>Zh(o,d[g],u.from,u.to));if(r!=2&&!h.every(u=>u))return{changes:o.changes(a.map((u,g)=>h[g]?[]:[{from:u.from,insert:d[g].open+" "},{from:u.to,insert:" "+d[g].close}]))};if(r!=1&&h.some(u=>u)){let u=[];for(let g=0,b;g<h.length;g++)if(b=h[g]){let w=d[g],{open:D,close:C}=b;u.push({from:D.pos-w.open.length,to:D.pos+D.margin},{from:C.pos-C.margin,to:C.pos+w.close.length})}return{changes:u}}return null}function eu(r,o,a=o.selection.ranges){let d=[],h=-1;e:for(let{from:u,to:g}of a){let b=d.length,w=1e9,D;for(let C=u;C<=g;){let P=o.doc.lineAt(C);if(D==null&&(D=Oo(o,P.from).line,!D))continue e;if(P.from>h&&(u==g||g>P.from)){h=P.from;let T=/^\s*/.exec(P.text)[0].length,R=T==P.length,V=P.text.slice(T,T+D.length)==D?T:-1;T<P.text.length&&T<w&&(w=T),d.push({line:P,comment:V,token:D,indent:T,empty:R,single:!1})}C=P.to+1}if(w<1e9)for(let C=b;C<d.length;C++)d[C].indent<d[C].line.text.length&&(d[C].indent=w);d.length==b+1&&(d[b].single=!0)}if(r!=2&&d.some(u=>u.comment<0&&(!u.empty||u.single))){let u=[];for(let{line:b,token:w,indent:D,empty:C,single:P}of d)(P||!C)&&u.push({from:b.from+D,insert:w+" "});let g=o.changes(u);return{changes:g,selection:o.selection.map(g,1)}}else if(r!=1&&d.some(u=>u.comment>=0)){let u=[];for(let{line:g,comment:b,token:w}of d)if(b>=0){let D=g.from+b,C=D+w.length;g.text[C-g.from]==" "&&C++,u.push({from:D,to:C})}return{changes:u}}return null}var ya=ea.define();var tu=Dt.define();var Nt=class r{constructor(o,a,d,h,u){this.changes=o,this.effects=a,this.mapped=d,this.startSelection=h,this.selectionsAfter=u}setSelAfter(o){return new r(this.changes,this.effects,this.mapped,this.startSelection,o)}toJSON(){var o,a,d;return{changes:(o=this.changes)===null||o===void 0?void 0:o.toJSON(),mapped:(a=this.mapped)===null||a===void 0?void 0:a.toJSON(),startSelection:(d=this.startSelection)===null||d===void 0?void 0:d.toJSON(),selectionsAfter:this.selectionsAfter.map(h=>h.toJSON())}}static fromJSON(o){return new r(o.changes&&pi.fromJSON(o.changes),[],o.mapped&&Qs.fromJSON(o.mapped),o.startSelection&&ce.fromJSON(o.startSelection),o.selectionsAfter.map(ce.fromJSON))}static fromTransaction(o,a){let d=Je;for(let h of o.startState.facet(tu)){let u=h(o);u.length&&(d=d.concat(u))}return!d.length&&o.changes.empty?null:new r(o.changes.invert(o.startState.doc),d,void 0,a||o.startState.selection,Je)}static selection(o){return new r(void 0,Je,void 0,void 0,o)}};function Eo(r,o,a,d){let h=o+1>a+20?o-a-1:0,u=r.slice(h,o);return u.push(d),u}function iu(r,o){let a=[],d=!1;return r.iterChangedRanges((h,u)=>a.push(h,u)),o.iterChangedRanges((h,u,g,b)=>{for(let w=0;w<a.length;){let D=a[w++],C=a[w++];b>=D&&g<=C&&(d=!0)}}),d}function nu(r,o){return r.ranges.length==o.ranges.length&&r.ranges.filter((a,d)=>a.empty!=o.ranges[d].empty).length===0}function Aa(r,o){return r.length?o.length?r.concat(o):r:o}var Je=[],ou=200;function ru(r,o){if(r.length){let a=r[r.length-1],d=a.selectionsAfter.slice(Math.max(0,a.selectionsAfter.length-ou));return d.length&&d[d.length-1].eq(o)?r:(d.push(o),Eo(r,r.length-1,1e9,a.setSelAfter(d)))}else return[Nt.selection([o])]}function su(r){let o=r[r.length-1],a=r.slice();return a[r.length-1]=o.setSelAfter(o.selectionsAfter.slice(0,o.selectionsAfter.length-1)),a}function Ao(r,o){if(!r.length)return r;let a=r.length,d=Je;for(;a;){let h=au(r[a-1],o,d);if(h.changes&&!h.changes.empty||h.effects.length){let u=r.slice(0,a);return u[a-1]=h,u}else o=h.mapped,a--,d=h.selectionsAfter}return d.length?[Nt.selection(d)]:Je}function au(r,o,a){let d=Aa(r.selectionsAfter.length?r.selectionsAfter.map(b=>b.map(o)):Je,a);if(!r.changes)return Nt.selection(d);let h=r.changes.map(o),u=o.mapDesc(r.changes,!0),g=r.mapped?r.mapped.composeDesc(u):u;return new Nt(h,Ae.mapEffects(r.effects,o),g,r.startSelection.map(u),d)}var du=/^(input\.type|delete)($|\.)/,rn=class r{constructor(o,a,d=0,h=void 0){this.done=o,this.undone=a,this.prevTime=d,this.prevUserEvent=h}isolate(){return this.prevTime?new r(this.done,this.undone):this}addChanges(o,a,d,h,u){let g=this.done,b=g[g.length-1];return b&&b.changes&&!b.changes.empty&&o.changes&&(!d||du.test(d))&&(!b.selectionsAfter.length&&a-this.prevTime<h.newGroupDelay&&h.joinToEvent(u,iu(b.changes,o.changes))||d=="input.type.compose")?g=Eo(g,g.length-1,h.minDepth,new Nt(o.changes.compose(b.changes),Aa(Ae.mapEffects(o.effects,b.changes),b.effects),b.mapped,b.startSelection,Je)):g=Eo(g,g.length,h.minDepth,o),new r(g,Je,a,d)}addSelection(o,a,d,h){let u=this.done.length?this.done[this.done.length-1].selectionsAfter:Je;return u.length>0&&a-this.prevTime<h&&d==this.prevUserEvent&&d&&/^select($|\.)/.test(d)&&nu(u[u.length-1],o)?this:new r(ru(this.done,o),this.undone,a,d)}addMapping(o){return new r(Ao(this.done,o),Ao(this.undone,o),this.prevTime,this.prevUserEvent)}pop(o,a,d){let h=o==0?this.done:this.undone;if(h.length==0)return null;let u=h[h.length-1],g=u.selectionsAfter[0]||(u.startSelection?u.startSelection.map(u.changes.invertedDesc,1):a.selection);if(d&&u.selectionsAfter.length)return a.update({selection:u.selectionsAfter[u.selectionsAfter.length-1],annotations:ya.of({side:o,rest:su(h),selection:g}),userEvent:o==0?"select.undo":"select.redo",scrollIntoView:!0});if(u.changes){let b=h.length==1?Je:h.slice(0,h.length-1);return u.mapped&&(b=Ao(b,u.mapped)),a.update({changes:u.changes,selection:u.startSelection,effects:u.effects,annotations:ya.of({side:o,rest:b,selection:g}),filter:!1,userEvent:o==0?"undo":"redo",scrollIntoView:!0})}else return null}};rn.empty=new rn(Je,Je);function Kt(r,o){return ce.create(r.ranges.map(o),r.mainIndex)}function nt(r,o){return r.update({selection:o,scrollIntoView:!0,userEvent:"select"})}function ot({state:r,dispatch:o},a){let d=Kt(r.selection,a);return d.eq(r.selection,!0)?!1:(o(nt(r,d)),!0)}function sn(r,o){return ce.cursor(o?r.to:r.from)}function Ea(r,o){return ot(r,a=>a.empty?r.moveByChar(a,o):sn(a,o))}function Ee(r){return r.textDirectionAt(r.state.selection.main.head)==ia.LTR}var Ia=r=>Ea(r,!Ee(r)),Ma=r=>Ea(r,Ee(r));function La(r,o){return ot(r,a=>a.empty?r.moveByGroup(a,o):sn(a,o))}var lu=r=>La(r,!Ee(r)),cu=r=>La(r,Ee(r));var Ev=typeof Intl<"u"&&Intl.Segmenter?new Intl.Segmenter(void 0,{granularity:"word"}):null;function hu(r,o,a){if(o.type.prop(a))return!0;let d=o.to-o.from;return d&&(d>2||/[^\s,.;:]/.test(r.sliceDoc(o.from,o.to)))||o.firstChild}function an(r,o,a){let d=tn(r).resolveInner(o.head),h=a?en.closedBy:en.openedBy;for(let w=o.head;;){let D=a?d.childAfter(w):d.childBefore(w);if(!D)break;hu(r,D,h)?d=D:w=a?D.to:D.from}let u=d.type.prop(h),g,b;return u&&(g=a?$t(r,d.from,1):$t(r,d.to,-1))&&g.matched?b=a?g.end.to:g.end.from:b=a?d.to:d.from,ce.cursor(b,a?-1:1)}var uu=r=>ot(r,o=>an(r.state,o,!Ee(r))),pu=r=>ot(r,o=>an(r.state,o,Ee(r)));function Oa(r,o){return ot(r,a=>{if(!a.empty)return sn(a,o);let d=r.moveVertically(a,o);return d.head!=a.head?d:r.moveToLineBoundary(a,o)})}var Ra=r=>Oa(r,!1),$a=r=>Oa(r,!0);function Na(r){let o=r.scrollDOM.clientHeight<r.scrollDOM.scrollHeight-2,a=0,d=0,h;if(o){for(let u of r.state.facet(de.scrollMargins)){let g=u(r);g?.top&&(a=Math.max(g?.top,a)),g?.bottom&&(d=Math.max(g?.bottom,d))}h=r.scrollDOM.clientHeight-a-d}else h=(r.dom.ownerDocument.defaultView||window).innerHeight;return{marginTop:a,marginBottom:d,selfScroll:o,height:Math.max(r.defaultLineHeight,h-5)}}function Va(r,o){let a=Na(r),{state:d}=r,h=Kt(d.selection,g=>g.empty?r.moveVertically(g,o,a.height):sn(g,o));if(h.eq(d.selection))return!1;let u;if(a.selfScroll){let g=r.coordsAtPos(d.selection.main.head),b=r.scrollDOM.getBoundingClientRect(),w=b.top+a.marginTop,D=b.bottom-a.marginBottom;g&&g.top>w&&g.bottom<D&&(u=de.scrollIntoView(h.main.head,{y:"start",yMargin:g.top-w}))}return r.dispatch(nt(d,h),{effects:u}),!0}var xa=r=>Va(r,!1),Io=r=>Va(r,!0);function kt(r,o,a){let d=r.lineBlockAt(o.head),h=r.moveToLineBoundary(o,a);if(h.head==o.head&&h.head!=(a?d.to:d.from)&&(h=r.moveToLineBoundary(o,a,!1)),!a&&h.head==d.from&&d.length){let u=/^\s*/.exec(r.state.sliceDoc(d.from,Math.min(d.from+100,d.to)))[0].length;u&&o.head!=d.from+u&&(h=ce.cursor(d.from+u))}return h}var vu=r=>ot(r,o=>kt(r,o,!0)),gu=r=>ot(r,o=>kt(r,o,!1)),mu=r=>ot(r,o=>kt(r,o,!Ee(r))),fu=r=>ot(r,o=>kt(r,o,Ee(r))),bu=r=>ot(r,o=>r.moveToLineBoundary(o,!1,!1)),wu=r=>ot(r,o=>r.moveToLineBoundary(o,!0,!1));function _u(r,o,a){let d=!1,h=Kt(r.selection,u=>{let g=$t(r,u.head,-1)||$t(r,u.head,1)||u.head>0&&$t(r,u.head-1,1)||u.head<r.doc.length&&$t(r,u.head+1,-1);if(!g||!g.end)return u;d=!0;let b=g.start.from==u.head?g.end.to:g.end.from;return a?ce.range(u.anchor,b):ce.cursor(b)});return d?(o(nt(r,h)),!0):!1}var yu=({state:r,dispatch:o})=>_u(r,o,!1);function Ke(r,o,a){let d=Kt(r.state.selection,h=>{h.undirectional&&h.head>=h.anchor!=o&&(h=ce.range(h.head,h.anchor));let u=a(h);return ce.range(h.anchor,u.head,u.goalColumn,u.bidiLevel||void 0,u.assoc)});return d.eq(r.state.selection)?!1:(r.dispatch(nt(r.state,d)),!0)}function Wa(r,o){return Ke(r,o,a=>r.moveByChar(a,o))}var Ha=r=>Wa(r,!Ee(r)),Ba=r=>Wa(r,Ee(r));function Fa(r,o){return Ke(r,o,a=>r.moveByGroup(a,o))}var xu=r=>Fa(r,!Ee(r)),Du=r=>Fa(r,Ee(r));var ku=r=>{let o=!Ee(r);return Ke(r,o,a=>an(r.state,a,o))},Su=r=>{let o=Ee(r);return Ke(r,o,a=>an(r.state,a,o))};function Ua(r,o){return Ke(r,o,a=>r.moveVertically(a,o))}var Ya=r=>Ua(r,!1),qa=r=>Ua(r,!0);function ja(r,o){return Ke(r,o,a=>r.moveVertically(a,o,Na(r).height))}var Da=r=>ja(r,!1),ka=r=>ja(r,!0),Cu=r=>Ke(r,!0,o=>kt(r,o,!0)),Gu=r=>Ke(r,!1,o=>kt(r,o,!1)),Pu=r=>{let o=!Ee(r);return Ke(r,o,a=>kt(r,a,o))},zu=r=>{let o=Ee(r);return Ke(r,o,a=>kt(r,a,o))},Tu=r=>Ke(r,!1,o=>ce.cursor(r.lineBlockAt(o.head).from)),Au=r=>Ke(r,!0,o=>ce.cursor(r.lineBlockAt(o.head).to)),Sa=({state:r,dispatch:o})=>(o(nt(r,{anchor:0})),!0),Ca=({state:r,dispatch:o})=>(o(nt(r,{anchor:r.doc.length})),!0),Ga=({state:r,dispatch:o})=>(o(nt(r,{anchor:r.selection.main.anchor,head:0})),!0),Pa=({state:r,dispatch:o})=>(o(nt(r,{anchor:r.selection.main.anchor,head:r.doc.length})),!0),Eu=({state:r,dispatch:o})=>(o(r.update({selection:{anchor:0,head:r.doc.length},userEvent:"select"})),!0),Iu=({state:r,dispatch:o})=>{let a=dn(r).map(({from:d,to:h})=>ce.undirectionalRange(d,Math.min(h+1,r.doc.length)));return o(r.update({selection:ce.create(a),userEvent:"select"})),!0},Mu=({state:r,dispatch:o})=>{let a=Kt(r.selection,d=>{let h=tn(r),u=h.resolveStack(d.from,1);if(d.empty){let g=h.resolveStack(d.from,-1);g.node.from>=u.node.from&&g.node.to<=u.node.to&&(u=g)}for(let g=u;g;g=g.next){let{node:b}=g;if((b.from<d.from&&b.to>=d.to||b.to>d.to&&b.from<=d.from)&&g.next)return ce.undirectionalRange(b.from,b.to)}return d});return a.eq(r.selection)?!1:(o(nt(r,a)),!0)};function Ja(r,o){let{state:a}=r,d=a.selection,h=a.selection.ranges.slice();for(let u of a.selection.ranges){let g=a.doc.lineAt(u.head);if(o?g.to<r.state.doc.length:g.from>0)for(let b=u;;){let w=r.moveVertically(b,o);if(w.head<g.from||w.head>g.to){h.some(D=>D.head==w.head)||h.push(w);break}else{if(w.head==b.head)break;b=w}}}return h.length==d.ranges.length?!1:(r.dispatch(nt(a,ce.create(h,h.length-1))),!0)}var Lu=r=>Ja(r,!1),Ou=r=>Ja(r,!0),Ru=({state:r,dispatch:o})=>{let a=r.selection,d=null;return a.ranges.length>1?d=ce.create([a.main]):a.main.empty||(d=ce.create([ce.cursor(a.main.head)])),d?(o(nt(r,d)),!0):!1};function bi(r,o){if(r.state.readOnly)return!1;let a="delete.selection",{state:d}=r,h=d.changeByRange(u=>{let{from:g,to:b}=u;if(g==b){let w=o(u);w<g?(a="delete.backward",w=on(r,w,!1)):w>g&&(a="delete.forward",w=on(r,w,!0)),g=Math.min(g,w),b=Math.max(b,w)}else g=on(r,g,!1),b=on(r,b,!0);return g==b?{range:u}:{changes:{from:g,to:b},range:ce.cursor(g,g<u.head?-1:1)}});return h.changes.empty?!1:(r.dispatch(d.update(h,{scrollIntoView:!0,userEvent:a,effects:a=="delete.selection"?de.announce.of(d.phrase("Selection deleted")):void 0})),!0)}function on(r,o,a){if(r instanceof de)for(let d of r.state.facet(de.atomicRanges).map(h=>h(r)))d.between(o,o,(h,u)=>{h<o&&u>o&&(o=a?u:h)});return o}var Ka=(r,o,a)=>bi(r,d=>{let h=d.from,{state:u}=r,g=u.doc.lineAt(h),b,w;if(a&&!o&&h>g.from&&h<g.from+200&&!/[^ \t]/.test(b=g.text.slice(0,h-g.from))){if(b[b.length-1]=="	")return h-1;let D=Xi(b,u.tabSize),C=D%nn(u)||nn(u);for(let P=0;P<C&&b[b.length-1-P]==" ";P++)h--;w=h}else w=mt(g.text,h-g.from,o,o)+g.from,w==h&&g.number!=(o?u.doc.lines:1)?w+=o?1:-1:!o&&/[\ufe00-\ufe0f]/.test(g.text.slice(w-g.from,h-g.from))&&(w=mt(g.text,w-g.from,!1,!1)+g.from);return w}),Mo=r=>Ka(r,!1,!0);var Xa=r=>Ka(r,!0,!1),Za=(r,o)=>bi(r,a=>{let d=a.head,{state:h}=r,u=h.doc.lineAt(d),g=h.charCategorizer(d);for(let b=null;;){if(d==(o?u.to:u.from)){d==a.head&&u.number!=(o?h.doc.lines:1)&&(d+=o?1:-1);break}let w=mt(u.text,d-u.from,o)+u.from,D=u.text.slice(Math.min(d,w)-u.from,Math.max(d,w)-u.from),C=g(D);if(b!=null&&C!=b)break;(D!=" "||d!=a.head)&&(b=C),d=w}return d}),Qa=r=>Za(r,!1),$u=r=>Za(r,!0);var Nu=r=>bi(r,o=>{let a=r.lineBlockAt(o.head).to;return o.head<a?a:Math.min(r.state.doc.length,o.head+1)});var Vu=r=>bi(r,o=>{let a=r.moveToLineBoundary(o,!1).head;return o.head>a?a:Math.max(0,o.head-1)}),Wu=r=>bi(r,o=>{let a=r.moveToLineBoundary(o,!0).head;return o.head<a?a:Math.min(r.state.doc.length,o.head+1)});var Hu=({state:r,dispatch:o})=>{if(r.readOnly)return!1;let a=r.changeByRange(d=>({changes:{from:d.from,to:d.to,insert:jt.of(["",""])},range:ce.cursor(d.from)}));return o(r.update(a,{scrollIntoView:!0,userEvent:"input"})),!0},Bu=({state:r,dispatch:o})=>{if(r.readOnly)return!1;let a=r.changeByRange(d=>{if(!d.empty||d.from==0||d.from==r.doc.length)return{range:d};let h=d.from,u=r.doc.lineAt(h),g=h==u.from?h-1:mt(u.text,h-u.from,!1)+u.from,b=h==u.to?h+1:mt(u.text,h-u.from,!0)+u.from;return{changes:{from:g,to:b,insert:r.doc.slice(h,b).append(r.doc.slice(g,h))},range:ce.cursor(b)}});return a.changes.empty?!1:(o(r.update(a,{scrollIntoView:!0,userEvent:"move.character"})),!0)};function dn(r){let o=[],a=-1;for(let d of r.selection.ranges){let h=r.doc.lineAt(d.from),u=r.doc.lineAt(d.to);if(!d.empty&&d.to==u.from&&(u=r.doc.lineAt(d.to-1)),a>=h.number){let g=o[o.length-1];g.to=u.to,g.ranges.push(d)}else o.push({from:h.from,to:u.to,ranges:[d]});a=u.number+1}return o}function ed(r,o,a){if(r.readOnly)return!1;let d=[],h=[];for(let u of dn(r)){if(a?u.to==r.doc.length:u.from==0)continue;let g=r.doc.lineAt(a?u.to+1:u.from-1),b=g.length+1;if(a){d.push({from:u.to,to:g.to},{from:u.from,insert:g.text+r.lineBreak});for(let w of u.ranges)h.push(ce.range(Math.min(r.doc.length,w.anchor+b),Math.min(r.doc.length,w.head+b)))}else{d.push({from:g.from,to:u.from},{from:u.to,insert:r.lineBreak+g.text});for(let w of u.ranges)h.push(ce.range(w.anchor-b,w.head-b))}}return d.length?(o(r.update({changes:d,scrollIntoView:!0,selection:ce.create(h,r.selection.mainIndex),userEvent:"move.line"})),!0):!1}var Fu=({state:r,dispatch:o})=>ed(r,o,!1),Uu=({state:r,dispatch:o})=>ed(r,o,!0);function td(r,o,a){if(r.readOnly)return!1;let d=[];for(let u of dn(r))a?d.push({from:u.from,insert:r.doc.slice(u.from,u.to)+r.lineBreak}):d.push({from:u.to,insert:r.lineBreak+r.doc.slice(u.from,u.to)});let h=r.changes(d);return o(r.update({changes:h,selection:r.selection.map(h,a?1:-1),scrollIntoView:!0,userEvent:"input.copyline"})),!0}var Yu=({state:r,dispatch:o})=>td(r,o,!1),qu=({state:r,dispatch:o})=>td(r,o,!0),ju=r=>{if(r.state.readOnly)return!1;let{state:o}=r,a=o.changes(dn(o).map(({from:h,to:u})=>(h>0?h--:u<o.doc.length&&u++,{from:h,to:u}))),d=Kt(o.selection,h=>{let u;if(r.lineWrapping){let g=r.lineBlockAt(h.head),b=r.coordsAtPos(h.head,h.assoc||1);b&&(u=g.bottom+r.documentTop-b.bottom+r.defaultLineHeight/2)}return r.moveVertically(h,!0,u)}).map(a);return r.dispatch({changes:a,selection:d,scrollIntoView:!0,userEvent:"delete.line"}),!0};function Ju(r,o){if(/\(\)|\[\]|\{\}/.test(r.sliceDoc(o-1,o+1)))return{from:o,to:o};let a=tn(r).resolveInner(o),d=a.childBefore(o),h=a.childAfter(o),u;return d&&h&&d.to<=o&&h.from>=o&&(u=d.type.prop(en.closedBy))&&u.indexOf(h.name)>-1&&r.doc.lineAt(d.to).from==r.doc.lineAt(h.from).from&&!/\S/.test(r.sliceDoc(d.to,h.from))?{from:d.to,to:h.from}:null}var za=id(!1),Ku=id(!0);function id(r){return({state:o,dispatch:a})=>{if(o.readOnly)return!1;let d=o.changeByRange(h=>{let{from:u,to:g}=h,b=o.doc.lineAt(u),w=!r&&u==g&&Ju(o,u);r&&(u=g=(g<=b.to?b:o.doc.lineAt(g)).to);let D=new zo(o,{simulateBreak:u,simulateDoubleBreak:!!w}),C=Po(D,u);for(C==null&&(C=Xi(/^\s*/.exec(o.doc.lineAt(u).text)[0],o.tabSize));g<b.to&&/\s/.test(b.text[g-b.from]);)g++;w?{from:u,to:g}=w:u>b.from&&u<b.from+100&&!/\S/.test(b.text.slice(0,u))&&(u=b.from);let P=["",gi(o,C)];return w&&P.push(gi(o,D.lineIndent(b.from,-1))),{changes:{from:u,to:g,insert:jt.of(P)},range:ce.cursor(u+1+P[1].length)}});return a(o.update(d,{scrollIntoView:!0,userEvent:"input"})),!0}}function Ro(r,o){let a=-1;return r.changeByRange(d=>{let h=[];for(let g=d.from;g<=d.to;){let b=r.doc.lineAt(g);b.number>a&&(d.empty||d.to>b.from)&&(o(b,h,d),a=b.number),g=b.to+1}let u=r.changes(h);return{changes:h,range:ce.range(u.mapPos(d.anchor,1),u.mapPos(d.head,1))}})}var Xu=({state:r,dispatch:o})=>{if(r.readOnly)return!1;let a=Object.create(null),d=new zo(r,{overrideIndentation:u=>{let g=a[u];return g??-1}}),h=Ro(r,(u,g,b)=>{let w=Po(d,u.from);if(w==null)return;/\S/.test(u.text)||(w=0);let D=/^\s*/.exec(u.text)[0],C=gi(r,w);(D!=C||b.from<u.from+D.length)&&(a[u.from]=w,g.push({from:u.from,to:u.from+D.length,insert:C}))});return h.changes.empty||o(r.update(h,{userEvent:"indent"})),!0},Zu=({state:r,dispatch:o})=>r.readOnly?!1:(o(r.update(Ro(r,(a,d)=>{d.push({from:a.from,insert:r.facet(va)})}),{userEvent:"input.indent"})),!0),Qu=({state:r,dispatch:o})=>r.readOnly?!1:(o(r.update(Ro(r,(a,d)=>{let h=/^\s*/.exec(a.text)[0];if(!h)return;let u=Xi(h,r.tabSize),g=0,b=gi(r,Math.max(0,u-nn(r)));for(;g<h.length&&g<b.length&&h.charCodeAt(g)==b.charCodeAt(g);)g++;d.push({from:a.from+g,to:a.from+h.length,insert:b.slice(g)})}),{userEvent:"delete.dedent"})),!0),ep=r=>(r.setTabFocusMode(),!0);var tp=[{key:"Ctrl-b",run:Ia,shift:Ha,preventDefault:!0},{key:"Ctrl-f",run:Ma,shift:Ba},{key:"Ctrl-p",run:Ra,shift:Ya},{key:"Ctrl-n",run:$a,shift:qa},{key:"Ctrl-a",run:bu,shift:Tu},{key:"Ctrl-e",run:wu,shift:Au},{key:"Ctrl-d",run:Xa},{key:"Ctrl-h",run:Mo},{key:"Ctrl-k",run:Nu},{key:"Ctrl-Alt-h",run:Qa},{key:"Ctrl-o",run:Hu},{key:"Ctrl-t",run:Bu},{key:"Ctrl-v",run:Io}],ip=[{key:"ArrowLeft",run:Ia,shift:Ha,preventDefault:!0},{key:"Mod-ArrowLeft",mac:"Alt-ArrowLeft",run:lu,shift:xu,preventDefault:!0},{mac:"Cmd-ArrowLeft",run:mu,shift:Pu,preventDefault:!0},{key:"ArrowRight",run:Ma,shift:Ba,preventDefault:!0},{key:"Mod-ArrowRight",mac:"Alt-ArrowRight",run:cu,shift:Du,preventDefault:!0},{mac:"Cmd-ArrowRight",run:fu,shift:zu,preventDefault:!0},{key:"ArrowUp",run:Ra,shift:Ya,preventDefault:!0},{mac:"Cmd-ArrowUp",run:Sa,shift:Ga},{mac:"Ctrl-ArrowUp",run:xa,shift:Da},{key:"ArrowDown",run:$a,shift:qa,preventDefault:!0},{mac:"Cmd-ArrowDown",run:Ca,shift:Pa},{mac:"Ctrl-ArrowDown",run:Io,shift:ka},{key:"PageUp",run:xa,shift:Da},{key:"PageDown",run:Io,shift:ka},{key:"Home",run:gu,shift:Gu,preventDefault:!0},{key:"Mod-Home",run:Sa,shift:Ga},{key:"End",run:vu,shift:Cu,preventDefault:!0},{key:"Mod-End",run:Ca,shift:Pa},{key:"Enter",run:za,shift:za},{key:"Mod-a",run:Eu},{key:"Backspace",run:Mo,shift:Mo,preventDefault:!0},{key:"Delete",run:Xa,preventDefault:!0},{key:"Mod-Backspace",mac:"Alt-Backspace",run:Qa,preventDefault:!0},{key:"Mod-Delete",mac:"Alt-Delete",run:$u,preventDefault:!0},{mac:"Mod-Backspace",run:Vu,preventDefault:!0},{mac:"Mod-Delete",run:Wu,preventDefault:!0}].concat(tp.map(r=>({mac:r.key,run:r.run,shift:r.shift}))),nd=[{key:"Alt-ArrowLeft",mac:"Ctrl-ArrowLeft",run:uu,shift:ku},{key:"Alt-ArrowRight",mac:"Ctrl-ArrowRight",run:pu,shift:Su},{key:"Alt-ArrowUp",run:Fu},{key:"Shift-Alt-ArrowUp",run:Yu},{key:"Alt-ArrowDown",run:Uu},{key:"Shift-Alt-ArrowDown",run:qu},{key:"Mod-Alt-ArrowUp",run:Lu},{key:"Mod-Alt-ArrowDown",run:Ou},{key:"Escape",run:Ru},{key:"Mod-Enter",run:Ku},{key:"Alt-l",mac:"Ctrl-l",run:Iu},{key:"Mod-i",run:Mu,preventDefault:!0},{key:"Mod-[",run:Qu},{key:"Mod-]",run:Zu},{key:"Mod-Alt-\\",run:Xu},{key:"Shift-Mod-k",run:ju},{key:"Shift-Mod-\\",run:yu},{key:"Mod-/",run:jh},{key:"Alt-A",mac:"Ctrl-A",run:Kh},{key:"Ctrl-m",mac:"Shift-Alt-m",run:ep}].concat(ip);var od=typeof String.prototype.normalize=="function"?r=>r.normalize("NFKD"):r=>r,Ct=class{constructor(o,a,d=0,h=o.length,u,g){this.test=g,this.value={from:0,to:0,precise:!1},this.done=!1,this.matches=[],this.buffer="",this.bufferPos=0,this.iter=o.iterRange(d,h),this.bufferStart=d,this.normalize=u?b=>u(od(b)):od,this.query=this.normalize(a)}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return-1;this.bufferPos=0,this.buffer=this.iter.value}return Ks(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let o=this.peek();if(o<0)return this.done=!0,this;let a=Xs(o),d=this.bufferStart+this.bufferPos;this.bufferPos+=Zs(o);let h=this.normalize(a);if(h.length)for(let u=0,g=d,b=!0;;u++){let w=h.charCodeAt(u),D=this.match(w,g,b,this.bufferPos+this.bufferStart,u==h.length-1);if(D)return this.value=D,this;if(u==h.length-1)break;b&&u<a.length&&a.charCodeAt(u)==w?g++:b=!1}}}match(o,a,d,h,u){let g=null;for(let b=0;b<this.matches.length;){let w=this.matches[b],D=!1;this.query.charCodeAt(w.index)==o&&(w.index==this.query.length-1?g={from:w.from,to:h,precise:u&&w.precise}:(w.index++,D=!0)),D?b++:this.matches.splice(b,1)}return this.query.charCodeAt(0)==o&&(this.query.length==1?g={from:a,to:h,precise:d&&u}:this.matches.push({from:a,index:1,precise:d})),g&&this.test&&!this.test(g.from,g.to,this.buffer,this.bufferStart)&&(g=null),g}};typeof Symbol<"u"&&(Ct.prototype[Symbol.iterator]=function(){return this});var ad={from:-1,to:-1,match:/.*/.exec(""),precise:!0},Bo="gm"+(/x/.unicode==null?"":"u"),hn=class{constructor(o,a,d,h=0,u=o.length){if(this.text=o,this.to=u,this.curLine="",this.done=!1,this.value=ad,/\\[sWDnr]|\n|\r|\[\^/.test(a))return new pn(o,a,d,h,u);this.re=new RegExp(a,Bo+(d?.ignoreCase?"i":"")),this.test=d?.test,this.iter=o.iter();let g=o.lineAt(h);this.curLineStart=g.from,this.matchPos=vn(o,h),this.getLine(this.curLineStart)}getLine(o){this.iter.next(o),this.iter.lineBreak?this.curLine="":(this.curLine=this.iter.value,this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart)),this.iter.next())}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1,this.curLineStart>this.to?this.curLine="":this.getLine(0)}next(){for(let o=this.matchPos-this.curLineStart;;){this.re.lastIndex=o;let a=this.matchPos<=this.to&&this.re.exec(this.curLine);if(a){let d=this.curLineStart+a.index,h=d+a[0].length;if(this.matchPos=vn(this.text,h+(d==h?1:0)),d==this.curLineStart+this.curLine.length&&this.nextLine(),(d<h||d>this.value.to)&&(!this.test||this.test(d,h,a)))return this.value={from:d,to:h,precise:!0,match:a},this;o=this.matchPos-this.curLineStart}else if(this.curLineStart+this.curLine.length<this.to)this.nextLine(),o=0;else return this.done=!0,this}}},$o=new WeakMap,un=class r{constructor(o,a){this.from=o,this.text=a}get to(){return this.from+this.text.length}static get(o,a,d){let h=$o.get(o);if(!h||h.from>=d||h.to<=a){let b=new r(a,o.sliceString(a,d));return $o.set(o,b),b}if(h.from==a&&h.to==d)return h;let{text:u,from:g}=h;return g>a&&(u=o.sliceString(a,g)+u,g=a),h.to<d&&(u+=o.sliceString(h.to,d)),$o.set(o,new r(g,u)),new r(a,u.slice(a-g,d-g))}},pn=class{constructor(o,a,d,h,u){this.text=o,this.to=u,this.done=!1,this.value=ad,this.matchPos=vn(o,h),this.re=new RegExp(a,Bo+(d?.ignoreCase?"i":"")),this.test=d?.test,this.flat=un.get(o,h,this.chunkEnd(h+5e3))}chunkEnd(o){return o>=this.to?this.to:this.text.lineAt(o).to}next(){for(;;){let o=this.re.lastIndex=this.matchPos-this.flat.from,a=this.re.exec(this.flat.text);if(a&&!a[0]&&a.index==o&&(this.re.lastIndex=o+1,a=this.re.exec(this.flat.text)),a){let d=this.flat.from+a.index,h=d+a[0].length;if((this.flat.to>=this.to||a.index+a[0].length<=this.flat.text.length-10)&&(!this.test||this.test(d,h,a)))return this.value={from:d,to:h,precise:!0,match:a},this.matchPos=vn(this.text,h+(d==h?1:0)),this}if(this.flat.to==this.to)return this.done=!0,this;this.flat=un.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+this.flat.text.length*2))}}};typeof Symbol<"u"&&(hn.prototype[Symbol.iterator]=pn.prototype[Symbol.iterator]=function(){return this});function np(r){try{return new RegExp(r,Bo),!0}catch{return!1}}function vn(r,o){if(o>=r.length)return o;let a=r.lineAt(o),d;for(;o<a.to&&(d=a.text.charCodeAt(o-a.from))>=56320&&d<57344;)o++;return o}var op=r=>{let o=ca(r,"cm-goto-line");if(o){let g=o.dom.querySelector("input[type=text]");return g&&g.select(),!0}let{state:a}=r,d=String(a.doc.lineAt(r.state.selection.main.head).number),{close:h,result:u}=la(r,{class:"cm-goto-line",label:a.phrase("Go to line"),input:{type:"text",name:"line",value:d},focus:!0,submitLabel:a.phrase("go")});return u.then(g=>{let b=g&&/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(g.elements.line.value);if(!b){r.dispatch({effects:h});return}let w=a.doc.lineAt(a.selection.main.head),[,D,C,P,T]=b,R=P?+P.slice(1):0,V=C?+C:w.number;if(C&&T){let G=V/100;D&&(G=G*(D=="-"?-1:1)+w.number/a.doc.lines),V=Math.round(a.doc.lines*G)}else C&&D&&(V=V*(D=="-"?-1:1)+w.number);let j=a.doc.line(Math.max(1,Math.min(a.doc.lines,V))),H=ce.cursor(j.from+Math.max(0,Math.min(R,j.length)));r.dispatch({effects:[h,de.scrollIntoView(H.from,{y:"center"})],selection:H})}),!0},rp={highlightWordAroundCursor:!1,minSelectionLength:1,maxMatches:100,wholeWords:!1},dd=Dt.define({combine(r){return Ki(r,rp,{highlightWordAroundCursor:(o,a)=>o||a,minSelectionLength:Math.min,maxMatches:Math.min})}});function ld(r){let o=[cp,lp];return r&&o.push(dd.of(r)),o}var sp=me.mark({class:"cm-selectionMatch"}),ap=me.mark({class:"cm-selectionMatch cm-selectionMatch-main"});function rd(r,o,a,d){return(a==0||r(o.sliceDoc(a-1,a))!=Le.Word)&&(d==o.doc.length||r(o.sliceDoc(d,d+1))!=Le.Word)}function dp(r,o,a,d){return r(o.sliceDoc(a,a+1))==Le.Word&&r(o.sliceDoc(d-1,d))==Le.Word}var lp=vi.fromClass(class{constructor(r){this.decorations=this.getDeco(r)}update(r){(r.selectionSet||r.docChanged||r.viewportChanged)&&(this.decorations=this.getDeco(r.view))}getDeco(r){let o=r.state.facet(dd),{state:a}=r,d=a.selection;if(d.ranges.length>1)return me.none;let h=d.main,u,g=null;if(h.empty){if(!o.highlightWordAroundCursor)return me.none;let w=a.wordAt(h.head);if(!w)return me.none;g=a.charCategorizer(h.head),u=a.sliceDoc(w.from,w.to)}else{let w=h.to-h.from;if(w<o.minSelectionLength||w>200)return me.none;if(o.wholeWords){if(u=a.sliceDoc(h.from,h.to),g=a.charCategorizer(h.head),!(rd(g,a,h.from,h.to)&&dp(g,a,h.from,h.to)))return me.none}else if(u=a.sliceDoc(h.from,h.to),!u)return me.none}let b=[];for(let w of r.visibleRanges){let D=new Ct(a.doc,u,w.from,w.to);for(;!D.next().done;){let{from:C,to:P}=D.value;if((!g||rd(g,a,C,P))&&(h.empty&&C<=h.from&&P>=h.to?b.push(ap.range(C,P)):(C>=h.to||P<=h.from)&&b.push(sp.range(C,P)),b.length>o.maxMatches))return me.none}}return me.set(b)}},{decorations:r=>r.decorations}),cp=de.baseTheme({".cm-selectionMatch":{backgroundColor:"#99ff7780"},".cm-searchMatch .cm-selectionMatch":{backgroundColor:"transparent"}}),hp=({state:r,dispatch:o})=>{let{selection:a}=r,d=ce.create(a.ranges.map(h=>r.wordAt(h.head)||ce.cursor(h.head)),a.mainIndex);return d.eq(a)?!1:(o(r.update({selection:d})),!0)};function up(r,o){let{main:a,ranges:d}=r.selection,h=r.wordAt(a.head),u=h&&h.from==a.from&&h.to==a.to;for(let g=!1,b=new Ct(r.doc,o,d[d.length-1].to);;)if(b.next(),b.done){if(g)return null;b=new Ct(r.doc,o,0,Math.max(0,d[d.length-1].from-1)),g=!0}else{if(g&&d.some(w=>w.from==b.value.from))continue;if(u){let w=r.wordAt(b.value.from);if(!w||w.from!=b.value.from||w.to!=b.value.to)continue}return b.value}}var pp=({state:r,dispatch:o})=>{let{ranges:a}=r.selection;if(a.some(u=>u.from===u.to))return hp({state:r,dispatch:o});let d=r.sliceDoc(a[0].from,a[0].to);if(r.selection.ranges.some(u=>r.sliceDoc(u.from,u.to)!=d))return!1;let h=up(r,d);return h?(o(r.update({selection:r.selection.addRange(ce.range(h.from,h.to),!1),effects:de.scrollIntoView(h.to)})),!0):!1},Qt=Dt.define({combine(r){return Ki(r,{top:!1,caseSensitive:!1,literal:!1,regexp:!1,wholeWord:!1,createPanel:o=>new Ho(o),scrollToMatch:o=>de.scrollIntoView(o)})}});var gn=class{constructor(o){this.search=o.search,this.caseSensitive=!!o.caseSensitive,this.literal=!!o.literal,this.regexp=!!o.regexp,this.replace=o.replace||"",this.valid=!!this.search&&(!this.regexp||np(this.search)),this.unquoted=this.unquote(this.search),this.wholeWord=!!o.wholeWord,this.test=o.test}unquote(o){return this.literal?o:o.replace(/\\([nrt\\])/g,(a,d)=>d=="n"?`
`:d=="r"?"\r":d=="t"?"	":"\\")}eq(o){return this.search==o.search&&this.replace==o.replace&&this.caseSensitive==o.caseSensitive&&this.regexp==o.regexp&&this.wholeWord==o.wholeWord&&this.test==o.test}create(){return this.regexp?new Vo(this):new No(this)}getCursor(o,a=0,d){let h=o.doc?o:ct.create({doc:o});return d==null&&(d=h.doc.length),this.regexp?Zt(this,h,a,d):Xt(this,h,a,d)}},mn=class{constructor(o){this.spec=o}};function vp(r,o,a){return(d,h,u,g)=>{if(a&&!a(d,h,u,g))return!1;let b=d>=g&&h<=g+u.length?u.slice(d-g,h-g):o.doc.sliceString(d,h);return r(b,o,d,h)}}function Xt(r,o,a,d){let h;return r.wholeWord&&(h=gp(o.doc,o.charCategorizer(o.selection.main.head))),r.test&&(h=vp(r.test,o,h)),new Ct(o.doc,r.unquoted,a,d,r.caseSensitive?void 0:u=>u.toLowerCase(),h)}function gp(r,o){return(a,d,h,u)=>((u>a||u+h.length<d)&&(u=Math.max(0,a-2),h=r.sliceString(u,Math.min(r.length,d+2))),(o(fn(h,a-u))!=Le.Word||o(bn(h,a-u))!=Le.Word)&&(o(bn(h,d-u))!=Le.Word||o(fn(h,d-u))!=Le.Word))}var No=class extends mn{constructor(o){super(o)}nextMatch(o,a,d){let h=Xt(this.spec,o,d,o.doc.length).nextOverlapping();if(h.done){let u=Math.min(o.doc.length,a+this.spec.unquoted.length);h=Xt(this.spec,o,0,u).nextOverlapping()}return h.done||h.value.from==a&&h.value.to==d?null:h.value}prevMatchInRange(o,a,d){for(let h=d;;){let u=Math.max(a,h-1e4-this.spec.unquoted.length),g=Xt(this.spec,o,u,h),b=null;for(;!g.nextOverlapping().done;)b=g.value;if(b)return b;if(u==a)return null;h-=1e4}}prevMatch(o,a,d){let h=this.prevMatchInRange(o,0,a);return h||(h=this.prevMatchInRange(o,Math.max(0,d-this.spec.unquoted.length),o.doc.length)),h&&(h.from!=a||h.to!=d)?h:null}getReplacement(o){return this.spec.unquote(this.spec.replace)}matchAll(o,a){let d=Xt(this.spec,o,0,o.doc.length),h=[];for(;!d.next().done;){if(h.length>=a)return null;h.push(d.value)}return h}highlight(o,a,d,h){let u=Xt(this.spec,o,Math.max(0,a-this.spec.unquoted.length),Math.min(d+this.spec.unquoted.length,o.doc.length));for(;!u.next().done;)h(u.value.from,u.value.to)}};function mp(r,o,a){return(d,h,u)=>(!a||a(d,h,u))&&r(u[0],o,d,h)}function Zt(r,o,a,d){let h;return r.wholeWord&&(h=fp(o.charCategorizer(o.selection.main.head))),r.test&&(h=mp(r.test,o,h)),new hn(o.doc,r.search,{ignoreCase:!r.caseSensitive,test:h},a,d)}function fn(r,o){return r.slice(mt(r,o,!1),o)}function bn(r,o){return r.slice(o,mt(r,o))}function fp(r){return(o,a,d)=>!d[0].length||(r(fn(d.input,d.index))!=Le.Word||r(bn(d.input,d.index))!=Le.Word)&&(r(bn(d.input,d.index+d[0].length))!=Le.Word||r(fn(d.input,d.index+d[0].length))!=Le.Word)}var Vo=class extends mn{nextMatch(o,a,d){let h=Zt(this.spec,o,d,o.doc.length).next();return h.done&&(h=Zt(this.spec,o,0,a).next()),h.done?null:h.value}prevMatchInRange(o,a,d){for(let h=1;;h++){let u=Math.max(a,d-h*1e4),g=Zt(this.spec,o,u,d),b=null;for(;!g.next().done;)b=g.value;if(b&&(u==a||b.from>u+10))return b;if(u==a)return null}}prevMatch(o,a,d){return this.prevMatchInRange(o,0,a)||this.prevMatchInRange(o,d,o.doc.length)}getReplacement(o){return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g,(a,d)=>{if(d=="&")return o.match[0];if(d=="$")return"$";for(let h=d.length;h>0;h--){let u=+d.slice(0,h);if(u>0&&u<o.match.length)return o.match[u]+d.slice(h)}return a})}matchAll(o,a){let d=Zt(this.spec,o,0,o.doc.length),h=[];for(;!d.next().done;){if(h.length>=a)return null;h.push(d.value)}return h}highlight(o,a,d,h){let u=Zt(this.spec,o,Math.max(0,a-250),Math.min(d+250,o.doc.length));for(;!u.next().done;)h(u.value.from,u.value.to)}},_i=Ae.define(),Fo=Ae.define(),St=je.define({create(r){return new wi(Wo(r).create(),null)},update(r,o){for(let a of o.effects)a.is(_i)?r=new wi(a.value.create(),r.panel):a.is(Fo)&&(r=new wi(r.query,a.value?Uo:null));return r},provide:r=>da.from(r,o=>o.panel)});var wi=class{constructor(o,a){this.query=o,this.panel=a}},bp=me.mark({class:"cm-searchMatch"}),wp=me.mark({class:"cm-searchMatch cm-searchMatch-selected"}),_p=vi.fromClass(class{constructor(r){this.view=r,this.decorations=this.highlight(r.state.field(St))}update(r){let o=r.state.field(St);(o!=r.startState.field(St)||r.docChanged||r.selectionSet||r.viewportChanged)&&(this.decorations=this.highlight(o))}highlight({query:r,panel:o}){if(!o||!r.spec.valid)return me.none;let{view:a}=this,d=new ft;for(let h=0,u=a.visibleRanges,g=u.length;h<g;h++){let{from:b,to:w}=u[h];for(;h<g-1&&w>u[h+1].from-500;)w=u[++h].to;r.highlight(a.state,b,w,(D,C)=>{let P=a.state.selection.ranges.some(T=>T.from==D&&T.to==C);d.add(D,C,P?wp:bp)})}return d.finish()}},{decorations:r=>r.decorations});function yi(r){return o=>{let a=o.state.field(St,!1);return a&&a.query.spec.valid?r(o,a):ud(o)}}var wn=yi((r,{query:o})=>{let{to:a}=r.state.selection.main,d=o.nextMatch(r.state,a,a);if(!d)return!1;let h=ce.single(d.from,d.to),u=r.state.facet(Qt);return r.dispatch({selection:h,effects:[Yo(r,d),u.scrollToMatch(h.main,r)],userEvent:"select.search"}),hd(r),!0}),_n=yi((r,{query:o})=>{let{state:a}=r,{from:d}=a.selection.main,h=o.prevMatch(a,d,d);if(!h)return!1;let u=ce.single(h.from,h.to),g=r.state.facet(Qt);return r.dispatch({selection:u,effects:[Yo(r,h),g.scrollToMatch(u.main,r)],userEvent:"select.search"}),hd(r),!0}),yp=yi((r,{query:o})=>{let a=o.matchAll(r.state,1e3);return!a||!a.length?!1:(r.dispatch({selection:ce.create(a.map(d=>ce.range(d.from,d.to))),userEvent:"select.search.matches"}),!0)}),xp=({state:r,dispatch:o})=>{let a=r.selection;if(a.ranges.length>1||a.main.empty)return!1;let{from:d,to:h}=a.main,u=[],g=0;for(let b=new Ct(r.doc,r.sliceDoc(d,h));!b.next().done;){if(u.length>1e3)return!1;b.value.from==d&&(g=u.length),u.push(ce.range(b.value.from,b.value.to))}return o(r.update({selection:ce.create(u,g),userEvent:"select.search.matches"})),!0},sd=yi((r,{query:o})=>{let{state:a}=r,{from:d,to:h}=a.selection.main;if(a.readOnly)return!1;let u=o.nextMatch(a,d,d);if(!u)return!1;let g=u,b=[],w,D,C=[];g.precise?g.from==d&&g.to==h&&(D=a.toText(o.getReplacement(g)),b.push({from:g.from,to:g.to,insert:D}),g=o.nextMatch(a,g.from,g.to),C.push(de.announce.of(a.phrase("replaced match on line $",a.doc.lineAt(d).number)+"."))):g=o.nextMatch(a,g.from,g.to);let P=r.state.changes(b);return g&&(w=ce.single(g.from,g.to).map(P),C.push(Yo(r,g)),C.push(a.facet(Qt).scrollToMatch(w.main,r))),r.dispatch({changes:P,selection:w,effects:C,userEvent:"input.replace"}),!0}),Dp=yi((r,{query:o})=>{if(r.state.readOnly)return!1;let a=[];for(let h of o.matchAll(r.state,1e9)){let{from:u,to:g,precise:b}=h;b&&a.push({from:u,to:g,insert:o.getReplacement(h)})}if(!a.length)return!1;let d=r.state.phrase("replaced $ matches",a.length)+".";return r.dispatch({changes:a,effects:de.announce.of(d),userEvent:"input.replace.all"}),!0});function Uo(r){return r.state.facet(Qt).createPanel(r)}function Wo(r,o){var a,d,h,u,g;let b=r.selection.main,w=b.empty||b.to>b.from+100?"":r.sliceDoc(b.from,b.to);if(o&&!w)return o;let D=r.facet(Qt);return new gn({search:((a=o?.literal)!==null&&a!==void 0?a:D.literal)?w:w.replace(/\n/g,"\\n"),caseSensitive:(d=o?.caseSensitive)!==null&&d!==void 0?d:D.caseSensitive,literal:(h=o?.literal)!==null&&h!==void 0?h:D.literal,regexp:(u=o?.regexp)!==null&&u!==void 0?u:D.regexp,wholeWord:(g=o?.wholeWord)!==null&&g!==void 0?g:D.wholeWord})}function cd(r){let o=Co(r,Uo);return o&&o.dom.querySelector("[main-field]")}function hd(r){let o=cd(r);o&&o==r.root.activeElement&&o.select()}var ud=r=>{let o=r.state.field(St,!1);if(o&&o.panel){let a=cd(r);if(a&&a!=r.root.activeElement){let d=Wo(r.state,o.query.spec);d.valid&&r.dispatch({effects:_i.of(d)}),a.focus(),a.select()}}else r.dispatch({effects:[Fo.of(!0),o?_i.of(Wo(r.state,o.query.spec)):Ae.appendConfig.of(Sp)]});return!0},pd=r=>{let o=r.state.field(St,!1);if(!o||!o.panel)return!1;let a=Co(r,Uo);return a&&a.dom.contains(r.root.activeElement)&&r.focus(),r.dispatch({effects:Fo.of(!1)}),!0},vd=[{key:"Mod-f",run:ud,scope:"editor search-panel"},{key:"F3",run:wn,shift:_n,scope:"editor search-panel",preventDefault:!0},{key:"Mod-g",run:wn,shift:_n,scope:"editor search-panel",preventDefault:!0},{key:"Escape",run:pd,scope:"editor search-panel"},{key:"Mod-Shift-l",run:xp},{key:"Mod-Alt-g",run:op},{key:"Mod-d",run:pp,preventDefault:!0}],Ho=class{constructor(o){this.view=o;let a=this.query=o.state.field(St).query.spec;this.commit=this.commit.bind(this),this.searchField=Be("input",{value:a.search,placeholder:Fe(o,"Find"),"aria-label":Fe(o,"Find"),class:"cm-textfield",name:"search",form:"","main-field":"true",onchange:this.commit,onkeyup:this.commit}),this.replaceField=Be("input",{value:a.replace,placeholder:Fe(o,"Replace"),"aria-label":Fe(o,"Replace"),class:"cm-textfield",name:"replace",form:"",onchange:this.commit,onkeyup:this.commit}),this.caseField=Be("input",{type:"checkbox",name:"case",form:"",checked:a.caseSensitive,onchange:this.commit}),this.reField=Be("input",{type:"checkbox",name:"re",form:"",checked:a.regexp,onchange:this.commit}),this.wordField=Be("input",{type:"checkbox",name:"word",form:"",checked:a.wholeWord,onchange:this.commit});function d(h,u,g){return Be("button",{class:"cm-button",name:h,onclick:u,type:"button"},g)}this.dom=Be("div",{onkeydown:h=>this.keydown(h),class:"cm-search"},[this.searchField,d("next",()=>wn(o),[Fe(o,"next")]),d("prev",()=>_n(o),[Fe(o,"previous")]),d("select",()=>yp(o),[Fe(o,"all")]),Be("label",null,[this.caseField,Fe(o,"match case")]),Be("label",null,[this.reField,Fe(o,"regexp")]),Be("label",null,[this.wordField,Fe(o,"by word")]),...o.state.readOnly?[]:[Be("br"),this.replaceField,d("replace",()=>sd(o),[Fe(o,"replace")]),d("replaceAll",()=>Dp(o),[Fe(o,"replace all")])],Be("button",{name:"close",onclick:()=>pd(o),"aria-label":Fe(o,"close"),type:"button"},["\xD7"])])}commit(){let o=new gn({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});o.eq(this.query)||(this.query=o,this.view.dispatch({effects:_i.of(o)}))}keydown(o){oa(this.view,o,"search-panel")?o.preventDefault():o.keyCode==13&&o.target==this.searchField?(o.preventDefault(),(o.shiftKey?_n:wn)(this.view)):o.keyCode==13&&o.target==this.replaceField&&(o.preventDefault(),sd(this.view))}update(o){for(let a of o.transactions)for(let d of a.effects)d.is(_i)&&!d.value.eq(this.query)&&this.setQuery(d.value)}setQuery(o){this.query=o,this.searchField.value=o.search,this.replaceField.value=o.replace,this.caseField.checked=o.caseSensitive,this.reField.checked=o.regexp,this.wordField.checked=o.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(Qt).top}};function Fe(r,o){return r.state.phrase(o)}var ln=30,cn=/[\s\.,:;?!]/;function Yo(r,{from:o,to:a}){let d=r.state.doc.lineAt(o),h=r.state.doc.lineAt(a).to,u=Math.max(d.from,o-ln),g=Math.min(h,a+ln),b=r.state.sliceDoc(u,g);if(u!=d.from){for(let w=0;w<ln;w++)if(!cn.test(b[w+1])&&cn.test(b[w])){b=b.slice(w);break}}if(g!=h){for(let w=b.length-1;w>b.length-ln;w--)if(!cn.test(b[w-1])&&cn.test(b[w])){b=b.slice(0,w);break}}return de.announce.of(`${r.state.phrase("current match")}. ${b} ${r.state.phrase("on line")} ${d.number}.`)}var kp=de.baseTheme({".cm-panel.cm-search":{padding:"2px 6px 4px",position:"relative","& [name=close]":{position:"absolute",top:"0",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",padding:0,margin:0},"& input, & button, & label":{margin:".2em .6em .2em 0"},"& input[type=checkbox]":{marginRight:".2em"},"& label":{fontSize:"80%",whiteSpace:"pre"}},"&light .cm-searchMatch":{backgroundColor:"#ffff0054"},"&dark .cm-searchMatch":{backgroundColor:"#00ffff8a"},"&light .cm-searchMatch-selected":{backgroundColor:"#ff6a0054"},"&dark .cm-searchMatch-selected":{backgroundColor:"#ff00ff8a"}}),Sp=[St,Lt.low(_p),kp];var Cp="#e5c07b",gd="#e06c75",Gp="#56b6c2",Pp="#ffffff",yn="#abb2bf",jo="#7d8799",zp="#61afef",Tp="#98c379",md="#d19a66",Ap="#c678dd",Ep="#21252b",fd="#2c313a",bd="#282c34",qo="#353a42",Ip="#3E4451",wd="#528bff";var Mp=de.theme({"&":{color:yn,backgroundColor:bd},".cm-content":{caretColor:wd},".cm-cursor, .cm-dropCursor":{borderLeftColor:wd},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:Ip},".cm-panels":{backgroundColor:Ep,color:yn},".cm-panels.cm-panels-top":{borderBottom:"2px solid black"},".cm-panels.cm-panels-bottom":{borderTop:"2px solid black"},".cm-searchMatch":{backgroundColor:"#72a1ff59",outline:"1px solid #457dff"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"#6199ff2f"},".cm-activeLine":{backgroundColor:"#6699ff0b"},".cm-selectionMatch":{backgroundColor:"#aafe661a"},"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bad0f847"},".cm-gutters":{backgroundColor:bd,color:jo,border:"none"},".cm-activeLineGutter":{backgroundColor:fd},".cm-foldPlaceholder":{backgroundColor:"transparent",border:"none",color:"#ddd"},".cm-tooltip":{border:"none",backgroundColor:qo},".cm-tooltip .cm-tooltip-arrow:before":{borderTopColor:"transparent",borderBottomColor:"transparent"},".cm-tooltip .cm-tooltip-arrow:after":{borderTopColor:qo,borderBottomColor:qo},".cm-tooltip-autocomplete":{"& > ul > li[aria-selected]":{backgroundColor:fd,color:yn}}},{dark:!0}),Lp=fa.define([{tag:ie.keyword,color:Ap},{tag:[ie.name,ie.deleted,ie.character,ie.propertyName,ie.macroName],color:gd},{tag:[ie.function(ie.variableName),ie.labelName],color:zp},{tag:[ie.color,ie.constant(ie.name),ie.standard(ie.name)],color:md},{tag:[ie.definition(ie.name),ie.separator],color:yn},{tag:[ie.typeName,ie.className,ie.number,ie.changed,ie.annotation,ie.modifier,ie.self,ie.namespace],color:Cp},{tag:[ie.operator,ie.operatorKeyword,ie.url,ie.escape,ie.regexp,ie.link,ie.special(ie.string)],color:Gp},{tag:[ie.meta,ie.comment],color:jo},{tag:ie.strong,fontWeight:"bold"},{tag:ie.emphasis,fontStyle:"italic"},{tag:ie.strikethrough,textDecoration:"line-through"},{tag:ie.link,color:jo,textDecoration:"underline"},{tag:ie.heading,fontWeight:"bold",color:gd},{tag:[ie.atom,ie.bool,ie.special(ie.variableName)],color:md},{tag:[ie.processingInstruction,ie.string,ie.inserted],color:Tp},{tag:ie.invalid,color:Pp}]),_d=[Mp,mi(Lp)];var bt=class extends Error{constructor(a,d){super(d);this.status=a}};async function Gt(r){let o=await fetch(r),a=await o.json().catch(()=>({error:o.statusText}));if(!o.ok)throw new bt(o.status,a.error??o.statusText);return a}var rt=r=>encodeURIComponent(r),st={info:()=>Gt("/api/info"),roots:()=>Gt("/api/files/roots"),list:(r,o=0)=>Gt(`/api/files/list?path=${rt(r)}&cursor=${o}`),stat:r=>Gt(`/api/files/stat?path=${rt(r)}`),render:r=>Gt(`/api/files/render?path=${rt(r)}`)},Jo="",yd=r=>Jo=r,Vt=()=>Jo!=="",Pt={list:()=>Gt("/api/reviews"),get:r=>Gt(`/api/reviews/${rt(r)}`),file:(r,o,a=!1,d)=>Gt(`/api/reviews/${rt(r)}/file?path=${rt(o.path)}${o.old?`&old=${rt(o.old)}`:""}${a?"&work=true":""}${d?`&from=${rt(d.from)}&to=${rt(d.to)}`:""}`),async write(r,o,a,d){let h=await fetch(`/api/reviews/${rt(r)}/${o}`,{method:"POST",headers:{"content-type":"application/json","x-yajna-token":Jo},body:JSON.stringify({version:a,...d})}),u=await h.json().catch(()=>({error:h.statusText}));if(!h.ok)throw new bt(h.status,u.error??h.statusText);return u}},ht=r=>`/api/files/raw?path=${rt(r)}`;async function xn(r,o){let a=o?{Range:`bytes=0-${o-1}`}:{},d=await fetch(ht(r),{headers:a});if(!d.ok&&d.status!==206){let h=await d.json().catch(()=>({error:d.statusText}));throw new bt(d.status,h.error??d.statusText)}return d.arrayBuffer()}function at(r){if(r===void 0)return"";let o=["B","KB","MB","GB","TB"],a=0,d=r;for(;d>=1024&&a<o.length-1;)d/=1024,a++;return a===0?`${r} B`:`${d.toFixed(d<10?1:0)} ${o[a]}`}function ei(r){if(r===void 0)return"";let o=new Date(r),a=d=>String(d).padStart(2,"0");return`${o.getFullYear()}-${a(o.getMonth()+1)}-${a(o.getDate())} ${a(o.getHours())}:${a(o.getMinutes())}`}var ti=r=>r.slice(r.lastIndexOf("/")+1),xd=r=>r.slice(0,Math.max(0,r.lastIndexOf("/")));function Ko(r,o){let a=r.split("/");for(let d of o.split("/"))if(!(d===""||d==="."))if(d===".."){if(a.length<=1)return null;a.pop()}else a.push(d);return a.join("/")}var Xo=[];function dt(r){Xo.push(r)}function Dd(r){return Xo.reduce((o,a)=>a.score(r)>o.score(r)?a:o)}function kd(r){return Xo.find(o=>o.name===r)}function wt(r,o){let a=document.createElement("div");a.className="yv-toolbar";for(let[d,h]of o){let u=document.createElement("button");u.textContent=d,u.addEventListener("click",h),a.append(u)}return r.append(a),a}function Dn(r,o){let a=document.createElement("div");a.className="yv-message",a.textContent=o,r.append(a)}var Op=20<<20,Rp=/\.(log|out|err|jsonl)$/i,Sd=262144,zt=r=>r().then(o=>_a.define(o));function Qo(r){let o=r.toLowerCase();if(o==="dockerfile")return zt(()=>import("./chunks/dockerfile-TDCXA4IX.js").then(d=>d.dockerFile));if(o==="makefile"||o==="justfile")return zt(()=>import("./chunks/shell-HLB6RCIG.js").then(d=>d.shell));switch(o.includes(".")?o.slice(o.lastIndexOf(".")+1):""){case"js":case"mjs":case"cjs":return import("./chunks/dist-YE4AEP22.js").then(d=>d.javascript());case"jsx":return import("./chunks/dist-YE4AEP22.js").then(d=>d.javascript({jsx:!0}));case"ts":case"mts":return import("./chunks/dist-YE4AEP22.js").then(d=>d.javascript({typescript:!0}));case"tsx":return import("./chunks/dist-YE4AEP22.js").then(d=>d.javascript({typescript:!0,jsx:!0}));case"py":case"pyi":return import("./chunks/dist-BV4HXKYH.js").then(d=>d.python());case"rs":return import("./chunks/dist-D4NV6QXD.js").then(d=>d.rust());case"md":case"markdown":return import("./chunks/dist-AKSF6TDI.js").then(d=>d.markdown());case"json":case"jsonl":case"ipynb":case"geojson":return import("./chunks/dist-KWLPF5KA.js").then(d=>d.json());case"html":case"htm":return import("./chunks/dist-L4JFAPNW.js").then(d=>d.html());case"css":return import("./chunks/dist-NDBJBCXG.js").then(d=>d.css());case"yaml":case"yml":return import("./chunks/dist-NQGHKK4K.js").then(d=>d.yaml());case"xml":case"svg":case"kml":return import("./chunks/dist-RS2XUQEW.js").then(d=>d.xml());case"sql":return import("./chunks/dist-2UKQMOYA.js").then(d=>d.sql());case"c":case"h":case"cc":case"cpp":case"cxx":case"hpp":case"cu":case"ino":return import("./chunks/dist-Y6BKZC7F.js").then(d=>d.cpp());case"java":case"kt":case"kts":return import("./chunks/dist-RMM3FGGV.js").then(d=>d.java());case"go":return import("./chunks/dist-K4WIMV6T.js").then(d=>d.go());case"sh":case"bash":case"zsh":case"envrc":return zt(()=>import("./chunks/shell-HLB6RCIG.js").then(d=>d.shell));case"toml":case"lock":return zt(()=>import("./chunks/toml-2FIUC2XM.js").then(d=>d.toml));case"r":return zt(()=>import("./chunks/r-QSW6TDDB.js").then(d=>d.r));case"jl":return zt(()=>import("./chunks/julia-AO5DTZHL.js").then(d=>d.julia));case"diff":case"patch":return zt(()=>import("./chunks/diff-4PD2G225.js").then(d=>d.diff));case"ini":case"cfg":case"conf":case"properties":return zt(()=>import("./chunks/properties-2P7YL4U6.js").then(d=>d.properties));default:return Promise.resolve(null)}}var Zo=window.matchMedia("(prefers-color-scheme: dark)"),kn=()=>Zo.matches?_d:mi(To,{fallback:!0}),$p={name:"text",score:r=>r.text?2:0,async mount(r,o){let a=o.stat.size??0,d=a>Op,h=await xn(o.path,d?Sd:void 0),u=new TextDecoder,g=u.decode(h,{stream:!0}),b=h.byteLength,w=a,D=ti(o.path);/\.(md|markdown)$/i.test(D)&&wt(r,[["Preview",()=>o.switchTo("markdown")]]),d&&Dn(r,`Showing the first ${at(Sd)} of ${at(a)}; larger files get a paged view later.`);let C=new Ot,P=await Qo(D).catch(()=>null),T="Ln 1, Col 1",R=new de({parent:r,state:ct.create({doc:g,extensions:[ct.readOnly.of(!0),Jt({domEventHandlers:{mousedown($,B,L){let F=$.state.doc.lineAt(B.from).number,E=L.shiftKey?$.state.doc.lineAt($.state.selection.main.anchor).number:F;return V($,Math.min(E,F),Math.max(E,F)),!0}}}),ha(),ra(),ma(),Zi(),sa(),wa(),ld(),C.of(kn()),mi(To,{fallback:!0}),P??[],na.of([...nd,...vd,...ga]),de.updateListener.of($=>{if(!$.selectionSet)return;let B=$.state.selection.main.head,L=$.state.doc.lineAt(B);T=`Ln ${L.number}, Col ${B-L.from+1}`,o.onStatus()}),de.theme({"&":{height:"100%"},".cm-scroller":{overflow:"auto"}})]})});function V($,B,L){let F=$.state.doc,E=F.line(Math.max(1,Math.min(B,F.lines))),xe=F.line(Math.max(1,Math.min(L,F.lines)));$.dispatch({selection:{anchor:E.from,head:xe.to},scrollIntoView:!0}),o.onLines(E.number,xe.number)}let j=()=>{let $=R.scrollDOM;return $.scrollTop+$.clientHeight>=$.scrollHeight-4},H=()=>R.dispatch({effects:de.scrollIntoView(R.state.doc.length,{y:"end"})}),G=Rp.test(D)&&!d;G&&requestAnimationFrame(H);let O=0;for(let $ of["wheel","pointerdown","keydown","touchstart"])R.scrollDOM.addEventListener($,()=>O=Date.now(),{passive:!0});R.scrollDOM.addEventListener("scroll",()=>{if(Date.now()-O>1e3)return;let $=j();$!==G&&(G=$,o.onStatus())});let _e=()=>R.dispatch({effects:C.reconfigure(kn())});return Zo.addEventListener("change",_e),{dispose(){Zo.removeEventListener("change",_e),R.destroy()},status:()=>`${T} \xB7 ${R.state.doc.lines} lines${d?` (first part of ${at(w)})`:""}${!d&&G?" \xB7 following":""}`,async follow($){let B=$.size??0;if(d)return w=B,!0;if(B<=b)return!1;let L=await fetch(ht(o.path),{headers:{Range:`bytes=${b}-${B-1}`}});if(L.status!==206)return!1;let F=new Uint8Array(await L.arrayBuffer()),E=G||j();return R.dispatch({changes:{from:R.state.doc.length,insert:u.decode(F,{stream:!0})}}),b+=F.byteLength,w=b,E&&(G=!0,H()),!0},reveal($,B=$){let L=R.state.doc,F=L.line(Math.max(1,Math.min($,L.lines))),E=L.line(Math.max(1,Math.min(B,L.lines)));R.dispatch({selection:{anchor:F.from,head:E.to},effects:de.scrollIntoView(F.from,{y:"center"})})}}}};dt($p);var Np=/^[\w@.-]+\.html(#.*)?$/,Cd=/^[a-z][a-z0-9+.-]*:/i;function Gd(r,o){let a=xd(o.path);for(let d of r.querySelectorAll("a[href]")){let h=d.getAttribute("href")??"";if(h.startsWith("#"))continue;if(Cd.test(h)){/^(https?|mailto):/i.test(h)?(d.setAttribute("target","_blank"),d.setAttribute("rel","noopener")):d.removeAttribute("href");continue}if(Np.test(h)&&!h.includes("/")){d.setAttribute("href",`/${h}`),d.setAttribute("target","_blank");continue}let u=Ko(a,decodeURIComponent(h.split("#")[0]));if(u===null){d.removeAttribute("href");continue}d.setAttribute("href",`#${u}`),d.addEventListener("click",g=>{g.preventDefault(),o.open(u)})}for(let d of r.querySelectorAll("img[src]")){let h=d.getAttribute("src")??"";if(Cd.test(h)||h.startsWith("/"))continue;let u=Ko(a,decodeURIComponent(h));u===null?d.replaceWith(d.getAttribute("alt")??h):d.setAttribute("src",ht(u))}}dt({name:"markdown",score:r=>r.text&&/\.(md|markdown)$/i.test(r.path)&&(r.size??0)<=4<<20?3:0,async mount(r,o){let a=await st.render(o.path),d=wt(r,[["Source",()=>o.switchTo("text")]]);if(a.id){let g=document.createElement("a");g.href=`/${a.id}.html`,g.target="_blank",g.textContent=`${a.id}${a.title?` \xB7 ${a.title}`:""} \u2192 page`,d.prepend(g)}let h=document.createElement("div");h.className="yv-scroll";let u=document.createElement("article");return u.className="yv-markdown",u.innerHTML=a.html,Gd(u,o),h.append(u),r.append(h),{status:()=>a.id?`page ${a.id}`:"markdown",async follow(){let g=await st.render(o.path),b=h.scrollTop;return u.innerHTML=g.html,Gd(u,o),h.scrollTop=b,!0}}}});var Vp=/^image\/(png|jpeg|gif|webp|avif|bmp|x-icon|svg\+xml)$/,Wp=40;dt({name:"image",score:r=>Vp.test(r.mime)?3:0,async mount(r,o){let a=document.createElement("div");a.className="yv-image";let d=document.createElement("img");d.alt=o.path,d.draggable=!1,d.src=`${ht(o.path)}&t=${o.stat.mtime??0}`,a.append(d);let h=wt(r,[]);r.append(a),await d.decode().catch(()=>{});let u=1,g=0,b=0,w=!0,D=()=>({w:a.clientWidth,h:a.clientHeight,nw:d.naturalWidth||1,nh:d.naturalHeight||1}),C=()=>{let{w:$,h:B,nw:L,nh:F}=D();return Math.min(1,$/L,B/F)};function P(){let{w:$,h:B,nw:L,nh:F}=D(),E=L*u,xe=F*u;g=E<=$?($-E)/2:Math.min(0,Math.max($-E,g)),b=xe<=B?(B-xe)/2:Math.min(0,Math.max(B-xe,b)),d.style.transform=`translate(${g}px, ${b}px) scale(${u})`,o.onStatus()}function T($,B,L){let F=Math.min(Wp,Math.max(C()/4,$));g=B-(B-g)*F/u,b=L-(L-b)*F/u,u=F,w=!1,P()}function R(){u=C(),w=!0,P()}let V=$=>{let B=a.getBoundingClientRect();return[$.clientX-B.left,$.clientY-B.top]};a.addEventListener("wheel",$=>{$.preventDefault();let B=$.deltaMode===1?16:$.deltaMode===2?a.clientHeight:1,L=Math.exp(-$.deltaY*B*($.ctrlKey?.01:.002)),[F,E]=V($);T(u*L,F,E)},{passive:!1});let j=new Map,H=null,G=()=>{let[$,B]=[...j.values()];return{d:Math.hypot($.x-B.x,$.y-B.y),mx:($.x+B.x)/2,my:($.y+B.y)/2}};a.addEventListener("pointerdown",$=>{a.setPointerCapture($.pointerId);let[B,L]=V($);j.set($.pointerId,{x:B,y:L}),j.size===2&&(H={d:G().d||1,s:u}),a.classList.add("yv-dragging")}),a.addEventListener("pointermove",$=>{let B=j.get($.pointerId);if(!B)return;let[L,F]=V($);if(j.set($.pointerId,{x:L,y:F}),H&&j.size===2){let{d:E,mx:xe,my:ut}=G();T(H.s*E/H.d,xe,ut)}else j.size===1&&(g+=L-B.x,b+=F-B.y,P())});let O=$=>{j.delete($.pointerId),j.size<2&&(H=null),j.size||a.classList.remove("yv-dragging")};a.addEventListener("pointerup",O),a.addEventListener("pointercancel",O),a.addEventListener("dblclick",$=>{let[B,L]=V($);w&&C()<1?T(1,B,L):R()});let _e=new ResizeObserver(()=>w?R():P());_e.observe(a);for(let[$,B]of[["Fit",R],["1:1",()=>T(1,a.clientWidth/2,a.clientHeight/2)]]){let L=document.createElement("button");L.textContent=$,L.addEventListener("click",B),h.append(L)}return R(),{dispose:()=>_e.disconnect(),async follow($){let[B,L]=[d.naturalWidth,d.naturalHeight];return d.src=`${ht(o.path)}&t=${$.mtime??Date.now()}`,await d.decode().catch(()=>{}),w||B!==d.naturalWidth||L!==d.naturalHeight?R():P(),!0},status:()=>`${d.naturalWidth}\xD7${d.naturalHeight} \xB7 ${Math.round(u*100)}%`}}});var Hp=65536;dt({name:"binary",score:()=>1,async mount(r,o){let a=wt(r,[["Open as text",()=>o.switchTo("text")],["Open as hex",()=>o.switchTo("hex")]]),d=document.createElement("a");d.href=ht(o.path),d.download=ti(o.path),d.textContent="Download",a.append(d);let h=document.createElement("table");h.className="yv-meta";let u=[["path",o.path],["size",`${at(o.stat.size)} (${o.stat.size??0} bytes)`],["modified",ei(o.stat.mtime)],["type",o.stat.mime]];o.stat.link&&u.push(["symlink to",o.stat.link]);for(let[g,b]of u){let w=h.insertRow();w.insertCell().textContent=g,w.insertCell().textContent=b}return r.append(h),{status:()=>o.stat.mime}}});dt({name:"hex",score:()=>0,async mount(r,o){let a=new Uint8Array(await xn(o.path,Hp)),d=[];for(let g=0;g<a.length;g+=16){let b=a.subarray(g,g+16),w=Array.from(b,C=>C.toString(16).padStart(2,"0")).join(" "),D=Array.from(b,C=>C>=32&&C<127?String.fromCharCode(C):".").join("");d.push(`${g.toString(16).padStart(8,"0")}  ${w.padEnd(47)}  ${D}`)}wt(r,[["Back",()=>o.switchTo("binary")]]);let h=document.createElement("pre");h.className="yv-hex",h.textContent=d.join(`
`),r.append(h);let u=a.length<(o.stat.size??0)?` (first ${at(a.length)})`:"";return{status:()=>`hex${u}`}}});var Se=class r{constructor(o,a,d,h){this.fromA=o,this.toA=a,this.fromB=d,this.toB=h}offset(o,a=o){return new r(this.fromA+o,this.toA+o,this.fromB+a,this.toB+a)}};function Ht(r,o,a,d,h,u){if(r==d)return[];let g=lr(r,o,a,d,h,u),b=cr(r,o+g,a,d,h+g,u);o+=g,a-=b,h+=g,u-=b;let w=a-o,D=u-h;if(!w||!D)return[new Se(o,a,h,u)];if(w>D){let P=r.slice(o,a).indexOf(d.slice(h,u));if(P>-1)return[new Se(o,o+P,h,h),new Se(o+P+D,a,u,u)]}else if(D>w){let P=d.slice(h,u).indexOf(r.slice(o,a));if(P>-1)return[new Se(o,o,h,h+P),new Se(a,a,h+P+w,u)]}if(w==1||D==1)return[new Se(o,a,h,u)];let C=jd(r,o,a,d,h,u);if(C){let[P,T,R]=C;return Ht(r,o,P,d,h,T).concat(Ht(r,P+R,a,d,T+R,u))}return Bp(r,o,a,d,h,u)}var xi=1e9,Di=0,dr=!1;function Bp(r,o,a,d,h,u){let g=a-o,b=u-h;if(xi<1e9&&Math.min(g,b)>xi*16||Di>0&&Date.now()>Di)return Math.min(g,b)>xi*64?[new Se(o,a,h,u)]:Pd(r,o,a,d,h,u);let w=Math.ceil((g+b)/2);er.reset(w),tr.reset(w);let D=(R,V)=>r.charCodeAt(o+R)==d.charCodeAt(h+V),C=(R,V)=>r.charCodeAt(a-R-1)==d.charCodeAt(u-V-1),P=(g-b)%2!=0?tr:null,T=P?null:er;for(let R=0;R<w;R++){if(R>xi||Di>0&&!(R&63)&&Date.now()>Di)return Pd(r,o,a,d,h,u);let V=er.advance(R,g,b,w,P,!1,D)||tr.advance(R,g,b,w,T,!0,C);if(V)return Fp(r,o,a,o+V[0],d,h,u,h+V[1])}return[new Se(o,a,h,u)]}var zn=class{constructor(){this.vec=[]}reset(o){this.len=o<<1;for(let a=0;a<this.len;a++)this.vec[a]=-1;this.vec[o+1]=0,this.start=this.end=0}advance(o,a,d,h,u,g,b){for(let w=-o+this.start;w<=o-this.end;w+=2){let D=h+w,C=w==-o||w!=o&&this.vec[D-1]<this.vec[D+1]?this.vec[D+1]:this.vec[D-1]+1,P=C-w;for(;C<a&&P<d&&b(C,P);)C++,P++;if(this.vec[D]=C,C>a)this.end+=2;else if(P>d)this.start+=2;else if(u){let T=h+(a-d)-w;if(T>=0&&T<this.len&&u.vec[T]!=-1)if(g){let R=u.vec[T];if(R>=a-C)return[R,h+R-T]}else{let R=a-u.vec[T];if(C>=R)return[C,P]}}}return null}},er=new zn,tr=new zn;function Fp(r,o,a,d,h,u,g,b){let w=!1;return!ni(r,d)&&++d==a&&(w=!0),!ni(h,b)&&++b==g&&(w=!0),w?[new Se(o,a,u,g)]:Ht(r,o,d,h,u,b).concat(Ht(r,d,a,h,b,g))}function qd(r,o){let a=1,d=Math.min(r,o);for(;a<d;)a=a<<1;return a}function lr(r,o,a,d,h,u){if(o==a||o==u||r.charCodeAt(o)!=d.charCodeAt(h))return 0;let g=qd(a-o,u-h);for(let b=o,w=h;;){let D=b+g,C=w+g;if(D>a||C>u||r.slice(b,D)!=d.slice(w,C)){if(g==1)return b-o-(ni(r,b)?0:1);g=g>>1}else{if(D==a||C==u)return D-o;b=D,w=C}}}function cr(r,o,a,d,h,u){if(o==a||h==u||r.charCodeAt(a-1)!=d.charCodeAt(u-1))return 0;let g=qd(a-o,u-h);for(let b=a,w=u;;){let D=b-g,C=w-g;if(D<o||C<h||r.slice(D,b)!=d.slice(C,w)){if(g==1)return a-b-(ni(r,b)?0:1);g=g>>1}else{if(D==o||C==h)return a-D;b=D,w=C}}}function ir(r,o,a,d,h,u,g,b){let w=d.slice(h,u),D=null;for(;;){if(D||g<b)return D;for(let C=o+g;;){ni(r,C)||C++;let P=C+g;if(ni(r,P)||(P+=P==C+1?1:-1),P>=a)break;let T=r.slice(C,P),R=-1;for(;(R=w.indexOf(T,R+1))!=-1;){let V=lr(r,P,a,d,h+R+T.length,u),j=cr(r,o,C,d,h,h+R),H=T.length+V+j;(!D||D[2]<H)&&(D=[C-j,h+R-j,H])}C=P}if(b<0)return D;g=g>>1}}function jd(r,o,a,d,h,u){let g=a-o,b=u-h;if(g<b){let w=jd(d,h,u,r,o,a);return w&&[w[1],w[0],w[2]]}return g<4||b*2<g?null:ir(r,o,a,d,h,u,Math.floor(g/4),-1)}function Pd(r,o,a,d,h,u){dr=!0;let g=a-o,b=u-h,w;if(g<b){let T=ir(d,h,u,r,o,a,Math.floor(g/6),50);w=T&&[T[1],T[0],T[2]]}else w=ir(r,o,a,d,h,u,Math.floor(b/6),50);if(!w)return[new Se(o,a,h,u)];let[D,C,P]=w;return Ht(r,o,D,d,h,C).concat(Ht(r,D+P,a,d,C+P,u))}function Jd(r,o){for(let a=1;a<r.length;a++){let d=r[a-1],h=r[a];d.toA>h.fromA-o&&d.toB>h.fromB-o&&(r[a-1]=new Se(d.fromA,h.toA,d.fromB,h.toB),r.splice(a--,1))}}function Up(r,o,a){for(;;){Jd(a,1);let d=!1;for(let h=0;h<a.length;h++){let u=a[h],g,b;(g=lr(r,u.fromA,u.toA,o,u.fromB,u.toB))&&(u=a[h]=new Se(u.fromA+g,u.toA,u.fromB+g,u.toB)),(b=cr(r,u.fromA,u.toA,o,u.fromB,u.toB))&&(u=a[h]=new Se(u.fromA,u.toA-b,u.fromB,u.toB-b));let w=u.toA-u.fromA,D=u.toB-u.fromB;if(w&&D)continue;let C=u.fromA-(h?a[h-1].toA:0),P=(h<a.length-1?a[h+1].fromA:r.length)-u.toA;if(!C||!P)continue;let T=w?r.slice(u.fromA,u.toA):o.slice(u.fromB,u.toB);C<=T.length&&r.slice(u.fromA-C,u.fromA)==T.slice(T.length-C)?(a[h]=new Se(u.fromA-C,u.toA-C,u.fromB-C,u.toB-C),d=!0):P<=T.length&&r.slice(u.toA,u.toA+P)==T.slice(0,P)&&(a[h]=new Se(u.fromA+P,u.toA+P,u.fromB+P,u.toB+P),d=!0)}if(!d)break}return a}function Yp(r,o,a){for(let d=0,h=0;h<r.length;h++){let u=r[h],g=u.toA-u.fromA,b=u.toB-u.fromB;if(g&&b||g>3||b>3){let w=h==r.length-1?o.length:r[h+1].fromA,D=u.fromA-d,C=w-u.toA,P=Td(o,u.fromA,D),T=zd(o,u.toA,C),R=u.fromA-P,V=T-u.toA;if((!g||!b)&&R&&V){let j=Math.max(g,b),[H,G,O]=g?[o,u.fromA,u.toA]:[a,u.fromB,u.toB];j>R&&o.slice(P,u.fromA)==H.slice(O-R,O)?(u=r[h]=new Se(P,P+g,u.fromB-R,u.toB-R),P=u.fromA,T=zd(o,u.toA,w-u.toA)):j>V&&o.slice(u.toA,T)==H.slice(G,G+V)&&(u=r[h]=new Se(T-g,T,u.fromB+V,u.toB+V),T=u.toA,P=Td(o,u.fromA,u.fromA-d)),R=u.fromA-P,V=T-u.toA}if(R||V)u=r[h]=new Se(u.fromA-R,u.toA+V,u.fromB-R,u.toB+V);else if(g){if(!b){let j=Ed(o,u.fromA,u.toA),H,G=j<0?-1:Ad(o,u.toA,u.fromA);j>-1&&(H=j-u.fromA)<=C&&o.slice(u.fromA,j)==o.slice(u.toA,u.toA+H)?u=r[h]=u.offset(H):G>-1&&(H=u.toA-G)<=D&&o.slice(u.fromA-H,u.fromA)==o.slice(G,u.toA)&&(u=r[h]=u.offset(-H))}}else{let j=Ed(a,u.fromB,u.toB),H,G=j<0?-1:Ad(a,u.toB,u.fromB);j>-1&&(H=j-u.fromB)<=C&&a.slice(u.fromB,j)==a.slice(u.toB,u.toB+H)?u=r[h]=u.offset(H):G>-1&&(H=u.toB-G)<=D&&a.slice(u.fromB-H,u.fromB)==a.slice(G,u.toB)&&(u=r[h]=u.offset(-H))}}d=u.toA}return Jd(r,3),r}var Wt;try{Wt=new RegExp("[\\p{Alphabetic}\\p{Number}]","u")}catch{}function Kd(r){return r>48&&r<58||r>64&&r<91||r>96&&r<123}function Xd(r,o){if(o==r.length)return 0;let a=r.charCodeAt(o);return a<192?Kd(a)?1:0:Wt?!el(a)||o==r.length-1?Wt.test(String.fromCharCode(a))?1:0:Wt.test(r.slice(o,o+2))?2:0:0}function Zd(r,o){if(!o)return 0;let a=r.charCodeAt(o-1);return a<192?Kd(a)?1:0:Wt?!tl(a)||o==1?Wt.test(String.fromCharCode(a))?1:0:Wt.test(r.slice(o-2,o))?2:0:0}var Qd=8;function zd(r,o,a){if(o==r.length||!Zd(r,o))return o;for(let d=o,h=o+a,u=0;u<Qd;u++){let g=Xd(r,d);if(!g||d+g>h)return d;d+=g}return o}function Td(r,o,a){if(!o||!Xd(r,o))return o;for(let d=o,h=o-a,u=0;u<Qd;u++){let g=Zd(r,d);if(!g||d-g<h)return d;d-=g}return o}function Ad(r,o,a){for(;o!=a;o--)if(r.charCodeAt(o-1)==10)return o;return-1}function Ed(r,o,a){for(;o!=a;o++)if(r.charCodeAt(o)==10)return o;return-1}var el=r=>r>=55296&&r<=56319,tl=r=>r>=56320&&r<=57343;function ni(r,o){return!o||o==r.length||!el(r.charCodeAt(o-1))||!tl(r.charCodeAt(o))}function qp(r,o,a){var d;let h=a?.override;return h?h(r,o):(xi=((d=a?.scanLimit)!==null&&d!==void 0?d:1e9)>>1,Di=a?.timeout?Date.now()+a.timeout:0,dr=!1,Up(r,o,Ht(r,0,r.length,o,0,o.length)))}function il(){return!dr}function nl(r,o,a){return Yp(qp(r,o,a),r,o)}var Oe=Dt.define({combine:r=>r[0]}),nr=Ae.define(),ol=Dt.define(),Me=je.define({create(r){return null},update(r,o){for(let a of o.effects)a.is(nr)&&(r=a.value);for(let a of o.state.facet(ol))r=a(r,o);return r}});var _t=class r{constructor(o,a,d,h,u,g=!0){this.changes=o,this.fromA=a,this.toA=d,this.fromB=h,this.toB=u,this.precise=g}offset(o,a){return o||a?new r(this.changes,this.fromA+o,this.toA+o,this.fromB+a,this.toB+a,this.precise):this}get endA(){return Math.max(this.fromA,this.toA-1)}get endB(){return Math.max(this.fromB,this.toB-1)}static build(o,a,d){let h=nl(o.toString(),a.toString(),d);return rl(h,o,a,0,0,il())}static updateA(o,a,d,h,u){return Rd(Od(o,h,!0,d.length),o,a,d,u)}static updateB(o,a,d,h,u){return Rd(Od(o,h,!1,a.length),o,a,d,u)}};function Id(r,o,a,d){let h=a.lineAt(r),u=d.lineAt(o);return h.to==r&&u.to==o&&r<a.length&&o<d.length?[r+1,o+1]:[h.from,u.from]}function Md(r,o,a,d){let h=a.lineAt(r),u=d.lineAt(o);return h.from==r&&u.from==o?[r,o]:[h.to+1,u.to+1]}function rl(r,o,a,d,h,u){let g=[];for(let b=0;b<r.length;b++){let w=r[b],[D,C]=Id(w.fromA+d,w.fromB+h,o,a),[P,T]=Md(w.toA+d,w.toB+h,o,a),R=[w.offset(-D+d,-C+h)];for(;b<r.length-1;){let V=r[b+1],[j,H]=Id(V.fromA+d,V.fromB+h,o,a);if(j>P+1&&H>T+1)break;R.push(V.offset(-D+d,-C+h)),[P,T]=Md(V.toA+d,V.toB+h,o,a),b++}g.push(new _t(R,D,Math.max(D,P),C,Math.max(C,T),u))}return g}var Sn=1e3;function Ld(r,o,a,d){let h=0,u=r.length;for(;;){if(h==u){let C=0,P=0;h&&({toA:C,toB:P}=r[h-1]);let T=o-(a?C:P);return[C+T,P+T]}let g=h+u>>1,b=r[g],[w,D]=a?[b.fromA,b.toA]:[b.fromB,b.toB];if(w>o)u=g;else if(D<=o)h=g+1;else return d?[b.fromA,b.fromB]:[b.toA,b.toB]}}function Od(r,o,a,d){let h=[];return o.iterChangedRanges((u,g,b,w)=>{let D=0,C=a?o.length:d,P=0,T=a?d:o.length;u>Sn&&([D,P]=Ld(r,u-Sn,a,!0)),g<o.length-Sn&&([C,T]=Ld(r,g+Sn,a,!1));let R=w-b-(g-u),V,[j,H]=a?[R,0]:[0,R];h.length&&(V=h[h.length-1]).toA>=D?h[h.length-1]={fromA:V.fromA,fromB:V.fromB,toA:C,toB:T,diffA:V.diffA+j,diffB:V.diffB+H}:h.push({fromA:D,toA:C,fromB:P,toB:T,diffA:j,diffB:H})}),h}function Rd(r,o,a,d,h){if(!r.length)return o;let u=[];for(let g=0,b=0,w=0,D=0;;g++){let C=g==r.length?null:r[g],P=C?C.fromA+b:a.length,T=C?C.fromB+w:d.length;for(;D<o.length;){let H=o[D];if(C&&(H.toA+b>P||H.toB+w>T))break;u.push(H.offset(b,w)),D++}if(!C)break;let R=C.toA+b+C.diffA,V=C.toB+w+C.diffB,j=nl(a.sliceString(P,R),d.sliceString(T,V),h);for(let H of rl(j,a,d,P,T,il()))u.push(H);for(b+=C.diffA,w+=C.diffB;D<o.length;){let H=o[D];if(H.fromA+b>R&&H.fromB+w>V)break;D++}}return u}var sl={scanLimit:500},In=vi.fromClass(class{constructor(r){({deco:this.deco,gutter:this.gutter}=Vd(r))}update(r){(r.docChanged||r.viewportChanged||jp(r.startState,r.state)||Jp(r.startState,r.state))&&({deco:this.deco,gutter:this.gutter}=Vd(r.view))}},{decorations:r=>r.deco}),Cn=Lt.low(Go({class:"cm-changeGutter",markers:r=>{var o;return((o=r.plugin(In))===null||o===void 0?void 0:o.gutter)||So.empty}}));function jp(r,o){return r.field(Me,!1)!=o.field(Me,!1)}function Jp(r,o){return r.facet(Oe)!=o.facet(Oe)}var $d=me.line({class:"cm-changedLine"}),al=me.mark({class:"cm-changedText"}),Kp=me.mark({tagName:"ins",class:"cm-insertedLine"}),Xp=me.mark({tagName:"del",class:"cm-deletedLine"}),Nd=new class extends Qi{constructor(){super(...arguments),this.elementClass="cm-changedLineGutter"}};function Zp(r,o,a,d,h,u){let g=a?r.fromA:r.fromB,b=a?r.toA:r.toB,w=0;if(g!=b){h.add(g,g,$d),h.add(g,b,a?Xp:Kp),u&&u.add(g,g,Nd);for(let D=o.iterRange(g,b-1),C=g;!D.next().done;){if(D.lineBreak){C++,h.add(C,C,$d),u&&u.add(C,C,Nd);continue}let P=C+D.value.length;if(d)for(;w<r.changes.length;){let T=r.changes[w],R=g+(a?T.fromA:T.fromB),V=g+(a?T.toA:T.toB),j=Math.max(C,R),H=Math.min(P,V);if(j<H&&h.add(j,H,al),V<P)w++;else break}C=P}}}function Vd(r){let o=r.state.field(Me),{side:a,highlightChanges:d,markGutter:h,overrideChunk:u}=r.state.facet(Oe),g=a=="a",b=new ft,w=h?new ft:null,{from:D,to:C}=r.viewport;for(let P of o){if((g?P.fromA:P.fromB)>=C)break;(g?P.toA:P.toB)>D&&(!u||!u(r.state,P,b,w))&&Zp(P,r.state.doc,g,d,b,w)}return{deco:b.finish(),gutter:w&&w.finish()}}var ii=class extends Rt{constructor(o){super(),this.height=o}eq(o){return this.height==o.height}toDOM(){let o=document.createElement("div");return o.className="cm-mergeSpacer",o.style.height=this.height+"px",o}updateDOM(o){return o.style.height=this.height+"px",!0}get estimatedHeight(){return this.height}ignoreEvent(){return!1}},Tn=Ae.define({map:(r,o)=>r.map(o)}),ki=je.define({create:()=>me.none,update:(r,o)=>{for(let a of o.effects)if(a.is(Tn))return a.value;return r.map(o.changes)},provide:r=>de.decorations.from(r)}),Gn=.01;function Wd(r,o){if(r.size!=o.size)return!1;let a=r.iter(),d=o.iter();for(;a.value;){if(a.from!=d.from||Math.abs(a.value.spec.widget.height-d.value.spec.widget.height)>1)return!1;a.next(),d.next()}return!0}function Qp(r,o,a){let d=new ft,h=new ft,u=r.state.field(ki).iter(),g=o.state.field(ki).iter(),b=0,w=0,D=0,C=0,P=r.viewport,T=o.viewport;for(let H=0;;H++){let G=H<a.length?a[H]:null,O=G?G.fromA:r.state.doc.length,_e=G?G.fromB:o.state.doc.length;if(b<O){let $=r.lineBlockAt(b).top+D,B=o.lineBlockAt(w).top+C,L=$-B;L<-Gn?(D-=L,d.add(b,b,me.widget({widget:new ii(-L),block:!0,side:-1}))):L>Gn&&(C+=L,h.add(w,w,me.widget({widget:new ii(L),block:!0,side:-1})))}if(O>b+1e3&&b<P.from&&O>P.from&&w<T.from&&_e>T.from){let $=Math.min(P.from-b,T.from-w);b+=$,w+=$,H--}else if(G)b=G.toA,w=G.toB;else break;for(;u.value&&u.from<b;)D-=u.value.spec.widget.height,u.next();for(;g.value&&g.from<w;)C-=g.value.spec.widget.height,g.next()}for(;u.value;)D-=u.value.spec.widget.height,u.next();for(;g.value;)C-=g.value.spec.widget.height,g.next();let R=r.contentHeight+D-(o.contentHeight+C);R<Gn?d.add(r.state.doc.length,r.state.doc.length,me.widget({widget:new ii(-R),block:!0,side:1})):R>Gn&&h.add(o.state.doc.length,o.state.doc.length,me.widget({widget:new ii(R),block:!0,side:1}));let V=d.finish(),j=h.finish();Wd(V,r.state.field(ki))||r.dispatch({effects:Tn.of(V)}),Wd(j,o.state.field(ki))||o.dispatch({effects:Tn.of(j)})}var or=Ae.define({map:(r,o)=>o.mapPos(r)});var rr=class extends Rt{constructor(o){super(),this.lines=o}eq(o){return this.lines==o.lines}toDOM(o){let a=document.createElement("div");return a.className="cm-collapsedLines",a.textContent=o.state.phrase("$ unchanged lines",this.lines),a.addEventListener("click",d=>{let h=o.posAtDOM(d.target);o.dispatch({effects:or.of(h)});let{side:u,sibling:g}=o.state.facet(Oe);g&&g().dispatch({effects:or.of(ev(h,o.state.field(Me),u=="a"))})}),a}ignoreEvent(o){return o instanceof MouseEvent}get estimatedHeight(){return 27}get type(){return"collapsed-unchanged-code"}};function ev(r,o,a){let d=0,h=0;for(let u=0;;u++){let g=u<o.length?o[u]:null;if(!g||(a?g.fromA:g.fromB)>=r)return h+(r-d);[d,h]=a?[g.toA,g.toB]:[g.toB,g.toA]}}var tv=je.define({create(r){return me.none},update(r,o){r=r.map(o.changes);for(let a of o.effects)a.is(or)&&(r=r.update({filter:d=>d!=a.value}));if(r.size&&o.state.field(Me)!=o.startState.field(Me,!1)){let a=o.state.facet(Oe).side=="a",d=[];for(let h of o.state.field(Me))r.between(a?h.fromA:h.fromB,a?h.toA:h.toB,u=>{d.push(u)});d.length&&(r=r.update({filter:h=>d.indexOf(h)<0}))}return r},provide:r=>de.decorations.from(r)});function sr({margin:r=3,minSize:o=4}){return tv.init(a=>iv(a,r,o))}function iv(r,o,a){let d=new ft,h=r.facet(Oe).side=="a",u=r.field(Me),g=1;for(let b=0;;b++){let w=b<u.length?u[b]:null,D=b?g+o:1,C=w?r.doc.lineAt(h?w.fromA:w.fromB).number-1-o:r.doc.lines,P=C-D+1;if(P>=a&&d.add(r.doc.line(D).from,r.doc.line(C).to,me.replace({widget:new rr(P),block:!0})),!w)break;g=r.doc.lineAt(Math.min(r.doc.length,h?w.toA:w.toB)).number}return d.finish()}var nv=de.styleModule.of(new ta({".cm-mergeView":{overflowY:"auto"},".cm-mergeViewEditors":{display:"flex",alignItems:"stretch"},".cm-mergeViewEditor":{flexGrow:1,flexBasis:0,overflow:"hidden"},".cm-merge-revert":{width:"1.6em",flexGrow:0,flexShrink:0,position:"relative"},".cm-merge-revert button":{position:"absolute",display:"block",width:"100%",boxSizing:"border-box",textAlign:"center",background:"none",border:"none",font:"inherit",cursor:"pointer"}})),dl=de.baseTheme({".cm-mergeView & .cm-scroller, .cm-mergeView &":{height:"auto !important",overflowY:"visible !important"},"&.cm-merge-a .cm-changedLine, .cm-deletedChunk":{backgroundColor:"rgba(160, 128, 100, .08)"},"&.cm-merge-b .cm-changedLine, .cm-inlineChangedLine":{backgroundColor:"rgba(100, 160, 128, .08)"},"&light.cm-merge-a .cm-changedText, &light .cm-deletedChunk .cm-deletedText":{background:"linear-gradient(#ee443366, #ee443366) bottom/100% 2px no-repeat"},"&dark.cm-merge-a .cm-changedText, &dark .cm-deletedChunk .cm-deletedText":{background:"linear-gradient(#ffaa9966, #ffaa9966) bottom/100% 2px no-repeat"},"&light.cm-merge-b .cm-changedText":{background:"linear-gradient(#22bb22aa, #22bb22aa) bottom/100% 2px no-repeat"},"&dark.cm-merge-b .cm-changedText":{background:"linear-gradient(#88ff88aa, #88ff88aa) bottom/100% 2px no-repeat"},"&.cm-merge-b .cm-deletedText":{background:"#ff000033"},".cm-insertedLine, .cm-deletedLine, .cm-deletedLine del":{textDecoration:"none"},".cm-deletedChunk":{paddingLeft:"6px","& .cm-chunkButtons":{position:"absolute",insetInlineEnd:"5px"},"& button":{border:"none",cursor:"pointer",color:"white",margin:"0 2px",borderRadius:"3px","&[name=accept]":{background:"#2a2"},"&[name=reject]":{background:"#d43"}}},".cm-collapsedLines":{padding:"5px 5px 5px 10px",cursor:"pointer","&:before":{content:'"\u299A"',marginInlineEnd:"7px"},"&:after":{content:'"\u299A"',marginInlineStart:"7px"}},"&light .cm-collapsedLines":{color:"#444",background:"linear-gradient(to bottom, transparent 0, #f3f3f3 30%, #f3f3f3 70%, transparent 100%)"},"&dark .cm-collapsedLines":{color:"#ddd",background:"linear-gradient(to bottom, transparent 0, #222 30%, #222 70%, transparent 100%)"},".cm-changeGutter":{width:"3px",paddingLeft:"1px"},"&light.cm-merge-a .cm-changedLineGutter, &light .cm-deletedLineGutter":{background:"#e43"},"&dark.cm-merge-a .cm-changedLineGutter, &dark .cm-deletedLineGutter":{background:"#fa9"},"&light.cm-merge-b .cm-changedLineGutter":{background:"#2b2"},"&dark.cm-merge-b .cm-changedLineGutter":{background:"#8f8"},".cm-inlineChangedLineGutter":{background:"#75d"}}),Hd=new Ot,Pn=new Ot,An=class{constructor(o){this.revertDOM=null,this.revertToA=!1,this.revertToLeft=!1,this.measuring=-1,this.diffConf=o.diffConfig||sl;let a=[Lt.low(In),dl,nv,ki,de.updateListener.of(P=>{this.measuring<0&&(P.heightChanged||P.viewportChanged)&&!P.transactions.some(T=>T.effects.some(R=>R.is(Tn)))&&this.measure()})],d=[Oe.of({side:"a",sibling:()=>this.b,highlightChanges:o.highlightChanges!==!1,markGutter:o.gutter!==!1})];o.gutter!==!1&&d.push(Cn);let h=ct.create({doc:o.a.doc,selection:o.a.selection,extensions:[o.a.extensions||[],de.editorAttributes.of({class:"cm-merge-a"}),Pn.of(d),a]}),u=[Oe.of({side:"b",sibling:()=>this.a,highlightChanges:o.highlightChanges!==!1,markGutter:o.gutter!==!1})];o.gutter!==!1&&u.push(Cn);let g=ct.create({doc:o.b.doc,selection:o.b.selection,extensions:[o.b.extensions||[],de.editorAttributes.of({class:"cm-merge-b"}),Pn.of(u),a]});this.chunks=_t.build(h.doc,g.doc,this.diffConf);let b=[Me.init(()=>this.chunks),Hd.of(o.collapseUnchanged?sr(o.collapseUnchanged):[])];h=h.update({effects:Ae.appendConfig.of(b)}).state,g=g.update({effects:Ae.appendConfig.of(b)}).state,this.dom=document.createElement("div"),this.dom.className="cm-mergeView",this.editorDOM=this.dom.appendChild(document.createElement("div")),this.editorDOM.className="cm-mergeViewEditors";let w=o.orientation||"a-b",D=document.createElement("div");D.className="cm-mergeViewEditor";let C=document.createElement("div");C.className="cm-mergeViewEditor",this.editorDOM.appendChild(w=="a-b"?D:C),this.editorDOM.appendChild(w=="a-b"?C:D),this.a=new de({state:h,parent:D,root:o.root,dispatchTransactions:P=>this.dispatch(P,this.a)}),this.b=new de({state:g,parent:C,root:o.root,dispatchTransactions:P=>this.dispatch(P,this.b)}),this.setupRevertControls(!!o.revertControls,o.revertControls=="b-to-a",o.renderRevertControl),o.parent&&o.parent.appendChild(this.dom),this.scheduleMeasure()}dispatch(o,a){if(o.some(d=>d.docChanged)){let d=o[o.length-1],h=o.reduce((g,b)=>g.compose(b.changes),pi.empty(o[0].startState.doc.length));this.chunks=a==this.a?_t.updateA(this.chunks,d.newDoc,this.b.state.doc,h,this.diffConf):_t.updateB(this.chunks,this.a.state.doc,d.newDoc,h,this.diffConf),a.update([...o,d.state.update({effects:nr.of(this.chunks)})]);let u=a==this.a?this.b:this.a;u.update([u.state.update({effects:nr.of(this.chunks)})]),this.scheduleMeasure()}else a.update(o)}reconfigure(o){if("diffConfig"in o&&(this.diffConf=o.diffConfig),"orientation"in o){let u=o.orientation!="b-a";if(u!=(this.editorDOM.firstChild==this.a.dom.parentNode)){let g=this.a.dom.parentNode,b=this.b.dom.parentNode;g.remove(),b.remove(),this.editorDOM.insertBefore(u?g:b,this.editorDOM.firstChild),this.editorDOM.appendChild(u?b:g),this.revertToLeft=!this.revertToLeft,this.revertDOM&&(this.revertDOM.textContent="")}}if("revertControls"in o||"renderRevertControl"in o){let u=!!this.revertDOM,g=this.revertToA,b=this.renderRevert;"revertControls"in o&&(u=!!o.revertControls,g=o.revertControls=="b-to-a"),"renderRevertControl"in o&&(b=o.renderRevertControl),this.setupRevertControls(u,g,b)}let a="highlightChanges"in o,d="gutter"in o,h="collapseUnchanged"in o;if(a||d||h){let u=[],g=[];if(a||d){let b=this.a.state.facet(Oe),w=d?o.gutter!==!1:b.markGutter,D=a?o.highlightChanges!==!1:b.highlightChanges;u.push(Pn.reconfigure([Oe.of({side:"a",sibling:()=>this.b,highlightChanges:D,markGutter:w}),w?Cn:[]])),g.push(Pn.reconfigure([Oe.of({side:"b",sibling:()=>this.a,highlightChanges:D,markGutter:w}),w?Cn:[]]))}if(h){let b=Hd.reconfigure(o.collapseUnchanged?sr(o.collapseUnchanged):[]);u.push(b),g.push(b)}this.a.dispatch({effects:u}),this.b.dispatch({effects:g})}this.scheduleMeasure()}setupRevertControls(o,a,d){this.revertToA=a,this.revertToLeft=this.revertToA==(this.editorDOM.firstChild==this.a.dom.parentNode),this.renderRevert=d,!o&&this.revertDOM?(this.revertDOM.remove(),this.revertDOM=null):o&&!this.revertDOM?(this.revertDOM=this.editorDOM.insertBefore(document.createElement("div"),this.editorDOM.firstChild.nextSibling),this.revertDOM.addEventListener("mousedown",h=>this.revertClicked(h)),this.revertDOM.className="cm-merge-revert"):this.revertDOM&&(this.revertDOM.textContent="")}scheduleMeasure(){if(this.measuring<0){let o=this.dom.ownerDocument.defaultView||window;this.measuring=o.requestAnimationFrame(()=>{this.measuring=-1,this.measure()})}}measure(){Qp(this.a,this.b,this.chunks),this.revertDOM&&this.updateRevertButtons()}updateRevertButtons(){let o=this.revertDOM,a=o.firstChild,d=this.a.viewport,h=this.b.viewport;for(let u=0;u<this.chunks.length;u++){let g=this.chunks[u];if(g.fromA>d.to||g.fromB>h.to)break;if(g.fromA<d.from||g.fromB<h.from)continue;let b=this.a.lineBlockAt(g.fromA).top+"px";for(;a&&+a.dataset.chunk<u;)a=Bd(a);a&&a.dataset.chunk==String(u)?(a.style.top!=b&&(a.style.top=b),a=a.nextSibling):o.insertBefore(this.renderRevertButton(b,u),a)}for(;a;)a=Bd(a)}renderRevertButton(o,a){let d;if(this.renderRevert)d=this.renderRevert();else{d=document.createElement("button");let h=this.a.state.phrase("Revert this chunk");d.setAttribute("aria-label",h),d.setAttribute("title",h),d.textContent=this.revertToLeft?"\u21DC":"\u21DD"}return d.style.top=o,d.setAttribute("data-chunk",String(a)),d}revertClicked(o){let a=o.target,d;for(;a&&a.parentNode!=this.revertDOM;)a=a.parentNode;if(a&&(d=this.chunks[a.dataset.chunk])){let[h,u,g,b,w,D]=this.revertToA?[this.b,this.a,d.fromB,d.toB,d.fromA,d.toA]:[this.a,this.b,d.fromA,d.toA,d.fromB,d.toB],C=h.state.sliceDoc(g,Math.max(g,b-1));g!=b&&D<=u.state.doc.length&&(C+=h.state.lineBreak),u.dispatch({changes:{from:w,to:Math.min(u.state.doc.length,D),insert:C},userEvent:"revert"}),o.preventDefault()}}destroy(){this.a.destroy(),this.b.destroy(),this.measuring>-1&&(this.dom.ownerDocument.defaultView||window).cancelAnimationFrame(this.measuring),this.dom.remove()}};function Bd(r){let o=r.nextSibling;return r.remove(),o}var ov=new class extends Qi{constructor(){super(...arguments),this.elementClass="cm-deletedLineGutter"}},rv=Lt.low(Go({class:"cm-changeGutter",markers:r=>{var o;return((o=r.plugin(In))===null||o===void 0?void 0:o.gutter)||So.empty},widgetMarker:(r,o)=>o instanceof En?ov:null}));function ll(r){var o;let a=typeof r.original=="string"?jt.of(r.original.split(/\r?\n/)):r.original,d=r.diffConfig||sl;return[Lt.low(In),lv,dl,de.editorAttributes.of({class:"cm-merge-b"}),ol.of((h,u)=>{let g=u.effects.find(b=>b.is(hr));return g&&(h=_t.updateA(h,g.value.doc,u.startState.doc,g.value.changes,d)),u.docChanged&&(h=_t.updateB(h,u.state.field(oi),u.newDoc,u.changes,d)),h}),Oe.of({highlightChanges:r.highlightChanges!==!1,markGutter:r.gutter!==!1,syntaxHighlightDeletions:r.syntaxHighlightDeletions!==!1,syntaxHighlightDeletionsMaxLength:3e3,mergeControls:(o=r.mergeControls)!==null&&o!==void 0?o:!0,overrideChunk:r.allowInlineDiffs?uv:void 0,side:"b"}),oi.init(()=>a),r.gutter!==!1?rv:[],r.collapseUnchanged?sr(r.collapseUnchanged):[],Me.init(h=>_t.build(a,h.doc,d))]}var hr=Ae.define();var oi=je.define({create:()=>jt.empty,update(r,o){for(let a of o.effects)a.is(hr)&&(r=a.value.doc);return r}});var Fd=new WeakMap,En=class extends Rt{constructor(o){super(),this.buildDOM=o,this.dom=null}eq(o){return this.dom==o.dom}toDOM(o){return this.dom||(this.dom=this.buildDOM(o))}};function sv(r,o,a){let d=Fd.get(o.changes);if(d)return d;let h=g=>{let{highlightChanges:b,syntaxHighlightDeletions:w,syntaxHighlightDeletionsMaxLength:D,mergeControls:C}=r.facet(Oe),P=document.createElement("div");if(P.className="cm-deletedChunk",C){let $=P.appendChild(document.createElement("div"));$.className="cm-chunkButtons";let B=F=>{F.preventDefault(),av(g,g.posAtDOM(P))},L=F=>{F.preventDefault(),dv(g,g.posAtDOM(P))};if(typeof C=="function")$.appendChild(C("accept",B)),$.appendChild(C("reject",L));else{let F=$.appendChild(document.createElement("button"));F.name="accept",F.textContent=r.phrase("Accept"),F.onmousedown=B;let E=$.appendChild(document.createElement("button"));E.name="reject",E.textContent=r.phrase("Reject"),E.onmousedown=L}}if(a||o.fromA>=o.toA)return P;let T=g.state.field(oi).sliceString(o.fromA,o.endA),R=w&&r.facet(pa),V=O(),j=o.changes,H=0,G=!1;function O(){let $=P.appendChild(document.createElement("div"));return $.className="cm-deletedLine",$.appendChild(document.createElement("del"))}function _e($,B,L){for(let F=$;F<B;){if(T.charAt(F)==`
`){V.firstChild||V.appendChild(document.createElement("br")),V=O(),F++;continue}let E=B,xe=L+(G?" cm-deletedText":""),ut=!1,pt=T.indexOf(`
`,F);if(pt>-1&&pt<B&&(E=pt),b&&H<j.length){let Xe=Math.max(0,G?j[H].toA:j[H].fromA);Xe<=E&&(E=Xe,G&&H++,ut=!0)}if(E>F){let Xe=document.createTextNode(T.slice(F,E));if(xe){let Re=V.appendChild(document.createElement("span"));Re.className=xe,Re.appendChild(Xe)}else V.appendChild(Xe);F=E}ut&&(G=!G)}}if(R&&o.toA-o.fromA<=D){let $=R.parser.parse(T),B=0;ua($,{style:L=>ba(r,L)},(L,F,E)=>{L>B&&_e(B,L,""),_e(L,F,E),B=F}),_e(B,T.length,"")}else _e(0,T.length,"");return V.firstChild||V.appendChild(document.createElement("br")),P},u=me.widget({block:!0,side:-1,widget:new En(h)});return Fd.set(o.changes,u),u}function av(r,o){let{state:a}=r,d=o??a.selection.main.head,h=r.state.field(Me).find(w=>w.fromB<=d&&w.endB>=d);if(!h)return!1;let u=r.state.sliceDoc(h.fromB,Math.max(h.fromB,h.toB-1)),g=r.state.field(oi);h.fromB!=h.toB&&h.toA<=g.length&&(u+=r.state.lineBreak);let b=pi.of({from:h.fromA,to:Math.min(g.length,h.toA),insert:u},g.length);return r.dispatch({effects:hr.of({doc:b.apply(g),changes:b}),userEvent:"accept"}),!0}function dv(r,o){let{state:a}=r,d=o??a.selection.main.head,h=a.field(Me).find(b=>b.fromB<=d&&b.endB>=d);if(!h)return!1;let g=a.field(oi).sliceString(h.fromA,Math.max(h.fromA,h.toA-1));return h.fromA!=h.toA&&h.toB<=a.doc.length&&(g+=a.lineBreak),r.dispatch({changes:{from:h.fromB,to:Math.min(a.doc.length,h.toB),insert:g},userEvent:"revert"}),!0}function Ud(r){let o=new ft;for(let a of r.field(Me)){let d=r.facet(Oe).overrideChunk&&cl(r,a);o.add(a.fromB,a.fromB,sv(r,a,!!d))}return o.finish()}var lv=je.define({create:r=>Ud(r),update(r,o){return o.state.field(Me,!1)!=o.startState.field(Me,!1)?Ud(o.state):r},provide:r=>de.decorations.from(r)}),Yd=new WeakMap;function cl(r,o){let a=Yd.get(o);if(a!==void 0)return a;a=null;let d=r.field(oi),h=r.doc,u=d.lineAt(o.endA).number-d.lineAt(o.fromA).number+1,g=h.lineAt(o.endB).number-h.lineAt(o.fromB).number+1;e:if(u==g&&u<10){let b=[],w=0,D=o.fromA,C=o.fromB;for(let P of o.changes){if(P.fromA<P.toA){w+=P.toA-P.fromA;let T=d.sliceString(D+P.fromA,D+P.toA);if(/\n/.test(T))break e;b.push(me.widget({widget:new ar(T),side:-1}).range(C+P.fromB))}P.fromB<P.toB&&b.push(al.range(C+P.fromB,C+P.toB))}w<o.endA-o.fromA-u*2&&(a=b)}return Yd.set(o,a),a}var ar=class extends Rt{constructor(o){super(),this.text=o}eq(o){return this.text==o.text}toDOM(o){let a=document.createElement("del");return a.className="cm-deletedText",a.textContent=this.text,a}},cv=new class extends Qi{constructor(){super(...arguments),this.elementClass="cm-inlineChangedLineGutter"}},hv=me.line({class:"cm-inlineChangedLine"});function uv(r,o,a,d){let h=cl(r,o),u=0;if(!h)return!1;for(let g=r.doc.lineAt(o.fromB);;){for(d&&d.add(g.from,g.from,cv),a.add(g.from,g.from,hv);u<h.length&&h[u].to<=g.to;){let b=h[u++];a.add(b.from,b.to,b.value)}if(g.to>=o.endB)break;g=r.doc.lineAt(g.to+1)}return!0}var pv=2e3,pl="yajna-files:review";function vv(){let r={files:!0,wrap:!1,composer:!0,focus:!1,unified:!1,split:.5};try{return{...r,...JSON.parse(localStorage.getItem(pl)??"{}")}}catch{return r}}function On(r){try{localStorage.setItem(pl,JSON.stringify(r))}catch{}}function Mn(r){document.body.classList.toggle("yr-focus",r)}function q(r,o="",a){let d=document.createElement(r);return o&&(d.className=o),a!==void 0&&(d.textContent=a),d}function Ln(r,o="yr-label"){let a=q("span",`${o} yr-path`);a.title=r;let d=r.lastIndexOf("/")+1;return d&&a.append(q("span","yr-dir",r.slice(0,d))),a.append(q("span","yr-base",r.slice(d))),a}var vr=(r,o)=>r===o?`line ${r}`:`lines ${r}\u2013${o}`;function Si(r,o,a,d,h=[]){let u=q("div","yr-form"),g=q("textarea");g.rows=2,g.placeholder=d,g.value=r.drafts.get(o)??"",g.addEventListener("input",()=>r.drafts.set(o,g.value));let b=q("div","yr-buttons");for(let w of a){let D=q("button","",w.label);D.addEventListener("click",()=>{let C=g.value.trim();if(w.needsText&&!C)return g.focus();let P=w.on;if(w.commit){let R=window.prompt("The commit that addresses it (empty: the branch tip, or HEAD)","");if(R===null)return;P=R.trim()||void 0}let T=w.at?.();T!==null&&r.write(w.action,{thread:w.thread,text:C||void 0,commit:P,at:T},o)}),b.append(D)}return b.append(...h),g.addEventListener("keydown",w=>{w.key==="Enter"&&(w.ctrlKey||w.metaKey)&&(w.preventDefault(),b.firstElementChild?.click())}),u.append(g,b),u}function gv(r,o){let a=`T${r.n}`,d=!o.review().author.startsWith("agent:"),h=[{label:"Reply",action:"reply",thread:a,needsText:!0}];return r.state!=="resolved"&&h.push({label:"Addressed\u2026",action:"address",thread:a,needsText:!0,commit:!0}),d&&r.state!=="resolved"&&h.push({label:"Resolve",action:"resolve",thread:a}),(r.state==="resolved"||r.state==="addressed")&&h.push({label:"Reopen",action:"reopen",thread:a}),h}function ur(r,o,a){let d=q("div",`yr-thread yr-${r.state}`),h=q("div","yr-thread-head");h.append(q("b","",`T${r.n}`),q("span",`yr-state yr-${r.state}`,r.state));let u=q("span","yr-anchor",r.anchor.raw);u.title=r.anchor.raw;let g=r.anchor.path;g&&(u.classList.add("yr-link"),u.addEventListener("click",()=>o.openFile(g,r.anchor.from,r.anchor.commit))),h.append(u),d.append(h),a&&r.quote.length&&d.append(q("pre","yr-quote",r.quote.join(`
`)));let b=q("ul","yr-replies");for(let w of r.replies){let D=q("li");D.append(q("span","yr-when",w.when)," ",q("span",w.author.startsWith("agent:")?"yr-agent":"yr-who",w.author)," "),w.action&&D.append(q("span","yr-action",w.action==="addressed"?`addressed in ${w.commit}`:w.action)," "),w.text&&D.append(w.text),b.append(D)}return d.append(b),Vt()&&d.append(Si(o,`T${r.n}`,gv(r,o),"Reply\u2026")),d}var Ci=Ae.define(),hl=je.define({create:()=>me.none,update(r,o){for(let a of o.effects)if(a.is(Ci))return a.value;return r.map(o.changes)},provide:r=>de.decorations.from(r)}),Rn=class extends Rt{constructor(a,d){super();this.sig=a;this.build=d}eq(a){return a.sig===this.sig}toDOM(){let a=q("div","yr-box");return a.append(this.build()),a}ignoreEvent(){return!0}},pr=(r,o)=>!!r.anchor.commit&&o.startsWith(r.anchor.commit)&&r.state!=="outdated";function mv(r,o){let a=o.state.doc;if(r.anchor.to)return Math.min(r.anchor.to,a.lines);if(r.anchor.heading)for(let d=1;d<=a.lines;d++){let h=a.line(d).text;if(h.startsWith("#")&&h.replace(/^#+/,"").trim()===r.anchor.heading)return d}return null}function vl(r){let o=r.selection.main,a=r.doc.lineAt(o.from).number,d=r.doc.lineAt(o.to).number;return d>a&&r.doc.line(d).from===o.to&&d--,{a,b:d}}function fv(r){let o=a=>{let d=a.selection.main;if(d.empty)return null;let{a:h,b:u}=vl(a);return{pos:d.from,above:!0,create:()=>{let g=q("button","yr-float",`Comment on ${vr(h,u)}`);return g.addEventListener("mousedown",b=>b.preventDefault()),g.addEventListener("click",()=>r(h,u)),{dom:g}}}};return je.define({create:o,update:(a,d)=>d.selection?o(d.state):a,provide:a=>aa.from(a)})}function bv(){let r=1;return Jt({domEventHandlers:{mousedown(o,a,d){let h=o.state.doc,u=h.lineAt(a.from).number;d.shiftKey||(r=u);let[g,b]=r<=u?[r,u]:[u,r];return o.dispatch({selection:ce.range(h.line(g).from,h.line(b).to)}),!0}}})}var wv=de.theme({"&.cm-merge-a .cm-changedText, .cm-deletedChunk .cm-deletedText":{background:"rgba(238, 68, 51, 0.3)"},"&.cm-merge-b .cm-changedText":{background:"rgba(34, 187, 34, 0.3)"}}),gl={margin:4,minSize:8};function _v(r,o,a,d,h){let u=new An({a:{doc:o.base??"",extensions:[...a,Jt()]},b:{doc:o.head??"",extensions:[...a,...d]},parent:r,collapseUnchanged:gl,gutter:!0}),g=u.a.dom.parentElement,b=q("div","yr-sash");b.title="Drag to resize the sides; double-click for half each",g.after(b);let w=D=>{g.style.flex=`0 0 ${(D*100).toFixed(2)}%`};return w(h.split),b.addEventListener("pointerdown",D=>{D.preventDefault(),b.setPointerCapture(D.pointerId);let C=g.parentElement.getBoundingClientRect(),P=R=>{h.split=Math.min(.85,Math.max(.15,(R.clientX-C.left)/C.width)),w(h.split)},T=()=>{b.removeEventListener("pointermove",P),On(h)};b.addEventListener("pointermove",P),b.addEventListener("pointerup",T,{once:!0})}),b.addEventListener("dblclick",()=>{h.split=.5,w(h.split),On(h)}),{b:u.b,editors:[u.a,u.b],destroy:()=>u.destroy()}}function yv(r,o,a){let d=new de({doc:o.head??"",extensions:[...a,ll({original:o.base??"",mergeControls:!1,gutter:!0,collapseUnchanged:gl})],parent:r});return{b:d,editors:[d],destroy:()=>d.destroy()}}var ri=(r,o)=>r?.path===o?.path&&r?.work===o?.work&&r?.between?.from===o?.between?.from&&r?.between?.to===o?.between?.to;function ul(r,o){return(o.work?r.unreviewed:o.between?r.since&&o.between.from===r.since.from&&o.between.to===r.head?r.since.files:r.fixes.find(d=>d.commit===o.between.to&&d.parent===o.between.from)?.files??[]:r.files).find(d=>d.path===o.path)}var xv=r=>`${r.work?"work:":""}${r.between?.to??""}:${r.path}`,gr={name:"review",score:()=>0,async mount(r,o){let a=o.path.replace(/^review:/,""),d=await Pt.get(a),h=vv();Mn(h.focus);let u=null,g,b=null,w=null,D,C=!1,P=!1,T=q("div","yr-top"),R=q("div","yr-notice"),V=q("div","yr-body"),j=q("ul","yr-files"),H=q("div","yr-main");V.append(j,H),r.append(T,R,V);let G=Y=>{R.textContent=Y,R.hidden=!Y};G("");let O=Y=>`inline:${Y}`,_e={review:()=>d,drafts:new Map,async write(Y,re,Q){if(!C){C=!0;try{d=await Pt.write(a,Y,d.version,re),_e.drafts.delete(Q),b&&Q===O(b.key)&&(b=null),G(""),Re()}catch(ne){ne instanceof bt&&ne.status===409?(d=await Pt.get(a),Re(),G(`${ne.message}. What you wrote is kept; send it again.`)):G(ne.message)}finally{C=!1}}},openFile(Y,re,Q){let ne=Q&&!d.head.startsWith(Q)?d.fixes.find(ae=>ae.commit.startsWith(Q)):void 0;ne?.files.some(ae=>ae.path===Y)?(u={path:Y,work:!1,between:{from:ne.parent,to:ne.commit}},D=re,Re()):d.files.some(ae=>ae.path===Y)?(u={path:Y,work:!1},D=re,Re()):o.open(Y)}};function $(Y,re,Q){let ne=q("button","yr-toggle",Y);return ne.title=Q,ne.setAttribute("aria-pressed",String(h[re])),ne.addEventListener("click",()=>{if(h[re]=!h[re],On(h),re==="focus"&&Mn(h.focus),re==="wrap"&&g){let ae=h.wrap?de.lineWrapping:[];for(let te of g.view.editors)te.dispatch({effects:g.wrap.reconfigure(ae)})}L(),B(),(re==="composer"||re==="unified")&&u&&pt(!0)}),ne}function B(){let Y=d;T.replaceChildren();let re=q("div","yr-row"),Q=q("div","yr-title");Q.append(q("b","",Y.id),` ${Y.title}`);let ne=q("div","yr-tools");ne.append($("Files","files","Show the list of files"),$("Unified","unified","One pane with the removed lines above the added ones, instead of two side by side"),$("Wrap","wrap","Wrap long lines in the diffs"),$("Comment box","composer","Keep a comment box for the selected lines above the diff"),$("Focus","focus","Hide the top bar, the sidebar and the status line (Esc leaves)")),re.append(Q,ne);let ae=q("div","yr-meta");ae.append(q("span",`yr-status yr-${Y.status}`,Y.status.replace("_"," ")),` ${Y.kind} ${Y.ref} \xB7 ${Y.base.slice(0,7)}..${Y.head.slice(0,7)}${Y.rounds.length?` \xB7 round ${Y.rounds.length+1}`:""} \xB7 `,Vt()?`writing as ${Y.author}`:"read-only: open the URL yajna serve --review printed to write"),T.append(re,ae)}function L(){j.hidden=!h.files}function F(){j.replaceChildren();let Y=(te,he,le,se="")=>{let pe=q("li",`${se} ${ri(u,he)?"yr-on":""}`);pe.append(te),le&&pe.append(q("span","yr-count",String(le))),pe.addEventListener("click",()=>{u=he,Re()}),j.append(pe)},re=d.threads.filter(te=>te.state==="open"||te.state==="addressed").length;Y(q("span","yr-label","Overview"),null,re,"yr-overview");for(let te of d.files){let he=d.threads.filter(se=>se.anchor.path===te.path&&se.state!=="resolved").length,le=q("span","yr-entry");le.append(q("span",`yr-fs yr-fs-${te.status}`,te.status),Ln(te.path)),te.old&&(le.title=`${te.old} \u2192 ${te.path}`),Y(le,{path:te.path,work:!1},he)}let Q=(te,he)=>{let le=q("li","yr-group",te);le.title=he,j.append(le)},ne=(te,he)=>{for(let le of te){let se={path:le.path,work:!1,between:he},pe=d.threads.filter(Ce=>Ce.anchor.path===le.path&&pr(Ce,he.to)&&Ce.state!=="resolved").length,De=q("span","yr-entry");De.append(q("span",`yr-fs yr-fs-${le.status}`,le.status),Ln(le.path)),le.old&&(De.title=`${le.old} \u2192 ${le.path}`),Y(De,se,pe)}},ae=d.since;ae?.files.length&&(Q(`Since round ${d.rounds.length} \xB7 ${ae.from.slice(0,7)}..${d.head.slice(0,7)}`,"What changed since the last yajna review update: the head it moved from to the head"),ne(ae.files,{from:ae.from,to:d.head}));for(let te of d.fixes)te.files.length&&(Q(`Fix ${te.commit.slice(0,7)} \xB7 ${te.threads.map(he=>`T${he}`).join(", ")}`,`${te.subject}
This commit on its own, against its parent, whatever else came between the fixes`),ne(te.files,{from:te.parent,to:te.commit}));if(d.unreviewed.length){let te=q("li","yr-group","Not in the review yet");te.title="Committed after the review\u2019s head, or not committed: commit, then yajna review update",j.append(te);for(let he of d.unreviewed){let le=q("span","yr-entry");le.append(q("span",`yr-fs yr-fs-${he.status==="?"?"A":he.status}`,he.status),Ln(he.path)),Y(le,{path:he.path,work:!0},0,"yr-work")}}}function E(){g?.view.destroy(),g=void 0,H.replaceChildren(),H.classList.remove("yr-split");let Y=d,re=q("section","yr-summary");if(Y.about.length){let se=q("p","yr-about","About ");Y.about.forEach((pe,De)=>{let Ce=q("a","",pe);Ce.href=`/${pe}.html`,Ce.target="_blank",se.append(...De?[", ",Ce]:[Ce])}),re.append(se)}if(re.append(q("h3","","Summary"),q("div","yr-pre",Y.summary||"(none yet)")),Vt()&&!["merged","closed"].includes(Y.status)){let se=[{label:"Request changes",action:"request-changes",needsText:!0}];Y.author.startsWith("agent:")||se.unshift({label:"Approve",action:"approve"}),re.append(Si(_e,"verdict",se,"A reason, or a word with the approval\u2026"))}H.append(re);for(let se of Y.problems)H.append(q("div","yr-problem",se));let Q=q("section","yr-threads"),ne=se=>Y.threads.filter(pe=>pe.state===se).length,ae=["open","addressed","outdated","resolved"].map(se=>[se,ne(se)]).filter(([,se])=>se).map(([se,pe])=>`${pe} ${se}`).join(" \xB7 ");Q.append(q("h3","",`Threads${ae?` \xB7 ${ae}`:""}`)),Y.threads.length||Q.append(q("p","yr-muted","No threads yet. Select lines in a file to comment on them."));let te=se=>{if(!se.anchor.path)return-1;let pe=Y.files.findIndex(De=>De.path===se.anchor.path);return pe<0?Y.files.length:pe},he=[...Y.threads].sort((se,pe)=>te(se)-te(pe)||se.n-pe.n),le;for(let se of he){let pe=se.anchor.path??"General";if(pe!==le){le=pe;let De=q("h4","yr-group-head");if(se.anchor.path){let Ce=se.anchor.path,$e=Ln(Ce,"yr-link");$e.addEventListener("click",()=>_e.openFile(Ce)),De.append($e)}else De.textContent=pe;Q.append(De)}Q.append(ur(se,_e,!0))}Vt()&&Q.append(Si(_e,"general",[{label:"Comment",action:"comment",needsText:!0}],"A comment on the whole review\u2026")),H.append(Q)}function xe(Y,re,Q,ne){let ae=d,te=[];for(let he of ae.threads.filter(le=>le.anchor.path===re&&pr(le,Q))){let le=mv(he,Y);if(le===null)continue;let se=new Rn(JSON.stringify(he)+Vt(),()=>ur(he,_e,!1));te.push(me.widget({widget:se,block:!0,side:1}).range(Y.state.doc.line(le).to))}if(b&&b.key===ne&&b.b<=Y.state.doc.lines){let{a:he,b:le}=b,se=Q===ae.head?void 0:Q,pe=new Rn(`draft:${ne}:${he}-${le}`,()=>{let De=q("div","yr-thread yr-draft");De.append(q("div","yr-thread-head",`New thread on ${vr(he,le)}`));let Ce=q("button","","Cancel");Ce.addEventListener("click",()=>{b=null,Y.dispatch({effects:Ci.of(xe(Y,re,Q,ne))})});let $e=()=>he===le?`${re}:${he}`:`${re}:${he}-${le}`;return De.append(Si(_e,O(ne),[{label:"Comment",action:"comment",needsText:!0,at:$e,on:se}],"Your comment\u2026 (Ctrl-Enter sends)",[Ce])),requestAnimationFrame(()=>De.querySelector("textarea")?.focus()),De});te.push(me.widget({widget:pe,block:!0,side:2}).range(Y.state.doc.line(le).to))}return me.set(te,!0)}function ut(Y,re,Q){let ne=q("div","yr-compose"),ae=q("div","yr-picked"),te=()=>{ae.textContent=w?`On ${vr(w.a,w.b)}`:"Select lines on the right, or click their numbers (shift-click for a range)"};te();let he=()=>{if(!w)return G("Pick the lines first: select them on the right, or click their numbers."),null;let{a:se,b:pe}=w;return se===pe?`${Y}:${se}`:`${Y}:${se}-${pe}`},le=Si(_e,`new:${re}`,[{label:"Comment",action:"comment",needsText:!0,at:he,on:Q}],"A comment on the picked lines\u2026 (Ctrl-Enter sends)");return le.querySelector("textarea").rows=1,ne.append(ae,le),ne.show=te,ne}async function pt(Y=!1){let re=d,Q=u;if(!Q)return;let ne=ul(re,Q),ae=Q.between?.to??re.head,te=xv(Q);if(!Y&&g&&ri(g.shown,Q)&&g.head===re.head&&!Q.work){let Ne=g.view.b;Ne.dispatch({effects:Ci.of(xe(Ne,ne.path,ae,te))}),Xe(ne,ae);return}let he=await Pt.file(a,ne,Q.work,Q.between);if(P||!ri(u,Q)||!Y&&g&&ri(g.shown,Q)&&g.sides.base===he.base&&g.sides.head===he.head)return;let le=g&&ri(g.shown,Q)?H.querySelector(".yr-scroll")?.scrollTop??0:0;g?.view.destroy(),g=void 0,w=null;let se=await Qo(ne.path.slice(ne.path.lastIndexOf("/")+1)).catch(()=>null);if(P||!ri(u,Q))return;let pe=new Ot,De=[wv,ct.readOnly.of(!0),de.editable.of(!1),kn(),se??[],pe.of(h.wrap?de.lineWrapping:[])],Ce=Vt()&&!Q.work&&ne.status!=="D";H.replaceChildren(),H.classList.add("yr-split");let $e=q("div","yr-scroll");if(Q.between&&ae!==re.head){let Ne=re.fixes.find(di=>di.commit===ae);H.append(q("p","yr-muted yr-extras",`Fix ${ae.slice(0,7)}: ${Ne?.subject??""}, on its own against its parent. A comment here is anchored to this commit.`))}Q.work&&H.append(q("p","yr-muted yr-extras",`Not in the review: the head ${re.head.slice(0,7)} against the working tree. Commit it and run yajna review update ${re.id} to comment on it.`));let zi=ae===re.head?void 0:ae,Tt=Ce&&h.composer?ut(ne.path,te,zi):null;Tt&&H.append(Tt);let Ft=q("div","yr-diff");$e.append(Ft,q("div","yr-extras")),H.append($e);let Un=(Ne,di)=>{b={key:te,a:Ne,b:di},Ue.b.dispatch({effects:Ci.of(xe(Ue.b,ne.path,ae,te))})},Ti=Ce?[bv(),Zi(),hl,fv(Un),de.updateListener.of(Ne=>{Ne.selectionSet&&(w=vl(Ne.state),Tt?.show?.())})]:[Jt(),hl],Ue=h.unified?yv(Ft,he,[...De,...Ti]):_v(Ft,he,De,Ti,h);if(g={shown:Q,head:re.head,sides:he,view:Ue,wrap:pe},Q.work||Ue.b.dispatch({effects:Ci.of(xe(Ue.b,ne.path,ae,te))}),he.head===null&&Ft.before(q("p","yr-muted yr-extras",Q.work?"Deleted in the working tree.":"Deleted at the head: nothing to comment on here.")),Xe(ne,ae),D&&D<=Ue.b.state.doc.lines){let Ne=Ue.b.state.doc.line(D).from;requestAnimationFrame(()=>Ue.b.dispatch({effects:de.scrollIntoView(Ne,{y:"center"})}))}else $e.scrollTop=le;D=void 0}function Xe(Y,re){let Q=H.querySelector(".yr-diff + .yr-extras");if(!Q||(Q.replaceChildren(),u?.work))return;let ne=d.threads.filter(ae=>ae.anchor.path===Y.path&&!pr(ae,re));ne.length&&Q.append(q("h3","","Threads at other commits"));for(let ae of ne)Q.append(ur(ae,_e,!0))}function Re(){B(),L(),F(),!u||!ul(d,u)?(u=null,E()):pt(),o.onStatus()}let si=Y=>{Y.key==="Escape"&&h.focus&&!(Y.target instanceof HTMLTextAreaElement)&&(h.focus=!1,On(h),Mn(!1),B())};document.addEventListener("keydown",si),Re();let ai=window.setInterval(async()=>{if(C)return;let Y=await Pt.get(a).catch(()=>null);if(!Y||C)return;let re=JSON.stringify(Y.unreviewed)!==JSON.stringify(d.unreviewed);Y.version!==d.version||re?(d=Y,Re()):u?.work&&pt()},pv);return{dispose(){P=!0,window.clearInterval(ai),document.removeEventListener("keydown",si),Mn(!1),g?.view.destroy()},status:()=>{let Y=d.threads.filter(Q=>Q.state==="open"||Q.state==="addressed").length,re=d.unreviewed.length?` \xB7 ${d.unreviewed.length} files not in the review yet`:"";return`${d.status.replace("_"," ")} \xB7 ${Y} of ${d.threads.length} threads unsettled${re}`}}}};dt(gr);var Dv=5e3,$n=class{constructor(o){this.open=o;this.element.className="yr-side",this.element.hidden=!0;let a=document.createElement("div");a.className="yr-side-head",a.textContent="Reviews",this.element.append(a,this.list),this.load(),window.setInterval(()=>{this.load()},Dv)}element=document.createElement("section");list=document.createElement("ul");shown="";async load(){let o=await Pt.list().catch(()=>[]),a=JSON.stringify(o);if(a===this.shown)return;this.shown=a;let d=h=>h.status==="open"||h.status==="changes_requested"?0:1;o.sort((h,u)=>d(h)-d(u)||u.id.localeCompare(h.id)),this.list.replaceChildren();for(let h of o){let u=document.createElement("li");u.className=`yr-side-item yr-${h.status}`,u.title=`${h.id}
${h.kind} ${h.ref}
${h.status}${h.elsewhere?`
in ${h.elsewhere}`:""}`;let g=document.createElement("span");g.className="yr-label",g.textContent=h.title||h.id;let b=document.createElement("span");b.className="yr-count",b.textContent=h.open?String(h.open):h.status==="open"?"":h.status.replace("_"," "),u.append(g,b),u.addEventListener("click",()=>this.open(h.id)),this.list.append(u)}this.element.hidden=o.length===0}};var Nn=class{constructor(o,a,d){this.open=a;this.onWatch=d;this.element=document.createElement("nav"),this.element.className="yt",this.filterBox=document.createElement("input"),this.filterBox.type="search",this.filterBox.placeholder="Filter loaded files",this.filterBox.addEventListener("input",()=>this.filter()),this.list=document.createElement("div"),this.list.className="yt-list",this.element.append(this.filterBox,this.list);for(let h of o){let u={name:h.name,kind:h.exists?"dir":"broken"},g=h.live==="notify"?"live":h.live==="poll"?"polled every 2 s":"not live",b=h.exists?`${h.path}
${g}`:`${h.path} is not on this machine`;this.list.append(this.item(h.name,u,0,b))}}nodes=new Map;selected;element;list;filterBox;expanded(){return[...this.nodes.values()].filter(o=>o.loaded&&o.children&&!o.children.hidden&&o.item.isConnected).map(o=>o.path)}describe(o,a,d){o.title=[a,d.link?`\u2192 ${d.link}`:"",d.size!==void 0?at(d.size):"",ei(d.mtime)].filter(Boolean).join(`
`)}item(o,a,d,h){let u=document.createElement("div");u.className="yt-item",u.dataset.key=`${a.kind}/${a.name}`;let g=document.createElement("div");g.className=`yt-row yt-${a.kind}${d===0?" yt-root":""}`,g.style.paddingLeft=`${d*12+6}px`,g.dataset.path=o,h?g.title=h:this.describe(g,o,a);let b=document.createElement("span");b.className="yt-twisty",b.textContent=a.kind==="dir"?"\u25B8":"";let w=document.createElement("span");w.className="yt-label",w.textContent=a.name+(a.link?" \u2197":""),g.append(b,w),u.append(g);let D={path:o,depth:d,item:u,row:g,loaded:!1,count:0};return this.nodes.set(o,D),a.kind==="dir"?g.addEventListener("click",()=>this.toggle(D)):(a.kind==="file"||a.kind==="other")&&(g.addEventListener("click",()=>(this.select(g),this.open(o,!1))),g.addEventListener("dblclick",()=>this.open(o,!0))),u}async toggle(o){let a=o.row.querySelector(".yt-twisty");if(o.children&&!o.children.hidden){o.children.hidden=!0,a.textContent="\u25B8",this.onWatch();return}a.textContent="\u25BE",o.children||(o.children=document.createElement("div"),o.item.append(o.children)),o.children.hidden=!1,o.loaded||(o.loaded=!0,await this.page(o,0)),this.onWatch()}async page(o,a){let d=o.children,h=o.depth+1,u=this.note(d,"loading\u2026",h);try{let g=await st.list(o.path,a);u.remove();for(let b of g.entries)d.append(this.item(`${o.path}/${b.name}`,b,h));o.count+=g.entries.length,o.mtime=g.mtime,this.tail(o,g.total,g.next)}catch(g){u.textContent=String(g.message)}this.filter()}tail(o,a,d){let h=o.children,u=o.depth+1;for(let g of h.querySelectorAll(":scope > .yt-note"))g.remove();if(a===0&&this.note(h,"empty",u),d!==void 0){let g=this.note(h,`show more (${d} of ${a})`,u);g.classList.add("yt-more"),g.addEventListener("click",()=>(g.remove(),this.page(o,d)))}}dirChanged(o){let a=this.nodes.get(o.path);if(!a||!a.loaded||!a.children||o.exists&&o.mtime===a.mtime)return;let d=async()=>{if(!o.exists){a.children.replaceChildren(),this.note(a.children,"deleted on disk",a.depth+1),a.count=0,a.mtime=void 0;return}let h=Math.max(a.count,1),u=[],g=0,b=0,w;for(;g!==void 0&&u.length<h;){let T=await st.list(a.path,g);u.push(...T.entries),g=T.next,b=T.total,w=T.mtime}let D=a.children,C=new Map;for(let T of D.querySelectorAll(":scope > .yt-item"))C.set(T.dataset.key,T);let P=u.map(T=>{let R=`${a.path}/${T.name}`,V=C.get(`${T.kind}/${T.name}`);return V?(C.delete(`${T.kind}/${T.name}`),this.describe(V.querySelector(":scope > .yt-row"),R,T),V):this.item(R,T,a.depth+1)});for(let T of C.values())this.forget(T);D.replaceChildren(...P),a.count=u.length,a.mtime=w,this.tail(a,b,g),this.filter(),this.onWatch()};a.busy=(a.busy??Promise.resolve()).then(d,d).catch(()=>{})}forget(o){let a=o.querySelector(":scope > .yt-row")?.dataset.path;if(a)for(let d of[...this.nodes.keys()])(d===a||d.startsWith(`${a}/`))&&this.nodes.delete(d)}note(o,a,d){let h=document.createElement("div");return h.className="yt-row yt-note",h.style.paddingLeft=`${d*12+18}px`,h.textContent=a,o.append(h),h}select(o){this.selected?.classList.remove("yt-selected"),o.classList.add("yt-selected"),this.selected=o}async reveal(o){let a=o.split("/");for(let h=1;h<a.length;h++){let u=this.nodes.get(a.slice(0,h).join("/"));if(!u)return;(!u.children||u.children.hidden)&&await this.toggle(u)}let d=this.nodes.get(o);d&&(this.select(d.row),d.row.scrollIntoView({block:"nearest"}))}filter(){let o=this.filterBox.value.trim().toLowerCase(),a=d=>{let h=d.querySelector(":scope > .yt-row"),u=d.querySelector(":scope > div:not(.yt-row)"),g=!1;if(u)for(let D of Array.from(u.children))D.classList.contains("yt-item")?g=a(D)||g:D.hidden=o!=="";let b=h?.querySelector(".yt-label")?.textContent?.toLowerCase()??"",w=o===""||g||b.includes(o);return d.hidden=!w,w};for(let d of Array.from(this.list.children))a(d),d.hidden=!1}};var kv=qh(_l(),1),Hn=kv;var xl=window.matchMedia("(prefers-color-scheme: dark)"),yl=()=>xl.matches?Hn.themeDark:Hn.themeLight;function _r(r){let o=decodeURIComponent(r.replace(/^#/,""));if(!o)return null;let a=/^(.*):L(\d+)(?:-(\d+))?$/.exec(o);return a?{path:a[1],from:Number(a[2]),to:Number(a[3]??a[2])}:{path:o}}var mr=class{element=document.createElement("div");title=document.createElement("span");init(o){this.element.className="yw-tab",this.title.className="yw-tab-title";let a=document.createElement("span");a.className="yw-tab-close",a.textContent="\xD7",a.title="Close",a.addEventListener("click",d=>(d.stopPropagation(),o.api.close())),this.element.addEventListener("auxclick",d=>d.button===1&&o.api.close()),this.element.addEventListener("dblclick",()=>o.api.updateParameters({pinned:!0})),this.element.append(this.title,a),this.render(o.params)}update(o){this.render(o.params)}render(o){this.title.textContent=ti(o.path),this.element.title=o.path,this.element.classList.toggle("yw-preview",!o.pinned),this.element.classList.toggle("yw-changed",!!o.changed),this.element.classList.toggle("yw-gone",!!o.gone),this.element.title=o.gone?`${o.path} (deleted on disk)`:o.path}},fr=class{constructor(o){this.bench=o;this.element.className="yw-panel",this.element.addEventListener("pointerdown",()=>this.pin(),{capture:!0})}element=document.createElement("div");viewer;loads=0;params;stat;api;init(o){this.api=o.api,this.params=o.params,o.api.onDidVisibilityChange(a=>{a.isVisible&&this.params.changed&&this.api.updateParameters({changed:!1})}),this.load()}update(o){let a={...this.params,...o.params},d=a.path!==this.params.path||a.kind!==this.params.kind;a.path!==this.params.path&&this.bench.watchChanged(),this.params=a,d&&this.load()}async changed(o){if(!o.exists){this.params.gone||this.api.updateParameters({gone:!0}),this.bench.refreshStatus();return}let a=this.stat;if(!this.params.gone&&a&&a.size===o.size&&a.mtime===o.mtime)return;this.params.gone&&this.api.updateParameters({gone:!1});let d=a&&{...a,size:o.size,mtime:o.mtime};(d&&this.viewer?.follow?await this.viewer.follow(d).catch(()=>!1):!1)?this.stat=d:await this.load(),this.api.isVisible||this.api.updateParameters({changed:!0}),this.bench.refreshStatus()}get gone(){return!!this.params.gone}pin(){this.params.pinned||this.api.updateParameters({pinned:!0})}get path(){return this.params.path}reveal(o,a){this.viewer?.reveal?.(o,a)}status(){let o=this.stat,a=this.params.gone?"deleted on disk":o?[at(o.size),ei(o.mtime)].filter(Boolean).join(" \xB7 "):"";return{path:this.params.path,left:a,right:this.viewer?.status?.()??""}}async load(){this.viewer?.dispose?.(),this.viewer=void 0;let o=++this.loads,a=document.createElement("div");a.className="yw-box",this.element.replaceChildren(a);let d=this.params.path;try{let h=d.startsWith("review:");if(this.stat=h?{path:d,kind:"review",mime:"review",text:!1}:await st.stat(d),o!==this.loads)return;let u=h?gr:this.params.kind&&kd(this.params.kind)||Dd(this.stat),g={path:d,stat:this.stat,open:D=>this.bench.open(D,{pin:!0}),switchTo:D=>this.api.updateParameters({kind:D,pinned:!0}),onLines:(D,C)=>this.bench.onLines(this,D,C),onStatus:()=>this.bench.refreshStatus()},b=await u.mount(a,g);if(o!==this.loads){b.dispose?.();return}this.viewer=b;let w=this.bench.takeReveal(d);w&&this.viewer.reveal?.(w.from,w.to)}catch(h){if(h instanceof bt&&h.status===404&&this.bench.restoring){this.api.close();return}o===this.loads&&Dn(a,`${d}: ${h.message}`)}o===this.loads&&this.bench.loaded(this)}dispose(){this.viewer?.dispose?.()}},br=class{element=document.createElement("div");init(){this.element.className="yw-watermark",this.element.innerHTML="<p>Open a file from the tree.</p><p>A click previews it, a double click keeps it open.<br>Drag a tab to an edge to split, or press <kbd>Ctrl</kbd>/<kbd>\u2318</kbd> <kbd>\\</kbd>.</p>"}},wr=class{constructor(o,a){this.bench=o;this.group=a}element=document.createElement("div");init(){this.element.className="yw-actions";let o=document.createElement("button");o.innerHTML='<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor"/><line x1="8" y1="2.5" x2="8" y2="13.5" stroke="currentColor"/></svg>',o.title="Split right (Ctrl/\u2318 \\)",o.addEventListener("click",()=>this.bench.splitRight(this.group.activePanel)),this.element.append(o)}dispose(){}},Bn=class{constructor(o,a,d,h,u){this.storageKey=a;this.onStatus=d;this.onActive=h;this.onWatch=u;this.api=Hn.createDockview(o,{theme:yl(),createComponent:({id:b})=>{let w=new fr(this);return this.panels.set(b,w),w},createTabComponent:()=>new mr,createWatermarkComponent:()=>new br,createRightHeaderActionComponent:b=>new wr(this,b)}),xl.addEventListener("change",()=>this.api.updateOptions({theme:yl()})),this.api.onDidActivePanelChange(()=>{let b=this.active();this.onActive(b?.path??null),this.refreshStatus()}),this.api.onDidRemovePanel(b=>{this.panels.delete(b.id),this.onWatch()}),this.api.onDidAddPanel(()=>this.onWatch());let g;this.api.onDidLayoutChange(()=>{window.clearTimeout(g),g=window.setTimeout(()=>this.save(),300)}),window.addEventListener("keydown",b=>{(b.ctrlKey||b.metaKey)&&b.key==="\\"&&(b.preventDefault(),this.splitRight(this.api.activePanel))})}api;restoring=!1;panels=new Map;reveals=new Map;counter=0;watchChanged(){this.onWatch()}paths(){return[...new Set([...this.panels.values()].map(o=>o.path))]}fileChanged(o){for(let a of this.panels.values())a.path===o.path&&a.changed(o)}active(){let o=this.api.activePanel;return o?this.panels.get(o.id):void 0}refreshStatus(){this.onStatus(this.active()?.status()??null)}loaded(o){this.active()===o&&this.onActive(o.path),this.refreshStatus()}onLines(o,a,d){if(this.active()===o){let h=a===d?`L${a}`:`L${a}-${d}`;history.replaceState(null,"",`#${encodeURI(o.path)}:${h}`)}}takeReveal(o){let a=this.reveals.get(o);return this.reveals.delete(o),a}newId(o){return`${o}#${++this.counter}-${Date.now().toString(36)}`}open(o,a={}){let d=this.api.activeGroup,h=d?.panels.find(b=>b.params?.path===o);if(a.from!==void 0&&this.reveals.set(o,{from:a.from,to:a.to}),h){h.api.setActive(),a.pin&&h.api.updateParameters({pinned:!0}),a.from!==void 0&&(this.panels.get(h.id)?.reveal(a.from,a.to),this.reveals.delete(o));return}let u=d?.panels.find(b=>!b.params?.pinned),g={path:o,pinned:!!a.pin};if(u){u.api.updateParameters(g),u.api.setActive();return}this.api.addPanel({id:this.newId(o),component:"viewer",tabComponent:"tab",params:g,...d?{position:{referenceGroup:d}}:{}})}splitRight(o){if(!o)return;let a={...o.params,pinned:!0};o.api.updateParameters({pinned:!0}),this.api.addPanel({id:this.newId(a.path),component:"viewer",tabComponent:"tab",params:a,position:{referenceGroup:o.group,direction:"right"}})}save(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.api.toJSON()))}catch{}}restore(){let o=null;try{o=localStorage.getItem(this.storageKey)}catch{return}if(o){this.restoring=!0;try{this.api.fromJSON(JSON.parse(o))}catch{this.api.clear()}window.setTimeout(()=>this.restoring=!1,2e3)}}};var Fn=class{constructor(o,a){this.onChange=o;this.onState=a}source;paths=new Set;timer;set(o){let a=new Set(o);a.size===this.paths.size&&[...a].every(d=>this.paths.has(d))||(this.paths=a,window.clearTimeout(this.timer),this.timer=window.setTimeout(()=>this.connect(),300))}connect(){if(this.source?.close(),this.source=void 0,this.paths.size===0){this.onState("idle");return}let o=[...this.paths].map(d=>`watch=${encodeURIComponent(d)}`).join("&"),a=new EventSource(`/api/events?${o}`);this.onState("connecting"),a.addEventListener("open",()=>this.onState("live")),a.addEventListener("error",()=>this.onState("connecting")),a.addEventListener("change",d=>this.onChange(JSON.parse(d.data))),this.source=a}};var Dl="yajna-files:sidebar";async function Sv(){let r=new URLSearchParams(location.search).get("token");r&&(yd(r),history.replaceState(null,"",location.pathname+location.hash));let[o,a]=await Promise.all([st.info(),st.roots()]);document.title=`${o.notebook} \xB7 files`,document.querySelector("#notebook").textContent=o.notebook,document.querySelector("#version").textContent=`yajna ${o.version}`;let d=document.querySelector("#status-path"),h=document.querySelector("#status-left"),u=document.querySelector("#status-right"),g=document.querySelector("#status-live"),b=new Map(a.map(L=>[L.name,L.live])),w="idle",D=null,C=()=>{let L=D?b.get(D.path.split("/")[0]):void 0,F=!D||!L?"":L==="off"?"not live":w==="connecting"?"reconnecting\u2026":L==="poll"?"live, polled every 2 s":"live";g.textContent=F,g.className=F.startsWith("live")?"on":""},P=L=>{D=L,d.textContent=L?.path??"",h.textContent=L?.left??"",u.textContent=L?.right??"",C()},T,R=new Fn(L=>L.kind==="dir"?j.dirChanged(L):T.fileChanged(L),L=>(w=L,C())),V=()=>R.set([...T.paths().filter(L=>!L.startsWith("review:")),...j.expanded()]),j=new Nn(a,(L,F)=>T.open(L,{pin:F}),()=>V()),H=new $n(L=>T.open(`review:${L}`,{pin:!0}));document.querySelector("#sidebar").append(H.element,j.element),T=new Bn(document.querySelector("#editor"),`yajna-files:${o.notebook}`,P,L=>{L&&_r(location.hash)?.path!==L&&history.replaceState(null,"",`#${encodeURI(L)}`)},()=>V());let G=location.hash;T.restore();let O=(L=location.hash)=>{let F=_r(L);F&&(T.open(F.path,{pin:!0,from:F.from,to:F.to}),j.reveal(F.path))};window.addEventListener("hashchange",()=>O()),O(G);let _e=document.querySelector("#sidebar"),$=Number(localStorage.getItem(Dl)??0);$>120&&(_e.style.width=`${$}px`);let B=document.querySelector("#sash");B.addEventListener("pointerdown",L=>{B.setPointerCapture(L.pointerId);let F=xe=>_e.style.width=`${Math.max(120,Math.min(xe.clientX,window.innerWidth-200))}px`,E=()=>{B.removeEventListener("pointermove",F);try{localStorage.setItem(Dl,String(_e.offsetWidth))}catch{}};B.addEventListener("pointermove",F),B.addEventListener("pointerup",E,{once:!0})})}Sv().catch(r=>{document.body.textContent=`The files viewer could not start: ${r.message}`});
/*! Bundled license information:

dockview-core/dist/dockview-core.js:
  (**
   * dockview-core
   * @version 8.6.1
   * @link https://github.com/dockview/dockview
   * @license MIT
   *)
*/
