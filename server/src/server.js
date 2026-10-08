const http = require("http");
require('dotenv').config();

//const path = require("path");
const { mongoConnect } = require('./services/mongo');
const app = require("./app");


const PORT = process.env.PORT
const server = http.createServer(app);

async function startServer() {

    await mongoConnect();

    server.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}`);
    });
}
startServer();

