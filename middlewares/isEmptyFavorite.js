const HttpError = require("../helpers/HttpError");

const isEmptyFavorite = (req, res, next) => {
    const keys = Object.keys(req.body);
    if(!keys.length) {
        return next(HttpError(400, "missing field favorite"))
    }
    next()
};
module.exports = isEmptyFavorite;