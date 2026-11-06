const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const http = require('http');
const mongoose = require('mongoose');
const axios = require('axios');

const app = require('../src/app');
const { createJWT } = require('../src/utils/tokenUtils');

// each suite gets its own database so parallel runs never touch the development data
const testUrl = (database) => {
  if (!process.env.MONGO_URL) throw new Error('MONGO_URL is not set');
  const url = new URL(process.env.MONGO_URL);
  url.pathname = `/${database}`;
  return url.toString();
};

const startTestServer = async ({ database }) => {
  await mongoose.connect(testUrl(database));
  // fixtures are rebuilt by every suite, so a run must never inherit the previous one
  await mongoose.connection.dropDatabase();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const baseURL = `http://127.0.0.1:${server.address().port}/api`;

  const api = axios.create({ baseURL, validateStatus: () => true });

  return {
    api,
    ownerCookie: ({ userId, restaurantId }) =>
      `token=${createJWT({ userId, role: 'admin', restaurantId })}`,
    customerCookie: ({ customerId, phone }) =>
      `customerToken=${createJWT({ customerId, phone, role: 'customer' })}`,
    close: async () => {
      await new Promise((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve()))
      );
      await mongoose.disconnect();
    },
  };
};

module.exports = { startTestServer };
