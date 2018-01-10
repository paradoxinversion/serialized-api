const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const BasicStrategy = require("passport-http").BasicStrategy;
import User from "../database/mongo/User";
const jwt = require("jsonwebtoken");
const Config = require('../config/config').getConfig();

const signWebToken = (user, secret, expiration) => {
  const token = jwt.sign({id:user._id}, secret, {
    expiresIn: expiration
  });
  return token;
};

passport.use(new BearerStrategy(
  async function(token, done){
    try{
      const authorizedUser = await User.findOne({token});
      if (!authorizedUser) return done(null, false);
      return done(null, authorizedUser);
    } catch (error) {
      return done(error);
    }
  }));

/**
 * This strat handles validating users/passwords & handing off authtokens.
 */
passport.use(new BasicStrategy(
  async function(username, password, done){
    try{
      const user = await User.findOne({email:username});
      if (!user){
        return done(null, false);
      }
      const validPassword = await user.validatePassword(password);
      if (!validPassword){
        return done(null, false);
      }
      const token = signWebToken(user, Config.security.tokensecret, "12h");
      user.token = token;
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

exports.isAuthenticatedBasic = passport.authenticate('basic', {session: false});
exports.isAuthenticatedBearer = passport.authenticate('bearer', {session: false});
