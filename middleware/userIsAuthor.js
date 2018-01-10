/**
 * Checks whether the client (if authorized/authenticated) is the author of the
 * page they are viewing.
 * Adds
 */
const userIsAuthor = (req, res, next) => {
  if (req.session.passport && req.session.passport.user){
    req.userIsAuthor = true;
  } else{
    req.userIsAuthor = false;
  }
  next();
};

module.exports = userIsAuthor;
