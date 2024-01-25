import{jsx as e,jsxs as t,Fragment as i}from"react/jsx-runtime";import{M as a}from"./ManagerSwitch.a5a3ae7c.js";import{C as c}from"./CodeBlock.38325652.js";import"./chunk-FXLYF44B.996f6326.js";import"./index.2d091e0a.js";import"react";import"react-dom";const f=void 0,w=[{id:"1-download-depandence",text:"1. Download Depandence",depth:3},{id:"2-import-css",text:"2. Import CSS",depth:3}],g="Installation";function r(o){const n=Object.assign({h1:"h1",a:"a",p:"p",ul:"ul",li:"li",h3:"h3"},o.components);return t(i,{children:[t(n.h1,{id:"installation",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#installation",children:"#"}),"Installation"]}),`
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
`,e(a,{npm:"npm install echo-ui",yarn:"yarn add echo-ui",pnpm:"pnpm add echo-ui"}),`
`,t(n.h3,{id:"2-import-css",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#2-import-css",children:"#"}),"2. Import CSS"]}),`
`,e("br",{}),`
`,e(c,{code:`// main.ts

import 'echo-ui/dist/index.css'`})]})}function S(o={}){const{wrapper:n}=o.components||{};return n?e(n,Object.assign({},o,{children:e(r,o)})):r(o)}const C="2024/1/14 18:59:38",x=`import { ManagerSwitch } from '../../src/components/ManagerSwitch.tsx'
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
`;export{x as content,S as default,f as frontmatter,C as lastUpdatedTime,g as title,w as toc};
