import{jsx as r,jsxs as n,Fragment as a}from"react/jsx-runtime";import{D as o,O as d,C as c,S as s,L as l}from"./Light.b08bd67d.js";import{C as i}from"./CodeBlock.913859b9.js";import"./index.bf22460a.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.f49f16be.js";import"react-dom";const C=void 0,T=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u5F00\u542F\u72B6\u6001",text:"\u5F00\u542F\u72B6\u6001",depth:3},{id:"\u706F\u5149\u989C\u8272",text:"\u706F\u5149\u989C\u8272",depth:3},{id:"\u5C3A\u5BF8",text:"\u5C3A\u5BF8",depth:3},{id:"api",text:"API",depth:2},{id:"light",text:"Light",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],D="Light \u6307\u793A\u706F";function h(t){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},t.components);return n(a,{children:[n(e.h1,{id:"light-\u6307\u793A\u706F",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#light-\u6307\u793A\u706F",children:"#"}),"Light \u6307\u793A\u706F"]}),`
`,r(e.p,{children:"\u6307\u793A\u706F\u7EC4\u4EF6\u4E3B\u8981\u53EF\u4EE5\u7528\u6765\u5BF9\u67D0\u4E9B\u72B6\u6001\u8FDB\u884C\u6807\u8BB0\uFF0C\u5982\u6548\u679C\u5668\u662F\u5426\u5F00\u542F\u7B49\u72B6\u6001"}),`
`,n(e.h2,{id:"\u5F15\u5165",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,r(i,{code:"import { Light } from 'echo-ui'"}),`
`,n(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,r(o,{}),`
`,n(e.h3,{id:"\u5F00\u542F\u72B6\u6001",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F00\u542F\u72B6\u6001",children:"#"}),"\u5F00\u542F\u72B6\u6001"]}),`
`,r(d,{}),`
`,n(e.h3,{id:"\u706F\u5149\u989C\u8272",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u706F\u5149\u989C\u8272",children:"#"}),"\u706F\u5149\u989C\u8272"]}),`
`,r(c,{}),`
`,n(e.h3,{id:"\u5C3A\u5BF8",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8",children:"#"}),"\u5C3A\u5BF8"]}),`
`,r(s,{}),`
`,n(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"light",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#light",children:"#"}),"Light"]}),`
`,r(l,{}),`
`,n(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,r(i,{code:`export interface LightProps extends React.HTMLAttributes<HTMLDivElement> {
  on?: boolean
  size?: number | string
  color?: string
}

export interface LightRef extends HTMLDivElement {}`})]})}function A(t={}){const{wrapper:e}=t.components||{};return e?r(e,Object.assign({},t,{children:r(h,t)})):h(t)}const M="2024/1/10 10:10:15",N=`import {\r
  DefaultLight,\r
  OnLight,\r
  ColorLight,\r
  SizeLight,\r
} from '../../src/components/UsageBox/Light.tsx'\r
import { LightAPITable } from '../../src/components/APITable/Light.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
\r
# Light \u6307\u793A\u706F\r
\r
\u6307\u793A\u706F\u7EC4\u4EF6\u4E3B\u8981\u53EF\u4EE5\u7528\u6765\u5BF9\u67D0\u4E9B\u72B6\u6001\u8FDB\u884C\u6807\u8BB0\uFF0C\u5982\u6548\u679C\u5668\u662F\u5426\u5F00\u542F\u7B49\u72B6\u6001\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { Light } from 'echo-ui'\`} />\r
\r
## \u4EE3\u7801\u6F14\u793A\r
\r
<DefaultLight />\r
\r
### \u5F00\u542F\u72B6\u6001\r
\r
<OnLight />\r
\r
### \u706F\u5149\u989C\u8272\r
\r
<ColorLight />\r
\r
### \u5C3A\u5BF8\r
\r
<SizeLight />\r
\r
## API\r
\r
### Light\r
\r
<LightAPITable />\r
\r
## \u7C7B\u578B\u58F0\u660E\r
\r
<CodeBlock code={\`export interface LightProps extends React.HTMLAttributes<HTMLDivElement> {\r
  on?: boolean\r
  size?: number | string\r
  color?: string\r
}\r
\r
export interface LightRef extends HTMLDivElement {}\`} />\r
`;export{N as content,A as default,C as frontmatter,M as lastUpdatedTime,D as title,T as toc};
