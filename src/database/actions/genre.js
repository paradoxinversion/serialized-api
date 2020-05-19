const Genre = require("../mongo/Genre");

/**
 * Add a new Genre to the db
 * @param {String} name - The name of the Genre to create
 * @param {*} description - The description of the genre
 */
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
    throw e;
  }
};

/**
 * Return all genres in the database.
 */
const getGenres = async () => {
  try {
    const genres = await Genre.find({});
    return genres;
  } catch (e) {
    throw e;
  }
};

/**
 * Modify a genre in the database
 * @param {*} id - the id of the genre to modify
 * @param {*} newName - the new name, if any, for the genre
 * @param {*} newDescription - the new description, if any, for the genre
 */
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

/**
 * Delete a genre by its id
 * @param {String} id - the id of the genre to delete
 */
const deleteGenre = async (id) => {
  try {
    const genre = await Genre.findByIdAndDelete(id);
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
