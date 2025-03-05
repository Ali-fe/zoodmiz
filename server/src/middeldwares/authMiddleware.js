const { UnauthenticatedError } = require("../errors/customErrors");
const { verifyToken } = require("../utils/tokenUtils");

const authenticateUser = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) throw new UnauthenticatedError('authentication invalid');
    try {
        const { userId, role, restaurantId } = verifyToken(token);
        req.user = { userId, role, restaurantId };
        next();
    }
    catch (err) {
        throw new UnauthenticatedError('authentication invalid');
    }
}

module.exports = {
    authenticateUser
}