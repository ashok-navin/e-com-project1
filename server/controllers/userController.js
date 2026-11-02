import User from '../models/User.js';
import Order from '../models/Order.js';

export const getAllUsersAdmin = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: 'USER' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      users,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserDetailsAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Customer not found' });

    const orders = await Order.find({
      $or: [{ user: user._id }, { 'customer.email': user.email }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, user, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleUserStatusAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Customer not found' });

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      user: { id: user._id, isActive: user.isActive },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
