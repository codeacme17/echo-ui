import{jsx as r,jsxs as n,Fragment as d}from"react/jsx-runtime";import{C as i}from"./CodeBlock.d8e569ad.js";import{D as o,a as l,V as s,B as c,A as h,S as m,C as p,U as u,b}from"./Slider.f2830243.js";import{k as g}from"./chunk-GM3GRPI5.dfceda77.js";import"react";import"./index.93441784.js";import"./index.2440eb3f.js";import"../client-entry.js";import"./chunk-FXLYF44B.3661c596.js";import"react-dom";import"./usePlayer.db8858d9.js";import"./log.83f32a09.js";import"./transform.3e3dfeca.js";import"./index.6eef3859.js";import"./useVuMeter.35f28026.js";import"./Analyser.9e774fcc.js";import"./index.fe61fadf.js";import"./usePropsWithGroup.a30eaab0.js";import"./square.0deaf827.js";import"./play.c5eb55f2.js";import"./index.d3240143.js";import"./index.3017822d.js";import"./axis.b2198668.js";import"./assertion.e9357fda.js";import"./useCommandAltClick.cec7174c.js";const K=void 0,_=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"disabled-state",text:"Disabled State",depth:3},{id:"vertical-mode",text:"Vertical Mode",depth:3},{id:"bilateral-mode",text:"Bilateral Mode",depth:3},{id:"adding-coordinates",text:"Adding Coordinates",depth:3},{id:"step",text:"Step",depth:3},{id:"custom-styling",text:"Custom Styling",depth:3},{id:"uncontrolled-mode",text:"Uncontrolled Mode",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"slider",text:"Slider",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],X="Slider";function a(t){const e=Object.assign({h1:"h1",a:"a",p:"p",code:"code",h2:"h2",div:"div",h3:"h3",ul:"ul",li:"li"},t.components);return n(d,{children:[n(e.h1,{id:"slider",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#slider",children:"#"}),"Slider"]}),`
`,n(e.p,{children:["You can control the range of values by sliding the input bar. ",r(e.code,{children:"Slider"})," is usually used in scenarios such as adjusting the volume, controlling the progress of playback, etc."]}),`
`,n(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(i,{code:"import { Slider } from '@nafr/echo-ui'"}),`
`,n(e.h2,{id:"usage",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,n(e.div,{className:"island-directive tip",children:[r(e.p,{className:"island-directive-title",children:"TIP"}),r(e.div,{className:"island-directive-content",children:n(e.p,{children:["Press ",r(g,{keys:["command"],children:"+ Left Mouse Button"})," to reset the value."]})})]}),`
`,r(o,{}),`
`,n(e.h3,{id:"disabled-state",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled-state",children:"#"}),"Disabled State"]}),`
`,r(l,{}),`
`,n(e.h3,{id:"vertical-mode",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#vertical-mode",children:"#"}),"Vertical Mode"]}),`
`,r(s,{}),`
`,n(e.h3,{id:"bilateral-mode",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#bilateral-mode",children:"#"}),"Bilateral Mode"]}),`
`,r(c,{}),`
`,n(e.h3,{id:"adding-coordinates",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#adding-coordinates",children:"#"}),"Adding Coordinates"]}),`
`,r(h,{}),`
`,n(e.h3,{id:"step",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#step",children:"#"}),"Step"]}),`
`,r(m,{}),`
`,n(e.h3,{id:"custom-styling",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#custom-styling",children:"#"}),"Custom Styling"]}),`
`,r(p,{}),`
`,n(e.p,{children:["You can use the ",r(e.code,{children:"classNames"})," or ",r(e.code,{children:"styles"})," exposed by the component to style specific elements."]}),`
`,n(e.h3,{id:"uncontrolled-mode",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#uncontrolled-mode",children:"#"}),"Uncontrolled Mode"]}),`
`,r(u,{}),`
`,n(e.p,{children:["In uncontrolled mode, the Slider component is non-interactive. You can use this mode to dynamically change numerical values such as volume and effects (using ",r(e.code,{children:"hideThumb"})," and ",r(e.code,{children:"prohibitInteraction"}),")."]}),`
`,n(e.h2,{id:"data-attributes",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-attributes",children:"#"}),"Data Attributes"]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[r(e.code,{children:"data-dragging"}),": Indicates whether the slider is being dragged."]}),`
`,n(e.li,{children:[r(e.code,{children:"data-bilateral"}),": Indicates whether it's in bilateral mode."]}),`
`,n(e.li,{children:[r(e.code,{children:"data-vertical"}),": Indicates whether it's in vertical mode."]}),`
`,n(e.li,{children:[r(e.code,{children:"data-disabled"}),": Indicates whether it's disabled."]}),`
`,n(e.li,{children:[r(e.code,{children:"data-direction"}),": Indicates the direction, either 'positive' for positive or 'negative' for negative (only applicable in bilateral mode)."]}),`
`]}),`
`,n(e.h2,{id:"api",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.div,{className:"island-directive warning",children:[r(e.p,{className:"island-directive-title",children:"WARNING"}),r(e.div,{className:"island-directive-content",children:n(e.p,{children:["The Slider component inherits from ",r(e.code,{children:"React.HTMLAttributes<HTMLDivElement>"})," instead of the native ",r(e.code,{children:"input"}),"."]})})]}),`
`,n(e.h3,{id:"slider-1",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#slider-1",children:"#"}),"Slider"]}),`
`,r(b,{}),`
`,n(e.h2,{id:"type-declarations",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,r(i,{code:`import type { AxisProps } from '@nafr/echo-ui'

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

export interface SliderRef extends HTMLDivElement {}`})]})}function F(t={}){const{wrapper:e}=t.components||{};return e?r(e,Object.assign({},t,{children:r(a,t)})):a(t)}const G="2024/3/15 13:46:55",W=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import {\r
  Default,\r
  Disabled,\r
  Vertical,\r
  Bilateral,\r
  Axis,\r
  CustomColors,\r
  Step,\r
  Uncontrolled,\r
} from '../../src/components/UsageBox/Slider.tsx'\r
import { SliderAPITable } from '../../src/components/APITable/Slider.tsx'\r
import { Kbd } from '@nextui-org/react'\r
\r
# Slider\r
\r
You can control the range of values by sliding the input bar. \`Slider\` is usually used in scenarios such as adjusting the volume, controlling the progress of playback, etc.\r
\r
## Import\r
\r
<CodeBlock code={\`import { Slider } from '@nafr/echo-ui'\`} />\r
\r
## Usage\r
\r
:::tip\r
\r
Press <Kbd keys={["command"]}>+ Left Mouse Button</Kbd> to reset the value.\r
\r
:::\r
\r
<Default />\r
\r
### Disabled State\r
\r
<Disabled />\r
\r
### Vertical Mode\r
\r
<Vertical />\r
\r
### Bilateral Mode\r
\r
<Bilateral />\r
\r
### Adding Coordinates\r
\r
<Axis />\r
\r
### Step\r
\r
<Step />\r
\r
### Custom Styling\r
\r
<CustomColors />\r
\r
You can use the \`classNames\` or \`styles\` exposed by the component to style specific elements.\r
\r
### Uncontrolled Mode\r
\r
<Uncontrolled />\r
\r
In uncontrolled mode, the Slider component is non-interactive. You can use this mode to dynamically change numerical values such as volume and effects (using \`hideThumb\` and \`prohibitInteraction\`).\r
\r
## Data Attributes\r
\r
- \`data-dragging\`: Indicates whether the slider is being dragged.\r
- \`data-bilateral\`: Indicates whether it's in bilateral mode.\r
- \`data-vertical\`: Indicates whether it's in vertical mode.\r
- \`data-disabled\`: Indicates whether it's disabled.\r
- \`data-direction\`: Indicates the direction, either 'positive' for positive or 'negative' for negative (only applicable in bilateral mode).\r
\r
## API\r
\r
:::warning\r
\r
The Slider component inherits from \`React.HTMLAttributes<HTMLDivElement>\` instead of the native \`input\`.\r
\r
:::\r
\r
### Slider\r
\r
<SliderAPITable />\r
\r
## Type Declarations\r
\r
<CodeBlock code={\`import type { AxisProps } from '@nafr/echo-ui'\r
\r
export interface SliderProps extends Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'onChange'> {\r
  value?: number\r
  min?: number\r
  max?: number\r
  step?: number\r
  disabled?: boolean\r
  vertical?: boolean\r
  bilateral?: boolean\r
  hideThumb?: boolean\r
  hideThumbLabel?: boolean\r
  prohibitInteraction?: boolean\r
  classNames?: {\r
    progress?: string\r
    thumb?: string\r
    thumbLabel?: string\r
    axis?: string\r
  }\r
  styles?: {\r
    progress?: React.CSSProperties\r
    thumb?: React.CSSProperties\r
    thumbLabel?: React.CSSProperties\r
    axis?: React.CSSProperties\r
  }\r
  axis?: boolean\r
  axisProps?: Omit<AxisProps, 'className' | 'style'>\r
  onChange?: (value: number) => void\r
  onChangeEnd?: (value: number) => void\r
}\r
\r
export interface SliderRef extends HTMLDivElement {}\`} />\r
`;export{W as content,F as default,K as frontmatter,G as lastUpdatedTime,X as title,_ as toc};
