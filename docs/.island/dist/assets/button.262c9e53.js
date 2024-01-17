import{jsx as e,jsxs as n,Fragment as d}from"react/jsx-runtime";import{D as i,T as s,a as u,S as c,R as l,G as h,B as p,b}from"./Button.40d93db0.js";import{C as o}from"./CodeBlock.f3a900da.js";import"./index.f9d3b056.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.9d30e58e.js";import"react-dom";const A=void 0,G=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"toggle-state",text:"Toggle State",depth:3},{id:"disabled-state",text:"Disabled State",depth:3},{id:"size",text:"Size",depth:3},{id:"rounded-corners",text:"Rounded Corners",depth:3},{id:"button-group",text:"Button Group",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"button",text:"Button",depth:3},{id:"buttongroup",text:"Button.Group",depth:3},{id:"types",text:"Types",depth:2}],y="Button";function a(r){const t=Object.assign({h1:"h1",a:"a",p:"p",code:"code",h2:"h2",h3:"h3",ul:"ul",li:"li",div:"div"},r.components);return n(d,{children:[n(t.h1,{id:"button",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#button",children:"#"}),"Button"]}),`
`,n(t.p,{children:["You can use the ",e(t.code,{children:"Button"})," component to create a button or the ",e(t.code,{children:"Button.Group"})," component to create a group of buttons, allowing you to control functions such as audio playback."]}),`
`,n(t.h2,{id:"import",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,e(o,{code:"import { Button } from 'echo-ui'"}),`
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
`,e(o,{code:`interface AbstractButtonProps<T> extends React.HTMLAttributes<T> {
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
  value?: any[]
  classNames?: { button?: string }
  styles?: { button?: React.CSSProperties }
  onChange?: (values: any[]) => void
}

export interface ButtonRef extends HTMLButtonElement {}

export interface ButtonGroupRef extends HTMLDivElement {}`})]})}function C(r={}){const{wrapper:t}=r.components||{};return t?e(t,Object.assign({},r,{children:e(a,r)})):a(r)}const R="2024/1/14 18:30:40",S=`import {\r
  DefaultButton,\r
  ToggledButton,\r
  DisabledButton,\r
  SizeButton,\r
  RadiusButton,\r
  GroupButton,\r
} from '../../src/components/UsageBox/Button'\r
import { ButtonAPITable, ButtonGroupAPITable } from '../../src/components/APITable/Button.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
\r
# Button\r
\r
You can use the \`Button\` component to create a button or the \`Button.Group\` component to create a group of buttons, allowing you to control functions such as audio playback.\r
\r
## Import\r
\r
<CodeBlock code={\`import { Button } from 'echo-ui'\`} />\r
\r
## Usage\r
\r
<DefaultButton />\r
\r
### Toggle State\r
\r
<ToggledButton />\r
\r
### Disabled State\r
\r
<DisabledButton />\r
\r
### Size\r
\r
<SizeButton />\r
\r
### Rounded Corners\r
\r
<RadiusButton />\r
\r
### Button Group\r
\r
<GroupButton />\r
\r
## Data Attributes\r
\r
- \`data-toggled\`: Indicates whether the current button is in an active state.\r
\r
- \`data-disabled\`: Indicates whether the current button is in a disabled state.\r
\r
## API\r
\r
### Button\r
\r
:::tip\r
\r
Supports all other native \`button\` attributes.\r
\r
:::\r
\r
<ButtonAPITable />\r
\r
### Button.Group\r
\r
<ButtonGroupAPITable />\r
\r
## Types\r
\r
<CodeBlock code={\`interface AbstractButtonProps<T> extends React.HTMLAttributes<T> {\r
  value?: any\r
  disabled?: boolean\r
  size?: 'sm' | 'md' | 'lg'\r
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'\r
}\r
\r
export interface ButtonProps extends AbstractButtonProps<ButtonRef> {\r
  toggled?: boolean\r
  onToggleChange?: (toggled: boolean) => void\r
}\r
\r
export interface ButtonGroupProps extends Omit<AbstractButtonProps<ButtonGroupRef>, 'onChange'> {\r
  value?: any[]\r
  classNames?: { button?: string }\r
  styles?: { button?: React.CSSProperties }\r
  onChange?: (values: any[]) => void\r
}\r
\r
export interface ButtonRef extends HTMLButtonElement {}\r
\r
export interface ButtonGroupRef extends HTMLDivElement {}\`} />\r
`;export{S as content,C as default,A as frontmatter,R as lastUpdatedTime,y as title,G as toc};