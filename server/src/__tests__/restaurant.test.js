const mongoose = require('mongoose');

const Restaurant = require('../models/restaurant.model');
const User = require('../models/user.model');
const Table = require('../models/table.model');
const Order = require('../models/order.model');
const { startTestServer } = require('../../test/testServer');

let helpers;
let api;
let cookie;
let restaurant;

const localDayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const todayAt = (hour) => {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d;
};

const orderItem = (price, quantity, discount) => ({
  edible: new mongoose.Types.ObjectId(),
  name: 'چلو کباب',
  quantity,
  price,
  discount,
});

beforeAll(async () => {
  helpers = await startTestServer({ database: 'zoodmiz_restaurant_test' });
  api = helpers.api;

  restaurant = await Restaurant.create({
    name: 'رستوران تست',
    phone: '09121110000',
    description: 'رستوران آزمایشی',
    address: { city: 'مشهد', street: '.imamReza', buildingNumber: 12 },
    location: { lat: 36.297, lng: 59.606 },
  });

  const owner = await User.create({
    name: 'Test',
    lastName: 'Owner',
    email: 'owner.test@zoodmiz.ir',
    password: 'unused-in-tests',
    phone: '09121110001',
    role: 'admin',
    restaurant: restaurant._id,
  });
  cookie = helpers.ownerCookie({ userId: owner._id, restaurantId: restaurant._id });
});

afterAll(async () => {
  await helpers.close();
});

describe('owner restaurant endpoints', () => {
  it('rejects a request without an auth cookie', async () => {
    const response = await api.get('/restaurants');
    expect(response.status).toBe(401);
  });

  it('rejects a forged auth cookie', async () => {
    const response = await api.get('/restaurants', { headers: { Cookie: 'token=not-a-real-token' } });
    expect(response.status).toBe(401);
  });

  it('returns the authenticated restaurant', async () => {
    const response = await api.get('/restaurants', { headers: { Cookie: cookie } });
    expect(response.status).toBe(200);
    expect(response.data.restaurant._id).toBe(restaurant.id);
    expect(response.data.restaurant.name).toBe('رستوران تست');
    expect(response.data.restaurant.address.city).toBe('مشهد');
  });

  it('updates name, city and coordinates', async () => {
    const response = await api.patch(
      '/restaurants',
      {
        name: 'رستوران تست نو',
        phone: '09121110000',
        address: { city: 'تهران', buildingNumber: 44 },
        location: { lat: 35.7, lng: 51.4 },
      },
      { headers: { Cookie: cookie } }
    );
    expect(response.status).toBe(200);
    expect(response.data.restaurant.name).toBe('رستوران تست نو');
    expect(response.data.restaurant.location.lat).toBe(35.7);

    const check = await api.get('/restaurants', { headers: { Cookie: cookie } });
    expect(check.data.restaurant.address.city).toBe('تهران');
  });

  it('rejects an invalid phone on update', async () => {
    const response = await api.patch(
      '/restaurants',
      { name: 'رستوران تست نو', phone: 'not-a-phone' },
      { headers: { Cookie: cookie } }
    );
    expect(response.status).toBe(400);
  });
});

describe('owner table endpoints', () => {
  let tableId;

  it('creates a table with a menu url', async () => {
    const response = await api.post(
      '/restaurants/tables',
      { numeral: 7, capacity: 4 },
      { headers: { Cookie: cookie } }
    );
    expect(response.status).toBe(201);
    expect(response.data.table.numeral).toBe(7);
    expect(response.data.table.menuUrl).toContain(restaurant.id);
    tableId = response.data.table._id;
  });

  it('rejects a duplicated table numeral', async () => {
    const response = await api.post(
      '/restaurants/tables',
      { numeral: 7, capacity: 2 },
      { headers: { Cookie: cookie } }
    );
    expect(response.status).toBe(400);
  });

  it('lists the tables of the restaurant', async () => {
    const response = await api.get('/restaurants/tables', { headers: { Cookie: cookie } });
    expect(response.status).toBe(200);
    expect(response.data.tables.map((table) => table.numeral)).toEqual([7]);
  });

  it('marks a table as occupied', async () => {
    const response = await api.patch(
      `/restaurants/tables/${tableId}`,
      { numeral: 7, capacity: 4, status: 'occupied' },
      { headers: { Cookie: cookie } }
    );
    expect(response.status).toBe(200);
    expect(response.data.tables.status).toBe('occupied');
  });

  it('deletes a table', async () => {
    const response = await api.delete(`/restaurants/tables/${tableId}`, { headers: { Cookie: cookie } });
    expect(response.status).toBe(200);
    expect(await Table.countDocuments({ _id: tableId })).toBe(0);
  });
});

