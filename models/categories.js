const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE", "DELETE"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Categories", categorySchema);
