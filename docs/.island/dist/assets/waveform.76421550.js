import{jsx as n,jsxs as o,Fragment as i}from"react/jsx-runtime";import{D as m,W as s}from"./Waveform.0adda47f.js";import{C as t}from"./CodeBlock.d8e569ad.js";import"react";import"./usePlayer.db8858d9.js";import"./log.83f32a09.js";import"./transform.3e3dfeca.js";import"./index.6eef3859.js";import"./index.105c25bf.js";import"./index.93441784.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./line.c32ceb13.js";import"./area.16ffd65c.js";import"./index.9726f765.js";import"./usePropsWithGroup.a30eaab0.js";import"./square.0deaf827.js";import"./pause.821e66c4.js";import"./play.c5eb55f2.js";const L=void 0,I=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"api",text:"API",depth:2},{id:"waveform",text:"Waveform",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],y="Waveform";function a(r){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},r.components);return o(i,{children:[o(e.h1,{id:"waveform",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform",children:"#"}),"Waveform"]}),`
`,n(e.p,{children:"Waveform component can be used to display audio waveform"}),`
`,o(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(t,{code:"import { Waveform } from '@nafr/echo-ui'"}),`
`,o(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,n(m,{}),`
`,o(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,o(e.h3,{id:"waveform-1",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform-1",children:"#"}),"Waveform"]}),`
`,n(s,{}),`
`,o(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(t,{code:`export interface WaveformProps
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

`})]})}function P(r={}){const{wrapper:e}=r.components||{};return e?n(e,Object.assign({},r,{children:n(a,r)})):a(r)}const H="2024/3/15 13:46:55",R=`import { Default } from '../../src/components/UsageBox/Waveform.tsx'
import { WaveformAPITable } from '../../src/components/APITable/Waveform.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'

# Waveform

Waveform component can be used to display audio waveform

## Import

<CodeBlock code={\`import { Waveform } from '@nafr/echo-ui'\`} />

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
`;export{R as content,P as default,L as frontmatter,H as lastUpdatedTime,y as title,I as toc};
