import{jsx as n,jsxs as t,Fragment as d}from"react/jsx-runtime";import{C as a}from"./CodeBlock.913859b9.js";import{D as o,a as l,V as s,B as c,A as h,S as m,C as u,U as p,b}from"./Slider.d0d10c1e.js";import{k as g}from"./chunk-GM3GRPI5.bc90fcd4.js";import"react";import"./index.7584db17.js";import"../client-entry.js";import"./chunk-FXLYF44B.f49f16be.js";import"react-dom";import"./index.5a6550a4.js";import"./Meter.a572c499.js";import"./Analyser.93bf318f.js";const M=void 0,L=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"disabled-state",text:"Disabled State",depth:3},{id:"vertical-mode",text:"Vertical Mode",depth:3},{id:"bilateral-mode",text:"Bilateral Mode",depth:3},{id:"adding-coordinates",text:"Adding Coordinates",depth:3},{id:"step",text:"Step",depth:3},{id:"custom-styling",text:"Custom Styling",depth:3},{id:"uncontrolled-mode",text:"Uncontrolled Mode",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"slider",text:"Slider",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],B="Slider";function r(i){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",div:"div",h3:"h3",code:"code",ul:"ul",li:"li"},i.components);return t(d,{children:[t(e.h1,{id:"slider",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#slider",children:"#"}),"Slider"]}),`
`,n(e.p,{children:"You can use the Slider component to control a numerical range. The Slider is commonly used to adjust values such as volume, effects, and more."}),`
`,t(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(a,{code:"import { Slider } from 'echo-ui'"}),`
`,t(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,t(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:t(e.p,{children:["Press ",n(g,{keys:["command"],children:"+ Left Mouse Button"})," to reset the value."]})})]}),`
`,n(o,{}),`
`,t(e.h3,{id:"disabled-state",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled-state",children:"#"}),"Disabled State"]}),`
`,n(l,{}),`
`,t(e.h3,{id:"vertical-mode",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#vertical-mode",children:"#"}),"Vertical Mode"]}),`
`,n(s,{}),`
`,t(e.h3,{id:"bilateral-mode",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#bilateral-mode",children:"#"}),"Bilateral Mode"]}),`
`,n(c,{}),`
`,t(e.h3,{id:"adding-coordinates",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#adding-coordinates",children:"#"}),"Adding Coordinates"]}),`
`,n(h,{}),`
`,t(e.h3,{id:"step",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#step",children:"#"}),"Step"]}),`
`,n(m,{}),`
`,t(e.h3,{id:"custom-styling",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#custom-styling",children:"#"}),"Custom Styling"]}),`
`,n(u,{}),`
`,t(e.p,{children:["You can use the ",n(e.code,{children:"classNames"})," or ",n(e.code,{children:"styles"})," exposed by the component to style specific elements."]}),`
`,t(e.h3,{id:"uncontrolled-mode",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#uncontrolled-mode",children:"#"}),"Uncontrolled Mode"]}),`
`,n(p,{}),`
`,t(e.p,{children:["In uncontrolled mode, the Slider component is non-interactive. You can use this mode to dynamically change numerical values such as volume and effects (using ",n(e.code,{children:"hideThumb"})," and ",n(e.code,{children:"prohibitInteraction"}),")."]}),`
`,t(e.h2,{id:"data-attributes",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-attributes",children:"#"}),"Data Attributes"]}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[n(e.code,{children:"data-dragging"}),": Indicates whether the slider is being dragged."]}),`
`,t(e.li,{children:[n(e.code,{children:"data-bilateral"}),": Indicates whether it's in bilateral mode."]}),`
`,t(e.li,{children:[n(e.code,{children:"data-vertical"}),": Indicates whether it's in vertical mode."]}),`
`,t(e.li,{children:[n(e.code,{children:"data-disabled"}),": Indicates whether it's disabled."]}),`
`,t(e.li,{children:[n(e.code,{children:"data-direction"}),": Indicates the direction, either 'positive' for positive or 'negative' for negative (only applicable in bilateral mode)."]}),`
`]}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.div,{className:"island-directive warning",children:[n(e.p,{className:"island-directive-title",children:"WARNING"}),n(e.div,{className:"island-directive-content",children:t(e.p,{children:["The Slider component inherits from ",n(e.code,{children:"React.HTMLAttributes<HTMLDivElement>"})," instead of the native ",n(e.code,{children:"input"}),"."]})})]}),`
`,t(e.h3,{id:"slider-1",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#slider-1",children:"#"}),"Slider"]}),`
`,n(b,{}),`
`,t(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(a,{code:`import type { AxisProps } from 'echo-ui'

export interface SliderProps extends Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  vertical?: boolean
  bilateral?: boolean
  hideThumb?: boolean
  hideThumbLabel?: boolean
  prohibitInteraction?: boolean
  classNames?: {
    progress?: string
    thumb?: string
    thumbLabel?: string
    axis?: string
  }
  styles?: {
    progress?: React.CSSProperties
    thumb?: React.CSSProperties
    thumbLabel?: React.CSSProperties
    axis?: React.CSSProperties
  }
  axis?: boolean
  axisProps?: Omit<AxisProps, 'className' | 'style'>
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
}

export interface SliderRef extends HTMLDivElement {}`})]})}function R(i={}){const{wrapper:e}=i.components||{};return e?n(e,Object.assign({},i,{children:n(r,i)})):r(i)}const H="2024/1/14 18:30:40",U=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import {
  Default,
  Disabled,
  Vertical,
  Bilateral,
  Axis,
  CustomColors,
  Step,
  Uncontrolled,
} from '../../src/components/UsageBox/Slider.tsx'
import { SliderAPITable } from '../../src/components/APITable/Slider.tsx'
import { Kbd } from '@nextui-org/react'

# Slider

You can use the Slider component to control a numerical range. The Slider is commonly used to adjust values such as volume, effects, and more.

## Import

<CodeBlock code={\`import { Slider } from 'echo-ui'\`} />

## Usage

:::tip

Press <Kbd keys={["command"]}>+ Left Mouse Button</Kbd> to reset the value.

:::

<Default />

### Disabled State

<Disabled />

### Vertical Mode

<Vertical />

### Bilateral Mode

<Bilateral />

### Adding Coordinates

<Axis />

### Step

<Step />

### Custom Styling

<CustomColors />

You can use the \`classNames\` or \`styles\` exposed by the component to style specific elements.

### Uncontrolled Mode

<Uncontrolled />

In uncontrolled mode, the Slider component is non-interactive. You can use this mode to dynamically change numerical values such as volume and effects (using \`hideThumb\` and \`prohibitInteraction\`).

## Data Attributes

- \`data-dragging\`: Indicates whether the slider is being dragged.
- \`data-bilateral\`: Indicates whether it's in bilateral mode.
- \`data-vertical\`: Indicates whether it's in vertical mode.
- \`data-disabled\`: Indicates whether it's disabled.
- \`data-direction\`: Indicates the direction, either 'positive' for positive or 'negative' for negative (only applicable in bilateral mode).

## API

:::warning

The Slider component inherits from \`React.HTMLAttributes<HTMLDivElement>\` instead of the native \`input\`.

:::

### Slider

<SliderAPITable />

## Type Declarations

<CodeBlock code={\`import type { AxisProps } from 'echo-ui'

export interface SliderProps extends Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  vertical?: boolean
  bilateral?: boolean
  hideThumb?: boolean
  hideThumbLabel?: boolean
  prohibitInteraction?: boolean
  classNames?: {
    progress?: string
    thumb?: string
    thumbLabel?: string
    axis?: string
  }
  styles?: {
    progress?: React.CSSProperties
    thumb?: React.CSSProperties
    thumbLabel?: React.CSSProperties
    axis?: React.CSSProperties
  }
  axis?: boolean
  axisProps?: Omit<AxisProps, 'className' | 'style'>
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
}

export interface SliderRef extends HTMLDivElement {}\`} />
`;export{U as content,R as default,M as frontmatter,H as lastUpdatedTime,B as title,L as toc};
