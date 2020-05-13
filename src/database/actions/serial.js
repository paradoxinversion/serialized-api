const _ = require("lodash");
const Serial = require("../mongo/Serial");
const SerialPart = require("../mongo/SerialPart");
const Subscription = require("../mongo/Subscription");
/**
 * This function gets all serials in the database
 * @returns {Array} - all serials in the database
 */
const getSerials = async (includeNSFW) => {
  let serials;
  if (includeNSFW) {
    serials = await Serial.find();
  } else {
    serials = await Serial.find({ nsfw: false });
  }
  return serials;
};

/**
 * This function gets all serials by a single author
 * @param {string} authorId - The id of the Author who's Serials to find
 * @returns {Object} - the new serial entry
 */
const getAuthorSerials = async (authorId) => {
  return await Serial.find({ author_id: authorId });
};

/**
 * This function posts a new serial to the database
 * @param {Object} requestBody - The client request
 * @param {string} userId - The id of the user making the request
 * @returns {Object} - the new serial entry
 */
const createSerial = async ({ title, synopsis, genre, nsfw, userId }) => {
  try {
    const newSerial = new Serial({
      title,
      synopsis,
      genre,
      nsfw,
      creation_date: Date.now(),
      author: userId,
      slug: _.kebabCase(title), // should maybe be handled by the model itself
    });
    await newSerial.save();
    return newSerial;
  } catch (error) {
    throw error;
  }
};

/**
 * This function edits a serial's metadata
 * @param {Object} requestBody - The client request
 * @param {string} serialIdQueryString - the id of the serial to be edited
 * @param {string} userId - The id of the user making the request
 * @returns {Object} - The updated serial
 */
const editSerial = async (requestBody, serialIdQueryString, userId) => {
  const query = { _id: serialIdQueryString };
  if (!serialIdQueryString) {
    const noIdError = new Error("No serial ID supplied for edit operation.");
    throw noIdError;
  }

  const serial = await Serial.findOne(query);
  if (!serial.author_id === userId) {
    const wrongOwnerError = new Error(
      "User ID does not match Author ID, aborting edit."
    );
    throw wrongOwnerError;
  }

  const valuesToUpdate = {};
  if (requestBody.title) valuesToUpdate.title = requestBody.title;
  if (requestBody.synopsis) valuesToUpdate.synopsis = requestBody.synopsis;
  if (requestBody.genre) valuesToUpdate.genre = requestBody.genre;
  const updateOptions = {
    new: true,
  };
  return await Serial.findOneAndUpdate(query, valuesToUpdate, updateOptions);
};

/**
 * This function deletes all parts associated with a serial. This should be
 * called when a serial is deleted for proper cleanup
 * @param {Object} serial - the serial who's parts to delete
 */
const deleteSerialParts = async (serial) => {
  try {
    const removalResult = await SerialPart.remove({ serial_id: serial._id });
    return removalResult;
  } catch (error) {
    throw error;
  }
};

/**
 * This function deletes a serial and all associated parts
 * @param {string} serialIdQueryString - the serial id to delete
 * @param {string} userId - the id of the requesting user
 */
const deleteSerial = async (serialIdQueryString, userId) => {
  if (!serialIdQueryString) {
    const noIdError = new Error("No serial ID supplied for delete operation.");
    throw noIdError;
  }
  const serial = await Serial.findOne({ _id: serialIdQueryString });
  if (userId != serial.author_id) {
    const wrongOwnerError = new Error(
      "User ID does not match Author ID, aborting delete."
    );
    throw wrongOwnerError;
  }
  await deleteSerialParts(serial);
  const deletionResult = await Serial.remove({ _id: serial._id });
  return deletionResult;
};

/**
 * Subscribes a logged in user to a Serial, or removes their sub if they are already subscribed
 * @param {string} serialId
 * @param {string} userId
 */
const subscribeToSerial = async (serialId, userId) => {
  // check if the user already is subbed
  let userSubscription = await Subscription.findOne({ subscriber: userId })
    .where("subscribed_object")
    .eq(serialId);
  let result = {};
  if (userSubscription === null) {
    userSubscription = new Subscription({
      subscriber: userId,
      subscribed_object: serialId,
    });
    await userSubscription.save();
    result.subscription = userSubscription;
  } else {
    userSubscription = await Subscription.remove({ _id: userSubscription._id });
    result.subscription = null;
  }
  return result;
};

/**
 * Returns all subs for the supplied serial part
 * @param {string} serialId
 */
const getSerialSubscriptions = async (serialId) => {
  return await Subscription.find({ subscribed_object: serialId });
};

/**
 * Checks whether or not the supplied user is a suscribed to the supplied serial (by id)
 * @param {string} serialId
 * @param {string} userId
 */
const checkForUserSubscription = async (serialId, userId) => {
  const subscription = await Subscription.findOne({
    subscribed_object: serialId,
  })
    .where("subscriber")
    .eq(userId);
  const result = subscription;
  return result;
};

/**
 * Returns all the subscriptions of a single user
 * @param {string} userId
 */
const getUserSerialSubscriptions = async (userId) => {
  const subscriptions = await Subscription.find({ subscriber: userId });
  // TODO: Find a more elegant solution for this operation
  const result = [];
  while (result.length < subscriptions.length) {
    const subscribedSerial = await Serial.findOne({
      _id: subscriptions[result.length].subscribed_object,
    });
    result.push(subscribedSerial);
  }
  return result;
};

module.exports = {
  checkForUserSubscription,
  deleteSerial,
  deleteSerialParts,
  editSerial,
  getSerials,
  getAuthorSerials,
  getSerialSubscriptions,
  getUserSerialSubscriptions,
  createSerial,
  subscribeToSerial,
};
