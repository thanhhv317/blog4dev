const Users = require("../models/users");
const Categories = require("../models/categories");
const Posts = require("../models/posts");
const Comments = require("../models/comments");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { convertText2Slug } = require("../utils/convertText2Slug");

module.exports = {
  getInfoDashboard: async (req, res) => {
    try {
      const users = await Users.find({ status: { $ne: "DELETE" }, level: {$ne: 0} }).count();

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
      const posts = await Posts.find({ status: "ACTIVE" }).count();
      const posts2 = await Posts.find({ status: "INACTIVE" }).count();
      const posts3 = await Posts.find({ status: "DELETE" }).count();

      return res.status(200).json({
        status: true,
        data: {
          acitve: posts,
          inactive: posts2,
          delete: posts3,
          total: Number(posts + posts2 + posts3),
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

  // Selector: title, content.
  // Address: thumbnail, link.
  crawlWebsite: async (req, res) => {
    try {
      const { link, thumbnail, title, content } = req.body;
      const authorId = req.userId;

      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(link);

      // Pass arguments
      // => evalute: https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pageevaluatepagefunction-args
      const dimensions = await page.evaluate(
        (title, content) => {
          return {
            title: document.querySelector(title).innerText,
            content: document.querySelector(content).innerHTML,
          };
        },
        title,
        content
      );

      var viewSource = await page.goto(thumbnail);
      let imgName = `public/images/${Date.now()}.png`;
      fs.writeFile(`${imgName}`, await viewSource.buffer(), function (err) {
        if (err) {
          return res.status(303).json({
            status: false,
            data: {
              message: "The file save has an error",
            },
          });
        }
      });

      await browser.close();
      const slug = convertText2Slug(dimensions.title);
      const post = await Posts.create({
        title: dimensions.title,
        slug,
        thumbnail: imgName,
        content: dimensions.content,
        authorId,
      });

      if (!post) {
        return res.status(400).json({
          status: false,
          data: {
            message: "There was a problem when creating a post",
          },
        });
      }

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
          e,
        },
      });
    }
  },
};
