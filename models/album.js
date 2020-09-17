const mongoose = require("mongoose");
const albumSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
  },
  status: {
    type: String,
    default: "ACTIVE",
    enum: ["ACTIVE", "INACTIVE", "DELETE"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Album", albumSchema);
