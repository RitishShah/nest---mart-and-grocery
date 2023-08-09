const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const utils = require('../utils/response');

// Create Order
exports.createOrder = async (req, res) => {
    // const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    const { itemsPrice, orderItems, paymentInfo, shippingInfo, shippingPrice, totalPrice } = req.body;
    taxPrice = 0;
  
    const order = await Order.create({
        _id: new mongoose.Types.ObjectId(),
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    utils.response(res, 'success', "Order Created Successfully", order, 201);
} 

// Get Single Order
exports.getSingleOrder = async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order) {
        return utils.response(res,'fail',"Order not found with this id", null, 404);
    }

    utils.response(res, 'success', "Order Detail Found", order, 200);
}

// Get All Orders of (Myself)
exports.getAllOrders = async (req, res) => {
    const orders = await Order.find({user:req.user._id});
    utils.response(res, 'success', "Found All Orders Done by Myself", orders, 200);
}

exports.getAllOrdersAdmin = async (req, res) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(element => {
        totalAmount += element.totalPrice;
    })

    utils.response(res, 'success', "Found All Orders Present in db", [totalAmount,orders], 200);
}

// update Order Status ---Admin
exports.updateOrderAdmin = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    console.log(order);
  
    if (!order) {
        return utils.response(res, 'success', "Order not found with this Id", null, 404);
    }

    if (order.orderStatus === "Delivered") {
        return utils.response(res, 'success', "You have already delivered this order", null, 400);
    }

    // If payment is done from user side then change status to shipped.
    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o._id, o.quantity);
      });
    }

    order.orderStatus = req.body.status;
  
    // If product is delivered to user then put date at deliveredAt.
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    utils.response(res, 'success', "Updated Order Status Successfully.", order, 200);
};

const updateStock = async (id,quantity) => {
    const product = await Product.findById(id);
    if(product) {
        product.stock -= quantity;
        await product.save({ validateBeforeSave: false });
    }
}

// delete order ---Admin
exports.deleteOrderAdmin = async (req, res) => {
    const order = Order.findById(req.params.id);

    if(!order) {
        return utils.response(res, 'success', "Order not found with this Id", null, 404);
    }

    const orderDeleted = await order.deleteOne();
    utils.response(res,'success',"Order deleted successfully", orderDeleted, 200);
}