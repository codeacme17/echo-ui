import{jsx as n,jsxs as t,Fragment as o}from"react/jsx-runtime";import{D as s,a as c,L as l}from"./LFO.d24940d6.js";import{C as a}from"./CodeBlock.d8e569ad.js";import"./index.105c25bf.js";import"./index.93441784.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./index.6eef3859.js";import"./index.9726f765.js";import"./usePropsWithGroup.a30eaab0.js";import"./Triangle.2f45397e.js";import"./pause.821e66c4.js";import"./play.c5eb55f2.js";import"./transform.3e3dfeca.js";import"./line.c32ceb13.js";import"./log.83f32a09.js";import"./index.17ca28bf.js";import"./assertion.e9357fda.js";import"./useCommandAltClick.cec7174c.js";import"./Filter.b6cdeb55.js";const q=void 0,N=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"delay",text:"Delay",depth:3},{id:"api",text:"API",depth:2},{id:"lfo",text:"LFO",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],z="LFO";function i(r){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},r.components);return t(o,{children:[t(e.h1,{id:"lfo",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#lfo",children:"#"}),"LFO"]}),`
`,n(e.p,{children:"The LFO component is a flexible Low Frequency Oscillator (Low Frequency Oscillator) visualization component that provides a highly customizable and performance-optimized waveform display solution."}),`
`,t(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(a,{code:"import { LFO } from '@nafr/echo-ui'"}),`
`,t(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,n(s,{}),`
`,t(e.h3,{id:"delay",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#delay",children:"#"}),"Delay"]}),`
`,n(c,{}),`
`,n(e.p,{children:"Sets the delay time before the waveform starts, in milliseconds (ms). This can be used to create a pause effect before the waveform starts. (Range: 0-1000)"}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"lfo-1",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#lfo-1",children:"#"}),"LFO"]}),`
`,n(l,{}),`
`,t(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(a,{code:`export interface LFOProps extends React.HTMLAttributes<HTMLDivElement> {
  frequency?: number
  amplitude?: number
  delay?: number
  type?: 'sine' | 'square' | 'triangle'
  lineColor?: string
  lineWidth?: number
}

export interface LFORef extends HTMLDivElement {}
`})]})}function B(r={}){const{wrapper:e}=r.components||{};return e?n(e,Object.assign({},r,{children:n(i,r)})):i(r)}const H="2024/3/15 13:46:55",R=`import { Default, Delay } from '../../src/components/UsageBox/LFO.tsx'
import { LFOAPITable } from '../../src/components/APITable/LFO.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'

# LFO

The LFO component is a flexible Low Frequency Oscillator (Low Frequency Oscillator) visualization component that provides a highly customizable and performance-optimized waveform display solution.

## Import

<CodeBlock code={\`import { LFO } from '@nafr/echo-ui'\`} />

## Usage

<Default />

### Delay

<Delay />

Sets the delay time before the waveform starts, in milliseconds (ms). This can be used to create a pause effect before the waveform starts. (Range: 0-1000)

## API

### LFO

<LFOAPITable />

## Type Declarations

<CodeBlock code={\`export interface LFOProps extends React.HTMLAttributes<HTMLDivElement> {
  frequency?: number
  amplitude?: number
  delay?: number
  type?: 'sine' | 'square' | 'triangle'
  lineColor?: string
  lineWidth?: number
}

export interface LFORef extends HTMLDivElement {}
\`} />
`;export{R as content,B as default,q as frontmatter,H as lastUpdatedTime,z as title,N as toc};
