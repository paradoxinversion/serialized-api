import Role from "./mongo/Role";
import * as userActions from "./actions/user";
const Config = require("../config/config").getConfig();

/**
 * Called when the server is started with an empty database
 * Creates roles and one admin user
 */
const databaseInit = async () => {
  try {
    // Create Roles
    const roles = [
      { role: "Reader", accessLevel: 0 },
      { role: "Author", accessLevel: 1 },
      { role: "Administrator", accessLevel: 2 }
    ];
    await Role.insertMany(roles);

    const adminUser = await userActions.addNewUser({
      email: Config.security.adminEmail || process.env.ADMIN_EMAIL,
      username: Config.security.adminUsername || process.env.ADMIN_USER,
      firstName: Config.security.adminName || process.env.ADMIN_NAME,
      lastName: Config.security.adminName || process.env.ADMIN_NAME,
      password: Config.security.adminPassword || process.env.ADMIN_PASS,
      birthdate: Config.security.adminBirthdate || process.env.ADMIN_BIRTHDATE
    });
    await adminUser.save();
    const adminUpdateAction = await userActions.changeUserRole(
      adminUser._id,
      2
    );
    if (adminUpdateAction) {
      console.log("Administrator role update succeeded");
    } else {
      console.log("Administrator role update failed");
    }
  } catch (e) {
    console.log(e);
  }
};

export default databaseInit;
