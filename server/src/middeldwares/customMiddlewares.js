const { validationResult, body, param, check } = require('express-validator');
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
const validateRegisterInput = withValidationErrors([
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
const validateLoginInput = withValidationErrors([
    body('email').notEmpty().withMessage('email is required')
        .bail().isEmail().withMessage('invalid email format'),
    body('password').notEmpty().withMessage('password is required'),
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

const validateRestaurantInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required').trim()
        .bail().matches(/^[a-zA-Z]+$/).withMessage('name must be only letter and number')
        .bail().isLength({ min: 3, max: 50 }).withMessage('name size must be between 3 and 50'),
    body('phone').notEmpty().withMessage('phone is required')
        .bail().isMobilePhone().withMessage('invalid phone format'),
    body('description').optional().isLength({ min: 5, max: 300 }).withMessage('description size must be between 3 and 300'),
    body("address.street").optional().isString().withMessage("Street must be a string"),
    body("address.city").optional().isString().withMessage("City must be a string"),
    body("address.postalCode").optional().isPostalCode("any").withMessage("Invalid postal code"),
    body("address.buildingNumber").optional().isNumeric().withMessage("Building number must be a number"),
    body("location.lat").optional().isFloat().withMessage("Latitude must be a number"),
    body("location.lng").optional().isFloat().withMessage("Longitude must be a number")
]);
const validateTable = withValidationErrors([
    body("numeral").isInt({ min: 1 }).withMessage("Table number must be a positive integer"),
    body("status").optional().isIn(["AVAILABLE", "OCCUPIED", "RESERVED"])
        .withMessage("Invalid table status")
]);

const validateMenuItem = withValidationErrors([
    body("edibleID").isMongoId().withMessage("Invalid edible ID"),
    body("discount").optional().isFloat({ min: 0, max: 100 })
        .withMessage("Discount must be between 0 and 100"),
    body("available").optional().isBoolean().withMessage("Availability must be a boolean")
]);

const validateUpdateUserInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required').trim()
        .bail().matches(/^[a-zA-Z]+$/).withMessage('name must be only letter and number')
        .bail().isLength({ min: 3, max: 20 }).withMessage('name size must be between 3 and 20'),
    body('lastName').notEmpty().withMessage('lastName is required').trim()
        .bail().matches(/^[a-zA-Z]+$/).withMessage('lastName must be only letter and number')
        .bail().isLength({ min: 3, max: 30 }).withMessage('lastName size must be between 3 and 30'),
    body('email').notEmpty().withMessage('email is required')
        .bail().isEmail().withMessage('invalid email format').bail().custom(async (email, { req }) => {
            const user = await User.findOne({ 'email': email });
            if (user && user._id.toString() !== req.user.userId)
                throw new BadRequestError('email already exist')
        }),
    body('phone').notEmpty().withMessage('phone is required').bail()
        .isMobilePhone().withMessage('invalid phone format').bail().custom(async (phone, { req }) => {
            const user = await User.findOne({ 'phone': phone });
            if (user && user._id.toString() !== req.user.userId)
                throw new BadRequestError('phone already exist')
        }),
]);
module.exports = {
    errorHandlerMiddleware,
    validateRegisterInput,
    validateLoginInput,
    validateResIdParam,
    validateRestaurantInput,
    validateUpdateUserInput,
    validateTable,
    validateMenuItem
}