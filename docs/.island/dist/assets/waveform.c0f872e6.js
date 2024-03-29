import{jsx as n,jsxs as o,Fragment as i}from"react/jsx-runtime";import{D as m,W as d}from"./Waveform.0adda47f.js";import{C as t}from"./CodeBlock.d8e569ad.js";import"react";import"./usePlayer.db8858d9.js";import"./log.83f32a09.js";import"./transform.3e3dfeca.js";import"./index.6eef3859.js";import"./index.105c25bf.js";import"./index.93441784.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./line.c32ceb13.js";import"./area.16ffd65c.js";import"./index.9726f765.js";import"./usePropsWithGroup.a30eaab0.js";import"./square.0deaf827.js";import"./pause.821e66c4.js";import"./play.c5eb55f2.js";const w=void 0,P=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"api",text:"API",depth:2},{id:"waveform",text:"Waveform",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],H="Waveform \u6CE2\u5F62\u56FE";function a(r){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},r.components);return o(i,{children:[o(e.h1,{id:"waveform-\u6CE2\u5F62\u56FE",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform-\u6CE2\u5F62\u56FE",children:"#"}),"Waveform \u6CE2\u5F62\u56FE"]}),`
`,n(e.p,{children:"Waveform \u7EC4\u4EF6\u53EF\u4EE5\u7528\u6765\u5C55\u793A\u6574\u4E2A\u97F3\u9891\u7684\u6CE2\u5F62"}),`
`,o(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(t,{code:"import { Waveform } from '@nafr/echo-ui'"}),`
`,o(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(m,{}),`
`,o(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,o(e.h3,{id:"waveform",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform",children:"#"}),"Waveform"]}),`
`,n(d,{}),`
`,o(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
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

`})]})}function R(r={}){const{wrapper:e}=r.components||{};return e?n(e,Object.assign({},r,{children:n(a,r)})):a(r)}const I="2024/3/15 13:46:55",B=`import { Default } from '../../src/components/UsageBox/Waveform.tsx'
import { WaveformAPITable } from '../../src/components/APITable/Waveform.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'

# Waveform \u6CE2\u5F62\u56FE

Waveform \u7EC4\u4EF6\u53EF\u4EE5\u7528\u6765\u5C55\u793A\u6574\u4E2A\u97F3\u9891\u7684\u6CE2\u5F62

## \u5F15\u5165

<CodeBlock code={\`import { Waveform } from '@nafr/echo-ui'\`} />

## \u4EE3\u7801\u6F14\u793A

<Default />

## API

### Waveform

<WaveformAPITable />

## \u7C7B\u578B\u58F0\u660E

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
`;export{B as content,R as default,w as frontmatter,I as lastUpdatedTime,H as title,P as toc};
