const jwt = require('jsonwebtoken');

const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
}
const verifyToken = (token) => {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    return decode;
}
module.exports = {
    createJWT,
    verifyToken,
}