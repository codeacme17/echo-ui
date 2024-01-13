import{U as n,w as s}from"./index.88984242.js";import{jsx as e}from"react/jsx-runtime";import{A as r,c as u}from"./index.55340fb1.js";const d=()=>e(n,{code:"<Input />",scope:{Input:s}}),p=()=>e(n,{code:"<Input disabled value={30}/>",scope:{Input:s}}),l=()=>e(n,{code:`<div className="flex gap-4 items-center flex-wrap">
  <Input size="sm" />
  <Input size="md" />
  <Input size="lg" />
</div>`,scope:{Input:s}}),I=()=>e(n,{code:`<div className="flex gap-4 flex-wrap">
  <Input radius="none" />
  <Input radius="sm" />
  <Input radius="md" />
  <Input radius="lg" />
  <Input radius="full" />
</div>`,scope:{Input:s}}),b=()=>e(n,{code:"<Input min={-50} max={50} />",scope:{Input:s}}),h=()=>e(n,{code:"<Input bilateral value={50} />",scope:{Input:s}}),m=()=>e(n,{code:"<Input type='text' value={'echo-ui'} />",scope:{Input:s}}),f=()=>e(n,{code:"<Input step={10} sensitivity={1} />",scope:{Input:s}}),F=()=>e(n,{code:"<Input value={30} progressColor='#8b5cf6' className='focus:border-[#8b5cf6]' />",scope:{Input:s}}),y=()=>e(r,{data:[{attribute:"value",description:"\u8F93\u5165\u6846\u7684\u503C",type:e(u,{children:"any"}),default:e(u,{children:"0"})},{attribute:"type",description:"\u8F93\u5165\u6846\u7684\u7C7B\u578B\uFF08\u8BE5\u5C5E\u6027\u8986\u76D6\u4E86\u539F\u751F\u7684 type \u5C5E\u6027\uFF09",type:e(u,{children:"'text' | 'number'"}),default:e(u,{children:"'number'"})},{attribute:"bilateral",description:"\u662F\u5426\u5F00\u542F\u53CC\u5411\u62D6\u52A8",type:e(u,{children:"boolean"}),default:e(u,{children:"false"})},{attribute:"size",description:"\u8F93\u5165\u6846\u7684\u5C3A\u5BF8",type:e(u,{children:"'sm' | 'md' | 'lg'"}),default:e(u,{children:"'md'"})},{attribute:"radius",description:"\u8F93\u5165\u6846\u7684\u5706\u89D2",type:e(u,{children:"'none' | 'sm' | 'md' | 'lg' | 'full'"}),default:e(u,{children:"'md'"})},{attribute:"min",description:"\u8F93\u5165\u6846\u7684\u6700\u5C0F\u503C",type:e(u,{children:"number"}),default:e(u,{children:"0"})},{attribute:"max",description:"\u8F93\u5165\u6846\u7684\u6700\u5927\u503C",type:e(u,{children:"number"}),default:e(u,{children:"100"})},{attribute:"step",description:"\u8F93\u5165\u6846\u7684\u6B65\u957F",type:e(u,{children:"number"}),default:e(u,{children:"1"})},{attribute:"sensitivity",description:"\u8F93\u5165\u6846\u7684\u7075\u654F\u5EA6",type:e(u,{children:"1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10"}),default:e(u,{children:"5"})},{attribute:"prohibitDrag",description:"\u662F\u5426\u7981\u6B62\u62D6\u52A8",type:e(u,{children:"boolean"}),default:e(u,{children:"false"})},{attribute:"hideProgress",description:"\u662F\u5426\u9690\u85CF\u8FDB\u5EA6\u6761",type:e(u,{children:"boolean"}),default:e(u,{children:"false"})},{attribute:"progressColor",description:"\u8FDB\u5EA6\u6761\u7684\u989C\u8272",type:e(u,{children:"string"}),default:e(u,{children:"'var(--echo-primary)'"})},{attribute:"onChange",description:"\u8F93\u5165\u6846\u503C\u53D8\u5316\u65F6\u7684\u56DE\u8C03\u51FD\u6570",type:e(u,{children:`(e: {
          value: any,
          nativeEvent?: React.ChangeEvent<HTMLInputElement>
        }) => void`}),default:"-"}]});export{h as B,d as D,y as I,b as M,F as P,I as R,l as S,m as T,p as a,f as b};
