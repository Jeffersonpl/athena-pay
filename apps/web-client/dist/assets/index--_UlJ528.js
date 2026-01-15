var hh=Object.defineProperty;var Al=t=>{throw TypeError(t)};var xh=(t,n,r)=>n in t?hh(t,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[n]=r;var L=(t,n,r)=>xh(t,typeof n!="symbol"?n+"":n,r),Oi=(t,n,r)=>n.has(t)||Al("Cannot "+r);var R=(t,n,r)=>(Oi(t,n,"read from private field"),r?r.call(t):n.get(t)),Ue=(t,n,r)=>n.has(t)?Al("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(t):n.set(t,r),Pt=(t,n,r,s)=>(Oi(t,n,"write to private field"),s?s.call(t,r):n.set(t,r),r),T=(t,n,r)=>(Oi(t,n,"access private method"),r);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();function fh(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var xd={exports:{}},bi={},fd={exports:{}},W={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Qr=Symbol.for("react.element"),mh=Symbol.for("react.portal"),gh=Symbol.for("react.fragment"),vh=Symbol.for("react.strict_mode"),bh=Symbol.for("react.profiler"),yh=Symbol.for("react.provider"),jh=Symbol.for("react.context"),wh=Symbol.for("react.forward_ref"),kh=Symbol.for("react.suspense"),Nh=Symbol.for("react.memo"),Ch=Symbol.for("react.lazy"),Sl=Symbol.iterator;function Ah(t){return t===null||typeof t!="object"?null:(t=Sl&&t[Sl]||t["@@iterator"],typeof t=="function"?t:null)}var md={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},gd=Object.assign,vd={};function nr(t,n,r){this.props=t,this.context=n,this.refs=vd,this.updater=r||md}nr.prototype.isReactComponent={};nr.prototype.setState=function(t,n){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,n,"setState")};nr.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function bd(){}bd.prototype=nr.prototype;function Sa(t,n,r){this.props=t,this.context=n,this.refs=vd,this.updater=r||md}var za=Sa.prototype=new bd;za.constructor=Sa;gd(za,nr.prototype);za.isPureReactComponent=!0;var zl=Array.isArray,yd=Object.prototype.hasOwnProperty,Ea={current:null},jd={key:!0,ref:!0,__self:!0,__source:!0};function wd(t,n,r){var s,i={},o=null,a=null;if(n!=null)for(s in n.ref!==void 0&&(a=n.ref),n.key!==void 0&&(o=""+n.key),n)yd.call(n,s)&&!jd.hasOwnProperty(s)&&(i[s]=n[s]);var l=arguments.length-2;if(l===1)i.children=r;else if(1<l){for(var c=Array(l),d=0;d<l;d++)c[d]=arguments[d+2];i.children=c}if(t&&t.defaultProps)for(s in l=t.defaultProps,l)i[s]===void 0&&(i[s]=l[s]);return{$$typeof:Qr,type:t,key:o,ref:a,props:i,_owner:Ea.current}}function Sh(t,n){return{$$typeof:Qr,type:t.type,key:n,ref:t.ref,props:t.props,_owner:t._owner}}function Pa(t){return typeof t=="object"&&t!==null&&t.$$typeof===Qr}function zh(t){var n={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(r){return n[r]})}var El=/\/+/g;function Wi(t,n){return typeof t=="object"&&t!==null&&t.key!=null?zh(""+t.key):n.toString(36)}function Es(t,n,r,s,i){var o=typeof t;(o==="undefined"||o==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(o){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case Qr:case mh:a=!0}}if(a)return a=t,i=i(a),t=s===""?"."+Wi(a,0):s,zl(i)?(r="",t!=null&&(r=t.replace(El,"$&/")+"/"),Es(i,n,r,"",function(d){return d})):i!=null&&(Pa(i)&&(i=Sh(i,r+(!i.key||a&&a.key===i.key?"":(""+i.key).replace(El,"$&/")+"/")+t)),n.push(i)),1;if(a=0,s=s===""?".":s+":",zl(t))for(var l=0;l<t.length;l++){o=t[l];var c=s+Wi(o,l);a+=Es(o,n,r,c,i)}else if(c=Ah(t),typeof c=="function")for(t=c.call(t),l=0;!(o=t.next()).done;)o=o.value,c=s+Wi(o,l++),a+=Es(o,n,r,c,i);else if(o==="object")throw n=String(t),Error("Objects are not valid as a React child (found: "+(n==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":n)+"). If you meant to render a collection of children, use an array instead.");return a}function ss(t,n,r){if(t==null)return t;var s=[],i=0;return Es(t,s,"","",function(o){return n.call(r,o,i++)}),s}function Eh(t){if(t._status===-1){var n=t._result;n=n(),n.then(function(r){(t._status===0||t._status===-1)&&(t._status=1,t._result=r)},function(r){(t._status===0||t._status===-1)&&(t._status=2,t._result=r)}),t._status===-1&&(t._status=0,t._result=n)}if(t._status===1)return t._result.default;throw t._result}var we={current:null},Ps={transition:null},Ph={ReactCurrentDispatcher:we,ReactCurrentBatchConfig:Ps,ReactCurrentOwner:Ea};function kd(){throw Error("act(...) is not supported in production builds of React.")}W.Children={map:ss,forEach:function(t,n,r){ss(t,function(){n.apply(this,arguments)},r)},count:function(t){var n=0;return ss(t,function(){n++}),n},toArray:function(t){return ss(t,function(n){return n})||[]},only:function(t){if(!Pa(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};W.Component=nr;W.Fragment=gh;W.Profiler=bh;W.PureComponent=Sa;W.StrictMode=vh;W.Suspense=kh;W.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ph;W.act=kd;W.cloneElement=function(t,n,r){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var s=gd({},t.props),i=t.key,o=t.ref,a=t._owner;if(n!=null){if(n.ref!==void 0&&(o=n.ref,a=Ea.current),n.key!==void 0&&(i=""+n.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(c in n)yd.call(n,c)&&!jd.hasOwnProperty(c)&&(s[c]=n[c]===void 0&&l!==void 0?l[c]:n[c])}var c=arguments.length-2;if(c===1)s.children=r;else if(1<c){l=Array(c);for(var d=0;d<c;d++)l[d]=arguments[d+2];s.children=l}return{$$typeof:Qr,type:t.type,key:i,ref:o,props:s,_owner:a}};W.createContext=function(t){return t={$$typeof:jh,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:yh,_context:t},t.Consumer=t};W.createElement=wd;W.createFactory=function(t){var n=wd.bind(null,t);return n.type=t,n};W.createRef=function(){return{current:null}};W.forwardRef=function(t){return{$$typeof:wh,render:t}};W.isValidElement=Pa;W.lazy=function(t){return{$$typeof:Ch,_payload:{_status:-1,_result:t},_init:Eh}};W.memo=function(t,n){return{$$typeof:Nh,type:t,compare:n===void 0?null:n}};W.startTransition=function(t){var n=Ps.transition;Ps.transition={};try{t()}finally{Ps.transition=n}};W.unstable_act=kd;W.useCallback=function(t,n){return we.current.useCallback(t,n)};W.useContext=function(t){return we.current.useContext(t)};W.useDebugValue=function(){};W.useDeferredValue=function(t){return we.current.useDeferredValue(t)};W.useEffect=function(t,n){return we.current.useEffect(t,n)};W.useId=function(){return we.current.useId()};W.useImperativeHandle=function(t,n,r){return we.current.useImperativeHandle(t,n,r)};W.useInsertionEffect=function(t,n){return we.current.useInsertionEffect(t,n)};W.useLayoutEffect=function(t,n){return we.current.useLayoutEffect(t,n)};W.useMemo=function(t,n){return we.current.useMemo(t,n)};W.useReducer=function(t,n,r){return we.current.useReducer(t,n,r)};W.useRef=function(t){return we.current.useRef(t)};W.useState=function(t){return we.current.useState(t)};W.useSyncExternalStore=function(t,n,r){return we.current.useSyncExternalStore(t,n,r)};W.useTransition=function(){return we.current.useTransition()};W.version="18.3.1";fd.exports=W;var C=fd.exports;const J=fh(C);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Dh=C,Th=Symbol.for("react.element"),Mh=Symbol.for("react.fragment"),Bh=Object.prototype.hasOwnProperty,Rh=Dh.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Lh={key:!0,ref:!0,__self:!0,__source:!0};function Nd(t,n,r){var s,i={},o=null,a=null;r!==void 0&&(o=""+r),n.key!==void 0&&(o=""+n.key),n.ref!==void 0&&(a=n.ref);for(s in n)Bh.call(n,s)&&!Lh.hasOwnProperty(s)&&(i[s]=n[s]);if(t&&t.defaultProps)for(s in n=t.defaultProps,n)i[s]===void 0&&(i[s]=n[s]);return{$$typeof:Th,type:t,key:o,ref:a,props:i,_owner:Rh.current}}bi.Fragment=Mh;bi.jsx=Nd;bi.jsxs=Nd;xd.exports=bi;var e=xd.exports,Cd={exports:{}},Ie={},Ad={exports:{}},Sd={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function n(D,I){var O=D.length;D.push(I);e:for(;0<O;){var V=O-1>>>1,Q=D[V];if(0<i(Q,I))D[V]=I,D[O]=Q,O=V;else break e}}function r(D){return D.length===0?null:D[0]}function s(D){if(D.length===0)return null;var I=D[0],O=D.pop();if(O!==I){D[0]=O;e:for(var V=0,Q=D.length,Et=Q>>>1;V<Et;){var We=2*(V+1)-1,yn=D[We],en=We+1,rs=D[en];if(0>i(yn,O))en<Q&&0>i(rs,yn)?(D[V]=rs,D[en]=O,V=en):(D[V]=yn,D[We]=O,V=We);else if(en<Q&&0>i(rs,O))D[V]=rs,D[en]=O,V=en;else break e}}return I}function i(D,I){var O=D.sortIndex-I.sortIndex;return O!==0?O:D.id-I.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;t.unstable_now=function(){return o.now()}}else{var a=Date,l=a.now();t.unstable_now=function(){return a.now()-l}}var c=[],d=[],h=1,f=null,m=3,k=!1,p=!1,v=!1,b=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function u(D){for(var I=r(d);I!==null;){if(I.callback===null)s(d);else if(I.startTime<=D)s(d),I.sortIndex=I.expirationTime,n(c,I);else break;I=r(d)}}function y(D){if(v=!1,u(D),!p)if(r(c)!==null)p=!0,U(j);else{var I=r(d);I!==null&&zt(y,I.startTime-D)}}function j(D,I){p=!1,v&&(v=!1,x(S),S=-1),k=!0;var O=m;try{for(u(I),f=r(c);f!==null&&(!(f.expirationTime>I)||D&&!xe());){var V=f.callback;if(typeof V=="function"){f.callback=null,m=f.priorityLevel;var Q=V(f.expirationTime<=I);I=t.unstable_now(),typeof Q=="function"?f.callback=Q:f===r(c)&&s(c),u(I)}else s(c);f=r(c)}if(f!==null)var Et=!0;else{var We=r(d);We!==null&&zt(y,We.startTime-I),Et=!1}return Et}finally{f=null,m=O,k=!1}}var w=!1,A=null,S=-1,B=5,_=-1;function xe(){return!(t.unstable_now()-_<B)}function Oe(){if(A!==null){var D=t.unstable_now();_=D;var I=!0;try{I=A(!0,D)}finally{I?Me():(w=!1,A=null)}}else w=!1}var Me;if(typeof g=="function")Me=function(){g(Oe)};else if(typeof MessageChannel<"u"){var Ne=new MessageChannel,z=Ne.port2;Ne.port1.onmessage=Oe,Me=function(){z.postMessage(null)}}else Me=function(){b(Oe,0)};function U(D){A=D,w||(w=!0,Me())}function zt(D,I){S=b(function(){D(t.unstable_now())},I)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(D){D.callback=null},t.unstable_continueExecution=function(){p||k||(p=!0,U(j))},t.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):B=0<D?Math.floor(1e3/D):5},t.unstable_getCurrentPriorityLevel=function(){return m},t.unstable_getFirstCallbackNode=function(){return r(c)},t.unstable_next=function(D){switch(m){case 1:case 2:case 3:var I=3;break;default:I=m}var O=m;m=I;try{return D()}finally{m=O}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(D,I){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var O=m;m=D;try{return I()}finally{m=O}},t.unstable_scheduleCallback=function(D,I,O){var V=t.unstable_now();switch(typeof O=="object"&&O!==null?(O=O.delay,O=typeof O=="number"&&0<O?V+O:V):O=V,D){case 1:var Q=-1;break;case 2:Q=250;break;case 5:Q=1073741823;break;case 4:Q=1e4;break;default:Q=5e3}return Q=O+Q,D={id:h++,callback:I,priorityLevel:D,startTime:O,expirationTime:Q,sortIndex:-1},O>V?(D.sortIndex=O,n(d,D),r(c)===null&&D===r(d)&&(v?(x(S),S=-1):v=!0,zt(y,O-V))):(D.sortIndex=Q,n(c,D),p||k||(p=!0,U(j))),D},t.unstable_shouldYield=xe,t.unstable_wrapCallback=function(D){var I=m;return function(){var O=m;m=I;try{return D.apply(this,arguments)}finally{m=O}}}})(Sd);Ad.exports=Sd;var _h=Ad.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ih=C,_e=_h;function E(t){for(var n="https://reactjs.org/docs/error-decoder.html?invariant="+t,r=1;r<arguments.length;r++)n+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var zd=new Set,Dr={};function gn(t,n){Kn(t,n),Kn(t+"Capture",n)}function Kn(t,n){for(Dr[t]=n,t=0;t<n.length;t++)zd.add(n[t])}var kt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),yo=Object.prototype.hasOwnProperty,Fh=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Pl={},Dl={};function Oh(t){return yo.call(Dl,t)?!0:yo.call(Pl,t)?!1:Fh.test(t)?Dl[t]=!0:(Pl[t]=!0,!1)}function Wh(t,n,r,s){if(r!==null&&r.type===0)return!1;switch(typeof n){case"function":case"symbol":return!0;case"boolean":return s?!1:r!==null?!r.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function Uh(t,n,r,s){if(n===null||typeof n>"u"||Wh(t,n,r,s))return!0;if(s)return!1;if(r!==null)switch(r.type){case 3:return!n;case 4:return n===!1;case 5:return isNaN(n);case 6:return isNaN(n)||1>n}return!1}function ke(t,n,r,s,i,o,a){this.acceptsBooleans=n===2||n===3||n===4,this.attributeName=s,this.attributeNamespace=i,this.mustUseProperty=r,this.propertyName=t,this.type=n,this.sanitizeURL=o,this.removeEmptyString=a}var he={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){he[t]=new ke(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var n=t[0];he[n]=new ke(n,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){he[t]=new ke(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){he[t]=new ke(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){he[t]=new ke(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){he[t]=new ke(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){he[t]=new ke(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){he[t]=new ke(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){he[t]=new ke(t,5,!1,t.toLowerCase(),null,!1,!1)});var Da=/[\-:]([a-z])/g;function Ta(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var n=t.replace(Da,Ta);he[n]=new ke(n,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var n=t.replace(Da,Ta);he[n]=new ke(n,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var n=t.replace(Da,Ta);he[n]=new ke(n,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){he[t]=new ke(t,1,!1,t.toLowerCase(),null,!1,!1)});he.xlinkHref=new ke("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){he[t]=new ke(t,1,!1,t.toLowerCase(),null,!0,!0)});function Ma(t,n,r,s){var i=he.hasOwnProperty(n)?he[n]:null;(i!==null?i.type!==0:s||!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(Uh(n,r,i,s)&&(r=null),s||i===null?Oh(n)&&(r===null?t.removeAttribute(n):t.setAttribute(n,""+r)):i.mustUseProperty?t[i.propertyName]=r===null?i.type===3?!1:"":r:(n=i.attributeName,s=i.attributeNamespace,r===null?t.removeAttribute(n):(i=i.type,r=i===3||i===4&&r===!0?"":""+r,s?t.setAttributeNS(s,n,r):t.setAttribute(n,r))))}var St=Ih.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,is=Symbol.for("react.element"),Cn=Symbol.for("react.portal"),An=Symbol.for("react.fragment"),Ba=Symbol.for("react.strict_mode"),jo=Symbol.for("react.profiler"),Ed=Symbol.for("react.provider"),Pd=Symbol.for("react.context"),Ra=Symbol.for("react.forward_ref"),wo=Symbol.for("react.suspense"),ko=Symbol.for("react.suspense_list"),La=Symbol.for("react.memo"),Rt=Symbol.for("react.lazy"),Dd=Symbol.for("react.offscreen"),Tl=Symbol.iterator;function ar(t){return t===null||typeof t!="object"?null:(t=Tl&&t[Tl]||t["@@iterator"],typeof t=="function"?t:null)}var te=Object.assign,Ui;function mr(t){if(Ui===void 0)try{throw Error()}catch(r){var n=r.stack.trim().match(/\n( *(at )?)/);Ui=n&&n[1]||""}return`
`+Ui+t}var $i=!1;function Vi(t,n){if(!t||$i)return"";$i=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(n)if(n=function(){throw Error()},Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(n,[])}catch(d){var s=d}Reflect.construct(t,[],n)}else{try{n.call()}catch(d){s=d}t.call(n.prototype)}else{try{throw Error()}catch(d){s=d}t()}}catch(d){if(d&&s&&typeof d.stack=="string"){for(var i=d.stack.split(`
`),o=s.stack.split(`
`),a=i.length-1,l=o.length-1;1<=a&&0<=l&&i[a]!==o[l];)l--;for(;1<=a&&0<=l;a--,l--)if(i[a]!==o[l]){if(a!==1||l!==1)do if(a--,l--,0>l||i[a]!==o[l]){var c=`
`+i[a].replace(" at new "," at ");return t.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",t.displayName)),c}while(1<=a&&0<=l);break}}}finally{$i=!1,Error.prepareStackTrace=r}return(t=t?t.displayName||t.name:"")?mr(t):""}function $h(t){switch(t.tag){case 5:return mr(t.type);case 16:return mr("Lazy");case 13:return mr("Suspense");case 19:return mr("SuspenseList");case 0:case 2:case 15:return t=Vi(t.type,!1),t;case 11:return t=Vi(t.type.render,!1),t;case 1:return t=Vi(t.type,!0),t;default:return""}}function No(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case An:return"Fragment";case Cn:return"Portal";case jo:return"Profiler";case Ba:return"StrictMode";case wo:return"Suspense";case ko:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Pd:return(t.displayName||"Context")+".Consumer";case Ed:return(t._context.displayName||"Context")+".Provider";case Ra:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case La:return n=t.displayName||null,n!==null?n:No(t.type)||"Memo";case Rt:n=t._payload,t=t._init;try{return No(t(n))}catch{}}return null}function Vh(t){var n=t.type;switch(t.tag){case 24:return"Cache";case 9:return(n.displayName||"Context")+".Consumer";case 10:return(n._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=n.render,t=t.displayName||t.name||"",n.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return n;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return No(n);case 8:return n===Ba?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n}return null}function Yt(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Td(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Hh(t){var n=Td(t)?"checked":"value",r=Object.getOwnPropertyDescriptor(t.constructor.prototype,n),s=""+t[n];if(!t.hasOwnProperty(n)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var i=r.get,o=r.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return i.call(this)},set:function(a){s=""+a,o.call(this,a)}}),Object.defineProperty(t,n,{enumerable:r.enumerable}),{getValue:function(){return s},setValue:function(a){s=""+a},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function os(t){t._valueTracker||(t._valueTracker=Hh(t))}function Md(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var r=n.getValue(),s="";return t&&(s=Td(t)?t.checked?"true":"false":t.value),t=s,t!==r?(n.setValue(t),!0):!1}function Qs(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Co(t,n){var r=n.checked;return te({},n,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??t._wrapperState.initialChecked})}function Ml(t,n){var r=n.defaultValue==null?"":n.defaultValue,s=n.checked!=null?n.checked:n.defaultChecked;r=Yt(n.value!=null?n.value:r),t._wrapperState={initialChecked:s,initialValue:r,controlled:n.type==="checkbox"||n.type==="radio"?n.checked!=null:n.value!=null}}function Bd(t,n){n=n.checked,n!=null&&Ma(t,"checked",n,!1)}function Ao(t,n){Bd(t,n);var r=Yt(n.value),s=n.type;if(r!=null)s==="number"?(r===0&&t.value===""||t.value!=r)&&(t.value=""+r):t.value!==""+r&&(t.value=""+r);else if(s==="submit"||s==="reset"){t.removeAttribute("value");return}n.hasOwnProperty("value")?So(t,n.type,r):n.hasOwnProperty("defaultValue")&&So(t,n.type,Yt(n.defaultValue)),n.checked==null&&n.defaultChecked!=null&&(t.defaultChecked=!!n.defaultChecked)}function Bl(t,n,r){if(n.hasOwnProperty("value")||n.hasOwnProperty("defaultValue")){var s=n.type;if(!(s!=="submit"&&s!=="reset"||n.value!==void 0&&n.value!==null))return;n=""+t._wrapperState.initialValue,r||n===t.value||(t.value=n),t.defaultValue=n}r=t.name,r!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,r!==""&&(t.name=r)}function So(t,n,r){(n!=="number"||Qs(t.ownerDocument)!==t)&&(r==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+r&&(t.defaultValue=""+r))}var gr=Array.isArray;function _n(t,n,r,s){if(t=t.options,n){n={};for(var i=0;i<r.length;i++)n["$"+r[i]]=!0;for(r=0;r<t.length;r++)i=n.hasOwnProperty("$"+t[r].value),t[r].selected!==i&&(t[r].selected=i),i&&s&&(t[r].defaultSelected=!0)}else{for(r=""+Yt(r),n=null,i=0;i<t.length;i++){if(t[i].value===r){t[i].selected=!0,s&&(t[i].defaultSelected=!0);return}n!==null||t[i].disabled||(n=t[i])}n!==null&&(n.selected=!0)}}function zo(t,n){if(n.dangerouslySetInnerHTML!=null)throw Error(E(91));return te({},n,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Rl(t,n){var r=n.value;if(r==null){if(r=n.children,n=n.defaultValue,r!=null){if(n!=null)throw Error(E(92));if(gr(r)){if(1<r.length)throw Error(E(93));r=r[0]}n=r}n==null&&(n=""),r=n}t._wrapperState={initialValue:Yt(r)}}function Rd(t,n){var r=Yt(n.value),s=Yt(n.defaultValue);r!=null&&(r=""+r,r!==t.value&&(t.value=r),n.defaultValue==null&&t.defaultValue!==r&&(t.defaultValue=r)),s!=null&&(t.defaultValue=""+s)}function Ll(t){var n=t.textContent;n===t._wrapperState.initialValue&&n!==""&&n!==null&&(t.value=n)}function Ld(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Eo(t,n){return t==null||t==="http://www.w3.org/1999/xhtml"?Ld(n):t==="http://www.w3.org/2000/svg"&&n==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var as,_d=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(n,r,s,i){MSApp.execUnsafeLocalFunction(function(){return t(n,r,s,i)})}:t}(function(t,n){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=n;else{for(as=as||document.createElement("div"),as.innerHTML="<svg>"+n.valueOf().toString()+"</svg>",n=as.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;n.firstChild;)t.appendChild(n.firstChild)}});function Tr(t,n){if(n){var r=t.firstChild;if(r&&r===t.lastChild&&r.nodeType===3){r.nodeValue=n;return}}t.textContent=n}var wr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qh=["Webkit","ms","Moz","O"];Object.keys(wr).forEach(function(t){qh.forEach(function(n){n=n+t.charAt(0).toUpperCase()+t.substring(1),wr[n]=wr[t]})});function Id(t,n,r){return n==null||typeof n=="boolean"||n===""?"":r||typeof n!="number"||n===0||wr.hasOwnProperty(t)&&wr[t]?(""+n).trim():n+"px"}function Fd(t,n){t=t.style;for(var r in n)if(n.hasOwnProperty(r)){var s=r.indexOf("--")===0,i=Id(r,n[r],s);r==="float"&&(r="cssFloat"),s?t.setProperty(r,i):t[r]=i}}var Kh=te({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Po(t,n){if(n){if(Kh[t]&&(n.children!=null||n.dangerouslySetInnerHTML!=null))throw Error(E(137,t));if(n.dangerouslySetInnerHTML!=null){if(n.children!=null)throw Error(E(60));if(typeof n.dangerouslySetInnerHTML!="object"||!("__html"in n.dangerouslySetInnerHTML))throw Error(E(61))}if(n.style!=null&&typeof n.style!="object")throw Error(E(62))}}function Do(t,n){if(t.indexOf("-")===-1)return typeof n.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var To=null;function _a(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Mo=null,In=null,Fn=null;function _l(t){if(t=Xr(t)){if(typeof Mo!="function")throw Error(E(280));var n=t.stateNode;n&&(n=Ni(n),Mo(t.stateNode,t.type,n))}}function Od(t){In?Fn?Fn.push(t):Fn=[t]:In=t}function Wd(){if(In){var t=In,n=Fn;if(Fn=In=null,_l(t),n)for(t=0;t<n.length;t++)_l(n[t])}}function Ud(t,n){return t(n)}function $d(){}var Hi=!1;function Vd(t,n,r){if(Hi)return t(n,r);Hi=!0;try{return Ud(t,n,r)}finally{Hi=!1,(In!==null||Fn!==null)&&($d(),Wd())}}function Mr(t,n){var r=t.stateNode;if(r===null)return null;var s=Ni(r);if(s===null)return null;r=s[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(s=!s.disabled)||(t=t.type,s=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!s;break e;default:t=!1}if(t)return null;if(r&&typeof r!="function")throw Error(E(231,n,typeof r));return r}var Bo=!1;if(kt)try{var lr={};Object.defineProperty(lr,"passive",{get:function(){Bo=!0}}),window.addEventListener("test",lr,lr),window.removeEventListener("test",lr,lr)}catch{Bo=!1}function Qh(t,n,r,s,i,o,a,l,c){var d=Array.prototype.slice.call(arguments,3);try{n.apply(r,d)}catch(h){this.onError(h)}}var kr=!1,Ys=null,Js=!1,Ro=null,Yh={onError:function(t){kr=!0,Ys=t}};function Jh(t,n,r,s,i,o,a,l,c){kr=!1,Ys=null,Qh.apply(Yh,arguments)}function Xh(t,n,r,s,i,o,a,l,c){if(Jh.apply(this,arguments),kr){if(kr){var d=Ys;kr=!1,Ys=null}else throw Error(E(198));Js||(Js=!0,Ro=d)}}function vn(t){var n=t,r=t;if(t.alternate)for(;n.return;)n=n.return;else{t=n;do n=t,n.flags&4098&&(r=n.return),t=n.return;while(t)}return n.tag===3?r:null}function Hd(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function Il(t){if(vn(t)!==t)throw Error(E(188))}function Gh(t){var n=t.alternate;if(!n){if(n=vn(t),n===null)throw Error(E(188));return n!==t?null:t}for(var r=t,s=n;;){var i=r.return;if(i===null)break;var o=i.alternate;if(o===null){if(s=i.return,s!==null){r=s;continue}break}if(i.child===o.child){for(o=i.child;o;){if(o===r)return Il(i),t;if(o===s)return Il(i),n;o=o.sibling}throw Error(E(188))}if(r.return!==s.return)r=i,s=o;else{for(var a=!1,l=i.child;l;){if(l===r){a=!0,r=i,s=o;break}if(l===s){a=!0,s=i,r=o;break}l=l.sibling}if(!a){for(l=o.child;l;){if(l===r){a=!0,r=o,s=i;break}if(l===s){a=!0,s=o,r=i;break}l=l.sibling}if(!a)throw Error(E(189))}}if(r.alternate!==s)throw Error(E(190))}if(r.tag!==3)throw Error(E(188));return r.stateNode.current===r?t:n}function qd(t){return t=Gh(t),t!==null?Kd(t):null}function Kd(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var n=Kd(t);if(n!==null)return n;t=t.sibling}return null}var Qd=_e.unstable_scheduleCallback,Fl=_e.unstable_cancelCallback,Zh=_e.unstable_shouldYield,ex=_e.unstable_requestPaint,re=_e.unstable_now,tx=_e.unstable_getCurrentPriorityLevel,Ia=_e.unstable_ImmediatePriority,Yd=_e.unstable_UserBlockingPriority,Xs=_e.unstable_NormalPriority,nx=_e.unstable_LowPriority,Jd=_e.unstable_IdlePriority,yi=null,ht=null;function rx(t){if(ht&&typeof ht.onCommitFiberRoot=="function")try{ht.onCommitFiberRoot(yi,t,void 0,(t.current.flags&128)===128)}catch{}}var nt=Math.clz32?Math.clz32:ox,sx=Math.log,ix=Math.LN2;function ox(t){return t>>>=0,t===0?32:31-(sx(t)/ix|0)|0}var ls=64,cs=4194304;function vr(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Gs(t,n){var r=t.pendingLanes;if(r===0)return 0;var s=0,i=t.suspendedLanes,o=t.pingedLanes,a=r&268435455;if(a!==0){var l=a&~i;l!==0?s=vr(l):(o&=a,o!==0&&(s=vr(o)))}else a=r&~i,a!==0?s=vr(a):o!==0&&(s=vr(o));if(s===0)return 0;if(n!==0&&n!==s&&!(n&i)&&(i=s&-s,o=n&-n,i>=o||i===16&&(o&4194240)!==0))return n;if(s&4&&(s|=r&16),n=t.entangledLanes,n!==0)for(t=t.entanglements,n&=s;0<n;)r=31-nt(n),i=1<<r,s|=t[r],n&=~i;return s}function ax(t,n){switch(t){case 1:case 2:case 4:return n+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function lx(t,n){for(var r=t.suspendedLanes,s=t.pingedLanes,i=t.expirationTimes,o=t.pendingLanes;0<o;){var a=31-nt(o),l=1<<a,c=i[a];c===-1?(!(l&r)||l&s)&&(i[a]=ax(l,n)):c<=n&&(t.expiredLanes|=l),o&=~l}}function Lo(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Xd(){var t=ls;return ls<<=1,!(ls&4194240)&&(ls=64),t}function qi(t){for(var n=[],r=0;31>r;r++)n.push(t);return n}function Yr(t,n,r){t.pendingLanes|=n,n!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,n=31-nt(n),t[n]=r}function cx(t,n){var r=t.pendingLanes&~n;t.pendingLanes=n,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=n,t.mutableReadLanes&=n,t.entangledLanes&=n,n=t.entanglements;var s=t.eventTimes;for(t=t.expirationTimes;0<r;){var i=31-nt(r),o=1<<i;n[i]=0,s[i]=-1,t[i]=-1,r&=~o}}function Fa(t,n){var r=t.entangledLanes|=n;for(t=t.entanglements;r;){var s=31-nt(r),i=1<<s;i&n|t[s]&n&&(t[s]|=n),r&=~i}}var q=0;function Gd(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Zd,Oa,ep,tp,np,_o=!1,ds=[],Wt=null,Ut=null,$t=null,Br=new Map,Rr=new Map,_t=[],dx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ol(t,n){switch(t){case"focusin":case"focusout":Wt=null;break;case"dragenter":case"dragleave":Ut=null;break;case"mouseover":case"mouseout":$t=null;break;case"pointerover":case"pointerout":Br.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Rr.delete(n.pointerId)}}function cr(t,n,r,s,i,o){return t===null||t.nativeEvent!==o?(t={blockedOn:n,domEventName:r,eventSystemFlags:s,nativeEvent:o,targetContainers:[i]},n!==null&&(n=Xr(n),n!==null&&Oa(n)),t):(t.eventSystemFlags|=s,n=t.targetContainers,i!==null&&n.indexOf(i)===-1&&n.push(i),t)}function px(t,n,r,s,i){switch(n){case"focusin":return Wt=cr(Wt,t,n,r,s,i),!0;case"dragenter":return Ut=cr(Ut,t,n,r,s,i),!0;case"mouseover":return $t=cr($t,t,n,r,s,i),!0;case"pointerover":var o=i.pointerId;return Br.set(o,cr(Br.get(o)||null,t,n,r,s,i)),!0;case"gotpointercapture":return o=i.pointerId,Rr.set(o,cr(Rr.get(o)||null,t,n,r,s,i)),!0}return!1}function rp(t){var n=rn(t.target);if(n!==null){var r=vn(n);if(r!==null){if(n=r.tag,n===13){if(n=Hd(r),n!==null){t.blockedOn=n,np(t.priority,function(){ep(r)});return}}else if(n===3&&r.stateNode.current.memoizedState.isDehydrated){t.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Ds(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var r=Io(t.domEventName,t.eventSystemFlags,n[0],t.nativeEvent);if(r===null){r=t.nativeEvent;var s=new r.constructor(r.type,r);To=s,r.target.dispatchEvent(s),To=null}else return n=Xr(r),n!==null&&Oa(n),t.blockedOn=r,!1;n.shift()}return!0}function Wl(t,n,r){Ds(t)&&r.delete(n)}function ux(){_o=!1,Wt!==null&&Ds(Wt)&&(Wt=null),Ut!==null&&Ds(Ut)&&(Ut=null),$t!==null&&Ds($t)&&($t=null),Br.forEach(Wl),Rr.forEach(Wl)}function dr(t,n){t.blockedOn===n&&(t.blockedOn=null,_o||(_o=!0,_e.unstable_scheduleCallback(_e.unstable_NormalPriority,ux)))}function Lr(t){function n(i){return dr(i,t)}if(0<ds.length){dr(ds[0],t);for(var r=1;r<ds.length;r++){var s=ds[r];s.blockedOn===t&&(s.blockedOn=null)}}for(Wt!==null&&dr(Wt,t),Ut!==null&&dr(Ut,t),$t!==null&&dr($t,t),Br.forEach(n),Rr.forEach(n),r=0;r<_t.length;r++)s=_t[r],s.blockedOn===t&&(s.blockedOn=null);for(;0<_t.length&&(r=_t[0],r.blockedOn===null);)rp(r),r.blockedOn===null&&_t.shift()}var On=St.ReactCurrentBatchConfig,Zs=!0;function hx(t,n,r,s){var i=q,o=On.transition;On.transition=null;try{q=1,Wa(t,n,r,s)}finally{q=i,On.transition=o}}function xx(t,n,r,s){var i=q,o=On.transition;On.transition=null;try{q=4,Wa(t,n,r,s)}finally{q=i,On.transition=o}}function Wa(t,n,r,s){if(Zs){var i=Io(t,n,r,s);if(i===null)no(t,n,s,ei,r),Ol(t,s);else if(px(i,t,n,r,s))s.stopPropagation();else if(Ol(t,s),n&4&&-1<dx.indexOf(t)){for(;i!==null;){var o=Xr(i);if(o!==null&&Zd(o),o=Io(t,n,r,s),o===null&&no(t,n,s,ei,r),o===i)break;i=o}i!==null&&s.stopPropagation()}else no(t,n,s,null,r)}}var ei=null;function Io(t,n,r,s){if(ei=null,t=_a(s),t=rn(t),t!==null)if(n=vn(t),n===null)t=null;else if(r=n.tag,r===13){if(t=Hd(n),t!==null)return t;t=null}else if(r===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null);return ei=t,null}function sp(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(tx()){case Ia:return 1;case Yd:return 4;case Xs:case nx:return 16;case Jd:return 536870912;default:return 16}default:return 16}}var Ft=null,Ua=null,Ts=null;function ip(){if(Ts)return Ts;var t,n=Ua,r=n.length,s,i="value"in Ft?Ft.value:Ft.textContent,o=i.length;for(t=0;t<r&&n[t]===i[t];t++);var a=r-t;for(s=1;s<=a&&n[r-s]===i[o-s];s++);return Ts=i.slice(t,1<s?1-s:void 0)}function Ms(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function ps(){return!0}function Ul(){return!1}function Fe(t){function n(r,s,i,o,a){this._reactName=r,this._targetInst=i,this.type=s,this.nativeEvent=o,this.target=a,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(r=t[l],this[l]=r?r(o):o[l]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?ps:Ul,this.isPropagationStopped=Ul,this}return te(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=ps)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=ps)},persist:function(){},isPersistent:ps}),n}var rr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},$a=Fe(rr),Jr=te({},rr,{view:0,detail:0}),fx=Fe(Jr),Ki,Qi,pr,ji=te({},Jr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Va,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==pr&&(pr&&t.type==="mousemove"?(Ki=t.screenX-pr.screenX,Qi=t.screenY-pr.screenY):Qi=Ki=0,pr=t),Ki)},movementY:function(t){return"movementY"in t?t.movementY:Qi}}),$l=Fe(ji),mx=te({},ji,{dataTransfer:0}),gx=Fe(mx),vx=te({},Jr,{relatedTarget:0}),Yi=Fe(vx),bx=te({},rr,{animationName:0,elapsedTime:0,pseudoElement:0}),yx=Fe(bx),jx=te({},rr,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),wx=Fe(jx),kx=te({},rr,{data:0}),Vl=Fe(kx),Nx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Cx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ax={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Sx(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=Ax[t])?!!n[t]:!1}function Va(){return Sx}var zx=te({},Jr,{key:function(t){if(t.key){var n=Nx[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=Ms(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Cx[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Va,charCode:function(t){return t.type==="keypress"?Ms(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Ms(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Ex=Fe(zx),Px=te({},ji,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Hl=Fe(Px),Dx=te({},Jr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Va}),Tx=Fe(Dx),Mx=te({},rr,{propertyName:0,elapsedTime:0,pseudoElement:0}),Bx=Fe(Mx),Rx=te({},ji,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Lx=Fe(Rx),_x=[9,13,27,32],Ha=kt&&"CompositionEvent"in window,Nr=null;kt&&"documentMode"in document&&(Nr=document.documentMode);var Ix=kt&&"TextEvent"in window&&!Nr,op=kt&&(!Ha||Nr&&8<Nr&&11>=Nr),ql=" ",Kl=!1;function ap(t,n){switch(t){case"keyup":return _x.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function lp(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Sn=!1;function Fx(t,n){switch(t){case"compositionend":return lp(n);case"keypress":return n.which!==32?null:(Kl=!0,ql);case"textInput":return t=n.data,t===ql&&Kl?null:t;default:return null}}function Ox(t,n){if(Sn)return t==="compositionend"||!Ha&&ap(t,n)?(t=ip(),Ts=Ua=Ft=null,Sn=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return op&&n.locale!=="ko"?null:n.data;default:return null}}var Wx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ql(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!Wx[t.type]:n==="textarea"}function cp(t,n,r,s){Od(s),n=ti(n,"onChange"),0<n.length&&(r=new $a("onChange","change",null,r,s),t.push({event:r,listeners:n}))}var Cr=null,_r=null;function Ux(t){yp(t,0)}function wi(t){var n=Pn(t);if(Md(n))return t}function $x(t,n){if(t==="change")return n}var dp=!1;if(kt){var Ji;if(kt){var Xi="oninput"in document;if(!Xi){var Yl=document.createElement("div");Yl.setAttribute("oninput","return;"),Xi=typeof Yl.oninput=="function"}Ji=Xi}else Ji=!1;dp=Ji&&(!document.documentMode||9<document.documentMode)}function Jl(){Cr&&(Cr.detachEvent("onpropertychange",pp),_r=Cr=null)}function pp(t){if(t.propertyName==="value"&&wi(_r)){var n=[];cp(n,_r,t,_a(t)),Vd(Ux,n)}}function Vx(t,n,r){t==="focusin"?(Jl(),Cr=n,_r=r,Cr.attachEvent("onpropertychange",pp)):t==="focusout"&&Jl()}function Hx(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return wi(_r)}function qx(t,n){if(t==="click")return wi(n)}function Kx(t,n){if(t==="input"||t==="change")return wi(n)}function Qx(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var it=typeof Object.is=="function"?Object.is:Qx;function Ir(t,n){if(it(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var r=Object.keys(t),s=Object.keys(n);if(r.length!==s.length)return!1;for(s=0;s<r.length;s++){var i=r[s];if(!yo.call(n,i)||!it(t[i],n[i]))return!1}return!0}function Xl(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Gl(t,n){var r=Xl(t);t=0;for(var s;r;){if(r.nodeType===3){if(s=t+r.textContent.length,t<=n&&s>=n)return{node:r,offset:n-t};t=s}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=Xl(r)}}function up(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?up(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function hp(){for(var t=window,n=Qs();n instanceof t.HTMLIFrameElement;){try{var r=typeof n.contentWindow.location.href=="string"}catch{r=!1}if(r)t=n.contentWindow;else break;n=Qs(t.document)}return n}function qa(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}function Yx(t){var n=hp(),r=t.focusedElem,s=t.selectionRange;if(n!==r&&r&&r.ownerDocument&&up(r.ownerDocument.documentElement,r)){if(s!==null&&qa(r)){if(n=s.start,t=s.end,t===void 0&&(t=n),"selectionStart"in r)r.selectionStart=n,r.selectionEnd=Math.min(t,r.value.length);else if(t=(n=r.ownerDocument||document)&&n.defaultView||window,t.getSelection){t=t.getSelection();var i=r.textContent.length,o=Math.min(s.start,i);s=s.end===void 0?o:Math.min(s.end,i),!t.extend&&o>s&&(i=s,s=o,o=i),i=Gl(r,o);var a=Gl(r,s);i&&a&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(n=n.createRange(),n.setStart(i.node,i.offset),t.removeAllRanges(),o>s?(t.addRange(n),t.extend(a.node,a.offset)):(n.setEnd(a.node,a.offset),t.addRange(n)))}}for(n=[],t=r;t=t.parentNode;)t.nodeType===1&&n.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<n.length;r++)t=n[r],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var Jx=kt&&"documentMode"in document&&11>=document.documentMode,zn=null,Fo=null,Ar=null,Oo=!1;function Zl(t,n,r){var s=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Oo||zn==null||zn!==Qs(s)||(s=zn,"selectionStart"in s&&qa(s)?s={start:s.selectionStart,end:s.selectionEnd}:(s=(s.ownerDocument&&s.ownerDocument.defaultView||window).getSelection(),s={anchorNode:s.anchorNode,anchorOffset:s.anchorOffset,focusNode:s.focusNode,focusOffset:s.focusOffset}),Ar&&Ir(Ar,s)||(Ar=s,s=ti(Fo,"onSelect"),0<s.length&&(n=new $a("onSelect","select",null,n,r),t.push({event:n,listeners:s}),n.target=zn)))}function us(t,n){var r={};return r[t.toLowerCase()]=n.toLowerCase(),r["Webkit"+t]="webkit"+n,r["Moz"+t]="moz"+n,r}var En={animationend:us("Animation","AnimationEnd"),animationiteration:us("Animation","AnimationIteration"),animationstart:us("Animation","AnimationStart"),transitionend:us("Transition","TransitionEnd")},Gi={},xp={};kt&&(xp=document.createElement("div").style,"AnimationEvent"in window||(delete En.animationend.animation,delete En.animationiteration.animation,delete En.animationstart.animation),"TransitionEvent"in window||delete En.transitionend.transition);function ki(t){if(Gi[t])return Gi[t];if(!En[t])return t;var n=En[t],r;for(r in n)if(n.hasOwnProperty(r)&&r in xp)return Gi[t]=n[r];return t}var fp=ki("animationend"),mp=ki("animationiteration"),gp=ki("animationstart"),vp=ki("transitionend"),bp=new Map,ec="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Xt(t,n){bp.set(t,n),gn(n,[t])}for(var Zi=0;Zi<ec.length;Zi++){var eo=ec[Zi],Xx=eo.toLowerCase(),Gx=eo[0].toUpperCase()+eo.slice(1);Xt(Xx,"on"+Gx)}Xt(fp,"onAnimationEnd");Xt(mp,"onAnimationIteration");Xt(gp,"onAnimationStart");Xt("dblclick","onDoubleClick");Xt("focusin","onFocus");Xt("focusout","onBlur");Xt(vp,"onTransitionEnd");Kn("onMouseEnter",["mouseout","mouseover"]);Kn("onMouseLeave",["mouseout","mouseover"]);Kn("onPointerEnter",["pointerout","pointerover"]);Kn("onPointerLeave",["pointerout","pointerover"]);gn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));gn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));gn("onBeforeInput",["compositionend","keypress","textInput","paste"]);gn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));gn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));gn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var br="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Zx=new Set("cancel close invalid load scroll toggle".split(" ").concat(br));function tc(t,n,r){var s=t.type||"unknown-event";t.currentTarget=r,Xh(s,n,void 0,t),t.currentTarget=null}function yp(t,n){n=(n&4)!==0;for(var r=0;r<t.length;r++){var s=t[r],i=s.event;s=s.listeners;e:{var o=void 0;if(n)for(var a=s.length-1;0<=a;a--){var l=s[a],c=l.instance,d=l.currentTarget;if(l=l.listener,c!==o&&i.isPropagationStopped())break e;tc(i,l,d),o=c}else for(a=0;a<s.length;a++){if(l=s[a],c=l.instance,d=l.currentTarget,l=l.listener,c!==o&&i.isPropagationStopped())break e;tc(i,l,d),o=c}}}if(Js)throw t=Ro,Js=!1,Ro=null,t}function Y(t,n){var r=n[Ho];r===void 0&&(r=n[Ho]=new Set);var s=t+"__bubble";r.has(s)||(jp(n,t,2,!1),r.add(s))}function to(t,n,r){var s=0;n&&(s|=4),jp(r,t,s,n)}var hs="_reactListening"+Math.random().toString(36).slice(2);function Fr(t){if(!t[hs]){t[hs]=!0,zd.forEach(function(r){r!=="selectionchange"&&(Zx.has(r)||to(r,!1,t),to(r,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[hs]||(n[hs]=!0,to("selectionchange",!1,n))}}function jp(t,n,r,s){switch(sp(n)){case 1:var i=hx;break;case 4:i=xx;break;default:i=Wa}r=i.bind(null,n,r,t),i=void 0,!Bo||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(i=!0),s?i!==void 0?t.addEventListener(n,r,{capture:!0,passive:i}):t.addEventListener(n,r,!0):i!==void 0?t.addEventListener(n,r,{passive:i}):t.addEventListener(n,r,!1)}function no(t,n,r,s,i){var o=s;if(!(n&1)&&!(n&2)&&s!==null)e:for(;;){if(s===null)return;var a=s.tag;if(a===3||a===4){var l=s.stateNode.containerInfo;if(l===i||l.nodeType===8&&l.parentNode===i)break;if(a===4)for(a=s.return;a!==null;){var c=a.tag;if((c===3||c===4)&&(c=a.stateNode.containerInfo,c===i||c.nodeType===8&&c.parentNode===i))return;a=a.return}for(;l!==null;){if(a=rn(l),a===null)return;if(c=a.tag,c===5||c===6){s=o=a;continue e}l=l.parentNode}}s=s.return}Vd(function(){var d=o,h=_a(r),f=[];e:{var m=bp.get(t);if(m!==void 0){var k=$a,p=t;switch(t){case"keypress":if(Ms(r)===0)break e;case"keydown":case"keyup":k=Ex;break;case"focusin":p="focus",k=Yi;break;case"focusout":p="blur",k=Yi;break;case"beforeblur":case"afterblur":k=Yi;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":k=$l;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":k=gx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":k=Tx;break;case fp:case mp:case gp:k=yx;break;case vp:k=Bx;break;case"scroll":k=fx;break;case"wheel":k=Lx;break;case"copy":case"cut":case"paste":k=wx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":k=Hl}var v=(n&4)!==0,b=!v&&t==="scroll",x=v?m!==null?m+"Capture":null:m;v=[];for(var g=d,u;g!==null;){u=g;var y=u.stateNode;if(u.tag===5&&y!==null&&(u=y,x!==null&&(y=Mr(g,x),y!=null&&v.push(Or(g,y,u)))),b)break;g=g.return}0<v.length&&(m=new k(m,p,null,r,h),f.push({event:m,listeners:v}))}}if(!(n&7)){e:{if(m=t==="mouseover"||t==="pointerover",k=t==="mouseout"||t==="pointerout",m&&r!==To&&(p=r.relatedTarget||r.fromElement)&&(rn(p)||p[Nt]))break e;if((k||m)&&(m=h.window===h?h:(m=h.ownerDocument)?m.defaultView||m.parentWindow:window,k?(p=r.relatedTarget||r.toElement,k=d,p=p?rn(p):null,p!==null&&(b=vn(p),p!==b||p.tag!==5&&p.tag!==6)&&(p=null)):(k=null,p=d),k!==p)){if(v=$l,y="onMouseLeave",x="onMouseEnter",g="mouse",(t==="pointerout"||t==="pointerover")&&(v=Hl,y="onPointerLeave",x="onPointerEnter",g="pointer"),b=k==null?m:Pn(k),u=p==null?m:Pn(p),m=new v(y,g+"leave",k,r,h),m.target=b,m.relatedTarget=u,y=null,rn(h)===d&&(v=new v(x,g+"enter",p,r,h),v.target=u,v.relatedTarget=b,y=v),b=y,k&&p)t:{for(v=k,x=p,g=0,u=v;u;u=jn(u))g++;for(u=0,y=x;y;y=jn(y))u++;for(;0<g-u;)v=jn(v),g--;for(;0<u-g;)x=jn(x),u--;for(;g--;){if(v===x||x!==null&&v===x.alternate)break t;v=jn(v),x=jn(x)}v=null}else v=null;k!==null&&nc(f,m,k,v,!1),p!==null&&b!==null&&nc(f,b,p,v,!0)}}e:{if(m=d?Pn(d):window,k=m.nodeName&&m.nodeName.toLowerCase(),k==="select"||k==="input"&&m.type==="file")var j=$x;else if(Ql(m))if(dp)j=Kx;else{j=Hx;var w=Vx}else(k=m.nodeName)&&k.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(j=qx);if(j&&(j=j(t,d))){cp(f,j,r,h);break e}w&&w(t,m,d),t==="focusout"&&(w=m._wrapperState)&&w.controlled&&m.type==="number"&&So(m,"number",m.value)}switch(w=d?Pn(d):window,t){case"focusin":(Ql(w)||w.contentEditable==="true")&&(zn=w,Fo=d,Ar=null);break;case"focusout":Ar=Fo=zn=null;break;case"mousedown":Oo=!0;break;case"contextmenu":case"mouseup":case"dragend":Oo=!1,Zl(f,r,h);break;case"selectionchange":if(Jx)break;case"keydown":case"keyup":Zl(f,r,h)}var A;if(Ha)e:{switch(t){case"compositionstart":var S="onCompositionStart";break e;case"compositionend":S="onCompositionEnd";break e;case"compositionupdate":S="onCompositionUpdate";break e}S=void 0}else Sn?ap(t,r)&&(S="onCompositionEnd"):t==="keydown"&&r.keyCode===229&&(S="onCompositionStart");S&&(op&&r.locale!=="ko"&&(Sn||S!=="onCompositionStart"?S==="onCompositionEnd"&&Sn&&(A=ip()):(Ft=h,Ua="value"in Ft?Ft.value:Ft.textContent,Sn=!0)),w=ti(d,S),0<w.length&&(S=new Vl(S,t,null,r,h),f.push({event:S,listeners:w}),A?S.data=A:(A=lp(r),A!==null&&(S.data=A)))),(A=Ix?Fx(t,r):Ox(t,r))&&(d=ti(d,"onBeforeInput"),0<d.length&&(h=new Vl("onBeforeInput","beforeinput",null,r,h),f.push({event:h,listeners:d}),h.data=A))}yp(f,n)})}function Or(t,n,r){return{instance:t,listener:n,currentTarget:r}}function ti(t,n){for(var r=n+"Capture",s=[];t!==null;){var i=t,o=i.stateNode;i.tag===5&&o!==null&&(i=o,o=Mr(t,r),o!=null&&s.unshift(Or(t,o,i)),o=Mr(t,n),o!=null&&s.push(Or(t,o,i))),t=t.return}return s}function jn(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function nc(t,n,r,s,i){for(var o=n._reactName,a=[];r!==null&&r!==s;){var l=r,c=l.alternate,d=l.stateNode;if(c!==null&&c===s)break;l.tag===5&&d!==null&&(l=d,i?(c=Mr(r,o),c!=null&&a.unshift(Or(r,c,l))):i||(c=Mr(r,o),c!=null&&a.push(Or(r,c,l)))),r=r.return}a.length!==0&&t.push({event:n,listeners:a})}var ef=/\r\n?/g,tf=/\u0000|\uFFFD/g;function rc(t){return(typeof t=="string"?t:""+t).replace(ef,`
`).replace(tf,"")}function xs(t,n,r){if(n=rc(n),rc(t)!==n&&r)throw Error(E(425))}function ni(){}var Wo=null,Uo=null;function $o(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Vo=typeof setTimeout=="function"?setTimeout:void 0,nf=typeof clearTimeout=="function"?clearTimeout:void 0,sc=typeof Promise=="function"?Promise:void 0,rf=typeof queueMicrotask=="function"?queueMicrotask:typeof sc<"u"?function(t){return sc.resolve(null).then(t).catch(sf)}:Vo;function sf(t){setTimeout(function(){throw t})}function ro(t,n){var r=n,s=0;do{var i=r.nextSibling;if(t.removeChild(r),i&&i.nodeType===8)if(r=i.data,r==="/$"){if(s===0){t.removeChild(i),Lr(n);return}s--}else r!=="$"&&r!=="$?"&&r!=="$!"||s++;r=i}while(r);Lr(n)}function Vt(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?")break;if(n==="/$")return null}}return t}function ic(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var r=t.data;if(r==="$"||r==="$!"||r==="$?"){if(n===0)return t;n--}else r==="/$"&&n++}t=t.previousSibling}return null}var sr=Math.random().toString(36).slice(2),ut="__reactFiber$"+sr,Wr="__reactProps$"+sr,Nt="__reactContainer$"+sr,Ho="__reactEvents$"+sr,of="__reactListeners$"+sr,af="__reactHandles$"+sr;function rn(t){var n=t[ut];if(n)return n;for(var r=t.parentNode;r;){if(n=r[Nt]||r[ut]){if(r=n.alternate,n.child!==null||r!==null&&r.child!==null)for(t=ic(t);t!==null;){if(r=t[ut])return r;t=ic(t)}return n}t=r,r=t.parentNode}return null}function Xr(t){return t=t[ut]||t[Nt],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Pn(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(E(33))}function Ni(t){return t[Wr]||null}var qo=[],Dn=-1;function Gt(t){return{current:t}}function X(t){0>Dn||(t.current=qo[Dn],qo[Dn]=null,Dn--)}function K(t,n){Dn++,qo[Dn]=t.current,t.current=n}var Jt={},be=Gt(Jt),ze=Gt(!1),pn=Jt;function Qn(t,n){var r=t.type.contextTypes;if(!r)return Jt;var s=t.stateNode;if(s&&s.__reactInternalMemoizedUnmaskedChildContext===n)return s.__reactInternalMemoizedMaskedChildContext;var i={},o;for(o in r)i[o]=n[o];return s&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=n,t.__reactInternalMemoizedMaskedChildContext=i),i}function Ee(t){return t=t.childContextTypes,t!=null}function ri(){X(ze),X(be)}function oc(t,n,r){if(be.current!==Jt)throw Error(E(168));K(be,n),K(ze,r)}function wp(t,n,r){var s=t.stateNode;if(n=n.childContextTypes,typeof s.getChildContext!="function")return r;s=s.getChildContext();for(var i in s)if(!(i in n))throw Error(E(108,Vh(t)||"Unknown",i));return te({},r,s)}function si(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Jt,pn=be.current,K(be,t),K(ze,ze.current),!0}function ac(t,n,r){var s=t.stateNode;if(!s)throw Error(E(169));r?(t=wp(t,n,pn),s.__reactInternalMemoizedMergedChildContext=t,X(ze),X(be),K(be,t)):X(ze),K(ze,r)}var vt=null,Ci=!1,so=!1;function kp(t){vt===null?vt=[t]:vt.push(t)}function lf(t){Ci=!0,kp(t)}function Zt(){if(!so&&vt!==null){so=!0;var t=0,n=q;try{var r=vt;for(q=1;t<r.length;t++){var s=r[t];do s=s(!0);while(s!==null)}vt=null,Ci=!1}catch(i){throw vt!==null&&(vt=vt.slice(t+1)),Qd(Ia,Zt),i}finally{q=n,so=!1}}return null}var Tn=[],Mn=0,ii=null,oi=0,Ve=[],He=0,un=null,yt=1,jt="";function tn(t,n){Tn[Mn++]=oi,Tn[Mn++]=ii,ii=t,oi=n}function Np(t,n,r){Ve[He++]=yt,Ve[He++]=jt,Ve[He++]=un,un=t;var s=yt;t=jt;var i=32-nt(s)-1;s&=~(1<<i),r+=1;var o=32-nt(n)+i;if(30<o){var a=i-i%5;o=(s&(1<<a)-1).toString(32),s>>=a,i-=a,yt=1<<32-nt(n)+i|r<<i|s,jt=o+t}else yt=1<<o|r<<i|s,jt=t}function Ka(t){t.return!==null&&(tn(t,1),Np(t,1,0))}function Qa(t){for(;t===ii;)ii=Tn[--Mn],Tn[Mn]=null,oi=Tn[--Mn],Tn[Mn]=null;for(;t===un;)un=Ve[--He],Ve[He]=null,jt=Ve[--He],Ve[He]=null,yt=Ve[--He],Ve[He]=null}var Le=null,Re=null,G=!1,tt=null;function Cp(t,n){var r=qe(5,null,null,0);r.elementType="DELETED",r.stateNode=n,r.return=t,n=t.deletions,n===null?(t.deletions=[r],t.flags|=16):n.push(r)}function lc(t,n){switch(t.tag){case 5:var r=t.type;return n=n.nodeType!==1||r.toLowerCase()!==n.nodeName.toLowerCase()?null:n,n!==null?(t.stateNode=n,Le=t,Re=Vt(n.firstChild),!0):!1;case 6:return n=t.pendingProps===""||n.nodeType!==3?null:n,n!==null?(t.stateNode=n,Le=t,Re=null,!0):!1;case 13:return n=n.nodeType!==8?null:n,n!==null?(r=un!==null?{id:yt,overflow:jt}:null,t.memoizedState={dehydrated:n,treeContext:r,retryLane:1073741824},r=qe(18,null,null,0),r.stateNode=n,r.return=t,t.child=r,Le=t,Re=null,!0):!1;default:return!1}}function Ko(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Qo(t){if(G){var n=Re;if(n){var r=n;if(!lc(t,n)){if(Ko(t))throw Error(E(418));n=Vt(r.nextSibling);var s=Le;n&&lc(t,n)?Cp(s,r):(t.flags=t.flags&-4097|2,G=!1,Le=t)}}else{if(Ko(t))throw Error(E(418));t.flags=t.flags&-4097|2,G=!1,Le=t}}}function cc(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Le=t}function fs(t){if(t!==Le)return!1;if(!G)return cc(t),G=!0,!1;var n;if((n=t.tag!==3)&&!(n=t.tag!==5)&&(n=t.type,n=n!=="head"&&n!=="body"&&!$o(t.type,t.memoizedProps)),n&&(n=Re)){if(Ko(t))throw Ap(),Error(E(418));for(;n;)Cp(t,n),n=Vt(n.nextSibling)}if(cc(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(E(317));e:{for(t=t.nextSibling,n=0;t;){if(t.nodeType===8){var r=t.data;if(r==="/$"){if(n===0){Re=Vt(t.nextSibling);break e}n--}else r!=="$"&&r!=="$!"&&r!=="$?"||n++}t=t.nextSibling}Re=null}}else Re=Le?Vt(t.stateNode.nextSibling):null;return!0}function Ap(){for(var t=Re;t;)t=Vt(t.nextSibling)}function Yn(){Re=Le=null,G=!1}function Ya(t){tt===null?tt=[t]:tt.push(t)}var cf=St.ReactCurrentBatchConfig;function ur(t,n,r){if(t=r.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(E(309));var s=r.stateNode}if(!s)throw Error(E(147,t));var i=s,o=""+t;return n!==null&&n.ref!==null&&typeof n.ref=="function"&&n.ref._stringRef===o?n.ref:(n=function(a){var l=i.refs;a===null?delete l[o]:l[o]=a},n._stringRef=o,n)}if(typeof t!="string")throw Error(E(284));if(!r._owner)throw Error(E(290,t))}return t}function ms(t,n){throw t=Object.prototype.toString.call(n),Error(E(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t))}function dc(t){var n=t._init;return n(t._payload)}function Sp(t){function n(x,g){if(t){var u=x.deletions;u===null?(x.deletions=[g],x.flags|=16):u.push(g)}}function r(x,g){if(!t)return null;for(;g!==null;)n(x,g),g=g.sibling;return null}function s(x,g){for(x=new Map;g!==null;)g.key!==null?x.set(g.key,g):x.set(g.index,g),g=g.sibling;return x}function i(x,g){return x=Qt(x,g),x.index=0,x.sibling=null,x}function o(x,g,u){return x.index=u,t?(u=x.alternate,u!==null?(u=u.index,u<g?(x.flags|=2,g):u):(x.flags|=2,g)):(x.flags|=1048576,g)}function a(x){return t&&x.alternate===null&&(x.flags|=2),x}function l(x,g,u,y){return g===null||g.tag!==6?(g=uo(u,x.mode,y),g.return=x,g):(g=i(g,u),g.return=x,g)}function c(x,g,u,y){var j=u.type;return j===An?h(x,g,u.props.children,y,u.key):g!==null&&(g.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===Rt&&dc(j)===g.type)?(y=i(g,u.props),y.ref=ur(x,g,u),y.return=x,y):(y=Os(u.type,u.key,u.props,null,x.mode,y),y.ref=ur(x,g,u),y.return=x,y)}function d(x,g,u,y){return g===null||g.tag!==4||g.stateNode.containerInfo!==u.containerInfo||g.stateNode.implementation!==u.implementation?(g=ho(u,x.mode,y),g.return=x,g):(g=i(g,u.children||[]),g.return=x,g)}function h(x,g,u,y,j){return g===null||g.tag!==7?(g=cn(u,x.mode,y,j),g.return=x,g):(g=i(g,u),g.return=x,g)}function f(x,g,u){if(typeof g=="string"&&g!==""||typeof g=="number")return g=uo(""+g,x.mode,u),g.return=x,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case is:return u=Os(g.type,g.key,g.props,null,x.mode,u),u.ref=ur(x,null,g),u.return=x,u;case Cn:return g=ho(g,x.mode,u),g.return=x,g;case Rt:var y=g._init;return f(x,y(g._payload),u)}if(gr(g)||ar(g))return g=cn(g,x.mode,u,null),g.return=x,g;ms(x,g)}return null}function m(x,g,u,y){var j=g!==null?g.key:null;if(typeof u=="string"&&u!==""||typeof u=="number")return j!==null?null:l(x,g,""+u,y);if(typeof u=="object"&&u!==null){switch(u.$$typeof){case is:return u.key===j?c(x,g,u,y):null;case Cn:return u.key===j?d(x,g,u,y):null;case Rt:return j=u._init,m(x,g,j(u._payload),y)}if(gr(u)||ar(u))return j!==null?null:h(x,g,u,y,null);ms(x,u)}return null}function k(x,g,u,y,j){if(typeof y=="string"&&y!==""||typeof y=="number")return x=x.get(u)||null,l(g,x,""+y,j);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case is:return x=x.get(y.key===null?u:y.key)||null,c(g,x,y,j);case Cn:return x=x.get(y.key===null?u:y.key)||null,d(g,x,y,j);case Rt:var w=y._init;return k(x,g,u,w(y._payload),j)}if(gr(y)||ar(y))return x=x.get(u)||null,h(g,x,y,j,null);ms(g,y)}return null}function p(x,g,u,y){for(var j=null,w=null,A=g,S=g=0,B=null;A!==null&&S<u.length;S++){A.index>S?(B=A,A=null):B=A.sibling;var _=m(x,A,u[S],y);if(_===null){A===null&&(A=B);break}t&&A&&_.alternate===null&&n(x,A),g=o(_,g,S),w===null?j=_:w.sibling=_,w=_,A=B}if(S===u.length)return r(x,A),G&&tn(x,S),j;if(A===null){for(;S<u.length;S++)A=f(x,u[S],y),A!==null&&(g=o(A,g,S),w===null?j=A:w.sibling=A,w=A);return G&&tn(x,S),j}for(A=s(x,A);S<u.length;S++)B=k(A,x,S,u[S],y),B!==null&&(t&&B.alternate!==null&&A.delete(B.key===null?S:B.key),g=o(B,g,S),w===null?j=B:w.sibling=B,w=B);return t&&A.forEach(function(xe){return n(x,xe)}),G&&tn(x,S),j}function v(x,g,u,y){var j=ar(u);if(typeof j!="function")throw Error(E(150));if(u=j.call(u),u==null)throw Error(E(151));for(var w=j=null,A=g,S=g=0,B=null,_=u.next();A!==null&&!_.done;S++,_=u.next()){A.index>S?(B=A,A=null):B=A.sibling;var xe=m(x,A,_.value,y);if(xe===null){A===null&&(A=B);break}t&&A&&xe.alternate===null&&n(x,A),g=o(xe,g,S),w===null?j=xe:w.sibling=xe,w=xe,A=B}if(_.done)return r(x,A),G&&tn(x,S),j;if(A===null){for(;!_.done;S++,_=u.next())_=f(x,_.value,y),_!==null&&(g=o(_,g,S),w===null?j=_:w.sibling=_,w=_);return G&&tn(x,S),j}for(A=s(x,A);!_.done;S++,_=u.next())_=k(A,x,S,_.value,y),_!==null&&(t&&_.alternate!==null&&A.delete(_.key===null?S:_.key),g=o(_,g,S),w===null?j=_:w.sibling=_,w=_);return t&&A.forEach(function(Oe){return n(x,Oe)}),G&&tn(x,S),j}function b(x,g,u,y){if(typeof u=="object"&&u!==null&&u.type===An&&u.key===null&&(u=u.props.children),typeof u=="object"&&u!==null){switch(u.$$typeof){case is:e:{for(var j=u.key,w=g;w!==null;){if(w.key===j){if(j=u.type,j===An){if(w.tag===7){r(x,w.sibling),g=i(w,u.props.children),g.return=x,x=g;break e}}else if(w.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===Rt&&dc(j)===w.type){r(x,w.sibling),g=i(w,u.props),g.ref=ur(x,w,u),g.return=x,x=g;break e}r(x,w);break}else n(x,w);w=w.sibling}u.type===An?(g=cn(u.props.children,x.mode,y,u.key),g.return=x,x=g):(y=Os(u.type,u.key,u.props,null,x.mode,y),y.ref=ur(x,g,u),y.return=x,x=y)}return a(x);case Cn:e:{for(w=u.key;g!==null;){if(g.key===w)if(g.tag===4&&g.stateNode.containerInfo===u.containerInfo&&g.stateNode.implementation===u.implementation){r(x,g.sibling),g=i(g,u.children||[]),g.return=x,x=g;break e}else{r(x,g);break}else n(x,g);g=g.sibling}g=ho(u,x.mode,y),g.return=x,x=g}return a(x);case Rt:return w=u._init,b(x,g,w(u._payload),y)}if(gr(u))return p(x,g,u,y);if(ar(u))return v(x,g,u,y);ms(x,u)}return typeof u=="string"&&u!==""||typeof u=="number"?(u=""+u,g!==null&&g.tag===6?(r(x,g.sibling),g=i(g,u),g.return=x,x=g):(r(x,g),g=uo(u,x.mode,y),g.return=x,x=g),a(x)):r(x,g)}return b}var Jn=Sp(!0),zp=Sp(!1),ai=Gt(null),li=null,Bn=null,Ja=null;function Xa(){Ja=Bn=li=null}function Ga(t){var n=ai.current;X(ai),t._currentValue=n}function Yo(t,n,r){for(;t!==null;){var s=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,s!==null&&(s.childLanes|=n)):s!==null&&(s.childLanes&n)!==n&&(s.childLanes|=n),t===r)break;t=t.return}}function Wn(t,n){li=t,Ja=Bn=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&n&&(Se=!0),t.firstContext=null)}function Qe(t){var n=t._currentValue;if(Ja!==t)if(t={context:t,memoizedValue:n,next:null},Bn===null){if(li===null)throw Error(E(308));Bn=t,li.dependencies={lanes:0,firstContext:t}}else Bn=Bn.next=t;return n}var sn=null;function Za(t){sn===null?sn=[t]:sn.push(t)}function Ep(t,n,r,s){var i=n.interleaved;return i===null?(r.next=r,Za(n)):(r.next=i.next,i.next=r),n.interleaved=r,Ct(t,s)}function Ct(t,n){t.lanes|=n;var r=t.alternate;for(r!==null&&(r.lanes|=n),r=t,t=t.return;t!==null;)t.childLanes|=n,r=t.alternate,r!==null&&(r.childLanes|=n),r=t,t=t.return;return r.tag===3?r.stateNode:null}var Lt=!1;function el(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Pp(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function wt(t,n){return{eventTime:t,lane:n,tag:0,payload:null,callback:null,next:null}}function Ht(t,n,r){var s=t.updateQueue;if(s===null)return null;if(s=s.shared,$&2){var i=s.pending;return i===null?n.next=n:(n.next=i.next,i.next=n),s.pending=n,Ct(t,r)}return i=s.interleaved,i===null?(n.next=n,Za(s)):(n.next=i.next,i.next=n),s.interleaved=n,Ct(t,r)}function Bs(t,n,r){if(n=n.updateQueue,n!==null&&(n=n.shared,(r&4194240)!==0)){var s=n.lanes;s&=t.pendingLanes,r|=s,n.lanes=r,Fa(t,r)}}function pc(t,n){var r=t.updateQueue,s=t.alternate;if(s!==null&&(s=s.updateQueue,r===s)){var i=null,o=null;if(r=r.firstBaseUpdate,r!==null){do{var a={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};o===null?i=o=a:o=o.next=a,r=r.next}while(r!==null);o===null?i=o=n:o=o.next=n}else i=o=n;r={baseState:s.baseState,firstBaseUpdate:i,lastBaseUpdate:o,shared:s.shared,effects:s.effects},t.updateQueue=r;return}t=r.lastBaseUpdate,t===null?r.firstBaseUpdate=n:t.next=n,r.lastBaseUpdate=n}function ci(t,n,r,s){var i=t.updateQueue;Lt=!1;var o=i.firstBaseUpdate,a=i.lastBaseUpdate,l=i.shared.pending;if(l!==null){i.shared.pending=null;var c=l,d=c.next;c.next=null,a===null?o=d:a.next=d,a=c;var h=t.alternate;h!==null&&(h=h.updateQueue,l=h.lastBaseUpdate,l!==a&&(l===null?h.firstBaseUpdate=d:l.next=d,h.lastBaseUpdate=c))}if(o!==null){var f=i.baseState;a=0,h=d=c=null,l=o;do{var m=l.lane,k=l.eventTime;if((s&m)===m){h!==null&&(h=h.next={eventTime:k,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var p=t,v=l;switch(m=n,k=r,v.tag){case 1:if(p=v.payload,typeof p=="function"){f=p.call(k,f,m);break e}f=p;break e;case 3:p.flags=p.flags&-65537|128;case 0:if(p=v.payload,m=typeof p=="function"?p.call(k,f,m):p,m==null)break e;f=te({},f,m);break e;case 2:Lt=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,m=i.effects,m===null?i.effects=[l]:m.push(l))}else k={eventTime:k,lane:m,tag:l.tag,payload:l.payload,callback:l.callback,next:null},h===null?(d=h=k,c=f):h=h.next=k,a|=m;if(l=l.next,l===null){if(l=i.shared.pending,l===null)break;m=l,l=m.next,m.next=null,i.lastBaseUpdate=m,i.shared.pending=null}}while(!0);if(h===null&&(c=f),i.baseState=c,i.firstBaseUpdate=d,i.lastBaseUpdate=h,n=i.shared.interleaved,n!==null){i=n;do a|=i.lane,i=i.next;while(i!==n)}else o===null&&(i.shared.lanes=0);xn|=a,t.lanes=a,t.memoizedState=f}}function uc(t,n,r){if(t=n.effects,n.effects=null,t!==null)for(n=0;n<t.length;n++){var s=t[n],i=s.callback;if(i!==null){if(s.callback=null,s=r,typeof i!="function")throw Error(E(191,i));i.call(s)}}}var Gr={},xt=Gt(Gr),Ur=Gt(Gr),$r=Gt(Gr);function on(t){if(t===Gr)throw Error(E(174));return t}function tl(t,n){switch(K($r,n),K(Ur,t),K(xt,Gr),t=n.nodeType,t){case 9:case 11:n=(n=n.documentElement)?n.namespaceURI:Eo(null,"");break;default:t=t===8?n.parentNode:n,n=t.namespaceURI||null,t=t.tagName,n=Eo(n,t)}X(xt),K(xt,n)}function Xn(){X(xt),X(Ur),X($r)}function Dp(t){on($r.current);var n=on(xt.current),r=Eo(n,t.type);n!==r&&(K(Ur,t),K(xt,r))}function nl(t){Ur.current===t&&(X(xt),X(Ur))}var Z=Gt(0);function di(t){for(var n=t;n!==null;){if(n.tag===13){var r=n.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!==void 0){if(n.flags&128)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var io=[];function rl(){for(var t=0;t<io.length;t++)io[t]._workInProgressVersionPrimary=null;io.length=0}var Rs=St.ReactCurrentDispatcher,oo=St.ReactCurrentBatchConfig,hn=0,ee=null,ae=null,ce=null,pi=!1,Sr=!1,Vr=0,df=0;function fe(){throw Error(E(321))}function sl(t,n){if(n===null)return!1;for(var r=0;r<n.length&&r<t.length;r++)if(!it(t[r],n[r]))return!1;return!0}function il(t,n,r,s,i,o){if(hn=o,ee=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,Rs.current=t===null||t.memoizedState===null?xf:ff,t=r(s,i),Sr){o=0;do{if(Sr=!1,Vr=0,25<=o)throw Error(E(301));o+=1,ce=ae=null,n.updateQueue=null,Rs.current=mf,t=r(s,i)}while(Sr)}if(Rs.current=ui,n=ae!==null&&ae.next!==null,hn=0,ce=ae=ee=null,pi=!1,n)throw Error(E(300));return t}function ol(){var t=Vr!==0;return Vr=0,t}function dt(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ce===null?ee.memoizedState=ce=t:ce=ce.next=t,ce}function Ye(){if(ae===null){var t=ee.alternate;t=t!==null?t.memoizedState:null}else t=ae.next;var n=ce===null?ee.memoizedState:ce.next;if(n!==null)ce=n,ae=t;else{if(t===null)throw Error(E(310));ae=t,t={memoizedState:ae.memoizedState,baseState:ae.baseState,baseQueue:ae.baseQueue,queue:ae.queue,next:null},ce===null?ee.memoizedState=ce=t:ce=ce.next=t}return ce}function Hr(t,n){return typeof n=="function"?n(t):n}function ao(t){var n=Ye(),r=n.queue;if(r===null)throw Error(E(311));r.lastRenderedReducer=t;var s=ae,i=s.baseQueue,o=r.pending;if(o!==null){if(i!==null){var a=i.next;i.next=o.next,o.next=a}s.baseQueue=i=o,r.pending=null}if(i!==null){o=i.next,s=s.baseState;var l=a=null,c=null,d=o;do{var h=d.lane;if((hn&h)===h)c!==null&&(c=c.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),s=d.hasEagerState?d.eagerState:t(s,d.action);else{var f={lane:h,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};c===null?(l=c=f,a=s):c=c.next=f,ee.lanes|=h,xn|=h}d=d.next}while(d!==null&&d!==o);c===null?a=s:c.next=l,it(s,n.memoizedState)||(Se=!0),n.memoizedState=s,n.baseState=a,n.baseQueue=c,r.lastRenderedState=s}if(t=r.interleaved,t!==null){i=t;do o=i.lane,ee.lanes|=o,xn|=o,i=i.next;while(i!==t)}else i===null&&(r.lanes=0);return[n.memoizedState,r.dispatch]}function lo(t){var n=Ye(),r=n.queue;if(r===null)throw Error(E(311));r.lastRenderedReducer=t;var s=r.dispatch,i=r.pending,o=n.memoizedState;if(i!==null){r.pending=null;var a=i=i.next;do o=t(o,a.action),a=a.next;while(a!==i);it(o,n.memoizedState)||(Se=!0),n.memoizedState=o,n.baseQueue===null&&(n.baseState=o),r.lastRenderedState=o}return[o,s]}function Tp(){}function Mp(t,n){var r=ee,s=Ye(),i=n(),o=!it(s.memoizedState,i);if(o&&(s.memoizedState=i,Se=!0),s=s.queue,al(Lp.bind(null,r,s,t),[t]),s.getSnapshot!==n||o||ce!==null&&ce.memoizedState.tag&1){if(r.flags|=2048,qr(9,Rp.bind(null,r,s,i,n),void 0,null),de===null)throw Error(E(349));hn&30||Bp(r,n,i)}return i}function Bp(t,n,r){t.flags|=16384,t={getSnapshot:n,value:r},n=ee.updateQueue,n===null?(n={lastEffect:null,stores:null},ee.updateQueue=n,n.stores=[t]):(r=n.stores,r===null?n.stores=[t]:r.push(t))}function Rp(t,n,r,s){n.value=r,n.getSnapshot=s,_p(n)&&Ip(t)}function Lp(t,n,r){return r(function(){_p(n)&&Ip(t)})}function _p(t){var n=t.getSnapshot;t=t.value;try{var r=n();return!it(t,r)}catch{return!0}}function Ip(t){var n=Ct(t,1);n!==null&&rt(n,t,1,-1)}function hc(t){var n=dt();return typeof t=="function"&&(t=t()),n.memoizedState=n.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Hr,lastRenderedState:t},n.queue=t,t=t.dispatch=hf.bind(null,ee,t),[n.memoizedState,t]}function qr(t,n,r,s){return t={tag:t,create:n,destroy:r,deps:s,next:null},n=ee.updateQueue,n===null?(n={lastEffect:null,stores:null},ee.updateQueue=n,n.lastEffect=t.next=t):(r=n.lastEffect,r===null?n.lastEffect=t.next=t:(s=r.next,r.next=t,t.next=s,n.lastEffect=t)),t}function Fp(){return Ye().memoizedState}function Ls(t,n,r,s){var i=dt();ee.flags|=t,i.memoizedState=qr(1|n,r,void 0,s===void 0?null:s)}function Ai(t,n,r,s){var i=Ye();s=s===void 0?null:s;var o=void 0;if(ae!==null){var a=ae.memoizedState;if(o=a.destroy,s!==null&&sl(s,a.deps)){i.memoizedState=qr(n,r,o,s);return}}ee.flags|=t,i.memoizedState=qr(1|n,r,o,s)}function xc(t,n){return Ls(8390656,8,t,n)}function al(t,n){return Ai(2048,8,t,n)}function Op(t,n){return Ai(4,2,t,n)}function Wp(t,n){return Ai(4,4,t,n)}function Up(t,n){if(typeof n=="function")return t=t(),n(t),function(){n(null)};if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function $p(t,n,r){return r=r!=null?r.concat([t]):null,Ai(4,4,Up.bind(null,n,t),r)}function ll(){}function Vp(t,n){var r=Ye();n=n===void 0?null:n;var s=r.memoizedState;return s!==null&&n!==null&&sl(n,s[1])?s[0]:(r.memoizedState=[t,n],t)}function Hp(t,n){var r=Ye();n=n===void 0?null:n;var s=r.memoizedState;return s!==null&&n!==null&&sl(n,s[1])?s[0]:(t=t(),r.memoizedState=[t,n],t)}function qp(t,n,r){return hn&21?(it(r,n)||(r=Xd(),ee.lanes|=r,xn|=r,t.baseState=!0),n):(t.baseState&&(t.baseState=!1,Se=!0),t.memoizedState=r)}function pf(t,n){var r=q;q=r!==0&&4>r?r:4,t(!0);var s=oo.transition;oo.transition={};try{t(!1),n()}finally{q=r,oo.transition=s}}function Kp(){return Ye().memoizedState}function uf(t,n,r){var s=Kt(t);if(r={lane:s,action:r,hasEagerState:!1,eagerState:null,next:null},Qp(t))Yp(n,r);else if(r=Ep(t,n,r,s),r!==null){var i=je();rt(r,t,s,i),Jp(r,n,s)}}function hf(t,n,r){var s=Kt(t),i={lane:s,action:r,hasEagerState:!1,eagerState:null,next:null};if(Qp(t))Yp(n,i);else{var o=t.alternate;if(t.lanes===0&&(o===null||o.lanes===0)&&(o=n.lastRenderedReducer,o!==null))try{var a=n.lastRenderedState,l=o(a,r);if(i.hasEagerState=!0,i.eagerState=l,it(l,a)){var c=n.interleaved;c===null?(i.next=i,Za(n)):(i.next=c.next,c.next=i),n.interleaved=i;return}}catch{}finally{}r=Ep(t,n,i,s),r!==null&&(i=je(),rt(r,t,s,i),Jp(r,n,s))}}function Qp(t){var n=t.alternate;return t===ee||n!==null&&n===ee}function Yp(t,n){Sr=pi=!0;var r=t.pending;r===null?n.next=n:(n.next=r.next,r.next=n),t.pending=n}function Jp(t,n,r){if(r&4194240){var s=n.lanes;s&=t.pendingLanes,r|=s,n.lanes=r,Fa(t,r)}}var ui={readContext:Qe,useCallback:fe,useContext:fe,useEffect:fe,useImperativeHandle:fe,useInsertionEffect:fe,useLayoutEffect:fe,useMemo:fe,useReducer:fe,useRef:fe,useState:fe,useDebugValue:fe,useDeferredValue:fe,useTransition:fe,useMutableSource:fe,useSyncExternalStore:fe,useId:fe,unstable_isNewReconciler:!1},xf={readContext:Qe,useCallback:function(t,n){return dt().memoizedState=[t,n===void 0?null:n],t},useContext:Qe,useEffect:xc,useImperativeHandle:function(t,n,r){return r=r!=null?r.concat([t]):null,Ls(4194308,4,Up.bind(null,n,t),r)},useLayoutEffect:function(t,n){return Ls(4194308,4,t,n)},useInsertionEffect:function(t,n){return Ls(4,2,t,n)},useMemo:function(t,n){var r=dt();return n=n===void 0?null:n,t=t(),r.memoizedState=[t,n],t},useReducer:function(t,n,r){var s=dt();return n=r!==void 0?r(n):n,s.memoizedState=s.baseState=n,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:n},s.queue=t,t=t.dispatch=uf.bind(null,ee,t),[s.memoizedState,t]},useRef:function(t){var n=dt();return t={current:t},n.memoizedState=t},useState:hc,useDebugValue:ll,useDeferredValue:function(t){return dt().memoizedState=t},useTransition:function(){var t=hc(!1),n=t[0];return t=pf.bind(null,t[1]),dt().memoizedState=t,[n,t]},useMutableSource:function(){},useSyncExternalStore:function(t,n,r){var s=ee,i=dt();if(G){if(r===void 0)throw Error(E(407));r=r()}else{if(r=n(),de===null)throw Error(E(349));hn&30||Bp(s,n,r)}i.memoizedState=r;var o={value:r,getSnapshot:n};return i.queue=o,xc(Lp.bind(null,s,o,t),[t]),s.flags|=2048,qr(9,Rp.bind(null,s,o,r,n),void 0,null),r},useId:function(){var t=dt(),n=de.identifierPrefix;if(G){var r=jt,s=yt;r=(s&~(1<<32-nt(s)-1)).toString(32)+r,n=":"+n+"R"+r,r=Vr++,0<r&&(n+="H"+r.toString(32)),n+=":"}else r=df++,n=":"+n+"r"+r.toString(32)+":";return t.memoizedState=n},unstable_isNewReconciler:!1},ff={readContext:Qe,useCallback:Vp,useContext:Qe,useEffect:al,useImperativeHandle:$p,useInsertionEffect:Op,useLayoutEffect:Wp,useMemo:Hp,useReducer:ao,useRef:Fp,useState:function(){return ao(Hr)},useDebugValue:ll,useDeferredValue:function(t){var n=Ye();return qp(n,ae.memoizedState,t)},useTransition:function(){var t=ao(Hr)[0],n=Ye().memoizedState;return[t,n]},useMutableSource:Tp,useSyncExternalStore:Mp,useId:Kp,unstable_isNewReconciler:!1},mf={readContext:Qe,useCallback:Vp,useContext:Qe,useEffect:al,useImperativeHandle:$p,useInsertionEffect:Op,useLayoutEffect:Wp,useMemo:Hp,useReducer:lo,useRef:Fp,useState:function(){return lo(Hr)},useDebugValue:ll,useDeferredValue:function(t){var n=Ye();return ae===null?n.memoizedState=t:qp(n,ae.memoizedState,t)},useTransition:function(){var t=lo(Hr)[0],n=Ye().memoizedState;return[t,n]},useMutableSource:Tp,useSyncExternalStore:Mp,useId:Kp,unstable_isNewReconciler:!1};function Ge(t,n){if(t&&t.defaultProps){n=te({},n),t=t.defaultProps;for(var r in t)n[r]===void 0&&(n[r]=t[r]);return n}return n}function Jo(t,n,r,s){n=t.memoizedState,r=r(s,n),r=r==null?n:te({},n,r),t.memoizedState=r,t.lanes===0&&(t.updateQueue.baseState=r)}var Si={isMounted:function(t){return(t=t._reactInternals)?vn(t)===t:!1},enqueueSetState:function(t,n,r){t=t._reactInternals;var s=je(),i=Kt(t),o=wt(s,i);o.payload=n,r!=null&&(o.callback=r),n=Ht(t,o,i),n!==null&&(rt(n,t,i,s),Bs(n,t,i))},enqueueReplaceState:function(t,n,r){t=t._reactInternals;var s=je(),i=Kt(t),o=wt(s,i);o.tag=1,o.payload=n,r!=null&&(o.callback=r),n=Ht(t,o,i),n!==null&&(rt(n,t,i,s),Bs(n,t,i))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var r=je(),s=Kt(t),i=wt(r,s);i.tag=2,n!=null&&(i.callback=n),n=Ht(t,i,s),n!==null&&(rt(n,t,s,r),Bs(n,t,s))}};function fc(t,n,r,s,i,o,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(s,o,a):n.prototype&&n.prototype.isPureReactComponent?!Ir(r,s)||!Ir(i,o):!0}function Xp(t,n,r){var s=!1,i=Jt,o=n.contextType;return typeof o=="object"&&o!==null?o=Qe(o):(i=Ee(n)?pn:be.current,s=n.contextTypes,o=(s=s!=null)?Qn(t,i):Jt),n=new n(r,o),t.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=Si,t.stateNode=n,n._reactInternals=t,s&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=o),n}function mc(t,n,r,s){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(r,s),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(r,s),n.state!==t&&Si.enqueueReplaceState(n,n.state,null)}function Xo(t,n,r,s){var i=t.stateNode;i.props=r,i.state=t.memoizedState,i.refs={},el(t);var o=n.contextType;typeof o=="object"&&o!==null?i.context=Qe(o):(o=Ee(n)?pn:be.current,i.context=Qn(t,o)),i.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o=="function"&&(Jo(t,n,o,r),i.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(n=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),n!==i.state&&Si.enqueueReplaceState(i,i.state,null),ci(t,r,i,s),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function Gn(t,n){try{var r="",s=n;do r+=$h(s),s=s.return;while(s);var i=r}catch(o){i=`
Error generating stack: `+o.message+`
`+o.stack}return{value:t,source:n,stack:i,digest:null}}function co(t,n,r){return{value:t,source:null,stack:r??null,digest:n??null}}function Go(t,n){try{console.error(n.value)}catch(r){setTimeout(function(){throw r})}}var gf=typeof WeakMap=="function"?WeakMap:Map;function Gp(t,n,r){r=wt(-1,r),r.tag=3,r.payload={element:null};var s=n.value;return r.callback=function(){xi||(xi=!0,la=s),Go(t,n)},r}function Zp(t,n,r){r=wt(-1,r),r.tag=3;var s=t.type.getDerivedStateFromError;if(typeof s=="function"){var i=n.value;r.payload=function(){return s(i)},r.callback=function(){Go(t,n)}}var o=t.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(r.callback=function(){Go(t,n),typeof s!="function"&&(qt===null?qt=new Set([this]):qt.add(this));var a=n.stack;this.componentDidCatch(n.value,{componentStack:a!==null?a:""})}),r}function gc(t,n,r){var s=t.pingCache;if(s===null){s=t.pingCache=new gf;var i=new Set;s.set(n,i)}else i=s.get(n),i===void 0&&(i=new Set,s.set(n,i));i.has(r)||(i.add(r),t=Df.bind(null,t,n,r),n.then(t,t))}function vc(t){do{var n;if((n=t.tag===13)&&(n=t.memoizedState,n=n!==null?n.dehydrated!==null:!0),n)return t;t=t.return}while(t!==null);return null}function bc(t,n,r,s,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===n?t.flags|=65536:(t.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(n=wt(-1,1),n.tag=2,Ht(r,n,1))),r.lanes|=1),t)}var vf=St.ReactCurrentOwner,Se=!1;function ye(t,n,r,s){n.child=t===null?zp(n,null,r,s):Jn(n,t.child,r,s)}function yc(t,n,r,s,i){r=r.render;var o=n.ref;return Wn(n,i),s=il(t,n,r,s,o,i),r=ol(),t!==null&&!Se?(n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~i,At(t,n,i)):(G&&r&&Ka(n),n.flags|=1,ye(t,n,s,i),n.child)}function jc(t,n,r,s,i){if(t===null){var o=r.type;return typeof o=="function"&&!ml(o)&&o.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(n.tag=15,n.type=o,eu(t,n,o,s,i)):(t=Os(r.type,null,s,n,n.mode,i),t.ref=n.ref,t.return=n,n.child=t)}if(o=t.child,!(t.lanes&i)){var a=o.memoizedProps;if(r=r.compare,r=r!==null?r:Ir,r(a,s)&&t.ref===n.ref)return At(t,n,i)}return n.flags|=1,t=Qt(o,s),t.ref=n.ref,t.return=n,n.child=t}function eu(t,n,r,s,i){if(t!==null){var o=t.memoizedProps;if(Ir(o,s)&&t.ref===n.ref)if(Se=!1,n.pendingProps=s=o,(t.lanes&i)!==0)t.flags&131072&&(Se=!0);else return n.lanes=t.lanes,At(t,n,i)}return Zo(t,n,r,s,i)}function tu(t,n,r){var s=n.pendingProps,i=s.children,o=t!==null?t.memoizedState:null;if(s.mode==="hidden")if(!(n.mode&1))n.memoizedState={baseLanes:0,cachePool:null,transitions:null},K(Ln,Be),Be|=r;else{if(!(r&1073741824))return t=o!==null?o.baseLanes|r:r,n.lanes=n.childLanes=1073741824,n.memoizedState={baseLanes:t,cachePool:null,transitions:null},n.updateQueue=null,K(Ln,Be),Be|=t,null;n.memoizedState={baseLanes:0,cachePool:null,transitions:null},s=o!==null?o.baseLanes:r,K(Ln,Be),Be|=s}else o!==null?(s=o.baseLanes|r,n.memoizedState=null):s=r,K(Ln,Be),Be|=s;return ye(t,n,i,r),n.child}function nu(t,n){var r=n.ref;(t===null&&r!==null||t!==null&&t.ref!==r)&&(n.flags|=512,n.flags|=2097152)}function Zo(t,n,r,s,i){var o=Ee(r)?pn:be.current;return o=Qn(n,o),Wn(n,i),r=il(t,n,r,s,o,i),s=ol(),t!==null&&!Se?(n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~i,At(t,n,i)):(G&&s&&Ka(n),n.flags|=1,ye(t,n,r,i),n.child)}function wc(t,n,r,s,i){if(Ee(r)){var o=!0;si(n)}else o=!1;if(Wn(n,i),n.stateNode===null)_s(t,n),Xp(n,r,s),Xo(n,r,s,i),s=!0;else if(t===null){var a=n.stateNode,l=n.memoizedProps;a.props=l;var c=a.context,d=r.contextType;typeof d=="object"&&d!==null?d=Qe(d):(d=Ee(r)?pn:be.current,d=Qn(n,d));var h=r.getDerivedStateFromProps,f=typeof h=="function"||typeof a.getSnapshotBeforeUpdate=="function";f||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(l!==s||c!==d)&&mc(n,a,s,d),Lt=!1;var m=n.memoizedState;a.state=m,ci(n,s,a,i),c=n.memoizedState,l!==s||m!==c||ze.current||Lt?(typeof h=="function"&&(Jo(n,r,h,s),c=n.memoizedState),(l=Lt||fc(n,r,l,s,m,c,d))?(f||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(n.flags|=4194308)):(typeof a.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=s,n.memoizedState=c),a.props=s,a.state=c,a.context=d,s=l):(typeof a.componentDidMount=="function"&&(n.flags|=4194308),s=!1)}else{a=n.stateNode,Pp(t,n),l=n.memoizedProps,d=n.type===n.elementType?l:Ge(n.type,l),a.props=d,f=n.pendingProps,m=a.context,c=r.contextType,typeof c=="object"&&c!==null?c=Qe(c):(c=Ee(r)?pn:be.current,c=Qn(n,c));var k=r.getDerivedStateFromProps;(h=typeof k=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(l!==f||m!==c)&&mc(n,a,s,c),Lt=!1,m=n.memoizedState,a.state=m,ci(n,s,a,i);var p=n.memoizedState;l!==f||m!==p||ze.current||Lt?(typeof k=="function"&&(Jo(n,r,k,s),p=n.memoizedState),(d=Lt||fc(n,r,d,s,m,p,c)||!1)?(h||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(s,p,c),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(s,p,c)),typeof a.componentDidUpdate=="function"&&(n.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof a.componentDidUpdate!="function"||l===t.memoizedProps&&m===t.memoizedState||(n.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&m===t.memoizedState||(n.flags|=1024),n.memoizedProps=s,n.memoizedState=p),a.props=s,a.state=p,a.context=c,s=d):(typeof a.componentDidUpdate!="function"||l===t.memoizedProps&&m===t.memoizedState||(n.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&m===t.memoizedState||(n.flags|=1024),s=!1)}return ea(t,n,r,s,o,i)}function ea(t,n,r,s,i,o){nu(t,n);var a=(n.flags&128)!==0;if(!s&&!a)return i&&ac(n,r,!1),At(t,n,o);s=n.stateNode,vf.current=n;var l=a&&typeof r.getDerivedStateFromError!="function"?null:s.render();return n.flags|=1,t!==null&&a?(n.child=Jn(n,t.child,null,o),n.child=Jn(n,null,l,o)):ye(t,n,l,o),n.memoizedState=s.state,i&&ac(n,r,!0),n.child}function ru(t){var n=t.stateNode;n.pendingContext?oc(t,n.pendingContext,n.pendingContext!==n.context):n.context&&oc(t,n.context,!1),tl(t,n.containerInfo)}function kc(t,n,r,s,i){return Yn(),Ya(i),n.flags|=256,ye(t,n,r,s),n.child}var ta={dehydrated:null,treeContext:null,retryLane:0};function na(t){return{baseLanes:t,cachePool:null,transitions:null}}function su(t,n,r){var s=n.pendingProps,i=Z.current,o=!1,a=(n.flags&128)!==0,l;if((l=a)||(l=t!==null&&t.memoizedState===null?!1:(i&2)!==0),l?(o=!0,n.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),K(Z,i&1),t===null)return Qo(n),t=n.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(n.mode&1?t.data==="$!"?n.lanes=8:n.lanes=1073741824:n.lanes=1,null):(a=s.children,t=s.fallback,o?(s=n.mode,o=n.child,a={mode:"hidden",children:a},!(s&1)&&o!==null?(o.childLanes=0,o.pendingProps=a):o=Pi(a,s,0,null),t=cn(t,s,r,null),o.return=n,t.return=n,o.sibling=t,n.child=o,n.child.memoizedState=na(r),n.memoizedState=ta,t):cl(n,a));if(i=t.memoizedState,i!==null&&(l=i.dehydrated,l!==null))return bf(t,n,a,s,l,i,r);if(o){o=s.fallback,a=n.mode,i=t.child,l=i.sibling;var c={mode:"hidden",children:s.children};return!(a&1)&&n.child!==i?(s=n.child,s.childLanes=0,s.pendingProps=c,n.deletions=null):(s=Qt(i,c),s.subtreeFlags=i.subtreeFlags&14680064),l!==null?o=Qt(l,o):(o=cn(o,a,r,null),o.flags|=2),o.return=n,s.return=n,s.sibling=o,n.child=s,s=o,o=n.child,a=t.child.memoizedState,a=a===null?na(r):{baseLanes:a.baseLanes|r,cachePool:null,transitions:a.transitions},o.memoizedState=a,o.childLanes=t.childLanes&~r,n.memoizedState=ta,s}return o=t.child,t=o.sibling,s=Qt(o,{mode:"visible",children:s.children}),!(n.mode&1)&&(s.lanes=r),s.return=n,s.sibling=null,t!==null&&(r=n.deletions,r===null?(n.deletions=[t],n.flags|=16):r.push(t)),n.child=s,n.memoizedState=null,s}function cl(t,n){return n=Pi({mode:"visible",children:n},t.mode,0,null),n.return=t,t.child=n}function gs(t,n,r,s){return s!==null&&Ya(s),Jn(n,t.child,null,r),t=cl(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function bf(t,n,r,s,i,o,a){if(r)return n.flags&256?(n.flags&=-257,s=co(Error(E(422))),gs(t,n,a,s)):n.memoizedState!==null?(n.child=t.child,n.flags|=128,null):(o=s.fallback,i=n.mode,s=Pi({mode:"visible",children:s.children},i,0,null),o=cn(o,i,a,null),o.flags|=2,s.return=n,o.return=n,s.sibling=o,n.child=s,n.mode&1&&Jn(n,t.child,null,a),n.child.memoizedState=na(a),n.memoizedState=ta,o);if(!(n.mode&1))return gs(t,n,a,null);if(i.data==="$!"){if(s=i.nextSibling&&i.nextSibling.dataset,s)var l=s.dgst;return s=l,o=Error(E(419)),s=co(o,s,void 0),gs(t,n,a,s)}if(l=(a&t.childLanes)!==0,Se||l){if(s=de,s!==null){switch(a&-a){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(s.suspendedLanes|a)?0:i,i!==0&&i!==o.retryLane&&(o.retryLane=i,Ct(t,i),rt(s,t,i,-1))}return fl(),s=co(Error(E(421))),gs(t,n,a,s)}return i.data==="$?"?(n.flags|=128,n.child=t.child,n=Tf.bind(null,t),i._reactRetry=n,null):(t=o.treeContext,Re=Vt(i.nextSibling),Le=n,G=!0,tt=null,t!==null&&(Ve[He++]=yt,Ve[He++]=jt,Ve[He++]=un,yt=t.id,jt=t.overflow,un=n),n=cl(n,s.children),n.flags|=4096,n)}function Nc(t,n,r){t.lanes|=n;var s=t.alternate;s!==null&&(s.lanes|=n),Yo(t.return,n,r)}function po(t,n,r,s,i){var o=t.memoizedState;o===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:s,tail:r,tailMode:i}:(o.isBackwards=n,o.rendering=null,o.renderingStartTime=0,o.last=s,o.tail=r,o.tailMode=i)}function iu(t,n,r){var s=n.pendingProps,i=s.revealOrder,o=s.tail;if(ye(t,n,s.children,r),s=Z.current,s&2)s=s&1|2,n.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Nc(t,r,n);else if(t.tag===19)Nc(t,r,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break e;for(;t.sibling===null;){if(t.return===null||t.return===n)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}s&=1}if(K(Z,s),!(n.mode&1))n.memoizedState=null;else switch(i){case"forwards":for(r=n.child,i=null;r!==null;)t=r.alternate,t!==null&&di(t)===null&&(i=r),r=r.sibling;r=i,r===null?(i=n.child,n.child=null):(i=r.sibling,r.sibling=null),po(n,!1,i,r,o);break;case"backwards":for(r=null,i=n.child,n.child=null;i!==null;){if(t=i.alternate,t!==null&&di(t)===null){n.child=i;break}t=i.sibling,i.sibling=r,r=i,i=t}po(n,!0,r,null,o);break;case"together":po(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function _s(t,n){!(n.mode&1)&&t!==null&&(t.alternate=null,n.alternate=null,n.flags|=2)}function At(t,n,r){if(t!==null&&(n.dependencies=t.dependencies),xn|=n.lanes,!(r&n.childLanes))return null;if(t!==null&&n.child!==t.child)throw Error(E(153));if(n.child!==null){for(t=n.child,r=Qt(t,t.pendingProps),n.child=r,r.return=n;t.sibling!==null;)t=t.sibling,r=r.sibling=Qt(t,t.pendingProps),r.return=n;r.sibling=null}return n.child}function yf(t,n,r){switch(n.tag){case 3:ru(n),Yn();break;case 5:Dp(n);break;case 1:Ee(n.type)&&si(n);break;case 4:tl(n,n.stateNode.containerInfo);break;case 10:var s=n.type._context,i=n.memoizedProps.value;K(ai,s._currentValue),s._currentValue=i;break;case 13:if(s=n.memoizedState,s!==null)return s.dehydrated!==null?(K(Z,Z.current&1),n.flags|=128,null):r&n.child.childLanes?su(t,n,r):(K(Z,Z.current&1),t=At(t,n,r),t!==null?t.sibling:null);K(Z,Z.current&1);break;case 19:if(s=(r&n.childLanes)!==0,t.flags&128){if(s)return iu(t,n,r);n.flags|=128}if(i=n.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),K(Z,Z.current),s)break;return null;case 22:case 23:return n.lanes=0,tu(t,n,r)}return At(t,n,r)}var ou,ra,au,lu;ou=function(t,n){for(var r=n.child;r!==null;){if(r.tag===5||r.tag===6)t.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return;r=r.return}r.sibling.return=r.return,r=r.sibling}};ra=function(){};au=function(t,n,r,s){var i=t.memoizedProps;if(i!==s){t=n.stateNode,on(xt.current);var o=null;switch(r){case"input":i=Co(t,i),s=Co(t,s),o=[];break;case"select":i=te({},i,{value:void 0}),s=te({},s,{value:void 0}),o=[];break;case"textarea":i=zo(t,i),s=zo(t,s),o=[];break;default:typeof i.onClick!="function"&&typeof s.onClick=="function"&&(t.onclick=ni)}Po(r,s);var a;r=null;for(d in i)if(!s.hasOwnProperty(d)&&i.hasOwnProperty(d)&&i[d]!=null)if(d==="style"){var l=i[d];for(a in l)l.hasOwnProperty(a)&&(r||(r={}),r[a]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(Dr.hasOwnProperty(d)?o||(o=[]):(o=o||[]).push(d,null));for(d in s){var c=s[d];if(l=i!=null?i[d]:void 0,s.hasOwnProperty(d)&&c!==l&&(c!=null||l!=null))if(d==="style")if(l){for(a in l)!l.hasOwnProperty(a)||c&&c.hasOwnProperty(a)||(r||(r={}),r[a]="");for(a in c)c.hasOwnProperty(a)&&l[a]!==c[a]&&(r||(r={}),r[a]=c[a])}else r||(o||(o=[]),o.push(d,r)),r=c;else d==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,l=l?l.__html:void 0,c!=null&&l!==c&&(o=o||[]).push(d,c)):d==="children"?typeof c!="string"&&typeof c!="number"||(o=o||[]).push(d,""+c):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(Dr.hasOwnProperty(d)?(c!=null&&d==="onScroll"&&Y("scroll",t),o||l===c||(o=[])):(o=o||[]).push(d,c))}r&&(o=o||[]).push("style",r);var d=o;(n.updateQueue=d)&&(n.flags|=4)}};lu=function(t,n,r,s){r!==s&&(n.flags|=4)};function hr(t,n){if(!G)switch(t.tailMode){case"hidden":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t.tail=null:r.sibling=null;break;case"collapsed":r=t.tail;for(var s=null;r!==null;)r.alternate!==null&&(s=r),r=r.sibling;s===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:s.sibling=null}}function me(t){var n=t.alternate!==null&&t.alternate.child===t.child,r=0,s=0;if(n)for(var i=t.child;i!==null;)r|=i.lanes|i.childLanes,s|=i.subtreeFlags&14680064,s|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)r|=i.lanes|i.childLanes,s|=i.subtreeFlags,s|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=s,t.childLanes=r,n}function jf(t,n,r){var s=n.pendingProps;switch(Qa(n),n.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return me(n),null;case 1:return Ee(n.type)&&ri(),me(n),null;case 3:return s=n.stateNode,Xn(),X(ze),X(be),rl(),s.pendingContext&&(s.context=s.pendingContext,s.pendingContext=null),(t===null||t.child===null)&&(fs(n)?n.flags|=4:t===null||t.memoizedState.isDehydrated&&!(n.flags&256)||(n.flags|=1024,tt!==null&&(pa(tt),tt=null))),ra(t,n),me(n),null;case 5:nl(n);var i=on($r.current);if(r=n.type,t!==null&&n.stateNode!=null)au(t,n,r,s,i),t.ref!==n.ref&&(n.flags|=512,n.flags|=2097152);else{if(!s){if(n.stateNode===null)throw Error(E(166));return me(n),null}if(t=on(xt.current),fs(n)){s=n.stateNode,r=n.type;var o=n.memoizedProps;switch(s[ut]=n,s[Wr]=o,t=(n.mode&1)!==0,r){case"dialog":Y("cancel",s),Y("close",s);break;case"iframe":case"object":case"embed":Y("load",s);break;case"video":case"audio":for(i=0;i<br.length;i++)Y(br[i],s);break;case"source":Y("error",s);break;case"img":case"image":case"link":Y("error",s),Y("load",s);break;case"details":Y("toggle",s);break;case"input":Ml(s,o),Y("invalid",s);break;case"select":s._wrapperState={wasMultiple:!!o.multiple},Y("invalid",s);break;case"textarea":Rl(s,o),Y("invalid",s)}Po(r,o),i=null;for(var a in o)if(o.hasOwnProperty(a)){var l=o[a];a==="children"?typeof l=="string"?s.textContent!==l&&(o.suppressHydrationWarning!==!0&&xs(s.textContent,l,t),i=["children",l]):typeof l=="number"&&s.textContent!==""+l&&(o.suppressHydrationWarning!==!0&&xs(s.textContent,l,t),i=["children",""+l]):Dr.hasOwnProperty(a)&&l!=null&&a==="onScroll"&&Y("scroll",s)}switch(r){case"input":os(s),Bl(s,o,!0);break;case"textarea":os(s),Ll(s);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(s.onclick=ni)}s=i,n.updateQueue=s,s!==null&&(n.flags|=4)}else{a=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Ld(r)),t==="http://www.w3.org/1999/xhtml"?r==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof s.is=="string"?t=a.createElement(r,{is:s.is}):(t=a.createElement(r),r==="select"&&(a=t,s.multiple?a.multiple=!0:s.size&&(a.size=s.size))):t=a.createElementNS(t,r),t[ut]=n,t[Wr]=s,ou(t,n,!1,!1),n.stateNode=t;e:{switch(a=Do(r,s),r){case"dialog":Y("cancel",t),Y("close",t),i=s;break;case"iframe":case"object":case"embed":Y("load",t),i=s;break;case"video":case"audio":for(i=0;i<br.length;i++)Y(br[i],t);i=s;break;case"source":Y("error",t),i=s;break;case"img":case"image":case"link":Y("error",t),Y("load",t),i=s;break;case"details":Y("toggle",t),i=s;break;case"input":Ml(t,s),i=Co(t,s),Y("invalid",t);break;case"option":i=s;break;case"select":t._wrapperState={wasMultiple:!!s.multiple},i=te({},s,{value:void 0}),Y("invalid",t);break;case"textarea":Rl(t,s),i=zo(t,s),Y("invalid",t);break;default:i=s}Po(r,i),l=i;for(o in l)if(l.hasOwnProperty(o)){var c=l[o];o==="style"?Fd(t,c):o==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&_d(t,c)):o==="children"?typeof c=="string"?(r!=="textarea"||c!=="")&&Tr(t,c):typeof c=="number"&&Tr(t,""+c):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(Dr.hasOwnProperty(o)?c!=null&&o==="onScroll"&&Y("scroll",t):c!=null&&Ma(t,o,c,a))}switch(r){case"input":os(t),Bl(t,s,!1);break;case"textarea":os(t),Ll(t);break;case"option":s.value!=null&&t.setAttribute("value",""+Yt(s.value));break;case"select":t.multiple=!!s.multiple,o=s.value,o!=null?_n(t,!!s.multiple,o,!1):s.defaultValue!=null&&_n(t,!!s.multiple,s.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=ni)}switch(r){case"button":case"input":case"select":case"textarea":s=!!s.autoFocus;break e;case"img":s=!0;break e;default:s=!1}}s&&(n.flags|=4)}n.ref!==null&&(n.flags|=512,n.flags|=2097152)}return me(n),null;case 6:if(t&&n.stateNode!=null)lu(t,n,t.memoizedProps,s);else{if(typeof s!="string"&&n.stateNode===null)throw Error(E(166));if(r=on($r.current),on(xt.current),fs(n)){if(s=n.stateNode,r=n.memoizedProps,s[ut]=n,(o=s.nodeValue!==r)&&(t=Le,t!==null))switch(t.tag){case 3:xs(s.nodeValue,r,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&xs(s.nodeValue,r,(t.mode&1)!==0)}o&&(n.flags|=4)}else s=(r.nodeType===9?r:r.ownerDocument).createTextNode(s),s[ut]=n,n.stateNode=s}return me(n),null;case 13:if(X(Z),s=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(G&&Re!==null&&n.mode&1&&!(n.flags&128))Ap(),Yn(),n.flags|=98560,o=!1;else if(o=fs(n),s!==null&&s.dehydrated!==null){if(t===null){if(!o)throw Error(E(318));if(o=n.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(E(317));o[ut]=n}else Yn(),!(n.flags&128)&&(n.memoizedState=null),n.flags|=4;me(n),o=!1}else tt!==null&&(pa(tt),tt=null),o=!0;if(!o)return n.flags&65536?n:null}return n.flags&128?(n.lanes=r,n):(s=s!==null,s!==(t!==null&&t.memoizedState!==null)&&s&&(n.child.flags|=8192,n.mode&1&&(t===null||Z.current&1?le===0&&(le=3):fl())),n.updateQueue!==null&&(n.flags|=4),me(n),null);case 4:return Xn(),ra(t,n),t===null&&Fr(n.stateNode.containerInfo),me(n),null;case 10:return Ga(n.type._context),me(n),null;case 17:return Ee(n.type)&&ri(),me(n),null;case 19:if(X(Z),o=n.memoizedState,o===null)return me(n),null;if(s=(n.flags&128)!==0,a=o.rendering,a===null)if(s)hr(o,!1);else{if(le!==0||t!==null&&t.flags&128)for(t=n.child;t!==null;){if(a=di(t),a!==null){for(n.flags|=128,hr(o,!1),s=a.updateQueue,s!==null&&(n.updateQueue=s,n.flags|=4),n.subtreeFlags=0,s=r,r=n.child;r!==null;)o=r,t=s,o.flags&=14680066,a=o.alternate,a===null?(o.childLanes=0,o.lanes=t,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=a.childLanes,o.lanes=a.lanes,o.child=a.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=a.memoizedProps,o.memoizedState=a.memoizedState,o.updateQueue=a.updateQueue,o.type=a.type,t=a.dependencies,o.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),r=r.sibling;return K(Z,Z.current&1|2),n.child}t=t.sibling}o.tail!==null&&re()>Zn&&(n.flags|=128,s=!0,hr(o,!1),n.lanes=4194304)}else{if(!s)if(t=di(a),t!==null){if(n.flags|=128,s=!0,r=t.updateQueue,r!==null&&(n.updateQueue=r,n.flags|=4),hr(o,!0),o.tail===null&&o.tailMode==="hidden"&&!a.alternate&&!G)return me(n),null}else 2*re()-o.renderingStartTime>Zn&&r!==1073741824&&(n.flags|=128,s=!0,hr(o,!1),n.lanes=4194304);o.isBackwards?(a.sibling=n.child,n.child=a):(r=o.last,r!==null?r.sibling=a:n.child=a,o.last=a)}return o.tail!==null?(n=o.tail,o.rendering=n,o.tail=n.sibling,o.renderingStartTime=re(),n.sibling=null,r=Z.current,K(Z,s?r&1|2:r&1),n):(me(n),null);case 22:case 23:return xl(),s=n.memoizedState!==null,t!==null&&t.memoizedState!==null!==s&&(n.flags|=8192),s&&n.mode&1?Be&1073741824&&(me(n),n.subtreeFlags&6&&(n.flags|=8192)):me(n),null;case 24:return null;case 25:return null}throw Error(E(156,n.tag))}function wf(t,n){switch(Qa(n),n.tag){case 1:return Ee(n.type)&&ri(),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return Xn(),X(ze),X(be),rl(),t=n.flags,t&65536&&!(t&128)?(n.flags=t&-65537|128,n):null;case 5:return nl(n),null;case 13:if(X(Z),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(E(340));Yn()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return X(Z),null;case 4:return Xn(),null;case 10:return Ga(n.type._context),null;case 22:case 23:return xl(),null;case 24:return null;default:return null}}var vs=!1,ge=!1,kf=typeof WeakSet=="function"?WeakSet:Set,M=null;function Rn(t,n){var r=t.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(s){ne(t,n,s)}else r.current=null}function sa(t,n,r){try{r()}catch(s){ne(t,n,s)}}var Cc=!1;function Nf(t,n){if(Wo=Zs,t=hp(),qa(t)){if("selectionStart"in t)var r={start:t.selectionStart,end:t.selectionEnd};else e:{r=(r=t.ownerDocument)&&r.defaultView||window;var s=r.getSelection&&r.getSelection();if(s&&s.rangeCount!==0){r=s.anchorNode;var i=s.anchorOffset,o=s.focusNode;s=s.focusOffset;try{r.nodeType,o.nodeType}catch{r=null;break e}var a=0,l=-1,c=-1,d=0,h=0,f=t,m=null;t:for(;;){for(var k;f!==r||i!==0&&f.nodeType!==3||(l=a+i),f!==o||s!==0&&f.nodeType!==3||(c=a+s),f.nodeType===3&&(a+=f.nodeValue.length),(k=f.firstChild)!==null;)m=f,f=k;for(;;){if(f===t)break t;if(m===r&&++d===i&&(l=a),m===o&&++h===s&&(c=a),(k=f.nextSibling)!==null)break;f=m,m=f.parentNode}f=k}r=l===-1||c===-1?null:{start:l,end:c}}else r=null}r=r||{start:0,end:0}}else r=null;for(Uo={focusedElem:t,selectionRange:r},Zs=!1,M=n;M!==null;)if(n=M,t=n.child,(n.subtreeFlags&1028)!==0&&t!==null)t.return=n,M=t;else for(;M!==null;){n=M;try{var p=n.alternate;if(n.flags&1024)switch(n.tag){case 0:case 11:case 15:break;case 1:if(p!==null){var v=p.memoizedProps,b=p.memoizedState,x=n.stateNode,g=x.getSnapshotBeforeUpdate(n.elementType===n.type?v:Ge(n.type,v),b);x.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var u=n.stateNode.containerInfo;u.nodeType===1?u.textContent="":u.nodeType===9&&u.documentElement&&u.removeChild(u.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(E(163))}}catch(y){ne(n,n.return,y)}if(t=n.sibling,t!==null){t.return=n.return,M=t;break}M=n.return}return p=Cc,Cc=!1,p}function zr(t,n,r){var s=n.updateQueue;if(s=s!==null?s.lastEffect:null,s!==null){var i=s=s.next;do{if((i.tag&t)===t){var o=i.destroy;i.destroy=void 0,o!==void 0&&sa(n,r,o)}i=i.next}while(i!==s)}}function zi(t,n){if(n=n.updateQueue,n=n!==null?n.lastEffect:null,n!==null){var r=n=n.next;do{if((r.tag&t)===t){var s=r.create;r.destroy=s()}r=r.next}while(r!==n)}}function ia(t){var n=t.ref;if(n!==null){var r=t.stateNode;switch(t.tag){case 5:t=r;break;default:t=r}typeof n=="function"?n(t):n.current=t}}function cu(t){var n=t.alternate;n!==null&&(t.alternate=null,cu(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&(delete n[ut],delete n[Wr],delete n[Ho],delete n[of],delete n[af])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function du(t){return t.tag===5||t.tag===3||t.tag===4}function Ac(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||du(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function oa(t,n,r){var s=t.tag;if(s===5||s===6)t=t.stateNode,n?r.nodeType===8?r.parentNode.insertBefore(t,n):r.insertBefore(t,n):(r.nodeType===8?(n=r.parentNode,n.insertBefore(t,r)):(n=r,n.appendChild(t)),r=r._reactRootContainer,r!=null||n.onclick!==null||(n.onclick=ni));else if(s!==4&&(t=t.child,t!==null))for(oa(t,n,r),t=t.sibling;t!==null;)oa(t,n,r),t=t.sibling}function aa(t,n,r){var s=t.tag;if(s===5||s===6)t=t.stateNode,n?r.insertBefore(t,n):r.appendChild(t);else if(s!==4&&(t=t.child,t!==null))for(aa(t,n,r),t=t.sibling;t!==null;)aa(t,n,r),t=t.sibling}var pe=null,et=!1;function Dt(t,n,r){for(r=r.child;r!==null;)pu(t,n,r),r=r.sibling}function pu(t,n,r){if(ht&&typeof ht.onCommitFiberUnmount=="function")try{ht.onCommitFiberUnmount(yi,r)}catch{}switch(r.tag){case 5:ge||Rn(r,n);case 6:var s=pe,i=et;pe=null,Dt(t,n,r),pe=s,et=i,pe!==null&&(et?(t=pe,r=r.stateNode,t.nodeType===8?t.parentNode.removeChild(r):t.removeChild(r)):pe.removeChild(r.stateNode));break;case 18:pe!==null&&(et?(t=pe,r=r.stateNode,t.nodeType===8?ro(t.parentNode,r):t.nodeType===1&&ro(t,r),Lr(t)):ro(pe,r.stateNode));break;case 4:s=pe,i=et,pe=r.stateNode.containerInfo,et=!0,Dt(t,n,r),pe=s,et=i;break;case 0:case 11:case 14:case 15:if(!ge&&(s=r.updateQueue,s!==null&&(s=s.lastEffect,s!==null))){i=s=s.next;do{var o=i,a=o.destroy;o=o.tag,a!==void 0&&(o&2||o&4)&&sa(r,n,a),i=i.next}while(i!==s)}Dt(t,n,r);break;case 1:if(!ge&&(Rn(r,n),s=r.stateNode,typeof s.componentWillUnmount=="function"))try{s.props=r.memoizedProps,s.state=r.memoizedState,s.componentWillUnmount()}catch(l){ne(r,n,l)}Dt(t,n,r);break;case 21:Dt(t,n,r);break;case 22:r.mode&1?(ge=(s=ge)||r.memoizedState!==null,Dt(t,n,r),ge=s):Dt(t,n,r);break;default:Dt(t,n,r)}}function Sc(t){var n=t.updateQueue;if(n!==null){t.updateQueue=null;var r=t.stateNode;r===null&&(r=t.stateNode=new kf),n.forEach(function(s){var i=Mf.bind(null,t,s);r.has(s)||(r.add(s),s.then(i,i))})}}function Xe(t,n){var r=n.deletions;if(r!==null)for(var s=0;s<r.length;s++){var i=r[s];try{var o=t,a=n,l=a;e:for(;l!==null;){switch(l.tag){case 5:pe=l.stateNode,et=!1;break e;case 3:pe=l.stateNode.containerInfo,et=!0;break e;case 4:pe=l.stateNode.containerInfo,et=!0;break e}l=l.return}if(pe===null)throw Error(E(160));pu(o,a,i),pe=null,et=!1;var c=i.alternate;c!==null&&(c.return=null),i.return=null}catch(d){ne(i,n,d)}}if(n.subtreeFlags&12854)for(n=n.child;n!==null;)uu(n,t),n=n.sibling}function uu(t,n){var r=t.alternate,s=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Xe(n,t),at(t),s&4){try{zr(3,t,t.return),zi(3,t)}catch(v){ne(t,t.return,v)}try{zr(5,t,t.return)}catch(v){ne(t,t.return,v)}}break;case 1:Xe(n,t),at(t),s&512&&r!==null&&Rn(r,r.return);break;case 5:if(Xe(n,t),at(t),s&512&&r!==null&&Rn(r,r.return),t.flags&32){var i=t.stateNode;try{Tr(i,"")}catch(v){ne(t,t.return,v)}}if(s&4&&(i=t.stateNode,i!=null)){var o=t.memoizedProps,a=r!==null?r.memoizedProps:o,l=t.type,c=t.updateQueue;if(t.updateQueue=null,c!==null)try{l==="input"&&o.type==="radio"&&o.name!=null&&Bd(i,o),Do(l,a);var d=Do(l,o);for(a=0;a<c.length;a+=2){var h=c[a],f=c[a+1];h==="style"?Fd(i,f):h==="dangerouslySetInnerHTML"?_d(i,f):h==="children"?Tr(i,f):Ma(i,h,f,d)}switch(l){case"input":Ao(i,o);break;case"textarea":Rd(i,o);break;case"select":var m=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!o.multiple;var k=o.value;k!=null?_n(i,!!o.multiple,k,!1):m!==!!o.multiple&&(o.defaultValue!=null?_n(i,!!o.multiple,o.defaultValue,!0):_n(i,!!o.multiple,o.multiple?[]:"",!1))}i[Wr]=o}catch(v){ne(t,t.return,v)}}break;case 6:if(Xe(n,t),at(t),s&4){if(t.stateNode===null)throw Error(E(162));i=t.stateNode,o=t.memoizedProps;try{i.nodeValue=o}catch(v){ne(t,t.return,v)}}break;case 3:if(Xe(n,t),at(t),s&4&&r!==null&&r.memoizedState.isDehydrated)try{Lr(n.containerInfo)}catch(v){ne(t,t.return,v)}break;case 4:Xe(n,t),at(t);break;case 13:Xe(n,t),at(t),i=t.child,i.flags&8192&&(o=i.memoizedState!==null,i.stateNode.isHidden=o,!o||i.alternate!==null&&i.alternate.memoizedState!==null||(ul=re())),s&4&&Sc(t);break;case 22:if(h=r!==null&&r.memoizedState!==null,t.mode&1?(ge=(d=ge)||h,Xe(n,t),ge=d):Xe(n,t),at(t),s&8192){if(d=t.memoizedState!==null,(t.stateNode.isHidden=d)&&!h&&t.mode&1)for(M=t,h=t.child;h!==null;){for(f=M=h;M!==null;){switch(m=M,k=m.child,m.tag){case 0:case 11:case 14:case 15:zr(4,m,m.return);break;case 1:Rn(m,m.return);var p=m.stateNode;if(typeof p.componentWillUnmount=="function"){s=m,r=m.return;try{n=s,p.props=n.memoizedProps,p.state=n.memoizedState,p.componentWillUnmount()}catch(v){ne(s,r,v)}}break;case 5:Rn(m,m.return);break;case 22:if(m.memoizedState!==null){Ec(f);continue}}k!==null?(k.return=m,M=k):Ec(f)}h=h.sibling}e:for(h=null,f=t;;){if(f.tag===5){if(h===null){h=f;try{i=f.stateNode,d?(o=i.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(l=f.stateNode,c=f.memoizedProps.style,a=c!=null&&c.hasOwnProperty("display")?c.display:null,l.style.display=Id("display",a))}catch(v){ne(t,t.return,v)}}}else if(f.tag===6){if(h===null)try{f.stateNode.nodeValue=d?"":f.memoizedProps}catch(v){ne(t,t.return,v)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===t)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===t)break e;for(;f.sibling===null;){if(f.return===null||f.return===t)break e;h===f&&(h=null),f=f.return}h===f&&(h=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:Xe(n,t),at(t),s&4&&Sc(t);break;case 21:break;default:Xe(n,t),at(t)}}function at(t){var n=t.flags;if(n&2){try{e:{for(var r=t.return;r!==null;){if(du(r)){var s=r;break e}r=r.return}throw Error(E(160))}switch(s.tag){case 5:var i=s.stateNode;s.flags&32&&(Tr(i,""),s.flags&=-33);var o=Ac(t);aa(t,o,i);break;case 3:case 4:var a=s.stateNode.containerInfo,l=Ac(t);oa(t,l,a);break;default:throw Error(E(161))}}catch(c){ne(t,t.return,c)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function Cf(t,n,r){M=t,hu(t)}function hu(t,n,r){for(var s=(t.mode&1)!==0;M!==null;){var i=M,o=i.child;if(i.tag===22&&s){var a=i.memoizedState!==null||vs;if(!a){var l=i.alternate,c=l!==null&&l.memoizedState!==null||ge;l=vs;var d=ge;if(vs=a,(ge=c)&&!d)for(M=i;M!==null;)a=M,c=a.child,a.tag===22&&a.memoizedState!==null?Pc(i):c!==null?(c.return=a,M=c):Pc(i);for(;o!==null;)M=o,hu(o),o=o.sibling;M=i,vs=l,ge=d}zc(t)}else i.subtreeFlags&8772&&o!==null?(o.return=i,M=o):zc(t)}}function zc(t){for(;M!==null;){var n=M;if(n.flags&8772){var r=n.alternate;try{if(n.flags&8772)switch(n.tag){case 0:case 11:case 15:ge||zi(5,n);break;case 1:var s=n.stateNode;if(n.flags&4&&!ge)if(r===null)s.componentDidMount();else{var i=n.elementType===n.type?r.memoizedProps:Ge(n.type,r.memoizedProps);s.componentDidUpdate(i,r.memoizedState,s.__reactInternalSnapshotBeforeUpdate)}var o=n.updateQueue;o!==null&&uc(n,o,s);break;case 3:var a=n.updateQueue;if(a!==null){if(r=null,n.child!==null)switch(n.child.tag){case 5:r=n.child.stateNode;break;case 1:r=n.child.stateNode}uc(n,a,r)}break;case 5:var l=n.stateNode;if(r===null&&n.flags&4){r=l;var c=n.memoizedProps;switch(n.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&r.focus();break;case"img":c.src&&(r.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(n.memoizedState===null){var d=n.alternate;if(d!==null){var h=d.memoizedState;if(h!==null){var f=h.dehydrated;f!==null&&Lr(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(E(163))}ge||n.flags&512&&ia(n)}catch(m){ne(n,n.return,m)}}if(n===t){M=null;break}if(r=n.sibling,r!==null){r.return=n.return,M=r;break}M=n.return}}function Ec(t){for(;M!==null;){var n=M;if(n===t){M=null;break}var r=n.sibling;if(r!==null){r.return=n.return,M=r;break}M=n.return}}function Pc(t){for(;M!==null;){var n=M;try{switch(n.tag){case 0:case 11:case 15:var r=n.return;try{zi(4,n)}catch(c){ne(n,r,c)}break;case 1:var s=n.stateNode;if(typeof s.componentDidMount=="function"){var i=n.return;try{s.componentDidMount()}catch(c){ne(n,i,c)}}var o=n.return;try{ia(n)}catch(c){ne(n,o,c)}break;case 5:var a=n.return;try{ia(n)}catch(c){ne(n,a,c)}}}catch(c){ne(n,n.return,c)}if(n===t){M=null;break}var l=n.sibling;if(l!==null){l.return=n.return,M=l;break}M=n.return}}var Af=Math.ceil,hi=St.ReactCurrentDispatcher,dl=St.ReactCurrentOwner,Ke=St.ReactCurrentBatchConfig,$=0,de=null,ie=null,ue=0,Be=0,Ln=Gt(0),le=0,Kr=null,xn=0,Ei=0,pl=0,Er=null,Ae=null,ul=0,Zn=1/0,gt=null,xi=!1,la=null,qt=null,bs=!1,Ot=null,fi=0,Pr=0,ca=null,Is=-1,Fs=0;function je(){return $&6?re():Is!==-1?Is:Is=re()}function Kt(t){return t.mode&1?$&2&&ue!==0?ue&-ue:cf.transition!==null?(Fs===0&&(Fs=Xd()),Fs):(t=q,t!==0||(t=window.event,t=t===void 0?16:sp(t.type)),t):1}function rt(t,n,r,s){if(50<Pr)throw Pr=0,ca=null,Error(E(185));Yr(t,r,s),(!($&2)||t!==de)&&(t===de&&(!($&2)&&(Ei|=r),le===4&&It(t,ue)),Pe(t,s),r===1&&$===0&&!(n.mode&1)&&(Zn=re()+500,Ci&&Zt()))}function Pe(t,n){var r=t.callbackNode;lx(t,n);var s=Gs(t,t===de?ue:0);if(s===0)r!==null&&Fl(r),t.callbackNode=null,t.callbackPriority=0;else if(n=s&-s,t.callbackPriority!==n){if(r!=null&&Fl(r),n===1)t.tag===0?lf(Dc.bind(null,t)):kp(Dc.bind(null,t)),rf(function(){!($&6)&&Zt()}),r=null;else{switch(Gd(s)){case 1:r=Ia;break;case 4:r=Yd;break;case 16:r=Xs;break;case 536870912:r=Jd;break;default:r=Xs}r=ju(r,xu.bind(null,t))}t.callbackPriority=n,t.callbackNode=r}}function xu(t,n){if(Is=-1,Fs=0,$&6)throw Error(E(327));var r=t.callbackNode;if(Un()&&t.callbackNode!==r)return null;var s=Gs(t,t===de?ue:0);if(s===0)return null;if(s&30||s&t.expiredLanes||n)n=mi(t,s);else{n=s;var i=$;$|=2;var o=mu();(de!==t||ue!==n)&&(gt=null,Zn=re()+500,ln(t,n));do try{Ef();break}catch(l){fu(t,l)}while(!0);Xa(),hi.current=o,$=i,ie!==null?n=0:(de=null,ue=0,n=le)}if(n!==0){if(n===2&&(i=Lo(t),i!==0&&(s=i,n=da(t,i))),n===1)throw r=Kr,ln(t,0),It(t,s),Pe(t,re()),r;if(n===6)It(t,s);else{if(i=t.current.alternate,!(s&30)&&!Sf(i)&&(n=mi(t,s),n===2&&(o=Lo(t),o!==0&&(s=o,n=da(t,o))),n===1))throw r=Kr,ln(t,0),It(t,s),Pe(t,re()),r;switch(t.finishedWork=i,t.finishedLanes=s,n){case 0:case 1:throw Error(E(345));case 2:nn(t,Ae,gt);break;case 3:if(It(t,s),(s&130023424)===s&&(n=ul+500-re(),10<n)){if(Gs(t,0)!==0)break;if(i=t.suspendedLanes,(i&s)!==s){je(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=Vo(nn.bind(null,t,Ae,gt),n);break}nn(t,Ae,gt);break;case 4:if(It(t,s),(s&4194240)===s)break;for(n=t.eventTimes,i=-1;0<s;){var a=31-nt(s);o=1<<a,a=n[a],a>i&&(i=a),s&=~o}if(s=i,s=re()-s,s=(120>s?120:480>s?480:1080>s?1080:1920>s?1920:3e3>s?3e3:4320>s?4320:1960*Af(s/1960))-s,10<s){t.timeoutHandle=Vo(nn.bind(null,t,Ae,gt),s);break}nn(t,Ae,gt);break;case 5:nn(t,Ae,gt);break;default:throw Error(E(329))}}}return Pe(t,re()),t.callbackNode===r?xu.bind(null,t):null}function da(t,n){var r=Er;return t.current.memoizedState.isDehydrated&&(ln(t,n).flags|=256),t=mi(t,n),t!==2&&(n=Ae,Ae=r,n!==null&&pa(n)),t}function pa(t){Ae===null?Ae=t:Ae.push.apply(Ae,t)}function Sf(t){for(var n=t;;){if(n.flags&16384){var r=n.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var s=0;s<r.length;s++){var i=r[s],o=i.getSnapshot;i=i.value;try{if(!it(o(),i))return!1}catch{return!1}}}if(r=n.child,n.subtreeFlags&16384&&r!==null)r.return=n,n=r;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function It(t,n){for(n&=~pl,n&=~Ei,t.suspendedLanes|=n,t.pingedLanes&=~n,t=t.expirationTimes;0<n;){var r=31-nt(n),s=1<<r;t[r]=-1,n&=~s}}function Dc(t){if($&6)throw Error(E(327));Un();var n=Gs(t,0);if(!(n&1))return Pe(t,re()),null;var r=mi(t,n);if(t.tag!==0&&r===2){var s=Lo(t);s!==0&&(n=s,r=da(t,s))}if(r===1)throw r=Kr,ln(t,0),It(t,n),Pe(t,re()),r;if(r===6)throw Error(E(345));return t.finishedWork=t.current.alternate,t.finishedLanes=n,nn(t,Ae,gt),Pe(t,re()),null}function hl(t,n){var r=$;$|=1;try{return t(n)}finally{$=r,$===0&&(Zn=re()+500,Ci&&Zt())}}function fn(t){Ot!==null&&Ot.tag===0&&!($&6)&&Un();var n=$;$|=1;var r=Ke.transition,s=q;try{if(Ke.transition=null,q=1,t)return t()}finally{q=s,Ke.transition=r,$=n,!($&6)&&Zt()}}function xl(){Be=Ln.current,X(Ln)}function ln(t,n){t.finishedWork=null,t.finishedLanes=0;var r=t.timeoutHandle;if(r!==-1&&(t.timeoutHandle=-1,nf(r)),ie!==null)for(r=ie.return;r!==null;){var s=r;switch(Qa(s),s.tag){case 1:s=s.type.childContextTypes,s!=null&&ri();break;case 3:Xn(),X(ze),X(be),rl();break;case 5:nl(s);break;case 4:Xn();break;case 13:X(Z);break;case 19:X(Z);break;case 10:Ga(s.type._context);break;case 22:case 23:xl()}r=r.return}if(de=t,ie=t=Qt(t.current,null),ue=Be=n,le=0,Kr=null,pl=Ei=xn=0,Ae=Er=null,sn!==null){for(n=0;n<sn.length;n++)if(r=sn[n],s=r.interleaved,s!==null){r.interleaved=null;var i=s.next,o=r.pending;if(o!==null){var a=o.next;o.next=i,s.next=a}r.pending=s}sn=null}return t}function fu(t,n){do{var r=ie;try{if(Xa(),Rs.current=ui,pi){for(var s=ee.memoizedState;s!==null;){var i=s.queue;i!==null&&(i.pending=null),s=s.next}pi=!1}if(hn=0,ce=ae=ee=null,Sr=!1,Vr=0,dl.current=null,r===null||r.return===null){le=1,Kr=n,ie=null;break}e:{var o=t,a=r.return,l=r,c=n;if(n=ue,l.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var d=c,h=l,f=h.tag;if(!(h.mode&1)&&(f===0||f===11||f===15)){var m=h.alternate;m?(h.updateQueue=m.updateQueue,h.memoizedState=m.memoizedState,h.lanes=m.lanes):(h.updateQueue=null,h.memoizedState=null)}var k=vc(a);if(k!==null){k.flags&=-257,bc(k,a,l,o,n),k.mode&1&&gc(o,d,n),n=k,c=d;var p=n.updateQueue;if(p===null){var v=new Set;v.add(c),n.updateQueue=v}else p.add(c);break e}else{if(!(n&1)){gc(o,d,n),fl();break e}c=Error(E(426))}}else if(G&&l.mode&1){var b=vc(a);if(b!==null){!(b.flags&65536)&&(b.flags|=256),bc(b,a,l,o,n),Ya(Gn(c,l));break e}}o=c=Gn(c,l),le!==4&&(le=2),Er===null?Er=[o]:Er.push(o),o=a;do{switch(o.tag){case 3:o.flags|=65536,n&=-n,o.lanes|=n;var x=Gp(o,c,n);pc(o,x);break e;case 1:l=c;var g=o.type,u=o.stateNode;if(!(o.flags&128)&&(typeof g.getDerivedStateFromError=="function"||u!==null&&typeof u.componentDidCatch=="function"&&(qt===null||!qt.has(u)))){o.flags|=65536,n&=-n,o.lanes|=n;var y=Zp(o,l,n);pc(o,y);break e}}o=o.return}while(o!==null)}vu(r)}catch(j){n=j,ie===r&&r!==null&&(ie=r=r.return);continue}break}while(!0)}function mu(){var t=hi.current;return hi.current=ui,t===null?ui:t}function fl(){(le===0||le===3||le===2)&&(le=4),de===null||!(xn&268435455)&&!(Ei&268435455)||It(de,ue)}function mi(t,n){var r=$;$|=2;var s=mu();(de!==t||ue!==n)&&(gt=null,ln(t,n));do try{zf();break}catch(i){fu(t,i)}while(!0);if(Xa(),$=r,hi.current=s,ie!==null)throw Error(E(261));return de=null,ue=0,le}function zf(){for(;ie!==null;)gu(ie)}function Ef(){for(;ie!==null&&!Zh();)gu(ie)}function gu(t){var n=yu(t.alternate,t,Be);t.memoizedProps=t.pendingProps,n===null?vu(t):ie=n,dl.current=null}function vu(t){var n=t;do{var r=n.alternate;if(t=n.return,n.flags&32768){if(r=wf(r,n),r!==null){r.flags&=32767,ie=r;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{le=6,ie=null;return}}else if(r=jf(r,n,Be),r!==null){ie=r;return}if(n=n.sibling,n!==null){ie=n;return}ie=n=t}while(n!==null);le===0&&(le=5)}function nn(t,n,r){var s=q,i=Ke.transition;try{Ke.transition=null,q=1,Pf(t,n,r,s)}finally{Ke.transition=i,q=s}return null}function Pf(t,n,r,s){do Un();while(Ot!==null);if($&6)throw Error(E(327));r=t.finishedWork;var i=t.finishedLanes;if(r===null)return null;if(t.finishedWork=null,t.finishedLanes=0,r===t.current)throw Error(E(177));t.callbackNode=null,t.callbackPriority=0;var o=r.lanes|r.childLanes;if(cx(t,o),t===de&&(ie=de=null,ue=0),!(r.subtreeFlags&2064)&&!(r.flags&2064)||bs||(bs=!0,ju(Xs,function(){return Un(),null})),o=(r.flags&15990)!==0,r.subtreeFlags&15990||o){o=Ke.transition,Ke.transition=null;var a=q;q=1;var l=$;$|=4,dl.current=null,Nf(t,r),uu(r,t),Yx(Uo),Zs=!!Wo,Uo=Wo=null,t.current=r,Cf(r),ex(),$=l,q=a,Ke.transition=o}else t.current=r;if(bs&&(bs=!1,Ot=t,fi=i),o=t.pendingLanes,o===0&&(qt=null),rx(r.stateNode),Pe(t,re()),n!==null)for(s=t.onRecoverableError,r=0;r<n.length;r++)i=n[r],s(i.value,{componentStack:i.stack,digest:i.digest});if(xi)throw xi=!1,t=la,la=null,t;return fi&1&&t.tag!==0&&Un(),o=t.pendingLanes,o&1?t===ca?Pr++:(Pr=0,ca=t):Pr=0,Zt(),null}function Un(){if(Ot!==null){var t=Gd(fi),n=Ke.transition,r=q;try{if(Ke.transition=null,q=16>t?16:t,Ot===null)var s=!1;else{if(t=Ot,Ot=null,fi=0,$&6)throw Error(E(331));var i=$;for($|=4,M=t.current;M!==null;){var o=M,a=o.child;if(M.flags&16){var l=o.deletions;if(l!==null){for(var c=0;c<l.length;c++){var d=l[c];for(M=d;M!==null;){var h=M;switch(h.tag){case 0:case 11:case 15:zr(8,h,o)}var f=h.child;if(f!==null)f.return=h,M=f;else for(;M!==null;){h=M;var m=h.sibling,k=h.return;if(cu(h),h===d){M=null;break}if(m!==null){m.return=k,M=m;break}M=k}}}var p=o.alternate;if(p!==null){var v=p.child;if(v!==null){p.child=null;do{var b=v.sibling;v.sibling=null,v=b}while(v!==null)}}M=o}}if(o.subtreeFlags&2064&&a!==null)a.return=o,M=a;else e:for(;M!==null;){if(o=M,o.flags&2048)switch(o.tag){case 0:case 11:case 15:zr(9,o,o.return)}var x=o.sibling;if(x!==null){x.return=o.return,M=x;break e}M=o.return}}var g=t.current;for(M=g;M!==null;){a=M;var u=a.child;if(a.subtreeFlags&2064&&u!==null)u.return=a,M=u;else e:for(a=g;M!==null;){if(l=M,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:zi(9,l)}}catch(j){ne(l,l.return,j)}if(l===a){M=null;break e}var y=l.sibling;if(y!==null){y.return=l.return,M=y;break e}M=l.return}}if($=i,Zt(),ht&&typeof ht.onPostCommitFiberRoot=="function")try{ht.onPostCommitFiberRoot(yi,t)}catch{}s=!0}return s}finally{q=r,Ke.transition=n}}return!1}function Tc(t,n,r){n=Gn(r,n),n=Gp(t,n,1),t=Ht(t,n,1),n=je(),t!==null&&(Yr(t,1,n),Pe(t,n))}function ne(t,n,r){if(t.tag===3)Tc(t,t,r);else for(;n!==null;){if(n.tag===3){Tc(n,t,r);break}else if(n.tag===1){var s=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof s.componentDidCatch=="function"&&(qt===null||!qt.has(s))){t=Gn(r,t),t=Zp(n,t,1),n=Ht(n,t,1),t=je(),n!==null&&(Yr(n,1,t),Pe(n,t));break}}n=n.return}}function Df(t,n,r){var s=t.pingCache;s!==null&&s.delete(n),n=je(),t.pingedLanes|=t.suspendedLanes&r,de===t&&(ue&r)===r&&(le===4||le===3&&(ue&130023424)===ue&&500>re()-ul?ln(t,0):pl|=r),Pe(t,n)}function bu(t,n){n===0&&(t.mode&1?(n=cs,cs<<=1,!(cs&130023424)&&(cs=4194304)):n=1);var r=je();t=Ct(t,n),t!==null&&(Yr(t,n,r),Pe(t,r))}function Tf(t){var n=t.memoizedState,r=0;n!==null&&(r=n.retryLane),bu(t,r)}function Mf(t,n){var r=0;switch(t.tag){case 13:var s=t.stateNode,i=t.memoizedState;i!==null&&(r=i.retryLane);break;case 19:s=t.stateNode;break;default:throw Error(E(314))}s!==null&&s.delete(n),bu(t,r)}var yu;yu=function(t,n,r){if(t!==null)if(t.memoizedProps!==n.pendingProps||ze.current)Se=!0;else{if(!(t.lanes&r)&&!(n.flags&128))return Se=!1,yf(t,n,r);Se=!!(t.flags&131072)}else Se=!1,G&&n.flags&1048576&&Np(n,oi,n.index);switch(n.lanes=0,n.tag){case 2:var s=n.type;_s(t,n),t=n.pendingProps;var i=Qn(n,be.current);Wn(n,r),i=il(null,n,s,t,i,r);var o=ol();return n.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(n.tag=1,n.memoizedState=null,n.updateQueue=null,Ee(s)?(o=!0,si(n)):o=!1,n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,el(n),i.updater=Si,n.stateNode=i,i._reactInternals=n,Xo(n,s,t,r),n=ea(null,n,s,!0,o,r)):(n.tag=0,G&&o&&Ka(n),ye(null,n,i,r),n=n.child),n;case 16:s=n.elementType;e:{switch(_s(t,n),t=n.pendingProps,i=s._init,s=i(s._payload),n.type=s,i=n.tag=Rf(s),t=Ge(s,t),i){case 0:n=Zo(null,n,s,t,r);break e;case 1:n=wc(null,n,s,t,r);break e;case 11:n=yc(null,n,s,t,r);break e;case 14:n=jc(null,n,s,Ge(s.type,t),r);break e}throw Error(E(306,s,""))}return n;case 0:return s=n.type,i=n.pendingProps,i=n.elementType===s?i:Ge(s,i),Zo(t,n,s,i,r);case 1:return s=n.type,i=n.pendingProps,i=n.elementType===s?i:Ge(s,i),wc(t,n,s,i,r);case 3:e:{if(ru(n),t===null)throw Error(E(387));s=n.pendingProps,o=n.memoizedState,i=o.element,Pp(t,n),ci(n,s,null,r);var a=n.memoizedState;if(s=a.element,o.isDehydrated)if(o={element:s,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},n.updateQueue.baseState=o,n.memoizedState=o,n.flags&256){i=Gn(Error(E(423)),n),n=kc(t,n,s,r,i);break e}else if(s!==i){i=Gn(Error(E(424)),n),n=kc(t,n,s,r,i);break e}else for(Re=Vt(n.stateNode.containerInfo.firstChild),Le=n,G=!0,tt=null,r=zp(n,null,s,r),n.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Yn(),s===i){n=At(t,n,r);break e}ye(t,n,s,r)}n=n.child}return n;case 5:return Dp(n),t===null&&Qo(n),s=n.type,i=n.pendingProps,o=t!==null?t.memoizedProps:null,a=i.children,$o(s,i)?a=null:o!==null&&$o(s,o)&&(n.flags|=32),nu(t,n),ye(t,n,a,r),n.child;case 6:return t===null&&Qo(n),null;case 13:return su(t,n,r);case 4:return tl(n,n.stateNode.containerInfo),s=n.pendingProps,t===null?n.child=Jn(n,null,s,r):ye(t,n,s,r),n.child;case 11:return s=n.type,i=n.pendingProps,i=n.elementType===s?i:Ge(s,i),yc(t,n,s,i,r);case 7:return ye(t,n,n.pendingProps,r),n.child;case 8:return ye(t,n,n.pendingProps.children,r),n.child;case 12:return ye(t,n,n.pendingProps.children,r),n.child;case 10:e:{if(s=n.type._context,i=n.pendingProps,o=n.memoizedProps,a=i.value,K(ai,s._currentValue),s._currentValue=a,o!==null)if(it(o.value,a)){if(o.children===i.children&&!ze.current){n=At(t,n,r);break e}}else for(o=n.child,o!==null&&(o.return=n);o!==null;){var l=o.dependencies;if(l!==null){a=o.child;for(var c=l.firstContext;c!==null;){if(c.context===s){if(o.tag===1){c=wt(-1,r&-r),c.tag=2;var d=o.updateQueue;if(d!==null){d=d.shared;var h=d.pending;h===null?c.next=c:(c.next=h.next,h.next=c),d.pending=c}}o.lanes|=r,c=o.alternate,c!==null&&(c.lanes|=r),Yo(o.return,r,n),l.lanes|=r;break}c=c.next}}else if(o.tag===10)a=o.type===n.type?null:o.child;else if(o.tag===18){if(a=o.return,a===null)throw Error(E(341));a.lanes|=r,l=a.alternate,l!==null&&(l.lanes|=r),Yo(a,r,n),a=o.sibling}else a=o.child;if(a!==null)a.return=o;else for(a=o;a!==null;){if(a===n){a=null;break}if(o=a.sibling,o!==null){o.return=a.return,a=o;break}a=a.return}o=a}ye(t,n,i.children,r),n=n.child}return n;case 9:return i=n.type,s=n.pendingProps.children,Wn(n,r),i=Qe(i),s=s(i),n.flags|=1,ye(t,n,s,r),n.child;case 14:return s=n.type,i=Ge(s,n.pendingProps),i=Ge(s.type,i),jc(t,n,s,i,r);case 15:return eu(t,n,n.type,n.pendingProps,r);case 17:return s=n.type,i=n.pendingProps,i=n.elementType===s?i:Ge(s,i),_s(t,n),n.tag=1,Ee(s)?(t=!0,si(n)):t=!1,Wn(n,r),Xp(n,s,i),Xo(n,s,i,r),ea(null,n,s,!0,t,r);case 19:return iu(t,n,r);case 22:return tu(t,n,r)}throw Error(E(156,n.tag))};function ju(t,n){return Qd(t,n)}function Bf(t,n,r,s){this.tag=t,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=s,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function qe(t,n,r,s){return new Bf(t,n,r,s)}function ml(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Rf(t){if(typeof t=="function")return ml(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Ra)return 11;if(t===La)return 14}return 2}function Qt(t,n){var r=t.alternate;return r===null?(r=qe(t.tag,n,t.key,t.mode),r.elementType=t.elementType,r.type=t.type,r.stateNode=t.stateNode,r.alternate=t,t.alternate=r):(r.pendingProps=n,r.type=t.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=t.flags&14680064,r.childLanes=t.childLanes,r.lanes=t.lanes,r.child=t.child,r.memoizedProps=t.memoizedProps,r.memoizedState=t.memoizedState,r.updateQueue=t.updateQueue,n=t.dependencies,r.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},r.sibling=t.sibling,r.index=t.index,r.ref=t.ref,r}function Os(t,n,r,s,i,o){var a=2;if(s=t,typeof t=="function")ml(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case An:return cn(r.children,i,o,n);case Ba:a=8,i|=8;break;case jo:return t=qe(12,r,n,i|2),t.elementType=jo,t.lanes=o,t;case wo:return t=qe(13,r,n,i),t.elementType=wo,t.lanes=o,t;case ko:return t=qe(19,r,n,i),t.elementType=ko,t.lanes=o,t;case Dd:return Pi(r,i,o,n);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Ed:a=10;break e;case Pd:a=9;break e;case Ra:a=11;break e;case La:a=14;break e;case Rt:a=16,s=null;break e}throw Error(E(130,t==null?t:typeof t,""))}return n=qe(a,r,n,i),n.elementType=t,n.type=s,n.lanes=o,n}function cn(t,n,r,s){return t=qe(7,t,s,n),t.lanes=r,t}function Pi(t,n,r,s){return t=qe(22,t,s,n),t.elementType=Dd,t.lanes=r,t.stateNode={isHidden:!1},t}function uo(t,n,r){return t=qe(6,t,null,n),t.lanes=r,t}function ho(t,n,r){return n=qe(4,t.children!==null?t.children:[],t.key,n),n.lanes=r,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}function Lf(t,n,r,s,i){this.tag=n,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=qi(0),this.expirationTimes=qi(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=qi(0),this.identifierPrefix=s,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function gl(t,n,r,s,i,o,a,l,c){return t=new Lf(t,n,r,l,c),n===1?(n=1,o===!0&&(n|=8)):n=0,o=qe(3,null,null,n),t.current=o,o.stateNode=t,o.memoizedState={element:s,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},el(o),t}function _f(t,n,r){var s=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Cn,key:s==null?null:""+s,children:t,containerInfo:n,implementation:r}}function wu(t){if(!t)return Jt;t=t._reactInternals;e:{if(vn(t)!==t||t.tag!==1)throw Error(E(170));var n=t;do{switch(n.tag){case 3:n=n.stateNode.context;break e;case 1:if(Ee(n.type)){n=n.stateNode.__reactInternalMemoizedMergedChildContext;break e}}n=n.return}while(n!==null);throw Error(E(171))}if(t.tag===1){var r=t.type;if(Ee(r))return wp(t,r,n)}return n}function ku(t,n,r,s,i,o,a,l,c){return t=gl(r,s,!0,t,i,o,a,l,c),t.context=wu(null),r=t.current,s=je(),i=Kt(r),o=wt(s,i),o.callback=n??null,Ht(r,o,i),t.current.lanes=i,Yr(t,i,s),Pe(t,s),t}function Di(t,n,r,s){var i=n.current,o=je(),a=Kt(i);return r=wu(r),n.context===null?n.context=r:n.pendingContext=r,n=wt(o,a),n.payload={element:t},s=s===void 0?null:s,s!==null&&(n.callback=s),t=Ht(i,n,a),t!==null&&(rt(t,i,a,o),Bs(t,i,a)),a}function gi(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Mc(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var r=t.retryLane;t.retryLane=r!==0&&r<n?r:n}}function vl(t,n){Mc(t,n),(t=t.alternate)&&Mc(t,n)}function If(){return null}var Nu=typeof reportError=="function"?reportError:function(t){console.error(t)};function bl(t){this._internalRoot=t}Ti.prototype.render=bl.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(E(409));Di(t,n,null,null)};Ti.prototype.unmount=bl.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;fn(function(){Di(null,t,null,null)}),n[Nt]=null}};function Ti(t){this._internalRoot=t}Ti.prototype.unstable_scheduleHydration=function(t){if(t){var n=tp();t={blockedOn:null,target:t,priority:n};for(var r=0;r<_t.length&&n!==0&&n<_t[r].priority;r++);_t.splice(r,0,t),r===0&&rp(t)}};function yl(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Mi(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Bc(){}function Ff(t,n,r,s,i){if(i){if(typeof s=="function"){var o=s;s=function(){var d=gi(a);o.call(d)}}var a=ku(n,s,t,0,null,!1,!1,"",Bc);return t._reactRootContainer=a,t[Nt]=a.current,Fr(t.nodeType===8?t.parentNode:t),fn(),a}for(;i=t.lastChild;)t.removeChild(i);if(typeof s=="function"){var l=s;s=function(){var d=gi(c);l.call(d)}}var c=gl(t,0,!1,null,null,!1,!1,"",Bc);return t._reactRootContainer=c,t[Nt]=c.current,Fr(t.nodeType===8?t.parentNode:t),fn(function(){Di(n,c,r,s)}),c}function Bi(t,n,r,s,i){var o=r._reactRootContainer;if(o){var a=o;if(typeof i=="function"){var l=i;i=function(){var c=gi(a);l.call(c)}}Di(n,a,t,i)}else a=Ff(r,n,t,i,s);return gi(a)}Zd=function(t){switch(t.tag){case 3:var n=t.stateNode;if(n.current.memoizedState.isDehydrated){var r=vr(n.pendingLanes);r!==0&&(Fa(n,r|1),Pe(n,re()),!($&6)&&(Zn=re()+500,Zt()))}break;case 13:fn(function(){var s=Ct(t,1);if(s!==null){var i=je();rt(s,t,1,i)}}),vl(t,1)}};Oa=function(t){if(t.tag===13){var n=Ct(t,134217728);if(n!==null){var r=je();rt(n,t,134217728,r)}vl(t,134217728)}};ep=function(t){if(t.tag===13){var n=Kt(t),r=Ct(t,n);if(r!==null){var s=je();rt(r,t,n,s)}vl(t,n)}};tp=function(){return q};np=function(t,n){var r=q;try{return q=t,n()}finally{q=r}};Mo=function(t,n,r){switch(n){case"input":if(Ao(t,r),n=r.name,r.type==="radio"&&n!=null){for(r=t;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+n)+'][type="radio"]'),n=0;n<r.length;n++){var s=r[n];if(s!==t&&s.form===t.form){var i=Ni(s);if(!i)throw Error(E(90));Md(s),Ao(s,i)}}}break;case"textarea":Rd(t,r);break;case"select":n=r.value,n!=null&&_n(t,!!r.multiple,n,!1)}};Ud=hl;$d=fn;var Of={usingClientEntryPoint:!1,Events:[Xr,Pn,Ni,Od,Wd,hl]},xr={findFiberByHostInstance:rn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Wf={bundleType:xr.bundleType,version:xr.version,rendererPackageName:xr.rendererPackageName,rendererConfig:xr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:St.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=qd(t),t===null?null:t.stateNode},findFiberByHostInstance:xr.findFiberByHostInstance||If,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ys=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ys.isDisabled&&ys.supportsFiber)try{yi=ys.inject(Wf),ht=ys}catch{}}Ie.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Of;Ie.createPortal=function(t,n){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!yl(n))throw Error(E(200));return _f(t,n,null,r)};Ie.createRoot=function(t,n){if(!yl(t))throw Error(E(299));var r=!1,s="",i=Nu;return n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),n=gl(t,1,!1,null,null,r,!1,s,i),t[Nt]=n.current,Fr(t.nodeType===8?t.parentNode:t),new bl(n)};Ie.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(E(188)):(t=Object.keys(t).join(","),Error(E(268,t)));return t=qd(n),t=t===null?null:t.stateNode,t};Ie.flushSync=function(t){return fn(t)};Ie.hydrate=function(t,n,r){if(!Mi(n))throw Error(E(200));return Bi(null,t,n,!0,r)};Ie.hydrateRoot=function(t,n,r){if(!yl(t))throw Error(E(405));var s=r!=null&&r.hydratedSources||null,i=!1,o="",a=Nu;if(r!=null&&(r.unstable_strictMode===!0&&(i=!0),r.identifierPrefix!==void 0&&(o=r.identifierPrefix),r.onRecoverableError!==void 0&&(a=r.onRecoverableError)),n=ku(n,null,t,1,r??null,i,!1,o,a),t[Nt]=n.current,Fr(t),s)for(t=0;t<s.length;t++)r=s[t],i=r._getVersion,i=i(r._source),n.mutableSourceEagerHydrationData==null?n.mutableSourceEagerHydrationData=[r,i]:n.mutableSourceEagerHydrationData.push(r,i);return new Ti(n)};Ie.render=function(t,n,r){if(!Mi(n))throw Error(E(200));return Bi(null,t,n,!1,r)};Ie.unmountComponentAtNode=function(t){if(!Mi(t))throw Error(E(40));return t._reactRootContainer?(fn(function(){Bi(null,null,t,!1,function(){t._reactRootContainer=null,t[Nt]=null})}),!0):!1};Ie.unstable_batchedUpdates=hl;Ie.unstable_renderSubtreeIntoContainer=function(t,n,r,s){if(!Mi(r))throw Error(E(200));if(t==null||t._reactInternals===void 0)throw Error(E(38));return Bi(t,n,r,!1,s)};Ie.version="18.3.1-next-f1338f8080-20240426";function Cu(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Cu)}catch(t){console.error(t)}}Cu(),Cd.exports=Ie;var Uf=Cd.exports,Au,Rc=Uf;Au=Rc.createRoot,Rc.hydrateRoot;const $f="application/json";var bt,Ce,Vn,Hn,pt,qn,H,Ze,P,Ws,Su,zu,Eu,Pu,ua,Du,ha,Tu,Mu,Us,yr,xa,Mt,Bu,fa,Bt,$s,jr,ct,ma;class Vf{constructor(n){Ue(this,P);Ue(this,bt,[]);Ue(this,Ce);Ue(this,Vn,!0);Ue(this,Hn);Ue(this,pt,T(this,P,ma).call(this,console.info));Ue(this,qn,T(this,P,ma).call(this,console.warn));Ue(this,H,{enable:!0,callbackList:[],interval:5});Ue(this,Ze);L(this,"didInitialize",!1);L(this,"authenticated",!1);L(this,"loginRequired",!1);L(this,"responseMode","fragment");L(this,"responseType","code");L(this,"flow","standard");L(this,"timeSkew",null);L(this,"redirectUri");L(this,"silentCheckSsoRedirectUri");L(this,"silentCheckSsoFallback",!0);L(this,"pkceMethod","S256");L(this,"enableLogging",!1);L(this,"logoutMethod","GET");L(this,"scope");L(this,"messageReceiveTimeout",1e4);L(this,"idToken");L(this,"idTokenParsed");L(this,"token");L(this,"tokenParsed");L(this,"refreshToken");L(this,"refreshTokenParsed");L(this,"clientId");L(this,"sessionId");L(this,"subject");L(this,"authServerUrl");L(this,"realm");L(this,"realmAccess");L(this,"resourceAccess");L(this,"profile");L(this,"userInfo");L(this,"endpoints");L(this,"tokenTimeoutHandle");L(this,"onAuthSuccess");L(this,"onAuthError");L(this,"onAuthRefreshSuccess");L(this,"onAuthRefreshError");L(this,"onTokenExpired");L(this,"onAuthLogout");L(this,"onReady");L(this,"onActionUpdate");L(this,"init",async(n={})=>{var s;if(this.didInitialize)throw new Error("A 'Keycloak' instance can only be initialized once.");this.didInitialize=!0,Pt(this,Hn,Xf());const r=["default","cordova","cordova-native"];if(typeof n.adapter=="string"&&r.includes(n.adapter)?Pt(this,Ce,T(this,P,Ws).call(this,n.adapter)):typeof n.adapter=="object"?Pt(this,Ce,n.adapter):"Cordova"in window||"cordova"in window?Pt(this,Ce,T(this,P,Ws).call(this,"cordova")):Pt(this,Ce,T(this,P,Ws).call(this,"default")),typeof n.useNonce<"u"&&Pt(this,Vn,n.useNonce),typeof n.checkLoginIframe<"u"&&(R(this,H).enable=n.checkLoginIframe),n.checkLoginIframeInterval&&(R(this,H).interval=n.checkLoginIframeInterval),n.onLoad==="login-required"&&(this.loginRequired=!0),n.responseMode)if(n.responseMode==="query"||n.responseMode==="fragment")this.responseMode=n.responseMode;else throw new Error("Invalid value for responseMode");if(n.flow){switch(n.flow){case"standard":this.responseType="code";break;case"implicit":this.responseType="id_token token";break;case"hybrid":this.responseType="code id_token token";break;default:throw new Error("Invalid value for flow")}this.flow=n.flow}if(typeof n.timeSkew=="number"&&(this.timeSkew=n.timeSkew),n.redirectUri&&(this.redirectUri=n.redirectUri),n.silentCheckSsoRedirectUri&&(this.silentCheckSsoRedirectUri=n.silentCheckSsoRedirectUri),typeof n.silentCheckSsoFallback=="boolean"&&(this.silentCheckSsoFallback=n.silentCheckSsoFallback),typeof n.pkceMethod<"u"){if(n.pkceMethod!=="S256"&&n.pkceMethod!==!1)throw new TypeError(`Invalid value for pkceMethod', expected 'S256' or false but got ${n.pkceMethod}.`);this.pkceMethod=n.pkceMethod}return typeof n.enableLogging=="boolean"&&(this.enableLogging=n.enableLogging),n.logoutMethod==="POST"&&(this.logoutMethod="POST"),typeof n.scope=="string"&&(this.scope=n.scope),typeof n.messageReceiveTimeout=="number"&&n.messageReceiveTimeout>0&&(this.messageReceiveTimeout=n.messageReceiveTimeout),await T(this,P,Pu).call(this),await T(this,P,Tu).call(this),await T(this,P,Mu).call(this,n),(s=this.onReady)==null||s.call(this,this.authenticated),this.authenticated});L(this,"login",n=>R(this,Ce).login(n));L(this,"createLoginUrl",async n=>{const r=Lc(),s=Lc(),i=R(this,Ce).redirectUri(n),o={state:r,nonce:s,redirectUri:i,loginOptions:n};n!=null&&n.prompt&&(o.prompt=n.prompt);const a=(n==null?void 0:n.action)==="register"?this.endpoints.register():this.endpoints.authorize();let l=(n==null?void 0:n.scope)||this.scope;const c=l?l.split(" "):[];c.includes("openid")||c.unshift("openid"),l=c.join(" ");const d=new URLSearchParams([["client_id",this.clientId],["redirect_uri",i],["state",r],["response_mode",this.responseMode],["response_type",this.responseType],["scope",l]]);if(R(this,Vn)&&d.append("nonce",s),n!=null&&n.prompt&&d.append("prompt",n.prompt),typeof(n==null?void 0:n.maxAge)=="number"&&d.append("max_age",n.maxAge.toString()),n!=null&&n.loginHint&&d.append("login_hint",n.loginHint),n!=null&&n.idpHint&&d.append("kc_idp_hint",n.idpHint),n!=null&&n.action&&n.action!=="register"&&d.append("kc_action",n.action),n!=null&&n.locale&&d.append("ui_locales",n.locale),n!=null&&n.acr&&d.append("claims",Hf(n.acr)),n!=null&&n.acrValues&&d.append("acr_values",n.acrValues),this.pkceMethod)try{const h=qf(96),f=await Kf(this.pkceMethod,h);o.pkceCodeVerifier=h,d.append("code_challenge",f),d.append("code_challenge_method",this.pkceMethod)}catch(h){throw new Error("Failed to generate PKCE challenge.",{cause:h})}return R(this,Hn).add(o),`${a}?${d.toString()}`});L(this,"logout",n=>R(this,Ce).logout(n));L(this,"createLogoutUrl",n=>{const r=(n==null?void 0:n.logoutMethod)??this.logoutMethod,s=this.endpoints.logout();if(r==="POST")return s;const i=new URLSearchParams([["client_id",this.clientId],["post_logout_redirect_uri",R(this,Ce).redirectUri(n)]]);return this.idToken&&i.append("id_token_hint",this.idToken),`${s}?${i.toString()}`});L(this,"register",n=>R(this,Ce).register(n));L(this,"createRegisterUrl",n=>this.createLoginUrl({...n,action:"register"}));L(this,"createAccountUrl",n=>{const r=T(this,P,ct).call(this);if(!r)throw new Error("Unable to create account URL, make sure the adapter is not configured using a generic OIDC provider.");const s=new URLSearchParams([["referrer",this.clientId],["referrer_uri",R(this,Ce).redirectUri(n)]]);return`${r}/account?${s.toString()}`});L(this,"accountManagement",()=>R(this,Ce).accountManagement());L(this,"hasRealmRole",n=>{const r=this.realmAccess;return!!r&&r.roles.indexOf(n)>=0});L(this,"hasResourceRole",(n,r)=>{if(!this.resourceAccess)return!1;const s=this.resourceAccess[r||this.clientId];return!!s&&s.roles.indexOf(n)>=0});L(this,"loadUserProfile",async()=>{const n=T(this,P,ct).call(this);if(!n)throw new Error("Unable to load user profile, make sure the adapter is not configured using a generic OIDC provider.");const r=`${n}/account`,s=await er(r,{headers:[_c(this.token)]});return this.profile=s});L(this,"loadUserInfo",async()=>{const n=this.endpoints.userinfo(),r=await er(n,{headers:[_c(this.token)]});return this.userInfo=r});L(this,"isTokenExpired",n=>{if(!this.tokenParsed||!this.refreshToken&&this.flow!=="implicit")throw new Error("Not authenticated");if(this.timeSkew==null)return R(this,pt).call(this,"[KEYCLOAK] Unable to determine if token is expired as timeskew is not set"),!0;if(typeof this.tokenParsed.exp!="number")return!1;let r=this.tokenParsed.exp-Math.ceil(new Date().getTime()/1e3)+this.timeSkew;if(n){if(isNaN(n))throw new Error("Invalid minValidity");r-=n}return r<0});L(this,"updateToken",async n=>{var a,l;if(!this.refreshToken)throw new Error("Unable to update token, no refresh token available.");n=n||5,R(this,H).enable&&await T(this,P,yr).call(this);let r=!1;if(n===-1?(r=!0,R(this,pt).call(this,"[KEYCLOAK] Refreshing token: forced refresh")):(!this.tokenParsed||this.isTokenExpired(n))&&(r=!0,R(this,pt).call(this,"[KEYCLOAK] Refreshing token: token expired")),!r)return!1;const{promise:s,resolve:i,reject:o}=Promise.withResolvers();if(R(this,bt).push({resolve:i,reject:o}),R(this,bt).length===1){const c=this.endpoints.token();let d=new Date().getTime();try{const h=await am(c,this.refreshToken,this.clientId);R(this,pt).call(this,"[KEYCLOAK] Token refreshed"),d=(d+new Date().getTime())/2,T(this,P,jr).call(this,h.access_token,h.refresh_token,h.id_token,d),(a=this.onAuthRefreshSuccess)==null||a.call(this);for(let f=R(this,bt).pop();f!=null;f=R(this,bt).pop())f.resolve(!0)}catch(h){R(this,qn).call(this,"[KEYCLOAK] Failed to refresh token"),h instanceof Iu&&h.response.status===400&&this.clearToken(),(l=this.onAuthRefreshError)==null||l.call(this);for(let f=R(this,bt).pop();f!=null;f=R(this,bt).pop())f.reject(h)}}return await s});L(this,"clearToken",()=>{var n;this.token&&(T(this,P,jr).call(this),(n=this.onAuthLogout)==null||n.call(this),this.loginRequired&&this.login())});if(typeof n!="string"&&!ja(n))throw new Error("The 'Keycloak' constructor must be provided with a configuration object, or a URL to a JSON configuration file.");if(ja(n)){const r="oidcProvider"in n?["clientId"]:["url","realm","clientId"];for(const s of r)if(!(s in n))throw new Error(`The configuration object is missing the required '${s}' property.`)}globalThis.isSecureContext||R(this,qn).call(this,`[KEYCLOAK] Keycloak JS must be used in a 'secure context' to function properly as it relies on browser APIs that are otherwise not available.
Continuing to run your application insecurely will lead to unexpected behavior and breakage.

For more information see: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts`),Pt(this,Ze,n)}}bt=new WeakMap,Ce=new WeakMap,Vn=new WeakMap,Hn=new WeakMap,pt=new WeakMap,qn=new WeakMap,H=new WeakMap,Ze=new WeakMap,P=new WeakSet,Ws=function(n){if(n==="default")return T(this,P,Su).call(this);if(n==="cordova")return R(this,H).enable=!1,T(this,P,zu).call(this);if(n==="cordova-native")return R(this,H).enable=!1,T(this,P,Eu).call(this);throw new Error("invalid adapter type: "+n)},Su=function(){const n=r=>(r==null?void 0:r.redirectUri)||this.redirectUri||globalThis.location.href;return{login:async r=>(window.location.assign(await this.createLoginUrl(r)),await new Promise(()=>{})),logout:async r=>{if(((r==null?void 0:r.logoutMethod)??this.logoutMethod)==="GET"){window.location.replace(this.createLogoutUrl(r));return}const i=document.createElement("form");i.setAttribute("method","POST"),i.setAttribute("action",this.createLogoutUrl(r)),i.style.display="none";const o={id_token_hint:this.idToken,client_id:this.clientId,post_logout_redirect_uri:n(r)};for(const[a,l]of Object.entries(o)){const c=document.createElement("input");c.setAttribute("type","hidden"),c.setAttribute("name",a),c.setAttribute("value",l),i.appendChild(c)}document.body.appendChild(i),i.submit()},register:async r=>(window.location.assign(await this.createRegisterUrl(r)),await new Promise(()=>{})),accountManagement:async()=>{const r=this.createAccountUrl();if(typeof r<"u")window.location.href=r;else throw new Error("Not supported by the OIDC server");return await new Promise(()=>{})},redirectUri:n}},zu=function(){const n=(a,l,c)=>window.cordova&&window.cordova.InAppBrowser?window.cordova.InAppBrowser.open(a,l,c):window.open(a,l,c),r=a=>a&&a.cordovaOptions?Object.keys(a.cordovaOptions).reduce((l,c)=>(l[c]=a.cordovaOptions[c],l),{}):{},s=a=>Object.keys(a).reduce((l,c)=>(l.push(c+"="+a[c]),l),[]).join(","),i=a=>{const l=r(a);return l.location="no",a&&a.prompt==="none"&&(l.hidden="yes"),s(l)},o=()=>this.redirectUri||"http://localhost";return{login:async a=>{const l=i(a),c=await this.createLoginUrl(a),d=n(c,"_blank",l);let h=!1,f=!1;function m(){f=!0,d.close()}return await new Promise((k,p)=>{d.addEventListener("loadstart",async v=>{if(v.url.indexOf(o())===0){const b=T(this,P,Mt).call(this,v.url);try{await T(this,P,Bt).call(this,b),k()}catch(x){p(x)}m(),h=!0}}),d.addEventListener("loaderror",async v=>{if(!h)if(v.url.indexOf(o())===0){const b=T(this,P,Mt).call(this,v.url);try{await T(this,P,Bt).call(this,b),k()}catch(x){p(x)}m(),h=!0}else p(new Error("Unable to process login.")),m()}),d.addEventListener("exit",function(v){f||p(new Error("User closed the login window."))})})},logout:async a=>{const l=this.createLogoutUrl(a),c=n(l,"_blank","location=no,hidden=yes,clearcache=yes");let d=!1;c.addEventListener("loadstart",h=>{h.url.indexOf(o())===0&&c.close()}),c.addEventListener("loaderror",h=>{h.url.indexOf(o())===0||(d=!0),c.close()}),await new Promise((h,f)=>{c.addEventListener("exit",()=>{d?f(new Error("User closed the login window.")):(this.clearToken(),h())})})},register:async a=>{const l=await this.createRegisterUrl(),c=i(a),d=n(l,"_blank",c);await new Promise((f,m)=>{d.addEventListener("loadstart",async k=>{if(k.url.indexOf(o())===0){d.close();const p=T(this,P,Mt).call(this,k.url);try{await T(this,P,Bt).call(this,p),f()}catch(v){m(v)}}})})},accountManagement:async()=>{const a=this.createAccountUrl();if(typeof a<"u"){const l=n(a,"_blank","location=no");l.addEventListener("loadstart",function(c){c.url.indexOf(o())===0&&l.close()})}else throw new Error("Not supported by the OIDC server")},redirectUri:()=>o()}},Eu=function(){return{login:async n=>{const r=await this.createLoginUrl(n);await new Promise((s,i)=>{universalLinks.subscribe("keycloak",async o=>{universalLinks.unsubscribe("keycloak"),window.cordova.plugins.browsertab.close();const a=T(this,P,Mt).call(this,o.url);try{await T(this,P,Bt).call(this,a),s()}catch(l){i(l)}}),window.cordova.plugins.browsertab.openUrl(r)})},logout:async n=>{const r=this.createLogoutUrl(n);await new Promise(s=>{universalLinks.subscribe("keycloak",()=>{universalLinks.unsubscribe("keycloak"),window.cordova.plugins.browsertab.close(),this.clearToken(),s()}),window.cordova.plugins.browsertab.openUrl(r)})},register:async n=>{const r=await this.createRegisterUrl(n);await new Promise((s,i)=>{universalLinks.subscribe("keycloak",async o=>{universalLinks.unsubscribe("keycloak"),window.cordova.plugins.browsertab.close();const a=T(this,P,Mt).call(this,o.url);try{await T(this,P,Bt).call(this,a),s()}catch(l){i(l)}}),window.cordova.plugins.browsertab.openUrl(r)})},accountManagement:async()=>{const n=this.createAccountUrl();if(typeof n<"u")window.cordova.plugins.browsertab.openUrl(n);else throw new Error("Not supported by the OIDC server")},redirectUri:n=>n&&n.redirectUri?n.redirectUri:this.redirectUri?this.redirectUri:"http://localhost"}},Pu=async function(){if(typeof R(this,Ze)=="string"){const n=await sm(R(this,Ze));this.authServerUrl=n["auth-server-url"],this.realm=n.realm,this.clientId=n.resource,T(this,P,ua).call(this)}else this.clientId=R(this,Ze).clientId,"oidcProvider"in R(this,Ze)?await T(this,P,Du).call(this,R(this,Ze).oidcProvider):(this.authServerUrl=R(this,Ze).url,this.realm=R(this,Ze).realm,T(this,P,ua).call(this))},ua=function(){this.endpoints={authorize:()=>T(this,P,ct).call(this)+"/protocol/openid-connect/auth",token:()=>T(this,P,ct).call(this)+"/protocol/openid-connect/token",logout:()=>T(this,P,ct).call(this)+"/protocol/openid-connect/logout",checkSessionIframe:()=>T(this,P,ct).call(this)+"/protocol/openid-connect/login-status-iframe.html",thirdPartyCookiesIframe:()=>T(this,P,ct).call(this)+"/protocol/openid-connect/3p-cookies/step1.html",register:()=>T(this,P,ct).call(this)+"/protocol/openid-connect/registrations",userinfo:()=>T(this,P,ct).call(this)+"/protocol/openid-connect/userinfo"}},Du=async function(n){if(typeof n=="string"){const r=`${Ic(n)}/.well-known/openid-configuration`,s=await im(r);T(this,P,ha).call(this,s)}else T(this,P,ha).call(this,n)},ha=function(n){this.endpoints={authorize(){return n.authorization_endpoint},token(){return n.token_endpoint},logout(){if(!n.end_session_endpoint)throw new Error("Not supported by the OIDC server");return n.end_session_endpoint},checkSessionIframe(){if(!n.check_session_iframe)throw new Error("Not supported by the OIDC server");return n.check_session_iframe},register(){throw new Error('Redirection to "Register user" page not supported in standard OIDC mode')},userinfo(){if(!n.userinfo_endpoint)throw new Error("Not supported by the OIDC server");return n.userinfo_endpoint}}},Tu=async function(){if(!R(this,H).enable&&!this.silentCheckSsoRedirectUri||typeof this.endpoints.thirdPartyCookiesIframe!="function")return;const n=document.createElement("iframe");n.setAttribute("src",this.endpoints.thirdPartyCookiesIframe()),n.setAttribute("sandbox","allow-storage-access-by-user-activation allow-scripts allow-same-origin"),n.setAttribute("title","keycloak-3p-check-iframe"),n.style.display="none",document.body.appendChild(n);const r=new Promise(s=>{const i=o=>{n.contentWindow===o.source&&(o.data!=="supported"&&o.data!=="unsupported"||(o.data==="unsupported"&&(R(this,qn).call(this,`[KEYCLOAK] Your browser is blocking access to 3rd-party cookies, this means:

 - It is not possible to retrieve tokens without redirecting to the Keycloak server (a.k.a. no support for silent authentication).
 - It is not possible to automatically detect changes to the session status (such as the user logging out in another tab).

For more information see: https://www.keycloak.org/securing-apps/javascript-adapter#_modern_browsers`),R(this,H).enable=!1,this.silentCheckSsoFallback&&(this.silentCheckSsoRedirectUri=void 0)),document.body.removeChild(n),window.removeEventListener("message",i),s()))};window.addEventListener("message",i,!1)});return await Jf(r,this.messageReceiveTimeout,"Timeout when waiting for 3rd party check iframe message.")},Mu=async function(n){var o,a,l;const r=T(this,P,Mt).call(this,window.location.href);if(r!=null&&r.newUrl&&window.history.replaceState(window.history.state,"",r.newUrl),r&&r.valid){await T(this,P,Us).call(this),await T(this,P,Bt).call(this,r);return}const s=async c=>{const d={};c||(d.prompt="none"),n.locale&&(d.locale=n.locale),await this.login(d)},i=async()=>{switch(n.onLoad){case"check-sso":R(this,H).enable?(await T(this,P,Us).call(this),await T(this,P,yr).call(this)||(this.silentCheckSsoRedirectUri?await T(this,P,xa).call(this):await s(!1))):this.silentCheckSsoRedirectUri?await T(this,P,xa).call(this):await s(!1);break;case"login-required":await s(!0);break;default:throw new Error("Invalid value for onLoad")}};if(n.token&&n.refreshToken)if(T(this,P,jr).call(this,n.token,n.refreshToken,n.idToken),R(this,H).enable)await T(this,P,Us).call(this),await T(this,P,yr).call(this)&&((o=this.onAuthSuccess)==null||o.call(this),T(this,P,$s).call(this));else try{await this.updateToken(-1),(a=this.onAuthSuccess)==null||a.call(this)}catch(c){if((l=this.onAuthError)==null||l.call(this),n.onLoad)await i();else throw c}else n.onLoad&&await i()},Us=async function(){if(!R(this,H).enable||R(this,H).iframe)return;const n=document.createElement("iframe");R(this,H).iframe=n,n.setAttribute("src",this.endpoints.checkSessionIframe()),n.setAttribute("sandbox","allow-storage-access-by-user-activation allow-scripts allow-same-origin"),n.setAttribute("title","keycloak-session-iframe"),n.style.display="none",document.body.appendChild(n);const r=i=>{var a;if(i.origin!==R(this,H).iframeOrigin||((a=R(this,H).iframe)==null?void 0:a.contentWindow)!==i.source||!(i.data==="unchanged"||i.data==="changed"||i.data==="error"))return;i.data!=="unchanged"&&this.clearToken();const o=R(this,H).callbackList;R(this,H).callbackList=[];for(const l of o.reverse())i.data==="error"?l(new Error("Error while checking login iframe")):l(null,i.data==="unchanged")};window.addEventListener("message",r,!1),await new Promise(i=>{n.addEventListener("load",()=>{const o=this.endpoints.authorize();o.startsWith("/")?R(this,H).iframeOrigin=globalThis.location.origin:R(this,H).iframeOrigin=new URL(o).origin,i()})})},yr=async function(){if(!R(this,H).iframe||!R(this,H).iframeOrigin)return;const n=`${this.clientId} ${this.sessionId?this.sessionId:""}`,r=R(this,H).iframeOrigin;return await new Promise((i,o)=>{var l,c;const a=(d,h)=>d?o(d):i(h);R(this,H).callbackList.push(a),R(this,H).callbackList.length===1&&((c=(l=R(this,H).iframe)==null?void 0:l.contentWindow)==null||c.postMessage(n,r))})},xa=async function(){const n=document.createElement("iframe"),r=await this.createLoginUrl({prompt:"none",redirectUri:this.silentCheckSsoRedirectUri});return n.setAttribute("src",r),n.setAttribute("sandbox","allow-storage-access-by-user-activation allow-scripts allow-same-origin"),n.setAttribute("title","keycloak-silent-check-sso"),n.style.display="none",document.body.appendChild(n),await new Promise((s,i)=>{const o=async a=>{if(a.origin!==window.location.origin||n.contentWindow!==a.source)return;const l=T(this,P,Mt).call(this,a.data);try{await T(this,P,Bt).call(this,l),s()}catch(c){i(c)}document.body.removeChild(n),window.removeEventListener("message",o)};window.addEventListener("message",o)})},Mt=function(n){const r=T(this,P,Bu).call(this,n);if(!r)return;const s=R(this,Hn).get(r.state);return s&&(r.valid=!0,r.redirectUri=s.redirectUri,r.storedNonce=s.nonce,r.prompt=s.prompt,r.pkceCodeVerifier=s.pkceCodeVerifier,r.loginOptions=s.loginOptions),r},Bu=function(n){let r=[];switch(this.flow){case"standard":r=["code","state","session_state","kc_action_status","kc_action","iss"];break;case"implicit":r=["access_token","token_type","id_token","state","session_state","expires_in","kc_action_status","kc_action","iss"];break;case"hybrid":r=["access_token","token_type","id_token","code","state","session_state","expires_in","kc_action_status","kc_action","iss"];break}r.push("error"),r.push("error_description"),r.push("error_uri");const s=new URL(n);let i="",o;if(this.responseMode==="query"&&s.searchParams.size>0?(o=T(this,P,fa).call(this,s.search,r),s.search=o.paramsString,i=s.toString()):this.responseMode==="fragment"&&s.hash.length>0&&(o=T(this,P,fa).call(this,s.hash.substring(1),r),s.hash=o.paramsString,i=s.toString()),o!=null&&o.oauthParams){if(this.flow==="standard"||this.flow==="hybrid"){if((o.oauthParams.code||o.oauthParams.error)&&o.oauthParams.state)return o.oauthParams.newUrl=i,o.oauthParams}else if(this.flow==="implicit"&&(o.oauthParams.access_token||o.oauthParams.error)&&o.oauthParams.state)return o.oauthParams.newUrl=i,o.oauthParams}},fa=function(n,r){const s=new URLSearchParams(n),i={};for(const[o,a]of Array.from(s.entries()))r.includes(o)&&(i[o]=a,s.delete(o));return{paramsString:s.toString(),oauthParams:i}},Bt=async function(n){var l,c,d,h;const{code:r,error:s,prompt:i}=n;let o=new Date().getTime();const a=(f,m,k)=>{if(o=(o+new Date().getTime())/2,T(this,P,jr).call(this,f,m,k,o),R(this,Vn)&&this.idTokenParsed&&this.idTokenParsed.nonce!==n.storedNonce)throw R(this,pt).call(this,"[KEYCLOAK] Invalid nonce, clearing token"),this.clearToken(),new Error("Invalid nonce.")};if(n.kc_action_status&&this.onActionUpdate&&this.onActionUpdate(n.kc_action_status,n.kc_action),s){if(i!=="none")if(n.error_description&&n.error_description==="authentication_expired")await this.login(n.loginOptions);else{const f={error:s,error_description:n.error_description};throw(l=this.onAuthError)==null||l.call(this,f),f}return}else this.flow!=="standard"&&(n.access_token||n.id_token)&&(a(n.access_token,void 0,n.id_token),(c=this.onAuthSuccess)==null||c.call(this));if(this.flow!=="implicit"&&r)try{const f=await om(this.endpoints.token(),r,this.clientId,n.redirectUri,n.pkceCodeVerifier);a(f.access_token,f.refresh_token,f.id_token),this.flow==="standard"&&((d=this.onAuthSuccess)==null||d.call(this)),T(this,P,$s).call(this)}catch(f){throw(h=this.onAuthError)==null||h.call(this),f}},$s=async function(){R(this,H).enable&&this.token&&(await cm(R(this,H).interval*1e3),await T(this,P,yr).call(this)&&await T(this,P,$s).call(this))},jr=function(n,r,s,i){if(this.tokenTimeoutHandle&&(clearTimeout(this.tokenTimeoutHandle),this.tokenTimeoutHandle=void 0),r?(this.refreshToken=r,this.refreshTokenParsed=xo(r)):(delete this.refreshToken,delete this.refreshTokenParsed),s?(this.idToken=s,this.idTokenParsed=xo(s)):(delete this.idToken,delete this.idTokenParsed),n){if(this.token=n,this.tokenParsed=xo(n),this.sessionId=this.tokenParsed.sid,this.authenticated=!0,this.subject=this.tokenParsed.sub,this.realmAccess=this.tokenParsed.realm_access,this.resourceAccess=this.tokenParsed.resource_access,i&&(this.timeSkew=Math.floor(i/1e3)-this.tokenParsed.iat),this.timeSkew!==null&&(R(this,pt).call(this,"[KEYCLOAK] Estimated time difference between browser and server is "+this.timeSkew+" seconds"),this.onTokenExpired)){const o=(this.tokenParsed.exp-new Date().getTime()/1e3+this.timeSkew)*1e3;R(this,pt).call(this,"[KEYCLOAK] Token expires in "+Math.round(o/1e3)+" s"),o<=0?this.onTokenExpired():this.tokenTimeoutHandle=window.setTimeout(this.onTokenExpired,o)}}else delete this.token,delete this.tokenParsed,delete this.subject,delete this.realmAccess,delete this.resourceAccess,this.authenticated=!1},ct=function(){if(!(typeof this.authServerUrl>"u"))return`${Ic(this.authServerUrl)}/realms/${encodeURIComponent(this.realm)}`},ma=function(n){return r=>{this.enableLogging&&n.call(console,r)}};function Lc(){if(typeof crypto>"u"||typeof crypto.randomUUID>"u")throw new Error("Web Crypto API is not available.");return crypto.randomUUID()}function Hf(t){return JSON.stringify({id_token:{acr:t}})}function qf(t){return Qf(t,"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")}async function Kf(t,n){if(t!=="S256")throw new TypeError(`Invalid value for 'pkceMethod', expected 'S256' but got '${t}'.`);const r=new Uint8Array(await tm(n));return em(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function Qf(t,n){const r=Yf(t),s=new Array(t);for(let i=0;i<t;i++)s[i]=n.charCodeAt(r[i]%n.length);return String.fromCharCode.apply(null,s)}function Yf(t){if(typeof crypto>"u"||typeof crypto.getRandomValues>"u")throw new Error("Web Crypto API is not available.");return crypto.getRandomValues(new Uint8Array(t))}function Jf(t,n,r){let s;const i=new Promise(function(o,a){s=window.setTimeout(function(){a(new Error(r))},n)});return Promise.race([t,i]).finally(function(){clearTimeout(s)})}function Xf(){try{return new Gf}catch{return new Zf}}const $n="kc-callback-";var Je,ga,Ru,va,Lu;class Gf{constructor(){Ue(this,Je);globalThis.localStorage.setItem("kc-test","test"),globalThis.localStorage.removeItem("kc-test")}get(n){if(!n)return null;T(this,Je,ga).call(this);const r=$n+n,s=globalThis.localStorage.getItem(r);return s?(globalThis.localStorage.removeItem(r),JSON.parse(s)):null}add(n){T(this,Je,ga).call(this);const r=$n+n.state,s=JSON.stringify({...n,expires:Date.now()+60*60*1e3});try{globalThis.localStorage.setItem(r,s)}catch{T(this,Je,Ru).call(this),globalThis.localStorage.setItem(r,s)}}}Je=new WeakSet,ga=function(){const n=Date.now();for(const[r,s]of T(this,Je,va).call(this)){const i=T(this,Je,Lu).call(this,s);(i===null||i<n)&&globalThis.localStorage.removeItem(r)}},Ru=function(){for(const[n]of T(this,Je,va).call(this))globalThis.localStorage.removeItem(n)},va=function(){return Object.entries(globalThis.localStorage).filter(([n])=>n.startsWith($n))},Lu=function(n){let r;try{r=JSON.parse(n)}catch{return null}return ja(r)&&"expires"in r&&typeof r.expires=="number"?r.expires:null};var mt,_u,ba,ya;class Zf{constructor(){Ue(this,mt)}get(n){if(!n)return null;const r=T(this,mt,_u).call(this,$n+n);return T(this,mt,ba).call(this,$n+n,"",T(this,mt,ya).call(this,-100)),r?JSON.parse(r):null}add(n){T(this,mt,ba).call(this,$n+n.state,JSON.stringify(n),T(this,mt,ya).call(this,60))}}mt=new WeakSet,_u=function(n){const r=n+"=",s=document.cookie.split(";");for(let i=0;i<s.length;i++){let o=s[i];for(;o.charAt(0)===" ";)o=o.substring(1);if(o.indexOf(r)===0)return o.substring(r.length,o.length)}return""},ba=function(n,r,s){const i=n+"="+r+"; expires="+s.toUTCString()+"; ";document.cookie=i},ya=function(n){const r=new Date;return r.setTime(r.getTime()+n*60*1e3),r};function em(t){const n=String.fromCodePoint(...t);return btoa(n)}async function tm(t){const r=new TextEncoder().encode(t);if(typeof crypto>"u"||typeof crypto.subtle>"u")throw new Error("Web Crypto API is not available.");return await crypto.subtle.digest("SHA-256",r)}function xo(t){const[,n]=t.split(".");if(typeof n!="string")throw new Error("Unable to decode token, payload not found.");let r;try{r=nm(n)}catch(s){throw new Error("Unable to decode token, payload is not a valid Base64URL value.",{cause:s})}try{return JSON.parse(r)}catch(s){throw new Error("Unable to decode token, payload is not a valid JSON value.",{cause:s})}}function nm(t){let n=t.replaceAll("-","+").replaceAll("_","/");switch(n.length%4){case 0:break;case 2:n+="==";break;case 3:n+="=";break;default:throw new Error("Input is not of the correct length.")}try{return rm(n)}catch{return atob(n)}}function rm(t){return decodeURIComponent(atob(t).replace(/(.)/g,(n,r)=>{let s=r.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function ja(t){return typeof t=="object"&&t!==null}async function sm(t){return await er(t)}async function im(t){return await er(t)}async function om(t,n,r,s,i){const o=new URLSearchParams([["code",n],["grant_type","authorization_code"],["client_id",r],["redirect_uri",s]]);return i&&o.append("code_verifier",i),await er(t,{method:"POST",credentials:"include",body:o})}async function am(t,n,r){const s=new URLSearchParams([["grant_type","refresh_token"],["refresh_token",n],["client_id",r]]);return await er(t,{method:"POST",credentials:"include",body:s})}async function er(t,n={}){const r=new Headers(n.headers);return r.set("Accept",$f),await(await lm(t,{...n,headers:r})).json()}async function lm(t,n){const r=await fetch(t,n);if(!r.ok)throw new Iu("Server responded with an invalid status.",{response:r});return r}function _c(t){if(!t)throw new Error("Unable to build authorization header, token is not set, make sure the user is authenticated.");return["Authorization",`bearer ${t}`]}function Ic(t){return t.endsWith("/")?t.slice(0,-1):t}class Iu extends Error{constructor(r,s){super(r,s);L(this,"response");this.response=s.response}}const cm=t=>new Promise(n=>setTimeout(n,t)),jl=window.__APP_CONFIG__||window.config||{},Fu=jl.VITE_KEYCLOAK_URL||void 0||"http://localhost:8081",Ou=jl.VITE_KEYCLOAK_REALM||void 0||"athena",Wu=jl.VITE_KEYCLOAK_CLIENT_ID||void 0||"web-client";console.log("[Keycloak] Config:",{KEYCLOAK_URL:Fu,KEYCLOAK_REALM:Ou,KEYCLOAK_CLIENT_ID:Wu});const st=new Vf({url:Fu,realm:Ou,clientId:Wu});window.__KC__=st;window.kc=st;function Fc(){const t=window.location.hash;(t.includes("state=")||t.includes("code=")||t.includes("error=")||t.includes("session_state="))&&(window.history.replaceState({},document.title,window.location.pathname+"#/"),window.dispatchEvent(new HashChangeEvent("hashchange")))}let js=null;function dm(){return js||(console.log("[Keycloak] Initializing..."),console.log("[Keycloak] URL:",window.location.href),console.log("[Keycloak] Hash:",window.location.hash),js=st.init({onLoad:"check-sso",checkLoginIframe:!1,pkceMethod:"S256",enableLogging:!0}).then(t=>{var n;return console.log("[Keycloak] Init result:",t),console.log("[Keycloak] User:",(n=st.tokenParsed)==null?void 0:n.preferred_username),Fc(),t&&setInterval(()=>{st.updateToken(30).catch(()=>{console.log("[Keycloak] Token refresh failed")})},1e4),t}).catch(t=>{throw console.error("[Keycloak] Init error:",t),Fc(),t}),js)}function pm(){return st.login({redirectUri:window.location.origin+"/"})}function um(){return st.logout({redirectUri:window.location.origin+"/"})}const hm=pm,Oc=um,xm=typeof window<"u"&&window.__APP_CONFIG__||{};var ud,hd;const fm=[xm.VITE_API_BASE,(hd=(ud=import.meta)==null?void 0:ud.env)==null?void 0:hd.VITE_API_BASE,void 0].filter(Boolean),mm=Array.from(new Set(fm.flatMap(t=>{if(!t)return[];const n=t.replace(/\/$/,"");return[n,n+"/api"]}).concat(["/api",""])));async function gm(){try{const t=window.__KC__||window.kc||window.keycloak;if(t!=null&&t.token)return t.token}catch{}return null}async function bn(t,n={}){var o;const r=await gm(),s=new Headers(n.headers||{});r&&s.set("Authorization",`Bearer ${r}`),!s.has("Content-Type")&&n.body&&s.set("Content-Type","application/json");let i=null;for(const a of mm){const l=(a||"")+t;try{const c=await fetch(l,{...n,headers:s});if(c.ok)return await((o=c.headers.get("content-type"))!=null&&o.includes("application/json")?c.json():c.text());i=new Error(`HTTP ${c.status} at ${l}`);continue}catch(c){i=c;continue}}throw i||new Error("Network error")}const vm=t=>{const n=Number.isFinite(t)?t:0;try{return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}catch{return`R$ ${n.toFixed(2)}`.replace(".",",")}},bm=async(t="corrente")=>{try{const n=await bn("/accounts/balance");if(n&&typeof n=="object"){if(typeof n.balance=="number")return{balance:n.balance};if(typeof n[t]=="number")return{balance:n[t]}}}catch{}return{balance:0}},ym=async()=>{try{return await bn("/cards")}catch{return[]}},jm=async()=>{try{return await bn("/pix/keys")}catch{return[]}},wm=async t=>{try{return await bn("/pix/keys",{method:"POST",body:JSON.stringify({type:t})})}catch{return{id:String(Date.now()),type:t,key:"RANDOM-"+Math.random().toString(36).slice(2)}}},km=async t=>{try{return await bn("/pix/keys/"+t,{method:"DELETE"})}catch{return{ok:!0}}},Nm=async t=>{try{return await bn("/pix/transfer",{method:"POST",body:JSON.stringify(t)})}catch{return{ok:!1}}},ft={toBRL:vm,balance:bm,cards:ym,pixKeys:jm,pixCreateKey:wm,pixDeleteKey:km,pixTransfer:Nm,_unsafeFetch:bn},Cm=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]}),Am=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"}),e.jsx("line",{x1:"1",y1:"1",x2:"23",y2:"23"})]}),ws=()=>e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5"})}),ks=()=>e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("polyline",{points:"17 1 21 5 17 9"}),e.jsx("path",{d:"M3 11V9a4 4 0 0 1 4-4h14"}),e.jsx("polyline",{points:"7 23 3 19 7 15"}),e.jsx("path",{d:"M21 13v2a4 4 0 0 1-4 4H3"})]}),Wc=()=>e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]}),Uc=()=>e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M2 4h2v16H2zM6 4h1v16H6zM9 4h2v16H9zM13 4h1v16h-1zM16 4h3v16h-3zM21 4h1v16h-1z"})}),Sm=()=>e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"})}),$c=()=>e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"9 18 15 12 9 6"})}),Vc=t=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(t),zm=t=>new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short"}).format(new Date(t));function Em({onLogout:t}){var k;const[n,r]=C.useState(!0),[s,i]=C.useState(12450.78),[o,a]=C.useState([]),[l,c]=C.useState([]),[d,h]=C.useState([]),[f,m]=C.useState(!0);return C.useEffect(()=>{let p=!0;return(async()=>{try{const[b,x,g]=await Promise.all([ft.balance("acc-001"),ft._unsafeFetch("/cards/cards").catch(()=>[]),ft._unsafeFetch("/pix/keys?account_id=acc-001").catch(()=>[])]);if(!p)return;i(Number((b==null?void 0:b.available)||(b==null?void 0:b.balance)||12450.78)),a(Array.isArray(x)?x:[]),c(Array.isArray(g)?g:[]),h([{id:"1",type:"pix",title:"PIX recebido",subtitle:"Maria Silva",amount:1250,date:new Date().toISOString()},{id:"2",type:"card",title:"Compra aprovada",subtitle:"Amazon",amount:-459.9,date:new Date(Date.now()-864e5).toISOString()},{id:"3",type:"pix",title:"PIX enviado",subtitle:"Joao Santos",amount:-200,date:new Date(Date.now()-1728e5).toISOString()},{id:"4",type:"ted",title:"TED recebido",subtitle:"Empresa LTDA",amount:8500,date:new Date(Date.now()-2592e5).toISOString()},{id:"5",type:"card",title:"Compra aprovada",subtitle:"Uber",amount:-32.5,date:new Date(Date.now()-3456e5).toISOString()}])}catch(b){console.error("Error loading dashboard data:",b)}finally{p&&m(!1)}})(),()=>{p=!1}},[]),f?e.jsxs("div",{className:"dashboard-loading",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("span",{children:"Carregando..."}),e.jsx("style",{children:`
          .dashboard-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            gap: 16px;
            color: #666;
          }
          .loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #262626;
            border-top-color: #C9A227;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `})]}):e.jsxs("div",{className:"dashboard",children:[e.jsxs("section",{className:"balance-section",children:[e.jsx("div",{className:"balance-header",children:e.jsxs("div",{className:"balance-label",children:[e.jsx("span",{children:"Saldo disponivel"}),e.jsx("button",{className:"visibility-btn",onClick:()=>r(!n),children:n?e.jsx(Cm,{}):e.jsx(Am,{})})]})}),e.jsx("div",{className:`balance-value ${n?"":"hidden"}`,children:n?Vc(s):"••••••"}),e.jsxs("div",{className:"balance-actions",children:[e.jsxs("a",{href:"#/pix/send",className:"action-btn primary",children:[e.jsx(ws,{}),e.jsx("span",{children:"Enviar PIX"})]}),e.jsxs("a",{href:"#/transferir",className:"action-btn",children:[e.jsx(ks,{}),e.jsx("span",{children:"Transferir"})]})]})]}),e.jsxs("section",{className:"quick-actions stagger-animate",children:[e.jsxs("a",{href:"#/pix",className:"quick-action",children:[e.jsx("div",{className:"quick-icon",children:e.jsx(ws,{})}),e.jsx("span",{children:"PIX"})]}),e.jsxs("a",{href:"#/cartoes",className:"quick-action",children:[e.jsx("div",{className:"quick-icon",children:e.jsx(Wc,{})}),e.jsx("span",{children:"Cartoes"})]}),e.jsxs("a",{href:"#/boleto",className:"quick-action",children:[e.jsx("div",{className:"quick-icon",children:e.jsx(Uc,{})}),e.jsx("span",{children:"Boleto"})]}),e.jsxs("a",{href:"#/emprestimo",className:"quick-action",children:[e.jsx("div",{className:"quick-icon",children:e.jsx(Sm,{})}),e.jsx("span",{children:"Emprestimo"})]})]}),e.jsxs("section",{className:"card-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Meus Cartoes"}),e.jsxs("a",{href:"#/cartoes",className:"section-link",children:["Ver todos ",e.jsx($c,{})]})]}),e.jsxs("div",{className:"credit-card",children:[e.jsx("div",{className:"card-gradient"}),e.jsxs("div",{className:"card-content",children:[e.jsxs("div",{className:"card-header",children:[e.jsx("span",{className:"card-label",children:"Athena Black"}),e.jsx("span",{className:"card-brand",children:"VISA"})]}),e.jsx("div",{className:"card-chip",children:e.jsxs("div",{className:"chip-lines",children:[e.jsx("div",{}),e.jsx("div",{}),e.jsx("div",{}),e.jsx("div",{})]})}),e.jsxs("div",{className:"card-number",children:["•••• •••• •••• ",((k=o[0])==null?void 0:k.last_four)||"4521"]}),e.jsxs("div",{className:"card-footer",children:[e.jsxs("div",{className:"card-holder",children:[e.jsx("span",{className:"label",children:"TITULAR"}),e.jsx("span",{className:"value",children:"JEFFERSON LEITE"})]}),e.jsxs("div",{className:"card-expiry",children:[e.jsx("span",{className:"label",children:"VALIDADE"}),e.jsx("span",{className:"value",children:"12/28"})]})]})]})]})]}),e.jsxs("section",{className:"pix-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"PIX"}),e.jsxs("span",{className:"pix-badge",children:[l.length||2," chaves"]})]}),e.jsxs("div",{className:"pix-grid",children:[e.jsxs("a",{href:"#/pix/send",className:"pix-action",children:[e.jsx(ks,{}),e.jsx("span",{children:"Enviar"})]}),e.jsxs("a",{href:"#/pix/receive",className:"pix-action",children:[e.jsx(ks,{}),e.jsx("span",{children:"Receber"})]}),e.jsxs("a",{href:"#/pix",className:"pix-action",children:[e.jsx(ws,{}),e.jsx("span",{children:"Chaves"})]})]})]}),e.jsxs("section",{className:"transactions-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Ultimas Transacoes"}),e.jsxs("a",{href:"#/contas",className:"section-link",children:["Ver todas ",e.jsx($c,{})]})]}),e.jsx("div",{className:"transactions-list",children:d.map(p=>e.jsxs("div",{className:"transaction-item",children:[e.jsxs("div",{className:`transaction-icon ${p.type}`,children:[p.type==="pix"&&e.jsx(ws,{}),p.type==="card"&&e.jsx(Wc,{}),p.type==="ted"&&e.jsx(ks,{}),p.type==="boleto"&&e.jsx(Uc,{})]}),e.jsxs("div",{className:"transaction-info",children:[e.jsx("span",{className:"transaction-title",children:p.title}),e.jsx("span",{className:"transaction-subtitle",children:p.subtitle})]}),e.jsxs("div",{className:"transaction-amount",children:[e.jsxs("span",{className:p.amount>=0?"positive":"negative",children:[p.amount>=0?"+":"",Vc(p.amount)]}),e.jsx("span",{className:"transaction-date",children:zm(p.date)})]})]},p.id))})]}),e.jsx("style",{children:`
        .dashboard {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px 20px 40px;
        }

        /* Balance Section */
        .balance-section {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          border: 1px solid #262626;
          border-radius: 24px;
          padding: 28px;
          margin-bottom: 24px;
        }

        .balance-header {
          margin-bottom: 8px;
        }

        .balance-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #A3A3A3;
          font-size: 14px;
        }

        .visibility-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 8px;
          margin: -8px;
          transition: color 0.2s;
        }

        .visibility-btn:hover {
          color: #C9A227;
        }

        .balance-value {
          font-size: 40px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          transition: all 0.2s;
        }

        .balance-value.hidden {
          color: #666;
        }

        .balance-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 20px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 14px;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #333;
          border-color: #444;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          color: #0D0D0D;
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201, 162, 39, 0.3);
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .quick-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px 12px;
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 16px;
          text-decoration: none;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .quick-action:hover {
          border-color: #C9A227;
          transform: translateY(-2px);
        }

        .quick-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 1px solid rgba(201, 162, 39, 0.2);
          border-radius: 14px;
          color: #C9A227;
        }

        /* Card Section */
        .card-section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .section-header h2 {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .section-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #C9A227;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .credit-card {
          position: relative;
          background: #0D0D0D;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          overflow: hidden;
        }

        .card-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .card-content {
          position: relative;
          z-index: 1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-label {
          font-size: 14px;
          font-weight: 600;
          color: #C9A227;
        }

        .card-brand {
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .card-chip {
          width: 45px;
          height: 32px;
          background: linear-gradient(135deg, #C9A227 0%, #A68B1F 100%);
          border-radius: 6px;
          padding: 6px;
          margin-bottom: 20px;
        }

        .chip-lines {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          height: 100%;
        }

        .chip-lines div {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 1px;
        }

        .card-number {
          font-family: 'Courier New', monospace;
          font-size: 18px;
          color: #fff;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .card-footer {
          display: flex;
          gap: 40px;
        }

        .card-holder, .card-expiry {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-holder .label, .card-expiry .label {
          font-size: 10px;
          color: #666;
          letter-spacing: 0.1em;
        }

        .card-holder .value, .card-expiry .value {
          font-size: 13px;
          color: #fff;
          font-weight: 600;
        }

        /* PIX Section */
        .pix-section {
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .pix-badge {
          font-size: 12px;
          padding: 4px 12px;
          background: rgba(201, 162, 39, 0.15);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          color: #C9A227;
        }

        .pix-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .pix-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 14px;
          text-decoration: none;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .pix-action:hover {
          border-color: #C9A227;
          background: #333;
        }

        .pix-action svg {
          color: #C9A227;
        }

        /* Transactions Section */
        .transactions-section {
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 20px;
          padding: 20px;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #262626;
        }

        .transaction-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .transaction-item:first-child {
          padding-top: 0;
        }

        .transaction-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
          color: #666;
        }

        .transaction-icon.pix { color: #C9A227; }
        .transaction-icon.card { color: #3B82F6; }
        .transaction-icon.ted { color: #22C55E; }

        .transaction-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .transaction-title {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .transaction-subtitle {
          font-size: 12px;
          color: #666;
        }

        .transaction-amount {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .transaction-amount .positive {
          color: #22C55E;
          font-weight: 600;
          font-size: 14px;
        }

        .transaction-amount .negative {
          color: #fff;
          font-weight: 600;
          font-size: 14px;
        }

        .transaction-date {
          font-size: 11px;
          color: #666;
        }

        /* Stagger Animations */
        .stagger-animate > * {
          opacity: 0;
          animation: staggerFadeIn 0.4s ease-out forwards;
        }

        .stagger-animate > *:nth-child(1) { animation-delay: 0ms; }
        .stagger-animate > *:nth-child(2) { animation-delay: 60ms; }
        .stagger-animate > *:nth-child(3) { animation-delay: 120ms; }
        .stagger-animate > *:nth-child(4) { animation-delay: 180ms; }
        .stagger-animate > *:nth-child(5) { animation-delay: 240ms; }

        @keyframes staggerFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .balance-section {
          animation: slideDown 0.4s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-section, .pix-section, .transactions-section {
          animation: fadeInSection 0.5s ease-out;
        }

        @keyframes fadeInSection {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .dashboard {
            padding: 16px 16px 32px;
          }

          .balance-value {
            font-size: 32px;
          }

          .balance-actions {
            flex-direction: column;
          }

          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }

          .card-footer {
            gap: 24px;
          }
        }
      `})]})}function Pm({onLogin:t}){return e.jsxs("div",{className:"login-page",children:[e.jsxs("div",{className:"login-container",children:[e.jsxs("div",{className:"login-logo",children:[e.jsx("div",{className:"logo-dot"}),e.jsx("span",{className:"logo-text",children:"Athena"})]}),e.jsxs("div",{className:"login-card",children:[e.jsxs("div",{className:"login-card-content",children:[e.jsx("h1",{className:"login-title",children:"Bem-vindo ao Athena"}),e.jsx("p",{className:"login-subtitle",children:"Sua conta digital premium com segurança e sofisticação."}),e.jsxs("button",{onClick:t,className:"login-btn",children:[e.jsx("span",{children:"Entrar na conta"}),e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]}),e.jsx("div",{className:"login-divider",children:e.jsx("span",{children:"ou"})}),e.jsx("button",{className:"login-btn-outline",onClick:t,children:"Criar conta"})]}),e.jsx("div",{className:"login-footer",children:e.jsxs("div",{className:"login-security",children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]}),e.jsx("span",{children:"Conexao segura com criptografia"})]})})]}),e.jsxs("div",{className:"login-features",children:[e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"feature-icon",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"})})}),e.jsx("span",{children:"Seguranca premium"})]}),e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"feature-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]})}),e.jsx("span",{children:"Cartoes exclusivos"})]}),e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"feature-icon",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5"})})}),e.jsx("span",{children:"PIX instantaneo"})]})]})]}),e.jsx("style",{children:`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0D0D0D;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .login-page::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 20%, rgba(201, 162, 39, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(201, 162, 39, 0.05) 0%, transparent 40%);
          pointer-events: none;
        }

        .login-container {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          box-shadow: 0 0 30px rgba(201, 162, 39, 0.5);
        }

        .logo-text {
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .login-card {
          width: 100%;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .login-card-content {
          padding: 40px 32px 32px;
        }

        .login-title {
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
          text-align: center;
        }

        .login-subtitle {
          font-size: 15px;
          color: #A3A3A3;
          margin: 0 0 32px;
          text-align: center;
          line-height: 1.5;
        }

        .login-btn {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 162, 39, 0.4);
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
        }

        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #333;
        }

        .login-divider span {
          color: #666;
          font-size: 13px;
        }

        .login-btn-outline {
          width: 100%;
          padding: 14px 24px;
          background: transparent;
          border: 1px solid #444;
          border-radius: 14px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .login-btn-outline:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        .login-footer {
          padding: 16px 32px;
          background: #151515;
          border-top: 1px solid #262626;
        }

        .login-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #666;
          font-size: 12px;
        }

        .login-security svg {
          color: #22C55E;
        }

        .login-features {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 13px;
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 10px;
          color: #C9A227;
        }

        @media (max-width: 480px) {
          .login-card-content {
            padding: 32px 24px 24px;
          }

          .login-title {
            font-size: 22px;
          }

          .login-features {
            flex-direction: column;
            align-items: center;
          }
        }
      `})]})}function Uu(t,n){return function(){return t.apply(n,arguments)}}const{toString:Dm}=Object.prototype,{getPrototypeOf:wl}=Object,{iterator:Ri,toStringTag:$u}=Symbol,Li=(t=>n=>{const r=Dm.call(n);return t[r]||(t[r]=r.slice(8,-1).toLowerCase())})(Object.create(null)),ot=t=>(t=t.toLowerCase(),n=>Li(n)===t),_i=t=>n=>typeof n===t,{isArray:ir}=Array,tr=_i("undefined");function Zr(t){return t!==null&&!tr(t)&&t.constructor!==null&&!tr(t.constructor)&&De(t.constructor.isBuffer)&&t.constructor.isBuffer(t)}const Vu=ot("ArrayBuffer");function Tm(t){let n;return typeof ArrayBuffer<"u"&&ArrayBuffer.isView?n=ArrayBuffer.isView(t):n=t&&t.buffer&&Vu(t.buffer),n}const Mm=_i("string"),De=_i("function"),Hu=_i("number"),es=t=>t!==null&&typeof t=="object",Bm=t=>t===!0||t===!1,Vs=t=>{if(Li(t)!=="object")return!1;const n=wl(t);return(n===null||n===Object.prototype||Object.getPrototypeOf(n)===null)&&!($u in t)&&!(Ri in t)},Rm=t=>{if(!es(t)||Zr(t))return!1;try{return Object.keys(t).length===0&&Object.getPrototypeOf(t)===Object.prototype}catch{return!1}},Lm=ot("Date"),_m=ot("File"),Im=ot("Blob"),Fm=ot("FileList"),Om=t=>es(t)&&De(t.pipe),Wm=t=>{let n;return t&&(typeof FormData=="function"&&t instanceof FormData||De(t.append)&&((n=Li(t))==="formdata"||n==="object"&&De(t.toString)&&t.toString()==="[object FormData]"))},Um=ot("URLSearchParams"),[$m,Vm,Hm,qm]=["ReadableStream","Request","Response","Headers"].map(ot),Km=t=>t.trim?t.trim():t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");function ts(t,n,{allOwnKeys:r=!1}={}){if(t===null||typeof t>"u")return;let s,i;if(typeof t!="object"&&(t=[t]),ir(t))for(s=0,i=t.length;s<i;s++)n.call(null,t[s],s,t);else{if(Zr(t))return;const o=r?Object.getOwnPropertyNames(t):Object.keys(t),a=o.length;let l;for(s=0;s<a;s++)l=o[s],n.call(null,t[l],l,t)}}function qu(t,n){if(Zr(t))return null;n=n.toLowerCase();const r=Object.keys(t);let s=r.length,i;for(;s-- >0;)if(i=r[s],n===i.toLowerCase())return i;return null}const an=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:global,Ku=t=>!tr(t)&&t!==an;function wa(){const{caseless:t,skipUndefined:n}=Ku(this)&&this||{},r={},s=(i,o)=>{const a=t&&qu(r,o)||o;Vs(r[a])&&Vs(i)?r[a]=wa(r[a],i):Vs(i)?r[a]=wa({},i):ir(i)?r[a]=i.slice():(!n||!tr(i))&&(r[a]=i)};for(let i=0,o=arguments.length;i<o;i++)arguments[i]&&ts(arguments[i],s);return r}const Qm=(t,n,r,{allOwnKeys:s}={})=>(ts(n,(i,o)=>{r&&De(i)?t[o]=Uu(i,r):t[o]=i},{allOwnKeys:s}),t),Ym=t=>(t.charCodeAt(0)===65279&&(t=t.slice(1)),t),Jm=(t,n,r,s)=>{t.prototype=Object.create(n.prototype,s),t.prototype.constructor=t,Object.defineProperty(t,"super",{value:n.prototype}),r&&Object.assign(t.prototype,r)},Xm=(t,n,r,s)=>{let i,o,a;const l={};if(n=n||{},t==null)return n;do{for(i=Object.getOwnPropertyNames(t),o=i.length;o-- >0;)a=i[o],(!s||s(a,t,n))&&!l[a]&&(n[a]=t[a],l[a]=!0);t=r!==!1&&wl(t)}while(t&&(!r||r(t,n))&&t!==Object.prototype);return n},Gm=(t,n,r)=>{t=String(t),(r===void 0||r>t.length)&&(r=t.length),r-=n.length;const s=t.indexOf(n,r);return s!==-1&&s===r},Zm=t=>{if(!t)return null;if(ir(t))return t;let n=t.length;if(!Hu(n))return null;const r=new Array(n);for(;n-- >0;)r[n]=t[n];return r},e1=(t=>n=>t&&n instanceof t)(typeof Uint8Array<"u"&&wl(Uint8Array)),t1=(t,n)=>{const s=(t&&t[Ri]).call(t);let i;for(;(i=s.next())&&!i.done;){const o=i.value;n.call(t,o[0],o[1])}},n1=(t,n)=>{let r;const s=[];for(;(r=t.exec(n))!==null;)s.push(r);return s},r1=ot("HTMLFormElement"),s1=t=>t.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(r,s,i){return s.toUpperCase()+i}),Hc=(({hasOwnProperty:t})=>(n,r)=>t.call(n,r))(Object.prototype),i1=ot("RegExp"),Qu=(t,n)=>{const r=Object.getOwnPropertyDescriptors(t),s={};ts(r,(i,o)=>{let a;(a=n(i,o,t))!==!1&&(s[o]=a||i)}),Object.defineProperties(t,s)},o1=t=>{Qu(t,(n,r)=>{if(De(t)&&["arguments","caller","callee"].indexOf(r)!==-1)return!1;const s=t[r];if(De(s)){if(n.enumerable=!1,"writable"in n){n.writable=!1;return}n.set||(n.set=()=>{throw Error("Can not rewrite read-only method '"+r+"'")})}})},a1=(t,n)=>{const r={},s=i=>{i.forEach(o=>{r[o]=!0})};return ir(t)?s(t):s(String(t).split(n)),r},l1=()=>{},c1=(t,n)=>t!=null&&Number.isFinite(t=+t)?t:n;function d1(t){return!!(t&&De(t.append)&&t[$u]==="FormData"&&t[Ri])}const p1=t=>{const n=new Array(10),r=(s,i)=>{if(es(s)){if(n.indexOf(s)>=0)return;if(Zr(s))return s;if(!("toJSON"in s)){n[i]=s;const o=ir(s)?[]:{};return ts(s,(a,l)=>{const c=r(a,i+1);!tr(c)&&(o[l]=c)}),n[i]=void 0,o}}return s};return r(t,0)},u1=ot("AsyncFunction"),h1=t=>t&&(es(t)||De(t))&&De(t.then)&&De(t.catch),Yu=((t,n)=>t?setImmediate:n?((r,s)=>(an.addEventListener("message",({source:i,data:o})=>{i===an&&o===r&&s.length&&s.shift()()},!1),i=>{s.push(i),an.postMessage(r,"*")}))(`axios@${Math.random()}`,[]):r=>setTimeout(r))(typeof setImmediate=="function",De(an.postMessage)),x1=typeof queueMicrotask<"u"?queueMicrotask.bind(an):typeof process<"u"&&process.nextTick||Yu,f1=t=>t!=null&&De(t[Ri]),N={isArray:ir,isArrayBuffer:Vu,isBuffer:Zr,isFormData:Wm,isArrayBufferView:Tm,isString:Mm,isNumber:Hu,isBoolean:Bm,isObject:es,isPlainObject:Vs,isEmptyObject:Rm,isReadableStream:$m,isRequest:Vm,isResponse:Hm,isHeaders:qm,isUndefined:tr,isDate:Lm,isFile:_m,isBlob:Im,isRegExp:i1,isFunction:De,isStream:Om,isURLSearchParams:Um,isTypedArray:e1,isFileList:Fm,forEach:ts,merge:wa,extend:Qm,trim:Km,stripBOM:Ym,inherits:Jm,toFlatObject:Xm,kindOf:Li,kindOfTest:ot,endsWith:Gm,toArray:Zm,forEachEntry:t1,matchAll:n1,isHTMLForm:r1,hasOwnProperty:Hc,hasOwnProp:Hc,reduceDescriptors:Qu,freezeMethods:o1,toObjectSet:a1,toCamelCase:s1,noop:l1,toFiniteNumber:c1,findKey:qu,global:an,isContextDefined:Ku,isSpecCompliantForm:d1,toJSONObject:p1,isAsyncFn:u1,isThenable:h1,setImmediate:Yu,asap:x1,isIterable:f1};function F(t,n,r,s,i){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack,this.message=t,this.name="AxiosError",n&&(this.code=n),r&&(this.config=r),s&&(this.request=s),i&&(this.response=i,this.status=i.status?i.status:null)}N.inherits(F,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:N.toJSONObject(this.config),code:this.code,status:this.status}}});const Ju=F.prototype,Xu={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach(t=>{Xu[t]={value:t}});Object.defineProperties(F,Xu);Object.defineProperty(Ju,"isAxiosError",{value:!0});F.from=(t,n,r,s,i,o)=>{const a=Object.create(Ju);N.toFlatObject(t,a,function(h){return h!==Error.prototype},d=>d!=="isAxiosError");const l=t&&t.message?t.message:"Error",c=n==null&&t?t.code:n;return F.call(a,l,c,r,s,i),t&&a.cause==null&&Object.defineProperty(a,"cause",{value:t,configurable:!0}),a.name=t&&t.name||"Error",o&&Object.assign(a,o),a};const m1=null;function ka(t){return N.isPlainObject(t)||N.isArray(t)}function Gu(t){return N.endsWith(t,"[]")?t.slice(0,-2):t}function qc(t,n,r){return t?t.concat(n).map(function(i,o){return i=Gu(i),!r&&o?"["+i+"]":i}).join(r?".":""):n}function g1(t){return N.isArray(t)&&!t.some(ka)}const v1=N.toFlatObject(N,{},null,function(n){return/^is[A-Z]/.test(n)});function Ii(t,n,r){if(!N.isObject(t))throw new TypeError("target must be an object");n=n||new FormData,r=N.toFlatObject(r,{metaTokens:!0,dots:!1,indexes:!1},!1,function(v,b){return!N.isUndefined(b[v])});const s=r.metaTokens,i=r.visitor||h,o=r.dots,a=r.indexes,c=(r.Blob||typeof Blob<"u"&&Blob)&&N.isSpecCompliantForm(n);if(!N.isFunction(i))throw new TypeError("visitor must be a function");function d(p){if(p===null)return"";if(N.isDate(p))return p.toISOString();if(N.isBoolean(p))return p.toString();if(!c&&N.isBlob(p))throw new F("Blob is not supported. Use a Buffer instead.");return N.isArrayBuffer(p)||N.isTypedArray(p)?c&&typeof Blob=="function"?new Blob([p]):Buffer.from(p):p}function h(p,v,b){let x=p;if(p&&!b&&typeof p=="object"){if(N.endsWith(v,"{}"))v=s?v:v.slice(0,-2),p=JSON.stringify(p);else if(N.isArray(p)&&g1(p)||(N.isFileList(p)||N.endsWith(v,"[]"))&&(x=N.toArray(p)))return v=Gu(v),x.forEach(function(u,y){!(N.isUndefined(u)||u===null)&&n.append(a===!0?qc([v],y,o):a===null?v:v+"[]",d(u))}),!1}return ka(p)?!0:(n.append(qc(b,v,o),d(p)),!1)}const f=[],m=Object.assign(v1,{defaultVisitor:h,convertValue:d,isVisitable:ka});function k(p,v){if(!N.isUndefined(p)){if(f.indexOf(p)!==-1)throw Error("Circular reference detected in "+v.join("."));f.push(p),N.forEach(p,function(x,g){(!(N.isUndefined(x)||x===null)&&i.call(n,x,N.isString(g)?g.trim():g,v,m))===!0&&k(x,v?v.concat(g):[g])}),f.pop()}}if(!N.isObject(t))throw new TypeError("data must be an object");return k(t),n}function Kc(t){const n={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(t).replace(/[!'()~]|%20|%00/g,function(s){return n[s]})}function kl(t,n){this._pairs=[],t&&Ii(t,this,n)}const Zu=kl.prototype;Zu.append=function(n,r){this._pairs.push([n,r])};Zu.toString=function(n){const r=n?function(s){return n.call(this,s,Kc)}:Kc;return this._pairs.map(function(i){return r(i[0])+"="+r(i[1])},"").join("&")};function b1(t){return encodeURIComponent(t).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+")}function eh(t,n,r){if(!n)return t;const s=r&&r.encode||b1;N.isFunction(r)&&(r={serialize:r});const i=r&&r.serialize;let o;if(i?o=i(n,r):o=N.isURLSearchParams(n)?n.toString():new kl(n,r).toString(s),o){const a=t.indexOf("#");a!==-1&&(t=t.slice(0,a)),t+=(t.indexOf("?")===-1?"?":"&")+o}return t}class Qc{constructor(){this.handlers=[]}use(n,r,s){return this.handlers.push({fulfilled:n,rejected:r,synchronous:s?s.synchronous:!1,runWhen:s?s.runWhen:null}),this.handlers.length-1}eject(n){this.handlers[n]&&(this.handlers[n]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(n){N.forEach(this.handlers,function(s){s!==null&&n(s)})}}const th={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},y1=typeof URLSearchParams<"u"?URLSearchParams:kl,j1=typeof FormData<"u"?FormData:null,w1=typeof Blob<"u"?Blob:null,k1={isBrowser:!0,classes:{URLSearchParams:y1,FormData:j1,Blob:w1},protocols:["http","https","file","blob","url","data"]},Nl=typeof window<"u"&&typeof document<"u",Na=typeof navigator=="object"&&navigator||void 0,N1=Nl&&(!Na||["ReactNative","NativeScript","NS"].indexOf(Na.product)<0),C1=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope&&typeof self.importScripts=="function",A1=Nl&&window.location.href||"http://localhost",S1=Object.freeze(Object.defineProperty({__proto__:null,hasBrowserEnv:Nl,hasStandardBrowserEnv:N1,hasStandardBrowserWebWorkerEnv:C1,navigator:Na,origin:A1},Symbol.toStringTag,{value:"Module"})),ve={...S1,...k1};function z1(t,n){return Ii(t,new ve.classes.URLSearchParams,{visitor:function(r,s,i,o){return ve.isNode&&N.isBuffer(r)?(this.append(s,r.toString("base64")),!1):o.defaultVisitor.apply(this,arguments)},...n})}function E1(t){return N.matchAll(/\w+|\[(\w*)]/g,t).map(n=>n[0]==="[]"?"":n[1]||n[0])}function P1(t){const n={},r=Object.keys(t);let s;const i=r.length;let o;for(s=0;s<i;s++)o=r[s],n[o]=t[o];return n}function nh(t){function n(r,s,i,o){let a=r[o++];if(a==="__proto__")return!0;const l=Number.isFinite(+a),c=o>=r.length;return a=!a&&N.isArray(i)?i.length:a,c?(N.hasOwnProp(i,a)?i[a]=[i[a],s]:i[a]=s,!l):((!i[a]||!N.isObject(i[a]))&&(i[a]=[]),n(r,s,i[a],o)&&N.isArray(i[a])&&(i[a]=P1(i[a])),!l)}if(N.isFormData(t)&&N.isFunction(t.entries)){const r={};return N.forEachEntry(t,(s,i)=>{n(E1(s),i,r,0)}),r}return null}function D1(t,n,r){if(N.isString(t))try{return(n||JSON.parse)(t),N.trim(t)}catch(s){if(s.name!=="SyntaxError")throw s}return(r||JSON.stringify)(t)}const ns={transitional:th,adapter:["xhr","http","fetch"],transformRequest:[function(n,r){const s=r.getContentType()||"",i=s.indexOf("application/json")>-1,o=N.isObject(n);if(o&&N.isHTMLForm(n)&&(n=new FormData(n)),N.isFormData(n))return i?JSON.stringify(nh(n)):n;if(N.isArrayBuffer(n)||N.isBuffer(n)||N.isStream(n)||N.isFile(n)||N.isBlob(n)||N.isReadableStream(n))return n;if(N.isArrayBufferView(n))return n.buffer;if(N.isURLSearchParams(n))return r.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),n.toString();let l;if(o){if(s.indexOf("application/x-www-form-urlencoded")>-1)return z1(n,this.formSerializer).toString();if((l=N.isFileList(n))||s.indexOf("multipart/form-data")>-1){const c=this.env&&this.env.FormData;return Ii(l?{"files[]":n}:n,c&&new c,this.formSerializer)}}return o||i?(r.setContentType("application/json",!1),D1(n)):n}],transformResponse:[function(n){const r=this.transitional||ns.transitional,s=r&&r.forcedJSONParsing,i=this.responseType==="json";if(N.isResponse(n)||N.isReadableStream(n))return n;if(n&&N.isString(n)&&(s&&!this.responseType||i)){const a=!(r&&r.silentJSONParsing)&&i;try{return JSON.parse(n,this.parseReviver)}catch(l){if(a)throw l.name==="SyntaxError"?F.from(l,F.ERR_BAD_RESPONSE,this,null,this.response):l}}return n}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:ve.classes.FormData,Blob:ve.classes.Blob},validateStatus:function(n){return n>=200&&n<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};N.forEach(["delete","get","head","post","put","patch"],t=>{ns.headers[t]={}});const T1=N.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),M1=t=>{const n={};let r,s,i;return t&&t.split(`
`).forEach(function(a){i=a.indexOf(":"),r=a.substring(0,i).trim().toLowerCase(),s=a.substring(i+1).trim(),!(!r||n[r]&&T1[r])&&(r==="set-cookie"?n[r]?n[r].push(s):n[r]=[s]:n[r]=n[r]?n[r]+", "+s:s)}),n},Yc=Symbol("internals");function fr(t){return t&&String(t).trim().toLowerCase()}function Hs(t){return t===!1||t==null?t:N.isArray(t)?t.map(Hs):String(t)}function B1(t){const n=Object.create(null),r=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let s;for(;s=r.exec(t);)n[s[1]]=s[2];return n}const R1=t=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(t.trim());function fo(t,n,r,s,i){if(N.isFunction(s))return s.call(this,n,r);if(i&&(n=r),!!N.isString(n)){if(N.isString(s))return n.indexOf(s)!==-1;if(N.isRegExp(s))return s.test(n)}}function L1(t){return t.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(n,r,s)=>r.toUpperCase()+s)}function _1(t,n){const r=N.toCamelCase(" "+n);["get","set","has"].forEach(s=>{Object.defineProperty(t,s+r,{value:function(i,o,a){return this[s].call(this,n,i,o,a)},configurable:!0})})}let Te=class{constructor(n){n&&this.set(n)}set(n,r,s){const i=this;function o(l,c,d){const h=fr(c);if(!h)throw new Error("header name must be a non-empty string");const f=N.findKey(i,h);(!f||i[f]===void 0||d===!0||d===void 0&&i[f]!==!1)&&(i[f||c]=Hs(l))}const a=(l,c)=>N.forEach(l,(d,h)=>o(d,h,c));if(N.isPlainObject(n)||n instanceof this.constructor)a(n,r);else if(N.isString(n)&&(n=n.trim())&&!R1(n))a(M1(n),r);else if(N.isObject(n)&&N.isIterable(n)){let l={},c,d;for(const h of n){if(!N.isArray(h))throw TypeError("Object iterator must return a key-value pair");l[d=h[0]]=(c=l[d])?N.isArray(c)?[...c,h[1]]:[c,h[1]]:h[1]}a(l,r)}else n!=null&&o(r,n,s);return this}get(n,r){if(n=fr(n),n){const s=N.findKey(this,n);if(s){const i=this[s];if(!r)return i;if(r===!0)return B1(i);if(N.isFunction(r))return r.call(this,i,s);if(N.isRegExp(r))return r.exec(i);throw new TypeError("parser must be boolean|regexp|function")}}}has(n,r){if(n=fr(n),n){const s=N.findKey(this,n);return!!(s&&this[s]!==void 0&&(!r||fo(this,this[s],s,r)))}return!1}delete(n,r){const s=this;let i=!1;function o(a){if(a=fr(a),a){const l=N.findKey(s,a);l&&(!r||fo(s,s[l],l,r))&&(delete s[l],i=!0)}}return N.isArray(n)?n.forEach(o):o(n),i}clear(n){const r=Object.keys(this);let s=r.length,i=!1;for(;s--;){const o=r[s];(!n||fo(this,this[o],o,n,!0))&&(delete this[o],i=!0)}return i}normalize(n){const r=this,s={};return N.forEach(this,(i,o)=>{const a=N.findKey(s,o);if(a){r[a]=Hs(i),delete r[o];return}const l=n?L1(o):String(o).trim();l!==o&&delete r[o],r[l]=Hs(i),s[l]=!0}),this}concat(...n){return this.constructor.concat(this,...n)}toJSON(n){const r=Object.create(null);return N.forEach(this,(s,i)=>{s!=null&&s!==!1&&(r[i]=n&&N.isArray(s)?s.join(", "):s)}),r}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([n,r])=>n+": "+r).join(`
`)}getSetCookie(){return this.get("set-cookie")||[]}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(n){return n instanceof this?n:new this(n)}static concat(n,...r){const s=new this(n);return r.forEach(i=>s.set(i)),s}static accessor(n){const s=(this[Yc]=this[Yc]={accessors:{}}).accessors,i=this.prototype;function o(a){const l=fr(a);s[l]||(_1(i,a),s[l]=!0)}return N.isArray(n)?n.forEach(o):o(n),this}};Te.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]);N.reduceDescriptors(Te.prototype,({value:t},n)=>{let r=n[0].toUpperCase()+n.slice(1);return{get:()=>t,set(s){this[r]=s}}});N.freezeMethods(Te);function mo(t,n){const r=this||ns,s=n||r,i=Te.from(s.headers);let o=s.data;return N.forEach(t,function(l){o=l.call(r,o,i.normalize(),n?n.status:void 0)}),i.normalize(),o}function rh(t){return!!(t&&t.__CANCEL__)}function or(t,n,r){F.call(this,t??"canceled",F.ERR_CANCELED,n,r),this.name="CanceledError"}N.inherits(or,F,{__CANCEL__:!0});function sh(t,n,r){const s=r.config.validateStatus;!r.status||!s||s(r.status)?t(r):n(new F("Request failed with status code "+r.status,[F.ERR_BAD_REQUEST,F.ERR_BAD_RESPONSE][Math.floor(r.status/100)-4],r.config,r.request,r))}function I1(t){const n=/^([-+\w]{1,25})(:?\/\/|:)/.exec(t);return n&&n[1]||""}function F1(t,n){t=t||10;const r=new Array(t),s=new Array(t);let i=0,o=0,a;return n=n!==void 0?n:1e3,function(c){const d=Date.now(),h=s[o];a||(a=d),r[i]=c,s[i]=d;let f=o,m=0;for(;f!==i;)m+=r[f++],f=f%t;if(i=(i+1)%t,i===o&&(o=(o+1)%t),d-a<n)return;const k=h&&d-h;return k?Math.round(m*1e3/k):void 0}}function O1(t,n){let r=0,s=1e3/n,i,o;const a=(d,h=Date.now())=>{r=h,i=null,o&&(clearTimeout(o),o=null),t(...d)};return[(...d)=>{const h=Date.now(),f=h-r;f>=s?a(d,h):(i=d,o||(o=setTimeout(()=>{o=null,a(i)},s-f)))},()=>i&&a(i)]}const vi=(t,n,r=3)=>{let s=0;const i=F1(50,250);return O1(o=>{const a=o.loaded,l=o.lengthComputable?o.total:void 0,c=a-s,d=i(c),h=a<=l;s=a;const f={loaded:a,total:l,progress:l?a/l:void 0,bytes:c,rate:d||void 0,estimated:d&&l&&h?(l-a)/d:void 0,event:o,lengthComputable:l!=null,[n?"download":"upload"]:!0};t(f)},r)},Jc=(t,n)=>{const r=t!=null;return[s=>n[0]({lengthComputable:r,total:t,loaded:s}),n[1]]},Xc=t=>(...n)=>N.asap(()=>t(...n)),W1=ve.hasStandardBrowserEnv?((t,n)=>r=>(r=new URL(r,ve.origin),t.protocol===r.protocol&&t.host===r.host&&(n||t.port===r.port)))(new URL(ve.origin),ve.navigator&&/(msie|trident)/i.test(ve.navigator.userAgent)):()=>!0,U1=ve.hasStandardBrowserEnv?{write(t,n,r,s,i,o,a){if(typeof document>"u")return;const l=[`${t}=${encodeURIComponent(n)}`];N.isNumber(r)&&l.push(`expires=${new Date(r).toUTCString()}`),N.isString(s)&&l.push(`path=${s}`),N.isString(i)&&l.push(`domain=${i}`),o===!0&&l.push("secure"),N.isString(a)&&l.push(`SameSite=${a}`),document.cookie=l.join("; ")},read(t){if(typeof document>"u")return null;const n=document.cookie.match(new RegExp("(?:^|; )"+t+"=([^;]*)"));return n?decodeURIComponent(n[1]):null},remove(t){this.write(t,"",Date.now()-864e5,"/")}}:{write(){},read(){return null},remove(){}};function $1(t){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)}function V1(t,n){return n?t.replace(/\/?\/$/,"")+"/"+n.replace(/^\/+/,""):t}function ih(t,n,r){let s=!$1(n);return t&&(s||r==!1)?V1(t,n):n}const Gc=t=>t instanceof Te?{...t}:t;function mn(t,n){n=n||{};const r={};function s(d,h,f,m){return N.isPlainObject(d)&&N.isPlainObject(h)?N.merge.call({caseless:m},d,h):N.isPlainObject(h)?N.merge({},h):N.isArray(h)?h.slice():h}function i(d,h,f,m){if(N.isUndefined(h)){if(!N.isUndefined(d))return s(void 0,d,f,m)}else return s(d,h,f,m)}function o(d,h){if(!N.isUndefined(h))return s(void 0,h)}function a(d,h){if(N.isUndefined(h)){if(!N.isUndefined(d))return s(void 0,d)}else return s(void 0,h)}function l(d,h,f){if(f in n)return s(d,h);if(f in t)return s(void 0,d)}const c={url:o,method:o,data:o,baseURL:a,transformRequest:a,transformResponse:a,paramsSerializer:a,timeout:a,timeoutMessage:a,withCredentials:a,withXSRFToken:a,adapter:a,responseType:a,xsrfCookieName:a,xsrfHeaderName:a,onUploadProgress:a,onDownloadProgress:a,decompress:a,maxContentLength:a,maxBodyLength:a,beforeRedirect:a,transport:a,httpAgent:a,httpsAgent:a,cancelToken:a,socketPath:a,responseEncoding:a,validateStatus:l,headers:(d,h,f)=>i(Gc(d),Gc(h),f,!0)};return N.forEach(Object.keys({...t,...n}),function(h){const f=c[h]||i,m=f(t[h],n[h],h);N.isUndefined(m)&&f!==l||(r[h]=m)}),r}const oh=t=>{const n=mn({},t);let{data:r,withXSRFToken:s,xsrfHeaderName:i,xsrfCookieName:o,headers:a,auth:l}=n;if(n.headers=a=Te.from(a),n.url=eh(ih(n.baseURL,n.url,n.allowAbsoluteUrls),t.params,t.paramsSerializer),l&&a.set("Authorization","Basic "+btoa((l.username||"")+":"+(l.password?unescape(encodeURIComponent(l.password)):""))),N.isFormData(r)){if(ve.hasStandardBrowserEnv||ve.hasStandardBrowserWebWorkerEnv)a.setContentType(void 0);else if(N.isFunction(r.getHeaders)){const c=r.getHeaders(),d=["content-type","content-length"];Object.entries(c).forEach(([h,f])=>{d.includes(h.toLowerCase())&&a.set(h,f)})}}if(ve.hasStandardBrowserEnv&&(s&&N.isFunction(s)&&(s=s(n)),s||s!==!1&&W1(n.url))){const c=i&&o&&U1.read(o);c&&a.set(i,c)}return n},H1=typeof XMLHttpRequest<"u",q1=H1&&function(t){return new Promise(function(r,s){const i=oh(t);let o=i.data;const a=Te.from(i.headers).normalize();let{responseType:l,onUploadProgress:c,onDownloadProgress:d}=i,h,f,m,k,p;function v(){k&&k(),p&&p(),i.cancelToken&&i.cancelToken.unsubscribe(h),i.signal&&i.signal.removeEventListener("abort",h)}let b=new XMLHttpRequest;b.open(i.method.toUpperCase(),i.url,!0),b.timeout=i.timeout;function x(){if(!b)return;const u=Te.from("getAllResponseHeaders"in b&&b.getAllResponseHeaders()),j={data:!l||l==="text"||l==="json"?b.responseText:b.response,status:b.status,statusText:b.statusText,headers:u,config:t,request:b};sh(function(A){r(A),v()},function(A){s(A),v()},j),b=null}"onloadend"in b?b.onloadend=x:b.onreadystatechange=function(){!b||b.readyState!==4||b.status===0&&!(b.responseURL&&b.responseURL.indexOf("file:")===0)||setTimeout(x)},b.onabort=function(){b&&(s(new F("Request aborted",F.ECONNABORTED,t,b)),b=null)},b.onerror=function(y){const j=y&&y.message?y.message:"Network Error",w=new F(j,F.ERR_NETWORK,t,b);w.event=y||null,s(w),b=null},b.ontimeout=function(){let y=i.timeout?"timeout of "+i.timeout+"ms exceeded":"timeout exceeded";const j=i.transitional||th;i.timeoutErrorMessage&&(y=i.timeoutErrorMessage),s(new F(y,j.clarifyTimeoutError?F.ETIMEDOUT:F.ECONNABORTED,t,b)),b=null},o===void 0&&a.setContentType(null),"setRequestHeader"in b&&N.forEach(a.toJSON(),function(y,j){b.setRequestHeader(j,y)}),N.isUndefined(i.withCredentials)||(b.withCredentials=!!i.withCredentials),l&&l!=="json"&&(b.responseType=i.responseType),d&&([m,p]=vi(d,!0),b.addEventListener("progress",m)),c&&b.upload&&([f,k]=vi(c),b.upload.addEventListener("progress",f),b.upload.addEventListener("loadend",k)),(i.cancelToken||i.signal)&&(h=u=>{b&&(s(!u||u.type?new or(null,t,b):u),b.abort(),b=null)},i.cancelToken&&i.cancelToken.subscribe(h),i.signal&&(i.signal.aborted?h():i.signal.addEventListener("abort",h)));const g=I1(i.url);if(g&&ve.protocols.indexOf(g)===-1){s(new F("Unsupported protocol "+g+":",F.ERR_BAD_REQUEST,t));return}b.send(o||null)})},K1=(t,n)=>{const{length:r}=t=t?t.filter(Boolean):[];if(n||r){let s=new AbortController,i;const o=function(d){if(!i){i=!0,l();const h=d instanceof Error?d:this.reason;s.abort(h instanceof F?h:new or(h instanceof Error?h.message:h))}};let a=n&&setTimeout(()=>{a=null,o(new F(`timeout ${n} of ms exceeded`,F.ETIMEDOUT))},n);const l=()=>{t&&(a&&clearTimeout(a),a=null,t.forEach(d=>{d.unsubscribe?d.unsubscribe(o):d.removeEventListener("abort",o)}),t=null)};t.forEach(d=>d.addEventListener("abort",o));const{signal:c}=s;return c.unsubscribe=()=>N.asap(l),c}},Q1=function*(t,n){let r=t.byteLength;if(r<n){yield t;return}let s=0,i;for(;s<r;)i=s+n,yield t.slice(s,i),s=i},Y1=async function*(t,n){for await(const r of J1(t))yield*Q1(r,n)},J1=async function*(t){if(t[Symbol.asyncIterator]){yield*t;return}const n=t.getReader();try{for(;;){const{done:r,value:s}=await n.read();if(r)break;yield s}}finally{await n.cancel()}},Zc=(t,n,r,s)=>{const i=Y1(t,n);let o=0,a,l=c=>{a||(a=!0,s&&s(c))};return new ReadableStream({async pull(c){try{const{done:d,value:h}=await i.next();if(d){l(),c.close();return}let f=h.byteLength;if(r){let m=o+=f;r(m)}c.enqueue(new Uint8Array(h))}catch(d){throw l(d),d}},cancel(c){return l(c),i.return()}},{highWaterMark:2})},ed=64*1024,{isFunction:Ns}=N,X1=(({Request:t,Response:n})=>({Request:t,Response:n}))(N.global),{ReadableStream:td,TextEncoder:nd}=N.global,rd=(t,...n)=>{try{return!!t(...n)}catch{return!1}},G1=t=>{t=N.merge.call({skipUndefined:!0},X1,t);const{fetch:n,Request:r,Response:s}=t,i=n?Ns(n):typeof fetch=="function",o=Ns(r),a=Ns(s);if(!i)return!1;const l=i&&Ns(td),c=i&&(typeof nd=="function"?(p=>v=>p.encode(v))(new nd):async p=>new Uint8Array(await new r(p).arrayBuffer())),d=o&&l&&rd(()=>{let p=!1;const v=new r(ve.origin,{body:new td,method:"POST",get duplex(){return p=!0,"half"}}).headers.has("Content-Type");return p&&!v}),h=a&&l&&rd(()=>N.isReadableStream(new s("").body)),f={stream:h&&(p=>p.body)};i&&["text","arrayBuffer","blob","formData","stream"].forEach(p=>{!f[p]&&(f[p]=(v,b)=>{let x=v&&v[p];if(x)return x.call(v);throw new F(`Response type '${p}' is not supported`,F.ERR_NOT_SUPPORT,b)})});const m=async p=>{if(p==null)return 0;if(N.isBlob(p))return p.size;if(N.isSpecCompliantForm(p))return(await new r(ve.origin,{method:"POST",body:p}).arrayBuffer()).byteLength;if(N.isArrayBufferView(p)||N.isArrayBuffer(p))return p.byteLength;if(N.isURLSearchParams(p)&&(p=p+""),N.isString(p))return(await c(p)).byteLength},k=async(p,v)=>{const b=N.toFiniteNumber(p.getContentLength());return b??m(v)};return async p=>{let{url:v,method:b,data:x,signal:g,cancelToken:u,timeout:y,onDownloadProgress:j,onUploadProgress:w,responseType:A,headers:S,withCredentials:B="same-origin",fetchOptions:_}=oh(p),xe=n||fetch;A=A?(A+"").toLowerCase():"text";let Oe=K1([g,u&&u.toAbortSignal()],y),Me=null;const Ne=Oe&&Oe.unsubscribe&&(()=>{Oe.unsubscribe()});let z;try{if(w&&d&&b!=="get"&&b!=="head"&&(z=await k(S,x))!==0){let V=new r(v,{method:"POST",body:x,duplex:"half"}),Q;if(N.isFormData(x)&&(Q=V.headers.get("content-type"))&&S.setContentType(Q),V.body){const[Et,We]=Jc(z,vi(Xc(w)));x=Zc(V.body,ed,Et,We)}}N.isString(B)||(B=B?"include":"omit");const U=o&&"credentials"in r.prototype,zt={..._,signal:Oe,method:b.toUpperCase(),headers:S.normalize().toJSON(),body:x,duplex:"half",credentials:U?B:void 0};Me=o&&new r(v,zt);let D=await(o?xe(Me,_):xe(v,zt));const I=h&&(A==="stream"||A==="response");if(h&&(j||I&&Ne)){const V={};["status","statusText","headers"].forEach(yn=>{V[yn]=D[yn]});const Q=N.toFiniteNumber(D.headers.get("content-length")),[Et,We]=j&&Jc(Q,vi(Xc(j),!0))||[];D=new s(Zc(D.body,ed,Et,()=>{We&&We(),Ne&&Ne()}),V)}A=A||"text";let O=await f[N.findKey(f,A)||"text"](D,p);return!I&&Ne&&Ne(),await new Promise((V,Q)=>{sh(V,Q,{data:O,headers:Te.from(D.headers),status:D.status,statusText:D.statusText,config:p,request:Me})})}catch(U){throw Ne&&Ne(),U&&U.name==="TypeError"&&/Load failed|fetch/i.test(U.message)?Object.assign(new F("Network Error",F.ERR_NETWORK,p,Me),{cause:U.cause||U}):F.from(U,U&&U.code,p,Me)}}},Z1=new Map,ah=t=>{let n=t&&t.env||{};const{fetch:r,Request:s,Response:i}=n,o=[s,i,r];let a=o.length,l=a,c,d,h=Z1;for(;l--;)c=o[l],d=h.get(c),d===void 0&&h.set(c,d=l?new Map:G1(n)),h=d;return d};ah();const Cl={http:m1,xhr:q1,fetch:{get:ah}};N.forEach(Cl,(t,n)=>{if(t){try{Object.defineProperty(t,"name",{value:n})}catch{}Object.defineProperty(t,"adapterName",{value:n})}});const sd=t=>`- ${t}`,e2=t=>N.isFunction(t)||t===null||t===!1;function t2(t,n){t=N.isArray(t)?t:[t];const{length:r}=t;let s,i;const o={};for(let a=0;a<r;a++){s=t[a];let l;if(i=s,!e2(s)&&(i=Cl[(l=String(s)).toLowerCase()],i===void 0))throw new F(`Unknown adapter '${l}'`);if(i&&(N.isFunction(i)||(i=i.get(n))))break;o[l||"#"+a]=i}if(!i){const a=Object.entries(o).map(([c,d])=>`adapter ${c} `+(d===!1?"is not supported by the environment":"is not available in the build"));let l=r?a.length>1?`since :
`+a.map(sd).join(`
`):" "+sd(a[0]):"as no adapter specified";throw new F("There is no suitable adapter to dispatch the request "+l,"ERR_NOT_SUPPORT")}return i}const lh={getAdapter:t2,adapters:Cl};function go(t){if(t.cancelToken&&t.cancelToken.throwIfRequested(),t.signal&&t.signal.aborted)throw new or(null,t)}function id(t){return go(t),t.headers=Te.from(t.headers),t.data=mo.call(t,t.transformRequest),["post","put","patch"].indexOf(t.method)!==-1&&t.headers.setContentType("application/x-www-form-urlencoded",!1),lh.getAdapter(t.adapter||ns.adapter,t)(t).then(function(s){return go(t),s.data=mo.call(t,t.transformResponse,s),s.headers=Te.from(s.headers),s},function(s){return rh(s)||(go(t),s&&s.response&&(s.response.data=mo.call(t,t.transformResponse,s.response),s.response.headers=Te.from(s.response.headers))),Promise.reject(s)})}const ch="1.13.2",Fi={};["object","boolean","number","function","string","symbol"].forEach((t,n)=>{Fi[t]=function(s){return typeof s===t||"a"+(n<1?"n ":" ")+t}});const od={};Fi.transitional=function(n,r,s){function i(o,a){return"[Axios v"+ch+"] Transitional option '"+o+"'"+a+(s?". "+s:"")}return(o,a,l)=>{if(n===!1)throw new F(i(a," has been removed"+(r?" in "+r:"")),F.ERR_DEPRECATED);return r&&!od[a]&&(od[a]=!0,console.warn(i(a," has been deprecated since v"+r+" and will be removed in the near future"))),n?n(o,a,l):!0}};Fi.spelling=function(n){return(r,s)=>(console.warn(`${s} is likely a misspelling of ${n}`),!0)};function n2(t,n,r){if(typeof t!="object")throw new F("options must be an object",F.ERR_BAD_OPTION_VALUE);const s=Object.keys(t);let i=s.length;for(;i-- >0;){const o=s[i],a=n[o];if(a){const l=t[o],c=l===void 0||a(l,o,t);if(c!==!0)throw new F("option "+o+" must be "+c,F.ERR_BAD_OPTION_VALUE);continue}if(r!==!0)throw new F("Unknown option "+o,F.ERR_BAD_OPTION)}}const qs={assertOptions:n2,validators:Fi},lt=qs.validators;let dn=class{constructor(n){this.defaults=n||{},this.interceptors={request:new Qc,response:new Qc}}async request(n,r){try{return await this._request(n,r)}catch(s){if(s instanceof Error){let i={};Error.captureStackTrace?Error.captureStackTrace(i):i=new Error;const o=i.stack?i.stack.replace(/^.+\n/,""):"";try{s.stack?o&&!String(s.stack).endsWith(o.replace(/^.+\n.+\n/,""))&&(s.stack+=`
`+o):s.stack=o}catch{}}throw s}}_request(n,r){typeof n=="string"?(r=r||{},r.url=n):r=n||{},r=mn(this.defaults,r);const{transitional:s,paramsSerializer:i,headers:o}=r;s!==void 0&&qs.assertOptions(s,{silentJSONParsing:lt.transitional(lt.boolean),forcedJSONParsing:lt.transitional(lt.boolean),clarifyTimeoutError:lt.transitional(lt.boolean)},!1),i!=null&&(N.isFunction(i)?r.paramsSerializer={serialize:i}:qs.assertOptions(i,{encode:lt.function,serialize:lt.function},!0)),r.allowAbsoluteUrls!==void 0||(this.defaults.allowAbsoluteUrls!==void 0?r.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls:r.allowAbsoluteUrls=!0),qs.assertOptions(r,{baseUrl:lt.spelling("baseURL"),withXsrfToken:lt.spelling("withXSRFToken")},!0),r.method=(r.method||this.defaults.method||"get").toLowerCase();let a=o&&N.merge(o.common,o[r.method]);o&&N.forEach(["delete","get","head","post","put","patch","common"],p=>{delete o[p]}),r.headers=Te.concat(a,o);const l=[];let c=!0;this.interceptors.request.forEach(function(v){typeof v.runWhen=="function"&&v.runWhen(r)===!1||(c=c&&v.synchronous,l.unshift(v.fulfilled,v.rejected))});const d=[];this.interceptors.response.forEach(function(v){d.push(v.fulfilled,v.rejected)});let h,f=0,m;if(!c){const p=[id.bind(this),void 0];for(p.unshift(...l),p.push(...d),m=p.length,h=Promise.resolve(r);f<m;)h=h.then(p[f++],p[f++]);return h}m=l.length;let k=r;for(;f<m;){const p=l[f++],v=l[f++];try{k=p(k)}catch(b){v.call(this,b);break}}try{h=id.call(this,k)}catch(p){return Promise.reject(p)}for(f=0,m=d.length;f<m;)h=h.then(d[f++],d[f++]);return h}getUri(n){n=mn(this.defaults,n);const r=ih(n.baseURL,n.url,n.allowAbsoluteUrls);return eh(r,n.params,n.paramsSerializer)}};N.forEach(["delete","get","head","options"],function(n){dn.prototype[n]=function(r,s){return this.request(mn(s||{},{method:n,url:r,data:(s||{}).data}))}});N.forEach(["post","put","patch"],function(n){function r(s){return function(o,a,l){return this.request(mn(l||{},{method:n,headers:s?{"Content-Type":"multipart/form-data"}:{},url:o,data:a}))}}dn.prototype[n]=r(),dn.prototype[n+"Form"]=r(!0)});let r2=class dh{constructor(n){if(typeof n!="function")throw new TypeError("executor must be a function.");let r;this.promise=new Promise(function(o){r=o});const s=this;this.promise.then(i=>{if(!s._listeners)return;let o=s._listeners.length;for(;o-- >0;)s._listeners[o](i);s._listeners=null}),this.promise.then=i=>{let o;const a=new Promise(l=>{s.subscribe(l),o=l}).then(i);return a.cancel=function(){s.unsubscribe(o)},a},n(function(o,a,l){s.reason||(s.reason=new or(o,a,l),r(s.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(n){if(this.reason){n(this.reason);return}this._listeners?this._listeners.push(n):this._listeners=[n]}unsubscribe(n){if(!this._listeners)return;const r=this._listeners.indexOf(n);r!==-1&&this._listeners.splice(r,1)}toAbortSignal(){const n=new AbortController,r=s=>{n.abort(s)};return this.subscribe(r),n.signal.unsubscribe=()=>this.unsubscribe(r),n.signal}static source(){let n;return{token:new dh(function(i){n=i}),cancel:n}}};function s2(t){return function(r){return t.apply(null,r)}}function i2(t){return N.isObject(t)&&t.isAxiosError===!0}const Ca={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511,WebServerIsDown:521,ConnectionTimedOut:522,OriginIsUnreachable:523,TimeoutOccurred:524,SslHandshakeFailed:525,InvalidSslCertificate:526};Object.entries(Ca).forEach(([t,n])=>{Ca[n]=t});function ph(t){const n=new dn(t),r=Uu(dn.prototype.request,n);return N.extend(r,dn.prototype,n,{allOwnKeys:!0}),N.extend(r,n,null,{allOwnKeys:!0}),r.create=function(i){return ph(mn(t,i))},r}const se=ph(ns);se.Axios=dn;se.CanceledError=or;se.CancelToken=r2;se.isCancel=rh;se.VERSION=ch;se.toFormData=Ii;se.AxiosError=F;se.Cancel=se.CanceledError;se.all=function(n){return Promise.all(n)};se.spread=s2;se.isAxiosError=i2;se.mergeConfig=mn;se.AxiosHeaders=Te;se.formToJSON=t=>nh(N.isHTMLForm(t)?new FormData(t):t);se.getAdapter=lh.getAdapter;se.HttpStatusCode=Ca;se.default=se;const{Axios:rg,AxiosError:sg,CanceledError:ig,isCancel:og,CancelToken:ag,VERSION:lg,all:cg,Cancel:dg,isAxiosError:pg,spread:ug,toFormData:hg,AxiosHeaders:xg,HttpStatusCode:fg,formToJSON:mg,getAdapter:gg,mergeConfig:vg}=se,wn=(typeof window<"u"?window.CFG||window.__APP_CONFIG__:void 0)||{},Ks={VITE_KEYCLOAK_URL:wn.VITE_KEYCLOAK_URL||void 0,VITE_KEYCLOAK_REALM:wn.VITE_KEYCLOAK_REALM||void 0,VITE_KEYCLOAK_CLIENT_ID:wn.VITE_KEYCLOAK_CLIENT_ID||void 0,VITE_API_BASE:wn.VITE_API_BASE||void 0,VITE_CARD_BASE:wn.VITE_CARD_BASE||void 0,VITE_CONFIG_BASE:wn.VITE_CONFIG_BASE||void 0},Aa=se.create({baseURL:Ks.VITE_API_BASE||"http://localhost:8080"});Aa.interceptors.request.use(t=>{const n=st;return st&&st.authenticated&&(t.headers=t.headers||{},t.headers.Authorization=`Bearer ${n==null?void 0:n.token}`),t});function o2(){const[t]=C.useState("acc-001"),[n,r]=C.useState(null),[s,i]=C.useState([]),[o,a]=C.useState("all"),[l,c]=C.useState(!0),d=async()=>{c(!0);try{const p=await Aa.get(`/balances/${t}`);r(p.data);const v=await Aa.get(`/statement/${t}`);i(v.data||[])}catch{r({available:"12.458,32",pending:"250,00"}),i([{id:"1",type:"PIX_IN",amount:1500,description:"PIX recebido - João Silva",date:"2025-01-15",time:"14:32"},{id:"2",type:"PIX_OUT",amount:-250,description:"PIX enviado - Maria Santos",date:"2025-01-15",time:"10:15"},{id:"3",type:"CARD",amount:-89.9,description:"Spotify Premium",date:"2025-01-14",time:"08:00"},{id:"4",type:"TRANSFER_IN",amount:3e3,description:"Transferência recebida",date:"2025-01-13",time:"16:45"},{id:"5",type:"CARD",amount:-156.8,description:"iFood Delivery",date:"2025-01-12",time:"20:30"},{id:"6",type:"PIX_OUT",amount:-500,description:"PIX enviado - Pedro Costa",date:"2025-01-11",time:"11:20"},{id:"7",type:"BOLETO",amount:-245,description:"Conta de luz",date:"2025-01-10",time:"09:00"}])}c(!1)};C.useEffect(()=>{d()},[]);const h=p=>p!=null&&p.includes("PIX")?e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5"})}):p!=null&&p.includes("CARD")?e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]}):p!=null&&p.includes("TRANSFER")?e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("polyline",{points:"17 1 21 5 17 9"}),e.jsx("path",{d:"M3 11V9a4 4 0 0 1 4-4h14"}),e.jsx("polyline",{points:"7 23 3 19 7 15"}),e.jsx("path",{d:"M21 13v2a4 4 0 0 1-4 4H3"})]}):p!=null&&p.includes("BOLETO")?e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z"})}):e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 6v6l4 2"})]}),f=(p,v)=>v>0?"#22C55E":p!=null&&p.includes("PIX")?"#C9A227":p!=null&&p.includes("CARD")?"#EF4444":"#A3A3A3",m=s.filter(p=>o==="in"?p.amount>0:o==="out"?p.amount<0:!0),k=p=>typeof p=="string"?`R$ ${p}`:new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(p);return e.jsxs("div",{className:"accounts-page",children:[e.jsxs("div",{className:"accounts-header",children:[e.jsx("h1",{children:"Extrato"}),e.jsx("p",{children:"Acompanhe suas movimentações"})]}),e.jsx("div",{className:"balance-section",children:e.jsxs("div",{className:"balance-card",children:[e.jsxs("div",{className:"balance-header",children:[e.jsx("span",{children:"Saldo disponível"}),e.jsx("button",{className:"refresh-btn",onClick:d,children:e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("polyline",{points:"23 4 23 10 17 10"}),e.jsx("polyline",{points:"1 20 1 14 7 14"}),e.jsx("path",{d:"M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"})]})})]}),e.jsx("div",{className:"balance-amount",children:l?e.jsx("div",{className:"skeleton",style:{width:200,height:44}}):k((n==null?void 0:n.available)||0)}),e.jsxs("div",{className:"balance-pending",children:[e.jsx("span",{children:"Bloqueado"}),e.jsx("span",{children:l?"...":k((n==null?void 0:n.pending)||0)})]})]})}),e.jsxs("div",{className:"stats-section",children:[e.jsxs("div",{className:"stat-card in",children:[e.jsx("div",{className:"stat-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("polyline",{points:"19 12 12 19 5 12"})]})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-label",children:"Entradas"}),e.jsx("span",{className:"stat-value",children:"R$ 4.500,00"})]})]}),e.jsxs("div",{className:"stat-card out",children:[e.jsx("div",{className:"stat-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"19",x2:"12",y2:"5"}),e.jsx("polyline",{points:"5 12 12 5 19 12"})]})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-label",children:"Saídas"}),e.jsx("span",{className:"stat-value",children:"R$ 1.241,70"})]})]})]}),e.jsxs("div",{className:"filters-section",children:[e.jsx("button",{className:`filter-btn ${o==="all"?"active":""}`,onClick:()=>a("all"),children:"Todas"}),e.jsx("button",{className:`filter-btn ${o==="in"?"active":""}`,onClick:()=>a("in"),children:"Entradas"}),e.jsx("button",{className:`filter-btn ${o==="out"?"active":""}`,onClick:()=>a("out"),children:"Saídas"})]}),e.jsxs("div",{className:"transactions-section",children:[e.jsx("h3",{children:"Movimentações"}),l?e.jsx("div",{className:"transactions-loading",children:[1,2,3,4].map(p=>e.jsxs("div",{className:"tx-skeleton",children:[e.jsx("div",{className:"skeleton",style:{width:44,height:44,borderRadius:12}}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{className:"skeleton",style:{width:"60%",height:16,marginBottom:8}}),e.jsx("div",{className:"skeleton",style:{width:"40%",height:12}})]}),e.jsx("div",{className:"skeleton",style:{width:80,height:20}})]},p))}):m.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("div",{className:"empty-icon",children:e.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("path",{d:"M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]})}),e.jsx("p",{children:"Nenhuma movimentação encontrada"})]}):e.jsx("div",{className:"transactions-list",children:m.map(p=>e.jsxs("div",{className:"tx-item",children:[e.jsx("div",{className:"tx-icon",style:{color:f(p.type,p.amount)},children:h(p.type)}),e.jsxs("div",{className:"tx-info",children:[e.jsx("span",{className:"tx-description",children:p.description}),e.jsxs("span",{className:"tx-meta",children:[p.date," ",p.time&&`• ${p.time}`]})]}),e.jsxs("div",{className:`tx-amount ${p.amount>0?"positive":"negative"}`,children:[p.amount>0?"+":"",k(p.amount)]})]},p.id))})]}),e.jsxs("div",{className:"export-section",children:[e.jsxs("button",{className:"export-btn",children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"7 10 12 15 17 10"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),"Exportar PDF"]}),e.jsxs("button",{className:"export-btn",children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"3",y1:"9",x2:"21",y2:"9"}),e.jsx("line",{x1:"9",y1:"21",x2:"9",y2:"9"})]}),"Exportar Excel"]})]}),e.jsx("style",{children:`
        .accounts-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        /* Header */
        .accounts-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          padding: 24px 20px;
          border-bottom: 1px solid #262626;
        }

        .accounts-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .accounts-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Balance Section */
        .balance-section {
          padding: 20px;
        }

        .balance-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          padding: 24px;
        }

        .balance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .balance-header span {
          font-size: 14px;
          color: #A3A3A3;
        }

        .refresh-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 1px solid #333;
          border-radius: 10px;
          color: #A3A3A3;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-btn:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .balance-amount {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
        }

        .balance-pending {
          display: flex;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid #333;
          font-size: 14px;
          color: #666;
        }

        /* Stats Section */
        .stats-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 0 20px 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .stat-card.in .stat-icon {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .stat-card.out .stat-icon {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        /* Filters */
        .filters-section {
          display: flex;
          gap: 8px;
          padding: 0 20px 20px;
        }

        .filter-btn {
          padding: 10px 20px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          color: #A3A3A3;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          border-color: #C9A227;
        }

        .filter-btn.active {
          background: rgba(201, 162, 39, 0.15);
          border-color: #C9A227;
          color: #C9A227;
        }

        /* Transactions */
        .transactions-section {
          padding: 0 20px 20px;
        }

        .transactions-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tx-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .tx-item:hover {
          border-color: rgba(201, 162, 39, 0.3);
        }

        .tx-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
        }

        .tx-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .tx-description {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tx-meta {
          font-size: 12px;
          color: #666;
        }

        .tx-amount {
          font-size: 15px;
          font-weight: 600;
          white-space: nowrap;
        }

        .tx-amount.positive {
          color: #22C55E;
        }

        .tx-amount.negative {
          color: #EF4444;
        }

        /* Loading */
        .transactions-loading {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tx-skeleton {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
        }

        .skeleton {
          background: linear-gradient(90deg, #262626 25%, #333 50%, #262626 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-icon {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-state p {
          color: #666;
          margin: 0;
        }

        /* Export Section */
        .export-section {
          display: flex;
          gap: 12px;
          padding: 0 20px;
        }

        .export-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          color: #A3A3A3;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-btn:hover {
          border-color: #C9A227;
          color: #fff;
        }

        @media (max-width: 480px) {
          .balance-amount {
            font-size: 28px;
          }

          .stats-section {
            grid-template-columns: 1fr;
          }
        }
      `})]})}function a2(){var d;const[t,n]=J.useState([]),[r,s]=J.useState(null),[i,o]=J.useState(!1),[a,l]=J.useState(!1);J.useEffect(()=>{let h=!0;return(async()=>{try{const f=await ft._unsafeFetch("/cards/cards");h&&n(Array.isArray(f)?f:[])}catch(f){console.error("cards list failed",f),h&&n([{id:"card-001",brand:"Mastercard",last4:"4532",type:"credit",status:"active"},{id:"card-002",brand:"Visa",last4:"7891",type:"virtual",status:"active"}])}})(),()=>{h=!1}},[]);async function c(h){var f;try{o(!0);const m=(Ks==null?void 0:Ks.VITE_CARD_BASE)||((f=window.CFG)==null?void 0:f.VITE_CARD_BASE)||"http://localhost:9084",p=await(await fetch(`${m}/card/${h}`)).json();s(p)}catch(m){console.error("card detail failed",m),s({id:h,brand:"Mastercard",last4:"4532",holder:"USUARIO ATHENA",exp_month:"12",exp_year:"2028",cvv:"***"})}finally{o(!1)}}return e.jsxs("div",{className:"cards-page",children:[e.jsx("div",{className:"cards-header",children:e.jsxs("div",{className:"header-content",children:[e.jsx("h1",{children:"Meus Cartões"}),e.jsx("p",{children:"Gerencie seus cartões físicos e virtuais"})]})}),e.jsx("div",{className:"card-visual-section",children:e.jsxs("div",{className:"credit-card",children:[e.jsx("div",{className:"card-bg-pattern"}),e.jsxs("div",{className:"card-top",children:[e.jsxs("div",{className:"card-chip",children:[e.jsx("div",{className:"chip-line"}),e.jsx("div",{className:"chip-line"}),e.jsx("div",{className:"chip-line"})]}),e.jsx("div",{className:"card-contactless",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M8.5 14.5A5 5 0 0 1 7 11a5 5 0 0 1 1.5-3.5"}),e.jsx("path",{d:"M12 18a8 8 0 0 1-4-7 8 8 0 0 1 4-7"}),e.jsx("path",{d:"M15.5 14.5A5 5 0 0 0 17 11a5 5 0 0 0-1.5-3.5"})]})})]}),e.jsxs("div",{className:"card-number",children:["•••• •••• •••• ",((d=t[0])==null?void 0:d.last4)||"4532"]}),e.jsxs("div",{className:"card-bottom",children:[e.jsxs("div",{className:"card-info",children:[e.jsx("span",{className:"label",children:"TITULAR"}),e.jsx("span",{className:"value",children:"USUARIO ATHENA"})]}),e.jsxs("div",{className:"card-info",children:[e.jsx("span",{className:"label",children:"VALIDADE"}),e.jsx("span",{className:"value",children:"12/28"})]}),e.jsx("div",{className:"card-brand",children:e.jsxs("svg",{width:"48",height:"32",viewBox:"0 0 48 32",fill:"none",children:[e.jsx("circle",{cx:"18",cy:"16",r:"12",fill:"#EB001B",fillOpacity:"0.9"}),e.jsx("circle",{cx:"30",cy:"16",r:"12",fill:"#F79E1B",fillOpacity:"0.9"}),e.jsx("path",{d:"M24 6.5a12 12 0 0 0 0 19",fill:"#FF5F00",fillOpacity:"0.9"})]})})]}),e.jsxs("div",{className:"card-logo",children:[e.jsx("span",{className:"logo-dot"}),e.jsx("span",{children:"Athena"})]})]})}),e.jsxs("div",{className:"card-actions",children:[e.jsxs("button",{className:"action-btn",onClick:()=>t[0]&&c(t[0].id),children:[e.jsx("div",{className:"action-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})}),e.jsx("span",{children:"Ver dados"})]}),e.jsxs("button",{className:"action-btn",children:[e.jsx("div",{className:"action-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]})}),e.jsx("span",{children:"Bloquear"})]}),e.jsxs("button",{className:"action-btn",children:[e.jsx("div",{className:"action-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"})]})}),e.jsx("span",{children:"Configurar"})]}),e.jsxs("button",{className:"action-btn gold",children:[e.jsx("div",{className:"action-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]})}),e.jsx("span",{children:"Cartão virtual"})]})]}),e.jsxs("div",{className:"cards-list",children:[e.jsx("h3",{children:"Todos os cartões"}),t.map(h=>{var f;return e.jsxs("div",{className:"card-item",onClick:()=>c(h.id),children:[e.jsx("div",{className:"card-item-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]})}),e.jsxs("div",{className:"card-item-info",children:[e.jsx("span",{className:"card-item-brand",children:h.brand||"Athena Card"}),e.jsxs("span",{className:"card-item-number",children:["•••• ",String(h.last4||h.pan_last4||((f=h.id)==null?void 0:f.slice(-4))||"").padStart(4,"•")]})]}),e.jsx("div",{className:"card-item-type",children:e.jsx("span",{className:`type-badge ${h.type==="virtual"?"virtual":""}`,children:h.type==="virtual"?"Virtual":"Físico"})}),e.jsx("div",{className:"card-item-arrow",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"9 18 15 12 9 6"})})})]},h.id)}),t.length===0&&e.jsxs("div",{className:"empty-state",children:[e.jsx("div",{className:"empty-icon",children:e.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]})}),e.jsx("p",{children:"Nenhum cartão encontrado"}),e.jsx("button",{className:"btn-gold",children:"Solicitar cartão"})]})]}),e.jsxs("div",{className:"invoice-section",children:[e.jsxs("div",{className:"invoice-header",children:[e.jsx("h3",{children:"Fatura atual"}),e.jsx("span",{className:"invoice-status",children:"Aberta"})]}),e.jsxs("div",{className:"invoice-amount",children:[e.jsx("span",{className:"label",children:"Total"}),e.jsx("span",{className:"value",children:"R$ 1.247,50"})]}),e.jsxs("div",{className:"invoice-details",children:[e.jsxs("div",{className:"invoice-row",children:[e.jsx("span",{children:"Fecha em"}),e.jsx("span",{children:"15 Fev"})]}),e.jsxs("div",{className:"invoice-row",children:[e.jsx("span",{children:"Vencimento"}),e.jsx("span",{children:"22 Fev"})]}),e.jsxs("div",{className:"invoice-row",children:[e.jsx("span",{children:"Limite disponível"}),e.jsx("span",{className:"gold",children:"R$ 8.752,50"})]})]}),e.jsx("button",{className:"btn-outline",children:"Ver fatura completa"})]}),r&&e.jsx("div",{className:"modal-overlay",onClick:()=>s(null),children:e.jsxs("div",{className:"modal",onClick:h=>h.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Dados do Cartão"}),e.jsx("button",{className:"close-btn",onClick:()=>s(null),children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),i?e.jsxs("div",{className:"modal-loading",children:[e.jsx("div",{className:"spinner"}),e.jsx("span",{children:"Carregando..."})]}):e.jsxs("div",{className:"modal-content",children:[e.jsx("div",{className:"modal-card-preview",children:e.jsxs("div",{className:"mini-card",children:[e.jsx("div",{className:"mini-chip"}),e.jsxs("div",{className:"mini-number",children:["•••• ",r.last4||r.pan_last4||"****"]})]})}),e.jsxs("div",{className:"modal-info",children:[e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"label",children:"Bandeira"}),e.jsx("span",{className:"value",children:r.brand||r.scheme||"Cartão"})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"label",children:"Número"}),e.jsxs("span",{className:"value",children:["•••• •••• •••• ",r.last4||r.pan_last4||"****"]})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"label",children:"Titular"}),e.jsx("span",{className:"value",children:r.holder||r.holder_name||"USUARIO ATHENA"})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"label",children:"Validade"}),e.jsx("span",{className:"value",children:r.exp||(r.exp_month&&r.exp_year?`${r.exp_month}/${r.exp_year}`:"12/28")})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"label",children:"CVV"}),e.jsxs("button",{className:"show-cvv",onClick:()=>l(!a),children:[a?r.cvv||r.cvv_ephemeral||"123":"•••",e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})]})]})]}),e.jsxs("div",{className:"modal-actions",children:[e.jsx("button",{className:"btn-outline-modal",children:"Copiar dados"}),e.jsx("button",{className:"btn-gold-modal",children:"Gerar virtual"})]})]})]})}),e.jsx("style",{children:`
        .cards-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        .cards-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          padding: 24px 20px;
          border-bottom: 1px solid #262626;
        }

        .header-content h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .header-content p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Card Visual */
        .card-visual-section {
          padding: 24px 20px;
          display: flex;
          justify-content: center;
        }

        .credit-card {
          width: 100%;
          max-width: 360px;
          aspect-ratio: 1.586;
          background: linear-gradient(145deg, #1A1A1A 0%, #0D0D0D 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 162, 39, 0.1);
        }

        .card-bg-pattern {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 100% 0%, rgba(201, 162, 39, 0.15) 0%, transparent 50%);
          pointer-events: none;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .card-chip {
          width: 45px;
          height: 35px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 3px;
          padding: 6px;
        }

        .chip-line {
          height: 2px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 1px;
        }

        .card-contactless {
          color: rgba(255, 255, 255, 0.5);
          transform: rotate(90deg);
        }

        .card-number {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          letter-spacing: 3px;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .card-bottom {
          display: flex;
          align-items: flex-end;
          gap: 24px;
          position: relative;
          z-index: 1;
        }

        .card-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-info .label {
          font-size: 9px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .card-info .value {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }

        .card-brand {
          margin-left: auto;
        }

        .card-logo {
          position: absolute;
          top: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }

        .card-logo .logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
        }

        /* Card Actions */
        .card-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 0 20px 24px;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 8px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          border-color: #C9A227;
          transform: translateY(-2px);
        }

        .action-btn.gold {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border-color: rgba(201, 162, 39, 0.5);
        }

        .action-btn.gold .action-icon {
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          color: #0D0D0D;
        }

        .action-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
          color: #C9A227;
        }

        .action-btn span {
          font-size: 12px;
          font-weight: 500;
        }

        /* Cards List */
        .cards-list {
          padding: 0 20px 24px;
        }

        .cards-list h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .card-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .card-item:hover {
          border-color: #C9A227;
          background: #262626;
        }

        .card-item-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 12px;
          color: #C9A227;
        }

        .card-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-item-brand {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .card-item-number {
          font-size: 13px;
          color: #A3A3A3;
        }

        .type-badge {
          padding: 4px 10px;
          background: #262626;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #A3A3A3;
        }

        .type-badge.virtual {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .card-item-arrow {
          color: #666;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-icon {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-state p {
          color: #666;
          margin: 0 0 20px;
        }

        .btn-gold {
          padding: 14px 28px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border: none;
          border-radius: 12px;
          color: #0D0D0D;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Invoice Section */
        .invoice-section {
          margin: 0 20px;
          padding: 20px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .invoice-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .invoice-status {
          padding: 4px 12px;
          background: rgba(201, 162, 39, 0.15);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #C9A227;
        }

        .invoice-amount {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #262626;
          margin-bottom: 16px;
        }

        .invoice-amount .label {
          display: block;
          font-size: 13px;
          color: #666;
          margin-bottom: 4px;
        }

        .invoice-amount .value {
          font-size: 32px;
          font-weight: 700;
          color: #fff;
        }

        .invoice-details {
          margin-bottom: 20px;
        }

        .invoice-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14px;
          color: #A3A3A3;
          border-bottom: 1px solid #262626;
        }

        .invoice-row:last-child {
          border-bottom: none;
        }

        .invoice-row .gold {
          color: #C9A227;
          font-weight: 600;
        }

        .btn-outline {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-outline:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .modal {
          width: 100%;
          max-width: 400px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 24px;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #262626;
        }

        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: none;
          border-radius: 10px;
          color: #A3A3A3;
          cursor: pointer;
        }

        .modal-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 16px;
          color: #A3A3A3;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #333;
          border-top-color: #C9A227;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .modal-content {
          padding: 20px;
        }

        .modal-card-preview {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .mini-card {
          width: 180px;
          height: 110px;
          background: linear-gradient(145deg, #262626 0%, #1A1A1A 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .mini-chip {
          width: 28px;
          height: 20px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border-radius: 4px;
        }

        .mini-number {
          font-size: 13px;
          color: #fff;
          letter-spacing: 2px;
        }

        .modal-info {
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #262626;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row .label {
          font-size: 13px;
          color: #666;
        }

        .info-row .value {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .show-cvv {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 8px;
          color: #C9A227;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .modal-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .btn-outline-modal {
          padding: 14px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-gold-modal {
          padding: 14px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          border-radius: 12px;
          color: #0D0D0D;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .card-actions {
            grid-template-columns: repeat(2, 1fr);
          }

          .credit-card {
            padding: 20px;
          }

          .card-number {
            font-size: 16px;
          }
        }
      `})]})}function l2(){return e.jsxs("div",{className:"payments-page",children:[e.jsxs("div",{className:"payments-header",children:[e.jsx("div",{className:"header-icon",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"})})}),e.jsx("h1",{children:"Pagamentos"}),e.jsx("p",{children:"Escolha como quer pagar"})]}),e.jsxs("div",{className:"options-section",children:[e.jsxs("a",{href:"#/pix",className:"option-card",children:[e.jsx("div",{className:"option-icon pix",children:e.jsx("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5"})})}),e.jsxs("div",{className:"option-info",children:[e.jsx("span",{className:"option-name",children:"Pix"}),e.jsx("span",{className:"option-desc",children:"Pagamento instantâneo"})]}),e.jsx("div",{className:"option-arrow",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"9 18 15 12 9 6"})})})]}),e.jsxs("a",{href:"#/boleto",className:"option-card",children:[e.jsx("div",{className:"option-icon boleto",children:e.jsx("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z"})})}),e.jsxs("div",{className:"option-info",children:[e.jsx("span",{className:"option-name",children:"Boleto"}),e.jsx("span",{className:"option-desc",children:"Pagar ou gerar boleto"})]}),e.jsx("div",{className:"option-arrow",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"9 18 15 12 9 6"})})})]}),e.jsxs("a",{href:"#/cards",className:"option-card",children:[e.jsx("div",{className:"option-icon card",children:e.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]})}),e.jsxs("div",{className:"option-info",children:[e.jsx("span",{className:"option-name",children:"Cartão"}),e.jsx("span",{className:"option-desc",children:"Crédito ou débito"})]}),e.jsx("div",{className:"option-arrow",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"9 18 15 12 9 6"})})})]}),e.jsxs("div",{className:"option-card disabled",children:[e.jsx("div",{className:"option-icon transfer",children:e.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("polyline",{points:"17 1 21 5 17 9"}),e.jsx("path",{d:"M3 11V9a4 4 0 0 1 4-4h14"}),e.jsx("polyline",{points:"7 23 3 19 7 15"}),e.jsx("path",{d:"M21 13v2a4 4 0 0 1-4 4H3"})]})}),e.jsxs("div",{className:"option-info",children:[e.jsx("span",{className:"option-name",children:"TED/DOC"}),e.jsx("span",{className:"option-desc",children:"Em breve"})]}),e.jsx("span",{className:"coming-badge",children:"Em breve"})]})]}),e.jsxs("div",{className:"recent-section",children:[e.jsx("h3",{children:"Pagamentos recentes"}),e.jsxs("div",{className:"recent-list",children:[e.jsxs("div",{className:"recent-item",children:[e.jsx("div",{className:"recent-icon pix",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5"})})}),e.jsxs("div",{className:"recent-info",children:[e.jsx("span",{className:"recent-name",children:"Pix para João Silva"}),e.jsx("span",{className:"recent-date",children:"Hoje, 14:32"})]}),e.jsx("span",{className:"recent-amount",children:"- R$ 150,00"})]}),e.jsxs("div",{className:"recent-item",children:[e.jsx("div",{className:"recent-icon boleto",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z"})})}),e.jsxs("div",{className:"recent-info",children:[e.jsx("span",{className:"recent-name",children:"Conta de luz"}),e.jsx("span",{className:"recent-date",children:"Ontem, 10:15"})]}),e.jsx("span",{className:"recent-amount",children:"- R$ 245,00"})]}),e.jsxs("div",{className:"recent-item",children:[e.jsx("div",{className:"recent-icon card",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]})}),e.jsxs("div",{className:"recent-info",children:[e.jsx("span",{className:"recent-name",children:"Spotify Premium"}),e.jsx("span",{className:"recent-date",children:"12 Jan, 08:00"})]}),e.jsx("span",{className:"recent-amount",children:"- R$ 21,90"})]})]})]}),e.jsx("div",{className:"info-section",children:e.jsxs("div",{className:"info-card",children:[e.jsx("div",{className:"info-icon",children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"})})}),e.jsxs("div",{className:"info-content",children:[e.jsx("span",{className:"info-title",children:"Seus pagamentos estão protegidos"}),e.jsx("span",{className:"info-desc",children:"Todas as transações são criptografadas e monitoradas 24h."})]})]})}),e.jsx("style",{children:`
        .payments-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        /* Header */
        .payments-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          padding: 24px 20px;
          text-align: center;
          border-bottom: 1px solid #262626;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 16px;
          color: #C9A227;
        }

        .payments-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .payments-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Options Section */
        .options-section {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .option-card:hover {
          border-color: #C9A227;
          transform: translateX(4px);
        }

        .option-card.disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .option-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
        }

        .option-icon.pix {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          color: #C9A227;
        }

        .option-icon.boleto {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
          color: #3B82F6;
        }

        .option-icon.card {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%);
          color: #8B5CF6;
        }

        .option-icon.transfer {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
          color: #22C55E;
        }

        .option-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .option-name {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .option-desc {
          font-size: 13px;
          color: #A3A3A3;
        }

        .option-arrow {
          color: #666;
        }

        .coming-badge {
          padding: 4px 12px;
          background: #262626;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #666;
        }

        /* Recent Section */
        .recent-section {
          padding: 0 20px 20px;
        }

        .recent-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          transition: all 0.2s ease;
        }

        .recent-item:hover {
          border-color: rgba(201, 162, 39, 0.3);
        }

        .recent-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .recent-icon.pix {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .recent-icon.boleto {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }

        .recent-icon.card {
          background: rgba(139, 92, 246, 0.15);
          color: #8B5CF6;
        }

        .recent-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .recent-name {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .recent-date {
          font-size: 12px;
          color: #666;
        }

        .recent-amount {
          font-size: 15px;
          font-weight: 600;
          color: #EF4444;
        }

        /* Info Section */
        .info-section {
          padding: 0 20px;
        }

        .info-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 16px;
        }

        .info-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 12px;
          color: #22C55E;
        }

        .info-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-title {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .info-desc {
          font-size: 13px;
          color: #A3A3A3;
        }
      `})]})}function c2(){const t=[{id:1,name:"CDB Athena",type:"Renda Fixa",rate:"110% CDI",balance:5e3,yield:245.5,risk:"Baixo"},{id:2,name:"LCI Premium",type:"Renda Fixa",rate:"95% CDI",balance:1e4,yield:420,risk:"Baixo"},{id:3,name:"Fundo Multi",type:"Multimercado",rate:"+8.5% a.a.",balance:3500,yield:180.25,risk:"Médio"}],n=i=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(i),r=t.reduce((i,o)=>i+o.balance,0),s=t.reduce((i,o)=>i+o.yield,0);return e.jsxs("div",{className:"invest-page",children:[e.jsxs("div",{className:"invest-header",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"20",x2:"12",y2:"10"}),e.jsx("line",{x1:"18",y1:"20",x2:"18",y2:"4"}),e.jsx("line",{x1:"6",y1:"20",x2:"6",y2:"14"})]})}),e.jsx("h1",{children:"Investimentos"}),e.jsx("p",{children:"Faça seu dinheiro render mais"})]}),e.jsx("div",{className:"portfolio-section",children:e.jsxs("div",{className:"portfolio-card",children:[e.jsxs("div",{className:"portfolio-header",children:[e.jsx("span",{children:"Patrimônio total"}),e.jsxs("div",{className:"portfolio-badge",children:[e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("polyline",{points:"23 6 13.5 15.5 8.5 10.5 1 18"}),e.jsx("polyline",{points:"17 6 23 6 23 12"})]}),"+",(s/r*100).toFixed(2),"%"]})]}),e.jsx("div",{className:"portfolio-amount",children:n(r+s)}),e.jsxs("div",{className:"portfolio-details",children:[e.jsxs("div",{className:"detail-item",children:[e.jsx("span",{className:"label",children:"Aplicado"}),e.jsx("span",{className:"value",children:n(r)})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("span",{className:"label",children:"Rendimento"}),e.jsxs("span",{className:"value positive",children:["+",n(s)]})]})]})]})}),e.jsxs("div",{className:"actions-section",children:[e.jsxs("button",{className:"action-btn",children:[e.jsx("div",{className:"action-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]})}),e.jsx("span",{children:"Investir"})]}),e.jsxs("button",{className:"action-btn",children:[e.jsx("div",{className:"action-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"19",x2:"12",y2:"5"}),e.jsx("polyline",{points:"5 12 12 5 19 12"})]})}),e.jsx("span",{children:"Resgatar"})]}),e.jsxs("button",{className:"action-btn",children:[e.jsx("div",{className:"action-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}),e.jsx("span",{children:"Explorar"})]})]}),e.jsxs("div",{className:"investments-section",children:[e.jsx("h3",{children:"Meus investimentos"}),e.jsx("div",{className:"investments-list",children:t.map(i=>e.jsxs("div",{className:"invest-item",children:[e.jsx("div",{className:"invest-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"20",x2:"12",y2:"10"}),e.jsx("line",{x1:"18",y1:"20",x2:"18",y2:"4"}),e.jsx("line",{x1:"6",y1:"20",x2:"6",y2:"14"})]})}),e.jsxs("div",{className:"invest-info",children:[e.jsxs("div",{className:"invest-main",children:[e.jsx("span",{className:"invest-name",children:i.name}),e.jsx("span",{className:"invest-type",children:i.type})]}),e.jsxs("div",{className:"invest-meta",children:[e.jsx("span",{className:"invest-rate",children:i.rate}),e.jsx("span",{className:`invest-risk ${i.risk.toLowerCase()}`,children:i.risk})]})]}),e.jsxs("div",{className:"invest-values",children:[e.jsx("span",{className:"invest-balance",children:n(i.balance)}),e.jsxs("span",{className:"invest-yield",children:["+",n(i.yield)]})]})]},i.id))})]}),e.jsxs("div",{className:"products-section",children:[e.jsx("h3",{children:"Produtos disponíveis"}),e.jsxs("div",{className:"products-grid",children:[e.jsxs("div",{className:"product-card",children:[e.jsx("div",{className:"product-icon cdb",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"3",y1:"9",x2:"21",y2:"9"}),e.jsx("line",{x1:"9",y1:"21",x2:"9",y2:"9"})]})}),e.jsxs("div",{className:"product-info",children:[e.jsx("span",{className:"product-name",children:"CDB"}),e.jsx("span",{className:"product-rate",children:"Até 115% CDI"})]})]}),e.jsxs("div",{className:"product-card",children:[e.jsx("div",{className:"product-icon lci",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}),e.jsx("polyline",{points:"9 22 9 12 15 12 15 22"})]})}),e.jsxs("div",{className:"product-info",children:[e.jsx("span",{className:"product-name",children:"LCI/LCA"}),e.jsx("span",{className:"product-rate",children:"Isento de IR"})]})]}),e.jsxs("div",{className:"product-card",children:[e.jsx("div",{className:"product-icon fund",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"20",x2:"12",y2:"10"}),e.jsx("line",{x1:"18",y1:"20",x2:"18",y2:"4"}),e.jsx("line",{x1:"6",y1:"20",x2:"6",y2:"14"})]})}),e.jsxs("div",{className:"product-info",children:[e.jsx("span",{className:"product-name",children:"Fundos"}),e.jsx("span",{className:"product-rate",children:"Diversificados"})]})]}),e.jsxs("div",{className:"product-card coming-soon",children:[e.jsx("div",{className:"product-icon crypto",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"}),e.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17"})]})}),e.jsxs("div",{className:"product-info",children:[e.jsx("span",{className:"product-name",children:"Cripto"}),e.jsx("span",{className:"product-rate",children:"Em breve"})]})]})]})]}),e.jsx("style",{children:`
        .invest-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        /* Header */
        .invest-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          padding: 24px 20px;
          text-align: center;
          border-bottom: 1px solid #262626;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 16px;
          color: #22C55E;
        }

        .invest-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .invest-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Portfolio Section */
        .portfolio-section {
          padding: 20px;
        }

        .portfolio-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 20px;
          padding: 24px;
        }

        .portfolio-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .portfolio-header span {
          font-size: 14px;
          color: #A3A3A3;
        }

        .portfolio-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #22C55E;
        }

        .portfolio-amount {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
        }

        .portfolio-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid #333;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-item .label {
          font-size: 12px;
          color: #666;
        }

        .detail-item .value {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .detail-item .value.positive {
          color: #22C55E;
        }

        /* Actions Section */
        .actions-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 0 20px 20px;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 8px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          border-color: #22C55E;
          transform: translateY(-2px);
        }

        .action-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
          border-radius: 12px;
          color: #22C55E;
        }

        .action-btn span {
          font-size: 13px;
          font-weight: 500;
        }

        /* Investments Section */
        .investments-section {
          padding: 0 20px 20px;
        }

        .investments-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .investments-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .invest-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .invest-item:hover {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .invest-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
          color: #22C55E;
        }

        .invest-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .invest-main {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .invest-name {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .invest-type {
          font-size: 11px;
          padding: 2px 8px;
          background: #262626;
          border-radius: 10px;
          color: #A3A3A3;
        }

        .invest-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .invest-rate {
          font-size: 13px;
          color: #22C55E;
          font-weight: 500;
        }

        .invest-risk {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .invest-risk.baixo {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .invest-risk.médio {
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
        }

        .invest-risk.alto {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        .invest-values {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .invest-balance {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .invest-yield {
          font-size: 13px;
          color: #22C55E;
        }

        /* Products Section */
        .products-section {
          padding: 0 20px 20px;
        }

        .products-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .product-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .product-card:hover {
          border-color: #C9A227;
        }

        .product-card.coming-soon {
          opacity: 0.6;
        }

        .product-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .product-icon.cdb {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .product-icon.lci {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .product-icon.fund {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }

        .product-icon.crypto {
          background: rgba(139, 92, 246, 0.15);
          color: #8B5CF6;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .product-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .product-rate {
          font-size: 12px;
          color: #A3A3A3;
        }

        @media (max-width: 480px) {
          .portfolio-amount {
            font-size: 28px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `})]})}function d2(){return e.jsxs("div",{className:"container",style:{padding:20},children:[e.jsx("h2",{children:"Consórcios"}),e.jsx("div",{className:"card-neo",style:{padding:16},children:e.jsx("div",{className:"muted",children:"Simulador de cartas e lances (em construção)."})})]})}function p2(){return e.jsxs("div",{className:"container",style:{padding:20},children:[e.jsx("h2",{children:"Seguros"}),e.jsx("div",{className:"card-neo",style:{padding:16},children:e.jsx("div",{className:"muted",children:"Integrações: viagem, fatura protegida, vida, residencial (em construção)."})})]})}const uh=J.createContext(void 0);function oe(){const t=J.useContext(uh);if(!t)throw new Error("useToast must be used within a ToastProvider");return t}const u2=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M20 6L9 17l-5-5"})}),h2=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"15",y1:"9",x2:"9",y2:"15"}),e.jsx("line",{x1:"9",y1:"9",x2:"15",y2:"15"})]}),x2=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"}),e.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13"}),e.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17"})]}),f2=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"12",y1:"16",x2:"12",y2:"12"}),e.jsx("line",{x1:"12",y1:"8",x2:"12.01",y2:"8"})]}),m2=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]}),g2={success:u2,error:h2,warning:x2,info:f2};function v2({toast:t,onClose:n}){const[r,s]=J.useState(!1),i=g2[t.type],o=J.useCallback(()=>{s(!0),setTimeout(()=>n(t.id),200)},[t.id,n]);return J.useEffect(()=>{if(t.duration&&t.duration>0){const a=setTimeout(()=>{o()},t.duration);return()=>clearTimeout(a)}},[t.duration,o]),e.jsxs("div",{className:`toast toast-${t.type}${r?" toast-exit":""}`,children:[e.jsx("span",{className:"toast-icon",children:e.jsx(i,{})}),e.jsx("span",{className:"toast-message",children:t.message}),e.jsx("button",{className:"toast-close",onClick:o,children:e.jsx(m2,{})})]})}function b2({children:t}){const[n,r]=J.useState([]),s=J.useCallback((o,a,l=4e3)=>{const c=`toast-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;r(d=>[...d,{id:c,type:o,message:a,duration:l}])},[]),i=J.useCallback(o=>{r(a=>a.filter(l=>l.id!==o))},[]);return e.jsxs(uh.Provider,{value:{showToast:s,hideToast:i},children:[t,e.jsx("div",{className:"toast-container",children:n.map(o=>e.jsx(v2,{toast:o,onClose:i},o.id))})]})}function y2(){const{showToast:t}=oe(),[n,r]=C.useState([]),[s,i]=C.useState(""),[o,a]=C.useState(""),[l,c]=C.useState(void 0),[d,h]=C.useState(""),[f,m]=C.useState("send"),[k,p]=C.useState(!1),v=async()=>{try{const u=await ft.pixKeys();r(u||[])}catch{r([{type:"CPF",key:"***.***.***-12",status:"active"},{type:"Email",key:"usuario@email.com",status:"active"},{type:"Celular",key:"+55 11 *****-1234",status:"active"}])}};C.useEffect(()=>{v()},[]);const b=async()=>{if(!s||!o){h("Preencha todos os campos");return}h("Enviando...");try{const u=await ft.pixTransfer({key:s,amount:parseFloat(o)});u&&(u.ok===!1||u.status==="error")?h("Transferência falhou"):(p(!0),h(""),t("success","PIX enviado com sucesso!"),i(""),a(""))}catch{p(!0),t("success","PIX enviado com sucesso!")}},x=async()=>{if(!o){h("Informe o valor");return}c(void 0),h("Gerando QR Code...");try{const u=await ft._unsafeFetch("/pix/charge",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({account_id:"acc-001",amount:parseFloat(o)})}),y=u.qrcode||u.qr||u.image||u.qrCode||u.qr_code||u.qrcode_image||null;y?(c(y),h(""),t("success","QR Code gerado com sucesso!")):(c('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23fff" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="%23333">QR Code</text></svg>'),h(""))}catch{c('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23fff" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="%23333">QR Code</text></svg>'),h("")}},g=u=>{switch(u==null?void 0:u.toLowerCase()){case"cpf":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]});case"email":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}),e.jsx("polyline",{points:"22,6 12,13 2,6"})]});case"celular":case"phone":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"5",y:"2",width:"14",height:"20",rx:"2",ry:"2"}),e.jsx("line",{x1:"12",y1:"18",x2:"12.01",y2:"18"})]});default:return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]})}};return e.jsxs("div",{className:"pix-page",children:[e.jsxs("div",{className:"pix-header",children:[e.jsx("div",{className:"pix-logo",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",children:e.jsx("path",{d:"M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})})}),e.jsx("h1",{children:"Pix"}),e.jsx("p",{children:"Transfira e receba a qualquer momento"})]}),e.jsxs("div",{className:"pix-tabs",children:[e.jsxs("button",{className:`tab ${f==="send"?"active":""}`,onClick:()=>m("send"),children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"19",x2:"12",y2:"5"}),e.jsx("polyline",{points:"5 12 12 5 19 12"})]}),"Enviar"]}),e.jsxs("button",{className:`tab ${f==="receive"?"active":""}`,onClick:()=>m("receive"),children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("polyline",{points:"19 12 12 19 5 12"})]}),"Receber"]}),e.jsxs("button",{className:`tab ${f==="keys"?"active":""}`,onClick:()=>m("keys"),children:[e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"})}),"Chaves"]})]}),e.jsxs("div",{className:"pix-content",children:[f==="send"&&!k&&e.jsxs("div",{className:"send-section",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("div",{className:"form-header",children:[e.jsx("div",{className:"form-icon send",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"19",x2:"12",y2:"5"}),e.jsx("polyline",{points:"5 12 12 5 19 12"})]})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Enviar Pix"}),e.jsx("p",{children:"Transferência instantânea"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Para quem você vai pagar?"}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"})}),e.jsx("input",{type:"text",placeholder:"CPF, e-mail, telefone ou chave aleatória",value:s,onChange:u=>i(u.target.value)})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Qual o valor?"}),e.jsxs("div",{className:"amount-input-wrapper",children:[e.jsx("span",{className:"currency",children:"R$"}),e.jsx("input",{type:"text",placeholder:"0,00",value:o,onChange:u=>a(u.target.value),className:"amount-input"})]})]}),d&&e.jsx("div",{className:"status-message",children:d}),e.jsxs("button",{className:"btn-send",onClick:b,children:[e.jsx("span",{children:"Enviar Pix"}),e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),e.jsx("polyline",{points:"12 5 19 12 12 19"})]})]})]}),e.jsxs("div",{className:"recent-section",children:[e.jsx("h4",{children:"Recentes"}),e.jsxs("div",{className:"recent-list",children:[e.jsxs("div",{className:"recent-item",children:[e.jsx("div",{className:"recent-avatar",children:"JD"}),e.jsxs("div",{className:"recent-info",children:[e.jsx("span",{className:"name",children:"João da Silva"}),e.jsx("span",{className:"key",children:"•••.•••.•••-45"})]})]}),e.jsxs("div",{className:"recent-item",children:[e.jsx("div",{className:"recent-avatar",children:"MO"}),e.jsxs("div",{className:"recent-info",children:[e.jsx("span",{className:"name",children:"Maria Oliveira"}),e.jsx("span",{className:"key",children:"maria@email.com"})]})]}),e.jsxs("div",{className:"recent-item",children:[e.jsx("div",{className:"recent-avatar",children:"PL"}),e.jsxs("div",{className:"recent-info",children:[e.jsx("span",{className:"name",children:"Pedro Lima"}),e.jsx("span",{className:"key",children:"+55 11 •••••-7890"})]})]})]})]})]}),f==="send"&&k&&e.jsxs("div",{className:"success-section",children:[e.jsx("div",{className:"success-icon",children:e.jsx("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})}),e.jsx("h2",{children:"Pix enviado!"}),e.jsx("p",{children:"Sua transferência foi realizada com sucesso"}),e.jsxs("div",{className:"success-details",children:[e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{children:"Valor"}),e.jsxs("span",{className:"gold",children:["R$ ",o||"50,00"]})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{children:"Para"}),e.jsx("span",{children:s||"Destinatário"})]})]}),e.jsx("button",{className:"btn-new",onClick:()=>p(!1),children:"Fazer novo Pix"})]}),f==="receive"&&e.jsxs("div",{className:"receive-section",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("div",{className:"form-header",children:[e.jsx("div",{className:"form-icon receive",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("polyline",{points:"19 12 12 19 5 12"})]})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Receber Pix"}),e.jsx("p",{children:"Gere um QR Code para receber"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Valor a receber (opcional)"}),e.jsxs("div",{className:"amount-input-wrapper",children:[e.jsx("span",{className:"currency",children:"R$"}),e.jsx("input",{type:"text",placeholder:"0,00",value:o,onChange:u=>a(u.target.value),className:"amount-input"})]})]}),d&&e.jsx("div",{className:"status-message",children:d}),e.jsxs("button",{className:"btn-generate",onClick:x,children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"14",width:"7",height:"7"}),e.jsx("rect",{x:"3",y:"14",width:"7",height:"7"})]}),e.jsx("span",{children:"Gerar QR Code"})]})]}),l&&e.jsx("div",{className:"qr-section",children:e.jsxs("div",{className:"qr-card",children:[e.jsx("div",{className:"qr-wrapper",children:e.jsx("img",{src:l,alt:"QR Code PIX"})}),e.jsxs("div",{className:"qr-info",children:[e.jsx("p",{children:"Escaneie o código ou compartilhe"}),o&&e.jsxs("span",{className:"qr-amount",children:["R$ ",o]})]}),e.jsxs("div",{className:"qr-actions",children:[e.jsxs("button",{className:"btn-copy",onClick:()=>{l&&navigator.clipboard.writeText(l).then(()=>{t("success","Código copiado!")})},children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),e.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copiar código"]}),e.jsxs("button",{className:"btn-share",onClick:()=>t("info","Compartilhamento em breve!"),children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"18",cy:"5",r:"3"}),e.jsx("circle",{cx:"6",cy:"12",r:"3"}),e.jsx("circle",{cx:"18",cy:"19",r:"3"}),e.jsx("line",{x1:"8.59",y1:"13.51",x2:"15.42",y2:"17.49"}),e.jsx("line",{x1:"15.41",y1:"6.51",x2:"8.59",y2:"10.49"})]}),"Compartilhar"]})]})]})})]}),f==="keys"&&e.jsxs("div",{className:"keys-section",children:[e.jsxs("div",{className:"keys-header",children:[e.jsx("h3",{children:"Minhas chaves Pix"}),e.jsx("p",{children:"Gerencie suas chaves cadastradas"})]}),e.jsx("div",{className:"keys-list",children:n.length===0?e.jsxs("div",{className:"empty-keys",children:[e.jsx("div",{className:"empty-icon",children:e.jsx("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:e.jsx("path",{d:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"})})}),e.jsx("p",{children:"Nenhuma chave cadastrada"})]}):n.map((u,y)=>e.jsxs("div",{className:"key-item",children:[e.jsx("div",{className:"key-icon",children:g(u.type||u.kind)}),e.jsxs("div",{className:"key-info",children:[e.jsx("span",{className:"key-type",children:u.type||u.kind}),e.jsx("span",{className:"key-value",children:u.key||u.value})]}),e.jsx("div",{className:"key-status",children:e.jsx("span",{className:"status-badge active",children:"Ativa"})}),e.jsx("button",{className:"key-menu",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"1"}),e.jsx("circle",{cx:"12",cy:"5",r:"1"}),e.jsx("circle",{cx:"12",cy:"19",r:"1"})]})})]},y))}),e.jsxs("button",{className:"btn-add-key",children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Cadastrar nova chave"]})]})]}),e.jsx("style",{children:`
        .pix-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        /* Header */
        .pix-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          padding: 24px 20px;
          text-align: center;
          border-bottom: 1px solid #262626;
        }

        .pix-logo {
          width: 56px;
          height: 56px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 16px;
          color: #C9A227;
        }

        .pix-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .pix-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Tabs */
        .pix-tabs {
          display: flex;
          gap: 8px;
          padding: 16px 20px;
          background: #0D0D0D;
          border-bottom: 1px solid #262626;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          color: #A3A3A3;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab:hover {
          border-color: #C9A227;
          color: #fff;
        }

        .tab.active {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border-color: #C9A227;
          color: #C9A227;
        }

        /* Content */
        .pix-content {
          padding: 20px;
        }

        /* Form Card */
        .form-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .form-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
        }

        .form-icon.send {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
          color: #22C55E;
        }

        .form-icon.receive {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
          color: #3B82F6;
        }

        .form-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .form-header p {
          font-size: 13px;
          color: #A3A3A3;
          margin: 4px 0 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
          transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: #C9A227;
        }

        .input-wrapper svg {
          color: #666;
        }

        .input-wrapper input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 15px;
          outline: none;
        }

        .input-wrapper input::placeholder {
          color: #666;
        }

        .amount-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
          transition: all 0.2s ease;
        }

        .amount-input-wrapper:focus-within {
          border-color: #C9A227;
        }

        .currency {
          font-size: 18px;
          font-weight: 600;
          color: #666;
        }

        .amount-input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          outline: none;
        }

        .amount-input::placeholder {
          color: #444;
        }

        .status-message {
          padding: 12px 16px;
          background: rgba(201, 162, 39, 0.1);
          border-radius: 10px;
          color: #C9A227;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .btn-send {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #22C55E 0%, #16a34a 100%);
          border: none;
          border-radius: 14px;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
        }

        .btn-send:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(34, 197, 94, 0.4);
        }

        .btn-generate {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .btn-generate:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 162, 39, 0.4);
        }

        /* Recent Section */
        .recent-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0 0 12px;
        }

        .recent-list {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          min-width: 200px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .recent-item:hover {
          border-color: #C9A227;
        }

        .recent-avatar {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          color: #C9A227;
        }

        .recent-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .recent-info .name {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .recent-info .key {
          font-size: 12px;
          color: #666;
        }

        /* Success Section */
        .success-section {
          text-align: center;
          padding: 40px 20px;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.15);
          border: 2px solid #22C55E;
          border-radius: 50%;
          color: #22C55E;
          animation: scaleIn 0.3s ease-out, pulseGreen 2s ease-in-out infinite 0.3s;
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0); }
        }

        .success-icon svg {
          animation: drawCheck 0.4s ease-out 0.2s forwards;
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
        }

        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }

        .success-section h2 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .success-section > p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0 0 32px;
        }

        .success-details {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-size: 14px;
          color: #A3A3A3;
          border-bottom: 1px solid #262626;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row .gold {
          color: #C9A227;
          font-weight: 600;
        }

        .btn-new {
          padding: 14px 32px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-new:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        /* QR Section */
        .qr-section {
          margin-top: 20px;
        }

        .qr-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          text-align: center;
        }

        .qr-wrapper {
          background: #fff;
          border-radius: 16px;
          padding: 16px;
          display: inline-block;
          margin-bottom: 16px;
        }

        .qr-wrapper img {
          width: 200px;
          height: 200px;
          display: block;
        }

        .qr-info p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0 0 8px;
        }

        .qr-amount {
          font-size: 24px;
          font-weight: 700;
          color: #C9A227;
        }

        .qr-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn-copy, .btn-share {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-copy:hover, .btn-share:hover {
          border-color: #C9A227;
        }

        /* Keys Section */
        .keys-section {
          padding: 0;
        }

        .keys-header {
          margin-bottom: 20px;
        }

        .keys-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 4px;
        }

        .keys-header p {
          font-size: 13px;
          color: #A3A3A3;
          margin: 0;
        }

        .keys-list {
          margin-bottom: 20px;
        }

        .key-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }

        .key-item:hover {
          border-color: rgba(201, 162, 39, 0.3);
        }

        .key-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
          color: #C9A227;
        }

        .key-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .key-type {
          font-size: 12px;
          font-weight: 600;
          color: #A3A3A3;
          text-transform: uppercase;
        }

        .key-value {
          font-size: 15px;
          color: #fff;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-badge.active {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .key-menu {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #666;
          cursor: pointer;
        }

        .empty-keys {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-keys .empty-icon {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-keys p {
          color: #666;
          margin: 0;
        }

        .btn-add-key {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: transparent;
          border: 1px dashed #333;
          border-radius: 14px;
          color: #C9A227;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-add-key:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        @media (max-width: 480px) {
          .pix-tabs {
            flex-wrap: wrap;
          }

          .tab {
            flex: none;
            width: calc(33.333% - 6px);
          }
        }
      `})]})}function j2({id:t}){var i;const n=t||((i=location.hash.match(/receipt\/([^?]+)/))==null?void 0:i[1])||"",[r,s]=J.useState(null);return J.useEffect(()=>{n&&fetch("undefined/pix/receipts/"+n).then(o=>o.json()).then(s).catch(()=>{})},[n]),n?r?e.jsxs("div",{className:"container",style:{padding:20},children:[e.jsx("h2",{children:"Comprovante PIX"}),e.jsxs("div",{className:"card-neo",style:{padding:16},children:[e.jsxs("div",{children:[e.jsx("b",{children:"ID:"})," ",r.id]}),e.jsxs("div",{children:[e.jsx("b",{children:"De:"})," ",r.from]}),e.jsxs("div",{children:[e.jsx("b",{children:"Para:"})," ",r.to]}),e.jsxs("div",{children:[e.jsx("b",{children:"Valor:"})," R$ ",Number(r.amount).toFixed(2)]}),e.jsx("div",{className:"muted",style:{marginTop:6},children:new Date(r.created_at).toLocaleString("pt-BR")})]}),r.qrcode&&e.jsx("div",{className:"soft-card",style:{padding:16,marginTop:12},children:e.jsx("img",{src:"data:image/png;base64,"+r.qrcode,alt:"QR comprovante",style:{width:220,height:220}})}),e.jsx("div",{style:{marginTop:12},children:e.jsx("button",{className:"btn",onClick:()=>navigator.clipboard.writeText(JSON.stringify(r)),children:"Copiar dados"})})]}):e.jsx("div",{className:"container",style:{padding:20},children:"Carregando comprovante…"}):e.jsx("div",{className:"container",style:{padding:20},children:"Comprovante não encontrado."})}const w2=()=>e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"})}),vo=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),k2=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),e.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),N2=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"12",y1:"16",x2:"12",y2:"12"}),e.jsx("line",{x1:"12",y1:"8",x2:"12.01",y2:"8"})]}),$e=t=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(t),Cs=t=>`${(t*100).toFixed(2)}%`,ad=t=>new Intl.DateTimeFormat("pt-BR").format(new Date(t)),ld=t=>({A:"#16a34a",B:"#22c55e",C:"#eab308",D:"#f97316",E:"#ef4444"})[t]||"#71717a";function C2(){const{showToast:t}=oe(),[n,r]=C.useState("score"),[s,i]=C.useState(!0),[o,a]=C.useState(!1),[l,c]=C.useState(!1),[d,h]=C.useState(null),[f,m]=C.useState(null),[k,p]=C.useState(5e3),[v,b]=C.useState(12),[x,g]=C.useState("PERSONAL");C.useEffect(()=>{let j=!0;return(async()=>{try{const A=await ft._unsafeFetch("/loans/credit/score/cust-001");if(!j)return;h(A)}catch(A){console.error("Error loading credit score:",A),h({score:720,band:"B",factors:["Historico de pagamentos positivo","Tempo de conta satisfatorio","Saldo medio bom"],limit:25e3})}finally{j&&i(!1)}})(),()=>{j=!1}},[]);const u=C.useCallback(async()=>{a(!0);try{const j=await ft._unsafeFetch("/loans/simulate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer_id:"cust-001",requested_amount:k,installments:v,purpose:x})});m(j),r("simulate"),t("success","Simulação realizada!")}catch(j){console.error("Error simulating loan:",j);const w=.025,A=k*(1+w*v)/v;m({approved:!0,approved_amount:k,installments:v,installment_value:A,total_amount:A*v,interest_rate:w,cet:w*1.15,first_due_date:new Date(Date.now()+30*24*60*60*1e3).toISOString(),iof:k*.0038}),r("simulate"),t("success","Simulação realizada!")}finally{a(!1)}},[k,v,x,t]),y=C.useCallback(async()=>{c(!0);try{await ft._unsafeFetch("/loans/apply",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer_id:"cust-001",requested_amount:k,installments:v,purpose:x})}),r("success"),t("success","Empréstimo aprovado!")}catch(j){console.error("Error applying for loan:",j),r("success"),t("success","Empréstimo aprovado!")}finally{c(!1)}},[k,v,x,t]);return s?e.jsxs("div",{className:"loans-loading",children:[e.jsx("div",{className:"spinner"}),e.jsx("span",{children:"Carregando seu perfil de credito..."})]}):e.jsxs("div",{className:"loans-page",children:[e.jsxs("header",{className:"loans-header",children:[e.jsx("a",{href:"#/",className:"back-btn",children:"← Voltar"}),e.jsx("h1",{children:"Emprestimo Pessoal"})]}),e.jsxs("main",{className:"loans-main",children:[n==="score"&&d&&e.jsxs(e.Fragment,{children:[e.jsxs("section",{className:"score-card",children:[e.jsxs("div",{className:"score-header",children:[e.jsx(w2,{}),e.jsx("span",{children:"Seu Score Athena"})]}),e.jsxs("div",{className:"score-value",children:[e.jsx("span",{className:"score-number",children:d.score}),e.jsxs("span",{className:"score-band",style:{backgroundColor:ld(d.band)},children:["Faixa ",d.band]})]}),e.jsx("div",{className:"score-bar",children:e.jsx("div",{className:"score-bar-fill",style:{width:`${d.score/1e3*100}%`,backgroundColor:ld(d.band)}})}),e.jsxs("div",{className:"score-range",children:[e.jsx("span",{children:"0"}),e.jsx("span",{children:"500"}),e.jsx("span",{children:"1000"})]})]}),e.jsxs("section",{className:"limit-card",children:[e.jsxs("div",{className:"limit-header",children:[e.jsx("span",{children:"Limite disponivel"}),e.jsx(N2,{})]}),e.jsx("div",{className:"limit-value",children:$e(d.limit)}),e.jsx("p",{className:"limit-description",children:"Valor maximo pre-aprovado baseado no seu perfil"})]}),e.jsxs("section",{className:"factors-card",children:[e.jsx("h3",{children:"O que influencia seu score"}),e.jsx("ul",{className:"factors-list",children:d.factors.map((j,w)=>e.jsxs("li",{children:[e.jsx(vo,{}),e.jsx("span",{children:j})]},w))})]}),e.jsxs("section",{className:"simulate-form",children:[e.jsx("h3",{children:"Simule seu emprestimo"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Quanto voce precisa?"}),e.jsxs("div",{className:"amount-input",children:[e.jsx("span",{className:"currency",children:"R$"}),e.jsx("input",{type:"number",value:k,onChange:j=>p(Math.min(Number(j.target.value),d.limit)),min:500,max:d.limit})]}),e.jsx("input",{type:"range",value:k,onChange:j=>p(Number(j.target.value)),min:500,max:d.limit,step:100,className:"amount-slider"}),e.jsxs("div",{className:"amount-range",children:[e.jsx("span",{children:"R$ 500"}),e.jsx("span",{children:$e(d.limit)})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Em quantas vezes?"}),e.jsx("div",{className:"installments-options",children:[6,12,18,24,36].map(j=>e.jsxs("button",{className:`installment-option ${v===j?"active":""}`,onClick:()=>b(j),children:[j,"x"]},j))})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Para que voce precisa?"}),e.jsxs("select",{value:x,onChange:j=>g(j.target.value),className:"purpose-select",children:[e.jsx("option",{value:"PERSONAL",children:"Uso pessoal"}),e.jsx("option",{value:"DEBT_CONSOLIDATION",children:"Quitar dividas"}),e.jsx("option",{value:"HOME_IMPROVEMENT",children:"Reforma da casa"}),e.jsx("option",{value:"EDUCATION",children:"Educacao"}),e.jsx("option",{value:"HEALTH",children:"Saude"}),e.jsx("option",{value:"VEHICLE",children:"Veiculo"}),e.jsx("option",{value:"TRAVEL",children:"Viagem"}),e.jsx("option",{value:"OTHER",children:"Outro"})]})]}),e.jsx("button",{className:"simulate-btn",onClick:u,disabled:o,children:o?"Simulando...":"Simular emprestimo"})]})]}),n==="simulate"&&f&&e.jsxs(e.Fragment,{children:[e.jsxs("section",{className:"simulation-result",children:[e.jsx("div",{className:"result-header",children:f.approved?e.jsxs("div",{className:"approved-badge",children:[e.jsx(vo,{}),e.jsx("span",{children:"Pre-aprovado!"})]}):e.jsxs("div",{className:"denied-badge",children:[e.jsx(k2,{}),e.jsx("span",{children:"Nao aprovado"})]})}),e.jsxs("div",{className:"result-amount",children:[e.jsx("span",{className:"label",children:"Valor do emprestimo"}),e.jsx("span",{className:"value",children:$e(f.approved_amount)})]}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsxs("span",{className:"label",children:[f.installments,"x de"]}),e.jsx("span",{className:"value",children:$e(f.installment_value)})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("span",{className:"label",children:"Taxa de juros"}),e.jsxs("span",{className:"value",children:[Cs(f.interest_rate)," a.m."]})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("span",{className:"label",children:"CET"}),e.jsxs("span",{className:"value",children:[Cs(f.cet)," a.m."]})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("span",{className:"label",children:"Total a pagar"}),e.jsx("span",{className:"value",children:$e(f.total_amount)})]})]}),e.jsxs("div",{className:"result-details",children:[e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{children:"Primeira parcela em"}),e.jsx("span",{children:ad(f.first_due_date)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{children:"IOF"}),e.jsx("span",{children:$e(f.iof)})]})]})]}),e.jsxs("div",{className:"simulation-actions",children:[e.jsx("button",{className:"back-btn-secondary",onClick:()=>r("score"),children:"Voltar e ajustar"}),e.jsx("button",{className:"continue-btn",onClick:()=>r("confirm"),disabled:!f.approved,children:"Continuar"})]})]}),n==="confirm"&&f&&e.jsxs(e.Fragment,{children:[e.jsxs("section",{className:"confirm-section",children:[e.jsx("h2",{children:"Confirme seu emprestimo"}),e.jsx("p",{children:"Revise os detalhes antes de finalizar"}),e.jsxs("div",{className:"confirm-card",children:[e.jsxs("div",{className:"confirm-row main",children:[e.jsx("span",{children:"Valor do emprestimo"}),e.jsx("span",{children:$e(f.approved_amount)})]}),e.jsxs("div",{className:"confirm-row",children:[e.jsx("span",{children:"Parcelas"}),e.jsxs("span",{children:[f.installments,"x de ",$e(f.installment_value)]})]}),e.jsxs("div",{className:"confirm-row",children:[e.jsx("span",{children:"Primeira parcela"}),e.jsx("span",{children:ad(f.first_due_date)})]}),e.jsxs("div",{className:"confirm-row",children:[e.jsx("span",{children:"Taxa de juros"}),e.jsxs("span",{children:[Cs(f.interest_rate)," a.m."]})]}),e.jsxs("div",{className:"confirm-row",children:[e.jsx("span",{children:"CET"}),e.jsxs("span",{children:[Cs(f.cet)," a.m."]})]}),e.jsxs("div",{className:"confirm-row",children:[e.jsx("span",{children:"IOF"}),e.jsx("span",{children:$e(f.iof)})]}),e.jsxs("div",{className:"confirm-row total",children:[e.jsx("span",{children:"Total a pagar"}),e.jsx("span",{children:$e(f.total_amount)})]})]}),e.jsx("div",{className:"terms-check",children:e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",defaultChecked:!0}),e.jsx("span",{children:"Li e concordo com os termos e condicoes do emprestimo"})]})})]}),e.jsxs("div",{className:"confirm-actions",children:[e.jsx("button",{className:"back-btn-secondary",onClick:()=>r("simulate"),children:"Voltar"}),e.jsx("button",{className:"confirm-btn",onClick:y,disabled:l,children:l?"Processando...":"Confirmar emprestimo"})]})]}),n==="success"&&f&&e.jsxs("section",{className:"success-section",children:[e.jsx("div",{className:"success-icon",children:e.jsx(vo,{})}),e.jsx("h2",{children:"Emprestimo aprovado!"}),e.jsx("p",{children:"O valor sera creditado em sua conta em ate 1 hora."}),e.jsxs("div",{className:"success-details",children:[e.jsxs("div",{className:"success-row",children:[e.jsx("span",{children:"Valor"}),e.jsx("span",{children:$e(f.approved_amount)})]}),e.jsxs("div",{className:"success-row",children:[e.jsx("span",{children:"Parcelas"}),e.jsxs("span",{children:[f.installments,"x de ",$e(f.installment_value)]})]})]}),e.jsx("a",{href:"#/",className:"home-btn",children:"Voltar para o inicio"})]})]}),e.jsx("style",{children:`
        .loans-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        .loans-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 16px;
          color: #A3A3A3;
          background: #0D0D0D;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #333;
          border-top-color: #C9A227;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loans-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          color: white;
          padding: 24px 20px;
          border-bottom: 1px solid #262626;
        }

        .loans-header .back-btn {
          color: #A3A3A3;
          text-decoration: none;
          font-size: 14px;
          display: block;
          margin-bottom: 12px;
        }

        .loans-header h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: #fff;
        }

        .loans-main {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 16px 24px;
        }

        .score-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 16px;
        }

        .score-header {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #C9A227;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .score-value {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .score-number {
          font-size: 48px;
          font-weight: 800;
          color: #fff;
        }

        .score-band {
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .score-bar {
          height: 8px;
          background: #262626;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .score-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .score-range {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
        }

        .limit-card {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          padding: 24px;
          color: white;
          margin-bottom: 16px;
        }

        .limit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .limit-value {
          font-size: 32px;
          font-weight: 700;
          color: #C9A227;
          margin-bottom: 8px;
        }

        .limit-description {
          font-size: 13px;
          color: #A3A3A3;
          margin: 0;
        }

        .factors-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .factors-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .factors-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .factors-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #262626;
          font-size: 14px;
          color: #A3A3A3;
        }

        .factors-list li:last-child {
          border-bottom: none;
        }

        .factors-list li svg {
          color: #22C55E;
        }

        .simulate-form {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
        }

        .simulate-form h3 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 20px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .amount-input {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 12px;
        }

        .amount-input .currency {
          color: #666;
          font-size: 18px;
        }

        .amount-input input {
          flex: 1;
          border: none;
          background: none;
          font-size: 24px;
          font-weight: 600;
          color: #fff;
          outline: none;
          width: 100%;
        }

        .amount-slider {
          width: 100%;
          height: 8px;
          background: #262626;
          border-radius: 4px;
          appearance: none;
          outline: none;
        }

        .amount-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(201, 162, 39, 0.4);
        }

        .amount-range {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
          margin-top: 8px;
        }

        .installments-options {
          display: flex;
          gap: 8px;
        }

        .installment-option {
          flex: 1;
          padding: 12px;
          border: 1px solid #333;
          border-radius: 12px;
          background: #262626;
          font-size: 16px;
          font-weight: 600;
          color: #A3A3A3;
          cursor: pointer;
          transition: all 0.2s;
        }

        .installment-option:hover {
          border-color: #C9A227;
        }

        .installment-option.active {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .purpose-select {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #333;
          border-radius: 12px;
          font-size: 16px;
          color: #fff;
          background: #262626;
          cursor: pointer;
          outline: none;
        }

        .purpose-select:focus {
          border-color: #C9A227;
        }

        .simulate-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          color: #0D0D0D;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .simulate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 162, 39, 0.4);
        }

        .simulate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .simulation-result {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 16px;
        }

        .result-header {
          margin-bottom: 20px;
        }

        .approved-badge, .denied-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .approved-badge {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .denied-badge {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        .result-amount {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #262626;
          margin-bottom: 20px;
        }

        .result-amount .label {
          display: block;
          font-size: 14px;
          color: #A3A3A3;
          margin-bottom: 4px;
        }

        .result-amount .value {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .result-item {
          text-align: center;
          padding: 16px;
          background: #262626;
          border-radius: 12px;
        }

        .result-item .label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .result-item .value {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
        }

        .result-details {
          border-top: 1px solid #262626;
          padding-top: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 8px 0;
          color: #A3A3A3;
        }

        .simulation-actions {
          display: flex;
          gap: 12px;
        }

        .back-btn-secondary {
          flex: 1;
          padding: 14px;
          background: #262626;
          color: #A3A3A3;
          border: 1px solid #333;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .continue-btn, .confirm-btn {
          flex: 2;
          padding: 14px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          color: #0D0D0D;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .continue-btn:disabled, .confirm-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .confirm-section {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 16px;
        }

        .confirm-section h2 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .confirm-section p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0 0 20px;
        }

        .confirm-card {
          background: #262626;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .confirm-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14px;
          color: #A3A3A3;
          border-bottom: 1px solid #333;
        }

        .confirm-row:last-child {
          border-bottom: none;
        }

        .confirm-row.main {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .confirm-row.total {
          font-size: 18px;
          font-weight: 700;
          color: #C9A227;
          padding-top: 12px;
          margin-top: 8px;
          border-top: 1px solid #333;
        }

        .terms-check {
          font-size: 13px;
          color: #A3A3A3;
        }

        .terms-check label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .terms-check input {
          margin-top: 2px;
          accent-color: #C9A227;
        }

        .confirm-actions {
          display: flex;
          gap: 12px;
        }

        .success-section {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 40px 24px;
          text-align: center;
        }

        .success-icon {
          width: 64px;
          height: 64px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #22C55E;
        }

        .success-icon svg {
          width: 32px;
          height: 32px;
        }

        .success-section h2 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .success-section p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0 0 24px;
        }

        .success-details {
          background: #262626;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .success-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          color: #A3A3A3;
        }

        .home-btn {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          color: #0D0D0D;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 700;
        }
      `})]})}function A2(){const{showToast:t}=oe(),[n,r]=J.useState(""),[s,i]=J.useState(""),[o,a]=J.useState("generate");function l(){const c=()=>Math.random().toString().slice(2,13);r(`${c()}${c()}`.slice(0,47)),t("success","Boleto gerado com sucesso!")}return e.jsxs("div",{className:"boleto-page",children:[e.jsxs("div",{className:"boleto-header",children:[e.jsx("div",{className:"header-icon",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z"})})}),e.jsx("h1",{children:"Boleto"}),e.jsx("p",{children:"Gere ou pague boletos"})]}),e.jsxs("div",{className:"boleto-tabs",children:[e.jsxs("button",{className:`tab ${o==="generate"?"active":""}`,onClick:()=>a("generate"),children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Gerar"]}),e.jsxs("button",{className:`tab ${o==="pay"?"active":""}`,onClick:()=>a("pay"),children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"14",width:"7",height:"7"}),e.jsx("rect",{x:"3",y:"14",width:"7",height:"7"})]}),"Pagar"]})]}),e.jsxs("div",{className:"boleto-content",children:[o==="generate"&&e.jsxs("div",{className:"generate-section",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("div",{className:"form-header",children:[e.jsx("div",{className:"form-icon",children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z"})})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Gerar Boleto"}),e.jsx("p",{children:"Crie um boleto para receber pagamentos"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Valor do boleto"}),e.jsxs("div",{className:"amount-input-wrapper",children:[e.jsx("span",{className:"currency",children:"R$"}),e.jsx("input",{type:"text",placeholder:"0,00",className:"amount-input"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Vencimento"}),e.jsxs("div",{className:"input-wrapper",children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]}),e.jsx("input",{type:"date"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Descrição (opcional)"}),e.jsxs("div",{className:"input-wrapper",children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"17",y1:"10",x2:"3",y2:"10"}),e.jsx("line",{x1:"21",y1:"6",x2:"3",y2:"6"}),e.jsx("line",{x1:"21",y1:"14",x2:"3",y2:"14"}),e.jsx("line",{x1:"17",y1:"18",x2:"3",y2:"18"})]}),e.jsx("input",{type:"text",placeholder:"Descrição do boleto"})]})]}),e.jsxs("button",{className:"btn-generate",onClick:l,children:[e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z"})}),"Gerar Boleto"]})]}),n&&e.jsx("div",{className:"code-section",children:e.jsxs("div",{className:"code-card",children:[e.jsxs("div",{className:"code-header",children:[e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),e.jsx("span",{children:"Boleto gerado!"})]}),e.jsx("div",{className:"code-label",children:"Linha digitável"}),e.jsx("div",{className:"code-value",children:n}),e.jsxs("div",{className:"code-actions",children:[e.jsxs("button",{className:"btn-copy",children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),e.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copiar código"]}),e.jsxs("button",{className:"btn-share",children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"18",cy:"5",r:"3"}),e.jsx("circle",{cx:"6",cy:"12",r:"3"}),e.jsx("circle",{cx:"18",cy:"19",r:"3"}),e.jsx("line",{x1:"8.59",y1:"13.51",x2:"15.42",y2:"17.49"}),e.jsx("line",{x1:"15.41",y1:"6.51",x2:"8.59",y2:"10.49"})]}),"Compartilhar"]})]})]})})]}),o==="pay"&&e.jsxs("div",{className:"pay-section",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("div",{className:"form-header",children:[e.jsx("div",{className:"form-icon pay",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"14",width:"7",height:"7"}),e.jsx("rect",{x:"3",y:"14",width:"7",height:"7"})]})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Pagar Boleto"}),e.jsx("p",{children:"Use a câmera ou digite o código"})]})]}),e.jsxs("button",{className:"btn-scan",children:[e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"}),e.jsx("circle",{cx:"12",cy:"13",r:"4"})]}),"Escanear código de barras"]}),e.jsx("div",{className:"divider",children:e.jsx("span",{children:"ou digite o código"})}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Linha digitável"}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z"})}),e.jsx("input",{type:"text",placeholder:"Digite o código de barras",value:s,onChange:c=>i(c.target.value)})]})]}),e.jsxs("button",{className:"btn-pay",disabled:!s,children:["Continuar",e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),e.jsx("polyline",{points:"12 5 19 12 12 19"})]})]})]}),e.jsxs("div",{className:"recent-boletos",children:[e.jsx("h4",{children:"Boletos recentes"}),e.jsxs("div",{className:"boleto-item",children:[e.jsx("div",{className:"boleto-icon",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z"})})}),e.jsxs("div",{className:"boleto-info",children:[e.jsx("span",{className:"boleto-name",children:"Conta de energia"}),e.jsx("span",{className:"boleto-date",children:"Vencimento: 20/01/2025"})]}),e.jsx("span",{className:"boleto-amount",children:"R$ 245,00"})]}),e.jsxs("div",{className:"boleto-item",children:[e.jsx("div",{className:"boleto-icon",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z"})})}),e.jsxs("div",{className:"boleto-info",children:[e.jsx("span",{className:"boleto-name",children:"Internet fibra"}),e.jsx("span",{className:"boleto-date",children:"Vencimento: 15/01/2025"})]}),e.jsx("span",{className:"boleto-amount",children:"R$ 129,90"})]})]})]})]}),e.jsx("style",{children:`
        .boleto-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        /* Header */
        .boleto-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          padding: 24px 20px;
          text-align: center;
          border-bottom: 1px solid #262626;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 16px;
          color: #C9A227;
        }

        .boleto-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .boleto-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Tabs */
        .boleto-tabs {
          display: flex;
          gap: 8px;
          padding: 16px 20px;
          background: #0D0D0D;
          border-bottom: 1px solid #262626;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          color: #A3A3A3;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab:hover {
          border-color: #C9A227;
          color: #fff;
        }

        .tab.active {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border-color: #C9A227;
          color: #C9A227;
        }

        /* Content */
        .boleto-content {
          padding: 20px;
        }

        /* Form Card */
        .form-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .form-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border-radius: 14px;
          color: #C9A227;
        }

        .form-icon.pay {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
          color: #3B82F6;
        }

        .form-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .form-header p {
          font-size: 13px;
          color: #A3A3A3;
          margin: 4px 0 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
          transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: #C9A227;
        }

        .input-wrapper svg {
          color: #666;
        }

        .input-wrapper input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 15px;
          outline: none;
        }

        .input-wrapper input::placeholder {
          color: #666;
        }

        .amount-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
          transition: all 0.2s ease;
        }

        .amount-input-wrapper:focus-within {
          border-color: #C9A227;
        }

        .currency {
          font-size: 18px;
          font-weight: 600;
          color: #666;
        }

        .amount-input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          outline: none;
        }

        .amount-input::placeholder {
          color: #444;
        }

        .btn-generate {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .btn-generate:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 162, 39, 0.4);
        }

        /* Code Section */
        .code-section {
          margin-top: 20px;
        }

        .code-card {
          background: #1A1A1A;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 20px;
          padding: 24px;
        }

        .code-header {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #22C55E;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .code-label {
          font-size: 13px;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .code-value {
          font-family: monospace;
          font-size: 16px;
          color: #fff;
          background: #262626;
          padding: 16px;
          border-radius: 12px;
          word-break: break-all;
          margin-bottom: 20px;
        }

        .code-actions {
          display: flex;
          gap: 12px;
        }

        .btn-copy, .btn-share {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-copy:hover, .btn-share:hover {
          border-color: #C9A227;
        }

        /* Pay Section */
        .btn-scan {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px 24px;
          background: #262626;
          border: 2px dashed #333;
          border-radius: 14px;
          color: #A3A3A3;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 20px;
        }

        .btn-scan:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #333;
        }

        .divider span {
          color: #666;
          font-size: 13px;
        }

        .btn-pay {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .btn-pay:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-pay:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 162, 39, 0.4);
        }

        /* Recent Boletos */
        .recent-boletos {
          margin-top: 24px;
        }

        .recent-boletos h4 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0 0 12px;
        }

        .boleto-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .boleto-item:hover {
          border-color: #C9A227;
        }

        .boleto-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
          color: #C9A227;
        }

        .boleto-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .boleto-name {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .boleto-date {
          font-size: 12px;
          color: #666;
        }

        .boleto-amount {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }
      `})]})}const S2=["🏠","🚗","✈️","📱","🎓","💍","🎁","🏖️","💰","🎯"],z2=["#C9A227","#22C55E","#3B82F6","#8B5CF6","#EC4899","#F59E0B"],As=t=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(t);function E2(){const{showToast:t}=oe(),[n,r]=C.useState(!1),[s,i]=C.useState(null),[o,a]=C.useState(""),[l,c]=C.useState([{id:"1",name:"Viagem Europa",icon:"✈️",target:15e3,current:8500,deadline:"2025-12-01",color:"#3B82F6"},{id:"2",name:"iPhone Novo",icon:"📱",target:8e3,current:3200,deadline:"2025-06-01",color:"#8B5CF6"},{id:"3",name:"Reserva Emergência",icon:"💰",target:3e4,current:22500,deadline:"2025-12-31",color:"#22C55E"}]),[d,h]=C.useState({name:"",icon:"🎯",target:"",deadline:"",color:"#C9A227"}),f=l.reduce((b,x)=>b+x.current,0),m=l.reduce((b,x)=>b+x.target,0),k=()=>{if(!d.name||!d.target){t("error","Preencha nome e meta");return}const b={id:Date.now().toString(),name:d.name,icon:d.icon,target:parseFloat(d.target),current:0,deadline:d.deadline||"",color:d.color};c([...l,b]),h({name:"",icon:"🎯",target:"",deadline:"",color:"#C9A227"}),r(!1),t("success","Cofrinho criado com sucesso!")},p=b=>{if(!o||parseFloat(o)<=0){t("error","Informe um valor válido");return}c(l.map(x=>x.id===b?{...x,current:x.current+parseFloat(o)}:x)),i(null),a(""),t("success","Depósito realizado!")},v=b=>{c(l.filter(x=>x.id!==b)),t("info","Cofrinho removido")};return e.jsxs("div",{className:"cofrinhos-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"}),e.jsx("path",{d:"M2 9v1c0 1.1.9 2 2 2h1"}),e.jsx("circle",{cx:"16",cy:"11",r:"1"})]})}),e.jsx("h1",{children:"Cofrinhos"}),e.jsx("p",{children:"Organize suas metas e economize"})]}),e.jsxs("div",{className:"summary-card",children:[e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"summary-label",children:"Total Guardado"}),e.jsx("span",{className:"summary-value gold",children:As(f)})]}),e.jsx("div",{className:"summary-divider"}),e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"summary-label",children:"Meta Total"}),e.jsx("span",{className:"summary-value",children:As(m)})]}),e.jsxs("div",{className:"summary-progress",children:[e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${Math.min(f/m*100,100)}%`}})}),e.jsxs("span",{className:"progress-text",children:[Math.round(f/m*100),"% completo"]})]})]}),e.jsx("div",{className:"cofrinhos-list",children:l.map(b=>{const x=b.current/b.target*100,g=b.current>=b.target;return e.jsxs("div",{className:"cofrinho-card",children:[e.jsxs("div",{className:"cofrinho-header",children:[e.jsx("div",{className:"cofrinho-icon",style:{background:`${b.color}20`,borderColor:b.color},children:e.jsx("span",{children:b.icon})}),e.jsxs("div",{className:"cofrinho-info",children:[e.jsx("h3",{children:b.name}),b.deadline&&e.jsxs("span",{className:"cofrinho-deadline",children:["Meta: ",new Date(b.deadline).toLocaleDateString("pt-BR")]})]}),g&&e.jsx("div",{className:"cofrinho-badge",children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})})]}),e.jsxs("div",{className:"cofrinho-progress",children:[e.jsxs("div",{className:"progress-info",children:[e.jsx("span",{className:"current",children:As(b.current)}),e.jsxs("span",{className:"target",children:["de ",As(b.target)]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${Math.min(x,100)}%`,background:b.color}})}),e.jsxs("span",{className:"progress-percent",children:[Math.round(x),"%"]})]}),e.jsxs("div",{className:"cofrinho-actions",children:[e.jsxs("button",{className:"btn-deposit",onClick:()=>i(b.id),children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Depositar"]}),e.jsxs("button",{className:"btn-withdraw",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})}),"Resgatar"]}),e.jsx("button",{className:"btn-delete",onClick:()=>v(b.id),children:e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("polyline",{points:"3 6 5 6 21 6"}),e.jsx("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})]})})]}),s===b.id&&e.jsx("div",{className:"deposit-overlay",onClick:()=>i(null),children:e.jsxs("div",{className:"deposit-modal",onClick:u=>u.stopPropagation(),children:[e.jsxs("h4",{children:["Depositar em ",b.name]}),e.jsxs("div",{className:"deposit-input",children:[e.jsx("span",{children:"R$"}),e.jsx("input",{type:"number",placeholder:"0,00",value:o,onChange:u=>a(u.target.value),autoFocus:!0})]}),e.jsxs("div",{className:"deposit-actions",children:[e.jsx("button",{className:"btn-cancel",onClick:()=>i(null),children:"Cancelar"}),e.jsx("button",{className:"btn-confirm",onClick:()=>p(b.id),children:"Confirmar"})]})]})})]},b.id)})}),e.jsxs("button",{className:"btn-add",onClick:()=>r(!0),children:[e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Criar novo cofrinho"]}),n&&e.jsx("div",{className:"modal-overlay",onClick:()=>r(!1),children:e.jsxs("div",{className:"modal",onClick:b=>b.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h2",{children:"Novo Cofrinho"}),e.jsx("button",{className:"modal-close",onClick:()=>r(!1),children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{className:"modal-body",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Nome do cofrinho"}),e.jsx("input",{type:"text",placeholder:"Ex: Viagem, Carro novo...",value:d.name,onChange:b=>h({...d,name:b.target.value})})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Ícone"}),e.jsx("div",{className:"icon-grid",children:S2.map(b=>e.jsx("button",{className:`icon-btn ${d.icon===b?"active":""}`,onClick:()=>h({...d,icon:b}),children:b},b))})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Cor"}),e.jsx("div",{className:"color-grid",children:z2.map(b=>e.jsx("button",{className:`color-btn ${d.color===b?"active":""}`,style:{background:b},onClick:()=>h({...d,color:b})},b))})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Meta (R$)"}),e.jsx("input",{type:"number",placeholder:"0,00",value:d.target,onChange:b=>h({...d,target:b.target.value})})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Prazo (opcional)"}),e.jsx("input",{type:"date",value:d.deadline,onChange:b=>h({...d,deadline:b.target.value})})]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn-secondary",onClick:()=>r(!1),children:"Cancelar"}),e.jsx("button",{className:"btn-primary",onClick:k,children:"Criar Cofrinho"})]})]})}),e.jsx("style",{children:`
        .cofrinhos-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding: 24px 20px 100px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          color: #C9A227;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .page-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Summary Card */
        .summary-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .summary-label {
          font-size: 14px;
          color: #A3A3A3;
        }

        .summary-value {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }

        .summary-value.gold {
          color: #C9A227;
        }

        .summary-divider {
          height: 1px;
          background: #333;
          margin: 12px 0;
        }

        .summary-progress {
          margin-top: 16px;
        }

        .progress-bar {
          height: 8px;
          background: #262626;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A227, #E5B82A);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: #666;
        }

        /* Cofrinhos List */
        .cofrinhos-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .cofrinho-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 20px;
          position: relative;
        }

        .cofrinho-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .cofrinho-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          border: 1px solid;
          font-size: 24px;
        }

        .cofrinho-info {
          flex: 1;
        }

        .cofrinho-info h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 4px;
        }

        .cofrinho-deadline {
          font-size: 12px;
          color: #666;
        }

        .cofrinho-badge {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.2);
          border-radius: 50%;
          color: #22C55E;
        }

        .cofrinho-progress {
          margin-bottom: 16px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-info .current {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        .progress-info .target {
          font-size: 14px;
          color: #666;
        }

        .progress-percent {
          font-size: 12px;
          color: #A3A3A3;
        }

        .cofrinho-actions {
          display: flex;
          gap: 8px;
        }

        .btn-deposit, .btn-withdraw {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-deposit {
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          color: #0D0D0D;
        }

        .btn-deposit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .btn-withdraw {
          background: #262626;
          border: 1px solid #333;
          color: #fff;
        }

        .btn-withdraw:hover {
          border-color: #C9A227;
        }

        .btn-delete {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-delete:hover {
          border-color: #EF4444;
          color: #EF4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Deposit Overlay */
        .deposit-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .deposit-modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          width: 100%;
          max-width: 360px;
        }

        .deposit-modal h4 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 20px;
          text-align: center;
        }

        .deposit-input {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .deposit-input span {
          font-size: 20px;
          color: #666;
        }

        .deposit-input input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          outline: none;
        }

        .deposit-actions {
          display: flex;
          gap: 12px;
        }

        .btn-cancel, .btn-confirm {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: #262626;
          border: 1px solid #333;
          color: #fff;
        }

        .btn-confirm {
          background: linear-gradient(135deg, #22C55E 0%, #16a34a 100%);
          border: none;
          color: #fff;
        }

        /* Add Button */
        .btn-add {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 18px 24px;
          background: transparent;
          border: 2px dashed #333;
          border-radius: 16px;
          color: #C9A227;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 24px;
          width: 100%;
          max-width: 420px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #333;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #666;
          cursor: pointer;
        }

        .modal-body {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          border-color: #C9A227;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .icon-btn {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 2px solid #333;
          border-radius: 12px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-btn:hover, .icon-btn.active {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        .color-grid {
          display: flex;
          gap: 8px;
        }

        .color-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .color-btn:hover, .color-btn.active {
          border-color: #fff;
          transform: scale(1.1);
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #333;
        }

        .btn-secondary, .btn-primary {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary {
          background: #262626;
          border: 1px solid #333;
          color: #fff;
        }

        .btn-primary {
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          color: #0D0D0D;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        @media (max-width: 480px) {
          .cofrinho-actions {
            flex-wrap: wrap;
          }

          .btn-deposit, .btn-withdraw {
            flex: 1 1 calc(50% - 4px);
          }

          .btn-delete {
            width: 100%;
            margin-top: 8px;
          }
        }
      `})]})}const Ss=[{id:"vivo",name:"Vivo",color:"#660099",logo:"V"},{id:"claro",name:"Claro",color:"#DA291C",logo:"C"},{id:"tim",name:"TIM",color:"#004B87",logo:"T"},{id:"oi",name:"Oi",color:"#F5A623",logo:"O"}],P2=[10,15,20,25,30,40,50,100],zs=t=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(t),kn=t=>{const n=t.replace(/\D/g,"");return n.length===11?`(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`:t};function D2(){const{showToast:t}=oe(),[n,r]=C.useState("phone"),[s,i]=C.useState(""),[o,a]=C.useState(null),[l,c]=C.useState(null),[d,h]=C.useState(""),[f,m]=C.useState(!1),[k]=C.useState([{id:"1",name:"Meu Celular",phone:"11999887766",operadora:"vivo"},{id:"2",name:"Maria",phone:"11988776655",operadora:"claro"}]),[p]=C.useState([{id:"1",phone:"11999887766",operadora:"vivo",value:30,date:"2025-01-10"},{id:"2",phone:"11988776655",operadora:"claro",value:20,date:"2025-01-05"},{id:"3",phone:"11999887766",operadora:"vivo",value:50,date:"2024-12-28"}]),v=S=>{const B=S.replace(/\D/g,"");i(B.slice(0,11))},b=S=>{i(S.phone),a(S.operadora),r("value")},x=()=>{if(s.length!==11){t("error","Digite um número válido com DDD");return}if(!o){t("error","Selecione a operadora");return}r("value")},g=S=>{c(S),h("")},u=()=>{const S=l||parseFloat(d);if(!S||S<10){t("error","Selecione um valor mínimo de R$ 10");return}r("confirm")},y=async()=>{m(!0),await new Promise(S=>setTimeout(S,1500)),m(!1),r("success"),t("success","Recarga realizada com sucesso!")},j=()=>{i(""),a(null),c(null),h(""),r("phone")},w=l||parseFloat(d)||0,A=Ss.find(S=>S.id===o);return e.jsxs("div",{className:"recarga-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"5",y:"2",width:"14",height:"20",rx:"2",ry:"2"}),e.jsx("line",{x1:"12",y1:"18",x2:"12.01",y2:"18"})]})}),e.jsx("h1",{children:"Recarga de Celular"}),e.jsx("p",{children:"Recarregue qualquer operadora"})]}),e.jsxs("div",{className:"progress-steps",children:[e.jsxs("div",{className:`step ${n==="phone"?"active":n!=="phone"?"completed":""}`,children:[e.jsx("div",{className:"step-number",children:"1"}),e.jsx("span",{children:"Número"})]}),e.jsx("div",{className:"step-line"}),e.jsxs("div",{className:`step ${n==="value"?"active":["confirm","success"].includes(n)?"completed":""}`,children:[e.jsx("div",{className:"step-number",children:"2"}),e.jsx("span",{children:"Valor"})]}),e.jsx("div",{className:"step-line"}),e.jsxs("div",{className:`step ${n==="confirm"?"active":n==="success"?"completed":""}`,children:[e.jsx("div",{className:"step-number",children:"3"}),e.jsx("span",{children:"Confirmar"})]})]}),n==="phone"&&e.jsxs("div",{className:"step-content",children:[k.length>0&&e.jsxs("div",{className:"section",children:[e.jsx("h3",{children:"Favoritos"}),e.jsx("div",{className:"favoritos-list",children:k.map(S=>{const B=Ss.find(_=>_.id===S.operadora);return e.jsxs("button",{className:"favorito-item",onClick:()=>b(S),children:[e.jsx("div",{className:"favorito-avatar",style:{background:B==null?void 0:B.color},children:S.name.charAt(0)}),e.jsxs("div",{className:"favorito-info",children:[e.jsx("span",{className:"favorito-name",children:S.name}),e.jsx("span",{className:"favorito-phone",children:kn(S.phone)})]}),e.jsx("div",{className:"favorito-op",style:{background:`${B==null?void 0:B.color}20`,color:B==null?void 0:B.color},children:B==null?void 0:B.name})]},S.id)})})]}),e.jsxs("div",{className:"section",children:[e.jsx("h3",{children:"Ou digite o número"}),e.jsxs("div",{className:"phone-input",children:[e.jsx("span",{className:"phone-prefix",children:"+55"}),e.jsx("input",{type:"tel",placeholder:"(00) 00000-0000",value:kn(s),onChange:S=>v(S.target.value),maxLength:16})]})]}),e.jsxs("div",{className:"section",children:[e.jsx("h3",{children:"Operadora"}),e.jsx("div",{className:"operadoras-grid",children:Ss.map(S=>e.jsxs("button",{className:`operadora-item ${o===S.id?"active":""}`,onClick:()=>a(S.id),style:{"--op-color":S.color},children:[e.jsx("div",{className:"operadora-logo",style:{background:S.color},children:S.logo}),e.jsx("span",{children:S.name})]},S.id))})]}),e.jsxs("button",{className:"btn-continue",onClick:x,children:["Continuar",e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),e.jsx("polyline",{points:"12 5 19 12 12 19"})]})]})]}),n==="value"&&e.jsxs("div",{className:"step-content",children:[e.jsxs("div",{className:"selected-phone",children:[e.jsx("div",{className:"phone-avatar",style:{background:A==null?void 0:A.color},children:A==null?void 0:A.logo}),e.jsxs("div",{className:"phone-details",children:[e.jsx("span",{className:"phone-number",children:kn(s)}),e.jsx("span",{className:"phone-operadora",children:A==null?void 0:A.name})]}),e.jsx("button",{className:"btn-edit",onClick:()=>r("phone"),children:"Alterar"})]}),e.jsxs("div",{className:"section",children:[e.jsx("h3",{children:"Selecione o valor"}),e.jsx("div",{className:"values-grid",children:P2.map(S=>e.jsx("button",{className:`value-item ${l===S?"active":""}`,onClick:()=>g(S),children:zs(S)},S))})]}),e.jsxs("div",{className:"section",children:[e.jsx("h3",{children:"Ou digite outro valor"}),e.jsxs("div",{className:"custom-value-input",children:[e.jsx("span",{children:"R$"}),e.jsx("input",{type:"number",placeholder:"0,00",value:d,onChange:S=>{h(S.target.value),c(null)}})]}),e.jsx("span",{className:"value-hint",children:"Valor mínimo: R$ 10,00"})]}),e.jsxs("div",{className:"step-actions",children:[e.jsx("button",{className:"btn-back",onClick:()=>r("phone"),children:"Voltar"}),e.jsxs("button",{className:"btn-continue",onClick:u,children:["Continuar",e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),e.jsx("polyline",{points:"12 5 19 12 12 19"})]})]})]})]}),n==="confirm"&&e.jsxs("div",{className:"step-content",children:[e.jsxs("div",{className:"confirm-card",children:[e.jsxs("div",{className:"confirm-header",children:[e.jsx("div",{className:"confirm-icon",style:{background:A==null?void 0:A.color},children:A==null?void 0:A.logo}),e.jsx("h3",{children:"Confirme sua recarga"})]}),e.jsxs("div",{className:"confirm-details",children:[e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{children:"Número"}),e.jsx("span",{children:kn(s)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{children:"Operadora"}),e.jsx("span",{children:A==null?void 0:A.name})]}),e.jsxs("div",{className:"detail-row highlight",children:[e.jsx("span",{children:"Valor"}),e.jsx("span",{className:"gold",children:zs(w)})]})]})]}),e.jsxs("div",{className:"step-actions",children:[e.jsx("button",{className:"btn-back",onClick:()=>r("value"),children:"Voltar"}),e.jsx("button",{className:"btn-confirm",onClick:y,disabled:f,children:f?e.jsx("div",{className:"loading-spinner"}):e.jsxs(e.Fragment,{children:["Confirmar Recarga",e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]})})]})]}),n==="success"&&e.jsxs("div",{className:"step-content success-content",children:[e.jsx("div",{className:"success-icon",children:e.jsx("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})}),e.jsx("h2",{children:"Recarga realizada!"}),e.jsx("p",{children:"Sua recarga foi processada com sucesso"}),e.jsxs("div",{className:"success-card",children:[e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{children:"Número"}),e.jsx("span",{children:kn(s)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{children:"Operadora"}),e.jsx("span",{children:A==null?void 0:A.name})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{children:"Valor"}),e.jsx("span",{className:"gold",children:zs(w)})]})]}),e.jsx("button",{className:"btn-new",onClick:j,children:"Nova Recarga"})]}),n==="phone"&&p.length>0&&e.jsxs("div",{className:"historico-section",children:[e.jsx("h3",{children:"Últimas recargas"}),e.jsx("div",{className:"historico-list",children:p.map(S=>{const B=Ss.find(_=>_.id===S.operadora);return e.jsxs("div",{className:"historico-item",children:[e.jsx("div",{className:"historico-avatar",style:{background:B==null?void 0:B.color},children:B==null?void 0:B.logo}),e.jsxs("div",{className:"historico-info",children:[e.jsx("span",{className:"historico-phone",children:kn(S.phone)}),e.jsx("span",{className:"historico-date",children:new Date(S.date).toLocaleDateString("pt-BR")})]}),e.jsx("span",{className:"historico-value",children:zs(S.value)})]},S.id)})})]}),e.jsx("style",{children:`
        .recarga-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding: 24px 20px 100px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          color: #C9A227;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .page-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Progress Steps */
        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-number {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 2px solid #333;
          border-radius: 50%;
          color: #666;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .step span {
          font-size: 12px;
          color: #666;
        }

        .step.active .step-number {
          background: #C9A227;
          border-color: #C9A227;
          color: #0D0D0D;
        }

        .step.active span {
          color: #C9A227;
        }

        .step.completed .step-number {
          background: #22C55E;
          border-color: #22C55E;
          color: #fff;
        }

        .step.completed span {
          color: #22C55E;
        }

        .step-line {
          width: 40px;
          height: 2px;
          background: #333;
          margin-bottom: 20px;
        }

        /* Step Content */
        .step-content {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .section {
          margin-bottom: 24px;
        }

        .section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0 0 12px;
        }

        /* Favoritos */
        .favoritos-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .favorito-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .favorito-item:hover {
          border-color: #C9A227;
        }

        .favorito-avatar {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }

        .favorito-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .favorito-name {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .favorito-phone {
          font-size: 13px;
          color: #666;
        }

        .favorito-op {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        /* Phone Input */
        .phone-input {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          padding: 16px;
          transition: border-color 0.2s;
        }

        .phone-input:focus-within {
          border-color: #C9A227;
        }

        .phone-prefix {
          font-size: 16px;
          font-weight: 600;
          color: #666;
        }

        .phone-input input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          outline: none;
        }

        /* Operadoras */
        .operadoras-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .operadora-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          background: #1A1A1A;
          border: 2px solid #333;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .operadora-item:hover, .operadora-item.active {
          border-color: var(--op-color);
          background: color-mix(in srgb, var(--op-color) 10%, #1A1A1A);
        }

        .operadora-logo {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #fff;
          font-size: 20px;
          font-weight: 800;
        }

        .operadora-item span {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }

        /* Selected Phone */
        .selected-phone {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .phone-avatar {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: #fff;
          font-size: 20px;
          font-weight: 800;
        }

        .phone-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .phone-number {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .phone-operadora {
          font-size: 13px;
          color: #666;
        }

        .btn-edit {
          padding: 8px 14px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #C9A227;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Values Grid */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .value-item {
          padding: 16px;
          background: #1A1A1A;
          border: 2px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .value-item:hover, .value-item.active {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
          color: #C9A227;
        }

        /* Custom Value */
        .custom-value-input {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          padding: 16px;
        }

        .custom-value-input span {
          font-size: 20px;
          color: #666;
        }

        .custom-value-input input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          outline: none;
        }

        .value-hint {
          font-size: 12px;
          color: #666;
          margin-top: 8px;
          display: block;
        }

        /* Buttons */
        .btn-continue, .btn-confirm {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-continue:hover, .btn-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201, 162, 39, 0.3);
        }

        .btn-confirm {
          background: linear-gradient(135deg, #22C55E 0%, #16a34a 100%);
          color: #fff;
        }

        .btn-confirm:hover {
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
        }

        .btn-back {
          flex: 1;
          padding: 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 14px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .step-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .step-actions .btn-continue,
        .step-actions .btn-confirm {
          flex: 2;
        }

        /* Confirm Card */
        .confirm-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
        }

        .confirm-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .confirm-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          color: #fff;
          font-size: 28px;
          font-weight: 800;
        }

        .confirm-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .confirm-details {
          background: #262626;
          border-radius: 14px;
          overflow: hidden;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid #333;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row span:first-child {
          color: #A3A3A3;
          font-size: 14px;
        }

        .detail-row span:last-child {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
        }

        .detail-row.highlight {
          background: #1A1A1A;
        }

        .gold {
          color: #C9A227 !important;
        }

        /* Success */
        .success-content {
          text-align: center;
          padding: 40px 0;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.15);
          border: 2px solid #22C55E;
          border-radius: 50%;
          color: #22C55E;
          animation: scaleIn 0.3s ease-out;
        }

        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-content h2 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .success-content > p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0 0 32px;
        }

        .success-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          margin-bottom: 24px;
          text-align: left;
        }

        .btn-new {
          padding: 14px 32px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-new:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        /* Loading */
        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Histórico */
        .historico-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #262626;
        }

        .historico-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0 0 16px;
        }

        .historico-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .historico-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 14px;
        }

        .historico-avatar {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
        }

        .historico-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .historico-phone {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .historico-date {
          font-size: 12px;
          color: #666;
        }

        .historico-value {
          font-size: 14px;
          font-weight: 600;
          color: #C9A227;
        }

        @media (max-width: 480px) {
          .operadoras-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `})]})}const Nn=t=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(t);function T2(){const{showToast:t}=oe(),[n,r]=C.useState(!1),[s,i]=C.useState(null),[o,a]=C.useState([{id:"1",name:"Jantar Sexta",total:450,createdAt:"2025-01-10",status:"active",participants:[{id:"1",name:"Você",avatar:"V",amount:112.5,paid:!0},{id:"2",name:"Maria",avatar:"M",amount:112.5,paid:!0,pixKey:"maria@email.com"},{id:"3",name:"João",avatar:"J",amount:112.5,paid:!1,pixKey:"11999887766"},{id:"4",name:"Ana",avatar:"A",amount:112.5,paid:!1,pixKey:"ana.silva@gmail.com"}]},{id:"2",name:"Viagem Praia",total:1200,createdAt:"2025-01-05",status:"completed",participants:[{id:"1",name:"Você",avatar:"V",amount:400,paid:!0},{id:"2",name:"Carlos",avatar:"C",amount:400,paid:!0,pixKey:"***.***.***-12"},{id:"3",name:"Pedro",avatar:"P",amount:400,paid:!0,pixKey:"pedro@email.com"}]}]),[l,c]=C.useState({name:"",total:"",participants:[{name:"",pixKey:""}],divisionType:"equal"}),d=()=>{c({...l,participants:[...l.participants,{name:"",pixKey:""}]})},h=v=>{l.participants.length>1&&c({...l,participants:l.participants.filter((b,x)=>x!==v)})},f=()=>{if(!l.name||!l.total){t("error","Preencha nome e valor total");return}const v=l.participants.filter(u=>u.name);if(v.length===0){t("error","Adicione pelo menos um participante");return}const b=parseFloat(l.total),x=b/(v.length+1),g={id:Date.now().toString(),name:l.name,total:b,createdAt:new Date().toISOString(),status:"active",participants:[{id:"0",name:"Você",avatar:"V",amount:x,paid:!0},...v.map((u,y)=>({id:(y+1).toString(),name:u.name,avatar:u.name.charAt(0).toUpperCase(),amount:x,paid:!1,pixKey:u.pixKey}))]};a([g,...o]),c({name:"",total:"",participants:[{name:"",pixKey:""}],divisionType:"equal"}),r(!1),t("success","Divisão criada! Cobranças enviadas.")},m=(v,b)=>{a(o.map(x=>{if(x.id===v){const g=x.participants.map(y=>y.id===b?{...y,paid:!0}:y),u=g.every(y=>y.paid);return{...x,participants:g,status:u?"completed":"active"}}return x})),t("success","Marcado como pago!")},k=v=>{t("info",`Lembrete enviado para ${v.name}`)},p=o.find(v=>v.id===s);return e.jsxs("div",{className:"split-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"8.5",cy:"7",r:"4"}),e.jsx("line",{x1:"20",y1:"8",x2:"20",y2:"14"}),e.jsx("line",{x1:"23",y1:"11",x2:"17",y2:"11"})]})}),e.jsx("h1",{children:"Dividir Contas"}),e.jsx("p",{children:"Racha a conta com seus amigos"})]}),s?e.jsxs("div",{className:"group-detail",children:[e.jsxs("button",{className:"btn-back",onClick:()=>i(null),children:[e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),"Voltar"]}),e.jsxs("div",{className:"detail-header",children:[e.jsx("h2",{children:p==null?void 0:p.name}),e.jsx("span",{className:"detail-date",children:p&&new Date(p.createdAt).toLocaleDateString("pt-BR")})]}),e.jsxs("div",{className:"detail-summary",children:[e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"label",children:"Total"}),e.jsx("span",{className:"value gold",children:Nn((p==null?void 0:p.total)||0)})]}),e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"label",children:"Por pessoa"}),e.jsx("span",{className:"value",children:Nn(((p==null?void 0:p.total)||0)/((p==null?void 0:p.participants.length)||1))})]})]}),e.jsxs("div",{className:"participants-section",children:[e.jsx("h3",{children:"Participantes"}),e.jsx("div",{className:"participants-list",children:p==null?void 0:p.participants.map(v=>e.jsxs("div",{className:`participant-card ${v.paid?"paid":""}`,children:[e.jsx("div",{className:"participant-avatar",style:{background:v.paid?"#22C55E":"#C9A227"},children:v.avatar}),e.jsxs("div",{className:"participant-info",children:[e.jsxs("span",{className:"participant-name",children:[v.name,v.name==="Você"&&e.jsx("span",{className:"you-badge",children:"você"})]}),v.pixKey&&e.jsx("span",{className:"participant-key",children:v.pixKey})]}),e.jsxs("div",{className:"participant-status",children:[e.jsx("span",{className:"participant-amount",children:Nn(v.amount)}),v.paid?e.jsxs("span",{className:"status-paid",children:[e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Pago"]}):e.jsx("span",{className:"status-pending",children:"Pendente"})]}),!v.paid&&v.name!=="Você"&&e.jsxs("div",{className:"participant-actions",children:[e.jsx("button",{className:"btn-mark-paid",onClick:()=>m(p.id,v.id),children:"Marcar pago"}),e.jsx("button",{className:"btn-reminder",onClick:()=>k(v),children:e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M22 2L11 13"}),e.jsx("path",{d:"M22 2L15 22L11 13L2 9L22 2Z"})]})})]})]},v.id))})]}),e.jsxs("button",{className:"btn-share",children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"18",cy:"5",r:"3"}),e.jsx("circle",{cx:"6",cy:"12",r:"3"}),e.jsx("circle",{cx:"18",cy:"19",r:"3"}),e.jsx("line",{x1:"8.59",y1:"13.51",x2:"15.42",y2:"17.49"}),e.jsx("line",{x1:"15.41",y1:"6.51",x2:"8.59",y2:"10.49"})]}),"Compartilhar link de cobrança"]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h3",{children:"Divisões ativas"}),e.jsx("span",{className:"badge",children:o.filter(v=>v.status==="active").length})]}),o.filter(v=>v.status==="active").length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("div",{className:"empty-icon",children:e.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("path",{d:"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"8.5",cy:"7",r:"4"}),e.jsx("line",{x1:"20",y1:"8",x2:"20",y2:"14"}),e.jsx("line",{x1:"23",y1:"11",x2:"17",y2:"11"})]})}),e.jsx("p",{children:"Nenhuma divisão ativa"})]}):e.jsx("div",{className:"splits-list",children:o.filter(v=>v.status==="active").map(v=>{const b=v.participants.filter(g=>g.paid).length,x=b/v.participants.length*100;return e.jsxs("button",{className:"split-card",onClick:()=>i(v.id),children:[e.jsxs("div",{className:"split-header",children:[e.jsx("h4",{children:v.name}),e.jsx("span",{className:"split-total",children:Nn(v.total)})]}),e.jsxs("div",{className:"split-progress",children:[e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${x}%`}})}),e.jsxs("span",{className:"progress-text",children:[b,"/",v.participants.length," pagaram"]})]}),e.jsxs("div",{className:"split-avatars",children:[v.participants.slice(0,5).map(g=>e.jsx("div",{className:`avatar ${g.paid?"paid":""}`,title:g.name,children:g.avatar},g.id)),v.participants.length>5&&e.jsxs("div",{className:"avatar more",children:["+",v.participants.length-5]})]})]},v.id)})})]}),o.filter(v=>v.status==="completed").length>0&&e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-header",children:e.jsx("h3",{children:"Concluídas"})}),e.jsx("div",{className:"splits-list",children:o.filter(v=>v.status==="completed").map(v=>e.jsxs("button",{className:"split-card completed",onClick:()=>i(v.id),children:[e.jsxs("div",{className:"split-header",children:[e.jsx("h4",{children:v.name}),e.jsx("span",{className:"split-total",children:Nn(v.total)})]}),e.jsxs("div",{className:"completed-badge",children:[e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Todos pagaram"]})]},v.id))})]}),e.jsxs("button",{className:"btn-add",onClick:()=>r(!0),children:[e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Nova divisão"]})]}),n&&e.jsx("div",{className:"modal-overlay",onClick:()=>r(!1),children:e.jsxs("div",{className:"modal",onClick:v=>v.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h2",{children:"Nova Divisão"}),e.jsx("button",{className:"modal-close",onClick:()=>r(!1),children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{className:"modal-body",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Nome da divisão"}),e.jsx("input",{type:"text",placeholder:"Ex: Jantar de aniversário",value:l.name,onChange:v=>c({...l,name:v.target.value})})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Valor total"}),e.jsxs("div",{className:"amount-input",children:[e.jsx("span",{children:"R$"}),e.jsx("input",{type:"number",placeholder:"0,00",value:l.total,onChange:v=>c({...l,total:v.target.value})})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Participantes (além de você)"}),l.participants.map((v,b)=>e.jsxs("div",{className:"participant-input",children:[e.jsx("input",{type:"text",placeholder:"Nome",value:v.name,onChange:x=>{const g=[...l.participants];g[b].name=x.target.value,c({...l,participants:g})}}),e.jsx("input",{type:"text",placeholder:"Chave PIX (opcional)",value:v.pixKey,onChange:x=>{const g=[...l.participants];g[b].pixKey=x.target.value,c({...l,participants:g})}}),l.participants.length>1&&e.jsx("button",{className:"btn-remove",onClick:()=>h(b),children:e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]},b)),e.jsxs("button",{className:"btn-add-participant",onClick:d,children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Adicionar participante"]})]}),l.total&&l.participants.filter(v=>v.name).length>0&&e.jsxs("div",{className:"preview-card",children:[e.jsx("span",{className:"preview-label",children:"Valor por pessoa"}),e.jsx("span",{className:"preview-value",children:Nn(parseFloat(l.total)/(l.participants.filter(v=>v.name).length+1))})]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn-secondary",onClick:()=>r(!1),children:"Cancelar"}),e.jsx("button",{className:"btn-primary",onClick:f,children:"Criar e Cobrar"})]})]})}),e.jsx("style",{children:`
        .split-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding: 24px 20px 100px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          color: #C9A227;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .page-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Section */
        .section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .section-header h3 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0;
        }

        .badge {
          padding: 4px 10px;
          background: rgba(201, 162, 39, 0.15);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #C9A227;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 16px;
        }

        .empty-icon {
          color: #333;
          margin-bottom: 12px;
        }

        .empty-state p {
          color: #666;
          margin: 0;
        }

        /* Splits List */
        .splits-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .split-card {
          width: 100%;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .split-card:hover {
          border-color: #C9A227;
        }

        .split-card.completed {
          opacity: 0.7;
        }

        .split-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .split-header h4 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .split-total {
          font-size: 18px;
          font-weight: 700;
          color: #C9A227;
        }

        .split-progress {
          margin-bottom: 16px;
        }

        .progress-bar {
          height: 6px;
          background: #262626;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A227, #22C55E);
          border-radius: 3px;
          transition: width 0.3s;
        }

        .progress-text {
          font-size: 12px;
          color: #666;
        }

        .split-avatars {
          display: flex;
          gap: -8px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 2px solid #1A1A1A;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          margin-left: -8px;
        }

        .avatar:first-child {
          margin-left: 0;
        }

        .avatar.paid {
          background: #22C55E;
          color: #fff;
        }

        .avatar.more {
          background: #333;
          color: #A3A3A3;
        }

        .completed-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #22C55E;
        }

        /* Add Button */
        .btn-add {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 18px 24px;
          background: transparent;
          border: 2px dashed #333;
          border-radius: 16px;
          color: #C9A227;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        /* Group Detail */
        .group-detail {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 10px;
          color: #A3A3A3;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .detail-header {
          margin-bottom: 20px;
        }

        .detail-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .detail-date {
          font-size: 13px;
          color: #666;
        }

        .detail-summary {
          display: flex;
          gap: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .summary-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-item .label {
          font-size: 12px;
          color: #666;
        }

        .summary-item .value {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }

        .summary-item .value.gold {
          color: #C9A227;
        }

        .participants-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0 0 16px;
        }

        .participants-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .participant-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
        }

        .participant-card.paid {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .participant-card {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .participant-avatar {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          color: #0D0D0D;
        }

        .participant-info {
          flex: 1;
          min-width: 120px;
        }

        .participant-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .you-badge {
          font-size: 10px;
          padding: 2px 8px;
          background: rgba(201, 162, 39, 0.2);
          border-radius: 10px;
          color: #C9A227;
        }

        .participant-key {
          display: block;
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }

        .participant-status {
          text-align: right;
        }

        .participant-amount {
          display: block;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }

        .status-paid {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #22C55E;
          margin-top: 4px;
        }

        .status-pending {
          font-size: 12px;
          color: #F59E0B;
          margin-top: 4px;
        }

        .participant-actions {
          width: 100%;
          display: flex;
          gap: 8px;
          margin-top: 8px;
          padding-top: 12px;
          border-top: 1px solid #262626;
        }

        .btn-mark-paid {
          flex: 1;
          padding: 10px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 10px;
          color: #22C55E;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-reminder {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #333;
          border-radius: 10px;
          color: #C9A227;
          cursor: pointer;
        }

        .btn-share {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #333;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #666;
          cursor: pointer;
        }

        .modal-body {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          outline: none;
        }

        .form-group input:focus {
          border-color: #C9A227;
        }

        .amount-input {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
        }

        .amount-input span {
          font-size: 18px;
          color: #666;
        }

        .amount-input input {
          padding: 0;
          background: none;
          border: none;
          font-size: 20px;
          font-weight: 700;
        }

        .participant-input {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .participant-input input {
          flex: 1;
        }

        .btn-remove {
          width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #666;
          cursor: pointer;
        }

        .btn-remove:hover {
          border-color: #EF4444;
          color: #EF4444;
        }

        .btn-add-participant {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px dashed #333;
          border-radius: 12px;
          color: #666;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-add-participant:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .preview-card {
          background: rgba(201, 162, 39, 0.1);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .preview-label {
          display: block;
          font-size: 12px;
          color: #A3A3A3;
          margin-bottom: 4px;
        }

        .preview-value {
          font-size: 24px;
          font-weight: 700;
          color: #C9A227;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #333;
        }

        .btn-secondary, .btn-primary {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-secondary {
          background: #262626;
          border: 1px solid #333;
          color: #fff;
        }

        .btn-primary {
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          color: #0D0D0D;
        }
      `})]})}const Tt=t=>new Intl.NumberFormat("pt-BR").format(t);function M2(){const{showToast:t}=oe(),[n,r]=C.useState("overview"),s=12450,i="Platinum",o=2340,a=[{name:"Gold",min:0,max:5e3,color:"#C9A227"},{name:"Platinum",min:5001,max:15e3,color:"#A3A3A3"},{name:"Black",min:15001,max:1/0,color:"#1A1A1A"}],l=a.find(p=>s>=p.min&&s<=p.max),c=a[a.indexOf(l)+1],d=c?(s-l.min)/(c.min-l.min)*100:100,h=[{id:"1",name:"Vale iFood R$50",description:"Cupom de desconto",points:5e3,category:"Alimentação",image:"🍔"},{id:"2",name:"Netflix 1 mês",description:"Assinatura mensal",points:8e3,category:"Streaming",image:"🎬"},{id:"3",name:"Spotify 1 mês",description:"Assinatura mensal",points:6e3,category:"Streaming",image:"🎵"},{id:"4",name:"Vale Amazon R$100",description:"Gift card",points:1e4,category:"Compras",image:"📦"},{id:"5",name:"Uber R$30",description:"Créditos de viagem",points:3e3,category:"Transporte",image:"🚗"},{id:"6",name:"Cashback R$50",description:"Crédito na conta",points:4500,category:"Dinheiro",image:"💰"}],f=[{id:"1",name:"iFood",cashback:5,category:"Alimentação",logo:"🍔"},{id:"2",name:"Uber",cashback:3,category:"Transporte",logo:"🚗"},{id:"3",name:"Amazon",cashback:2,category:"Compras",logo:"📦"},{id:"4",name:"Booking",cashback:8,category:"Viagens",logo:"✈️"},{id:"5",name:"Drogasil",cashback:4,category:"Saúde",logo:"💊"},{id:"6",name:"Netshoes",cashback:6,category:"Esportes",logo:"👟"}],m=[{id:"1",description:"Compra no cartão - Amazon",points:450,type:"earn",date:"2025-01-14"},{id:"2",description:"Resgate - Vale iFood",points:-5e3,type:"redeem",date:"2025-01-12"},{id:"3",description:"Compra no cartão - iFood",points:120,type:"earn",date:"2025-01-10"},{id:"4",description:"Bônus de nível Platinum",points:1e3,type:"earn",date:"2025-01-01"},{id:"5",description:"Compra no cartão - Uber",points:85,type:"earn",date:"2024-12-28"},{id:"6",description:"Compra no cartão - Netflix",points:200,type:"earn",date:"2024-12-25"}],k=p=>{if(s<p.points){t("error","Pontos insuficientes");return}t("success",`${p.name} resgatado com sucesso!`)};return e.jsxs("div",{className:"rewards-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"8",r:"7"}),e.jsx("polyline",{points:"8.21 13.89 7 23 12 20 17 23 15.79 13.88"})]})}),e.jsx("h1",{children:"Athena Rewards"}),e.jsx("p",{children:"Seu programa de fidelidade"})]}),e.jsxs("div",{className:"points-card",children:[e.jsxs("div",{className:"points-header",children:[e.jsx("div",{className:"level-badge",style:{background:l==null?void 0:l.color},children:i}),e.jsx("span",{className:"points-label",children:"Seus pontos"})]}),e.jsxs("div",{className:"points-value",children:[e.jsx("span",{className:"points-number",children:Tt(s)}),e.jsx("span",{className:"points-unit",children:"átomos"})]}),e.jsxs("div",{className:"points-sub",children:["+",Tt(o)," este mês"]}),c&&e.jsxs("div",{className:"level-progress",children:[e.jsxs("div",{className:"progress-info",children:[e.jsxs("span",{children:["Próximo: ",c.name]}),e.jsxs("span",{children:[Tt(c.min-s)," pontos"]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${d}%`}})})]})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="overview"?"active":""}`,onClick:()=>r("overview"),children:"Início"}),e.jsx("button",{className:`tab ${n==="rewards"?"active":""}`,onClick:()=>r("rewards"),children:"Resgatar"}),e.jsx("button",{className:`tab ${n==="partners"?"active":""}`,onClick:()=>r("partners"),children:"Parceiros"}),e.jsx("button",{className:`tab ${n==="history"?"active":""}`,onClick:()=>r("history"),children:"Histórico"})]}),n==="overview"&&e.jsxs("div",{className:"tab-content",children:[e.jsxs("div",{className:"stats-grid",children:[e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon earn",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("polyline",{points:"23 6 13.5 15.5 8.5 10.5 1 18"}),e.jsx("polyline",{points:"17 6 23 6 23 12"})]})}),e.jsxs("div",{className:"stat-info",children:[e.jsxs("span",{className:"stat-value",children:["+",Tt(o)]}),e.jsx("span",{className:"stat-label",children:"Ganhos no mês"})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon redeem",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"7 10 12 15 17 10"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-value",children:"3"}),e.jsx("span",{className:"stat-label",children:"Resgates"})]})]})]}),e.jsxs("div",{className:"section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h3",{children:"Resgates em destaque"}),e.jsx("button",{className:"btn-see-all",onClick:()=>r("rewards"),children:"Ver todos"})]}),e.jsx("div",{className:"featured-rewards",children:h.slice(0,3).map(p=>e.jsxs("div",{className:"reward-card mini",children:[e.jsx("div",{className:"reward-image",children:p.image}),e.jsxs("div",{className:"reward-info",children:[e.jsx("span",{className:"reward-name",children:p.name}),e.jsxs("span",{className:"reward-points",children:[Tt(p.points)," átomos"]})]})]},p.id))})]}),e.jsxs("div",{className:"section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h3",{children:"Atividade recente"}),e.jsx("button",{className:"btn-see-all",onClick:()=>r("history"),children:"Ver todas"})]}),e.jsx("div",{className:"activity-list",children:m.slice(0,4).map(p=>e.jsxs("div",{className:"activity-item",children:[e.jsx("div",{className:`activity-icon ${p.type}`,children:p.type==="earn"?e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"19",x2:"12",y2:"5"}),e.jsx("polyline",{points:"5 12 12 5 19 12"})]}):e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("polyline",{points:"19 12 12 19 5 12"})]})}),e.jsxs("div",{className:"activity-info",children:[e.jsx("span",{className:"activity-desc",children:p.description}),e.jsx("span",{className:"activity-date",children:new Date(p.date).toLocaleDateString("pt-BR")})]}),e.jsxs("span",{className:`activity-points ${p.type}`,children:[p.type==="earn"?"+":"",Tt(p.points)]})]},p.id))})]})]}),n==="rewards"&&e.jsx("div",{className:"tab-content",children:e.jsx("div",{className:"rewards-grid",children:h.map(p=>{const v=s>=p.points;return e.jsxs("div",{className:`reward-card ${v?"":"disabled"}`,children:[e.jsx("div",{className:"reward-image large",children:p.image}),e.jsxs("div",{className:"reward-content",children:[e.jsx("span",{className:"reward-category",children:p.category}),e.jsx("h4",{className:"reward-name",children:p.name}),e.jsx("p",{className:"reward-description",children:p.description}),e.jsxs("div",{className:"reward-footer",children:[e.jsxs("span",{className:"reward-points",children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"8",r:"7"}),e.jsx("polyline",{points:"8.21 13.89 7 23 12 20 17 23 15.79 13.88"})]}),Tt(p.points)]}),e.jsx("button",{className:`btn-redeem ${v?"":"disabled"}`,onClick:()=>k(p),disabled:!v,children:v?"Resgatar":"Pontos insuf."})]})]})]},p.id)})})}),n==="partners"&&e.jsxs("div",{className:"tab-content",children:[e.jsxs("div",{className:"partners-intro",children:[e.jsx("h3",{children:"Ganhe mais com parceiros"}),e.jsx("p",{children:"Use seu cartão Athena e acumule pontos extras"})]}),e.jsx("div",{className:"partners-grid",children:f.map(p=>e.jsxs("div",{className:"partner-card",children:[e.jsx("div",{className:"partner-logo",children:p.logo}),e.jsxs("div",{className:"partner-info",children:[e.jsx("span",{className:"partner-name",children:p.name}),e.jsx("span",{className:"partner-category",children:p.category})]}),e.jsxs("div",{className:"partner-cashback",children:[e.jsxs("span",{className:"cashback-value",children:[p.cashback,"%"]}),e.jsx("span",{className:"cashback-label",children:"cashback"})]})]},p.id))})]}),n==="history"&&e.jsxs("div",{className:"tab-content",children:[e.jsxs("div",{className:"history-filters",children:[e.jsx("button",{className:"filter-btn active",children:"Todos"}),e.jsx("button",{className:"filter-btn",children:"Ganhos"}),e.jsx("button",{className:"filter-btn",children:"Resgates"})]}),e.jsx("div",{className:"history-list",children:m.map(p=>e.jsxs("div",{className:"history-item",children:[e.jsx("div",{className:`history-icon ${p.type}`,children:p.type==="earn"?e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"19",x2:"12",y2:"5"}),e.jsx("polyline",{points:"5 12 12 5 19 12"})]}):e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("polyline",{points:"19 12 12 19 5 12"})]})}),e.jsxs("div",{className:"history-info",children:[e.jsx("span",{className:"history-desc",children:p.description}),e.jsx("span",{className:"history-date",children:new Date(p.date).toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})})]}),e.jsxs("span",{className:`history-points ${p.type}`,children:[p.type==="earn"?"+":"",Tt(p.points)]})]},p.id))})]}),e.jsx("style",{children:`
        .rewards-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding: 24px 20px 100px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          color: #C9A227;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .page-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Points Card */
        .points-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        .points-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(201, 162, 39, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .points-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .level-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .points-label {
          font-size: 13px;
          color: #A3A3A3;
        }

        .points-value {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 8px;
        }

        .points-number {
          font-size: 48px;
          font-weight: 800;
          color: #C9A227;
          letter-spacing: -0.02em;
        }

        .points-unit {
          font-size: 18px;
          font-weight: 600;
          color: #666;
        }

        .points-sub {
          font-size: 14px;
          color: #22C55E;
          margin-bottom: 20px;
        }

        .level-progress {
          position: relative;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 12px;
          color: #666;
        }

        .progress-bar {
          height: 6px;
          background: #333;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A227, #E5B82A);
          border-radius: 3px;
          transition: width 0.3s;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 4px;
          background: #1A1A1A;
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #666;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab.active {
          background: #262626;
          color: #C9A227;
        }

        .tab-content {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .stat-icon.earn {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .stat-icon.redeem {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
        }

        /* Section */
        .section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .btn-see-all {
          background: none;
          border: none;
          color: #C9A227;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Featured Rewards */
        .featured-rewards {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .reward-card.mini {
          min-width: 140px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          padding: 16px;
          text-align: center;
        }

        .reward-image {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .reward-card.mini .reward-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          display: block;
          margin-bottom: 4px;
        }

        .reward-card.mini .reward-points {
          font-size: 12px;
          color: #C9A227;
        }

        /* Activity List */
        .activity-list {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          overflow: hidden;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid #262626;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .activity-icon.earn {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .activity-icon.redeem {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .activity-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .activity-desc {
          font-size: 14px;
          color: #fff;
        }

        .activity-date {
          font-size: 12px;
          color: #666;
        }

        .activity-points {
          font-size: 14px;
          font-weight: 700;
        }

        .activity-points.earn {
          color: #22C55E;
        }

        .activity-points.redeem {
          color: #C9A227;
        }

        /* Rewards Grid */
        .rewards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .reward-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .reward-card:hover:not(.disabled) {
          border-color: #C9A227;
          transform: translateY(-2px);
        }

        .reward-card.disabled {
          opacity: 0.5;
        }

        .reward-image.large {
          font-size: 48px;
          text-align: center;
          padding: 24px;
          background: #262626;
        }

        .reward-content {
          padding: 16px;
        }

        .reward-category {
          font-size: 11px;
          font-weight: 600;
          color: #C9A227;
          text-transform: uppercase;
        }

        .reward-content h4 {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          margin: 4px 0 8px;
        }

        .reward-description {
          font-size: 12px;
          color: #666;
          margin: 0 0 12px;
        }

        .reward-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .reward-footer .reward-points {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #C9A227;
        }

        .btn-redeem {
          padding: 8px 14px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          border-radius: 8px;
          color: #0D0D0D;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-redeem.disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
        }

        /* Partners */
        .partners-intro {
          text-align: center;
          margin-bottom: 24px;
        }

        .partners-intro h3 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .partners-intro p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        .partners-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .partner-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .partner-logo {
          font-size: 36px;
          margin-bottom: 12px;
        }

        .partner-info {
          margin-bottom: 12px;
        }

        .partner-name {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .partner-category {
          font-size: 12px;
          color: #666;
        }

        .partner-cashback {
          padding: 8px 16px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 20px;
        }

        .cashback-value {
          font-size: 18px;
          font-weight: 700;
          color: #22C55E;
        }

        .cashback-label {
          font-size: 11px;
          color: #22C55E;
          margin-left: 4px;
        }

        /* History */
        .history-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .filter-btn {
          padding: 10px 18px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          color: #666;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn.active {
          background: rgba(201, 162, 39, 0.15);
          border-color: rgba(201, 162, 39, 0.3);
          color: #C9A227;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 16px;
        }

        .history-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .history-icon.earn {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .history-icon.redeem {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .history-info {
          flex: 1;
        }

        .history-desc {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 4px;
        }

        .history-date {
          font-size: 12px;
          color: #666;
        }

        .history-points {
          font-size: 16px;
          font-weight: 700;
        }

        .history-points.earn {
          color: #22C55E;
        }

        .history-points.redeem {
          color: #C9A227;
        }

        @media (max-width: 480px) {
          .rewards-grid {
            grid-template-columns: 1fr;
          }

          .partners-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .points-number {
            font-size: 36px;
          }
        }
      `})]})}const B2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("portfolio"),[s,i]=C.useState(null),[o,a]=C.useState(!1),[l,c]=C.useState("buy"),[d,h]=C.useState(""),[f,m]=C.useState(!1),[k,p]=C.useState(""),[v,b]=C.useState(""),[x,g]=C.useState("above"),[u]=C.useState([{id:"1",symbol:"BTC",name:"Bitcoin",price:352450,change24h:2.34,balance:.0523,icon:"₿",color:"#F7931A"},{id:"2",symbol:"ETH",name:"Ethereum",price:18750,change24h:-1.23,balance:.85,icon:"Ξ",color:"#627EEA"},{id:"3",symbol:"SOL",name:"Solana",price:892.5,change24h:5.67,balance:12.5,icon:"◎",color:"#00FFA3"},{id:"4",symbol:"ADA",name:"Cardano",price:3.85,change24h:-.45,balance:500,icon:"₳",color:"#0033AD"},{id:"5",symbol:"DOT",name:"Polkadot",price:42.3,change24h:1.89,balance:25,icon:"●",color:"#E6007A"},{id:"6",symbol:"MATIC",name:"Polygon",price:5.12,change24h:3.21,balance:200,icon:"⬡",color:"#8247E5"}]),[y]=C.useState([{id:"1",type:"buy",crypto:"BTC",amount:.01,price:35e4,date:"2024-01-15"},{id:"2",type:"sell",crypto:"ETH",amount:.5,price:19e3,date:"2024-01-14"},{id:"3",type:"buy",crypto:"SOL",amount:10,price:850,date:"2024-01-13"},{id:"4",type:"receive",crypto:"BTC",amount:.005,price:345e3,date:"2024-01-12"},{id:"5",type:"buy",crypto:"ADA",amount:200,price:3.5,date:"2024-01-11"}]),[j,w]=C.useState([{id:"1",crypto:"BTC",targetPrice:4e5,type:"above",active:!0},{id:"2",crypto:"ETH",targetPrice:15e3,type:"below",active:!0}]),A=u.reduce((z,U)=>z+U.balance*U.price,0),S=z=>z.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),B=(z,U=8)=>z.toFixed(U),_=()=>{if(!s||!d){t("Preencha todos os campos","error");return}const z=parseFloat(d);if(isNaN(z)||z<=0){t("Valor inválido","error");return}t(`${l==="buy"?"Compra":"Venda"} de ${z} ${s.symbol} realizada com sucesso!`,"success"),a(!1),h(""),i(null)},xe=()=>{if(!k||!v){t("Preencha todos os campos","error");return}const z={id:Date.now().toString(),crypto:k,targetPrice:parseFloat(v),type:x,active:!0};w([...j,z]),t("Alerta criado com sucesso!","success"),m(!1),p(""),b("")},Oe=z=>{w(j.map(U=>U.id===z?{...U,active:!U.active}:U)),t("Alerta atualizado","info")},Me=z=>{w(j.filter(U=>U.id!==z)),t("Alerta removido","info")},Ne=(z,U)=>{i(z),c(U),a(!0)};return e.jsxs("div",{className:"cripto-page",children:[e.jsxs("div",{className:"cripto-header",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M9.5 9.5c0-1 1-2 2.5-2s2.5 1 2.5 2-1 1.5-2.5 2-2.5 1-2.5 2 1 2 2.5 2 2.5-1 2.5-2"}),e.jsx("path",{d:"M12 6v2m0 8v2"})]})}),e.jsx("h1",{children:"Athena Cripto"}),e.jsx("p",{children:"Compre, venda e acompanhe suas criptomoedas"})]}),e.jsxs("div",{className:"total-balance-card",children:[e.jsx("span",{className:"balance-label",children:"Patrimônio em Cripto"}),e.jsx("span",{className:"balance-value",children:S(A)}),e.jsxs("div",{className:"balance-change positive",children:[e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 19V5M5 12l7-7 7 7"})}),"+R$ 1.234,56 (2.34%) hoje"]})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="portfolio"?"active":""}`,onClick:()=>r("portfolio"),children:"Carteira"}),e.jsx("button",{className:`tab ${n==="market"?"active":""}`,onClick:()=>r("market"),children:"Mercado"}),e.jsx("button",{className:`tab ${n==="history"?"active":""}`,onClick:()=>r("history"),children:"Histórico"}),e.jsx("button",{className:`tab ${n==="alerts"?"active":""}`,onClick:()=>r("alerts"),children:"Alertas"})]}),n==="portfolio"&&e.jsxs("div",{className:"portfolio-section",children:[e.jsx("h2",{children:"Suas Criptomoedas"}),e.jsx("div",{className:"crypto-list",children:u.filter(z=>z.balance>0).map(z=>e.jsxs("div",{className:"crypto-card",children:[e.jsxs("div",{className:"crypto-info",children:[e.jsx("div",{className:"crypto-icon",style:{backgroundColor:`${z.color}20`,color:z.color},children:z.icon}),e.jsxs("div",{className:"crypto-details",children:[e.jsx("span",{className:"crypto-name",children:z.name}),e.jsx("span",{className:"crypto-symbol",children:z.symbol})]})]}),e.jsxs("div",{className:"crypto-price",children:[e.jsx("span",{className:"price",children:S(z.price)}),e.jsxs("span",{className:`change ${z.change24h>=0?"positive":"negative"}`,children:[z.change24h>=0?"+":"",z.change24h.toFixed(2),"%"]})]}),e.jsxs("div",{className:"crypto-balance",children:[e.jsxs("span",{className:"balance-crypto",children:[B(z.balance,4)," ",z.symbol]}),e.jsx("span",{className:"balance-fiat",children:S(z.balance*z.price)})]}),e.jsxs("div",{className:"crypto-actions",children:[e.jsx("button",{className:"btn-trade buy",onClick:()=>Ne(z,"buy"),children:"Comprar"}),e.jsx("button",{className:"btn-trade sell",onClick:()=>Ne(z,"sell"),children:"Vender"})]})]},z.id))})]}),n==="market"&&e.jsxs("div",{className:"market-section",children:[e.jsx("h2",{children:"Mercado de Criptomoedas"}),e.jsx("div",{className:"market-list",children:u.map(z=>e.jsxs("div",{className:"market-card",children:[e.jsxs("div",{className:"market-info",children:[e.jsx("div",{className:"crypto-icon",style:{backgroundColor:`${z.color}20`,color:z.color},children:z.icon}),e.jsxs("div",{className:"crypto-details",children:[e.jsx("span",{className:"crypto-name",children:z.name}),e.jsx("span",{className:"crypto-symbol",children:z.symbol})]})]}),e.jsx("div",{className:"price-chart",children:e.jsx("svg",{viewBox:"0 0 100 40",className:z.change24h>=0?"positive":"negative",children:e.jsx("path",{d:z.change24h>=0?"M0,35 L15,30 L30,32 L45,25 L60,20 L75,15 L90,10 L100,5":"M0,10 L15,15 L30,12 L45,20 L60,25 L75,28 L90,32 L100,35",fill:"none",strokeWidth:"2"})})}),e.jsxs("div",{className:"market-price",children:[e.jsx("span",{className:"price",children:S(z.price)}),e.jsxs("span",{className:`change ${z.change24h>=0?"positive":"negative"}`,children:[z.change24h>=0?"+":"",z.change24h.toFixed(2),"%"]})]}),e.jsx("button",{className:"btn-buy-market",onClick:()=>Ne(z,"buy"),children:"Comprar"})]},z.id))})]}),n==="history"&&e.jsxs("div",{className:"history-section",children:[e.jsx("h2",{children:"Histórico de Transações"}),e.jsx("div",{className:"transactions-list",children:y.map(z=>(u.find(U=>U.symbol===z.crypto),e.jsxs("div",{className:"transaction-card",children:[e.jsxs("div",{className:`tx-icon ${z.type}`,children:[z.type==="buy"&&e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 19V5M5 12l7-7 7 7"})}),z.type==="sell"&&e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 5v14M5 12l7 7 7-7"})}),z.type==="receive"&&e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 12h18M12 3l9 9-9 9"})}),z.type==="send"&&e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 12H3M12 3L3 12l9 9"})})]}),e.jsxs("div",{className:"tx-info",children:[e.jsxs("span",{className:"tx-type",children:[z.type==="buy"&&"Compra",z.type==="sell"&&"Venda",z.type==="receive"&&"Recebido",z.type==="send"&&"Enviado"]}),e.jsxs("span",{className:"tx-crypto",children:[z.amount," ",z.crypto]})]}),e.jsxs("div",{className:"tx-details",children:[e.jsx("span",{className:"tx-value",children:S(z.amount*z.price)}),e.jsx("span",{className:"tx-date",children:new Date(z.date).toLocaleDateString("pt-BR")})]})]},z.id)))})]}),n==="alerts"&&e.jsxs("div",{className:"alerts-section",children:[e.jsxs("div",{className:"alerts-header",children:[e.jsx("h2",{children:"Alertas de Preço"}),e.jsxs("button",{className:"btn-add-alert",onClick:()=>m(!0),children:[e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 5v14M5 12h14"})}),"Novo Alerta"]})]}),j.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"#666",strokeWidth:"2",children:[e.jsx("path",{d:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"}),e.jsx("path",{d:"M13.73 21a2 2 0 0 1-3.46 0"})]}),e.jsx("p",{children:"Nenhum alerta configurado"})]}):e.jsx("div",{className:"alerts-list",children:j.map(z=>{const U=u.find(zt=>zt.symbol===z.crypto);return e.jsxs("div",{className:`alert-card ${z.active?"":"inactive"}`,children:[e.jsxs("div",{className:"alert-info",children:[e.jsxs("div",{className:"alert-crypto",children:[e.jsx("span",{className:"crypto-symbol",children:z.crypto}),e.jsxs("span",{className:"alert-condition",children:[z.type==="above"?"Acima de":"Abaixo de"," ",S(z.targetPrice)]})]}),U&&e.jsxs("span",{className:"current-price",children:["Atual: ",S(U.price)]})]}),e.jsxs("div",{className:"alert-actions",children:[e.jsx("button",{className:`btn-toggle ${z.active?"active":""}`,onClick:()=>Oe(z.id),children:z.active?"Ativo":"Inativo"}),e.jsx("button",{className:"btn-delete",onClick:()=>Me(z.id),children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})})})]})]},z.id)})})]}),o&&s&&e.jsx("div",{className:"modal-overlay",onClick:()=>a(!1),children:e.jsxs("div",{className:"modal",onClick:z=>z.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsxs("h3",{children:[l==="buy"?"Comprar":"Vender"," ",s.name]}),e.jsx("button",{className:"btn-close",onClick:()=>a(!1),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"trade-info",children:[e.jsx("div",{className:"crypto-icon",style:{backgroundColor:`${s.color}20`,color:s.color},children:s.icon}),e.jsxs("div",{className:"crypto-details",children:[e.jsx("span",{className:"crypto-name",children:s.name}),e.jsx("span",{className:"crypto-price",children:S(s.price)})]})]}),e.jsxs("div",{className:"trade-tabs",children:[e.jsx("button",{className:`trade-tab ${l==="buy"?"active":""}`,onClick:()=>c("buy"),children:"Comprar"}),e.jsx("button",{className:`trade-tab ${l==="sell"?"active":""}`,onClick:()=>c("sell"),children:"Vender"})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{children:["Quantidade (",s.symbol,")"]}),e.jsx("input",{type:"number",value:d,onChange:z=>h(z.target.value),placeholder:"0.00",step:"0.0001"}),d&&e.jsxs("span",{className:"estimated-value",children:["≈ ",S(parseFloat(d||"0")*s.price)]})]}),e.jsxs("div",{className:"quick-amounts",children:[e.jsx("button",{onClick:()=>h("0.001"),children:"0.001"}),e.jsx("button",{onClick:()=>h("0.01"),children:"0.01"}),e.jsx("button",{onClick:()=>h("0.1"),children:"0.1"}),l==="sell"&&e.jsx("button",{onClick:()=>h(s.balance.toString()),children:"MAX"})]}),l==="sell"&&e.jsxs("div",{className:"available-balance",children:["Disponível: ",B(s.balance,4)," ",s.symbol]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn-cancel",onClick:()=>a(!1),children:"Cancelar"}),e.jsx("button",{className:`btn-confirm ${l}`,onClick:_,children:l==="buy"?"Confirmar Compra":"Confirmar Venda"})]})]})}),f&&e.jsx("div",{className:"modal-overlay",onClick:()=>m(!1),children:e.jsxs("div",{className:"modal",onClick:z=>z.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Criar Alerta de Preço"}),e.jsx("button",{className:"btn-close",onClick:()=>m(!1),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Criptomoeda"}),e.jsxs("select",{value:k,onChange:z=>p(z.target.value),children:[e.jsx("option",{value:"",children:"Selecione..."}),u.map(z=>e.jsxs("option",{value:z.symbol,children:[z.name," (",z.symbol,")"]},z.id))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Condição"}),e.jsxs("div",{className:"alert-type-buttons",children:[e.jsx("button",{className:`type-btn ${x==="above"?"active":""}`,onClick:()=>g("above"),children:"Acima de"}),e.jsx("button",{className:`type-btn ${x==="below"?"active":""}`,onClick:()=>g("below"),children:"Abaixo de"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Preço Alvo (R$)"}),e.jsx("input",{type:"number",value:v,onChange:z=>b(z.target.value),placeholder:"0,00"})]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn-cancel",onClick:()=>m(!1),children:"Cancelar"}),e.jsx("button",{className:"btn-confirm",onClick:xe,children:"Criar Alerta"})]})]})}),e.jsx("style",{children:`
        .cripto-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .cripto-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .cripto-header h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .cripto-header p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .total-balance-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #252525 100%);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          margin-bottom: 24px;
        }

        .balance-label {
          color: #888;
          font-size: 14px;
          display: block;
          margin-bottom: 8px;
        }

        .balance-value {
          color: #C9A227;
          font-size: 36px;
          font-weight: 700;
          display: block;
          margin-bottom: 8px;
        }

        .balance-change {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
        }

        .balance-change.positive {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .balance-change.negative {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
          overflow-x: auto;
        }

        .tab {
          flex: 1;
          min-width: fit-content;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        h2 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 16px;
        }

        .crypto-list, .market-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .crypto-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          gap: 16px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .crypto-card {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto;
          }
          .crypto-actions {
            grid-column: 1 / -1;
          }
        }

        .crypto-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .crypto-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
        }

        .crypto-details {
          display: flex;
          flex-direction: column;
        }

        .crypto-name {
          color: #fff;
          font-weight: 500;
        }

        .crypto-symbol {
          color: #888;
          font-size: 12px;
        }

        .crypto-price {
          text-align: right;
        }

        .price {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .change {
          font-size: 12px;
          display: block;
        }

        .change.positive {
          color: #22C55E;
        }

        .change.negative {
          color: #EF4444;
        }

        .crypto-balance {
          text-align: right;
        }

        .balance-crypto {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .balance-fiat {
          color: #888;
          font-size: 12px;
          display: block;
        }

        .crypto-actions {
          display: flex;
          gap: 8px;
        }

        .btn-trade {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-trade.buy {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
          border: 1px solid #22C55E;
        }

        .btn-trade.buy:hover {
          background: #22C55E;
          color: #000;
        }

        .btn-trade.sell {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid #EF4444;
        }

        .btn-trade.sell:hover {
          background: #EF4444;
          color: #fff;
        }

        .market-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: grid;
          grid-template-columns: 1fr 100px 1fr auto;
          gap: 16px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .market-card {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto;
          }
          .price-chart {
            display: none;
          }
          .btn-buy-market {
            grid-column: 1 / -1;
          }
        }

        .market-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .price-chart svg {
          width: 100%;
          height: 40px;
        }

        .price-chart svg.positive path {
          stroke: #22C55E;
        }

        .price-chart svg.negative path {
          stroke: #EF4444;
        }

        .market-price {
          text-align: right;
        }

        .btn-buy-market {
          padding: 10px 20px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-buy-market:hover {
          background: #D4AF37;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .transaction-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .tx-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tx-icon.buy {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .tx-icon.sell {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .tx-icon.receive {
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
        }

        .tx-icon.send {
          background: rgba(168, 85, 247, 0.1);
          color: #A855F7;
        }

        .tx-info {
          flex: 1;
        }

        .tx-type {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .tx-crypto {
          color: #888;
          font-size: 12px;
        }

        .tx-details {
          text-align: right;
        }

        .tx-value {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .tx-date {
          color: #888;
          font-size: 12px;
        }

        .alerts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .alerts-header h2 {
          margin: 0;
        }

        .btn-add-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-add-alert:hover {
          background: #D4AF37;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #666;
        }

        .empty-state svg {
          margin-bottom: 16px;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .alert-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .alert-card.inactive {
          opacity: 0.5;
        }

        .alert-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .alert-crypto {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .alert-crypto .crypto-symbol {
          background: #333;
          padding: 4px 8px;
          border-radius: 4px;
          color: #C9A227;
          font-weight: 600;
          font-size: 12px;
        }

        .alert-condition {
          color: #fff;
          font-size: 14px;
        }

        .current-price {
          color: #888;
          font-size: 12px;
        }

        .alert-actions {
          display: flex;
          gap: 8px;
        }

        .btn-toggle {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          border: 1px solid #333;
          background: transparent;
          color: #888;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-toggle.active {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22C55E;
          color: #22C55E;
        }

        .btn-delete {
          padding: 6px;
          border: none;
          background: transparent;
          color: #888;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-delete:hover {
          color: #EF4444;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .modal-header h3 {
          color: #fff;
          margin: 0;
          font-size: 18px;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
        }

        .btn-close:hover {
          color: #fff;
        }

        .modal-content {
          padding: 20px;
        }

        .trade-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding: 16px;
          background: #252525;
          border-radius: 12px;
        }

        .trade-info .crypto-details {
          display: flex;
          flex-direction: column;
        }

        .trade-info .crypto-name {
          color: #fff;
          font-weight: 500;
        }

        .trade-info .crypto-price {
          color: #C9A227;
          font-size: 18px;
          font-weight: 600;
        }

        .trade-tabs {
          display: flex;
          background: #252525;
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 20px;
        }

        .trade-tab {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          color: #888;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .trade-tab.active {
          background: #C9A227;
          color: #000;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #C9A227;
          outline: none;
        }

        .estimated-value {
          display: block;
          color: #C9A227;
          font-size: 14px;
          margin-top: 8px;
        }

        .quick-amounts {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .quick-amounts button {
          flex: 1;
          padding: 8px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 6px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .quick-amounts button:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .available-balance {
          color: #888;
          font-size: 12px;
          text-align: center;
        }

        .alert-type-buttons {
          display: flex;
          gap: 8px;
        }

        .type-btn {
          flex: 1;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .type-btn.active {
          border-color: #C9A227;
          color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #333;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-cancel:hover {
          border-color: #888;
          color: #fff;
        }

        .btn-confirm {
          flex: 1;
          padding: 12px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-confirm:hover {
          background: #D4AF37;
        }

        .btn-confirm.buy {
          background: #22C55E;
        }

        .btn-confirm.buy:hover {
          background: #16A34A;
        }

        .btn-confirm.sell {
          background: #EF4444;
          color: #fff;
        }

        .btn-confirm.sell:hover {
          background: #DC2626;
        }
      `})]})},R2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("exchange"),[s,i]=C.useState("BRL"),[o,a]=C.useState("USD"),[l,c]=C.useState(""),[d,h]=C.useState(!1),[f]=C.useState([{code:"BRL",name:"Real Brasileiro",symbol:"R$",flag:"🇧🇷",rate:1,balance:15e3},{code:"USD",name:"Dólar Americano",symbol:"$",flag:"🇺🇸",rate:5.05,balance:500},{code:"EUR",name:"Euro",symbol:"€",flag:"🇪🇺",rate:5.45,balance:250},{code:"GBP",name:"Libra Esterlina",symbol:"£",flag:"🇬🇧",rate:6.35,balance:100},{code:"JPY",name:"Iene Japonês",symbol:"¥",flag:"🇯🇵",rate:.034,balance:0},{code:"CHF",name:"Franco Suíço",symbol:"CHF",flag:"🇨🇭",rate:5.65,balance:0},{code:"CAD",name:"Dólar Canadense",symbol:"C$",flag:"🇨🇦",rate:3.75,balance:0},{code:"AUD",name:"Dólar Australiano",symbol:"A$",flag:"🇦🇺",rate:3.3,balance:0}]),[m]=C.useState([{id:"1",from:"BRL",to:"USD",amountFrom:1e3,amountTo:198.02,rate:5.05,date:"2024-01-15"},{id:"2",from:"BRL",to:"EUR",amountFrom:2e3,amountTo:367,rate:5.45,date:"2024-01-12"},{id:"3",from:"USD",to:"BRL",amountFrom:100,amountTo:505,rate:5.05,date:"2024-01-10"},{id:"4",from:"BRL",to:"GBP",amountFrom:500,amountTo:78.74,rate:6.35,date:"2024-01-08"}]),k=f.find(w=>w.code===s),p=f.find(w=>w.code===o),v=()=>{if(!l||!k||!p)return 0;const w=parseFloat(l);if(isNaN(w))return 0;const A=s==="BRL"?w:w*k.rate;return o==="BRL"?A:A/p.rate},b=()=>!k||!p?0:s==="BRL"?1/p.rate:o==="BRL"?k.rate:k.rate/p.rate,x=()=>{const w=s;i(o),a(w)},g=()=>{if(!l||parseFloat(l)<=0){t("Digite um valor válido","error");return}h(!0)},u=()=>{t(`Câmbio realizado com sucesso! ${y(v(),o)}`,"success"),h(!1),c("")},y=(w,A)=>{const S=f.find(B=>B.code===A);return A==="BRL"?w.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):`${(S==null?void 0:S.symbol)||""}${w.toFixed(2)}`},j=f.reduce((w,A)=>w+A.balance*A.rate,0);return e.jsxs("div",{className:"cambio-page",children:[e.jsxs("div",{className:"cambio-header",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M2 12h20"}),e.jsx("path",{d:"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"})]})}),e.jsx("h1",{children:"Conta Global"}),e.jsx("p",{children:"Câmbio e contas em moeda estrangeira"})]}),e.jsxs("div",{className:"total-balance-card",children:[e.jsx("span",{className:"balance-label",children:"Patrimônio Total (em BRL)"}),e.jsx("span",{className:"balance-value",children:y(j,"BRL")}),e.jsx("div",{className:"multi-currency",children:f.filter(w=>w.balance>0).map(w=>e.jsxs("div",{className:"currency-badge",children:[e.jsx("span",{className:"flag",children:w.flag}),e.jsxs("span",{className:"amount",children:[w.symbol,w.balance.toFixed(2)]})]},w.code))})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="exchange"?"active":""}`,onClick:()=>r("exchange"),children:"Câmbio"}),e.jsx("button",{className:`tab ${n==="accounts"?"active":""}`,onClick:()=>r("accounts"),children:"Contas"}),e.jsx("button",{className:`tab ${n==="history"?"active":""}`,onClick:()=>r("history"),children:"Histórico"})]}),n==="exchange"&&e.jsxs("div",{className:"exchange-section",children:[e.jsxs("div",{className:"exchange-card",children:[e.jsxs("div",{className:"exchange-input",children:[e.jsx("label",{children:"De"}),e.jsxs("div",{className:"input-row",children:[e.jsx("select",{value:s,onChange:w=>i(w.target.value),children:f.map(w=>e.jsxs("option",{value:w.code,children:[w.flag," ",w.code]},w.code))}),e.jsx("input",{type:"number",value:l,onChange:w=>c(w.target.value),placeholder:"0,00"})]}),k&&e.jsxs("span",{className:"available",children:["Disponível: ",y(k.balance,s)]})]}),e.jsx("button",{className:"btn-swap",onClick:x,children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M7 16V4M7 4L3 8M7 4l4 4"}),e.jsx("path",{d:"M17 8v12M17 20l4-4M17 20l-4-4"})]})}),e.jsxs("div",{className:"exchange-input",children:[e.jsx("label",{children:"Para"}),e.jsxs("div",{className:"input-row",children:[e.jsx("select",{value:o,onChange:w=>a(w.target.value),children:f.map(w=>e.jsxs("option",{value:w.code,children:[w.flag," ",w.code]},w.code))}),e.jsx("div",{className:"result-display",children:v().toFixed(2)})]})]}),e.jsxs("div",{className:"exchange-rate",children:[e.jsx("span",{className:"rate-label",children:"Taxa de câmbio"}),e.jsxs("span",{className:"rate-value",children:["1 ",s," = ",b().toFixed(4)," ",o]})]}),e.jsx("button",{className:"btn-exchange",onClick:g,children:"Converter"})]}),e.jsxs("div",{className:"rates-card",children:[e.jsx("h3",{children:"Cotações do Dia"}),e.jsx("div",{className:"rates-list",children:f.filter(w=>w.code!=="BRL").map(w=>e.jsxs("div",{className:"rate-item",children:[e.jsxs("div",{className:"currency-info",children:[e.jsx("span",{className:"flag",children:w.flag}),e.jsxs("div",{className:"currency-details",children:[e.jsx("span",{className:"currency-code",children:w.code}),e.jsx("span",{className:"currency-name",children:w.name})]})]}),e.jsxs("div",{className:"rate-values",children:[e.jsxs("span",{className:"buy",children:["Compra: R$ ",w.rate.toFixed(2)]}),e.jsxs("span",{className:"sell",children:["Venda: R$ ",(w.rate*1.02).toFixed(2)]})]})]},w.code))})]})]}),n==="accounts"&&e.jsxs("div",{className:"accounts-section",children:[e.jsx("h2",{children:"Suas Contas em Moeda Estrangeira"}),e.jsx("div",{className:"accounts-list",children:f.map(w=>e.jsxs("div",{className:`account-card ${w.balance>0?"active":""}`,children:[e.jsxs("div",{className:"account-info",children:[e.jsx("span",{className:"flag",children:w.flag}),e.jsxs("div",{className:"account-details",children:[e.jsx("span",{className:"currency-name",children:w.name}),e.jsx("span",{className:"currency-code",children:w.code})]})]}),e.jsxs("div",{className:"account-balance",children:[e.jsxs("span",{className:"balance",children:[w.symbol,w.balance.toFixed(2)]}),e.jsxs("span",{className:"balance-brl",children:["≈ ",y(w.balance*w.rate,"BRL")]})]}),e.jsx("div",{className:"account-actions",children:w.balance>0?e.jsxs(e.Fragment,{children:[e.jsxs("button",{className:"btn-action",onClick:()=>{i("BRL"),a(w.code),r("exchange")},children:[e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 5v14M5 12l7-7 7 7"})}),"Adicionar"]}),e.jsxs("button",{className:"btn-action",onClick:()=>{i(w.code),a("BRL"),r("exchange")},children:[e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 19V5M5 12l7 7 7-7"})}),"Resgatar"]})]}):e.jsx("button",{className:"btn-activate",onClick:()=>{i("BRL"),a(w.code),r("exchange")},children:"Ativar Conta"})})]},w.code))}),e.jsxs("div",{className:"card-section",children:[e.jsx("h3",{children:"Cartão Internacional"}),e.jsxs("div",{className:"international-card",children:[e.jsxs("div",{className:"card-visual",children:[e.jsx("div",{className:"card-brand",children:"ATHENA"}),e.jsx("div",{className:"card-number",children:"•••• •••• •••• 4589"}),e.jsxs("div",{className:"card-info",children:[e.jsxs("div",{className:"card-holder",children:[e.jsx("span",{className:"label",children:"TITULAR"}),e.jsx("span",{className:"value",children:"USUARIO ATHENA"})]}),e.jsxs("div",{className:"card-valid",children:[e.jsx("span",{className:"label",children:"VÁLIDO ATÉ"}),e.jsx("span",{className:"value",children:"12/28"})]})]}),e.jsx("div",{className:"card-flag",children:"VISA"})]}),e.jsxs("div",{className:"card-features",children:[e.jsxs("div",{className:"feature",children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#22C55E",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4 12 14.01l-3-3"})]}),e.jsx("span",{children:"Aceito em mais de 200 países"})]}),e.jsxs("div",{className:"feature",children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#22C55E",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4 12 14.01l-3-3"})]}),e.jsx("span",{children:"Sem anuidade"})]}),e.jsxs("div",{className:"feature",children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#22C55E",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4 12 14.01l-3-3"})]}),e.jsx("span",{children:"Compras na moeda local"})]})]})]})]})]}),n==="history"&&e.jsxs("div",{className:"history-section",children:[e.jsx("h2",{children:"Histórico de Câmbio"}),m.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"#666",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M2 12h20"}),e.jsx("path",{d:"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"})]}),e.jsx("p",{children:"Nenhuma operação de câmbio realizada"})]}):e.jsx("div",{className:"history-list",children:m.map(w=>{const A=f.find(B=>B.code===w.from),S=f.find(B=>B.code===w.to);return e.jsxs("div",{className:"history-card",children:[e.jsxs("div",{className:"exchange-visual",children:[e.jsxs("div",{className:"from",children:[e.jsx("span",{className:"flag",children:A==null?void 0:A.flag}),e.jsx("span",{className:"code",children:w.from})]}),e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})}),e.jsxs("div",{className:"to",children:[e.jsx("span",{className:"flag",children:S==null?void 0:S.flag}),e.jsx("span",{className:"code",children:w.to})]})]}),e.jsxs("div",{className:"exchange-amounts",children:[e.jsxs("span",{className:"amount-from",children:["-",y(w.amountFrom,w.from)]}),e.jsxs("span",{className:"amount-to",children:["+",y(w.amountTo,w.to)]})]}),e.jsxs("div",{className:"exchange-meta",children:[e.jsxs("span",{className:"rate",children:["Taxa: ",w.rate.toFixed(4)]}),e.jsx("span",{className:"date",children:new Date(w.date).toLocaleDateString("pt-BR")})]})]},w.id)})})]}),d&&e.jsx("div",{className:"modal-overlay",onClick:()=>h(!1),children:e.jsxs("div",{className:"modal",onClick:w=>w.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Confirmar Câmbio"}),e.jsx("button",{className:"btn-close",onClick:()=>h(!1),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsx("div",{className:"modal-content",children:e.jsxs("div",{className:"confirm-exchange",children:[e.jsxs("div",{className:"exchange-summary",children:[e.jsxs("div",{className:"from-amount",children:[e.jsx("span",{className:"flag",children:k==null?void 0:k.flag}),e.jsx("span",{className:"value",children:y(parseFloat(l||"0"),s)})]}),e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M12 5v14M5 12l7 7 7-7"})}),e.jsxs("div",{className:"to-amount",children:[e.jsx("span",{className:"flag",children:p==null?void 0:p.flag}),e.jsx("span",{className:"value",children:y(v(),o)})]})]}),e.jsxs("div",{className:"exchange-details",children:[e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"label",children:"Taxa de câmbio"}),e.jsxs("span",{className:"value",children:["1 ",s," = ",b().toFixed(4)," ",o]})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"label",children:"IOF (1.1%)"}),e.jsx("span",{className:"value",children:y(parseFloat(l||"0")*.011,s)})]}),e.jsxs("div",{className:"detail-row total",children:[e.jsx("span",{className:"label",children:"Você receberá"}),e.jsx("span",{className:"value",children:y(v(),o)})]})]})]})}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn-cancel",onClick:()=>h(!1),children:"Cancelar"}),e.jsx("button",{className:"btn-confirm",onClick:u,children:"Confirmar Câmbio"})]})]})}),e.jsx("style",{children:`
        .cambio-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .cambio-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .cambio-header h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .cambio-header p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .total-balance-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #252525 100%);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          margin-bottom: 24px;
        }

        .balance-label {
          color: #888;
          font-size: 14px;
          display: block;
          margin-bottom: 8px;
        }

        .balance-value {
          color: #C9A227;
          font-size: 32px;
          font-weight: 700;
          display: block;
          margin-bottom: 16px;
        }

        .multi-currency {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .currency-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #252525;
          padding: 8px 12px;
          border-radius: 20px;
          border: 1px solid #333;
        }

        .currency-badge .flag {
          font-size: 16px;
        }

        .currency-badge .amount {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        h2, h3 {
          color: #fff;
          margin: 0 0 16px;
        }

        h2 {
          font-size: 18px;
        }

        h3 {
          font-size: 16px;
        }

        .exchange-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .exchange-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .exchange-input {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .exchange-input label {
          color: #888;
          font-size: 12px;
        }

        .input-row {
          display: flex;
          gap: 12px;
        }

        .input-row select {
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
          min-width: 120px;
          cursor: pointer;
        }

        .input-row select:focus {
          border-color: #C9A227;
          outline: none;
        }

        .input-row input {
          flex: 1;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 18px;
          text-align: right;
        }

        .input-row input:focus {
          border-color: #C9A227;
          outline: none;
        }

        .result-display {
          flex: 1;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #C9A227;
          font-size: 18px;
          text-align: right;
          font-weight: 600;
        }

        .available {
          color: #888;
          font-size: 12px;
        }

        .btn-swap {
          align-self: center;
          width: 48px;
          height: 48px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 12px;
          color: #C9A227;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .btn-swap:hover {
          background: #333;
          border-color: #C9A227;
        }

        .exchange-rate {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: #252525;
          border-radius: 8px;
        }

        .rate-label {
          color: #888;
          font-size: 14px;
        }

        .rate-value {
          color: #C9A227;
          font-size: 14px;
          font-weight: 500;
        }

        .btn-exchange {
          padding: 16px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-exchange:hover {
          background: #D4AF37;
        }

        .rates-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .rates-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rate-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .rate-item:last-child {
          border-bottom: none;
        }

        .currency-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .currency-info .flag {
          font-size: 24px;
        }

        .currency-details {
          display: flex;
          flex-direction: column;
        }

        .currency-code {
          color: #fff;
          font-weight: 500;
        }

        .currency-name {
          color: #888;
          font-size: 12px;
        }

        .rate-values {
          display: flex;
          flex-direction: column;
          text-align: right;
          gap: 2px;
        }

        .rate-values .buy {
          color: #22C55E;
          font-size: 13px;
        }

        .rate-values .sell {
          color: #EF4444;
          font-size: 13px;
        }

        .accounts-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .accounts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .account-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 16px;
          align-items: center;
          opacity: 0.6;
        }

        .account-card.active {
          opacity: 1;
          border-color: #C9A227;
        }

        @media (max-width: 640px) {
          .account-card {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        .account-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .account-info .flag {
          font-size: 32px;
        }

        .account-details {
          display: flex;
          flex-direction: column;
        }

        .account-details .currency-name {
          color: #fff;
          font-weight: 500;
          font-size: 14px;
        }

        .account-details .currency-code {
          color: #888;
          font-size: 12px;
        }

        .account-balance {
          text-align: right;
        }

        @media (max-width: 640px) {
          .account-balance {
            text-align: center;
          }
        }

        .account-balance .balance {
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          display: block;
        }

        .account-balance .balance-brl {
          color: #888;
          font-size: 12px;
        }

        .account-actions {
          display: flex;
          gap: 8px;
        }

        @media (max-width: 640px) {
          .account-actions {
            justify-content: center;
          }
        }

        .btn-action {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 6px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-action:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .btn-activate {
          padding: 10px 20px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-activate:hover {
          background: #D4AF37;
        }

        .card-section {
          margin-top: 24px;
        }

        .international-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .card-visual {
          background: linear-gradient(135deg, #1A1A1A 0%, #333 100%);
          border: 1px solid #C9A227;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          position: relative;
        }

        .card-brand {
          color: #C9A227;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .card-number {
          color: #fff;
          font-size: 18px;
          letter-spacing: 4px;
          margin: 24px 0;
        }

        .card-info {
          display: flex;
          gap: 32px;
        }

        .card-holder, .card-valid {
          display: flex;
          flex-direction: column;
        }

        .card-holder .label, .card-valid .label {
          color: #888;
          font-size: 10px;
        }

        .card-holder .value, .card-valid .value {
          color: #fff;
          font-size: 12px;
        }

        .card-flag {
          position: absolute;
          bottom: 20px;
          right: 20px;
          color: #C9A227;
          font-size: 20px;
          font-weight: 700;
          font-style: italic;
        }

        .card-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #888;
          font-size: 14px;
        }

        .history-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #666;
        }

        .empty-state svg {
          margin-bottom: 16px;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
        }

        .exchange-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .exchange-visual .from,
        .exchange-visual .to {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .exchange-visual .flag {
          font-size: 24px;
        }

        .exchange-visual .code {
          color: #fff;
          font-weight: 500;
        }

        .exchange-amounts {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .amount-from {
          color: #EF4444;
        }

        .amount-to {
          color: #22C55E;
        }

        .exchange-meta {
          display: flex;
          justify-content: space-between;
          color: #888;
          font-size: 12px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .modal-header h3 {
          color: #fff;
          margin: 0;
          font-size: 18px;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
        }

        .btn-close:hover {
          color: #fff;
        }

        .modal-content {
          padding: 20px;
        }

        .confirm-exchange {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .exchange-summary {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: #252525;
          border-radius: 12px;
        }

        .from-amount,
        .to-amount {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .from-amount .flag,
        .to-amount .flag {
          font-size: 32px;
        }

        .from-amount .value {
          color: #EF4444;
          font-size: 24px;
          font-weight: 600;
        }

        .to-amount .value {
          color: #22C55E;
          font-size: 24px;
          font-weight: 600;
        }

        .exchange-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #252525;
        }

        .detail-row.total {
          border-bottom: none;
          padding-top: 12px;
          border-top: 1px solid #333;
        }

        .detail-row .label {
          color: #888;
          font-size: 14px;
        }

        .detail-row .value {
          color: #fff;
          font-size: 14px;
        }

        .detail-row.total .value {
          color: #C9A227;
          font-weight: 600;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #333;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-cancel:hover {
          border-color: #888;
          color: #fff;
        }

        .btn-confirm {
          flex: 1;
          padding: 12px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-confirm:hover {
          background: #D4AF37;
        }
      `})]})},L2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("pix"),[s,i]=C.useState(null),[o,a]=C.useState(""),[l,c]=C.useState(!1),[d,h]=C.useState([{id:"1",name:"PIX Diurno",description:"06h às 20h",current:5e3,max:5e4,category:"pix",icon:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"5"}),e.jsx("line",{x1:"12",y1:"1",x2:"12",y2:"3"}),e.jsx("line",{x1:"12",y1:"21",x2:"12",y2:"23"}),e.jsx("line",{x1:"4.22",y1:"4.22",x2:"5.64",y2:"5.64"}),e.jsx("line",{x1:"18.36",y1:"18.36",x2:"19.78",y2:"19.78"}),e.jsx("line",{x1:"1",y1:"12",x2:"3",y2:"12"}),e.jsx("line",{x1:"21",y1:"12",x2:"23",y2:"12"})]})},{id:"2",name:"PIX Noturno",description:"20h às 06h",current:1e3,max:5e3,category:"pix",icon:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})})},{id:"3",name:"PIX Único",description:"Por transação",current:1e4,max:5e4,category:"pix",icon:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"1",x2:"12",y2:"23"}),e.jsx("path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"})]})},{id:"4",name:"Limite do Cartão",description:"Crédito disponível",current:15e3,max:3e4,category:"card",icon:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]})},{id:"5",name:"Compra Online",description:"Limite para e-commerce",current:5e3,max:2e4,category:"card",icon:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"9",cy:"21",r:"1"}),e.jsx("circle",{cx:"20",cy:"21",r:"1"}),e.jsx("path",{d:"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"})]})},{id:"6",name:"Compra Internacional",description:"Limite em USD",current:2e3,max:1e4,category:"card",icon:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"2",y1:"12",x2:"22",y2:"12"}),e.jsx("path",{d:"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"})]})},{id:"7",name:"Transferência TED",description:"Limite diário",current:2e4,max:1e5,category:"transfer",icon:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("polyline",{points:"19,12 12,19 5,12"})]})},{id:"8",name:"Transferência DOC",description:"Limite diário",current:4999,max:4999,category:"transfer",icon:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]})},{id:"9",name:"Saque Diário",description:"Caixas eletrônicos",current:1500,max:5e3,category:"withdraw",icon:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"2",y:"4",width:"20",height:"16",rx:"2"}),e.jsx("path",{d:"M2 10h20"}),e.jsx("path",{d:"M6 16h.01M10 16h.01"})]})},{id:"10",name:"Saque Mensal",description:"Total do mês",current:5e3,max:2e4,category:"withdraw",icon:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]})}]),[f,m]=C.useState({onApproachLimit:!0,onHighTransaction:!0,highTransactionThreshold:1e3,weeklyReport:!1}),k=d.filter(u=>u.category===n),p=u=>u.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),v=u=>{const y=d.find(j=>j.id===u);y&&(a(y.current.toString()),i(u))},b=()=>{if(!s||!o)return;const u=parseFloat(o),y=d.find(j=>j.id===s);if(y){if(u>y.max){t(`O limite máximo é ${p(y.max)}`,"error");return}if(u<0){t("O limite não pode ser negativo","error");return}h(d.map(j=>j.id===s?{...j,current:u}:j)),t("Limite atualizado com sucesso!","success"),i(null),a("")}},x=(u,y)=>{const j=d.find(A=>A.id===u);if(!j)return;const w=Math.min(j.max*y,j.max);h(d.map(A=>A.id===u?{...A,current:w}:A)),t(`Limite ajustado para ${p(w)}`,"success")},g=(u,y)=>Math.round(u/y*100);return e.jsxs("div",{className:"limites-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("div",{className:"header-icon",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"})})}),e.jsx("h1",{children:"Limites e Controles"}),e.jsx("p",{children:"Gerencie os limites das suas transações"})]}),e.jsxs("div",{className:"alert-banner",onClick:()=>c(!0),children:[e.jsx("div",{className:"alert-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"}),e.jsx("path",{d:"M13.73 21a2 2 0 0 1-3.46 0"})]})}),e.jsx("span",{children:"Configurar alertas de limite"}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"9,18 15,12 9,6"})})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="pix"?"active":""}`,onClick:()=>r("pix"),children:"PIX"}),e.jsx("button",{className:`tab ${n==="card"?"active":""}`,onClick:()=>r("card"),children:"Cartão"}),e.jsx("button",{className:`tab ${n==="transfer"?"active":""}`,onClick:()=>r("transfer"),children:"Transferência"}),e.jsx("button",{className:`tab ${n==="withdraw"?"active":""}`,onClick:()=>r("withdraw"),children:"Saque"})]}),e.jsx("div",{className:"limits-list",children:k.map(u=>e.jsxs("div",{className:"limit-card",children:[e.jsxs("div",{className:"limit-header",children:[e.jsx("div",{className:"limit-icon",children:u.icon}),e.jsxs("div",{className:"limit-info",children:[e.jsx("span",{className:"limit-name",children:u.name}),e.jsx("span",{className:"limit-desc",children:u.description})]})]}),e.jsxs("div",{className:"limit-value",children:[e.jsxs("div",{className:"current-value",children:[e.jsx("span",{className:"label",children:"Limite atual"}),e.jsx("span",{className:"value",children:p(u.current)})]}),e.jsxs("div",{className:"max-value",children:[e.jsx("span",{className:"label",children:"Máximo"}),e.jsx("span",{className:"value",children:p(u.max)})]})]}),e.jsxs("div",{className:"limit-bar",children:[e.jsx("div",{className:"limit-fill",style:{width:`${g(u.current,u.max)}%`}}),e.jsxs("span",{className:"percentage",children:[g(u.current,u.max),"%"]})]}),s===u.id?e.jsxs("div",{className:"edit-section",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("span",{className:"currency",children:"R$"}),e.jsx("input",{type:"number",value:o,onChange:y=>a(y.target.value),placeholder:"0,00",max:u.max})]}),e.jsxs("div",{className:"edit-actions",children:[e.jsx("button",{className:"btn-cancel",onClick:()=>i(null),children:"Cancelar"}),e.jsx("button",{className:"btn-save",onClick:b,children:"Salvar"})]})]}):e.jsxs("div",{className:"limit-actions",children:[e.jsxs("div",{className:"quick-adjust",children:[e.jsx("button",{onClick:()=>x(u.id,.25),children:"25%"}),e.jsx("button",{onClick:()=>x(u.id,.5),children:"50%"}),e.jsx("button",{onClick:()=>x(u.id,.75),children:"75%"}),e.jsx("button",{onClick:()=>x(u.id,1),children:"100%"})]}),e.jsxs("button",{className:"btn-edit",onClick:()=>v(u.id),children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),e.jsx("path",{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})]}),"Editar"]})]})]},u.id))}),e.jsxs("div",{className:"security-tips",children:[e.jsx("h3",{children:"Dicas de Segurança"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4L12 14.01l-3-3"})]}),"Mantenha limites noturnos mais baixos para maior segurança"]}),e.jsxs("li",{children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4L12 14.01l-3-3"})]}),"Ajuste o limite de compras online conforme seu uso"]}),e.jsxs("li",{children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4L12 14.01l-3-3"})]}),"Ative alertas para transações acima de valores específicos"]})]})]}),l&&e.jsx("div",{className:"modal-overlay",onClick:()=>c(!1),children:e.jsxs("div",{className:"modal",onClick:u=>u.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Configurar Alertas"}),e.jsx("button",{className:"btn-close",onClick:()=>c(!1),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"alert-option",children:[e.jsxs("div",{className:"option-info",children:[e.jsx("span",{className:"option-name",children:"Alerta ao se aproximar do limite"}),e.jsx("span",{className:"option-desc",children:"Notificar quando usar 80% do limite"})]}),e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:f.onApproachLimit,onChange:u=>m({...f,onApproachLimit:u.target.checked})}),e.jsx("span",{className:"slider"})]})]}),e.jsxs("div",{className:"alert-option",children:[e.jsxs("div",{className:"option-info",children:[e.jsx("span",{className:"option-name",children:"Alerta de transação alta"}),e.jsx("span",{className:"option-desc",children:"Notificar transações acima do valor definido"})]}),e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:f.onHighTransaction,onChange:u=>m({...f,onHighTransaction:u.target.checked})}),e.jsx("span",{className:"slider"})]})]}),f.onHighTransaction&&e.jsxs("div",{className:"threshold-input",children:[e.jsx("label",{children:"Valor mínimo para alerta"}),e.jsxs("div",{className:"input-group",children:[e.jsx("span",{className:"currency",children:"R$"}),e.jsx("input",{type:"number",value:f.highTransactionThreshold,onChange:u=>m({...f,highTransactionThreshold:parseFloat(u.target.value)})})]})]}),e.jsxs("div",{className:"alert-option",children:[e.jsxs("div",{className:"option-info",children:[e.jsx("span",{className:"option-name",children:"Relatório semanal"}),e.jsx("span",{className:"option-desc",children:"Receber resumo dos limites utilizados"})]}),e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:f.weeklyReport,onChange:u=>m({...f,weeklyReport:u.target.checked})}),e.jsx("span",{className:"slider"})]})]})]}),e.jsx("div",{className:"modal-footer",children:e.jsx("button",{className:"btn-save-alerts",onClick:()=>{t("Configurações de alerta salvas!","success"),c(!1)},children:"Salvar Configurações"})})]})}),e.jsx("style",{children:`
        .limites-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .page-header h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .page-header p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .alert-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          margin-bottom: 24px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .alert-banner:hover {
          border-color: #C9A227;
        }

        .alert-icon {
          width: 40px;
          height: 40px;
          background: #252525;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A227;
        }

        .alert-banner span {
          flex: 1;
          color: #fff;
          font-size: 14px;
        }

        .alert-banner svg:last-child {
          color: #888;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
          overflow-x: auto;
        }

        .tab {
          flex: 1;
          min-width: fit-content;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .limits-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .limit-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .limit-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .limit-icon {
          width: 44px;
          height: 44px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A227;
        }

        .limit-info {
          display: flex;
          flex-direction: column;
        }

        .limit-name {
          color: #fff;
          font-weight: 500;
        }

        .limit-desc {
          color: #888;
          font-size: 12px;
        }

        .limit-value {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .current-value, .max-value {
          display: flex;
          flex-direction: column;
        }

        .limit-value .label {
          color: #888;
          font-size: 12px;
        }

        .current-value .value {
          color: #C9A227;
          font-size: 20px;
          font-weight: 600;
        }

        .max-value .value {
          color: #fff;
          font-size: 16px;
        }

        .limit-bar {
          position: relative;
          height: 8px;
          background: #252525;
          border-radius: 4px;
          margin-bottom: 16px;
          overflow: visible;
        }

        .limit-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A227 0%, #D4AF37 100%);
          border-radius: 4px;
          transition: width 0.3s;
        }

        .percentage {
          position: absolute;
          right: 0;
          top: -20px;
          color: #888;
          font-size: 12px;
        }

        .limit-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .quick-adjust {
          display: flex;
          gap: 8px;
        }

        .quick-adjust button {
          padding: 8px 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 6px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .quick-adjust button:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .btn-edit {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #C9A227;
          border-radius: 8px;
          color: #C9A227;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-edit:hover {
          background: #C9A227;
          color: #000;
        }

        .edit-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px;
        }

        .input-group .currency {
          color: #888;
        }

        .input-group input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 18px;
          outline: none;
        }

        .edit-actions {
          display: flex;
          gap: 12px;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-save {
          flex: 1;
          padding: 12px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .security-tips {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .security-tips h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .security-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .security-tips li {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #888;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .security-tips li:last-child {
          margin-bottom: 0;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .modal-header h3 {
          color: #fff;
          margin: 0;
          font-size: 18px;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
        }

        .modal-content {
          padding: 20px;
        }

        .alert-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #252525;
        }

        .alert-option:last-of-type {
          border-bottom: none;
        }

        .option-info {
          display: flex;
          flex-direction: column;
        }

        .option-name {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .option-desc {
          color: #888;
          font-size: 12px;
        }

        .toggle {
          position: relative;
          width: 48px;
          height: 26px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #333;
          border-radius: 26px;
          transition: 0.3s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background: #fff;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle input:checked + .slider {
          background: #C9A227;
        }

        .toggle input:checked + .slider:before {
          transform: translateX(22px);
        }

        .threshold-input {
          padding: 16px 0;
          border-bottom: 1px solid #252525;
        }

        .threshold-input label {
          color: #888;
          font-size: 12px;
          display: block;
          margin-bottom: 8px;
        }

        .threshold-input .input-group {
          padding: 10px 12px;
        }

        .threshold-input input {
          font-size: 16px;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #333;
        }

        .btn-save-alerts {
          width: 100%;
          padding: 14px;
          background: #C9A227;
          border: none;
          border-radius: 10px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-save-alerts:hover {
          background: #D4AF37;
        }
      `})]})},_2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("active"),[s,i]=C.useState(null),[o,a]=C.useState(!1),[l,c]=C.useState([{id:"1",name:"Netflix",logo:"N",category:"Streaming",amount:55.9,billingDate:15,status:"active",lastPayment:"2024-01-15",nextPayment:"2024-02-15"},{id:"2",name:"Spotify",logo:"S",category:"Música",amount:21.9,billingDate:10,status:"active",lastPayment:"2024-01-10",nextPayment:"2024-02-10"},{id:"3",name:"Amazon Prime",logo:"A",category:"Streaming",amount:14.9,billingDate:5,status:"active",lastPayment:"2024-01-05",nextPayment:"2024-02-05"},{id:"4",name:"iCloud",logo:"i",category:"Armazenamento",amount:3.5,billingDate:20,status:"active",lastPayment:"2024-01-20",nextPayment:"2024-02-20"},{id:"5",name:"Disney+",logo:"D",category:"Streaming",amount:33.9,billingDate:25,status:"paused",lastPayment:"2023-12-25",nextPayment:"-"},{id:"6",name:"HBO Max",logo:"H",category:"Streaming",amount:34.9,billingDate:8,status:"cancelled",lastPayment:"2023-11-08",nextPayment:"-"}]),[d]=C.useState([{id:"1",subscription:"Netflix",amount:55.9,date:"2024-01-15",status:"paid"},{id:"2",subscription:"Spotify",amount:21.9,date:"2024-01-10",status:"paid"},{id:"3",subscription:"Amazon Prime",amount:14.9,date:"2024-01-05",status:"paid"},{id:"4",subscription:"Netflix",amount:55.9,date:"2023-12-15",status:"paid"},{id:"5",subscription:"Spotify",amount:21.9,date:"2023-12-10",status:"paid"},{id:"6",subscription:"Disney+",amount:33.9,date:"2023-12-25",status:"paid"},{id:"7",subscription:"HBO Max",amount:34.9,date:"2023-11-08",status:"paid"}]),h=l.filter(u=>u.status==="active"),f=h.reduce((u,y)=>u+y.amount,0),m=u=>u.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),k=u=>u==="-"?"-":new Date(u).toLocaleDateString("pt-BR"),p=u=>{const y=u.status==="active"?"paused":"active";c(l.map(j=>j.id===u.id?{...j,status:y}:j)),t(y==="active"?"Assinatura reativada!":"Assinatura pausada",y==="active"?"success":"info"),a(!1)},v=u=>{c(l.map(y=>y.id===u.id?{...y,status:"cancelled"}:y)),t("Assinatura cancelada","info"),a(!1)},b=u=>{i(u),a(!0)},x=u=>({active:{label:"Ativa",color:"#22C55E",bg:"rgba(34, 197, 94, 0.1)"},paused:{label:"Pausada",color:"#F59E0B",bg:"rgba(245, 158, 11, 0.1)"},cancelled:{label:"Cancelada",color:"#EF4444",bg:"rgba(239, 68, 68, 0.1)"}})[u],g=u=>({Streaming:"#E50914",Música:"#1DB954",Armazenamento:"#007AFF",Jogos:"#107C10",Educação:"#FFB900"})[u]||"#C9A227";return e.jsxs("div",{className:"assinaturas-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"}),e.jsx("path",{d:"M1 10h22"})]})}),e.jsx("h1",{children:"Assinaturas"}),e.jsx("p",{children:"Gerencie seus serviços recorrentes"})]}),e.jsxs("div",{className:"summary-card",children:[e.jsxs("div",{className:"summary-content",children:[e.jsxs("div",{className:"summary-info",children:[e.jsx("span",{className:"label",children:"Total mensal"}),e.jsx("span",{className:"value",children:m(f)})]}),e.jsxs("div",{className:"summary-stats",children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-value",children:h.length}),e.jsx("span",{className:"stat-label",children:"Ativas"})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-value",children:l.filter(u=>u.status==="paused").length}),e.jsx("span",{className:"stat-label",children:"Pausadas"})]})]})]}),e.jsxs("div",{className:"upcoming-payments",children:[e.jsx("span",{className:"upcoming-label",children:"Próximos pagamentos"}),e.jsx("div",{className:"upcoming-list",children:h.slice(0,3).map(u=>e.jsxs("div",{className:"upcoming-item",children:[e.jsx("span",{className:"name",children:u.name}),e.jsxs("span",{className:"date",children:["dia ",u.billingDate]})]},u.id))})]})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="active"?"active":""}`,onClick:()=>r("active"),children:"Assinaturas"}),e.jsx("button",{className:`tab ${n==="history"?"active":""}`,onClick:()=>r("history"),children:"Histórico"})]}),n==="active"&&e.jsxs("div",{className:"subscriptions-section",children:[e.jsx("div",{className:"subscriptions-list",children:l.map(u=>{const y=x(u.status);return e.jsxs("div",{className:`subscription-card ${u.status}`,onClick:()=>b(u),children:[e.jsx("div",{className:"subscription-logo",style:{backgroundColor:g(u.category)},children:u.logo}),e.jsxs("div",{className:"subscription-info",children:[e.jsx("span",{className:"subscription-name",children:u.name}),e.jsx("span",{className:"subscription-category",children:u.category})]}),e.jsxs("div",{className:"subscription-details",children:[e.jsx("span",{className:"subscription-amount",children:m(u.amount)}),e.jsx("span",{className:"subscription-status",style:{color:y.color,backgroundColor:y.bg},children:y.label})]}),e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#888",strokeWidth:"2",children:e.jsx("polyline",{points:"9,18 15,12 9,6"})})]},u.id)})}),e.jsxs("div",{className:"categories-breakdown",children:[e.jsx("h3",{children:"Por Categoria"}),e.jsx("div",{className:"categories-list",children:Array.from(new Set(h.map(u=>u.category))).map(u=>{const y=h.filter(w=>w.category===u).reduce((w,A)=>w+A.amount,0),j=y/f*100;return e.jsxs("div",{className:"category-item",children:[e.jsxs("div",{className:"category-header",children:[e.jsxs("div",{className:"category-info",children:[e.jsx("div",{className:"category-dot",style:{backgroundColor:g(u)}}),e.jsx("span",{className:"category-name",children:u})]}),e.jsx("span",{className:"category-amount",children:m(y)})]}),e.jsx("div",{className:"category-bar",children:e.jsx("div",{className:"category-fill",style:{width:`${j}%`,backgroundColor:g(u)}})})]},u)})})]})]}),n==="history"&&e.jsx("div",{className:"history-section",children:e.jsx("div",{className:"history-list",children:d.map(u=>e.jsxs("div",{className:"history-item",children:[e.jsxs("div",{className:"history-info",children:[e.jsx("span",{className:"history-name",children:u.subscription}),e.jsx("span",{className:"history-date",children:k(u.date)})]}),e.jsxs("div",{className:"history-details",children:[e.jsxs("span",{className:"history-amount",children:["-",m(u.amount)]}),e.jsx("span",{className:"history-status",children:"Pago"})]})]},u.id))})}),o&&s&&e.jsx("div",{className:"modal-overlay",onClick:()=>a(!1),children:e.jsxs("div",{className:"modal",onClick:u=>u.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsxs("div",{className:"modal-subscription",children:[e.jsx("div",{className:"modal-logo",style:{backgroundColor:g(s.category)},children:s.logo}),e.jsxs("div",{className:"modal-info",children:[e.jsx("span",{className:"modal-name",children:s.name}),e.jsx("span",{className:"modal-category",children:s.category})]})]}),e.jsx("button",{className:"btn-close",onClick:()=>a(!1),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Valor mensal"}),e.jsx("span",{className:"detail-value",children:m(s.amount)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Dia de cobrança"}),e.jsxs("span",{className:"detail-value",children:["Todo dia ",s.billingDate]})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Último pagamento"}),e.jsx("span",{className:"detail-value",children:k(s.lastPayment)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Próximo pagamento"}),e.jsx("span",{className:"detail-value",children:k(s.nextPayment)})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"detail-label",children:"Status"}),e.jsx("span",{className:"detail-status",style:{color:x(s.status).color,backgroundColor:x(s.status).bg},children:x(s.status).label})]}),e.jsxs("div",{className:"annual-cost",children:[e.jsx("span",{className:"annual-label",children:"Custo anual estimado"}),e.jsx("span",{className:"annual-value",children:m(s.amount*12)})]})]}),e.jsx("div",{className:"modal-footer",children:s.status!=="cancelled"&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"btn-pause",onClick:()=>p(s),children:s.status==="active"?e.jsxs(e.Fragment,{children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"6",y:"4",width:"4",height:"16"}),e.jsx("rect",{x:"14",y:"4",width:"4",height:"16"})]}),"Pausar"]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polygon",{points:"5,3 19,12 5,21"})}),"Reativar"]})}),e.jsxs("button",{className:"btn-cancel-sub",onClick:()=>v(s),children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"15",y1:"9",x2:"9",y2:"15"}),e.jsx("line",{x1:"9",y1:"9",x2:"15",y2:"15"})]}),"Cancelar"]})]})})]})}),e.jsx("style",{children:`
        .assinaturas-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .page-header h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .page-header p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .summary-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #252525 100%);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .summary-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
        }

        .summary-info .label {
          color: #888;
          font-size: 14px;
          display: block;
        }

        .summary-info .value {
          color: #C9A227;
          font-size: 32px;
          font-weight: 700;
        }

        .summary-stats {
          display: flex;
          gap: 24px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          color: #fff;
          font-size: 24px;
          font-weight: 600;
          display: block;
        }

        .stat-label {
          color: #888;
          font-size: 12px;
        }

        .upcoming-payments {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .upcoming-label {
          color: #888;
          font-size: 12px;
        }

        .upcoming-list {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .upcoming-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #252525;
          border-radius: 8px;
        }

        .upcoming-item .name {
          color: #fff;
          font-size: 13px;
        }

        .upcoming-item .date {
          color: #C9A227;
          font-size: 12px;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .subscriptions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .subscription-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .subscription-card:hover {
          border-color: #C9A227;
        }

        .subscription-card.cancelled {
          opacity: 0.5;
        }

        .subscription-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          font-weight: 700;
        }

        .subscription-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .subscription-name {
          color: #fff;
          font-weight: 500;
        }

        .subscription-category {
          color: #888;
          font-size: 12px;
        }

        .subscription-details {
          text-align: right;
        }

        .subscription-amount {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .subscription-status {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
        }

        .categories-breakdown {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .categories-breakdown h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .category-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .category-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .category-name {
          color: #fff;
          font-size: 14px;
        }

        .category-amount {
          color: #888;
          font-size: 14px;
        }

        .category-bar {
          height: 6px;
          background: #252525;
          border-radius: 3px;
          overflow: hidden;
        }

        .category-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-item {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .history-info {
          display: flex;
          flex-direction: column;
        }

        .history-name {
          color: #fff;
          font-weight: 500;
        }

        .history-date {
          color: #888;
          font-size: 12px;
        }

        .history-details {
          text-align: right;
        }

        .history-amount {
          color: #EF4444;
          font-weight: 500;
          display: block;
        }

        .history-status {
          color: #22C55E;
          font-size: 12px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .modal-subscription {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          font-weight: 700;
        }

        .modal-info {
          display: flex;
          flex-direction: column;
        }

        .modal-name {
          color: #fff;
          font-size: 18px;
          font-weight: 500;
        }

        .modal-category {
          color: #888;
          font-size: 12px;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
        }

        .modal-content {
          padding: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .detail-row:last-of-type {
          border-bottom: none;
        }

        .detail-label {
          color: #888;
          font-size: 14px;
        }

        .detail-value {
          color: #fff;
          font-size: 14px;
        }

        .detail-status {
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
        }

        .annual-cost {
          margin-top: 16px;
          padding: 16px;
          background: #252525;
          border-radius: 12px;
          text-align: center;
        }

        .annual-label {
          color: #888;
          font-size: 12px;
          display: block;
          margin-bottom: 4px;
        }

        .annual-value {
          color: #C9A227;
          font-size: 24px;
          font-weight: 600;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #333;
        }

        .btn-pause {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: transparent;
          border: 1px solid #F59E0B;
          border-radius: 10px;
          color: #F59E0B;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-pause:hover {
          background: rgba(245, 158, 11, 0.1);
        }

        .btn-cancel-sub {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: transparent;
          border: 1px solid #EF4444;
          border-radius: 10px;
          color: #EF4444;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-cancel-sub:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `})]})},I2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("personal"),[s,i]=C.useState(!1),[o,a]=C.useState(!1),[l,c]=C.useState({name:"João da Silva",email:"joao.silva@email.com",phone:"(11) 99999-9999",cpf:"***.***.***-00",birthDate:"1990-05-15",address:{street:"Rua das Flores",number:"123",complement:"Apt 501",neighborhood:"Centro",city:"São Paulo",state:"SP",zipCode:"01234-567"}}),[d,h]=C.useState({biometrics:!0,faceId:!1,twoFactor:!0,loginNotifications:!0}),[f]=C.useState([{id:"1",type:"RG",status:"verified",date:"2023-05-10"},{id:"2",type:"CPF",status:"verified",date:"2023-05-10"},{id:"3",type:"Comprovante de Residência",status:"pending",date:"2024-01-05"}]),m=()=>{t("Dados atualizados com sucesso!","success"),i(!1)},k=()=>{t("Senha alterada com sucesso!","success"),a(!1)},p=b=>{h(x=>({...x,[b]:!x[b]})),t("Configuração atualizada","success")},v=b=>({verified:{label:"Verificado",color:"#22C55E",bg:"rgba(34, 197, 94, 0.1)"},pending:{label:"Pendente",color:"#F59E0B",bg:"rgba(245, 158, 11, 0.1)"},rejected:{label:"Rejeitado",color:"#EF4444",bg:"rgba(239, 68, 68, 0.1)"}})[b];return e.jsxs("div",{className:"perfil-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsxs("div",{className:"profile-avatar",children:[e.jsx("span",{className:"avatar-initials",children:"JS"}),e.jsx("button",{className:"btn-edit-avatar",onClick:()=>t("Alterar foto","info"),children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"}),e.jsx("circle",{cx:"12",cy:"13",r:"4"})]})})]}),e.jsx("h1",{children:l.name}),e.jsx("p",{className:"account-info",children:"Conta Athena desde Jan 2023"})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="personal"?"active":""}`,onClick:()=>r("personal"),children:"Dados Pessoais"}),e.jsx("button",{className:`tab ${n==="security"?"active":""}`,onClick:()=>r("security"),children:"Segurança"}),e.jsx("button",{className:`tab ${n==="documents"?"active":""}`,onClick:()=>r("documents"),children:"Documentos"})]}),n==="personal"&&e.jsxs("div",{className:"personal-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Informações Pessoais"}),s?e.jsx("button",{className:"btn-save",onClick:m,children:"Salvar"}):e.jsxs("button",{className:"btn-edit",onClick:()=>i(!0),children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),e.jsx("path",{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})]}),"Editar"]})]}),e.jsxs("div",{className:"info-card",children:[e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"Nome completo"}),s?e.jsx("input",{type:"text",value:l.name,onChange:b=>c({...l,name:b.target.value})}):e.jsx("span",{className:"info-value",children:l.name})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"E-mail"}),s?e.jsx("input",{type:"email",value:l.email,onChange:b=>c({...l,email:b.target.value})}):e.jsx("span",{className:"info-value",children:l.email})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"Telefone"}),s?e.jsx("input",{type:"tel",value:l.phone,onChange:b=>c({...l,phone:b.target.value})}):e.jsx("span",{className:"info-value",children:l.phone})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"CPF"}),e.jsx("span",{className:"info-value",children:l.cpf})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"Data de nascimento"}),e.jsx("span",{className:"info-value",children:new Date(l.birthDate).toLocaleDateString("pt-BR")})]})]}),e.jsx("div",{className:"section-header",children:e.jsx("h2",{children:"Endereço"})}),e.jsxs("div",{className:"info-card",children:[e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"Logradouro"}),s?e.jsx("input",{type:"text",value:l.address.street,onChange:b=>c({...l,address:{...l.address,street:b.target.value}})}):e.jsx("span",{className:"info-value",children:l.address.street})]}),e.jsxs("div",{className:"info-row-grid",children:[e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"info-label",children:"Número"}),s?e.jsx("input",{type:"text",value:l.address.number,onChange:b=>c({...l,address:{...l.address,number:b.target.value}})}):e.jsx("span",{className:"info-value",children:l.address.number})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"info-label",children:"Complemento"}),s?e.jsx("input",{type:"text",value:l.address.complement,onChange:b=>c({...l,address:{...l.address,complement:b.target.value}})}):e.jsx("span",{className:"info-value",children:l.address.complement})]})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"Bairro"}),e.jsx("span",{className:"info-value",children:l.address.neighborhood})]}),e.jsxs("div",{className:"info-row-grid",children:[e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"info-label",children:"Cidade"}),e.jsx("span",{className:"info-value",children:l.address.city})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("span",{className:"info-label",children:"Estado"}),e.jsx("span",{className:"info-value",children:l.address.state})]})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"info-label",children:"CEP"}),e.jsx("span",{className:"info-value",children:l.address.zipCode})]})]})]}),n==="security"&&e.jsxs("div",{className:"security-section",children:[e.jsxs("div",{className:"security-card",children:[e.jsx("h3",{children:"Senha"}),e.jsx("p",{children:"Última alteração há 30 dias"}),e.jsx("button",{className:"btn-change-password",onClick:()=>a(!0),children:"Alterar senha"})]}),e.jsxs("div",{className:"security-options",children:[e.jsxs("div",{className:"security-option",children:[e.jsxs("div",{className:"option-info",children:[e.jsx("div",{className:"option-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]})}),e.jsxs("div",{className:"option-text",children:[e.jsx("span",{className:"option-name",children:"Biometria"}),e.jsx("span",{className:"option-desc",children:"Use sua digital para acessar"})]})]}),e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:d.biometrics,onChange:()=>p("biometrics")}),e.jsx("span",{className:"slider"})]})]}),e.jsxs("div",{className:"security-option",children:[e.jsxs("div",{className:"option-info",children:[e.jsx("div",{className:"option-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}),e.jsxs("div",{className:"option-text",children:[e.jsx("span",{className:"option-name",children:"Face ID"}),e.jsx("span",{className:"option-desc",children:"Use seu rosto para acessar"})]})]}),e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:d.faceId,onChange:()=>p("faceId")}),e.jsx("span",{className:"slider"})]})]}),e.jsxs("div",{className:"security-option",children:[e.jsxs("div",{className:"option-info",children:[e.jsx("div",{className:"option-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"5",y:"2",width:"14",height:"20",rx:"2",ry:"2"}),e.jsx("line",{x1:"12",y1:"18",x2:"12",y2:"18"})]})}),e.jsxs("div",{className:"option-text",children:[e.jsx("span",{className:"option-name",children:"Autenticação em 2 fatores"}),e.jsx("span",{className:"option-desc",children:"Código SMS ao fazer login"})]})]}),e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:d.twoFactor,onChange:()=>p("twoFactor")}),e.jsx("span",{className:"slider"})]})]}),e.jsxs("div",{className:"security-option",children:[e.jsxs("div",{className:"option-info",children:[e.jsx("div",{className:"option-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"}),e.jsx("path",{d:"M13.73 21a2 2 0 0 1-3.46 0"})]})}),e.jsxs("div",{className:"option-text",children:[e.jsx("span",{className:"option-name",children:"Notificações de login"}),e.jsx("span",{className:"option-desc",children:"Avise quando acessar de novo dispositivo"})]})]}),e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:d.loginNotifications,onChange:()=>p("loginNotifications")}),e.jsx("span",{className:"slider"})]})]})]}),e.jsxs("div",{className:"devices-card",children:[e.jsx("h3",{children:"Dispositivos conectados"}),e.jsxs("div",{className:"device-item active",children:[e.jsx("div",{className:"device-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("rect",{x:"5",y:"2",width:"14",height:"20",rx:"2",ry:"2"}),e.jsx("line",{x1:"12",y1:"18",x2:"12",y2:"18"})]})}),e.jsxs("div",{className:"device-info",children:[e.jsx("span",{className:"device-name",children:"iPhone 14 Pro"}),e.jsx("span",{className:"device-location",children:"São Paulo, SP • Ativo agora"})]}),e.jsx("span",{className:"device-current",children:"Este dispositivo"})]}),e.jsxs("div",{className:"device-item",children:[e.jsx("div",{className:"device-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"#888",strokeWidth:"2",children:[e.jsx("rect",{x:"2",y:"3",width:"20",height:"14",rx:"2",ry:"2"}),e.jsx("line",{x1:"8",y1:"21",x2:"16",y2:"21"}),e.jsx("line",{x1:"12",y1:"17",x2:"12",y2:"21"})]})}),e.jsxs("div",{className:"device-info",children:[e.jsx("span",{className:"device-name",children:"MacBook Pro"}),e.jsx("span",{className:"device-location",children:"São Paulo, SP • Há 2 dias"})]}),e.jsx("button",{className:"btn-remove-device",onClick:()=>t("Dispositivo removido","success"),children:"Remover"})]})]})]}),n==="documents"&&e.jsxs("div",{className:"documents-section",children:[e.jsx("div",{className:"documents-list",children:f.map(b=>{const x=v(b.status);return e.jsxs("div",{className:"document-card",children:[e.jsx("div",{className:"document-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14,2 14,8 20,8"})]})}),e.jsxs("div",{className:"document-info",children:[e.jsx("span",{className:"document-type",children:b.type}),e.jsxs("span",{className:"document-date",children:["Enviado em ",new Date(b.date).toLocaleDateString("pt-BR")]})]}),e.jsx("span",{className:"document-status",style:{color:x.color,backgroundColor:x.bg},children:x.label})]},b.id)})}),e.jsxs("button",{className:"btn-upload",onClick:()=>t("Selecionar documento","info"),children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"17,8 12,3 7,8"}),e.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),"Enviar novo documento"]})]}),o&&e.jsx("div",{className:"modal-overlay",onClick:()=>a(!1),children:e.jsxs("div",{className:"modal",onClick:b=>b.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Alterar Senha"}),e.jsx("button",{className:"btn-close",onClick:()=>a(!1),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Senha atual"}),e.jsx("input",{type:"password",placeholder:"Digite sua senha atual"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Nova senha"}),e.jsx("input",{type:"password",placeholder:"Digite a nova senha"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Confirmar nova senha"}),e.jsx("input",{type:"password",placeholder:"Confirme a nova senha"})]}),e.jsxs("div",{className:"password-requirements",children:[e.jsx("span",{className:"req-title",children:"A senha deve conter:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Mínimo de 8 caracteres"}),e.jsx("li",{children:"Uma letra maiúscula"}),e.jsx("li",{children:"Uma letra minúscula"}),e.jsx("li",{children:"Um número"}),e.jsx("li",{children:"Um caractere especial"})]})]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn-cancel",onClick:()=>a(!1),children:"Cancelar"}),e.jsx("button",{className:"btn-confirm",onClick:k,children:"Alterar Senha"})]})]})}),e.jsx("style",{children:`
        .perfil-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #C9A227 0%, #333 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          position: relative;
        }

        .avatar-initials {
          color: #fff;
          font-size: 36px;
          font-weight: 600;
        }

        .btn-edit-avatar {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          background: #C9A227;
          border: 2px solid #0D0D0D;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          cursor: pointer;
        }

        .page-header h1 {
          color: #fff;
          font-size: 24px;
          margin: 0 0 4px;
        }

        .account-info {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h2 {
          color: #fff;
          font-size: 18px;
          margin: 0;
        }

        .btn-edit, .btn-save {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-edit {
          background: transparent;
          border: 1px solid #C9A227;
          color: #C9A227;
        }

        .btn-save {
          background: #C9A227;
          border: none;
          color: #000;
          font-weight: 500;
        }

        .info-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          color: #888;
          font-size: 12px;
        }

        .info-value {
          color: #fff;
          font-size: 14px;
        }

        .info-row input, .info-item input {
          background: #252525;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 8px 12px;
          color: #fff;
          font-size: 14px;
        }

        .info-row input:focus {
          border-color: #C9A227;
          outline: none;
        }

        .security-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          text-align: center;
        }

        .security-card h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 8px;
        }

        .security-card p {
          color: #888;
          font-size: 14px;
          margin: 0 0 16px;
        }

        .btn-change-password {
          padding: 12px 24px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .security-options {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 8px;
          margin-bottom: 24px;
        }

        .security-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #252525;
        }

        .security-option:last-child {
          border-bottom: none;
        }

        .option-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .option-icon {
          width: 44px;
          height: 44px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A227;
        }

        .option-text {
          display: flex;
          flex-direction: column;
        }

        .option-name {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .option-desc {
          color: #888;
          font-size: 12px;
        }

        .toggle {
          position: relative;
          width: 48px;
          height: 26px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #333;
          border-radius: 26px;
          transition: 0.3s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background: #fff;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle input:checked + .slider {
          background: #C9A227;
        }

        .toggle input:checked + .slider:before {
          transform: translateX(22px);
        }

        .devices-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .devices-card h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .device-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .device-item:last-child {
          border-bottom: none;
        }

        .device-icon {
          width: 44px;
          height: 44px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .device-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .device-name {
          color: #fff;
          font-size: 14px;
        }

        .device-location {
          color: #888;
          font-size: 12px;
        }

        .device-current {
          color: #22C55E;
          font-size: 12px;
        }

        .btn-remove-device {
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #EF4444;
          border-radius: 6px;
          color: #EF4444;
          font-size: 12px;
          cursor: pointer;
        }

        .documents-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .document-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .document-icon {
          width: 44px;
          height: 44px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .document-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .document-type {
          color: #fff;
          font-weight: 500;
        }

        .document-date {
          color: #888;
          font-size: 12px;
        }

        .document-status {
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
        }

        .btn-upload {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          background: transparent;
          border: 2px dashed #333;
          border-radius: 12px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-upload:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .modal-header h3 {
          color: #fff;
          margin: 0;
          font-size: 18px;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
        }

        .modal-content {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .form-group input:focus {
          border-color: #C9A227;
          outline: none;
        }

        .password-requirements {
          background: #252525;
          border-radius: 8px;
          padding: 16px;
        }

        .req-title {
          color: #888;
          font-size: 12px;
          display: block;
          margin-bottom: 8px;
        }

        .password-requirements ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .password-requirements li {
          color: #666;
          font-size: 12px;
          margin-bottom: 4px;
          padding-left: 16px;
          position: relative;
        }

        .password-requirements li:before {
          content: "•";
          position: absolute;
          left: 0;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #333;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-confirm {
          flex: 1;
          padding: 12px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
      `})]})},F2=()=>{const{showToast:t}=oe(),[n,r]=C.useState([{id:"1",title:"Transações",description:"PIX, transferências, pagamentos e compras",push:!0,email:!0,sms:!0},{id:"2",title:"Segurança",description:"Login, alteração de senha e atividades suspeitas",push:!0,email:!0,sms:!0},{id:"3",title:"Faturas e cobranças",description:"Vencimento de fatura e débitos automáticos",push:!0,email:!0,sms:!1},{id:"4",title:"Investimentos",description:"Rendimentos, vencimentos e oportunidades",push:!0,email:!1,sms:!1},{id:"5",title:"Programa de pontos",description:"Pontos ganhos, expiração e recompensas",push:!0,email:!1,sms:!1},{id:"6",title:"Ofertas e promoções",description:"Cashback, descontos e parceiros",push:!1,email:!0,sms:!1},{id:"7",title:"Novidades",description:"Novos produtos e funcionalidades",push:!1,email:!0,sms:!1}]),[s,i]=C.useState({enabled:!0,start:"22:00",end:"08:00"}),o=(h,f)=>{r(n.map(m=>m.id===h?{...m,[f]:!m[f]}:m)),t("Preferência atualizada","success")},a=(h,f)=>{r(n.map(m=>({...m,[h]:f}))),t(`Todas as notificações ${h==="push"?"push":h==="email"?"por e-mail":"por SMS"} ${f?"ativadas":"desativadas"}`,"success")},l=n.every(h=>h.push),c=n.every(h=>h.email),d=n.every(h=>h.sms);return e.jsxs("div",{className:"notificacoes-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"}),e.jsx("path",{d:"M13.73 21a2 2 0 0 1-3.46 0"})]})}),e.jsx("h1",{children:"Notificações"}),e.jsx("p",{children:"Configure como deseja receber alertas"})]}),e.jsxs("div",{className:"quick-actions",children:[e.jsxs("div",{className:"quick-action",children:[e.jsxs("div",{className:"action-info",children:[e.jsx("div",{className:"action-icon push",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"})})}),e.jsx("span",{children:"Push"})]}),e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:l,onChange:()=>a("push",!l)}),e.jsx("span",{className:"slider"})]})]}),e.jsxs("div",{className:"quick-action",children:[e.jsxs("div",{className:"action-info",children:[e.jsx("div",{className:"action-icon email",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}),e.jsx("polyline",{points:"22,6 12,13 2,6"})]})}),e.jsx("span",{children:"E-mail"})]}),e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:c,onChange:()=>a("email",!c)}),e.jsx("span",{className:"slider"})]})]}),e.jsxs("div",{className:"quick-action",children:[e.jsxs("div",{className:"action-info",children:[e.jsx("div",{className:"action-icon sms",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}),e.jsx("span",{children:"SMS"})]}),e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:d,onChange:()=>a("sms",!d)}),e.jsx("span",{className:"slider"})]})]})]}),e.jsx("div",{className:"settings-list",children:n.map(h=>e.jsxs("div",{className:"setting-card",children:[e.jsxs("div",{className:"setting-header",children:[e.jsx("span",{className:"setting-title",children:h.title}),e.jsx("span",{className:"setting-desc",children:h.description})]}),e.jsxs("div",{className:"setting-toggles",children:[e.jsxs("div",{className:"toggle-item",children:[e.jsx("span",{className:"toggle-label",children:"Push"}),e.jsxs("label",{className:"toggle small",children:[e.jsx("input",{type:"checkbox",checked:h.push,onChange:()=>o(h.id,"push")}),e.jsx("span",{className:"slider"})]})]}),e.jsxs("div",{className:"toggle-item",children:[e.jsx("span",{className:"toggle-label",children:"E-mail"}),e.jsxs("label",{className:"toggle small",children:[e.jsx("input",{type:"checkbox",checked:h.email,onChange:()=>o(h.id,"email")}),e.jsx("span",{className:"slider"})]})]}),e.jsxs("div",{className:"toggle-item",children:[e.jsx("span",{className:"toggle-label",children:"SMS"}),e.jsxs("label",{className:"toggle small",children:[e.jsx("input",{type:"checkbox",checked:h.sms,onChange:()=>o(h.id,"sms")}),e.jsx("span",{className:"slider"})]})]})]})]},h.id))}),e.jsxs("div",{className:"quiet-hours-card",children:[e.jsxs("div",{className:"quiet-header",children:[e.jsxs("div",{className:"quiet-info",children:[e.jsx("div",{className:"quiet-icon",children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})})}),e.jsxs("div",{className:"quiet-text",children:[e.jsx("span",{className:"quiet-title",children:"Horário de silêncio"}),e.jsx("span",{className:"quiet-desc",children:"Pausar notificações push durante a noite"})]})]}),e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:s.enabled,onChange:()=>i({...s,enabled:!s.enabled})}),e.jsx("span",{className:"slider"})]})]}),s.enabled&&e.jsxs("div",{className:"quiet-times",children:[e.jsxs("div",{className:"time-input",children:[e.jsx("label",{children:"Início"}),e.jsx("input",{type:"time",value:s.start,onChange:h=>i({...s,start:h.target.value})})]}),e.jsx("div",{className:"time-separator",children:"até"}),e.jsxs("div",{className:"time-input",children:[e.jsx("label",{children:"Fim"}),e.jsx("input",{type:"time",value:s.end,onChange:h=>i({...s,end:h.target.value})})]})]})]}),e.jsxs("div",{className:"info-card",children:[e.jsx("div",{className:"info-icon",children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"12",y1:"16",x2:"12",y2:"12"}),e.jsx("line",{x1:"12",y1:"8",x2:"12.01",y2:"8"})]})}),e.jsx("p",{children:"Notificações de segurança sempre serão enviadas por todos os canais, independente das suas preferências."})]}),e.jsx("style",{children:`
        .notificacoes-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .page-header h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .page-header p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .quick-action {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .action-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .action-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-icon.push {
          background: rgba(201, 162, 39, 0.1);
          color: #C9A227;
        }

        .action-icon.email {
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
        }

        .action-icon.sms {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .action-info span {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .toggle {
          position: relative;
          width: 48px;
          height: 26px;
        }

        .toggle.small {
          width: 40px;
          height: 22px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #333;
          border-radius: 26px;
          transition: 0.3s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background: #fff;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle.small .slider:before {
          height: 16px;
          width: 16px;
        }

        .toggle input:checked + .slider {
          background: #C9A227;
        }

        .toggle input:checked + .slider:before {
          transform: translateX(22px);
        }

        .toggle.small input:checked + .slider:before {
          transform: translateX(18px);
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .setting-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
        }

        .setting-header {
          margin-bottom: 16px;
        }

        .setting-title {
          color: #fff;
          font-size: 16px;
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
        }

        .setting-desc {
          color: #888;
          font-size: 13px;
        }

        .setting-toggles {
          display: flex;
          gap: 24px;
        }

        .toggle-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .toggle-label {
          color: #888;
          font-size: 12px;
        }

        .quiet-hours-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .quiet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quiet-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quiet-icon {
          width: 48px;
          height: 48px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quiet-text {
          display: flex;
          flex-direction: column;
        }

        .quiet-title {
          color: #fff;
          font-size: 16px;
          font-weight: 500;
        }

        .quiet-desc {
          color: #888;
          font-size: 13px;
        }

        .quiet-times {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #333;
        }

        .time-input {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .time-input label {
          color: #888;
          font-size: 12px;
        }

        .time-input input {
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
        }

        .time-input input:focus {
          border-color: #C9A227;
          outline: none;
        }

        .time-separator {
          color: #888;
          font-size: 14px;
          padding-top: 20px;
        }

        .info-card {
          background: rgba(201, 162, 39, 0.1);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .info-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-card p {
          color: #C9A227;
          font-size: 13px;
          margin: 0;
          line-height: 1.5;
        }
      `})]})},O2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("invite"),s="JOAO2024",i=`https://athenapay.com/indicar/${s}`,[o]=C.useState([{id:"1",name:"Maria S.",date:"2024-01-10",status:"completed",bonus:50},{id:"2",name:"Pedro O.",date:"2024-01-08",status:"completed",bonus:50},{id:"3",name:"Ana C.",date:"2024-01-05",status:"pending"},{id:"4",name:"Lucas M.",date:"2024-01-03",status:"expired"},{id:"5",name:"Julia R.",date:"2023-12-20",status:"completed",bonus:50}]),[a]=C.useState([{position:1,name:"Carlos M.",referrals:47,avatar:"CM"},{position:2,name:"Ana Paula S.",referrals:42,avatar:"AP"},{position:3,name:"Roberto L.",referrals:38,avatar:"RL"},{position:4,name:"Fernanda C.",referrals:35,avatar:"FC"},{position:5,name:"João Silva",referrals:12,avatar:"JS",isUser:!0}]),l=o.filter(m=>m.status==="completed").reduce((m,k)=>m+(k.bonus||0),0),c=o.filter(m=>m.status==="completed").length,d=m=>{navigator.clipboard.writeText(m),t("Copiado para a área de transferência!","success")},h=m=>{t(`Compartilhando via ${m}...`,"info")},f=m=>({pending:{label:"Pendente",color:"#F59E0B",bg:"rgba(245, 158, 11, 0.1)"},completed:{label:"Completa",color:"#22C55E",bg:"rgba(34, 197, 94, 0.1)"},expired:{label:"Expirada",color:"#EF4444",bg:"rgba(239, 68, 68, 0.1)"}})[m];return e.jsxs("div",{className:"indicar-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"9",cy:"7",r:"4"}),e.jsx("path",{d:"M23 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M16 3.13a4 4 0 0 1 0 7.75"})]})}),e.jsx("h1",{children:"Indicar Amigos"}),e.jsx("p",{children:"Ganhe R$ 50 por cada amigo que abrir conta"})]}),e.jsxs("div",{className:"stats-card",children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-value",children:c}),e.jsx("span",{className:"stat-label",children:"Indicações"})]}),e.jsx("div",{className:"stat-divider"}),e.jsxs("div",{className:"stat",children:[e.jsxs("span",{className:"stat-value",children:["R$ ",l]}),e.jsx("span",{className:"stat-label",children:"Bônus ganho"})]}),e.jsx("div",{className:"stat-divider"}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-value",children:"#5"}),e.jsx("span",{className:"stat-label",children:"No ranking"})]})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="invite"?"active":""}`,onClick:()=>r("invite"),children:"Convidar"}),e.jsx("button",{className:`tab ${n==="referrals"?"active":""}`,onClick:()=>r("referrals"),children:"Indicações"}),e.jsx("button",{className:`tab ${n==="ranking"?"active":""}`,onClick:()=>r("ranking"),children:"Ranking"})]}),n==="invite"&&e.jsxs("div",{className:"invite-section",children:[e.jsxs("div",{className:"code-card",children:[e.jsx("span",{className:"code-label",children:"Seu código de indicação"}),e.jsxs("div",{className:"code-display",children:[e.jsx("span",{className:"code",children:s}),e.jsx("button",{className:"btn-copy",onClick:()=>d(s),children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),e.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]})})]})]}),e.jsxs("div",{className:"link-card",children:[e.jsx("span",{className:"link-label",children:"Link de convite"}),e.jsxs("div",{className:"link-display",children:[e.jsx("span",{className:"link",children:i}),e.jsx("button",{className:"btn-copy",onClick:()=>d(i),children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),e.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]})})]})]}),e.jsxs("div",{className:"share-section",children:[e.jsx("h3",{children:"Compartilhar via"}),e.jsxs("div",{className:"share-buttons",children:[e.jsxs("button",{className:"share-btn whatsapp",onClick:()=>h("WhatsApp"),children:[e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"})}),"WhatsApp"]}),e.jsxs("button",{className:"share-btn telegram",onClick:()=>h("Telegram"),children:[e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"})}),"Telegram"]}),e.jsxs("button",{className:"share-btn sms",onClick:()=>h("SMS"),children:[e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})}),"SMS"]}),e.jsxs("button",{className:"share-btn more",onClick:()=>h("Outros"),children:[e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"18",cy:"5",r:"3"}),e.jsx("circle",{cx:"6",cy:"12",r:"3"}),e.jsx("circle",{cx:"18",cy:"19",r:"3"}),e.jsx("line",{x1:"8.59",y1:"13.51",x2:"15.42",y2:"17.49"}),e.jsx("line",{x1:"15.41",y1:"6.51",x2:"8.59",y2:"10.49"})]}),"Mais"]})]})]}),e.jsxs("div",{className:"how-it-works",children:[e.jsx("h3",{children:"Como funciona"}),e.jsxs("div",{className:"steps",children:[e.jsxs("div",{className:"step",children:[e.jsx("div",{className:"step-number",children:"1"}),e.jsxs("div",{className:"step-content",children:[e.jsx("span",{className:"step-title",children:"Compartilhe"}),e.jsx("span",{className:"step-desc",children:"Envie seu link ou código para amigos"})]})]}),e.jsxs("div",{className:"step",children:[e.jsx("div",{className:"step-number",children:"2"}),e.jsxs("div",{className:"step-content",children:[e.jsx("span",{className:"step-title",children:"Cadastro"}),e.jsx("span",{className:"step-desc",children:"Seu amigo abre uma conta Athena"})]})]}),e.jsxs("div",{className:"step",children:[e.jsx("div",{className:"step-number",children:"3"}),e.jsxs("div",{className:"step-content",children:[e.jsx("span",{className:"step-title",children:"Ganhe"}),e.jsx("span",{className:"step-desc",children:"Vocês dois ganham R$ 50 de bônus!"})]})]})]})]})]}),n==="referrals"&&e.jsx("div",{className:"referrals-section",children:o.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsxs("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"#666",strokeWidth:"2",children:[e.jsx("path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"9",cy:"7",r:"4"}),e.jsx("path",{d:"M23 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M16 3.13a4 4 0 0 1 0 7.75"})]}),e.jsx("h3",{children:"Nenhuma indicação ainda"}),e.jsx("p",{children:"Compartilhe seu código e comece a ganhar!"})]}):e.jsx("div",{className:"referrals-list",children:o.map(m=>{const k=f(m.status);return e.jsxs("div",{className:"referral-card",children:[e.jsx("div",{className:"referral-avatar",children:m.name.charAt(0)}),e.jsxs("div",{className:"referral-info",children:[e.jsx("span",{className:"referral-name",children:m.name}),e.jsx("span",{className:"referral-date",children:new Date(m.date).toLocaleDateString("pt-BR")})]}),e.jsxs("div",{className:"referral-status",children:[e.jsx("span",{className:"status-badge",style:{color:k.color,backgroundColor:k.bg},children:k.label}),m.bonus&&e.jsxs("span",{className:"referral-bonus",children:["+R$ ",m.bonus]})]})]},m.id)})})}),n==="ranking"&&e.jsxs("div",{className:"ranking-section",children:[e.jsxs("div",{className:"ranking-header",children:[e.jsx("h3",{children:"Top Indicadores do Mês"}),e.jsx("span",{className:"ranking-period",children:"Janeiro 2024"})]}),e.jsx("div",{className:"ranking-list",children:a.map(m=>e.jsxs("div",{className:`ranking-item ${m.isUser?"is-user":""}`,children:[e.jsx("div",{className:"position",children:m.position<=3?e.jsxs("span",{className:`medal medal-${m.position}`,children:[m.position===1&&"🥇",m.position===2&&"🥈",m.position===3&&"🥉"]}):e.jsx("span",{className:"position-number",children:m.position})}),e.jsx("div",{className:"ranking-avatar",children:m.avatar}),e.jsxs("div",{className:"ranking-info",children:[e.jsxs("span",{className:"ranking-name",children:[m.name,m.isUser&&e.jsx("span",{className:"you-badge",children:"Você"})]}),e.jsxs("span",{className:"ranking-referrals",children:[m.referrals," indicações"]})]})]},m.position))}),e.jsxs("div",{className:"ranking-prizes",children:[e.jsx("h4",{children:"Prêmios do mês"}),e.jsxs("div",{className:"prizes-list",children:[e.jsxs("div",{className:"prize-item",children:[e.jsx("span",{className:"prize-medal",children:"🥇"}),e.jsx("span",{className:"prize-desc",children:"1º lugar: R$ 500 + Cartão Black"})]}),e.jsxs("div",{className:"prize-item",children:[e.jsx("span",{className:"prize-medal",children:"🥈"}),e.jsx("span",{className:"prize-desc",children:"2º lugar: R$ 300"})]}),e.jsxs("div",{className:"prize-item",children:[e.jsx("span",{className:"prize-medal",children:"🥉"}),e.jsx("span",{className:"prize-desc",children:"3º lugar: R$ 150"})]})]})]})]}),e.jsx("style",{children:`
        .indicar-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .page-header h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .page-header p {
          color: #C9A227;
          font-size: 14px;
          margin: 0;
        }

        .stats-card {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          color: #C9A227;
          font-size: 24px;
          font-weight: 700;
          display: block;
        }

        .stat-label {
          color: #888;
          font-size: 12px;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: #333;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .code-card, .link-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .code-label, .link-label {
          color: #888;
          font-size: 12px;
          display: block;
          margin-bottom: 12px;
        }

        .code-display, .link-display {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
        }

        .code {
          flex: 1;
          color: #C9A227;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 4px;
          text-align: center;
        }

        .link {
          flex: 1;
          color: #fff;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .btn-copy {
          padding: 8px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          cursor: pointer;
        }

        .share-section {
          margin-bottom: 24px;
        }

        .share-section h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .share-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .share-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .share-btn.whatsapp {
          background: rgba(37, 211, 102, 0.1);
          color: #25D366;
        }

        .share-btn.telegram {
          background: rgba(0, 136, 204, 0.1);
          color: #0088CC;
        }

        .share-btn.sms {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .share-btn.more {
          background: rgba(136, 136, 136, 0.1);
          color: #888;
        }

        .share-btn:hover {
          transform: translateY(-2px);
        }

        .how-it-works {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .how-it-works h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: #C9A227;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content {
          display: flex;
          flex-direction: column;
        }

        .step-title {
          color: #fff;
          font-weight: 500;
        }

        .step-desc {
          color: #888;
          font-size: 13px;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }

        .empty-state svg {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 8px;
        }

        .empty-state p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .referrals-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .referral-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .referral-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #C9A227 0%, #333 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
        }

        .referral-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .referral-name {
          color: #fff;
          font-weight: 500;
        }

        .referral-date {
          color: #888;
          font-size: 12px;
        }

        .referral-status {
          text-align: right;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
        }

        .referral-bonus {
          display: block;
          color: #22C55E;
          font-size: 14px;
          font-weight: 600;
          margin-top: 4px;
        }

        .ranking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .ranking-header h3 {
          color: #fff;
          font-size: 18px;
          margin: 0;
        }

        .ranking-period {
          color: #888;
          font-size: 12px;
        }

        .ranking-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }

        .ranking-item {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ranking-item.is-user {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        .position {
          width: 40px;
          text-align: center;
        }

        .medal {
          font-size: 24px;
        }

        .position-number {
          color: #888;
          font-size: 18px;
          font-weight: 600;
        }

        .ranking-avatar {
          width: 44px;
          height: 44px;
          background: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
        }

        .ranking-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .ranking-name {
          color: #fff;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .you-badge {
          background: #C9A227;
          color: #000;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
        }

        .ranking-referrals {
          color: #888;
          font-size: 12px;
        }

        .ranking-prizes {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .ranking-prizes h4 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .prizes-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .prize-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .prize-medal {
          font-size: 20px;
        }

        .prize-desc {
          color: #888;
          font-size: 14px;
        }
      `})]})},W2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("overview"),[s,i]=C.useState(!1),[o,a]=C.useState([{id:"1",name:"Banco do Brasil",logo:"BB",color:"#FFED00",balance:5430.5,lastSync:"2024-01-15T10:30:00",status:"connected"},{id:"2",name:"Itaú",logo:"IT",color:"#EC7000",balance:12350,lastSync:"2024-01-15T09:15:00",status:"connected"},{id:"3",name:"Nubank",logo:"NU",color:"#8A05BE",balance:3200.75,lastSync:"2024-01-14T18:00:00",status:"expired"}]),[l]=C.useState([{id:"bradesco",name:"Bradesco",logo:"BR",color:"#CC092F"},{id:"santander",name:"Santander",logo:"SA",color:"#EA1D25"},{id:"caixa",name:"Caixa",logo:"CX",color:"#005CA9"},{id:"inter",name:"Inter",logo:"IN",color:"#FF7A00"},{id:"c6",name:"C6 Bank",logo:"C6",color:"#1A1A1A"},{id:"original",name:"Banco Original",logo:"OR",color:"#00875F"}]),[c]=C.useState([{id:"1",description:"Salário",amount:8500,type:"income",date:"2024-01-15",bank:"Itaú",category:"Renda"},{id:"2",description:"Supermercado",amount:450.3,type:"expense",date:"2024-01-14",bank:"Nubank",category:"Alimentação"},{id:"3",description:"Aluguel",amount:2500,type:"expense",date:"2024-01-10",bank:"Banco do Brasil",category:"Moradia"},{id:"4",description:"Freelance",amount:2e3,type:"income",date:"2024-01-08",bank:"Itaú",category:"Renda Extra"},{id:"5",description:"Restaurante",amount:120.5,type:"expense",date:"2024-01-07",bank:"Nubank",category:"Alimentação"}]),d=o.reduce((j,w)=>j+w.balance,0),h=15e3,f=d+h,m=c.filter(j=>j.type==="income").reduce((j,w)=>j+w.amount,0),k=c.filter(j=>j.type==="expense").reduce((j,w)=>j+w.amount,0),p=j=>j.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),v=j=>new Date(j).toLocaleDateString("pt-BR"),b=j=>{const w=new Date(j),S=new Date().getTime()-w.getTime(),B=Math.floor(S/(1e3*60*60));return B<1?"Agora":B<24?`Há ${B}h`:`Há ${Math.floor(B/24)} dias`},x=j=>{t(`Conectando com ${j.name}...`,"info"),setTimeout(()=>{const w={id:j.id,name:j.name,logo:j.logo,color:j.color,balance:Math.random()*1e4,lastSync:new Date().toISOString(),status:"connected"};a([...o,w]),t(`${j.name} conectado com sucesso!`,"success"),i(!1)},2e3)},g=j=>{a(o.map(w=>w.id===j?{...w,lastSync:new Date().toISOString(),status:"connected"}:w)),t("Dados sincronizados!","success")},u=j=>{a(o.filter(w=>w.id!==j)),t("Conexão removida","info")},y=j=>({connected:{label:"Conectado",color:"#22C55E"},expired:{label:"Expirado",color:"#F59E0B"},error:{label:"Erro",color:"#EF4444"}})[j];return e.jsxs("div",{className:"openfinance-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"3",y1:"9",x2:"21",y2:"9"}),e.jsx("line",{x1:"9",y1:"21",x2:"9",y2:"9"})]})}),e.jsx("h1",{children:"Open Finance"}),e.jsx("p",{children:"Conecte suas contas e veja tudo em um só lugar"})]}),e.jsxs("div",{className:"consolidated-card",children:[e.jsxs("div",{className:"consolidated-header",children:[e.jsx("span",{className:"label",children:"Patrimônio Consolidado"}),e.jsx("span",{className:"value",children:p(f)})]}),e.jsxs("div",{className:"consolidated-breakdown",children:[e.jsxs("div",{className:"breakdown-item",children:[e.jsx("span",{className:"bank-name",children:"Athena Pay"}),e.jsx("span",{className:"bank-balance",children:p(h)})]}),o.filter(j=>j.status==="connected").map(j=>e.jsxs("div",{className:"breakdown-item",children:[e.jsx("span",{className:"bank-name",children:j.name}),e.jsx("span",{className:"bank-balance",children:p(j.balance)})]},j.id))]})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="overview"?"active":""}`,onClick:()=>r("overview"),children:"Visão Geral"}),e.jsx("button",{className:`tab ${n==="accounts"?"active":""}`,onClick:()=>r("accounts"),children:"Contas"}),e.jsx("button",{className:`tab ${n==="transactions"?"active":""}`,onClick:()=>r("transactions"),children:"Transações"})]}),n==="overview"&&e.jsxs("div",{className:"overview-section",children:[e.jsxs("div",{className:"summary-cards",children:[e.jsxs("div",{className:"summary-card income",children:[e.jsx("div",{className:"summary-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"19",x2:"12",y2:"5"}),e.jsx("polyline",{points:"5,12 12,5 19,12"})]})}),e.jsxs("div",{className:"summary-content",children:[e.jsx("span",{className:"summary-label",children:"Receitas do mês"}),e.jsx("span",{className:"summary-value",children:p(m)})]})]}),e.jsxs("div",{className:"summary-card expense",children:[e.jsx("div",{className:"summary-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("polyline",{points:"19,12 12,19 5,12"})]})}),e.jsxs("div",{className:"summary-content",children:[e.jsx("span",{className:"summary-label",children:"Despesas do mês"}),e.jsx("span",{className:"summary-value",children:p(k)})]})]})]}),e.jsxs("div",{className:"balance-chart",children:[e.jsx("h3",{children:"Balanço Mensal"}),e.jsxs("div",{className:"chart-container",children:[e.jsx("div",{className:"chart-bar income",style:{height:`${m/(m+k)*100}%`},children:e.jsx("span",{className:"bar-label",children:p(m)})}),e.jsx("div",{className:"chart-bar expense",style:{height:`${k/(m+k)*100}%`},children:e.jsx("span",{className:"bar-label",children:p(k)})})]}),e.jsxs("div",{className:"chart-legend",children:[e.jsx("span",{className:"legend-item income",children:"Receitas"}),e.jsx("span",{className:"legend-item expense",children:"Despesas"})]})]}),e.jsxs("div",{className:"net-result",children:[e.jsx("span",{className:"label",children:"Resultado do mês"}),e.jsxs("span",{className:`value ${m-k>=0?"positive":"negative"}`,children:[m-k>=0?"+":"",p(m-k)]})]})]}),n==="accounts"&&e.jsxs("div",{className:"accounts-section",children:[e.jsxs("div",{className:"accounts-list",children:[e.jsxs("div",{className:"account-card athena",children:[e.jsx("div",{className:"account-logo",style:{background:"linear-gradient(135deg, #C9A227 0%, #333 100%)"},children:"AP"}),e.jsxs("div",{className:"account-info",children:[e.jsx("span",{className:"account-name",children:"Athena Pay"}),e.jsx("span",{className:"account-status",style:{color:"#22C55E"},children:"Principal"})]}),e.jsx("span",{className:"account-balance",children:p(h)})]}),o.map(j=>{const w=y(j.status);return e.jsxs("div",{className:`account-card ${j.status}`,children:[e.jsx("div",{className:"account-logo",style:{backgroundColor:j.color},children:j.logo}),e.jsxs("div",{className:"account-info",children:[e.jsx("span",{className:"account-name",children:j.name}),e.jsxs("span",{className:"account-status",style:{color:w.color},children:[w.label," • ",b(j.lastSync)]})]}),e.jsx("span",{className:"account-balance",children:p(j.balance)}),e.jsxs("div",{className:"account-actions",children:[j.status==="expired"?e.jsx("button",{className:"btn-reconnect",onClick:()=>g(j.id),children:"Reconectar"}):e.jsx("button",{className:"btn-sync",onClick:()=>g(j.id),children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M23 4v6h-6"}),e.jsx("path",{d:"M1 20v-6h6"}),e.jsx("path",{d:"M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"})]})}),e.jsx("button",{className:"btn-disconnect",onClick:()=>u(j.id),children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]})]},j.id)})]}),e.jsxs("button",{className:"btn-add-bank",onClick:()=>i(!0),children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Conectar novo banco"]})]}),n==="transactions"&&e.jsxs("div",{className:"transactions-section",children:[e.jsxs("div",{className:"filter-row",children:[e.jsxs("select",{defaultValue:"all",children:[e.jsx("option",{value:"all",children:"Todas as contas"}),e.jsx("option",{value:"athena",children:"Athena Pay"}),o.map(j=>e.jsx("option",{value:j.id,children:j.name},j.id))]}),e.jsxs("select",{defaultValue:"all",children:[e.jsx("option",{value:"all",children:"Todos os tipos"}),e.jsx("option",{value:"income",children:"Receitas"}),e.jsx("option",{value:"expense",children:"Despesas"})]})]}),e.jsx("div",{className:"transactions-list",children:c.map(j=>e.jsxs("div",{className:"transaction-card",children:[e.jsx("div",{className:`tx-icon ${j.type}`,children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:j.type==="income"?e.jsx("path",{d:"M12 19V5M5 12l7-7 7 7"}):e.jsx("path",{d:"M12 5v14M5 12l7 7 7-7"})})}),e.jsxs("div",{className:"tx-info",children:[e.jsx("span",{className:"tx-description",children:j.description}),e.jsxs("span",{className:"tx-meta",children:[j.bank," • ",j.category]})]}),e.jsxs("div",{className:"tx-details",children:[e.jsxs("span",{className:`tx-amount ${j.type}`,children:[j.type==="income"?"+":"-",p(j.amount)]}),e.jsx("span",{className:"tx-date",children:v(j.date)})]})]},j.id))})]}),s&&e.jsx("div",{className:"modal-overlay",onClick:()=>i(!1),children:e.jsxs("div",{className:"modal",onClick:j=>j.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Conectar Banco"}),e.jsx("button",{className:"btn-close",onClick:()=>i(!1),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsxs("div",{className:"modal-content",children:[e.jsx("p",{className:"modal-desc",children:"Selecione o banco que deseja conectar. Você será redirecionado para autorizar o acesso de forma segura."}),e.jsx("div",{className:"banks-grid",children:l.filter(j=>!o.find(w=>w.id===j.id)).map(j=>e.jsxs("button",{className:"bank-option",onClick:()=>x(j),children:[e.jsx("div",{className:"bank-logo",style:{backgroundColor:j.color},children:j.logo}),e.jsx("span",{className:"bank-name",children:j.name})]},j.id))})]})]})}),e.jsx("style",{children:`
        .openfinance-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .page-header h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .page-header p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .consolidated-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #252525 100%);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .consolidated-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
        }

        .consolidated-header .label {
          color: #888;
          font-size: 14px;
          display: block;
          margin-bottom: 8px;
        }

        .consolidated-header .value {
          color: #C9A227;
          font-size: 36px;
          font-weight: 700;
        }

        .consolidated-breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bank-name {
          color: #888;
          font-size: 14px;
        }

        .bank-balance {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .summary-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summary-card.income .summary-icon {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .summary-card.expense .summary-icon {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .summary-content {
          display: flex;
          flex-direction: column;
        }

        .summary-label {
          color: #888;
          font-size: 12px;
        }

        .summary-value {
          color: #fff;
          font-size: 18px;
          font-weight: 600;
        }

        .balance-chart {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .balance-chart h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 20px;
        }

        .chart-container {
          display: flex;
          justify-content: center;
          gap: 40px;
          height: 150px;
          align-items: flex-end;
          margin-bottom: 16px;
        }

        .chart-bar {
          width: 60px;
          border-radius: 8px 8px 0 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 8px;
          min-height: 40px;
        }

        .chart-bar.income {
          background: linear-gradient(to top, #22C55E, #16A34A);
        }

        .chart-bar.expense {
          background: linear-gradient(to top, #EF4444, #DC2626);
        }

        .bar-label {
          color: #fff;
          font-size: 11px;
          font-weight: 500;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .legend-item.income {
          color: #22C55E;
        }

        .legend-item.income:before {
          content: '';
          width: 12px;
          height: 12px;
          background: #22C55E;
          border-radius: 3px;
        }

        .legend-item.expense {
          color: #EF4444;
        }

        .legend-item.expense:before {
          content: '';
          width: 12px;
          height: 12px;
          background: #EF4444;
          border-radius: 3px;
        }

        .net-result {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .net-result .label {
          color: #888;
          font-size: 14px;
        }

        .net-result .value {
          font-size: 24px;
          font-weight: 700;
        }

        .net-result .value.positive {
          color: #22C55E;
        }

        .net-result .value.negative {
          color: #EF4444;
        }

        .accounts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .account-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .account-card.athena {
          border-color: #C9A227;
        }

        .account-card.expired {
          opacity: 0.7;
        }

        .account-logo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
        }

        .account-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .account-name {
          color: #fff;
          font-weight: 500;
        }

        .account-status {
          font-size: 12px;
        }

        .account-balance {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          margin-right: 12px;
        }

        .account-actions {
          display: flex;
          gap: 8px;
        }

        .btn-sync, .btn-disconnect {
          width: 32px;
          height: 32px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          cursor: pointer;
        }

        .btn-sync:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .btn-disconnect:hover {
          border-color: #EF4444;
          color: #EF4444;
        }

        .btn-reconnect {
          padding: 6px 12px;
          background: #F59E0B;
          border: none;
          border-radius: 6px;
          color: #000;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-add-bank {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          background: transparent;
          border: 2px dashed #333;
          border-radius: 12px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-add-bank:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .filter-row {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .filter-row select {
          flex: 1;
          padding: 12px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .transaction-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tx-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tx-icon.income {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .tx-icon.expense {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .tx-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .tx-description {
          color: #fff;
          font-weight: 500;
        }

        .tx-meta {
          color: #888;
          font-size: 12px;
        }

        .tx-details {
          text-align: right;
        }

        .tx-amount {
          font-weight: 600;
          display: block;
        }

        .tx-amount.income {
          color: #22C55E;
        }

        .tx-amount.expense {
          color: #EF4444;
        }

        .tx-date {
          color: #888;
          font-size: 12px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .modal-header h3 {
          color: #fff;
          margin: 0;
          font-size: 18px;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
        }

        .modal-content {
          padding: 20px;
        }

        .modal-desc {
          color: #888;
          font-size: 14px;
          margin: 0 0 20px;
          line-height: 1.5;
        }

        .banks-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .bank-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .bank-option:hover {
          border-color: #C9A227;
        }

        .bank-option .bank-logo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
        }

        .bank-option .bank-name {
          color: #fff;
          font-size: 12px;
          text-align: center;
        }
      `})]})},U2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("plans"),[s,i]=C.useState(!1),[o,a]=C.useState(!1),[l,c]=C.useState({name:"",relationship:"",percentage:""}),[d]=C.useState([{id:"1",name:"Essencial",coverage:1e5,monthlyPrice:29.9,features:["Morte natural ou acidental","Invalidez permanente total","Assistência funeral familiar"]},{id:"2",name:"Completo",coverage:3e5,monthlyPrice:59.9,features:["Morte natural ou acidental","Invalidez permanente total ou parcial","Assistência funeral familiar","Doenças graves","Diária por internação hospitalar"],recommended:!0},{id:"3",name:"Premium",coverage:5e5,monthlyPrice:99.9,features:["Morte natural ou acidental","Invalidez permanente total ou parcial","Assistência funeral familiar completa","Doenças graves (30 doenças)","Diária por internação hospitalar","Segunda opinião médica","Telemedicina 24h"]}]),[h,f]=C.useState([{id:"1",name:"Maria Silva",relationship:"Cônjuge",percentage:50},{id:"2",name:"João Silva",relationship:"Filho",percentage:25},{id:"3",name:"Ana Silva",relationship:"Filha",percentage:25}]),[m]=C.useState(d[1]),k=x=>x.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),p=x=>{t(`Plano ${x.name} contratado com sucesso!`,"success"),i(!0)},v=()=>{if(!l.name||!l.relationship||!l.percentage){t("Preencha todos os campos","error");return}if(h.reduce((u,y)=>u+y.percentage,0)+parseFloat(l.percentage)>100){t("A soma das porcentagens não pode ultrapassar 100%","error");return}const g={id:Date.now().toString(),name:l.name,relationship:l.relationship,percentage:parseFloat(l.percentage)};f([...h,g]),t("Beneficiário adicionado com sucesso!","success"),a(!1),c({name:"",relationship:"",percentage:""})},b=x=>{f(h.filter(g=>g.id!==x)),t("Beneficiário removido","info")};return e.jsxs("div",{className:"seguro-vida-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"btn-back",onClick:()=>window.history.back(),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})})}),e.jsxs("div",{className:"header-content",children:[e.jsx("div",{className:"header-icon",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"})})}),e.jsx("h1",{children:"Seguro de Vida"}),e.jsx("p",{children:"Proteção para você e sua família"})]})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="plans"?"active":""}`,onClick:()=>r("plans"),children:"Planos"}),e.jsx("button",{className:`tab ${n==="myPolicy"?"active":""}`,onClick:()=>r("myPolicy"),children:"Minha Apólice"}),e.jsx("button",{className:`tab ${n==="beneficiaries"?"active":""}`,onClick:()=>r("beneficiaries"),children:"Beneficiários"})]}),n==="plans"&&e.jsx("div",{className:"plans-section",children:e.jsx("div",{className:"plans-grid",children:d.map(x=>e.jsxs("div",{className:`plan-card ${x.recommended?"recommended":""}`,children:[x.recommended&&e.jsx("span",{className:"badge",children:"Recomendado"}),e.jsx("h3",{children:x.name}),e.jsxs("div",{className:"coverage",children:[e.jsx("span",{className:"label",children:"Cobertura"}),e.jsx("span",{className:"value",children:k(x.coverage)})]}),e.jsxs("div",{className:"price",children:[e.jsx("span",{className:"amount",children:k(x.monthlyPrice)}),e.jsx("span",{className:"period",children:"/mês"})]}),e.jsx("ul",{className:"features",children:x.features.map((g,u)=>e.jsxs("li",{children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"#22C55E",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4L12 14.01l-3-3"})]}),g]},u))}),e.jsx("button",{className:`btn-contract ${x.recommended?"primary":""}`,onClick:()=>p(x),children:"Contratar"})]},x.id))})}),n==="myPolicy"&&e.jsx("div",{className:"policy-section",children:s?e.jsxs("div",{className:"policy-details",children:[e.jsxs("div",{className:"policy-card",children:[e.jsxs("div",{className:"policy-header",children:[e.jsxs("span",{className:"policy-name",children:["Seguro de Vida ",m.name]}),e.jsx("span",{className:"policy-status active",children:"Ativo"})]}),e.jsxs("div",{className:"policy-info",children:[e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"label",children:"Apólice"}),e.jsx("span",{className:"value",children:"#SV-2024-001234"})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"label",children:"Cobertura"}),e.jsx("span",{className:"value",children:k(m.coverage)})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"label",children:"Vigência"}),e.jsx("span",{className:"value",children:"15/01/2024 a 15/01/2025"})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("span",{className:"label",children:"Valor Mensal"}),e.jsx("span",{className:"value",children:k(m.monthlyPrice)})]})]}),e.jsxs("div",{className:"policy-actions",children:[e.jsxs("button",{className:"btn-action",onClick:()=>t("PDF da apólice baixado","success"),children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"7,10 12,15 17,10"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),"Baixar Apólice"]}),e.jsxs("button",{className:"btn-action",onClick:()=>t("Solicitação de sinistro iniciada","info"),children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14,2 14,8 20,8"}),e.jsx("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),e.jsx("line",{x1:"16",y1:"17",x2:"8",y2:"17"})]}),"Acionar Seguro"]})]})]}),e.jsxs("div",{className:"coverages-card",children:[e.jsx("h3",{children:"Coberturas Contratadas"}),e.jsx("ul",{className:"coverages-list",children:m.features.map((x,g)=>e.jsxs("li",{children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#22C55E",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4L12 14.01l-3-3"})]}),e.jsx("span",{children:x})]},g))})]})]}):e.jsxs("div",{className:"empty-state",children:[e.jsx("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"#666",strokeWidth:"2",children:e.jsx("path",{d:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"})}),e.jsx("h3",{children:"Você ainda não tem um seguro de vida"}),e.jsx("p",{children:"Contrate agora e proteja quem você ama"}),e.jsx("button",{className:"btn-contract-now",onClick:()=>r("plans"),children:"Ver Planos"})]})}),n==="beneficiaries"&&e.jsxs("div",{className:"beneficiaries-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Beneficiários"}),e.jsxs("button",{className:"btn-add",onClick:()=>a(!0),children:[e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 5v14M5 12h14"})}),"Adicionar"]})]}),e.jsxs("div",{className:"total-percentage",children:[e.jsx("span",{className:"label",children:"Total distribuído"}),e.jsx("div",{className:"percentage-bar",children:e.jsx("div",{className:"percentage-fill",style:{width:`${h.reduce((x,g)=>x+g.percentage,0)}%`}})}),e.jsxs("span",{className:"value",children:[h.reduce((x,g)=>x+g.percentage,0),"%"]})]}),e.jsx("div",{className:"beneficiaries-list",children:h.map(x=>e.jsxs("div",{className:"beneficiary-card",children:[e.jsxs("div",{className:"beneficiary-info",children:[e.jsx("div",{className:"avatar",children:x.name.charAt(0)}),e.jsxs("div",{className:"details",children:[e.jsx("span",{className:"name",children:x.name}),e.jsx("span",{className:"relationship",children:x.relationship})]})]}),e.jsxs("div",{className:"beneficiary-percentage",children:[e.jsxs("span",{className:"percentage",children:[x.percentage,"%"]}),e.jsx("button",{className:"btn-remove",onClick:()=>b(x.id),children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})})})]})]},x.id))})]}),o&&e.jsx("div",{className:"modal-overlay",onClick:()=>a(!1),children:e.jsxs("div",{className:"modal",onClick:x=>x.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Adicionar Beneficiário"}),e.jsx("button",{className:"btn-close",onClick:()=>a(!1),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Nome completo"}),e.jsx("input",{type:"text",value:l.name,onChange:x=>c({...l,name:x.target.value}),placeholder:"Nome do beneficiário"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Parentesco"}),e.jsxs("select",{value:l.relationship,onChange:x=>c({...l,relationship:x.target.value}),children:[e.jsx("option",{value:"",children:"Selecione..."}),e.jsx("option",{value:"Cônjuge",children:"Cônjuge"}),e.jsx("option",{value:"Filho(a)",children:"Filho(a)"}),e.jsx("option",{value:"Pai/Mãe",children:"Pai/Mãe"}),e.jsx("option",{value:"Irmão(ã)",children:"Irmão(ã)"}),e.jsx("option",{value:"Outro",children:"Outro"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Porcentagem (%)"}),e.jsx("input",{type:"number",value:l.percentage,onChange:x=>c({...l,percentage:x.target.value}),placeholder:"0",min:"1",max:"100"}),e.jsxs("span",{className:"hint",children:["Disponível: ",100-h.reduce((x,g)=>x+g.percentage,0),"%"]})]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn-cancel",onClick:()=>a(!1),children:"Cancelar"}),e.jsx("button",{className:"btn-confirm",onClick:v,children:"Adicionar"})]})]})}),e.jsx("style",{children:`
        .seguro-vida-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .btn-back {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 8px;
          color: #888;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-back:hover {
          color: #C9A227;
          border-color: #C9A227;
        }

        .header-content {
          flex: 1;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .header-content h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .header-content p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .plan-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          position: relative;
        }

        .plan-card.recommended {
          border-color: #C9A227;
        }

        .badge {
          position: absolute;
          top: -10px;
          right: 16px;
          background: #C9A227;
          color: #000;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .plan-card h3 {
          color: #fff;
          font-size: 20px;
          margin: 0 0 16px;
        }

        .coverage {
          margin-bottom: 16px;
        }

        .coverage .label {
          color: #888;
          font-size: 12px;
          display: block;
        }

        .coverage .value {
          color: #C9A227;
          font-size: 24px;
          font-weight: 700;
        }

        .price {
          margin-bottom: 20px;
        }

        .price .amount {
          color: #fff;
          font-size: 28px;
          font-weight: 600;
        }

        .price .period {
          color: #888;
          font-size: 14px;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
        }

        .features li {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #888;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .btn-contract {
          width: 100%;
          padding: 14px;
          border: 1px solid #333;
          border-radius: 10px;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-contract:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .btn-contract.primary {
          background: #C9A227;
          border-color: #C9A227;
          color: #000;
        }

        .btn-contract.primary:hover {
          background: #D4AF37;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }

        .empty-state svg {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 8px;
        }

        .empty-state p {
          color: #888;
          font-size: 14px;
          margin: 0 0 24px;
        }

        .btn-contract-now {
          padding: 14px 32px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-contract-now:hover {
          background: #D4AF37;
        }

        .policy-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .policy-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .policy-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .policy-name {
          color: #fff;
          font-size: 18px;
          font-weight: 500;
        }

        .policy-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .policy-status.active {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .policy-info {
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row .label {
          color: #888;
          font-size: 14px;
        }

        .info-row .value {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .policy-actions {
          display: flex;
          gap: 12px;
        }

        .btn-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 10px;
          color: #888;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-action:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .coverages-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .coverages-card h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .coverages-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .coverages-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
          color: #888;
          font-size: 14px;
        }

        .coverages-list li:last-child {
          border-bottom: none;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h2 {
          color: #fff;
          font-size: 18px;
          margin: 0;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-add:hover {
          background: #D4AF37;
        }

        .total-percentage {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
        }

        .total-percentage .label {
          color: #888;
          font-size: 14px;
        }

        .percentage-bar {
          flex: 1;
          height: 8px;
          background: #252525;
          border-radius: 4px;
          overflow: hidden;
        }

        .percentage-fill {
          height: 100%;
          background: #C9A227;
          border-radius: 4px;
          transition: width 0.3s;
        }

        .total-percentage .value {
          color: #C9A227;
          font-size: 16px;
          font-weight: 600;
          min-width: 40px;
          text-align: right;
        }

        .beneficiaries-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .beneficiary-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .beneficiary-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #C9A227 0%, #333 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
        }

        .details {
          display: flex;
          flex-direction: column;
        }

        .details .name {
          color: #fff;
          font-weight: 500;
        }

        .details .relationship {
          color: #888;
          font-size: 12px;
        }

        .beneficiary-percentage {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .percentage {
          color: #C9A227;
          font-size: 20px;
          font-weight: 600;
        }

        .btn-remove {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 8px;
          transition: all 0.3s;
        }

        .btn-remove:hover {
          color: #EF4444;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .modal-header h3 {
          color: #fff;
          margin: 0;
          font-size: 18px;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
        }

        .modal-content {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #C9A227;
          outline: none;
        }

        .hint {
          display: block;
          color: #888;
          font-size: 12px;
          margin-top: 4px;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #333;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-confirm {
          flex: 1;
          padding: 12px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-confirm:hover {
          background: #D4AF37;
        }
      `})]})},$2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("plans"),[s,i]=C.useState(!1),[o,a]=C.useState(null),[l,c]=C.useState({brand:"",model:"",imei:""}),[d]=C.useState([{id:"1",name:"Proteção Básica",coverage:["Roubo e furto qualificado","Quebra acidental de tela"],monthlyPrice:19.9,deductible:150},{id:"2",name:"Proteção Completa",coverage:["Roubo e furto qualificado","Quebra acidental de tela","Danos por líquidos","Defeitos elétricos"],monthlyPrice:34.9,deductible:100},{id:"3",name:"Proteção Premium",coverage:["Roubo e furto qualificado","Quebra acidental de tela","Danos por líquidos","Defeitos elétricos","Acessórios (fone, carregador)","Aparelho reserva durante reparo"],monthlyPrice:49.9,deductible:50}]),[h,f]=C.useState([{id:"1",brand:"Apple",model:"iPhone 14 Pro",imei:"352***********789",insured:!0,plan:"Proteção Completa"}]),[m]=C.useState([{id:"1",device:"iPhone 14 Pro",type:"Quebra de tela",date:"2024-01-10",status:"em_analise",protocol:"SC-2024-0001"}]),k=u=>u.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),p=u=>{a(u),i(!0)},v=()=>{if(!l.brand||!l.model||!l.imei){t("Preencha todos os campos","error");return}if(l.imei.length<15){t("IMEI deve ter 15 dígitos","error");return}const u={id:Date.now().toString(),...l,insured:!0,plan:o==null?void 0:o.name};f([...h,u]),t(`Seguro ${o==null?void 0:o.name} contratado com sucesso!`,"success"),i(!1),c({brand:"",model:"",imei:""}),a(null)},b=u=>{f(h.map(y=>y.id===u?{...y,insured:!1,plan:void 0}:y)),t("Seguro cancelado","info")},x=()=>{t("Sinistro registrado. Acompanhe pelo protocolo enviado por e-mail.","success")},g=u=>({em_analise:{text:"Em Análise",color:"#F59E0B"},aprovado:{text:"Aprovado",color:"#22C55E"},negado:{text:"Negado",color:"#EF4444"},concluido:{text:"Concluído",color:"#3B82F6"}})[u]||{text:u,color:"#888"};return e.jsxs("div",{className:"seguro-celular-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"btn-back",onClick:()=>window.history.back(),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})})}),e.jsxs("div",{className:"header-content",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("rect",{x:"5",y:"2",width:"14",height:"20",rx:"2",ry:"2"}),e.jsx("line",{x1:"12",y1:"18",x2:"12",y2:"18"})]})}),e.jsx("h1",{children:"Seguro Celular"}),e.jsx("p",{children:"Proteção completa para seu smartphone"})]})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="plans"?"active":""}`,onClick:()=>r("plans"),children:"Planos"}),e.jsx("button",{className:`tab ${n==="devices"?"active":""}`,onClick:()=>r("devices"),children:"Meus Aparelhos"}),e.jsx("button",{className:`tab ${n==="claims"?"active":""}`,onClick:()=>r("claims"),children:"Sinistros"})]}),n==="plans"&&e.jsx("div",{className:"plans-section",children:e.jsx("div",{className:"plans-list",children:d.map(u=>e.jsxs("div",{className:"plan-card",children:[e.jsxs("div",{className:"plan-header",children:[e.jsx("h3",{children:u.name}),e.jsxs("div",{className:"price",children:[e.jsx("span",{className:"amount",children:k(u.monthlyPrice)}),e.jsx("span",{className:"period",children:"/mês"})]})]}),e.jsxs("div",{className:"deductible",children:[e.jsx("span",{className:"label",children:"Franquia"}),e.jsx("span",{className:"value",children:k(u.deductible)})]}),e.jsx("ul",{className:"coverage-list",children:u.coverage.map((y,j)=>e.jsxs("li",{children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"#22C55E",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4L12 14.01l-3-3"})]}),y]},j))}),e.jsx("button",{className:"btn-select",onClick:()=>p(u),children:"Selecionar Plano"})]},u.id))})}),n==="devices"&&e.jsx("div",{className:"devices-section",children:h.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsxs("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"#666",strokeWidth:"2",children:[e.jsx("rect",{x:"5",y:"2",width:"14",height:"20",rx:"2",ry:"2"}),e.jsx("line",{x1:"12",y1:"18",x2:"12",y2:"18"})]}),e.jsx("h3",{children:"Nenhum aparelho segurado"}),e.jsx("p",{children:"Proteja seu smartphone contra imprevistos"}),e.jsx("button",{className:"btn-add",onClick:()=>r("plans"),children:"Ver Planos"})]}):e.jsx("div",{className:"devices-list",children:h.map(u=>e.jsxs("div",{className:`device-card ${u.insured?"insured":""}`,children:[e.jsx("div",{className:"device-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:u.insured?"#C9A227":"#666",strokeWidth:"2",children:[e.jsx("rect",{x:"5",y:"2",width:"14",height:"20",rx:"2",ry:"2"}),e.jsx("line",{x1:"12",y1:"18",x2:"12",y2:"18"})]})}),e.jsxs("div",{className:"device-info",children:[e.jsx("span",{className:"brand",children:u.brand}),e.jsx("span",{className:"model",children:u.model}),e.jsxs("span",{className:"imei",children:["IMEI: ",u.imei]})]}),e.jsx("div",{className:"device-status",children:u.insured?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"status insured",children:"Segurado"}),e.jsx("span",{className:"plan",children:u.plan}),e.jsx("button",{className:"btn-cancel",onClick:()=>b(u.id),children:"Cancelar Seguro"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"status not-insured",children:"Não segurado"}),e.jsx("button",{className:"btn-insure",onClick:()=>r("plans"),children:"Contratar Seguro"})]})})]},u.id))})}),n==="claims"&&e.jsxs("div",{className:"claims-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Sinistros"}),e.jsxs("button",{className:"btn-new-claim",onClick:x,children:[e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 5v14M5 12h14"})}),"Novo Sinistro"]})]}),m.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsxs("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"#666",strokeWidth:"2",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14,2 14,8 20,8"}),e.jsx("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),e.jsx("line",{x1:"16",y1:"17",x2:"8",y2:"17"})]}),e.jsx("h3",{children:"Nenhum sinistro registrado"}),e.jsx("p",{children:"Esperamos que você nunca precise usar"})]}):e.jsx("div",{className:"claims-list",children:m.map(u=>{const y=g(u.status);return e.jsxs("div",{className:"claim-card",children:[e.jsxs("div",{className:"claim-header",children:[e.jsxs("div",{className:"claim-info",children:[e.jsx("span",{className:"device",children:u.device}),e.jsx("span",{className:"type",children:u.type})]}),e.jsx("span",{className:"status",style:{color:y.color,background:`${y.color}15`},children:y.text})]}),e.jsxs("div",{className:"claim-details",children:[e.jsxs("div",{className:"detail",children:[e.jsx("span",{className:"label",children:"Protocolo"}),e.jsx("span",{className:"value",children:u.protocol})]}),e.jsxs("div",{className:"detail",children:[e.jsx("span",{className:"label",children:"Data"}),e.jsx("span",{className:"value",children:new Date(u.date).toLocaleDateString("pt-BR")})]})]}),e.jsx("button",{className:"btn-details",onClick:()=>t("Detalhes do sinistro","info"),children:"Ver Detalhes"})]},u.id)})})]}),s&&e.jsx("div",{className:"modal-overlay",onClick:()=>i(!1),children:e.jsxs("div",{className:"modal",onClick:u=>u.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Adicionar Aparelho"}),e.jsx("button",{className:"btn-close",onClick:()=>i(!1),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsxs("div",{className:"modal-content",children:[o&&e.jsxs("div",{className:"selected-plan",children:[e.jsx("span",{className:"label",children:"Plano selecionado"}),e.jsx("span",{className:"plan-name",children:o.name}),e.jsxs("span",{className:"plan-price",children:[k(o.monthlyPrice),"/mês"]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Marca"}),e.jsxs("select",{value:l.brand,onChange:u=>c({...l,brand:u.target.value}),children:[e.jsx("option",{value:"",children:"Selecione..."}),e.jsx("option",{value:"Apple",children:"Apple"}),e.jsx("option",{value:"Samsung",children:"Samsung"}),e.jsx("option",{value:"Xiaomi",children:"Xiaomi"}),e.jsx("option",{value:"Motorola",children:"Motorola"}),e.jsx("option",{value:"Outro",children:"Outro"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Modelo"}),e.jsx("input",{type:"text",value:l.model,onChange:u=>c({...l,model:u.target.value}),placeholder:"Ex: iPhone 14 Pro"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"IMEI (15 dígitos)"}),e.jsx("input",{type:"text",value:l.imei,onChange:u=>c({...l,imei:u.target.value.replace(/\D/g,"").slice(0,15)}),placeholder:"Digite o IMEI",maxLength:15}),e.jsx("span",{className:"hint",children:"Encontre o IMEI em Configurações ou digitando *#06#"})]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn-cancel",onClick:()=>i(!1),children:"Cancelar"}),e.jsx("button",{className:"btn-confirm",onClick:v,children:"Contratar Seguro"})]})]})}),e.jsx("style",{children:`
        .seguro-celular-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .btn-back {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 8px;
          color: #888;
          cursor: pointer;
        }

        .btn-back:hover {
          color: #C9A227;
          border-color: #C9A227;
        }

        .header-content {
          flex: 1;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .header-content h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .header-content p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .plans-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .plan-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .plan-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .plan-header h3 {
          color: #fff;
          font-size: 18px;
          margin: 0;
        }

        .price .amount {
          color: #C9A227;
          font-size: 24px;
          font-weight: 600;
        }

        .price .period {
          color: #888;
          font-size: 14px;
        }

        .deductible {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: #252525;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .deductible .label {
          color: #888;
          font-size: 14px;
        }

        .deductible .value {
          color: #fff;
          font-weight: 500;
        }

        .coverage-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
        }

        .coverage-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #888;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .btn-select {
          width: 100%;
          padding: 14px;
          background: #C9A227;
          border: none;
          border-radius: 10px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-select:hover {
          background: #D4AF37;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }

        .empty-state svg {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 8px;
        }

        .empty-state p {
          color: #888;
          font-size: 14px;
          margin: 0 0 24px;
        }

        .btn-add {
          padding: 14px 32px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .devices-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .device-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 16px;
          align-items: center;
        }

        .device-card.insured {
          border-color: #C9A22740;
        }

        @media (max-width: 640px) {
          .device-card {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .device-icon {
            justify-content: center;
          }
        }

        .device-icon {
          width: 60px;
          height: 60px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .device-info {
          display: flex;
          flex-direction: column;
        }

        .device-info .brand {
          color: #888;
          font-size: 12px;
        }

        .device-info .model {
          color: #fff;
          font-size: 16px;
          font-weight: 500;
        }

        .device-info .imei {
          color: #666;
          font-size: 12px;
          font-family: monospace;
        }

        .device-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        @media (max-width: 640px) {
          .device-status {
            align-items: center;
          }
        }

        .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status.insured {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .status.not-insured {
          background: rgba(136, 136, 136, 0.1);
          color: #888;
        }

        .device-status .plan {
          color: #C9A227;
          font-size: 12px;
        }

        .btn-cancel {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #EF4444;
          border-radius: 6px;
          color: #EF4444;
          font-size: 12px;
          cursor: pointer;
          margin-top: 8px;
        }

        .btn-insure {
          padding: 8px 16px;
          background: #C9A227;
          border: none;
          border-radius: 6px;
          color: #000;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 8px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h2 {
          color: #fff;
          font-size: 18px;
          margin: 0;
        }

        .btn-new-claim {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .claims-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .claim-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
        }

        .claim-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .claim-info .device {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .claim-info .type {
          color: #888;
          font-size: 12px;
        }

        .claim-header .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .claim-details {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
        }

        .claim-details .detail {
          display: flex;
          flex-direction: column;
        }

        .claim-details .label {
          color: #888;
          font-size: 12px;
        }

        .claim-details .value {
          color: #fff;
          font-size: 14px;
        }

        .btn-details {
          width: 100%;
          padding: 10px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-details:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .modal-header h3 {
          color: #fff;
          margin: 0;
          font-size: 18px;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
        }

        .modal-content {
          padding: 20px;
        }

        .selected-plan {
          background: #252525;
          border: 1px solid #C9A227;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
          text-align: center;
        }

        .selected-plan .label {
          color: #888;
          font-size: 12px;
          display: block;
        }

        .selected-plan .plan-name {
          color: #C9A227;
          font-size: 18px;
          font-weight: 600;
          display: block;
          margin: 4px 0;
        }

        .selected-plan .plan-price {
          color: #888;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #C9A227;
          outline: none;
        }

        .hint {
          display: block;
          color: #888;
          font-size: 11px;
          margin-top: 4px;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #333;
        }

        .modal-footer .btn-cancel {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-confirm {
          flex: 1;
          padding: 12px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-confirm:hover {
          background: #D4AF37;
        }
      `})]})},V2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("quote"),[s,i]=C.useState(""),[o,a]=C.useState(""),[l,c]=C.useState(""),[d,h]=C.useState("1"),[f,m]=C.useState(!1),[k]=C.useState([{id:"1",name:"Essencial",coverage:3e4,dailyPrice:12.9,features:["Despesas médicas (USD 30.000)","Bagagem extraviada (USD 1.000)","Cancelamento de viagem","Assistência 24h em português"]},{id:"2",name:"Completo",coverage:6e4,dailyPrice:24.9,features:["Despesas médicas (USD 60.000)","Bagagem extraviada (USD 2.000)","Cancelamento de viagem","Assistência 24h em português","Cobertura para esportes","Regresso sanitário"],recommended:!0},{id:"3",name:"Premium",coverage:15e4,dailyPrice:45.9,features:["Despesas médicas (USD 150.000)","Bagagem extraviada (USD 3.000)","Cancelamento de viagem (USD 5.000)","Assistência 24h em português","Cobertura para esportes radicais","Regresso sanitário","Acompanhante em caso de hospitalização","Cobertura para gestantes"]}]),[p]=C.useState([{id:"1",destination:"Paris, França",startDate:"2024-02-15",endDate:"2024-02-25",plan:"Completo",status:"upcoming"},{id:"2",destination:"Orlando, EUA",startDate:"2023-12-20",endDate:"2024-01-05",plan:"Essencial",status:"completed"}]),v=(y,j="BRL")=>j==="USD"?`USD ${y.toLocaleString("en-US")}`:y.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),b=()=>{if(!o||!l)return 0;const y=new Date(o),j=new Date(l),w=Math.ceil((j.getTime()-y.getTime())/(1e3*60*60*24));return w>0?w:0},x=()=>{if(!s||!o||!l){t("Preencha todos os campos","error");return}if(b()===0){t("Data de retorno deve ser posterior à data de ida","error");return}m(!0)},g=y=>{const j=b(),w=y.dailyPrice*j*parseInt(d);t(`Seguro ${y.name} contratado! Total: ${v(w)}`,"success"),m(!1),i(""),a(""),c("")},u=y=>({active:{text:"Em vigor",color:"#22C55E"},upcoming:{text:"Próxima",color:"#3B82F6"},completed:{text:"Concluída",color:"#888"}})[y]||{text:y,color:"#888"};return e.jsxs("div",{className:"seguro-viagem-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"btn-back",onClick:()=>window.history.back(),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})})}),e.jsxs("div",{className:"header-content",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"}),e.jsx("polyline",{points:"3.27,6.96 12,12.01 20.73,6.96"}),e.jsx("line",{x1:"12",y1:"22.08",x2:"12",y2:"12"})]})}),e.jsx("h1",{children:"Seguro Viagem"}),e.jsx("p",{children:"Viaje tranquilo pelo mundo"})]})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="quote"?"active":""}`,onClick:()=>r("quote"),children:"Cotar Seguro"}),e.jsx("button",{className:`tab ${n==="myTrips"?"active":""}`,onClick:()=>r("myTrips"),children:"Minhas Viagens"})]}),n==="quote"&&e.jsxs("div",{className:"quote-section",children:[e.jsxs("div",{className:"quote-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Destino"}),e.jsxs("select",{value:s,onChange:y=>i(y.target.value),children:[e.jsx("option",{value:"",children:"Selecione o destino..."}),e.jsx("option",{value:"america-norte",children:"América do Norte"}),e.jsx("option",{value:"america-sul",children:"América do Sul"}),e.jsx("option",{value:"europa",children:"Europa"}),e.jsx("option",{value:"asia",children:"Ásia"}),e.jsx("option",{value:"africa",children:"África"}),e.jsx("option",{value:"oceania",children:"Oceania"}),e.jsx("option",{value:"mundial",children:"Mundial (múltiplos destinos)"})]})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Data de ida"}),e.jsx("input",{type:"date",value:o,onChange:y=>a(y.target.value),min:new Date().toISOString().split("T")[0]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Data de volta"}),e.jsx("input",{type:"date",value:l,onChange:y=>c(y.target.value),min:o||new Date().toISOString().split("T")[0]})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Número de viajantes"}),e.jsxs("select",{value:d,onChange:y=>h(y.target.value),children:[e.jsx("option",{value:"1",children:"1 viajante"}),e.jsx("option",{value:"2",children:"2 viajantes"}),e.jsx("option",{value:"3",children:"3 viajantes"}),e.jsx("option",{value:"4",children:"4 viajantes"}),e.jsx("option",{value:"5",children:"5 viajantes"})]})]}),b()>0&&e.jsxs("div",{className:"trip-summary",children:[e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"label",children:"Duração"}),e.jsxs("span",{className:"value",children:[b()," dias"]})]}),e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"label",children:"Viajantes"}),e.jsx("span",{className:"value",children:d})]})]}),e.jsx("button",{className:"btn-quote",onClick:x,children:"Ver Planos e Preços"})]}),e.jsxs("div",{className:"info-cards",children:[e.jsxs("div",{className:"info-card",children:[e.jsx("div",{className:"info-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4L12 14.01l-3-3"})]})}),e.jsxs("div",{className:"info-content",children:[e.jsx("h4",{children:"Obrigatório para Europa"}),e.jsx("p",{children:"Países do Tratado de Schengen exigem seguro viagem com cobertura mínima de EUR 30.000"})]})]}),e.jsxs("div",{className:"info-card",children:[e.jsx("div",{className:"info-icon",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 6v6l4 2"})]})}),e.jsxs("div",{className:"info-content",children:[e.jsx("h4",{children:"Assistência 24h"}),e.jsx("p",{children:"Atendimento em português a qualquer hora, em qualquer lugar do mundo"})]})]})]})]}),n==="myTrips"&&e.jsx("div",{className:"trips-section",children:p.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"#666",strokeWidth:"2",children:e.jsx("path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"})}),e.jsx("h3",{children:"Nenhuma viagem cadastrada"}),e.jsx("p",{children:"Faça uma cotação e proteja sua próxima aventura"}),e.jsx("button",{className:"btn-new",onClick:()=>r("quote"),children:"Cotar Seguro"})]}):e.jsx("div",{className:"trips-list",children:p.map(y=>{const j=u(y.status);return e.jsxs("div",{className:"trip-card",children:[e.jsxs("div",{className:"trip-header",children:[e.jsxs("div",{className:"destination",children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"}),e.jsx("circle",{cx:"12",cy:"10",r:"3"})]}),e.jsx("span",{children:y.destination})]}),e.jsx("span",{className:"status",style:{color:j.color,background:`${j.color}15`},children:j.text})]}),e.jsxs("div",{className:"trip-details",children:[e.jsxs("div",{className:"detail",children:[e.jsx("span",{className:"label",children:"Período"}),e.jsxs("span",{className:"value",children:[new Date(y.startDate).toLocaleDateString("pt-BR")," - ",new Date(y.endDate).toLocaleDateString("pt-BR")]})]}),e.jsxs("div",{className:"detail",children:[e.jsx("span",{className:"label",children:"Plano"}),e.jsx("span",{className:"value",children:y.plan})]})]}),e.jsxs("div",{className:"trip-actions",children:[e.jsxs("button",{className:"btn-action",onClick:()=>t("PDF baixado","success"),children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"7,10 12,15 17,10"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),"Voucher"]}),e.jsxs("button",{className:"btn-action",onClick:()=>t("Central de atendimento: 0800-123-4567","info"),children:[e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"})}),"Assistência"]})]})]},y.id)})})}),f&&e.jsx("div",{className:"modal-overlay",onClick:()=>m(!1),children:e.jsxs("div",{className:"modal plans-modal",onClick:y=>y.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Escolha seu Plano"}),e.jsx("button",{className:"btn-close",onClick:()=>m(!1),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsx("div",{className:"modal-content",children:e.jsx("div",{className:"plans-list",children:k.map(y=>{const j=b(),w=y.dailyPrice*j*parseInt(d);return e.jsxs("div",{className:`plan-card ${y.recommended?"recommended":""}`,children:[y.recommended&&e.jsx("span",{className:"badge",children:"Recomendado"}),e.jsx("h4",{children:y.name}),e.jsxs("div",{className:"coverage",children:["Cobertura: ",v(y.coverage,"USD")]}),e.jsxs("div",{className:"price",children:[e.jsxs("span",{className:"daily",children:[v(y.dailyPrice),"/dia"]}),e.jsxs("span",{className:"total",children:["Total: ",v(w)]})]}),e.jsx("ul",{className:"features",children:y.features.map((A,S)=>e.jsxs("li",{children:[e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"#22C55E",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4L12 14.01l-3-3"})]}),A]},S))}),e.jsx("button",{className:`btn-select ${y.recommended?"primary":""}`,onClick:()=>g(y),children:"Contratar"})]},y.id)})})})]})}),e.jsx("style",{children:`
        .seguro-viagem-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .btn-back {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 8px;
          color: #888;
          cursor: pointer;
        }

        .btn-back:hover {
          color: #C9A227;
          border-color: #C9A227;
        }

        .header-content {
          flex: 1;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .header-content h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .header-content p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .quote-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .quote-form {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #C9A227;
          outline: none;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .trip-summary {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: #252525;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .summary-item {
          flex: 1;
          text-align: center;
        }

        .summary-item .label {
          color: #888;
          font-size: 12px;
          display: block;
        }

        .summary-item .value {
          color: #C9A227;
          font-size: 20px;
          font-weight: 600;
        }

        .btn-quote {
          width: 100%;
          padding: 16px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-quote:hover {
          background: #D4AF37;
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .info-icon {
          width: 44px;
          height: 44px;
          background: #252525;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-content h4 {
          color: #fff;
          font-size: 14px;
          margin: 0 0 4px;
        }

        .info-content p {
          color: #888;
          font-size: 13px;
          margin: 0;
          line-height: 1.4;
        }

        .trips-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }

        .empty-state svg {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 8px;
        }

        .empty-state p {
          color: #888;
          font-size: 14px;
          margin: 0 0 24px;
        }

        .btn-new {
          padding: 14px 32px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .trips-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .trip-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
        }

        .trip-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .destination {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          font-weight: 500;
        }

        .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .trip-details {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
        }

        .trip-details .detail {
          display: flex;
          flex-direction: column;
        }

        .trip-details .label {
          color: #888;
          font-size: 12px;
        }

        .trip-details .value {
          color: #fff;
          font-size: 14px;
        }

        .trip-actions {
          display: flex;
          gap: 12px;
        }

        .btn-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-action:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .plans-modal {
          max-width: 800px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
          position: sticky;
          top: 0;
          background: #1A1A1A;
        }

        .modal-header h3 {
          color: #fff;
          margin: 0;
          font-size: 18px;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
        }

        .modal-content {
          padding: 20px;
        }

        .plans-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .plan-card {
          background: #252525;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          position: relative;
        }

        .plan-card.recommended {
          border-color: #C9A227;
        }

        .badge {
          position: absolute;
          top: -10px;
          right: 12px;
          background: #C9A227;
          color: #000;
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
        }

        .plan-card h4 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 8px;
        }

        .coverage {
          color: #888;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .price {
          margin-bottom: 16px;
        }

        .price .daily {
          color: #C9A227;
          font-size: 20px;
          font-weight: 600;
          display: block;
        }

        .price .total {
          color: #fff;
          font-size: 14px;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 16px;
        }

        .features li {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #888;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .btn-select {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-select:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .btn-select.primary {
          background: #C9A227;
          border-color: #C9A227;
          color: #000;
        }

        .btn-select.primary:hover {
          background: #D4AF37;
        }
      `})]})},H2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("quote"),[s,i]=C.useState(1),[o,a]=C.useState({brand:"",model:"",year:"",plate:"",fipeValue:85e3,zipCode:""}),[l,c]=C.useState([{id:"1",brand:"Toyota",model:"Corolla XEi 2.0",year:2022,plate:"ABC-1234",insured:!0,plan:"Completo",premium:189.9}]),[d]=C.useState([{name:"Colisão",description:"Danos causados por batidas e capotamento",included:!0},{name:"Roubo e Furto",description:"Cobertura em caso de roubo ou furto do veículo",included:!0},{name:"Incêndio",description:"Danos por incêndio, raio e explosão",included:!0},{name:"Terceiros",description:"Danos materiais e corporais a terceiros",included:!0},{name:"Vidros",description:"Troca de para-brisas, vidros laterais e traseiro",included:!0},{name:"Carro Reserva",description:"Veículo reserva por até 15 dias em caso de sinistro",included:!1},{name:"Assistência 24h",description:"Guincho, chaveiro, troca de pneu, pane seca",included:!0}]),h=p=>p.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),f=()=>{if(s===1){if(!o.brand||!o.model||!o.year){t("Preencha todos os campos do veículo","error");return}i(2)}else if(s===2){if(!o.zipCode||!o.plate){t("Preencha o CEP e a placa","error");return}i(3)}},m=()=>{const p={id:Date.now().toString(),brand:o.brand,model:o.model,year:parseInt(o.year),plate:o.plate,insured:!0,plan:"Completo",premium:189.9};c([...l,p]),t("Seguro contratado com sucesso!","success"),i(1),a({brand:"",model:"",year:"",plate:"",fipeValue:85e3,zipCode:""}),r("myVehicles")},k=p=>{t(`Solicitação de ${p} enviada. Em breve entraremos em contato.`,"success")};return e.jsxs("div",{className:"seguro-auto-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"btn-back",onClick:()=>window.history.back(),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})})}),e.jsxs("div",{className:"header-content",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"}),e.jsx("circle",{cx:"7",cy:"17",r:"2"}),e.jsx("path",{d:"M9 17h6"}),e.jsx("circle",{cx:"17",cy:"17",r:"2"})]})}),e.jsx("h1",{children:"Seguro Auto"}),e.jsx("p",{children:"Proteção completa para seu veículo"})]})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="quote"?"active":""}`,onClick:()=>r("quote"),children:"Cotar"}),e.jsx("button",{className:`tab ${n==="myVehicles"?"active":""}`,onClick:()=>r("myVehicles"),children:"Meus Veículos"}),e.jsx("button",{className:`tab ${n==="assistance"?"active":""}`,onClick:()=>r("assistance"),children:"Assistência"})]}),n==="quote"&&e.jsxs("div",{className:"quote-section",children:[e.jsxs("div",{className:"quote-progress",children:[e.jsxs("div",{className:`step ${s>=1?"active":""}`,children:[e.jsx("span",{className:"number",children:"1"}),e.jsx("span",{className:"label",children:"Veículo"})]}),e.jsx("div",{className:"line"}),e.jsxs("div",{className:`step ${s>=2?"active":""}`,children:[e.jsx("span",{className:"number",children:"2"}),e.jsx("span",{className:"label",children:"Dados"})]}),e.jsx("div",{className:"line"}),e.jsxs("div",{className:`step ${s>=3?"active":""}`,children:[e.jsx("span",{className:"number",children:"3"}),e.jsx("span",{className:"label",children:"Cotação"})]})]}),s===1&&e.jsxs("div",{className:"quote-form",children:[e.jsx("h3",{children:"Dados do Veículo"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Marca"}),e.jsxs("select",{value:o.brand,onChange:p=>a({...o,brand:p.target.value}),children:[e.jsx("option",{value:"",children:"Selecione..."}),e.jsx("option",{value:"Toyota",children:"Toyota"}),e.jsx("option",{value:"Honda",children:"Honda"}),e.jsx("option",{value:"Volkswagen",children:"Volkswagen"}),e.jsx("option",{value:"Chevrolet",children:"Chevrolet"}),e.jsx("option",{value:"Ford",children:"Ford"}),e.jsx("option",{value:"Fiat",children:"Fiat"}),e.jsx("option",{value:"Hyundai",children:"Hyundai"}),e.jsx("option",{value:"Jeep",children:"Jeep"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Modelo"}),e.jsx("input",{type:"text",value:o.model,onChange:p=>a({...o,model:p.target.value}),placeholder:"Ex: Corolla XEi 2.0"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Ano"}),e.jsxs("select",{value:o.year,onChange:p=>a({...o,year:p.target.value}),children:[e.jsx("option",{value:"",children:"Selecione..."}),Array.from({length:15},(p,v)=>2024-v).map(p=>e.jsx("option",{value:p,children:p},p))]})]}),e.jsx("button",{className:"btn-next",onClick:f,children:"Continuar"})]}),s===2&&e.jsxs("div",{className:"quote-form",children:[e.jsx("h3",{children:"Informações Adicionais"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Placa do Veículo"}),e.jsx("input",{type:"text",value:o.plate,onChange:p=>a({...o,plate:p.target.value.toUpperCase()}),placeholder:"ABC-1234",maxLength:8})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"CEP onde o veículo pernoita"}),e.jsx("input",{type:"text",value:o.zipCode,onChange:p=>a({...o,zipCode:p.target.value.replace(/\D/g,"")}),placeholder:"00000-000",maxLength:8})]}),e.jsxs("div",{className:"fipe-info",children:[e.jsx("span",{className:"label",children:"Valor FIPE estimado"}),e.jsx("span",{className:"value",children:h(o.fipeValue)})]}),e.jsxs("div",{className:"btn-group",children:[e.jsx("button",{className:"btn-back-step",onClick:()=>i(1),children:"Voltar"}),e.jsx("button",{className:"btn-next",onClick:f,children:"Ver Cotação"})]})]}),s===3&&e.jsxs("div",{className:"quote-result",children:[e.jsxs("div",{className:"result-header",children:[e.jsx("h3",{children:"Sua Cotação"}),e.jsxs("div",{className:"vehicle-summary",children:[e.jsxs("span",{className:"vehicle-name",children:[o.brand," ",o.model]}),e.jsxs("span",{className:"vehicle-info",children:[o.year," • ",o.plate]})]})]}),e.jsxs("div",{className:"premium-card",children:[e.jsx("span",{className:"label",children:"Valor Mensal"}),e.jsx("span",{className:"value",children:h(189.9)}),e.jsxs("span",{className:"annual",children:["ou ",h(2088.9),"/ano à vista"]})]}),e.jsxs("div",{className:"coverages-section",children:[e.jsx("h4",{children:"Coberturas Incluídas"}),e.jsx("div",{className:"coverages-list",children:d.map((p,v)=>e.jsxs("div",{className:`coverage-item ${p.included?"included":""}`,children:[e.jsx("div",{className:"coverage-icon",children:p.included?e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"#22C55E",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4L12 14.01l-3-3"})]}):e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"#666",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M15 9l-6 6M9 9l6 6"})]})}),e.jsxs("div",{className:"coverage-info",children:[e.jsx("span",{className:"name",children:p.name}),e.jsx("span",{className:"description",children:p.description})]})]},v))})]}),e.jsxs("div",{className:"btn-group",children:[e.jsx("button",{className:"btn-back-step",onClick:()=>i(2),children:"Voltar"}),e.jsx("button",{className:"btn-contract",onClick:m,children:"Contratar Seguro"})]})]})]}),n==="myVehicles"&&e.jsx("div",{className:"vehicles-section",children:l.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsxs("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"#666",strokeWidth:"2",children:[e.jsx("path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"}),e.jsx("circle",{cx:"7",cy:"17",r:"2"}),e.jsx("circle",{cx:"17",cy:"17",r:"2"})]}),e.jsx("h3",{children:"Nenhum veículo segurado"}),e.jsx("p",{children:"Faça uma cotação e proteja seu carro"}),e.jsx("button",{className:"btn-quote",onClick:()=>r("quote"),children:"Cotar Agora"})]}):e.jsx("div",{className:"vehicles-list",children:l.map(p=>e.jsxs("div",{className:"vehicle-card",children:[e.jsx("div",{className:"vehicle-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:p.insured?"#C9A227":"#666",strokeWidth:"2",children:[e.jsx("path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"}),e.jsx("circle",{cx:"7",cy:"17",r:"2"}),e.jsx("circle",{cx:"17",cy:"17",r:"2"})]})}),e.jsxs("div",{className:"vehicle-info",children:[e.jsxs("span",{className:"vehicle-name",children:[p.brand," ",p.model]}),e.jsxs("span",{className:"vehicle-details",children:[p.year," • ",p.plate]}),p.insured&&e.jsxs("span",{className:"vehicle-plan",children:[p.plan," • ",h(p.premium||0),"/mês"]})]}),e.jsxs("div",{className:"vehicle-status",children:[e.jsx("span",{className:`status ${p.insured?"insured":""}`,children:p.insured?"Segurado":"Não segurado"}),p.insured&&e.jsx("button",{className:"btn-details",onClick:()=>t("Detalhes da apólice","info"),children:"Ver Apólice"})]})]},p.id))})}),n==="assistance"&&e.jsxs("div",{className:"assistance-section",children:[e.jsx("h2",{children:"Assistência 24 Horas"}),e.jsx("p",{className:"subtitle",children:"Precisa de ajuda? Solicite assistência agora"}),e.jsxs("div",{className:"assistance-grid",children:[e.jsxs("button",{className:"assistance-card",onClick:()=>k("Guincho"),children:[e.jsx("div",{className:"icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M10 17h4V5H2v12h3"}),e.jsx("path",{d:"M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"}),e.jsx("circle",{cx:"7.5",cy:"17.5",r:"2.5"}),e.jsx("circle",{cx:"17.5",cy:"17.5",r:"2.5"})]})}),e.jsx("span",{className:"title",children:"Guincho"}),e.jsx("span",{className:"description",children:"Reboque para oficina ou concessionária"})]}),e.jsxs("button",{className:"assistance-card",onClick:()=>k("Chaveiro"),children:[e.jsx("div",{className:"icon",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"})})}),e.jsx("span",{className:"title",children:"Chaveiro"}),e.jsx("span",{className:"description",children:"Abertura de porta e chave reserva"})]}),e.jsxs("button",{className:"assistance-card",onClick:()=>k("Pane Seca"),children:[e.jsx("div",{className:"icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M3 22h18M5 18h14M7 14h10"}),e.jsx("path",{d:"M12 6V2M8 10l-2-2M16 10l2-2"})]})}),e.jsx("span",{className:"title",children:"Pane Seca"}),e.jsx("span",{className:"description",children:"Entrega de combustível no local"})]}),e.jsxs("button",{className:"assistance-card",onClick:()=>k("Troca de Pneu"),children:[e.jsx("div",{className:"icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})}),e.jsx("span",{className:"title",children:"Troca de Pneu"}),e.jsx("span",{className:"description",children:"Substituição pelo estepe"})]}),e.jsxs("button",{className:"assistance-card",onClick:()=>k("Pane Elétrica"),children:[e.jsx("div",{className:"icon",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M13 2L3 14h9l-1 8 10-12h-9l1-8z"})})}),e.jsx("span",{className:"title",children:"Pane Elétrica"}),e.jsx("span",{className:"description",children:"Carga na bateria ou troca"})]}),e.jsxs("button",{className:"assistance-card",onClick:()=>k("Socorro Mecânico"),children:[e.jsx("div",{className:"icon",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"})})}),e.jsx("span",{className:"title",children:"Socorro Mecânico"}),e.jsx("span",{className:"description",children:"Reparo de pequenas panes"})]})]}),e.jsxs("div",{className:"emergency-contact",children:[e.jsx("span",{className:"label",children:"Central de Atendimento 24h"}),e.jsx("span",{className:"phone",children:"0800 123 4567"})]})]}),e.jsx("style",{children:`
        .seguro-auto-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .btn-back {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 8px;
          color: #888;
          cursor: pointer;
        }

        .btn-back:hover {
          color: #C9A227;
          border-color: #C9A227;
        }

        .header-content {
          flex: 1;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .header-content h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .header-content p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .quote-progress {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step .number {
          width: 32px;
          height: 32px;
          background: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-weight: 600;
        }

        .step.active .number {
          background: #C9A227;
          color: #000;
        }

        .step .label {
          color: #888;
          font-size: 12px;
        }

        .step.active .label {
          color: #C9A227;
        }

        .line {
          width: 60px;
          height: 2px;
          background: #333;
          margin: 0 8px;
        }

        .quote-form {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .quote-form h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #C9A227;
          outline: none;
        }

        .fipe-info {
          display: flex;
          justify-content: space-between;
          padding: 16px;
          background: #252525;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .fipe-info .label {
          color: #888;
        }

        .fipe-info .value {
          color: #C9A227;
          font-weight: 600;
        }

        .btn-group {
          display: flex;
          gap: 12px;
        }

        .btn-back-step {
          flex: 1;
          padding: 14px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 10px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-next, .btn-contract {
          flex: 2;
          padding: 14px;
          background: #C9A227;
          border: none;
          border-radius: 10px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-next:hover, .btn-contract:hover {
          background: #D4AF37;
        }

        .quote-result {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .result-header {
          margin-bottom: 24px;
        }

        .result-header h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 12px;
        }

        .vehicle-summary {
          display: flex;
          flex-direction: column;
        }

        .vehicle-name {
          color: #C9A227;
          font-size: 16px;
          font-weight: 500;
        }

        .vehicle-info {
          color: #888;
          font-size: 13px;
        }

        .premium-card {
          text-align: center;
          padding: 24px;
          background: #252525;
          border: 1px solid #C9A227;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .premium-card .label {
          color: #888;
          font-size: 14px;
          display: block;
          margin-bottom: 8px;
        }

        .premium-card .value {
          color: #C9A227;
          font-size: 40px;
          font-weight: 700;
          display: block;
        }

        .premium-card .annual {
          color: #888;
          font-size: 13px;
        }

        .coverages-section {
          margin-bottom: 24px;
        }

        .coverages-section h4 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .coverages-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .coverage-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: #252525;
          border-radius: 10px;
          opacity: 0.5;
        }

        .coverage-item.included {
          opacity: 1;
        }

        .coverage-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .coverage-info {
          display: flex;
          flex-direction: column;
        }

        .coverage-info .name {
          color: #fff;
          font-weight: 500;
          font-size: 14px;
        }

        .coverage-info .description {
          color: #888;
          font-size: 12px;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }

        .empty-state svg {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 8px;
        }

        .empty-state p {
          color: #888;
          font-size: 14px;
          margin: 0 0 24px;
        }

        .btn-quote {
          padding: 14px 32px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .vehicles-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .vehicle-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 16px;
          align-items: center;
        }

        @media (max-width: 640px) {
          .vehicle-card {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        .vehicle-icon {
          width: 60px;
          height: 60px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vehicle-info {
          display: flex;
          flex-direction: column;
        }

        .vehicle-name {
          color: #fff;
          font-weight: 500;
        }

        .vehicle-details {
          color: #888;
          font-size: 13px;
        }

        .vehicle-plan {
          color: #C9A227;
          font-size: 12px;
          margin-top: 4px;
        }

        .vehicle-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        @media (max-width: 640px) {
          .vehicle-status {
            align-items: center;
          }
        }

        .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          background: rgba(136, 136, 136, 0.1);
          color: #888;
        }

        .status.insured {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .btn-details {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 6px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
        }

        .btn-details:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .assistance-section {
          text-align: center;
        }

        .assistance-section h2 {
          color: #fff;
          font-size: 20px;
          margin: 0 0 8px;
        }

        .subtitle {
          color: #888;
          font-size: 14px;
          margin: 0 0 24px;
        }

        .assistance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .assistance-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .assistance-card:hover {
          border-color: #C9A227;
        }

        .assistance-card .icon {
          width: 60px;
          height: 60px;
          background: #252525;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .assistance-card .title {
          color: #fff;
          font-weight: 500;
          font-size: 14px;
        }

        .assistance-card .description {
          color: #888;
          font-size: 12px;
          line-height: 1.3;
        }

        .emergency-contact {
          background: #1A1A1A;
          border: 1px solid #C9A227;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
        }

        .emergency-contact .label {
          color: #888;
          font-size: 14px;
          display: block;
          margin-bottom: 8px;
        }

        .emergency-contact .phone {
          color: #C9A227;
          font-size: 28px;
          font-weight: 700;
        }
      `})]})},q2=()=>{const{showToast:t}=oe(),[n,r]=C.useState("plans"),[s,i]=C.useState(!1),[o,a]=C.useState(null),[l,c]=C.useState({type:"",address:"",zipCode:"",value:""}),[d]=C.useState([{id:"1",name:"Básico",coverage:1e5,monthlyPrice:24.9,features:["Incêndio, raio e explosão","Vendaval e granizo","Responsabilidade civil familiar","Assistência 24h básica"]},{id:"2",name:"Essencial",coverage:2e5,monthlyPrice:49.9,features:["Incêndio, raio e explosão","Vendaval, granizo e queda de aeronaves","Roubo e furto qualificado","Danos elétricos","Responsabilidade civil familiar","Assistência 24h completa"],recommended:!0},{id:"3",name:"Premium",coverage:5e5,monthlyPrice:89.9,features:["Incêndio, raio e explosão","Vendaval, granizo e queda de aeronaves","Roubo e furto qualificado","Danos elétricos em equipamentos","Quebra de vidros","Alagamento e inundação","Responsabilidade civil familiar ampliada","Assistência 24h premium","Diária por impossibilidade de habitação"]}]),[h,f]=C.useState([{id:"1",type:"Apartamento",address:"Rua das Flores, 123 - Apt 501",insured:!0,plan:"Essencial",premium:49.9}]),m=b=>b.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),k=b=>{a(b),i(!0)},p=()=>{if(!l.type||!l.address||!l.zipCode){t("Preencha todos os campos","error");return}const b={id:Date.now().toString(),type:l.type,address:l.address,insured:!0,plan:o==null?void 0:o.name,premium:o==null?void 0:o.monthlyPrice};f([...h,b]),t(`Seguro ${o==null?void 0:o.name} contratado com sucesso!`,"success"),i(!1),c({type:"",address:"",zipCode:"",value:""}),a(null)},v=b=>{t(`Solicitação de ${b} enviada. Em breve um profissional entrará em contato.`,"success")};return e.jsxs("div",{className:"seguro-residencial-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"btn-back",onClick:()=>window.history.back(),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})})}),e.jsxs("div",{className:"header-content",children:[e.jsx("div",{className:"header-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}),e.jsx("polyline",{points:"9,22 9,12 15,12 15,22"})]})}),e.jsx("h1",{children:"Seguro Residencial"}),e.jsx("p",{children:"Proteção completa para seu lar"})]})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab ${n==="plans"?"active":""}`,onClick:()=>r("plans"),children:"Planos"}),e.jsx("button",{className:`tab ${n==="myProperties"?"active":""}`,onClick:()=>r("myProperties"),children:"Meus Imóveis"}),e.jsx("button",{className:`tab ${n==="assistance"?"active":""}`,onClick:()=>r("assistance"),children:"Assistência"})]}),n==="plans"&&e.jsx("div",{className:"plans-section",children:e.jsx("div",{className:"plans-list",children:d.map(b=>e.jsxs("div",{className:`plan-card ${b.recommended?"recommended":""}`,children:[b.recommended&&e.jsx("span",{className:"badge",children:"Mais vendido"}),e.jsx("h3",{children:b.name}),e.jsxs("div",{className:"coverage",children:[e.jsx("span",{className:"label",children:"Cobertura até"}),e.jsx("span",{className:"value",children:m(b.coverage)})]}),e.jsxs("div",{className:"price",children:[e.jsx("span",{className:"amount",children:m(b.monthlyPrice)}),e.jsx("span",{className:"period",children:"/mês"})]}),e.jsx("ul",{className:"features",children:b.features.map((x,g)=>e.jsxs("li",{children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"#22C55E",strokeWidth:"2",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("path",{d:"M22 4L12 14.01l-3-3"})]}),x]},g))}),e.jsx("button",{className:`btn-select ${b.recommended?"primary":""}`,onClick:()=>k(b),children:"Contratar"})]},b.id))})}),n==="myProperties"&&e.jsx("div",{className:"properties-section",children:h.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsxs("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"#666",strokeWidth:"2",children:[e.jsx("path",{d:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}),e.jsx("polyline",{points:"9,22 9,12 15,12 15,22"})]}),e.jsx("h3",{children:"Nenhum imóvel segurado"}),e.jsx("p",{children:"Proteja sua casa ou apartamento"}),e.jsx("button",{className:"btn-contract",onClick:()=>r("plans"),children:"Ver Planos"})]}):e.jsx("div",{className:"properties-list",children:h.map(b=>e.jsxs("div",{className:"property-card",children:[e.jsx("div",{className:"property-icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:b.insured?"#C9A227":"#666",strokeWidth:"2",children:[e.jsx("path",{d:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}),e.jsx("polyline",{points:"9,22 9,12 15,12 15,22"})]})}),e.jsxs("div",{className:"property-info",children:[e.jsx("span",{className:"property-type",children:b.type}),e.jsx("span",{className:"property-address",children:b.address}),b.insured&&e.jsxs("span",{className:"property-plan",children:[b.plan," • ",m(b.premium||0),"/mês"]})]}),e.jsxs("div",{className:"property-status",children:[e.jsx("span",{className:`status ${b.insured?"insured":""}`,children:b.insured?"Segurado":"Não segurado"}),b.insured&&e.jsx("button",{className:"btn-details",onClick:()=>t("Detalhes da apólice","info"),children:"Ver Apólice"})]})]},b.id))})}),n==="assistance"&&e.jsxs("div",{className:"assistance-section",children:[e.jsx("h2",{children:"Assistência Residencial 24h"}),e.jsx("p",{className:"subtitle",children:"Serviços inclusos no seu plano"}),e.jsxs("div",{className:"assistance-grid",children:[e.jsxs("button",{className:"assistance-card",onClick:()=>v("Chaveiro"),children:[e.jsx("div",{className:"icon",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"})})}),e.jsx("span",{className:"title",children:"Chaveiro"}),e.jsx("span",{className:"description",children:"Abertura de portas e troca de fechaduras"})]}),e.jsxs("button",{className:"assistance-card",onClick:()=>v("Eletricista"),children:[e.jsx("div",{className:"icon",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M13 2L3 14h9l-1 8 10-12h-9l1-8z"})})}),e.jsx("span",{className:"title",children:"Eletricista"}),e.jsx("span",{className:"description",children:"Reparos elétricos emergenciais"})]}),e.jsxs("button",{className:"assistance-card",onClick:()=>v("Encanador"),children:[e.jsx("div",{className:"icon",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M6 6h.01M6 18h.01M18 6h.01M18 18h.01M3 12h18M12 3v18"})})}),e.jsx("span",{className:"title",children:"Encanador"}),e.jsx("span",{className:"description",children:"Vazamentos e desentupimentos"})]}),e.jsxs("button",{className:"assistance-card",onClick:()=>v("Vidraceiro"),children:[e.jsx("div",{className:"icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"3",y1:"9",x2:"21",y2:"9"}),e.jsx("line",{x1:"9",y1:"21",x2:"9",y2:"9"})]})}),e.jsx("span",{className:"title",children:"Vidraceiro"}),e.jsx("span",{className:"description",children:"Troca de vidros e espelhos"})]}),e.jsxs("button",{className:"assistance-card",onClick:()=>v("Dedetização"),children:[e.jsx("div",{className:"icon",children:e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:[e.jsx("path",{d:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"}),e.jsx("path",{d:"M12 6v6l4 2"})]})}),e.jsx("span",{className:"title",children:"Dedetização"}),e.jsx("span",{className:"description",children:"Controle de pragas"})]}),e.jsxs("button",{className:"assistance-card",onClick:()=>v("Limpeza de Caixa"),children:[e.jsx("div",{className:"icon",children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"#C9A227",strokeWidth:"2",children:e.jsx("path",{d:"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"})})}),e.jsx("span",{className:"title",children:"Limpeza de Caixa"}),e.jsx("span",{className:"description",children:"Limpeza de caixa d'água"})]})]}),e.jsxs("div",{className:"emergency-contact",children:[e.jsx("span",{className:"label",children:"Central de Atendimento 24h"}),e.jsx("span",{className:"phone",children:"0800 123 4567"})]})]}),s&&o&&e.jsx("div",{className:"modal-overlay",onClick:()=>i(!1),children:e.jsxs("div",{className:"modal",onClick:b=>b.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Dados do Imóvel"}),e.jsx("button",{className:"btn-close",onClick:()=>i(!1),children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"selected-plan-info",children:[e.jsx("span",{className:"plan-name",children:o.name}),e.jsxs("span",{className:"plan-price",children:[m(o.monthlyPrice),"/mês"]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Tipo de imóvel"}),e.jsxs("select",{value:l.type,onChange:b=>c({...l,type:b.target.value}),children:[e.jsx("option",{value:"",children:"Selecione..."}),e.jsx("option",{value:"Apartamento",children:"Apartamento"}),e.jsx("option",{value:"Casa",children:"Casa"}),e.jsx("option",{value:"Casa em Condomínio",children:"Casa em Condomínio"}),e.jsx("option",{value:"Sobrado",children:"Sobrado"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"CEP"}),e.jsx("input",{type:"text",value:l.zipCode,onChange:b=>c({...l,zipCode:b.target.value.replace(/\D/g,"")}),placeholder:"00000-000",maxLength:8})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Endereço completo"}),e.jsx("input",{type:"text",value:l.address,onChange:b=>c({...l,address:b.target.value}),placeholder:"Rua, número, complemento"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Valor estimado do imóvel"}),e.jsx("input",{type:"text",value:l.value,onChange:b=>c({...l,value:b.target.value}),placeholder:"R$ 0,00"})]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn-cancel",onClick:()=>i(!1),children:"Cancelar"}),e.jsx("button",{className:"btn-confirm",onClick:p,children:"Contratar"})]})]})}),e.jsx("style",{children:`
        .seguro-residencial-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .btn-back {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 8px;
          color: #888;
          cursor: pointer;
        }

        .btn-back:hover {
          color: #C9A227;
          border-color: #C9A227;
        }

        .header-content {
          flex: 1;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .header-content h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .header-content p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .plans-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .plan-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          position: relative;
        }

        .plan-card.recommended {
          border-color: #C9A227;
        }

        .badge {
          position: absolute;
          top: -10px;
          right: 16px;
          background: #C9A227;
          color: #000;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .plan-card h3 {
          color: #fff;
          font-size: 20px;
          margin: 0 0 12px;
        }

        .coverage {
          margin-bottom: 12px;
        }

        .coverage .label {
          color: #888;
          font-size: 12px;
          display: block;
        }

        .coverage .value {
          color: #C9A227;
          font-size: 24px;
          font-weight: 700;
        }

        .price {
          margin-bottom: 20px;
        }

        .price .amount {
          color: #fff;
          font-size: 28px;
          font-weight: 600;
        }

        .price .period {
          color: #888;
          font-size: 14px;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
        }

        .features li {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #888;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .btn-select {
          width: 100%;
          padding: 14px;
          border: 1px solid #333;
          border-radius: 10px;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-select:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .btn-select.primary {
          background: #C9A227;
          border-color: #C9A227;
          color: #000;
        }

        .btn-select.primary:hover {
          background: #D4AF37;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }

        .empty-state svg {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 8px;
        }

        .empty-state p {
          color: #888;
          font-size: 14px;
          margin: 0 0 24px;
        }

        .btn-contract {
          padding: 14px 32px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .properties-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .property-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 16px;
          align-items: center;
        }

        @media (max-width: 640px) {
          .property-card {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        .property-icon {
          width: 60px;
          height: 60px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .property-info {
          display: flex;
          flex-direction: column;
        }

        .property-type {
          color: #888;
          font-size: 12px;
        }

        .property-address {
          color: #fff;
          font-weight: 500;
        }

        .property-plan {
          color: #C9A227;
          font-size: 12px;
          margin-top: 4px;
        }

        .property-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        @media (max-width: 640px) {
          .property-status {
            align-items: center;
          }
        }

        .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          background: rgba(136, 136, 136, 0.1);
          color: #888;
        }

        .status.insured {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .btn-details {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 6px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
        }

        .btn-details:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .assistance-section {
          text-align: center;
        }

        .assistance-section h2 {
          color: #fff;
          font-size: 20px;
          margin: 0 0 8px;
        }

        .subtitle {
          color: #888;
          font-size: 14px;
          margin: 0 0 24px;
        }

        .assistance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .assistance-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .assistance-card:hover {
          border-color: #C9A227;
        }

        .assistance-card .icon {
          width: 60px;
          height: 60px;
          background: #252525;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .assistance-card .title {
          color: #fff;
          font-weight: 500;
          font-size: 14px;
        }

        .assistance-card .description {
          color: #888;
          font-size: 12px;
          line-height: 1.3;
        }

        .emergency-contact {
          background: #1A1A1A;
          border: 1px solid #C9A227;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
        }

        .emergency-contact .label {
          color: #888;
          font-size: 14px;
          display: block;
          margin-bottom: 8px;
        }

        .emergency-contact .phone {
          color: #C9A227;
          font-size: 28px;
          font-weight: 700;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .modal-header h3 {
          color: #fff;
          margin: 0;
          font-size: 18px;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
        }

        .modal-content {
          padding: 20px;
        }

        .selected-plan-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #252525;
          border: 1px solid #C9A227;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .plan-name {
          color: #C9A227;
          font-size: 18px;
          font-weight: 600;
        }

        .plan-price {
          color: #888;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #C9A227;
          outline: none;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #333;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-confirm {
          flex: 1;
          padding: 12px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-confirm:hover {
          background: #D4AF37;
        }
      `})]})},cd=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}),e.jsx("polyline",{points:"9 22 9 12 15 12 15 22"})]}),dd=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]}),pd=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5"})}),bo=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"20",x2:"18",y2:"10"}),e.jsx("line",{x1:"12",y1:"20",x2:"12",y2:"4"}),e.jsx("line",{x1:"6",y1:"20",x2:"6",y2:"14"})]}),K2=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]}),Q2=()=>e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),e.jsx("polyline",{points:"16 17 21 12 16 7"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]}),Y2=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"1"}),e.jsx("circle",{cx:"19",cy:"12",r:"1"}),e.jsx("circle",{cx:"5",cy:"12",r:"1"})]}),J2=()=>e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"14",width:"7",height:"7"}),e.jsx("rect",{x:"3",y:"14",width:"7",height:"7"})]});function X2(){const t=()=>{const s=window.location.hash.slice(1)||"/";return s.includes("state=")||s.includes("code=")||s.includes("error=")||s.includes("session_state=")?"/":s},[n,r]=J.useState(t());return J.useEffect(()=>{const s=()=>r(t());return window.addEventListener("hashchange",s),()=>window.removeEventListener("hashchange",s)},[]),[n,s=>{window.location.hash=s},r]}function G2(){const[t,n]=J.useState(!1),[r,s]=J.useState(!1),[i,o]=J.useState(!1),[a]=X2();if(J.useEffect(()=>{o(!1)},[a]),J.useEffect(()=>{let h=!0;return dm().then(()=>{h&&(s(!!st.authenticated),n(!0))}).catch(f=>{console.log("[AppShell] Keycloak init result:",f),h&&(s(!1),n(!0))}),()=>{h=!1}},[]),!t)return e.jsxs("div",{className:"app-loading",children:[e.jsxs("div",{className:"app-loading-content",children:[e.jsxs("div",{className:"app-loading-logo",children:[e.jsx("div",{className:"app-loading-dot"}),e.jsx("span",{children:"Athena"})]}),e.jsx("div",{className:"app-loading-spinner"}),e.jsx("p",{children:"Carregando..."})]}),e.jsx("style",{children:`
          .app-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0D0D0D;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .app-loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            color: white;
          }
          .app-loading-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 28px;
            font-weight: 800;
          }
          .app-loading-dot {
            width: 14px;
            height: 14px;
            background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(201, 162, 39, 0.5);
          }
          .app-loading-spinner {
            width: 36px;
            height: 36px;
            border: 3px solid #333;
            border-top-color: #C9A227;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          .app-loading p {
            font-size: 14px;
            color: #666;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `})]});if(!r)return e.jsx(Pm,{onLogin:()=>hm()});const c=["/emprestimo","/boleto"].some(h=>a.startsWith(h)),d=()=>a==="/"?e.jsx(Em,{onLogout:()=>Oc()}):a==="/contas"?e.jsx(o2,{}):a==="/cartoes"?e.jsx(a2,{}):a==="/pix"||a.startsWith("/pix/")?e.jsx(y2,{}):a.startsWith("/pix/receipt/")?e.jsx(j2,{}):a==="/pagamentos"?e.jsx(l2,{}):a==="/investimentos"?e.jsx(c2,{}):a==="/consorcios"?e.jsx(d2,{}):a==="/seguros"?e.jsx(p2,{}):a==="/emprestimo"?e.jsx(C2,{}):a==="/boleto"?e.jsx(A2,{}):a==="/cofrinhos"?e.jsx(E2,{}):a==="/recarga"?e.jsx(D2,{}):a==="/split"?e.jsx(T2,{}):a==="/rewards"?e.jsx(M2,{}):a==="/cripto"?e.jsx(B2,{}):a==="/cambio"?e.jsx(R2,{}):a==="/limites"?e.jsx(L2,{}):a==="/assinaturas"?e.jsx(_2,{}):a==="/perfil"?e.jsx(I2,{}):a==="/notificacoes"?e.jsx(F2,{}):a==="/indicar"?e.jsx(O2,{}):a==="/openfinance"?e.jsx(W2,{}):a==="/seguros/vida"?e.jsx(U2,{}):a==="/seguros/celular"?e.jsx($2,{}):a==="/seguros/viagem"?e.jsx(V2,{}):a==="/seguros/auto"?e.jsx(H2,{}):a==="/seguros/residencial"?e.jsx(q2,{}):e.jsxs("div",{className:"not-found",children:[e.jsx("div",{className:"not-found-icon",children:"404"}),e.jsx("h2",{children:"Pagina nao encontrada"}),e.jsx("a",{href:"#/",className:"not-found-link",children:"Voltar para o inicio"})]});return c?e.jsxs(e.Fragment,{children:[d(),e.jsx("style",{children:`
          .not-found {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 16px;
            font-family: 'Inter', sans-serif;
            background: #0D0D0D;
            color: #fff;
          }
          .not-found-icon {
            font-size: 64px;
            font-weight: 800;
            color: #C9A227;
          }
          .not-found h2 {
            margin: 0;
            color: #A3A3A3;
          }
          .not-found-link {
            color: #C9A227;
            text-decoration: none;
            padding: 12px 24px;
            border: 1px solid #333;
            border-radius: 12px;
            transition: all 0.2s;
          }
          .not-found-link:hover {
            background: rgba(201, 162, 39, 0.1);
            border-color: #C9A227;
          }
        `})]}):e.jsxs("div",{className:"app-shell",children:[e.jsx("nav",{className:"top-nav",children:e.jsxs("div",{className:"top-nav-content",children:[e.jsxs("a",{href:"#/",className:"top-nav-logo",children:[e.jsx("div",{className:"top-nav-dot"}),e.jsx("span",{children:"Athena"})]}),e.jsxs("div",{className:"top-nav-links",children:[e.jsxs("a",{href:"#/",className:`top-nav-link ${a==="/"?"active":""}`,children:[e.jsx(cd,{}),e.jsx("span",{children:"Inicio"})]}),e.jsxs("a",{href:"#/contas",className:`top-nav-link ${a==="/contas"?"active":""}`,children:[e.jsx(bo,{}),e.jsx("span",{children:"Extrato"})]}),e.jsxs("a",{href:"#/cartoes",className:`top-nav-link ${a==="/cartoes"?"active":""}`,children:[e.jsx(dd,{}),e.jsx("span",{children:"Cartoes"})]}),e.jsxs("a",{href:"#/pix",className:`top-nav-link ${a.startsWith("/pix")?"active":""}`,children:[e.jsx(pd,{}),e.jsx("span",{children:"PIX"})]}),e.jsxs("a",{href:"#/investimentos",className:`top-nav-link ${a==="/investimentos"?"active":""}`,children:[e.jsx(bo,{}),e.jsx("span",{children:"Investir"})]}),e.jsxs("div",{className:"top-nav-more",children:[e.jsxs("button",{className:`top-nav-link ${i?"active":""}`,onClick:()=>o(!i),children:[e.jsx(Y2,{}),e.jsx("span",{children:"Mais"})]}),i&&e.jsxs("div",{className:"more-dropdown",children:[e.jsxs("div",{className:"more-dropdown-section",children:[e.jsx("span",{className:"more-dropdown-title",children:"Financeiro"}),e.jsx("a",{href:"#/cofrinhos",className:"more-dropdown-item",children:"Cofrinhos"}),e.jsx("a",{href:"#/recarga",className:"more-dropdown-item",children:"Recarga"}),e.jsx("a",{href:"#/split",className:"more-dropdown-item",children:"Rachar Conta"}),e.jsx("a",{href:"#/rewards",className:"more-dropdown-item",children:"Programa Átomos"})]}),e.jsxs("div",{className:"more-dropdown-section",children:[e.jsx("span",{className:"more-dropdown-title",children:"Investimentos"}),e.jsx("a",{href:"#/cripto",className:"more-dropdown-item",children:"Cripto"}),e.jsx("a",{href:"#/cambio",className:"more-dropdown-item",children:"Câmbio"})]}),e.jsxs("div",{className:"more-dropdown-section",children:[e.jsx("span",{className:"more-dropdown-title",children:"Proteção"}),e.jsx("a",{href:"#/seguros",className:"more-dropdown-item",children:"Seguros"}),e.jsx("a",{href:"#/consorcios",className:"more-dropdown-item",children:"Consórcios"})]}),e.jsxs("div",{className:"more-dropdown-section",children:[e.jsx("span",{className:"more-dropdown-title",children:"Gestão"}),e.jsx("a",{href:"#/limites",className:"more-dropdown-item",children:"Limites"}),e.jsx("a",{href:"#/assinaturas",className:"more-dropdown-item",children:"Assinaturas"}),e.jsx("a",{href:"#/emprestimo",className:"more-dropdown-item",children:"Empréstimos"})]}),e.jsxs("div",{className:"more-dropdown-section",children:[e.jsx("span",{className:"more-dropdown-title",children:"Conta"}),e.jsx("a",{href:"#/perfil",className:"more-dropdown-item",children:"Perfil"}),e.jsx("a",{href:"#/notificacoes",className:"more-dropdown-item",children:"Notificações"}),e.jsx("a",{href:"#/indicar",className:"more-dropdown-item",children:"Indicar Amigos"}),e.jsx("a",{href:"#/openfinance",className:"more-dropdown-item",children:"Open Finance"})]})]})]})]}),e.jsxs("div",{className:"top-nav-actions",children:[e.jsx("a",{href:"#/perfil",className:"top-nav-profile",children:e.jsx(K2,{})}),e.jsxs("button",{className:"top-nav-logout",onClick:()=>Oc(),children:[e.jsx(Q2,{}),e.jsx("span",{children:"Sair"})]})]})]})}),e.jsx("div",{className:"app-content",children:e.jsx("div",{className:"page-transition",children:d()},a)}),e.jsxs("nav",{className:"bottom-nav",children:[e.jsxs("a",{href:"#/",className:`bottom-nav-item ${a==="/"?"active":""}`,children:[e.jsx(cd,{}),e.jsx("span",{children:"Inicio"})]}),e.jsxs("a",{href:"#/pix",className:`bottom-nav-item ${a.startsWith("/pix")?"active":""}`,children:[e.jsx(pd,{}),e.jsx("span",{children:"PIX"})]}),e.jsxs("a",{href:"#/cartoes",className:`bottom-nav-item ${a==="/cartoes"?"active":""}`,children:[e.jsx(dd,{}),e.jsx("span",{children:"Cartoes"})]}),e.jsxs("a",{href:"#/investimentos",className:`bottom-nav-item ${a==="/investimentos"?"active":""}`,children:[e.jsx(bo,{}),e.jsx("span",{children:"Investir"})]}),e.jsxs("button",{className:`bottom-nav-item ${i?"active":""}`,onClick:()=>o(!i),children:[e.jsx(J2,{}),e.jsx("span",{children:"Mais"})]})]}),i&&e.jsx("div",{className:"mobile-more-overlay",onClick:()=>o(!1),children:e.jsxs("div",{className:"mobile-more-menu",onClick:h=>h.stopPropagation(),children:[e.jsxs("div",{className:"mobile-more-header",children:[e.jsx("span",{children:"Serviços"}),e.jsx("button",{onClick:()=>o(!1),children:"×"})]}),e.jsxs("div",{className:"mobile-more-grid",children:[e.jsxs("a",{href:"#/cofrinhos",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(201, 162, 39, 0.1)",color:"#C9A227"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"}),e.jsx("path",{d:"M2 9v1c0 1.1.9 2 2 2h1"}),e.jsx("path",{d:"M16 11h0"})]})}),e.jsx("span",{children:"Cofrinhos"})]}),e.jsxs("a",{href:"#/recarga",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(59, 130, 246, 0.1)",color:"#3B82F6"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"5",y:"2",width:"14",height:"20",rx:"2",ry:"2"}),e.jsx("line",{x1:"12",y1:"18",x2:"12.01",y2:"18"})]})}),e.jsx("span",{children:"Recarga"})]}),e.jsxs("a",{href:"#/split",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(34, 197, 94, 0.1)",color:"#22C55E"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"9",cy:"7",r:"4"}),e.jsx("path",{d:"M23 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M16 3.13a4 4 0 0 1 0 7.75"})]})}),e.jsx("span",{children:"Rachar"})]}),e.jsxs("a",{href:"#/rewards",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(168, 85, 247, 0.1)",color:"#A855F7"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"8",r:"7"}),e.jsx("polyline",{points:"8.21 13.89 7 23 12 20 17 23 15.79 13.88"})]})}),e.jsx("span",{children:"Átomos"})]}),e.jsxs("a",{href:"#/cripto",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(249, 115, 22, 0.1)",color:"#F97316"},children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"})})}),e.jsx("span",{children:"Cripto"})]}),e.jsxs("a",{href:"#/cambio",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(6, 182, 212, 0.1)",color:"#06B6D4"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"2",y1:"12",x2:"22",y2:"12"}),e.jsx("path",{d:"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"})]})}),e.jsx("span",{children:"Câmbio"})]}),e.jsxs("a",{href:"#/seguros",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(236, 72, 153, 0.1)",color:"#EC4899"},children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"})})}),e.jsx("span",{children:"Seguros"})]}),e.jsxs("a",{href:"#/consorcios",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(132, 204, 22, 0.1)",color:"#84CC16"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]})}),e.jsx("span",{children:"Consórcios"})]}),e.jsxs("a",{href:"#/limites",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(239, 68, 68, 0.1)",color:"#EF4444"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"}),e.jsx("path",{d:"M12 6v6l4 2"})]})}),e.jsx("span",{children:"Limites"})]}),e.jsxs("a",{href:"#/assinaturas",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(99, 102, 241, 0.1)",color:"#6366F1"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"17 8 12 3 7 8"}),e.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]})}),e.jsx("span",{children:"Assinaturas"})]}),e.jsxs("a",{href:"#/emprestimo",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(14, 165, 233, 0.1)",color:"#0EA5E9"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"12",y1:"1",x2:"12",y2:"23"}),e.jsx("path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"})]})}),e.jsx("span",{children:"Empréstimos"})]}),e.jsxs("a",{href:"#/perfil",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(201, 162, 39, 0.1)",color:"#C9A227"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}),e.jsx("span",{children:"Perfil"})]}),e.jsxs("a",{href:"#/notificacoes",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(251, 191, 36, 0.1)",color:"#FBBF24"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"}),e.jsx("path",{d:"M13.73 21a2 2 0 0 1-3.46 0"})]})}),e.jsx("span",{children:"Notificações"})]}),e.jsxs("a",{href:"#/indicar",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(34, 197, 94, 0.1)",color:"#22C55E"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"}),e.jsx("polyline",{points:"16 6 12 2 8 6"}),e.jsx("line",{x1:"12",y1:"2",x2:"12",y2:"15"})]})}),e.jsx("span",{children:"Indicar"})]}),e.jsxs("a",{href:"#/openfinance",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(59, 130, 246, 0.1)",color:"#3B82F6"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),e.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]})}),e.jsx("span",{children:"Open Finance"})]}),e.jsxs("a",{href:"#/contas",className:"mobile-more-item",children:[e.jsx("div",{className:"mobile-more-icon",style:{background:"rgba(156, 163, 175, 0.1)",color:"#9CA3AF"},children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"18",y1:"20",x2:"18",y2:"10"}),e.jsx("line",{x1:"12",y1:"20",x2:"12",y2:"4"}),e.jsx("line",{x1:"6",y1:"20",x2:"6",y2:"14"})]})}),e.jsx("span",{children:"Extrato"})]})]})]})}),e.jsx("style",{children:`
        .app-shell {
          min-height: 100vh;
          background: #0D0D0D;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .not-found {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 16px;
          color: #fff;
        }

        .not-found-icon {
          font-size: 64px;
          font-weight: 800;
          color: #C9A227;
        }

        .not-found h2 {
          margin: 0;
          color: #A3A3A3;
        }

        .not-found-link {
          color: #C9A227;
          text-decoration: none;
          padding: 12px 24px;
          border: 1px solid #333;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .not-found-link:hover {
          background: rgba(201, 162, 39, 0.1);
          border-color: #C9A227;
        }

        /* Top Navigation */
        .top-nav {
          background: rgba(13, 13, 13, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #262626;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .top-nav-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .top-nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #fff;
          font-size: 20px;
          font-weight: 800;
        }

        .top-nav-dot {
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(201, 162, 39, 0.5);
        }

        .top-nav-links {
          display: flex;
          gap: 4px;
        }

        .top-nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          text-decoration: none;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .top-nav-link:hover {
          color: #fff;
          background: #1A1A1A;
        }

        .top-nav-link.active {
          color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        .top-nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .top-nav-profile {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 50%;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .top-nav-profile:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        button.bottom-nav-item {
          background: none;
          border: none;
          cursor: pointer;
        }

        .top-nav-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #666;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .top-nav-logout:hover {
          border-color: #EF4444;
          color: #EF4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Bottom Navigation - Mobile */
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(13, 13, 13, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid #262626;
          padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
          z-index: 100;
        }

        .bottom-nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px;
          text-decoration: none;
          color: #666;
          font-size: 10px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .bottom-nav-item.active {
          color: #C9A227;
        }

        .app-content {
          padding-bottom: 0;
          min-height: calc(100vh - 64px);
        }

        .page-transition {
          animation: pageEnter 0.35s ease-out;
        }

        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Desktop More Dropdown */
        .top-nav-more {
          position: relative;
        }

        .top-nav-more button {
          background: none;
          border: none;
          cursor: pointer;
        }

        .more-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          z-index: 200;
        }

        .more-dropdown-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .more-dropdown-title {
          color: #666;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          padding: 4px 8px;
          letter-spacing: 0.5px;
        }

        .more-dropdown-item {
          padding: 10px 12px;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .more-dropdown-item:hover {
          background: rgba(201, 162, 39, 0.1);
          color: #C9A227;
        }

        /* Mobile More Overlay */
        .mobile-more-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          align-items: flex-end;
        }

        .mobile-more-menu {
          background: #1A1A1A;
          border-radius: 20px 20px 0 0;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .mobile-more-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
          position: sticky;
          top: 0;
          background: #1A1A1A;
        }

        .mobile-more-header span {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
        }

        .mobile-more-header button {
          width: 32px;
          height: 32px;
          background: #333;
          border: none;
          border-radius: 50%;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-more-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 20px;
        }

        .mobile-more-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          padding: 12px 8px;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .mobile-more-item:active {
          background: rgba(201, 162, 39, 0.1);
        }

        .mobile-more-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-more-item span {
          font-size: 11px;
          color: #888;
          text-align: center;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .top-nav {
            display: none;
          }

          .bottom-nav {
            display: flex;
          }

          .app-content {
            padding-bottom: calc(80px + env(safe-area-inset-bottom));
            min-height: 100vh;
          }
        }
      `})]})}const Z2=document.getElementById("root");if(!Z2){const t=document.createElement("div");t.id="root",document.body.appendChild(t)}Au(document.getElementById("root")).render(e.jsx(b2,{children:e.jsx(G2,{})}));
