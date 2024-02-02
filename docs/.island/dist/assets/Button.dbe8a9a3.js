import{U as n,f as s,_ as d,v as i,y as l,b as r,A as u,c as e}from"./index.ce30de29.js";import{jsx as t,jsxs as c,Fragment as B}from"react/jsx-runtime";const b=()=>t(n,{code:"<Button> Button </Button>",scope:{Button:s}}),h=()=>t(n,{code:"<Button toggled> Toggled </Button>",scope:{Button:s}}),m=()=>t(n,{code:"<Button disabled> Disabled </Button>",scope:{Button:s}}),f=()=>t(n,{code:`<div className="flex gap-4 items-center">
  <Button size="sm">
    Small
  </Button>  
  <Button size="md">
    Medium
  </Button>  
  <Button size="lg">
    Large
  </Button>  
</div>`,scope:{Button:s}}),y=()=>t(n,{code:`<div className="flex gap-4 items-center">
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
</div>`,scope:{Button:s}}),v=()=>t(n,{code:`<Button.Group>
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
</Button.Group>`,scope:{Button:s,SineIcon:d,SawtoothIcon:i,SquareIcon:l,TriangleIcon:r}}),T=()=>t(u,{data:[{attribute:"value",description:c(B,{children:["The bound value (only effective in ",t(e,{children:"`Group`"}),")."]}),type:t(e,{children:"any"}),default:"-"},{attribute:"disabled",description:"Indicates whether the button is disabled",type:t(e,{children:"boolean"}),default:t(e,{children:"false"})},{attribute:"size",description:"Button size",type:t(e,{children:"'sm' | 'md' | 'lg'"}),default:t(e,{children:"'md'"})},{attribute:"radius",description:"Button border radius",type:t(e,{children:"'none' | 'sm' | 'md' | 'lg' | 'full'"}),default:t(e,{children:"'md'"})},{attribute:"toggled",description:"Indicates whether the button is toggled",type:t(e,{children:"boolean"}),default:t(e,{children:"false"})},{attribute:"onToggleChange",description:"Callback function when the toggle state changes",type:t(e,{children:"(toggled: boolean) => void"}),default:"-"}]}),S=()=>t(u,{data:[{attribute:"value",description:"The value associated with the button group",type:t(e,{children:"any[]"}),default:"-"},{attribute:"disabled",description:"Indicates whether buttons in the button group are disabled",type:t(e,{children:"boolean"}),default:t(e,{children:"false"})},{attribute:"size",description:"Button size",type:t(e,{children:"'sm' | 'md' | 'lg'"}),default:t(e,{children:"'md'"})},{attribute:"radius",description:"Button border radius",type:t(e,{children:"'none' | 'sm' | 'md' | 'lg' | 'full'"}),default:t(e,{children:"'md'"})},{attribute:"classNames",description:"Allows setting custom class names for buttons and toggle states",type:t(e,{children:"{ button?: string }"}),default:"-"},{attribute:"styles",description:"Allows setting custom styles for buttons and toggle states",type:t(e,{children:"{ button?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"Callback function when options change",type:t(e,{children:"(values: any[]) => void"}),default:"-"}]});export{T as B,b as D,v as G,y as R,f as S,h as T,m as a,S as b};
