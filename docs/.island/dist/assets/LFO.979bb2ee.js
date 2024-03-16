import{c as B,v as K,U as J,A as rt,a as u}from"./index.b2cccce0.js";import _,{forwardRef as ot,useRef as k,useImperativeHandle as ct,useEffect as ht,useMemo as A}from"react";import{S as O,o as d,G as y,c as ut,a as C,M as lt,b as W,d as pt,T as F,P as q,O as V,e as dt,r as M,f as mt,W as ft}from"./index.6eef3859.js";import{jsx as e,jsxs as T}from"react/jsx-runtime";import{B as D}from"./index.6b8ad651.js";import{S as gt,a as _t,T as yt}from"./Triangle.2f45397e.js";import{P as xt}from"./pause.821e66c4.js";import{P as bt}from"./play.c5eb55f2.js";import{l as Q}from"./transform.3e3dfeca.js";import{u as vt,l as wt}from"./line.c32ceb13.js";import{s as St}from"./index.93441784.js";import{s as qt}from"./log.83f32a09.js";import{K as L}from"./index.06c04839.js";import{F as Dt}from"./Filter.b6cdeb55.js";class G extends O{constructor(){super(Object.assign(d(G.getDefaults(),arguments,["value"]))),this.override=!1,this.name="Add",this._sum=new y({context:this.context}),this.input=this._sum,this.output=this._sum,this.addend=this._param,ut(this._constantSource,this._sum)}static getDefaults(){return Object.assign(O.getDefaults(),{value:0})}dispose(){return super.dispose(),this._sum.dispose(),this}}class I extends C{constructor(){super(Object.assign(d(I.getDefaults(),arguments,["min","max"]))),this.name="Scale";const t=d(I.getDefaults(),arguments,["min","max"]);this._mult=this.input=new lt({context:this.context,value:t.max-t.min}),this._add=this.output=new G({context:this.context,value:t.min}),this._min=t.min,this._max=t.max,this.input.connect(this.output)}static getDefaults(){return Object.assign(C.getDefaults(),{max:1,min:0})}get min(){return this._min}set min(t){this._min=t,this._setRange()}get max(){return this._max}set max(t){this._max=t,this._setRange()}_setRange(){this._add.value=this._min,this._mult.value=this._max-this._min}dispose(){return super.dispose(),this._add.dispose(),this._mult.dispose(),this}}class z extends C{constructor(){super(Object.assign(d(z.getDefaults(),arguments))),this.name="Zero",this._gain=new y({context:this.context}),this.output=this._gain,this.input=void 0,W(this.context.getConstant(0),this._gain)}dispose(){return super.dispose(),pt(this.context.getConstant(0),this._gain),this}}class P extends F{constructor(){super(d(P.getDefaults(),arguments,["frequency","min","max"])),this.name="LFO",this._stoppedValue=0,this._units="number",this.convert=!0,this._fromType=q.prototype._fromType,this._toType=q.prototype._toType,this._is=q.prototype._is,this._clampValue=q.prototype._clampValue;const t=d(P.getDefaults(),arguments,["frequency","min","max"]);this._oscillator=new V(t),this.frequency=this._oscillator.frequency,this._amplitudeGain=new y({context:this.context,gain:t.amplitude,units:"normalRange"}),this.amplitude=this._amplitudeGain.gain,this._stoppedSignal=new O({context:this.context,units:"audioRange",value:0}),this._zeros=new z({context:this.context}),this._a2g=new dt({context:this.context}),this._scaler=this.output=new I({context:this.context,max:t.max,min:t.min}),this.units=t.units,this.min=t.min,this.max=t.max,this._oscillator.chain(this._amplitudeGain,this._a2g,this._scaler),this._zeros.connect(this._a2g),this._stoppedSignal.connect(this._a2g),M(this,["amplitude","frequency"]),this.phase=t.phase}static getDefaults(){return Object.assign(V.getDefaults(),{amplitude:1,frequency:"4n",max:1,min:0,type:"sine",units:"number"})}start(t){return t=this.toSeconds(t),this._stoppedSignal.setValueAtTime(0,t),this._oscillator.start(t),this}stop(t){return t=this.toSeconds(t),this._stoppedSignal.setValueAtTime(this._stoppedValue,t),this._oscillator.stop(t),this}sync(){return this._oscillator.sync(),this._oscillator.syncFrequency(),this}unsync(){return this._oscillator.unsync(),this._oscillator.unsyncFrequency(),this}_setStoppedValue(){this._stoppedValue=this._oscillator.getInitialValue(),this._stoppedSignal.value=this._stoppedValue}get min(){return this._toType(this._scaler.min)}set min(t){t=this._fromType(t),this._scaler.min=t}get max(){return this._toType(this._scaler.max)}set max(t){t=this._fromType(t),this._scaler.max=t}get type(){return this._oscillator.type}set type(t){this._oscillator.type=t,this._setStoppedValue()}get partials(){return this._oscillator.partials}set partials(t){this._oscillator.partials=t,this._setStoppedValue()}get phase(){return this._oscillator.phase}set phase(t){this._oscillator.phase=t,this._setStoppedValue()}get units(){return this._units}set units(t){const s=this.min,i=this.max;this._units=t,this.min=s,this.max=i}get state(){return this._oscillator.state}connect(t,s,i){return(t instanceof q||t instanceof O)&&(this.convert=t.convert,this.units=t.units),mt(this,t,s,i),this}dispose(){return super.dispose(),this._oscillator.dispose(),this._stoppedSignal.dispose(),this._zeros.dispose(),this._scaler.dispose(),this._a2g.dispose(),this._amplitudeGain.dispose(),this.amplitude.dispose(),this}}class Ot extends C{constructor(){super(...arguments),this.name="GainToAudio",this._norm=new ft({context:this.context,mapping:t=>Math.abs(t)*2-1}),this.input=this._norm,this.output=this._norm}dispose(){return super.dispose(),this._norm.dispose(),this}}class E extends F{constructor(){super(Object.assign(d(E.getDefaults(),arguments,["fade"]))),this.name="CrossFade",this._panner=this.context.createStereoPanner(),this._split=this.context.createChannelSplitter(2),this._g2a=new Ot({context:this.context}),this.a=new y({context:this.context,gain:0}),this.b=new y({context:this.context,gain:0}),this.output=new y({context:this.context}),this._internalChannels=[this.a,this.b];const t=d(E.getDefaults(),arguments,["fade"]);this.fade=new O({context:this.context,units:"normalRange",value:t.fade}),M(this,"fade"),this.context.getConstant(1).connect(this._panner),this._panner.connect(this._split),this._panner.channelCount=1,this._panner.channelCountMode="explicit",W(this._split,this.a.gain,0),W(this._split,this.b.gain,1),this.fade.chain(this._g2a,this._panner.pan),this.a.connect(this.output),this.b.connect(this.output)}static getDefaults(){return Object.assign(F.getDefaults(),{fade:.5})}dispose(){return super.dispose(),this.a.dispose(),this.b.dispose(),this.output.dispose(),this.fade.dispose(),this._g2a.dispose(),this._panner.disconnect(),this._split.disconnect(),this}}class $ extends F{constructor(t){super(t),this.name="Effect",this._dryWet=new E({context:this.context}),this.wet=this._dryWet.fade,this.effectSend=new y({context:this.context}),this.effectReturn=new y({context:this.context}),this.input=new y({context:this.context}),this.output=this._dryWet,this.input.fan(this._dryWet.a,this.effectSend),this.effectReturn.connect(this._dryWet.b),this.wet.setValueAtTime(t.wet,0),this._internalChannels=[this.effectReturn,this.effectSend],M(this,"wet")}static getDefaults(){return Object.assign(F.getDefaults(),{wet:1})}connectEffect(t){return this._internalChannels.push(t),this.effectSend.chain(t,this.effectReturn),this}dispose(){return super.dispose(),this._dryWet.dispose(),this.effectSend.dispose(),this.effectReturn.dispose(),this.wet.dispose(),this}}class Z extends ${constructor(t){super(t),this.name="LFOEffect",this._lfo=new P({context:this.context,frequency:t.frequency,amplitude:t.depth}),this.depth=this._lfo.amplitude,this.frequency=this._lfo.frequency,this.type=t.type,M(this,["frequency","depth"])}static getDefaults(){return Object.assign($.getDefaults(),{frequency:1,type:"sine",depth:1})}start(t){return this._lfo.start(t),this}stop(t){return this._lfo.stop(t),this}sync(){return this._lfo.sync(),this}unsync(){return this._lfo.unsync(),this}get type(){return this._lfo.type}set type(t){this._lfo.type=t}dispose(){return super.dispose(),this._lfo.dispose(),this.frequency.dispose(),this.depth.dispose(),this}}class j extends Z{constructor(){super(d(j.getDefaults(),arguments,["frequency","baseFrequency","octaves"])),this.name="AutoFilter";const t=d(j.getDefaults(),arguments,["frequency","baseFrequency","octaves"]);this.filter=new Dt(Object.assign(t.filter,{context:this.context})),this.connectEffect(this.filter),this._lfo.connect(this.filter.frequency),this.octaves=t.octaves,this.baseFrequency=t.baseFrequency}static getDefaults(){return Object.assign(Z.getDefaults(),{baseFrequency:200,octaves:2.6,filter:{type:"lowpass",rolloff:-12,Q:1}})}get baseFrequency(){return this._lfo.min}set baseFrequency(t){this._lfo.min=this.toFrequency(t),this.octaves=this._octaves}get octaves(){return this._octaves}set octaves(t){this._octaves=t,this._lfo.max=this._lfo.min*Math.pow(2,t)}dispose(){return super.dispose(),this.filter.dispose(),this}}function N(n,t,s){n=+n,t=+t,s=(o=arguments.length)<2?(t=n,n=0,1):o<3?1:+s;for(var i=-1,o=Math.max(0,Math.ceil((t-n)/s))|0,b=new Array(o);++i<o;)b[i]=n+i*s;return b}const Ft=St({slots:{base:`text-foreground
    h-full
    w-full
    flex
    justify-center
    rounded-lg
    bg-card`,svg:`w-full
    h-full
    flex
    items-center`}}),Tt="sine",Lt=1,Ct=.5,It=0,Pt="var(--echo-primary)",Et=3,jt=360,Mt=100,Rt=ot((n,t)=>{const{type:s=Tt,frequency:i=Lt,amplitude:o=Ct,delay:b=It,lineWidth:m=Et,lineColor:x=Pt,...v}=n,a=K(o,0,1),w=K(b,0,1e3),p=k(null),f=k(null),S=k(null);ct(t,()=>p.current),ht(()=>{Y(),X()},[i,a,w,s,m,x]);const U=vt(p,jt,Mt,()=>{Y(),X()},!0,{frequency:i,amplitude:a,delay:w}),Y=()=>{const{width:r,height:c}=U.current;f.current=Q().domain([0,1]).range([0,r]),S.current=Q().domain([0,1]).range([c,0])},X=()=>{if(s!=="sine"&&s!=="square"&&s!=="triangle")return;const{width:r,height:c}=U.current,l=qt(p.current).select("svg").attr("width",r).attr("height",c);l.selectAll("*").remove(),i===0&&l.append("line").attr("x1",0).attr("y1",c/2).attr("x2",r).attr("y2",c/2).attr("stroke",x).attr("stroke-width",m);const g=w/1e3;w>0&&(l.append("circle").attr("cx",g).attr("cy",S.current(.5)).attr("r",m/2).attr("fill",x),l.append("line").attr("x1",0).attr("y1",S.current(.5)).attr("x2",f.current(g)+1).attr("y2",S.current(.5)).attr("stroke",x).attr("stroke-width",m));let h=[];switch(s){case"sine":h=tt;break;case"square":h=et;break;case"triangle":h=st;break}const at=wt().x(R=>f.current(R.x)).y(R=>S.current(R.y));l.append("path").datum(h).attr("fill","none").attr("stroke",x).attr("stroke-width",m).attr("d",at).attr("transform",`translate(${g*r}, 0)`)},tt=A(()=>s!=="sine"?[]:N(0,1,.001).map(r=>{const c=r*2*Math.PI*i,l=Math.sin(c)*a*.5+.5;return{x:r,y:l}}),[s,i,a]),et=A(()=>{if(s!=="square")return[];const r=.5,c=r*a;return[{x:0,y:r}].concat(N(0,1,.001).map(l=>{const g=l*2*Math.PI*i,h=Math.floor(g/Math.PI)%2===0?r+c:r-c;return{x:l,y:h}}))},[s,i,a]),st=A(()=>{if(s!=="triangle")return[];const r=.5;return N(0,1,.001).map(c=>{const g=(c*2*Math.PI*i+Math.PI/2)%(2*Math.PI)/Math.PI;let h;return g<1?h=g*a:h=(2-g)*a,h=h-a/2+r,{x:c,y:h}})},[s,i,a]),{base:nt,svg:it}=Ft();return e("div",{ref:p,className:B(nt(),v.className),style:{...v.style,padding:0,overflow:"hidden",pointerEvents:"none",userSelect:"none"},children:e("svg",{className:B(it())})})}),H=Rt;H.displayName="EchoUI.LFO";const kt=()=>{const[n,t]=_.useState("sine"),[s,i]=_.useState(1),[o,b]=_.useState(.7),[m,x]=_.useState(!1),v=_.useRef(null),a=_.useRef(null);_.useEffect(()=>{v.current=new j({frequency:s,depth:1}).toDestination().start(),a.current=new V({volume:-(1-o)*100,frequency:s}).connect(v.current)},[]),_.useEffect(()=>{var p,f;(p=v.current)==null||p.set({frequency:s}),(f=a.current)==null||f.set({type:n,frequency:440,volume:-(1-o)*60})},[n,s,o]);const w=()=>{var p,f;m?((p=a.current)==null||p.stop(),x(!1)):((f=a.current)==null||f.start(),x(!0))};return T("section",{className:"h-32 mb-32 mx-auto",children:[T(D.Group,{className:"mb-2",radius:"sm",children:[e(D,{toggled:n==="sine",onClick:()=>t("sine"),children:e(gt,{})}),e(D,{toggled:n==="square",onClick:()=>t("square"),children:e(_t,{})}),e(D,{toggled:n==="triangle",onClick:()=>t("triangle"),children:e(yt,{})}),e(D,{onClick:w,toggled:m,className:"data-[toggled='true']:bg-green-500",children:m?e(xt,{className:"fill-current",size:15}):e(bt,{className:"fill-current",size:15})})]}),e(H,{amplitude:o,frequency:s,type:n}),T(L.Group,{className:"mt-2 flex justify-center",size:40,trackWidth:3,pointerHeight:6,children:[e(L,{value:s,onChange:i,topLabel:"Frequency",min:1,max:15,step:1,bottomLabel:s+"Hz"}),e(L,{className:"mr-3",value:o,min:0,max:1,step:.1,onChange:b,topLabel:"Amplitude",bottomLabel:o*100+"%"})]})]})},At=()=>{const[n,t]=_.useState(1);return T("section",{className:"",children:[e(H,{delay:n,className:"h-32",frequency:2}),e(L,{value:n,onChange:t,className:"mt-3",topLabel:"Delay",min:1,max:1e3,step:1,sensitivity:10,size:40,trackWidth:3,pointerHeight:6,bottomLabel:n+"ms"})]})},Jt=()=>e(J,{code:"<LFODefault />",scope:{LFODefault:kt},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/LFODefault.tsx"}),te=()=>e(J,{code:"<LFODelay />",scope:{LFODelay:At},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/LFODelay.tsx"}),ee=()=>e(rt,{data:[{attribute:"frequency",description:"Controls the frequency of the waveform in Hertz (Hz). Frequency determines the number of cycles per second.",type:e(u,{children:"number"}),default:e(u,{children:"1"})},{attribute:"amplitude",description:"Controls the amplitude of the waveform. Amplitude determines the height of the waveform's peak. (range: 0-1)",type:e(u,{children:"number"}),default:e(u,{children:"0"})},{attribute:"delay",description:"Sets the delay time before the waveform starts, in milliseconds (ms). This can be used to create a pause effect before the waveform begins. (range: 0-1000)",type:e(u,{children:"number"}),default:e(u,{children:"0"})},{attribute:"type",description:"Specifies the type of the waveform. Options include sine wave ('sine'), square wave ('square'), and triangle wave ('triangle').",type:e(u,{children:"'sine' | 'square' | 'triangle'"}),default:e(u,{children:"'sine'"})},{attribute:"lineColor",description:"Sets the color of the waveform line. Can be any valid CSS color value.",type:e(u,{children:"string"}),default:e(u,{children:"'var(--echo-primary)'"})},{attribute:"lineWidth",description:"Determines the thickness of the waveform line, in pixels.",type:e(u,{children:"number"}),default:e(u,{children:"3"})}]});export{Jt as D,ee as L,te as a};