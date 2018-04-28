import * as likeActions from "../database/actions/likes";
export const toggleLike = async (req, res) => {
  try {
    let result;
    if (req.body.entityType == 0){
      result = await likeActions.toggleLikeSerial(req.session.passport.user, req.body.entityId, req.body.parentEntityId);
    } else if (req.body.entityType == 1){
      result = await likeActions.toggleLikeSerialPart(req.session.passport.user, req.body.entityId, req.body.parentEntityId);
    }
    res.json(result);
  } catch (e){
    console.log(e);
    throw e;
  }
}

export const getLikes = async (req, res) => {
  try {
    let result;
    if (req.query.entityType == 1){

      result = await likeActions.getSerialPartLikes(req.query.entityId);
      return res.json(result);
    }
    return res.json(result);
  } catch (e){
    throw e;
  }
};
