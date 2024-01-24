import{jsx as r,jsxs as e,Fragment as o}from"react/jsx-runtime";import{C as d}from"./CodeBlock.913859b9.js";import{l as t,G as a}from"./github.6e7f8090.js";import"react";const m=void 0,g=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4F20\u53C2",text:"\u4F20\u53C2",depth:2},{id:"usespectrogramprops",text:"UseSpectrogramProps",depth:3},{id:"\u8FD4\u56DE\u503C",text:"\u8FD4\u56DE\u503C",depth:2},{id:"object",text:"Object",depth:3}],u="useSpectrogram";function i(c){const n=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},c.components);return e(o,{children:[e(n.h1,{id:"usespectrogram",children:[r(n.a,{className:"header-anchor","aria-hidden":"true",href:"#usespectrogram",children:"#"}),r(n.code,{children:"useSpectrogram"})]}),`
`,r(n.p,{children:"\u8BE5 hook \u53EF\u7528\u4E8E\u751F\u6210\u97F3\u9891\u7684\u9891\u8C31\u56FE"}),`
`,e(t,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useSpectrogram.ts",target:"_blank",size:"sm",className:"flex items-center",children:[r(a,{className:"w-4 h-4"}),r("span",{className:"ml-2",children:"\u67E5\u770B\u6E90\u7801"})]}),`
`,e(n.h2,{id:"\u5F15\u5165",children:[r(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,r(d,{code:"import { useSpectrogram, type UseSpectrogramProps } from 'echo-ui'"}),`
`,e(n.h2,{id:"\u4F20\u53C2",children:[r(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4F20\u53C2",children:"#"}),"\u4F20\u53C2"]}),`
`,e(n.h3,{id:"usespectrogramprops",children:[r(n.a,{className:"header-anchor","aria-hidden":"true",href:"#usespectrogramprops",children:"#"}),r(n.code,{children:"UseSpectrogramProps"})]}),`
`,e(n.ul,{children:[`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"fftSize"})," : ",r(n.code,{children:"number"})]}),`
`,e(n.p,{children:["FFT \u7684\u5927\u5C0F\uFF0C\u5FC5\u987B\u662F 2 \u7684\u5E42\u6B21\u65B9\uFF0C\u9ED8\u8BA4\u4E3A ",r(n.code,{children:"1024"})," (\u8303\u56F4\uFF1A 16 ~ 16384)"]}),`
`]}),`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"onReady"}),": ",r(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:["\u5F53 ",r(n.code,{children:"analyser"})," \u521D\u59CB\u5316\u5B8C\u6210\u540E\u7684\u56DE\u8C03\u51FD\u6570"]}),`
`]}),`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"onError"}),": ",r(n.code,{children:"() => void"})]}),`
`,r(n.p,{children:"\u5F53 hook \u5185\u90E8\u51FA\u73B0\u9519\u8BEF\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`]}),`
`,e(n.h2,{id:"\u8FD4\u56DE\u503C",children:[r(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FD4\u56DE\u503C",children:"#"}),"\u8FD4\u56DE\u503C"]}),`
`,e(n.h3,{id:"object",children:[r(n.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),r(n.code,{children:"Object"})]}),`
`,e(n.ul,{children:[`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"init"})," : ",r(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:["\u8C03\u7528\u8BE5\u65B9\u6CD5\u53EF\u4EE5\u521D\u59CB\u5316 ",r(n.code,{children:"analyser"}),"\uFF0C\u5728\u521D\u59CB\u5316\u5B8C\u6210\u540E\u4F1A\u8C03\u7528 ",r(n.code,{children:"onReady"})," \u56DE\u8C03\u51FD\u6570"]}),`
`]}),`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"analyser"})," : ",r(n.code,{children:"Tone.Analyser"})]}),`
`,e(n.p,{children:["\u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684 ",r(n.a,{href:"https://tonejs.github.io/docs/14.7.77/Analyser",target:"_blank",rel:"nofollow",children:"Tone.Analyser"})," \u5B9E\u4F8B"]}),`
`]}),`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"data"})," : ",r(n.code,{children:"SpectrogramDataPoint[]"})]}),`
`,e(n.p,{children:["\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u53EF\u4EE5\u81EA\u884C\u5B9A\u65F6\u901A\u8FC7 ",r(n.code,{children:"getData"})," \u83B7\u53D6\u6216\u8005\u4F7F\u7528 ",r(n.code,{children:"observe"})," \u65B9\u6CD5\u81EA\u52A8\u5F00\u542F\u76D1\u542C"]}),`
`]}),`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"fftSize"})," : ",r(n.code,{children:"number"})]}),`
`,r(n.p,{children:"FFT \u7684\u5927\u5C0F"}),`
`]}),`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"getData"})," : ",r(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:["\u83B7\u53D6\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 ",r(n.code,{children:"data"})," \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 ",r(n.code,{children:"requestAnimationFrame"})," \u8FDB\u884C\u8C03\u7528"]}),`
`]}),`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"setFftSize"})," : ",r(n.code,{children:"(fftSize: number) => void"})]}),`
`,r(n.p,{children:"\u8BBE\u7F6E FFT \u7684\u5927\u5C0F"}),`
`]}),`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"observe"})," : ",r(n.code,{children:"(callback: () => void) => void"})]}),`
`,r(n.p,{children:"\u76D1\u542C\u9891\u8C31\u56FE\u6570\u636E\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 data \u7684\u53D8\u5316"}),`
`]}),`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"cancelObserve"})," : ",r(n.code,{children:"() => void"})]}),`
`,r(n.p,{children:"\u53D6\u6D88\u76D1\u542C"}),`
`]}),`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"error"}),": ",r(n.code,{children:"boolean"})]}),`
`,r(n.p,{children:"\u662F\u5426\u51FA\u73B0\u51FA\u9519"}),`
`]}),`
`,e(n.li,{children:[`
`,e(n.p,{children:[r(n.strong,{children:"errorMessage"}),": ",r(n.code,{children:"string"})]}),`
`,r(n.p,{children:"\u51FA\u9519\u7684\u9519\u8BEF\u4FE1\u606F"}),`
`]}),`
`]})]})}function f(c={}){const{wrapper:n}=c.components||{};return n?r(n,Object.assign({},c,{children:r(i,c)})):i(c)}const b="2024/1/24 15:43:27",v=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
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
- **analyser** : \`Tone.Analyser\`\r
\r
  \u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684 [Tone.Analyser](https://tonejs.github.io/docs/14.7.77/Analyser) \u5B9E\u4F8B\r
\r
- **data** : \`SpectrogramDataPoint[]\`\r
\r
  \u9891\u8C31\u56FE\u6570\u636E\uFF0C\u53EF\u4EE5\u81EA\u884C\u5B9A\u65F6\u901A\u8FC7 \`getData\` \u83B7\u53D6\u6216\u8005\u4F7F\u7528 \`observe\` \u65B9\u6CD5\u81EA\u52A8\u5F00\u542F\u76D1\u542C\r
\r
- **fftSize** : \`number\`\r
\r
  FFT \u7684\u5927\u5C0F\r
\r
- **getData** : \`() => void\`\r
\r
  \u83B7\u53D6\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 \`data\` \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 \`requestAnimationFrame\` \u8FDB\u884C\u8C03\u7528\r
\r
- **setFftSize** : \`(fftSize: number) => void\`\r
\r
  \u8BBE\u7F6E FFT \u7684\u5927\u5C0F\r
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
`;export{v as content,f as default,m as frontmatter,b as lastUpdatedTime,u as title,g as toc};
