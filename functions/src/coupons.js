const functions = require("firebase-functions/v1");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

/**
 * Validate Coupon
 * Checks if a coupon code is valid for the current user and cart.
 */
exports.validateCoupon = functions.https.onCall(async (data, context) => {
  const { code, cartTotal, userId } = data;

  if (!code || !cartTotal) {
    throw new functions.https.HttpsError('invalid-argument', 'Code and total are required.');
  }

  console.log(`🎟️ [Coupon] Validating ${code} for User ${userId}`);

  try {
    let couponSnap = await db.collection("coupons").doc(code.toUpperCase()).get();
    let coupon;
    let isUserCoupon = false;

    if (couponSnap.exists) {
      coupon = couponSnap.data();
    } else {
      // Check user-specific coupons
      if (userId) {
        const userCouponSnap = await db.collection("user_coupons")
          .where('uid', '==', userId)
          .where('code', '==', code.toUpperCase())
          .get();
        
        if (!userCouponSnap.empty) {
          coupon = userCouponSnap.docs[0].data();
          coupon.id = userCouponSnap.docs[0].id;
          isUserCoupon = true;
        }
      }
    }

    if (!coupon) {
      return { success: false, message: 'Invalid coupon code.' };
    }

    // 1. Check expiration
    const expiryDate = coupon.expires_at?.toDate ? coupon.expires_at.toDate() : new Date(coupon.expires_at);
    if (coupon.expires_at && expiryDate < new Date()) {
      return { success: false, message: 'Coupon has expired.' };
    }

    // 2. Check minimum order value
    const minOrder = coupon.min_order || coupon.minOrder || 0;
    if (minOrder && cartTotal < minOrder) {
      return { success: false, message: `Minimum order of ₹${minOrder} required.` };
    }

    // 3. Check usage
    if (isUserCoupon) {
      if (coupon.used) {
        return { success: false, message: 'This coupon has already been used.' };
      }
    } else if (userId) {
      const usageSnap = await db.collection("coupon_usage")
        .where('uid', '==', userId)
        .where('code', '==', code.toUpperCase())
        .get();
      
      const limitPerUser = coupon.limit_per_user || coupon.limitPerUser || 1;
      if (usageSnap.size >= limitPerUser) {
        return { success: false, message: 'You have already used this coupon.' };
      }
    }

    // 4. Calculate discount
    let discount = 0;
    const value = coupon.value || coupon.discount || 0;
    const maxDiscount = coupon.max_discount || coupon.maxDiscount || Infinity;

    if (coupon.type === 'percentage' || coupon.type === 'percent') {
      discount = (cartTotal * value) / 100;
      discount = Math.min(discount, maxDiscount);
    } else if (coupon.type === 'fixed') {
      discount = value;
    }

    return { 
      success: true, 
      discount: Math.round(discount), 
      message: 'Coupon applied!',
      type: coupon.type,
      code: code.toUpperCase(),
      isUserCoupon
    };

  } catch (error) {
    console.error(`❌ [Coupon] Validation failed:`, error);
    throw new functions.https.HttpsError('internal', 'Internal validation error.');
  }
});
