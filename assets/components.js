window.carousels = {};

var prod = true;

document.addEventListener("DOMContentLoaded", function () {
  (function loadCss() {
    const cssLink = document.createElement("link");
    cssLink.type = "text/css";
    cssLink.rel = "stylesheet";
    cssLink.href = prod ? "https://nojram00.github.io/dist/components.min.css" : "/assets/components.css";

    document.head.appendChild(cssLink);
  })();
});

// selectors
function $(query) {
  const el = document.querySelector(query);
  return new Proxy(el, {
    get(target, props, receiver) {
      if (props !== undefined) {
        switch (props) {
          case "click":
            return function (callback) {
              return target.addEventListener("click", callback);
            };
          case 'data':
            return {
              get : function(key){
                return target.dataset[key];
              },
              set: function(key, value){
                target.dataset[key] = value;
              },
              delete : function(key){
                delete target.dataset.key;
              }
            };
          case 'on':
            return function(event_type, callback){
              target.addEventListener(event_type, callback);
            };
          case 'unsub':
            return function(event_type, callback){
              target.removeEventListener(event_type, callback);
            };
          case 'fetch':

            return function(url, options = {}){
              target.dispatchEvent(new CustomEvent('fetching', {
                detail : {
                  url,
                  options,
                  element: target
                }
              }))
              fetch(url, options)
              .then(res => res.text())
              .then(data => {
                target.innerHTML = data;
                target.dispatchEvent(new CustomEvent('fetched', {
                  detail : {
                    url,
                    options,
                    element: target
                  }
                }));
              }).catch(error => {
                target.dispatchEvent(new CustomEvent('fetch-error', {
                  detail: {
                    url,
                    options,
                    error,
                    element: target
                  }
                }));
              });
            };
          case 'html':
            return {
              get: function(){
                return target.innerHTML
              },
              set: function(html){
                target.innerHTML = html;
              }
            };
          default:
            return target[props];
        }
      }

      return target;
      
    },
  });
}

function $$(query) {
  const el =  document.querySelectorAll(query);
  return new Proxy(el, {
    get(target, props, receiver) {
      if (props !== undefined) {
        switch (props) {
          case "click":
            return function (callback) {
              target.forEach(child => child.addEventListener('click', callback));
            }
          default:
            return target[props];
        }
      }
      return target;
    }
  })
}

