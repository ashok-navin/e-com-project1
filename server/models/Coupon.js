import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: 0,
    },
    minPurchase: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    perUserLimit: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.methods.isValid = function (purchaseAmount) {
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (this.expiryDate && new Date() > this.expiryDate) {
    return { valid: false, message: 'Coupon has expired' };
  }
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  if (purchaseAmount < this.minPurchase) {
    return {
      valid: false,
      message: `Minimum purchase of ₹${this.minPurchase} required for this coupon`,
    };
  }
  return { valid: true };
};

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
export default Coupon;
