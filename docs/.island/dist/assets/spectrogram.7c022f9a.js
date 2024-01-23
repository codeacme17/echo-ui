import{jsx as a,jsxs as n,Fragment as o}from"react/jsx-runtime";import{C as t}from"./CodeBlock.69bc42b0.js";import{D as s,A as d,G as c,E as h,S as p}from"./Spectrogram.8442196f.js";import"react";import"./index.b6b2392c.js";import"../client-entry.js";import"./chunk-FXLYF44B.9f5da3e9.js";import"react-dom";import"./index.194ce9d9.js";import"./Analyser.525c4ea2.js";const A=void 0,D=[{id:"features",text:"Features",depth:2},{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"audio-data",text:"Audio Data",depth:3},{id:"axis",text:"Axis",depth:3},{id:"grid",text:"Grid",depth:3},{id:"use-case-eq3",text:"Use Case: EQ3",depth:3},{id:"api",text:"API",depth:2},{id:"spectrogram",text:"Spectrogram",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],q="Spectrogram";function i(r){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code"},r.components);return n(o,{children:[n(e.h1,{id:"spectrogram",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#spectrogram",children:"#"}),"Spectrogram"]}),`
`,a(e.p,{children:"The Spectrogram component is an advanced and customizable tool for visualizing audio data. It is built on top of D3.js to render interactive and dynamic spectrum displays. This component offers high adaptability and is perfect for applications that require detailed and precise audio frequency analysis."}),`
`,n(e.h2,{id:"features",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#features",children:"#"}),"Features"]}),`
`,a(e.p,{children:"The Spectrogram performs spectrum analysis using the Fast Fourier Transform (FFT) with the ability to display audio frequency and energy on the spectrum chart."}),`
`,n(e.h2,{id:"import",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,a(t,{code:"import { Spectrogram } from 'echo-ui'"}),`
`,n(e.h2,{id:"usage",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,a(s,{}),`
`,n(e.h3,{id:"audio-data",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#audio-data",children:"#"}),"Audio Data"]}),`
`,n(e.p,{children:["Audio data is an array, where each item is an object of type ",a(e.code,{children:"SpectrogramDataPoint"}),". ",a(e.code,{children:"frequency"})," represents the frequency, and ",a(e.code,{children:"amplitude"})," represents the amplitude. This data can be obtained through the ",a(e.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/",target:"_blank",rel:"nofollow",children:"AnalyserNode"}),". Here's the type declaration for this object:"]}),`
`,a(t,{code:`interface SpectrogramDataPoint { 
  frequency: number 
  amplitude: number 
}`}),`
`,n(e.h3,{id:"axis",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#axis",children:"#"}),"Axis"]}),`
`,a(d,{}),`
`,n(e.p,{children:["The X-axis of the axis represents frequency, and the Y-axis represents amplitude. The range of the X-axis cannot be customized as it is calculated based on the audio's sampling rate. The range of the Y-axis can be customized by setting the ",a(e.code,{children:"amplitudeRange"})," property. The coordinate labels for the X and Y axes can be customized using the ",a(e.code,{children:"xAxisTicks"})," and ",a(e.code,{children:"yAxisTicks"})," properties, respectively."]}),`
`,n(e.h3,{id:"grid",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#grid",children:"#"}),"Grid"]}),`
`,a(c,{}),`
`,a(e.p,{children:"The grid is drawn based on the axis's scales."}),`
`,n(e.h3,{id:"use-case-eq3",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#use-case-eq3",children:"#"}),"Use Case: EQ3"]}),`
`,a(h,{}),`
`,a(e.p,{children:"The above example shows an application scenario of an EQ3, which is a three-band equalizer. It allows adjusting the audio's timbre by adjusting the gain of three frequency bands and real-time display of audio changes using the Spectrogram component."}),`
`,n(e.h2,{id:"api",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"spectrogram-1",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#spectrogram-1",children:"#"}),"Spectrogram"]}),`
`,a(p,{}),`
`,n(e.h2,{id:"type-declarations",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,a(t,{code:`export interface SpectrogramProps extends React.HTMLAttributes<HTMLDivElement> {
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
`})]})}function w(r={}){const{wrapper:e}=r.components||{};return e?a(e,Object.assign({},r,{children:a(i,r)})):i(r)}const C="2024/1/15 18:54:36",P=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Default, Axis, Grid, EQ3 } from '../../src/components/UsageBox/Spectrogram.tsx'
import { SpectrogramAPITable } from '../../src/components/APITable/Spectrogram.tsx'

# Spectrogram

The Spectrogram component is an advanced and customizable tool for visualizing audio data. It is built on top of D3.js to render interactive and dynamic spectrum displays. This component offers high adaptability and is perfect for applications that require detailed and precise audio frequency analysis.

## Features

The Spectrogram performs spectrum analysis using the Fast Fourier Transform (FFT) with the ability to display audio frequency and energy on the spectrum chart.

## Import

<CodeBlock code={\`import { Spectrogram } from 'echo-ui'\`} />

## Usage

<Default />

### Audio Data

Audio data is an array, where each item is an object of type \`SpectrogramDataPoint\`. \`frequency\` represents the frequency, and \`amplitude\` represents the amplitude. This data can be obtained through the [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/). Here's the type declaration for this object:

<CodeBlock
  code={\`interface SpectrogramDataPoint { 
  frequency: number 
  amplitude: number 
}\`}
/>

### Axis

<Axis />

The X-axis of the axis represents frequency, and the Y-axis represents amplitude. The range of the X-axis cannot be customized as it is calculated based on the audio's sampling rate. The range of the Y-axis can be customized by setting the \`amplitudeRange\` property. The coordinate labels for the X and Y axes can be customized using the \`xAxisTicks\` and \`yAxisTicks\` properties, respectively.

### Grid

<Grid />

The grid is drawn based on the axis's scales.

### Use Case: EQ3

<EQ3 />

The above example shows an application scenario of an EQ3, which is a three-band equalizer. It allows adjusting the audio's timbre by adjusting the gain of three frequency bands and real-time display of audio changes using the Spectrogram component.

## API

### Spectrogram

<SpectrogramAPITable />

## Type Declarations

<CodeBlock
  code={\`export interface SpectrogramProps extends React.HTMLAttributes<HTMLDivElement> {
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
\`} />
`;export{P as content,w as default,A as frontmatter,C as lastUpdatedTime,q as title,D as toc};
