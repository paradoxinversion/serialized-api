import axiosInstance from "../../axiosInstance";
/**
 * Toggles the liked state of the specified entity type
 * @param {*} serialPartId
 */
const toggleLike = async serialPartId => {
  try {
    const likeToggle = await axiosInstance.post(`/like`, {
      serialPartId
    });
    return likeToggle;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
export default toggleLike;
