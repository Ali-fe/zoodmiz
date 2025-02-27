const { validationResult, body ,param } = require('express-validator');
const {StatusCodes} = require ('http-status-codes');
const { BadRequestError } = require('../errors/customErrors');
const { default: mongoose } = require('mongoose');

const handelError = (err, req, res, next) => {
    console.error(err);
    const statuscode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const msg = err.message || 'مشکلی در سرور پیش آمده، لطفا بعدا تلاش کنید'
    res.status(statuscode).json({ msg: msg});
    next();
}
const getSubdomain = (req, res, next) => {
    const host = req.hostname; 
    const subdomain = host.split('.')[0]; 
    req.subdomain = subdomain;
    next();
}

const withValidationErrors = (validateValue)=>{
    return [
        validateValue
        ,
        (err,req,res,next)=>{
            const error = validationResult(req);
            if(!error.isEmpty()){
                const errorMsg= error.array().map(err=>{return err.msg});
                throw new BadRequestError(errorMsg);
            }
            next();
        }
    ]
}
const validateBody= withValidationErrors([
    body('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({min: 3 , max:50})
    .withMessage('name must be between 3 and 50')
    .trim(),
    // we can add another checker here as a array some body,param, ...
]);

const validateIdParam = withValidationErrors([
    param('id').custom(
        async (value)=> {
        const isvalid= mongoose.Types.ObjectId.isValid(value);
        if(!isvalid) throw new BadRequestError('invalid mongodb id');

        // add find that id on a model that want to find object here
    })
]);

module.exports = {
    handelError ,
    getSubdomain ,
    validateIdParam,
}