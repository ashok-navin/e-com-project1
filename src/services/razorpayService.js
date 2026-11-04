import api from './api';

// Ensure Razorpay SDK script is loaded in window
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initiate Razorpay Payment Flow
 * @param {Object} options
 * @param {number} options.amount - In INR
 * @param {Object} options.customer - { name, email, phone }
 * @param {Function} options.onSuccess - Callback on verified payment { razorpayPaymentId, razorpayOrderId, razorpaySignature }
 * @param {Function} options.onError - Callback on error
 * @param {Function} options.onDismiss - Callback when user closes payment modal
 */
export const initiateRazorpayPayment = async ({
  amount,
  customer,
  notes = {},
  onSuccess,
  onError,
  onDismiss,
}) => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
    }

    // 1. Create order on backend
    const res = await api.post('/payment/razorpay-order', {
      amount,
      notes,
    });

    if (!res.data?.success || !res.data.order) {
      throw new Error(res.data?.message || 'Unable to initialize Razorpay order.');
    }

    const { order, keyId, isMock } = res.data;

    // 2. If real key configured, open standard Razorpay Checkout
    if (!isMock && keyId && !keyId.includes('placeholder')) {
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'TRENDING DART',
        description: 'Instant Order Payment',
        image: '/logo.png',
        order_id: order.id,
        prefill: {
          name: customer?.name || '',
          email: customer?.email || '',
          contact: customer?.phone || '',
        },
        theme: {
          color: '#F97316', // Trending Dart signature orange
        },
        handler: function (response) {
          onSuccess({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            isMock: false,
          });
        },
        modal: {
          ondismiss: function () {
            if (onDismiss) onDismiss();
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (errRes) {
        if (onError) {
          onError(errRes.error?.description || 'Payment failed or was cancelled.');
        }
      });
      rzpInstance.open();
      return;
    }

    // 3. Fallback mock payment for development when API keys are not yet configured in .env
    console.info('Using Razorpay mock workflow. Set RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in .env for live payments.');
    onSuccess({
      razorpayPaymentId: `pay_mock_${Date.now()}`,
      razorpayOrderId: order.id,
      razorpaySignature: 'mock_signature_approved',
      isMock: true,
    });
  } catch (err) {
    console.error('Razorpay process failed:', err);
    if (onError) {
      onError(err.response?.data?.message || err.message || 'Payment processing failed.');
    }
  }
};
