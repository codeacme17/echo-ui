import{jsx as n,jsxs as r,Fragment as i}from"react/jsx-runtime";import{C as o}from"./CodeBlock.d8e569ad.js";import{G as c}from"./github.5a3bc884.js";import{l as d}from"./chunk-MPX6TMFQ.a406c4b8.js";import"react";import"./index.93441784.js";const g=void 0,f=[{id:"import",text:"Import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"usespectrogramprops",text:"UseSpectrogramProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],b="useSpectrogram";function a(t){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},t.components);return r(i,{children:[r(e.h1,{id:"usespectrogram",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usespectrogram",children:"#"}),n(e.code,{children:"useSpectrogram"})]}),`
`,n(e.p,{children:"This hook can be used to generate a spectrogram for audio."}),`
`,r(d,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useSpectrogram.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(c,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"View Source"})]}),`
`,r(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(o,{code:"import { useSpectrogram, type UseSpectrogramProps } from 'echo-ui'"}),`
`,r(e.h2,{id:"parameters",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,r(e.h3,{id:"usespectrogramprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usespectrogramprops",children:"#"}),n(e.code,{children:"UseSpectrogramProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"fftSize"})," : ",n(e.code,{children:"number"})]}),`
`,r(e.p,{children:["The size of FFT, must be a power of 2, default to ",n(e.code,{children:"1024"})," (range: 16 ~ 16384)."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onReady"}),": ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["The callback function when ",n(e.code,{children:"analyser"})," is initialized"]}),`
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
`,r(e.p,{children:[n(e.strong,{children:"init"})," : ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["Calling this method can initialize ",n(e.code,{children:"analyser"}),", and the ",n(e.code,{children:"onReady"})," callback function will be called after the initialization is completed."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"analyser"})," : ",n(e.code,{children:"React.MutableRefObject<Tone.Analyser | null>"})]}),`
`,r(e.p,{children:["Instance of ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Analyser",target:"_blank",rel:"nofollow",children:"Tone.Analyser"})," constructed after initialization. Need to use ",n(e.code,{children:".current"})," to obtain."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"data"})," : ",n(e.code,{children:"SpectrogramDataPoint[]"})]}),`
`,r(e.p,{children:["Spectrogram data, which can be obtained periodically through ",n(e.code,{children:"getData"})," or automatically by using the ",n(e.code,{children:"observe"})," method."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"getData"})," : ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["Retrieves the spectrogram data. After calling, it updates the value of ",n(e.code,{children:"data"}),", which can be called using a timer or ",n(e.code,{children:"requestAnimationFrame"}),"."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"observe"})," : ",n(e.code,{children:"(callback: () => void) => void"})]}),`
`,r(e.p,{children:["Listens for changes in the spectrogram data. Use this function to start monitoring and get real-time updates of ",n(e.code,{children:"data"}),"."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"cancelObserve"})," : ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Cancels the monitoring."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether an error has occurred."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"The error message if an error occurs."}),`
`]}),`
`]})]})}function k(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(a,t)})):a(t)}const v="2024/1/31 15:22:24",y=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Chip, Link } from '@nextui-org/react'
import { Github } from 'lucide-react'

# \`useSpectrogram\`

This hook can be used to generate a spectrogram for audio.

<Link
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useSpectrogram.ts"
  target="_blank"
  size="sm"
  className="flex items-center"
>
  <Github className="w-4 h-4" />
  <span className="ml-2">View Source</span>
</Link>

## Import

<CodeBlock code={\`import { useSpectrogram, type UseSpectrogramProps } from 'echo-ui'\`} />

## Parameters

### \`UseSpectrogramProps\`

- **fftSize** : \`number\`

  The size of FFT, must be a power of 2, default to \`1024\` (range: 16 ~ 16384).

- **onReady**: \`() => void\`

  The callback function when \`analyser\` is initialized

- **onError**: \`() => void\`

  The callback function when an error occurs inside the hook

## Return Value

### \`Object\`

- **init** : \`() => void\`

  Calling this method can initialize \`analyser\`, and the \`onReady\` callback function will be called after the initialization is completed.

- **analyser** : \`React.MutableRefObject<Tone.Analyser | null>\`

  Instance of [Tone.Analyser](https://tonejs.github.io/docs/14.7.77/Analyser) constructed after initialization. Need to use \`.current\` to obtain.

- **data** : \`SpectrogramDataPoint[]\`

  Spectrogram data, which can be obtained periodically through \`getData\` or automatically by using the \`observe\` method.

- **getData** : \`() => void\`

  Retrieves the spectrogram data. After calling, it updates the value of \`data\`, which can be called using a timer or \`requestAnimationFrame\`.

- **observe** : \`(callback: () => void) => void\`

  Listens for changes in the spectrogram data. Use this function to start monitoring and get real-time updates of \`data\`.

- **cancelObserve** : \`() => void\`

  Cancels the monitoring.

- **error**: \`boolean\`

  Whether an error has occurred.

- **errorMessage**: \`string\`

  The error message if an error occurs.
`;export{y as content,k as default,g as frontmatter,v as lastUpdatedTime,b as title,f as toc};
