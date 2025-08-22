# UI/UX Guidelines (2025)

**Scope:** A practical, up‑to‑date reference for two ecosystems:

* **Apple iOS 26+ (Liquid Glass design system)** — Human Interface Guidelines (HIG)
* **Google Material Design 3 (Material You / M3)** — latest component guidance

> Use this as a product/design system backbone: principles → layout → theming/typography → interaction → accessibility → **full component catalog** with do/don’t.

---

## Part A — Apple iOS 26+ (Liquid Glass)

### 1) Principles

* **Clarity** — interfaces communicate purpose; text is legible; iconography is clear.
* **Deference** — UI frames content; ornamental effects never overpower data/tasks.
* **Depth** — hierarchy and spatial relationships (e.g., push/pop, sheets) convey context.
* **Consistency** — prefer system components/behaviors before custom ones.
* **Personalization-aware** — surfaces may be tinted, blurred, or layered; designs must remain readable across wallpapers, tints, and Liquid Glass materials.

### 2) Layout & Sizing

* **Safe areas**: Respect notches, home indicator, rounded corners. Extend background edge‑to‑edge; keep content within safe areas.
* **Responsive classes**: Support compact/regular width & height. Design universal screens (iPhone, Plus/Max, iPad split views).
* **Hit targets**: Minimum **44×44 pt** for any interactive control.
* **Margins & spacing**: 16 pt base spacing for blocks; 8 pt for tight groups.
* **Scrolling**: Prefer content that scrolls under large titles/toolbars with proper scroll-edge transitions.

### 3) Color, Materials & Iconography

* **Semantic colors**: Use system roles (e.g., *label*, *secondaryLabel*, *systemBackground*, *separator*, *tintColor*).
* **Light/Dark**: Provide variants for both; never hard-code single-appearance colors.
* **Liquid Glass**: New layered, translucent material treatments for bars, ornaments, and app icons. Maintain contrast and readability across layers.
* **SF Symbols**: Use adaptable symbols; support weights, scales, and animated states where appropriate.

### 4) Typography

* **System font**: San Francisco (SF Pro / SF Compact). Use **Dynamic Type** styles (Large Title, Title, Body, Caption, etc.).
* **Scaling**: Text must reflow at all accessibility sizes without clipping/truncation.
* **Hierarchy**: Large Title for top-level, standard titles deeper; avoid overusing all‑caps.

### 5) Motion, Haptics & Feedback

* **Motion with meaning**: Reinforce hierarchy (push/pop, sheet rise, fade for context loss).
* **Respect settings**: Honor Reduce Motion and Reduce Transparency.
* **Haptics**: Use system haptic patterns sparingly for confirmations, errors, and critical state changes.

### 6) Accessibility

* **VoiceOver**: Every control has a concise label and correct trait (button, switch, image, etc.).
* **Contrast**: Minimum **4.5:1** for text on backgrounds; verify across materials.
* **Focus order**: Logical, predictable; avoid focus traps in sheets/alerts.
* **Dynamic Type**: Test from XS to XXXL. Support Bold Text, Larger Accessibility Sizes.

### 7) Navigation Patterns

* **Hierarchical (stack)**: Navigation Bar → push/pop with back gesture.
* **Flat (tabs)**: Bottom Tab Bar for 2–5 top‑level areas. Use badges sparingly.
* **Modal**: Prefer **sheets** for task‑focused flows; avoid full‑screen unless immersive.
* **Split view / Sidebar** (iPad, large iPhone in landscape): Master‑detail with collapsible sidebar.
* **Search**: Prominent, predictable placement; consider *search tokens* for filtering.

### 8) Component Catalog (iOS)

> **Goal:** prefer system components; describe when to use, anatomy, behaviors, states.

#### 8.1 Navigation & Structure

* **Navigation Bar** — large title on first screen; standard title deeper. Supports leading/trailing bar items, segmented controls, search.
* **Tab Bar** — primary destinations (2–5). Text labels required; icons alone only if universally clear.
* **Toolbar** — contextual actions; group related items; use standard icons/labels.
* **Sidebar** (iPad/LG screens) — persistent app navigation with hierarchical sections.
* **Split View** — two/three-column layouts for master → detail.
* **Page Controls** — indicate horizontal pages (carousels/walkthroughs). Use sparingly for browsing, not app-level nav.
* **Status Bar** — avoid obscuring; adjust styles (light/dark) for legibility.

#### 8.2 Containers & Lists

* **Lists & Tables** — grouped/inset/grouped‑inset styles; support accessories (disclosure, switches), swipe actions, reorder, and multi‑select.
* **Collection Views** — grid/orthogonal layouts; compositional layouts for complex feeds.
* **Cards/Content Rows** — use as visual grouping; avoid inventing bespoke elevations.
* **Split/Popover/Callout** — use popovers (iPad) for transient choices without leaving context.

