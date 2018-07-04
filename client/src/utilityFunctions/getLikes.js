import axiosInstance from "../axiosInstance";
export const getLikes = async serialPartId => {
  try {
    const likes = await axiosInstance.get(`/like?serialPartId=${serialPartId}`);
    return likes;
  } catch (e) {
    throw e;
  }
};

export default getLikes;
