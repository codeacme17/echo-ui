import{jsx as r,jsxs as t,Fragment as i}from"react/jsx-runtime";import{D as o,T as c,A as h,C as s}from"./Card.44880310.js";import{C as a}from"./CodeBlock.d8e569ad.js";import"./index.b2cccce0.js";import"./index.93441784.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./index.b03910b6.js";import"./index.06c04839.js";import"./transform.3e3dfeca.js";import"./assertion.e9357fda.js";import"./log.83f32a09.js";import"./usePropsWithGroup.a30eaab0.js";import"./useCommandAltClick.cec7174c.js";import"./index.c4c3b1bd.js";import"./index.6b8ad651.js";import"./index.66b20fa1.js";import"./index.704bb6de.js";import"./axis.b2198668.js";const I=void 0,k=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u6FC0\u6D3B\u72B6\u6001",text:"\u6FC0\u6D3B\u72B6\u6001",depth:3},{id:"\u5B9E\u9645\u573A\u666F",text:"\u5B9E\u9645\u573A\u666F",depth:3},{id:"api",text:"API",depth:2},{id:"card",text:"Card",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],y="Card \u5361\u7247";function d(n){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3"},n.components);return t(i,{children:[t(e.h1,{id:"card-\u5361\u7247",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#card-\u5361\u7247",children:"#"}),"Card \u5361\u7247"]}),`
`,t(e.h2,{id:"\u5F15\u5165",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,r(a,{code:"import { Card } from 'echo-ui'"}),`
`,t(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,r(o,{}),`
`,t(e.h3,{id:"\u6FC0\u6D3B\u72B6\u6001",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6FC0\u6D3B\u72B6\u6001",children:"#"}),"\u6FC0\u6D3B\u72B6\u6001"]}),`
`,r(c,{}),`
`,t(e.h3,{id:"\u5B9E\u9645\u573A\u666F",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5B9E\u9645\u573A\u666F",children:"#"}),"\u5B9E\u9645\u573A\u666F"]}),`
`,r(h,{}),`
`,t(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"card",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#card",children:"#"}),"Card"]}),`
`,r(s,{}),`
`,t(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,r(a,{code:`export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  toggled?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardRef extends HTMLDivElement {}

export interface CardHeaderRef extends HTMLDivElement {}

export interface CardBodyRef extends HTMLDivElement {}
`})]})}function j(n={}){const{wrapper:e}=n.components||{};return e?r(e,Object.assign({},n,{children:r(d,n)})):d(n)}const S="2024/1/10 10:10:15",O=`import { Default, Toggled, ActualScenario } from '../../src/components/UsageBox/Card.tsx'
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
`;export{O as content,j as default,I as frontmatter,S as lastUpdatedTime,y as title,k as toc};
