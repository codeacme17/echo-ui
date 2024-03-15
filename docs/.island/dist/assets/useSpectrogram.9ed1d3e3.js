import{jsx as r,jsxs as n,Fragment as i}from"react/jsx-runtime";import{C as d}from"./CodeBlock.d8e569ad.js";import{G as t}from"./github.5a3bc884.js";import{l as a}from"./chunk-MPX6TMFQ.a406c4b8.js";import"react";import"./index.93441784.js";const u=void 0,b=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4F20\u53C2",text:"\u4F20\u53C2",depth:2},{id:"usespectrogramprops",text:"UseSpectrogramProps",depth:3},{id:"\u8FD4\u56DE\u503C",text:"\u8FD4\u56DE\u503C",depth:2},{id:"object",text:"Object",depth:3}],f="useSpectrogram";function o(c){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},c.components);return n(i,{children:[n(e.h1,{id:"usespectrogram",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usespectrogram",children:"#"}),r(e.code,{children:"useSpectrogram"})]}),`
`,r(e.p,{children:"\u8BE5 hook \u53EF\u7528\u4E8E\u751F\u6210\u97F3\u9891\u7684\u9891\u8C31\u56FE"}),`
`,n(a,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useSpectrogram.ts",target:"_blank",size:"sm",className:"flex items-center",children:[r(t,{className:"w-4 h-4"}),r("span",{className:"ml-2",children:"\u67E5\u770B\u6E90\u7801"})]}),`
`,n(e.h2,{id:"\u5F15\u5165",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,r(d,{code:"import { useSpectrogram, type UseSpectrogramProps } from 'echo-ui'"}),`
`,n(e.h2,{id:"\u4F20\u53C2",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4F20\u53C2",children:"#"}),"\u4F20\u53C2"]}),`
`,n(e.h3,{id:"usespectrogramprops",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usespectrogramprops",children:"#"}),r(e.code,{children:"UseSpectrogramProps"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"fftSize"})," : ",r(e.code,{children:"number"})]}),`
`,n(e.p,{children:["FFT \u7684\u5927\u5C0F\uFF0C\u5FC5\u987B\u662F 2 \u7684\u5E42\u6B21\u65B9\uFF0C\u9ED8\u8BA4\u4E3A ",r(e.code,{children:"1024"})," (\u8303\u56F4\uFF1A 16 ~ 16384)"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"onReady"}),": ",r(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:["\u5F53 ",r(e.code,{children:"analyser"})," \u521D\u59CB\u5316\u5B8C\u6210\u540E\u7684\u56DE\u8C03\u51FD\u6570"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"onError"}),": ",r(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:"\u5F53 hook \u5185\u90E8\u51FA\u73B0\u9519\u8BEF\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`]}),`
`,n(e.h2,{id:"\u8FD4\u56DE\u503C",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FD4\u56DE\u503C",children:"#"}),"\u8FD4\u56DE\u503C"]}),`
`,n(e.h3,{id:"object",children:[r(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),r(e.code,{children:"Object"})]}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"init"})," : ",r(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:["\u8C03\u7528\u8BE5\u65B9\u6CD5\u53EF\u4EE5\u521D\u59CB\u5316 ",r(e.code,{children:"analyser"}),"\uFF0C\u5728\u521D\u59CB\u5316\u5B8C\u6210\u540E\u4F1A\u8C03\u7528 ",r(e.code,{children:"onReady"})," \u56DE\u8C03\u51FD\u6570"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"analyser"})," : ",r(e.code,{children:"React.MutableRefObject<Tone.Analyser | null>"})]}),`
`,n(e.p,{children:["\u521D\u59CB\u5316\u540E\u6784\u5EFA\u7C7B\u578B\u4E3A ",r(e.code,{children:"fft"})," \u7684\u5206\u6790\u5668 ",r(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Analyser",target:"_blank",rel:"nofollow",children:"Tone.Analyser"})," \u5B9E\u4F8B\uFF0C\u9700\u8981\u4F7F\u7528 ",r(e.code,{children:".current"})," \u83B7\u53D6"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"data"})," : ",r(e.code,{children:"SpectrogramDataPoint[]"})]}),`
`,n(e.p,{children:["\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u53EF\u4EE5\u81EA\u884C\u5B9A\u65F6\u901A\u8FC7 ",r(e.code,{children:"getData"})," \u83B7\u53D6\u6216\u8005\u4F7F\u7528 ",r(e.code,{children:"observe"})," \u65B9\u6CD5\u81EA\u52A8\u5F00\u542F\u76D1\u542C"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"getData"})," : ",r(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:["\u83B7\u53D6\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 ",r(e.code,{children:"data"})," \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 ",r(e.code,{children:"requestAnimationFrame"})," \u8FDB\u884C\u8C03\u7528"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"observe"})," : ",r(e.code,{children:"(callback: () => void) => void"})]}),`
`,r(e.p,{children:"\u76D1\u542C\u9891\u8C31\u56FE\u6570\u636E\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 data \u7684\u53D8\u5316"}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"cancelObserve"})," : ",r(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:"\u53D6\u6D88\u76D1\u542C"}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"error"}),": ",r(e.code,{children:"boolean"})]}),`
`,r(e.p,{children:"\u662F\u5426\u51FA\u73B0\u51FA\u9519"}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:[r(e.strong,{children:"errorMessage"}),": ",r(e.code,{children:"string"})]}),`
`,r(e.p,{children:"\u51FA\u9519\u7684\u9519\u8BEF\u4FE1\u606F"}),`
`]}),`
`]})]})}function k(c={}){const{wrapper:e}=c.components||{};return e?r(e,Object.assign({},c,{children:r(o,c)})):o(c)}const v="2024/1/31 15:22:24",y=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Chip, Link } from '@nextui-org/react'\r
import { Github } from 'lucide-react'\r
\r
# \`useSpectrogram\`\r
\r
\u8BE5 hook \u53EF\u7528\u4E8E\u751F\u6210\u97F3\u9891\u7684\u9891\u8C31\u56FE\r
\r
<Link\r
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useSpectrogram.ts"\r
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
<CodeBlock code={\`import { useSpectrogram, type UseSpectrogramProps } from 'echo-ui'\`} />\r
\r
## \u4F20\u53C2\r
\r
### \`UseSpectrogramProps\`\r
\r
- **fftSize** : \`number\`\r
\r
  FFT \u7684\u5927\u5C0F\uFF0C\u5FC5\u987B\u662F 2 \u7684\u5E42\u6B21\u65B9\uFF0C\u9ED8\u8BA4\u4E3A \`1024\` (\u8303\u56F4\uFF1A 16 ~ 16384)\r
\r
- **onReady**: \`() => void\`\r
\r
  \u5F53 \`analyser\` \u521D\u59CB\u5316\u5B8C\u6210\u540E\u7684\u56DE\u8C03\u51FD\u6570\r
\r
- **onError**: \`() => void\`\r
\r
  \u5F53 hook \u5185\u90E8\u51FA\u73B0\u9519\u8BEF\u65F6\u7684\u56DE\u8C03\u51FD\u6570\r
\r
## \u8FD4\u56DE\u503C\r
\r
### \`Object\`\r
\r
- **init** : \`() => void\`\r
\r
  \u8C03\u7528\u8BE5\u65B9\u6CD5\u53EF\u4EE5\u521D\u59CB\u5316 \`analyser\`\uFF0C\u5728\u521D\u59CB\u5316\u5B8C\u6210\u540E\u4F1A\u8C03\u7528 \`onReady\` \u56DE\u8C03\u51FD\u6570\r
\r
- **analyser** : \`React.MutableRefObject<Tone.Analyser | null>\`\r
\r
  \u521D\u59CB\u5316\u540E\u6784\u5EFA\u7C7B\u578B\u4E3A \`fft\` \u7684\u5206\u6790\u5668 [Tone.Analyser](https://tonejs.github.io/docs/14.7.77/Analyser) \u5B9E\u4F8B\uFF0C\u9700\u8981\u4F7F\u7528 \`.current\` \u83B7\u53D6\r
\r
- **data** : \`SpectrogramDataPoint[]\`\r
\r
  \u9891\u8C31\u56FE\u6570\u636E\uFF0C\u53EF\u4EE5\u81EA\u884C\u5B9A\u65F6\u901A\u8FC7 \`getData\` \u83B7\u53D6\u6216\u8005\u4F7F\u7528 \`observe\` \u65B9\u6CD5\u81EA\u52A8\u5F00\u542F\u76D1\u542C\r
\r
- **getData** : \`() => void\`\r
\r
  \u83B7\u53D6\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 \`data\` \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 \`requestAnimationFrame\` \u8FDB\u884C\u8C03\u7528\r
\r
- **observe** : \`(callback: () => void) => void\`\r
\r
  \u76D1\u542C\u9891\u8C31\u56FE\u6570\u636E\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 data \u7684\u53D8\u5316\r
\r
- **cancelObserve** : \`() => void\`\r
\r
  \u53D6\u6D88\u76D1\u542C\r
\r
- **error**: \`boolean\`\r
\r
  \u662F\u5426\u51FA\u73B0\u51FA\u9519\r
\r
- **errorMessage**: \`string\`\r
\r
  \u51FA\u9519\u7684\u9519\u8BEF\u4FE1\u606F\r
`;export{y as content,k as default,u as frontmatter,v as lastUpdatedTime,f as title,b as toc};
