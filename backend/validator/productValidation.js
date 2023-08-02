const utils = require('../utils/response');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.createProductValidation = (req, res, next) => {
    const body = req.body;
    let errorMsg = [];

    let requiredFields = ["name","description","price","stock","category","images"];

    for(let i=0;i<requiredFields.length;i++) {
        if(!body[requiredFields[i]]) {
            errorMsg.push(`${requiredFields[i]} is required`);
        }

        else {
            if(requiredFields[i] === 'name') {
                if(body['name'].length > 20) {
                    errorMsg.push("product name can't exceeds 20 characters");
                }
            }

            if(requiredFields[i] === 'description') {
                if(body['description'].length > 4000) {
                    errorMsg.push("description can't exceeds 4000 characters")
                }
            }

            if(requiredFields[i] === 'price') {
                if(body['price'].length > 8) {
                    errorMsg.push("Price can't exceeds 8 characters");
                }
            }
        }
    }

    if(body.offerPrice && body.offerPrice.length > 4) {
        errorMsg.push("Discount Price can't exceeds 4 characters");
    }

    if(errorMsg.length > 0) {
        return utils.response(res,'fail',errorMsg,null,400);
    }

    next();
}

exports.getAllProductsValidation = (req, res, next) => {
    next();
}

exports.updateProductValidation = (req, res, next) => {
    const body = req.body;
    const id  = req.params.id;

    let errorMsg = [];

    if(!ObjectId.isValid(id)) {
        errorMsg.push(`${id} is not valid Mongoose Id`);
    }
    
    let requiredFields = ["name","description","price","stock","category"];

    for(let i=0;i<requiredFields.length;i++) {
        if(!body[requiredFields[i]]) {
            errorMsg.push(`${requiredFields[i]} is required`);
        }

        else {
            if(requiredFields[i] === 'name') {
                if(body['name'].length > 20) {
                    errorMsg.push("product name can't exceeds 20 characters");
                }
            }

            if(requiredFields[i] === 'description') {
                if(body['description'].length > 4000) {
                    errorMsg.push("description can't exceeds 4000 characters")
                }
            }

            if(requiredFields[i] === 'price') {
                if(body['price'].length > 8) {
                    errorMsg.push("Price can't exceeds 8 characters");
                }
            }
        }
    }

    if(body.discountPrice && body.discountPrice.length > 4) {
        errorMsg.push("Discount Price can't exceeds 4 characters");
    }

    if(errorMsg.length > 0) {
        return utils.response(res,'fail',errorMsg,null,400);
    }

    next();
}

exports.deleteProductValidation = (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    if(!ObjectId.isValid(id)) {
        return utils.response(res,'fail',`${id} is not a valid Mongoose Id`,null,400);
    }

    next();
}

exports.getSingleProductValidation = (req, res, next) => {
    const id = req.params.id;
    
    if(!ObjectId.isValid(id)) {
        return utils.response(res,'fail',`${id} is not a valid Mongoose Id`,null,400);
    }

    next();
}

exports.createProductReviewValidation = (req, res, next) => {
    const bodyData = req.body;

    if(!bodyData.rating) {
        return utils.response(res,'fail',"Please insert rating",null,400);
    }
    if(!ObjectId.isValid(bodyData.productId)) {
        return utils.response(res,'fail',`${id} is not a valid Mongoose Id`,null,400);
    }
    next();
}

exports.getSingleProductReviewsValidation = (req, res, next) => {
    const id = req.query.id;

    if(!ObjectId.isValid(id)) {
        return utils.response(res,'fail',`${id} is not a valid Mongoose Id`,null,400);
    }
    next();
}

exports.deleteReviewsValidation = (req, res, next) => {
    const reviewId = req.query.reviewId;
    const productId = req.query.productId;

    if(!ObjectId.isValid(reviewId)) {
        return utils.response(res,'fail',`${reviewId} is not a valid Mongoose Id`,null,400);
    }
    if(!ObjectId.isValid(productId)) {
        return utils.response(res,'fail',`${productId} is not a valid Mongoose Id`,null,400);
    }
    next();
}