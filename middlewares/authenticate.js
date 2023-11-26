const jwt = require("jsonwebtoken");
const HttpError = require("../helpers/index").HttpError;
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const { JWT_SECRET } = process.env;
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token) {
      return next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(HttpError(401, "Not authorized"));
  }
};

module.exports = authenticate;
