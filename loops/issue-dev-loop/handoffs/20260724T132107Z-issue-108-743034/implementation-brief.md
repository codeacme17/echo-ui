# Implementation brief

- Run ID: `20260724T132107Z-issue-108-743034`
- Issue: #108 — docs: close the remaining Island UI and content parity gaps in Nextra
- Issue URL: https://github.com/codeacme17/echo-ui/issues/108
- Base branch: `dev`
- Base SHA: `9eea05360a90e46a4c66c2e821e9ad5bd6c71c67`
- Branch: `codex/issue-108`
- UI evidence required: yes

## Issue snapshot

## Context

This is a follow-up to #97 / #98. That work required the Nextra documentation to reproduce the established Island site exactly, with `https://echoui.dev/en/` as the visual source of truth. A fresh comparison against the current `dev` branch shows that the shell is closer, but substantial UI, information-architecture, and example-coverage differences remain.

Keep Nextra. “Parity” here means preserving the Island presentation and documentation coverage while retaining factual improvements made for Echo UI 1.1.x (React 19, Tailwind CSS 4, Tone.js 15, accessibility, lifecycle, and error guidance). It does **not** mean restoring IslandJS, NextUI, stale setup instructions, or old implementation dependencies.

## How to compare

1. Run `pnpm dev:docs`.
2. Compare the same English and Chinese routes against `https://echoui.dev/en/` and `https://echoui.dev/zh/`.
3. At minimum, inspect `/`, `/guide/introduction`, `/guide/about`, `/component/button`, `/component/knob`, `/component/spectrogram`, and `/hook/usePlayer`.
4. Compare 1440×900 and 390×844 in both light and dark themes.

## Observed differences

### 1. Site shell and navigation

| Area | Island reference | Current Nextra site |
| --- | --- | --- |
| `/` | Redirects directly to `/en` | Shows a separate editorial “Choose your documentation language” landing page |
| Links menu | GitHub, Discord, Twitter | Discussions, Issues, Discord |
| Guide sidebar | Shows a `Guide` group heading and a separated `About` group | Renders a flat four-link list |
| Contribution/navigation affordances | Exposes “Edit this page on GitHub”, last-updated metadata, and previous/next page navigation | `editLink={null}` and `navigation={false}`; only the timestamp remains |
| Footer | Island configuration contains license/copyright and page navigation metadata | The Nextra footer is mounted but globally hidden |
| External links | Plain Island link treatment | Nextra adds external-link arrow glyphs throughout prose |
| Callouts | Neutral Island bordered panel | Blue Nextra info callout with icon and different spacing/color |

There is also a content/implementation contradiction: the Declaration page says readers can use “the edit link on each page”, while the layout explicitly disables edit links.

Relevant files:

- `docs/app/[lang]/layout.tsx`
- `docs/app/[lang]/island-theme.css`
- `docs/app/(landing)/page.tsx`
- `docs/content/en/_meta.ts`
- `docs/content/zh/_meta.ts`
- `docs/content/*/guide/declaration.mdx`

### 2. Guide content and hierarchy

- Introduction feature bullets became five H3 sections. This materially changes page length, scan rhythm, and the table of contents.
- All guide copy was rewritten rather than migrated in place. Some updates are useful and should remain, but the result is not content parity with the Island reference.
- About removed the WeChat community option and QR code even though `wechat.jpg` is still shipped as a public asset.
- Installation is correctly modernized for 1.1.x, but its presentation no longer follows the four-step Island structure.
- The root language-selection page introduces a visual language that does not exist anywhere in the Island site.

### 3. Component example coverage was reduced

The Island source had 30 files under `docs/src/components/UsageBox` and `docs/src/components/Example`. The current site consolidates the documentation into a small set of shared demo files and generally renders one demo per component page.

| Component | Island examples no longer shown as equivalent live variants |
| --- | --- |
| Button | default, toggled, disabled, sizes, radii, group |
| Checkbox | default, disabled, sizes, colors, group |
| Envelope | ADSR, AHDSR, DADSR/delay |
| Input | default, disabled, bilateral, text, sizes, radii, progress color, min/max, step/sensitivity |
| Knob | default, disabled, bilateral, rotation range, labels, step/sensitivity, sizes, colors, group |
| Radio | default, disabled, sizes, colors, group |
| Slider | default, disabled, vertical, bilateral, axis, step, custom styling, uncontrolled |
| Switch | default, toggled, disabled, sizes, custom styling |
| LFO | default and delay |
| Light | default, on, colors, sizes |
| Spectrogram | default, axis, grid, EQ3 scenario |
| VU Meter | default, horizontal, stereo, compact, segment count, custom colors |
| Card | default, active, real-world scenario |

