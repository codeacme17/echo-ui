import{jsxs as s,jsx as e,Fragment as C}from"react/jsx-runtime";import{C as f}from"./CodeBlock.15abbd2c.js";import{a as E,s as P,U as y}from"./index.723a15ef.js";import{P as F}from"./index.5a6550a4.js";import*as a from"react";import{A as B}from"./Analyser.93bf318f.js";import{A as R,c}from"./index.55340fb1.js";import"react-dom";import"./_commonjsHelpers.4e997714.js";const T=()=>{const n="https://codeacme17.github.io/1llest-waveform-vue/audios/loop-5.mp3",[t,d]=a.useState([]),[u,p]=a.useState(!1),l=a.useRef(),o=a.useRef(null),x=512*2;a.useEffect(()=>(o.current=new F(n),l.current=new B("waveform",x),o.current.toDestination(),()=>{var r,i;(r=o.current)==null||r.disconnect(),(i=o.current)==null||i.dispose()}),[]);const O=async()=>{var r;if(!o.current||!l.current){console.error("Oscillator or Analyser is not initialized");return}u?(o.current.stop(),cancelAnimationFrame(m.current),d([]),p(!1)):((r=o.current)==null||r.connect(l.current),o.current.loop=!0,o.current.start(),p(!0),h())},m=a.useRef(0),h=()=>{var i;const r=(i=l.current)==null?void 0:i.getValue();if(r instanceof Float32Array){const g=Array.from(r).map((A,D)=>({index:D,amplitude:A}));d(g)}m.current=requestAnimationFrame(h)};return s("section",{className:"flex flex-col items-center gap-2",children:[e(E,{className:"w-full",data:t}),e(P,{onClick:O,toggled:u,children:u?"Stop":"Start"})]})},I=()=>e(y,{code:"<OscilloscopeDefault />",scope:{OscilloscopeDefault:T},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/OscilloscopeDefault.tsx"}),k=()=>e(R,{data:[{attribute:"data",description:"\u4F20\u9012\u7ED9\u793A\u6CE2\u5668\u7684\u6570\u7EC4\u6570\u636E",type:e(c,{children:"OscilloscopeDataPoint[]"}),default:"-"},{attribute:"amplitudeRange",description:"\u632F\u5E45\u8303\u56F4\uFF0C\u8BE5\u5C5E\u6027\u53EF\u4EE5\u6307\u5B9A Y \u8F74\u7684\u8303\u56F4",type:e(c,{children:"[number, number]"}),default:e(c,{children:" [-2, 2]"})},{attribute:"lineColor",description:"\u793A\u6CE2\u5668\u7684\u7EBF\u6761\u989C\u8272",type:e(c,{children:"string"}),default:e(c,{children:"'var(--echo-primary)'"})},{attribute:"lineWidth",description:"\u793A\u6CE2\u5668\u7684\u7EBF\u6761\u5BBD\u5EA6",type:e(c,{children:"number"}),default:e(c,{children:"3"})}]}),H=void 0,W=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"api",text:"API",depth:2},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],_="Oscilloscope \u793A\u6CE2\u5668";function b(n){const t=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2"},n.components);return s(C,{children:[s(t.h1,{id:"oscilloscope-\u793A\u6CE2\u5668",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#oscilloscope-\u793A\u6CE2\u5668",children:"#"}),"Oscilloscope \u793A\u6CE2\u5668"]}),`
`,e(t.p,{children:"\u5B9E\u65F6\u53EF\u89C6\u5316\u97F3\u9891\u6CE2\u5F62\uFF0C\u663E\u793A\u4FE1\u53F7\u5E45\u5EA6\u548C\u9891\u7387\u968F\u65F6\u95F4\u7684\u53D8\u5316"}),`
`,s(t.h2,{id:"\u5F15\u5165",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,e(f,{code:"import { Oscilloscope } from 'echo-ui'"}),`
`,s(t.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,e(I,{}),`
`,s(t.h2,{id:"api",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,e(k,{}),`
`,s(t.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,e(f,{code:`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {
  data: OscilloscopeDataPoint[]
  amplitudeRange?: [number, number]
  lineColor?: string
  lineWidth?: number
}

export interface OscilloscopeDataPoint {
  index: number
  amplitude: number
}

export interface OscilloscopeRef extends HTMLDivElement {}
`})]})}function q(n={}){const{wrapper:t}=n.components||{};return t?e(t,Object.assign({},n,{children:e(b,n)})):b(n)}const z="2024/1/10 10:10:15",X=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Defualt } from '../../src/components/UsageBox/Oscilloscope.tsx'
import { OscilloscopeAPITable } from '../../src/components/APITable/oscilloscope.tsx'

# Oscilloscope \u793A\u6CE2\u5668

\u5B9E\u65F6\u53EF\u89C6\u5316\u97F3\u9891\u6CE2\u5F62\uFF0C\u663E\u793A\u4FE1\u53F7\u5E45\u5EA6\u548C\u9891\u7387\u968F\u65F6\u95F4\u7684\u53D8\u5316

## \u5F15\u5165

<CodeBlock code={\`import { Oscilloscope } from 'echo-ui'\`} />

## \u4EE3\u7801\u6F14\u793A

<Defualt />

## API

<OscilloscopeAPITable />

## \u7C7B\u578B\u58F0\u660E

<CodeBlock code={\`export interface OscilloscopeProps extends React.HTMLAttributes<OscilloscopeRef> {
  data: OscilloscopeDataPoint[]
  amplitudeRange?: [number, number]
  lineColor?: string
  lineWidth?: number
}

export interface OscilloscopeDataPoint {
  index: number
  amplitude: number
}

export interface OscilloscopeRef extends HTMLDivElement {}
\`} />
`;export{X as content,q as default,H as frontmatter,z as lastUpdatedTime,_ as title,W as toc};
