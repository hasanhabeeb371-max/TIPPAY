const functions = require("firebase-functions/v1");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const db = getFirestore();

/**
 * 1. Settle Order Earnings
 * Triggered when an order status becomes 'delivered' or 'DELIVERED'.
 * Updates restaurant and admin wallets based on shares.
 */
exports.settleOrderEarnings = functions.firestore.document("orders/{orderId}").onUpdate(async (change, context) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();
  const orderId = context.params.orderId;

  // Only run if status changed to DELIVERED
  const isNowDelivered = (afterData.status?.toLowerCase() === 'delivered') && (beforeData.status?.toLowerCase() !== 'delivered');
  if (!isNowDelivered) return;

  // Prevent double settlement
  if (afterData.settlement_status === 'settled') {
    console.log(`💰 [Settlement] Order ${orderId} already settled. Skipping.`);
    return;
  }

  const { restaurant_id, shares, grand_total, payment_method, order_id } = afterData;

  console.log(`💰 [Settlement] Processing earnings for Order ${order_id || orderId}`);

  try {
    const batch = db.batch();

    // 1. Update Restaurant Wallet
    if (restaurant_id && shares?.restaurant) {
      const restWalletRef = db.collection("wallets").doc(restaurant_id);
      batch.set(restWalletRef, {
        balance: FieldValue.increment(shares.restaurant),
        total_earned: FieldValue.increment(shares.restaurant),
        last_updated: new Date().toISOString()
      }, { merge: true });

      // Log Transaction
      const restTxRef = db.collection("wallets").doc(restaurant_id).collection("transactions").doc();
      batch.set(restTxRef, {
        order_id: orderId,
        order_number: order_id || orderId,
        amount: shares.restaurant,
        type: 'credit',
        description: `Earnings for order #${order_id || orderId}`,
        timestamp: new Date().toISOString()
      });
    }

    // 2. Update Admin Earnings
    if (shares?.admin) {
      const adminWalletRef = db.collection("settings").doc("admin_earnings");
      batch.set(adminWalletRef, {
        total_balance: FieldValue.increment(shares.admin),
        total_orders: FieldValue.increment(1),
        last_updated: new Date().toISOString()
      }, { merge: true });
    }

    // 3. Update Delivery Agent Wallet

    if (afterData.delivery_agent_id && (shares?.delivery || afterData.delivery_fee)) {
      const riderShare = shares?.delivery || afterData.delivery_fee;
      const riderWalletRef = db.collection("delivery_wallets").doc(afterData.delivery_agent_id);
      batch.set(riderWalletRef, {
        balance: FieldValue.increment(riderShare),
        total_earned: FieldValue.increment(riderShare),
        last_updated: new Date().toISOString()
      }, { merge: true });

      // Log Transaction
      const riderTxRef = db.collection("delivery_wallets").doc(afterData.delivery_agent_id).collection("transactions").doc();
      batch.set(riderTxRef, {
        order_id: orderId,
        order_number: order_id || orderId,
        amount: riderShare,
        type: 'credit',
        description: `Delivery earnings for order #${order_id || orderId}`,
        timestamp: new Date().toISOString()
      });
    }

    // 4. Mark order as settled

    const orderRef = db.collection("orders").doc(orderId);
    batch.update(orderRef, {
      settlement_status: 'settled',
      settled_at: new Date().toISOString()
    });

    await batch.commit();
    console.log(`✅ [Settlement] Successfully settled Order ${order_id || orderId}`);

  } catch (error) {
    console.error(`❌ [Settlement] Failed to settle Order ${orderId}:`, error);
  }
});

/**
 * 2. Handle Order Cancellation Refund Logic
 * Triggered when an order is cancelled.
 */
exports.onOrderCancelled = functions.firestore.document("orders/{orderId}").onUpdate(async (change, context) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();
  const orderId = context.params.orderId;

  if (afterData.status !== 'cancelled' || beforeData.status === 'cancelled') return;

  const { user_id, grand_total, payment_method, order_id: orderNumber } = afterData;

  // Only handle refunds for paid orders
  if (payment_method === 'upi' || payment_method === 'prepaid') {
    console.log(`💸 [Refund] Order ${orderNumber} cancelled. Initiating refund process for User ${user_id}`);
    
    // In a real app, you would call Razorpay/Stripe Refund API here.
    // For now, we log it to a refunds collection for manual processing or automatic credit.
    await db.collection("refunds").add({
      order_id: orderId,
      order_number: orderNumber,
      user_id,
      amount: grand_total,
      status: 'pending',
      reason: 'Order cancelled by user/restaurant',
      created_at: new Date().toISOString()
    });
  }
});
