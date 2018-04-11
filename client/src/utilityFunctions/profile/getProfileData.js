import axiosInstance from "../../axiosInstance";
const getProfileData = async (username) => {
  try{
    const requestConfiguration = {
      withCredentials: true
    };
    const uri = `/users/${username}`;
    const response = await axiosInstance.get(uri, requestConfiguration);
    return response.data;
  } catch (e){
    console.error("Something went wrong: \n ", e);
  }
};

export default getProfileData;
