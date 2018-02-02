import React from "react";
import PropTypes from "prop-types";
import {QuillContainer} from "../../../Components/Common/Forms/FormComponents";
class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      biography: ""
    };
    this.handleQuillInput = this.handleQuillInput.bind(this);
  }
  componentDidMount(){
  }
  handleQuillInput(quillContent){
    this.setState({
      biography: quillContent
    });
    this.props.textChanged(quillContent);
  }
  render() {
    return (
      <div>
        <h1> Profile Edit </h1>
        <QuillContainer textChanged={this.handleQuillInput}/>
        <button className="button" onClick={this.props.handleSubmit}> Submit </button>
        <button className="button" onClick={this.props.handleCancel}> Cancel </button>
      </div>
    );
  }
}
ProfileEdit.propTypes = {
  textChanged: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};
export default ProfileEdit;
