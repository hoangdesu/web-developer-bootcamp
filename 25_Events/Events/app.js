const btn2 = document.querySelector('#btn2');
btn2.onmouseenter = () => {
    alert('Dont touch me :((');
}

const btn3 = document.querySelector('#btn3');
btn3.addEventListener('click', () => {
    alert('MOREEEEEEEEEEEEEEE');
}, { once: true }) // can only execute this once