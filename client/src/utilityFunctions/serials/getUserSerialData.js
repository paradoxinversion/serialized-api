import axios from "axios";
import axiosInstance from "../../axiosInstance";
const getUserSerialData = async (userId) => {
  try{

    const requestConfiguration = {
      withCredentials: true
    };
    const serialData = await axiosInstance.get(`/serials?userId=${userId}`, requestConfiguration);
    return serialData.data;
  } catch (e){
    console.error("Something went wrong: \n ", e);
  }
};

export default getUserSerialData;
