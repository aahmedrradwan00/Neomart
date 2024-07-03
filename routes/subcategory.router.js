const express = require('express');
const subCategoryController = require('./../controllers/subcategory.controller');
const isAuthenticate = require('./../middleware/authentication.middleware');
const { allowedTo } = require('./../middleware/allowedTo.middleware');
const { validation } = require('./../middleware/validation.middleware');
const subCategoryValidation = require('./../validation/subcategory.validation');
const imageUpload = require('./../middleware/uploadImage.middleware');

const router = express.Router({ mergeParams: true });

// get all subcategory
router.get('/', validation(subCategoryValidation.allSubcategory), subCategoryController.allSubCategory);

// Middlewares
router.use(isAuthenticate, allowedTo('admin'));

// create subcategory
router.post('/', imageUpload().single('subcategory'), validation(subCategoryValidation.createSubCategory), subCategoryController.createSubCategory);

// update subcategory
router.patch('/:id', imageUpload().single('subcategory'), validation(subCategoryValidation.updateSubCategory), subCategoryController.updateSubCategory);

// delete subcategory
router.delete('/:id', validation(subCategoryValidation.deleteSubCategory), subCategoryController.deleteSubCategory);

module.exports = router;