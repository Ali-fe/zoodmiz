const { validationResult, body, param, query } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/customErrors');
const { default: mongoose } = require('mongoose');
const Restaurant = require('../models/restaurant.model');
const User = require('../models/user.model');

const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(err);
    const statuscode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const msg = err.message || 'مشکلی در سرور پیش آمده، لطفا بعدا تلاش کنید'
    res.status(statuscode).json({ msg: msg });
    next();
}
const getSubdomain = (req, res, next) => {
    const host = req.hostname;
    const subdomain = host.split('.')[0];
    req.subdomain = subdomain;
    next();
}

const withValidationErrors = (validateValue) => {
    return [
        validateValue
        , (req, res, next) => {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                const errorMsg = error.array().map(err => { return err.msg });
                if (errorMsg[0].startsWith('no restaurant')) {
                    throw new NotFoundError(errorMsg);
                }
                throw new BadRequestError(errorMsg);
            }
            next();
        }
    ]
}
const validateRegisterBody = withValidationErrors([
    body('name').notEmpty().withMessage('name is required').trim()
        .bail().matches(/^[a-zA-Z]+$/).withMessage('name must be only letter and number')
        .bail().isLength({ min: 3, max: 20 }).withMessage('name size must be between 3 and 20'),
    body('lastName').notEmpty().withMessage('lastName is required').trim()
        .bail().matches(/^[a-zA-Z]+$/).withMessage('lastName must be only letter and number')
        .bail().isLength({ min: 3, max: 30 }).withMessage('lastName size must be between 3 and 30'),
    body('email').notEmpty().withMessage('email is required')
        .bail().isEmail().withMessage('invalid email format').bail().custom(async (value) => {
            const user = await User.findOne({ 'email': value });
            if (user) throw new BadRequestError('email already exist')
        }),
    body('password').notEmpty().withMessage('password is required')
        .bail().isLength({ min: 8 }).withMessage('password must be at least 8 character long'),
    body('restaurantName').notEmpty().withMessage('restaurantName is required'),
    body('phone').notEmpty().withMessage('phone is required').bail()
        .isMobilePhone().withMessage('invalid phone format').bail().custom(async (value) => {
            const user = await User.findOne({ 'phone': value });
            if (user) throw new BadRequestError('phone already exist')
        }),
]);

const validateResIdParam = withValidationErrors([
    param('id').custom(async (value) => {
        const isvalid = mongoose.Types.ObjectId.isValid(value);
        if (!isvalid) throw new BadRequestError('invalid mongodb id');
        const restaurant = await Restaurant.findById(value);
        if (!restaurant) throw new NotFoundError(`no restaurant by id ${value}`);
    }
    )
]);

const validateRestaurantBody = withValidationErrors([

]);

module.exports = {
    errorHandlerMiddleware,
    validateRegisterBody,
    validateResIdParam,
    validateRestaurantBody
}