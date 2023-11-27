const mongoose = require("mongoose");

const transectionSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    invoice_no: {
      type: String,
      required: [true, "invoice_no is required"],
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    project: {
      type: String,
      required: [true, "project is required"],
    },
    amount: {
      type: String,
      required: [true, "amount is required"],
    },
    type: {
      type: String,
      required: [true, "type is required"],
    },
    category: {
      type: String,
      requires: [true, "cat is required"],
    },
    work_status: {
      type: String,
      required: [true, "work_status is required"],
    },
    phone_number: {
      type: Number,
      required: [true, "phone_number is required"],
    },
    description: {
      type: String,
      required: [true, "desc is required"],
    },
    address: {
      type: String,
      required: [true, "addr is required"],
    },
    date: {
      type: Date,
      required: [true, "data is required"],
    },
  },
  { timestamps: true }
);

const transectionModel = mongoose.model("transections", transectionSchema);
module.exports = transectionModel;
