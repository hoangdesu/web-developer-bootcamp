const express = require('express');
const app = express();

const champRoutes = require('./routes/champs');
const adminRoutes = require('./routes/admin');

const PORT = 3000;

app.use('/champs', champRoutes);

app.use('/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
