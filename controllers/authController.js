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
const { nanoid } = require("nanoid");
const middlewares = require("../middlewares/index");
dotenv.config();

const avatarPath = path.resolve("public", "avatars");
const tmpPath = path.resolve("tmp");
const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(HttpError(409, "Email in use"));
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = `${gravatar.url(email)}?d=identicon`;
  const verificationToken =  nanoid();
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  middlewares.sendMail(email, verificationToken)
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
  if(!user.verify) {
    return next(HttpError(401, "Email is not verified"));
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
  if(!req.file) {
    return next(HttpError(400, "Provide file to upload"))
  }
  const { path: oldPath, filename } = req.file;
  const splitFilename = filename.split(".");
  const resizedFile = `${splitFilename[0]}_250x250.${splitFilename[1]}`;
  const newPath = path.join(avatarPath, resizedFile);
  Jimp.read(oldPath).then((img) => {
    img.resize(250, 250)
    img.write(newPath);
  });
  await fs.rename(oldPath, newPath);
  const newURL = path.join("avatars", resizedFile);
  await User.findByIdAndUpdate(_id, { avatarURL: newURL });
  res.status(200).json({
    "avatarURL": newURL
  })

};

const verification = async (req, res, next) => {
  const {verificationToken} = req.params;
  const user = await User.findOne({ verificationToken });
  if(!user) {
    return next(HttpError(404, 'User not found'));
  }
  await User.updateOne({verificationToken}, { verificationToken: null, verify: true });
  res.status(200).json({
    "message": 'Verification successful'
  })
}
const reVerification = async (req, res, next) => {
  const {email} = req.body;
  if(!email) {
    return next(HttpError(400, "missing required field email"))
  }
  const user = await User.findOne({ email });
  if(user.verify) {
    return next(HttpError(400, "Verification has already been passed"))
  }
  const verificationToken =  nanoid();
  await User.updateOne({email}, { verificationToken});
  middlewares.sendMail(email, verificationToken);
  res.status(200).json({
    "message": "Verification email sent"
  })
}

module.exports = {
  signup,
  signin,
  getCurrent,
  signout,
  avatar,
  verification,
  reVerification
};
