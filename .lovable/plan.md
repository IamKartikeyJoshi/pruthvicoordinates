# Implementation Plan

A focused pass covering performance, dynamic CTAs, admin coverage, header layout, and a few UX polish items.

## 1. Site Performance & Image Loading

- Convert all hero/section JPGs in `src/assets/` to optimized WebP equivalents using a build step (sharp), keep originals as fallback.
- Add `vite-imagetools` for automatic format/size variants on imported images.
- Add `loading="lazy"`, `decoding="async"`, explicit `width`/`height` and `fetchpriority` attributes across every `<img>` in components and pages.
- Preload the LCP hero image in `index.html`.
- Code-split heavy admin sub-tabs (already lazy) and ensure route-level lazy loading for `/admin`, `/book-appointment`, `/track-request`.
- Add a tiny in-memory cache to `useSiteContent` so each page doesn't re-fetch on remount.

## 2. Dynamic CTA System (site-wide)

- Introduce a new `cta` section key in `site_content`. Schema per item: `eyebrow`, `heading`, `subheading`, `primary_text`, `primary_link`, `secondary_text`, `secondary_link`, `phone`, `email`, `placement` (page + position).
- Refactor `CTASection.tsx` to read from `site_content` with the current copy as default fallback.
- Add a generic `<DynamicCTA placement="home-bottom" />` component that admins can insert anywhere via a new "CTA Blocks" tab.
- In Admin, add a new tab "CTA Blocks" where admin can add/edit/delete/reorder CTA blocks and choose a placement key (drop-down of known placements: home-bottom, mission-mid, expertise-bottom, services-mid, portfolio-bottom, contact-top, etc.).
- Render `<DynamicCTA>` at those placement keys on each page; if no block exists for that placement, the page uses the existing default CTA copy.

## 3. Admin Panel Coverage Expansion

- Add new admin tabs for:
  - **Contact page** – hero, form labels, info cards, map embed URL, success messages.
  - **Book Appointment page** – hero, intro copy, time-slot configuration, success messages.
- **Mission tab headings**: Expose `Our Journey` eyebrow and `34 Years of Excellence` heading (and any other static labels currently hard-coded) as editable fields inside the existing Mission tab sections.
- Audit each page once more and surface any remaining hard-coded headings/labels into the admin schema with defaults preserved.

## 4. Image Field UX

- The existing image fields already support file upload (base64). Polish:
  - Show file-size limit hint, preview thumbnail, "Remove" button, and a small "Replace" affordance.
  - Apply to every image field across all admin tabs (single component reused).

## 5. Client Feedback Avatars

- Update the Portfolio "Client Feedback / Words of Trust" cards: replace quotation-mark glyph with a circular avatar (initials) styled identically to the "Our Clients" avatar treatment (themed bg, serif initials, accent ring).

## 6. Kanban Drag-and-Drop Performance

- Switch from `useDraggable` per card with full re-render to `@dnd-kit/sortable` with `SortableContext` per column for smoother dragging.
- Memoize card components with `React.memo`.
- Increase pointer activation distance and use CSS transforms only (already in dnd-kit) — but avoid re-fetching list after each move; rely on optimistic local state.

## 7. Header Layout (LAT/LON one line)

- Update `Header.tsx` so LAT and LON labels accept longer DMS strings like `70° 46' 9.8184"` without wrapping.
- Reduce gap, slightly shift brand left, hide EST on tighter widths, keep all three on one line at ≥1280px; on 1024–1279 show LAT+LON only.
- Use `whitespace-nowrap` and tabular numerics for coordinates.

## 8. Live Preview Before Publish

- Add a "Preview" toggle in the admin header. When enabled, edits are kept in a draft store and rendered in an embedded iframe of the public site (`/?preview=1`) with the draft injected via `postMessage`.
- A "Publish" button writes the draft to `site_content` (current save behavior). "Discard" reverts.
- Minimal scope: draft lives in admin tab memory; iframe re-renders on every save-to-draft.

## Technical Notes

- `vite-imagetools` plugin added in `vite.config.ts`; existing imports updated to use `?format=webp&quality=75` query.
- New default content keys in `src/lib/defaultContent.ts` for `cta` blocks and Contact/BookAppointment pages.
- Header: change grid spacing classes, drop `lg:` divider widths.
- Kanban: replace `useDraggable`/columns with `DndContext` + `SortableContext` per column; debounce server `update` calls.
- Live preview: new route `/preview` that mounts the public pages and listens for `window.addEventListener('message')` to merge draft content into `useSiteContent`.

## Out of Scope

- Image CDN/transformation service (recommended later if usage grows).
- Multi-user draft collaboration.
