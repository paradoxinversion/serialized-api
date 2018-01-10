const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SerialSchema = new Schema({
  title: String,
  synopsis: String,
  genre: String,
  description: String,
  nsfw: Boolean,
  creation_date: Date,
  author_id: String,
  slug: String
});

SerialSchema.methods.createNewSerial = function(serial, authorId){
  const newSerial = new SerialSchema({
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

module.exports = SerialSchema;
