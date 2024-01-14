import{U as o,s as n,K as d,J as i,Z as r,Q as c}from"./index.46846943.js";import{jsx as u,jsxs as l,Fragment as B}from"react/jsx-runtime";import{A as s,c as t}from"./index.55340fb1.js";const h=()=>u(o,{code:"<Button> Button </Button>",scope:{Button:n}}),b=()=>u(o,{code:"<Button toggled> Toggled </Button>",scope:{Button:n}}),E=()=>u(o,{code:"<Button disabled> Disabled </Button>",scope:{Button:n}}),f=()=>u(o,{code:`<div className="flex gap-4 items-center">
  <Button size="sm">
    Small
  </Button>  
  <Button size="md">
    Medium
  </Button>  
  <Button size="lg">
    Large
  </Button>  
</div>`,scope:{Button:n}}),A=()=>u(o,{code:`<div className="flex gap-4 items-center">
  <Button radius="none">
    None
  </Button>  
  <Button radius="sm">
    Small
  </Button>  
  <Button radius="md">
    Medium
  </Button>  
  <Button radius="lg">
    Large
  </Button>
  <Button radius="full">
    Full
  </Button>  
</div>`,scope:{Button:n}}),F=()=>u(o,{code:`<Button.Group>
  <Button value={1} className="data-[toggled=true]:bg-red-500">
    Sine
  </Button>
  <Button value={2}>
    Square
  </Button>
  <Button value={3}>
    Sawtooth
  </Button>
  <Button value={4}>
    Triangle
  </Button>
</Button.Group>`,scope:{Button:n,SineIcon:d,SawtoothIcon:i,SquareIcon:r,TriangleIcon:c}}),y=()=>u(s,{data:[{attribute:"value",description:l(B,{children:["\u7ED1\u5B9A\u7684\u503C\uFF08\u4EC5\u5728 ",u(t,{children:" `Group` "})," \u4E2D\u751F\u6548\uFF09"]}),type:u(t,{children:"any"}),default:"-"},{attribute:"disabled",description:"\u6307\u793A\u6309\u94AE\u662F\u5426\u7981\u7528",type:u(t,{children:"boolean"}),default:u(t,{children:"false"})},{attribute:"size",description:"\u6309\u94AE\u5927\u5C0F",type:u(t,{children:"'sm' | 'md' | 'lg'"}),default:u(t,{children:"'md'"})},{attribute:"radius",description:"\u6309\u94AE\u8FB9\u6846\u5706\u89D2",type:u(t,{children:"'none' | 'sm' | 'md' | 'lg' | 'full'"}),default:u(t,{children:"'md'"})},{attribute:"toggled",description:"\u8868\u793A\u6309\u94AE\u662F\u5426\u5207\u6362\u72B6\u6001",type:u(t,{children:"boolean"}),default:u(t,{children:"false"})},{attribute:"onToggleChange",description:"\u5207\u6362\u72B6\u6001\u53D8\u5316\u65F6\u7684\u56DE\u8C03\u51FD\u6570",type:u(t,{children:"(toggled: boolean) => void"}),default:"-"}]}),D=()=>u(s,{data:[{attribute:"value",description:"\u6309\u94AE\u7EC4\u5173\u8054\u7684\u503C",type:u(t,{children:"any[]"}),default:"-"},{attribute:"disabled",description:"\u6307\u793A\u6309\u94AE\u7EC4\u4E2D\u7684\u6309\u94AE\u662F\u5426\u7981\u7528",type:u(t,{children:"boolean"}),default:u(t,{children:"false"})},{attribute:"size",description:"\u6309\u94AE\u5927\u5C0F",type:u(t,{children:"'sm' | 'md' | 'lg'"}),default:u(t,{children:"'md'"})},{attribute:"radius",description:"\u6309\u94AE\u8FB9\u6846\u5706\u89D2",type:u(t,{children:"'none' | 'sm' | 'md' | 'lg' | 'full'"}),default:u(t,{children:"'md'"})},{attribute:"classNames",description:"\u5141\u8BB8\u4E3A\u6309\u94AE\u548C\u5207\u6362\u72B6\u6001\u8BBE\u7F6E\u81EA\u5B9A\u4E49\u7C7B\u540D",type:u(t,{children:"{ button?: string }"}),default:"-"},{attribute:"styles",description:"\u5141\u8BB8\u4E3A\u6309\u94AE\u548C\u5207\u6362\u72B6\u6001\u8BBE\u7F6E\u81EA\u5B9A\u4E49\u6837\u5F0F\u8868",type:u(t,{children:"{ button?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"\u9009\u9879\u53D8\u5316\u65F6\u7684\u56DE\u8C03\u51FD\u6570",type:u(t,{children:"(values: any[]) => void"}),default:"-"}]});export{y as B,h as D,F as G,A as R,f as S,b as T,E as a,D as b};
