const serialActions = require("../database/actions/serial");
const User = require("../database/mongo/User");
const Serial = require("../database/mongo/Serial");
const SerialPart = require("../database/mongo/SerialPart");
const {
  createSerialResponse,
  createSerialsResponse,
  createApiResponse,
} = require("../utilities/responseHandler");
const getSerial = async (req, res) => {
  try {
    const author = await User.findOne({ username: req.params.authorUsername });
    const serial = await serialActions.getSerial(
      author.id,
      req.params.serialSlug
    );

    const includeResources = req.query.include.split(",");
    console.log(includeResources);
    // we'll want to check what the 'include' actually is
    // for now, we'll assume author
    let include = includeResources.includes("author")
      ? [
          {
            id: author.id,
            type: "user",
            attributes: {
              username: author.username,
            },
          },
        ]
      : null;
    if (includeResources.includes("serialParts")) {
      const parts = await SerialPart.find({ parent_serial: serial.id });
      const entries = parts.map((part) => {
        return {
          type: "serialPart",
          id: part.id,
          attributes: {
            title: part.title,
            synopsis: part.synopsis,
            slug: part.slug,
            content: part.content,
          },
          relationships: {
            author: {
              type: "user",
              id: author.id,
            },
          },
        };
      });
      if (!include) {
        include = entries;
      } else {
        include = include.concat(entries);
      }
    }

    if (serial) {
      const response = {
        data: {
          id: serial.id,
          type: "serial",
          attributes: {
            title: serial.title,
            synopsis: serial.synopsis,
            slug: serial.slug,
            nsfw: serial.nsfw,
            creation_date: serial.creation_date,
            last_modified: serial.last_modified,
          },
          relationships: {
            author: {
              id: serial.author.id,
              type: "user",
            },
          },
        },
      };

      if (req.query.include) {
        response.included = include;
      }
      return res.status(200).type("application/vnd.api+json").json(response);
    } else {
      throw new Error("No serial found");
    }
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
 * Get a list of serials. If there is a userId query, gets only serials by that user.
 */
const getSerials = async (req, res) => {
  try {
    const includes = req.query.include.split(",");
    const selectFields = req.query.fields
      ? Object.keys(req.query.fields).reduce((object, currentKey) => {
          object[currentKey] = req.query.fields[currentKey].split(",");
          return object;
        }, {})
      : null;
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

    const response = await createApiResponse(
      Serial,
      serials,
      selectFields,
      includes
    );

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
    const deletionResult = await serialActions.deleteSerial({
      serialId: req.query.serialId,
    });

    const response = {
      data: {
        id: deletionResult.deletedSerial.id,
        type: "serial",
      },
    };
    res.status(200).type("application/vnd.api+json").json(response);
  } catch (error) {
    return res
      .status(400)
      .type("application/vnd.api+json")
      .json({
        error: [error],
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
  getSerial,
};
