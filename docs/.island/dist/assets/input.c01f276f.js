import{jsx as n,jsxs as r,Fragment as d}from"react/jsx-runtime";import{D as o,a as s,B as l,T as h,S as c,R as u,P as p,M as m,b as g,I}from"./Input.bca9e517.js";import{C as a}from"./CodeBlock.d8e569ad.js";import{k as b}from"./chunk-GM3GRPI5.dfceda77.js";import"./index.036b4c00.js";import"./index.93441784.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./transform.3e3dfeca.js";import"./useCommandAltClick.cec7174c.js";const E=void 0,z=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"disabled-state",text:"Disabled State",depth:3},{id:"bilateral-mode",text:"Bilateral Mode",depth:3},{id:"text-mode",text:"Text Mode",depth:3},{id:"size",text:"Size",depth:3},{id:"rounded-corners",text:"Rounded Corners",depth:3},{id:"progress-bar-color",text:"Progress Bar Color",depth:3},{id:"minimum-and-maximum-values",text:"Minimum and Maximum Values",depth:3},{id:"step-and-sensitivity-during-drag",text:"Step and Sensitivity (During Drag)",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"input",text:"Input",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],R="Input";function i(t){const e=Object.assign({h1:"h1",a:"a",p:"p",code:"code",h2:"h2",div:"div",h3:"h3",ul:"ul",li:"li"},t.components);return r(d,{children:[r(e.h1,{id:"input",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#input",children:"#"}),"Input"]}),`
`,r(e.p,{children:["The ",n(e.code,{children:"Input"})," component allows you to control parameter input and includes drag-and-drop functionality for easier data updates."]}),`
`,r(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(a,{code:"import { Input } from 'echo-ui'"}),`
`,r(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,r(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:n(e.p,{children:"Drag the mouse up and down inside the Input to change the value."})})]}),`
`,r(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:r(e.p,{children:["Press ",n(b,{keys:["command"],children:"+ Left Mouse Button"})," to reset the value."]})})]}),`
`,n(o,{}),`
`,r(e.h3,{id:"disabled-state",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled-state",children:"#"}),"Disabled State"]}),`
`,n(s,{}),`
`,r(e.h3,{id:"bilateral-mode",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#bilateral-mode",children:"#"}),"Bilateral Mode"]}),`
`,n(l,{}),`
`,r(e.h3,{id:"text-mode",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#text-mode",children:"#"}),"Text Mode"]}),`
`,n(h,{}),`
`,r(e.h3,{id:"size",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#size",children:"#"}),"Size"]}),`
`,n(c,{}),`
`,r(e.h3,{id:"rounded-corners",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#rounded-corners",children:"#"}),"Rounded Corners"]}),`
`,n(u,{}),`
`,r(e.h3,{id:"progress-bar-color",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#progress-bar-color",children:"#"}),"Progress Bar Color"]}),`
`,n(p,{}),`
`,r(e.h3,{id:"minimum-and-maximum-values",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#minimum-and-maximum-values",children:"#"}),"Minimum and Maximum Values"]}),`
`,n(m,{}),`
`,r(e.h3,{id:"step-and-sensitivity-during-drag",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#step-and-sensitivity-during-drag",children:"#"}),"Step and Sensitivity (During Drag)"]}),`
`,n(g,{}),`
`,r(e.p,{children:["Combining ",n(e.code,{children:"step"})," and ",n(e.code,{children:"sensitivity"})," allows you to easily adjust the precision of user dragging."]}),`
`,r(e.h2,{id:"data-attributes",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-attributes",children:"#"}),"Data Attributes"]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-dragging"}),": Indicates whether the input box is currently in drag-and-drop mode."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-bilateral"}),": Indicates whether the input box is in bilateral mode."]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:'data-bilateral="positive"'}),": Positive mode."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:'data-bilateral="negative"'}),": Negative mode."]}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,r(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(e.h3,{id:"input-1",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#input-1",children:"#"}),"Input"]}),`
`,r(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:n(e.p,{children:"Supports all other attributes of the native input element."})})]}),`
`,n(I,{}),`
`,r(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(a,{code:`export interface InputProps
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
`})]})}function A(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(i,t)})):i(t)}const w="2024/1/14 18:30:40",L=`import {\r
  DefaultInput,\r
  DisabledInput,\r
  SizeInput,\r
  Bilateral,\r
  RadiusInput,\r
  TextInput,\r
  MinMaxInput,\r
  StepInput,\r
  ProgresColorInput,\r
} from '../../src/components/UsageBox/Input.tsx'\r
import { InputAPITable } from '../../src/components/APITable/Input.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Kbd } from '@nextui-org/react'\r
\r
# Input\r
\r
The \`Input\` component allows you to control parameter input and includes drag-and-drop functionality for easier data updates.\r
\r
## Import\r
\r
<CodeBlock code={\`import { Input } from 'echo-ui'\`} />\r
\r
## Usage\r
\r
:::tip\r
\r
Drag the mouse up and down inside the Input to change the value.\r
\r
:::\r
\r
:::tip\r
\r
Press <Kbd keys={["command"]}>+ Left Mouse Button</Kbd> to reset the value.\r
\r
:::\r
\r
<DefaultInput />\r
\r
### Disabled State\r
\r
<DisabledInput />\r
\r
### Bilateral Mode\r
\r
<Bilateral />\r
\r
### Text Mode\r
\r
<TextInput />\r
\r
### Size\r
\r
<SizeInput />\r
\r
### Rounded Corners\r
\r
<RadiusInput />\r
\r
### Progress Bar Color\r
\r
<ProgresColorInput />\r
\r
### Minimum and Maximum Values\r
\r
<MinMaxInput />\r
\r
### Step and Sensitivity (During Drag)\r
\r
<StepInput />\r
\r
Combining \`step\` and \`sensitivity\` allows you to easily adjust the precision of user dragging.\r
\r
## Data Attributes\r
\r
- \`data-dragging\`: Indicates whether the input box is currently in drag-and-drop mode.\r
\r
- \`data-bilateral\`: Indicates whether the input box is in bilateral mode.\r
\r
  - \`data-bilateral="positive"\`: Positive mode.\r
\r
  - \`data-bilateral="negative"\`: Negative mode.\r
\r
## API\r
\r
### Input\r
\r
:::tip\r
\r
Supports all other attributes of the native input element.\r
\r
:::\r
\r
<InputAPITable />\r
\r
## Type Declarations\r
\r
<CodeBlock code={\`export interface InputProps\r
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'children' | 'size'> {\r
  value?: any\r
  type?: 'text' | 'number'\r
  size?: 'sm' | 'md' | 'lg'\r
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'\r
  bilateral?: boolean\r
  min?: number\r
  max?: number\r
  step?: number\r
  sensitivity?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10\r
  prohibitDrag?: boolean\r
  hideProgress?: boolean\r
  progressColor?: string\r
  onChange?: (e: InputChangeEvent) => void\r
}\r
\r
export interface InputChangeEvent {\r
  value: any\r
  nativeEvent?: React.ChangeEvent<HTMLInputElement>\r
}\r
\r
export interface InputRef extends HTMLInputElement {}\r
\`} />\r
`;export{L as content,A as default,E as frontmatter,w as lastUpdatedTime,R as title,z as toc};
