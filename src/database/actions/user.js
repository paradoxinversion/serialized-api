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

const getUser = async(userName) =>{
  const user = await User
    .findOne({username:userName})
    .populate("role")
    .select({
      username: 1,
      firstName: 1,
      lastName: 1,
      biography: 1
    });
  return user;
};

const addNewUser = async (requestBody) => {
  console.log("adding user")
  let hashedPassword;
  if (requestBody.password){
    hashedPassword = await bcrypt.hash(requestBody.password, 10);
  } else{
    const noPasswordError = new Error("No password was included in the signup request");
    noPasswordError.statusCode = 400;
    throw noPasswordError;
  }
  const role = await Role.findOne({accessLevel: 0});
  const lowercaseUsername = requestBody.username.toLowerCase();
  const newUser = new User({
    email: requestBody.email,
    username: lowercaseUsername,
    password: hashedPassword,
    firstName: requestBody.firstName,
    lastName: requestBody.lastName,
    birthdate: requestBody.birthdate,
    joinDate: Date.now(),
    role: role._id
  });

  try{
    await newUser.save();
    console.log(newUser);
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

const updateUser = async (requestBody, userId) => {
  const valuesToUpdate = {};
  if (requestBody.firstName) valuesToUpdate.firstName = requestBody.firstName;
  if (requestBody.lastName) valuesToUpdate.lastName = requestBody.lastName;
  if (requestBody.biography) valuesToUpdate.biography = requestBody.biography;
  if (Object.keys(valuesToUpdate).length === 0){
    const noUpdateError = new Error("No valid fields were included in the update request");
    throw noUpdateError;
  }
  const query = {_id: userId};
  const updateOptions = {
    new: true
  };
  const update = await User.findOneAndUpdate(query, valuesToUpdate, updateOptions);
  return update;
};

const deleteUser = async (userId) => {
  return await User.remove({_id: userId});
};
export {
  getRole,
  getAllUsers,
  addNewUser,
  updateUser,
  deleteUser,
  getUser
};