#### 8.3 Actions & Menus

* **Buttons** — primary (filled/borderedProminent), secondary (bordered), tertiary (plain). Include clear labels and optional icons.
* **Pull‑down Button** — button that reveals a directly‑related menu; keep items scoped to the button’s action.
* **Menu / Context Menu** — short, scannable labels; group with separators; include icons for faster recognition; avoid deep nesting.
* **Action Sheets** — small sets (≤4 actions incl. Cancel). Use for choices that affect the current context.

#### 8.4 Input Controls

* **Text Fields** — labels, placeholders, helper/error text; correct content types and keyboard variants; support autofill and clear button.
* **Search Field** — inline or in nav bar; supports suggestions and tokens.
* **Pickers** — date/time (inline or wheels), color, list pickers; default to inline on iPhone when possible.
* **Segmented Control** — mutually exclusive filters or modes; concise segment labels.
* **Steppers** — small incremental numeric adjustments.
* **Sliders** — continuous range; include min/max and value affordance.
* **Switch (Toggle)** — binary on/off; label states clearly adjacent to the control.
* **Page/Refresh Controls** — pull‑to‑refresh; indicate progress.

#### 8.5 Feedback & Communication

* **Alerts** — interrupting, decision‑forcing; 1–2 action buttons plus Cancel.
* **Banners** — lightweight, non‑blocking confirmations/errors at top.
* **Badges** — small counts/indicators; don’t become notification surrogates.
* **Progress Indicators** — determinate (progress bar) vs indeterminate (activity spinner); prefer determinate when feasible.
* **Toasts** (custom) — keep brief and non‑modal; ensure VoiceOver announcements.

#### 8.6 Media & Maps

* **Players** — system playback controls; support Picture‑in‑Picture.
* **Map annotations/callouts** — use standard pin styles; keep callouts concise.

#### 8.7 System Surfaces (Liquid Glass)

* **Bars & ornaments** (nav, tab, toolbars) can use **Liquid Glass** materials and scroll‑edge effects. Maintain contrast over dynamic wallpapers.
* **App icons**: layered, tinted, and clear variants. Provide required layers and masks; test in light/dark.

### 9) Do / Don’t (iOS quick hits)

* **Do**: Use semantic colors and Dynamic Type; test with Reduce Motion/Transparency.
* **Do**: Keep menus short; use sheets instead of stacked modals.
* **Don’t**: Place primary actions in overflow menus; rely solely on color to convey state; disable the back gesture without cause.

---

## Part B — Google Material Design 3 (Material You / M3)

### 1) Principles

* **Expressive** — color, type, and motion convey brand and intent.
* **Adaptive** — responsive across window size classes (phones → desktop).
* **Accessible** — explicit state layers, large touch targets, clear motion.

### 2) Layout & Grid

* **8 dp** base grid; spacers are multiples of 8.
* **Breakpoints** (common): xs <600, sm 600–904, md 905–1239, lg 1240–1439, xl ≥1440 (tune per platform).
* **Density**: Provide comfortable/compact density tokens where supported.

### 3) Color System (Material You)

* **Dynamic color**: palettes derived from user wallpaper/seed color.
* **Roles**: **primary, secondary, tertiary, error, surface, surfaceContainer**, etc.
* **State layers**: hovered, focused, pressed, dragged, disabled; use correct opacity overlays.

### 4) Typography

* **Type scale**: Display/Headline/Title/Body/Label with weight variants.
* **Defaults**: Roboto/Noto (Android), but system fonts per platform are fine; map to roles via tokens.

### 5) Elevation & Surfaces

* **Elevation** via shadows + tonal color; **surface containers** express depth.
* Prefer **low elevation** by default; use higher elevation for transient overlays.

### 6) Interaction & Motion

* **Easing**: Standard in/out curves; keep durations short and contextual.
* **Gestures**: Support back, pull, swipe, drag where platform‑appropriate.

### 7) Accessibility

* **Touch target**: **≥48×48 dp** (min).
* **Contrast**: Text 4.5:1 (normal), 3:1 (large); verify on dynamic color.
* **Focus**: Visible focus ring (keyboard/TV); maintain logical tab order.

### 8) Component Catalog (Material 3)

> Organized by purpose. Prefer platform libraries (Compose, Flutter, Web) that implement the spec.

#### 8.1 Actions

* **Buttons**

  * Styles: **Filled**, **Filled Tonal**, **Elevated**, **Outlined**, **Text**. Optional **leading icon**.
  * **Icon buttons**: standard, filled, filled tonal, outlined; toggle variants.
  * **Segmented buttons**: single‑select or multi‑select groupings.
  * **Floating Action Button (FAB)**: primary action; sizes **Small / Regular / Large**; **Extended FAB** with label.
