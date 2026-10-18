/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(i,t,s)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:r,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:c,getPrototypeOf:p}=Object,u=globalThis,f=u.trustedTypes,m=f?f.emptyScript:"",g=u.reactiveElementPolyfillSupport,_=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!r(t,e),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const a=i?.call(this);n?.call(this,e),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...h(t),...c(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=i;const a=n.fromAttribute(e,t.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const a=this.constructor;if(!1===i&&(n=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??b)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==n||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[_("elementProperties")]=new Map,$[_("finalized")]=new Map,g?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,x=t=>t,k=w.trustedTypes,C=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,T="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+S,E=`<${A}>`,z=document,D=()=>z.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,M="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,N=/>/g,R=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,H=/"/g,j=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),F=Symbol.for("lit-noChange"),L=Symbol.for("lit-nothing"),q=new WeakMap,V=z.createTreeWalker(z,129);function Z(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const G=(t,e)=>{const s=t.length-1,i=[];let n,a=2===e?"<svg>":3===e?"<math>":"",o=U;for(let e=0;e<s;e++){const s=t[e];let r,l,d=-1,h=0;for(;h<s.length&&(o.lastIndex=h,l=o.exec(s),null!==l);)h=o.lastIndex,o===U?"!--"===l[1]?o=I:void 0!==l[1]?o=N:void 0!==l[2]?(j.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=R):void 0!==l[3]&&(o=R):o===R?">"===l[0]?(o=n??U,d=-1):void 0===l[1]?d=-2:(d=o.lastIndex-l[2].length,r=l[1],o=void 0===l[3]?R:'"'===l[3]?H:B):o===H||o===B?o=R:o===I||o===N?o=U:(o=R,n=void 0);const c=o===R&&t[e+1].startsWith("/>")?" ":"";a+=o===U?s+E:d>=0?(i.push(r),s.slice(0,d)+T+s.slice(d)+S+c):s+S+(-2===d?e:c)}return[Z(t,a+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,a=0;const o=t.length-1,r=this.parts,[l,d]=G(t,e);if(this.el=K.createElement(l,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&r.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(T)){const e=d[a++],s=i.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);r.push({type:1,index:n,name:o[2],strings:s,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?st:X}),i.removeAttribute(t)}else t.startsWith(S)&&(r.push({type:6,index:n}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],D()),V.nextNode(),r.push({type:2,index:++n});i.append(t[e],D())}}}else if(8===i.nodeType)if(i.data===A)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)r.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function J(t,e,s=t,i){if(e===F)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const a=P(e)?void 0:e._$litDirective$;return n?.constructor!==a&&(n?._$AO?.(!1),void 0===a?n=void 0:(n=new a(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=J(t,n._$AS(t,e.values),n,i)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??z).importNode(e,!0);V.currentNode=i;let n=V.nextNode(),a=0,o=0,r=s[0];for(;void 0!==r;){if(a===r.index){let e;2===r.type?e=new Q(n,n.nextSibling,this,t):1===r.type?e=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(e=new it(n,this,t)),this._$AV.push(e),r=s[++o]}a!==r?.index&&(n=V.nextNode(),a++)}return V.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),P(t)?t===L||null==t||""===t?(this._$AH!==L&&this._$AR(),this._$AH=L):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==L&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Y(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new K(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Q(this.O(D()),this.O(D()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=L,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=L}_$AI(t,e=this,s,i){const n=this.strings;let a=!1;if(void 0===n)t=J(this,t,e,0),a=!P(t)||t!==this._$AH&&t!==F,a&&(this._$AH=t);else{const i=t;let o,r;for(t=n[0],o=0;o<n.length-1;o++)r=J(this,i[s+o],e,o),r===F&&(r=this._$AH[o]),a||=!P(r)||r!==this._$AH[o],r===L?t=L:t!==L&&(t+=(r??"")+n[o+1]),this._$AH[o]=r}a&&!i&&this.j(t)}j(t){t===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===L?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==L)}}class st extends X{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??L)===F)return;const s=this._$AH,i=t===L&&s!==L||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==L&&(s===L||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(K,Q),(w.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ot extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new Q(e.insertBefore(D(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}ot._$litElement$=!0,ot.finalized=!0,at.litElementHydrateSupport?.({LitElement:ot});const rt=at.litElementPolyfillSupport;rt?.({LitElement:ot}),(at.litElementVersions??=[]).push("4.2.2");const lt=a`
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
`,dt=a`
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

  /* Pill-sized status words after a task name. */
  .badge { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; flex-shrink: 0; }
  .badge.waiting { color: var(--warning-color, #FFB84A); }
  .badge.overdue { color: var(--error-color, #d64545); }
  .inline-badge { margin-right: 8px; vertical-align: middle; }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`,ht=a`
  .chore { display: flex; align-items: center; gap: 10px; font-size: 16px; color: var(--fh-chore-text); }
  .chore .name { flex: 1; min-width: 0; }
  .chore.done .name { text-decoration: line-through; color: var(--fh-text-dim); }
  .chore.pending .name { font-style: italic; }
  .chore.overdue .name { color: var(--error-color, #d64545); }
  .box { width: 19px; height: 19px; border-radius: 5px; background: var(--fh-chip); flex-shrink: 0; position: relative; }
  .box.done { background: var(--pc); }
  .box.done::after { content: '\\2713'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--fh-bg); font-weight: 800; }
  .tap.inline { display: inline-flex; vertical-align: middle; margin-right: 8px; }
  .ring { animation: fh-ring var(--fh-window, 3s) linear forwards; }
  @keyframes fh-ring { from { opacity: 1; } to { opacity: 0.35; } }
`,ct=["#4A9EFF","#FF4A87","#FFB84A","#4ADE80","#A78BFA","#22D3EE","#F97316","#E879F9"],pt="family",ut=["agenda","columns","week"],ft=["auto","dark","light"],mt=["monday","sunday","today"],gt=/^(#[0-9a-f]{3,8}|[a-z]+|(rgba?|hsla?)\([0-9a-z%.,\s/]*\)|var\(\s*--[a-z0-9-]+\s*\))$/i,_t=/^[a-z_]+\.[a-z0-9_]+$/;function vt(t,e){if(null!=t&&!gt.test(String(t).trim()))throw new Error(`family-hub-card: "${t}" is not a valid \`color\` for "${e}"`);return t?String(t).trim():null}function bt(t,e){const s=null==t?[]:[].concat(t);for(const t of s)if(!_t.test(String(t)))throw new Error(`family-hub-card: "${t}" is not a valid entity id for "${e}"`);return s}function yt(t){const e=t||{};if(!Array.isArray(e.people)||0===e.people.length)throw new Error("family-hub-card: `people` is required and must list at least one person");const s=e.view||"agenda";if(!ut.includes(s))throw new Error(`family-hub-card: unknown \`view\` "${s}" — expected one of ${ut.join(", ")}`);const i=e.theme||"auto";if(!ft.includes(i))throw new Error(`family-hub-card: unknown \`theme\` "${i}" — expected one of ${ft.join(", ")}`);const n=e.week_start||"monday";if(!mt.includes(n))throw new Error(`family-hub-card: unknown \`week_start\` "${n}" — expected one of ${mt.join(", ")}`);const a=new Set,o=e.people.map((t,e)=>{if(!t||!t.name)throw new Error("family-hub-card: every person needs a `name`");const s=bt(t.calendars,t.name);if(0===s.length&&!t.todo)throw new Error(`family-hub-card: "${t.name}" needs \`calendars\` or \`todo\``);if(null!=t.person&&!/^person\.[a-z0-9_]+$/.test(String(t.person)))throw new Error(`family-hub-card: "${t.person}" is not a person entity for "${t.name}"`);const i=(n=t.name,String(n).trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));var n;if(a.has(i)||i===pt)throw new Error(`family-hub-card: duplicate person name "${t.name}"`);return a.add(i),{id:i,name:t.name,color:vt(t.color,t.name)||ct[e%ct.length],initials:t.initials||String(t.name).trim()[0].toUpperCase(),calendars:s,todo:t.todo||null,points:t.points||null,picture:t.picture||null,person:t.person||null,shared:!1}}),r=bt(e.shared_calendars,"shared_calendars");if(r.length){const t=e.shared_name||"Family";o.push({id:pt,name:t,color:vt(e.shared_color,t)||"#9AA3B8",initials:String(t).trim()[0].toUpperCase(),calendars:r,todo:null,points:null,picture:null,person:null,shared:!0})}const l=Boolean(e.tabs);return{view:s,theme:i,weekStart:n,refreshInterval:Math.max(60,Number(e.refresh_interval??300)),returnToToday:0===e.return_to_today?0:Math.max(10,Number(e.return_to_today??120)),choreFilter:"all"===e.chore_filter?"all":"today",inlineChores:!1!==e.inline_chores&&!l,tabs:l,confirmWindow:0===e.confirm_window?0:Number(e.confirm_window??3),maxCompleted:0===e.max_completed?0:Math.max(0,Number(e.max_completed??3)),taskmateChores:e.taskmate_chores||null,header:{clock:!1!==e.header?.clock,weather:e.header?.weather||null,subtitle:e.header?.subtitle||null},people:o}}function $t(t,e){const s=new Intl.DateTimeFormat("en-US",{timeZone:e,hour12:!1,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}),i=Object.fromEntries(s.formatToParts(t).filter(t=>"literal"!==t.type).map(t=>[t.type,t.value]));return Date.UTC(Number(i.year),Number(i.month)-1,Number(i.day),Number(i.hour)%24,Number(i.minute),Number(i.second))-(t.getTime()-t.getMilliseconds())}function wt(t,e){const s=$t(t,e),i=new Date(t.getTime()+s);return{year:i.getUTCFullYear(),month:i.getUTCMonth(),day:i.getUTCDate(),hour:i.getUTCHours(),minute:i.getUTCMinutes()}}function xt(t,e){const{year:s,month:i,day:n}=wt(t,e),a=new Date(Date.UTC(s,i,n)-$t(t,e));return new Date(Date.UTC(s,i,n)-$t(a,e))}function kt(t,e,s){const i=s?1296e5:-432e5;return xt(new Date(t.getTime()+i),e)}function Ct(t,e,s=1,i=0){let n=xt(t,e);for(let t=0;t<Math.abs(i);t+=1)n=kt(n,e,i>0);let a=n;for(let t=0;t<s;t+=1)a=kt(a,e,!0);return{start:n,end:a}}function Tt(t,e,s){const i=wt(t,s),n=wt(e,s);return i.year===n.year&&i.month===n.month&&i.day===n.day}const St=new Map;function At(t,e,s){const i=St.get(t),n=s?.message||String(s||"");return i!==n&&(St.set(t,n),console.warn(`family-hub-card: ${e}${n?` — ${n}`:""}`),!0)}function Et(t,e){return!!St.has(t)&&(St.delete(t),console.info(`family-hub-card: ${e}`),!0)}function zt(t,e){const[s,i,n]=t.split("-").map(Number),{start:a}=Ct(new Date(Date.UTC(s,i-1,n,12)),e);return a}async function Dt(t,e,s,i,n=1,a=0){const{start:o,end:r}=Ct(s,i,n,a),l=`start=${encodeURIComponent(o.toISOString())}&end=${encodeURIComponent(r.toISOString())}`,d=new Map;for(const t of e)for(const e of t.calendars||[])d.has(e)||d.set(e,[]),d.get(e).push(t);const h=[],c={},p=await Promise.all([...d.entries()].map(async([e,s])=>{try{const n=await t.callApi("GET",`calendars/${encodeURIComponent(e)}?${l}`);return Et(`calendar:${e}`,`${e} is readable again`),s.flatMap(t=>(n||[]).map(s=>function(t,e,s,i=e){const n=Boolean(t.start?.date&&!t.start?.dateTime),a=n?zt(t.start.date,s):new Date(t.start.dateTime),o=n?zt(t.end?.date||t.start.date,s):new Date(t.end?.dateTime||t.start.dateTime),r=t.summary||"";return{id:`${i}:${r}:${a.toISOString()}`,calendar:i,personId:e,summary:r,start:a,end:o,allDay:n,location:t.location||"",description:t.description||""}}(s,t.id,i,e)))}catch(t){At(`calendar:${e}`,`could not read ${e}`,t),h.push(e);for(const t of s)(c[t.id]||=[]).push(e);return[]}})),u=p.flat().filter(t=>t.start<r&&(t.end>o||t.start>=o)).sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start-e.start);return{events:u,failures:h,failuresByPerson:c}}function Pt(t){if(!t)return null;if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const[e,s,i]=t.split("-").map(Number);return new Date(Date.UTC(e,s-1,i,12))}return new Date(t)}async function Ot(t,e,s,i,n){const a={},o=[],r={};return await Promise.all(e.filter(t=>t.todo).map(async e=>{try{const o=await t.callWS({type:"todo/item/list",entity_id:e.todo});Et(`todo:${e.todo}`,`${e.todo} is readable again`),a[e.id]=function(t,e,s,i){return(t||[]).map(t=>({id:t.uid,summary:t.summary||"",status:"completed"===t.status?"completed":"needs_action",due:Pt(t.due),dueHasTime:Boolean(t.due)&&!/^\d{4}-\d{2}-\d{2}$/.test(t.due)})).filter(t=>"all"===e||"completed"===t.status||!t.due||t.due<=s||Tt(t.due,s,i))}(o?.items,s,i,n).map(t=>({...t,personId:e.id}))}catch(t){At(`todo:${e.todo}`,`could not list ${e.todo}`,t),o.push(e.todo),(r[e.id]||=[]).push(e.todo),a[e.id]=[]}})),{choresByPerson:a,failures:o,failuresByPerson:r}}const Mt=new Set(["unavailable","unknown",""]);function Ut(t,e){return e.taskmateChildId?t.filter(t=>t.childId===e.taskmateChildId):[]}function It(t,{now:e=new Date,tz:s="UTC",maxCompleted:i=1/0}={}){const{start:n}=Ct(e,s),a=[],o=[],r=new Set;for(const e of t.chores||[]){r.add(e.summary);const t="completed"===e.status,s={id:e.id,summary:e.summary,done:t,pending:!1,tappable:!t,due:e.due||null,dueHasTime:Boolean(e.dueHasTime),overdue:!t&&Boolean(e.due)&&e.due<n,kind:"todo"};(t?o:a).push(s)}const l=o.slice(0,Math.max(0,i)),d=[];for(const e of t.completedToday||[])r.has(e.name)||(r.add(e.name),d.push({id:e.choreId,summary:e.name,done:!0,pending:!e.approved,tappable:!1,due:null,dueHasTime:!1,overdue:!1,kind:"completion"}));return[...a,...l,...d]}function Nt(t){if(t.progress)return t.progress;const e=t.chores||[],s=e.filter(t=>"completed"!==t.status).length,i=e.filter(t=>"completed"===t.status).length+(t.completedToday||[]).length,n=s+i;return{done:i,total:n,pct:n?Math.round(i/n*100):0}}function Rt(t){return t.tasks||It(t)}class Bt{constructor({config:t,getHass:e,getNow:s,onChange:i,schedule:n}){this.config=t,this.getHass=e,this.getNow=s||(()=>new Date),this.onChange=i||(()=>{}),this.schedule=n,this._cancels=[],this._events=[],this._chores={},this._failuresByPerson={},this._inflight=null,this._inflightScope={events:!1,chores:!1},this._queued=null,this._lastCal={events:[],failures:[],failuresByPerson:{}},this._lastTodo={choresByPerson:{},failures:[],failuresByPerson:{}},this._windowDays=null,this._startOffset=0,this.model={people:[],staleSince:null,failures:[]}}get _tz(){return this.getHass()?.config?.time_zone||"UTC"}get windowDays(){return this._windowDays??("week"===this.config.view?7:1)}get startOffset(){return this._startOffset}set startOffset(t){this._startOffset!==t&&(this._startOffset=t,this.refresh({events:!0,chores:!1,stale:!0}))}set windowDays(t){this._windowDays!==t&&(this._windowDays=t,this.refresh({events:!0,chores:!1,stale:!0}))}watchedEntities(){const t=[];for(const e of this.config.people)t.push(...e.calendars||[]),e.todo&&t.push(e.todo),e.points&&t.push(e.points);return this.config.taskmateChores&&t.push(this.config.taskmateChores),t}hassChanged(t){const e=this.getHass();if(!e)return;let s=!1,i=!1,n=!1;for(const a of this.watchedEntities())t?.states?.[a]!==e.states?.[a]&&(a.startsWith("calendar.")?s=!0:a.startsWith("todo.")?i=!0:n=!0);if(s||i)return this.refresh({events:s,chores:i});n&&(this._rebuild(e),this.onChange())}async refresh({events:t=!0,chores:e=!0,stale:s=!1}={}){return this._inflight?(this._queued={events:this._queued?.events||t&&(s||!this._inflightScope.events),chores:this._queued?.chores||e&&(s||!this._inflightScope.chores)},this._inflight):(this._inflightScope={events:t,chores:e},this._inflight=this._doRefresh({events:t,chores:e}).finally(()=>{this._inflight=null;const t=this._queued;this._queued=null,t&&(t.events||t.chores)&&this.refresh(t)}),this._inflight)}async _doRefresh({events:t,chores:e}){const s=this.getHass(),i=this.getNow(),{people:n,choreFilter:a}=this.config,[o,r]=await Promise.all([t?Dt(s,n,i,this._tz,this.windowDays,this._startOffset):this._lastCal,e?Ot(s,n,a,i,this._tz):this._lastTodo]);this._lastCal=o,this._lastTodo=r;const l=this._events,d=this._chores;if(t){const t=new Set(Object.keys(o.failuresByPerson||{}));this._events=[...o.events.filter(e=>!t.has(e.personId)),...l.filter(e=>t.has(e.personId))].sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start-e.start)}if(e){const t=new Set(Object.keys(r.failuresByPerson||{}));this._chores={};for(const e of n)this._chores[e.id]=t.has(e.id)?d[e.id]||[]:r.choresByPerson[e.id]||[]}this._failuresByPerson={};for(const[t,e]of Object.entries(o?.failuresByPerson||{}))(this._failuresByPerson[t]||=[]).push(...e);for(const[t,e]of Object.entries(r?.failuresByPerson||{}))(this._failuresByPerson[t]||=[]).push(...e);const h=[...o?.failures||[],...r?.failures||[]];this.model={...this.model,staleSince:h.length?this.model.staleSince||i:null,failures:h},this._rebuild(s),this.onChange()}_rebuild(t){const e=function(t,e){if(!e)return[];const s=t?.states?.[e],i=s?.attributes?.todays_completions;return Array.isArray(i)?i.filter(t=>"__parent__"!==t.child_id).map(t=>({choreId:t.chore_id,childId:t.child_id,name:t.chore_name||"",approved:Boolean(t.approved),completedAt:new Date(t.completed_at)})):[]}(t,this.config.taskmateChores),s=this.getNow(),i=this.config.people.map(i=>{const n=function(t,e){if(!e.points)return null;const s=t?.states?.[e.points];if(!s)return null;const i=s.attributes||{},n=Mt.has(s.state)?null:Number(s.state);return{balance:Number.isNaN(n)?null:n,unit:i.unit_of_measurement||"points",earnedToday:i.points_earned_today??null,pendingToday:i.points_pending_today??null,childId:i.child_id??null,streak:Number(i.current_streak)||0,avatarIcon:i.avatar||null,avatarImage:i.avatar_image||null}}(t,i),a={...i,taskmateChildId:n?.childId||null},o=i.person?t?.states?.[i.person]:null,r={...a,picture:i.picture||o?.attributes?.entity_picture||n?.avatarImage||null,icon:n?.avatarIcon||null,events:this._events.filter(t=>t.personId===i.id),chores:this._chores[i.id]||[],completedToday:Ut(e,a),points:n,failures:this._failuresByPerson[i.id]||[]};return r.tasks=It(r,{now:s,tz:this._tz,maxCompleted:this.config.maxCompleted}),r.progress=Nt(r),r});this.model={...this.model,people:i}}start(){this.stop();const t=this.getNow();this._cancels.push(this.schedule(()=>this.refresh(),1e3*this.config.refreshInterval)),this._cancels.push(this.schedule(()=>{this.refresh(),this.start()},function(t,e){return Ct(t,e).end.getTime()-t.getTime()}(t,this._tz)))}stop(){this._cancels.forEach(t=>t()),this._cancels=[]}async complete(t,e){const s=this.config.people.find(e=>e.id===t),i=(this._chores[t]||[]).find(t=>t.id===e);if(!s?.todo||!i)return;const n=i.status;i.status="completed",this._rebuild(this.getHass()),this.onChange();try{await async function(t,e,s){await t.callService("todo","update_item",{entity_id:e,item:s,status:"completed"})}(this.getHass(),s.todo,e)}catch(t){At(`complete:${s.todo}`,`could not complete "${i.summary}" on ${s.todo}`,t),i.status=n,this.model={...this.model,failures:[...this.model.failures,s.todo]},this._rebuild(this.getHass()),this.onChange()}}}const Ht={en:{today:"Today",all_day:"All day",nothing_scheduled:"Nothing scheduled",nothing_on:"Nothing on",no_tasks:"No tasks",chores_points:"Chores & points",chores:"Chores",to_do:"{n} to do",all_done:"All done",no_chore_list:"No chore list",next:"Next: {chore}",done_of:"{done}/{total} done",waiting:"waiting",overdue:"overdue",morning:"Morning",afternoon:"Afternoon",evening:"Evening",week_of:"Week of {date}",last_updated:"Last updated {time}",cant_read:"Can't read {entities}",loading:"Loading…",previous:"Previous",next_page:"Next",add:"Add",calendar:"Calendar",tasks:"Tasks",due:"{n} due",points:"points",streak:"{n} day streak",family:"Family",n_chores:"{n} chores",chores_done:"{done}/{total} chores",complete_for:"Complete {chore} for {name}",view_not_built:"{view} view isn't built yet — showing agenda",todo_task:"To-do task",calendar_event:"Calendar event",taskmate_chore:"TaskMate chore",opens_taskmate:"opens TaskMate",cancel:"Cancel",adding:"Adding…",choose:"Choose…",list:"List",task:"Task",due_optional:"Due (optional)",event:"Event",date:"Date",start:"Start",end_optional:"End (optional)",add_in_taskmate:"add in TaskMate",lists_blocked:"{n} lists do not accept new items directly. TaskMate chores carry points, recurrence and assignment, so they are created in TaskMate.",list_blocked:"One list does not accept new items directly. TaskMate chores carry points, recurrence and assignment, so they are created in TaskMate."},pt:{today:"Hoje",all_day:"Todo o dia",nothing_scheduled:"Nada agendado",nothing_on:"Nada marcado",no_tasks:"Sem tarefas",chores_points:"Tarefas e pontos",chores:"Tarefas",to_do:"{n} por fazer",all_done:"Tudo feito",no_chore_list:"Sem lista de tarefas",next:"Próxima: {chore}",done_of:"{done}/{total} feitas",waiting:"a aguardar",overdue:"atrasada",morning:"Manhã",afternoon:"Tarde",evening:"Noite",week_of:"Semana de {date}",last_updated:"Atualizado às {time}",cant_read:"Sem acesso a {entities}",loading:"A carregar…",previous:"Anterior",next_page:"Seguinte",add:"Adicionar",calendar:"Calendário",tasks:"Tarefas",due:"{n} previstas",points:"pontos",streak:"{n} dias seguidos",family:"Família",n_chores:"{n} tarefas",chores_done:"{done}/{total} tarefas",complete_for:"Concluir {chore} de {name}",view_not_built:"A vista {view} ainda não existe — a mostrar agenda",todo_task:"Tarefa",calendar_event:"Evento",taskmate_chore:"Tarefa TaskMate",opens_taskmate:"abre o TaskMate",cancel:"Cancelar",adding:"A adicionar…",choose:"Escolher…",list:"Lista",task:"Tarefa",due_optional:"Prazo (opcional)",event:"Evento",date:"Data",start:"Início",end_optional:"Fim (opcional)",add_in_taskmate:"adicionar no TaskMate",lists_blocked:"{n} listas não aceitam itens novos diretamente. As tarefas TaskMate têm pontos, recorrência e atribuição, por isso criam-se no TaskMate.",list_blocked:"Uma lista não aceita itens novos diretamente. As tarefas TaskMate têm pontos, recorrência e atribuição, por isso criam-se no TaskMate."}};function jt(t,e,s={}){return((Ht[t]||Ht.en)[e]??Ht.en[e]??e).replace(/\{(\w+)\}/g,(t,e)=>void 0===s[e]?`{${e}}`:String(s[e]))}function Wt(t){return String(t?.locale?.language||t?.language||"en").split(/[-_]/)[0].toLowerCase()}function Ft(t){if(t&&"system"!==t.time_format)return t.language||void 0}function Lt(t,e,s){const i={hour:"2-digit",minute:"2-digit",timeZone:s},n=function(t){switch(t?.time_format){case"12":return!0;case"24":default:return!1;case"language":case"system":return}}(e);return void 0!==n&&(i.hour12=n),!1===n&&(i.hourCycle="h23"),new Intl.DateTimeFormat(Ft(e),i).format(t)}function qt(t,e,s,i){return new Intl.DateTimeFormat(Ft(e),{...i,timeZone:s}).format(t)}function Vt(t){return String(t??"").trim().toLowerCase()}function Zt(t,e){const s=new Map;for(const t of e||[]){const e=Vt(t.summary);s.has(e)||s.set(e,[]),s.get(e).push(t)}const i=new Set;return{pairs:(t||[]).map(t=>{const e=s.get(Vt(t.summary)),n=e&&e.length?e.shift():null;return n&&i.add(n),{event:t,chore:n}}),matched:i}}function Gt(t){return new Set(Rt(t).map(t=>Vt(t.summary)))}function Kt(t,e,s){return{complete:e&&s.has(t.summary),ghost:Boolean(t.allDay)}}class Jt extends ot{static properties={model:{attribute:!1},now:{attribute:!1},tz:{attribute:!1},lang:{attribute:!1},locale:{attribute:!1},offsetDays:{attribute:!1},startOffset:{attribute:!1}};static styles=[dt,a`
      /* Metrics ported from mockups/b.html — .grid7, .gh, .cell, .chip, .bars. */
      .grid7 { display: grid; grid-template-columns: 92px repeat(7, 1fr); gap: 7px; align-items: start; }
      .grid7[data-narrow='true'] { grid-template-columns: 72px repeat(7, 1fr); gap: 4px; }

      .gh { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--fh-text-faint); text-align: center; padding-bottom: 9px; font-weight: 600; }
      .gh b { display: block; font-size: 24px; color: var(--fh-text); margin-top: 4px; letter-spacing: 0; }
      .gh.today b { color: var(--fh-now); }

      .rowlab { font-size: 16px; color: var(--fh-chore-text); display: flex; align-items: center; gap: 8px; padding-right: 6px; font-weight: 500; min-width: 0; min-height: 36px; }
      .rowlab span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .dot { width: 11px; height: 11px; border-radius: 50%; background: var(--pc); flex-shrink: 0; }

      .cell { background: var(--fh-cell, #171b24); border-radius: 8px; min-height: 62px; padding: 6px; display: flex; flex-direction: column; gap: 4px; }
      .cell.today { background: var(--fh-cell-today, #1b2130); box-shadow: inset 0 0 0 1px var(--fh-cell-today-edge, #2b3550); }
      /* A person with nothing on all week keeps a thin row rather than seven
         tall empty boxes. */
      .row-empty .cell { min-height: 36px; }

      .chip { background: var(--pc); color: var(--fh-bg); font-size: 13px; font-weight: 600; padding: 4px 7px; border-radius: 5px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .chip.ghost { background: transparent; color: var(--pc); box-shadow: inset 0 0 0 1.5px var(--pc); }
      .chip.complete { text-decoration: line-through; opacity: 0.45; }
      .chip.chores { background: transparent; color: var(--pc); box-shadow: inset 0 0 0 1.5px var(--pc); opacity: 0.85; text-decoration: none; }
      .chip.chores.complete { opacity: 0.45; text-decoration: line-through; }

      .bars-head { font-size: 11px; text-transform: uppercase; letter-spacing: 1.4px; color: var(--fh-text-dim); font-weight: 600; margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--fh-rule); }
      .bars { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-top: 12px; }
      .bars[data-narrow='true'] { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
      .bar-l { display: flex; justify-content: space-between; font-size: 15px; margin-bottom: 7px; color: var(--fh-chore-text); gap: 8px; }
      .bar-l b { color: var(--pc); font-family: var(--fh-mono); }
      .track { height: 8px; background: var(--fh-chip); border-radius: 4px; overflow: hidden; }
      .fill { height: 100%; background: var(--pc); border-radius: 4px; }
      .notice { grid-column: 1 / -1; }
    `];constructor(){super(),this._narrow=!1,this.lang="en",this.offsetDays=0,this.startOffset=0}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width<900;e!==this._narrow&&(this._narrow=e,this.requestUpdate())}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect()}_dow(t,e){return qt(t,this.locale,e,{weekday:"short"})}render(){if(!this.model)return L;const t=this.tz||"UTC",e=function(t,e,s=7,i=0){const n=[];for(let a=0;a<s;a+=1){const{start:s}=Ct(t,e,1,i+a),o=new Date(s.getTime()+432e5),r=wt(o,e);n.push({date:o,dayNum:r.day,isToday:Tt(o,t,e)})}return n}(this.now,t,7,this.startOffset||0),s=Boolean(this.offsetDays),i=e[0].date,n=function(t){const e=new Set;for(const s of t||[])if(!s.shared)for(const t of Gt(s))e.add(t);return e}(this.model.people);return W`
      <div class="grid7" data-narrow=${String(this._narrow)}>
        <div></div>
        ${e.map(e=>W`<div class="gh ${e.isToday?"today":""}">
            ${this._dow(e.date,t)}<b>${e.dayNum}</b>
          </div>`)}
        ${this.model.people.map(s=>this._personRow(s,e,t,n))}
      </div>
      <div class="bars-head">${function(t,e,s="en",i,n){return t?jt(s,"week_of",{date:qt(e,i,n,{day:"numeric",month:"long"})}):jt(s,"today")}(s?1:0,i,this.lang,this.locale,t)}</div>
      <div class="bars" data-narrow=${String(this._narrow)}>
        ${this.model.people.filter(t=>!t.shared).map(t=>this._bar(t,s))}
      </div>
    `}_personRow(t,e,s,i){const n=function(t,e,s){return e.map(e=>(t||[]).filter(t=>Tt(t.start,e.date,s)))}(t.events,e,s),a=new Set(Rt(t).filter(t=>t.done).map(t=>t.summary));const o=n.every(t=>0===t.length);return W`
      <div class="rowlab ${o?"row-empty":""}" style="--pc:${t.color}">
        <div class="dot"></div><span>${t.name}</span>
      </div>
      ${n.map((s,n)=>W`
          <div class="${o?"row-empty":""}" style="--pc:${t.color}">
            <div class="cell ${e[n].isToday?"today":""}">
              ${function(t,e,s,i,n=!0,a=null){const o=[];let r=0,l=0;for(const a of t||[])n&&e.has(Vt(a.summary))?(r+=1,s&&i.has(a.summary)&&(l+=1)):o.push({...Kt(a,s,i),summary:a.summary,collapsed:!1});return r&&s&&a?.total&&(r=a.total,l=a.done),r&&o.push({collapsed:!0,total:r,done:l,complete:s&&l===r,ghost:!1}),o}(s,i,e[n].isToday,a,!0,Nt(t)).map(t=>t.collapsed?W`<div class="chip chores ${t.complete?"complete":""}">
                    ${e[n].isToday?jt(this.lang,"chores_done",{done:t.done,total:t.total}):jt(this.lang,"n_chores",{n:t.total})}
                  </div>`:W`<div
                    class="chip ${t.ghost?"ghost":""} ${t.complete?"complete":""}"
                    title=${t.summary}
                  >${t.summary}</div>`)}
            </div>
          </div>
        `)}
    `}_bar(t,e){if(e){const e=(t.events||[]).length;return W`
        <div style="--pc:${t.color}">
          <div class="bar-l"><span>${t.name}</span><b>${jt(this.lang,"due",{n:e})}</b></div>
        </div>
      `}const{done:s,total:i,pct:n}=Nt(t);return W`
      <div style="--pc:${t.color}">
        <div class="bar-l"><span>${t.name}</span><b>${s}/${i}</b></div>
        <div class="track"><div class="fill" style="width:${n}%"></div></div>
      </div>
    `}}customElements.define("family-hub-week",Jt);class Yt{constructor(t){this.host=t,this.pending=new Map,this._onPageHide=()=>this.flush(),this._onVisibility=()=>{"hidden"===document.visibilityState&&this.flush()},t.addController(this)}hostConnected(){window.addEventListener("pagehide",this._onPageHide),document.addEventListener("visibilitychange",this._onVisibility)}hostDisconnected(){window.removeEventListener("pagehide",this._onPageHide),document.removeEventListener("visibilitychange",this._onVisibility),this.flush()}isPending(t,e){return this.pending.has(`${t}:${e}`)}tap(t,e){if(this.host.readOnly)return;const s=`${t}:${e}`,i=this.pending.get(s);if(i)return clearTimeout(i.timer),this.pending.delete(s),void this.host.requestUpdate();const n=Number(this.host.confirmWindow)||0;if(!n)return void this._fire(t,e);const a=setTimeout(()=>{this.pending.delete(s),this._fire(t,e)},1e3*n);this.pending.set(s,{timer:a,personId:t,choreId:e}),this.host.requestUpdate()}flush(){for(const t of this.pending.values())clearTimeout(t.timer),this._fire(t.personId,t.choreId);this.pending.clear()}_fire(t,e){this.host.dispatchEvent(new CustomEvent("chore-tap",{detail:{personId:t,choreId:e},bubbles:!0,composed:!0})),this.host.requestUpdate()}}function Qt(t,e,s,{inline:i=!1}={}){const n=i?"tap inline":"tap";if(!s.tappable)return W`<span class=${n}><span class="box done"></span></span>`;const a=t.isPending(e.id,s.id),o=s.done||a,r=t.host.lang||"en";return W`
    <button
      class=${n}
      role="checkbox"
      aria-checked=${o?"true":"false"}
      aria-label=${jt(r,"complete_for",{chore:s.summary,name:e.name})}
      @click=${()=>t.tap(e.id,s.id)}
      ?disabled=${t.host.readOnly}
    >
      <span class="box ${o?"done":""} ${a?"ring":""}"
        style="--fh-window:${t.host.confirmWindow}s"></span>
    </button>
  `}function Xt(t,e,{inline:s=!1}={}){const i=s?"badge inline-badge":"badge";return e.pending?W`<span class="${i} waiting">${jt(t,"waiting")}</span>`:e.overdue&&!e.done?W`<span class="${i} overdue">${jt(t,"overdue")}</span>`:L}function te(t,e,s){const i=t.isPending(e.id,s.id),n=s.done||i,a=t.host.lang||"en",o=["chore",n?"done":"",s.pending?"pending":"",s.overdue&&!n?"overdue":""].filter(Boolean).join(" ");return W`
    <div class=${o}>
      ${Qt(t,e,s)}
      <span class="name">${s.summary}</span>
      ${Xt(a,s)}
    </div>
  `}class ee extends ot{static properties={model:{attribute:!1},now:{attribute:!1},tz:{attribute:!1},lang:{attribute:!1},locale:{attribute:!1},confirmWindow:{attribute:!1},readOnly:{attribute:!1},inlineChores:{attribute:!1},hideChores:{attribute:!1},isToday:{attribute:!1},_expanded:{state:!0}};static styles=[dt,ht,a`
      /* Metrics ported from mockups/c.html — .split2, .ag, .agrow, .pcard. */
      .wrap { display: grid; grid-template-columns: 1.35fr 1fr; gap: 20px; }
      .wrap[data-narrow='true'] { grid-template-columns: 1fr; }

      .ag { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 8px 18px 14px; }
      .agrow { display: flex; gap: 15px; padding: 14px 0; border-bottom: 1px solid var(--fh-rule-soft); align-items: flex-start; }
      .agrow:last-child { border-bottom: none; }
      .agrow.open { cursor: pointer; }
      .agt { font-family: var(--fh-mono); font-size: 16px; color: var(--fh-text-soft); width: var(--agt-w, 64px); flex-shrink: 0; padding-top: 2px; font-weight: 500; white-space: nowrap; }
      .agbar { width: 4px; border-radius: 2px; background: var(--pc); align-self: stretch; flex-shrink: 0; }
      .agbody { min-width: 0; flex: 1; }
      .agn { font-size: 20px; color: var(--fh-text); font-weight: 500; line-height: 1.25; display: flex; align-items: flex-start; }
      .agn .agn-t { min-width: 0; }
      .agn .tap.inline { margin-top: -10px; }
      .agw { font-size: 14px; color: var(--pc); margin-top: 3px; font-weight: 600; }
      .agw .also { color: var(--fh-text-mute); font-weight: 500; }
      .detail { margin-top: 8px; font-size: 14px; color: var(--fh-text-mute); line-height: 1.45; white-space: pre-line; }
      .detail b { color: var(--fh-text); font-weight: 500; }
      .past { opacity: 0.45; }
      .empty { padding: 14px 0; color: var(--fh-text-dim); font-size: 16px; }

      .now { background: var(--fh-now); height: 2px; border-radius: 1px; margin: 3px 0; position: relative; }
      .now::before { content: ''; position: absolute; left: -4px; top: -3px; width: 8px; height: 8px; border-radius: 50%; background: var(--fh-now); }

      .pcard { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 14px 15px; margin-bottom: 11px; border-left: 4px solid var(--pc); }
      .phead { display: flex; align-items: center; gap: 13px; }
      .av { width: 40px; height: 40px; border-radius: 50%; background: var(--pc); color: var(--fh-bg); font-weight: 700; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; position: relative; }
      .av img { width: 100%; height: 100%; object-fit: cover; }
      .av ha-icon { --mdc-icon-size: 24px; }
      .pcard.alldone .av::after { content: '\\2713'; position: absolute; right: -2px; bottom: -2px; width: 18px; height: 18px; border-radius: 50%; background: var(--fh-surface); color: var(--pc); font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 2px var(--pc); }
      .nm { font-weight: 600; font-size: 18px; }
      .nextc { font-size: 14px; color: var(--fh-text-mute); margin-top: 2px; }
      .pcard.alldone .nextc { color: var(--pc); font-weight: 600; }
      .streak { font-size: 12px; color: var(--fh-text-mute); margin-top: 2px; }
      .pts { margin-left: auto; text-align: right; padding-left: 10px; }
      .pts b { display: block; font-size: 24px; color: var(--pc); font-family: var(--fh-mono); line-height: 1; }
      .pts span { font-size: 10px; color: var(--fh-text-faint); text-transform: uppercase; letter-spacing: 1px; }
      .pts .today { font-size: 12px; color: var(--fh-text-mute); margin-top: 3px; text-transform: none; letter-spacing: 0; }

      .chores { margin-top: 6px; border-top: 1px solid var(--fh-rule-soft); padding-top: 2px; }
    `];constructor(){super(),this._narrow=!1,this.isToday=!0,this.lang="en",this._expanded=new Set,this.ticks=new Yt(this)}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width<640;e!==this._narrow&&(this._narrow=e,this.requestUpdate())}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect()}flushPending(){this.ticks.flush()}_fmt(t){return Lt(t,this.locale,this.tz)}_toggle(t){const e=new Set(this._expanded);e.has(t)?e.delete(t):e.add(t),this._expanded=e}render(){if(!this.model)return L;const t=this.lang,e=new Map(this.model.people.map(t=>{return[t.id,(e=t,s=this.inlineChores,s?Zt(e.events,Rt(e)):{pairs:(e.events||[]).map(t=>({event:t,chore:null})),matched:new Set})];var e,s})),s=function(t,e=null){const s=[],i=new Map;for(const n of t){const t=e?.get(n.id)?.pairs||(n.events||[]).map(t=>({event:t,chore:null}));for(const{event:e,chore:a}of t){const t=e.id&&i.get(e.id);if(t&&!a){t.people.push(n);continue}const o={time:e.allDay?null:e.start,allDay:e.allDay,event:e,person:n,people:[n],chore:a};s.push(o),e.id&&!i.has(e.id)&&i.set(e.id,o)}}return s.sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.allDay?0:t.time-e.time)}(this.model.people,e),i=this.isToday?function(t,e){const s=t.findIndex(t=>!t.allDay);if(-1===s)return-1;if(e<t[s].time)return-1;let i=t.length;for(let n=s;n<t.length;n+=1)if(t[n].time>e){i=n;break}return i}(s,this.now):-1,n=[];s.forEach((e,s)=>{s===i&&n.push(W`<div class="now"></div>`);const a=this.isToday&&!e.allDay&&e.time<this.now,o=this._expanded.has(e.event.id),r=e.people.slice(1);n.push(W`
        <div class="agrow open ${a?"past":""}" style="--pc:${e.person.color}"
          @click=${t=>{t.target.closest("button")||this._toggle(e.event.id)}}>
          <div class="agt">${e.allDay?jt(t,"all_day"):this._fmt(e.time)}</div>
          <div class="agbar"></div>
          <div class="agbody">
            <div class="agn">
              ${e.chore?this._eventBox(e.person,e.chore):L}<span class="agn-t">${e.event.summary}</span>
            </div>
            <div class="agw">
              ${e.person.name}${r.length?W`<span class="also"> · ${r.map(t=>t.name).join(" · ")}</span>`:L}${e.event.location?W` · ${e.event.location}`:L}
            </div>
            ${o?this._detail(e.event):L}
          </div>
        </div>
      `)}),this.isToday&&i===s.length&&n.push(W`<div class="now"></div>`);const a=this.model.people.filter(t=>!t.shared),o=this._fmt(new Date(2e3,0,1,22,0)).length>5;return W`
      <div class="wrap" data-narrow=${String(this._narrow)}>
        <div>
          <div class="sec-l">${jt(t,"today")}</div>
          <div class="ag" style="--agt-w:${o?"84px":"64px"}">
            ${n.length?n:W`<div class="empty">${jt(t,"nothing_scheduled")}</div>`}
          </div>
        </div>
        <div>
          <div class="sec-l">${jt(t,"chores_points")}</div>
          ${a.map(t=>this._person(t,e.get(t.id)))}
        </div>
      </div>
    `}_detail(t){const e=t.allDay?jt(this.lang,"all_day"):`${this._fmt(t.start)}${t.end&&+t.end!==+t.start?` – ${this._fmt(t.end)}`:""}`;return W`
      <div class="detail">
        <b>${e}</b>${t.location?W` · ${t.location}`:L}
        ${t.description?W`<div>${t.description}</div>`:L}
      </div>
    `}_avatar(t){return t.picture?W`<div class="av"><img src=${t.picture} alt="" /></div>`:t.icon?W`<div class="av"><ha-icon icon=${t.icon}></ha-icon></div>`:W`<div class="av">${t.initials}</div>`}_person(t,e){const s=e?.matched||new Set,i=Rt(t),n=i.filter(t=>!t.done),a=Nt(t),o=Boolean(t.todo)&&a.total>0&&a.done===a.total,r=this.hideChores?[]:i.filter(t=>!s.has(t));return W`
      <div class="pcard ${o?"alldone":""}" style="--pc:${t.color}">
        <div class="phead">
          ${this._avatar(t)}
          <div>
            <div class="nm">${t.name}</div>
            <div class="nextc">${this._summary(t,n)}</div>
            ${t.points?.streak>1?W`<div class="streak">🔥 ${jt(this.lang,"streak",{n:t.points.streak})}</div>`:L}
          </div>
          ${this._points(t)}
        </div>
        ${(t.failures||[]).length?W`<div class="notice">${jt(this.lang,"cant_read",{entities:t.failures.join(", ")})}</div>`:L}
        ${r.length?W`<div class="chores">${r.map(e=>te(this.ticks,t,e))}</div>`:L}
      </div>
    `}_summary(t,e){const s=this.lang||"en";if(!t.todo)return jt(s,"no_chore_list");if(this.inlineChores){const{done:e,total:i}=Nt(t);return i?jt(s,"done_of",{done:e,total:i}):jt(s,"all_done")}return e.length?jt(s,"next",{chore:e[0].summary}):jt(s,"all_done")}_points(t){return t.points&&null!=t.points.balance?W`
      <div class="pts">
        <b>${t.points.balance}</b>
        <span>${t.points.unit}</span>
        ${null==t.points.earnedToday?L:W`<div class="today">
              ${t.points.earnedToday} today${t.points.pendingToday?W` · ${t.points.pendingToday} pending`:L}
            </div>`}
      </div>
    `:L}_eventBox(t,e){return W`${Qt(this.ticks,t,e,{inline:!0})}${Xt(this.lang,e,{inline:!0})}`}}customElements.define("family-hub-agenda",ee);class se extends ot{static properties={model:{attribute:!1},tz:{attribute:!1},lang:{attribute:!1},locale:{attribute:!1},readOnly:{attribute:!1},confirmWindow:{attribute:!1},inlineChores:{attribute:!1},hideChores:{attribute:!1},_expanded:{state:!0}};static styles=[dt,ht,a`
      /* Metrics ported from mockups/a.html — .cols, .col, .ev, .chore. */
      /* align-items: start lets a person with nothing on sit short instead of
         stretching an empty column to the tallest one. */
      .cols { display: grid; grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr)); gap: 15px; align-items: start; }
      .col { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 15px; border-top: 3px solid var(--pc); min-width: 0; }
      .who { display: flex; align-items: center; gap: 10px; margin-bottom: 13px; }
      .av { width: 38px; height: 38px; border-radius: 50%; background: var(--pc); color: var(--fh-bg); font-weight: 700; font-size: 17px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; position: relative; }
      .av img { width: 100%; height: 100%; object-fit: cover; }
      .av ha-icon { --mdc-icon-size: 22px; }
      .col.alldone .av::after { content: '\\2713'; position: absolute; right: -2px; bottom: -2px; width: 16px; height: 16px; border-radius: 50%; background: var(--fh-surface); color: var(--pc); font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 2px var(--pc); }
      .nm { font-weight: 600; font-size: 19px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .pts { margin-left: auto; font-family: var(--fh-mono); font-size: 16px; color: var(--pc); flex-shrink: 0; text-align: right; line-height: 1.1; }
      .pts span { display: block; font-size: 10px; color: var(--fh-text-faint); text-transform: uppercase; letter-spacing: 1px; font-family: var(--fh-font); }

      .ev { padding: 9px 0; cursor: pointer; }
      .ev-t { font-size: 13px; color: var(--pc); font-weight: 600; font-family: var(--fh-mono); letter-spacing: 0.3px; }
      .ev-n { font-size: 17px; color: var(--fh-chore-text); margin-top: 2px; line-height: 1.3; display: flex; align-items: flex-start; }
      .ev-n .ev-t2 { min-width: 0; }
      .ev-n .tap.inline { margin-top: -11px; }
      .detail { margin-top: 6px; font-size: 13px; color: var(--fh-text-mute); line-height: 1.45; white-space: pre-line; }
      .none { font-size: 15px; color: var(--fh-text-dim); padding: 9px 0; }

      .divider { font-size: 11px; text-transform: uppercase; letter-spacing: 1.4px; color: var(--fh-text-dim); margin: 15px 0 9px; font-weight: 600; }
      .col.alldone .divider { color: var(--pc); }
    `];constructor(){super(),this._cols=4,this.lang="en",this._expanded=new Set,this.ticks=new Yt(this)}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width,s=e<520?1:e<760?2:e<1040?3:4;s!==this._cols&&(this._cols=s,this.requestUpdate())}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect()}flushPending(){this.ticks.flush()}_toggle(t){const e=new Set(this._expanded);e.has(t)?e.delete(t):e.add(t),this._expanded=e}render(){if(!this.model)return L;const t=this.tz||"UTC";return W`
      <div class="cols" style="--cols:${Math.min(this._cols,this.model.people.length||1)}">
        ${this.model.people.map(e=>this._column(function(t,e=!1,s=!1){const i=Rt(t),{pairs:n,matched:a}=e?Zt(t.events,i):{pairs:(t.events||[]).map(t=>({event:t,chore:null})),matched:new Set},o=e?i.filter(t=>!a.has(t)):i,r=s?[]:o,l=!s&&(e?r.length>0:Boolean(t.todo)||r.length>0);return{person:t,events:n,chores:r,outstanding:r.filter(t=>!t.done).length,hasChores:l}}(e,this.inlineChores,this.hideChores),t))}
      </div>
    `}_avatar(t){return t.picture?W`<div class="av"><img src=${t.picture} alt="" /></div>`:t.icon?W`<div class="av"><ha-icon icon=${t.icon}></ha-icon></div>`:W`<div class="av">${t.initials}</div>`}_column(t,e){const s=t.person,i=this.lang,n=s.progress,a=Boolean(s.todo)&&n&&n.total>0&&n.done===n.total;return W`
      <div class="col ${a?"alldone":""}" style="--pc:${s.color}">
        <div class="who">
          ${this._avatar(s)}
          <div class="nm">${s.name}</div>
          ${s.points&&null!=s.points.balance?W`<div class="pts">${s.points.balance}<span>${s.points.unit}</span></div>`:L}
        </div>

        ${(s.failures||[]).length?W`<div class="notice">${jt(i,"cant_read",{entities:s.failures.join(", ")})}</div>`:L}

        ${t.events.length?t.events.map(({event:t,chore:i})=>W`<div class="ev"
                @click=${e=>{e.target.closest("button")||this._toggle(t.id)}}>
                <div class="ev-t">${function(t,e,s={time_format:"24"}){if(t.allDay)return jt(s?.language?.split("-")[0]||"en","all_day");const i=Lt(t.start,s,e);return t.end&&+t.end!==+t.start?`${i} – ${Lt(t.end,s,e)}`:i}(t,e,this.locale)}</div>
                <div class="ev-n">
                  ${i?this._eventBox(s,i):L}<span class="ev-t2">${t.summary}</span>
                </div>
                ${this._expanded.has(t.id)&&(t.location||t.description)?W`<div class="detail">${t.location?W`<div>${t.location}</div>`:L}${t.description?W`<div>${t.description}</div>`:L}</div>`:L}
              </div>`):W`<div class="none">${jt(i,"nothing_on")}</div>`}

        ${t.hasChores?W`
              <div class="divider">
                ${jt(i,"chores")} · ${t.outstanding?jt(i,"to_do",{n:t.outstanding}):jt(i,"all_done")}
              </div>
              ${t.chores.map(t=>te(this.ticks,s,t))}
            `:L}
      </div>
    `}_eventBox(t,e){return W`${Qt(this.ticks,t,e,{inline:!0})}${Xt(this.lang,e,{inline:!0})}`}}function ie(t,e){const{hour:s}=wt(t,e);return s<12?"morning":s<18?"afternoon":"evening"}customElements.define("family-hub-columns",se);const ne=["morning","afternoon","evening","chores"];class ae extends ot{static properties={model:{attribute:!1},now:{attribute:!1},tz:{attribute:!1},lang:{attribute:!1},readOnly:{attribute:!1},confirmWindow:{attribute:!1},isToday:{attribute:!1}};static styles=[dt,ht,a`
      .cols { display: grid; grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr)); gap: 15px; align-items: start; }
      .col { background: var(--fh-surface); border-radius: var(--fh-radius-inner); padding: 15px; border-top: 3px solid var(--pc); min-width: 0; }
      .who { display: flex; align-items: center; gap: 10px; }
      .av { width: 38px; height: 38px; border-radius: 50%; background: var(--pc); color: var(--fh-bg); font-weight: 700; font-size: 17px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; position: relative; }
      .av img { width: 100%; height: 100%; object-fit: cover; }
      .av ha-icon { --mdc-icon-size: 22px; }
      .col.alldone .av::after { content: '\\2713'; position: absolute; right: -2px; bottom: -2px; width: 16px; height: 16px; border-radius: 50%; background: var(--fh-surface); color: var(--pc); font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 2px var(--pc); }
      .nm { font-weight: 600; font-size: 19px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .count { margin-left: auto; font-family: var(--fh-mono); color: var(--pc); font-weight: 600; flex-shrink: 0; }

      .bar { height: 4px; border-radius: 2px; background: var(--fh-chip); margin: 10px 0 16px; overflow: hidden; }
      .bar span { display: block; height: 100%; background: var(--pc); }

      .grp { margin-bottom: 14px; }
      .grp.past { opacity: 0.45; }
      .grp-l { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--fh-text-faint); margin-bottom: 6px; font-weight: 600; }
      .chore { padding: 3px 0; }
      .none { font-size: 15px; color: var(--fh-text-dim); padding: 9px 0; }
      .alldone .none { color: var(--pc); font-weight: 600; }
    `];constructor(){super(),this._cols=4,this.isToday=!0,this.lang="en",this.ticks=new Yt(this)}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width,s=e<520?1:e<760?2:e<1040?3:4;s!==this._cols&&(this._cols=s,this.requestUpdate())}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect()}flushPending(){this.ticks.flush()}render(){if(!this.model)return L;const t=this.isToday?ie(this.now||new Date,this.tz||"UTC"):null,e=this.model.people.filter(t=>!t.shared);return W`
      <div class="cols" style="--cols:${Math.min(this._cols,e.length||1)}">
        ${e.map(e=>this._column(e,t))}
      </div>
    `}_avatar(t){return t.picture?W`<div class="av"><img src=${t.picture} alt="" /></div>`:t.icon?W`<div class="av"><ha-icon icon=${t.icon}></ha-icon></div>`:W`<div class="av">${t.initials}</div>`}_column(t,e){const{done:s,total:i,pct:n}=Nt(t),a=function(t,e="en"){return ne.filter(e=>(t[e]||[]).length>0).map(s=>({key:s,label:jt(e,s),tasks:t[s]}))}(function(t,e){const s=Rt(t).map(t=>({...t,start:null})),{pairs:i}=Zt(t.events,s);for(const{event:t,chore:e}of i)e&&(e.start=t.start);for(const t of s)!t.start&&t.due&&t.dueHasTime&&(t.start=t.due);const n={morning:[],afternoon:[],evening:[],chores:[]};for(const t of s)n[t.start?ie(t.start,e):"chores"].push(t);for(const t of["morning","afternoon","evening"])n[t].sort((t,e)=>t.start-e.start);return n}(t,this.tz||"UTC"),this.lang),o=i>0&&s===i;return W`
      <div class="col ${o?"alldone":""}" style="--pc:${t.color}">
        <div class="who">
          ${this._avatar(t)}
          <div class="nm">${t.name}</div>
          <div class="count">${s}/${i}</div>
        </div>
        <div class="bar"><span style="width:${n}%"></span></div>
        ${(t.failures||[]).length?W`<div class="notice">${jt(this.lang,"cant_read",{entities:t.failures.join(", ")})}</div>`:L}
        ${a.length?a.map(s=>this._group(t,s,e)):W`<div class="none">${jt(this.lang,o?"all_done":"no_tasks")}</div>`}
      </div>
    `}_group(t,e,s){const i=null!==s&&"chores"!==e.key&&ne.indexOf(e.key)<ne.indexOf(s);return W`
      <div class="grp ${i?"past":""}">
        <div class="grp-l">${e.label}</div>
        ${e.tasks.map(e=>te(this.ticks,t,e))}
      </div>
    `}}customElements.define("family-hub-tasks",ae);const oe=(t,e,s)=>Boolean(e&&(t?.states?.[e]?.attributes?.supported_features||0)&s);function re(t,e){return(e.people||[]).flatMap(t=>t.calendars||[]).filter(e=>oe(t,e,1))}function le(t,e){const s=[];return function(t,e){return(e.people||[]).map(t=>t.todo).filter(e=>oe(t,e,1))}(t,e).length&&s.push("todo"),re(t,e).length&&s.push("calendar"),e.taskmateChores&&t?.user?.is_admin&&s.push("chore"),s}function de(t,e){const[s,i,n]=t.split("-").map(Number);return new Date(Date.UTC(s,i-1,n+e)).toISOString().slice(0,10)}async function he(t,e){try{return await t.callService("calendar","create_event",function({entityId:t,title:e,date:s,allDay:i,start:n,end:a,description:o,location:r}){const l={entity_id:t,summary:e};if(o&&(l.description=o),r&&(l.location=r),i||!n)return l.start_date=s,l.end_date=de(s,1),l;if(l.start_date_time=`${s}T${n}:00`,a)return l.end_date_time=`${s}T${a}:00`,l;const[d,h]=n.split(":").map(Number),c=d+1,p=c>23?de(s,1):s,u=String(c%24).padStart(2,"0"),f=String(h).padStart(2,"0");return l.end_date_time=`${p}T${u}:${f}:00`,l}(e)),{ok:!0}}catch(t){return At(`add:event:${e.entityId}`,`could not add to ${e.entityId}`,t),{ok:!1,error:t?.message||String(t)}}}const ce={todo:"todo_task",calendar:"calendar_event",chore:"taskmate_chore"};class pe extends ot{static properties={hass:{attribute:!1},config:{attribute:!1},date:{attribute:!1},lang:{attribute:!1},open:{type:Boolean},_type:{state:!0},_busy:{state:!0},_error:{state:!0},_fields:{state:!0}};static styles=[dt,a`
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
      .hintline { font-size: 12px; color: var(--fh-text-mute); margin-top: 6px; line-height: 1.4; }
      .scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: grid; place-items: center; z-index: 9; }
    `];constructor(){super(),this.open=!1,this.lang="en",this._reset()}_t(t,e){return jt(this.lang||"en",t,e)}_reset(){this._type=null,this._busy=!1,this._error="",this._fields={}}show(){this._reset();const t=le(this.hass,this.config);if(1===t.length){if("chore"===t[0])return this._openTaskMate();this._type=t[0]}this.open=!0}_openTaskMate(){this._close(),window.history.pushState(null,"","/taskmate-admin"),window.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0}))}_close(){this.open=!1,this._reset(),this.dispatchEvent(new CustomEvent("closed",{bubbles:!0,composed:!0}))}_scrimTap(t){t.target===t.currentTarget&&(Object.keys(this._fields).length||this._close())}_set(t,e){this._fields={...this._fields,[t]:e}}_isoDate(){const t=this.date||new Date;return new Intl.DateTimeFormat("en-CA",{timeZone:this.hass?.config?.time_zone||"UTC",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}async _submit(){this._busy=!0,this._error="";const t=this._fields;let e;e="todo"===this._type?await async function(t,e){try{return await t.callService("todo","add_item",function({entityId:t,title:e,due:s}){const i={entity_id:t,item:e};return s&&(s.includes("T")?i.due_datetime=s:i.due_date=s),i}(e)),{ok:!0}}catch(t){return At(`add:todo:${e.entityId}`,`could not add to ${e.entityId}`,t),{ok:!1,error:t?.message||String(t)}}}(this.hass,{entityId:t.entityId,title:t.title,due:t.due}):await he(this.hass,{entityId:t.entityId,title:t.title,date:t.date||this._isoDate(),allDay:Boolean(t.allDay),start:t.start,end:t.end}),this._busy=!1,e.ok?(this.dispatchEvent(new CustomEvent("created",{bubbles:!0,composed:!0})),this._close()):this._error=e.error}render(){return this.open?W`
      <div class="scrim" @click=${t=>this._scrimTap(t)}>
        <div class="sheet" role="dialog" aria-modal="true">
          ${this._type?this._form():this._picker()}
        </div>
      </div>
    `:L}_picker(){const t=le(this.hass,this.config);return W`
      <h2>${this._t("add")}</h2>
      <div class="types">
        ${t.map(t=>W`<button class="type"
            @click=${()=>"chore"===t?this._openTaskMate():this._type=t}
          >${this._t(ce[t])}${"chore"===t?W`<span class="hint">${this._t("opens_taskmate")}</span>`:L}</button>`)}
      </div>
      <div class="actions">
        <button class="btn cancel" @click=${()=>this._close()}>${this._t("cancel")}</button>
      </div>
    `}_form(){const t="todo"===this._type?this._todoForm():this._eventForm(),e=Boolean(this._fields.title&&this._fields.entityId);return W`
      <h2>${this._t(ce[this._type])}</h2>
      ${t}
      ${this._error?W`<div class="err">${this._error}</div>`:L}
      <div class="actions">
        <button class="btn cancel" @click=${()=>this._close()} ?disabled=${this._busy}>${this._t("cancel")}</button>
        <button class="btn go" @click=${()=>this._submit()} ?disabled=${this._busy||!e}>
          ${this._busy?this._t("adding"):this._t("add")}
        </button>
      </div>
    `}_entitySelect(t,e){return W`
      <label>${e}</label>
      <select @change=${t=>this._set("entityId",t.target.value)}>
        <option value="">${this._t("choose")}</option>
        ${t.map(t=>W`<option value=${t}>
            ${this.hass.states[t]?.attributes?.friendly_name||t}
          </option>`)}
      </select>
    `}_todoForm(){const t=(e=this.hass,(this.config.people||[]).map(t=>t.todo).filter((t,e,s)=>t&&s.indexOf(t)===e).map(t=>({id:t,canCreate:oe(e,t,1)})));var e;const s=t.filter(t=>!t.canCreate),i=this._fields.entityId;return W`
      <label>${this._t("list")}</label>
      <select @change=${t=>this._set("entityId",t.target.value)}>
        <option value="">${this._t("choose")}</option>
        ${t.map(t=>W`<option value=${t.id} ?disabled=${!t.canCreate}>
            ${this.hass.states[t.id]?.attributes?.friendly_name||t.id}${t.canCreate?"":` — ${this._t("add_in_taskmate")}`}
          </option>`)}
      </select>
      ${s.length?W`<div class="hintline">
            ${1===s.length?this._t("list_blocked"):this._t("lists_blocked",{n:s.length})}
          </div>`:L}
      <label>${this._t("task")}</label>
      <input type="text" @input=${t=>this._set("title",t.target.value)} />
      ${i&&function(t,e){return oe(t,e,16)}(this.hass,i)?W`<label>${this._t("due_optional")}</label>
            <input type="date" @input=${t=>this._set("due",t.target.value)} />`:L}
    `}_eventForm(){return W`
      ${this._entitySelect(re(this.hass,this.config),this._t("calendar"))}
      <label>${this._t("event")}</label>
      <input type="text" @input=${t=>this._set("title",t.target.value)} />
      <label>${this._t("date")}</label>
      <input type="date" .value=${this._fields.date??this._isoDate()}
        @input=${t=>this._set("date",t.target.value)} />
      <div class="check">
        <input type="checkbox" id="allday" @change=${t=>this._set("allDay",t.target.checked)} />
        <label for="allday" style="margin:0">${this._t("all_day")}</label>
      </div>
      ${this._fields.allDay?L:W`<div class="row">
            <div>
              <label>${this._t("start")}</label>
              <input type="time" @input=${t=>this._set("start",t.target.value)} />
            </div>
            <div>
              <label>${this._t("end_optional")}</label>
              <input type="time" @input=${t=>this._set("end",t.target.value)} />
            </div>
          </div>`}
    `}}function ue(t,e,s){const i=Object.keys(t).filter(t=>t.startsWith("todo."));if(s?.endsWith(" Points")){const e=s.slice(0,-7),n=i.find(s=>t[s]?.attributes?.friendly_name===e);if(n)return n}const n=`todo.${e.replace(/^sensor\./,"").replace(/_(points|stats)$/,"")}`;return t[n]?n:null}function fe(t,e=[]){const s=t?.states;if(!s)return[];const i=new Set((e||[]).map(t=>String(t.name||"").trim().toLowerCase())),n=[];let a=(e||[]).length;for(const[t,e]of function(t){const e=new Map;for(const[s,i]of Object.entries(t)){if(!s.startsWith("sensor."))continue;const t=i?.attributes?.child_name;if(!t)continue;const n=e.get(t);(!n||s.endsWith("_points")&&!n.endsWith("_points"))&&e.set(t,s)}return e}(s))i.has(t.trim().toLowerCase())||(n.push({name:t,color:ct[a%ct.length],calendars:[],todo:ue(s,e,s[e]?.attributes?.friendly_name),points:e}),a+=1);return n}customElements.define("family-hub-add-dialog",pe);class me extends ot{static properties={hass:{attribute:!1},_config:{state:!0},_proposed:{state:!0},_calInfo:{state:!0}};static styles=a`
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
    /* A plain multi-select over nine similarly-named calendars made it far too
       easy to replace a selection instead of extending it, with no visible
       record of what was chosen. */
    .cals { border: 1px solid var(--divider-color); border-radius: 8px; max-height: 168px; overflow-y: auto; padding: 4px 6px; }
    .cal { display: flex; align-items: center; gap: 8px; min-height: 34px; font-size: 14px; }
    .cal input { width: 18px; min-height: 18px; flex: none; }
    .cal .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .flag { font-size: 12px; color: var(--warning-color, #b8860b); flex-shrink: 0; }
    .flag.bad { color: var(--error-color, #d64545); }
    .calsum { font-size: 12px; color: var(--secondary-text-color); margin-top: 4px; }
  `;setConfig(t){this._config={...t},this._proposed=null,this._calInfo=this._calInfo||{},this._probe()}async _probe(){if(!this.hass)return;const t=[...new Set([...(this._config?.people||[]).flatMap(t=>t.calendars||[]),...[].concat(this._config?.shared_calendars||[])])],e=t.filter(t=>!this._calInfo[t]);if(!e.length)return;const s=await async function(t,e,s=new Date,i="UTC"){const{start:n,end:a}=Ct(s,i,7),o=`start=${encodeURIComponent(n.toISOString())}&end=${encodeURIComponent(a.toISOString())}`,r={};return await Promise.all((e||[]).map(async e=>{try{const s=await t.callApi("GET",`calendars/${encodeURIComponent(e)}?${o}`);r[e]={count:(s||[]).length}}catch(t){r[e]={error:t?.message||String(t)}}})),r}(this.hass,e,new Date,this.hass.config?.time_zone||"UTC");this._calInfo={...this._calInfo,...s}}_errors(t){const e={},s=new Set;return(t.people||[]).forEach((t,i)=>{t.name?s.has(t.name.trim().toLowerCase())?e[i]="Duplicate name":(t.calendars||[]).length||t.todo||(e[i]="Needs a calendar or a to-do list"):e[i]="Needs a name",t.name&&s.add(t.name.trim().toLowerCase())}),(t.people||[]).length||(e.card="Add at least one person"),e}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_apply(t){this._emit({...this._config,...t})}_detectedChoresSensor(){return this.hass&&Object.keys(this.hass.states).find(t=>t.startsWith("sensor.")&&Array.isArray(this.hass.states[t].attributes?.todays_completions))||null}_setCard(t,e){const s={...this._config};""===e||null==e?delete s[t]:s[t]=e,this._emit(s)}_setHeader(t,e){const s={...this._config.header||{}};""===e||null===e?delete s[t]:s[t]=e,this._emit({...this._config,header:s})}_setPerson(t,e,s){const i=[...this._config.people||[]],n={...i[t]};""===s||null===s?delete n[e]:n[e]=s,i[t]=n,this._emit({...this._config,people:i})}_toggleCalendar(t,e,s){const i=this._config.people[t].calendars||[],n=s?[...i,e]:i.filter(t=>t!==e);this._setPerson(t,"calendars",n.length?n:null),this._probe()}_toggleShared(t,e){const s=[].concat(this._config.shared_calendars||[]),i=e?[...s,t]:s.filter(e=>e!==t);this._setCard("shared_calendars",i.length?i:null),this._probe()}_addPerson(){const t=[...this._config.people||[]];t.push({name:"",color:ct[t.length%ct.length]}),this._emit({...this._config,people:t})}_removePerson(t){const e=(this._config.people||[]).filter((e,s)=>s!==t);this._emit({...this._config,people:e})}_movePerson(t,e){const s=[...this._config.people||[]],i=t+e;i<0||i>=s.length||([s[t],s[i]]=[s[i],s[t]],this._emit({...this._config,people:s}))}_detect(){this._proposed=fe(this.hass,this._config.people||[])}_acceptProposed(){const t=[...this._config.people||[],...this._proposed];this._proposed=null,this._emit({...this._config,people:t})}_entities(t){return Object.keys(this.hass?.states||{}).filter(e=>e.startsWith(t)).sort()}_select(t,e,s,i,{blank:n="None"}={}){return W`
      <label>${t}
        <select @change=${t=>i(t.target.value)}>
          <option value="">${n}</option>
          ${s.map(t=>W`<option value=${t} ?selected=${t===e}>
              ${this.hass?.states?.[t]?.attributes?.friendly_name||t}
            </option>`)}
        </select>
      </label>
    `}render(){if(!this._config)return L;const t=this._config,e=this._errors(t);return W`
      <div class="group row">
        <label>View
          <select @change=${t=>this._setCard("view",t.target.value)}>
            ${["agenda","week","columns"].map(e=>W`<option value=${e} ?selected=${(t.view||"agenda")===e}>${e}</option>`)}
          </select>
        </label>
        <label>Theme
          <select @change=${t=>this._setCard("theme",t.target.value)}>
            ${["auto","dark","light"].map(e=>W`<option value=${e} ?selected=${(t.theme||"auto")===e}>${e}</option>`)}
          </select>
        </label>
        <label>Chores shown
          <select @change=${t=>this._setCard("chore_filter",t.target.value)}>
            ${["today","all"].map(e=>W`<option value=${e} ?selected=${(t.chore_filter||"today")===e}>${e}</option>`)}
          </select>
        </label>
        <label>Week starts
          <select @change=${t=>this._setCard("week_start","monday"===t.target.value?"":t.target.value)}>
            ${["monday","sunday","today"].map(e=>W`<option value=${e} ?selected=${(t.week_start||"monday")===e}>${e}</option>`)}
          </select>
        </label>
        <label>Tick chores on their event
          <input type="checkbox" .checked=${!1!==t.inline_chores&&!t.tabs}
            ?disabled=${Boolean(t.tabs)}
            @change=${t=>this._setCard("inline_chores",!!t.target.checked&&"")} />
        </label>
        <label>Calendar / Tasks tabs
          <input type="checkbox" .checked=${Boolean(t.tabs)}
            @change=${t=>this._setCard("tabs",t.target.checked)} />
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
        <label>Completed items shown
          <input type="number" min="0" .value=${String(t.max_completed??3)}
            @change=${t=>this._setCard("max_completed",Number(t.target.value))} />
        </label>
      </div>

      <div class="group row">
        ${this._select("Weather",t.header?.weather,this._entities("weather."),t=>this._setHeader("weather",t))}
        ${this._select("TaskMate chores sensor",t.taskmate_chores,this._entities("sensor."),t=>this._setCard("taskmate_chores",t))}
      </div>
      ${this._choresSuggestion(t)}

      <h3>Shared calendars</h3>
      <div class="muted" style="margin-bottom:6px">
        Events for the whole family, shown once in a neutral colour rather than under each person.
      </div>
      <div class="cals">
        ${this._entities("calendar.").map(e=>this._sharedRow(e,[].concat(t.shared_calendars||[]).includes(e)))}
      </div>
      ${[].concat(t.shared_calendars||[]).length?W`<div class="row" style="margin-top:8px">
            <label>Shown as
              <input type="text" .value=${t.shared_name||""} placeholder="Family"
                @input=${t=>this._setCard("shared_name",t.target.value)} />
            </label>
            <label style="flex:0 0 70px">Colour
              <input type="color" .value=${t.shared_color||"#9AA3B8"}
                @change=${t=>this._setCard("shared_color",t.target.value)} />
            </label>
          </div>`:L}

      <h3>People</h3>
      ${e.card?W`<div class="err">${e.card}</div>`:L}
      ${this._detectBlock()}
      ${(t.people||[]).map((t,s)=>this._personRow(t,s,e[s]))}
      <button @click=${()=>this._addPerson()}>Add person</button>
    `}_choresSuggestion(t){const e=this._detectedChoresSensor();return e&&t.taskmate_chores!==e?W`<div class="detect">
      TaskMate detected: <code>${e}</code>
      <button style="margin-left:8px" @click=${()=>this._apply({taskmate_chores:e})}>Use it</button>
    </div>`:L}_detectBlock(){return this._proposed?.length?W`
        <div class="detect">
          <div>Found ${this._proposed.length} TaskMate ${1===this._proposed.length?"child":"children"}:
            <b>${this._proposed.map(t=>t.name).join(", ")}</b></div>
          <div class="muted">Check the entities after adding — the to-do list is matched by name.</div>
          <div class="row" style="margin-top:8px">
            <button class="primary" @click=${()=>this._acceptProposed()}>Add them</button>
            <button @click=${()=>{this._proposed=null}}>Dismiss</button>
          </div>
        </div>
      `:this._proposed?W`<div class="detect muted">
        No new TaskMate children found.
        <button style="margin-left:8px" @click=${()=>{this._proposed=null}}>OK</button>
      </div>`:W`<div class="detect">
      <button @click=${()=>this._detect()}>Detect people</button>
      <span class="muted"> — finds TaskMate children and wires their entities</span>
    </div>`}_sharedRow(t,e){const s=e?this._calInfo?.[t]:null;return W`
      <div class="cal">
        <input type="checkbox" id=${`shared-${t}`} .checked=${e}
          @change=${e=>this._toggleShared(t,e.target.checked)} />
        <label class="name" for=${`shared-${t}`} style="margin:0">
          ${this.hass?.states?.[t]?.attributes?.friendly_name||t}
        </label>
        ${s?.error?W`<span class="flag bad">unreadable</span>`:s&&0===s.count?W`<span class="flag">no events this week</span>`:L}
      </div>
    `}_calRow(t,e,s){const i=s?this._calInfo?.[e]:null;return W`
      <div class="cal">
        <input type="checkbox" id=${`cal-${t}-${e}`} .checked=${s}
          @change=${s=>this._toggleCalendar(t,e,s.target.checked)} />
        <label class="name" for=${`cal-${t}-${e}`} style="margin:0">
          ${this.hass?.states?.[e]?.attributes?.friendly_name||e}
        </label>
        ${i?.error?W`<span class="flag bad">unreadable</span>`:i&&0===i.count?W`<span class="flag">no events this week</span>`:L}
      </div>
    `}_personRow(t,e,s){const i=Array.isArray(t.calendars)?t.calendars:t.calendars?[t.calendars]:[];return W`
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
            <input type="color" .value=${t.color||ct[e%ct.length]}
              @change=${t=>this._setPerson(e,"color",t.target.value)} />
          </label>
        </div>
        <div class="row">
          ${this._select("To-do list",t.todo,this._entities("todo."),t=>this._setPerson(e,"todo",t))}
          ${this._select("Points sensor",t.points,this._entities("sensor."),t=>this._setPerson(e,"points",t))}
        </div>
        <div class="row">
          ${this._select("Person entity (for the photo)",t.person,this._entities("person."),t=>this._setPerson(e,"person",t))}
          <label>Picture URL
            <input type="text" .value=${t.picture||""} placeholder="/local/ana.jpg"
              @input=${t=>this._setPerson(e,"picture",t.target.value)} />
          </label>
        </div>
        <label>Calendars</label>
        <div class="cals">
          ${this._entities("calendar.").map(t=>this._calRow(e,t,i.includes(t)))}
        </div>
        <div class="calsum">
          ${i.length?`${i.length} selected`:"None selected"}
        </div>
        ${s?W`<div class="err">${s}</div>`:L}
      </div>
    `}}customElements.define("family-hub-card-editor",me);const ge=/^[a-z_]+\.[a-z0-9_]+$/,_e=["agenda","week","columns"],ve=864e5,be={"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",exceptional:"mdi:alert-circle-outline",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant"};function ye(t,e){if("dark"===e||"light"===e)return e;const s=t?.themes?.darkMode;return"boolean"==typeof s?s?"dark":"light":"undefined"!=typeof window&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}function $e(t,e){return e?ge.test(e)&&t?.states?.[e]?t.states[e].state:e:""}class we extends ot{static properties={_tick:{state:!0},_offset:{state:!0},_tab:{state:!0}};constructor(){super(),this._tab="calendar",this._offset=0}static styles=[lt,dt,a`
      /* Metrics ported from mockups/c.html — .wt and .wt-top. The card paints
         its own surface rather than inheriting ha-card's, so the designed look
         survives whatever theme the dashboard is using. */
      .tabs { display: inline-flex; gap: 4px; margin-top: 4px; }
      /* Same 44px rule as every other target on the card. */
      .tab { min-height: var(--fh-touch); background: none; border: none; color: var(--fh-text-mute); font: inherit; font-size: 15px; padding: 0 16px; border-radius: 999px; cursor: pointer; }
      .tab.on { background: var(--fh-chip); color: var(--fh-text); }
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
      /* Let the left column wrap its date within its own width instead of
         pushing the clock off the right edge. Without min-width:0 a flex item
         refuses to shrink below its content, so a long date overflows the card
         on a phone. */
      .headmain { min-width: 0; }
      .date { font-size: 32px; font-weight: 600; letter-spacing: -0.6px; color: var(--fh-text); }
      .sub { font-size: 15px; color: var(--fh-text-dim); margin-top: 3px; }
      .meta { display: flex; align-items: center; gap: 18px; font-size: 19px; color: var(--fh-text-mute); flex-shrink: 0; }
      .wx { display: inline-flex; align-items: center; gap: 6px; }
      .wx ha-icon { --mdc-icon-size: 22px; color: var(--fh-text-mute); }
      .clock { font-size: 44px; font-weight: 300; letter-spacing: -1.5px; color: var(--fh-text-strong); font-variant-numeric: tabular-nums; line-height: 1; }
      /* Narrow (phone) reuses the card's <900px collapse: the wall-sized date
         and clock don't fit a phone header, so scale them and tighten gaps. */
      .head[data-narrow='true'] { gap: 8px 12px; margin-bottom: 16px; flex-wrap: wrap; }
      .head[data-narrow='true'] .date { font-size: 23px; white-space: nowrap; }
      .head[data-narrow='true'] .meta { margin-left: auto; }
      .head[data-narrow='true'] .clock { font-size: 30px; }
      .head[data-narrow='true'] .meta { gap: 12px; }
      .nav { display: flex; align-items: center; gap: 6px; }
      .navbtn { min-width: var(--fh-touch); min-height: var(--fh-touch); border-radius: 10px; border: none; background: none; color: var(--fh-text-mute); font-size: 22px; line-height: 1; cursor: pointer; }
      .navbtn:hover { background: var(--fh-surface); color: var(--fh-text); }
      .today { min-height: var(--fh-touch); padding: 0 14px; border-radius: 10px; border: none; background: var(--fh-surface); color: var(--fh-text); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 4px; }
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
    `];setConfig(t){this._config=yt(t),this._applyScheme(),_e.includes(this._config.view)||console.warn(`family-hub-card: view "${this._config.view}" is not implemented yet — rendering agenda.`),this._hub?.stop(),this._hub=null}set hass(t){const e=this._hass;this._hass=t,this._applyScheme(),this._hub&&this._hub.hassChanged(e),!this._hub&&this._config&&(this._hub=new Bt({config:this._config,getHass:()=>this._hass,getNow:()=>new Date,onChange:()=>this.requestUpdate(),schedule:(t,e)=>{const s=setInterval(t,e);return()=>clearInterval(s)}}),this._syncWindow(),this._hub.start(),this._hub.refresh()),this.requestUpdate()}get hass(){return this._hass}get _tz(){return this._hass?.config?.time_zone||"UTC"}_applyScheme(){const t=ye(this._hass,this._config?.theme);this.dataset.scheme!==t&&(this.dataset.scheme=t,this.requestUpdate())}connectedCallback(){super.connectedCallback(),this._applyScheme(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width<900;e!==this._narrow&&(this._narrow=e,this._syncWindow(),this.requestUpdate())}),this._ro.observe(this),this._scheduleTick(),this._onOnline=()=>this._hub?.refresh(),window.addEventListener("online",this._onOnline),this._hub&&(this._hub.start(),this._hub.refresh())}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),clearTimeout(this._tickTimer),clearTimeout(this._returnTimer),window.removeEventListener("online",this._onOnline),this._hub?.stop()}_scheduleTick(){this._tickTimer=setTimeout(()=>{this._tick=Date.now(),this._syncWindow(),this._scheduleTick()},function(t){const e=t.getTime()%6e4;return 0===e?6e4:6e4-e}(new Date))}getCardSize(){return 12}getGridOptions(){return{columns:"full",rows:"auto",min_columns:6,min_rows:4}}getLayoutOptions(){return{grid_columns:"full",grid_rows:"auto",grid_min_columns:6}}static getConfigElement(){return document.createElement("family-hub-card-editor")}static getStubConfig(){return{view:"agenda",people:[{name:"Ana",todo:"todo.ana"}]}}get _effectiveView(){return"week"===this._config.view&&this._narrow?"agenda":this._config.view}get _weekBase(){return"week"!==this._effectiveView?0:function(t,e,s="monday"){if("today"===s)return 0;const{year:i,month:n,day:a}=wt(t,e);return-(new Date(Date.UTC(i,n,a)).getUTCDay()-("sunday"===s?0:1)+7)%7||0}(new Date,this._tz,this._config.weekStart)}get _startOffset(){return(this._offset||0)+this._weekBase}_syncWindow(){this._hub&&this._config&&(this._hub.windowDays="week"===this._effectiveView?7:1,this._hub.startOffset=this._startOffset)}_headerDate(t){const e=this._hass.locale;if("week"===this._effectiveView){const s=new Date(t.getTime()+this._startOffset*ve);return jt(Wt(this._hass),"week_of",{date:qt(s,e,this._tz,{day:"numeric",month:"long"})})}return qt(this._viewDate(t),e,this._tz,this._narrow?{weekday:"short",day:"numeric",month:"short"}:{weekday:"long",day:"numeric",month:"long"})}get _pageStep(){return"week"===this._effectiveView?7:1}_viewDate(t){return new Date(t.getTime()+(this._offset||0)*ve)}_dialogDate(t){return"week"===this._effectiveView&&this._offset?new Date(t.getTime()+this._startOffset*ve):this._viewDate(t)}_page(t){this._setOffset((this._offset||0)+t*this._pageStep)}_goToday(){this._setOffset(0),this._tab="calendar"}_setOffset(t){this._offset=t,this._syncWindow(),this._armReturn(),this.requestUpdate()}_armReturn(){clearTimeout(this._returnTimer);const t=this._config?.returnToToday;t&&this._offset&&(this._returnTimer=setTimeout(()=>this._goToday(),1e3*t))}_onChoreTap(t){const{personId:e,choreId:s}=t.detail;this._hub?.complete(e,s)}_weather(){const t=this._config.header.weather,e=t?this._hass.states[t]:null;if(!e)return L;const s=be[e.state],i=e.attributes?.temperature;return W`<span class="wx">
      ${s?W`<ha-icon icon=${s}></ha-icon>`:L}
      ${null==i||Number.isNaN(Number(i))?L:W`<span>${Math.round(i)}°</span>`}
    </span>`}render(){if(!this._config)return L;if(!this._hass||!this._hub)return W`<ha-card><div class="loading">${jt(Wt(this._hass),"loading")}</div></ha-card>`;const t=new Date,e=this._hub.model,s=Wt(this._hass),i=this._hass.locale,n=this._tz,a=$e(this._hass,this._config.header.subtitle),o=!this._offset;return W`
      <ha-card>
        <div class="head" data-narrow=${String(this._narrow)}>
          <div class="headmain">
            <div class="nav">
              <button class="navbtn" aria-label=${jt(s,"previous")} @click=${()=>this._page(-1)}>‹</button>
              <div class="date">${this._headerDate(t)}</div>
              <button class="navbtn" aria-label=${jt(s,"next_page")} @click=${()=>this._page(1)}>›</button>
            </div>
            ${this._config.tabs?W`<div class="tabs" role="tablist">
                  ${["calendar","tasks"].map(t=>W`<button
                      class="tab ${this._tab===t?"on":""}"
                      role="tab"
                      aria-selected=${this._tab===t?"true":"false"}
                      @click=${()=>{this._tab=t}}
                    >${jt(s,t)}</button>`)}
                </div>`:L}
            ${this._offset?W`<button class="today" @click=${()=>this._goToday()}>${jt(s,"today")}</button>`:L}
            ${a?W`<div class="sub">${a}</div>`:L}
            ${_e.includes(this._config.view)?L:W`<div class="fallback">${jt(s,"view_not_built",{view:this._config.view})}</div>`}
            ${e.staleSince?W`<div class="stale">
                  ${jt(s,"last_updated",{time:Lt(e.staleSince,i,n)})}
                </div>`:L}
          </div>
          <div class="meta">
            ${this._weather()}
            ${le(this._hass,this._config).length?W`<button class="addbtn" aria-label=${jt(s,"add")} title=${jt(s,"add")}
                  @click=${()=>this.renderRoot.querySelector("family-hub-add-dialog")?.show()}
                >+</button>`:L}
            ${this._config.header.clock?W`<span class="clock">${Lt(t,i,n)}</span>`:L}
          </div>
        </div>
        <family-hub-add-dialog
          .hass=${this._hass}
          .config=${this._config}
          .lang=${s}
          .date=${this._dialogDate(t)}
          @created=${()=>this._hub?.refresh()}
        ></family-hub-add-dialog>
        ${this._config.tabs&&"tasks"===this._tab?W`<family-hub-tasks
              .model=${e}
              .lang=${s}
              .now=${t}
              .isToday=${o}
              .tz=${n}
              .readOnly=${!o}
              .confirmWindow=${this._config.confirmWindow}
              @chore-tap=${t=>this._onChoreTap(t)}
            ></family-hub-tasks>`:"columns"===this._effectiveView?W`<family-hub-columns
              .model=${e}
              .lang=${s}
              .locale=${i}
              .tz=${n}
              .readOnly=${!o}
              .confirmWindow=${this._config.confirmWindow}
              .inlineChores=${this._config.inlineChores}
              .hideChores=${this._config.tabs}
              @chore-tap=${t=>this._onChoreTap(t)}
            ></family-hub-columns>`:"week"===this._effectiveView?W`<family-hub-week
              .model=${e}
              .lang=${s}
              .locale=${i}
              .now=${t}
              .offsetDays=${this._offset||0}
              .startOffset=${this._startOffset}
              .tz=${n}
            ></family-hub-week>`:W`<family-hub-agenda
              .model=${e}
              .lang=${s}
              .locale=${i}
              .tz=${n}
              .now=${t}
              .isToday=${o}
              .readOnly=${!o}
              .confirmWindow=${this._config.confirmWindow}
              .inlineChores=${this._config.inlineChores}
              .hideChores=${this._config.tabs}
              @chore-tap=${t=>this._onChoreTap(t)}
            ></family-hub-agenda>`}
      </ha-card>
    `}}customElements.define("family-hub-card",we),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.push({type:"family-hub-card",name:"Family Hub Card",description:"Today's schedule per person plus their chores, tappable to complete.",preview:!0,documentationURL:"https://github.com/tempus2016/family-hub-card"}));export{be as WEATHER_ICONS,ye as resolveScheme,$e as resolveSubtitle};
