import{jsx as r,jsxs as n,Fragment as i}from"react/jsx-runtime";import{D as m,W as s}from"./Waveform.45048d3f.js";import{C as t}from"./CodeBlock.d8e569ad.js";import"react";import"./usePlayer.db8858d9.js";import"./log.83f32a09.js";import"./transform.3e3dfeca.js";import"./index.6eef3859.js";import"./index.036b4c00.js";import"./index.93441784.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./line.c32ceb13.js";import"./area.16ffd65c.js";import"./index.5d772633.js";import"./usePropsWithGroup.a30eaab0.js";import"./square.0deaf827.js";import"./pause.821e66c4.js";import"./play.c5eb55f2.js";const L=void 0,I=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"api",text:"API",depth:2},{id:"waveform",text:"Waveform",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],y="Waveform";function a(o){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},o.components);return n(i,{children:[n(e.h1,{id:"waveform",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform",children:"#"}),"Waveform"]}),`
`,r(e.p,{children:"Waveform component can be used to display audio waveform"}),`
`,n(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(t,{code:"import { Waveform } from 'echo-ui'"}),`
`,n(e.h2,{id:"usage",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,r(m,{}),`
`,n(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"waveform-1",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform-1",children:"#"}),"Waveform"]}),`
`,r(s,{}),`
`,n(e.h2,{id:"type-declarations",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
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

`})]})}function P(o={}){const{wrapper:e}=o.components||{};return e?r(e,Object.assign({},o,{children:r(a,o)})):a(o)}const H="2024/1/22 10:38:20",R=`import { Default } from '../../src/components/UsageBox/Waveform.tsx'\r
import { WaveformAPITable } from '../../src/components/APITable/Waveform.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
\r
# Waveform\r
\r
Waveform component can be used to display audio waveform\r
\r
## Import\r
\r
<CodeBlock code={\`import { Waveform } from 'echo-ui'\`} />\r
\r
## Usage\r
\r
<Default />\r
\r
## API\r
\r
### Waveform\r
\r
<WaveformAPITable />\r
\r
## Type Declarations\r
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
`;export{R as content,P as default,L as frontmatter,H as lastUpdatedTime,y as title,I as toc};
