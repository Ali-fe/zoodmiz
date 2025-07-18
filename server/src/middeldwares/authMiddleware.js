const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, UnauthorizedError } = require("../errors/customErrors");
const { verifyToken } = require("../utils/tokenUtils");
const Customer = require("../models/customer.model");

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

const authorizePermision = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorize to access this route');
        };
        next();
    }
}

const authenticateCustomer = (req, res, next) => {
    const { customerToken } = req.cookies;
    if (!customerToken) 
        return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: `you are't login`,
      });
    try {
        const { customerId } = verifyToken(customerToken);
        req.customerId = customerId;
        next();
    } catch (err) {
        throw new UnauthenticatedError('authentication invalid');
    }
}

const checkCustomerExists = async (req, res, next) => {
    try {
        const phone = req.customerPhone;
        const customer = await Customer.findOne({ phone });
        if (!customer) throw new UnauthenticatedError('authentication invalid');
        req.customer = customer;
        next();
    } catch (err) {
        next(err);
    }
}
module.exports = {
    authenticateUser,
    authorizePermision,
    authenticateCustomer,
    checkCustomerExists
};