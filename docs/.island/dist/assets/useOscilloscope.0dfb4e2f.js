import{jsx as n,jsxs as r,Fragment as i}from"react/jsx-runtime";import{C as l}from"./CodeBlock.de027be4.js";import{G as d}from"./github.54c71331.js";import{l as s}from"./chunk-MPX6TMFQ.dc1d8ff0.js";import"react";import"./index.2d091e0a.js";const b=void 0,g=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4F20\u53C2",text:"\u4F20\u53C2",depth:2},{id:"useoscilloscopeprops",text:"UseOscilloscopeProps",depth:3},{id:"\u8FD4\u56DE\u503C",text:"\u8FD4\u56DE\u503C",depth:2},{id:"object",text:"Object",depth:3}],f="useOscilloscope";function o(c){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong"},c.components);return r(i,{children:[r(e.h1,{id:"useoscilloscope",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#useoscilloscope",children:"#"}),n(e.code,{children:"useOscilloscope"})]}),`
`,n(e.p,{children:"\u7528\u4E8E\u521B\u5EFA\u4E00\u4E2A\u793A\u6CE2\u5668\u7684 hook\uFF0C\u53EF\u4EE5\u83B7\u53D6\u5230\u5B9E\u65F6\u7684\u632F\u5E45\u6570\u636E"}),`
`,r(s,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useOscilloscope.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(d,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"\u67E5\u770B\u6E90\u7801"})]}),`
`,r(e.h2,{id:"\u5F15\u5165",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,n(l,{code:"import { useOscilloscope, type UseOscilloscopeProps } from 'echo-ui'"}),`
`,r(e.h2,{id:"\u4F20\u53C2",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4F20\u53C2",children:"#"}),"\u4F20\u53C2"]}),`
`,r(e.h3,{id:"useoscilloscopeprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#useoscilloscopeprops",children:"#"}),n(e.code,{children:"UseOscilloscopeProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"fftSize"}),": ",n(e.code,{children:"number"})]}),`
`,r(e.p,{children:["FFT \u7684\u5927\u5C0F\uFF0C\u5FC5\u987B\u662F 2 \u7684\u5E42\u6B21\u65B9\uFF0C\u9ED8\u8BA4\u4E3A ",n(e.code,{children:"1024"})," (\u8303\u56F4\uFF1A 16 ~ 16384)"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onReady"}),": ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["\u5F53 ",n(e.code,{children:"analyser"})," \u521D\u59CB\u5316\u5B8C\u6210\u540E\u7684\u56DE\u8C03\u51FD\u6570"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onError"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"\u5F53 hook \u5185\u90E8\u51FA\u73B0\u9519\u8BEF\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`]}),`
`,r(e.h2,{id:"\u8FD4\u56DE\u503C",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FD4\u56DE\u503C",children:"#"}),"\u8FD4\u56DE\u503C"]}),`
`,r(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"init"})," : ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["\u8C03\u7528\u8BE5\u65B9\u6CD5\u53EF\u4EE5\u521D\u59CB\u5316 ",n(e.code,{children:"analyser"}),"\uFF0C\u5728\u521D\u59CB\u5316\u5B8C\u6210\u540E\u4F1A\u8C03\u7528 ",n(e.code,{children:"onReady"})," \u56DE\u8C03\u51FD\u6570"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"analyser"})," : ",n(e.code,{children:"React.MutableRefObject<Tone.Analyser | null>"})]}),`
`,r(e.p,{children:["\u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684\u7C7B\u578B\u4E3A ",n(e.code,{children:"waveform"})," \u7684\u5206\u6790\u5668 ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Analyser",target:"_blank",rel:"nofollow",children:"Tone.Analyser"})," \u5B9E\u4F8B\uFF0C\u9700\u8981\u4F7F\u7528 ",n(e.code,{children:".current"})," \u8FDB\u884C\u83B7\u53D6"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"data"})," : ",n(e.code,{children:"SpectrogramDataPoint[]"})]}),`
`,r(e.p,{children:["\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u53EF\u4EE5\u81EA\u884C\u5B9A\u65F6\u901A\u8FC7 ",n(e.code,{children:"getData"})," \u83B7\u53D6\u6216\u8005\u4F7F\u7528 ",n(e.code,{children:"observe"})," \u65B9\u6CD5\u81EA\u52A8\u5F00\u542F\u76D1\u542C"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"getData"})," : ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["\u83B7\u53D6\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 ",n(e.code,{children:"data"})," \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 ",n(e.code,{children:"requestAnimationFrame"})," \u8FDB\u884C\u8C03\u7528"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"observe"})," : ",n(e.code,{children:"(callback: () => void) => void"})]}),`
`,n(e.p,{children:"\u76D1\u542C\u793A\u6CE2\u5668\u6570\u636E\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 data \u7684\u53D8\u5316"}),`
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
`]})]})}function v(c={}){const{wrapper:e}=c.components||{};return e?n(e,Object.assign({},c,{children:n(o,c)})):o(c)}const k="2024/1/31 15:22:24",O=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Chip, Link } from '@nextui-org/react'
import { Github } from 'lucide-react'

# \`useOscilloscope\`

\u7528\u4E8E\u521B\u5EFA\u4E00\u4E2A\u793A\u6CE2\u5668\u7684 hook\uFF0C\u53EF\u4EE5\u83B7\u53D6\u5230\u5B9E\u65F6\u7684\u632F\u5E45\u6570\u636E

<Link
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/useOscilloscope.ts"
  target="_blank"
  size="sm"
  className="flex items-center"
>
  <Github className="w-4 h-4" />
  <span className="ml-2">\u67E5\u770B\u6E90\u7801</span>
</Link>

## \u5F15\u5165

<CodeBlock code={\`import { useOscilloscope, type UseOscilloscopeProps } from 'echo-ui'\`} />

## \u4F20\u53C2

### \`UseOscilloscopeProps\`

- **fftSize**: \`number\`

  FFT \u7684\u5927\u5C0F\uFF0C\u5FC5\u987B\u662F 2 \u7684\u5E42\u6B21\u65B9\uFF0C\u9ED8\u8BA4\u4E3A \`1024\` (\u8303\u56F4\uFF1A 16 ~ 16384)

- **onReady**: \`() => void\`

  \u5F53 \`analyser\` \u521D\u59CB\u5316\u5B8C\u6210\u540E\u7684\u56DE\u8C03\u51FD\u6570

- **onError**: \`() => void\`

  \u5F53 hook \u5185\u90E8\u51FA\u73B0\u9519\u8BEF\u65F6\u7684\u56DE\u8C03\u51FD\u6570

## \u8FD4\u56DE\u503C

### \`Object\`

- **init** : \`() => void\`

  \u8C03\u7528\u8BE5\u65B9\u6CD5\u53EF\u4EE5\u521D\u59CB\u5316 \`analyser\`\uFF0C\u5728\u521D\u59CB\u5316\u5B8C\u6210\u540E\u4F1A\u8C03\u7528 \`onReady\` \u56DE\u8C03\u51FD\u6570

- **analyser** : \`React.MutableRefObject<Tone.Analyser | null>\`

  \u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684\u7C7B\u578B\u4E3A \`waveform\` \u7684\u5206\u6790\u5668 [Tone.Analyser](https://tonejs.github.io/docs/14.7.77/Analyser) \u5B9E\u4F8B\uFF0C\u9700\u8981\u4F7F\u7528 \`.current\` \u8FDB\u884C\u83B7\u53D6

- **data** : \`SpectrogramDataPoint[]\`

  \u9891\u8C31\u56FE\u6570\u636E\uFF0C\u53EF\u4EE5\u81EA\u884C\u5B9A\u65F6\u901A\u8FC7 \`getData\` \u83B7\u53D6\u6216\u8005\u4F7F\u7528 \`observe\` \u65B9\u6CD5\u81EA\u52A8\u5F00\u542F\u76D1\u542C

- **getData** : \`() => void\`

  \u83B7\u53D6\u9891\u8C31\u56FE\u6570\u636E\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 \`data\` \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 \`requestAnimationFrame\` \u8FDB\u884C\u8C03\u7528

- **observe** : \`(callback: () => void) => void\`

  \u76D1\u542C\u793A\u6CE2\u5668\u6570\u636E\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 data \u7684\u53D8\u5316

- **cancelObserve** : \`() => void\`

  \u53D6\u6D88\u76D1\u542C

- **error**: \`boolean\`

  \u662F\u5426\u51FA\u73B0\u51FA\u9519

- **errorMessage**: \`string\`

  \u51FA\u9519\u7684\u9519\u8BEF\u4FE1\u606F
`;export{O as content,v as default,b as frontmatter,k as lastUpdatedTime,f as title,g as toc};
