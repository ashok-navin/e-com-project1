import Coupon from '../models/Coupon.js';

export const validateCoupon = async (req, res) => {
  try {
    const { code, cartAmount } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code.' });
    }

    const validity = coupon.isValid(cartAmount || 0);
    if (!validity.valid) {
      return res.status(400).json({ success: false, message: validity.message });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round(((cartAmount || 0) * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon applied successfully!',
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        calculatedDiscount: discount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCouponsAdmin = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, coupons });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    return res.status(201).json({ success: true, message: 'Coupon created successfully', coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    return res.status(200).json({ success: true, message: 'Coupon updated', coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    return res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
