import axiosInstance from "../../axiosInstance";
const getUserData = async () =>{
  try{
    const userData = await axiosInstance.get("/users", { withCredentials: true });
    return userData;
  } catch (e){
    console.error("Something went wrong: \n ", e);
  }
};

export default getUserData;
