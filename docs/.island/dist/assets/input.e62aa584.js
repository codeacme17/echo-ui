import{jsx as n,jsxs as t,Fragment as d}from"react/jsx-runtime";import{D as o,a as s,B as l,T as h,S as c,R as u,P as p,M as m,b as g,I}from"./Input.6f5cb003.js";import{C as i}from"./CodeBlock.de027be4.js";import{k as b}from"./chunk-GM3GRPI5.005caca1.js";import"./index.ce30de29.js";import"./index.2d091e0a.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";const S=void 0,B=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"disabled-state",text:"Disabled State",depth:3},{id:"bilateral-mode",text:"Bilateral Mode",depth:3},{id:"text-mode",text:"Text Mode",depth:3},{id:"size",text:"Size",depth:3},{id:"rounded-corners",text:"Rounded Corners",depth:3},{id:"progress-bar-color",text:"Progress Bar Color",depth:3},{id:"minimum-and-maximum-values",text:"Minimum and Maximum Values",depth:3},{id:"step-and-sensitivity-during-drag",text:"Step and Sensitivity (During Drag)",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"input",text:"Input",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],E="Input";function r(a){const e=Object.assign({h1:"h1",a:"a",p:"p",code:"code",h2:"h2",div:"div",h3:"h3",ul:"ul",li:"li"},a.components);return t(d,{children:[t(e.h1,{id:"input",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#input",children:"#"}),"Input"]}),`
`,t(e.p,{children:["The ",n(e.code,{children:"Input"})," component allows you to control parameter input and includes drag-and-drop functionality for easier data updates."]}),`
`,t(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(i,{code:"import { Input } from 'echo-ui'"}),`
`,t(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,t(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:n(e.p,{children:"Drag the mouse up and down inside the Input to change the value."})})]}),`
`,t(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:t(e.p,{children:["Press ",n(b,{keys:["command"],children:"+ Left Mouse Button"})," to reset the value."]})})]}),`
`,n(o,{}),`
`,t(e.h3,{id:"disabled-state",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled-state",children:"#"}),"Disabled State"]}),`
`,n(s,{}),`
`,t(e.h3,{id:"bilateral-mode",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#bilateral-mode",children:"#"}),"Bilateral Mode"]}),`
`,n(l,{}),`
`,t(e.h3,{id:"text-mode",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#text-mode",children:"#"}),"Text Mode"]}),`
`,n(h,{}),`
`,t(e.h3,{id:"size",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#size",children:"#"}),"Size"]}),`
`,n(c,{}),`
`,t(e.h3,{id:"rounded-corners",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#rounded-corners",children:"#"}),"Rounded Corners"]}),`
`,n(u,{}),`
`,t(e.h3,{id:"progress-bar-color",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#progress-bar-color",children:"#"}),"Progress Bar Color"]}),`
`,n(p,{}),`
`,t(e.h3,{id:"minimum-and-maximum-values",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#minimum-and-maximum-values",children:"#"}),"Minimum and Maximum Values"]}),`
`,n(m,{}),`
`,t(e.h3,{id:"step-and-sensitivity-during-drag",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#step-and-sensitivity-during-drag",children:"#"}),"Step and Sensitivity (During Drag)"]}),`
`,n(g,{}),`
`,t(e.p,{children:["Combining ",n(e.code,{children:"step"})," and ",n(e.code,{children:"sensitivity"})," allows you to easily adjust the precision of user dragging."]}),`
`,t(e.h2,{id:"data-attributes",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-attributes",children:"#"}),"Data Attributes"]}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:"data-dragging"}),": Indicates whether the input box is currently in drag-and-drop mode."]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:"data-bilateral"}),": Indicates whether the input box is in bilateral mode."]}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:'data-bilateral="positive"'}),": Positive mode."]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:'data-bilateral="negative"'}),": Negative mode."]}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"input-1",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#input-1",children:"#"}),"Input"]}),`
`,t(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:n(e.p,{children:"Supports all other attributes of the native input element."})})]}),`
`,n(I,{}),`
`,t(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(i,{code:`export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'children' | 'size'> {
  value?: any
  type?: 'text' | 'number'
  size?: 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  bilateral?: boolean
  min?: number
  max?: number
  step?: number
  sensitivity?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  prohibitDrag?: boolean
  hideProgress?: boolean
  progressColor?: string
  onChange?: (e: InputChangeEvent) => void
}

export interface InputChangeEvent {
  value: any
  nativeEvent?: React.ChangeEvent<HTMLInputElement>
}

export interface InputRef extends HTMLInputElement {}
`})]})}function z(a={}){const{wrapper:e}=a.components||{};return e?n(e,Object.assign({},a,{children:n(r,a)})):r(a)}const R="2024/1/14 18:30:40",A=`import {
  DefaultInput,
  DisabledInput,
  SizeInput,
  Bilateral,
  RadiusInput,
  TextInput,
  MinMaxInput,
  StepInput,
  ProgresColorInput,
} from '../../src/components/UsageBox/Input.tsx'
import { InputAPITable } from '../../src/components/APITable/Input.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Kbd } from '@nextui-org/react'

# Input

The \`Input\` component allows you to control parameter input and includes drag-and-drop functionality for easier data updates.

## Import

<CodeBlock code={\`import { Input } from 'echo-ui'\`} />

## Usage

:::tip

Drag the mouse up and down inside the Input to change the value.

:::

:::tip

Press <Kbd keys={["command"]}>+ Left Mouse Button</Kbd> to reset the value.

:::

<DefaultInput />

### Disabled State

<DisabledInput />

### Bilateral Mode

<Bilateral />

### Text Mode

<TextInput />

### Size

<SizeInput />

### Rounded Corners

<RadiusInput />

### Progress Bar Color

<ProgresColorInput />

### Minimum and Maximum Values

<MinMaxInput />

### Step and Sensitivity (During Drag)

<StepInput />

Combining \`step\` and \`sensitivity\` allows you to easily adjust the precision of user dragging.

## Data Attributes

- \`data-dragging\`: Indicates whether the input box is currently in drag-and-drop mode.

- \`data-bilateral\`: Indicates whether the input box is in bilateral mode.

  - \`data-bilateral="positive"\`: Positive mode.

  - \`data-bilateral="negative"\`: Negative mode.

## API

### Input

:::tip

Supports all other attributes of the native input element.

:::

<InputAPITable />

## Type Declarations

<CodeBlock code={\`export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'children' | 'size'> {
  value?: any
  type?: 'text' | 'number'
  size?: 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  bilateral?: boolean
  min?: number
  max?: number
  step?: number
  sensitivity?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  prohibitDrag?: boolean
  hideProgress?: boolean
  progressColor?: string
  onChange?: (e: InputChangeEvent) => void
}

export interface InputChangeEvent {
  value: any
  nativeEvent?: React.ChangeEvent<HTMLInputElement>
}

export interface InputRef extends HTMLInputElement {}
\`} />
`;export{A as content,z as default,S as frontmatter,R as lastUpdatedTime,E as title,B as toc};
