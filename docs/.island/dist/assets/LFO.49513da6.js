import{jsx as r,jsxs as n,Fragment as o}from"react/jsx-runtime";import{D as s,a as c,L as l}from"./LFO.03d250b0.js";import{C as a}from"./CodeBlock.de027be4.js";import"./index.83878d6a.js";import"./index.2d091e0a.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";import"./index.3fdeaba1.js";import"./pause.0e546ef8.js";import"./play.04387a46.js";import"./Filter.9ff151a0.js";const g=void 0,T=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"delay",text:"Delay",depth:3},{id:"api",text:"API",depth:2},{id:"lfo",text:"LFO",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],v="LFO";function i(t){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},t.components);return n(o,{children:[n(e.h1,{id:"lfo",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#lfo",children:"#"}),"LFO"]}),`
`,r(e.p,{children:"The LFO component is a flexible Low Frequency Oscillator (Low Frequency Oscillator) visualization component that provides a highly customizable and performance-optimized waveform display solution."}),`
`,n(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(a,{code:"import { LFO } from 'echo-ui'"}),`
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
`})]})}function w(t={}){const{wrapper:e}=t.components||{};return e?r(e,Object.assign({},t,{children:r(i,t)})):i(t)}const C="2024/3/5 13:46:07",I=`import { Default, Delay } from '../../src/components/UsageBox/LFO.tsx'\r
import { LFOAPITable } from '../../src/components/APITable/LFO.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
\r
# LFO\r
\r
The LFO component is a flexible Low Frequency Oscillator (Low Frequency Oscillator) visualization component that provides a highly customizable and performance-optimized waveform display solution.\r
\r
## Import\r
\r
<CodeBlock code={\`import { LFO } from 'echo-ui'\`} />\r
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
`;export{I as content,w as default,g as frontmatter,C as lastUpdatedTime,v as title,T as toc};
