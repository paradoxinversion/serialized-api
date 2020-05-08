const Genre = require("../mongo/Genre");
const createGenre = async (name, description) => {
  try {
    const doesGenreExist = await Genre.findOne({ name });
    if (doesGenreExist !== null) {
      const genreExistsError = new Error("Genre Exists");
      throw genreExistsError;
    }
    const newGenre = new Genre({
      name,
      description,
    });

    await newGenre.save();
    return newGenre;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getGenres = async () => {
  try {
    const genres = await Genre.find({});
    return genres;
  } catch (e) {
    throw e;
  }
};

const updateGenre = async (id, newName, newDescription) => {
  try {
    const update = {};
    if (newName) {
      update.name = newName;
    }
    if (newDescription) {
      update.description = newDescription;
    }
    const genre = await Genre.updateOne({ _id: id }, update);
    return genre;
  } catch (e) {
    throw e;
  }
};

const deleteGenre = async (name) => {
  try {
    const genre = await Genre.deleteOne({ name });
    return genre;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createGenre,
  deleteGenre,
  getGenres,
  updateGenre,
};
