const express = require('express');
const brandController = require('./../controllers/brand.controller');
const isAuthenticate = require('./../middleware/authentication.middleware');
const { allowedTo } = require('./../middleware/allowedTo.middleware');
const { validation } = require('./../middleware/validation.middleware');
const brandValidation = require('./../validation/brand.validation');
const imageUpload = require('./../middleware/uploadImage.middleware');

const router = express.Router();

// get brands
router.get('/', brandController.allBrands);

// Middlewares
router.use(isAuthenticate, allowedTo('admin'));

// create brand
router.post('/', imageUpload().single('brand'), validation(brandValidation.createBrand), brandController.createBrand);

// update brand
router.patch('/:id', imageUpload().single('brand'), validation(brandValidation.updateBrand), brandController.updateBrand);

// delete brand
router.delete('/:id', validation(brandValidation.deleteBrand), brandController.deleteBrand);

module.exports = router;