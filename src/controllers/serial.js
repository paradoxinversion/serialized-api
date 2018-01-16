import Serial from '../database/mongo/Serial';
import SerialPart from '../database/mongo/SerialPart';
import * as jwt from "jsonwebtoken";

const Config = require('../config/config').getConfig();
const _ = require("lodash");

/**
 * Deletes all parts associated with a serial
 * This should be called when a serial is deleted for proper cleanup
 */
const deleteSerialParts = async(serial) => {
  try {
    const removalResult = await SerialPart.remove({serial_id: serial._id});
    return removalResult;
  } catch (error){
    throw error;
  }
};

/**
 * Get a list of serials
 */
const getSerials = async (req, res) => {

  try{
    let serials;
    if (req.query.userId === undefined){
      serials = await Serial.find();
    } else {
      serials = await Serial.find({author_id: req.query.userId});
    }
    res.json(serials);
  } catch (error){
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

/**
 * Post a new serial
 */
const postSerial = async (req, res) => {

  try{
    const newSerial = new Serial({
      title: req.body.title,
      synopsis: req.body.synopsis,
      genre: req.body.genre,
      description: req.body.description,
      nsfw: req.body.nsfw,
      creation_date: Date.now(),
      author_id: req.user._id,
      slug: _.kebabCase(req.body.title)
    });
    await newSerial.save();
    res.json(newSerial);
  } catch(error){
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

/**
 * Return a list of Serials by author id
 */
const getSerialsByAuthorId = async (req, res) => {

  try{
    res.send(req);
  } catch (error){
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

/**
 * Delete a serial overview/uses bearer tokens to decide
 */
const deleteSerial = async (req, res) => {

  try{
    const token = jwt.verify(req.user.token, Config.security.tokensecret);
    if (!req.query.serialId){
      const noIdError = new Error("No serial ID supplied for delete operation.");
      throw noIdError;
    }
    const serial = await Serial.findOne({_id: req.query.serialId});
    if (token.id == serial.author_id){
      await deleteSerialParts(serial);
      const deletionResult = await Serial.remove({_id: serial._id});
      res.json(deletionResult);
    } else {
      const wrongOwnerError = new Error("User ID does not match Author ID, aborting delete.");
      throw wrongOwnerError;
    }
  } catch(error){
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

const editSerial = async (req, res) => {
  try{
    const query = {_id: req.query.serialId};
    const token = jwt.verify(req.user.token, Config.security.tokensecret);
    if (!req.query.serialId){
      const noIdError = new Error("No serial ID supplied for delete operation.");
      throw noIdError;
    }

    const serial = Serial.findOne(query);
    if (!serial.author_id === token.id){
      const wrongOwnerError = new Error("User ID does not match Author ID, aborting edit.");
      throw wrongOwnerError;
    }

    const valuesToUpdate = {};
    if (req.body.title) valuesToUpdate.title = req.body.title;
    if (req.body.synopsis) valuesToUpdate.synopsis = req.body.synopsis;
    if (req.body.genre) valuesToUpdate.genre = req.body.genre;
    if (req.body.description) valuesToUpdate.description = req.body.description;
    const update = Serial.findOneAndUpdate(query, valuesToUpdate);
    res.json(update);

  } catch (error) {
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

export {
  getSerials,
  postSerial,
  getSerialsByAuthorId,
  deleteSerial,
  editSerial
};
