import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Offer from '../models/Offer.js';
import WebsiteSettings from '../models/WebsiteSettings.js';

dotenv.config();

const initialCategories = [
  {
    name: 'Bathroom Essentials',
    description: 'Hygienic wall-mounted organizers, soap holders, and drain racks',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
  },
  {
    name: 'Home Organizers',
    description: 'Smart space-saving storage racks and counter protectors',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
  },
  {
    name: 'Smart Utility',
    description: 'No-drill wall fixtures, self-adhesive clips, and handy home tools',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  },
  {
    name: 'Kitchen Gadgets',
    description: 'Trending oil dispensers, sink drainers, and spice racks',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
  },
];

const initialProducts = [
  {
    title: 'Double Soap Holder with Flip Lids & Drainage Tray',
    description:
      'Wall-mounted dual soap box featuring hygienic dust-proof flip covers, bottom ventilation drainage tray, and an integrated loofah hook. Eliminates soggy counter mess and protects soaps from shower splashes.',
    price: 349,
    originalPrice: 599,
    category: 'Bathroom Essentials',
    brand: 'Trending Dart',
    stock: 85,
    badge: 'TRENDING #1',
    rating: 4.9,
    reviewCount: 164,
    image: '/hero-soap-holder.jpg',
    images: [
      '/hero-soap-holder.jpg',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    ],
    isFeatured: true,
    specifications: [
      { key: 'Material', value: 'High Grade ABS Plastic' },
      { key: 'Mounting', value: 'Heavy Duty Self Adhesive (No Drilling)' },
      { key: 'Drainage', value: 'Removable Drip Tray' },
      { key: 'Dimensions', value: '25cm x 12cm x 5cm' },
    ],
    variants: [
      { name: 'Color', options: ['Nordic White', 'Emerald Green', 'Charcoal Gray'], price: 349, stock: 85 },
    ],
  },
  {
    title: 'Dual Dispenser Waterproof Caddy for Soaps & Wipes',
    description:
      'Multi-functional dual compartments designed to hold bar soaps, facial wipes, and accessories with waterproof flip covers. Built-in hooks for razors and washcloths.',
    price: 399,
    originalPrice: 699,
    category: 'Bathroom Essentials',
    brand: 'Trending Dart',
    stock: 50,
    badge: 'BEST SELLER',
    rating: 4.8,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    ],
    isFeatured: true,
    specifications: [
      { key: 'Capacity', value: 'Dual Compartment' },
      { key: 'Waterproof', value: 'IPX4 Splashproof Lids' },
    ],
  },
  {
    title: 'Before & After Counter Organizer Multi-Compartment Soap Box',
    description:
      'Transform your cluttered bathroom counter into a clean, dry sanctuary. Rapid drainage slots prevent dirty standing water accumulation. Detachable tray for quick cleaning.',
    price: 299,
    originalPrice: 499,
    category: 'Home Organizers',
    brand: 'Trending Dart',
    stock: 65,
    badge: 'HOT DEAL',
    rating: 4.7,
    reviewCount: 84,
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80',
    ],
    isFeatured: true,
  },
  {
    title: 'Self-Adhesive Wall-Mounted Soap Organizer (No Drilling Kit)',
    description:
      'Damage-free installation guide included. High-strength adhesive wall pads mount safely without drilling tiles or wall damage. Supports up to 5kg weight with ease.',
    price: 279,
    originalPrice: 449,
    category: 'Smart Utility',
    brand: 'Trending Dart',
    stock: 120,
    badge: 'EASY SETUP',
    rating: 4.9,
    reviewCount: 125,
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80',
    ],
    isFeatured: true,
  },
  {
    title: '360° Rotating Faucet Extender & Kitchen Aerator',
    description:
      'Universal swivel splash filter faucet with dual outlet modes: gentle bubble stream and high pressure spray. Fits 99% standard faucets effortlessly.',
    price: 449,
    originalPrice: 799,
    category: 'Kitchen Gadgets',
    brand: 'Trending Dart',
    stock: 45,
    badge: 'VIRAL PRODUCT',
    rating: 5.0,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80',
    ],
    isFeatured: true,
  },
  {
    title: 'Automatic Toothpaste Dispenser & Toothbrush Sanitizer Holder',
    description:
      'Hands-free squeeze pump gives the perfect amount of toothpaste every time. Dust-proof hanging slots keep toothbrushes clean and dry.',
    price: 499,
    originalPrice: 899,
    category: 'Bathroom Essentials',
    brand: 'Trending Dart',
    stock: 38,
    badge: 'MUST HAVE',
    rating: 4.8,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1559591937-e62fb330bc1f?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1559591937-e62fb330bc1f?w=800&q=80',
    ],
    isFeatured: false,
  },
];

const initialCoupons = [
  {
    code: 'TRENDING10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 499,
    maxDiscount: 150,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    usageLimit: 500,
    isActive: true,
  },
  {
    code: 'SAVE50',
    discountType: 'fixed',
    discountValue: 50,
    minPurchase: 299,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    usageLimit: 200,
    isActive: true,
  },
  {
    code: 'FIRSTORDER',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 399,
    maxDiscount: 200,
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    usageLimit: 1000,
    isActive: true,
  },
];

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting Trending Dart database seed...');

    // 1. Seed or update Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'trendingdart@gmail.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'trendingdart@321';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Trending Dart Admin',
        email: adminEmail,
        password: adminPassword,
        phone: '82708 82715',
        role: 'ADMIN',
      });
      console.log(`✅ Default Admin user created: ${adminEmail}`);
    } else {
      admin.role = 'ADMIN';
      admin.password = adminPassword; // Triggers pre('save') hash
      await admin.save();
      console.log(`ℹ️ Admin user verified and password updated: ${adminEmail}`);
    }

    // 2. Seed Categories
    for (const cat of initialCategories) {
      await Category.findOneAndUpdate({ name: cat.name }, cat, { upsert: true, new: true });
    }
    console.log('✅ Categories seeded');

    // 3. Seed Products
    for (const prod of initialProducts) {
      await Product.findOneAndUpdate({ title: prod.title }, prod, { upsert: true, new: true });
    }
    console.log('✅ Products seeded');

    // 4. Seed Coupons
    for (const coup of initialCoupons) {
      await Coupon.findOneAndUpdate({ code: coup.code }, coup, { upsert: true, new: true });
    }
    console.log('✅ Coupons seeded');

    // 5. Seed Website Settings
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      await WebsiteSettings.create({
        websiteName: 'TRENDING DART',
        tagline: "Discover What's Trending",
        logoUrl: '/logo.png',
        contactPhone: '82708 82715',
        contactEmail: 'trendingdart@gmail.com',
        address: 'Trending Dart HQ, Coimbatore, Tamil Nadu, India',
        socialLinks: {
          instagram: 'https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA==',
          facebook: 'https://facebook.com/trendingdart',
          whatsapp: 'https://wa.me/918270882715',
        },
        deliveryFee: 49,
        freeDeliveryThreshold: 499,
        homeBanners: [
          {
            title: 'Keep Your Bathroom Neat, Dry & Organized',
            subtitle: 'Dust-proof flip lids, dual drainage trays & heavy duty no-drill wall mount',
            badge: 'SMART UTILITY 2026',
            image: '/hero-soap-holder.jpg',
            link: '/#catalog',
          },
        ],
      });
      console.log('✅ Website settings initialized');
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};

// Run directly if invoked from command line
if (process.argv[1]?.endsWith('seedData.js')) {
  seedDatabase().then(() => process.exit(0));
}

