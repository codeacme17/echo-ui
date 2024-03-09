import{jsx as n,jsxs as r,Fragment as i}from"react/jsx-runtime";import{D as o,T as c,A as h,C as s}from"./Card.c01a7fc5.js";import{C as a}from"./CodeBlock.de027be4.js";import"./index.a54ae35d.js";import"./index.2d091e0a.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";const M=void 0,L=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u6FC0\u6D3B\u72B6\u6001",text:"\u6FC0\u6D3B\u72B6\u6001",depth:3},{id:"\u5B9E\u9645\u573A\u666F",text:"\u5B9E\u9645\u573A\u666F",depth:3},{id:"api",text:"API",depth:2},{id:"card",text:"Card",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],D="Card \u5361\u7247";function d(t){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3"},t.components);return r(i,{children:[r(e.h1,{id:"card-\u5361\u7247",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#card-\u5361\u7247",children:"#"}),"Card \u5361\u7247"]}),`
`,r(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(a,{code:"import { Card } from 'echo-ui'"}),`
`,r(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(o,{}),`
`,r(e.h3,{id:"\u6FC0\u6D3B\u72B6\u6001",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6FC0\u6D3B\u72B6\u6001",children:"#"}),"\u6FC0\u6D3B\u72B6\u6001"]}),`
`,n(c,{}),`
`,r(e.h3,{id:"\u5B9E\u9645\u573A\u666F",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5B9E\u9645\u573A\u666F",children:"#"}),"\u5B9E\u9645\u573A\u666F"]}),`
`,n(h,{}),`
`,r(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(e.h3,{id:"card",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#card",children:"#"}),"Card"]}),`
`,n(s,{}),`
`,r(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(a,{code:`export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  toggled?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardRef extends HTMLDivElement {}

export interface CardHeaderRef extends HTMLDivElement {}

export interface CardBodyRef extends HTMLDivElement {}
`})]})}function A(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(d,t)})):d(t)}const b="2024/1/10 10:10:15",g=`import { Default, Toggled, ActualScenario } from '../../src/components/UsageBox/Card.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { CardAPITable } from '../../src/components/APITable/Card.tsx'

# Card \u5361\u7247

## \u5F15\u5165

<CodeBlock code={\`import { Card } from 'echo-ui'\`} />

## \u4EE3\u7801\u6F14\u793A

<Default />

### \u6FC0\u6D3B\u72B6\u6001

<Toggled />

### \u5B9E\u9645\u573A\u666F

<ActualScenario />

## API

### Card

<CardAPITable />

## \u7C7B\u578B\u58F0\u660E

<CodeBlock code={\`export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  toggled?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardRef extends HTMLDivElement {}

export interface CardHeaderRef extends HTMLDivElement {}

export interface CardBodyRef extends HTMLDivElement {}
\`} />
`;export{g as content,A as default,M as frontmatter,b as lastUpdatedTime,D as title,L as toc};
