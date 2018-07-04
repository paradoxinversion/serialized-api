const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
import User from "../database/mongo/User";
import * as userActions from "../database/actions/user";
const logUserInLocal = function(email, password, done) {
  User.findOne({ email: email })
    .then(async user => {
      if (!user) {
        return done(null, false);
      } else {
        const validPassword = await user.validatePassword(password);
        if (validPassword) {
          await user.save();
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    })
    .catch(e => {
      return done(e);
    });
};

passport.use(
  "local-login",
  new LocalStrategy({ usernameField: "email" }, logUserInLocal)
);
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

export const checkAuthentication = async (req, res) => {
  if (req.session.passport && req.session.passport.user) {
    const user = await User.findOne({
      _id: req.session.passport.user
    }).populate("role");
    // const userRole = await userActions.getRole(user._id);
    return res.json({ isAuthenticated: true, user });
  }
  res.json({ isAuthenticated: false, user: null });
};

export const tryAuthenticateLocal = passport.authenticate("local-login");
