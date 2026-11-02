import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Offer title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: 1,
      max: 99,
    },
    bannerImage: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    applicableCategories: [String],
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

offerSchema.methods.isCurrentlyActive = function () {
  const now = new Date();
  return this.isActive && (!this.startDate || now >= this.startDate) && (!this.endDate || now <= this.endDate);
};

const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);
export default Offer;
