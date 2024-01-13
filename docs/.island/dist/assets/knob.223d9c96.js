import{jsx as n,jsxs as r,Fragment as o}from"react/jsx-runtime";import{D as d,a as l,B as c,R as h,L as s,S as b,b as p,C as m,K as u}from"./Knob.d8d0cfda.js";import{C as i}from"./CodeBlock.15abbd2c.js";import"./index.88984242.js";import"react";import"./_commonjsHelpers.4e997714.js";import"./index.55340fb1.js";import"react-dom";const N=void 0,S=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u7981\u7528\u72B6\u6001",text:"\u7981\u7528\u72B6\u6001",depth:3},{id:"\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F",text:"\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F",depth:3},{id:"\u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4",text:"\u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4",depth:3},{id:"\u6807\u7B7E",text:"\u6807\u7B7E",depth:3},{id:"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6",text:"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6",depth:3},{id:"\u5C3A\u5BF8\u76F8\u5173",text:"\u5C3A\u5BF8\u76F8\u5173",depth:3},{id:"\u989C\u8272\u76F8\u5173",text:"\u989C\u8272\u76F8\u5173",depth:3},{id:"\u6807\u7B7E-data",text:"\u6807\u7B7E Data",depth:2},{id:"api",text:"API",depth:2},{id:"knob",text:"Knob",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],k="Knob \u65CB\u94AE";function a(t){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code",ul:"ul",li:"li"},t.components);return r(o,{children:[r(e.h1,{id:"knob-\u65CB\u94AE",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#knob-\u65CB\u94AE",children:"#"}),"Knob \u65CB\u94AE"]}),`
`,n(e.p,{children:"\u53EF\u4EE5\u4F7F\u7528\u65CB\u94AE\u7EC4\u4EF6\u5BF9\u97F3\u91CF\u3001\u6548\u679C\u5668\u7B49\u53C2\u6570\u8FDB\u884C\u8C03\u8282"}),`
`,r(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(i,{code:"import { Knob } from 'echo-ui'"}),`
`,r(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,n(d,{}),`
`,r(e.h3,{id:"\u7981\u7528\u72B6\u6001",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7981\u7528\u72B6\u6001",children:"#"}),"\u7981\u7528\u72B6\u6001"]}),`
`,n(l,{}),`
`,r(e.h3,{id:"\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F",children:"#"}),"\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F"]}),`
`,n(c,{}),`
`,r(e.h3,{id:"\u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4",children:"#"}),"\u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4"]}),`
`,n(h,{}),`
`,r(e.h3,{id:"\u6807\u7B7E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6807\u7B7E",children:"#"}),"\u6807\u7B7E"]}),`
`,n(s,{}),`
`,r(e.h3,{id:"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6",children:"#"}),"\u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6"]}),`
`,n(b,{}),`
`,r(e.h3,{id:"\u5C3A\u5BF8\u76F8\u5173",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5C3A\u5BF8\u76F8\u5173",children:"#"}),"\u5C3A\u5BF8\u76F8\u5173"]}),`
`,n(p,{}),`
`,r(e.p,{children:["\u4E3A\u4E86\u4E0D\u5F71\u54CD\u7EC4\u4EF6\u7684\u6B63\u5E38\u4F7F\u7528\uFF0C",n(e.code,{children:"Knob"})," \u5E76\u6CA1\u6709\u5C06 ",n(e.code,{children:"style"})," \u548C ",n(e.code,{children:"className"})," \u7684\u6837\u5F0F\u4FEE\u6539\u6743\u9650\u5168\u90E8\u66B4\u9732\u51FA\u53BB\uFF0C\u800C\u662F\u63D0\u4F9B\u4E86\u4E00\u5957\u5C3A\u5BF8\u76F8\u5173\u7684 props\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8FD9\u4E9B props \u6765\u8C03\u6574\u7EC4\u4EF6\u7684\u5C3A\u5BF8 (",n(e.code,{children:"size"})," ",n(e.code,{children:"trackWidth"})," ",n(e.code,{children:"pointerWidth"})," ",n(e.code,{children:"pointerHeight"}),")"]}),`
`,r(e.h3,{id:"\u989C\u8272\u76F8\u5173",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u989C\u8272\u76F8\u5173",children:"#"}),"\u989C\u8272\u76F8\u5173"]}),`
`,n(m,{}),`
`,r(e.p,{children:["\u4E0E\u5C3A\u5BF8\u7684\u4FEE\u6539\u76F8\u540C\uFF0C ",n(e.code,{children:"Knob"})," \u7684\u989C\u8272\u76F8\u5173\u7684\u6837\u5F0F\u4E5F\u662F\u901A\u8FC7 props \u66B4\u9732\u51FA\u53BB\u7684\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8FD9\u4E9B props \u6765\u8C03\u6574\u7EC4\u4EF6\u7684\u989C\u8272 (",n(e.code,{children:"trackColor"})," ",n(e.code,{children:"progressColor"})," ",n(e.code,{children:"buttonColor"})," ",n(e.code,{children:"pointerColor"}),")"]}),`
`,r(e.h2,{id:"\u6807\u7B7E-data",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u6807\u7B7E-data",children:"#"}),"\u6807\u7B7E Data"]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-dragging"}),": \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u62D6\u62FD\u72B6\u6001"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-disabled"}),": \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u7981\u7528\u72B6\u6001"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-bilateral"}),": \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.code,{children:"data-direction"}),": \u5F53\u524D\u65CB\u94AE\u7684\u5904\u4E8E\u5DE6\u4FA7\u8FD8\u662F\u53F3\u4FA7\uFF0C",n(e.code,{children:"positive"})," \u4E3A\u53F3\u4FA7\u65F6\uFF0C",n(e.code,{children:"negative"})," \u4E3A\u5DE6\u4FA7\u65F6\uFF08\u4EC5\u5728 ",n(e.code,{children:"bilateral"})," \u6A21\u5F0F\u4E0B\u53EF\u53D8\uFF09"]}),`
`]}),`
`]}),`
`,r(e.h2,{id:"api",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,r(e.h3,{id:"knob",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#knob",children:"#"}),"Knob"]}),`
`,n(u,{}),`
`,r(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,n(i,{code:`export interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

export interface KnobRef extends HTMLDivElement {}`})]})}function D(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(a,t)})):a(t)}const P="2024/1/10 10:10:15",T=`import {\r
  Default,\r
  Disabled,\r
  Bilateral,\r
  Range,\r
  Label,\r
  Size,\r
  Color,\r
  StepSensitivity,\r
} from '../../src/components/UsageBox/Knob.tsx'\r
import { KnobAPITable } from '../../src/components/APITable/Knob.tsx'\r
import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
\r
# Knob \u65CB\u94AE\r
\r
\u53EF\u4EE5\u4F7F\u7528\u65CB\u94AE\u7EC4\u4EF6\u5BF9\u97F3\u91CF\u3001\u6548\u679C\u5668\u7B49\u53C2\u6570\u8FDB\u884C\u8C03\u8282\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { Knob } from 'echo-ui'\`} />\r
\r
## \u4EE3\u7801\u6F14\u793A\r
\r
<Default />\r
\r
### \u7981\u7528\u72B6\u6001\r
\r
<Disabled />\r
\r
### \u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F\r
\r
<Bilateral />\r
\r
### \u65CB\u8F6C\u89D2\u5EA6\u8303\u56F4\r
\r
<Range />\r
\r
### \u6807\u7B7E\r
\r
<Label />\r
\r
### \u6B65\u8FDB\u4E0E\u7075\u654F\u5EA6\r
\r
<StepSensitivity />\r
\r
### \u5C3A\u5BF8\u76F8\u5173\r
\r
<Size />\r
\r
\u4E3A\u4E86\u4E0D\u5F71\u54CD\u7EC4\u4EF6\u7684\u6B63\u5E38\u4F7F\u7528\uFF0C\`Knob\` \u5E76\u6CA1\u6709\u5C06 \`style\` \u548C \`className\` \u7684\u6837\u5F0F\u4FEE\u6539\u6743\u9650\u5168\u90E8\u66B4\u9732\u51FA\u53BB\uFF0C\u800C\u662F\u63D0\u4F9B\u4E86\u4E00\u5957\u5C3A\u5BF8\u76F8\u5173\u7684 props\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8FD9\u4E9B props \u6765\u8C03\u6574\u7EC4\u4EF6\u7684\u5C3A\u5BF8 (\`size\` \`trackWidth\` \`pointerWidth\` \`pointerHeight\`)\r
\r
### \u989C\u8272\u76F8\u5173\r
\r
<Color />\r
\r
\u4E0E\u5C3A\u5BF8\u7684\u4FEE\u6539\u76F8\u540C\uFF0C \`Knob\` \u7684\u989C\u8272\u76F8\u5173\u7684\u6837\u5F0F\u4E5F\u662F\u901A\u8FC7 props \u66B4\u9732\u51FA\u53BB\u7684\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8FD9\u4E9B props \u6765\u8C03\u6574\u7EC4\u4EF6\u7684\u989C\u8272 (\`trackColor\` \`progressColor\` \`buttonColor\` \`pointerColor\`)\r
\r
## \u6807\u7B7E Data\r
\r
- \`data-dragging\`: \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u62D6\u62FD\u72B6\u6001\r
\r
- \`data-disabled\`: \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u7981\u7528\u72B6\u6001\r
\r
- \`data-bilateral\`: \u5F53\u524D\u65CB\u94AE\u662F\u5426\u5904\u4E8E\u53CC\u5411\u65CB\u8F6C\u6A21\u5F0F\r
\r
- \`data-direction\`: \u5F53\u524D\u65CB\u94AE\u7684\u5904\u4E8E\u5DE6\u4FA7\u8FD8\u662F\u53F3\u4FA7\uFF0C\`positive\` \u4E3A\u53F3\u4FA7\u65F6\uFF0C\`negative\` \u4E3A\u5DE6\u4FA7\u65F6\uFF08\u4EC5\u5728 \`bilateral\` \u6A21\u5F0F\u4E0B\u53EF\u53D8\uFF09\r
\r
## API\r
\r
### Knob\r
\r
<KnobAPITable />\r
\r
## \u7C7B\u578B\u58F0\u660E\r
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
export interface KnobRef extends HTMLDivElement {}\`} />\r
`;export{T as content,D as default,N as frontmatter,P as lastUpdatedTime,k as title,S as toc};
