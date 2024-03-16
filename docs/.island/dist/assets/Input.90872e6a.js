import{v as _,h as z,c as ae,U as l,A as oe,a as n}from"./index.105c25bf.js";import{jsx as e}from"react/jsx-runtime";import{forwardRef as ie,useState as D,useRef as C,useEffect as M,useCallback as F,useMemo as G}from"react";import{l as ue}from"./transform.3e3dfeca.js";import{s as ce}from"./index.93441784.js";import{u as le}from"./useCommandAltClick.cec7174c.js";const de=ce({base:`inline-block 
          px-3 
          py-2 
          border
          border-input
          bg-input
          select-none
          text-foreground
          rounded-md 
          shadow-sm 
          outline-none
          transition-[border]
          placeholder-muted
          appearance-textfield
          focus:ring-primary
          focus:border-primary
          disabled:pointer-events-none
          disabled:opacity-70
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-webkit-outer-spin-button]:m-0
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-webkit-outer-spin-button]:m-0`,defaultVariants:{size:"md",radius:"md",isDragging:!1,bilateral:!1},variants:{size:{sm:"text-sm py-1 px-2",md:"text-base py-2 px-4",lg:"text-lg py-3 px-6"},radius:{none:"rounded-none",sm:"rounded-sm",md:"rounded-md",lg:"rounded-lg",full:"rounded-full"},isDragging:{true:`cursor-ns-resize 
              [&::selection]:bg-transparent 
              [&::selection]:transition-colors`},bilateral:{true:"text-center"}}}),pe="number",me="md",fe="md",W=0,be=100,he=1,ge=5,$=20,ve="var(--echo-primary)",ye=ie((s,a)=>{const{value:f=W,type:d=pe,size:j=me,radius:q=fe,min:r=W,max:u=be,step:I=he,disabled:p=!1,bilateral:x=!1,prohibitDrag:H=!1,sensitivity:X=ge,hideProgress:k=!1,progressColor:P=ve,onChange:c,onBlur:N,onMouseDown:R,...E}=s,[b,m]=D(f),[y,Z]=D(!1),[Y,J]=D(null),[K,A]=D("positive"),T=C(0),V=C(0),S=C(!1),h=ue().domain([r,u]).range([0,100])(b);M(()=>{if(p)return;const t=_(f,r,u);m(t)},[f,r,u,p]);const w=le(()=>{d==="number"&&(m(x?z(r,u):r),c==null||c({value:x?z(r,u):r,nativeEvent:Y}))}),Q=F(t=>{let o=t.target.value;d==="number"&&(o=B(o)),m(o),J(t),c==null||c({value:o,nativeEvent:t})},[d]),B=t=>t==="-"||t==="."||t===""?t:isNaN(t)?void 0:_(Number(t),r,u),ee=t=>{d==="number"&&(b===""&&m(r),N==null||N(t))};M(()=>{p||m(d==="number"?B(f):f)},[f]);const L=t=>{S.current=t,Z(t)},te=F(t=>{const se=-(t-T.current)*(X/10)*I;let v=b+se;v=parseFloat((Math.round(v/I)*I).toFixed(10)),v=Math.max(r,Math.min(v,u)),m(v),c==null||c({value:v,nativeEvent:Y})},[b,r,u,I]),ne=t=>{R==null||R(t),!(d!=="number"||H||p)&&(T.current=t.clientY,document.addEventListener("mousemove",O),document.addEventListener("mouseup",U),w(t))},O=t=>{const o=t.clientY;!S.current&&Math.abs(o-T.current)>$&&(L(!0),V.current=o>T.current?-$:$),S.current&&requestAnimationFrame(()=>te(o+V.current))},U=t=>{L(!1),document.removeEventListener("mousemove",O),document.removeEventListener("mouseup",U),w(t)};M(()=>{y?document.getElementsByTagName("html")[0].style.cursor="ns-resize":document.getElementsByTagName("html")[0].style.cursor=""},[y]);const g=G(()=>k?"transparent":p?"var(--echo-muted)":P,[k,p,P,p]),re=G(()=>d!=="number"?"":x?b>=z(r,u)?(A("positive"),`linear-gradient(to right, 
        transparent 50%, 
        ${g} 50%,
        ${g} ${h}%, 
        transparent ${100-h}%)`):(A("negative"),`linear-gradient(to left, 
        transparent 50%, 
        ${g} 50%,
        ${g} ${100-h}%, 
        transparent 0%)`):`linear-gradient(to right, ${g} ${h}%, transparent ${h}%)`,[g,h]);return e("input",{...E,ref:a,"data-dragging":y,"data-bilateral":K,type:d,value:b,disabled:p,readOnly:y||E.readOnly,className:ae(de({size:j,radius:q,isDragging:y,bilateral:x}),E.className),style:{...E.style,backgroundImage:re},onChange:Q,onMouseDown:ne,onBlur:ee})}),i=ye;i.displayName="EchoUI.Input";const Se=()=>e(l,{code:"<Input />",scope:{Input:i}}),ze=()=>e(l,{code:"<Input disabled value={30}/>",scope:{Input:i}}),Ce=()=>e(l,{code:`<div className="flex gap-4 items-center flex-wrap">
  <Input size="sm" />
  <Input size="md" />
  <Input size="lg" />
</div>`,scope:{Input:i}}),Me=()=>e(l,{code:`<div className="flex gap-4 flex-wrap">
  <Input radius="none" />
  <Input radius="sm" />
  <Input radius="md" />
  <Input radius="lg" />
  <Input radius="full" />
</div>`,scope:{Input:i}}),$e=()=>e(l,{code:"<Input min={-50} max={50} />",scope:{Input:i}}),ke=()=>e(l,{code:"<Input bilateral value={50} />",scope:{Input:i}}),Pe=()=>e(l,{code:"<Input type='text' value={'echo-ui'} />",scope:{Input:i}}),Ye=()=>e(l,{code:"<Input step={10} sensitivity={1} />",scope:{Input:i}}),Ae=()=>e(l,{code:"<Input value={30} progressColor='#8b5cf6' className='focus:border-[#8b5cf6]' />",scope:{Input:i}}),Ve=()=>e(oe,{data:[{attribute:"value",description:"The value of the input box",type:e(n,{children:"any"}),default:e(n,{children:"0"})},{attribute:"type",description:"The type of the input box (overrides the native type attribute)",type:e(n,{children:"'text' | 'number'"}),default:e(n,{children:"'number'"})},{attribute:"bilateral",description:"Whether to enable bidirectional dragging",type:e(n,{children:"boolean"}),default:e(n,{children:"false"})},{attribute:"size",description:"The size of the input box",type:e(n,{children:"'sm' | 'md' | 'lg'"}),default:e(n,{children:"'md'"})},{attribute:"radius",description:"The border radius of the input box",type:e(n,{children:"'none' | 'sm' | 'md' | 'lg' | 'full'"}),default:e(n,{children:"'md'"})},{attribute:"min",description:"The minimum value of the input box",type:e(n,{children:"number"}),default:e(n,{children:"0"})},{attribute:"max",description:"The maximum value of the input box",type:e(n,{children:"number"}),default:e(n,{children:"100"})},{attribute:"step",description:"The step value of the input box",type:e(n,{children:"number"}),default:e(n,{children:"1"})},{attribute:"sensitivity",description:"The sensitivity of the input box",type:e(n,{children:"1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10"}),default:e(n,{children:"5"})},{attribute:"prohibitDrag",description:"Whether to disable dragging",type:e(n,{children:"boolean"}),default:e(n,{children:"false"})},{attribute:"hideProgress",description:"Whether to hide the progress bar",type:e(n,{children:"boolean"}),default:e(n,{children:"false"})},{attribute:"progressColor",description:"The color of the progress bar",type:e(n,{children:"string"}),default:e(n,{children:"'var(--echo-primary)'"})},{attribute:"onChange",description:"Callback function when the value of the input box changes",type:e(n,{children:`(e: {
          value: any,
          nativeEvent?: React.ChangeEvent<HTMLInputElement>
        }) => void`}),default:"-"}]});export{ke as B,Se as D,Ve as I,$e as M,Ae as P,Me as R,Ce as S,Pe as T,ze as a,Ye as b};
