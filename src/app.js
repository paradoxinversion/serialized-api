import "babel-polyfill";

import express from 'express';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import passport from 'passport';

import mongoClient from './database/client';
const api = require("./routes/v1");

const app = express();

const userLoggedIn = require("./middleware/userLoggedIn");

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());

app.use(passport.initialize());
app.use(passport.session());

mongoClient();
app.use(userLoggedIn);
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

app.listen(3000, function(){
  console.log("App Running");
});
