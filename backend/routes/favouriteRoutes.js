const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const { pushFavouriteProductsFromLocalStorageToDatabaseValidations, pushFavouriteProductsFromDatabaseToLocalStorageValidations } = 
require('../validator/favouriteValidation');
const { pushFavouriteProductsFromLocalStorageToDatabase, pushFavouriteProductsFromDatabaseToLocalStorage } = require('../controller/favouriteController');

router.post('/favourite/LocalStorageToDatabase', checkAuth, pushFavouriteProductsFromLocalStorageToDatabaseValidations, pushFavouriteProductsFromLocalStorageToDatabase);
router.get('/favourite/DatabaseToLocalStorage', checkAuth, pushFavouriteProductsFromDatabaseToLocalStorageValidations, pushFavouriteProductsFromDatabaseToLocalStorage);

module.exports = router;