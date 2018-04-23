import React from "react";
import pell from "pell";

class PellContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      rawContents: null,
      editor: null
    };
    this.textChanged = this.textChanged.bind(this); 
  }
  
  static getDerivedStateFromProps(nextProps, prevState){
    console.log("NEXT", nextProps);
    console.log("PREV", prevState);
    // const editor = prevState.editor;
    // if (editor){
    //   editor.content.innerHTML = nextProps.oldContent;
    // }
   
    
  }
  textChanged(htmlText){
    this.props.textChanged(htmlText)
  }
  componentDidMount(){
    console.log(this.props)
    this.initializePell(this.props.oldContent);
  }
  initializePell(initialContent){
    const pellEditor = pell.init({
      element: document.getElementById("editor"),
      defaultParagraphSeparator: "br",
      onChange: html => {this.setState({
        html
      });}
    });
    pellEditor.content.innerHTML = initialContent;
    
  }


  render(){
    return(
      <div className="text-editor" >
        <div id="editor" ></div>
      </div>
    );
  }
}

export default PellContainer;