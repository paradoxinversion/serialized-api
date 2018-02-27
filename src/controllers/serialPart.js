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
    const serialParts = await SerialPart.find({serial_id: req.params.serialId}).sort({part_number: 1});
    const response = {serial, serialParts};
    console.log("Get Serial Parts::", response);
    res.json(response);
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
    const serialPart = await serialPartActions.getSingleSerialPart(req.params.partId);
    console.log("Get serial part", serialPart);
    res.json(serialPart);
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
    console.log("Post Serial Part::", newPart);
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
    console.log("Delete Serial Part::", deletionResult);
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
    console.log("Edit Serial Part", update);
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

const updateSerialPartNumber = async (req, res) => {
  try {
    console.log("PARAMS", req.params, req.body.moveUp, req.session.passport.user )
    const response = await serialPartActions.updateSerialPartNumber(req.params.partId, req.body.moveUp, req.session.passport.user);
    console.log("Update Serial Part Number::", response);
    res.json(response);
  } catch (e){
    console.log(e);
    throw e;
  }
}
export {
  getSerialParts,
  postSerialPart,
  deleteSerialPart,
  editSerialPart,
  getSingleSerialPart,
  updateSerialPartNumber
};
