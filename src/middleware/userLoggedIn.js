const userLoggedIn = function(req, res, next){
  if (req.session && req.session.passport && req.session.passport.user){
    req.userLoggedIn = true;
  } else {
    req.userLoggedIn = false;
  }
  next();
};

module.exports = userLoggedIn;
