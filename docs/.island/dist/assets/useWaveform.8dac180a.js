import{jsx as n,jsxs as r,Fragment as i}from"react/jsx-runtime";import{C as d}from"./CodeBlock.de027be4.js";import{G as a}from"./github.54c71331.js";import{l as h}from"./chunk-MPX6TMFQ.dc1d8ff0.js";import"react";import"./index.2d091e0a.js";const p=void 0,b=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4F20\u53C2",text:"\u4F20\u53C2",depth:2},{id:"usewaveformprops",text:"UseWaveformProps",depth:3},{id:"\u8FD4\u56DE\u503C",text:"\u8FD4\u56DE\u503C",depth:2},{id:"object",text:"Object",depth:3}],g="useWaveform";function o(c){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},c.components);return r(i,{children:[r(e.h1,{id:"usewaveform",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usewaveform",children:"#"}),n(e.code,{children:"useWaveform"})]}),`
`,r(e.p,{children:["\u7528\u8BE5 Hook \u53EF\u4EE5\u83B7\u53D6\u97F3\u9891\u6587\u4EF6\u7684\u6CE2\u5F62\u6570\u636E\uFF0C\u5E76\u4E0E ",n(e.code,{children:"Waveform"})," \u7EC4\u4EF6\u914D\u5408\u4F7F\u7528\uFF0C\u5B9E\u73B0\u97F3\u9891\u6CE2\u5F62\u7684\u53EF\u89C6\u5316"]}),`
`,r(h,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useWaveform.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(a,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"\u67E5\u770B\u6E90\u7801"})]}),`
`,r(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(d,{code:"import { useWaveform, type UseWaveformProps } form 'echo-ui'"}),`
`,r(e.h2,{id:"\u4F20\u53C2",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4F20\u53C2",children:"#"}),"\u4F20\u53C2"]}),`
`,r(e.h3,{id:"usewaveformprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usewaveformprops",children:"#"}),n(e.code,{children:"UseWaveformProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"audioBuffer"}),"(\u5FC5\u4F20): ",n(e.code,{children:"AudioBuffer"})]}),`
`,n(e.p,{children:"\u97F3\u9891\u6587\u4EF6\u7684 AudioBuffer \u6570\u636E"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"channel"}),": ",n(e.code,{children:"1 | 2"})]}),`
`,r(e.p,{children:["\u97F3\u9891\u6587\u4EF6\u7684\u58F0\u9053\u6570\uFF0C\u9ED8\u8BA4\u4E3A ",n(e.code,{children:"2"})]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"samples"}),": ",n(e.code,{children:"number"})]}),`
`,r(e.p,{children:["\u97F3\u9891\u6587\u4EF6\u7684\u91C7\u6837\u7387\uFF0C\u9ED8\u8BA4\u4E3A ",n(e.code,{children:"1024"})]}),`
`]}),`
`]}),`
`,r(e.h2,{id:"\u8FD4\u56DE\u503C",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FD4\u56DE\u503C",children:"#"}),"\u8FD4\u56DE\u503C"]}),`
`,r(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"data"}),": ",n(e.code,{children:"number[] | number[][]"})]}),`
`,r(e.p,{children:["\u6CE2\u5F62\u6570\u636E\uFF0C\u5F53\u5165\u53C2 ",n(e.code,{children:"channel"})," \u4E3A ",n(e.code,{children:"1"})," \u65F6\u8FD4\u56DE ",n(e.code,{children:"number[]"}),"\uFF0C\u4E3A ",n(e.code,{children:"2"})," \u65F6\u8FD4\u56DE ",n(e.code,{children:"number[][]"})]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"audioDuration"}),": ",n(e.code,{children:"React.MutableRefObject<number>"})]}),`
`,r(e.p,{children:["\u97F3\u9891\u6587\u4EF6\u7684\u65F6\u957F\u5355\u4F4D\u4E3A\u79D2\uFF0C\u9700\u8981\u4F7F\u7528 ",n(e.code,{children:".current"})," \u83B7\u53D6"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"\u5728\u751F\u6210 Waveform \u6570\u636E\u8FC7\u7A0B\u4E2D\u662F\u5426\u53D1\u751F\u9519\u8BEF"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"\u9519\u8BEF\u4FE1\u606F"}),`
`]}),`
`]})]})}function v(c={}){const{wrapper:e}=c.components||{};return e?n(e,Object.assign({},c,{children:n(o,c)})):o(c)}const k="2024/3/9 14:31:31",W=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Chip, Link } from '@nextui-org/react'
import { Github } from 'lucide-react'

# \`useWaveform\`

\u7528\u8BE5 Hook \u53EF\u4EE5\u83B7\u53D6\u97F3\u9891\u6587\u4EF6\u7684\u6CE2\u5F62\u6570\u636E\uFF0C\u5E76\u4E0E \`Waveform\` \u7EC4\u4EF6\u914D\u5408\u4F7F\u7528\uFF0C\u5B9E\u73B0\u97F3\u9891\u6CE2\u5F62\u7684\u53EF\u89C6\u5316

<Link
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useWaveform.ts"
  target="_blank"
  size="sm"
  className="flex items-center"
>
  <Github className="w-4 h-4" />
  <span className="ml-2">\u67E5\u770B\u6E90\u7801</span>
</Link>

## \u5F15\u5165

<CodeBlock code={\`import { useWaveform, type UseWaveformProps } form 'echo-ui'\`} />

## \u4F20\u53C2

### \`UseWaveformProps\`

- **audioBuffer**(\u5FC5\u4F20): \`AudioBuffer\`

  \u97F3\u9891\u6587\u4EF6\u7684 AudioBuffer \u6570\u636E

- **channel**: \`1 | 2\`

  \u97F3\u9891\u6587\u4EF6\u7684\u58F0\u9053\u6570\uFF0C\u9ED8\u8BA4\u4E3A \`2\`

- **samples**: \`number\`

  \u97F3\u9891\u6587\u4EF6\u7684\u91C7\u6837\u7387\uFF0C\u9ED8\u8BA4\u4E3A \`1024\`

## \u8FD4\u56DE\u503C

### \`Object\`

- **data**: \`number[] | number[][]\`

  \u6CE2\u5F62\u6570\u636E\uFF0C\u5F53\u5165\u53C2 \`channel\` \u4E3A \`1\` \u65F6\u8FD4\u56DE \`number[]\`\uFF0C\u4E3A \`2\` \u65F6\u8FD4\u56DE \`number[][]\`

- **audioDuration**: \`React.MutableRefObject<number>\`

  \u97F3\u9891\u6587\u4EF6\u7684\u65F6\u957F\u5355\u4F4D\u4E3A\u79D2\uFF0C\u9700\u8981\u4F7F\u7528 \`.current\` \u83B7\u53D6

- **error**: \`boolean\`

  \u5728\u751F\u6210 Waveform \u6570\u636E\u8FC7\u7A0B\u4E2D\u662F\u5426\u53D1\u751F\u9519\u8BEF

- **errorMessage**: \`string\`

  \u9519\u8BEF\u4FE1\u606F
`;export{W as content,v as default,p as frontmatter,k as lastUpdatedTime,g as title,b as toc};
