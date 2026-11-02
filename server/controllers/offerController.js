import Offer from '../models/Offer.js';

export const getActiveOffers = async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      $or: [{ startDate: { $lte: now } }, { startDate: null }],
      $or: [{ endDate: { $gte: now } }, { endDate: null }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, offers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOffersAdmin = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, offers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    return res.status(201).json({ success: true, message: 'Offer created', offer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    return res.status(200).json({ success: true, message: 'Offer updated', offer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    return res.status(200).json({ success: true, message: 'Offer deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
