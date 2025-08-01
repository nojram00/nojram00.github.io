class MySidebar extends HTMLElement {
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

    if(MySidebar._instance) throw new Error("Only one sidebar allowed");
    MySidebar._instance = this;
  }

  static get instance(){
    return MySidebar._instance;
  }

  open() {
    this.setAttribute("open", "");
  }

  close() {
    this.removeAttribute("open");
  }

  toggle() {
    this.toggleAttribute('open');
  }
}

customElements.define("html-sidebar", MySidebar);
