import{jsx as n,jsxs as r,Fragment as d}from"react/jsx-runtime";import{C as a}from"./CodeBlock.de027be4.js";import{D as i,A as l,a as c,E as h}from"./Envelope.3ed8336c.js";import"react";import"./index.2d091e0a.js";import"./index.87519544.js";import"./index.3d5bb27b.js";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";const x=void 0,R=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"ahdsr-\u5305\u7EDC",text:"AHDSR \u5305\u7EDC",depth:3},{id:"delay-\u5EF6\u8FDF",text:"Delay \u5EF6\u8FDF",depth:3},{id:"api",text:"API",depth:2},{id:"envelope",text:"Envelope",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],S="Envelope \u5305\u7EDC\u63A7\u5236\u5668";function o(t){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code"},t.components);return r(d,{children:[r(e.h1,{id:"envelope-\u5305\u7EDC\u63A7\u5236\u5668",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#envelope-\u5305\u7EDC\u63A7\u5236\u5668",children:"#"}),"Envelope \u5305\u7EDC\u63A7\u5236\u5668"]}),`
`,r(e.p,{children:["Envelope \u662F\u4E00\u4E2A ",n(e.a,{href:"https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope",target:"_blank",rel:"nofollow",children:"ADSR"})," \u5305\u7EDC\u53D1\u751F\u5668\u7684\u53EF\u89C6\u5316\u7EBF\u6027\u4EA4\u4E92\u5F0F\u7EC4\u4EF6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u8BE5\u7EC4\u4EF6\u63A7\u5236 ADSR \u76F8\u5173\u7684\u5C5E\u6027"]}),`
`,r(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(a,{code:"import { Envelope } from 'echo-ui'"}),`
`,r(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(i,{}),`
`,r(e.h3,{id:"ahdsr-\u5305\u7EDC",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#ahdsr-\u5305\u7EDC",children:"#"}),"AHDSR \u5305\u7EDC"]}),`
`,n(l,{}),`
`,r(e.p,{children:["\u5728\u5411 ",n(e.code,{children:"data"})," \u4E2D\u4F20\u5165 ",n(e.code,{children:"hold"})," \u53C2\u6570\u540E\u5373\u53EF\u5B9E\u73B0 ",n(e.a,{href:"https://support.output.com/hc/en-us/articles/4408642133399-AHDSR-Modulation",target:"_blank",rel:"nofollow",children:"AHDSR"})," \u5305\u7EDC"]}),`
`,r(e.h3,{id:"delay-\u5EF6\u8FDF",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#delay-\u5EF6\u8FDF",children:"#"}),"Delay \u5EF6\u8FDF"]}),`
`,n(c,{}),`
`,r(e.p,{children:["\u5728\u5411 ",n(e.code,{children:"data"})," \u4E2D\u4F20\u5165 ",n(e.code,{children:"delay"})," \u53C2\u6570\u540E\u53EF\u4EE5\u52A0\u5165 ",n(e.code,{children:"delay"})," \u7684\u64CD\u4F5C\u70B9"]}),`
`,r(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(e.h3,{id:"envelope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#envelope",children:"#"}),"Envelope"]}),`
`,n(h,{}),`
`,r(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(a,{code:`export interface EnvelopeProps extends React.HTMLAttributes<EnvelopeRef> {
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
`})]})}function y(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(o,t)})):o(t)}const k="2024/1/15 18:46:10",g=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Default, AHDSR, DADSR } from '../../src/components/UsageBox/Envelope.tsx'\r
import { EnvelopeAPITable } from '../../src/components/APITable/Envelope.tsx'\r
\r
# Envelope \u5305\u7EDC\u63A7\u5236\u5668\r
\r
Envelope \u662F\u4E00\u4E2A [ADSR](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope) \u5305\u7EDC\u53D1\u751F\u5668\u7684\u53EF\u89C6\u5316\u7EBF\u6027\u4EA4\u4E92\u5F0F\u7EC4\u4EF6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u8BE5\u7EC4\u4EF6\u63A7\u5236 ADSR \u76F8\u5173\u7684\u5C5E\u6027\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { Envelope } from 'echo-ui'\`} />\r
\r
## \u4EE3\u7801\u6F14\u793A\r
\r
<Default />\r
\r
### AHDSR \u5305\u7EDC\r
\r
<AHDSR />\r
\r
\u5728\u5411 \`data\` \u4E2D\u4F20\u5165 \`hold\` \u53C2\u6570\u540E\u5373\u53EF\u5B9E\u73B0 [AHDSR](https://support.output.com/hc/en-us/articles/4408642133399-AHDSR-Modulation) \u5305\u7EDC\r
\r
### Delay \u5EF6\u8FDF\r
\r
<DADSR />\r
\r
\u5728\u5411 \`data\` \u4E2D\u4F20\u5165 \`delay\` \u53C2\u6570\u540E\u53EF\u4EE5\u52A0\u5165 \`delay\` \u7684\u64CD\u4F5C\u70B9\r
\r
## API\r
\r
### Envelope\r
\r
<EnvelopeAPITable />\r
\r
## \u7C7B\u578B\u58F0\u660E\r
\r
<CodeBlock code={\`export interface EnvelopeProps extends React.HTMLAttributes<EnvelopeRef> {\r
  data: EnvelopeData\r
  limits?: EnvelopeLimits\r
  lineColor?: string\r
  lineWidth?: number\r
  nodeColor?: string\r
  nodeSize?: number\r
  onDataChange?: (data: EnvelopeData) => void\r
}\r
\r
export interface EnvelopeData {\r
  delay?: number\r
  attack: number\r
  decay: number\r
  hold?: number\r
  sustain: number\r
  release: number\r
}\r
\r
export interface EnvelopeLimits {\r
  delay?: number\r
  attack?: number\r
  hold?: number\r
  decay?: number\r
  release?: number\r
}\r
\r
export interface EnvelopeRef extends HTMLDivElement {}\r
\`} />\r
`;export{g as content,y as default,x as frontmatter,k as lastUpdatedTime,S as title,R as toc};
