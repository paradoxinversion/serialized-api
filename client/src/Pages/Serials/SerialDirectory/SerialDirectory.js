import React from "react";
import { Link } from "react-router-dom";
import SerialList from "../../../Components/Common/SerialList/SerialList";
import "./SerialDirectory.css";
class SerialDirectory extends React.Component{
  constructor(props){
    super(props);
  }

  async componentWillMount(){
    await this.props.lookupSerials();
  }

  render () {
    let list;
    if (this.props.serials){
      list = (
        <SerialList
          emptyListMessage="No one has written any serials yet."
          serials={this.props.serials}
          toggleSerialSubscription={this.props.toggleSerialSubscription}
          clientUser={this.props.clientUser}/>
      );
    }else{
      list = (
        <p> Getting Serials... </p>
      );
    }
    return (
      <div className="serial-directory">
        <header className="directory-header">
          <h1 className="title">Directory</h1>
          <Link className="button is-primary" to='/serials/create'> Create a Serial </Link>
        </header>
        {list}
      </div>
    );
  }
}

export default SerialDirectory;
