const express = require('express');
const app = express();
const PORT = 3000;

let visitCount = 0;

// --- call everytime the app receive a request ---
// app.use((req, res) => {
//     visitCount++;
//     console.log(`Got ${visitCount} visits!`);
//     console.log('Request URL:', req.url);
//     res.send(`<h1>You are the visitor: ${visitCount}</h1>`);
// });


// --- basic routings ---
app.get('/', (req, res) => {
    const simpleWeb = `
    <h1>My mains 🥺</h1>
    <a href="/zed">Zed</a><br>
    <a href="/leblanc">LeBlanc</a><br>
    <a href="/zoe">Zoe</a><br>
    `;
    res.send(simpleWeb)
});

app.get('/zed', (req, res) => {
    const content = `
    <h1>Zed</h1>
    <img src="https://cdn.tgdd.vn/2020/09/content/galaxy-slayer-zed-splash-art-lol-uhdpaper.com-4K-64-800x450.jpg">
    `;
    res.send(content);
});

app.get('/leblanc', (req, res) => {
    const content = `
    <h1>LeBlanc</h1>
    <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Leblanc_3.jpg">
    `;
    res.send(content);
});

app.get('/zoe', (req, res) => {
    const content = `
    <h1>Zoe</h1>
    <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zoe_0.jpg">
    `;
    res.send(content);
});

// for POST request
app.post('/add', (req, res) => {
    res.send('Added a champ!');
});


// --- Path parameters ---
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    res.send(`<h1>Welcome to <u>${subreddit}</u> subreddit!</h1>`);
});

app.get('/introduce/:name/:work', (req, res) => {
    const { name, work } = req.params;
    res.send(`Hi my name is ${titleCase(name)}. I'm a ${work}!`);
});

// ---> http://localhost:3000/introduce/hoang/developer



// --- Query Strings ---
app.get('/search', (req, res) => {
    const actress = req.query.actress;

    if (Object.keys(req.query).length === 0) {
        res.send("Nothing found if nothing search :/");
    }
    
    // or just simply if (!req.query.year)
    else if (req.query.year !== undefined) { 
        res.send(`<h1>Search for: ${actress} in ${req.query.year}</h1>`);
    }
    else {
        res.send(`<h1>Search for: ${actress}</h1>`);
    }
});





// responds to everything else. PLACE LAST!
app.get('*', (req, res) => {
    res.send(`Not found ¯\\_(ツ)_/¯ `);
});


// start server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});



// --- not related stuff :/
function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}