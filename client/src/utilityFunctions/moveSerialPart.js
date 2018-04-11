import axiosInstance from "../axiosInstance";
const moveSerialPart = async(serialId, partId, up) => {
  const payload = {
    moveUp: up
  };
  return await axiosInstance.put(`/serials/${serialId}/${partId}`, payload, {withCredentials: true});
};

export default moveSerialPart;
