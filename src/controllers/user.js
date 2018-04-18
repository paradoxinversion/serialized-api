import * as userActions from "../database/actions/user";

const getUsers = async function getUsers(req, res){
  const queryResult = await userActions.getAllUsers(req.query.user);
  let response = {
    userData: queryResult,
    isQueriedUser: false
  };
  res.json(response);
};

const getUser = async function getUser(req, res){
  const queryResult = await userActions.getUser(req.params.username);
  let response = {
    userData: queryResult,
    isQueriedUser: false
  };

  if (req.session.passport && req.session.passport.user == response.userData._id){
    response.isQueriedUser = true;
  }
  res.json(response);
};
const postUser = async function postUser(req, res){
  try{
    const newUser = await userActions.addNewUser(req.body);
    const response = {
      status: 200
    };
    res.json(response);
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
    const update = await userActions.updateUser(req.body, req.session.passport.user);
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
    const authenticatedUser = {
      user:req.user
    };

    console.log(req.session);
    console.log("REQ USER", req.user);
    res.json(authenticatedUser);
  } catch(e){
    throw e;
  }
};

const deleteUser = async function deleteUser(req, res){
  try{
    const deletionResult = userActions.deleteUser(req.user._id);
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

const logOut = async function logOut(req, res){
  req.logOut();
  res.send("Bye bye");
};
export{
  getUsers,
  getUser,
  postUser,
  updateUser,
  deleteUser,
  attemptUserAuthentication,
  logOut
};
