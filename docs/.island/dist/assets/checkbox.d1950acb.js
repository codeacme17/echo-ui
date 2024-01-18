import{jsx as n,jsxs as t,Fragment as o}from"react/jsx-runtime";import{C as c}from"./CodeBlock.913859b9.js";import{D as i,a as h,S as s,C as d,G as l,b,c as p}from"./Checkbox.86684058.js";import"react";import"./index.d5ce5d84.js";import"../client-entry.js";import"./chunk-FXLYF44B.f49f16be.js";import"react-dom";const E=void 0,M=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"disabled-state",text:"Disabled State",depth:3},{id:"size",text:"Size",depth:3},{id:"color",text:"Color",depth:3},{id:"checkbox-group",text:"Checkbox Group",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"checkbox",text:"Checkbox",depth:3},{id:"checkboxgroup",text:"Checkbox.Group",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],g="Checkbox";function r(a){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3",ul:"ul",li:"li",code:"code",div:"div",p:"p"},a.components);return t(o,{children:[t(e.h1,{id:"checkbox",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#checkbox",children:"#"}),"Checkbox"]}),`
`,t(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(c,{code:"import { Checkbox } from 'echo-ui'"}),`
`,t(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,n(i,{}),`
`,t(e.h3,{id:"disabled-state",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled-state",children:"#"}),"Disabled State"]}),`
`,n(h,{}),`
`,t(e.h3,{id:"size",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#size",children:"#"}),"Size"]}),`
`,n(s,{}),`
`,t(e.h3,{id:"color",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#color",children:"#"}),"Color"]}),`
`,n(d,{}),`
`,t(e.h3,{id:"checkbox-group",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#checkbox-group",children:"#"}),"Checkbox Group"]}),`
`,n(l,{}),`
`,t(e.h2,{id:"data-attributes",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-attributes",children:"#"}),"Data Attributes"]}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[n(e.code,{children:"data-checked"}),": Indicates whether the checkbox is currently checked."]}),`
`,t(e.li,{children:[n(e.code,{children:"data-disabled"}),": Indicates whether the checkbox is currently disabled."]}),`
`]}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"checkbox-1",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#checkbox-1",children:"#"}),"Checkbox"]}),`
`,t(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:t(e.p,{children:["Supports all other attributes of the ",n(e.code,{children:"input"})," element with type ",n(e.code,{children:"checkbox"}),"."]})})]}),`
`,n(b,{}),`
`,t(e.h3,{id:"checkboxgroup",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#checkboxgroup",children:"#"}),"Checkbox.Group"]}),`
`,n(p,{}),`
`,t(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(c,{code:`interface AbstractCheckboxProps<T> extends Omit<React.HTMLAttributes<T>, 'onChange' | 'value'> {
  value?: any
  disabled?: boolean
  checked?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
  classNames?: { label?: string }
  styles?: { label?: React.CSSProperties }
  onChange?: (e: CheckboxChangeEvent) => void
}

export interface CheckboxProps extends AbstractCheckboxProps<HTMLInputElement> {
  onClick?: React.MouseEventHandler<HTMLElement>
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
}

export interface CheckboxGroupProps extends AbstractCheckboxProps<HTMLDivElement> {
  value?: any[]
  classNames?: { checkbox?: string } & AbstractCheckboxProps<HTMLDivElement>['classNames']
  styles?: { checkbox?: React.CSSProperties } & AbstractCheckboxProps<HTMLDivElement>['styles']
}

export interface CheckboxChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}

export interface CheckboxRef extends HTMLLabelElement {}

export interface CheckboxGroupRef extends HTMLDivElement {}`})]})}function P(a={}){const{wrapper:e}=a.components||{};return e?n(e,Object.assign({},a,{children:n(r,a)})):r(a)}const H="2024/1/14 18:30:40",L=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Default, Disabled, Size, Color, Group } from '../../src/components/UsageBox/checkbox.tsx'
import { CheckboxAPITable, CheckboxGroupAPITable } from '../../src/components/APITable/Checkbox.tsx'

# Checkbox

## Import

<CodeBlock code={\`import { Checkbox } from 'echo-ui'\`} />

## Usage

<Default />

### Disabled State

<Disabled />

### Size

<Size />

### Color

<Color />

### Checkbox Group

<Group />

## Data Attributes

- \`data-checked\`: Indicates whether the checkbox is currently checked.
- \`data-disabled\`: Indicates whether the checkbox is currently disabled.

## API

### Checkbox

:::tip

Supports all other attributes of the \`input\` element with type \`checkbox\`.

:::

<CheckboxAPITable />

### Checkbox.Group

<CheckboxGroupAPITable />

## Type Declarations

<CodeBlock code={\`interface AbstractCheckboxProps<T> extends Omit<React.HTMLAttributes<T>, 'onChange' | 'value'> {
  value?: any
  disabled?: boolean
  checked?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
  classNames?: { label?: string }
  styles?: { label?: React.CSSProperties }
  onChange?: (e: CheckboxChangeEvent) => void
}

export interface CheckboxProps extends AbstractCheckboxProps<HTMLInputElement> {
  onClick?: React.MouseEventHandler<HTMLElement>
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
}

export interface CheckboxGroupProps extends AbstractCheckboxProps<HTMLDivElement> {
  value?: any[]
  classNames?: { checkbox?: string } & AbstractCheckboxProps<HTMLDivElement>['classNames']
  styles?: { checkbox?: React.CSSProperties } & AbstractCheckboxProps<HTMLDivElement>['styles']
}

export interface CheckboxChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}

export interface CheckboxRef extends HTMLLabelElement {}

export interface CheckboxGroupRef extends HTMLDivElement {}\`} />
`;export{L as content,P as default,E as frontmatter,H as lastUpdatedTime,g as title,M as toc};
