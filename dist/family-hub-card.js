/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(i,t,s)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:h,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:c,getPrototypeOf:p}=Object,u=globalThis,f=u.trustedTypes,m=f?f.emptyScript:"",g=u.reactiveElementPolyfillSupport,_=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},y=(t,e)=>!a(t,e),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&h(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);n?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...d(t),...c(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=i;const o=n.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const o=this.constructor;if(!1===i&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??y)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[_("elementProperties")]=new Map,b[_("finalized")]=new Map,g?.({ReactiveElement:b}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,x=t=>t,A=w.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+S,T=`<${k}>`,P=document,U=()=>P.createComment(""),D=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,I="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,M=/>/g,z=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,B=/"/g,F=/^(?:script|style|textarea|title)$/i,j=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),L=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,V=P.createTreeWalker(P,129);function Z(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=H;for(let e=0;e<s;e++){const s=t[e];let a,h,l=-1,d=0;for(;d<s.length&&(r.lastIndex=d,h=r.exec(s),null!==h);)d=r.lastIndex,r===H?"!--"===h[1]?r=O:void 0!==h[1]?r=M:void 0!==h[2]?(F.test(h[2])&&(n=RegExp("</"+h[2],"g")),r=z):void 0!==h[3]&&(r=z):r===z?">"===h[0]?(r=n??H,l=-1):void 0===h[1]?l=-2:(l=r.lastIndex-h[2].length,a=h[1],r=void 0===h[3]?z:'"'===h[3]?B:R):r===B||r===R?r=z:r===O||r===M?r=H:(r=z,n=void 0);const c=r===z&&t[e+1].startsWith("/>")?" ":"";o+=r===H?s+T:l>=0?(i.push(a),s.slice(0,l)+C+s.slice(l)+S+c):s+S+(-2===l?e:c)}return[Z(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[h,l]=J(t,e);if(this.el=K.createElement(h,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=l[o++],s=i.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:s,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?st:X}),i.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(F.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],U()),V.nextNode(),a.push({type:2,index:++n});i.append(t[e],U())}}}else if(8===i.nodeType)if(i.data===k)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)a.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function Y(t,e,s=t,i){if(e===L)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const o=D(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=Y(t,n._$AS(t,e.values),n,i)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);V.currentNode=i;let n=V.nextNode(),o=0,r=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new Q(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new it(n,this,t)),this._$AV.push(e),a=s[++r]}o!==a?.index&&(n=V.nextNode(),o++)}return V.currentNode=P,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),D(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&D(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new G(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new K(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Q(this.O(U()),this.O(U()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(void 0===n)t=Y(this,t,e,0),o=!D(t)||t!==this._$AH&&t!==L,o&&(this._$AH=t);else{const i=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=Y(this,i[s+r],e,r),a===L&&(a=this._$AH[r]),o||=!D(a)||a!==this._$AH[r],a===W?t=W:t!==W&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends X{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??W)===L)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(K,Q),(w.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class rt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new Q(e.insertBefore(U(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}}rt._$litElement$=!0,rt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:rt});const at=ot.litElementPolyfillSupport;at?.({LitElement:rt}),(ot.litElementVersions??=[]).push("4.2.2");const ht=o`
  :host {
    /* Surfaces */
    --fh-bg: var(--fh-card-bg, #12151c);
    --fh-surface: var(--fh-surface-bg, #181c26);
    --fh-chip: var(--fh-chip-bg, #232838);
    --fh-rule: var(--fh-rule-color, #232838);
    --fh-rule-soft: var(--fh-rule-soft-color, #1f2431);

    /* Text */
    --fh-text: var(--fh-text-color, #e8eaf0);
    --fh-text-strong: var(--fh-text-strong-color, #ffffff);
    --fh-text-mute: var(--fh-text-mute-color, #9aa3b8);
    --fh-text-soft: var(--fh-text-soft-color, #8b94ab);
    --fh-text-dim: var(--fh-text-dim-color, #5d6579);
    --fh-text-faint: var(--fh-text-faint-color, #6d768c);
    --fh-chore-text: var(--fh-chore-text-color, #c3c9d8);

    /* Type */
    --fh-font: var(--fh-font-family, 'IBM Plex Sans', 'Segoe UI', system-ui, -apple-system, sans-serif);
    --fh-mono: var(--fh-font-mono, 'IBM Plex Mono', 'SF Mono', ui-monospace, monospace);

    /* Shape */
    --fh-radius: 16px;
    --fh-radius-inner: 12px;
    --fh-touch: 44px;

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
    color: var(--error-color, #ff6b6b);
    padding: 6px 0 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`,lt=["#4A9EFF","#FF4A87","#FFB84A","#4ADE80","#A78BFA","#22D3EE","#F97316","#E879F9"],dt=["agenda","columns","week"];function ct(t){const e=t||{};if(!Array.isArray(e.people)||0===e.people.length)throw new Error("family-hub-card: `people` is required and must list at least one person");const s=e.view||"agenda";if(!dt.includes(s))throw new Error(`family-hub-card: unknown \`view\` "${s}" — expected one of ${dt.join(", ")}`);const i=new Set,n=e.people.map((t,e)=>{if(!t||!t.name)throw new Error("family-hub-card: every person needs a `name`");const s=null==t.calendars?[]:[].concat(t.calendars);if(0===s.length&&!t.todo)throw new Error(`family-hub-card: "${t.name}" needs \`calendars\` or \`todo\``);const n=(o=t.name,String(o).trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));var o;if(i.has(n))throw new Error(`family-hub-card: duplicate person name "${t.name}"`);return i.add(n),{id:n,name:t.name,color:t.color||lt[e%lt.length],initials:t.initials||String(t.name).trim()[0].toUpperCase(),calendars:s,todo:t.todo||null,points:t.points||null}});return{view:s,refreshInterval:Math.max(60,Number(e.refresh_interval??300)),choreFilter:"all"===e.chore_filter?"all":"today",confirmWindow:0===e.confirm_window?0:Number(e.confirm_window??3),taskmateChores:e.taskmate_chores||null,header:{clock:!1!==e.header?.clock,weather:e.header?.weather||null,subtitle:e.header?.subtitle||null},people:n}}function pt(t,e){const s=new Intl.DateTimeFormat("en-US",{timeZone:e,hour12:!1,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}),i=Object.fromEntries(s.formatToParts(t).filter(t=>"literal"!==t.type).map(t=>[t.type,t.value]));return Date.UTC(Number(i.year),Number(i.month)-1,Number(i.day),Number(i.hour)%24,Number(i.minute),Number(i.second))-(t.getTime()-t.getMilliseconds())}function ut(t,e){const s=pt(t,e),i=new Date(t.getTime()+s);return{year:i.getUTCFullYear(),month:i.getUTCMonth(),day:i.getUTCDate(),hour:i.getUTCHours(),minute:i.getUTCMinutes()}}function ft(t,e){const{year:s,month:i,day:n}=ut(t,e),o=new Date(Date.UTC(s,i,n)-pt(t,e));return new Date(Date.UTC(s,i,n)-pt(o,e))}function mt(t,e){const s=ft(t,e),i=new Date(s.getTime()+1296e5);return{start:s,end:ft(i,e)}}function gt(t,e){const[s,i,n]=t.split("-").map(Number),{start:o}=mt(new Date(Date.UTC(s,i-1,n,12)),e);return o}async function _t(t,e,s,i){const{start:n,end:o}=mt(s,i),r=`start=${encodeURIComponent(n.toISOString())}&end=${encodeURIComponent(o.toISOString())}`,a=[];for(const t of e)for(const e of t.calendars||[])a.push({person:t,entity:e});const h=[],l={},d=await Promise.all(a.map(async({person:e,entity:s})=>{try{return(await t.callApi("GET",`calendars/${s}?${r}`)||[]).map(t=>function(t,e,s){const i=Boolean(t.start?.date&&!t.start?.dateTime),n=i?gt(t.start.date,s):new Date(t.start.dateTime),o=i?gt(t.end?.date||t.start.date,s):new Date(t.end?.dateTime||t.start.dateTime),r=t.summary||"";return{id:`${e}:${r}:${n.toISOString()}`,personId:e,summary:r,start:n,end:o,allDay:i,location:t.location||""}}(t,e.id,i))}catch{return h.push(s),(l[e.id]||=[]).push(s),[]}})),c=d.flat().filter(t=>t.start<o&&(t.end>n||t.start>=n)).sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start-e.start);return{events:c,failures:h,failuresByPerson:l}}function vt(t){if(!t)return null;if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const[e,s,i]=t.split("-").map(Number);return new Date(Date.UTC(e,s-1,i,12))}return new Date(t)}function yt(t,e,s,i){return(t||[]).map(t=>({id:t.uid,summary:t.summary||"",status:"completed"===t.status?"completed":"needs_action",due:vt(t.due)})).filter(t=>"all"===e||("completed"===t.status||(!t.due||(t.due<=s||function(t,e,s){const i=ut(t,s),n=ut(e,s);return i.year===n.year&&i.month===n.month&&i.day===n.day}(t.due,s,i)))))}async function $t(t,e,s,i,n){const o={},r=[],a={};return await Promise.all(e.filter(t=>t.todo).map(async e=>{try{const r=await t.callWS({type:"todo/item/list",entity_id:e.todo});o[e.id]=yt(r?.items,s,i,n).map(t=>({...t,personId:e.id}))}catch{r.push(e.todo),(a[e.id]||=[]).push(e.todo),o[e.id]=[]}})),{choresByPerson:o,failures:r,failuresByPerson:a}}const bt=new Set(["unavailable","unknown",""]);function wt(t,e){return e.taskmateChildId?t.filter(t=>t.childId===e.taskmateChildId):[]}class xt{constructor({config:t,getHass:e,getNow:s,onChange:i,schedule:n}){this.config=t,this.getHass=e,this.getNow=s||(()=>new Date),this.onChange=i||(()=>{}),this.schedule=n,this._cancels=[],this._events=[],this._chores={},this._failuresByPerson={},this._inflight=null,this.model={people:[],staleSince:null,failures:[]}}get _tz(){return this.getHass()?.config?.time_zone||"UTC"}watchedEntities(){const t=[];for(const e of this.config.people)t.push(...e.calendars||[]),e.todo&&t.push(e.todo),e.points&&t.push(e.points);return this.config.taskmateChores&&t.push(this.config.taskmateChores),t}hassChanged(t){const e=this.getHass();if(!e)return;let s=!1,i=!1;for(const n of this.watchedEntities())t?.states?.[n]!==e.states?.[n]&&(n.startsWith("calendar.")||n.startsWith("todo.")?s=!0:i=!0);s?this.refresh():i&&(this._rebuild(e),this.onChange())}async refresh(){return this._inflight||(this._inflight=this._doRefresh().finally(()=>{this._inflight=null})),this._inflight}async _doRefresh(){const t=this.getHass(),e=this.getNow(),{people:s,choreFilter:i}=this.config,[n,o]=await Promise.all([_t(t,s,e,this._tz),$t(t,s,i,e,this._tz)]),r=this._events,a=this._chores,h=new Set(Object.keys(n.failuresByPerson||{}));this._events=[...n.events.filter(t=>!h.has(t.personId)),...r.filter(t=>h.has(t.personId))].sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start-e.start);const l=new Set(Object.keys(o.failuresByPerson||{}));this._chores={};for(const t of s)this._chores[t.id]=l.has(t.id)?a[t.id]||[]:o.choresByPerson[t.id]||[];this._failuresByPerson={};for(const[t,e]of Object.entries(n.failuresByPerson||{}))(this._failuresByPerson[t]||=[]).push(...e);for(const[t,e]of Object.entries(o.failuresByPerson||{}))(this._failuresByPerson[t]||=[]).push(...e);const d=[...n.failures,...o.failures];this.model.staleSince=d.length?this.model.staleSince||e:null,this.model.failures=d,this._rebuild(t),this.onChange()}_rebuild(t){const e=function(t,e){if(!e)return[];const s=t?.states?.[e],i=s?.attributes?.todays_completions;return Array.isArray(i)?i.filter(t=>"__parent__"!==t.child_id).map(t=>({choreId:t.chore_id,childId:t.child_id,name:t.chore_name||"",approved:Boolean(t.approved),completedAt:new Date(t.completed_at)})):[]}(t,this.config.taskmateChores);this.model.people=this.config.people.map(s=>{const i=function(t,e){if(!e.points)return null;const s=t?.states?.[e.points];if(!s)return null;const i=s.attributes||{},n=bt.has(s.state)?null:Number(s.state);return{balance:Number.isNaN(n)?null:n,unit:i.unit_of_measurement||"points",earnedToday:i.points_earned_today??null,pendingToday:i.points_pending_today??null,childId:i.child_id??null}}(t,s),n={...s,taskmateChildId:i?.childId||null};return{...n,events:this._events.filter(t=>t.personId===s.id),chores:this._chores[s.id]||[],completedToday:wt(e,n),points:i,failures:this._failuresByPerson[s.id]||[]}})}start(){this.stop();const t=this.getNow();this._cancels.push(this.schedule(()=>this.refresh(),1e3*this.config.refreshInterval)),this._cancels.push(this.schedule(()=>{this.refresh(),this.start()},function(t,e){return mt(t,e).end.getTime()-t.getTime()}(t,this._tz)))}stop(){this._cancels.forEach(t=>t()),this._cancels=[]}async complete(t,e){const s=this.config.people.find(e=>e.id===t),i=(this._chores[t]||[]).find(t=>t.id===e);if(!s?.todo||!i)return;const n=i.status;i.status="completed",this._rebuild(this.getHass()),this.onChange();try{await async function(t,e,s){await t.callService("todo","update_item",{entity_id:e,item:s,status:"completed"})}(this.getHass(),s.todo,e)}catch{i.status=n,this.model.failures=[...this.model.failures,s.todo],this._rebuild(this.getHass()),this.onChange()}}}class At extends rt{static properties={model:{attribute:!1},now:{attribute:!1},confirmWindow:{attribute:!1},_pending:{state:!0}};static styles=[ht,o`
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

      .now { background: #4A9EFF; height: 2px; border-radius: 1px; margin: 3px 0; position: relative; }
      .now::before { content: ''; position: absolute; left: -4px; top: -3px; width: 8px; height: 8px; border-radius: 50%; background: #4A9EFF; }

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
    `];constructor(){super(),this._pending=new Map,this._narrow=!1}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width<640;e!==this._narrow&&(this._narrow=e,this.requestUpdate())}),this._ro.observe(this),this._onVisibility=()=>{"hidden"===document.visibilityState&&this.flushPending()},this._onPageHide=()=>this.flushPending(),document.addEventListener("visibilitychange",this._onVisibility),window.addEventListener("pagehide",this._onPageHide)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),document.removeEventListener("visibilitychange",this._onVisibility),window.removeEventListener("pagehide",this._onPageHide),this.flushPending()}flushPending(){for(const t of this._pending.values())clearTimeout(t.timer),this._fire(t.personId,t.choreId);this._pending.clear()}_tap(t,e){const s=`${t}:${e}`,i=this._pending.get(s);if(i)return clearTimeout(i.timer),this._pending.delete(s),void this.requestUpdate();if(!this.confirmWindow)return void this._fire(t,e);const n=setTimeout(()=>{this._pending.delete(s),this._fire(t,e)},1e3*this.confirmWindow);this._pending.set(s,{timer:n,personId:t,choreId:e}),this.requestUpdate()}_fire(t,e){this.dispatchEvent(new CustomEvent("chore-tap",{detail:{personId:t,choreId:e},bubbles:!0,composed:!0})),this.requestUpdate()}_fmt(t){return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit",hour12:!1}).format(t)}render(){if(!this.model)return W;const t=function(t){const e=[];for(const s of t)for(const t of s.events||[])e.push({time:t.allDay?null:t.start,allDay:t.allDay,event:t,person:s});return e.sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.allDay?0:t.time-e.time)}(this.model.people),e=function(t,e){const s=t.findIndex(t=>!t.allDay);if(-1===s)return-1;if(e<t[s].time)return-1;let i=t.length;for(let n=s;n<t.length;n+=1)if(t[n].time>e){i=n;break}return i}(t,this.now),s=[];return t.forEach((t,i)=>{i===e&&s.push(j`<div class="now"></div>`),s.push(j`
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
    `}_person(t){const e=(t.chores||[]).filter(t=>"completed"!==t.status),s=(t.chores||[]).filter(t=>"completed"===t.status),i=t.completedToday||[],n=e.length||s.length||i.length;return j`
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
        ${n?j`<div class="chores">
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
    `:W}_chore(t,e,s){const i=`${t.id}:${e.id}`,n=this._pending.has(i);return j`
      <div class="chore ${"done"===s?"done":""}">
        <button
          class="tap"
          role="checkbox"
          aria-checked=${"done"===s||n?"true":"false"}
          aria-label=${`Complete ${e.summary} for ${t.name}`}
          @click=${()=>this._tap(t.id,e.id)}
          ?disabled=${"done"===s}
        >
          <span
            class="box ${n||"done"===s?"filled":""} ${n?"ring":""}"
            style="--fh-window:${this.confirmWindow}s"
          ></span>
        </button>
        <span class="name">${e.summary}</span>
      </div>
    `}}customElements.define("family-hub-agenda",At);class Et extends rt{static properties={hass:{attribute:!1},_config:{state:!0}};static styles=o`
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
    `}}customElements.define("family-hub-card-editor",Et);const Ct=/^[a-z_]+\.[a-z0-9_]+$/;function St(t,e){return e?Ct.test(e)&&t?.states?.[e]?t.states[e].state:e:""}class kt extends rt{static properties={_tick:{state:!0}};static styles=[ht,o`
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
    `];setConfig(t){this._config=ct(t),"agenda"!==this._config.view&&console.warn(`family-hub-card: view "${this._config.view}" is not implemented yet — rendering agenda.`),this._hub?.stop(),this._hub=null}set hass(t){const e=this._hass;this._hass=t,this._hub&&this._hub.hassChanged(e),!this._hub&&this._config&&(this._hub=new xt({config:this._config,getHass:()=>this._hass,getNow:()=>new Date,onChange:()=>this.requestUpdate(),schedule:(t,e)=>{const s=setInterval(t,e);return()=>clearInterval(s)}}),this._hub.start(),this._hub.refresh()),this.requestUpdate()}get hass(){return this._hass}connectedCallback(){super.connectedCallback(),this._scheduleTick(),this._onOnline=()=>this._hub?.refresh(),window.addEventListener("online",this._onOnline)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._tickTimer),window.removeEventListener("online",this._onOnline),this._hub?.stop()}_scheduleTick(){this._tickTimer=setTimeout(()=>{this._tick=Date.now(),this._scheduleTick()},function(t){const e=t.getTime()%6e4;return 0===e?6e4:6e4-e}(new Date))}getCardSize(){return 12}static getConfigElement(){return document.createElement("family-hub-card-editor")}static getStubConfig(){return{view:"agenda",people:[{name:"Ana",todo:"todo.ana"}]}}_onChoreTap(t){const{personId:e,choreId:s}=t.detail;this._hub?.complete(e,s)}render(){if(!this._config)return W;if(!this._hass||!this._hub)return j`<ha-card><div class="loading">Loading…</div></ha-card>`;const t=new Date,e=this._hub.model,s=this._config.header.weather?this._hass.states[this._config.header.weather]:null,i=St(this._hass,this._config.header.subtitle);return j`
      <ha-card>
        <div class="head">
          <div>
            <div class="date">
              ${new Intl.DateTimeFormat(void 0,{weekday:"long",day:"numeric",month:"long"}).format(t)}
            </div>
            ${i?j`<div class="sub">${i}</div>`:W}
            ${e.staleSince?j`<div class="stale">
                  Last updated
                  ${new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"}).format(e.staleSince)}
                </div>`:W}
          </div>
          <div class="meta">
            ${s?j`<span>${Math.round(s.attributes.temperature)}°</span>`:W}
            ${this._config.header.clock?j`<span class="clock">
                  ${new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit",hour12:!1}).format(t)}
                </span>`:W}
          </div>
        </div>
        <family-hub-agenda
          .model=${e}
          .now=${t}
          .confirmWindow=${this._config.confirmWindow}
          @chore-tap=${t=>this._onChoreTap(t)}
        ></family-hub-agenda>
      </ha-card>
    `}}customElements.define("family-hub-card",kt),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.push({type:"family-hub-card",name:"Family Hub Card",description:"Today's schedule per person plus their chores, tappable to complete.",preview:!0,documentationURL:"https://github.com/tempus2016/family-hub-card"}));export{St as resolveSubtitle};
