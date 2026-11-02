import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      totalProducts,
      orders,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments({ role: 'USER' }),
      Product.countDocuments(),
      Order.find().select('totalAmount orderStatus items createdAt paymentStatus'),
      Order.find().sort({ createdAt: -1 }).limit(6),
    ]);

    let totalSales = 0;
    const statusCounts = {
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      'OUT FOR DELIVERY': 0,
      DELIVERED: 0,
      CANCELLED: 0,
      'RETURN REQUESTED': 0,
      RETURNED: 0,
    };

    orders.forEach((ord) => {
      if (ord.orderStatus !== 'CANCELLED') {
        totalSales += ord.totalAmount || 0;
      }
      if (statusCounts[ord.orderStatus] !== undefined) {
        statusCounts[ord.orderStatus] += 1;
      }
    });

    // Monthly sales aggregation for chart
    const monthlyStats = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalSales: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    // Top selling products aggregation
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.title',
          image: { $first: '$items.image' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalSales,
        totalOrders: orders.length,
        totalCustomers,
        totalProducts,
        statusCounts,
        monthlyStats,
        topProducts,
        recentOrders,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
