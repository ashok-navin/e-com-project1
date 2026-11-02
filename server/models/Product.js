import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
    },
    brand: {
      type: String,
      default: 'Trending Dart',
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      default: 10,
      min: [0, 'Stock cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Primary product image is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 12,
    },
    badge: {
      type: String,
      default: 'TRENDING',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    specifications: [
      {
        key: String,
        value: String,
      },
    ],
    variants: [
      {
        name: String,
        options: [String],
        price: Number,
        stock: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this && this.originalPrice && this.price && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
