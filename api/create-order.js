const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  // 1. Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { planType } = req.body;
    
    if (!planType) {
      return res.status(400).json({ error: 'planType is required' });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.VITE_RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    const amount = planType === 'monthly' ? 29900 : planType === 'yearly' ? 199900 : 0;

    if (amount === 0) {
      return res.status(400).json({ error: 'Invalid planType' });
    }

    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ 
      error: 'Order creation failed', 
      details: error.message 
    });
  }
};
