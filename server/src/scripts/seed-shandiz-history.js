/* eslint-disable no-console */
require('dotenv').config();
const { mongoConnect, mongoDisconnect } = require('../services/mongo');
const Restaurant = require('../models/restaurant.model');
const Edible = require('../models/edible.model');
const Table = require('../models/table.model');
const Order = require('../models/order.model');
const Reservation = require('../models/reservation.model');
const Notification = require('../models/notification.model');
const { ORDER_STATUS, TABLE_STATUS, RESERVATION_STATUS, NOTIFICATION_CATEGORY, NOTIFICATION_ACTION } = require('../utils/constants');

const RESTAURANT_NAME = 'کبابی شاندیز';
const DAY_MS = 24 * 60 * 60 * 1000;
const customers = [
    { name: 'علی', lastName: 'مرادی', phone: '09121000101' },
    { name: 'مریم', lastName: 'نوروزی', phone: '09121000102' },
    { name: 'حسین', lastName: 'تقوی', phone: '09121000103' },
    { name: 'نگار', lastName: 'شریفی', phone: '09121000104' },
    { name: 'سعید', lastName: 'قاسمی', phone: '09121000105' },
    { name: 'لیلا', lastName: 'بهرامی', phone: '09121000106' },
    { name: 'رضا', lastName: 'کریمی', phone: '09121000107' },
    { name: 'سارا', lastName: 'احمدی', phone: '09121000108' },
    { name: 'محمد', lastName: 'حسینی', phone: '09121000109' },
    { name: 'ندا', lastName: 'صالحی', phone: '09121000110' },
];

const extraEdibles = [
    { name: 'چلو کباب سلطانی', type: 'غذای ایرانی', price: 560000, description: 'ترکیب کباب برگ و کوبیده با برنج زعفرانی' },
    { name: 'زرشک پلو با مرغ', type: 'غذای ایرانی', price: 295000, description: 'مرغ زعفرانی با زرشک، خلال پسته و برنج ایرانی' },
    { name: 'باقالی پلو با ماهیچه', type: 'غذای ایرانی', price: 640000, description: 'ماهیچه آرام‌پز با باقالی پلو و شوید تازه' },
    { name: 'کباب چنجه', type: 'غذای ایرانی', price: 475000, description: 'تکه‌های گوشت گوسفندی مزه‌دار شده روی زغال' },
    { name: 'جوجه کباب ترش', type: 'غذای ایرانی', price: 335000, description: 'جوجه زعفرانی با چاشنی انار و سبزی محلی' },
    { name: 'سالاد شیرازی', type: 'پیش غذا', price: 68000, description: 'خیار و گوجه تازه با آبغوره و نعنا' },
    { name: 'سوپ جو', type: 'پیش غذا', price: 78000, description: 'سوپ جو با مرغ و سبزیجات تازه' },
    { name: 'دوغ پارچی محلی', type: 'نوشیدنی', price: 95000, description: 'دوغ محلی خنک با نعنا و گل محمدی' },
    { name: 'فالوده شیرازی', type: 'دسر', price: 88000, description: 'فالوده سنتی با شربت بهارنارنج و آبلیمو' },
    { name: 'چای و نبات', type: 'نوشیدنی', price: 42000, description: 'چای ایرانی تازه‌دم همراه نبات زعفرانی' },
];

const pick = (items, index) => items[index % items.length];
const keyForOrder = (order) =>
    `${new Date(order.createdAt).getTime()}|${order.table}|${order.customerPhone || ''}`;
const keyForReservation = (reservation) =>
    `${reservation.table}|${new Date(reservation.reserveAt).getTime()}|${reservation.customerPhone}`;
const keyForNotification = (notification) =>
    `${new Date(notification.createdAt).getTime()}|${notification.category}|${notification.title}|${notification.message}`;

const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

