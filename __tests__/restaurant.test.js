
const http = require("http");
const axios = require('axios');
require('dotenv').config();

//const path = require("path");
const { mongoConnect,mongoDisconnect } = require('./../services/mongo');
const app = require("./../app");


const PORT = process.env.PORT
const baseURL = `http://localhost:${PORT}`;
const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    server.listen(PORT, () => {
        console.log(`Server is listening on ${PORT} for jest`);
    });
}

beforeAll(async () => {
    await startServer();
});

afterAll(async () => {
  await mongoDisconnect();
});


describe('Create New Restaurant', () => {
    
    it('should create a new restaurant', async () => {
        const newRestaurant = {
          Subdomain: 'test-restaurant',
          Name: 'Test Restaurant',
          Description : 'dfdfdssdfdfdfdfs',
          Phone: "0904444",
          Address: {
            Street: 'Test Street',
            City: 'Test City',
            PostalCode: '12345',
            BuildingNumber: 42,
          },
          Location: { Lat: 40.7128, Lng: -74.0060 },
        };
    
        const response = await axios.post(`${baseURL}/v1/restaurants`, newRestaurant);
        expect(response.status).toBe(201);
        
        expect(response.data.restaurant).toHaveProperty('_id');
        expect(response.data.restaurant.Name).toBe('Test Restaurant');
      });
});
