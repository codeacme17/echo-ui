import{c,U as i,A as x,a as g}from"./index.978ae265.js";import*as l from"react";import{forwardRef as n}from"react";import{jsx as e,jsxs as s}from"react/jsx-runtime";import{s as v}from"./index.93441784.js";import{L as p}from"./index.a151e681.js";import{K as B}from"./index.185caace.js";import{R as H}from"./index.6f1fabd1.js";import{B as S}from"./index.2ccb91f8.js";import{S as k}from"./index.b9c14876.js";const m=v({slots:{base:`bg-card
    rounded-lg
    border-2
    border-border
    text-foreground
    transition-[border-color]`,header:`text-foreground
    p-2
    border-b
    border-border
    font-bold
    text-lg
    flex
    items-center`,body:`w-full
    px-4
    py-2`},defaultVariants:{toggled:!1},variants:{toggled:{true:{base:"border-primary"}}}}),A=n((a,t)=>{const{toggled:d=!1,...o}=a;return e("div",{...o,ref:t,"data-toggled":d,className:c(m({toggled:d}).base(),o.className),style:o.style,children:o.children})}),h=n((a,t)=>e("div",{...a,ref:t,className:c(m().header(),a.className),children:a.children})),b=n((a,t)=>e("div",{...a,ref:t,className:c(m().body(),a.className),children:a.children})),r=A;r.Header=h;r.Body=b;r.displayName="EchoUI.Card";h.displayName="EchoUI.Card.Header";b.displayName="EchoUI.Card.Body";const I=()=>{const[a,t]=l.useState(3),[d,o]=l.useState(!1),f=N=>{t(N)},C=()=>{o(!d)},[u,y]=l.useState(!1);return s("section",{className:"flex gap-8",children:[e("div",{children:s(r,{toggled:a>0,children:[e(r.Header,{children:e(p,{on:a>0,className:"mr-2"})}),e(r.Body,{className:"flex gap-10",children:e(B,{trackWidth:6,buttonColor:"var(--echo-card)",min:0,max:20,value:a,size:60,onChange:f,topLabel:"Attack",bottomLabel:s("span",{className:"-mt-2 text-sm",children:[a," ms"]})})})]})}),e("div",{children:s(r,{toggled:d,className:"block data-[toggled=true]:border-indigo-500",children:[e(r.Header,{children:e(H,{checked:d,onClick:C,color:"#6366f1",children:"Delay"})}),s(r.Body,{className:"text-muted-foreground flex flex-col gap-2",children:[e("div",{children:"Click radio to toggle this card"}),e("div",{children:e(S,{disabled:!d,toggled:u,radius:"sm",className:"data-[toggled=true]:bg-indigo-500",onClick:()=>y(!u),children:"Mono Bass"})}),e(k,{disabled:!d,className:"my-3",classNames:{progress:"bg-indigo-500 group-data-[disabled=true]:bg-muted"}})]})]})})]})},q=()=>e(i,{code:`<Card>
  <Card.Header> Header </Card.Header>
  <Card.Body> 
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum natus dolorem sit quas placeat cupiditate hic voluptatem blanditiis minima magnam asperiores laudantium deserunt tenetur eveniet soluta fuga, reprehenderit beatae repellendus. 
  </Card.Body>
</Card>`,scope:{Card:r}}),w=()=>e(i,{code:`<Card toggled>
  <Card.Header> 
    <Light on className='mr-3' /> Header 
  </Card.Header>
  <Card.Body> 
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum natus dolorem sit quas placeat cupiditate hic voluptatem blanditiis minima magnam asperiores laudantium deserunt tenetur eveniet soluta fuga, reprehenderit beatae repellendus. 
  </Card.Body>
</Card>`,scope:{Card:r,Light:p}}),K=()=>e(i,{code:"<CardActualScenario />",scope:{CardActualScenario:I},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/CardActualScenario.tsx"}),z=()=>e(x,{data:[{attribute:"toggled",description:"Is the card activated",type:e(g,{children:"boolean"}),default:e(g,{children:"false"})}]});export{K as A,z as C,q as D,w as T};
