import{jsx as e,jsxs as n,Fragment as i}from"react/jsx-runtime";import{C as a}from"./CodeBlock.de027be4.js";import{D as c,A as d,G as h,E as m,S as s}from"./Spectrogram.9983952d.js";import"react";import"./index.2d091e0a.js";import"./index.83878d6a.js";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";import"./index.3fdeaba1.js";import"./Filter.9ff151a0.js";const P=void 0,C=[{id:"\u7279\u6027",text:"\u7279\u6027",depth:2},{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u97F3\u9891\u6570\u636E",text:"\u97F3\u9891\u6570\u636E",depth:3},{id:"\u5750\u6807\u8F74",text:"\u5750\u6807\u8F74",depth:3},{id:"\u7F51\u683C",text:"\u7F51\u683C",depth:3},{id:"\u5E94\u7528\u573A\u666Feq3",text:"\u5E94\u7528\u573A\u666F\uFF1AEQ3",depth:3},{id:"api",text:"API",depth:2},{id:"spectrogram",text:"Spectrogram",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],k="Spectrogram \u9891\u8C31\u56FE";function o(t){const r=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code"},t.components);return n(i,{children:[n(r.h1,{id:"spectrogram-\u9891\u8C31\u56FE",children:[e(r.a,{className:"header-anchor","aria-hidden":"true",href:"#spectrogram-\u9891\u8C31\u56FE",children:"#"}),"Spectrogram \u9891\u8C31\u56FE"]}),`
`,e(r.p,{children:"Spectrogram \u7EC4\u4EF6\u662F\u4E00\u4E2A\u7528\u4E8E\u97F3\u9891\u6570\u636E\u53EF\u89C6\u5316\u7684\u9AD8\u7EA7\u3001\u53EF\u5B9A\u5236\u7684\u5DE5\u5177\uFF0C\u5B83\u5E95\u5C42\u57FA\u4E8E D3.js\uFF0C\u6765\u6E32\u67D3\u4EA4\u4E92\u5F0F\u548C\u52A8\u6001\u7684\u9891\u8C31\u663E\u793A\u3002\u8FD9\u4E2A\u7EC4\u4EF6\u5177\u6709\u9AD8\u5EA6\u7684\u53EF\u9002\u5E94\u6027\uFF0C\u975E\u5E38\u9002\u5408\u9700\u8981\u8BE6\u7EC6\u548C\u7CBE\u786E\u97F3\u9891\u9891\u7387\u5206\u6790\u7684\u5E94\u7528"}),`
`,n(r.h2,{id:"\u7279\u6027",children:[e(r.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7279\u6027",children:"#"}),"\u7279\u6027"]}),`
`,e(r.p,{children:"Spectrogram \u662F\u4F7F\u7528\u5FEB\u901F\u5085\u91CC\u53F6\u53D8\u6362\uFF08FFT\uFF09\u7684\u5927\u5C0F\u8FDB\u884C\u9891\u8C31\u5206\u6790\u7684\uFF0C\u5B83\u53EF\u4EE5\u5728\u9891\u8C31\u56FE\u4E0A\u663E\u793A\u97F3\u9891\u7684\u9891\u7387\u548C\u80FD\u91CF"}),`
`,n(r.h2,{id:"\u5F15\u5165",children:[e(r.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,e(a,{code:"import { Spectrogram } from 'echo-ui'"}),`
`,n(r.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[e(r.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,e(c,{}),`
`,n(r.h3,{id:"\u97F3\u9891\u6570\u636E",children:[e(r.a,{className:"header-anchor","aria-hidden":"true",href:"#\u97F3\u9891\u6570\u636E",children:"#"}),"\u97F3\u9891\u6570\u636E"]}),`
`,n(r.p,{children:["\u97F3\u9891\u6570\u636E\u662F\u4E00\u4E2A\u6570\u7EC4\uFF0C\u5B83\u7684\u6BCF\u4E00\u9879\u662F\u4E00\u4E2A\u5BF9\u8C61 ",e(r.code,{children:"SpectrogramDataPoint"}),"\u3002\u5176\u4E2D ",e(r.code,{children:"frequency"})," \u8868\u793A\u9891\u7387\uFF0C",e(r.code,{children:"amplitude"})," \u8868\u793A\u632F\u5E45\uFF0C\u8FD9\u4E9B\u6570\u636E\u90FD\u53EF\u4EE5\u901A\u8FC7 ",e(r.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/",target:"_blank",rel:"nofollow",children:"AnalyserNode"})," \u6765\u83B7\u53D6\u3002\u8FD9\u662F\u8BE5\u5BF9\u8C61\u7684\u7C7B\u578B\u58F0\u660E\uFF1A"]}),`
`,e(a,{code:`interface SpectrogramDataPoint { 
  frequency: number 
  amplitude: number 
}`}),`
`,n(r.h3,{id:"\u5750\u6807\u8F74",children:[e(r.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5750\u6807\u8F74",children:"#"}),"\u5750\u6807\u8F74"]}),`
`,e(d,{}),`
`,n(r.p,{children:["\u5750\u6807\u8F74\u7684 X \u8F74\u8DDD\u8868\u793A\u9891\u7387\uFF0CY \u8F74\u8DDD\u8868\u793A\u632F\u5E45\u3002\u5176\u4E2D X \u8F74\u7684\u8303\u56F4\u65E0\u6CD5\u81EA\u5B9A\u4E49\u56E0\u4E3A\u5B83\u662F\u6839\u636E\u97F3\u9891\u7684\u91C7\u6837\u7387\u8BA1\u7B97\u800C\u6765\u7684\uFF0CY \u8F74\u7684\u8303\u56F4\u53EF\u4EE5\u901A\u8FC7\u8BBE\u7F6E ",e(r.code,{children:"amplitudeRange"})," \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49\u3002 X\u3001Y \u8F74\u7684\u5750\u6807\u8868\u53EF\u4EE5\u5206\u522B\u901A\u8FC7 ",e(r.code,{children:"xAxisTicks"})," \u548C ",e(r.code,{children:"yAxisTicks"})," \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49"]}),`
`,n(r.h3,{id:"\u7F51\u683C",children:[e(r.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7F51\u683C",children:"#"}),"\u7F51\u683C"]}),`
`,e(h,{}),`
`,e(r.p,{children:"\u7F51\u683C\u662F\u6839\u636E\u5750\u6807\u8F74\u7684\u523B\u5EA6\u6765\u7ED8\u5236\u7684"}),`
`,n(r.h3,{id:"\u5E94\u7528\u573A\u666Feq3",children:[e(r.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5E94\u7528\u573A\u666Feq3",children:"#"}),"\u5E94\u7528\u573A\u666F\uFF1AEQ3"]}),`
`,e(m,{}),`
`,e(r.p,{children:"\u4E0A\u9762\u5C55\u793A\u7684\u662F\u4E00\u4E2A EQ3 \u7684\u5E94\u7528\u573A\u666F\uFF0C\u5B83\u662F\u4E00\u4E2A\u4E09\u6BB5\u5F0F\u7684\u5747\u8861\u5668\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8C03\u8282\u4E09\u4E2A\u9891\u6BB5\u7684\u589E\u76CA\u6765\u8C03\u6574\u97F3\u9891\u7684\u97F3\u8272\uFF0C\u4ECE\u800C\u901A\u8FC7 Spectrogram \u7EC4\u4EF6\u6765\u5B9E\u65F6\u663E\u793A\u97F3\u9891\u7684\u53D8\u5316"}),`
`,n(r.h2,{id:"api",children:[e(r.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(r.h3,{id:"spectrogram",children:[e(r.a,{className:"header-anchor","aria-hidden":"true",href:"#spectrogram",children:"#"}),"Spectrogram"]}),`
`,e(s,{}),`
`,n(r.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[e(r.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,e(a,{code:`export interface SpectrogramProps extends React.HTMLAttributes<HTMLDivElement> {
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
`})]})}function y(t={}){const{wrapper:r}=t.components||{};return r?e(r,Object.assign({},t,{children:e(o,t)})):o(t)}const N="2024/1/15 18:54:36",E=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Default, Axis, Grid, EQ3 } from '../../src/components/UsageBox/Spectrogram.tsx'\r
import { Link } from '@nextui-org/react'\r
import { SpectrogramAPITable } from '../../src/components/APITable/Spectrogram.tsx'\r
\r
# Spectrogram \u9891\u8C31\u56FE\r
\r
Spectrogram \u7EC4\u4EF6\u662F\u4E00\u4E2A\u7528\u4E8E\u97F3\u9891\u6570\u636E\u53EF\u89C6\u5316\u7684\u9AD8\u7EA7\u3001\u53EF\u5B9A\u5236\u7684\u5DE5\u5177\uFF0C\u5B83\u5E95\u5C42\u57FA\u4E8E D3.js\uFF0C\u6765\u6E32\u67D3\u4EA4\u4E92\u5F0F\u548C\u52A8\u6001\u7684\u9891\u8C31\u663E\u793A\u3002\u8FD9\u4E2A\u7EC4\u4EF6\u5177\u6709\u9AD8\u5EA6\u7684\u53EF\u9002\u5E94\u6027\uFF0C\u975E\u5E38\u9002\u5408\u9700\u8981\u8BE6\u7EC6\u548C\u7CBE\u786E\u97F3\u9891\u9891\u7387\u5206\u6790\u7684\u5E94\u7528\r
\r
## \u7279\u6027\r
\r
Spectrogram \u662F\u4F7F\u7528\u5FEB\u901F\u5085\u91CC\u53F6\u53D8\u6362\uFF08FFT\uFF09\u7684\u5927\u5C0F\u8FDB\u884C\u9891\u8C31\u5206\u6790\u7684\uFF0C\u5B83\u53EF\u4EE5\u5728\u9891\u8C31\u56FE\u4E0A\u663E\u793A\u97F3\u9891\u7684\u9891\u7387\u548C\u80FD\u91CF\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { Spectrogram } from 'echo-ui'\`} />\r
\r
## \u4EE3\u7801\u6F14\u793A\r
\r
<Default />\r
\r
### \u97F3\u9891\u6570\u636E\r
\r
\u97F3\u9891\u6570\u636E\u662F\u4E00\u4E2A\u6570\u7EC4\uFF0C\u5B83\u7684\u6BCF\u4E00\u9879\u662F\u4E00\u4E2A\u5BF9\u8C61 \`SpectrogramDataPoint\`\u3002\u5176\u4E2D \`frequency\` \u8868\u793A\u9891\u7387\uFF0C\`amplitude\` \u8868\u793A\u632F\u5E45\uFF0C\u8FD9\u4E9B\u6570\u636E\u90FD\u53EF\u4EE5\u901A\u8FC7 [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/) \u6765\u83B7\u53D6\u3002\u8FD9\u662F\u8BE5\u5BF9\u8C61\u7684\u7C7B\u578B\u58F0\u660E\uFF1A\r
\r
<CodeBlock\r
  code={\`interface SpectrogramDataPoint { \r
  frequency: number \r
  amplitude: number \r
}\`}\r
/>\r
\r
### \u5750\u6807\u8F74\r
\r
<Axis />\r
\r
\u5750\u6807\u8F74\u7684 X \u8F74\u8DDD\u8868\u793A\u9891\u7387\uFF0CY \u8F74\u8DDD\u8868\u793A\u632F\u5E45\u3002\u5176\u4E2D X \u8F74\u7684\u8303\u56F4\u65E0\u6CD5\u81EA\u5B9A\u4E49\u56E0\u4E3A\u5B83\u662F\u6839\u636E\u97F3\u9891\u7684\u91C7\u6837\u7387\u8BA1\u7B97\u800C\u6765\u7684\uFF0CY \u8F74\u7684\u8303\u56F4\u53EF\u4EE5\u901A\u8FC7\u8BBE\u7F6E \`amplitudeRange\` \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49\u3002 X\u3001Y \u8F74\u7684\u5750\u6807\u8868\u53EF\u4EE5\u5206\u522B\u901A\u8FC7 \`xAxisTicks\` \u548C \`yAxisTicks\` \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49\r
\r
### \u7F51\u683C\r
\r
<Grid />\r
\r
\u7F51\u683C\u662F\u6839\u636E\u5750\u6807\u8F74\u7684\u523B\u5EA6\u6765\u7ED8\u5236\u7684\r
\r
### \u5E94\u7528\u573A\u666F\uFF1AEQ3\r
\r
<EQ3 />\r
\r
\u4E0A\u9762\u5C55\u793A\u7684\u662F\u4E00\u4E2A EQ3 \u7684\u5E94\u7528\u573A\u666F\uFF0C\u5B83\u662F\u4E00\u4E2A\u4E09\u6BB5\u5F0F\u7684\u5747\u8861\u5668\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8C03\u8282\u4E09\u4E2A\u9891\u6BB5\u7684\u589E\u76CA\u6765\u8C03\u6574\u97F3\u9891\u7684\u97F3\u8272\uFF0C\u4ECE\u800C\u901A\u8FC7 Spectrogram \u7EC4\u4EF6\u6765\u5B9E\u65F6\u663E\u793A\u97F3\u9891\u7684\u53D8\u5316\r
\r
## API\r
\r
### Spectrogram\r
\r
<SpectrogramAPITable />\r
\r
## \u7C7B\u578B\u58F0\u660E\r
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
`;export{E as content,y as default,P as frontmatter,N as lastUpdatedTime,k as title,C as toc};
