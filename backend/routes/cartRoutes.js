const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const { pushCartProductsFromLocalStorageToCart, pushCartProductsFromCartToLocalStorage } = require('../controller/cartController');
const { pushCartProductsFromLocalStorageToDatabaseValidations, pushCartProductsFromDatabaseToLocalStorageValidations } = require('../validator/cartValidation');

router.post('/cart/LocalStorageToDatabase', checkAuth, pushCartProductsFromLocalStorageToDatabaseValidations, pushCartProductsFromLocalStorageToCart);
router.get('/cart/DatabaseToLocalStorage', checkAuth, pushCartProductsFromDatabaseToLocalStorageValidations, pushCartProductsFromCartToLocalStorage);

module.exports = router;