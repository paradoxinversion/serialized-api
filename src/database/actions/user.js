const User = require("../mongo/User");
const bcrypt = require("bcrypt");

/**
 * Changes the User's role
 * 0: Reader; 1: Writer; 2: Admin
 * @param {string} userId The id of the user who's role to get
 * @returns {boolean} true if successful, false if something went wrong
 */
const changeUserRole = async function (userId, newAccessLevel) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { role: newAccessLevel },
      { new: true }
    );

    if (!user) {
      const userNotFoundError = new Error("User Not Found");
      throw userNotFoundError;
    }
    await user.save();
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
    .populate({ path: "role", select: "role accessLevel" })
    .select("username biography");

  return userList;
};

/**
 * This function returns a specific user from the database
 * @param {string} userName the username of the user to find
 * @returns {Object} an object containing the user searched for (or null)
 */
const getUser = async (userName) => {
  const user = await User.findOne({ username: userName })
    .populate({ path: "role", select: "role accessLevel" })
    .select("username biography");
  return user;
};

/**
 * This function posts a new user to the database
 * @param {Object} requestBody - The request from the client with all information for a new user
 * @param {string} username - The user's username
 * @param {string} password - The plaintext password the user intends to use
 * @param {Date} birthdate the user's birthdate
 * @returns {Object} an object containing the user searched for (or null)
 */
const addNewUser = async ({ username, password, birthdate, role }) => {
  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  } else {
    const noPasswordError = new Error(
      "No password was included in the signup request"
    );
    noPasswordError.statusCode = 400;
    throw noPasswordError;
  }
  const newUser = new User({
    username,
    password: hashedPassword,
    birthdate,
    joinDate: Date.now(),
    role: role,
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
const updateUser = async ({ biography, viewNSFW, userId }) => {
  const valuesToUpdate = {};
  if (requestBody.viewNSFW !== "undefined")
    valuesToUpdate.viewNSFW = requestBody.viewNSFW;
  if (requestBody.biography) valuesToUpdate.biography = requestBody.biography;

  if (Object.keys(valuesToUpdate).length === 0) {
    const noUpdateError = new Error(
      "No valid fields were included in the update request"
    );
    throw noUpdateError;
  }
  const query = { _id: userId };
  const updateOptions = {
    new: true,
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
const deleteUser = async (userId) => {
  return await User.findOneAndRemove({ _id: userId });
};
module.exports = {
  getAllUsers,
  addNewUser,
  updateUser,
  deleteUser,
  getUser,
  changeUserRole,
};
