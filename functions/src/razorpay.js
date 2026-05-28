const functions = require("firebase-functions/v1");
const Razorpay = require("razorpay");

// Use Environment Variables instead of Params to support Free Tier (No billing required)
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_SWhM3xfnNBnSTb';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'rKM6C6lZ8VSwOskNxGQ3zeZZ';

exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
    console.log("💳 [Razorpay] Incoming request to create order...");
    console.log("💳 [Razorpay] Request data:", JSON.stringify(data));
    console.log("💳 [Razorpay] Initiating new order request...");
    try {
        const { amount, currency, receipt } = data;
        console.log(`💳 [Razorpay] Validating payload for Receipt ID: ${receipt}`);

        if (!amount) {
            console.error("💳 [Razorpay] Validation failed: Amount is missing");
            throw new HttpsError("invalid-argument", "Amount is required");
        }

        console.log(`💳 [Razorpay] Authenticating with Razorpay instance...`);
        const razorpay = new Razorpay({
            key_id: razorpayKeyId,
            key_secret: razorpayKeySecret,
        });

        const options = {
            amount: amount * 100, // Razorpay takes amount in paise (multiply by 100)
            currency: currency || "INR",
            receipt: receipt || `receipt_${Date.now()}`
        };
        console.log(`💳 [Razorpay] Dispatching API Call with options:`, JSON.stringify(options));

        const order = await razorpay.orders.create(options);
        console.log(`✅ [Razorpay] Order created successfully! ID: ${order.id}`);
        return { 
            success: true, 
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt
        };
    } catch (error) {
        console.error("❌ [Razorpay] Order Creation Failed:", error);
        throw new HttpsError('internal', error.message || "Failed to create Razorpay order");
    }
});
