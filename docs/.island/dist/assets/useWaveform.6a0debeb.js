import{jsx as n,jsxs as r,Fragment as i}from"react/jsx-runtime";import{C as d}from"./CodeBlock.69bc42b0.js";import{l as c,G as t}from"./github.b0bde753.js";import"react";const u=void 0,f=[{id:"import",text:"Import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"usewaveformprops",text:"UseWaveformProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],p="useWaveform";function o(a){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},a.components);return r(i,{children:[r(e.h1,{id:"usewaveform",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usewaveform",children:"#"}),n(e.code,{children:"useWaveform"})]}),`
`,n(e.p,{children:"This Hook allows you to fetch waveform data of an audio file."}),`
`,r(c,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useWaveform.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(t,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"View Source"})]}),`
`,r(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(d,{code:"import { useWaveform, type UseWaveformProps } form 'echo-ui'"}),`
`,r(e.h2,{id:"parameters",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,r(e.h3,{id:"usewaveformprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usewaveformprops",children:"#"}),n(e.code,{children:"UseWaveformProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"audioBuffer"})," (required): ",n(e.code,{children:"AudioBuffer"})]}),`
`,n(e.p,{children:"The ArrayBuffer data of the audio file."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"channel"}),": ",n(e.code,{children:"1 | 2"})]}),`
`,r(e.p,{children:["The number of audio channels in the audio file, defaults to ",n(e.code,{children:"2"}),"."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"samples"}),": ",n(e.code,{children:"number"})]}),`
`,r(e.p,{children:["The audio file's sample rate, defaults to ",n(e.code,{children:"1024"}),"."]}),`
`]}),`
`]}),`
`,r(e.h2,{id:"return-value",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-value",children:"#"}),"Return Value"]}),`
`,r(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"data"}),": ",n(e.code,{children:"number[] | number[][]"})]}),`
`,r(e.p,{children:["The waveform data. Returns ",n(e.code,{children:"number[]"})," when ",n(e.code,{children:"channel"})," is ",n(e.code,{children:"1"})," and ",n(e.code,{children:"number[][]"})," when ",n(e.code,{children:"channel"})," is ",n(e.code,{children:"2"}),"."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Indicates whether an error occurred during waveform data generation."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"The error message."}),`
`]}),`
`]})]})}function b(a={}){const{wrapper:e}=a.components||{};return e?n(e,Object.assign({},a,{children:n(o,a)})):o(a)}const g="2024/1/17 09:08:44",v=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Chip, Link } from '@nextui-org/react'
import { Github } from 'lucide-react'

# \`useWaveform\`

This Hook allows you to fetch waveform data of an audio file.

<Link
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useWaveform.ts"
  target="_blank"
  size="sm"
  className="flex items-center"
>
  <Github className="w-4 h-4" />
  <span className="ml-2">View Source</span>
</Link>

## Import

<CodeBlock code={\`import { useWaveform, type UseWaveformProps } form 'echo-ui'\`} />

## Parameters

### \`UseWaveformProps\`

- **audioBuffer** (required): \`AudioBuffer\`

  The ArrayBuffer data of the audio file.

- **channel**: \`1 | 2\`

  The number of audio channels in the audio file, defaults to \`2\`.

- **samples**: \`number\`

  The audio file's sample rate, defaults to \`1024\`.

## Return Value

### \`Object\`

- **data**: \`number[] | number[][]\`

  The waveform data. Returns \`number[]\` when \`channel\` is \`1\` and \`number[][]\` when \`channel\` is \`2\`.

- **error**: \`boolean\`

  Indicates whether an error occurred during waveform data generation.

- **errorMessage**: \`string\`

  The error message.
`;export{v as content,b as default,u as frontmatter,g as lastUpdatedTime,p as title,f as toc};
