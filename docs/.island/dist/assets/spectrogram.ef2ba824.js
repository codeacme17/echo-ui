import{jsx as r,jsxs as a,Fragment as o}from"react/jsx-runtime";import{C as t}from"./CodeBlock.de027be4.js";import{D as s,A as d,G as c,E as h,S as p}from"./Spectrogram.9912f8c2.js";import"react";import"./index.2d091e0a.js";import"./index.39708e08.js";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";import"./index.87519544.js";const A=void 0,D=[{id:"features",text:"Features",depth:2},{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"audio-data",text:"Audio Data",depth:3},{id:"axis",text:"Axis",depth:3},{id:"grid",text:"Grid",depth:3},{id:"use-case-eq3",text:"Use Case: EQ3",depth:3},{id:"api",text:"API",depth:2},{id:"spectrogram",text:"Spectrogram",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],q="Spectrogram";function i(n){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code"},n.components);return a(o,{children:[a(e.h1,{id:"spectrogram",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#spectrogram",children:"#"}),"Spectrogram"]}),`
`,r(e.p,{children:"The Spectrogram component is an advanced and customizable tool for visualizing audio data. It is built on top of D3.js to render interactive and dynamic spectrum displays. This component offers high adaptability and is perfect for applications that require detailed and precise audio frequency analysis."}),`
`,a(e.h2,{id:"features",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#features",children:"#"}),"Features"]}),`
`,r(e.p,{children:"The Spectrogram performs spectrum analysis using the Fast Fourier Transform (FFT) with the ability to display audio frequency and energy on the spectrum chart."}),`
`,a(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(t,{code:"import { Spectrogram } from 'echo-ui'"}),`
`,a(e.h2,{id:"usage",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,r(s,{}),`
`,a(e.h3,{id:"audio-data",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#audio-data",children:"#"}),"Audio Data"]}),`
`,a(e.p,{children:["Audio data is an array, where each item is an object of type ",r(e.code,{children:"SpectrogramDataPoint"}),". ",r(e.code,{children:"frequency"})," represents the frequency, and ",r(e.code,{children:"amplitude"})," represents the amplitude. This data can be obtained through the ",r(e.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/",target:"_blank",rel:"nofollow",children:"AnalyserNode"}),". Here's the type declaration for this object:"]}),`
`,r(t,{code:`interface SpectrogramDataPoint { 
  frequency: number 
  amplitude: number 
}`}),`
`,a(e.h3,{id:"axis",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#axis",children:"#"}),"Axis"]}),`
`,r(d,{}),`
`,a(e.p,{children:["The X-axis of the axis represents frequency, and the Y-axis represents amplitude. The range of the X-axis cannot be customized as it is calculated based on the audio's sampling rate. The range of the Y-axis can be customized by setting the ",r(e.code,{children:"amplitudeRange"})," property. The coordinate labels for the X and Y axes can be customized using the ",r(e.code,{children:"xAxisTicks"})," and ",r(e.code,{children:"yAxisTicks"})," properties, respectively."]}),`
`,a(e.h3,{id:"grid",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#grid",children:"#"}),"Grid"]}),`
`,r(c,{}),`
`,r(e.p,{children:"The grid is drawn based on the axis's scales."}),`
`,a(e.h3,{id:"use-case-eq3",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#use-case-eq3",children:"#"}),"Use Case: EQ3"]}),`
`,r(h,{}),`
`,r(e.p,{children:"The above example shows an application scenario of an EQ3, which is a three-band equalizer. It allows adjusting the audio's timbre by adjusting the gain of three frequency bands and real-time display of audio changes using the Spectrogram component."}),`
`,a(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,a(e.h3,{id:"spectrogram-1",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#spectrogram-1",children:"#"}),"Spectrogram"]}),`
`,r(p,{}),`
`,a(e.h2,{id:"type-declarations",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,r(t,{code:`export interface SpectrogramProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SpectrogramDataPoint[]
  fftSize?: number
  amplitudeRange?: [number, number]
  lineColor?: string
  lineWidth?: number
  axis?: boolean
  axisColor?: string
  xAxisTicks?: number[]
  yAxisTicks?: number[]
  grid?: boolean
  gridColor?: string
  shadow?: boolean
  shadowColor?: string
  shadowDirection?: 'top' | 'bottom'
  shadowHeight?: number
}

export interface SpectrogramDataPoint {
  frequency: number
  amplitude: number
}

export interface SpectrogramRef extends HTMLDivElement {}
`})]})}function w(n={}){const{wrapper:e}=n.components||{};return e?r(e,Object.assign({},n,{children:r(i,n)})):i(n)}const C="2024/1/15 18:54:36",P=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Default, Axis, Grid, EQ3 } from '../../src/components/UsageBox/Spectrogram.tsx'\r
import { SpectrogramAPITable } from '../../src/components/APITable/Spectrogram.tsx'\r
\r
# Spectrogram\r
\r
The Spectrogram component is an advanced and customizable tool for visualizing audio data. It is built on top of D3.js to render interactive and dynamic spectrum displays. This component offers high adaptability and is perfect for applications that require detailed and precise audio frequency analysis.\r
\r
## Features\r
\r
The Spectrogram performs spectrum analysis using the Fast Fourier Transform (FFT) with the ability to display audio frequency and energy on the spectrum chart.\r
\r
## Import\r
\r
<CodeBlock code={\`import { Spectrogram } from 'echo-ui'\`} />\r
\r
## Usage\r
\r
<Default />\r
\r
### Audio Data\r
\r
Audio data is an array, where each item is an object of type \`SpectrogramDataPoint\`. \`frequency\` represents the frequency, and \`amplitude\` represents the amplitude. This data can be obtained through the [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/). Here's the type declaration for this object:\r
\r
<CodeBlock\r
  code={\`interface SpectrogramDataPoint { \r
  frequency: number \r
  amplitude: number \r
}\`}\r
/>\r
\r
### Axis\r
\r
<Axis />\r
\r
The X-axis of the axis represents frequency, and the Y-axis represents amplitude. The range of the X-axis cannot be customized as it is calculated based on the audio's sampling rate. The range of the Y-axis can be customized by setting the \`amplitudeRange\` property. The coordinate labels for the X and Y axes can be customized using the \`xAxisTicks\` and \`yAxisTicks\` properties, respectively.\r
\r
### Grid\r
\r
<Grid />\r
\r
The grid is drawn based on the axis's scales.\r
\r
### Use Case: EQ3\r
\r
<EQ3 />\r
\r
The above example shows an application scenario of an EQ3, which is a three-band equalizer. It allows adjusting the audio's timbre by adjusting the gain of three frequency bands and real-time display of audio changes using the Spectrogram component.\r
\r
## API\r
\r
### Spectrogram\r
\r
<SpectrogramAPITable />\r
\r
## Type Declarations\r
\r
<CodeBlock\r
  code={\`export interface SpectrogramProps extends React.HTMLAttributes<HTMLDivElement> {\r
  data: SpectrogramDataPoint[]\r
  fftSize?: number\r
  amplitudeRange?: [number, number]\r
  lineColor?: string\r
  lineWidth?: number\r
  axis?: boolean\r
  axisColor?: string\r
  xAxisTicks?: number[]\r
  yAxisTicks?: number[]\r
  grid?: boolean\r
  gridColor?: string\r
  shadow?: boolean\r
  shadowColor?: string\r
  shadowDirection?: 'top' | 'bottom'\r
  shadowHeight?: number\r
}\r
\r
export interface SpectrogramDataPoint {\r
  frequency: number\r
  amplitude: number\r
}\r
\r
export interface SpectrogramRef extends HTMLDivElement {}\r
\`} />\r
`;export{P as content,w as default,A as frontmatter,C as lastUpdatedTime,q as title,D as toc};