Oscilloscope and Waveform still have a live example, but they also lost the Island example affordance described below.

### 4. The example and API presentation is different

- Island gives every example a `Preview` / `Code` switch. The current demo frame has only a `Preview` label; source is no longer available beside each rendered variant.
- Current demos add useful live status and more realistic audio flows, but they replace rather than supplement the variant matrix above.
- Island API tables use `Attribute / Description / Type / Default`; current tables use `Prop / Type / Default / Description` and add a new inherited-props paragraph.
- Dedicated Data Attributes/Data Tags sections were removed from most component pages. The current docs only surface a small subset (for example VU Meter `data-active` and Card `data-toggled`).
- Full type-declaration blocks were removed in favor of generated API tables. Keep the tables if they are complete, but restore any public contract details that are no longer discoverable.
- Hook pages gained live demos, lifecycle, and error guidance; preserve those improvements while matching the Island visual hierarchy and API discoverability.

Relevant files:

- `docs/app/_components/controller-demo.tsx`
- `docs/app/_components/display-*.tsx`
- `docs/app/_components/hook-demo.tsx`
- `docs/app/_components/*-api.tsx`
- `docs/app/_components/*-docs.module.css`
- `docs/content/{en,zh}/component/*.mdx`
- `docs/content/{en,zh}/hook/*.mdx`

## Why the current regression check misses this

`scripts/verify-docs-ui.mjs` compares the current site with hand-written style constants. It does not compare the output with an Island screenshot/DOM baseline. It verifies the shell mainly through the Button route and only requires each component route to contain at least one demo, so it cannot catch reduced example coverage, changed copy/hierarchy, missing links, or changed root behavior.

The two files under `docs/screenshots/` are unreferenced migration-preview captures, not Island parity baselines.

## Acceptance criteria

- [ ] Create and document an Island → Nextra parity matrix covering shell, navigation, content hierarchy, examples, API/data-attribute coverage, and intentional modernized exceptions.
- [ ] Match the Island shell at 1440×900 and 390×844 in English/Chinese and light/dark themes, including the root-route behavior, sidebar grouping, callouts, link treatment, and page-level navigation affordances.
- [ ] Restore the Island Links destinations, edit-page affordance, previous/next navigation, and footer behavior, or explicitly document an approved product decision for each deviation.
- [ ] Fix the Declaration copy so it agrees with the actual edit-link behavior.
- [ ] Give every Island component variant an equivalent live preview and adjacent copyable source, unless its removal is explicitly approved in the parity matrix.
- [ ] Restore missing Data Attributes/Data Tags and public type/API details.
- [ ] Preserve the current 1.1.x installation, Tone.js 15, accessibility, lifecycle, error-handling, and real-audio-demo improvements.
- [ ] Replace the current style-constant-only check with maintained Island visual baselines (or an equivalent deterministic comparison) for representative guide, controller, visualization, Hook, and home routes.
- [ ] Add content-inventory assertions for example labels/counts, Links destinations, edit/pagination controls, root behavior, and both locales.
- [ ] `pnpm lint`, `pnpm typecheck:docs`, `pnpm build:docs`, and `pnpm test:docs` pass.

## Out of scope

- Reintroducing IslandJS, NextUI, or `react-live`
- Reverting accurate Echo UI 1.1.x compatibility and API information
- Removing accessibility or real Web Audio improvements solely to obtain pixel parity


## Frozen implementation contract

### Acceptance criteria

1. Add a maintained Island → Nextra parity matrix that covers:
   - root-route behavior;
   - desktop and mobile shell/navigation;
   - both locales and both color schemes;
   - guide hierarchy and content exceptions;
   - component example labels/counts;
   - Preview/Code behavior;
   - API, public type, and data-attribute coverage;
   - every intentional modernized exception.
2. Make `/` follow the Island language-routing behavior instead of presenting a
   separate editorial language picker.
3. Match the Island shell on the required representative routes at 1440×900 and
   390×844 in English and Chinese, light and dark:
   - preserve the Island header and mobile-menu hierarchy;
   - restore the Links destinations (GitHub, Discord, Twitter);
   - restore Guide/About sidebar grouping;
   - restore edit-page, last-updated, previous/next, and visible footer behavior;
   - use Island-like external-link and callout treatments.
4. Reconcile Declaration copy with the restored edit-page affordance.
5. Restore the Island guide hierarchy and essential content, including the
   Introduction feature list rhythm and the About WeChat option/QR image, while
   retaining accurate Echo UI 1.1.x installation and compatibility guidance.
