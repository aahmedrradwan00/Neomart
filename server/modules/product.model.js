const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, required: true },
        description: { type: String, min: 10, max: 300 },
        slug: { type: String, required: true, lowercase: true },
        images: [{ id: { type: String }, url: { type: String } }],
        defaultImage: { id: { type: String }, url: { type: String } },
        category: { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
        brand: { type: mongoose.Types.ObjectId, ref: 'Brand', required: true },
        subcategory: { type: mongoose.Types.ObjectId, ref: 'Subcategory', required: true },
        averageRate: { type: Number, min: [1, 'Rating must be above or equal 1.0'], max: [5, 'Rating must be below or equal 5.0'] },
        availableItems: { type: Number, required: true },
        cloudFolder: { type: String, unique: true, required: true },
        soldItems: { type: Number, default: 0 },
        price: { type: Number, required: true },
        discount: { type: Number },
        createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// virtual to append reviews
productSchema.virtual('reviews', { ref: 'Review', localField: '_id', foreignField: 'product' });

// virtual to find finalPrice
productSchema.virtual('finalPrice').get(function () {
    discountPrice = (this.price * this.discount || 0) / 100;
    return Number.parseFloat(this.price - discountPrice).toFixed(2);
});

// populate
productSchema.pre(/^find/, function (next) {
    this.populate('reviews').populate({ path: 'createdBy', select: 'name email' });
    next();
});

// query to paginate
productSchema.query.paginate = function (page) {
    page = page * 1 || 1;
    const limit = 4 || 20;
    const skip = (page - 1) * limit;
    return this.skip(skip).limit(limit);
};

// query to search
productSchema.query.search = async function (keyword) {
    if (keyword) {
        const regex = new RegExp(keyword, 'i');
        const searchFields = this.model().schema.paths;
        const searchQueries = Object.keys(searchFields)
            .filter((field) => searchFields[field].instance === 'String')
            .map((field) => ({ [field]: regex }));
        return await this.find({ $or: searchQueries });
    }
    return this;
};

//methods
productSchema.methods.inStock = function (quantity) {
    return this.availableItems >= quantity;
};

module.exports = mongoose.model('Product', productSchema);
