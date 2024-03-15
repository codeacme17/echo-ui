import{jsx as r,jsxs as n,Fragment as a}from"react/jsx-runtime";import{D as d,a as c,L as h}from"./LFO.e1869149.js";import{C as i}from"./CodeBlock.d8e569ad.js";import"./index.2440eb3f.js";import"./index.93441784.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./index.6eef3859.js";import"./index.fe61fadf.js";import"./usePropsWithGroup.a30eaab0.js";import"./Triangle.2f45397e.js";import"./pause.821e66c4.js";import"./play.c5eb55f2.js";import"./transform.3e3dfeca.js";import"./line.c32ceb13.js";import"./log.83f32a09.js";import"./index.79cba356.js";import"./assertion.e9357fda.js";import"./useCommandAltClick.cec7174c.js";import"./Filter.b6cdeb55.js";const B=void 0,H=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u5EF6\u8FDF\u8BBE\u7F6E",text:"\u5EF6\u8FDF\u8BBE\u7F6E",depth:3},{id:"api",text:"API",depth:2},{id:"lfo",text:"LFO",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],k="LFO \u4F4E\u9891\u632F\u8361\u5668";function o(t){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},t.components);return n(a,{children:[n(e.h1,{id:"lfo-\u4F4E\u9891\u632F\u8361\u5668",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#lfo-\u4F4E\u9891\u632F\u8361\u5668",children:"#"}),"LFO \u4F4E\u9891\u632F\u8361\u5668"]}),`
`,r(e.p,{children:"LFO \u7EC4\u4EF6\u662F\u4E00\u4E2A\u7075\u6D3B\u7684\u4F4E\u9891\u632F\u8361\u5668\uFF08Low Frequency Oscillator\uFF09\u53EF\u89C6\u5316\u7EC4\u4EF6\uFF0C\u63D0\u4F9B\u4E86\u4E00\u4E2A\u9AD8\u5EA6\u53EF\u5B9A\u5236\u548C\u6027\u80FD\u4F18\u5316\u7684\u6CE2\u5F62\u5C55\u793A\u89E3\u51B3\u65B9\u6848"}),`
`,n(e.h2,{id:"\u5F15\u5165",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,r(i,{code:"import { LFO } from '@nafr/echo-ui'"}),`
`,n(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,r(d,{}),`
`,n(e.h3,{id:"\u5EF6\u8FDF\u8BBE\u7F6E",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5EF6\u8FDF\u8BBE\u7F6E",children:"#"}),"\u5EF6\u8FDF\u8BBE\u7F6E"]}),`
`,r(c,{}),`
`,r(e.p,{children:"\u8BBE\u7F6E\u6CE2\u5F62\u5F00\u59CB\u4E4B\u524D\u7684\u5EF6\u8FDF\u65F6\u95F4\uFF0C\u4EE5\u6BEB\u79D2 (ms) \u4E3A\u5355\u4F4D\u3002 \u8FD9\u53EF\u7528\u4E8E\u5728\u6CE2\u5F62\u5F00\u59CB\u4E4B\u524D\u521B\u5EFA\u6682\u505C\u6548\u679C\u3002 \uFF08\u8303\u56F4\uFF1A0-1000\uFF09"}),`
`,n(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"lfo",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#lfo",children:"#"}),"LFO"]}),`
`,r(h,{}),`
`,n(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,r(i,{code:`export interface LFOProps extends React.HTMLAttributes<HTMLDivElement> {
  frequency?: number
  amplitude?: number
  delay?: number
  type?: 'sine' | 'square' | 'triangle'
  lineColor?: string
  lineWidth?: number
}

export interface LFORef extends HTMLDivElement {}
`})]})}function j(t={}){const{wrapper:e}=t.components||{};return e?r(e,Object.assign({},t,{children:r(o,t)})):o(t)}const v="2024/3/15 13:46:55",E=`import { Default, Delay } from '../../src/components/UsageBox/LFO.tsx'\r
import { LFOAPITable } from '../../src/components/APITable/LFO.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
\r
# LFO \u4F4E\u9891\u632F\u8361\u5668\r
\r
LFO \u7EC4\u4EF6\u662F\u4E00\u4E2A\u7075\u6D3B\u7684\u4F4E\u9891\u632F\u8361\u5668\uFF08Low Frequency Oscillator\uFF09\u53EF\u89C6\u5316\u7EC4\u4EF6\uFF0C\u63D0\u4F9B\u4E86\u4E00\u4E2A\u9AD8\u5EA6\u53EF\u5B9A\u5236\u548C\u6027\u80FD\u4F18\u5316\u7684\u6CE2\u5F62\u5C55\u793A\u89E3\u51B3\u65B9\u6848\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { LFO } from '@nafr/echo-ui'\`} />\r
\r
## \u4EE3\u7801\u6F14\u793A\r
\r
<Default />\r
\r
### \u5EF6\u8FDF\u8BBE\u7F6E\r
\r
<Delay />\r
\r
\u8BBE\u7F6E\u6CE2\u5F62\u5F00\u59CB\u4E4B\u524D\u7684\u5EF6\u8FDF\u65F6\u95F4\uFF0C\u4EE5\u6BEB\u79D2 (ms) \u4E3A\u5355\u4F4D\u3002 \u8FD9\u53EF\u7528\u4E8E\u5728\u6CE2\u5F62\u5F00\u59CB\u4E4B\u524D\u521B\u5EFA\u6682\u505C\u6548\u679C\u3002 \uFF08\u8303\u56F4\uFF1A0-1000\uFF09\r
\r
## API\r
\r
### LFO\r
\r
<LFOAPITable />\r
\r
## \u7C7B\u578B\u58F0\u660E\r
\r
<CodeBlock code={\`export interface LFOProps extends React.HTMLAttributes<HTMLDivElement> {\r
  frequency?: number\r
  amplitude?: number\r
  delay?: number\r
  type?: 'sine' | 'square' | 'triangle'\r
  lineColor?: string\r
  lineWidth?: number\r
}\r
\r
export interface LFORef extends HTMLDivElement {}\r
\`} />\r
`;export{E as content,j as default,B as frontmatter,v as lastUpdatedTime,k as title,H as toc};
