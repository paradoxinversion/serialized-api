import axios from "axios";

const moveSerialPart = async(serialId, partId, up) => {
  const payload = {
    moveUp: up
  };
  return await axios.put(`/serials/${serialId}/${partId}`, payload, {withCredentials: true});
};

export default moveSerialPart;
