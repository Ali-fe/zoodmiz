
const Restaurant = require("../../models/restaurant.model");
const User = require("../../models/user.model")
const { StatusCodes } = require('http-status-codes');

const httpCurrentUser = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId })
    const restaurant = await Restaurant.findById(req.user.restaurantId);
    const userWithoutPassword = user.toJSON();
    res.status(StatusCodes.OK).json({...userWithoutPassword,restaurantName: restaurant.name});
}
const httpApplicationStats = async (req, res) => {
    const users = await User.countDocuments();
    const restaurants = await Restaurant.countDocuments();
    res.status(StatusCodes.OK).json({ users, restaurants });
}
const httpUpdateUser = async (req, res) => {
    const obj = { ...req.body }
    delete obj.password;
    delete obj.restaurant;
    delete obj.role;
    const user = await User.findByIdAndUpdate(req.user.userId, obj);
    res.status(StatusCodes.OK).json({ msg: 'User updated' })
}
module.exports = {
    httpCurrentUser,
    httpApplicationStats,
    httpUpdateUser,
}