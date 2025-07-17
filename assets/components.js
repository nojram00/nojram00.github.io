window.carousels = {};

var prod = true;

document.addEventListener("DOMContentLoaded", function () {
  (function loadCss() {
    const cssLink = document.createElement("link");
    cssLink.type = "text/css";
    cssLink.rel = "stylesheet";
    cssLink.href = prod ? "/dist/components.min.css" : "/assets/components.css";

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
        }
      }

      return el;
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
        }
      }
      return el;
    }
  })
}

function $c(query) {
  return document.createElement(query);
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
        }
      }
      return el;
    },
  });
}

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
    window.carousel = null;
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
  static _instance = null;
  constructor() {
    super();

    // const shadow = this.attachShadow({ mode: "closed" });

    // const style = document.createElement("style");
    // style.textContent = `
    //         :host {
    //           position: fixed;
    //           top: 0;
    //           left: -240px;
    //           width: 240px;
    //           height: 100%;
    //           background: white;
    //           transition: left 0.3s ease;
    //           box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    //           display: block;
    //         }

    //         :host([open]), :host([partial][open]) {
    //           left: 0;
    //         }

    //         :host([partial]){
    //           left: -160px;
    //         }
    //       `;

    // shadow.appendChild(style);
    // shadow.appendChild(document.createElement("slot"));

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

class PopOver extends HTMLElement {
  constructor() {
    super();

    // this.direction = this.dataset['direction'] == undefined ? 'left' : this.dataset['direction'];
    this.direction = this.dataset["direction"] ?? "left";

    this.styleEl = document.createElement("style");
    this.styleEl.innerHTML = `
        :host{
            position: relative;
            min-width: 10px !important;
            height: auto;
        }
        ::slotted([data-toggle]){
            anchor-name: --anchor;
            width: 100%;
        }
        ::slotted([data-content]){
            margin-top: 10px;
            padding: 5px;
            border-radius: 5px;
            min-width: 80px;
            min-height: 200px;
            background-color: aqua;
            position: fixed;
            position-anchor: --anchor;
            box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
            top: calc(anchor(bottom) + 5px);

            transform: scale(0);
            transform-origin: left top;
            transition: transform .5s ease-in-out;
        }
        ::slotted([data-content][open]){
            transform: scale(1);
        }
    `;

    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadow.appendChild(this.styleEl);
    this.shadow.appendChild(document.createElement("slot"));

    requestAnimationFrame(() => {
      const button = this._find("toggle");
      const content = this._find("content");

      const rect = button.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      const willOverflow = rect.left + contentRect.width + 10 > viewportWidth;

      if (willOverflow) {
        content.style.left = `calc(anchor(right) - ${contentRect.width + 5}px)`;
        content.style.transformOrigin = "right top";
      } else {
        content.style.left = `calc(anchor(left) + 5px)`;
        content.style.transformOrigin = "left top";
      }

      button.addEventListener("click", () => {
        content.toggleAttribute("open");
      });
    });
  }

  _find(identifier) {
    return Array.from(this.children).filter(
      (child) => child.dataset[identifier] != undefined
    )[0];
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

customElements.define("html-sidebar", Sidebar);

customElements.define("html-carousel", Carousel);

customElements.define("html-preloader", Preloader);

customElements.define("html-popover", PopOver);

customElements.define("html-modal", Modal, { extends: "dialog" });
