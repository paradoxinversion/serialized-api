import * as likeActions from "../database/actions/likes";

export const toggleLike = async (req, res) => {
  try {
    const result = await likeActions.toggleLikeSerial(
      req.session.passport.user,
      req.body.serialPartId
    );

    res.json({ likeToggle: result });
  } catch (e) {
    console.log(e);
    throw e;
  }
};
export const getLikes = async (req, res) => {
  try {
    const result = await likeActions.getSerialPartLikes(req.query.serialPartId);
    return res.json(result);
  } catch (e) {
    throw e;
  }
};
