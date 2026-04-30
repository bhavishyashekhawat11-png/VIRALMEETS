import Razorpay from 'razorpay';

// This is your Serverless Function handler for Vercel
export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Initialize Razorpay with your Environment Variables
    // Make sure these names match exactly what you put in Vercel Settings
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 3. Get the amount from the frontend request
    const { amount, currency = "INR" } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // 4. Create the order options
    const options = {
      amount: amount * 100, // Razorpay expects subunits (e.g., 100 paise = 1 INR)
      currency: currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    // 5. Generate the order
    const order = await razorpay.orders.create(options);

    // 6. Send success response back to your React frontend
    return res.status(200).json(order);

  } catch (error) {
    // This logs the real error to your Vercel Dashboard
    console.error("RAZORPAY ERROR:", error);

    // This ensures your frontend stays stable and gets a JSON error
    return res.status(500).json({ 
      error: "Failed to create Razorpay order",
      details: error.message 
    });
  }
}