import{k as t,a as n,D as C,Y as b,s as f,i as x,U as l}from"./index.46846943.js";import*as r from"react";import{jsxs as d,jsx as e}from"react/jsx-runtime";import{A as k,c as i}from"./index.55340fb1.js";const v=()=>{const[a,o]=r.useState(3),[s,u]=r.useState(!1),m=h=>{o(h)},g=()=>{u(!s)},[c,p]=r.useState(!1);return d("section",{className:"flex gap-8",children:[e("div",{children:d(t,{toggled:a>0,children:[e(t.Header,{children:e(n,{on:a>0,className:"mr-2"})}),e(t.Body,{className:"flex gap-10",children:e(C,{trackWidth:6,buttonColor:"var(--echo-card)",min:0,max:20,value:a,size:60,onChange:m,topLabel:"Attack",bottomLabel:d("span",{className:"-mt-2 text-sm",children:[a," ms"]})})})]})}),e("div",{children:d(t,{toggled:s,className:"block data-[toggled=true]:border-indigo-500",children:[e(t.Header,{children:e(b,{checked:s,onClick:g,color:"#6366f1",children:"Delay"})}),d(t.Body,{className:"text-muted-foreground flex flex-col gap-2",children:[e("div",{children:"Click radio to toggle this card"}),e("div",{children:e(f,{disabled:!s,toggled:c,radius:"sm",className:"data-[toggled=true]:bg-indigo-500",onClick:()=>p(!c),children:"Mono Bass"})}),e(x,{disabled:!s,className:"my-3",classNames:{progress:"bg-indigo-500 group-data-[disabled=true]:bg-muted"}})]})]})})]})},N=()=>e(l,{code:`<Card>
  <Card.Header> Header </Card.Header>
  <Card.Body> 
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum natus dolorem sit quas placeat cupiditate hic voluptatem blanditiis minima magnam asperiores laudantium deserunt tenetur eveniet soluta fuga, reprehenderit beatae repellendus. 
  </Card.Body>
</Card>`,scope:{Card:t}}),H=()=>e(l,{code:`<Card toggled>
  <Card.Header> 
    <Light on className='mr-3' /> Header 
  </Card.Header>
  <Card.Body> 
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum natus dolorem sit quas placeat cupiditate hic voluptatem blanditiis minima magnam asperiores laudantium deserunt tenetur eveniet soluta fuga, reprehenderit beatae repellendus. 
  </Card.Body>
</Card>`,scope:{Card:t,Light:n}}),S=()=>e(l,{code:"<CardActualScenario />",scope:{CardActualScenario:v},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/CardActualScenario.tsx"}),D=()=>e(k,{data:[{attribute:"toggled",description:"\u5361\u7247\u662F\u5426\u88AB\u6FC0\u6D3B",type:e(i,{children:"boolean"}),default:e(i,{children:"false"})}]});export{S as A,D as C,N as D,H as T};
