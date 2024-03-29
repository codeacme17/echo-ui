import{jsx as a,jsxs as n,Fragment as o}from"react/jsx-runtime";import{C as r}from"./CodeBlock.d8e569ad.js";import{D as d,a as s,S as l,C as c,G as h,R as p,b as u}from"./Radio.0df107d4.js";import"react";import"./index.93441784.js";import"./index.105c25bf.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./index.70bfd02c.js";import"./usePropsWithGroup.a30eaab0.js";const L=void 0,P=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"disabled-state",text:"Disabled State",depth:3},{id:"size",text:"Size",depth:3},{id:"color",text:"Color",depth:3},{id:"radio-group",text:"Radio Group",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"radio",text:"Radio",depth:3},{id:"radiogroup",text:"Radio.Group",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],H="Radio";function i(t){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3",ul:"ul",li:"li",code:"code",div:"div",p:"p"},t.components);return n(o,{children:[n(e.h1,{id:"radio",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radio",children:"#"}),"Radio"]}),`
`,n(e.h2,{id:"import",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,a(r,{code:"import { Radio } from '@nafr/echo-ui'"}),`
`,n(e.h2,{id:"usage",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,a(d,{}),`
`,n(e.h3,{id:"disabled-state",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled-state",children:"#"}),"Disabled State"]}),`
`,a(s,{}),`
`,n(e.h3,{id:"size",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#size",children:"#"}),"Size"]}),`
`,a(l,{}),`
`,n(e.h3,{id:"color",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#color",children:"#"}),"Color"]}),`
`,a(c,{}),`
`,n(e.h3,{id:"radio-group",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radio-group",children:"#"}),"Radio Group"]}),`
`,a(h,{}),`
`,n(e.h2,{id:"data-attributes",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-attributes",children:"#"}),"Data Attributes"]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[a(e.code,{children:"data-checked"}),": Indicates whether the radio button is currently checked."]}),`
`,n(e.li,{children:[a(e.code,{children:"data-disabled"}),": Indicates whether the radio button is currently disabled."]}),`
`]}),`
`,n(e.h2,{id:"api",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"radio-1",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radio-1",children:"#"}),"Radio"]}),`
`,n(e.div,{className:"island-directive tip",children:[a(e.p,{className:"island-directive-title",children:"TIP"}),a(e.div,{className:"island-directive-content",children:n(e.p,{children:["Supports all other attributes of the native ",a(e.code,{children:"input"})," element with a type of ",a(e.code,{children:"radio"}),"."]})})]}),`
`,a(p,{}),`
`,n(e.h3,{id:"radiogroup",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radiogroup",children:"#"}),"Radio.Group"]}),`
`,a(u,{}),`
`,n(e.h2,{id:"type-declarations",children:[a(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,a(r,{code:`interface AbstractRadioProps<T>
  extends Omit<React.HTMLAttributes<T>, 'onChange' | 'onClick' | 'onMouseEnter' | 'onMouseLeave'> {
  value?: any
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
  classNames?: { label?: string }
  styles?: { label?: React.CSSProperties }
  onChange?: (e: RadioChangeEvent) => void
}

export interface RadioProps extends AbstractRadioProps<HTMLInputElement> {
  checked?: boolean
  onClick?: React.MouseEventHandler<HTMLInputElement>
  onMouseEnter?: React.MouseEventHandler<HTMLLabelElement>
  onMouseLeave?: React.MouseEventHandler<HTMLLabelElement>
}

export interface RadioGroupProps extends AbstractRadioProps<HTMLDivElement> {
  value?: any
  classNames?: { radio?: string } & AbstractRadioProps<HTMLDivElement>['classNames']
  styles?: { radio?: React.CSSProperties } & AbstractRadioProps<HTMLDivElement>['styles']
}

export interface RadioChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}

export interface RadioRef extends HTMLLabelElement {}

export interface RadioGroupRef extends HTMLDivElement {}`})]})}function D(t={}){const{wrapper:e}=t.components||{};return e?a(e,Object.assign({},t,{children:a(i,t)})):i(t)}const y="2024/3/15 13:46:55",A=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Default, Disabled, Size, Color, Group } from '../../src/components/UsageBox/Radio.tsx'
import { RadioAPITable, RadioGroupAPITable } from '../../src/components/APITable/Radio.tsx'

# Radio

## Import

<CodeBlock code={\`import { Radio } from '@nafr/echo-ui'\`} />

## Usage

<Default />

### Disabled State

<Disabled />

### Size

<Size />

### Color

<Color />

### Radio Group

<Group />

## Data Attributes

- \`data-checked\`: Indicates whether the radio button is currently checked.
- \`data-disabled\`: Indicates whether the radio button is currently disabled.

## API

### Radio

:::tip

Supports all other attributes of the native \`input\` element with a type of \`radio\`.

:::

<RadioAPITable />

### Radio.Group

<RadioGroupAPITable />

## Type Declarations

<CodeBlock code={\`interface AbstractRadioProps<T>
  extends Omit<React.HTMLAttributes<T>, 'onChange' | 'onClick' | 'onMouseEnter' | 'onMouseLeave'> {
  value?: any
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
  classNames?: { label?: string }
  styles?: { label?: React.CSSProperties }
  onChange?: (e: RadioChangeEvent) => void
}

export interface RadioProps extends AbstractRadioProps<HTMLInputElement> {
  checked?: boolean
  onClick?: React.MouseEventHandler<HTMLInputElement>
  onMouseEnter?: React.MouseEventHandler<HTMLLabelElement>
  onMouseLeave?: React.MouseEventHandler<HTMLLabelElement>
}

export interface RadioGroupProps extends AbstractRadioProps<HTMLDivElement> {
  value?: any
  classNames?: { radio?: string } & AbstractRadioProps<HTMLDivElement>['classNames']
  styles?: { radio?: React.CSSProperties } & AbstractRadioProps<HTMLDivElement>['styles']
}

export interface RadioChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}

export interface RadioRef extends HTMLLabelElement {}

export interface RadioGroupRef extends HTMLDivElement {}\`} /

>
`;export{A as content,D as default,L as frontmatter,y as lastUpdatedTime,H as title,P as toc};
