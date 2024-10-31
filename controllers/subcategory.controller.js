const catchAsync = require('./../utils/catchAsync');
const slugify = require('slugify');
const Category = require('./../modules/category.model');
const SubCategory = require('./../modules/subCategory.model');
const cloudinary = require('./../utils/cloud');

// get all subCategory
exports.allSubCategory = catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;
    let SubCategories;
    if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) return next(new Error('this category not found', { cause: 404 }));
        SubCategories = await SubCategory.find({ categoryId });
    } else {
        SubCategories = await SubCategory.find().populate([
            { path: 'categoryId', select: 'name createdBy' },
            { path: 'createdBy', select: 'name _id' },
        ]);
    }
    if (!SubCategories.length) return next(new Error('subcategories not found!', { cause: 404 }));
    return res.status(200).json({ success: true, results: SubCategories.length, SubCategories });
});

// create subCategory
exports.createSubCategory = catchAsync(async (req, res, next) => {
    const catId = req.params.categoryId ? req.params.categoryId : req.body.categoryId;
    const category = await Category.findById(catId);
    if (!category) return next(new Error('this category not found', { cause: 404 }));
    if (!req.file) return next(new Error('category image is required!', { cause: 400 }));
    const subcategory = await SubCategory.findOne({ name: req.body.name });
    if (subcategory) return next(new Error('"subcategory name already exist!"', { cause: 409 }));
    // Cloudinary upload file
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `neomart/subCcategory`,
    });
    // create subcategory
    const newSubCategory = await SubCategory.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url },
        categoryId: req.body.categoryId,
    });
    res.status(201).json({ success: true, newSubCategory });
});

// update subCategory
exports.updateSubCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return next(new Error('this category not found', { cause: 404 }));
    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory) return next(new Error('subcategory not found!', { cause: 404 }));
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { public_id: subcategory.image.id });
        subcategory.image = { id: public_id, url: secure_url };
    }
    if (req.body.name) {
        subcategory.name = req.body.name;
        subcategory.slug = slugify(req.body.name);
    }
    await subcategory.save();
    res.status(200).json({ success: true, subcategory });
});

// delete subCategory
exports.deleteSubCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return next(new Error('this category not found', { cause: 404 }));
    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory) return next(new Error('subcategory not found!', { cause: 404 }));
    await subcategory.deleteOne();
    // delete subcategory image from cloudinary
    await cloudinary.uploader.destroy(subcategory.image.id);
    res.status(200).json({ success: true, message: 'subcategory deleted' });
});
