/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(i,t,s)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:h,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,f=u.trustedTypes,m=f?f.emptyScript:"",g=u.reactiveElementPolyfillSupport,_=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!a(t,e),v={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&h(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);n?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const r=n.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const r=this.constructor;if(!1===i&&(n=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??$)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[_("elementProperties")]=new Map,b[_("finalized")]=new Map,g?.({ReactiveElement:b}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,A=t=>t,x=w.trustedTypes,E=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+S,k=`<${T}>`,P=document,U=()=>P.createComment(""),D=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,H="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,M=/>/g,z=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,B=/"/g,L=/^(?:script|style|textarea|title)$/i,j=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),F=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,V=P.createTreeWalker(P,129);function Z(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=O;for(let e=0;e<s;e++){const s=t[e];let a,h,l=-1,c=0;for(;c<s.length&&(o.lastIndex=c,h=o.exec(s),null!==h);)c=o.lastIndex,o===O?"!--"===h[1]?o=I:void 0!==h[1]?o=M:void 0!==h[2]?(L.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=z):void 0!==h[3]&&(o=z):o===z?">"===h[0]?(o=n??O,l=-1):void 0===h[1]?l=-2:(l=o.lastIndex-h[2].length,a=h[1],o=void 0===h[3]?z:'"'===h[3]?B:R):o===B||o===R?o=z:o===I||o===M?o=O:(o=z,n=void 0);const d=o===z&&t[e+1].startsWith("/>")?" ":"";r+=o===O?s+k:l>=0?(i.push(a),s.slice(0,l)+C+s.slice(l)+S+d):s+S+(-2===l?e:d)}return[Z(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[h,l]=J(t,e);if(this.el=K.createElement(h,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=l[r++],s=i.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:s,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?st:X}),i.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=x?x.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],U()),V.nextNode(),a.push({type:2,index:++n});i.append(t[e],U())}}}else if(8===i.nodeType)if(i.data===T)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)a.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function Y(t,e,s=t,i){if(e===F)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const r=D(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=Y(t,n._$AS(t,e.values),n,i)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);V.currentNode=i;let n=V.nextNode(),r=0,o=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new it(n,this,t)),this._$AV.push(e),a=s[++o]}r!==a?.index&&(n=V.nextNode(),r++)}return V.currentNode=P,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),D(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&D(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new G(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new K(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Q(this.O(U()),this.O(U()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const n=this.strings;let r=!1;if(void 0===n)t=Y(this,t,e,0),r=!D(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const i=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=Y(this,i[s+o],e,o),a===F&&(a=this._$AH[o]),r||=!D(a)||a!==this._$AH[o],a===W?t=W:t!==W&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends X{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??W)===F)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(K,Q),(w.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ot extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new Q(e.insertBefore(U(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}ot._$litElement$=!0,ot.finalized=!0,rt.litElementHydrateSupport?.({LitElement:ot});const at=rt.litElementPolyfillSupport;at?.({LitElement:ot}),(rt.litElementVersions??=[]).push("4.2.2");const ht=r`
  :host {
    --fh-t1-size: 1.75rem;
    --fh-t1-weight: 600;
    --fh-t2-size: 0.9375rem;
    --fh-t2-weight: 400;
    --fh-mono: 'IBM Plex Mono', ui-monospace, monospace;
    --fh-gap: 12px;
    --fh-radius: 14px;
    --fh-touch: 48px;
    --fh-surface: var(--card-background-color, #1c1c1e);
    --fh-surface-2: var(--secondary-background-color, #2c2c2e);
    --fh-text: var(--primary-text-color, #fff);
    --fh-text-dim: var(--secondary-text-color, #8e8e93);
    display: block;
  }

  .t1 {
    font-size: var(--fh-t1-size);
    font-weight: var(--fh-t1-weight);
    line-height: 1.2;
    color: var(--fh-text);
  }

  .t2 {
    font-size: var(--fh-t2-size);
    font-weight: var(--fh-t2-weight);
    line-height: 1.4;
    color: var(--fh-text-dim);
  }

  .time {
    font-family: var(--fh-mono);
    font-size: var(--fh-t2-size);
    color: var(--fh-text-dim);
    letter-spacing: 0.02em;
  }

  .tap {
    min-width: var(--fh-touch);
    min-height: var(--fh-touch);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
  }

  .tap:focus-visible {
    outline: 2px solid var(--fh-text);
    outline-offset: 2px;
  }

  .stale {
    font-size: 0.75rem;
    color: var(--warning-color, #ffb84a);
  }

  .notice {
    font-size: 0.8125rem;
    color: var(--error-color, #ff4a4a);
    padding: 4px 0;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
`,lt=["#4A9EFF","#FF4A87","#FFB84A","#4ADE80","#A78BFA","#22D3EE","#F97316","#E879F9"],ct=["agenda","columns","week"];function dt(t){const e=t||{};if(!Array.isArray(e.people)||0===e.people.length)throw new Error("family-hub-card: `people` is required and must list at least one person");const s=e.view||"agenda";if(!ct.includes(s))throw new Error(`family-hub-card: unknown \`view\` "${s}" — expected one of ${ct.join(", ")}`);const i=new Set,n=e.people.map((t,e)=>{if(!t||!t.name)throw new Error("family-hub-card: every person needs a `name`");const s=null==t.calendars?[]:[].concat(t.calendars);if(0===s.length&&!t.todo)throw new Error(`family-hub-card: "${t.name}" needs \`calendars\` or \`todo\``);const n=(r=t.name,String(r).trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));var r;if(i.has(n))throw new Error(`family-hub-card: duplicate person name "${t.name}"`);return i.add(n),{id:n,name:t.name,color:t.color||lt[e%lt.length],initials:t.initials||String(t.name).trim()[0].toUpperCase(),calendars:s,todo:t.todo||null,points:t.points||null}});return{view:s,refreshInterval:Math.max(60,Number(e.refresh_interval??300)),choreFilter:"all"===e.chore_filter?"all":"today",confirmWindow:0===e.confirm_window?0:Number(e.confirm_window??3),taskmateChores:e.taskmate_chores||null,header:{clock:!1!==e.header?.clock,weather:e.header?.weather||null,subtitle:e.header?.subtitle||null},people:n}}function pt(t,e){const s=new Intl.DateTimeFormat("en-US",{timeZone:e,hour12:!1,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}),i=Object.fromEntries(s.formatToParts(t).filter(t=>"literal"!==t.type).map(t=>[t.type,t.value]));return Date.UTC(Number(i.year),Number(i.month)-1,Number(i.day),Number(i.hour)%24,Number(i.minute),Number(i.second))-t.getTime()}function ut(t,e){const s=pt(t,e),i=new Date(t.getTime()+s);return{year:i.getUTCFullYear(),month:i.getUTCMonth(),day:i.getUTCDate(),hour:i.getUTCHours(),minute:i.getUTCMinutes()}}function ft(t,e){const{year:s,month:i,day:n}=ut(t,e),r=new Date(Date.UTC(s,i,n)-pt(t,e));return new Date(Date.UTC(s,i,n)-pt(r,e))}function mt(t,e){const s=ft(t,e),i=new Date(s.getTime()+1296e5);return{start:s,end:ft(i,e)}}function gt(t,e){const[s,i,n]=t.split("-").map(Number),{start:r}=mt(new Date(Date.UTC(s,i-1,n,12)),e);return r}async function _t(t,e,s,i){const{start:n,end:r}=mt(s,i),o=`start=${encodeURIComponent(n.toISOString())}&end=${encodeURIComponent(r.toISOString())}`,a=[];for(const t of e)for(const e of t.calendars||[])a.push({person:t,entity:e});const h=[],l={},c=await Promise.all(a.map(async({person:e,entity:s})=>{try{return(await t.callApi("GET",`calendars/${s}?${o}`)||[]).map(t=>function(t,e,s){const i=Boolean(t.start?.date&&!t.start?.dateTime),n=i?gt(t.start.date,s):new Date(t.start.dateTime),r=i?gt(t.end?.date||t.start.date,s):new Date(t.end?.dateTime||t.start.dateTime),o=t.summary||"";return{id:`${e}:${o}:${n.toISOString()}`,personId:e,summary:o,start:n,end:r,allDay:i,location:t.location||""}}(t,e.id,i))}catch{return h.push(s),(l[e.id]||=[]).push(s),[]}})),d=c.flat().filter(t=>t.start<r&&(t.end>n||t.start>=n)).sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start-e.start);return{events:d,failures:h,failuresByPerson:l}}function yt(t,e){if(!t)return null;if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const[e,s,i]=t.split("-").map(Number);return new Date(Date.UTC(e,s-1,i,12))}return new Date(t)}function $t(t,e,s,i){return(t||[]).map(t=>({id:t.uid,summary:t.summary||"",status:"completed"===t.status?"completed":"needs_action",due:yt(t.due)})).filter(t=>"all"===e||("completed"===t.status||(!t.due||(t.due<=s||function(t,e,s){const i=ut(t,s),n=ut(e,s);return i.year===n.year&&i.month===n.month&&i.day===n.day}(t.due,s,i)))))}async function vt(t,e,s,i,n){const r={},o=[],a={};return await Promise.all(e.filter(t=>t.todo).map(async e=>{try{const o=await t.callWS({type:"todo/item/list",entity_id:e.todo});r[e.id]=$t(o?.items,s,i,n).map(t=>({...t,personId:e.id}))}catch{o.push(e.todo),(a[e.id]||=[]).push(e.todo),r[e.id]=[]}})),{choresByPerson:r,failures:o,failuresByPerson:a}}const bt=new Set(["unavailable","unknown",""]);function wt(t,e){return e.taskmateChildId?t.filter(t=>t.childId===e.taskmateChildId):[]}class At{constructor({config:t,getHass:e,getNow:s,onChange:i,schedule:n}){this.config=t,this.getHass=e,this.getNow=s||(()=>new Date),this.onChange=i||(()=>{}),this.schedule=n,this._cancels=[],this._events=[],this._chores={},this._failuresByPerson={},this._inflight=null,this.model={people:[],staleSince:null,failures:[]}}get _tz(){return this.getHass()?.config?.time_zone||"UTC"}watchedEntities(){const t=[];for(const e of this.config.people)t.push(...e.calendars||[]),e.todo&&t.push(e.todo),e.points&&t.push(e.points);return this.config.taskmateChores&&t.push(this.config.taskmateChores),t}hassChanged(t){const e=this.getHass();if(!e)return;let s=!1,i=!1;for(const n of this.watchedEntities())t?.states?.[n]!==e.states?.[n]&&(n.startsWith("calendar.")||n.startsWith("todo.")?s=!0:i=!0);s?this.refresh():i&&(this._rebuild(e),this.onChange())}async refresh(){return this._inflight||(this._inflight=this._doRefresh().finally(()=>{this._inflight=null})),this._inflight}async _doRefresh(){const t=this.getHass(),e=this.getNow(),{people:s,choreFilter:i}=this.config,[n,r]=await Promise.all([_t(t,s,e,this._tz),vt(t,s,i,e,this._tz)]),o=this._events,a=this._chores,h=new Set(Object.keys(n.failuresByPerson||{}));this._events=[...n.events.filter(t=>!h.has(t.personId)),...o.filter(t=>h.has(t.personId))].sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.start-e.start);const l=new Set(Object.keys(r.failuresByPerson||{}));this._chores={};for(const t of s)this._chores[t.id]=l.has(t.id)?a[t.id]||[]:r.choresByPerson[t.id]||[];this._failuresByPerson={};for(const[t,e]of Object.entries(n.failuresByPerson||{}))(this._failuresByPerson[t]||=[]).push(...e);for(const[t,e]of Object.entries(r.failuresByPerson||{}))(this._failuresByPerson[t]||=[]).push(...e);const c=[...n.failures,...r.failures];this.model.staleSince=c.length?this.model.staleSince||e:null,this.model.failures=c,this._rebuild(t),this.onChange()}_rebuild(t){const e=function(t,e){if(!e)return[];const s=t?.states?.[e],i=s?.attributes?.todays_completions;return Array.isArray(i)?i.filter(t=>"__parent__"!==t.child_id).map(t=>({choreId:t.chore_id,childId:t.child_id,name:t.chore_name||"",approved:Boolean(t.approved),completedAt:new Date(t.completed_at)})):[]}(t,this.config.taskmateChores);this.model.people=this.config.people.map(s=>{const i=function(t,e){if(!e.points)return null;const s=t?.states?.[e.points];if(!s)return null;const i=s.attributes||{},n=bt.has(s.state)?null:Number(s.state);return{balance:Number.isNaN(n)?null:n,unit:i.unit_of_measurement||"points",earnedToday:i.points_earned_today??null,pendingToday:i.points_pending_today??null,childId:i.child_id??null}}(t,s),n={...s,taskmateChildId:i?.childId||null};return{...n,events:this._events.filter(t=>t.personId===s.id),chores:this._chores[s.id]||[],completedToday:wt(e,n),points:i,failures:this._failuresByPerson[s.id]||[]}})}start(){this.stop();const t=this.getNow();this._cancels.push(this.schedule(()=>this.refresh(),1e3*this.config.refreshInterval)),this._cancels.push(this.schedule(()=>{this.refresh(),this.start()},function(t,e){return mt(t,e).end.getTime()-t.getTime()}(t,this._tz)))}stop(){this._cancels.forEach(t=>t()),this._cancels=[]}async complete(t,e){const s=this.config.people.find(e=>e.id===t),i=(this._chores[t]||[]).find(t=>t.id===e);if(!s?.todo||!i)return;const n=i.status;i.status="completed",this._rebuild(this.getHass()),this.onChange();try{await async function(t,e,s){await t.callService("todo","update_item",{entity_id:e,item:s,status:"completed"})}(this.getHass(),s.todo,e)}catch{i.status=n,this.model.failures=[...this.model.failures,s.todo],this._rebuild(this.getHass()),this.onChange()}}}class xt extends ot{static properties={model:{attribute:!1},now:{attribute:!1},confirmWindow:{attribute:!1},_pending:{state:!0}};static styles=[ht,r`
      .wrap { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }
      .wrap[data-narrow='true'] { grid-template-columns: 1fr; }
      .label { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fh-text-dim); margin-bottom: 8px; }
      .timeline { background: var(--fh-surface-2); border-radius: var(--fh-radius); padding: 8px 0; }
      .row { display: grid; grid-template-columns: 72px 4px 1fr; gap: 12px; align-items: start; padding: 12px 16px; }
      .bar { width: 4px; border-radius: 2px; align-self: stretch; }
      .nowline { display: flex; align-items: center; gap: 8px; padding: 0 16px; }
      .nowline .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--fh-t1-accent, #4A9EFF); }
      .nowline .rule { flex: 1; height: 2px; background: var(--fh-t1-accent, #4A9EFF); }
      .past { opacity: 0.45; }
      .person { background: var(--fh-surface-2); border-radius: var(--fh-radius); padding: 14px 16px; margin-bottom: var(--fh-gap); border-left: 4px solid var(--fh-person, #888); }
      .person-head { display: flex; align-items: center; gap: 10px; justify-content: space-between; }
      .avatar { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; font-weight: 600; color: #000; }
      .chore { display: flex; align-items: center; gap: 10px; }
      .chore.done .name { text-decoration: line-through; opacity: 0.55; }
      .chore.pending .name { text-decoration: line-through; opacity: 0.4; font-style: italic; }
      .box { width: 24px; height: 24px; border-radius: 6px; border: 2px solid var(--fh-text-dim); }
      .box.filled { background: var(--fh-person, #888); border-color: transparent; }
      .ring { animation: fh-ring var(--fh-window, 3s) linear forwards; }
      @keyframes fh-ring { from { opacity: 1; } to { opacity: 0.3; } }
      .points { font-family: var(--fh-mono); font-size: 1.5rem; text-align: right; }
      .waiting { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--warning-color, #ffb84a); }
    `];constructor(){super(),this._pending=new Map,this._narrow=!1}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(([t])=>{const e=t.contentRect.width<640;e!==this._narrow&&(this._narrow=e,this.requestUpdate())}),this._ro.observe(this),this._onVisibility=()=>{"hidden"===document.visibilityState&&this.flushPending()},this._onPageHide=()=>this.flushPending(),document.addEventListener("visibilitychange",this._onVisibility),window.addEventListener("pagehide",this._onPageHide)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),document.removeEventListener("visibilitychange",this._onVisibility),window.removeEventListener("pagehide",this._onPageHide),this.flushPending()}flushPending(){for(const t of this._pending.values())clearTimeout(t.timer),this._fire(t.personId,t.choreId);this._pending.clear()}_tap(t,e){const s=`${t}:${e}`,i=this._pending.get(s);if(i)return clearTimeout(i.timer),this._pending.delete(s),void this.requestUpdate();if(!this.confirmWindow)return void this._fire(t,e);const n=setTimeout(()=>{this._pending.delete(s),this._fire(t,e)},1e3*this.confirmWindow);this._pending.set(s,{timer:n,personId:t,choreId:e}),this.requestUpdate()}_fire(t,e){this.dispatchEvent(new CustomEvent("chore-tap",{detail:{personId:t,choreId:e},bubbles:!0,composed:!0})),this.requestUpdate()}_fmt(t){return new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit",hour12:!1}).format(t)}render(){if(!this.model)return W;const t=function(t){const e=[];for(const s of t)for(const t of s.events||[])e.push({time:t.allDay?null:t.start,allDay:t.allDay,event:t,person:s});return e.sort((t,e)=>t.allDay!==e.allDay?t.allDay?-1:1:t.allDay?0:t.time-e.time)}(this.model.people),e=function(t,e){const s=t.findIndex(t=>!t.allDay);if(-1===s)return-1;if(e<t[s].time)return-1;let i=t.length;for(let n=s;n<t.length;n+=1)if(t[n].time>e){i=n;break}return i}(t,this.now),s=[];return t.forEach((t,i)=>{i===e&&s.push(j`<div class="nowline"><span class="dot"></span><span class="rule"></span></div>`),s.push(j`
        <div class="row ${!t.allDay&&t.time<this.now?"past":""}">
          <span class="time">${t.allDay?"All day":this._fmt(t.time)}</span>
          <span class="bar" style="background:${t.person.color}"></span>
          <span>
            <div class="t1">${t.event.summary}</div>
            <div class="t2" style="color:${t.person.color}">
              ${t.person.name}${t.event.location?j` · ${t.event.location}`:W}
            </div>
          </span>
        </div>
      `)}),e===t.length&&s.push(j`<div class="nowline"><span class="dot"></span><span class="rule"></span></div>`),j`
      <div class="wrap" data-narrow=${String(this._narrow)}>
        <div>
          <div class="label">Today</div>
          <div class="timeline">${s.length?s:j`<div class="row t2">Nothing scheduled</div>`}</div>
        </div>
        <div>
          <div class="label">Chores</div>
          ${this.model.people.map(t=>this._person(t))}
        </div>
      </div>
    `}_person(t){const e=(t.chores||[]).filter(t=>"completed"!==t.status),s=(t.chores||[]).filter(t=>"completed"===t.status);return j`
      <div class="person" style="--fh-person:${t.color}">
        <div class="person-head">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="avatar" style="background:${t.color}">${t.initials}</span>
            <span>
              <div class="t1" style="font-size:1.25rem">${t.name}</div>
              <div class="t2">${e.length} to do</div>
            </span>
          </div>
          ${this._points(t)}
        </div>
        ${(t.failures||[]).length?j`<div class="notice">Can't read ${t.failures.join(", ")}</div>`:W}
        ${e.map(e=>this._chore(t,e,"open"))}
        ${s.map(e=>this._chore(t,e,"done"))}
        ${(t.completedToday||[]).map(t=>j`
            <div class="chore ${t.approved?"done":"pending"}">
              <span class="box filled"></span>
              <span class="name t2">${t.name}</span>
              ${t.approved?W:j`<span class="waiting">waiting</span>`}
            </div>
          `)}
      </div>
    `}_points(t){if(!t.points||null==t.points.balance)return W;const e=null==t.points.earnedToday?W:j`<div class="t2">${t.points.earnedToday} today${t.points.pendingToday?j` · ${t.points.pendingToday} pending`:W}</div>`;return j`
      <span style="text-align:right">
        <div class="points" style="color:${t.color}">${t.points.balance}</div>
        <div class="t2">${t.points.unit}</div>
        ${e}
      </span>
    `}_chore(t,e,s){const i=`${t.id}:${e.id}`,n=this._pending.has(i);return j`
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
        <span class="name t2" style="color:var(--fh-text)">${e.summary}</span>
      </div>
    `}}customElements.define("family-hub-agenda",xt);class Et extends ot{static properties={hass:{attribute:!1},_config:{state:!0}};static styles=r`
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
    `}}customElements.define("family-hub-card-editor",Et);const Ct=/^[a-z_]+\.[a-z0-9_]+$/;function St(t,e){return e?Ct.test(e)&&t?.states?.[e]?t.states[e].state:e:""}class Tt extends ot{static properties={_tick:{state:!0}};static styles=[ht,r`
      ha-card { padding: 20px 24px; }
      .head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
      .date { font-size: 2rem; font-weight: 700; color: var(--fh-text); }
      .clock { font-size: 3rem; font-weight: 300; font-variant-numeric: tabular-nums; color: var(--fh-text); line-height: 1; }
      .meta { display: flex; align-items: center; gap: 16px; }
    `];setConfig(t){this._config=dt(t),"agenda"!==this._config.view&&console.warn(`family-hub-card: view "${this._config.view}" is not implemented yet — rendering agenda.`),this._hub?.stop(),this._hub=null}set hass(t){const e=this._hass;this._hass=t,this._hub&&this._hub.hassChanged(e),!this._hub&&this._config&&(this._hub=new At({config:this._config,getHass:()=>this._hass,getNow:()=>new Date,onChange:()=>this.requestUpdate(),schedule:(t,e)=>{const s=setInterval(t,e);return()=>clearInterval(s)}}),this._hub.start(),this._hub.refresh()),this.requestUpdate()}get hass(){return this._hass}connectedCallback(){super.connectedCallback(),this._scheduleTick(),this._onOnline=()=>this._hub?.refresh(),window.addEventListener("online",this._onOnline)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._tickTimer),window.removeEventListener("online",this._onOnline),this._hub?.stop()}_scheduleTick(){this._tickTimer=setTimeout(()=>{this._tick=Date.now(),this._scheduleTick()},function(t){const e=t.getTime()%6e4;return 0===e?6e4:6e4-e}(new Date))}getCardSize(){return 12}static getConfigElement(){return document.createElement("family-hub-card-editor")}static getStubConfig(){return{view:"agenda",people:[{name:"Ana",todo:"todo.ana"}]}}_onChoreTap(t){const{personId:e,choreId:s}=t.detail;this._hub?.complete(e,s)}render(){if(!this._config)return W;if(!this._hass||!this._hub)return j`<ha-card><div class="t2">Loading…</div></ha-card>`;const t=new Date,e=this._hub.model,s=this._config.header.weather?this._hass.states[this._config.header.weather]:null,i=St(this._hass,this._config.header.subtitle);return j`
      <ha-card>
        <div class="head">
          <div>
            <div class="date">
              ${new Intl.DateTimeFormat(void 0,{weekday:"long",day:"numeric",month:"long"}).format(t)}
            </div>
            ${i?j`<div class="t2">${i}</div>`:W}
            ${e.staleSince?j`<div class="stale">
                  Last updated
                  ${new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"}).format(e.staleSince)}
                </div>`:W}
          </div>
          <div class="meta">
            ${s?j`<span class="t2">${s.attributes.temperature}°</span>`:W}
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
    `}}customElements.define("family-hub-card",Tt),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.push({type:"family-hub-card",name:"Family Hub Card",description:"Today's schedule per person plus their chores, tappable to complete.",preview:!0,documentationURL:"https://github.com/tempus2016/family-hub-card"}));export{St as resolveSubtitle};
