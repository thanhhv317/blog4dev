const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      default: "INACTIVE",
      enum: ["ACTIVE", "INACTIVE", "DELETE"],
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
