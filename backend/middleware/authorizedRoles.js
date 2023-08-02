const utils = require('../utils/response');

module.exports = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return utils.response(res,'fail',`${req.user.role} don't have access`,null,403);
        }
        next();
    }
}