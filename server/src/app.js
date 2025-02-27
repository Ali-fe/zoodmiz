const express = require("express");
const api = require("./routers/api");
const app = express();
const path = require("path");
const morgan = require ('morgan');
const { handelError , getSubdomain } = require('./middeldwares/customMiddlewares');
const { NotFoundError } = require('./errors/customErrors');
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
// app.use((req,res)=>{
//     throw new NotFoundError("گامشو");
// });
app.use('/api', api);
//app.use(getSubdomain);


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });
app.use(handelError);

module.exports = app;