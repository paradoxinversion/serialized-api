import React from "react";
import PropTypes from "prop-types";
import toggleLike from "../../../utilityFunctions/likes/toggleLike";
class LikeButton extends React.Component {
  async toggleLike() {
    try {
      await toggleLike(
        this.props.entityType,
        this.props.entityId,
        this.props.parentEntityId
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  render() {
    return (
      <i className="fas fa-heart" />

      // <button className="button" onClick={async () => {
      //   await Promise.all[
      //     await this.toggleLike(),
      //     await this.props.getLikes()
      //   ];
      // }}>{
      //     checkForUserLike(this.props.clientUser._id, this.props.likes)
      //       ?
      //       <p>Unlike</p>
      //       :
      //       <p>Like</p>
      //   }</button>
    );
  }
}

LikeButton.propTypes = {
  entityType: PropTypes.number.isRequired,
  entityId: PropTypes.number.isRequired,
  parentEntityId: PropTypes.number,
  match: PropTypes.object.isRequired
};
export default LikeButton;
