import{jsx as n,jsxs as r,Fragment as i}from"react/jsx-runtime";import{D as s,a as d,B as l,R as c,L as h,S as p,b,C as u,G as m,K as g,c as f}from"./Knob.758c2f3b.js";import{C as o}from"./CodeBlock.de027be4.js";import{k as v}from"./chunk-GM3GRPI5.005caca1.js";import"./index.3d5bb27b.js";import"./index.2d091e0a.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.3b11858b.js";import"react-dom";const I=void 0,D=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"disabled",text:"Disabled",depth:3},{id:"bilateral-rotation-mode",text:"Bilateral Rotation Mode",depth:3},{id:"rotation-angle-range",text:"Rotation Angle Range",depth:3},{id:"labels",text:"Labels",depth:3},{id:"step-and-sensitivity",text:"Step and Sensitivity",depth:3},{id:"size-related",text:"Size-Related",depth:3},{id:"color-related",text:"Color-Related",depth:3},{id:"knob-group",text:"Knob Group",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"knob",text:"Knob",depth:3},{id:"knobgroup",text:"Knob.Group",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],T="Knob";function a(t){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",div:"div",h3:"h3",code:"code",ul:"ul",li:"li"},t.components);return r(i,{children:[r(e.h1,{id:"knob",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#knob",children:"#"}),"Knob"]}),`
`,n(e.p,{children:"You can use the Knob component to adjust parameters such as volume and effects."}),`
`,r(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(o,{code:"import { Knob } from 'echo-ui'"}),`
`,r(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,r(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:r(e.p,{children:["Press ",n(v,{keys:["command"],children:" + Left Mouse Button"})," to reset the value."]})})]}),`
`,n(s,{}),`
`,r(e.h3,{id:"disabled",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled",children:"#"}),"Disabled"]}),`
`,n(d,{}),`
`,r(e.h3,{id:"bilateral-rotation-mode",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#bilateral-rotation-mode",children:"#"}),"Bilateral Rotation Mode"]}),`
`,n(l,{}),`
`,r(e.h3,{id:"rotation-angle-range",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#rotation-angle-range",children:"#"}),"Rotation Angle Range"]}),`
`,n(c,{}),`
`,r(e.h3,{id:"labels",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#labels",children:"#"}),"Labels"]}),`
`,n(h,{}),`
`,r(e.h3,{id:"step-and-sensitivity",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#step-and-sensitivity",children:"#"}),"Step and Sensitivity"]}),`
`,n(p,{}),`
`,r(e.h3,{id:"size-related",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#size-related",children:"#"}),"Size-Related"]}),`
`,n(b,{}),`
`,r(e.p,{children:["To avoid affecting the normal use of the component, ",n(e.code,{children:"Knob"})," does not expose all style modification permissions for ",n(e.code,{children:"style"})," and ",n(e.code,{children:"className"}),". Instead, it provides a set of size-related props to adjust the component's size (",n(e.code,{children:"size"})," ",n(e.code,{children:"trackWidth"})," ",n(e.code,{children:"pointerWidth"})," ",n(e.code,{children:"pointerHeight"}),")."]}),`
`,r(e.h3,{id:"color-related",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#color-related",children:"#"}),"Color-Related"]}),`
`,n(u,{}),`
`,r(e.p,{children:["Similarly, ",n(e.code,{children:"Knob"})," exposes color-related styles through props. You can adjust the component's colors using these props (",n(e.code,{children:"trackColor"})," ",n(e.code,{children:"progressColor"})," ",n(e.code,{children:"buttonColor"})," ",n(e.code,{children:"pointerColor"}),")."]}),`
`,r(e.h3,{id:"knob-group",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#knob-group",children:"#"}),"Knob Group"]}),`
`,n(m,{}),`
`,r(e.p,{children:["Using a button group can quickly create multiple knobs and unify the style for the group of knobs. However, to reduce complexity, event-related props are not exposed in the Group. If you need to listen to events, you can use ",n(e.code,{children:"onChange"})," and ",n(e.code,{children:"onChangeEnd"})," in the Knob to listen to events."]}),`
`,r(e.h2,{id:"data-attributes",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-attributes",children:"#"}),"Data Attributes"]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-dragging"}),": Indicates whether the knob is currently being dragged."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-disabled"}),": Indicates whether the knob is currently disabled."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-bilateral"}),": Indicates whether the knob is currently in bilateral rotation mode."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-direction"}),": Indicates whether the knob is on the left or right side. ",n(e.code,{children:"positive"})," for the right side, ",n(e.code,{children:"negative"})," for the left side (only variable in ",n(e.code,{children:"bilateral"})," mode)."]}),`
`]}),`
`]}),`
`,r(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(e.h3,{id:"knob-1",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#knob-1",children:"#"}),"Knob"]}),`
`,n(g,{}),`
`,r(e.h3,{id:"knobgroup",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#knobgroup",children:"#"}),"Knob.Group"]}),`
`,n(f,{}),`
`,r(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(o,{code:`export interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  rotationRange?: number
  bilateral?: boolean
  sensitivity?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  size?: number | string
  buttonColor?: string
  trackColor?: string
  trackWidth?: number | string
  progressColor?: string
  pointerWidth?: number | string
  pointerHeight?: number | string
  pointerColor?: string
  topLabel?: string | React.ReactNode
  bottomLabel?: string | React.ReactNode
  classNames?: {
    button?: string
    topLabel?: string
    bottomLabel?: string
  }
  styles?: {
    button?: React.CSSProperties
    topLabel?: React.CSSProperties
    bottomLabel?: React.CSSProperties
  }
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
}

export interface KnobGroupProps
  extends Omit<
    KnobProps,
    'value' | 'onChange' | 'onChangeEnd' | 'classNames' | 'styles' | 'bottomLabel' | 'topLabel'
  > {
  classNames?: { knob?: string } & KnobProps['classNames']
  styles?: { knob?: React.CSSProperties } & KnobProps['styles']
}

export interface KnobRef extends HTMLDivElement {}

export interface KnobGroupRef extends HTMLDivElement {}`})]})}function G(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(a,t)})):a(t)}const A="2024/1/14 18:30:40",z=`import {\r
  Default,\r
  Disabled,\r
  Bilateral,\r
  Range,\r
  Label,\r
  Size,\r
  Color,\r
  StepSensitivity,\r
  Group,\r
} from '../../src/components/UsageBox/Knob.tsx'\r
import { KnobAPITable, KnobGroupAPITable } from '../../src/components/APITable/Knob.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Kbd } from '@nextui-org/react'\r
\r
# Knob\r
\r
You can use the Knob component to adjust parameters such as volume and effects.\r
\r
## Import\r
\r
<CodeBlock code={\`import { Knob } from 'echo-ui'\`} />\r
\r
## Usage\r
\r
:::tip\r
\r
Press <Kbd keys={["command"]}> + Left Mouse Button</Kbd> to reset the value.\r
\r
:::\r
\r
<Default />\r
\r
### Disabled\r
\r
<Disabled />\r
\r
### Bilateral Rotation Mode\r
\r
<Bilateral />\r
\r
### Rotation Angle Range\r
\r
<Range />\r
\r
### Labels\r
\r
<Label />\r
\r
### Step and Sensitivity\r
\r
<StepSensitivity />\r
\r
### Size-Related\r
\r
<Size />\r
\r
To avoid affecting the normal use of the component, \`Knob\` does not expose all style modification permissions for \`style\` and \`className\`. Instead, it provides a set of size-related props to adjust the component's size (\`size\` \`trackWidth\` \`pointerWidth\` \`pointerHeight\`).\r
\r
### Color-Related\r
\r
<Color />\r
\r
Similarly, \`Knob\` exposes color-related styles through props. You can adjust the component's colors using these props (\`trackColor\` \`progressColor\` \`buttonColor\` \`pointerColor\`).\r
\r
### Knob Group\r
\r
<Group />\r
\r
Using a button group can quickly create multiple knobs and unify the style for the group of knobs. However, to reduce complexity, event-related props are not exposed in the Group. If you need to listen to events, you can use \`onChange\` and \`onChangeEnd\` in the Knob to listen to events.\r
\r
## Data Attributes\r
\r
- \`data-dragging\`: Indicates whether the knob is currently being dragged.\r
\r
- \`data-disabled\`: Indicates whether the knob is currently disabled.\r
\r
- \`data-bilateral\`: Indicates whether the knob is currently in bilateral rotation mode.\r
\r
- \`data-direction\`: Indicates whether the knob is on the left or right side. \`positive\` for the right side, \`negative\` for the left side (only variable in \`bilateral\` mode).\r
\r
## API\r
\r
### Knob\r
\r
<KnobAPITable />\r
\r
### Knob.Group\r
\r
<KnobGroupAPITable />\r
\r
## Type Declarations\r
\r
<CodeBlock code={\`export interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {\r
  value?: number\r
  min?: number\r
  max?: number\r
  step?: number\r
  disabled?: boolean\r
  rotationRange?: number\r
  bilateral?: boolean\r
  sensitivity?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10\r
  size?: number | string\r
  buttonColor?: string\r
  trackColor?: string\r
  trackWidth?: number | string\r
  progressColor?: string\r
  pointerWidth?: number | string\r
  pointerHeight?: number | string\r
  pointerColor?: string\r
  topLabel?: string | React.ReactNode\r
  bottomLabel?: string | React.ReactNode\r
  classNames?: {\r
    button?: string\r
    topLabel?: string\r
    bottomLabel?: string\r
  }\r
  styles?: {\r
    button?: React.CSSProperties\r
    topLabel?: React.CSSProperties\r
    bottomLabel?: React.CSSProperties\r
  }\r
  onChange?: (value: number) => void\r
  onChangeEnd?: (value: number) => void\r
}\r
\r
export interface KnobGroupProps\r
  extends Omit<\r
    KnobProps,\r
    'value' | 'onChange' | 'onChangeEnd' | 'classNames' | 'styles' | 'bottomLabel' | 'topLabel'\r
  > {\r
  classNames?: { knob?: string } & KnobProps['classNames']\r
  styles?: { knob?: React.CSSProperties } & KnobProps['styles']\r
}\r
\r
export interface KnobRef extends HTMLDivElement {}\r
\r
export interface KnobGroupRef extends HTMLDivElement {}\`} /\r
\r
>\r
`;export{z as content,G as default,I as frontmatter,A as lastUpdatedTime,T as title,D as toc};
