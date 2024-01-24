import{j as z,B,g as M,i as E,p as G,$ as A,U as R,A as V,c as s}from"./index.bf22460a.js";import a from"react";import{jsxs as C,jsx as t}from"react/jsx-runtime";import{T as D,o as T,c as Q,b as L,G as P,S as F,r as U,d as Y,w as X,i as Z,P as J}from"./index.194ce9d9.js";import{A as K}from"./Analyser.525c4ea2.js";class m extends D{constructor(){super(T(m.getDefaults(),arguments,["frequency","type"])),this.name="BiquadFilter";const e=T(m.getDefaults(),arguments,["frequency","type"]);this._filter=this.context.createBiquadFilter(),this.input=this.output=this._filter,this.Q=new Q({context:this.context,units:"number",value:e.Q,param:this._filter.Q}),this.frequency=new Q({context:this.context,units:"frequency",value:e.frequency,param:this._filter.frequency}),this.detune=new Q({context:this.context,units:"cents",value:e.detune,param:this._filter.detune}),this.gain=new Q({context:this.context,units:"decibels",convert:!1,value:e.gain,param:this._filter.gain}),this.type=e.type}static getDefaults(){return Object.assign(D.getDefaults(),{Q:1,type:"lowpass",frequency:350,detune:0,gain:0})}get type(){return this._filter.type}set type(e){L(["lowpass","highpass","bandpass","lowshelf","highshelf","notch","allpass","peaking"].indexOf(e)!==-1,`Invalid filter type: ${e}`),this._filter.type=e}getFrequencyResponse(e=128){const o=new Float32Array(e);for(let n=0;n<e;n++){const p=Math.pow(n/e,2)*(2e4-20)+20;o[n]=p}const i=new Float32Array(e),c=new Float32Array(e),r=this.context.createBiquadFilter();return r.type=this.type,r.Q.value=this.Q.value,r.frequency.value=this.frequency.value,r.gain.value=this.gain.value,r.getFrequencyResponse(o,i,c),i}dispose(){return super.dispose(),this._filter.disconnect(),this.Q.dispose(),this.frequency.dispose(),this.gain.dispose(),this.detune.dispose(),this}}class y extends D{constructor(){super(T(y.getDefaults(),arguments,["frequency","type","rolloff"])),this.name="Filter",this.input=new P({context:this.context}),this.output=new P({context:this.context}),this._filters=[];const e=T(y.getDefaults(),arguments,["frequency","type","rolloff"]);this._filters=[],this.Q=new F({context:this.context,units:"positive",value:e.Q}),this.frequency=new F({context:this.context,units:"frequency",value:e.frequency}),this.detune=new F({context:this.context,units:"cents",value:e.detune}),this.gain=new F({context:this.context,units:"decibels",convert:!1,value:e.gain}),this._type=e.type,this.rolloff=e.rolloff,U(this,["detune","frequency","gain","Q"])}static getDefaults(){return Object.assign(D.getDefaults(),{Q:1,detune:0,frequency:350,gain:0,rolloff:-12,type:"lowpass"})}get type(){return this._type}set type(e){L(["lowpass","highpass","bandpass","lowshelf","highshelf","notch","allpass","peaking"].indexOf(e)!==-1,`Invalid filter type: ${e}`),this._type=e,this._filters.forEach(i=>i.type=e)}get rolloff(){return this._rolloff}set rolloff(e){const o=Z(e)?e:parseInt(e,10),i=[-12,-24,-48,-96];let c=i.indexOf(o);L(c!==-1,`rolloff can only be ${i.join(", ")}`),c+=1,this._rolloff=o,this.input.disconnect(),this._filters.forEach(r=>r.disconnect()),this._filters=new Array(c);for(let r=0;r<c;r++){const n=new m({context:this.context});n.type=this._type,this.frequency.connect(n.frequency),this.detune.connect(n.detune),this.Q.connect(n.Q),this.gain.connect(n.gain),this._filters[r]=n}this._internalChannels=this._filters,Y(this.input,...this._internalChannels,this.output)}getFrequencyResponse(e=128){const o=new m({frequency:this.frequency.value,gain:this.gain.value,Q:this.Q.value,type:this._type,detune:this.detune.value}),i=new Float32Array(e).map(()=>1);return this._filters.forEach(()=>{o.getFrequencyResponse(e).forEach((r,n)=>i[n]*=r)}),o.dispose(),i}dispose(){return super.dispose(),this._filters.forEach(e=>{e.dispose()}),X(this,["detune","frequency","gain","Q"]),this.frequency.dispose(),this.Q.dispose(),this.detune.dispose(),this.gain.dispose(),this}}const ee=()=>{const h="/audios/loop-2.mp3",{audioBuffer:e,pending:o,fetchAudio:i}=z({url:h}),{analyser:c,data:r,init:n,observe:f,cancelObserve:p}=B({fftSize:512}),{isPlaying:l,init:x,play:b,stop:w}=M({onPlay:()=>f(),onPause:()=>p(),onStop:()=>p()});return a.useEffect(()=>{i(),n()},[]),a.useEffect(()=>{!c||x(e,[c])},[e,c]),C("div",{className:"flex flex-col items-center gap-2",children:[t(E,{className:"w-full",data:r}),t(G,{onClick:async()=>{l?w():b()},disabled:o,toggled:l,children:l?"Stop":"Start"})]})},te=()=>{const h="/audios/loop-2.mp3",[e,o]=a.useState([]),[i,c]=a.useState(!1),r=a.useRef(),n=a.useRef(null),f=a.useRef(null),p=a.useRef(null),l=a.useRef(null),x=512/2,b=300,w=1500,k=4e3,[q,N]=a.useState(0),[v,H]=a.useState(0),[S,W]=a.useState(0);a.useEffect(()=>{var u,d;return n.current=new J(h),r.current=new K("fft",x),f.current=new y(b,"lowshelf"),p.current=new y(w,"peaking"),l.current=new y(k,"highshelf"),n.current.connect(f.current),f.current.connect(p.current),(u=p.current)==null||u.connect(l.current),(d=l.current)==null||d.toDestination(),()=>{var g,_;(g=l.current)==null||g.disconnect(),(_=l.current)==null||_.dispose()}},[]),a.useEffect(()=>{var u,d,g;(u=f.current)==null||u.set({frequency:b,gain:q}),(d=p.current)==null||d.set({frequency:w,gain:v}),(g=l.current)==null||g.set({frequency:k,gain:S})},[q,v,S]);const $=async()=>{var u;if(!n.current||!r.current){console.error("Oscillator or Analyser is not initialized");return}i?(n.current.stop(),cancelAnimationFrame(I.current),o([]),c(!1)):((u=l.current)==null||u.connect(r.current),n.current.loop=!0,n.current.start(),c(!0),O())},I=a.useRef(0),O=()=>{var d;const u=(d=r.current)==null?void 0:d.getValue();if(u instanceof Float32Array){const g=Array.from(u).map((_,j)=>({frequency:j,amplitude:_}));o(g)}I.current=requestAnimationFrame(O)};return C("div",{className:"w-full flex flex-col items-center gap-2",children:[C(A.Group,{size:50,trackWidth:2,pointerWidth:5,pointerHeight:5,min:-25,max:25,bilateral:!0,children:[t(A,{topLabel:"LOW",bottomLabel:`${q}`,value:q,onChange:N}),t(A,{topLabel:"MID",bottomLabel:`${v}`,value:v,onChange:H}),t(A,{topLabel:"HIGH",bottomLabel:`${S}`,value:S,onChange:W})]}),t(E,{className:"w-full h-52",data:e,fftSize:x,axis:!0,grid:!0,shadow:!0}),t(G,{onClick:$,toggled:i,children:i?"Stop":"Start"})]})},ae=()=>t(R,{code:"<SpectrogramDefault />",scope:{SpectrogramDefault:ee},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/SpectrogramDefault.tsx",classNames:{preview:"p-0 px-3 py-5"}}),ce=()=>t(R,{code:`<Spectrogram 
  axis 
  amplitudeRange={[-120, 20]} 
  xAxisTicks={[50, 500, 5000]} 
  yAxisTicks={[10, -60, -80]} 
/>`,scope:{Spectrogram:E}}),le=()=>t(R,{code:`<Spectrogram 
  grid
  amplitudeRange={[-120, 20]} 
  xAxisTicks={[50, 500, 5000]} 
  yAxisTicks={[10, -60, -80]} 
/>`,scope:{Spectrogram:E}}),ue=()=>t(R,{code:"<SpectrogramEQ3 />",scope:{SpectrogramEQ3:te},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/SpectrogramEQ3.tsx",classNames:{preview:"p-0 px-3 py-5"}}),pe=()=>t(V,{data:[{attribute:"data*",description:"Array data passed to the spectrogram(required)",type:t(s,{children:"SpectrogramDataPoint[]"}),default:"-"},{attribute:"fftSize",description:"Size of the Fast Fourier Transform (FFT) (must be a power of 2)",type:t(s,{children:"number"}),default:t(s,{children:"1024"})},{attribute:"amplitudeRange",description:"Amplitude range, this property specifies the range of the Y-axis",type:t(s,{children:"[number, number]"}),default:t(s,{children:"[-100, 10]"})},{attribute:"lineColor",description:"Line color",type:t(s,{children:"string"}),default:t(s,{children:"'var(--echo-primary)'"})},{attribute:"lineWidth",description:"Line width",type:t(s,{children:"number"}),default:t(s,{children:"2"})},{attribute:"axis",description:"Whether to display the axis",type:t(s,{children:"boolean"}),default:t(s,{children:"false"})},{attribute:"axisColor",description:"Axis font color",type:t(s,{children:"string"}),default:t(s,{children:"'var(--echo-muted-foreground)'"})},{attribute:"xAxisTicks",description:"Ticks displayed on the X-axis",type:t(s,{children:"number[]"}),default:t(s,{children:"[50, 100, 200, 500, 1000, 2000, 5000, 10000]"})},{attribute:"yAxisTicks",description:"Ticks displayed on the Y-axis",type:t(s,{children:"number[]"}),default:t(s,{children:"[-80, -60, -20, 0]"})},{attribute:"grid",description:"Whether to display grid lines",type:t(s,{children:"boolean"}),default:t(s,{children:"false"})},{attribute:"gridColor",description:"Grid line color",type:t(s,{children:"string"}),default:t(s,{children:"'var(--echo-background)'"})},{attribute:"shadow",description:"Whether to display shadow",type:t(s,{children:"boolean"}),default:t(s,{children:"false"})},{attribute:"shadowColor",description:"Shadow color",type:t(s,{children:"string"}),default:t(s,{children:"'var(--echo-primary)'"})},{attribute:"shadowDirection",description:"Shadow direction",type:t(s,{children:"'top' | 'bottom'"}),default:t(s,{children:"'bottom'"})},{attribute:"shadowHeight",description:"Shadow height",type:t(s,{children:"number"}),default:t(s,{children:"20"})}]});export{ce as A,ae as D,ue as E,le as G,pe as S};