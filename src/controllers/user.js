
import * as userActions from "../database/actions/user";

const getUsers = async function getUsers(req, res){
  res.json(await userActions.getAllUsers());
};

const postUser = async function postUser(req, res){
  try{
    await userActions.addNewUser(req.body);
    res.json({status: 200});
  } catch (error){
    return res.json({
      status: error.statusCode,
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

const updateUser = async function updateUser(req, res){
  try{
    const update = await userActions.updateUser(req.body);
    res.json(update);
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

const attemptUserAuthentication = async function attemptUserAuthentication(req, res){
  try{
    if (!req.user.token){
      const tokenGrantError = new Error(`There was an error granting a token for ${req.user.username}`);
      throw tokenGrantError;
    }
    res.json({
      token: req.user.token
    });
  } catch(e){
    throw e;
  }
};

const deleteUser = async function deleteUser(req, res){
  try{
    const deletionResult = userActions.deleteUser(req.user.token);
    res.send(deletionResult);
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
export{
  getUsers,
  postUser,
  updateUser,
  attemptUserAuthentication,
  deleteUser
};
