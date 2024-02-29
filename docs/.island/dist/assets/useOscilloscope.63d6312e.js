import{jsx as n,jsxs as r,Fragment as t}from"react/jsx-runtime";import{C as c}from"./CodeBlock.de027be4.js";import{G as a}from"./github.54c71331.js";import{l}from"./chunk-MPX6TMFQ.dc1d8ff0.js";import"react";import"./index.2d091e0a.js";const g=void 0,f=[{id:"import",text:"import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"useoscilloscopeprops",text:"UseOscilloscopeProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],b="useOscilloscope";function o(i){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},i.components);return r(t,{children:[r(e.h1,{id:"useoscilloscope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#useoscilloscope",children:"#"}),n(e.code,{children:"useOscilloscope"})]}),`
`,n(e.p,{children:"A hook for creating an oscilloscope, which can obtain real-time amplitude data."}),`
`,r(l,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useOscilloscope.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(a,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"View Source"})]}),`
`,r(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"import"]}),`
`,n(c,{code:"import { useOscilloscope, type UseOscilloscopeProps } from 'echo-ui'"}),`
`,r(e.h2,{id:"parameters",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,r(e.h3,{id:"useoscilloscopeprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#useoscilloscopeprops",children:"#"}),n(e.code,{children:"UseOscilloscopeProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"fftSize"}),": ",n(e.code,{children:"number"})]}),`
`,r(e.p,{children:["The size of FFT, which must be a power of 2. The default is ",n(e.code,{children:"1024"})," (range: 16 ~ 16384)."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onReady"}),": ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["A callback function that is called when the ",n(e.code,{children:"analyser"})," is initialized."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onError"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"A callback function that is called when an error occurs inside the hook."}),`
`]}),`
`]}),`
`,r(e.h2,{id:"return-value",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-value",children:"#"}),"Return Value"]}),`
`,r(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"init"})," : ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["Calling this method initializes the ",n(e.code,{children:"analyser"}),". After initialization, the ",n(e.code,{children:"onReady"})," callback function will be called."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"analyser"})," : ",n(e.code,{children:"React.MutableRefObject<Tone.Analyser | null>"})]}),`
`,r(e.p,{children:["After initialization, a ",n(e.code,{children:"waveform"})," type analyzer ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Analyser",target:"_blank",rel:"nofollow",children:"Tone.Analyser"})," instance is constructed. Need to use ",n(e.code,{children:".current"})," to obtain."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"data"})," : ",n(e.code,{children:"SpectrogramDataPoint[]"})]}),`
`,r(e.p,{children:["Spectrogram data. You can obtain it periodically through ",n(e.code,{children:"getData"})," or automatically start monitoring using the ",n(e.code,{children:"observe"})," method."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"getData"})," : ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["To obtain the spectrogram data. After calling, the value of ",n(e.code,{children:"data"})," will be updated. It can be called using a timer or ",n(e.code,{children:"requestAnimationFrame"}),"."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"observe"})," : ",n(e.code,{children:"(callback: () => void) => void"})]}),`
`,n(e.p,{children:"To monitor changes in oscilloscope data. Using this function starts monitoring and gets real-time updates of data."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"cancelObserve"})," : ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"To cancel monitoring."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Indicates whether an error has occurred."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"The error message in case of an error."}),`
`]}),`
`]})]})}function k(i={}){const{wrapper:e}=i.components||{};return e?n(e,Object.assign({},i,{children:n(o,i)})):o(i)}const v="2024/1/31 15:22:24",y=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Chip, Link } from '@nextui-org/react'\r
import { Github } from 'lucide-react'\r
\r
# \`useOscilloscope\`\r
\r
A hook for creating an oscilloscope, which can obtain real-time amplitude data.\r
\r
<Link\r
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useOscilloscope.ts"\r
  target="_blank"\r
  size="sm"\r
  className="flex items-center"\r
>\r
  <Github className="w-4 h-4" />\r
  <span className="ml-2">View Source</span>\r
</Link>\r
\r
## import\r
\r
<CodeBlock code={\`import { useOscilloscope, type UseOscilloscopeProps } from 'echo-ui'\`} />\r
\r
## Parameters\r
\r
### \`UseOscilloscopeProps\`\r
\r
- **fftSize**: \`number\`\r
\r
  The size of FFT, which must be a power of 2. The default is \`1024\` (range: 16 ~ 16384).\r
\r
- **onReady**: \`() => void\`\r
\r
  A callback function that is called when the \`analyser\` is initialized.\r
\r
- **onError**: \`() => void\`\r
\r
  A callback function that is called when an error occurs inside the hook.\r
\r
## Return Value\r
\r
### \`Object\`\r
\r
- **init** : \`() => void\`\r
\r
  Calling this method initializes the \`analyser\`. After initialization, the \`onReady\` callback function will be called.\r
\r
- **analyser** : \`React.MutableRefObject<Tone.Analyser | null>\`\r
\r
  After initialization, a \`waveform\` type analyzer [Tone.Analyser](https://tonejs.github.io/docs/14.7.77/Analyser) instance is constructed. Need to use \`.current\` to obtain.\r
\r
- **data** : \`SpectrogramDataPoint[]\`\r
\r
  Spectrogram data. You can obtain it periodically through \`getData\` or automatically start monitoring using the \`observe\` method.\r
\r
- **getData** : \`() => void\`\r
\r
  To obtain the spectrogram data. After calling, the value of \`data\` will be updated. It can be called using a timer or \`requestAnimationFrame\`.\r
\r
- **observe** : \`(callback: () => void) => void\`\r
\r
  To monitor changes in oscilloscope data. Using this function starts monitoring and gets real-time updates of data.\r
\r
- **cancelObserve** : \`() => void\`\r
\r
  To cancel monitoring.\r
\r
- **error**: \`boolean\`\r
\r
  Indicates whether an error has occurred.\r
\r
- **errorMessage**: \`string\`\r
\r
  The error message in case of an error.\r
`;export{y as content,k as default,g as frontmatter,v as lastUpdatedTime,b as title,f as toc};
