// Leave the next line, the form must be assigned to a variable named 'form' in order for the exercise test to pass
const form = document.querySelector('form');

form.addEventListener('submit', e => {
    e.preventDefault();
    // select elements
    const product = document.querySelector('#product');
    const qty = document.querySelector('#qty');
    const ul = document.querySelector('#list');
    const li = document.createElement('li');
    const item = `${qty.value} ${product.value}`;
    li.innerText = item;
    
    ul.appendChild(li);
    
    // reset inputs
    product.value = '';
    qty.value = '';
})