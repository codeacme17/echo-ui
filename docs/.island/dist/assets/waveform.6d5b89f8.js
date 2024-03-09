import{jsx as n,jsxs as o,Fragment as i}from"react/jsx-runtime";import{D as m,W as d}from"./Waveform.c657cfca.js";import{C as t}from"./CodeBlock.de027be4.js";import"react";import"./index.a54ae35d.js";import"./index.2d091e0a.js";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";import"./square.1fd110b4.js";import"./pause.0e546ef8.js";import"./play.04387a46.js";const C=void 0,g=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"api",text:"API",depth:2},{id:"waveform",text:"Waveform",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],E="Waveform \u6CE2\u5F62\u56FE";function a(r){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},r.components);return o(i,{children:[o(e.h1,{id:"waveform-\u6CE2\u5F62\u56FE",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform-\u6CE2\u5F62\u56FE",children:"#"}),"Waveform \u6CE2\u5F62\u56FE"]}),`
`,n(e.p,{children:"Waveform \u7EC4\u4EF6\u53EF\u4EE5\u7528\u6765\u5C55\u793A\u6574\u4E2A\u97F3\u9891\u7684\u6CE2\u5F62"}),`
`,o(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(t,{code:"import { Waveform } from 'echo-ui'"}),`
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

`})]})}function D(r={}){const{wrapper:e}=r.components||{};return e?n(e,Object.assign({},r,{children:n(a,r)})):a(r)}const k="2024/1/22 10:38:20",A=`import { Default } from '../../src/components/UsageBox/Waveform.tsx'
import { WaveformAPITable } from '../../src/components/APITable/Waveform.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'

# Waveform \u6CE2\u5F62\u56FE

Waveform \u7EC4\u4EF6\u53EF\u4EE5\u7528\u6765\u5C55\u793A\u6574\u4E2A\u97F3\u9891\u7684\u6CE2\u5F62

## \u5F15\u5165

<CodeBlock code={\`import { Waveform } from 'echo-ui'\`} />

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
`;export{A as content,D as default,C as frontmatter,k as lastUpdatedTime,E as title,g as toc};
