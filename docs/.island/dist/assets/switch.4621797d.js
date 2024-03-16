<<<<<<<< HEAD:docs/.island/dist/assets/switch.4621797d.js
import{jsx as t,jsxs as n,Fragment as r}from"react/jsx-runtime";import{C as i}from"./CodeBlock.d8e569ad.js";import{D as s,T as d,a as c,S as h,C as l,b as m}from"./Switch.08d602d8.js";import"react";import"./index.93441784.js";import"./index.b2cccce0.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";const T=void 0,y=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"toggled-state",text:"Toggled State",depth:3},{id:"disabled-state",text:"Disabled State",depth:3},{id:"size",text:"Size",depth:3},{id:"custom-styling",text:"Custom Styling",depth:3},{id:"api",text:"API",depth:2},{id:"switch",text:"Switch",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],D="Switch";function o(a){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},a.components);return n(r,{children:[n(e.h1,{id:"switch",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#switch",children:"#"}),"Switch"]}),`
========
import{jsx as t,jsxs as n,Fragment as o}from"react/jsx-runtime";import{C as a}from"./CodeBlock.d8e569ad.js";import{D as s,T as d,a as c,S as h,C as l,b as m}from"./Switch.7011bf6e.js";import"react";import"./index.93441784.js";import"./index.2440eb3f.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";const T=void 0,y=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"toggled-state",text:"Toggled State",depth:3},{id:"disabled-state",text:"Disabled State",depth:3},{id:"size",text:"Size",depth:3},{id:"custom-styling",text:"Custom Styling",depth:3},{id:"api",text:"API",depth:2},{id:"switch",text:"Switch",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],D="Switch";function i(r){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},r.components);return n(o,{children:[n(e.h1,{id:"switch",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#switch",children:"#"}),"Switch"]}),`
>>>>>>>> main:docs/.island/dist/assets/switch.3772b7dd.js
`,t(e.p,{children:"Switches can control the on/off state of one or more associated effects."}),`
`,n(e.h2,{id:"import",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,t(a,{code:"import { Switch } from '@nafr/echo-ui'"}),`
`,n(e.h2,{id:"usage",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,t(s,{}),`
`,n(e.h3,{id:"toggled-state",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#toggled-state",children:"#"}),"Toggled State"]}),`
`,t(d,{}),`
`,n(e.h3,{id:"disabled-state",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled-state",children:"#"}),"Disabled State"]}),`
`,t(c,{}),`
`,n(e.h3,{id:"size",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#size",children:"#"}),"Size"]}),`
`,t(h,{}),`
`,n(e.h3,{id:"custom-styling",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#custom-styling",children:"#"}),"Custom Styling"]}),`
`,t(l,{}),`
`,n(e.h2,{id:"api",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"switch-1",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#switch-1",children:"#"}),"Switch"]}),`
`,t(m,{}),`
`,n(e.h2,{id:"type-declarations",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,t(a,{code:`export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
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

export interface SwitchRef extends HTMLLabelElement {}`})]})}function P(r={}){const{wrapper:e}=r.components||{};return e?t(e,Object.assign({},r,{children:t(i,r)})):i(r)}const N="2024/3/15 13:46:55",z=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Default, Toggled, Disabled, Size, Custom } from '../../src/components/UsageBox/Switch.tsx'\r
import { SwitchAPITable } from '../../src/components/APITable/Switch.tsx'\r
\r
# Switch\r
\r
Switches can control the on/off state of one or more associated effects.\r
\r
## Import\r
\r
<CodeBlock code={\`import { Switch } from '@nafr/echo-ui'\`} />\r
\r
## Usage\r
\r
<Default />\r
\r
### Toggled State\r
\r
<Toggled />\r
\r
### Disabled State\r
\r
<Disabled />\r
\r
### Size\r
\r
<Size />\r
\r
### Custom Styling\r
\r
<Custom />\r
\r
## API\r
\r
### Switch\r
\r
<SwitchAPITable />\r
\r
## Type Declarations\r
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
`;export{z as content,P as default,T as frontmatter,N as lastUpdatedTime,D as title,y as toc};