describe('owner signup and login', () => {
  it('registers an owner and logs them in with a usable cookie', async () => {
    const credentials = {
      name: 'New',
      lastName: 'Restaurateur',
      email: 'new.owner@zoodmiz.ir',
      password: 'zoodmiz1234',
      phone: '+989121110002',
      restaurantName: 'رستوران جدید تست',
    };

    const registered = await api.post('/auth/register', credentials);
    expect(registered.status).toBe(201);

    const loggedIn = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    expect(loggedIn.status).toBe(200);

    const setCookie = loggedIn.headers['set-cookie'].find((c) => c.startsWith('token='));
    expect(setCookie).toBeDefined();
    const sessionCookie = `token=${setCookie.split(';')[0].split('=').slice(1).join('=')}`;

    const mine = await api.get('/restaurants', { headers: { Cookie: sessionCookie } });
    expect(mine.status).toBe(200);
    expect(mine.data.restaurant.name).toBe('رستوران جدید تست');

    const created = await Restaurant.findOne({ name: 'رستوران جدید تست' });
    expect(created).toBeTruthy();
    expect(await User.countDocuments({ restaurant: created._id })).toBe(1);
  });

  it('rejects a wrong password', async () => {
    const response = await api.post('/auth/login', {
      email: 'owner.test@zoodmiz.ir',
      password: 'wrong-password',
    });
    expect(response.status).toBe(401);
  });
});

describe('public restaurant discovery', () => {
  it('lists active restaurants without authentication', async () => {
    const response = await api.get('/customer/restaurants');
    expect(response.status).toBe(200);
    const found = response.data.restaurants.find((r) => r._id === restaurant.id);
    expect(found.name).toBe('رستوران تست نو');
    expect(found.location).toEqual({ lat: 35.7, lng: 51.4 });
  });

  it('returns 404 for a menu of an unknown restaurant', async () => {
    const response = await api.get(`/customer/menu/${new mongoose.Types.ObjectId()}`);
    expect(response.status).toBe(404);
  });
});

describe('restaurant stats', () => {
  beforeAll(async () => {
    await Order.create({
      restaurant: restaurant._id,
      table: 1,
      status: 'delivered',
      customerName: 'مشتری یک',
      customerPhone: '091200000001',
      createdAt: todayAt(11),
      items: [orderItem(100000, 2, 10)],
    });
    await Order.create({
      restaurant: restaurant._id,
      table: 2,
      status: 'pending',
      customerName: 'مشتری دو',
      customerPhone: '091200000002',
      createdAt: todayAt(12),
      items: [orderItem(50000, 1, 0)],
    });
    await Order.create({
      restaurant: restaurant._id,
      table: 3,
      status: 'delivered',
      customerName: 'مشتری سه',
      customerPhone: '091200000003',
      createdAt: todayAt(11) - 24 * 60 * 60 * 1000,
      items: [orderItem(80000, 1, 0)],
    });
  });

  it('keeps yesterday out of the today counters', async () => {
    const response = await api.get('/restaurants/stats', { headers: { Cookie: cookie } });
    expect(response.status).toBe(200);

    const { stats } = response.data;
    // 2 x 100000 minus a 10% discount, plus a plain 50000 order
    expect(stats.todayRevenue).toBe(230000);
    expect(stats.todayOrders).toBe(2);
    expect(stats.pendingOrders).toBe(1);
    expect(stats.newCustomers).toBe(3);
    expect(stats.activeReservations).toBe(0);
  });

  it('buckets revenue by the local day, not the utc day', async () => {
    const response = await api.get('/restaurants/stats', { headers: { Cookie: cookie } });
    const { stats } = response.data;

    expect(stats.daily).toHaveLength(7);
    const today = stats.daily[6];
    expect(today.date).toBe(localDayKey(new Date()));
    expect(today.orders).toBe(2);

    const yesterday = stats.daily[5];
    expect(yesterday.date).toBe(localDayKey(new Date(todayAt(11).getTime() - 24 * 60 * 60 * 1000)));
    expect(yesterday.revenue).toBe(80000);

    expect(stats.monthly).toHaveLength(12);
    expect(stats.monthly[11].month).toBe(localDayKey(new Date()).slice(0, 7));
  });

  it('averages orders over the last thirty days', async () => {
    const response = await api.get('/restaurants/stats', { headers: { Cookie: cookie } });
    const { stats } = response.data;
    expect(stats.averageOrder).toBe(Math.round((180000 + 50000 + 80000) / 3));
  });

  it('ignores cancelled orders', async () => {
    await Order.create({
      restaurant: restaurant._id,
      table: 4,
      status: 'cancelled',
      customerName: 'مشتری چهار',
      customerPhone: '091200000004',
      items: [orderItem(90000, 1, 0)],
    });
    const response = await api.get('/restaurants/stats', { headers: { Cookie: cookie } });
    expect(response.data.stats.todayOrders).toBe(2);
  });
});
