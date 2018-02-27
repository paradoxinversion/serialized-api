import SerialPart from "../database/mongo/SerialPart";
import * as serialActions from "../database/actions/serial";

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
    console.log("Get Serials::", serials);
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
    const newSerial = await serialActions.postSerial(req.body, req.session.passport.user);
    console.log("Post Serial::", newSerial);
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
    console.log("Get Serials by Author::", authorSerials);
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
 *
 */
const deleteSerial = async (req, res) => {
  try{
    const deletionResult = await serialActions.deleteSerial(req.query.serialId, req.session.passport.user);
    console.log("Delete Serial::", deletionResult);
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
    console.log("Edit Serial::", update);
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
