'use strict';

import User from "../mongo/User";
import Role from "../mongo/Role";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
const Config = require('../../config/config').getConfig();

const getRole = async function (userId){
  const user = await User.findOne({_id:userId}).populate("role");
  if (!user){
    const userNotFoundError = new Error("User Not Found");
    throw userNotFoundError;
  }
  return {
    role: user.role.role,
    access: user.role.accessLevel
  };
};

const getAllUsers = async () =>{
  const userList = await User
    .find()
    .populate("role")
    .select({
      username: 1,
      firstName: 1,
      lastName: 1,
      biography: 1
    });

  return userList;
};

const addNewUser = async (requestBody) => {
  let hashedPassword;
  if (requestBody.password){
    hashedPassword = await bcrypt.hash(requestBody.password, 10);
  } else{
    const noPasswordError = new Error("No password was included in the signup request");
    noPasswordError.statusCode = 400;
    throw noPasswordError;
  }
  const role = await Role.findOne({accessLevel: 0});
  const newUser = new User({
    email: requestBody.email,
    username: requestBody.username,
    password: hashedPassword,
    firstName: requestBody['first-name'],
    lastName: requestBody['last-name'],
    birthdate: requestBody.birthdate,
    joinDate: Date.now(),
    role: role._id
  });

  try{
    await newUser.save();
    return newUser;
  } catch (e){
    // Handle validation/duplicate user errors here
    if (e.name === "MongoError" || e.code === 11000){
      const duplicateEmailError = new Error("User already exists with that email");
      duplicateEmailError.statusCode = 409;
      throw duplicateEmailError;
    } else if (e.name === "ValidationError"){
      const validatorError = new Error(e.message);
      validatorError.statusCode = 400;
      throw validatorError;
    }
  }
};

const updateUser = async (requestBody, webToken) => {
  if (!webToken){
    const noTokenError = new Error("No token was included in the update request");
    throw noTokenError;
  }
  const token = jwt.verify(webToken, Config.security.tokensecret);
  const valuesToUpdate = {};
  if (requestBody['first-name']) valuesToUpdate.firstName = requestBody['first-name'];
  if (requestBody['last-name']) valuesToUpdate.lastName = requestBody['last-name'];
  if (requestBody.biography) valuesToUpdate.biography = requestBody.biography;
  if (Object.keys(valuesToUpdate).length === 0){
    const noUpdateError = new Error("No valid fields were included in the update request");
    throw noUpdateError;
  }
  const query = {_id: token.id};
  const updateOptions = {
    new: true
  };
  const update = await User.findOneAndUpdate(query, valuesToUpdate, updateOptions);
  return update;
};

const deleteUser = async (webToken) => {
  const token = jwt.verify(webToken, Config.security.tokensecret);

  //XXX: This implementation uses the token to detrmine which user to delete
  // As such, if someone tries to delete with a randomized token that
  // happens to match something, that thing may get delete
  // Need to figure out how to prevent that...
  return await User.remove({_id: token.id});
};
export {
  getRole,
  getAllUsers,
  addNewUser,
  updateUser,
  deleteUser
};
