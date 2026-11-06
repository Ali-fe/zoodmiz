const mongoose = require('mongoose');

const Restaurant = require('../models/restaurant.model');
const Table = require('../models/table.model');
const User = require('../models/user.model');
const Customer = require('../models/customer.model');
const Notification = require('../models/notification.model');
const Reservation = require('../models/reservation.model');
const { startTestServer } = require('../../test/testServer');

let helpers;
let api;
let ownerCookie;
let foreignOwnerCookie;
let customerCookie;
let otherCustomerCookie;
let restaurant;
let first;
let second;

// validation failures arrive as a list of messages, controller failures as one string
const errorText = (response) =>
  Array.isArray(response.data.msg) ? response.data.msg.join(' ') : response.data.msg;

const inHours = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

const tableStatus = async (numeral) => {
  const table = await Table.findOne({ restaurant: restaurant._id, numeral });
  return table.status;
};

const book = (payload, cookie) =>
  api.post('/customer/reservations', payload, cookie ? { headers: { Cookie: cookie } } : undefined);

const booking = (overrides) => ({
  restaurant: restaurant.id,
  table: 2,
  guests: 4,
  customerName: 'سارا موسوی',
  customerPhone: '09123456789',
  reserveAt: inHours(5),
  ...overrides,
});

beforeAll(async () => {
  helpers = await startTestServer({ database: 'zoodmiz_reservation_test' });
  api = helpers.api;

  restaurant = await Restaurant.create({ name: 'کبابی تست', phone: '09121112222' });
  const foreignRestaurant = await Restaurant.create({ name: 'قنادی تست' });

  await Table.insertMany([
    { restaurant: restaurant._id, numeral: 1, capacity: 2 },
    { restaurant: restaurant._id, numeral: 2, capacity: 6 },
    { restaurant: restaurant._id, numeral: 3, capacity: 4, status: 'occupied' },
    { restaurant: foreignRestaurant._id, numeral: 1, capacity: 4 },
  ]);

  const owner = await User.create({
    name: 'Owner',
    lastName: 'Test',
    email: 'reservation.owner@zoodmiz.ir',
    password: 'unused-in-tests',
    phone: '09121112223',
    role: 'admin',
    restaurant: restaurant._id,
  });
  const foreignOwner = await User.create({
    name: 'Foreign',
    lastName: 'Test',
    email: 'foreign.owner@zoodmiz.ir',
    password: 'unused-in-tests',
    phone: '09121112224',
    role: 'admin',
    restaurant: foreignRestaurant._id,
  });
  ownerCookie = helpers.ownerCookie({ userId: owner._id, restaurantId: restaurant._id });
  foreignOwnerCookie = helpers.ownerCookie({
    userId: foreignOwner._id,
    restaurantId: foreignRestaurant._id,
  });

  const customer = await Customer.create({ name: 'سارا', lastName: 'موسوی', phone: '09123456789' });
  customerCookie = helpers.customerCookie({ customerId: customer._id, phone: customer.phone });
  const otherCustomer = await Customer.create({ name: 'رضا', lastName: 'تهرانی', phone: '09124445566' });
  otherCustomerCookie = helpers.customerCookie({
    customerId: otherCustomer._id,
    phone: otherCustomer.phone,
  });
});

afterAll(async () => {
  await helpers.close();
});

describe('table availability for customers', () => {
  it('lists the tables with their booked slots', async () => {
    const response = await api.get(`/customer/restaurants/${restaurant.id}/tables`);
    expect(response.status).toBe(200);
    expect(response.data.tables.map((table) => table.numeral)).toEqual([1, 2, 3]);
    response.data.tables.forEach((table) => expect(table.reservedSlots).toEqual([]));
  });

  it('rejects an unknown restaurant', async () => {
    const missing = await api.get(`/customer/restaurants/${new mongoose.Types.ObjectId()}/tables`);
    expect(missing.status).toBe(404);

    const malformed = await api.get('/customer/restaurants/not-an-id/tables');
    expect(malformed.status).toBe(400);
  });
});

