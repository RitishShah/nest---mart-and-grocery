const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const authorizedRoles = require('../middleware/authorizedRoles');
const { createOrder, getSingleOrder, getAllOrders, getAllOrdersAdmin, updateOrderAdmin, deleteOrderAdmin } = require('../controller/orderController');
const { createOrderValidation, getSingleOrderValidation, getAllOrdersValidation, getAllOrdersAdminValidation,
updateOrderAdminValidation, deleteOrderAdminValidation } = require('../validator/orderValidation');

router.post('/order/new', checkAuth, createOrderValidation, createOrder); // It will create an order.
router.get('/order/:id', checkAuth, authorizedRoles('admin'), getSingleOrderValidation, getSingleOrder); // It will find Single Order associated with id.
router.get('/orders/me', checkAuth, getAllOrdersValidation, getAllOrders) // It will find all orders of myself.
router.get('/admin/orders', checkAuth, authorizedRoles('admin'), getAllOrdersAdminValidation, getAllOrdersAdmin); // It will find all orders of db.
router.put('/admin/order/:id', checkAuth, authorizedRoles('admin'), updateOrderAdminValidation, updateOrderAdmin); // It will update status of delivery.
router.delete('/admin/order/:id', checkAuth, authorizedRoles('admin'), deleteOrderAdminValidation, deleteOrderAdmin); // It will delete order.

module.exports = router;