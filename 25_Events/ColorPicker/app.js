const body = document.querySelector('body');
const btn = document.querySelector('#btnClick');
const text = document.querySelector('#rgbText');

const getRand = () => Math.floor(Math.random() * 255);

btn.addEventListener('click', () => {
    let r = getRand();
    let g = getRand();
    let b = getRand();
    let color = `rgb(${r}, ${g}, ${b})`
    body.style.backgroundColor = color;
    text.innerText = color;
})