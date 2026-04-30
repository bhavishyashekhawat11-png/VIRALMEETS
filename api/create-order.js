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

    // 3. Get info from request body
    const { planType, currency = "INR" } = req.body;
    console.log("Plan Type Received:", planType);

    if (!planType) {
      return res.status(400).json({ error: 'planType is required' });
    }

    // 4. Calculate amount based on planType (Monthly: 299, Yearly: 1999)
    let amountInPaise = 0;
    if (planType === 'monthly') {
      amountInPaise = 299 * 100;
    } else if (planType === 'yearly') {
      amountInPaise = 1999 * 100;
    } else {
      return res.status(400).json({ error: `Invalid plan type: ${planType}` });
    }

    // Ensure it's an integer
    const finalAmount = Math.round(amountInPaise);

    // 5. Create the order options
    const options = {
      amount: finalAmount,
      currency: currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    // 6. Generate the order
    const order = await razorpay.orders.create(options);

    // 7. Send success response back to your React frontend
    return res.status(200).json(order);

  } catch (error) {
    // This logs the real error to your Vercel Dashboard
    console.error("RAZORPAY ERROR:", error);

    // This ensures your frontend stays stable and gets a JSON error
    return res.status(500).json({ 
      error: error.description || error.message || "Failed to create Razorpay order"
    });
  }
}