const Album = require("../models/album");
const { convertText2Slug } = require("../utils/convertText2Slug");

module.exports = {
  createAlbum: async (req, res) => {
    try {
      const image = req.files[0].path;
      const { description } = req.body;
      const slug = convertText2Slug(description);

      const album = await Album.create({
        description,
        slug,
        image,
        authorId: req.userId,
      });

      return res.status(200).json({
        status: true,
        data: {
          album,
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

      const album = await Album.find({
        status: { $ne: "DELETE" },
      })
        .skip(+skip)
        .limit(+limit);

      const count = await Album.find({
        status: { $ne: "DELETE" },
      }).countDocuments();

      return res.status(200).json({
        status: true,
        data: {
          album,
          limit,
          perpage,
          count,
        },
      });
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
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const album = await Album.updateOne(
        { _id: id },
        { status: "DELETE", updatedAt: Date.now() }
      );

      return res.status(200).json({
        status: true,
        data: {
          album,
        },
      });
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
};
