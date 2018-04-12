import axiosInstance from "../../axiosInstance";
const handleSubmit = async(email, password) => {
  try{
    const c = await axiosInstance.post("/users/auth", { email, password });
    console.log(c);
  } catch (e){
    console.error("Something went wrong: \n ", e);
  }
};
export default handleSubmit;
