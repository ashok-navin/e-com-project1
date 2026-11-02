import WebsiteSettings from '../models/WebsiteSettings.js';
import mongoose from 'mongoose';

const DEFAULT_SETTINGS = {
  websiteName: 'TRENDING DART',
  tagline: "Discover What's Trending",
  logoUrl: '/logo.png',
  contactPhone: '82708 82715',
  contactEmail: 'admin@trendingdart.com',
  socialLinks: {
    instagram: 'https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA==',
    facebook: 'https://facebook.com/trendingdart',
    whatsapp: 'https://wa.me/918270882715',
  },
  deliveryFee: 49,
  freeDeliveryThreshold: 499,
};

export const getSettings = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let settings = await WebsiteSettings.findOne();
      if (settings) {
        return res.status(200).json({ success: true, settings });
      }
    }
    return res.status(200).json({ success: true, settings: DEFAULT_SETTINGS });
  } catch (error) {
    console.warn('getSettings fallback activated:', error.message);
    return res.status(200).json({ success: true, settings: DEFAULT_SETTINGS });
  }
};

export const updateSettingsAdmin = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = new WebsiteSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    return res.status(200).json({
      success: true,
      message: 'Website settings updated successfully!',
      settings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
