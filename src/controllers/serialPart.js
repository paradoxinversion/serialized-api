import SerialPart from "../database/mongo/SerialPart";
import Serial from "../database/mongo/Serial";
import * as serialPartActions from "../database/actions/serialPart";
const _ = require("lodash");

// these routes all have a query param /:serialId

/**
 * Return all parts in a serial
 */
const getSerialParts = async (req, res) => {
  try{
    const serial = await Serial.findOne({_id: req.params.serialId}).populate("author_id");
    const serialParts = await SerialPart.find({serial_id: req.params.serialId});
    res.json({serial, serialParts});
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

const getSingleSerialPart = async (req, res) => {
  try{
    res.json(await serialPartActions.getSingleSerialPart(req.params.serialId, req.params.partId));
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
    const newPart = await serialPartActions.createSerialPart(req.body, req.params.serialId);
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
    const deletionResult = serialPartActions.deleteSerialPart(req.params.partId, req.session.passport.user);
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
  editSerialPart,
  getSingleSerialPart
};
