# Issue #108 UI evidence

Every scenario has one frozen-base capture in `before/` and one exact product
state capture in `after/`. The manifest binds each pair to the same scenario,
route, and viewport for mechanical validation.

| Scenario | Route | Viewport | Evidence |
| --- | --- | --- | --- |
| `root-language` | `/` | 1440×900 | The root route resolves to the English documentation experience. |
| `guide-introduction-pagination-footer` | `/en/guide/introduction/` | 1440×900 | Previous/next navigation and the visible license/copyright footer are restored. |
| `guide-about-wechat` | `/en/guide/about/` | 1440×900 | The About route regains its WeChat option and shipped QR image. |
| `guide-mobile-navigation` | `/zh/guide/introduction/` | 390×844 | The localized mobile section navigation opens with its expanded state. |
| `guide-locale-switch` | `/en/guide/introduction/` | 1440×900 | The locale switch opens from the desktop header. |
| `guide-theme-switch` | `/en/guide/introduction/` | 1440×900 | The theme menu exposes light, dark, and system choices. |
| `guide-edit-link` | `/en/guide/introduction/` | 1440×900 | The page-level GitHub edit control is visible. |
| `controller-button-code-copy` | `/zh/component/button/` | 390×844 | The controlled Button group’s code tab and copy control are visible. |
| `controller-button-keyboard-reduced-motion` | `/en/component/button/` | 1440×900 | The controlled waveform selection visibly updates to Triangle. |
| `controller-knob-responsive` | `/en/component/knob/` | 390×844 | The distinct 360°, 270°, and 180° variants fit without horizontal overflow. |
| `visualization-spectrogram-links` | `/zh/component/spectrogram/` | 1440×900 | The real three-band EQ3 example reaches its live Playing state. |
| `hook-use-player-audio` | `/en/hook/usePlayer/` | 1440×900 | A real-audio action exposes the Hook demo’s running state and progress UI. |

The before images were captured from frozen base
`9eea05360a90e46a4c66c2e821e9ad5bd6c71c67`. The after images were freshly
captured from the repaired product at commit
`bf27c3d1f05d80898f7d7932a901cc3c716e02df` after `pnpm verify` completed.
The evidence commit binds the refreshed PNGs and run metadata; it does not
change the rendered product state they record.

Deterministic non-image checks complement the captures:

- `tests/docs-rendered-visual-contract.test.ts` renders the five maintained
  baseline categories across both locales, desktop/mobile, and light/dark (40
  cases).
- `tests/docs-example-frame.test.tsx` verifies arrow-key focus behavior, the
  polite copy-status announcement, and Preview/Code semantics.
- `tests/docs-parity.test.ts` verifies the reduced-motion CSS override,
  navigation destinations, edit/pagination/footer controls, root behavior, and
  content inventories.
