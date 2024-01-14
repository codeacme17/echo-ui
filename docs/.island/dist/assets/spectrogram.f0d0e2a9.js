import{jsxs as o,jsx as t,Fragment as V}from"react/jsx-runtime";import{C as N}from"./CodeBlock.15abbd2c.js";import{V as Q,s as O,G as C,U as R}from"./index.723a15ef.js";import s from"react";import{T as _,o as k,c as v,b as P,G as H,S as T,r as U,d as $,e as Z,i as J,P as z}from"./index.5a6550a4.js";import{A as G}from"./Analyser.93bf318f.js";import{A as K,c as n}from"./index.55340fb1.js";import"react-dom";import"./_commonjsHelpers.4e997714.js";class F extends _{constructor(){super(k(F.getDefaults(),arguments,["frequency","type"])),this.name="BiquadFilter";const e=k(F.getDefaults(),arguments,["frequency","type"]);this._filter=this.context.createBiquadFilter(),this.input=this.output=this._filter,this.Q=new v({context:this.context,units:"number",value:e.Q,param:this._filter.Q}),this.frequency=new v({context:this.context,units:"frequency",value:e.frequency,param:this._filter.frequency}),this.detune=new v({context:this.context,units:"cents",value:e.detune,param:this._filter.detune}),this.gain=new v({context:this.context,units:"decibels",convert:!1,value:e.gain,param:this._filter.gain}),this.type=e.type}static getDefaults(){return Object.assign(_.getDefaults(),{Q:1,type:"lowpass",frequency:350,detune:0,gain:0})}get type(){return this._filter.type}set type(e){P(["lowpass","highpass","bandpass","lowshelf","highshelf","notch","allpass","peaking"].indexOf(e)!==-1,`Invalid filter type: ${e}`),this._filter.type=e}getFrequencyResponse(e=128){const c=new Float32Array(e);for(let r=0;r<e;r++){const f=Math.pow(r/e,2)*(2e4-20)+20;c[r]=f}const a=new Float32Array(e),l=new Float32Array(e),i=this.context.createBiquadFilter();return i.type=this.type,i.Q.value=this.Q.value,i.frequency.value=this.frequency.value,i.gain.value=this.gain.value,i.getFrequencyResponse(c,a,l),a}dispose(){return super.dispose(),this._filter.disconnect(),this.Q.dispose(),this.frequency.dispose(),this.gain.dispose(),this.detune.dispose(),this}}class A extends _{constructor(){super(k(A.getDefaults(),arguments,["frequency","type","rolloff"])),this.name="Filter",this.input=new H({context:this.context}),this.output=new H({context:this.context}),this._filters=[];const e=k(A.getDefaults(),arguments,["frequency","type","rolloff"]);this._filters=[],this.Q=new T({context:this.context,units:"positive",value:e.Q}),this.frequency=new T({context:this.context,units:"frequency",value:e.frequency}),this.detune=new T({context:this.context,units:"cents",value:e.detune}),this.gain=new T({context:this.context,units:"decibels",convert:!1,value:e.gain}),this._type=e.type,this.rolloff=e.rolloff,U(this,["detune","frequency","gain","Q"])}static getDefaults(){return Object.assign(_.getDefaults(),{Q:1,detune:0,frequency:350,gain:0,rolloff:-12,type:"lowpass"})}get type(){return this._type}set type(e){P(["lowpass","highpass","bandpass","lowshelf","highshelf","notch","allpass","peaking"].indexOf(e)!==-1,`Invalid filter type: ${e}`),this._type=e,this._filters.forEach(a=>a.type=e)}get rolloff(){return this._rolloff}set rolloff(e){const c=J(e)?e:parseInt(e,10),a=[-12,-24,-48,-96];let l=a.indexOf(c);P(l!==-1,`rolloff can only be ${a.join(", ")}`),l+=1,this._rolloff=c,this.input.disconnect(),this._filters.forEach(i=>i.disconnect()),this._filters=new Array(l);for(let i=0;i<l;i++){const r=new F({context:this.context});r.type=this._type,this.frequency.connect(r.frequency),this.detune.connect(r.detune),this.Q.connect(r.Q),this.gain.connect(r.gain),this._filters[i]=r}this._internalChannels=this._filters,$(this.input,...this._internalChannels,this.output)}getFrequencyResponse(e=128){const c=new F({frequency:this.frequency.value,gain:this.gain.value,Q:this.Q.value,type:this._type,detune:this.detune.value}),a=new Float32Array(e).map(()=>1);return this._filters.forEach(()=>{c.getFrequencyResponse(e).forEach((i,r)=>a[r]*=i)}),c.dispose(),a}dispose(){return super.dispose(),this._filters.forEach(e=>{e.dispose()}),Z(this,["detune","frequency","gain","Q"]),this.frequency.dispose(),this.Q.dispose(),this.detune.dispose(),this.gain.dispose(),this}}const ee=()=>{const u="https://codeacme17.github.io/1llest-waveform-vue/audios/loop-3.mp3",[e,c]=s.useState([]),[a,l]=s.useState(!1),i=s.useRef(),r=s.useRef(null),p=512/2;s.useEffect(()=>(r.current=new z(u),i.current=new G("fft",p),r.current.toDestination(),()=>{var m,g;(m=r.current)==null||m.disconnect(),(g=r.current)==null||g.dispose()}),[]);const f=async()=>{if(!r.current||!i.current){console.error("Analyser is not initialized");return}a?(r.current.stop(),cancelAnimationFrame(h.current),c([]),l(!1)):(r.current.connect(i.current),r.current.loop=!0,r.current.start(),l(!0),S())},h=s.useRef(0),S=()=>{var g;const m=(g=i.current)==null?void 0:g.getValue();if(m instanceof Float32Array){const w=Array.from(m).map((b,B)=>({frequency:B,amplitude:b}));c(w)}h.current=requestAnimationFrame(S)};return o("div",{className:"flex flex-col items-center gap-2",children:[t(Q,{className:"w-full",data:e,fftSize:p}),t(O,{onClick:f,toggled:a,children:a?"Stop":"Start"})]})},te=()=>{const u="https://codeacme17.github.io/1llest-waveform-vue/audios/loop-2.mp3",[e,c]=s.useState([]),[a,l]=s.useState(!1),i=s.useRef(),r=s.useRef(null),p=s.useRef(null),f=s.useRef(null),h=s.useRef(null),S=512/2,m=300,g=1500,w=4e3,[b,B]=s.useState(0),[D,X]=s.useState(0),[E,j]=s.useState(0);s.useEffect(()=>{var d,y;return r.current=new z(u),i.current=new G("fft",S),p.current=new A(m,"lowshelf"),f.current=new A(g,"peaking"),h.current=new A(w,"highshelf"),r.current.connect(p.current),p.current.connect(f.current),(d=f.current)==null||d.connect(h.current),(y=h.current)==null||y.toDestination(),()=>{var x,q;(x=h.current)==null||x.disconnect(),(q=h.current)==null||q.dispose()}},[]),s.useEffect(()=>{var d,y,x;(d=p.current)==null||d.set({frequency:m,gain:b}),(y=f.current)==null||y.set({frequency:g,gain:D}),(x=h.current)==null||x.set({frequency:w,gain:E})},[b,D,E]);const W=async()=>{var d;if(!r.current||!i.current){console.error("Oscillator or Analyser is not initialized");return}a?(r.current.stop(),cancelAnimationFrame(I.current),c([]),l(!1)):((d=h.current)==null||d.connect(i.current),r.current.loop=!0,r.current.start(),l(!0),L())},I=s.useRef(0),L=()=>{var y;const d=(y=i.current)==null?void 0:y.getValue();if(d instanceof Float32Array){const x=Array.from(d).map((q,Y)=>({frequency:Y,amplitude:q}));c(x)}I.current=requestAnimationFrame(L)};return o("div",{className:"w-full flex flex-col items-center gap-2",children:[o(C.Group,{size:50,trackWidth:2,pointerWidth:5,pointerHeight:5,min:-25,max:25,bilateral:!0,children:[t(C,{topLabel:"LOW",bottomLabel:`${b}`,value:b,onChange:B}),t(C,{topLabel:"MID",bottomLabel:`${D}`,value:D,onChange:X}),t(C,{topLabel:"HIGH",bottomLabel:`${E}`,value:E,onChange:j})]}),t(Q,{className:"w-full h-52",data:e,fftSize:S,axis:!0,grid:!0,shadow:!0}),t(O,{onClick:W,toggled:a,children:a?"Stop":"Start"})]})},ne=()=>t(R,{code:"<SpectrogramDefault />",scope:{SpectrogramDefault:ee},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/SpectrogramDefault.tsx",classNames:{preview:"p-0 px-3 py-5"}}),re=()=>t(R,{code:`<Spectrogram 
  axis 
  amplitudeRange={[-120, 20]} 
  xAxisTicks={[50, 500, 5000]} 
  yAxisTicks={[10, -60, -80]} 
/>`,scope:{Spectrogram:Q}}),ie=()=>t(R,{code:`<Spectrogram 
  grid
  amplitudeRange={[-120, 20]} 
  xAxisTicks={[50, 500, 5000]} 
  yAxisTicks={[10, -60, -80]} 
/>`,scope:{Spectrogram:Q}}),se=()=>t(R,{code:"<SpectrogramEQ3 />",scope:{SpectrogramEQ3:te},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/SpectrogramEQ3.tsx",classNames:{preview:"p-0 px-3 py-5"}}),ae=()=>t(K,{data:[{attribute:"data",description:"\u6307\u793A\u706F\u662F\u5426\u5F00\u542F",type:t(n,{children:"SpectrogramDataPoint[]"}),default:"-"},{attribute:"fftSize",description:"\u5FEB\u901F\u5085\u7ACB\u53F6\u53D8\u6362\u7684\u5927\u5C0F(\u5FC5\u987B\u4E3A 2 \u7684\u6307\u6570)",type:t(n,{children:" number "}),default:t(n,{children:"1024"})},{attribute:"amplitudeRange",description:"\u632F\u5E45\u8303\u56F4\uFF0C\u8BE5\u5C5E\u6027\u53EF\u4EE5\u6307\u5B9A Y \u8F74\u7684\u8303\u56F4",type:t(n,{children:"[number, number]"}),default:t(n,{children:"[-100, 10]"})},{attribute:"lineColor",description:"\u7EBF\u6761\u989C\u8272",type:t(n,{children:"string"}),default:t(n,{children:"'var(--echo-primary)'"})},{attribute:"lineWidth",description:"\u7EBF\u6761\u5BBD\u5EA6",type:t(n,{children:"number"}),default:t(n,{children:"2"})},{attribute:"axis",description:"\u662F\u5426\u663E\u793A\u5750\u6807\u8F74",type:t(n,{children:"boolean"}),default:t(n,{children:"false"})},{attribute:"axisColor",description:"\u5750\u6807\u8F74\u5B57\u4F53\u989C\u8272",type:t(n,{children:"string"}),default:t(n,{children:"'var(--echo-muted-foreground)'"})},{attribute:"xAxisTicks",description:"X \u8F74\u5C55\u793A\u7684\u523B\u5EA6",type:t(n,{children:"number[]"}),default:t(n,{children:"[50, 100, 200, 500, 1000, 2000, 5000, 10000]"})},{attribute:"xAxisTicks",description:"X \u8F74\u5C55\u793A\u7684\u523B\u5EA6",type:t(n,{children:"number[]"}),default:t(n,{children:"[50, 100, 200, 500, 1000, 2000, 5000, 10000]"})},{attribute:"yAxisTicks",description:"Y \u8F74\u5C55\u793A\u7684\u523B\u5EA6",type:t(n,{children:"number[]"}),default:t(n,{children:"[-80, -60, -20, 0]"})},{attribute:"grid",description:"\u662F\u5426\u663E\u793A\u7F51\u683C\u7EBF",type:t(n,{children:"boolean"}),default:t(n,{children:"false"})},{attribute:"gridColor",description:"\u7F51\u683C\u7EBF\u989C\u8272",type:t(n,{children:"string"}),default:t(n,{children:"'var(--echo-background)'"})},{attribute:"shadow",description:"\u662F\u5426\u663E\u793A\u9634\u5F71",type:t(n,{children:"boolean"}),default:t(n,{children:"false"})},{attribute:"shadowColor",description:"\u9634\u5F71\u989C\u8272",type:t(n,{children:"string"}),default:t(n,{children:"'var(--echo-primary)'"})},{attribute:"shadowDirection",description:"\u9634\u5F71\u65B9\u5411",type:t(n,{children:"'top' | 'bottom'"}),default:t(n,{children:"'bottom'"})},{attribute:"shadowHeight",description:"\u9634\u5F71\u7684\u9AD8\u5EA6",type:t(n,{children:" number "}),default:t(n,{children:"20"})}]}),ge=void 0,ye=[{id:"\u7279\u6027",text:"\u7279\u6027",depth:2},{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"\u97F3\u9891\u6570\u636E",text:"\u97F3\u9891\u6570\u636E",depth:3},{id:"\u5750\u6807\u8F74",text:"\u5750\u6807\u8F74",depth:3},{id:"\u7F51\u683C",text:"\u7F51\u683C",depth:3},{id:"\u5E94\u7528\u573A\u666Feq3",text:"\u5E94\u7528\u573A\u666F\uFF1AEQ3",depth:3},{id:"api",text:"API",depth:2},{id:"spectrogram",text:"Spectrogram",depth:3},{id:"\u7C7B\u578B\u58F0\u660E",text:"\u7C7B\u578B\u58F0\u660E",depth:2}],xe="Spectrogram \u9891\u8C31\u56FE";function M(u){const e=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code"},u.components);return o(V,{children:[o(e.h1,{id:"spectrogram-\u9891\u8C31\u56FE",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#spectrogram-\u9891\u8C31\u56FE",children:"#"}),"Spectrogram \u9891\u8C31\u56FE"]}),`
`,t(e.p,{children:"Spectrogram \u7EC4\u4EF6\u662F\u4E00\u4E2A\u7528\u4E8E\u97F3\u9891\u6570\u636E\u53EF\u89C6\u5316\u7684\u9AD8\u7EA7\u3001\u53EF\u5B9A\u5236\u7684\u5DE5\u5177\uFF0C\u5B83\u5E95\u5C42\u57FA\u4E8E D3.js\uFF0C\u6765\u6E32\u67D3\u4EA4\u4E92\u5F0F\u548C\u52A8\u6001\u7684\u9891\u8C31\u663E\u793A\u3002\u8FD9\u4E2A\u7EC4\u4EF6\u5177\u6709\u9AD8\u5EA6\u7684\u53EF\u9002\u5E94\u6027\uFF0C\u975E\u5E38\u9002\u5408\u9700\u8981\u8BE6\u7EC6\u548C\u7CBE\u786E\u97F3\u9891\u9891\u7387\u5206\u6790\u7684\u5E94\u7528"}),`
`,o(e.h2,{id:"\u7279\u6027",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7279\u6027",children:"#"}),"\u7279\u6027"]}),`
`,t(e.p,{children:"Spectrogram \u662F\u4F7F\u7528\u5FEB\u901F\u5085\u91CC\u53F6\u53D8\u6362\uFF08FFT\uFF09\u7684\u5927\u5C0F\u8FDB\u884C\u9891\u8C31\u5206\u6790\u7684\uFF0C\u5B83\u53EF\u4EE5\u5728\u9891\u8C31\u56FE\u4E0A\u663E\u793A\u97F3\u9891\u7684\u9891\u7387\u548C\u80FD\u91CF"}),`
`,o(e.h2,{id:"\u5F15\u5165",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,t(N,{code:"import { Spectrogram } from 'echo-ui'"}),`
`,o(e.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,t(ne,{}),`
`,o(e.h3,{id:"\u97F3\u9891\u6570\u636E",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u97F3\u9891\u6570\u636E",children:"#"}),"\u97F3\u9891\u6570\u636E"]}),`
`,o(e.p,{children:["\u97F3\u9891\u6570\u636E\u662F\u4E00\u4E2A\u6570\u7EC4\uFF0C\u5B83\u7684\u6BCF\u4E00\u9879\u662F\u4E00\u4E2A\u5BF9\u8C61 ",t(e.code,{children:"SpectrogramDataPoint"}),"\u3002\u5176\u4E2D ",t(e.code,{children:"frequency"})," \u8868\u793A\u9891\u7387\uFF0C",t(e.code,{children:"amplitude"})," \u8868\u793A\u632F\u5E45\uFF0C\u8FD9\u4E9B\u6570\u636E\u90FD\u53EF\u4EE5\u901A\u8FC7 ",t(e.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/",target:"_blank",rel:"nofollow",children:"AnalyserNode"})," \u6765\u83B7\u53D6\u3002\u8FD9\u662F\u8BE5\u5BF9\u8C61\u7684\u7C7B\u578B\u58F0\u660E\uFF1A"]}),`
`,t(N,{code:`interface SpectrogramDataPoint { 
  frequency: number 
  amplitude: number 
}`}),`
`,o(e.h3,{id:"\u5750\u6807\u8F74",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5750\u6807\u8F74",children:"#"}),"\u5750\u6807\u8F74"]}),`
`,t(re,{}),`
`,o(e.p,{children:["\u5750\u6807\u8F74\u7684 X \u8F74\u8DDD\u8868\u793A\u9891\u7387\uFF0CY \u8F74\u8DDD\u8868\u793A\u632F\u5E45\u3002\u5176\u4E2D X \u8F74\u7684\u8303\u56F4\u65E0\u6CD5\u81EA\u5B9A\u4E49\u56E0\u4E3A\u5B83\u662F\u6839\u636E\u97F3\u9891\u7684\u91C7\u6837\u7387\u8BA1\u7B97\u800C\u6765\u7684\uFF0CY \u8F74\u7684\u8303\u56F4\u53EF\u4EE5\u901A\u8FC7\u8BBE\u7F6E ",t(e.code,{children:"amplitudeRange"})," \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49\u3002 X\u3001Y \u8F74\u7684\u5750\u6807\u8868\u53EF\u4EE5\u5206\u522B\u901A\u8FC7 ",t(e.code,{children:"xAxisTicks"})," \u548C ",t(e.code,{children:"yAxisTicks"})," \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49"]}),`
`,o(e.h3,{id:"\u7F51\u683C",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7F51\u683C",children:"#"}),"\u7F51\u683C"]}),`
`,t(ie,{}),`
`,t(e.p,{children:"\u7F51\u683C\u662F\u6839\u636E\u5750\u6807\u8F74\u7684\u523B\u5EA6\u6765\u7ED8\u5236\u7684"}),`
`,o(e.h3,{id:"\u5E94\u7528\u573A\u666Feq3",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5E94\u7528\u573A\u666Feq3",children:"#"}),"\u5E94\u7528\u573A\u666F\uFF1AEQ3"]}),`
`,t(se,{}),`
`,t(e.p,{children:"\u4E0A\u9762\u5C55\u793A\u7684\u662F\u4E00\u4E2A EQ3 \u7684\u5E94\u7528\u573A\u666F\uFF0C\u5B83\u662F\u4E00\u4E2A\u4E09\u6BB5\u5F0F\u7684\u5747\u8861\u5668\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8C03\u8282\u4E09\u4E2A\u9891\u6BB5\u7684\u589E\u76CA\u6765\u8C03\u6574\u97F3\u9891\u7684\u97F3\u8272\uFF0C\u4ECE\u800C\u901A\u8FC7 Spectrogram \u7EC4\u4EF6\u6765\u5B9E\u65F6\u663E\u793A\u97F3\u9891\u7684\u53D8\u5316"}),`
`,o(e.h2,{id:"api",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#api",children:"#"}),"API"]}),`
`,o(e.h3,{id:"spectrogram",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#spectrogram",children:"#"}),"Spectrogram"]}),`
`,t(ae,{}),`
`,o(e.h2,{id:"\u7C7B\u578B\u58F0\u660E",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7C7B\u578B\u58F0\u660E",children:"#"}),"\u7C7B\u578B\u58F0\u660E"]}),`
`,t(N,{code:`export interface SpectrogramProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: SpectrogramDataPoint[]
  fftSize?: number
  amplitudeRange?: [number, number]
  lineColor?: string
  lineWidth?: number
  axis?: boolean
  axisColor?: string
  xAxisTicks?: number[]
  yAxisTicks?: number[]
  grid?: boolean
  gridColor?: string
  shadow?: boolean
  shadowColor?: string
  shadowDirection?: 'top' | 'bottom'
  shadowHeight?: number
}

export interface SpectrogramDataPoint {
  frequency: number
  amplitude: number
}

export interface SpectrogramRef extends HTMLDivElement {}
`})]})}function be(u={}){const{wrapper:e}=u.components||{};return e?t(e,Object.assign({},u,{children:t(M,u)})):M(u)}const Ae="2024/1/13 22:58:34",Se=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'
import { Default, Axis, Grid, EQ3 } from '../../src/components/UsageBox/Spectrogram.tsx'
import { Link } from '@nextui-org/react'
import { SpectrogramtAPITable } from '../../src/components/APITable/Spectrogram.tsx'

# Spectrogram \u9891\u8C31\u56FE

Spectrogram \u7EC4\u4EF6\u662F\u4E00\u4E2A\u7528\u4E8E\u97F3\u9891\u6570\u636E\u53EF\u89C6\u5316\u7684\u9AD8\u7EA7\u3001\u53EF\u5B9A\u5236\u7684\u5DE5\u5177\uFF0C\u5B83\u5E95\u5C42\u57FA\u4E8E D3.js\uFF0C\u6765\u6E32\u67D3\u4EA4\u4E92\u5F0F\u548C\u52A8\u6001\u7684\u9891\u8C31\u663E\u793A\u3002\u8FD9\u4E2A\u7EC4\u4EF6\u5177\u6709\u9AD8\u5EA6\u7684\u53EF\u9002\u5E94\u6027\uFF0C\u975E\u5E38\u9002\u5408\u9700\u8981\u8BE6\u7EC6\u548C\u7CBE\u786E\u97F3\u9891\u9891\u7387\u5206\u6790\u7684\u5E94\u7528

## \u7279\u6027

Spectrogram \u662F\u4F7F\u7528\u5FEB\u901F\u5085\u91CC\u53F6\u53D8\u6362\uFF08FFT\uFF09\u7684\u5927\u5C0F\u8FDB\u884C\u9891\u8C31\u5206\u6790\u7684\uFF0C\u5B83\u53EF\u4EE5\u5728\u9891\u8C31\u56FE\u4E0A\u663E\u793A\u97F3\u9891\u7684\u9891\u7387\u548C\u80FD\u91CF

## \u5F15\u5165

<CodeBlock code={\`import { Spectrogram } from 'echo-ui'\`} />

## \u4EE3\u7801\u6F14\u793A

<Default />

### \u97F3\u9891\u6570\u636E

\u97F3\u9891\u6570\u636E\u662F\u4E00\u4E2A\u6570\u7EC4\uFF0C\u5B83\u7684\u6BCF\u4E00\u9879\u662F\u4E00\u4E2A\u5BF9\u8C61 \`SpectrogramDataPoint\`\u3002\u5176\u4E2D \`frequency\` \u8868\u793A\u9891\u7387\uFF0C\`amplitude\` \u8868\u793A\u632F\u5E45\uFF0C\u8FD9\u4E9B\u6570\u636E\u90FD\u53EF\u4EE5\u901A\u8FC7 [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/) \u6765\u83B7\u53D6\u3002\u8FD9\u662F\u8BE5\u5BF9\u8C61\u7684\u7C7B\u578B\u58F0\u660E\uFF1A

<CodeBlock
  code={\`interface SpectrogramDataPoint { 
  frequency: number 
  amplitude: number 
}\`}
/>

### \u5750\u6807\u8F74

<Axis />

\u5750\u6807\u8F74\u7684 X \u8F74\u8DDD\u8868\u793A\u9891\u7387\uFF0CY \u8F74\u8DDD\u8868\u793A\u632F\u5E45\u3002\u5176\u4E2D X \u8F74\u7684\u8303\u56F4\u65E0\u6CD5\u81EA\u5B9A\u4E49\u56E0\u4E3A\u5B83\u662F\u6839\u636E\u97F3\u9891\u7684\u91C7\u6837\u7387\u8BA1\u7B97\u800C\u6765\u7684\uFF0CY \u8F74\u7684\u8303\u56F4\u53EF\u4EE5\u901A\u8FC7\u8BBE\u7F6E \`amplitudeRange\` \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49\u3002 X\u3001Y \u8F74\u7684\u5750\u6807\u8868\u53EF\u4EE5\u5206\u522B\u901A\u8FC7 \`xAxisTicks\` \u548C \`yAxisTicks\` \u5C5E\u6027\u6765\u81EA\u5B9A\u4E49

### \u7F51\u683C

<Grid />

\u7F51\u683C\u662F\u6839\u636E\u5750\u6807\u8F74\u7684\u523B\u5EA6\u6765\u7ED8\u5236\u7684

### \u5E94\u7528\u573A\u666F\uFF1AEQ3

<EQ3 />

\u4E0A\u9762\u5C55\u793A\u7684\u662F\u4E00\u4E2A EQ3 \u7684\u5E94\u7528\u573A\u666F\uFF0C\u5B83\u662F\u4E00\u4E2A\u4E09\u6BB5\u5F0F\u7684\u5747\u8861\u5668\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8C03\u8282\u4E09\u4E2A\u9891\u6BB5\u7684\u589E\u76CA\u6765\u8C03\u6574\u97F3\u9891\u7684\u97F3\u8272\uFF0C\u4ECE\u800C\u901A\u8FC7 Spectrogram \u7EC4\u4EF6\u6765\u5B9E\u65F6\u663E\u793A\u97F3\u9891\u7684\u53D8\u5316

## API

### Spectrogram

<SpectrogramtAPITable />

## \u7C7B\u578B\u58F0\u660E

<CodeBlock
  code={\`export interface SpectrogramProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: SpectrogramDataPoint[]
  fftSize?: number
  amplitudeRange?: [number, number]
  lineColor?: string
  lineWidth?: number
  axis?: boolean
  axisColor?: string
  xAxisTicks?: number[]
  yAxisTicks?: number[]
  grid?: boolean
  gridColor?: string
  shadow?: boolean
  shadowColor?: string
  shadowDirection?: 'top' | 'bottom'
  shadowHeight?: number
}

export interface SpectrogramDataPoint {
  frequency: number
  amplitude: number
}

export interface SpectrogramRef extends HTMLDivElement {}
\`} />
`;export{Se as content,be as default,ge as frontmatter,Ae as lastUpdatedTime,xe as title,ye as toc};
