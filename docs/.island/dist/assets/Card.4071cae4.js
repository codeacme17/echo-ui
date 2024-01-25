import{N as t,E as n,$ as C,z as b,f,a as x,U as l,A as y,c as i}from"./index.9f6c8c4d.js";import*as r from"react";import{jsxs as o,jsx as e}from"react/jsx-runtime";const N=()=>{const[a,s]=r.useState(3),[d,u]=r.useState(!1),m=h=>{s(h)},g=()=>{u(!d)},[c,p]=r.useState(!1);return o("section",{className:"flex gap-8",children:[e("div",{children:o(t,{toggled:a>0,children:[e(t.Header,{children:e(n,{on:a>0,className:"mr-2"})}),e(t.Body,{className:"flex gap-10",children:e(C,{trackWidth:6,buttonColor:"var(--echo-card)",min:0,max:20,value:a,size:60,onChange:m,topLabel:"Attack",bottomLabel:o("span",{className:"-mt-2 text-sm",children:[a," ms"]})})})]})}),e("div",{children:o(t,{toggled:d,className:"block data-[toggled=true]:border-indigo-500",children:[e(t.Header,{children:e(b,{checked:d,onClick:g,color:"#6366f1",children:"Delay"})}),o(t.Body,{className:"text-muted-foreground flex flex-col gap-2",children:[e("div",{children:"Click radio to toggle this card"}),e("div",{children:e(f,{disabled:!d,toggled:c,radius:"sm",className:"data-[toggled=true]:bg-indigo-500",onClick:()=>p(!c),children:"Mono Bass"})}),e(x,{disabled:!d,className:"my-3",classNames:{progress:"bg-indigo-500 group-data-[disabled=true]:bg-muted"}})]})]})})]})},A=()=>e(l,{code:`<Card>
  <Card.Header> Header </Card.Header>
  <Card.Body> 
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum natus dolorem sit quas placeat cupiditate hic voluptatem blanditiis minima magnam asperiores laudantium deserunt tenetur eveniet soluta fuga, reprehenderit beatae repellendus. 
  </Card.Body>
</Card>`,scope:{Card:t}}),B=()=>e(l,{code:`<Card toggled>
  <Card.Header> 
    <Light on className='mr-3' /> Header 
  </Card.Header>
  <Card.Body> 
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum natus dolorem sit quas placeat cupiditate hic voluptatem blanditiis minima magnam asperiores laudantium deserunt tenetur eveniet soluta fuga, reprehenderit beatae repellendus. 
  </Card.Body>
</Card>`,scope:{Card:t,Light:n}}),H=()=>e(l,{code:"<CardActualScenario />",scope:{CardActualScenario:N},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/CardActualScenario.tsx"}),S=()=>e(y,{data:[{attribute:"toggled",description:"Is the card activated",type:e(i,{children:"boolean"}),default:e(i,{children:"false"})}]});export{H as A,S as C,A as D,B as T};
