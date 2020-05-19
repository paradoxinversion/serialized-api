const User = require("../database/mongo/User");
const {
  NoAuthenticationError,
  UserUnauthorizedError,
} = require("../utilities/errorGenerator");
module.exports = async (req, res, next) => {
  debugger;
  try {
    if (!req.headers.authorization) {
      const error = new NoAuthenticationError("No credentials provided");
      throw error;
    }
    const verifiedToken = req.app.locals.tokenManager.verify(
      req.get("authorization").split(" ")[1],
      "test"
    );
    // We're only guaranteed that our user can be serialized to something
    // We still need to check their validity (account status, etc)
    const user = await User.findById(verifiedToken.sub);
    if (user.account_status === 0) {
      req.authenticatedUser = user;
      next();
    } else {
      const error = new UserUnauthorizedError("User is forbidden from access");
      throw error;
    }
  } catch (e) {
    return res
      .type("application/vnd.api+json")
      .status(403)
      .json({ errors: [e] });
  }
};
