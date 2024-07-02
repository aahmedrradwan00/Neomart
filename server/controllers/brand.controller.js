const Brand = require('./../modules/brand.model');
const catchAsync = require('./../utils/catchAsync');
const slugify = require('slugify');
const cloudinary = require('./../utils/cloud');
const Category = require('./../modules/category.model');

// get all Brands
exports.allBrands = catchAsync(async (req, res, next) => {
    const brands = await Brand.find();
    if (!brands.length) return next(new Error('Brands not found!', { cause: 404 }));
    // send response
    res.status(200).json({ success: true, results: brands.length, brands });
});

// create brand
exports.createBrand = catchAsync(async (req, res, next) => {
    // Request data
    const { categories } = req.body;
    // check categories
    categories.forEach(async (categoryId) => {
        const category = await Category.findById(categoryId);
        if (!category) return next(new Error(`category ${categoryId} not found!`, { cause: 404 }));
    });
    // Validate request body file
    if (!req.file) return next(new Error('brand image is required!', { cause: 400 }));
    // check for brand existence
    const brand = await Brand.findOne({ name: req.body.name });
    if (brand) return next(new Error('"brand name already exist!"', { cause: 409 }));
    // Cloudinary upload file
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `neomart/brand`,
    });
    // create brand
    const newBrand = await Brand.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        image: { id: public_id, url: secure_url },
    });
    // Store brand for each category
    categories.forEach(async (categoryId) => {
        await Category.findByIdAndUpdate(categoryId, { $push: { brands: newBrand._id } });
    });
    // send response
    res.status(201).json({ success: true, newBrand });
});

// update brand
exports.updateBrand = catchAsync(async (req, res, next) => {
    // check for brand existence
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new Error('brand not found!', { cause: 404 }));
    // Validate request body and upload
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
            public_id: brand.image.id,
        });
        brand.image = { id: public_id, url: secure_url };
    }
    // update if name given
    if (req.body.name) {
        brand.name = req.body.name;
        brand.slug = slugify(req.body.name);
    }
    // save brand
    await brand.save();
    // send response
    res.status(200).json({ success: true, brand });
});

// delete brand
exports.deleteBrand = catchAsync(async (req, res, next) => {
    // check for brand existence
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new Error('brand not found!', { cause: 404 }));
    // delete brand from database
    await brand.deleteOne();
    // delete brand image from cloudinary
    await cloudinary.uploader.destroy(brand.image.id);
    // send response
    res.status(200).json({ success: true, message: 'brand deleted' });
});