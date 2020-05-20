const Like = require("../mongo/Like");
const Serial = require("../mongo/Serial");
/**
 * Creates a new like
 * @param {*} userId - the id of the user liking the subject
 * @param {*} likeType - the type of resource the subject is
 * @param {*} subject - the id of the subject
 */
const createLike = async (userId, likeType, subject) => {
  try {
    const newLike = new Like({
      like_type: likeType,
      subject,
      user: userId,
    });

    await newLike.save();
    return newLike;
  } catch (e) {
    throw e;
  }
};

/**
 * Removes a like from the db
 * @param {*} likeId - the id of the like to remove
 */
const removeLike = async (likeId) => {
  try {
    const deletedLike = await Like.findByIdAndRemove(likeId);
    return deletedLike;
  } catch (e) {
    throw e;
  }
};

/**
 * Retrieves likes by the user
 * @param {*} userId - the id of the user
 */
const getUserLikes = async (userId) => {
  try {
    const userLikes = await Like.find({ user: userId });
    return userLikes;
  } catch (e) {
    throw e;
  }
};

/**
 * Get likes related to an item
 * @param {*} itemId - the id of the item who's likes toget
 */
const getItemLikes = async (itemId) => {
  try {
    debugger;
    const likes = await Like.find({ subject: itemId });
    return likes;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createLike,
  removeLike,
  getUserLikes,
  getItemLikes,
};
