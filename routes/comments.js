const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const verifyToken = require("../utils/verifyToken");
const isAdmin = require("../utils/isAdmin");
const isSuperAdmin = require("../utils/isSuperAdmin");

// Reader create
router.post("/create", commentController.create);

router.post(
  "/admin_create",
  [verifyToken, isAdmin],
  commentController.adminCreate
);
router.delete("/delete/:id", [verifyToken, isAdmin], commentController.delete);
router.post(
  "/change_status/:id",
  [verifyToken, isAdmin],
  commentController.changeStatus
);
router.put(
  "/update/:id",
  [verifyToken, isSuperAdmin],
  commentController.update
);

router.get("/list", [verifyToken, isAdmin], commentController.getListComment);

module.exports = router;
