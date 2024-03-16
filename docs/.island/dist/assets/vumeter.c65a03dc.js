import{jsx as n,jsxs as t,Fragment as o}from"react/jsx-runtime";import{C as a}from"./CodeBlock.d8e569ad.js";import{D as d,H as l,S as c,C as m,L as h,a as s,V as p}from"./VuMeter.0bae01fb.js";import"react";import"./index.93441784.js";import"./index.b2cccce0.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./usePlayer.db8858d9.js";import"./log.83f32a09.js";import"./transform.3e3dfeca.js";import"./index.6eef3859.js";import"./useVuMeter.35f28026.js";import"./Analyser.9e774fcc.js";import"./index.6b8ad651.js";import"./usePropsWithGroup.a30eaab0.js";import"./square.0deaf827.js";import"./play.c5eb55f2.js";import"./assertion.e9357fda.js";import"./index.704bb6de.js";import"./axis.b2198668.js";const O=void 0,z=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u6C34\u5E73\u6A21\u5F0F",text:"\u6C34\u5E73\u6A21\u5F0F",depth:3},{id:"\u53CC\u58F0\u9053\u6A21\u5F0F",text:"\u53CC\u58F0\u9053\u6A21\u5F0F",depth:3},{id:"\u7D27\u51D1\u6A21\u5F0F",text:"\u7D27\u51D1\u6A21\u5F0F",depth:3},{id:"\u97F3\u91CF\u6761\u6570\u91CF",text:"\u97F3\u91CF\u6761\u6570\u91CF",depth:3},{id:"\u81EA\u5B9A\u4E49\u989C\u8272",text:"\u81EA\u5B9A\u4E49\u989C\u8272",depth:3},{id:"\u6807\u7B7E-data",text:"\u6807\u7B7E Data",depth:2},{id:"lump",text:"lump",depth:3},{id:"api",text:"API",depth:2},{id:"vu-meter",text:"VU Meter",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],B="VU Meter \u97F3\u91CF\u8868";function i(r){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3",p:"p",code:"code",ul:"ul",li:"li"},r.components);return t(o,{children:[t(e.h1,{id:"vu-meter-\u97F3\u91CF\u8868",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#vu-meter-\u97F3\u91CF\u8868",children:"#"}),"VU Meter \u97F3\u91CF\u8868"]}),`
`,t(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(a,{code:"import { VuMeter } from 'echo-ui'"}),`
`,t(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(d,{}),`
`,t(e.h3,{id:"\u6C34\u5E73\u6A21\u5F0F",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6C34\u5E73\u6A21\u5F0F",children:"#"}),"\u6C34\u5E73\u6A21\u5F0F"]}),`
`,n(l,{}),`
`,t(e.h3,{id:"\u53CC\u58F0\u9053\u6A21\u5F0F",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u53CC\u58F0\u9053\u6A21\u5F0F",children:"#"}),"\u53CC\u58F0\u9053\u6A21\u5F0F"]}),`
`,n(c,{}),`
`,t(e.p,{children:["\u5F53\u4F20\u5165\u7684 ",n(e.code,{children:"value"})," \u4E3A\u6570\u7EC4\u65F6\uFF0C\u4F1A\u81EA\u52A8\u5207\u6362\u4E3A\u53CC\u58F0\u9053\u6A21\u5F0F"]}),`
`,t(e.h3,{id:"\u7D27\u51D1\u6A21\u5F0F",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7D27\u51D1\u6A21\u5F0F",children:"#"}),"\u7D27\u51D1\u6A21\u5F0F"]}),`
`,n(m,{}),`
`,t(e.h3,{id:"\u97F3\u91CF\u6761\u6570\u91CF",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u97F3\u91CF\u6761\u6570\u91CF",children:"#"}),"\u97F3\u91CF\u6761\u6570\u91CF"]}),`
`,n(h,{}),`
`,t(e.h3,{id:"\u81EA\u5B9A\u4E49\u989C\u8272",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u81EA\u5B9A\u4E49\u989C\u8272",children:"#"}),"\u81EA\u5B9A\u4E49\u989C\u8272"]}),`
`,n(s,{}),`
`,t(e.p,{children:["\u53EF\u4EE5\u4F7F\u7528\u6807\u7B7E\u4E0A\u63D0\u4F9B\u7684 ",n(e.code,{children:"data-"})," \u5C5E\u6027\u6765\u4FEE\u6539 ",n(e.code,{children:"lump"})," \u4E0D\u540C\u72B6\u6001\u65F6\u7684\u989C\u8272"]}),`
`,t(e.h2,{id:"\u6807\u7B7E-data",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6807\u7B7E-data",children:"#"}),"\u6807\u7B7E Data"]}),`
`,t(e.h3,{id:"lump",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#lump",children:"#"}),"lump"]}),`
`,t(e.p,{children:[n(e.code,{children:"data-active"}),": \u7528\u4E8E\u8868\u793A ",n(e.code,{children:"lump"})," \u4E0D\u540C\u72B6\u6001\u65F6\u7684\u5C5E\u6027"]}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:'data-active="none"'}),": ",n(e.code,{children:"lump"})," \u5904\u4E8E\u672A\u64AD\u653E\u72B6\u6001\u65F6\u7684\u6807\u7B7E\u5C5E\u6027"]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:'data-active="low"'}),": ",n(e.code,{children:"lump"})," \u5904\u4E8E\u4F4E\u97F3\u91CF\u72B6\u6001",n(e.code,{children:"(-60 ~ -15)"}),"\u65F6\u7684\u6807\u7B7E\u5C5E\u6027"]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:'data-active="medium"'}),": ",n(e.code,{children:"lump"})," \u5904\u4E8E\u4E2D\u97F3\u91CF\u72B6\u6001\u65F6",n(e.code,{children:"(-14 ~ 0)"}),"\u7684\u6807\u7B7E\u5C5E\u6027"]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:'data-active="high"'}),": ",n(e.code,{children:"lump"})," \u5904\u4E8E\u9AD8\u97F3\u91CF\u72B6\u6001\u65F6",n(e.code,{children:"(1 ~ 5)"}),"\u7684\u6807\u7B7E\u5C5E\u6027"]}),`
`]}),`
`]}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"vu-meter",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#vu-meter",children:"#"}),"VU Meter"]}),`
`,n(p,{}),`
`,t(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(a,{code:`import type { AxisProps } from '../../visualization'

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
`})]})}function k(r={}){const{wrapper:e}=r.components||{};return e?n(e,Object.assign({},r,{children:n(i,r)})):i(r)}const j="2024/1/10 10:10:15",_=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import {
  Default,
  Horizontal,
  Lumps,
  Color,
  Stereo,
  Compact,
} from '../../src/components/UsageBox/VuMeter.tsx'
import { VuMeterAPITable } from '../../src/components/APITable/VuMeter.tsx'

# VU Meter \u97F3\u91CF\u8868

## \u5F15\u5165

<CodeBlock code={\`import { VuMeter } from 'echo-ui'\`} />

## \u4EE3\u7801\u6F14\u793A

<Default />

### \u6C34\u5E73\u6A21\u5F0F

<Horizontal />

### \u53CC\u58F0\u9053\u6A21\u5F0F

<Stereo />

\u5F53\u4F20\u5165\u7684 \`value\` \u4E3A\u6570\u7EC4\u65F6\uFF0C\u4F1A\u81EA\u52A8\u5207\u6362\u4E3A\u53CC\u58F0\u9053\u6A21\u5F0F

### \u7D27\u51D1\u6A21\u5F0F

<Compact />

### \u97F3\u91CF\u6761\u6570\u91CF

<Lumps />

### \u81EA\u5B9A\u4E49\u989C\u8272

<Color />

\u53EF\u4EE5\u4F7F\u7528\u6807\u7B7E\u4E0A\u63D0\u4F9B\u7684 \`data-\` \u5C5E\u6027\u6765\u4FEE\u6539 \`lump\` \u4E0D\u540C\u72B6\u6001\u65F6\u7684\u989C\u8272

## \u6807\u7B7E Data

### lump

\`data-active\`: \u7528\u4E8E\u8868\u793A \`lump\` \u4E0D\u540C\u72B6\u6001\u65F6\u7684\u5C5E\u6027

- \`data-active="none"\`: \`lump\` \u5904\u4E8E\u672A\u64AD\u653E\u72B6\u6001\u65F6\u7684\u6807\u7B7E\u5C5E\u6027

- \`data-active="low"\`: \`lump\` \u5904\u4E8E\u4F4E\u97F3\u91CF\u72B6\u6001\`(-60 ~ -15)\`\u65F6\u7684\u6807\u7B7E\u5C5E\u6027

- \`data-active="medium"\`: \`lump\` \u5904\u4E8E\u4E2D\u97F3\u91CF\u72B6\u6001\u65F6\`(-14 ~ 0)\`\u7684\u6807\u7B7E\u5C5E\u6027

- \`data-active="high"\`: \`lump\` \u5904\u4E8E\u9AD8\u97F3\u91CF\u72B6\u6001\u65F6\`(1 ~ 5)\`\u7684\u6807\u7B7E\u5C5E\u6027

## API

### VU Meter

<VuMeterAPITable />

## \u7C7B\u578B\u58F0\u660E

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
`;export{_ as content,k as default,O as frontmatter,j as lastUpdatedTime,B as title,z as toc};
