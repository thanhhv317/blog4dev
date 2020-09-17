const Comments = require("../models/comments");

module.exports = {
  create: async (req, res) => {
    try {
      const { name, email, comment, postId } = req.body;
      const checkEmailPattent = /[a-zA-Z-0-9\.\_]{1,}\@gmail\.com$/g;
      if (!checkEmailPattent.test(email)) {
        return res.json({
          status: false,
          data: {
            message: "The email is not correct",
          },
        });
      }
      const cmt = Comments.create({
        name,
        email,
        comment,
        postId,
        status: "INACTIVE",
      });
      if (!cmt)
        return res.status(500).json({
          status: false,
          data: {
            message: "The was a problem when creating a comment",
          },
        });
      return res.status(200).json({
        status: true,
        data: cmt,
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

  adminCreate: async (req, res) => {
    try {
      const { name, email, comment, postId } = req.body;

      const cmt = Comments.create({
        name,
        email,
        comment,
        postId,
      });
      if (!cmt)
        return res.status(500).json({
          status: false,
          data: {
            message: "The was a problem when creating a comment",
          },
        });
      return res.status(200).json({
        status: true,
        data: cmt,
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

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, comment, status } = req.body;
      const checkEmailPattent = /[a-zA-Z-0-9\.\_]{1,}\@gmail\.com$/g;
      if (!checkEmailPattent.test(email)) {
        return res.json({
          status: false,
          data: {
            message: "The email is not correct",
          },
        });
      }

      const cmt = await Comments.updateOne(
        { _id: id },
        { name, email, comment, status, updateAt: Date.now() }
      );
      if (!cmt)
        return res.status(500).json({
          status: false,
          data: {
            message: "The was a problem when updating a comment",
          },
        });
      return res.status(200).json({
        status: true,
        data: cmt,
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

  changeStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const cmt = await Comments.update({ _id: id }, { status });
      if (!cmt)
        return res.status(500).json({
          status: false,
          data: {
            message: "The was a problem when updating a comment",
          },
        });
      return res.status(200).json({
        status: true,
        data: cmt,
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

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const cmt = await Comments.update({ _id: id }, { status: "DELETE" });
      if (!cmt)
        return res.status(500).json({
          status: false,
          data: {
            message: "The was a problem when deleting a comment",
          },
        });
      return res.status(200).json({
        status: true,
        data: cmt,
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

  getListComment: async (req, res) => {
    try {
      const { page, perpage, find } = req.query;
      let skip = perpage * (page - 1);
      let filter = find ? find : "";

      const comments = await Comments.find({
        status: { $ne: "DELETE" },
        $or: [
          { name: new RegExp(filter, "i") },
          {
            email: new RegExp(filter, "i"),
          },
        ],
      })
        .populate({
          path: "postId",
          select: "_.id title slug",
          match: {
            status: "ACTIVE",
          },
        })
        .skip(+skip)
        .limit(+perpage);

      const total = await Comments.find({
        status: { $ne: "DELETE" },
        $or: [
          { name: new RegExp(filter, "i") },
          {
            email: new RegExp(filter, "i"),
          },
        ],
      }).count();

      return res.status(200).json({
        status: true,
        data: {
          comments,
          page,
          per_page: perpage,
          total,
          total_page: Math.ceil(total / perpage),
          filter,
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

  getListByPost: async (req, res) => {
    try {
      const { id } = req.query;
      const comments = await Comments.find({ status: "ACTIVE", postId:id });

      return res.status(200).json({
        status: true,
        data: {
          comments,
        },
      });
    } catch (err) {
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
