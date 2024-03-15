import{jsx as r,jsxs as n,Fragment as o}from"react/jsx-runtime";import{D as s,a as c,L as l}from"./LFO.e1869149.js";import{C as a}from"./CodeBlock.d8e569ad.js";import"./index.2440eb3f.js";import"./index.93441784.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./index.6eef3859.js";import"./index.fe61fadf.js";import"./usePropsWithGroup.a30eaab0.js";import"./Triangle.2f45397e.js";import"./pause.821e66c4.js";import"./play.c5eb55f2.js";import"./transform.3e3dfeca.js";import"./line.c32ceb13.js";import"./log.83f32a09.js";import"./index.79cba356.js";import"./assertion.e9357fda.js";import"./useCommandAltClick.cec7174c.js";import"./Filter.b6cdeb55.js";const q=void 0,N=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"delay",text:"Delay",depth:3},{id:"api",text:"API",depth:2},{id:"lfo",text:"LFO",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],z="LFO";function i(t){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},t.components);return n(o,{children:[n(e.h1,{id:"lfo",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#lfo",children:"#"}),"LFO"]}),`
`,r(e.p,{children:"The LFO component is a flexible Low Frequency Oscillator (Low Frequency Oscillator) visualization component that provides a highly customizable and performance-optimized waveform display solution."}),`
`,n(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(a,{code:"import { LFO } from '@nafr/echo-ui'"}),`
`,n(e.h2,{id:"usage",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,r(s,{}),`
`,n(e.h3,{id:"delay",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#delay",children:"#"}),"Delay"]}),`
`,r(c,{}),`
`,r(e.p,{children:"Sets the delay time before the waveform starts, in milliseconds (ms). This can be used to create a pause effect before the waveform starts. (Range: 0-1000)"}),`
`,n(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"lfo-1",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#lfo-1",children:"#"}),"LFO"]}),`
`,r(l,{}),`
`,n(e.h2,{id:"type-declarations",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,r(a,{code:`export interface LFOProps extends React.HTMLAttributes<HTMLDivElement> {
  frequency?: number
  amplitude?: number
  delay?: number
  type?: 'sine' | 'square' | 'triangle'
  lineColor?: string
  lineWidth?: number
}

export interface LFORef extends HTMLDivElement {}
`})]})}function B(t={}){const{wrapper:e}=t.components||{};return e?r(e,Object.assign({},t,{children:r(i,t)})):i(t)}const H="2024/3/15 13:46:55",R=`import { Default, Delay } from '../../src/components/UsageBox/LFO.tsx'\r
import { LFOAPITable } from '../../src/components/APITable/LFO.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
\r
# LFO\r
\r
The LFO component is a flexible Low Frequency Oscillator (Low Frequency Oscillator) visualization component that provides a highly customizable and performance-optimized waveform display solution.\r
\r
## Import\r
\r
<CodeBlock code={\`import { LFO } from '@nafr/echo-ui'\`} />\r
\r
## Usage\r
\r
<Default />\r
\r
### Delay\r
\r
<Delay />\r
\r
Sets the delay time before the waveform starts, in milliseconds (ms). This can be used to create a pause effect before the waveform starts. (Range: 0-1000)\r
\r
## API\r
\r
### LFO\r
\r
<LFOAPITable />\r
\r
## Type Declarations\r
\r
<CodeBlock code={\`export interface LFOProps extends React.HTMLAttributes<HTMLDivElement> {\r
  frequency?: number\r
  amplitude?: number\r
  delay?: number\r
  type?: 'sine' | 'square' | 'triangle'\r
  lineColor?: string\r
  lineWidth?: number\r
}\r
\r
export interface LFORef extends HTMLDivElement {}\r
\`} />\r
`;export{R as content,B as default,q as frontmatter,H as lastUpdatedTime,z as title,N as toc};
