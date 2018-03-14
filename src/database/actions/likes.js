import Like from "../mongo/Like";
export const toggleLikeSerialPart = async (userId, serialPartId, parentSerialId) => {
  try{
    const existingPartLike = await Like.findOne({user:userId, likedEntityId: serialPartId});
    if (existingPartLike){
      await Like.remove({user:userId, likedEntityId:serialPartId});
    } else {
      console.log("DATAS", serialPartId, userId)
      const newPartLike = new Like({
        likedEntityId: serialPartId,
        user: userId,
        parentEntityId: parentSerialId,
        likedEntityType: 1
      });

      await newPartLike.save();
      return newPartLike;
    }
  } catch (e){
    throw e;
  }
}

export const toggleLikeSerial = async (userId, serialId) => {
  try{
    const existingSerialLike = await Like.findOne({user:userId, likedEntityId: serialId});
    if (existingSerialLike){
      await Like.remove({user:userId, likedEntityId:serialId});
    } else {
      const newSerialLike = new Like({
        likedEntityId: serialId,
        user: userId,
        likedEntityType: 0
      });

      await newSerialLike.save();
      return newSerialLike;
    }
  } catch (e){
    console.log(e);
    throw e;
  }
}

export const getSerialPartLikes = async (serialPartId) => {
  try {
    console.log(serialPartId);
    const serialPartLikes = await Like.find({likedEntityId: serialPartId}).select({
      userId:1
    });
    console.log("Likes", serialPartLikes)
    return serialPartLikes;
  } catch (e){
    throw e;
  }
};
