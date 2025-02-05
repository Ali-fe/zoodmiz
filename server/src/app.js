const express = require("express");
const api = require("./routers/api");
const app = express();
const path = require("path");

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/v1', api);

app.use((req, res, next) => {
    const host = req.hostname; 
    const subdomain = host.split('.')[0]; 
    req.subdomain = subdomain;
    next();
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

module.exports = app;