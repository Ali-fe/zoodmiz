
const { NotFoundError, UnauthenticatedError } = require("../../errors/customErrors");
const User = require("../../models/user.model")
const Restaurant = require('../../models/restaurant.model')
const { StatusCodes } = require('http-status-codes');
const { hashPassword, comparePassword } = require("../../utils/passwordUtils");
const { createJWT } = require("../../utils/tokenUtils");

const httpRegister = async (req, res) => {

    const json = req.body;

    const resJson = {
        name: json.restaurantName
    }
    const restaurant = await Restaurant.create(resJson);

    const userJson = {
        name: json.name,
        lastName: json.lastName || '',
        email: json.email,
        password: await hashPassword(json.password),
        phone: json.phone,
        restaurant: restaurant._id
    }
    const user = await User.create(userJson);

    res.status(StatusCodes.CREATED).json({ msg: 'new user and restaurant created' });
}
const httpLogin = async (req, res) => {

    const user = await User.findOne({ 'email': req.body.email });
    const isValidUser = user && await comparePassword(req.body.password, user.password)
    if (!isValidUser) throw new UnauthenticatedError('invalid credential')
    
    const token = createJWT({ userId: user._id, role: user.role, restaurantId: user.restaurant});
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
    })
    res.status(StatusCodes.OK).json({ msg: 'user logged in' });
}
const httpLogout = (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}
module.exports = {
    httpRegister,
    httpLogin,
    httpLogout,
}