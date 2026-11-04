import Razorpay from 'razorpay';
import crypto from 'crypto';

// Get Public Razorpay Key ID
export const getRazorpayKey = async (req, res) => {
  try {
    const keyId =
      process.env.RAZORPAY_KEY_ID ||
      process.env.VITE_RAZORPAY_KEY_ID ||
      '';
    return res.status(200).json({
      success: true,
      keyId,
      isConfigured: Boolean(keyId && !keyId.includes('placeholder')),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, receipt = '', notes = {} } = req.body;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required.' });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    // If real Razorpay keys are set in environment
    if (keyId && keySecret && !keyId.includes('placeholder') && !keySecret.includes('placeholder')) {
      const razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        notes,
      };

      const razorpayOrder = await razorpayInstance.orders.create(options);

      return res.status(200).json({
        success: true,
        order: razorpayOrder,
        keyId,
        isMock: false,
      });
    }

    // Fallback Mock Order for development/testing if API keys are yet to be updated in .env
    const mockOrder = {
      id: `order_mock_${Date.now()}`,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes,
      created_at: Math.floor(Date.now() / 1000),
    };

    return res.status(200).json({
      success: true,
      order: mockOrder,
      keyId: keyId || 'rzp_test_placeholder',
      isMock: true,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return res.status(500).json({
      success: false,
      message: error?.error?.description || error.message || 'Failed to create Razorpay order.',
    });
  }
};

// Verify Razorpay Payment Signature
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and Payment ID are required.',
      });
    }

    // In mock mode without secret
    if (!keySecret || keySecret.includes('placeholder')) {
      return res.status(200).json({
        success: true,
        verified: true,
        message: 'Mock payment verified successfully.',
      });
    }

    if (!razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Signature is required for verification.',
      });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Invalid payment signature.',
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      message: 'Payment signature verified successfully.',
    });
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
