import React from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, info){
    console.log(error, info);
  }

  render(){
    if (this.state.hasError){
      return <h1> Error </h1>
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  authStatus: PropTypes.bool.isRequired,
  clientUser: PropTypes.object,
  match: PropTypes.object.isRequired
};

export default ErrorBoundary;
