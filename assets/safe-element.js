function tryGetElementById(id){
    const el =  this.getElementById(id);

    return new Proxy(el, {
        get(target, props, receiver){

            if(props == 'exists'){
                return el == undefined || el == null ? false : true;
            }
            return target;
        }
    });
}

function tryGetElement(query,element){
    if(element == undefined) element = document;
    const el = element.querySelector(query);

    return new Proxy(el, {
        get(target, props, receiver){
            if(props == 'exists'){
                return el == undefined && el == null;
            }

            if (el === null || el === undefined) {
                return undefined;
            }

            return Reflect.get(el, props, receiver);
        }
    });
}

Object.assign(document, {
    tryGetElementById
})