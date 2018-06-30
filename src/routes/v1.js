import express from "express";
import * as userController from "../controllers/user";
import * as serialController from "../controllers/serial";
import * as serialPartController from "../controllers/serialPart";
import * as authController from "../controllers/auth";
import * as likesController from "../controllers/likes";
// import logSession from "../middleware/logSession";
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

const router = express.Router();
// router.use(logSession);
router
  .route("/users")
  .get(userController.getUsers) //Get all
  .post(userController.postUser) // Post New
  .put(ensureLoggedIn(), userController.updateUser) // Update User
  .delete(ensureLoggedIn(), userController.deleteUser); // Delete User

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

module.exports = router;
