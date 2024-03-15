import{jsxs as ee,jsx as L}from"react/jsx-runtime";import{forwardRef as te,useImperativeHandle as re,useEffect as S,useState as E,useRef as $,useCallback as ae,useMemo as se}from"react";import{v as B,h as V,c as p}from"./index.036b4c00.js";import{A as oe}from"./index.0243491f.js";import{_ as ne}from"./assertion.e9357fda.js";import{l as C}from"./log.83f32a09.js";import{s as ie}from"./index.93441784.js";import{u as le}from"./useCommandAltClick.cec7174c.js";const ue=({value:d,min:h,max:i})=>{if(!!ne)return d>i&&C.warn(`Slider - value(${d}) is higher than max(${i})`),d<h&&C.warn(`Slider - value(${d}) is lower than min(${h})`),!0},de=ie({slots:{base:`group
    text-foreground
    w-full
    h-2
    cursor-pointer
    bg-input
    rounded-sm`,progress:`absolute
    bg-primary
    rounded-md
    h-full
    w-full`,thumb:`w-2
    h-5
    bg-accent-foreground
    rounded-sm`,thumbLabel:`px-1.5 
    py-1
    opacity-0
    text-accent
    bg-accent-foreground
    rounded-md
    mb-1
    duration-150
    delay-75
    scale-0
    text-xs
    text-center`},defaultVariants:{vertical:!1,disabled:!1,isDragging:!1,prohibitInteraction:!1,hideThumbLabel:!1},variants:{vertical:{true:{base:"w-2 h-full",thumb:"w-5 h-2",thumbLabel:"mb-0 ml-2"}},disabled:{true:{base:"pointer-events-none opacity-70",progress:"bg-muted"}},isDragging:{true:{base:"cursor-grabbing"}},prohibitInteraction:{true:{base:"cursor-auto"}},hideThumbLabel:{true:{thumbLabel:"opacity-0 scale-0"}}},compoundVariants:[{hideThumbLabel:!1,isDragging:!0,class:{thumbLabel:"scale-100 opacity-100"}}]}),ce=100,F=0,me=1,be=te((d,h)=>{const{value:i=F,min:e=F,max:a=ce,step:w=me,vertical:r=!1,bilateral:c=!1,hideThumb:N=!1,hideThumbLabel:j=!1,prohibitInteraction:R=!1,disabled:m=!1,axis:q=!1,axisProps:H,classNames:s,styles:o,onChange:b,onChangeEnd:I,onMouseDown:M,...y}=d;re(h,()=>f.current),S(()=>{ue({value:i,min:e,max:a})},[]);const[l,v]=E(B(i,e,a)),[x,T]=E(!1),[U,X]=E("positive"),_=$(l),f=$(null),A=$({left:0,width:0,bottom:0,height:0});S(()=>{if(m)return;const t=B(i,e,a);v(t)},[i,e,a,m]);const P=le(()=>{v(c?V(e,a):e),b==null||b(c?V(e,a):e)}),D=ae(t=>{t.stopPropagation();const{left:n,width:g,bottom:W,height:Z}=A.current;let u=(r?(W-t.clientY)/Z:(t.clientX-n)/g)*(a-e)+e;u=parseFloat((Math.round(u/w)*w).toFixed(10)),u=Math.max(e,Math.min(u,a)),_.current=u,v(u),b==null||b(u)},[e,a,w,r]),z=t=>{if(M&&M(t),m||R||!f.current)return;const n=f.current;A.current=n.getBoundingClientRect(),T(!0),D(t),document.addEventListener("mousemove",k),document.addEventListener("mouseup",Y),P(t)},k=t=>{t.preventDefault(),requestAnimationFrame(()=>D(t))},Y=t=>{t.preventDefault(),D(t),T(!1),I&&I(_.current),document.removeEventListener("mousemove",k),document.removeEventListener("mouseup",Y),P(t)};S(()=>{x?document.getElementsByTagName("body")[0].style.cursor="grabbing":document.getElementsByTagName("body")[0].style.cursor=""},[x]);const G=se(()=>{const t=(l-e)/(a-e)*100;let n=t,g=0;return c&&(l>=V(e,a)?(X("positive"),n=t-50,g=50):(X("negative"),n=50-t,g=t)),{height:r?`${n}%`:"100%",width:r?"100%":`${n}%`,bottom:r?`${g}%`:"0",left:r?"0":`${g}%`}},[l,e,a,c,m,r]),{base:J,progress:K,thumb:O,thumbLabel:Q}=de({disabled:m,vertical:r,isDragging:x,prohibitInteraction:R,hideThumbLabel:j});return ee("div",{...y,ref:f,"data-dragging":x,"data-bilateral":c,"data-vertical":r,"data-disabled":m,"data-direction":U,onMouseDown:z,className:p(J(),y.className),style:{...y.style,position:"relative",userSelect:"none"},children:[L("div",{className:p(K(),s==null?void 0:s.progress),style:{...o==null?void 0:o.progress,...G,borderRadius:c?0:void 0}}),!N&&L("div",{className:p(O(),s==null?void 0:s.thumb),style:{...o==null?void 0:o.thumb,position:"absolute",left:r?"50%":`${(l-e)/(a-e)*100}%`,top:r?"":"50%",bottom:r?`${(l-e)/(a-e)*100}%`:"",transform:r?"translateX(-50%) translateY(50%)":"translateX(-50%) translateY(-50%)"},children:L("div",{className:p(Q(),s==null?void 0:s.thumbLabel),style:{...o==null?void 0:o.thumbLabel,position:"absolute",bottom:r?"50%":"100%",transform:r?"translateX(-0.25rem) translateY(50%)":"translateX(-50%)",left:r?"100%":"50%",userSelect:"none",pointerEvents:"none"},children:l})}),q&&L(oe,{className:p(r?"ml-5":"mt-3",s==null?void 0:s.axis),style:o==null?void 0:o.axis,min:e,max:a,vertical:r,relatedRef:f,...H})]})}),ge=be;ge.displayName="EchoUI.Slider";export{ge as S};
