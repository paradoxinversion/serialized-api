import axios from "axios";

export const getSerialLikes = async (serialData) => {
  try{
    const likes = await axios.get(`/like?entityType=${entityType}&entityId=${entityId}`);
    console.log(likes);
    return likes;
  } catch (e){
    throw e;
  }
};

export default getSerialLikes;
