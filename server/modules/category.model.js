const mongoose = require('mongoose');
const subCategory = require('./subCategory.model');

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, unique: true, min: 3, max: 32, required: true },
        slug: { type: String, lowercase: true, unique: true, required: true },
        image: { id: { type: String }, url: { type: String } },
        createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        brands: [{ type: mongoose.Types.ObjectId, ref: 'Brand' }],
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// delete subCategory
categorySchema.post('deleteOne', async function () {
    await subCategory.deleteMany({ category: this._id });
});

// virtual
categorySchema.virtual('subcategory', { ref: 'SubCategory', localField: '_id', foreignField: 'categoryId' });

module.exports = mongoose.model('Category', categorySchema);