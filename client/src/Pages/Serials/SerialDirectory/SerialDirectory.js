import React from "react";
import { Link } from "react-router-dom";
import SerialList from "../../../Components/Common/SerialList/SerialList";
import "./SerialDirectory.css";
class SerialDirectory extends React.Component {
  async componentDidMount() {
    await this.props.lookupSerials();
  }

  render() {
    let list;
    if (this.props.serials) {
      list = (
        <SerialList
          emptyListMessage="No one has written any serials yet."
          serials={this.props.serials}
          toggleSerialSubscription={this.props.toggleSerialSubscription}
          clientUser={this.props.clientUser}
        />
      );
    } else {
      list = <p> Getting Serials... </p>;
    }
    return (
      <main className="serial-directory">
        <header className="directory-header container">
          <h1>Serial Directory</h1>
          <Link className="button button--primary" to="/serials/create">
            {" "}
            Create a Serial{" "}
          </Link>
        </header>
        <section className="container">{list}</section>
      </main>
    );
  }
}

export default SerialDirectory;
