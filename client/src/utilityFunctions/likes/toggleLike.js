import axiosInstance from "../../axiosInstance";
const toggleLike = async (entityType, entityId, parentEntityId) => {
  try{
    const likeToggle = await axiosInstance.post(`/like`, {
      entityType,
      entityId,
      parentEntityId
    });
    return likeToggle;
  } catch (e){
    console.log(e);
    throw e;
  }
};
export default toggleLike;
