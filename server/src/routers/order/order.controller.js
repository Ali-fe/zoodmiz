const { StatusCodes } = require('http-status-codes');
const Order = require('../../models/order.model');
const { ORDER_STATUS } = require('../../utils/constants');

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
    console.log(req.user);
    req.body.customerPhone = req.user.phone;
    addOrder(req, res);
};
const addRestaurantOrder =  async (req, res) => {
    const { restaurantId } = req.user;
    req.body.restaurant = restaurantId;
    addOrder(req, res);
};
const addOrder = async (req, res) => {
    req.body.status = ORDER_STATUS.PENDING;
    req.body.createdAt = new Date();
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
    getCustomerOrders,
    getOrder,
    addCustomerOrder,
    addRestaurantOrder,
    updateOrder,
    deleteOrder,
    schema
};
