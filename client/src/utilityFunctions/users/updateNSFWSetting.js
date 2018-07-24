import axiosInstance from "../../axiosInstance";
const updateNSFWSetting = async newSetting => {
  try {
    const userData = await axiosInstance.put(
      "/users",
      { viewNSFW: newSetting },
      {
        withCredentials: true
      }
    );
    return userData;
  } catch (e) {
    console.error("Something went wrong: \n ", e);
  }
};

export default updateNSFWSetting;
