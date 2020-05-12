const likeActions = require("../database/actions/likes");

const toggleLike = async (req, res) => {
  try {
    const result = await likeActions.toggleLikeSerial(
      req.session.passport.user,
      req.body.serialPartId
    );

    res.json({ likeToggle: result });
  } catch (e) {
    throw e;
  }
};
const getLikes = async (req, res) => {
  try {
    const result = await likeActions.getSerialPartLikes(req.query.serialPartId);
    return res.json(result);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  toggleLike,
  getLikes,
};
