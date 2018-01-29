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
 *
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
