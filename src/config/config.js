// config.js
const path = require("path");

module.exports = (() => {
  let config = {};

  const getEnv = () => {
    return process.env.NODE_ENV;
  };
  const makeConfig = () => {
    require("dotenv").config();
    config = {
      db: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
      },
      security: {
        sessionSecret: process.env.SESSION_SECRET,
        adminUsername: process.env.ADMIN_USER,
        adminPassword: process.env.ADMIN_PASS,
        adminName: process.env.ADMIN_NAME,
        adminEmail: process.env.ADMIN_EMAIL,
        adminBirthdate: process.env.ADMIN_BIRTHDATE,
      },
      server: {
        port: process.env.API_PORT,
      },
    };
    return config;
  };

  const getConfig = () => {
    return config;
  };

  makeConfig();
  return {
    getEnv,
    getConfig,
  };
})();
