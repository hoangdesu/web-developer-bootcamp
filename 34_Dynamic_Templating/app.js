const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const axios = require('axios');
const champs = require('../32_NPM_Modules/champs');
const popularTickers = ["BTC","LTC","ETH","NEO","BNB","QTUM","EOS","SNT","BNT","GAS","BCC","USDT","HSR","OAX","DNT","MCO","ICN","ZRX","OMG","WTC","YOYO","LRC","TRX","SNGLS","STRAT","BQX","FUN","KNC","CDT","XVG","IOTA","SNM","LINK","CVC","TNT","REP","MDA","MTL","SALT","NULS","SUB","STX","MTH","ADX","ETC","ENG","ZEC","AST","GNT","DGD","BAT","DASH","POWR","BTG","REQ","XMR","EVX","VIB","ENJ","VEN","ARK","XRP","MOD","STORJ","KMD","RCN","EDO","DATA","DLT","MANA","PPT","RDN","GXS","AMB","ARN","BCPT","CND","GVT","POE","BTS","FUEL","XZC","QSP","LSK","BCD","ADA"];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// render a view
app.get('/', (req, res) => {
    console.log('Received a request');
    res.render('home', { popularTickers });
});

// passing value from app to template using 2nd argument
app.get('/lucky', (req, res) => {
    const randNum = Math.floor(Math.random() * 100) + 1;
    const name = 'Brian';
    res.render('lucky', { rand: randNum, name });
});

// insta template
app.get('/insta/:user', (req, res) => {
    const { user } = req.params;
    res.render('instagram', { user });
});

// loops -- champs data from section 32
app.get('/mains', (req, res) => {
    const path = require.resolve('../32_NPM_Modules/champs');
    res.render('mains', { champs, path });
});

// Crypto price page
app.get('/crypto/:ticker', (req, res) => {
    const { ticker } = req.params;
    const requestURL = `https://api.cryptonator.com/api/ticker/${ticker}-usdt`;
    axios.request(requestURL)
        .then((response) => {
            const data = response.data; 
            console.log(data);
            if (data.success) {
                res.render('crypto.ejs', { ...data });
            } else {
                res.send('Ticker symbol Not found');
            }
        });
    })

// serving static assets
app.use(express.static(path.join(__dirname, '/public')));


// Express + Bootstrap: get random pokemon page
// something wrong with axios requests, server sometimes crash :/
app.get('/pokemon', (req, res) => {
    const randID = Math.floor(Math.random() * 151) + 1;
    const URL = `https://pokeapi.co/api/v2/pokemon/${randID}`;
    // const speciesURL = `https://pokeapi.co/api/v2/pokemon-species/${randID}`;
    try {
    axios.request(URL)
        .then(response => {
            console.log(response.data);
            res.render('pokemon', { ...response.data });
        })
    } catch (err) {
        res.send('Request timeout');
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

