import {Schema} from "mongoose";
const LikeSchema = new Schema({
  likedEntityId: {
    type: String,
    required: true
  },
  parentEntityId: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  likedEntityType: {
    type: Number,
    required: true
  },

});

export default LikeSchema;
