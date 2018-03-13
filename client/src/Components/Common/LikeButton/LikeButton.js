import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
class LikeButton extends React.Component {

  async toggleLike(){
    try{
      const likeToggle = await axios.post(`/like`, {
        entityType: this.props.entityType,
        entityId: this.props.entityId
      });
    } catch (e){
      console.log(e);
      throw e;
    }
  }

  render(){
    return (
      <button onClick={async () => {
        await this.toggleLike();
        await this.props.getLikes();
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
