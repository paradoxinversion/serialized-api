import axios from "axios";
import axiosInstance from "../axiosInstance"
export const getLikes = async (entityType, entityId) => {
  try{
    const likes = await axiosInstance.get(`/like?entityType=${entityType}&entityId=${entityId}`);
    console.log(likes);
    return likes;
  } catch (e){
    throw e;
  }
};

export default getLikes;
