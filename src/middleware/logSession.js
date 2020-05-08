const logSession = async (req, res, next) => {
  console.log("Log::", req.session);
  next();
};

module.exports = logSession;
