import{U as c,g as o,A as a,a as e}from"./index.c8ea1d61.js";import{jsx as t}from"react/jsx-runtime";const l=()=>t(c,{code:"<Switch> Switch </Switch>",scope:{Switch:o}}),r=()=>t(c,{code:"<Switch toggled> Toggled </Switch>",scope:{Switch:o}}),h=()=>t(c,{code:"<Switch disabled> Disabled </Switch>",scope:{Switch:o}}),u=()=>t(c,{code:`<div className="flex gap-6 items-center">
  <Switch size="sm"> sm </Switch>
  <Switch size="md"> md </Switch>
  <Switch size="lg"> lg </Switch>
</div>`,scope:{Switch:o}}),b=()=>t(c,{code:`<Switch classNames={{
  button: 'bg-slate-500 shadow-inner group-data-[toggled=true]:bg-indigo-800',
  thumb: 'bg-indigo-400 shadow-none', 
  label: 'text-slate-500'
}}> 
  Custom 
</Switch>`,scope:{Switch:o}}),p=()=>t(a,{data:[{attribute:"toggled",description:"The state of the switch",type:t(e,{children:"boolean"}),default:t(e,{children:"false"})},{attribute:"disabled",description:"Whether the switch is disabled",type:t(e,{children:"boolean"}),default:t(e,{children:"false"})},{attribute:"size",description:"The size of the switch",type:t(e,{children:"'sm' | 'md' | 'lg'"}),default:t(e,{children:"'md'"})},{attribute:"classNames",description:"Custom style class names",type:t(e,{children:"{ label?: string; button?: string; thumb?: string }"}),default:"-"},{attribute:"styles",description:"Custom styles",type:t(e,{children:"{ label?: React.CSSProperties; button?: React.CSSProperties; thumb?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"Callback function when the state changes",type:t(e,{children:"(toggled: boolean) => void"}),default:"-"}]});export{b as C,l as D,u as S,r as T,h as a,p as b};
