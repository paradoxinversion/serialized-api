const User = require("../mongo/User");
const bcrypt = require("bcrypt");
const Serial = require("../mongo/Serial");
const {
  MissingArgumentError,
  ValidationError,
} = require("../../utilities/errorGenerator");
const serialActions = require("../actions/serial");
/**
 *
 * @param {String} userId - The id of the user to modify
 * @param {Number} newAccessLevel - The new acces level for the specified user
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
    return user;
  } catch (e) {
    throw e;
  }
};
/**
 * This function returns users from the database. Rename to remove 'all'
 * @param {Number} start - the amount of users to skip when gettign users (for paging)
 * @param {Number} usersToGet - the amount of users to include in the query
 * @returns {Array} an array of users
 */
const getAllUsers = async (start = 0, usersToGet = 25) => {
  try {
    const userList = await User.find()
      .select("username biography")
      .skip(start)
      .limit(usersToGet);
    return userList;
  } catch (e) {
    throw e;
  }
};

/**
 * This function returns a specific user from the database
 * @param {string} userName the username of the user to find
 * @returns {Object} an object containing the user searched for (or null)
 */
const getUser = async (userName) => {
  try {
    const user = await User.findOne({ username: userName });
    return user;
  } catch (e) {
    throw e;
  }
};

/**
 * This function posts a new user to the database
 * @param {Object} requestBody - The request from the client with all information for a new user
 * @param {string} username - The user's username
 * @param {string} password - The plaintext password the user intends to use
 * @param {Date} birth_date - the user's birth_date
 * @param {Date} birth_date - the user's birth_date
 * @returns {Object} an object containing the user searched for (or null)
 */
const addNewUser = async ({ username, password, birth_date, role }) => {
  try {
    if (!username) {
      const error = new MissingArgumentError("Username is missing");
      throw error;
    }
    if (!password) {
      const error = new MissingArgumentError("Password is missing");
      throw error;
    }
    if (!birth_date) {
      const error = new MissingArgumentError("Username is missing");
      throw error;
    }
    const user = await User.findOne({ username });
    if (user) {
      const message = `User already exists with the username '${username}'`;
      const duplicateEmailError = new Error(message);
      duplicateEmailError.statusCode = 409;
      throw duplicateEmailError;
    }

    if (!password) {
      const noPasswordError = new Error(
        "No password was included in the signup request"
      );
      noPasswordError.statusCode = 401;
      throw noPasswordError;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      birth_date: birth_date,
      join_date: Date.now(),
      role: role,
    });

    await newUser.save();
    return newUser;
  } catch (e) {
    throw e;
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
  try {
    const updateOptions = {
      new: true,
      omitUndefined: true,
    };
    const update = await User.findByIdAndUpdate(
      userId,
      {
        biography,
        view_nsfw: viewNSFW,
      },
      updateOptions
    );
    if (!update) {
      return null;
    }

    return update;
  } catch (e) {
    throw e;
  }
};

/**
 * This function deletes a user from the Database
 * @param {string} userId The id of the user to delete
 * @returns {Object} an object containing the deleted user information
 */
const deleteUser = async (userId) => {
  try {
    if (!userId) {
      const error = new MissingArgumentError(
        "No userId present in delete request."
      );
      throw error;
    }
    const deletion = await User.findByIdAndDelete(userId);

    if (deletion) {
      // delete serials by the user

      const userSerials = await Serial.find({ author: userId });
      const serialDeletionResults = [];

      for (let x = 0; x < userSerials.length; x++) {
        const serial = userSerials[x];
        serialDeletionResults.push(
          await serialActions.deleteSerial({ serialId: serial.id })
        );
      }

      return {
        userDeletion: deletion,
        contentDeletion: serialDeletionResults,
      };
    } else {
      return {
        result: 0,
        message: "No user found with that ID",
        userId,
      };
    }
  } catch (e) {
    if (e.name == "CastError") {
      throw new ValidationError("Delete request received an invalid userId");
    }
    throw e;
  }
};
module.exports = {
  getAllUsers,
  addNewUser,
  updateUser,
  deleteUser,
  getUser,
  changeUserRole,
};
