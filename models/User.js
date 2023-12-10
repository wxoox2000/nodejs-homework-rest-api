const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("findOneAndUpdate", function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
});
userSchema.post("save", (error, data, next) => {
  const {name, code} = error;
  error.status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
  next();
});
userSchema.post("findOneAndUpdate", (error, data, next) => {
  error.status = 400;
  next();
});
const User = model("user", userSchema);
module.exports = User;
