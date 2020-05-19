# Subscription

Represents a user's subscription to an object (such as a serial or comment/thread in the future), allowing them to be notified when there are unseen updates.

This will be further implemented after MVP.

## subscriber (ObjectId:User)*

The id of the user subscribing to the serial

## subscribed_object (ObjectId)*

The id of the object being subscribed to

## subscription_type (String)*

The type of object being subscribed to