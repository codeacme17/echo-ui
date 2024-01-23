import{jsx as n,jsxs as r,Fragment as o}from"react/jsx-runtime";import{C as t}from"./CodeBlock.69bc42b0.js";import{l as d,G as a}from"./github.b0bde753.js";import"react";const m=void 0,g=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4F20\u53C2",text:"\u4F20\u53C2",depth:2},{id:"usespectrogramprops",text:"UseSpectrogramProps",depth:3},{id:"\u8FD4\u56DE\u503C",text:"\u8FD4\u56DE\u503C",depth:2},{id:"object",text:"Object",depth:3}],u="useSpectrogram";function i(c){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},c.components);return r(o,{children:[r(e.h1,{id:"usespectrogram",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usespectrogram",children:"#"}),n(e.code,{children:"useSpectrogram"})]}),`
`,n(e.p,{children:"\u8BE5 hook \u53EF\u7528\u4E8E\u751F\u6210\u97F3\u9891\u7684\u9891\u8C31\u56FE"}),`
`,r(d,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useSpectrogram.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(a,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"\u67E5\u770B\u6E90\u7801"})]}),`
`,r(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(t,{code:"import { useSpectrogram, type UseSpectrogramProps } from 'echo-ui'"}),`
`,r(e.h2,{id:"\u4F20\u53C2",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4F20\u53C2",children:"#"}),"\u4F20\u53C2"]}),`
`,r(e.h3,{id:"usespectrogramprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#usespectrogramprops",children:"#"}),n(e.code,{children:"UseSpectrogramProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"fftSize"})," : ",n(e.code,{children:"number"})]}),`
`,r(e.p,{children:["FFT \u7684\u5927\u5C0F\uFF0C\u5FC5\u987B\u662F 2 \u7684\u5E42\u6B21\u65B9\uFF0C\u9ED8\u8BA4\u4E3A ",n(e.code,{children:"1024"})," (\u8303\u56F4\uFF1A 16 ~ 16384)"]}),`
`]}),`
`]}),`
`,r(e.h2,{id:"\u8FD4\u56DE\u503C",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FD4\u56DE\u503C",children:"#"}),"\u8FD4\u56DE\u503C"]}),`
`,r(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"analyser"})," : ",n(e.code,{children:"Tone.Analyser"})]}),`
`,r(e.p,{children:["\u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684 ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Analyser",target:"_blank",rel:"nofollow",children:"Tone.Analyser"})," \u5B9E\u4F8B"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"data"})," : ",n(e.code,{children:"SpectrogramDataPoint[]"})]}),`
`,r(e.p,{children:["\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u53EF\u4EE5\u81EA\u884C\u5B9A\u65F6\u901A\u8FC7 ",n(e.code,{children:"getData"})," \u83B7\u53D6\u6216\u8005\u4F7F\u7528 ",n(e.code,{children:"observe"})," \u65B9\u6CD5\u81EA\u52A8\u5F00\u542F\u76D1\u542C"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"fftSize"})," : ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"FFT \u7684\u5927\u5C0F"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"getData"})," : ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["\u83B7\u53D6\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 ",n(e.code,{children:"data"})," \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 ",n(e.code,{children:"requestAnimationFrame"})," \u8FDB\u884C\u8C03\u7528"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"setFftSize"})," : ",n(e.code,{children:"(fftSize: number) => void"})]}),`
`,n(e.p,{children:"\u8BBE\u7F6E FFT \u7684\u5927\u5C0F"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"observe"})," : ",n(e.code,{children:"(callback: () => void) => void"})]}),`
`,n(e.p,{children:"\u76D1\u542C\u9891\u8C31\u56FE\u6570\u636E\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 data \u7684\u53D8\u5316"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"cancelObserve"})," : ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"\u53D6\u6D88\u76D1\u542C"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"\u662F\u5426\u51FA\u73B0\u51FA\u9519"}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"\u51FA\u9519\u7684\u9519\u8BEF\u4FE1\u606F"}),`
`]}),`
`]})]})}function f(c={}){const{wrapper:e}=c.components||{};return e?n(e,Object.assign({},c,{children:n(i,c)})):i(c)}const b="2024/1/23 14:58:40",S=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Chip, Link } from '@nextui-org/react'
import { Github } from 'lucide-react'

# \`useSpectrogram\`

\u8BE5 hook \u53EF\u7528\u4E8E\u751F\u6210\u97F3\u9891\u7684\u9891\u8C31\u56FE

<Link
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useSpectrogram.ts"
  target="_blank"
  size="sm"
  className="flex items-center"
>
  <Github className="w-4 h-4" />
  <span className="ml-2">\u67E5\u770B\u6E90\u7801</span>
</Link>

## \u5F15\u5165

<CodeBlock code={\`import { useSpectrogram, type UseSpectrogramProps } from 'echo-ui'\`} />

## \u4F20\u53C2

### \`UseSpectrogramProps\`

- **fftSize** : \`number\`

  FFT \u7684\u5927\u5C0F\uFF0C\u5FC5\u987B\u662F 2 \u7684\u5E42\u6B21\u65B9\uFF0C\u9ED8\u8BA4\u4E3A \`1024\` (\u8303\u56F4\uFF1A 16 ~ 16384)

## \u8FD4\u56DE\u503C

### \`Object\`

- **analyser** : \`Tone.Analyser\`

  \u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684 [Tone.Analyser](https://tonejs.github.io/docs/14.7.77/Analyser) \u5B9E\u4F8B

- **data** : \`SpectrogramDataPoint[]\`

  \u9891\u8C31\u56FE\u6570\u636E\uFF0C\u53EF\u4EE5\u81EA\u884C\u5B9A\u65F6\u901A\u8FC7 \`getData\` \u83B7\u53D6\u6216\u8005\u4F7F\u7528 \`observe\` \u65B9\u6CD5\u81EA\u52A8\u5F00\u542F\u76D1\u542C

- **fftSize** : \`number\`

  FFT \u7684\u5927\u5C0F

- **getData** : \`() => void\`

  \u83B7\u53D6\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 \`data\` \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 \`requestAnimationFrame\` \u8FDB\u884C\u8C03\u7528

- **setFftSize** : \`(fftSize: number) => void\`

  \u8BBE\u7F6E FFT \u7684\u5927\u5C0F

- **observe** : \`(callback: () => void) => void\`

  \u76D1\u542C\u9891\u8C31\u56FE\u6570\u636E\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 data \u7684\u53D8\u5316

- **cancelObserve** : \`() => void\`

  \u53D6\u6D88\u76D1\u542C

- **error**: \`boolean\`

  \u662F\u5426\u51FA\u73B0\u51FA\u9519

- **errorMessage**: \`string\`

  \u51FA\u9519\u7684\u9519\u8BEF\u4FE1\u606F
`;export{S as content,f as default,m as frontmatter,b as lastUpdatedTime,u as title,g as toc};
