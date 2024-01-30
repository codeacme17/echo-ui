import{jsx as r,jsxs as n,Fragment as i}from"react/jsx-runtime";import{D as m,W as s}from"./Waveform.34d2d5f7.js";import{C as a}from"./CodeBlock.de027be4.js";import"react";import"./index.39708e08.js";import"./index.2d091e0a.js";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";import"./square.e4e6b4e9.js";const W=void 0,x=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"api",text:"API",depth:2},{id:"waveform",text:"Waveform",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],g="Waveform";function t(o){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},o.components);return n(i,{children:[n(e.h1,{id:"waveform",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform",children:"#"}),"Waveform"]}),`
`,r(e.p,{children:"Waveform component can be used to display audio waveform"}),`
`,n(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(a,{code:"import { Waveform } from 'echo-ui'"}),`
`,n(e.h2,{id:"usage",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,r(m,{}),`
`,n(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"waveform-1",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#waveform-1",children:"#"}),"Waveform"]}),`
`,r(s,{}),`
`,n(e.h2,{id:"type-declarations",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,r(a,{code:`export interface WaveformProps
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

`})]})}function C(o={}){const{wrapper:e}=o.components||{};return e?r(e,Object.assign({},o,{children:r(t,o)})):t(o)}const D="2024/1/22 10:38:20",E=`import { Default } from '../../src/components/UsageBox/Waveform.tsx'\r
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
`;export{E as content,C as default,W as frontmatter,D as lastUpdatedTime,g as title,x as toc};
