const serialActions = require("../database/actions/serial");
const User = require("../database/mongo/User");
/**
 * Get a list of serials. If there is a userId query, gets only serials by that user.
 */
const getSerials = async (req, res) => {
  try {
    let serials;
    if (req.query.userId) {
      serials = await serialActions.getAuthorSerials(req.query.userId);
    } else {
      if (!req.authenticatedUser) {
        serials = await serialActions.getSerials(false);
      } else {
        try {
          const user = await User.findById(req.authenticatedUser.id);
          serials = await serialActions.getSerials(user.viewNSFW);
        } catch (e) {
          serials = await serialActions.getSerials(false);
        }
      }
    }

    const response = {
      data: serials.map((serial) => {
        return {
          type: "serial",
          id: serial.id,
          attributes: {
            title: serial.title,
            synopsis: serial.synopsis,
            slug: serial.slug,
            nsfw: serial.nsfw,
            creation_date: serial.creation_date,
          },
        };
      }),
    };
    res.status(200).type("application/vnd.api+json").json(response);
  } catch (error) {
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};

/**
 * Post a new serial
 */
const postSerial = async (req, res) => {
  try {
    const newSerial = await serialActions.createSerial({
      ...req.body,
      userId: req.authenticatedUser.id,
    });

    const response = {
      data: {
        type: "serial",
        id: newSerial.id,
        attributes: {
          title: newSerial.title,
          synopsis: newSerial.synopsis,
          slug: newSerial.slug,
          nsfw: newSerial.nsfw,
          creation_date: newSerial.creation_date,
        },
        relationships: {
          author: {
            data: {
              type: "user",
              id: newSerial.author,
            },
          },
          genre: {
            data: {
              type: "genre",
              id: newSerial.genre,
            },
          },
          serialParts: [],
        },
      },
    };

    return res.status(201).type("application/vnd.api+json").json(response);
  } catch (error) {
    return res.status(400).json({
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};

/**
 * Return a list of Serials by author id
 */
const getSerialsByAuthorId = async (req, res) => {
  try {
    const authorSerials = await serialActions.getAuthorSerials(
      req.query.userId
    );
    res.json(authorSerials);
  } catch (error) {
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};

/**
 *
 */
const deleteSerial = async (req, res) => {
  try {
    const deletionResult = await serialActions.deleteSerial(
      req.query.serialId,
      req.session.passport.user
    );
    res.json(deletionResult);
  } catch (error) {
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};

const editSerial = async (req, res) => {
  try {
    const update = await serialActions.editSerial(req.body);
    const response = {
      data: {
        type: "serial",
        id: update.id,
        attributes: {
          creation_date: update.creation_date,
          last_modified: update.last_modified,
          nsfw: update.nsfw,
          slug: update.slug,
          synopsis: update.synopsis,
          title: update.title,
        },
        relationships: {
          author: {
            data: {
              type: "user",
              id: update.author,
            },
          },
          genre: {
            data: {
              type: "genre",
              id: update.genre,
            },
          },
        },
      },
    };
    res.status(200).type("application/vnd.api+json").json(response);
  } catch (error) {
    return res
      .status(400)
      .type("application/vnd.api+json")
      .json({
        errors: [error],
      });
  }
};

const toggleSerialSubscription = async (req, res) => {
  try {
    const result = await serialActions.subscribeToSerial(
      req.params.serialId,
      req.session.passport.user
    );
    res.json(result);
  } catch (e) {
    return res.json({
      status: "400",
      error: {
        name: e.name,
        message: e.message,
      },
    });
  }
};

const checkForUserSubscription = async (req, res) => {
  try {
    let response;
    if (req.session.passport) {
      response = await serialActions.checkForUserSubscription(
        req.params.serialId,
        req.session.passport.user
      );
    } else {
      const noUserError = new Error("No user supplied");
      throw noUserError;
    }
    res.json(response);
  } catch (e) {
    return res.json({
      status: "400",
      error: {
        name: e.name,
        message: e.message,
      },
    });
  }
};

const getUserSerialSubscriptions = async (req, res) => {
  try {
    let response;
    if (req.session.passport) {
      response = await serialActions.getUserSerialSubscriptions(
        req.session.passport.user
      );
    } else {
      const noUserError = new Error("No user supplied");
      throw noUserError;
    }
    res.json(response);
  } catch (e) {
    return res.json({
      status: "400",
      error: {
        name: e.name,
        message: e.message,
      },
    });
  }
};
module.exports = {
  checkForUserSubscription,
  deleteSerial,
  editSerial,
  getSerials,
  getSerialsByAuthorId,
  getUserSerialSubscriptions,
  postSerial,
  toggleSerialSubscription,
};
