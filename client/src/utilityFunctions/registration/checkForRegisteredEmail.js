import axiosInstance from "../../axiosInstance";
const checkForRegisteredEmail = async email => {
  try {
    const emailCheckResponse = await axiosInstance.get(
      `/users/register/check?email=${email}`
    );
    return emailCheckResponse;
  } catch (e) {
    console.error("Something went wrong: \n ", e);
  }
};

export default checkForRegisteredEmail;
