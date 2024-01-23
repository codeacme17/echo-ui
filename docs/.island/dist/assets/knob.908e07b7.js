import{jsx as n,jsxs as t,Fragment as i}from"react/jsx-runtime";import{D as s,a as d,B as l,R as c,L as h,S as p,b,C as u,G as m,K as g,c as f}from"./Knob.2de31f43.js";import{C as r}from"./CodeBlock.69bc42b0.js";import{k as v}from"./chunk-GM3GRPI5.2d9df356.js";import"./index.b6b2392c.js";import"react";import"../client-entry.js";import"./chunk-FXLYF44B.9f5da3e9.js";import"react-dom";const P=void 0,I=[{id:"import",text:"Import",depth:2},{id:"usage",text:"Usage",depth:2},{id:"disabled",text:"Disabled",depth:3},{id:"bilateral-rotation-mode",text:"Bilateral Rotation Mode",depth:3},{id:"rotation-angle-range",text:"Rotation Angle Range",depth:3},{id:"labels",text:"Labels",depth:3},{id:"step-and-sensitivity",text:"Step and Sensitivity",depth:3},{id:"size-related",text:"Size-Related",depth:3},{id:"color-related",text:"Color-Related",depth:3},{id:"knob-group",text:"Knob Group",depth:3},{id:"data-attributes",text:"Data Attributes",depth:2},{id:"api",text:"API",depth:2},{id:"knob",text:"Knob",depth:3},{id:"knobgroup",text:"Knob.Group",depth:3},{id:"type-declarations",text:"Type Declarations",depth:2}],D="Knob";function a(o){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",div:"div",h3:"h3",code:"code",ul:"ul",li:"li"},o.components);return t(i,{children:[t(e.h1,{id:"knob",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#knob",children:"#"}),"Knob"]}),`
`,n(e.p,{children:"You can use the Knob component to adjust parameters such as volume and effects."}),`
`,t(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(r,{code:"import { Knob } from 'echo-ui'"}),`
`,t(e.h2,{id:"usage",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usage",children:"#"}),"Usage"]}),`
`,t(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:t(e.p,{children:["Press ",n(v,{keys:["command"],children:" + Left Mouse Button"})," to reset the value."]})})]}),`
`,n(s,{}),`
`,t(e.h3,{id:"disabled",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#disabled",children:"#"}),"Disabled"]}),`
`,n(d,{}),`
`,t(e.h3,{id:"bilateral-rotation-mode",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#bilateral-rotation-mode",children:"#"}),"Bilateral Rotation Mode"]}),`
`,n(l,{}),`
`,t(e.h3,{id:"rotation-angle-range",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#rotation-angle-range",children:"#"}),"Rotation Angle Range"]}),`
`,n(c,{}),`
`,t(e.h3,{id:"labels",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#labels",children:"#"}),"Labels"]}),`
`,n(h,{}),`
`,t(e.h3,{id:"step-and-sensitivity",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#step-and-sensitivity",children:"#"}),"Step and Sensitivity"]}),`
`,n(p,{}),`
`,t(e.h3,{id:"size-related",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#size-related",children:"#"}),"Size-Related"]}),`
`,n(b,{}),`
`,t(e.p,{children:["To avoid affecting the normal use of the component, ",n(e.code,{children:"Knob"})," does not expose all style modification permissions for ",n(e.code,{children:"style"})," and ",n(e.code,{children:"className"}),". Instead, it provides a set of size-related props to adjust the component's size (",n(e.code,{children:"size"})," ",n(e.code,{children:"trackWidth"})," ",n(e.code,{children:"pointerWidth"})," ",n(e.code,{children:"pointerHeight"}),")."]}),`
`,t(e.h3,{id:"color-related",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#color-related",children:"#"}),"Color-Related"]}),`
`,n(u,{}),`
`,t(e.p,{children:["Similarly, ",n(e.code,{children:"Knob"})," exposes color-related styles through props. You can adjust the component's colors using these props (",n(e.code,{children:"trackColor"})," ",n(e.code,{children:"progressColor"})," ",n(e.code,{children:"buttonColor"})," ",n(e.code,{children:"pointerColor"}),")."]}),`
`,t(e.h3,{id:"knob-group",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#knob-group",children:"#"}),"Knob Group"]}),`
`,n(m,{}),`
`,t(e.p,{children:["Using a button group can quickly create multiple knobs and unify the style for the group of knobs. However, to reduce complexity, event-related props are not exposed in the Group. If you need to listen to events, you can use ",n(e.code,{children:"onChange"})," and ",n(e.code,{children:"onChangeEnd"})," in the Knob to listen to events."]}),`
`,t(e.h2,{id:"data-attributes",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#data-attributes",children:"#"}),"Data Attributes"]}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:"data-dragging"}),": Indicates whether the knob is currently being dragged."]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:"data-disabled"}),": Indicates whether the knob is currently disabled."]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:"data-bilateral"}),": Indicates whether the knob is currently in bilateral rotation mode."]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:[n(e.code,{children:"data-direction"}),": Indicates whether the knob is on the left or right side. ",n(e.code,{children:"positive"})," for the right side, ",n(e.code,{children:"negative"})," for the left side (only variable in ",n(e.code,{children:"bilateral"})," mode)."]}),`
`]}),`
`]}),`
`,t(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(e.h3,{id:"knob-1",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#knob-1",children:"#"}),"Knob"]}),`
`,n(g,{}),`
`,t(e.h3,{id:"knobgroup",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#knobgroup",children:"#"}),"Knob.Group"]}),`
`,n(f,{}),`
`,t(e.h2,{id:"type-declarations",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#type-declarations",children:"#"}),"Type Declarations"]}),`
`,n(r,{code:`export interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

export interface KnobGroupRef extends HTMLDivElement {}`})]})}function T(o={}){const{wrapper:e}=o.components||{};return e?n(e,Object.assign({},o,{children:n(a,o)})):a(o)}const G="2024/1/14 18:30:40",A=`import {
  Default,
  Disabled,
  Bilateral,
  Range,
  Label,
  Size,
  Color,
  StepSensitivity,
  Group,
} from '../../src/components/UsageBox/Knob.tsx'
import { KnobAPITable, KnobGroupAPITable } from '../../src/components/APITable/Knob.tsx'
import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Kbd } from '@nextui-org/react'

# Knob

You can use the Knob component to adjust parameters such as volume and effects.

## Import

<CodeBlock code={\`import { Knob } from 'echo-ui'\`} />

## Usage

:::tip

Press <Kbd keys={["command"]}> + Left Mouse Button</Kbd> to reset the value.

:::

<Default />

### Disabled

<Disabled />

### Bilateral Rotation Mode

<Bilateral />

### Rotation Angle Range

<Range />

### Labels

<Label />

### Step and Sensitivity

<StepSensitivity />

### Size-Related

<Size />

To avoid affecting the normal use of the component, \`Knob\` does not expose all style modification permissions for \`style\` and \`className\`. Instead, it provides a set of size-related props to adjust the component's size (\`size\` \`trackWidth\` \`pointerWidth\` \`pointerHeight\`).

### Color-Related

<Color />

Similarly, \`Knob\` exposes color-related styles through props. You can adjust the component's colors using these props (\`trackColor\` \`progressColor\` \`buttonColor\` \`pointerColor\`).

### Knob Group

<Group />

Using a button group can quickly create multiple knobs and unify the style for the group of knobs. However, to reduce complexity, event-related props are not exposed in the Group. If you need to listen to events, you can use \`onChange\` and \`onChangeEnd\` in the Knob to listen to events.

## Data Attributes

- \`data-dragging\`: Indicates whether the knob is currently being dragged.

- \`data-disabled\`: Indicates whether the knob is currently disabled.

- \`data-bilateral\`: Indicates whether the knob is currently in bilateral rotation mode.

- \`data-direction\`: Indicates whether the knob is on the left or right side. \`positive\` for the right side, \`negative\` for the left side (only variable in \`bilateral\` mode).

## API

### Knob

<KnobAPITable />

### Knob.Group

<KnobGroupAPITable />

## Type Declarations

<CodeBlock code={\`export interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

export interface KnobGroupRef extends HTMLDivElement {}\`} /

>
`;export{A as content,T as default,P as frontmatter,G as lastUpdatedTime,D as title,I as toc};
