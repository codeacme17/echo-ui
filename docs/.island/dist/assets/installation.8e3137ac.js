import{jsx as e,jsxs as t,Fragment as l}from"react/jsx-runtime";import{t as d,a as s,C as r}from"./CodeBlock.15abbd2c.js";import"react-dom";import"react";const h=({npm:a,yarn:n,pnpm:o})=>e("div",{className:"flex w-full flex-col mt-3",children:e(d,{"aria-label":"Dynamic tabs",items:[{id:"npm",label:"npm",content:a},{id:"yarn",label:"yarn",content:n},{id:"pnpm",label:"pnpm",content:o}],color:"primary",variant:"underlined",classNames:{tab:"data-[focus-visible=true]:outline-none"},children:i=>e(s,{title:i.label,children:e(r,{code:i.content,language:"bash"})},i.id)})}),g=void 0,w=[{id:"1-\u4E0B\u8F7D\u4F9D\u8D56",text:"1. \u4E0B\u8F7D\u4F9D\u8D56",depth:3},{id:"2-\u5F15\u5165\u6837\u5F0F",text:"2. \u5F15\u5165\u6837\u5F0F",depth:3}],x="\u5B89\u88C5";function c(a){const n=Object.assign({h1:"h1",a:"a",p:"p",ul:"ul",li:"li",h3:"h3"},a.components);return t(l,{children:[t(n.h1,{id:"\u5B89\u88C5",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5B89\u88C5",children:"#"}),"\u5B89\u88C5"]}),`
`,e(n.p,{children:"\u8981\u6C42\uFF1A"}),`
`,t(n.ul,{children:[`
`,t(n.li,{children:[`
`,t(n.p,{children:[e(n.a,{href:"https://reactjs.org/",target:"_blank",rel:"nofollow",children:"React 18"})," \u6216\u66F4\u9AD8"]}),`
`]}),`
`,t(n.li,{children:[`
`,t(n.p,{children:[e(n.a,{href:"https://tailwindcss.com/",target:"_blank",rel:"nofollow",children:"Tailwind CSS 3"})," \u6216\u66F4\u9AD8"]}),`
`]}),`
`]}),`
`,t(n.h3,{id:"1-\u4E0B\u8F7D\u4F9D\u8D56",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#1-\u4E0B\u8F7D\u4F9D\u8D56",children:"#"}),"1. \u4E0B\u8F7D\u4F9D\u8D56"]}),`
`,e(h,{npm:"npm install echo-ui",yarn:"yarn add echo-ui",pnpm:"pnpm add echo-ui"}),`
`,t(n.h3,{id:"2-\u5F15\u5165\u6837\u5F0F",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#2-\u5F15\u5165\u6837\u5F0F",children:"#"}),"2. \u5F15\u5165\u6837\u5F0F"]}),`
`,e("br",{}),`
`,e(r,{code:`// main.ts
import 'echo-ui/dist/index.css'`})]})}function y(a={}){const{wrapper:n}=a.components||{};return n?e(n,Object.assign({},a,{children:e(c,a)})):c(a)}const C="2024/1/3 15:16:46",S=`import { ManagerSwitch } from '../../src/components/ManagerSwitch.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'

# \u5B89\u88C5

\u8981\u6C42\uFF1A

- [React 18](https://reactjs.org/) \u6216\u66F4\u9AD8

- [Tailwind CSS 3](https://tailwindcss.com/) \u6216\u66F4\u9AD8

### 1. \u4E0B\u8F7D\u4F9D\u8D56

<ManagerSwitch npm="npm install echo-ui" yarn="yarn add echo-ui" pnpm="pnpm add echo-ui" />

### 2. \u5F15\u5165\u6837\u5F0F

<br />

<CodeBlock
  code={\`// main.ts
import 'echo-ui/dist/index.css'\`}
/>
`;export{S as content,y as default,g as frontmatter,C as lastUpdatedTime,x as title,w as toc};
