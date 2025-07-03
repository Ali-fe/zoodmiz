const { StatusCodes } = require('http-status-codes');
const Order = require('../../models/order.model');
const Restaurant = require('../../models/restaurant.model');
const { ORDER_STATUS } = require('../../utils/constants');

const getOrders = async (req, res) => {
    const { restaurantId } = req.user;
    const orders = await Order.find({ restaurant: restaurantId });
    return res.status(StatusCodes.OK).json({ orders });
};

const addOrder = async (req, res) => {
    const { restaurantId } = req.user;
    req.body.restaurant = restaurantId;
    req.body.status = ORDER_STATUS.PENDING;
    delete req.body.feedback;
    const order = await Order.create(req.body);
    return res.status(201).json({
        msg: 'Order added successfully',
        order
    });
};
const getOrder = async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    res.status(200).json({
        msg: 'Order Found successfully',
        order
    });
};
const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findByIdAndUpdate(orderId, req.body, { new: true });
    res.status(200).json({
        msg: 'Order updated successfully',
        order
    });
};

const deleteOrder = async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    res.status(200).json({
        msg: 'Order deleted successfully'
    });
}

const schema = () => { return createEmptyJson(Order.schema) };
module.exports = {
    getOrders,
    getOrder,
    addOrder,
    updateOrder,
    deleteOrder,
    schema
};
