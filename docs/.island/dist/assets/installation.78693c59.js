import{jsx as o,jsxs as e,Fragment as d}from"react/jsx-runtime";import{M as t}from"./ManagerSwitch.db2a088f.js";import{C as c}from"./CodeBlock.d8e569ad.js";import"./chunk-FXLYF44B.3661c596.js";import"./index.93441784.js";import"react";import"react-dom";const p=void 0,g=[{id:"1-install-dependencies",text:"1. Install Dependencies",depth:3},{id:"2-tailwind-css-setup",text:"2. Tailwind CSS Setup",depth:3},{id:"3-import-css-variables",text:"3. Import CSS Variables",depth:3},{id:"4-import-components",text:"4. Import Components",depth:3}],b="Installation";function a(n){const r=Object.assign({h1:"h1",a:"a",p:"p",ul:"ul",li:"li",h3:"h3",code:"code"},n.components);return e(d,{children:[e(r.h1,{id:"installation",children:[o(r.a,{className:"header-anchor","aria-hidden":"true",href:"#installation",children:"#"}),"Installation"]}),`
`,o(r.p,{children:"Requirements:"}),`
`,e(r.ul,{children:[`
`,e(r.li,{children:[`
`,e(r.p,{children:[o(r.a,{href:"https://reactjs.org/",target:"_blank",rel:"nofollow",children:"React 18"})," or higher"]}),`
`]}),`
`,e(r.li,{children:[`
`,e(r.p,{children:[o(r.a,{href:"https://tailwindcss.com/",target:"_blank",rel:"nofollow",children:"Tailwind CSS 3"})," or higher"]}),`
`]}),`
`]}),`
`,e(r.h3,{id:"1-install-dependencies",children:[o(r.a,{className:"header-anchor","aria-hidden":"true",href:"#1-install-dependencies",children:"#"}),"1. Install Dependencies"]}),`
`,o(t,{npm:"npm install @nafr/echo-ui",yarn:"yarn add @nafr/echo-ui",pnpm:"pnpm add @nafr/echo-ui"}),`
`,e(r.h3,{id:"2-tailwind-css-setup",children:[o(r.a,{className:"header-anchor","aria-hidden":"true",href:"#2-tailwind-css-setup",children:"#"}),"2. Tailwind CSS Setup"]}),`
`,e(r.p,{children:["echo-ui is built on top of Tailwind CSS, so you need to install Tailwind CSS first. You can follow the official ",o(r.a,{href:"https://tailwindcss.com/docs/installation",target:"_blank",rel:"nofollow",children:"installation guide"})," for Tailwind CSS. Then you need to add the following code to your ",o(r.code,{children:"tailwind.config.js"})," file:"]}),`
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
`,e(r.h3,{id:"3-import-css-variables",children:[o(r.a,{className:"header-anchor","aria-hidden":"true",href:"#3-import-css-variables",children:"#"}),"3. Import CSS Variables"]}),`
`,o(r.p,{children:"Import echo-ui CSS variables in your main CSS file:"}),`
`,o("br",{}),`
`,o(c,{code:`/* index.css */

@tailwind base; @tailwind components; @tailwind utilities;

:root { --echo-background: #f1efef; --echo-foreground: #181818; --echo-card: #dadada; --echo-card-foreground: #2a2a2a; --echo-primary: #ffaa01; --echo-primary-foreground: #e49c0c; --echo-secondary: #f3b945; --echo-secondary-foreground: #b7944e; --echo-muted: #c4c4c4; --echo-muted-foreground: #393939; --echo-accent: #f4f4f5; --echo-accent-foreground: #2e2e2e; --echo-border: #c8c8c8; --echo-border-foreground: #494949; --echo-button: #d3d3d3; --echo-button-foreground: #262626; --echo-input: #e4e4e7; --echo-wave: #9e9e9e; --echo-radius: 0.5rem;

-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

.dark { --echo-background: #181818; --echo-foreground: #f1efef; --echo-card: #2f2f2f; --echo-card-foreground: #dadada; --echo-primary: #e49c0c; --echo-primary-foreground: #ffaa01; --echo-secondary: #b7944e; --echo-secondary-foreground: #f3b945; --echo-muted: #393939; --echo-muted-foreground: #c4c4c4; --echo-accent: #27272a; --echo-accent-foreground: #f4f4f5; --echo-border: #494949; --echo-border-foreground: #c8c8c8; --echo-button: #262626; --echo-button-foreground: #d3d3d3; --echo-input: #2a2a2a; --echo-wave: #7d7d7d; }`,lang:"css"}),`
`,e(r.h3,{id:"4-import-components",children:[o(r.a,{className:"header-anchor","aria-hidden":"true",href:"#4-import-components",children:"#"}),"4. Import Components"]}),`
`,o(r.p,{children:"Import echo-ui components in your React components:"}),`
`,o(c,{code:`import { Knob } from '@nafr/echo-ui'

export default function App() {
  return (
    <Knob />
  )
}`})]})}function v(n={}){const{wrapper:r}=n.components||{};return r?o(r,Object.assign({},n,{children:o(a,n)})):a(n)}const w="2024/3/15 11:28:54",y=`import { ManagerSwitch } from '../../src/components/ManagerSwitch.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
\r
# Installation\r
\r
Requirements:\r
\r
- [React 18](https://reactjs.org/) or higher\r
\r
- [Tailwind CSS 3](https://tailwindcss.com/) or higher\r
\r
### 1. Install Dependencies\r
\r
<ManagerSwitch\r
  npm="npm install @nafr/echo-ui"\r
  yarn="yarn add @nafr/echo-ui"\r
  pnpm="pnpm add @nafr/echo-ui"\r
/>\r
\r
### 2. Tailwind CSS Setup\r
\r
echo-ui is built on top of Tailwind CSS, so you need to install Tailwind CSS first. You can follow the official [installation guide](https://tailwindcss.com/docs/installation) for Tailwind CSS. Then you need to add the following code to your \`tailwind.config.js\` file:\r
\r
<br />\r
\r
<CodeBlock\r
  code={\`// tailwind.config.js\r
module.exports = {\r
  content: [\r
    // ...\r
    './node_modules/@nafr/echo-ui/dist/**/*.{js,ts,jsx,tsx}',\r
  ],\r
  theme: {\r
    extend: {\r
      colors: {\r
        input: 'var(--echo-input)',\r
        background: 'var(--echo-background)',\r
        foreground: 'var(--echo-foreground)',\r
        border: {\r
          DEFAULT: 'var(--echo-border)',\r
          foreground: 'var(--echo-border-foreground)',\r
        },\r
        button: {\r
          DEFAULT: 'var(--echo-button)',\r
          foreground: 'var(--echo-button-foreground)',\r
        },\r
        primary: {\r
          DEFAULT: 'var(--echo-primary)',\r
          foreground: 'var(--echo-primary-foreground)',\r
        },\r
        secondary: {\r
          DEFAULT: 'var(--echo-secondary)',\r
          foreground: 'var(--echo-secondary-foreground)',\r
        },\r
        muted: {\r
          DEFAULT: 'var(--echo-muted)',\r
          foreground: 'var(--echo-muted-foreground)',\r
        },\r
        accent: {\r
          DEFAULT: 'var(--echo-accent)',\r
          foreground: 'var(--echo-accent-foreground)',\r
        },\r
        card: {\r
          DEFAULT: 'var(--echo-card)',\r
          foreground: 'var(--echo-card-foreground)',\r
        },\r
      },\r
      borderRadius: {\r
        lg: 'var(--echo-radius)',\r
        md: 'calc(var(--echo-radius) - 2px)',\r
        sm: 'calc(var(--echo-radius) - 4px)',\r
      },\r
    },\r
  },\r
  darkMode: "class",\r
};\r
\`}\r
/>\r
\r
### 3. Import CSS Variables\r
\r
Import echo-ui CSS variables in your main CSS file:\r
\r
<br />\r
\r
<CodeBlock\r
  code={\`/* index.css */\r
\r
@tailwind base; @tailwind components; @tailwind utilities;\r
\r
:root { --echo-background: #f1efef; --echo-foreground: #181818; --echo-card: #dadada; --echo-card-foreground: #2a2a2a; --echo-primary: #ffaa01; --echo-primary-foreground: #e49c0c; --echo-secondary: #f3b945; --echo-secondary-foreground: #b7944e; --echo-muted: #c4c4c4; --echo-muted-foreground: #393939; --echo-accent: #f4f4f5; --echo-accent-foreground: #2e2e2e; --echo-border: #c8c8c8; --echo-border-foreground: #494949; --echo-button: #d3d3d3; --echo-button-foreground: #262626; --echo-input: #e4e4e7; --echo-wave: #9e9e9e; --echo-radius: 0.5rem;\r
\r
-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\r
\r
.dark { --echo-background: #181818; --echo-foreground: #f1efef; --echo-card: #2f2f2f; --echo-card-foreground: #dadada; --echo-primary: #e49c0c; --echo-primary-foreground: #ffaa01; --echo-secondary: #b7944e; --echo-secondary-foreground: #f3b945; --echo-muted: #393939; --echo-muted-foreground: #c4c4c4; --echo-accent: #27272a; --echo-accent-foreground: #f4f4f5; --echo-border: #494949; --echo-border-foreground: #c8c8c8; --echo-button: #262626; --echo-button-foreground: #d3d3d3; --echo-input: #2a2a2a; --echo-wave: #7d7d7d; }\`} lang='css'/>\r
\r
### 4. Import Components\r
\r
Import echo-ui components in your React components:\r
\r
<CodeBlock code={\`import { Knob } from '@nafr/echo-ui'\r
\r
export default function App() {\r
  return (\r
    <Knob />\r
  )\r
}\`}/>\r
`;export{y as content,v as default,p as frontmatter,w as lastUpdatedTime,b as title,g as toc};
