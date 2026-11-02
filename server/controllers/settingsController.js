import WebsiteSettings from '../models/WebsiteSettings.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create({
        websiteName: 'TRENDING DART',
        tagline: "Discover What's Trending",
        logoUrl: '/logo.png',
        contactPhone: '82708 82715',
        contactEmail: 'trendingdart@gmail.com',
        socialLinks: {
          instagram: 'https://www.instagram.com/trending_dart?xtok=MWFsZzJhbHhhcTdoNA==',
          facebook: 'https://facebook.com/trendingdart',
          whatsapp: 'https://wa.me/918270882715',
        },
        deliveryFee: 49,
        freeDeliveryThreshold: 499,
      });
    }
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
