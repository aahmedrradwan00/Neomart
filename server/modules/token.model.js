const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema(
    {
        token: { type: String, required: true },
        user: { type: mongoose.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now, expires: '1h' },
        isValid: { type: Boolean, default: true },
        agent: { type: String },
        expiredAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Token', tokenSchema);
