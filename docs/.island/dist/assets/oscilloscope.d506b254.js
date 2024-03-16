import{jsx as n,jsxs as t,Fragment as c}from"react/jsx-runtime";import{C as i}from"./CodeBlock.d8e569ad.js";import{D as s,O as a}from"./Oscilloscope.88c244fa.js";import"react";import"./index.93441784.js";import"./index.105c25bf.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./usePlayer.db8858d9.js";import"./log.83f32a09.js";import"./transform.3e3dfeca.js";import"./index.6eef3859.js";import"./Analyser.9e774fcc.js";import"./line.c32ceb13.js";import"./natural.7ea22fd8.js";import"./index.9726f765.js";import"./usePropsWithGroup.a30eaab0.js";const M=void 0,B=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"api",text:"API",depth:2},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],k="Oscilloscope \u793A\u6CE2\u5668";function r(o){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2"},o.components);return t(c,{children:[t(e.h1,{id:"oscilloscope-\u793A\u6CE2\u5668",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#oscilloscope-\u793A\u6CE2\u5668",children:"#"}),"Oscilloscope \u793A\u6CE2\u5668"]}),`
`,n(e.p,{children:"\u5B9E\u65F6\u53EF\u89C6\u5316\u97F3\u9891\u6CE2\u5F62\uFF0C\u663E\u793A\u4FE1\u53F7\u5E45\u5EA6\u548C\u9891\u7387\u968F\u65F6\u95F4\u7684\u53D8\u5316"}),`
`,t(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(i,{code:"import { Oscilloscope } from '@nafr/echo-ui'"}),`
`,t(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(s,{}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(a,{}),`
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
`})]})}function L(o={}){const{wrapper:e}=o.components||{};return e?n(e,Object.assign({},o,{children:n(r,o)})):r(o)}const N="2024/3/15 13:46:55",j=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Defualt } from '../../src/components/UsageBox/Oscilloscope.tsx'
import { OscilloscopeAPITable } from '../../src/components/APITable/Oscilloscope.tsx'

# Oscilloscope \u793A\u6CE2\u5668

\u5B9E\u65F6\u53EF\u89C6\u5316\u97F3\u9891\u6CE2\u5F62\uFF0C\u663E\u793A\u4FE1\u53F7\u5E45\u5EA6\u548C\u9891\u7387\u968F\u65F6\u95F4\u7684\u53D8\u5316

## \u5F15\u5165

<CodeBlock code={\`import { Oscilloscope } from '@nafr/echo-ui'\`} />

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
`;export{j as content,L as default,M as frontmatter,N as lastUpdatedTime,k as title,B as toc};
