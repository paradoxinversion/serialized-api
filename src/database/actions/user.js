import User from "../mongo/User";
import Role from "../mongo/Role";
import bcrypt from "bcrypt";
/**
 * This function returns a user's role
 * @param {string} userId The id of the user who's role to get
 * @returns {Object} an object containing the user's role name and access level
 */
const getRole = async function(userId) {
  const user = await User.findOne({ _id: userId }).populate("role");
  if (!user) {
    const userNotFoundError = new Error("User Not Found");
    throw userNotFoundError;
  }
  return {
    role: user.role.role,
    accessLevel: user.role.accessLevel
  };
};
/**
 * Changes the User's role
 * 0: Reader; 1: Writer; 2: Admin
 * @param {string} userId The id of the user who's role to get
 * @returns {boolean} true if successful, false if something went wrong
 */
const changeUserRole = async function(userId, newAccessLevel) {
  try {
    const updatedUserRole = await Role.findOne({ accessLevel: newAccessLevel });
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { role: updatedUserRole._id },
      { new: true }
    );

    await user.save();
    if (!user) {
      const userNotFoundError = new Error("User Not Found");
      throw userNotFoundError;
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
/**
 * This function returns all users from the database
 * @returns {Array} an array of users
 */
const getAllUsers = async () => {
  const userList = await User.find()
    .populate("role")
    .select({
      username: 1,
      firstName: 1,
      lastName: 1,
      biography: 1
    });

  return userList;
};

/**
 * This function returns a specific user from the database
 * @param {string} userName the username of the user to find
 * @returns {Object} an object containing the user searched for (or null)
 */
const getUser = async userName => {
  const user = await User.findOne({ username: userName })
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
 * @param {Object} requestBody - The request from the client with all information for a new user
 * @param {string} requestBody.email - The email of the user
 * @param {string} requestBody.username - The user's username
 * @param {string} requestBody.firstName the user's first name
 * @param {string} requestBody.lastName the user's last name
 * @param {string} requestBody.password - The plaintext password the user intends to use
 * @param {Date} requestBody.birthdate the user's birthdate
 * @returns {Object} an object containing the user searched for (or null)
 */
const addNewUser = async requestBody => {
  let hashedPassword;
  if (requestBody.password) {
    hashedPassword = await bcrypt.hash(requestBody.password, 10);
  } else {
    const noPasswordError = new Error(
      "No password was included in the signup request"
    );
    noPasswordError.statusCode = 400;
    throw noPasswordError;
  }
  const role = await Role.findOne({ accessLevel: 0 });
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

  try {
    await newUser.save();
    return newUser;
  } catch (e) {
    // Handle validation/duplicate user errors here
    if (e.name === "MongoError" || e.code === 11000) {
      const duplicateEmailError = new Error(
        "User already exists with that email"
      );
      duplicateEmailError.statusCode = 409;
      throw duplicateEmailError;
    } else if (e.name === "ValidationError") {
      const validatorError = new Error(e.message);
      validatorError.statusCode = 400;
      throw validatorError;
    }
  }
};

/**
 * This function updates a user
 * @param {Object} requestBody - The request from the client with all information for a new user
 * @param {string} requestBody.firsName - A name to replace the user's first name
 * @param {string} requestBody.lastName - A name to replace the user's last name
 * @param {string} requestBody.biography - A biography to replace the user's current bio
 * @param {Object} userId The id of the user to update
 * @returns {Object} an object containing the updated user information
 */
const updateUser = async (requestBody, userId) => {
  const valuesToUpdate = {};
  if (requestBody.viewNSFW !== "undefined")
    valuesToUpdate.viewNSFW = requestBody.viewNSFW;
  if (requestBody.firstName) valuesToUpdate.firstName = requestBody.firstName;
  if (requestBody.lastName) valuesToUpdate.lastName = requestBody.lastName;
  if (requestBody.biography) valuesToUpdate.biography = requestBody.biography;
  console.log(requestBody);
  if (Object.keys(valuesToUpdate).length === 0) {
    const noUpdateError = new Error(
      "No valid fields were included in the update request"
    );
    throw noUpdateError;
  }
  const query = { _id: userId };
  const updateOptions = {
    new: true
  };
  const update = await User.findOneAndUpdate(
    query,
    valuesToUpdate,
    updateOptions
  );
  return update;
};

/**
 * This function deletes a user from the Database
 * @param {string} userId The id of the user to delete
 * @returns {Object} an object containing the deleted user information
 */
const deleteUser = async userId => {
  return await User.remove({ _id: userId });
};
export {
  getRole,
  getAllUsers,
  addNewUser,
  updateUser,
  deleteUser,
  getUser,
  changeUserRole
};
