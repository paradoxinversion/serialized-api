// config.js
import path from "path";

module.exports = (()=>{
  let config = {};

  const getEnv = () =>{
    return process.env.NODE_ENV;
  };
  const makeConfig = () => {
    if (getEnv() === 'development'){
      require('dotenv').config({path:path.join(__dirname, "../.env")});
    }

    config = {
      db: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME
      },
      security: {
        tokensecret: process.env.TOKEN_SECRET
      }
    };
    return config;
  };

  const getConfig = () =>{
    return config;
  };

  makeConfig();
  return {
    getEnv,
    getConfig,
  };

})();
