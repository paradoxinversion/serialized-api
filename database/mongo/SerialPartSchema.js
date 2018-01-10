const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SerialPartSchema = new Schema({
  title: String,
  content: String,
  creation_date: Date,
  author_id: String,
  slug: String
});

SerialPartSchema.methods.createNewSerial = function(serial, authorId){
  const newSerial = new SerialPartSchema({
    title: serial.title,
    synopsis: serial.synopsis,
    genre: serial.genre,
    description: serial.description,
    nsfw: serial.nsfw,
    creation_date: Date.now(),
    author_id: authorId
  });

  return newSerial.save()
    .catch(e => {
      throw e;
    });
};

module.exports = SerialPartSchema;
