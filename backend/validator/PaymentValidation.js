const utils = require('../utils/response');
const mongoose = require('mongoose');

exports.paymentValidation = (req, res, next) => {
    const amount = req.body.amount;
    if(!amount) {
        utils.response(res, 'fail', "Please Enter amount", null, 400);
    }
    next();
}

exports.sendStripeApiKeyValidation = (req, res, next) => {
    next();
}