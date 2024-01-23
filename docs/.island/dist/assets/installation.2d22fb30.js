import{jsx as e,jsxs as t,Fragment as a}from"react/jsx-runtime";import{M as i}from"./ManagerSwitch.8116b845.js";import{C as c}from"./CodeBlock.69bc42b0.js";import"./chunk-FXLYF44B.9f5da3e9.js";import"react-dom";import"react";const u=void 0,f=[{id:"1-download-depandence",text:"1. Download Depandence",depth:3},{id:"2-import-css",text:"2. Import CSS",depth:3}],w="Installation";function r(o){const n=Object.assign({h1:"h1",a:"a",p:"p",ul:"ul",li:"li",h3:"h3"},o.components);return t(a,{children:[t(n.h1,{id:"installation",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#installation",children:"#"}),"Installation"]}),`
`,e(n.p,{children:"required:"}),`
`,t(n.ul,{children:[`
`,t(n.li,{children:[`
`,t(n.p,{children:[e(n.a,{href:"https://reactjs.org/",target:"_blank",rel:"nofollow",children:"React 18"})," or higher"]}),`
`]}),`
`,t(n.li,{children:[`
`,t(n.p,{children:[e(n.a,{href:"https://tailwindcss.com/",target:"_blank",rel:"nofollow",children:"Tailwind CSS 3"})," or higher"]}),`
`]}),`
`]}),`
`,t(n.h3,{id:"1-download-depandence",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#1-download-depandence",children:"#"}),"1. Download Depandence"]}),`
`,e(i,{npm:"npm install echo-ui",yarn:"yarn add echo-ui",pnpm:"pnpm add echo-ui"}),`
`,t(n.h3,{id:"2-import-css",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#2-import-css",children:"#"}),"2. Import CSS"]}),`
`,e("br",{}),`
`,e(c,{code:`// main.ts

import 'echo-ui/dist/index.css'`})]})}function g(o={}){const{wrapper:n}=o.components||{};return n?e(n,Object.assign({},o,{children:e(r,o)})):r(o)}const S="2024/1/14 18:59:38",C=`import { ManagerSwitch } from '../../src/components/ManagerSwitch.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'

# Installation

required:

- [React 18](https://reactjs.org/) or higher

- [Tailwind CSS 3](https://tailwindcss.com/) or higher

### 1. Download Depandence

<ManagerSwitch npm="npm install echo-ui" yarn="yarn add echo-ui" pnpm="pnpm add echo-ui" />

### 2. Import CSS

<br />

<CodeBlock
  code={\`// main.ts

import 'echo-ui/dist/index.css'\`}
/>
`;export{C as content,g as default,u as frontmatter,S as lastUpdatedTime,w as title,f as toc};
