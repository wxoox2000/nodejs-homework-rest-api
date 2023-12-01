const HttpError = require("../helpers/index").HttpError;
const schemas = require("../schemas/schemas");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { error } = require("console");
dotenv.config();

const avatarPath = path.resolve("public", "avatars");
const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(HttpError(409, "Email in use"));
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = `${gravatar.url(email)}?d=identicon`;
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};
const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(HttpError(401, "Email or password is wrong"));
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return next(HttpError(401, "Email or password is wrong"));
  }
  const payload = {
    id: user._id,
  };
  const { JWT_SECRET } = process.env;
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const signout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({ status: "204 No Content" });
};

const avatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  Jimp.read(oldPath, (err, img) => {
    if (err) {
      console.log(err);
    }
    img.resize(250, 250);
  });
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  const newURL = `http://localhost:3000/avatars/${filename}`;
  console.log(newURL);
  await User.findByIdAndUpdate(_id, { avatarURL: newURL });
  res.status(200).json({
    "avatarURL": newURL
  })

};

module.exports = {
  signup,
  signin,
  getCurrent,
  signout,
  avatar,
};
