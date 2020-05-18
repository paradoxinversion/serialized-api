const Subscription = require("../mongo/Subscription");

/**
 *
 * @param {*} user - the id of the user subscribing
 * @param {*} type - the type of resource being subbed to
 * @param {*} subject - the item being subbed to (at this point, should be a serial)
 */
const createSubscription = async (user, type, subject) => {
  try {
    const subscription = await new Subscription({
      subscriber: user,
      subscribed_object: subject,
      subscription_type: type,
    });
    return subscription;
  } catch (e) {
    throw e;
  }
};

const removeSubscription = async (subscriptionId) => {
  try {
    const removalResult = await Subscription.findByIdAndRemove(subscriptionId);
    return removalResult;
  } catch (e) {
    throw e;
  }
};

module.exports = { createSubscription, removeSubscription };
