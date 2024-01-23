import{e as b,B as y,j as v,f as g,C as l,U as c,A as C,c as t}from"./index.b6b2392c.js";import{jsxs as x,jsx as e}from"react/jsx-runtime";import{S as N,P}from"./square.03af2c16.js";const M=()=>{const a="/audios/loop-1.mp3",{pending:s,error:r,audioBuffer:n}=b({url:a}),{meter:i,value:u,observe:d,cancelObserve:p}=y({value:-60}),{player:m,isPlaying:o,play:h,stop:f}=v({audioBuffer:n,chain:[i],onPlay:d,onStop:p});return x("section",{className:"flex flex-col items-center w-full justify-center",children:[e(g,{disabled:s||r,onClick:()=>{!m||(o?f():h())},toggled:o,className:"mb-4 mt-auto",children:o?e(N,{className:"w-4 h-4 fill-current"}):e(P,{className:"w-4 h-4 fill-current"})}),e(l,{value:u})]})},w=()=>{const a="/audios/loop-1.mp3",{pending:s,error:r,audioBuffer:n}=b({url:a}),{meter:i,value:u,observe:d,cancelObserve:p}=y({value:-60}),{player:m,isPlaying:o,play:h,stop:f}=v({audioBuffer:n,chain:[i],onPlay:d,onStop:p});return x("section",{className:"flex flex-col items-center w-full justify-center",children:[e(g,{disabled:s||r,onClick:()=>{!m||(o?f():h())},toggled:o,className:"mb-4 mt-auto",children:o?e(N,{className:"w-4 h-4 fill-current"}):e(P,{className:"w-4 h-4 fill-current"})}),e(l,{value:u,classNames:{lump:`
          data-[active=none]:bg-slate-200
          data-[active=low]:bg-indigo-700
          data-[active=medium]:bg-indigo-600
          data-[active=high]:bg-indigo-400
          dark:data-[active=none]:bg-slate-800
          dark:data-[active=low]:bg-indigo-400
          dark:data-[active=medium]:bg-indigo-500
          dark:data-[active=high]:bg-indigo-600`}})]})},S=()=>{const a="/audios/loop-1.mp3",{pending:s,error:r,audioBuffer:n}=b({url:a}),{meter:i,value:u,observe:d,cancelObserve:p}=y({value:[-60,-60]}),{player:m,isPlaying:o,play:h,stop:f}=v({audioBuffer:n,chain:[i],onPlay:d,onStop:p});return x("section",{className:"flex flex-col justify-center items-center",children:[e(g,{disabled:s||r,onClick:()=>{!m||(o?f():h())},toggled:o,className:"mb-5",children:o?e(N,{className:"w-4 h-4 fill-current"}):e(P,{className:"w-4 h-4 fill-current"})}),e(l,{value:u,lumpsQuantity:30})]})},E=()=>e(c,{code:"<VuMeterDefault />",scope:{VuMeterDefault:M},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/VuMeterDefault.tsx",classNames:{preview:"p-0 px-3 py-10"}}),Q=()=>e(c,{code:"<VuMeter horizontal/>",scope:{VuMeter:l},classNames:{preview:"p-0 pl-10 py-10"}}),T=()=>e(c,{code:"<VuMeterStereo />",scope:{VuMeterStereo:S},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/VuMeterStereo.tsx"}),A=()=>e(c,{code:`<div className='flex gap-16'>
  <div> <VuMeter lumpsQuantity={40} /> </div>
  <div> <VuMeter lumpsQuantity={50} /> </div>
</div>`,scope:{VuMeter:l},classNames:{preview:"p-0 pl-10 py-10"}}),D=()=>e(c,{code:`<div className='flex gap-20'>
  <VuMeter compact lumpsQuantity={50} value={-10}/>
  <VuMeter compact lumpsQuantity={50} value={[5, 0]}/>
</div>`,scope:{VuMeter:l},classNames:{preview:"p-0 pl-10 py-10"}}),z=()=>e(c,{code:"<VuMeterColor />",scope:{VuMeterColor:w},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/VuMeterColor.tsx",classNames:{preview:"p-0 px-3 py-10"}}),H=()=>e(C,{data:[{attribute:"value*",description:"The current volume value. Enables stereo mode when passing an array (required)",type:e(t,{children:"number | number[]"}),default:"-"},{attribute:"horizontal",description:"Enable horizontal mode",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"compact",description:"Enable compact mode",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"lumpsQuantity",description:"Number of volume bars",type:e(t,{children:"number"}),default:e(t,{children:"30"})},{attribute:"hideAxis",description:"Hide axis",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"axisProps",description:"Props passed to the Axis component",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"classNames",description:"Custom class names",type:e(t,{children:"{ lump?: string, lumps?: string, axis?: string }"}),default:"-"},{attribute:"styles",description:"Custom styles",type:e(t,{children:"{ lump?: React.CSSProperties, lumps?: React.CSSProperties, axis?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"Callback function when the value changes",type:e(t,{children:"(value: number | number[]) => void"}),default:"-"}]});export{D as C,E as D,Q as H,A as L,T as S,H as V,z as a};
