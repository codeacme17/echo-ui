import{jsx as n,jsxs as t,Fragment as d}from"react/jsx-runtime";import{C as r}from"./CodeBlock.de027be4.js";import{D as i,A as l,a as c,E as h}from"./Envelope.2d5508a3.js";import"react";import"./index.2d091e0a.js";import"./index.87519544.js";import"./index.6a66cf71.js";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";const x=void 0,R=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"ahdsr-\u5305\u7EDC",text:"AHDSR \u5305\u7EDC",depth:3},{id:"delay-\u5EF6\u8FDF",text:"Delay \u5EF6\u8FDF",depth:3},{id:"api",text:"API",depth:2},{id:"envelope",text:"Envelope",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],S="Envelope \u5305\u7EDC\u63A7\u5236\u5668";function o(a){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code"},a.components);return t(d,{children:[t(e.h1,{id:"envelope-\u5305\u7EDC\u63A7\u5236\u5668",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#envelope-\u5305\u7EDC\u63A7\u5236\u5668",children:"#"}),"Envelope \u5305\u7EDC\u63A7\u5236\u5668"]}),`
`,t(e.p,{children:["Envelope \u662F\u4E00\u4E2A ",n(e.a,{href:"https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope",target:"_blank",rel:"nofollow",children:"ADSR"})," \u5305\u7EDC\u53D1\u751F\u5668\u7684\u53EF\u89C6\u5316\u7EBF\u6027\u4EA4\u4E92\u5F0F\u7EC4\u4EF6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u8BE5\u7EC4\u4EF6\u63A7\u5236 ADSR \u76F8\u5173\u7684\u5C5E\u6027"]}),`
`,t(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(r,{code:"import { Envelope } from 'echo-ui'"}),`
`,t(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(i,{}),`
`,t(e.h3,{id:"ahdsr-\u5305\u7EDC",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#ahdsr-\u5305\u7EDC",children:"#"}),"AHDSR \u5305\u7EDC"]}),`
`,n(l,{}),`
`,t(e.p,{children:["\u5728\u5411 ",n(e.code,{children:"data"})," \u4E2D\u4F20\u5165 ",n(e.code,{children:"hold"})," \u53C2\u6570\u540E\u5373\u53EF\u5B9E\u73B0 ",n(e.a,{href:"https://support.output.com/hc/en-us/articles/4408642133399-AHDSR-Modulation",target:"_blank",rel:"nofollow",children:"AHDSR"})," \u5305\u7EDC"]}),`
`,t(e.h3,{id:"delay-\u5EF6\u8FDF",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#delay-\u5EF6\u8FDF",children:"#"}),"Delay \u5EF6\u8FDF"]}),`
`,n(c,{}),`
`,t(e.p,{children:["\u5728\u5411 ",n(e.code,{children:"data"})," \u4E2D\u4F20\u5165 ",n(e.code,{children:"delay"})," \u53C2\u6570\u540E\u53EF\u4EE5\u52A0\u5165 ",n(e.code,{children:"delay"})," \u7684\u64CD\u4F5C\u70B9"]}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"envelope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#envelope",children:"#"}),"Envelope"]}),`
`,n(h,{}),`
`,t(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(r,{code:`export interface EnvelopeProps extends React.HTMLAttributes<EnvelopeRef> {
  data: EnvelopeData
  limits?: EnvelopeLimits
  lineColor?: string
  lineWidth?: number
  nodeColor?: string
  nodeSize?: number
  onDataChange?: (data: EnvelopeData) => void
}

export interface EnvelopeData {
  delay?: number
  attack: number
  decay: number
  hold?: number
  sustain: number
  release: number
}

export interface EnvelopeLimits {
  delay?: number
  attack?: number
  hold?: number
  decay?: number
  release?: number
}

export interface EnvelopeRef extends HTMLDivElement {}
`})]})}function y(a={}){const{wrapper:e}=a.components||{};return e?n(e,Object.assign({},a,{children:n(o,a)})):o(a)}const k="2024/1/15 18:46:10",g=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Default, AHDSR, DADSR } from '../../src/components/UsageBox/Envelope.tsx'
import { EnvelopeAPITable } from '../../src/components/APITable/Envelope.tsx'

# Envelope \u5305\u7EDC\u63A7\u5236\u5668

Envelope \u662F\u4E00\u4E2A [ADSR](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope) \u5305\u7EDC\u53D1\u751F\u5668\u7684\u53EF\u89C6\u5316\u7EBF\u6027\u4EA4\u4E92\u5F0F\u7EC4\u4EF6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u8BE5\u7EC4\u4EF6\u63A7\u5236 ADSR \u76F8\u5173\u7684\u5C5E\u6027

## \u5F15\u5165

<CodeBlock code={\`import { Envelope } from 'echo-ui'\`} />

## \u4EE3\u7801\u6F14\u793A

<Default />

### AHDSR \u5305\u7EDC

<AHDSR />

\u5728\u5411 \`data\` \u4E2D\u4F20\u5165 \`hold\` \u53C2\u6570\u540E\u5373\u53EF\u5B9E\u73B0 [AHDSR](https://support.output.com/hc/en-us/articles/4408642133399-AHDSR-Modulation) \u5305\u7EDC

### Delay \u5EF6\u8FDF

<DADSR />

\u5728\u5411 \`data\` \u4E2D\u4F20\u5165 \`delay\` \u53C2\u6570\u540E\u53EF\u4EE5\u52A0\u5165 \`delay\` \u7684\u64CD\u4F5C\u70B9

## API

### Envelope

<EnvelopeAPITable />

## \u7C7B\u578B\u58F0\u660E

<CodeBlock code={\`export interface EnvelopeProps extends React.HTMLAttributes<EnvelopeRef> {
  data: EnvelopeData
  limits?: EnvelopeLimits
  lineColor?: string
  lineWidth?: number
  nodeColor?: string
  nodeSize?: number
  onDataChange?: (data: EnvelopeData) => void
}

export interface EnvelopeData {
  delay?: number
  attack: number
  decay: number
  hold?: number
  sustain: number
  release: number
}

export interface EnvelopeLimits {
  delay?: number
  attack?: number
  hold?: number
  decay?: number
  release?: number
}

export interface EnvelopeRef extends HTMLDivElement {}
\`} />
`;export{g as content,y as default,x as frontmatter,k as lastUpdatedTime,S as title,R as toc};
