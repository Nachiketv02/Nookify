const { types, required } = require("joi");
const mongoose = require("mongoose");
const Listing = require("../Model/listing");
const User = require("../Model/user");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  adult: {
    type: Number,
    min: 1,
    max: 4,
  },
  child: {
    type: Number,
    min: 1,
    max: 2,
  },
  totalPrice: { type: Number },
  listingP: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
