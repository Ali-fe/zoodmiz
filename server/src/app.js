require('express-async-errors');
const express = require("express");
const api = require("./routers/api");
const path = require("path");
const morgan = require('morgan');
const { errorHandlerMiddleware } = require('./middeldwares/customMiddlewares');
//const { NotFoundError } = require('./errors/customErrors');
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/api', api);
app.use('/uploads',express.static(path.join(__dirname, '..','uploads')));
const publicDirectory = path.join(__dirname, '..', 'public');
app.use(express.static(publicDirectory, {
    setHeaders: (res, filePath) => {
        if (path.basename(filePath) === 'index.html') {
            res.setHeader('Cache-Control', 'no-store');
        }
    }
}));
app.use((req, res, next) => {
    if (path.extname(req.path)) {
        return res.status(404).type('text/plain').send('Not found');
    }
    next();
});
app.get('*', (req, res, next) => {
    if (!req.accepts('html') || path.extname(req.path)) return next();
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(errorHandlerMiddleware);

module.exports = app;