import{j as x,f as P,g as N,p as V,C as c,U as n,A as E,c as t}from"./index.bf22460a.js";import i from"react";import{jsxs as M,jsx as e}from"react/jsx-runtime";import{S as C,P as w}from"./square.113dfb30.js";const k=()=>{const a="/audios/loop-1.mp3",{pending:s,error:u,audioBuffer:o,fetchAudio:d}=x({url:a}),{meter:l,value:p,init:m,observe:f,cancelObserve:h}=P({value:-60}),{player:b,isPlaying:r,play:y,stop:v,init:g}=N({onPlay:f,onStop:h});return i.useEffect(()=>{d(),m()},[]),i.useEffect(()=>{!o||!l||g(o,[l])},[o,l]),M("section",{className:"flex flex-col items-center w-full justify-center",children:[e(V,{disabled:s||u,onClick:()=>{!b||(r?v():y())},toggled:r,className:"mb-4 mt-auto",children:r?e(C,{className:"w-4 h-4 fill-current"}):e(w,{className:"w-4 h-4 fill-current"})}),e(c,{value:p})]})},A=()=>{const a="/audios/loop-1.mp3",{pending:s,error:u,audioBuffer:o,fetchAudio:d}=x({url:a}),{meter:l,value:p,init:m,observe:f,cancelObserve:h}=P({value:-60}),{player:b,isPlaying:r,play:y,stop:v,init:g}=N({onPlay:f,onStop:h});return i.useEffect(()=>{d(),m()},[]),i.useEffect(()=>{!o||!l||g(o,[l])},[o,l]),M("section",{className:"flex flex-col items-center w-full justify-center",children:[e(V,{disabled:s||u,onClick:()=>{!b||(r?v():y())},toggled:r,className:"mb-4 mt-auto",children:r?e(C,{className:"w-4 h-4 fill-current"}):e(w,{className:"w-4 h-4 fill-current"})}),e(c,{value:p,classNames:{lump:`
          data-[active=none]:bg-slate-200
          data-[active=low]:bg-indigo-700
          data-[active=medium]:bg-indigo-600
          data-[active=high]:bg-indigo-400
          dark:data-[active=none]:bg-slate-800
          dark:data-[active=low]:bg-indigo-400
          dark:data-[active=medium]:bg-indigo-500
          dark:data-[active=high]:bg-indigo-600`}})]})},j=()=>{const a="/audios/loop-1.mp3",{pending:s,error:u,audioBuffer:o,fetchAudio:d}=x({url:a}),{meter:l,value:p,init:m,observe:f,cancelObserve:h}=P({value:[-60,-60]}),{player:b,isPlaying:r,play:y,stop:v,init:g}=N({onPlay:f,onStop:h});return i.useEffect(()=>{d(),m()},[]),i.useEffect(()=>{!o||!l||g(o,[l])},[o,l]),M("section",{className:"flex flex-col justify-center items-center",children:[e(V,{disabled:s||u,onClick:()=>{!b||(r?v():y())},toggled:r,className:"mb-5",children:r?e(C,{className:"w-4 h-4 fill-current"}):e(w,{className:"w-4 h-4 fill-current"})}),e(c,{value:p,lumpsQuantity:30})]})},B=()=>e(n,{code:"<VuMeterDefault />",scope:{VuMeterDefault:k},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/VuMeterDefault.tsx",classNames:{preview:"p-0 px-3 py-10"}}),R=()=>e(n,{code:"<VuMeter horizontal/>",scope:{VuMeter:c},classNames:{preview:"p-0 pl-10 py-10"}}),H=()=>e(n,{code:"<VuMeterStereo />",scope:{VuMeterStereo:j},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/VuMeterStereo.tsx"}),O=()=>e(n,{code:`<div className='flex gap-16'>
  <div> <VuMeter lumpsQuantity={40} /> </div>
  <div> <VuMeter lumpsQuantity={50} /> </div>
</div>`,scope:{VuMeter:c},classNames:{preview:"p-0 pl-10 py-10"}}),_=()=>e(n,{code:`<div className='flex gap-20'>
  <VuMeter compact lumpsQuantity={50} value={-10}/>
  <VuMeter compact lumpsQuantity={50} value={[5, 0]}/>
</div>`,scope:{VuMeter:c},classNames:{preview:"p-0 pl-10 py-10"}}),q=()=>e(n,{code:"<VuMeterColor />",scope:{VuMeterColor:A},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/VuMeterColor.tsx",classNames:{preview:"p-0 px-3 py-10"}}),I=()=>e(E,{data:[{attribute:"value*",description:"The current volume value. Enables stereo mode when passing an array (required)",type:e(t,{children:"number | number[]"}),default:"-"},{attribute:"horizontal",description:"Enable horizontal mode",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"compact",description:"Enable compact mode",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"lumpsQuantity",description:"Number of volume bars",type:e(t,{children:"number"}),default:e(t,{children:"30"})},{attribute:"hideAxis",description:"Hide axis",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"axisProps",description:"Props passed to the Axis component",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"classNames",description:"Custom class names",type:e(t,{children:"{ lump?: string, lumps?: string, axis?: string }"}),default:"-"},{attribute:"styles",description:"Custom styles",type:e(t,{children:"{ lump?: React.CSSProperties, lumps?: React.CSSProperties, axis?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"Callback function when the value changes",type:e(t,{children:"(value: number | number[]) => void"}),default:"-"}]});export{_ as C,B as D,R as H,O as L,H as S,I as V,q as a};
