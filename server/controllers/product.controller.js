const Product = require('./../modules/product.model');
const Category = require('./../modules/category.model');
const SubCategory = require('./../modules/subCategory.model');
const Brand = require('./../modules/brand.model');
const catchAsync = require('./../utils/catchAsync');
const cloudinary = require('./../utils/cloud');
const slugify = require('slugify');

// check id for models
const checkId = async (model, id, modelName, next) => {
    if (id) {
        const doc = await model.findById(id);
        if (!doc) next(new Error(`${modelName} not found!`), { cause: 404 });
    }
};

// get all products
exports.allProducts = catchAsync(async (req, res, next) => {
    // Request query
    const { sort, keyword, category, subcategory, brand, page, select } = req.query;
    // check for category and subcategory and brand existence
    checkId(Category, category, 'Category', next);
    checkId(SubCategory, subcategory, 'Subcategory', next);
    checkId(Brand, brand, 'Brand', next);
    // Search products with applied filters
    const products = await Product.find().select(select).sort(sort).paginate(page).search(keyword);
    // Check if products are found
    if (!products.length) return next(new Error('canot find products !', { cause: 404 }));
    // send response
    res.status(200).json({ success: true, results: products.length, products });
});

// create product
exports.createProduct = catchAsync(async (req, res, next) => {
    // check for category and subcategory and brand existence
    await checkId(Category, req.body.category, 'Category', next);
    await checkId(SubCategory, req.body.subcategory, 'Subcategory', next);
    await checkId(Brand, req.body.brand, 'Brand', next);
    // Validate request body file
    if (!req.files) return next(new Error('product images are required!', { casue: 400 }));
    // create folderName for cloud
    const { nanoid } = await import('nanoid');
    const cloudFolder = nanoid();
    // Cloudinary upload defaultImage
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.defaultImage[0].path, {
        folder: `neomart/products/${cloudFolder}/defaultImage`,
    });
    // Cloudinary upload subImages
    req.files.images = await Promise.all(
        req.files.subImages.map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                folder: `neomart/products/${cloudFolder}/subImages`,
            });
            return { id: public_id, url: secure_url };
        })
    );
    // create product
    const newProduct = await Product.create({
        ...req.body,
        cloudFolder,
        slug: slugify(req.body.name),
        defaultImage: { url: secure_url, id: public_id },
        images: req.files.images,
        createdBy: req.user._id,
    });
    // send response
    res.status(201).json({ success: true, newProduct });
});

// update product
exports.updateProduct = catchAsync(async (req, res, next) => {
    // update slug if name given
    if (req.body.name) req.body.slug = slugify(req.body.name);
    // find product and update
    const updatedProduct = await Product.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, { ...req.body }, { new: true, runValidators: true });
    if (!updatedProduct) return next(new Error('Product not found or you do not have permission to perform this operation!', { cause: 404 }));
    // send response
    res.status(200).json({ success: true, updatedProduct });
});

// delete product
exports.deleteProduct = catchAsync(async (req, res, next) => {
    // find product and delete
    const product = await Product.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!product) return next(new Error('Product not found or you do not have permission to perform this operation!', { cause: 404 }));
    // delete all product images from Cloudinary
    const imageIds = product.images.map((img) => img.id);
    imageIds.push(product.defaultImage.id);
    await cloudinary.api.delete_resources(imageIds);
    // delete product folder from cloudinary
    await cloudinary.api.delete_folder(`neomart/products/${product.cloudFolder}`);
    // send response
    res.status(200).json({ success: true, message: 'product deleted' });
});