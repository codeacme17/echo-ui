import{jsx as n,jsxs as r,Fragment as o}from"react/jsx-runtime";import{C as l}from"./CodeBlock.d8e569ad.js";import{G as c}from"./github.5a3bc884.js";import{l as a}from"./chunk-MPX6TMFQ.a406c4b8.js";import"react";import"./index.93441784.js";const b=void 0,f=[{id:"import",text:"Import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"usevumeterprops",text:"UseVuMeterProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],g="useVuMeter";function i(t){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},t.components);return r(o,{children:[r(e.h1,{id:"usevumeter",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usevumeter",children:"#"}),n(e.code,{children:"useVuMeter"})]}),`
`,n(e.p,{children:"A Hook for obtaining audio volume levels"}),`
`,r(a,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useVuMeter.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(c,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"View Source"})]}),`
`,r(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(l,{code:"import { useVuMeter, type UseVuMeterProps } from 'echo-ui'"}),`
`,r(e.h2,{id:"parameters",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,r(e.h3,{id:"usevumeterprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usevumeterprops",children:"#"}),n(e.code,{children:"UseVuMeterProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"value"})," (required): ",n(e.code,{children:"number | number[]"})]}),`
`,n(e.p,{children:"The initial volume level. When an array is passed, it represents stereo, with the first value for the left channel and the second for the right channel; when a number is passed, it represents mono (Recommended range: -60 ~ 10)."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onReady"}),": ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["The callback function when ",n(e.code,{children:"meter"})," is initialized"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onError"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"The callback function when an error occurs inside the hook"}),`
`]}),`
`]}),`
`,r(e.h2,{id:"return-value",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-value",children:"#"}),"Return Value"]}),`
`,r(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"init"}),": ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["Calling this method can initialize ",n(e.code,{children:"meter"}),". After the initialization is completed, the ",n(e.code,{children:"onReady"})," callback function will be called."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"meter"}),": ",n(e.code,{children:"React.MutableRefObject<Tone.Split | null> | React.MutableRefObject<Tone.Meter | null>"})]}),`
`,r(e.p,{children:["Initially constructed ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Meter",target:"_blank",rel:"nofollow",children:"Tone.Meter"}),"(Mono) or ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Split",target:"_blank",rel:"nofollow",children:"Tone.Split"}),"(Stereo) instances. Need to use ",n(e.code,{children:".current"})," to obtain."]}),`
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
`,n(e.p,{children:"The error message if an error occurs."}),`
`]}),`
`]})]})}function v(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(i,t)})):i(t)}const M="2024/1/31 15:22:24",k=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
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
- **onReady**: \`() => void\`\r
\r
  The callback function when \`meter\` is initialized\r
\r
- **onError**: \`() => void\`\r
\r
  The callback function when an error occurs inside the hook\r
\r
## Return Value\r
\r
### \`Object\`\r
\r
- **init**: \`() => void\`\r
\r
  Calling this method can initialize \`meter\`. After the initialization is completed, the \`onReady\` callback function will be called.\r
\r
- **meter**: \`React.MutableRefObject<Tone.Split | null> | React.MutableRefObject<Tone.Meter | null>\`\r
\r
  Initially constructed [Tone.Meter](https://tonejs.github.io/docs/14.7.77/Meter)(Mono) or [Tone.Split](https://tonejs.github.io/docs/14.7.77/Split)(Stereo) instances. Need to use \`.current\` to obtain.\r
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
`;export{k as content,v as default,b as frontmatter,M as lastUpdatedTime,g as title,f as toc};
