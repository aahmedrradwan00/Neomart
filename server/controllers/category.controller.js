const Category = require('./../modules/category.model');
const catchAsync = require('./../utils/catchAsync');
const slugify = require('slugify');
const cloudinary = require('./../utils/cloud');

// get all category
exports.allCategory = catchAsync(async (req, res, next) => {
    const categories = await Category.find().populate([
        { path: 'createdBy', select: 'email name' },
        { path: 'brands', select: 'name' },
        { path: 'subcategory', select: 'name' },
    ]);
    if (!categories.length) return next(new Error('Categories not found!', { cause: 404 }));
    // send response
    res.status(200).json({ success: true, results: categories.length, data: categories });
});

// create category
exports.createCategory = catchAsync(async (req, res, next) => {
    // Validate request body file
    if (!req.file) return next(new Error('category image is required !', { cause: 400 }));
    // check for category existence
    const category = await Category.findOne({ name: req.body.name });
    if (category) return next(new Error('category name already exist !', { cause: 409 }));
    // Cloudinary upload file
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `neomart/category`,
        // width: 500,
        // height: 500,
        // crop: "fill",
    });
    // create category
    const newCategory = await Category.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url },
    });
    // send response
    res.status(201).json({ success: true, newCategory });
});

// update category
exports.updateCategory = catchAsync(async (req, res, next) => {
    // check for category existence
    const category = await Category.findById(req.params.id);
    if (!category) return next(new Error('category not found!', { cause: 404 }));
    // Validate request body and upload
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
            public_id: category.image.id,
        });
        category.image = { id: public_id, url: secure_url };
    }
    // update if name given
    if (req.body.name) {
        category.name = req.body.name;
        category.slug = slugify(req.body.name);
    }
    // save category
    await category.save();
    // send response
    res.status(200).json({ success: true, category });
});

// delete category
exports.deleteCategory = catchAsync(async (req, res, next) => {
    // check for category existence
    const category = await Category.findById(req.params.id);
    if (!category) return next(new Error('category not found!', { cause: 404 }));
    // delete category from database
    await category.deleteOne();
    // delete category image from cloudinary
    await cloudinary.uploader.destroy(category.image.id);
    // send response
    res.status(200).json({ success: true, message: 'category deleted' });
});
