import{jsx as n,jsxs as o,Fragment as i}from"react/jsx-runtime";import{D as m,W as s}from"./Waveform.24ae10e7.js";import{C as a}from"./CodeBlock.38325652.js";import"react";import"./index.9f6c8c4d.js";import"./index.2d091e0a.js";import"../client-entry.js";import"./chunk-FXLYF44B.996f6326.js";import"react-dom";import"./square.af379f0c.js";const W=void 0,x=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"api",text:"API",depth:2},{id:"waveform",text:"Waveform",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],g="Waveform";function t(r){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},r.components);return o(i,{children:[o(e.h1,{id:"waveform",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform",children:"#"}),"Waveform"]}),`
`,n(e.p,{children:"Waveform component can be used to display audio waveform"}),`
`,o(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(a,{code:"import { Waveform } from 'echo-ui'"}),`
`,o(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,n(m,{}),`
`,o(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,o(e.h3,{id:"waveform-1",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform-1",children:"#"}),"Waveform"]}),`
`,n(s,{}),`
`,o(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(a,{code:`export interface WaveformProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseMove' | 'onClick'> {
  data: number[] | number[][]
  audioDuration: number
  percentage?: number
  hideCursor?: boolean
  cursorWidth?: number
  cursorColor?: string
  hideCursorLabel?: boolean
  disableAnimation?: boolean
  animationDuration?: number
  waveHeight?: number
  waveColor?: string
  maskColor?: string
  onClick?: (e: WaveformMouseEvent) => void
  onMouseMove?: (e: WaveformMouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

export interface WaveformMouseEvent {
  time: number
  percentage: number
  nativeEvent: React.MouseEvent
}

export interface WaveformRef extends HTMLDivElement {}

`})]})}function C(r={}){const{wrapper:e}=r.components||{};return e?n(e,Object.assign({},r,{children:n(t,r)})):t(r)}const D="2024/1/22 10:38:20",E=`import { Default } from '../../src/components/UsageBox/Waveform.tsx'
import { WaveformAPITable } from '../../src/components/APITable/Waveform.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'

# Waveform

Waveform component can be used to display audio waveform

## Import

<CodeBlock code={\`import { Waveform } from 'echo-ui'\`} />

## Usage

<Default />

## API

### Waveform

<WaveformAPITable />

## Type Declarations

<CodeBlock code={\`export interface WaveformProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseMove' | 'onClick'> {
  data: number[] | number[][]
  audioDuration: number
  percentage?: number
  hideCursor?: boolean
  cursorWidth?: number
  cursorColor?: string
  hideCursorLabel?: boolean
  disableAnimation?: boolean
  animationDuration?: number
  waveHeight?: number
  waveColor?: string
  maskColor?: string
  onClick?: (e: WaveformMouseEvent) => void
  onMouseMove?: (e: WaveformMouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

export interface WaveformMouseEvent {
  time: number
  percentage: number
  nativeEvent: React.MouseEvent
}

export interface WaveformRef extends HTMLDivElement {}

\`} />
`;export{E as content,C as default,W as frontmatter,D as lastUpdatedTime,g as title,x as toc};
