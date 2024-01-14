import{jsx as e,jsxs as i,Fragment as a}from"react/jsx-runtime";import{A as o}from"./style.e0d0cfbc.js";import{U as h,A as s,c as r,C as c}from"./index.bf491f00.js";import"react";import"./_commonjsHelpers.4e997714.js";import"react-dom";const l=()=>e(h,{code:"<Light />",scope:{Light:o}}),u=()=>e(h,{code:"<Light on />",scope:{Light:o}}),g=()=>e(h,{code:"<Light on color='#10b981'/>",scope:{Light:o}}),p=()=>e(h,{code:"<Light on size={17} />",scope:{Light:o}}),m=()=>e(s,{data:[{attribute:"on",description:"\u6307\u793A\u706F\u662F\u5426\u5F00\u542F",type:e(r,{children:"boolean"}),default:e(r,{children:"false"})},{attribute:"size",description:"\u6307\u793A\u706F\u7684\u5927\u5C0F",type:e(r,{children:" number | string "}),default:e(r,{children:"0.75rem"})},{attribute:"color",description:"\u6307\u793A\u706F\u706F\u5149\u989C\u8272",type:e(r,{children:"string"}),default:e(r,{children:"var(--echo-primary)"})}]}),T=void 0,P=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u7528\u6CD5",text:"\u7528\u6CD5",depth:2},{id:"\u5F00\u542F\u72B6\u6001",text:"\u5F00\u542F\u72B6\u6001",depth:3},{id:"\u706F\u5149\u989C\u8272",text:"\u706F\u5149\u989C\u8272",depth:3},{id:"\u5C3A\u5BF8",text:"\u5C3A\u5BF8",depth:3},{id:"api",text:"API",depth:2},{id:"light",text:"Light",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],D="Light \u6307\u793A\u706F";function d(t){const n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},t.components);return i(a,{children:[i(n.h1,{id:"light-\u6307\u793A\u706F",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#light-\u6307\u793A\u706F",children:"#"}),"Light \u6307\u793A\u706F"]}),`
`,e(n.p,{children:"\u6307\u793A\u706F\u7EC4\u4EF6\u4E3B\u8981\u53EF\u4EE5\u7528\u6765\u5BF9\u67D0\u4E9B\u72B6\u6001\u8FDB\u884C\u6807\u8BB0\uFF0C\u5982\u6548\u679C\u5668\u662F\u5426\u5F00\u542F\u7B49\u72B6\u6001"}),`
`,i(n.h2,{id:"\u5F15\u5165",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,e(c,{code:"import { Light } from 'echo-ui'"}),`
`,i(n.h2,{id:"\u7528\u6CD5",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7528\u6CD5",children:"#"}),"\u7528\u6CD5"]}),`
`,e(l,{}),`
`,i(n.h3,{id:"\u5F00\u542F\u72B6\u6001",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F00\u542F\u72B6\u6001",children:"#"}),"\u5F00\u542F\u72B6\u6001"]}),`
`,e(u,{}),`
`,i(n.h3,{id:"\u706F\u5149\u989C\u8272",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u706F\u5149\u989C\u8272",children:"#"}),"\u706F\u5149\u989C\u8272"]}),`
`,e(g,{}),`
`,i(n.h3,{id:"\u5C3A\u5BF8",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8",children:"#"}),"\u5C3A\u5BF8"]}),`
`,e(p,{}),`
`,i(n.h2,{id:"api",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,i(n.h3,{id:"light",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#light",children:"#"}),"Light"]}),`
`,e(m,{}),`
`,i(n.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,e(c,{code:`export interface LightProps extends React.HTMLAttributes<HTMLDivElement> {
  on?: boolean
  size?: number | string
  color?: string
}

export interface LightRef extends HTMLDivElement {}`})]})}function F(t={}){const{wrapper:n}=t.components||{};return n?e(n,Object.assign({},t,{children:e(d,t)})):d(t)}const M="2023/12/29 22:24:34",N=`import {
  DefaultLight,
  OnLight,
  ColorLight,
  SizeLight,
} from '../../src/components/UsageBox/Light.tsx'
import { LightAPITable } from '../../src/components/APITable/Light.tsx'
import { CodeBlock } from '../../src/components/CodeBlock/index.tsx'

# Light \u6307\u793A\u706F

\u6307\u793A\u706F\u7EC4\u4EF6\u4E3B\u8981\u53EF\u4EE5\u7528\u6765\u5BF9\u67D0\u4E9B\u72B6\u6001\u8FDB\u884C\u6807\u8BB0\uFF0C\u5982\u6548\u679C\u5668\u662F\u5426\u5F00\u542F\u7B49\u72B6\u6001

## \u5F15\u5165

<CodeBlock code={\`import { Light } from 'echo-ui'\`} />

## \u7528\u6CD5

<DefaultLight />

### \u5F00\u542F\u72B6\u6001

<OnLight />

### \u706F\u5149\u989C\u8272

<ColorLight />

### \u5C3A\u5BF8

<SizeLight />

## API

### Light

<LightAPITable />

## \u7C7B\u578B\u58F0\u660E

<CodeBlock code={\`export interface LightProps extends React.HTMLAttributes<HTMLDivElement> {
  on?: boolean
  size?: number | string
  color?: string
}

export interface LightRef extends HTMLDivElement {}\`} />
`;export{N as content,F as default,T as frontmatter,M as lastUpdatedTime,D as title,P as toc};
