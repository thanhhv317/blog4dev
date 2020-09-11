const Users = require("../models/users");
const Categories = require("../models/categories");
const Posts = require("../models/posts");
const Comments = require("../models/comments");

module.exports = {
  getInfoDashboard: async (req, res) => {
    try {
      const users = await Users.find({ status: { $ne: "DELETE" } }).count();

      const categories = await Categories.find({
        status: { $ne: "DELETE" },
      }).count();

      const posts = await Posts.find({ status: { $ne: "DELETE" } }).count();

      const comments = await Comments.find({ status: "INACTIVE" }).count();
      // list comment inactive

      return res.status(200).json({
        status: true,
        data: {
          users,
          categories,
          posts,
          comments,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: false,
        data: {
          message: "There was a problem",
          e,
        },
      });
    }
  },

  getTotalPosts: async (req, res) => {
    try {
      const posts = await Posts.find({status: "ACTIVE"}).count();
      const posts2 = await Posts.find({status: "INACTIVE"}).count();
      const posts3 = await Posts.find({status: "DELETE"}).count();

      return res.status(200).json({
        status: true,
        data: {
          acitve: posts,
          inactive: posts2,
          delete: posts3,
          total: Number(posts + posts2 + posts3)
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: false,
        data: {
          message: "There was a problem",
          e,
        },
      });
    }
  },
};
