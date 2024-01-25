import{jsx as n,jsxs as t,Fragment as r}from"react/jsx-runtime";import{C as i}from"./CodeBlock.38325652.js";import{D as s,O as l}from"./Oscilloscope.800aea0f.js";import"react";import"./index.2d091e0a.js";import"./index.9f6c8c4d.js";import"../client-entry.js";import"./chunk-FXLYF44B.996f6326.js";import"react-dom";import"./index.194ce9d9.js";import"./Analyser.525c4ea2.js";const D=void 0,C=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"api",text:"API",depth:2},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],A="Oscilloscope \u793A\u6CE2\u5668";function c(o){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2"},o.components);return t(r,{children:[t(e.h1,{id:"oscilloscope-\u793A\u6CE2\u5668",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#oscilloscope-\u793A\u6CE2\u5668",children:"#"}),"Oscilloscope \u793A\u6CE2\u5668"]}),`
`,n(e.p,{children:"\u5B9E\u65F6\u53EF\u89C6\u5316\u97F3\u9891\u6CE2\u5F62\uFF0C\u663E\u793A\u4FE1\u53F7\u5E45\u5EA6\u548C\u9891\u7387\u968F\u65F6\u95F4\u7684\u53D8\u5316"}),`
`,t(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(i,{code:"import { Oscilloscope } from 'echo-ui'"}),`
`,t(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(s,{}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(l,{}),`
`,t(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(i,{code:`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {
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
`})]})}function T(o={}){const{wrapper:e}=o.components||{};return e?n(e,Object.assign({},o,{children:n(c,o)})):c(o)}const g="2024/1/14 18:46:31",R=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Defualt } from '../../src/components/UsageBox/Oscilloscope.tsx'
import { OscilloscopeAPITable } from '../../src/components/APITable/Oscilloscope.tsx'

# Oscilloscope \u793A\u6CE2\u5668

\u5B9E\u65F6\u53EF\u89C6\u5316\u97F3\u9891\u6CE2\u5F62\uFF0C\u663E\u793A\u4FE1\u53F7\u5E45\u5EA6\u548C\u9891\u7387\u968F\u65F6\u95F4\u7684\u53D8\u5316

## \u5F15\u5165

<CodeBlock code={\`import { Oscilloscope } from 'echo-ui'\`} />

## \u4EE3\u7801\u6F14\u793A

<Defualt />

## API

<OscilloscopeAPITable />

## \u7C7B\u578B\u58F0\u660E

<CodeBlock code={\`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {
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
\`} />
`;export{R as content,T as default,D as frontmatter,g as lastUpdatedTime,A as title,C as toc};
