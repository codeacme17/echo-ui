import{jsx as n,jsxs as r,Fragment as t}from"react/jsx-runtime";import{C as o}from"./CodeBlock.d8e569ad.js";import{G as d}from"./github.5a3bc884.js";import{l}from"./chunk-MPX6TMFQ.a406c4b8.js";import"react";import"./index.93441784.js";const b=void 0,g=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4F20\u53C2",text:"\u4F20\u53C2",depth:2},{id:"usevumeterprops",text:"UseVuMeterProps",depth:3},{id:"\u8FD4\u56DE\u503C",text:"\u8FD4\u56DE\u503C",depth:2},{id:"object",text:"Object",depth:3}],f="useVuMeter";function c(i){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},i.components);return r(t,{children:[r(e.h1,{id:"usevumeter",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usevumeter",children:"#"}),n(e.code,{children:"useVuMeter"})]}),`
`,n(e.p,{children:"\u7528\u4E8E\u83B7\u53D6\u97F3\u9891\u97F3\u91CF\u7684 Hook"}),`
`,r(l,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useVuMeter.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(d,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"\u67E5\u770B\u6E90\u7801"})]}),`
`,r(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(o,{code:"import { useVuMeter, type UseVuMeterProps } form 'echo-ui'"}),`
`,r(e.h2,{id:"\u4F20\u53C2",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4F20\u53C2",children:"#"}),"\u4F20\u53C2"]}),`
`,r(e.h3,{id:"usevumeterprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usevumeterprops",children:"#"}),n(e.code,{children:"UseVuMeterProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"value"}),"(\u5FC5\u4F20): ",n(e.code,{children:"number | number[]"})]}),`
`,n(e.p,{children:"\u521D\u59CB\u7684\u97F3\u91CF\u503C\u3002\u5F53\u4F20\u5165\u7684\u662F\u6570\u7EC4\u65F6\u8868\u793A\u53CC\u58F0\u9053\uFF0C\u6570\u7EC4\u4E2D\u7684\u7B2C\u4E00\u4E2A\u503C\u4E3A\u5DE6\u58F0\u9053\uFF0C\u7B2C\u4E8C\u4E2A\u503C\u4E3A\u53F3\u58F0\u9053\uFF1B\u5F53\u4F20\u5165\u7684\u662F\u6570\u5B57\u65F6\u8868\u793A\u5355\u58F0\u9053 (\u5EFA\u8BAE\u8303\u56F4\uFF1A-60 ~ 10)"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onReady"}),": ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["\u5F53 ",n(e.code,{children:"meter"})," \u521D\u59CB\u5316\u5B8C\u6210\u540E\u7684\u56DE\u8C03\u51FD\u6570"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onError"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"\u5F53 hook \u5185\u90E8\u51FA\u73B0\u9519\u8BEF\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`]}),`
`,r(e.h2,{id:"\u8FD4\u56DE\u503C",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FD4\u56DE\u503C",children:"#"}),"\u8FD4\u56DE\u503C"]}),`
`,r(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"init"}),": ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["\u8C03\u7528\u8BE5\u65B9\u6CD5\u53EF\u4EE5\u521D\u59CB\u5316 ",n(e.code,{children:"meter"}),"\uFF0C\u5728\u521D\u59CB\u5316\u5B8C\u6210\u540E\u4F1A\u8C03\u7528 ",n(e.code,{children:"onReady"})," \u56DE\u8C03\u51FD\u6570"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"meter"}),": ",n(e.code,{children:"React.MutableRefObject<Tone.Split | null> | React.MutableRefObject<Tone.Meter | null>"})]}),`
`,r(e.p,{children:["\u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684 ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Meter",target:"_blank",rel:"nofollow",children:"Tone.Meter"}),"(\u5355\u58F0\u9053\u65F6) \u6216 ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Split",target:"_blank",rel:"nofollow",children:"Tone.Split"}),"(\u53CC\u58F0\u9053\u65F6) \u5B9E\u4F8B\uFF0C\u9700\u8981\u4F7F\u7528 ",n(e.code,{children:".current"})," \u8FDB\u884C\u83B7\u53D6"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"value"}),": ",n(e.code,{children:"number | number[]"})]}),`
`,r(e.p,{children:["\u5F53\u524D\u7684\u97F3\u91CF\u503C\uFF0C\u53EF\u4EE5\u81EA\u884C\u5B9A\u65F6\u901A\u8FC7 ",n(e.code,{children:"getValue"})," \u83B7\u53D6\u6216\u8005\u4F7F\u7528 ",n(e.code,{children:"observe"})," \u65B9\u6CD5\u81EA\u52A8\u5F00\u542F\u76D1\u542C"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"getValue"}),": ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["\u83B7\u53D6\u97F3\u91CF\u503C\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 ",n(e.code,{children:"value"})," \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 ",n(e.code,{children:"requestAnimationFrame"})," \u8FDB\u884C\u8C03\u7528"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"observe"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"\u76D1\u542C\u97F3\u91CF\u503C\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 value \u7684\u53D8\u5316"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"cancelObserve"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"\u53D6\u6D88\u76D1\u542C"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"\u662F\u5426\u51FA\u73B0\u51FA\u9519"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"\u51FA\u9519\u7684\u9519\u8BEF\u4FE1\u606F"}),`
`]}),`
`]})]})}function v(i={}){const{wrapper:e}=i.components||{};return e?n(e,Object.assign({},i,{children:n(c,i)})):c(i)}const M="2024/1/31 15:22:24",k=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Chip, Link } from '@nextui-org/react'
import { Github } from 'lucide-react'

# \`useVuMeter\`

\u7528\u4E8E\u83B7\u53D6\u97F3\u9891\u97F3\u91CF\u7684 Hook

<Link
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useVuMeter.ts"
  target="_blank"
  size="sm"
  className="flex items-center"
>
  <Github className="w-4 h-4" />
  <span className="ml-2">\u67E5\u770B\u6E90\u7801</span>
</Link>

## \u5F15\u5165

<CodeBlock code={\`import { useVuMeter, type UseVuMeterProps } form 'echo-ui'\`} />

## \u4F20\u53C2

### \`UseVuMeterProps\`

- **value**(\u5FC5\u4F20): \`number | number[]\`

  \u521D\u59CB\u7684\u97F3\u91CF\u503C\u3002\u5F53\u4F20\u5165\u7684\u662F\u6570\u7EC4\u65F6\u8868\u793A\u53CC\u58F0\u9053\uFF0C\u6570\u7EC4\u4E2D\u7684\u7B2C\u4E00\u4E2A\u503C\u4E3A\u5DE6\u58F0\u9053\uFF0C\u7B2C\u4E8C\u4E2A\u503C\u4E3A\u53F3\u58F0\u9053\uFF1B\u5F53\u4F20\u5165\u7684\u662F\u6570\u5B57\u65F6\u8868\u793A\u5355\u58F0\u9053 (\u5EFA\u8BAE\u8303\u56F4\uFF1A-60 ~ 10)

- **onReady**: \`() => void\`

  \u5F53 \`meter\` \u521D\u59CB\u5316\u5B8C\u6210\u540E\u7684\u56DE\u8C03\u51FD\u6570

- **onError**: \`() => void\`

  \u5F53 hook \u5185\u90E8\u51FA\u73B0\u9519\u8BEF\u65F6\u7684\u56DE\u8C03\u51FD\u6570

## \u8FD4\u56DE\u503C

### \`Object\`

- **init**: \`() => void\`

  \u8C03\u7528\u8BE5\u65B9\u6CD5\u53EF\u4EE5\u521D\u59CB\u5316 \`meter\`\uFF0C\u5728\u521D\u59CB\u5316\u5B8C\u6210\u540E\u4F1A\u8C03\u7528 \`onReady\` \u56DE\u8C03\u51FD\u6570

- **meter**: \`React.MutableRefObject<Tone.Split | null> | React.MutableRefObject<Tone.Meter | null>\`

  \u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684 [Tone.Meter](https://tonejs.github.io/docs/14.7.77/Meter)(\u5355\u58F0\u9053\u65F6) \u6216 [Tone.Split](https://tonejs.github.io/docs/14.7.77/Split)(\u53CC\u58F0\u9053\u65F6) \u5B9E\u4F8B\uFF0C\u9700\u8981\u4F7F\u7528 \`.current\` \u8FDB\u884C\u83B7\u53D6

- **value**: \`number | number[]\`

  \u5F53\u524D\u7684\u97F3\u91CF\u503C\uFF0C\u53EF\u4EE5\u81EA\u884C\u5B9A\u65F6\u901A\u8FC7 \`getValue\` \u83B7\u53D6\u6216\u8005\u4F7F\u7528 \`observe\` \u65B9\u6CD5\u81EA\u52A8\u5F00\u542F\u76D1\u542C

- **getValue**: \`() => void\`

  \u83B7\u53D6\u97F3\u91CF\u503C\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 \`value\` \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 \`requestAnimationFrame\` \u8FDB\u884C\u8C03\u7528

- **observe**: \`() => void\`

  \u76D1\u542C\u97F3\u91CF\u503C\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 value \u7684\u53D8\u5316

- **cancelObserve**: \`() => void\`

  \u53D6\u6D88\u76D1\u542C

- **error**: \`boolean\`

  \u662F\u5426\u51FA\u73B0\u51FA\u9519

- **errorMessage**: \`string\`

  \u51FA\u9519\u7684\u9519\u8BEF\u4FE1\u606F
`;export{k as content,v as default,b as frontmatter,M as lastUpdatedTime,f as title,g as toc};
