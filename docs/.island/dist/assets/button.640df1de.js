import{jsx as e,jsxs as n,Fragment as d}from"react/jsx-runtime";import{D as i,T as s,a as u,S as c,R as l,G as h,B as p,b}from"./Button.0d3d03e2.js";import{C as a}from"./CodeBlock.de027be4.js";import"./index.a54ae35d.js";import"./index.2d091e0a.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";const G=void 0,y=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"toggle-state",text:"Toggle State",depth:3},{id:"disabled-state",text:"Disabled State",depth:3},{id:"size",text:"Size",depth:3},{id:"rounded-corners",text:"Rounded Corners",depth:3},{id:"button-group",text:"Button Group",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"button",text:"Button",depth:3},{id:"buttongroup",text:"Button.Group",depth:3},{id:"types",text:"Types",depth:2}],C="Button";function r(o){const t=Object.assign({h1:"h1",a:"a",p:"p",code:"code",h2:"h2",h3:"h3",ul:"ul",li:"li",div:"div"},o.components);return n(d,{children:[n(t.h1,{id:"button",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#button",children:"#"}),"Button"]}),`
`,n(t.p,{children:["You can use the ",e(t.code,{children:"Button"})," component to create a button or the ",e(t.code,{children:"Button.Group"})," component to create a group of buttons, allowing you to control functions such as audio playback."]}),`
`,n(t.h2,{id:"import",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,e(a,{code:"import { Button } from 'echo-ui'"}),`
`,n(t.h2,{id:"usage",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,e(i,{}),`
`,n(t.h3,{id:"toggle-state",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#toggle-state",children:"#"}),"Toggle State"]}),`
`,e(s,{}),`
`,n(t.h3,{id:"disabled-state",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled-state",children:"#"}),"Disabled State"]}),`
`,e(u,{}),`
`,n(t.h3,{id:"size",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#size",children:"#"}),"Size"]}),`
`,e(c,{}),`
`,n(t.h3,{id:"rounded-corners",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#rounded-corners",children:"#"}),"Rounded Corners"]}),`
`,e(l,{}),`
`,n(t.h3,{id:"button-group",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#button-group",children:"#"}),"Button Group"]}),`
`,e(h,{}),`
`,n(t.h2,{id:"data-attributes",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#data-attributes",children:"#"}),"Data Attributes"]}),`
`,n(t.ul,{children:[`
`,n(t.li,{children:[`
`,n(t.p,{children:[e(t.code,{children:"data-toggled"}),": Indicates whether the current button is in an active state."]}),`
`]}),`
`,n(t.li,{children:[`
`,n(t.p,{children:[e(t.code,{children:"data-disabled"}),": Indicates whether the current button is in a disabled state."]}),`
`]}),`
`]}),`
`,n(t.h2,{id:"api",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(t.h3,{id:"button-1",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#button-1",children:"#"}),"Button"]}),`
`,n(t.div,{className:"island-directive tip",children:[e(t.p,{className:"island-directive-title",children:"TIP"}),e(t.div,{className:"island-directive-content",children:n(t.p,{children:["Supports all other native ",e(t.code,{children:"button"})," attributes."]})})]}),`
`,e(p,{}),`
`,n(t.h3,{id:"buttongroup",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#buttongroup",children:"#"}),"Button.Group"]}),`
`,e(b,{}),`
`,n(t.h2,{id:"types",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#types",children:"#"}),"Types"]}),`
`,e(a,{code:`interface AbstractButtonProps<T> extends React.HTMLAttributes<T> {
  value?: any
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export interface ButtonProps extends AbstractButtonProps<ButtonRef> {
  toggled?: boolean
  onToggleChange?: (toggled: boolean) => void
}

export interface ButtonGroupProps extends Omit<AbstractButtonProps<ButtonGroupRef>, 'onChange'> {
  value?: any
  classNames?: { button?: string }
  styles?: { button?: React.CSSProperties }
  onChange?: (values: any) => void
}

export interface ButtonRef extends HTMLButtonElement {}

export interface ButtonGroupRef extends HTMLDivElement {}`})]})}function R(o={}){const{wrapper:t}=o.components||{};return t?e(t,Object.assign({},o,{children:e(r,o)})):r(o)}const S="2024/3/1 10:42:02",I=`import {
  DefaultButton,
  ToggledButton,
  DisabledButton,
  SizeButton,
  RadiusButton,
  GroupButton,
} from '../../src/components/UsageBox/Button'
import { ButtonAPITable, ButtonGroupAPITable } from '../../src/components/APITable/Button.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'

# Button

You can use the \`Button\` component to create a button or the \`Button.Group\` component to create a group of buttons, allowing you to control functions such as audio playback.

## Import

<CodeBlock code={\`import { Button } from 'echo-ui'\`} />

## Usage

<DefaultButton />

### Toggle State

<ToggledButton />

### Disabled State

<DisabledButton />

### Size

<SizeButton />

### Rounded Corners

<RadiusButton />

### Button Group

<GroupButton />

## Data Attributes

- \`data-toggled\`: Indicates whether the current button is in an active state.

- \`data-disabled\`: Indicates whether the current button is in a disabled state.

## API

### Button

:::tip

Supports all other native \`button\` attributes.

:::

<ButtonAPITable />

### Button.Group

<ButtonGroupAPITable />

## Types

<CodeBlock code={\`interface AbstractButtonProps<T> extends React.HTMLAttributes<T> {
  value?: any
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export interface ButtonProps extends AbstractButtonProps<ButtonRef> {
  toggled?: boolean
  onToggleChange?: (toggled: boolean) => void
}

export interface ButtonGroupProps extends Omit<AbstractButtonProps<ButtonGroupRef>, 'onChange'> {
  value?: any
  classNames?: { button?: string }
  styles?: { button?: React.CSSProperties }
  onChange?: (values: any) => void
}

export interface ButtonRef extends HTMLButtonElement {}

export interface ButtonGroupRef extends HTMLDivElement {}\`} />
`;export{I as content,R as default,G as frontmatter,S as lastUpdatedTime,C as title,y as toc};
