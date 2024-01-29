import{jsx as r,jsxs as n,Fragment as i}from"react/jsx-runtime";import{C as d}from"./CodeBlock.de027be4.js";import{G as t}from"./github.54c71331.js";import{l as c}from"./chunk-MPX6TMFQ.dc1d8ff0.js";import"react";import"./index.2d091e0a.js";const p=void 0,b=[{id:"import",text:"Import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"usewaveformprops",text:"UseWaveformProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],g="useWaveform";function o(a){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},a.components);return n(i,{children:[n(e.h1,{id:"usewaveform",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usewaveform",children:"#"}),r(e.code,{children:"useWaveform"})]}),`
`,r(e.p,{children:"This Hook allows you to fetch waveform data of an audio file."}),`
`,n(c,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useWaveform.ts",target:"_blank",size:"sm",className:"flex items-center",children:[r(t,{className:"w-4 h-4"}),r("span",{className:"ml-2",children:"View Source"})]}),`
`,n(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(d,{code:"import { useWaveform, type UseWaveformProps } form 'echo-ui'"}),`
`,n(e.h2,{id:"parameters",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,n(e.h3,{id:"usewaveformprops",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usewaveformprops",children:"#"}),r(e.code,{children:"UseWaveformProps"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"audioBuffer"})," (required): ",r(e.code,{children:"AudioBuffer"})]}),`
`,r(e.p,{children:"The ArrayBuffer data of the audio file."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"channel"}),": ",r(e.code,{children:"1 | 2"})]}),`
`,n(e.p,{children:["The number of audio channels in the audio file, defaults to ",r(e.code,{children:"2"}),"."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"samples"}),": ",r(e.code,{children:"number"})]}),`
`,n(e.p,{children:["The audio file's sample rate, defaults to ",r(e.code,{children:"1024"}),"."]}),`
`]}),`
`]}),`
`,n(e.h2,{id:"return-value",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-value",children:"#"}),"Return Value"]}),`
`,n(e.h3,{id:"object",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),r(e.code,{children:"Object"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"data"}),": ",r(e.code,{children:"number[] | number[][]"})]}),`
`,n(e.p,{children:["The waveform data. Returns ",r(e.code,{children:"number[]"})," when ",r(e.code,{children:"channel"})," is ",r(e.code,{children:"1"})," and ",r(e.code,{children:"number[][]"})," when ",r(e.code,{children:"channel"})," is ",r(e.code,{children:"2"}),"."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"error"}),": ",r(e.code,{children:"boolean"})]}),`
`,r(e.p,{children:"Indicates whether an error occurred during waveform data generation."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"errorMessage"}),": ",r(e.code,{children:"string"})]}),`
`,r(e.p,{children:"The error message."}),`
`]}),`
`]})]})}function v(a={}){const{wrapper:e}=a.components||{};return e?r(e,Object.assign({},a,{children:r(o,a)})):o(a)}const w="2024/1/17 09:08:44",k=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Chip, Link } from '@nextui-org/react'\r
import { Github } from 'lucide-react'\r
\r
# \`useWaveform\`\r
\r
This Hook allows you to fetch waveform data of an audio file.\r
\r
<Link\r
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useWaveform.ts"\r
  target="_blank"\r
  size="sm"\r
  className="flex items-center"\r
>\r
  <Github className="w-4 h-4" />\r
  <span className="ml-2">View Source</span>\r
</Link>\r
\r
## Import\r
\r
<CodeBlock code={\`import { useWaveform, type UseWaveformProps } form 'echo-ui'\`} />\r
\r
## Parameters\r
\r
### \`UseWaveformProps\`\r
\r
- **audioBuffer** (required): \`AudioBuffer\`\r
\r
  The ArrayBuffer data of the audio file.\r
\r
- **channel**: \`1 | 2\`\r
\r
  The number of audio channels in the audio file, defaults to \`2\`.\r
\r
- **samples**: \`number\`\r
\r
  The audio file's sample rate, defaults to \`1024\`.\r
\r
## Return Value\r
\r
### \`Object\`\r
\r
- **data**: \`number[] | number[][]\`\r
\r
  The waveform data. Returns \`number[]\` when \`channel\` is \`1\` and \`number[][]\` when \`channel\` is \`2\`.\r
\r
- **error**: \`boolean\`\r
\r
  Indicates whether an error occurred during waveform data generation.\r
\r
- **errorMessage**: \`string\`\r
\r
  The error message.\r
`;export{k as content,v as default,p as frontmatter,w as lastUpdatedTime,g as title,b as toc};
