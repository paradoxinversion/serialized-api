const Like = require("../mongo/Like");
/**
 * Adds a new "like" entry to the DB-- or removes it if one exists
 * @param {string} userId - The user's ID
 * @param {string} serialPartId - The serial part's ID
 * @returns {Object} - The new like entry, if toggling a like 'on'
 */
const toggleLikeSerialPart = async (userId, serialPartId) => {
  try {
    const existingPartLike = await Like.findOne({
      user: userId,
      serialPart: serialPartId,
    });
    if (existingPartLike) {
      await Like.remove({ user: userId, likedEntityId: serialPartId });
    } else {
      const newPartLike = new Like({
        likedEntityId: serialPartId,
        user: userId,
      });

      await newPartLike.save();
      return newPartLike;
    }
  } catch (e) {
    throw e;
  }
};

/**
 * Adds a new "like" entry to the DB-- or removes it if one exists
 * @param {string} userId - The toggling user's ID
 * @param {string} serialPartId - The ID of the serial part to be toggled
 */
const toggleLikeSerial = async (userId, serialPartId) => {
  try {
    const existingSerialLike = await Like.findOne({
      user: userId,
      serialPart: serialPartId,
    });
    if (existingSerialLike) {
      await Like.remove({ user: userId, serialPart: serialPartId });
    } else {
      const newSerialLike = new Like({
        serialPart: serialPartId,
        user: userId,
      });

      await newSerialLike.save();
      return newSerialLike;
    }
  } catch (e) {
    throw e;
  }
};

/**
 * Returns All likes that match the supplied serialPartId
 * @param {*} serialPartId - The serialPartId to match
 * @returns {Array} - An array of likes for the supplied serial part
 */
const getSerialPartLikes = async (serialPartId) => {
  try {
    const serialPartLikes = await Like.find({
      serialPart: serialPartId,
    }).select({
      user: 1,
    });
    return { likes: serialPartLikes };
  } catch (e) {
    throw e;
  }
};

const checkDoesUserLikePart = async (userId, serialPartId) => {
  try {
    const userLike = await Like.findOne({
      serialPart: serialPartId,
      user: userId,
    });

    if (userLike !== null) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  checkDoesUserLikePart,
  getSerialPartLikes,
  toggleLikeSerial,
  toggleLikeSerialPart,
};
