import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import HTMLMarkupContainer from "../../../Components/Containers/HTMLMarkupContainer/HTMLMarkupContainer";
import SerialStepper from "../../../Components/SerialStepper/SerialStepper";
import LikeButton from "../../../Components/Common/LikeButton/LikeButton";
import LikeCounter from "../../../Components/Common/LikeCounter/LikeCounter";
import getLikes from "../../../utilityFunctions/getLikes";
import checkForUserLike from "../../../utilityFunctions/likes/checkForUserLike";
import getSerialPart from "../../../utilityFunctions/serials/getSerialPart";
import "./ViewSerialPart.css";

class ViewSerialPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      part: null,
      likes: [],
      likedByUser: false
    };
    this.getLikes = this.getLikes.bind(this);
  }

  async componentDidMount() {
    if (
      this.props.currentSerial == null ||
      this.props.currentSerial._id !== this.props.match.params.id
    ) {
      await this.props.getSerialData(this.props.match.params.id);
    }
    await this.getSerialPart();
    await this.getLikes();
  }

  async getSerialPart() {
    const response = await getSerialPart(
      this.props.match.params.id,
      this.props.match.params.partId
    );
    this.setState({ part: response.part });
  }

  async getLikes() {
    try {
      const likes = await getLikes(this.props.match.params.partId);
      await this.setState({
        likes: likes.data.likes
      });
      if (this.props.clientUser !== null) {
        const userLike = checkForUserLike(
          this.props.clientUser._id,
          this.state.likes
        );
        await this.setState({
          likedByUser: userLike
        });
      }
    } catch (e) {
      throw e;
    }
  }

  render() {
    if (this.state.part) {
      return (
        <main className="serial-part-container">
          <header className="container">
            <div className="serial-part-metadata">
              <div className="serial-part-metadata-info">
                <h1> {this.state.part.title}</h1>
                <p className="subtitle">
                  {" "}
                  By {this.props.currentSerial.author_id.username}
                </p>
                <p>
                  {`Part ${this.state.part.part_number + 1}`} of{" "}
                  {`${this.props.serialParts.length} in ${
                    this.props.currentSerial.title
                  }`}
                </p>
              </div>
              <section className="serial-part-meta-options">
                <div className=" serial-part-meta-option serial-part-metadata-likes">
                  <LikeCounter totalLikes={this.state.likes.length} />
                  {this.props.clientUser && this.props.clientUser._id ? (
                    <LikeButton
                      clientUser={this.props.clientUser}
                      serialPartId={this.state.part._id}
                      getLikes={this.getLikes}
                      likes={this.state.likes}
                      isLiked={this.state.likedByUser}
                    />
                  ) : null}
                </div>

                <Fragment>
                  <Link
                    className="button serial-part-meta-option "
                    to={`/serials/${this.props.currentSerial._id}`}>
                    Back to {this.props.currentSerial.title}
                  </Link>
                  {this.props.clientUser &&
                  this.props.clientUser._id ===
                    this.props.currentSerial.author_id._id ? (
                    <Fragment>
                      <Link
                        className="button button--warn serial-part-meta-option"
                        to={`/serials/${this.props.currentSerial._id}/${
                          this.state.part._id
                        }/edit`}>
                        {" "}
                        Edit{" "}
                      </Link>
                    </Fragment>
                  ) : null}
                </Fragment>
              </section>
            </div>
            <hr className="horizontal-rule" />
          </header>

          <section className="container">
            <article className="serial-part-content-area">
              <HTMLMarkupContainer
                isStoryContent={true}
                content={this.state.part.content}
              />
            </article>

            <SerialStepper
              currentSerial={this.props.currentSerial}
              currentPart={this.state.part}
              serialParts={this.props.serialParts}
            />
          </section>
        </main>
      );
    } else {
      return null;
    }
  }
}

ViewSerialPart.propTypes = {
  match: PropTypes.object.isRequired,
  clientUser: PropTypes.object,
  currentSerial: PropTypes.object,
  getSerialData: PropTypes.func,
  serialParts: PropTypes.array
};

export default withRouter(ViewSerialPart);
