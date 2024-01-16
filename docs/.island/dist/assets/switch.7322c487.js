import{jsx as n,jsxs as r,Fragment as h}from"react/jsx-runtime";import{C as a}from"./CodeBlock.3473f527.js";import{D as d,T as o,a as c,S as s,C as l,b as m}from"./Switch.26000905.js";import"react-dom";import"react";import"./index.1dc66bc0.js";import"../client-entry.js";const w=void 0,C=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u5F00\u542F\u72B6\u6001",text:"\u5F00\u542F\u72B6\u6001",depth:3},{id:"\u7981\u7528\u72B6\u6001",text:"\u7981\u7528\u72B6\u6001",depth:3},{id:"\u5C3A\u5BF8",text:"\u5C3A\u5BF8",depth:3},{id:"\u81EA\u5B9A\u4E49\u6837\u5F0F",text:"\u81EA\u5B9A\u4E49\u6837\u5F0F",depth:3},{id:"api",text:"API",depth:2},{id:"switch",text:"Switch",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],P="Switch \u5F00\u5173";function i(t){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},t.components);return r(h,{children:[r(e.h1,{id:"switch-\u5F00\u5173",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#switch-\u5F00\u5173",children:"#"}),"Switch \u5F00\u5173"]}),`
`,n(e.p,{children:"\u5F00\u5173\u53EF\u4EE5\u63A7\u5236\u4E00\u4E2A\u6216\u591A\u4E2A\u76F8\u5173\u8054\u7684\u6548\u679C\u5668\u7684\u5F00\u5173\u72B6\u6001"}),`
`,r(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(a,{code:"import { Switch } form 'echo-ui'"}),`
`,r(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(d,{}),`
`,r(e.h3,{id:"\u5F00\u542F\u72B6\u6001",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F00\u542F\u72B6\u6001",children:"#"}),"\u5F00\u542F\u72B6\u6001"]}),`
`,n(o,{}),`
`,r(e.h3,{id:"\u7981\u7528\u72B6\u6001",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7981\u7528\u72B6\u6001",children:"#"}),"\u7981\u7528\u72B6\u6001"]}),`
`,n(c,{}),`
`,r(e.h3,{id:"\u5C3A\u5BF8",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8",children:"#"}),"\u5C3A\u5BF8"]}),`
`,n(s,{}),`
`,r(e.h3,{id:"\u81EA\u5B9A\u4E49\u6837\u5F0F",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u81EA\u5B9A\u4E49\u6837\u5F0F",children:"#"}),"\u81EA\u5B9A\u4E49\u6837\u5F0F"]}),`
`,n(l,{}),`
`,r(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(e.h3,{id:"switch",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#switch",children:"#"}),"Switch"]}),`
`,n(m,{}),`
`,r(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(a,{code:`export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
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

export interface SwitchRef extends HTMLLabelElement {}`})]})}function T(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(i,t)})):i(t)}const N="2024/1/10 10:10:15",L=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
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
`;export{L as content,T as default,w as frontmatter,N as lastUpdatedTime,P as title,C as toc};
