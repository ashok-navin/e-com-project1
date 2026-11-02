import nodemailer from 'nodemailer';

// Helper to get transporter
const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '465', 10),
    secure: process.env.EMAIL_PORT === '465' || !process.env.EMAIL_PORT, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const BRAND_NAME = 'TRENDING DART';
const BRAND_EMAIL = process.env.EMAIL_USER || 'trendingdart@gmail.com';
const BRAND_PHONE = '82708 82715';
const BRAND_COLOR = '#FF6B00';
const LOGO_URL = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/logo.png` : 'https://raw.githubusercontent.com/trendingdart/assets/main/logo.png';

// Common Email Layout Wrapper
const emailWrapper = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: #0f172a; padding: 28px 24px; text-align: center; border-bottom: 3px solid ${BRAND_COLOR}; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: 1px; }
    .header span { color: ${BRAND_COLOR}; }
    .tagline { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
    .body { padding: 32px 24px; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; background: #fff7ed; color: ${BRAND_COLOR}; border: 1px solid #ffedd5; margin-bottom: 16px; }
    .order-summary { width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 12px; overflow: hidden; }
    .order-summary th { background: #f1f5f9; padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; color: #475569; }
    .order-summary td { padding: 12px 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #334155; }
    .total-row { font-weight: bold; background: #f8fafc; font-size: 15px; color: #0f172a; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
    .footer a { color: ${BRAND_COLOR}; text-decoration: none; font-weight: 600; }
    .button { display: inline-block; background: ${BRAND_COLOR}; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 18px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TRENDING <span>DART</span></h1>
      <div class="tagline">Discover What's Trending</div>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>Have questions? Call or WhatsApp us at <strong>${BRAND_PHONE}</strong></p>
      <p>Email: <a href="mailto:${BRAND_EMAIL}">${BRAND_EMAIL}</a></p>
      <p>© ${new Date().getFullYear()} Trending Dart. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// 1. Send OTP for Password Reset
export const sendPasswordResetEmail = async (email, otp) => {
  const transporter = getTransporter();
  const subject = `Password Reset OTP - ${BRAND_NAME}`;
  const html = emailWrapper(
    'Reset Your Password',
    `
    <div class="badge">SECURITY VERIFICATION</div>
    <h2 style="margin: 0 0 12px; font-size: 20px; color: #0f172a;">Password Reset Request</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      We received a request to reset your password for your <strong>${BRAND_NAME}</strong> account.
      Use the 6-digit verification code below to proceed:
    </p>
    <div style="background: #0f172a; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
      <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: ${BRAND_COLOR}; font-family: monospace;">${otp}</span>
    </div>
    <p style="color: #64748b; font-size: 13px;">
      ⏳ This OTP is valid for <strong>5 minutes</strong>. If you did not request this password reset, please ignore this email or contact support immediately.
    </p>
    `
  );

  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Password Reset OTP for ${email}: ${otp}`);
    return { simulated: true, otp };
  }

  return await transporter.sendMail({
    from: `"${BRAND_NAME}" <${BRAND_EMAIL}>`,
    to: email,
    subject,
    html,
  });
};

// 2. Order Confirmation Email to Customer
export const sendOrderConfirmationEmail = async (order) => {
  const transporter = getTransporter();
  const subject = `Your Order Has Been Confirmed! - #${order.orderId}`;

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td><strong>${item.title}</strong>${item.variant ? ` (${item.variant})` : ''}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `
    )
    .join('');

  const html = emailWrapper(
    'Order Confirmed',
    `
    <div class="badge">ORDER CONFIRMED</div>
    <h2 style="margin: 0 0 10px; font-size: 20px; color: #0f172a;">Thank You for Your Order, ${order.customer.name}!</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      Your order <strong>#${order.orderId}</strong> has been confirmed and is being prepped for dispatch.
    </p>

    <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border-radius: 10px; border-left: 4px solid ${BRAND_COLOR};">
      <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Delivery Address:</div>
      <div style="font-size: 14px; font-weight: 600; color: #1e293b;">
        ${order.customer.name} | ${order.customer.phone}<br/>
        ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pinCode}
      </div>
      <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
        Payment: <strong>${order.paymentMethod}</strong> (${order.paymentStatus})
      </div>
    </div>

    <table class="order-summary">
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr>
          <td colspan="2">Subtotal</td>
          <td style="text-align: right;">₹${order.subtotal}</td>
        </tr>
        ${
          order.couponDiscount > 0
            ? `<tr><td colspan="2" style="color: #16a34a;">Coupon Discount (${order.couponCode})</td><td style="text-align: right; color: #16a34a;">-₹${order.couponDiscount}</td></tr>`
            : ''
        }
        <tr>
          <td colspan="2">Delivery Fee</td>
          <td style="text-align: right;">${order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2">Final Amount</td>
          <td style="text-align: right; color: ${BRAND_COLOR};">₹${order.totalAmount}</td>
        </tr>
      </tbody>
    </table>

    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || ''}/orders/${order.orderId}" class="button">Track Your Order</a>
    </div>
    `
  );

  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Order Confirmation Email sent to ${order.customer.email} for #${order.orderId}`);
    return { simulated: true };
  }

  return await transporter.sendMail({
    from: `"${BRAND_NAME}" <${BRAND_EMAIL}>`,
    to: order.customer.email,
    subject,
    html,
  });
};

