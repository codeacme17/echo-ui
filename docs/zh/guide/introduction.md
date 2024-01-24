# 介绍

:::info{title=""}

Echo UI 当前处于核心功能的开发阶段，API 可能会发生变化，欢迎提出 [issue](https://github.com/codeacme17/echo-ui/issues) 或 [PR](https://github.com/codeacme17/echo-ui/pulls)

当核心功能开发完成后，将会上架 NPM，届时你可以通过 `npm install echo-ui` 来安装 Echo UI

更多开发计划可以查看 [Roadmap](https://github.com/codeacme17/echo-ui/blob/main/ROADMAP.md)

:::

## 为什么使用 Echo UI？

**Echo UI** 是一款专为 [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) 设计的 UI 库，它的目标是让工程师在开发浏览器音频应用的过程更加简便，它主要有以下几点特性：

- **开箱即用**：Echo UI 提供了一套开箱即用的组件库，你可以直接使用这些组件来搭建你的音频应用，比如一个 EQ 均衡器、一个音频播放器或一款 VST

- **可定制 & 易于扩展**：基于 [React](https://react.dev/) 和 [TailwindCSS](https://tailwindcss.com/) 开发，这使你可以很容易地定制组件的样式和交互行为，同时也可以很容易地扩展 Echo UI 的组件库

- **简便易用的 Hook**：Echo UI 专门为音频交互、解析提供了一套 Hook，从而轻松实现音频交互应用，你可以使用它们来快速构建响应式的音频应用

- **优质交互**：大部分组件的交互设计灵感来自于 [Ableton Live](https://www.ableton.com/en/live/) 和 [FL Studio](https://www.image-line.com/) 等优质的 DAW 应用，这些交互可以极大的提升用户体验

- **响应式布局**：Echo UI 的组件库都是响应式的，它们可以自动适应不同的屏幕尺寸，从而在不同的设备上都能有良好的体验

## 声明

**Echo UI** 的组件库并不是一个完整的 Web 应用框架，它并不包含表单、列表等组件，并且例如按钮、输入框等组件所暴露的 API 也是为了音频应用的交互而设计的。当然，你也可以与其他更为丰富的 UI 组件库搭配使用（推荐 [NextUI](https://nextui.org/docs/guide/introduction)、[shadcn/ui](https://ui.shadcn.com/)）
