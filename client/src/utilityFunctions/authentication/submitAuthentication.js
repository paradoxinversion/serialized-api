import axiosInstance from "../../axiosInstance"
const handleSubmit = async(email, password) => {
  try{
    await axiosInstance.post("/users/auth", { email, password });
  } catch (e){
    console.error("Something went wrong: \n ", e);
  }
};
export default handleSubmit;
