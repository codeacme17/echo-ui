var Nt=(t,e,s)=>{if(!e.has(t))throw TypeError("Cannot "+s)};var st=(t,e,s)=>(Nt(t,e,"read from private field"),s?s.call(t):e.get(t)),rt=(t,e,s)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,s)},gt=(t,e,s,f)=>(Nt(t,e,"write to private field"),f?f.call(t,s):e.set(t,s),s);var Et=(t,e,s)=>(Nt(t,e,"access private method"),s);import{al as Ct,am as Jt,an as Xt,ao as Tt,ap as nt,aq as vt,ar as tr,ak as er,af as rr,w as nr,n as ie}from"../client-entry.js";import"react";import"react/jsx-runtime";function ir(t,e){for(var s=-1,f=t==null?0:t.length,u=Array(f);++s<f;)u[s]=e(t[s],s,t);return u}var sr=Array.isArray;const q=sr;var or=1/0,se=Ct?Ct.prototype:void 0,oe=se?se.toString:void 0;function Ee(t){if(typeof t=="string")return t;if(q(t))return ir(t,Ee)+"";if(Jt(t))return oe?oe.call(t):"";var e=t+"";return e=="0"&&1/t==-or?"-0":e}function ar(t){return t}var fr="[object AsyncFunction]",ur="[object Function]",hr="[object GeneratorFunction]",lr="[object Proxy]";function Se(t){if(!Xt(t))return!1;var e=Tt(t);return e==ur||e==hr||e==fr||e==lr}var cr=nt["__core-js_shared__"];const Bt=cr;var ae=function(){var t=/[^.]+$/.exec(Bt&&Bt.keys&&Bt.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function dr(t){return!!ae&&ae in t}var pr=Function.prototype,gr=pr.toString;function ft(t){if(t!=null){try{return gr.call(t)}catch{}try{return t+""}catch{}}return""}var yr=/[\\^$.*+?()[\]{}|]/g,vr=/^\[object .+?Constructor\]$/,_r=Function.prototype,wr=Object.prototype,xr=_r.toString,Ar=wr.hasOwnProperty,Or=RegExp("^"+xr.call(Ar).replace(yr,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function Tr(t){if(!Xt(t)||dr(t))return!1;var e=Se(t)?Or:vr;return e.test(ft(t))}function Pr(t,e){return t==null?void 0:t[e]}function dt(t,e){var s=Pr(t,e);return Tr(s)?s:void 0}var $r=dt(nt,"WeakMap");const bt=$r;function Ir(){}function mr(t,e,s,f){for(var u=t.length,l=s+(f?1:-1);f?l--:++l<u;)if(e(t[l],l,t))return l;return-1}function Er(t){return t!==t}function Sr(t,e,s){for(var f=s-1,u=t.length;++f<u;)if(t[f]===e)return f;return-1}function Cr(t,e,s){return e===e?Sr(t,e,s):mr(t,Er,s)}function jr(t,e){var s=t==null?0:t.length;return!!s&&Cr(t,e,0)>-1}var Mr=9007199254740991,Rr=/^(?:0|[1-9]\d*)$/;function Ce(t,e){var s=typeof t;return e=e==null?Mr:e,!!e&&(s=="number"||s!="symbol"&&Rr.test(t))&&t>-1&&t%1==0&&t<e}function je(t,e){return t===e||t!==t&&e!==e}var Fr=9007199254740991;function Zt(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=Fr}function Lr(t){return t!=null&&Zt(t.length)&&!Se(t)}var Dr=Object.prototype;function Gr(t){var e=t&&t.constructor,s=typeof e=="function"&&e.prototype||Dr;return t===s}function Hr(t,e){for(var s=-1,f=Array(t);++s<t;)f[s]=e(s);return f}var Nr="[object Arguments]";function fe(t){return vt(t)&&Tt(t)==Nr}var Me=Object.prototype,Br=Me.hasOwnProperty,Ur=Me.propertyIsEnumerable,zr=fe(function(){return arguments}())?fe:function(t){return vt(t)&&Br.call(t,"callee")&&!Ur.call(t,"callee")};const Re=zr;function br(){return!1}var Fe=typeof exports=="object"&&exports&&!exports.nodeType&&exports,ue=Fe&&typeof module=="object"&&module&&!module.nodeType&&module,Wr=ue&&ue.exports===Fe,he=Wr?nt.Buffer:void 0,Kr=he?he.isBuffer:void 0,Yr=Kr||br;const Wt=Yr;var Jr="[object Arguments]",Xr="[object Array]",Zr="[object Boolean]",Qr="[object Date]",Vr="[object Error]",qr="[object Function]",kr="[object Map]",tn="[object Number]",en="[object Object]",rn="[object RegExp]",nn="[object Set]",sn="[object String]",on="[object WeakMap]",an="[object ArrayBuffer]",fn="[object DataView]",un="[object Float32Array]",hn="[object Float64Array]",ln="[object Int8Array]",cn="[object Int16Array]",dn="[object Int32Array]",pn="[object Uint8Array]",gn="[object Uint8ClampedArray]",yn="[object Uint16Array]",vn="[object Uint32Array]",j={};j[un]=j[hn]=j[ln]=j[cn]=j[dn]=j[pn]=j[gn]=j[yn]=j[vn]=!0;j[Jr]=j[Xr]=j[an]=j[Zr]=j[fn]=j[Qr]=j[Vr]=j[qr]=j[kr]=j[tn]=j[en]=j[rn]=j[nn]=j[sn]=j[on]=!1;function _n(t){return vt(t)&&Zt(t.length)&&!!j[Tt(t)]}function wn(t){return function(e){return t(e)}}var Le=typeof exports=="object"&&exports&&!exports.nodeType&&exports,yt=Le&&typeof module=="object"&&module&&!module.nodeType&&module,xn=yt&&yt.exports===Le,Ut=xn&&tr.process,An=function(){try{var t=yt&&yt.require&&yt.require("util").types;return t||Ut&&Ut.binding&&Ut.binding("util")}catch{}}();const le=An;var ce=le&&le.isTypedArray,On=ce?wn(ce):_n;const De=On;var Tn=Object.prototype,Pn=Tn.hasOwnProperty;function $n(t,e){var s=q(t),f=!s&&Re(t),u=!s&&!f&&Wt(t),l=!s&&!f&&!u&&De(t),_=s||f||u||l,x=_?Hr(t.length,String):[],T=x.length;for(var I in t)(e||Pn.call(t,I))&&!(_&&(I=="length"||u&&(I=="offset"||I=="parent")||l&&(I=="buffer"||I=="byteLength"||I=="byteOffset")||Ce(I,T)))&&x.push(I);return x}function In(t,e){return function(s){return t(e(s))}}var mn=In(Object.keys,Object);const En=mn;var Sn=Object.prototype,Cn=Sn.hasOwnProperty;function jn(t){if(!Gr(t))return En(t);var e=[];for(var s in Object(t))Cn.call(t,s)&&s!="constructor"&&e.push(s);return e}function Ge(t){return Lr(t)?$n(t):jn(t)}var Mn=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Rn=/^\w*$/;function Qt(t,e){if(q(t))return!1;var s=typeof t;return s=="number"||s=="symbol"||s=="boolean"||t==null||Jt(t)?!0:Rn.test(t)||!Mn.test(t)||e!=null&&t in Object(e)}var Fn=dt(Object,"create");const _t=Fn;function Ln(){this.__data__=_t?_t(null):{},this.size=0}function Dn(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var Gn="__lodash_hash_undefined__",Hn=Object.prototype,Nn=Hn.hasOwnProperty;function Bn(t){var e=this.__data__;if(_t){var s=e[t];return s===Gn?void 0:s}return Nn.call(e,t)?e[t]:void 0}var Un=Object.prototype,zn=Un.hasOwnProperty;function bn(t){var e=this.__data__;return _t?e[t]!==void 0:zn.call(e,t)}var Wn="__lodash_hash_undefined__";function Kn(t,e){var s=this.__data__;return this.size+=this.has(t)?0:1,s[t]=_t&&e===void 0?Wn:e,this}function at(t){var e=-1,s=t==null?0:t.length;for(this.clear();++e<s;){var f=t[e];this.set(f[0],f[1])}}at.prototype.clear=Ln;at.prototype.delete=Dn;at.prototype.get=Bn;at.prototype.has=bn;at.prototype.set=Kn;function Yn(){this.__data__=[],this.size=0}function Ft(t,e){for(var s=t.length;s--;)if(je(t[s][0],e))return s;return-1}var Jn=Array.prototype,Xn=Jn.splice;function Zn(t){var e=this.__data__,s=Ft(e,t);if(s<0)return!1;var f=e.length-1;return s==f?e.pop():Xn.call(e,s,1),--this.size,!0}function Qn(t){var e=this.__data__,s=Ft(e,t);return s<0?void 0:e[s][1]}function Vn(t){return Ft(this.__data__,t)>-1}function qn(t,e){var s=this.__data__,f=Ft(s,t);return f<0?(++this.size,s.push([t,e])):s[f][1]=e,this}function k(t){var e=-1,s=t==null?0:t.length;for(this.clear();++e<s;){var f=t[e];this.set(f[0],f[1])}}k.prototype.clear=Yn;k.prototype.delete=Zn;k.prototype.get=Qn;k.prototype.has=Vn;k.prototype.set=qn;var kn=dt(nt,"Map");const wt=kn;function ti(){this.size=0,this.__data__={hash:new at,map:new(wt||k),string:new at}}function ei(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}function Lt(t,e){var s=t.__data__;return ei(e)?s[typeof e=="string"?"string":"hash"]:s.map}function ri(t){var e=Lt(this,t).delete(t);return this.size-=e?1:0,e}function ni(t){return Lt(this,t).get(t)}function ii(t){return Lt(this,t).has(t)}function si(t,e){var s=Lt(this,t),f=s.size;return s.set(t,e),this.size+=s.size==f?0:1,this}function tt(t){var e=-1,s=t==null?0:t.length;for(this.clear();++e<s;){var f=t[e];this.set(f[0],f[1])}}tt.prototype.clear=ti;tt.prototype.delete=ri;tt.prototype.get=ni;tt.prototype.has=ii;tt.prototype.set=si;var oi="Expected a function";function Vt(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(oi);var s=function(){var f=arguments,u=e?e.apply(this,f):f[0],l=s.cache;if(l.has(u))return l.get(u);var _=t.apply(this,f);return s.cache=l.set(u,_)||l,_};return s.cache=new(Vt.Cache||tt),s}Vt.Cache=tt;var ai=500;function fi(t){var e=Vt(t,function(f){return s.size===ai&&s.clear(),f}),s=e.cache;return e}var ui=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,hi=/\\(\\)?/g,li=fi(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(ui,function(s,f,u,l){e.push(u?l.replace(hi,"$1"):f||s)}),e});const ci=li;function di(t){return t==null?"":Ee(t)}function He(t,e){return q(t)?t:Qt(t,e)?[t]:ci(di(t))}var pi=1/0;function Dt(t){if(typeof t=="string"||Jt(t))return t;var e=t+"";return e=="0"&&1/t==-pi?"-0":e}function Ne(t,e){e=He(e,t);for(var s=0,f=e.length;t!=null&&s<f;)t=t[Dt(e[s++])];return s&&s==f?t:void 0}function gi(t,e,s){var f=t==null?void 0:Ne(t,e);return f===void 0?s:f}function yi(t,e){for(var s=-1,f=e.length,u=t.length;++s<f;)t[u+s]=e[s];return t}function vi(){this.__data__=new k,this.size=0}function _i(t){var e=this.__data__,s=e.delete(t);return this.size=e.size,s}function wi(t){return this.__data__.get(t)}function xi(t){return this.__data__.has(t)}var Ai=200;function Oi(t,e){var s=this.__data__;if(s instanceof k){var f=s.__data__;if(!wt||f.length<Ai-1)return f.push([t,e]),this.size=++s.size,this;s=this.__data__=new tt(f)}return s.set(t,e),this.size=s.size,this}function V(t){var e=this.__data__=new k(t);this.size=e.size}V.prototype.clear=vi;V.prototype.delete=_i;V.prototype.get=wi;V.prototype.has=xi;V.prototype.set=Oi;function Ti(t,e){for(var s=-1,f=t==null?0:t.length,u=0,l=[];++s<f;){var _=t[s];e(_,s,t)&&(l[u++]=_)}return l}function Pi(){return[]}var $i=Object.prototype,Ii=$i.propertyIsEnumerable,de=Object.getOwnPropertySymbols,mi=de?function(t){return t==null?[]:(t=Object(t),Ti(de(t),function(e){return Ii.call(t,e)}))}:Pi;const Ei=mi;function Si(t,e,s){var f=e(t);return q(t)?f:yi(f,s(t))}function pe(t){return Si(t,Ge,Ei)}var Ci=dt(nt,"DataView");const Kt=Ci;var ji=dt(nt,"Promise");const Yt=ji;var Mi=dt(nt,"Set");const ht=Mi;var ge="[object Map]",Ri="[object Object]",ye="[object Promise]",ve="[object Set]",_e="[object WeakMap]",we="[object DataView]",Fi=ft(Kt),Li=ft(wt),Di=ft(Yt),Gi=ft(ht),Hi=ft(bt),ot=Tt;(Kt&&ot(new Kt(new ArrayBuffer(1)))!=we||wt&&ot(new wt)!=ge||Yt&&ot(Yt.resolve())!=ye||ht&&ot(new ht)!=ve||bt&&ot(new bt)!=_e)&&(ot=function(t){var e=Tt(t),s=e==Ri?t.constructor:void 0,f=s?ft(s):"";if(f)switch(f){case Fi:return we;case Li:return ge;case Di:return ye;case Gi:return ve;case Hi:return _e}return e});const xe=ot;var Ni=nt.Uint8Array;const Ae=Ni;var Bi="__lodash_hash_undefined__";function Ui(t){return this.__data__.set(t,Bi),this}function zi(t){return this.__data__.has(t)}function xt(t){var e=-1,s=t==null?0:t.length;for(this.__data__=new tt;++e<s;)this.add(t[e])}xt.prototype.add=xt.prototype.push=Ui;xt.prototype.has=zi;function bi(t,e){for(var s=-1,f=t==null?0:t.length;++s<f;)if(e(t[s],s,t))return!0;return!1}function Be(t,e){return t.has(e)}var Wi=1,Ki=2;function Ue(t,e,s,f,u,l){var _=s&Wi,x=t.length,T=e.length;if(x!=T&&!(_&&T>x))return!1;var I=l.get(t),v=l.get(e);if(I&&v)return I==e&&v==t;var S=-1,E=!0,N=s&Ki?new xt:void 0;for(l.set(t,e),l.set(e,t);++S<x;){var L=t[S],B=e[S];if(f)var K=_?f(B,L,S,e,t,l):f(L,B,S,t,e,l);if(K!==void 0){if(K)continue;E=!1;break}if(N){if(!bi(e,function(Z,b){if(!Be(N,b)&&(L===Z||u(L,Z,s,f,l)))return N.push(b)})){E=!1;break}}else if(!(L===B||u(L,B,s,f,l))){E=!1;break}}return l.delete(t),l.delete(e),E}function Yi(t){var e=-1,s=Array(t.size);return t.forEach(function(f,u){s[++e]=[u,f]}),s}function qt(t){var e=-1,s=Array(t.size);return t.forEach(function(f){s[++e]=f}),s}var Ji=1,Xi=2,Zi="[object Boolean]",Qi="[object Date]",Vi="[object Error]",qi="[object Map]",ki="[object Number]",ts="[object RegExp]",es="[object Set]",rs="[object String]",ns="[object Symbol]",is="[object ArrayBuffer]",ss="[object DataView]",Oe=Ct?Ct.prototype:void 0,zt=Oe?Oe.valueOf:void 0;function os(t,e,s,f,u,l,_){switch(s){case ss:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case is:return!(t.byteLength!=e.byteLength||!l(new Ae(t),new Ae(e)));case Zi:case Qi:case ki:return je(+t,+e);case Vi:return t.name==e.name&&t.message==e.message;case ts:case rs:return t==e+"";case qi:var x=Yi;case es:var T=f&Ji;if(x||(x=qt),t.size!=e.size&&!T)return!1;var I=_.get(t);if(I)return I==e;f|=Xi,_.set(t,e);var v=Ue(x(t),x(e),f,u,l,_);return _.delete(t),v;case ns:if(zt)return zt.call(t)==zt.call(e)}return!1}var as=1,fs=Object.prototype,us=fs.hasOwnProperty;function hs(t,e,s,f,u,l){var _=s&as,x=pe(t),T=x.length,I=pe(e),v=I.length;if(T!=v&&!_)return!1;for(var S=T;S--;){var E=x[S];if(!(_?E in e:us.call(e,E)))return!1}var N=l.get(t),L=l.get(e);if(N&&L)return N==e&&L==t;var B=!0;l.set(t,e),l.set(e,t);for(var K=_;++S<T;){E=x[S];var Z=t[E],b=e[E];if(f)var pt=_?f(b,Z,E,e,t,l):f(Z,b,E,t,e,l);if(!(pt===void 0?Z===b||u(Z,b,s,f,l):pt)){B=!1;break}K||(K=E=="constructor")}if(B&&!K){var U=t.constructor,G=e.constructor;U!=G&&"constructor"in t&&"constructor"in e&&!(typeof U=="function"&&U instanceof U&&typeof G=="function"&&G instanceof G)&&(B=!1)}return l.delete(t),l.delete(e),B}var ls=1,Te="[object Arguments]",Pe="[object Array]",St="[object Object]",cs=Object.prototype,$e=cs.hasOwnProperty;function ds(t,e,s,f,u,l){var _=q(t),x=q(e),T=_?Pe:xe(t),I=x?Pe:xe(e);T=T==Te?St:T,I=I==Te?St:I;var v=T==St,S=I==St,E=T==I;if(E&&Wt(t)){if(!Wt(e))return!1;_=!0,v=!1}if(E&&!v)return l||(l=new V),_||De(t)?Ue(t,e,s,f,u,l):os(t,e,T,s,f,u,l);if(!(s&ls)){var N=v&&$e.call(t,"__wrapped__"),L=S&&$e.call(e,"__wrapped__");if(N||L){var B=N?t.value():t,K=L?e.value():e;return l||(l=new V),u(B,K,s,f,l)}}return E?(l||(l=new V),hs(t,e,s,f,u,l)):!1}function kt(t,e,s,f,u){return t===e?!0:t==null||e==null||!vt(t)&&!vt(e)?t!==t&&e!==e:ds(t,e,s,f,kt,u)}var ps=1,gs=2;function ys(t,e,s,f){var u=s.length,l=u,_=!f;if(t==null)return!l;for(t=Object(t);u--;){var x=s[u];if(_&&x[2]?x[1]!==t[x[0]]:!(x[0]in t))return!1}for(;++u<l;){x=s[u];var T=x[0],I=t[T],v=x[1];if(_&&x[2]){if(I===void 0&&!(T in t))return!1}else{var S=new V;if(f)var E=f(I,v,T,t,e,S);if(!(E===void 0?kt(v,I,ps|gs,f,S):E))return!1}}return!0}function ze(t){return t===t&&!Xt(t)}function vs(t){for(var e=Ge(t),s=e.length;s--;){var f=e[s],u=t[f];e[s]=[f,u,ze(u)]}return e}function be(t,e){return function(s){return s==null?!1:s[t]===e&&(e!==void 0||t in Object(s))}}function _s(t){var e=vs(t);return e.length==1&&e[0][2]?be(e[0][0],e[0][1]):function(s){return s===t||ys(s,t,e)}}function ws(t,e){return t!=null&&e in Object(t)}function xs(t,e,s){e=He(e,t);for(var f=-1,u=e.length,l=!1;++f<u;){var _=Dt(e[f]);if(!(l=t!=null&&s(t,_)))break;t=t[_]}return l||++f!=u?l:(u=t==null?0:t.length,!!u&&Zt(u)&&Ce(_,u)&&(q(t)||Re(t)))}function As(t,e){return t!=null&&xs(t,e,ws)}var Os=1,Ts=2;function Ps(t,e){return Qt(t)&&ze(e)?be(Dt(t),e):function(s){var f=gi(s,t);return f===void 0&&f===e?As(s,t):kt(e,f,Os|Ts)}}function $s(t){return function(e){return e==null?void 0:e[t]}}function Is(t){return function(e){return Ne(e,t)}}function ms(t){return Qt(t)?$s(Dt(t)):Is(t)}function Es(t){return typeof t=="function"?t:t==null?ar:typeof t=="object"?q(t)?Ps(t[0],t[1]):_s(t):ms(t)}function Ss(t,e,s){for(var f=-1,u=t==null?0:t.length;++f<u;)if(s(e,t[f]))return!0;return!1}var Cs=1/0,js=ht&&1/qt(new ht([,-0]))[1]==Cs?function(t){return new ht(t)}:Ir;const Ms=js;var Rs=200;function Fs(t,e,s){var f=-1,u=jr,l=t.length,_=!0,x=[],T=x;if(s)_=!1,u=Ss;else if(l>=Rs){var I=e?null:Ms(t);if(I)return qt(I);_=!1,u=Be,T=new xt}else T=e?[]:x;t:for(;++f<l;){var v=t[f],S=e?e(v):v;if(v=s||v!==0?v:0,_&&S===S){for(var E=T.length;E--;)if(T[E]===S)continue t;e&&T.push(S),x.push(v)}else u(T,S,s)||(T!==x&&T.push(S),x.push(v))}return x}function Ls(t,e){return t&&t.length?Fs(t,Es(e)):[]}var We={exports:{}};(function(t,e){(function(s,f,u){let l;(l=u.define)&&l.amd?l([],function(){return f}):(l=u.modules)?l[s.toLowerCase()]=f:t.exports=f})("FlexSearch",function s(f){function u(r,i){const n=i?i.id:r&&r.id;this.id=n||n===0?n:Qe++,this.init(r,i),I(this,"index",function(){return this.a?Object.keys(this.a.index[this.a.keys[0]].c):Object.keys(this.c)}),I(this,"length",function(){return this.index.length})}function l(r,i,n,o){return this.u!==this.g&&(this.o=this.o.concat(n),this.u++,o&&this.o.length>=o&&(this.u=this.g),this.u===this.g&&(this.cache&&this.j.set(i,this.o),this.F&&this.F(this.o))),this}function _(r){const i=D();for(const n in r)if(r.hasOwnProperty(n)){const o=r[n];G(o)?i[n]=o.slice(0):Y(o)?i[n]=_(o):i[n]=o}return i}function x(r,i){const n=r.length,o=it(i),a=[];for(let h=0,d=0;h<n;h++){const c=r[h];(o&&i(c)||!o&&!i[c])&&(a[d++]=c)}return a}function T(r,i,n,o,a,h,d,c,p,g){n=pt(n,d?0:a,c,h,i,p,g);let A;if(c&&(c=n.page,A=n.next,n=n.result),d)i=this.where(d,null,a,n);else{for(i=n,n=this.l,a=i.length,h=Array(a),d=0;d<a;d++)h[d]=n[i[d]];i=h}return n=i,o&&(it(o)||(Q=o.split(":"),1<Q.length?o=Z:(Q=Q[0],o=K)),n.sort(o)),n=b(c,A,n),this.cache&&this.j.set(r,n),n}function I(r,i,n){Object.defineProperty(r,i,{get:n})}function v(r){return new RegExp(r,"g")}function S(r,i){for(let n=0;n<i.length;n+=2)r=r.replace(i[n],i[n+1]);return r}function E(r,i,n,o,a,h,d,c){return i[n]?i[n]:(a=a?(c-(d||c/1.5))*h+(d||c/1.5)*a:h,i[n]=a,a>=d&&(r=r[c-(a+.5>>0)],r=r[n]||(r[n]=[]),r[r.length]=o),a)}function N(r,i){if(r){const n=Object.keys(r);for(let o=0,a=n.length;o<a;o++){const h=n[o],d=r[h];if(d)for(let c=0,p=d.length;c<p;c++)if(d[c]===i){p===1?delete r[h]:d.splice(c,1);break}else Y(d[c])&&N(d[c],i)}}}function L(r){let i="",n="";var o="";for(let a=0;a<r.length;a++){const h=r[a];h!==n&&(a&&h==="h"?(o=o==="a"||o==="e"||o==="i"||o==="o"||o==="u"||o==="y",((n==="a"||n==="e"||n==="i"||n==="o"||n==="u"||n==="y")&&o||n===" ")&&(i+=h)):i+=h),o=a===r.length-1?"":r[a+1],n=h}return i}function B(r,i){return r=r.length-i.length,0>r?1:r?-1:0}function K(r,i){return r=r[Q],i=i[Q],r<i?-1:r>i?1:0}function Z(r,i){const n=Q.length;for(let o=0;o<n;o++)r=r[Q[o]],i=i[Q[o]];return r<i?-1:r>i?1:0}function b(r,i,n){return r?{page:r,next:i?""+i:null,result:n}:n}function pt(r,i,n,o,a,h,d){let c,p=[];if(n===!0){n="0";var g=""}else g=n&&n.split(":");const A=r.length;if(1<A){const R=D(),$=[];let m,C;var w=0,y;let X;var P=!0;let z,W=0,et,Gt,$t,Ht;if(g&&(g.length===2?($t=g,g=!1):g=Ht=parseInt(g[0],10)),d){for(m=D();w<A;w++)if(a[w]==="not")for(C=r[w],X=C.length,y=0;y<X;y++)m["@"+C[y]]=1;else Gt=w+1;if(H(Gt))return b(n,c,p);w=0}else et=U(a)&&a;let It;for(;w<A;w++){const ke=w===(Gt||A)-1;if(!et||!w)if((y=et||a&&a[w])&&y!=="and")if(y==="or")It=!1;else continue;else It=h=!0;if(C=r[w],X=C.length){if(P)if(z){var O=z.length;for(y=0;y<O;y++){P=z[y];var F="@"+P;d&&m[F]||(R[F]=1,h||(p[W++]=P))}z=null,P=!1}else{z=C;continue}for(F=!1,y=0;y<X;y++){O=C[y];var M="@"+O;const mt=h?R[M]||0:w;if(!(!mt&&!o||d&&m[M]||!h&&R[M]))if(mt===w){if(ke){if((!Ht||--Ht<W)&&(p[W++]=O,i&&W===i))return b(n,W+(g||0),p)}else R[M]=w+1;F=!0}else o&&(M=$[mt]||($[mt]=[]),M[M.length]=O)}if(It&&!F&&!o)break}else if(It&&!o)return b(n,c,C)}if(z)if(w=z.length,d)for(y=g?parseInt(g,10):0;y<w;y++)r=z[y],m["@"+r]||(p[W++]=r);else p=z;if(o){for(W=p.length,$t?(w=parseInt($t[0],10)+1,y=parseInt($t[1],10)+1):(w=$.length,y=0);w--;)if(O=$[w]){for(X=O.length;y<X;y++)if(o=O[y],(!d||!m["@"+o])&&(p[W++]=o,i&&W===i))return b(n,w+":"+y,p);y=0}}}else!A||a&&a[0]==="not"||(p=r[0],g&&(g=parseInt(g[0],10)));return i&&(d=p.length,g&&g>d&&(g=0),g=g||0,c=g+i,c<d?p=p.slice(g,c):(c=0,g&&(p=p.slice(g)))),b(n,c,p)}function U(r){return typeof r=="string"}function G(r){return r.constructor===Array}function it(r){return typeof r=="function"}function Y(r){return typeof r=="object"}function H(r){return typeof r>"u"}function te(r){const i=Array(r);for(let n=0;n<r;n++)i[n]=D();return i}function D(){return Object.create(null)}function Xe(){let r,i;self.onmessage=function(n){if(n=n.data)if(n.search){const o=i.search(n.content,n.threshold?{limit:n.limit,threshold:n.threshold,where:n.where}:n.limit);self.postMessage({id:r,content:n.content,limit:n.limit,result:o})}else n.add?i.add(n.id,n.content):n.update?i.update(n.id,n.content):n.remove?i.remove(n.id):n.clear?i.clear():n.info?(n=i.info(),n.worker=r,console.log(n)):n.register&&(r=n.id,n.options.cache=!1,n.options.async=!1,n.options.worker=!1,i=new Function(n.register.substring(n.register.indexOf("{")+1,n.register.lastIndexOf("}")))(),i=new i(n.options))}}function Ze(r,i,n,o){r=f("flexsearch","id"+r,Xe,function(h){(h=h.data)&&h.result&&o(h.id,h.content,h.result,h.limit,h.where,h.cursor,h.suggest)},i);const a=s.toString();return n.id=i,r.postMessage({register:a,options:n,id:i}),r}const J={encode:"icase",f:"forward",split:/\W+/,cache:!1,async:!1,g:!1,D:!1,a:!1,b:9,threshold:0,depth:0},ee={memory:{encode:"extra",f:"strict",threshold:0,b:1},speed:{encode:"icase",f:"strict",threshold:1,b:3,depth:2},match:{encode:"extra",f:"full",threshold:1,b:3},score:{encode:"extra",f:"strict",threshold:1,b:9,depth:4},balance:{encode:"balance",f:"strict",threshold:0,b:3,depth:3},fast:{encode:"icase",f:"strict",threshold:8,b:9,depth:1}},Pt=[];let Qe=0;const re={},ne={};u.create=function(r,i){return new u(r,i)},u.registerMatcher=function(r){for(const i in r)r.hasOwnProperty(i)&&Pt.push(v(i),r[i]);return this},u.registerEncoder=function(r,i){return ut[r]=i.bind(ut),this},u.registerLanguage=function(r,i){return re[r]=i.filter,ne[r]=i.stemmer,this},u.encode=function(r,i){return ut[r](i)},u.prototype.init=function(r,i){if(this.v=[],i){var n=i.preset;r=i}else r||(r=J),n=r.preset;if(i={},U(r)?(i=ee[r],r={}):n&&(i=ee[n]),n=r.worker)if(typeof Worker>"u")r.worker=!1,this.m=null;else{var o=parseInt(n,10)||4;this.C=-1,this.u=0,this.o=[],this.F=null,this.m=Array(o);for(var a=0;a<o;a++)this.m[a]=Ze(this.id,a,r,l.bind(this))}if(this.f=r.tokenize||i.f||this.f||J.f,this.split=H(n=r.split)?this.split||J.split:U(n)?v(n):n,this.D=r.rtl||this.D||J.D,this.async=typeof Promise>"u"||H(n=r.async)?this.async||J.async:n,this.g=H(n=r.worker)?this.g||J.g:n,this.threshold=H(n=r.threshold)?i.threshold||this.threshold||J.threshold:n,this.b=H(n=r.resolution)?n=i.b||this.b||J.b:n,n<=this.threshold&&(this.b=this.threshold+1),this.depth=this.f!=="strict"||H(n=r.depth)?i.depth||this.depth||J.depth:n,this.w=(n=H(n=r.encode)?i.encode||J.encode:n)&&ut[n]&&ut[n].bind(ut)||(it(n)?n:this.w||!1),(n=r.matcher)&&this.addMatcher(n),n=(i=r.lang)||r.filter){if(U(n)&&(n=re[n]),G(n)){o=this.w,a=D();for(var h=0;h<n.length;h++){var d=o?o(n[h]):n[h];a[d]=1}n=a}this.filter=n}if(n=i||r.stemmer){var c;i=U(n)?ne[n]:n,o=this.w,a=[];for(c in i)i.hasOwnProperty(c)&&(h=o?o(c):c,a.push(v(h+"($|\\W)"),o?o(i[c]):i[c]));this.stemmer=c=a}if(this.a=a=(n=r.doc)?_(n):this.a||J.a,this.i=te(this.b-(this.threshold||0)),this.h=D(),this.c=D(),a){if(this.l=D(),r.doc=null,c=a.index={},i=a.keys=[],o=a.field,h=a.tag,d=a.store,G(a.id)||(a.id=a.id.split(":")),d){var p=D();if(U(d))p[d]=1;else if(G(d))for(let g=0;g<d.length;g++)p[d[g]]=1;else Y(d)&&(p=d);a.store=p}if(h){if(this.G=D(),d=D(),o)if(U(o))d[o]=r;else if(G(o))for(p=0;p<o.length;p++)d[o[p]]=r;else Y(o)&&(d=o);for(G(h)||(a.tag=h=[h]),o=0;o<h.length;o++)this.G[h[o]]=D();this.I=h,o=d}if(o){let g;for(G(o)||(Y(o)?(g=o,a.field=o=Object.keys(o)):a.field=o=[o]),a=0;a<o.length;a++)h=o[a],G(h)||(g&&(r=g[h]),i[a]=h,o[a]=h.split(":")),c[h]=new u(r)}r.doc=n}return this.B=!0,this.j=(this.cache=n=H(n=r.cache)?this.cache||J.cache:n)?new qe(n):!1,this},u.prototype.encode=function(r){return r&&(Pt.length&&(r=S(r,Pt)),this.v.length&&(r=S(r,this.v)),this.w&&(r=this.w(r)),this.stemmer&&(r=S(r,this.stemmer))),r},u.prototype.addMatcher=function(r){const i=this.v;for(const n in r)r.hasOwnProperty(n)&&i.push(v(n),r[n]);return this},u.prototype.add=function(r,i,n,o,a){if(this.a&&Y(r))return this.A("add",r,i);if(i&&U(i)&&(r||r===0)){var h="@"+r;if(this.c[h]&&!o)return this.update(r,i);if(this.g)return++this.C>=this.m.length&&(this.C=0),this.m[this.C].postMessage({add:!0,id:r,content:i}),this.c[h]=""+this.C,n&&n(),this;if(!a){if(this.async&&typeof importScripts!="function"){let $=this;if(h=new Promise(function(m){setTimeout(function(){$.add(r,i,null,o,!0),$=null,m()})}),n)h.then(n);else return h;return this}if(n)return this.add(r,i,null,o,!0),n(),this}if(i=this.encode(i),!i.length)return this;n=this.f,a=it(n)?n(i):i.split(this.split),this.filter&&(a=x(a,this.filter));const w=D();w._ctx=D();const y=a.length,P=this.threshold,O=this.depth,F=this.b,M=this.i,R=this.D;for(let $=0;$<y;$++){var d=a[$];if(d){var c=d.length,p=(R?$+1:y-$)/y,g="";switch(n){case"reverse":case"both":for(var A=c;--A;)g=d[A]+g,E(M,w,g,r,R?1:(c-A)/c,p,P,F-1);g="";case"forward":for(A=0;A<c;A++)g+=d[A],E(M,w,g,r,R?(A+1)/c:1,p,P,F-1);break;case"full":for(A=0;A<c;A++){const m=(R?A+1:c-A)/c;for(let C=c;C>A;C--)g=d.substring(A,C),E(M,w,g,r,m,p,P,F-1)}break;default:if(c=E(M,w,d,r,1,p,P,F-1),O&&1<y&&c>=P)for(c=w._ctx[d]||(w._ctx[d]=D()),d=this.h[d]||(this.h[d]=te(F-(P||0))),p=$-O,g=$+O+1,0>p&&(p=0),g>y&&(g=y);p<g;p++)p!==$&&E(d,c,a[p],r,0,F-(p<$?$-p:p-$),P,F-1)}}}this.c[h]=1,this.B=!1}return this},u.prototype.A=function(r,i,n){if(G(i)){var o=i.length;if(o--){for(var a=0;a<o;a++)this.A(r,i[a]);return this.A(r,i[o],n)}}else{var h=this.a.index,d=this.a.keys,c=this.a.tag;a=this.a.store;var p,g=this.a.id;o=i;for(var A=0;A<g.length;A++)o=o[g[A]];if(r==="remove"&&(delete this.l[o],g=d.length,g--)){for(i=0;i<g;i++)h[d[i]].remove(o);return h[d[g]].remove(o,n)}if(c){for(p=0;p<c.length;p++){var w=c[p],y=i;for(g=w.split(":"),A=0;A<g.length;A++)y=y[g[A]];y="@"+y}p=this.G[w],p=p[y]||(p[y]=[])}g=this.a.field;for(let P=0,O=g.length;P<O;P++){for(w=g[P],c=i,y=0;y<w.length;y++)c=c[w[y]];w=h[d[P]],y=r==="add"?w.add:w.update,P===O-1?y.call(w,o,c,n):y.call(w,o,c)}if(a){for(n=Object.keys(a),r=D(),h=0;h<n.length;h++)if(d=n[h],a[d]){d=d.split(":");let P,O;for(g=0;g<d.length;g++)c=d[g],P=(P||i)[c],O=(O||r)[c]=P}i=r}p&&(p[p.length]=i),this.l[o]=i}return this},u.prototype.update=function(r,i,n){return this.a&&Y(r)?this.A("update",r,i):(this.c["@"+r]&&U(i)&&(this.remove(r),this.add(r,i,n,!0)),this)},u.prototype.remove=function(r,i,n){if(this.a&&Y(r))return this.A("remove",r,i);var o="@"+r;if(this.c[o]){if(this.g)return this.m[this.c[o]].postMessage({remove:!0,id:r}),delete this.c[o],i&&i(),this;if(!n){if(this.async&&typeof importScripts!="function"){let a=this;if(o=new Promise(function(h){setTimeout(function(){a.remove(r,null,!0),a=null,h()})}),i)o.then(i);else return o;return this}if(i)return this.remove(r,null,!0),i(),this}for(i=0;i<this.b-(this.threshold||0);i++)N(this.i[i],r);this.depth&&N(this.h,r),delete this.c[o],this.B=!1}return this};let Q;u.prototype.search=function(r,i,n,o){if(Y(i)){if(G(i))for(var a=0;a<i.length;a++)i[a].query=r;else i.query=r;r=i,i=1e3}else i&&it(i)?(n=i,i=1e3):i||i===0||(i=1e3);if(this.g){this.F=n,this.u=0,this.o=[];for(var h=0;h<this.g;h++)this.m[h].postMessage({search:!0,limit:i,content:r})}else{var d=[],c=r;if(Y(r)&&!G(r)){n||(n=r.callback)&&(c.callback=null);var p=r.sort,g=r.page;i=r.limit,h=r.threshold;var A=r.suggest;r=r.query}if(this.a){h=this.a.index;const R=c.where;var w=c.bool||"or",y=c.field;let $=w,m,C;if(y)G(y)||(y=[y]);else if(G(c)){var P=c;y=[],$=[];for(var O=0;O<c.length;O++)o=c[O],a=o.bool||w,y[O]=o.field,$[O]=a,a==="not"?m=!0:a==="and"&&(C=!0)}else y=this.a.keys;for(w=y.length,O=0;O<w;O++)P&&(c=P[O]),g&&!U(c)&&(c.page=null,c.limit=0),d[O]=h[y[O]].search(c,0);if(n)return n(T.call(this,r,$,d,p,i,A,R,g,C,m));if(this.async){const X=this;return new Promise(function(z){Promise.all(d).then(function(W){z(T.call(X,r,$,W,p,i,A,R,g,C,m))})})}return T.call(this,r,$,d,p,i,A,R,g,C,m)}if(h||(h=this.threshold||0),!o){if(this.async&&typeof importScripts!="function"){let R=this;if(h=new Promise(function($){setTimeout(function(){$(R.search(c,i,null,!0)),R=null})}),n)h.then(n);else return h;return this}if(n)return n(this.search(c,i,null,!0)),this}if(!r||!U(r))return d;if(c=r,this.cache)if(this.B){if(n=this.j.get(r))return n}else this.j.clear(),this.B=!0;if(c=this.encode(c),!c.length)return d;n=this.f,n=it(n)?n(c):c.split(this.split),this.filter&&(n=x(n,this.filter)),P=n.length,o=!0,a=[];var F=D(),M=0;if(1<P&&(this.depth&&this.f==="strict"?w=!0:n.sort(B)),!w||(O=this.h)){const R=this.b;for(;M<P;M++){let $=n[M];if($){if(w){if(!y){if(O[$])y=$,F[$]=1;else if(!A)return d}if(A&&M===P-1&&!a.length)w=!1,$=y||$,F[$]=0;else if(!y)continue}if(!F[$]){const m=[];let C=!1,X=0;const z=w?O[y]:this.i;if(z){let W;for(let et=0;et<R-h;et++)(W=z[et]&&z[et][$])&&(m[X++]=W,C=!0)}if(C)y=$,a[a.length]=1<X?m.concat.apply([],m):m[0];else if(!A){o=!1;break}F[$]=1}}}}else o=!1;return o&&(d=pt(a,i,g,A)),this.cache&&this.j.set(r,d),d}},u.prototype.find=function(r,i){return this.where(r,i,1)[0]||null},u.prototype.where=function(r,i,n,o){const a=this.l,h=[];let d=0,c;var p;let g;if(Y(r)){n||(n=i);var A=Object.keys(r),w=A.length;if(c=!1,w===1&&A[0]==="id")return[a[r.id]];if((p=this.I)&&!o)for(var y=0;y<p.length;y++){var P=p[y],O=r[P];if(!H(O)){if(g=this.G[P]["@"+O],--w===0)return g;A.splice(A.indexOf(P),1),delete r[P];break}}for(p=Array(w),y=0;y<w;y++)p[y]=A[y].split(":")}else{if(it(r)){for(i=o||Object.keys(a),n=i.length,A=0;A<n;A++)w=a[i[A]],r(w)&&(h[d++]=w);return h}if(H(i))return[a[r]];if(r==="id")return[a[i]];A=[r],w=1,p=[r.split(":")],c=!0}for(o=g||o||Object.keys(a),y=o.length,P=0;P<y;P++){O=g?o[P]:a[o[P]];let F=!0;for(let M=0;M<w;M++){c||(i=r[A[M]]);const R=p[M],$=R.length;let m=O;if(1<$)for(let C=0;C<$;C++)m=m[R[C]];else m=m[R[0]];if(m!==i){F=!1;break}}if(F&&(h[d++]=O,n&&d===n))break}return h},u.prototype.info=function(){if(this.g)for(let r=0;r<this.g;r++)this.m[r].postMessage({info:!0,id:this.id});else return{id:this.id,items:this.length,cache:this.cache&&this.cache.s?this.cache.s.length:!1,matcher:Pt.length+(this.v?this.v.length:0),worker:this.g,threshold:this.threshold,depth:this.depth,resolution:this.b,contextual:this.depth&&this.f==="strict"}},u.prototype.clear=function(){return this.destroy().init()},u.prototype.destroy=function(){if(this.cache&&(this.j.clear(),this.j=null),this.i=this.h=this.c=null,this.a){const r=this.a.keys;for(let i=0;i<r.length;i++)this.a.index[r[i]].destroy();this.a=this.l=null}return this},u.prototype.export=function(r){const i=!r||H(r.serialize)||r.serialize;if(this.a){const o=!r||H(r.doc)||r.doc;var n=!r||H(r.index)||r.index;r=[];let a=0;if(n)for(n=this.a.keys;a<n.length;a++){const h=this.a.index[n[a]];r[a]=[h.i,h.h,Object.keys(h.c)]}o&&(r[a]=this.l)}else r=[this.i,this.h,Object.keys(this.c)];return i&&(r=JSON.stringify(r)),r},u.prototype.import=function(r,i){(!i||H(i.serialize)||i.serialize)&&(r=JSON.parse(r));const n=D();if(this.a){var o=!i||H(i.doc)||i.doc,a=0;if(!i||H(i.index)||i.index){i=this.a.keys;const d=i.length;for(var h=r[0][2];a<h.length;a++)n[h[a]]=1;for(a=0;a<d;a++){h=this.a.index[i[a]];const c=r[a];c&&(h.i=c[0],h.h=c[1],h.c=n)}}o&&(this.l=Y(o)?o:r[a])}else{for(o=r[2],a=0;a<o.length;a++)n[o[a]]=1;this.i=r[0],this.h=r[1],this.c=n}};const Ve=function(){const r=v("\\s+"),i=v("[^a-z0-9 ]"),n=[v("[-/]")," ",i,"",r," "];return function(o){return L(S(o.toLowerCase(),n))}}(),ut={icase:function(r){return r.toLowerCase()},simple:function(){const r=v("\\s+"),i=v("[^a-z0-9 ]"),n=v("[-/]"),o=v("[\xE0\xE1\xE2\xE3\xE4\xE5]"),a=v("[\xE8\xE9\xEA\xEB]"),h=v("[\xEC\xED\xEE\xEF]"),d=v("[\xF2\xF3\xF4\xF5\xF6\u0151]"),c=v("[\xF9\xFA\xFB\xFC\u0171]"),p=v("[\xFD\u0177\xFF]"),g=v("\xF1"),A=v("[\xE7c]"),w=v("\xDF"),y=v(" & "),P=[o,"a",a,"e",h,"i",d,"o",c,"u",p,"y",g,"n",A,"k",w,"s",y," and ",n," ",i,"",r," "];return function(O){return O=S(O.toLowerCase(),P),O===" "?"":O}}(),advanced:function(){const r=v("ae"),i=v("ai"),n=v("ay"),o=v("ey"),a=v("oe"),h=v("ue"),d=v("ie"),c=v("sz"),p=v("zs"),g=v("ck"),A=v("cc"),w=v("sh"),y=v("th"),P=v("dt"),O=v("ph"),F=v("pf"),M=v("ou"),R=v("uo"),$=[r,"a",i,"ei",n,"ei",o,"ei",a,"o",h,"u",d,"i",c,"s",p,"s",w,"s",g,"k",A,"k",y,"t",P,"t",O,"f",F,"f",M,"o",R,"u"];return function(m,C){return m&&(m=this.simple(m),2<m.length&&(m=S(m,$)),C||1<m.length&&(m=L(m)),m)}}(),extra:function(){const r=v("p"),i=v("z"),n=v("[cgq]"),o=v("n"),a=v("d"),h=v("[vw]"),d=v("[aeiouy]"),c=[r,"b",i,"s",n,"k",o,"m",a,"t",h,"f",d,""];return function(p){if(!p)return p;if(p=this.advanced(p,!0),1<p.length){p=p.split(" ");for(let g=0;g<p.length;g++){const A=p[g];1<A.length&&(p[g]=A[0]+S(A.substring(1),c))}p=p.join(" "),p=L(p)}return p}}(),balance:Ve},qe=function(){function r(i){this.clear(),this.H=i!==!0&&i}return r.prototype.clear=function(){this.cache=D(),this.count=D(),this.index=D(),this.s=[]},r.prototype.set=function(i,n){if(this.H&&H(this.cache[i])){let o=this.s.length;if(o===this.H){o--;const a=this.s[o];delete this.cache[a],delete this.count[a],delete this.index[a]}this.index[i]=o,this.s[o]=i,this.count[i]=-1,this.cache[i]=n,this.get(i)}else this.cache[i]=n},r.prototype.get=function(i){const n=this.cache[i];if(this.H&&n){var o=++this.count[i];const h=this.index;let d=h[i];if(0<d){const c=this.s;for(var a=d;this.count[c[--d]]<=o&&d!==-1;);if(d++,d!==a){for(o=a;o>d;o--)a=c[o-1],c[o]=a,h[a]=o;c[d]=i,h[i]=d}}}return n},r}();return u}(function(){const s={},f=typeof Blob<"u"&&typeof URL<"u"&&URL.createObjectURL;return function(u,l,_,x,T){return _=f?URL.createObjectURL(new Blob(["("+_.toString()+")()"],{type:"text/javascript"})):u+".min.js",u+="-"+l,s[u]||(s[u]=[]),s[u][T]=new Worker(_),s[u][T].onmessage=x,s[u][T]}}()),er)})(We);const Ie=We.exports;function Ds(t,e){let s=t[e],f=e;const u=[s];for(;s&&s.depth>2;){let l=!1;for(let _=f-1;_>=0;_--){const x=t[_];if(x.depth>1&&x.depth===s.depth-1){s=x,f=_,u.unshift(s),l=!0;break}}if(!l)break}return u}const me=100,Gs=/[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]|[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|[\u3041-\u3096]|[\u30A1-\u30FA]/giu,Hs=["home","api","404","custom"];var lt,ct,At,Ot,jt,Ke,Mt,Ye,Rt,Je;class bs{constructor(e=""){rt(this,jt);rt(this,Mt);rt(this,Rt);rt(this,lt,void 0);rt(this,ct,void 0);rt(this,At,{});rt(this,Ot,void 0);gt(this,Ot,e)}async init(e={}){const s=await rr(l=>l.path.startsWith(nr(st(this,Ot)))),f=s.filter(l=>{var _;return!Hs.includes(((_=l.frontmatter)==null?void 0:_.pageType)||"")}).map(l=>({title:l.title,headers:(l.toc||[]).map(_=>_.text),content:l.content||"",path:l.routePath,rawHeaders:l.toc||[]}));gt(this,At,s.reduce((l,_)=>((_.toc||[]).forEach(x=>{l[_.routePath+x.text]=x.id}),l),{}));const u={encode:"simple",tokenize:"forward",split:/\W+/,async:!0,doc:{id:"path",field:["title","headers","content"]},...e};gt(this,lt,Ie.create(u)),gt(this,ct,Ie.create({...u,encode:!1,tokenize(l){const _=[];let x=null;do x=Gs.exec(l),x&&_.push(x[0]);while(x);return _}})),st(this,lt).add(f),st(this,ct).add(f)}async match(e,s=7){var x,T;const u=(await Promise.all([(x=st(this,lt))==null?void 0:x.search({query:e,limit:s}),(T=st(this,ct))==null?void 0:T.search(e,s)])).flat(2).filter(Boolean),l=[];return u.forEach(I=>{Et(this,jt,Ke).call(this,I,e,l)||Et(this,Mt,Ye).call(this,I,e,l)}),Ls(l,"link")}}lt=new WeakMap,ct=new WeakMap,At=new WeakMap,Ot=new WeakMap,jt=new WeakSet,Ke=function(e,s,f){const{headers:u,rawHeaders:l}=e;for(const[_,x]of u.entries())if(x.includes(s)){const T=st(this,At)[e.path+x],v=Ds(l,_).map(S=>S.text).join(" > ");return f.push({type:"header",title:e.title,header:v,headerHighlightIndex:v.indexOf(s),link:`${ie(e.path)}#${T}`}),!0}return!1},Mt=new WeakSet,Ye=function(e,s,f){var N;const{content:u,headers:l}=e,_=u.indexOf(s);if(_===-1)return;const x=l.map(L=>u.indexOf(L)),T=x.findIndex((L,B)=>{if(B<l.length-1){const K=x[B+1];if(L<=_&&K>=_)return!0}else return L<_}),I=(N=l[T])!=null?N:e.title;let v=u.slice(0,_).lastIndexOf(`
`);v=v===-1?0:v;const S=u.indexOf(`
`,_+s.length);let E=u.slice(v,S);E.length>me&&(E=Et(this,Rt,Je).call(this,E,s)),f.push({type:"content",title:e.title,header:I,statement:E,statementHighlightIndex:E.indexOf(s),link:`${ie(e.path)}#${I}`})},Rt=new WeakSet,Je=function(e,s){const f=e.indexOf(s),u=Math.floor((me-s.length)/2);let l=e.slice(0,f);l.length>u&&(l="..."+e.slice(f-u+3,f));let _=e.slice(f+s.length);return _.length>u&&(_=e.slice(f+s.length,f+u-3)+"..."),l+s+_};export{bs as PageSearcher};
