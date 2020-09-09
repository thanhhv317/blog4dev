const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const verifyToken = require("../utils/verifyToken");
const isAdmin = require("../utils/isAdmin");
const isSuperAdmin = require("../utils/isSuperAdmin");

router.get("/list", [verifyToken, isSuperAdmin], userController.getListUser);
router.put("/update/:id", [verifyToken, isSuperAdmin], userController.update);
router.delete(
  "/delete/:id",
  [verifyToken, isSuperAdmin],
  userController.delete
);
router.put(
  "/change_password/:id",
  [verifyToken, isSuperAdmin],
  userController.adminChangePassword
);

router.post("/create", [verifyToken, isSuperAdmin], userController.create);

module.exports = router;
