# Issue #108 UI evidence

Every scenario has one frozen-base capture in `before/` and one exact product
state capture in `after/`. The manifest binds each pair to the same scenario,
route, and viewport for mechanical validation.

| Scenario | Route | Viewport | Evidence |
| --- | --- | --- | --- |
| `root-language` | `/` | 1440×900, light | The editorial language picker becomes an automatic redirect to `/en/`. |
| `guide-introduction-pagination-footer` | `/en/guide/introduction/` | 1440×900, light | Previous/next navigation and the visible license/copyright footer are restored. |
| `guide-about-wechat` | `/en/guide/about/` | 1440×900, dark | The About route regains its WeChat option and shipped QR image. |
| `guide-mobile-navigation` | `/zh/guide/introduction/` | 390×844, dark | The localized mobile section navigation opens with its expanded state. |
| `guide-locale-switch` | `/en/guide/introduction/` | 1440×900, light | The locale switch opens from the desktop header. |
| `guide-theme-switch` | `/en/guide/introduction/` | 1440×900, light→dark | The theme control applies the dark document theme. |
| `guide-edit-link` | `/en/guide/introduction/` | 1440×900, light | The page-level GitHub edit control is visible. |
| `controller-button-code-copy` | `/zh/component/button/` | 390×844, light | Preview/Code switching and the localized source-copy success state are present. |
| `controller-button-keyboard-reduced-motion` | `/en/component/button/` | 1440×900, light, reduced motion | Arrow-key tab focus is visible while reduced-motion emulation is active. |
| `controller-knob-responsive` | `/en/component/knob/` | 390×844, dark | The complete Knob variant matrix fits without horizontal overflow. |
| `visualization-spectrogram-links` | `/zh/component/spectrogram/` | 1440×900, light | Visualization variants render and the Links menu exposes GitHub, Discord, and Twitter. |
| `hook-use-player-audio` | `/en/hook/usePlayer/` | 1440×900, dark | A real-audio action exposes the Hook demo’s runtime state and lifecycle UI. |

The before images were captured from frozen base
`9eea05360a90e46a4c66c2e821e9ad5bd6c71c67`. The after images were freshly
captured from the repaired product at commit
`7aa9454f8a5da1cb5045864fdf1b7350744ae8df` after `pnpm verify` completed.
The evidence commit only reorganizes these PNGs; it does not change the rendered
product state they record.

Deterministic non-image checks complement the captures:

- `tests/docs-rendered-visual-contract.test.ts` renders the five maintained
  baseline categories across both locales, desktop/mobile, and light/dark (40
  cases).
- `tests/docs-example-frame.test.tsx` verifies arrow-key focus behavior, the
  polite copy-status announcement, and Preview/Code semantics.
- `tests/docs-parity.test.ts` verifies the reduced-motion CSS override,
  navigation destinations, edit/pagination/footer controls, root behavior, and
  content inventories.
