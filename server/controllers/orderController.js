import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import WebsiteSettings from '../models/WebsiteSettings.js';
import User from '../models/User.js';
import {
  sendOrderConfirmationEmail,
  sendAdminNewOrderEmail,
  sendOrderStatusUpdateEmail,
} from '../services/emailService.js';

// Helper to generate Unique Order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TD-${timestamp}-${random}`;
};

// 1. Create New Order (Checkout)
export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      shippingAddress,
      items,
      paymentMethod = 'COD',
      couponCode,
    } = req.body;

    // Validation
    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email, and phone number are required.',
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pinCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required.',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Shopping cart is empty. Please select products to order.',
      });
    }

    // Verify stock and calculate subtotal securely on server
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const rawId = item.productId || item.id || item._id;
      let product = null;

      if (rawId && mongoose.isValidObjectId(rawId)) {
        try {
          product = await Product.findById(rawId);
        } catch (e) {
          product = null;
        }
      }

      if (!product && item.title) {
        try {
          product = await Product.findOne({ title: item.title });
        } catch (e) {
          product = null;
        }
      }

      const qty = Math.max(1, parseInt(item.quantity || item.qty || 1, 10));
      const price = product?.price || Number(item.price) || 349;
      const title = product?.title || item.title || 'Trending Dart Product';
      const image = product?.image || item.image || '/hero-soap-holder.jpg';

      if (product && product.stock !== undefined && product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Only ${product.stock} available.`,
        });
      }

      const itemTotal = price * qty;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        product: product?._id || rawId || 'item-td-01',
        title,
        image,
        price,
        quantity: qty,
        variant: item.variant || '',
      });
    }

    // Get delivery fee settings
    const settings = await WebsiteSettings.findOne();
    const freeThreshold = settings?.freeDeliveryThreshold || 499;
    const standardDeliveryFee = settings?.deliveryFee || 49;
    const deliveryCharge = calculatedSubtotal >= freeThreshold ? 0 : standardDeliveryFee;

    // Validate Coupon if supplied
    let couponDiscount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      appliedCoupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
      });

      if (appliedCoupon) {
        const validity = appliedCoupon.isValid(calculatedSubtotal);
        if (validity.valid) {
          if (appliedCoupon.discountType === 'percentage') {
            couponDiscount = Math.round(
              (calculatedSubtotal * appliedCoupon.discountValue) / 100
            );
            if (
              appliedCoupon.maxDiscount &&
              couponDiscount > appliedCoupon.maxDiscount
            ) {
              couponDiscount = appliedCoupon.maxDiscount;
            }
          } else {
            couponDiscount = appliedCoupon.discountValue;
          }
          // Increment coupon usage count
          appliedCoupon.usageCount += 1;
          await appliedCoupon.save();
        }
      }
    }

    const finalAmount = Math.max(
      0,
      calculatedSubtotal - couponDiscount + deliveryCharge
    );

    // Safely decrement inventory stock
    for (const item of validatedItems) {
      if (item.product && mongoose.isValidObjectId(item.product)) {
        try {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        } catch (e) {}
      }
    }

    const orderId = generateOrderId();
    const initialStatus = 'CONFIRMED'; // For COD or initial placement

    // Ensure logged-in user's registered email is ALWAYS used for order records and notifications
    const registeredEmail = req.user?.email ? req.user.email.toLowerCase().trim() : '';
    const finalCustomerEmail = registeredEmail || customer.email.toLowerCase().trim();

    const newOrder = await Order.create({
      orderId,
      user: req.user ? req.user._id : null,
      customer: {
        name: customer.name.trim(),
        email: finalCustomerEmail,
        phone: customer.phone.trim(),
      },
      shippingAddress: {
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pinCode: shippingAddress.pinCode.trim(),
        instructions: shippingAddress.instructions || '',
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount: 0,
      couponDiscount,
      couponCode: couponCode ? couponCode.trim().toUpperCase() : '',
      deliveryCharge,
      totalAmount: finalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: initialStatus,
      statusTimeline: [
        {
          status: initialStatus,
          note: 'Order placed successfully and confirmed.',
          updatedAt: new Date(),
        },
      ],
      tracking: {
        carrier: 'Standard Express',
        trackingNumber: `TDTRK${Date.now().toString().slice(-8)}`,
        estimatedDelivery: '3 - 5 Business Days',
      },
    });

    // Save or update address in user's profile for future orders
    let updatedAddresses = [];
    if (req.user) {
      try {
        const userToUpdate = await User.findById(req.user._id);
        if (userToUpdate) {
          const addressToSave = {
            fullName: customer.name.trim(),
            phone: customer.phone.trim(),
            street: shippingAddress.street.trim(),
            city: shippingAddress.city.trim(),
            state: shippingAddress.state.trim(),
            pinCode: shippingAddress.pinCode.trim(),
            isDefault: true,
          };

          if (!userToUpdate.phone && customer.phone) {
            userToUpdate.phone = customer.phone.trim();
          }

          if (!userToUpdate.addresses) {
            userToUpdate.addresses = [];
          }

          userToUpdate.addresses.forEach((a) => {
            a.isDefault = false;
          });

          const existingIndex = userToUpdate.addresses.findIndex(
            (a) =>
              a.street?.toLowerCase().trim() === addressToSave.street.toLowerCase().trim() &&
              a.pinCode?.trim() === addressToSave.pinCode.trim()
          );

          if (existingIndex !== -1) {
            userToUpdate.addresses[existingIndex].fullName = addressToSave.fullName;
            userToUpdate.addresses[existingIndex].phone = addressToSave.phone;
            userToUpdate.addresses[existingIndex].city = addressToSave.city;
            userToUpdate.addresses[existingIndex].state = addressToSave.state;
            userToUpdate.addresses[existingIndex].isDefault = true;
          } else {
            userToUpdate.addresses.unshift(addressToSave);
          }

          await userToUpdate.save();
          updatedAddresses = userToUpdate.addresses;
        }
      } catch (addrErr) {
        console.error('Failed to auto-save address to user profile:', addrErr);
      }
    }

    // Send notifications asynchronously: confirmation email ALWAYS to logged-in user's registered email
    sendOrderConfirmationEmail(newOrder, finalCustomerEmail).catch((err) =>
      console.error('Customer confirmation email failed:', err)
    );
    sendAdminNewOrderEmail(newOrder).catch((err) =>
      console.error('Admin order alert failed:', err)
    );

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder,
      savedAddresses: updatedAddresses,
    });
  } catch (error) {
    console.error('createOrder error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get My Orders (Logged In Customer)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ user: req.user._id }, { 'customer.email': req.user.email }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Single Order by Order ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = id && mongoose.isValidObjectId(id);
    const order = await Order.findOne(
      isObjectId ? { $or: [{ orderId: id }, { _id: id }] } : { orderId: id }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Access control: If user is logged in and not admin, must be their own order
    if (req.user && req.user.role !== 'ADMIN') {
      const isOwner =
        (order.user && order.user.toString() === req.user._id.toString()) ||
        order.customer.email.toLowerCase() === req.user.email.toLowerCase();
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view this order.',
        });
      }
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Public Order Tracking (by Order ID & optional Phone/Email)
export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).select(
      'orderId orderStatus statusTimeline tracking customer.name items createdAt totalAmount paymentMethod'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No order found with this Order ID.',
      });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Get All Orders (Admin Only)
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [orders, totalOrders] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Update Order Status (Admin Only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, carrier, trackingNumber, estimatedDelivery } = req.body;

    const allowedStatuses = [
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'OUT FOR DELIVERY',
      'DELIVERED',
      'CANCELLED',
      'RETURN REQUESTED',
      'RETURNED',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const previousStatus = order.orderStatus;
    const isStatusChanged = previousStatus !== status;

    order.orderStatus = status;

    // Update tracking info if provided
    if (carrier) order.tracking.carrier = carrier;
    if (trackingNumber) order.tracking.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.tracking.estimatedDelivery = estimatedDelivery;

    // If order is delivered, update payment status for COD
    if (status === 'DELIVERED' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'PAID';
    }

    // If status changed to CANCELLED and was not already cancelled, restore inventory
    if (status === 'CANCELLED' && previousStatus !== 'CANCELLED') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    // Append to timeline only if status changed or note given
    if (isStatusChanged || note) {
      order.statusTimeline.push({
        status,
        note: note || `Order status updated to ${status}.`,
        updatedAt: new Date(),
      });
    }

    await order.save();

    // Trigger automatic email if status actually changed
    if (isStatusChanged) {
      sendOrderStatusUpdateEmail(order, previousStatus).catch((err) =>
        console.error('Status update email failed:', err)
      );
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}.`,
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
