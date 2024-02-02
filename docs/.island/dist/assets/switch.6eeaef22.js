import{jsx as r,jsxs as n,Fragment as h}from"react/jsx-runtime";import{C as i}from"./CodeBlock.de027be4.js";import{D as d,T as o,a as c,S as s,C as l,b as m}from"./Switch.dd1da07a.js";import"react";import"./index.2d091e0a.js";import"./index.616f020e.js";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";const P=void 0,T=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u5F00\u542F\u72B6\u6001",text:"\u5F00\u542F\u72B6\u6001",depth:3},{id:"\u7981\u7528\u72B6\u6001",text:"\u7981\u7528\u72B6\u6001",depth:3},{id:"\u5C3A\u5BF8",text:"\u5C3A\u5BF8",depth:3},{id:"\u81EA\u5B9A\u4E49\u6837\u5F0F",text:"\u81EA\u5B9A\u4E49\u6837\u5F0F",depth:3},{id:"api",text:"API",depth:2},{id:"switch",text:"Switch",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],N="Switch \u5F00\u5173";function a(t){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},t.components);return n(h,{children:[n(e.h1,{id:"switch-\u5F00\u5173",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#switch-\u5F00\u5173",children:"#"}),"Switch \u5F00\u5173"]}),`
`,r(e.p,{children:"\u5F00\u5173\u53EF\u4EE5\u63A7\u5236\u4E00\u4E2A\u6216\u591A\u4E2A\u76F8\u5173\u8054\u7684\u6548\u679C\u5668\u7684\u5F00\u5173\u72B6\u6001"}),`
`,n(e.h2,{id:"\u5F15\u5165",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,r(i,{code:"import { Switch } form 'echo-ui'"}),`
`,n(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,r(d,{}),`
`,n(e.h3,{id:"\u5F00\u542F\u72B6\u6001",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F00\u542F\u72B6\u6001",children:"#"}),"\u5F00\u542F\u72B6\u6001"]}),`
`,r(o,{}),`
`,n(e.h3,{id:"\u7981\u7528\u72B6\u6001",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7981\u7528\u72B6\u6001",children:"#"}),"\u7981\u7528\u72B6\u6001"]}),`
`,r(c,{}),`
`,n(e.h3,{id:"\u5C3A\u5BF8",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8",children:"#"}),"\u5C3A\u5BF8"]}),`
`,r(s,{}),`
`,n(e.h3,{id:"\u81EA\u5B9A\u4E49\u6837\u5F0F",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u81EA\u5B9A\u4E49\u6837\u5F0F",children:"#"}),"\u81EA\u5B9A\u4E49\u6837\u5F0F"]}),`
`,r(l,{}),`
`,n(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"switch",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#switch",children:"#"}),"Switch"]}),`
`,r(m,{}),`
`,n(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,r(i,{code:`export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
  disabled?: boolean
  toggled?: boolean
  size?: 'sm' | 'md' | 'lg'
  classNames?: {
    label?: string
    button?: string
    thumb?: string
  }
  styles?: {
    label?: React.CSSProperties
    button?: React.CSSProperties
    thumb?: React.CSSProperties
  }
  onChange?: (toggled: boolean) => void
}

export interface SwitchRef extends HTMLLabelElement {}`})]})}function L(t={}){const{wrapper:e}=t.components||{};return e?r(e,Object.assign({},t,{children:r(a,t)})):a(t)}const R="2024/1/10 10:10:15",A=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Default, Toggled, Disabled, Size, Custom } from '../../src/components/UsageBox/Switch.tsx'\r
import { SwitchAPITable } from '../../src/components/APITable/Switch.tsx'\r
\r
# Switch \u5F00\u5173\r
\r
\u5F00\u5173\u53EF\u4EE5\u63A7\u5236\u4E00\u4E2A\u6216\u591A\u4E2A\u76F8\u5173\u8054\u7684\u6548\u679C\u5668\u7684\u5F00\u5173\u72B6\u6001\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { Switch } form 'echo-ui'\`} />\r
\r
## \u4EE3\u7801\u6F14\u793A\r
\r
<Default />\r
\r
### \u5F00\u542F\u72B6\u6001\r
\r
<Toggled />\r
\r
### \u7981\u7528\u72B6\u6001\r
\r
<Disabled />\r
\r
### \u5C3A\u5BF8\r
\r
<Size />\r
\r
### \u81EA\u5B9A\u4E49\u6837\u5F0F\r
\r
<Custom />\r
\r
## API\r
\r
### Switch\r
\r
<SwitchAPITable />\r
\r
## \u7C7B\u578B\u58F0\u660E\r
\r
<CodeBlock code={\`export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {\r
  disabled?: boolean\r
  toggled?: boolean\r
  size?: 'sm' | 'md' | 'lg'\r
  classNames?: {\r
    label?: string\r
    button?: string\r
    thumb?: string\r
  }\r
  styles?: {\r
    label?: React.CSSProperties\r
    button?: React.CSSProperties\r
    thumb?: React.CSSProperties\r
  }\r
  onChange?: (toggled: boolean) => void\r
}\r
\r
export interface SwitchRef extends HTMLLabelElement {}\`} />\r
`;export{A as content,L as default,P as frontmatter,R as lastUpdatedTime,N as title,T as toc};
