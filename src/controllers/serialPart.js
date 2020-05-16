const SerialPart = require("../database/mongo/SerialPart");
const Serial = require("../database/mongo/Serial");
const serialPartActions = require("../database/actions/serialPart");
const _ = require("lodash");

// these routes all have a query param /:serialId

/**
 * Return all parts in a serial
 */
const getSerialParts = async (req, res) => {
  try {
    const parentSerialId = req.params.serialId;
    const serial = await Serial.findById(parentSerialId).populate("author");

    const serialParts = await SerialPart.find({
      parent_serial: parentSerialId,
    }).sort({ part_number: 1 });
    const response = {
      data: serialParts.map((serialPart) => {
        const {
          title,
          content,
          creation_date,
          last_modified,
          slug,
          part_number,
        } = serialPart;
        debugger;
        return {
          type: "serialPart",
          id: serialPart.id,
          attributes: {
            title,
            content,
            creation_date,
            last_modified,
            slug,
            part_number,
          },
        };
      }),
      relationships: {
        parent_serial: {
          data: {
            id: serial.parent_serial,
            type: "serial",
          },
        },
        author: {
          data: {
            id: serial.author,
            type: "user",
          },
        },
      },
    };
    res.status(200).type("application/vnd.api+json").json(response);
  } catch (error) {
    console.log("E", error);
    return res.json({
      status: error.statusCode,
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};

const getSingleSerialPart = async (req, res) => {
  try {
    const serialPart = await serialPartActions.getSingleSerialPart(
      req.params.partId
    );
    res.status(200).type("application/vnd.api+json").json(serialPart);
  } catch (e) {
    return res.status(400).json({
      error: [e],
    });
  }
};

const postSerialPart = async (req, res) => {
  try {
    const {
      id,
      title,
      content,
      slug,
      creation_date,
      last_modified,
      part_number,
      author,
      parent_serial,
    } = await serialPartActions.createSerialPart({
      title: req.body.title,
      content: req.body.content,
      parentSerial: req.params.serialId,
      author: req.authenticatedUser.id,
    });
    const response = {
      data: {
        type: "serialPart",
        id: id,
        attributes: {
          title,
          content,
          slug,
          creation_date,
          last_modified,
          part_number,
        },
      },
      relationships: {
        author: {
          data: {
            type: "user",
            id: author.id,
          },
        },
        parent_serial: {
          data: {
            type: "serial",
            id: parent_serial.id,
          },
        },
      },
    };
    res.status(201).type("application/vnd.api+json").json(response);
  } catch (error) {
    return res
      .status(400)
      .type("application/vnd.api+json")
      .json({
        error: [error],
      });
  }
};

const deleteSerialPart = async (req, res) => {
  try {
    const deletionResult = await serialPartActions.deleteSerialPart(
      req.params.partId,
      req.authenticatedUser.id
    );
    debugger;
    const response = {
      data: {
        id: deletionResult.id,
        type: "serialPart",
      },
    };
    res.status(200).type("application/vnd.api+json").json(response);
  } catch (e) {
    return res.type(400).json({
      error: [e],
    });
  }
};

const editSerialPart = async (req, res) => {
  try {
    // make sure to ensure the authorized user is allowed to do this
    const { title, content, partId } = req.body;
    const updateResult = await serialPartActions.updateSerialPart({
      title,
      content,
      partId,
    });

    const response = {
      data: {
        type: "serialPart",
        id: updateResult.id,
        attributes: {
          title: updateResult.title,
          content: updateResult.content,
          slug: updateResult.slug,
          creation_date: updateResult.creation_date,
          last_modified: updateResult.last_modified,
          part_number: updateResult.part_number,
        },
      },
      relationships: {
        author: {
          data: {
            type: "user",
            id: updateResult.author.id,
          },
        },
        parent_serial: {
          data: {
            type: "serial",
            id: updateResult.parent_serial.id,
          },
        },
      },
    };
    debugger;
    res.status(200).type("application/vnd.api+json").json(response);
  } catch (error) {
    return res
      .status(400)
      .type("application/vnd.api+json")
      .json({
        error: [e],
      });
  }
};

const updateSerialPartNumber = async (req, res) => {
  try {
    const {
      id,
      title,
      content,
      slug,
      creation_date,
      last_modified,
      part_number,
      author,
      parent_serial,
    } = await serialPartActions.updateSerialPartNumber({
      serialPartId: req.params.partId,
      moveUp: req.body.moveUp,
      userId: req.authenticatedUser.id,
    });
    const response = {
      data: {
        type: "serialPart",
        id: id,
        attributes: {
          title,
          content,
          slug,
          creation_date,
          last_modified,
          part_number,
        },
      },
      relationships: {
        author: {
          data: {
            type: "user",
            id: author.id,
          },
        },
        parent_serial: {
          data: {
            type: "serial",
            id: parent_serial.id,
          },
        },
      },
    };
    res.status(200).type("application/vnd.api+json").json(response);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getSerialParts,
  postSerialPart,
  deleteSerialPart,
  editSerialPart,
  getSingleSerialPart,
  updateSerialPartNumber,
};
