
document.addEventListener('DOMContentLoaded', function(){
    
    const nextbtn = document.querySelector('.next-btn');
    const prevbtn = document.querySelector('.prev-btn');
    const carousel = document.querySelector('.carousel-container');

    nextbtn.addEventListener('click', () => {
        let active_item = carousel.querySelector('[data-active]');
        var next_element_idx = Array.from(carousel.children).indexOf(active_item) + 1;
        var next_element = carousel.children[next_element_idx > carousel.children.length - 1 ? 0 : next_element_idx];

        delete active_item.dataset['active'];
        next_element.dataset['active'] = '';
        
    });

    prevbtn.addEventListener('click', () => {
        let active_item = carousel.querySelector('[data-active]');
        var prev_element_idx = Array.from(carousel.children).indexOf(active_item) - 1;
        var prev_element = carousel.children[prev_element_idx < 0 ? carousel.children.length - 1 : prev_element_idx];

        delete active_item.dataset['active'];
        prev_element.dataset['active'] = '';
    });
})

// auto toggle:

document.addEventListener('DOMContentLoaded', function(){
    const carousel = document.querySelector('.carousel-container');

    setInterval(() => {
        let active_item = carousel.querySelector('[data-active]');
        var next_element_idx = Array.from(carousel.children).indexOf(active_item) + 1;
        var next_element = carousel.children[next_element_idx > carousel.children.length - 1 ? 0 : next_element_idx];

        delete active_item.dataset['active'];
        next_element.dataset['active'] = '';
    }, 5000);
})


