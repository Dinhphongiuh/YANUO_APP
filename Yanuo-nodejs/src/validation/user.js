const {check, validationResult} = require('express-validator');

exports.validateUserSignUp = [
    check('userName').trim().not().isEmpty().isLength({min: 3, max: 20}).withMessage('Name must be whithin 3 to 20 character!'),
    check('password').trim().not().isEmpty().withMessage('password is empty!').isLength({min: 8, max: 20}).withMessage('Password must be whithin 3 to 20 character long!'),
    check('phoneNumber').trim().not().isEmpty().matches(/^0\d{9}$/).withMessage('Phone number must start with 0 and be 10 digits long!'),
    check('confirmPassword').trim().not().isEmpty().custom((value, {req}) => {
        if (value !== req.body.password)
        {
            throw new Error('Both password must be same!')
        }
        return true;
    }),
    
];

exports.userVlidation = (req, res, next) => {
    const result = validationResult(req).array()
    if (!result.length) return next();
    
    const error = result[0].msg;
    res.json({success: false, message: error});
};

exports.validateUserSignIn = [
    check('phoneNumber').trim().matches(/^0\d{9}$/).withMessage('Phone number must start with 0 and be 10 digits long!'),
    check('password').trim().not().isEmpty().withMessage('email / password is required!')
]