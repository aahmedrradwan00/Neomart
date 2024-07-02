const express = require('express');
const categoryController = require('./../controllers/category.controller');
const isAuthenticate = require('./../middleware/authentication.middleware');
const { allowedTo } = require('./../middleware/allowedTo.middleware');
const { validation } = require('./../middleware/validation.middleware');
const categoryValidation = require('./../validation/category.validation');
const imageUpload = require('./../middleware/uploadImage.middleware');
const subcategoryRouter = require('./../routes/subcategory.router');

const router = express.Router();

// subcategory
router.use('/:categoryId/subcategory', subcategoryRouter);

// get all category
router.get('/', categoryController.allCategory);

// Middlewares
router.use(isAuthenticate, allowedTo('admin'));

// create category
router.post('/', imageUpload().single('category'), validation(categoryValidation.createCategory), categoryController.createCategory);

// update category
router.patch('/:id', imageUpload().single('category'), validation(categoryValidation.updateCategory), categoryController.updateCategory);

// delete category
router.delete('/:id', validation(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;