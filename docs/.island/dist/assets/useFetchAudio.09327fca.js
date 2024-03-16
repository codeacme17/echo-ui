import{jsx as n,jsxs as r,Fragment as i}from"react/jsx-runtime";import{C as c}from"./CodeBlock.d8e569ad.js";import{G as d}from"./github.5a3bc884.js";import{l as h}from"./chunk-MPX6TMFQ.a406c4b8.js";import"react";import"./index.93441784.js";const m=void 0,b=[{id:"import",text:"Import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"usefetchaudioprops",text:"UseFetchAudioProps",depth:3},{id:"return-value",text:"Return Value",depth:2},{id:"object",text:"Object",depth:3}],g="useFetchAudio";function o(t){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},t.components);return r(i,{children:[r(e.h1,{id:"usefetchaudio",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usefetchaudio",children:"#"}),n(e.code,{children:"useFetchAudio"})]}),`
`,n(e.p,{children:"A Hook for fetching audio data, returns an object containing the request status and audio data."}),`
`,r(h,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useFetchAudio.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(d,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"View Source"})]}),`
`,r(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(c,{code:"import { useFetchAudio, type UseFetchAudioProps } form 'echo-ui'"}),`
`,r(e.h2,{id:"parameters",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,r(e.h3,{id:"usefetchaudioprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usefetchaudioprops",children:"#"}),n(e.code,{children:"UseFetchAudioProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"url"})," (required): ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"The URL to request, can be a relative or absolute URL."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"requestOptions"}),": ",n(e.code,{children:"RequestInit"})]}),`
`,r(e.p,{children:["The request configuration, refer to ",n(e.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/fetch#options",target:"_blank",rel:"nofollow",children:"MDN"}),"."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onSuccess"}),": ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["Callback function when the request is successful, when ",n(e.code,{children:"audioBuffer"})," has been successfully decoded."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onError"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Callback function when request error."}),`
`]}),`
`]}),`
`,r(e.h2,{id:"return-value",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-value",children:"#"}),"Return Value"]}),`
`,r(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"fetchAudio"}),": ",n(e.code,{children:"() => Promise<void>"})]}),`
`,n(e.p,{children:"Method to request audio data. After calling, the request will be initiated."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"audioBuffer"}),": ",n(e.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer",target:"_blank",rel:"nofollow",children:n(e.code,{children:"AudioBuffer"})})]}),`
`,n(e.p,{children:"The audio data returned by the request."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"pending"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Indicates whether the request is pending."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"fetched"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Indicates whether the request has been completed."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Indicates whether there was an error in the request."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"The error message in case of a request error."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"response"}),": ",n(e.code,{children:"Response"})]}),`
`,n(e.p,{children:"The complete response of the request."}),`
`]}),`
`]})]})}function q(t={}){const{wrapper:e}=t.components||{};return e?n(e,Object.assign({},t,{children:n(o,t)})):o(t)}const A="2024/1/24 14:13:17",w=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Chip, Link } from '@nextui-org/react'
import { Github } from 'lucide-react'

# \`useFetchAudio\`

A Hook for fetching audio data, returns an object containing the request status and audio data.

<Link
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useFetchAudio.ts"
  target="_blank"
  size="sm"
  className="flex items-center"
>
  <Github className="w-4 h-4" />
  <span className="ml-2">View Source</span>
</Link>

## Import

<CodeBlock code={\`import { useFetchAudio, type UseFetchAudioProps } form 'echo-ui'\`} />

## Parameters

### \`UseFetchAudioProps\`

- **url** (required): \`string\`

  The URL to request, can be a relative or absolute URL.

- **requestOptions**: \`RequestInit\`

  The request configuration, refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options).

- **onSuccess**: \`() => void\`

  Callback function when the request is successful, when \`audioBuffer\` has been successfully decoded.

- **onError**: \`() => void\`

  Callback function when request error.

## Return Value

### \`Object\`

- **fetchAudio**: \`() => Promise<void>\`

  Method to request audio data. After calling, the request will be initiated.

- **audioBuffer**: [\`AudioBuffer\`](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer)

  The audio data returned by the request.

- **pending**: \`boolean\`

  Indicates whether the request is pending.

- **fetched**: \`boolean\`

  Indicates whether the request has been completed.

- **error**: \`boolean\`

  Indicates whether there was an error in the request.

- **errorMessage**: \`string\`

  The error message in case of a request error.

- **response**: \`Response\`

  The complete response of the request.
`;export{w as content,q as default,m as frontmatter,A as lastUpdatedTime,g as title,b as toc};
