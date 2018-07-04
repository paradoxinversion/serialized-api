import React from "react";
import PropTypes from "prop-types";
import Quill from "quill";
import "./quill.snow.css";
import QuillDeltaToHtmlConverter from "quill-delta-to-html";
import "./QuillContainer.css";
class QuillContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawContents: null,
      contentLoaded: false
    };
    this.handleUserInput = this.handleUserInput.bind(this);
    this.convertQuillDelta = this.convertQuillDelta.bind(this);
  }

  componentDidMount() {
    const quill = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: this.props.toolbarOptions
      }
    });
    if (this.props.value) {
      quill.clipboard.dangerouslyPasteHTML(this.props.value, "api");
    }
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

  componentWillUnmount() {
    this.state.quill.off("text-change");
  }
  convertQuillDelta() {
    const deltaOps = this.state.rawContents.ops;
    const c = {};
    const converter = new QuillDeltaToHtmlConverter(deltaOps, c);
    const html = converter.convert();
    this.props.textChanged(html);
  }
  handleUserInput() {}
  render() {
    return (
      <div className="text-editor">
        <div id="editor" />
      </div>
    );
  }
}

QuillContainer.propTypes = {
  textChanged: PropTypes.func.isRequired,
  toolbarOptions: PropTypes.array
};

export default QuillContainer;
