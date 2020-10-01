const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../utils/config");
const Users = require("../models/users");

module.exports = {
  register: async (req, res) => {
    try {
      const { username, password, fullname, birthday } = req.body;
      const checkUsername = /\s/g.test(username);
      if (checkUsername)
        return res.json({
          status: false,
          data: {
            message: "Validate username is not valid",
          },
        });

      const checkUsernameIsExist = await Users.find({
        username,
      }).countDocuments();
      if (checkUsernameIsExist > 0) {
        return res.status(200).json({
          status: false,
          data: {
            message: "The username already exists",
          },
        });
      }
      const hashedPassword = bcrypt.hashSync(password, 8);
      const user = await Users.create({
        username,
        password: hashedPassword,
        fullname,
        birthday,
      });
      return res.status(200).json({
        status: true,
        data: user.toObject(),
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

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (/\s/g.test(username))
        return res.json({
          status: false,
          data: {
            message: "Validate username is not valid",
          },
        });

      const user = await Users.findOne({ username, status: "ACTIVE" }).exec();
      if (!user) {
        return res.status(200).json({
          status: false,
          data: {
            message: "No user found",
          },
        });
      }
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid)
        return res.status(401).json({
          status: false,
          data: {
            token: null,
            message: "Password is not correct",
          },
        });

      const token = jwt.sign(
        { id: user._id, level: user.level },
        config.serect,
        {
          expiresIn: 86400,
        }
      );
      return res.status(200).json({
        status: true,
        data: {
          token,
          fullname: user.fullname,
          level: user.level,
          username: user.username,
          createdAt: user.createdAt,
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

  getMe: async (req, res) => {
    try {
      const user = await Users.findById(req.userId, { password: 0 });
      if (!user)
        return res.status(404).json({
          status: false,
          data: {
            message: "No user found",
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
        },
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { fullname, birthday } = req.body;
      const user = await Users.updateOne(
        {
          _id: req.userId,
        },
        {
          fullname,
          birthday,
        }
      );

      return res.status(200).json({
        status: true,
        data: user,
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

  updatePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      //todo
      const user = await Users.findOne({ _id: req.userId });

      const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
      if (!passwordIsValid)
        return res.status(200).json({
          status: false,
          data: {
            message: "The old password is not correct",
          },
        });

      const hashedPassword = bcrypt.hashSync(newPassword, 8);

      const updateUser = await Users.updateOne(
        { _id: req.userId },
        { password: hashedPassword }
      ).exec();

      return res.status(200).json({
        status: true,
        data: updateUser,
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
