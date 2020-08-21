const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken')
const isAdmin = require('../utils/isAdmin')
const categoriesController = require('../controllers/categoryController')

router.get('/view/:id', categoriesController.getCategory)
router.get('/list', categoriesController.getCateogies)
router.post('/create', [verifyToken, isAdmin], categoriesController.create)
router.put('/update/:id', [verifyToken,isAdmin], categoriesController.update)
router.delete('/delete/:id', [verifyToken, isAdmin], categoriesController.delete)

module.exports = router;