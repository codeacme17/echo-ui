import{jsx as r,jsxs as n,Fragment as i}from"react/jsx-runtime";import{D as m,W as d}from"./Waveform.217f94ad.js";import{C as t}from"./CodeBlock.d8e569ad.js";import"react";import"./usePlayer.db8858d9.js";import"./log.83f32a09.js";import"./transform.3e3dfeca.js";import"./index.6eef3859.js";import"./index.60566919.js";import"./index.93441784.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./line.c32ceb13.js";import"./area.16ffd65c.js";import"./index.4d4f9478.js";import"./usePropsWithGroup.a30eaab0.js";import"./square.0deaf827.js";import"./pause.821e66c4.js";import"./play.c5eb55f2.js";const w=void 0,P=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"api",text:"API",depth:2},{id:"waveform",text:"Waveform",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],H="Waveform \u6CE2\u5F62\u56FE";function a(o){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},o.components);return n(i,{children:[n(e.h1,{id:"waveform-\u6CE2\u5F62\u56FE",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform-\u6CE2\u5F62\u56FE",children:"#"}),"Waveform \u6CE2\u5F62\u56FE"]}),`
`,r(e.p,{children:"Waveform \u7EC4\u4EF6\u53EF\u4EE5\u7528\u6765\u5C55\u793A\u6574\u4E2A\u97F3\u9891\u7684\u6CE2\u5F62"}),`
`,n(e.h2,{id:"\u5F15\u5165",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,r(t,{code:"import { Waveform } from 'echo-ui'"}),`
`,n(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,r(m,{}),`
`,n(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"waveform",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform",children:"#"}),"Waveform"]}),`
`,r(d,{}),`
`,n(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,r(t,{code:`export interface WaveformProps
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

`})]})}function R(o={}){const{wrapper:e}=o.components||{};return e?r(e,Object.assign({},o,{children:r(a,o)})):a(o)}const I="2024/1/22 10:38:20",B=`import { Default } from '../../src/components/UsageBox/Waveform.tsx'\r
import { WaveformAPITable } from '../../src/components/APITable/Waveform.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
\r
# Waveform \u6CE2\u5F62\u56FE\r
\r
Waveform \u7EC4\u4EF6\u53EF\u4EE5\u7528\u6765\u5C55\u793A\u6574\u4E2A\u97F3\u9891\u7684\u6CE2\u5F62\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { Waveform } from 'echo-ui'\`} />\r
\r
## \u4EE3\u7801\u6F14\u793A\r
\r
<Default />\r
\r
## API\r
\r
### Waveform\r
\r
<WaveformAPITable />\r
\r
## \u7C7B\u578B\u58F0\u660E\r
\r
<CodeBlock code={\`export interface WaveformProps\r
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseMove' | 'onClick'> {\r
  data: number[] | number[][]\r
  audioDuration: number\r
  percentage?: number\r
  hideCursor?: boolean\r
  cursorWidth?: number\r
  cursorColor?: string\r
  hideCursorLabel?: boolean\r
  disableAnimation?: boolean\r
  animationDuration?: number\r
  waveHeight?: number\r
  waveColor?: string\r
  maskColor?: string\r
  onClick?: (e: WaveformMouseEvent) => void\r
  onMouseMove?: (e: WaveformMouseEvent) => void\r
  onMouseLeave?: (e: React.MouseEvent) => void\r
}\r
\r
export interface WaveformMouseEvent {\r
  time: number\r
  percentage: number\r
  nativeEvent: React.MouseEvent\r
}\r
\r
export interface WaveformRef extends HTMLDivElement {}\r
\r
\`} />\r
`;export{B as content,R as default,w as frontmatter,I as lastUpdatedTime,H as title,P as toc};
