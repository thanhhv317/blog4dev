const express = require("express");
const router = express.Router();
const multer = require("multer");

const albumController = require("../controllers/albumController");
const verifyToken = require("../utils/verifyToken");
const isAdmin = require("../utils/isAdmin");

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

router.post(
  "/create",
  [verifyToken, isAdmin],
  upload.any(),
  albumController.createAlbum
);

router.get("/list", [verifyToken, isAdmin], albumController.getList);
router.delete('/delete/:id', [verifyToken, isAdmin], albumController.delete)

module.exports = router;
