import{jsx as r,jsxs as n,Fragment as i}from"react/jsx-runtime";import{C as c}from"./CodeBlock.988145ba.js";import{l as d,G as h}from"./github.204dd0d2.js";import"./createLucideIcon.6491784f.js";import"react";const m=void 0,f=[{id:"import",text:"Import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"usefetchaudioprops",text:"UseFetchAudioProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],g="useFetchAudio";function o(t){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},t.components);return n(i,{children:[n(e.h1,{id:"usefetchaudio",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usefetchaudio",children:"#"}),r(e.code,{children:"useFetchAudio"})]}),`
`,r(e.p,{children:"A Hook for fetching audio data, returns an object containing the request status and audio data."}),`
`,n(d,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useFetchAudio.ts",target:"_blank",size:"sm",className:"flex items-center",children:[r(h,{className:"w-4 h-4"}),r("span",{className:"ml-2",children:"View Source"})]}),`
`,n(e.h2,{id:"import",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,r(c,{code:"import { useFetchAudio, type UseFetchAudioProps } form 'echo-ui'"}),`
`,n(e.h2,{id:"parameters",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,n(e.h3,{id:"usefetchaudioprops",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usefetchaudioprops",children:"#"}),r(e.code,{children:"UseFetchAudioProps"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"url"})," (required): ",r(e.code,{children:"string"})]}),`
`,r(e.p,{children:"The URL to request, can be a relative or absolute URL."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"requestOptions"}),": ",r(e.code,{children:"RequestInit"})]}),`
`,n(e.p,{children:["The request configuration, refer to ",r(e.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/fetch#options",target:"_blank",rel:"nofollow",children:"MDN"}),"."]}),`
`]}),`
`]}),`
`,n(e.h2,{id:"return-value",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-value",children:"#"}),"Return Value"]}),`
`,n(e.h3,{id:"object",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),r(e.code,{children:"Object"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"audioBuffer"}),": ",r(e.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer",target:"_blank",rel:"nofollow",children:r(e.code,{children:"AudioBuffer"})})]}),`
`,r(e.p,{children:"The audio data returned by the request."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"pending"}),": ",r(e.code,{children:"boolean"})]}),`
`,r(e.p,{children:"Indicates whether the request is pending."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"fetched"}),": ",r(e.code,{children:"boolean"})]}),`
`,r(e.p,{children:"Indicates whether the request has been completed."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"error"}),": ",r(e.code,{children:"boolean"})]}),`
`,r(e.p,{children:"Indicates whether there was an error in the request."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"errorMessage"}),": ",r(e.code,{children:"string"})]}),`
`,r(e.p,{children:"The error message in case of a request error."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"response"}),": ",r(e.code,{children:"Response"})]}),`
`,r(e.p,{children:"The complete response of the request."}),`
`]}),`
`]})]})}function b(t={}){const{wrapper:e}=t.components||{};return e?r(e,Object.assign({},t,{children:r(o,t)})):o(t)}const q="2024/1/17 09:08:44",A=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Chip, Link } from '@nextui-org/react'\r
import { Github } from 'lucide-react'\r
\r
# \`useFetchAudio\`\r
\r
A Hook for fetching audio data, returns an object containing the request status and audio data.\r
\r
<Link\r
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useFetchAudio.ts"\r
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
<CodeBlock code={\`import { useFetchAudio, type UseFetchAudioProps } form 'echo-ui'\`} />\r
\r
## Parameters\r
\r
### \`UseFetchAudioProps\`\r
\r
- **url** (required): \`string\`\r
\r
  The URL to request, can be a relative or absolute URL.\r
\r
- **requestOptions**: \`RequestInit\`\r
\r
  The request configuration, refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options).\r
\r
## Return Value\r
\r
### \`Object\`\r
\r
- **audioBuffer**: [\`AudioBuffer\`](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer)\r
\r
  The audio data returned by the request.\r
\r
- **pending**: \`boolean\`\r
\r
  Indicates whether the request is pending.\r
\r
- **fetched**: \`boolean\`\r
\r
  Indicates whether the request has been completed.\r
\r
- **error**: \`boolean\`\r
\r
  Indicates whether there was an error in the request.\r
\r
- **errorMessage**: \`string\`\r
\r
  The error message in case of a request error.\r
\r
- **response**: \`Response\`\r
\r
  The complete response of the request.\r
`;export{A as content,b as default,m as frontmatter,q as lastUpdatedTime,g as title,f as toc};