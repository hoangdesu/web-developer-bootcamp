const images = document.getElementsByTagName('img');

console.dir(images);

// Getting img sources 
for (let img of images) {
    console.log('img src:', img.src);
}

const firstImg = document.getElementById('first');
console.log('First img:', firstImg.src);

const imgClass = document.getElementsByClassName('second');
console.log('Img Class', imgClass[0].src);

// query
const img = document.querySelector('img');
console.log('first query', img);

const imgs = document.querySelectorAll('img');
console.log('all imgs', imgs);


// inner
const h1 = document.querySelector('h1');
h1.innerText = '日本';
h1.textContent = 'Nhật Bản'
h1.innerHTML = '<i>日本</i>';

// attributes
const content = document.querySelector('#content');
console.log(content.id);
content.id = 'blabla';
console.log(content.id);

const a = document.querySelector('a');
console.log(a.href);
a.target = '_blank';
a.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
console.log(a.getAttribute('href'));
a.setAttribute('title', '日本wiki')
console.log(a.getAttribute('title'));

// exercise
// The url you need: 'https://devsprouthosting.com/images/chicken.jpg'

// const img = document.querySelector('img');
// img.setAttribute('src', 'https://devsprouthosting.com/images/chicken.jpg');
// img.alt = 'chicken';

// styling
console.log(a.style);
const h1_style = window.getComputedStyle(h1);
console.log('fontSize:', h1_style.fontSize);
console.log('fontFamily:', h1_style.fontFamily);
console.log('margin:', h1_style.margin);
console.log('color:', h1_style.color);

// forest exercise
// const container = document.querySelector('#container');
// container.style.textAlign = 'center';

// const img = document.querySelector('img');
// img.style.width = '150px';
// img.style.borderRadius = '50%';

// rainbow text exercise
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']; //PLEASE DON'T CHANGE THIS LINE!

//YOU CODE GOES HERE:
const spans = document.querySelectorAll('h4 span');

for (let [i, span] of spans.entries()) {
    span.style.color = colors[i]
}

h1.classList.add('pink');
h1.classList.add('border');


const lis = document.querySelectorAll('ul li');
for (let l of lis) {
    l.classList.toggle('highlight');
}

// related
console.log('h1 parent:', h1.parentElement);
console.log('h1 children:', h1.children);
console.log('h1 child count:', h1.childElementCount);
console.log('img parent', img.parentElement);

// creating new element
const newImg = document.createElement('img');
const sushi = 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80';
newImg.src = sushi;
newImg.style.width = '50%';
newImg.classList.add('round');

const sushiTxt = document.createElement('h3');
sushiTxt.innerText = 'Sushiiiiiiiii';
sushiTxt.style.textAlign = 'center';


// append
document.body.appendChild(newImg);
document.body.appendChild(sushiTxt);

sushiTxt.append(' omg is so good', ' 🍣🥺');

// prepend
const afterTxt = document.createElement('b');
afterTxt.append('寿司 - ');
// sushiTxt.prepend(afterTxt);

newImg.insertAdjacentElement('beforebegin', afterTxt)

const sushiiii = document.createElement('h2');
sushiiii.innerText = 'Chuchiiiii';
document.querySelector('h2').insertAdjacentElement('afterend', sushiiii);
const sushiiii2 = document.createElement('h2');
sushiiii2.append('Chuchiiiii 2')
newImg.after(sushiiii2);


// 100 buttons exercise
const container = document.querySelector('#container');
for (let i = 0; i < 100; i++) {
    const btn = document.createElement('button');
    btn.innerText = `${i+1}. OMG😱`;
    container.appendChild(btn);
}

const btn13 = document.querySelector('button:nth-of-type(13)');
btn13.remove()

const btn99 = document.querySelector('button:nth-of-type(98)');
btn99.parentElement.removeChild(btn99)