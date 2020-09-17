const Users = require("../models/users");
const bcrypt = require("bcryptjs");

module.exports = {
  getListUser: async (req, res) => {
    try {
      const { page, perpage, find } = req.query;
      let skip = perpage * (page - 1);
      let filter = find ? find : "";

      const users = await Users.find({
        level: 1,
        status: { $ne: "DELETE" },
        $or: [
          { username: new RegExp(filter, "i") },
          {
            fullname: new RegExp(filter, "i"),
          },
        ],
      })
        .skip(+skip)
        .limit(+perpage);

      const total = await Users.find({
        status: { $ne: "DELETE" },
        $or: [
          { username: new RegExp(filter, "i") },
          {
            fullname: new RegExp(filter, "i"),
          },
        ],
      }).count();

      return res.status(200).json({
        status: true,
        data: {
          users,
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
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { fullname, status, birthday } = req.body;

      const user = await Users.update(
        { _id: id },
        { fullname, birthday, status, updateAt: Date.now() }
      );
      if (!user)
        return res.status(500).json({
          status: false,
          data: {
            message: "The was a problem when updating a comment",
          },
        });
      return res.status(200).json({
        status: true,
        data: user,
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
      const user = await Users.update({ _id: id }, { status: "DELETE" });
      if (!user)
        return res.status(500).json({
          status: false,
          data: {
            message: "The was a problem when deleting a user",
          },
        });
      return res.status(200).json({
        status: true,
        data: user,
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
  adminChangePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 8);
      const user = await Users.update(
        { _id: id },
        {
          password: hashedPassword,
          updateAt: Date.now(),
        }
      );
      if (!user)
        return res.status(500).json({
          status: false,
          data: {
            message: "The was a problem when updating password a user",
          },
        });
      return res.status(200).json({
        status: true,
        data: user,
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

  create: async (req, res) => {
    try {
      const { fullname, username, birthday, password } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 8);

      const checkUserExist = await Users.find({ username }).count();
      if (checkUserExist) {
        return res.status(200).json({
          status: false,
          data: {
            message: "The username already exists",
          },
        });
      }

      let usernameTrim = username.replace(/\s/gi, "");

      const user = await Users.create({
        fullname,
        username: usernameTrim,
        password: hashedPassword,
        birthday,
      });
      if (!user)
        return res.status(500).json({
          status: false,
          data: {
            message: "The was a problem when creating a user",
          },
        });
      return res.status(200).json({
        status: true,
        data: user,
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
