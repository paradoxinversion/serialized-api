import * as _ from "lodash";
import Serial from "../mongo/Serial";
import SerialPart from "../mongo/SerialPart";

// these routes all have a query param /:serialId

/**
 * This function returns all parts of a serial belong to serialId
 * @param {ObjectId} serialId The id of the parent serial.
 * @returns {array} an array of serial parts
 */
const readSerialParts = async (serialId) => {
  try{
    return await SerialPart.find({serial_id: serialId});
  } catch (error) {
    throw error;
  }
};

/**
 * This function returns a single serial part in a parent serial
 * @param {ObjectId} serialId The id of the parent serial.
 * @param {ObjectId} partId The id of the serial part to be viewed.
 * @returns {Object} The serial part
 */
const getSingleSerialPart = async (serialId, partId) => {
  const parentSerial = await Serial.findOne({_id:serialId});
  const part = await SerialPart.findOne({_id:partId});
  return {
    parentSerial,
    part
  };
};

/**
 * This function adds a new serial to the database and returns it
 * @param {Object} requestBody The request body from the client machine
 * @param {ObjectId} parentSerialId The serial to which this part should be added
 * @returns {Object} a JSON object representing the serial part
 */
const createSerialPart = async (requestBody, parentSerialId) => {
  try{
    // const serial = await Serial.find({_id: req.params.serialId});
    const newPart = new SerialPart({
      title: requestBody.title,
      content: requestBody.content,
      creation_date: Date.now(),
      serial_id: parentSerialId,
      slug: _.kebabCase(requestBody.title)
    });

    await newPart.save();
    return newPart;
  } catch (error) {
    throw error;
  }
};

/**
 * This function deletes a single part of a serial
 * @param {Object} partId The id of the part to delete
 * @param {ObjectId} userId The requesting user's ID
 */
const deleteSerialPart = async (partId, userId) => {
  try{
    if (!partId){
      const noIdError = new Error("No serial part ID supplied for delete operation.");
      throw noIdError;
    }
    const serialPart = await SerialPart.findOne({_id: partId}).populate("serial_id");
    if (userId != serialPart.serial_id.author_id){
      const wrongOwnerError = new Error("User ID does not match Author ID, aborting delete.");
      throw wrongOwnerError;
    }
    return await SerialPart.remove({_id: partId});

  } catch(error){
    throw error;
  }
};
/**
 * This function updates a serial part and returns the updated entry
 * @param {Object} requestBody The request body from the client machine
 * @param {ObjectId} partId The id of the serial part ot be edited
 * @returns {Object} a JSON object representing the serial part
 */
const updateSerialPart = async (requestBody, partId) => {
  try{
    if (!partId){
      const noPartIdError = new Error("No partId was included in the update request");
      throw noPartIdError;
    }
    const valuesToUpdate = {};
    if (requestBody.title){
      valuesToUpdate.title = requestBody.title;
      valuesToUpdate.slug = _.kebabCase(requestBody.title);
    }
    if (requestBody.content) valuesToUpdate.content = requestBody.content;
    if (Object.keys(valuesToUpdate).length === 0){
      const noUpdateError = new Error("No valid fields were included in the update request");
      throw noUpdateError;
    }
    const query = {_id: partId};
    return await SerialPart.findOneAndUpdate(query, valuesToUpdate);

  } catch (error){
    throw error;
  }
};

export {
  readSerialParts,
  createSerialPart,
  deleteSerialPart,
  updateSerialPart,
  getSingleSerialPart
};
