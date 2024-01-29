import{jsx as n,jsxs as r,Fragment as i}from"react/jsx-runtime";import{C as o}from"./CodeBlock.de027be4.js";import{D as l,A as d,a as p,E as c}from"./Envelope.01b8c46c.js";import"react";import"./index.2d091e0a.js";import"./index.87519544.js";import"./index.e5e3dbe2.js";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";const A=void 0,x=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"ahdsr-envelope",text:"AHDSR Envelope",depth:3},{id:"delay",text:"Delay",depth:3},{id:"api",text:"API",depth:2},{id:"envelope",text:"Envelope",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],g="Envelope";function a(t){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code"},t.components);return r(i,{children:[r(e.h1,{id:"envelope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#envelope",children:"#"}),"Envelope"]}),`
`,r(e.p,{children:["Envelope is a visual linear interactive component for ",n(e.a,{href:"https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope",target:"_blank",rel:"nofollow",children:"ADSR"})," envelope generator. You can use this component to control properties related to ADSR."]}),`
`,r(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(o,{code:"import { Envelope } from 'echo-ui'"}),`
`,r(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,n(l,{}),`
`,r(e.h3,{id:"ahdsr-envelope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#ahdsr-envelope",children:"#"}),"AHDSR Envelope"]}),`
`,n(d,{}),`
`,r(e.p,{children:["You can achieve ",n(e.a,{href:"https://support.output.com/hc/en-us/articles/4408642133399-AHDSR-Modulation",target:"_blank",rel:"nofollow",children:"AHDSR"})," envelope by passing the ",n(e.code,{children:"hold"})," parameter to the ",n(e.code,{children:"data"})," prop."]}),`
`,r(e.h3,{id:"delay",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#delay",children:"#"}),"Delay"]}),`
`,n(p,{}),`
`,r(e.p,{children:["By passing the ",n(e.code,{children:"delay"})," parameter to the ",n(e.code,{children:"data"})," prop, you can introduce delay points into the envelope."]}),`
`,r(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(e.h3,{id:"envelope-1",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#envelope-1",children:"#"}),"Envelope"]}),`
`,n(c,{}),`
`,r(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(o,{code:`export interface EnvelopeProps extends React.HTMLAttributes<EnvelopeRef> {
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
`})]})}function R(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(a,t)})):a(t)}const S="2024/1/15 18:45:10",k=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Default, AHDSR, DADSR } from '../../src/components/UsageBox/Envelope.tsx'\r
import { EnvelopeAPITable } from '../../src/components/APITable/Envelope.tsx'\r
\r
# Envelope\r
\r
Envelope is a visual linear interactive component for [ADSR](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope) envelope generator. You can use this component to control properties related to ADSR.\r
\r
## Import\r
\r
<CodeBlock code={\`import { Envelope } from 'echo-ui'\`} />\r
\r
## Usage\r
\r
<Default />\r
\r
### AHDSR Envelope\r
\r
<AHDSR />\r
\r
You can achieve [AHDSR](https://support.output.com/hc/en-us/articles/4408642133399-AHDSR-Modulation) envelope by passing the \`hold\` parameter to the \`data\` prop.\r
\r
### Delay\r
\r
<DADSR />\r
\r
By passing the \`delay\` parameter to the \`data\` prop, you can introduce delay points into the envelope.\r
\r
## API\r
\r
### Envelope\r
\r
<EnvelopeAPITable />\r
\r
## Type Declarations\r
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
`;export{k as content,R as default,A as frontmatter,S as lastUpdatedTime,g as title,x as toc};
