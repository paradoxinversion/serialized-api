import axios from "axios";

/**
  Get serials owned by the authenticated user
**/
const getClientUserSerials = async (userId) => {
  try{
    const serialData = await axios.get(`/serials?userId=${userId}`, {
      withCredentials: true
    });
    return serialData.data;
  } catch (e){
    console.error("Something went wrong: \n ", e);
  }
};

export default getClientUserSerials;
