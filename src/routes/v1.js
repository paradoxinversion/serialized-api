import express from 'express';
import * as userController from '../controllers/user';
import * as serialController from '../controllers/serial';
import * as serialPartController from '../controllers/serialPart';
import * as authController from '../controllers/auth';

const router = express.Router();

router.route('/users')
  .get(userController.getUsers)
  .post(userController.postUser)
  .put(authController.isAuthenticatedBearer, userController.updateUser)
  .delete(authController.isAuthenticatedBearer, userController.deleteUser);

router.route('/users/auth')
  .post(authController.isAuthenticatedBasic, userController.attemptUserAuthentication);

router.route('/serials')
  .get(serialController.getSerials)
  .post(authController.isAuthenticatedBearer, serialController.postSerial)
  .delete(authController.isAuthenticatedBearer, serialController.deleteSerial)
  .put(authController.isAuthenticatedBearer, serialController.editSerial);

router.route('/serials/:serialId')
  .get(serialPartController.getSerialParts)
  .post(serialPartController.postSerialPart)
  .delete(authController.isAuthenticatedBearer, serialPartController.deleteSerialPart)
  .put(authController.isAuthenticatedBearer, serialPartController.editSerialPart);

module.exports = router;
