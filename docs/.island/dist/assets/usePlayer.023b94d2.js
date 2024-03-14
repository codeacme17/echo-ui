import{jsx as e,jsxs as i,Fragment as o}from"react/jsx-runtime";import{C as d}from"./CodeBlock.d8e569ad.js";import{G as h}from"./github.5a3bc884.js";import{l}from"./chunk-MPX6TMFQ.a406c4b8.js";import"react";import"./index.93441784.js";const b=void 0,f=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4F20\u53C2",text:"\u4F20\u53C2",depth:2},{id:"useplayerprops",text:"UsePlayerProps",depth:3},{id:"\u8FD4\u56DE\u503C",text:"\u8FD4\u56DE\u503C",depth:2},{id:"object",text:"Object",depth:3}],g="usePlayer";function c(r){const n=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong",div:"div"},r.components);return i(o,{children:[i(n.h1,{id:"useplayer",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#useplayer",children:"#"}),e(n.code,{children:"usePlayer"})]}),`
`,e(n.p,{children:"\u7528\u8BE5 Hook \u53EF\u4EE5\u5B9E\u73B0\u97F3\u4E50\u64AD\u653E\u5668\u7684\u57FA\u672C\u529F\u80FD\uFF0C\u5305\u62EC\u64AD\u653E\u3001\u6682\u505C\u3001\u64AD\u653E\u8FDB\u5EA6\u3001\u64AD\u653E\u6A21\u5F0F\u7B49"}),`
`,i(l,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/usePlayer.ts",target:"_blank",size:"sm",className:"flex items-center",children:[e(h,{className:"w-4 h-4"}),e("span",{className:"ml-2",children:"\u67E5\u770B\u6E90\u7801"})]}),`
`,i(n.h2,{id:"\u5F15\u5165",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,e(d,{code:"import { usePlayer, type UsePlayerProps } form 'echo-ui'"}),`
`,i(n.h2,{id:"\u4F20\u53C2",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4F20\u53C2",children:"#"}),"\u4F20\u53C2"]}),`
`,i(n.h3,{id:"useplayerprops",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#useplayerprops",children:"#"}),e(n.code,{children:"UsePlayerProps"})]}),`
`,i(n.ul,{children:[`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"volume"}),": ",e(n.code,{children:"number"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u7684\u97F3\u91CF\uFF0C\u9ED8\u8BA4\u4E3A 5"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"loop"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u662F\u5426\u5FAA\u73AF\u64AD\u653E\uFF0C\u9ED8\u8BA4\u4E3A false"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"mute"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u662F\u5426\u9759\u97F3\uFF0C\u9ED8\u8BA4\u4E3A false"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"onReady"}),": ",e(n.code,{children:"() => void"})]}),`
`,i(n.p,{children:["\u5F53 ",e(n.code,{children:"player"})," \u5B9E\u4F8B\u521D\u59CB\u5316\u6210\u529F\u540E\uFF0C\u97F3\u9891\u51C6\u5907\u5C31\u7EEA\u65F6\u7684\u56DE\u8C03\u51FD\u6570"]}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"onPlay"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u5F00\u59CB\u64AD\u653E\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"onPause"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u6682\u505C\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"onStop"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u505C\u6B62\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"onFinish"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u64AD\u653E\u7ED3\u675F\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"onError"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u5F53 hook \u5185\u90E8\u53D1\u751F\u9519\u8BEF\u65F6\u7684\u56DE\u8C03\u51FD\u6570"}),`
`]}),`
`]}),`
`,i(n.h2,{id:"\u8FD4\u56DE\u503C",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FD4\u56DE\u503C",children:"#"}),"\u8FD4\u56DE\u503C"]}),`
`,i(n.h3,{id:"object",children:[e(n.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),e(n.code,{children:"Object"})]}),`
`,i(n.ul,{children:[`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"init"}),": ",e(n.code,{children:"(audioBuffer: AudioBuffer, chain?: InputNode[]) => void"})]}),`
`,e(n.p,{children:"\u521D\u59CB\u5316 Player \u5B9E\u4F8B"}),`
`,i(n.div,{className:"island-directive tip",children:[e(n.p,{className:"island-directive-title",children:"\u6CE8\u610F"}),e(n.div,{className:"island-directive-content",children:i(n.p,{children:["\u9700\u8981\u5728 ",e(n.code,{children:"audioBuffer"})," \u83B7\u53D6\u5230\u540E\uFF0C\u5E76\u4E14 ",e(n.code,{children:"chain"})," \u4E2D\u6240\u6709\u8282\u70B9\u521D\u59CB\u5316\u5B8C\u6210\u540E\u518D\u8C03\u7528 ",e(n.code,{children:"init"})," \u51FD\u6570"]})})]}),`
`,i(n.ul,{children:[`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"audioBuffer(\u5FC5\u4F20)"}),": ",e(n.code,{children:"AudioBuffer"})]}),`
`,i(n.p,{children:["\u97F3\u9891\u7F13\u51B2\u533A\uFF0C\u53EF\u4EE5\u901A\u8FC7 ",e(l,{href:"/zh/hook/useFetchAudio",children:"useFetchAudio"})," hook \u83B7\u53D6"]}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"chain"}),": ",e(n.code,{children:"AudioNode[]"})]}),`
`,i(n.p,{children:["\u97F3\u9891\u8282\u70B9\u94FE\uFF0C\u8FDE\u63A5\u7684\u8282\u70B9\u4F1A\u5728\u64AD\u653E\u65F6\u4F9D\u6B21\u6267\u884C\uFF0C\u3002\u5982\u4E0B\u4EE3\u7801\u6240\u793A\uFF0C\u8FDE\u63A5\u4E86\u4E00\u4E2A ",e(n.code,{children:"filter"})," \u8282\u70B9\u548C\u4E00\u4E2A ",e(n.code,{children:"analyser"})," \u8282\u70B9\u3002\u4E0D\u9700\u8981\u5728\u6700\u540E\u52A0\u5165 ",e(n.code,{children:"Tone.Destination"})," \u8282\u70B9"]}),`
`,e(d,{code:"init(audioBuffer, [filter, analyser])"}),`
`]}),`
`]}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"player"}),": ",e(n.code,{children:"React.MutableRefObject<Tone.Player | null>"})]}),`
`,i(n.p,{children:["\u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684 ",e(n.a,{href:"https://tonejs.github.io/docs/14.7.77/Player",target:"_blank",rel:"nofollow",children:"Tone.Player"})," \u5B9E\u4F8B\uFF0C\u9700\u8981\u4F7F\u7528 ",e(n.code,{children:".current"})," \u83B7\u53D6"]}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"audioDuration"}),": ",e(n.code,{children:"React.MutableRefObject<number>"})]}),`
`,i(n.p,{children:["\u97F3\u9891\u7684\u65F6\u957F\uFF0C\u5355\u4F4D\u4E3A\u79D2\uFF0C\u9700\u8981\u4F7F\u7528 ",e(n.code,{children:".current"})," \u83B7\u53D6"]}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"isReady"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u662F\u5426\u51C6\u5907\u5C31\u7EEA"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"isPlaying"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u662F\u5426\u6B63\u5728\u64AD\u653E"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"isFinish"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u662F\u5426\u64AD\u653E\u7ED3\u675F"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"volume"}),": ",e(n.code,{children:"number"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u7684\u97F3\u91CF"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"loop"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u662F\u5426\u5FAA\u73AF\u64AD\u653E"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"mute"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u662F\u5426\u9759\u97F3"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"time"}),": ",e(n.code,{children:"number"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"percentage"}),": ",e(n.code,{children:"number"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\u5360\u603B\u65F6\u957F\u7684\u767E\u5206\u6BD4"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"pickTime"}),": ",e(n.code,{children:"number"})]}),`
`,e(n.p,{children:"\u97F3\u9891\u5F00\u59CB\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"play"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u5F00\u59CB\u64AD\u653E\u97F3\u9891"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"pause"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u6682\u505C\u64AD\u653E\u97F3\u9891"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"stop"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u505C\u6B62\u64AD\u653E\u97F3\u9891"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"setPickTime"}),": ",e(n.code,{children:"(time: number) => void"})]}),`
`,e(n.p,{children:"\u8BBE\u7F6E\u97F3\u9891\u5F00\u59CB\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"setVolume"}),": ",e(n.code,{children:"(volume: number) => void"})]}),`
`,e(n.p,{children:"\u8BBE\u7F6E\u97F3\u9891\u7684\u97F3\u91CF"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"setLoop"}),": ",e(n.code,{children:"(loop: boolean) => void"})]}),`
`,e(n.p,{children:"\u8BBE\u7F6E\u97F3\u9891\u662F\u5426\u5FAA\u73AF\u64AD\u653E"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"setMute"}),": ",e(n.code,{children:"(mute: boolean) => void"})]}),`
`,e(n.p,{children:"\u8BBE\u7F6E\u97F3\u9891\u662F\u5426\u9759\u97F3"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"getTime"}),": ",e(n.code,{children:"() => number"})]}),`
`,i(n.p,{children:["\u83B7\u53D6\u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\u548C\u767E\u5206\u6BD4\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 ",e(n.code,{children:"time"})," \u548C ",e(n.code,{children:"percentage"})," \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 ",e(n.code,{children:"requestAnimationFrame"})," \u8FDB\u884C\u8C03\u7528"]}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"observe"}),": ",e(n.code,{children:"(callback: (time: number) => void) => void"})]}),`
`,i(n.p,{children:["\u76D1\u542C\u64AD\u653E\u4E2D\u65F6\u95F4\u3001\u767E\u5206\u6BD4\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 ",e(n.code,{children:"time"})," \u548C ",e(n.code,{children:"percentage"})," \u7684\u53D8\u5316"]}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"cancelObserve"}),": ",e(n.code,{children:"() => void"})]}),`
`,e(n.p,{children:"\u53D6\u6D88\u76D1\u542C\u64AD\u653E\u4E2D\u65F6\u95F4\u3001\u767E\u5206\u6BD4\u7684\u53D8\u5316"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"error"}),": ",e(n.code,{children:"boolean"})]}),`
`,e(n.p,{children:"\u662F\u5426\u53D1\u751F\u9519\u8BEF"}),`
`]}),`
`,i(n.li,{children:[`
`,i(n.p,{children:[e(n.strong,{children:"errorMessage"}),": ",e(n.code,{children:"string"})]}),`
`,e(n.p,{children:"\u9519\u8BEF\u4FE1\u606F"}),`
`]}),`
`]})]})}function v(r={}){const{wrapper:n}=r.components||{};return n?e(n,Object.assign({},r,{children:e(c,r)})):c(r)}const y="2024/1/31 15:22:24",P=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Chip, Link } from '@nextui-org/react'
import { Github } from 'lucide-react'

# \`usePlayer\`

\u7528\u8BE5 Hook \u53EF\u4EE5\u5B9E\u73B0\u97F3\u4E50\u64AD\u653E\u5668\u7684\u57FA\u672C\u529F\u80FD\uFF0C\u5305\u62EC\u64AD\u653E\u3001\u6682\u505C\u3001\u64AD\u653E\u8FDB\u5EA6\u3001\u64AD\u653E\u6A21\u5F0F\u7B49

<Link
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/usePlayer.ts"
  target="_blank"
  size="sm"
  className="flex items-center"
>
  <Github className="w-4 h-4" />
  <span className="ml-2">\u67E5\u770B\u6E90\u7801</span>
</Link>

## \u5F15\u5165

<CodeBlock code={\`import { usePlayer, type UsePlayerProps } form 'echo-ui'\`} />

## \u4F20\u53C2

### \`UsePlayerProps\`

- **volume**: \`number\`

  \u97F3\u9891\u7684\u97F3\u91CF\uFF0C\u9ED8\u8BA4\u4E3A 5

- **loop**: \`boolean\`

  \u662F\u5426\u5FAA\u73AF\u64AD\u653E\uFF0C\u9ED8\u8BA4\u4E3A false

- **mute**: \`boolean\`

  \u662F\u5426\u9759\u97F3\uFF0C\u9ED8\u8BA4\u4E3A false

- **onReady**: \`() => void\`

  \u5F53 \`player\` \u5B9E\u4F8B\u521D\u59CB\u5316\u6210\u529F\u540E\uFF0C\u97F3\u9891\u51C6\u5907\u5C31\u7EEA\u65F6\u7684\u56DE\u8C03\u51FD\u6570

- **onPlay**: \`() => void\`

  \u97F3\u9891\u5F00\u59CB\u64AD\u653E\u65F6\u7684\u56DE\u8C03\u51FD\u6570

- **onPause**: \`() => void\`

  \u97F3\u9891\u6682\u505C\u65F6\u7684\u56DE\u8C03\u51FD\u6570

- **onStop**: \`() => void\`

  \u97F3\u9891\u505C\u6B62\u65F6\u7684\u56DE\u8C03\u51FD\u6570

- **onFinish**: \`() => void\`

  \u97F3\u9891\u64AD\u653E\u7ED3\u675F\u65F6\u7684\u56DE\u8C03\u51FD\u6570

- **onError**: \`() => void\`

  \u5F53 hook \u5185\u90E8\u53D1\u751F\u9519\u8BEF\u65F6\u7684\u56DE\u8C03\u51FD\u6570

## \u8FD4\u56DE\u503C

### \`Object\`

- **init**: \`(audioBuffer: AudioBuffer, chain?: InputNode[]) => void\`

  \u521D\u59CB\u5316 Player \u5B9E\u4F8B

  :::tip{title=\u6CE8\u610F}

  \u9700\u8981\u5728 \`audioBuffer\` \u83B7\u53D6\u5230\u540E\uFF0C\u5E76\u4E14 \`chain\` \u4E2D\u6240\u6709\u8282\u70B9\u521D\u59CB\u5316\u5B8C\u6210\u540E\u518D\u8C03\u7528 \`init\` \u51FD\u6570

  :::

  - **audioBuffer(\u5FC5\u4F20)**: \`AudioBuffer\`

    \u97F3\u9891\u7F13\u51B2\u533A\uFF0C\u53EF\u4EE5\u901A\u8FC7 <Link href='/zh/hook/useFetchAudio'>useFetchAudio</Link> hook \u83B7\u53D6

  - **chain**: \`AudioNode[]\`

    \u97F3\u9891\u8282\u70B9\u94FE\uFF0C\u8FDE\u63A5\u7684\u8282\u70B9\u4F1A\u5728\u64AD\u653E\u65F6\u4F9D\u6B21\u6267\u884C\uFF0C\u3002\u5982\u4E0B\u4EE3\u7801\u6240\u793A\uFF0C\u8FDE\u63A5\u4E86\u4E00\u4E2A \`filter\` \u8282\u70B9\u548C\u4E00\u4E2A \`analyser\` \u8282\u70B9\u3002\u4E0D\u9700\u8981\u5728\u6700\u540E\u52A0\u5165 \`Tone.Destination\` \u8282\u70B9

    <CodeBlock code={\`init(audioBuffer, [filter, analyser])\`} />

- **player**: \`React.MutableRefObject<Tone.Player | null>\`

  \u521D\u59CB\u5316\u540E\u6784\u5EFA\u7684 [Tone.Player](https://tonejs.github.io/docs/14.7.77/Player) \u5B9E\u4F8B\uFF0C\u9700\u8981\u4F7F\u7528 \`.current\` \u83B7\u53D6

- **audioDuration**: \`React.MutableRefObject<number>\`

  \u97F3\u9891\u7684\u65F6\u957F\uFF0C\u5355\u4F4D\u4E3A\u79D2\uFF0C\u9700\u8981\u4F7F\u7528 \`.current\` \u83B7\u53D6

- **isReady**: \`boolean\`

  \u97F3\u9891\u662F\u5426\u51C6\u5907\u5C31\u7EEA

- **isPlaying**: \`boolean\`

  \u97F3\u9891\u662F\u5426\u6B63\u5728\u64AD\u653E

- **isFinish**: \`boolean\`

  \u97F3\u9891\u662F\u5426\u64AD\u653E\u7ED3\u675F

- **volume**: \`number\`

  \u97F3\u9891\u7684\u97F3\u91CF

- **loop**: \`boolean\`

  \u97F3\u9891\u662F\u5426\u5FAA\u73AF\u64AD\u653E

- **mute**: \`boolean\`

  \u97F3\u9891\u662F\u5426\u9759\u97F3

- **time**: \`number\`

  \u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2

- **percentage**: \`number\`

  \u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\u5360\u603B\u65F6\u957F\u7684\u767E\u5206\u6BD4

- **pickTime**: \`number\`

  \u97F3\u9891\u5F00\u59CB\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2

- **play**: \`() => void\`

  \u5F00\u59CB\u64AD\u653E\u97F3\u9891

- **pause**: \`() => void\`

  \u6682\u505C\u64AD\u653E\u97F3\u9891

- **stop**: \`() => void\`

  \u505C\u6B62\u64AD\u653E\u97F3\u9891

- **setPickTime**: \`(time: number) => void\`

  \u8BBE\u7F6E\u97F3\u9891\u5F00\u59CB\u64AD\u653E\u7684\u65F6\u95F4\uFF0C\u5355\u4F4D\u4E3A\u79D2

- **setVolume**: \`(volume: number) => void\`

  \u8BBE\u7F6E\u97F3\u9891\u7684\u97F3\u91CF

- **setLoop**: \`(loop: boolean) => void\`

  \u8BBE\u7F6E\u97F3\u9891\u662F\u5426\u5FAA\u73AF\u64AD\u653E

- **setMute**: \`(mute: boolean) => void\`

  \u8BBE\u7F6E\u97F3\u9891\u662F\u5426\u9759\u97F3

- **getTime**: \`() => number\`

  \u83B7\u53D6\u97F3\u9891\u5F53\u524D\u64AD\u653E\u7684\u65F6\u95F4\u548C\u767E\u5206\u6BD4\uFF0C\u5728\u8C03\u7528\u540E\u4F1A\u66F4\u65B0 \`time\` \u548C \`percentage\` \u7684\u503C\uFF0C\u53EF\u4EE5\u4F7F\u7528\u5B9A\u65F6\u5668\u6216 \`requestAnimationFrame\` \u8FDB\u884C\u8C03\u7528

- **observe**: \`(callback: (time: number) => void) => void\`

  \u76D1\u542C\u64AD\u653E\u4E2D\u65F6\u95F4\u3001\u767E\u5206\u6BD4\u7684\u53D8\u5316\uFF0C\u4F7F\u7528\u8BE5\u51FD\u6570\u53EF\u5F00\u542F\u76D1\u542C\uFF0C\u5E76\u5B9E\u65F6\u7684\u83B7\u5F97 \`time\` \u548C \`percentage\` \u7684\u53D8\u5316

- **cancelObserve**: \`() => void\`

  \u53D6\u6D88\u76D1\u542C\u64AD\u653E\u4E2D\u65F6\u95F4\u3001\u767E\u5206\u6BD4\u7684\u53D8\u5316

- **error**: \`boolean\`

  \u662F\u5426\u53D1\u751F\u9519\u8BEF

- **errorMessage**: \`string\`

  \u9519\u8BEF\u4FE1\u606F
`;export{P as content,v as default,b as frontmatter,y as lastUpdatedTime,g as title,f as toc};
