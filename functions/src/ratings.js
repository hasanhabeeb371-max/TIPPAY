const functions = require("firebase-functions/v1");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const db = getFirestore();

/**
 * Aggregate Dish Ratings
 */
exports.aggregateDishRating = functions.firestore.document("dish_ratings/{ratingId}").onCreate(async (snap, context) => {
  const data = snap.data();
  const { food_item_id, rating } = data;
  if (!food_item_id || !rating) return;
  const itemRef = db.collection("food_items").doc(food_item_id);
  try {
    await db.runTransaction(async (transaction) => {
      const itemDoc = await transaction.get(itemRef);
      if (!itemDoc.exists) return;
      const itemData = itemDoc.data();
      const currentAvg = itemData.rating || 0;
      const currentCount = itemData.total_ratings || 0;
      const newCount = currentCount + 1;
      const newAvg = ((currentAvg * currentCount) + rating) / newCount;
      transaction.update(itemRef, {
        rating: Math.round(newAvg * 10) / 10,
        total_ratings: newCount,
        last_rated_at: new Date().toISOString()
      });
    });
  } catch (error) { console.error(error); }
});

/**
 * Aggregate Restaurant and Rider Ratings
 * Triggered when a new rating is added to 'ratings'.
 */
exports.aggregateOrderRating = functions.firestore.document("ratings/{ratingId}").onCreate(async (snap, context) => {
  const data = snap.data();
  const { restaurant_id, rider_id, restaurant_rating, rider_rating } = data;

  // Aggregate for Restaurant
  if (restaurant_id && restaurant_rating) {
    const restRef = db.collection("restaurants").doc(restaurant_id);
    try {
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(restRef);
        if (!doc.exists) return;
        const d = doc.data();
        const count = d.total_ratings || 0;
        const avg = d.rating || 0;
        const newCount = count + 1;
        const newAvg = ((avg * count) + restaurant_rating) / newCount;
        transaction.update(restRef, {
          rating: Math.round(newAvg * 10) / 10,
          total_ratings: newCount
        });
      });
    } catch (e) { console.error(e); }
  }

  // Aggregate for Rider
  if (rider_id && rider_rating) {
    const riderRef = db.collection("delivery_profiles").doc(rider_id);
    try {
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(riderRef);
        if (!doc.exists) return;
        const d = doc.data();
        const count = d.total_ratings || 0;
        const avg = d.rating || 0;
        const newCount = count + 1;
        const newAvg = ((avg * count) + rider_rating) / newCount;
        transaction.update(riderRef, {
          rating: Math.round(newAvg * 10) / 10,
          total_ratings: newCount
        });
      });
    } catch (e) { console.error(e); }
  }
});
