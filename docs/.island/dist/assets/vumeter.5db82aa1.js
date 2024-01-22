import{jsx as r,jsxs as t,Fragment as i}from"react/jsx-runtime";import{C as a}from"./CodeBlock.988145ba.js";import{D as s,H as d,S as l,C as m,L as c,a as u,V as h}from"./VuMeter.d3c5607c.js";import"./createLucideIcon.6491784f.js";import"react";import"./index.8d6410fc.js";import"../client-entry.js";import"./chunk-FXLYF44B.30b0c77c.js";import"react-dom";import"./index.5a6550a4.js";import"./square.35c0d0de.js";import"./Meter.45e0756d.js";import"./Analyser.93bf318f.js";const H=void 0,D=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"horizontal-mode",text:"Horizontal Mode",depth:3},{id:"stereo-mode",text:"Stereo Mode",depth:3},{id:"compact-mode",text:"Compact Mode",depth:3},{id:"number-of-volume-bars",text:"Number of Volume Bars",depth:3},{id:"custom-colors",text:"Custom Colors",depth:3},{id:"data-tags",text:"Data Tags",depth:2},{id:"lump",text:"lump",depth:3},{id:"api",text:"API",depth:2},{id:"vu-meter",text:"VU Meter",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],S="VU Meter";function o(n){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3",p:"p",code:"code",ul:"ul",li:"li"},n.components);return t(i,{children:[t(e.h1,{id:"vu-meter",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#vu-meter",children:"#"}),"VU Meter"]}),`
`,t(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(a,{code:"import { VuMeter } from 'echo-ui'"}),`
`,t(e.h2,{id:"usage",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,r(s,{}),`
`,t(e.h3,{id:"horizontal-mode",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#horizontal-mode",children:"#"}),"Horizontal Mode"]}),`
`,r(d,{}),`
`,t(e.h3,{id:"stereo-mode",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#stereo-mode",children:"#"}),"Stereo Mode"]}),`
`,r(l,{}),`
`,t(e.p,{children:["When the ",r(e.code,{children:"value"})," passed is an array, it automatically switches to stereo mode."]}),`
`,t(e.h3,{id:"compact-mode",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#compact-mode",children:"#"}),"Compact Mode"]}),`
`,r(m,{}),`
`,t(e.h3,{id:"number-of-volume-bars",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#number-of-volume-bars",children:"#"}),"Number of Volume Bars"]}),`
`,r(c,{}),`
`,t(e.h3,{id:"custom-colors",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#custom-colors",children:"#"}),"Custom Colors"]}),`
`,r(u,{}),`
`,t(e.p,{children:["You can use the ",r(e.code,{children:"data-"})," attributes provided on the tags to modify the colors of ",r(e.code,{children:"lump"})," in different states."]}),`
`,t(e.h2,{id:"data-tags",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-tags",children:"#"}),"Data Tags"]}),`
`,t(e.h3,{id:"lump",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#lump",children:"#"}),"lump"]}),`
`,t(e.p,{children:[r(e.code,{children:"data-active"}),": Used to represent attributes of ",r(e.code,{children:"lump"})," in different states."]}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[`
`,t(e.p,{children:[r(e.code,{children:'data-active="none"'}),": Tag attributes when ",r(e.code,{children:"lump"})," is in a non-playing state."]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:[r(e.code,{children:'data-active="low"'}),": Tag attributes when ",r(e.code,{children:"lump"})," is in a low-volume state (-60 ~ -15)."]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:[r(e.code,{children:'data-active="medium"'}),": Tag attributes when ",r(e.code,{children:"lump"})," is in a medium-volume state (-14 ~ 0)."]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:[r(e.code,{children:'data-active="high"'}),": Tag attributes when ",r(e.code,{children:"lump"})," is in a high-volume state (1 ~ 5)."]}),`
`]}),`
`]}),`
`,t(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"vu-meter-1",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#vu-meter-1",children:"#"}),"VU Meter"]}),`
`,r(h,{}),`
`,t(e.h2,{id:"type-declarations",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,r(a,{code:`import type { AxisProps } from '../../visualization'

export interface VuMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number | number[]
  horizontal?: boolean
  compact?: boolean
  lumpsQuantity?: number
  hideAxis?: boolean
  axisProps?: Omit<AxisProps, 'min' | 'max' | 'className' | 'style'>
  classNames?: { axis?: string; lump?: string; lumps?: string }
  styles?: { axis?: React.CSSProperties; lump?: React.CSSProperties; lumps?: React.CSSProperties }
  onChange?: (value: number | number[]) => void
}

export interface StereoVuMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  stereoLumps: LumpValue[][]
}

export interface MonoVuMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  lumps: LumpValue[]
}

export interface VuMeterContextProps extends Omit<VuMeterProps, 'value' | 'onChange'> {
  vertical?: boolean
  minThresholdValue: number
  maxThresholdValue: number
  _lumps: any
  lump: any
}

// Indicates the state of a segment (lump) in the VU meter: 0 for off, 1 for on. export type LumpValue = 0 | 1

export interface VuMeterRef extends HTMLDivElement {}

export interface StereoVuMeterRef extends HTMLDivElement {}

export interface MonoVuMeterRef extends HTMLDivElement {}
`})]})}function N(n={}){const{wrapper:e}=n.components||{};return e?r(e,Object.assign({},n,{children:r(o,n)})):o(n)}const A="2024/1/14 18:54:17",R=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import {\r
  Default,\r
  Horizontal,\r
  Lumps,\r
  Color,\r
  Stereo,\r
  Compact,\r
} from '../../src/components/UsageBox/VuMeter.tsx'\r
import { VuMeterAPITable } from '../../src/components/APITable/VuMeter.tsx'\r
\r
# VU Meter\r
\r
## Import\r
\r
<CodeBlock code={\`import { VuMeter } from 'echo-ui'\`} />\r
\r
## Usage\r
\r
<Default />\r
\r
### Horizontal Mode\r
\r
<Horizontal />\r
\r
### Stereo Mode\r
\r
<Stereo />\r
\r
When the \`value\` passed is an array, it automatically switches to stereo mode.\r
\r
### Compact Mode\r
\r
<Compact />\r
\r
### Number of Volume Bars\r
\r
<Lumps />\r
\r
### Custom Colors\r
\r
<Color />\r
\r
You can use the \`data-\` attributes provided on the tags to modify the colors of \`lump\` in different states.\r
\r
## Data Tags\r
\r
### lump\r
\r
\`data-active\`: Used to represent attributes of \`lump\` in different states.\r
\r
- \`data-active="none"\`: Tag attributes when \`lump\` is in a non-playing state.\r
\r
- \`data-active="low"\`: Tag attributes when \`lump\` is in a low-volume state (-60 ~ -15).\r
\r
- \`data-active="medium"\`: Tag attributes when \`lump\` is in a medium-volume state (-14 ~ 0).\r
\r
- \`data-active="high"\`: Tag attributes when \`lump\` is in a high-volume state (1 ~ 5).\r
\r
## API\r
\r
### VU Meter\r
\r
<VuMeterAPITable />\r
\r
## Type Declarations\r
\r
<CodeBlock code={\`import type { AxisProps } from '../../visualization'\r
\r
export interface VuMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {\r
  value: number | number[]\r
  horizontal?: boolean\r
  compact?: boolean\r
  lumpsQuantity?: number\r
  hideAxis?: boolean\r
  axisProps?: Omit<AxisProps, 'min' | 'max' | 'className' | 'style'>\r
  classNames?: { axis?: string; lump?: string; lumps?: string }\r
  styles?: { axis?: React.CSSProperties; lump?: React.CSSProperties; lumps?: React.CSSProperties }\r
  onChange?: (value: number | number[]) => void\r
}\r
\r
export interface StereoVuMeterProps extends React.HTMLAttributes<HTMLDivElement> {\r
  stereoLumps: LumpValue[][]\r
}\r
\r
export interface MonoVuMeterProps extends React.HTMLAttributes<HTMLDivElement> {\r
  lumps: LumpValue[]\r
}\r
\r
export interface VuMeterContextProps extends Omit<VuMeterProps, 'value' | 'onChange'> {\r
  vertical?: boolean\r
  minThresholdValue: number\r
  maxThresholdValue: number\r
  _lumps: any\r
  lump: any\r
}\r
\r
// Indicates the state of a segment (lump) in the VU meter: 0 for off, 1 for on. export type LumpValue = 0 | 1\r
\r
export interface VuMeterRef extends HTMLDivElement {}\r
\r
export interface StereoVuMeterRef extends HTMLDivElement {}\r
\r
export interface MonoVuMeterRef extends HTMLDivElement {}\r
\`} /\r
\r
>\r
`;export{R as content,N as default,H as frontmatter,A as lastUpdatedTime,S as title,D as toc};
