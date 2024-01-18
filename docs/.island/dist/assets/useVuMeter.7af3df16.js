import{jsx as n,jsxs as r,Fragment as i}from"react/jsx-runtime";import{C as a}from"./CodeBlock.913859b9.js";import{l as h,G as s}from"./github.6e7f8090.js";import"react";const m=void 0,p=[{id:"import",text:"Import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"usevumeterprops",text:"UseVuMeterProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],b="useVuMeter";function o(t){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},t.components);return r(i,{children:[r(e.h1,{id:"usevumeter",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usevumeter",children:"#"}),n(e.code,{children:"useVuMeter"})]}),`
`,n(e.p,{children:"A Hook for obtaining audio volume levels"}),`
`,r(h,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useVuMeter.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(s,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"View Source Code"})]}),`
`,r(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(a,{code:"import { useVuMeter, type UseVuMeterProps } from 'echo-ui'"}),`
`,r(e.h2,{id:"parameters",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,r(e.h3,{id:"usevumeterprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usevumeterprops",children:"#"}),n(e.code,{children:"UseVuMeterProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"value"})," (required): ",n(e.code,{children:"number | number[]"})]}),`
`,n(e.p,{children:"The initial volume level. When an array is passed, it represents stereo, with the first value for the left channel and the second for the right channel; when a number is passed, it represents mono (Recommended range: -60 ~ 10)."}),`
`]}),`
`]}),`
`,r(e.h2,{id:"return-value",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-value",children:"#"}),"Return Value"]}),`
`,r(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"meter"}),": ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Meter",target:"_blank",rel:"nofollow",children:n(e.code,{children:"Tone.Meter | Tone.Split"})})]}),`
`,n(e.p,{children:"The audio data returned by the request."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"value"}),": ",n(e.code,{children:"number | number[]"})]}),`
`,r(e.p,{children:["The current volume level, which can be obtained periodically on your own, or you can use the ",n(e.code,{children:"observe"})," method below to monitor changes."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"observe"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Monitors changes in the volume level. Use this function to start monitoring and obtain real-time changes in the value."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"cancelObserve"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Cancels the monitoring."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Indicates whether an error has occurred."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"The error message if the request fails."}),`
`]}),`
`]})]})}function g(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(o,t)})):o(t)}const f="2024/1/18 19:50:06",v=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Chip, Link } from '@nextui-org/react'
import { Github } from 'lucide-react'

# \`useVuMeter\`

A Hook for obtaining audio volume levels

<Link
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useVuMeter.ts"
  target="_blank"
  size="sm"
  className="flex items-center"
>
  <Github className="w-4 h-4" />
  <span className="ml-2">View Source Code</span>
</Link>

## Import

<CodeBlock code={\`import { useVuMeter, type UseVuMeterProps } from 'echo-ui'\`} />

## Parameters

### \`UseVuMeterProps\`

- **value** (required): \`number | number[]\`

  The initial volume level. When an array is passed, it represents stereo, with the first value for the left channel and the second for the right channel; when a number is passed, it represents mono (Recommended range: -60 ~ 10).

## Return Value

### \`Object\`

- **meter**: [\`Tone.Meter | Tone.Split\`](https://tonejs.github.io/docs/14.7.77/Meter)

  The audio data returned by the request.

- **value**: \`number | number[]\`

  The current volume level, which can be obtained periodically on your own, or you can use the \`observe\` method below to monitor changes.

- **observe**: \`() => void\`

  Monitors changes in the volume level. Use this function to start monitoring and obtain real-time changes in the value.

- **cancelObserve**: \`() => void\`

  Cancels the monitoring.

- **error**: \`boolean\`

  Indicates whether an error has occurred.

- **errorMessage**: \`string\`

  The error message if the request fails.
`;export{v as content,g as default,m as frontmatter,f as lastUpdatedTime,b as title,p as toc};
