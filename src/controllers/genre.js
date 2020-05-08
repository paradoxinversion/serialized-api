const genreActions = require("../database/actions/genre");

const create = async (req, res) => {
  try {
    const newGenre = await genreActions.createGenre(
      req.body.name,
      req.body.description
    );
    res.json(newGenre);
  } catch (e) {
    res.json({
      error: e,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const genres = await genreActions.getGenres();
    res.json({
      genres: genres,
    });
  } catch (e) {
    res.json({
      error: e,
    });
  }
};

const deleteOne = async (req, res) => {
  try {
    const newGenre = await genreActions.createGenre(
      req.body.name,
      req.body.description
    );
    res.json(newGenre);
  } catch (e) {
    res.json({
      error: e,
    });
  }
};

const update = async (req, res) => {
  try {
    const newGenre = await genreActions.updateGenre(
      req.body.id,
      req.body.name,
      req.body.description
    );
    res.json(newGenre);
  } catch (e) {
    res.json({
      error: e,
    });
  }
};
module.exports = {
  create,
  deleteOne,
  update,
  getAll,
};
