const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubscriptionSchema = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  subscribed_object: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
module.exports = mongoose.model("Subscription", SubscriptionSchema);
