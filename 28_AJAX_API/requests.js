// --- XHR ---
// const xhr = new XMLHttpRequest();

// xhr.onload = function () {
//     const data = JSON.parse(this.responseText);
//     console.log('From XHR:', data.joke);
// };
// xhr.onerror = err => {
//     console.log('Request error:', err);
// };
// xhr.open('get', 'https://icanhazdadjoke.com/', true);
// xhr.setRequestHeader('Accept', 'application/json');
// xhr.send();

// -- Fetch API ---
// promise version
// fetch('https://pokeapi.co/api/v2/pokemon/25')
//     .then(res => res.json())
//     .then(data => console.log(data))
//     .catch(err => console.log(err));

// async version - using IIFE
(async () => {
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon/25');
        console.log(res);
        const data = await res.json();
        console.log(data);
        console.log(data.name);
    } catch (err) {
        console.log('Error:', err);
    }
})();

// getPikachu();

// fetch with header params
// fetch('https://icanhazdadjoke.com/', {
//     method: 'get',
//     headers: { 'Accept': 'application/json' },
// })
//     .then((res) => res.json())
//     .then((data) => console.log(data.joke));

// Axios
// axios.get('https://animechan.vercel.app/api/random')
//     .then(res => console.log(res.data))
//     .catch(err => console.log('Something went wrong', err));

const getDadJoke = async () => {
    const options = { headers: { Accept: 'application/json' } };
    const res = await axios.get('https://icanhazdadjoke.com', options);
    const jokeP = document.createElement('li');
    jokeP.innerText = res.data.joke;
    document.querySelector('#request').append(jokeP);
}

document.querySelector('button').addEventListener('click', getDadJoke);