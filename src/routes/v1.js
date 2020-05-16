const express = require("express");
const userController = require("../controllers/user");
const serialController = require("../controllers/serial");
const serialPartController = require("../controllers/serialPart");
const authController = require("../controllers/auth");
const likesController = require("../controllers/likes");
const genreController = require("../controllers/genre");
const moderationController = require("../controllers/moderation");
const userIsAdministrator = require("../middleware/userIsAdministrator");
const verifyUser = require("../middleware/verifyUser");
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

const router = express.Router();
router.route("/test").get((req, res) => {
  return res.status(200).send("OK");
});
router
  .route("/users")
  .get(userController.getUsers) //Get all
  .post(userController.postUser) // Post New
  .patch(verifyUser, userController.updateUser) // Update User
  .delete(verifyUser, userIsAdministrator, userController.deleteUser); // Delete User

// ! These route might be useless with jwts ---
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
// ! End of possibly useless routes ---

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
  .route("/serial-subscriptions/")
  .get(verifyUser, serialController.getUserSerialSubscriptions);

router
  .route("/serial-subscriptions/:serialId/")
  .get(verifyUser, serialController.toggleSerialSubscription);

router
  .route("/serial-subscriptions/:serialId/check")
  .get(serialController.checkForUserSubscription);

router
  .route("/like")
  .get(likesController.getLikes)
  .post(verifyUser, likesController.toggleLike);

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
