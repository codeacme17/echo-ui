import{c as h,U as k,A as T,a as t}from"./index.2440eb3f.js";import{jsxs as f,jsx as e,Fragment as I}from"react/jsx-runtime";import{createContext as F,forwardRef as R,useContext as Z,useState as $,useCallback as q,useEffect as H}from"react";import{s as V}from"./index.93441784.js";import{u as J}from"./usePropsWithGroup.a30eaab0.js";const A=F(null),K=A.Provider,Q=V({slots:{base:`group
    inline-flex 
    items-center 
    cursor-pointer
    text-foreground
    select-none`,wrapper:`relative 
    inline-block 
    z-0`,button:`appearance-none 
    bg-button
    cursor-pointer
    rounded-md
    absolute
    w-full
    h-full
    cursor-pointer`,thumb:`bg-primary 
    opacity-0
    scale-0
    tansition-all
    rounded-sm
    w-2/3
    h-2/3
    absolute
    top-1/2
    left-1/2
    -translate-x-1/2
    -translate-y-1/2
    transition-[transform,opacity]`,label:"ml-2"},defaultVariants:{checked:!1,disabled:!1,size:"md"},variants:{checked:{true:{thumb:"opacity-100 scale-100"}},disabled:{true:{base:"opacity-70 pointer-events-none"}},size:{sm:{wrapper:"w-4 h-4",label:"text-sm"},md:{wrapper:"w-5 h-5",label:"text-base"},lg:{wrapper:"w-6 h-6",label:"text-lg"}}},compoundVariants:[{checked:!0,disabled:!0,class:{thumb:"bg-muted"}}]}),X=V({base:"inline-flex gap-2"}),M="md",U="var(--echo-primary)",Y=R((s,a)=>{var z,E;const c=Z(A),o=c!==null,{value:u,checked:b=!1,disabled:l=!1,size:y=M,color:p=U,classNames:n,styles:m,children:N,onClick:x,onChange:r,onMouseEnter:v,onMouseLeave:g,...w}=J(s,c,["className","style"]),[G,C]=$(b),D=q(d=>{var S;if(l)return;C(d.target.checked);const P={value:o?u:d.target.checked,nativeEvent:d};o?(S=c.onChange)==null||S.call(c,P):r==null||r(P)},[l,u,o,r,c==null?void 0:c.onChange]);H(()=>{var d;o?(d=c.value)!=null&&d.includes(u)?C(!0):C(!1):C(b)},[c==null?void 0:c.value,b]);const{base:L,button:j,label:O,wrapper:_,thumb:B}=Q({size:y,disabled:l,checked:G});return f("label",{ref:a,"data-checked":G,"data-disabled":l,className:h(L(),o&&((z=c.classNames)==null?void 0:z.checkbox),w.className),style:{...o&&((E=c.styles)==null?void 0:E.checkbox),...w.style},onClick:x,onMouseEnter:v,onMouseLeave:g,children:[f("span",{className:h(_()),children:[e("input",{...w,type:"checkbox",disabled:l,checked:G,onChange:D,className:h(j())}),e("span",{className:h(B()),style:{backgroundColor:l?"var(--echo-muted)":p}})]}),e("span",{className:h(O(),n==null?void 0:n.label),style:m==null?void 0:m.label,children:N})]})}),W=R((s,a)=>{const{value:c=[],disabled:o=!1,size:u=M,color:b=U,classNames:l,styles:y,onChange:p,...n}=s;return e(K,{value:{value:c,disabled:o,size:u,color:b,classNames:l,styles:y,onChange:x=>{const r=x.value,v=c.includes(r)?c.filter(g=>g!==r):[...c,r];p==null||p({value:v,nativeEvent:x.nativeEvent})}},children:e("div",{...n,ref:a,className:h(X(),n.className),style:n.style,children:n.children})})}),i=Y;i.displayName="EchoUI.Checkbox";W.displayName="EchoUI.CheckboxGroup";i.Group=W;const oe=()=>e(k,{code:"<Checkbox> Checkbox </Checkbox>",scope:{Checkbox:i}}),le=()=>e(k,{code:"<Checkbox checked disabled> Checkbox </Checkbox>",scope:{Checkbox:i}}),ne=()=>e(k,{code:`<div className="flex gap-6 items-center">
  <Checkbox size="sm"> sm </Checkbox>
  <Checkbox size="md"> md </Checkbox>
  <Checkbox size="lg"> lg </Checkbox>
</div>`,scope:{Checkbox:i}}),re=()=>e(k,{code:`<Checkbox color='#6366f1' classNames={{ label: 'color-slate-500' }}> 
  Checkbox 
</Checkbox>`,scope:{Checkbox:i}}),ie=()=>e(k,{code:`<Checkbox.Group value={[1, 2]}>
  <Checkbox value={1}> Checkbox 1 </Checkbox>
  <Checkbox value={2}> Checkbox 2 </Checkbox>
  <Checkbox value={3}> Checkbox 3 </Checkbox>
</Checkbox.Group>`,scope:{Checkbox:i}}),de=()=>e(T,{data:[{attribute:"value",description:f(I,{children:["The value bound to the checkbox (only effective in ",e(t,{children:" Group "}),")"]}),type:e(t,{children:"any"}),default:"-"},{attribute:"checked",description:"Whether the checkbox is checked",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"disabled",description:"Whether the checkbox is disabled",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"size",description:"The size of the checkbox",type:e(t,{children:"'sm' | 'md' | 'lg'"}),default:e(t,{children:"'md'"})},{attribute:"color",description:"The color when the checkbox is activated",type:e(t,{children:"string"}),default:e(t,{children:"'var(--echo-primary)'"})},{attribute:"classNames",description:"Custom style class names",type:e(t,{children:"{ label?: string }"}),default:"-"},{attribute:"styles",description:"Custom styles",type:e(t,{children:"{ label?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"Callback function when the state changes",type:e(t,{children:"(e: RadioChangeEvent) => void"}),default:"-"}]}),he=()=>e(T,{data:[{attribute:"value",description:f(I,{children:["The array bound to the checkbox group, used to represent the ",e(t,{children:" value "})," ","including currently selected items"]}),type:e(t,{children:"any"}),default:"-"},{attribute:"disabled",description:"Whether the checkboxes in the group are disabled",type:e(t,{children:"boolean"}),default:e(t,{children:"false"})},{attribute:"size",description:"The size of the checkboxes in the group",type:e(t,{children:"'sm' | 'md' | 'lg'"}),default:e(t,{children:"'md'"})},{attribute:"color",description:"The color when the checkboxes in the group are activated",type:e(t,{children:"string"}),default:e(t,{children:"'var(--echo-primary)'"})},{attribute:"classNames",description:"Custom style class names",type:e(t,{children:"{ label?: string }"}),default:"-"},{attribute:"styles",description:"Custom styles",type:e(t,{children:"{ label?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"Callback function when the state changes",type:e(t,{children:"(e: RadioChangeEvent) => void"}),default:"-"}]});export{re as C,oe as D,ie as G,ne as S,le as a,de as b,he as c};
