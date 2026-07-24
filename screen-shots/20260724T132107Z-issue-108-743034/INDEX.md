# Issue #108 UI evidence

The route-specific `before-*` captures were rendered from the frozen base SHA `9eea05360a90e46a4c66c2e821e9ad5bd6c71c67`. The `after-*` captures were rendered from this implementation after `pnpm build:docs`. The two `before-migration-preview-*` files are preserved historical migration previews; they are context only and are not treated as Island baselines.

## Focused before/after comparisons

| Category | Before | After | Route | Locale | Theme | Viewport | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home/root | `before-root-language-picker-en-light-desktop.png` | `after-root-redirect-en-light-desktop.png` | `/` → `/en/` | English | Light | 1440×900 | The frozen-base editorial language picker is replaced by a verified direct redirect into the Island home. |
| Guide | `before-introduction-en-light-desktop.png` | `after-introduction-en-light-desktop-edit.png` | `/en/guide/introduction/` | English | Light | Neutral callout, compact feature-list rhythm, Guide/About grouping, and visible edit link. |
| Controller | `before-button-zh-light-mobile.png` | `after-button-zh-light-mobile-code-copy.png` | `/zh/component/button/` | Chinese | Light | 390×844 | Complete live variant matrix plus adjacent localized Code tab and successful copy state. |
| Visualization | `before-spectrogram-zh-light-desktop.png` | `after-spectrogram-zh-light-desktop-links.png` | `/zh/component/spectrogram/` | Chinese | Light | 1440×900 | Restored visualization variants and exact GitHub/Discord/Twitter Links menu. |
| Hook | `before-use-player-en-dark-desktop.png` | `after-use-player-en-dark-desktop-audio.png` | `/en/hook/usePlayer/` | English | Dark | 1440×900 | Rich real-audio demo, status, lifecycle, and error guidance remain available. |

## Additional after-state interaction evidence

| Capture | Route | Locale | Theme | Viewport | Interaction or acceptance criterion |
| --- | --- | --- | --- | --- | --- |
| `after-introduction-zh-dark-mobile-nav.png` | `/zh/guide/introduction/` | Chinese | Dark | 390×844 | Mobile section-navigation control expanded with `aria-expanded="true"`. |
| `after-about-en-dark-desktop-wechat.png` | `/en/guide/about/` | English | Dark | 1440×900 | Restored WeChat choice and shipped QR asset. |
| `after-knob-en-dark-mobile.png` | `/en/component/knob/` | English | Dark | 390×844 | Responsive controller variant matrix without horizontal overflow. |
| `after-introduction-en-light-desktop-pagination-footer.png` | `/en/guide/introduction/` | English | Light | 1440×900 | Visible next-page navigation and unobscured MIT license/copyright footer. |
| `after-introduction-en-light-desktop-edit.png` | `/en/guide/introduction/` | English | Light | 1440×900 | Visible “Edit this page on GitHub” control in the desktop outline. |
| `after-locale-switch-en-light-desktop.png` | `/en/guide/introduction/` | English | Light | 1440×900 | Locale switch opened from the header. |
| `after-theme-switch-en-dark-desktop.png` | `/en/guide/introduction/` | English | Dark | 1440×900 | Theme switch changed the rendered document to dark mode. |

## Deterministic coverage and observations

`node scripts/verify-docs-ui.mjs` exercises English and Chinese at 1440×900 and 390×844 in light and dark themes. It checks representative home, guide, controller, visualization, and Hook routes, then all 15 component routes. The final run passed 120 component and 8 localized-home checks, including shell geometry, visible desktop edit controls, previous/next navigation, footer behavior, route markers, and horizontal overflow.

The after root capture starts navigation at `/`; the evidence generator asserts that the final browser pathname is `/en/` before writing the PNG. `node scripts/verify-nextra-output.mjs` also checks the exported root's canonical link, meta redirect, and JavaScript redirect.

The Preview/Code control uses an ARIA tablist. Keyboard verification covers ArrowLeft, ArrowRight, Home, and End focus/selection behavior, while `:focus-visible` supplies a two-pixel brand outline for tabs and the copy control. Copy success is announced through a polite status region. Under `prefers-reduced-motion: reduce`, tab and copy-control transitions are removed.

The checked-in maintained visual contract is `docs/visual-baselines/island-v1.json`, sourced from the preserved Island revision `86f2008^`. The PNGs in this folder are review evidence; the JSON contract and browser verifier are the deterministic regression gate.
