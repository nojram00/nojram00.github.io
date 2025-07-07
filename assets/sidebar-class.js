class HTMLSidebarElement extends HTMLElement {
    constructor(){
        super();
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