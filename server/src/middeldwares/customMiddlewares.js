const { validationResult, body, param, check } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/customErrors');
const { default: mongoose } = require('mongoose');
const Restaurant = require('../models/restaurant.model');
const User = require('../models/user.model');
const { TABLE_STATUS } = require('../utils/constants');
const Edible = require('../models/edible.model');
const Table = require('../models/table.model');
const Order = require('../models/order.model');

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
        //.bail().matches(/^[a-zA-Z]+ $/).withMessage('name must be only letter and number')
        .bail().isLength({ min: 3, max: 20 }).withMessage('name size must be between 3 and 20'),
    body('lastName').notEmpty().withMessage('lastName is required').trim()
        //.bail().matches(/^[a-zA-Z]+ $/).withMessage('lastName must be only letter and number')
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
    param('restaurantId').custom(async (value) => {
        const isvalid = mongoose.Types.ObjectId.isValid(value);
        if (!isvalid) throw new BadRequestError('invalid mongodb id');
        const restaurant = await Restaurant.findById(value);
        if (!restaurant) throw new NotFoundError(`no restaurant by id ${value}`);
    }
    )
]);
const validateTableInput = withValidationErrors([
    body("numeral").optional().isInt({ min: 1 }).withMessage("Table number must be a positive integer").custom(
        async(numeral,{req})=>{
            const table = await Table.find({
                restaurant: req.user.restaurantId,
                numeral: numeral,
                _id: { $ne: req.params?.tableId } 
              });
        if (table.length) throw new BadRequestError(`There is another table with number ${numeral}`);
        }
    ),
    body("capacity").optional().isInt({ min: 1 }).withMessage("Table number must be a positive integer"),
    body("status").optional().isIn(Object.values(TABLE_STATUS))
        .withMessage("Invalid table status"),
]);

const validateTableIdParam = withValidationErrors([
    param('tableId').custom(async (tableId, { req }) => {
        const isvalid = mongoose.Types.ObjectId.isValid(tableId);
        if (!isvalid) throw new BadRequestError('invalid mongodb id');
        const table = await Table.findById(tableId);
        if (!table) throw new NotFoundError(`no table by id ${tableId}`);
    }
    )
]);

const validateEdibleInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required').trim()
        .bail().isLength({ min: 3, max: 50 }).withMessage('name size must be between 3 and 50'),
    body('price').notEmpty().withMessage('price is required')
        .bail().isCurrency().withMessage('invalid price format'),
    body('description').optional().isLength({ min: 5, max: 300 }).withMessage('description size must be between 3 and 300'),
    check("imageURL").optional().isString().withMessage("Invalid url path"),
    check("type").optional().isString().withMessage("type must be a string"),
    check("menu").optional().isBoolean().withMessage("menu must be a boolean"),
    check("discount").optional().isFloat({ min: 0, max: 100 }).withMessage("Discount must be between 0 and 100"),
]);
const validateEdibleIdParam = withValidationErrors([
    param('edibleId').custom(async (edibleId) => {
        const isvalid = mongoose.Types.ObjectId.isValid(edibleId);
        if (!isvalid) throw new BadRequestError('invalid mongodb id');
        const edible = await Edible.findById(edibleId);
        if (!edible) throw new NotFoundError(`no edible by id ${edibleId}`);
    }
    )
]);
const validateOrderInput = withValidationErrors([
    body('table').notEmpty().withMessage('table is required').bail().isInt({ min: 1 }).withMessage('table must be a positive integer'),
    body('status').notEmpty().withMessage('status is required').bail().isInt({ min: 1, max: 4 }).withMessage('invalid order status'), // 1-4 per ORDER_STATUS
    body('customerName').notEmpty().withMessage('customerName is required').isString().withMessage('customerName must be a string'),
    body('customerPhone').optional().isMobilePhone().withMessage('invalid customer phone'),
    body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
    body('items.*.edible').notEmpty().withMessage('edible is required for each item').bail().isMongoId().withMessage('edible must be a valid Mongo ID'),
    body('items.*.name').notEmpty().withMessage('name is required for each item').bail().isString().withMessage('name must be a string'),
    body('items.*.quantity').notEmpty().withMessage('quantity is required for each item').bail().isInt({ min: 1 }).withMessage('quantity must be a positive integer'),
    body('items.*.price').notEmpty().withMessage('price is required for each item').bail().isFloat({ min: 0 }).withMessage('price must be a positive number'),
    body('items.*.discount').notEmpty().withMessage('discount is required for each item').bail().isFloat({ min: 0 }).withMessage('discount must be a positive number'),
]);
const validateOrderIdParam = withValidationErrors([
    param('orderId').custom(async (orderId) => {
        const isvalid = mongoose.Types.ObjectId.isValid(orderId);
        if (!isvalid) throw new BadRequestError('invalid mongodb id');
        const order = await Order.findById(orderId);
        if (!order) throw new NotFoundError(`no order by id ${orderId}`);
    }
    )
]);
const validateRestaurantInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required').trim()
        //.bail().matches(/^[a-zA-Z]+$/).withMessage('name must be only letter and number')
        .bail().isLength({ min: 3, max: 50 }).withMessage('name size must be between 3 and 50'),
    body('phone').notEmpty().withMessage('phone is required')
        .bail().isMobilePhone().withMessage('invalid phone format'),
    body('description').optional().isLength({ min: 5, max: 300 }).withMessage('description size must be between 3 and 300'),
    body("address.street").optional().isString().withMessage("Street must be a string"),
    body("address.city").optional().isString().withMessage("City must be a string"),
    /*body("address.postalCode").optional().isPostalCode().withMessage("Invalid postal code"),*/
    body("address.buildingNumber").optional().isNumeric().withMessage("Building number must be a number"),
    body("location.lat").optional().isFloat().withMessage("Latitude must be a number"),
    body("location.lng").optional().isFloat().withMessage("Longitude must be a number")
]);
const validateUpdateUserInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required').trim()
        //.bail().matches(/^[a-zA-Z]+$/).withMessage('name must be only letter and number')
        .bail().isLength({ min: 3, max: 20 }).withMessage('name size must be between 3 and 20'),
    body('lastName').notEmpty().withMessage('lastName is required').trim()
        //.bail().matches(/^[a-zA-Z]+$/).withMessage('lastName must be only letter and number')
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

const validateFeedback = withValidationErrors([
    body('rating').notEmpty().withMessage('rating is required').bail().isInt({ min: 0, max: 5 }).withMessage('feedback rating must be between 0 and 5'),
    body('comment').optional().isString().withMessage('feedback comment must be a string'),
]);

module.exports = {
    errorHandlerMiddleware,
    validateRegisterInput,
    validateLoginInput,
    validateResIdParam,
    validateRestaurantInput,
    validateUpdateUserInput,
    validateTableInput,
    validateTableIdParam,
    validateEdibleInput,
    validateEdibleIdParam,
    validateOrderInput,
    validateOrderIdParam,
    validateFeedback
}