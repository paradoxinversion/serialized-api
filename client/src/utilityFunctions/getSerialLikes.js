import axiosInstance from "../axiosInstance";
export const getSerialLikes = async (serialData, entityType, entityId) => {
  try {
    const likes = await axiosInstance.get(
      `/like?entityType=${entityType}&entityId=${entityId}`
    );
    return likes;
  } catch (e) {
    throw e;
  }
};

export default getSerialLikes;
