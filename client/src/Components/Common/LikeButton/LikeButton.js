import React from "react";
import PropTypes from "prop-types";
import toggleLike from "../../../utilityFunctions/likes/toggleLike";
class LikeButton extends React.Component {

  async toggleLike(){
    try{
      await toggleLike(this.props.entityType, this.props.entityId, this.props.parentEntityId);
    } catch (e){
      console.log(e);
      throw e;
    }
  }

  render(){
    return (
      <button onClick={async () => {
        await Promise.all[
          await this.toggleLike(),
          await this.props.getLikes()
        ];
      }}>Like</button>
    );
  }
}

LikeButton.propTypes = {
  entityType: PropTypes.number.isRequired,
  entityId: PropTypes.number.isRequired,
  match: PropTypes.object.isRequired
};
export default LikeButton;
