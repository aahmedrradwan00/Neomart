const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, unique: true },
        slug: { type: String, lowercase: true, unique: true, required: true },
        image: { id: { type: String }, url: { type: String } },
        createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        categoryId: { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
        brands: [{ type: mongoose.Types.ObjectId, ref: "Brand" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('SubCategory', subCategorySchema);