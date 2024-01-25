import{jsx as n,jsxs as t,Fragment as a}from"react/jsx-runtime";import{D as o,O as d,C as c,S as s,L as l}from"./Light.d5ffe0c9.js";import{C as r}from"./CodeBlock.38325652.js";import"./index.8d63da56.js";import"react";import"./index.2d091e0a.js";import"../client-entry.js";import"./chunk-FXLYF44B.996f6326.js";import"react-dom";const T=void 0,D=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u5F00\u542F\u72B6\u6001",text:"\u5F00\u542F\u72B6\u6001",depth:3},{id:"\u706F\u5149\u989C\u8272",text:"\u706F\u5149\u989C\u8272",depth:3},{id:"\u5C3A\u5BF8",text:"\u5C3A\u5BF8",depth:3},{id:"api",text:"API",depth:2},{id:"light",text:"Light",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],A="Light \u6307\u793A\u706F";function h(i){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},i.components);return t(a,{children:[t(e.h1,{id:"light-\u6307\u793A\u706F",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#light-\u6307\u793A\u706F",children:"#"}),"Light \u6307\u793A\u706F"]}),`
`,n(e.p,{children:"\u6307\u793A\u706F\u7EC4\u4EF6\u4E3B\u8981\u53EF\u4EE5\u7528\u6765\u5BF9\u67D0\u4E9B\u72B6\u6001\u8FDB\u884C\u6807\u8BB0\uFF0C\u5982\u6548\u679C\u5668\u662F\u5426\u5F00\u542F\u7B49\u72B6\u6001"}),`
`,t(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(r,{code:"import { Light } from 'echo-ui'"}),`
`,t(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(o,{}),`
`,t(e.h3,{id:"\u5F00\u542F\u72B6\u6001",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F00\u542F\u72B6\u6001",children:"#"}),"\u5F00\u542F\u72B6\u6001"]}),`
`,n(d,{}),`
`,t(e.h3,{id:"\u706F\u5149\u989C\u8272",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u706F\u5149\u989C\u8272",children:"#"}),"\u706F\u5149\u989C\u8272"]}),`
`,n(c,{}),`
`,t(e.h3,{id:"\u5C3A\u5BF8",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8",children:"#"}),"\u5C3A\u5BF8"]}),`
`,n(s,{}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"light",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#light",children:"#"}),"Light"]}),`
`,n(l,{}),`
`,t(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(r,{code:`export interface LightProps extends React.HTMLAttributes<HTMLDivElement> {
  on?: boolean
  size?: number | string
  color?: string
}

export interface LightRef extends HTMLDivElement {}`})]})}function M(i={}){const{wrapper:e}=i.components||{};return e?n(e,Object.assign({},i,{children:n(h,i)})):h(i)}const N="2024/1/10 10:10:15",P=`import {
  DefaultLight,
  OnLight,
  ColorLight,
  SizeLight,
} from '../../src/components/UsageBox/Light.tsx'
import { LightAPITable } from '../../src/components/APITable/Light.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'

# Light \u6307\u793A\u706F

\u6307\u793A\u706F\u7EC4\u4EF6\u4E3B\u8981\u53EF\u4EE5\u7528\u6765\u5BF9\u67D0\u4E9B\u72B6\u6001\u8FDB\u884C\u6807\u8BB0\uFF0C\u5982\u6548\u679C\u5668\u662F\u5426\u5F00\u542F\u7B49\u72B6\u6001

## \u5F15\u5165

<CodeBlock code={\`import { Light } from 'echo-ui'\`} />

## \u4EE3\u7801\u6F14\u793A

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
`;export{P as content,M as default,T as frontmatter,N as lastUpdatedTime,A as title,D as toc};
