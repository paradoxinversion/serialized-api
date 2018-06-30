import axiosInstance from "../../axiosInstance";
const handleSubmit = async (email, password) => {
  try {
    const authenticationResult = await axiosInstance.post("/users/auth", {
      email,
      password
    });
    return authenticationResult;
  } catch (e) {
    console.error("Something went wrong: \n ", e);
  }
};
export default handleSubmit;
