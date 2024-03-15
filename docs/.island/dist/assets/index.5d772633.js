import{jsx as p}from"react/jsx-runtime";import{createContext as w,forwardRef as v,useContext as k,useEffect as V,useCallback as A}from"react";import{c as y}from"./index.036b4c00.js";import{s as C}from"./index.93441784.js";import{u as P}from"./usePropsWithGroup.a30eaab0.js";const I=w(null),z=I.Provider,E=C({base:`bg-button
           text-foreground
           inline-flex
           justify-center
           items-center
           py-2
           px-4 
           transition-[color,background-color,box-shadow,border-color,transform]
           duration-200
           select-none
           active:scale-95
           disabled:cursor-not-allowed
           disabled:pointer-events-none 
           disabled:opacity-70`,defaultVariants:{toggled:!1,size:"md",radius:"md"},variants:{toggled:{true:"shadow-inner text-black bg-primary disabled:bg-muted"},size:{sm:"text-sm py-1 px-2",md:"text-base py-2 px-4",lg:"text-lg py-3 px-6"},radius:{none:"rounded-none",sm:"rounded-sm",md:"rounded-md",lg:"rounded-lg",full:"rounded-full"},isInGroup:{true:"rounded-none"}},compoundVariants:[{isInGroup:!0,class:"first:rounded-l-none last:rounded-r-none"},{isInGroup:!0,radius:"sm",class:"first:rounded-l-sm last:rounded-r-sm"},{isInGroup:!0,radius:"md",class:"first:rounded-l-md last:rounded-r-md"},{isInGroup:!0,radius:"lg",class:"first:rounded-l-lg last:rounded-r-lg"},{isInGroup:!0,radius:"full",class:"first:rounded-l-full last:rounded-r-full"}]}),S=C({base:"inline-flex flex-row border-border overflow-hidden"}),N="md",B="md",U=v((m,f)=>{var c,l,d;const e=k(I),r=e!==null,{value:t,toggled:i=!1,disabled:s=!1,size:g=N,radius:b=B,onClick:u,onToggleChange:o,...a}=P(m,e,["classNames","styles"]);let n=i;r&&(Array.isArray(e.value)?n=(c=e.value)!=null&&c.length?e.value.includes(t):i:n=e.value===t),V(()=>{s||o&&o(n)},[s,n,o]);const G=A(x=>{s||(u&&u(x),!(!r||!t)&&e.onChange&&e.onChange(t))},[s,r,e,t,u]);return p("button",{...a,ref:f,"data-toggled":n,"data-disable":s,disabled:s,className:y(E({toggled:n,size:g,radius:b,isInGroup:r}),r&&((l=e.classNames)==null?void 0:l.button),a.className),style:{...r&&((d=e.styles)==null?void 0:d.button),...a.style},onClick:G,children:p("span",{className:y(s&&"text-foreground/60"),children:a.children})})}),j=v((m,f)=>{const{value:e=[],disabled:r=!1,size:t=N,radius:i=B,classNames:s,styles:g,className:b,style:u,onChange:o,...a}=m;return p(z,{value:{value:e,disabled:r,size:t,radius:i,classNames:s,styles:g,onChange:c=>{const l=c;let d;Array.isArray(e)?d=e.includes(l)?e.filter(x=>x!==l):[...e,l]:d=l,o==null||o(d)}},children:p("div",{ref:f,className:y(S(),b),style:u,children:a.children})})}),h=U;h.Group=j;h.displayName="EchoUI.Button";h.Group.displayName="EchoUI.ButtonGroup";export{h as B};
