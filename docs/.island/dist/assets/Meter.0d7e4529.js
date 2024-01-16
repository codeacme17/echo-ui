import{c as i}from"./CodeBlock.f3a900da.js";import{T as g,o as e,w as m,g as p}from"./index.5a6550a4.js";import{A as h}from"./Analyser.93bf318f.js";/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=i("Play",[["polygon",{points:"5 3 19 12 5 21 5 3",key:"191637"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=i("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);class t extends g{constructor(){super(e(t.getDefaults(),arguments)),this.name="MeterBase",this.input=this.output=this._analyser=new h({context:this.context,size:256,type:"waveform"})}dispose(){return super.dispose(),this._analyser.dispose(),this}}class n extends t{constructor(){super(e(n.getDefaults(),arguments,["smoothing"])),this.name="Meter",this._rms=0;const s=e(n.getDefaults(),arguments,["smoothing"]);this.input=this.output=this._analyser=new h({context:this.context,size:256,type:"waveform",channels:s.channels}),this.smoothing=s.smoothing,this.normalRange=s.normalRange}static getDefaults(){return Object.assign(t.getDefaults(),{smoothing:.8,normalRange:!1,channels:1})}getLevel(){return m("'getLevel' has been changed to 'getValue'"),this.getValue()}getValue(){const s=this._analyser.getValue(),a=(this.channels===1?[s]:s).map(o=>{const l=o.reduce((c,r)=>c+r*r,0),u=Math.sqrt(l/o.length);return this._rms=Math.max(u,this._rms*this.smoothing),this.normalRange?this._rms:p(this._rms)});return this.channels===1?a[0]:a}get channels(){return this._analyser.channels}dispose(){return super.dispose(),this._analyser.dispose(),this}}export{n as M,_ as P,w as S};
