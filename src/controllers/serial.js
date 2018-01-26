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
 * Get a list of serials. If there is a userId query, gets only serials by that user.
 */
const getSerials = async (req, res) => {
  try{
    let serials;
    if (req.query.userId){
      serials = await serialActions.getAuthorSerials(req.query.userId);
      if (req.session.passport && req.session.passport.user === req.query.userId){
        serials.clientOwnsSerials = true;
      }
    } else {
      serials = await serialActions.getSerials();
      serials.clientOwnsSerials = false;
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

  console.log(req.body)
  try{
    const newSerial = await serialActions.postSerial(req.body, req.session.passport.user);
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
    const authorSerials = await serialActions.getAuthorSerials(req.query.userId);
    res.json(authorSerials);
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
    const deletionResult = await serialActions.deleteSerial(req.query.serialId, req.session.passport.user);
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
    const update = serialActions.editSerial(req.body, req.query.serialId, req.session.passport.user);
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
