import{C as o}from"./CodeBlock.913859b9.js";import{jsx as a}from"react/jsx-runtime";import{t as r,m as i}from"./chunk-FXLYF44B.f49f16be.js";const b=({npm:t,yarn:l,pnpm:n})=>a("div",{className:"flex w-full flex-col mt-3",children:a(r,{"aria-label":"Dynamic tabs",items:[{id:"npm",label:"npm",content:t},{id:"yarn",label:"yarn",content:l},{id:"pnpm",label:"pnpm",content:n}],color:"primary",variant:"underlined",classNames:{tab:"data-[focus-visible=true]:outline-none"},children:e=>a(i,{title:e.label,children:a(o,{code:e.content,language:"bash"})},e.id)})});export{b as M};