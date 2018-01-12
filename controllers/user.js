import User from "../database/mongo/User";
import Role from "../database/mongo/Role";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
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
  const userList = await User
    .find()
    .populate("role")
    .select({
      username: 1,
      firstName: 1,
      lastName: 1,
      biography: 1
    });

  res.json(userList);
};

const postUser = async function postUser(req, res){
  try{
    let hashedPassword;
    if (req.body.password){
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    } else{
      const noPasswordError = new Error("No password was included in the signup request");
      noPasswordError.statusCode = 400;
      throw noPasswordError;
    }
    const role = await Role.findOne({accessLevel: 0});
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body['first-name'],
      lastName: req.body['last-name'],
      birthdate: req.body.birthdate,
      joinDate: Date.now(),
      role: role._id
    });

    try{
      await newUser.save();
    } catch (e){
      // Handle validation/duplicate user errors here
      if (e.name === "MongoError" || e.code === 11000){
        const duplicateEmailError = new Error("User already exists with that email");
        duplicateEmailError.statusCode = 409;
        throw duplicateEmailError;
      } else if (e.name === "ValidationError"){
        const validatorError = new Error(e.message);
        validatorError.statusCode = 400;
        throw validatorError;
      }
    }

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
    if (!req.body.username){
      const noUserError = new Error("No username was included in the update request");
      throw noUserError;
    }
    const valuesToUpdate = {};
    if (req.body.firstName) valuesToUpdate.firstName = req.body.firstName;
    if (req.body.lastName) valuesToUpdate.lastName = req.body.lastName;
    if (req.body.biography) valuesToUpdate.biography = req.body.biography;
    if (Object.keys(valuesToUpdate).length === 0){
      const noUpdateError = new Error("No valid fields were included in the update request");
      throw noUpdateError;
    }
    const query = {username: req.body.username};
    const update = await User.findOneAndUpdate(query, valuesToUpdate);
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
    console.log(req.user.token);
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
