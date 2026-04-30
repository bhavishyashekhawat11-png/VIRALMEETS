import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import Razorpay from "razorpay";
import crypto from "crypto";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: "gen-lang-client-0052971302",
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

const db = admin.firestore();

// Razorpay helper for lazy initialization
const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });
};

const PLAN_IDS: Record<string, string> = {
  monthly: process.env.RAZORPAY_PLAN_MONTHLY || "",
  yearly: process.env.RAZORPAY_PLAN_YEARLY || "",
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Serve static files from the /public directory as top priority (Fixed: priority routing)
  app.use(express.static(path.join(__dirname, "public"), {
    etag: false,
    acceptRanges: false,
    setHeaders: (res, filePath) => {
      // Explicitly disable range support in headers
      res.setHeader('Accept-Ranges', 'none');
      // Ensure specific file types (like png) are never cached or served as partials
      if (filePath.endsWith('.png')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    }
  }));

  // Enable CORS for all requests, including static assets
  app.use(cors());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Create Order Endpoint
  app.post("/api/create-order", express.json(), async (req, res) => {
    try {
      const { planType } = req.body;
      
      if (!planType) {
        return res.status(400).json({ 
          error: "Invalid Request",
          message: "planType is required in the request body (monthly or yearly)." 
        });
      }

      // Fail-safe Configuration Check
      const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keyId || !keySecret) {
        console.error('CRITICAL: Razorpay API Keys are missing in environment variables.');
        return res.status(400).json({ 
          error: 'Missing API Keys',
          message: 'The server is not configured with Razorpay credentials. Please check environment variables.'
        });
      }

      // Initialize Razorpay lazily
      const rzp = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const amountInPaise = planType === "monthly" ? 299 * 100 : planType === "yearly" ? 1999 * 100 : 0;
      const amount = Math.round(amountInPaise);

      if (amount === 0) {
        return res.status(400).json({ 
          error: "Invalid Plan",
          message: `Plan type "${planType}" is not recognized. Use "monthly" or "yearly".` 
        });
      }

      const options = {
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await rzp.orders.create(options);
      res.json(order);
    } catch (error: any) {
      console.error("Create Order Error:", error);
      res.status(500).json({ 
        error: error.description || error.message || "Order creation failed"
      });
    }
  });

  // Verify Payment Endpoint
  app.post("/api/verify-payment", express.json(), async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planType } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Use a fresh Hmac instance with secret
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Signature verified
      try {
        if (userId) {
          await db.collection("users").doc(userId).set({
            plan: "PRO",
            userPlan: "PRO",
            lastPaymentId: razorpay_payment_id,
            lastOrderId: razorpay_order_id,
            planType,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          console.log(`User ${userId} upgraded to PRO via order verification`);
        }
        res.json({ status: "ok" });
      } catch (error) {
        console.error("Error updating user after payment verification:", error);
        res.status(500).json({ error: "Failed to update user status" });
      }
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  });

  // Create Subscription Endpoint
  app.post("/api/create-subscription", express.json(), async (req, res) => {
    const { planType, userEmail, userId } = req.body;

    if (!planType || !PLAN_IDS[planType]) {
      return res.status(400).json({ 
        error: `Invalid plan type or missing Razorpay Plan ID for ${planType}. Please check your environment variables.` 
      });
    }

    try {
      console.log("Attempting to create subscription for plan:", PLAN_IDS[planType]);
      
      const rzp = getRazorpay();
      const subscription = await rzp.subscriptions.create({
        plan_id: PLAN_IDS[planType],
        customer_notify: true, // Use boolean instead of number
        total_count: planType === 'yearly' ? 12 : 60,
        quantity: 1, // Explicitly set quantity
        notes: {
          userId: userId || "unknown",
          userEmail: userEmail || "unknown",
          planType
        }
      });

      console.log("Subscription created successfully:", subscription.id);

      res.json({
        subscriptionId: subscription.id,
      });
    } catch (error: any) {
      // Detailed error logging
      console.error("Error creating subscription detail:", JSON.stringify(error, null, 2));
      
      // Extract the most helpful error message from Razorpay's response
      const razorpayError = error.error || {};
      const description = razorpayError.description || error.message || "Failed to create subscription";
      const field = razorpayError.field ? ` (Field: ${razorpayError.field})` : "";
      
      console.error(`Razorpay Error: ${description}${field}`);
      
      res.status(500).json({ 
        error: description + field,
        code: razorpayError.code || 'SUBSCRIPTION_CREATE_FAILED'
      });
    }
  });

  // Razorpay Webhook Endpoint
  app.post("/api/razorpay-webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    const signature = req.headers["x-razorpay-signature"] as string;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid Webhook Signature");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());
    const payload = event.payload;

    console.log("Razorpay Webhook Event:", event.event);

    try {
      if (event.event === "subscription.charged") {
        const subscription = payload.subscription.entity;
        const userId = subscription.notes?.userId;

        if (userId) {
          await db.collection("users").doc(userId).set({
            plan: "PRO",
            userPlan: "PRO",
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            lastPaymentId: payload.payment.entity.id,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          console.log(`User ${userId} upgraded to PRO via membership charge`);
        }
      } else if (event.event === "subscription.cancelled" || event.event === "subscription.halted") {
        const subscription = payload.subscription.entity;
        const userId = subscription.notes?.userId;

        if (userId) {
          await db.collection("users").doc(userId).set({
            plan: "FREE",
            userPlan: "FREE",
            subscriptionStatus: subscription.status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          console.log(`User ${userId} downgraded to FREE due to cancellation`);
        }
      }

      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).send("Callback processing failed");
    }
  });

  const FREE_LIMIT = 3;

  app.post("/api/check-analysis-limit", express.json(), async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    try {
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        return res.json({ allowed: true, remaining: FREE_LIMIT });
      }

      const userData = userDoc.data()!;
      if (userData.plan === "PRO") {
        return res.json({ allowed: true, remaining: -1 });
      }

      const getTodayIST = () => {
        return new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(new Date());
      };

      const lastResetDateStr = userData.lastResetDate ? 
        (typeof userData.lastResetDate.toDate === 'function' 
          ? new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(userData.lastResetDate.toDate())
          : new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(userData.lastResetDate))
        ) : "";
      
      const today = getTodayIST();

      let currentCount = userData.analysisCount || 0;
      if (lastResetDateStr !== today) {
        currentCount = 0;
      }

      res.json({
        allowed: currentCount < FREE_LIMIT,
        remaining: Math.max(0, FREE_LIMIT - currentCount),
        count: currentCount
      });
    } catch (error) {
      console.error("Check limit error:", error);
      res.status(500).json({ error: "Failed to check limit" });
    }
  });

  app.post("/api/increment-analysis-count", express.json(), async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    try {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();
      
      const getTodayIST = () => {
        return new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(new Date());
      };
      
      const today = getTodayIST();
      const todayTimestamp = admin.firestore.FieldValue.serverTimestamp();

      if (!userDoc.exists) {
        await userRef.set({
          analysisCount: 1,
          lastResetDate: todayTimestamp,
          plan: "FREE"
        }, { merge: true });
      } else {
        const userData = userDoc.data()!;
        const lastResetDateStr = userData.lastResetDate ? 
          (typeof userData.lastResetDate.toDate === 'function' 
            ? new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(userData.lastResetDate.toDate())
            : new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(userData.lastResetDate))
          ) : "";
        
        if (lastResetDateStr !== today) {
          await userRef.update({
            analysisCount: 1,
            lastResetDate: todayTimestamp
          });
        } else {
          await userRef.update({
            analysisCount: admin.firestore.FieldValue.increment(1)
          });
        }
      }
      res.json({ status: "ok" });
    } catch (error) {
      console.error("Increment count error:", error);
      res.status(500).json({ error: "Failed to increment count" });
    }
  });

  app.get("/api/user-subscription/:userId", async (req, res) => {
    try {
      const userDoc = await db.collection("users").doc(req.params.userId).get();
      const plan = userDoc.exists ? (userDoc.data()?.plan || "FREE") : "FREE";
      res.json({ plan });
    } catch (error) {
      res.json({ plan: "FREE" });
    }
  });

  app.post("/api/deep-analysis", express.json(), async (req, res) => {
    res.json({ allowed: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
