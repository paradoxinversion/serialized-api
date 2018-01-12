import SerialPart from '../database/mongo/SerialPart';
import Serial from '../database/mongo/Serial';
import * as jwt from "jsonwebtoken";

const Config = require('../config/config').getConfig();
const _ = require("lodash");

// these routes all have a query param /:serialId

/**
 * Return all parts in a serial
 */
const getSerialParts = async (req, res) => {
  try{

    const serialParts = await SerialPart.find({serial_id: req.params.serialId});
    res.json(serialParts);
  } catch (error) {
    return res.json({
      status: error.statusCode,
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

const postSerialPart = async (req, res) => {
  try{
    // const serial = await Serial.find({_id: req.params.serialId});
    const newPart = new SerialPart({
      title: req.body.title,
      content: req.body.content,
      creation_date: Date.now(),
      serial_id: req.params.serialId,
      slug: _.kebabCase(req.body.title)
    });

    await newPart.save();

    res.json(newPart);
  } catch (error) {
    return res.json({
      status: error.statusCode,
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

const deleteSerialPart = async (req, res) => {
  try{
    const token = jwt.verify(req.user.token, Config.security.tokensecret);
    if (!req.query.partId){
      const noIdError = new Error("No serial part ID supplied for delete operation.");
      throw noIdError;
    }
    const serialPart = await SerialPart.findOne({_id: req.query.partId}).populate('serial_id');
    if (token.id == serialPart.serial_id.author_id){
      const deletionResult = await SerialPart.remove({_id: req.query.partId});
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

const editSerialPart = async (req, res) => {
  try{
    if (!req.query.partId){
      const noPartIdError = new Error("No partId was included in the update request");
      throw noPartIdError;
    }
    const valuesToUpdate = {};
    if (req.body.title){
      valuesToUpdate.title = req.body.title;
      valuesToUpdate.slug = _.kebabCase(req.body.title);
    }
    if (req.body.content) valuesToUpdate.content = req.body.content;
    if (Object.keys(valuesToUpdate).length === 0){
      const noUpdateError = new Error("No valid fields were included in the update request");
      throw noUpdateError;
    }
    const query = {_id:req.query.partId};
    const update = await SerialPart.findOneAndUpdate(query, valuesToUpdate);
    res.json(update);
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

export {
  getSerialParts,
  postSerialPart,
  deleteSerialPart,
  editSerialPart
};
