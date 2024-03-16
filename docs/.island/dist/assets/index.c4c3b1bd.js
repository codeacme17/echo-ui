import{jsxs as g,jsx as r}from"react/jsx-runtime";import{createContext as $,forwardRef as w,useContext as q,useState as A,useEffect as B,useCallback as D}from"react";import{c as o}from"./index.b2cccce0.js";import{s as N}from"./index.93441784.js";import{u as F}from"./usePropsWithGroup.a30eaab0.js";const R=$(null),H=R.Provider,J=N({slots:{base:`group
    z-0
    inline-flex 
    cursor-pointer 
    text-foreground
    items-center
    select-none`,wrapper:`relative 
    inline-block 
    z-0`,button:`appearance-none 
    bg-button
    cursor-pointer
    rounded-full
    absolute
    w-full
    h-full
    cursor-pointer`,thumb:`bg-primary 
    opacity-0
    scale-0
    tansition-all
    w-2/3
    h-2/3
    absolute
    top-1/2
    left-1/2
    rounded-full
    -translate-x-1/2
    -translate-y-1/2
    transition-[transform,opacity]`,label:"ml-2"},defaultVariants:{checked:!1,disabled:!1,size:"md"},variants:{checked:{true:{thumb:"opacity-100 scale-100"}},disabled:{true:{base:"opacity-70 pointer-events-none"}},size:{sm:{wrapper:"w-4 h-4",label:"text-sm"},md:{wrapper:"w-5 h-5",label:"text-base"},lg:{wrapper:"w-6 h-6",label:"text-lg"}}},compoundVariants:[{checked:!0,disabled:!0,class:{thumb:"bg-muted"}}]}),K=N({base:"inline-flex gap-2"}),G="md",E="var(--echo-primary)",Q=w((d,u)=>{var y,v;const e=q(R),a=e!==null,{value:n,checked:l=!1,disabled:s=!1,size:p=G,color:m=E,classNames:t,styles:c,children:I,onChange:i,onClick:L,onMouseEnter:M,onMouseLeave:S,...h}=F(d,e),[V,f]=A(l);B(()=>{a||f(l)},[l]);const j=D(k=>{var C;if(s)return;a||f(k.target.checked);const x={value:n,nativeEvent:k};a?(C=e.onChange)==null||C.call(e,x):i==null||i(x)},[i,s,e]),b=a?e.value===n:V,{base:O,wrapper:U,button:W,thumb:Z,label:_}=J({checked:b,size:p,disabled:s});return g("label",{ref:u,"data-checked":b,"data-disabled":s,className:o(O(),a&&((y=e.classNames)==null?void 0:y.radio),h.className),style:{...a&&((v=e.styles)==null?void 0:v.radio),...h.style},onMouseEnter:M,onMouseLeave:S,children:[g("span",{className:o(U()),children:[r("input",{...h,type:"radio",checked:b,disabled:s,onClick:L,onChange:j,className:o(W())}),r("span",{className:o(Z()),style:{backgroundColor:s?"var(--echo-muted)":m}})]}),r("div",{className:o(_(),t==null?void 0:t.label),style:c==null?void 0:c.label,children:I})]})}),z=w((d,u)=>{const{value:e,disabled:a=!1,size:n=G,color:l=E,classNames:s,styles:p,onChange:m,...t}=d;return r(H,{value:{value:e,size:n,color:l,disabled:a,classNames:s,styles:p,onChange:m},children:r("div",{...t,ref:u,className:o(K(),t.className),style:t.style,children:t.children})})}),P=Q;P.displayName="EchoUI.Radio";z.displayName="EchoUI.RadioGroup";P.Group=z;export{P as R};
