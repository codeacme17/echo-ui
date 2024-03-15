import{jsx as r,jsxs as n,Fragment as a}from"react/jsx-runtime";import{C as t}from"./CodeBlock.d8e569ad.js";import{D as c,O as s}from"./Oscilloscope.35db0a26.js";import"react";import"./index.93441784.js";import"./index.60566919.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./usePlayer.db8858d9.js";import"./log.83f32a09.js";import"./transform.3e3dfeca.js";import"./index.6eef3859.js";import"./Analyser.9e774fcc.js";import"./line.c32ceb13.js";import"./natural.7ea22fd8.js";import"./index.4d4f9478.js";import"./usePropsWithGroup.a30eaab0.js";const A=void 0,v=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"api",text:"API",depth:2},{id:"type-declarations",text:"Type Declarations",depth:2}],M="Oscilloscope";function i(o){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2"},o.components);return n(a,{children:[n(e.h1,{id:"oscilloscope",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#oscilloscope",children:"#"}),"Oscilloscope"]}),`
`,r(e.p,{children:"Real-time visualization of audio waveform, displaying changes in signal amplitude and frequency over time."}),`
`,n(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(t,{code:"import { Oscilloscope } from 'echo-ui'"}),`
`,n(e.h2,{id:"usage",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,r(c,{}),`
`,n(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(s,{}),`
`,n(e.h2,{id:"type-declarations",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,r(t,{code:`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {
  data: OscilloscopeDataPoint[]
  amplitudeRange?: [number, number]
  lineColor?: string
  lineWidth?: number
}

export interface OscilloscopeDataPoint {
  index: number
  amplitude: number
}

export interface OscilloscopeRef extends HTMLDivElement {}
`})]})}function B(o={}){const{wrapper:e}=o.components||{};return e?r(e,Object.assign({},o,{children:r(i,o)})):i(o)}const k="2024/1/14 18:46:31",L=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Defualt } from '../../src/components/UsageBox/Oscilloscope.tsx'\r
import { OscilloscopeAPITable } from '../../src/components/APITable/Oscilloscope.tsx'\r
\r
# Oscilloscope\r
\r
Real-time visualization of audio waveform, displaying changes in signal amplitude and frequency over time.\r
\r
## Import\r
\r
<CodeBlock code={\`import { Oscilloscope } from 'echo-ui'\`} />\r
\r
## Usage\r
\r
<Defualt />\r
\r
## API\r
\r
<OscilloscopeAPITable />\r
\r
## Type Declarations\r
\r
<CodeBlock code={\`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {\r
  data: OscilloscopeDataPoint[]\r
  amplitudeRange?: [number, number]\r
  lineColor?: string\r
  lineWidth?: number\r
}\r
\r
export interface OscilloscopeDataPoint {\r
  index: number\r
  amplitude: number\r
}\r
\r
export interface OscilloscopeRef extends HTMLDivElement {}\r
\`} />\r
`;export{L as content,B as default,A as frontmatter,k as lastUpdatedTime,M as title,v as toc};
