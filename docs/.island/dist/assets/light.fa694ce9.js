import{jsx as t,jsxs as n,Fragment as o}from"react/jsx-runtime";import{D as h,O as c,C as d,S as s,L as l}from"./Light.6b71cc09.js";import{C as r}from"./CodeBlock.913859b9.js";import"./index.7584db17.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.f49f16be.js";import"react-dom";const T=void 0,C=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"on-state",text:"On State",depth:3},{id:"light-color",text:"Light Color",depth:3},{id:"size",text:"Size",depth:3},{id:"api",text:"API",depth:2},{id:"light",text:"Light",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],D="Light";function a(i){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},i.components);return n(o,{children:[n(e.h1,{id:"light",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#light",children:"#"}),"Light"]}),`
`,t(e.p,{children:"The indicator component can be used to mark certain states, such as whether an effect is enabled or not."}),`
`,n(e.h2,{id:"import",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,t(r,{code:"import { Light } from 'echo-ui'"}),`
`,n(e.h2,{id:"usage",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,t(h,{}),`
`,n(e.h3,{id:"on-state",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#on-state",children:"#"}),"On State"]}),`
`,t(c,{}),`
`,n(e.h3,{id:"light-color",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#light-color",children:"#"}),"Light Color"]}),`
`,t(d,{}),`
`,n(e.h3,{id:"size",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#size",children:"#"}),"Size"]}),`
`,t(s,{}),`
`,n(e.h2,{id:"api",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"light-1",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#light-1",children:"#"}),"Light"]}),`
`,t(l,{}),`
`,n(e.h2,{id:"type-declarations",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,t(r,{code:`export interface LightProps extends React.HTMLAttributes<HTMLDivElement> {
  on?: boolean
  size?: number | string
  color?: string
}

export interface LightRef extends HTMLDivElement {}`})]})}function z(i={}){const{wrapper:e}=i.components||{};return e?t(e,Object.assign({},i,{children:t(a,i)})):a(i)}const I="2024/1/14 18:34:42",S=`import {
  DefaultLight,
  OnLight,
  ColorLight,
  SizeLight,
} from '../../src/components/UsageBox/Light.tsx'
import { LightAPITable } from '../../src/components/APITable/Light.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'

# Light

The indicator component can be used to mark certain states, such as whether an effect is enabled or not.

## Import

<CodeBlock code={\`import { Light } from 'echo-ui'\`} />

## Usage

<DefaultLight />

### On State

<OnLight />

### Light Color

<ColorLight />

### Size

<SizeLight />

## API

### Light

<LightAPITable />

## Type Declarations

<CodeBlock code={\`export interface LightProps extends React.HTMLAttributes<HTMLDivElement> {
  on?: boolean
  size?: number | string
  color?: string
}

export interface LightRef extends HTMLDivElement {}\`} />
`;export{S as content,z as default,T as frontmatter,I as lastUpdatedTime,D as title,C as toc};
