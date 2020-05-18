const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Defines a subscription between a user and a serial story
 */
const SubscriptionSchema = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscribed_object: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  subscription_type: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Subscription", SubscriptionSchema);
