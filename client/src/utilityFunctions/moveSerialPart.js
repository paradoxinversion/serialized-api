import axios from "axios";

const moveSerialPart = async(serialId, partId, up) => {
  const payload = {
    moveUp: up
  }
  return await axios.put(`/serials/${serialId}/${partId}`, payload, {withCredentials: true});

  // await this.props.getSerialData(this.props.currentSerial._id);
};

export default moveSerialPart;
