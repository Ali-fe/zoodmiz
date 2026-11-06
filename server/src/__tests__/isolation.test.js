const mongoose = require('mongoose');
const FormData = require('form-data');

const Restaurant = require('../models/restaurant.model');
const User = require('../models/user.model');
const Edible = require('../models/edible.model');
const Order = require('../models/order.model');
const { startTestServer } = require('../../test/testServer');

let helpers;
let api;
let ownerACookie;
let ownerBCookie;
let restaurantA;
let restaurantB;
let edibleA;
let edibleB;
let orderA;
let orderB;

beforeAll(async () => {
  helpers = await startTestServer({ database: 'zoodmiz_isolation_test' });
  api = helpers.api;

  restaurantA = await Restaurant.create({ name: 'رستوران الف' });
  restaurantB = await Restaurant.create({ name: 'رستوران بی' });
  await Restaurant.create({ name: 'رستوران تعطیل', isActive: false });

  const ownerA = await User.create({
    name: 'A',
    lastName: 'Owner',
    email: 'a@zoodmiz.ir',
    password: 'unused-in-tests',
    phone: '09120000010',
    role: 'admin',
    restaurant: restaurantA._id,
  });
  const ownerB = await User.create({
    name: 'B',
    lastName: 'Owner',
    email: 'b@zoodmiz.ir',
    password: 'unused-in-tests',
    phone: '09120000011',
    role: 'admin',
    restaurant: restaurantB._id,
  });
  ownerACookie = helpers.ownerCookie({ userId: ownerA._id, restaurantId: restaurantA._id });
  ownerBCookie = helpers.ownerCookie({ userId: ownerB._id, restaurantId: restaurantB._id });

  edibleA = await Edible.create({
    restaurant: restaurantA._id,
    name: 'کباب کوبیده',
    price: 120000,
    menu: true,
  });
  edibleB = await Edible.create({
    restaurant: restaurantB._id,
    name: 'شکلات',
    price: 40000,
    menu: true,
  });

  const item = { edible: edibleA._id, name: 'کباب کوبیده', quantity: 1, price: 120000, discount: 0 };
  orderA = await Order.create({
    restaurant: restaurantA._id,
    table: 1,
    status: 'pending',
    customerName: 'مشتری الف',
    customerPhone: '09120000020',
    items: [item],
  });
  orderB = await Order.create({
    restaurant: restaurantB._id,
    table: 1,
    status: 'pending',
    customerName: 'مشتری بی',
    customerPhone: '09120000021',
    items: [item],
  });
});

afterAll(async () => {
  await helpers.close();
});

describe('edible access is limited to its own restaurant', () => {
  it('returns the edible of their own restaurant', async () => {
    const response = await api.get(`/edibles/${edibleA._id}`, { headers: { Cookie: ownerACookie } });
    expect(response.status).toBe(200);
    expect(response.data.edible.name).toBe('کباب کوبیده');
  });

  it('hides another restaurant edible', async () => {
    const response = await api.get(`/edibles/${edibleB._id}`, {
      headers: { Cookie: ownerACookie },
    });
    expect(response.status).toBe(404);
  });

  it('answers 400 for a malformed id instead of reaching the model', async () => {
    const response = await api.get('/edibles/not-an-id', { headers: { Cookie: ownerACookie } });
    expect(response.status).toBe(400);
  });
});

describe('order access is limited to its own restaurant', () => {
  it('returns the order of their own restaurant', async () => {
    const response = await api.get(`/orders/${orderA._id}`, { headers: { Cookie: ownerACookie } });
    expect(response.status).toBe(200);
    expect(response.data.order.customerName).toBe('مشتری الف');
  });

  it('hides another restaurant order', async () => {
    const response = await api.get(`/orders/${orderB._id}`, { headers: { Cookie: ownerACookie } });
    expect(response.status).toBe(404);
  });

  it('answers 400 for a malformed order id', async () => {
    const response = await api.get('/orders/not-an-id', { headers: { Cookie: ownerACookie } });
    expect(response.status).toBe(400);
  });

  it('answers 404 for an order that does not exist', async () => {
    const response = await api.get(`/orders/${new mongoose.Types.ObjectId()}`, {
      headers: { Cookie: ownerACookie },
    });
    expect(response.status).toBe(404);
  });
});

describe('restaurant endpoints when the document is gone', () => {
  it('answers 404 for a token without a restaurant', async () => {
    // a system admin token carries no restaurantId
    const orphan = helpers.ownerCookie({ userId: new mongoose.Types.ObjectId() });
    const response = await api.get('/restaurants', { headers: { Cookie: orphan } });
    expect(response.status).toBe(404);
  });

  it('answers 404 when deleting an already deleted restaurant', async () => {
    const first = await api.delete('/restaurants', { headers: { Cookie: ownerBCookie } });
    expect(first.status).toBe(200);

    const second = await api.delete('/restaurants', { headers: { Cookie: ownerBCookie } });
    expect(second.status).toBe(404);
    // an unscoped delete used to remove whichever restaurant happened to be first
    expect(await Restaurant.countDocuments({ _id: restaurantA._id })).toBe(1);

    const read = await api.get('/restaurants', { headers: { Cookie: ownerBCookie } });
    expect(read.status).toBe(404);

    const update = await api.patch(
      '/restaurants',
      { name: 'رستوران بی نو', phone: '09120000030' },
      { headers: { Cookie: ownerBCookie } }
    );
    expect(update.status).toBe(404);
  });
});

describe('public restaurant list', () => {
  it('leaves closed restaurants out', async () => {
    const response = await api.get('/customer/restaurants');
    expect(response.status).toBe(200);
    const names = response.data.restaurants.map((r) => r.name);
    expect(names).toContain('رستوران الف');
    expect(names).not.toContain('رستوران تعطیل');
  });

  it('still lists restaurants saved before the isActive field existed', async () => {
    const legacy = await Restaurant.create({ name: 'رستوران قدیمی' });
    await Restaurant.updateOne({ _id: legacy._id }, { $unset: { isActive: 1 } });

    const response = await api.get('/customer/restaurants');
    expect(response.data.restaurants.map((r) => r.name)).toContain('رستوران قدیمی');
  });

  it('still serves the menu of any restaurant id', async () => {
    const menu = await api.get(`/customer/menu/${restaurantA.id}`);
    expect(menu.status).toBe(200);
    expect(menu.data.menu.map((e) => e.name)).toEqual(['کباب کوبیده']);
  });
});

describe('image storage endpoints', () => {
  it('lists no images for a restaurant that never uploaded one', async () => {
    const response = await api.get('/edibles/images', { headers: { Cookie: ownerACookie } });
    expect(response.status).toBe(200);
    expect(response.data.images).toEqual([]);
  });

  it('answers 400 for a file that is not an image', async () => {
    const form = new FormData();
    form.append('image', Buffer.from('this is not a picture'), {
      filename: 'notes.txt',
      contentType: 'text/plain',
    });

    const response = await api.post('/edibles/upload', form, {
      headers: { ...form.getHeaders(), Cookie: ownerACookie },
    });
    expect(response.status).toBe(400);
    expect(response.data.msg).toMatch('Invalid file format');
  });
});
