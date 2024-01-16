import{jsx as n,jsxs as r,Fragment as d}from"react/jsx-runtime";import{C as t}from"./CodeBlock.f3a900da.js";import{D as o,a as s,S as c,C as l,G as h,R as p,b as m}from"./Radio.beece9c0.js";import"react";import"./index.9a4df2a1.js";import"../client-entry.js";import"./chunk-FXLYF44B.9d30e58e.js";import"react-dom";const T=void 0,L=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u7981\u7528\u72B6\u6001",text:"\u7981\u7528\u72B6\u6001",depth:3},{id:"\u5C3A\u5BF8",text:"\u5C3A\u5BF8",depth:3},{id:"\u989C\u8272",text:"\u989C\u8272",depth:3},{id:"\u5355\u9009\u7EC4",text:"\u5355\u9009\u7EC4",depth:3},{id:"\u6807\u7B7E-data",text:"\u6807\u7B7E Data",depth:2},{id:"api",text:"API",depth:2},{id:"radio",text:"Radio",depth:3},{id:"radiogroup",text:"Radio.Group",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],C="Radio \u5355\u9009\u6846";function i(a){const e=Object.assign({h1:"h1",a:"a",h2:"h2",h3:"h3",ul:"ul",li:"li",p:"p",code:"code",div:"div"},a.components);return r(d,{children:[r(e.h1,{id:"radio-\u5355\u9009\u6846",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radio-\u5355\u9009\u6846",children:"#"}),"Radio \u5355\u9009\u6846"]}),`
`,r(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(t,{code:"import { Radio } from 'echo-ui'"}),`
`,r(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(o,{}),`
`,r(e.h3,{id:"\u7981\u7528\u72B6\u6001",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7981\u7528\u72B6\u6001",children:"#"}),"\u7981\u7528\u72B6\u6001"]}),`
`,n(s,{}),`
`,r(e.h3,{id:"\u5C3A\u5BF8",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8",children:"#"}),"\u5C3A\u5BF8"]}),`
`,n(c,{}),`
`,r(e.h3,{id:"\u989C\u8272",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u989C\u8272",children:"#"}),"\u989C\u8272"]}),`
`,n(l,{}),`
`,r(e.h3,{id:"\u5355\u9009\u7EC4",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5355\u9009\u7EC4",children:"#"}),"\u5355\u9009\u7EC4"]}),`
`,n(h,{}),`
`,r(e.h2,{id:"\u6807\u7B7E-data",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6807\u7B7E-data",children:"#"}),"\u6807\u7B7E Data"]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-checked"}),": \u5F53\u524D\u5355\u9009\u6846\u662F\u5426\u5904\u4E8E\u6FC0\u6D3B\u72B6\u6001"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-disabled"}),": \u5F53\u524D\u5355\u9009\u6846\u662F\u5426\u5904\u4E8E\u7981\u7528\u72B6\u6001"]}),`
`]}),`
`]}),`
`,r(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(e.h3,{id:"radio",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radio",children:"#"}),"Radio"]}),`
`,r(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"TIP"}),n(e.div,{className:"island-directive-content",children:r(e.p,{children:["\u652F\u6301\u539F\u751F\u7C7B\u578B\u4E3A ",n(e.code,{children:"radio"})," \u7684 ",n(e.code,{children:"input"})," \u6807\u7B7E\u7684\u5176\u4ED6\u6240\u6709\u5C5E\u6027"]})})]}),`
`,n(p,{}),`
`,r(e.h3,{id:"radiogroup",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#radiogroup",children:"#"}),"Radio.Group"]}),`
`,n(m,{}),`
`,r(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(t,{code:`interface AbstractRadioProps<T>
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

export interface RadioGroupRef extends HTMLDivElement {}`})]})}function P(a={}){const{wrapper:e}=a.components||{};return e?n(e,Object.assign({},a,{children:n(i,a)})):i(a)}const H="2024/1/10 10:10:15",g=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Default, Disabled, Size, Color, Group } from '../../src/components/UsageBox/Radio.tsx'\r
import { RadioAPITable, RadioGroupAPITable } from '../../src/components/APITable/Radio.tsx'\r
\r
# Radio \u5355\u9009\u6846\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { Radio } from 'echo-ui'\`} />\r
\r
## \u4EE3\u7801\u6F14\u793A\r
\r
<Default />\r
\r
### \u7981\u7528\u72B6\u6001\r
\r
<Disabled />\r
\r
### \u5C3A\u5BF8\r
\r
<Size />\r
\r
### \u989C\u8272\r
\r
<Color />\r
\r
### \u5355\u9009\u7EC4\r
\r
<Group />\r
\r
## \u6807\u7B7E Data\r
\r
- \`data-checked\`: \u5F53\u524D\u5355\u9009\u6846\u662F\u5426\u5904\u4E8E\u6FC0\u6D3B\u72B6\u6001\r
\r
- \`data-disabled\`: \u5F53\u524D\u5355\u9009\u6846\u662F\u5426\u5904\u4E8E\u7981\u7528\u72B6\u6001\r
\r
## API\r
\r
### Radio\r
\r
:::tip\r
\r
\u652F\u6301\u539F\u751F\u7C7B\u578B\u4E3A \`radio\` \u7684 \`input\` \u6807\u7B7E\u7684\u5176\u4ED6\u6240\u6709\u5C5E\u6027\r
\r
:::\r
\r
<RadioAPITable />\r
\r
### Radio.Group\r
\r
<RadioGroupAPITable />\r
\r
## \u7C7B\u578B\u58F0\u660E\r
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
export interface RadioGroupRef extends HTMLDivElement {}\`} />\r
`;export{g as content,P as default,T as frontmatter,H as lastUpdatedTime,C as title,L as toc};
