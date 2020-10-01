const Posts = require("../models/posts");
const { convertText2Slug } = require("../utils/convertText2Slug");
const { isEmpty } = require("lodash");
const mongoose = require("mongoose");

module.exports = {
  getPost: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Posts.findOne({ _id: id, status: { $ne: "DELETE" } })
        .populate({
          path: "category",
          match: {
            status: "ACTIVE",
          },
          select: "name _id",
        })
        .populate({
          path: "authorId",
          match: {
            status: "ACTIVE",
          },
          select: "username _id fullname",
        });

      if (!post)
        return res.status(500).json({
          status: false,
          data: {
            message: "There was a problem",
          },
        });
      return res.status(200).json({
        status: true,
        data: {
          post,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: false,
        data: {
          message: "There was a problem",
        },
      });
    }
  },

  create: async (req, res) => {
    try {
      const thumbnail = req.files[0].path;
      const { title, content, category } = req.body;
      const slug = convertText2Slug(title);
      let categories = [];
      categories = category.split(",");
      const post = await Posts.create({
        title,
        slug,
        thumbnail,
        content,
        category: categories,
        authorId: req.userId,
      });
      if (!post)
        return res.status(500).json({
          status: false,
          data: {
            message: "There was a problem",
          },
        });
      return res.status(200).json({
        status: true,
        data: {
          post,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: false,
        data: {
          message: "There was a problem",
        },
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, category, status } = req.body;
      let categories = [];
      categories = category.split(",");
      const thumbnail = !isEmpty(req.files) ? req.files[0].path : null;
      const slug = convertText2Slug(title);

      let dataUpdate = {
        title,
        slug,
        content,
        status,
        category: categories,
        updatedAt: Date.now(),
      };
      if (thumbnail !== null) {
        dataUpdate.thumbnail = thumbnail;
      }

      const post = await Posts.updateOne({ _id: id }, dataUpdate);
      if (!post)
        return res.status(500).json({
          status: false,
          data: {
            message: "There was a problem",
          },
        });
      return res.status(200).json({
        status: true,
        data: {
          post,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: false,
        data: {
          message: "There was a problem",
        },
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Posts.updateOne(
        { _id: id },
        { status: "DELETE", updatedAt: Date.now() }
      );
      if (!post)
        return res.status(500).json({
          status: false,
          data: {
            message: "There was a problem",
          },
        });
      return res.status(200).json({
        status: true,
        data: {
          post,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: false,
        data: {
          message: "There was a problem",
        },
      });
    }
  },

  getList: async (req, res) => {
    try {
      const { limit, perpage } = req.query;
      let skip = limit * (perpage - 1);

      userId = req.userId;
      if (req.userLevel === 0) {
        const posts = await Posts.find({
          status: { $ne: "DELETE" },
        })
          .sort({ createdAt: "desc" })
          .skip(+skip)
          .limit(+limit);

        const count = await Posts.find({
          status: { $ne: "DELETE" },
        }).countDocuments();

        return res.status(200).json({
          status: true,
          data: {
            posts,
            limit,
            perpage,
            count,
          },
        });
      } else {
        const posts = await Posts.find({
          status: { $ne: "DELETE" },
          authorId: userId,
        })
          .skip(+skip)
          .limit(+limit);

        const count = await Posts.find({
          status: { $ne: "DELETE" },
          authorId: userId,
        }).countDocuments();

        return res.status(200).json({
          status: true,
          data: {
            posts,
            limit,
            perpage,
            count,
          },
        });
      }
    } catch (e) {
      return res.status(500).json({
        status: false,
        data: {
          message: "There was a problem",
          error: e,
        },
      });
    }
  },

  getList4Client: async (req, res) => {
    try {
      const { page } = req.query;
      let limit = 20;
      let skip = limit * (page - 1);
      const posts = await Posts.find({ status: "ACTIVE" })
        .populate({
          path: "authorId",
          match: {
            status: "ACTIVE",
          },
          select: "username _id fullname",
        })
        .sort({ createdAt: "desc" })
        .skip(+skip)
        .limit(limit);

      return res.status(200).json({
        status: true,
        data: {
          posts,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: false,
        data: {
          message: "There was a problem",
        },
      });
    }
  },

  getListByCategory: async (req, res) => {
    try {
      const { cateId, page } = req.query;
      let limit = 20;
      let skip = limit * (page - 1);
      const posts = await Posts.find({
        status: "ACTIVE",
        category: cateId,
      })
        .populate({
          path: "authorId",
          match: {
            status: "ACTIVE",
          },
          select: "username _id fullname",
        })
        .select("_id title content createdAt slug")
        .sort({ createdAt: "desc" })
        .skip(+skip)
        .limit(limit);

      return res.status(200).json({
        status: true,
        data: {
          posts,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: false,
        data: {
          message: "There was a problem",
        },
      });
    }
  },
};
