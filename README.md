<img src="https://github.com/codeacme17/echo-ui/assets/67408722/8222b369-5f71-428e-97f9-f648f05cab70" width="240"/></br>

Echo UI is a high-performance and out-of-the-box web audio API component library, build with React and TailwindCSS.

<a href="https://echoui.dev/en"> 
  <img src="https://img.shields.io/badge/Document-ffbe3b?style=flat" />
</a>

<a href="https://echoui.dev/zh"> 
  <img src="https://img.shields.io/badge/中文文档-ffbe3b?style=flat&logo=googletranslate&logoColor=%231e1e1e" />
</a>

<a href="./ROADMAP.md"> 
  <img src="https://img.shields.io/badge/ROADMAP-ffbe3b?style=flat" />
</a>

<a href="./LICENSE.md"> 
  <img src="https://img.shields.io/badge/License-MIT-ffbe3b?style=flat&labelColor=ffbe3b" />
</a>

## Why Echo UI ?

Nowadays, [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) has become a very popular and mature technology for web audio development, and libraries based on it (such as [tone.js](https://github.com/Tonejs/Tone.js) and [howler.js](https://github.com/goldfire/howler.js)) have emerged and become very popular. However, the interaction interface for audio operations is cumbersome and involves many technical points, so this can be a major stumbling block to the development of this technology.

**Echo UI** aims to simplify the development process of audio interaction pages, reduce the burden on the developer's mind, and allow users to use out-of-the-box component libraries to quickly build an elegant audio interaction application!

## Features

#### 📦 **Out-of-the-Box**

Echo UI provides a set of out-of-the-box components that you can directly use to build your audio applications, such as an EQ equalizer, an audio player, or a VST plugin.

#### 🎛️ **High-Quality Interactions**

Many of the component interactions are inspired by high-quality DAW (Digital Audio Workstation) applications like [Ableton Live](https://www.ableton.com/en/live/) and [FL Studio](https://www.image-line.com/). These interactions greatly enhance the user experience.

#### ✨ **Customizable & Easily Extensible**

Developed based on [React](https://react.dev/) and [TailwindCSS](https://tailwindcss.com/), it allows you to easily customize the style and interaction behavior of components. Additionally, you can easily extend Echo UI's component library.

#### 🛠️ **Easy-to-use Hook**

Hook specially designed for audio interaction and analysis applications, which can easily implement audio interactive applications.

#### 📈 **Responsive layout**

Echo UI's component library is responsive, meaning they can automatically adapt to different screen sizes, providing a good experience on different devices.

## Development baseline

Echo UI supports Node.js 24 and pnpm 10. The repository pins pnpm 10.22.0 through `packageManager`; `.nvmrc` selects the supported Node.js major, and the package engines reject unsupported majors.

From a fresh checkout:

```bash
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm verify
```

`pnpm verify` runs the library, example, and documentation type checks, builds, unit tests, and static-site browser checks. These checks can also be run independently:

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm typecheck:example
pnpm build:example
pnpm typecheck:docs
pnpm dev:docs
pnpm build:docs
pnpm preview:docs
pnpm test:docs
```

The production documentation is built from the `docs-nextra` workspace and exported to `docs-nextra/out`.

## License

[MIT](./LICENSE.md) © 2023-Present [leyoonafr](https://github.com/codeacme17)
