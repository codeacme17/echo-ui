import{jsx as r,jsxs as t,Fragment as o}from"react/jsx-runtime";import{D as i,T as c,A as s,C as l}from"./Card.983ee5ac.js";import{C as n}from"./CodeBlock.de027be4.js";import"./index.83878d6a.js";import"./index.2d091e0a.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";const D=void 0,M=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"active-state",text:"Active State",depth:3},{id:"real-world-scenario",text:"Real-World Scenario",depth:3},{id:"api",text:"API",depth:2},{id:"card",text:"Card",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],g="Card";function d(a){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3"},a.components);return t(o,{children:[t(e.h1,{id:"card",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#card",children:"#"}),"Card"]}),`
`,t(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(n,{code:"import { Card } from 'echo-ui'"}),`
`,t(e.h2,{id:"usage",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,r(i,{}),`
`,t(e.h3,{id:"active-state",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#active-state",children:"#"}),"Active State"]}),`
`,r(c,{}),`
`,t(e.h3,{id:"real-world-scenario",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#real-world-scenario",children:"#"}),"Real-World Scenario"]}),`
`,r(s,{}),`
`,t(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"card-1",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#card-1",children:"#"}),"Card"]}),`
`,r(l,{}),`
`,t(e.h2,{id:"type-declarations",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,r(n,{code:`export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  toggled?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardRef extends HTMLDivElement {}

export interface CardHeaderRef extends HTMLDivElement {}

export interface CardBodyRef extends HTMLDivElement {}
`})]})}function A(a={}){const{wrapper:e}=a.components||{};return e?r(e,Object.assign({},a,{children:r(d,a)})):d(a)}const L="2024/1/14 18:55:37",v=`import { Default, Toggled, ActualScenario } from '../../src/components/UsageBox/Card.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { CardAPITable } from '../../src/components/APITable/Card.tsx'\r
\r
# Card\r
\r
## Import\r
\r
<CodeBlock code={\`import { Card } from 'echo-ui'\`} />\r
\r
## Usage\r
\r
<Default />\r
\r
### Active State\r
\r
<Toggled />\r
\r
### Real-World Scenario\r
\r
<ActualScenario />\r
\r
## API\r
\r
### Card\r
\r
<CardAPITable />\r
\r
## Type Declarations\r
\r
<CodeBlock code={\`export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {\r
  toggled?: boolean\r
}\r
\r
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}\r
\r
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}\r
\r
export interface CardRef extends HTMLDivElement {}\r
\r
export interface CardHeaderRef extends HTMLDivElement {}\r
\r
export interface CardBodyRef extends HTMLDivElement {}\r
\`} />\r
`;export{v as content,A as default,D as frontmatter,L as lastUpdatedTime,g as title,M as toc};
