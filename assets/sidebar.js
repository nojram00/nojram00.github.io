
document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('[toggle]').forEach(e => {
        e.addEventListener('click', function(){
            const sidebar = document.querySelector('sidebar');
            sidebar.hasAttribute('open') ? sidebar.removeAttribute('open') : sidebar.setAttribute('open', '')
        })
    })
})