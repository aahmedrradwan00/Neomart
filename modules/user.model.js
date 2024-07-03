const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { bool, boolean } = require('joi');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, min: 6, max: 20 },
        phoneNumber: { type: String, required: true },
        isActive: { type: Boolean, default: false },
        passwordChangedAt: { type: Date, default: Date.now() },
        passwordResetToken: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,
        active: { type: Boolean, default: true },
        role: {
            type: String,
            enum: ['user', 'seller', 'admin'],
            default: 'user',
        },
        profileImage: { url: { type: String }, id: { type: String } },
        wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    },
    { timestamps: true }
);

// hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', userSchema);