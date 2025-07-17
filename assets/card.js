class HTMLCardElement extends HTMLElement {
    constructor(){
        super();

        this._props = {};
    }

    connectedCallback(){
        Object.assign(this._props, this.dataset);

        const shadow = this.attachShadow({mode: "closed"});

        const style = document.createElement("style");
        style.textContent = `
            :host {
                display: block;
                width: 100%;
                height: 100%;
                background: white;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                padding: 20px;
                box-sizing: border-box;
            }
        `;

        const slot = document.createElement("slot");

        shadow.appendChild(style);
        shadow.appendChild(slot);
        this.innerHTML = `
            <div>
                ${this._props.title || "Card Title"}
            </div>
        `

        this.style.maxWidth = this._props.width || "200px";
    }
}

customElements.define("html-card", HTMLCardElement);