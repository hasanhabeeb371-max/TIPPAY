const functions = require("firebase-functions/v1");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

/**
 * Helper to create a notification in Firestore
 */
async function createNotification(userId, title, message, type, metadata = {}) {
  if (!userId) return;
  console.log(`🔔 [Notification] Sending to ${userId}: ${title}`);
  await db.collection("notifications").add({
    userId,
    title,
    message,
    type,
    metadata,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

/**
 * 1. When a new order is created, notify the restaurant.
 */
exports.onOrderCreated = functions.firestore.document("orders/{orderId}").onCreate(async (snap, context) => {
  const orderData = snap.data();
  const restaurantId = orderData.restaurant_id;
  const userId = orderData.user_id;
  const orderId = context.params.orderId;

  console.log(`🔔 [onOrderCreated] New Order: ${orderId}`);
  console.log(`🔔 [onOrderCreated] Recipient Restaurant: ${restaurantId}`);
  console.log(`🔔 [onOrderCreated] Recipient User: ${userId}`);

  if (!restaurantId) {
    console.error(`❌ [onOrderCreated] Missing restaurant_id in order ${orderId}`);
  }
  await createNotification(
    restaurantId,
    "New Order Received! 🍕",
    `You have a new order (#${orderData.order_id || orderId}) for ₹${orderData.grand_total}.`,
    "new_order",
    { orderId, internalId: orderData.order_id }
  );

  // Notify User
  await createNotification(
    userId,
    "Order Placed! 🍔",
    `Your order #${orderData.order_id || orderId} has been sent to the restaurant for confirmation.`,
    "order_update",
    { orderId, internalId: orderData.order_id }
  );
});

/**
 * 2. When an order status updates (Restaurant updates status), notify the user.
 */
exports.onOrderStatusUpdated = functions.firestore.document("orders/{orderId}").onUpdate(async (change, context) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();
  const orderId = context.params.orderId;

  if (beforeData.status === afterData.status) return;

  const newStatus = afterData.status;
  const userId = afterData.user_id;
  const orderNumber = afterData.order_id || orderId;

  console.log(`🔔 [onOrderStatusUpdated] Order ${orderNumber} -> ${newStatus}`);

  if (newStatus === "preparing") {
    await createNotification(
      userId,
      "Order is being prepared! 👨‍🍳",
      `The restaurant has started preparing your order #${orderNumber}.`,
      "order_update",
      { orderId, status: newStatus }
    );
  } else if (newStatus === "claiming") {
    const riderName = afterData.rider_name || "A Tipay partner";
    await createNotification(
      userId,
      "Rider is coming! 🏍️",
      `${riderName} is on their way to pick up your order.`,
      "order_update",
      { orderId, status: newStatus }
    );
  } else if (newStatus === "ready_for_pickup") {
    await createNotification(
      userId,
      "Order is ready! 📦",
      "Your order is packed and ready to be picked up by the delivery partner.",
      "order_update",
      { orderId, status: newStatus }
    );
  } else if (newStatus === "out_for_delivery") {
    const riderName = afterData.rider_name || "The delivery partner";
    await createNotification(
      userId,
      "Order is on the way! 🛵",
      `${riderName} has picked up your food and is heading your way.`,
      "order_update",
      { orderId, status: newStatus }
    );
  } else if (newStatus === "delivered") {
    await createNotification(
      userId,
      "Order Delivered! ✅",
      "Enjoy your meal! Please rate your experience on Tipay.",
      "order_update",
      { orderId, status: newStatus }
    );
  } else if (newStatus === "cancelled") {
    await createNotification(
      userId,
      "Order Cancelled 🛑",
      `Your order #${orderNumber} has been cancelled. Any refund will be processed shortly.`,
      "order_update",
      { orderId, status: newStatus }
    );
  }
});

/**
 * 3. When a Pidge Order status updates, notify the user and restaurant.
 */
exports.onPidgeStatusUpdated = functions.firestore.document("pidge_orders/{pidgeId}").onUpdate(async (change, context) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();
  const pidgeId = context.params.pidgeId;

  if (beforeData.status === afterData.status) return;

  const newStatus = afterData.status;
  const partnerOrderId = afterData.partnerOrderId; // Firestore ID of 'orders' doc

  console.log(`🔔 [onPidgeStatusUpdated] PidgeID: ${pidgeId}, Status: ${newStatus}, Order: ${partnerOrderId}`);

  const orderSnap = await db.collection("orders").doc(partnerOrderId).get();
  if (!orderSnap.exists) {
    console.error(`❌ [onPidgeStatusUpdated] Order document ${partnerOrderId} not found!`);
    return;
  }
  const orderData = orderSnap.data();

  const userId = orderData.user_id;
  const restaurantId = orderData.restaurant_id;

  if (newStatus === "ASSIGNED") {
    const riderName = afterData.rider?.name || "A delivery partner";
    const riderPhone = afterData.rider?.phone || "";

    await createNotification(
      userId,
      "Rider Assigned! 🏍️",
      `${riderName} has been assigned. Contact: ${riderPhone}`,
      "order_update",
      { orderId: partnerOrderId, status: newStatus, riderPhone }
    );

    await createNotification(
      restaurantId,
      "Rider Coming! 🚚",
      `A delivery partner (${riderName}) is on the way to pick up order #${orderData.order_id}.`,
      "order_update",
      { orderId: partnerOrderId, status: newStatus }
    );
  }

  else if (newStatus === "ARRIVED") {
    await createNotification(
      restaurantId,
      "Rider Arrived! 📍",
      `The delivery partner is at your location to pick up order #${orderData.order_id}.`,
      "order_update",
      { orderId: partnerOrderId, status: newStatus }
    );
  }

  else if (newStatus === "PICKED_UP") {
    await createNotification(
      userId,
      "Order Picked Up! 🍔",
      "Your food is on the way to you!",
      "order_update",
      { orderId: partnerOrderId, status: newStatus }
    );
  }
  else if (newStatus === "DELIVERED") {
    const riderName = afterData.rider?.name || "The delivery partner";
    await createNotification(
      userId,
      "Order Delivered! 🍕",
      `${riderName} has delivered your food. Enjoy!`,
      "order_update",
      { orderId: partnerOrderId, status: newStatus }
    );
  }
});

/**
 * 4. When a restaurant is approved/rejected/held, notify the restaurant.
 */
exports.onRestaurantStatusUpdated = functions.firestore.document("restaurants/{restaurantId}").onUpdate(async (change, context) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();
  const restaurantId = context.params.restaurantId;

  if (beforeData.status === afterData.status) return;

  const newStatus = afterData.status;
  const restaurantName = afterData.restaurant_name || "your restaurant";

  if (newStatus === "approved") {
    await createNotification(
      restaurantId,
      "Store Approved! 🎊",
      `Welcome to Tipay! ${restaurantName} is now live and can receive orders.`,
      "platform_update",
      { status: newStatus }
    );
  } else if (newStatus === "hold") {
    await createNotification(
      restaurantId,
      "Store on Hold ⏸️",
      "Your store has been temporarily paused by administration.",
      "platform_update",
      { status: newStatus }
    );
  }
});

/**
 * 5. When a delivery agent is approved/rejected, notify the agent.
 */
exports.onDeliveryAgentStatusUpdated = functions.firestore.document("delivery_profiles/{agentId}").onUpdate(async (change, context) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();
  const agentId = context.params.agentId;

  if (beforeData.status === afterData.status) return;

  const newStatus = afterData.status;

  if (newStatus === "approved") {
    await createNotification(
      agentId,
      "Fleet Access Granted! 🏍️",
      "You are now an approved Tipay Delivery Partner. Start earning today!",
      "platform_update",
      { status: newStatus }
    );
  } else if (newStatus === "rejected") {
    await createNotification(
      agentId,
      "Application Update",
      "We regret to inform you that your delivery partner application was not approved.",
      "platform_update",
      { status: newStatus }
    );
  }
});
