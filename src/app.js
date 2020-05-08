const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const mongoClient = require("./database/client");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const Config = require("./config/config").getConfig();

const api = require("./routes/v1");

const app = express();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

require("./middleware/userLoggedIn");

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(cookieParser(Config.security.sessionSecret));
mongoClient();
app.use(
  session({
    secret: Config.security.sessionSecret,
    resave: "true",
    saveUninitialized: "false",
    maxAge: 24 * 60 * 60,
    store: new MongoStore({
      url:
        process.env.MONGODB_URI ||
        `mongodb://${Config.db.host}/${Config.db.database}`,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  if (!req.secure) {
    next();
  } else {
    res.redirect("https://" + req.headers.host + req.url);
  }
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

// app.use(userLoggedIn);
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

app.listen(process.env.PORT || 3001);
