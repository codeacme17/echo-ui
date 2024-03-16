import{jsx as n,jsxs as t,Fragment as a}from"react/jsx-runtime";import{C as i}from"./CodeBlock.d8e569ad.js";import{D as c,O as s}from"./Oscilloscope.88c244fa.js";import"react";import"./index.93441784.js";import"./index.105c25bf.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./usePlayer.db8858d9.js";import"./log.83f32a09.js";import"./transform.3e3dfeca.js";import"./index.6eef3859.js";import"./Analyser.9e774fcc.js";import"./line.c32ceb13.js";import"./natural.7ea22fd8.js";import"./index.9726f765.js";import"./usePropsWithGroup.a30eaab0.js";const A=void 0,v=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"api",text:"API",depth:2},{id:"type-declarations",text:"Type Declarations",depth:2}],M="Oscilloscope";function r(o){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2"},o.components);return t(a,{children:[t(e.h1,{id:"oscilloscope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#oscilloscope",children:"#"}),"Oscilloscope"]}),`
`,n(e.p,{children:"Real-time visualization of audio waveform, displaying changes in signal amplitude and frequency over time."}),`
`,t(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(i,{code:"import { Oscilloscope } from '@nafr/echo-ui'"}),`
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
`})]})}function B(o={}){const{wrapper:e}=o.components||{};return e?n(e,Object.assign({},o,{children:n(r,o)})):r(o)}const k="2024/3/15 13:46:55",L=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Defualt } from '../../src/components/UsageBox/Oscilloscope.tsx'
import { OscilloscopeAPITable } from '../../src/components/APITable/Oscilloscope.tsx'

# Oscilloscope

Real-time visualization of audio waveform, displaying changes in signal amplitude and frequency over time.

## Import

<CodeBlock code={\`import { Oscilloscope } from '@nafr/echo-ui'\`} />

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
