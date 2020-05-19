const likeActions = require("../database/actions/likes");

const createLike = async (req, res) => {
  try {
    const result = await likeActions.createLike(
      req.authenticatedUser.id,
      req.body.likeType,
      req.body.subject
    );
    const response = {
      data: {
        id: result.id,
        type: "like",
        attributes: {
          like_type: result.like_type,
        },
        relationships: {
          subject: {
            id: result.subject,
            type: "serial",
          },
          user: {
            id: result.user,
            type: "user",
          },
        },
      },
    };
    res.status(201).type("application/vnd.api+json").json(response);
  } catch (e) {
    res
      .status(400)
      .type("application/vnd.api+json")
      .json({
        error: [e],
      });
  }
};

const getLikes = async (req, res) => {
  try {
    debugger;
    const result = await likeActions.getItemLikes(
      req.query.like_type,
      req.query.itemId
    );
    const response = {
      data: result.map((like) => {
        return {
          id: like.id,
          type: "like",
          attributes: {
            like_type: like.like_type,
          },
          relationships: {
            subject: {
              id: like.subject,
              type: "serial",
            },
            user: {
              id: like.user,
              type: "user",
            },
          },
        };
      }),
    };
    return res.status(201).type("application/vnd.api+json").json(response);
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .type("application/vnd.api+json")
      .json({ errors: [e] });
  }
};

module.exports = {
  createLike,
  getLikes,
};
