import * as _ from "lodash";
import Serial from "../mongo/Serial";
import SerialPart from "../mongo/SerialPart";

/**
 * This function gets all serials in the database
 * @returns {Array} all serials in the database
 */
export const getSerials = async () => {
  let serials = await Serial.find();
  return serials;
};

/**
 * This function gets all serials by a single author
 * @param {Object} requestBody The client request
 * @param {string} authorId The id of the Author who's Serials to find
 * @returns {Object} the new serial entry
 */
export const getAuthorSerials = async(authorId) => {
  return await Serial.find({author_id: authorId});
};

/**
 * This function posts a new serial to the database
 * @param {Object} requestBody The client request
 * @param {string} userId The id of the user making the request
 * @returns {Object} the new serial entry
 */
export const postSerial = async(requestBody, userId) => {
  try {
    const newSerial = new Serial({
      title: requestBody.title,
      synopsis: requestBody.synopsis,
      genre: requestBody.genre,
      nsfw: requestBody.nsfw,
      creation_date: Date.now(),
      author_id: userId,
      slug: _.kebabCase(requestBody.title)
    });
    return await newSerial.save();
  } catch (error){
    throw error;
  }
};

/**
 * This function edits a serial's metadata
 * @param {Object} requestBody The client request
 * @param {string} serialIdQueryString the id of the serial to be edited
 * @param {string} userId The id of the user making the request
 */
export const editSerial = async(requestBody, serialIdQueryString, userId) => {
  const query = {_id: serialIdQueryString};
  if (!serialIdQueryString){
    const noIdError = new Error("No serial ID supplied for edit operation.");
    throw noIdError;
  }

  const serial = await Serial.findOne(query);
  if (!serial.author_id === userId){
    const wrongOwnerError = new Error("User ID does not match Author ID, aborting edit.");
    throw wrongOwnerError;
  }

  const valuesToUpdate = {};
  if (requestBody.title) valuesToUpdate.title = requestBody.title;
  if (requestBody.synopsis) valuesToUpdate.synopsis = requestBody.synopsis;
  if (requestBody.genre) valuesToUpdate.genre = requestBody.genre;
  const updateOptions = {
    new: true
  };
  return await Serial.findOneAndUpdate(query, valuesToUpdate, updateOptions);
};

/**
 * This function deletes all parts associated with a serial. This should be
 * called when a serial is deleted for proper cleanup
 * @param {Object} serial the serial who's parts to delete
 */
export const deleteSerialParts = async(serial) => {
  try {
    const removalResult = await SerialPart.remove({serial_id: serial._id});
    return removalResult;
  } catch (error){
    throw error;
  }
};

/**
 * This function deletes a serial and all associated parts
 * @param {string} serialIdQueryString the serial id to delete
* @param {string} userId the id of the requesting user
 */
export const deleteSerial = async (serialIdQueryString, userId) => {
  if (!serialIdQueryString){
    const noIdError = new Error("No serial ID supplied for delete operation.");
    throw noIdError;
  }
  const serial = await Serial.findOne({_id: serialIdQueryString});
  if (userId != serial.author_id){
    const wrongOwnerError = new Error("User ID does not match Author ID, aborting delete.");
    throw wrongOwnerError;
  }
  await deleteSerialParts(serial);
  const deletionResult = await Serial.remove({_id: serial._id});
  return deletionResult;
};
