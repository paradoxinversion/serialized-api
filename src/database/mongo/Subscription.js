// import {Schema} from "mongoose";
import mongoose, { Schema } from "mongoose";
const SubscriptionSchema = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId,
    required: true
  },
  subscribed_object: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

export default mongoose.model("Subscription", SubscriptionSchema);