describe('booking validation', () => {
  it('refuses more guests than the table holds', async () => {
    const response = await book(booking({ table: 1, guests: 3 }));
    expect(response.status).toBe(400);
    expect(errorText(response)).toMatch('ظرفیت میز 1 تعداد 2 نفر است');
  });

  it('refuses an occupied table', async () => {
    const response = await book(booking({ table: 3, guests: 2 }));
    expect(response.status).toBe(400);
    expect(errorText(response)).toMatch('این میز در حال حاضر اشغال است');
  });

  it('refuses a numeral the restaurant does not have', async () => {
    const response = await book(booking({ table: 99 }));
    expect(response.status).toBe(404);
  });

  it('refuses a time in the past', async () => {
    const response = await book(booking({ reserveAt: inHours(-2) }));
    expect(response.status).toBe(400);
    expect(errorText(response)).toMatch('زمان رزرو نمی‌تواند در گذشته باشد');
  });

  it('refuses a booking further than sixty days ahead', async () => {
    const response = await book(booking({ reserveAt: inHours(61 * 24) }));
    expect(response.status).toBe(400);
    expect(errorText(response)).toMatch('حداکثر تا ۶۰ روز آینده');
  });

  it('refuses an invalid phone number', async () => {
    const response = await book(booking({ customerPhone: '123' }));
    expect(response.status).toBe(400);
  });

  it('leaves no reservation behind', async () => {
    expect(await tableStatus(1)).toBe('available');
    expect(await tableStatus(2)).toBe('available');
  });
});

describe('booking a table', () => {
  it('creates a pending reservation and reserves the table', async () => {
    const response = await book(booking(), customerCookie);
    expect(response.status).toBe(201);
    expect(response.data.reservation.status).toBe('pending');
    expect(response.data.reservation.guests).toBe(4);
    first = response.data.reservation;

    expect(await tableStatus(2)).toBe('reserved');
  });

  it('publishes the booked slot to the availability endpoint', async () => {
    const response = await api.get(`/customer/restaurants/${restaurant.id}/tables`);
    const table = response.data.tables.find((t) => t.numeral === 2);
    expect(table.reservedSlots).toHaveLength(1);
    expect(new Date(table.reservedSlots[0]).getTime()).toBe(new Date(first.reserveAt).getTime());
  });

  it('notifies the restaurant owner', async () => {
    const notification = await Notification.findOne({
      restaurant: restaurant._id,
      category: 'table',
      action: 'reserve',
    });
    expect(notification).toBeTruthy();
    expect(notification.title).toBe('رزرو میز جدید');
    expect(notification.message).toMatch('سارا موسوی');
  });

  it('refuses a second booking inside the two hour window', async () => {
    const response = await book(
      booking({ customerName: 'رضا تهرانی', customerPhone: '09124445566', reserveAt: inHours(4) }),
      customerCookie
    );
    expect(response.status).toBe(400);
    expect(errorText(response)).toMatch('این میز در بازه زمانی انتخابی رزرو شده است');
  });

  it('allows a booking outside the two hour window', async () => {
    const response = await book(
      booking({
        guests: 2,
        customerName: 'رضا تهرانی',
        customerPhone: '09124445566',
        reserveAt: inHours(9),
      }),
      customerCookie
    );
    expect(response.status).toBe(201);
    second = response.data.reservation;
  });
});

describe('customer reservation list', () => {
  it('requires a customer session', async () => {
    const response = await api.get('/customer/reservations');
    expect(response.status).toBe(401);
  });

  it('shows only the caller reservations', async () => {
    const response = await api.get('/customer/reservations', { headers: { Cookie: customerCookie } });
    expect(response.status).toBe(200);
    // the other booking on the same table belongs to a different phone
    expect(response.data.reservations).toHaveLength(1);
    const [mine] = response.data.reservations;
    expect(mine.customerPhone).toBe('09123456789');
    expect(mine.table.numeral).toBe(2);
    expect(mine.restaurant.name).toBe('کبابی تست');
  });

  it('lists the second booking for its own customer', async () => {
    const response = await api.get('/customer/reservations', {
      headers: { Cookie: otherCustomerCookie },
    });
    expect(response.data.reservations).toHaveLength(1);
    expect(response.data.reservations[0]._id).toBe(second._id);
  });
});

