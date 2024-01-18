import{jsx as n,jsxs as t,Fragment as r}from"react/jsx-runtime";import{C as i}from"./CodeBlock.913859b9.js";import{D as c,O as s}from"./Oscilloscope.856c7d28.js";import"react";import"./index.d5ce5d84.js";import"../client-entry.js";import"./chunk-FXLYF44B.f49f16be.js";import"react-dom";import"./index.5a6550a4.js";import"./Analyser.93bf318f.js";const b=void 0,D=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"api",text:"API",depth:2},{id:"type-declarations",text:"Type Declarations",depth:2}],P="Oscilloscope";function a(o){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2"},o.components);return t(r,{children:[t(e.h1,{id:"oscilloscope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#oscilloscope",children:"#"}),"Oscilloscope"]}),`
`,n(e.p,{children:"Real-time visualization of audio waveform, displaying changes in signal amplitude and frequency over time."}),`
`,t(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(i,{code:"import { Oscilloscope } from 'echo-ui'"}),`
`,t(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,n(c,{}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(s,{}),`
`,t(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(i,{code:`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {
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
`})]})}function T(o={}){const{wrapper:e}=o.components||{};return e?n(e,Object.assign({},o,{children:n(a,o)})):a(o)}const y="2024/1/14 18:46:31",C=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Defualt } from '../../src/components/UsageBox/Oscilloscope.tsx'
import { OscilloscopeAPITable } from '../../src/components/APITable/Oscilloscope.tsx'

# Oscilloscope

Real-time visualization of audio waveform, displaying changes in signal amplitude and frequency over time.

## Import

<CodeBlock code={\`import { Oscilloscope } from 'echo-ui'\`} />

## Usage

<Defualt />

## API

<OscilloscopeAPITable />

## Type Declarations

<CodeBlock code={\`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {
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
\`} />
`;export{C as content,T as default,b as frontmatter,y as lastUpdatedTime,P as title,D as toc};
