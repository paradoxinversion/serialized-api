import "babel-polyfill";
import path from "path";
import express from "express";
import morgan from "morgan";
import * as bodyParser from "body-parser";
import passport from "passport";
import cookieParser from "cookie-parser";

import mongoClient from "./database/client";
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const Config = require("./config/config").getConfig();

const api = require("./routes/v1");

const app = express();
if (process.env.NODE_ENV === "production"){
  console.log("using static dir")
  app.use(express.static(path.join(__dirname, "../client/build")));
}

const userLoggedIn = require("./middleware/userLoggedIn");

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(cookieParser(Config.security.sessionSecret));
mongoClient();
app.use(session(
  {
    secret: Config.security.sessionSecret,
    resave: "true",
    saveUninitialized: "false",
    maxAge: 24 * 60 * 60,
    store: new MongoStore({ url: `mongodb://${Config.db.host}/${Config.db.database}` })
  }
));
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
// app.use(userLoggedIn);
app.use("/api/v1", api);


if (process.env.NODE_ENV === "production"){
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
} else {
  app.use(function(req, res, next){
    const err = new Error("Resource not Found");
    err.status = 404;
    next(err);
  });
}



app.use(function(error, req, res, next){
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  });
  next(error);
});
// app.listen(process.env.PORT || Config.server.port, () => {console.log(`running on port ${app.port}`)});
app.listen(process.env.PORT || 3001);
