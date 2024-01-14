import{jsx as n,jsxs as a,Fragment as d}from"react/jsx-runtime";import{C as i}from"./CodeBlock.15abbd2c.js";import{D as o,a as s,S as c,C as l,G as h,R as p,b as m}from"./Radio.4588dd0b.js";import"react-dom";import"react";import"./index.46846943.js";import"./_commonjsHelpers.4e997714.js";import"./index.55340fb1.js";const T=void 0,L=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u7981\u7528\u72B6\u6001",text:"\u7981\u7528\u72B6\u6001",depth:3},{id:"\u5C3A\u5BF8",text:"\u5C3A\u5BF8",depth:3},{id:"\u989C\u8272",text:"\u989C\u8272",depth:3},{id:"\u5355\u9009\u7EC4",text:"\u5355\u9009\u7EC4",depth:3},{id:"\u6807\u7B7E-data",text:"\u6807\u7B7E Data",depth:2},{id:"api",text:"API",depth:2},{id:"radio",text:"Radio",depth:3},{id:"radiogroup",text:"Radio.Group",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],C="Radio \u5355\u9009\u6846";function r(t){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3",ul:"ul",li:"li",p:"p",code:"code",div:"div"},t.components);return a(d,{children:[a(e.h1,{id:"radio-\u5355\u9009\u6846",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radio-\u5355\u9009\u6846",children:"#"}),"Radio \u5355\u9009\u6846"]}),`
`,a(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(i,{code:"import { Radio } from 'echo-ui'"}),`
`,a(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(o,{}),`
`,a(e.h3,{id:"\u7981\u7528\u72B6\u6001",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7981\u7528\u72B6\u6001",children:"#"}),"\u7981\u7528\u72B6\u6001"]}),`
`,n(s,{}),`
`,a(e.h3,{id:"\u5C3A\u5BF8",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8",children:"#"}),"\u5C3A\u5BF8"]}),`
`,n(c,{}),`
`,a(e.h3,{id:"\u989C\u8272",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u989C\u8272",children:"#"}),"\u989C\u8272"]}),`
`,n(l,{}),`
`,a(e.h3,{id:"\u5355\u9009\u7EC4",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5355\u9009\u7EC4",children:"#"}),"\u5355\u9009\u7EC4"]}),`
`,n(h,{}),`
`,a(e.h2,{id:"\u6807\u7B7E-data",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6807\u7B7E-data",children:"#"}),"\u6807\u7B7E Data"]}),`
`,a(e.ul,{children:[`
`,a(e.li,{children:[`
`,a(e.p,{children:[n(e.code,{children:"data-checked"}),": \u5F53\u524D\u5355\u9009\u6846\u662F\u5426\u5904\u4E8E\u6FC0\u6D3B\u72B6\u6001"]}),`
`]}),`
`,a(e.li,{children:[`
`,a(e.p,{children:[n(e.code,{children:"data-disabled"}),": \u5F53\u524D\u5355\u9009\u6846\u662F\u5426\u5904\u4E8E\u7981\u7528\u72B6\u6001"]}),`
`]}),`
`]}),`
`,a(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,a(e.h3,{id:"radio",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radio",children:"#"}),"Radio"]}),`
`,a(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:a(e.p,{children:["\u652F\u6301\u539F\u751F\u7C7B\u578B\u4E3A ",n(e.code,{children:"radio"})," \u7684 ",n(e.code,{children:"input"})," \u6807\u7B7E\u7684\u5176\u4ED6\u6240\u6709\u5C5E\u6027"]})})]}),`
`,n(p,{}),`
`,a(e.h3,{id:"radiogroup",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radiogroup",children:"#"}),"Radio.Group"]}),`
`,n(m,{}),`
`,a(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(i,{code:`interface AbstractRadioProps<T>
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

export interface RadioGroupRef extends HTMLDivElement {}`})]})}function P(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(r,t)})):r(t)}const H="2024/1/10 10:10:15",g=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Default, Disabled, Size, Color, Group } from '../../src/components/UsageBox/Radio.tsx'
import { RadioAPITable, RadioGroupAPITable } from '../../src/components/APITable/Radio.tsx'

# Radio \u5355\u9009\u6846

## \u5F15\u5165

<CodeBlock code={\`import { Radio } from 'echo-ui'\`} />

## \u4EE3\u7801\u6F14\u793A

<Default />

### \u7981\u7528\u72B6\u6001

<Disabled />

### \u5C3A\u5BF8

<Size />

### \u989C\u8272

<Color />

### \u5355\u9009\u7EC4

<Group />

## \u6807\u7B7E Data

- \`data-checked\`: \u5F53\u524D\u5355\u9009\u6846\u662F\u5426\u5904\u4E8E\u6FC0\u6D3B\u72B6\u6001

- \`data-disabled\`: \u5F53\u524D\u5355\u9009\u6846\u662F\u5426\u5904\u4E8E\u7981\u7528\u72B6\u6001

## API

### Radio

:::tip

\u652F\u6301\u539F\u751F\u7C7B\u578B\u4E3A \`radio\` \u7684 \`input\` \u6807\u7B7E\u7684\u5176\u4ED6\u6240\u6709\u5C5E\u6027

:::

<RadioAPITable />

### Radio.Group

<RadioGroupAPITable />

## \u7C7B\u578B\u58F0\u660E

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

export interface RadioGroupRef extends HTMLDivElement {}\`} />
`;export{g as content,P as default,T as frontmatter,H as lastUpdatedTime,C as title,L as toc};
