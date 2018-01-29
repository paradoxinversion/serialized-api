import {Schema} from "mongoose";

const RoleSchema = new Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  accessLevel: {
    type: Number,
    required: true,
    unique: true
  }
});

export default RoleSchema;
