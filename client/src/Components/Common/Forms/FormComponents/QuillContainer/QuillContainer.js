import React from "react";
import PropTypes from "prop-types";
import Quill from "quill";
import "./quill.snow.css";
import QuillDeltaToHtmlConverter from "quill-delta-to-html";

class QuillContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      rawContents: null
    };
    this.handleUserInput = this.handleUserInput.bind(this);
    this.convertQuillDelta = this.convertQuillDelta.bind(this);
  }
  componentDidMount(){
    const quill = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: this.props.toolbarOptions
      }
    });

    quill.on("text-change", () => {
      this.setState({
        rawContents: quill.getContents()
      });

      this.convertQuillDelta();
    });

    this.setState({
      quill
    });
  }

  componentWillUnmount(){
    this.state.quill.off("text-change");
  }
  convertQuillDelta(){
    const deltaOps = this.state.rawContents.ops;
    const c = {};
    const converter = new QuillDeltaToHtmlConverter(deltaOps, c);
    const html = converter.convert();
    this.props.textChanged(html);
  }
  handleUserInput(){

  }
  render(){
    return (
      <div>
        <div id="editor"></div>
      </div>
    );
  }
}

QuillContainer.propTypes ={
  textChanged: PropTypes.func.isRequired,
  toolbarOptions: PropTypes.array
};

export default QuillContainer;