* **Chips**

  * Types: **Assist**, **Filter**, **Input**, **Suggestion**.
  * Behaviors: removable (input), selectable (filter), action (assist), recommendation (suggestion).
* **Badges** — status/count markers attached to icons or list items.

#### 8.2 Navigation

* **Top app bar** — small, center‑aligned, or large; actions at end; optional search.
* **Bottom app bar** — anchors FAB and primary actions at bottom.
* **Navigation bar** — bottom destinations (3–5) with labels and active indicator.
* **Navigation rail** — vertical destinations for medium+ widths; may host FAB.
* **Navigation drawer** — (standard or modal) for large/information‑dense apps; avoid for shallow hierarchies.
* **Tabs** — organize peer content; use content‑aware indicators.

#### 8.3 Containment & Content

* **Cards** — **Elevated**, **Filled**, **Outlined**; sections of related content/actions.
* **Lists** — one‑line/two‑line/three‑line with leading/trailing elements; support swipe, reorder, selection.
* **Tables (Data tables)** — sortable columns, bulk actions, density modes.
* **Banners** — prominent in‑flow messages with actions.
* **Bottom sheets** — **Modal** (task-focused) and **Standard** (in‑context); support drag to expand/collapse.
* **Side sheets** — supplemental, context-preserving surfaces on larger screens.

#### 8.4 Input & Selection

* **Text fields** — filled or outlined; labels, helper/error text; leading/trailing icons; validation states.
* **Date/Time pickers** — mobile‑optimized calendar/clock; range selection.
* **Menus** — cascaded or simple; include icons and shortcuts when helpful.
* **Selection controls** — **Checkbox**, **Radio**, **Switch**; clear labels and group legends.
* **Sliders** — single range or range (two thumbs); discrete steps if needed.
* **Steppers** (platform-specific) — numeric increments.
* **Autocomplete** — chips/tokens for multi‑select; keyboard and touch friendly.

#### 8.5 Feedback & Communication

* **Dialogs** — alert, simple, confirmation, and full‑screen; avoid stacking.
* **Snackbars** — brief, unobtrusive confirmations/errors with one optional action.
* **Progress** — **Linear** and **Circular**; determinate preferred; keep indeterminate subtle.
* **Tooltips** — brief labels for unlabeled icons (desktop/large screens & long‑press on touch).

#### 8.6 Media & Imagery

* **Avatars** — image, initials, or icon; sizes S/M/L.
* **Chips for input** — represent people/tags with avatars and clear remove affordance.
* **Image lists** — grids with captions/metadata.

### 9) Do / Don’t (Material quick hits)

* **Do**: Use dynamic color tokens; keep 48 dp targets; show visible focus; use nav bar or rail for primary destinations.
* **Do**: Keep dialogs lean; prefer sheets for contextual tasks; ensure motion has purpose.
* **Don’t**: Hide critical actions in overflow; overuse elevation; misuse drawers for shallow IA.

---

## Appendix — Cross‑System Mapping (Fast Reference)

| Pattern            | iOS (HIG)                              | Material 3                     |
| ------------------ | -------------------------------------- | ------------------------------ |
| Primary navigation | Tab Bar / Sidebar                      | Navigation Bar / Rail / Drawer |
| Primary action     | Prominent Button / FAB‑like button     | FAB / Filled Button            |
| Transient choices  | Action Sheet / Menu                    | Bottom Sheet / Menu / Dialog   |
| Lists              | Table/List (grouped)                   | List (1–3 line)                |
| Theme              | Semantic colors + materials            | Dynamic color roles + tokens   |
| Typography         | SF + Dynamic Type                      | Type scale (Display→Label)     |
| Motion             | Springy, subtle, respect Reduce Motion | Standard curves, state layers  |
| Touch target       | ≥44×44 pt                              | ≥48×48 dp                      |

---

## Implementation Checklist (for Design System Rollout)

1. **Tokenize** spacing, radius, elevation, typography, color roles (both ecosystems).
2. **Build kits**: iOS (SwiftUI/UIKit), Android (Compose + MDC), Web (Material Web).
3. **Audit components**: identify custom vs system; replace where possible.
4. **Accessibility gates**: color contrast, focus order, screen reader labels, hit targets.
5. **Motion policy**: durations/easings, reduced‑motion fallbacks.
6. **Iconography**: SF Symbols on Apple; Material Symbols on Android/Web; map shared metaphors.
7. **Theming**: Liquid Glass usage on Apple; dynamic color palettes on Material.
8. **QA matrices**: light/dark, locales (LTR/RTL), Dynamic Type/Font Scale, size classes/breakpoints, offline/error states.
9. **Content design**: tone tables, empty/error states, loading skeletons.
10. **Docs site**: publish these guidelines + live coded examples & do/don’t.

---

*End of guidelines.*
