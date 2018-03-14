import axios from "axios";

const getUserSerialData = async () => {
  try{
    const serialData = await axios.get("serials", {
      withCredentials: true
    });
    return {
      serials: serialData.data
    };
  } catch (e){
    console.error("Something went wrong: \n ", e);
  }
};

export default getUserSerialData;
