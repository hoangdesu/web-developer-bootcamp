const express = require('express');
const app = express();
const cookiesParser = require('cookie-parser');
const session = require('express-session');

const PORT = 3000;

app.use(session({ secret: 'hehe' }));
app.use(cookiesParser());

app.get('/pageviews', (req, res) => {
    if (!req.session.count) req.session.count = 0;
    req.session.count++;
    res.send(`- You have viewed this page ${req.session.count} times <br>- This session id: ${req.cookies['connect.sid']}`);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
