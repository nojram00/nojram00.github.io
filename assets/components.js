window.carousels = {}

class Carousel extends HTMLElement {
  constructor() {
    super();

    this.styleEl = document.createElement("style");
    this.styleEl.innerHTML = `
            :host{
                width: 100%;
                height: 100% ;
                background-color: #191919;
                position: absolute !important;
            }

            ::slotted(*) {
                background-color: white;
                position: absolute !important;
                height: 100%;
                width: 100%;
                opacity: 0;
                inset: 0;
                padding: 0;
                z-index: 10;
                overflow: hidden;
                transition: .5s all ease-in-out;
            }

            ::slotted([data-active]) {
                opacity: 1;
            }
        `;

    this.shadow = this.attachShadow({ mode: "open" });
    this.slotElement = document.createElement("slot");

  }
  
  connectedCallback() {
    this.shadow.appendChild(this.styleEl);
    this.shadow.appendChild(this.slotElement);

    if(!window.carousel) window.carousel = this;
    else if(window.carousel && this.dataset.forceOverwrite){
      window.carousel = this;
    }
    else{
      console.warn("More than 1 carousel element has been detected. The window.carousel has been to assigned to the first carousel element detected. \nTo assign this element make sure to add 'data-force-overwrite' attribute to this element.\nOr assign via adding a 'data-label' attribute and access it via window.carousels.");
    }

    if(this.dataset.label){
      if (this.dataset['force-overwrite']) {
        console.error("Cannot assign a label to a carousel element when 'data-force-overwrite' is present. Please remove 'data-force-overwrite' to assign a label.");
        return;
      }
      window.carousels[this.dataset.label] = this;
    }
  }

  disconnectedCallback(){
    window.carousel = null;
  }

  static get instance() {
    return window.carousel;
  }

  static getInstance(instanceLabel){
    return window.carousels[instanceLabel];
  }

  static getInstances(){
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
  static _instance = null;
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = `
            :host {
              position: fixed;
              top: 0;
              left: -240px;
              width: 240px;
              height: 100%;
              background: white;
              transition: left 0.3s ease;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
              display: block;
            }
  
            :host([open]), :host([partial][open]) {
              left: 0;
            }
  
            :host([partial]){
              left: -160px;
            }
          `;

    shadow.appendChild(style);
    shadow.appendChild(document.createElement("slot"));

    if(!window.sidebar) window.sidebar = this;
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
  constructor(){
    super();
    if(!window.preloader) {
      window.preloader = this
    };
  }

  disconnectedCallback(){
    window.preloader = null;
  }

  setLoadingPage(html){
    this.loadingPage = html;
  }

  setFallbackPage(html){
    this.fallbackPage = html;
  }

  load(url, options = {}){
    this.innerHTML = this.loadingPage ?? '';
    fetch(url, options).then(res => res.text())
    .then(html => {
        this.innerHTML = html;
    })
    .catch((error) => {
      console.error(error);
      this.innerHTML = this.fallbackPage ?? '';
    });
  }
}

class PopOver extends HTMLElement {
  constructor(){
    super();
    this.styleEl = document.createElement("style");
    this.styleEl.innerHTML = `
        :host{
            position: relative;
            min-width: 240px !important;
            height: auto;
        }
        ::slotted([data-toggle]){
            anchor-name: --anchor;
            width: fit-content;
        }
        ::slotted([data-content]){
            margin-top: 10px;
            padding: 5px;
            border-radius: 5px;
            min-width: 80px;
            min-height: 200px;
            background-color: aqua;
            position: absolute;
            position-anchor: --anchor;
            box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);

            transform: scale(0);
            transform-origin: left top;
            transition: transform .5s ease-in-out;
        }
        ::slotted([data-content][open]){
            transform: scale(1);
        }
    `

    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(){
    this.shadow.appendChild(this.styleEl);
    this.shadow.appendChild(document.createElement("slot"));

    requestAnimationFrame(() => this.initContent());
  }

  initContent(){
    const button = this._find('toggle');
    const content = this._find('content');

    button.addEventListener('click', () => {
      content.toggleAttribute('open');
    });
  }

  _find(identifier){
    return Array.from(this.children).filter(child => child.dataset[identifier] != undefined)[0]
  }
}

customElements.define("html-sidebar", Sidebar);

customElements.define("html-carousel", Carousel);

customElements.define("html-preloader", Preloader);

customElements.define("html-popover", PopOver);
