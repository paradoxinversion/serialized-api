const subscriptionActions = require("../database/actions/subscription");

const createSubscription = async (req, res) => {
  try {
    const { user, type, subject } = req.body;
    const subscription = await subscriptionActions.createSubscription({
      user,
      type,
      subject,
    });
    const response = {
      data: {
        id: subscription.id,
        type: "subscription",
        attributes: {
          subscription_type: subscription.subscription_type,
        },
        relationships: {
          subscriber: {
            id: subscription.subscriber.id,
            type: "user",
          },
          subscribed_object: {
            id: subscription.subscribed_object,
            type: "serialPart", // ! should should be dynamic, but we'll start with just serial parts
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
        errors: [e],
      });
  }
};

const removeSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const subscriptionRemoval = await subscriptionActions.removeSubscription({
      subscriptionId,
    });
    const response = {
      data: {
        id: subscriptionRemoval.id,
        type: "subscription",
        attributes: {
          subscription_type: "serial",
        },
        relationships: {
          subscriber: {
            id: subscriptionRemoval.subscriber,
            type: "user",
          },
          subscribed_object: {
            id: subscriptionRemoval.subscribed_object,
            type: "serial",
          },
        },
      },
    };
    return res.status(200).type("application/vnd.api+json").json(response);
  } catch (e) {
    return res
      .status(400)
      .type("application/vnd.api+json")
      .json({
        errors: [e],
      });
  }
};

module.exports = {
  createSubscription,
  removeSubscription,
};
