import React from "react";

class Card extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="card">
        <p>{this.props.cardTitle} </p>
      </div>
    );
  }
}

export default Card;