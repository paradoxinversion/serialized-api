import axios from "axios";

const getUserSerialData = async (userId) => {
  try{

    const requestConfiguration = {
      withCredentials: true
    };
    const uri = `/serials?userId=${userId}`;
    const serialData = await axios.get(uri, requestConfiguration);
    return serialData.data;
  } catch (e){
    console.error("Something went wrong: \n ", e);
  }
};

export default getUserSerialData;
