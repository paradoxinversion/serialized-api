const Config = require("./config/config").getConfig();
const { ApolloServer } = require("apollo-server-express");
console.log(process.env.NODE_ENV);
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const api = require("./routes/v1");
const mongoClient = require("./database/client");
const TokenManager = require("./tokens/jwt");
const User = require("./database/mongo/User");
const seedDb = require("./database/testUtilities/seedDb");
const { typeDefs, resolvers } = require("./apollo/index");
const doApp = async () => {
  try {
    const app = express();

    const tokenManager = new TokenManager("test", "test", {
      expiresIn: "14 days",
    });
    app.locals.tokenManager = tokenManager;
    app.use(morgan("dev"));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.text());
    app.use(cookieParser());
    // Handle initial db setup
    const dbClient = await mongoClient();
    if (process.env.NODE_ENV === "development") {
      try {
        await dbClient.connection.db.dropDatabase();
        await seedDb();
      } catch (e) {
        throw e;
      }
    }
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.header("Access-Control-Allow-Credentials", true);
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, GET, DELETE, OPTIONS"
      );
      next();
    });

    app.use("/api/v1", api);

    app.use(function (error, req, res, next) {
      res.status(error.status || 500);
      res.json({
        error: {
          message: error.message,
        },
      });
      next(error);
    });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }) => {
        const token = req.headers.authorization || "";
        if (token) {
          const verifiedToken = app.locals.tokenManager.verify(token, "test");
          const user = await User.findById(verifiedToken.sub);
          return { user, tokenManager: app.locals.tokenManager };
        } else {
          return { user: null, tokenManager: app.locals.tokenManager };
        }
      },
    });

    server.applyMiddleware({ app });

    // server.listen().then(({ url }) => {
    //   console.log(`Server ready at ${url}`);
    // });

    app.listen(Config.server.port, () => {
      console.log(
        `Server started at ${Config.server.port}. GraphQL endpoint is ${server.graphqlPath}`
      );
    });
    return app;
  } catch (e) {
    throw e;
  }
};

const app = doApp();

module.exports = app;
