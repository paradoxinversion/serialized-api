const User = require("../database/mongo/User");
const {
  NoAuthenticationError,
  UserUnauthorizedError,
} = require("../utilities/errorGenerator");
/**
 * Checks whether the client (if authorized/authenticated) is an admin
 */
const userIsAdministrator = async (req, res, next) => {
  debugger;
  // middleware should be used after a user is authorized (error if one isn't present)
  try {
    if (!req.authenticatedUser) {
      const error = new NoAuthenticationError("No credentials provided");
      throw error;
    }

    if (req.authenticatedUser.role !== 1) {
      const error = new UserUnauthorizedError("User is not an administrator");
      throw error;
    } else {
      next();
    }
  } catch (e) {
    return res
      .type("application/vnd.api+json")
      .status(403)
      .json({ errors: [e] });
  }
};
module.exports = userIsAdministrator;
