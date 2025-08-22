# Company Design System — Baseline (2025)

**Applies to:** iOS 26+ (Apple HIG / Liquid Glass), Android (Material Design 3), Web (Material UI / MUI v5+).
**Goal:** Single source of truth for tokens, components, patterns, accessibility, and code mappings.

> Replace `COMPANY_NAME` and token values to brand this system. All samples are production‑ready defaults.

---

## 0. Governance & Repo Layout

```
repo/
  docs/                     # This guideline (MD) + site (Docusaurus/Next.js)
  tokens/                   # Style Dictionary tokens (JSON)
  packages/
    web-theme/              # MUI theme + component overrides
    ios-theme/              # SwiftUI Color assets + helper API
    android-theme/          # Compose colorScheme + typography
    icons/                  # SF Symbols & Material Symbols mapping
  components/
    web/                    # React + MUI wrappers
    ios/                    # SwiftUI components
    android/                # Compose components
  tooling/
    style-dictionary/       # Build scripts for token exports
    lint/                   # ESLint/SwiftLint/ktlint configs
```

**Release policy:** semantic versioning: **tokens** (minor = additive, major = breaking), **components** (patch = bugfix, minor = non‑breaking feature, major = breaking).
**Accessibility gates:** no ship if color contrast < 4.5:1, missing labels/traits, or focus traps.

---

## 1. Design Tokens (Platform‑agnostic)

> Managed with Style Dictionary. Values shown are **starter defaults**; swap to brand values.

### 1.1 Color Roles

```json
{
  "color": {
    "brand": {
      "primary": { "value": "#335CFF" },
      "onPrimary": { "value": "#FFFFFF" },
      "secondary": { "value": "#6B8AFF" },
      "tertiary":  { "value": "#00BFA5" },
      "error":     { "value": "#D14343" }
    },
    "neutral": {
      "0":   { "value": "#FFFFFF" },
      "10":  { "value": "#F6F7F9" },
      "50":  { "value": "#EBEEF5" },
      "100": { "value": "#DDE3EE" },
      "200": { "value": "#C7D0E0" },
      "300": { "value": "#AFB9CF" },
      "400": { "value": "#97A1BE" },
      "500": { "value": "#7E8AAD" },
      "700": { "value": "#4A5568" },
      "900": { "value": "#1A202C" }
    },
    "surface": {
      "bg":         { "value": "{color.neutral.0.value}" },
      "bgVariant":  { "value": "{color.neutral.10.value}" },
      "onSurface":  { "value": "#111418" },
      "onVariant":  { "value": "#2B303A" }
    },
    "state": {
      "success": { "value": "#17A34A" },
      "warning": { "value": "#D97706" },
      "info":    { "value": "#0284C7" }
    }
  }
}
```

### 1.2 Typography

```json
{
  "typography": {
    "fontFamily": { "value": "Inter, system-ui, -apple-system, Segoe UI, Roboto, Noto, sans-serif" },
    "sf": { "value": "SF Pro Text, -apple-system, system-ui, Helvetica Neue, Arial" },
    "roboto": { "value": "Roboto, Noto, system-ui" },
    "scale": {
      "display": { "size": { "value": "57" }, "weight": { "value": "700" }, "line": { "value": "64" } },
      "headline":{ "size": { "value": "32" }, "weight": { "value": "700" }, "line": { "value": "40" } },
      "title":   { "size": { "value": "22" }, "weight": { "value": "600" }, "line": { "value": "28" } },
      "body":    { "size": { "value": "16" }, "weight": { "value": "400" }, "line": { "value": "24" } },
      "label":   { "size": { "value": "14" }, "weight": { "value": "600" }, "line": { "value": "20" } }
    }
  }
}
```

### 1.3 Spacing, Radius, Elevation, Motion, Opacity

```json
{
  "space":  { "xs": {"value":"4"},  "sm": {"value":"8"},  "md": {"value":"16"}, "lg": {"value":"24"}, "xl": {"value":"32"} },
  "radius": { "sm": {"value":"4"},  "md": {"value":"8"},  "lg": {"value":"16"}, "xl": {"value":"24"}, "pill": {"value":"999"} },
  "elevation": {
    "0": { "shadow": {"value":"none"} },
    "1": { "shadow": {"value":"0 1px 2px rgba(0,0,0,.08)"} },
    "2": { "shadow": {"value":"0 2px 8px rgba(0,0,0,.10)"} },
    "3": { "shadow": {"value":"0 8px 24px rgba(0,0,0,.12)"} }
  },
  "motion": {
    "duration": { "fast": {"value":"100ms"}, "std": {"value":"200ms"}, "slow": {"value":"300ms"} },
    "curve":    { "enter": {"value":"cubic-bezier(.2,0,0,1)"}, "exit": {"value":"cubic-bezier(.4,0,1,1)"} }
  },
  "opacity": { "disabled": {"value":"0.38"}, "focus": {"value":"0.12"} }
}
```

