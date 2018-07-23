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
export const checkForRegisteredEmail = async (req, res) => {
  const email = req.query.email;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser === null) {
      return res.json({
        emailAvailable: true
      });
    }
    return res.json({
      emailAvailable: false
    });
  } catch (e) {
    res.json({
      error: e
    });
  }
};

export const checkForRegisteredUsername = async (req, res) => {
  const username = req.query.username;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser === null) {
      return res.json({
        usernameAvailable: true
      });
    }
    return res.json({
      usernameAvailable: false
    });
  } catch (e) {
    res.json({
      error: e
    });
  }
};
export const checkUserRegistrationData = async (req, res) => {
  if (req.query.email) {
    await checkForRegisteredEmail(req, res);
  } else if (req.query.username) {
    await checkForRegisteredUsername(req, res);
  }
};

export const tryAuthenticateLocal = passport.authenticate("local-login");
