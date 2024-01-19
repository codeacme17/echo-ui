import{jsx as r,jsxs as n,Fragment as i}from"react/jsx-runtime";import{C as a}from"./CodeBlock.988145ba.js";import{l,G as c}from"./github.204dd0d2.js";import"./createLucideIcon.6491784f.js";import"react";const p=void 0,g=[{id:"import",text:"Import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"usevumeterprops",text:"UseVuMeterProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],b="useVuMeter";function o(t){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},t.components);return n(i,{children:[n(e.h1,{id:"usevumeter",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usevumeter",children:"#"}),r(e.code,{children:"useVuMeter"})]}),`
`,r(e.p,{children:"A Hook for obtaining audio volume levels"}),`
`,n(l,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useVuMeter.ts",target:"_blank",size:"sm",className:"flex items-center",children:[r(c,{className:"w-4 h-4"}),r("span",{className:"ml-2",children:"View Source"})]}),`
`,n(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(a,{code:"import { useVuMeter, type UseVuMeterProps } from 'echo-ui'"}),`
`,n(e.h2,{id:"parameters",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,n(e.h3,{id:"usevumeterprops",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usevumeterprops",children:"#"}),r(e.code,{children:"UseVuMeterProps"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"value"})," (required): ",r(e.code,{children:"number | number[]"})]}),`
`,r(e.p,{children:"The initial volume level. When an array is passed, it represents stereo, with the first value for the left channel and the second for the right channel; when a number is passed, it represents mono (Recommended range: -60 ~ 10)."}),`
`]}),`
`]}),`
`,n(e.h2,{id:"return-value",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-value",children:"#"}),"Return Value"]}),`
`,n(e.h3,{id:"object",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),r(e.code,{children:"Object"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"meter"}),": ",r(e.code,{children:"Tone.Meter | Tone.Split"})]}),`
`,n(e.p,{children:["Initially constructed ",r(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Meter",target:"_blank",rel:"nofollow",children:"Tone.Meter"}),"(Mono) or ",r(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Split",target:"_blank",rel:"nofollow",children:"Tone.Split"}),"(Stereo) instances"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"value"}),": ",r(e.code,{children:"number | number[]"})]}),`
`,n(e.p,{children:["The current volume value can be obtained through ",r(e.code,{children:"getValue"})," at your own time or use the ",r(e.code,{children:"observe"})," method to automatically start monitoring."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"getValue"}),": ",r(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:["Get the volume value. After the call, the value of ",r(e.code,{children:"value"})," will be updated. You can use a timer or ",r(e.code,{children:"requestAnimationFrame"})," to call it."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"observe"}),": ",r(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:"Monitor changes in volume value. Use this function to turn on monitoring and obtain value changes in real time."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"cancelObserve"}),": ",r(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:"Cancel monitoring"}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"error"}),": ",r(e.code,{children:"boolean"})]}),`
`,r(e.p,{children:"Whether an error occurred"}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"errorMessage"}),": ",r(e.code,{children:"string"})]}),`
`,r(e.p,{children:"The error message if an error occurs."}),`
`]}),`
`]})]})}function v(t={}){const{wrapper:e}=t.components||{};return e?r(e,Object.assign({},t,{children:r(o,t)})):o(t)}const f="2024/1/19 14:45:33",M=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Chip, Link } from '@nextui-org/react'\r
import { Github } from 'lucide-react'\r
\r
# \`useVuMeter\`\r
\r
A Hook for obtaining audio volume levels\r
\r
<Link\r
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useVuMeter.ts"\r
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
<CodeBlock code={\`import { useVuMeter, type UseVuMeterProps } from 'echo-ui'\`} />\r
\r
## Parameters\r
\r
### \`UseVuMeterProps\`\r
\r
- **value** (required): \`number | number[]\`\r
\r
  The initial volume level. When an array is passed, it represents stereo, with the first value for the left channel and the second for the right channel; when a number is passed, it represents mono (Recommended range: -60 ~ 10).\r
\r
## Return Value\r
\r
### \`Object\`\r
\r
- **meter**: \`Tone.Meter | Tone.Split\`\r
\r
  Initially constructed [Tone.Meter](https://tonejs.github.io/docs/14.7.77/Meter)(Mono) or [Tone.Split](https://tonejs.github.io/docs/14.7.77/Split)(Stereo) instances\r
\r
- **value**: \`number | number[]\`\r
\r
  The current volume value can be obtained through \`getValue\` at your own time or use the \`observe\` method to automatically start monitoring.\r
\r
- **getValue**: \`() => void\`\r
\r
  Get the volume value. After the call, the value of \`value\` will be updated. You can use a timer or \`requestAnimationFrame\` to call it.\r
\r
- **observe**: \`() => void\`\r
\r
  Monitor changes in volume value. Use this function to turn on monitoring and obtain value changes in real time.\r
\r
- **cancelObserve**: \`() => void\`\r
\r
  Cancel monitoring\r
\r
- **error**: \`boolean\`\r
\r
  Whether an error occurred\r
\r
- **errorMessage**: \`string\`\r
\r
  The error message if an error occurs.\r
`;export{M as content,v as default,p as frontmatter,f as lastUpdatedTime,b as title,g as toc};
