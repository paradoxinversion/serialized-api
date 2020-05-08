const express = require("express");
const userController = require("../controllers/user");
const serialController = require("../controllers/serial");
const serialPartController = require("../controllers/serialPart");
const authController = require("../controllers/auth");
const likesController = require("../controllers/likes");
const genreController = require("../controllers/genre");
const moderationController = require("../controllers/moderation");
const userIsAdministrator = require("../middleware/userIsAdministrator");
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

const router = express.Router();
router
  .route("/users")
  .get(userController.getUsers) //Get all
  .post(userController.postUser) // Post New
  .put(ensureLoggedIn(), userController.updateUser) // Update User
  .delete(ensureLoggedIn(), userController.deleteUser); // Delete User

router
  .route("/users/register/check")
  .get(authController.checkUserRegistrationData);

router
  .route("/users/auth")
  .post(
    authController.tryAuthenticateLocal,
    userController.attemptUserAuthentication
  ) //Authenticate User
  .get(authController.checkAuthentication);
router.route("/users/auth/logout").get(userController.logOut);
router.route("/users/:username").get(userController.getUser);

router
  .route("/serials")
  .get(serialController.getSerials) // Get All Serials
  .post(ensureLoggedIn(), serialController.postSerial)
  .delete(ensureLoggedIn(), serialController.deleteSerial)
  .put(ensureLoggedIn(), serialController.editSerial);

router
  .route("/serials/:serialId")
  .get(serialPartController.getSerialParts)
  .post(ensureLoggedIn(), serialPartController.postSerialPart)
  .put(ensureLoggedIn(), serialPartController.editSerialPart);

router
  .route("/serials/:serialId/:partId")
  .get(serialPartController.getSingleSerialPart)
  .delete(ensureLoggedIn(), serialPartController.deleteSerialPart)
  .put(ensureLoggedIn(), serialPartController.updateSerialPartNumber);

router
  .route("/serial-subscriptions/")
  .get(ensureLoggedIn(), serialController.getUserSerialSubscriptions);

router
  .route("/serial-subscriptions/:serialId/")
  .get(ensureLoggedIn(), serialController.toggleSerialSubscription);

router
  .route("/serial-subscriptions/:serialId/check")
  .get(serialController.checkForUserSubscription);

router
  .route("/like")
  .get(likesController.getLikes)
  .post(ensureLoggedIn(), likesController.toggleLike);

router
  .route("/genre")
  .get(genreController.getAll)
  .post(ensureLoggedIn(), userIsAdministrator, genreController.create)
  .put(ensureLoggedIn(), userIsAdministrator, genreController.update)
  .delete(ensureLoggedIn(), userIsAdministrator, genreController.deleteOne);

router
  .route("/report")
  .get(ensureLoggedIn(), userIsAdministrator, moderationController.getReports)
  .post(ensureLoggedIn(), moderationController.createReport);

module.exports = router;
