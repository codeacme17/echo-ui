import{jsx as n,jsxs as i,Fragment as l}from"react/jsx-runtime";import{C as o}from"./CodeBlock.d8e569ad.js";import{G as c}from"./github.5a3bc884.js";import{l as d}from"./chunk-MPX6TMFQ.a406c4b8.js";import"react";import"./index.93441784.js";const b=void 0,f=[{id:"import",text:"Import",depth:2},{id:"parameters",text:"Parameters",depth:2},{id:"useplayerprops",text:"UsePlayerProps",depth:3},{id:"return-values",text:"Return Values",depth:2},{id:"object",text:"Object",depth:3}],g="usePlayer";function t(r){const e=Object.assign({h1:"h1",a:"a",code:"code",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",strong:"strong",div:"div"},r.components);return i(l,{children:[i(e.h1,{id:"useplayer",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#useplayer",children:"#"}),n(e.code,{children:"usePlayer"})]}),`
`,n(e.p,{children:"This hook enables the implementation of basic functions of a music player, including play, pause, progress tracking, play mode, etc."}),`
`,i(d,{href:"https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/usePlayer.ts",target:"_blank",size:"sm",className:"flex items-center",children:[n(c,{className:"w-4 h-4"}),n("span",{className:"ml-2",children:"View Source"})]}),`
`,i(e.h2,{id:"import",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#import",children:"#"}),"Import"]}),`
`,n(o,{code:"import { usePlayer, type UsePlayerProps } from 'echo-ui'"}),`
`,i(e.h2,{id:"parameters",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#parameters",children:"#"}),"Parameters"]}),`
`,i(e.h3,{id:"useplayerprops",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#useplayerprops",children:"#"}),n(e.code,{children:"UsePlayerProps"})]}),`
`,i(e.ul,{children:[`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"volume"}),": ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"The volume of the audio, default is 5."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"loop"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether to loop the playback, default is false."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"mute"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether to mute the audio, default is false."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"onReady"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Callback function when the audio is ready."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"onPlay"}),": ",n(e.code,{children:"() => void"})]}),`
`,i(e.p,{children:["When the ",n(e.code,{children:"player"})," instance is successfully initialized, the callback function when the audio is ready."]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"onPause"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Callback function when the audio is paused."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"onStop"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Callback function when the audio stops."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"onFinish"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Callback function when the audio playback finishes."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"onError"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"The callback function when an error occurs inside the hook."}),`
`]}),`
`]}),`
`,i(e.h2,{id:"return-values",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#return-values",children:"#"}),"Return Values"]}),`
`,i(e.h3,{id:"object",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",href:"#object",children:"#"}),n(e.code,{children:"Object"})]}),`
`,i(e.ul,{children:[`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"init"}),": ",n(e.code,{children:"(audioBuffer: AudioBuffer, chain?: InputNode[]) => void"})]}),`
`,n(e.p,{children:"Initialize Player instance"}),`
`,i(e.div,{className:"island-directive tip",children:[n(e.p,{className:"island-directive-title",children:"Note"}),n(e.div,{className:"island-directive-content",children:i(e.p,{children:["The ",n(e.code,{children:"init"})," function needs to be called after ",n(e.code,{children:"audioBuffer"})," is obtained and all nodes in ",n(e.code,{children:"chain"})," are initialized."]})})]}),`
`,i(e.ul,{children:[`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"audioBuffer(required)"}),": ",n(e.code,{children:"AudioBuffer"})]}),`
`,i(e.p,{children:["The audio buffer can be obtained through ",n(d,{href:"/zh/hook/useFetchAudio",children:"useFetchAudio"})," hook"]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"chain"}),": ",n(e.code,{children:"AudioNode[]"})]}),`
`,i(e.p,{children:["Audio node chain, connected nodes will be executed sequentially during playback. As shown in the following code, a ",n(e.code,{children:"filter"})," node and an ",n(e.code,{children:"analyser"})," node are connected. No need to add ",n(e.code,{children:"Tone.Destination"})," node at the end"]}),`
`,n(o,{code:"init(audioBuffer, [filter, analyzer])"}),`
`]}),`
`]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"player"}),": ",n(e.code,{children:"React.MutableRefObject<Tone.Player | null>"})]}),`
`,i(e.p,{children:["The ",n(e.a,{href:"https://tonejs.github.io/docs/14.7.77/Player",target:"_blank",rel:"nofollow",children:"Tone.Player"})," instance created after initialization. Need to use ",n(e.code,{children:".current"})," to obtain."]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"audioDuration"}),": ",n(e.code,{children:"React.MutableRefObject<number>"})]}),`
`,i(e.p,{children:["The duration of the audio in seconds. Need to use ",n(e.code,{children:".current"})," to obtain."]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"isReady"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether the audio is ready."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"isPlaying"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether the audio is currently playing."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"isFinish"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether the audio playback has finished."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"volume"}),": ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"The volume of the audio."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"loop"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether the audio is set to loop."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"mute"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Whether the audio is muted."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"time"}),": ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"The current playback time of the audio in seconds."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"percentage"}),": ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"The percentage of the current playback time relative to the total duration."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"pickTime"}),": ",n(e.code,{children:"number"})]}),`
`,n(e.p,{children:"The starting time of the audio playback in seconds."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"play"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Starts playing the audio."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"pause"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Pauses the audio playback."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"stop"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Stops the audio playback."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"setPickTime"}),": ",n(e.code,{children:"(time: number) => void"})]}),`
`,n(e.p,{children:"Sets the starting time of the audio playback in seconds."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"setVolume"}),": ",n(e.code,{children:"(volume: number) => void"})]}),`
`,n(e.p,{children:"Sets the volume of the audio."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"setLoop"}),": ",n(e.code,{children:"(loop: boolean) => void"})]}),`
`,n(e.p,{children:"Sets whether the audio should loop."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"setMute"}),": ",n(e.code,{children:"(mute: boolean) => void"})]}),`
`,n(e.p,{children:"Sets whether the audio should be muted."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"getTime"}),": ",n(e.code,{children:"() => number"})]}),`
`,i(e.p,{children:["Gets the current playback time and percentage. After calling, it updates the values of ",n(e.code,{children:"time"})," and ",n(e.code,{children:"percentage"}),". It can be called using a timer or ",n(e.code,{children:"requestAnimationFrame"}),"."]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"observe"}),": ",n(e.code,{children:"(callback: (time: number) => void) => void"})]}),`
`,i(e.p,{children:["Listens for changes in playback time and percentage. Use this function to start monitoring and get real-time updates on ",n(e.code,{children:"time"})," and ",n(e.code,{children:"percentage"}),"."]}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"cancelObserve"}),": ",n(e.code,{children:"() => void"})]}),`
`,n(e.p,{children:"Cancels the monitoring of changes in playback time and percentage."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"error"}),": ",n(e.code,{children:"boolean"})]}),`
`,n(e.p,{children:"Indicates whether an error has occurred."}),`
`]}),`
`,i(e.li,{children:[`
`,i(e.p,{children:[n(e.strong,{children:"errorMessage"}),": ",n(e.code,{children:"string"})]}),`
`,n(e.p,{children:"The error message."}),`
`]}),`
`]})]})}function y(r={}){const{wrapper:e}=r.components||{};return e?n(e,Object.assign({},r,{children:n(t,r)})):t(r)}const k="2024/1/31 15:22:24",v=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Chip, Link } from '@nextui-org/react'
import { Github } from 'lucide-react'

# \`usePlayer\`

This hook enables the implementation of basic functions of a music player, including play, pause, progress tracking, play mode, etc.

<Link
  href="https://github.com/codeacme17/echo-ui/blob/main/packages/hooks/usePlayer.ts"
  target="_blank"
  size="sm"
  className="flex items-center"
>
  <Github className="w-4 h-4" />
  <span className="ml-2">View Source</span>
</Link>

## Import

<CodeBlock code={\`import { usePlayer, type UsePlayerProps } from 'echo-ui'\`} />

## Parameters

### \`UsePlayerProps\`

- **volume**: \`number\`

  The volume of the audio, default is 5.

- **loop**: \`boolean\`

  Whether to loop the playback, default is false.

- **mute**: \`boolean\`

  Whether to mute the audio, default is false.

- **onReady**: \`() => void\`

  Callback function when the audio is ready.

- **onPlay**: \`() => void\`

  When the \`player\` instance is successfully initialized, the callback function when the audio is ready.

- **onPause**: \`() => void\`

  Callback function when the audio is paused.

- **onStop**: \`() => void\`

  Callback function when the audio stops.

- **onFinish**: \`() => void\`

  Callback function when the audio playback finishes.

- **onError**: \`() => void\`

  The callback function when an error occurs inside the hook.

## Return Values

### \`Object\`

- **init**: \`(audioBuffer: AudioBuffer, chain?: InputNode[]) => void\`

  Initialize Player instance

  :::tip{title=Note}

  The \`init\` function needs to be called after \`audioBuffer\` is obtained and all nodes in \`chain\` are initialized.

  :::

  - **audioBuffer(required)**: \`AudioBuffer\`

    The audio buffer can be obtained through <Link href='/zh/hook/useFetchAudio'>useFetchAudio</Link> hook

  - **chain**: \`AudioNode[]\`

    Audio node chain, connected nodes will be executed sequentially during playback. As shown in the following code, a \`filter\` node and an \`analyser\` node are connected. No need to add \`Tone.Destination\` node at the end

    <CodeBlock code={\`init(audioBuffer, [filter, analyzer])\`} />

- **player**: \`React.MutableRefObject<Tone.Player | null>\`

  The [Tone.Player](https://tonejs.github.io/docs/14.7.77/Player) instance created after initialization. Need to use \`.current\` to obtain.

- **audioDuration**: \`React.MutableRefObject<number>\`

  The duration of the audio in seconds. Need to use \`.current\` to obtain.

- **isReady**: \`boolean\`

  Whether the audio is ready.

- **isPlaying**: \`boolean\`

  Whether the audio is currently playing.

- **isFinish**: \`boolean\`

  Whether the audio playback has finished.

- **volume**: \`number\`

  The volume of the audio.

- **loop**: \`boolean\`

  Whether the audio is set to loop.

- **mute**: \`boolean\`

  Whether the audio is muted.

- **time**: \`number\`

  The current playback time of the audio in seconds.

- **percentage**: \`number\`

  The percentage of the current playback time relative to the total duration.

- **pickTime**: \`number\`

  The starting time of the audio playback in seconds.

- **play**: \`() => void\`

  Starts playing the audio.

- **pause**: \`() => void\`

  Pauses the audio playback.

- **stop**: \`() => void\`

  Stops the audio playback.

- **setPickTime**: \`(time: number) => void\`

  Sets the starting time of the audio playback in seconds.

- **setVolume**: \`(volume: number) => void\`

  Sets the volume of the audio.

- **setLoop**: \`(loop: boolean) => void\`

  Sets whether the audio should loop.

- **setMute**: \`(mute: boolean) => void\`

  Sets whether the audio should be muted.

- **getTime**: \`() => number\`

  Gets the current playback time and percentage. After calling, it updates the values of \`time\` and \`percentage\`. It can be called using a timer or \`requestAnimationFrame\`.

- **observe**: \`(callback: (time: number) => void) => void\`

  Listens for changes in playback time and percentage. Use this function to start monitoring and get real-time updates on \`time\` and \`percentage\`.

- **cancelObserve**: \`() => void\`

  Cancels the monitoring of changes in playback time and percentage.

- **error**: \`boolean\`

  Indicates whether an error has occurred.

- **errorMessage**: \`string\`

  The error message.
`;export{v as content,y as default,b as frontmatter,k as lastUpdatedTime,g as title,f as toc};