6. Give every component variant listed in the issue snapshot an equivalent live
   preview and adjacent copyable source. A deliberately omitted variant must be
   named and justified in the parity matrix.
7. Preserve the richer real-audio, status, accessibility, lifecycle, and error
   handling added by the Nextra migration; these supplement rather than replace
   the Island variant matrix.
8. Restore discoverable Data Attributes/Data Tags and public API/type details.
   Generated tables may remain when complete, but their visible column order and
   hierarchy must follow the Island contract where parity is expected.
9. Replace the style-constant-only regression coverage with deterministic,
   maintained Island visual baselines (or an equivalent deterministic screenshot
   comparison) for home, guide, controller, visualization, and Hook categories.
10. Add content-inventory assertions for both locales covering example
    labels/counts, Links destinations, root behavior, edit/pagination/footer
    controls, guide grouping, and representative API/data-attribute details.
11. `pnpm lint`, `pnpm typecheck:docs`, `pnpm build:docs`, `pnpm test:docs`, and
    the full `pnpm verify` pass.

### In scope

- `docs/app/**`, `docs/content/{en,zh}/**`, and documentation-only styles/assets.
- Shared documentation demo/source/API components.
- Documentation route, content-inventory, and visual-parity verification scripts
  and tests.
- Documentation of the parity matrix and intentionally retained modern behavior.
- Test fixtures/baselines that are deterministic and checked into the repository.

### Out of scope

- Reintroducing IslandJS, NextUI, or `react-live`.
- Reverting React 19, Tailwind CSS 4, Tone.js 15, accessibility, lifecycle,
  error-handling, or real Web Audio improvements.
- Changing the shipped Echo UI component/hook runtime or public package API solely
  to make the documentation resemble the legacy site.
- New production dependencies, release/version changes, or unrelated refactors.

### Pre-agreed TDD seams

1. First make content-inventory tests fail for root behavior, navigation links,
   Guide/About grouping, footer/edit/pagination controls, both locales, variant
   labels/counts, source affordances, and representative data attributes/API rows.
2. Add or revise deterministic visual-parity assertions so they fail against the
   current Nextra shell before changing shell styles or structure.
3. Implement the smallest shared demo/source model that can express all required
   variants, adding targeted tests for each controller/display category before
   populating page content.
4. Keep modern audio-demo behavior covered while extending Preview/Code; source
   disclosure and copy controls must be keyboard-accessible.
5. Run the closest targeted Vitest/Node check after each seam and
   `pnpm typecheck:docs` regularly.

### Required targeted checks

- Targeted Vitest tests for docs route/content inventory.
- Targeted Node checks for Nextra output and visual-parity baselines.
- `pnpm lint`
- `pnpm typecheck:docs`
- `pnpm build:docs`
- `pnpm test:docs`
- `pnpm verify` as the final implementation check.

### Required UI evidence

Store before/after evidence under
`screen-shots/20260724T132107Z-issue-108-743034/` with an index that maps each
capture to its route, locale, theme, viewport, and acceptance criterion.

- Viewports: 1440×900 and 390×844.
- Locales/themes: English and Chinese, light and dark.
- Routes: home, `/guide/introduction`, `/guide/about`, `/component/button`,
  `/component/knob`, `/component/spectrogram`, and `/hook/usePlayer`.
- Interaction evidence: desktop Links menu, mobile navigation, locale/theme
  switching, previous/next navigation, edit link, Preview/Code switching, source
  copy action, and at least one real-audio demo state.
- Include focused before/after comparisons for representative home, guide,
  controller, visualization, and Hook pages. The evidence index may use a
  documented representative matrix instead of duplicating every unchanged
  combination, but all locale/theme/viewport combinations must be exercised by a
  deterministic check.
- Record keyboard/focus and reduced-motion observations for new interactive UI.

### Risks and owner-confirmation boundaries

- The owner has explicitly approved the issue's >400-line implementation budget.
- Stop for owner confirmation before adding a dependency, changing a shipped
  package API/runtime, changing release metadata, weakening accessibility or
  security behavior, or approving an intentional parity exception not already
  stated above.
- Treat the live Island site as the visual/content reference and the current
  package implementation/types as the source of truth for modern API facts.
- Prefer shared data-driven documentation structures over duplicating large
  locale-specific React implementations.

### Stop conditions

- A requirement conflicts with the current public runtime/API and cannot be
  resolved as documentation-only work.
- A required Island reference/baseline cannot be captured deterministically.
- An in-scope check fails twice for causes outside the issue's changes.
- Work would require a new dependency, release change, security-sensitive change,
  or product/API decision.
- The implementation is complete and committed.

Stop after committing. Do not push, create a PR, or merge.
