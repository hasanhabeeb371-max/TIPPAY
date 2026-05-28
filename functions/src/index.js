const { initializeApp } = require("firebase-admin/app");

// Initialize Firebase Admin exactly ONCE at the root
initializeApp();

// Export all the pidge functions
const pidgeApi = require('./pidge');
exports.createPidgeOrderV2 = pidgeApi.createPidgeOrder;
exports.trackPidgeOrderV2 = pidgeApi.trackPidgeOrder;
exports.cancelPidgeOrderV2 = pidgeApi.cancelPidgeOrder;
exports.pidgeWebhookV2 = pidgeApi.pidgeWebhook;
exports.checkPidgeServiceabilityV2 = pidgeApi.checkPidgeServiceability;

// Export all the razorpay functions
const razorpayApi = require('./razorpay');
exports.createRazorpayOrderV2 = razorpayApi.createRazorpayOrder;

// Export all the notification triggers
const notificationTriggers = require('./notifications');
exports.onOrderCreatedV2 = notificationTriggers.onOrderCreated;
exports.onOrderStatusUpdatedV2 = notificationTriggers.onOrderStatusUpdated;
exports.onPidgeStatusUpdatedV2 = notificationTriggers.onPidgeStatusUpdated;
exports.onRestaurantStatusUpdatedV2 = notificationTriggers.onRestaurantStatusUpdated;
exports.onDeliveryAgentStatusUpdatedV2 = notificationTriggers.onDeliveryAgentStatusUpdated;

// Export settlement and financial functions
const settlementFunctions = require('./settlements');
exports.settleOrderEarningsV2 = settlementFunctions.settleOrderEarnings;
exports.onOrderCancelledV2 = settlementFunctions.onOrderCancelled;

// Export rating aggregation functions
// Export rating aggregation functions
const ratingFunctions = require('./ratings');
exports.aggregateDishRatingV2 = ratingFunctions.aggregateDishRating;

// Export coupon validation functions
const couponFunctions = require('./coupons');
exports.validateCouponV2 = couponFunctions.validateCoupon;

console.log("🚀 [Index] Functions initialized");
