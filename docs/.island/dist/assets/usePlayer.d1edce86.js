import{jsx as n,jsxs as r,Fragment as t}from"react/jsx-runtime";import{C as o}from"./CodeBlock.de027be4.js";import{G as c}from"./github.54c71331.js";import{l as d}from"./chunk-MPX6TMFQ.dc1d8ff0.js";import"react";import"./index.2d091e0a.js";const f=void 0,b=[{id:"import",text:"Import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"useplayerprops",text:"UsePlayerProps",depth:3},{id:"return-values",text:"Return Values",depth:2},{id:"object",text:"Object",depth:3}],g="usePlayer";function l(i){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong",div:"div"},i.components);return r(t,{children:[r(e.h1,{id:"useplayer",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#useplayer",children:"#"}),n(e.code,{children:"usePlayer"})]}),`
`,n(e.p,{children:"This hook enables the implementation of basic functions of a music player, including play, pause, progress tracking, play mode, etc."}),`
`,r(d,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/usePlayer.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(c,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"View Source"})]}),`
`,r(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(o,{code:"import { usePlayer, type UsePlayerProps } from 'echo-ui'"}),`
`,r(e.h2,{id:"parameters",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,r(e.h3,{id:"useplayerprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#useplayerprops",children:"#"}),n(e.code,{children:"UsePlayerProps"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"volume"}),": ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"The volume of the audio, default is 5."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"loop"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether to loop the playback, default is false."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"mute"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether to mute the audio, default is false."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onReady"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Callback function when the audio is ready."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onPlay"}),": ",n(e.code,{children:"() => void"})]}),`
`,r(e.p,{children:["When the ",n(e.code,{children:"player"})," instance is successfully initialized, the callback function when the audio is ready."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onPause"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Callback function when the audio is paused."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onStop"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Callback function when the audio stops."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onFinish"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Callback function when the audio playback finishes."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"onError"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"The callback function when an error occurs inside the hook."}),`
`]}),`
`]}),`
`,r(e.h2,{id:"return-values",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-values",children:"#"}),"Return Values"]}),`
`,r(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"init"}),": ",n(e.code,{children:"(audioBuffer: AudioBuffer, chain?: InputNode[]) => void"})]}),`
`,n(e.p,{children:"Initialize Player instance"}),`
`,r(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"Note"}),n(e.div,{className:"island-directive-content",children:r(e.p,{children:["The ",n(e.code,{children:"init"})," function needs to be called after ",n(e.code,{children:"audioBuffer"})," is obtained and all nodes in ",n(e.code,{children:"chain"})," are initialized."]})})]}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"audioBuffer(required)"}),": ",n(e.code,{children:"AudioBuffer"})]}),`
`,r(e.p,{children:["The audio buffer can be obtained through ",n(d,{href:"/zh/hook/useFetchAudio",children:"useFetchAudio"})," hook"]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"chain"}),": ",n(e.code,{children:"AudioNode[]"})]}),`
`,r(e.p,{children:["Audio node chain, connected nodes will be executed sequentially during playback. As shown in the following code, a ",n(e.code,{children:"filter"})," node and an ",n(e.code,{children:"analyser"})," node are connected. No need to add ",n(e.code,{children:"Tone.Destination"})," node at the end"]}),`
`,n(o,{code:"init(audioBuffer, [filter, analyzer])"}),`
`]}),`
`]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"player"}),": ",n(e.code,{children:"Tone.Player"})]}),`
`,r(e.p,{children:["The ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Player",target:"_blank",rel:"nofollow",children:"Tone.Player"})," instance created after initialization."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"audioDuration"}),": ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"The duration of the audio in seconds."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"isReady"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether the audio is ready."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"isPlaying"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether the audio is currently playing."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"isFinish"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether the audio playback has finished."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"volume"}),": ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"The volume of the audio."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"loop"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether the audio is set to loop."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"mute"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether the audio is muted."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"time"}),": ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"The current playback time of the audio in seconds."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"percentage"}),": ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"The percentage of the current playback time relative to the total duration."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"pickTime"}),": ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"The starting time of the audio playback in seconds."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"play"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Starts playing the audio."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"pause"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Pauses the audio playback."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"stop"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Stops the audio playback."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"setPickTime"}),": ",n(e.code,{children:"(time: number) => void"})]}),`
`,n(e.p,{children:"Sets the starting time of the audio playback in seconds."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"setVolume"}),": ",n(e.code,{children:"(volume: number) => void"})]}),`
`,n(e.p,{children:"Sets the volume of the audio."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"setLoop"}),": ",n(e.code,{children:"(loop: boolean) => void"})]}),`
`,n(e.p,{children:"Sets whether the audio should loop."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"setMute"}),": ",n(e.code,{children:"(mute: boolean) => void"})]}),`
`,n(e.p,{children:"Sets whether the audio should be muted."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"getTime"}),": ",n(e.code,{children:"() => number"})]}),`
`,r(e.p,{children:["Gets the current playback time and percentage. After calling, it updates the values of ",n(e.code,{children:"time"})," and ",n(e.code,{children:"percentage"}),". It can be called using a timer or ",n(e.code,{children:"requestAnimationFrame"}),"."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"observe"}),": ",n(e.code,{children:"(callback: (time: number) => void) => void"})]}),`
`,r(e.p,{children:["Listens for changes in playback time and percentage. Use this function to start monitoring and get real-time updates on ",n(e.code,{children:"time"})," and ",n(e.code,{children:"percentage"}),"."]}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"cancelObserve"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Cancels the monitoring of changes in playback time and percentage."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Indicates whether an error has occurred."}),`
`]}),`
`,r(e.li,{children:[`
`,r(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"The error message."}),`
`]}),`
`]})]})}function y(i={}){const{wrapper:e}=i.components||{};return e?n(e,Object.assign({},i,{children:n(l,i)})):l(i)}const k="2024/1/24 14:43:22",v=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Chip, Link } from '@nextui-org/react'\r
import { Github } from 'lucide-react'\r
\r
# \`usePlayer\`\r
\r
This hook enables the implementation of basic functions of a music player, including play, pause, progress tracking, play mode, etc.\r
\r
<Link\r
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/usePlayer.ts"\r
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
<CodeBlock code={\`import { usePlayer, type UsePlayerProps } from 'echo-ui'\`} />\r
\r
## Parameters\r
\r
### \`UsePlayerProps\`\r
\r
- **volume**: \`number\`\r
\r
  The volume of the audio, default is 5.\r
\r
- **loop**: \`boolean\`\r
\r
  Whether to loop the playback, default is false.\r
\r
- **mute**: \`boolean\`\r
\r
  Whether to mute the audio, default is false.\r
\r
- **onReady**: \`() => void\`\r
\r
  Callback function when the audio is ready.\r
\r
- **onPlay**: \`() => void\`\r
\r
  When the \`player\` instance is successfully initialized, the callback function when the audio is ready.\r
\r
- **onPause**: \`() => void\`\r
\r
  Callback function when the audio is paused.\r
\r
- **onStop**: \`() => void\`\r
\r
  Callback function when the audio stops.\r
\r
- **onFinish**: \`() => void\`\r
\r
  Callback function when the audio playback finishes.\r
\r
- **onError**: \`() => void\`\r
\r
  The callback function when an error occurs inside the hook.\r
\r
## Return Values\r
\r
### \`Object\`\r
\r
- **init**: \`(audioBuffer: AudioBuffer, chain?: InputNode[]) => void\`\r
\r
  Initialize Player instance\r
\r
  :::tip{title=Note}\r
\r
  The \`init\` function needs to be called after \`audioBuffer\` is obtained and all nodes in \`chain\` are initialized.\r
\r
  :::\r
\r
  - **audioBuffer(required)**: \`AudioBuffer\`\r
\r
    The audio buffer can be obtained through <Link href='/zh/hook/useFetchAudio'>useFetchAudio</Link> hook\r
\r
  - **chain**: \`AudioNode[]\`\r
\r
    Audio node chain, connected nodes will be executed sequentially during playback. As shown in the following code, a \`filter\` node and an \`analyser\` node are connected. No need to add \`Tone.Destination\` node at the end\r
\r
    <CodeBlock code={\`init(audioBuffer, [filter, analyzer])\`} />\r
\r
- **player**: \`Tone.Player\`\r
\r
  The [Tone.Player](https://tonejs.github.io/docs/14.7.77/Player) instance created after initialization.\r
\r
- **audioDuration**: \`number\`\r
\r
  The duration of the audio in seconds.\r
\r
- **isReady**: \`boolean\`\r
\r
  Whether the audio is ready.\r
\r
- **isPlaying**: \`boolean\`\r
\r
  Whether the audio is currently playing.\r
\r
- **isFinish**: \`boolean\`\r
\r
  Whether the audio playback has finished.\r
\r
- **volume**: \`number\`\r
\r
  The volume of the audio.\r
\r
- **loop**: \`boolean\`\r
\r
  Whether the audio is set to loop.\r
\r
- **mute**: \`boolean\`\r
\r
  Whether the audio is muted.\r
\r
- **time**: \`number\`\r
\r
  The current playback time of the audio in seconds.\r
\r
- **percentage**: \`number\`\r
\r
  The percentage of the current playback time relative to the total duration.\r
\r
- **pickTime**: \`number\`\r
\r
  The starting time of the audio playback in seconds.\r
\r
- **play**: \`() => void\`\r
\r
  Starts playing the audio.\r
\r
- **pause**: \`() => void\`\r
\r
  Pauses the audio playback.\r
\r
- **stop**: \`() => void\`\r
\r
  Stops the audio playback.\r
\r
- **setPickTime**: \`(time: number) => void\`\r
\r
  Sets the starting time of the audio playback in seconds.\r
\r
- **setVolume**: \`(volume: number) => void\`\r
\r
  Sets the volume of the audio.\r
\r
- **setLoop**: \`(loop: boolean) => void\`\r
\r
  Sets whether the audio should loop.\r
\r
- **setMute**: \`(mute: boolean) => void\`\r
\r
  Sets whether the audio should be muted.\r
\r
- **getTime**: \`() => number\`\r
\r
  Gets the current playback time and percentage. After calling, it updates the values of \`time\` and \`percentage\`. It can be called using a timer or \`requestAnimationFrame\`.\r
\r
- **observe**: \`(callback: (time: number) => void) => void\`\r
\r
  Listens for changes in playback time and percentage. Use this function to start monitoring and get real-time updates on \`time\` and \`percentage\`.\r
\r
- **cancelObserve**: \`() => void\`\r
\r
  Cancels the monitoring of changes in playback time and percentage.\r
\r
- **error**: \`boolean\`\r
\r
  Indicates whether an error has occurred.\r
\r
- **errorMessage**: \`string\`\r
\r
  The error message.\r
`;export{v as content,y as default,f as frontmatter,k as lastUpdatedTime,g as title,b as toc};
