# Island → Nextra parity matrix

This matrix is the maintained contract for reproducing the established Island documentation in Nextra. The preserved Island source/build at git revision `86f2008^` and `https://echoui.dev/en/` are the presentation and content references. The current package source and declarations remain authoritative for Echo UI 1.1.x API facts.

## Shell, navigation, and content

| Surface | Island contract | Nextra implementation | Deterministic coverage |
| --- | --- | --- | --- |
| Root route | `/` enters the default English documentation without an editorial picker. | The static root permanently redirects to `/en/`. | Route/content inventory and static-export smoke test. |
| Desktop shell | Fixed 60 px header, 272 px sidebar, 704 px article, right-hand outline. | Island theme tokens and geometry are retained at 1440 × 900. | `island-v1.json` desktop light/dark profiles. |
| Mobile shell | 56 px header, a separate 48 px section-menu row, off-canvas navigation, single-column content. | `IslandMobileMenu` controls the Nextra mobile navigation with expanded state and focus-visible styling. | `island-v1.json` mobile light/dark profiles at 390 × 844. |
| Locales and themes | English and Chinese share the route hierarchy; light and dark retain the same geometry. | Every representative baseline route is exercised in `en`/`zh`, light/dark, desktop/mobile. | 16 locale/profile/category combinations per category in `verify-docs-ui.mjs`. |
| Header links | Links contains GitHub, Discord, and Twitter. | The exact three Island destinations are restored. | Content inventory plus interactive UI verification. |
| Guide sidebar | A `Guide` section contains Introduction, Installation, and Declaration; `About` is separated. | Locale-specific Nextra metadata uses Guide/About separators. | Content inventory and rendered sidebar assertions. |
| Page affordances | Edit link, last-updated metadata, previous/next navigation, and footer are visible. | Nextra edit/navigation defaults are restored; the footer contains the MIT license and copyright. | Static output and UI assertions. |
| External prose links | Brand-colored Island link treatment without an appended arrow glyph. | Nextra's external-link icon is hidden in article prose while external semantics remain intact. | Visual baseline assertion. |
| Callouts | Neutral bordered panel without blue info chrome. | Nextra callouts use the Island background, border, color, spacing, and no decorative icon. | Guide baseline assertion. |
| Introduction | Five compact feature bullets under one Features heading. | Updated factual copy retains the five-item list rhythm and avoids five H3 sections. | Bilingual content inventory. |
| Installation | A four-step installation story. | Requirements/compatibility, package installation, Tailwind configuration, then import/render form the four primary steps. | Bilingual content inventory; Tailwind compatibility verifier. |
| About | Project contacts plus Discord and WeChat community choices. | The shipped `/wechat.jpg` QR image and WeChat option are restored in both locales. | Bilingual content inventory and asset smoke test. |
| Declaration | Copy promises the edit affordance that the shell actually provides. | The page-level edit link is enabled and the bilingual declaration copy agrees. | Bilingual content inventory and rendered edit-link check. |

## Component examples

Every entry below is a live rendered preview with an adjacent Preview/Code tab and copy action. There are no intentionally omitted Island variants.

| Component | Required live variants | Count |
| --- | --- | --: |
| Button | Default; Toggle State; Disabled State; Size; Rounded Corners; Button Group | 6 |
| Checkbox | Default; Disabled State; Size; Color; Checkbox Group | 5 |
| Envelope | ADSR Envelope; AHDSR Envelope; Delay/DADSR | 3 |
| Input | Default; Disabled State; Bilateral Mode; Text Mode; Size; Rounded Corners; Progress Bar Color; Minimum and Maximum Values; Step and Sensitivity | 9 |
| Knob | Default; Disabled; Bilateral Rotation Mode; Rotation Angle Range; Labels; Step and Sensitivity; Size-Related; Color-Related; Knob Group | 9 |
| Radio | Default; Disabled State; Size; Color; Radio Group | 5 |
| Slider | Default; Disabled State; Vertical Mode; Bilateral Mode; Adding Coordinates; Step; Custom Styling; Uncontrolled Mode | 8 |
| Switch | Default; Toggled State; Disabled State; Size; Custom Styling | 5 |
| LFO | Default; Delay | 2 |
| Light | Default; On State; Light Color; Size | 4 |
| Oscilloscope | Default | 1 |
| Spectrogram | Audio Data; Axis; Grid; Use Case: EQ3 | 4 |
| VU Meter | Default; Horizontal Mode; Stereo Mode; Compact Mode; Number of Volume Bars; Custom Colors | 6 |
| Waveform | Default | 1 |
| Card | Default; Active State; Real-World Scenario | 3 |

The 71-variant inventory lives in one bilingual data model so labels, source, counts, and rendered examples cannot silently drift between locales. Preview/Code uses an ARIA tablist, supports arrow, Home, and End keys, keeps the active tab in the tab order, and exposes copy success/failure through a polite status. Reduced motion removes transitions. The richer Nextra real-audio/status demonstrations remain above the variant matrix and supplement it.

## API, public types, and data attributes

| Surface | Parity contract | Maintained behavior |
| --- | --- | --- |
| API hierarchy | Component/compound-component headings precede visible tables. | Generated tables remain because they cover the current public declarations. |
| Column order | Attribute / Description / Type / Default. | Both locales render that Island order; translated labels preserve the same order. |
| Public types | Inherited React attributes, compound APIs, callback payloads, exported data shapes, and limitations remain discoverable. | Generated rows plus the inherited-contract paragraph are sourced from the current package types. |
| Controller data attributes | Button, Checkbox, Input, Knob, Radio, Slider, and Switch attributes are listed. | Values and meanings are rendered beside each API. |
| Display data tags | VU Meter segment `data-active` bands and Card `data-toggled` are listed. | Values are based on the current runtime. |

The current Button runtime emits `data-disable`, not the legacy page's `data-disabled`. The docs show the actual runtime spelling because package behavior is the frozen source of truth; changing the shipped runtime solely for documentation parity is out of scope.

## Intentional modernized exceptions

- Nextra and static export remain the documentation toolchain. IslandJS, NextUI, `react-live`, and stale implementation dependencies are not restored.
- Echo UI 1.1.x compatibility remains accurate: React 18.2–19, Tailwind CSS 3/4, tailwind-variants 3.2.x, tailwind-merge 3.6.x, and Tone.js 15.1.22.
- Accessibility guidance, native fallback controls, focus-visible treatment, keyboard-operable source disclosure, reduced-motion behavior, lifecycle cleanup, and error recovery remain.
- Real Web Audio demonstrations, status text, reconnect flows, and restart-safe audio graphs remain and supplement the Island variant examples.
- Generated API tables replace copied declaration blocks where the complete current public contract is already visible.
- Nextra's search implementation, locale switch, theme switch, static route format, and last-updated source remain, styled to the Island hierarchy.

No other parity exception is approved by this matrix.
