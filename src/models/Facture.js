const mongoose = require("mongoose");
const moment = require("moment");
const schema = new mongoose.Schema({
  id: String,
  num: String,
  provider: String,
  receptionDate: Number,
  amount: Number,
  file: String,
  destination: String,
  paymentMethod: {
    type: String,
    enum: ["CHEC", "VIRMENT", null],
    default: null,
  },
  status: {
    type: String,
    enum: [
      "PENDING",
      "APPROVED_ADMINISTRATIF",
      "REFUSED",
      //"APPROVED_FINANCIAL_DIRECTION",
      "IN_INSTANCE",
      "APPROVED_DAF",
      "IN_INSTANCE_DAF",
      "COMPTABILISED",
      "APPROVED_FISCAL",
      "APPROVED_PAYMENT",
      "APPROVED_SERVICE_FINANCIAL",
      "FINAL_APPROVED",
      "FINAL_APPROVED_OFFICE_ORDER",
    ],
  },
  location: {
    type: String,
    enum: [
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
  if (this.isNew) {
    this.createdAt = moment().valueOf();
    if (!this.id) {
      this.id = this._id.toString();
    } else {
      this._id = this.id;
    }
  } else {
    this.updatedAt = moment().valueOf();
  }
  next();
});
const FactureModel = mongoose.model("factures", schema);
module.exports = FactureModel;
