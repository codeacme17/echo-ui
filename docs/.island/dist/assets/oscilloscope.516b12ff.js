import{jsx as n,jsxs as t,Fragment as r}from"react/jsx-runtime";import{C as i}from"./CodeBlock.38325652.js";import{D as c,O as s}from"./Oscilloscope.800aea0f.js";import"react";import"./index.2d091e0a.js";import"./index.9f6c8c4d.js";import"../client-entry.js";import"./chunk-FXLYF44B.996f6326.js";import"react-dom";import"./index.194ce9d9.js";import"./Analyser.525c4ea2.js";const D=void 0,P=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"api",text:"API",depth:2},{id:"type-declarations",text:"Type Declarations",depth:2}],T="Oscilloscope";function a(o){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2"},o.components);return t(r,{children:[t(e.h1,{id:"oscilloscope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#oscilloscope",children:"#"}),"Oscilloscope"]}),`
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
`})]})}function y(o={}){const{wrapper:e}=o.components||{};return e?n(e,Object.assign({},o,{children:n(a,o)})):a(o)}const C="2024/1/14 18:46:31",I=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
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
`;export{I as content,y as default,D as frontmatter,C as lastUpdatedTime,T as title,P as toc};
