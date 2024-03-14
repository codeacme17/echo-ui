import{d as P,c as J,U as B,A as ft,a as o}from"./index.978ae265.js";import x,{forwardRef as gt,useImperativeHandle as mt,useRef as G,useEffect as j,useState as V,useCallback as W}from"react";import{jsx as e,jsxs as Y}from"react/jsx-runtime";import{u as yt,a as xt}from"./usePlayer.db8858d9.js";import{h as bt}from"./index.6eef3859.js";import{s as q,l as St}from"./log.83f32a09.js";import{A as it}from"./Analyser.9e774fcc.js";import{t as wt,c as vt,i as At,a as tt,f as kt,b as lt,l as et}from"./transform.3e3dfeca.js";import{s as Et}from"./index.93441784.js";import{u as Rt,l as rt}from"./line.c32ceb13.js";import{n as nt,c as at}from"./natural.7ea22fd8.js";import{a as Tt}from"./area.16ffd65c.js";import{b as Dt,a as It}from"./axis.b2198668.js";import{B as ut}from"./index.2ccb91f8.js";import{K as $}from"./index.185caace.js";import{F as U}from"./Filter.b6cdeb55.js";function Mt(t,r){t=t.slice();var n=0,a=t.length-1,f=t[n],s=t[a],c;return s<f&&(c=n,n=a,a=c,c=f,f=s,s=c),t[n]=r.floor(f),t[a]=r.ceil(s),t}function ot(t){return Math.log(t)}function st(t){return Math.exp(t)}function Ft(t){return-Math.log(-t)}function Lt(t){return-Math.exp(-t)}function _t(t){return isFinite(t)?+("1e"+t):t<0?0:t}function Ct(t){return t===10?_t:t===Math.E?Math.exp:r=>Math.pow(t,r)}function Ht(t){return t===Math.E?Math.log:t===10&&Math.log10||t===2&&Math.log2||(t=Math.log(t),r=>Math.log(r)/t)}function ct(t){return(r,n)=>-t(-r,n)}function Ot(t){const r=t(ot,st),n=r.domain;let a=10,f,s;function c(){return f=Ht(a),s=Ct(a),n()[0]<0?(f=ct(f),s=ct(s),t(Ft,Lt)):t(ot,st),r}return r.base=function(h){return arguments.length?(a=+h,c()):a},r.domain=function(h){return arguments.length?(n(h),c()):n()},r.ticks=h=>{const i=n();let l=i[0],p=i[i.length-1];const y=p<l;y&&([l,p]=[p,l]);let u=f(l),m=f(p),g,d;const w=h==null?10:+h;let b=[];if(!(a%1)&&m-u<w){if(u=Math.floor(u),m=Math.ceil(m),l>0){for(;u<=m;++u)for(g=1;g<a;++g)if(d=u<0?g/s(-u):g*s(u),!(d<l)){if(d>p)break;b.push(d)}}else for(;u<=m;++u)for(g=a-1;g>=1;--g)if(d=u>0?g/s(-u):g*s(u),!(d<l)){if(d>p)break;b.push(d)}b.length*2<w&&(b=tt(l,p,w))}else b=tt(u,m,Math.min(m-u,w)).map(s);return y?b.reverse():b},r.tickFormat=(h,i)=>{if(h==null&&(h=10),i==null&&(i=a===10?"s":","),typeof i!="function"&&(!(a%1)&&(i=kt(i)).precision==null&&(i.trim=!0),i=lt(i)),h===1/0)return i;const l=Math.max(1,a*h/r.ticks().length);return p=>{let y=p/s(Math.round(f(p)));return y*a<a-.5&&(y*=a),y<=l?i(p):""}},r.nice=()=>n(Mt(n(),{floor:h=>s(Math.floor(f(h))),ceil:h=>s(Math.ceil(f(h)))})),r}function Z(){const t=Ot(wt()).domain([1,10]);return t.copy=()=>vt(t,Z()).base(t.base()),At.apply(t,arguments),t}const Nt=Et({slots:{base:`text-foreground
    flex
    justify-center
    rounded-lg
    bg-card`,svg:`w-full
    h-full
    flex
    items-center`}}),Gt=512*2,Q=44100,Wt=[-100,10],qt=360,zt=180,Pt="var(--echo-muted-foreground)",$t=[50,100,200,500,1e3,2e3,5e3,1e4],Qt=[-80,-60,-20,0],jt=2,Bt="var(--echo-primary)",Xt="var(--echo-background)",Kt="var(--echo-primary)",Vt="bottom",Ut=20,Yt=gt((t,r)=>{const{data:n=[],fftSize:a=Gt,amplitudeRange:f=Wt,lineColor:s=Bt,lineWidth:c=jt,axis:h=!1,axisColor:i=Pt,xAxisTicks:l=$t,yAxisTicks:p=Qt,grid:y=!1,gridColor:u=Xt,shadow:m=!1,shadowColor:g=Kt,shadowDirection:d=Vt,shadowHeight:w=Ut,...b}=t;mt(r,()=>R.current);const R=G(null),F=G(null),N=G(null),H=G(null),L=Rt(R,qt,zt,()=>{v(),X(),dt(),I(),O()});j(()=>{!R.current||D()},[]),j(()=>{I(),O()},[n]);const v=()=>{const{width:A,height:S}=L.current;N.current=Z().domain([20,Q/2]).range([0,A]),H.current=et().domain(f).range([S,0])},D=()=>{if(!m)return;const S=q(F.current).append("defs").append("linearGradient").attr("id","echo-area-gradient").attr("x1","0%").attr("x2","0%").attr("y1","0%").attr("y2","100%");S.append("stop").attr("offset",`${w}%`).attr("stop-color",g).attr("stop-opacity",.4),S.append("stop").attr("offset","100%").attr("stop-color","var(--echo-background)").attr("stop-opacity",0)},I=()=>{const A=q(F.current);if(A.selectAll("g.echo-g-line").remove(),!n.length)return;const{width:S,height:k}=L.current,_=A.append("g").attr("class","echo-g-line").attr("width",S).attr("height",k),C=Q/(a*2),T=n.map((E,K)=>({...E,frequency:K*C})),M=rt().x(E=>P(N.current,E.frequency,-300)).y(E=>P(H.current,E.amplitude,-300)).curve(nt).curve(at.alpha(.5));_.selectAll("path.echo-path-line").data([T]).join("path").attr("class","echo-path-line").attr("d",M).attr("stroke",s).attr("stroke-width",c).attr("fill","none")},O=()=>{if(!m)return;const A=q(F.current);if(A.selectAll("g.echo-g-shadow").remove(),!n.length)return;const{width:S,height:k}=L.current,_=A.append("g").attr("class","echo-g-shadow").attr("width",S).attr("height",k),C=Q/(a*2),T=n.map((E,K)=>({frequency:K*C,amplitude:E.amplitude===-1/0?-300:E.amplitude})),M=Tt().x(E=>P(N.current,E.frequency,-300)).y(E=>P(H.current,E.amplitude,-300)).y1(d==="top"?0:k).curve(nt).curve(at.alpha(.5));_.selectAll("path.echo-path-shadow").data([T]).join("path").attr("class","echo-path-shadow").attr("d",M).attr("fill","url(#echo-area-gradient)")},X=()=>{if(!y)return;const A=q(F.current);A.select("g.echo-g-grid").remove();const{width:S,height:k}=L.current,_=A.append("g").attr("class","echo-g-grid").attr("width",S).attr("height",k),C=rt().x(T=>T.x).y(T=>T.y);l.forEach(T=>{const M=N.current(T);_.append("path").attr("d",C([{x:M,y:0},{x:M,y:k}])).attr("stroke",u).attr("stroke-width",.5).attr("fill","none")}),p.forEach(T=>{const M=H.current(T);_.append("path").attr("d",C([{x:0,y:M},{x:S,y:M}])).attr("stroke",u).attr("stroke-width",.5).attr("fill","none").attr("transform","translate(0, -3)")})},dt=()=>{if(!h)return;const{width:A,height:S}=L.current,k=q(F.current);k.select("g.echo-g-x-axis").remove(),k.select("g.echo-g-y-axis").remove();const _=Dt(Z([20,Q/2],[0,A])).tickValues(l).tickFormat(lt("~s")).tickSize(0),C=It(et(f,[S,0])).tickValues(p).tickSize(0);k.append("g").attr("class","echo-g-x-axis").call(_).attr("transform",`translate(0, ${S-15})`).attr("color",i),k.append("g").attr("class","echo-g-y-axis").call(C).attr("transform",`translate(0, ${-3})`).attr("color",i),k.selectAll(".domain").style("display","none")},{base:ht,svg:pt}=Nt();return e("div",{ref:R,className:J(ht(),b.className),style:{...b.style,padding:0,overflow:"hidden",pointerEvents:"none",userSelect:"none"},children:e("svg",{ref:F,className:J(pt())})})}),z=Yt;z.displayName="Echo.Spectrogram";const Zt=1024,Jt=(t={})=>{const{fftSize:r=Zt}=t,n=G(null),a=G(0),[f,s]=V([]),[c,h]=V(!1),[i,l]=V(""),p=W(d=>{h(!0),l(d),St.error(d)},[]);j(()=>()=>{var d;(d=n.current)==null||d.dispose(),g()},[]),j(()=>{if(!(!n.current||c))try{n.current.size=r}catch(d){p(d)}},[r,p,c]);const y=W(()=>{try{n.current=new it("fft",r)}catch(d){p(d)}},[r,p]),u=W(()=>{if(!(!n.current||c))try{const d=n.current.getValue();if(d instanceof Float32Array){const w=Array.from(d).map((b,R)=>({frequency:R,amplitude:b}));s(w)}}catch(d){p(d)}},[c,p]),m=W(()=>{!n.current||c||(u(),a.current=requestAnimationFrame(m))},[u,c]),g=W(()=>{a.current&&!c&&(s([]),cancelAnimationFrame(a.current))},[c]);return{analyser:n,data:f,init:y,getData:u,observe:m,cancelObserve:g,error:c,errorMessage:i}},te=()=>{const t="/audios/loop-2.mp3",{audioBuffer:r,pending:n,fetchAudio:a}=yt({url:t}),{analyser:f,data:s,init:c,observe:h,cancelObserve:i}=Jt({fftSize:512}),{isPlaying:l,init:p,play:y,stop:u}=xt({onPlay:()=>h(),onPause:()=>i(),onStop:()=>i()});return x.useEffect(()=>{a(),c()},[]),x.useEffect(()=>{!f.current||p(r,[f.current])},[r,f.current]),Y("div",{className:"flex flex-col items-center gap-2",children:[e(z,{className:"w-full",data:s}),e(ut,{onClick:async()=>{l?u():y()},disabled:n,toggled:l,children:l?"Stop":"Start"})]})},ee=()=>{const t="/audios/loop-2.mp3",[r,n]=x.useState([]),[a,f]=x.useState(!1),s=x.useRef(),c=x.useRef(null),h=x.useRef(null),i=x.useRef(null),l=x.useRef(null),p=512/2,y=300,u=1500,m=4e3,[g,d]=x.useState(0),[w,b]=x.useState(0),[R,F]=x.useState(0);x.useEffect(()=>{var v,D;return c.current=new bt(t),s.current=new it("fft",p),h.current=new U(y,"lowshelf"),i.current=new U(u,"peaking"),l.current=new U(m,"highshelf"),c.current.connect(h.current),h.current.connect(i.current),(v=i.current)==null||v.connect(l.current),(D=l.current)==null||D.toDestination(),()=>{var I,O;(I=l.current)==null||I.disconnect(),(O=l.current)==null||O.dispose()}},[]),x.useEffect(()=>{var v,D,I;(v=h.current)==null||v.set({frequency:y,gain:g}),(D=i.current)==null||D.set({frequency:u,gain:w}),(I=l.current)==null||I.set({frequency:m,gain:R})},[g,w,R]);const N=async()=>{var v;if(!c.current||!s.current){console.error("Oscillator or Analyser is not initialized");return}a?(c.current.stop(),cancelAnimationFrame(H.current),n([]),f(!1)):((v=l.current)==null||v.connect(s.current),c.current.loop=!0,c.current.start(),f(!0),L())},H=x.useRef(0),L=()=>{var D;const v=(D=s.current)==null?void 0:D.getValue();if(v instanceof Float32Array){const I=Array.from(v).map((O,X)=>({frequency:X,amplitude:O}));n(I)}H.current=requestAnimationFrame(L)};return Y("div",{className:"w-full flex flex-col items-center gap-2",children:[Y($.Group,{size:50,trackWidth:2,pointerWidth:5,pointerHeight:5,min:-25,max:25,bilateral:!0,children:[e($,{topLabel:"LOW",bottomLabel:`${g}`,value:g,onChange:d}),e($,{topLabel:"MID",bottomLabel:`${w}`,value:w,onChange:b}),e($,{topLabel:"HIGH",bottomLabel:`${R}`,value:R,onChange:F})]}),e(z,{className:"w-full h-52",data:r,fftSize:p,axis:!0,grid:!0,shadow:!0}),e(ut,{onClick:N,toggled:a,children:a?"Stop":"Start"})]})},xe=()=>e(B,{code:"<SpectrogramDefault />",scope:{SpectrogramDefault:te},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/SpectrogramDefault.tsx",classNames:{preview:"p-0 px-3 py-5"}}),be=()=>e(B,{code:`<Spectrogram 
  axis 
  amplitudeRange={[-120, 20]} 
  xAxisTicks={[50, 500, 5000]} 
  yAxisTicks={[10, -60, -80]} 
/>`,scope:{Spectrogram:z}}),Se=()=>e(B,{code:`<Spectrogram 
  grid
  amplitudeRange={[-120, 20]} 
  xAxisTicks={[50, 500, 5000]} 
  yAxisTicks={[10, -60, -80]} 
/>`,scope:{Spectrogram:z}}),we=()=>e(B,{code:"<SpectrogramEQ3 />",scope:{SpectrogramEQ3:ee},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/SpectrogramEQ3.tsx",classNames:{preview:"p-0 px-3 py-5"}}),ve=()=>e(ft,{data:[{attribute:"data*",description:"Array data passed to the spectrogram(required)",type:e(o,{children:"SpectrogramDataPoint[]"}),default:"-"},{attribute:"fftSize",description:"Size of the Fast Fourier Transform (FFT) (must be a power of 2)",type:e(o,{children:"number"}),default:e(o,{children:"1024"})},{attribute:"amplitudeRange",description:"Amplitude range, this property specifies the range of the Y-axis",type:e(o,{children:"[number, number]"}),default:e(o,{children:"[-100, 10]"})},{attribute:"lineColor",description:"Line color",type:e(o,{children:"string"}),default:e(o,{children:"'var(--echo-primary)'"})},{attribute:"lineWidth",description:"Line width",type:e(o,{children:"number"}),default:e(o,{children:"2"})},{attribute:"axis",description:"Whether to display the axis",type:e(o,{children:"boolean"}),default:e(o,{children:"false"})},{attribute:"axisColor",description:"Axis font color",type:e(o,{children:"string"}),default:e(o,{children:"'var(--echo-muted-foreground)'"})},{attribute:"xAxisTicks",description:"Ticks displayed on the X-axis",type:e(o,{children:"number[]"}),default:e(o,{children:"[50, 100, 200, 500, 1000, 2000, 5000, 10000]"})},{attribute:"yAxisTicks",description:"Ticks displayed on the Y-axis",type:e(o,{children:"number[]"}),default:e(o,{children:"[-80, -60, -20, 0]"})},{attribute:"grid",description:"Whether to display grid lines",type:e(o,{children:"boolean"}),default:e(o,{children:"false"})},{attribute:"gridColor",description:"Grid line color",type:e(o,{children:"string"}),default:e(o,{children:"'var(--echo-background)'"})},{attribute:"shadow",description:"Whether to display shadow",type:e(o,{children:"boolean"}),default:e(o,{children:"false"})},{attribute:"shadowColor",description:"Shadow color",type:e(o,{children:"string"}),default:e(o,{children:"'var(--echo-primary)'"})},{attribute:"shadowDirection",description:"Shadow direction",type:e(o,{children:"'top' | 'bottom'"}),default:e(o,{children:"'bottom'"})},{attribute:"shadowHeight",description:"Shadow height",type:e(o,{children:"number"}),default:e(o,{children:"20"})}]});export{be as A,xe as D,we as E,Se as G,ve as S};
