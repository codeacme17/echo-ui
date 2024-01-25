import{useLayoutEffect as K,useEffect as O,useState as U,useRef as q,useCallback as v,useMemo as x,cloneElement as G}from"react";import{t as H,m as J,f as Q,k as L,j,l as X}from"./index.2d091e0a.js";import{jsx as B,jsxs as E}from"react/jsx-runtime";var R=H({slots:{wrapper:"relative shadow-black/5",zoomedWrapper:"relative overflow-hidden rounded-inherit",img:"relative z-10 opacity-0 shadow-black/5 data-[loaded=true]:opacity-100",blurredImg:["absolute","z-0","inset-0","w-full","h-full","object-cover","filter","blur-lg","scale-105","saturate-150","opacity-30","translate-y-1"]},variants:{radius:{none:{},sm:{},md:{},lg:{},full:{}},shadow:{none:{wrapper:"shadow-none",img:"shadow-none"},sm:{wrapper:"shadow-small",img:"shadow-small"},md:{wrapper:"shadow-medium",img:"shadow-medium"},lg:{wrapper:"shadow-large",img:"shadow-large"}},isZoomed:{true:{img:["object-cover","transform","hover:scale-125"]}},showSkeleton:{true:{wrapper:["group","relative","overflow-hidden","bg-content3 dark:bg-content2","before:opacity-100","before:absolute","before:inset-0","before:-translate-x-full","before:animate-[shimmer_2s_infinite]","before:border-t","before:border-content4/30","before:bg-gradient-to-r","before:from-transparent","before:via-content4","dark:before:via-default-700/10","before:to-transparent","after:opacity-100","after:absolute","after:inset-0","after:-z-10","after:bg-content3","dark:after:bg-content2"],img:"opacity-0"}},disableAnimation:{true:{img:"transition-none"},false:{img:"transition-transform-opacity motion-reduce:transition-none !duration-300"}}},defaultVariants:{radius:"lg",shadow:"none",isZoomed:!1,isBlurred:!1,showSkeleton:!1,disableAnimation:!1},compoundSlots:[{slots:["wrapper","img","blurredImg","zoomedWrapper"],radius:"none",class:"rounded-none"},{slots:["wrapper","img","blurredImg","zoomedWrapper"],radius:"full",class:"rounded-full"},{slots:["wrapper","img","blurredImg","zoomedWrapper"],radius:"sm",class:"rounded-small"},{slots:["wrapper","img","blurredImg","zoomedWrapper"],radius:"md",class:"rounded-md"},{slots:["wrapper","img","blurredImg","zoomedWrapper"],radius:"lg",class:"rounded-large"}]}),Y=Boolean(globalThis==null?void 0:globalThis.document)?K:O;function ee(f={}){const{loading:o,src:t,srcSet:u,onLoad:c,onError:a,crossOrigin:p,sizes:e,ignoreFallback:l}=f,[g,s]=U("pending");O(()=>{s(t?"loading":"pending")},[t]);const n=q(),i=v(()=>{if(!t)return;d();const r=new Image;r.src=t,p&&(r.crossOrigin=p),u&&(r.srcset=u),e&&(r.sizes=e),o&&(r.loading=o),r.onload=m=>{d(),s("loaded"),c==null||c(m)},r.onerror=m=>{d(),s("failed"),a==null||a(m)},n.current=r},[t,p,u,e,c,a,o]),d=()=>{n.current&&(n.current.onload=null,n.current.onerror=null,n.current=null)};return Y(()=>{if(!l)return g==="loading"&&i(),()=>{d()}},[g,i,l]),l?"loaded":g}function re(f){const[o,t]=J(f,R.variantKeys),{ref:u,as:c,src:a,className:p,classNames:e,loading:l,isBlurred:g,fallbackSrc:s,isLoading:n,disableSkeleton:i=!!s,removeWrapper:d=!1,onError:r,onLoad:m,srcSet:h,sizes:I,crossOrigin:k,...$}=o,y=ee({src:a,loading:l,onError:r,onLoad:m,ignoreFallback:!1,srcSet:h,sizes:I,crossOrigin:k}),S=y==="loaded"&&!n,z=y==="loading"||n,A=f.isZoomed,C=c||"img",W=Q(u),{w:F}=x(()=>({w:o.width?typeof o.width=="number"?`${o.width}px`:o.width:"fit-content"}),[o==null?void 0:o.width]),N=(!a||!S)&&!!s,P=z&&!i,b=x(()=>R({...t,showSkeleton:P}),[...Object.values(t),P]),_=L(p,e==null?void 0:e.img),M=(w={})=>{const D=L(_,w==null?void 0:w.className);return{src:a,ref:W,"data-loaded":j(S),className:b.img({class:D}),loading:l,srcSet:h,sizes:I,crossOrigin:k,...$}},T=v(()=>{const w=N?{backgroundImage:`url(${s})`}:{};return{className:b.wrapper({class:e==null?void 0:e.wrapper}),style:{...w,maxWidth:F}}},[b,N,s,e==null?void 0:e.wrapper]),V=v(()=>({src:a,"aria-hidden":j(!0),className:b.blurredImg({class:e==null?void 0:e.blurredImg})}),[b,a,e==null?void 0:e.blurredImg]);return{Component:C,domRef:W,slots:b,classNames:e,isBlurred:g,disableSkeleton:i,fallbackSrc:s,removeWrapper:d,isZoomed:A,isLoading:z,getImgProps:M,getWrapperProps:T,getBlurredImgProps:V}}var Z=X((f,o)=>{const{Component:t,domRef:u,slots:c,classNames:a,isBlurred:p,isZoomed:e,fallbackSrc:l,removeWrapper:g,disableSkeleton:s,getImgProps:n,getWrapperProps:i,getBlurredImgProps:d}=re({...f,ref:o}),r=B(t,{ref:u,...n()});if(g)return r;const m=B("div",{className:c.zoomedWrapper({class:a==null?void 0:a.zoomedWrapper}),children:r});return p?E("div",{...i(),children:[e?m:r,G(r,d())]}):e||!s||l?E("div",{...i(),children:[" ",e?m:r]}):r});Z.displayName="NextUI.Image";var te=Z;export{te as i};
