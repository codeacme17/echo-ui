import{jsx as t,jsxs as n,Fragment as i}from"react/jsx-runtime";import{C as r}from"./CodeBlock.38325652.js";import{D as s,H as d,S as l,C as m,L as c,a as u,V as h}from"./VuMeter.2ed3a01d.js";import"react";import"./index.2d091e0a.js";import"./index.9f6c8c4d.js";import"../client-entry.js";import"./chunk-FXLYF44B.996f6326.js";import"react-dom";import"./square.af379f0c.js";const L=void 0,y=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"horizontal-mode",text:"Horizontal Mode",depth:3},{id:"stereo-mode",text:"Stereo Mode",depth:3},{id:"compact-mode",text:"Compact Mode",depth:3},{id:"number-of-volume-bars",text:"Number of Volume Bars",depth:3},{id:"custom-colors",text:"Custom Colors",depth:3},{id:"data-tags",text:"Data Tags",depth:2},{id:"lump",text:"lump",depth:3},{id:"api",text:"API",depth:2},{id:"vu-meter",text:"VU Meter",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],P="VU Meter";function o(a){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3",p:"p",code:"code",ul:"ul",li:"li"},a.components);return n(i,{children:[n(e.h1,{id:"vu-meter",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#vu-meter",children:"#"}),"VU Meter"]}),`
`,n(e.h2,{id:"import",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,t(r,{code:"import { VuMeter } from 'echo-ui'"}),`
`,n(e.h2,{id:"usage",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,t(s,{}),`
`,n(e.h3,{id:"horizontal-mode",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#horizontal-mode",children:"#"}),"Horizontal Mode"]}),`
`,t(d,{}),`
`,n(e.h3,{id:"stereo-mode",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#stereo-mode",children:"#"}),"Stereo Mode"]}),`
`,t(l,{}),`
`,n(e.p,{children:["When the ",t(e.code,{children:"value"})," passed is an array, it automatically switches to stereo mode."]}),`
`,n(e.h3,{id:"compact-mode",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#compact-mode",children:"#"}),"Compact Mode"]}),`
`,t(m,{}),`
`,n(e.h3,{id:"number-of-volume-bars",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#number-of-volume-bars",children:"#"}),"Number of Volume Bars"]}),`
`,t(c,{}),`
`,n(e.h3,{id:"custom-colors",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#custom-colors",children:"#"}),"Custom Colors"]}),`
`,t(u,{}),`
`,n(e.p,{children:["You can use the ",t(e.code,{children:"data-"})," attributes provided on the tags to modify the colors of ",t(e.code,{children:"lump"})," in different states."]}),`
`,n(e.h2,{id:"data-tags",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-tags",children:"#"}),"Data Tags"]}),`
`,n(e.h3,{id:"lump",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#lump",children:"#"}),"lump"]}),`
`,n(e.p,{children:[t(e.code,{children:"data-active"}),": Used to represent attributes of ",t(e.code,{children:"lump"})," in different states."]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[t(e.code,{children:'data-active="none"'}),": Tag attributes when ",t(e.code,{children:"lump"})," is in a non-playing state."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[t(e.code,{children:'data-active="low"'}),": Tag attributes when ",t(e.code,{children:"lump"})," is in a low-volume state (-60 ~ -15)."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[t(e.code,{children:'data-active="medium"'}),": Tag attributes when ",t(e.code,{children:"lump"})," is in a medium-volume state (-14 ~ 0)."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[t(e.code,{children:'data-active="high"'}),": Tag attributes when ",t(e.code,{children:"lump"})," is in a high-volume state (1 ~ 5)."]}),`
`]}),`
`]}),`
`,n(e.h2,{id:"api",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"vu-meter-1",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#vu-meter-1",children:"#"}),"VU Meter"]}),`
`,t(h,{}),`
`,n(e.h2,{id:"type-declarations",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,t(r,{code:`import type { AxisProps } from '../../visualization'

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
`})]})}function H(a={}){const{wrapper:e}=a.components||{};return e?t(e,Object.assign({},a,{children:t(o,a)})):o(a)}const D="2024/1/14 18:54:17",S=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import {
  Default,
  Horizontal,
  Lumps,
  Color,
  Stereo,
  Compact,
} from '../../src/components/UsageBox/VuMeter.tsx'
import { VuMeterAPITable } from '../../src/components/APITable/VuMeter.tsx'

# VU Meter

## Import

<CodeBlock code={\`import { VuMeter } from 'echo-ui'\`} />

## Usage

<Default />

### Horizontal Mode

<Horizontal />

### Stereo Mode

<Stereo />

When the \`value\` passed is an array, it automatically switches to stereo mode.

### Compact Mode

<Compact />

### Number of Volume Bars

<Lumps />

### Custom Colors

<Color />

You can use the \`data-\` attributes provided on the tags to modify the colors of \`lump\` in different states.

## Data Tags

### lump

\`data-active\`: Used to represent attributes of \`lump\` in different states.

- \`data-active="none"\`: Tag attributes when \`lump\` is in a non-playing state.

- \`data-active="low"\`: Tag attributes when \`lump\` is in a low-volume state (-60 ~ -15).

- \`data-active="medium"\`: Tag attributes when \`lump\` is in a medium-volume state (-14 ~ 0).

- \`data-active="high"\`: Tag attributes when \`lump\` is in a high-volume state (1 ~ 5).

## API

### VU Meter

<VuMeterAPITable />

## Type Declarations

<CodeBlock code={\`import type { AxisProps } from '../../visualization'

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
\`} /

>
`;export{S as content,H as default,L as frontmatter,D as lastUpdatedTime,P as title,y as toc};
