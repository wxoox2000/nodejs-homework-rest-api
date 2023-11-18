const isValidOblectId = require("mongoose").isValidObjectId;
const httpError = require("../helpers/HttpError");
const isValidId = (req, res, next) => {
    const {contactId} = req.params;
    if(!isValidOblectId(contactId)) {
        return next(httpError(404, `${contactId} is not valid id`));
    }
    next()
}

module.exports = isValidId;