const User = require("../database/mongo/User");
const { v4: uuidv4 } = require("uuid");
const logIn = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      const error = new Error(
        "No user found with username " + req.body.username
      );
      throw error;
    }
    debugger;
    if (await user.validatePassword(req.body.password)) {
      const signingOptions = {
        jwtid: uuidv4(),
        expiresIn: "2w",
        issuer: "serialized-test",
        audience: "serialized",
        subject: user.id,
      };
      const payload = {
        username: user.username,
      };
      const token = req.app.locals.tokenManager.sign(payload, signingOptions);
      res.status(200).type("application/vnd.api+json").json({ token });
    }
  } catch (e) {
    res
      .status(400)
      .type("application/vnd.api+json")
      .json({
        errors: [{ message: e.message }],
      });
  }
};

module.exports = {
  logIn,
};
