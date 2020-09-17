const express = require("express");
const router = express.Router();
const multer = require("multer");

const verifyToken = require("../utils/verifyToken");
const isAdmin = require("../utils/isAdmin");
const postController = require("../controllers/postController");
const { convertText2Slug } = require("../utils/convertText2Slug");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    let nam = file.originalname.trim().replace(/\s/g, "");
    cb(null, Date.now() + nam);
  },
});
const upload = multer({ storage: storage });

// let imageList = [];

// router.post('/upload', upload.any(), (req, res) => {
//     let img = req.files[0].path;
//     imageList.push[img];
//     res.status(200).json({
//         msg: "success",
//         img
//     })
// })

router.get("/view/:id", postController.getPost);
router.post(
  "/create",
  [verifyToken, isAdmin],
  upload.any(),
  postController.create
);
router.put(
  "/update/:id",
  [verifyToken, isAdmin],
  upload.any(),
  postController.update
);
router.delete("/delete/:id", [verifyToken, isAdmin], postController.delete);
router.get("/list", [verifyToken, isAdmin], postController.getList);

// Client-side
router.get("/client/list", postController.getList4Client);
router.get("/client/list_by_category", postController.getListByCategory);

module.exports = router;
