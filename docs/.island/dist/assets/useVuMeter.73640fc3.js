import{jsx as n,jsxs as r,Fragment as i}from"react/jsx-runtime";import{C as a}from"./CodeBlock.913859b9.js";import{l,G as c}from"./github.6e7f8090.js";import"react";const m=void 0,p=[{id:"import",text:"Import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"usevumeterprops",text:"UseVuMeterProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],v="useVuMeter";function o(t){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},t.components);return r(i,{children:[r(e.h1,{id:"usevumeter",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usevumeter",children:"#"}),n(e.code,{children:"useVuMeter"})]}),`
`,n(e.p,{children:"A Hook for obtaining audio volume levels"}),`
`,r(l,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useVuMeter.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(c,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"View Source Code"})]}),`
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
`,n(e.p,{children:"Constructed Tone.Meter or Tone.Split instance"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"value"}),": ",n(e.code,{children:"number | number[]"})]}),`
`,r(e.p,{children:["The current volume value can be obtained through ",n(e.code,{children:"getValue"})," at your own time or use the ",n(e.code,{children:"observe"})," method to automatically start monitoring."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"getValue"}),": ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["Get the volume value. After the call, the value of ",n(e.code,{children:"value"})," will be updated. You can use a timer or ",n(e.code,{children:"requestAnimationFrame"})," to call it."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"observe"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Monitor changes in volume value. Use this function to turn on monitoring and obtain value changes in real time."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"cancelObserve"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Cancel monitoring"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether an error occurred"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"Request error message"}),`
`]}),`
`]})]})}function g(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(o,t)})):o(t)}const b="2024/1/18 22:27:49",f=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
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

  Constructed Tone.Meter or Tone.Split instance

- **value**: \`number | number[]\`

  The current volume value can be obtained through \`getValue\` at your own time or use the \`observe\` method to automatically start monitoring.

- **getValue**: \`() => void\`

  Get the volume value. After the call, the value of \`value\` will be updated. You can use a timer or \`requestAnimationFrame\` to call it.

- **observe**: \`() => void\`

  Monitor changes in volume value. Use this function to turn on monitoring and obtain value changes in real time.

- **cancelObserve**: \`() => void\`

  Cancel monitoring

- **error**: \`boolean\`

  Whether an error occurred

- **errorMessage**: \`string\`

  Request error message
`;export{f as content,g as default,m as frontmatter,b as lastUpdatedTime,v as title,p as toc};
