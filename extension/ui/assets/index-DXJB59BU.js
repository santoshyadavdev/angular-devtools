(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Object.defineProperty,t=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,i=(t,n,r)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[n]=r,a=(e,a)=>{for(var o in a||={})n.call(a,o)&&i(e,o,a[o]);if(t)for(var o of t(a))r.call(a,o)&&i(e,o,a[o]);return e},o=(e,t,n)=>(i(e,typeof t==`symbol`?t:t+``,n),n),s=globalThis;function c(e){let t=s.__Zone_symbol_prefix;return(typeof t==`string`?t:`__zone_symbol__`)+e}function l(){let e=s.performance;function t(t){e&&e.mark&&e.mark(t)}function n(t,n){e&&e.measure&&e.measure(t,n)}t(`Zone`);let r=class e{constructor(e,t){o(this,`_parent`),o(this,`_name`),o(this,`_properties`),o(this,`_zoneDelegate`),this._parent=e,this._name=t?t.name||`unnamed`:`<root>`,this._properties=t&&t.properties||{},this._zoneDelegate=new l(this,this._parent&&this._parent._zoneDelegate,t)}static assertZonePatched(){if(s.Promise!==ae.ZoneAwarePromise)throw Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)")}static get root(){let t=e.current;for(;t.parent;)t=t.parent;return t}static get current(){return se.zone}static get currentTask(){return ce}static __load_patch(r,i,a=!1){if(Object.hasOwn(ae,r)){let e=s[c(`forceDuplicateZoneCheck`)]===!0;if(!a&&e)throw Error(`Already loaded patch: `+r)}else if(!s[`__Zone_disable_`+r]){let a=`Zone:`+r;t(a),ae[r]=i(s,e,oe),n(a,a)}}get parent(){return this._parent}get name(){return this._name}get(e){let t=this.getZoneWith(e);if(t)return t._properties[e]}getZoneWith(e){let t=this;for(;t;){if(Object.hasOwn(t._properties,e))return t;t=t._parent}return null}fork(e){if(!e)throw Error(`ZoneSpec required!`);return this._zoneDelegate.fork(this,e)}wrap(e,t){if(typeof e!=`function`)throw Error(`Expecting function got: `+e);let n=this._zoneDelegate.intercept(this,e,t),r=this;return function(){return r.runGuarded(n,this,arguments,t)}}run(e,t,n,r){se={parent:se,zone:this};try{return this._zoneDelegate.invoke(this,e,t,n,r)}finally{se=se.parent}}runGuarded(e,t=null,n,r){se={parent:se,zone:this};try{try{return this._zoneDelegate.invoke(this,e,t,n,r)}catch(e){if(this._zoneDelegate.handleError(this,e))throw e}}finally{se=se.parent}}runTask(e,t,n){if(e.zone!=this)throw Error(`A task can only be run in the zone of creation! (Creation: `+(e.zone||ee).name+`; Execution: `+this.name+`)`);let r=e,{type:i,data:{isPeriodic:a=!1,isRefreshable:o=!1}={}}=e;if(e.state===te&&(i===T||i===ie))return;let s=e.state!=S;s&&r._transitionTo(S,x);let c=ce;ce=r,se={parent:se,zone:this};try{i==ie&&e.data&&!a&&!o&&(e.cancelFn=void 0);try{return this._zoneDelegate.invokeTask(this,r,t,n)}catch(e){if(this._zoneDelegate.handleError(this,e))throw e}}finally{let t=e.state;if(t!==te&&t!==re){if(i==T||a||o&&t===ne)s&&r._transitionTo(x,S,ne);else{let e=r._zoneDelegates;this._updateTaskCount(r,-1),s&&r._transitionTo(te,S,te),o&&(r._zoneDelegates=e)}}se=se.parent,ce=c}}scheduleTask(e){if(e.zone&&e.zone!==this){let t=this;for(;t;){if(t===e.zone)throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${e.zone.name}`);t=t.parent}}e._transitionTo(ne,te);let t=[];e._zoneDelegates=t,e._zone=this;try{e=this._zoneDelegate.scheduleTask(this,e)}catch(t){throw e._transitionTo(re,ne,te),this._zoneDelegate.handleError(this,t),t}return e._zoneDelegates===t&&this._updateTaskCount(e,1),e.state==ne&&e._transitionTo(x,ne),e}scheduleMicroTask(e,t,n,r){return this.scheduleTask(new u(w,e,t,n,r,void 0))}scheduleMacroTask(e,t,n,r,i){return this.scheduleTask(new u(ie,e,t,n,r,i))}scheduleEventTask(e,t,n,r,i){return this.scheduleTask(new u(T,e,t,n,r,i))}cancelTask(e){if(e.zone!=this)throw Error(`A task can only be cancelled in the zone of creation! (Creation: `+(e.zone||ee).name+`; Execution: `+this.name+`)`);if(e.state===x||e.state===S){e._transitionTo(C,x,S);try{this._zoneDelegate.cancelTask(this,e)}catch(t){throw e._transitionTo(re,C),this._zoneDelegate.handleError(this,t),t}return this._updateTaskCount(e,-1),e._transitionTo(te,C),e.runCount=-1,e}}_updateTaskCount(e,t){let n=e._zoneDelegates;t==-1&&(e._zoneDelegates=null);for(let r=0;r<n.length;r++)n[r]._updateTaskCount(e.type,t)}};o(r,`__symbol__`,c);let i=r,a={name:``,onHasTask:(e,t,n,r)=>e.hasTask(n,r),onScheduleTask:(e,t,n,r)=>e.scheduleTask(n,r),onInvokeTask:(e,t,n,r,i,a)=>e.invokeTask(n,r,i,a),onCancelTask:(e,t,n,r)=>e.cancelTask(n,r)};class l{constructor(e,t,n){o(this,`_zone`),o(this,`_taskCounts`,{microTask:0,macroTask:0,eventTask:0}),o(this,`_forkDlgt`),o(this,`_forkZS`),o(this,`_forkCurrZone`),o(this,`_interceptDlgt`),o(this,`_interceptZS`),o(this,`_interceptCurrZone`),o(this,`_invokeDlgt`),o(this,`_invokeZS`),o(this,`_invokeCurrZone`),o(this,`_handleErrorDlgt`),o(this,`_handleErrorZS`),o(this,`_handleErrorCurrZone`),o(this,`_scheduleTaskDlgt`),o(this,`_scheduleTaskZS`),o(this,`_scheduleTaskCurrZone`),o(this,`_invokeTaskDlgt`),o(this,`_invokeTaskZS`),o(this,`_invokeTaskCurrZone`),o(this,`_cancelTaskDlgt`),o(this,`_cancelTaskZS`),o(this,`_cancelTaskCurrZone`),o(this,`_hasTaskDlgt`),o(this,`_hasTaskDlgtOwner`),o(this,`_hasTaskZS`),o(this,`_hasTaskCurrZone`),this._zone=e,this._forkZS=n&&(n&&n.onFork?n:t._forkZS),this._forkDlgt=n&&(n.onFork?t:t._forkDlgt),this._forkCurrZone=n&&(n.onFork?this._zone:t._forkCurrZone),this._interceptZS=n&&(n.onIntercept?n:t._interceptZS),this._interceptDlgt=n&&(n.onIntercept?t:t._interceptDlgt),this._interceptCurrZone=n&&(n.onIntercept?this._zone:t._interceptCurrZone),this._invokeZS=n&&(n.onInvoke?n:t._invokeZS),this._invokeDlgt=n&&(n.onInvoke?t:t._invokeDlgt),this._invokeCurrZone=n&&(n.onInvoke?this._zone:t._invokeCurrZone),this._handleErrorZS=n&&(n.onHandleError?n:t._handleErrorZS),this._handleErrorDlgt=n&&(n.onHandleError?t:t._handleErrorDlgt),this._handleErrorCurrZone=n&&(n.onHandleError?this._zone:t._handleErrorCurrZone),this._scheduleTaskZS=n&&(n.onScheduleTask?n:t._scheduleTaskZS),this._scheduleTaskDlgt=n&&(n.onScheduleTask?t:t._scheduleTaskDlgt),this._scheduleTaskCurrZone=n&&(n.onScheduleTask?this._zone:t._scheduleTaskCurrZone),this._invokeTaskZS=n&&(n.onInvokeTask?n:t._invokeTaskZS),this._invokeTaskDlgt=n&&(n.onInvokeTask?t:t._invokeTaskDlgt),this._invokeTaskCurrZone=n&&(n.onInvokeTask?this._zone:t._invokeTaskCurrZone),this._cancelTaskZS=n&&(n.onCancelTask?n:t._cancelTaskZS),this._cancelTaskDlgt=n&&(n.onCancelTask?t:t._cancelTaskDlgt),this._cancelTaskCurrZone=n&&(n.onCancelTask?this._zone:t._cancelTaskCurrZone),this._hasTaskZS=null,this._hasTaskDlgt=null,this._hasTaskDlgtOwner=null,this._hasTaskCurrZone=null;let r=n&&n.onHasTask,i=t&&t._hasTaskZS;(r||i)&&(this._hasTaskZS=r?n:a,this._hasTaskDlgt=t,this._hasTaskDlgtOwner=this,this._hasTaskCurrZone=this._zone,n.onScheduleTask||(this._scheduleTaskZS=a,this._scheduleTaskDlgt=t,this._scheduleTaskCurrZone=this._zone),n.onInvokeTask||(this._invokeTaskZS=a,this._invokeTaskDlgt=t,this._invokeTaskCurrZone=this._zone),n.onCancelTask||(this._cancelTaskZS=a,this._cancelTaskDlgt=t,this._cancelTaskCurrZone=this._zone))}get zone(){return this._zone}fork(e,t){return this._forkZS?this._forkZS.onFork(this._forkDlgt,this.zone,e,t):new i(e,t)}intercept(e,t,n){return this._interceptZS?this._interceptZS.onIntercept(this._interceptDlgt,this._interceptCurrZone,e,t,n):t}invoke(e,t,n,r,i){return this._invokeZS?this._invokeZS.onInvoke(this._invokeDlgt,this._invokeCurrZone,e,t,n,r,i):t.apply(n,r)}handleError(e,t){return!this._handleErrorZS||this._handleErrorZS.onHandleError(this._handleErrorDlgt,this._handleErrorCurrZone,e,t)}scheduleTask(e,t){let n=t;if(this._scheduleTaskZS)this._hasTaskZS&&n._zoneDelegates.push(this._hasTaskDlgtOwner),n=this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt,this._scheduleTaskCurrZone,e,t),n||=t;else if(t.scheduleFn)t.scheduleFn(t);else if(t.type==w)y(t);else throw Error(`Task is missing scheduleFn.`);return n}invokeTask(e,t,n,r){return this._invokeTaskZS?this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt,this._invokeTaskCurrZone,e,t,n,r):t.callback.apply(n,r)}cancelTask(e,t){let n;if(this._cancelTaskZS)n=this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt,this._cancelTaskCurrZone,e,t);else{if(!t.cancelFn)throw Error(`Task is not cancelable`);n=t.cancelFn(t)}return n}hasTask(e,t){try{this._hasTaskZS&&this._hasTaskZS.onHasTask(this._hasTaskDlgt,this._hasTaskCurrZone,e,t)}catch(t){this.handleError(e,t)}}_updateTaskCount(e,t){let n=this._taskCounts,r=n[e],i=n[e]=r+t;if(i<0)throw Error(`More tasks executed then were scheduled.`);if(r==0||i==0){let t={microTask:n.microTask>0,macroTask:n.macroTask>0,eventTask:n.eventTask>0,change:e};this.hasTask(this._zone,t)}}}class u{constructor(e,t,n,r,i,a){if(o(this,`type`),o(this,`source`),o(this,`invoke`),o(this,`callback`),o(this,`data`),o(this,`scheduleFn`),o(this,`cancelFn`),o(this,`_zone`,null),o(this,`runCount`,0),o(this,`_zoneDelegates`,null),o(this,`_state`,`notScheduled`),this.type=e,this.source=t,this.data=r,this.scheduleFn=i,this.cancelFn=a,!n)throw Error(`callback is not defined`);this.callback=n;let c=this;this.invoke=e===T&&r&&r.useG?u.invokeTask:function(){return u.invokeTask.call(s,c,this,arguments)}}static invokeTask(e,t,n){e||=this,le++;try{return e.runCount++,e.zone.runTask(e,t,n)}finally{try{le===1&&!s[m]&&b()}finally{le--}}}get zone(){return this._zone}get state(){return this._state}cancelScheduleRequest(){this._transitionTo(te,ne)}_transitionTo(e,t,n){if(this._state===t||this._state===n)this._state=e,e==te&&(this._zoneDelegates=null);else throw Error(`${this.type} '${this.source}': can not transition to '${e}', expecting state '${t}'${n?` or '`+n+`'`:``}, was '${this._state}'.`)}toString(){return this.data&&this.data.handleId!==void 0?this.data.handleId.toString():Object.prototype.toString.call(this)}toJSON(){return{type:this.type,state:this.state,source:this.source,zone:this.zone.name,runCount:this.runCount}}}let d=c(`setTimeout`),f=c(`Promise`),p=c(`then`),m=c(`enable_native_microtask_draining`),h=[],g=!1,_;function v(e){!_&&s[f]&&(_=s[f].resolve(0)),_?(_[p]??_.then).call(_,e):s[d](e,0)}function y(e){let t=s[m],n=t&&h.length===0&&!g,r=!t&&le===0&&h.length===0;(n||r)&&v(b),e&&h.push(e)}function b(){if(!g){g=!0;try{for(;h.length;){let e=h;h=[];for(let t of e)try{t.zone.runTask(t,null,null)}catch(e){oe.onUnhandledError(e)}}}finally{if(s[m])g=!1,oe.microtaskDrainDone();else try{oe.microtaskDrainDone()}finally{g=!1}}}}let ee={name:`NO ZONE`},te=`notScheduled`,ne=`scheduling`,x=`scheduled`,S=`running`,C=`canceling`,re=`unknown`,w=`microTask`,ie=`macroTask`,T=`eventTask`,ae=Object.create(null),oe={symbol:c,currentZoneFrame:()=>se,onUnhandledError:ue,microtaskDrainDone:ue,scheduleMicroTask:y,showUncaughtError:()=>!i[c(`ignoreConsoleErrorUncaughtError`)],patchEventTarget:()=>[],patchOnProperties:ue,patchMethod:()=>ue,bindArguments:()=>[],patchThen:()=>ue,patchMacroTask:()=>ue,patchEventPrototype:()=>ue,getGlobalObjects:()=>void 0,ObjectDefineProperty:()=>ue,ObjectGetOwnPropertyDescriptor:()=>void 0,ObjectCreate:()=>void 0,ArraySlice:()=>[],patchClass:()=>ue,wrapWithCurrentZone:()=>ue,filterProperties:()=>[],attachOriginToPatched:()=>ue,_redefineProperty:()=>ue,patchCallbacks:()=>ue,nativeScheduleMicroTask:v},se={parent:null,zone:new i(null,null)},ce=null,le=0;function ue(){}return n(`Zone`,`Zone`),i}function u(){let e=globalThis,t=e[c(`forceDuplicateZoneCheck`)]===!0;if(e.Zone&&(t||typeof e.Zone.__symbol__!=`function`))throw Error(`Zone already loaded.`);return e.Zone??=l(),e.Zone}var d=Object.getOwnPropertyDescriptor,f=Object.defineProperty,p=Object.getPrototypeOf,m=Object.create,h=Array.prototype.slice,g=`addEventListener`,_=`removeEventListener`,v=c(g),y=c(_),b=`true`,ee=`false`,te=c(``);function ne(e,t){return Zone.current.wrap(e,t)}function x(e,t,n,r,i){return Zone.current.scheduleMacroTask(e,t,n,r,i)}var S=c,C=typeof window<`u`,re=C?window:void 0,w=C&&re||globalThis,ie=`removeAttribute`;function T(e,t){for(let n=e.length-1;n>=0;n--)typeof e[n]==`function`&&(e[n]=ne(e[n],t+`_`+n));return e}function ae(e,t){let n=e.constructor.name;for(let r=0;r<t.length;r++){let i=t[r],a=e[i];if(a){if(!oe(d(e,i)))continue;e[i]=(e=>{let t=function(){return e.apply(this,T(arguments,n+`.`+i))};return be(t,e),t})(a)}}}function oe(e){return e?e.writable===!1?!1:typeof e.get!=`function`||e.set!==void 0:!0}var se=typeof WorkerGlobalScope<`u`&&self instanceof WorkerGlobalScope,ce=!(`nw`in w)&&w.process!==void 0&&w.process.toString()===`[object process]`,le=!ce&&!se&&!!(C&&re.HTMLElement),ue=w.process!==void 0&&w.process.toString()===`[object process]`&&!se&&!!(C&&re.HTMLElement),de=Object.create(null),fe=S(`enable_beforeunload`),pe=function(e){if(e||=w.event,!e)return;let t=de[e.type];t||=de[e.type]=S(`ON_PROPERTY`+e.type);let n=this||e.target||w,r=n[t],i;if(le&&n===re&&e.type===`error`){let t=e;i=r&&r.call(this,t.message,t.filename,t.lineno,t.colno,t.error),i===!0&&e.preventDefault()}else i=r&&r.apply(this,arguments),e.type===`beforeunload`&&w[fe]&&typeof i==`string`?e.returnValue=i:i!=null&&!i&&e.preventDefault();return i};function me(e,t,n){let r=d(e,t);if(!r&&n&&d(n,t)&&(r={enumerable:!0,configurable:!0}),!r||!r.configurable)return;let i=S(`on`+t+`patched`);if(Object.hasOwn(e,i)&&e[i])return;delete r.writable,delete r.value;let a=r.get,o=r.set,s=t.slice(2),c=de[s];c||=de[s]=S(`ON_PROPERTY`+s),r.set=function(t){let n=this;!n&&e===w&&(n=w),n&&(typeof n[c]==`function`&&n.removeEventListener(s,pe),o?.call(n,null),n[c]=t,typeof t==`function`&&n.addEventListener(s,pe,!1))},r.get=function(){let n=this;if(!n&&e===w&&(n=w),!n)return null;let i=n[c];if(i)return i;if(a){let e=a.call(this);if(e)return r.set.call(this,e),typeof n[ie]==`function`&&n.removeAttribute(t),e}return null},f(e,t,r),e[i]=!0}function he(e,t,n){if(t)for(let r=0;r<t.length;r++)me(e,`on`+t[r],n);else{let t=[];for(let n in e)n.slice(0,2)==`on`&&t.push(n);for(let r=0;r<t.length;r++)me(e,t[r],n)}}var ge=S(`originalInstance`);function _e(e){let t=w[e];if(!t)return;w[S(e)]=t,w[e]=function(){let n=T(arguments,e);switch(n.length){case 0:this[ge]=new t;break;case 1:this[ge]=new t(n[0]);break;case 2:this[ge]=new t(n[0],n[1]);break;case 3:this[ge]=new t(n[0],n[1],n[2]);break;case 4:this[ge]=new t(n[0],n[1],n[2],n[3]);break;default:throw Error(`Arg list too long.`)}},be(w[e],t);let n=new t(function(){}),r;for(r in n)(e!==`XMLHttpRequest`||r!==`responseBlob`)&&(function(t){typeof n[t]==`function`?w[e].prototype[t]=function(){return this[ge][t].apply(this[ge],arguments)}:f(w[e].prototype,t,{set:function(n){typeof n==`function`?(this[ge][t]=ne(n,e+`.`+t),be(this[ge][t],n)):this[ge][t]=n},get:function(){return this[ge][t]}})})(r);for(r in t)r!==`prototype`&&Object.hasOwn(t,r)&&(w[e][r]=t[r])}function ve(e,t,n){let r=e;for(;r&&!Object.hasOwn(r,t);)r=p(r);!r&&e[t]&&(r=e);let i=S(t),a=null;if(r&&(!(a=r[i])||!Object.hasOwn(r,i))&&(a=r[i]=r[t],oe(r&&d(r,t)))){let e=n(a,i,t);r[t]=function(){return e(this,arguments)},be(r[t],a)}return a}function ye(e,t,n){let r=null;function i(e){let t=e.data;return t.args[t.cbIdx]=function(){e.invoke.apply(this,arguments)},r.apply(t.target,t.args),e}r=ve(e,t,e=>function(t,r){let a=n(t,r);return a.cbIdx>=0&&typeof r[a.cbIdx]==`function`?x(a.name,r[a.cbIdx],a,i):e.apply(t,r)})}function be(e,t){e[S(`OriginalDelegate`)]=t}function xe(e){return typeof e==`function`}function Se(e){return typeof e==`number`}var Ce={useG:!0},we=Object.create(null),Te={},Ee=RegExp(`^`+te+`(\\w+)(true|false)$`),De=S(`propagationStopped`),Oe=[`capture`,`once`,`passive`,`signal`];function ke(e,t){let n=(t?t(e):e)+ee,r=(t?t(e):e)+b,i=te+n,a=te+r;we[e]={[ee]:i,[b]:a}}function Ae(e,t,n,r){let i=r&&r.add||g,o=r&&r.rm||_,s=r&&r.listeners||`eventListeners`,c=r&&r.rmAll||`removeAllListeners`,l=S(i),u=`.`+i+`:`,d=function(e,t,n){if(e.isRemoved)return;let r=e.callback;typeof r==`object`&&r.handleEvent&&(e.callback=e=>r.handleEvent(e),e.originalDelegate=r);let i;try{e.invoke(e,t,[n])}catch(e){i=e}let a=e.options;if(a&&typeof a==`object`&&a.once){let r=e.originalDelegate?e.originalDelegate:e.callback;t[o].call(t,n.type,r,a)}return i};function f(n,r,i){if(r||=e.event,!r)return;let a=n||r.target||e,o=a[we[r.type][i?b:ee]];if(o){let e=[];if(o.length===1){let t=d(o[0],a,r);t&&e.push(t)}else{let t=o.slice();for(let n=0;n<t.length&&!(r&&r[De]===!0);n++){let i=d(t[n],a,r);i&&e.push(i)}}if(e.length===1)throw e[0];for(let n=0;n<e.length;n++){let r=e[n];t.nativeScheduleMicroTask(()=>{throw r})}}}let m=function(e){return f(this,e,!1)},h=function(e){return f(this,e,!0)};function v(t,n){if(!t)return!1;let r=!0;n&&n.useG!==void 0&&(r=n.useG);let d=n&&n.vh,f=!0;n&&n.chkDup!==void 0&&(f=n.chkDup);let g=!1;n&&n.rt!==void 0&&(g=n.rt);let _=t;for(;_&&!Object.hasOwn(_,i);)_=p(_);if(!_&&t[i]&&(_=t),!_||_[l])return!1;let v=n&&n.eventNameToString,y={},ne=_[l]=_[i],x=_[S(o)]=_[o],C=_[S(s)]=_[s],re=_[S(c)]=_[c],w;n&&n.prepend&&(w=_[S(n.prepend)]=_[n.prepend]);function ie(e,t){return t?typeof e==`boolean`?{capture:e,passive:!0}:e?(typeof e==`object`&&e.passive!==!1&&(e.passive=!0),e):{passive:!0}:e}let T=function(e){if(!y.isExisting)return ne.call(y.target,y.eventName,y.capture?h:m,y.options)},ae=function(e){if(!e.isRemoved){let t=we[e.eventName],n;t&&(n=t[e.capture?b:ee]);let r=n&&e.target[n];if(r){for(let t=0;t<r.length;t++)if(r[t]===e){r.splice(t,1),e.isRemoved=!0,e.removeAbortListener&&=(e.removeAbortListener(),null),r.length===0&&(e.allRemoved=!0,e.target[n]=null);break}}}if(e.allRemoved)return x.call(e.target,e.eventName,e.capture?h:m,e.options)},oe=function(e){return ne.call(y.target,y.eventName,e.invoke,y.options)},se=function(e){return w.call(y.target,y.eventName,e.invoke,y.options)},le=function(e){return x.call(e.target,e.eventName,e.invoke,e.options)},ue=r?T:oe,de=r?ae:le,fe=n?.diff||function(e,t){let n=typeof t;return n===`function`&&e.callback===t||n===`object`&&e.originalDelegate===t},pe=Zone[S(`UNPATCHED_EVENTS`)],me=e[S(`PASSIVE_EVENTS`)];function he(e){if(typeof e!=`object`||!e)return e;let t=a({},e);for(let n of Oe)!Object.hasOwn(t,n)&&n in e&&(t[n]=e[n]);return t}let ge=function(t,i,a,o,s=!1,c=!1){return function(){let l=this||e,u=arguments[0];n&&n.transferEventName&&(u=n.transferEventName(u));let p=arguments[1];if(!p||ce&&u===`uncaughtException`)return t.apply(this,arguments);let m=!1;if(typeof p!=`function`){if(!p.handleEvent)return t.apply(this,arguments);m=!0}if(d&&!d(t,p,l,arguments))return;let h=!!me&&me.indexOf(u)!==-1,g=ie(he(arguments[2]),h),_=g?.signal;if(_?.aborted)return;if(pe){for(let e=0;e<pe.length;e++)if(u===pe[e])return h?t.call(l,u,p,g):t.apply(this,arguments)}let te=g?typeof g==`boolean`||g.capture:!1,ne=g&&typeof g==`object`?g.once:!1,x=Zone.current,S=we[u];S||=(ke(u,v),we[u]);let C=S[te?b:ee],re=l[C],w=!1;if(re){if(w=!0,f){for(let e=0;e<re.length;e++)if(fe(re[e],p))return}}else re=l[C]=[];let T,ae=l.constructor.name,oe=Te[ae];oe&&(T=oe[u]),T||=ae+i+(v?v(u):u),y.options=g,ne&&(y.options.once=!1),y.target=l,y.capture=te,y.eventName=u,y.isExisting=w;let se=r?Ce:void 0;se&&(se.taskData=y),_&&(y.options.signal=void 0);let le=x.scheduleEventTask(T,p,se,a,o);if(_){y.options.signal=_;let e=()=>le.zone.cancelTask(le);t.call(_,`abort`,e,{once:!0}),le.removeAbortListener=()=>_.removeEventListener(`abort`,e)}if(y.target=null,se&&(se.taskData=null),ne&&(y.options.once=!0),typeof le.options!=`boolean`&&(le.options=g),le.target=l,le.capture=te,le.eventName=u,m&&(le.originalDelegate=p),c?re.unshift(le):re.push(le),s)return l}};return _[i]=ge(ne,u,ue,de,g),w&&(_.prependListener=ge(w,`.prependListener:`,se,de,g,!0)),_[o]=function(){let t=this||e,r=arguments[0];n&&n.transferEventName&&(r=n.transferEventName(r));let i=arguments[2],a=i?typeof i==`boolean`||i.capture:!1,o=arguments[1];if(!o)return x.apply(this,arguments);if(d&&!d(x,o,t,arguments))return;let s=we[r],c;s&&(c=s[a?b:ee]);let l=c&&t[c];if(l)for(let e=0;e<l.length;e++){let n=l[e];if(fe(n,o)){if(l.splice(e,1),n.isRemoved=!0,l.length===0&&(n.allRemoved=!0,t[c]=null,!a&&typeof r==`string`)){let e=te+`ON_PROPERTY`+r;t[e]=null}return n.zone.cancelTask(n),g?t:void 0}}return x.apply(this,arguments)},_[s]=function(){let t=this||e,r=arguments[0];n&&n.transferEventName&&(r=n.transferEventName(r));let i=[],a=je(t,v?v(r):r);for(let e=0;e<a.length;e++){let t=a[e],n=t.originalDelegate?t.originalDelegate:t.callback;i.push(n)}return i},_[c]=function(){let t=this||e,r=arguments[0];if(r){n&&n.transferEventName&&(r=n.transferEventName(r));let e=we[r];if(e){let n=e[ee],i=e[b],a=t[n],s=t[i];if(a){let e=a.slice();for(let t=0;t<e.length;t++){let n=e[t],i=n.originalDelegate?n.originalDelegate:n.callback;this[o].call(this,r,i,n.options)}}if(s){let e=s.slice();for(let t=0;t<e.length;t++){let n=e[t],i=n.originalDelegate?n.originalDelegate:n.callback;this[o].call(this,r,i,n.options)}}}}else{let e=Object.keys(t);for(let t=0;t<e.length;t++){let n=e[t],r=Ee.exec(n),i=r&&r[1];i&&i!==`removeListener`&&this[c].call(this,i)}this[c].call(this,`removeListener`)}if(g)return this},be(_[i],ne),be(_[o],x),re&&be(_[c],re),C&&be(_[s],C),!0}let y=[];for(let e=0;e<n.length;e++)y[e]=v(n[e],r);return y}function je(e,t){if(!t){let n=[];for(let r in e){let i=Ee.exec(r),a=i&&i[1];if(a&&(!t||a===t)){let t=e[r];if(t)for(let e=0;e<t.length;e++)n.push(t[e])}}return n}let n=we[t];n||=(ke(t),we[t]);let r=e[n[ee]],i=e[n[b]];return r?i?r.concat(i):r.slice():i?i.slice():[]}function Me(e,t){let n=e.Event;n&&n.prototype&&t.patchMethod(n.prototype,`stopImmediatePropagation`,e=>function(t,n){t[De]=!0,e&&e.apply(t,n)})}function Ne(e,t){t.patchMethod(e,`queueMicrotask`,e=>function(e,t){Zone.current.scheduleMicroTask(`queueMicrotask`,t[0])})}var Pe=S(`zoneTask`);function Fe(e,t,n,r){let i=null,a=null;t+=r,n+=r;let o={};function s(t){let n=t.data;n.args[0]=function(){return t.invoke.apply(this,arguments)};let r=i.apply(e,n.args);return Se(r)?n.handleId=r:(n.handle=r,n.isRefreshable=xe(r?.refresh)),t}function c(t){let{handle:n,handleId:r}=t.data;return a.call(e,n??r)}i=ve(e,t,n=>function(i,a){if(xe(a[0])){let e={isRefreshable:!1,isPeriodic:r===`Interval`,delay:r===`Timeout`||r===`Interval`?a[1]||0:void 0,args:a},n=a[0];a[0]=function(){try{return n.apply(this,arguments)}finally{let{handle:t,handleId:n,isPeriodic:r,isRefreshable:i}=e;!r&&!i&&(n?delete o[n]:t&&(t[Pe]=null))}};let i=x(t,a[0],e,s,c);if(!i)return i;let{handleId:l,handle:u,isRefreshable:d,isPeriodic:f}=i.data;if(l)o[l]=i;else if(u&&(u[Pe]=i,d&&!f)){let e=u.refresh;u.refresh=function(){let{zone:t,state:n}=i;return n===`notScheduled`?(i._state=`scheduled`,t._updateTaskCount(i,1)):n===`running`&&(i._state=`scheduling`),e.call(this)}}return u??l??i}return n.apply(e,a)}),a=ve(e,n,t=>function(n,r){let i=r[0],a;Se(i)?(a=o[i],delete o[i]):(a=i?.[Pe],a?i[Pe]=null:a=i),a?.type?a.cancelFn&&a.zone.cancelTask(a):t.apply(e,r)})}function Ie(e,t){let{isBrowser:n,isMix:r}=t.getGlobalObjects();(n||r)&&e.customElements&&`customElements`in e&&t.patchCallbacks(t,e.customElements,`customElements`,`define`,[`connectedCallback`,`disconnectedCallback`,`adoptedCallback`,`attributeChangedCallback`,`formAssociatedCallback`,`formDisabledCallback`,`formResetCallback`,`formStateRestoreCallback`])}function Le(e,t){if(Zone[t.symbol(`patchEventTarget`)])return;let{eventNames:n,zoneSymbolEventNames:r,TRUE_STR:i,FALSE_STR:a,ZONE_SYMBOL_PREFIX:o}=t.getGlobalObjects();for(let e=0;e<n.length;e++){let t=n[e],s=t+a,c=t+i,l=o+s,u=o+c;r[t]={},r[t][a]=l,r[t][i]=u}let s=e.EventTarget;if(s&&s.prototype)return t.patchEventTarget(e,t,[s&&s.prototype]),!0}function Re(e,t){t.patchEventPrototype(e,t)}function ze(e,t,n){if(!n||n.length===0)return t;let r=n.filter(t=>t.target===e);if(r.length===0)return t;let i=r[0].ignoreProperties;return t.filter(e=>i.indexOf(e)===-1)}function Be(e,t,n,r){e&&he(e,ze(e,t,n),r)}function Ve(e){return Object.getOwnPropertyNames(e).filter(e=>e.startsWith(`on`)&&e.length>2).map(e=>e.substring(2))}function He(e,t){if(ce&&!ue||Zone[e.symbol(`patchEvents`)])return;let n=t.__Zone_ignore_on_properties,r=[];if(le){let e=window;r=r.concat([`Document`,`SVGElement`,`Element`,`HTMLElement`,`HTMLBodyElement`,`HTMLMediaElement`,`HTMLFrameSetElement`,`HTMLFrameElement`,`HTMLIFrameElement`,`HTMLMarqueeElement`,`Worker`]),Be(e,Ve(e),n,p(e))}r=r.concat([`XMLHttpRequest`,`XMLHttpRequestEventTarget`,`IDBIndex`,`IDBRequest`,`IDBOpenDBRequest`,`IDBDatabase`,`IDBTransaction`,`IDBCursor`,`WebSocket`]);for(let e=0;e<r.length;e++){let i=t[r[e]];i!=null&&i.prototype&&Be(i.prototype,Ve(i.prototype),n)}}function Ue(e){e.__load_patch(`timers`,e=>{let t=`clear`;Fe(e,`set`,t,`Timeout`),Fe(e,`set`,t,`Interval`),Fe(e,`set`,t,`Immediate`)}),e.__load_patch(`requestAnimationFrame`,e=>{Fe(e,`request`,`cancel`,`AnimationFrame`),Fe(e,`mozRequest`,`mozCancel`,`AnimationFrame`),Fe(e,`webkitRequest`,`webkitCancel`,`AnimationFrame`)}),e.__load_patch(`blocking`,(e,t)=>{let n=[`alert`,`prompt`,`confirm`];for(let r=0;r<n.length;r++){let i=n[r];ve(e,i,(n,r,i)=>function(r,a){return t.current.run(n,e,a,i)})}}),e.__load_patch(`EventTarget`,(e,t,n)=>{Re(e,n),Le(e,n);let r=e.XMLHttpRequestEventTarget;r&&r.prototype&&n.patchEventTarget(e,n,[r.prototype])}),e.__load_patch(`MutationObserver`,(e,t,n)=>{_e(`MutationObserver`),_e(`WebKitMutationObserver`)}),e.__load_patch(`IntersectionObserver`,(e,t,n)=>{_e(`IntersectionObserver`)}),e.__load_patch(`FileReader`,(e,t,n)=>{_e(`FileReader`)}),e.__load_patch(`on_property`,(e,t,n)=>{He(n,e)}),e.__load_patch(`customElements`,(e,t,n)=>{Ie(e,n)}),e.__load_patch(`XHR`,(e,t)=>{c(e);let n=S(`xhrTask`),r=S(`xhrSync`),i=S(`xhrListener`),a=S(`xhrScheduled`),o=S(`xhrURL`),s=S(`xhrErrorBeforeScheduled`);function c(e){let c=e.XMLHttpRequest;if(!c)return;let l=c.prototype;function u(e){return e[n]}let d=l[v],f=l[y];if(!d){let t=e.XMLHttpRequestEventTarget;if(t){let e=t.prototype;d=e[v],f=e[y]}}let p=`readystatechange`,m=`scheduled`;function h(e){let r=e.data,o=r.target;o[a]=!1,o[s]=!1;let c=o[i];d||(d=o[v],f=o[y]),c&&f.call(o,p,c);let l=o[i]=()=>{if(o.readyState===o.DONE){if(!r.aborted&&o[a]&&e.state===m){let n=o[t.__symbol__(`loadfalse`)];if(o.status!==0&&n&&n.length>0){let i=e.invoke;e.invoke=function(){let n=o[t.__symbol__(`loadfalse`)];for(let t=0;t<n.length;t++)n[t]===e&&n.splice(t,1);!r.aborted&&e.state===m&&i.call(e)},n.push(e)}else e.invoke()}else!r.aborted&&o[a]===!1&&(o[s]=!0)}};return d.call(o,p,l),o[n]||(o[n]=e),ne.apply(o,r.args),o[a]=!0,e}function g(){}function _(e){let t=e.data;return t.aborted=!0,C.apply(t.target,t.args)}let b=ve(l,`open`,()=>function(e,t){return e[r]=t[2]==0,e[o]=t[1],b.apply(e,t)}),ee=S(`fetchTaskAborting`),te=S(`fetchTaskScheduling`),ne=ve(l,`send`,()=>function(e,n){if(t.current[te]===!0||e[r])return ne.apply(e,n);{let t={target:e,url:e[o],isPeriodic:!1,args:n,aborted:!1},r=x(`XMLHttpRequest.send`,g,t,h,_);e&&e[s]===!0&&!t.aborted&&r.state===m&&r.invoke()}}),C=ve(l,`abort`,()=>function(e,n){let r=u(e);if(r&&typeof r.type==`string`){if(r.cancelFn==null||r.data&&r.data.aborted)return;r.zone.cancelTask(r)}else if(t.current[ee]===!0)return C.apply(e,n)})}}),e.__load_patch(`geolocation`,e=>{e.navigator&&e.navigator.geolocation&&ae(e.navigator.geolocation,[`getCurrentPosition`,`watchPosition`])}),e.__load_patch(`PromiseRejectionEvent`,(e,t)=>{function n(t){return function(n){je(e,t).forEach(r=>{let i=e.PromiseRejectionEvent;if(i){let e=new i(t,{promise:n.promise,reason:n.rejection});r.invoke(e)}})}}e.PromiseRejectionEvent&&(t[S(`unhandledPromiseRejectionHandler`)]=n(`unhandledrejection`),t[S(`rejectionHandledHandler`)]=n(`rejectionhandled`))}),e.__load_patch(`queueMicrotask`,(e,t,n)=>{Ne(e,n)})}function We(e){e.__load_patch(`ZoneAwarePromise`,(e,t,n)=>{let r=Object.getOwnPropertyDescriptor,i=Object.defineProperty;function a(e){return e&&e.toString===Object.prototype.toString?(e.constructor&&e.constructor.name||``)+`: `+JSON.stringify(e):e?e.toString():Object.prototype.toString.call(e)}let o=n.symbol,s=[],c=e[o(`DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION`)]!==!1,l=o(`Promise`),u=o(`then`);n.onUnhandledError=e=>{if(n.showUncaughtError()){let t=e&&e.rejection;t&&e.zone&&e.task?console.error(`Unhandled Promise rejection:`,t instanceof Error?t.message:t,`; Zone:`,e.zone.name,`; Task:`,e.task&&e.task.source,`; Value:`,t,t instanceof Error?t.stack:void 0):console.error(e)}},n.microtaskDrainDone=()=>{for(;s.length;){let e=s.shift();try{e.zone.runGuarded(()=>{throw e.throwOriginal?e.rejection:e})}catch(e){f(e)}}};let d=o(`unhandledPromiseRejectionHandler`);function f(e){n.onUnhandledError(e);try{let n=t[d];typeof n==`function`&&n.call(this,e)}catch{}}function p(e){return e&&typeof e.then==`function`}function m(e){return e}function h(e){return T.reject(e)}let g=o(`state`),_=o(`value`),v=o(`finally`),y=o(`parentPromiseValue`),b=o(`parentPromiseState`);function ee(e,t){return n=>{try{x(e,t,n)}catch(t){x(e,!1,t)}}}let te=function(){let e=!1;return function(t){return function(){e||(e=!0,t.apply(null,arguments))}}},ne=o(`currentTaskTrace`);function x(e,r,o){let l=te();if(e===o)throw TypeError(`Promise resolved with itself`);if(e[g]===null){let u=null;try{(typeof o==`object`||typeof o==`function`)&&(u=o&&o.then)}catch(t){return l(()=>{x(e,!1,t)})(),e}if(r!==!1&&o instanceof T&&Object.hasOwn(o,g)&&Object.hasOwn(o,_)&&o[g]!==null)C(o),x(e,o[g],o[_]);else if(r!==!1&&typeof u==`function`)try{u.call(o,l(ee(e,r)),l(ee(e,!1)))}catch(t){l(()=>{x(e,!1,t)})()}else{e[g]=r;let l=e[_];if(e[_]=o,e[v]===v&&r===!0&&(e[g]=e[b],e[_]=e[y]),r===!1&&o instanceof Error){let e=t.currentTask&&t.currentTask.data&&t.currentTask.data.__creationTrace__;e&&i(o,ne,{configurable:!0,enumerable:!1,writable:!0,value:e})}for(let t=0;t<l.length;)re(e,l[t++],l[t++],l[t++],l[t++]);if(l.length==0&&r==0){e[g]=0;let r=o;try{throw Error(`Uncaught (in promise): `+a(o)+(o&&o.stack?`
`+o.stack:``))}catch(e){r=e}c&&(r.throwOriginal=!0),r.rejection=o,r.promise=e,r.zone=t.current,r.task=t.currentTask,s.push(r),n.scheduleMicroTask()}}}return e}let S=o(`rejectionHandledHandler`);function C(e){if(e[g]===0){try{let n=t[S];n&&typeof n==`function`&&n.call(this,{rejection:e[_],promise:e})}catch{}e[g]=!1;for(let t=0;t<s.length;t++)e===s[t].promise&&s.splice(t,1)}}function re(e,t,n,r,i){C(e);let a=e[g],o=a?typeof r==`function`?r:m:typeof i==`function`?i:h;t.scheduleMicroTask(`Promise.then`,()=>{try{let r=e[_],i=!!n&&v===n[v];i&&(n[y]=r,n[b]=a),x(n,!0,t.run(o,void 0,i&&o!==h&&o!==m?[]:[r]))}catch(e){x(n,!1,e)}},n)}let w=function(){},ie=e.AggregateError;class T{static toString(){return`function ZoneAwarePromise() { [native code] }`}static resolve(e){return e instanceof T?e:x(new this(null),!0,e)}static reject(e){return x(new this(null),!1,e)}static withResolvers(){let e={};return e.promise=new T((t,n)=>{e.resolve=t,e.reject=n}),e}static any(e){if(!e||typeof e[Symbol.iterator]!=`function`)return Promise.reject(new ie([],`All promises were rejected`));let t=[],n=0;try{for(let r of e)n++,t.push(T.resolve(r))}catch{return Promise.reject(new ie([],`All promises were rejected`))}if(n===0)return Promise.reject(new ie([],`All promises were rejected`));let r=!1,i=[];return new T((e,a)=>{for(let o=0;o<t.length;o++)t[o].then(t=>{r||(r=!0,e(t))},e=>{i.push(e),n--,n===0&&(r=!0,a(new ie(i,`All promises were rejected`)))})})}static race(e){let t,n,r=new this((e,r)=>{t=e,n=r});function i(e){t(e)}function a(e){n(e)}for(let t of e)p(t)||(t=this.resolve(t)),t.then(i,a);return r}static all(e){return T.allWithCallback(e)}static allSettled(e){return(this&&this.prototype instanceof T?this:T).allWithCallback(e,{thenCallback:e=>({status:`fulfilled`,value:e}),errorCallback:e=>({status:`rejected`,reason:e})})}static allWithCallback(e,t){let n,r,i=new this((e,t)=>{n=e,r=t}),a=2,o=0,s=[];for(let i of e){p(i)||(i=this.resolve(i));let e=o;try{i.then(r=>{s[e]=t?t.thenCallback(r):r,a--,a===0&&n(s)},i=>{t?(s[e]=t.errorCallback(i),a--,a===0&&n(s)):r(i)})}catch(e){r(e)}a++,o++}return a-=2,a===0&&n(s),i}constructor(e){let t=this;if(!(t instanceof T))throw Error(`Must be an instanceof Promise.`);t[g]=null,t[_]=[];try{let n=te();e&&e(n(ee(t,!0)),n(ee(t,!1)))}catch(e){x(t,!1,e)}}get[Symbol.toStringTag](){return`Promise`}get[Symbol.species](){return T}then(e,n){let r=this.constructor?.[Symbol.species];(!r||typeof r!=`function`)&&(r=this.constructor||T);let i=new r(w),a=t.current;return this[g]==null?this[_].push(a,i,e,n):re(this,a,i,e,n),i}catch(e){return this.then(null,e)}finally(e){let n=this.constructor?.[Symbol.species];(!n||typeof n!=`function`)&&(n=T);let r=new n(w);r[v]=v;let i=t.current;return this[g]==null?this[_].push(i,r,e,e):re(this,i,r,e,e),r}}T.resolve=T.resolve,T.reject=T.reject,T.race=T.race,T.all=T.all;let ae=e[l]=e.Promise;e.Promise=T;let oe=o(`thenPatched`);function se(e){let t=e.prototype,n=r(t,`then`);if(n&&(n.writable===!1||!n.configurable))return;let i=t.then;t[u]=i,e.prototype.then=function(e,t){return new T((e,t)=>{i.call(this,e,t)}).then(e,t)},e[oe]=!0}n.patchThen=se;function ce(e){return function(t,n){let r=e.apply(t,n);if(r instanceof T)return r;let i=r.constructor;return i[oe]||se(i),r}}if(ae){se(ae);let t=ae.try;t&&typeof t==`function`&&(T.try=t),ve(e,`fetch`,e=>ce(e))}return Promise[t.__symbol__(`uncaughtPromiseErrors`)]=s,T})}function Ge(e){e.__load_patch(`toString`,e=>{let t=Function.prototype.toString,n=S(`OriginalDelegate`),r=S(`Promise`),i=S(`Error`),a=function(){if(typeof this==`function`){let a=this[n];if(a)return typeof a==`function`?t.call(a):Object.prototype.toString.call(a);if(this===Promise){let n=e[r];if(n)return t.call(n)}if(this===Error){let n=e[i];if(n)return t.call(n)}}return t.call(this)};a[n]=t,Function.prototype.toString=a;let o=Object.prototype.toString;Object.prototype.toString=function(){return typeof Promise==`function`&&this instanceof Promise?`[object Promise]`:o.call(this)}})}function Ke(e,t,n,r,i){let a=Zone.__symbol__(r);if(t[a])return;let o=t[a]=t[r];t[r]=function(a,s,c){return s&&s.prototype&&i.forEach(function(t){let i=`${n}.${r}::`+t,a=s.prototype;try{if(Object.hasOwn(a,t)){let n=e.ObjectGetOwnPropertyDescriptor(a,t);n&&n.value?(n.value=e.wrapWithCurrentZone(n.value,i),e._redefineProperty(s.prototype,t,n)):a[t]&&(a[t]=e.wrapWithCurrentZone(a[t],i))}else a[t]&&(a[t]=e.wrapWithCurrentZone(a[t],i))}catch{}}),o.call(t,a,s,c)},e.attachOriginToPatched(t[r],o)}function qe(e){e.__load_patch(`util`,(e,t,n)=>{let r=Ve(e);n.patchOnProperties=he,n.patchMethod=ve,n.bindArguments=T,n.patchMacroTask=ye;let i=t.__symbol__(`BLACK_LISTED_EVENTS`),a=t.__symbol__(`UNPATCHED_EVENTS`);e[a]&&(e[i]=e[a]),e[i]&&(t[i]=t[a]=e[i]),n.patchEventPrototype=Me,n.patchEventTarget=Ae,n.ObjectDefineProperty=f,n.ObjectGetOwnPropertyDescriptor=d,n.ObjectCreate=m,n.ArraySlice=h,n.patchClass=_e,n.wrapWithCurrentZone=ne,n.filterProperties=ze,n.attachOriginToPatched=be,n._redefineProperty=Object.defineProperty,n.patchCallbacks=Ke,n.getGlobalObjects=()=>({globalSources:Te,zoneSymbolEventNames:we,eventNames:r,isBrowser:le,isMix:ue,isNode:ce,TRUE_STR:b,FALSE_STR:ee,ZONE_SYMBOL_PREFIX:te,ADD_EVENT_LISTENER_STR:g,REMOVE_EVENT_LISTENER_STR:_})})}function Je(e){We(e),Ge(e),qe(e)}var Ye=u();Je(Ye),Ue(Ye);var Xe=(function(e){return e[e.NONE=0]=`NONE`,e[e.HTML=1]=`HTML`,e[e.STYLE=2]=`STYLE`,e[e.SCRIPT=3]=`SCRIPT`,e[e.URL=4]=`URL`,e[e.RESOURCE_URL=5]=`RESOURCE_URL`,e[e.ATTRIBUTE_NO_BINDING=6]=`ATTRIBUTE_NO_BINDING`,e})(Xe||{}),Ze=(function(e){return e[e.None=0]=`None`,e[e.Const=1]=`Const`,e})(Ze||{}),Qe=class{modifiers;constructor(e=Ze.None){this.modifiers=e}hasModifier(e){return(this.modifiers&e)!==0}},$e=(function(e){return e[e.Dynamic=0]=`Dynamic`,e[e.Bool=1]=`Bool`,e[e.String=2]=`String`,e[e.Int=3]=`Int`,e[e.Number=4]=`Number`,e[e.Function=5]=`Function`,e[e.Inferred=6]=`Inferred`,e[e.None=7]=`None`,e})($e||{}),et=class extends Qe{name;constructor(e,t){super(t),this.name=e}visitType(e,t){return e.visitBuiltinType(this,t)}};$e.Dynamic;var tt=new et($e.Inferred);$e.Bool,$e.Int,$e.Number,$e.String,$e.Function,$e.None;var E=(function(e){return e[e.Equals=0]=`Equals`,e[e.NotEquals=1]=`NotEquals`,e[e.Assign=2]=`Assign`,e[e.Identical=3]=`Identical`,e[e.NotIdentical=4]=`NotIdentical`,e[e.Minus=5]=`Minus`,e[e.Plus=6]=`Plus`,e[e.Divide=7]=`Divide`,e[e.Multiply=8]=`Multiply`,e[e.Modulo=9]=`Modulo`,e[e.And=10]=`And`,e[e.Or=11]=`Or`,e[e.BitwiseOr=12]=`BitwiseOr`,e[e.BitwiseAnd=13]=`BitwiseAnd`,e[e.Lower=14]=`Lower`,e[e.LowerEquals=15]=`LowerEquals`,e[e.Bigger=16]=`Bigger`,e[e.BiggerEquals=17]=`BiggerEquals`,e[e.NullishCoalesce=18]=`NullishCoalesce`,e[e.Exponentiation=19]=`Exponentiation`,e[e.In=20]=`In`,e[e.InstanceOf=21]=`InstanceOf`,e[e.AdditionAssignment=22]=`AdditionAssignment`,e[e.SubtractionAssignment=23]=`SubtractionAssignment`,e[e.MultiplicationAssignment=24]=`MultiplicationAssignment`,e[e.DivisionAssignment=25]=`DivisionAssignment`,e[e.RemainderAssignment=26]=`RemainderAssignment`,e[e.ExponentiationAssignment=27]=`ExponentiationAssignment`,e[e.AndAssignment=28]=`AndAssignment`,e[e.OrAssignment=29]=`OrAssignment`,e[e.NullishCoalesceAssignment=30]=`NullishCoalesceAssignment`,e})(E||{});function nt(e,t){return e==null||t==null?e==t:e.isEquivalent(t)}function rt(e,t,n){let r=e.length;if(r!==t.length)return!1;for(let i=0;i<r;i++)if(!n(e[i],t[i]))return!1;return!0}function it(e,t){return rt(e,t,(e,t)=>e.isEquivalent(t))}var at=class{leadingComments;type;sourceSpan;constructor(e,t,n){this.leadingComments=n,this.type=e||null,this.sourceSpan=t||null}prop(e,t){return new ht(this,e,null,t)}key(e,t,n){return new gt(this,e,t,n)}callFn(e,t,n,r){return new ct(this,e,null,t,n,r)}instantiate(e,t,n,r){return new lt(this,e,t,n)}conditional(e,t=null,n,r){return new pt(this,e,t,null,n)}equals(e,t){return new mt(E.Equals,this,e,null,t)}notEquals(e,t){return new mt(E.NotEquals,this,e,null,t)}identical(e,t){return new mt(E.Identical,this,e,null,t)}notIdentical(e,t){return new mt(E.NotIdentical,this,e,null,t)}minus(e,t){return new mt(E.Minus,this,e,null,t)}plus(e,t){return new mt(E.Plus,this,e,null,t)}divide(e,t){return new mt(E.Divide,this,e,null,t)}multiply(e,t){return new mt(E.Multiply,this,e,null,t)}modulo(e,t){return new mt(E.Modulo,this,e,null,t)}power(e,t){return new mt(E.Exponentiation,this,e,null,t)}and(e,t){return new mt(E.And,this,e,null,t)}bitwiseOr(e,t){return new mt(E.BitwiseOr,this,e,null,t)}bitwiseAnd(e,t){return new mt(E.BitwiseAnd,this,e,null,t)}or(e,t){return new mt(E.Or,this,e,null,t)}lower(e,t){return new mt(E.Lower,this,e,null,t)}lowerEquals(e,t){return new mt(E.LowerEquals,this,e,null,t)}bigger(e,t){return new mt(E.Bigger,this,e,null,t)}biggerEquals(e,t){return new mt(E.BiggerEquals,this,e,null,t)}isBlank(e){return this.equals(xt,e)}nullishCoalesce(e,t){return new mt(E.NullishCoalesce,this,e,null,t)}toStmt(e){return new wt(this,null,e)}},ot=class e extends at{name;constructor(e,t,n,r){super(t,n,r),this.name=e}isEquivalent(t){return t instanceof e&&this.name===t.name}isConstant(){return!1}visitExpression(e,t){return e.visitReadVarExpr(this,t)}clone(){return new e(this.name,this.type,this.sourceSpan)}set(e){return new mt(E.Assign,this,e,null,this.sourceSpan)}},st=class e extends at{expr;constructor(e,t,n,r){super(t,n,r),this.expr=e}visitExpression(e,t){return e.visitTypeofExpr(this,t)}isEquivalent(t){return t instanceof e&&t.expr.isEquivalent(this.expr)}isConstant(){return this.expr.isConstant()}clone(){return new e(this.expr.clone())}},ct=class e extends at{fn;args;pure;isOptional;constructor(e,t,n,r,i=!1,a,o=!1){super(n,r,a),this.fn=e,this.args=t,this.pure=i,this.isOptional=o}get receiver(){return this.fn}isEquivalent(t){return t instanceof e&&this.fn.isEquivalent(t.fn)&&it(this.args,t.args)&&this.pure===t.pure}isConstant(){return!1}visitExpression(e,t){return e.visitInvokeFunctionExpr(this,t)}clone(){return new e(this.fn.clone(),this.args.map(e=>e.clone()),this.type,this.sourceSpan,this.pure,[],this.isOptional)}},lt=class e extends at{classExpr;args;constructor(e,t,n,r,i){super(n,r,i),this.classExpr=e,this.args=t}isEquivalent(t){return t instanceof e&&this.classExpr.isEquivalent(t.classExpr)&&it(this.args,t.args)}isConstant(){return!1}visitExpression(e,t){return e.visitInstantiateExpr(this,t)}clone(){return new e(this.classExpr.clone(),this.args.map(e=>e.clone()),this.type,this.sourceSpan)}},ut=class e extends at{body;flags;constructor(e,t,n,r){super(null,n,r),this.body=e,this.flags=t}isEquivalent(t){return t instanceof e&&this.body===t.body&&this.flags===t.flags}isConstant(){return!0}visitExpression(e,t){return e.visitRegularExpressionLiteral(this,t)}clone(){return new e(this.body,this.flags,this.sourceSpan)}},dt=class e extends at{value;constructor(e,t,n,r){super(t,n,r),this.value=e}isEquivalent(t){return t instanceof e&&this.value===t.value}isConstant(){return!0}visitExpression(e,t){return e.visitLiteralExpr(this,t)}clone(){return new e(this.value,this.type,this.sourceSpan)}},ft=class e extends at{value;typeParams;constructor(e,t,n=null,r,i){super(t,r,i),this.value=e,this.typeParams=n}isEquivalent(t){return t instanceof e&&this.value.name===t.value.name&&this.value.moduleName===t.value.moduleName}isConstant(){return!1}visitExpression(e,t){return e.visitExternalExpr(this,t)}clone(){return new e(this.value,this.type,this.typeParams,this.sourceSpan)}},pt=class e extends at{condition;falseCase;trueCase;constructor(e,t,n=null,r,i,a){super(r||t.type,i,a),this.condition=e,this.falseCase=n,this.trueCase=t}isEquivalent(t){return t instanceof e&&this.condition.isEquivalent(t.condition)&&this.trueCase.isEquivalent(t.trueCase)&&nt(this.falseCase,t.falseCase)}isConstant(){return!1}visitExpression(e,t){return e.visitConditionalExpr(this,t)}clone(){return new e(this.condition.clone(),this.trueCase.clone(),this.falseCase?.clone(),this.type,this.sourceSpan)}},mt=class e extends at{operator;rhs;lhs;constructor(e,t,n,r,i,a){super(r||t.type,i,a),this.operator=e,this.rhs=n,this.lhs=t}isEquivalent(t){return t instanceof e&&this.operator===t.operator&&this.lhs.isEquivalent(t.lhs)&&this.rhs.isEquivalent(t.rhs)}isConstant(){return!1}visitExpression(e,t){return e.visitBinaryOperatorExpr(this,t)}clone(){return new e(this.operator,this.lhs.clone(),this.rhs.clone(),this.type,this.sourceSpan)}isAssignment(){let e=this.operator;return e===E.Assign||e===E.AdditionAssignment||e===E.SubtractionAssignment||e===E.MultiplicationAssignment||e===E.DivisionAssignment||e===E.RemainderAssignment||e===E.ExponentiationAssignment||e===E.AndAssignment||e===E.OrAssignment||e===E.NullishCoalesceAssignment}},ht=class e extends at{receiver;name;isOptional;constructor(e,t,n,r,i,a=!1){super(n,r,i),this.receiver=e,this.name=t,this.isOptional=a}get index(){return this.name}isEquivalent(t){return t instanceof e&&this.receiver.isEquivalent(t.receiver)&&this.name===t.name&&this.isOptional===t.isOptional}isConstant(){return!1}visitExpression(e,t){return e.visitReadPropExpr(this,t)}set(e){return new mt(E.Assign,this.receiver.prop(this.name),e,null,this.sourceSpan)}clone(){return new e(this.receiver.clone(),this.name,this.type,this.sourceSpan,[],this.isOptional)}},gt=class e extends at{receiver;index;isOptional;constructor(e,t,n,r,i,a=!1){super(n,r,i),this.receiver=e,this.index=t,this.isOptional=a}isEquivalent(t){return t instanceof e&&this.receiver.isEquivalent(t.receiver)&&this.index.isEquivalent(t.index)&&this.isOptional===t.isOptional}isConstant(){return!1}visitExpression(e,t){return e.visitReadKeyExpr(this,t)}set(e){return new mt(E.Assign,this.receiver.key(this.index),e,null,this.sourceSpan)}clone(){return new e(this.receiver.clone(),this.index.clone(),this.type,this.sourceSpan,[],this.isOptional)}},_t=class e extends at{entries;constructor(e,t,n,r){super(t,n,r),this.entries=e}isConstant(){return this.entries.every(e=>e.isConstant())}isEquivalent(t){return t instanceof e&&it(this.entries,t.entries)}visitExpression(e,t){return e.visitLiteralArrayExpr(this,t)}clone(){return new e(this.entries.map(e=>e.clone()),this.type,this.sourceSpan)}},vt=class e{expression;constructor(e){this.expression=e}isEquivalent(t){return t instanceof e&&this.expression.isEquivalent(t.expression)}clone(){return new e(this.expression.clone())}isConstant(){return this.expression.isConstant()}},yt=class e extends at{entries;valueType=null;constructor(e,t,n,r){super(t,n,r),this.entries=e,t&&(this.valueType=t.valueType)}isEquivalent(t){return t instanceof e&&it(this.entries,t.entries)}isConstant(){return this.entries.every(e=>e.isConstant())}visitExpression(e,t){return e.visitLiteralMapExpr(this,t)}clone(){let t=this.entries.map(e=>e.clone());return new e(t,this.type,this.sourceSpan)}},bt=class e extends at{expression;constructor(e,t,n){super(null,t,n),this.expression=e}isEquivalent(t){return t instanceof e&&this.expression.isEquivalent(t.expression)}isConstant(){return this.expression.isConstant()}visitExpression(e,t){return e.visitSpreadElementExpr(this,t)}clone(){return new e(this.expression.clone(),this.sourceSpan)}},xt=new dt(null,tt,null),St=(function(e){return e[e.None=0]=`None`,e[e.Final=1]=`Final`,e[e.Private=2]=`Private`,e[e.Exported=4]=`Exported`,e[e.Static=8]=`Static`,e})(St||{}),Ct=class{modifiers;sourceSpan;leadingComments;constructor(e=St.None,t=null,n){this.modifiers=e,this.sourceSpan=t,this.leadingComments=n}hasModifier(e){return(this.modifiers&e)!==0}addLeadingComment(e){this.leadingComments=this.leadingComments??[],this.leadingComments.push(e)}},wt=class e extends Ct{expr;constructor(e,t,n){super(St.None,t,n),this.expr=e}isEquivalent(t){return t instanceof e&&this.expr.isEquivalent(t.expr)}visitStatement(e,t){return e.visitExpressionStmt(this,t)}};(class e{static INSTANCE=new e;keyOf(e){if(e instanceof dt&&typeof e.value==`string`)return`"${e.value}"`;if(e instanceof dt)return String(e.value);if(e instanceof ut)return`/${e.body}/${e.flags??``}`;if(e instanceof _t){let t=[];for(let n of e.entries)t.push(this.keyOf(n));return`[${t.join(`,`)}]`}if(e instanceof yt){let t=[];for(let n of e.entries)if(n instanceof vt)t.push(`...`+this.keyOf(n.expression));else{let e=n.key;n.quoted&&(e=`"${e}"`),t.push(e+`:`+this.keyOf(n.value))}return`{${t.join(`,`)}}`}if(e instanceof ft)return`import("${e.value.moduleName}", ${e.value.name})`;if(e instanceof ot)return`read(${e.name})`;if(e instanceof st)return`typeof(${this.keyOf(e.expr)})`;if(e instanceof bt)return`...${this.keyOf(e.expression)}`;throw Error(`${this.constructor.name} does not handle expressions of type ${e.constructor.name}`)}});var D=`@angular/core`,O=(()=>{class e{static core={name:null,moduleName:D};static namespaceHTML={name:`ɵɵnamespaceHTML`,moduleName:D};static namespaceMathML={name:`ɵɵnamespaceMathML`,moduleName:D};static namespaceSVG={name:`ɵɵnamespaceSVG`,moduleName:D};static element={name:`ɵɵelement`,moduleName:D};static elementStart={name:`ɵɵelementStart`,moduleName:D};static elementEnd={name:`ɵɵelementEnd`,moduleName:D};static foreignComponent={name:`ɵɵforeignComponent`,moduleName:D};static foreignContent={name:`ɵɵforeignContent`,moduleName:D};static foreignContentFn={name:`ɵɵforeignContentFn`,moduleName:D};static domElement={name:`ɵɵdomElement`,moduleName:D};static domElementStart={name:`ɵɵdomElementStart`,moduleName:D};static domElementEnd={name:`ɵɵdomElementEnd`,moduleName:D};static domElementContainer={name:`ɵɵdomElementContainer`,moduleName:D};static domElementContainerStart={name:`ɵɵdomElementContainerStart`,moduleName:D};static domElementContainerEnd={name:`ɵɵdomElementContainerEnd`,moduleName:D};static domTemplate={name:`ɵɵdomTemplate`,moduleName:D};static domListener={name:`ɵɵdomListener`,moduleName:D};static advance={name:`ɵɵadvance`,moduleName:D};static syntheticHostProperty={name:`ɵɵsyntheticHostProperty`,moduleName:D};static syntheticHostListener={name:`ɵɵsyntheticHostListener`,moduleName:D};static attribute={name:`ɵɵattribute`,moduleName:D};static classProp={name:`ɵɵclassProp`,moduleName:D};static elementContainerStart={name:`ɵɵelementContainerStart`,moduleName:D};static elementContainerEnd={name:`ɵɵelementContainerEnd`,moduleName:D};static elementContainer={name:`ɵɵelementContainer`,moduleName:D};static styleMap={name:`ɵɵstyleMap`,moduleName:D};static classMap={name:`ɵɵclassMap`,moduleName:D};static styleProp={name:`ɵɵstyleProp`,moduleName:D};static interpolate={name:`ɵɵinterpolate`,moduleName:D};static interpolate1={name:`ɵɵinterpolate1`,moduleName:D};static interpolate2={name:`ɵɵinterpolate2`,moduleName:D};static interpolate3={name:`ɵɵinterpolate3`,moduleName:D};static interpolate4={name:`ɵɵinterpolate4`,moduleName:D};static interpolate5={name:`ɵɵinterpolate5`,moduleName:D};static interpolate6={name:`ɵɵinterpolate6`,moduleName:D};static interpolate7={name:`ɵɵinterpolate7`,moduleName:D};static interpolate8={name:`ɵɵinterpolate8`,moduleName:D};static interpolateV={name:`ɵɵinterpolateV`,moduleName:D};static nextContext={name:`ɵɵnextContext`,moduleName:D};static resetView={name:`ɵɵresetView`,moduleName:D};static templateCreate={name:`ɵɵtemplate`,moduleName:D};static defer={name:`ɵɵdefer`,moduleName:D};static deferWhen={name:`ɵɵdeferWhen`,moduleName:D};static deferOnIdle={name:`ɵɵdeferOnIdle`,moduleName:D};static deferOnImmediate={name:`ɵɵdeferOnImmediate`,moduleName:D};static deferOnTimer={name:`ɵɵdeferOnTimer`,moduleName:D};static deferOnHover={name:`ɵɵdeferOnHover`,moduleName:D};static deferOnInteraction={name:`ɵɵdeferOnInteraction`,moduleName:D};static deferOnViewport={name:`ɵɵdeferOnViewport`,moduleName:D};static deferPrefetchWhen={name:`ɵɵdeferPrefetchWhen`,moduleName:D};static deferPrefetchOnIdle={name:`ɵɵdeferPrefetchOnIdle`,moduleName:D};static deferPrefetchOnImmediate={name:`ɵɵdeferPrefetchOnImmediate`,moduleName:D};static deferPrefetchOnTimer={name:`ɵɵdeferPrefetchOnTimer`,moduleName:D};static deferPrefetchOnHover={name:`ɵɵdeferPrefetchOnHover`,moduleName:D};static deferPrefetchOnInteraction={name:`ɵɵdeferPrefetchOnInteraction`,moduleName:D};static deferPrefetchOnViewport={name:`ɵɵdeferPrefetchOnViewport`,moduleName:D};static deferHydrateWhen={name:`ɵɵdeferHydrateWhen`,moduleName:D};static deferHydrateNever={name:`ɵɵdeferHydrateNever`,moduleName:D};static deferHydrateOnIdle={name:`ɵɵdeferHydrateOnIdle`,moduleName:D};static deferHydrateOnImmediate={name:`ɵɵdeferHydrateOnImmediate`,moduleName:D};static deferHydrateOnTimer={name:`ɵɵdeferHydrateOnTimer`,moduleName:D};static deferHydrateOnHover={name:`ɵɵdeferHydrateOnHover`,moduleName:D};static deferHydrateOnInteraction={name:`ɵɵdeferHydrateOnInteraction`,moduleName:D};static deferHydrateOnViewport={name:`ɵɵdeferHydrateOnViewport`,moduleName:D};static deferEnableTimerScheduling={name:`ɵɵdeferEnableTimerScheduling`,moduleName:D};static enableIncrementalHydrationRuntime={name:`ɵɵenableIncrementalHydrationRuntime`,moduleName:D};static conditionalCreate={name:`ɵɵconditionalCreate`,moduleName:D};static conditionalBranchCreate={name:`ɵɵconditionalBranchCreate`,moduleName:D};static conditional={name:`ɵɵconditional`,moduleName:D};static repeater={name:`ɵɵrepeater`,moduleName:D};static repeaterCreate={name:`ɵɵrepeaterCreate`,moduleName:D};static repeaterTrackByIndex={name:`ɵɵrepeaterTrackByIndex`,moduleName:D};static repeaterTrackByIdentity={name:`ɵɵrepeaterTrackByIdentity`,moduleName:D};static componentInstance={name:`ɵɵcomponentInstance`,moduleName:D};static text={name:`ɵɵtext`,moduleName:D};static enableBindings={name:`ɵɵenableBindings`,moduleName:D};static disableBindings={name:`ɵɵdisableBindings`,moduleName:D};static getCurrentView={name:`ɵɵgetCurrentView`,moduleName:D};static textInterpolate={name:`ɵɵtextInterpolate`,moduleName:D};static textInterpolate1={name:`ɵɵtextInterpolate1`,moduleName:D};static textInterpolate2={name:`ɵɵtextInterpolate2`,moduleName:D};static textInterpolate3={name:`ɵɵtextInterpolate3`,moduleName:D};static textInterpolate4={name:`ɵɵtextInterpolate4`,moduleName:D};static textInterpolate5={name:`ɵɵtextInterpolate5`,moduleName:D};static textInterpolate6={name:`ɵɵtextInterpolate6`,moduleName:D};static textInterpolate7={name:`ɵɵtextInterpolate7`,moduleName:D};static textInterpolate8={name:`ɵɵtextInterpolate8`,moduleName:D};static textInterpolateV={name:`ɵɵtextInterpolateV`,moduleName:D};static restoreView={name:`ɵɵrestoreView`,moduleName:D};static pureFunction0={name:`ɵɵpureFunction0`,moduleName:D};static pureFunction1={name:`ɵɵpureFunction1`,moduleName:D};static pureFunction2={name:`ɵɵpureFunction2`,moduleName:D};static pureFunction3={name:`ɵɵpureFunction3`,moduleName:D};static pureFunction4={name:`ɵɵpureFunction4`,moduleName:D};static pureFunction5={name:`ɵɵpureFunction5`,moduleName:D};static pureFunction6={name:`ɵɵpureFunction6`,moduleName:D};static pureFunction7={name:`ɵɵpureFunction7`,moduleName:D};static pureFunction8={name:`ɵɵpureFunction8`,moduleName:D};static pureFunctionV={name:`ɵɵpureFunctionV`,moduleName:D};static pipeBind1={name:`ɵɵpipeBind1`,moduleName:D};static pipeBind2={name:`ɵɵpipeBind2`,moduleName:D};static pipeBind3={name:`ɵɵpipeBind3`,moduleName:D};static pipeBind4={name:`ɵɵpipeBind4`,moduleName:D};static pipeBindV={name:`ɵɵpipeBindV`,moduleName:D};static domProperty={name:`ɵɵdomProperty`,moduleName:D};static ariaProperty={name:`ɵɵariaProperty`,moduleName:D};static property={name:`ɵɵproperty`,moduleName:D};static control={name:`ɵɵcontrol`,moduleName:D};static controlCreate={name:`ɵɵcontrolCreate`,moduleName:D};static animationEnterListener={name:`ɵɵanimateEnterListener`,moduleName:D};static animationLeaveListener={name:`ɵɵanimateLeaveListener`,moduleName:D};static animationEnter={name:`ɵɵanimateEnter`,moduleName:D};static animationLeave={name:`ɵɵanimateLeave`,moduleName:D};static i18n={name:`ɵɵi18n`,moduleName:D};static i18nAttributes={name:`ɵɵi18nAttributes`,moduleName:D};static i18nExp={name:`ɵɵi18nExp`,moduleName:D};static i18nStart={name:`ɵɵi18nStart`,moduleName:D};static i18nEnd={name:`ɵɵi18nEnd`,moduleName:D};static i18nApply={name:`ɵɵi18nApply`,moduleName:D};static i18nPostprocess={name:`ɵɵi18nPostprocess`,moduleName:D};static pipe={name:`ɵɵpipe`,moduleName:D};static projection={name:`ɵɵprojection`,moduleName:D};static projectionDef={name:`ɵɵprojectionDef`,moduleName:D};static reference={name:`ɵɵreference`,moduleName:D};static inject={name:`ɵɵinject`,moduleName:D};static injectAttribute={name:`ɵɵinjectAttribute`,moduleName:D};static directiveInject={name:`ɵɵdirectiveInject`,moduleName:D};static invalidFactory={name:`ɵɵinvalidFactory`,moduleName:D};static invalidFactoryDep={name:`ɵɵinvalidFactoryDep`,moduleName:D};static templateRefExtractor={name:`ɵɵtemplateRefExtractor`,moduleName:D};static forwardRef={name:`forwardRef`,moduleName:D};static resolveForwardRef={name:`resolveForwardRef`,moduleName:D};static replaceMetadata={name:`ɵɵreplaceMetadata`,moduleName:D};static getReplaceMetadataURL={name:`ɵɵgetReplaceMetadataURL`,moduleName:D};static ɵɵdefineInjectable={name:`ɵɵdefineInjectable`,moduleName:D};static declareInjectable={name:`ɵɵngDeclareInjectable`,moduleName:D};static InjectableDeclaration={name:`ɵɵInjectableDeclaration`,moduleName:D};static defineService={name:`ɵɵdefineService`,moduleName:D};static declareService={name:`ɵɵngDeclareService`,moduleName:D};static resolveWindow={name:`ɵɵresolveWindow`,moduleName:D};static resolveDocument={name:`ɵɵresolveDocument`,moduleName:D};static resolveBody={name:`ɵɵresolveBody`,moduleName:D};static getComponentDepsFactory={name:`ɵɵgetComponentDepsFactory`,moduleName:D};static defineComponent={name:`ɵɵdefineComponent`,moduleName:D};static declareComponent={name:`ɵɵngDeclareComponent`,moduleName:D};static setComponentScope={name:`ɵɵsetComponentScope`,moduleName:D};static ChangeDetectionStrategy={name:`ChangeDetectionStrategy`,moduleName:D};static ViewEncapsulation={name:`ViewEncapsulation`,moduleName:D};static ComponentDeclaration={name:`ɵɵComponentDeclaration`,moduleName:D};static FactoryDeclaration={name:`ɵɵFactoryDeclaration`,moduleName:D};static declareFactory={name:`ɵɵngDeclareFactory`,moduleName:D};static FactoryTarget={name:`ɵɵFactoryTarget`,moduleName:D};static defineDirective={name:`ɵɵdefineDirective`,moduleName:D};static declareDirective={name:`ɵɵngDeclareDirective`,moduleName:D};static DirectiveDeclaration={name:`ɵɵDirectiveDeclaration`,moduleName:D};static InjectorDef={name:`ɵɵInjectorDef`,moduleName:D};static InjectorDeclaration={name:`ɵɵInjectorDeclaration`,moduleName:D};static defineInjector={name:`ɵɵdefineInjector`,moduleName:D};static declareInjector={name:`ɵɵngDeclareInjector`,moduleName:D};static NgModuleDeclaration={name:`ɵɵNgModuleDeclaration`,moduleName:D};static ModuleWithProviders={name:`ModuleWithProviders`,moduleName:D};static defineNgModule={name:`ɵɵdefineNgModule`,moduleName:D};static declareNgModule={name:`ɵɵngDeclareNgModule`,moduleName:D};static setNgModuleScope={name:`ɵɵsetNgModuleScope`,moduleName:D};static registerNgModuleType={name:`ɵɵregisterNgModuleType`,moduleName:D};static PipeDeclaration={name:`ɵɵPipeDeclaration`,moduleName:D};static definePipe={name:`ɵɵdefinePipe`,moduleName:D};static declarePipe={name:`ɵɵngDeclarePipe`,moduleName:D};static declareClassMetadata={name:`ɵɵngDeclareClassMetadata`,moduleName:D};static declareClassMetadataAsync={name:`ɵɵngDeclareClassMetadataAsync`,moduleName:D};static setClassMetadata={name:`ɵsetClassMetadata`,moduleName:D};static setClassMetadataAsync={name:`ɵsetClassMetadataAsync`,moduleName:D};static setClassDebugInfo={name:`ɵsetClassDebugInfo`,moduleName:D};static queryRefresh={name:`ɵɵqueryRefresh`,moduleName:D};static viewQuery={name:`ɵɵviewQuery`,moduleName:D};static loadQuery={name:`ɵɵloadQuery`,moduleName:D};static contentQuery={name:`ɵɵcontentQuery`,moduleName:D};static viewQuerySignal={name:`ɵɵviewQuerySignal`,moduleName:D};static contentQuerySignal={name:`ɵɵcontentQuerySignal`,moduleName:D};static queryAdvance={name:`ɵɵqueryAdvance`,moduleName:D};static twoWayProperty={name:`ɵɵtwoWayProperty`,moduleName:D};static twoWayBindingSet={name:`ɵɵtwoWayBindingSet`,moduleName:D};static twoWayListener={name:`ɵɵtwoWayListener`,moduleName:D};static declareLet={name:`ɵɵdeclareLet`,moduleName:D};static storeLet={name:`ɵɵstoreLet`,moduleName:D};static readContextLet={name:`ɵɵreadContextLet`,moduleName:D};static arrowFunction={name:`ɵɵarrowFunction`,moduleName:D};static attachSourceLocations={name:`ɵɵattachSourceLocations`,moduleName:D};static NgOnChangesFeature={name:`ɵɵNgOnChangesFeature`,moduleName:D};static ControlFeature={name:`ɵɵControlFeature`,moduleName:D};static InheritDefinitionFeature={name:`ɵɵInheritDefinitionFeature`,moduleName:D};static ProvidersFeature={name:`ɵɵProvidersFeature`,moduleName:D};static HostDirectivesFeature={name:`ɵɵHostDirectivesFeature`,moduleName:D};static ExternalStylesFeature={name:`ɵɵExternalStylesFeature`,moduleName:D};static listener={name:`ɵɵlistener`,moduleName:D};static getInheritedFactory={name:`ɵɵgetInheritedFactory`,moduleName:D};static sanitizeHtml={name:`ɵɵsanitizeHtml`,moduleName:D};static sanitizeStyle={name:`ɵɵsanitizeStyle`,moduleName:D};static validateAttribute={name:`ɵɵvalidateAttribute`,moduleName:D};static sanitizeResourceUrl={name:`ɵɵsanitizeResourceUrl`,moduleName:D};static sanitizeScript={name:`ɵɵsanitizeScript`,moduleName:D};static sanitizeUrl={name:`ɵɵsanitizeUrl`,moduleName:D};static sanitizeUrlOrResourceUrl={name:`ɵɵsanitizeUrlOrResourceUrl`,moduleName:D};static trustConstantHtml={name:`ɵɵtrustConstantHtml`,moduleName:D};static trustConstantResourceUrl={name:`ɵɵtrustConstantResourceUrl`,moduleName:D};static inputDecorator={name:`Input`,moduleName:D};static outputDecorator={name:`Output`,moduleName:D};static viewChildDecorator={name:`ViewChild`,moduleName:D};static viewChildrenDecorator={name:`ViewChildren`,moduleName:D};static contentChildDecorator={name:`ContentChild`,moduleName:D};static contentChildrenDecorator={name:`ContentChildren`,moduleName:D};static InputSignalBrandWriteType={name:`ɵINPUT_SIGNAL_BRAND_WRITE_TYPE`,moduleName:D};static UnwrapDirectiveSignalInputs={name:`ɵUnwrapDirectiveSignalInputs`,moduleName:D};static unwrapWritableSignal={name:`ɵunwrapWritableSignal`,moduleName:D};static assertType={name:`ɵassertType`,moduleName:D}}return e})();E.And,E.Bigger,E.BiggerEquals,E.BitwiseOr,E.BitwiseAnd,E.Divide,E.Assign,E.Equals,E.Identical,E.Lower,E.LowerEquals,E.Minus,E.Modulo,E.Exponentiation,E.Multiply,E.NotEquals,E.NotIdentical,E.NullishCoalesce,E.Or,E.Plus,E.In,E.InstanceOf,E.AdditionAssignment,E.SubtractionAssignment,E.MultiplicationAssignment,E.DivisionAssignment,E.RemainderAssignment,E.ExponentiationAssignment,E.AndAssignment,E.OrAssignment,E.NullishCoalesceAssignment;var Tt=class{span;sourceSpan;constructor(e,t){this.span=e,this.sourceSpan=t}toString(){return`AST`}},Et=class extends Tt{receiver;args;argumentSpan;constructor(e,t,n,r,i){super(e,t),this.receiver=n,this.args=r,this.argumentSpan=i}visit(e,t=null){return e.visitCall(this,t)}},Dt=(function(e){return e[e.Property=0]=`Property`,e[e.Attribute=1]=`Attribute`,e[e.Class=2]=`Class`,e[e.Style=3]=`Style`,e[e.LegacyAnimation=4]=`LegacyAnimation`,e[e.TwoWay=5]=`TwoWay`,e[e.Animation=6]=`Animation`,e})(Dt||{}),Ot=`(:(where|is)\\()?`,kt=`-shadowcsshost`,At=`-shadowcsscontext`,jt=`[^)(]*`,Mt=String.raw`(?:\(${jt}\)|${jt})+?`,Nt=String.raw`(?:\(${Mt}\)|${jt})+?`,Pt=String.raw`(?:\((${Nt})\))`;String.raw`(:nth-[-\w]+)`+Pt,kt+Pt+``,`${Ot}`,At+Pt+``;var k=(function(e){return e[e.ListEnd=0]=`ListEnd`,e[e.Statement=1]=`Statement`,e[e.Variable=2]=`Variable`,e[e.ElementStart=3]=`ElementStart`,e[e.Element=4]=`Element`,e[e.ForeignComponent=5]=`ForeignComponent`,e[e.Template=6]=`Template`,e[e.ElementEnd=7]=`ElementEnd`,e[e.ContainerStart=8]=`ContainerStart`,e[e.Container=9]=`Container`,e[e.ContainerEnd=10]=`ContainerEnd`,e[e.DisableBindings=11]=`DisableBindings`,e[e.ConditionalCreate=12]=`ConditionalCreate`,e[e.ConditionalBranchCreate=13]=`ConditionalBranchCreate`,e[e.Conditional=14]=`Conditional`,e[e.EnableBindings=15]=`EnableBindings`,e[e.Text=16]=`Text`,e[e.Listener=17]=`Listener`,e[e.InterpolateText=18]=`InterpolateText`,e[e.Binding=19]=`Binding`,e[e.Property=20]=`Property`,e[e.StyleProp=21]=`StyleProp`,e[e.ClassProp=22]=`ClassProp`,e[e.StyleMap=23]=`StyleMap`,e[e.ClassMap=24]=`ClassMap`,e[e.Advance=25]=`Advance`,e[e.Pipe=26]=`Pipe`,e[e.Attribute=27]=`Attribute`,e[e.ExtractedAttribute=28]=`ExtractedAttribute`,e[e.Defer=29]=`Defer`,e[e.DeferOn=30]=`DeferOn`,e[e.DeferWhen=31]=`DeferWhen`,e[e.I18nMessage=32]=`I18nMessage`,e[e.DomProperty=33]=`DomProperty`,e[e.Namespace=34]=`Namespace`,e[e.ProjectionDef=35]=`ProjectionDef`,e[e.EnableIncrementalHydrationRuntime=36]=`EnableIncrementalHydrationRuntime`,e[e.Projection=37]=`Projection`,e[e.Content=38]=`Content`,e[e.RepeaterCreate=39]=`RepeaterCreate`,e[e.Repeater=40]=`Repeater`,e[e.TwoWayProperty=41]=`TwoWayProperty`,e[e.TwoWayListener=42]=`TwoWayListener`,e[e.DeclareLet=43]=`DeclareLet`,e[e.StoreLet=44]=`StoreLet`,e[e.I18nStart=45]=`I18nStart`,e[e.I18n=46]=`I18n`,e[e.I18nEnd=47]=`I18nEnd`,e[e.I18nExpression=48]=`I18nExpression`,e[e.I18nApply=49]=`I18nApply`,e[e.IcuStart=50]=`IcuStart`,e[e.IcuEnd=51]=`IcuEnd`,e[e.IcuPlaceholder=52]=`IcuPlaceholder`,e[e.I18nContext=53]=`I18nContext`,e[e.I18nAttributes=54]=`I18nAttributes`,e[e.SourceLocation=55]=`SourceLocation`,e[e.Animation=56]=`Animation`,e[e.AnimationString=57]=`AnimationString`,e[e.AnimationBinding=58]=`AnimationBinding`,e[e.AnimationListener=59]=`AnimationListener`,e[e.Control=60]=`Control`,e[e.ControlCreate=61]=`ControlCreate`,e})(k||{}),Ft=(function(e){return e[e.LexicalRead=0]=`LexicalRead`,e[e.Context=1]=`Context`,e[e.TrackContext=2]=`TrackContext`,e[e.ReadVariable=3]=`ReadVariable`,e[e.NextContext=4]=`NextContext`,e[e.Reference=5]=`Reference`,e[e.StoreLet=6]=`StoreLet`,e[e.ContextLetReference=7]=`ContextLetReference`,e[e.GetCurrentView=8]=`GetCurrentView`,e[e.RestoreView=9]=`RestoreView`,e[e.ResetView=10]=`ResetView`,e[e.PureFunctionExpr=11]=`PureFunctionExpr`,e[e.PureFunctionParameterExpr=12]=`PureFunctionParameterExpr`,e[e.PipeBinding=13]=`PipeBinding`,e[e.PipeBindingVariadic=14]=`PipeBindingVariadic`,e[e.SafePropertyRead=15]=`SafePropertyRead`,e[e.SafeKeyedRead=16]=`SafeKeyedRead`,e[e.SafeNavigationMigration=17]=`SafeNavigationMigration`,e[e.SafeTernaryExpr=18]=`SafeTernaryExpr`,e[e.EmptyExpr=19]=`EmptyExpr`,e[e.AssignTemporaryExpr=20]=`AssignTemporaryExpr`,e[e.ReadTemporaryExpr=21]=`ReadTemporaryExpr`,e[e.SlotLiteralExpr=22]=`SlotLiteralExpr`,e[e.ConditionalCase=23]=`ConditionalCase`,e[e.ConstCollected=24]=`ConstCollected`,e[e.TwoWayBindingSet=25]=`TwoWayBindingSet`,e[e.ForeignContent=26]=`ForeignContent`,e[e.ArrowFunction=27]=`ArrowFunction`,e})(Ft||{}),It=(function(e){return e[e.None=0]=`None`,e[e.AlwaysInline=1]=`AlwaysInline`,e})(It||{}),Lt=(function(e){return e[e.Context=0]=`Context`,e[e.Identifier=1]=`Identifier`,e[e.SavedView=2]=`SavedView`,e[e.Alias=3]=`Alias`,e})(Lt||{}),Rt=(function(e){return e[e.Attribute=0]=`Attribute`,e[e.ClassName=1]=`ClassName`,e[e.StyleProperty=2]=`StyleProperty`,e[e.Property=3]=`Property`,e[e.Template=4]=`Template`,e[e.I18n=5]=`I18n`,e[e.LegacyAnimation=6]=`LegacyAnimation`,e[e.TwoWayProperty=7]=`TwoWayProperty`,e[e.Animation=8]=`Animation`,e})(Rt||{}),zt=(function(e){return e[e.Creation=0]=`Creation`,e[e.Postproccessing=1]=`Postproccessing`,e})(zt||{}),Bt=(function(e){return e[e.I18nText=0]=`I18nText`,e[e.I18nAttribute=1]=`I18nAttribute`,e})(Bt||{}),Vt=(function(e){return e[e.None=0]=`None`,e[e.ElementTag=1]=`ElementTag`,e[e.TemplateTag=2]=`TemplateTag`,e[e.OpenTag=4]=`OpenTag`,e[e.CloseTag=8]=`CloseTag`,e[e.ExpressionIndex=16]=`ExpressionIndex`,e})(Vt||{}),Ht=(function(e){return e[e.HTML=0]=`HTML`,e[e.SVG=1]=`SVG`,e[e.Math=2]=`Math`,e})(Ht||{}),Ut=(function(e){return e[e.Idle=0]=`Idle`,e[e.Immediate=1]=`Immediate`,e[e.Timer=2]=`Timer`,e[e.Hover=3]=`Hover`,e[e.Interaction=4]=`Interaction`,e[e.Viewport=5]=`Viewport`,e[e.Never=6]=`Never`,e})(Ut||{}),Wt=(function(e){return e[e.RootI18n=0]=`RootI18n`,e[e.Icu=1]=`Icu`,e[e.Attr=2]=`Attr`,e})(Wt||{}),Gt=(function(e){return e[e.NgTemplate=0]=`NgTemplate`,e[e.Structural=1]=`Structural`,e[e.Block=2]=`Block`,e})(Gt||{}),Kt=(function(e){return e[e.None=0]=`None`,e[e.InChildOperation=1]=`InChildOperation`,e[e.InArrowFunctionOperation=2]=`InArrowFunctionOperation`,e[e.InSafeNavigationMigration=4]=`InSafeNavigationMigration`,e})(Kt||{});k.Element,k.ElementStart,k.Container,k.ContainerStart,k.Template,k.RepeaterCreate,k.ConditionalCreate,k.ConditionalBranchCreate;var A=(function(e){return e[e.Tmpl=0]=`Tmpl`,e[e.Host=1]=`Host`,e[e.Both=2]=`Both`,e})(A||{}),qt=(function(e){return e[e.Full=0]=`Full`,e[e.DomOnly=1]=`DomOnly`,e})(qt||{});O.ariaProperty,O.ariaProperty,O.attribute,O.attribute,O.classProp,O.classProp,O.element,O.element,O.elementContainer,O.elementContainer,O.elementContainerEnd,O.elementContainerEnd,O.elementContainerStart,O.elementContainerStart,O.elementEnd,O.elementEnd,O.elementStart,O.elementStart,O.domProperty,O.domProperty,O.i18nExp,O.i18nExp,O.listener,O.listener,O.listener,O.listener,O.property,O.property,O.styleProp,O.styleProp,O.syntheticHostListener,O.syntheticHostListener,O.syntheticHostProperty,O.syntheticHostProperty,O.templateCreate,O.templateCreate,O.twoWayProperty,O.twoWayProperty,O.twoWayListener,O.twoWayListener,O.declareLet,O.declareLet,O.conditionalCreate,O.conditionalBranchCreate,O.conditionalBranchCreate,O.conditionalBranchCreate,O.domElement,O.domElement,O.domElementStart,O.domElementStart,O.domElementEnd,O.domElementEnd,O.domElementContainer,O.domElementContainer,O.domElementContainerStart,O.domElementContainerStart,O.domElementContainerEnd,O.domElementContainerEnd,O.domListener,O.domListener,O.domTemplate,O.domTemplate,O.animationEnter,O.animationEnter,O.animationLeave,O.animationLeave,O.animationEnterListener,O.animationEnterListener,O.animationLeaveListener,O.animationLeaveListener,E.And,E.Bigger,E.BiggerEquals,E.BitwiseOr,E.BitwiseAnd,E.Divide,E.Assign,E.Equals,E.Identical,E.Lower,E.LowerEquals,E.Minus,E.Modulo,E.Exponentiation,E.Multiply,E.NotEquals,E.NotIdentical,E.NullishCoalesce,E.Or,E.Plus,E.In,E.InstanceOf,E.AdditionAssignment,E.SubtractionAssignment,E.MultiplicationAssignment,E.DivisionAssignment,E.RemainderAssignment,E.ExponentiationAssignment,E.AndAssignment,E.OrAssignment,E.NullishCoalesceAssignment,k.Property,k.Property,k.Property,k.Attribute,k.Attribute,k.Property,k.TwoWayProperty,k.Container,k.ContainerStart,k.ContainerEnd,k.Element,k.ElementStart,k.ElementEnd,k.Template,k.ElementEnd,k.ElementStart,k.Element,k.ContainerEnd,k.ContainerStart,k.Container,k.I18nEnd,k.I18nStart,k.I18n,k.Pipe;var Jt=` \f
\r	\v ᠎ - \u2028\u2029  　﻿`;`${Jt}`,`${Jt}`;var Yt=(function(e){return e[e.Character=0]=`Character`,e[e.Identifier=1]=`Identifier`,e[e.PrivateIdentifier=2]=`PrivateIdentifier`,e[e.Keyword=3]=`Keyword`,e[e.String=4]=`String`,e[e.Operator=5]=`Operator`,e[e.Number=6]=`Number`,e[e.RegExpBody=7]=`RegExpBody`,e[e.RegExpFlags=8]=`RegExpFlags`,e[e.Error=9]=`Error`,e})(Yt||{}),Xt=(function(e){return e[e.Plain=0]=`Plain`,e[e.TemplateLiteralPart=1]=`TemplateLiteralPart`,e[e.TemplateLiteralEnd=2]=`TemplateLiteralEnd`,e})(Xt||{});Yt.Character,k.StyleMap,k.ClassMap,k.StyleProp,k.ClassProp,k.Attribute,k.Property,k.Attribute,k.Control,k.DomProperty,k.DomProperty,k.Attribute,k.StyleMap,k.ClassMap,k.StyleProp,k.ClassProp,k.Listener,k.TwoWayListener,k.AnimationListener,k.StyleMap,k.ClassMap,k.StyleProp,k.ClassProp,k.Property,k.TwoWayProperty,k.DomProperty,k.Attribute,k.Animation,k.Control,Ut.Idle,O.deferOnIdle,O.deferPrefetchOnIdle,O.deferHydrateOnIdle,Ut.Immediate,O.deferOnImmediate,O.deferPrefetchOnImmediate,O.deferHydrateOnImmediate,Ut.Timer,O.deferOnTimer,O.deferPrefetchOnTimer,O.deferHydrateOnTimer,Ut.Hover,O.deferOnHover,O.deferPrefetchOnHover,O.deferHydrateOnHover,Ut.Interaction,O.deferOnInteraction,O.deferPrefetchOnInteraction,O.deferHydrateOnInteraction,Ut.Viewport,O.deferOnViewport,O.deferPrefetchOnViewport,O.deferHydrateOnViewport,Ut.Never,O.deferHydrateNever,O.deferHydrateNever,O.deferHydrateNever,O.pipeBind1,O.pipeBind2,O.pipeBind3,O.pipeBind4,O.textInterpolate,O.textInterpolate1,O.textInterpolate2,O.textInterpolate3,O.textInterpolate4,O.textInterpolate5,O.textInterpolate6,O.textInterpolate7,O.textInterpolate8,O.textInterpolateV,O.interpolate,O.interpolate1,O.interpolate2,O.interpolate3,O.interpolate4,O.interpolate5,O.interpolate6,O.interpolate7,O.interpolate8,O.interpolateV,O.pureFunction0,O.pureFunction1,O.pureFunction2,O.pureFunction3,O.pureFunction4,O.pureFunction5,O.pureFunction6,O.pureFunction7,O.pureFunction8,O.pureFunctionV,O.resolveWindow,O.resolveDocument,O.resolveBody,Xe.HTML,O.sanitizeHtml,Xe.RESOURCE_URL,O.sanitizeResourceUrl,Xe.SCRIPT,O.sanitizeScript,Xe.STYLE,O.sanitizeStyle,Xe.URL,O.sanitizeUrl,Xe.ATTRIBUTE_NO_BINDING,O.validateAttribute,Xe.HTML,O.trustConstantHtml,Xe.RESOURCE_URL,O.trustConstantResourceUrl;var Zt=(function(e){return e[e.None=0]=`None`,e[e.ViewContextRead=1]=`ViewContextRead`,e[e.ViewContextWrite=2]=`ViewContextWrite`,e[e.SideEffectful=4]=`SideEffectful`,e})(Zt||{});A.Tmpl,A.Tmpl,A.Both,A.Host,A.Tmpl,A.Tmpl,A.Tmpl,A.Both,A.Both,A.Both,A.Tmpl,A.Both,A.Both,A.Tmpl,A.Both,A.Tmpl,A.Both,A.Both,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Both,A.Both,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Both,A.Both,A.Both,A.Tmpl,A.Tmpl,A.Both,A.Tmpl,A.Tmpl,A.Tmpl,A.Both,A.Both,A.Tmpl,A.Both,A.Both,A.Both,A.Both,A.Both,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Both,A.Tmpl,A.Both,A.Tmpl,A.Both,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Tmpl,A.Both,A.Both,A.Both,Dt.Property,Rt.Property,Dt.TwoWay,Rt.TwoWayProperty,Dt.Attribute,Rt.Attribute,Dt.Class,Rt.ClassName,Dt.Style,Rt.StyleProperty,Dt.LegacyAnimation,Rt.LegacyAnimation,Dt.Animation,Rt.Animation;var Qt=`%COMP%`;`${Qt}`,`${Qt}`,class e{static SINGLETON=new e;static veWillInferAnyFor(t){let n=e.SINGLETON;return t instanceof Et?t.visit(n):t.receiver.visit(n)}visitUnary(e){return e.expr.visit(this)}visitBinary(e){return e.left.visit(this)||e.right.visit(this)}visitChain(){return!1}visitConditional(e){return e.condition.visit(this)||e.trueExp.visit(this)||e.falseExp.visit(this)}visitCall(){return!0}visitSafeCall(){return!1}visitImplicitReceiver(){return!1}visitThisReceiver(){return!1}visitInterpolation(e){return e.expressions.some(e=>e.visit(this))}visitKeyedRead(){return!1}visitLiteralArray(){return!0}visitLiteralMap(){return!0}visitLiteralPrimitive(){return!1}visitPipe(){return!0}visitPrefixNot(e){return e.expression.visit(this)}visitTypeofExpression(e){return e.expression.visit(this)}visitVoidExpression(e){return e.expression.visit(this)}visitNonNullAssert(e){return e.expression.visit(this)}visitPropertyRead(){return!1}visitSafePropertyRead(){return!1}visitSafeKeyedRead(){return!1}visitTemplateLiteral(){return!1}visitTemplateLiteralElement(){return!1}visitTaggedTemplateLiteral(){return!1}visitParenthesizedExpression(e){return e.expression.visit(this)}visitRegularExpressionLiteral(){return!1}visitSpreadElement(e){return e.expression.visit(this)}visitArrowFunction(e,t){return!1}};var $t=null,en=!1,tn=1,nn=null,rn=Symbol(`SIGNAL`);function j(e){let t=$t;return $t=e,t}function an(){return $t}var on={version:0,lastCleanEpoch:0,dirty:!1,producers:void 0,producersTail:void 0,consumers:void 0,consumersTail:void 0,recomputing:!1,consumerAllowSignalWrites:!1,consumerIsAlwaysLive:!1,kind:`unknown`,producerMustRecompute:()=>!1,producerRecomputeValue:()=>{},consumerMarkedDirty:()=>{},consumerOnSignalRead:()=>{}};function sn(e){if(en)throw Error(``);if($t===null)return;$t.consumerOnSignalRead(e);let t=$t.producersTail;if(t!==void 0&&t.producer===e)return;let n,r=$t.recomputing;if(r&&(n=t===void 0?$t.producers:t.nextProducer,n!==void 0&&n.producer===e)){$t.producersTail=n,n.lastReadVersion=e.version,n.knownValidAtEpoch=tn;return}let i=e.consumersTail;if(i!==void 0&&i.consumer===$t&&(!r||i.knownValidAtEpoch===tn))return;let a=Sn($t),o={producer:e,consumer:$t,nextProducer:n,prevConsumer:void 0,knownValidAtEpoch:tn,lastReadVersion:e.version,nextConsumer:void 0};$t.producersTail=o,t===void 0?$t.producers=o:t.nextProducer=o,a&&bn(e,o)}function cn(){tn++}function ln(e){if((!Sn(e)||e.dirty)&&(e.dirty||e.lastCleanEpoch!==tn)){if(!e.producerMustRecompute(e)&&!vn(e)){pn(e);return}e.producerRecomputeValue(e),pn(e)}}function un(e){if(e.consumers===void 0)return;let t=en;en=!0;try{for(let t=e.consumers;t!==void 0;t=t.nextConsumer){let e=t.consumer;e.dirty||fn(e)}}finally{en=t}}function dn(){return $t?.consumerAllowSignalWrites!==!1}function fn(e){e.dirty=!0,un(e),e.consumerMarkedDirty?.(e)}function pn(e){e.dirty=!1,e.lastCleanEpoch=tn}function mn(e){return e&&hn(e),j(e)}function hn(e){if(e.producersTail?.knownValidAtEpoch===tn){let t=e.producers;for(;t!==void 0;)t.knownValidAtEpoch=null,t=t.nextProducer}e.producersTail=void 0,e.recomputing=!0}function gn(e,t){j(t),e&&_n(e)}function _n(e){e.recomputing=!1;let t=e.producersTail,n=t===void 0?e.producers:t.nextProducer;if(n!==void 0){if(Sn(e))do n=xn(n);while(n!==void 0);t===void 0?e.producers=void 0:t.nextProducer=void 0}}function vn(e){for(let t=e.producers;t!==void 0;t=t.nextProducer){let e=t.producer,n=t.lastReadVersion;if(n!==e.version||(ln(e),n!==e.version))return!0}return!1}function yn(e){if(Sn(e)){let t=e.producers;for(;t!==void 0;)t=xn(t)}e.producers=void 0,e.producersTail=void 0,e.consumers=void 0,e.consumersTail=void 0}function bn(e,t){let n=e.consumersTail,r=Sn(e);if(n===void 0?(t.nextConsumer=void 0,e.consumers=t):(t.nextConsumer=n.nextConsumer,n.nextConsumer=t),t.prevConsumer=n,e.consumersTail=t,!r)for(let t=e.producers;t!==void 0;t=t.nextProducer)bn(t.producer,t)}function xn(e){let t=e.producer,n=e.nextProducer,r=e.nextConsumer,i=e.prevConsumer;if(e.nextConsumer=void 0,e.prevConsumer=void 0,r===void 0?t.consumersTail=i:r.prevConsumer=i,i!==void 0)i.nextConsumer=r;else if(t.consumers=r,!Sn(t)){let e=t.producers;for(;e!==void 0;)e=xn(e)}return n}function Sn(e){return e.consumerIsAlwaysLive||e.consumers!==void 0}function Cn(e){nn?.(e)}function wn(e,t){return Object.is(e,t)}function Tn(e,t){let n=Object.create(kn);n.computation=e,t!==void 0&&(n.equal=t);let r=()=>{if(ln(n),sn(n),n.value===On)throw n.error;return n.value};return r[rn]=n,Cn(n),r}var En=Symbol(`UNSET`),Dn=Symbol(`COMPUTING`),On=Symbol(`ERRORED`),kn={...on,value:En,dirty:!0,error:null,equal:wn,kind:`computed`,producerMustRecompute(e){return e.value===En||e.value===Dn},producerRecomputeValue(e){if(e.value===Dn)throw Error(``);let t=e.value;e.value=Dn;let n=mn(e),r,i=!1;try{r=e.computation(),j(null),i=t!==En&&t!==On&&r!==On&&e.equal(t,r)}catch(t){r=On,e.error=t}finally{gn(e,n)}if(i){e.value=t;return}e.value=r,e.version++}};function An(){throw Error()}var jn=An;function Mn(e){jn(e)}function Nn(e){jn=e}var Pn=null;function Fn(e,t){let n=Object.create(zn);n.value=e,t!==void 0&&(n.equal=t);let r=()=>In(n);return r[rn]=n,Cn(n),[r,e=>Ln(n,e),e=>Rn(n,e)]}function In(e){return sn(e),e.value}function Ln(e,t){dn()||Mn(e),e.equal(e.value,t)||(e.value=t,Bn(e))}function Rn(e,t){dn()||Mn(e),Ln(e,t(e.value))}var zn={...on,equal:wn,value:void 0,kind:`signal`};function Bn(e){e.version++,cn(),un(e),Pn?.(e)}var Vn={...on,consumerIsAlwaysLive:!0,consumerAllowSignalWrites:!0,dirty:!0,kind:`effect`};function Hn(e){if(e.dirty=!1,e.version>0&&!vn(e))return;e.version++;let t=mn(e);try{e.cleanup(),e.fn()}finally{gn(e,t)}}var Un=void 0;function Wn(){return Un}function Gn(e){let t=Un;return Un=e,t}var Kn=Symbol(`NotFound`);function qn(e){return e===Kn||e?.name===`ɵNotFound`}function Jn(e,t,n){let r=Object.create(Zn);r.source=e,r.computation=t,n!=null&&(r.equal=n);let i=()=>{if(ln(r),sn(r),r.value===On)throw r.error;return r.value};return i[rn]=r,Cn(r),i}function Yn(e,t){ln(e),Ln(e,t),pn(e)}function Xn(e,t){if(ln(e),e.value===On)throw e.error;Rn(e,t),pn(e)}var Zn={...on,value:En,dirty:!0,error:null,equal:wn,kind:`linkedSignal`,producerMustRecompute(e){return e.value===En||e.value===Dn},producerRecomputeValue(e){if(e.value===Dn)throw Error(``);let t=e.value;e.value=Dn;let n=mn(e),r,i=!1;try{let n=e.source(),a=t!==En&&t!==On,o=a?{source:e.sourceValue,value:t}:void 0;r=e.computation(n,o),e.sourceValue=n,j(null),i=a&&r!==On&&e.equal(t,r)}catch(t){r=On,e.error=t}finally{gn(e,n)}if(i){e.value=t;return}e.value=r,e.version++}};function Qn(e){let t=j(null);try{return e()}finally{j(t)}}var $n=function(e,t){return $n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},$n(e,t)};function er(e,t){if(typeof t!=`function`&&t!==null)throw TypeError(`Class extends value `+String(t)+` is not a constructor or null`);$n(e,t);function n(){this.constructor=e}e.prototype=t===null?Object.create(t):(n.prototype=t.prototype,new n)}function tr(e){var t=typeof Symbol==`function`&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&typeof e.length==`number`)return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw TypeError(t?`Object is not iterable.`:`Symbol.iterator is not defined.`)}function nr(e,t){var n=typeof Symbol==`function`&&e[Symbol.iterator];if(!n)return e;var r=n.call(e),i,a=[],o;try{for(;(t===void 0||t-->0)&&!(i=r.next()).done;)a.push(i.value)}catch(e){o={error:e}}finally{try{i&&!i.done&&(n=r.return)&&n.call(r)}finally{if(o)throw o.error}}return a}function rr(e,t,n){if(n||arguments.length===2)for(var r=0,i=t.length,a;r<i;r++)(a||!(r in t))&&(a||=Array.prototype.slice.call(t,0,r),a[r]=t[r]);return e.concat(a||Array.prototype.slice.call(t))}function ir(e){return typeof e==`function`}function ar(e){var t=e(function(e){Error.call(e),e.stack=Error().stack});return t.prototype=Object.create(Error.prototype),t.prototype.constructor=t,t}var or=ar(function(e){return function(t){e(this),this.message=t?t.length+` errors occurred during unsubscription:
`+t.map(function(e,t){return t+1+`) `+e.toString()}).join(`
  `):``,this.name=`UnsubscriptionError`,this.errors=t}});function sr(e,t){if(e){var n=e.indexOf(t);0<=n&&e.splice(n,1)}}var cr=function(){function e(e){this.initialTeardown=e,this.closed=!1,this._parentage=null,this._finalizers=null}return e.prototype.unsubscribe=function(){var e,t,n,r,i;if(!this.closed){this.closed=!0;var a=this._parentage;if(a){if(this._parentage=null,Array.isArray(a))try{for(var o=tr(a),s=o.next();!s.done;s=o.next())s.value.remove(this)}catch(t){e={error:t}}finally{try{s&&!s.done&&(t=o.return)&&t.call(o)}finally{if(e)throw e.error}}else a.remove(this)}var c=this.initialTeardown;if(ir(c))try{c()}catch(e){i=e instanceof or?e.errors:[e]}var l=this._finalizers;if(l){this._finalizers=null;try{for(var u=tr(l),d=u.next();!d.done;d=u.next()){var f=d.value;try{dr(f)}catch(e){i??=[],e instanceof or?i=rr(rr([],nr(i)),nr(e.errors)):i.push(e)}}}catch(e){n={error:e}}finally{try{d&&!d.done&&(r=u.return)&&r.call(u)}finally{if(n)throw n.error}}}if(i)throw new or(i)}},e.prototype.add=function(t){if(t&&t!==this){if(this.closed)dr(t);else{if(t instanceof e){if(t.closed||t._hasParent(this))return;t._addParent(this)}(this._finalizers=this._finalizers??[]).push(t)}}},e.prototype._hasParent=function(e){var t=this._parentage;return t===e||Array.isArray(t)&&t.includes(e)},e.prototype._addParent=function(e){var t=this._parentage;this._parentage=Array.isArray(t)?(t.push(e),t):t?[t,e]:e},e.prototype._removeParent=function(e){var t=this._parentage;t===e?this._parentage=null:Array.isArray(t)&&sr(t,e)},e.prototype.remove=function(t){var n=this._finalizers;n&&sr(n,t),t instanceof e&&t._removeParent(this)},e.EMPTY=(function(){var t=new e;return t.closed=!0,t})(),e}(),lr=cr.EMPTY;function ur(e){return e instanceof cr||e&&`closed`in e&&ir(e.remove)&&ir(e.add)&&ir(e.unsubscribe)}function dr(e){ir(e)?e():e.unsubscribe()}var fr={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1},pr={setTimeout:function(e,t){var n=[...arguments].slice(2),r=pr.delegate;return r?.setTimeout?r.setTimeout.apply(r,rr([e,t],nr(n))):setTimeout.apply(void 0,rr([e,t],nr(n)))},clearTimeout:function(e){return(pr.delegate?.clearTimeout||clearTimeout)(e)},delegate:void 0};function mr(e){pr.setTimeout(function(){var t=fr.onUnhandledError;if(t)t(e);else throw e})}function hr(){}var gr=(function(){return yr(`C`,void 0,void 0)})();function _r(e){return yr(`E`,void 0,e)}function vr(e){return yr(`N`,e,void 0)}function yr(e,t,n){return{kind:e,value:t,error:n}}var br=null;function xr(e){if(fr.useDeprecatedSynchronousErrorHandling){var t=!br;if(t&&(br={errorThrown:!1,error:null}),e(),t){var n=br,r=n.errorThrown,i=n.error;if(br=null,r)throw i}}else e()}function Sr(e){fr.useDeprecatedSynchronousErrorHandling&&br&&(br.errorThrown=!0,br.error=e)}var Cr=function(e){er(t,e);function t(t){var n=e.call(this)||this;return n.isStopped=!1,t?(n.destination=t,ur(t)&&t.add(n)):n.destination=jr,n}return t.create=function(e,t,n){return new Dr(e,t,n)},t.prototype.next=function(e){this.isStopped?Ar(vr(e),this):this._next(e)},t.prototype.error=function(e){this.isStopped?Ar(_r(e),this):(this.isStopped=!0,this._error(e))},t.prototype.complete=function(){this.isStopped?Ar(gr,this):(this.isStopped=!0,this._complete())},t.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,e.prototype.unsubscribe.call(this),this.destination=null)},t.prototype._next=function(e){this.destination.next(e)},t.prototype._error=function(e){try{this.destination.error(e)}finally{this.unsubscribe()}},t.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},t}(cr),wr=Function.prototype.bind;function Tr(e,t){return wr.call(e,t)}var Er=function(){function e(e){this.partialObserver=e}return e.prototype.next=function(e){var t=this.partialObserver;if(t.next)try{t.next(e)}catch(e){Or(e)}},e.prototype.error=function(e){var t=this.partialObserver;if(t.error)try{t.error(e)}catch(e){Or(e)}else Or(e)},e.prototype.complete=function(){var e=this.partialObserver;if(e.complete)try{e.complete()}catch(e){Or(e)}},e}(),Dr=function(e){er(t,e);function t(t,n,r){var i=e.call(this)||this,a;if(ir(t)||!t)a={next:t??void 0,error:n??void 0,complete:r??void 0};else{var o;i&&fr.useDeprecatedNextContext?(o=Object.create(t),o.unsubscribe=function(){return i.unsubscribe()},a={next:t.next&&Tr(t.next,o),error:t.error&&Tr(t.error,o),complete:t.complete&&Tr(t.complete,o)}):a=t}return i.destination=new Er(a),i}return t}(Cr);function Or(e){fr.useDeprecatedSynchronousErrorHandling?Sr(e):mr(e)}function kr(e){throw e}function Ar(e,t){var n=fr.onStoppedNotification;n&&pr.setTimeout(function(){return n(e,t)})}var jr={closed:!0,next:hr,error:kr,complete:hr},Mr=(function(){return typeof Symbol==`function`&&Symbol.observable||`@@observable`})();function Nr(e){return e}function Pr(e){return e.length===0?Nr:e.length===1?e[0]:function(t){return e.reduce(function(e,t){return t(e)},t)}}var Fr=function(){function e(e){e&&(this._subscribe=e)}return e.prototype.lift=function(t){var n=new e;return n.source=this,n.operator=t,n},e.prototype.subscribe=function(e,t,n){var r=this,i=Rr(e)?e:new Dr(e,t,n);return xr(function(){var e=r,t=e.operator,n=e.source;i.add(t?t.call(i,n):n?r._subscribe(i):r._trySubscribe(i))}),i},e.prototype._trySubscribe=function(e){try{return this._subscribe(e)}catch(t){e.error(t)}},e.prototype.forEach=function(e,t){var n=this;return t=Ir(t),new t(function(t,r){var i=new Dr({next:function(t){try{e(t)}catch(e){r(e),i.unsubscribe()}},error:r,complete:t});n.subscribe(i)})},e.prototype._subscribe=function(e){return this.source?.subscribe(e)},e.prototype[Mr]=function(){return this},e.prototype.pipe=function(){return Pr([...arguments])(this)},e.prototype.toPromise=function(e){var t=this;return e=Ir(e),new e(function(e,n){var r;t.subscribe(function(e){return r=e},function(e){return n(e)},function(){return e(r)})})},e.create=function(t){return new e(t)},e}();function Ir(e){return e??fr.Promise??Promise}function Lr(e){return e&&ir(e.next)&&ir(e.error)&&ir(e.complete)}function Rr(e){return e&&e instanceof Cr||Lr(e)&&ur(e)}function zr(e){return ir(e?.lift)}function Br(e){return function(t){if(zr(t))return t.lift(function(t){try{return e(t,this)}catch(e){this.error(e)}});throw TypeError(`Unable to lift unknown Observable type`)}}function Vr(e,t,n,r,i){return new Hr(e,t,n,r,i)}var Hr=function(e){er(t,e);function t(t,n,r,i,a,o){var s=e.call(this,t)||this;return s.onFinalize=a,s.shouldUnsubscribe=o,s._next=n?function(e){try{n(e)}catch(e){t.error(e)}}:e.prototype._next,s._error=i?function(e){try{i(e)}catch(e){t.error(e)}finally{this.unsubscribe()}}:e.prototype._error,s._complete=r?function(){try{r()}catch(e){t.error(e)}finally{this.unsubscribe()}}:e.prototype._complete,s}return t.prototype.unsubscribe=function(){var t;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){var n=this.closed;e.prototype.unsubscribe.call(this),!n&&((t=this.onFinalize)==null||t.call(this))}},t}(Cr),Ur=ar(function(e){return function(){e(this),this.name=`ObjectUnsubscribedError`,this.message=`object unsubscribed`}}),Wr=function(e){er(t,e);function t(){var t=e.call(this)||this;return t.closed=!1,t.currentObservers=null,t.observers=[],t.isStopped=!1,t.hasError=!1,t.thrownError=null,t}return t.prototype.lift=function(e){var t=new Gr(this,this);return t.operator=e,t},t.prototype._throwIfClosed=function(){if(this.closed)throw new Ur},t.prototype.next=function(e){var t=this;xr(function(){var n,r;if(t._throwIfClosed(),!t.isStopped){t.currentObservers||=Array.from(t.observers);try{for(var i=tr(t.currentObservers),a=i.next();!a.done;a=i.next())a.value.next(e)}catch(e){n={error:e}}finally{try{a&&!a.done&&(r=i.return)&&r.call(i)}finally{if(n)throw n.error}}}})},t.prototype.error=function(e){var t=this;xr(function(){if(t._throwIfClosed(),!t.isStopped){t.hasError=t.isStopped=!0,t.thrownError=e;for(var n=t.observers;n.length;)n.shift().error(e)}})},t.prototype.complete=function(){var e=this;xr(function(){if(e._throwIfClosed(),!e.isStopped){e.isStopped=!0;for(var t=e.observers;t.length;)t.shift().complete()}})},t.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null},Object.defineProperty(t.prototype,"observed",{get:function(){return this.observers?.length>0},enumerable:!1,configurable:!0}),t.prototype._trySubscribe=function(t){return this._throwIfClosed(),e.prototype._trySubscribe.call(this,t)},t.prototype._subscribe=function(e){return this._throwIfClosed(),this._checkFinalizedStatuses(e),this._innerSubscribe(e)},t.prototype._innerSubscribe=function(e){var t=this,n=this,r=n.hasError,i=n.isStopped,a=n.observers;return r||i?lr:(this.currentObservers=null,a.push(e),new cr(function(){t.currentObservers=null,sr(a,e)}))},t.prototype._checkFinalizedStatuses=function(e){var t=this,n=t.hasError,r=t.thrownError,i=t.isStopped;n?e.error(r):i&&e.complete()},t.prototype.asObservable=function(){var e=new Fr;return e.source=this,e},t.create=function(e,t){return new Gr(e,t)},t}(Fr),Gr=function(e){er(t,e);function t(t,n){var r=e.call(this)||this;return r.destination=t,r.source=n,r}return t.prototype.next=function(e){var t,n;(n=(t=this.destination)?.next)==null||n.call(t,e)},t.prototype.error=function(e){var t,n;(n=(t=this.destination)?.error)==null||n.call(t,e)},t.prototype.complete=function(){var e,t;(t=(e=this.destination)?.complete)==null||t.call(e)},t.prototype._subscribe=function(e){return this.source?.subscribe(e)??lr},t}(Wr),Kr=function(e){er(t,e);function t(t){var n=e.call(this)||this;return n._value=t,n}return Object.defineProperty(t.prototype,"value",{get:function(){return this.getValue()},enumerable:!1,configurable:!0}),t.prototype._subscribe=function(t){var n=e.prototype._subscribe.call(this,t);return!n.closed&&t.next(this._value),n},t.prototype.getValue=function(){var e=this,t=e.hasError,n=e.thrownError,r=e._value;if(t)throw n;return this._throwIfClosed(),r},t.prototype.next=function(t){e.prototype.next.call(this,this._value=t)},t}(Wr);function qr(e,t){return Br(function(n,r){var i=0;n.subscribe(Vr(r,function(n){r.next(e.call(t,n,i++))}))})}var Jr=`https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss`,M=class extends Error{code;constructor(e,t){super(Xr(e,t)),this.code=e}};function Yr(e){return`NG0${Math.abs(e)}`}function Xr(e,t){return`${Yr(e)}${t?`: `+t:``}`}function Zr(e){for(let t in e)if(e[t]===Zr)return t;throw Error(``)}function Qr(e){if(typeof e==`string`)return e;if(Array.isArray(e))return`[${e.map(Qr).join(`, `)}]`;if(e==null)return``+e;let t=e.overriddenName||e.name;if(t)return`${t}`;let n=e.toString();if(n==null)return``+n;let r=n.indexOf(`
`);return r>=0?n.slice(0,r):n}function $r(e,t){return e?t?`${e} ${t}`:e:t||``}var ei=Zr({__forward_ref__:Zr});function ti(e){return e.__forward_ref__=ti,e}function ni(e){return ri(e)?e():e}function ri(e){return typeof e==`function`&&Object.hasOwn(e,ei)&&e.__forward_ref__===ti}function ii(e){return{token:e.token,providedIn:e.providedIn||null,factory:e.factory,value:void 0}}function ai(e){return oi(e,li)}function oi(e,t){return Object.hasOwn(e,t)&&e[t]||null}function si(e){return(e?.[li]??null)||null}function ci(e){return e&&Object.hasOwn(e,ui)?e[ui]:null}var li=Zr({ɵprov:Zr}),ui=Zr({ɵinj:Zr}),N=class{_desc;ngMetadataName=`InjectionToken`;ɵprov;constructor(e,t){this._desc=e,this.ɵprov=void 0,typeof t==`number`?this.__NG_ELEMENT_ID__=t:t!==void 0&&(this.ɵprov=ii({token:this,providedIn:t.providedIn||`root`,factory:t.factory}))}get multi(){return this}toString(){return`InjectionToken ${this._desc}`}};function di(e){return e&&!!e.ɵproviders}var fi=Zr({ɵcmp:Zr}),pi=Zr({ɵdir:Zr}),mi=Zr({ɵpipe:Zr}),hi=Zr({ɵfac:Zr}),gi=Zr({__NG_ELEMENT_ID__:Zr}),_i=Zr({__NG_ENV_ID__:Zr});function vi(e){return xi(e,`@Component`),e[fi]||null}function yi(e){return xi(e,`@Directive`),e[pi]||null}function bi(e){return xi(e,`@Pipe`),e[mi]||null}function xi(e,t){if(e==null)throw new M(-919,!1)}function Si(e){return typeof e==`string`?e:e==null?``:String(e)}var Ci=Zr({ngErrorCode:Zr}),wi=Zr({ngErrorMessage:Zr}),Ti=Zr({ngTokenPath:Zr});function Ei(e,t){return Oi(``,-200,t)}function Di(e,t){throw new M(-201,!1)}function Oi(e,t,n){let r=new M(t,e);return r[Ci]=t,r[wi]=e,n&&(r[Ti]=n),r}function ki(e){return e[Ci]}var Ai;function ji(){return Ai}function Mi(e){let t=Ai;return Ai=e,t}function Ni(e,t,n){let r=ai(e);if(r&&r.providedIn==`root`)return r.value===void 0?r.value=r.factory():r.value;if(n&8)return null;if(t!==void 0)return t;Di(e,``)}var Pi={},Fi=`__NG_DI_FLAG__`,Ii=class{injector;constructor(e){this.injector=e}retrieve(e,t){let n=zi(t)||0;try{return this.injector.get(e,n&8?null:Pi,n)}catch(e){if(qn(e))return e;throw e}}};function Li(e,t=0){let n=Wn();if(n===void 0)throw new M(-203,!1);if(n===null)return Ni(e,void 0,t);{let r=Bi(t),i=n.retrieve(e,r);if(qn(i)){if(r.optional)return null;throw i}return i}}function Ri(e,t=0){return(ji()||Li)(ni(e),t)}function P(e,t){return Ri(e,zi(t))}function zi(e){return e===void 0||typeof e==`number`?e:0|(e.optional&&8)|(e.host&&1)|(e.self&&2)|(e.skipSelf&&4)}function Bi(e){return{optional:!!(e&8),host:!!(e&1),self:!!(e&2),skipSelf:!!(e&4)}}function Vi(e){let t=[];for(let n=0;n<e.length;n++){let r=ni(e[n]);if(Array.isArray(r)){if(r.length===0)throw new M(900,!1);let e,n=0;for(let t=0;t<r.length;t++){let i=r[t],a=Hi(i);typeof a==`number`?a===-1?e=i.token:n|=a:e=i}t.push(Ri(e,n))}else t.push(Ri(r))}return t}function Hi(e){return e[Fi]}function Ui(e,t){return Object.hasOwn(e,hi)?e[hi]:null}function Wi(e,t){e.forEach(e=>Array.isArray(e)?Wi(e,t):t(e))}function Gi(e,t,n){t>=e.length?e.push(n):e.splice(t,0,n)}function Ki(e,t){return t>=e.length-1?e.pop():e.splice(t,1)[0]}function qi(e,t,n,r){let i=e.length;if(i==t)e.push(n,r);else if(i===1)e.push(r,e[0]),e[0]=n;else{for(i--,e.push(e[i-1],e[i]);i>t;){let t=i-2;e[i]=e[t],i--}e[t]=n,e[t+1]=r}}function Ji(e,t,n){let r=Xi(e,t);return r>=0?e[r|1]=n:(r=~r,qi(e,r,t,n)),r}function Yi(e,t){let n=Xi(e,t);if(n>=0)return e[n|1]}function Xi(e,t){return Zi(e,t,1)}function Zi(e,t,n){let r=0,i=e.length>>n;for(;i!==r;){let a=r+(i-r>>1),o=e[a<<n];if(t===o)return a<<n;o>t?i=a:r=a+1}return~(i<<n)}var Qi={},$i=[],ea=new N(``),ta=new N(``,-1),na=new N(``),ra=class{get(e,t=Pi){if(t===Pi){let e=Oi(``,-201);throw e.name=`ɵNotFound`,e}return t}};function ia(...e){return{ɵproviders:aa(!0,e),ɵfromNgModule:!0}}function aa(e,...t){let n=[],r=new Set,i,a=e=>{n.push(e)};return Wi(t,e=>{let t=e;sa(t,a,[],r)&&(i||=[],i.push(t))}),i!==void 0&&oa(i,a),n}function oa(e,t){for(let n=0;n<e.length;n++){let{ngModule:r,providers:i}=e[n];ca(i,e=>{t(e,r)})}}function sa(e,t,n,r){if(e=ni(e),!e)return!1;let i=null,a=ci(e),o=!a&&vi(e);if(!a&&!o){let t=e.ngModule;if(a=ci(t),a)i=t;else return!1}else if(o&&!o.standalone)return!1;else i=e;let s=r.has(i);if(o){if(s)return!1;if(r.add(i),o.dependencies){let e=typeof o.dependencies==`function`?o.dependencies():o.dependencies;for(let i of e)sa(i,t,n,r)}}else if(a){if(a.imports!=null&&!s){r.add(i);let e;try{Wi(a.imports,i=>{sa(i,t,n,r)&&(e||=[],e.push(i))})}finally{}e!==void 0&&oa(e,t)}if(!s){let e=Ui(i)||(()=>new i);t({provide:i,useFactory:e,deps:$i},i),t({provide:na,useValue:i,multi:!0},i),t({provide:ea,useValue:()=>Ri(i),multi:!0},i)}let o=a.providers;if(o!=null&&!s){let n=e;ca(o,e=>{t(e,n)})}}else return!1;return i!==e&&e.providers!==void 0}function ca(e,t){for(let n of e)di(n)&&(n=n.ɵproviders),Array.isArray(n)?ca(n,t):t(n)}var la=Zr({provide:String,useValue:Zr});function ua(e){return typeof e==`object`&&!!e&&la in e}function da(e){return!!(e&&e.useExisting)}function fa(e){return!!(e&&e.useFactory)}function pa(e){return typeof e==`function`}var ma=new N(``),ha={},ga={},_a=void 0;function va(){return _a===void 0&&(_a=new ra),_a}var ya=class{},ba=class extends ya{parent;source;scopes;records=new Map;_ngOnDestroyHooks=new Set;_onDestroyHooks=[];get destroyed(){return this._destroyed}_destroyed=!1;injectorDefTypes;constructor(e,t,n,r){super(),this.parent=t,this.source=n,this.scopes=r,Aa(e,e=>this.processProvider(e)),this.records.set(ta,Ea(void 0,this)),r.has(`environment`)&&this.records.set(ya,Ea(void 0,this));let i=this.records.get(ma);i!=null&&typeof i.value==`string`&&this.scopes.add(i.value),this.injectorDefTypes=new Set(this.get(na,$i,{self:!0}))}retrieve(e,t){let n=zi(t)||0;try{return this.get(e,Pi,n)}catch(e){if(qn(e))return e;throw e}}destroy(){Ta(this),this._destroyed=!0;let e=j(null);try{for(let e of this._ngOnDestroyHooks)e.ngOnDestroy();let e=this._onDestroyHooks;this._onDestroyHooks=[];for(let t of e)t()}finally{this.records.clear(),this._ngOnDestroyHooks.clear(),this.injectorDefTypes.clear(),j(e)}}onDestroy(e){return Ta(this),this._onDestroyHooks.push(e),()=>this.removeOnDestroy(e)}runInContext(e){Ta(this);let t=Gn(this),n=Mi(void 0);try{return e()}finally{Gn(t),Mi(n)}}get(e,t=Pi,n){if(Ta(this),Object.hasOwn(e,_i))return e[_i](this);let r=zi(n),i=Gn(this),a=Mi(void 0);try{if(!(r&4)){let t=this.records.get(e);if(t===void 0){let n=ka(e)&&ai(e);t=n&&this.injectableDefInScope(n)?Ea(xa(e),ha):null,this.records.set(e,t)}if(t!=null)return this.hydrate(e,t,r)}let n=r&2?va():this.parent;return t=r&8&&t===Pi?null:t,n.get(e,t)}catch(e){let t=ki(e);throw t===-200||t===-201?new M(t,null):e}finally{Mi(a),Gn(i)}}resolveInjectorInitializers(){let e=j(null),t=Gn(this),n=Mi(void 0);try{let e=this.get(ea,$i,{self:!0});for(let t of e)t()}finally{Gn(t),Mi(n),j(e)}}toString(){return`R3Injector[...]`}processProvider(e){e=ni(e);let t=pa(e)?e:ni(e&&e.provide),n=Ca(e);if(!pa(e)&&e.multi===!0){let n=this.records.get(t);n||(n=Ea(void 0,ha,!0),n.factory=()=>Vi(n.multi),this.records.set(t,n)),t=e,n.multi.push(e)}this.records.set(t,n)}hydrate(e,t,n){let r=j(null);try{if(t.value===ga)throw Ei(``);return t.value===ha&&(t.value=ga,t.value=t.factory(void 0,n)),typeof t.value==`object`&&t.value&&Oa(t.value)&&this._ngOnDestroyHooks.add(t.value),t.value}finally{j(r)}}injectableDefInScope(e){if(!e.providedIn)return!1;let t=ni(e.providedIn);return typeof t==`string`?t===`any`||this.scopes.has(t):this.injectorDefTypes.has(t)}removeOnDestroy(e){let t=this._onDestroyHooks.indexOf(e);t!==-1&&this._onDestroyHooks.splice(t,1)}};function xa(e){let t=ai(e),n=t===null?Ui(e):t.factory;if(n!==null)return n;if(e instanceof N)throw new M(-204,!1);if(e instanceof Function)return Sa(e);throw new M(-204,!1)}function Sa(e){if(e.length>0)throw new M(-204,!1);let t=si(e);return t===null?()=>new e:()=>t.factory(e)}function Ca(e){return ua(e)?Ea(void 0,e.useValue):Ea(wa(e),ha)}function wa(e,t,n){let r;if(pa(e)){let t=ni(e);return Ui(t)||xa(t)}if(ua(e))r=()=>ni(e.useValue);else if(fa(e))r=()=>e.useFactory(...Vi(e.deps||[]));else if(da(e))r=(t,n)=>Ri(ni(e.useExisting),n!==void 0&&n&8?8:void 0);else{let t=ni(e&&(e.useClass||e.provide));if(Da(e))r=()=>new t(...Vi(e.deps));else return Ui(t)||xa(t)}return r}function Ta(e){if(e.destroyed)throw new M(-205,!1)}function Ea(e,t,n=!1){return{factory:e,value:t,multi:n?[]:void 0}}function Da(e){return!!e.deps}function Oa(e){return typeof e==`object`&&!!e&&typeof e.ngOnDestroy==`function`}function ka(e){return typeof e==`function`||typeof e==`object`&&e.ngMetadataName===`InjectionToken`}function Aa(e,t){for(let n of e)Array.isArray(n)?Aa(n,t):n&&di(n)?Aa(n.ɵproviders,t):t(n)}function ja(e,t){let n;e instanceof ba?(Ta(e),n=e):n=new Ii(e);let r=Gn(n),i=Mi(void 0);try{return t()}finally{Gn(r),Mi(i)}}function Ma(){return ji()!==void 0||Wn()!=null}var Na=1;function Pa(e){return Array.isArray(e)&&typeof e[Na]==`object`}function Fa(e){return Array.isArray(e)&&e[Na]===!0}function Ia(e){return!!(e.flags&4)}function La(e){return e.componentOffset>-1}function Ra(e){return(e.flags&1)==1}function za(e){return!!e.template}function Ba(e){return!!(e[2]&512)}function Va(e){return(e[2]&256)==256}var Ha=`math`;function Ua(e){for(;Array.isArray(e);)e=e[0];return e}function Wa(e,t){return Ua(t[e])}function Ga(e,t){return Ua(t[e.index])}function Ka(e,t){return e.data[t]}function qa(e,t){return e[t]}function Ja(e,t,n,r){n>=e.data.length&&(e.data[n]=null,e.blueprint[n]=null),t[n]=r}function Ya(e,t){let n=t[e];return Pa(n)?n:n[0]}function Xa(e){return(e[2]&128)==128}function Za(e,t){return t==null?null:e[t]}function Qa(e){e[17]=0}function $a(e){e[2]&1024||(e[2]|=1024,Xa(e)&&ro(e))}function eo(e,t){for(;e>0;)t=t[14],e--;return t}function to(e){return!!(e[2]&9216||e[24]?.dirty)}function no(e){e[10].changeDetectionScheduler?.notify(8),e[2]&64&&(e[2]|=1024),to(e)&&ro(e)}function ro(e){e[10].changeDetectionScheduler?.notify(0);let t=oo(e);for(;t!==null&&!(t[2]&8192||(t[2]|=8192,!Xa(t)));)t=oo(t)}function io(e,t){if(Va(e))throw new M(911,!1);e[21]===null&&(e[21]=[]),e[21].push(t)}function ao(e,t){if(e[21]===null)return;let n=e[21].indexOf(t);n!==-1&&e[21].splice(n,1)}function oo(e){let t=e[3];return Fa(t)?t[3]:t}function so(e){return e[7]??=[]}function co(e){return e.cleanup??=[]}var F={lFrame:Wo(null),bindingsEnabled:!0,skipHydrationRootTNode:null},lo=!1;function uo(){return F.lFrame.elementDepthCount}function fo(){F.lFrame.elementDepthCount++}function po(){F.lFrame.elementDepthCount--}function mo(){return F.bindingsEnabled}function ho(){return F.skipHydrationRootTNode!==null}function go(e){return F.skipHydrationRootTNode===e}function _o(){F.skipHydrationRootTNode=null}function I(){return F.lFrame.lView}function vo(){return F.lFrame.tView}function yo(e){return F.lFrame.contextLView=e,e[8]}function bo(e){return F.lFrame.contextLView=null,e}function xo(){let e=So();for(;e!==null&&e.type===64;)e=e.parent;return e}function So(){return F.lFrame.currentTNode}function Co(){let e=F.lFrame,t=e.currentTNode;return e.isParent?t:t.parent}function wo(e,t){let n=F.lFrame;n.currentTNode=e,n.isParent=t}function To(){return F.lFrame.isParent}function Eo(){F.lFrame.isParent=!1}function Do(){return lo}function Oo(e){let t=lo;return lo=e,t}function ko(){let e=F.lFrame,t=e.bindingRootIndex;return t===-1&&(t=e.bindingRootIndex=e.tView.bindingStartIndex),t}function Ao(){return F.lFrame.bindingIndex}function jo(e){return F.lFrame.bindingIndex=e}function Mo(){return F.lFrame.bindingIndex++}function No(e){let t=F.lFrame,n=t.bindingIndex;return t.bindingIndex+=e,n}function Po(){return F.lFrame.inI18n}function Fo(e,t){let n=F.lFrame;n.bindingIndex=n.bindingRootIndex=e,Lo(t)}function Io(){return F.lFrame.currentDirectiveIndex}function Lo(e){F.lFrame.currentDirectiveIndex=e}function Ro(e){let t=F.lFrame.currentDirectiveIndex;return t===-1?null:e[t]}function zo(e){F.lFrame.currentQueryIndex=e}function Bo(e){let t=e[1];return t.type===2?t.declTNode:t.type===1?e[5]:null}function Vo(e,t,n){if(n&4){let r=t,i=e;for(;r=r.parent,r===null&&!(n&1)&&(r=Bo(i),!(r===null||(i=i[14],r.type&10))););if(r===null)return!1;t=r,e=i}let r=F.lFrame=Uo();return r.currentTNode=t,r.lView=e,!0}function Ho(e){let t=Uo(),n=e[1];F.lFrame=t,t.currentTNode=n.firstChild,t.lView=e,t.tView=n,t.contextLView=e,t.bindingIndex=n.bindingStartIndex,t.inI18n=!1}function Uo(){let e=F.lFrame,t=e===null?null:e.child;return t===null?Wo(e):t}function Wo(e){let t={currentTNode:null,isParent:!0,lView:null,tView:null,selectedIndex:-1,contextLView:null,elementDepthCount:0,currentNamespace:null,currentDirectiveIndex:-1,bindingRootIndex:-1,bindingIndex:-1,currentQueryIndex:0,parent:e,child:null,inI18n:!1};return e!==null&&(e.child=t),t}function Go(){let e=F.lFrame;return F.lFrame=e.parent,e.currentTNode=null,e.lView=null,e}var Ko=Go;function qo(){let e=Go();e.isParent=!0,e.tView=null,e.selectedIndex=-1,e.contextLView=null,e.elementDepthCount=0,e.currentDirectiveIndex=-1,e.currentNamespace=null,e.bindingRootIndex=-1,e.bindingIndex=-1,e.currentQueryIndex=0}function Jo(e){return(F.lFrame.contextLView=eo(e,F.lFrame.contextLView))[8]}function Yo(){return F.lFrame.selectedIndex}function Xo(e){F.lFrame.selectedIndex=e}function Zo(){let e=F.lFrame;return Ka(e.tView,e.selectedIndex)}function Qo(){F.lFrame.currentNamespace=`svg`}function $o(){es()}function es(){F.lFrame.currentNamespace=null}function ts(){return F.lFrame.currentNamespace}var ns=!0;function rs(){return ns}function is(e){ns=e}function as(e,t=null,n=null,r){let i=os(e,t,n,r);return i.resolveInjectorInitializers(),i}function os(e,t=null,n=null,r,i=new Set){return new ba([n||$i,ia(e)],t||va(),null,i)}var ss=class e{static THROW_IF_NOT_FOUND=Pi;static NULL=new ra;static create(e,t){if(Array.isArray(e))return as({name:``},t,e,``);{let t=e.name??``;return as({name:t},e.parent,e.providers,t)}}static ɵprov=ii({token:e,providedIn:`any`,factory:()=>Ri(ta)});static __NG_ELEMENT_ID__=-1},cs=new N(``),ls=class{static __NG_ELEMENT_ID__=ds;static __NG_ENV_ID__=e=>e},us=class extends ls{_lView;constructor(e){super(),this._lView=e}get destroyed(){return Va(this._lView)}onDestroy(e){let t=this._lView;return io(t,e),()=>ao(t,e)}};function ds(){return new us(I())}var fs=new N(``),ps=(()=>{class e{taskId=0;pendingTasks=new Set;destroyed=!1;pendingTask=new Kr(!1);debugTaskTracker=P(fs,{optional:!0});get hasPendingTasks(){return!this.destroyed&&this.pendingTask.value}get hasPendingTasksObservable(){return this.destroyed?new Fr(e=>{e.next(!1),e.complete()}):this.pendingTask}add(){!this.hasPendingTasks&&!this.destroyed&&this.pendingTask.next(!0);let e=this.taskId++;return this.pendingTasks.add(e),this.debugTaskTracker?.add(e),e}has(e){return this.pendingTasks.has(e)}remove(e){this.pendingTasks.delete(e),this.debugTaskTracker?.remove(e),this.pendingTasks.size===0&&this.hasPendingTasks&&this.pendingTask.next(!1)}ngOnDestroy(){this.pendingTasks.clear(),this.hasPendingTasks&&this.pendingTask.next(!1),this.destroyed=!0,this.pendingTask.unsubscribe()}static ɵprov=ii({token:e,providedIn:`root`,factory:()=>new e})}return e})(),ms=class extends Wr{__isAsync;destroyRef=void 0;pendingTasks=void 0;constructor(e=!1){super(),this.__isAsync=e,Ma()&&(this.destroyRef=P(ls,{optional:!0})??void 0,this.pendingTasks=P(ps,{optional:!0})??void 0)}emit(e){let t=j(null);try{super.next(e)}finally{j(t)}}subscribe(e,t,n){let r=e,i=t||(()=>null),a=n;if(e&&typeof e==`object`){let t=e;r=t.next?.bind(t),i=t.error?.bind(t),a=t.complete?.bind(t)}this.__isAsync&&(i=this.wrapInTimeout(i),r&&=this.wrapInTimeout(r),a&&=this.wrapInTimeout(a));let o=super.subscribe({next:r,error:i,complete:a});return e instanceof cr&&e.add(o),o}wrapInTimeout(e){return t=>{let n=this.pendingTasks?.add();setTimeout(()=>{try{e(t)}finally{n!==void 0&&this.pendingTasks?.remove(n)}})}}};function hs(...e){}function gs(e){let t,n;function r(){e=hs;try{n!==void 0&&typeof cancelAnimationFrame==`function`&&cancelAnimationFrame(n),t!==void 0&&clearTimeout(t)}catch{}}return t=setTimeout(()=>{e(),r()}),typeof requestAnimationFrame==`function`&&(n=requestAnimationFrame(()=>{e(),r()})),()=>r()}function _s(e){return queueMicrotask(()=>e()),()=>{e=hs}}var vs=`isAngularZone`,ys=`isAngularZone_ID`,bs=0,xs=class e{hasPendingMacrotasks=!1;hasPendingMicrotasks=!1;isStable=!0;onUnstable=new ms(!1);onMicrotaskEmpty=new ms(!1);onStable=new ms(!1);onError=new ms(!1);constructor(e){let{enableLongStackTrace:t=!1,shouldCoalesceEventChangeDetection:n=!1,shouldCoalesceRunChangeDetection:r=!1,scheduleInRootZone:i=!1}=e;if(typeof Zone>`u`)throw new M(908,!1);Zone.assertZonePatched();let a=this;a._nesting=0,a._outer=a._inner=Zone.current,Zone.TaskTrackingZoneSpec&&(a._inner=a._inner.fork(new Zone.TaskTrackingZoneSpec)),t&&Zone.longStackTraceZoneSpec&&(a._inner=a._inner.fork(Zone.longStackTraceZoneSpec)),a.shouldCoalesceEventChangeDetection=!r&&n,a.shouldCoalesceRunChangeDetection=r,a.callbackScheduled=!1,a.scheduleInRootZone=i,Ts(a)}static isInAngularZone(){return typeof Zone<`u`&&Zone.current.get(vs)===!0}static assertInAngularZone(){if(!e.isInAngularZone())throw new M(909,!1)}static assertNotInAngularZone(){if(e.isInAngularZone())throw new M(909,!1)}run(e,t,n){return this._inner.run(e,t,n)}runTask(e,t,n,r){let i=this._inner,a=i.scheduleEventTask(`NgZoneEvent: `+r,e,Ss,hs,hs);try{return i.runTask(a,t,n)}finally{i.cancelTask(a)}}runGuarded(e,t,n){return this._inner.runGuarded(e,t,n)}runOutsideAngular(e){return this._outer.run(e)}},Ss={};function Cs(e){if(e._nesting==0&&!e.hasPendingMicrotasks&&!e.isStable)try{e._nesting++,e.onMicrotaskEmpty.emit(null)}finally{if(e._nesting--,!e.hasPendingMicrotasks)try{e.runOutsideAngular(()=>e.onStable.emit(null))}finally{e.isStable=!0}}}function ws(e){if(e.isCheckStableRunning||e.callbackScheduled)return;e.callbackScheduled=!0;function t(){gs(()=>{e.callbackScheduled=!1,Es(e),e.isCheckStableRunning=!0,Cs(e),e.isCheckStableRunning=!1})}e.scheduleInRootZone?Zone.root.run(()=>{t()}):e._outer.run(()=>{t()}),Es(e)}function Ts(e){let t=()=>{ws(e)},n=bs++;e._inner=e._inner.fork({name:`angular`,properties:{[vs]:!0,[ys]:n,[ys+n]:!0},onInvokeTask:(n,r,i,a,o,s)=>{if(As(s))return n.invokeTask(i,a,o,s);try{return Ds(e),n.invokeTask(i,a,o,s)}finally{(e.shouldCoalesceEventChangeDetection&&a.type===`eventTask`||e.shouldCoalesceRunChangeDetection)&&t(),Os(e)}},onInvoke:(n,r,i,a,o,s,c)=>{try{return Ds(e),n.invoke(i,a,o,s,c)}finally{e.shouldCoalesceRunChangeDetection&&!e.callbackScheduled&&!js(s)&&t(),Os(e)}},onHasTask:(t,n,r,i)=>{t.hasTask(r,i),n===r&&(i.change==`microTask`?(e._hasPendingMicrotasks=i.microTask,Es(e),Cs(e)):i.change==`macroTask`&&(e.hasPendingMacrotasks=i.macroTask))},onHandleError:(t,n,r,i)=>(t.handleError(r,i),e.runOutsideAngular(()=>e.onError.emit(i)),!1)})}function Es(e){e.hasPendingMicrotasks=!!(e._hasPendingMicrotasks||(e.shouldCoalesceEventChangeDetection||e.shouldCoalesceRunChangeDetection)&&e.callbackScheduled===!0)}function Ds(e){e._nesting++,e.isStable&&(e.isStable=!1,e.onUnstable.emit(null))}function Os(e){e._nesting--,Cs(e)}var ks=class{hasPendingMicrotasks=!1;hasPendingMacrotasks=!1;isStable=!0;onUnstable=new ms;onMicrotaskEmpty=new ms;onStable=new ms;onError=new ms;run(e,t,n){return e.apply(t,n)}runGuarded(e,t,n){return e.apply(t,n)}runOutsideAngular(e){return e()}runTask(e,t,n,r){return e.apply(t,n)}};function As(e){return Ms(e,`__ignore_ng_zone__`)}function js(e){return Ms(e,`__scheduler_tick__`)}function Ms(e,t){return!Array.isArray(e)||e.length!==1?!1:e[0]?.data?.[t]===!0}var Ns=class{_console=console;handleError(e){this._console.error(`ERROR`,e)}},Ps=new N(``,{factory:()=>{let e=P(xs),t=P(ya),n;return r=>{e.runOutsideAngular(()=>{t.destroyed&&!n?setTimeout(()=>{throw r}):(n??=t.get(Ns),n.handleError(r))})}}}),Fs={provide:ea,useValue:()=>{P(Ns,{optional:!0})},multi:!0};function L(e,t){let[n,r,i]=Fn(e,t?.equal),a=n;return a[rn],a.set=r,a.update=i,a.asReadonly=Is.bind(a),a}function Is(){let e=this[rn];if(e.readonlyFn===void 0){let t=()=>this();t[rn]=e,e.readonlyFn=t}return e.readonlyFn}var Ls=new N(``,{factory:()=>Rs}),Rs=`ng`,zs=new N(``),Bs=new N(``,{providedIn:`platform`,factory:()=>`unknown`}),Vs=new N(``,{factory:()=>P(cs).body?.querySelector(`[ngCspNonce]`)?.getAttribute(`ngCspNonce`)||null}),Hs=(()=>{class e{view;node;constructor(e,t){this.view=e,this.node=t}static __NG_ELEMENT_ID__=Us}return e})();function Us(){return new Hs(I(),xo())}var Ws=class{},Gs=new N(``,{factory:()=>!0}),Ks=new N(``),qs=(()=>{class e{static ɵprov=ii({token:e,providedIn:`root`,factory:()=>new Js})}return e})(),Js=class{dirtyEffectCount=0;queues=new Map;add(e){this.enqueue(e),this.schedule(e)}schedule(e){e.dirty&&this.dirtyEffectCount++}remove(e){let t=e.zone,n=this.queues.get(t);n.has(e)&&(n.delete(e),e.dirty&&this.dirtyEffectCount--)}enqueue(e){let t=e.zone;this.queues.has(t)||this.queues.set(t,new Set);let n=this.queues.get(t);n.has(e)||n.add(e)}flush(){for(;this.dirtyEffectCount>0;){let e=!1;for(let[t,n]of this.queues)e||=t===null?this.flushQueue(n):t.run(()=>this.flushQueue(n));e||(this.dirtyEffectCount=0)}}flushQueue(e){let t=!1;for(let n of e)n.dirty&&(this.dirtyEffectCount--,t=!0,n.run());return t}},Ys=class{[rn];constructor(e){this[rn]=e}destroy(){this[rn].destroy()}};function Xs(e,t){let n=t?.injector??P(ss),r=t?.manualCleanup===!0?null:n.get(ls),i,a=n.get(Hs,null,{optional:!0}),o=n.get(Ws);return a===null?i=tc(e,n.get(qs),o):(i=ec(a.view,o,e),r instanceof us&&r._lView===a.view&&(r=null)),i.injector=n,r!==null&&(i.onDestroyFns=[r.onDestroy(()=>i.destroy())]),new Ys(i)}var Zs={...Vn,cleanupFns:void 0,zone:null,onDestroyFns:null,run(){let e=Oo(!1);try{Hn(this)}finally{Oo(e)}},cleanup(){if(!this.cleanupFns?.length)return;let e=j(null);try{for(;this.cleanupFns.length;)this.cleanupFns.pop()()}finally{this.cleanupFns=[],j(e)}}},Qs={...Zs,consumerMarkedDirty(){this.scheduler.schedule(this),this.notifier.notify(12)},destroy(){if(yn(this),this.onDestroyFns!==null)for(let e of this.onDestroyFns)e();this.cleanup(),this.scheduler.remove(this)}},$s={...Zs,consumerMarkedDirty(){this.view[2]|=8192,ro(this.view),this.notifier.notify(13)},destroy(){if(yn(this),this.onDestroyFns!==null)for(let e of this.onDestroyFns)e();this.cleanup(),this.view[23]?.delete(this)}};function ec(e,t,n){let r=Object.create($s);return r.view=e,r.zone=typeof Zone<`u`?Zone.current:null,r.notifier=t,r.fn=nc(r,n),e[23]??=new Set,e[23].add(r),r.consumerMarkedDirty(r),r}function tc(e,t,n){let r=Object.create(Qs);return r.fn=nc(r,e),r.scheduler=t,r.notifier=n,r.zone=typeof Zone<`u`?Zone.current:null,r.scheduler.add(r),r.notifier.notify(12),r}function nc(e,t){return()=>{t(t=>(e.cleanupFns??=[]).push(t))}}var rc=(()=>{class e{internalPendingTasks=P(ps);scheduler=P(Ws);errorHandler=P(Ps);add(){let e=this.internalPendingTasks.add();return()=>{this.internalPendingTasks.has(e)&&(this.scheduler.notify(11),this.internalPendingTasks.remove(e))}}run(e){let t=this.add();try{e().catch(this.errorHandler).finally(t)}catch(e){this.errorHandler(e),t()}}static ɵprov=ii({token:e,providedIn:`root`,factory:()=>new e})}return e})(),ic=Symbol(`InputSignalNode#UNSET`),ac={...zn,transformFn:void 0,applyValueToInputSignal(e,t){Ln(e,t)}};function oc(e){return{toString:e}.toString()}var R=(function(e){return e[e.TemplateCreateStart=0]=`TemplateCreateStart`,e[e.TemplateCreateEnd=1]=`TemplateCreateEnd`,e[e.TemplateUpdateStart=2]=`TemplateUpdateStart`,e[e.TemplateUpdateEnd=3]=`TemplateUpdateEnd`,e[e.LifecycleHookStart=4]=`LifecycleHookStart`,e[e.LifecycleHookEnd=5]=`LifecycleHookEnd`,e[e.OutputStart=6]=`OutputStart`,e[e.OutputEnd=7]=`OutputEnd`,e[e.BootstrapApplicationStart=8]=`BootstrapApplicationStart`,e[e.BootstrapApplicationEnd=9]=`BootstrapApplicationEnd`,e[e.BootstrapComponentStart=10]=`BootstrapComponentStart`,e[e.BootstrapComponentEnd=11]=`BootstrapComponentEnd`,e[e.ChangeDetectionStart=12]=`ChangeDetectionStart`,e[e.ChangeDetectionEnd=13]=`ChangeDetectionEnd`,e[e.ChangeDetectionSyncStart=14]=`ChangeDetectionSyncStart`,e[e.ChangeDetectionSyncEnd=15]=`ChangeDetectionSyncEnd`,e[e.AfterRenderHooksStart=16]=`AfterRenderHooksStart`,e[e.AfterRenderHooksEnd=17]=`AfterRenderHooksEnd`,e[e.ComponentStart=18]=`ComponentStart`,e[e.ComponentEnd=19]=`ComponentEnd`,e[e.DeferBlockStateStart=20]=`DeferBlockStateStart`,e[e.DeferBlockStateEnd=21]=`DeferBlockStateEnd`,e[e.DynamicComponentStart=22]=`DynamicComponentStart`,e[e.DynamicComponentEnd=23]=`DynamicComponentEnd`,e[e.HostBindingsUpdateStart=24]=`HostBindingsUpdateStart`,e[e.HostBindingsUpdateEnd=25]=`HostBindingsUpdateEnd`,e})(R||{});function sc(e,t,n,r){t===null?e[n]=r:t.applyValueToInputSignal(t,r)}var cc=null;function lc(){return cc}var uc=[],z=function(e,t=null,n){for(let r=0;r<uc.length;r++){let i=uc[r];i(e,t,n)}};function dc(e,t,n){let{ngOnChanges:r,ngOnInit:i,ngDoCheck:a}=t.type.prototype;if(r){let r=lc()(t);(n.preOrderHooks??=[]).push(e,r),(n.preOrderCheckHooks??=[]).push(e,r)}i&&(n.preOrderHooks??=[]).push(0-e,i),a&&((n.preOrderHooks??=[]).push(e,a),(n.preOrderCheckHooks??=[]).push(e,a))}function fc(e,t){for(let n=t.directiveStart,r=t.directiveEnd;n<r;n++){let{ngAfterContentInit:t,ngAfterContentChecked:r,ngAfterViewInit:i,ngAfterViewChecked:a,ngOnDestroy:o}=e.data[n].type.prototype;t&&(e.contentHooks??=[]).push(-n,t),r&&((e.contentHooks??=[]).push(n,r),(e.contentCheckHooks??=[]).push(n,r)),i&&(e.viewHooks??=[]).push(-n,i),a&&((e.viewHooks??=[]).push(n,a),(e.viewCheckHooks??=[]).push(n,a)),o!=null&&(e.destroyHooks??=[]).push(n,o)}}function pc(e,t,n){gc(e,t,3,n)}function mc(e,t,n,r){(e[2]&3)===n&&gc(e,t,n,r)}function hc(e,t){let n=e[2];(n&3)===t&&(n&=16383,n+=1,e[2]=n)}function gc(e,t,n,r){let i=r===void 0?0:e[17]&65535,a=r??-1,o=t.length-1,s=0;for(let c=i;c<o;c++)if(typeof t[c+1]==`number`){if(s=t[c],r!=null&&s>=r)break}else t[c]<0&&(e[17]+=65536),(s<a||a==-1)&&(vc(e,n,t,c),e[17]=(e[17]&4294901760)+c+2),c++}function _c(e,t){z(R.LifecycleHookStart,e,t);let n=j(null);try{t.call(e)}finally{j(n),z(R.LifecycleHookEnd,e,t)}}function vc(e,t,n,r){let i=n[r]<0,a=n[r+1],o=e[i?-n[r]:n[r]];i?e[2]>>14<e[17]>>16&&(e[2]&3)===t&&(e[2]+=16384,_c(o,a)):_c(o,a)}var yc=-1,bc=class{factory;name;injectImpl;resolving=!1;canSeeViewProviders;multi;componentProviders;index;providerFactory;constructor(e,t,n,r){this.factory=e,this.name=r,this.canSeeViewProviders=t,this.injectImpl=n}};function xc(e){return!!(e.flags&8)}function Sc(e){return!!(e.flags&16)}function Cc(e,t,n){let r=0;for(;r<n.length;){let i=n[r];if(typeof i==`number`){if(i!==0)break;r++;let a=n[r++],o=n[r++],s=n[r++];e.setAttribute(t,o,s,a)}else{let a=i,o=n[++r];Tc(a)?e.setProperty(t,a,o):e.setAttribute(t,a,o),r++}}return r}function wc(e){return e===3||e===4||e===6}function Tc(e){return e.charCodeAt(0)===64}function Ec(e,t){if(t!==null&&t.length!==0){if(e===null||e.length===0)e=t.slice();else{let n=-1;for(let r=0;r<t.length;r++){let i=t[r];typeof i==`number`?n=i:n===0||(n===-1||n===2?Dc(e,n,i,null,t[++r]):Dc(e,n,i,null,null))}}}return e}function Dc(e,t,n,r,i){let a=0,o=e.length;if(t===-1)o=-1;else for(;a<e.length;){let n=e[a++];if(typeof n==`number`){if(n===t){o=-1;break}if(n>t){o=a-1;break}}}for(;a<e.length;){let t=e[a];if(typeof t==`number`)break;if(t===n){i!==null&&(e[a+1]=i);return}a++,i!==null&&a++}o!==-1&&(e.splice(o,0,t),a=o+1),e.splice(a++,0,n),i!==null&&e.splice(a++,0,i)}function Oc(e){return e!==yc}function kc(e){return e&32767}function Ac(e){return e>>16}function jc(e,t){let n=Ac(e),r=t;for(;n>0;)r=r[14],n--;return r}var Mc=!0;function Nc(e){let t=Mc;return Mc=e,t}var Pc=255,Fc=5,Ic=0,Lc={};function Rc(e,t,n){let r;typeof n==`string`?r=n.charCodeAt(0)||0:Object.hasOwn(n,gi)&&(r=n[gi]),r??=n[gi]=Ic++;let i=r&Pc,a=1<<i;t.data[e+(i>>Fc)]|=a}function zc(e,t){let n=Vc(e,t);if(n!==-1)return n;let r=t[1];r.firstCreatePass&&(e.injectorIndex=t.length,Bc(r.data,e),Bc(t,null),Bc(r.blueprint,null));let i=Hc(e,t),a=e.injectorIndex;if(Oc(i)){let e=kc(i),n=jc(i,t),r=n[1].data;for(let i=0;i<8;i++)t[a+i]=n[e+i]|r[e+i]}return t[a+8]=i,a}function Bc(e,t){e.push(0,0,0,0,0,0,0,0,t)}function Vc(e,t){return e.injectorIndex===-1||e.parent&&e.parent.injectorIndex===e.injectorIndex||t[e.injectorIndex+8]===null?-1:e.injectorIndex}function Hc(e,t){if(e.parent&&e.parent.injectorIndex!==-1)return e.parent.injectorIndex;let n=0,r=null,i=t;for(;i!==null;){if(r=rl(i),r===null)return yc;if(n++,i=i[14],r.injectorIndex!==-1)return r.injectorIndex|n<<16}return yc}function Uc(e,t,n){Rc(e,t,n)}function Wc(e,t,n){if(n&8||e!==void 0)return e;Di(t,`NodeInjector`)}function Gc(e,t,n,r){if(n&8&&r===void 0&&(r=null),!(n&3)){let i=e[9],a=Mi(void 0);try{return i?i.get(t,r,n&8):Ni(t,r,n&8)}finally{Mi(a)}}return Wc(r,t,n)}function Kc(e,t,n,r=0,i){if(e!==null){if(t[2]&2048&&!(r&2)){let i=nl(e,t,n,r,Lc);if(i!==Lc)return i}let i=qc(e,t,n,r,Lc);if(i!==Lc)return i}return Gc(t,n,r,i)}function qc(e,t,n,r,i){let a=Zc(n);if(typeof a==`function`){if(!Vo(t,e,r))return r&1?Wc(i,n,r):Gc(t,n,r,i);try{let e;if(e=a(r),e==null&&!(r&8))Di(n);else return e}finally{Ko()}}else if(typeof a==`number`){let i=null,o=Vc(e,t),s=yc,c=r&1?t[15][5]:null;for((o===-1||r&4)&&(s=o===-1?Hc(e,t):t[o+8],s===yc||!$c(r,!1)?o=-1:(i=t[1],o=kc(s),t=jc(s,t)));o!==-1;){let e=t[1];if(Qc(a,o,e.data)){let e=Jc(o,t,n,i,r,c);if(e!==Lc)return e}s=t[o+8],s!==yc&&$c(r,t[1].data[o+8]===c)&&Qc(a,o,t)?(i=e,o=kc(s),t=jc(s,t)):o=-1}}return i}function Jc(e,t,n,r,i,a){let o=t[1],s=o.data[e+8],c=Yc(s,o,n,r==null?La(s)&&Mc:r!=o&&!!(s.type&3),i&1&&a===s);return c===null?Lc:Xc(t,o,c,s,i)}function Yc(e,t,n,r,i){let a=e.providerIndexes,o=t.data,s=a&1048575,c=e.directiveStart,l=e.directiveEnd,u=a>>20,d=r?s:s+u,f=i?s+u:l;for(let e=d;e<f;e++){let t=o[e];if(e<c&&n===t||e>=c&&t.type===n)return e}if(i){let e=o[c];if(e&&za(e)&&e.type===n)return c}return null}function Xc(e,t,n,r,i){let a=e[n],o=t.data;if(a instanceof bc){let s=a;if(s.resolving)throw Ei(``);let c=Nc(s.canSeeViewProviders);s.resolving=!0,o[n].type||o[n];let l=s.injectImpl?Mi(s.injectImpl):null;Vo(e,r,0);try{a=e[n]=s.factory(void 0,i,o,e,r),t.firstCreatePass&&n>=r.directiveStart&&dc(n,o[n],t)}finally{l!==null&&Mi(l),Nc(c),s.resolving=!1,Ko()}}return a}function Zc(e){if(typeof e==`string`)return e.charCodeAt(0)||0;let t=Object.hasOwn(e,gi)?e[gi]:void 0;return typeof t==`number`?t>=0?t&Pc:tl:t}function Qc(e,t,n){let r=1<<e;return!!(n[t+(e>>Fc)]&r)}function $c(e,t){return!(e&2)&&!(e&1&&t)}var el=class{_tNode;_lView;constructor(e,t){this._tNode=e,this._lView=t}get(e,t,n){return Kc(this._tNode,this._lView,e,zi(n),t)}};function tl(){return new el(xo(),I())}function nl(e,t,n,r,i){let a=e,o=t;for(;a!==null&&o!==null&&o[2]&2048&&!Ba(o);){let e=qc(a,o,n,r|2,Lc);if(e!==Lc)return e;r&=-5;let t=a.parent;if(!t){let e=o[20];if(e){let t=e.get(n,Lc,r);if(t!==Lc)return t}t=rl(o),o=o[14]}a=t}return i}function rl(e){let t=e[1],n=t.type;return n===2?t.declTNode:n===1?e[5]:null}var il=()=>(typeof requestIdleCallback<`u`?requestIdleCallback:e=>setTimeout(e)).bind(globalThis),al=()=>(typeof requestIdleCallback<`u`?cancelIdleCallback:clearTimeout).bind(globalThis),ol=new N(``,{factory:()=>new sl}),sl=class{requestIdleCallback=il();cancelIdleCallback=al();requestOnIdle(e,t){return this.requestIdleCallback(e,t)}cancelOnIdle(e){return this.cancelIdleCallback(e)}};function cl(e){return{token:e.token,providedIn:e.autoProvided===!1?null:`root`,factory:e.factory,value:void 0}}function ll(){return ul(xo(),I())}function ul(e,t){return new dl(Ga(e,t))}var dl=(()=>{class e{nativeElement;constructor(e){this.nativeElement=e}static __NG_ELEMENT_ID__=ll}return e})();function fl(e){return(e.flags&128)==128}var pl=(function(e){return e[e.OnPush=0]=`OnPush`,e[e.Eager=1]=`Eager`,e[e.Default=1]=`Default`,e})(pl||{}),ml=new Map,hl=0;function gl(){return hl++}function _l(e){ml.set(e[19],e)}function vl(e){ml.delete(e[19])}var yl=`__ngContext__`;function bl(e,t){Pa(t)?(e[yl]=t[19],_l(t)):e[yl]=t}function xl(e){return Cl(e[12])}function Sl(e){return Cl(e[4])}function Cl(e){for(;e!==null&&!Fa(e);)e=e[4];return e}var wl=void 0;function Tl(e){wl=e}function El(){if(wl!==void 0)return wl;if(typeof document<`u`)return document;throw new M(210,!1)}var Dl=!1,Ol=new N(``,{factory:()=>Dl}),kl=new N(``),Al=new WeakMap;function jl(e,t){if(typeof e!=`object`||!e)return;let n=Al.get(e);n||(n=new WeakSet,Al.set(e,n)),n.add(t)}var Ml=new N(``);function Nl(e){return(e.flags&32)==32}var Pl=()=>null;function Fl(e,t,n=!1){return Pl(e,t,n)}function Il(e){return e.get(kl,!1,{optional:!0})}function Ll(e,t){let n=e.contentQueries;if(n!==null){let r=j(null);try{for(let r=0;r<n.length;r+=2){let i=n[r],a=n[r+1];if(a!==-1){let n=e.data[a];zo(i),n.contentQueries(2,t[a],a)}}}finally{j(r)}}}function Rl(e,t,n){zo(0);let r=j(null);try{t(e,n)}finally{j(r)}}function zl(e,t,n){if(Ia(t)){let r=j(null);try{let r=t.directiveStart,i=t.directiveEnd;for(let t=r;t<i;t++){let r=e.data[t];if(r.contentQueries){let e=n[t];r.contentQueries(1,e,t)}}}finally{j(r)}}}var Bl=(function(e){return e[e.Emulated=0]=`Emulated`,e[e.None=2]=`None`,e[e.ShadowDom=3]=`ShadowDom`,e[e.ExperimentalIsolatedShadowDom=4]=`ExperimentalIsolatedShadowDom`,e})(Bl||{}),Vl=class{changingThisBreaksApplicationSecurity;constructor(e){this.changingThisBreaksApplicationSecurity=e}toString(){return`SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Jr})`}};function Hl(e){return e instanceof Vl?e.changingThisBreaksApplicationSecurity:e}var Ul=/^>|^->|<!--|-->|--!>|<!-$/g,Wl=/(<|>)/g,Gl=`​$1​`;function Kl(e){return e.replace(Ul,e=>e.replace(Wl,Gl))}function ql(e,t){return e.createText(t)}function Jl(e,t,n){e.setValue(t,n)}function Yl(e,t){return e.createComment(Kl(t))}function Xl(e,t,n){return e.createElement(t,n)}function Zl(e,t,n,r,i){e.insertBefore(t,n,r,i)}function Ql(e,t,n){e.appendChild(t,n)}function $l(e,t,n,r,i){r===null?Ql(e,t,n):Zl(e,t,n,r,i)}function eu(e,t,n,r){e.removeChild(null,t,n,r)}function tu(e,t,n){e.setAttribute(t,`style`,n)}function nu(e,t,n){n===``?e.removeAttribute(t,`class`):e.setAttribute(t,`class`,n)}function ru(e,t,n){let{mergedAttrs:r,classes:i,styles:a}=n;r!==null&&Cc(e,t,r),i!==null&&nu(e,t,i),a!==null&&tu(e,t,a)}function iu(e,t,n){let r=e.length;for(;;){let i=e.indexOf(t,n);if(i===-1)return i;if(i===0||e.charCodeAt(i-1)<=32){let n=t.length;if(i+n===r||e.charCodeAt(i+n)<=32)return i}n=i+1}}var au=`ng-template`;function ou(e,t,n,r){let i=0;if(r){for(;i<t.length&&typeof t[i]==`string`;i+=2)if(t[i]===`class`&&iu(t[i+1].toLowerCase(),n,0)!==-1)return!0}else if(su(e))return!1;if(i=t.indexOf(1,i),i>-1){let e;for(;++i<t.length&&typeof(e=t[i])==`string`;)if(e.toLowerCase()===n)return!0}return!1}function su(e){return e.type===4&&e.value!==au}function cu(e,t,n){return t===(e.type===4&&!n?au:e.value)}function lu(e,t,n){let r=4,i=e.attrs,a=i===null?0:pu(i),o=!1;for(let s=0;s<t.length;s++){let c=t[s];if(typeof c==`number`){if(!o&&!uu(r)&&!uu(c))return!1;if(o&&uu(c))continue;o=!1,r=c|r&1;continue}if(!o){if(r&4){if(r=2|r&1,c!==``&&!cu(e,c,n)||c===``&&t.length===1){if(uu(r))return!1;o=!0}}else if(r&8){if(i===null||!ou(e,i,c,n)){if(uu(r))return!1;o=!0}}else{let l=t[++s],u=du(c,i,su(e),n);if(u===-1){if(uu(r))return!1;o=!0;continue}if(l!==``){let e;if(e=u>a?``:i[u+1].toLowerCase(),r&2&&l!==e){if(uu(r))return!1;o=!0}}}}}return uu(r)||o}function uu(e){return!(e&1)}function du(e,t,n,r){if(t===null)return-1;let i=0;if(r||!n){let n=!1;for(;i<t.length;){let r=t[i];if(r===e)return i;if(r===3||r===6)n=!0;else if(r===1||r===2){let e=t[++i];for(;typeof e==`string`;)e=t[++i];continue}else if(r===4)break;else if(r===0){i+=4;continue}i+=n?1:2}return-1}return mu(t,e)}function fu(e,t,n=!1){for(let r=0;r<t.length;r++)if(lu(e,t[r],n))return!0;return!1}function pu(e){for(let t=0;t<e.length;t++){let n=e[t];if(wc(n))return t}return e.length}function mu(e,t){let n=e.indexOf(4);if(n>-1)for(n++;n<e.length;){let r=e[n];if(typeof r==`number`)return-1;if(r===t)return n;n++}return-1}function hu(e,t){return e?`:not(`+t.trim()+`)`:t}function gu(e){let t=e[0],n=1,r=2,i=``,a=!1;for(;n<e.length;){let o=e[n];if(typeof o==`string`){if(r&2){let t=e[++n];i+=`[`+o+(t.length>0?`="`+t+`"`:``)+`]`}else r&8?i+=`.`+o:r&4&&(i+=` `+o)}else i!==``&&!uu(o)&&(t+=hu(a,i),i=``),r=o,a||=!uu(r);n++}return i!==``&&(t+=hu(a,i)),t}function _u(e){return e.map(gu).join(`,`)}function vu(e){let t=[],n=[],r=1,i=2;for(;r<e.length;){let a=e[r];if(typeof a==`string`)i===2?a!==``&&t.push(a,e[++r]):i===8&&n.push(a);else{if(!uu(i))break;i=a}r++}return n.length&&t.push(1,...n),t}var yu={},bu=(function(e){return e[e.Important=1]=`Important`,e[e.DashCase=2]=`DashCase`,e})(bu||{}),xu;function Su(e,t){return xu(e,t)}var Cu=new Set;typeof document<`u`&&document?.documentElement?.getAnimations;var wu=new WeakMap;function Tu(e){return e?e[14]??e:null}var Eu=new WeakSet;function Du(e,t,n){let r=wu.get(e);if(!r||r.length===0)return;let i=t.parentNode,a=t.previousSibling,o=Tu(n);for(let e=r.length-1;e>=0;e--){let{el:n,declarationView:s}=r[e],c=n.parentNode;n===t?(r.splice(e,1),Eu.add(n),n.dispatchEvent(new CustomEvent(`animationend`,{detail:{cancel:!0}}))):(a&&n===a||c&&i&&c!==i&&(o===null||s===null||o===s))&&(r.splice(e,1),n.dispatchEvent(new CustomEvent(`animationend`,{detail:{cancel:!0}})),n.parentNode?.removeChild(n))}}function Ou(e,t,n){let r=Tu(n),i=wu.get(e);i?i.some(e=>e.el===t)||i.push({el:t,declarationView:r}):wu.set(e,[{el:t,declarationView:r}])}var ku=(function(e){return e[e.CHANGE_DETECTION=0]=`CHANGE_DETECTION`,e[e.AFTER_NEXT_RENDER=1]=`AFTER_NEXT_RENDER`,e})(ku||{}),Au=new N(``),ju=new Set;function Mu(e){ju.has(e)||(ju.add(e),performance?.mark?.(`mark_feature_usage`,{detail:{feature:e}}))}var Nu=(()=>{class e{impl=null;execute(){this.impl?.execute()}static ɵprov=ii({token:e,providedIn:`root`,factory:()=>new e})}return e})(),Pu=new N(``,{factory:()=>{let e=P(ya),t=new Set;return e.onDestroy(()=>t.clear()),{queue:t,isScheduled:!1,scheduler:null,injector:e}}});function Fu(e,t,n){let r=e.get(Pu);if(Array.isArray(t))for(let e of t)r.queue.add(e),n?.detachedLeaveAnimationFns?.push(e);else r.queue.add(t),n?.detachedLeaveAnimationFns?.push(t);r.scheduler&&r.scheduler(e)}function Iu(e,t){let n=e.get(Pu);if(Array.isArray(t))for(let e of t)n.queue.delete(e);else n.queue.delete(t)}function Lu(e,t){let n=e.get(Pu);if(t.detachedLeaveAnimationFns){for(let e of t.detachedLeaveAnimationFns)n.queue.delete(e);t.detachedLeaveAnimationFns=void 0}}function Ru(e,t){for(let[n,r]of t)Fu(e,r.animateFns)}function zu(e,t,n,r){let i=e?.[26]?.enter;t!==null&&i&&i.has(n.index)&&Ru(r,i)}function Bu(e,t,n,r){try{n.get(ta)}catch{return r(!1)}let i=e?.[26];i?.enter?.has(t.index)&&Iu(n,i.enter.get(t.index).animateFns);let a=Vu(e,t,i);if(a.size===0){let n=!1;if(e){let r=[];Uu(e,t,r),n=r.length>0}if(!n)return r(!1)}e&&Cu.add(e[19]),Fu(n,()=>Hu(e,t,i||void 0,a,r),i||void 0)}function Vu(e,t,n){let r=new Map,i=n?.leave;if(i&&i.has(t.index)&&r.set(t.index,i.get(t.index)),e&&i)for(let[n,a]of i){if(r.has(n))continue;let i=e[1].data[n].parent;for(;i;){if(i===t){r.set(n,a);break}i=i.parent}}return r}function Hu(e,t,n,r,i){let a=[];if(n&&n.leave)for(let[e]of r){if(!n.leave.has(e))continue;let t=n.leave.get(e);for(let e of t.animateFns){let{promise:t}=e();a.push(t)}n.detachedLeaveAnimationFns=void 0}if(e&&Uu(e,t,a),a.length>0){let t=n||e?.[26];if(t){let n=t.running;n&&a.push(n),t.running=Promise.allSettled(a),Gu(e,t.running,i)}else Promise.allSettled(a).then(()=>{e&&Cu.delete(e[19]),i(!0)})}else e&&Cu.delete(e[19]),i(!1)}function Uu(e,t,n){if(t.type&12){let r=e[t.index];if(Fa(r))for(let e=10;e<r.length;e++){let t=r[e];t[1].type===2&&Wu(t,n)}}let r=t.child;for(;r;)Uu(e,r,n),r=r.next}function Wu(e,t){let n=e[26];if(n&&n.leave)for(let e of n.leave.values())for(let n of e.animateFns){let{promise:e}=n();t.push(e)}let r=e[1].firstChild;for(;r;)Uu(e,r,t),r=r.next}function Gu(e,t,n){t.then(()=>{e[26]?.running===t&&(e[26].running=void 0,Cu.delete(e[19])),n(!0)})}function Ku(e,t,n,r,i,a,o,s){if(i!=null){let c,l=!1;Fa(i)?c=i:Pa(i)&&(l=!0,i=i[0]);let u=Ua(i);e===0&&r!==null?(zu(s,r,a,n),o==null?Ql(t,r,u):Zl(t,r,u,o||null,!0)):e===1&&r!==null?(zu(s,r,a,n),Zl(t,r,u,o||null,!0),Du(a,u,s)):e===2?(s?.[26]?.leave?.has(a.index)&&Ou(a,u,s),Eu.delete(u),Bu(s,a,n,e=>{if(Eu.has(u)){Eu.delete(u);return}eu(t,u,l,e)})):e===3&&(Eu.delete(u),Bu(s,a,n,()=>{t.destroyNode(u)})),c!=null&&hd(t,e,n,c,a,r,o)}}function qu(e,t){Yu(e,t),t[0]=null,t[5]=null}function Ju(e,t,n,r,i,a){r[0]=i,r[5]=t,fd(e,r,n,1,i,a)}function Yu(e,t){t[10].changeDetectionScheduler?.notify(9),fd(e,t,t[11],2,null,null)}function Xu(e){let t=e[12];if(!t)return $u(e[1],e);for(;t;){let n=null;if(Pa(t))n=t[12];else{let e=t[10];e&&(n=e)}if(!n){for(;t&&!t[4]&&t!==e;)Pa(t)&&$u(t[1],t),t=t[3];t===null&&(t=e),Pa(t)&&$u(t[1],t),n=t&&t[4]}t=n}}function Zu(e,t){let n=e[9],r=n.indexOf(t);n.splice(r,1)}function Qu(e,t){if(Va(t))return;let n=t[11];n.destroyNode&&fd(e,t,n,3,null,null),Xu(t)}function $u(e,t){if(Va(t))return;let n=j(null);try{t[2]&=-129,t[2]|=256,t[24]&&yn(t[24]),td(e,t),ed(e,t),t[1].type===1&&t[11].destroy();let n=t[16];if(n!==null&&Fa(t[3])){n!==t[3]&&Zu(n,t);let r=t[18];r!==null&&r.detachView(e)}vl(t)}finally{j(n)}}function ed(e,t){let n=e.cleanup,r=t[7];if(n!==null)for(let e=0;e<n.length-1;e+=2)if(typeof n[e]==`string`){let t=n[e+3];t>=0?r[t]():r[-t].unsubscribe(),e+=2}else{let t=r[n[e+1]];n[e].call(t)}r!==null&&(t[7]=null);let i=t[21];if(i!==null){t[21]=null;for(let e=0;e<i.length;e++){let t=i[e];t()}}let a=t[23];if(a!==null){t[23]=null;for(let e of a)e.destroy()}}function td(e,t){let n;if(e!=null&&(n=e.destroyHooks)!=null)for(let e=0;e<n.length;e+=2){let r=t[n[e]];if(!(r instanceof bc)){let t=n[e+1];if(Array.isArray(t))for(let e=0;e<t.length;e+=2){let n=r[t[e]],i=t[e+1];z(R.LifecycleHookStart,n,i);try{i.call(n)}finally{z(R.LifecycleHookEnd,n,i)}}else{z(R.LifecycleHookStart,r,t);try{t.call(r)}finally{z(R.LifecycleHookEnd,r,t)}}}}}function nd(e,t,n){if(t===null)throw new M(510,!1);return rd(e,t.parent,n)}function rd(e,t,n){let r=t;for(;r!==null&&r.type&168;)t=r,r=t.parent;if(r===null)return n[0];if(La(r)){let{encapsulation:t}=e.data[r.directiveStart+r.componentOffset];if(t===Bl.None||t===Bl.Emulated)return null}return Ga(r,n)}function id(e,t,n){return od(e,t,n)}function ad(e,t,n){return e.type&40?Ga(e,n):null}var od=ad;function sd(e,t,n,r){let i=nd(e,r,t),a=t[11],o=id(r.parent||t[5],r,t);if(i!=null){if(Array.isArray(n))for(let e=0;e<n.length;e++)$l(a,i,n[e],o,!1);else $l(a,i,n,o,!1)}}function cd(e,t){if(t!==null){let n=t.type;if(n&3)return Ga(t,e);if(n&4)return ud(-1,e[t.index]);if(n&8){let n=t.child;if(n!==null)return cd(e,n);{let n=e[t.index];return Fa(n)?ud(-1,n):Ua(n)}}if(n&128)return cd(e,t.next);if(n&32)return Su(t,e)()||Ua(e[t.index]);{let n=ld(e,t);return n===null?cd(e,t.next):Array.isArray(n)?n[0]:cd(oo(e[15]),n)}}return null}function ld(e,t){if(t!==null){let n=e[15][5],r=t.projection;return n.projection[r]}return null}function ud(e,t){let n=10+e+1;if(n<t.length){let e=t[n],r=e[1].firstChild;if(r!==null)return cd(e,r)}return t[7]}function dd(e,t,n,r,i,a,o){for(;n!=null;){let s=r[9];if(n.type===128){n=n.next;continue}let c=r[n.index],l=n.type;if(o&&t===0&&(c&&bl(Ua(c),r),n.flags|=2),!Nl(n)){if(l&8)dd(e,t,n.child,r,i,a,!1),Ku(t,e,s,i,c,n,a,r);else if(l&32){let o=Su(n,r),l;for(;l=o();)Ku(t,e,s,i,l,n,a,r);Ku(t,e,s,i,c,n,a,r)}else l&16?md(e,t,r,n,i,a):Ku(t,e,s,i,c,n,a,r)}n=o?n.projectionNext:n.next}}function fd(e,t,n,r,i,a){e.type===3?pd(n,r,t,i,a):dd(n,r,e.firstChild,t,i,a,!1)}function pd(e,t,n,r,i){let a=n[1].firstChild,o=a.next,s=Ua(n[a.index]),c=Ua(n[o.index]),l=o.index+1,u=n[l];if(t===1||t===0)r!==null&&(u&&u.hasChildNodes()?Zl(e,r,u,i,!0):(Zl(e,r,s,i,!0),Zl(e,r,c,i,!0)));else if(t===2){if(u||(u=document.createDocumentFragment(),n[l]=u),s&&s.parentNode===u)return;let e=s;for(;e!==null;){let t=e.nextSibling;if(u.appendChild(e),e===c)break;e=t}}}function md(e,t,n,r,i,a){let o=n[15],s=o[5].projection[r.projection];if(Array.isArray(s))for(let o=0;o<s.length;o++){let c=s[o];Ku(t,e,n[9],i,c,r,a,n)}else{let n=s,c=o[3];fl(r)&&(n.flags|=128),dd(e,t,n,c,i,a,!0)}}function hd(e,t,n,r,i,a,o){let s=r[7];if(s!==Ua(r)&&Ku(t,e,n,a,s,i,o),!(r[2]&4))for(let n=10;n<r.length;n++){let i=r[n];fd(i[1],i,e,t,a,s)}}function gd(e,t,n,r,i){if(t)i?e.addClass(n,r):e.removeClass(n,r);else{let t=r.indexOf(`-`)===-1?void 0:bu.DashCase;i==null?e.removeStyle(n,r,t):(typeof i==`string`&&i.endsWith(`!important`)&&(i=i.slice(0,-10),t|=bu.Important),e.setStyle(n,r,i,t))}}function _d(e,t,n,r,i,a,o,s,c,l,u){let d=27+r,f=d+i,p=vd(d,f),m=typeof l==`function`?l():l;return p[1]={type:e,blueprint:p,template:n,queries:null,viewQuery:s,declTNode:t,data:p.slice().fill(null,d),bindingStartIndex:d,expandoStartIndex:f,hostBindingOpCodes:null,firstCreatePass:!0,firstUpdatePass:!0,staticViewQueries:!1,staticContentQueries:!1,preOrderHooks:null,preOrderCheckHooks:null,contentHooks:null,contentCheckHooks:null,viewHooks:null,viewCheckHooks:null,destroyHooks:null,cleanup:null,contentQueries:null,components:null,directiveRegistry:typeof a==`function`?a():a,pipeRegistry:typeof o==`function`?o():o,firstChild:null,schemas:c,consts:m,incompleteFirstPass:!1,ssrId:u}}function vd(e,t){let n=[];for(let r=0;r<t;r++)n.push(r<e?null:yu);return n}function yd(e){let t=e.tView;return t===null||t.incompleteFirstPass?e.tView=_d(1,null,e.template,e.decls,e.vars,e.directiveDefs,e.pipeDefs,e.viewQuery,e.schemas,e.consts,e.id):t}function bd(e,t,n,r,i,a,o,s,c,l,u){let d=t.blueprint.slice();return d[0]=i,d[2]=r|1228,(l!==null||e&&e[2]&2048)&&(d[2]|=2048),Qa(d),d[3]=d[14]=e,d[8]=n,d[10]=o||e&&e[10],d[11]=s||e&&e[11],d[9]=c||e&&e[9]||null,d[5]=a,d[19]=gl(),d[6]=u,d[20]=l,d[15]=t.type==2?e[15]:d,d}function xd(e,t,n){let r=Ga(t,e),i=yd(n),a=e[10].rendererFactory,o=wd(e,bd(e,i,null,Sd(n),r,t,null,a.createRenderer(r,n),null,null,null));return e[t.index]=o}function Sd(e){let t=16;return e.signals?t=4096:e.onPush&&(t=64),t}function Cd(e,t,n,r){if(n===0)return-1;let i=t.length;for(let i=0;i<n;i++)t.push(r),e.blueprint.push(r),e.data.push(null);return i}function wd(e,t){return e[12]?e[13][4]=t:e[12]=t,e[13]=t,t}function B(e=1){Td(vo(),I(),Yo()+e,!1)}function Td(e,t,n,r){if(!r){if((t[2]&3)==3){let r=e.preOrderCheckHooks;r!==null&&pc(t,r,n)}else{let r=e.preOrderHooks;r!==null&&mc(t,r,0,n)}}Xo(n)}var Ed=(function(e){return e[e.None=0]=`None`,e[e.SignalBased=1]=`SignalBased`,e[e.HasDecoratorInputTransform=2]=`HasDecoratorInputTransform`,e})(Ed||{});function Dd(e,t,n,r){let i=j(null);try{let[i,a,o]=e.inputs[n],s=null;(a&Ed.SignalBased)!==0&&(s=t[i][rn]),s!==null&&s.transformFn!==void 0?r=s.transformFn(r):o!==null&&(r=o.call(t,r)),e.setInput===null?sc(t,s,i,r):e.setInput(t,s,r,n,i)}finally{j(i)}}function Od(e,t,n,r,i){let a=Yo(),o=r&2;try{Xo(-1),o&&t.length>27&&Td(e,t,27,!1),z(o?R.TemplateUpdateStart:R.TemplateCreateStart,i,n),n(r,i)}finally{Xo(a),z(o?R.TemplateUpdateEnd:R.TemplateCreateEnd,i,n)}}function kd(e,t,n){Id(e,t,n),(n.flags&64)==64&&Ld(e,t,n)}function Ad(e,t,n=Ga){let r=t.localNames;if(r!==null){let i=t.index+1;for(let a=0;a<r.length;a+=2){let o=r[a+1],s=o===-1?n(t,e):e[o];e[i++]=s}}}function jd(e,t,n,r){let i=r.get(Ol,Dl)||n===Bl.ShadowDom||n===Bl.ExperimentalIsolatedShadowDom;return e.selectRootElement(t,i)}function Md(e){return e===`class`?`className`:e===`for`?`htmlFor`:e===`formaction`?`formAction`:e===`innerHtml`?`innerHTML`:e===`readonly`?`readOnly`:e===`tabindex`?`tabIndex`:e}function Nd(e,t,n,r,i,a){let o=t[1];if(Kd(e,o,t,n,r)){La(e)&&Fd(t,e.index);return}e.type&3&&(n=Md(n)),Pd(e,t,n,r,i,a)}function Pd(e,t,n,r,i,a){if(e.type&3){let o=Ga(e,t);r=a==null?r:a(r,e.value||``,n),i.setProperty(o,n,r)}else e.type&12}function Fd(e,t){let n=Ya(t,e);n[2]&16||(n[2]|=64)}function Id(e,t,n){let r=n.directiveStart,i=n.directiveEnd;La(n)&&xd(t,n,e.data[r+n.componentOffset]),e.firstCreatePass||zc(n,t);let a=n.initialInputs;for(let o=r;o<i;o++){let i=e.data[o],s=Xc(t,e,o,n);if(bl(s,t),a!==null&&Hd(t,o-r,s,i,n,a),za(i)){let r=Ya(n.index,t);r[8]=Xc(t,e,o,n)}}}function Ld(e,t,n){let r=n.directiveStart,i=n.directiveEnd,a=n.index,o=Io();try{Xo(a);for(let n=r;n<i;n++){let r=e.data[n],i=t[n];Lo(n),(r.hostBindings!==null||r.hostVars!==0||r.hostAttrs!==null)&&Rd(r,i)}}finally{Xo(-1),Lo(o)}}function Rd(e,t){e.hostBindings!==null&&e.hostBindings(1,t)}function zd(e,t){let n=e.directiveRegistry,r=null;if(n)for(let e=0;e<n.length;e++){let i=n[e];fu(t,i.selectors,!1)&&(r??=[],za(i)?r.unshift(i):r.push(i))}return r}function Bd(e,t,n,r,i,a){let o=Ga(e,t);Vd(t[11],o,a,e.value,n,r,i)}function Vd(e,t,n,r,i,a,o){if(a==null)o?.(a,r||``,i),e.removeAttribute(t,i,n);else{let s=o==null?Si(a):o(a,r||``,i);e.setAttribute(t,i,s,n)}}function Hd(e,t,n,r,i,a){let o=a[t];if(o!==null)for(let e=0;e<o.length;e+=2){let t=o[e],i=o[e+1];Dd(r,n,t,i)}}function Ud(e,t,n,r,i){let a=27+n,o=t[1],s=i(o,t,e,r,n);t[a]=s,wo(e,!0);let c=e.type===2;return c?(ru(t[11],s,e),(uo()===0||Ra(e))&&bl(s,t),fo()):bl(s,t),rs()&&(!c||!Nl(e))&&sd(o,t,s,e),e}function Wd(e){let t=e;return To()?Eo():(t=t.parent,wo(t,!1)),t}function Gd(e,t){let n=e[9];if(!n)return;let r;try{r=n.get(Ps,null)}catch{r=null}r?.(t)}function Kd(e,t,n,r,i){let a=e.inputs?.[r],o=e.hostDirectiveInputs?.[r],s=!1;if(o)for(let e=0;e<o.length;e+=2){let r=o[e],a=o[e+1],c=t.data[r];Dd(c,n[r],a,i),s=!0}if(a)for(let e of a){let a=n[e],o=t.data[e];Dd(o,a,r,i),s=!0}return s}function qd(e,t){let n=Ya(t,e),r=n[1];Jd(r,n);let i=n[0];i!==null&&n[6]===null&&(n[6]=Fl(i,n[9])),z(R.ComponentStart);try{Yd(r,n,n[8])}finally{z(R.ComponentEnd,n[8])}}function Jd(e,t){for(let n=t.length;n<e.blueprint.length;n++)t.push(e.blueprint[n])}function Yd(e,t,n){Ho(t);try{let r=e.viewQuery;r!==null&&Rl(1,r,n);let i=e.template;i!==null&&Od(e,t,i,1,n),e.firstCreatePass&&=!1,t[18]?.finishViewCreation(e),e.staticContentQueries&&Ll(e,t),e.staticViewQueries&&Rl(2,e.viewQuery,n);let a=e.components;a!==null&&Xd(t,a)}catch(t){throw e.firstCreatePass&&=(e.incompleteFirstPass=!0,!1),t}finally{t[2]&=-5,qo()}}function Xd(e,t){for(let n=0;n<t.length;n++)qd(e,t[n])}function Zd(e,t,n,r){let i=j(null);try{let i=t.tView,a=bd(e,i,n,e[2]&4096?4096:16,null,t,null,null,r?.injector??null,r?.embeddedViewInjector??null,r?.dehydratedView??null);a[16]=e[t.index];let o=e[18];return o!==null&&(a[18]=o.createEmbeddedView(i)),Yd(i,a,n),a}finally{j(i)}}function Qd(e,t){return!t||t.firstChild===null||fl(e)}function $d(e,t,n,r,i=!1){if(e.type===3){let n=e.firstChild,i=n.next,a=Ua(t[n.index]),o=Ua(t[i.index]),s=a;for(;s!==null&&(r.push(s),s!==o);)s=s.nextSibling;return r}for(;n!==null;){if(n.type===128){n=i?n.projectionNext:n.next;continue}let a=t[n.index];if(a!==null){if(Fa(a)){let e=a[7];e!==a[0]&&r.push(Ua(a)),a[2]&4||ef(a,r),r.push(e)}else r.push(Ua(a))}let o=n.type;if(o&8)$d(e,t,n.child,r);else if(o&32){let e=Su(n,t),i;for(;i=e();)r.push(i)}else if(o&16){let e=ld(t,n);if(Array.isArray(e))r.push(...e);else{let n=oo(t[15]);$d(n[1],n,e,r,!0)}}n=i?n.projectionNext:n.next}return r}function ef(e,t){for(let n=10;n<e.length;n++){let r=e[n],i=r[1].firstChild;i!==null&&$d(r[1],r,i,t)}}function tf(e){if(e[25]!==null){for(let t of e[25])t.impl.addSequence(t);e[25].length=0}}var nf=[];function rf(e){return e[24]??af(e)}function af(e){let t=nf.pop()??Object.create(sf);return t.lView=e,t}function of(e){e.lView[24]!==e&&(e.lView=null,nf.push(e))}var sf={...on,consumerIsAlwaysLive:!0,kind:`template`,consumerMarkedDirty:e=>{ro(e.lView)},consumerOnSignalRead(){this.lView[24]=this}};function cf(e){let t=e[24]??Object.create(lf);return t.lView=e,t}var lf={...on,consumerIsAlwaysLive:!0,kind:`template`,consumerMarkedDirty:e=>{let t=oo(e.lView);for(;t&&!uf(t[1]);)t=oo(t);t&&$a(t)},consumerOnSignalRead(){this.lView[24]=this}};function uf(e){return e.type!==2}function df(e){if(e[23]===null)return;let t=!0;for(;t;){let n=!1;for(let t of e[23])if(t.dirty&&(n=!0,t.zone===null||Zone.current===t.zone?t.run():t.zone.run(()=>t.run()),e[23]===null))return;t=n&&!!(e[2]&8192)}}var ff=100;function pf(e,t=0){let n=e[10].rendererFactory;n.begin?.();try{mf(e,t)}finally{n.end?.()}}function mf(e,t){let n=Do();try{Oo(!0),bf(e,t);let n=0;for(;to(e);){if(n===ff)throw new M(103,!1);n++,bf(e,1)}}finally{Oo(n)}}function hf(e,t,n,r){if(Va(t))return;let i=t[2];Ho(t);let a=!0,o=null,s=null;uf(e)?(s=rf(t),o=mn(s)):an()===null?(a=!1,s=cf(t),o=mn(s)):t[24]&&=(yn(t[24]),null);try{Qa(t),jo(e.bindingStartIndex),n!==null&&Od(e,t,n,2,r);let a=(i&3)==3;if(a){let n=e.preOrderCheckHooks;n!==null&&pc(t,n,null)}else{let n=e.preOrderHooks;n!==null&&mc(t,n,0,null),hc(t,0)}if(_f(t),df(t),gf(t,0),e.contentQueries!==null&&Ll(e,t),a){let n=e.contentCheckHooks;n!==null&&pc(t,n)}else{let n=e.contentHooks;n!==null&&mc(t,n,1),hc(t,1)}Sf(e,t);let o=e.components;o!==null&&xf(t,o,0);let s=e.viewQuery;if(s!==null&&Rl(2,s,r),a){let n=e.viewCheckHooks;n!==null&&pc(t,n)}else{let n=e.viewHooks;n!==null&&mc(t,n,2),hc(t,2)}if(e.firstUpdatePass===!0&&(e.firstUpdatePass=!1),t[22]){for(let e of t[22])e();t[22]=null}tf(t),t[2]&=-73}catch(e){throw ro(t),e}finally{s!==null&&(gn(s,o),a&&of(s)),qo()}}function gf(e,t){for(let n=xl(e);n!==null;n=Sl(n))for(let e=10;e<n.length;e++){let r=n[e];yf(r,t)}}function _f(e){for(let t=xl(e);t!==null;t=Sl(t)){if(!(t[2]&2))continue;let e=t[9];for(let t=0;t<e.length;t++){let n=e[t];$a(n)}}}function vf(e,t,n){z(R.ComponentStart);let r=Ya(t,e);try{yf(r,n)}finally{z(R.ComponentEnd,r[8])}}function yf(e,t){Xa(e)&&bf(e,t)}function bf(e,t){let n=e[1],r=e[2],i=e[24],a=!!(t===0&&r&16);if(a||=!!(r&64&&t===0),a||=!!(r&1024),a||=!!(i?.dirty&&vn(i)),a||=!1,i&&(i.dirty=!1),e[2]&=-9217,a)hf(n,e,n.template,e[8]);else if(r&8192){let t=j(null);try{df(e),gf(e,1);let t=n.components;t!==null&&xf(e,t,1),tf(e)}finally{j(t)}}}function xf(e,t,n){for(let r=0;r<t.length;r++)vf(e,t[r],n)}function Sf(e,t){let n=e.hostBindingOpCodes;if(n!==null)try{for(let e=0;e<n.length;e++){let r=n[e];if(r<0)Xo(~r);else{let i=r,a=n[++e],o=n[++e];Fo(a,i);let s=t[i];z(R.HostBindingsUpdateStart,s);try{o(2,s)}finally{z(R.HostBindingsUpdateEnd,s)}}}}finally{Xo(-1)}}function Cf(e,t){let n=Do()?64:1088;for(e[10].changeDetectionScheduler?.notify(t);e;){e[2]|=n;let t=oo(e);if(Ba(e)&&!t)return e;e=t}return null}function wf(e,t,n,r){return[e,!0,0,t,null,r,null,n,null,null]}function Tf(e,t){let n=10+t;if(n<e.length)return e[n]}function Ef(e,t,n,r=!0){let i=t[1];if(kf(i,t,e,n),r){let r=ud(n,e),a=t[11],o=a.parentNode(e[7]);o!==null&&Ju(i,e[5],a,t,o,r)}let a=t[6];a!==null&&a.firstChild!==null&&(a.firstChild=null)}function Df(e,t){let n=Of(e,t);return n!==void 0&&Qu(n[1],n),n}function Of(e,t){if(e.length<=10)return;let n=10+t,r=e[n];if(r){let i=r[16];i!==null&&i!==e&&Zu(i,r),t>0&&(e[n-1][4]=r[4]);let a=Ki(e,10+t);qu(r[1],r);let o=a[18];o!==null&&o.detachView(a[1]),r[3]=null,r[4]=null,r[2]&=-129}return r}function kf(e,t,n,r){let i=10+r,a=n.length;r>0&&(n[i-1][4]=t),r<a-10?(t[4]=n[i],Gi(n,10+r,t)):(n.push(t),t[4]=null),t[3]=n;let o=t[16];o!==null&&n!==o&&Af(o,t);let s=t[18];s!==null&&s.insertView(e),no(t),t[2]|=128}function Af(e,t){let n=e[9],r=t[3];if(Pa(r))e[2]|=2;else{let n=r[3][15];t[15]!==n&&(e[2]|=2)}n===null?e[9]=[t]:n.push(t)}var jf=class{_lView;_cdRefInjectingView;_appRef=null;_attachedToViewContainer=!1;exhaustive;get rootNodes(){let e=this._lView,t=e[1];return $d(t,e,t.firstChild,[])}constructor(e,t){this._lView=e,this._cdRefInjectingView=t}get context(){return this._lView[8]}set context(e){this._lView[8]=e}get destroyed(){return Va(this._lView)}destroy(){if(this._appRef)this._appRef.detachView(this);else if(this._attachedToViewContainer){let e=this._lView[3];if(Fa(e)){let t=e[8],n=t?t.indexOf(this):-1;n>-1&&(Of(e,n),Ki(t,n))}this._attachedToViewContainer=!1}Qu(this._lView[1],this._lView)}onDestroy(e){io(this._lView,e)}markForCheck(){Cf(this._cdRefInjectingView||this._lView,4)}detach(){this._lView[2]&=-129}reattach(){no(this._lView),this._lView[2]|=128}detectChanges(){this._lView[2]|=1024,pf(this._lView)}checkNoChanges(){}attachToViewContainerRef(){if(this._appRef)throw new M(902,!1);this._attachedToViewContainer=!0}detachFromAppRef(){this._appRef=null;let e=Ba(this._lView),t=this._lView[16];t!==null&&!e&&Zu(t,this._lView),Yu(this._lView[1],this._lView)}attachToAppRef(e){if(this._attachedToViewContainer)throw new M(902,!1);this._appRef=e;let t=Ba(this._lView),n=this._lView[16];n!==null&&!t&&Af(n,this._lView),no(this._lView)}};function Mf(e,t,n,r,i){let a=e.data[t];if(a===null)a=Nf(e,t,n,r,i),Po()&&(a.flags|=32);else if(a.type&64){a.type=n,a.value=r,a.attrs=i;let e=Co();a.injectorIndex=e===null?-1:e.injectorIndex}return wo(a,!0),a}function Nf(e,t,n,r,i){let a=So(),o=To(),s=o?a:a&&a.parent,c=e.data[t]=Ff(e,s,n,t,r,i);return Pf(e,c,a,o),c}function Pf(e,t,n,r){e.firstChild===null&&(e.firstChild=t),n!==null&&(r?n.child==null&&t.parent!==null&&(n.child=t):n.next===null&&(n.next=t,t.prev=n))}function Ff(e,t,n,r,i,a){let o=t?t.injectorIndex:-1,s=0;return ho()&&(s|=128),{type:n,index:r,insertBeforeIndex:null,injectorIndex:o,directiveStart:-1,directiveEnd:-1,directiveStylingLast:-1,componentOffset:-1,controlDirectiveIndex:-1,customControlIndex:-1,propertyBindings:null,flags:s,providerIndexes:0,value:i,namespace:ts(),attrs:a,mergedAttrs:null,localNames:null,initialInputs:null,inputs:null,hostDirectiveInputs:null,outputs:null,hostDirectiveOutputs:null,directiveToIndex:null,tView:null,next:null,prev:null,projectionNext:null,child:null,parent:t,projection:null,styles:null,stylesWithoutHost:null,residualStyles:void 0,classes:null,classesWithoutHost:null,residualClasses:void 0,classBindings:0,styleBindings:0}}function If(e){let t=e[6]??[],n=e[3][11],r=[];for(let e of t)e.data.di===void 0?Lf(e,n):r.push(e);e[6]=r}function Lf(e,t){let n=0,r=e.firstChild;if(r){let i=e.data.r;for(;n<i;){let e=r.nextSibling;eu(t,r,!1),r=e,n++}}}var Rf=()=>null,zf=()=>null;function Bf(e,t){return Rf(e,t)}function Vf(e,t,n){return zf(e,t,n)}var Hf=class{},Uf=class{},Wf=(()=>{class e{static ɵprov=ii({token:e,providedIn:`root`,factory:()=>null})}return e})();function Gf(e){return e.debugInfo?.className||e.type.name||null}var Kf={},qf=class{injector;parentInjector;constructor(e,t){this.injector=e,this.parentInjector=t}get(e,t,n){let r=this.injector.get(e,Kf,n);return r!==Kf||t===Kf?r:this.parentInjector.get(e,t,n)}};function Jf(e,t,n){return e[t]=n}function Yf(e,t){return e[t]}function Xf(e,t,n){if(n===yu)return!1;let r=e[t];return!Object.is(r,n)&&(e[t]=n,!0)}function Zf(e,t,n,r){let i=Xf(e,t,n);return Xf(e,t+1,r)||i}function Qf(e,t,n,r,i){let a=Zf(e,t,n,r);return Xf(e,t+2,i)||a}function $f(e,t,n){return function r(i){let a=r.__ngNativeEl__;a!==void 0&&jl(i,a),Cf(La(e)?Ya(e.index,t):t,5);let o=t[8],s=ep(t,o,n,i),c=r.__ngNextListenerFn__;for(;c;)s=ep(t,o,c,i)&&s,c=c.__ngNextListenerFn__;return s}}function ep(e,t,n,r){let i=j(null);try{return z(R.OutputStart,t,n),n(r)!==!1}catch(t){return Gd(e,t),!1}finally{z(R.OutputEnd,t,n),j(i)}}function tp(e,t,n,r,i,a,o,s){let c=Ra(e),l=!1,u=null;if(!r&&c&&(u=rp(t,n,a,e.index)),u!==null){let e=u.__ngLastListenerFn__||u;e.__ngNextListenerFn__=o,u.__ngLastListenerFn__=o,l=!0}else{let o=Ga(e,n),c=r?r(o):o;r||(s.__ngNativeEl__=o);let l=i.listen(c,a,s);np(a)||ip(r?t=>r(Ua(t[e.index])):e.index,t,n,a,s,l,!1)}return l}function np(e){return e.startsWith(`animation`)||e.startsWith(`transition`)}function rp(e,t,n,r){let i=e.cleanup;if(i!=null)for(let e=0;e<i.length-1;e+=2){let a=i[e];if(a===n&&i[e+1]===r){let n=t[7],r=i[e+2];return n&&n.length>r?n[r]:null}typeof a==`string`&&(e+=2)}return null}function ip(e,t,n,r,i,a,o){let s=t.firstCreatePass?co(t):null,c=so(n),l=c.length;c.push(i,a),s&&s.push(r,e,l,(l+1)*(o?-1:1))}function ap(e,t,n,r,i,a){let o=t[n],s=t[1],c=o[s.data[n].outputs[r]].subscribe(a);ip(e.index,s,t,i,a,c,!0)}var op=Symbol(`BINDING`),sp=new N(``);function cp(e,t,n){let r=n?e.styles:null,i=n?e.classes:null,a=0;if(t!==null)for(let e=0;e<t.length;e++){let n=t[e];if(typeof n==`number`)a=n;else if(a==1)i=$r(i,n);else if(a==2){let i=n,a=t[++e];r=$r(r,i+`: `+a+`;`)}}n?e.styles=r:e.stylesWithoutHost=r,n?e.classes=i:e.classesWithoutHost=i}function lp(e,t=0){let n=I();return n===null?Ri(e,t):Kc(xo(),n,ni(e),t)}function up(e,t,n,r,i){let a=r===null?null:{"":-1},o=i(e,n);if(o!==null){let r=o,i=null,s=null;for(let e of o)if(e.resolveHostDirectives!==null){[r,i,s]=e.resolveHostDirectives(o);break}pp(e,t,n,r,a,i,s)}a!==null&&r!==null&&dp(n,r,a)}function dp(e,t,n){let r=e.localNames=[];for(let e=0;e<t.length;e+=2){let i=n[t[e+1]];if(i==null)throw new M(-301,!1);r.push(t[e],i)}}function fp(e,t,n){t.componentOffset=n,(e.components??=[]).push(t.index)}function pp(e,t,n,r,i,a,o){let s=r.length,c=null;for(let i=0;i<s;i++){let a=r[i];c===null&&za(a)&&(c=a,fp(e,n,i)),Uc(zc(n,t),e,a.type)}Cp(n,e.data.length,s),c?.viewProvidersResolver&&c.viewProvidersResolver(c);for(let e=0;e<s;e++){let t=r[e];t.providersResolver&&t.providersResolver(t)}let l=!1,u=!1,d=Cd(e,t,s,null);s>0&&(n.directiveToIndex=new Map);for(let c=0;c<s;c++){let s=r[c];if(n.mergedAttrs=Ec(n.mergedAttrs,s.hostAttrs),yp(e,n,t,d,s),Sp(d,s,i),o!==null&&o.has(s)){let[e,t]=o.get(s);n.directiveToIndex.set(s.type,[d,e+n.directiveStart,t+n.directiveStart])}else(a===null||!a.has(s))&&n.directiveToIndex.set(s.type,d);s.contentQueries!==null&&(n.flags|=4),(s.hostBindings!==null||s.hostAttrs!==null||s.hostVars!==0)&&(n.flags|=64);let f=s.type.prototype;!l&&(f.ngOnChanges||f.ngOnInit||f.ngDoCheck)&&((e.preOrderHooks??=[]).push(n.index),l=!0),!u&&(f.ngOnChanges||f.ngDoCheck)&&((e.preOrderCheckHooks??=[]).push(n.index),u=!0),d++}mp(e,n,a)}function mp(e,t,n){for(let r=t.directiveStart;r<t.directiveEnd;r++){let i=e.data[r];if(n===null||!n.has(i))hp(0,t,i,r),hp(1,t,i,r),vp(t,r,!1);else{let e=n.get(i);gp(0,t,e,r),gp(1,t,e,r),vp(t,r,!0)}}}function hp(e,t,n,r){let i=e===0?n.inputs:n.outputs;for(let n in i)if(Object.hasOwn(i,n)){let i;i=e===0?t.inputs??={}:t.outputs??={},i[n]??=[],i[n].push(r),_p(t,n)}}function gp(e,t,n,r){let i=e===0?n.inputs:n.outputs;for(let n in i)if(Object.hasOwn(i,n)){let a=i[n],o;o=e===0?t.hostDirectiveInputs??={}:t.hostDirectiveOutputs??={},o[a]??=[],o[a].push(r,n),_p(t,a)}}function _p(e,t){t===`class`?e.flags|=8:t===`style`&&(e.flags|=16)}function vp(e,t,n){let{attrs:r,inputs:i,hostDirectiveInputs:a}=e;if(r===null||!n&&i===null||n&&a===null||su(e)){e.initialInputs??=[],e.initialInputs.push(null);return}let o=null,s=0;for(;s<r.length;){let e=r[s];if(e===0){s+=4;continue}if(e===5){s+=2;continue}if(typeof e==`number`)break;if(!n&&Object.hasOwn(i,e)){let n=i[e];for(let i of n)if(i===t){o??=[],o.push(e,r[s+1]);break}}else if(n&&Object.hasOwn(a,e)){let n=a[e];for(let e=0;e<n.length;e+=2)if(n[e]===t){o??=[],o.push(n[e+1],r[s+1]);break}}s+=2}e.initialInputs??=[],e.initialInputs.push(o)}function yp(e,t,n,r,i){e.data[r]=i;let a=new bc(i.factory||=Ui(i.type,!0),za(i),lp,null);e.blueprint[r]=a,n[r]=a,bp(e,t,r,Cd(e,n,i.hostVars,yu),i)}function bp(e,t,n,r,i){let a=i.hostBindings;if(a){let i=e.hostBindingOpCodes;i===null&&(i=e.hostBindingOpCodes=[]);let o=~t.index;xp(i)!=o&&i.push(o),i.push(n,r,a)}}function xp(e){let t=e.length;for(;t>0;){let n=e[--t];if(typeof n==`number`&&n<0)return n}return 0}function Sp(e,t,n){if(n){if(t.exportAs)for(let r=0;r<t.exportAs.length;r++)n[t.exportAs[r]]=e;za(t)&&(n[``]=e)}}function Cp(e,t,n){e.flags|=1,e.directiveStart=t,e.directiveEnd=t+n,e.providerIndexes=t}function wp(e,t,n,r,i,a,o,s){let c=t[1],l=c.consts,u=Mf(c,e,n,r,Za(l,o));return a&&up(c,t,u,Za(l,s),i),u.mergedAttrs=Ec(u.mergedAttrs,u.attrs),u.attrs!==null&&cp(u,u.attrs,!1),u.mergedAttrs!==null&&cp(u,u.mergedAttrs,!0),c.queries!==null&&c.queries.elementStart(c,u),u}function Tp(e,t){fc(e,t),Ia(t)&&e.queries.elementEnd(t)}function Ep(e,t,n,r,i,a){let o=t.consts,s=Mf(t,e,n,r,Za(o,i));if(s.mergedAttrs=Ec(s.mergedAttrs,s.attrs),a!=null){let e=Za(o,a);s.localNames=[];for(let t=0;t<e.length;t+=2)s.localNames.push(e[t],-1)}return s.attrs!==null&&cp(s,s.attrs,!1),s.mergedAttrs!==null&&cp(s,s.mergedAttrs,!0),t.queries!==null&&t.queries.elementStart(t,s),s}var Dp=typeof ShadowRoot<`u`,Op=typeof Document<`u`;function kp(e){return Object.keys(e).map(t=>{let[n,r,i]=e[t],a={propName:n,templateName:t,isSignal:(r&Ed.SignalBased)!==0};return i&&(a.transform=i),a})}function Ap(e){return Object.keys(e).map(t=>({propName:e[t],templateName:t}))}function jp(e,t,n){let r=t instanceof ya?t:t?.injector;return r&&e.getStandaloneInjector!==null&&(r=e.getStandaloneInjector(r)||r),r?new qf(n,r):n}function Mp(e){let t=e.get(Uf,null);if(t===null)throw new M(407,!1);return{rendererFactory:t,sanitizer:e.get(Wf,null),changeDetectionScheduler:e.get(Ws,null),ngReflect:!1,tracingService:e.get(Au,null,{optional:!0})}}function Np(e,t,n){let r=Fp(e);return Xl(t,r,r===`svg`?`svg`:r===`math`?Ha:n)}function Pp(e){if((e&&`localName`in e&&typeof e.localName==`string`?e.localName:e?.tagName)?.toLowerCase()===`script`)throw new M(905,!1)}function Fp(e){return(e.selectors[0][0]||`div`).toLowerCase()}var Ip=class{componentDef;ngModule;selector;componentType;ngContentSelectors;isBoundToModule;cachedInputs=null;cachedOutputs=null;get inputs(){return this.cachedInputs??=kp(this.componentDef.inputs),this.cachedInputs}get outputs(){return this.cachedOutputs??=Ap(this.componentDef.outputs),this.cachedOutputs}constructor(e,t){this.componentDef=e,this.ngModule=t,this.componentType=e.type,this.selector=_u(e.selectors),this.ngContentSelectors=e.ngContentSelectors??[],this.isBoundToModule=!!t}create(e,t,n,r,i,a,o){z(R.DynamicComponentStart);let s=j(null);try{let s=this.componentDef,c=jp(s,r||this.ngModule,e),l=Mp(c),u=l.tracingService;return u&&u.componentCreate?u.componentCreate(Gf(s),()=>this.createComponentRef(l,c,t,n,i,a,o)):this.createComponentRef(l,c,t,n,i,a,o)}finally{j(s)}}createComponentRef(e,t,n,r,i,a,o){let s=this.componentDef,c=Lp(r,s,a,i),l=e.rendererFactory.createRenderer(null,s),u=r?jd(l,r,s.encapsulation,t):Np(s,l,o??null);Pp(u);let d=t.get(sp,null),f=Rp(u,()=>t.get(cs,null)??El());d&&d.addHost(f);let p=a?.some(Bp)||i?.some(e=>typeof e!=`function`&&e.bindings.some(Bp)),m=bd(null,c,null,512|Sd(s),null,null,e,l,t,null,Fl(u,t,!0));d&&Dp&&f instanceof ShadowRoot&&io(m,()=>{d.removeHost(f)}),m[27]=u,Ho(m);let h=null;try{let e=wp(27,m,2,`#host`,()=>c.directiveRegistry,!0,0);ru(l,u,e),bl(u,m),kd(c,m,e),zl(c,e,m),Tp(c,e),n!==void 0&&Hp(e,this.ngContentSelectors,n),h=Ya(e.index,m),m[8]=h[8],Yd(c,m,null)}catch(e){throw h!==null&&vl(h),vl(m),e}finally{z(R.DynamicComponentEnd),qo()}return new Vp(this.componentType,m,!!p)}};function Lp(e,t,n,r){let i=e?[`ng-version`,`22.1.7`]:vu(t.selectors[0]),a=null,o=null,s=0;if(n)for(let e of n)s+=e[op].requiredVars,e.create&&(e.targetIdx=0,(a??=[]).push(e)),e.update&&(e.targetIdx=0,(o??=[]).push(e));if(r)for(let e=0;e<r.length;e++){let t=r[e];if(typeof t!=`function`)for(let n of t.bindings){s+=n[op].requiredVars;let t=e+1;n.create&&(n.targetIdx=t,(a??=[]).push(n)),n.update&&(n.targetIdx=t,(o??=[]).push(n))}}let c=[t];if(r)for(let e of r){let t=yi(typeof e==`function`?e:e.type);c.push(t)}return _d(0,null,zp(a,o),1,s,c,null,null,null,[i],null)}function Rp(e,t){let n=e.getRootNode?.();return Op&&n instanceof Document?n.head:n&&Dp&&n instanceof ShadowRoot?n:t().head}function zp(e,t){return!e&&!t?null:n=>{if(n&1&&e)for(let t of e)t.create();if(n&2&&t)for(let e of t)e.update()}}function Bp(e){let t=e[op].kind;return t===`input`||t===`twoWay`}var Vp=class extends Hf{_rootLView;_hasInputBindings;instance;hostView;changeDetectorRef;componentType;location;previousInputValues=null;_tNode;constructor(e,t,n){super(),this._rootLView=t,this._hasInputBindings=n,this._tNode=Ka(t[1],27),this.location=ul(this._tNode,t),this.instance=Ya(this._tNode.index,t)[8],this.hostView=this.changeDetectorRef=new jf(t,void 0),this.componentType=e}setInput(e,t){this._hasInputBindings;let n=this._tNode;if(this.previousInputValues??=new Map,this.previousInputValues.has(e)&&Object.is(this.previousInputValues.get(e),t))return;let r=this._rootLView;Kd(n,r[1],r,e,t),this.previousInputValues.set(e,t),Cf(Ya(n.index,r),1)}get injector(){return new el(this._tNode,this._rootLView)}destroy(){this.hostView.destroy()}onDestroy(e){this.hostView.onDestroy(e)}};function Hp(e,t,n){let r=e.projection=[];for(let e=0;e<t.length;e++){let t=n[e];r.push(t!=null&&t.length?Array.from(t):null)}}var Up=()=>!1;function Wp(e,t,n){return Up(e,t,n)}function Gp(e){return!!e&&typeof e.then==`function`}function Kp(e){return!!e&&typeof e.subscribe==`function`}var qp=class{},Jp=class extends qp{injector;instance=null;constructor(e){super();let t=new ba([...e.providers,{provide:qp,useValue:this}],e.parent||va(),e.debugName,new Set([`environment`]));this.injector=t,e.runEnvironmentInitializers&&t.resolveInjectorInitializers()}destroy(){this.injector.destroy()}onDestroy(e){this.injector.onDestroy(e)}};function Yp(e,t,n=null){return new Jp({providers:e,parent:t,debugName:n,runEnvironmentInitializers:!0}).injector}var Xp=(()=>{class e{_injector;cachedInjectors=new Map;constructor(e){this._injector=e}getOrCreateStandaloneInjector(e){if(!e.standalone)return null;if(!this.cachedInjectors.has(e)){let t=aa(!1,e.type),n=t.length>0?Yp([t],this._injector,``):null;this.cachedInjectors.set(e,n)}return this.cachedInjectors.get(e)}ngOnDestroy(){try{for(let e of this.cachedInjectors.values())e!==null&&e.destroy()}finally{this.cachedInjectors.clear()}}static ɵprov=ii({token:e,providedIn:`environment`,factory:()=>new e(Ri(ya))})}return e})();function Zp(e){return oc(()=>{let t=nm(e),n={...t,decls:e.decls,vars:e.vars,template:e.template,consts:e.consts||null,ngContentSelectors:e.ngContentSelectors,onPush:e.changeDetection!==pl.Eager,directiveDefs:null,pipeDefs:null,dependencies:t.standalone&&e.dependencies||null,getStandaloneInjector:t.standalone?e=>e.get(Xp).getOrCreateStandaloneInjector(n):null,getExternalStyles:null,signals:e.signals??!1,data:e.data||{},encapsulation:e.encapsulation||Bl.Emulated,styles:e.styles||$i,_:null,schemas:e.schemas||null,tView:null,id:``};t.standalone&&Mu(`NgStandalone`),rm(n);let r=e.dependencies;return n.directiveDefs=im(r,Qp),n.pipeDefs=im(r,bi),n.id=am(n),n})}function Qp(e){return vi(e)||yi(e)}function $p(e,t){if(e==null)return Qi;let n={};for(let r in e)if(Object.hasOwn(e,r)){let i=e[r],a,o,s,c;Array.isArray(i)?(s=i[0],a=i[1],o=i[2]??a,c=i[3]||null):(a=i,o=i,s=Ed.None,c=null),n[a]=[r,s,c],t[a]=o}return n}function em(e){if(e==null)return Qi;let t={};for(let n in e)Object.hasOwn(e,n)&&(t[e[n]]=n);return t}function tm(e){return{type:e.type,name:e.name,factory:null,pure:e.pure!==!1,standalone:e.standalone??!0,onDestroy:e.type.prototype.ngOnDestroy||null}}function nm(e){let t={};return{type:e.type,providersResolver:null,viewProvidersResolver:null,factory:null,hostBindings:e.hostBindings||null,hostVars:e.hostVars||0,hostAttrs:e.hostAttrs||null,contentQueries:e.contentQueries||null,declaredInputs:t,inputConfig:e.inputs||Qi,exportAs:e.exportAs||null,standalone:e.standalone??!0,signals:e.signals===!0,selectors:e.selectors||$i,viewQuery:e.viewQuery||null,features:e.features||null,setInput:null,resolveHostDirectives:null,hostDirectives:null,controlDef:null,signalFormsInputPresence:null,inputs:$p(e.inputs,t),outputs:em(e.outputs),debugInfo:null}}function rm(e){e.features?.forEach(t=>t(e))}function im(e,t){return e?()=>{let n=typeof e==`function`?e():e,r=[];for(let e of n){let n=t(e);n!==null&&r.push(n)}return r}:null}function am(e){let t=0,n=typeof e.consts==`function`?``:e.consts,r=[e.selectors,e.ngContentSelectors,e.hostVars,e.hostAttrs,n,e.vars,e.decls,e.encapsulation,e.standalone,e.signals,e.exportAs,JSON.stringify(e.inputs),JSON.stringify(e.outputs),Object.getOwnPropertyNames(e.type.prototype),!!e.contentQueries,!!e.viewQuery];for(let e of r.join(`|`))t=Math.imul(31,t)+e.charCodeAt(0)<<0;return t+=2147483648,`c`+t}var om=new N(``),sm=(()=>{class e{resolve;reject;initialized=!1;done=!1;donePromise=new Promise((e,t)=>{this.resolve=e,this.reject=t});appInits=P(om,{optional:!0})??[];injector=P(ss);constructor(){}runInitializers(){if(this.initialized)return;let e=[];for(let t of this.appInits){let n=ja(this.injector,t);if(Gp(n))e.push(n);else if(Kp(n)){let t=new Promise((e,t)=>{n.subscribe({complete:e,error:t})});e.push(t)}}let t=()=>{this.done=!0,this.resolve()};Promise.all(e).then(()=>{t()}).catch(e=>{this.reject(e)}),e.length===0&&t(),this.initialized=!0}static ɵfac=function(t){return new(t||e)};static ɵprov=cl({token:e,factory:e.ɵfac})}return e})();function cm(e,t,n,r,i,a,o,s){if(n.firstCreatePass){e.mergedAttrs=Ec(e.mergedAttrs,e.attrs);let t=e.tView=_d(2,e,i,a,o,n.directiveRegistry,n.pipeRegistry,null,n.schemas,n.consts,null);n.queries!==null&&(n.queries.template(n,e),t.queries=n.queries.embeddedTView(e))}s&&(e.flags|=s),wo(e,!1);let c=dm(n,t,e,r);rs()&&sd(n,t,c,e),bl(c,t);let l=wf(c,t,c,e);t[r+27]=l,wd(t,l),Wp(l,e,t)}function lm(e,t,n,r,i,a,o,s,c,l,u){let d=n+27,f;if(t.firstCreatePass){if(f=Mf(t,d,4,o||null,s||null),l!=null){let e=Za(t.consts,l);f.localNames=[];for(let t=0;t<e.length;t+=2)f.localNames.push(e[t],-1)}}else f=t.data[d];return cm(f,e,t,n,r,i,a,c),l!=null&&Ad(e,f,u),f}function um(e,t,n,r,i,a,o,s){let c=I(),l=vo();return lm(c,l,e,t,n,r,i,Za(l.consts,a),void 0,o,s),um}var dm=fm;function fm(e,t,n,r){return is(!0),t[11].createComment(``)}var pm=(function(e){return e[e.NOT_STARTED=0]=`NOT_STARTED`,e[e.IN_PROGRESS=1]=`IN_PROGRESS`,e[e.COMPLETE=2]=`COMPLETE`,e[e.FAILED=3]=`FAILED`,e})(pm||{}),mm=0,hm=1,gm=(function(e){return e[e.Placeholder=0]=`Placeholder`,e[e.Loading=1]=`Loading`,e[e.Complete=2]=`Complete`,e[e.Error=3]=`Error`,e})(gm||{}),_m=(function(e){return e[e.Initial=-1]=`Initial`,e})(_m||{}),vm=0,ym=4,bm=5,xm=6,Sm=7,Cm=8,wm=9,Tm=(function(e){return e[e.Manual=0]=`Manual`,e[e.Playthrough=1]=`Playthrough`,e})(Tm||{});function Em(e,t,n){let r=km(e);t[r]===null&&(t[r]=[]),t[r].push(n)}function Dm(e,t){let n=km(e),r=t[n];if(r!==null){for(let e of r)e();t[n]=null}}function Om(e){Dm(1,e),Dm(0,e),Dm(2,e)}function km(e){let t=ym;return e===1?t=bm:e===2&&(t=wm),t}function Am(e){return e+1}function jm(e,t){return e[1],e[Am(t.index)]}function Mm(e,t,n){e[1];let r=Am(t);e[r]=n}function Nm(e,t){let n=Am(t.index);return e.data[n]}function Pm(e,t,n){let r=Am(t);e.data[r]=n}function Fm(e,t,n){let r=t[1],i=Nm(r,n);switch(e){case gm.Complete:return i.primaryTmplIndex;case gm.Loading:return i.loadingTmplIndex;case gm.Error:return i.errorTmplIndex;case gm.Placeholder:return i.placeholderTmplIndex;default:return null}}function Im(e,t){return t===gm.Placeholder?e.placeholderBlockConfig?.[mm]??null:t===gm.Loading?e.loadingBlockConfig?.[mm]??null:null}function Lm(e){return e.loadingBlockConfig?.[hm]??null}function Rm(e,t){if(!e||e.length===0)return t;let n=new Set(e);for(let e of t)n.add(e);return e.length===n.size?e:Array.from(n)}function zm(e,t){return Ka(e,t.primaryTmplIndex+27)}var Bm=(()=>{class e{cachedInjectors=new Map;getOrCreateInjector(e,t,n,r){if(!this.cachedInjectors.has(e)){let i=n.length>0?Yp(n,t,r):null;this.cachedInjectors.set(e,i)}return this.cachedInjectors.get(e)}ngOnDestroy(){try{for(let e of this.cachedInjectors.values())e!==null&&e.destroy()}finally{this.cachedInjectors.clear()}}static ɵprov=ii({token:e,providedIn:`environment`,factory:()=>new e})}return e})(),Vm=new N(``);function Hm(e,t,n){return e.get(Bm).getOrCreateInjector(t,e,n,``)}function Um(e,t,n){if(e instanceof qf){let r=e.injector,i=e.parentInjector;return new qf(r,Hm(i,t,n))}let r=e.get(ya);return r===e?Hm(e,t,n):new qf(e,Hm(r,t,n))}function Wm(e,t,n,r=!1){let i=n[3],a=i[1];if(Va(i))return;let o=jm(i,t),s=o[1],c=o[Sm];if(!(c!==null&&e<c)&&qm(s,e)&&qm(o[vm]??-1,e)){let s=Nm(a,t),c=!r&&(Lm(s)!==null||Im(s,gm.Loading)!==null||Im(s,gm.Placeholder))?Xm:Km;try{c(e,o,n,t,i)}catch(e){Gd(i,e)}}}function Gm(e,t){let n=e[6]?.findIndex(e=>e.data.s===t[1])??-1;return{dehydratedView:n>-1?e[6][n]:null,dehydratedViewIx:n}}function Km(e,t,n,r,i){z(R.DeferBlockStateStart);let a=Fm(e,i,r);if(a!==null){t[1]=e;let o=i[1],s=Ka(o,a+27);Df(n,0);let c;if(e===gm.Complete){let e=Nm(o,r),t=e.providers;t&&t.length>0&&(c=Um(i[9],e,t))}let{dehydratedView:l,dehydratedViewIx:u}=Gm(n,t),d=Zd(i,s,null,{injector:c,dehydratedView:l});if(Ef(n,d,0,Qd(s,l)),$a(d),u>-1&&n[6]?.splice(u,1),(e===gm.Complete||e===gm.Error)&&Array.isArray(t[Cm])){for(let e of t[Cm])e();t[Cm]=null}}z(R.DeferBlockStateEnd)}function qm(e,t){return e<t}function Jm(e,t){let n=e[t.index];Wm(gm.Placeholder,t,n)}function Ym(e,t,n){e.loadingPromise.then(()=>{e.loadingState===pm.COMPLETE?Wm(gm.Complete,t,n):e.loadingState===pm.FAILED&&Wm(gm.Error,t,n)})}var Xm=null;function Zm(e,t){return t[9].get(Vm,null,{optional:!0})?.behavior!==Tm.Manual}var Qm=new N(``),$m=new N(``);function eh(){Nn(()=>{throw new M(600,``)})}var th=10,nh=(()=>{class e{_runningTick=!1;_destroyed=!1;_destroyListeners=[];_views=[];internalErrorHandler=P(Ps);afterRenderManager=P(Nu);zonelessEnabled=P(Gs);rootEffectScheduler=P(qs);dirtyFlags=0;tracingSnapshot=null;allTestViews=new Set;autoDetectTestViews=new Set;includeAllTestViews=!1;afterTick=new Wr;get allViews(){return[...(this.includeAllTestViews?this.allTestViews:this.autoDetectTestViews).keys(),...this._views]}get destroyed(){return this._destroyed}componentTypes=[];components=[];internalPendingTask=P(ps);get isStable(){return this.internalPendingTask.hasPendingTasksObservable.pipe(qr(e=>!e))}constructor(){P(Au,{optional:!0})}whenStable(){let e;return new Promise(t=>{e=this.isStable.subscribe({next:e=>{e&&t()}})}).finally(()=>{e.unsubscribe()})}_injector=P(ya);_rendererFactory=null;get injector(){return this._injector}bootstrap(e,t){return this.bootstrapImpl(e,t)}bootstrapImpl(e,t,n=ss.NULL){return this._injector.get(xs).run(()=>{if(z(R.BootstrapComponentStart),!this._injector.get(sm).done)throw new M(405,``);let r=vi(e),i=this._injector.get(qp),a=new Ip(r,i);this.componentTypes.push(e);let{hostElement:o,directives:s,bindings:c}=rh(t),l=o||a.selector,u=a.create(n,[],l,i.injector,s,c),d=u.location.nativeElement,f=u.injector.get(Qm,null);return f?.registerApplication(d),u.onDestroy(()=>{this.detachView(u.hostView),ih(this.components,u),f?.unregisterApplication(d)}),this._loadComponent(u),z(R.BootstrapComponentEnd,u),u})}tick(){this.zonelessEnabled||(this.dirtyFlags|=1),this._tick()}_tick(){z(R.ChangeDetectionStart),this.tracingSnapshot===null?this.tickImpl():this.tracingSnapshot.run(ku.CHANGE_DETECTION,this.tickImpl)}tickImpl=()=>{if(this._runningTick)throw z(R.ChangeDetectionEnd),new M(101,!1);let e=j(null);try{this._runningTick=!0,this.synchronize()}finally{this._runningTick=!1,this.tracingSnapshot?.dispose(),this.tracingSnapshot=null,j(e),this.afterTick.next(),z(R.ChangeDetectionEnd)}};synchronize(){this._rendererFactory===null&&!this._injector.destroyed&&(this._rendererFactory=this._injector.get(Uf,null,{optional:!0}));let e=0;for(;this.dirtyFlags!==0&&e++<th;){z(R.ChangeDetectionSyncStart);try{this.synchronizeOnce()}finally{z(R.ChangeDetectionSyncEnd)}}}synchronizeOnce(){this.dirtyFlags&16&&(this.dirtyFlags&=-17,this.rootEffectScheduler.flush());let e=!1;if(this.dirtyFlags&7){let t=!!(this.dirtyFlags&1);this.dirtyFlags&=-8,this.dirtyFlags|=8;for(let{_lView:n}of this.allViews)(t||to(n))&&(pf(n,t&&!this.zonelessEnabled?0:1),e=!0);if(this.dirtyFlags&=-5,this.syncDirtyFlagsWithViews(),this.dirtyFlags&23)return}e||(this._rendererFactory?.begin?.(),this._rendererFactory?.end?.()),this.dirtyFlags&8&&(this.dirtyFlags&=-9,this.afterRenderManager.execute()),this.syncDirtyFlagsWithViews()}syncDirtyFlagsWithViews(){if(this.allViews.some(({_lView:e})=>to(e))){this.dirtyFlags|=2;return}this.dirtyFlags&=-8}attachView(e){let t=e;this._views.push(t),t.attachToAppRef(this)}detachView(e){let t=e;ih(this._views,t),t.detachFromAppRef()}_loadComponent(e){this.attachView(e.hostView);try{this.tick()}catch(e){this.internalErrorHandler(e)}this.components.push(e),this._injector.get($m,[]).forEach(t=>t(e))}ngOnDestroy(){if(!this._destroyed)try{this._destroyListeners.forEach(e=>e()),this._views.slice().forEach(e=>e.destroy())}finally{this._destroyed=!0,this._views=[],this._destroyListeners=[]}}onDestroy(e){return this._destroyListeners.push(e),()=>ih(this._destroyListeners,e)}destroy(){if(this._destroyed)throw new M(406,!1);let e=this._injector;e.destroy&&!e.destroyed&&e.destroy()}get viewCount(){return this._views.length}static ɵfac=function(t){return new(t||e)};static ɵprov=cl({token:e,factory:e.ɵfac})}return e})();function rh(e){return e===void 0||typeof e==`string`||e instanceof Element?{hostElement:e}:e}function ih(e,t){let n=e.indexOf(t);n>-1&&e.splice(n,1)}function ah(e,t,n){let r=t.get(sh);return r.add(e,n),()=>r.remove(e)}function oh(e){return(t,n)=>ah(t,n,e)}var sh=(()=>{class e{buckets=new Map;callbackBucket=new Map;applicationRef=P(nh);ngZone=P(xs);idleService=P(ol);add(e,t){let n=ch(t);this.callbackBucket.set(e,n);let r=this.buckets.get(n);r??(r={idleId:null,queue:new Set},this.buckets.set(n,r)),r.queue.add(e),this.scheduleBucket(r,t)}remove(e){let t=this.callbackBucket.get(e);if(t===void 0)return;this.callbackBucket.delete(e);let n=this.buckets.get(t);n&&(n.queue.delete(e),n.queue.size===0&&(this.cancelBucket(n),this.buckets.delete(t)))}scheduleBucket(e,t){if(e.idleId!==null)return;let n=ch(t),r=r=>{for(let t of e.queue)if(t(),this.applicationRef._tick(),e.queue.delete(t),this.callbackBucket.delete(t),r&&r.timeRemaining()===0&&!r.didTimeout)break;e.idleId=null,e.queue.size>0?this.scheduleBucket(e,t):this.buckets.delete(n)};e.idleId=this.idleService.requestOnIdle(e=>this.ngZone.run(()=>r(e)),t)}cancelBucket(e){e.idleId!==null&&(this.idleService.cancelOnIdle(e.idleId),e.idleId=null)}ngOnDestroy(){for(let e of this.buckets.values())this.cancelBucket(e);this.buckets.clear(),this.callbackBucket.clear()}static ɵprov=ii({token:e,providedIn:`root`,factory:()=>new e})}return e})();function ch(e){return!e||e.timeout==null?``:`${e.timeout}`}function lh(e){let t=I(),n=xo();if(Jm(t,n),!Zm(0,t))return;let r=t[9];Em(0,jm(t,n),e(()=>dh(0,t,n),r))}function uh(e,t,n){let r=t[9],i=t[1];if(e.loadingState!==pm.NOT_STARTED)return e.loadingPromise??Promise.resolve();let a=jm(t,n),o=zm(i,e);e.loadingState=pm.IN_PROGRESS,Dm(1,a);let s=e.dependencyResolverFn,c=r.get(rc).add();return s?(e.loadingPromise=Promise.allSettled(s()).then(n=>{let r=!1,i=[],a=[];for(let e=0;e<n.length;e++){let t=n[e];if(t.status===`fulfilled`){let e=t.value,n=vi(e)||yi(e);if(n)i.push(n);else{let t=bi(e);t&&a.push(t)}}else{r=!0,t.reason instanceof Error?t.reason:Error(String(t.reason));break}}if(r)e.loadingState=pm.FAILED,e.errorTmplIndex===null&&Gd(t,new M(-750,``));else{e.loadingState=pm.COMPLETE;let t=o.tView;i.length>0&&(t.directiveRegistry=Rm(t.directiveRegistry,i),e.providers=aa(!1,...i.map(e=>e.type))),a.length>0&&(t.pipeRegistry=Rm(t.pipeRegistry,a))}}),e.loadingPromise.finally(()=>{e.loadingPromise=null,c()})):(e.loadingPromise=Promise.resolve().then(()=>{e.loadingPromise=null,e.loadingState=pm.COMPLETE,c()}),e.loadingPromise)}function dh(e,t,n){let r=t[1],i=t[n.index];if(!Zm(e,t))return;let a=jm(t,n),o=Nm(r,n);switch(Om(a),o.loadingState){case pm.NOT_STARTED:Wm(gm.Loading,n,i),uh(o,t,n),o.loadingState===pm.IN_PROGRESS&&Ym(o,n,i);break;case pm.IN_PROGRESS:Wm(gm.Loading,n,i),Ym(o,n,i);break;case pm.COMPLETE:Wm(gm.Complete,n,i);break;case pm.FAILED:Wm(gm.Error,n,i)}}function fh(e,t,n){return e===0?mh(t,n):e!==2||!mh(t,n)}function ph(e){return e!=null&&(e&1)==1}function mh(e,t){let n=e[9],r=Nm(e[1],t),i=Il(n),a=ph(r.flags),o=jm(e,t)[xm]!==null;return!(a&&o&&i)}function hh(e,t,n,r,i,a,o,s,c,l){let u=I(),d=vo(),f=e+27,p=lm(u,d,e,null,0,0),m=u[9],h=Il(m);if(d.firstCreatePass){Mu(`NgDefer`);let e={primaryTmplIndex:t,loadingTmplIndex:r??null,placeholderTmplIndex:i??null,errorTmplIndex:a??null,placeholderBlockConfig:null,loadingBlockConfig:null,dependencyResolverFn:n??null,loadingState:pm.NOT_STARTED,loadingPromise:null,providers:null,hydrateTriggers:null,debug:null,flags:l??0};c?.(d,e,s,o),Pm(d,f,e)}let g=u[f];Wp(g,p,u);let _=null,v=null;if(g[6]?.length>0){let e=g[6][0].data;v=e.di??null,_=e.s}let y=[null,_m.Initial,null,null,null,null,v,_,null,null];Mm(u,f,y);let b=null;v!==null&&h&&(b=m.get(Ml),b.add(v,{lView:u,tNode:p,lContainer:g}));let ee=()=>{Om(y),v!==null&&b?.cleanup([v])};Em(0,y,()=>ao(u,ee)),io(u,ee)}function gh(e){fh(0,I(),xo())&&lh(oh({timeout:e}))}function _h(e,t,n,r){let i=I();return Xf(i,Mo(),t)&&(vo(),Bd(Zo(),i,e,t,n,r)),_h}var vh=class{destroy(e){}updateValue(e,t){}swap(e,t){let n=Math.min(e,t),r=Math.max(e,t),i=this.detach(r);if(r-n>1){let e=this.detach(n);this.attach(n,i),this.attach(r,e)}else this.attach(n,i)}move(e,t){this.attach(t,this.detach(e))}};function yh(e,t,n,r,i){return e===n&&Object.is(t,r)?1:Object.is(i(e,t),i(n,r))?-1:0}function bh(e,t,n,r){let i,a,o=0,s=e.length-1;if(Array.isArray(t)){j(r);let c=t.length-1;for(j(null);o<=s&&o<=c;){let r=e.at(o),l=t[o],u=yh(o,r,o,l,n);if(u!==0){u<0&&e.updateValue(o,l),o++;continue}let d=e.at(s),f=t[c],p=yh(s,d,c,f,n);if(p!==0){p<0&&e.updateValue(s,f),s--,c--;continue}let m=n(o,r),h=n(s,d),g=n(o,l);if(Object.is(g,h)){let t=n(c,f);Object.is(t,m)?(e.swap(o,s),e.updateValue(s,f),c--,s--):e.move(s,o),e.updateValue(o,l),o++;continue}if(i??=new wh,a??=Ch(e,o,s,n),xh(e,i,o,g))e.updateValue(o,l),o++,s++;else if(a.has(g))i.set(m,e.detach(o)),s--;else{let n=e.create(o,t[o]);e.attach(o,n),o++,s++}}for(;o<=c;)Sh(e,i,n,o,t[o]),o++}else if(t!=null){j(r);let c=t[Symbol.iterator]();j(null);let l=c.next();for(;!l.done&&o<=s;){let t=e.at(o),r=l.value,u=yh(o,t,o,r,n);if(u!==0)u<0&&e.updateValue(o,r),o++,l=c.next();else{i??=new wh,a??=Ch(e,o,s,n);let u=n(o,r);if(xh(e,i,o,u))e.updateValue(o,r),o++,s++,l=c.next();else if(!a.has(u))e.attach(o,e.create(o,r)),o++,s++,l=c.next();else{let r=n(o,t);i.set(r,e.detach(o)),s--}}}for(;!l.done;)Sh(e,i,n,e.length,l.value),l=c.next()}for(;o<=s;)e.destroy(e.detach(s--));i?.forEach(t=>{e.destroy(t)})}function xh(e,t,n,r){return t!==void 0&&t.has(r)?(e.attach(n,t.get(r)),t.delete(r),!0):!1}function Sh(e,t,n,r,i){if(xh(e,t,r,n(r,i)))e.updateValue(r,i);else{let t=e.create(r,i);e.attach(r,t)}}function Ch(e,t,n,r){let i=new Set;for(let a=t;a<=n;a++)i.add(r(a,e.at(a)));return i}var wh=class{kvMap=new Map;_vMap=void 0;has(e){return this.kvMap.has(e)}delete(e){if(!this.has(e))return!1;let t=this.kvMap.get(e);return this._vMap!==void 0&&this._vMap.has(t)?(this.kvMap.set(e,this._vMap.get(t)),this._vMap.delete(t)):this.kvMap.delete(e),!0}get(e){return this.kvMap.get(e)}set(e,t){if(this.kvMap.has(e)){let n=this.kvMap.get(e);this._vMap===void 0&&(this._vMap=new Map);let r=this._vMap;for(;r.has(n);)n=r.get(n);r.set(n,t)}else this.kvMap.set(e,t)}forEach(e){for(let[t,n]of this.kvMap)if(e(n,t),this._vMap!==void 0){let r=this._vMap;for(;r.has(n);)n=r.get(n),e(n,t)}}};function V(e,t,n,r,i,a,o,s){Mu(`NgControlFlow`);let c=I(),l=vo();return lm(c,l,e,t,n,r,i,Za(l.consts,a),256,o,s),Th}function Th(e,t,n,r,i,a,o,s){Mu(`NgControlFlow`);let c=I(),l=vo();return lm(c,l,e,t,n,r,i,Za(l.consts,a),512,o,s),Th}function H(e,t){Mu(`NgControlFlow`);let n=I(),r=Mo(),i=n[r]===yu?-1:n[r],a=i===-1?void 0:jh(n,27+i);if(Xf(n,r,e)){let r=j(null);try{if(a!==void 0&&Df(a,0),e!==-1){let r=27+e,i=jh(n,r),a=Ih(n[1],r),o=Vf(i,a,n);Ef(i,Zd(n,a,t,{dehydratedView:o}),0,Qd(a,o))}}finally{j(r)}}else if(a!==void 0){let e=Tf(a,0);e!==void 0&&(e[8]=t)}}var Eh=class{lContainer;$implicit;$index;constructor(e,t,n){this.lContainer=e,this.$implicit=t,this.$index=n}get $count(){return this.lContainer.length-10}};function Dh(e){return e}function Oh(e,t){return t}var kh=class{hasEmptyBlock;trackByFn;liveCollection;constructor(e,t,n){this.hasEmptyBlock=e,this.trackByFn=t,this.liveCollection=n}};function U(e,t,n,r,i,a,o,s,c,l,u,d,f){Mu(`NgControlFlow`);let p=I(),m=vo(),h=c!==void 0,g=I(),_=new kh(h,s?o.bind(g[15][8]):o);g[27+e]=_,lm(p,m,e+1,t,n,r,i,Za(m.consts,a),256),h&&lm(p,m,e+2,c,l,u,d,Za(m.consts,f),512)}var Ah=class extends vh{lContainer;hostLView;templateTNode;operationsCounter=void 0;needsIndexUpdate=!1;constructor(e,t,n){super(),this.lContainer=e,this.hostLView=t,this.templateTNode=n}get length(){return this.lContainer.length-10}at(e){return this.getLView(e)[8].$implicit}attach(e,t){let n=t[6];this.needsIndexUpdate||=e!==this.length,Ef(this.lContainer,t,e,Qd(this.templateTNode,n)),Mh(this.lContainer,e)}detach(e){return this.needsIndexUpdate||=e!==this.length-1,Nh(this.lContainer,e),Ph(this.lContainer,e)}create(e,t){let n=Bf(this.lContainer,this.templateTNode.tView.ssrId);return Zd(this.hostLView,this.templateTNode,new Eh(this.lContainer,t,e),{dehydratedView:n})}destroy(e){Qu(e[1],e)}updateValue(e,t){this.getLView(e)[8].$implicit=t}reset(){this.needsIndexUpdate=!1}updateIndexes(){if(this.needsIndexUpdate)for(let e=0;e<this.length;e++)this.getLView(e)[8].$index=e}getLView(e){return Fh(this.lContainer,e)}};function W(e){let t=j(null),n=Yo();try{let r=I(),i=r[1],a=r[n],o=n+1,s=jh(r,o);a.liveCollection===void 0?a.liveCollection=new Ah(s,r,Ih(i,o)):a.liveCollection.reset();let c=a.liveCollection;if(bh(c,e,a.trackByFn,t),c.updateIndexes(),a.hasEmptyBlock){let e=Mo(),t=c.length===0;if(Xf(r,e,t)){let e=n+2,a=jh(r,e);if(t){let t=Ih(i,e),n=Vf(a,t,r);Ef(a,Zd(r,t,void 0,{dehydratedView:n}),0,Qd(t,n))}else i.firstUpdatePass&&If(a),Df(a,0)}}}finally{j(t)}}function jh(e,t){return e[t]}function Mh(e,t){if(e.length<=10)return;let n=e[10+t],r=n?n[26]:void 0;if(n&&r&&r.detachedLeaveAnimationFns&&r.detachedLeaveAnimationFns.length>0){let e=n[9];Lu(e,r),Cu.delete(n[19]),r.detachedLeaveAnimationFns=void 0}}function Nh(e,t){if(e.length<=10)return;let n=e[10+t],r=n?n[26]:void 0;r&&r.leave&&r.leave.size>0&&(r.detachedLeaveAnimationFns=[])}function Ph(e,t){return Of(e,t)}function Fh(e,t){return Tf(e,t)}function Ih(e,t){return Ka(e,t)}function Lh(e,t,n){let r=I();return Xf(r,Mo(),t)&&(vo(),Nd(Zo(),r,e,t,r[11],n)),Lh}function Rh(e,t,n,r,i){Kd(t,e,n,i?`class`:`style`,r)}function G(e,t,n,r){let i=I(),a=i[1],o=e+27,s=a.firstCreatePass?wp(o,i,2,t,zd,mo(),n,r):a.data[o];if(La(s)){let n=i[10].tracingService;if(n&&n.componentCreate){let o=a.data[s.directiveStart+s.componentOffset];return n.componentCreate(Gf(o),()=>(zh(e,t,i,s,r),G))}}return zh(e,t,i,s,r),G}function zh(e,t,n,r,i){if(Ud(r,n,e,t,Hh),Ra(r)){let e=n[1];kd(e,n,r),zl(e,r,n)}i!=null&&Ad(n,r)}function K(){let e=vo(),t=Wd(xo());return e.firstCreatePass&&Tp(e,t),go(t)&&_o(),po(),t.classesWithoutHost!=null&&xc(t)&&Rh(e,t,I(),t.classesWithoutHost,!0),t.stylesWithoutHost!=null&&Sc(t)&&Rh(e,t,I(),t.stylesWithoutHost,!1),K}function Bh(e,t,n,r){return G(e,t,n,r),K(),Bh}function q(e,t,n,r){let i=I(),a=i[1],o=e+27,s=a.firstCreatePass?Ep(o,a,2,t,n,r):a.data[o];return Ud(s,i,e,t,Hh),r!=null&&Ad(i,s),q}function J(){return go(Wd(xo()))&&_o(),po(),J}function Vh(e,t,n,r){return q(e,t,n,r),J(),Vh}var Hh=(e,t,n,r,i)=>(is(!0),Xl(t[11],r,ts()));function Uh(){let e=vo(),t=Wd(xo());return e.firstCreatePass&&Tp(e,t),Uh}function Wh(e,t,n){let r=I(),i=r[1],a=e+27,o=i.firstCreatePass?Ep(a,i,8,`ng-container`,t,n):i.data[a];return Ud(o,r,e,`ng-container`,qh),n!=null&&Ad(r,o),Wh}function Gh(){return Wd(xo()),Uh}function Kh(e,t,n){return Wh(e,t,n),Gh(),Kh}var qh=(e,t,n,r,i)=>(is(!0),Yl(t[11],``));function Jh(){return I()}function Yh(e,t,n){let r=I();return Xf(r,Mo(),t)&&(vo(),Pd(Zo(),r,e,t,r[11],n)),Yh}var Xh=`en-US`;function Zh(e){typeof e==`string`&&e.toLowerCase().replace(/_/g,`-`)}function Qh(e,t,n){let r=I(),i=vo(),a=xo();return $h(i,r,r[11],a,e,t,n),Qh}function Y(e,t,n){let r=I(),i=vo(),a=xo();return(a.type&3||n)&&tp(a,i,r,n,r[11],e,t,$f(a,r,t)),Y}function $h(e,t,n,r,i,a,o){let s=!0,c=null;if((r.type&3||o)&&(c??=$f(r,t,a),tp(r,e,t,o,n,i,a,c)&&(s=!1)),s){let e=r.outputs?.[i],n=r.hostDirectiveOutputs?.[i];if(n&&n.length)for(let e=0;e<n.length;e+=2){let o=n[e],s=n[e+1];c??=$f(r,t,a),ap(r,t,o,s,i,c)}if(e&&e.length)for(let n of e)c??=$f(r,t,a),ap(r,t,n,i,i,c)}}function X(e=1){return Jo(e)}function eg(e,t){return e<<17|t<<2}function tg(e){return e>>17&32767}function ng(e){return(e&2)==2}function rg(e,t){return e&131071|t<<17}function ig(e){return e|2}function ag(e){return(e&131068)>>2}function og(e,t){return e&-131069|t<<2}function sg(e){return(e&1)==1}function cg(e){return e|1}function lg(e,t,n,r,i,a){let o=a?t.classBindings:t.styleBindings,s=tg(o),c=ag(o);e[r]=n;let l=!1,u;if(Array.isArray(n)){let e=n;u=e[1],(u===null||Xi(e,u)>0)&&(l=!0)}else u=n;if(i){if(c!==0){let t=tg(e[s+1]);e[r+1]=eg(t,s),t!==0&&(e[t+1]=og(e[t+1],r)),e[s+1]=rg(e[s+1],r)}else e[r+1]=eg(s,0),s!==0&&(e[s+1]=og(e[s+1],r)),s=r}else e[r+1]=eg(c,0),s===0?s=r:e[c+1]=og(e[c+1],r),c=r;l&&(e[r+1]=ig(e[r+1])),dg(e,u,r,!0),dg(e,u,r,!1),ug(t,u,e,r,a),o=eg(s,c),a?t.classBindings=o:t.styleBindings=o}function ug(e,t,n,r,i){let a=i?e.residualClasses:e.residualStyles;a!=null&&typeof t==`string`&&Xi(a,t)>=0&&(n[r+1]=cg(n[r+1]))}function dg(e,t,n,r){let i=e[n+1],a=t===null,o=r?tg(i):ag(i),s=!1;for(;o!==0&&(s===!1||a);){let n=e[o],i=e[o+1];fg(n,t)&&(s=!0,e[o+1]=r?cg(i):ig(i)),o=r?tg(i):ag(i)}s&&(e[n+1]=r?ig(i):cg(i))}function fg(e,t){return e===null||t==null||(Array.isArray(e)?e[1]:e)===t?!0:Array.isArray(e)&&typeof t==`string`?Xi(e,t)>=0:!1}function pg(e,t,n){return hg(e,t,n,!1),pg}function mg(e,t){return hg(e,t,null,!0),mg}function hg(e,t,n,r){let i=I(),a=vo(),o=No(2);if(a.firstUpdatePass&&_g(a,e,o,r),t!==yu&&Xf(i,o,t)){let s=a.data[Yo()];wg(a,s,i,i[11],e,i[o+1]=Dg(t,n),r,o)}}function gg(e,t){return t>=e.expandoStartIndex}function _g(e,t,n,r){let i=e.data;if(i[n+1]===null){let a=i[Yo()],o=gg(e,n);Og(a,r)&&t===null&&!o&&(t=!1),t=vg(i,a,t,r),lg(i,a,t,n,o,r)}}function vg(e,t,n,r){let i=Ro(e),a=r?t.residualClasses:t.residualStyles;if(i===null)(r?t.classBindings:t.styleBindings)===0&&(n=Sg(null,e,t,n,r),n=Cg(n,t.attrs,r),a=null);else{let o=t.directiveStylingLast;if(o===-1||e[o]!==i){if(n=Sg(i,e,t,n,r),a===null){let n=yg(e,t,r);n!==void 0&&Array.isArray(n)&&(n=Sg(null,e,t,n[1],r),n=Cg(n,t.attrs,r),bg(e,t,r,n))}else a=xg(e,t,r)}}return a!==void 0&&(r?t.residualClasses=a:t.residualStyles=a),n}function yg(e,t,n){let r=n?t.classBindings:t.styleBindings;if(ag(r)!==0)return e[tg(r)]}function bg(e,t,n,r){let i=n?t.classBindings:t.styleBindings;e[tg(i)]=r}function xg(e,t,n){let r,i=t.directiveEnd;for(let a=1+t.directiveStylingLast;a<i;a++){let t=e[a].hostAttrs;r=Cg(r,t,n)}return Cg(r,t.attrs,n)}function Sg(e,t,n,r,i){let a=null,o=n.directiveEnd,s=n.directiveStylingLast;for(s===-1?s=n.directiveStart:s++;s<o&&(a=t[s],r=Cg(r,a.hostAttrs,i),a!==e);)s++;return e!==null&&(n.directiveStylingLast=s),r}function Cg(e,t,n){let r=n?1:2,i=-1;if(t!==null)for(let a=0;a<t.length;a++){let o=t[a];typeof o==`number`?i=o:i===r&&(Array.isArray(e)||(e=e===void 0?[]:[``,e]),Ji(e,o,n?!0:t[++a]))}return e===void 0?null:e}function wg(e,t,n,r,i,a,o,s){if(!(t.type&3))return;let c=e.data,l=c[s+1];Eg(sg(l)?Tg(c,t,n,i,ag(l),o):void 0)||(Eg(a)||ng(l)&&(a=Tg(c,null,n,i,s,o)),gd(r,o,Wa(Yo(),n),i,a))}function Tg(e,t,n,r,i,a){let o=t===null,s;for(;i>0;){let t=e[i],a=Array.isArray(t),c=a?t[1]:t,l=c===null,u=n[i+1];u===yu&&(u=l?$i:void 0);let d=l?Yi(u,r):c===r?u:void 0;if(a&&!Eg(d)&&(d=Yi(t,r)),Eg(d)&&(s=d,o))return s;let f=e[i+1];i=o?tg(f):ag(f)}if(t!==null){let e=a?t.residualClasses:t.residualStyles;e!=null&&(s=Yi(e,r))}return s}function Eg(e){return e!==void 0}function Dg(e,t){return e==null||e===``||(typeof t==`string`?e=Hl(e)+t:typeof e==`object`&&(e=Qr(Hl(e)))),e}function Og(e,t){return!!(e.flags&(t?8:16))}function Z(e,t=``){let n=I(),r=vo(),i=e+27,a=r.firstCreatePass?Mf(r,i,1,t,null):r.data[i],o=kg(r,n,a,t);n[i]=o,rs()&&sd(r,n,o,a),wo(a,!1)}var kg=(e,t,n,r)=>(is(!0),ql(t[11],r));function Ag(e,t,n,r=``){return Xf(e,Mo(),n)?t+Si(n)+r:yu}function jg(e,t,n,r,i,a=``){let o=Zf(e,Ao(),n,i);return No(2),o?t+Si(n)+r+Si(i)+a:yu}function Mg(e,t,n,r,i,a,o,s=``){let c=Qf(e,Ao(),n,i,o);return No(3),c?t+Si(n)+r+Si(i)+a+Si(o)+s:yu}function Q(e){return $(``,e),Q}function $(e,t,n){let r=I(),i=Ag(r,e,t,n);return i!==yu&&Fg(r,Yo(),i),$}function Ng(e,t,n,r,i){let a=I(),o=jg(a,e,t,n,r,i);return o!==yu&&Fg(a,Yo(),o),Ng}function Pg(e,t,n,r,i,a,o){let s=I(),c=Mg(s,e,t,n,r,i,a,o);return c!==yu&&Fg(s,Yo(),c),Pg}function Fg(e,t,n){let r=Wa(t,e);Jl(e[11],r,n)}function Ig(e,t){let n=ko()+e,r=I();return r[n]===yu?Jf(r,n,t()):Yf(r,n)}function Lg(e,t,n,r){return Bg(I(),ko(),e,t,n,r)}function Rg(e,t){let n=e[t];return n===yu?void 0:n}function zg(e,t,n,r,i,a){let o=t+n;return Xf(e,o,i)?Jf(e,o+1,a?r.call(a,i):r(i)):Rg(e,o+1)}function Bg(e,t,n,r,i,a,o){let s=t+n;return Zf(e,s,i,a)?Jf(e,s+2,o?r.call(o,i,a):r(i,a)):Rg(e,s+2)}function Vg(e,t){let n=vo(),r,i=e+27;n.firstCreatePass?(r=Hg(t,n.pipeRegistry),n.data[i]=r,r.onDestroy&&(n.destroyHooks??=[]).push(i,r.onDestroy)):r=n.data[i];let a=r.factory||(r.factory=Ui(r.type,!0)),o=Mi(lp);try{let e=Nc(!1),t=a();return Nc(e),Ja(n,I(),i,t),t}finally{Mi(o)}}function Hg(e,t){if(t)for(let n=t.length-1;n>=0;n--){let r=t[n];if(e===r.name)return r}}function Ug(e,t,n){let r=e+27,i=I(),a=qa(i,r);return Wg(i,r)?zg(i,ko(),t,a.transform,n,a):a.transform(n)}function Wg(e,t){return e[1].data[t].pure}var Gg=(()=>{class e{applicationErrorHandler=P(Ps);appRef=P(nh);taskService=P(ps);ngZone=P(xs);zonelessEnabled=P(Gs);tracing=P(Au,{optional:!0});zoneIsDefined=typeof Zone<`u`&&!!Zone.root.run;schedulerTickApplyArgs=[{data:{__scheduler_tick__:!0}}];subscriptions=new cr;angularZoneId=this.zoneIsDefined?this.ngZone._inner?.get(ys):null;scheduleInRootZone=!this.zonelessEnabled&&this.zoneIsDefined&&(P(Ks,{optional:!0})??!1);cancelScheduledCallback=null;useMicrotaskScheduler=!1;runningTick=!1;pendingRenderTaskId=null;constructor(){this.subscriptions.add(this.appRef.afterTick.subscribe(()=>{let e=this.taskService.add();if(!this.runningTick&&(this.cleanup(),!this.zonelessEnabled||this.appRef.includeAllTestViews)){this.taskService.remove(e);return}this.switchToMicrotaskScheduler(),this.taskService.remove(e)})),this.subscriptions.add(this.ngZone.onUnstable.subscribe(()=>{this.runningTick||this.cleanup()}))}switchToMicrotaskScheduler(){this.ngZone.runOutsideAngular(()=>{let e=this.taskService.add();this.useMicrotaskScheduler=!0,queueMicrotask(()=>{this.useMicrotaskScheduler=!1,this.taskService.remove(e)})})}notify(e){if(!this.zonelessEnabled&&e===5)return;switch(e){case 0:case 2:this.appRef.dirtyFlags|=2;break;case 3:case 4:case 5:case 1:this.appRef.dirtyFlags|=4;break;case 6:this.appRef.dirtyFlags|=2;break;case 12:this.appRef.dirtyFlags|=16;break;case 13:this.appRef.dirtyFlags|=2;break;case 11:break;default:this.appRef.dirtyFlags|=8}if(this.appRef.tracingSnapshot=this.tracing?.snapshot(this.appRef.tracingSnapshot)??null,!this.shouldScheduleTick())return;let t=this.useMicrotaskScheduler?_s:gs;this.pendingRenderTaskId=this.taskService.add(),this.cancelScheduledCallback=this.scheduleInRootZone?Zone.root.run(()=>t(()=>this.tick())):this.ngZone.runOutsideAngular(()=>t(()=>this.tick()))}shouldScheduleTick(){return!(this.appRef.destroyed||this.pendingRenderTaskId!==null||this.runningTick||this.appRef._runningTick||!this.zonelessEnabled&&this.zoneIsDefined&&Zone.current.get(`isAngularZone_ID`+this.angularZoneId))}tick(){if(this.runningTick||this.appRef.destroyed)return;if(this.appRef.dirtyFlags===0){this.cleanup();return}!this.zonelessEnabled&&this.appRef.dirtyFlags&7&&(this.appRef.dirtyFlags|=1);let e=this.taskService.add();try{this.ngZone.run(()=>{this.runningTick=!0,this.appRef._tick()},void 0,this.schedulerTickApplyArgs)}catch(e){this.applicationErrorHandler(e)}finally{this.taskService.remove(e),this.cleanup()}}ngOnDestroy(){this.subscriptions.unsubscribe(),this.cleanup()}cleanup(){if(this.runningTick=!1,this.cancelScheduledCallback?.(),this.cancelScheduledCallback=null,this.pendingRenderTaskId!==null){let e=this.pendingRenderTaskId;this.pendingRenderTaskId=null,this.taskService.remove(e)}}static ɵfac=function(t){return new(t||e)};static ɵprov=cl({token:e,factory:e.ɵfac})}return e})();function Kg(){return[{provide:Ws,useExisting:Gg},{provide:xs,useClass:ks},{provide:Gs,useValue:!0}]}function qg(){return typeof $localize<`u`&&$localize.locale||`en-US`}var Jg=new N(``,{factory:()=>P(Jg,{optional:!0,skipSelf:!0})||qg()}),Yg=class{destroyed=!1;listeners=null;errorHandler=P(Ns,{optional:!0});isEmitting=!1;hasNullListeners=!1;destroyRef=P(ls);constructor(){this.destroyRef.onDestroy(()=>{this.destroyed=!0,this.listeners=null})}subscribe(e){if(this.destroyed)throw new M(953,!1);return(this.listeners??=[]).push(e),{unsubscribe:()=>{let t=this.listeners?this.listeners.indexOf(e):-1;t>-1&&(this.isEmitting?(this.hasNullListeners=!0,this.listeners[t]=null):this.listeners.splice(t,1))}}}emit(e){if(this.destroyed){console.warn(Xr(953,!1));return}if(this.listeners===null)return;this.isEmitting=!0;let t=j(null);try{for(let t of this.listeners)try{t!==null&&t(e)}catch(e){this.errorHandler?.handleError(e)}}finally{this.hasNullListeners&&(this.hasNullListeners=!1,this.listeners&&Xg(this.listeners)),j(t),this.isEmitting=!1}}};function Xg(e){let t=e.length-1;for(;t>-1;)e[t]===null&&e.splice(t,1),t--}function Zg(e,t){return Tn(e,t?.equal)}function Qg(e){return Qn(e)}(class e extends Error{_brand;constructor(e){super(e)}static IDLE=new e(`IDLE`);static LOADING=new e(`LOADING`)});var $g=e=>e;function e_(e,t){return typeof e==`function`?t_(Jn(e,$g,t?.equal),t?.debugName,t?.set):t_(Jn(e.source,e.computation,e.equal),e.debugName,e.set)}function t_(e,t,n){let r=e[rn],i=e;if(n!==void 0){let t=e=>Yn(r,e);i.set=e=>n(e,t),i.update=r=>n(r(Qg(e)),t)}else i.set=e=>Yn(r,e),i.update=e=>Xn(r,e);return i.asReadonly=Is.bind(e),i}function n_(e,t){let n=Object.create(ac);n.value=e,n.transformFn=t?.transform;function r(){if(sn(n),n.value===ic)throw new M(-950,null);return n.value}return r[rn]=n,r}function r_(e){return new Yg}function i_(e,t){return n_(e,t)}function a_(e){return n_(ic,e)}var o_=(i_.required=a_,i_),s_=new N(``),c_=new N(``);function l_(e){return!e.moduleRef}function u_(e){let t=l_(e)?e.r3Injector:e.moduleRef.injector,n=t.get(xs);return n.run(()=>{l_(e)?e.r3Injector.resolveInjectorInitializers():e.moduleRef.resolveInjectorInitializers();let r=t.get(Ps),i;if(n.runOutsideAngular(()=>{i=n.onError.subscribe({next:r})}),l_(e)){let n=()=>t.destroy(),r=e.platformInjector.get(s_);r.add(n),t.onDestroy(()=>{i.unsubscribe(),r.delete(n)})}else{let t=()=>e.moduleRef.destroy(),n=e.platformInjector.get(s_);n.add(t),e.moduleRef.onDestroy(()=>{ih(e.allPlatformModules,e.moduleRef),i.unsubscribe(),n.delete(t)})}return f_(r,n,()=>{let n=t.get(ps),r=n.add(),i=t.get(sm);return i.runInitializers(),i.donePromise.then(()=>{if(Zh(t.get(Jg,Xh)||`en-US`),!t.get(c_,!0))return l_(e)?t.get(nh):(e.allPlatformModules.push(e.moduleRef),e.moduleRef);if(l_(e)){let n=t.get(nh);return e.rootComponent!==void 0&&n.bootstrap(e.rootComponent),n}return d_?.(e.moduleRef,e.allPlatformModules),e.moduleRef}).finally(()=>void n.remove(r))})})}var d_;function f_(e,t,n){try{let r=n();return Gp(r)?r.catch(n=>{throw t.runOutsideAngular(()=>e(n)),n}):r}catch(n){throw t.runOutsideAngular(()=>e(n)),n}}var p_=null;function m_(e=[],t){return ss.create({name:t,providers:[{provide:ma,useValue:`platform`},{provide:s_,useValue:new Set([()=>p_=null])},...e]})}function h_(e=[]){if(p_)return p_;let t=m_(e);return p_=t,eh(),g_(t),t}function g_(e){let t=e.get(zs,null);ja(e,()=>{t?.forEach(e=>e())})}function __(e){let{rootComponent:t,appProviders:n,platformProviders:r,platformRef:i}=e;z(R.BootstrapApplicationStart);try{let e=i?.injector??h_(r);return u_({r3Injector:new Jp({providers:[Kg(),Fs,...n||[]],parent:e,debugName:``,runEnvironmentInitializers:!1}).injector,platformInjector:e,rootComponent:t})}catch(e){return Promise.reject(e)}finally{z(R.BootstrapApplicationEnd)}}var v_=null;function y_(){return v_}function b_(e){v_??=e}var x_=class{},S_=(()=>{class e{transform(e){return JSON.stringify(e,null,2)}static ɵfac=function(t){return new(t||e)};static ɵpipe=tm({name:`json`,type:e,pure:!1})}return e})();function C_(e,t){t=encodeURIComponent(t);for(let n of e.split(`;`)){let e=n.indexOf(`=`),[r,i]=e==-1?[n,``]:[n.slice(0,e),n.slice(e+1)];if(r.trim()!==t)continue;let a=i;try{a=decodeURIComponent(i)}catch{}return a.length>1&&a[0]===`"`&&a[a.length-1]===`"`&&(a=a.slice(1,-1)),a}return null}var w_=`browser`,T_=class{_doc;constructor(e){this._doc=e}manager},E_=(()=>{class e extends T_{constructor(e){super(e)}supports(e){return!0}addEventListener(e,t,n,r){return e.addEventListener(t,n,r),()=>this.removeEventListener(e,t,n,r)}removeEventListener(e,t,n,r){return e.removeEventListener(t,n,r)}static ɵfac=function(t){return new(t||e)(Ri(cs))};static ɵprov=ii({token:e,factory:e.ɵfac})}return e})(),D_=new N(``),O_=(()=>{class e{_zone;_plugins;_eventNameToPlugin=new Map;constructor(e,t){this._zone=t,e.forEach(e=>{e.manager=this});let n=e.filter(e=>!(e instanceof E_));this._plugins=n.slice().reverse();let r=e.find(e=>e instanceof E_);r&&this._plugins.push(r)}addEventListener(e,t,n,r){return this._findPluginFor(t).addEventListener(e,t,n,r)}getZone(){return this._zone}_findPluginFor(e){let t=this._eventNameToPlugin.get(e);if(t)return t;if(t=this._plugins.find(t=>t.supports(e)),!t)throw new M(-5101,!1);return this._eventNameToPlugin.set(e,t),t}static ɵfac=function(t){return new(t||e)(Ri(D_),Ri(xs))};static ɵprov=ii({token:e,factory:e.ɵfac})}return e})(),k_=`ng-app-id`;function A_(e){for(let t of e)t.remove()}function j_(e,t){let n=t.createElement(`style`);return n.textContent=e,n}function M_(e,t,n,r){let i=e.head?.querySelectorAll(`style[${k_}="${t}"],link[${k_}="${t}"]`);if(!i||i.length===0)return!1;for(let e of i)e.removeAttribute(k_),e instanceof HTMLLinkElement?r.set(e.href.slice(e.href.lastIndexOf(`/`)+1),{usage:0,elements:[e]}):e.textContent&&n.set(e.textContent,{usage:0,elements:[e]});return!0}function N_(e,t){let n=t.createElement(`link`);return n.setAttribute(`rel`,`stylesheet`),n.setAttribute(`href`,e),n}var P_=(()=>{class e{doc;appId;nonce;inline=new Map;external=new Map;hosts=new Set;constructor(e,t,n,r={}){this.doc=e,this.appId=t,this.nonce=n,M_(e,t,this.inline,this.external)&&this.hosts.add(e.head)}addStyles(e,t){for(let t of e)this.addUsage(t,this.inline,j_);t?.forEach(e=>this.addUsage(e,this.external,N_))}removeStyles(e,t){for(let t of e)this.removeUsage(t,this.inline);t?.forEach(e=>this.removeUsage(e,this.external))}addUsage(e,t,n){let r=t.get(e);r?r.usage++:t.set(e,{usage:1,elements:[...this.hosts].map(t=>this.addElement(t,n(e,this.doc)))})}removeUsage(e,t){let n=t.get(e);n&&(n.usage--,n.usage<=0&&(A_(n.elements),t.delete(e)))}ngOnDestroy(){for(let[,{elements:e}]of[...this.inline,...this.external])A_(e);this.hosts.clear()}addHost(e){if(!this.hosts.has(e)){this.hosts.add(e);for(let[t,{elements:n}]of this.inline)n.push(this.addElement(e,j_(t,this.doc)));for(let[t,{elements:n}]of this.external)n.push(this.addElement(e,N_(t,this.doc)))}}removeHost(e){this.hosts.delete(e);for(let t of[...this.inline.values(),...this.external.values()]){let n=[];for(let r of t.elements)r.parentNode===e?r.remove():n.push(r);t.elements=n}}addElement(e,t){return this.nonce&&t.setAttribute(`nonce`,this.nonce),e.appendChild(t)}static ɵfac=function(t){return new(t||e)(Ri(cs),Ri(Ls),Ri(Vs,8),Ri(Bs))};static ɵprov=ii({token:e,factory:e.ɵfac})}return e})(),F_={svg:`http://www.w3.org/2000/svg`,xhtml:`http://www.w3.org/1999/xhtml`,xlink:`http://www.w3.org/1999/xlink`,xml:`http://www.w3.org/XML/1998/namespace`,xmlns:`http://www.w3.org/2000/xmlns/`,math:`http://www.w3.org/1998/Math/MathML`},I_=/%COMP%/g,L_=`%COMP%`,R_=`_nghost-${L_}`,z_=`_ngcontent-${L_}`,B_=!0,V_=new N(``,{factory:()=>B_}),H_=new N(``);function U_(e){return z_.replace(I_,e)}function W_(e){return R_.replace(I_,e)}function G_(e,t){return t.map(t=>t.replace(I_,e))}var K_=(()=>{class e{eventManager;sharedStylesHost;appId;removeStylesOnCompDestroy;doc;ngZone;nonce;tracingService;rendererByCompId=new Map;defaultRenderer;cssVarNamespace;constructor(e,t,n,r,i,a,o=null,s=null,c=null){this.eventManager=e,this.sharedStylesHost=t,this.appId=n,this.removeStylesOnCompDestroy=r,this.doc=i,this.ngZone=a,this.nonce=o,this.tracingService=s,this.cssVarNamespace=c??``,this.defaultRenderer=new q_(e,i,a,this.tracingService,this.cssVarNamespace)}createRenderer(e,t){if(!e||!t)return this.defaultRenderer;let n=this.getOrCreateRenderer(e,t);return n instanceof Z_?n.applyToHost(e):n instanceof X_&&n.applyStyles(),n}getOrCreateRenderer(e,t){let n=this.rendererByCompId,r=n.get(t.id);if(!r){let i=this.doc,a=this.ngZone,o=this.eventManager,s=this.sharedStylesHost,c=this.removeStylesOnCompDestroy,l=this.tracingService;switch(t.encapsulation){case Bl.Emulated:r=new Z_(o,s,t,this.appId,c,i,a,l,this.cssVarNamespace);break;case Bl.ShadowDom:return new Y_(o,e,t,i,a,this.nonce,l,this.cssVarNamespace,s);case Bl.ExperimentalIsolatedShadowDom:return new Y_(o,e,t,i,a,this.nonce,l,this.cssVarNamespace);default:r=new X_(o,s,t,c,i,a,l,this.cssVarNamespace)}n.set(t.id,r)}return r}ngOnDestroy(){this.rendererByCompId.clear()}componentReplaced(e){this.rendererByCompId.delete(e)}static ɵfac=function(t){return new(t||e)(Ri(O_),Ri(sp),Ri(Ls),Ri(V_),Ri(cs),Ri(xs),Ri(Vs),Ri(Au,8),Ri(H_,8))};static ɵprov=ii({token:e,factory:e.ɵfac})}return e})(),q_=class{eventManager;doc;ngZone;tracingService;cssVarNamespace;data=Object.create(null);throwOnSyntheticProps=!0;constructor(e,t,n,r,i=``){this.eventManager=e,this.doc=t,this.ngZone=n,this.tracingService=r,this.cssVarNamespace=i}destroy(){}destroyNode=null;createElement(e,t){return t?this.doc.createElementNS(F_[t]||t,e):this.doc.createElement(e)}createComment(e){return this.doc.createComment(e)}createText(e){return this.doc.createTextNode(e)}appendChild(e,t){(J_(e)?e.content:e).appendChild(t)}insertBefore(e,t,n){if(e){let r=J_(e)?e.content:e;if(n!=null&&n.parentNode!==r)throw new M(-5106,!1);r.insertBefore(t,n)}}removeChild(e,t){t.remove()}selectRootElement(e,t){let n=typeof e==`string`?this.doc.querySelector(e):e;if(!n)throw new M(-5104,!1);return t||(n.textContent=``),n}parentNode(e){return e.parentNode}nextSibling(e){return e.nextSibling}setAttribute(e,t,n,r){if(r){t=r+`:`+t;let i=F_[r];i?e.setAttributeNS(i,t,n):e.setAttribute(t,n)}else e.setAttribute(t,n)}removeAttribute(e,t,n){if(n){let r=F_[n];r?e.removeAttributeNS(r,t):e.removeAttribute(`${n}:${t}`)}else e.removeAttribute(t)}addClass(e,t){e.classList.add(t)}removeClass(e,t){e.classList.remove(t)}setStyle(e,t,n,r){let i=t.startsWith(`--`);i&&(t=t.replace(`%NS%`,this.cssVarNamespace)),i||r&(bu.DashCase|bu.Important)?e.style.setProperty(t,n,r&bu.Important?`important`:``):e.style[t]=n}removeStyle(e,t,n){let r=t.startsWith(`--`);r&&(t=t.replace(`%NS%`,this.cssVarNamespace)),r||n&bu.DashCase?e.style.removeProperty(t):e.style[t]=``}setProperty(e,t,n){e!=null&&(e[t]=n)}setValue(e,t){e.nodeValue=t}listen(e,t,n,r){if(typeof e==`string`&&(e=y_().getGlobalEventTarget(this.doc,e),!e))throw new M(-5102,!1);let i=this.decoratePreventDefault(n);return this.tracingService?.wrapEventListener&&(i=this.tracingService.wrapEventListener(e,t,i)),this.eventManager.addEventListener(e,t,i,r)}decoratePreventDefault(e){return t=>{if(t===`__ngUnwrap__`)return e;e(t)===!1&&t.preventDefault()}}};function J_(e){return e.tagName===`TEMPLATE`&&e.content!==void 0}var Y_=class extends q_{hostEl;sharedStylesHost;shadowRoot;constructor(e,t,n,r,i,a,o,s,c){super(e,r,i,o,s),this.hostEl=t,this.sharedStylesHost=c,this.shadowRoot=t.attachShadow({mode:`open`}),this.sharedStylesHost&&this.sharedStylesHost.addHost(this.shadowRoot);let l=n.styles;l=G_(n.id,l).map(e=>e.replace(/%NS%/g,s));for(let e of l){let t=document.createElement(`style`);a&&t.setAttribute(`nonce`,a),t.textContent=e,this.shadowRoot.appendChild(t)}let u=n.getExternalStyles?.();if(u)for(let e of u){let t=N_(e,r);a&&t.setAttribute(`nonce`,a),this.shadowRoot.appendChild(t)}}nodeOrShadowRoot(e){return e===this.hostEl?this.shadowRoot:e}appendChild(e,t){return super.appendChild(this.nodeOrShadowRoot(e),t)}insertBefore(e,t,n){return super.insertBefore(this.nodeOrShadowRoot(e),t,n)}removeChild(e,t){return super.removeChild(null,t)}parentNode(e){return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)))}destroy(){this.sharedStylesHost&&this.sharedStylesHost.removeHost(this.shadowRoot)}},X_=class extends q_{sharedStylesHost;removeStylesOnCompDestroy;styles;styleUrls;constructor(e,t,n,r,i,a,o,s,c){super(e,i,a,o,s),this.sharedStylesHost=t,this.removeStylesOnCompDestroy=r;let l=n.styles,u=c?G_(c,l):l;this.styles=u.map(e=>e.replace(/%NS%/g,s)),this.styleUrls=n.getExternalStyles?.(c)}applyStyles(){this.sharedStylesHost.addStyles(this.styles,this.styleUrls)}destroy(){this.removeStylesOnCompDestroy&&Cu.size===0&&this.sharedStylesHost.removeStyles(this.styles,this.styleUrls)}},Z_=class extends X_{contentAttr;hostAttr;constructor(e,t,n,r,i,a,o,s,c){let l=r+`-`+n.id;super(e,t,n,i,a,o,s,c,l),this.contentAttr=U_(l),this.hostAttr=W_(l)}applyToHost(e){this.applyStyles(),this.setAttribute(e,this.hostAttr,``)}createElement(e,t){let n=super.createElement(e,t);return super.setAttribute(n,this.contentAttr,``),n}},Q_=class e extends x_{supportsDOMEvents=!0;static makeCurrent(){b_(new e)}onAndCancel(e,t,n,r){return e.addEventListener(t,n,r),()=>{e.removeEventListener(t,n,r)}}dispatchEvent(e,t){e.dispatchEvent(t)}remove(e){e.remove()}createElement(e,t){return t||=this.getDefaultDocument(),t.createElement(e)}createHtmlDocument(){return document.implementation.createHTMLDocument(`fakeTitle`)}getDefaultDocument(){return document}isElementNode(e){return e.nodeType===Node.ELEMENT_NODE}isShadowRoot(e){return e instanceof DocumentFragment}getGlobalEventTarget(e,t){return t===`window`?window:t===`document`?e:t===`body`?e.body:null}getBaseHref(e){let t=ev();return t==null?null:tv(t)}resetBaseElement(){$_=null}getUserAgent(){return window.navigator.userAgent}getCookie(e){return C_(document.cookie,e)}},$_=null;function ev(){return $_||=document.head.querySelector(`base`),$_?$_.getAttribute(`href`):null}function tv(e){return new URL(e,document.baseURI).pathname}var nv=[`alt`,`control`,`meta`,`shift`],rv={"\b":`Backspace`,"	":`Tab`,"":`Delete`,"\x1B":`Escape`,Del:`Delete`,Esc:`Escape`,Left:`ArrowLeft`,Right:`ArrowRight`,Up:`ArrowUp`,Down:`ArrowDown`,Menu:`ContextMenu`,Scroll:`ScrollLock`,Win:`OS`},iv={alt:e=>e.altKey,control:e=>e.ctrlKey,meta:e=>e.metaKey,shift:e=>e.shiftKey},av=(()=>{class e extends T_{constructor(e){super(e)}supports(t){return e.parseEventName(t)!=null}addEventListener(t,n,r,i){let a=e.parseEventName(n),o=e.eventCallback(a.fullKey,r,this.manager.getZone());return this.manager.getZone().runOutsideAngular(()=>y_().onAndCancel(t,a.domEventName,o,i))}static parseEventName(t){let n=t.toLowerCase().split(`.`),r=n.shift();if(n.length===0||r!==`keydown`&&r!==`keyup`)return null;let i=e._normalizeKey(n.pop()),a=``,o=n.indexOf(`code`);if(o>-1&&(n.splice(o,1),a=`code.`),nv.forEach(e=>{let t=n.indexOf(e);t>-1&&(n.splice(t,1),a+=e+`.`)}),a+=i,n.length!=0||i.length===0)return null;let s={};return s.domEventName=r,s.fullKey=a,s}static matchEventFullKeyCode(e,t){let n=rv[e.key]||e.key,r=``;return t.indexOf(`code.`)>-1&&(n=e.code,r=`code.`),n==null||!n?!1:(n=n.toLowerCase(),n===` `?n=`space`:n===`.`&&(n=`dot`),nv.forEach(t=>{if(t!==n){let n=iv[t];n(e)&&(r+=t+`.`)}}),r+=n,r===t)}static eventCallback(t,n,r){return i=>{e.matchEventFullKeyCode(i,t)&&r.runGuarded(()=>n(i))}}static _normalizeKey(e){return e===`esc`?`escape`:e}static ɵfac=function(t){return new(t||e)(Ri(cs))};static ɵprov=ii({token:e,factory:e.ɵfac})}return e})();async function ov(e,t,n){return __({rootComponent:e,...sv(t,n)})}function sv(e,t){return{platformRef:t?.platformRef,appProviders:[...fv,...e?.providers??[]],platformProviders:dv}}function cv(){Q_.makeCurrent()}function lv(){return new Ns}function uv(){return Tl(document),document}var dv=[{provide:Bs,useValue:w_},{provide:zs,useValue:cv,multi:!0},{provide:cs,useFactory:uv}],fv=[{provide:ma,useValue:`root`},{provide:Ns,useFactory:lv},{provide:D_,useClass:E_,multi:!0},{provide:D_,useClass:av,multi:!0},K_,{provide:sp,useClass:P_},{provide:P_,useExisting:sp},O_,{provide:Uf,useExisting:K_},[]];function pv(e,t){let n=`\x1B[${e}m`,r=`\x1B[${t}m`;return((e,...t)=>{if(Array.isArray(e)&&`raw`in e){let i=e,a=``;for(let e=0;e<i.length;e++)a+=i[e],e<t.length&&(a+=String(t[e]));return`${n}${a}${r}`}return`${n}${String(e)}${r}`})}var mv={blue:pv(34,39),cyan:pv(36,39),gray:pv(90,39),green:pv(32,39),red:pv(31,39),yellow:pv(33,39),bold:pv(1,22),dim:pv(2,22),reset:pv(0,0),underline:pv(4,24)};function hv(e,...t){return typeof e==`function`?e(...t):e}var gv=Error.captureStackTrace,_v=class e extends Error{name;code;docs;fix;sources;data;get why(){return this.message}constructor(t,n=e){super(t.why,{cause:t.cause}),this.code=this.name=t.code,this.fix=t.fix,this.docs=t.docs,this.sources=t.sources,this.data=t.data,gv?.(this,n)}toJSON(){return{name:this.name,why:this.why,fix:this.fix,docs:this.docs,sources:this.sources,cause:this.cause,data:this.data,stack:this.stack}}};function vv(e,t){return typeof e==`string`?`${e}/${t.toLowerCase()}`:e?.(t)}function yv(e){let t=e.reporters??[],n={},{docsBase:r}=e;for(let i of Object.keys(e.codes)){let a=e.codes[i],o=a.docs===!1?void 0:a.docs||vv(r,i),s=(e={},n={})=>{let r=new _v({code:i,why:hv(a.why,e),fix:hv(a.fix,e),docs:o,cause:e.cause,sources:e.sources,data:hv(a.data,e)},s);for(let e of t)e(r,n);return r};n[i]=s}return n}function bv(e){return t=>{let n=`${e.bold(e.red(`[${t.name}]`))} ${t.message}`,r=[];return t.fix&&r.push(`${e.dim(`fix:`)} ${t.fix}`),t.sources?.length&&r.push(`${e.dim(`sources:`)} ${t.sources.join(`, `)}`),t.docs&&r.push(`${e.dim(`see:`)} ${e.cyan(t.docs)}`),r.length===0?n:[n,...r.map((t,n)=>`${e.dim(n<r.length-1?`├▶`:`╰▶`)} ${t}`)].join(`
`)}}var xv={bus:{agentManifestChanged:`agent:manifest:changed`,agentToolRegistered:`agent:tool:registered`,agentToolUnregistered:`agent:tool:unregistered`,agentResourceRegistered:`agent:resource:registered`,agentResourceUnregistered:`agent:resource:unregistered`},client:{isTrustedUpdated:`rpc:is-trusted:updated`,error:`rpc:error`,connectionStatus:`connection:status`,connectionError:`connection:error`},broadcast:{authRevoked:`devframe:auth:revoked`,clientStateUpdated:`devframe:rpc:client-state:updated`,clientStatePatch:`devframe:rpc:client-state:patch`,streamingChunk:`devframe:streaming:chunk`,streamingEnd:`devframe:streaming:end`,streamingUploadCancel:`devframe:streaming:upload-cancel`},inPageChannel:{panelStateUpdated:`devframe:in-page:panel-state:updated`,panelStatePatch:`devframe:in-page:panel-state:patch`},postMessage:{remoteAssetsError:`devframe:remote-assets-error`,inPageChannel:`devframe:in-page-channel`}},Sv=bv(mv);function Cv(e,{method:t=`warn`}={}){console[t](Sv(e))}function wv(e){return yv({...e,reporters:[Cv,...e.reporters??[]]})}function Tv(){let e,t;return{promise:new Promise((n,r)=>{e=n,t=r}),resolve:e,reject:t}}var Ev=Math.random.bind(Math),Dv=`useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict`;function Ov(e=21){let t=``,n=e;for(;n--;)t+=Dv[Ev()*64|0];return t}var kv=6e4,Av=e=>e,jv=Av,{clearTimeout:Mv,setTimeout:Nv}=globalThis;function Pv(e,t){let{post:n,on:r,off:i=()=>{},eventNames:a=[],serialize:o=Av,deserialize:s=jv,resolver:c,bind:l=`rpc`,timeout:u=kv,proxify:d=!0}=t,f=!1,p=new Map,m,h;async function g(e,r,i,a){if(f)throw Error(`[birpc] rpc is closed, cannot call "${e}"`);let s={m:e,a:r,t:`q`};a&&(s.o=!0);let c=async e=>n(o(e));if(i){await c(s);return}if(m)try{await m}finally{m=void 0}let{promise:l,resolve:d,reject:g}=Tv(),_=Ov();s.i=_;let v;async function y(n=s){return u>=0&&(v=Nv(()=>{try{if(t.onTimeoutError?.call(h,e,r)!==!0)throw Error(`[birpc] timeout on calling "${e}"`)}catch(e){g(e)}p.delete(_)},u),typeof v==`object`&&(v=v.unref?.())),p.set(_,{resolve:d,reject:g,timeoutId:v,method:e}),await c(n),l}try{t.onRequest?await t.onRequest.call(h,s,y,d):await y()}catch(e){if(t.onGeneralError?.call(h,e)!==!0)throw e;return}finally{Mv(v),p.delete(_)}return l}let _={$call:(e,...t)=>g(e,t,!1),$callOptional:(e,...t)=>g(e,t,!1,!0),$callEvent:(e,...t)=>g(e,t,!0),$callRaw:e=>g(e.method,e.args,e.event,e.optional),$rejectPendingCalls:y,get $closed(){return f},get $meta(){return t.meta},$close:v,$functions:e};h=d?new Proxy({},{get(t,n){if(Object.hasOwn(_,n))return _[n];if(n===`then`&&!a.includes(`then`)&&!(`then`in e))return;let r=(...e)=>g(n,e,!0);if(a.includes(n))return r.asEvent=r,r;let i=(...e)=>g(n,e,!1);return i.asEvent=r,i}}):_;function v(e){f=!0,p.forEach(({reject:t,method:n})=>{let r=Error(`[birpc] rpc is closed, cannot call "${n}"`);if(e)return e.cause??=r,t(e);t(r)}),p.clear(),i(b)}function y(e){let t=Array.from(p.values()).map(({method:t,reject:n})=>e?e({method:t,reject:n}):n(Error(`[birpc]: rejected pending call "${t}".`)));return p.clear(),t}async function b(r,...i){let a;try{a=s(r)}catch(e){if(t.onGeneralError?.call(h,e)!==!0)throw e;return}if(a.t===`q`){let{m:r,a:s,o:u}=a,d,f,p=await(c?c.call(h,r,e[r]):e[r]);if(u&&(p||=()=>void 0),!p)f=Error(`[birpc] function "${r}" not found`);else try{d=await p.apply(l===`rpc`?h:e,s)}catch(e){f=e}if(a.i){if(f&&t.onFunctionError&&t.onFunctionError.call(h,f,r,s)===!0)return;if(!f)try{await n(o({t:`s`,i:a.i,r:d}),...i);return}catch(e){if(f=e,t.onGeneralError?.call(h,e,r,s)!==!0)throw e}try{await n(o({t:`s`,i:a.i,e:f}),...i)}catch(e){if(t.onGeneralError?.call(h,e,r,s)!==!0)throw e}}}else{let{i:e,r:t,e:n}=a,r=p.get(e);r&&(Mv(r.timeoutId),n?r.reject(n):r.resolve(t)),p.delete(e)}}return m=r(b),h}function Fv(e,t){return t.safety?t.safety:e===`static`||e===`query`||e==null?`read`:`action`}var Iv=Object.freeze({type:`object`,additionalProperties:!0});function Lv(e){let t=e[`~standard`];if(t.jsonSchema)try{return t.jsonSchema.input({target:`draft-2020-12`})}catch{return Iv}return Iv}function Rv(e){if(!e||e.length===0)return{type:`object`,properties:{}};let t={},n=[];for(let r=0;r<e.length;r++){let i=`arg${r}`;t[i]=Lv(e[r]),n.push(i)}return{type:`object`,properties:t,required:n,additionalProperties:!1}}function zv(e,t){if(Array.isArray(e))return e;if(e==null)return[];if(typeof e!=`object`)return;let n=e;if(t!=null)return Array.from({length:t},(e,t)=>n[`arg${t}`]);if(`arg0`in n){let e=[];for(;`arg${e.length}`in n;)e.push(n[`arg${e.length}`]);return e}return Object.keys(n).length===0?[]:void 0}function Bv(e,t){return zv(e,t)??[e]}function Vv(e){return typeof e==`string`?`'${e}'`:new Gv().serialize(e)}var Hv=` _-,;:!?.'"()[]{}@*/\\&#%\`^+<=>|~$0123456789abcdefghijklmnopqrstuvwxyz`,Uv=(function(){let e=new Uint8Array(128);for(let t=0;t<69;t++)e[Hv.charCodeAt(t)]=t+1;for(let t=65;t<=90;t++)e[t]=e[t+32];return e})();function Wv(e,t){if(e===t)return 0;let n=Math.min(e.length,t.length),r=0;for(let i=0;i<n;i++){let n=e.charCodeAt(i),a=t.charCodeAt(i);if(n===a)continue;let o=n<128&&Uv[n]?Uv[n]:n+128,s=a<128&&Uv[a]?Uv[a]:a+128;if(o!==s)return o<s?-1:1;r===0&&(r=n>a?-1:1)}return e.length===t.length?r:e.length<t.length?-1:1}var Gv=(function(){class e{#e=new Map;compare(e,t){let n=typeof e,r=typeof t;return n===`string`&&r===`string`?Wv(e,t):n===`number`&&r===`number`?e-t:Wv(this.serialize(e,!0),this.serialize(t,!0))}serialize(e,t){if(e===null)return`null`;switch(typeof e){case`string`:return t?e:`'${e}'`;case`bigint`:return`${e}n`;case`object`:return this.$object(e);case`function`:return this.$function(e)}return String(e)}serializeObject(e){let t=Object.prototype.toString.call(e);if(t!==`[object Object]`)return this.serializeBuiltInType(t.length<10?`unknown:${t}`:t.slice(8,-1),e);let n=e.constructor,r=n===Object||n===void 0?``:n.name;if(r!==``&&globalThis[r]===n)return this.serializeBuiltInType(r,e);if(`toJSON`in e&&typeof e.toJSON==`function`){let t=e.toJSON();return r+(typeof t==`object`&&t?this.$object(t):`(${this.serialize(t)})`)}let i=Object.keys(e).sort(Wv),a=`${r}{`;for(let t=0;t<i.length;t++){let n=i[t];a+=`${n}:${this.serialize(e[n])}`,t<i.length-1&&(a+=`,`)}return a+`}`}serializeBuiltInType(e,t){let n=this[`$`+e];if(n)return n.call(this,t);if(typeof t.entries==`function`)return this.serializeObjectEntries(e,t.entries());throw Error(`Cannot serialize ${e}`)}serializeObjectEntries(e,t){let n=Array.from(t).sort((e,t)=>this.compare(e[0],t[0])),r=`${e}{`;for(let e=0;e<n.length;e++){let[t,i]=n[e];r+=`${this.serialize(t,!0)}:${this.serialize(i)}`,e<n.length-1&&(r+=`,`)}return r+`}`}$object(e){let t=this.#e.get(e);return t===void 0&&(this.#e.set(e,`#${this.#e.size}`),t=this.serializeObject(e),this.#e.set(e,t)),t}$function(e){let t=Function.prototype.toString.call(e);return t.slice(-15)===`[native code] }`?`${e.name||``}()[native]`:`${e.name}(${e.length})${t.replace(/\s*\n\s*/g,``)}`}$Array(e){let t=`[`;for(let n=0;n<e.length;n++)t+=this.serialize(e[n]),n<e.length-1&&(t+=`,`);return t+`]`}$Date(e){try{return`Date(${e.toISOString()})`}catch{return`Date(null)`}}$ArrayBuffer(e){return`ArrayBuffer[${new Uint8Array(e).join(`,`)}]`}$Set(e){return`Set${this.$Array(Array.from(e).sort((e,t)=>this.compare(e,t)))}`}$Map(e){return this.serializeObjectEntries(`Map`,e.entries())}}for(let t of[`Error`,`RegExp`,`URL`])e.prototype[`$`+t]=function(e){return`${t}(${e})`};for(let t of[`Int8Array`,`Uint8Array`,`Uint8ClampedArray`,`Int16Array`,`Uint16Array`,`Int32Array`,`Uint32Array`,`Float32Array`,`Float64Array`])e.prototype[`$`+t]=function(e){return`${t}[${e.join(`,`)}]`};for(let t of[`BigInt64Array`,`BigUint64Array`])e.prototype[`$`+t]=function(e){return`${t}[${e.join(`n,`)}${e.length>0?`n`:``}]`};return e})(),Kv=[1779033703,-1150833019,1013904242,-1521486534,1359893119,-1694144372,528734635,1541459225],qv=[1116352408,1899447441,-1245643825,-373957723,961987163,1508970993,-1841331548,-1424204075,-670586216,310598401,607225278,1426881987,1925078388,-2132889090,-1680079193,-1046744716,-459576895,-272742522,264347078,604807628,770255983,1249150122,1555081692,1996064986,-1740746414,-1473132947,-1341970488,-1084653625,-958395405,-710438585,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,-2117940946,-1838011259,-1564481375,-1474664885,-1035236496,-949202525,-778901479,-694614492,-200395387,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,-2067236844,-1933114872,-1866530822,-1538233109,-1090935817,-965641998],Jv=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`,Yv=[],Xv=class{_data=new Zv;_hash=new Zv([...Kv]);_nDataBytes=0;_minBufferSize=0;finalize(e){e&&this._append(e);let t=this._nDataBytes*8,n=this._data.sigBytes*8;return this._data.words[n>>>5]|=128<<24-n%32,this._data.words[(n+64>>>9<<4)+14]=Math.floor(t/4294967296),this._data.words[(n+64>>>9<<4)+15]=t,this._data.sigBytes=this._data.words.length*4,this._process(),this._hash}_doProcessBlock(e,t){let n=this._hash.words,r=n[0],i=n[1],a=n[2],o=n[3],s=n[4],c=n[5],l=n[6],u=n[7];for(let n=0;n<64;n++){if(n<16)Yv[n]=e[t+n]|0;else{let e=Yv[n-15],t=(e<<25|e>>>7)^(e<<14|e>>>18)^e>>>3,r=Yv[n-2],i=(r<<15|r>>>17)^(r<<13|r>>>19)^r>>>10;Yv[n]=t+Yv[n-7]+i+Yv[n-16]}let d=s&c^~s&l,f=r&i^r&a^i&a,p=(r<<30|r>>>2)^(r<<19|r>>>13)^(r<<10|r>>>22),m=(s<<26|s>>>6)^(s<<21|s>>>11)^(s<<7|s>>>25),h=u+m+d+qv[n]+Yv[n],g=p+f;u=l,l=c,c=s,s=o+h|0,o=a,a=i,i=r,r=h+g|0}n[0]=n[0]+r|0,n[1]=n[1]+i|0,n[2]=n[2]+a|0,n[3]=n[3]+o|0,n[4]=n[4]+s|0,n[5]=n[5]+c|0,n[6]=n[6]+l|0,n[7]=n[7]+u|0}_append(e){typeof e==`string`&&(e=Zv.fromUtf8(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes}_process(e){let t,n=this._data.sigBytes/64;n=e?Math.ceil(n):Math.max((n|0)-this._minBufferSize,0);let r=n*16,i=Math.min(r*4,this._data.sigBytes);if(r){for(let e=0;e<r;e+=16)this._doProcessBlock(this._data.words,e);t=this._data.words.splice(0,r),this._data.sigBytes-=i}return new Zv(t,i)}},Zv=class e{words;sigBytes;constructor(e,t){e=this.words=e||[],this.sigBytes=t===void 0?e.length*4:t}static fromUtf8(t){let n=unescape(encodeURIComponent(t)),r=n.length,i=[];for(let e=0;e<r;e++)i[e>>>2]|=(n.charCodeAt(e)&255)<<24-e%4*8;return new e(i,r)}toBase64(){let e=[];for(let t=0;t<this.sigBytes;t+=3){let n=this.words[t>>>2]>>>24-t%4*8&255,r=this.words[t+1>>>2]>>>24-(t+1)%4*8&255,i=this.words[t+2>>>2]>>>24-(t+2)%4*8&255,a=n<<16|r<<8|i;for(let n=0;n<4&&t*8+n*6<this.sigBytes*8;n++)e.push(Jv.charAt(a>>>6*(3-n)&63))}return e.join(``)}concat(e){if(this.words[this.sigBytes>>>2]&=4294967295<<32-this.sigBytes%4*8,this.words.length=Math.ceil(this.sigBytes/4),this.sigBytes%4)for(let t=0;t<e.sigBytes;t++){let n=e.words[t>>>2]>>>24-t%4*8&255;this.words[this.sigBytes+t>>>2]|=n<<24-(this.sigBytes+t)%4*8}else for(let t=0;t<e.sigBytes;t+=4)this.words[this.sigBytes+t>>>2]=e.words[t>>>2];this.sigBytes+=e.sigBytes}};function Qv(e){return new Xv().finalize(e).toBase64()}function $v(e){return Qv(Vv(e))}function ey(e){return $v(e)}function ty(){let e={};function t(t,...n){let r=e[t]||[];for(let e=0,t=r.length;e<t;e++){let t=r[e];t&&t(...n)}}function n(n,...r){t(n,...r),delete e[n]}function r(t,n){return(e[t]||=[]).push(n),()=>{e[t]=e[t]?.filter(e=>n!==e)}}function i(e,t){let n=r(e,((...e)=>(n(),t(...e))));return n}return{_listeners:e,emit:t,emitOnce:n,on:r,once:i}}var ny=/^[\w+.-]{2,}:\/\//;function ry(e){return e.endsWith(`/`)?e:`${e}/`}function iy(e){return(e.endsWith(`/`)?e.slice(0,-1):e)||`/`}function ay(e,...t){let n=e;for(let e of t)e&&e!==`/`&&(n=n?ry(n)+e.replace(/^\.?\//,``):e);return n}function oy(e,t){if(!t||t===`/`||ny.test(e))return e;let n=iy(t);return e.startsWith(n)?e:ay(n,e)}function sy(e,t){let n=e.match(ny);return t+(n?e.slice(n[0].length):e)}var cy=`useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict`;function ly(e=21){let t=``,n=e;for(;n--;)t+=cy[Math.random()*64|0];return t}var uy=Symbol.for(`immer-nothing`),dy=Symbol.for(`immer-draftable`),fy=Symbol.for(`immer-state`),py=[function(e){return`The plugin for '${e}' has not been loaded into Immer. To enable the plugin, import and call \`enable${e}()\` when initializing your application.`},function(e){return`produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${e}'`},`This object has been frozen and should not be mutated`,function(e){return`Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? `+e},`An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.`,`Immer forbids circular references`,"The first or second argument to `produce` must be a function","The third argument to `produce` must be a function or undefined","First argument to `createDraft` must be a plain object, an array, or an immerable object","First argument to `finishDraft` must be a draft returned by `createDraft`",function(e){return`'current' expects a draft, got: ${e}`},`Object.defineProperty() cannot be used on an Immer draft`,`Object.setPrototypeOf() cannot be used on an Immer draft`,`Immer only supports deleting array indices`,`Immer only supports setting array indices and the 'length' property`,function(e){return`'original' expects a draft, got: ${e}`}];function my(e,...t){{let n=py[e],r=Ry(n)?n.apply(null,t):n;throw Error(`[Immer] ${r}`)}}var hy=Object,gy=hy.getPrototypeOf,_y=`constructor`,vy=`prototype`,yy=`configurable`,by=`enumerable`,xy=`writable`,Sy=`value`,Cy=e=>!!e&&!!e[fy];function wy(e){return e?Dy(e)||Py(e)||!!e[dy]||!!e[_y]?.[dy]||Fy(e)||Iy(e):!1}var Ty=hy[vy][_y].toString(),Ey=new WeakMap;function Dy(e){if(!e||!Ly(e))return!1;let t=gy(e);if(t===null||t===hy[vy])return!0;let n=hy.hasOwnProperty.call(t,_y)&&t[_y];if(n===Object)return!0;if(!Ry(n))return!1;let r=Ey.get(n);return r===void 0&&(r=Function.toString.call(n),Ey.set(n,r)),r===Ty}function Oy(e,t,n=!0){ky(e)===0?(n?Reflect.ownKeys(e):hy.keys(e)).forEach(n=>{t(n,e[n],e)}):e.forEach((n,r)=>t(r,n,e))}function ky(e){let t=e[fy];return t?t.type_:Py(e)?1:Fy(e)?2:Iy(e)?3:0}var Ay=(e,t,n=ky(e))=>n===2?e.has(t):hy[vy].hasOwnProperty.call(e,t),jy=(e,t,n=ky(e))=>n===2?e.get(t):e[t],My=(e,t,n,r=ky(e))=>{r===2?e.set(t,n):r===3?e.add(n):e[t]=n};function Ny(e,t){return e===t?e!==0||1/e==1/t:e!==e&&t!==t}var Py=Array.isArray,Fy=e=>e instanceof Map,Iy=e=>e instanceof Set,Ly=e=>typeof e==`object`,Ry=e=>typeof e==`function`,zy=e=>typeof e==`boolean`;function By(e){let t=+e;return Number.isInteger(t)&&String(t)===e}var Vy=e=>Ly(e)?e?.[fy]:null,Hy=e=>e.copy_||e.base_,Uy=e=>e.modified_?e.copy_:e.base_;function Wy(e,t){if(Fy(e))return new Map(e);if(Iy(e))return new Set(e);if(Py(e))return Array[vy].slice.call(e);let n=Dy(e);if(t===!0||t===`class_only`&&!n){let t=hy.getOwnPropertyDescriptors(e);delete t[fy];let n=Reflect.ownKeys(t);for(let r=0;r<n.length;r++){let i=n[r],a=t[i];a[xy]===!1&&(a[xy]=!0,a[yy]=!0),(a.get||a.set)&&(t[i]={[yy]:!0,[xy]:!0,[by]:a[by],[Sy]:e[i]})}return hy.create(gy(e),t)}{let t=gy(e);if(t!==null&&n)return{...e};let r=hy.create(t);return hy.assign(r,e)}}function Gy(e,t=!1){return Jy(e)||Cy(e)||!wy(e)?e:(ky(e)>1&&hy.defineProperties(e,{set:qy,add:qy,clear:qy,delete:qy}),hy.freeze(e),t&&Oy(e,(e,t)=>{Gy(t,!0)},!1),e)}function Ky(){my(2)}var qy={[Sy]:Ky};function Jy(e){return e===null||!Ly(e)||hy.isFrozen(e)}var Yy=`MapSet`,Xy=`Patches`,Zy=`ArrayMethods`,Qy={};function $y(e){let t=Qy[e];return t||my(0,e),t}var eb=e=>!!Qy[e];function tb(e,t){Qy[e]||(Qy[e]=t)}var nb,rb=()=>nb,ib=(e,t)=>({drafts_:[],parent_:e,immer_:t,canAutoFreeze_:!0,unfinalizedDrafts_:0,handledSet_:new Set,processedForPatches_:new Set,mapSetPlugin_:eb(Yy)?$y(Yy):void 0,arrayMethodsPlugin_:eb(Zy)?$y(Zy):void 0});function ab(e,t){t&&(e.patchPlugin_=$y(Xy),e.patches_=[],e.inversePatches_=[],e.patchListener_=t)}function ob(e){sb(e),e.drafts_.forEach(lb),e.drafts_=null}function sb(e){e===nb&&(nb=e.parent_)}var cb=e=>nb=ib(nb,e);function lb(e){let t=e[fy];t.type_===0||t.type_===1?t.revoke_():t.revoked_=!0}function ub(e,t){t.unfinalizedDrafts_=t.drafts_.length;let n=t.drafts_[0];if(e!==void 0&&e!==n){n[fy].modified_&&(ob(t),my(4)),wy(e)&&(e=db(t,e));let{patchPlugin_:r}=t;r&&r.generateReplacementPatches_(n[fy].base_,e,t)}else e=db(t,n);return fb(t,e,!0),ob(t),t.patches_&&t.patchListener_(t.patches_,t.inversePatches_),e===uy?void 0:e}function db(e,t){if(Jy(t))return t;let n=t[fy];if(!n)return bb(t,e.handledSet_,e);if(!mb(n,e))return t;if(!n.modified_)return n.base_;if(!n.finalized_){let{callbacks_:t}=n;if(t)for(;t.length>0;)t.pop()(e);vb(n,e)}return n.copy_}function fb(e,t,n=!1){!e.parent_&&e.immer_.autoFreeze_&&e.canAutoFreeze_&&Gy(t,n)}function pb(e){e.finalized_=!0,e.scope_.unfinalizedDrafts_--}var mb=(e,t)=>e.scope_===t,hb=[];function gb(e,t,n,r){let i=Hy(e),a=e.type_;if(r!==void 0&&jy(i,r,a)===t){My(i,r,n,a);return}if(!e.draftLocations_){let t=e.draftLocations_=new Map;Oy(i,(e,n)=>{if(Cy(n)){let r=t.get(n)||[];r.push(e),t.set(n,r)}})}let o=e.draftLocations_.get(t)??hb;for(let e of o)My(i,e,n,a)}function _b(e,t,n){e.callbacks_.push(function(r){let i=t;if(!i||!mb(i,r))return;r.mapSetPlugin_?.fixSetContents(i);let a=Uy(i);gb(e,i.draft_??i,a,n),vb(i,r)})}function vb(e,t){if(e.modified_&&!e.finalized_&&(e.type_===3||e.type_===1&&e.allIndicesReassigned_||(e.assigned_?.size??0)>0)){let{patchPlugin_:n}=t;if(n){let r=n.getPath(e);r&&n.generatePatches_(e,r,t)}pb(e)}}function yb(e,t,n){let{scope_:r}=e;if(Cy(n)){let i=n[fy];mb(i,r)&&i.callbacks_.push(function(){kb(e),gb(e,n,Uy(i),t)})}else wy(n)&&e.callbacks_.push(function(){let i=Hy(e);e.type_===3?i.has(n)&&bb(n,r.handledSet_,r):jy(i,t,e.type_)===n&&r.drafts_.length>1&&(e.assigned_.get(t)??!1)===!0&&e.copy_&&bb(jy(e.copy_,t,e.type_),r.handledSet_,r)})}function bb(e,t,n){return!n.immer_.autoFreeze_&&n.unfinalizedDrafts_<1||Cy(e)||t.has(e)||!wy(e)||Jy(e)?e:(t.add(e),Oy(e,(r,i)=>{if(Cy(i)){let t=i[fy];mb(t,n)&&(My(e,r,Uy(t),e.type_),pb(t))}else wy(i)&&bb(i,t,n)}),e)}function xb(e,t){let n=Py(e),r={type_:+!!n,scope_:t?t.scope_:rb(),modified_:!1,finalized_:!1,assigned_:void 0,parent_:t,base_:e,draft_:null,copy_:null,revoke_:null,isManual_:!1,callbacks_:void 0},i=r,a=Sb;n&&(i=[r],a=Cb);let{revoke:o,proxy:s}=Proxy.revocable(i,a);return r.draft_=s,r.revoke_=o,[s,r]}var Sb={get(e,t){if(t===fy)return e;let n=e.scope_.arrayMethodsPlugin_,r=e.type_===1&&typeof t==`string`;if(r&&n?.isArrayOperationMethod(t))return n.createMethodInterceptor(e,t);let i=Hy(e);if(!Ay(i,t,e.type_))return Eb(e,i,t);let a=i[t];if(e.finalized_||!wy(a)||r&&e.operationMethod&&n?.isMutatingArrayMethod(e.operationMethod)&&By(t))return a;if(a===wb(e.base_,t)||Tb(e,t,a)){kb(e);let n=e.type_===1?+t:t,r=jb(e.scope_,a,e,n);return e.copy_[n]=r}return a},has(e,t){return t in Hy(e)},ownKeys(e){return Reflect.ownKeys(Hy(e))},set(e,t,n){let r=Db(Hy(e),t);if(r?.set)return r.set.call(e.draft_,n),!0;if(!e.modified_){let r=wb(Hy(e),t),i=r?.[fy];if(i&&i.base_===n)return e.copy_[t]=n,e.assigned_.set(t,!1),!0;if(Ny(n,r)&&(n!==void 0||Ay(e.base_,t,e.type_)))return!0;kb(e),Ob(e)}return e.copy_[t]===n&&(n!==void 0||Ay(e.copy_,t,e.type_))||Number.isNaN(n)&&Number.isNaN(e.copy_[t])?!0:(e.copy_[t]=n,e.assigned_.set(t,!0),yb(e,t,n),!0)},deleteProperty(e,t){return kb(e),wb(e.base_,t)!==void 0||t in e.base_?(e.assigned_.set(t,!1),Ob(e)):e.assigned_.delete(t),e.copy_&&delete e.copy_[t],!0},getOwnPropertyDescriptor(e,t){let n=Hy(e),r=Reflect.getOwnPropertyDescriptor(n,t);return r&&{[xy]:!0,[yy]:e.type_!==1||t!==`length`,[by]:r[by],[Sy]:n[t]}},defineProperty(){my(11)},getPrototypeOf(e){return gy(e.base_)},setPrototypeOf(){my(12)}},Cb={};for(let e in Sb){let t=Sb[e];Cb[e]=function(){let e=arguments;return e[0]=e[0][0],t.apply(this,e)}}Cb.deleteProperty=function(e,t){return isNaN(parseInt(t))&&my(13),Cb.set.call(this,e,t,void 0)},Cb.set=function(e,t,n){return t!==`length`&&isNaN(parseInt(t))&&my(14),Sb.set.call(this,e[0],t,n,e[0])};function wb(e,t){let n=e[fy];return(n?Hy(n):e)[t]}function Tb(e,t,n){return e.type_!==1||!e.allIndicesReassigned_||e.assigned_?.get(t)||!wy(n)||n[fy]?!1:e.baseRefs_.has(n)}function Eb(e,t,n){let r=Db(t,n);return r?Sy in r?r[Sy]:r.get?.call(e.draft_):void 0}function Db(e,t){if(!(t in e))return;let n=gy(e);for(;n;){let e=Object.getOwnPropertyDescriptor(n,t);if(e)return e;n=gy(n)}}function Ob(e){e.modified_||(e.modified_=!0,e.parent_&&Ob(e.parent_))}function kb(e){e.copy_||=(e.assigned_=new Map,Wy(e.base_,e.scope_.immer_.useStrictShallowCopy_))}var Ab=class{constructor(e){this.autoFreeze_=!0,this.useStrictShallowCopy_=!1,this.useStrictIteration_=!1,this.produce=(e,t,n)=>{if(Ry(e)&&!Ry(t)){let n=t;t=e;let r=this;return function(e=n,...i){return r.produce(e,e=>t.call(this,e,...i))}}Ry(t)||my(6),n!==void 0&&!Ry(n)&&my(7);let r;if(wy(e)){let i=cb(this),a=jb(i,e,void 0),o=!0;try{r=t(a),o=!1}finally{o?ob(i):sb(i)}return ab(i,n),ub(r,i)}if(!e||!Ly(e)){if(r=t(e),r===void 0&&(r=e),r===uy&&(r=void 0),this.autoFreeze_&&Gy(r,!0),n){let t=[],i=[];$y(Xy).generateReplacementPatches_(e,r,{patches_:t,inversePatches_:i}),n(t,i)}return r}my(1,e)},this.produceWithPatches=(e,t)=>{if(Ry(e))return(t,...n)=>this.produceWithPatches(t,t=>e(t,...n));let n,r;return[this.produce(e,t,(e,t)=>{n=e,r=t}),n,r]},zy(e?.autoFreeze)&&this.setAutoFreeze(e.autoFreeze),zy(e?.useStrictShallowCopy)&&this.setUseStrictShallowCopy(e.useStrictShallowCopy),zy(e?.useStrictIteration)&&this.setUseStrictIteration(e.useStrictIteration)}createDraft(e){wy(e)||my(8),Cy(e)&&(e=Mb(e));let t=cb(this),n=jb(t,e,void 0);return n[fy].isManual_=!0,sb(t),n}finishDraft(e,t){let n=e&&e[fy];(!n||!n.isManual_)&&my(9);let{scope_:r}=n;return ab(r,t),ub(void 0,r)}setAutoFreeze(e){this.autoFreeze_=e}setUseStrictShallowCopy(e){this.useStrictShallowCopy_=e}setUseStrictIteration(e){this.useStrictIteration_=e}shouldUseStrictIteration(){return this.useStrictIteration_}applyPatches(e,t){let n;for(n=t.length-1;n>=0;n--){let r=t[n];if(r.path.length===0&&r.op===`replace`){e=r.value;break}}n>-1&&(t=t.slice(n+1));let r=$y(Xy).applyPatches_;return Cy(e)?r(e,t):this.produce(e,e=>r(e,t))}};function jb(e,t,n,r){let[i,a]=Fy(t)?$y(Yy).proxyMap_(t,n):Iy(t)?$y(Yy).proxySet_(t,n):xb(t,n);return(n?.scope_??rb()).drafts_.push(i),a.callbacks_=n?.callbacks_??[],a.key_=r,n&&r!==void 0?_b(n,a,r):a.callbacks_.push(function(e){e.mapSetPlugin_?.fixSetContents(a);let{patchPlugin_:t}=e;a.modified_&&t&&t.generatePatches_(a,[],e)}),i}function Mb(e){return Cy(e)||my(10,e),Nb(e)}function Nb(e){if(!wy(e)||Jy(e))return e;let t=e[fy],n,r=!0;if(t){if(!t.modified_)return t.base_;t.finalized_=!0,n=Wy(e,t.scope_.immer_.useStrictShallowCopy_),r=t.scope_.immer_.shouldUseStrictIteration()}else n=Wy(e,!0);return Oy(n,(e,t)=>{My(n,e,Nb(t))},r),t&&(t.finalized_=!1),n}function Pb(){py.push(`Sets cannot have "replace" patches.`,function(e){return`Unsupported patch operation: `+e},function(e){return`Cannot apply patch, path doesn't resolve: `+e},`Patching reserved attributes like __proto__, prototype and constructor is not allowed`);function e(n,r=[]){if(n.key_!==void 0){let e=n.parent_.copy_??n.parent_.base_,t=Vy(jy(e,n.key_)),i=jy(e,n.key_);if(i===void 0||i!==n.draft_&&i!==n.base_&&i!==n.copy_||t!=null&&t.base_!==n.base_)return null;let a=n.parent_.type_===3,o;if(a){let e=n.parent_;o=Array.from(e.drafts_.keys()).indexOf(n.key_)}else o=n.key_;if(!(a&&e.size>o||Ay(e,o)))return null;r.push(o)}if(n.parent_)return e(n.parent_,r);r.reverse();try{t(n.copy_,r)}catch{return null}return r}function t(e,t){let n=e;for(let e=0;e<t.length-1;e++){let r=t[e];if(n=jy(n,r),!Ly(n)||n===null)throw Error(`Cannot resolve path at '${t.join(`/`)}'`)}return n}let n=`replace`,r=`remove`;function i(e,t,n){if(e.scope_.processedForPatches_.has(e))return;e.scope_.processedForPatches_.add(e);let{patches_:r,inversePatches_:i}=n;switch(e.type_){case 0:case 2:return o(e,t,r,i);case 1:return a(e,t,r,i);case 3:return s(e,t,r,i)}}function a(e,t,i,a){let{base_:o,assigned_:s}=e,c=e.copy_;c.length<o.length&&([o,c]=[c,o],[i,a]=[a,i]);let l=e.allIndicesReassigned_===!0;for(let e=0;e<o.length;e++){let r=c[e],u=o[e];if((l||s?.get(e.toString()))&&r!==u){let o=r?.[fy];if(o&&o.modified_)continue;let s=t.concat([e]);i.push({op:n,path:s,value:d(r)}),a.push({op:n,path:s,value:d(u)})}}for(let e=o.length;e<c.length;e++){let n=t.concat([e]);i.push({op:`add`,path:n,value:d(c[e])})}for(let e=c.length-1;o.length<=e;--e){let n=t.concat([e]);a.push({op:r,path:n})}}function o(e,t,i,a){let{base_:o,copy_:s,type_:c}=e;Oy(e.assigned_,(e,l)=>{let u=jy(o,e,c),f=jy(s,e,c),p=l?Ay(o,e)?n:`add`:r;if(u===f&&p===n)return;let m=t.concat(e);i.push(p===r?{op:p,path:m}:{op:p,path:m,value:d(f)}),a.push(p===`add`?{op:r,path:m}:p===r?{op:`add`,path:m,value:d(u)}:{op:n,path:m,value:d(u)})})}function s(e,t,n,i){let{base_:a,copy_:o}=e,s=0;a.forEach(e=>{if(!o.has(e)){let a=t.concat([s]);n.push({op:r,path:a,value:e}),i.unshift({op:`add`,path:a,value:e})}s++}),s=0,o.forEach(e=>{if(!a.has(e)){let a=t.concat([s]);n.push({op:`add`,path:a,value:e}),i.unshift({op:r,path:a,value:e})}s++})}function c(e,t,r){let{patches_:i,inversePatches_:a}=r;i.push({op:n,path:[],value:t===uy?void 0:t}),a.push({op:n,path:[],value:e})}function l(e,t){return t.forEach(t=>{let{path:i,op:a}=t,o=e;for(let e=0;e<i.length-1;e++){let t=ky(o),n=i[e];typeof n!=`string`&&typeof n!=`number`&&(n=``+n),(t===0||t===1)&&(n===`__proto__`||n===_y)&&my(19),Ry(o)&&n===vy&&my(19),o=jy(o,n),(o===null||!Ly(o))&&my(18,i.join(`/`))}let s=ky(o),c=u(t.value),l=i[i.length-1];switch(a){case n:switch(s){case 2:return o.set(l,c);case 3:my(16);default:return o[l]=c}case`add`:switch(s){case 1:return l===`-`?o.push(c):o.splice(l,0,c);case 2:return o.set(l,c);case 3:return o.add(c);default:return o[l]=c}case r:switch(s){case 1:return o.splice(l,1);case 2:return o.delete(l);case 3:return o.delete(t.value);default:return delete o[l]}default:my(17,a)}}),e}function u(e){if(!wy(e))return e;if(Py(e))return e.map(u);if(Fy(e))return new Map(Array.from(e.entries()).map(([e,t])=>[e,u(t)]));if(Iy(e))return new Set(Array.from(e).map(u));let t=Object.create(gy(e));for(let n in e)t[n]=u(e[n]);return Ay(e,dy)&&(t[dy]=e[dy]),t}function d(e){return Cy(e)?u(e):e}tb(Xy,{applyPatches_:l,generatePatches_:i,generateReplacementPatches_:c,getPath:e})}globalThis.Iterator?.from;var Fb=new Ab,Ib=Fb.produce,Lb=Fb.produceWithPatches.bind(Fb),Rb=Fb.applyPatches.bind(Fb),zb=1e3;function Bb(e,t){if(e.add(t),e.size>zb){let t=e.values().next().value;t!==void 0&&e.delete(t)}}function Vb(e){let{enablePatches:t=!1}=e;t&&Pb();let n=ty(),r=e.initialValue,i=new Set;return{on:n.on,value:()=>r,patch:(e,t=ly())=>{i.has(t)||(Pb(),r=Rb(r,e),Bb(i,t),n.emit(`updated`,r,void 0,t))},mutate:(e,a=ly())=>{if(!i.has(a)){if(Bb(i,a),t){let[t,i]=Lb(r,e);if(t===r)return;r=t,n.emit(`updated`,r,i,a)}else{let t=Ib(r,e);if(t===r)return;r=t,n.emit(`updated`,r,void 0,a)}}},syncIds:i}}var Hb=typeof self==`object`?self:globalThis,Ub=new Set([`Error`,`EvalError`,`RangeError`,`ReferenceError`,`SyntaxError`,`TypeError`,`URIError`,`AggregateError`]),Wb=new Set([`Boolean`,`Number`,`String`,`Int8Array`,`Uint8Array`,`Uint8ClampedArray`,`Int16Array`,`Uint16Array`,`Int32Array`,`Uint32Array`,`Float16Array`,`Float32Array`,`Float64Array`,`BigInt64Array`,`BigUint64Array`]);function Gb(e,t){let n=(t,n)=>(e.set(n,t),t),r=i=>{if(e.has(i))return e.get(i);let[a,o]=t[i];switch(a){case 0:case-1:return n(o,i);case 1:{let e=n([],i);for(let t of o)e.push(r(t));return e}case 2:{let e=n({},i);for(let[t,n]of o)e[r(t)]=r(n);return e}case 3:return n(new Date(o),i);case 4:{let{source:e,flags:t}=o;return n(new RegExp(e,t),i)}case 5:{let e=n(new Map,i);for(let[t,n]of o)e.set(r(t),r(n));return e}case 6:{let e=n(new Set,i);for(let t of o)e.add(r(t));return e}case 7:{let{name:e,message:t}=o,r=Ub.has(e)?Hb[e]:void 0;return n(new(r??Hb.Error)(t),i)}case 8:return n(BigInt(o),i);case`BigInt`:return n(Object(BigInt(o)),i);case`ArrayBuffer`:return n(new Uint8Array(o).buffer,o);case`DataView`:{let{buffer:e}=new Uint8Array(o);return n(new DataView(e),o)}}if(typeof a==`string`&&Wb.has(a))return n(new Hb[a](o),i);throw TypeError(`unable to deserialize unsafe or unknown type: ${String(a)}`)};return r}function Kb(e){return Gb(new Map,e)(0)}var qb=``,{toString:Jb}={},{keys:Yb}=Object;function Xb(e){let t=typeof e;if(t!==`object`||!e)return[0,t];let n=Jb.call(e).slice(8,-1);switch(n){case`Array`:return[1,qb];case`Object`:return[2,qb];case`Date`:return[3,qb];case`RegExp`:return[4,qb];case`Map`:return[5,qb];case`Set`:return[6,qb];case`DataView`:return[1,n]}return n.includes(`Array`)?[1,n]:n.includes(`Error`)?[7,n]:[2,n]}function Zb([e,t]){return e===0&&(t===`function`||t===`symbol`)}function Qb(e,t,n,r){let i=(e,t)=>{let i=r.push(e)-1;return n.set(t,i),i},a=r=>{if(n.has(r))return n.get(r);let[o,s]=Xb(r);switch(o){case 0:{let t=r;switch(s){case`bigint`:o=8,t=r.toString();break;case`function`:case`symbol`:if(e)throw TypeError(`unable to serialize ${s}`);t=null;break;case`undefined`:return i([-1],r)}return i([o,t],r)}case 1:{if(s){let e=r;return s===`DataView`?e=new Uint8Array(r.buffer):s===`ArrayBuffer`&&(e=new Uint8Array(r)),i([s,[...e]],r)}let e=[],t=i([o,e],r);for(let t of r)e.push(a(t));return t}case 2:{if(s)switch(s){case`BigInt`:return i([s,r.toString()],r);case`Boolean`:case`Number`:case`String`:return i([s,r.valueOf()],r)}if(t&&`toJSON`in r)return a(r.toJSON());let n=[],c=i([o,n],r);for(let t of Yb(r))(e||!Zb(Xb(r[t])))&&n.push([a(t),a(r[t])]);return c}case 3:return i([o,r.toISOString()],r);case 4:{let{source:e,flags:t}=r;return i([o,{source:e,flags:t}],r)}case 5:{let t=[],n=i([o,t],r);for(let[n,i]of r)(e||!(Zb(Xb(n))||Zb(Xb(i))))&&t.push([a(n),a(i)]);return n}case 6:{let t=[],n=i([o,t],r);for(let n of r)(e||!Zb(Xb(n)))&&t.push(a(n));return n}}let{message:c}=r;return i([o,{name:s,message:c}],r)};return a}function $b(e,t={}){let n=[];return Qb(!(t.json||t.lossy),!!t.json,new Map,n)(e),n}var{parse:ex,stringify:tx}=JSON,nx={json:!0,lossy:!0};function rx(e){return Kb(ex(e))}function ix(e){return tx($b(e,nx))}function ax(e){return Kb(e)}function ox(e){return ix(e)}function sx(e){return rx(e)}var cx=256,lx=class extends Error{name=`StreamClosedError`};function ux(e={}){let t=e.id??ly(),n=Math.max(0,e.replayWindow??0),r=ty(),i=new AbortController,a=[],o=!1,s=0;function c(e){if(o)throw new lx(`Cannot write to a closed stream "${t}"`);s+=1,n>0&&(a.push({seq:s,chunk:e}),a.length>n&&(a.length-n===1?a.shift():a.splice(0,a.length-n))),r.emit(`chunk`,s,e)}function l(e){if(o)return;o=!0;let t=fx(e);i.abort(e),r.emit(`end`,t)}function u(){o||(o=!0,i.signal.aborted||i.abort(`stream closed`),r.emit(`end`,void 0))}function d(e){o||i.signal.aborted||i.abort(e??`aborted`)}let f=new WritableStream({write(e){c(e)},close(){u()},abort(e){l(e)}});return{id:t,signal:i.signal,get closed(){return o},get lastSeq(){return s},write:c,error:l,close:u,abort:d,writable:f,events:r,buffer:a}}function dx(e={}){let t=e.id??ly(),n=Math.max(1,e.highWaterMark??cx),r=[],i=0,a=!1,o=!1,s,c,l,u;function d(){if(c){if(r.length>0){let e=r.shift(),t=c;c=void 0,t.resolve({value:e,done:!1});return}if(a){let e=c;if(c=void 0,s){let t=Error(s.message);t.name=s.name,e.reject(t)}else e.resolve({value:void 0,done:!0})}}}function f(){if(l){for(;r.length>0;){let e=r.shift();try{l.enqueue(e)}catch{break}}if(a&&l){try{if(s){let e=Error(s.message);e.name=s.name,l.error(e)}else l.close()}catch{}l=void 0}}}function p(t,s){if(!(a||o)&&!(t<=i)){if(i=t,r.push(s),r.length>n){let t=r.length-n;r.splice(0,t),e.onOverflow?.(t)}d(),u&&f()}}function m(e){a||(a=!0,s=e,d(),u&&f())}function h(){o||a||(o=!0,e.onCancel?.(),m(void 0))}function g(){return u||(u=new ReadableStream({start(e){l=e,f()},cancel(){h()}}),u)}return{id:t,get cancelled(){return o},get done(){return a},get lastSeenSeq(){return i},get readable(){return g()},cancel:h,_push:p,_end:m,[Symbol.asyncIterator](){return{next(){if(r.length>0)return Promise.resolve({value:r.shift(),done:!1});if(a){if(s){let e=Error(s.message);return e.name=s.name,Promise.reject(e)}return Promise.resolve({value:void 0,done:!0})}return new Promise((e,t)=>{c={resolve:e,reject:t}})},return(){return h(),Promise.resolve({value:void 0,done:!0})}}}}}function fx(e){if(e instanceof Error)return{name:e.name||`Error`,message:e.message};if(typeof e==`string`)return{name:`Error`,message:e};try{return{name:`Error`,message:JSON.stringify(e)}}catch{return{name:`Error`,message:String(e)}}}var px=128;function mx(e){return e.replace(/[^\w-]+/g,`_`).slice(0,px)}var hx=`modulepreload`,gx=function(e,t){return new URL(e,t).href},_x={},vx=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=gx(t,n),t=s(t),t in _x)return;_x[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:hx,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},yx=`__connection.json`,bx=`__DEVFRAME_CONNECTION__`,xx=`x-birpc-session`,Sx=`__rpc-dump/index.json`,Cx=`devframe:services`,wx=`devframe_otp`,Tx=`devframe_auth_token`;xv.postMessage.remoteAssetsError;var Ex=class{cacheMap=new Map;options;keySerializer;constructor(e){this.options=e,this.keySerializer=e.keySerializer||(e=>ey(e))}updateOptions(e){this.options={...this.options,...e}}cached(e,t){let n=this.cacheMap.get(e);if(n)return n.get(this.keySerializer(t))}has(e,t){return this.cacheMap.get(e)?.has(this.keySerializer(t))??!1}apply(e,t){let n=this.cacheMap.get(e.m)||new Map;n.set(this.keySerializer(e.a),t),this.cacheMap.set(e.m,n)}validate(e){return this.options.functions.includes(e)}clear(e){e?this.cacheMap.delete(e):this.cacheMap.clear()}},Dx=wv({docsBase:`https://devfra.me/errors`,codes:{DF0019:{why:e=>`RPC function "${e.name}" has \`agent\` set but \`jsonSerializable\` is \`false\`; MCP requires JSON-serializable data.`,fix:"Remove `jsonSerializable: false`, or remove `agent` to keep it RPC-only."},DF0020:{why:e=>`RPC function "${e.name}" declares \`jsonSerializable: true\` but the value at "${e.path}" is a ${e.type}.`,fix:"Either drop `jsonSerializable: true` (falls back to structured-clone) or change the value to a JSON-safe shape."},DF0021:{why:e=>`RPC function "${e.name}" is already registered`,fix:"Use the `force` parameter to overwrite an existing registration."},DF0022:{why:e=>`RPC function "${e.name}" is not registered. Use register() to add new functions.`},DF0023:{why:e=>`RPC function "${e.name}" is not registered`},DF0024:{why:e=>`Either handler or setup function must be provided for RPC function "${e.name}"`},DF0025:{why:e=>`Function "${e.name}" not found in dump store`},DF0026:{why:e=>`No dump match for "${e.name}" with args: ${e.args}`},DF0027:{why:e=>`Function "${e.name}" with type "${e.type}" cannot have dump configuration. Only "static" and "query" types support dumps.`},DF0028:{why:e=>`Function "${e.name}" with type "${e.type}" cannot use \`snapshot: true\`. Only "query" functions support this sugar; "static" functions have equivalent default behavior already.`,fix:"Remove `snapshot: true`, or change the function type to `query`."},DF0043:{why:e=>`RPC function "${e.name}" received an invalid argument at position ${e.index}: ${e.issues}`,fix:"Pass a value that satisfies the `args` schema declared for this function."},DF0044:{why:e=>`RPC function "${e.name}" returned a value that failed its \`returns\` schema: ${e.issues}`,fix:"Make the handler return a value that satisfies the `returns` schema, or relax the schema."}}});function Ox(e){if(e.agent&&e.jsonSerializable===!1)throw Dx.DF0019({name:e.name});e.agent&&!e.jsonSerializable&&(e.jsonSerializable=!0)}async function kx(e,t){let n=e[`~standard`].validate(t);return n instanceof Promise?await n:n}function Ax(e){return e.map(e=>{let t=e.path?.map(e=>typeof e==`object`?e.key:e).join(`.`);return t?`${t}: ${e.message}`:e.message}).join(`; `)}async function jx(e,t,n){let r=n.slice();if(!t||t.length===0)return r;for(let r=0;r<t.length;r++){let i=t[r];if(!i)continue;let a=await kx(i,n[r]);if(a.issues)throw Dx.DF0043({name:e,index:r,issues:Ax(a.issues)})}return r}async function Mx(e,t,n){if(!t)return n;let r=await kx(t,n);if(r.issues)throw Dx.DF0044({name:e,issues:Ax(r.issues)});return n}async function Nx(e,t){if(!e.setup)return{};if(typeof t==`object`&&t){e.__cache??=new WeakMap;let n=e.__cache,r=n.get(t);return r||(r=Promise.resolve(e.setup(t)),r.catch(()=>{n.get(t)===r&&n.delete(t)}),n.set(t,r)),await r}if(!e.__promise){let n=Promise.resolve(e.setup(t));n.catch(()=>{e.__promise===n&&(e.__promise=void 0)}),e.__promise=n}return await e.__promise}async function Px(e,t){let n=e.handler;if(!n){let r=await Nx(e,t);if(!r.handler)throw Dx.DF0024({name:e.name});n=r.handler}let r=e.args,i=e.returns;if(!r&&!i)return n;let a=n;return async(...t)=>{let n=await jx(e.name,r,t),o=await a(...n);return await Mx(e.name,i,o)}}var Fx=class{context;definitions=new Map;functions;_onChanged=[];constructor(e){this.context=e;let t=this.definitions,n=this;this.functions=new Proxy({},{get(e,r){let i=t.get(r);if(i)return Px(i,n.context)},has(e,n){return t.has(n)},getOwnPropertyDescriptor(e,n){return{value:t.get(n)?.handler,configurable:!0,enumerable:!0}},ownKeys(){return Array.from(t.keys())}})}register(e,t=!1){if(this.definitions.has(e.name)&&!t)throw Dx.DF0021({name:e.name});Ox(e),this.definitions.set(e.name,e),this._onChanged.forEach(t=>t(e.name))}update(e,t=!1){if(!this.definitions.has(e.name)&&!t)throw Dx.DF0022({name:e.name});Ox(e),this.definitions.set(e.name,e),this._onChanged.forEach(t=>t(e.name))}onChanged(e){return this._onChanged.push(e),()=>{let t=this._onChanged.indexOf(e);t!==-1&&this._onChanged.splice(t,1)}}async getHandler(e){return await Px(this.definitions.get(e),this.context)}getSchema(e){let t=this.definitions.get(e);if(!t)throw Dx.DF0023({name:String(e)});return{args:t.args,returns:t.returns}}has(e){return this.definitions.has(e)}get(e){return this.definitions.get(e)}list(){return Array.from(this.definitions.keys())}};function Ix(e,t=``){return JSON.stringify(e,function(e,n){let r=this,i=r==null?n:r[e];if(i===void 0){if(Array.isArray(r))throw Rx(t,`undefined`,r,e);return n}return i!==null&&Lx(i,r,e,t),n})}function Lx(e,t,n,r){if(typeof e==`bigint`)throw Rx(r,`BigInt`,t,n);if(typeof e!=`object`)return;if(e instanceof Map)throw Rx(r,`Map`,t,n);if(e instanceof Set)throw Rx(r,`Set`,t,n);if(e instanceof Date)throw Rx(r,`Date`,t,n);if(Array.isArray(e))return;let i=Object.getPrototypeOf(e);if(i!==null&&i!==Object.prototype)throw Rx(r,e.constructor?.name??`class instance`,t,n)}function Rx(e,t,n,r){let i=zx(n,r);return Dx.DF0020({name:e||`<anonymous>`,type:t,path:i})}function zx(e,t){return Array.isArray(e)?`[${t}]`:t===``?`<root>`:t}var Bx=`__DEVFRAME_CONNECTION_META__`,Vx=`__DEVFRAME_CONNECTION_AUTH_TOKEN__`;function Hx(e){let t=[()=>window?.[e],()=>globalThis?.[e],()=>parent.window?.[e]];for(let e of t)try{let t=e();if(t)return t}catch{}}function Ux(){return Hx(bx)}function Wx(){return Hx(Bx)}function Gx(e){if(e)return e;try{let e=localStorage.getItem(Vx);if(e)return e}catch{}return Hx(Vx)}function Kx(e){globalThis[bx]=e,globalThis[Bx]={...e.connectionMeta,baseUrl:e.metaBaseUrl},e.authToken&&qx(e.authToken)}function qx(e){try{localStorage.setItem(Vx,e)}catch{}globalThis[Vx]=e;let t=Ux();t&&(globalThis[bx]={...t,authToken:e})}function Jx(e){let t=oy(yx,e);try{return new URL(t,globalThis.location?.href).href}catch{return t}}function Yx(e,t){return t&&t!==e.authToken?{...e,authToken:t}:e}function Xx(){let e=Ux();if(e)return Yx(e,Gx()??e.authToken??e.connectionMeta.authToken);let t=Wx();if(t)return{connectionMeta:t,metaBaseUrl:t.baseUrl??Jx(`./`),authToken:Gx(t.authToken)}}async function Zx(e={}){if(e.connection){let t=Yx(e.connection,Gx(e.authToken??e.connection.authToken??e.connection.connectionMeta.authToken));return Kx(t),t}let t=Array.isArray(e.baseURL)?e.baseURL:[e.baseURL??`./`];if(e.connectionMeta){let n={connectionMeta:e.connectionMeta,metaBaseUrl:Jx(t[0]??`./`),authToken:Gx(e.authToken??e.connectionMeta.authToken)};return Kx(n),n}let n=Xx();if(n){let t=Yx(n,Gx(e.authToken??n.authToken??n.connectionMeta.authToken));return Kx(t),t}let r=[];for(let n of t){let t=oy(yx,n),i=Jx(n);try{let n=await fetch(t);if(!n.ok)throw Error(`Failed to fetch connection meta from ${i}: ${n.status}`);let r=await n.json(),a=n.url||i,o={connectionMeta:r,metaBaseUrl:r.baseUrl?new URL(r.baseUrl,a).href:a,authToken:Gx(e.authToken??r.authToken)};return Kx(o),o}catch(e){r.push(e)}}throw Error(`Failed to get connection meta from ${t.join(`, `)}`,{cause:r})}var Qx=class extends Error{name=`DevframeConnectionError`;kind;constructor(e,t,n){super(t,n),this.kind=e}};function $x(e=wx){try{let t=globalThis.location?.hash?.replace(/^#/,``)??``;return new URLSearchParams(t).get(e)||void 0}catch{return}}function eS(e){try{let t=new URL(globalThis.location.href),n=new URLSearchParams(t.hash.replace(/^#/,``));if(!n.has(e))return;n.delete(e),t.hash=n.toString(),globalThis.history?.replaceState(globalThis.history.state,``,t.href)}catch{}}function tS(e=wx){let t=$x(e);return t&&eS(e),t}async function nS(e,t={}){let n=tS(t.param??`devframe_otp`);return n?e.isTrusted?!0:e.requestTrustWithCode(n):!1}function rS(e){let t={},n=new WeakMap,r,i=()=>(r??=e.sharedState.get(Cx,{initialValue:{}}).then(e=>(t=e.value(),e.on(`updated`,e=>{t=e}),e)),r);return i(),{state:i,has:e=>e in t,keys:()=>Object.keys(t),get:r=>{let i=t[r];if(!i)return;let a=n.get(i);return a||(a={...i,rpc:e.scope(i.scope).rpc},n.set(i,a)),a}}}function iS(e){let t=new Map,n=new Map,r=new Map,i=new Set,a=e.connectionMeta.backend===`static`;function o(e,t){let n=r.get(e);return n&&typeof n==`object`&&!Array.isArray(n)&&typeof t==`object`&&!Array.isArray(t)?{...n,...t}:t}e.client.register({name:xv.broadcast.clientStateUpdated,type:`event`,handler:(e,n,r)=>{let i=t.get(e);i&&!i.syncIds.has(r)&&i.mutate(()=>o(e,n),r)}}),e.client.register({name:xv.broadcast.clientStatePatch,type:`event`,handler:(e,n,r)=>{let i=t.get(e);i&&!i.syncIds.has(r)&&i.patch(n,r)}});function s(t,n){let r=[];return r.push(n.on(`updated`,(n,r,i)=>{a||(r?e.callEvent(`devframe:rpc:server-state:patch`,t,r,i):e.callEvent(`devframe:rpc:server-state:set`,t,n,i))})),()=>{for(let e of r)e()}}return{keys:()=>Array.from(t.keys()),onKeyAdded(e){return i.add(e),()=>{i.delete(e)}},delete(e){let i=n.get(e);n.delete(e);let a=t.delete(e);return r.delete(e),i?.(),a},get:async(c,l)=>{if(l?.initialValue!==void 0&&r.set(c,l.initialValue),t.has(c))return t.get(c);let u=Vb({initialValue:l?.initialValue,enablePatches:!1});async function d(){if(a||e.callEvent(`devframe:rpc:server-state:subscribe`,c),l?.initialValue!==void 0){t.set(c,u);for(let e of i)e(c);return e.call(`devframe:rpc:server-state:get`,c).then(e=>{e!==void 0&&u.mutate(()=>o(c,e))}).catch(e=>{console.error(`Error getting server state`,e)}),n.set(c,s(c,u)),u}{let r=await e.call(`devframe:rpc:server-state:get`,c);u.mutate(()=>o(c,r)),t.set(c,u);for(let e of i)e(c);return n.set(c,s(c,u)),u}}return new Promise(t=>{if(e.isTrusted)d().then(t);else{t(u);let n=!1;e.events.on(xv.client.isTrustedUpdated,e=>{e&&!n&&(n=!0,d())})}})}}}var aS=new Map;function oS(e=aS){let t=new Map;return{serialize:n=>{let r;return n.t===`q`?r=n.m:(r=t.get(n.i),t.delete(n.i)),!(n.t===`s`&&`e`in n)&&r&&e.get(r)?.jsonSerializable===!0?Ix(n,r??``):`s:${ox(n)}`},deserialize:e=>{let n=e.startsWith(`s:`)?sx(e.slice(2)):JSON.parse(e);return n.t===`q`&&n.i&&n.m&&t.set(n.i,n.m),n}}}function sS(){}function cS(e){let t=e.search(/\n\n|\r\n\r\n/);if(!(t<0))return{frame:e.slice(0,t),rest:e.slice(t+(e[t]===`\r`?4:2))}}function lS(e){let t=`message`,n=[];for(let r of e.split(/\r?\n/))r.startsWith(`:`)||(r.startsWith(`event:`)?t=r.slice(6).trimStart():r.startsWith(`data:`)&&n.push(r.slice(5).replace(/^ /,``)));return{event:t,data:n}}function uS(e){let{onConnected:t=sS,onError:n=sS,onDisconnected:r=sS,definitions:i,fetch:a=globalThis.fetch.bind(globalThis)}=e,o=e.url;e.authToken&&(o=`${o}${o.includes(`?`)?`&`:`?`}${Tx}=${encodeURIComponent(e.authToken)}`);let s=oS(i),c=new AbortController,l=!1,u,d,f,p,m=new Promise((e,t)=>{f=e,p=t});m.catch(()=>{});function h(e){l||(l=!0,p(e),n(e),r())}function g(){l||(l=!0,p(Error(`Devframe SSE stream closed`)),r())}function _(e,n){if(e===`session`){f(n),t();return}u?.(n)}async function v(e){let t=e.getReader();d=t;let n=new TextDecoder,r=``;for(;;){let{done:e,value:i}=await t.read();if(e)break;for(r+=n.decode(i,{stream:!0});;){let e=cS(r);if(!e)break;r=e.rest;let{event:t,data:n}=lS(e.frame);n.length>0&&_(t,n.join(`
`))}}g()}return(async()=>{try{let e=await a(o,{headers:{accept:`text/event-stream`},signal:c.signal});if(!e.ok||!e.body)throw Error(`Devframe SSE stream request failed: ${e.status}`);await v(e.body)}catch(e){if(c.signal.aborted){g();return}h(e instanceof Error?e:Error(String(e)))}})(),{close:()=>{l=!0,c.abort(),d?.cancel().catch(()=>{})},on:e=>{u=e},post:async e=>{let t;try{t=await m}catch{return}if(l){n(Error(`Devframe SSE channel is closed; message dropped`));return}try{let n=await a(o,{method:`POST`,headers:{"content-type":`text/plain; charset=utf-8`,[xx]:t},body:e});if(n.status===200){let e=await n.text();e&&u?.(e);return}if(!n.ok)throw Error(`Devframe SSE POST failed: ${n.status}`)}catch(e){n(e instanceof Error?e:Error(String(e)))}},serialize:s.serialize,deserialize:s.deserialize}}function dS(e,t){let{channel:n,rpcOptions:r={}}=t;return Pv(e,{...n,timeout:-1,...r,proxify:!1})}function fS(e){let{transport:t,authToken:n,connectionMeta:r,events:i,clientRpc:a,rpcOptions:o={},callTimeout:s=0}=e,c=!1,l=`connecting`,u=null,d=Promise.withResolvers();function f(e,t=null){if(t?u=t:e===`connected`&&(u=null),e===l)return;let n=l;l=e,i.emit(xv.client.connectionStatus,e,n)}let p=new Set;function m(e){for(let t of[...p])t.reject(e)}function h(){return l===`disconnected`||l===`error`?new Qx(`connection`,`[devframe] Not connected to the devframe server`,{cause:u??void 0}):l===`unauthorized`?new Qx(`auth`,`[devframe] Not authorized by the devframe server`,{cause:u??void 0}):null}function g(e,t){return new Promise((n,r)=>{let a=!1,o,c={reject(e){a||(l(),i.emit(xv.client.error,e,t),r(e))}};function l(){a=!0,p.delete(c),o&&clearTimeout(o)}p.add(c),s>0&&(o=setTimeout(()=>{c.reject(new Qx(`timeout`,`[devframe] RPC call "${t}" timed out after ${s}ms`))},s)),e.then(e=>{a||(l(),n(e))},e=>{if(a)return;l();let n=e instanceof Error?e:Error(String(e));i.emit(xv.client.error,n,t),r(n)})})}let _=new Map;for(let e of r.jsonSerializableMethods??[])_.set(e,{jsonSerializable:!0});let v=e.createChannel({definitions:_,onError(e){f(`error`,e),i.emit(xv.client.connectionError,e),m(new Qx(`connection`,`[devframe] Connection to the devframe server failed`,{cause:e}))},onDisconnected(){l!==`error`&&f(`disconnected`),m(new Qx(`connection`,`[devframe] Disconnected from the devframe server`,{cause:u??void 0}))}}),y=dS(a.functions,{channel:v,rpcOptions:o});a.register({name:xv.broadcast.authRevoked,type:`event`,handler:()=>{c=!1;let e=new Qx(`auth`,`[devframe] The devframe server revoked this client's trust`);f(`unauthorized`,e),i.emit(xv.client.connectionError,e),m(e),i.emit(xv.client.isTrustedUpdated,!1)}});let b=n;async function ee(e){b=e;let t=await y.$call(`anonymous:devframe:auth`,{authToken:e,ua:navigator.userAgent,origin:location.origin});if(c=t.isTrusted,c)d.resolve(!0),f(`connected`);else{let e=new Qx(`auth`,`[devframe] The devframe server refused this client's credentials`);f(`unauthorized`,e),i.emit(xv.client.connectionError,e)}return i.emit(xv.client.isTrustedUpdated,c),t.isTrusted}async function te(e){let t=(await y.$call(`anonymous:devframe:auth:exchange`,{code:e,ua:navigator.userAgent,origin:location.origin}))?.authToken??null;return t&&(b=t,c=!0,d.resolve(!0),f(`connected`),i.emit(xv.client.isTrustedUpdated,!0)),t}async function ne(e={}){await y.$call(`anonymous:devframe:auth:request-code`,{ua:navigator.userAgent,origin:location.origin,...e.reissue?{reissue:!0}:{}})}async function x(){return c?!0:ee(b??``)}async function S(e=6e4){if(c&&d.resolve(!0),e<=0)return d.promise;let t;try{return await Promise.race([d.promise,new Promise((n,r)=>{t=setTimeout(()=>{r(Error(`[devframe] Timeout waiting for rpc to be trusted`))},e)})]),c}finally{clearTimeout(t)}}return{transport:t,get isTrusted(){return c},get status(){return l},get connectionError(){return u},requestTrust:x,requestTrustWithToken:ee,requestTrustWithCode:te,requestAuthCode:ne,ensureTrusted:S,call:(...e)=>{let t=String(e[0]),n=h();return n?(i.emit(xv.client.error,n,t),Promise.reject(n)):g(y.$call(...e),t)},callEvent:(...e)=>{let t=h();if(t){i.emit(xv.client.error,t,String(e[0]));return}return y.$callEvent(...e)},callOptional:(...e)=>{let t=String(e[0]),n=h();return n?(i.emit(xv.client.error,n,t),Promise.reject(n)):g(y.$callOptional(...e),t)},close:()=>{v.close()}}}function pS(e,t,n){let r=(()=>{try{return new URL(t,n.href)}catch{return new URL(n.href)}})();if(e&&typeof e==`object`){if(e.host!=null||e.port!=null){let t=e.host??`${r.hostname}:${e.port}`;return new URL(e.path??`/`,`${r.protocol}//${t}`).href}return new URL(e.path??``,r).href}let i=e??``;return/^https?:\/\//i.test(i)?i:new URL(i,r).href}function mS(e){let{authToken:t,connectionMeta:n,metaBaseUrl:r,events:i,clientRpc:a,rpcOptions:o={},sseOptions:s={},callTimeout:c=0}=e,l=pS(n.sse,r??`./`,location);return fS({transport:`sse`,authToken:t,connectionMeta:n,events:i,clientRpc:a,rpcOptions:o,callTimeout:c,createChannel:e=>uS({url:l,authToken:t,definitions:e.definitions,...s,onConnected(){s.onConnected?.()},onError(t){e.onError(t),s.onError?.(t)},onDisconnected(){e.onDisconnected(),s.onDisconnected?.()}})})}function hS(e){let{name:t,message:n,cause:r,...i}=e,a=r instanceof Error?r:gS(r)?hS(r):r,o=a===void 0?Error(n):Error(n,{cause:a});return o.name=t,Object.assign(o,i),o}function gS(e){return typeof e==`object`&&!!e&&typeof e.message==`string`&&typeof e.name==`string`}function _S(e){return typeof e==`object`&&!!e&&e.type===`static`&&typeof e.path==`string`}function vS(e){return typeof e==`object`&&!!e&&e.type===`query`&&typeof e.records==`object`&&e.records!==null}function yS(e){return typeof e==`object`&&!!e&&(`output`in e||`error`in e)}function bS(e){if(e.error)throw hS(e.error);return e.output}function xS(e){return e.some(e=>e!=null)}function SS(e){return typeof e==`object`&&e&&`serialization`in e&&`data`in e?e.data:e}function CS(e,t){let n=new Map,r=new Map;function i(e,t){return t===`structured-clone`&&Array.isArray(e)?ax(e):e}function a(e,t){return i(SS(e),t)}async function o(e){n.has(e.path)||n.set(e.path,t(e.path).then(t=>a(t,e.serialization)));let r=await n.get(e.path);return yS(r)?bS(r):r}async function s(e,n){return r.has(e)||r.set(e,t(e).then(e=>a(e,n))),await r.get(e)}async function c(t,n){if(!(t in e))throw Error(`[devframe-rpc] Function "${t}" not found in dump store`);let r=e[t];if(_S(r)){if(xS(n))throw Error(`[devframe-rpc] No dump match for "${t}" with args: ${JSON.stringify(n)}`);return await o(r)}if(vS(r)){let e=ey(n),i=r.records[e];if(i)return bS(await s(i,r.serialization));if(r.fallback)return bS(await s(r.fallback,r.serialization));throw Error(`[devframe-rpc] No dump match for "${t}" with args: ${JSON.stringify(n)}`)}if(!xS(n))return r;throw Error(`[devframe-rpc] No dump match for "${t}" with args: ${JSON.stringify(n)}`)}return{call:async(e,t)=>await c(e,t),callOptional:async(t,n)=>{if(t in e)return await c(t,n)},callEvent:async(e,t)=>{}}}async function wS(e){let t=CS(await e.fetchJsonFromBases(Sx),e.fetchJsonFromBases);return{transport:`static`,isTrusted:!0,status:`connected`,connectionError:null,requestTrust:async()=>!0,requestTrustWithToken:async()=>!0,requestTrustWithCode:async()=>null,requestAuthCode:async()=>{},ensureTrusted:async()=>!0,call:(...e)=>t.call(e[0],e.slice(1)),callEvent:(...e)=>t.callEvent(e[0],e.slice(1)),callOptional:(...e)=>t.callOptional(e[0],e.slice(1)),close:()=>{}}}var TS=``;function ES(e,t){return`${e}${TS}${t}`}function DS(e){let t=new Map,n=new Map;e.client.register({name:xv.broadcast.streamingChunk,type:`event`,handler(e,n,r,i){t.get(ES(e,n))?._push(r,i)}}),e.client.register({name:xv.broadcast.streamingEnd,type:`event`,handler(e,n,r){let i=ES(e,n),a=t.get(i);a&&(a._end(r),t.delete(i))}}),e.client.register({name:xv.broadcast.streamingUploadCancel,type:`event`,handler(e,t){let r=ES(e,t),i=n.get(r);i&&(i.abort(`server cancelled upload`),n.delete(r))}}),e.events.on(xv.client.isTrustedUpdated,n=>{if(n)for(let[n,r]of t){if(r.cancelled||r.done)continue;let t=n.indexOf(TS);if(t<0)continue;let i=n.slice(0,t),a=n.slice(t+1);e.callEvent(`devframe:streaming:subscribe`,i,a,{afterSeq:r.lastSeenSeq})}});function r(n,r,i={}){let a=ES(n,r),o=t.get(a);if(o)return o;let s=dx({id:r,highWaterMark:i.highWaterMark,onOverflow(e){console.warn(`[devframe] DF0029: Stream "${n}#${r}" dropped ${e} chunk(s) after exceeding the client high-water mark.`)},onCancel(){e.callEvent(`devframe:streaming:cancel`,n,r),t.delete(a)}});if(t.set(a,s),e.isTrusted)e.callEvent(`devframe:streaming:subscribe`,n,r,{afterSeq:0});else{let i=e.events.on(xv.client.isTrustedUpdated,o=>{o&&(i(),t.has(a)&&!s.cancelled&&!s.done&&e.callEvent(`devframe:streaming:subscribe`,n,r,{afterSeq:s.lastSeenSeq}))})}return s}function i(t,r){let i=ES(t,r),a=n.get(i);if(a)return a;let o=ux({id:r});return o.events.on(`chunk`,(n,i)=>{e.callEvent(`devframe:streaming:upload-chunk`,t,r,n,i)}),o.events.on(`end`,a=>{e.callEvent(`devframe:streaming:upload-end`,t,r,a),n.delete(i)}),n.set(i,o),o}return{subscribe:r,upload:i}}function OS(){}var kS=new Map;function AS(e){let t=e.url;e.authToken&&(t=`${t}?${Tx}=${encodeURIComponent(e.authToken)}`);let n=new WebSocket(t),{onConnected:r=OS,onError:i=OS,onDisconnected:a=OS,definitions:o=kS}=e;n.addEventListener(`open`,e=>{r(e)}),n.addEventListener(`error`,e=>{let t=e instanceof Error?e:Error(e.type);i(t)}),n.addEventListener(`close`,e=>{a(e)});let s=oS(o);return{close:()=>{n.close()},on:e=>{n.addEventListener(`message`,t=>{e(t.data)})},post:e=>{if(n.readyState===WebSocket.OPEN){n.send(e);return}if(n.readyState===WebSocket.CONNECTING){let t=()=>{i(),n.readyState===WebSocket.OPEN&&n.send(e)},r=()=>i();function i(){n.removeEventListener(`open`,t),n.removeEventListener(`close`,r)}n.addEventListener(`open`,t),n.addEventListener(`close`,r);return}i(Error(`Devframe WebSocket is not open; message dropped`))},serialize:s.serialize,deserialize:s.deserialize}}function jS(e,t,n){let r=(()=>{try{return new URL(t,n.href)}catch{return new URL(n.href)}})(),i=r.protocol===`https:`?`wss:`:`ws:`;if(e&&typeof e==`object`){if(e.host!=null||e.port!=null){let t=e.host??`${r.hostname}:${e.port}`,n=new URL(e.path??`/`,`${i}//${t}`);return n.protocol=i,n.href}let t=new URL(e.path??``,r);return t.protocol=i,t.href}if(typeof e==`number`)return`${i}//${r.hostname}:${e}`;let a=e??``;if(/^wss?:\/\//i.test(a))return a;if(/^https?:\/\//i.test(a))return sy(a,/^https/i.test(a)?`wss://`:`ws://`);let o=new URL(a,r);return o.protocol=i,o.href}function MS(e){let{authToken:t,connectionMeta:n,metaBaseUrl:r,events:i,clientRpc:a,rpcOptions:o={},wsOptions:s={},callTimeout:c=0}=e,l=jS(n.websocket,r??`./`,location);return fS({transport:`websocket`,authToken:t,connectionMeta:n,events:i,clientRpc:a,rpcOptions:o,callTimeout:c,createChannel:e=>AS({url:l,authToken:t,definitions:e.definitions,...s,onConnected(e){s.onConnected?.(e)},onError(t){e.onError(t),s.onError?.(t)},onDisconnected(t){e.onDisconnected(),s.onDisconnected?.(t)}})})}function NS(e){return e.includes(`:`)}function PS(e,t){return NS(t)?t:`${e}:${t}`}function FS(e){return{async get(t){return(await e()).value()[t]},async set(t,n){(await e()).mutate(e=>{e[t]=n})},async delete(t){(await e()).mutate(e=>{delete e[t]})},async all(){return(await e()).value()},async onChange(t){return(await e()).on(`updated`,e=>t(e))}}}function IS(e,t,n){let r=`devframe:settings:${n}:${t}`,i;function a(){return i||=e.sharedState.get(r,{initialValue:{}}),i}return FS(a)}function LS(e,t){return{global:IS(e,t,`global`),project:IS(e,t,`project`)}}function RS(e,t){return{namespace:t,base:e,rpc:{namespace:t,register(n){if(NS(n.name))throw Error(`[devframe] Scoped client RPC registration for namespace "${t}" received an already-namespaced function name "${n.name}". Pass a bare name without a ":" separator.`);e.client.register({...n,name:`${t}:${n.name}`})},call:((n,...r)=>e.call(PS(t,n),...r)),callEvent:((n,...r)=>e.callEvent(PS(t,n),...r)),callOptional:((n,...r)=>e.callOptional(PS(t,n),...r)),sharedState:((n,r)=>e.sharedState.get(PS(t,n),r)),streaming:{subscribe:(n,r,i)=>e.streaming.subscribe(PS(t,n),r,i),upload:(n,r)=>e.streaming.upload(PS(t,n),r)}},settings:LS(e,t),scope:e.scope}}function zS(){if(typeof document<`u`){let e=document.modelContext;if(e)return e}if(typeof navigator<`u`){let e=navigator.modelContext;if(e)return e}}function BS(e,t={}){let n=t.modelContext??zS();if(!n)return()=>{};let r=n,i=new Map,a=new Map;function o(t,n){let o=mx(t.name),s=a.get(o);if(s&&s!==t.name){console.warn(`[devframe] WebMCP tool name "${o}" (from "${t.name}") collides with "${s}"; keeping the first registration.`);return}let c=new AbortController,l=Fv(t.type,n),u=r.registerTool({name:o,description:n.description,inputSchema:Rv(t.args),annotations:{title:n.title??t.name,readOnlyHint:l===`read`,destructiveHint:l===`destructive`},execute:n=>VS(t,e.context,n)},{signal:c.signal});u&&`then`in u&&u.then(()=>{},()=>{}),a.set(o,t.name),i.set(t.name,()=>{c.abort(),u&&`unregister`in u&&typeof u.unregister==`function`&&u.unregister(),a.delete(o)})}function s(t){let n=t?[t]:[...e.definitions.keys()];for(let t of n){i.get(t)?.(),i.delete(t);let n=e.definitions.get(t),r=n?.agent;n&&r&&o(n,r)}}s();let c=e.onChanged(e=>s(e));return()=>{c();for(let e of i.values())e();i.clear()}}async function VS(e,t,n){try{let r=Bv(n,e.args?.length);return{content:[{type:`text`,text:HS(await(await Px(e,t))(...r))}]}}catch(e){return{isError:!0,content:[{type:`text`,text:US(e)}]}}}function HS(e){return e===void 0?`undefined`:typeof e==`string`?e:JSON.stringify(e,null,2)}function US(e){if(!(e instanceof Error))return String(e);let t=e.cause instanceof Error?` (cause: ${e.cause.message})`:``;return`${e.name}: ${e.message}${t}`}function WS(e,t){if(t.backend===`static`)return`static`;let n=t.websocket!==void 0,r=t.sse!==void 0;if(e===`websocket`){if(!n)throw Error(`[devframe] transport: 'websocket' was requested, but this server does not advertise a WebSocket endpoint`);return`websocket`}if(e===`sse`){if(!r)throw Error(`[devframe] transport: 'sse' was requested, but this server does not advertise an SSE endpoint`);return`sse`}if(t.backend===`sse`&&r)return`sse`;if(n)return`websocket`;if(r)return`sse`;throw Error(`[devframe] This server advertises no RPC transport (backend "none"), so there is nothing to connect to. Enable the WebSocket or SSE endpoint on the server, or use its static/MCP surfaces instead.`)}async function GS(e={}){let{baseURL:t=`./`,rpcOptions:n={},cacheOptions:r=!1}=e,i=ty(),a=Array.isArray(t)?t:[t],o=await Zx(e),{connectionMeta:s,metaBaseUrl:c,authToken:l}=o,u=a[0]??`./`;try{u=new URL(`.`,c).href}catch{}let d=new Ex({functions:[],...typeof e.cacheOptions==`object`?e.cacheOptions:{}}),f={rpc:void 0},p=new Fx(f),m=e.webmcp===!1?void 0:BS(p),h,g=!1;async function _(e){let t=[u,...a.filter(e=>e!==u)].filter(e=>e!=null),n=[];for(let r of t)try{return await fetch(oy(e,r)).then(t=>{if(!t.ok)throw Error(`Failed to fetch ${e} from ${r}: ${t.status}`);return t.json()})}catch(e){n.push(e)}throw Error(`Failed to load ${e} from ${t.join(`, `)}`,{cause:n})}let v={authToken:l,connectionMeta:s,metaBaseUrl:c,events:i,clientRpc:p,callTimeout:e.callTimeout,rpcOptions:{...n,async onRequest(e,t,i){if(await n.onRequest?.call(this,e,t,i),r&&d?.validate(e.m)){if(d.has(e.m,e.a))return i(d.cached(e.m,e.a));let n=await t(e);d.apply(e,n)}else await t(e)}}},y=WS(e.transport??`auto`,s),b=y===`static`?await wS({fetchJsonFromBases:_}):y===`sse`?mS({...v,sseOptions:e.sseOptions}):MS({...v,wsOptions:e.wsOptions}),ee;try{ee=new BroadcastChannel(`devframe-auth`)}catch{}let te,ne=!1;function x(e){return((...t)=>ne||!te?e(...t):te.then(()=>e(...t)))}function S(){g=!0;try{h?.(),m?.()}finally{try{ee?.close()}finally{b.close?.()}}}let C={events:i,get isTrusted(){return b.isTrusted},get status(){return b.status},get connectionError(){return b.connectionError},get transport(){return b.transport??y},get connection(){return o},connectionMeta:s,ensureTrusted:b.ensureTrusted,requestTrust:b.requestTrust,requestTrustWithToken:async e=>(qx(e),o={...o,authToken:e},b.requestTrustWithToken(e)),requestTrustWithCode:async e=>{let t=await b.requestTrustWithCode(e);if(!t)return!1;qx(t),o={...o,authToken:t};try{ee?.postMessage({type:`auth-update`,authToken:t})}catch{}return!0},requestAuthCode:e=>b.requestAuthCode(e),call:x(b.call),callEvent:x(b.callEvent),callOptional:x(b.callOptional),client:p,sharedState:void 0,services:void 0,streaming:void 0,cacheManager:d,scope:void 0,close:S};C.sharedState=iS(C),C.streaming=DS(C),C.services=rS(C);let re=new Map;C.scope=(e=>{if(!e)return C;let t=re.get(e);return t||(t=RS(C,e),re.set(e,t)),t}),f.rpc=C;function w(){try{return typeof window<`u`&&window.self===window.top}catch{return!1}}async function ie(){if(e.simpleAuth!==!1&&w()&&typeof globalThis.prompt==`function`)for(await C.requestAuthCode().catch(()=>{});!C.isTrusted;){let e=globalThis.prompt(`devframe: enter the authentication code shown in your terminal`);if(e==null)return;let t=e.trim();if(t&&await C.requestTrustWithCode(t))return}}async function T(){let t=await b.requestTrust(),n=e.otpParam??`devframe_otp`,r=n?await nS(C,{param:n}):!1;t||r||C.isTrusted||await ie()}return te=T().then(()=>{ne=!0},()=>{ne=!0}),s.mcp&&vx(async()=>{let{setupBrowserAgentRpcBridge:e}=await import(`./browser-agent-rpc-BXhoSh1z-DRCDnJJT.js`);return{setupBrowserAgentRpcBridge:e}},[],import.meta.url).then(({setupBrowserAgentRpcBridge:e})=>{g||(h=e(C))}).catch(()=>{}),ee&&(ee.onmessage=e=>{e.data?.type===`auth-update`&&e.data.authToken&&C.requestTrustWithToken(e.data.authToken)}),C}var KS=GS,qS=class e{rpc=o_(null);navigate=r_();meta=L(null);componentCount=L(0);routeCount=L(0);signalCount=L(0);providerCount=L(0);storeCount=L(0);constructor(){Xs(()=>{let e=this.rpc();if(!e)return;let t=e.scope(`ng-devtools`);t.rpc.call(`build-meta`).then(e=>this.meta.set(e)).catch(()=>{}),t.rpc.call(`get-components`).then(e=>this.componentCount.set(e.length)).catch(()=>{}),t.rpc.call(`get-routes`).then(e=>this.routeCount.set(e.length)).catch(()=>{}),t.rpc.call(`get-signals`).then(e=>this.signalCount.set(e.length)).catch(()=>{}),t.rpc.call(`get-providers`).then(e=>this.providerCount.set(e.length)).catch(()=>{}),t.rpc.call(`get-ngrx-store`).then(e=>this.storeCount.set(e.length)).catch(()=>{})})}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-dashboard`]],inputs:{rpc:[1,`rpc`]},outputs:{navigate:`navigate`},decls:56,vars:9,consts:[[1,`grid`],[1,`card`],[1,`card`,`clickable`,3,`click`],[1,`big`],[1,`sub`]],template:function(e,t){e&1&&(q(0,`div`,0)(1,`div`,1)(2,`h2`),Z(3,`Project`),J(),q(4,`dl`)(5,`dt`),Z(6,`Name`),J(),q(7,`dd`),Z(8),J(),q(9,`dt`),Z(10,`Angular`),J(),q(11,`dd`),Z(12),J(),q(13,`dt`),Z(14,`TypeScript`),J(),q(15,`dd`),Z(16),J(),q(17,`dt`),Z(18,`SSR`),J(),q(19,`dd`),Z(20),J()()(),q(21,`div`,2),Y(`click`,function(){return t.navigate.emit(`components`)}),q(22,`h2`),Z(23,`Components`),J(),q(24,`p`,3),Z(25),J(),q(26,`p`,4),Z(27,`discovered in source`),J()(),q(28,`div`,2),Y(`click`,function(){return t.navigate.emit(`routes`)}),q(29,`h2`),Z(30,`Routes`),J(),q(31,`p`,3),Z(32),J(),q(33,`p`,4),Z(34,`registered paths`),J()(),q(35,`div`,2),Y(`click`,function(){return t.navigate.emit(`signals`)}),q(36,`h2`),Z(37,`Signals`),J(),q(38,`p`,3),Z(39),J(),q(40,`p`,4),Z(41,`reactive primitives`),J()(),q(42,`div`,2),Y(`click`,function(){return t.navigate.emit(`injectors`)}),q(43,`h2`),Z(44,`Injectors`),J(),q(45,`p`,3),Z(46),J(),q(47,`p`,4),Z(48,`DI providers`),J()(),q(49,`div`,2),Y(`click`,function(){return t.navigate.emit(`store`)}),q(50,`h2`),Z(51,`NgRx Store`),J(),q(52,`p`,3),Z(53),J(),q(54,`p`,4),Z(55,`store entries`),J()()()),e&2&&(B(8),Q(t.meta()?.projectName??`…`),B(4),Q(t.meta()?.angularVersion??`…`),B(4),Q(t.meta()?.typescript??`…`),B(4),Q(t.meta()?.ssr?`Yes`:`No`),B(5),Q(t.componentCount()),B(7),Q(t.routeCount()),B(7),Q(t.signalCount()),B(7),Q(t.providerCount()),B(7),Q(t.storeCount()))},styles:[`.grid[_ngcontent-%COMP%] {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .card[_ngcontent-%COMP%] {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 10px;
      padding: 20px;
    }
    .card.clickable[_ngcontent-%COMP%] {
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .card.clickable[_ngcontent-%COMP%]:hover {
      border-color: var(--%NS%accent);
    }
    h2[_ngcontent-%COMP%] {
      font-size: 13px;
      text-transform: uppercase;
      color: #71717a;
      margin-bottom: 12px;
      letter-spacing: 0.05em;
    }
    dl[_ngcontent-%COMP%] {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 6px 12px;
      font-size: 14px;
    }
    dt[_ngcontent-%COMP%] {
      color: #a1a1aa;
    }
    dd[_ngcontent-%COMP%] {
      color: #e4e4e7;
      font-weight: 500;
    }
    .big[_ngcontent-%COMP%] {
      font-size: 36px;
      font-weight: 700;
      color: var(--%NS%accent);
    }
    .sub[_ngcontent-%COMP%] {
      font-size: 13px;
      color: #71717a;
      margin-top: 4px;
    }`]})},JS=()=>[],YS=(e,t)=>t.selector,XS=(e,t)=>t.outlet+t.route,ZS=(e,t)=>t.token+t.line;function QS(e,t){e&1&&(q(0,`p`,3),Z(1,`Scanning components…`),J())}function $S(e,t){e&1&&(q(0,`p`,3),Z(1,`No components found.`),J())}function eC(e,t){if(e&1&&(q(0,`span`,10),Z(1),J()),e&2){let e=t.$implicit;B(),Ng(`routed `,e.route,` · outlet `,e.outlet)}}function tC(e,t){if(e&1&&(q(0,`li`,14),Z(1),J()),e&2){let e=t.$implicit;B(),Q(e)}}function nC(e,t){if(e&1&&(q(0,`h4`),Z(1,`Inputs`),J(),q(2,`ul`,13),U(3,tC,2,1,`li`,14,Oh),J()),e&2){let e=X(2).$implicit;B(3),W(e.inputs)}}function rC(e,t){if(e&1&&(q(0,`li`,15),Z(1),J()),e&2){let e=t.$implicit;B(),Q(e)}}function iC(e,t){if(e&1&&(q(0,`h4`),Z(1,`Outputs`),J(),q(2,`ul`,13),U(3,rC,2,1,`li`,15,Oh),J()),e&2){let e=X(2).$implicit;B(3),W(e.outputs)}}function aC(e,t){if(e&1&&(q(0,`span`,20),Z(1),J()),e&2){let e=X().$implicit;B(),$(`→ `,e.source)}}function oC(e,t){if(e&1&&(q(0,`li`,17)(1,`span`,18),Z(2),J(),q(3,`span`,19),Z(4),J(),V(5,aC,2,1,`span`,20),J()),e&2){let e=t.$implicit;B(2),Q(e.token),B(2),Q(e.type),B(),H(e.source&&e.source!==`class`&&e.source!==`providers array`?5:-1)}}function sC(e,t){if(e&1&&(q(0,`h4`),Z(1,`Injected Providers`),J(),q(2,`ul`,16),U(3,oC,6,3,`li`,17,ZS),J()),e&2){let e=X(4);B(3),W(e.selectedProviders())}}function cC(e,t){e&1&&(q(0,`p`,12),Z(1,`No injected providers detected.`),J())}function lC(e,t){if(e&1&&(q(0,`div`,11)(1,`dl`)(2,`dt`),Z(3,`File`),J(),q(4,`dd`),Z(5),J(),q(6,`dt`),Z(7,`Standalone`),J(),q(8,`dd`),Z(9),J()(),V(10,nC,5,0),V(11,iC,5,0),V(12,sC,5,0)(13,cC,2,0,`p`,12),J()),e&2){let e=X().$implicit,t=X(2);B(5),Q(e.file),B(4),Q(e.isStandalone?`Yes`:`No`),B(),H(e.inputs.length?10:-1),B(),H(e.outputs.length?11:-1),B(),H(t.selectedProviders().length?12:13)}}function uC(e,t){if(e&1){let e=Jh();q(0,`li`,6)(1,`button`,7),Y(`click`,function(){let t=yo(e).$implicit;return bo(X(2).select(t))}),q(2,`div`,8),Z(3),J(),q(4,`div`,9),Z(5),J(),U(6,eC,2,2,`span`,10,XS),J(),V(8,lC,14,5,`div`,11),J()}if(e&2){let e=t.$implicit,n=X(2);mg(`expanded`,n.isSelected(e)),B(),_h(`aria-expanded`,n.isSelected(e)),B(2),$(`<`,e.selector,`>`),B(2),Q(e.file),B(),W(n.routedBy().get(e.selector)??Ig(6,JS)),B(2),H(n.isSelected(e)?8:-1)}}function dC(e,t){if(e&1&&(q(0,`ul`,4),U(1,uC,9,7,`li`,5,YS),J()),e&2){let e=X();B(),W(e.filtered())}}var fC=class e{rpc=o_(null);components=L([]);allProviders=L([]);filter=L(``);loading=L(!1);selected=L(null);selectedProviders=L([]);filtered=L([]);outlets=L([]);unsubscribeRouter=null;destroyRef=P(ls);routedBy=Zg(()=>{let e=new Map,t=n=>{for(let r of n)r.activated&&r.element&&r.route&&e.set(r.element,[...e.get(r.element)??[],{route:r.route,outlet:r.outlet}]),r.children&&t(r.children)};return t(this.outlets()),e});constructor(){Xs(()=>{let e=this.filter().toLowerCase(),t=this.components();this.filtered.set(e?t.filter(t=>t.selector.includes(e)||t.file.includes(e)):t)}),Xs(()=>{let e=this.rpc();e&&(this.refresh(),this.watchRouter(e))}),this.destroyRef.onDestroy(()=>this.unsubscribeRouter?.())}async watchRouter(e){try{let t=await e.scope(`ng-devtools`).rpc.sharedState(`router`);if(this.destroyRef.destroyed)return;let n=e=>{let t=e?.pages??[],n=t.find(e=>e.snapshot)??t[0];this.outlets.set(n?.outlets??[])};n(t.value()),this.unsubscribeRouter?.(),this.unsubscribeRouter=t.on(`updated`,n)}catch{this.outlets.set([])}}async refresh(){let e=this.rpc();if(e){this.loading.set(!0);try{let t=e.scope(`ng-devtools`),[n,r]=await Promise.all([t.rpc.call(`get-components`),t.rpc.call(`get-providers`)]);this.components.set(n),this.allProviders.set(r);let i=this.selected();if(i){let e=n.find(e=>e.selector===i.selector);e?(this.selected.set(e),this.selectedProviders.set(r.filter(t=>t.file===e.file))):(this.selected.set(null),this.selectedProviders.set([]))}}finally{this.loading.set(!1)}}}isSelected(e){return this.selected()?.selector===e.selector}select(e){if(this.isSelected(e)){this.selected.set(null),this.selectedProviders.set([]);let e=this.rpc();e&&e.scope(`ng-devtools`).rpc.callEvent(`select-component`,null);return}this.selected.set(e),this.selectedProviders.set(this.allProviders().filter(t=>t.file===e.file));let t=this.rpc();t&&t.scope(`ng-devtools`).rpc.callEvent(`select-component`,e.selector)}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-component-tree`]],inputs:{rpc:[1,`rpc`]},decls:7,vars:2,consts:[[1,`toolbar`],[`type`,`text`,`placeholder`,`Filter components…`,3,`input`,`value`],[3,`click`],[1,`muted`],[`role`,`list`,1,`component-list`],[1,`component-item`,3,`expanded`],[1,`component-item`],[1,`component-toggle`,3,`click`],[1,`selector`],[1,`file`],[1,`routed`],[1,`inline-detail`],[1,`no-providers`],[`role`,`list`,1,`prop-list`],[1,`prop-chip`,`input-chip`],[1,`prop-chip`,`output-chip`],[`role`,`list`,1,`provider-list`],[1,`provider-item`],[1,`provider-token`],[1,`provider-type`],[1,`provider-source`]],template:function(e,t){e&1&&(q(0,`div`,0)(1,`input`,1),Y(`input`,function(e){return t.filter.set(e.target.value)}),J(),q(2,`button`,2),Y(`click`,function(){return t.refresh()}),Z(3,`Refresh`),J()(),V(4,QS,2,0,`p`,3)(5,$S,2,0,`p`,3)(6,dC,3,0,`ul`,4)),e&2&&(B(),Yh(`value`,t.filter()),B(3),H(t.loading()?4:t.filtered().length===0?5:6))},styles:[`.toolbar[_ngcontent-%COMP%] {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    input[_ngcontent-%COMP%] {
      flex: 1;
      padding: 8px 12px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 6px;
      color: #e4e4e7;
      font-size: 14px;
      outline: none;
    }
    input[_ngcontent-%COMP%]:focus {
      border-color: var(--%NS%accent);
    }
    button[_ngcontent-%COMP%] {
      padding: 8px 16px;
      background: #3f3f46;
      border: none;
      border-radius: 6px;
      color: #e4e4e7;
      cursor: pointer;
      font-size: 13px;
    }
    button[_ngcontent-%COMP%]:hover {
      background: #52525b;
    }
    .muted[_ngcontent-%COMP%] {
      color: #71717a;
      font-size: 14px;
    }
    .component-list[_ngcontent-%COMP%] {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .component-item[_ngcontent-%COMP%] {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 0;
      transition: border-color 0.15s;
    }
    .component-item[_ngcontent-%COMP%]:has(.component-toggle:hover) {
      border-color: var(--%NS%accent);
    }
    .component-item.expanded[_ngcontent-%COMP%] {
      border-color: var(--%NS%accent);
    }
    .component-toggle[_ngcontent-%COMP%] {
      display: block;
      width: 100%;
      padding: 12px 16px;
      background: none;
      border: none;
      color: inherit;
      text-align: left;
      cursor: pointer;
      font: inherit;
    }
    .selector[_ngcontent-%COMP%] {
      font-family: monospace;
      font-size: 15px;
      color: var(--%NS%accent);
      font-weight: 600;
    }
    .file[_ngcontent-%COMP%] {
      font-size: 12px;
      color: #71717a;
      margin-top: 2px;
    }
    .io[_ngcontent-%COMP%] {
      font-size: 13px;
      color: #a1a1aa;
      margin-top: 4px;
    }
    .io[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {
      color: #71717a;
    }
    .inline-detail[_ngcontent-%COMP%] {
      padding: 0 16px 12px;
      border-top: 1px solid #27272a;
      margin-top: 0;
      padding-top: 12px;
    }
    .prop-list[_ngcontent-%COMP%] {
      list-style: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    .prop-chip[_ngcontent-%COMP%] {
      font-family: monospace;
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .input-chip[_ngcontent-%COMP%] {
      background: #1e3a5f;
      color: #93c5fd;
    }
    .output-chip[_ngcontent-%COMP%] {
      background: #3b1d1d;
      color: #fca5a5;
    }
    dl[_ngcontent-%COMP%] {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 4px 12px;
      font-size: 13px;
      margin-bottom: 16px;
    }
    dt[_ngcontent-%COMP%] {
      color: #71717a;
    }
    dd[_ngcontent-%COMP%] {
      color: #e4e4e7;
    }
    h4[_ngcontent-%COMP%] {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #71717a;
      margin-bottom: 8px;
    }
    .provider-list[_ngcontent-%COMP%] {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .provider-item[_ngcontent-%COMP%] {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 6px;
      font-size: 13px;
    }
    .provider-token[_ngcontent-%COMP%] {
      font-family: monospace;
      color: #e4e4e7;
      font-weight: 600;
    }
    .provider-type[_ngcontent-%COMP%] {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 4px;
      background: #3f3f46;
      color: #a1a1aa;
    }
    .routed[_ngcontent-%COMP%] {
      display: inline-block;
      margin-top: 4px;
      padding: 1px 6px;
      border: 1px solid #52525b;
      border-radius: 4px;
      color: #d4d4d8;
      font-size: 11px;
      font-family: monospace;
    }
    .provider-source[_ngcontent-%COMP%] {
      font-size: 12px;
      color: #a1a1aa;
    }
    .no-providers[_ngcontent-%COMP%] {
      font-size: 13px;
      color: #52525b;
    }`]})};function pC(e,t,n){return e?e.scope(`ng-devtools`).rpc.call(t,...n===void 0?[]:[n]).then(e=>e,()=>null):Promise.resolve(null)}function mC(e,t,n){return pC(e,`request-router-action`,{pageId:t,request:n})}function hC(e){return e===`succeeded`?`good`:e===`redirected`||e===`pending`||e===`skipped`?`warn`:e===`cancelled`||e===`failed`?`bad`:``}var gC=()=>[],_C=(e,t)=>t[0],vC=(e,t)=>t.input;function yC(e,t){if(e&1&&(q(0,`p`,2),Z(1,` The browser shows `),q(2,`code`),Z(3),J(),Z(4,`, not the router URL (skipLocationChange, browserUrl, a failed navigation or code that changed history). `),J()),e&2){let e=X();B(3),Q(e.browserUrl)}}function bC(e,t){if(e&1){let e=Jh();q(0,`div`,3),Z(1,` Navigating to `),q(2,`code`),Z(3),J(),Z(4),q(5,`button`,8),Y(`click`,function(){return yo(e),bo(X(2).abort())}),Z(6,`Abort`),J()()}if(e&2){let e=t;B(3),Q(e.url),B(),$(` (#`,e.id,`) `)}}function xC(e,t){if(e&1&&(q(0,`p`,4),Z(1),J()),e&2){let e=X(2);B(),Q(e.message())}}function SC(e,t){if(e&1&&(q(0,`dt`),Z(1,`Document title`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X();B(3),Q(e.title)}}function CC(e,t){if(e&1&&(q(0,`dt`),Z(1,`Query params`),J(),q(2,`dd`)(3,`code`),Z(4),Vg(5,`json`),J()()),e&2){let e=X();B(4),Q(Ug(5,1,e.queryParams))}}function wC(e,t){if(e&1&&(q(0,`dt`),Z(1,`Fragment`),J(),q(2,`dd`)(3,`code`),Z(4),J()()),e&2){let e=X();B(4),Q(e.fragment)}}function TC(e,t){if(e&1&&(q(0,`span`,10),Z(1),J()),e&2){let e=X().$implicit;B(),Q(e.route.outlet)}}function EC(e,t){e&1&&(q(0,`span`,10),Z(1,`lazy`),J())}function DC(e,t){if(e&1&&(q(0,`div`,11),Z(1),J()),e&2){let e=X().$implicit;B(),Ng(` title `,e.route.title,``,e.route.ownTitle===!1?` (inherited)`:``,` `)}}function OC(e,t){e&1&&(q(0,`span`,10),Z(1,`inherited`),J())}function kC(e,t){if(e&1&&(q(0,`div`)(1,`code`),Z(2),Vg(3,`json`),J(),V(4,OC,2,0,`span`,10),J()),e&2){let e=t.$implicit,n=X().$implicit;B(2),Ng(``,e[0],`: `,Ug(3,3,e[1])),B(2),H(n.route.paramSources?.[e[0]]===`inherited`?4:-1)}}function AC(e,t){e&1&&Z(0,` — `)}function jC(e,t){e&1&&(q(0,`span`,10),Z(1),J()),e&2&&(B(),Q(t))}function MC(e,t){if(e&1&&(q(0,`div`,12)(1,`code`),Z(2),Vg(3,`json`),J(),V(4,jC,2,1,`span`,10),J()),e&2){let e,n=t.$implicit,r=X().$implicit;B(2),Ng(``,n[0],`: `,Ug(3,3,n[1])),B(2),H((e=r.route.dataSources?.[n[0]])?4:-1,e)}}function NC(e,t){e&1&&Z(0,` — `)}function PC(e,t){if(e&1&&(q(0,`span`,10),Z(1),J()),e&2){let e=t.$implicit;B(),Q(e)}}function FC(e,t){if(e&1&&(q(0,`span`,10),Z(1),J()),e&2){let e=t.$implicit;B(),$(`resolve `,e)}}function IC(e,t){e&1&&Z(0,` — `)}function LC(e,t){if(e&1&&(q(0,`tr`)(1,`td`,9),Z(2),V(3,TC,2,1,`span`,10),V(4,EC,2,0,`span`,10),V(5,DC,2,2,`div`,11),J(),q(6,`td`),Z(7),J(),q(8,`td`),U(9,kC,5,5,`div`,null,_C,!1,AC,1,0),J(),q(12,`td`),U(13,MC,5,5,`div`,12,_C,!1,NC,1,0),J(),q(16,`td`),U(17,PC,2,1,`span`,10,Oh),U(19,FC,2,1,`span`,10,Oh),V(21,IC,1,0),J()()),e&2){let e=t.$implicit,n=X(2);B(),pg(`padding-left`,12+e.depth*16,`px`),B(),$(` `,e.depth===0&&!e.route.path?`(root)`:`/`+e.route.path,` `),B(),H(e.route.outlet===`primary`?-1:3),B(),H(e.route.lazy?4:-1),B(),H(e.route.title?5:-1),B(2),Q(e.route.component??`—`),B(2),W(n.entries(e.route.params)),B(4),W(n.entries(e.route.data)),B(4),W(n.guardList(e.route)),B(2),W(e.route.resolvers??Ig(10,gC)),B(2),H(!n.guardList(e.route).length&&!e.route.resolvers?21:-1)}}function RC(e,t){if(e&1&&(q(0,`code`),Z(1),J(),Z(2,` for `),q(3,`code`),Z(4),J()),e&2){let e=X().$implicit;B(),Q(e.outlet.component??`?`),B(3),Q(e.outlet.route??`?`)}}function zC(e,t){e&1&&(q(0,`span`,0),Z(1,`not activated`),J())}function BC(e,t){e&1&&(q(0,`span`,10),Z(1,`detached by reuse strategy`),J())}function VC(e,t){if(e&1&&(q(0,`span`,10),Z(1),J()),e&2){let e=t.$implicit;B(),Ng(`input `,e.input,` ← `,e.source)}}function HC(e,t){if(e&1&&(q(0,`li`)(1,`span`,10),Z(2),J(),V(3,RC,5,2)(4,zC,2,0,`span`,0),V(5,BC,2,0,`span`,10),U(6,VC,2,2,`span`,10,vC),J()),e&2){let e=t.$implicit,n=X(3);pg(`padding-left`,e.depth*16,`px`),B(2),Q(e.outlet.outlet),B(),H(e.outlet.activated?3:4),B(2),H(e.outlet.detached?5:-1),B(),W(n.boundInputs(e.outlet))}}function UC(e,t){if(e&1&&(q(0,`h3`),Z(1,`Outlets`),J(),q(2,`ul`,13),U(3,HC,8,5,`li`,14,Dh),J()),e&2){let e=X(2);B(3),W(e.outletRows())}}function WC(e,t){if(e&1&&(q(0,`p`,1)(1,`code`),Z(2),J()(),V(3,yC,5,1,`p`,2),V(4,bC,7,2,`div`,3),V(5,xC,2,1,`p`,4),q(6,`dl`,5),V(7,SC,4,1),V(8,CC,6,3),V(9,wC,5,1),J(),q(10,`h3`),Z(11,`Active routes`),J(),q(12,`div`,6)(13,`table`)(14,`thead`)(15,`tr`)(16,`th`,7),Z(17,`Route`),J(),q(18,`th`,7),Z(19,`Component`),J(),q(20,`th`,7),Z(21,`Params`),J(),q(22,`th`,7),Z(23,`Data`),J(),q(24,`th`,7),Z(25,`Guards and resolvers`),J()()(),q(26,`tbody`),U(27,LC,22,11,`tr`,null,Dh),J()()(),V(29,UC,5,0)),e&2){let e,n=t,r=X();B(2),Q(n.url),B(),H(n.urlDrift&&n.browserUrl?3:-1),B(),H((e=n.pending)?4:-1,e),B(),H(r.message()?5:-1),B(2),H(n.title?7:-1),B(),H(r.hasKeys(n.queryParams)?8:-1),B(),H(n.fragment?9:-1),B(18),W(r.rows()),B(2),H(r.outletRows().length?29:-1)}}function GC(e,t){e&1&&(q(0,`p`,0),Z(1,`This page reports no Router.`),J())}var KC=class e{page=o_.required();rpc=o_(null);message=L(``);rows=Zg(()=>{let e=[],t=(n,r)=>{e.push({route:n,depth:r});for(let e of n.children)t(e,r+1)},n=this.page().snapshot?.root;return n&&t(n,0),e});outletRows=Zg(()=>{let e=[],t=(n,r)=>{for(let i of n)e.push({outlet:i,depth:r}),i.children&&t(i.children,r+1)};return t(this.page().outlets??[],0),e});hasKeys(e){return Object.keys(e).length>0}entries(e){return Object.entries(e)}guardList(e){return Object.entries(e.guards??{}).flatMap(([e,t])=>t.map(t=>`${e} ${t}`))}boundInputs(e){return(e.inputs??[]).filter(e=>e.source!==`unset`)}async abort(){let e=await mC(this.rpc(),this.page().pageId,{action:`abort`});this.message.set(e?.error?String(e.error):`Aborted navigation #${e?.aborted}`)}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-route-current`]],inputs:{page:[1,`page`],rpc:[1,`rpc`]},decls:2,vars:1,consts:[[1,`muted`],[1,`url`],[`role`,`note`,1,`note`],[`role`,`status`,1,`pending`],[`role`,`status`,1,`muted`],[1,`facts`],[`role`,`region`,`aria-label`,`Active routes`,`tabindex`,`0`,1,`table-scroll`],[`scope`,`col`],[`type`,`button`,1,`small`,3,`click`],[1,`path`],[1,`tag`],[1,`sub`],[1,`data`],[1,`outlets`],[3,`padding-left`]],template:function(e,t){if(e&1&&V(0,WC,30,8)(1,GC,2,0,`p`,0),e&2){let e;H((e=t.page().snapshot)?0:1,e)}},dependencies:[S_],styles:[`.muted[_ngcontent-%COMP%] {
    color: #a1a1aa;
    font-size: 13px;
  }
  code[_ngcontent-%COMP%] {
    font-family: monospace;
    color: #d4d4d8;
    overflow-wrap: anywhere;
  }
  .tag[_ngcontent-%COMP%] {
    display: inline-block;
    margin: 0 4px 4px 0;
    padding: 1px 6px;
    border: 1px solid #52525b;
    border-radius: 4px;
    color: #d4d4d8;
    font-size: 11px;
    font-family: monospace;
  }
  .badge[_ngcontent-%COMP%] {
    padding: 1px 6px;
    border-radius: 4px;
    background: #3f3f46;
    color: #e4e4e7;
    font-size: 11px;
    font-weight: 600;
  }
  .badge[data-tone='good'][_ngcontent-%COMP%] {
    background: #14532d;
    color: #bbf7d0;
  }
  .badge[data-tone='warn'][_ngcontent-%COMP%] {
    background: #713f12;
    color: #fef08a;
  }
  .badge[data-tone='bad'][_ngcontent-%COMP%] {
    background: #7f1d1d;
    color: #fecaca;
  }
  button.small[_ngcontent-%COMP%] {
    padding: 3px 10px;
    background: #3f3f46;
    border: none;
    border-radius: 6px;
    color: #e4e4e7;
    cursor: pointer;
    font-size: 12px;
  }
  button.small[_ngcontent-%COMP%]:hover {
    background: #52525b;
  }
  button.small[_ngcontent-%COMP%]:focus-visible, 
   input[_ngcontent-%COMP%]:focus-visible, 
   select[_ngcontent-%COMP%]:focus-visible, 
   .table-scroll[_ngcontent-%COMP%]:focus-visible {
    outline: 2px solid var(--%NS%accent);
    outline-offset: 2px;
  }
  input.field[_ngcontent-%COMP%] {
    padding: 6px 10px;
    background: #18181b;
    border: 1px solid #52525b;
    border-radius: 6px;
    color: #e4e4e7;
    font-size: 13px;
  }
  .table-scroll[_ngcontent-%COMP%] {
    overflow-x: auto;
  }
  table[_ngcontent-%COMP%] {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  th[_ngcontent-%COMP%] {
    text-align: left;
    padding: 6px 12px;
    color: #a1a1aa;
    font-size: 12px;
    border-bottom: 1px solid #27272a;
  }
  td[_ngcontent-%COMP%] {
    padding: 8px 12px;
    border-bottom: 1px solid #1e1e22;
    vertical-align: top;
  }
  h3[_ngcontent-%COMP%] {
    margin: 0 0 8px;
    font-size: 14px;
    color: #e4e4e7;
  }
  .visually-hidden[_ngcontent-%COMP%] {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

    [_nghost-%COMP%] {
      display: grid;
      gap: 12px;
    }
    .url[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {
      font-size: 14px;
      color: var(--%NS%accent);
    }
    .note[_ngcontent-%COMP%] {
      margin: 0;
      padding: 8px 10px;
      border-left: 3px solid #fef08a;
      background: #27272a;
      color: #e4e4e7;
      font-size: 13px;
    }
    .pending[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      font-size: 13px;
      color: #fef08a;
    }
    .facts[_ngcontent-%COMP%] {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 4px 12px;
      margin: 0;
      font-size: 13px;
    }
    dt[_ngcontent-%COMP%] {
      color: #a1a1aa;
    }
    dd[_ngcontent-%COMP%] {
      margin: 0;
      color: #e4e4e7;
    }
    .path[_ngcontent-%COMP%] {
      font-family: monospace;
      color: var(--%NS%accent);
      white-space: nowrap;
    }
    .sub[_ngcontent-%COMP%] {
      font-family: inherit;
      color: #a1a1aa;
      font-size: 12px;
      white-space: normal;
    }
    .data[_ngcontent-%COMP%] {
      max-width: 360px;
    }
    .outlets[_ngcontent-%COMP%] {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 6px;
      font-size: 13px;
      color: #e4e4e7;
    }`]})};function qC(e,t){e&1&&(q(0,`p`,2),Z(1,`Checking…`),J())}function JC(e,t){if(e&1&&(q(0,`li`)(1,`div`,4)(2,`span`,5),Z(3),J(),q(4,`code`),Z(5),J(),q(6,`code`,6),Z(7),J()(),q(8,`p`),Z(9),J(),q(10,`p`,7),Z(11),q(12,`span`,2),Z(13),J()()()),e&2){let e=t.$implicit;B(2),_h(`data-tone`,e.severity===`error`?`bad`:e.severity===`warning`?`warn`:``),B(),Q(e.severity),B(2),Q(e.rule),B(2),Q(e.route),B(2),Q(e.message),B(2),$(` Fix: `,e.fix,` `),B(2),$(`(Angular `,e.angular===`throws`?`throws`:e.angular===`warns`?`warns`:`does not warn`,`)`)}}function YC(e,t){if(e&1&&(q(0,`ul`,3),U(1,JC,14,7,`li`,null,Dh),J()),e&2){let e=X();B(),W(e.findings())}}function XC(e,t){e&1&&(q(0,`p`,2),Z(1,`No route config problems found.`),J())}var ZC=class e{page=o_.required();rpc=o_(null);findings=L([]);loading=L(!1);key=Zg(()=>`${this.page().pageId}:${this.page().generation}:${this.page().navigations.length}`);constructor(){Xs(()=>{this.key(),Qg(()=>void this.run())})}async run(){this.loading.set(!0),this.findings.set(await pC(this.rpc(),`router-lint`,this.page().pageId)??[]),this.loading.set(!1)}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-route-lint`]],inputs:{page:[1,`page`],rpc:[1,`rpc`]},decls:8,vars:1,consts:[[1,`toolbar`],[`type`,`button`,1,`small`,3,`click`],[1,`muted`],[1,`findings`],[1,`head`],[1,`badge`],[1,`route`],[1,`fix`]],template:function(e,t){e&1&&(q(0,`div`,0)(1,`button`,1),Y(`click`,function(){return t.run()}),Z(2,`Check again`),J(),q(3,`span`,2),Z(4,`Checks the live config, links and recent navigations. Lazy routes that have not loaded are skipped.`),J()(),V(5,qC,2,0,`p`,2)(6,YC,3,0,`ul`,3)(7,XC,2,0,`p`,2)),e&2&&(B(5),H(t.loading()?5:t.findings().length?6:7))},styles:[`.muted[_ngcontent-%COMP%] {
    color: #a1a1aa;
    font-size: 13px;
  }
  code[_ngcontent-%COMP%] {
    font-family: monospace;
    color: #d4d4d8;
    overflow-wrap: anywhere;
  }
  .tag[_ngcontent-%COMP%] {
    display: inline-block;
    margin: 0 4px 4px 0;
    padding: 1px 6px;
    border: 1px solid #52525b;
    border-radius: 4px;
    color: #d4d4d8;
    font-size: 11px;
    font-family: monospace;
  }
  .badge[_ngcontent-%COMP%] {
    padding: 1px 6px;
    border-radius: 4px;
    background: #3f3f46;
    color: #e4e4e7;
    font-size: 11px;
    font-weight: 600;
  }
  .badge[data-tone='good'][_ngcontent-%COMP%] {
    background: #14532d;
    color: #bbf7d0;
  }
  .badge[data-tone='warn'][_ngcontent-%COMP%] {
    background: #713f12;
    color: #fef08a;
  }
  .badge[data-tone='bad'][_ngcontent-%COMP%] {
    background: #7f1d1d;
    color: #fecaca;
  }
  button.small[_ngcontent-%COMP%] {
    padding: 3px 10px;
    background: #3f3f46;
    border: none;
    border-radius: 6px;
    color: #e4e4e7;
    cursor: pointer;
    font-size: 12px;
  }
  button.small[_ngcontent-%COMP%]:hover {
    background: #52525b;
  }
  button.small[_ngcontent-%COMP%]:focus-visible, 
   input[_ngcontent-%COMP%]:focus-visible, 
   select[_ngcontent-%COMP%]:focus-visible, 
   .table-scroll[_ngcontent-%COMP%]:focus-visible {
    outline: 2px solid var(--%NS%accent);
    outline-offset: 2px;
  }
  input.field[_ngcontent-%COMP%] {
    padding: 6px 10px;
    background: #18181b;
    border: 1px solid #52525b;
    border-radius: 6px;
    color: #e4e4e7;
    font-size: 13px;
  }
  .table-scroll[_ngcontent-%COMP%] {
    overflow-x: auto;
  }
  table[_ngcontent-%COMP%] {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  th[_ngcontent-%COMP%] {
    text-align: left;
    padding: 6px 12px;
    color: #a1a1aa;
    font-size: 12px;
    border-bottom: 1px solid #27272a;
  }
  td[_ngcontent-%COMP%] {
    padding: 8px 12px;
    border-bottom: 1px solid #1e1e22;
    vertical-align: top;
  }
  h3[_ngcontent-%COMP%] {
    margin: 0 0 8px;
    font-size: 14px;
    color: #e4e4e7;
  }
  .visually-hidden[_ngcontent-%COMP%] {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

    [_nghost-%COMP%] {
      display: grid;
      gap: 10px;
    }
    .toolbar[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }
    .findings[_ngcontent-%COMP%] {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 8px;
    }
    .findings[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {
      padding: 10px;
      border: 1px solid #27272a;
      border-radius: 6px;
      font-size: 13px;
      color: #e4e4e7;
    }
    .head[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .route[_ngcontent-%COMP%] {
      color: var(--%NS%accent);
    }
    p[_ngcontent-%COMP%] {
      margin: 6px 0 0;
    }
    .fix[_ngcontent-%COMP%] {
      color: #d4d4d8;
    }`]})},QC=(e,t)=>t.name,$C=(e,t)=>t[0];function ew(e,t){e&1&&(q(0,`p`,1),Z(1,` Events-only mode: this build has no debug utils (production build or unusual setup), so the route config, lint and actions are limited. `),J())}function tw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Angular`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X();B(3),Q(e.angularVersion)}}function nw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Base href`),J(),q(2,`dd`)(3,`code`),Z(4),J()()),e&2){let e=X();B(4),Q(e.baseHref)}}function rw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Hydration`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X();B(3),$(``,e.hydrated,` component(s) hydrated from server HTML`)}}function iw(e,t){if(e&1&&(q(0,`tr`)(1,`td`)(2,`code`),Z(3),J()(),q(4,`td`)(5,`code`),Z(6),J()(),q(7,`td`)(8,`span`,6),Z(9),J()()()),e&2){let e=t.$implicit;B(3),Q(e.name),B(3),Q(e.value),B(2),_h(`data-tone`,e.set?`warn`:``),B(),Q(e.set?`set`:`default`)}}function aw(e,t){if(e&1&&(q(0,`li`)(1,`span`,6),Z(2),J()()),e&2){let e=t.$implicit;B(),_h(`data-tone`,e[1]===`off`?``:`good`),B(),Ng(``,e[0],`: `,e[1])}}function ow(e,t){if(e&1&&(q(0,`dt`),Z(1),J(),q(2,`dd`)(3,`code`),Z(4),J()()),e&2){let e=t.$implicit;B(),Q(e[0]),B(3),Q(e[1])}}function sw(e,t){if(e&1&&(V(0,ew,2,0,`p`,1),q(1,`dl`,2)(2,`dt`),Z(3,`Set up with`),J(),q(4,`dd`),Z(5),J(),V(6,tw,4,1),V(7,nw,5,1),V(8,rw,4,1),J(),q(9,`h3`),Z(10,`Options`),J(),q(11,`div`,3)(12,`table`)(13,`thead`)(14,`tr`)(15,`th`,4),Z(16,`Option`),J(),q(17,`th`,4),Z(18,`Value`),J(),q(19,`th`,4),Z(20,`Source`),J()()(),q(21,`tbody`),U(22,iw,10,4,`tr`,null,QC),J()()(),q(24,`h3`),Z(25,`Features`),J(),q(26,`ul`,5),U(27,aw,3,3,`li`,null,$C),J(),q(29,`h3`),Z(30,`Strategies`),J(),q(31,`dl`,2),U(32,ow,5,2,null,null,$C),J()),e&2){let e=t,n=X();H(e.mode===`events-only`?0:-1),B(5),Ng(` `,e.setupKind,``,e.routers>1?`, `+e.routers+` routers on the page`:``,` `),B(),H(e.angularVersion?6:-1),B(),H(e.baseHref?7:-1),B(),H(e.hydrated?8:-1),B(14),W(e.options),B(5),W(n.entries(e.features)),B(5),W(n.entries(e.strategies))}}function cw(e,t){e&1&&(q(0,`p`,0),Z(1,`The page has not reported its router setup yet.`),J())}var lw=class e{page=o_.required();entries(e){return Object.entries(e)}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-route-setup`]],inputs:{page:[1,`page`]},decls:2,vars:1,consts:[[1,`muted`],[`role`,`note`,1,`note`],[1,`facts`],[`role`,`region`,`aria-label`,`Router options`,`tabindex`,`0`,1,`table-scroll`],[`scope`,`col`],[1,`chips`],[1,`badge`]],template:function(e,t){if(e&1&&V(0,sw,34,6)(1,cw,2,0,`p`,0),e&2){let e;H((e=t.page().setup)?0:1,e)}},styles:[`.muted[_ngcontent-%COMP%] {
    color: #a1a1aa;
    font-size: 13px;
  }
  code[_ngcontent-%COMP%] {
    font-family: monospace;
    color: #d4d4d8;
    overflow-wrap: anywhere;
  }
  .tag[_ngcontent-%COMP%] {
    display: inline-block;
    margin: 0 4px 4px 0;
    padding: 1px 6px;
    border: 1px solid #52525b;
    border-radius: 4px;
    color: #d4d4d8;
    font-size: 11px;
    font-family: monospace;
  }
  .badge[_ngcontent-%COMP%] {
    padding: 1px 6px;
    border-radius: 4px;
    background: #3f3f46;
    color: #e4e4e7;
    font-size: 11px;
    font-weight: 600;
  }
  .badge[data-tone='good'][_ngcontent-%COMP%] {
    background: #14532d;
    color: #bbf7d0;
  }
  .badge[data-tone='warn'][_ngcontent-%COMP%] {
    background: #713f12;
    color: #fef08a;
  }
  .badge[data-tone='bad'][_ngcontent-%COMP%] {
    background: #7f1d1d;
    color: #fecaca;
  }
  button.small[_ngcontent-%COMP%] {
    padding: 3px 10px;
    background: #3f3f46;
    border: none;
    border-radius: 6px;
    color: #e4e4e7;
    cursor: pointer;
    font-size: 12px;
  }
  button.small[_ngcontent-%COMP%]:hover {
    background: #52525b;
  }
  button.small[_ngcontent-%COMP%]:focus-visible, 
   input[_ngcontent-%COMP%]:focus-visible, 
   select[_ngcontent-%COMP%]:focus-visible, 
   .table-scroll[_ngcontent-%COMP%]:focus-visible {
    outline: 2px solid var(--%NS%accent);
    outline-offset: 2px;
  }
  input.field[_ngcontent-%COMP%] {
    padding: 6px 10px;
    background: #18181b;
    border: 1px solid #52525b;
    border-radius: 6px;
    color: #e4e4e7;
    font-size: 13px;
  }
  .table-scroll[_ngcontent-%COMP%] {
    overflow-x: auto;
  }
  table[_ngcontent-%COMP%] {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  th[_ngcontent-%COMP%] {
    text-align: left;
    padding: 6px 12px;
    color: #a1a1aa;
    font-size: 12px;
    border-bottom: 1px solid #27272a;
  }
  td[_ngcontent-%COMP%] {
    padding: 8px 12px;
    border-bottom: 1px solid #1e1e22;
    vertical-align: top;
  }
  h3[_ngcontent-%COMP%] {
    margin: 0 0 8px;
    font-size: 14px;
    color: #e4e4e7;
  }
  .visually-hidden[_ngcontent-%COMP%] {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

    [_nghost-%COMP%] {
      display: grid;
      gap: 12px;
    }
    .note[_ngcontent-%COMP%] {
      margin: 0;
      padding: 8px 10px;
      border-left: 3px solid #fef08a;
      background: #27272a;
      color: #e4e4e7;
      font-size: 13px;
    }
    .facts[_ngcontent-%COMP%] {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 4px 12px;
      margin: 0;
      font-size: 13px;
    }
    dt[_ngcontent-%COMP%] {
      color: #a1a1aa;
    }
    dd[_ngcontent-%COMP%] {
      margin: 0;
      color: #e4e4e7;
    }
    .chips[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 0;
      padding: 0;
      list-style: none;
    }`]})},uw=(e,t)=>[e,t],dw=(e,t)=>t.id,fw=(e,t)=>t.phase;function pw(e,t){if(e&1&&(q(0,`p`,5),Z(1),J()),e&2){let e=X();B(),Q(e.message())}}function mw(e,t){if(e&1&&(q(0,`span`),Vh(1,`i`),Z(2),J()),e&2){let e=t.$implicit,n=X();B(),pg(`background`,n.color(e)),B(),Q(e)}}function hw(e,t){if(e&1&&(q(0,`time`),Z(1),J()),e&2){let e=X().$implicit,t=X(2);B(),Q(t.time(e.startedAt))}}function gw(e,t){if(e&1&&(q(0,`span`,15),Z(1,`→`),J(),q(2,`span`,16),Z(3,`redirected to`),J(),q(4,`code`),Z(5),J()),e&2){let e=X().$implicit;B(5),Q(e.finalUrl)}}function _w(e,t){if(e&1&&(q(0,`span`,8),Z(1),J()),e&2){let e=X().$implicit;B(),Q(e.endedAt===void 0&&e.outcome!==`pending`?`before DevTools connected`:`started before DevTools connected`)}}function vw(e,t){if(e&1&&(q(0,`span`,8),Z(1),J()),e&2){let e=X().$implicit;B(),$(``,e.phases?.total,`ms`)}}function yw(e,t){if(e&1&&(q(0,`span`,8),Z(1),J()),e&2){let e=X().$implicit;B(),$(``,e.endedAt-e.startedAt,`ms`)}}function bw(e,t){e&1&&(q(0,`span`,11),Z(1,`probe`),J())}function xw(e,t){if(e&1&&Vh(0,`span`),e&2){let e=t.$implicit,n=X(4);pg(`width`,e.width,`%`)(`background`,n.color(e.phase)),_h(`title`,e.phase+` `+e.ms+`ms`)}}function Sw(e,t){if(e&1&&(q(0,`div`,12),U(1,xw,1,5,`span`,17,fw),J()),e&2){let e=X().$implicit,t=X(2);_h(`aria-label`,t.barLabel(e)),B(),W(t.bars(e))}}function Cw(e,t){if(e&1&&(q(0,`dt`),Z(1,`From`),J(),q(2,`dd`)(3,`code`),Z(4),J()()),e&2){let e=X().$implicit;B(4),Q(e.from)}}function ww(e,t){if(e&1&&(q(0,`dt`),Z(1,`Started by`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),Ng(``,e.caller,` (`,e.trigger,`)`)}}function Tw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Extras`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),Q(e.extras?.join(`, `))}}function Ew(e,t){if(e&1&&(q(0,`dt`),Z(1,`Redirect of`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),$(`#`,e.redirectedFrom)}}function Dw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Redirects to`),J(),q(2,`dd`)(3,`code`),Z(4),J(),Z(5),J()),e&2){let e=X().$implicit;B(4),Q(e.redirectTo),B(),$(` (`,e.redirectKind,`) `)}}function Ow(e,t){if(e&1&&(q(0,`dt`),Z(1,`Guards`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit,t=X(2);B(3),Ng(``,e.guards.names.join(`, `)||`none`,`: `,t.guardResult(e))}}function kw(e,t){if(e&1&&(q(0,`div`)(1,`code`),Z(2),J(),Z(3),q(4,`code`),Z(5),J(),Z(6,`: `),q(7,`strong`),Z(8),J(),Z(9),J()),e&2){let e=t.$implicit,n=X(4);B(2),Q(e.guard),B(),$(` `,e.kind,` on `),B(2),Q(e.route),B(2),mg(`bad`,n.isBad(e.result)),B(),Q(e.result),B(),$(` (`,e.ms,`ms) `)}}function Aw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Runs`),J(),q(2,`dd`),U(3,kw,10,7,`div`,null,Dh),J()),e&2){let e=X().$implicit;B(3),W(e.runs)}}function jw(e,t){if(e&1&&Z(0),e&2){let e=X(2).$implicit;$(` leaving `,e.checked.deactivate.join(`, `),`; `)}}function Mw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Checked`),J(),q(2,`dd`),V(3,jw,1,1),Z(4),J()),e&2){let e=X().$implicit;B(3),H(e.checked.deactivate.length?3:-1),B(),$(` entering `,e.checked.activate.join(`, `)||`nothing new`,` `)}}function Nw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Resolvers`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),Q(e.resolvers?.names?.join(`, `))}}function Pw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Lazy loaded`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),Q(e.lazyLoaded?.join(`, `))}}function Fw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Reused`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),$(` `,e.reused?.join(`, `),` (component kept, only inputs and params change) `)}}function Iw(e,t){if(e&1&&(q(0,`dt`),Z(1,`HTTP`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),Ng(``,e.requests.count,` request(s): `,e.requests.urls.join(`, `))}}function Lw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Scroll`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),Q(e.scroll)}}function Rw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Title after`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),Q(e.title)}}function zw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Warnings`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),Q(e.warnings?.join(` · `))}}function Bw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Reason`),J(),q(2,`dd`,18),Z(3),J()),e&2){let e=X().$implicit,t=X(2);B(3),Q(Lg(1,uw,e.code,e.reason).filter(t.Boolean).join(`: `))}}function Vw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Error`),J(),q(2,`dd`,18),Z(3),J()),e&2){let e=X().$implicit;B(3),Q(e.errorCode)}}function Hw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Error handler`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),Q(e.errorHandler)}}function Uw(e,t){if(e&1&&(q(0,`dt`),Z(1,`Earlier`),J(),q(2,`dd`),Z(3),J()),e&2){let e=X().$implicit;B(3),$(``,e.earlier,` navigation(s) before DevTools connected`)}}function Ww(e,t){if(e&1){let e=Jh();q(0,`li`)(1,`div`,9),V(2,hw,2,1,`time`),q(3,`span`,8),Z(4),J(),q(5,`code`),Z(6),J(),V(7,gw,6,1),q(8,`span`,10),Z(9),J(),V(10,_w,2,1,`span`,8)(11,vw,2,1,`span`,8)(12,yw,2,1,`span`,8),V(13,bw,2,0,`span`,11),J(),V(14,Sw,3,1,`div`,12),q(15,`dl`,13),V(16,Cw,5,1),V(17,ww,4,2),V(18,Tw,4,1),V(19,Ew,4,1),V(20,Dw,6,2),V(21,Ow,4,2),V(22,Aw,5,0),V(23,Mw,5,2),V(24,Nw,4,1),V(25,Pw,4,1),V(26,Fw,4,1),V(27,Iw,4,2),V(28,Lw,4,1),V(29,Rw,4,1),V(30,zw,4,1),V(31,Bw,4,4),V(32,Vw,4,1),V(33,Hw,4,1),V(34,Uw,4,1),J(),q(35,`div`,14)(36,`button`,4),Y(`click`,function(){let t=yo(e).$implicit;return bo(X(2).replay(t))}),Z(37,` Replay `),J(),q(38,`button`,4),Y(`click`,function(){let t=yo(e).$implicit;return bo(X(2).copy(t))}),Z(39,` Copy repro `),J()()()}if(e&2){let e=t.$implicit,n=X(2);B(2),H(e.beforeConnect?-1:2),B(2),$(`#`,e.id),B(2),Q(e.url),B(),H(e.finalUrl&&e.finalUrl!==e.url?7:-1),B(),_h(`data-tone`,n.tone(e.outcome)),B(),Q(e.outcome),B(),H(e.beforeConnect?10:e.phases?.total===void 0?e.endedAt===void 0?-1:12:11),B(3),H(e.probe?13:-1),B(),H(n.bars(e).length?14:-1),B(2),H(e.from?16:-1),B(),H(e.caller?17:-1),B(),H(e.extras?.length?18:-1),B(),H(e.redirectedFrom===void 0?-1:19),B(),H(e.redirectTo?20:-1),B(),H(e.guards&&(e.guards.names.length||e.guards.passed===!1)?21:-1),B(),H(e.runs?.length?22:-1),B(),H(e.checked&&(e.checked.activate.length||e.checked.deactivate.length)?23:-1),B(),H(e.resolvers?.names?.length?24:-1),B(),H(e.lazyLoaded?.length?25:-1),B(),H(e.reused?.length?26:-1),B(),H(e.requests?27:-1),B(),H(e.scroll?28:-1),B(),H(e.title?29:-1),B(),H(e.warnings?.length?30:-1),B(),H(e.reason||e.code?31:-1),B(),H(e.errorCode?32:-1),B(),H(e.errorHandler?33:-1),B(),H(e.earlier?34:-1),B(2),_h(`aria-label`,`Replay navigation `+e.id),B(2),_h(`aria-label`,`Copy repro for navigation `+e.id)}}function Gw(e,t){if(e&1&&(q(0,`ol`,7),U(1,Ww,40,30,`li`,null,dw),J()),e&2){let e=X();B(),W(e.items())}}function Kw(e,t){e&1&&(q(0,`p`,8),Z(1,` No navigations since DevTools connected; earlier ones are not visible. Click a link in the app. `),J())}var qw=[`recognize`,`guards`,`resolve`,`activate`],Jw={recognize:`#60a5fa`,guards:`#f59e0b`,resolve:`#a78bfa`,activate:`#34d399`},Yw=class e{page=o_.required();rpc=o_(null);phases=qw;filter=L(``);onlyProblems=L(!1);message=L(``);items=Zg(()=>{let e=this.filter().toLowerCase();return[...this.page().navigations].reverse().filter(t=>(!e||t.url.toLowerCase().includes(e)||!!t.finalUrl?.toLowerCase().includes(e))&&(!this.onlyProblems()||![`succeeded`,`pending`].includes(t.outcome)))});tone(e){return hC(e)}color(e){return Jw[e]}bars(e){let t=e.phases?.total;return t?qw.filter(t=>(e.phases?.[t]??0)>0).map(n=>({phase:n,ms:e.phases[n],width:Math.max(1,e.phases[n]/t*100)})):[]}barLabel(e){return`Phases: ${this.bars(e).map(e=>`${e.phase} ${e.ms}ms`).join(`, `)}`}guardResult(e){let t=e.guards?.passed;return t===!0?`passed`:t===!1?e.outcome===`redirected`?`redirected`:`blocked`:e.outcome===`pending`?`running`:`did not finish, navigation ${e.outcome}`}isBad(e){return e===`false`||/^(UrlTree|RedirectCommand|threw)/.test(e)}time(e){return new Date(e).toLocaleTimeString()}async toggleInstrument(e){let t=e.target.checked,n=await mC(this.rpc(),this.page().pageId,{action:`instrument`,on:t});this.message.set(n?.error?String(n.error):t?`Recording each guard and resolver.`:`Stopped recording guards and resolvers.`)}async replay(e){this.message.set(`Replaying #${e.id}…`);let t=await mC(this.rpc(),this.page().pageId,{action:`replay`,id:e.id});if(!t||t.error){this.message.set(String(t?.error??`Replay failed.`));return}let n=t.replay;this.message.set(`Replay of #${e.id}: ${n?.outcome??`unknown`}${t.same?` (same as before)`:` (different from before)`}.`)}async copy(e){let t=await pC(this.rpc(),`router-export`,{pageId:this.page().pageId,id:e.id});if(!t){this.message.set(`Could not build the repro.`);return}try{await navigator.clipboard.writeText(t),this.message.set(`Copied a markdown repro of #${e.id}.`)}catch{this.message.set(`The clipboard is not available here.`)}}exportJson(){let e=new Blob([JSON.stringify(this.page().navigations,null,2)],{type:`application/json`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`navigations-${this.page().pageId}.json`,n.click(),URL.revokeObjectURL(t)}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-route-timeline`]],inputs:{page:[1,`page`],rpc:[1,`rpc`]},decls:16,vars:5,consts:[[1,`toolbar`],[1,`check`],[`type`,`checkbox`,3,`change`,`checked`],[`type`,`text`,`aria-label`,`Filter navigations by URL`,`placeholder`,`Filter by URL`,1,`field`,3,`input`,`value`],[`type`,`button`,1,`small`,3,`click`],[`role`,`status`,1,`muted`],[`aria-hidden`,`true`,1,`legend`],[1,`navs`],[1,`muted`],[1,`head`],[1,`badge`],[1,`tag`],[`role`,`img`,1,`bar`],[1,`details`],[1,`actions`],[`aria-hidden`,`true`],[1,`visually-hidden`],[3,`width`,`background`],[1,`reason`]],template:function(e,t){e&1&&(q(0,`div`,0)(1,`label`,1)(2,`input`,2),Y(`change`,function(e){return t.toggleInstrument(e)}),J(),Z(3,` Record each guard and resolver `),J(),q(4,`input`,3),Y(`input`,function(e){return t.filter.set(e.target.value)}),J(),q(5,`label`,1)(6,`input`,2),Y(`change`,function(e){return t.onlyProblems.set(e.target.checked)}),J(),Z(7,` Only problems `),J(),q(8,`button`,4),Y(`click`,function(){return t.exportJson()}),Z(9,`Export JSON`),J()(),V(10,pw,2,1,`p`,5),q(11,`div`,6),U(12,mw,3,3,`span`,null,Oh),J(),V(14,Gw,3,0,`ol`,7)(15,Kw,2,0,`p`,8)),e&2&&(B(2),Yh(`checked`,t.page().instrumented),B(2),Yh(`value`,t.filter()),B(2),Yh(`checked`,t.onlyProblems()),B(4),H(t.message()?10:-1),B(2),W(t.phases),B(2),H(t.items().length?14:15))},styles:[`.muted[_ngcontent-%COMP%] {
    color: #a1a1aa;
    font-size: 13px;
  }
  code[_ngcontent-%COMP%] {
    font-family: monospace;
    color: #d4d4d8;
    overflow-wrap: anywhere;
  }
  .tag[_ngcontent-%COMP%] {
    display: inline-block;
    margin: 0 4px 4px 0;
    padding: 1px 6px;
    border: 1px solid #52525b;
    border-radius: 4px;
    color: #d4d4d8;
    font-size: 11px;
    font-family: monospace;
  }
  .badge[_ngcontent-%COMP%] {
    padding: 1px 6px;
    border-radius: 4px;
    background: #3f3f46;
    color: #e4e4e7;
    font-size: 11px;
    font-weight: 600;
  }
  .badge[data-tone='good'][_ngcontent-%COMP%] {
    background: #14532d;
    color: #bbf7d0;
  }
  .badge[data-tone='warn'][_ngcontent-%COMP%] {
    background: #713f12;
    color: #fef08a;
  }
  .badge[data-tone='bad'][_ngcontent-%COMP%] {
    background: #7f1d1d;
    color: #fecaca;
  }
  button.small[_ngcontent-%COMP%] {
    padding: 3px 10px;
    background: #3f3f46;
    border: none;
    border-radius: 6px;
    color: #e4e4e7;
    cursor: pointer;
    font-size: 12px;
  }
  button.small[_ngcontent-%COMP%]:hover {
    background: #52525b;
  }
  button.small[_ngcontent-%COMP%]:focus-visible, 
   input[_ngcontent-%COMP%]:focus-visible, 
   select[_ngcontent-%COMP%]:focus-visible, 
   .table-scroll[_ngcontent-%COMP%]:focus-visible {
    outline: 2px solid var(--%NS%accent);
    outline-offset: 2px;
  }
  input.field[_ngcontent-%COMP%] {
    padding: 6px 10px;
    background: #18181b;
    border: 1px solid #52525b;
    border-radius: 6px;
    color: #e4e4e7;
    font-size: 13px;
  }
  .table-scroll[_ngcontent-%COMP%] {
    overflow-x: auto;
  }
  table[_ngcontent-%COMP%] {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  th[_ngcontent-%COMP%] {
    text-align: left;
    padding: 6px 12px;
    color: #a1a1aa;
    font-size: 12px;
    border-bottom: 1px solid #27272a;
  }
  td[_ngcontent-%COMP%] {
    padding: 8px 12px;
    border-bottom: 1px solid #1e1e22;
    vertical-align: top;
  }
  h3[_ngcontent-%COMP%] {
    margin: 0 0 8px;
    font-size: 14px;
    color: #e4e4e7;
  }
  .visually-hidden[_ngcontent-%COMP%] {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

    [_nghost-%COMP%] {
      display: grid;
      gap: 10px;
    }
    .toolbar[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
      align-items: center;
      font-size: 13px;
      color: #e4e4e7;
    }
    .check[_ngcontent-%COMP%] {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .legend[_ngcontent-%COMP%] {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #a1a1aa;
    }
    .legend[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 4px;
      border-radius: 2px;
    }
    .navs[_ngcontent-%COMP%] {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 8px;
    }
    .navs[_ngcontent-%COMP%]    > li[_ngcontent-%COMP%] {
      padding: 10px;
      border: 1px solid #27272a;
      border-radius: 6px;
      font-size: 13px;
    }
    .head[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    time[_ngcontent-%COMP%] {
      color: #a1a1aa;
      font-size: 12px;
    }
    .bar[_ngcontent-%COMP%] {
      display: flex;
      height: 6px;
      margin: 8px 0 4px;
      border-radius: 3px;
      overflow: hidden;
      background: #27272a;
    }
    .bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
      display: block;
      min-width: 2px;
    }
    .details[_ngcontent-%COMP%] {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 3px 12px;
      margin: 6px 0 0;
      font-size: 12px;
    }
    dt[_ngcontent-%COMP%] {
      color: #a1a1aa;
    }
    dd[_ngcontent-%COMP%] {
      margin: 0;
      color: #e4e4e7;
      overflow-wrap: anywhere;
    }
    .reason[_ngcontent-%COMP%], 
   .bad[_ngcontent-%COMP%] {
      color: #fecaca;
    }
    .actions[_ngcontent-%COMP%] {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }`]})},Xw=()=>[],Zw=(e,t)=>t.node.id;function Qw(e,t){if(e&1&&(Z(0,` with `),q(1,`code`),Z(2),Vg(3,`json`),J()),e&2){let e=X(2);B(2),Q(Ug(3,1,e.params))}}function $w(e,t){if(e&1&&(Z(0),V(1,Qw,4,3)),e&2){let e=X(),t=X();$(` Matches `,t.chainText(e),` `),B(),H(t.hasKeys(e.params)?1:-1)}}function eT(e,t){e&1&&Z(0),e&2&&$(` Nearest: `,X(2).nearest.join(`, `),` `)}function tT(e,t){if(e&1&&(Z(0,` Matches no route (NG04002). `),V(1,eT,1,1)),e&2){let e=X();B(),H(e.nearest.length?1:-1)}}function nT(e,t){if(e&1&&(q(0,`div`,8),Z(1),J()),e&2){let e=t.$implicit;B(),Q(e)}}function rT(e,t){if(e&1&&(q(0,`div`,5),V(1,$w,2,2)(2,tT,2,1),U(3,nT,2,1,`div`,8,Oh),J()),e&2){let e=t;B(),H(e.matched?1:2),B(2),W(e.notes)}}function iT(e,t){if(e&1&&(q(0,`p`,6),Z(1),J()),e&2){let e=X();B(),Q(e.message())}}function aT(e,t){if(e&1&&(q(0,`p`,8),Z(1),J()),e&2){let e=X();B(),$(` `,e.page().setup?.mode===`events-only`?`This build has no debug utils, so the live config cannot be read.`:`The page has not reported its route config yet.`,` `)}}function oT(e,t){e&1&&(q(0,`span`,14),Z(1,`active`),J())}function sT(e,t){if(e&1&&(q(0,`span`,14),Z(1),J()),e&2){let e=X().$implicit;B(),$(`lazy `,e.node.lazy)}}function cT(e,t){if(e&1&&(q(0,`span`,14),Z(1),J()),e&2){let e=X().$implicit;B(),$(`outlet `,e.node.outlet)}}function lT(e,t){if(e&1&&(Z(0,` redirect → `),q(1,`code`),Z(2),J()),e&2){let e=X().$implicit;B(2),Q(e.node.redirectTo)}}function uT(e,t){if(e&1&&Z(0),e&2){let e=X().$implicit;$(` `,e.node.component??(e.node.lazy===`unloaded`?`lazy, not loaded yet`:e.node.kind),` `)}}function dT(e,t){if(e&1&&(q(0,`span`,14),Z(1),J()),e&2){let e=t.$implicit;B(),Q(e)}}function fT(e,t){if(e&1&&(q(0,`span`,14),Z(1),J()),e&2){let e=t.$implicit;B(),$(`resolve `,e)}}function pT(e,t){if(e&1){let e=Jh();q(0,`input`,18),Y(`input`,function(t){let n=yo(e).$implicit,r=X(2).$implicit;return bo(X(2).setParam(r.node.id,n,t.target.value))}),J()}if(e&2){let e=t.$implicit,n=X(2).$implicit;Yh(`placeholder`,e),_h(`aria-label`,e+` for `+n.node.fullPath)}}function mT(e,t){if(e&1){let e=Jh();U(0,pT,1,2,`input`,17,Oh),q(2,`button`,4),Y(`click`,function(){yo(e);let t=X().$implicit;return bo(X(2).navigate(t.node))}),Z(3,` Go `),J()}if(e&2){let e=X().$implicit;W(X(2).params(e.node)),B(2),_h(`aria-label`,`Navigate to `+e.node.fullPath)}}function hT(e,t){if(e&1){let e=Jh();q(0,`button`,4),Y(`click`,function(){yo(e);let t=X().$implicit;return bo(X(2).resolveLazy(t.node))}),Z(1,` Read lazy `),J()}if(e&2){let e=X().$implicit;_h(`aria-label`,`Read lazy routes of `+e.node.fullPath)}}function gT(e,t){if(e&1&&(q(0,`tr`)(1,`td`,13),Z(2),V(3,oT,2,0,`span`,14),V(4,sT,2,1,`span`,14),V(5,cT,2,1,`span`,14),J(),q(6,`td`),V(7,lT,3,1)(8,uT,1,1),J(),q(9,`td`),U(10,dT,2,1,`span`,14,Oh),U(12,fT,2,1,`span`,14,Oh),J(),q(14,`td`),Z(15),J(),q(16,`td`,15),V(17,mT,4,1),V(18,hT,2,1,`button`,16),J()()),e&2){let e=t.$implicit,n=X(2);mg(`active`,n.isActive(e.node)),B(),pg(`padding-left`,12+e.depth*16,`px`),B(),$(` `,e.node.fullPath,` `),B(),H(n.isActive(e.node)?3:-1),B(),H(e.node.lazy?4:-1),B(),H(e.node.outlet?5:-1),B(2),H(e.node.redirectTo===void 0?8:7),B(3),W(n.guardList(e.node)),B(2),W(e.node.resolvers??Ig(12,Xw)),B(3),Q(e.node.title??``),B(2),H(n.canNavigate(e.node)?17:-1),B(),H(e.node.kind===`lazy`&&e.node.lazy===`unloaded`?18:-1)}}function _T(e,t){if(e&1&&(q(0,`p`,8),Z(1),J(),q(2,`div`,9)(3,`table`)(4,`thead`)(5,`tr`)(6,`th`,10),Z(7,`Path`),J(),q(8,`th`,10),Z(9,`Target`),J(),q(10,`th`,10),Z(11,`Guards and resolvers`),J(),q(12,`th`,10),Z(13,`Title`),J(),q(14,`th`,10)(15,`span`,11),Z(16,`Actions`),J()()()(),q(17,`tbody`),U(18,gT,19,13,`tr`,12,Zw),J()()()),e&2){let e=X();B(),Ng(` Generation `,e.page().generation,` · `,e.rows().length,` route(s). Lazy routes show their children once loaded. `),B(17),W(e.rows())}}var vT=class e{page=o_.required();rpc=o_(null);filter=L(``);testUrl=L(``);match=L(null);message=L(``);paramValues=new Map;active=Zg(()=>new Set(this.page().activeIds??[]));rows=Zg(()=>{let e=this.filter().toLowerCase(),t=[],n=(r,i)=>{for(let a of r)(!e||a.fullPath.toLowerCase().includes(e)||a.component?.toLowerCase().includes(e))&&t.push({node:a,depth:i}),a.children&&n(a.children,i+1)};return n(this.page().config??[],0),t});hasKeys(e){return Object.keys(e).length>0}isActive(e){return this.active().has(e.id)}guardList(e){return Object.entries(e.guards??{}).flatMap(([e,t])=>t.map(t=>`${e} ${t}`))}params(e){return(e.fullPath.match(/:([A-Za-z0-9_]+)/g)??[]).map(e=>e.slice(1))}canNavigate(e){return e.redirectTo===void 0&&!e.outlet&&!e.fullPath.includes(`**`)&&(!!e.component||e.kind===`component`||e.kind===`lazy`)}setParam(e,t,n){this.paramValues.set(e,{...this.paramValues.get(e),[t]:n})}chainText(e){return e.chain.map(e=>e.fullPath).join(` → `)}async predict(){let e=this.testUrl().trim();e&&this.match.set(await pC(this.rpc(),`router-match`,{pageId:this.page().pageId,url:e}))}async probe(){let e=this.testUrl().trim();if(!e)return;this.message.set(`Running the real matcher in the app…`);let t=await mC(this.rpc(),this.page().pageId,{action:`probe`,url:e});if(!t||t.error){this.message.set(String(t?.error??`Probe failed.`));return}this.message.set(t.matched?`The app matched ${e} (see the probe entry in Navigations).`:`The app did not match ${e}: ${String(t.reason??``)}`)}async navigate(e){let t=this.paramValues.get(e.id)??{};this.message.set(`Navigating to ${e.fullPath}…`);let n=await mC(this.rpc(),this.page().pageId,{action:`navigate`,pattern:e.fullPath,params:t});this.message.set(!n||n.error?String(n?.error??`Navigation failed.`):`Navigation #${n.id}: ${n.outcome}${n.finalUrl?` at ${n.finalUrl}`:``}.`)}async resolveLazy(e){let t=await mC(this.rpc(),this.page().pageId,{action:`resolve-lazy`,id:e.id});if(!t||t.error){this.message.set(String(t?.error??`Could not read the lazy routes.`));return}let n=t.routes??[];this.message.set(`${e.fullPath} declares ${n.length} route(s): ${n.map(e=>`/${e.path}`).join(`, `)}. The router loads them for real on the first navigation that needs them.`)}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-route-tree`]],inputs:{page:[1,`page`],rpc:[1,`rpc`]},decls:13,vars:5,consts:[[1,`test`,3,`submit`],[`for`,`test-url`],[`id`,`test-url`,`type`,`text`,`placeholder`,`/users/42`,1,`field`,3,`input`,`value`],[`type`,`submit`,1,`small`],[`type`,`button`,1,`small`,3,`click`],[`role`,`status`,1,`result`],[`role`,`status`,1,`muted`],[`type`,`text`,`aria-label`,`Filter routes`,`placeholder`,`Filter by path or component`,1,`field`,`filter`,3,`input`,`value`],[1,`muted`],[`role`,`region`,`aria-label`,`Live route config`,`tabindex`,`0`,1,`table-scroll`],[`scope`,`col`],[1,`visually-hidden`],[3,`active`],[1,`path`],[1,`tag`],[1,`actions`],[`type`,`button`,1,`small`],[`type`,`text`,1,`field`,`param`,3,`placeholder`],[`type`,`text`,1,`field`,`param`,3,`input`,`placeholder`]],template:function(e,t){if(e&1&&(q(0,`form`,0),Y(`submit`,function(e){return e.preventDefault(),t.predict()}),q(1,`label`,1),Z(2,`Test a URL`),J(),q(3,`input`,2),Y(`input`,function(e){return t.testUrl.set(e.target.value)}),J(),q(4,`button`,3),Z(5,`Predict`),J(),q(6,`button`,4),Y(`click`,function(){return t.probe()}),Z(7,`Probe in app`),J()(),V(8,rT,5,1,`div`,5),V(9,iT,2,1,`p`,6),q(10,`input`,7),Y(`input`,function(e){return t.filter.set(e.target.value)}),J(),V(11,aT,2,1,`p`,8)(12,_T,20,2)),e&2){let e;B(3),Yh(`value`,t.testUrl()),B(5),H((e=t.match())?8:-1,e),B(),H(t.message()?9:-1),B(),Yh(`value`,t.filter()),B(),H(t.page().config?12:11)}},dependencies:[S_],styles:[`.muted[_ngcontent-%COMP%] {
    color: #a1a1aa;
    font-size: 13px;
  }
  code[_ngcontent-%COMP%] {
    font-family: monospace;
    color: #d4d4d8;
    overflow-wrap: anywhere;
  }
  .tag[_ngcontent-%COMP%] {
    display: inline-block;
    margin: 0 4px 4px 0;
    padding: 1px 6px;
    border: 1px solid #52525b;
    border-radius: 4px;
    color: #d4d4d8;
    font-size: 11px;
    font-family: monospace;
  }
  .badge[_ngcontent-%COMP%] {
    padding: 1px 6px;
    border-radius: 4px;
    background: #3f3f46;
    color: #e4e4e7;
    font-size: 11px;
    font-weight: 600;
  }
  .badge[data-tone='good'][_ngcontent-%COMP%] {
    background: #14532d;
    color: #bbf7d0;
  }
  .badge[data-tone='warn'][_ngcontent-%COMP%] {
    background: #713f12;
    color: #fef08a;
  }
  .badge[data-tone='bad'][_ngcontent-%COMP%] {
    background: #7f1d1d;
    color: #fecaca;
  }
  button.small[_ngcontent-%COMP%] {
    padding: 3px 10px;
    background: #3f3f46;
    border: none;
    border-radius: 6px;
    color: #e4e4e7;
    cursor: pointer;
    font-size: 12px;
  }
  button.small[_ngcontent-%COMP%]:hover {
    background: #52525b;
  }
  button.small[_ngcontent-%COMP%]:focus-visible, 
   input[_ngcontent-%COMP%]:focus-visible, 
   select[_ngcontent-%COMP%]:focus-visible, 
   .table-scroll[_ngcontent-%COMP%]:focus-visible {
    outline: 2px solid var(--%NS%accent);
    outline-offset: 2px;
  }
  input.field[_ngcontent-%COMP%] {
    padding: 6px 10px;
    background: #18181b;
    border: 1px solid #52525b;
    border-radius: 6px;
    color: #e4e4e7;
    font-size: 13px;
  }
  .table-scroll[_ngcontent-%COMP%] {
    overflow-x: auto;
  }
  table[_ngcontent-%COMP%] {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  th[_ngcontent-%COMP%] {
    text-align: left;
    padding: 6px 12px;
    color: #a1a1aa;
    font-size: 12px;
    border-bottom: 1px solid #27272a;
  }
  td[_ngcontent-%COMP%] {
    padding: 8px 12px;
    border-bottom: 1px solid #1e1e22;
    vertical-align: top;
  }
  h3[_ngcontent-%COMP%] {
    margin: 0 0 8px;
    font-size: 14px;
    color: #e4e4e7;
  }
  .visually-hidden[_ngcontent-%COMP%] {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

    [_nghost-%COMP%] {
      display: grid;
      gap: 10px;
    }
    .test[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      font-size: 13px;
      color: #e4e4e7;
    }
    .result[_ngcontent-%COMP%] {
      padding: 8px 10px;
      border: 1px solid #27272a;
      border-radius: 6px;
      font-size: 13px;
      color: #e4e4e7;
    }
    .filter[_ngcontent-%COMP%] {
      max-width: 320px;
    }
    .path[_ngcontent-%COMP%] {
      font-family: monospace;
      color: var(--%NS%accent);
      white-space: nowrap;
    }
    tr.active[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {
      background: #1c1917;
    }
    .actions[_ngcontent-%COMP%] {
      white-space: nowrap;
    }
    .param[_ngcontent-%COMP%] {
      width: 80px;
      margin-right: 4px;
    }`]})},yT=(e,t)=>t.id,bT=(e,t)=>t.pageId;function xT(e,t){e&1&&(G(0,`p`,0),Z(1,`Could not load the live router state.`),K())}function ST(e,t){e&1&&(G(0,`p`,0),Z(1,`Loading the live router state…`),K())}function CT(e,t){if(e&1&&(G(0,`option`,8),Z(1),K()),e&2){let e=t.$implicit,n=X(2);Lh(`value`,e.pageId)(`selected`,e.pageId===n.pageId),B(),Ng(` `,e.snapshot?.url??e.pageId,` (`,e.pageId,`) `)}}function wT(e,t){if(e&1){let e=Jh();G(0,`label`,1),Z(1,` Page `),G(2,`select`,7),Qh(`change`,function(t){return yo(e),bo(X(2).pickPage(t))}),U(3,CT,2,4,`option`,8,bT),K()()}if(e&2){let e=X(2);B(3),W(e.pages())}}function TT(e,t){if(e&1&&(G(0,`span`,10),Z(1),K()),e&2){let e=X(3);_h(`aria-label`,e.problems()+` problem navigations`),B(),Q(e.problems())}}function ET(e,t){if(e&1){let e=Jh();G(0,`button`,9),Qh(`click`,function(){let t=yo(e).$implicit;return bo(X(2).selected.set(t.id))}),Z(1),V(2,TT,2,2,`span`,10),K()}if(e&2){let e=t.$implicit,n=X(2);Lh(`id`,`router-tab-`+e.id),_h(`aria-selected`,e.id===n.selected())(`aria-controls`,`router-panel-`+e.id)(`tabindex`,e.id===n.selected()?0:-1),B(),$(` `,e.label,` `),B(),H(e.id===`navigations`&&n.problems()>0?2:-1)}}function DT(e,t){if(e&1&&Bh(0,`app-route-current`,5),e&2){let e=X(),t=X();Lh(`page`,e)(`rpc`,t.rpc())}}function OT(e,t){if(e&1&&Bh(0,`app-route-timeline`,5),e&2){let e=X(),t=X();Lh(`page`,e)(`rpc`,t.rpc())}}function kT(e,t){if(e&1&&Bh(0,`app-route-tree`,5),e&2){let e=X(),t=X();Lh(`page`,e)(`rpc`,t.rpc())}}function AT(e,t){e&1&&Bh(0,`app-route-setup`,6),e&2&&Lh(`page`,X())}function jT(e,t){if(e&1&&Bh(0,`app-route-lint`,5),e&2){let e=X(),t=X();Lh(`page`,e)(`rpc`,t.rpc())}}function MT(e,t){if(e&1){let e=Jh();V(0,wT,5,0,`label`,1),G(1,`div`,2),Qh(`keydown`,function(t){return yo(e),bo(X().onKey(t))}),U(2,ET,3,6,`button`,3,yT),K(),G(4,`div`,4),V(5,DT,1,2,`app-route-current`,5)(6,OT,1,2,`app-route-timeline`,5)(7,kT,1,2,`app-route-tree`,5)(8,AT,1,1,`app-route-setup`,6)(9,jT,1,2,`app-route-lint`,5),K()}if(e&2){let e,t=X();H(t.pages().length>1?0:-1),B(2),W(t.tabs),B(2),Lh(`id`,`router-panel-`+t.selected()),_h(`aria-labelledby`,`router-tab-`+t.selected()),B(),H((e=t.selected())===`current`?5:e===`navigations`?6:e===`routes`?7:e===`setup`?8:e===`lint`?9:-1)}}function NT(e,t){e&1&&(G(0,`p`,0),Z(1,`No page is reporting router state yet. Open the app in a browser.`),K())}var PT=[{id:`current`,label:`Current`},{id:`navigations`,label:`Navigations`},{id:`routes`,label:`Routes`},{id:`setup`,label:`Setup`},{id:`lint`,label:`Lint`}],FT=class e{rpc=o_(null);tabs=PT;selected=L(`current`);pages=L([]);loading=L(!0);failed=L(!1);pageId=e_({source:this.pages,computation:(e,t)=>t?.value&&e.some(e=>e.pageId===t.value)?t.value:e.find(e=>e.snapshot)?.pageId??e[0]?.pageId??null});unsubscribe=null;destroyRef=P(ls);page=Zg(()=>{let e=this.pages();return e.find(e=>e.pageId===this.pageId())??e[0]??null});problems=Zg(()=>(this.page()?.navigations??[]).filter(e=>!e.probe&&[`failed`,`cancelled`,`redirected`].includes(e.outcome)).length);constructor(){Xs(()=>{let e=this.rpc();e&&this.load(e)}),this.destroyRef.onDestroy(()=>this.unsubscribe?.())}async load(e){this.loading.set(!0),this.failed.set(!1);try{let t=await e.scope(`ng-devtools`).rpc.sharedState(`router`);if(this.destroyRef.destroyed)return;let n=e=>{this.pages.set(e?.pages??[])};n(t.value()),this.unsubscribe?.(),this.unsubscribe=t.on(`updated`,n)}catch{this.failed.set(!0)}finally{this.loading.set(!1)}}pickPage(e){this.pageId.set(e.target.value)}onKey(e){let t=this.tabs.map(e=>e.id),n=t.indexOf(this.selected()),r=n;if(e.key===`ArrowRight`)r=(n+1)%t.length;else if(e.key===`ArrowLeft`)r=(n-1+t.length)%t.length;else if(e.key===`Home`)r=0;else if(e.key===`End`)r=t.length-1;else return;e.preventDefault(),this.selected.set(t[r]);let i=e.currentTarget;queueMicrotask(()=>i.querySelector(`#router-tab-${t[r]}`)?.focus())}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-live-route`]],inputs:{rpc:[1,`rpc`]},decls:4,vars:1,consts:[[1,`muted`],[1,`page-pick`],[`role`,`tablist`,`aria-label`,`Router views`,1,`tabs`,3,`keydown`],[`type`,`button`,`role`,`tab`,3,`id`],[`role`,`tabpanel`,1,`panel`,3,`id`],[3,`page`,`rpc`],[3,`page`],[3,`change`],[3,`value`,`selected`],[`type`,`button`,`role`,`tab`,3,`click`,`id`],[1,`count`]],template:function(e,t){if(e&1&&V(0,xT,2,0,`p`,0)(1,ST,2,0,`p`,0)(2,MT,10,4)(3,NT,2,0,`p`,0),e&2){let e;H(t.failed()?0:t.loading()?1:(e=t.page())?2:3,e)}},dependencies:[KC,ZC,lw,Yw,vT],styles:[`[_nghost-%COMP%] {
      display: grid;
      gap: 12px;
      margin-bottom: 28px;
    }
    .muted[_ngcontent-%COMP%] {
      color: #a1a1aa;
      font-size: 13px;
    }
    .page-pick[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      font-size: 13px;
      color: #d4d4d8;
    }
    select[_ngcontent-%COMP%] {
      max-width: 100%;
      min-width: 0;
      padding: 4px 8px;
      background: #18181b;
      border: 1px solid #52525b;
      border-radius: 6px;
      color: #e4e4e7;
    }
    .tabs[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      border-bottom: 1px solid #27272a;
    }
    [role='tab'][_ngcontent-%COMP%] {
      padding: 6px 12px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: #a1a1aa;
      cursor: pointer;
      font-size: 13px;
    }
    [role='tab'][aria-selected='true'][_ngcontent-%COMP%] {
      color: #e4e4e7;
      border-bottom-color: var(--%NS%accent);
    }
    [role='tab'][_ngcontent-%COMP%]:focus-visible, 
   select[_ngcontent-%COMP%]:focus-visible {
      outline: 2px solid var(--%NS%accent);
      outline-offset: 2px;
    }
    .count[_ngcontent-%COMP%] {
      margin-left: 4px;
      padding: 0 5px;
      border-radius: 8px;
      background: #7f1d1d;
      color: #fecaca;
      font-size: 11px;
    }`]})};function IT(e,t){e&1&&(G(0,`p`,5),Z(1,`Scanning routes…`),K())}function LT(e,t){e&1&&(G(0,`p`,5),Z(1,`No routes found.`),K())}function RT(e,t){if(e&1&&(G(0,`span`,9),Z(1),K()),e&2){let e=X().$implicit;B(),$(`➜ `,e.redirectTo)}}function zT(e,t){if(e&1&&Z(0),e&2){let e=X().$implicit;$(` `,e.component??`—`,` `)}}function BT(e,t){if(e&1&&(G(0,`tr`)(1,`td`,8),Z(2),K(),G(3,`td`),V(4,RT,2,1,`span`,9)(5,zT,1,1),K(),G(6,`td`),Z(7),K(),G(8,`td`,10),Z(9),K(),G(10,`td`),Z(11),K()()),e&2){let e=t.$implicit;B(2),$(`/`,e.path),B(2),H(e.redirectTo===void 0?5:4),B(3),Q(e.title??`—`),B(2),Q(e.file),B(2),Q(e.hasChildren?`Yes`:`—`)}}function VT(e,t){if(e&1&&(G(0,`table`,6)(1,`thead`)(2,`tr`)(3,`th`,7),Z(4,`Path`),K(),G(5,`th`,7),Z(6,`Component / Target`),K(),G(7,`th`,7),Z(8,`Title`),K(),G(9,`th`,7),Z(10,`File`),K(),G(11,`th`,7),Z(12,`Children`),K()()(),G(13,`tbody`),U(14,BT,12,5,`tr`,null,Dh),K()()),e&2){let e=X();B(14),W(e.filtered())}}var HT=class e{rpc=o_(null);routes=L([]);filter=L(``);loading=L(!1);filtered=Zg(()=>{let e=this.filter().toLowerCase().trim(),t=this.routes();return e?t.filter(t=>t.path.toLowerCase().includes(e)||t.component&&t.component.toLowerCase().includes(e)||t.redirectTo&&t.redirectTo.toLowerCase().includes(e)||t.title&&t.title.toLowerCase().includes(e)||t.file.toLowerCase().includes(e)):t});constructor(){Xs(()=>{this.rpc()&&this.refresh()})}onFilterInput(e){let t=e.target;this.filter.set(t?.value??``)}async refresh(){let e=this.rpc();if(e){this.loading.set(!0);try{let t=await e.scope(`ng-devtools`).rpc.call(`get-routes`);this.routes.set(t)}finally{this.loading.set(!1)}}}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-route-inspector`]],inputs:{rpc:[1,`rpc`]},decls:10,vars:3,consts:[[3,`rpc`],[1,`config-heading`],[1,`toolbar`],[`type`,`text`,`aria-label`,`Filter routes`,`placeholder`,`Filter routes…`,3,`input`,`value`],[`type`,`button`,3,`click`],[1,`muted`],[`role`,`table`],[`scope`,`col`],[1,`path`],[1,`redirect`],[1,`file`]],template:function(e,t){e&1&&(Bh(0,`app-live-route`,0),G(1,`h2`,1),Z(2,`Route config`),K(),G(3,`div`,2)(4,`input`,3),Qh(`input`,function(e){return t.onFilterInput(e)}),K(),G(5,`button`,4),Qh(`click`,function(){return t.refresh()}),Z(6,`Refresh`),K()(),V(7,IT,2,0,`p`,5)(8,LT,2,0,`p`,5)(9,VT,16,0,`table`,6)),e&2&&(Lh(`rpc`,t.rpc()),B(4),Lh(`value`,t.filter()),B(3),H(t.loading()?7:t.filtered().length===0?8:9))},dependencies:[FT],styles:[`.config-heading[_ngcontent-%COMP%] {
      margin: 0 0 8px;
      font-size: 15px;
      color: #e4e4e7;
    }
    .toolbar[_ngcontent-%COMP%] {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    input[_ngcontent-%COMP%] {
      flex: 1;
      padding: 8px 12px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 6px;
      color: #e4e4e7;
      font-size: 14px;
      outline: none;
    }
    input[_ngcontent-%COMP%]:focus {
      border-color: var(--%NS%accent);
    }
    button[_ngcontent-%COMP%] {
      padding: 8px 16px;
      background: #3f3f46;
      border: none;
      border-radius: 6px;
      color: #e4e4e7;
      cursor: pointer;
      font-size: 13px;
    }
    button[_ngcontent-%COMP%]:hover {
      background: #52525b;
    }
    .muted[_ngcontent-%COMP%] {
      color: #a1a1aa;
      font-size: 14px;
    }
    table[_ngcontent-%COMP%] {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    thead[_ngcontent-%COMP%] {
      position: sticky;
      top: 0;
    }
    th[_ngcontent-%COMP%] {
      text-align: left;
      padding: 8px 12px;
      background: #18181b;
      color: #a1a1aa;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #27272a;
    }
    td[_ngcontent-%COMP%] {
      padding: 10px 12px;
      border-bottom: 1px solid #1e1e22;
    }
    tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] {
      background: #18181b;
    }
    .path[_ngcontent-%COMP%] {
      font-family: monospace;
      color: var(--%NS%accent);
      font-weight: 500;
    }
    .redirect[_ngcontent-%COMP%] {
      font-family: monospace;
      color: #38bdf8;
    }
    .file[_ngcontent-%COMP%] {
      font-size: 12px;
      color: #a1a1aa;
    }`]})},UT=(e,t)=>t.name+t.file+t.line,WT=(e,t)=>t.kind,GT=(e,t)=>t.id;function KT(e,t){e&1&&(q(0,`div`,3)(1,`p`,4),Z(2,`No signals found.`),J(),q(3,`p`,5),Z(4,` No signal(), computed(), effect() calls found in source. Runtime graph requires Angular 19+ with the overlay connected. `),J()())}function qT(e,t){if(e&1&&Z(0),e&2){let e=X().$implicit;$(` · in <`,e.component,`> `)}}function JT(e,t){if(e&1&&(q(0,`div`,8)(1,`div`,9)(2,`span`,10),Z(3),J(),q(4,`span`,11),Z(5),J()(),q(6,`div`,12),Z(7),V(8,qT,1,1),J()()),e&2){let e=t.$implicit,n=X(2);B(2),pg(`background`,n.kindColor(e.kind)),B(),Q(e.kind),B(2),Q(e.name),B(2),Ng(` `,e.file,`:`,e.line,` `),B(),H(e.component?8:-1)}}function YT(e,t){if(e&1&&(q(0,`p`,6),Z(1,`Signals from source scan (static analysis):`),J(),q(2,`div`,7),U(3,JT,9,7,`div`,8,UT),J()),e&2){let e=X();B(3),W(e.filteredSourceSignals())}}function XT(e,t){if(e&1&&(q(0,`span`,14),Vh(1,`span`,17),Z(2),J()),e&2){let e=t.$implicit;B(),pg(`background`,e.color),B(),$(` `,e.kind,` `)}}function ZT(e,t){e&1&&(q(0,`span`,19),Z(1,`watching`),J())}function QT(e,t){if(e&1&&(q(0,`div`,20),Z(1),Vg(2,`json`),J()),e&2){let e=X().$implicit;B(),Q(Ug(2,1,e.value))}}function $T(e,t){if(e&1&&Z(0),e&2){let e=X().$implicit;$(` · Deps: `,X(2).getDependencies(e).length,` `)}}function eE(e,t){if(e&1&&Z(0),e&2){let e=X().$implicit;$(` · Consumers: `,X(2).getConsumers(e).length,` `)}}function tE(e,t){if(e&1){let e=Jh();q(0,`div`,18),Y(`click`,function(){let t=yo(e).$implicit;return bo(X(2).selectNode(t))}),q(1,`div`,9)(2,`span`,10),Z(3),J(),q(4,`span`,11),Z(5),J(),V(6,ZT,2,0,`span`,19),J(),V(7,QT,3,3,`div`,20),q(8,`div`,12),Z(9),V(10,$T,1,1),V(11,eE,1,1),J()()}if(e&2){let e=t.$implicit,n=X(2);mg(`selected`,n.selectedNode()?.id===e.id),B(2),pg(`background`,n.kindColor(e.kind)),B(),Q(e.kind),B(2),Q(e.label??`(unnamed)`),B(),H(e.watched?6:-1),B(),H(e.value===void 0?-1:7),B(2),$(` Epoch: `,e.epoch,` `),B(),H(n.getDependencies(e).length?10:-1),B(),H(n.getConsumers(e).length?11:-1)}}function nE(e,t){if(e&1&&(q(0,`dt`),Z(1,`Value`),J(),q(2,`dd`)(3,`pre`),Z(4),Vg(5,`json`),J()()),e&2){let e=X(3);B(4),Q(Ug(5,1,e.selectedNode().value))}}function rE(e,t){if(e&1&&(q(0,`li`)(1,`span`,21),Z(2),J(),Z(3),J()),e&2){let e=t.$implicit,n=X(4);B(),pg(`background`,n.kindColor(e.kind)),B(),Q(e.kind),B(),$(` `,e.label??e.id,` `)}}function iE(e,t){if(e&1&&(q(0,`h4`),Z(1,`Dependencies (producers)`),J(),q(2,`ul`),U(3,rE,4,4,`li`,null,GT),J()),e&2){let e=X(3);B(3),W(e.getDependencies(e.selectedNode()))}}function aE(e,t){if(e&1&&(q(0,`li`)(1,`span`,21),Z(2),J(),Z(3),J()),e&2){let e=t.$implicit,n=X(4);B(),pg(`background`,n.kindColor(e.kind)),B(),Q(e.kind),B(),$(` `,e.label??e.id,` `)}}function oE(e,t){if(e&1&&(q(0,`h4`),Z(1,`Consumers`),J(),q(2,`ul`),U(3,aE,4,4,`li`,null,GT),J()),e&2){let e=X(3);B(3),W(e.getConsumers(e.selectedNode()))}}function sE(e,t){if(e&1&&(q(0,`aside`,16)(1,`h3`),Z(2),J(),q(3,`dl`)(4,`dt`),Z(5,`Kind`),J(),q(6,`dd`),Z(7),J(),q(8,`dt`),Z(9,`Epoch`),J(),q(10,`dd`),Z(11),J(),V(12,nE,6,3),J(),V(13,iE,5,0),V(14,oE,5,0),J()),e&2){let e=X(2);B(2),Q(e.selectedNode().label??e.selectedNode().id),B(5),Q(e.selectedNode().kind),B(4),Q(e.selectedNode().epoch),B(),H(e.selectedNode().value===void 0?-1:12),B(),H(e.getDependencies(e.selectedNode()).length?13:-1),B(),H(e.getConsumers(e.selectedNode()).length?14:-1)}}function cE(e,t){if(e&1&&(q(0,`div`,13),U(1,XT,3,3,`span`,14,WT),J(),q(3,`div`,7),U(4,tE,12,11,`div`,15,GT),J(),V(6,sE,15,6,`aside`,16)),e&2){let e=X();B(),W(e.kindLegend),B(3),W(e.filteredNodes()),B(2),H(e.selectedNode()?6:-1)}}var lE={signal:`#a78bfa`,computed:`#60a5fa`,linkedSignal:`#34d399`,effect:`#fb923c`,template:`#94a3b8`,afterRenderEffectPhase:`#f472b6`,childSignalProp:`#c084fc`,"input (signal)":`#f59e0b`,"input.required (signal)":`#f59e0b`,"output (signal)":`#ec4899`,"model (signal)":`#14b8a6`,"model.required (signal)":`#14b8a6`,"viewChild (signal)":`#8b5cf6`,"viewChild.required (signal)":`#8b5cf6`,"viewChildren (signal)":`#8b5cf6`,"contentChild (signal)":`#6366f1`,"contentChild.required (signal)":`#6366f1`,"contentChildren (signal)":`#6366f1`,resource:`#06b6d4`,unknown:`#71717a`},uE=class e{rpc=o_(null);graph=L(null);sourceSignals=L([]);filter=L(``);selectedNode=L(null);kindLegend=Object.entries(lE).map(([e,t])=>({kind:e,color:t}));filteredNodes=Zg(()=>{let e=this.graph();if(!e)return[];let t=this.filter().toLowerCase();return t?e.nodes.filter(e=>(e.label??``).toLowerCase().includes(t)||e.kind.includes(t)):e.nodes});filteredSourceSignals=Zg(()=>{let e=this.filter().toLowerCase(),t=this.sourceSignals();return e?t.filter(t=>t.name.toLowerCase().includes(e)||t.kind.includes(e)||t.file.includes(e)):t});constructor(){Xs(()=>{let e=this.rpc();e&&(this.loadSignalGraph(e),this.loadSourceSignals(e))})}async loadSignalGraph(e){let t=await e.scope(`ng-devtools`).rpc.sharedState(`signal-graph`),n=t.value();n?.graph&&this.graph.set(n.graph),t.on(`updated`,e=>{e?.graph&&this.graph.set(e.graph)})}async loadSourceSignals(e){let t=e.scope(`ng-devtools`);try{let e=await t.rpc.call(`get-signals`);this.sourceSignals.set(e)}catch{}}selectNode(e){this.selectedNode.set(this.selectedNode()?.id===e.id?null:e)}kindColor(e){return lE[e]??lE.unknown}getDependencies(e){let t=this.graph();if(!t)return[];let n=t.nodes.findIndex(t=>t.id===e.id);return t.edges.filter(e=>e.consumer===n).map(e=>t.nodes[e.producer]).filter(Boolean)}getConsumers(e){let t=this.graph();if(!t)return[];let n=t.nodes.findIndex(t=>t.id===e.id);return t.edges.filter(e=>e.producer===n).map(e=>t.nodes[e.consumer]).filter(Boolean)}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-signal-inspector`]],inputs:{rpc:[1,`rpc`]},decls:7,vars:5,consts:[[1,`toolbar`],[`type`,`text`,`placeholder`,`Filter by name or kind…`,3,`input`,`value`],[1,`label`],[1,`empty`],[1,`muted`],[1,`hint`],[1,`source-label`],[1,`nodes`],[1,`node-card`],[1,`node-header`],[1,`kind-badge`],[1,`node-label`],[1,`node-meta`],[1,`legend`],[1,`legend-item`],[1,`node-card`,3,`selected`],[1,`detail-panel`],[1,`dot`],[1,`node-card`,3,`click`],[1,`watched-badge`],[1,`node-value`],[1,`kind-badge`,`sm`]],template:function(e,t){e&1&&(q(0,`div`,0)(1,`input`,1),Y(`input`,function(e){return t.filter.set(e.target.value)}),J(),q(2,`span`,2),Z(3),J()(),V(4,KT,5,0,`div`,3),V(5,YT,5,0),V(6,cE,7,1)),e&2&&(B(),Yh(`value`,t.filter()),B(2),$(`Component: `,t.graph()?.componentSelector??`—`),B(),H(!t.graph()&&t.sourceSignals().length===0?4:-1),B(),H(!t.graph()&&t.sourceSignals().length>0?5:-1),B(),H(t.graph()?6:-1))},dependencies:[S_],styles:[`.toolbar[_ngcontent-%COMP%] {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }
    input[_ngcontent-%COMP%] {
      flex: 1;
      padding: 8px 12px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 6px;
      color: #e4e4e7;
      font-size: 14px;
      outline: none;
    }
    input[_ngcontent-%COMP%]:focus {
      border-color: var(--%NS%accent);
    }
    .label[_ngcontent-%COMP%] {
      font-size: 13px;
      color: #71717a;
      white-space: nowrap;
    }
    .empty[_ngcontent-%COMP%] {
      text-align: center;
      padding: 48px 16px;
    }
    .muted[_ngcontent-%COMP%] {
      color: #71717a;
      font-size: 14px;
    }
    .hint[_ngcontent-%COMP%] {
      color: #52525b;
      font-size: 12px;
      margin-top: 8px;
    }
    .source-label[_ngcontent-%COMP%] {
      font-size: 13px;
      color: #71717a;
      margin-bottom: 12px;
    }
    .legend[_ngcontent-%COMP%] {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .legend-item[_ngcontent-%COMP%] {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #a1a1aa;
    }
    .dot[_ngcontent-%COMP%] {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .nodes[_ngcontent-%COMP%] {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .node-card[_ngcontent-%COMP%] {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 12px 16px;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .node-card[_ngcontent-%COMP%]:hover {
      border-color: #3f3f46;
    }
    .node-card.selected[_ngcontent-%COMP%] {
      border-color: var(--%NS%accent);
    }
    .node-header[_ngcontent-%COMP%] {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .kind-badge[_ngcontent-%COMP%] {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      color: #fff;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .kind-badge.sm[_ngcontent-%COMP%] {
      font-size: 10px;
      padding: 1px 5px;
    }
    .node-label[_ngcontent-%COMP%] {
      font-family: monospace;
      font-size: 14px;
      color: #e4e4e7;
    }
    .watched-badge[_ngcontent-%COMP%] {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 4px;
      background: #14532d;
      color: #4ade80;
    }
    .node-value[_ngcontent-%COMP%] {
      font-family: monospace;
      font-size: 12px;
      color: #a1a1aa;
      margin-top: 4px;
      max-height: 40px;
      overflow: hidden;
    }
    .node-meta[_ngcontent-%COMP%] {
      font-size: 11px;
      color: #52525b;
      margin-top: 4px;
    }
    .detail-panel[_ngcontent-%COMP%] {
      margin-top: 16px;
      padding: 16px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
    }
    .detail-panel[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
      font-family: monospace;
      color: var(--%NS%accent);
      margin-bottom: 12px;
    }
    .detail-panel[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {
      font-size: 12px;
      color: #71717a;
      margin: 12px 0 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    dl[_ngcontent-%COMP%] {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 4px 12px;
      font-size: 13px;
    }
    dt[_ngcontent-%COMP%] {
      color: #71717a;
    }
    dd[_ngcontent-%COMP%] {
      color: #e4e4e7;
    }
    pre[_ngcontent-%COMP%] {
      font-size: 12px;
      white-space: pre-wrap;
      margin: 0;
    }
    ul[_ngcontent-%COMP%] {
      list-style: none;
      padding: 0;
      font-size: 13px;
    }
    li[_ngcontent-%COMP%] {
      padding: 2px 0;
      color: #a1a1aa;
      display: flex;
      align-items: center;
      gap: 6px;
    }`]})},dE=(e,t)=>t.type,fE=(e,t)=>t.token+t.file+t.line,pE=(e,t)=>t.injector.id,mE=(e,t)=>t.node.injector.id,hE=(e,t)=>t.token;function gE(e,t){e&1&&(q(0,`div`,4)(1,`p`,5),Z(2,`No DI data found.`),J(),q(3,`p`,6),Z(4,` No providers, injectables, or inject() calls found. Runtime tree requires Angular 17+ with the overlay connected. `),J()())}function _E(e,t){if(e&1&&(q(0,`span`,14),Z(1),J()),e&2){let e=X().$implicit;B(),$(`providedIn: `,e.providedIn)}}function vE(e,t){if(e&1&&Z(0),e&2){let e=X().$implicit;$(` · as `,e.source,` `)}}function yE(e,t){if(e&1&&(q(0,`div`,11)(1,`div`,12)(2,`span`,13),Z(3),J(),V(4,_E,2,1,`span`,14),J(),q(5,`div`,15),Z(6),V(7,vE,1,1),J()()),e&2){let e=t.$implicit;B(3),Q(e.token),B(),H(e.providedIn?4:-1),B(2),Ng(` `,e.file,`:`,e.line,` `),B(),H(e.source!==`class`&&e.source!==`providers array`?7:-1)}}function bE(e,t){if(e&1&&(q(0,`div`,9)(1,`h3`),Z(2),J(),q(3,`div`,10),U(4,yE,8,5,`div`,11,fE),J()()),e&2){let e=t.$implicit;B(2),Ng(``,e.label,` (`,e.items.length,`)`),B(2),W(e.items)}}function xE(e,t){if(e&1&&(q(0,`p`,7),Z(1,`DI from source scan (static analysis):`),J(),q(2,`div`,8),U(3,bE,6,2,`div`,9,dE),J()),e&2){let e=X();B(3),W(e.groupedProviders())}}function SE(e,t){e&1&&Kh(0)}function CE(e,t){if(e&1&&(q(0,`span`,24),Z(1),J()),e&2){let e=X().$implicit;B(),$(``,e.node.injector.providerCount,` providers`)}}function wE(e,t){if(e&1){let e=Jh();q(0,`div`,21),Y(`click`,function(){let t=yo(e).$implicit;return bo(X(4).select(t.node))}),q(1,`span`,22),Z(2),J(),q(3,`span`,23),Z(4),J(),V(5,CE,2,1,`span`,24),J()}if(e&2){let e=t.$implicit,n=X(4);pg(`padding-left`,e.depth*24+12,`px`),mg(`selected`,n.selectedId()===e.node.injector.id),B(),pg(`background`,n.typeColor(e.node.injector.type)),B(),$(` `,e.node.injector.type,` `),B(2),Q(e.node.injector.name),B(),H(e.node.injector.providerCount>0?5:-1)}}function TE(e,t){if(e&1&&(q(0,`div`,19),U(1,wE,6,9,`div`,20,mE),J()),e&2){let e=X().$implicit,t=X(2);B(),W(t.flattenTree(e))}}function EE(e,t){e&1&&(um(0,SE,1,0,`ng-container`,18)(1,TE,3,0),hh(2,1),gh()),e&2&&Yh(`ngTemplateOutlet`,void 0)}function DE(e,t){e&1&&(q(0,`p`,5),Z(1,`No providers configured on this injector.`),J())}function OE(e,t){if(e&1&&(q(0,`tr`)(1,`td`,13),Z(2),J(),q(3,`td`),Z(4),J(),q(5,`td`),Z(6),J()()),e&2){let e=t.$implicit;B(2),Q(e.token),B(2),Q(e.type),B(2),Q(e.isViewProvider?`Yes`:`—`)}}function kE(e,t){if(e&1&&(q(0,`table`,26)(1,`thead`)(2,`tr`)(3,`th`),Z(4,`Token`),J(),q(5,`th`),Z(6,`Type`),J(),q(7,`th`),Z(8,`View`),J()()(),q(9,`tbody`),U(10,OE,7,3,`tr`,null,hE),J()()),e&2){let e=X(3);B(10),W(e.selectedInjector().providers)}}function AE(e,t){if(e&1&&(q(0,`aside`,17)(1,`div`,25)(2,`span`,22),Z(3),J(),q(4,`h3`),Z(5),J()(),V(6,DE,2,0,`p`,5)(7,kE,12,0,`table`,26),J()),e&2){let e=X(2);B(2),pg(`background`,e.typeColor(e.selectedInjector().injector.type)),B(),$(` `,e.selectedInjector().injector.type,` `),B(2),Q(e.selectedInjector().injector.name),B(),H(e.selectedInjector().providers.length===0?6:7)}}function jE(e,t){if(e&1&&(q(0,`div`,16),U(1,EE,4,1,null,null,pE),J(),V(3,AE,8,5,`aside`,17)),e&2){let e=X();B(),W(e.filteredRoots()),B(2),H(e.selectedInjector()?3:-1)}}var ME={element:`#60a5fa`,environment:`#34d399`,null:`#71717a`},NE=class e{rpc=o_(null);roots=L([]);sourceProviders=L([]);filter=L(``);hideEmpty=L(!1);selectedId=L(null);selectedInjector=Zg(()=>{let e=this.selectedId();return e?this.findNode(this.roots(),e):null});filteredRoots=Zg(()=>{let e=this.roots();this.hideEmpty()&&(e=this.filterEmpty(e));let t=this.filter().toLowerCase();return t&&(e=this.filterByQuery(e,t)),e});groupedProviders=Zg(()=>{let e=this.sourceProviders(),t=this.filter().toLowerCase(),n=t?e.filter(e=>e.token.toLowerCase().includes(t)||e.file.includes(t)):e,r=[{type:`root-provider`,label:`Root Providers (provide*)`,items:[]},{type:`injectable`,label:`Injectable Services`,items:[]},{type:`injection`,label:`inject() Calls`,items:[]},{type:`provider`,label:`Component Providers`,items:[]}];for(let e of n){let t=r.find(t=>t.type===e.type);t&&t.items.push(e)}return r.filter(e=>e.items.length>0)});constructor(){Xs(()=>{let e=this.rpc();e&&(this.loadInjectorTree(e),this.loadSourceProviders(e))})}async loadInjectorTree(e){let t=await e.scope(`ng-devtools`).rpc.sharedState(`injector-tree`),n=t.value();n?.roots?.length&&this.roots.set(n.roots),t.on(`updated`,e=>{e?.roots&&this.roots.set(e.roots)})}async loadSourceProviders(e){let t=e.scope(`ng-devtools`);try{let e=await t.rpc.call(`get-providers`);this.sourceProviders.set(e)}catch{}}select(e){this.selectedId.set(this.selectedId()===e.injector.id?null:e.injector.id)}typeColor(e){return ME[e]??ME.null}flattenTree(e){let t=[],n=(e,r)=>{t.push({node:e,depth:r});for(let t of e.children)n(t,r+1)};return n(e,0),t}findNode(e,t){for(let n of e){if(n.injector.id===t)return n;let e=this.findNode(n.children,t);if(e)return e}return null}filterEmpty(e){return e.map(e=>({...e,children:this.filterEmpty(e.children)})).filter(e=>e.injector.providerCount>0||e.children.length>0)}filterByQuery(e,t){return e.map(e=>({...e,children:this.filterByQuery(e.children,t)})).filter(e=>e.injector.name.toLowerCase().includes(t)||e.providers.some(e=>e.token.toLowerCase().includes(t))||e.children.length>0)}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-di-inspector`]],inputs:{rpc:[1,`rpc`]},decls:8,vars:5,consts:[[1,`toolbar`],[`type`,`text`,`placeholder`,`Filter by injector name or token…`,3,`input`,`value`],[1,`checkbox`],[`type`,`checkbox`,3,`change`,`checked`],[1,`empty`],[1,`muted`],[1,`hint`],[1,`source-label`],[1,`source-providers`],[1,`provider-group`],[1,`provider-list`],[1,`provider-card`],[1,`provider-header`],[1,`token`],[1,`provided-in`],[1,`provider-meta`],[1,`tree-container`],[1,`detail-panel`],[4,`ngTemplateOutlet`],[1,`injector-tree`],[1,`injector-row`,3,`selected`,`paddingLeft`],[1,`injector-row`,3,`click`],[1,`type-badge`],[1,`name`],[1,`provider-count`],[1,`detail-header`],[`role`,`table`]],template:function(e,t){e&1&&(q(0,`div`,0)(1,`input`,1),Y(`input`,function(e){return t.filter.set(e.target.value)}),J(),q(2,`label`,2)(3,`input`,3),Y(`change`,function(){return t.hideEmpty.set(!t.hideEmpty())}),J(),Z(4,` Hide empty injectors `),J()(),V(5,gE,5,0,`div`,4),V(6,xE,5,0),V(7,jE,4,1)),e&2&&(B(),Yh(`value`,t.filter()),B(2),Yh(`checked`,t.hideEmpty()),B(2),H(t.roots().length===0&&t.sourceProviders().length===0?5:-1),B(),H(t.roots().length===0&&t.sourceProviders().length>0?6:-1),B(),H(t.roots().length>0?7:-1))},styles:[`.toolbar[_ngcontent-%COMP%] {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }
    input[type='text'][_ngcontent-%COMP%] {
      flex: 1;
      padding: 8px 12px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 6px;
      color: #e4e4e7;
      font-size: 14px;
      outline: none;
    }
    input[type='text'][_ngcontent-%COMP%]:focus {
      border-color: var(--%NS%accent);
    }
    .checkbox[_ngcontent-%COMP%] {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #a1a1aa;
      white-space: nowrap;
      cursor: pointer;
    }
    .empty[_ngcontent-%COMP%] {
      text-align: center;
      padding: 48px 16px;
    }
    .muted[_ngcontent-%COMP%] {
      color: #71717a;
      font-size: 14px;
    }
    .hint[_ngcontent-%COMP%] {
      color: #52525b;
      font-size: 12px;
      margin-top: 8px;
    }
    .tree-container[_ngcontent-%COMP%] {
      display: flex;
      flex-direction: column;
    }
    .injector-row[_ngcontent-%COMP%] {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid #1e1e22;
      transition: background 0.1s;
    }
    .injector-row[_ngcontent-%COMP%]:hover {
      background: #18181b;
    }
    .injector-row.selected[_ngcontent-%COMP%] {
      background: color-mix(in srgb, var(--%NS%accent) 22%, transparent);
      border-color: var(--%NS%accent);
    }
    .type-badge[_ngcontent-%COMP%] {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      color: #fff;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .name[_ngcontent-%COMP%] {
      font-family: monospace;
      font-size: 13px;
      color: #e4e4e7;
    }
    .provider-count[_ngcontent-%COMP%] {
      font-size: 11px;
      color: #71717a;
      margin-left: auto;
    }
    .detail-panel[_ngcontent-%COMP%] {
      margin-top: 16px;
      padding: 16px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
    }
    .detail-header[_ngcontent-%COMP%] {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .detail-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
      font-family: monospace;
      color: #e4e4e7;
      margin: 0;
    }
    table[_ngcontent-%COMP%] {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th[_ngcontent-%COMP%] {
      text-align: left;
      padding: 6px 10px;
      background: #0f0f11;
      color: #71717a;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #27272a;
    }
    td[_ngcontent-%COMP%] {
      padding: 8px 10px;
      border-bottom: 1px solid #1e1e22;
    }
    .token[_ngcontent-%COMP%] {
      font-family: monospace;
      color: var(--%NS%accent);
    }
    .source-label[_ngcontent-%COMP%] {
      font-size: 13px;
      color: #71717a;
      margin-bottom: 12px;
    }
    .source-providers[_ngcontent-%COMP%] {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .provider-group[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
      font-size: 13px;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .provider-list[_ngcontent-%COMP%] {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .provider-card[_ngcontent-%COMP%] {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 10px 14px;
    }
    .provider-header[_ngcontent-%COMP%] {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .provider-header[_ngcontent-%COMP%]   .token[_ngcontent-%COMP%] {
      font-size: 14px;
      font-weight: 500;
    }
    .provided-in[_ngcontent-%COMP%] {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 4px;
      background: #14532d;
      color: #4ade80;
    }
    .provider-meta[_ngcontent-%COMP%] {
      font-size: 11px;
      color: #52525b;
      margin-top: 4px;
    }`]})},PE=(e,t)=>t.kind,FE=(e,t)=>t.name+t.file+t.line;function IE(e,t){e&1&&Vh(0,`span`,4)}function LE(e,t){e&1&&(q(0,`div`,5)(1,`p`,6),Z(2,`No NgRx store patterns found.`),J(),q(3,`p`,7),Z(4,` No createAction, createReducer, createEffect, createSelector, or createFeature calls found in source. Make sure your app uses @ngrx/store. `),J()())}function RE(e,t){if(e&1&&(q(0,`span`,9),Vh(1,`span`,14),Z(2),J()),e&2){let e=t.$implicit;B(),pg(`background`,e.color),B(),$(` `,e.kind,` `)}}function zE(e,t){if(e&1&&(q(0,`span`,15),Z(1),J()),e&2){let e=t.$implicit;pg(`border-color`,X(3).kindColor(e.kind)),B(),Pg(` `,e.count,` `,e.kind,``,e.count===1?``:`s`,` `)}}function BE(e,t){if(e&1&&Z(0),e&2){let e=X().$implicit;$(` · `,e.detail,` `)}}function VE(e,t){if(e&1&&(q(0,`div`,13)(1,`div`,16)(2,`span`,17),Z(3),J(),q(4,`span`,18),Z(5),J()(),q(6,`div`,19),Z(7),V(8,BE,1,1),J()()),e&2){let e=t.$implicit,n=X(3);B(2),pg(`background`,n.kindColor(e.kind)),B(),$(` `,e.kind,` `),B(2),Q(e.name),B(2),Ng(` `,e.file,`:`,e.line,` `),B(),H(e.detail?8:-1)}}function HE(e,t){if(e&1&&(q(0,`div`,8),U(1,RE,3,3,`span`,9,PE),J(),q(3,`div`,10),U(4,zE,2,5,`span`,11,PE),J(),q(6,`div`,12),U(7,VE,9,7,`div`,13,FE),J()),e&2){let e=X(2);B(),W(e.kindLegend),B(3),W(e.groupedEntries()),B(3),W(e.filteredEntries())}}function UE(e,t){e&1&&V(0,LE,5,0,`div`,5)(1,HE,9,0),e&2&&H(X().sourceEntries().length===0?0:1)}function WE(e,t){e&1&&(q(0,`div`,5)(1,`p`,6),Z(2,`No NgRx store connection detected.`),J(),q(3,`p`,7),Z(4,` Runtime inspection requires @ngrx/store-devtools to be configured in your app. The store devtools use the Redux DevTools protocol to expose state. `),J()())}function GE(e,t){if(e&1){let e=Jh();q(0,`div`,28),Y(`click`,function(){let t=yo(e).$implicit;return bo(X(3).selectedAction.set(t))}),q(1,`div`,29),Z(2),J(),q(3,`div`,30),Z(4),J()()}if(e&2){let e=t.$implicit,n=X(3);mg(`selected`,n.selectedAction()===e),B(2),Q(e.type),B(2),Q(n.formatTime(e.timestamp))}}function KE(e,t){e&1&&(q(0,`p`,6),Z(1,`No actions dispatched yet.`),J())}function qE(e,t){if(e&1&&(q(0,`dt`),Z(1,`Payload`),J(),q(2,`dd`)(3,`pre`),Z(4),Vg(5,`json`),J()()),e&2){let e=X(4);B(4),Q(Ug(5,1,e.selectedAction().payload))}}function JE(e,t){if(e&1&&(q(0,`aside`,27)(1,`h3`),Z(2),J(),q(3,`dl`)(4,`dt`),Z(5,`Type`),J(),q(6,`dd`),Z(7),J(),q(8,`dt`),Z(9,`Time`),J(),q(10,`dd`),Z(11),J(),V(12,qE,6,3),J()()),e&2){let e=X(3);B(2),Q(e.selectedAction().type),B(5),Q(e.selectedAction().type),B(4),Q(e.formatTime(e.selectedAction().timestamp)),B(),H(e.selectedAction().payload===void 0?-1:12)}}function YE(e,t){if(e&1&&(q(0,`div`,20)(1,`section`,21)(2,`h3`),Z(3,`Current State`),J(),q(4,`pre`,22),Z(5),Vg(6,`json`),J()(),q(7,`section`,23)(8,`h3`),Z(9,` Recent Actions `),q(10,`span`,24),Z(11),J()(),q(12,`div`,25),U(13,GE,5,4,`div`,26,Dh,!1,KE,2,0,`p`,6),J()()(),V(16,JE,13,4,`aside`,27)),e&2){let e=X(2);B(5),Q(Ug(6,4,e.runtimeState()?.state)),B(6),Q(e.filteredActions().length),B(2),W(e.filteredActions()),B(3),H(e.selectedAction()?16:-1)}}function XE(e,t){e&1&&V(0,WE,5,0,`div`,5)(1,YE,17,6),e&2&&H(+!!X().runtimeState()?.connected)}var ZE={action:`#f59e0b`,reducer:`#a78bfa`,effect:`#fb923c`,selector:`#60a5fa`,feature:`#34d399`,"store-setup":`#94a3b8`,"signal-store":`#e879f9`,"signal-state":`#22d3ee`,"signal-method":`#fb7185`},QE=class e{rpc=o_(null);filter=L(``);mode=L(`source`);sourceEntries=L([]);runtimeState=L(null);selectedAction=L(null);kindLegend=Object.entries(ZE).map(([e,t])=>({kind:e,color:t}));filteredEntries=Zg(()=>{let e=this.filter().toLowerCase();return this.sourceEntries().filter(t=>t.name.toLowerCase().includes(e)||t.kind.toLowerCase().includes(e))});groupedEntries=Zg(()=>{let e=this.sourceEntries(),t=new Map;for(let n of e)t.set(n.kind,(t.get(n.kind)??0)+1);return[...t.entries()].map(([e,t])=>({kind:e,count:t}))});filteredActions=Zg(()=>{let e=this.filter().toLowerCase(),t=[...this.runtimeState()?.actions??[]].reverse();return e?t.filter(t=>t.type.toLowerCase().includes(e)):t});constructor(){Xs(()=>{let e=this.rpc();if(!e)return;let t=e.scope(`ng-devtools`);t.rpc.call(`get-ngrx-store`).then(e=>{this.sourceEntries.set(e),e.length===0&&this.mode.set(`runtime`)}).catch(()=>this.sourceEntries.set([])),t.rpc.sharedState(`ngrx-store`).then(e=>{e?.subscribe&&e.subscribe(e=>this.runtimeState.set(e))})})}kindColor(e){return ZE[e]??`#71717a`}formatTime(e){return new Date(e).toLocaleTimeString()}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-store-inspector`]],inputs:{rpc:[1,`rpc`]},decls:10,vars:8,consts:[[1,`toolbar`],[`type`,`text`,`placeholder`,`Filter by name or kind…`,3,`input`,`value`],[1,`toggle-group`],[3,`click`],[1,`live-dot`],[1,`empty`],[1,`muted`],[1,`hint`],[1,`legend`],[1,`legend-item`],[1,`summary`],[1,`summary-badge`,3,`border-color`],[1,`nodes`],[1,`node-card`],[1,`dot`],[1,`summary-badge`],[1,`node-header`],[1,`kind-badge`],[1,`node-label`],[1,`node-meta`],[1,`runtime-layout`],[1,`state-panel`],[1,`state-tree`],[1,`actions-panel`],[1,`action-count`],[1,`action-list`],[1,`action-card`,3,`selected`],[1,`detail-panel`],[1,`action-card`,3,`click`],[1,`action-type`],[1,`action-time`]],template:function(e,t){e&1&&(q(0,`div`,0)(1,`input`,1),Y(`input`,function(e){return t.filter.set(e.target.value)}),J(),q(2,`div`,2)(3,`button`,3),Y(`click`,function(){return t.mode.set(`source`)}),Z(4,`Source`),J(),q(5,`button`,3),Y(`click`,function(){return t.mode.set(`runtime`)}),Z(6,` Runtime `),V(7,IE,1,0,`span`,4),J()()(),V(8,UE,2,1),V(9,XE,2,1)),e&2&&(B(),Yh(`value`,t.filter()),B(2),mg(`active`,t.mode()===`source`),B(2),mg(`active`,t.mode()===`runtime`),B(2),H(t.runtimeState()?.connected?7:-1),B(),H(t.mode()===`source`?8:-1),B(),H(t.mode()===`runtime`?9:-1))},dependencies:[S_],styles:[`.toolbar[_ngcontent-%COMP%] {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }
    input[_ngcontent-%COMP%] {
      flex: 1;
      padding: 8px 12px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 6px;
      color: #e4e4e7;
      font-size: 14px;
      outline: none;
    }
    input[_ngcontent-%COMP%]:focus {
      border-color: var(--%NS%accent);
    }
    .toggle-group[_ngcontent-%COMP%] {
      display: flex;
      border: 1px solid #27272a;
      border-radius: 6px;
      overflow: hidden;
    }
    .toggle-group[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {
      padding: 6px 14px;
      border: none;
      background: transparent;
      color: #a1a1aa;
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .toggle-group[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {
      background: #3f3f46;
      color: #fff;
    }
    .live-dot[_ngcontent-%COMP%] {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
      animation: _ngcontent-%COMP%_pulse 2s infinite;
    }
    @keyframes _ngcontent-%COMP%_pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.4;
      }
    }
    .empty[_ngcontent-%COMP%] {
      text-align: center;
      padding: 48px 16px;
    }
    .muted[_ngcontent-%COMP%] {
      color: #71717a;
      font-size: 14px;
    }
    .hint[_ngcontent-%COMP%] {
      color: #52525b;
      font-size: 12px;
      margin-top: 8px;
    }
    .legend[_ngcontent-%COMP%] {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .legend-item[_ngcontent-%COMP%] {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #a1a1aa;
    }
    .dot[_ngcontent-%COMP%] {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .summary[_ngcontent-%COMP%] {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .summary-badge[_ngcontent-%COMP%] {
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 99px;
      border: 1px solid;
      color: #e4e4e7;
    }
    .nodes[_ngcontent-%COMP%] {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .node-card[_ngcontent-%COMP%] {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 12px 16px;
      transition: border-color 0.15s;
    }
    .node-card[_ngcontent-%COMP%]:hover {
      border-color: #3f3f46;
    }
    .node-header[_ngcontent-%COMP%] {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .kind-badge[_ngcontent-%COMP%] {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      color: #fff;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .node-label[_ngcontent-%COMP%] {
      font-family: monospace;
      font-size: 14px;
      color: #e4e4e7;
    }
    .node-meta[_ngcontent-%COMP%] {
      font-size: 12px;
      color: #71717a;
      margin-top: 4px;
    }
    .runtime-layout[_ngcontent-%COMP%] {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .state-panel[_ngcontent-%COMP%], 
   .actions-panel[_ngcontent-%COMP%] {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 10px;
      padding: 16px;
    }
    h3[_ngcontent-%COMP%] {
      font-size: 13px;
      text-transform: uppercase;
      color: #71717a;
      margin-bottom: 12px;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .action-count[_ngcontent-%COMP%] {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 99px;
      background: #3f3f46;
      color: #a1a1aa;
    }
    .state-tree[_ngcontent-%COMP%] {
      font-family: monospace;
      font-size: 12px;
      color: #a1a1aa;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 500px;
      overflow: auto;
    }
    .action-list[_ngcontent-%COMP%] {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 500px;
      overflow: auto;
    }
    .action-card[_ngcontent-%COMP%] {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 6px;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .action-card[_ngcontent-%COMP%]:hover {
      border-color: #3f3f46;
    }
    .action-card.selected[_ngcontent-%COMP%] {
      border-color: var(--%NS%accent);
    }
    .action-type[_ngcontent-%COMP%] {
      font-family: monospace;
      font-size: 13px;
      color: #e4e4e7;
    }
    .action-time[_ngcontent-%COMP%] {
      font-size: 11px;
      color: #71717a;
    }
    .detail-panel[_ngcontent-%COMP%] {
      margin-top: 16px;
      background: #18181b;
      border: 1px solid var(--%NS%accent);
      border-radius: 10px;
      padding: 16px;
    }
    dl[_ngcontent-%COMP%] {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 6px 12px;
      font-size: 14px;
    }
    dt[_ngcontent-%COMP%] {
      color: #a1a1aa;
    }
    dd[_ngcontent-%COMP%] {
      color: #e4e4e7;
    }
    pre[_ngcontent-%COMP%] {
      font-family: monospace;
      font-size: 12px;
      white-space: pre-wrap;
      word-break: break-all;
    }`]})},$E=()=>[],eD=(e,t)=>t.id,tD=(e,t)=>t.node.path,nD=(e,t)=>t.formId+`#`+t.seq;function rD(e,t){e&1&&(q(0,`p`,0),Z(1,`Connecting…`),J())}function iD(e,t){e&1&&(q(0,`p`,0),Z(1,`Could not load forms from the devtools server. Reload to try again.`),J())}function aD(e,t){e&1&&(q(0,`p`,0),Z(1,`Loading forms…`),J())}function oD(e,t){e&1&&(q(0,`div`,0)(1,`p`),Z(2,`No forms on the page yet.`),J(),q(3,`p`,2),Z(4,` Open a page that renders a form. Signal Forms, reactive and template-driven forms all show up here, in development builds. `),J()())}function sD(e,t){e&1&&(q(0,`span`,10),Z(1),q(2,`span`,9),Z(3,` errors`),J()()),e&2&&(B(),Q(t))}function cD(e,t){if(e&1){let e=Jh();q(0,`li`)(1,`button`,5),Y(`click`,function(){let t=yo(e).$implicit;return bo(X(2).selectForm(t.id))}),Vh(2,`span`,6),q(3,`span`,7),Z(4),J(),q(5,`span`,8),Z(6),q(7,`span`,9),Z(8),J()(),V(9,sD,4,1,`span`,10),J()()}if(e&2){let e,n=t.$implicit,r=X(2);B(),mg(`active`,n.id===r.selected()?.id),_h(`aria-current`,n.id===r.selected()?.id?`true`:null),B(),_h(`data-status`,n.root.status),B(2),Q(n.label),B(2),Ng(``,r.kindLabel(n.kind),` · `,n.id,` `),B(2),$(`, `,n.root.status),B(),H((e=r.counts().get(n.id)?.errors)?9:-1,e)}}function lD(e,t){if(e&1&&(q(0,`span`),Z(1),J()),e&2){let e=X();B(),Q(e.submitted?`submitted`:`not submitted`)}}function uD(e,t){e&1&&(q(0,`span`),Z(1,`submitting`),J())}function dD(e,t){if(e&1&&(q(0,`div`,2),Z(1,` resets to `),q(2,`code`),Z(3),Vg(4,`json`),J()()),e&2){let e=X(2).$implicit;B(3),Q(Ug(4,1,e.node.defaultValue))}}function fD(e,t){if(e&1&&(q(0,`code`),Z(1),Vg(2,`json`),J(),V(3,dD,5,3,`div`,2)),e&2){let e=X().$implicit;B(),Q(Ug(2,2,e.node.value)),B(2),H(e.node.defaultValue===void 0?-1:3)}}function pD(e,t){e&1&&(q(0,`span`,2),Z(1,`not created yet`),J())}function mD(e,t){if(e&1&&(q(0,`span`,12),Z(1),J()),e&2){let e=X().$implicit;_h(`data-status`,e.node.status),B(),Q(e.node.status)}}function hD(e,t){e&1&&(q(0,`span`),Z(1,`touched`),J())}function gD(e,t){e&1&&(q(0,`span`),Z(1,`dirty`),J())}function _D(e,t){e&1&&(q(0,`span`),Z(1,`required`),J())}function vD(e,t){e&1&&(q(0,`span`),Z(1,`readonly`),J())}function yD(e,t){e&1&&(q(0,`span`),Z(1,`hidden`),J())}function bD(e,t){if(e&1&&(q(0,`span`),Z(1),J()),e&2){let e=X().$implicit;B(),$(`updates on `,e.node.updateOn)}}function xD(e,t){e&1&&(q(0,`span`),Z(1,`debouncing`),J())}function SD(e,t){e&1&&(q(0,`span`),Z(1,`validators`),J())}function CD(e,t){e&1&&(q(0,`span`),Z(1,`async validator`),J())}function wD(e,t){if(e&1&&(q(0,`span`),Z(1),J()),e&2){let e=t.$implicit;B(),Q(e)}}function TD(e,t){if(e&1&&(q(0,`span`),Z(1),J()),e&2){let e=X().$implicit;B(),Q(e.node.accessor)}}function ED(e,t){if(e&1&&(q(0,`span`),Z(1),J()),e&2){let e=t.$implicit;B(),$(`disabled: `,e)}}function DD(e,t){if(e&1&&(q(0,`div`),Z(1),q(2,`code`,25),Z(3),J()()),e&2){let e=t.$implicit,n=X().$implicit,r=X(3);B(),$(` `,r.errorText(n.node,e),` `),B(2),Q(e.kind)}}function OD(e,t){if(e&1&&(q(0,`tr`)(1,`td`,26),Z(2),J()()),e&2){let e=X().$implicit;B(),pg(`padding-left`,24+e.depth*16,`px`),B(),Ng(` `,e.node.truncated,` more fields under `,e.node.path||`the form`,` not shown `)}}function kD(e,t){if(e&1){let e=Jh();q(0,`tr`,18),Y(`mouseenter`,function(){let t=yo(e).$implicit,n=X();return bo(X(2).highlight(n.id,t.node.path))})(`mouseleave`,function(){return yo(e),bo(X(3).highlight(null,``))}),q(1,`th`,19)(2,`button`,20),Y(`focus`,function(){let t=yo(e).$implicit,n=X();return bo(X(2).highlight(n.id,t.node.path))})(`blur`,function(){return yo(e),bo(X(3).highlight(null,``))}),Z(3),J(),q(4,`span`,21),Z(5),J()(),q(6,`td`,22),V(7,fD,4,4),J(),q(8,`td`),V(9,pD,2,0,`span`,2)(10,mD,2,2,`span`,12),J(),q(11,`td`,23),V(12,hD,2,0,`span`),V(13,gD,2,0,`span`),V(14,_D,2,0,`span`),V(15,vD,2,0,`span`),V(16,yD,2,0,`span`),V(17,bD,2,1,`span`),V(18,xD,2,0,`span`),V(19,SD,2,0,`span`),V(20,CD,2,0,`span`),U(21,wD,2,1,`span`,null,Oh),V(23,TD,2,1,`span`),U(24,ED,2,1,`span`,null,Dh),J(),q(26,`td`,24),U(27,DD,4,2,`div`,null,Dh),J()(),V(29,OD,3,4,`tr`)}if(e&2){let e=t.$implicit,n=X(3);mg(`invalid`,e.node.errors.length),B(),pg(`padding-left`,8+e.depth*16,`px`),B(),_h(`aria-label`,`Highlight `+(e.node.path||`the form`)+` on the page`),B(),$(` `,e.node.key||`(form)`,` `),B(2),Q(e.node.type),B(2),H(e.node.type===`control`?7:-1),B(2),H(e.node.materialized===!1?9:10),B(3),H(e.node.touched?12:-1),B(),H(e.node.dirty?13:-1),B(),H(e.node.required?14:-1),B(),H(e.node.readonly?15:-1),B(),H(e.node.hidden?16:-1),B(),H(e.node.updateOn?17:-1),B(),H(e.node.debouncing?18:-1),B(),H(e.node.validators?.sync?19:-1),B(),H(e.node.validators?.async?20:-1),B(),W(n.constraintList(e.node)),B(2),H(e.node.accessor?23:-1),B(),W(e.node.disabledReasons??Ig(20,$E)),B(3),W(e.node.errors),B(2),H(e.node.truncated?29:-1)}}function AD(e,t){if(e&1&&(q(0,`tr`)(1,`td`,26),Z(2),J()()),e&2){let e=X(3);B(2),$(`No field path matches "`,e.filter(),`".`)}}function jD(e,t){if(e&1&&(q(0,`span`,2),Z(1),J()),e&2){let e=X().$implicit;B(),Q(e.detail)}}function MD(e,t){if(e&1&&(q(0,`li`)(1,`time`),Z(2),J(),q(3,`code`),Z(4),J(),q(5,`span`,27),Z(6),J(),V(7,jD,2,1,`span`,2),J()),e&2){let e=t.$implicit,n=X(4);B(2),Q(n.time(e.timestamp)),B(2),Q(e.path||`(form)`),B(2),Q(e.type),B(),H(e.detail?7:-1)}}function ND(e,t){if(e&1&&(q(0,`ol`,17),U(1,MD,8,4,`li`,null,nD),J()),e&2){let e=X(3);B(),W(e.selectedEvents())}}function PD(e,t){e&1&&(q(0,`p`,2),Z(1,`No changes yet. Type into the form to see them here.`),J())}function FD(e,t){if(e&1){let e=Jh();q(0,`section`,4)(1,`div`,11)(2,`span`,12),Z(3),J(),q(4,`span`),Z(5),J(),q(6,`span`),Z(7),J(),V(8,lD,2,1,`span`),V(9,uD,2,0,`span`),q(10,`span`,2),Z(11),J()(),q(12,`input`,13),Y(`input`,function(t){return yo(e),bo(X(2).onFilter(t))}),J(),q(13,`div`,14)(14,`table`,15)(15,`thead`)(16,`tr`)(17,`th`,16),Z(18,`Field`),J(),q(19,`th`,16),Z(20,`Value`),J(),q(21,`th`,16),Z(22,`Status`),J(),q(23,`th`,16),Z(24,`State`),J(),q(25,`th`,16),Z(26,`Errors`),J()()(),q(27,`tbody`),U(28,kD,30,21,null,null,tD,!1,AD,3,1,`tr`),J()()(),q(31,`h2`),Z(32,`Recent changes`),J(),V(33,ND,3,0,`ol`,17)(34,PD,2,0,`p`,2),J()}if(e&2){let e=t,n=X(2);_h(`aria-label`,e.label),B(2),_h(`data-status`,e.root.status),B(),Q(e.root.status),B(2),Q(e.root.dirty?`dirty`:`pristine`),B(2),Q(e.root.touched?`touched`:`untouched`),B(),H(e.submitted===void 0?-1:8),B(),H(e.root.submitting?9:-1),B(2),Ng(``,n.counts().get(e.id)?.fields,` fields, `,n.counts().get(e.id)?.errors,` errors`),B(),Yh(`value`,n.filter()),B(16),W(n.rows()),B(5),H(n.selectedEvents().length?33:34)}}function ID(e,t){if(e&1&&(q(0,`div`,1)(1,`ul`,3),U(2,cD,10,9,`li`,null,eD),J(),V(4,FD,35,12,`section`,4),J()),e&2){let e,t=X();B(2),W(t.forms()),B(2),H((e=t.selected())?4:-1,e)}}var LD={signal:`Signal Forms`,reactive:`Reactive`,template:`Template-driven`};function RD(e){return e.errors.length+(e.children??[]).reduce((e,t)=>e+RD(t),0)}function zD(e){return 1+(e.children??[]).reduce((e,t)=>e+zD(t),0)}var BD=class e{rpc=o_(null);forms=L([]);events=L([]);loading=L(!0);failed=L(!1);selectedId=L(null);filter=L(``);unsubscribe=null;destroyRef=P(ls);counts=Zg(()=>new Map(this.forms().map(e=>[e.id,{fields:zD(e.root),errors:RD(e.root)}])));selected=Zg(()=>{let e=this.forms();return e.find(e=>e.id===this.selectedId())??e[0]??null});rows=Zg(()=>{let e=this.selected();if(!e)return[];let t=this.filter().toLowerCase(),n=[],r=(e,i)=>{let a=n.length,o=!t||e.path.toLowerCase().includes(t);for(let t of e.children??[])o=r(t,i+1)||o;return o&&n.splice(a,0,{node:e,depth:i}),o};return r(e.root,0),n});selectedEvents=Zg(()=>{let e=this.selected()?.id;return this.events().filter(t=>t.formId===e).slice(-50).reverse()});constructor(){Xs(()=>{let e=this.rpc();e&&this.load(e)}),this.destroyRef.onDestroy(()=>{this.unsubscribe?.(),this.highlight(null,``)})}async load(e){this.loading.set(!0),this.failed.set(!1);try{let t=await e.scope(`ng-devtools`).rpc.sharedState(`forms`);if(this.destroyRef.destroyed)return;let n=e=>{let t=e;this.forms.set(t?.forms??[]),this.events.set(t?.events??[])};n(t.value()),this.unsubscribe?.(),this.unsubscribe=t.on(`updated`,n)}catch{this.failed.set(!0)}finally{this.loading.set(!1)}}selectForm(e){this.selectedId.set(e),this.filter.set(``)}onFilter(e){this.filter.set(e.target.value)}highlight(e,t){let n=this.rpc();n&&n.scope(`ng-devtools`).rpc.callEvent(`request-form-highlight`,e?{formId:e,path:t}:null)}kindLabel(e){return LD[e]}constraintList(e){return Object.entries(e.constraints??{}).map(([e,t])=>`${e} ${t}`)}errorText(e,t){return/^[a-z]/.test(t.message)?`${e.key||`The form`} ${t.message}`:t.message}time(e){return new Date(e).toLocaleTimeString()}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-forms-inspector`]],inputs:{rpc:[1,`rpc`]},decls:5,vars:1,consts:[[1,`empty`],[1,`layout`],[1,`muted`],[`aria-label`,`Forms on the page`,1,`form-list`],[1,`detail`],[`type`,`button`,1,`form-item`,3,`click`],[`aria-hidden`,`true`,1,`dot`],[1,`label`],[1,`kind`],[1,`sr-only`],[1,`count`],[1,`summary`],[1,`badge`],[`type`,`search`,`placeholder`,`Filter fields by path`,`aria-label`,`Filter fields by path`,1,`filter`,3,`input`,`value`],[`role`,`region`,`aria-label`,`Fields`,`tabindex`,`0`,1,`table-scroll`],[1,`fields`],[`scope`,`col`],[1,`events`],[3,`mouseenter`,`mouseleave`],[`scope`,`row`],[`type`,`button`,1,`field`,3,`focus`,`blur`],[1,`type`],[1,`value`],[1,`flags`],[1,`errors`],[1,`kind-tag`],[`colspan`,`5`,1,`muted`],[1,`event-type`]],template:function(e,t){e&1&&V(0,rD,2,0,`p`,0)(1,iD,2,0,`p`,0)(2,aD,2,0,`p`,0)(3,oD,5,0,`div`,0)(4,ID,5,1,`div`,1),e&2&&H(t.rpc()?t.failed()?1:t.loading()?2:t.forms().length?4:3:0)},dependencies:[S_],styles:[`.layout[_ngcontent-%COMP%] {
      display: grid;
      grid-template-columns: minmax(200px, 260px) minmax(0, 1fr);
      gap: 16px;
    }
    @media (max-width: 720px) {
      .layout[_ngcontent-%COMP%] {
        grid-template-columns: 1fr;
      }
    }
    .form-list[_ngcontent-%COMP%] {
      display: grid;
      gap: 4px;
      align-content: start;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .form-item[_ngcontent-%COMP%] {
      width: 100%;
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-areas: 'dot label count' '. kind kind';
      gap: 2px 8px;
      align-items: center;
      padding: 8px 10px;
      border: 1px solid #27272a;
      border-radius: 6px;
      background: transparent;
      color: #e4e4e7;
      text-align: left;
      cursor: pointer;
    }
    .form-item.active[_ngcontent-%COMP%] {
      border-color: var(--%NS%accent);
      background: #18181b;
    }
    .form-item[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {
      grid-area: dot;
    }
    .form-item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {
      grid-area: label;
      overflow-wrap: anywhere;
      font-size: 13px;
    }
    .form-item[_ngcontent-%COMP%]   .kind[_ngcontent-%COMP%] {
      grid-area: kind;
      color: #a1a1aa;
      font-size: 12px;
    }
    .form-item[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%] {
      grid-area: count;
      padding: 0 6px;
      border-radius: 999px;
      background: #7f1d1d;
      color: #fecaca;
      font-size: 12px;
    }
    .dot[_ngcontent-%COMP%] {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
    }
    .dot[data-status='INVALID'][_ngcontent-%COMP%] {
      background: #ef4444;
    }
    .dot[data-status='PENDING'][_ngcontent-%COMP%] {
      background: #eab308;
    }
    .dot[data-status='DISABLED'][_ngcontent-%COMP%] {
      background: #71717a;
    }
    .detail[_ngcontent-%COMP%] {
      display: grid;
      gap: 12px;
      min-width: 0;
    }
    .summary[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
      align-items: center;
      color: #d4d4d8;
      font-size: 13px;
    }
    .badge[_ngcontent-%COMP%] {
      padding: 1px 6px;
      border-radius: 4px;
      background: #14532d;
      color: #bbf7d0;
      font-size: 11px;
      font-weight: 600;
    }
    .badge[data-status='INVALID'][_ngcontent-%COMP%] {
      background: #7f1d1d;
      color: #fecaca;
    }
    .badge[data-status='PENDING'][_ngcontent-%COMP%] {
      background: #713f12;
      color: #fef08a;
    }
    .badge[data-status='DISABLED'][_ngcontent-%COMP%] {
      background: #3f3f46;
      color: #e4e4e7;
    }
    .filter[_ngcontent-%COMP%] {
      padding: 8px 12px;
      background: #18181b;
      border: 1px solid #52525b;
      border-radius: 6px;
      color: #e4e4e7;
      font-size: 14px;
    }
    .filter[_ngcontent-%COMP%]:focus-visible, 
   .form-item[_ngcontent-%COMP%]:focus-visible {
      outline: 2px solid var(--%NS%accent);
      outline-offset: 2px;
    }
    .table-scroll[_ngcontent-%COMP%] {
      overflow-x: auto;
    }
    .table-scroll[_ngcontent-%COMP%]:focus-visible, 
   .field[_ngcontent-%COMP%]:focus-visible {
      outline: 2px solid var(--%NS%accent);
      outline-offset: 2px;
    }
    .field[_ngcontent-%COMP%] {
      padding: 0;
      border: none;
      background: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .sr-only[_ngcontent-%COMP%] {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    .fields[_ngcontent-%COMP%] {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .fields[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], 
   .fields[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {
      padding: 6px 8px;
      border-bottom: 1px solid #27272a;
      text-align: left;
      vertical-align: top;
    }
    .fields[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {
      color: #a1a1aa;
      font-weight: 500;
    }
    .fields[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {
      color: #e4e4e7;
      font-weight: 500;
      white-space: nowrap;
    }
    .fields[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {
      background: #18181b;
    }
    .type[_ngcontent-%COMP%] {
      margin-left: 6px;
      color: #a1a1aa;
      font-size: 11px;
      font-weight: 400;
    }
    .value[_ngcontent-%COMP%]   code[_ngcontent-%COMP%], 
   .errors[_ngcontent-%COMP%]   code[_ngcontent-%COMP%], 
   .events[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {
      color: #c4b5fd;
      overflow-wrap: anywhere;
    }
    .flags[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
      display: inline-block;
      margin: 0 4px 2px 0;
      padding: 0 5px;
      border: 1px solid #3f3f46;
      border-radius: 4px;
      color: #d4d4d8;
      font-size: 11px;
    }
    .errors[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {
      color: #fca5a5;
    }
    .kind-tag[_ngcontent-%COMP%] {
      margin-left: 6px;
      color: #a1a1aa;
      font-size: 11px;
    }
    h2[_ngcontent-%COMP%] {
      margin: 8px 0 0;
      color: #d4d4d8;
      font-size: 14px;
    }
    .events[_ngcontent-%COMP%] {
      display: grid;
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 13px;
    }
    .events[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      color: #d4d4d8;
    }
    .events[_ngcontent-%COMP%]   time[_ngcontent-%COMP%] {
      color: #a1a1aa;
      font-variant-numeric: tabular-nums;
    }
    .event-type[_ngcontent-%COMP%] {
      color: #93c5fd;
    }
    .muted[_ngcontent-%COMP%] {
      color: #a1a1aa;
    }
    .empty[_ngcontent-%COMP%] {
      padding: 32px;
      text-align: center;
      color: #d4d4d8;
    }`]})},VD=(e,t)=>t.id;function HD(e,t){if(e&1){let e=Jh();G(0,`button`,13),Qh(`click`,function(){let t=yo(e).$implicit;return bo(X().switchTab(t.id))}),Z(1),K()}if(e&2){let e=t.$implicit;mg(`active`,X().tab()===e.id),B(),Q(e.label)}}function UD(e,t){if(e&1){let e=Jh();G(0,`app-dashboard`,14),Qh(`navigate`,function(t){return yo(e),bo(X().switchTab(t))}),K()}e&2&&Lh(`rpc`,X().rpc())}function WD(e,t){e&1&&Bh(0,`app-component-tree`,12),e&2&&Lh(`rpc`,X().rpc())}function GD(e,t){e&1&&Bh(0,`app-route-inspector`,12),e&2&&Lh(`rpc`,X().rpc())}function KD(e,t){e&1&&Bh(0,`app-signal-inspector`,12),e&2&&Lh(`rpc`,X().rpc())}function qD(e,t){e&1&&Bh(0,`app-di-inspector`,12),e&2&&Lh(`rpc`,X().rpc())}function JD(e,t){e&1&&Bh(0,`app-store-inspector`,12),e&2&&Lh(`rpc`,X().rpc())}function YD(e,t){e&1&&Bh(0,`app-forms-inspector`,12),e&2&&Lh(`rpc`,X().rpc())}var XD=class e{tabs=[{id:`dashboard`,label:`Dashboard`},{id:`components`,label:`Components`},{id:`routes`,label:`Routes`},{id:`signals`,label:`Signals`},{id:`injectors`,label:`Injectors`},{id:`store`,label:`Store`},{id:`forms`,label:`Forms`}];tab=L(`dashboard`);rpc=L(null);connected=L(!1);ngOnInit(){let e=new URLSearchParams(location.hash.replace(/^#/,``)).get(`tab`);e&&this.tabs.some(t=>t.id===e)&&this.tab.set(e);let t=QD();KS(t?{baseURL:t}:{}).then(e=>{this.rpc.set(e),this.connected.set(!0),e.events.on(`connection:status`,e=>{this.connected.set(e===`connected`)})})}ngOnDestroy(){}switchTab(e){this.tab.set(e),history.replaceState(history.state,``,`#tab=${e}`)}static ɵfac=function(t){return new(t||e)};static ɵcmp=Zp({type:e,selectors:[[`app-root`]],decls:27,vars:4,consts:[[1,`brand`],[`width`,`20`,`height`,`22`,`viewBox`,`0 0 223 236`,`fill`,`url(#ng-logo)`,`aria-hidden`,`true`],[`id`,`ng-logo`,`x1`,`49`,`x2`,`226`,`y1`,`214`,`y2`,`130`,`gradientUnits`,`userSpaceOnUse`],[`stop-color`,`#E40035`],[`offset`,`.24`,`stop-color`,`#F60A48`],[`offset`,`.352`,`stop-color`,`#F20755`],[`offset`,`.494`,`stop-color`,`#DC087D`],[`offset`,`.745`,`stop-color`,`#9717E7`],[`offset`,`1`,`stop-color`,`#6C00F5`],[`d`,`m222.077 39.192-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z`],[3,`active`],[1,`status`],[3,`rpc`],[3,`click`],[3,`navigate`,`rpc`]],template:function(e,t){if(e&1&&(G(0,`header`)(1,`h1`,0),Qo(),G(2,`svg`,1)(3,`defs`)(4,`linearGradient`,2),Bh(5,`stop`,3)(6,`stop`,4)(7,`stop`,5)(8,`stop`,6)(9,`stop`,7)(10,`stop`,8),K()(),Bh(11,`path`,9),K(),$o(),G(12,`span`),Z(13,`Angular DevTools`),K()(),G(14,`nav`),U(15,HD,2,3,`button`,10,VD),K(),G(17,`span`,11),Z(18),K()(),G(19,`main`),V(20,UD,1,1,`app-dashboard`,12)(21,WD,1,1,`app-component-tree`,12)(22,GD,1,1,`app-route-inspector`,12)(23,KD,1,1,`app-signal-inspector`,12)(24,qD,1,1,`app-di-inspector`,12)(25,JD,1,1,`app-store-inspector`,12)(26,YD,1,1,`app-forms-inspector`,12),K()),e&2){let e;B(15),W(t.tabs),B(2),mg(`connected`,t.connected()),B(),$(` `,t.connected()?`Connected`:`Connecting…`,` `),B(2),H((e=t.tab())===`dashboard`?20:e===`components`?21:e===`routes`?22:e===`signals`?23:e===`injectors`?24:e===`store`?25:e===`forms`?26:-1)}},dependencies:[qS,fC,HT,uE,NE,QE,BD],styles:[`[_nghost-%COMP%] {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    header[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      background: #18181b;
      border-bottom: 1px solid #27272a;
    }
    .brand[_ngcontent-%COMP%] {
      margin: 0;
      font-size: inherit;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: var(--%NS%accent);
    }
    .brand[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
      color: var(--%NS%accent);
      white-space: nowrap;
    }
    nav[_ngcontent-%COMP%] {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }
    @media (max-width: 640px) {
      nav[_ngcontent-%COMP%] {
        order: 3;
        flex-basis: 100%;
      }
    }
    nav[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {
      padding: 6px 14px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: #a1a1aa;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.15s;
    }
    nav[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {
      background: #27272a;
      color: #e4e4e7;
    }
    nav[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {
      background: #3f3f46;
      color: #fff;
    }
    .status[_ngcontent-%COMP%] {
      margin-left: auto;
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 99px;
      background: #44403c;
      color: #a8a29e;
    }
    .status.connected[_ngcontent-%COMP%] {
      background: #14532d;
      color: #4ade80;
    }
    main[_ngcontent-%COMP%] {
      flex: 1;
      overflow: auto;
      padding: 16px;
    }`]})};function ZD(e){try{return new URL(e,location.href).origin===location.origin}catch{return!1}}function QD(){let e=new URLSearchParams(location.search).get(`baseURL`);if(e&&ZD(e))return e;if(!location.pathname.includes(`__ng-devtools`))return`/__ng-devtools/`}ov(XD).catch(console.error);export{ly as t};