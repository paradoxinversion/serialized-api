const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  joinDate: {
    type: Date,
    required: true
  },
  biography: {
    type: String,
    required: false
  },
  token: {
    type: String,
    required: false
  }
});

UserSchema.methods.validatePassword = function(password){
  return bcrypt.compare(password, this.password)
    .catch((error) => {
      throw error;
    });
};

export default UserSchema;
