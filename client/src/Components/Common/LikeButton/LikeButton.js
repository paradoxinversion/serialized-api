import React from "react";
import PropTypes from "prop-types";
import toggleLike from "../../../utilityFunctions/likes/toggleLike";
import checkForUserLike from "../../../utilityFunctions/likes/checkForUserLike";
class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false
    };
  }

  async toggleLike() {
    try {
      await toggleLike(this.props.serialPartId);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  render() {
    return (
      // <i className="fas fa-heart" />

      <button
        className="button"
        onClick={async () => {
          await Promise.all[
            (await this.toggleLike(), await this.props.getLikes())
          ];
        }}>
        {this.props.isLiked ? <p>Unlike</p> : <p>Like</p>}
      </button>
    );
  }
}

LikeButton.propTypes = {
  serialPartId: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired
};
export default LikeButton;
