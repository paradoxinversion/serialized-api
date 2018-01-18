import SerialPart from '../database/mongo/SerialPart';
import * as jwt from "jsonwebtoken";

const Config = require('../config/config').getConfig();
const _ = require("lodash");

// these routes all have a query param /:serialId

/**
 * Return all parts in a serial
 */
const readSerialParts = async (serialId) => {
  try{
    return await SerialPart.find({serial_id: serialId});
  } catch (error) {
    throw error;
  }
};

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

const deleteSerialPart = async (partId, webToken) => {
  try{
    const token = jwt.verify(webToken, Config.security.tokensecret);
    if (!partId){
      const noIdError = new Error("No serial part ID supplied for delete operation.");
      throw noIdError;
    }
    const serialPart = await SerialPart.findOne({_id: partId}).populate('serial_id');
    if (token.id != serialPart.serial_id.author_id){
      const wrongOwnerError = new Error("User ID does not match Author ID, aborting delete.");
      throw wrongOwnerError;
    }
    return await SerialPart.remove({_id: partId});

  } catch(error){
    throw error;
  }
};

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
  updateSerialPart
};
