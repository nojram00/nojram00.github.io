
document.addEventListener('DOMContentLoaded', function(){
    loadSidebar();
})

function loadSidebar(){

    function openSideBar(sidebar){
        sidebar.setAttribute('open', '');
        document.querySelectorAll('[toggle-open]').forEach(e => e.setAttribute('disabled', '')); 
        document.querySelectorAll('[toggle-close]').forEach(e => e.removeAttribute('disabled'));
    }

    function closeSideBar(sidebar){
        sidebar.removeAttribute('open');
        document.querySelectorAll('[toggle-open]').forEach(e => e.removeAttribute('disabled'));
        document.querySelectorAll('[toggle-close]').forEach(e => e.setAttribute('disabled', ''));
    }

    const sidebar = document.querySelector('sidebar');
    document.querySelectorAll('[toggle]').forEach(e => {
        e.addEventListener('click', function(){
            sidebar.hasAttribute('open') ? closeSideBar(sidebar) : openSideBar(sidebar);
        })
    })
    document.querySelectorAll('[toggle-open]').forEach(e => {
        e.addEventListener('click', () => {
            !sidebar.hasAttribute('open') && openSideBar(sidebar);
        });
    }); 
    document.querySelectorAll('[toggle-close]').forEach(e => {
        e.addEventListener('click', () => {
            sidebar.hasAttribute('open') && closeSideBar(sidebar);
        })
    })
}