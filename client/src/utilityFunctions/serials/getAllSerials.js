import axiosInstance from "../../axiosInstance";
const getUserSerialData = async () => {
  try{
    const serialData = await axiosInstance.get("/serials", {
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
