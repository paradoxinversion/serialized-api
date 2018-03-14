import axios from "axios";

const getUserData = async () =>{
  try{
    const userData = await axios.get("/users", { withCredentials: true });
    return userData;
  } catch (e){
    console.error("Something went wrong: \n ", e);
  }
};

export default getUserData;
