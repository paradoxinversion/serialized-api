import axios from "axios";
import axiosInstance from "../../axiosInstance";
const handleSerialPartSubmission = async (serialId, title, content) => {
  const uri = `/serials/${serialId}`;
  const data ={
    title,
    content
  };
  const configuration = {
    withCredentials: true
  };
  const submissionResult = await axiosInstance.post(uri, data, configuration);
  return submissionResult;
};

export default handleSerialPartSubmission;
