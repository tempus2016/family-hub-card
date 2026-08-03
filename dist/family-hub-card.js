/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(s,t,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:h,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:c,getPrototypeOf:p}=Object,u=globalThis,f=u.trustedTypes,m=f?f.emptyScript:"",g=u.reactiveElementPolyfillSupport,v=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...c(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??y)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,g?.({ReactiveElement:w}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,x=t=>t,A=$.trustedTypes,k=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+C,T=`<${S}>`,D=document,P=()=>D.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,N="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,O=/>/g,H=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,B=/"/g,F=/^(?:script|style|textarea|title)$/i,j=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),L=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,V=D.createTreeWalker(D,129);function Z(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=M;for(let e=0;e<i;e++){const i=t[e];let a,h,l=-1,d=0;for(;d<i.length&&(r.lastIndex=d,h=r.exec(i),null!==h);)d=r.lastIndex,r===M?"!--"===h[1]?r=I:void 0!==h[1]?r=O:void 0!==h[2]?(F.test(h[2])&&(o=RegExp("</"+h[2],"g")),r=H):void 0!==h[3]&&(r=H):r===H?">"===h[0]?(r=o??M,l=-1):void 0===h[1]?l=-2:(l=r.lastIndex-h[2].length,a=h[1],r=void 0===h[3]?H:'"'===h[3]?B:R):r===B||r===R?r=H:r===I||r===O?r=M:(r=H,o=void 0);const c=r===H&&t[e+1].startsWith("/>")?" ":"";n+=r===M?i+T:l>=0?(s.push(a),i.slice(0,l)+E+i.slice(l)+C+c):i+C+(-2===l?e:c)}return[Z(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[h,l]=J(t,e);if(this.el=K.createElement(h,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=V.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=l[n++],i=s.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?it:X}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(F.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),V.nextNode(),a.push({type:2,index:++o});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===S)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const i=D.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===L)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=U(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Y(t,o._$AS(t,e.values),o,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??D).importNode(e,!0);V.currentNode=s;let o=V.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new st(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=V.nextNode(),n++)}return V.currentNode=D,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),U(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new G(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new K(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Q(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=Y(this,t,e,0),n=!U(t)||t!==this._$AH&&t!==L,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Y(this,s[i+r],e,r),a===L&&(a=this._$AH[r]),n||=!U(a)||a!==this._$AH[r],a===W?t=W:t!==W&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class it extends X{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??W)===L)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const ot=$.litHtmlPolyfillSupport;ot?.(K,Q),($.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class rt extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new Q(e.insertBefore(P(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}}rt._$litElement$=!0,rt.finalized=!0,nt.litElementHydrateSupport?.({LitElement:rt});const at=nt.litElementPolyfillSupport;at?.({LitElement:rt}),(nt.litElementVersions??=[]).push("4.2.2");const ht=n`
  :host {
    --fh-bg: var(--fh-card-bg, #12151c);
    --fh-surface: var(--fh-surface-bg, #181c26);
    --fh-chip: var(--fh-chip-bg, #232838);
    --fh-rule: var(--fh-rule-color, #232838);
    --fh-rule-soft: var(--fh-rule-soft-color, #1f2431);

    --fh-text: var(--fh-text-color, #e8eaf0);
    --fh-text-strong: var(--fh-text-strong-color, #ffffff);
    --fh-text-mute: var(--fh-text-mute-color, #9aa3b8);
    --fh-text-soft: var(--fh-text-soft-color, #8b94ab);
    --fh-text-dim: var(--fh-text-dim-color, #5d6579);
    --fh-text-faint: var(--fh-text-faint-color, #6d768c);
    --fh-chore-text: var(--fh-chore-text-color, #c3c9d8);
    --fh-now: var(--fh-now-color, #4A9EFF);
    --fh-cell: var(--fh-cell-bg, #171b24);
    --fh-cell-today: var(--fh-cell-today-bg, #1b2130);
    --fh-cell-today-edge: var(--fh-cell-today-edge-color, #2b3550);

    --fh-font: var(--fh-font-family, 'IBM Plex Sans', 'Segoe UI', system-ui, -apple-system, sans-serif);
    --fh-mono: var(--fh-font-mono, 'IBM Plex Mono', 'SF Mono', ui-monospace, monospace);

    --fh-radius: 16px;
    --fh-radius-inner: 12px;
    --fh-touch: 44px;
  }

  :host([data-scheme='light']) {
    --fh-bg: var(--fh-card-bg, #ffffff);
    --fh-surface: var(--fh-surface-bg, #f4f6f9);
    --fh-chip: var(--fh-chip-bg, #e3e7ee);
    --fh-rule: var(--fh-rule-color, #e3e7ee);
    --fh-rule-soft: var(--fh-rule-soft-color, #edf0f5);

    --fh-text: var(--fh-text-color, #1b1f28);
    --fh-text-strong: var(--fh-text-strong-color, #000000);
    --fh-text-mute: var(--fh-text-mute-color, #5b6478);
    --fh-text-soft: var(--fh-text-soft-color, #6b7488);
    --fh-text-dim: var(--fh-text-dim-color, #8a92a4);
    --fh-text-faint: var(--fh-text-faint-color, #949cad);
    --fh-chore-text: var(--fh-chore-text-color, #2b3140);
    --fh-cell: var(--fh-cell-bg, #f4f6f9);
    --fh-cell-today: var(--fh-cell-today-bg, #e8effb);
    --fh-cell-today-edge: var(--fh-cell-today-edge-color, #b9cdf0);
  }
`,lt=n`
  :host {
    display: block;
    font-family: var(--fh-font);
    color: var(--fh-text);
  }

  .sec-l {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.4px;
    color: var(--fh-text-dim);
    margin: 0 0 10px 2px;
    font-weight: 600;
  }

  /* A 44px hit area wrapped around a small visual mark: the mockup's density
     without sub-thumb tap targets on a wall tablet. */
  .tap {
    min-width: var(--fh-touch);
    min-height: var(--fh-touch);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: inherit;
    flex-shrink: 0;
  }

  .tap:focus-visible {
    outline: 2px solid var(--fh-text-strong);
    outline-offset: -6px;
    border-radius: 10px;
  }

  .stale {
    font-size: 12px;
    color: var(--warning-color, #FFB84A);
    margin-top: 4px;
  }

  .notice {
    font-size: 13px;
    color: var(--error-color, #d64545);
    padding: 6px 0 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`,dt=["#4A9EFF","#FF4A87","#FFB84A","#4ADE80","#A78BFA","#22D3EE","#F97316","#E879F9"],ct=["agenda","columns","week"],pt=["auto","dark","light"];function ut(t){const e=t||{};if(!Array.isArray(e.people)||0===e.people.length)throw new Error("family-hub-card: `people` is required and must list at least one person");const i=e.view||"agenda";if(!ct.includes(i))throw new Error(`family-hub-card: unknown \`view\` "${i}" — expected one of ${ct.join(", ")}`);const s=e.theme||"auto";if(!pt.includes(s))throw new Error(`family-hub-card: unknown \`theme\` "${s}" — expected one of ${pt.join(", ")}`);const o=new Set,n=e.people.map((t,e)=>{if(!t||!t.name)throw new Error("family-hub-card: every person needs a `name`");const i=null==t.calendars?[]:[].concat(t.calendars);if(0===i.length&&!t.todo)throw new Error(`family-hub-card: "${t.name}" needs \`calendars\` or \`todo\``);const s=(n=t.name,String(n).trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));var n;if(o.has(s))throw new Error(`family-hub-card: duplicate person name "${t.name}"`);return o.add(s),{id:s,name:t.name,color:t.color||dt[e%dt.length],initials:t.initials||String(t.name).trim()[0].toUpperCase(),calendars:i,todo:t.todo||null,points:t.points||null}});return{view:i,theme:s,refreshInterval:Math.max(60,Number(e.refresh_interval??300)),choreFilter:"all"===e.chore_filter?"all":"today",confirmWindow:0===e.confirm_window?0:Number(e.confirm_window??3),taskmateChores:e.taskmate_chores||null,header:{clock:!1!==e.header?.clock,weather:e.header?.weather||null,subtitle:e.header?.subtitle||null},people:n}}function ft(t,e){const i=new Intl.DateTimeFormat("en-US",{timeZone:e,hour12:!1,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}),s=Object.fromEntries(i.formatToParts(t).filter(t=>"literal"!==t.type).map(t=>[t.type,t.value]));return Date.UTC(Number(s.year),Number(s.month)-1,Number(s.day),Number(s.hour)%24,Number(s.minute),Number(s.second))-(t.getTime()-t.getMilliseconds())}function mt(t,e){const i=ft(t,e),s=new Date(t.getTime()+i);return{year:s.getUTCFullYear(),month:s.getUTCMonth(),day:s.getUTCDate(),hour:s.getUTCHours(),minute:s.getUTCMinutes()}}function gt(t,e){const{year:i,month:s,day:o}=mt(t,e),n=new Date(Date.UTC(i,s,o)-ft(t,e));return new Date(Date.UTC(i,s,o)-ft(n,e))}function vt(t,e,i=1){const s=gt(t,e);let o=s;for(let t=0;t<i;t+=1)o=gt(new Date(o.getTime()+1296e5),e);return{start:s,end:o}}function _t(t,e,i){const s=mt(t,i),o=mt(e,i);return s.year===o.year&&s.month===o.month&&s.day===o.day}const yt=new Map;function bt(t,e,i){const s=yt.get(t),o=i?.message||String(i||"");return s!==o&&(yt.set(t,o),console.warn(`family-hub-card: ${e}${o?` — ${o}`:""}`),!0)}function wt(t,e){return!!yt.has(t)&&(yt.delete(t),console.info(`family-hub-card: ${e}`),!0)}function $t(t,e){const[i,s,o]=t.split("-").map(Number),{start:n}=vt(new Date(Date.UTC(i,s-1,o,12)),e);return n}async function xt(t,e,i,s,o=1){const{start:n,end:r}=vt(i,s,o),a=`start=${encodeURIComponent(n.toISOString())}&end=${encodeURIComponent(r.toISOString())}`,h=[];for(const t of e)for(const e of t.calendars||[])h.push({person:t,entity:e});const l=[],d={},c=await Promise.all(h.map(async({person:e,entity:i})=>{try{const o=await t.callApi("GET",`calendars/${i}?${a}`);return wt(`calendar:${i}`,`${i} is readable again`),(o||[]).map(t=>function(t,e,i){const s=Boolean(t.start?.date&&!t.start?.dateTime),o=s?$t(t.start.date,i):new Date(t.start.dateTime),n=s?$t(t.end?.date||t.start.date,i):new Date(t.end?.dateTime||t.start.dateTime),r=t.summary||"";return{id:`${e}:${r}:${o.toISOString()}`,personId:e,summary:r,start:o,end:n,allDay:s,location:t.location||""}}(t,e.id,s))}catch(t){return bt(`calendar:${i}`,`could not read ${i}`,t),l.push(i),(d[e.id]||=[]).push(i),[]}})),p=c.flat().filter(t=>t.start<r&&(t.end>n||t.start>=n)).sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start-e.start);return{events:p,failures:l,failuresByPerson:d}}function At(t){if(!t)return null;if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const[e,i,s]=t.split("-").map(Number);return new Date(Date.UTC(e,i-1,s,12))}return new Date(t)}async function kt(t,e,i,s,o){const n={},r=[],a={};return await Promise.all(e.filter(t=>t.todo).map(async e=>{try{const r=await t.callWS({type:"todo/item/list",entity_id:e.todo});wt(`todo:${e.todo}`,`${e.todo} is readable again`),n[e.id]=function(t,e,i,s){return(t||[]).map(t=>({id:t.uid,summary:t.summary||"",status:"completed"===t.status?"completed":"needs_action",due:At(t.due)})).filter(t=>"all"===e||"completed"===t.status||!t.due||t.due<=i||_t(t.due,i,s))}(r?.items,i,s,o).map(t=>({...t,personId:e.id}))}catch(t){bt(`todo:${e.todo}`,`could not list ${e.todo}`,t),r.push(e.todo),(a[e.id]||=[]).push(e.todo),n[e.id]=[]}})),{choresByPerson:n,failures:r,failuresByPerson:a}}const Et=new Set(["unavailable","unknown",""]);function Ct(t,e){return e.taskmateChildId?t.filter(t=>t.childId===e.taskmateChildId):[]}class St{constructor({config:t,getHass:e,getNow:i,onChange:s,schedule:o}){this.config=t,this.getHass=e,this.getNow=i||(()=>new Date),this.onChange=s||(()=>{}),this.schedule=o,this._cancels=[],this._events=[],this._chores={},this._failuresByPerson={},this._inflight=null,this._windowDays=null,this.model={people:[],staleSince:null,failures:[]}}get _tz(){return this.getHass()?.config?.time_zone||"UTC"}get windowDays(){return this._windowDays??("week"===this.config.view?7:1)}set windowDays(t){this._windowDays!==t&&(this._windowDays=t,this.refresh())}watchedEntities(){const t=[];for(const e of this.config.people)t.push(...e.calendars||[]),e.todo&&t.push(e.todo),e.points&&t.push(e.points);return this.config.taskmateChores&&t.push(this.config.taskmateChores),t}hassChanged(t){const e=this.getHass();if(!e)return;let i=!1,s=!1;for(const o of this.watchedEntities())t?.states?.[o]!==e.states?.[o]&&(o.startsWith("calendar.")||o.startsWith("todo.")?i=!0:s=!0);i?this.refresh():s&&(this._rebuild(e),this.onChange())}async refresh(){return this._inflight||(this._inflight=this._doRefresh().finally(()=>{this._inflight=null})),this._inflight}async _doRefresh(){const t=this.getHass(),e=this.getNow(),{people:i,choreFilter:s}=this.config,[o,n]=await Promise.all([xt(t,i,e,this._tz,this.windowDays),kt(t,i,s,e,this._tz)]),r=this._events,a=this._chores,h=new Set(Object.keys(o.failuresByPerson||{}));this._events=[...o.events.filter(t=>!h.has(t.personId)),...r.filter(t=>h.has(t.personId))].sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start-e.start);const l=new Set(Object.keys(n.failuresByPerson||{}));this._chores={};for(const t of i)this._chores[t.id]=l.has(t.id)?a[t.id]||[]:n.choresByPerson[t.id]||[];this._failuresByPerson={};for(const[t,e]of Object.entries(o.failuresByPerson||{}))(this._failuresByPerson[t]||=[]).push(...e);for(const[t,e]of Object.entries(n.failuresByPerson||{}))(this._failuresByPerson[t]||=[]).push(...e);const d=[...o.failures,...n.failures];this.model.staleSince=d.length?this.model.staleSince||e:null,this.model.failures=d,this._rebuild(t),this.onChange()}_rebuild(t){const e=function(t,e){if(!e)return[];const i=t?.states?.[e],s=i?.attributes?.todays_completions;return Array.isArray(s)?s.filter(t=>"__parent__"!==t.child_id).map(t=>({choreId:t.chore_id,childId:t.child_id,name:t.chore_name||"",approved:Boolean(t.approved),completedAt:new Date(t.completed_at)})):[]}(t,this.config.taskmateChores);this.model.people=this.config.people.map(i=>{const s=function(t,e){if(!e.points)return null;const i=t?.states?.[e.points];if(!i)return null;const s=i.attributes||{},o=Et.has(i.state)?null:Number(i.state);return{balance:Number.isNaN(o)?null:o,unit:s.unit_of_measurement||"points",earnedToday:s.points_earned_today??null,pendingToday:s.points_pending_today??null,childId:s.child_id??null}}(t,i),o={...i,taskmateChildId:s?.childId||null};return{...o,events:this._events.filter(t=>t.personId===i.id),chores:this._chores[i.id]||[],completedToday:Ct(e,o),points:s,failures:this._failuresByPerson[i.id]||[]}})}start(){this.stop();const t=this.getNow();this._cancels.push(this.schedule(()=>this.refresh(),1e3*this.config.refreshInterval)),this._cancels.push(this.schedule(()=>{this.refresh(),this.start()},function(t,e){return vt(t,e).end.getTime()-t.getTime()}(t,this._tz)))}stop(){this._cancels.forEach(t=>t()),this._cancels=[]}async complete(t,e){const i=this.config.people.find(e=>e.id===t),s=(this._chores[t]||[]).find(t=>t.id===e);if(!i?.todo||!s)return;const o=s.status;s.status="completed",this._rebuild(this.getHass()),this.onChange();try{await async function(t,e,i){await t.callService("todo","update_item",{entity_id:e,item:i,status:"completed"})}(this.getHass(),i.todo,e)}catch(t){bt(`complete:${i.todo}`,`could not complete "${s.summary}" on ${i.todo}`,t),s.status=o,this.model.failures=[...this.model.failures,i.todo],this._rebuild(this.getHass()),this.onChange()}}}class Tt extends rt{static properties={model:{attribute:!1},now:{attribute:!1},confirmWindow:{attribute:!1},_pending:{state:!0}};static styles=[lt,n`
      /* Metrics ported from mockups/c.html — .split2, .ag, .agrow, .pcard. */
      .wrap { display: grid; grid-template-columns: 1.35fr 1fr; gap: 20px; }
      .wrap[data-narrow='true'] { grid-template-columns: 1fr; }

      .ag { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 8px 18px 14px; }
      .agrow { display: flex; gap: 15px; padding: 14px 0; border-bottom: 1px solid var(--fh-rule-soft); align-items: flex-start; }
      .agrow:last-child { border-bottom: none; }
      .agt { font-family: var(--fh-mono); font-size: 16px; color: var(--fh-text-soft); width: 64px; flex-shrink: 0; padding-top: 2px; font-weight: 500; }
      .agbar { width: 4px; border-radius: 2px; background: var(--pc); align-self: stretch; flex-shrink: 0; }
      .agn { font-size: 20px; color: var(--fh-text); font-weight: 500; line-height: 1.25; }
      .agw { font-size: 14px; color: var(--pc); margin-top: 3px; font-weight: 600; }
      .past { opacity: 0.45; }
      .empty { padding: 14px 0; color: var(--fh-text-dim); font-size: 16px; }

      .now { background: var(--fh-now); height: 2px; border-radius: 1px; margin: 3px 0; position: relative; }
      .now::before { content: ''; position: absolute; left: -4px; top: -3px; width: 8px; height: 8px; border-radius: 50%; background: var(--fh-now); }

      .pcard { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 14px 15px; margin-bottom: 11px; border-left: 4px solid var(--pc); }
      .phead { display: flex; align-items: center; gap: 13px; }
      .av { width: 40px; height: 40px; border-radius: 50%; background: var(--pc); color: var(--fh-bg); font-weight: 700; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .nm { font-weight: 600; font-size: 18px; }
      .nextc { font-size: 14px; color: var(--fh-text-mute); margin-top: 2px; }
      .pts { margin-left: auto; text-align: right; padding-left: 10px; }
      .pts b { display: block; font-size: 24px; color: var(--pc); font-family: var(--fh-mono); line-height: 1; }
      .pts span { font-size: 10px; color: var(--fh-text-faint); text-transform: uppercase; letter-spacing: 1px; }
      .pts .today { font-size: 12px; color: var(--fh-text-mute); margin-top: 3px; text-transform: none; letter-spacing: 0; }

      .chores { margin-top: 6px; border-top: 1px solid var(--fh-rule-soft); padding-top: 2px; }
      .chore { display: flex; align-items: center; gap: 10px; font-size: 16px; color: var(--fh-chore-text); }
      .chore .name { flex: 1; min-width: 0; }
      .chore.done .name, .chore.pending .name { text-decoration: line-through; color: var(--fh-text-dim); }
      .chore.pending .name { font-style: italic; }
      .box { width: 19px; height: 19px; border-radius: 5px; background: var(--fh-chip); flex-shrink: 0; position: relative; }
      .box.filled { background: var(--pc); }
      .box.filled::after { content: '\\2713'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--fh-bg); font-weight: 800; }
      .ring { animation: fh-ring var(--fh-window, 3s) linear forwards; }
      @keyframes fh-ring { from { opacity: 1; } to { opacity: 0.35; } }
      .waiting { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--warning-color, #FFB84A); font-weight: 600; flex-shrink: 0; }
    `];constructor(){super(),this._pending=new Map,this._narrow=!1}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width<640;e!==this._narrow&&(this._narrow=e,this.requestUpdate())}),this._ro.observe(this),this._onVisibility=()=>{"hidden"===document.visibilityState&&this.flushPending()},this._onPageHide=()=>this.flushPending(),document.addEventListener("visibilitychange",this._onVisibility),window.addEventListener("pagehide",this._onPageHide)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),document.removeEventListener("visibilitychange",this._onVisibility),window.removeEventListener("pagehide",this._onPageHide),this.flushPending()}flushPending(){for(const t of this._pending.values())clearTimeout(t.timer),this._fire(t.personId,t.choreId);this._pending.clear()}_tap(t,e){const i=`${t}:${e}`,s=this._pending.get(i);if(s)return clearTimeout(s.timer),this._pending.delete(i),void this.requestUpdate();if(!this.confirmWindow)return void this._fire(t,e);const o=setTimeout(()=>{this._pending.delete(i),this._fire(t,e)},1e3*this.confirmWindow);this._pending.set(i,{timer:o,personId:t,choreId:e}),this.requestUpdate()}_fire(t,e){this.dispatchEvent(new CustomEvent("chore-tap",{detail:{personId:t,choreId:e},bubbles:!0,composed:!0})),this.requestUpdate()}_fmt(t){return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit",hour12:!1}).format(t)}render(){if(!this.model)return W;const t=function(t){const e=[];for(const i of t)for(const t of i.events||[])e.push({time:t.allDay?null:t.start,allDay:t.allDay,event:t,person:i});return e.sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.allDay?0:t.time-e.time)}(this.model.people),e=function(t,e){const i=t.findIndex(t=>!t.allDay);if(-1===i)return-1;if(e<t[i].time)return-1;let s=t.length;for(let o=i;o<t.length;o+=1)if(t[o].time>e){s=o;break}return s}(t,this.now),i=[];return t.forEach((t,s)=>{s===e&&i.push(j`<div class="now"></div>`),i.push(j`
        <div class="agrow ${!t.allDay&&t.time<this.now?"past":""}" style="--pc:${t.person.color}">
          <div class="agt">${t.allDay?"All day":this._fmt(t.time)}</div>
          <div class="agbar"></div>
          <div>
            <div class="agn">${t.event.summary}</div>
            <div class="agw">
              ${t.person.name}${t.event.location?j` · ${t.event.location}`:W}
            </div>
          </div>
        </div>
      `)}),e===t.length&&i.push(j`<div class="now"></div>`),j`
      <div class="wrap" data-narrow=${String(this._narrow)}>
        <div>
          <div class="sec-l">Today</div>
          <div class="ag">
            ${i.length?i:j`<div class="empty">Nothing scheduled</div>`}
          </div>
        </div>
        <div>
          <div class="sec-l">Chores &amp; points</div>
          ${this.model.people.map(t=>this._person(t))}
        </div>
      </div>
    `}_person(t){const e=(t.chores||[]).filter(t=>"completed"!==t.status),i=(t.chores||[]).filter(t=>"completed"===t.status),s=t.completedToday||[],o=e.length||i.length||s.length;return j`
      <div class="pcard" style="--pc:${t.color}">
        <div class="phead">
          <div class="av">${t.initials}</div>
          <div>
            <div class="nm">${t.name}</div>
            <div class="nextc">${this._summary(t,e)}</div>
          </div>
          ${this._points(t)}
        </div>
        ${(t.failures||[]).length?j`<div class="notice">Can't read ${t.failures.join(", ")}</div>`:W}
        ${o?j`<div class="chores">
              ${e.map(e=>this._chore(t,e,"open"))}
              ${i.map(e=>this._chore(t,e,"done"))}
              ${s.map(t=>j`
                  <div class="chore ${t.approved?"done":"pending"}">
                    <span class="tap"><span class="box filled"></span></span>
                    <span class="name">${t.name}</span>
                    ${t.approved?W:j`<span class="waiting">waiting</span>`}
                  </div>
                `)}
            </div>`:W}
      </div>
    `}_summary(t,e){return t.todo?e.length?`Next: ${e[0].summary}`:"All done":"No chore list"}_points(t){return t.points&&null!=t.points.balance?j`
      <div class="pts">
        <b>${t.points.balance}</b>
        <span>${t.points.unit}</span>
        ${null==t.points.earnedToday?W:j`<div class="today">
              ${t.points.earnedToday} today${t.points.pendingToday?j` · ${t.points.pendingToday} pending`:W}
            </div>`}
      </div>
    `:W}_chore(t,e,i){const s=`${t.id}:${e.id}`,o=this._pending.has(s);return j`
      <div class="chore ${"done"===i?"done":""}">
        <button
          class="tap"
          role="checkbox"
          aria-checked=${"done"===i||o?"true":"false"}
          aria-label=${`Complete ${e.summary} for ${t.name}`}
          @click=${()=>this._tap(t.id,e.id)}
          ?disabled=${"done"===i}
        >
          <span
            class="box ${o||"done"===i?"filled":""} ${o?"ring":""}"
            style="--fh-window:${this.confirmWindow}s"
          ></span>
        </button>
        <span class="name">${e.summary}</span>
      </div>
    `}}customElements.define("family-hub-agenda",Tt);class Dt extends rt{static properties={model:{attribute:!1},now:{attribute:!1},tz:{attribute:!1}};static styles=[lt,n`
      /* Metrics ported from mockups/b.html — .grid7, .gh, .cell, .chip, .bars. */
      .grid7 { display: grid; grid-template-columns: 92px repeat(7, 1fr); gap: 7px; }
      .grid7[data-narrow='true'] { grid-template-columns: 72px repeat(7, 1fr); gap: 4px; }

      .gh { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--fh-text-faint); text-align: center; padding-bottom: 9px; font-weight: 600; }
      .gh b { display: block; font-size: 24px; color: var(--fh-text); margin-top: 4px; letter-spacing: 0; }
      .gh.today b { color: var(--fh-now); }

      .rowlab { font-size: 16px; color: var(--fh-chore-text); display: flex; align-items: center; gap: 8px; padding-right: 6px; font-weight: 500; min-width: 0; }
      .rowlab span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .dot { width: 11px; height: 11px; border-radius: 50%; background: var(--pc); flex-shrink: 0; }

      .cell { background: var(--fh-cell, #171b24); border-radius: 8px; min-height: 62px; padding: 6px; display: flex; flex-direction: column; gap: 4px; }
      .cell.today { background: var(--fh-cell-today, #1b2130); box-shadow: inset 0 0 0 1px var(--fh-cell-today-edge, #2b3550); }

      .chip { background: var(--pc); color: var(--fh-bg); font-size: 13px; font-weight: 600; padding: 4px 7px; border-radius: 5px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .chip.ghost { background: transparent; color: var(--pc); box-shadow: inset 0 0 0 1.5px var(--pc); }

      /* Four fixed columns like the mockup. auto-fit stretched three people
         across the full width and pulled each label away from its value. */
      .bars { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--fh-rule); }
      .bars[data-narrow='true'] { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
      .bar-l { display: flex; justify-content: space-between; font-size: 15px; margin-bottom: 7px; color: var(--fh-chore-text); gap: 8px; }
      .bar-l b { color: var(--pc); font-family: var(--fh-mono); }
      .track { height: 8px; background: var(--fh-chip); border-radius: 4px; overflow: hidden; }
      .fill { height: 100%; background: var(--pc); border-radius: 4px; }
      .notice { grid-column: 1 / -1; }
    `];constructor(){super(),this._narrow=!1}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width<900;e!==this._narrow&&(this._narrow=e,this.requestUpdate())}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect()}_dow(t){return new Intl.DateTimeFormat(void 0,{weekday:"short"}).format(t)}render(){if(!this.model)return W;const t=this.tz||"UTC",e=function(t,e,i=7){const s=[];for(let o=0;o<i;o+=1){const i=new Date(t.getTime()+24*o*3600*1e3+432e5),n=mt(i,e);s.push({date:i,dayNum:n.day,isToday:0===o})}return s}(this.now,t);return j`
      <div class="grid7" data-narrow=${String(this._narrow)}>
        <div></div>
        ${e.map(t=>j`<div class="gh ${t.isToday?"today":""}">
            ${this._dow(t.date)}<b>${t.dayNum}</b>
          </div>`)}
        ${this.model.people.map(i=>this._personRow(i,e,t))}
      </div>
      <div class="bars" data-narrow=${String(this._narrow)}>
        ${this.model.people.map(t=>this._bar(t))}
      </div>
    `}_personRow(t,e,i){const s=function(t,e,i){return e.map(e=>(t||[]).filter(t=>_t(t.start,e.date,i)))}(t.events,e,i);return j`
      <div class="rowlab" style="--pc:${t.color}">
        <div class="dot"></div><span>${t.name}</span>
      </div>
      ${s.map((i,s)=>j`
          <div class="cell ${e[s].isToday?"today":""}" style="--pc:${t.color}">
            ${i.map(t=>j`<div
                class="chip ${t.allDay?"ghost":""}"
                title=${t.summary}
              >${t.summary}</div>`)}
          </div>
        `)}
    `}_bar(t){const{done:e,total:i,pct:s}=function(t){const e=t.chores||[],i=e.filter(t=>"completed"!==t.status).length,s=e.filter(t=>"completed"===t.status).length+(t.completedToday||[]).length,o=i+s;return{done:s,total:o,pct:o?Math.round(s/o*100):0}}(t);return j`
      <div style="--pc:${t.color}">
        <div class="bar-l"><span>${t.name}</span><b>${e}/${i}</b></div>
        <div class="track"><div class="fill" style="width:${s}%"></div></div>
      </div>
    `}}customElements.define("family-hub-week",Dt);class Pt extends rt{static properties={hass:{attribute:!1},_config:{state:!0}};static styles=n`
    .hint { font-size: 0.8125rem; color: var(--secondary-text-color); margin: 8px 0; }
    .row { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
    button { padding: 6px 10px; border-radius: 8px; border: 1px solid var(--divider-color); background: none; color: inherit; cursor: pointer; }
  `;setConfig(t){this._config=t}_detectedChoresSensor(){return this.hass&&Object.keys(this.hass.states).find(t=>t.startsWith("sensor.")&&Array.isArray(this.hass.states[t].attributes?.todays_completions))||null}_apply(t){this._config={...this._config,...t},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}render(){if(!this._config)return W;const t=this._detectedChoresSensor(),e=t&&this._config.taskmate_chores!==t;return j`
      <div class="hint">
        Family Hub is configured in YAML — the people list is nested and repeating.
        See the README for the full schema.
      </div>
      ${e?j`
            <div class="row">
              <span>TaskMate detected: <code>${t}</code></span>
              <button @click=${()=>this._apply({taskmate_chores:t})}>Use it</button>
            </div>
          `:W}
    `}}customElements.define("family-hub-card-editor",Pt);const Ut=/^[a-z_]+\.[a-z0-9_]+$/,zt=["agenda","week"];function Nt(t,e){if("dark"===e||"light"===e)return e;const i=t?.themes?.darkMode;return"boolean"==typeof i?i?"dark":"light":"undefined"!=typeof window&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}function Mt(t,e){return e?Ut.test(e)&&t?.states?.[e]?t.states[e].state:e:""}class It extends rt{static properties={_tick:{state:!0}};static styles=[ht,lt,n`
      /* Metrics ported from mockups/c.html — .wt and .wt-top. The card paints
         its own surface rather than inheriting ha-card's, so the designed look
         survives whatever theme the dashboard is using. */
      ha-card {
        background: var(--fh-bg);
        border-radius: var(--fh-radius);
        border: none;
        padding: 24px 26px;
        color: var(--fh-text);
        font-family: var(--fh-font);
      }
      .head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--fh-rule);
      }
      .date { font-size: 32px; font-weight: 600; letter-spacing: -0.6px; color: var(--fh-text); }
      .sub { font-size: 15px; color: var(--fh-text-dim); margin-top: 3px; }
      .meta { display: flex; align-items: center; gap: 18px; font-size: 19px; color: var(--fh-text-mute); flex-shrink: 0; }
      .clock { font-size: 44px; font-weight: 300; letter-spacing: -1.5px; color: var(--fh-text-strong); font-variant-numeric: tabular-nums; line-height: 1; }
      .loading { padding: 24px 26px; color: var(--fh-text-dim); font-size: 16px; }
      /* A console warning is invisible on a wall tablet, so say it on the card. */
      .fallback {
        font-size: 13px;
        color: var(--warning-color, #FFB84A);
        margin-top: 6px;
      }
      .fallback code {
        font-family: var(--fh-mono);
        background: var(--fh-chip);
        border-radius: 5px;
        padding: 1px 6px;
      }
    `];setConfig(t){this._config=ut(t),this._applyScheme(),zt.includes(this._config.view)||console.warn(`family-hub-card: view "${this._config.view}" is not implemented yet — rendering agenda.`),this._hub?.stop(),this._hub=null}set hass(t){const e=this._hass;this._hass=t,this._applyScheme(),this._hub&&this._hub.hassChanged(e),!this._hub&&this._config&&(this._hub=new St({config:this._config,getHass:()=>this._hass,getNow:()=>new Date,onChange:()=>this.requestUpdate(),schedule:(t,e)=>{const i=setInterval(t,e);return()=>clearInterval(i)}}),this._hub.start(),this._hub.refresh()),this.requestUpdate()}get hass(){return this._hass}_applyScheme(){const t=Nt(this._hass,this._config?.theme);this.dataset.scheme!==t&&(this.dataset.scheme=t,this.requestUpdate())}connectedCallback(){super.connectedCallback(),this._applyScheme(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width<900;e!==this._narrow&&(this._narrow=e,this._hub&&(this._hub.windowDays="week"===this._effectiveView?7:1),this.requestUpdate())}),this._ro.observe(this),this._scheduleTick(),this._onOnline=()=>this._hub?.refresh(),window.addEventListener("online",this._onOnline)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),clearTimeout(this._tickTimer),window.removeEventListener("online",this._onOnline),this._hub?.stop()}_scheduleTick(){this._tickTimer=setTimeout(()=>{this._tick=Date.now(),this._scheduleTick()},function(t){const e=t.getTime()%6e4;return 0===e?6e4:6e4-e}(new Date))}getCardSize(){return 12}static getConfigElement(){return document.createElement("family-hub-card-editor")}static getStubConfig(){return{view:"agenda",people:[{name:"Ana",todo:"todo.ana"}]}}get _effectiveView(){return"week"===this._config.view&&this._narrow?"agenda":this._config.view}_headerDate(t){if("week"===this._effectiveView){return`Week of ${new Intl.DateTimeFormat(void 0,{day:"numeric",month:"long"}).format(t)}`}return new Intl.DateTimeFormat(void 0,{weekday:"long",day:"numeric",month:"long"}).format(t)}_onChoreTap(t){const{personId:e,choreId:i}=t.detail;this._hub?.complete(e,i)}render(){if(!this._config)return W;if(!this._hass||!this._hub)return j`<ha-card><div class="loading">Loading…</div></ha-card>`;const t=new Date,e=this._hub.model,i=this._config.header.weather?this._hass.states[this._config.header.weather]:null,s=Mt(this._hass,this._config.header.subtitle);return j`
      <ha-card>
        <div class="head">
          <div>
            <div class="date">${this._headerDate(t)}</div>
            ${s?j`<div class="sub">${s}</div>`:W}
            ${zt.includes(this._config.view)?W:j`<div class="fallback">
                  <code>${this._config.view}</code> view isn't built yet — showing agenda
                </div>`}
            ${e.staleSince?j`<div class="stale">
                  Last updated
                  ${new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"}).format(e.staleSince)}
                </div>`:W}
          </div>
          <div class="meta">
            ${i?j`<span>${Math.round(i.attributes.temperature)}°</span>`:W}
            ${this._config.header.clock?j`<span class="clock">
                  ${new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit",hour12:!1}).format(t)}
                </span>`:W}
          </div>
        </div>
        ${"week"===this._effectiveView?j`<family-hub-week
              .model=${e}
              .now=${t}
              .tz=${this._hass.config?.time_zone||"UTC"}
            ></family-hub-week>`:j`<family-hub-agenda
              .model=${e}
              .now=${t}
              .confirmWindow=${this._config.confirmWindow}
              @chore-tap=${t=>this._onChoreTap(t)}
            ></family-hub-agenda>`}
      </ha-card>
    `}}customElements.define("family-hub-card",It),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.push({type:"family-hub-card",name:"Family Hub Card",description:"Today's schedule per person plus their chores, tappable to complete.",preview:!0,documentationURL:"https://github.com/tempus2016/family-hub-card"}));export{Nt as resolveScheme,Mt as resolveSubtitle};
