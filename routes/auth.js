const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const verifyToken = require('../utils/verifyToken')

router.post('/register', authController.register)
router.get('/me', verifyToken, authController.getMe)
router.post('/login', authController.login)

module.exports = router;
