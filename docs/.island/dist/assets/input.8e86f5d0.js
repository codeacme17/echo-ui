import{jsx as e,jsxs as t,Fragment as o}from"react/jsx-runtime";import{G as d}from"./style.e0d0cfbc.js";import{U as u,A as s,c as i,C as a}from"./index.bf491f00.js";import"react";import"./_commonjsHelpers.4e997714.js";import"react-dom";const p=()=>e(u,{code:"<Input />",scope:{Input:d}}),l=()=>e(u,{code:"<Input disabled value={30}/>",scope:{Input:d}}),h=()=>e(u,{code:`<div className="flex gap-4 items-center">
  <Input size="sm" />
  <Input size="md" />
  <Input size="lg" />
</div>`,scope:{Input:d}}),m=()=>e(u,{code:`<div className="flex gap-4 flex-wrap">
  <Input radius="none" />
  <Input radius="sm" />
  <Input radius="md" />
  <Input radius="lg" />
  <Input radius="full" />
</div>`,scope:{Input:d}}),I=()=>e(u,{code:"<Input min={-50} max={50} />",scope:{Input:d}}),f=()=>e(u,{code:"<Input type='text' value={'echo-ui'} />",scope:{Input:d}}),g=()=>e(u,{code:"<Input step={10} sensitivity={1} />",scope:{Input:d}}),b=()=>e(u,{code:"<Input value={30} progressColor='#8b5cf6' className='focus:border-[#8b5cf6]' />",scope:{Input:d}}),v=()=>e(s,{data:[{attribute:"value",description:"\u8F93\u5165\u6846\u7684\u503C",type:e(i,{children:"any"}),default:e(i,{children:"0"})},{attribute:"type",description:"\u8F93\u5165\u6846\u7684\u7C7B\u578B\uFF08\u8BE5\u5C5E\u6027\u8986\u76D6\u4E86\u539F\u751F\u7684 type \u5C5E\u6027\uFF09",type:e(i,{children:"'text' | 'number'"}),default:e(i,{children:"'number'"})},{attribute:"size",description:"\u8F93\u5165\u6846\u7684\u5C3A\u5BF8",type:e(i,{children:"'sm' | 'md' | 'lg'"}),default:e(i,{children:"'md'"})},{attribute:"radius",description:"\u8F93\u5165\u6846\u7684\u5706\u89D2",type:e(i,{children:"'none' | 'sm' | 'md' | 'lg' | 'full'"}),default:e(i,{children:"'md'"})},{attribute:"placeholder",description:"\u8F93\u5165\u6846\u7684\u5360\u4F4D\u7B26",type:e(i,{children:"string"}),default:"-"},{attribute:"min",description:"\u8F93\u5165\u6846\u7684\u6700\u5C0F\u503C",type:e(i,{children:"number"}),default:e(i,{children:"0"})},{attribute:"max",description:"\u8F93\u5165\u6846\u7684\u6700\u5927\u503C",type:e(i,{children:"number"}),default:e(i,{children:"100"})},{attribute:"step",description:"\u8F93\u5165\u6846\u7684\u6B65\u957F",type:e(i,{children:"number"}),default:e(i,{children:"1"})},{attribute:"sensitivity",description:"\u8F93\u5165\u6846\u7684\u7075\u654F\u5EA6",type:e(i,{children:"1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10"}),default:e(i,{children:"5"})},{attribute:"prohibitDrag",description:"\u662F\u5426\u7981\u6B62\u62D6\u52A8",type:e(i,{children:"boolean"}),default:e(i,{children:"false"})},{attribute:"hideProgress",description:"\u662F\u5426\u9690\u85CF\u8FDB\u5EA6\u6761",type:e(i,{children:"boolean"}),default:e(i,{children:"false"})},{attribute:"progressColor",description:"\u8FDB\u5EA6\u6761\u7684\u989C\u8272",type:e(i,{children:"string"}),default:e(i,{children:"'var(--echo-primary)'"})},{attribute:"onChange",description:"\u8F93\u5165\u6846\u503C\u53D8\u5316\u65F6\u7684\u56DE\u8C03\u51FD\u6570",type:e(i,{children:`(e: {
          value: any,
          nativeEvent?: React.ChangeEvent<HTMLInputElement>
        }) => void`}),default:"-"}]}),N=void 0,T=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u7528\u6CD5",text:"\u7528\u6CD5",depth:2},{id:"\u7981\u7528\u72B6\u6001",text:"\u7981\u7528\u72B6\u6001",depth:3},{id:"\u6587\u672C\u6A21\u5F0F",text:"\u6587\u672C\u6A21\u5F0F",depth:3},{id:"\u5C3A\u5BF8",text:"\u5C3A\u5BF8",depth:3},{id:"\u5706\u89D2",text:"\u5706\u89D2",depth:3},{id:"\u8FDB\u5EA6\u6761\u989C\u8272",text:"\u8FDB\u5EA6\u6761\u989C\u8272",depth:3},{id:"\u6700\u5C0F\u503C\u4E0E\u6700\u5927\u503C",text:"\u6700\u5C0F\u503C\u4E0E\u6700\u5927\u503C",depth:3},{id:"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6-\u62D6\u62FD\u65F6",text:"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6 (\u62D6\u62FD\u65F6)",depth:3},{id:"\u6807\u7B7E-data",text:"\u6807\u7B7E Data",depth:2},{id:"api",text:"API",depth:2},{id:"input",text:"Input",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],M="Input \u8F93\u5165\u6846";function c(r){const n=Object.assign({h1:"h1",a:"a",p:"p",code:"code",h2:"h2",div:"div",h3:"h3",ul:"ul",li:"li"},r.components);return t(o,{children:[t(n.h1,{id:"input-\u8F93\u5165\u6846",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#input-\u8F93\u5165\u6846",children:"#"}),"Input \u8F93\u5165\u6846"]}),`
`,t(n.p,{children:[e(n.code,{children:"Input"})," \u7EC4\u4EF6\u53EF\u4EE5\u5B9E\u73B0\u5BF9\u53C2\u6570\u7684\u8F93\u5165\u63A7\u5236\uFF0C\u5E76\u4E14\u52A0\u5165\u4E86\u62D6\u62FD\u7684\u529F\u80FD\uFF0C\u4ECE\u800C\u5B9E\u73B0\u66F4\u7B80\u6613\u7684\u6570\u636E\u66F4\u65B0\u64CD\u4F5C"]}),`
`,t(n.h2,{id:"\u5F15\u5165",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,e(a,{code:"import { Input } from 'echo-ui'"}),`
`,t(n.h2,{id:"\u7528\u6CD5",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7528\u6CD5",children:"#"}),"\u7528\u6CD5"]}),`
`,t(n.div,{className:"island-directive tip",children:[e(n.p,{className:"island-directive-title",children:"TIP"}),e(n.div,{className:"island-directive-content",children:e(n.p,{children:"\u5728 Input \u5185\u90E8\u4E0A\u4E0B\u62D6\u62FD\u9F20\u6807\u53EF\u4EE5\u66F4\u6539 value"})})]}),`
`,e(p,{}),`
`,t(n.h3,{id:"\u7981\u7528\u72B6\u6001",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7981\u7528\u72B6\u6001",children:"#"}),"\u7981\u7528\u72B6\u6001"]}),`
`,e(l,{}),`
`,t(n.h3,{id:"\u6587\u672C\u6A21\u5F0F",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6587\u672C\u6A21\u5F0F",children:"#"}),"\u6587\u672C\u6A21\u5F0F"]}),`
`,e(f,{}),`
`,t(n.h3,{id:"\u5C3A\u5BF8",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8",children:"#"}),"\u5C3A\u5BF8"]}),`
`,e(h,{}),`
`,t(n.h3,{id:"\u5706\u89D2",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5706\u89D2",children:"#"}),"\u5706\u89D2"]}),`
`,e(m,{}),`
`,t(n.h3,{id:"\u8FDB\u5EA6\u6761\u989C\u8272",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FDB\u5EA6\u6761\u989C\u8272",children:"#"}),"\u8FDB\u5EA6\u6761\u989C\u8272"]}),`
`,e(b,{}),`
`,t(n.h3,{id:"\u6700\u5C0F\u503C\u4E0E\u6700\u5927\u503C",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6700\u5C0F\u503C\u4E0E\u6700\u5927\u503C",children:"#"}),"\u6700\u5C0F\u503C\u4E0E\u6700\u5927\u503C"]}),`
`,e(I,{}),`
`,t(n.h3,{id:"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6-\u62D6\u62FD\u65F6",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6-\u62D6\u62FD\u65F6",children:"#"}),"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6 (\u62D6\u62FD\u65F6)"]}),`
`,e(g,{}),`
`,t(n.p,{children:["\u7ED3\u5408 ",e(n.code,{children:"step"})," \u548C ",e(n.code,{children:"sensitivity"})," \u53EF\u4EE5\u5F88\u65B9\u4FBF\u7684\u66F4\u6539\u7528\u6237\u62D6\u62FD\u65F6\u7684\u7CBE\u5EA6"]}),`
`,t(n.h2,{id:"\u6807\u7B7E-data",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6807\u7B7E-data",children:"#"}),"\u6807\u7B7E Data"]}),`
`,t(n.ul,{children:[`
`,t(n.li,{children:[`
`,t(n.p,{children:[e(n.code,{children:"data-dragging"}),": \u5F53\u524D\u8F93\u5165\u6846\u662F\u5426\u5904\u4E8E\u62D6\u62FD\u72B6\u6001"]}),`
`]}),`
`,t(n.li,{children:[`
`,t(n.p,{children:[e(n.code,{children:"data-readonly"}),": \u5F53\u524D\u8F93\u5165\u6846\u662F\u5426\u5904\u4E8E\u53EA\u8BFB\u72B6\u6001"]}),`
`]}),`
`]}),`
`,t(n.h2,{id:"api",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,t(n.h3,{id:"input",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#input",children:"#"}),"Input"]}),`
`,t(n.div,{className:"island-directive tip",children:[e(n.p,{className:"island-directive-title",children:"TIP"}),e(n.div,{className:"island-directive-content",children:e(n.p,{children:"\u652F\u6301\u539F\u751F input \u7684\u5176\u4ED6\u6240\u6709\u5C5E\u6027"})})]}),`
`,e(v,{}),`
`,t(n.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,e(a,{code:`export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'children' | 'size'> {
  value?: any
  type?: 'text' | 'number'
  size?: 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  placeholder?: string
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

export interface InputRef extends HTMLInputElement {}`})]})}function P(r={}){const{wrapper:n}=r.components||{};return n?e(n,Object.assign({},r,{children:e(c,r)})):c(r)}const A="2023/12/30 17:17:06",B=`import {
  DefaultInput,
  DisabledInput,
  SizeInput,
  RadiusInput,
  TextInput,
  MinMaxInput,
  StepInput,
  ProgresColorInput,
} from '../../src/components/UsageBox/Input.tsx'
import { InputAPITable } from '../../src/components/APITable/Input.tsx'
import { CodeBlock } from '../../src/components/CodeBlock/index.tsx'

# Input \u8F93\u5165\u6846

\`Input\` \u7EC4\u4EF6\u53EF\u4EE5\u5B9E\u73B0\u5BF9\u53C2\u6570\u7684\u8F93\u5165\u63A7\u5236\uFF0C\u5E76\u4E14\u52A0\u5165\u4E86\u62D6\u62FD\u7684\u529F\u80FD\uFF0C\u4ECE\u800C\u5B9E\u73B0\u66F4\u7B80\u6613\u7684\u6570\u636E\u66F4\u65B0\u64CD\u4F5C

## \u5F15\u5165

<CodeBlock code={\`import { Input } from 'echo-ui'\`} />

## \u7528\u6CD5

:::tip

\u5728 Input \u5185\u90E8\u4E0A\u4E0B\u62D6\u62FD\u9F20\u6807\u53EF\u4EE5\u66F4\u6539 value

:::

<DefaultInput />

### \u7981\u7528\u72B6\u6001

<DisabledInput />

### \u6587\u672C\u6A21\u5F0F

<TextInput />

### \u5C3A\u5BF8

<SizeInput />

### \u5706\u89D2

<RadiusInput />

### \u8FDB\u5EA6\u6761\u989C\u8272

<ProgresColorInput />

### \u6700\u5C0F\u503C\u4E0E\u6700\u5927\u503C

<MinMaxInput />

### \u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6 (\u62D6\u62FD\u65F6)

<StepInput />

\u7ED3\u5408 \`step\` \u548C \`sensitivity\` \u53EF\u4EE5\u5F88\u65B9\u4FBF\u7684\u66F4\u6539\u7528\u6237\u62D6\u62FD\u65F6\u7684\u7CBE\u5EA6

## \u6807\u7B7E Data

- \`data-dragging\`: \u5F53\u524D\u8F93\u5165\u6846\u662F\u5426\u5904\u4E8E\u62D6\u62FD\u72B6\u6001

- \`data-readonly\`: \u5F53\u524D\u8F93\u5165\u6846\u662F\u5426\u5904\u4E8E\u53EA\u8BFB\u72B6\u6001

## API

### Input

:::tip

\u652F\u6301\u539F\u751F input \u7684\u5176\u4ED6\u6240\u6709\u5C5E\u6027

:::

<InputAPITable />

## \u7C7B\u578B\u58F0\u660E

<CodeBlock code={\`export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'children' | 'size'> {
  value?: any
  type?: 'text' | 'number'
  size?: 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  placeholder?: string
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

export interface InputRef extends HTMLInputElement {}\`} />
`;export{B as content,P as default,N as frontmatter,A as lastUpdatedTime,M as title,T as toc};
