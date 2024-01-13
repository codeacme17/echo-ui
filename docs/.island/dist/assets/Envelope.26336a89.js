import{jsxs as d,jsx as e,Fragment as L}from"react/jsx-runtime";import{a4 as M,C as N}from"./CodeBlock.15abbd2c.js";import{A as R,O as k}from"./index.5a6550a4.js";import*as a from"react";import{s as A,f as w,D as s,U as x}from"./index.88984242.js";import"react-dom";import"./_commonjsHelpers.4e997714.js";/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=M("Activity",[["path",{d:"M22 12h-4l-3 9L9 3l-3 9H2",key:"d5dnw9"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=M("Hand",[["path",{d:"M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0",key:"aigmz7"}],["path",{d:"M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2",key:"1n6bmn"}],["path",{d:"M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8",key:"a9iiix"}],["path",{d:"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",key:"1s1gnw"}]]),U=()=>{const n={attack:.6,decay:.2,sustain:.8,release:.2},[t,v]=a.useState({...n}),[c,p]=a.useState(n.attack),[l,m]=a.useState(n.decay),[r,D]=a.useState(n.sustain),[i,f]=a.useState(n.release),[h,g]=a.useState(!1);a.useEffect(()=>{v({attack:c,decay:l,sustain:r,release:i})},[c,l,r,i]);const S=b=>{p(b.attack),m(b.decay),D(b.sustain),f(b.release)},o=a.useRef(),y=a.useRef();return d("section",{className:"flex flex-col items-center w-full",children:[e(A,{className:"mb-5 cursor-grab",toggled:h,onMouseDown:()=>{g(!0),o.current=new R({attack:c,decay:l,sustain:r,release:i}).toDestination(),y.current=new k().connect(o.current).start(),o.current.triggerAttack()},onMouseUp:()=>{g(!1),o.current&&(o.current.triggerRelease(),setTimeout(()=>{!o.current||!y.current||(y.current.stop(),y.current.dispose(),o.current.dispose())},i*1e3))},children:e(j,{className:"w-4 h-4"})}),e(w,{data:t,onDataChange:S}),d(s.Group,{className:"gap-8 mt-5 w-full justify-center",trackWidth:2,size:32,max:1,min:0,pointerHeight:5,pointerWidth:3,rotationRange:360,step:.01,sensitivity:5,children:[e(s,{bottomLabel:"Attack",value:c,onChange:p}),e(s,{bottomLabel:"Decay",value:l,onChange:m}),e(s,{bottomLabel:"Sustain",value:r,onChange:D}),e(s,{bottomLabel:"Release",value:i,onChange:f})]})]})},z=()=>{const n={attack:0,hold:1,decay:0,sustain:0,release:0},[t,v]=a.useState({...n}),[c,p]=a.useState(n.attack),[l,m]=a.useState(n.hold),[r,D]=a.useState(n.decay),[i,f]=a.useState(n.sustain),[h,g]=a.useState(n.release);a.useEffect(()=>{v({attack:c,decay:r,hold:l,sustain:i,release:h})},[c,l,r,i,h]);const S=u=>{p(u.attack),D(u.decay),m(u.hold),f(u.sustain),g(u.release)},o=a.useRef(),y=a.useRef();return d("section",{className:"flex flex-col items-center",children:[e(A,{className:"mb-5",onMouseDown:()=>{o.current=new R({attack:c,decay:r,sustain:i,release:h}).toDestination(),y.current=new k().connect(o.current).start(),o.current.triggerAttack(),o.current.triggerRelease(`+${c+l+r}}`)},children:e(H,{className:"w-4 h-4"})}),e(w,{data:t,onDataChange:S}),d(s.Group,{className:"gap-8 mt-5 w-full justify-center",trackWidth:2,size:32,max:1,min:0,pointerHeight:5,pointerWidth:3,rotationRange:360,step:.01,sensitivity:5,children:[e(s,{bottomLabel:"Attack",value:c,onChange:p}),e(s,{bottomLabel:"Hold",value:l,onChange:m}),e(s,{bottomLabel:"Decay",value:r,onChange:D}),e(s,{bottomLabel:"Sustain",value:i,onChange:f}),e(s,{bottomLabel:"Release",value:h,onChange:g})]})]})},B=()=>{const n={delay:.5,attack:.6,decay:.6,sustain:.4,release:.8},[t,v]=a.useState({...n}),[c,p]=a.useState(n.delay),[l,m]=a.useState(n.attack),[r,D]=a.useState(n.decay),[i,f]=a.useState(n.sustain),[h,g]=a.useState(n.release);a.useEffect(()=>{v({delay:c,attack:l,decay:r,sustain:i,release:h})},[c,l,r,i,h]);const S=u=>{p(u.delay),m(u.attack),D(u.decay),f(u.sustain),g(u.release)},o=a.useRef(),y=a.useRef();return d("section",{className:"flex flex-col items-center",children:[e(A,{className:"mb-5",onMouseDown:()=>{o.current=new R({attack:l,decay:r,sustain:i,release:h}).toDestination(),y.current=new k().connect(o.current).start(),o.current.triggerAttack(`+${c||0}`),o.current.triggerRelease(`+${c+l+r}}`)},children:e(H,{className:"w-4 h-4"})}),e(w,{data:t,onDataChange:S}),d(s.Group,{className:"gap-8 mt-5 w-full justify-center",trackWidth:2,size:32,max:1,min:0,pointerHeight:5,pointerWidth:3,rotationRange:360,step:.01,sensitivity:5,children:[e(s,{bottomLabel:"Delay",value:c,onChange:p}),e(s,{bottomLabel:"Attack",value:l,onChange:m}),e(s,{bottomLabel:"Decay",value:r,onChange:D}),e(s,{bottomLabel:"Sustain",value:i,onChange:f}),e(s,{bottomLabel:"Release",value:h,onChange:g})]})]})},W=()=>e(x,{code:"<EnvelopeDefault />",scope:{EnvelopeDefault:U},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/EnvelopeDefault.tsx"}),_=()=>e(x,{code:"<EnvelopeAHDSR />",scope:{EnvelopeAHDSR:z},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/EnvelopeAHDSR.tsx"}),O=()=>e(x,{code:"<EnvelopeDADSR />",scope:{EnvelopeDADSR:B},type:"link",url:"https://github.com/codeacme17/echo-ui/blob/main/docs/src/components/Example/EnvelopeDADSR.tsx"}),X=void 0,F=[{id:"\u5F15\u5165",text:"\u5F15\u5165",depth:2},{id:"\u4EE3\u7801\u6F14\u793A",text:"\u4EE3\u7801\u6F14\u793A",depth:2},{id:"ahdsr-\u5305\u7EDC",text:"AHDSR \u5305\u7EDC",depth:3},{id:"delay-\u5EF6\u8FDF",text:"Delay \u5EF6\u8FDF",depth:3}],q="Envelope \u5305\u7EDC\u63A7\u5236\u5668";function E(n){const t=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",h3:"h3",code:"code"},n.components);return d(L,{children:[d(t.h1,{id:"envelope-\u5305\u7EDC\u63A7\u5236\u5668",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#envelope-\u5305\u7EDC\u63A7\u5236\u5668",children:"#"}),"Envelope \u5305\u7EDC\u63A7\u5236\u5668"]}),`
`,d(t.p,{children:["Envelope \u662F\u4E00\u4E2A ",e(t.a,{href:"https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope",target:"_blank",rel:"nofollow",children:"ADSR"})," \u5305\u7EDC\u53D1\u751F\u5668\u7684\u53EF\u89C6\u5316\u7EBF\u6027\u4EA4\u4E92\u5F0F\u7EC4\u4EF6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u8BE5\u7EC4\u4EF6\u63A7\u5236 ADSR \u76F8\u5173\u7684\u5C5E\u6027"]}),`
`,d(t.h2,{id:"\u5F15\u5165",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5F15\u5165",children:"#"}),"\u5F15\u5165"]}),`
`,e(N,{code:"import { Envelope } from 'echo-ui'"}),`
`,d(t.h2,{id:"\u4EE3\u7801\u6F14\u793A",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4EE3\u7801\u6F14\u793A",children:"#"}),"\u4EE3\u7801\u6F14\u793A"]}),`
`,e(W,{}),`
`,d(t.h3,{id:"ahdsr-\u5305\u7EDC",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#ahdsr-\u5305\u7EDC",children:"#"}),"AHDSR \u5305\u7EDC"]}),`
`,e(_,{}),`
`,d(t.p,{children:["\u5728\u5411 ",e(t.code,{children:"data"})," \u4E2D\u4F20\u5165 ",e(t.code,{children:"hold"})," \u53C2\u6570\u540E\u5373\u53EF\u5B9E\u73B0 ",e(t.a,{href:"https://support.output.com/hc/en-us/articles/4408642133399-AHDSR-Modulation",target:"_blank",rel:"nofollow",children:"AHDSR"})," \u5305\u7EDC"]}),`
`,d(t.h3,{id:"delay-\u5EF6\u8FDF",children:[e(t.a,{className:"header-anchor","aria-hidden":"true",href:"#delay-\u5EF6\u8FDF",children:"#"}),"Delay \u5EF6\u8FDF"]}),`
`,e(O,{}),`
`,d(t.p,{children:["\u5728\u5411 ",e(t.code,{children:"data"})," \u4E2D\u4F20\u5165 ",e(t.code,{children:"delay"})," \u53C2\u6570\u540E\u53EF\u4EE5\u52A0\u5165 ",e(t.code,{children:"delay"})," \u7684\u64CD\u4F5C\u70B9"]})]})}function J(n={}){const{wrapper:t}=n.components||{};return t?e(t,Object.assign({},n,{children:e(E,n)})):E(n)}const K="2024/1/13 16:19:35",Q=`import { CodeBlock } from '../../src/components/CodeBlock.tsx'\r
import { Default, AHDSR, DADSR } from '../../src/components/UsageBox/Envelope.tsx'\r
\r
# Envelope \u5305\u7EDC\u63A7\u5236\u5668\r
\r
Envelope \u662F\u4E00\u4E2A [ADSR](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope) \u5305\u7EDC\u53D1\u751F\u5668\u7684\u53EF\u89C6\u5316\u7EBF\u6027\u4EA4\u4E92\u5F0F\u7EC4\u4EF6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u8BE5\u7EC4\u4EF6\u63A7\u5236 ADSR \u76F8\u5173\u7684\u5C5E\u6027\r
\r
## \u5F15\u5165\r
\r
<CodeBlock code={\`import { Envelope } from 'echo-ui'\`} />\r
\r
## \u4EE3\u7801\u6F14\u793A\r
\r
<Default />\r
\r
### AHDSR \u5305\u7EDC\r
\r
<AHDSR />\r
\r
\u5728\u5411 \`data\` \u4E2D\u4F20\u5165 \`hold\` \u53C2\u6570\u540E\u5373\u53EF\u5B9E\u73B0 [AHDSR](https://support.output.com/hc/en-us/articles/4408642133399-AHDSR-Modulation) \u5305\u7EDC\r
\r
### Delay \u5EF6\u8FDF\r
\r
<DADSR />\r
\r
\u5728\u5411 \`data\` \u4E2D\u4F20\u5165 \`delay\` \u53C2\u6570\u540E\u53EF\u4EE5\u52A0\u5165 \`delay\` \u7684\u64CD\u4F5C\u70B9\r
`;export{Q as content,J as default,X as frontmatter,K as lastUpdatedTime,q as title,F as toc};
