import{jsx as r,jsxs as n,Fragment as i}from"react/jsx-runtime";import"./createLucideIcon.6491784f.js";import"react";import{l as o,G as c}from"./github.204dd0d2.js";const m=void 0,u=[{id:"parameters",text:"Parameters",depth:2},{id:"usespectrogramprops",text:"UseSpectrogramProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],p="useSpectrogram";function a(t){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},t.components);return n(i,{children:[n(e.h1,{id:"usespectrogram",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usespectrogram",children:"#"}),r(e.code,{children:"useSpectrogram"})]}),`
`,r(e.p,{children:"This hook can be used to generate a spectrogram for audio."}),`
`,n(o,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useSpectrogram.ts",target:"_blank",size:"sm",className:"flex items-center",children:[r(c,{className:"w-4 h-4"}),r("span",{className:"ml-2",children:"View Source"})]}),`
`,n(e.h2,{id:"parameters",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,n(e.h3,{id:"usespectrogramprops",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usespectrogramprops",children:"#"}),r(e.code,{children:"UseSpectrogramProps"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"fftSize"})," : ",r(e.code,{children:"number"})]}),`
`,n(e.p,{children:["The size of FFT, must be a power of 2, default to ",r(e.code,{children:"1024"})," (range: 16 ~ 16384)."]}),`
`]}),`
`]}),`
`,n(e.h2,{id:"return-value",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-value",children:"#"}),"Return Value"]}),`
`,n(e.h3,{id:"object",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),r(e.code,{children:"Object"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"analyser"})," : ",r(e.code,{children:"Tone.Analyser"})]}),`
`,n(e.p,{children:["Instance of ",r(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Analyser",target:"_blank",rel:"nofollow",children:"Tone.Analyser"})," constructed after initialization"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"data"})," : ",r(e.code,{children:"SpectrogramDataPoint[]"})]}),`
`,n(e.p,{children:["Spectrogram data, which can be obtained periodically through ",r(e.code,{children:"getData"})," or automatically by using the ",r(e.code,{children:"observe"})," method."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"fftSize"})," : ",r(e.code,{children:"number"})]}),`
`,r(e.p,{children:"The size of FFT."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"getData"})," : ",r(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:["Retrieves the spectrogram data. After calling, it updates the value of ",r(e.code,{children:"data"}),", which can be called using a timer or ",r(e.code,{children:"requestAnimationFrame"}),"."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"setFftSize"})," : ",r(e.code,{children:"(fftSize: number) => void"})]}),`
`,r(e.p,{children:"Sets the size of FFT."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"observe"})," : ",r(e.code,{children:"(callback: () => void) => void"})]}),`
`,n(e.p,{children:["Listens for changes in the spectrogram data. Use this function to start monitoring and get real-time updates of ",r(e.code,{children:"data"}),"."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"cancelObserve"})," : ",r(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:"Cancels the monitoring."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"error"}),": ",r(e.code,{children:"boolean"})]}),`
`,r(e.p,{children:"Whether an error has occurred."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"errorMessage"}),": ",r(e.code,{children:"string"})]}),`
`,r(e.p,{children:"The error message if an error occurs."}),`
`]}),`
`]})]})}function g(t={}){const{wrapper:e}=t.components||{};return e?r(e,Object.assign({},t,{children:r(a,t)})):a(t)}const f="2024/1/19 14:45:33",b=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Chip, Link } from '@nextui-org/react'\r
import { Github } from 'lucide-react'\r
\r
# \`useSpectrogram\`\r
\r
This hook can be used to generate a spectrogram for audio.\r
\r
<Link\r
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useSpectrogram.ts"\r
  target="_blank"\r
  size="sm"\r
  className="flex items-center"\r
>\r
  <Github className="w-4 h-4" />\r
  <span className="ml-2">View Source</span>\r
</Link>\r
\r
## Parameters\r
\r
### \`UseSpectrogramProps\`\r
\r
- **fftSize** : \`number\`\r
\r
  The size of FFT, must be a power of 2, default to \`1024\` (range: 16 ~ 16384).\r
\r
## Return Value\r
\r
### \`Object\`\r
\r
- **analyser** : \`Tone.Analyser\`\r
\r
  Instance of [Tone.Analyser](https://tonejs.github.io/docs/14.7.77/Analyser) constructed after initialization\r
\r
- **data** : \`SpectrogramDataPoint[]\`\r
\r
  Spectrogram data, which can be obtained periodically through \`getData\` or automatically by using the \`observe\` method.\r
\r
- **fftSize** : \`number\`\r
\r
  The size of FFT.\r
\r
- **getData** : \`() => void\`\r
\r
  Retrieves the spectrogram data. After calling, it updates the value of \`data\`, which can be called using a timer or \`requestAnimationFrame\`.\r
\r
- **setFftSize** : \`(fftSize: number) => void\`\r
\r
  Sets the size of FFT.\r
\r
- **observe** : \`(callback: () => void) => void\`\r
\r
  Listens for changes in the spectrogram data. Use this function to start monitoring and get real-time updates of \`data\`.\r
\r
- **cancelObserve** : \`() => void\`\r
\r
  Cancels the monitoring.\r
\r
- **error**: \`boolean\`\r
\r
  Whether an error has occurred.\r
\r
- **errorMessage**: \`string\`\r
\r
  The error message if an error occurs.\r
`;export{b as content,g as default,m as frontmatter,f as lastUpdatedTime,p as title,u as toc};
