import*as u from"react";import _,{useState as x,useEffect as G,useRef as q,useCallback as he,lazy as Ve,forwardRef as Fe,createContext as Ge,Fragment as Le}from"react";import{jsx as r,jsxs as h}from"react/jsx-runtime";var U=function(e){return function(t){return Math.pow(t,e)}},W=function(e){return function(t){return 1-Math.abs(Math.pow(t-1,e))}},J=function(e){return function(t){return t<.5?U(e)(t*2)/2:W(e)(t*2-1)/2+.5}},Ke=function(e){return e},Ye=U(2),Xe=W(2),Qe=J(2),Ze=U(3),Je=W(3),et=J(3),tt=U(4),nt=W(4),rt=J(4),ot=U(5),at=W(5),it=J(5),st=function(e){return 1+Math.sin(Math.PI/2*e-Math.PI/2)},ct=function(e){return Math.sin(Math.PI/2*e)},lt=function(e){return(1+Math.sin(Math.PI*e-Math.PI/2))/2},le=function(e){var t=7.5625,n=2.75;return e<1/n?t*e*e:e<2/n?(e-=1.5/n,t*e*e+.75):e<2.5/n?(e-=2.25/n,t*e*e+.9375):(e-=2.625/n,t*e*e+.984375)},Me=function(e){return 1-le(1-e)},dt=function(e){return e<.5?Me(e*2)*.5:le(e*2-1)*.5+.5},ut=Object.freeze({linear:Ke,quadIn:Ye,quadOut:Xe,quadInOut:Qe,cubicIn:Ze,cubicOut:Je,cubicInOut:et,quartIn:tt,quartOut:nt,quartInOut:rt,quintIn:ot,quintOut:at,quintInOut:it,sineIn:st,sineOut:ct,sineInOut:lt,bounceOut:le,bounceIn:Me,bounceInOut:dt}),ee=function(t){var n=t.from,o=t.to,a=t.duration,i=t.delay,c=t.easing,s=t.onStart,l=t.onUpdate,m=t.onFinish;for(var v in n)o[v]===void 0&&(o[v]=n[v]);for(var f in o)n[f]===void 0&&(n[f]=o[f]);this.from=n,this.to=o,this.duration=a||500,this.delay=i||0,this.easing=c||"linear",this.onStart=s,this.onUpdate=l||function(){},this.onFinish=m,this.startTime=Date.now()+this.delay,this.started=!1,this.finished=!1,this.timer=null,this.keys={}};ee.prototype.update=function(){if(this.time=Date.now(),!(this.time<this.startTime)&&!this.finished){if(this.elapsed===this.duration){this.finished||(this.finished=!0,this.onFinish&&this.onFinish(this.keys));return}this.elapsed=this.time-this.startTime,this.elapsed=this.elapsed>this.duration?this.duration:this.elapsed;for(var t in this.to)this.keys[t]=this.from[t]+(this.to[t]-this.from[t])*ut[this.easing](this.elapsed/this.duration);this.started||(this.onStart&&this.onStart(this.keys),this.started=!0),this.onUpdate(this.keys)}};ee.prototype.start=function(){var t=this;this.startTime=Date.now()+this.delay;var n=function(){t.update(),t.timer=requestAnimationFrame(n),t.finished&&(cancelAnimationFrame(t.timer),t.timer=null)};n()};ee.prototype.stop=function(){cancelAnimationFrame(this.timer),this.timer=null};var mt=typeof global=="object"&&global&&global.Object===Object&&global;const ht=mt;var ft=typeof self=="object"&&self&&self.Object===Object&&self,pt=ht||ft||Function("return this")();const ze=pt;var vt=ze.Symbol;const K=vt;var $e=Object.prototype,gt=$e.hasOwnProperty,bt=$e.toString,j=K?K.toStringTag:void 0;function _t(e){var t=gt.call(e,j),n=e[j];try{e[j]=void 0;var o=!0}catch{}var a=bt.call(e);return o&&(t?e[j]=n:delete e[j]),a}var wt=Object.prototype,yt=wt.toString;function xt(e){return yt.call(e)}var Et="[object Null]",St="[object Undefined]",fe=K?K.toStringTag:void 0;function kt(e){return e==null?e===void 0?St:Et:fe&&fe in Object(e)?_t(e):xt(e)}function It(e){return e!=null&&typeof e=="object"}var Tt="[object Symbol]";function Pt(e){return typeof e=="symbol"||It(e)&&kt(e)==Tt}var Ot=/\s/;function Nt(e){for(var t=e.length;t--&&Ot.test(e.charAt(t)););return t}var Rt=/^\s+/;function Ct(e){return e&&e.slice(0,Nt(e)+1).replace(Rt,"")}function Y(e){var t=typeof e;return e!=null&&(t=="object"||t=="function")}var pe=0/0,At=/^[-+]0x[0-9a-f]+$/i,Lt=/^0b[01]+$/i,Mt=/^0o[0-7]+$/i,zt=parseInt;function ve(e){if(typeof e=="number")return e;if(Pt(e))return pe;if(Y(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=Y(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=Ct(e);var n=Lt.test(e);return n||Mt.test(e)?zt(e.slice(2),n?2:8):At.test(e)?pe:+e}var $t=function(){return ze.Date.now()};const re=$t;var Dt="Expected a function",jt=Math.max,qt=Math.min;function Bt(e,t,n){var o,a,i,c,s,l,m=0,v=!1,f=!1,E=!0;if(typeof e!="function")throw new TypeError(Dt);t=ve(t)||0,Y(n)&&(v=!!n.leading,f="maxWait"in n,i=f?jt(ve(n.maxWait)||0,t):i,E="trailing"in n?!!n.trailing:E);function y(d){var p=o,I=a;return o=a=void 0,m=d,c=e.apply(I,p),c}function T(d){return m=d,s=setTimeout(g,t),v?y(d):c}function A(d){var p=d-l,I=d-m,me=t-p;return f?qt(me,i-I):me}function S(d){var p=d-l,I=d-m;return l===void 0||p>=t||p<0||f&&I>=i}function g(){var d=re();if(S(d))return k(d);s=setTimeout(g,A(d))}function k(d){return s=void 0,E&&o?y(d):(o=a=void 0,c)}function ne(){s!==void 0&&clearTimeout(s),m=0,o=l=a=s=void 0}function $(){return s===void 0?c:k(re())}function D(){var d=re(),p=S(d);if(o=arguments,a=this,l=d,p){if(s===void 0)return T(l);if(f)return clearTimeout(s),s=setTimeout(g,t),y(l)}return s===void 0&&(s=setTimeout(g,t)),c}return D.cancel=ne,D.flush=$,D}var Ht="Expected a function";function Ut(e,t,n){var o=!0,a=!0;if(typeof e!="function")throw new TypeError(Ht);return Y(n)&&(o="leading"in n?!!n.leading:o,a="trailing"in n?!!n.trailing:a),Bt(e,t,{leading:o,maxWait:t,trailing:a})}function Wt({backTop:e}){const t=e!=null?e:!0,n=()=>{const i=document.documentElement,c=i.scrollTop;new ee({from:{scrollTop:c},to:{scrollTop:0},easing:"quadIn",duration:500,onUpdate:l=>{i.scrollTop=Number(l==null?void 0:l.scrollTop)}}).start()},[o,a]=x(!1);return G(()=>{const i=Ut(()=>{const s=document.documentElement.scrollTop;a(s>=200)},500);return document.addEventListener("scroll",i),()=>{i.cancel(),document.removeEventListener("scroll",i)}}),t&&o?r("div",{className:"fixed bottom-10 right-30 z-10",display:"none md:block",onClick:n,children:r("button",{className:"w-10 h-10 rounded-full duration-300",style:{backgroundColor:"var(--island-c-bg)"},color:"gray hover:gray-500",bg:"~ gray-200 hover:gray-300",shadow:"sm hover:md",children:r("div",{flex:"~ center",children:r("div",{className:"i-carbon-chevron-up",text:"xl"})})})}):null}const Vt="modulepreload",Ft=function(e){return"/"+e},ge={},b=function(t,n,o){return!n||n.length===0?t():Promise.all(n.map(a=>{if(a=Ft(a),a in ge)return;ge[a]=!0;const i=a.endsWith(".css"),c=i?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${c}`))return;const s=document.createElement("link");if(s.rel=i?"stylesheet":Vt,i||(s.as="script",s.crossOrigin=""),s.href=a,document.head.appendChild(s),i)return new Promise((l,m)=>{s.addEventListener("load",l),s.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${a}`)))})})).then(()=>t())},Gt="_searchInput_y03a3_1",Kt="_searchCommand_y03a3_7",Yt="_focus_y03a3_14",oe={searchInput:Gt,searchCommand:Kt,focus:Yt},Xt=e=>u.createElement("svg",{width:32,height:32,viewBox:"0 0 32 32",...e},u.createElement("path",{fill:"#888888",d:"m29 27.586l-7.552-7.552a11.018 11.018 0 1 0-1.414 1.414L27.586 29ZM4 13a9 9 0 1 1 9 9a9.01 9.01 0 0 1-9-9Z"})),Qt=e=>u.createElement("svg",{width:32,height:32,viewBox:"0 0 24 24",...e},u.createElement("g",{fill:"none",stroke:"var(--island-c-brand)",strokeLinecap:"round",strokeWidth:2},u.createElement("path",{strokeDasharray:60,strokeDashoffset:60,strokeOpacity:.3,d:"M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"},u.createElement("animate",{fill:"freeze",attributeName:"stroke-dashoffset",dur:"1.3s",values:"60;0"})),u.createElement("path",{strokeDasharray:15,strokeDashoffset:15,d:"M12 3C16.9706 3 21 7.02944 21 12"},u.createElement("animate",{fill:"freeze",attributeName:"stroke-dashoffset",dur:"0.3s",values:"15;0"}),u.createElement("animateTransform",{attributeName:"transform",dur:"1.5s",repeatCount:"indefinite",type:"rotate",values:"0 12 12;360 12 12"}))));function Zt(e){const{suggestion:t,query:n}=e,o=()=>{if(t.type==="header"){const{header:i,headerHighlightIndex:c}=t,s=i.slice(0,c),l=i.slice(c+n.length);return h("div",{font:"medium",children:[r("span",{children:s}),r("span",{bg:"brand-light",p:"y-0.4 x-0.8",rounded:"md",text:"text-1",children:n}),r("span",{children:l})]})}else return r("div",{font:"medium",children:t.header})},a=()=>{if(t.type!=="content")return;const{statementHighlightIndex:i,statement:c}=t,s=c.slice(0,i),l=c.slice(i+n.length);return h("div",{font:"normal",text:"sm gray-light",w:"100%",children:[r("span",{children:s}),r("span",{bg:"brand-light",p:"y-0.4 x-0.8",rounded:"md",text:"[#000]",children:n}),r("span",{children:l})]})};return h("div",{"border-b-1":"","border-t-1":"","table-cell":"",p:"x-3 y-2",hover:"bg-[#f3f4f5] ",text:"#2c3e50",className:`border-right-none border-[#eaecef] ${e.isCurrent?"bg-[#f3f4f5]":"bg-white"}`,transition:"bg duration-200",children:[r("div",{font:"medium",text:"sm",children:o()}),t.type==="content"&&a()]})}const V={ARROW_UP:"ArrowUp",ARROW_DOWN:"ArrowDown",ENTER:"Enter",SEARCH:"KeyK"};function Jt(e){const[t,n]=x(""),[o,a]=x([]),[i,c]=x(!1),[s,l]=x(!1),[m,v]=x(!1),[f,E]=x(-1),y=q(),T=q(),[A,S]=x(!0),g=q(null),k=!i||s,ne=!k&&o.length===0,$=he(async()=>{if(y.current)return Promise.resolve();{const{PageSearcher:d}=await b(()=>import("./search.db721d80.js"),["assets/search.db721d80.js","assets/_commonjsHelpers.4e997714.js"]);y.current=new d(e.langRoutePrefix),await y.current.init(),c(!0)}},[e.langRoutePrefix]),D=he(async d=>{const p=d.target.value;n(p),T.current=T.current||$(),await T.current,l(!0);const I=await y.current.match(p);l(!1),a(I)},[$]);return G(()=>{const d=p=>{switch(p.code){case V.SEARCH:(p.ctrlKey||p.metaKey)&&g.current&&(p.preventDefault(),m?(v(!1),g.current.blur()):(v(!0),g.current.focus()));break;case V.ARROW_DOWN:p.preventDefault(),E((f+1)%o.length);break;case V.ARROW_UP:p.preventDefault(),E((f-1+o.length)%o.length);break;case V.ENTER:if(f>=0){const I=o[f];window.location.href=I.link}break}};return document.addEventListener("keydown",d),()=>{document.removeEventListener("keydown",d)}},[f,m,o]),G(()=>{S(!1)},[]),h("div",{flex:"","items-center":"~",relative:"",mr:"2",font:"semibold",children:[r(Xt,{w:"5",h:"5",fill:"currentColor",onClick:()=>{v(!0),g.current.focus()}}),r("input",{disabled:A,cursor:"text focus:auto",placeholder:"Search",height:"8",border:"none",type:"text",text:"sm",p:"t-0 r-2 b-0 l-2",transition:"all duration-200 ease",className:`rounded-sm ${oe.searchInput} ${m?oe.focus:""}`,"aria-label":"Search",autoComplete:"off",onChange:D,onBlur:()=>setTimeout(()=>v(!1),200),onFocus:()=>{v(!0),T.current=$()},ref:g}),h("div",{m:"r-3",w:"10",h:"6",p:"x-1.5",rounded:"md",border:"1px solid gray-light-3",text:"xs gray-light-3",flex:"~","items-center":"~",justify:"around",className:oe.searchCommand,children:[r("span",{children:"\u2318"}),r("span",{children:"K"})]}),m&&t&&h("ul",{pos:"fixed sm:absolute top-12 sm:top-8 left-0",z:"60","border-1":"",p:"2",list:"none",bg:"bg-default",className:"w-100% sm:min-w-500px sm:max-w-700px",children:[o.map((d,p)=>r("li",{rounded:"sm",cursor:"pointer",w:"100%",className:"border-collapse",children:r("a",{block:"",href:d.link,className:"whitespace-normal",children:h("div",{table:"",w:"100%",className:"border-collapse",children:[r("div",{w:"35%","border-t-1":"","border-b-1":"","border-r-1":"","border-left":"none","table-cell":"",align:"middle right",p:"1.2",text:"sm right [#2c3e50]",font:"semibold",className:"bg-[#f5f5f5] border-[#eaecef]",children:d.title}),r(Zt,{suggestion:d,query:t,isCurrent:p===f})]})})},d.title)),ne&&r("li",{flex:"center",children:r("div",{p:"2",text:"sm #2c3e50",children:"No results found"})}),k&&r("li",{flex:"center",children:r("div",{p:"2",text:"sm",children:r(Qt,{})})})]})]})}const en="_navHamburger_14nz8_1",tn="_container_14nz8_14",nn="_top_14nz8_21",rn="_middle_14nz8_27",on="_bottom_14nz8_33",an="_active_14nz8_39",L={navHamburger:en,container:tn,top:nn,middle:rn,bottom:on,active:an},sn="_navScreen_1mkpq_1",cn="_active_1mkpq_17",ln="_container_1mkpq_21",dn="_navMenu_1mkpq_27",un="_navMenuItem_1mkpq_34",mn="_navAppearance_1mkpq_46",hn="_socialAndAppearance_1mkpq_50",P={navScreen:sn,active:cn,container:ln,navMenu:dn,navMenuItem:un,navAppearance:mn,socialAndAppearance:hn};function fn(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}else return Array.from(e)}var de=!1;if(typeof window<"u"){var be={get passive(){de=!0}};window.addEventListener("testPassive",null,be),window.removeEventListener("testPassive",null,be)}var X=typeof window<"u"&&window.navigator&&window.navigator.platform&&(/iP(ad|hone|od)/.test(window.navigator.platform)||window.navigator.platform==="MacIntel"&&window.navigator.maxTouchPoints>1),M=[],Q=!1,ue=-1,B=void 0,N=void 0,H=void 0,De=function(t){return M.some(function(n){return!!(n.options.allowTouchMove&&n.options.allowTouchMove(t))})},Z=function(t){var n=t||window.event;return De(n.target)||n.touches.length>1?!0:(n.preventDefault&&n.preventDefault(),!1)},pn=function(t){if(H===void 0){var n=!!t&&t.reserveScrollBarGap===!0,o=window.innerWidth-document.documentElement.clientWidth;if(n&&o>0){var a=parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"),10);H=document.body.style.paddingRight,document.body.style.paddingRight=a+o+"px"}}B===void 0&&(B=document.body.style.overflow,document.body.style.overflow="hidden")},vn=function(){H!==void 0&&(document.body.style.paddingRight=H,H=void 0),B!==void 0&&(document.body.style.overflow=B,B=void 0)},gn=function(){return window.requestAnimationFrame(function(){if(N===void 0){N={position:document.body.style.position,top:document.body.style.top,left:document.body.style.left};var t=window,n=t.scrollY,o=t.scrollX,a=t.innerHeight;document.body.style.position="fixed",document.body.style.top=-n,document.body.style.left=-o,setTimeout(function(){return window.requestAnimationFrame(function(){var i=a-window.innerHeight;i&&n>=a&&(document.body.style.top=-(n+i))})},300)}})},bn=function(){if(N!==void 0){var t=-parseInt(document.body.style.top,10),n=-parseInt(document.body.style.left,10);document.body.style.position=N.position,document.body.style.top=N.top,document.body.style.left=N.left,window.scrollTo(n,t),N=void 0}},_n=function(t){return t?t.scrollHeight-t.scrollTop<=t.clientHeight:!1},wn=function(t,n){var o=t.targetTouches[0].clientY-ue;return De(t.target)?!1:n&&n.scrollTop===0&&o>0||_n(n)&&o<0?Z(t):(t.stopPropagation(),!0)},yn=function(t,n){if(!t){console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.");return}if(!M.some(function(a){return a.targetElement===t})){var o={targetElement:t,options:n||{}};M=[].concat(fn(M),[o]),X?gn():pn(n),X&&(t.ontouchstart=function(a){a.targetTouches.length===1&&(ue=a.targetTouches[0].clientY)},t.ontouchmove=function(a){a.targetTouches.length===1&&wn(a,t)},Q||(document.addEventListener("touchmove",Z,de?{passive:!1}:void 0),Q=!0))}},xn=function(){X&&(M.forEach(function(t){t.targetElement.ontouchstart=null,t.targetElement.ontouchmove=null}),Q&&(document.removeEventListener("touchmove",Z,de?{passive:!1}:void 0),Q=!1),ue=-1),X?bn():vn(),M=[]};const En="_navScreenMenuGroup_1xte3_1",Sn="_open_1xte3_7",kn="_button_1xte3_12",In="_buttonSpan_1xte3_25",Tn="_items_1xte3_32",Pn="_down_1xte3_40",O={navScreenMenuGroup:En,open:Sn,button:kn,buttonSpan:In,items:Tn,down:Pn},je=e=>u.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 32 32",...e},u.createElement("path",{fill:"currentColor",d:"M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z"})),qe=e=>u.createElement("svg",{width:32,height:32,viewBox:"0 0 32 32",...e},u.createElement("path",{fill:"currentColor",d:"M10 6v2h12.59L6 24.59L7.41 26L24 9.41V22h2V6H10z"})),On="_link_r3fql_1",Nn={link:On},se="island-theme-appearance",Rn=["https://island-tutorial.sanyuan0704.top","https://island.sanyuan0704.top","https://islandjs.dev"],Cn=()=>typeof window<"u",An=/^(https?:)?\/\//;function te(e){const{href:t="/",children:n,className:o=""}=e,a=An.test(t),i=Rn.some(l=>t.startsWith(l));return r("a",{href:t,target:a&&!i?"_blank":"",rel:a?"noopener noreferrer":void 0,className:`${Nn.link} ${o}`,children:n})}function Be(e){const{activeIndex:t}=e,[n,o]=x(!1);return h("div",{relative:"",className:`${n?O.open:""} ${O.navScreenMenuGroup}`,children:[h("button",{className:O.button,onClick:()=>{o(!n)},children:[r("span",{className:O.buttonSpan,children:e.text}),r(je,{className:`${n?O.open:""} ${O.down} `})]}),r("div",{children:r("div",{className:O.items,children:e.items.map((a,i)=>i===t?r("div",{className:"pa-1",children:r("span",{mr:"1",text:"brand",children:a.text})},a.link):r("div",{className:"pa-1",font:"medium",children:r(te,{href:a.link,children:r("div",{children:h("div",{flex:"",children:[r("span",{mr:"1",children:a.text}),r(qe,{w:"11px",h:"11px",text:"text-3",m:"t-1 r-1"})]})})})},a.link))})})]})}function w(e){const t=Ve(e);let n,o;const i=Fe(function(s,l){const v=q(n!=null?n:t).current;return r(v,{ref:l,...s})});return i.preload=()=>(o||(o=e().then(c=>(n=c.default,c))),o),i}const _e=w(()=>b(()=>import("./button.a0cd58fc.js"),[])),we=w(()=>b(()=>import("./fresh.7ca7c9da.js"),["assets/fresh.7ca7c9da.js","assets/style.e0d0cfbc.js"])),ye=w(()=>b(()=>import("./introduction.6c6b34fc.js"),[])),xe=w(()=>b(()=>import("./index.df4f2bb3.js"),[])),Ee=w(()=>b(()=>import("./button.4cdc4e30.js"),["assets/button.4cdc4e30.js","assets/style.e0d0cfbc.js","assets/index.bf491f00.js","assets/_commonjsHelpers.4e997714.js"])),Se=w(()=>b(()=>import("./input.8e86f5d0.js"),["assets/input.8e86f5d0.js","assets/style.e0d0cfbc.js","assets/index.bf491f00.js","assets/_commonjsHelpers.4e997714.js"])),ke=w(()=>b(()=>import("./knob.18bc23a1.js"),["assets/knob.18bc23a1.js","assets/style.e0d0cfbc.js","assets/index.bf491f00.js","assets/_commonjsHelpers.4e997714.js"])),Ie=w(()=>b(()=>import("./light.63dc9740.js"),["assets/light.63dc9740.js","assets/style.e0d0cfbc.js","assets/index.bf491f00.js","assets/_commonjsHelpers.4e997714.js"])),Te=w(()=>b(()=>import("./slider.465acb25.js"),["assets/slider.465acb25.js","assets/index.bf491f00.js","assets/_commonjsHelpers.4e997714.js","assets/style.e0d0cfbc.js"])),Pe=w(()=>b(()=>import("./switch.f02e17af.js"),["assets/switch.f02e17af.js","assets/index.bf491f00.js","assets/_commonjsHelpers.4e997714.js","assets/style.e0d0cfbc.js"])),Oe=w(()=>b(()=>import("./installation.c6a992e6.js"),[])),Ne=w(()=>b(()=>import("./introduction.32d1931e.js"),[])),Re=w(()=>b(()=>import("./index.21a99a6a.js"),[])),Ln=[{path:"/en/component/button",element:_.createElement(_e),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/en/component/button.md",preload:_e.preload},{path:"/en/component/fresh",element:_.createElement(we),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/en/component/fresh.mdx",preload:we.preload},{path:"/en/guide/introduction",element:_.createElement(ye),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/en/guide/introduction.md",preload:ye.preload},{path:"/en/",element:_.createElement(xe),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/en/index.mdx",preload:xe.preload},{path:"/zh/component/button",element:_.createElement(Ee),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/zh/component/button.mdx",preload:Ee.preload},{path:"/zh/component/input",element:_.createElement(Se),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/zh/component/input.mdx",preload:Se.preload},{path:"/zh/component/knob",element:_.createElement(ke),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/zh/component/knob.mdx",preload:ke.preload},{path:"/zh/component/light",element:_.createElement(Ie),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/zh/component/light.mdx",preload:Ie.preload},{path:"/zh/component/slider",element:_.createElement(Te),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/zh/component/slider.mdx",preload:Te.preload},{path:"/zh/component/switch",element:_.createElement(Pe),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/zh/component/switch.mdx",preload:Pe.preload},{path:"/zh/guide/installation",element:_.createElement(Oe),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/zh/guide/installation.mdx",preload:Oe.preload},{path:"/zh/guide/introduction",element:_.createElement(Ne),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/zh/guide/introduction.md",preload:Ne.preload},{path:"/zh/",element:_.createElement(Re),filePath:"/Users/codeacme17/Project/framework-plugins/echo-ui/docs/zh/index.mdx",preload:Re.preload}];Ge({data:Cn()?window==null?void 0:window.ISLAND_PAGE_DATA:null,setData:e=>{}});const dr=(e=()=>!0)=>Promise.all(Ln.filter(e).map(async t=>({...await t.preload(),routePath:t.path})));function Mn(e){return e.charAt(0)==="/"?e:"/"+e}function He(e){if(!e)return"/";if(e.startsWith("http"))return e;let t="";return t+=".html",e.endsWith("/")&&(t="index"+t),Mn(`${e}${t}`)}function zn(e){const{pathname:t}=e,n=new RegExp(e.activeMatch||e.link).test(t);return r("div",{text:"sm",font:"medium",m:"x-3",className:`${n?"text-brand":""}`,children:r(te,{href:He(e.link),children:e.text})},e.text)}const $n="_check_1tqe3_17",Dn="_icon_1tqe3_34",jn="_dark_1tqe3_29",ae={switch:"_switch_1tqe3_1",check:$n,icon:Dn,dark:jn};function qn(e){var t;return r("button",{className:`${ae.switch} ${e.className}`,id:(t=e.id)!=null?t:"",type:"button",role:"switch",...e.onClick?{onClick:e.onClick}:{},children:r("span",{className:ae.check,children:r("span",{className:ae.icon,children:e.children})})})}const Bn="_sun_8e60k_1",Hn="_moon_8e60k_5",Ce={sun:Bn,moon:Hn},Un=e=>u.createElement("svg",{xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24",...e},u.createElement("path",{d:"M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18zM12,8c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4c2.2,0,4-1.8,4-4C16,9.8,14.2,8,12,8z"}),u.createElement("path",{d:"M12,4c-0.6,0-1-0.4-1-1V1c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,3.6,12.6,4,12,4z"}),u.createElement("path",{d:"M12,24c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,23.6,12.6,24,12,24z"}),u.createElement("path",{d:"M5.6,6.6c-0.3,0-0.5-0.1-0.7-0.3L3.5,4.9c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C6.2,6.5,5.9,6.6,5.6,6.6z"}),u.createElement("path",{d:"M19.8,20.8c-0.3,0-0.5-0.1-0.7-0.3l-1.4-1.4c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C20.3,20.7,20,20.8,19.8,20.8z"}),u.createElement("path",{d:"M3,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S3.6,13,3,13z"}),u.createElement("path",{d:"M23,13h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S23.6,13,23,13z"}),u.createElement("path",{d:"M4.2,20.8c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C4.7,20.7,4.5,20.8,4.2,20.8z"}),u.createElement("path",{d:"M18.4,6.6c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C18.9,6.5,18.6,6.6,18.4,6.6z"})),Wn=e=>u.createElement("svg",{xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24",...e},u.createElement("path",{d:"M12.1,22c-0.3,0-0.6,0-0.9,0c-5.5-0.5-9.5-5.4-9-10.9c0.4-4.8,4.2-8.6,9-9c0.4,0,0.8,0.2,1,0.5c0.2,0.3,0.2,0.8-0.1,1.1c-2,2.7-1.4,6.4,1.3,8.4c2.1,1.6,5,1.6,7.1,0c0.3-0.2,0.7-0.3,1.1-0.1c0.3,0.2,0.5,0.6,0.5,1c-0.2,2.7-1.5,5.1-3.6,6.8C16.6,21.2,14.4,22,12.1,22zM9.3,4.4c-2.9,1-5,3.6-5.2,6.8c-0.4,4.4,2.8,8.3,7.2,8.7c2.1,0.2,4.2-0.4,5.8-1.8c1.1-0.9,1.9-2.1,2.4-3.4c-2.5,0.9-5.3,0.5-7.5-1.1C9.2,11.4,8.1,7.7,9.3,4.4z"}));let R=!0,F,C,z;typeof window<"u"&&typeof localStorage<"u"&&(C=localStorage.getItem(se)||"auto",z=window.matchMedia("(prefers-color-scheme: dark)"),R=C==="auto"?z.matches:C==="dark",z.onchange=e=>{C==="auto"&&ce(R=e.matches)});const ce=e=>{F[e?"add":"remove"]("dark")},Vn=()=>{if(typeof window<"u"&&F===void 0){F=document.documentElement.classList;const e=()=>{const t=localStorage.getItem(se)||"auto";F&&(ce(t==="auto"?z.matches:t==="dark"),R=!R)};window.addEventListener("storage",e)}return()=>{ce(R=!R),typeof window<"u"&&typeof localStorage<"u"&&(R?C=z.matches?"auto":"dark":C=z.matches?"light":"auto",localStorage.setItem(se,C))}};function Ue(e){const t=Vn();return h(qn,{onClick:t,children:[r(Un,{className:Ce.sun}),r(Wn,{className:Ce.moon})]})}const We=e=>u.createElement("svg",{width:32,height:32,viewBox:"0 0 32 32",...e},u.createElement("path",{fill:"currentColor",d:"M27.85 29H30l-6-15h-2.35l-6 15h2.15l1.6-4h6.85zm-7.65-6l2.62-6.56L25.45 23zM18 7V5h-7V2H9v3H2v2h10.74a14.71 14.71 0 0 1-3.19 6.18A13.5 13.5 0 0 1 7.26 9h-2.1a16.47 16.47 0 0 0 3 5.58A16.84 16.84 0 0 1 3 18l.75 1.86A18.47 18.47 0 0 0 9.53 16a16.92 16.92 0 0 0 5.76 3.84L16 18a14.48 14.48 0 0 1-5.12-3.37A17.64 17.64 0 0 0 14.8 7z"})),Fn=e=>u.createElement("svg",{role:"img",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",...e},u.createElement("title",null,"GitHub"),u.createElement("path",{d:"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"})),Gn={github:Fn},Kn=({translationMenuData:e})=>r("div",{className:P.navTranslations,flex:"~",text:"sm",font:"bold",justify:"center",children:r("div",{m:"x-1.5",children:r(Be,{...e})})}),Yn=({socialLinks:e})=>r("div",{className:"social-links",flex:"","items-center":"",before:"menu-item-before",children:r("div",{flex:"","items-center":"",w:"9",h:"9",transition:"color duration-300",color:"hover:brand",children:e.map(t=>{const n=Gn[t.icon];return r("a",{href:t.link,target:"_blank",rel:"noopener noreferrer",w:"5",h:"5",children:r(n,{fill:"currentColor"})},t.link)})})});function Xn(e){var A;const{isScreenOpen:t,localeData:n,siteData:o,pathname:a}=e,i=q(null),c=Object.values(o.themeConfig.locales||{}),s=c.length>1,l=n.nav||[],m=((A=o==null?void 0:o.themeConfig)==null?void 0:A.socialLinks)||[],v=o.appearance!==!1,f=m.length>0,E=s?{text:r(We,{w:"18px",h:"18px"}),items:c.map(S=>({text:S.label,link:`/${S.lang}`})),activeIndex:c.findIndex(S=>S.lang===n.lang)}:null,y=()=>r("div",{className:`items-center appearance pa-2 ${P.navAppearance}`,flex:"~",justify:"center",children:r(Ue,{})}),T=({menuItems:S})=>r("div",{className:P.navMenu,children:S.map((g,k)=>r("div",{w:"100%",className:P.navMenuItem,children:"link"in g?r(zn,{pathname:a,...g},k):r("div",{m:"x-3",last:"mr-0",children:r(Be,{...g})},k)},k))});return G(()=>(i.current&&t&&yn(i.current,{reserveScrollBarGap:!0}),()=>{xn()}),[t]),r("div",{className:`${P.navScreen} ${t?P.active:""}`,ref:i,id:"navScreen",children:h("div",{className:P.container,children:[r(T,{menuItems:l}),h("div",{className:P.socialAndAppearance,flex:"~",justify:"center","items-center":"center",children:[v&&r(y,{}),f&&r(Yn,{socialLinks:m})]}),s&&r(Kn,{translationMenuData:E})]})})}function Qn(){const[e,t]=x(!1);function n(){t(!0),window.addEventListener("resize",i)}function o(){t(!1),window.removeEventListener("resize",i)}function a(){e?o():n()}function i(){window.outerWidth>=768&&o()}return{isScreenOpen:e,openScreen:n,closeScreen:o,toggleScreen:a}}function Zn(e){const{localeData:t,siteData:n,pathname:o}=e,{isScreenOpen:a,toggleScreen:i}=Qn();return h(Le,{children:[r("button",{onClick:i,className:`${a?L.active:""} ${L.navHamburger}`,children:h("span",{className:L.container,children:[r("span",{className:L.top}),r("span",{className:L.middle}),r("span",{className:L.bottom})]})}),r(Xn,{isScreenOpen:a,localeData:t,siteData:n,pathname:o})]})}function Jn(e){const{activeIndex:t,isTranslation:n}=e,[o,a]=x(!1);return h("div",{relative:"",onMouseLeave:()=>a(!1),children:[h("button",{onMouseEnter:()=>a(!0),flex:"center","nav-h":"mobile sm:desktop",font:"medium",text:"sm text-1 hover:text-2",transition:"color duration-200",className:"nav-menu-group-button",children:[r("span",{mr:"1",text:"sm",font:"medium",children:n?r(We,{w:"18px",h:"18px"}):e.text}),r(je,{})]}),r("div",{absolute:"",pos:"top-13 right-0",m:"x-0.8",transition:"opacity duration-300",className:"nav-menu-group-content",style:{opacity:o?1:0,visibility:o?"visible":"hidden"},children:r("div",{p:"3",w:"100%",h:"100%",className:"min-w-128px max-h-100vh","border-1":"",rounded:"xl",bg:"bg-default",style:{boxShadow:"var(--island-shadow-3)",marginRight:"-1.5rem",zIndex:100},children:e.items.map((i,c)=>c===t?r("div",{rounded:"md",p:"y-1.6 l-3",children:r("span",{mr:"1",text:"brand",children:i.text})},i.link):r("div",{font:"medium",children:r(te,{href:i.link,children:r("div",{rounded:"md",hover:"bg-bg-mute",p:"y-1.6 l-3",children:h("div",{flex:"",children:[r("span",{mr:"1",children:i.text}),r(qe,{w:"11px",h:"11px",text:"text-3",m:"t-1 r-1"})]})})})},i.link))})})]})}const er="_localNav_ncerp_1",tr="_menu_ncerp_16",nr="_backDrop_ncerp_28",ie={localNav:er,menu:tr,backDrop:nr},rr="_sidebar_iav29_1",or="_open_iav29_23",Ae={sidebar:rr,open:or};function ar(e,t){return t?t===""||t==="/"?e===t:e.startsWith(t):!1}function ir(e){const{isSidebarOpen:t,langRoutePrefix:n,pathname:o,sidebarData:a}=e,i=(s,l=0)=>{var E;const m=`${l*20}px`;let v=[];"items"in s&&(v=s.items.map(y=>i(y,l+1)));const f=ar(o.replace(n,""),(E=s.link)==null?void 0:E.replace(n,""));return h("div",{style:{marginLeft:m},children:[r("div",{p:"1",block:"~",text:"sm","font-medium":"~",className:`${f?"text-brand":"text-text-2"}`,children:r(te,{href:He(s.link),children:s.text})}),v]})},c=s=>{var l;return h("section",{block:"~","not-first":"divider-top mt-4",children:[r("div",{flex:"~",justify:"between","items-start":"~",children:r("h2",{m:"t-3 b-2",text:"1rem text-1",font:"bold",children:s.text})}),r("div",{mb:"1.4 sm:1",children:(l=s==null?void 0:s.items)==null?void 0:l.map(m=>r("div",{children:i(m)},m.link))})]},s.text)};return r("aside",{className:`${Ae.sidebar} ${t?Ae.open:""}`,children:r("nav",{children:[a].filter(Boolean).flat().map(s=>c(s))})})}function sr(e){const{langRoutePrefix:t,pathname:n,sidebarData:o}=e,[a,i]=x(!1);function c(){i(!0)}function s(){i(!1)}return h(Le,{children:[r("div",{className:ie.localNav,children:h("button",{flex:"center",onClick:c,className:ie.menu,children:[r("div",{text:"md",mr:"2",className:"i-carbon:menu"}),r("span",{text:"md ",children:"Menu"})]})}),r(ir,{langRoutePrefix:t,pathname:n,sidebarData:o,isSidebarOpen:a}),a?r("div",{onClick:s,className:ie.backDrop}):null]})}window.ISLANDS={BackTop:Wt,Search:Jt,NavHamburger:Zn,NavMenuGroup:Jn,SwitchAppearance:Ue,SideMenu:sr};window.ISLAND_PROPS=JSON.parse(document.getElementById("island-props").textContent);export{K as S,Y as a,kt as b,It as c,ht as f,dr as g,Pt as i,He as n,ze as r};
