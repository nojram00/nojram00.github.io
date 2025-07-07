class HTMLSidebarElement extends HTMLElement {
    constructor(){
        super();

        this.shadow = this.attachShadow({mode : 'open'});
        this.style = document.createElement('style');
    }

    connectedCallback(){
        this.style.textContent = `
            :host {
                width: 240px;
                background-color: white;
                position: fixed;
                top: 0;
                left: -240px;
                transition: all 1s;
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
                display: block;
                height: 100%;
            }

            :host[open] {
                left: 0px;
            }

            :host[open][partial] {
                left: -75%;
            }
        `

        this.shadow.append(style);

        this.shadow.append(document.createElement('slot'));
    }

    open() {
        this.setAttribute('open', ''); 
    }

    close(){
        this.removeAttribute('open');
    }

    toggle(){
        this.hasAttribute('open') ? this.close() : this.open();
    }
}
customElements.define('html-sidebar', HTMLSidebarElement);