const seedShandizHistory = async () => {
    await mongoConnect();
    const restaurant = await Restaurant.findOne({ name: RESTAURANT_NAME });
    if (!restaurant) {
        throw new Error(`Restaurant "${RESTAURANT_NAME}" was not found. Run the base seed first.`);
    }

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const historyStart = addMonths(today, -6);
    const historyEnd = new Date(today);
    historyEnd.setDate(historyEnd.getDate() + 15);

    const menuUrl = (numeral) =>
        `https://www.zoodmiz.ir/restaurants/menu/${restaurant._id}/${numeral}`;

    const existingTables = await Table.find({ restaurant: restaurant._id });
    const tableByNumber = new Map(existingTables.map((table) => [table.numeral, table]));
    const tablesToAdd = [];
    for (let numeral = 1; numeral <= 20; numeral++) {
        if (tableByNumber.has(numeral)) continue;
        tablesToAdd.push({
            restaurant: restaurant._id,
            numeral,
            capacity: [2, 4, 4, 6, 8][(numeral - 1) % 5],
            status: TABLE_STATUS.AVAILABLE,
            menuUrl: menuUrl(numeral),
        });
    }
    if (tablesToAdd.length) {
        const addedTables = await Table.insertMany(tablesToAdd);
        for (const table of addedTables) tableByNumber.set(table.numeral, table);
    }
    const tables = Array.from(tableByNumber.values()).sort((a, b) => a.numeral - b.numeral);

    const existingEdibles = await Edible.find({ restaurant: restaurant._id }).select('name');
    const edibleNames = new Set(existingEdibles.map((edible) => edible.name));
    const ediblesToAdd = extraEdibles
        .filter((edible) => !edibleNames.has(edible.name))
        .map((edible) => ({
            ...edible,
            restaurant: restaurant._id,
            imageURL: restaurant.image,
            menu: true,
        }));
    if (ediblesToAdd.length) await Edible.insertMany(ediblesToAdd);
    const edibles = await Edible.find({ restaurant: restaurant._id, menu: true });
    if (!edibles.length || !tables.length) {
        throw new Error('Shandiz needs at least one menu item and one table before history can be seeded.');
    }

    const existingOrders = await Order.find({
        restaurant: restaurant._id,
        createdAt: { $gte: historyStart, $lt: historyEnd },
    }).select('createdAt table customerPhone');
    const orderKeys = new Set(existingOrders.map(keyForOrder));
    const ordersToAdd = [];
    const comments = ['بدون پیاز لطفاً', 'برنج کمی کمتر باشد', 'برای کودک', 'لطفاً تازه و داغ سرو شود'];
    const dayCount = Math.round((today.getTime() - historyStart.getTime()) / DAY_MS) + 1;

    for (let dayOffset = 0; dayOffset < dayCount; dayOffset++) {
        const date = new Date(historyStart);
        date.setDate(date.getDate() + dayOffset);
        const count = 8 + ((dayOffset * 5 + 2) % 7);
        for (let index = 0; index < count; index++) {
            const customer = pick(customers, dayOffset * 3 + index);
            const orderDate = new Date(date);
            const availableHours = date.getTime() === today.getTime()
                ? Math.max(1, now.getHours() - 10)
                : 11;
            orderDate.setHours(11 + ((index * 7) % availableHours), (index * 17) % 60, 0, 0);
            const table = pick(tables, dayOffset * 7 + index);
            const key = `${orderDate.getTime()}|${table.numeral}|${customer.phone}`;
            if (orderKeys.has(key)) continue;

            const itemCount = Math.min(edibles.length, 1 + ((dayOffset + index) % 4));
            const items = [];
            for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
                const edible = pick(edibles, dayOffset * 11 + index * 3 + itemIndex * 5);
                if (items.some((item) => String(item.edible) === String(edible._id))) continue;
                items.push({
                    edible: edible._id,
                    name: edible.name,
                    quantity: 1 + ((dayOffset + index + itemIndex) % 3),
                    price: edible.price,
                    discount: edible.discount || 0,
                });
            }

            const isToday = date.getTime() === today.getTime();
            const status = isToday && index === 0
                ? ORDER_STATUS.PENDING
                : isToday && index === 1
                    ? ORDER_STATUS.PREPARING
                    : isToday && index === 2
                        ? ORDER_STATUS.READY
                        : (dayOffset + index) % 13 === 0
                            ? ORDER_STATUS.CANCELLED
                            : ORDER_STATUS.DELIVERED;
            const feedback = status === ORDER_STATUS.DELIVERED && (dayOffset + index) % 5 === 0
                ? [{
                    rating: 3 + ((dayOffset + index) % 3),
                    comment: ['عالی بود', 'کیفیت و بسته‌بندی خوب بود', 'حتماً دوباره سفارش می‌دهم'][(dayOffset + index) % 3],
                    submittedAt: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000),
                }]
                : [];
            const order = {
                restaurant: restaurant._id,
                table: table.numeral,
                customerName: `${customer.name} ${customer.lastName}`,
                customerPhone: customer.phone,
                createdAt: orderDate,
                status,
                notes: (dayOffset + index) % 9 === 0 ? pick(comments, dayOffset + index) : '',
                items,
                feedback,
            };
            ordersToAdd.push(order);
            orderKeys.add(key);
        }
    }
    if (ordersToAdd.length) await Order.insertMany(ordersToAdd, { ordered: true });
    const staleActiveOrders = await Order.updateMany(
        {
            restaurant: restaurant._id,
            createdAt: { $lt: today },
            status: { $in: [ORDER_STATUS.PENDING, ORDER_STATUS.PREPARING, ORDER_STATUS.READY] },
        },
        { $set: { status: ORDER_STATUS.DELIVERED } }
    );

    const existingReservations = await Reservation.find({
        restaurant: restaurant._id,
        reserveAt: { $gte: historyStart, $lt: historyEnd },
    }).select('table reserveAt customerPhone status');
    const reservationKeys = new Set(existingReservations.map(keyForReservation));
    const reservationsToAdd = [];
    const reservationSlots = [];
    const reservationStart = new Date(historyStart);
    reservationStart.setDate(reservationStart.getDate() + 10);
    const reservationDayCount = Math.round((historyEnd.getTime() - reservationStart.getTime()) / DAY_MS);

    for (let dayOffset = 0; dayOffset < reservationDayCount; dayOffset++) {
        const date = new Date(reservationStart);
        date.setDate(date.getDate() + dayOffset);
        for (let slot = 0; slot < 2; slot++) {
            const customer = pick(customers, dayOffset * 2 + slot + 4);
            const table = pick(tables, dayOffset * 3 + slot * 7);
            const reserveAt = new Date(date);
            reserveAt.setHours(slot === 0 ? 13 : 19, (dayOffset * 11 + slot * 23) % 60, 0, 0);
            const key = `${table._id}|${reserveAt.getTime()}|${customer.phone}`;
            if (reservationKeys.has(key)) continue;

            const future = reserveAt.getTime() >= now.getTime();
            const status = future
                ? ((dayOffset + slot) % 3 === 0 ? RESERVATION_STATUS.PENDING : RESERVATION_STATUS.CONFIRMED)
                : ((dayOffset + slot) % 6 === 0 ? RESERVATION_STATUS.CANCELLED : RESERVATION_STATUS.CONFIRMED);
            if (status !== RESERVATION_STATUS.CANCELLED) {
                const clashes = [...existingReservations, ...reservationSlots].some((existing) =>
                    String(existing.table) === String(table._id)
                    && existing.status !== RESERVATION_STATUS.CANCELLED
                    && Math.abs(new Date(existing.reserveAt).getTime() - reserveAt.getTime()) < 2 * 60 * 60 * 1000
                );
                if (clashes) continue;
            }
            const createdAt = new Date(reserveAt.getTime() - (future ? 1 : 24) * 60 * 60 * 1000);
            const reservation = {
                restaurant: restaurant._id,
                table: table._id,
                customerName: `${customer.name} ${customer.lastName}`,
                customerPhone: customer.phone,
                guests: Math.min(table.capacity, 1 + ((dayOffset + slot) % table.capacity)),
                reserveAt,
                createdAt,
                status,
            };
            reservationsToAdd.push(reservation);
            reservationSlots.push(reservation);
            reservationKeys.add(key);
        }
    }
    if (reservationsToAdd.length) await Reservation.insertMany(reservationsToAdd, { ordered: true });

    const existingNotifications = await Notification.find({
        restaurant: restaurant._id,
        createdAt: { $gte: historyStart, $lt: historyEnd },
    }).select('createdAt category title message');
    const notificationKeys = new Set(existingNotifications.map(keyForNotification));
    const notificationsToAdd = [];
    const operationTitles = [
        { category: NOTIFICATION_CATEGORY.ORDER, action: NOTIFICATION_ACTION.CREATE, title: 'سفارش جدید', message: 'یک سفارش از منوی دیجیتال ثبت شد' },
        { category: NOTIFICATION_CATEGORY.ORDER, action: NOTIFICATION_ACTION.UPDATE, title: 'وضعیت سفارش تغییر کرد', message: 'سفارش برای آماده‌سازی به آشپزخانه رفت' },
        { category: NOTIFICATION_CATEGORY.TABLE, action: NOTIFICATION_ACTION.RESERVE, title: 'رزرو میز جدید', message: 'یک میز برای مهمانان رزرو شد' },
        { category: NOTIFICATION_CATEGORY.TABLE, action: NOTIFICATION_ACTION.UPDATE, title: 'میز آزاد شد', message: 'وضعیت میز پس از پایان سرویس به آزاد تغییر کرد' },
    ];
    for (let dayOffset = 0; dayOffset < dayCount; dayOffset += 2) {
        const date = new Date(historyStart);
        date.setDate(date.getDate() + dayOffset);
        date.setHours(12 + (dayOffset % 9), (dayOffset * 13) % 60, 0, 0);
        const operation = pick(operationTitles, dayOffset);
        const notification = {
            restaurant: restaurant._id,
            ...operation,
            actorName: pick(customers, dayOffset).name,
            isRead: date.getTime() < now.getTime() - 2 * DAY_MS,
            createdAt: date,
        };
        const key = keyForNotification(notification);
        if (notificationKeys.has(key)) continue;
        notificationsToAdd.push(notification);
        notificationKeys.add(key);
    }
    if (notificationsToAdd.length) await Notification.insertMany(notificationsToAdd, { ordered: true });

    const futureReservation = await Reservation.findOne({
        restaurant: restaurant._id,
        reserveAt: { $gte: now },
        status: { $ne: RESERVATION_STATUS.CANCELLED },
    }).sort({ reserveAt: 1 });
    if (futureReservation) {
        await Table.updateOne({ _id: futureReservation.table }, { $set: { status: TABLE_STATUS.RESERVED } });
    }

    console.log(`Shandiz history seed complete:
  tables: ${tablesToAdd.length} added (${tables.length} total)
  menu items: ${ediblesToAdd.length} added (${edibles.length} total)
  orders: ${ordersToAdd.length} added
  old active orders marked delivered: ${staleActiveOrders.modifiedCount ?? staleActiveOrders.nModified ?? 0}
  reservations: ${reservationsToAdd.length} added
  notifications: ${notificationsToAdd.length} added`);
};

seedShandizHistory()
    .catch((error) => {
        console.error('Shandiz history seed failed:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoDisconnect();
    });
