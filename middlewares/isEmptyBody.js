const HttpError = require("../helpers/HttpError");

const isEmptyBody = (req, res, next) => {
    const keys = Object.keys(req.body);
    if(!keys.length) {
        return next(HttpError(400, "missing fields"))
    }
    next()
};
module.exports = isEmptyBody;