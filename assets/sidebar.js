
document.addEventListener('DOMContentLoaded', function(){
    loadSidebar();
})

function loadSidebar(){
    const sidebar = document.querySelector('sidebar');
    document.querySelectorAll('[toggle]').forEach(e => {
        e.addEventListener('click', function(){
            sidebar.hasAttribute('open') ? sidebar.removeAttribute('open') : sidebar.setAttribute('open', '')
        })
    })
    document.querySelectorAll('[toggle-open]').forEach(e => {
        e.addEventListener('click', () => {
            if(!sidebar.hasAttribute('open')) {
                sidebar.setAttribute('open', '');
                document.querySelectorAll('[toggle-open]').forEach(e => e.setAttribute('disabled', '')); 
                document.querySelectorAll('[toggle-close]').forEach(e => e.removeAttribute('disabled'));
            }
        });
    }); 
    document.querySelectorAll('[toggle-close]').forEach(e => {
        e.addEventListener('click', () => {
            if(sidebar.hasAttribute('open')) {
                sidebar.removeAttribute('open');
                document.querySelectorAll('[toggle-open]').forEach(e => e.removeAttribute('disabled'));
                document.querySelectorAll('[toggle-close]').forEach(e => e.setAttribute('disabled', '')); 
            };
        })
    })
}