const express = require("express");
const api = require("./routers/api");
const app = express();
const path = require("path");

app.use(express.json());
app.use('/v1', api);

app.use('/',express.static(path.join(__dirname,"/../../client/","public")));

app.use((req, res, next) => {
    const host = req.hostname; 
    const subdomain = host.split('.')[0]; 
    req.subdomain = subdomain;
    next();
});



module.exports = app;