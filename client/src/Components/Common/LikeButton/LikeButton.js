import React from "react";
import PropTypes from "prop-types";
import toggleLike from "../../../utilityFunctions/likes/toggleLike";
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
      <button
        className="button serial-part-meta-option"
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
  match: PropTypes.object.isRequired,
  isLiked: PropTypes.bool.isRequired,
  getLikes: PropTypes.func.isRequired
};
export default LikeButton;
