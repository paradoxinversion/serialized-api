// const mongoose = require("mongoose");
// const UserSchema = require("./UserSchema");
import mongoose from 'mongoose';
import UserSchema from './UserSchema';
// module.exports = mongoose.model("User", UserSchema);
export default mongoose.model('User', UserSchema);
