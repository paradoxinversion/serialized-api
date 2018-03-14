import axios from "axios";

const handleSubmit = async(email, password) => {
  try{
    await axios.post("/users/auth", { email, password });
  } catch (e){
    console.error("Something went wrong: \n ", e);
  }
};
export default handleSubmit;
