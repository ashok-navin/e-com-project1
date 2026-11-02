import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  badge: { type: String, default: 'TRENDING' },
  image: { type: String, required: true },
  link: { type: String, default: '/#catalog' },
  isActive: { type: Boolean, default: true },
});

const websiteSettingsSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      default: 'TRENDING DART',
    },
    tagline: {
      type: String,
      default: "Discover What's Trending",
    },
    logoUrl: {
      type: String,
      default: '/logo.png',
    },
    contactPhone: {
      type: String,
      default: '82708 82715',
    },
    contactEmail: {
      type: String,
      default: 'trendingdart@gmail.com',
    },
    address: {
      type: String,
      default: 'Trending Dart HQ, Coimbatore, Tamil Nadu, India',
    },
    socialLinks: {
      instagram: {
        type: String,
        default: 'https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA==',
      },
      facebook: { type: String, default: 'https://facebook.com/trendingdart' },
      whatsapp: { type: String, default: 'https://wa.me/918270882715' },
    },
    homeBanners: [bannerSchema],
    deliveryFee: {
      type: Number,
      default: 49,
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 499,
    },
  },
  {
    timestamps: true,
  }
);

const WebsiteSettings =
  mongoose.models.WebsiteSettings ||
  mongoose.model('WebsiteSettings', websiteSettingsSchema);

export default WebsiteSettings;
