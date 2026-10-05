var Nn=Object.create;var Ne=Object.defineProperty;var Un=Object.getOwnPropertyDescriptor;var Et=(r,t)=>(t=Symbol[r])?t:Symbol.for("Symbol."+r),ee=r=>{throw TypeError(r)};var At=(r,t,e)=>t in r?Ne(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var wt=(r,t)=>Ne(r,"name",{value:t,configurable:!0});var ve=r=>[,,,Nn(r?.[Et("metadata")]??null)],kt=["class","method","getter","setter","accessor","field","value","get","set"],oe=r=>r!==void 0&&typeof r!="function"?ee("Function expected"):r,zn=(r,t,e,n,i)=>({kind:kt[r],name:t,metadata:n,addInitializer:o=>e._?ee("Already initialized"):i.push(oe(o||null))}),se=(r,t)=>At(t,Et("metadata"),r[3]),w=(r,t,e,n)=>{for(var i=0,o=r[t>>1],s=o&&o.length;i<s;i++)t&1?o[i].call(e):n=o[i].call(e,n);return n},k=(r,t,e,n,i,o)=>{var s,c,l,h,a,d=t&7,u=!!(t&8),p=!!(t&16),m=d>3?r.length+1:d?u?1:2:0,v=kt[d+5],x=d>3&&(r[m-1]=[]),g=r[m]||(r[m]=[]),y=d&&(!p&&!u&&(i=i.prototype),d<5&&(d>3||!p)&&Un(d<4?i:{get[e](){return xt(this,o)},set[e]($){return $t(this,o,$)}},e));d?p&&d<4&&wt(o,(d>2?"set ":d>1?"get ":"")+e):wt(i,e);for(var C=n.length-1;C>=0;C--)h=zn(d,e,l={},r[3],g),d&&(h.static=u,h.private=p,a=h.access={has:p?$=>Wn(i,$):$=>e in $},d^3&&(a.get=p?$=>(d^1?xt:In)($,i,d^4?o:y.get):$=>$[e]),d>2&&(a.set=p?($,J)=>$t($,i,J,d^4?o:y.set):($,J)=>$[e]=J)),c=(0,n[C])(d?d<4?p?o:y[v]:d>4?void 0:{get:y.get,set:y.set}:i,h),l._=1,d^4||c===void 0?oe(c)&&(d>4?x.unshift(c):d?p?o=c:y[v]=c:i=c):typeof c!="object"||c===null?ee("Object expected"):(oe(s=c.get)&&(y.get=s),oe(s=c.set)&&(y.set=s),oe(s=c.init)&&x.unshift(s));return d||se(r,i),y&&Ne(i,e,y),p?d^4?o:y:i},M=(r,t,e)=>At(r,typeof t!="symbol"?t+"":t,e),Ue=(r,t,e)=>t.has(r)||ee("Cannot "+e),Wn=(r,t)=>Object(t)!==t?ee('Cannot use the "in" operator on this value'):r.has(t),xt=(r,t,e)=>(Ue(r,t,"read from private field"),e?e.call(r):t.get(r)),S=(r,t,e)=>t.has(r)?ee("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(r):t.set(r,e),$t=(r,t,e,n)=>(Ue(r,t,"write to private field"),n?n.call(r,e):t.set(r,e),e),In=(r,t,e)=>(Ue(r,t,"access private method"),e);var be=globalThis,we=be.ShadowRoot&&(be.ShadyCSS===void 0||be.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ze=Symbol(),St=new WeakMap,ae=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==ze)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(we&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=St.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&St.set(e,t))}return t}toString(){return this.cssText}},Dt=r=>new ae(typeof r=="string"?r:r+"",void 0,ze),ce=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((n,i,o)=>n+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new ae(e,r,ze)},Ct=(r,t)=>{if(we)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),i=be.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=e.cssText,r.appendChild(n)}},We=we?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return Dt(e)})(r):r;var{is:Fn,defineProperty:Ln,getOwnPropertyDescriptor:Bn,getOwnPropertyNames:qn,getOwnPropertySymbols:Vn,getPrototypeOf:Kn}=Object,xe=globalThis,Mt=xe.trustedTypes,Yn=Mt?Mt.emptyScript:"",Zn=xe.reactiveElementPolyfillSupport,le=(r,t)=>r,de={toAttribute(r,t){switch(t){case Boolean:r=r?Yn:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},$e=(r,t)=>!Fn(r,t),Tt={attribute:!0,type:String,converter:de,reflect:!1,useDefault:!1,hasChanged:$e};Symbol.metadata??=Symbol("metadata"),xe.litPropertyMetadata??=new WeakMap;var H=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Tt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(t,n,e);i!==void 0&&Ln(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){let{get:i,set:o}=Bn(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get:i,set(s){let c=i?.call(this);o?.call(this,s),this.requestUpdate(t,c,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Tt}static _$Ei(){if(this.hasOwnProperty(le("elementProperties")))return;let t=Kn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(le("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(le("properties"))){let e=this.properties,n=[...qn(e),...Vn(e)];for(let i of n)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,i]of e)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let i=this._$Eu(e,n);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)e.unshift(We(i))}else t!==void 0&&e.push(We(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ct(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(i!==void 0&&n.reflect===!0){let o=(n.converter?.toAttribute!==void 0?n.converter:de).toAttribute(e,n.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let n=this.constructor,i=n._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=n.getPropertyOptions(i),s=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:de;this._$Em=i;let c=s.fromAttribute(e,o.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,n,i=!1,o){if(t!==void 0){let s=this.constructor;if(i===!1&&(o=this[t]),n??=s.getPropertyOptions(t),!((n.hasChanged??$e)(o,e)||n.useDefault&&n.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:o},s){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),o!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,o]of n){let{wrapped:s}=o,c=this[i];s!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,o,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};H.elementStyles=[],H.shadowRootOptions={mode:"open"},H[le("elementProperties")]=new Map,H[le("finalized")]=new Map,Zn?.({ReactiveElement:H}),(xe.reactiveElementVersions??=[]).push("2.1.2");var Ke=globalThis,Rt=r=>r,Ee=Ke.trustedTypes,Ot=Ee?Ee.createPolicy("lit-html",{createHTML:r=>r}):void 0,zt="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,Wt="?"+I,Gn=`<${Wt}>`,V=document,pe=()=>V.createComment(""),ue=r=>r===null||typeof r!="object"&&typeof r!="function",Ye=Array.isArray,Xn=r=>Ye(r)||typeof r?.[Symbol.iterator]=="function",Ie=`[ 	
\f\r]`,he=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pt=/-->/g,jt=/>/g,B=RegExp(`>|${Ie}(?:([^\\s"'>=/]+)(${Ie}*=${Ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ht=/'/g,Nt=/"/g,It=/^(?:script|style|textarea|title)$/i,Ze=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),_=Ze(1),zr=Ze(2),Wr=Ze(3),N=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),Ut=new WeakMap,q=V.createTreeWalker(V,129);function Ft(r,t){if(!Ye(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ot!==void 0?Ot.createHTML(t):t}var Qn=(r,t)=>{let e=r.length-1,n=[],i,o=t===2?"<svg>":t===3?"<math>":"",s=he;for(let c=0;c<e;c++){let l=r[c],h,a,d=-1,u=0;for(;u<l.length&&(s.lastIndex=u,a=s.exec(l),a!==null);)u=s.lastIndex,s===he?a[1]==="!--"?s=Pt:a[1]!==void 0?s=jt:a[2]!==void 0?(It.test(a[2])&&(i=RegExp("</"+a[2],"g")),s=B):a[3]!==void 0&&(s=B):s===B?a[0]===">"?(s=i??he,d=-1):a[1]===void 0?d=-2:(d=s.lastIndex-a[2].length,h=a[1],s=a[3]===void 0?B:a[3]==='"'?Nt:Ht):s===Nt||s===Ht?s=B:s===Pt||s===jt?s=he:(s=B,i=void 0);let p=s===B&&r[c+1].startsWith("/>")?" ":"";o+=s===he?l+Gn:d>=0?(n.push(h),l.slice(0,d)+zt+l.slice(d)+I+p):l+I+(d===-2?c:p)}return[Ft(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},me=class r{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let o=0,s=0,c=t.length-1,l=this.parts,[h,a]=Qn(t,e);if(this.el=r.createElement(h,n),q.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=q.nextNode())!==null&&l.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(zt)){let u=a[s++],p=i.getAttribute(d).split(I),m=/([.?@])?(.*)/.exec(u);l.push({type:1,index:o,name:m[2],strings:p,ctor:m[1]==="."?Le:m[1]==="?"?Be:m[1]==="@"?qe:ne}),i.removeAttribute(d)}else d.startsWith(I)&&(l.push({type:6,index:o}),i.removeAttribute(d));if(It.test(i.tagName)){let d=i.textContent.split(I),u=d.length-1;if(u>0){i.textContent=Ee?Ee.emptyScript:"";for(let p=0;p<u;p++)i.append(d[p],pe()),q.nextNode(),l.push({type:2,index:++o});i.append(d[u],pe())}}}else if(i.nodeType===8)if(i.data===Wt)l.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(I,d+1))!==-1;)l.push({type:7,index:o}),d+=I.length-1}o++}}static createElement(t,e){let n=V.createElement("template");return n.innerHTML=t,n}};function te(r,t,e=r,n){if(t===N)return t;let i=n!==void 0?e._$Co?.[n]:e._$Cl,o=ue(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,n)),n!==void 0?(e._$Co??=[])[n]=i:e._$Cl=i),i!==void 0&&(t=te(r,i._$AS(r,t.values),i,n)),t}var Fe=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??V).importNode(e,!0);q.currentNode=i;let o=q.nextNode(),s=0,c=0,l=n[0];for(;l!==void 0;){if(s===l.index){let h;l.type===2?h=new fe(o,o.nextSibling,this,t):l.type===1?h=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(h=new Ve(o,this,t)),this._$AV.push(h),l=n[++c]}s!==l?.index&&(o=q.nextNode(),s++)}return q.currentNode=V,i}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},fe=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=te(this,t,e),ue(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==N&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Xn(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==f&&ue(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=me.createElement(Ft(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new Fe(i,this),s=o.u(this.options);o.p(e),this.T(s),this._$AH=o}}_$AC(t){let e=Ut.get(t.strings);return e===void 0&&Ut.set(t.strings,e=new me(t)),e}k(t){Ye(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,i=0;for(let o of t)i===e.length?e.push(n=new r(this.O(pe()),this.O(pe()),this,this.options)):n=e[i],n._$AI(o),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Rt(t).nextSibling;Rt(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ne=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,o){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=f}_$AI(t,e=this,n,i){let o=this.strings,s=!1;if(o===void 0)t=te(this,t,e,0),s=!ue(t)||t!==this._$AH&&t!==N,s&&(this._$AH=t);else{let c=t,l,h;for(t=o[0],l=0;l<o.length-1;l++)h=te(this,c[n+l],e,l),h===N&&(h=this._$AH[l]),s||=!ue(h)||h!==this._$AH[l],h===f?t=f:t!==f&&(t+=(h??"")+o[l+1]),this._$AH[l]=h}s&&!i&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Le=class extends ne{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}},Be=class extends ne{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==f)}},qe=class extends ne{constructor(t,e,n,i,o){super(t,e,n,i,o),this.type=5}_$AI(t,e=this){if((t=te(this,t,e,0)??f)===N)return;let n=this._$AH,i=t===f&&n!==f||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==f&&(n===f||i);i&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Ve=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){te(this,t)}};var Jn=Ke.litHtmlPolyfillSupport;Jn?.(me,fe),(Ke.litHtmlVersions??=[]).push("3.3.3");var Lt=(r,t,e)=>{let n=e?.renderBefore??t,i=n._$litPart$;if(i===void 0){let o=e?.renderBefore??null;n._$litPart$=i=new fe(t.insertBefore(pe(),o),o,void 0,e??{})}return i._$AI(r),i};var Ge=globalThis,O=class extends H{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Lt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return N}};O._$litElement$=!0,O.finalized=!0,Ge.litElementHydrateSupport?.({LitElement:O});var er=Ge.litElementPolyfillSupport;er?.({LitElement:O});(Ge.litElementVersions??=[]).push("4.2.2");var tr={attribute:!0,type:String,converter:de,reflect:!1,hasChanged:$e},nr=(r=tr,t,e)=>{let{kind:n,metadata:i}=e,o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),n==="setter"&&((r=Object.create(r)).wrapped=!0),o.set(e.name,r),n==="accessor"){let{name:s}=e;return{set(c){let l=t.get.call(this);t.set.call(this,c),this.requestUpdate(s,l,r,!0,c)},init(c){return c!==void 0&&this.C(s,void 0,r,c),c}}}if(n==="setter"){let{name:s}=e;return function(c){let l=this[s];t.call(this,c),this.requestUpdate(s,l,r,!0,c)}}throw Error("Unsupported decorator location: "+n)};function re(r){return(t,e)=>typeof e=="object"?nr(r,t,e):((n,i,o)=>{let s=i.hasOwnProperty(o);return i.constructor.createProperty(o,n),s?Object.getOwnPropertyDescriptor(i,o):void 0})(r,t,e)}function R(r){return re({...r,state:!0,attribute:!1})}var K=(r,t,e)=>(e.configurable=!0,e.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(r,t,e),e);function Bt(r,t){return(e,n,i)=>{let o=s=>s.renderRoot?.querySelector(r)??null;if(t){let{get:s,set:c}=typeof n=="object"?e:i??(()=>{let l=Symbol();return{get(){return this[l]},set(h){this[l]=h}}})();return K(e,n,{get(){let l=s.call(this);return l===void 0&&(l=o(this),(l!==null||this.hasUpdated)&&c.call(this,l)),l}})}return K(e,n,{get(){return o(this)}})}}var qt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Vt=r=>(...t)=>({_$litDirective$:r,values:t}),Ae=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var ke=Vt(class extends Ae{constructor(r){if(super(r),r.type!==qt.ATTRIBUTE||r.name!=="class"||r.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(r){return" "+Object.keys(r).filter(t=>r[t]).join(" ")+" "}update(r,[t]){if(this.st===void 0){this.st=new Set,r.strings!==void 0&&(this.nt=new Set(r.strings.join(" ").split(/\s/).filter(n=>n!=="")));for(let n in t)t[n]&&!this.nt?.has(n)&&this.st.add(n);return this.render(t)}let e=r.element.classList;for(let n of this.st)n in t||(e.remove(n),this.st.delete(n));for(let n in t){let i=!!t[n];i===this.st.has(n)||this.nt?.has(n)||(i?(e.add(n),this.st.add(n)):(e.remove(n),this.st.delete(n)))}return N}});var Y=(r,t,e)=>Math.round(Date.UTC(r,t-1,e)/864e5),E=r=>{let t=new Date(r*864e5);return{year:t.getUTCFullYear(),month:t.getUTCMonth()+1,day:t.getUTCDate()}},rr=r=>((r+4)%7+7)%7,Z=r=>{let[t,e,n]=r.slice(0,10).split("-").map(Number);return Y(t,e,n)},Xe=r=>{let{year:t,month:e,day:n}=E(r);return`${String(t).padStart(4,"0")}-${String(e).padStart(2,"0")}-${String(n).padStart(2,"0")}`},U=r=>new Date(r*864e5),Zt=r=>/^\d{4}-\d{2}-\d{2}$/.test(r),Kt=new Map,ir=r=>{let t=Kt.get(r);return t||(t=new Intl.DateTimeFormat("en-US",{timeZone:r,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}),Kt.set(r,t)),t},Qe=(r,t)=>{let e={};for(let n of ir(t).formatToParts(new Date(r)))n.type!=="literal"&&(e[n.type]=Number(n.value));return{year:e.year,month:e.month,day:e.day,hour:e.hour===24?0:e.hour,minute:e.minute,second:e.second}},P=(r,t)=>{let{year:e,month:n,day:i}=Qe(r,t);return Y(e,n,i)},Je=(r,t)=>Qe(r,t).hour,Yt=(r,t)=>{let e=Qe(r,t);return Date.UTC(e.year,e.month-1,e.day,e.hour,e.minute,e.second)-Math.floor(r/1e3)*1e3},T=(r,t)=>{let e=r*864e5,n=e-Yt(e,t),i=e-Yt(n,t);for(;P(i,t)<r;)i+=36e5;return i},Gt=()=>Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC",F=(r,t)=>r-(rr(r)-t+7)%7,ie=(r,t)=>Y(r,t,1),et=(r,t,e)=>{let n=r*12+(t-1)+e;return{year:Math.floor(n/12),month:(n%12+12)%12+1}},Xt=(r,t,e)=>{let n=ie(r,t),i=et(r,t,1),o=ie(i.year,i.month)-1,s=F(n,e),c=F(o,e)+6;return{start:s,weeks:(c-s+1)/7}};var Qt=r=>{if(r){if(typeof r=="string")return r;if("dateTime"in r)return r.dateTime;if("date"in r)return r.date}},or=(r,t,e,n)=>{let i=Qt(r.start),o=Qt(r.end);if(!i)return null;let s=r.all_day??Zt(i),c={id:`${t}|${r.uid??""}|${r.recurrence_id??""}|${i}|${n}`,calendar:t,summary:r.summary||"",description:r.description||void 0,location:r.location||void 0,tentative:r.status==="tentative"||r.status==="TENTATIVE"};if(s){let u=Z(i),p=o?Z(o):u+1;return p>u||(p=u+1),{...c,allDay:!0,startDay:u,endDay:p-1,start:T(u,e),end:T(p,e)}}let l=Date.parse(i);if(Number.isNaN(l))return null;let h=o?Date.parse(o):l;(Number.isNaN(h)||h<l)&&(h=l);let a=P(l,e),d=h>l?P(h-1,e):a;return{...c,allDay:!1,start:l,end:h,startDay:a,endDay:d}},en=(r,t)=>{let e=r.allDay||r.endDay>r.startDay,n=t.allDay||t.endDay>t.startDay;return e!==n?e?-1:1:r.start-t.start||t.end-r.end||r.summary.localeCompare(t.summary)},tn=(r,t)=>r.filter(e=>e.startDay<=t&&e.endDay>=t).sort(en),Jt=r=>r.event.allDay||r.span>1,sr=(r,t)=>r.col-t.col||Number(Jt(t))-Number(Jt(r))||t.span-r.span||en(r.event,t.event),nn=(r,t,e)=>{let n=t+6,i=[];for(let a of r){if(a.endDay<t||a.startDay>n)continue;let d=Math.max(a.startDay,t),u=Math.min(a.endDay,n);i.push({event:a,col:d-t,span:u-d+1,lane:-1,continuesBefore:a.startDay<t,continuesAfter:a.endDay>n})}i.sort(sr);let o=[];for(let a of i){let d=0;for(;;){let u=o[d]??=new Array(7).fill(!1),p=!0;for(let m=a.col;m<a.col+a.span;m++)if(u[m]){p=!1;break}if(p){for(let m=a.col;m<a.col+a.span;m++)u[m]=!0;a.lane=d;break}d++}}let s=new Array(7).fill(0),c=i.reduce((a,d)=>Math.max(a,d.lane+1),0);if(!(e>0)||c<=e)return{segments:i,more:s,lanes:c};let l=new Set;for(let a of i)if(a.lane>=e)for(let d=a.col;d<a.col+a.span;d++)l.add(d);let h=[];for(let a of i){let d=Array.from({length:a.span},(p,m)=>a.col+m);if(a.lane>=e||a.lane===e-1&&d.some(p=>l.has(p)))for(let p of d)s[p]++;else h.push(a)}return{segments:h,more:s,lanes:e}},ar=300*1e3,Se=class{constructor(t){this._host=t;t.addController(this)}_host;events=new Map;errors=new Set;loaded=!1;_key="";_generation=0;_unsubs=[];_pollTimer;_received=new Set;_hass;_params;hostConnected(){if(this._key="",this._hass&&this._params){let{entities:t,start:e,end:n,timeZone:i}=this._params;this.update(this._hass,t,e,n,i)}}hostDisconnected(){this._teardown()}update(t,e,n,i,o){this._hass=t,this._params={entities:e,start:n,end:i,timeZone:o};let s=JSON.stringify([e,n,i,o]);if(s===this._key)return;this._key=s,this._teardown();let c=++this._generation;this.loaded=!1,this.errors=new Set;for(let a of[...this.events.keys()])e.includes(a)||this.events.delete(a);this._received=new Set,e.length===0&&(this.loaded=!0);let l=new Date(n).toISOString(),h=new Date(i).toISOString();e.forEach(a=>{let d=p=>this._apply(c,a,p),u=t.connection.subscribeMessage(p=>d(p.events),{type:"calendar/event/subscribe",entity_id:a,start:l,end:h}).catch(p=>{c===this._generation&&(p?.code==="unknown_command"?this._startPolling(t,e,l,h):d(null))});this._unsubs.push(u)})}allEvents(t){let e=[];for(let[n,i]of this.events)t.has(n)||e.push(...i);return e}_startPolling(t,e,n,i){if(this._pollTimer)return;let o=this._generation,s=`?start=${encodeURIComponent(n)}&end=${encodeURIComponent(i)}`,c=()=>{e.forEach(l=>{t.callApi("GET",`calendars/${l}${s}`).then(h=>this._apply(o,l,h),()=>this._apply(o,l,null))})};c(),this._pollTimer=setInterval(c,ar)}_apply(t,e,n){if(t!==this._generation||!this._params)return;let{timeZone:i,entities:o}=this._params;n===null?this.errors.add(e):(this.errors.delete(e),this.events.set(e,n.map((s,c)=>or(s,e,i,c)).filter(s=>s!==null))),this._received.add(e),o.every(s=>this._received.has(s))&&(this.loaded=!0),this._host.requestUpdate()}_teardown(){this._generation++,this._pollTimer&&(clearInterval(this._pollTimer),this._pollTimer=void 0);let t=this._unsubs;this._unsubs=[];for(let e of t)e.then(n=>n?.()).catch(()=>{})}};var ge="jtd-calendar-card",De="jtd-calendar-card-editor",rn="Month Calendar & Weather",on="1.0.0",L={view:"month",weeks:2,past_weeks:0,first_day_of_week:"sunday",max_events_per_day:4,show_controls:!0,show_legend:!0,show_event_time:!0,dim_past:!0,show_forecast:!0,show_history:!0,show_precipitation:!0,open_meteo:!1,show_normals:!0},tt=1,nt=6;var G=r=>(r??[]).map(t=>typeof t=="string"?{entity:t}:t).filter(t=>!!t?.entity),cr=new Set(["primary","accent","red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","light-grey","grey","dark-grey","blue-grey","black","white"]),an=r=>cr.has(r)?`var(--${r}-color)`:r,sn=["#4269d0","#f4bd4a","#ff725c","#6cc5b0","#a463f2","#ff8ab7","#9c6b4e","#97bbf5","#01ab63","#094bad","#c99000","#d84f3e"],cn=r=>`var(--color-${r%54+1}, ${sn[r%sn.length]})`,lr=r=>{try{return Intl.DateTimeFormat.supportedLocalesOf(r??"en").length?r:"en"}catch{return"en"}},dr=r=>{switch(r.time_format){case"12":return!0;case"24":return!1;case"system":{let t=new Intl.DateTimeFormat(void 0,{hour:"numeric"}).resolvedOptions().hourCycle;return t==="h11"||t==="h12"}default:return}},Ce=class{constructor(t,e){this.timeZone=e;this.language=lr(t.language),this._hour12=dr(t)}timeZone;language;_hour12;_cache=new Map;_fmt(t,e){let n=this._cache.get(t);return n||(n=new Intl.DateTimeFormat(this.language,e),this._cache.set(t,n)),n}_date(t,e){return this._fmt(`d:${t}`,{...e,timeZone:"UTC"})}_time(t,e){return this._fmt(`t:${t}`,{...e,hour12:this._hour12,timeZone:this.timeZone})}monthYear(t){return this._date("my",{month:"long",year:"numeric"}).format(U(t))}monthShort(t){return this._date("ms",{month:"short"}).format(U(t))}weekday(t,e){return this._date(`wd${e}`,{weekday:e}).format(U(t))}dayRange(t,e){return this._date("range",{month:"short",day:"numeric",year:"numeric"}).formatRange(U(t),U(e))}dayLong(t){return this._date("long",{weekday:"long",month:"long",day:"numeric"}).format(U(t))}time(t){return this._time("time",{hour:"numeric",minute:"2-digit"}).format(t)}compactTime(t){let e=this._time("time",{hour:"numeric",minute:"2-digit"});if(!this.language.startsWith("en"))return e.format(t);let n=e.formatToParts(t),i=c=>n.find(l=>l.type===c)?.value,o=i("dayPeriod");if(!o)return e.format(t);let s=i("minute");return`${i("hour")}${s&&s!=="00"?`:${s}`:""}${o[0].toLowerCase()}`}eventRange(t,e){return t.allDay?t.startDay===t.endDay?e:this._date("adr",{month:"short",day:"numeric"}).formatRange(U(t.startDay),U(t.endDay)):t.startDay===t.endDay?this._time("tr",{hour:"numeric",minute:"2-digit"}).formatRange(t.start,Math.max(t.start,t.end)):this._time("dtr",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).formatRange(t.start,t.end)}},X=r=>r===void 0?"\u2013":`${Math.round(r)}\xB0`;var hr={title:"Title",entities:"Calendars",view:"Initial view",weeks:"Weeks shown in week view",past_weeks:"Past weeks in week view",first_day_of_week:"First day of the week",max_events_per_day:"Max events per day",show_controls:"Navigation controls",show_legend:"Calendar legend",show_event_time:"Event start times",dim_past:"Dim past days",weather_entity:"Weather entity (forecast)",temperature_entity:"Outdoor temperature sensor (history)",show_forecast:"Show forecast",show_history:"Show historical weather",show_precipitation:"Show chance of precipitation",open_meteo:"Fill gaps with Open-Meteo",show_normals:"Typical weather beyond the forecast"},pr={entities:"Colors default to the color set in each calendar's entity settings.",weeks:"How many Sunday\u2013Saturday rows the week view shows. Expand or shrink it from the card.",past_weeks:"Start the week view this many weeks before the current week.",max_events_per_day:"Extra events collapse into a \u201C+N more\u201D link.",weather_entity:"Daily forecast from a Home Assistant weather entity. Past days use its recorded history.",temperature_entity:"Long-term statistics of this sensor give exact highs and lows for any past day.",open_meteo:"Keyless Open-Meteo data for your home location fills days Home Assistant has no weather for: older history and a 16-day forecast.",show_normals:"Requires Open-Meteo. Days past the forecast show the 5-year average high/low so the whole month has weather."},ur={entity:{label:"Calendar",required:!0,selector:{entity:{filter:{domain:"calendar"}}}},name:{label:"Name",selector:{text:{}}},color:{label:"Color",selector:{ui_color:{}}}},mr=[{name:"title",selector:{text:{}}},{name:"entities",required:!0,selector:{object:{multiple:!0,label_field:"entity",description_field:"name",fields:ur}}},{name:"",type:"expandable",flatten:!0,title:"Layout",icon:"mdi:calendar-week",schema:[{name:"view",selector:{select:{mode:"dropdown",options:[{value:"month",label:"Month"},{value:"weeks",label:"Weeks"}]}}},{name:"",type:"grid",schema:[{name:"weeks",selector:{number:{min:1,max:6,mode:"box"}}},{name:"past_weeks",selector:{number:{min:0,max:5,mode:"box"}}}]},{name:"",type:"grid",schema:[{name:"first_day_of_week",selector:{select:{mode:"dropdown",options:[{value:"sunday",label:"Sunday"},{value:"monday",label:"Monday"}]}}},{name:"max_events_per_day",selector:{number:{min:1,max:12,mode:"box"}}}]},{name:"",type:"grid",schema:[{name:"show_controls",selector:{boolean:{}}},{name:"show_legend",selector:{boolean:{}}},{name:"show_event_time",selector:{boolean:{}}},{name:"dim_past",selector:{boolean:{}}}]}]},{name:"",type:"expandable",flatten:!0,title:"Weather",icon:"mdi:weather-partly-cloudy",schema:[{name:"weather_entity",selector:{entity:{filter:{domain:"weather"}}}},{name:"temperature_entity",selector:{entity:{filter:{domain:"sensor",device_class:"temperature"}}}},{name:"",type:"grid",schema:[{name:"show_forecast",selector:{boolean:{}}},{name:"show_history",selector:{boolean:{}}},{name:"show_precipitation",selector:{boolean:{}}}]},{name:"open_meteo",selector:{boolean:{}}},{name:"show_normals",selector:{boolean:{}}}]}],fr=async()=>{if(!customElements.get("ha-form"))try{await(await window.loadCardHelpers?.())?.createCardElement({type:"entities",entities:[]})?.constructor?.getConfigElement?.()}catch{}},ln,dn,hn,pn,j,rt,it,ot,z=class extends(pn=O,hn=[re({attribute:!1})],dn=[R()],ln=[R()],pn){constructor(){super(...arguments);S(this,rt,w(j,8,this)),w(j,11,this);S(this,it,w(j,12,this)),w(j,15,this);S(this,ot,w(j,16,this,!!customElements.get("ha-form"))),w(j,19,this);M(this,"_computeLabel",e=>hr[e.name]??e.name);M(this,"_computeHelper",e=>pr[e.name])}setConfig(e){this._config=e}connectedCallback(){super.connectedCallback(),this._ready||fr().then(()=>customElements.whenDefined("ha-form")).then(()=>{this._ready=!0})}render(){if(!this.hass||!this._config||!this._ready)return f;let e={...this._config,...Object.fromEntries(Object.entries(L).filter(([n])=>!(n in this._config))),entities:G(this._config.entities)};return _`
      <ha-form
        .hass=${this.hass}
        .data=${e}
        .schema=${mr}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}_valueChanged(e){e.stopPropagation();let n=this._config??{},i={...e.detail.value};for(let[o,s]of Object.entries(L))i[o]===s&&!(o in n)&&delete i[o];for(let[o,s]of Object.entries(i))(s===""||s===void 0)&&delete i[o];this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}};j=ve(pn),rt=new WeakMap,it=new WeakMap,ot=new WeakMap,k(j,4,"hass",hn,z,rt),k(j,4,"_config",dn,z,it),k(j,4,"_ready",ln,z,ot),se(j,z),M(z,"styles",ce`
    :host {
      display: block;
    }
  `);var gr={today:"Today",all_day:"All day",more:"+{count} more",weeks_label:"{count} weeks",one_week:"1 week",month_view:"Month view",week_view:"Week view",previous:"Previous",next:"Next",expand:"Show more weeks",collapse:"Show fewer weeks",forecast:"Forecast",observed:"Observed",typical:"Typical (5-year average)",high:"High",low:"Low",precipitation:"Precipitation",chance:"Chance of precipitation",no_events:"No events",location:"Location",description:"Description",tentative:"Tentative",close:"Close",back:"Back",source:"Source",error:"Could not load events for {entities}",no_entities:"Add calendar entities to the card configuration."},yr={today:"ui.components.calendar.today",all_day:"ui.components.calendar.event.all_day",location:"ui.components.calendar.event.location",description:"ui.components.calendar.event.description",tentative:"ui.components.calendar.event.tentative",close:"ui.common.close",back:"ui.common.back",previous:"ui.common.previous",next:"ui.common.next",forecast:"ui.card.weather.forecast",high:"ui.card.weather.high",low:"ui.card.weather.low",precipitation:"ui.card.weather.attributes.precipitation"},un=(r,t,e={})=>{let n=yr[t],i=n&&r?.localize?.(n)||gr[t];for(let[o,s]of Object.entries(e))i=i.replace(`{${o}}`,String(s));return i},_r={"clear-night":"Clear, night",cloudy:"Cloudy",exceptional:"Exceptional",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning, rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy, rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy, cloudy"},st=(r,t,e)=>{let n=e?r?.states[e]:void 0;if(n&&r?.formatEntityState){let i=r.formatEntityState(n,t);if(i&&i!==t)return i}return r?.localize?.(`component.weather.entity_component._.state.${t}`)||_r[t]||t};var mn=ce`
  :host {
    display: block;
    height: 100%;
    --jtd-event-height: 20px;
    --jtd-gap: 2px;
    --jtd-border: var(--divider-color, rgba(127, 127, 127, 0.2));
    --jtd-today: var(--primary-color);
    --jtd-sun: var(--jtd-calendar-sun-color, #f9a825);
    --jtd-night: var(--jtd-calendar-night-color, #7e8fbf);
    --jtd-cloud: var(--jtd-calendar-cloud-color, var(--secondary-text-color));
    --jtd-rain: var(--jtd-calendar-rain-color, #1e88e5);
    --jtd-snow: var(--jtd-calendar-snow-color, #4fc3f7);
    --jtd-storm: var(--jtd-calendar-storm-color, #7e57c2);
    --jtd-wind: var(--jtd-calendar-wind-color, #26a69a);
    --jtd-alert: var(--error-color, #db4437);
  }

  ha-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .card {
    container: jtd-calendar / inline-size;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
  button:disabled {
    cursor: default;
    opacity: 0.38;
  }

  ha-icon {
    --mdc-icon-size: 20px;
    display: inline-flex;
    flex: none;
  }

  /* ----------------------------------------------------------- header */

  .header {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-2, 8px);
    padding: var(--ha-space-3, 12px) var(--ha-space-3, 12px) var(--ha-space-2, 8px);
  }

  .title {
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: var(--ha-font-weight-heading, var(--ha-font-weight-bold, 700));
    line-height: var(--ha-line-height-condensed, 1.2);
    color: var(--ha-card-header-color, var(--primary-text-color));
    padding: 0 var(--ha-space-1, 4px);
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--ha-space-2, 8px);
  }

  .nav,
  .actions {
    display: flex;
    align-items: center;
    gap: var(--ha-space-1, 4px);
    min-width: 0;
  }

  .range {
    margin: 0 var(--ha-space-1, 4px);
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon-button {
    width: 36px;
    height: 36px;
    border-radius: var(--ha-border-radius-circle, 50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    transition: background-color 120ms ease;
  }
  .icon-button:hover:not(:disabled),
  .pill:hover:not(:disabled),
  .segmented button:hover:not([aria-pressed="true"]) {
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
  }

  .pill {
    height: 32px;
    padding: 0 var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-pill, 9999px);
    border: 1px solid var(--jtd-border);
    display: inline-flex;
    align-items: center;
    gap: var(--ha-space-1, 4px);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    white-space: nowrap;
  }
  .pill ha-icon {
    --mdc-icon-size: 18px;
  }

  .segmented {
    display: inline-flex;
    border: 1px solid var(--jtd-border);
    border-radius: var(--ha-border-radius-pill, 9999px);
    overflow: hidden;
    height: 32px;
  }
  .segmented button {
    display: inline-flex;
    align-items: center;
    gap: var(--ha-space-1, 4px);
    padding: 0 var(--ha-space-3, 12px);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .segmented button + button {
    border-inline-start: 1px solid var(--jtd-border);
  }
  .segmented button[aria-pressed="true"] {
    background: color-mix(in srgb, var(--primary-color) 18%, transparent);
    color: var(--primary-color);
  }
  .segmented ha-icon {
    --mdc-icon-size: 18px;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 26px;
    padding: 0 10px 0 8px;
    border-radius: var(--ha-border-radius-pill, 9999px);
    background: color-mix(in srgb, var(--event-color) 14%, transparent);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    max-width: 100%;
  }
  .chip span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chip[aria-pressed="false"] {
    background: none;
    color: var(--secondary-text-color);
    text-decoration: line-through;
    box-shadow: inset 0 0 0 1px var(--jtd-border);
  }
  .chip[aria-pressed="false"] .dot {
    background: transparent;
    box-shadow: inset 0 0 0 2px var(--event-color);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--event-color);
    flex: none;
  }

  .notice {
    margin: 0 var(--ha-space-3, 12px) var(--ha-space-2, 8px);
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-md, 8px);
    font-size: var(--ha-font-size-s, 12px);
    background: color-mix(in srgb, var(--warning-color, #ffa600) 14%, transparent);
  }

  .loading {
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    overflow: hidden;
    z-index: 1;
  }
  .loading::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 30%;
    background: var(--primary-color);
    animation: slide 1.1s ease-in-out infinite;
  }
  @keyframes slide {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(400%);
    }
  }

  /* ------------------------------------------------------------- grid */

  .weekdays,
  .week {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .weekdays {
    border-bottom: 1px solid var(--jtd-border);
    padding: 0 0 var(--ha-space-1, 4px);
  }
  .weekdays div {
    text-align: center;
    font-size: var(--ha-font-size-xs, 11px);
    font-weight: var(--ha-font-weight-medium, 500);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
  }
  .weekdays .narrow {
    display: none;
  }

  .weeks {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
  }

  .week {
    flex: 1 1 auto;
    min-height: var(--jtd-week-min-height, 96px);
    row-gap: var(--jtd-gap);
    border-bottom: 1px solid var(--jtd-border);
    position: relative;
  }
  .week:last-child {
    border-bottom: none;
  }

  .day {
    grid-row: 1 / -1;
    border-inline-end: 1px solid var(--jtd-border);
    border-radius: 0;
    transition: background-color 120ms ease;
  }
  .day.last-col {
    border-inline-end: none;
  }
  .day:hover {
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
  }
  .day.other-month {
    background: color-mix(in srgb, var(--primary-text-color) 3%, transparent);
  }
  .day.today {
    background: color-mix(in srgb, var(--jtd-today) 8%, transparent);
  }

  .day-head {
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2px;
    padding: 4px 4px 2px 6px;
    min-width: 0;
    pointer-events: none;
    z-index: 1;
  }

  .date {
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    min-width: 24px;
    height: 24px;
    padding: 0 4px;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--ha-border-radius-pill, 9999px);
    white-space: nowrap;
    flex: none;
  }
  .other-month-head .date {
    color: var(--secondary-text-color);
    opacity: 0.7;
  }
  .today-head .date {
    background: var(--jtd-today);
    color: var(--text-primary-color, #fff);
  }
  .past-head .date {
    color: var(--secondary-text-color);
  }

  /* ---------------------------------------------------------- weather */

  .wx {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    min-width: 0;
    overflow: hidden;
    font-size: var(--ha-font-size-s, 12px);
    line-height: 1;
    white-space: nowrap;
  }
  .wx-icon {
    --mdc-icon-size: 18px;
  }
  .tone-sun {
    color: var(--jtd-sun);
  }
  .tone-night {
    color: var(--jtd-night);
  }
  .tone-cloud {
    color: var(--jtd-cloud);
  }
  .tone-rain {
    color: var(--jtd-rain);
  }
  .tone-snow {
    color: var(--jtd-snow);
  }
  .tone-storm {
    color: var(--jtd-storm);
  }
  .tone-wind {
    color: var(--jtd-wind);
  }
  .tone-alert {
    color: var(--jtd-alert);
  }
  .temps {
    display: inline-flex;
    gap: 3px;
  }
  .hi {
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .lo {
    color: var(--secondary-text-color);
  }
  .wx.history .wx-icon {
    opacity: 0.75;
  }
  .wx.normal .temps {
    font-style: italic;
    color: var(--secondary-text-color);
  }
  .wx.normal .hi::before {
    content: "~";
  }
  .pop {
    display: inline-flex;
    align-items: center;
    color: var(--jtd-rain);
    font-size: var(--ha-font-size-xs, 10px);
  }
  .pop ha-icon {
    --mdc-icon-size: 12px;
  }

  /* ----------------------------------------------------------- events */

  .event {
    position: relative;
    z-index: 1;
    height: var(--jtd-event-height);
    margin: 0 4px;
    padding: 0 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    font-size: var(--ha-font-size-s, 12px);
    line-height: var(--jtd-event-height);
    text-align: start;
    border-radius: var(--ha-border-radius-sm, 4px);
    overflow: hidden;
  }
  .event .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
  .event.spanning {
    background: color-mix(in srgb, var(--event-color) 24%, transparent);
    box-shadow: inset 3px 0 0 var(--event-color);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .event.spanning:hover {
    background: color-mix(in srgb, var(--event-color) 34%, transparent);
  }
  .event.cont-before {
    margin-inline-start: 0;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    box-shadow: none;
  }
  .event.cont-after {
    margin-inline-end: 0;
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }
  .event.timed {
    padding: 0 4px;
  }
  .event.timed:hover {
    background: color-mix(in srgb, var(--event-color) 14%, transparent);
  }
  .event .time {
    color: var(--secondary-text-color);
    flex: none;
    font-variant-numeric: tabular-nums;
  }
  .event.tentative {
    font-style: italic;
  }
  .event.tentative.spanning {
    background: repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, var(--event-color) 22%, transparent) 0 6px,
      color-mix(in srgb, var(--event-color) 10%, transparent) 6px 12px
    );
  }
  .dim .event.past {
    opacity: 0.55;
  }

  .more {
    position: relative;
    z-index: 1;
    margin: 0 4px;
    padding: 0 6px;
    height: var(--jtd-event-height);
    border-radius: var(--ha-border-radius-sm, 4px);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--secondary-text-color);
    text-align: start;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .more:hover {
    background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
  }

  .expander {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ha-space-2, 8px);
    padding: var(--ha-space-2, 8px);
    border-top: 1px solid var(--jtd-border);
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
  }

  .empty-hint {
    padding: var(--ha-space-4, 16px);
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-m, 14px);
  }

  /* ------------------------------------------------- narrow containers */

  @container jtd-calendar (max-width: 1000px) {
    .pop {
      display: none;
    }
  }

  @container jtd-calendar (max-width: 880px) {
    .wx .lo {
      display: none;
    }
  }

  @container jtd-calendar (max-width: 520px) {
    :host {
      --jtd-event-height: 18px;
    }
    .weekdays .wide {
      display: none;
    }
    .weekdays .narrow {
      display: block;
    }
    .day-head {
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
      padding: 2px 2px 0;
    }
    .date {
      min-width: 22px;
      height: 22px;
    }
    .wx {
      padding-inline-start: 2px;
      font-size: var(--ha-font-size-xs, 10px);
    }
    .wx-icon {
      --mdc-icon-size: 15px;
    }
    .event,
    .more {
      margin: 0 1px;
      padding: 0 3px;
      font-size: var(--ha-font-size-xs, 10px);
    }
    .event .time {
      display: none;
    }
    .event.timed .dot {
      width: 6px;
      height: 6px;
    }
    .segmented span,
    .pill .label {
      display: none;
    }
    .segmented button {
      padding: 0 var(--ha-space-2, 8px);
    }
  }

  /* ----------------------------------------------------------- dialog */

  dialog {
    border: none;
    padding: 0;
    width: min(460px, calc(100vw - 32px));
    max-height: min(85vh, 720px);
    border-radius: var(--ha-dialog-border-radius, var(--ha-border-radius-4xl, 28px));
    background: var(
      --ha-dialog-surface-background,
      var(--card-background-color, var(--ha-card-background, #fff))
    );
    color: var(--primary-text-color);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  dialog::backdrop {
    background: var(--ha-dialog-scrim-backdrop, rgba(0, 0, 0, 0.32));
  }
  dialog[open] {
    animation: dialog-in 160ms ease-out;
  }
  @keyframes dialog-in {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
  }

  .dlg:focus {
    outline: none;
  }
  .dlg {
    display: flex;
    flex-direction: column;
    max-height: inherit;
    padding: var(--ha-space-5, 20px) var(--ha-space-5, 20px) var(--ha-space-4, 16px);
    box-sizing: border-box;
    gap: var(--ha-space-4, 16px);
    overflow: auto;
  }
  .dlg-head {
    display: flex;
    align-items: flex-start;
    gap: var(--ha-space-2, 8px);
  }
  .dlg-head .grow {
    flex: 1;
    min-width: 0;
  }
  .dlg-head h3 {
    margin: 0;
    font-size: var(--ha-font-size-2xl, 24px);
    font-weight: var(--ha-font-weight-normal, 400);
    line-height: 1.25;
    overflow-wrap: anywhere;
  }
  .dlg-sub {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 2px;
  }
  .dlg-head .icon-button {
    margin: -6px -8px 0 0;
  }
  .dlg-head .back {
    margin: -6px 0 0 -8px;
  }

  .wx-card {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    padding: var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-lg, 12px);
    background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
  }
  .wx-card ha-icon {
    --mdc-icon-size: 40px;
  }
  .wx-card .grow {
    flex: 1;
    min-width: 0;
  }
  .wx-card .cond {
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .wx-card .meta,
  .wx-card .src {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
  }
  .wx-card .temps-big {
    font-size: var(--ha-font-size-xl, 20px);
    white-space: nowrap;
  }
  .wx-card .temps-big .lo {
    font-size: var(--ha-font-size-l, 16px);
  }

  .dlg-events {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0 calc(-1 * var(--ha-space-2, 8px));
  }
  .dlg-event {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    padding: var(--ha-space-2, 8px);
    border-radius: var(--ha-border-radius-md, 8px);
    text-align: start;
  }
  .dlg-event:hover {
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
  }
  .dlg-event .bar {
    width: 4px;
    align-self: stretch;
    border-radius: 2px;
    background: var(--event-color);
    flex: none;
  }
  .dlg-event .grow {
    flex: 1;
    min-width: 0;
  }
  .dlg-event .summary {
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    overflow-wrap: anywhere;
  }
  .dlg-event .meta {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
    overflow-wrap: anywhere;
  }
  .dlg-event > ha-icon {
    color: var(--secondary-text-color);
  }
  .dlg-empty {
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-m, 14px);
    padding: var(--ha-space-2, 8px) 0;
  }

  .detail-rows {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-3, 12px);
  }
  .detail {
    display: flex;
    gap: var(--ha-space-3, 12px);
    align-items: flex-start;
    font-size: var(--ha-font-size-m, 14px);
    line-height: 1.45;
  }
  .detail > ha-icon {
    color: var(--secondary-text-color);
    margin-top: 1px;
  }
  .detail .text {
    min-width: 0;
    overflow-wrap: anywhere;
    white-space: pre-line;
  }
  .detail .dot {
    width: 12px;
    height: 12px;
    margin: 4px;
  }
  .badge {
    align-self: flex-start;
    font-size: var(--ha-font-size-xs, 11px);
    font-weight: var(--ha-font-weight-medium, 500);
    padding: 2px 8px;
    border-radius: var(--ha-border-radius-pill, 9999px);
    border: 1px dashed var(--secondary-text-color);
    color: var(--secondary-text-color);
  }
`;var vr=1,br=2,wr=4,_n=7,vn=19,bn=new Set(["unavailable","unknown",""]),W=r=>typeof r=="number"&&Number.isFinite(r),wn=(r,t,e)=>{if(!W(r))return;let n=(t??e).includes("F"),i=e.includes("F");return n===i?r:i?r*9/5+32:(r-32)*5/9},ct=r=>!r||bn.has(r)?void 0:r==="clear-night"?"sunny":r,xn=r=>{let t,e=-1;for(let[n,i]of r)i>e&&(t=n,e=i);return t},Te=r=>{let t=r.filter(W);return t.length?Math.max(...t):void 0},Re=r=>{let t=r.filter(W);return t.length?Math.min(...t):void 0},xr=r=>{let t=r.filter(W);return t.length?t.reduce((e,n)=>e+n,0):void 0},$r=r=>{let t=r??0;if(t&vr)return"daily";if(t&wr)return"twice_daily";if(t&br)return"hourly"},Er=(r,t,e,n,i)=>{let o=t==="daily"&&r.length>0&&r.every(h=>/T00:00(:00(\.0+)?)?(Z|\+00:00)$/.test(h.datetime)),s=new Map;for(let h of r){let a=Date.parse(h.datetime);if(Number.isNaN(a))continue;let d=o?Z(h.datetime):P(a,e),u=s.get(d);u?u.push(h):s.set(d,[h])}let c=h=>wn(h,n.temperature,n.display),l=new Map;for(let[h,a]of s){let d={source:"forecast",provider:i,precipitationUnit:n.precipitation,precipitation:xr(a.map(g=>g.precipitation)),precipitationProbability:Te(a.map(g=>g.precipitation_probability??void 0))};if(t==="daily"){let g=a[0];l.set(h,{...d,precipitation:W(g.precipitation)?g.precipitation:void 0,condition:ct(g.condition),high:c(g.temperature),low:c(g.templow)});continue}let u=t==="twice_daily"?a.filter(g=>g.is_daytime!==!1):a.filter(g=>{let y=Je(Date.parse(g.datetime),e);return y>=_n&&y<vn}),p=u.length?u:a,m=new Map;for(let g of p){let y=ct(g.condition);y&&m.set(y,(m.get(y)??0)+1)}let v,x;if(t==="twice_daily"){let g=a.filter(y=>y.is_daytime===!1);v=Te((u.length?u:a).map(y=>c(y.temperature))),x=g.length?Re(g.map(y=>c(y.templow??y.temperature))):Re(a.map(y=>c(y.templow)))}else v=Te(a.map(g=>c(g.temperature))),x=Re(a.map(g=>c(g.temperature)));l.set(h,{...d,condition:xn(m),high:v,low:x})}return l},Ar=(r,t,e,n,i)=>{let o=[...r].sort((h,a)=>h.lu-a.lu),s=new Map,c={};for(let h=0;h<o.length;h++){let a=o[h];a.a&&(c=a.a);let d=a.lu*1e3,u=h+1<o.length?o[h+1].lu*1e3:e;if(!(u>d))continue;let p=ct(a.s),m=bn.has(a.s)?void 0:wn(c.temperature,c.temperature_unit,n),v=d;for(;v<u;){let x=P(v,t),g=Math.min(u,T(x+1,t)),y=s.get(x);if(y||(y={weights:new Map,temps:[]},s.set(x,y)),p){let C=Je(v,t),$=C>=_n&&C<vn?1:.1;y.weights.set(p,(y.weights.get(p)??0)+(g-v)*$)}m!==void 0&&y.temps.push(m),v=g>v?g:u}}let l=new Map;for(let[h,{weights:a,temps:d}]of s)l.set(h,{source:"history",provider:i,condition:xn(a),high:Te(d),low:Re(d)});return l},kr=(r,t,e)=>{let n=new Map;for(let i of r){let o=typeof i.start=="number"?i.start:Date.parse(i.start);if(Number.isNaN(o))continue;let s=W(i.max)?i.max:void 0,c=W(i.min)?i.min:void 0;s===void 0&&c===void 0||n.set(P(o+36e5,t),{source:"history",provider:e,high:s,low:c})}return n},dt="Open-Meteo",Sr={0:"sunny",1:"sunny",2:"partlycloudy",3:"cloudy",45:"fog",48:"fog",51:"rainy",53:"rainy",55:"rainy",56:"snowy-rainy",57:"snowy-rainy",61:"rainy",63:"rainy",65:"pouring",66:"snowy-rainy",67:"snowy-rainy",71:"snowy",73:"snowy",75:"snowy",77:"snowy",80:"rainy",81:"rainy",82:"pouring",85:"snowy",86:"snowy",95:"lightning-rainy",96:"lightning-rainy",99:"lightning-rainy"},Dr=r=>W(r)?Sr[r]:void 0,Q=(r,t)=>{let e=r?.[t];return W(e)?e:void 0},fn=(r,t,e)=>{let n=new Map;return r.time.forEach((i,o)=>{let s=Z(i),c={source:s<t?"history":"forecast",provider:dt,condition:Dr(r.weather_code?.[o]),high:Q(r.temperature_2m_max,o),low:Q(r.temperature_2m_min,o),precipitation:Q(r.precipitation_sum,o),precipitationUnit:e,precipitationProbability:Q(r.precipitation_probability_max,o)};(c.condition||c.high!==void 0||c.low!==void 0)&&n.set(s,c)}),n},lt=(r,t)=>{let{month:e,day:n}=E(r),i=Y(t,e+1,1)-Y(t,e,1);return Y(t,e,Math.min(n,i))},$n=5,Oe=3,Cr=(r,t)=>{let{year:e}=E(r),{year:n}=E(t);return{start:lt(r,e-$n)-Oe,end:lt(t,n-1)+Oe}},Mr=(r,t,e,n)=>{let i=new Map;r.time.forEach((s,c)=>i.set(Z(s),c));let o=new Map;for(let s of t){let{year:c}=E(s),l=[],h=[],a=0,d=0;for(let p=1;p<=$n;p++){let m=lt(s,c-p);for(let v=-Oe;v<=Oe;v++){let x=i.get(m+v);if(x===void 0)continue;let g=Q(r.temperature_2m_max,x),y=Q(r.temperature_2m_min,x),C=Q(r.precipitation_sum,x);g!==void 0&&l.push(g),y!==void 0&&h.push(y),C!==void 0&&(d++,C>=e&&a++)}}if(!l.length&&!h.length)continue;let u=p=>p.length?p.reduce((m,v)=>m+v,0)/p.length:void 0;o.set(s,{source:"normal",provider:dt,high:u(l),low:u(h),precipitationUnit:n,precipitationProbability:d?Math.round(a/d*100):void 0})}return o},at=new Map,Me=(r,t)=>{let e=at.get(r);if(e&&e.expires>Date.now())return e.promise;let n=fetch(r).then(i=>{if(!i.ok)throw new Error(`${dt} HTTP ${i.status}`);return i.json()});return at.set(r,{expires:Date.now()+t,promise:n}),n.catch(()=>at.delete(r)),n},gn=92,yn=15,Tr=["condition","high","low","precipitation","precipitationUnit","precipitationProbability"],Rr=r=>{let t=r.filter(n=>n!==void 0);if(!t.length)return;let e={source:t[0].source,provider:t[0].provider};for(let n of Tr)for(let i of t)if(i[n]!==void 0){e[n]=i[n];break}return e},Or=1800*1e3,Pe=class{constructor(t){this._host=t;t.addController(this)}_host;_hass;_params;_forecast=new Map;_history=new Map;_stats=new Map;_omForecast=new Map;_omPast=new Map;_normals=new Map;_forecastKey="";_forecastUnsub;_rangeKey="";_rangeFetchedAt=0;_rangeGeneration=0;hostConnected(){this._forecastKey="",this._rangeKey="",this._hass&&this._params&&this.update(this._hass,this._params)}hostDisconnected(){this._unsubscribeForecast(),this._rangeGeneration++}update(t,e){this._hass=t,this._params=e,this._updateForecast(t,e);let n=JSON.stringify([e.weatherEntity,e.temperatureEntity,e.firstDay,e.lastDay,e.today,e.timeZone,e.showHistory,e.openMeteo,e.showNormals,t.config.unit_system.temperature]);(n!==this._rangeKey||Date.now()-this._rangeFetchedAt>Or)&&(n!==this._rangeKey&&(this._history=new Map,this._stats=new Map,this._omForecast=new Map,this._omPast=new Map,this._normals=new Map),this._rangeKey=n,this._rangeFetchedAt=Date.now(),this._fetchRange(t,e))}dayWeather(t){let e=this._params;if(!e)return;let n=[];return t>=e.today&&e.showForecast&&n.push(this._forecast.get(t),this._omForecast.get(t)),t<=e.today&&e.showHistory&&n.push(this._stats.get(t),this._history.get(t),this._omPast.get(t)),t>e.today&&e.showNormals&&!n.some(Boolean)&&n.push(this._normals.get(t)),Rr(n)}_displayUnit(t){return t.config.unit_system?.temperature||"\xB0C"}_updateForecast(t,e){let n=e.weatherEntity,i=n?t.states[n]:void 0,o=e.showForecast&&i?$r(i.attributes.supported_features):void 0,s=o?JSON.stringify([n,o,e.serverTimeZone]):"";s!==this._forecastKey&&(this._forecastKey=s,this._unsubscribeForecast(),this._forecast=new Map,!(!o||!n)&&(this._forecastUnsub=t.connection.subscribeMessage(c=>{if(this._forecastKey!==s)return;let l=this._hass?.states[n]?.attributes??{};this._forecast=Er(c.forecast??[],o,e.serverTimeZone,{temperature:l.temperature_unit,precipitation:l.precipitation_unit,display:this._displayUnit(this._hass??t)},n),this._host.requestUpdate()},{type:"weather/subscribe_forecast",forecast_type:o,entity_id:n}).catch(c=>{console.warn("jtd-calendar-card: forecast subscription failed",c)})))}_unsubscribeForecast(){let t=this._forecastUnsub;this._forecastUnsub=void 0,t?.then(e=>e?.()).catch(()=>{})}_fetchRange(t,e){let n=++this._rangeGeneration,i=()=>n===this._rangeGeneration,o=this._displayUnit(t),{firstDay:s,lastDay:c,today:l,timeZone:h,serverTimeZone:a}=e,d=Date.now();if(e.showHistory&&s<=l){let u=T(s,h),p=Math.min(d,T(Math.min(c,l)+1,h));if(e.weatherEntity&&p>u){let m=e.weatherEntity;t.callWS({type:"history/history_during_period",start_time:new Date(u).toISOString(),end_time:new Date(p).toISOString(),entity_ids:[m],include_start_time_state:!0,significant_changes_only:!!e.temperatureEntity,minimal_response:!1,no_attributes:!1}).then(v=>{i()&&(this._history=Ar(v[m]??[],h,p,o,m),this._host.requestUpdate())}).catch(v=>console.warn("jtd-calendar-card: weather history failed",v))}if(e.temperatureEntity){let m=e.temperatureEntity,v=T(s,a),x=T(Math.min(c,l)+1,a);t.callWS({type:"recorder/statistics_during_period",start_time:new Date(v).toISOString(),end_time:new Date(x).toISOString(),statistic_ids:[m],period:"day",types:["min","max","mean"],units:{temperature:o}}).then(g=>{i()&&(this._stats=kr(g[m]??[],a,m),this._host.requestUpdate())}).catch(g=>console.warn("jtd-calendar-card: temperature statistics failed",g))}}e.openMeteo&&t.config.latitude!==void 0&&this._fetchOpenMeteo(t,e,i)}_fetchOpenMeteo(t,e,n){let{firstDay:i,lastDay:o,today:s,serverTimeZone:c}=e,l=this._displayUnit(t).includes("F"),h=t.config.unit_system.accumulated_precipitation==="in"||t.config.unit_system.length==="mi",a=h?"in":"mm",d=new URLSearchParams({latitude:t.config.latitude.toFixed(2),longitude:t.config.longitude.toFixed(2),timezone:c,temperature_unit:l?"fahrenheit":"celsius",precipitation_unit:h?"inch":"mm"}),u=(A,je,_e,He)=>`${A}?${d}&daily=${He}&start_date=${Xe(je)}&end_date=${Xe(_e)}`,p=A=>console.warn("jtd-calendar-card: Open-Meteo request failed",A),m="weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",v="weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",x=A=>{n()&&(this._omPast=new Map([...this._omPast,...fn(A,s,a)]),this._host.requestUpdate())},g=Math.max(i,s),y=Math.min(o,s+yn);g<=y&&Me(u("https://api.open-meteo.com/v1/forecast",g,y,m),3600*1e3).then(({daily:A})=>{n()&&(this._omForecast=fn(A,s,a),this._host.requestUpdate())}).catch(p);let C=Math.max(i,s-gn),$=Math.min(o,s-1);e.showHistory&&C<=$&&Me(u("https://api.open-meteo.com/v1/forecast",C,$,v),3600*1e3).then(({daily:A})=>x(A)).catch(p);let J=Math.min(o,s-gn-1);e.showHistory&&i<=J&&Me(u("https://archive-api.open-meteo.com/v1/archive",i,J,v),1440*60*1e3).then(({daily:A})=>x(A)).catch(p);let ye=Math.max(i,s+yn+1);if(e.showNormals&&ye<=o){let A=Cr(ye,o),je=Array.from({length:o-ye+1},(_e,He)=>ye+He);Me(u("https://archive-api.open-meteo.com/v1/archive",A.start,A.end,"temperature_2m_max,temperature_2m_min,precipitation_sum"),1440*60*1e3).then(({daily:_e})=>{n()&&(this._normals=Mr(_e,je,h?.04:1,a),this._host.requestUpdate())}).catch(p)}}};var En={"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",exceptional:"mdi:alert-circle-outline",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant"},An={sunny:"sun",partlycloudy:"sun","clear-night":"night",cloudy:"cloud",fog:"cloud",rainy:"rain",pouring:"rain",snowy:"snow","snowy-rainy":"snow",hail:"snow",lightning:"storm","lightning-rainy":"storm",windy:"wind","windy-variant":"wind",exceptional:"alert"},ht={forecast:"forecast",history:"observed",normal:"typical"},kn=r=>{let t=Math.round(Number(r));return Number.isFinite(t)?Math.min(nt,Math.max(tt,t)):L.weeks},Sn,Dn,Cn,Mn,Tn,Rn,On,Pn,jn,Hn,b,pt,ut,mt,ft,gt,yt,_t,vt,bt,D=class extends(Hn=O,jn=[re({attribute:!1})],Pn=[R()],On=[R()],Rn=[R()],Tn=[R()],Mn=[R()],Cn=[R()],Dn=[R()],Sn=[Bt("dialog")],Hn){constructor(){super(...arguments);S(this,pt,w(b,8,this)),w(b,11,this);S(this,ut,w(b,12,this)),w(b,15,this);S(this,mt,w(b,16,this,"month")),w(b,19,this);S(this,ft,w(b,20,this,L.weeks)),w(b,23,this);S(this,gt,w(b,24,this)),w(b,27,this);S(this,yt,w(b,28,this,new Set)),w(b,31,this);S(this,_t,w(b,32,this)),w(b,35,this);S(this,vt,w(b,36,this,{})),w(b,39,this);S(this,bt,w(b,40,this,null)),w(b,43,this);M(this,"_events",new Se(this));M(this,"_weather",new Pe(this));M(this,"_today",0);M(this,"_clock");M(this,"_registryKey","");M(this,"_formatter")}static getConfigElement(){return document.createElement(De)}static getStubConfig(e){let n=Object.keys(e.states),i=n.filter(s=>s.startsWith("calendar.")).slice(0,3),o=n.find(s=>s.startsWith("weather."));return{entities:i.map(s=>({entity:s})),...o?{weather_entity:o}:{}}}setConfig(e){if(!e||typeof e!="object")throw new Error("Invalid configuration");if(e.entities!==void 0&&!Array.isArray(e.entities))throw new Error("`entities` must be a list of calendar entities");for(let o of G(e.entities))if(!o.entity.startsWith("calendar."))throw new Error(`${o.entity} is not a calendar entity`);if(e.view&&!["month","weeks"].includes(e.view))throw new Error("`view` must be `month` or `weeks`");let n=this._config,i={...L,...e};i.weeks=kn(i.weeks),i.past_weeks=Math.max(0,Math.round(Number(i.past_weeks))||0),i.max_events_per_day=Math.max(1,Math.round(Number(i.max_events_per_day))||1),this._config=i,(!n||n.view!==i.view)&&(this._view=i.view),(!n||n.weeks!==i.weeks)&&(this._weeks=i.weeks),n&&(n.view!==i.view||n.past_weeks!==i.past_weeks||n.first_day_of_week!==i.first_day_of_week)&&(this._anchor=void 0)}getCardSize(){return 2+(this._view==="month"?5:this._weeks)*2}getGridOptions(){return{columns:12,rows:"auto",min_columns:6}}connectedCallback(){super.connectedCallback(),this._clock=setInterval(()=>{this.hass&&this._computeToday()!==this._today&&this.requestUpdate()},6e4)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._clock)}shouldUpdate(e){if(e.size!==1||!e.has("hass"))return!0;let n=e.get("hass"),i=this.hass;return!n||!i||!this._config||n.locale!==i.locale||n.config!==i.config||n.language!==i.language?!0:this._watchedEntities().some(o=>n.states[o]!==i.states[o])}willUpdate(e){super.willUpdate(e);let n=this.hass,i=this._config;if(!n||!i)return;let o=this._timeZone(n),s=e.has("hass")&&e.get("hass")?.locale!==n.locale;(!this._formatter||this._formatter.timeZone!==o||s)&&(this._formatter=new Ce(n.locale??{language:n.language},o)),this._today=this._computeToday();let{start:c,weeks:l}=this._range(),h=c+l*7-1,a=G(i.entities).map(u=>u.entity);this._events.update(n,a,T(c,o),T(h+1,o),o);let d=!!(i.weather_entity||i.temperature_entity||i.open_meteo);this._weather.update(n,{weatherEntity:i.weather_entity,temperatureEntity:i.temperature_entity,firstDay:c,lastDay:h,today:this._today,timeZone:o,serverTimeZone:n.config.time_zone||o,showForecast:d&&i.show_forecast,showHistory:d&&i.show_history,openMeteo:i.open_meteo,showNormals:i.open_meteo&&i.show_normals}),this._loadRegistryColors(n,a)}updated(e){if(super.updated(e),!e.has("_dialog"))return;let n=this._dialogEl;n&&(this._dialog&&!n.open&&n.showModal(),!this._dialog&&n.open&&n.close())}_timeZone(e){return e.locale?.time_zone==="server"&&e.config.time_zone?e.config.time_zone:Gt()}_computeToday(){return this.hass?P(Date.now(),this._timeZone(this.hass)):0}_watchedEntities(){let e=this._config;return e?[...G(e.entities).map(n=>n.entity),e.weather_entity,e.temperature_entity].filter(n=>!!n):[]}get _firstWeekday(){return this._config?.first_day_of_week==="monday"?1:0}_range(){let e=this._today;if(this._view==="month"){let{year:i,month:o}=E(this._anchor??e);return{...Xt(i,o,this._firstWeekday),month:{year:i,month:o}}}return{start:this._anchor!==void 0?F(this._anchor,this._firstWeekday):F(e,this._firstWeekday)-(this._config?.past_weeks??0)*7,weeks:this._weeks}}_maxLanes(){let e=this._config?.max_events_per_day??L.max_events_per_day;return this._view==="weeks"&&this._weeks<=2?e*2:e}_calendars(){let e=this._config;return e?G(e.entities).map((n,i)=>{let o=n.color||this._registryColors[n.entity];return{entity:n.entity,name:n.name||this.hass?.states[n.entity]?.attributes.friendly_name||n.entity,color:o?an(o):cn(i)}}):[]}_loadRegistryColors(e,n){let i=n.join(",");i===this._registryKey||!n.length||(this._registryKey=i,e.callWS({type:"config/entity_registry/get_entries",entity_ids:n}).then(o=>{let s={};for(let[c,l]of Object.entries(o??{})){let h=l?.options?.calendar?.color;h&&(s[c]=h)}this._registryColors=s}).catch(()=>{}))}_t(e,n){return un(this.hass,e,n)}_navigate(e){if(this._view==="month"){let{year:n,month:i}=E(this._anchor??this._today),o=et(n,i,e);this._setAnchor(ie(o.year,o.month))}else this._setAnchor(this._range().start+e*this._weeks*7)}_setAnchor(e){let n=this._today;if(this._view==="month"){let i=E(e),o=E(n);this._anchor=i.year===o.year&&i.month===o.month?void 0:e}else{let i=F(n,this._firstWeekday)-(this._config?.past_weeks??0)*7;this._anchor=F(e,this._firstWeekday)===i?void 0:e}}_goToday(){this._anchor=void 0}_setView(e){if(e===this._view)return;let n=this._anchor;if(this._view=e,n!==void 0){let{year:i,month:o}=E(n);this._setAnchor(e==="weeks"?ie(i,o):F(n,this._firstWeekday)+3)}}_setWeeks(e){this._weeks=kn(e)}_toggleCalendar(e){let n=new Set(this._hidden);n.has(e)?n.delete(e):n.add(e),this._hidden=n}_openDay(e){this._dialog={kind:"day",day:e}}_openEvent(e,n){this._dialog={kind:"event",event:e,fromDay:n}}_closeDialog(){this._dialog=void 0}render(){let e=this._config,n=this.hass;if(!e||!n||!this._formatter)return f;let i=this._range(),o=this._calendars(),s=new Map(o.map(d=>[d.entity,d.color])),c=this._events.allEvents(this._hidden),l=[...this._events.errors],h=this._view==="weeks",a=h?this._weeks<=2?150:this._weeks<=4?118:96:96;return _`
      <ha-card>
        ${this._events.loaded?f:_`<div class="loading" role="progressbar"></div>`}
        <div class="card ${e.dim_past?"dim":""}">
          ${this._renderHeader(e,i,o)}
          ${l.length?_`<div class="notice">${this._t("error",{entities:l.join(", ")})}</div>`:f}
          ${o.length===0&&!e.weather_entity&&!e.open_meteo?_`<div class="notice">${this._t("no_entities")}</div>`:f}
          ${this._renderWeekdays(i.start)}
          <div class="weeks" style="--jtd-week-min-height: ${a}px">
            ${Array.from({length:i.weeks},(d,u)=>this._renderWeek(i.start+u*7,i.start,i.month,c,s))}
          </div>
          ${h&&e.show_controls?this._renderExpander():f}
        </div>
        <dialog
          @close=${this._closeDialog}
          @click=${d=>{d.target===d.currentTarget&&this._closeDialog()}}
        >
          ${this._dialog?this._renderDialog(this._dialog,c,o):f}
        </dialog>
      </ha-card>
    `}_renderHeader(e,n,i){let o=this._formatter,s=n.month?o.monthYear(ie(n.month.year,n.month.month)):o.dayRange(n.start,n.start+n.weeks*7-1),c=e.show_legend&&i.length>1;return _`
      <div class="header">
        ${e.title?_`<div class="title">${e.title}</div>`:f}
        <div class="toolbar">
          <div class="nav">
            ${e.show_controls?_`
                  <button
                    class="icon-button"
                    aria-label=${this._t("previous")}
                    title=${this._t("previous")}
                    @click=${()=>this._navigate(-1)}
                  >
                    <ha-icon icon="mdi:chevron-left"></ha-icon>
                  </button>
                  <button
                    class="icon-button"
                    aria-label=${this._t("next")}
                    title=${this._t("next")}
                    @click=${()=>this._navigate(1)}
                  >
                    <ha-icon icon="mdi:chevron-right"></ha-icon>
                  </button>
                `:f}
            <h2 class="range">${s}</h2>
          </div>
          ${e.show_controls?_`
                <div class="actions">
                  <button
                    class="pill"
                    @click=${this._goToday}
                    title=${this._t("today")}
                  >
                    <ha-icon icon="mdi:calendar-today"></ha-icon>
                    <span class="label">${this._t("today")}</span>
                  </button>
                  <div class="segmented" role="group">
                    <button
                      aria-pressed=${String(this._view==="weeks")}
                      title=${this._t("week_view")}
                      @click=${()=>this._setView("weeks")}
                    >
                      <ha-icon icon="mdi:calendar-week"></ha-icon>
                      <span>${this._t("week_view")}</span>
                    </button>
                    <button
                      aria-pressed=${String(this._view==="month")}
                      title=${this._t("month_view")}
                      @click=${()=>this._setView("month")}
                    >
                      <ha-icon icon="mdi:calendar-month"></ha-icon>
                      <span>${this._t("month_view")}</span>
                    </button>
                  </div>
                </div>
              `:f}
        </div>
        ${c?_`
              <div class="legend">
                ${i.map(l=>_`
                    <button
                      class="chip"
                      style="--event-color: ${l.color}"
                      aria-pressed=${String(!this._hidden.has(l.entity))}
                      @click=${()=>this._toggleCalendar(l.entity)}
                    >
                      <span class="dot"></span><span>${l.name}</span>
                    </button>
                  `)}
              </div>
            `:f}
      </div>
    `}_renderWeekdays(e){let n=this._formatter;return _`
      <div class="weekdays" aria-hidden="true">
        ${Array.from({length:7},(i,o)=>_`
            <div>
              <span class="wide">${n.weekday(e+o,"short")}</span
              ><span class="narrow">${n.weekday(e+o,"narrow")}</span>
            </div>
          `)}
      </div>
    `}_renderWeek(e,n,i,o,s){let c=this._config,l=this._formatter,h=this._today,a=nn(o,e,this._maxLanes()),d=["auto",...a.lanes?[`repeat(${a.lanes}, var(--jtd-event-height))`]:[],"minmax(4px, 1fr)"].join(" "),u=Array.from({length:7},(p,m)=>{let v=e+m,x=E(v),g=i!==void 0&&x.month!==i.month;return{day:v,col:m,ymd:x,otherMonth:g}});return _`
      <div class="week" style="grid-template-rows: ${d}">
        ${u.map(({day:p,col:m,otherMonth:v})=>_`
            <button
              class=${ke({day:!0,today:p===h,"other-month":v,"last-col":m===6})}
              style="grid-column: ${m+1}"
              aria-label=${l.dayLong(p)}
              @click=${()=>this._openDay(p)}
            ></button>
          `)}
        ${u.map(({day:p,col:m,ymd:v,otherMonth:x})=>_`
            <div
              class=${ke({"day-head":!0,"today-head":p===h,"other-month-head":x,"past-head":c.dim_past&&p<h})}
              style="grid-column: ${m+1}"
            >
              <span class="date"
                >${v.day===1||p===n&&this._view==="weeks"?`${l.monthShort(p)} ${v.day}`:v.day}</span
              >
              ${this._renderCellWeather(p)}
            </div>
          `)}
        ${a.segments.map(p=>this._renderSegment(p,s,h))}
        ${a.more.map((p,m)=>p?_`
                <button
                  class="more"
                  style="grid-column: ${m+1}; grid-row: ${a.lanes+1}"
                  @click=${()=>this._openDay(e+m)}
                >
                  ${this._t("more",{count:p})}
                </button>
              `:f)}
      </div>
    `}_renderSegment(e,n,i){let{event:o}=e,s=this._config,c=this._formatter,l=o.allDay||o.endDay>o.startDay,h=o.allDay?void 0:c.compactTime(o.start),a=[o.summary,c.eventRange(o,this._t("all_day")),o.location].filter(Boolean).join(`
`);return _`
      <button
        class=${ke({event:!0,spanning:l,timed:!l,tentative:o.tentative,past:o.endDay<i||!o.allDay&&o.end<Date.now(),"cont-before":e.continuesBefore,"cont-after":e.continuesAfter})}
        style="grid-column: ${e.col+1} / span ${e.span}; grid-row: ${e.lane+2}; --event-color: ${n.get(o.calendar)??"var(--primary-color)"}"
        title=${a}
        @click=${d=>{d.stopPropagation(),this._openEvent(o)}}
      >
        ${l?_`<span class="label"
              >${h&&!e.continuesBefore&&s.show_event_time?`${h} `:""}${o.summary}</span
            >`:_`
              <span class="dot"></span>
              ${s.show_event_time&&h?_`<span class="time">${h}</span>`:f}
              <span class="label">${o.summary}</span>
            `}
      </button>
    `}_weatherTooltip(e){return[e.condition?st(this.hass,e.condition,this._config?.weather_entity):"",e.high!==void 0?`${this._t("high")} ${X(e.high)}`:"",e.low!==void 0?`${this._t("low")} ${X(e.low)}`:"",e.precipitationProbability!==void 0?`${this._t("chance")} ${e.precipitationProbability}%`:"",this._t(ht[e.source])].filter(Boolean).join(`
`)}_renderCellWeather(e){let n=this._weather.dayWeather(e);if(!n)return f;let i=n.condition?En[n.condition]:void 0,o=n.precipitationProbability;return _`
      <span class="wx ${n.source}" title=${this._weatherTooltip(n)}>
        ${i?_`<ha-icon
              class="wx-icon tone-${An[n.condition]??"cloud"}"
              .icon=${i}
            ></ha-icon>`:f}
        ${n.high!==void 0||n.low!==void 0?_`<span class="temps"
              ><span class="hi">${X(n.high)}</span
              ><span class="lo">${X(n.low)}</span></span
            >`:f}
        ${this._config.show_precipitation&&o!==void 0&&o>=20&&n.source==="forecast"?_`<span class="pop"><ha-icon icon="mdi:water"></ha-icon>${o}%</span>`:f}
      </span>
    `}_renderExpander(){let e=this._weeks;return _`
      <div class="expander">
        <button
          class="pill"
          ?disabled=${e<=tt}
          title=${this._t("collapse")}
          @click=${()=>this._setWeeks(e-1)}
        >
          <ha-icon icon="mdi:chevron-up"></ha-icon>
        </button>
        <span>${e===1?this._t("one_week"):this._t("weeks_label",{count:e})}</span>
        <button
          class="pill"
          ?disabled=${e>=nt}
          title=${this._t("expand")}
          @click=${()=>this._setWeeks(e+1)}
        >
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
      </div>
    `}_renderDialog(e,n,i){return e.kind==="day"?this._renderDayDialog(e.day,n,i):this._renderEventDialog(e.event,i,e.fromDay)}_renderDayDialog(e,n,i){let o=this._formatter,s=tn(n,e),c=new Map(i.map(a=>[a.entity,a])),l=this._weather.dayWeather(e),h=E(e);return _`
      <div class="dlg" tabindex="-1" autofocus>
        <div class="dlg-head">
          <div class="grow">
            <div class="dlg-sub">${o.weekday(e,"long")}</div>
            <h3>${o.monthShort(e)} ${h.day}, ${h.year}</h3>
          </div>
          <button class="icon-button" aria-label=${this._t("close")} @click=${this._closeDialog}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        ${l?this._renderWeatherCard(l):f}
        <div class="dlg-events">
          ${s.length?s.map(a=>{let d=c.get(a.calendar);return _`
                  <button
                    class="dlg-event"
                    style="--event-color: ${d?.color??"var(--primary-color)"}"
                    @click=${()=>this._openEvent(a,e)}
                  >
                    <span class="bar"></span>
                    <div class="grow">
                      <div class="summary">${a.summary}</div>
                      <div class="meta">
                        ${o.eventRange(a,this._t("all_day"))}${d?` \xB7 ${d.name}`:""}
                      </div>
                      ${a.location?_`<div class="meta">${a.location}</div>`:f}
                    </div>
                    <ha-icon icon="mdi:chevron-right"></ha-icon>
                  </button>
                `}):_`<div class="dlg-empty">${this._t("no_events")}</div>`}
        </div>
      </div>
    `}_renderWeatherCard(e){let n=e.condition?En[e.condition]:"mdi:thermometer",i=e.condition?An[e.condition]??"cloud":"cloud",o=e.precipitation!==void 0&&e.precipitation>0?`${Math.round(e.precipitation*100)/100} ${e.precipitationUnit??""}`.trim():void 0,s=e.precipitationProbability!==void 0?`${e.precipitationProbability}%`:void 0;return _`
      <div class="wx-card">
        <ha-icon class="tone-${i}" .icon=${n}></ha-icon>
        <div class="grow">
          <div class="cond">
            ${e.condition?st(this.hass,e.condition,this._config?.weather_entity):this._t(ht[e.source])}
          </div>
          ${s||o?_`<div class="meta">
                ${this._t("precipitation")}: ${[s,o].filter(Boolean).join(" \xB7 ")}
              </div>`:f}
          <div class="src">${this._t(ht[e.source])} · ${e.provider}</div>
        </div>
        <div class="temps-big">
          <span class="hi">${X(e.high)}</span>
          <span class="lo">${X(e.low)}</span>
        </div>
      </div>
    `}_renderEventDialog(e,n,i){let o=this._formatter,s=n.find(h=>h.entity===e.calendar),c=E(e.startDay),l=e.allDay?e.startDay===e.endDay?`${o.weekday(e.startDay,"long")}, ${o.monthShort(e.startDay)} ${c.day} \xB7 ${this._t("all_day")}`:`${o.eventRange(e,this._t("all_day"))} \xB7 ${this._t("all_day")}`:e.startDay===e.endDay?`${o.weekday(e.startDay,"long")}, ${o.monthShort(e.startDay)} ${c.day} \xB7 ${o.eventRange(e,"")}`:o.eventRange(e,"");return _`
      <div class="dlg" tabindex="-1" autofocus>
        <div class="dlg-head">
          ${i!==void 0?_`<button
                class="icon-button back"
                aria-label=${this._t("back")}
                @click=${()=>this._openDay(i)}
              >
                <ha-icon icon="mdi:arrow-left"></ha-icon>
              </button>`:f}
          <div class="grow"><h3>${e.summary}</h3></div>
          <button class="icon-button" aria-label=${this._t("close")} @click=${this._closeDialog}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        ${e.tentative?_`<span class="badge">${this._t("tentative")}</span>`:f}
        <div class="detail-rows">
          <div class="detail">
            <ha-icon icon="mdi:clock-outline"></ha-icon>
            <div class="text">${l}</div>
          </div>
          ${s?_`<div class="detail" style="--event-color: ${s.color}">
                <span class="dot"></span>
                <div class="text">${s.name}</div>
              </div>`:f}
          ${e.location?_`<div class="detail">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <div class="text">${e.location}</div>
              </div>`:f}
          ${e.description?_`<div class="detail">
                <ha-icon icon="mdi:text"></ha-icon>
                <div class="text">${e.description}</div>
              </div>`:f}
        </div>
      </div>
    `}};b=ve(Hn),pt=new WeakMap,ut=new WeakMap,mt=new WeakMap,ft=new WeakMap,gt=new WeakMap,yt=new WeakMap,_t=new WeakMap,vt=new WeakMap,bt=new WeakMap,k(b,4,"hass",jn,D,pt),k(b,4,"_config",Pn,D,ut),k(b,4,"_view",On,D,mt),k(b,4,"_weeks",Rn,D,ft),k(b,4,"_anchor",Tn,D,gt),k(b,4,"_hidden",Mn,D,yt),k(b,4,"_dialog",Cn,D,_t),k(b,4,"_registryColors",Dn,D,vt),k(b,4,"_dialogEl",Sn,D,bt),se(b,D),M(D,"styles",mn);customElements.get(ge)||customElements.define(ge,D);customElements.get(De)||customElements.define(De,z);window.customCards=window.customCards||[];window.customCards.some(r=>r.type===ge)||window.customCards.push({type:ge,name:rn,description:"Month and expandable week view of your calendars with forecast and historical weather on every day.",preview:!0,documentationURL:"https://github.com/jtddigital/JTDHASS"});console.info(`%c JTD-CALENDAR-CARD %c ${on} `,"color: white; background: #4269d0; font-weight: 700;","color: #4269d0; background: white; font-weight: 700;");export{D as JtdCalendarCard};
