const express = require('express');
const orderController = require('./../controllers/order.controller');
const isAuthenticate = require('./../middleware/authentication.middleware');
const { allowedTo } = require('./../middleware/allowedTo.middleware');
const { validation } = require('./../middleware/validation.middleware');
const orderValidation = require('./../validation/order.vaildation');

const router = express.Router();

// get all orders
router.get('/', isAuthenticate, allowedTo('user', 'admin'), orderController.allOrder);

// create order
router.post('/', isAuthenticate, allowedTo('user'), validation(orderValidation.createOrder), orderController.cerateOrder);

// cancel order
router.put('/:id/cancel', isAuthenticate, allowedTo('user'), validation(orderValidation.cancelOrder), orderController.cancelOrder);

// deliver order
router.put('/:id/deliver', isAuthenticate, allowedTo('seller'), validation(orderValidation.updateOrderToDelivered), orderController.updateOrderToDelivered);

// update status
router.put('/:id/status', isAuthenticate, allowedTo('seller'), validation(orderValidation.updateOrderStatus), orderController.updateOrderStatus);

module.exports = router;