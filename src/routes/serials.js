const express = require("express");
// const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;
const Serial = require("../database/mongo/Serial");
const _ = require("lodash");
const router = express.Router();
const User = require("../database/mongo/User");

router.post("/:userId", async function(req, res){
  try{
    const newSerial = new Serial({
      title: req.body.title,
      synopsis: req.body.synopsis,
      genre: req.body.genre,
      description: req.body.description,
      nsfw: req.body.nsfw,
      creation_date: Date.now(),
      author_id: req.session.passport.user,
      slug: _.kebabCase(req.body.title)
    });

    await newSerial.save()
      .catch(e => {
        throw e;
      });

    res.json(newSerial);
  } catch(e){
    res.send("Something went wrong");
  }
});

router.get("/:userId", async function(req, res) {
  const author = await User.findOne({username: req.params.userId});
  const serials = await Serial.find({author_id: author._id});
  res.render("serials-user", {
    userLoggedIn: req.userLoggedIn,
    userSerials: serials,
    author: author.username
  });
});

module.exports = router;
