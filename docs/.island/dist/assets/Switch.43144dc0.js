import{U as s,c as o}from"./index.723a15ef.js";import{jsx as t}from"react/jsx-runtime";import{A as u,c as e}from"./index.55340fb1.js";const r=()=>t(s,{code:"<Switch> Switch </Switch>",scope:{Switch:o}}),l=()=>t(s,{code:"<Switch toggled> Toggled </Switch>",scope:{Switch:o}}),h=()=>t(s,{code:"<Switch disabled> Disabled </Switch>",scope:{Switch:o}}),p=()=>t(s,{code:`<div className="flex gap-6 items-center">
  <Switch size="sm"> sm </Switch>
  <Switch size="md"> md </Switch>
  <Switch size="lg"> lg </Switch>
</div>`,scope:{Switch:o}}),S=()=>t(s,{code:`<Switch classNames={{
  button: 'bg-slate-500 shadow-inner group-data-[toggled=true]:bg-indigo-800',
  thumb: 'bg-indigo-400 shadow-none', 
  label: 'text-slate-500'
}}> 
  Custom 
</Switch>`,scope:{Switch:o}}),b=()=>t(u,{data:[{attribute:"disabled",description:"\u662F\u5426\u7981\u7528\u5F00\u5173",type:t(e,{children:"boolean"}),default:t(e,{children:"false"})},{attribute:"toggled",description:"\u5F00\u5173\u7684\u72B6\u6001",type:t(e,{children:"boolean"}),default:t(e,{children:"false"})},{attribute:"size",description:"\u5F00\u5173\u7684\u5C3A\u5BF8",type:t(e,{children:"'sm' | 'md' | 'lg'"}),default:t(e,{children:"'md'"})},{attribute:"classNames",description:"\u81EA\u5B9A\u4E49\u6837\u5F0F\u7C7B\u540D",type:t(e,{children:"{ label?: string; button?: string; thumb?: string }"}),default:"-"},{attribute:"styles",description:"\u81EA\u5B9A\u4E49\u6837\u5F0F",type:t(e,{children:"{ label?: React.CSSProperties; button?: React.CSSProperties; thumb?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"\u72B6\u6001\u53D8\u5316\u65F6\u7684\u56DE\u8C03\u51FD\u6570",type:t(e,{children:"(toggled: boolean) => void"}),default:"-"}]});export{S as C,r as D,p as S,l as T,h as a,b};
