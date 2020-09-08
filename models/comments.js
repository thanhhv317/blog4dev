const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: "ACTIVE",
    enum: ["ACTIVE", "INACTIVE", "DELETE"],
  },
  updateAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Comments", commentSchema);
