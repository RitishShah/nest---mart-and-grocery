const utils = require('../utils/response');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.createOrderValidation = (req, res, next) => {
    console.log("REached to validation");
    next();
    // const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    // const { address, city, state, country, pincode, phone } = shippingInfo;
    // const { id, status } = paymentInfo;

    // errorMsg = [];

    // if(!shippingInfo) {
    //     errorMsg.push("Please Provide Shipping Info");
    // } else {
    //     const required_field = ['address', 'city', 'state', 'country', 'pincode', 'phone'];
    //     required_field.forEach(element => {
    //         if(!element) {
    //             errorMsg.push(`${element} is required.`);
    //         } else if(element == 'phone') {
    //             if(`${phone}`.length != 10) {
    //                 errorMsg.push("Phone should be 10 digit");
    //             }
    //         }
    //     });
    // }

    // if(!orderItems) {
    //     errorMsg.push("Please Provide Order Items");
    // } else {
    //     for(let i=0;i<orderItems.length;i++) {
    //        const { productName, productPrice, quantity, productImage, productId } = orderItems[i];
    //        const required_field = ['productName', 'productPrice', 'quantity', 'productImage', 'productId'];

    //        required_field.forEach(element => {
    //             if(!element) {
    //                 errorMsg.push(`${element} in ${i+1}-th product is required`);
    //             }
    //             else if(element == productId) {
    //                 if(!ObjectId.isValid(element)) {
    //                     errorMsg.push(`Payment id = ${id} in ${i+1}-th product is not a valid Mongoose Id`);
    //                 }
    //             }
    //        })
    //     }
    // }

    // if(!paymentInfo) {
    //     errorMsg.push("Please Provide Payment Info");
    // } else {
    //     const required_field = [id, status];
    //     required_field.forEach(element => {
    //         if(!element) {
    //             errorMsg.push(`${element} is required`);
    //         }
    //     })
    // }

    // const required_field = [itemsPrice, taxPrice, shippingPrice, totalPrice, status, id]

    // required_field.forEach(element => {
    //     if(!element) {
    //         errorMsg.push(`${element} is required`);
    //     } 
        
    //     // else if(element == id) {
    //     //     if(!ObjectId.isValid(id)) {
    //     //         errorMsg.push(`Payment id = ${id} is not a valid Mongoose Id`);
    //     //     }
    //     // }
    // })

    // if(errorMsg.length > 0) {
    //     utils.response(res, 'fail', errorMsg, null, 400);
    // }

    // else {
    //     next();
    // }
}

exports.getSingleOrderValidation = (req, res, next) => {
    const id = req.params.id;

    if(!ObjectId.isValid(id)) {
        return utils.response(res, 'fail',`${id} is not a valid Mongoose Id`, null, 400);
    }
    next();
}

exports.getAllOrdersValidation = (req, res, next) => {
    next();
}

exports.getAllOrdersAdminValidation = (req, res, next) => {
    next();
}

exports.updateOrderAdminValidation = (req, res, next) => {
    const id = req.params.id;
    
    if(!ObjectId.isValid(id)) {
        return utils.response(res,'fail',`${id} is not a valid Mongoose Id`,null,400);
    }
    next();
}

exports.deleteOrderAdminValidation = (req, res, next) => {
    const id = req.params.id;
    
    if(!ObjectId.isValid(id)) {
        return utils.response(res,'fail',`${id} is not a valid Mongoose Id`,null,400);
    }
    next();
}