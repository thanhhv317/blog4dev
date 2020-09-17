const express = require("express");
const router = express.Router();

const statisticController = require("../controllers/statisticController");
const verifyToken = require("../utils/verifyToken");
const isAdmin = require("../utils/isAdmin");

router.get('/dashboard_infomation', [verifyToken, isAdmin], statisticController.getInfoDashboard)
router.get('/total_post', [verifyToken, isAdmin], statisticController.getTotalPosts)
router.post('/crawl_website', [verifyToken, isAdmin], statisticController.crawlWebsite)

module.exports = router;