// 3. New Order Notification to Admin
export const sendAdminNewOrderEmail = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return;

  const transporter = getTransporter();
  const subject = `🚨 New Order Alert: #${order.orderId} - ₹${order.totalAmount}`;
  const html = emailWrapper(
    'New Order Received',
    `
    <div class="badge" style="background: #eff6ff; color: #2563eb; border-color: #dbeafe;">ADMIN NOTIFICATION</div>
    <h2 style="margin: 0 0 10px; font-size: 20px; color: #0f172a;">New Order #${order.orderId} Received</h2>
    <p style="color: #475569; font-size: 14px;">
      Customer <strong>${order.customer.name}</strong> (${order.customer.phone}, ${order.customer.email}) placed an order for <strong>₹${order.totalAmount}</strong> via <strong>${order.paymentMethod}</strong>.
    </p>
    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0; font-size: 13px;">
      <strong>Items:</strong> ${order.items.map((i) => `${i.title} (x${i.quantity})`).join(', ')}<br/>
      <strong>Destination:</strong> ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pinCode}
    </div>
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || ''}/admin/orders" class="button">Open Admin Dashboard</a>
    </div>
    `
  );

  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Admin alert for Order #${order.orderId}`);
    return { simulated: true };
  }

  return await transporter.sendMail({
    from: `"${BRAND_NAME} System" <${BRAND_EMAIL}>`,
    to: adminEmail,
    subject,
    html,
  });
};

// 4. Order Status Update Email (Processing, Shipped, Out for Delivery, Delivered, Cancelled)
export const sendOrderStatusUpdateEmail = async (order, previousStatus) => {
  const transporter = getTransporter();
  const status = order.orderStatus;

  let subject = `Order #${order.orderId} Status Update: ${status}`;
  let headline = `Your Order Status Has Been Updated`;
  let message = `Your order #${order.orderId} is currently marked as <strong>${status}</strong>.`;
  let extraInfo = '';

  switch (status) {
    case 'PROCESSING':
      subject = `Your Order #${order.orderId} is Being Processed!`;
      headline = 'We Are Packing Your Order';
      message = 'Your items are being carefully inspected and securely packed by our warehouse team.';
      break;

    case 'SHIPPED':
      subject = `Your Order #${order.orderId} Has Been Shipped! 🚀`;
      headline = 'Your Package is On Its Way';
      message = 'Your package has been handed over to our courier partner and is en route.';
      if (order.tracking && order.tracking.trackingNumber) {
        extraInfo = `
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0; font-size: 13px;">
            <strong>Courier Partner:</strong> ${order.tracking.carrier || 'Express Courier'}<br/>
            <strong>Tracking AWB Number:</strong> <span style="font-family: monospace; font-weight: bold; color: ${BRAND_COLOR};">${order.tracking.trackingNumber}</span><br/>
            ${order.tracking.estimatedDelivery ? `<strong>Estimated Delivery:</strong> ${order.tracking.estimatedDelivery}` : ''}
          </div>
        `;
      }
      break;

    case 'OUT FOR DELIVERY':
      subject = `Out for Delivery: Order #${order.orderId} Will Arrive Today! 📦`;
      headline = 'Your Package is Out for Delivery Today';
      message = 'Our delivery executive is in your area and will attempt delivery today. Please keep your phone reachable.';
      break;

    case 'DELIVERED':
      subject = `Delivered: Your Order #${order.orderId} Has Arrived! 🎉`;
      headline = 'Order Successfully Delivered';
      message = 'Your package has been delivered! We hope you love your trending products. Thank you for shopping with Trending Dart!';
      break;

    case 'CANCELLED':
      subject = `Important: Order #${order.orderId} Has Been Cancelled`;
      headline = 'Order Cancelled';
      message = 'Your order has been cancelled. If any online payment was deducted, your refund will be processed back to the original source within 3-5 business days.';
      break;

    default:
      break;
  }

  const html = emailWrapper(
    headline,
    `
    <div class="badge">${status}</div>
    <h2 style="margin: 0 0 10px; font-size: 20px; color: #0f172a;">${headline}</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      Dear ${order.customer.name},<br/><br/>
      ${message}
    </p>
    ${extraInfo}
    <div style="text-align: center; margin-top: 24px;">
      <a href="${process.env.CLIENT_URL || ''}/orders/${order.orderId}" class="button">Track Live Status</a>
    </div>
    `
  );

  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Status email [${status}] sent to ${order.customer.email} for #${order.orderId}`);
    return { simulated: true };
  }

  return await transporter.sendMail({
    from: `"${BRAND_NAME}" <${BRAND_EMAIL}>`,
    to: order.customer.email,
    subject,
    html,
  });
};
