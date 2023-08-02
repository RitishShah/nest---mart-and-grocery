const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const { payment, sendStripeApiKey } = require('../controller/paymentController');
const { paymentValidation, sendStripeApiKeyValidation } = require('../validator/PaymentValidation');

router.post('/payment/process', checkAuth, paymentValidation, payment);
router.get('/stripe-api-key', checkAuth, sendStripeApiKeyValidation, sendStripeApiKey);

module.exports = router;