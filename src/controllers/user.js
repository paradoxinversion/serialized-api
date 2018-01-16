import User from "../database/mongo/User";
import Role from "../database/mongo/Role";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as userActions from "../database/actions/user";
const Config = require('../config/config').getConfig();


const getRole = async function (userId){
  const user = await User.findOne({_id:userId}).populate("role");
  if (!user){
    const userNotFoundError = new Error("User Not Found");
    throw userNotFoundError;
  }
  return {
    role: user.role.role,
    access: user.role.accessLevel
  };
};
const getUsers = async function getUsers(req, res){
  res.json(await userActions.getAllUsers());
};

const postUser = async function postUser(req, res){
  try{
    const newUser = await userActions.addNewUser(req.body);
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
    // if (!req.body.username){
    //   const noUserError = new Error("No username was included in the update request");
    //   throw noUserError;
    // }
    // const valuesToUpdate = {};
    // if (req.body['first-name']) valuesToUpdate.firstName = req.body['first-name'];
    // if (req.body['last-name']) valuesToUpdate.lastName = req.body['last-name'];
    // if (req.body.biography) valuesToUpdate.biography = req.body.biography;
    // if (Object.keys(valuesToUpdate).length === 0){
    //   const noUpdateError = new Error("No valid fields were included in the update request");
    //   throw noUpdateError;
    // }
    // console.log(valuesToUpdate)
    // const query = {username: req.body.username};
    // const update = await User.findOneAndUpdate(query, valuesToUpdate);
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
    const token = jwt.verify(req.user.token, Config.security.tokensecret);

    //XXX: This implementation uses the token to detrmine which user to delete
    // As such, if someone tries to delete with a randomized token that
    // happens to match something, that thing may get delete
    // Need to figure out how to prevent that...
    const deletionResult = await User.remove({_id: token.id});
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
  deleteUser,
  getRole
};