**Accessibility baselines**: color contrast ≥ 4.5:1 (text) / 3:1 (large text & UI), touch targets **iOS ≥ 44×44 pt**, **Material ≥ 48×48 dp**.

---

## 2. Platform Mappings

### 2.1 iOS 26+ (SwiftUI)

* **Colors**: Export tokens to `xcassets` named colors (e.g., `Primary`, `OnPrimary`, `SurfaceBG`).
* **Typography**: Use Dynamic Type via `Font` styles; map token sizes to `.title`, `.body`, etc.
* **Haptics**: `UINotificationFeedbackGenerator` for success/warning/error.

```swift
import SwiftUI

struct Theme {
  static let primary = Color("Primary")
  static let surfaceBG = Color("SurfaceBG")
}

struct PrimaryButtonStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.system(size: 16, weight: .semibold))
      .padding(.vertical, 12).padding(.horizontal, 16)
      .background(Theme.primary)
      .foregroundColor(.white)
      .cornerRadius(8)
      .opacity(configuration.isPressed ? 0.9 : 1)
  }
}
```

### 2.2 Android (Compose, M3)

```kotlin
val AppLightColors = lightColorScheme(
  primary = Color(0xFF335CFF),
  onPrimary = Color.White,
  secondary = Color(0xFF6B8AFF),
  error = Color(0xFFD14343),
  background = Color(0xFFFFFFFF),
  onBackground = Color(0xFF111418),
)

@Composable
fun AppTheme(content: @Composable () -> Unit) {
  MaterialTheme(
    colorScheme = AppLightColors,
    typography = Typography(),
    content = content
  )
}
```

### 2.3 Web (React + MUI)

```ts
// packages/web-theme/src/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  spacing: 8,
  shape: { borderRadius: 8 },
  palette: {
    mode: 'light',
    primary: { main: '#335CFF' },
    secondary: { main: '#6B8AFF' },
    error: { main: '#D14343' },
    background: { default: '#FFFFFF', paper: '#F6F7F9' }
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } }
    }
  }
});
```

---

## 3. Component Specifications (Cross‑platform)

Each spec defines **Purpose • Anatomy • Variants • States • Behavior • Accessibility • Tokens • Content**.

### 3.1 Buttons

* **Purpose:** Trigger primary/secondary actions.
* **Variants:** Primary (filled), Secondary (outlined/tonal), Tertiary (text), Destructive, Icon‑only, Segmented.
* **States:** default, hover/focus (Web), pressed, disabled, loading.
* **Behavior:** One clear action per primary button; avoid multiple primaries on a screen.
* **Accessibility:** Name/role/value set; loading has `aria-busy` (Web); VoiceOver label includes context.
* **Tokens:** color.brand.primary, radius.md, space.md, typography.label.
* **iOS:** `.buttonStyle(.borderedProminent)` or custom style above.
* **Android:** `Button`, `FilledTonalButton`, `OutlinedButton`.
* **Web/MUI:** `Button variant="contained|outlined|text"`.

### 3.2 Floating Action Button (FAB) / Prominent Action

* **Purpose:** Promote a single, frequent primary action.
* **Variants:** Small/Regular/Large/Extended (with label).
* **Placement:** Bottom‑right (Web/Android); iOS uses prominent primary button within content/toolbars rather than FAB conventionally.

### 3.3 App Bars / Navigation Bars / Toolbars

* **Purpose:** Display screen titles and actions.
* **iOS:** Large Title at root; standard deeper; scroll‑edge behavior; Liquid Glass materials.
* **Android/Web:** Small/Center‑aligned/Large Top App Bars; action icons on end.
* **Tokens:** elevation.0–2, surface roles, typography.title.

### 3.4 Navigation

* **Tabs:** 2–5 top‑level destinations; text labels required.
* **Bottom Navigation (Material):** Labeled icons; active indicator.
* **Navigation Rail/Drawer:** For medium+ widths or deep IA.
* **iOS Sidebar/Split View:** Primary navigation on larger screens.

### 3.5 Lists & Tables

* **Lists:** One/two/three‑line; leading/trailing content; swipe actions; multi‑select.
* **Tables (Web):** Sortable headers, sticky header, bulk actions; density modes.

