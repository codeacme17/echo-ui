import{U as n,A as u,a as e}from"./index.105c25bf.js";import{jsx as t,jsxs as i,Fragment as l}from"react/jsx-runtime";import{B as s}from"./index.9726f765.js";import{S as d,a as r,T as c}from"./Triangle.2f45397e.js";function p(o){return t("svg",{xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",viewBox:"0 0 256 256",...o,children:t("path",{fill:"currentColor",d:"m238.29 138.22l-104 64A12 12 0 0 1 116 192V85.47l-85.71 52.75a12 12 0 0 1-12.58-20.44l104-64A12 12 0 0 1 140 64v106.53l85.71-52.75a12 12 0 1 1 12.58 20.44Z"})})}const m=()=>t(n,{code:"<Button> Button </Button>",scope:{Button:s}}),f=()=>t(n,{code:"<Button toggled> Toggled </Button>",scope:{Button:s}}),v=()=>t(n,{code:"<Button disabled> Disabled </Button>",scope:{Button:s}}),y=()=>t(n,{code:`<div className="flex gap-4 items-center">
  <Button size="sm">
    Small
  </Button>  
  <Button size="md">
    Medium
  </Button>  
  <Button size="lg">
    Large
  </Button>  
</div>`,scope:{Button:s}}),w=()=>t(n,{code:`<div className="flex gap-4 items-center">
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
</div>`,scope:{Button:s}}),S=()=>t(n,{code:`<Button.Group>
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
</Button.Group>`,scope:{Button:s,SineIcon:d,SawtoothIcon:p,SquareIcon:r,TriangleIcon:c}}),T=()=>t(u,{data:[{attribute:"value",description:i(l,{children:["The bound value (only effective in ",t(e,{children:"`Group`"}),")."]}),type:t(e,{children:"any"}),default:"-"},{attribute:"disabled",description:"Indicates whether the button is disabled",type:t(e,{children:"boolean"}),default:t(e,{children:"false"})},{attribute:"size",description:"Button size",type:t(e,{children:"'sm' | 'md' | 'lg'"}),default:t(e,{children:"'md'"})},{attribute:"radius",description:"Button border radius",type:t(e,{children:"'none' | 'sm' | 'md' | 'lg' | 'full'"}),default:t(e,{children:"'md'"})},{attribute:"toggled",description:"Indicates whether the button is toggled",type:t(e,{children:"boolean"}),default:t(e,{children:"false"})},{attribute:"onToggleChange",description:"Callback function when the toggle state changes",type:t(e,{children:"(toggled: boolean) => void"}),default:"-"}]}),I=()=>t(u,{data:[{attribute:"value",description:"The value associated with the button group. If the value is an array, the button group will be treated as a multi-select group. Otherwise, it will be treated as a single-select group.",type:t(e,{children:"any"}),default:"-"},{attribute:"disabled",description:"Indicates whether buttons in the button group are disabled",type:t(e,{children:"boolean"}),default:t(e,{children:"false"})},{attribute:"size",description:"Button size",type:t(e,{children:"'sm' | 'md' | 'lg'"}),default:t(e,{children:"'md'"})},{attribute:"radius",description:"Button border radius",type:t(e,{children:"'none' | 'sm' | 'md' | 'lg' | 'full'"}),default:t(e,{children:"'md'"})},{attribute:"classNames",description:"Allows setting custom class names for buttons and toggle states",type:t(e,{children:"{ button?: string }"}),default:"-"},{attribute:"styles",description:"Allows setting custom styles for buttons and toggle states",type:t(e,{children:"{ button?: React.CSSProperties }"}),default:"-"},{attribute:"onChange",description:"Callback function when options change",type:t(e,{children:"(values: any) => void"}),default:"-"}]});export{T as B,m as D,S as G,w as R,y as S,f as T,v as a,I as b};
