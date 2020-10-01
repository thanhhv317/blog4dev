const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    thumbnail: {
      type: String,
      default: "https://nordiccoder.com/app/uploads/2019/12/50-javascript.jpg",
    },
    content: {
      type: String,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
      },
    ],
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

module.exports = mongoose.model("Posts", postSchema);
