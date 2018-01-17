import Serial from '../database/mongo/Serial';
import SerialPart from '../database/mongo/SerialPart';
import * as jwt from "jsonwebtoken";
import * as serialActions from "../database/actions/serial";
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
    // let serials;
    // if (req.query.userId === undefined){
    //   serials = await Serial.find();
    // } else {
    //   serials = await Serial.find({author_id: req.query.userId});
    // }
    const serials = await serialActions.getSerials(req.query.userId);
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
    const newSerial = await serialActions.postSerial(req.body, req.user.token);
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
    const deletionResult = await serialActions.deleteSerial(req.query.serialId, req.user.token);
    res.json(deletionResult);
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
    const update = serialActions.editSerial(req.body, req.query.serialId, req.user.token);
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
