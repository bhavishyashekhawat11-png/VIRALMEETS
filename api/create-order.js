const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  // 1. Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Please use POST method to create an order.'
    });
  }

  // 2. Fail-safe Configuration Check
  const keyId = process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('CRITICAL: Razorpay API Keys are missing in environment variables.');
    return res.status(400).json({ 
      error: 'Missing API Keys',
      message: 'The server is not configured with Razorpay credentials. Please check environment variables.'
    });
  }

  try {
    // 3. Robust Body Validation
    const body = req.body || {};
    const { planType } = body;
    
    if (!planType) {
      return res.status(400).json({ 
        error: 'Invalid Request',
        message: 'planType is required in the request body (monthly or yearly).' 
      });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amount = planType === 'monthly' ? 29900 : planType === 'yearly' ? 199900 : 0;

    if (amount === 0) {
      return res.status(400).json({ 
        error: 'Invalid Plan',
        message: `Plan type "${planType}" is not recognized. use "monthly" or "yearly".` 
      });
    }

    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return res.status(500).json({ 
      error: 'Order creation failed', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
