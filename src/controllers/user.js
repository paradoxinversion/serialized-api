const userActions = require("../database/actions/user");
const Serial = require("../database/mongo/Serial");
const { createUserResponse } = require("../utilities/responseHandler");
/**
 * Returns all users
 * @param {*} req
 * @param {*} res
 */
const getUsers = async function getUsers(req, res) {
  const users = await userActions.getAllUsers(req.query.user);
  const userData = users.users.map((user) => {
    return {
      type: "user",
      id: user._id,
      attributes: {
        username: user.username,
        biography: user.biography,
      },
    };
  });
  const response = {
    data: userData,
    links: users.links,
  };

  res.type("application/vnd.api+json").status(200).json(response);
};

/**
 * Handles retrieving a single user from the API
 * @param {*} req
 * @param {*} res
 */
const getUser = async function getUser(req, res) {
  const queryResult = await userActions.getUser(req.params.username);

  const fields = req.query.fields;

  let response = await createUserResponse(
    queryResult.id,
    fields.user.split(",") || null
  );

  if (req.query.include) {
    const serials = await Serial.find({ author: queryResult.id });
    const included = serials.map((serial) => {
      return {
        id: serial.id,
        type: "serial",
        attributes: {
          title: serial.title,
          synopsis: serial.synopsis,
          slug: serial.slug,
        },
        relationships: {
          author: {
            id: queryResult.id,
            type: "user",
          },
        },
      };
    });

    response.includes = included;
  }
  res.status(200).type("application/vnd.api+json").json(response);
};

/**
 * Attempts to post a new user to the database.
 * @param {*} req
 * @param {*} res
 */
const postUser = async function postUser(req, res) {
  try {
    const newUser = await userActions.addNewUser({ ...req.body, role: 0 });

    const response = {
      data: {
        type: "user",
        id: newUser.id,
        attributes: {
          username: newUser.username,
        },
      },
    };
    res.status(201).type("application/vnd.api+json").json(response);
  } catch (error) {
    const response = {
      errors: [error],
    };
    return res.status(400).type("application/vnd.api+json").json(response);
  }
};

const updateUser = async function updateUser(req, res) {
  try {
    const update = await userActions.updateUser({
      ...req.body,
      userId: req.authenticatedUser._id,
    });
    if (!update) {
      const response = {
        data: {
          type: "user",
          id: req.authenticatedUser.id,
          attributes: {},
        },
      };
      return res.type("application/vnd.api+json").status(200).json(response);
    }

    const response = {
      data: {
        type: "user",
        id: req.authenticatedUser.id,
        attributes: {
          biography: update.biography,
          viewNSFW: update.viewNSFW,
        },
      },
    };
    return res.type("application/vnd.api+json").status(200).json(response);
  } catch (error) {
    return res
      .status(400)
      .type("application/vnd.api+json")
      .json({
        errors: [error],
      });
  }
};

const attemptUserAuthentication = async function attemptUserAuthentication(
  req,
  res
) {
  try {
    const authenticatedUser = {
      user: req.user,
    };

    res.json(authenticatedUser);
  } catch (e) {
    throw e;
  }
};

const deleteUser = async function deleteUser(req, res) {
  try {
    if (req.authenticatedUser.role === 1) {
      const deletionResult = await userActions.deleteUser(
        req.body.userToDelete
      );
      const response = {
        data: {
          type: "user",
          id: deletionResult.userId,
        },
      };
      res.status(200).type("application/vnd.api+json").send(response);
    } else {
      const unauthorizedActionError = new Error("Unauthorized Action");
      throw unauthorizedActionError;
    }
  } catch (error) {
    return res
      .type("application/vnd.api+json")
      .status(400)
      .json({
        errors: [error],
      });
  }
};

const logOut = async function logOut(req, res) {
  req.logOut();
  res.send("Bye bye");
};
module.exports = {
  getUsers,
  getUser,
  postUser,
  updateUser,
  deleteUser,
  attemptUserAuthentication,
  logOut,
};