function $c(query, props) {
  const el = document.createElement(query);
  if (props !== undefined) {
    for (const [key, value] of Object.entries(props)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}

function $id(id) {
  const el = document.getElementById(id);
  return new Proxy(el, {
    get(target, props, receiver) {
      if (props !== undefined) {
        switch (props) {
          case "click":
            return function (callback) {
              target.addEventListener("click", callback);
            };
          case 'data':
            return {
              get : function(key){
                return target.dataset[key];
              },
              set: function(key, value){
                target.dataset[key] = value;
              },
              delete : function(key){
                delete target.dataset.key;
              }
            };
          case 'on':
            return function(event_type, callback){
              target.addEventListener(event_type, callback);
            };
          case 'unsub':
            return function(event_type, callback){
              target.removeEventListener(event_type, callback);
            };
          case 'fetch':
            return function(url, options = {}){
              target.dispatchEvent(new CustomEvent('fetching', {
                detail : {
                  url,
                  options,
                  element: target
                }
              }))
              fetch(url, options)
              .then(res => res.text())
              .then(data => {
                target.innerHTML = data;
                target.dispatchEvent(new CustomEvent('fetched', {
                  detail : {
                    url,
                    options,
                    element: target
                  }
                }));
              }).catch(error => {
                target.dispatchEvent(new CustomEvent('fetch-error', {
                  detail: {
                    url,
                    options,
                    error,
                    element: target
                  }
                }));
              });
            };
          case 'html':
            return {
              get: function(){
                return target.innerHTML
              },
              set: function(html){
                target.innerHTML = html;
              }
            };
          default:
            return target[props];
          }
      }
      return target;
    },
  });
}

class Carousel extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {

    if (!window.carousel) window.carousel = this;
    else if (window.carousel && this.dataset.forceOverwrite) {
      window.carousel = this;
    } else {
      console.warn(
        "More than 1 carousel element has been detected. The window.carousel has been to assigned to the first carousel element detected. \nTo assign this element make sure to add 'data-force-overwrite' attribute to this element.\nOr assign via adding a 'data-label' attribute and access it via window.carousels."
      );
    }

    if (this.dataset.label) {
      if (this.dataset["force-overwrite"]) {
        console.error(
          "Cannot assign a label to a carousel element when 'data-force-overwrite' is present. Please remove 'data-force-overwrite' to assign a label."
        );
        return;
      }
      window.carousels[this.dataset.label] = this;
    }
  }

  disconnectedCallback() {
    if (window.carousel === this) {
      window.carousel = null;
    }
    if (this.dataset.label) {
      window.carousels[this.dataset.label] = null;
    }
  }

  static get instance() {
    return window.carousel;
  }

  static getInstance(instanceLabel) {
    return window.carousels[instanceLabel];
  }

  static get instances() {
    return window.carousels;
  }

  next() {
    let active_item = this.querySelector("[data-active]");
    var next_element_idx = Array.from(this.children).indexOf(active_item) + 1;
    var next_element =
      this.children[
        next_element_idx > this.children.length - 1 ? 0 : next_element_idx
      ];

    delete active_item.dataset["active"];
    next_element.dataset["active"] = "";
  }

  prev() {
    let active_item = this.querySelector("[data-active]");
    var prev_element_idx = Array.from(this.children).indexOf(active_item) - 1;
    var prev_element =
      this.children[
        prev_element_idx < 0 ? this.children.length - 1 : prev_element_idx
      ];

    delete active_item.dataset["active"];
    prev_element.dataset["active"] = "";
  }
}

class Sidebar extends HTMLElement {

  constructor() {
    super();
    if (!window.sidebar) window.sidebar = this;
  }

  static get instance() {
    return window.sidebar;
  }

  open() {
    this.setAttribute("open", "");
  }

  close() {
    this.removeAttribute("open");
  }

  toggle() {
    this.toggleAttribute("open");
  }
}

class Preloader extends HTMLElement {
  constructor() {
    super();
    if (!window.preloader) {
      window.preloader = this;
    }
  }

  disconnectedCallback() {
    window.preloader = null;
  }

  setLoadingPage(html) {
    this.loadingPage = html;
  }

  setFallbackPage(html) {
    this.fallbackPage = html;
  }

  load(url, options = {}) {
    this.innerHTML = this.loadingPage ?? "";
    fetch(url, options)
      .then((res) => res.text())
      .then((html) => {
        this.innerHTML = html;
      })
      .catch((error) => {
        console.error(error);
        this.innerHTML = this.fallbackPage ?? "";
      });
  }
}

class Popover extends HTMLElement {
  constructor(){
    super();

    this.attachShadow({ mode: 'open' });

    this.uniqueId = `popover-${Math.random().toString(36).substring(2, 9)}`;
    const anchorName = `--${this.uniqueId}-btn`;
    const popoverId = `${this.uniqueId}-content`;

    this.shadowRoot.innerHTML = `
        <style>
            .popup-btn {
                border: 0;
                background: none;
                cursor: pointer;

                anchor-name: ${anchorName};
            }

            #${popoverId} {
                position: relative;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);

                min-height: 10rem;
                min-width: 10rem;

                position-anchor: ${anchorName};
                top: anchor(bottom);
                left: anchor(left);
                margin: 10px 5px;

                &::backdrop {
                  background-color: rgba(0,0,0, 0.7);
                }
                
                & > div {
                    padding: 10px;
                    width: inherit;
                    height: 100%
                }

            }
        </style>

        <div>
            <button class="popup-btn" popovertarget="${popoverId}">
                <slot name="button"></slot>
            </button>

            <dialog popover id="${popoverId}">
                <slot name="content"></slot>
            </dialog>
        </div>
    `
  }

  get popoverContent(){
    return this.shadowRoot.getElementById(`${this.uniqueId}-content`);
  }

  connectedCallback(){
    const backgroundColor = this.getAttribute('background-color') ?? "#fff";

    if(backgroundColor){
      this.popoverContent.style.backgroundColor = backgroundColor;
    }

    typeof window.popoverLoaded == 'function' && window.popoverLoaded(this);
  }
}

class Modal extends HTMLDialogElement {
  constructor() {
    super();

    this._onTransitionEnd = this._onTransitionEnd.bind(this);
  }

  openModal() {
    this.showModal();

    requestAnimationFrame(() => (this.content.dataset["open"] = ""));
  }

  closeModal() {
    delete this.content.dataset["open"];

    this.content.addEventListener("transitionend", this._onTransitionEnd);
  }

  _onTransitionEnd(evt) {
    console.log(evt.propertyName);
    if (evt.propertyName === "scale") {
      this.close();
      this.content.removeEventListener("transitionend", this._onTransitionEnd);
    }
  }
  get content() {
    return this.querySelector("[data-content]");
  }
}

class Copyright extends HTMLElement {
  constructor(){
    super();

    const date = new Date();
    this.year = date.getFullYear();
  }

  connectedCallback(){
    this.innerHTML = `
      <span>&copy;${this.year}</span>
    `;
  }
}

class ScriptLetter extends HTMLElement {
  constructor(){
    super();
  }

  get words(){
    return this.getAttribute('data-words');
  }

  connectedCallback(){
    if(this.dataset.letter){
      this.innerHTML = `&${this.dataset.letter}scr;`;
    }

    if(this.words != undefined){
      const chars = (this.words).split('')
      const words = chars.map(c => `&${c}scr;`).join('');
      this.innerHTML = words;
    }
  }
}

class StatefulElement extends HTMLElement {

  #_states = {};

  get state(){
      return this.#_states;
  }

  set state(state_value){
      Object.assign(this.#_states, state_value);
      if(typeof this.render == 'function') this.shadowRoot.innerHTML = this.render(state_value);
  }

  constructor(){
      super();

      this.attachShadow({ mode: 'open' });

      this.shadowRoot.appendChild(document.createElement('style'));

      Object.defineProperties(this, {
        "styleSheet" : {
          value: (styles) => {
            this.shadowRoot.querySelector('style').innerHTML = styles;
          },
          configurable: false,
          writable: false,
          enumerable: false
        },
        "on" : {
          value: (event_type, callback) => {
            this.shadowRoot.addEventListener(event_type, callback);
          },
          configurable: false,
          writable: false,
          enumerable: false
        },
        "setState" : {
          value: (key, value) => {
            const prev = this.#_states[key];
            this.#_states[key] = typeof value == 'function' ? value(prev) : value;
            if(typeof this.render == 'function') this.shadowRoot.innerHTML = this.render(this.#_states);
          },
          configurable: false,
          writable: false,
          enumerable: false
        }
      });

      if(typeof this.render == 'function') this.shadowRoot.innerHTML = this.render(this.state);
  }

  render(state){};
}

class BreadCrumb extends HTMLElement {
  constructor(){
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        .breadcrumb-wrapper{
          list-style-type: none;
          display: flex;
          gap: 10px;
        }
      </style>

      <ul class="breadcrumb-wrapper">
        <slot></slot>
      </ul>
    `
  }

  connectedCallback(){
    this.renderFunctionalities();
    if(typeof window.breadCrumbLoaded == 'function') window.breadCrumbLoaded(this);
  }

  renderFunctionalities(){
    // Here, li elements inside this widget should be used as navigation if data-href has been applied:
    requestAnimationFrame(() => {
      // Filter only li elements from children
      const liElements = Array.from(this.children).filter(child => child.tagName.toLowerCase() === 'li');
      
      liElements.forEach(li => {
        if(li.hasAttribute('data-href')){
          li.addEventListener('click', (e) => {
            const href = li.getAttribute('data-href');
            e.preventDefault();
            if(href){
              if(li.hasAttribute('data-new-tab')){
                window.open(href, '_blank');
              }
              else{
                window.location.href = href;
              }
            }
          })
        }
      });
    })
  }

  smartRender(){
    const items = this.paths.map(path => {
      const name = path.charAt(0).toUpperCase() + path.slice(1);
      return `<li>${name}</li>`;
    }).join('');

    console.log(items)

    this.innerHTML = items;
  }

  get slotElement(){
    return this.shadowRoot.querySelector("slot");
  }

  get paths(){

    const extentions = ["html", "php", "htm"];

    var paths = window.location.pathname
    var pathArray = paths.split('/').filter(path => path != '');

    return pathArray.map(path => {
      var noExtensions = path.split('.').filter(p => !extentions.includes(p)).join('');
      var noDashLine = noExtensions.replace('-', " ");

      return noDashLine;
    });
  }
}

window.breadCrumbLoaded = function(breadCrumb){
  if(breadCrumb.hasAttribute('data-auto')){
    breadCrumb.smartRender();
  }
}

window.StatefulElement = StatefulElement;

customElements.define("html-sidebar", Sidebar);
customElements.define("html-carousel", Carousel);
customElements.define("html-preloader", Preloader);
customElements.define("html-popover", Popover);
customElements.define("html-modal", Modal, { extends: "dialog" });
customElements.define("html-copyright", Copyright);
customElements.define("html-scr", ScriptLetter);
customElements.define("html-breadcrumb", BreadCrumb);
