import axios from "axios";

const getProfileData = async (username) => {
  try{
    const requestConfiguration = {
      withCredentials: true
    };
    const uri = `/users/${username}`;
    const response = await axios.get(uri, requestConfiguration);
    return response.data;
  } catch (e){
    console.error("Something went wrong: \n ", e);
  }
};

export default getProfileData;
