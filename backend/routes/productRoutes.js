const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct, createProductReview, getSingleProductReviews,
deleteReviews, getFilteredProducts } = require('../controller/productController');
const { createProductValidation, getAllProductsValidation, updateProductValidation, deleteProductValidation, 
getSingleProductValidation, createProductReviewValidation, getSingleProductReviewsValidation, deleteReviewsValidation } = require('../validator/productValidation');
const checkAuth = require('../middleware/checkAuth');
const authorizedRoles = require('../middleware/authorizedRoles');

router.get('/product', getAllProductsValidation, getFilteredProducts);    // It get filtered products
router.get('/products', getAllProductsValidation, getAllProducts);         // It get all products
router.get('/product/:id', getSingleProductValidation, getSingleProduct); // It get single product associated with id
router.post('/product/new', checkAuth, authorizedRoles('admin'), createProductValidation, createProduct);      // It will create a new product
router.put('/product/:id', checkAuth, authorizedRoles('admin'), updateProductValidation, updateProduct);       // It will update product associated with id
router.delete('/product/:id', checkAuth, authorizedRoles('admin'), deleteProductValidation, deleteProduct);    // It will delete product associated with id
router.post('/product/review', checkAuth, createProductReviewValidation, createProductReview);  // It will create or update review of a product
router.get('/product-reviews', checkAuth, getSingleProductReviewsValidation, getSingleProductReviews); // It will get all reviews of a product associated with id
router.delete('/product-review', checkAuth, authorizedRoles('admin'), deleteReviewsValidation, deleteReviews) // It will delete review of a product associated with id

module.exports = router;