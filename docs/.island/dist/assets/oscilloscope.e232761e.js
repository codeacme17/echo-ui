import{jsx as n,jsxs as o,Fragment as a}from"react/jsx-runtime";import{C as t}from"./CodeBlock.988145ba.js";import{D as c,O as s}from"./Oscilloscope.a7b8a651.js";import"./createLucideIcon.6491784f.js";import"react";import"./index.01d15b5f.js";import"../client-entry.js";import"./chunk-FXLYF44B.30b0c77c.js";import"react-dom";import"./index.5a6550a4.js";import"./Analyser.93bf318f.js";const D=void 0,P=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"api",text:"API",depth:2},{id:"type-declarations",text:"Type Declarations",depth:2}],T="Oscilloscope";function i(r){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2"},r.components);return o(a,{children:[o(e.h1,{id:"oscilloscope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#oscilloscope",children:"#"}),"Oscilloscope"]}),`
`,n(e.p,{children:"Real-time visualization of audio waveform, displaying changes in signal amplitude and frequency over time."}),`
`,o(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(t,{code:"import { Oscilloscope } from 'echo-ui'"}),`
`,o(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,n(c,{}),`
`,o(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(s,{}),`
`,o(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(t,{code:`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {
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
`})]})}function y(r={}){const{wrapper:e}=r.components||{};return e?n(e,Object.assign({},r,{children:n(i,r)})):i(r)}const C="2024/1/14 18:46:31",I=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
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
`;export{I as content,y as default,D as frontmatter,C as lastUpdatedTime,T as title,P as toc};