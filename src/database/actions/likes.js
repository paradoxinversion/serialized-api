import Like from "../mongo/Like";
/**
 * Adds a new "like" entry to the DB-- or removes it if one exists
 * @param {string} userId - The user's ID 
 * @param {string} serialPartId - The serial part's ID
 * @param {string} parentSerialId - The parent of the serial part
 * @returns {Object} - The new like entry, if toggling a like 'on'
 */
export const toggleLikeSerialPart = async (userId, serialPartId, parentSerialId) => {
  try{
    const existingPartLike = await Like.findOne({user:userId, likedEntityId: serialPartId});
    if (existingPartLike){
      await Like.remove({user:userId, likedEntityId:serialPartId});
    } else {
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
};

/**
 * Adds a new "like" entry to the DB-- or removes it if one exists
 * @param {string} userId - The toggling user's ID
 * @param {string} serialId - The ID of the serial to be toggled
 */
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
};

/**
 * Returns All likes that match the supplied serialPartId
 * @param {*} serialPartId - The serialPartId to match
 * @returns {Array} - An array of likes for the supplied serial part
 */
export const getSerialPartLikes = async (serialPartId) => {
  try {
    const serialPartLikes = await Like.find({likedEntityId: serialPartId}).select({
      user:1
    });
    return serialPartLikes;
  } catch (e){
    throw e;
  }
};
