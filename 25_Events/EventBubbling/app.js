const container = document.querySelector('#container');
const color = document.querySelector('#color');

const getRandColor = () => {
    let s = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        let randIndex = Math.floor(Math.random() * s.length);
        color += s[randIndex];
    }
    return color;
}

color.addEventListener('click', function(e) {
    container.style.backgroundColor = getRandColor();
    e.stopPropagation();
})

container.addEventListener('click', function(e) {
    container.classList.toggle('hide');
})