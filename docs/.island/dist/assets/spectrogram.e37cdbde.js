import{jsx as r,jsxs as n,Fragment as i}from"react/jsx-runtime";import{C as a}from"./CodeBlock.d8e569ad.js";import{D as c,A as d,G as m,E as h,S as s}from"./Spectrogram.59220ce9.js";import"react";import"./index.93441784.js";import"./index.105c25bf.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./usePlayer.db8858d9.js";import"./log.83f32a09.js";import"./transform.3e3dfeca.js";import"./index.6eef3859.js";import"./Analyser.9e774fcc.js";import"./line.c32ceb13.js";import"./natural.7ea22fd8.js";import"./area.16ffd65c.js";import"./axis.b2198668.js";import"./index.9726f765.js";import"./usePropsWithGroup.a30eaab0.js";import"./index.17ca28bf.js";import"./assertion.e9357fda.js";import"./useCommandAltClick.cec7174c.js";import"./Filter.b6cdeb55.js";const R=void 0,X=[{id:"\u7279\u6027",text:"\u7279\u6027",depth:2},{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u97F3\u9891\u6570\u636E",text:"\u97F3\u9891\u6570\u636E",depth:3},{id:"\u5750\u6807\u8F74",text:"\u5750\u6807\u8F74",depth:3},{id:"\u7F51\u683C",text:"\u7F51\u683C",depth:3},{id:"\u5E94\u7528\u573A\u666Feq3",text:"\u5E94\u7528\u573A\u666F\uFF1AEQ3",depth:3},{id:"api",text:"API",depth:2},{id:"spectrogram",text:"Spectrogram",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],B="Spectrogram \u9891\u8C31\u56FE";function o(t){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code"},t.components);return n(i,{children:[n(e.h1,{id:"spectrogram-\u9891\u8C31\u56FE",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#spectrogram-\u9891\u8C31\u56FE",children:"#"}),"Spectrogram \u9891\u8C31\u56FE"]}),`
`,r(e.p,{children:"Spectrogram \u7EC4\u4EF6\u662F\u4E00\u4E2A\u7528\u4E8E\u97F3\u9891\u6570\u636E\u53EF\u89C6\u5316\u7684\u9AD8\u7EA7\u3001\u53EF\u5B9A\u5236\u7684\u5DE5\u5177\uFF0C\u5B83\u5E95\u5C42\u57FA\u4E8E D3.js\uFF0C\u6765\u6E32\u67D3\u4EA4\u4E92\u5F0F\u548C\u52A8\u6001\u7684\u9891\u8C31\u663E\u793A\u3002\u8FD9\u4E2A\u7EC4\u4EF6\u5177\u6709\u9AD8\u5EA6\u7684\u53EF\u9002\u5E94\u6027\uFF0C\u975E\u5E38\u9002\u5408\u9700\u8981\u8BE6\u7EC6\u548C\u7CBE\u786E\u97F3\u9891\u9891\u7387\u5206\u6790\u7684\u5E94\u7528"}),`
`,n(e.h2,{id:"\u7279\u6027",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7279\u6027",children:"#"}),"\u7279\u6027"]}),`
`,r(e.p,{children:"Spectrogram \u662F\u4F7F\u7528\u5FEB\u901F\u5085\u91CC\u53F6\u53D8\u6362\uFF08FFT\uFF09\u7684\u5927\u5C0F\u8FDB\u884C\u9891\u8C31\u5206\u6790\u7684\uFF0C\u5B83\u53EF\u4EE5\u5728\u9891\u8C31\u56FE\u4E0A\u663E\u793A\u97F3\u9891\u7684\u9891\u7387\u548C\u80FD\u91CF"}),`
`,n(e.h2,{id:"\u5F15\u5165",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,r(a,{code:"import { Spectrogram } from '@nafr/echo-ui'"}),`
`,n(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,r(c,{}),`
`,n(e.h3,{id:"\u97F3\u9891\u6570\u636E",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u97F3\u9891\u6570\u636E",children:"#"}),"\u97F3\u9891\u6570\u636E"]}),`
`,n(e.p,{children:["\u97F3\u9891\u6570\u636E\u662F\u4E00\u4E2A\u6570\u7EC4\uFF0C\u5B83\u7684\u6BCF\u4E00\u9879\u662F\u4E00\u4E2A\u5BF9\u8C61 ",r(e.code,{children:"SpectrogramDataPoint"}),"\u3002\u5176\u4E2D ",r(e.code,{children:"frequency"})," \u8868\u793A\u9891\u7387\uFF0C",r(e.code,{children:"amplitude"})," \u8868\u793A\u632F\u5E45\uFF0C\u8FD9\u4E9B\u6570\u636E\u90FD\u53EF\u4EE5\u901A\u8FC7 ",r(e.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/",target:"_blank",rel:"nofollow",children:"AnalyserNode"})," \u6765\u83B7\u53D6\u3002\u8FD9\u662F\u8BE5\u5BF9\u8C61\u7684\u7C7B\u578B\u58F0\u660E\uFF1A"]}),`
`,r(a,{code:`interface SpectrogramDataPoint { 
  frequency: number 
  amplitude: number 
}`}),`
`,n(e.h3,{id:"\u5750\u6807\u8F74",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5750\u6807\u8F74",children:"#"}),"\u5750\u6807\u8F74"]}),`
`,r(d,{}),`
`,n(e.p,{children:["\u5750\u6807\u8F74\u7684 X \u8F74\u8DDD\u8868\u793A\u9891\u7387\uFF0CY \u8F74\u8DDD\u8868\u793A\u632F\u5E45\u3002\u5176\u4E2D X \u8F74\u7684\u8303\u56F4\u65E0\u6CD5\u81EA\u5B9A\u4E49\u56E0\u4E3A\u5B83\u662F\u6839\u636E\u97F3\u9891\u7684\u91C7\u6837\u7387\u8BA1\u7B97\u800C\u6765\u7684\uFF0CY \u8F74\u7684\u8303\u56F4\u53EF\u4EE5\u901A\u8FC7\u8BBE\u7F6E ",r(e.code,{children:"amplitudeRange"})," \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49\u3002 X\u3001Y \u8F74\u7684\u5750\u6807\u8868\u53EF\u4EE5\u5206\u522B\u901A\u8FC7 ",r(e.code,{children:"xAxisTicks"})," \u548C ",r(e.code,{children:"yAxisTicks"})," \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49"]}),`
`,n(e.h3,{id:"\u7F51\u683C",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7F51\u683C",children:"#"}),"\u7F51\u683C"]}),`
`,r(m,{}),`
`,r(e.p,{children:"\u7F51\u683C\u662F\u6839\u636E\u5750\u6807\u8F74\u7684\u523B\u5EA6\u6765\u7ED8\u5236\u7684"}),`
`,n(e.h3,{id:"\u5E94\u7528\u573A\u666Feq3",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5E94\u7528\u573A\u666Feq3",children:"#"}),"\u5E94\u7528\u573A\u666F\uFF1AEQ3"]}),`
`,r(h,{}),`
`,r(e.p,{children:"\u4E0A\u9762\u5C55\u793A\u7684\u662F\u4E00\u4E2A EQ3 \u7684\u5E94\u7528\u573A\u666F\uFF0C\u5B83\u662F\u4E00\u4E2A\u4E09\u6BB5\u5F0F\u7684\u5747\u8861\u5668\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8C03\u8282\u4E09\u4E2A\u9891\u6BB5\u7684\u589E\u76CA\u6765\u8C03\u6574\u97F3\u9891\u7684\u97F3\u8272\uFF0C\u4ECE\u800C\u901A\u8FC7 Spectrogram \u7EC4\u4EF6\u6765\u5B9E\u65F6\u663E\u793A\u97F3\u9891\u7684\u53D8\u5316"}),`
`,n(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"spectrogram",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#spectrogram",children:"#"}),"Spectrogram"]}),`
`,r(s,{}),`
`,n(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,r(a,{code:`export interface SpectrogramProps extends React.HTMLAttributes<HTMLDivElement> {
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
`})]})}function j(t={}){const{wrapper:e}=t.components||{};return e?r(e,Object.assign({},t,{children:r(o,t)})):o(t)}const v="2024/3/15 13:46:55",Y=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Default, Axis, Grid, EQ3 } from '../../src/components/UsageBox/Spectrogram.tsx'
import { Link } from '@nextui-org/react'
import { SpectrogramAPITable } from '../../src/components/APITable/Spectrogram.tsx'

# Spectrogram \u9891\u8C31\u56FE

Spectrogram \u7EC4\u4EF6\u662F\u4E00\u4E2A\u7528\u4E8E\u97F3\u9891\u6570\u636E\u53EF\u89C6\u5316\u7684\u9AD8\u7EA7\u3001\u53EF\u5B9A\u5236\u7684\u5DE5\u5177\uFF0C\u5B83\u5E95\u5C42\u57FA\u4E8E D3.js\uFF0C\u6765\u6E32\u67D3\u4EA4\u4E92\u5F0F\u548C\u52A8\u6001\u7684\u9891\u8C31\u663E\u793A\u3002\u8FD9\u4E2A\u7EC4\u4EF6\u5177\u6709\u9AD8\u5EA6\u7684\u53EF\u9002\u5E94\u6027\uFF0C\u975E\u5E38\u9002\u5408\u9700\u8981\u8BE6\u7EC6\u548C\u7CBE\u786E\u97F3\u9891\u9891\u7387\u5206\u6790\u7684\u5E94\u7528

## \u7279\u6027

Spectrogram \u662F\u4F7F\u7528\u5FEB\u901F\u5085\u91CC\u53F6\u53D8\u6362\uFF08FFT\uFF09\u7684\u5927\u5C0F\u8FDB\u884C\u9891\u8C31\u5206\u6790\u7684\uFF0C\u5B83\u53EF\u4EE5\u5728\u9891\u8C31\u56FE\u4E0A\u663E\u793A\u97F3\u9891\u7684\u9891\u7387\u548C\u80FD\u91CF

## \u5F15\u5165

<CodeBlock code={\`import { Spectrogram } from '@nafr/echo-ui'\`} />

## \u4EE3\u7801\u6F14\u793A

<Default />

### \u97F3\u9891\u6570\u636E

\u97F3\u9891\u6570\u636E\u662F\u4E00\u4E2A\u6570\u7EC4\uFF0C\u5B83\u7684\u6BCF\u4E00\u9879\u662F\u4E00\u4E2A\u5BF9\u8C61 \`SpectrogramDataPoint\`\u3002\u5176\u4E2D \`frequency\` \u8868\u793A\u9891\u7387\uFF0C\`amplitude\` \u8868\u793A\u632F\u5E45\uFF0C\u8FD9\u4E9B\u6570\u636E\u90FD\u53EF\u4EE5\u901A\u8FC7 [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/) \u6765\u83B7\u53D6\u3002\u8FD9\u662F\u8BE5\u5BF9\u8C61\u7684\u7C7B\u578B\u58F0\u660E\uFF1A

<CodeBlock
  code={\`interface SpectrogramDataPoint { 
  frequency: number 
  amplitude: number 
}\`}
/>

### \u5750\u6807\u8F74

<Axis />

\u5750\u6807\u8F74\u7684 X \u8F74\u8DDD\u8868\u793A\u9891\u7387\uFF0CY \u8F74\u8DDD\u8868\u793A\u632F\u5E45\u3002\u5176\u4E2D X \u8F74\u7684\u8303\u56F4\u65E0\u6CD5\u81EA\u5B9A\u4E49\u56E0\u4E3A\u5B83\u662F\u6839\u636E\u97F3\u9891\u7684\u91C7\u6837\u7387\u8BA1\u7B97\u800C\u6765\u7684\uFF0CY \u8F74\u7684\u8303\u56F4\u53EF\u4EE5\u901A\u8FC7\u8BBE\u7F6E \`amplitudeRange\` \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49\u3002 X\u3001Y \u8F74\u7684\u5750\u6807\u8868\u53EF\u4EE5\u5206\u522B\u901A\u8FC7 \`xAxisTicks\` \u548C \`yAxisTicks\` \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49

### \u7F51\u683C

<Grid />

\u7F51\u683C\u662F\u6839\u636E\u5750\u6807\u8F74\u7684\u523B\u5EA6\u6765\u7ED8\u5236\u7684

### \u5E94\u7528\u573A\u666F\uFF1AEQ3

<EQ3 />

\u4E0A\u9762\u5C55\u793A\u7684\u662F\u4E00\u4E2A EQ3 \u7684\u5E94\u7528\u573A\u666F\uFF0C\u5B83\u662F\u4E00\u4E2A\u4E09\u6BB5\u5F0F\u7684\u5747\u8861\u5668\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8C03\u8282\u4E09\u4E2A\u9891\u6BB5\u7684\u589E\u76CA\u6765\u8C03\u6574\u97F3\u9891\u7684\u97F3\u8272\uFF0C\u4ECE\u800C\u901A\u8FC7 Spectrogram \u7EC4\u4EF6\u6765\u5B9E\u65F6\u663E\u793A\u97F3\u9891\u7684\u53D8\u5316

## API

### Spectrogram

<SpectrogramAPITable />

## \u7C7B\u578B\u58F0\u660E

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
`;export{Y as content,j as default,R as frontmatter,v as lastUpdatedTime,B as title,X as toc};
