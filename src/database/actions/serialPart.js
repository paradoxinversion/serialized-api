const _ = require("lodash");
const SerialPart = require("../mongo/SerialPart");

/**
 * This function returns all parts of a serial belonging to serialId
 * @param {string} serialId The id of the parent serial.
 * @returns {Array} an array of serial parts
 */
const readSerialParts = async (parent_serial) => {
  try {
    return await SerialPart.find({ parent_serial }).sort({
      part_number: 1,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * This function returns a single serial part in a parent serial
 * @param {string} partId The id of the serial part to be viewed.
 * @returns {Object} The serial part
 */
const getSingleSerialPart = async (partId) => {
  const part = await SerialPart.findById(partId).populate(
    "parent_serial author"
  );
  return part;
};

/**
 * This function adds a new serial part to the database and returns it
 * @param {Object} requestBody The request body from the client machine
 * @param {string} parentSerialId The serial to which this part should be added
 * @returns {Object} a JSON object representing the serial part
 */
const createSerialPart = async ({ title, content, author, parentSerial }) => {
  try {
    const serialParts = await readSerialParts(parentSerial);
    const newPart = new SerialPart({
      title,
      content,
      creation_date: Date.now(),
      last_modified: Date.now(),
      parent_serial: parentSerial,
      slug: _.kebabCase(title),
      part_number: serialParts.length,
      author,
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
  try {
    if (!partId) {
      const noIdError = new Error(
        "No serial part ID supplied for delete operation."
      );
      throw noIdError;
    }

    return await SerialPart.findByIdAndRemove(partId);
  } catch (error) {
    throw error;
  }
};

/**
 * This function updates a serial part and returns the updated entry
 * @param {Object} requestBody The request body from the client machine
 * @param {string} partId The id of the serial part ot be edited
 * @returns {Object} a JSON object representing the serial part
 */
const updateSerialPart = async ({ title, content, partId }) => {
  try {
    if (!partId) {
      const noPartIdError = new Error(
        "No partId was included in the update request"
      );
      throw noPartIdError;
    }
    let slug;
    if (title) slug = _.kebabCase(title);
    return await SerialPart.findByIdAndUpdate(
      partId,
      { title, content, slug },
      {
        omitUndefined: true,
        new: true,
      }
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Trades indexes with the next or previous part
 * @param {string} serialPartId
 * @param {boolean} moveUp - Should the index be incremented (true) or decremented (false)?
 * @param {string} userId
 */
const updateSerialPartNumber = async ({ serialPartId, moveUp, userId }) => {
  try {
    // how many serial parts are there?
    const serialPartToUpdate = await SerialPart.findById(serialPartId);
    const numberA = serialPartToUpdate.part_number;
    const parentSerial = serialPartToUpdate.parent_serial;

    // how many serial parts are there altogether?
    const allParts = await SerialPart.find({
      parent_serial: serialPartToUpdate.parent_serial,
    });
    let update;
    debugger;
    if (allParts < 2) throw new Error("Only one part!");
    if (moveUp) {
      if (serialPartToUpdate.part_number === allParts.length) {
        throw new Error("Part is alread at the end");
      }
      await SerialPart.findOneAndUpdate({
        parent_serial: serialPartToUpdate.parentSerial,
        part_number: serialPartToUpdate.part_number,
      });
      serialPartToUpdate.part_number = serialPartToUpdate.part_number + 1;
      update = await serialPartToUpdate.save();
    } else {
      if (serialPartToUpdate.part_number === 1) {
        throw new Error("Part is alread at the begining");
      }
      await SerialPart.findOneAndUpdate({
        parent_serial: serialPartToUpdate.parentSerial,
        part_number: serialPartToUpdate.part_number,
      });
      serialPartToUpdate.part_number = serialPartToUpdate.part_number - 1;
      update = await serialPartToUpdate.save();
    }
    if (!update) throw new Error("Could not be switched");
    return update;
  } catch (e) {
    throw e;
  }
};
module.exports = {
  createSerialPart,
  deleteSerialPart,
  getSingleSerialPart,
  readSerialParts,
  updateSerialPart,
  updateSerialPartNumber,
};
