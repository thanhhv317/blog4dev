const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const verifyToken = require('../utils/verifyToken')

router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/me', verifyToken, authController.getMe)
router.put('/update_profile', verifyToken, authController.updateProfile)
router.put('/update_password', verifyToken, authController.updatePassword)

module.exports = router;
