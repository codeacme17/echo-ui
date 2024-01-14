import{jsx as e,jsxs as i,Fragment as s}from"react/jsx-runtime";import{U as a,A as h,c,C as r}from"./index.bf491f00.js";import{d as o}from"./style.e0d0cfbc.js";import"react";import"./_commonjsHelpers.4e997714.js";import"react-dom";const l=()=>e(a,{code:"<Switch> Switch </Switch>",scope:{Switch:o}}),u=()=>e(a,{code:"<Switch toggled> Toggled </Switch>",scope:{Switch:o}}),m=()=>e(a,{code:"<Switch disabled> Disabled </Switch>",scope:{Switch:o}}),p=()=>e(a,{code:`<div className="flex gap-6 items-center">
  <Switch size="sm"> sm </Switch>
  <Switch size="md"> md </Switch>
  <Switch size="lg"> lg </Switch>
</div>`,scope:{Switch:o}}),b=()=>e(a,{code:`<Switch classNames={{
  button: 'bg-slate-500 shadow-inner',
  thumb: 'bg-indigo-400 shadow-none', 
  label: 'text-slate-500'
}}> 
  Custom 
</Switch>`,scope:{Switch:o}}),S=()=>e(h,{data:[{attribute:"disabled",description:"\u662F\u5426\u7981\u7528\u5F00\u5173",type:e(c,{children:"boolean"}),default:e(c,{children:"false"})},{attribute:"toggled",description:"\u5F00\u5173\u7684\u72B6\u6001",type:e(c,{children:"boolean"}),default:e(c,{children:"false"})},{attribute:"size",description:"\u5F00\u5173\u7684\u5C3A\u5BF8",type:e(c,{children:"'sm' | 'md' | 'lg'"}),default:e(c,{children:"'md'"})},{attribute:"classNames",description:"\u81EA\u5B9A\u4E49\u6837\u5F0F\u7C7B\u540D",type:e(c,{children:"{ label?: string; button?: string; thumb?: string }"}),default:"-"},{attribute:"styles",description:"\u81EA\u5B9A\u4E49\u6837\u5F0F",type:e(c,{children:"{ label?: React.CSSProperties; button?: React.CSSProperties; thumb?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"\u72B6\u6001\u53D8\u5316\u65F6\u7684\u56DE\u8C03\u51FD\u6570",type:e(c,{children:"(toggled: boolean) => void"}),default:"-"}]}),A=void 0,T=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u7528\u6CD5",text:"\u7528\u6CD5",depth:2},{id:"\u5F00\u542F\u72B6\u6001",text:"\u5F00\u542F\u72B6\u6001",depth:3},{id:"\u7981\u7528\u72B6\u6001",text:"\u7981\u7528\u72B6\u6001",depth:3},{id:"\u5C3A\u5BF8",text:"\u5C3A\u5BF8",depth:3},{id:"\u81EA\u5B9A\u4E49\u6837\u5F0F",text:"\u81EA\u5B9A\u4E49\u6837\u5F0F",depth:3},{id:"api",text:"API",depth:2},{id:"switch",text:"Switch",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],N="Switch \u5F00\u5173";function d(n){const t=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},n.components);return i(s,{children:[i(t.h1,{id:"switch-\u5F00\u5173",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#switch-\u5F00\u5173",children:"#"}),"Switch \u5F00\u5173"]}),`
`,e(t.p,{children:"\u5F00\u5173\u53EF\u4EE5\u63A7\u5236\u4E00\u4E2A\u6216\u591A\u4E2A\u76F8\u5173\u8054\u7684\u6548\u679C\u5668\u7684\u5F00\u5173\u72B6\u6001"}),`
`,i(t.h2,{id:"\u5F15\u5165",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,e(r,{code:"import { Switch } form 'echo-ui'"}),`
`,i(t.h2,{id:"\u7528\u6CD5",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7528\u6CD5",children:"#"}),"\u7528\u6CD5"]}),`
`,e(l,{}),`
`,i(t.h3,{id:"\u5F00\u542F\u72B6\u6001",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F00\u542F\u72B6\u6001",children:"#"}),"\u5F00\u542F\u72B6\u6001"]}),`
`,e(u,{}),`
`,i(t.h3,{id:"\u7981\u7528\u72B6\u6001",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7981\u7528\u72B6\u6001",children:"#"}),"\u7981\u7528\u72B6\u6001"]}),`
`,e(m,{}),`
`,i(t.h3,{id:"\u5C3A\u5BF8",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8",children:"#"}),"\u5C3A\u5BF8"]}),`
`,e(p,{}),`
`,i(t.h3,{id:"\u81EA\u5B9A\u4E49\u6837\u5F0F",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u81EA\u5B9A\u4E49\u6837\u5F0F",children:"#"}),"\u81EA\u5B9A\u4E49\u6837\u5F0F"]}),`
`,e(b,{}),`
`,i(t.h2,{id:"api",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,i(t.h3,{id:"switch",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#switch",children:"#"}),"Switch"]}),`
`,e(S,{}),`
`,i(t.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,e(r,{code:`export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
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

export interface SwitchRef extends HTMLLabelElement {}`})]})}function B(n={}){const{wrapper:t}=n.components||{};return t?e(t,Object.assign({},n,{children:e(d,n)})):d(n)}const D="2023/12/31 11:34:55",R=`import { CodeBlock } from '../../src/components/CodeBlock/index.tsx'
import { Default, Toggled, Disabled, Size, Custom } from '../../src/components/UsageBox/Switch.tsx'
import { SwitchAPITable } from '../../src/components/APITable/Switch.tsx'

# Switch \u5F00\u5173

\u5F00\u5173\u53EF\u4EE5\u63A7\u5236\u4E00\u4E2A\u6216\u591A\u4E2A\u76F8\u5173\u8054\u7684\u6548\u679C\u5668\u7684\u5F00\u5173\u72B6\u6001

## \u5F15\u5165

<CodeBlock code={\`import { Switch } form 'echo-ui'\`} />

## \u7528\u6CD5

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
`;export{R as content,B as default,A as frontmatter,D as lastUpdatedTime,N as title,T as toc};
