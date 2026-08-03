/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(i,t,s)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:c,getPrototypeOf:p}=Object,u=globalThis,f=u.trustedTypes,m=f?f.emptyScript:"",g=u.reactiveElementPolyfillSupport,_=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!a(t,e),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);o?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...d(t),...c(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=i;const n=o.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const n=this.constructor;if(!1===i&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??b)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[_("elementProperties")]=new Map,$[_("finalized")]=new Map,g?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,w=t=>t,k=x.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+S,E=`<${T}>`,D=document,P=()=>D.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,O="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,M=/>/g,H=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,B=/"/g,F=/^(?:script|style|textarea|title)$/i,j=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),L=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,V=D.createTreeWalker(D,129);function Z(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=I;for(let e=0;e<s;e++){const s=t[e];let a,l,h=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===I?"!--"===l[1]?r=N:void 0!==l[1]?r=M:void 0!==l[2]?(F.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=H):void 0!==l[3]&&(r=H):r===H?">"===l[0]?(r=o??I,h=-1):void 0===l[1]?h=-2:(h=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?H:'"'===l[3]?B:R):r===B||r===R?r=H:r===N||r===M?r=I:(r=H,o=void 0);const c=r===H&&t[e+1].startsWith("/>")?" ":"";n+=r===I?s+E:h>=0?(i.push(a),s.slice(0,h)+C+s.slice(h)+S+c):s+S+(-2===h?e:c)}return[Z(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class J{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,h]=K(t,e);if(this.el=J.createElement(l,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=h[n++],s=i.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?st:X}),i.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(F.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],P()),V.nextNode(),a.push({type:2,index:++o});i.append(t[e],P())}}}else if(8===i.nodeType)if(i.data===T)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)a.push({type:7,index:o}),t+=S.length-1}o++}}static createElement(t,e){const s=D.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===L)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=z(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=G(t,o._$AS(t,e.values),o,i)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??D).importNode(e,!0);V.currentNode=i;let o=V.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new it(o,this,t)),this._$AV.push(e),a=s[++r]}n!==a?.index&&(o=V.nextNode(),n++)}return V.currentNode=D,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),z(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Y(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new J(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Q(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(void 0===o)t=G(this,t,e,0),n=!z(t)||t!==this._$AH&&t!==L,n&&(this._$AH=t);else{const i=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=G(this,i[s+r],e,r),a===L&&(a=this._$AH[r]),n||=!z(a)||a!==this._$AH[r],a===W?t=W:t!==W&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends X{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??W)===L)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const ot=x.litHtmlPolyfillSupport;ot?.(J,Q),(x.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class rt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new Q(e.insertBefore(P(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}}rt._$litElement$=!0,rt.finalized=!0,nt.litElementHydrateSupport?.({LitElement:rt});const at=nt.litElementPolyfillSupport;at?.({LitElement:rt}),(nt.litElementVersions??=[]).push("4.2.2");const lt=n`
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
`,ht=n`
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
`,dt=["#4A9EFF","#FF4A87","#FFB84A","#4ADE80","#A78BFA","#22D3EE","#F97316","#E879F9"],ct=["agenda","columns","week"],pt=["auto","dark","light"];function ut(t){const e=t||{};if(!Array.isArray(e.people)||0===e.people.length)throw new Error("family-hub-card: `people` is required and must list at least one person");const s=e.view||"agenda";if(!ct.includes(s))throw new Error(`family-hub-card: unknown \`view\` "${s}" — expected one of ${ct.join(", ")}`);const i=e.theme||"auto";if(!pt.includes(i))throw new Error(`family-hub-card: unknown \`theme\` "${i}" — expected one of ${pt.join(", ")}`);const o=new Set,n=e.people.map((t,e)=>{if(!t||!t.name)throw new Error("family-hub-card: every person needs a `name`");const s=null==t.calendars?[]:[].concat(t.calendars);if(0===s.length&&!t.todo)throw new Error(`family-hub-card: "${t.name}" needs \`calendars\` or \`todo\``);const i=(n=t.name,String(n).trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));var n;if(o.has(i))throw new Error(`family-hub-card: duplicate person name "${t.name}"`);return o.add(i),{id:i,name:t.name,color:t.color||dt[e%dt.length],initials:t.initials||String(t.name).trim()[0].toUpperCase(),calendars:s,todo:t.todo||null,points:t.points||null}});return{view:s,theme:i,refreshInterval:Math.max(60,Number(e.refresh_interval??300)),returnToToday:0===e.return_to_today?0:Math.max(10,Number(e.return_to_today??120)),choreFilter:"all"===e.chore_filter?"all":"today",confirmWindow:0===e.confirm_window?0:Number(e.confirm_window??3),taskmateChores:e.taskmate_chores||null,header:{clock:!1!==e.header?.clock,weather:e.header?.weather||null,subtitle:e.header?.subtitle||null},people:n}}function ft(t,e){const s=new Intl.DateTimeFormat("en-US",{timeZone:e,hour12:!1,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}),i=Object.fromEntries(s.formatToParts(t).filter(t=>"literal"!==t.type).map(t=>[t.type,t.value]));return Date.UTC(Number(i.year),Number(i.month)-1,Number(i.day),Number(i.hour)%24,Number(i.minute),Number(i.second))-(t.getTime()-t.getMilliseconds())}function mt(t,e){const s=ft(t,e),i=new Date(t.getTime()+s);return{year:i.getUTCFullYear(),month:i.getUTCMonth(),day:i.getUTCDate(),hour:i.getUTCHours(),minute:i.getUTCMinutes()}}function gt(t,e){const{year:s,month:i,day:o}=mt(t,e),n=new Date(Date.UTC(s,i,o)-ft(t,e));return new Date(Date.UTC(s,i,o)-ft(n,e))}function _t(t,e,s){const i=s?1296e5:-432e5;return gt(new Date(t.getTime()+i),e)}function vt(t,e,s=1,i=0){let o=gt(t,e);for(let t=0;t<Math.abs(i);t+=1)o=_t(o,e,i>0);let n=o;for(let t=0;t<s;t+=1)n=_t(n,e,!0);return{start:o,end:n}}function bt(t,e,s){const i=mt(t,s),o=mt(e,s);return i.year===o.year&&i.month===o.month&&i.day===o.day}const yt=new Map;function $t(t,e,s){const i=yt.get(t),o=s?.message||String(s||"");return i!==o&&(yt.set(t,o),console.warn(`family-hub-card: ${e}${o?` — ${o}`:""}`),!0)}function xt(t,e){return!!yt.has(t)&&(yt.delete(t),console.info(`family-hub-card: ${e}`),!0)}function wt(t,e){const[s,i,o]=t.split("-").map(Number),{start:n}=vt(new Date(Date.UTC(s,i-1,o,12)),e);return n}async function kt(t,e,s,i,o=1,n=0){const{start:r,end:a}=vt(s,i,o,n),l=`start=${encodeURIComponent(r.toISOString())}&end=${encodeURIComponent(a.toISOString())}`,h=[];for(const t of e)for(const e of t.calendars||[])h.push({person:t,entity:e});const d=[],c={},p=await Promise.all(h.map(async({person:e,entity:s})=>{try{const o=await t.callApi("GET",`calendars/${s}?${l}`);return xt(`calendar:${s}`,`${s} is readable again`),(o||[]).map(t=>function(t,e,s){const i=Boolean(t.start?.date&&!t.start?.dateTime),o=i?wt(t.start.date,s):new Date(t.start.dateTime),n=i?wt(t.end?.date||t.start.date,s):new Date(t.end?.dateTime||t.start.dateTime),r=t.summary||"";return{id:`${e}:${r}:${o.toISOString()}`,personId:e,summary:r,start:o,end:n,allDay:i,location:t.location||""}}(t,e.id,i))}catch(t){return $t(`calendar:${s}`,`could not read ${s}`,t),d.push(s),(c[e.id]||=[]).push(s),[]}})),u=p.flat().filter(t=>t.start<a&&(t.end>r||t.start>=r)).sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start-e.start);return{events:u,failures:d,failuresByPerson:c}}function At(t){if(!t)return null;if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const[e,s,i]=t.split("-").map(Number);return new Date(Date.UTC(e,s-1,i,12))}return new Date(t)}async function Ct(t,e,s,i,o){const n={},r=[],a={};return await Promise.all(e.filter(t=>t.todo).map(async e=>{try{const r=await t.callWS({type:"todo/item/list",entity_id:e.todo});xt(`todo:${e.todo}`,`${e.todo} is readable again`),n[e.id]=function(t,e,s,i){return(t||[]).map(t=>({id:t.uid,summary:t.summary||"",status:"completed"===t.status?"completed":"needs_action",due:At(t.due)})).filter(t=>"all"===e||"completed"===t.status||!t.due||t.due<=s||bt(t.due,s,i))}(r?.items,s,i,o).map(t=>({...t,personId:e.id}))}catch(t){$t(`todo:${e.todo}`,`could not list ${e.todo}`,t),r.push(e.todo),(a[e.id]||=[]).push(e.todo),n[e.id]=[]}})),{choresByPerson:n,failures:r,failuresByPerson:a}}const St=new Set(["unavailable","unknown",""]);function Tt(t,e){return e.taskmateChildId?t.filter(t=>t.childId===e.taskmateChildId):[]}class Et{constructor({config:t,getHass:e,getNow:s,onChange:i,schedule:o}){this.config=t,this.getHass=e,this.getNow=s||(()=>new Date),this.onChange=i||(()=>{}),this.schedule=o,this._cancels=[],this._events=[],this._chores={},this._failuresByPerson={},this._inflight=null,this._windowDays=null,this._startOffset=0,this.model={people:[],staleSince:null,failures:[]}}get _tz(){return this.getHass()?.config?.time_zone||"UTC"}get windowDays(){return this._windowDays??("week"===this.config.view?7:1)}get startOffset(){return this._startOffset}set startOffset(t){this._startOffset!==t&&(this._startOffset=t,this.refresh())}set windowDays(t){this._windowDays!==t&&(this._windowDays=t,this.refresh())}watchedEntities(){const t=[];for(const e of this.config.people)t.push(...e.calendars||[]),e.todo&&t.push(e.todo),e.points&&t.push(e.points);return this.config.taskmateChores&&t.push(this.config.taskmateChores),t}hassChanged(t){const e=this.getHass();if(!e)return;let s=!1,i=!1;for(const o of this.watchedEntities())t?.states?.[o]!==e.states?.[o]&&(o.startsWith("calendar.")||o.startsWith("todo.")?s=!0:i=!0);s?this.refresh():i&&(this._rebuild(e),this.onChange())}async refresh(){return this._inflight||(this._inflight=this._doRefresh().finally(()=>{this._inflight=null})),this._inflight}async _doRefresh(){const t=this.getHass(),e=this.getNow(),{people:s,choreFilter:i}=this.config,[o,n]=await Promise.all([kt(t,s,e,this._tz,this.windowDays,this._startOffset),Ct(t,s,i,e,this._tz)]),r=this._events,a=this._chores,l=new Set(Object.keys(o.failuresByPerson||{}));this._events=[...o.events.filter(t=>!l.has(t.personId)),...r.filter(t=>l.has(t.personId))].sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start-e.start);const h=new Set(Object.keys(n.failuresByPerson||{}));this._chores={};for(const t of s)this._chores[t.id]=h.has(t.id)?a[t.id]||[]:n.choresByPerson[t.id]||[];this._failuresByPerson={};for(const[t,e]of Object.entries(o.failuresByPerson||{}))(this._failuresByPerson[t]||=[]).push(...e);for(const[t,e]of Object.entries(n.failuresByPerson||{}))(this._failuresByPerson[t]||=[]).push(...e);const d=[...o.failures,...n.failures];this.model.staleSince=d.length?this.model.staleSince||e:null,this.model.failures=d,this._rebuild(t),this.onChange()}_rebuild(t){const e=function(t,e){if(!e)return[];const s=t?.states?.[e],i=s?.attributes?.todays_completions;return Array.isArray(i)?i.filter(t=>"__parent__"!==t.child_id).map(t=>({choreId:t.chore_id,childId:t.child_id,name:t.chore_name||"",approved:Boolean(t.approved),completedAt:new Date(t.completed_at)})):[]}(t,this.config.taskmateChores);this.model.people=this.config.people.map(s=>{const i=function(t,e){if(!e.points)return null;const s=t?.states?.[e.points];if(!s)return null;const i=s.attributes||{},o=St.has(s.state)?null:Number(s.state);return{balance:Number.isNaN(o)?null:o,unit:i.unit_of_measurement||"points",earnedToday:i.points_earned_today??null,pendingToday:i.points_pending_today??null,childId:i.child_id??null}}(t,s),o={...s,taskmateChildId:i?.childId||null};return{...o,events:this._events.filter(t=>t.personId===s.id),chores:this._chores[s.id]||[],completedToday:Tt(e,o),points:i,failures:this._failuresByPerson[s.id]||[]}})}start(){this.stop();const t=this.getNow();this._cancels.push(this.schedule(()=>this.refresh(),1e3*this.config.refreshInterval)),this._cancels.push(this.schedule(()=>{this.refresh(),this.start()},function(t,e){return vt(t,e).end.getTime()-t.getTime()}(t,this._tz)))}stop(){this._cancels.forEach(t=>t()),this._cancels=[]}async complete(t,e){const s=this.config.people.find(e=>e.id===t),i=(this._chores[t]||[]).find(t=>t.id===e);if(!s?.todo||!i)return;const o=i.status;i.status="completed",this._rebuild(this.getHass()),this.onChange();try{await async function(t,e,s){await t.callService("todo","update_item",{entity_id:e,item:s,status:"completed"})}(this.getHass(),s.todo,e)}catch(t){$t(`complete:${s.todo}`,`could not complete "${i.summary}" on ${s.todo}`,t),i.status=o,this.model.failures=[...this.model.failures,s.todo],this._rebuild(this.getHass()),this.onChange()}}}class Dt extends rt{static properties={model:{attribute:!1},now:{attribute:!1},confirmWindow:{attribute:!1},readOnly:{attribute:!1},_pending:{state:!0}};static styles=[ht,n`
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
      :host([data-readonly]) .tap { cursor: default; }
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
    `];constructor(){super(),this._pending=new Map,this._narrow=!1}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width<640;e!==this._narrow&&(this._narrow=e,this.requestUpdate())}),this._ro.observe(this),this._onVisibility=()=>{"hidden"===document.visibilityState&&this.flushPending()},this._onPageHide=()=>this.flushPending(),document.addEventListener("visibilitychange",this._onVisibility),window.addEventListener("pagehide",this._onPageHide)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),document.removeEventListener("visibilitychange",this._onVisibility),window.removeEventListener("pagehide",this._onPageHide),this.flushPending()}flushPending(){for(const t of this._pending.values())clearTimeout(t.timer),this._fire(t.personId,t.choreId);this._pending.clear()}_tap(t,e){if(this.readOnly)return;const s=`${t}:${e}`,i=this._pending.get(s);if(i)return clearTimeout(i.timer),this._pending.delete(s),void this.requestUpdate();if(!this.confirmWindow)return void this._fire(t,e);const o=setTimeout(()=>{this._pending.delete(s),this._fire(t,e)},1e3*this.confirmWindow);this._pending.set(s,{timer:o,personId:t,choreId:e}),this.requestUpdate()}_fire(t,e){this.dispatchEvent(new CustomEvent("chore-tap",{detail:{personId:t,choreId:e},bubbles:!0,composed:!0})),this.requestUpdate()}_fmt(t){return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit",hour12:!1}).format(t)}render(){if(!this.model)return W;const t=function(t){const e=[];for(const s of t)for(const t of s.events||[])e.push({time:t.allDay?null:t.start,allDay:t.allDay,event:t,person:s});return e.sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.allDay?0:t.time-e.time)}(this.model.people),e=function(t,e){const s=t.findIndex(t=>!t.allDay);if(-1===s)return-1;if(e<t[s].time)return-1;let i=t.length;for(let o=s;o<t.length;o+=1)if(t[o].time>e){i=o;break}return i}(t,this.now),s=[];return t.forEach((t,i)=>{i===e&&s.push(j`<div class="now"></div>`),s.push(j`
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
      `)}),e===t.length&&s.push(j`<div class="now"></div>`),j`
      <div class="wrap" data-narrow=${String(this._narrow)}>
        <div>
          <div class="sec-l">Today</div>
          <div class="ag">
            ${s.length?s:j`<div class="empty">Nothing scheduled</div>`}
          </div>
        </div>
        <div>
          <div class="sec-l">Chores &amp; points</div>
          ${this.model.people.map(t=>this._person(t))}
        </div>
      </div>
    `}_person(t){const e=(t.chores||[]).filter(t=>"completed"!==t.status),s=(t.chores||[]).filter(t=>"completed"===t.status),i=t.completedToday||[],o=e.length||s.length||i.length;return j`
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
              ${s.map(e=>this._chore(t,e,"done"))}
              ${i.map(t=>j`
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
    `:W}_chore(t,e,s){const i=`${t.id}:${e.id}`,o=this._pending.has(i);return j`
      <div class="chore ${"done"===s?"done":""}">
        <button
          class="tap"
          role="checkbox"
          aria-checked=${"done"===s||o?"true":"false"}
          aria-label=${`Complete ${e.summary} for ${t.name}`}
          @click=${()=>this._tap(t.id,e.id)}
          ?disabled=${"done"===s||this.readOnly}
        >
          <span
            class="box ${o||"done"===s?"filled":""} ${o?"ring":""}"
            style="--fh-window:${this.confirmWindow}s"
          ></span>
        </button>
        <span class="name">${e.summary}</span>
      </div>
    `}}customElements.define("family-hub-agenda",Dt);class Pt extends rt{static properties={model:{attribute:!1},now:{attribute:!1},tz:{attribute:!1},offsetDays:{attribute:!1}};static styles=[ht,n`
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
      .chip.complete { text-decoration: line-through; opacity: 0.45; }

      /* Four fixed columns like the mockup. auto-fit stretched three people
         across the full width and pulled each label away from its value. */
      /* The grid spans seven days while the bars describe one, so the period
         has to be stated or the numbers read as the week's. */
      .bars-head { font-size: 11px; text-transform: uppercase; letter-spacing: 1.4px; color: var(--fh-text-dim); font-weight: 600; margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--fh-rule); }
      .bars { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-top: 12px; }
      .bars[data-narrow='true'] { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
      .bar-l { display: flex; justify-content: space-between; font-size: 15px; margin-bottom: 7px; color: var(--fh-chore-text); gap: 8px; }
      .bar-l b { color: var(--pc); font-family: var(--fh-mono); }
      .track { height: 8px; background: var(--fh-chip); border-radius: 4px; overflow: hidden; }
      .fill { height: 100%; background: var(--pc); border-radius: 4px; }
      .notice { grid-column: 1 / -1; }
    `];constructor(){super(),this._narrow=!1}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width<900;e!==this._narrow&&(this._narrow=e,this.requestUpdate())}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect()}_dow(t){return new Intl.DateTimeFormat(void 0,{weekday:"short"}).format(t)}render(){if(!this.model)return W;const t=this.tz||"UTC",e=function(t,e,s=7){const i=[];for(let o=0;o<s;o+=1){const s=new Date(t.getTime()+24*o*3600*1e3+432e5),n=mt(s,e);i.push({date:s,dayNum:n.day,isToday:0===o})}return i}(this.now,t).map((t,e)=>({...t,isToday:t.isToday&&!this.offsetDays&&0===e}));return j`
      <div class="grid7" data-narrow=${String(this._narrow)}>
        <div></div>
        ${e.map(t=>j`<div class="gh ${t.isToday?"today":""}">
            ${this._dow(t.date)}<b>${t.dayNum}</b>
          </div>`)}
        ${this.model.people.map(s=>this._personRow(s,e,t))}
      </div>
      <div class="bars-head">${s=this.offsetDays||0,i=this.now,s?`Week of ${new Intl.DateTimeFormat(void 0,{day:"numeric",month:"long"}).format(i)}`:"Today"}</div>
      <div class="bars" data-narrow=${String(this._narrow)}>
        ${this.model.people.map(t=>this._bar(t))}
      </div>
    `;var s,i}_personRow(t,e,s){const i=function(t,e,s){return e.map(e=>(t||[]).filter(t=>bt(t.start,e.date,s)))}(t.events,e,s),o=function(t){const e=new Set;for(const s of t.chores||[])"completed"===s.status&&e.add(s.summary);for(const s of t.completedToday||[])e.add(s.name);return e}(t);return j`
      <div class="rowlab" style="--pc:${t.color}">
        <div class="dot"></div><span>${t.name}</span>
      </div>
      ${i.map((s,i)=>j`
          <div class="cell ${e[i].isToday?"today":""}" style="--pc:${t.color}">
            ${s.map(t=>{const s=(n=t,r=e[i].isToday,a=o,{complete:r&&a.has(n.summary),ghost:Boolean(n.allDay)});var n,r,a;return j`<div
                class="chip ${s.ghost?"ghost":""} ${s.complete?"complete":""}"
                title=${t.summary}
              >${t.summary}</div>`})}
          </div>
        `)}
    `}_bar(t){if(this.offsetDays){const e=(t.events||[]).length;return j`
        <div style="--pc:${t.color}">
          <div class="bar-l"><span>${t.name}</span><b>${e} due</b></div>
        </div>
      `}const{done:e,total:s,pct:i}=function(t){const e=t.chores||[],s=e.filter(t=>"completed"!==t.status).length,i=e.filter(t=>"completed"===t.status).length+(t.completedToday||[]).length,o=s+i;return{done:i,total:o,pct:o?Math.round(i/o*100):0}}(t);return j`
      <div style="--pc:${t.color}">
        <div class="bar-l"><span>${t.name}</span><b>${e}/${s}</b></div>
        <div class="track"><div class="fill" style="width:${i}%"></div></div>
      </div>
    `}}customElements.define("family-hub-week",Pt);const zt=(t,e,s)=>Boolean(e&&(t?.states?.[e]?.attributes?.supported_features||0)&s);function Ut(t,e){return(e.people||[]).map(t=>t.todo).filter(e=>zt(t,e,1))}function Ot(t,e){return(e.people||[]).flatMap(t=>t.calendars||[]).filter(e=>zt(t,e,1))}function It(t,e){const s=[];return Ut(t,e).length&&s.push("todo"),Ot(t,e).length&&s.push("calendar"),e.taskmateChores&&t?.user?.is_admin&&s.push("chore"),s}function Nt(t,e){const[s,i,o]=t.split("-").map(Number);return new Date(Date.UTC(s,i-1,o+e)).toISOString().slice(0,10)}async function Mt(t,e){try{return await t.callService("calendar","create_event",function({entityId:t,title:e,date:s,allDay:i,start:o,end:n,description:r,location:a}){const l={entity_id:t,summary:e};if(r&&(l.description=r),a&&(l.location=a),i||!o)return l.start_date=s,l.end_date=Nt(s,1),l;if(l.start_date_time=`${s}T${o}:00`,n)return l.end_date_time=`${s}T${n}:00`,l;const[h,d]=o.split(":").map(Number),c=h+1,p=c>23?Nt(s,1):s,u=String(c%24).padStart(2,"0"),f=String(d).padStart(2,"0");return l.end_date_time=`${p}T${u}:${f}:00`,l}(e)),{ok:!0}}catch(t){return $t(`add:event:${e.entityId}`,`could not add to ${e.entityId}`,t),{ok:!1,error:t?.message||String(t)}}}const Ht={todo:"To-do task",calendar:"Calendar event",chore:"TaskMate chore"};class Rt extends rt{static properties={hass:{attribute:!1},config:{attribute:!1},date:{attribute:!1},open:{type:Boolean},_type:{state:!0},_busy:{state:!0},_error:{state:!0},_fields:{state:!0}};static styles=[ht,n`
      .sheet { background: var(--fh-bg); color: var(--fh-text); border-radius: var(--fh-radius); padding: 20px 22px; min-width: 320px; max-width: 460px; }
      h2 { font-size: 20px; font-weight: 600; margin: 0 0 14px; }
      .types { display: flex; flex-direction: column; gap: 8px; }
      .type { display: flex; align-items: center; min-height: var(--fh-touch); padding: 0 14px; border-radius: var(--fh-radius-inner); background: var(--fh-surface); border: none; color: var(--fh-text); font: inherit; font-size: 16px; cursor: pointer; text-align: left; }
      .type:hover { background: var(--fh-chip); }
      .type .hint { margin-left: auto; font-size: 12px; color: var(--fh-text-mute); }
      label { display: block; font-size: 13px; color: var(--fh-text-mute); margin: 12px 0 4px; }
      input, select { width: 100%; box-sizing: border-box; min-height: var(--fh-touch); padding: 0 12px; border-radius: 10px; border: 1px solid var(--fh-rule); background: var(--fh-surface); color: var(--fh-text); font: inherit; font-size: 16px; }
      .row { display: flex; gap: 10px; }
      .row > * { flex: 1; }
      .check { display: flex; align-items: center; gap: 10px; min-height: var(--fh-touch); font-size: 15px; }
      .check input { width: 20px; min-height: 20px; flex: none; }
      .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
      .btn { min-height: var(--fh-touch); padding: 0 18px; border-radius: 10px; border: none; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer; }
      .btn.cancel { background: none; color: var(--fh-text-mute); }
      .btn.go { background: var(--fh-now); color: #fff; }
      .btn[disabled] { opacity: 0.5; cursor: default; }
      .err { color: var(--error-color, #d64545); font-size: 14px; margin-top: 12px; }
      .scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: grid; place-items: center; z-index: 9; }
    `];constructor(){super(),this.open=!1,this._reset()}_reset(){this._type=null,this._busy=!1,this._error="",this._fields={}}show(){this._reset();const t=It(this.hass,this.config);if(1===t.length){if("chore"===t[0])return this._openTaskMate();this._type=t[0]}this.open=!0}_openTaskMate(){this._close(),window.history.pushState(null,"","/taskmate-admin"),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0}))}_close(){this.open=!1,this._reset(),this.dispatchEvent(new CustomEvent("closed",{bubbles:!0,composed:!0}))}_scrimTap(t){t.target===t.currentTarget&&(Object.keys(this._fields).length||this._close())}_set(t,e){this._fields={...this._fields,[t]:e}}_isoDate(){const t=this.date||new Date;return new Intl.DateTimeFormat("en-CA",{timeZone:this.hass?.config?.time_zone||"UTC",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}async _submit(){this._busy=!0,this._error="";const t=this._fields;let e;e="todo"===this._type?await async function(t,e){try{return await t.callService("todo","add_item",function({entityId:t,title:e,due:s}){const i={entity_id:t,item:e};return s&&(s.includes("T")?i.due_datetime=s:i.due_date=s),i}(e)),{ok:!0}}catch(t){return $t(`add:todo:${e.entityId}`,`could not add to ${e.entityId}`,t),{ok:!1,error:t?.message||String(t)}}}(this.hass,{entityId:t.entityId,title:t.title,due:t.due}):await Mt(this.hass,{entityId:t.entityId,title:t.title,date:t.date||this._isoDate(),allDay:Boolean(t.allDay),start:t.start,end:t.end}),this._busy=!1,e.ok?(this.dispatchEvent(new CustomEvent("created",{bubbles:!0,composed:!0})),this._close()):this._error=e.error}render(){return this.open?j`
      <div class="scrim" @click=${t=>this._scrimTap(t)}>
        <div class="sheet" role="dialog" aria-modal="true">
          ${this._type?this._form():this._picker()}
        </div>
      </div>
    `:W}_picker(){const t=It(this.hass,this.config);return j`
      <h2>Add</h2>
      <div class="types">
        ${t.map(t=>j`<button class="type"
            @click=${()=>"chore"===t?this._openTaskMate():this._type=t}
          >${Ht[t]}${"chore"===t?j`<span class="hint">opens TaskMate</span>`:W}</button>`)}
      </div>
      <div class="actions">
        <button class="btn cancel" @click=${()=>this._close()}>Cancel</button>
      </div>
    `}_form(){const t="todo"===this._type?this._todoForm():this._eventForm(),e=Boolean(this._fields.title&&this._fields.entityId);return j`
      <h2>${Ht[this._type]}</h2>
      ${t}
      ${this._error?j`<div class="err">${this._error}</div>`:W}
      <div class="actions">
        <button class="btn cancel" @click=${()=>this._close()} ?disabled=${this._busy}>Cancel</button>
        <button class="btn go" @click=${()=>this._submit()} ?disabled=${this._busy||!e}>
          ${this._busy?"Adding…":"Add"}
        </button>
      </div>
    `}_entitySelect(t,e){return j`
      <label>${e}</label>
      <select @change=${t=>this._set("entityId",t.target.value)}>
        <option value="">Choose…</option>
        ${t.map(t=>j`<option value=${t}>
            ${this.hass.states[t]?.attributes?.friendly_name||t}
          </option>`)}
      </select>
    `}_todoForm(){const t=Ut(this.hass,this.config),e=this._fields.entityId;return j`
      ${this._entitySelect(t,"List")}
      <label>Task</label>
      <input type="text" @input=${t=>this._set("title",t.target.value)} />
      ${e&&(s=this.hass,i=e,zt(s,i,16))?j`<label>Due (optional)</label>
            <input type="date" @input=${t=>this._set("due",t.target.value)} />`:W}
    `;var s,i}_eventForm(){return j`
      ${this._entitySelect(Ot(this.hass,this.config),"Calendar")}
      <label>Event</label>
      <input type="text" @input=${t=>this._set("title",t.target.value)} />
      <label>Date</label>
      <input type="date" .value=${this._fields.date??this._isoDate()}
        @input=${t=>this._set("date",t.target.value)} />
      <div class="check">
        <input type="checkbox" id="allday" @change=${t=>this._set("allDay",t.target.checked)} />
        <label for="allday" style="margin:0">All day</label>
      </div>
      ${this._fields.allDay?W:j`<div class="row">
            <div>
              <label>Start</label>
              <input type="time" @input=${t=>this._set("start",t.target.value)} />
            </div>
            <div>
              <label>End (optional)</label>
              <input type="time" @input=${t=>this._set("end",t.target.value)} />
            </div>
          </div>`}
    `}}function Bt(t,e,s){const i=Object.keys(t).filter(t=>t.startsWith("todo."));if(s?.endsWith(" Points")){const e=s.slice(0,-7),o=i.find(s=>t[s]?.attributes?.friendly_name===e);if(o)return o}const o=`todo.${e.replace(/^sensor\./,"").replace(/_(points|stats)$/,"")}`;return t[o]?o:null}function Ft(t,e=[]){const s=t?.states;if(!s)return[];const i=new Set((e||[]).map(t=>String(t.name||"").trim().toLowerCase())),o=[];let n=(e||[]).length;for(const[t,e]of function(t){const e=new Map;for(const[s,i]of Object.entries(t)){if(!s.startsWith("sensor."))continue;const t=i?.attributes?.child_name;if(!t)continue;const o=e.get(t);(!o||s.endsWith("_points")&&!o.endsWith("_points"))&&e.set(t,s)}return e}(s))i.has(t.trim().toLowerCase())||(o.push({name:t,color:dt[n%dt.length],calendars:[],todo:Bt(s,e,s[e]?.attributes?.friendly_name),points:e}),n+=1);return o}customElements.define("family-hub-add-dialog",Rt);class jt extends rt{static properties={hass:{attribute:!1},_config:{state:!0},_proposed:{state:!0}};static styles=n`
    .group { margin-bottom: 18px; }
    .row { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
    .row > label { flex: 1 1 160px; }
    label { display: block; font-size: 13px; color: var(--secondary-text-color); margin-bottom: 4px; }
    input, select { width: 100%; box-sizing: border-box; min-height: 40px; padding: 0 10px; border-radius: 8px;
      border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font: inherit; }
    input[type='color'] { padding: 2px; min-width: 52px; }
    h3 { font-size: 15px; margin: 22px 0 8px; }
    .person { border: 1px solid var(--divider-color); border-radius: 10px; padding: 12px; margin-bottom: 10px; }
    .person-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .person-top .idx { font-weight: 600; flex: 1; }
    button { min-height: 36px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--divider-color);
      background: none; color: var(--primary-text-color); font: inherit; cursor: pointer; }
    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    button.icon { min-width: 36px; padding: 0; }
    button[disabled] { opacity: 0.4; cursor: default; }
    .err { color: var(--error-color, #d64545); font-size: 13px; margin-top: 6px; }
    .detect { border: 1px dashed var(--divider-color); border-radius: 10px; padding: 12px; margin-bottom: 14px; }
    .muted { color: var(--secondary-text-color); font-size: 13px; }
  `;setConfig(t){this._config={...t},this._proposed=null}_errors(t){const e={},s=new Set;return(t.people||[]).forEach((t,i)=>{t.name?s.has(t.name.trim().toLowerCase())?e[i]="Duplicate name":(t.calendars||[]).length||t.todo||(e[i]="Needs a calendar or a to-do list"):e[i]="Needs a name",t.name&&s.add(t.name.trim().toLowerCase())}),(t.people||[]).length||(e.card="Add at least one person"),e}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_apply(t){this._emit({...this._config,...t})}_detectedChoresSensor(){return this.hass&&Object.keys(this.hass.states).find(t=>t.startsWith("sensor.")&&Array.isArray(this.hass.states[t].attributes?.todays_completions))||null}_setCard(t,e){const s={...this._config};""===e||null==e?delete s[t]:s[t]=e,this._emit(s)}_setHeader(t,e){const s={...this._config.header||{}};""===e||null===e?delete s[t]:s[t]=e,this._emit({...this._config,header:s})}_setPerson(t,e,s){const i=[...this._config.people||[]],o={...i[t]};""===s||null===s?delete o[e]:o[e]=s,i[t]=o,this._emit({...this._config,people:i})}_addPerson(){const t=[...this._config.people||[]];t.push({name:"",color:dt[t.length%dt.length]}),this._emit({...this._config,people:t})}_removePerson(t){const e=(this._config.people||[]).filter((e,s)=>s!==t);this._emit({...this._config,people:e})}_movePerson(t,e){const s=[...this._config.people||[]],i=t+e;i<0||i>=s.length||([s[t],s[i]]=[s[i],s[t]],this._emit({...this._config,people:s}))}_detect(){this._proposed=Ft(this.hass,this._config.people||[])}_acceptProposed(){const t=[...this._config.people||[],...this._proposed];this._proposed=null,this._emit({...this._config,people:t})}_entities(t){return Object.keys(this.hass?.states||{}).filter(e=>e.startsWith(t)).sort()}_select(t,e,s,i,{blank:o="None"}={}){return j`
      <label>${t}
        <select @change=${t=>i(t.target.value)}>
          <option value="">${o}</option>
          ${s.map(t=>j`<option value=${t} ?selected=${t===e}>
              ${this.hass?.states?.[t]?.attributes?.friendly_name||t}
            </option>`)}
        </select>
      </label>
    `}render(){if(!this._config)return W;const t=this._config,e=this._errors(t);return j`
      <div class="group row">
        <label>View
          <select @change=${t=>this._setCard("view",t.target.value)}>
            ${["agenda","week","columns"].map(e=>j`<option value=${e} ?selected=${(t.view||"agenda")===e}>${e}</option>`)}
          </select>
        </label>
        <label>Theme
          <select @change=${t=>this._setCard("theme",t.target.value)}>
            ${["auto","dark","light"].map(e=>j`<option value=${e} ?selected=${(t.theme||"auto")===e}>${e}</option>`)}
          </select>
        </label>
        <label>Chores shown
          <select @change=${t=>this._setCard("chore_filter",t.target.value)}>
            ${["today","all"].map(e=>j`<option value=${e} ?selected=${(t.chore_filter||"today")===e}>${e}</option>`)}
          </select>
        </label>
      </div>

      <div class="group row">
        <label>Refresh (s)
          <input type="number" min="60" .value=${String(t.refresh_interval??300)}
            @change=${t=>this._setCard("refresh_interval",Number(t.target.value))} />
        </label>
        <label>Undo window (s)
          <input type="number" min="0" .value=${String(t.confirm_window??3)}
            @change=${t=>this._setCard("confirm_window",Number(t.target.value))} />
        </label>
        <label>Return to today (s)
          <input type="number" min="0" .value=${String(t.return_to_today??120)}
            @change=${t=>this._setCard("return_to_today",Number(t.target.value))} />
        </label>
      </div>

      <div class="group row">
        ${this._select("Weather",t.header?.weather,this._entities("weather."),t=>this._setHeader("weather",t))}
        ${this._select("TaskMate chores sensor",t.taskmate_chores,this._entities("sensor."),t=>this._setCard("taskmate_chores",t))}
      </div>
      ${this._choresSuggestion(t)}

      <h3>People</h3>
      ${e.card?j`<div class="err">${e.card}</div>`:W}
      ${this._detectBlock()}
      ${(t.people||[]).map((t,s)=>this._personRow(t,s,e[s]))}
      <button @click=${()=>this._addPerson()}>Add person</button>
    `}_choresSuggestion(t){const e=this._detectedChoresSensor();return e&&t.taskmate_chores!==e?j`<div class="detect">
      TaskMate detected: <code>${e}</code>
      <button style="margin-left:8px" @click=${()=>this._apply({taskmate_chores:e})}>Use it</button>
    </div>`:W}_detectBlock(){return this._proposed?.length?j`
        <div class="detect">
          <div>Found ${this._proposed.length} TaskMate ${1===this._proposed.length?"child":"children"}:
            <b>${this._proposed.map(t=>t.name).join(", ")}</b></div>
          <div class="muted">Check the entities after adding — the to-do list is matched by name.</div>
          <div class="row" style="margin-top:8px">
            <button class="primary" @click=${()=>this._acceptProposed()}>Add them</button>
            <button @click=${()=>{this._proposed=null}}>Dismiss</button>
          </div>
        </div>
      `:this._proposed?j`<div class="detect muted">
        No new TaskMate children found.
        <button style="margin-left:8px" @click=${()=>{this._proposed=null}}>OK</button>
      </div>`:j`<div class="detect">
      <button @click=${()=>this._detect()}>Detect people</button>
      <span class="muted"> — finds TaskMate children and wires their entities</span>
    </div>`}_personRow(t,e,s){const i=Array.isArray(t.calendars)?t.calendars:t.calendars?[t.calendars]:[];return j`
      <div class="person">
        <div class="person-top">
          <span class="idx">${t.name||`Person ${e+1}`}</span>
          <button class="icon" title="Move up" ?disabled=${0===e}
            @click=${()=>this._movePerson(e,-1)}>↑</button>
          <button class="icon" title="Move down" ?disabled=${e===this._config.people.length-1}
            @click=${()=>this._movePerson(e,1)}>↓</button>
          <button class="icon" title="Remove" @click=${()=>this._removePerson(e)}>✕</button>
        </div>
        <div class="row">
          <label style="flex:2 1 200px">Name
            <input type="text" .value=${t.name||""}
              @input=${t=>this._setPerson(e,"name",t.target.value)} />
          </label>
          <label style="flex:0 0 70px">Colour
            <input type="color" .value=${t.color||dt[e%dt.length]}
              @change=${t=>this._setPerson(e,"color",t.target.value)} />
          </label>
        </div>
        <div class="row">
          ${this._select("To-do list",t.todo,this._entities("todo."),t=>this._setPerson(e,"todo",t))}
          ${this._select("Points sensor",t.points,this._entities("sensor."),t=>this._setPerson(e,"points",t))}
        </div>
        <label>Calendars
          <select multiple size="4" @change=${t=>this._setPerson(e,"calendars",[...t.target.selectedOptions].map(t=>t.value))}>
            ${this._entities("calendar.").map(t=>j`<option value=${t} ?selected=${i.includes(t)}>
                ${this.hass?.states?.[t]?.attributes?.friendly_name||t}
              </option>`)}
          </select>
        </label>
        ${s?j`<div class="err">${s}</div>`:W}
      </div>
    `}}customElements.define("family-hub-card-editor",jt);const Lt=/^[a-z_]+\.[a-z0-9_]+$/,Wt=["agenda","week"];function qt(t,e){if("dark"===e||"light"===e)return e;const s=t?.themes?.darkMode;return"boolean"==typeof s?s?"dark":"light":"undefined"!=typeof window&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}function Vt(t,e){return e?Lt.test(e)&&t?.states?.[e]?t.states[e].state:e:""}class Zt extends rt{static properties={_tick:{state:!0},_offset:{state:!0}};static styles=[lt,ht,n`
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
      .nav { display: flex; align-items: center; gap: 6px; }
      .navbtn { min-width: var(--fh-touch); min-height: var(--fh-touch); border-radius: 10px; border: none; background: none; color: var(--fh-text-mute); font-size: 22px; line-height: 1; cursor: pointer; }
      .navbtn:hover { background: var(--fh-surface); color: var(--fh-text); }
      .today { min-height: 32px; padding: 0 12px; border-radius: 8px; border: none; background: var(--fh-surface); color: var(--fh-text); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 6px; }
      .addbtn { min-width: var(--fh-touch); min-height: var(--fh-touch); border-radius: 50%; border: none; background: var(--fh-surface); color: var(--fh-text); font-size: 26px; line-height: 1; cursor: pointer; flex-shrink: 0; }
      .addbtn:hover { background: var(--fh-chip); }
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
    `];setConfig(t){this._config=ut(t),this._applyScheme(),Wt.includes(this._config.view)||console.warn(`family-hub-card: view "${this._config.view}" is not implemented yet — rendering agenda.`),this._hub?.stop(),this._hub=null}set hass(t){const e=this._hass;this._hass=t,this._applyScheme(),this._hub&&this._hub.hassChanged(e),!this._hub&&this._config&&(this._hub=new Et({config:this._config,getHass:()=>this._hass,getNow:()=>new Date,onChange:()=>this.requestUpdate(),schedule:(t,e)=>{const s=setInterval(t,e);return()=>clearInterval(s)}}),this._hub.start(),this._hub.refresh()),this.requestUpdate()}get hass(){return this._hass}_applyScheme(){const t=qt(this._hass,this._config?.theme);this.dataset.scheme!==t&&(this.dataset.scheme=t,this.requestUpdate())}connectedCallback(){super.connectedCallback(),this._applyScheme(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width<900;e!==this._narrow&&(this._narrow=e,this._hub&&(this._hub.windowDays="week"===this._effectiveView?7:1),this.requestUpdate())}),this._ro.observe(this),this._scheduleTick(),this._onOnline=()=>this._hub?.refresh(),window.addEventListener("online",this._onOnline)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),clearTimeout(this._tickTimer),clearTimeout(this._returnTimer),window.removeEventListener("online",this._onOnline),this._hub?.stop()}_scheduleTick(){this._tickTimer=setTimeout(()=>{this._tick=Date.now(),this._scheduleTick()},function(t){const e=t.getTime()%6e4;return 0===e?6e4:6e4-e}(new Date))}getCardSize(){return 12}static getConfigElement(){return document.createElement("family-hub-card-editor")}static getStubConfig(){return{view:"agenda",people:[{name:"Ana",todo:"todo.ana"}]}}get _effectiveView(){return"week"===this._config.view&&this._narrow?"agenda":this._config.view}_headerDate(t){if("week"===this._effectiveView){return`Week of ${new Intl.DateTimeFormat(void 0,{day:"numeric",month:"long"}).format(t)}`}return new Intl.DateTimeFormat(void 0,{weekday:"long",day:"numeric",month:"long"}).format(t)}get _pageStep(){return"week"===this._effectiveView?7:1}_viewDate(t){return new Date(t.getTime()+24*(this._offset||0)*3600*1e3)}_page(t){this._setOffset((this._offset||0)+t*this._pageStep)}_goToday(){this._setOffset(0)}_setOffset(t){this._offset=t,this._hub&&(this._hub.startOffset=t),this._armReturn(),this.requestUpdate()}_armReturn(){clearTimeout(this._returnTimer);const t=this._config?.returnToToday;t&&this._offset&&(this._returnTimer=setTimeout(()=>this._goToday(),1e3*t))}_onChoreTap(t){const{personId:e,choreId:s}=t.detail;this._hub?.complete(e,s)}render(){if(!this._config)return W;if(!this._hass||!this._hub)return j`<ha-card><div class="loading">Loading…</div></ha-card>`;const t=new Date,e=this._hub.model,s=this._config.header.weather?this._hass.states[this._config.header.weather]:null,i=Vt(this._hass,this._config.header.subtitle);return j`
      <ha-card>
        <div class="head">
          <div>
            <div class="nav">
              <button class="navbtn" aria-label="Previous" @click=${()=>this._page(-1)}>‹</button>
              <div class="date">${this._headerDate(this._viewDate(t))}</div>
              <button class="navbtn" aria-label="Next" @click=${()=>this._page(1)}>›</button>
            </div>
            ${this._offset?j`<button class="today" @click=${()=>this._goToday()}>Today</button>`:W}
            ${i?j`<div class="sub">${i}</div>`:W}
            ${Wt.includes(this._config.view)?W:j`<div class="fallback">
                  <code>${this._config.view}</code> view isn't built yet — showing agenda
                </div>`}
            ${e.staleSince?j`<div class="stale">
                  Last updated
                  ${new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"}).format(e.staleSince)}
                </div>`:W}
          </div>
          <div class="meta">
            ${s?j`<span>${Math.round(s.attributes.temperature)}°</span>`:W}
            ${It(this._hass,this._config).length?j`<button class="addbtn" aria-label="Add" title="Add"
                  @click=${()=>this.renderRoot.querySelector("family-hub-add-dialog")?.show()}
                >+</button>`:W}
            ${this._config.header.clock?j`<span class="clock">
                  ${new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit",hour12:!1}).format(t)}
                </span>`:W}
          </div>
        </div>
        <family-hub-add-dialog
          .hass=${this._hass}
          .config=${this._config}
          .date=${this._viewDate(t)}
          @created=${()=>this._hub?.refresh()}
        ></family-hub-add-dialog>
        ${"week"===this._effectiveView?j`<family-hub-week
              .model=${e}
              .now=${this._viewDate(t)}
              .offsetDays=${this._offset||0}
              .tz=${this._hass.config?.time_zone||"UTC"}
            ></family-hub-week>`:j`<family-hub-agenda
              .model=${e}
              .now=${this._viewDate(t)}
              .readOnly=${Boolean(this._offset)}
              .confirmWindow=${this._config.confirmWindow}
              @chore-tap=${t=>this._onChoreTap(t)}
            ></family-hub-agenda>`}
      </ha-card>
    `}}customElements.define("family-hub-card",Zt),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.push({type:"family-hub-card",name:"Family Hub Card",description:"Today's schedule per person plus their chores, tappable to complete.",preview:!0,documentationURL:"https://github.com/tempus2016/family-hub-card"}));export{qt as resolveScheme,Vt as resolveSubtitle};
