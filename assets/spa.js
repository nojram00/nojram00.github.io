function fetchHTML({
    dom, url, options, onLoading, onError, onSuccess
}){

    if (dom == undefined) dom = document.body;

    if(typeof onLoading == 'function') onLoading(dom);

    fetch(url, options).then(res => res.text())
        .then(data => {
            dom.innerHTML = data;
            if(typeof onSuccess == 'function') onSuccess(dom);
            if(typeof window.onSuccess == 'function') window.onSuccess(dom)
            document.dispatchEvent(new CustomEvent('FetchedHTML', {
                detail : {
                    dom
                }
            }));
        })
        .catch(err => {
            if(typeof onError == 'function' ) onError(dom);
        });
    
}

var root = document.body;
var loadingDom = '<div>Loading... </div>';

function init(url){
    fetchHTML({
        url: url,
        dom: root,
        onLoading: function(dom) {
            dom.innerHTML = loadingDom;
        }
    })
}

document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('[data-href]').forEach(el => {
        const href = el.dataset.href;

        el.addEventListener('click', function(e) {
            e.preventDefault();
            fetchHTML({
                dom: root,
                url: href,
                onLoading: function(dom){
                    dom.innerHTML = loadingDom
                }
            });
        });
    });
});

document.addEventListener('FetchedHTML', function(){
    document.querySelectorAll('[data-href]').forEach(el => {
        const href = el.dataset.href;

        el.addEventListener('click', function(e) {
            e.preventDefault();
            fetchHTML({
                dom: root,
                url: href,
                onLoading: function(dom){
                    dom.innerHTML = loadingDom
                }
            });
        });
    });
});