import * as userController from '../controllers/user';
import express from 'express';
import serials from "./serials";
const authController = require('../controllers/auth');
// const userController = require("../controller/user");

const router = express.Router();

router.route('/users')
  .get(userController.getUsers)
  .post(userController.postUser)
  .put(authController.isAuthenticatedBearer, userController.updateUser)
  .delete(authController.isAuthenticatedBearer, userController.deleteUser);
router.route('/users/auth')
  .post(authController.isAuthenticatedBasic, userController.attemptUserAuthentication);
module.exports = router;
