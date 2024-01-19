import{jsx as r,jsxs as n,Fragment as i}from"react/jsx-runtime";import{C as d}from"./CodeBlock.988145ba.js";import{l as a,G as h}from"./github.204dd0d2.js";import"./createLucideIcon.6491784f.js";import"react";const f=void 0,p=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4F20\u53C2",text:"\u4F20\u53C2",depth:2},{id:"usewaveformprops",text:"UseWaveformProps",depth:3},{id:"\u8FD4\u56DE\u503C",text:"\u8FD4\u56DE\u503C",depth:2},{id:"object",text:"Object",depth:3}],b="useWaveform";function o(c){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},c.components);return n(i,{children:[n(e.h1,{id:"usewaveform",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usewaveform",children:"#"}),r(e.code,{children:"useWaveform"})]}),`
`,n(e.p,{children:["\u7528\u8BE5 Hook \u53EF\u4EE5\u83B7\u53D6\u97F3\u9891\u6587\u4EF6\u7684\u6CE2\u5F62\u6570\u636E\uFF0C\u5E76\u4E0E ",r(e.code,{children:"Waveform"})," \u7EC4\u4EF6\u914D\u5408\u4F7F\u7528\uFF0C\u5B9E\u73B0\u97F3\u9891\u6CE2\u5F62\u7684\u53EF\u89C6\u5316"]}),`
`,n(a,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useWaveform.ts",target:"_blank",size:"sm",className:"flex items-center",children:[r(h,{className:"w-4 h-4"}),r("span",{className:"ml-2",children:"\u67E5\u770B\u6E90\u7801"})]}),`
`,n(e.h2,{id:"\u5F15\u5165",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,r(d,{code:"import { useWaveform, type UseWaveformProps } form 'echo-ui'"}),`
`,n(e.h2,{id:"\u4F20\u53C2",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4F20\u53C2",children:"#"}),"\u4F20\u53C2"]}),`
`,n(e.h3,{id:"usewaveformprops",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usewaveformprops",children:"#"}),r(e.code,{children:"UseWaveformProps"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"audioBuffer"}),"(\u5FC5\u4F20): ",r(e.code,{children:"AudioBuffer"})]}),`
`,r(e.p,{children:"\u97F3\u9891\u6587\u4EF6\u7684 AudioBuffer \u6570\u636E"}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"channel"}),": ",r(e.code,{children:"1 | 2"})]}),`
`,n(e.p,{children:["\u97F3\u9891\u6587\u4EF6\u7684\u58F0\u9053\u6570\uFF0C\u9ED8\u8BA4\u4E3A ",r(e.code,{children:"2"})]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"samples"}),": ",r(e.code,{children:"number"})]}),`
`,n(e.p,{children:["\u97F3\u9891\u6587\u4EF6\u7684\u91C7\u6837\u7387\uFF0C\u9ED8\u8BA4\u4E3A ",r(e.code,{children:"1024"})]}),`
`]}),`
`]}),`
`,n(e.h2,{id:"\u8FD4\u56DE\u503C",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FD4\u56DE\u503C",children:"#"}),"\u8FD4\u56DE\u503C"]}),`
`,n(e.h3,{id:"object",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),r(e.code,{children:"Object"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"data"}),": ",r(e.code,{children:"number[] | number[][]"})]}),`
`,n(e.p,{children:["\u6CE2\u5F62\u6570\u636E\uFF0C\u5F53\u5165\u53C2 ",r(e.code,{children:"channel"})," \u4E3A ",r(e.code,{children:"1"})," \u65F6\u8FD4\u56DE ",r(e.code,{children:"number[]"}),"\uFF0C\u4E3A ",r(e.code,{children:"2"})," \u65F6\u8FD4\u56DE ",r(e.code,{children:"number[][]"})]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"error"}),": ",r(e.code,{children:"boolean"})]}),`
`,r(e.p,{children:"\u5728\u751F\u6210 Waveform \u6570\u636E\u8FC7\u7A0B\u4E2D\u662F\u5426\u53D1\u751F\u9519\u8BEF"}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"errorMessage"}),": ",r(e.code,{children:"string"})]}),`
`,r(e.p,{children:"\u9519\u8BEF\u4FE1\u606F"}),`
`]}),`
`]})]})}function g(c={}){const{wrapper:e}=c.components||{};return e?r(e,Object.assign({},c,{children:r(o,c)})):o(c)}const v="2024/1/17 09:08:44",k=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Chip, Link } from '@nextui-org/react'\r
import { Github } from 'lucide-react'\r
\r
# \`useWaveform\`\r
\r
\u7528\u8BE5 Hook \u53EF\u4EE5\u83B7\u53D6\u97F3\u9891\u6587\u4EF6\u7684\u6CE2\u5F62\u6570\u636E\uFF0C\u5E76\u4E0E \`Waveform\` \u7EC4\u4EF6\u914D\u5408\u4F7F\u7528\uFF0C\u5B9E\u73B0\u97F3\u9891\u6CE2\u5F62\u7684\u53EF\u89C6\u5316\r
\r
<Link\r
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useWaveform.ts"\r
  target="_blank"\r
  size="sm"\r
  className="flex items-center"\r
>\r
  <Github className="w-4 h-4" />\r
  <span className="ml-2">\u67E5\u770B\u6E90\u7801</span>\r
</Link>\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { useWaveform, type UseWaveformProps } form 'echo-ui'\`} />\r
\r
## \u4F20\u53C2\r
\r
### \`UseWaveformProps\`\r
\r
- **audioBuffer**(\u5FC5\u4F20): \`AudioBuffer\`\r
\r
  \u97F3\u9891\u6587\u4EF6\u7684 AudioBuffer \u6570\u636E\r
\r
- **channel**: \`1 | 2\`\r
\r
  \u97F3\u9891\u6587\u4EF6\u7684\u58F0\u9053\u6570\uFF0C\u9ED8\u8BA4\u4E3A \`2\`\r
\r
- **samples**: \`number\`\r
\r
  \u97F3\u9891\u6587\u4EF6\u7684\u91C7\u6837\u7387\uFF0C\u9ED8\u8BA4\u4E3A \`1024\`\r
\r
## \u8FD4\u56DE\u503C\r
\r
### \`Object\`\r
\r
- **data**: \`number[] | number[][]\`\r
\r
  \u6CE2\u5F62\u6570\u636E\uFF0C\u5F53\u5165\u53C2 \`channel\` \u4E3A \`1\` \u65F6\u8FD4\u56DE \`number[]\`\uFF0C\u4E3A \`2\` \u65F6\u8FD4\u56DE \`number[][]\`\r
\r
- **error**: \`boolean\`\r
\r
  \u5728\u751F\u6210 Waveform \u6570\u636E\u8FC7\u7A0B\u4E2D\u662F\u5426\u53D1\u751F\u9519\u8BEF\r
\r
- **errorMessage**: \`string\`\r
\r
  \u9519\u8BEF\u4FE1\u606F\r
`;export{k as content,g as default,f as frontmatter,v as lastUpdatedTime,b as title,p as toc};
