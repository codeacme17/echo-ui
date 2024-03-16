import{jsx as n,jsxs as t,Fragment as i}from"react/jsx-runtime";import{C as a}from"./CodeBlock.d8e569ad.js";import{D as l,A as d,a as p,E as c}from"./Envelope.0176d7d5.js";import"react";import"./index.93441784.js";import"./index.6eef3859.js";import"./index.6b8ad651.js";import"./index.b2cccce0.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./usePropsWithGroup.a30eaab0.js";import"./transform.3e3dfeca.js";import"./line.c32ceb13.js";import"./log.83f32a09.js";import"./index.06c04839.js";import"./assertion.e9357fda.js";import"./useCommandAltClick.cec7174c.js";const T=void 0,I=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"ahdsr-envelope",text:"AHDSR Envelope",depth:3},{id:"delay",text:"Delay",depth:3},{id:"api",text:"API",depth:2},{id:"envelope",text:"Envelope",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],L="Envelope";function r(o){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code"},o.components);return t(i,{children:[t(e.h1,{id:"envelope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#envelope",children:"#"}),"Envelope"]}),`
`,t(e.p,{children:["Envelope is a visual linear interactive component for ",n(e.a,{href:"https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope",target:"_blank",rel:"nofollow",children:"ADSR"})," envelope generator. You can use this component to control properties related to ADSR."]}),`
`,t(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(a,{code:"import { Envelope } from 'echo-ui'"}),`
`,t(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,n(l,{}),`
`,t(e.h3,{id:"ahdsr-envelope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#ahdsr-envelope",children:"#"}),"AHDSR Envelope"]}),`
`,n(d,{}),`
`,t(e.p,{children:["You can achieve ",n(e.a,{href:"https://support.output.com/hc/en-us/articles/4408642133399-AHDSR-Modulation",target:"_blank",rel:"nofollow",children:"AHDSR"})," envelope by passing the ",n(e.code,{children:"hold"})," parameter to the ",n(e.code,{children:"data"})," prop."]}),`
`,t(e.h3,{id:"delay",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#delay",children:"#"}),"Delay"]}),`
`,n(p,{}),`
`,t(e.p,{children:["By passing the ",n(e.code,{children:"delay"})," parameter to the ",n(e.code,{children:"data"})," prop, you can introduce delay points into the envelope."]}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"envelope-1",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#envelope-1",children:"#"}),"Envelope"]}),`
`,n(c,{}),`
`,t(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(a,{code:`export interface EnvelopeProps extends Omit<React.HTMLAttributes<EnvelopeRef>, 'onChange'> {
  data: EnvelopeData
  limits?: EnvelopeLimits
  lineColor?: string
  lineWidth?: number
  nodeColor?: string
  nodeSize?: number
  onChange?: (data: EnvelopeData) => void
  onChangeEnd?: (data: EnvelopeData) => void
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
`})]})}function M(o={}){const{wrapper:e}=o.components||{};return e?n(e,Object.assign({},o,{children:n(r,o)})):r(o)}const P="2024/3/16 12:18:25",B=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Default, AHDSR, DADSR } from '../../src/components/UsageBox/Envelope.tsx'
import { EnvelopeAPITable } from '../../src/components/APITable/Envelope.tsx'

# Envelope

Envelope is a visual linear interactive component for [ADSR](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope) envelope generator. You can use this component to control properties related to ADSR.

## Import

<CodeBlock code={\`import { Envelope } from 'echo-ui'\`} />

## Usage

<Default />

### AHDSR Envelope

<AHDSR />

You can achieve [AHDSR](https://support.output.com/hc/en-us/articles/4408642133399-AHDSR-Modulation) envelope by passing the \`hold\` parameter to the \`data\` prop.

### Delay

<DADSR />

By passing the \`delay\` parameter to the \`data\` prop, you can introduce delay points into the envelope.

## API

### Envelope

<EnvelopeAPITable />

## Type Declarations

<CodeBlock code={\`export interface EnvelopeProps extends Omit<React.HTMLAttributes<EnvelopeRef>, 'onChange'> {
  data: EnvelopeData
  limits?: EnvelopeLimits
  lineColor?: string
  lineWidth?: number
  nodeColor?: string
  nodeSize?: number
  onChange?: (data: EnvelopeData) => void
  onChangeEnd?: (data: EnvelopeData) => void
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
`;export{B as content,M as default,T as frontmatter,P as lastUpdatedTime,L as title,I as toc};
