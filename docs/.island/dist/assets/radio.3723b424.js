import{jsx as r,jsxs as a,Fragment as o}from"react/jsx-runtime";import{C as t}from"./CodeBlock.d8e569ad.js";import{D as d,a as s,S as l,C as c,G as h,R as p,b as u}from"./Radio.9b17ffb9.js";import"react";import"./index.93441784.js";import"./index.2440eb3f.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./index.026cdb9e.js";import"./usePropsWithGroup.a30eaab0.js";const L=void 0,P=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"disabled-state",text:"Disabled State",depth:3},{id:"size",text:"Size",depth:3},{id:"color",text:"Color",depth:3},{id:"radio-group",text:"Radio Group",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"radio",text:"Radio",depth:3},{id:"radiogroup",text:"Radio.Group",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],H="Radio";function i(n){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3",ul:"ul",li:"li",code:"code",div:"div",p:"p"},n.components);return a(o,{children:[a(e.h1,{id:"radio",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radio",children:"#"}),"Radio"]}),`
`,a(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(t,{code:"import { Radio } from '@nafr/echo-ui'"}),`
`,a(e.h2,{id:"usage",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,r(d,{}),`
`,a(e.h3,{id:"disabled-state",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled-state",children:"#"}),"Disabled State"]}),`
`,r(s,{}),`
`,a(e.h3,{id:"size",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#size",children:"#"}),"Size"]}),`
`,r(l,{}),`
`,a(e.h3,{id:"color",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#color",children:"#"}),"Color"]}),`
`,r(c,{}),`
`,a(e.h3,{id:"radio-group",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radio-group",children:"#"}),"Radio Group"]}),`
`,r(h,{}),`
`,a(e.h2,{id:"data-attributes",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-attributes",children:"#"}),"Data Attributes"]}),`
`,a(e.ul,{children:[`
`,a(e.li,{children:[r(e.code,{children:"data-checked"}),": Indicates whether the radio button is currently checked."]}),`
`,a(e.li,{children:[r(e.code,{children:"data-disabled"}),": Indicates whether the radio button is currently disabled."]}),`
`]}),`
`,a(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,a(e.h3,{id:"radio-1",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radio-1",children:"#"}),"Radio"]}),`
`,a(e.div,{className:"island-directive tip",children:[r(e.p,{className:"island-directive-title",children:"TIP"}),r(e.div,{className:"island-directive-content",children:a(e.p,{children:["Supports all other attributes of the native ",r(e.code,{children:"input"})," element with a type of ",r(e.code,{children:"radio"}),"."]})})]}),`
`,r(p,{}),`
`,a(e.h3,{id:"radiogroup",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radiogroup",children:"#"}),"Radio.Group"]}),`
`,r(u,{}),`
`,a(e.h2,{id:"type-declarations",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,r(t,{code:`interface AbstractRadioProps<T>
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

export interface RadioGroupRef extends HTMLDivElement {}`})]})}function D(n={}){const{wrapper:e}=n.components||{};return e?r(e,Object.assign({},n,{children:r(i,n)})):i(n)}const y="2024/3/15 13:46:55",A=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Default, Disabled, Size, Color, Group } from '../../src/components/UsageBox/Radio.tsx'\r
import { RadioAPITable, RadioGroupAPITable } from '../../src/components/APITable/Radio.tsx'\r
\r
# Radio\r
\r
## Import\r
\r
<CodeBlock code={\`import { Radio } from '@nafr/echo-ui'\`} />\r
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
### Radio Group\r
\r
<Group />\r
\r
## Data Attributes\r
\r
- \`data-checked\`: Indicates whether the radio button is currently checked.\r
- \`data-disabled\`: Indicates whether the radio button is currently disabled.\r
\r
## API\r
\r
### Radio\r
\r
:::tip\r
\r
Supports all other attributes of the native \`input\` element with a type of \`radio\`.\r
\r
:::\r
\r
<RadioAPITable />\r
\r
### Radio.Group\r
\r
<RadioGroupAPITable />\r
\r
## Type Declarations\r
\r
<CodeBlock code={\`interface AbstractRadioProps<T>\r
  extends Omit<React.HTMLAttributes<T>, 'onChange' | 'onClick' | 'onMouseEnter' | 'onMouseLeave'> {\r
  value?: any\r
  disabled?: boolean\r
  size?: 'sm' | 'md' | 'lg'\r
  color?: string\r
  classNames?: { label?: string }\r
  styles?: { label?: React.CSSProperties }\r
  onChange?: (e: RadioChangeEvent) => void\r
}\r
\r
export interface RadioProps extends AbstractRadioProps<HTMLInputElement> {\r
  checked?: boolean\r
  onClick?: React.MouseEventHandler<HTMLInputElement>\r
  onMouseEnter?: React.MouseEventHandler<HTMLLabelElement>\r
  onMouseLeave?: React.MouseEventHandler<HTMLLabelElement>\r
}\r
\r
export interface RadioGroupProps extends AbstractRadioProps<HTMLDivElement> {\r
  value?: any\r
  classNames?: { radio?: string } & AbstractRadioProps<HTMLDivElement>['classNames']\r
  styles?: { radio?: React.CSSProperties } & AbstractRadioProps<HTMLDivElement>['styles']\r
}\r
\r
export interface RadioChangeEvent {\r
  value: any\r
  nativeEvent: React.ChangeEvent<HTMLInputElement>\r
}\r
\r
export interface RadioRef extends HTMLLabelElement {}\r
\r
export interface RadioGroupRef extends HTMLDivElement {}\`} /\r
\r
>\r
`;export{A as content,D as default,L as frontmatter,y as lastUpdatedTime,H as title,P as toc};
