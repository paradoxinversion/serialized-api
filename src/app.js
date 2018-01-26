import "babel-polyfill";

import express from 'express';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import passport from 'passport';
import cookieParser from "cookie-parser"

import mongoClient from './database/client';
const session = require("express-session")
const Config = require('./config/config').getConfig();

const api = require("./routes/v1");

const app = express();

const userLoggedIn = require("./middleware/userLoggedIn");

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(cookieParser());

app.use(session(
  {
    secret: Config.security.sessionSecret,
    resave: "true",
    saveUninitialized: "false"
  }
));
app.use(passport.initialize());
app.use(passport.session());

mongoClient();
app.use(userLoggedIn);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/api/v1", api);

app.use(function(req, res, next){
  const err = new Error("Resource not Found");
  err.status = 404;
  next(err);
});

app.use(function(error, req, res, next){
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  });
  next(error);
});

app.listen(Config.server.port, function(){
  console.log(`API Running on port ${Config.server.port}`);
});
