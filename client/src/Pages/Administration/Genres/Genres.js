import React, { Component } from "react";
import AdminGenre from "../../../Components/AdminGenre/AdminGenre";
import getGenres from "../../../utilityFunctions/genres/getGenres";
import addGenre from "../../../utilityFunctions/genres/addGenre";
class Genres extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      genres: [],
      addingNewGenre: false,
      alertText: ""
    };
    this.handleFormInput = this.handleFormInput.bind(this);
    this.handleAddNewGenre = this.handleAddNewGenre.bind(this);
  }
  async componentDidMount() {
    const genresFetchResponse = await getGenres();
    console.log(genresFetchResponse);
    this.setState({
      genres: genresFetchResponse.data.genres
    });
  }
  handleFormInput(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  async handleAddNewGenre(event) {
    event.preventDefault();
    const addGenreFetchResponse = await addGenre(
      this.state["new-genre-name"],
      this.state["new-genre-description"]
    );
    const genresFetchResponse = await getGenres();

    console.log(addGenreFetchResponse);
    this.setState({
      alertText: "Genre Added",
      genres: genresFetchResponse.data.genres
    });
  }
  render() {
    return (
      <div>
        <p>{this.state.alertText}</p>
        {this.state.loading ? (
          <div>
            <h1>Genres Administration</h1>
            <div>
              {this.state.genres.map(genre => {
                return (
                  <AdminGenre
                    key={genre._id}
                    id={genre._id}
                    name={genre.name}
                    description={genre.description}
                  />
                );
              })}
            </div>
            <button
              onClick={() => {
                this.setState({ addingNewGenre: true });
              }}>
              Add Genre
            </button>
            {this.state.addingNewGenre ? (
              <div>
                <p>Add New Genre</p>
                <form>
                  <label htmlFor="new-genre-name">Genre Name</label>
                  <input
                    name="new-genre-name"
                    type="text"
                    onChange={this.handleFormInput}
                  />
                  <label htmlFor="new-genre-description">
                    Genre Description
                  </label>
                  <input
                    name="new-genre-description"
                    type="text"
                    onChange={this.handleFormInput}
                  />
                  <button onClick={this.handleAddNewGenre}>Submit</button>
                </form>
                <button
                  onClick={() => {
                    this.setState({ addingNewGenre: false });
                  }}>
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <p>Loading Genre Data</p>
        )}
      </div>
    );
  }
}

export default Genres;
