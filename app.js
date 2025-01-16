const express = require("express");
const api = require("./routers/api");
const app = express();

app.use(express.json());

app.use('/v1', api);

module.exports = app;