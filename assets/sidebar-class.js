class HTMLSidebarElement extends HTMLElement {
    constructor(props = {}){
        super();

        props.partial == undefined ? props.partial = false : props.partial = props.partial;
        const shadow = this.attachShadow({mode : 'open'});
        const style = document.createElement('style');

        style.textContent = `
            :host {
                max-width: ${props.defaultWidth ?? '240px'};
                background-color: white;
                position: fixed;
                top: 0;
                left: 0;
                transition: all ${props.duration ?? '1s'};
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
                display: block;
                height: 100%;
                width: 100%;
            }

            :host[open] {
                left: ${partial ? '-50%' : '-100%'};
            }
        `

        shadow.append(style);

        shadow.append(document.createElement('slot'));
    }

    open() {
        this.setAttribute('open', ''); 
    }

    close(){
        this.removeAttribute('open');
    }
}
customElements.define('html-sidebar', HTMLSidebarElement);