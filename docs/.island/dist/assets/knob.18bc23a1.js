import{jsx as e,jsxs as r,Fragment as l}from"react/jsx-runtime";import{E as o}from"./style.e0d0cfbc.js";import{U as a,A as s,c as t,C as d}from"./index.bf491f00.js";import"react";import"./_commonjsHelpers.4e997714.js";import"react-dom";const u=()=>e(a,{code:"<Knob />",scope:{Knob:o}}),h=()=>e(a,{code:"<Knob disabled/>",scope:{Knob:o}}),p=()=>e(a,{code:"<Knob bilateral />",scope:{Knob:o}}),b=()=>e(a,{code:`<div className="flex gap-10">
  <Knob rotationRange={360} />
  <Knob rotationRange={270} />
  <Knob rotationRange={180} />
</div>`,scope:{Knob:o}}),m=()=>e(a,{code:"<Knob step={20} sensitivity={1} min={-100} max={100} />",scope:{Knob:o}}),g=()=>e(a,{code:'<Knob topLabel="Volume" bottomLabel={<span className="-mt-1 text-sm">value</span>}/>',scope:{Knob:o}}),C=()=>e(a,{code:"<Knob size={80} trackWidth={3} pointerWidth={7} pointerHeight={7}/>",scope:{Knob:o}}),f=()=>e(a,{code:'<Knob trackColor="#6b7280" progressColor="#6366f1" buttonColor="#475569" pointerColor="#6366f1" />',scope:{Knob:o}}),K=()=>e(s,{data:[{attribute:"value",description:"\u65CB\u94AE\u7684\u503C",type:e(t,{children:"number"}),default:e(t,{children:"0"})},{attribute:"min",description:"\u6700\u5C0F\u503C",type:e(t,{children:"number"}),default:e(t,{children:"-10"})},{attribute:"max",description:"\u6700\u5927\u503C",type:e(t,{children:"number"}),default:e(t,{children:"10"})},{attribute:"step",description:"\u6B65\u8FDB\u503C",type:e(t,{children:"number"}),default:e(t,{children:"1"})},{attribute:"disabled",description:"\u662F\u5426\u7981\u7528",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"rotationRange",description:"\u65CB\u8F6C\u8303\u56F4",type:e(t,{children:"number"}),default:e(t,{children:"270"})},{attribute:"bilateral",description:"\u53CC\u5411\u65CB\u94AE",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"sensitivity",description:"\u7075\u654F\u5EA6",type:e(t,{children:"1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10"}),default:e(t,{children:"1"})},{attribute:"size",description:"\u5C3A\u5BF8",type:e(t,{children:"number | string"}),default:e(t,{children:"'4rem'"})},{attribute:"buttonColor",description:"\u6309\u94AE\u989C\u8272",type:e(t,{children:"string"}),default:e(t,{children:"'var(--echo-button)'"})},{attribute:"trackColor",description:"\u8F68\u9053\u989C\u8272",type:e(t,{children:"string"}),default:e(t,{children:"'var(--echo-input)'"})},{attribute:"trackWidth",description:"\u8F68\u9053\u5BBD\u5EA6",type:e(t,{children:"number | string"}),default:e(t,{children:"'0.5rem'"})},{attribute:"progressColor",description:"\u8FDB\u5EA6\u6761\u989C\u8272",type:e(t,{children:"string"}),default:e(t,{children:"'var(--echo-primary)'"})},{attribute:"pointerWidth",description:"\u6307\u9488\u5BBD\u5EA6",type:e(t,{children:"number | string"}),default:e(t,{children:"'0.375rem'"})},{attribute:"pointerHeight",description:"\u6307\u9488\u9AD8\u5EA6",type:e(t,{children:"number | string"}),default:e(t,{children:"'1rem'"})},{attribute:"pointerColor",description:"\u6307\u9488\u989C\u8272",type:e(t,{children:"string"}),default:e(t,{children:"'var(--echo-primary)'"})},{attribute:"topLabel",description:"\u9876\u90E8\u6807\u7B7E",type:e(t,{children:"string | React.ReactNode"}),default:"-"},{attribute:"bottomLabel",description:"\u5E95\u90E8\u6807\u7B7E",type:e(t,{children:"string | React.ReactNode"}),default:"-"},{attribute:"classNames",description:"\u81EA\u5B9A\u4E49\u7C7B\u540D",type:e(t,{children:" { button?: string, topLabel?: string, bottomLabel?: string } "}),default:"-"},{attribute:"styles",description:"\u81EA\u5B9A\u4E49\u6837\u5F0F",type:e(t,{children:" { button?: React.CSSProperties, topLabel?: React.CSSProperties, bottomLabel?: React.CSSProperties } "}),default:"-"},{attribute:"onChange",description:"\u503C\u53D8\u5316\u56DE\u8C03",type:e(t,{children:"(value: number) => void"}),default:"-"},{attribute:"onChangeEnd",description:"\u503C\u53D8\u5316\u7ED3\u675F\u56DE\u8C03",type:e(t,{children:"(value: number) => void"}),default:"-"}]}),N=void 0,S=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u7528\u6CD5",text:"\u7528\u6CD5",depth:2},{id:"\u7981\u7528\u72B6\u6001",text:"\u7981\u7528\u72B6\u6001",depth:3},{id:"\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F",text:"\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F",depth:3},{id:"\u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4",text:"\u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4",depth:3},{id:"\u6807\u7B7E",text:"\u6807\u7B7E",depth:3},{id:"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6",text:"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6",depth:3},{id:"\u5C3A\u5BF8\u76F8\u5173",text:"\u5C3A\u5BF8\u76F8\u5173",depth:3},{id:"\u989C\u8272\u76F8\u5173",text:"\u989C\u8272\u76F8\u5173",depth:3},{id:"\u6807\u7B7E-data",text:"\u6807\u7B7E Data",depth:2},{id:"api",text:"API",depth:2},{id:"knob",text:"Knob",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],B="Knob \u65CB\u94AE";function c(i){const n=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code",ul:"ul",li:"li"},i.components);return r(l,{children:[r(n.h1,{id:"knob-\u65CB\u94AE",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#knob-\u65CB\u94AE",children:"#"}),"Knob \u65CB\u94AE"]}),`
`,e(n.p,{children:"\u53EF\u4EE5\u4F7F\u7528\u65CB\u94AE\u7EC4\u4EF6\u5BF9\u97F3\u91CF\u3001\u6548\u679C\u5668\u7B49\u53C2\u6570\u8FDB\u884C\u8C03\u8282"}),`
`,r(n.h2,{id:"\u5F15\u5165",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,e(d,{code:"import { Knob } from 'echo-ui'"}),`
`,r(n.h2,{id:"\u7528\u6CD5",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7528\u6CD5",children:"#"}),"\u7528\u6CD5"]}),`
`,e(u,{}),`
`,r(n.h3,{id:"\u7981\u7528\u72B6\u6001",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7981\u7528\u72B6\u6001",children:"#"}),"\u7981\u7528\u72B6\u6001"]}),`
`,e(h,{}),`
`,r(n.h3,{id:"\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F",children:"#"}),"\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F"]}),`
`,e(p,{}),`
`,r(n.h3,{id:"\u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4",children:"#"}),"\u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4"]}),`
`,e(b,{}),`
`,r(n.h3,{id:"\u6807\u7B7E",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6807\u7B7E",children:"#"}),"\u6807\u7B7E"]}),`
`,e(g,{}),`
`,r(n.h3,{id:"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6",children:"#"}),"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6"]}),`
`,e(m,{}),`
`,r(n.h3,{id:"\u5C3A\u5BF8\u76F8\u5173",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8\u76F8\u5173",children:"#"}),"\u5C3A\u5BF8\u76F8\u5173"]}),`
`,e(C,{}),`
`,r(n.p,{children:["\u4E3A\u4E86\u4E0D\u5F71\u54CD\u7EC4\u4EF6\u7684\u6B63\u5E38\u4F7F\u7528\uFF0C",e(n.code,{children:"Knob"})," \u5E76\u6CA1\u6709\u5C06 ",e(n.code,{children:"style"})," \u548C ",e(n.code,{children:"className"})," \u7684\u6837\u5F0F\u4FEE\u6539\u6743\u9650\u5168\u90E8\u66B4\u9732\u51FA\u53BB\uFF0C\u800C\u662F\u63D0\u4F9B\u4E86\u4E00\u5957\u5C3A\u5BF8\u76F8\u5173\u7684 props\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8FD9\u4E9B props \u6765\u8C03\u6574\u7EC4\u4EF6\u7684\u5C3A\u5BF8 (",e(n.code,{children:"size"})," ",e(n.code,{children:"trackWidth"})," ",e(n.code,{children:"pointerWidth"})," ",e(n.code,{children:"pointerHeight"}),")"]}),`
`,r(n.h3,{id:"\u989C\u8272\u76F8\u5173",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u989C\u8272\u76F8\u5173",children:"#"}),"\u989C\u8272\u76F8\u5173"]}),`
`,e(f,{}),`
`,r(n.p,{children:["\u4E0E\u5C3A\u5BF8\u7684\u4FEE\u6539\u76F8\u540C\uFF0C ",e(n.code,{children:"Knob"})," \u7684\u989C\u8272\u76F8\u5173\u7684\u6837\u5F0F\u4E5F\u662F\u901A\u8FC7 props \u66B4\u9732\u51FA\u53BB\u7684\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8FD9\u4E9B props \u6765\u8C03\u6574\u7EC4\u4EF6\u7684\u989C\u8272 (",e(n.code,{children:"trackColor"})," ",e(n.code,{children:"progressColor"})," ",e(n.code,{children:"buttonColor"})," ",e(n.code,{children:"pointerColor"}),")"]}),`
`,r(n.h2,{id:"\u6807\u7B7E-data",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6807\u7B7E-data",children:"#"}),"\u6807\u7B7E Data"]}),`
`,r(n.ul,{children:[`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.code,{children:"data-dragging"}),": \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u62D6\u62FD\u72B6\u6001"]}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.code,{children:"data-disabled"}),": \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u7981\u7528\u72B6\u6001"]}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.code,{children:"data-bilateral"}),": \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F"]}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.code,{children:"data-direction"}),": \u5F53\u524D\u65CB\u94AE\u7684\u5904\u4E8E\u5DE6\u4FA7\u8FD8\u662F\u53F3\u4FA7\uFF0C",e(n.code,{children:"positive"})," \u4E3A\u53F3\u4FA7\u65F6\uFF0C",e(n.code,{children:"negative"})," \u4E3A\u5DE6\u4FA7\u65F6\uFF08\u4EC5\u5728 ",e(n.code,{children:"bilateral"})," \u6A21\u5F0F\u4E0B\u53EF\u53D8\uFF09"]}),`
`]}),`
`]}),`
`,r(n.h2,{id:"api",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(n.h3,{id:"knob",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#knob",children:"#"}),"Knob"]}),`
`,e(K,{}),`
`,r(n.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,e(d,{code:`export interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  rotationRange?: number
  bilateral?: boolean
  sensitivity?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  size?: number | string
  buttonColor?: string
  trackColor?: string
  trackWidth?: number | string
  progressColor?: string
  pointerWidth?: number | string
  pointerHeight?: number | string
  pointerColor?: string
  topLabel?: string | React.ReactNode
  bottomLabel?: string | React.ReactNode
  classNames?: {
    button?: string
    topLabel?: string
    bottomLabel?: string
  }
  styles?: {
    button?: React.CSSProperties
    topLabel?: React.CSSProperties
    bottomLabel?: React.CSSProperties
  }
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
}

export interface KnobRef extends HTMLDivElement {}`})]})}function D(i={}){const{wrapper:n}=i.components||{};return n?e(n,Object.assign({},i,{children:e(c,i)})):c(i)}const A="2023/12/30 13:20:09",k=`import {
  Default,
  Disabled,
  Bilateral,
  Range,
  Label,
  Size,
  Color,
  StepSensitivity,
} from '../../src/components/UsageBox/Knob.tsx'
import { KnobAPITable } from '../../src/components/APITable/Knob.tsx'
import { CodeBlock } from '../../src/components/CodeBlock/index.tsx'

# Knob \u65CB\u94AE

\u53EF\u4EE5\u4F7F\u7528\u65CB\u94AE\u7EC4\u4EF6\u5BF9\u97F3\u91CF\u3001\u6548\u679C\u5668\u7B49\u53C2\u6570\u8FDB\u884C\u8C03\u8282

## \u5F15\u5165

<CodeBlock code={\`import { Knob } from 'echo-ui'\`} />

## \u7528\u6CD5

<Default />

### \u7981\u7528\u72B6\u6001

<Disabled />

### \u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F

<Bilateral />

### \u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4

<Range />

### \u6807\u7B7E

<Label />

### \u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6

<StepSensitivity />

### \u5C3A\u5BF8\u76F8\u5173

<Size />

\u4E3A\u4E86\u4E0D\u5F71\u54CD\u7EC4\u4EF6\u7684\u6B63\u5E38\u4F7F\u7528\uFF0C\`Knob\` \u5E76\u6CA1\u6709\u5C06 \`style\` \u548C \`className\` \u7684\u6837\u5F0F\u4FEE\u6539\u6743\u9650\u5168\u90E8\u66B4\u9732\u51FA\u53BB\uFF0C\u800C\u662F\u63D0\u4F9B\u4E86\u4E00\u5957\u5C3A\u5BF8\u76F8\u5173\u7684 props\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8FD9\u4E9B props \u6765\u8C03\u6574\u7EC4\u4EF6\u7684\u5C3A\u5BF8 (\`size\` \`trackWidth\` \`pointerWidth\` \`pointerHeight\`)

### \u989C\u8272\u76F8\u5173

<Color />

\u4E0E\u5C3A\u5BF8\u7684\u4FEE\u6539\u76F8\u540C\uFF0C \`Knob\` \u7684\u989C\u8272\u76F8\u5173\u7684\u6837\u5F0F\u4E5F\u662F\u901A\u8FC7 props \u66B4\u9732\u51FA\u53BB\u7684\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8FD9\u4E9B props \u6765\u8C03\u6574\u7EC4\u4EF6\u7684\u989C\u8272 (\`trackColor\` \`progressColor\` \`buttonColor\` \`pointerColor\`)

## \u6807\u7B7E Data

- \`data-dragging\`: \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u62D6\u62FD\u72B6\u6001

- \`data-disabled\`: \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u7981\u7528\u72B6\u6001

- \`data-bilateral\`: \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F

- \`data-direction\`: \u5F53\u524D\u65CB\u94AE\u7684\u5904\u4E8E\u5DE6\u4FA7\u8FD8\u662F\u53F3\u4FA7\uFF0C\`positive\` \u4E3A\u53F3\u4FA7\u65F6\uFF0C\`negative\` \u4E3A\u5DE6\u4FA7\u65F6\uFF08\u4EC5\u5728 \`bilateral\` \u6A21\u5F0F\u4E0B\u53EF\u53D8\uFF09

## API

### Knob

<KnobAPITable />

## \u7C7B\u578B\u58F0\u660E

<CodeBlock code={\`export interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  rotationRange?: number
  bilateral?: boolean
  sensitivity?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  size?: number | string
  buttonColor?: string
  trackColor?: string
  trackWidth?: number | string
  progressColor?: string
  pointerWidth?: number | string
  pointerHeight?: number | string
  pointerColor?: string
  topLabel?: string | React.ReactNode
  bottomLabel?: string | React.ReactNode
  classNames?: {
    button?: string
    topLabel?: string
    bottomLabel?: string
  }
  styles?: {
    button?: React.CSSProperties
    topLabel?: React.CSSProperties
    bottomLabel?: React.CSSProperties
  }
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
}

export interface KnobRef extends HTMLDivElement {}\`} />
`;export{k as content,D as default,N as frontmatter,A as lastUpdatedTime,B as title,S as toc};
