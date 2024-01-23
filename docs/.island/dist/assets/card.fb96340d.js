import{jsx as t,jsxs as r,Fragment as o}from"react/jsx-runtime";import{D as i,T as c,A as s,C as l}from"./Card.d2146360.js";import{C as n}from"./CodeBlock.69bc42b0.js";import"./index.b6b2392c.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.9f5da3e9.js";import"react-dom";const H=void 0,D=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"active-state",text:"Active State",depth:3},{id:"real-world-scenario",text:"Real-World Scenario",depth:3},{id:"api",text:"API",depth:2},{id:"card",text:"Card",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],M="Card";function d(a){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3"},a.components);return r(o,{children:[r(e.h1,{id:"card",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#card",children:"#"}),"Card"]}),`
`,r(e.h2,{id:"import",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,t(n,{code:"import { Card } from 'echo-ui'"}),`
`,r(e.h2,{id:"usage",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,t(i,{}),`
`,r(e.h3,{id:"active-state",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#active-state",children:"#"}),"Active State"]}),`
`,t(c,{}),`
`,r(e.h3,{id:"real-world-scenario",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#real-world-scenario",children:"#"}),"Real-World Scenario"]}),`
`,t(s,{}),`
`,r(e.h2,{id:"api",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(e.h3,{id:"card-1",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#card-1",children:"#"}),"Card"]}),`
`,t(l,{}),`
`,r(e.h2,{id:"type-declarations",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,t(n,{code:`export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  toggled?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardRef extends HTMLDivElement {}

export interface CardHeaderRef extends HTMLDivElement {}

export interface CardBodyRef extends HTMLDivElement {}
`})]})}function g(a={}){const{wrapper:e}=a.components||{};return e?t(e,Object.assign({},a,{children:t(d,a)})):d(a)}const A="2024/1/14 18:55:37",L=`import { Default, Toggled, ActualScenario } from '../../src/components/UsageBox/Card.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { CardAPITable } from '../../src/components/APITable/Card.tsx'

# Card

## Import

<CodeBlock code={\`import { Card } from 'echo-ui'\`} />

## Usage

<Default />

### Active State

<Toggled />

### Real-World Scenario

<ActualScenario />

## API

### Card

<CardAPITable />

## Type Declarations

<CodeBlock code={\`export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  toggled?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardRef extends HTMLDivElement {}

export interface CardHeaderRef extends HTMLDivElement {}

export interface CardBodyRef extends HTMLDivElement {}
\`} />
`;export{L as content,g as default,H as frontmatter,A as lastUpdatedTime,M as title,D as toc};
