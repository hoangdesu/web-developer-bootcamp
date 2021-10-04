// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png

const h1 = document.createElement('h1');
h1.innerText = "Doroke's Pokédex!";
h1.style.textAlign = 'center';
document.body.append(h1);

const div = document.createElement('div');
div.id = 'container';
div.style.width = '100vw';
div.style.margin = 'auto';
document.body.appendChild(div);

const container = document.querySelector('#container');

const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

for (let i = 0; i < 151; i++) {
    const imgDiv = document.createElement('div');
    const sprite = document.createElement('img');
    const pokeID = document.createElement('span');

    imgDiv.style.display = 'inline-block';
    imgDiv.style.textAlign = 'center';
    imgDiv.style.border = '1px solid pink';
    
    let spriteURL = `${baseURL}/${i+1}.png`
    sprite.setAttribute('src', spriteURL);
    sprite.style.width = '100px';
    sprite.style.display = 'block';
    
    pokeID.innerText = `#${i+1}`;

    imgDiv.append(sprite);
    imgDiv.append(pokeID);
    container.append(imgDiv);
}
