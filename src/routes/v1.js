const express = require("express");
const userController = require("../controllers/user");
const serialController = require("../controllers/serial");
const serialPartController = require("../controllers/serialPart");
const likesController = require("../controllers/likes");
const genreController = require("../controllers/genre");
const moderationController = require("../controllers/moderation");
const subscriptionController = require("../controllers/subscription");
const authorizationController = require("../controllers/authorization");
const userIsAdministrator = require("../middleware/userIsAdministrator");
const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

router.route("/log-in").post(authorizationController.logIn);

router
  .route("/users")
  .get(userController.getUsers) //Get all
  .post(userController.postUser) // Post New
  .patch(verifyUser, userController.updateUser) // Update User
  .delete(verifyUser, userIsAdministrator, userController.deleteUser); // Delete User

router.route("/users/:username").get(userController.getUser);

router
  .route("/serials")
  .get(serialController.getSerials) // Get All Serials
  .post(verifyUser, serialController.postSerial)
  .delete(verifyUser, serialController.deleteSerial)
  .patch(verifyUser, serialController.editSerial);

router
  .route("/serials/:serialId")
  .get(serialPartController.getSerialParts)
  .post(verifyUser, serialPartController.postSerialPart)
  .patch(verifyUser, serialPartController.editSerialPart);

router
  .route("/serials/:serialId/:partId")
  .get(serialPartController.getSingleSerialPart)
  .delete(verifyUser, serialPartController.deleteSerialPart)
  .patch(verifyUser, serialPartController.updateSerialPartNumber);

router
  .route("/serial-subscriptions/:serialId/")
  .post(verifyUser, subscriptionController.createSubscription)
  .delete(verifyUser, subscriptionController.removeSubscription);

router
  .route("/like")
  .get(likesController.getLikes)
  .post(verifyUser, likesController.createLike);

router
  .route("/genre")
  .get(genreController.getAll)
  .post(verifyUser, userIsAdministrator, genreController.create)
  .put(verifyUser, userIsAdministrator, genreController.update)
  .delete(verifyUser, userIsAdministrator, genreController.deleteOne);

router
  .route("/report")
  .get(verifyUser, userIsAdministrator, moderationController.getReports)
  .post(verifyUser, moderationController.createReport);

module.exports = router;
