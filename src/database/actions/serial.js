"use strict";

import Serial from '../mongo/Serial';
import SerialPart from '../mongo/SerialPart';

import * as jwt from "jsonwebtoken";
import * as _ from "lodash";
const Config = require('../../config/config').getConfig();

export const getSerials = async (requestQueryString) => {
  let serials;
  if (requestQueryString.userId === undefined){
    serials = await Serial.find();
  } else {
    serials = await Serial.find({author_id: requestQueryString.userId});
  }
  return serials;
};

export const postSerial = async(requestBody, webToken) => {
  try {
    if (!webToken){
      const noTokenError = new Error("No token was included in the post request");
      throw noTokenError;
    }
    const token = jwt.verify(webToken, Config.security.tokensecret);
    const newSerial = new Serial({
      title: requestBody.title,
      synopsis: requestBody.synopsis,
      genre: requestBody.genre,
      description: requestBody.description,
      nsfw: requestBody.nsfw,
      creation_date: Date.now(),
      author_id: token.id,
      slug: _.kebabCase(requestBody.title)
    });
    return await newSerial.save();
  } catch (error){
    throw error;
  }

};

export const editSerial = async(requestBody, serialIdQueryString, webToken) => {
  const query = {_id: serialIdQueryString};
  const token = jwt.verify(webToken, Config.security.tokensecret);
  if (!serialIdQueryString){
    const noIdError = new Error("No serial ID supplied for edit operation.");
    throw noIdError;
  }

  const serial = await Serial.findOne(query);
  if (!serial.author_id === token.id){
    const wrongOwnerError = new Error("User ID does not match Author ID, aborting edit.");
    throw wrongOwnerError;
  }

  const valuesToUpdate = {};
  if (requestBody.title) valuesToUpdate.title = requestBody.title;
  if (requestBody.synopsis) valuesToUpdate.synopsis = requestBody.synopsis;
  if (requestBody.genre) valuesToUpdate.genre = requestBody.genre;
  if (requestBody.description) valuesToUpdate.description = requestBody.description;
  // console.log(valuesToUpdate);
  const updateOptions = {
    new: true
  };
  return await  Serial.findOneAndUpdate(query, valuesToUpdate, updateOptions);
};

/**
 * Deletes all parts associated with a serial
 * This should be called when a serial is deleted for proper cleanup
 */
export const deleteSerialParts = async(serial) => {
  try {
    const removalResult = await SerialPart.remove({serial_id: serial._id});
    return removalResult;
  } catch (error){
    throw error;
  }
};

export const deleteSerial = async (serialIdQueryString, webToken) => {
  const token = jwt.verify(webToken, Config.security.tokensecret);
  if (!serialIdQueryString){
    const noIdError = new Error("No serial ID supplied for delete operation.");
    throw noIdError;
  }
  const serial = await Serial.findOne({_id: serialIdQueryString});
  if (token.id != serial.author_id){
    const wrongOwnerError = new Error("User ID does not match Author ID, aborting delete.");
    throw wrongOwnerError;
  }
  await deleteSerialParts(serial);
  const deletionResult = await Serial.remove({_id: serial._id});
  return deletionResult;
};
