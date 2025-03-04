const { validationResult, body, param, query } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/customErrors');
const { default: mongoose } = require('mongoose');
const Restaurant = require('../models/restaurant.model');

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
                if(errorMsg[0].startsWith('no restaurant'))
                {
                    throw new NotFoundError(errorMsg);
                }
                throw new BadRequestError(errorMsg);
            }
            next();
        }
    ]
}
const validateRegisterBody = withValidationErrors([
    body('name').notEmpty().withMessage('name is required').isLength({ min: 3, max: 50 }).withMessage('name must be between 3 and 50').trim(),
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('email is not correct'),
    body('password').notEmpty().withMessage('password is required'),

]);
const validateIdParam = withValidationErrors([
    param('id').custom(async (value) => {
        const isvalid = mongoose.Types.ObjectId.isValid(value);
        if (!isvalid) throw new BadRequestError('invalid mongodb id');
        const restaurant = await Restaurant.findById(value);
        if (!restaurant) throw new NotFoundError(`no restaurant by id ${value}`);
    }
    )
]);

module.exports = {
    errorHandlerMiddleware,
    validateRegisterBody,
    validateIdParam
}