describe('owner workflow', () => {
  it('requires an owner session', async () => {
    const response = await api.get('/reservations');
    expect(response.status).toBe(401);
  });

  it('lists the reservations of their own restaurant only', async () => {
    const response = await api.get('/reservations', { headers: { Cookie: ownerCookie } });
    expect(response.status).toBe(200);
    expect(response.data.reservations).toHaveLength(2);

    const foreign = await api.get('/reservations', { headers: { Cookie: foreignOwnerCookie } });
    expect(foreign.data.reservations).toHaveLength(0);
  });

  it('confirms a pending reservation', async () => {
    const response = await api.patch(
      `/reservations/${first._id}`,
      { status: 'confirmed' },
      { headers: { Cookie: ownerCookie } }
    );
    expect(response.status).toBe(200);
    expect(response.data.reservation.status).toBe('confirmed');
    expect(await tableStatus(2)).toBe('reserved');
  });

  it('rejects another restaurant reservation', async () => {
    const response = await api.patch(
      `/reservations/${first._id}`,
      { status: 'confirmed' },
      { headers: { Cookie: foreignOwnerCookie } }
    );
    expect(response.status).toBe(404);
  });

  it('rejects an unknown status', async () => {
    const response = await api.patch(
      `/reservations/${second._id}`,
      { status: 'nope' },
      { headers: { Cookie: ownerCookie } }
    );
    expect(response.status).toBe(400);
  });

  it('rejects an unknown reservation id', async () => {
    const response = await api.patch(
      `/reservations/${new mongoose.Types.ObjectId()}`,
      { status: 'confirmed' },
      { headers: { Cookie: ownerCookie } }
    );
    expect(response.status).toBe(404);
  });
});

describe('cancelling', () => {
  it('keeps the table reserved while a later booking survives', async () => {
    const response = await api.patch(
      `/customer/reservations/${first._id}/cancel`,
      {},
      { headers: { Cookie: customerCookie } }
    );
    expect(response.status).toBe(200);
    expect(response.data.reservation.status).toBe('cancelled');
    expect(await tableStatus(2)).toBe('reserved');

    const availability = await api.get(`/customer/restaurants/${restaurant.id}/tables`);
    const table = availability.data.tables.find((t) => t.numeral === 2);
    expect(table.reservedSlots).toHaveLength(1);
    expect(new Date(table.reservedSlots[0]).getTime()).toBe(new Date(second.reserveAt).getTime());
  });

  it('refuses to cancel twice', async () => {
    const response = await api.patch(
      `/customer/reservations/${first._id}/cancel`,
      {},
      { headers: { Cookie: customerCookie } }
    );
    expect(response.status).toBe(400);
    expect(errorText(response)).toMatch('این رزرو قبلاً لغو شده است');
  });

  it('frees the table when the owner rejects the last booking', async () => {
    const response = await api.patch(
      `/reservations/${second._id}`,
      { status: 'cancelled' },
      { headers: { Cookie: ownerCookie } }
    );
    expect(response.status).toBe(200);
    expect(await tableStatus(2)).toBe('available');

    const listed = await api.get('/reservations', { headers: { Cookie: ownerCookie } });
    expect(listed.data.reservations).toHaveLength(0);
  });

  it('refuses a cancellation from a different customer', async () => {
    const bookingResponse = await book(booking({ reserveAt: inHours(26) }), customerCookie);
    expect(bookingResponse.status).toBe(201);

    const response = await api.patch(
      `/customer/reservations/${bookingResponse.data.reservation._id}/cancel`,
      {},
      { headers: { Cookie: otherCustomerCookie } }
    );
    expect(response.status).toBe(404);
  });
});

describe('tables whose reservation time has passed', () => {
  const reserve = async (numeral, reserveAt, status = 'pending') => {
    const table = await Table.findOne({ restaurant: restaurant._id, numeral });
    await Table.findByIdAndUpdate(table._id, { status: 'reserved' });
    await Reservation.create({
      restaurant: restaurant._id,
      table: table._id,
      customerName: 'سارا موسوی',
      customerPhone: '09123456789',
      guests: 2,
      reserveAt,
      status
    });
    return table;
  };

  const hour = 60 * 60 * 1000;

  it('frees a table once its visit time is behind us', async () => {
    await reserve(1, new Date(Date.now() - hour), 'confirmed');
    expect(await tableStatus(1)).toBe('reserved');

    const response = await api.get('/restaurants/tables', { headers: { Cookie: ownerCookie } });
    expect(response.status).toBe(200);
    expect(response.data.tables.find((t) => t.numeral === 1).status).toBe('available');
    expect(await tableStatus(1)).toBe('available');
  });

  it('keeps a table reserved while a future booking is pending', async () => {
    const table = await reserve(1, new Date(Date.now() - hour));
    await Reservation.create({
      restaurant: restaurant._id,
      table: table._id,
      customerName: 'رضا تهرانی',
      customerPhone: '09124445566',
      guests: 2,
      reserveAt: new Date(Date.now() + 30 * hour),
      status: 'pending'
    });

    await api.get('/restaurants/tables', { headers: { Cookie: ownerCookie } });
    expect(await tableStatus(1)).toBe('reserved');
  });

  it('never touches a table the owner marked occupied', async () => {
    await api.get('/restaurants/tables', { headers: { Cookie: ownerCookie } });
    expect(await tableStatus(3)).toBe('occupied');
  });
});
