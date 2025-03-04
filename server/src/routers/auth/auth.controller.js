
const { NotFoundError } = require("../../errors/customErrors");
const User = require("../../models/user.model")
const Restaurant = require('../../models/restaurant.model')
const { StatusCodes } = require('http-status-codes');

const httpRegister = async (req, res) => {
    const json = req.body;
    const restaurant = await Restaurant.create({ name: json.restaurantName });

    const userObj = {
        name: json.name,
        lastName: json.lastName || '',
        email: json.email,
        password: json.password,
        phone: json.phone,
        restaurant: restaurant._id
    }
    const user = await User.create(userObj);

    res.status(StatusCodes.CREATED).json({ result: user });
}
const httpLogin = async (req, res) => {
    res.status(StatusCodes.ACCEPTED).json({ result: 'login' });
}

/*
const httpUpdateUser = async (req,res) => {
    res.status(200).json({result : 'updateUser'});
}
const httpDeleteUser = async (req,res) =>{
    res.status(200).json({result : 'deleteUser'});
}
const httpGetUser = async (req,res) =>{
    res.status(200).json({result : 'get user'});
}
*/

module.exports = {
    httpRegister,
    httpLogin,
    /*httpUpdateUser,
    httpDeleteUser,
    httpGetUser,*/
}