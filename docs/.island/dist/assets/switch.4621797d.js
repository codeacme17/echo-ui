import{jsx as t,jsxs as n,Fragment as r}from"react/jsx-runtime";import{C as i}from"./CodeBlock.d8e569ad.js";import{D as s,T as d,a as c,S as h,C as l,b as m}from"./Switch.08d602d8.js";import"react";import"./index.93441784.js";import"./index.b2cccce0.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";const T=void 0,y=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"toggled-state",text:"Toggled State",depth:3},{id:"disabled-state",text:"Disabled State",depth:3},{id:"size",text:"Size",depth:3},{id:"custom-styling",text:"Custom Styling",depth:3},{id:"api",text:"API",depth:2},{id:"switch",text:"Switch",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],D="Switch";function o(a){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},a.components);return n(r,{children:[n(e.h1,{id:"switch",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#switch",children:"#"}),"Switch"]}),`
`,t(e.p,{children:"Switches can control the on/off state of one or more associated effects."}),`
`,n(e.h2,{id:"import",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,t(i,{code:"import { Switch } from 'echo-ui'"}),`
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
`,t(i,{code:`export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
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

export interface SwitchRef extends HTMLLabelElement {}`})]})}function P(a={}){const{wrapper:e}=a.components||{};return e?t(e,Object.assign({},a,{children:t(o,a)})):o(a)}const N="2024/1/14 18:29:34",z=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Default, Toggled, Disabled, Size, Custom } from '../../src/components/UsageBox/Switch.tsx'
import { SwitchAPITable } from '../../src/components/APITable/Switch.tsx'

# Switch

Switches can control the on/off state of one or more associated effects.

## Import

<CodeBlock code={\`import { Switch } from 'echo-ui'\`} />

## Usage

<Default />

### Toggled State

<Toggled />

### Disabled State

<Disabled />

### Size

<Size />

### Custom Styling

<Custom />

## API

### Switch

<SwitchAPITable />

## Type Declarations

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
`;export{z as content,P as default,T as frontmatter,N as lastUpdatedTime,D as title,y as toc};
