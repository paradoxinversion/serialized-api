const LikeSchema = new Schema({
like_type: String,
subject: { type: Schema.Types.ObjectId },
user: { type: Schema.Types.ObjectId, ref: "User" },
});
