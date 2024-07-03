const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
    {
        name: { type: String, unique: true, min: 3, max: 32, required: true },
        slug: { type: String, lowercase: true, unique: true, required: true },
        image: { id: { type: String }, url: { type: String } },
        createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('Brand', brandSchema);
