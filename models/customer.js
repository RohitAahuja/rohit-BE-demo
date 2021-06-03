const Mongoose = require("mongoose");

const Schema = Mongoose.Schema;

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    //   required: true,
    },
    hobbies: [String],
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Customer", customerSchema);
