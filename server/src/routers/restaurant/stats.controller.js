const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const Order = require('../../models/order.model');
const Reservation = require('../../models/reservation.model');
const { ORDER_STATUS, RESERVATION_STATUS } = require('../../utils/constants');

const DAY_MS = 24 * 60 * 60 * 1000;

const orderRevenue = (order) => order.items.reduce((sum, item) => {
    const gross = item.price * item.quantity;
    return sum + gross - (gross * (item.discount || 0)) / 100;
}, 0);

const dayKey = (date) => date.toISOString().slice(0, 10);
const monthKey = (date) => date.toISOString().slice(0, 7);

// real numbers behind the dashboard charts; dates are bucketed server side so the
// client only has to translate them into the Persian calendar
const getStats = async (req, res) => {
    const { restaurantId } = req.user;
    const since = new Date(Date.now() - 366 * DAY_MS);
    const orders = await Order.find({
        restaurant: restaurantId,
        createdAt: { $gte: since },
        status: { $ne: ORDER_STATUS.CANCELLED }
    }).select('createdAt items status customerPhone table').lean();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 1, 0);
    const startOfTomorrow = new Date(startOfToday.getTime() + DAY_MS);

    const daily = new Map();
    const monthly = new Map();
    for (const order of orders) {
        const date = new Date(order.createdAt);
        const revenue = orderRevenue(order);
        const dKey = dayKey(date);
        const mKey = monthKey(date);
        const d = daily.get(dKey) || { date: dKey, revenue: 0, orders: 0 };
        d.revenue += revenue;
        d.orders += 1;
        daily.set(dKey, d);
        const m = monthly.get(mKey) || { month: mKey, revenue: 0, orders: 0 };
        m.revenue += revenue;
        m.orders += 1;
        monthly.set(mKey, m);
    }

    const last7 = [];
    for (let offset = 6; offset >= 0; offset--) {
        const date = new Date(startOfToday.getTime() - offset * DAY_MS);
        const key = dayKey(date);
        last7.push(daily.get(key) || { date: key, revenue: 0, orders: 0 });
    }
    const last12 = [];
    for (let offset = 11; offset >= 0; offset--) {
        const date = new Date(startOfToday.getFullYear(), startOfToday.getMonth() - offset, 1);
        const key = monthKey(date);
        last12.push(monthly.get(key) || { month: key, revenue: 0, orders: 0 });
    }

    const todayOrders = orders.filter((order) => {
        const created = new Date(order.createdAt);
        return created >= startOfToday && created < startOfTomorrow;
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + orderRevenue(order), 0);

    const thirtyDaysAgo = new Date(startOfToday.getTime() - 30 * DAY_MS);
    const recentOrders = orders.filter((order) => new Date(order.createdAt) >= thirtyDaysAgo);
    const averageOrder = recentOrders.length
        ? recentOrders.reduce((sum, order) => sum + orderRevenue(order), 0) / recentOrders.length
        : 0;

    // counted by first order so returning customers are not double counted
    const [newCustomerResult] = await Order.aggregate([
        { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId), customerPhone: { $nin: [null, ''] } } },
        { $group: { _id: '$customerPhone', firstOrder: { $min: '$createdAt' } } },
        { $match: { firstOrder: { $gte: thirtyDaysAgo } } },
        { $count: 'total' }
    ]);
    const newCustomers = newCustomerResult?.total || 0;

    const activeReservations = await Reservation.countDocuments({
        restaurant: restaurantId,
        reserveAt: { $gte: new Date() },
        status: { $ne: RESERVATION_STATUS.CANCELLED }
    });

    res.status(StatusCodes.OK).json({
        stats: {
            todayRevenue: Math.round(todayRevenue),
            todayOrders: todayOrders.length,
            averageOrder: Math.round(averageOrder),
            newCustomers: newCustomers.length,
            activeReservations,
            pendingOrders: orders.filter((order) => order.status === ORDER_STATUS.PENDING).length,
            daily: last7.map((day) => ({ ...day, revenue: Math.round(day.revenue) })),
            monthly: last12.map((month) => ({ ...month, revenue: Math.round(month.revenue) }))
        }
    });
};

module.exports = { getStats };
