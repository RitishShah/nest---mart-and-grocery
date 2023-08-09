const utils = require('../utils/response');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

if(process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path:"backend/config/.env"
    });
}

exports.payment = async (req, res) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        metadata: {
            company: 'MERN'
        }
    });

    utils.response(res, 'success', "Successful Payment", myPayment.client_secret, 200);
}

exports.sendStripeApiKey = async (req, res) => {
    utils.response(res, 'success', "Sending Stripe API Key", process.env.STRIPE_PUBLISHABLE_KEY, 200);
}