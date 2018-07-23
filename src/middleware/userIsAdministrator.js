import User from "../database/mongo/User";

/**
 * Checks whether the client (if authorized/authenticated) is an admin
 */
const userIsAdministrator = async (req, res, next) => {
  if (req.session.passport && req.session.passport.user) {
    const user = await User.findOne({
      _id: req.session.passport.user
    }).populate("role");
    if (user.role.accessLevel === 2) {
      console.log("nextup");
      next();
    } else {
      res.json({
        error: "Not Authorized"
      });
    }
  } else {
    console.log("Not logged in");
    res.json({
      error: "Not Authorized"
    });
  }
};

export default userIsAdministrator;
