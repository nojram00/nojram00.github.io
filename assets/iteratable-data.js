
// document.addEventListener('DOMContentLoaded', function(){
//     const iteratables = document.querySelectorAll('[data-foreach]');
//     iteratables.forEach(iteratable => {
//         const replacedData = String(iteratable.dataset.foreach).replaceAll("'",'"');
//         const data = JSON.parse(replacedData);
//         Array.from(iteratable.children).forEach((child, index) => {
            
//         });
//     })
// })

function padnum(number, offset){
    let numstring = String(number);
    if(!Number.isNaN(Number(number))){
        for(let i = 0; i < offset; i++){
            numstring = '0' + numstring;
        }
    }
    return numstring;
}

console.log(padnum(5, 2))