import{jsx as n,jsxs as o,Fragment as c}from"react/jsx-runtime";import{C as t}from"./CodeBlock.988145ba.js";import{D as s,O as l}from"./Oscilloscope.a7b8a651.js";import"./createLucideIcon.6491784f.js";import"react";import"./index.01d15b5f.js";import"../client-entry.js";import"./chunk-FXLYF44B.30b0c77c.js";import"react-dom";import"./index.5a6550a4.js";import"./Analyser.93bf318f.js";const D=void 0,C=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"api",text:"API",depth:2},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],A="Oscilloscope \u793A\u6CE2\u5668";function i(r){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2"},r.components);return o(c,{children:[o(e.h1,{id:"oscilloscope-\u793A\u6CE2\u5668",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#oscilloscope-\u793A\u6CE2\u5668",children:"#"}),"Oscilloscope \u793A\u6CE2\u5668"]}),`
`,n(e.p,{children:"\u5B9E\u65F6\u53EF\u89C6\u5316\u97F3\u9891\u6CE2\u5F62\uFF0C\u663E\u793A\u4FE1\u53F7\u5E45\u5EA6\u548C\u9891\u7387\u968F\u65F6\u95F4\u7684\u53D8\u5316"}),`
`,o(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(t,{code:"import { Oscilloscope } from 'echo-ui'"}),`
`,o(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(s,{}),`
`,o(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(l,{}),`
`,o(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(t,{code:`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {
  data: OscilloscopeDataPoint[]
  amplitudeRange?: [number, number]
  lineColor?: string
  lineWidth?: number
}

export interface OscilloscopeDataPoint {
  index: number
  amplitude: number
}

export interface OscilloscopeRef extends HTMLDivElement {}
`})]})}function T(r={}){const{wrapper:e}=r.components||{};return e?n(e,Object.assign({},r,{children:n(i,r)})):i(r)}const g="2024/1/14 18:46:31",R=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Defualt } from '../../src/components/UsageBox/Oscilloscope.tsx'\r
import { OscilloscopeAPITable } from '../../src/components/APITable/Oscilloscope.tsx'\r
\r
# Oscilloscope \u793A\u6CE2\u5668\r
\r
\u5B9E\u65F6\u53EF\u89C6\u5316\u97F3\u9891\u6CE2\u5F62\uFF0C\u663E\u793A\u4FE1\u53F7\u5E45\u5EA6\u548C\u9891\u7387\u968F\u65F6\u95F4\u7684\u53D8\u5316\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { Oscilloscope } from 'echo-ui'\`} />\r
\r
## \u4EE3\u7801\u6F14\u793A\r
\r
<Defualt />\r
\r
## API\r
\r
<OscilloscopeAPITable />\r
\r
## \u7C7B\u578B\u58F0\u660E\r
\r
<CodeBlock code={\`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {\r
  data: OscilloscopeDataPoint[]\r
  amplitudeRange?: [number, number]\r
  lineColor?: string\r
  lineWidth?: number\r
}\r
\r
export interface OscilloscopeDataPoint {\r
  index: number\r
  amplitude: number\r
}\r
\r
export interface OscilloscopeRef extends HTMLDivElement {}\r
\`} />\r
`;export{R as content,T as default,D as frontmatter,g as lastUpdatedTime,A as title,C as toc};
