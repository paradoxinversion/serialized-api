import React from "react";
import PropTypes from "prop-types";
import { QuillContainer } from "../../../Components/Common/Forms/FormComponents";
class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      biography: ""
    };
    this.handleQuillInput = this.handleQuillInput.bind(this);
  }
  componentDidMount() {}
  handleQuillInput(quillContent) {
    this.setState({
      biography: quillContent
    });
    this.props.textChanged(quillContent);
  }
  render() {
    return (
      <main>
        <header className="container">
          <h1> Profile Edit </h1>
        </header>
        <section className="container container--centered">
          <form className="form form--standalone">
            <QuillContainer textChanged={this.handleQuillInput} />
            <section className="form__option-bar">
              <button
                className="button button--primary form__button--center"
                onClick={this.props.handleSubmit}>
                {" "}
                Submit{" "}
              </button>
              <button
                className="button button--warn form__button--end"
                onClick={this.props.handleCancel}>
                {" "}
                Cancel{" "}
              </button>
            </section>
          </form>
        </section>
      </main>
    );
  }
}
ProfileEdit.propTypes = {
  textChanged: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};
export default ProfileEdit;
