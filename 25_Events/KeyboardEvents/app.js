const input = document.querySelector('#txt');

input.addEventListener('keydown', (e) => {
    console.log(e);
})

window.addEventListener('keydown', function (e) {
    console.log('KEY:', e.key);
    console.log('Code:', e.code);
})