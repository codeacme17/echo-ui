import{jsx as n,jsxs as r,Fragment as c}from"react/jsx-runtime";import{C as d}from"./CodeBlock.988145ba.js";import{l as t,G as h}from"./github.204dd0d2.js";import"./createLucideIcon.6491784f.js";import"react";const m=void 0,f=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4F20\u53C2",text:"\u4F20\u53C2",depth:2},{id:"usefetchaudioprops",text:"UseFetchAudioProps",depth:3},{id:"\u8FD4\u56DE\u503C",text:"\u8FD4\u56DE\u503C",depth:2},{id:"object",text:"Object",depth:3}],g="useFetchAudio";function i(o){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},o.components);return r(c,{children:[r(e.h1,{id:"usefetchaudio",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usefetchaudio",children:"#"}),n(e.code,{children:"useFetchAudio"})]}),`
`,n(e.p,{children:"\u7528\u4E8E\u8BF7\u6C42\u97F3\u9891\u6570\u636E\u7684 Hook, \u8FD4\u56DE\u4E00\u4E2A\u5BF9\u8C61\uFF0C\u5305\u542B\u8BF7\u6C42\u7684\u72B6\u6001\u548C\u97F3\u9891\u6570\u636E"}),`
`,r(t,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useFetchAudio.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(h,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"\u67E5\u770B\u6E90\u7801"})]}),`
`,r(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(d,{code:"import { useFetchAudio, type UseFetchAudioProps } form 'echo-ui'"}),`
`,r(e.h2,{id:"\u4F20\u53C2",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4F20\u53C2",children:"#"}),"\u4F20\u53C2"]}),`
`,r(e.h3,{id:"usefetchaudioprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usefetchaudioprops",children:"#"}),n(e.code,{children:"UseFetchAudioProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"url"}),"(\u5FC5\u4F20): ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"\u8BF7\u6C42\u7684\u5730\u5740\uFF0C\u53EF\u4EE5\u4E3A\u76F8\u5BF9\u5730\u5740\u6216\u8005\u7F51\u7EDC\u5730\u5740"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"requestOptions"}),": ",n(e.code,{children:"RequestInit"})]}),`
`,r(e.p,{children:["\u8BF7\u6C42\u7684\u914D\u7F6E\uFF0C\u53C2\u8003 ",n(e.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/fetch#options",target:"_blank",rel:"nofollow",children:"MDN"})]}),`
`]}),`
`]}),`
`,r(e.h2,{id:"\u8FD4\u56DE\u503C",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FD4\u56DE\u503C",children:"#"}),"\u8FD4\u56DE\u503C"]}),`
`,r(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"audioBuffer"}),": ",n(e.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer",target:"_blank",rel:"nofollow",children:n(e.code,{children:"AudioBuffer"})})]}),`
`,n(e.p,{children:"\u8BF7\u6C42\u8FD4\u56DE\u7684\u97F3\u9891\u6570\u636E"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"pending"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"\u662F\u5426\u6B63\u5728\u8BF7\u6C42"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"fetched"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"\u662F\u5426\u5DF2\u7ECF\u8BF7\u6C42\u5B8C\u6210"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"\u662F\u5426\u8BF7\u6C42\u51FA\u9519"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"\u8BF7\u6C42\u51FA\u9519\u7684\u9519\u8BEF\u4FE1\u606F"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"response"}),": ",n(e.code,{children:"Response"})]}),`
`,n(e.p,{children:"\u8BF7\u6C42\u7684\u5B8C\u6574\u54CD\u5E94"}),`
`]}),`
`]})]})}function b(o={}){const{wrapper:e}=o.components||{};return e?n(e,Object.assign({},o,{children:n(i,o)})):i(o)}const A="2024/1/17 09:08:44",k=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Chip, Link } from '@nextui-org/react'\r
import { Github } from 'lucide-react'\r
\r
# \`useFetchAudio\`\r
\r
\u7528\u4E8E\u8BF7\u6C42\u97F3\u9891\u6570\u636E\u7684 Hook, \u8FD4\u56DE\u4E00\u4E2A\u5BF9\u8C61\uFF0C\u5305\u542B\u8BF7\u6C42\u7684\u72B6\u6001\u548C\u97F3\u9891\u6570\u636E\r
\r
<Link\r
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useFetchAudio.ts"\r
  target="_blank"\r
  size="sm"\r
  className="flex items-center"\r
>\r
  <Github className="w-4 h-4" />\r
  <span className="ml-2">\u67E5\u770B\u6E90\u7801</span>\r
</Link>\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { useFetchAudio, type UseFetchAudioProps } form 'echo-ui'\`} />\r
\r
## \u4F20\u53C2\r
\r
### \`UseFetchAudioProps\`\r
\r
- **url**(\u5FC5\u4F20): \`string\`\r
\r
  \u8BF7\u6C42\u7684\u5730\u5740\uFF0C\u53EF\u4EE5\u4E3A\u76F8\u5BF9\u5730\u5740\u6216\u8005\u7F51\u7EDC\u5730\u5740\r
\r
- **requestOptions**: \`RequestInit\`\r
\r
  \u8BF7\u6C42\u7684\u914D\u7F6E\uFF0C\u53C2\u8003 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)\r
\r
## \u8FD4\u56DE\u503C\r
\r
### \`Object\`\r
\r
- **audioBuffer**: [\`AudioBuffer\`](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer)\r
\r
  \u8BF7\u6C42\u8FD4\u56DE\u7684\u97F3\u9891\u6570\u636E\r
\r
- **pending**: \`boolean\`\r
\r
  \u662F\u5426\u6B63\u5728\u8BF7\u6C42\r
\r
- **fetched**: \`boolean\`\r
\r
  \u662F\u5426\u5DF2\u7ECF\u8BF7\u6C42\u5B8C\u6210\r
\r
- **error**: \`boolean\`\r
\r
  \u662F\u5426\u8BF7\u6C42\u51FA\u9519\r
\r
- **errorMessage**: \`string\`\r
\r
  \u8BF7\u6C42\u51FA\u9519\u7684\u9519\u8BEF\u4FE1\u606F\r
\r
- **response**: \`Response\`\r
\r
  \u8BF7\u6C42\u7684\u5B8C\u6574\u54CD\u5E94\r
`;export{k as content,b as default,m as frontmatter,A as lastUpdatedTime,g as title,f as toc};
