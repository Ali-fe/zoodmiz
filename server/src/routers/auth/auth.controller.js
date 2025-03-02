
const { NotFoundError } = require("../../errors/customErrors");
const User = require("../../models/user/user.model")
const { StatusCodes } = require ('http-status-codes');

const httpRegister = async (req,res) => {
    const user = await User.createUser(req.body);
    res.status(StatusCodes.CREATED).json({result : user});
}
const httpLogin = async (req,res) => {

    res.status(StatusCodes.ACCEPTED).json({result : 'login'});
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