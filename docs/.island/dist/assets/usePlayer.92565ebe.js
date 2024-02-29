import{jsx as e,jsxs as r,Fragment as o}from"react/jsx-runtime";import{C as d}from"./CodeBlock.de027be4.js";import{G as h}from"./github.54c71331.js";import{l}from"./chunk-MPX6TMFQ.dc1d8ff0.js";import"react";import"./index.2d091e0a.js";const b=void 0,f=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4F20\u53C2",text:"\u4F20\u53C2",depth:2},{id:"useplayerprops",text:"UsePlayerProps",depth:3},{id:"\u8FD4\u56DE\u503C",text:"\u8FD4\u56DE\u503C",depth:2},{id:"object",text:"Object",depth:3}],g="usePlayer";function c(i){const n=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong",div:"div"},i.components);return r(o,{children:[r(n.h1,{id:"useplayer",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#useplayer",children:"#"}),e(n.code,{children:"usePlayer"})]}),`
`,e(n.p,{children:"\u7528\u8BE5 Hook \u53EF\u4EE5\u5B9E\u73B0\u97F3\u4E50\u64AD\u653E\u5668\u7684\u57FA\u672C\u529F\u80FD\uFF0C\u5305\u62EC\u64AD\u653E\u3001\u6682\u505C\u3001\u64AD\u653E\u8FDB\u5EA6\u3001\u64AD\u653E\u6A21\u5F0F\u7B49"}),`
`,r(l,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/usePlayer.ts",target:"_blank",size:"sm",className:"flex items-center",children:[e(h,{className:"w-4 h-4"}),e("span",{className:"ml-2",children:"\u67E5\u770B\u6E90\u7801"})]}),`
`,r(n.h2,{id:"\u5F15\u5165",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,e(d,{code:"import { usePlayer, type UsePlayerProps } form 'echo-ui'"}),`
`,r(n.h2,{id:"\u4F20\u53C2",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4F20\u53C2",children:"#"}),"\u4F20\u53C2"]}),`
`,r(n.h3,{id:"useplayerprops",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#useplayerprops",children:"#"}),e(n.code,{children:"UsePlayerProps"})]}),`
`,r(n.ul,{children:[`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"volume"}),": ",e(n.code,{children:"number"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u7684\u97F3\u91CF\uFF0C\u9ED8\u8BA4\u4E3A 5"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"loop"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u662F\u5426\u5FAA\u73AF\u64AD\u653E\uFF0C\u9ED8\u8BA4\u4E3A false"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"mute"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u662F\u5426\u9759\u97F3\uFF0C\u9ED8\u8BA4\u4E3A false"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"onReady"}),": ",e(n.code,{children:"() => void"})]}),`
`,r(n.p,{children:["\u5F53 ",e(n.code,{children:"player"})," \u5B9E\u4F8B\u521D\u59CB\u5316\u6210\u529F\u540E\uFF0C\u97F3\u9891\u51C6\u5907\u5C31\u7EEA\u65F6\u7684\u56DE\u8C03\u51FD\u6570"]}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"onPlay"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u5F00\u59CB\u64AD\u653E\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"onPause"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u6682\u505C\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"onStop"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u505C\u6B62\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"onFinish"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u64AD\u653E\u7ED3\u675F\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"onError"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u5F53 hook \u5185\u90E8\u53D1\u751F\u9519\u8BEF\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`]}),`
`,r(n.h2,{id:"\u8FD4\u56DE\u503C",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FD4\u56DE\u503C",children:"#"}),"\u8FD4\u56DE\u503C"]}),`
`,r(n.h3,{id:"object",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),e(n.code,{children:"Object"})]}),`
`,r(n.ul,{children:[`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"init"}),": ",e(n.code,{children:"(audioBuffer: AudioBuffer, chain?: InputNode[]) => void"})]}),`
`,e(n.p,{children:"\u521D\u59CB\u5316 Player \u5B9E\u4F8B"}),`
`,r(n.div,{className:"island-directive tip",children:[e(n.p,{className:"island-directive-title",children:"\u6CE8\u610F"}),e(n.div,{className:"island-directive-content",children:r(n.p,{children:["\u9700\u8981\u5728 ",e(n.code,{children:"audioBuffer"})," \u83B7\u53D6\u5230\u540E\uFF0C\u5E76\u4E14 ",e(n.code,{children:"chain"})," \u4E2D\u6240\u6709\u8282\u70B9\u521D\u59CB\u5316\u5B8C\u6210\u540E\u518D\u8C03\u7528 ",e(n.code,{children:"init"})," \u51FD\u6570"]})})]}),`
`,r(n.ul,{children:[`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"audioBuffer(\u5FC5\u4F20)"}),": ",e(n.code,{children:"AudioBuffer"})]}),`
`,r(n.p,{children:["\u97F3\u9891\u7F13\u51B2\u533A\uFF0C\u53EF\u4EE5\u901A\u8FC7 ",e(l,{href:"/zh/hook/useFetchAudio",children:"useFetchAudio"})," hook \u83B7\u53D6"]}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"chain"}),": ",e(n.code,{children:"AudioNode[]"})]}),`
`,r(n.p,{children:["\u97F3\u9891\u8282\u70B9\u94FE\uFF0C\u8FDE\u63A5\u7684\u8282\u70B9\u4F1A\u5728\u64AD\u653E\u65F6\u4F9D\u6B21\u6267\u884C\uFF0C\u3002\u5982\u4E0B\u4EE3\u7801\u6240\u793A\uFF0C\u8FDE\u63A5\u4E86\u4E00\u4E2A ",e(n.code,{children:"filter"})," \u8282\u70B9\u548C\u4E00\u4E2A ",e(n.code,{children:"analyser"})," \u8282\u70B9\u3002\u4E0D\u9700\u8981\u5728\u6700\u540E\u52A0\u5165 ",e(n.code,{children:"Tone.Destination"})," \u8282\u70B9"]}),`
`,e(d,{code:"init(audioBuffer, [filter, analyser])"}),`
`]}),`
`]}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"player"}),": ",e(n.code,{children:"React.MutableRefObject<Tone.Player | null>"})]}),`
`,r(n.p,{children:["\u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684 ",e(n.a,{href:"https://tonejs.github.io/docs/14.7.77/Player",target:"_blank",rel:"nofollow",children:"Tone.Player"})," \u5B9E\u4F8B\uFF0C\u9700\u8981\u4F7F\u7528 ",e(n.code,{children:".current"})," \u83B7\u53D6"]}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"audioDuration"}),": ",e(n.code,{children:"React.MutableRefObject<number>"})]}),`
`,r(n.p,{children:["\u97F3\u9891\u7684\u65F6\u957F\uFF0C\u5355\u4F4D\u4E3A\u79D2\uFF0C\u9700\u8981\u4F7F\u7528 ",e(n.code,{children:".current"})," \u83B7\u53D6"]}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"isReady"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u662F\u5426\u51C6\u5907\u5C31\u7EEA"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"isPlaying"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u662F\u5426\u6B63\u5728\u64AD\u653E"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"isFinish"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u662F\u5426\u64AD\u653E\u7ED3\u675F"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"volume"}),": ",e(n.code,{children:"number"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u7684\u97F3\u91CF"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"loop"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u662F\u5426\u5FAA\u73AF\u64AD\u653E"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"mute"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u662F\u5426\u9759\u97F3"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"time"}),": ",e(n.code,{children:"number"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"percentage"}),": ",e(n.code,{children:"number"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\u5360\u603B\u65F6\u957F\u7684\u767E\u5206\u6BD4"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"pickTime"}),": ",e(n.code,{children:"number"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u5F00\u59CB\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"play"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u5F00\u59CB\u64AD\u653E\u97F3\u9891"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"pause"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u6682\u505C\u64AD\u653E\u97F3\u9891"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"stop"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u505C\u6B62\u64AD\u653E\u97F3\u9891"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"setPickTime"}),": ",e(n.code,{children:"(time: number) => void"})]}),`
`,e(n.p,{children:"\u8BBE\u7F6E\u97F3\u9891\u5F00\u59CB\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"setVolume"}),": ",e(n.code,{children:"(volume: number) => void"})]}),`
`,e(n.p,{children:"\u8BBE\u7F6E\u97F3\u9891\u7684\u97F3\u91CF"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"setLoop"}),": ",e(n.code,{children:"(loop: boolean) => void"})]}),`
`,e(n.p,{children:"\u8BBE\u7F6E\u97F3\u9891\u662F\u5426\u5FAA\u73AF\u64AD\u653E"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"setMute"}),": ",e(n.code,{children:"(mute: boolean) => void"})]}),`
`,e(n.p,{children:"\u8BBE\u7F6E\u97F3\u9891\u662F\u5426\u9759\u97F3"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"getTime"}),": ",e(n.code,{children:"() => number"})]}),`
`,r(n.p,{children:["\u83B7\u53D6\u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\u548C\u767E\u5206\u6BD4\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 ",e(n.code,{children:"time"})," \u548C ",e(n.code,{children:"percentage"})," \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 ",e(n.code,{children:"requestAnimationFrame"})," \u8FDB\u884C\u8C03\u7528"]}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"observe"}),": ",e(n.code,{children:"(callback: (time: number) => void) => void"})]}),`
`,r(n.p,{children:["\u76D1\u542C\u64AD\u653E\u4E2D\u65F6\u95F4\u3001\u767E\u5206\u6BD4\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 ",e(n.code,{children:"time"})," \u548C ",e(n.code,{children:"percentage"})," \u7684\u53D8\u5316"]}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"cancelObserve"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u53D6\u6D88\u76D1\u542C\u64AD\u653E\u4E2D\u65F6\u95F4\u3001\u767E\u5206\u6BD4\u7684\u53D8\u5316"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"error"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u662F\u5426\u53D1\u751F\u9519\u8BEF"}),`
`]}),`
`,r(n.li,{children:[`
`,r(n.p,{children:[e(n.strong,{children:"errorMessage"}),": ",e(n.code,{children:"string"})]}),`
`,e(n.p,{children:"\u9519\u8BEF\u4FE1\u606F"}),`
`]}),`
`]})]})}function v(i={}){const{wrapper:n}=i.components||{};return n?e(n,Object.assign({},i,{children:e(c,i)})):c(i)}const y="2024/1/31 15:22:24",P=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Chip, Link } from '@nextui-org/react'\r
import { Github } from 'lucide-react'\r
\r
# \`usePlayer\`\r
\r
\u7528\u8BE5 Hook \u53EF\u4EE5\u5B9E\u73B0\u97F3\u4E50\u64AD\u653E\u5668\u7684\u57FA\u672C\u529F\u80FD\uFF0C\u5305\u62EC\u64AD\u653E\u3001\u6682\u505C\u3001\u64AD\u653E\u8FDB\u5EA6\u3001\u64AD\u653E\u6A21\u5F0F\u7B49\r
\r
<Link\r
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/usePlayer.ts"\r
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
<CodeBlock code={\`import { usePlayer, type UsePlayerProps } form 'echo-ui'\`} />\r
\r
## \u4F20\u53C2\r
\r
### \`UsePlayerProps\`\r
\r
- **volume**: \`number\`\r
\r
  \u97F3\u9891\u7684\u97F3\u91CF\uFF0C\u9ED8\u8BA4\u4E3A 5\r
\r
- **loop**: \`boolean\`\r
\r
  \u662F\u5426\u5FAA\u73AF\u64AD\u653E\uFF0C\u9ED8\u8BA4\u4E3A false\r
\r
- **mute**: \`boolean\`\r
\r
  \u662F\u5426\u9759\u97F3\uFF0C\u9ED8\u8BA4\u4E3A false\r
\r
- **onReady**: \`() => void\`\r
\r
  \u5F53 \`player\` \u5B9E\u4F8B\u521D\u59CB\u5316\u6210\u529F\u540E\uFF0C\u97F3\u9891\u51C6\u5907\u5C31\u7EEA\u65F6\u7684\u56DE\u8C03\u51FD\u6570\r
\r
- **onPlay**: \`() => void\`\r
\r
  \u97F3\u9891\u5F00\u59CB\u64AD\u653E\u65F6\u7684\u56DE\u8C03\u51FD\u6570\r
\r
- **onPause**: \`() => void\`\r
\r
  \u97F3\u9891\u6682\u505C\u65F6\u7684\u56DE\u8C03\u51FD\u6570\r
\r
- **onStop**: \`() => void\`\r
\r
  \u97F3\u9891\u505C\u6B62\u65F6\u7684\u56DE\u8C03\u51FD\u6570\r
\r
- **onFinish**: \`() => void\`\r
\r
  \u97F3\u9891\u64AD\u653E\u7ED3\u675F\u65F6\u7684\u56DE\u8C03\u51FD\u6570\r
\r
- **onError**: \`() => void\`\r
\r
  \u5F53 hook \u5185\u90E8\u53D1\u751F\u9519\u8BEF\u65F6\u7684\u56DE\u8C03\u51FD\u6570\r
\r
## \u8FD4\u56DE\u503C\r
\r
### \`Object\`\r
\r
- **init**: \`(audioBuffer: AudioBuffer, chain?: InputNode[]) => void\`\r
\r
  \u521D\u59CB\u5316 Player \u5B9E\u4F8B\r
\r
  :::tip{title=\u6CE8\u610F}\r
\r
  \u9700\u8981\u5728 \`audioBuffer\` \u83B7\u53D6\u5230\u540E\uFF0C\u5E76\u4E14 \`chain\` \u4E2D\u6240\u6709\u8282\u70B9\u521D\u59CB\u5316\u5B8C\u6210\u540E\u518D\u8C03\u7528 \`init\` \u51FD\u6570\r
\r
  :::\r
\r
  - **audioBuffer(\u5FC5\u4F20)**: \`AudioBuffer\`\r
\r
    \u97F3\u9891\u7F13\u51B2\u533A\uFF0C\u53EF\u4EE5\u901A\u8FC7 <Link href='/zh/hook/useFetchAudio'>useFetchAudio</Link> hook \u83B7\u53D6\r
\r
  - **chain**: \`AudioNode[]\`\r
\r
    \u97F3\u9891\u8282\u70B9\u94FE\uFF0C\u8FDE\u63A5\u7684\u8282\u70B9\u4F1A\u5728\u64AD\u653E\u65F6\u4F9D\u6B21\u6267\u884C\uFF0C\u3002\u5982\u4E0B\u4EE3\u7801\u6240\u793A\uFF0C\u8FDE\u63A5\u4E86\u4E00\u4E2A \`filter\` \u8282\u70B9\u548C\u4E00\u4E2A \`analyser\` \u8282\u70B9\u3002\u4E0D\u9700\u8981\u5728\u6700\u540E\u52A0\u5165 \`Tone.Destination\` \u8282\u70B9\r
\r
    <CodeBlock code={\`init(audioBuffer, [filter, analyser])\`} />\r
\r
- **player**: \`React.MutableRefObject<Tone.Player | null>\`\r
\r
  \u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684 [Tone.Player](https://tonejs.github.io/docs/14.7.77/Player) \u5B9E\u4F8B\uFF0C\u9700\u8981\u4F7F\u7528 \`.current\` \u83B7\u53D6\r
\r
- **audioDuration**: \`React.MutableRefObject<number>\`\r
\r
  \u97F3\u9891\u7684\u65F6\u957F\uFF0C\u5355\u4F4D\u4E3A\u79D2\uFF0C\u9700\u8981\u4F7F\u7528 \`.current\` \u83B7\u53D6\r
\r
- **isReady**: \`boolean\`\r
\r
  \u97F3\u9891\u662F\u5426\u51C6\u5907\u5C31\u7EEA\r
\r
- **isPlaying**: \`boolean\`\r
\r
  \u97F3\u9891\u662F\u5426\u6B63\u5728\u64AD\u653E\r
\r
- **isFinish**: \`boolean\`\r
\r
  \u97F3\u9891\u662F\u5426\u64AD\u653E\u7ED3\u675F\r
\r
- **volume**: \`number\`\r
\r
  \u97F3\u9891\u7684\u97F3\u91CF\r
\r
- **loop**: \`boolean\`\r
\r
  \u97F3\u9891\u662F\u5426\u5FAA\u73AF\u64AD\u653E\r
\r
- **mute**: \`boolean\`\r
\r
  \u97F3\u9891\u662F\u5426\u9759\u97F3\r
\r
- **time**: \`number\`\r
\r
  \u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2\r
\r
- **percentage**: \`number\`\r
\r
  \u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\u5360\u603B\u65F6\u957F\u7684\u767E\u5206\u6BD4\r
\r
- **pickTime**: \`number\`\r
\r
  \u97F3\u9891\u5F00\u59CB\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2\r
\r
- **play**: \`() => void\`\r
\r
  \u5F00\u59CB\u64AD\u653E\u97F3\u9891\r
\r
- **pause**: \`() => void\`\r
\r
  \u6682\u505C\u64AD\u653E\u97F3\u9891\r
\r
- **stop**: \`() => void\`\r
\r
  \u505C\u6B62\u64AD\u653E\u97F3\u9891\r
\r
- **setPickTime**: \`(time: number) => void\`\r
\r
  \u8BBE\u7F6E\u97F3\u9891\u5F00\u59CB\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2\r
\r
- **setVolume**: \`(volume: number) => void\`\r
\r
  \u8BBE\u7F6E\u97F3\u9891\u7684\u97F3\u91CF\r
\r
- **setLoop**: \`(loop: boolean) => void\`\r
\r
  \u8BBE\u7F6E\u97F3\u9891\u662F\u5426\u5FAA\u73AF\u64AD\u653E\r
\r
- **setMute**: \`(mute: boolean) => void\`\r
\r
  \u8BBE\u7F6E\u97F3\u9891\u662F\u5426\u9759\u97F3\r
\r
- **getTime**: \`() => number\`\r
\r
  \u83B7\u53D6\u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\u548C\u767E\u5206\u6BD4\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 \`time\` \u548C \`percentage\` \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 \`requestAnimationFrame\` \u8FDB\u884C\u8C03\u7528\r
\r
- **observe**: \`(callback: (time: number) => void) => void\`\r
\r
  \u76D1\u542C\u64AD\u653E\u4E2D\u65F6\u95F4\u3001\u767E\u5206\u6BD4\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 \`time\` \u548C \`percentage\` \u7684\u53D8\u5316\r
\r
- **cancelObserve**: \`() => void\`\r
\r
  \u53D6\u6D88\u76D1\u542C\u64AD\u653E\u4E2D\u65F6\u95F4\u3001\u767E\u5206\u6BD4\u7684\u53D8\u5316\r
\r
- **error**: \`boolean\`\r
\r
  \u662F\u5426\u53D1\u751F\u9519\u8BEF\r
\r
- **errorMessage**: \`string\`\r
\r
  \u9519\u8BEF\u4FE1\u606F\r
`;export{P as content,v as default,b as frontmatter,y as lastUpdatedTime,g as title,f as toc};
