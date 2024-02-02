import{jsx as n,jsxs as i,Fragment as t}from"react/jsx-runtime";import{C as c}from"./CodeBlock.de027be4.js";import{G as a}from"./github.54c71331.js";import{l}from"./chunk-MPX6TMFQ.dc1d8ff0.js";import"react";import"./index.2d091e0a.js";const g=void 0,f=[{id:"import",text:"import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"useoscilloscopeprops",text:"UseOscilloscopeProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],b="useOscilloscope";function o(r){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},r.components);return i(t,{children:[i(e.h1,{id:"useoscilloscope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#useoscilloscope",children:"#"}),n(e.code,{children:"useOscilloscope"})]}),`
`,n(e.p,{children:"A hook for creating an oscilloscope, which can obtain real-time amplitude data."}),`
`,i(l,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useOscilloscope.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(a,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"View Source"})]}),`
`,i(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"import"]}),`
`,n(c,{code:"import { useOscilloscope, type UseOscilloscopeProps } from 'echo-ui'"}),`
`,i(e.h2,{id:"parameters",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,i(e.h3,{id:"useoscilloscopeprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#useoscilloscopeprops",children:"#"}),n(e.code,{children:"UseOscilloscopeProps"})]}),`
`,i(e.ul,{children:[`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"fftSize"}),": ",n(e.code,{children:"number"})]}),`
`,i(e.p,{children:["The size of FFT, which must be a power of 2. The default is ",n(e.code,{children:"1024"})," (range: 16 ~ 16384)."]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"onReady"}),": ",n(e.code,{children:"() => void"})]}),`
`,i(e.p,{children:["A callback function that is called when the ",n(e.code,{children:"analyser"})," is initialized."]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"onError"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"A callback function that is called when an error occurs inside the hook."}),`
`]}),`
`]}),`
`,i(e.h2,{id:"return-value",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-value",children:"#"}),"Return Value"]}),`
`,i(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,i(e.ul,{children:[`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"init"})," : ",n(e.code,{children:"() => void"})]}),`
`,i(e.p,{children:["Calling this method initializes the ",n(e.code,{children:"analyser"}),". After initialization, the ",n(e.code,{children:"onReady"})," callback function will be called."]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"analyser"})," : ",n(e.code,{children:"React.MutableRefObject<Tone.Analyser | null>"})]}),`
`,i(e.p,{children:["After initialization, a ",n(e.code,{children:"waveform"})," type analyzer ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Analyser",target:"_blank",rel:"nofollow",children:"Tone.Analyser"})," instance is constructed. Need to use ",n(e.code,{children:".current"})," to obtain."]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"data"})," : ",n(e.code,{children:"SpectrogramDataPoint[]"})]}),`
`,i(e.p,{children:["Spectrogram data. You can obtain it periodically through ",n(e.code,{children:"getData"})," or automatically start monitoring using the ",n(e.code,{children:"observe"})," method."]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"getData"})," : ",n(e.code,{children:"() => void"})]}),`
`,i(e.p,{children:["To obtain the spectrogram data. After calling, the value of ",n(e.code,{children:"data"})," will be updated. It can be called using a timer or ",n(e.code,{children:"requestAnimationFrame"}),"."]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"observe"})," : ",n(e.code,{children:"(callback: () => void) => void"})]}),`
`,n(e.p,{children:"To monitor changes in oscilloscope data. Using this function starts monitoring and gets real-time updates of data."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"cancelObserve"})," : ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"To cancel monitoring."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Indicates whether an error has occurred."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"The error message in case of an error."}),`
`]}),`
`]})]})}function k(r={}){const{wrapper:e}=r.components||{};return e?n(e,Object.assign({},r,{children:n(o,r)})):o(r)}const v="2024/1/31 15:22:24",y=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Chip, Link } from '@nextui-org/react'
import { Github } from 'lucide-react'

# \`useOscilloscope\`

A hook for creating an oscilloscope, which can obtain real-time amplitude data.

<Link
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useOscilloscope.ts"
  target="_blank"
  size="sm"
  className="flex items-center"
>
  <Github className="w-4 h-4" />
  <span className="ml-2">View Source</span>
</Link>

## import

<CodeBlock code={\`import { useOscilloscope, type UseOscilloscopeProps } from 'echo-ui'\`} />

## Parameters

### \`UseOscilloscopeProps\`

- **fftSize**: \`number\`

  The size of FFT, which must be a power of 2. The default is \`1024\` (range: 16 ~ 16384).

- **onReady**: \`() => void\`

  A callback function that is called when the \`analyser\` is initialized.

- **onError**: \`() => void\`

  A callback function that is called when an error occurs inside the hook.

## Return Value

### \`Object\`

- **init** : \`() => void\`

  Calling this method initializes the \`analyser\`. After initialization, the \`onReady\` callback function will be called.

- **analyser** : \`React.MutableRefObject<Tone.Analyser | null>\`

  After initialization, a \`waveform\` type analyzer [Tone.Analyser](https://tonejs.github.io/docs/14.7.77/Analyser) instance is constructed. Need to use \`.current\` to obtain.

- **data** : \`SpectrogramDataPoint[]\`

  Spectrogram data. You can obtain it periodically through \`getData\` or automatically start monitoring using the \`observe\` method.

- **getData** : \`() => void\`

  To obtain the spectrogram data. After calling, the value of \`data\` will be updated. It can be called using a timer or \`requestAnimationFrame\`.

- **observe** : \`(callback: () => void) => void\`

  To monitor changes in oscilloscope data. Using this function starts monitoring and gets real-time updates of data.

- **cancelObserve** : \`() => void\`

  To cancel monitoring.

- **error**: \`boolean\`

  Indicates whether an error has occurred.

- **errorMessage**: \`string\`

  The error message in case of an error.
`;export{y as content,k as default,g as frontmatter,v as lastUpdatedTime,b as title,f as toc};
