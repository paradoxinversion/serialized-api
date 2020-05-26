const User = require("../database/mongo/User");
const Serial = require("../database/mongo/Serial");
// I want to create (a) function(s)
// That returns (an) object(s)
// That have specified fields (if included) or all if none are passed
// That create compound documents as necessary

/**
 *
 * @param {String} id
 * @param {Array} fields - an array of the fields to retrive
 * @param {*} includes
 */
const createUserResponse = async (id, fields, includes) => {
  debugger;
  const baseData = await User.findById(id);
  const response = {
    data: {
      type: "user",
      id: baseData.id,
    },
  };

  // Handle the attributes
  const attributes = makeAttributes(User, baseData, fields);
  response.data.attributes = attributes;
  // console.log(response);
  return response;
};

const createSerialResponse = async (id, fields, includes) => {
  const baseData = await Serial.findById(id);
  const response = {
    data: {
      type: "serial",
      id: baseData.id,
    },
  };

  // Handle the attributes
  const attributes = makeAttributes(Serial, baseData, fields);
  response.data.attributes = attributes;
  // console.log(response);
  return response;
};

/**
 * Create an attributes object
 * @param {Object} model - The mongodb model of the document
 * @param {Object} document - The document to pull attributes from
 * @param {Array} fields - The fields to include in the attributes object (passes all if none supplied)
 */
const makeAttributes = (model, document, fields) => {
  const attributes = {};
  if (!fields) fields = Object.keys(model.schema.paths);
  fields.forEach((field) => {
    // never add the password
    if (field !== "password") attributes[field] = document[field];
  });
  return attributes;
};
module.exports = { createUserResponse, createSerialResponse };
