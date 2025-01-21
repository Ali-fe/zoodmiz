const express = require("express");
const api = require("./routers/api");
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    const host = req.hostname; 
    const subdomain = host.split('.')[0]; 
    req.subdomain = subdomain;
    next();
});

app.use('/v1', api);

module.exports = app;