const mongoose = require("mongoose");
const User = require("./mongo/User");
const databaseInit = require("./databaseInit");
const startClient = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/serialized_api_dev",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const user = await User.findOne({ role: 2 });
    console.log(user);
    if (!user) {
      await databaseInit();
    }
  } catch (error) {
    throw error;
  }
};
module.exports = startClient;
