
const { NotFoundError, UnauthenticatedError } = require("../../errors/customErrors");
const User = require("../../models/user.model")
const Restaurant = require('../../models/restaurant.model')
const { StatusCodes } = require('http-status-codes');
const { hashPassword , comparePassword} = require("../../utils/passwordUtils");

const httpRegister = async (req, res) => {

    const json = req.body;

    const resJson = {
        name: json.restaurantName
    }
    const userJson = {
        name: json.name,
        lastName: json.lastName || '',
        email: json.email,
        password: await hashPassword(json.password),
        phone: json.phone,
        restaurant: restaurant._id
    }

    const restaurant = await Restaurant.create(resJson);
    const user = await User.create(userJson);

    res.status(StatusCodes.CREATED).json({ msg: 'new user and restaurant created' });
}
const httpLogin = async (req, res) => {

    const user = await User.findOne({'email': req.body.email});
    const isValidUser = user && await comparePassword(req.body.password,user.password)
    if(!isValidUser) throw new UnauthenticatedError('invalid credential')

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