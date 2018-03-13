import User from "../mongo/User";
import Role from "../mongo/Role";
import bcrypt from "bcrypt";

/**
 * This function returns a user's role
 * @param {ObjectId} userId The id of the user who's role to get
 * @returns {Object} an object containing the user's role name and access level
 */
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

/**
 * This function returns all users from the database
 * @returns {Array} an array of users
 */
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
  console.log(userList);
  return userList;
};

/**
 * This function returns a specific user from the database
 * @param {string} userName the username of the user to find
 * @returns {Object} an object containing the user searched for (or null)
 */
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

/**
 * This function posts a new user to the database
 * @param {Object} requestBody The request from the client with all information for a new user
 * @returns {Object} an object containing the user searched for (or null)
 */
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

/**
 * This function updates a user
 * @param {Object} requestBody The request from the client with all information for a new user
 * @param {Object} userId The id of the user to update
 * @returns {Object} an object containing the updated user information
 */
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

/**
 * This function deletes a user from the Database
 * @param {Object} userId The id of the user to delete
 * @returns {Object} an object containing the deleted user information
 */
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
