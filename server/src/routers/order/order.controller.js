const { StatusCodes } = require('http-status-codes');
const Order = require('../../models/order.model');
const { NotFoundError } = require('../../errors/customErrors');
const { ORDER_STATUS, NOTIFICATION_CATEGORY, NOTIFICATION_ACTION } = require('../../utils/constants');
const createNotification = require('../../services/notification');

const ORDER_STATUS_LABEL = {
    [ORDER_STATUS.PENDING]: 'در انتظار',
    [ORDER_STATUS.PREPARING]: 'در حال آماده‌سازی',
    [ORDER_STATUS.READY]: 'آماده',
    [ORDER_STATUS.DELIVERED]: 'تحویل شده',
    [ORDER_STATUS.CANCELLED]: 'لغو شده'
};

const tableLabel = (table) => table === 0 ? 'بیرون بر' : `میز ${table}`;

const getOrders = async (req, res) => {
    const { restaurantId } = req.user;
    const orders = await Order.find({ restaurant: restaurantId });
    return res.status(StatusCodes.OK).json({ orders });
};
const getCustomerOrders = async (req, res) => {
    const { phone } = req.user;    
    const orders = await Order.find({ customerPhone: phone });
    return res.status(StatusCodes.OK).json({ orders });
};
const addCustomerOrder = async (req, res) => {
    req.body.customerPhone = req.user.phone;
    return addOrder(req, res);
};
const addRestaurantOrder =  async (req, res) => {
    const { restaurantId } = req.user;
    req.body.restaurant = restaurantId;
    return addOrder(req, res);
};
const addOrder = async (req, res) => {
    req.body.status = ORDER_STATUS.PENDING;
    req.body.createdAt = new Date();
    delete req.body.feedback;
    const order = await Order.create(req.body);
    const isCustomerOrder = req.user.role === 'customer';
    await createNotification({
        restaurant: order.restaurant,
        actorId: isCustomerOrder ? undefined : req.user.userId,
        actorName: isCustomerOrder ? order.customerName : undefined,
        category: NOTIFICATION_CATEGORY.ORDER,
        action: NOTIFICATION_ACTION.CREATE,
        title: 'سفارش جدید',
        message: `${order.customerName} برای ${tableLabel(order.table)} سفارش ثبت کرد`
    });
    return res.status(201).json({
        msg: 'Order added successfully',
        order
    });
};
const getOrder = async (req, res) => {
    const { restaurantId } = req.user;
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, restaurant: restaurantId });
    if (!order) throw new NotFoundError(`no order by id ${orderId}`);
    res.status(200).json({
        msg: 'Order Found successfully',
        order
    });
};
const updateOrder = async (req, res) => {
    const { restaurantId } = req.user;
    const { orderId } = req.params;
    const existingOrder = await Order.findOne({ _id: orderId, restaurant: restaurantId });
    if (!existingOrder) throw new NotFoundError(`no order by id ${orderId}`);

    const order = await Order.findByIdAndUpdate(orderId, req.body, { new: true });
    const statusChanged = typeof req.body.status === 'string' && req.body.status !== existingOrder.status;

    await createNotification({
        restaurant: restaurantId,
        actorId: req.user.userId,
        category: NOTIFICATION_CATEGORY.ORDER,
        action: NOTIFICATION_ACTION.UPDATE,
        title: statusChanged ? 'وضعیت سفارش تغییر کرد' : 'سفارش ویرایش شد',
        message: statusChanged
            ? `سفارش ${tableLabel(order.table)} (${order.customerName}) به وضعیت «${ORDER_STATUS_LABEL[order.status] || order.status}» تغییر کرد`
            : `سفارش ${tableLabel(order.table)} (${order.customerName}) ویرایش شد`
    });

    res.status(200).json({
        msg: 'Order updated successfully',
        order
    });
};

const deleteOrder = async (req, res) => {
    const { restaurantId } = req.user;
    const { orderId } = req.params;
    const order = await Order.findOneAndDelete({ _id: orderId, restaurant: restaurantId });
    if (!order) throw new NotFoundError(`no order by id ${orderId}`);

    await createNotification({
        restaurant: restaurantId,
        actorId: req.user.userId,
        category: NOTIFICATION_CATEGORY.ORDER,
        action: NOTIFICATION_ACTION.DELETE,
        title: 'سفارش حذف شد',
        message: `سفارش ${tableLabel(order.table)} (${order.customerName}) حذف شد`
    });

    res.status(200).json({
        msg: 'Order deleted successfully'
    });
}

const schema = () => { return createEmptyJson(Order.schema) };
module.exports = {
    getOrders,
    getCustomerOrders,
    getOrder,
    addCustomerOrder,
    addRestaurantOrder,
    updateOrder,
    deleteOrder,
    schema
};
