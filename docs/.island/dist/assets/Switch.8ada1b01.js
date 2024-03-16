import{c as u,U as r,A as k,a as s}from"./index.105c25bf.js";import{jsxs as T,jsx as t}from"react/jsx-runtime";import{forwardRef as v,useState as P,useEffect as p}from"react";import{s as D}from"./index.93441784.js";const I="md",N=D({slots:{base:`group
    text-accent-foreground
    inline-flex
    items-center
    cursor-pointer
    select-none`,button:`rounded-full
    bg-input
    overflow-hidden
    inline-flex
    w-12
    h-6
    relative
    items-center
    border-transparent
    duration-200
    transition-[background-color]`,thumb:`w-3
    h-3
    left-2
    block
    shadow-sm
    shadow-accent-foreground
    rounded-full
    absolute
    bg-button-foreground
    transition-[left,background-color]`,label:"inline-block ml-2"},defaultVariants:{disabled:!1,toggled:!1,size:"md"},variants:{size:{sm:{button:"w-12 h-6",thumb:"w-3 h-3",label:"text-sm"},md:{button:"w-14 h-8",thumb:"w-4 h-4",label:"text-base"},lg:{button:"w-16 h-10",thumb:"w-5 h-5",label:"text-lg"}},disabled:{true:{base:"pointer-events-none opacity-70",thumb:"bg-muted shadow-none"}},toggled:{true:{button:"bg-primary",thumb:"bg-gray-950 shadow-gray-950"}}}}),R=v((a,n)=>{const{toggled:h=!1,disabled:i=!1,size:f=I,classNames:e,styles:o,onClick:g,onChange:d,...b}=a,[l,m]=P(h);p(()=>{i||d==null||d(l)},[l,i,d]),p(()=>{m(h)},[h]);const w=z=>{i||(m(!l),g&&g(z))},{base:S,button:y,thumb:x,label:C}=N({disabled:i,toggled:l,size:f});return T("label",{...b,ref:n,"data-toggled":l,"data-disabled":i,className:u(S(),b.className),style:b.style,onClick:w,children:[t("span",{className:u(y(),e==null?void 0:e.button),style:o==null?void 0:o.button,children:t("span",{className:u(x(),e==null?void 0:e.thumb),style:{...o==null?void 0:o.thumb,left:l?"calc(50% + 0.75rem / 2)":""}})}),t("span",{className:u(C(),e==null?void 0:e.label),style:o==null?void 0:o.label,children:b.children})]})}),c=R;c.displayName="EchoUI.Switch";const _=()=>t(r,{code:"<Switch> Switch </Switch>",scope:{Switch:c}}),B=()=>t(r,{code:"<Switch toggled> Toggled </Switch>",scope:{Switch:c}}),V=()=>t(r,{code:"<Switch disabled> Disabled </Switch>",scope:{Switch:c}}),W=()=>t(r,{code:`<div className="flex gap-6 items-center">
  <Switch size="sm"> sm </Switch>
  <Switch size="md"> md </Switch>
  <Switch size="lg"> lg </Switch>
</div>`,scope:{Switch:c}}),Z=()=>t(r,{code:`<Switch classNames={{
  button: 'bg-slate-500 shadow-inner group-data-[toggled=true]:bg-indigo-800',
  thumb: 'bg-indigo-400 shadow-none', 
  label: 'text-slate-500'
}}> 
  Custom 
</Switch>`,scope:{Switch:c}}),$=()=>t(k,{data:[{attribute:"toggled",description:"The state of the switch",type:t(s,{children:"boolean"}),default:t(s,{children:"false"})},{attribute:"disabled",description:"Whether the switch is disabled",type:t(s,{children:"boolean"}),default:t(s,{children:"false"})},{attribute:"size",description:"The size of the switch",type:t(s,{children:"'sm' | 'md' | 'lg'"}),default:t(s,{children:"'md'"})},{attribute:"classNames",description:"Custom style class names",type:t(s,{children:"{ label?: string; button?: string; thumb?: string }"}),default:"-"},{attribute:"styles",description:"Custom styles",type:t(s,{children:"{ label?: React.CSSProperties; button?: React.CSSProperties; thumb?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"Callback function when the state changes",type:t(s,{children:"(toggled: boolean) => void"}),default:"-"}]});export{Z as C,_ as D,W as S,B as T,V as a,$ as b};