### 3.6 Cards

* **Purpose:** Group related content/actions.
* **Variants:** Elevated, Filled, Outlined.

### 3.7 Text Fields & Forms

* **Fields:** Filled/Outlined (Material), Plain with labels (iOS). Helper and error text.
* **Validation:** Real‑time where safe; otherwise on blur/submit; announce errors.
* **Specialized:** Search, Password (toggle visibility), Multiline, Autocomplete.

### 3.8 Selection Controls

* **Checkbox / Radio / Switch:** Clear labels, group with legends; accessible state descriptions.

### 3.9 Pickers

* **Date/Time:** Inline/mobile optimized; ranges; locale aware.
* **Menus:** Cascading or simple; keyboard and touch friendly; keep lists short.

### 3.10 Feedback

* **Dialogs/Alerts:** Single clear decision; avoid stacking; include Cancel where destructive.
* **Sheets:** Bottom (standard/modal) for contextual tasks.
* **Snackbars/Toasts/Banners:** Brief, non‑blocking; at most one action.
* **Progress:** Determinate when possible; otherwise subtle indeterminate.

### 3.11 Media & Avatars

* **Avatars:** Image/initials/icon; S/M/L; accessible alt text.
* **Image lists & galleries:** Lazy‑load; keyboard navigable.

### 3.12 Chips & Pills

* **Types:** Assist, Filter, Input, Suggestion; removable affordance on input chips.

### 3.13 Pagination & Tables Extras

* **Pagination:** Visible page size control; keyboard operable.
* **Data density:** Comfortable/Compact toggles.

### 3.14 Tooltips & Help

* **Tooltips:** Desktop/large screens; not a substitute for labels; delay \~300ms.

### 3.15 Toasts & Banners

* **Use:** Confirmation or low severity issues; auto‑dismiss with accessible live region.

### 3.16 Maps & Location

* **Pins/Annotations:** Consistent color mapping; clustered at high densities; voice labels.

### 3.17 Search & Filters

* **Search:** Debounced input; recent searches; keyboard shortcuts (⌘K / Ctrl K) on Web.
* **Filters:** Segmented controls or chips; expose active filters as tokens.

### 3.18 Skeletons & Empty States

* **Skeletons:** For content placeholders < 1s–3s; otherwise show progress bar.
* **Empty states:** Explain value, show next action, avoid blame.

### 3.19 Errors & Offline

* **Inline errors:** Next to the field; concise fix guidance.
* **Global errors:** Banner/dialog with retry.
* **Offline:** Show persistent indicator and queued actions policy.

---

## 4. Accessibility & Internationalization

* **Targets:** iOS ≥44×44pt, Material/Web ≥48×48dp/px.
* **Contrast:** 4.5:1 text min; 3:1 large text/UI.
* **Focus:** Clear ring (Web), logical order, skip links; no keyboard traps.
* **Screen readers:** Role/name/value; announce state changes; `aria-live` for toasts.
* **Motion:** Provide Reduced Motion fallbacks; avoid parallax.
* **RTL:** Support bidirectional layouts; mirror icons where appropriate.

---

## 5. Motion & Haptics

* **Durations:** fast 100ms, std 200ms, slow 300ms.
* **Curves:** enter `(0.2,0,0,1)`, exit `(0.4,0,1,1)`; iOS spring for push/pop.
* **Haptics (iOS):** light for success, warning, error; avoid overuse.

---

## 6. Content & Microcopy

* **Tone:** Clear, concise, action‑oriented. Avoid internal jargon in user‑facing text.
* **Buttons:** Imperative verbs (Save, Send, Continue). One primary per view.
* **Errors:** State what happened, why it matters, how to fix.
* **Placeholders vs labels:** Never replace labels with placeholders.

---

## 7. Code Examples (Quick Start)

### 7.1 Web (MUI) — Button, TextField

```tsx
import { ThemeProvider, Button, TextField } from '@mui/material';
import { theme } from '@company/web-theme';

export default function Screen() {
  return (
    <ThemeProvider theme={theme}>
      <Button variant="contained">Primary</Button>
      <TextField label="Email" type="email" helperText="We'll never share it" />
    </ThemeProvider>
  );
}
```

### 7.2 iOS (SwiftUI) — Form Field

```swift
struct EmailField: View {
  @Binding var email: String
  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      Text("Email").font(.footnote).foregroundColor(.secondary)
      TextField("name@example.com", text: $email)
        .textContentType(.emailA
```
