const isEmptyBody = require("./isEmptyBody");
const isValidId = require("./isValidId");
const isEmptyFavorite = require("./isEmptyFavorite");
const authenticate = require("./authenticate");
const upload = require("./upload");
const sendMail = require("./sendEmail");

module.exports = {
  isEmptyBody,
  isValidId,
  isEmptyFavorite,
  authenticate,
  upload,
  sendMail,
};
