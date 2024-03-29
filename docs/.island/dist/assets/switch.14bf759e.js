import{jsx as n,jsxs as t,Fragment as h}from"react/jsx-runtime";import{C as i}from"./CodeBlock.d8e569ad.js";import{D as d,T as o,a as c,S as s,C as l,b as m}from"./Switch.8ada1b01.js";import"react";import"./index.93441784.js";import"./index.105c25bf.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";const P=void 0,T=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u5F00\u542F\u72B6\u6001",text:"\u5F00\u542F\u72B6\u6001",depth:3},{id:"\u7981\u7528\u72B6\u6001",text:"\u7981\u7528\u72B6\u6001",depth:3},{id:"\u5C3A\u5BF8",text:"\u5C3A\u5BF8",depth:3},{id:"\u81EA\u5B9A\u4E49\u6837\u5F0F",text:"\u81EA\u5B9A\u4E49\u6837\u5F0F",depth:3},{id:"api",text:"API",depth:2},{id:"switch",text:"Switch",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],N="Switch \u5F00\u5173";function r(a){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},a.components);return t(h,{children:[t(e.h1,{id:"switch-\u5F00\u5173",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#switch-\u5F00\u5173",children:"#"}),"Switch \u5F00\u5173"]}),`
`,n(e.p,{children:"\u5F00\u5173\u53EF\u4EE5\u63A7\u5236\u4E00\u4E2A\u6216\u591A\u4E2A\u76F8\u5173\u8054\u7684\u6548\u679C\u5668\u7684\u5F00\u5173\u72B6\u6001"}),`
`,t(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(i,{code:"import { Switch } form '@nafr/echo-ui'"}),`
`,t(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(d,{}),`
`,t(e.h3,{id:"\u5F00\u542F\u72B6\u6001",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F00\u542F\u72B6\u6001",children:"#"}),"\u5F00\u542F\u72B6\u6001"]}),`
`,n(o,{}),`
`,t(e.h3,{id:"\u7981\u7528\u72B6\u6001",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7981\u7528\u72B6\u6001",children:"#"}),"\u7981\u7528\u72B6\u6001"]}),`
`,n(c,{}),`
`,t(e.h3,{id:"\u5C3A\u5BF8",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8",children:"#"}),"\u5C3A\u5BF8"]}),`
`,n(s,{}),`
`,t(e.h3,{id:"\u81EA\u5B9A\u4E49\u6837\u5F0F",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u81EA\u5B9A\u4E49\u6837\u5F0F",children:"#"}),"\u81EA\u5B9A\u4E49\u6837\u5F0F"]}),`
`,n(l,{}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"switch",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#switch",children:"#"}),"Switch"]}),`
`,n(m,{}),`
`,t(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(i,{code:`export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
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

export interface SwitchRef extends HTMLLabelElement {}`})]})}function L(a={}){const{wrapper:e}=a.components||{};return e?n(e,Object.assign({},a,{children:n(r,a)})):r(a)}const R="2024/3/15 13:46:55",A=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Default, Toggled, Disabled, Size, Custom } from '../../src/components/UsageBox/Switch.tsx'
import { SwitchAPITable } from '../../src/components/APITable/Switch.tsx'

# Switch \u5F00\u5173

\u5F00\u5173\u53EF\u4EE5\u63A7\u5236\u4E00\u4E2A\u6216\u591A\u4E2A\u76F8\u5173\u8054\u7684\u6548\u679C\u5668\u7684\u5F00\u5173\u72B6\u6001

## \u5F15\u5165

<CodeBlock code={\`import { Switch } form '@nafr/echo-ui'\`} />

## \u4EE3\u7801\u6F14\u793A

<Default />

### \u5F00\u542F\u72B6\u6001

<Toggled />

### \u7981\u7528\u72B6\u6001

<Disabled />

### \u5C3A\u5BF8

<Size />

### \u81EA\u5B9A\u4E49\u6837\u5F0F

<Custom />

## API

### Switch

<SwitchAPITable />

## \u7C7B\u578B\u58F0\u660E

<CodeBlock code={\`export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
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

export interface SwitchRef extends HTMLLabelElement {}\`} />
`;export{A as content,L as default,P as frontmatter,R as lastUpdatedTime,N as title,T as toc};
