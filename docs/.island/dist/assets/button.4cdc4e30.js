import{jsx as t,jsxs as n,Fragment as c}from"react/jsx-runtime";import{X as d,F as s,W as h,B,Y as p}from"./style.e0d0cfbc.js";import{U as a,A as l,c as o,C as r}from"./index.bf491f00.js";import"react";import"./_commonjsHelpers.4e997714.js";import"react-dom";const m=()=>t(a,{code:"<Button> Button </Button>",scope:{Button:d}}),f=()=>t(a,{code:"<Button toggled> Toggled </Button>",scope:{Button:d}}),g=()=>t(a,{code:"<Button disabled> Disabled </Button>",scope:{Button:d}}),b=()=>t(a,{code:`<div className="flex gap-4 items-center">
  <Button size="sm">
    Small
  </Button>  
  <Button size="md">
    Medium
  </Button>  
  <Button size="lg">
    Large
  </Button>  
</div>`,scope:{Button:d}}),x=()=>t(a,{code:`<div className="flex gap-4 items-center">
  <Button radius="none">
    None
  </Button>  
  <Button radius="sm">
    Small
  </Button>  
  <Button radius="md">
    Medium
  </Button>  
  <Button radius="lg">
    Large
  </Button>
  <Button radius="full">
    Full
  </Button>  
</div>`,scope:{Button:d}}),A=()=>t(a,{code:`<Button.Group>
  <Button value={1} className="data-[toggled=true]:bg-red-500">
    Sine
  </Button>
  <Button value={2}>
    Square
  </Button>
  <Button value={3}>
    Sawtooth
  </Button>
  <Button value={4}>
    Triangle
  </Button>
</Button.Group>`,scope:{Button:d,SineIcon:s,SawtoothIcon:h,SquareIcon:B,TriangleIcon:p}}),E=()=>t(l,{data:[{attribute:"value",description:n(c,{children:["\u7ED1\u5B9A\u7684\u503C\uFF08\u4EC5\u5728 ",t(o,{children:" `Group` "})," \u4E2D\u751F\u6548\uFF09"]}),type:t(o,{children:"any"}),default:"-"},{attribute:"disabled",description:"\u6307\u793A\u6309\u94AE\u662F\u5426\u7981\u7528",type:t(o,{children:"boolean"}),default:t(o,{children:"false"})},{attribute:"size",description:"\u6309\u94AE\u5927\u5C0F",type:t(o,{children:"'sm' | 'md' | 'lg'"}),default:t(o,{children:"'md'"})},{attribute:"radius",description:"\u6309\u94AE\u8FB9\u6846\u5706\u89D2",type:t(o,{children:"'none' | 'sm' | 'md' | 'lg' | 'full'"}),default:t(o,{children:"'md'"})},{attribute:"toggled",description:"\u8868\u793A\u6309\u94AE\u662F\u5426\u5207\u6362\u72B6\u6001",type:t(o,{children:"boolean"}),default:t(o,{children:"false"})},{attribute:"onToggleChange",description:"\u5207\u6362\u72B6\u6001\u53D8\u5316\u65F6\u7684\u56DE\u8C03\u51FD\u6570",type:t(o,{children:"(toggled: boolean) => void"}),default:"-"}]}),v=()=>t(l,{data:[{attribute:"value",description:"\u6309\u94AE\u7EC4\u5173\u8054\u7684\u503C",type:t(o,{children:"any[]"}),default:"-"},{attribute:"disabled",description:"\u6307\u793A\u6309\u94AE\u7EC4\u4E2D\u7684\u6309\u94AE\u662F\u5426\u7981\u7528",type:t(o,{children:"boolean"}),default:t(o,{children:"false"})},{attribute:"size",description:"\u6309\u94AE\u5927\u5C0F",type:t(o,{children:"'sm' | 'md' | 'lg'"}),default:t(o,{children:"'md'"})},{attribute:"radius",description:"\u6309\u94AE\u8FB9\u6846\u5706\u89D2",type:t(o,{children:"'none' | 'sm' | 'md' | 'lg' | 'full'"}),default:t(o,{children:"'md'"})},{attribute:"classNames",description:"\u5141\u8BB8\u4E3A\u6309\u94AE\u548C\u5207\u6362\u72B6\u6001\u8BBE\u7F6E\u81EA\u5B9A\u4E49\u7C7B\u540D",type:t(o,{children:"{ button?: string }"}),default:"-"},{attribute:"styles",description:"\u5141\u8BB8\u4E3A\u6309\u94AE\u548C\u5207\u6362\u72B6\u6001\u8BBE\u7F6E\u81EA\u5B9A\u4E49\u6837\u5F0F\u8868",type:t(o,{children:"{ button?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"\u9009\u9879\u53D8\u5316\u65F6\u7684\u56DE\u8C03\u51FD\u6570",type:t(o,{children:"(values: any[]) => void"}),default:"-"}]}),N=void 0,G=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u7528\u6CD5",text:"\u7528\u6CD5",depth:2},{id:"\u5207\u6362\u72B6\u6001",text:"\u5207\u6362\u72B6\u6001",depth:3},{id:"\u7981\u7528\u72B6\u6001",text:"\u7981\u7528\u72B6\u6001",depth:3},{id:"\u5C3A\u5BF8",text:"\u5C3A\u5BF8",depth:3},{id:"\u5706\u89D2",text:"\u5706\u89D2",depth:3},{id:"\u6309\u94AE\u7EC4",text:"\u6309\u94AE\u7EC4",depth:3},{id:"\u6807\u7B7E-data",text:"\u6807\u7B7E Data",depth:2},{id:"api",text:"API",depth:2},{id:"button",text:"Button",depth:3},{id:"buttongroup",text:"Button.Group",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],S="Button \u6309\u94AE";function i(u){const e=Object.assign({h1:"h1",a:"a",p:"p",code:"code",h2:"h2",h3:"h3",ul:"ul",li:"li",div:"div"},u.components);return n(c,{children:[n(e.h1,{id:"button-\u6309\u94AE",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#button-\u6309\u94AE",children:"#"}),"Button \u6309\u94AE"]}),`
`,n(e.p,{children:["\u53EF\u4EE5\u4F7F\u7528 ",t(e.code,{children:"Button"})," \u7EC4\u4EF6\u6765\u521B\u5EFA\u4E00\u4E2A\u6309\u94AE\uFF0C\u4E5F\u53EF\u4EE5\u4F7F\u7528 ",t(e.code,{children:"Button.Group"})," \u7EC4\u4EF6\u6765\u521B\u5EFA\u4E00\u7EC4\u6309\u94AE\uFF0C\u4ECE\u800C\u5B9E\u73B0\u5BF9\u97F3\u9891\u64AD\u653E\u7B49\u529F\u80FD\u7684\u63A7\u5236"]}),`
`,n(e.h2,{id:"\u5F15\u5165",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,t(r,{code:"import { Button } from 'echo-ui'"}),`
`,n(e.h2,{id:"\u7528\u6CD5",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7528\u6CD5",children:"#"}),"\u7528\u6CD5"]}),`
`,t(m,{}),`
`,n(e.h3,{id:"\u5207\u6362\u72B6\u6001",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5207\u6362\u72B6\u6001",children:"#"}),"\u5207\u6362\u72B6\u6001"]}),`
`,t(f,{}),`
`,n(e.h3,{id:"\u7981\u7528\u72B6\u6001",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7981\u7528\u72B6\u6001",children:"#"}),"\u7981\u7528\u72B6\u6001"]}),`
`,t(g,{}),`
`,n(e.h3,{id:"\u5C3A\u5BF8",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8",children:"#"}),"\u5C3A\u5BF8"]}),`
`,t(b,{}),`
`,n(e.h3,{id:"\u5706\u89D2",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5706\u89D2",children:"#"}),"\u5706\u89D2"]}),`
`,t(x,{}),`
`,n(e.h3,{id:"\u6309\u94AE\u7EC4",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6309\u94AE\u7EC4",children:"#"}),"\u6309\u94AE\u7EC4"]}),`
`,t(A,{}),`
`,n(e.h2,{id:"\u6807\u7B7E-data",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6807\u7B7E-data",children:"#"}),"\u6807\u7B7E Data"]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[t(e.code,{children:"data-toggled"}),": \u5F53\u524D\u6309\u94AE\u662F\u5426\u5904\u4E8E\u6FC0\u6D3B\u72B6\u6001"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[t(e.code,{children:"data-disabled"}),": \u5F53\u524D\u6309\u94AE\u662F\u5426\u5904\u4E8E\u7981\u7528\u72B6\u6001"]}),`
`]}),`
`]}),`
`,n(e.h2,{id:"api",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,n(e.h3,{id:"button",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#button",children:"#"}),"Button"]}),`
`,n(e.div,{className:"island-directive tip",children:[t(e.p,{className:"island-directive-title",children:"TIP"}),t(e.div,{className:"island-directive-content",children:t(e.p,{children:"\u652F\u6301\u539F\u751F button \u7684\u5176\u4ED6\u6240\u6709\u5C5E\u6027"})})]}),`
`,t(E,{}),`
`,n(e.h3,{id:"buttongroup",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#buttongroup",children:"#"}),"Button.Group"]}),`
`,t(v,{}),`
`,n(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,t(r,{code:`interface AbstractButtonProps<T> extends React.HTMLAttributes<T> {
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

export interface ButtonGroupRef extends HTMLDivElement {}`})]})}function I(u={}){const{wrapper:e}=u.components||{};return e?t(e,Object.assign({},u,{children:t(i,u)})):i(u)}const R="2023/12/29 22:24:34",M=`import {
  DefaultButton,
  ToggledButton,
  DisabledButton,
  SizeButton,
  RadiusButton,
  GroupButton,
} from '../../src/components/UsageBox/Button'
import { ButtonAPITable, ButtonGroupAPITable } from '../../src/components/APITable/Button.tsx'
import { CodeBlock } from '../../src/components/CodeBlock/index.tsx'

# Button \u6309\u94AE

\u53EF\u4EE5\u4F7F\u7528 \`Button\` \u7EC4\u4EF6\u6765\u521B\u5EFA\u4E00\u4E2A\u6309\u94AE\uFF0C\u4E5F\u53EF\u4EE5\u4F7F\u7528 \`Button.Group\` \u7EC4\u4EF6\u6765\u521B\u5EFA\u4E00\u7EC4\u6309\u94AE\uFF0C\u4ECE\u800C\u5B9E\u73B0\u5BF9\u97F3\u9891\u64AD\u653E\u7B49\u529F\u80FD\u7684\u63A7\u5236

## \u5F15\u5165

<CodeBlock code={\`import { Button } from 'echo-ui'\`} />

## \u7528\u6CD5

<DefaultButton />

### \u5207\u6362\u72B6\u6001

<ToggledButton />

### \u7981\u7528\u72B6\u6001

<DisabledButton />

### \u5C3A\u5BF8

<SizeButton />

### \u5706\u89D2

<RadiusButton />

### \u6309\u94AE\u7EC4

<GroupButton />

## \u6807\u7B7E Data

- \`data-toggled\`: \u5F53\u524D\u6309\u94AE\u662F\u5426\u5904\u4E8E\u6FC0\u6D3B\u72B6\u6001

- \`data-disabled\`: \u5F53\u524D\u6309\u94AE\u662F\u5426\u5904\u4E8E\u7981\u7528\u72B6\u6001

## API

### Button

:::tip

\u652F\u6301\u539F\u751F button \u7684\u5176\u4ED6\u6240\u6709\u5C5E\u6027

:::

<ButtonAPITable />

### Button.Group

<ButtonGroupAPITable />

## \u7C7B\u578B\u58F0\u660E

<CodeBlock code={\`interface AbstractButtonProps<T> extends React.HTMLAttributes<T> {
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

export interface ButtonGroupRef extends HTMLDivElement {}\`} />
`;export{M as content,I as default,N as frontmatter,R as lastUpdatedTime,S as title,G as toc};
