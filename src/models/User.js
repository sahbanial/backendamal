const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = new mongoose.Schema({
  id: String,
  userName: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: [
      "ADMIN",
      "OFFICE_ORDER",
      "ADMINISTRATIVE_DEPARTMENT",
      "FINANCIAL_DIRECTION",
      "ACCOUNTING_DEPARTMENT",
      "TAX_DEPARTMENT",
      "SCHEDILING_SERVICE",
      "FINANCIAL_SERVICE",
      "EXECUTIVE_MANAGMENT",
    ],
  },
  createdAt: Number,
  updatedAt: Number,
});
schema.pre("save", function (next) {
  if (this.isModified("password") && this.isNew) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(this.password, salt);
      this.password = hash;
      next();
    } catch (e) {
      next(e);
    }
  } else {
    next();
  }
});
schema.methods.isValidPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
schema.statics.hashPassword = function (password) {
  return new Promise((resolve, reject) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      resolve(hash);
    } catch (e) {
      reject(e);
    }
  });
};
const UserModel = mongoose.model("users", schema);
module.exports = UserModel;
