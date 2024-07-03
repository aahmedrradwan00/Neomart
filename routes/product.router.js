const express = require('express');
const productController = require('./../controllers/product.controller');
const isAuthenticate = require('./../middleware/authentication.middleware');
const { allowedTo } = require('./../middleware/allowedTo.middleware');
const { validation } = require('./../middleware/validation.middleware');
const productValidation = require('./../validation/products.vaildation');
const imageUpload = require('./../middleware/uploadImage.middleware');
const reviewRouter = require('./review.router');

const router = express.Router();

// reveiw
router.use('/:productId/review', reviewRouter);

// get all products
router.get('/', productController.allProducts);

// Middlewares
router.use(isAuthenticate, allowedTo('seller'));

// create product
router.post(
    '/',
    imageUpload().fields([
        { name: 'defaultImage', maxCount: 1 },
        { name: 'subImages', maxCount: 3 },
    ]),
    validation(productValidation.createProduct),
    productController.createProduct
);

// update Product
router.patch('/:id', validation(productValidation.updateProduct), productController.updateProduct);

// delete product
router.delete('/:id', validation(productValidation.deleteProduct), productController.deleteProduct);

module.exports = router;