const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken')
const isAdmin = require('../utils/isAdmin')
const postController = require('../controllers/postController')

router.get('/view/:id', postController.getPost)
router.post('/create', [verifyToken, isAdmin], postController.create)
router.put('/update/:id', [verifyToken,isAdmin], postController.update)
router.delete('/delete/:id', [verifyToken, isAdmin], postController.delete)

module.exports = router;