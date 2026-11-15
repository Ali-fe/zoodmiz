const http = require("http");
require('dotenv').config();

const { mongoConnect, mongoDisconnect } = require('./services/mongo');
const app = require("./app");

async function handler(req, res) {
    await mongoConnect();
    return app(req, res);
}

async function startServer() {
    const PORT = Number(process.env.PORT || 3000);
    if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
        throw new Error('PORT must be an integer between 1 and 65535');
    }

    await mongoConnect();

    const server = http.createServer(app);
    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(PORT, resolve);
    });

    console.log(`Server is listening on ${PORT}`);
}

if (require.main === module) {
    startServer().catch(async (error) => {
        const PORT = Number(process.env.PORT || 3000);
        if (error.code === 'EADDRINUSE') {
            console.error(`Cannot start server: port ${PORT} is already in use. Stop the existing server or set PORT to another available port.`);
        } else {
            console.error('Cannot start server:', error);
        }

        try {
            await mongoDisconnect();
        } catch (disconnectError) {
            console.error('Failed to disconnect MongoDB after startup failure:', disconnectError);
        }

        process.exitCode = 1;
    });
}

module.exports = handler;
