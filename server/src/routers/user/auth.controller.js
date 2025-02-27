require('express-async-error')
const User = require("../../models/user/user.model")

const register = async (req,res) => {
    res.status(200).json({result : 'registered'});
}
const login = async (req,res) =>{
    res.send('logined');
}

module.exports = {
    register,
    login
}