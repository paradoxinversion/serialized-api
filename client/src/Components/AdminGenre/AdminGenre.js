import React, { Component } from "react";
import updateGenre from "../../utilityFunctions/genres/updateGenre";

class AdminGenre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      id: props.id,
      name: props.name,
      description: props.description
    };
    this.handleEditGenre = this.handleEditGenre.bind(this);
    this.handleFormInput = this.handleFormInput.bind(this);
  }
  async handleFormInput(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  async handleEditGenre(event) {
    event.preventDefault();
    const updateGenreFetchResponse = await updateGenre(
      this.state.name,
      this.state.description,
      this.state.id
    );

    this.setState({
      editMode: false
    });
  }
  render() {
    return (
      <React.Fragment>
        {this.state.editMode ? (
          <div>
            <p>Edit</p>
            <form>
              <label htmlFor="name">Genre Name</label>
              <input
                name="name"
                type="text"
                onChange={this.handleFormInput}
                value={this.state.name}
              />
              <label htmlFor="description">Genre Description</label>
              <input
                name="description"
                type="text"
                onChange={this.handleFormInput}
                value={this.state.description}
              />
              <button onClick={this.handleEditGenre}>Submit</button>
            </form>
            <button
              onClick={() => {
                this.setState({ editMode: false });
              }}>
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <p>{this.state.name}</p>
            <p>{this.state.description}</p>
            <button
              onClick={() => {
                this.setState({ editMode: true });
              }}>
              Edit
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default AdminGenre;
