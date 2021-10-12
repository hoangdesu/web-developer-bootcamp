const h1 = document.querySelector('h1');
const inp = document.querySelector('input');

inp.addEventListener('change', function() {
    console.log(inp.value);
    h1.innerText = 'You clicked away!';
})

inp.addEventListener('input', function(e) {
    h1.innerText = this.value;
})


const hd1 = document.querySelector('#hd1');
const input = document.querySelector('#username');

input.addEventListener('input', function(e) {
    if (input.value === '') {
        hd1.innerText = 'Enter Your Username';    
    } else {
        hd1.innerText = `Welcome, ${input.value}`;
    }
})

