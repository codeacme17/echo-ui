import{jsx as r,jsxs as n,Fragment as o}from"react/jsx-runtime";import{C as a}from"./CodeBlock.913859b9.js";import{D as i,a as h,S as s,C as d,G as l,b,c as p}from"./Checkbox.0d4c7fa1.js";import"react";import"./index.b8f1e832.js";import"../client-entry.js";import"./chunk-FXLYF44B.f49f16be.js";import"react-dom";const E=void 0,M=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"disabled-state",text:"Disabled State",depth:3},{id:"size",text:"Size",depth:3},{id:"color",text:"Color",depth:3},{id:"checkbox-group",text:"Checkbox Group",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"checkbox",text:"Checkbox",depth:3},{id:"checkboxgroup",text:"Checkbox.Group",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],g="Checkbox";function c(t){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3",ul:"ul",li:"li",code:"code",div:"div",p:"p"},t.components);return n(o,{children:[n(e.h1,{id:"checkbox",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#checkbox",children:"#"}),"Checkbox"]}),`
`,n(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(a,{code:"import { Checkbox } from 'echo-ui'"}),`
`,n(e.h2,{id:"usage",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,r(i,{}),`
`,n(e.h3,{id:"disabled-state",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled-state",children:"#"}),"Disabled State"]}),`
`,r(h,{}),`
`,n(e.h3,{id:"size",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#size",children:"#"}),"Size"]}),`
`,r(s,{}),`
`,n(e.h3,{id:"color",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#color",children:"#"}),"Color"]}),`
`,r(d,{}),`
`,n(e.h3,{id:"checkbox-group",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#checkbox-group",children:"#"}),"Checkbox Group"]}),`
`,r(l,{}),`
`,n(e.h2,{id:"data-attributes",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-attributes",children:"#"}),"Data Attributes"]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[r(e.code,{children:"data-checked"}),": Indicates whether the checkbox is currently checked."]}),`
`,n(e.li,{children:[r(e.code,{children:"data-disabled"}),": Indicates whether the checkbox is currently disabled."]}),`
`]}),`
`,n(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"checkbox-1",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#checkbox-1",children:"#"}),"Checkbox"]}),`
`,n(e.div,{className:"island-directive tip",children:[r(e.p,{className:"island-directive-title",children:"TIP"}),r(e.div,{className:"island-directive-content",children:n(e.p,{children:["Supports all other attributes of the ",r(e.code,{children:"input"})," element with type ",r(e.code,{children:"checkbox"}),"."]})})]}),`
`,r(b,{}),`
`,n(e.h3,{id:"checkboxgroup",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#checkboxgroup",children:"#"}),"Checkbox.Group"]}),`
`,r(p,{}),`
`,n(e.h2,{id:"type-declarations",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,r(a,{code:`interface AbstractCheckboxProps<T> extends Omit<React.HTMLAttributes<T>, 'onChange' | 'value'> {
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

export interface CheckboxGroupRef extends HTMLDivElement {}`})]})}function P(t={}){const{wrapper:e}=t.components||{};return e?r(e,Object.assign({},t,{children:r(c,t)})):c(t)}const H="2024/1/14 18:30:40",L=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Default, Disabled, Size, Color, Group } from '../../src/components/UsageBox/checkbox.tsx'\r
import { CheckboxAPITable, CheckboxGroupAPITable } from '../../src/components/APITable/Checkbox.tsx'\r
\r
# Checkbox\r
\r
## Import\r
\r
<CodeBlock code={\`import { Checkbox } from 'echo-ui'\`} />\r
\r
## Usage\r
\r
<Default />\r
\r
### Disabled State\r
\r
<Disabled />\r
\r
### Size\r
\r
<Size />\r
\r
### Color\r
\r
<Color />\r
\r
### Checkbox Group\r
\r
<Group />\r
\r
## Data Attributes\r
\r
- \`data-checked\`: Indicates whether the checkbox is currently checked.\r
- \`data-disabled\`: Indicates whether the checkbox is currently disabled.\r
\r
## API\r
\r
### Checkbox\r
\r
:::tip\r
\r
Supports all other attributes of the \`input\` element with type \`checkbox\`.\r
\r
:::\r
\r
<CheckboxAPITable />\r
\r
### Checkbox.Group\r
\r
<CheckboxGroupAPITable />\r
\r
## Type Declarations\r
\r
<CodeBlock code={\`interface AbstractCheckboxProps<T> extends Omit<React.HTMLAttributes<T>, 'onChange' | 'value'> {\r
  value?: any\r
  disabled?: boolean\r
  checked?: boolean\r
  size?: 'sm' | 'md' | 'lg'\r
  color?: string\r
  classNames?: { label?: string }\r
  styles?: { label?: React.CSSProperties }\r
  onChange?: (e: CheckboxChangeEvent) => void\r
}\r
\r
export interface CheckboxProps extends AbstractCheckboxProps<HTMLInputElement> {\r
  onClick?: React.MouseEventHandler<HTMLElement>\r
  onMouseEnter?: React.MouseEventHandler<HTMLElement>\r
  onMouseLeave?: React.MouseEventHandler<HTMLElement>\r
}\r
\r
export interface CheckboxGroupProps extends AbstractCheckboxProps<HTMLDivElement> {\r
  value?: any[]\r
  classNames?: { checkbox?: string } & AbstractCheckboxProps<HTMLDivElement>['classNames']\r
  styles?: { checkbox?: React.CSSProperties } & AbstractCheckboxProps<HTMLDivElement>['styles']\r
}\r
\r
export interface CheckboxChangeEvent {\r
  value: any\r
  nativeEvent: React.ChangeEvent<HTMLInputElement>\r
}\r
\r
export interface CheckboxRef extends HTMLLabelElement {}\r
\r
export interface CheckboxGroupRef extends HTMLDivElement {}\`} />\r
`;export{L as content,P as default,E as frontmatter,H as lastUpdatedTime,g as title,M as toc};
