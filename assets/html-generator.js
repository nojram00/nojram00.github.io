class HTMLGenerator{
    constructor(element, props){
        this._element = document.createElement(element);

        Object.assign(this._element.attributes, props);
    }

    render(root){
        root.appendChild(this._element);
    }

    assign(child){
        this._element.appendChild(child);

        return this;
    }

    html(html){
        this._element.innerHTML = html;
        return this;
    }

    appendHtml(html){
        this._element.innerHTML += html;
        return this;
    }
}