import axiosInstance from "../../axiosInstance";
const checkForRegisteredUsername = async username => {
  try {
    const usernameCheckResponse = await axiosInstance.get(
      `/users/register/check?username=${username}`
    );
    return usernameCheckResponse;
  } catch (e) {
    console.error("Something went wrong: \n ", e);
  }
};

export default checkForRegisteredUsername;
