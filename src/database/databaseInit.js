const Role = require("./mongo/Role");
const userActions = require("./actions/user");
const Config = require("../config/config").getConfig();

/**
 * Called when the server is started with an empty database
 * Creates roles and one admin user
 */
const databaseInit = async () => {
  try {
    const adminUser = await userActions.addNewUser({
      username: Config.security.adminUsername,
      password: Config.security.adminPassword,
      birthdate: Config.security.adminBirthdate,
      role: 2,
    });
    return await adminUser.save();
  } catch (e) {
    throw e;
  }
};

module.exports = databaseInit;
