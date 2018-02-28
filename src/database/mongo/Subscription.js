import mongoose from "mongoose";
import SubscriptionSchema from "./SubscriptionSchema";

export default mongoose.model("Subscription", SubscriptionSchema);
