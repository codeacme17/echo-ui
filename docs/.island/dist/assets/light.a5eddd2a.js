import{jsx as t,jsxs as r,Fragment as o}from"react/jsx-runtime";import{D as h,O as c,C as d,S as s,L as l}from"./Light.f62bbf6b.js";import{C as i}from"./CodeBlock.de027be4.js";import"./index.c7334c27.js";import"./index.2d091e0a.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";const C=void 0,D=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"on-state",text:"On State",depth:3},{id:"light-color",text:"Light Color",depth:3},{id:"size",text:"Size",depth:3},{id:"api",text:"API",depth:2},{id:"light",text:"Light",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],z="Light";function a(n){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3"},n.components);return r(o,{children:[r(e.h1,{id:"light",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#light",children:"#"}),"Light"]}),`
`,t(e.p,{children:"The indicator component can be used to mark certain states, such as whether an effect is enabled or not."}),`
`,r(e.h2,{id:"import",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,t(i,{code:"import { Light } from 'echo-ui'"}),`
`,r(e.h2,{id:"usage",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,t(h,{}),`
`,r(e.h3,{id:"on-state",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#on-state",children:"#"}),"On State"]}),`
`,t(c,{}),`
`,r(e.h3,{id:"light-color",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#light-color",children:"#"}),"Light Color"]}),`
`,t(d,{}),`
`,r(e.h3,{id:"size",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#size",children:"#"}),"Size"]}),`
`,t(s,{}),`
`,r(e.h2,{id:"api",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(e.h3,{id:"light-1",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#light-1",children:"#"}),"Light"]}),`
`,t(l,{}),`
`,r(e.h2,{id:"type-declarations",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,t(i,{code:`export interface LightProps extends React.HTMLAttributes<HTMLDivElement> {
  on?: boolean
  size?: number | string
  color?: string
}

export interface LightRef extends HTMLDivElement {}`})]})}function I(n={}){const{wrapper:e}=n.components||{};return e?t(e,Object.assign({},n,{children:t(a,n)})):a(n)}const S="2024/1/14 18:34:42",A=`import {\r
  DefaultLight,\r
  OnLight,\r
  ColorLight,\r
  SizeLight,\r
} from '../../src/components/UsageBox/Light.tsx'\r
import { LightAPITable } from '../../src/components/APITable/Light.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
\r
# Light\r
\r
The indicator component can be used to mark certain states, such as whether an effect is enabled or not.\r
\r
## Import\r
\r
<CodeBlock code={\`import { Light } from 'echo-ui'\`} />\r
\r
## Usage\r
\r
<DefaultLight />\r
\r
### On State\r
\r
<OnLight />\r
\r
### Light Color\r
\r
<ColorLight />\r
\r
### Size\r
\r
<SizeLight />\r
\r
## API\r
\r
### Light\r
\r
<LightAPITable />\r
\r
## Type Declarations\r
\r
<CodeBlock code={\`export interface LightProps extends React.HTMLAttributes<HTMLDivElement> {\r
  on?: boolean\r
  size?: number | string\r
  color?: string\r
}\r
\r
export interface LightRef extends HTMLDivElement {}\`} />\r
`;export{A as content,I as default,C as frontmatter,S as lastUpdatedTime,z as title,D as toc};
