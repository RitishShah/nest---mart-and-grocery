const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const utils = require('../utils/response');
const dotenv = require('dotenv');

dotenv.config({
    path:"backend/config/.env"
})

module.exports = async (request, response, next) => {
    try {
        const token = request.cookies.jwt;
        console.log(token);
        const decode = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({_id: decode.userid},"-__v -password");
        if(!user){
            return utils.response(response, 'fail', 'Invalid User Token', null, 401)
        }
        
        request.userData = decode;
        request.user = user;
        next();
    }catch(error){
        utils.response(response, 'fail', 'Fail to Auth', null, 401)
    }
}