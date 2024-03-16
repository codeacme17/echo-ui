import{jsx as o,jsxs as n,Fragment as a}from"react/jsx-runtime";import{M as t}from"./ManagerSwitch.db2a088f.js";import{C as c}from"./CodeBlock.d8e569ad.js";import"./chunk-FXLYF44B.3661c596.js";import"./index.93441784.js";import"react";import"react-dom";const m=void 0,p=[{id:"1-\u4E0B\u8F7D\u4F9D\u8D56",text:"1. \u4E0B\u8F7D\u4F9D\u8D56",depth:3},{id:"2-tailwind-css-\u8BBE\u7F6E",text:"2. Tailwind CSS \u8BBE\u7F6E",depth:3},{id:"3-\u5F15\u5165-css-\u53D8\u91CF",text:"3. \u5F15\u5165 CSS \u53D8\u91CF",depth:3},{id:"4-\u5F15\u5165\u7EC4\u4EF6",text:"4. \u5F15\u5165\u7EC4\u4EF6",depth:3}],b="\u5B89\u88C5";function d(r){const e=Object.assign({h1:"h1",a:"a",p:"p",ul:"ul",li:"li",h3:"h3",code:"code"},r.components);return n(a,{children:[n(e.h1,{id:"\u5B89\u88C5",children:[o(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5B89\u88C5",children:"#"}),"\u5B89\u88C5"]}),`
`,o(e.p,{children:"\u8981\u6C42\uFF1A"}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[o(e.a,{href:"https://reactjs.org/",target:"_blank",rel:"nofollow",children:"React 18"})," \u6216\u66F4\u9AD8"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[o(e.a,{href:"https://tailwindcss.com/",target:"_blank",rel:"nofollow",children:"Tailwind CSS 3"})," \u6216\u66F4\u9AD8"]}),`
`]}),`
`]}),`
`,n(e.h3,{id:"1-\u4E0B\u8F7D\u4F9D\u8D56",children:[o(e.a,{className:"header-anchor","aria-hidden":"true",href:"#1-\u4E0B\u8F7D\u4F9D\u8D56",children:"#"}),"1. \u4E0B\u8F7D\u4F9D\u8D56"]}),`
`,o(t,{npm:"npm install @nafr/echo-ui",yarn:"yarn add @nafr/echo-ui",pnpm:"pnpm add @nafr/echo-ui"}),`
`,n(e.h3,{id:"2-tailwind-css-\u8BBE\u7F6E",children:[o(e.a,{className:"header-anchor","aria-hidden":"true",href:"#2-tailwind-css-\u8BBE\u7F6E",children:"#"}),"2. Tailwind CSS \u8BBE\u7F6E"]}),`
`,n(e.p,{children:["echo-ui \u6784\u5EFA\u5728 Tailwind CSS \u4E4B\u4E0A\uFF0C\u56E0\u6B64\u60A8\u9700\u8981\u5148\u5B89\u88C5 Tailwind CSS\u3002 \u60A8\u53EF\u4EE5\u6309\u7167\u5B98\u65B9",o(e.a,{href:"https://tailwindcss.com/docs/installation",target:"_blank",rel:"nofollow",children:"\u5B89\u88C5\u6307\u5357"}),"\u5B89\u88C5 Tailwind CSS\u3002 \u7136\u540E\u60A8\u9700\u8981\u5C06\u4EE5\u4E0B\u4EE3\u7801\u6DFB\u52A0\u5230 ",o(e.code,{children:"tailwind.config.js"})," \u6587\u4EF6\u4E2D\uFF1A"]}),`
`,o("br",{}),`
`,o(c,{code:`// tailwind.config.js
module.exports = {
  content: [
    // ...
    './node_modules/@nafr/echo-ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        input: 'var(--echo-input)',
        background: 'var(--echo-background)',
        foreground: 'var(--echo-foreground)',
        border: {
          DEFAULT: 'var(--echo-border)',
          foreground: 'var(--echo-border-foreground)',
        },
        button: {
          DEFAULT: 'var(--echo-button)',
          foreground: 'var(--echo-button-foreground)',
        },
        primary: {
          DEFAULT: 'var(--echo-primary)',
          foreground: 'var(--echo-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--echo-secondary)',
          foreground: 'var(--echo-secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--echo-muted)',
          foreground: 'var(--echo-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--echo-accent)',
          foreground: 'var(--echo-accent-foreground)',
        },
        card: {
          DEFAULT: 'var(--echo-card)',
          foreground: 'var(--echo-card-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--echo-radius)',
        md: 'calc(var(--echo-radius) - 2px)',
        sm: 'calc(var(--echo-radius) - 4px)',
      },
    },
  },
  darkMode: "class",
};
`}),`
`,n(e.h3,{id:"3-\u5F15\u5165-css-\u53D8\u91CF",children:[o(e.a,{className:"header-anchor","aria-hidden":"true",href:"#3-\u5F15\u5165-css-\u53D8\u91CF",children:"#"}),"3. \u5F15\u5165 CSS \u53D8\u91CF"]}),`
`,o(e.p,{children:"\u5728\u4F60\u7684 CSS \u4E3B\u6587\u4EF6\u4E2D\u5F15\u5165 echo-ui \u7684 CSS \u53D8\u91CF:"}),`
`,o("br",{}),`
`,o(c,{code:`/* index.css */

@tailwind base; @tailwind components; @tailwind utilities;

:root { --echo-background: #f1efef; --echo-foreground: #181818; --echo-card: #dadada; --echo-card-foreground: #2a2a2a; --echo-primary: #ffaa01; --echo-primary-foreground: #e49c0c; --echo-secondary: #f3b945; --echo-secondary-foreground: #b7944e; --echo-muted: #c4c4c4; --echo-muted-foreground: #393939; --echo-accent: #f4f4f5; --echo-accent-foreground: #2e2e2e; --echo-border: #c8c8c8; --echo-border-foreground: #494949; --echo-button: #d3d3d3; --echo-button-foreground: #262626; --echo-input: #e4e4e7; --echo-wave: #9e9e9e; --echo-radius: 0.5rem;

-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

.dark { --echo-background: #181818; --echo-foreground: #f1efef; --echo-card: #2f2f2f; --echo-card-foreground: #dadada; --echo-primary: #e49c0c; --echo-primary-foreground: #ffaa01; --echo-secondary: #b7944e; --echo-secondary-foreground: #f3b945; --echo-muted: #393939; --echo-muted-foreground: #c4c4c4; --echo-accent: #27272a; --echo-accent-foreground: #f4f4f5; --echo-border: #494949; --echo-border-foreground: #c8c8c8; --echo-button: #262626; --echo-button-foreground: #d3d3d3; --echo-input: #2a2a2a; --echo-wave: #7d7d7d; }`,lang:"css"}),`
`,n(e.h3,{id:"4-\u5F15\u5165\u7EC4\u4EF6",children:[o(e.a,{className:"header-anchor","aria-hidden":"true",href:"#4-\u5F15\u5165\u7EC4\u4EF6",children:"#"}),"4. \u5F15\u5165\u7EC4\u4EF6"]}),`
`,o(e.p,{children:"\u5728\u4F60\u7684 React \u7EC4\u4EF6\u4E2D\u5F15\u5165 echo-ui \u7684\u7EC4\u4EF6:"}),`
`,o(c,{code:`import { Knob } from '@nafr/echo-ui'

export default function App() {
  return (
    <Knob />
  )
}`})]})}function v(r={}){const{wrapper:e}=r.components||{};return e?o(e,Object.assign({},r,{children:o(d,r)})):d(r)}const w="2024/3/15 11:28:54",S=`import { ManagerSwitch } from '../../src/components/ManagerSwitch.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'

# \u5B89\u88C5

\u8981\u6C42\uFF1A

- [React 18](https://reactjs.org/) \u6216\u66F4\u9AD8

- [Tailwind CSS 3](https://tailwindcss.com/) \u6216\u66F4\u9AD8

### 1. \u4E0B\u8F7D\u4F9D\u8D56

<ManagerSwitch
  npm="npm install @nafr/echo-ui"
  yarn="yarn add @nafr/echo-ui"
  pnpm="pnpm add @nafr/echo-ui"
/>

### 2. Tailwind CSS \u8BBE\u7F6E

echo-ui \u6784\u5EFA\u5728 Tailwind CSS \u4E4B\u4E0A\uFF0C\u56E0\u6B64\u60A8\u9700\u8981\u5148\u5B89\u88C5 Tailwind CSS\u3002 \u60A8\u53EF\u4EE5\u6309\u7167\u5B98\u65B9[\u5B89\u88C5\u6307\u5357](https://tailwindcss.com/docs/installation)\u5B89\u88C5 Tailwind CSS\u3002 \u7136\u540E\u60A8\u9700\u8981\u5C06\u4EE5\u4E0B\u4EE3\u7801\u6DFB\u52A0\u5230 \`tailwind.config.js\` \u6587\u4EF6\u4E2D\uFF1A

<br />

<CodeBlock
  code={\`// tailwind.config.js
module.exports = {
  content: [
    // ...
    './node_modules/@nafr/echo-ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        input: 'var(--echo-input)',
        background: 'var(--echo-background)',
        foreground: 'var(--echo-foreground)',
        border: {
          DEFAULT: 'var(--echo-border)',
          foreground: 'var(--echo-border-foreground)',
        },
        button: {
          DEFAULT: 'var(--echo-button)',
          foreground: 'var(--echo-button-foreground)',
        },
        primary: {
          DEFAULT: 'var(--echo-primary)',
          foreground: 'var(--echo-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--echo-secondary)',
          foreground: 'var(--echo-secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--echo-muted)',
          foreground: 'var(--echo-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--echo-accent)',
          foreground: 'var(--echo-accent-foreground)',
        },
        card: {
          DEFAULT: 'var(--echo-card)',
          foreground: 'var(--echo-card-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--echo-radius)',
        md: 'calc(var(--echo-radius) - 2px)',
        sm: 'calc(var(--echo-radius) - 4px)',
      },
    },
  },
  darkMode: "class",
};
\`}
/>

### 3. \u5F15\u5165 CSS \u53D8\u91CF

\u5728\u4F60\u7684 CSS \u4E3B\u6587\u4EF6\u4E2D\u5F15\u5165 echo-ui \u7684 CSS \u53D8\u91CF:

<br />

<CodeBlock
  code={\`/* index.css */

@tailwind base; @tailwind components; @tailwind utilities;

:root { --echo-background: #f1efef; --echo-foreground: #181818; --echo-card: #dadada; --echo-card-foreground: #2a2a2a; --echo-primary: #ffaa01; --echo-primary-foreground: #e49c0c; --echo-secondary: #f3b945; --echo-secondary-foreground: #b7944e; --echo-muted: #c4c4c4; --echo-muted-foreground: #393939; --echo-accent: #f4f4f5; --echo-accent-foreground: #2e2e2e; --echo-border: #c8c8c8; --echo-border-foreground: #494949; --echo-button: #d3d3d3; --echo-button-foreground: #262626; --echo-input: #e4e4e7; --echo-wave: #9e9e9e; --echo-radius: 0.5rem;

-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

.dark { --echo-background: #181818; --echo-foreground: #f1efef; --echo-card: #2f2f2f; --echo-card-foreground: #dadada; --echo-primary: #e49c0c; --echo-primary-foreground: #ffaa01; --echo-secondary: #b7944e; --echo-secondary-foreground: #f3b945; --echo-muted: #393939; --echo-muted-foreground: #c4c4c4; --echo-accent: #27272a; --echo-accent-foreground: #f4f4f5; --echo-border: #494949; --echo-border-foreground: #c8c8c8; --echo-button: #262626; --echo-button-foreground: #d3d3d3; --echo-input: #2a2a2a; --echo-wave: #7d7d7d; }\`} lang='css'/>

### 4. \u5F15\u5165\u7EC4\u4EF6

\u5728\u4F60\u7684 React \u7EC4\u4EF6\u4E2D\u5F15\u5165 echo-ui \u7684\u7EC4\u4EF6:

<CodeBlock code={\`import { Knob } from '@nafr/echo-ui'

export default function App() {
  return (
    <Knob />
  )
}\`}/>
`;export{S as content,v as default,m as frontmatter,w as lastUpdatedTime,b as title,p as toc};
