const mongoose = require('mongoose');
const { fromUnixTime, format } = require('date-fns');

const couponSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        expiredAt: { type: Number, required: true },
        discount: { type: Number, required: true },
        createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// virtual
couponSchema.virtual('expiredDate').get(function () {
    return format(fromUnixTime(this.expiredAt / 1000), "yyyy-MM-dd'T'HH:mm:ss'Z'");
});

module.exports = mongoose.model('Coupon', couponSchema);
