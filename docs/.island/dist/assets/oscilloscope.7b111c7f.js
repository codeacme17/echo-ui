import{jsx as o,jsxs as t,Fragment as a}from"react/jsx-runtime";import{C as i}from"./CodeBlock.d8e569ad.js";import{D as c,O as s}from"./Oscilloscope.ab2890dc.js";import"react";import"./index.93441784.js";import"./index.978ae265.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./usePlayer.db8858d9.js";import"./log.83f32a09.js";import"./transform.3e3dfeca.js";import"./index.6eef3859.js";import"./Analyser.9e774fcc.js";import"./line.c32ceb13.js";import"./natural.7ea22fd8.js";import"./index.2ccb91f8.js";import"./usePropsWithGroup.a30eaab0.js";const A=void 0,v=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"api",text:"API",depth:2},{id:"type-declarations",text:"Type Declarations",depth:2}],M="Oscilloscope";function r(n){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2"},n.components);return t(a,{children:[t(e.h1,{id:"oscilloscope",children:[o(e.a,{className:"header-anchor","aria-hidden":"true",href:"#oscilloscope",children:"#"}),"Oscilloscope"]}),`
`,o(e.p,{children:"Real-time visualization of audio waveform, displaying changes in signal amplitude and frequency over time."}),`
`,t(e.h2,{id:"import",children:[o(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,o(i,{code:"import { Oscilloscope } from 'echo-ui'"}),`
`,t(e.h2,{id:"usage",children:[o(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,o(c,{}),`
`,t(e.h2,{id:"api",children:[o(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,o(s,{}),`
`,t(e.h2,{id:"type-declarations",children:[o(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,o(i,{code:`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {
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
`})]})}function B(n={}){const{wrapper:e}=n.components||{};return e?o(e,Object.assign({},n,{children:o(r,n)})):r(n)}const k="2024/1/14 18:46:31",L=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
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
`;export{L as content,B as default,A as frontmatter,k as lastUpdatedTime,M as title,v as toc};
