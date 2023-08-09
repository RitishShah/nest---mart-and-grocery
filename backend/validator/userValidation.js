const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {validateEmail, validatePassword} = require('../utils/helper');
const utils = require('../utils/response');


exports.createUserValidations = (req, res, next) => {
    const bodyData = req.body;
    let errorMsg = [];

    console.log("Validations");

    if (!bodyData.email) {
        errorMsg.push('Email is required');
    } else {
        if(!validateEmail(bodyData.email)) {
            errorMsg.push("Invalid Email Format!!");
        }
    }

    if (!bodyData.password) {
        errorMsg.push('password  is required')
    } else {
        // check the password contain 8 char, 1 Letter, 1 Number, 1 Special Char.
        if (!validatePassword(bodyData.password)) {
            errorMsg.push("Minimum eight characters, at least one letter, one number and one special character");
        }
    }

    var required_field = ['name'];
    for (let i = 0; i < required_field.length; i++) {
        if (!bodyData[required_field[i]]) {
            errorMsg.push(`${required_field[i]} is required.`)
        }
    }

    if (errorMsg.length > 0) {
        return utils.response(res, 'fail', errorMsg, null, 400);
    }

    bcrypt.hash(bodyData.password, 12, (error, result) => {
        if(error){
            return utils.response(res, 'fail', error.message, null, 400);
        }else{
            bodyData['_id'] = new mongoose.Types.ObjectId();
            bodyData['password'] = result;
            req.body = bodyData;
            next()
        }
    })
}

exports.loginValidations = (req, res, next) => {
    const bodyData = req.body;
    var errorMsg = [];

    if (!bodyData.email) {
        console.log("Email not found");
        errorMsg.push('Email is required');
    } else {
        if (!validateEmail(bodyData.email)) {
            errorMsg.push("Invalid Email Format!!");
        }
    }

    if (!bodyData.password) {
        errorMsg.push("password  is required");
    }

    if (errorMsg.length > 0) {
        return utils.response(res, 'fail', errorMsg, null, 400);
    } else {
        req.body = bodyData;
        next();
    }
}

exports.forgetPasswordValidations = (req, res, next) => {
    const email = req.body.email;
    if(!email) {
        return utils.response(res, 'fail', "Please insert E-mail", null, 404);
    }
    next();
}

exports.resetPasswordValidations = (req, res, next) => {
    const bodyData = req.body;
    const password = bodyData.password;
    const confirmPassword = bodyData.confirmPassword;
    const errorMsg = [];

    if(!password) {
        errorMsg.push("Please Insert Password");
    } else {
        if(!validatePassword(password)) {
            errorMsg.push("Minimum eight characters, at least one letter, one number and one special character")
        }
    }

    if(errorMsg.length > 0) {
        return utils.response(res, 'fail', errorMsg, null, 400);
    }

    if(!confirmPassword) {
        errorMsg.push("Please Insert ConfirmPassword");
    } else {
        if(password !== confirmPassword) {
            errorMsg.push("Password and confirmPassword not matching");
        }
    }

    if(errorMsg.length > 0) {
        return utils.response(res, 'fail', errorMsg, null, 400);
    }

    bcrypt.hash(password, 12, (error, result) => {
        if(error){
            return utils.response(res, 'fail', error.message, null, 400);
        }else{
            bodyData['password'] = result;
            req.body = bodyData;
            next();
        }
    })
}

exports.updatePasswordValidations = (req, res, next) => {
    const bodyData = req.body;
    const oldPassword = bodyData.oldPassword;
    const newPassword = bodyData.newPassword;
    const confirmPassword = bodyData.confirmPassword;
    const errorMsg = [];

    if(!oldPassword) {
        errorMsg.push("Please Insert Old Password");
    } else {
        if(!validatePassword(oldPassword)) {
            errorMsg.push("Old Password should have Minimum eight characters, at least one letter, one number and one special character")
        }
    }

    if(errorMsg.length > 0) {
        return utils.response(res, 'fail', errorMsg, null, 400);
    }

    if(!newPassword) {
        errorMsg.push("Please Insert New Password");
    } else {
        if(!validatePassword(newPassword)) {
            errorMsg.push("New Password should have Minimum eight characters, at least one letter, one number and one special character")
        }
    }

    if(oldPassword === newPassword) {
        errorMsg.push("Please insert New Password different than Old Password");
    }

    if(errorMsg.length > 0) {
        return utils.response(res, 'fail', errorMsg, null, 400);
    }

    if(!confirmPassword) {
        errorMsg.push("Please Insert Confirm Password");
    } else {
        if(newPassword !== confirmPassword) {
            errorMsg.push("New Password and Confirm Password not matching");
        }
    }

    if(errorMsg.length > 0) {
        return utils.response(res, 'fail', errorMsg, null, 400);
    }

    bcrypt.hash(newPassword, 12, (error, result) => {
        if(error){
            return utils.response(res, 'fail', error.message, null, 400);
        }else{
            bodyData['newPassword'] = result;
            req.body = bodyData;
            next();
        }
    })
}

exports.updateProfileValidations = (req, res, next) => {
    const bodyData = req.body;
    if(!bodyData.name) {
        return utils.response(res, 'fail', "Please Enter Name", null, 400);
    }
    if(!bodyData.email) {
        return utils.response(res, 'fail', "Please Enter E-mail", null, 400);
    } else {
        if(!validateEmail(bodyData.email)) {
            return utils.response(res, 'fail', "Minimum eight characters, at least one letter, one number and one special character", null, 400);
        }
    }
    next();
}

exports.getSingleUserValidation = (req, res, next) => {
    const id = req.params.id;

    if(!ObjectId.isValid(id)) {
        utils.response(res, 'fail', `${id} is not valid Mongoose Id`, null, 400);
    }
    next();
}

exports.updateUserRoleValidations = (req, res, next) => {
    const bodyData = req.body;
    const id = req.params.id;
    if(!bodyData.name) {
        return utils.response(res, 'fail', "Please Enter Name", null, 400);
    }
    if(!bodyData.role) {
        return utils.response(res, 'fail', "Please Enter Role", null, 400);
    } else {
        if(bodyData.role !== 'admin' && bodyData.role !== 'user') {
            return utils.response(res, 'fail', "Please Enter Valid Role", null, 400);
        }
    }
    if(!ObjectId.isValid(id)) {
        return utils.response(res, 'fail', `${id} is not valid Mongoose Id`, null, 400);
    }
    next();
}

exports.deleteUserValidations = (req, res, next) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)) {
        return utils.response(res, 'fail', `${id} is not valid Mongoose Id`, null, 400);
    }
    next();
}