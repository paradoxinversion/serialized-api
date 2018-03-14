import axios from "axios";

const handleSerialPartSubmission = async (serialId, title, content) => {
  const uri = `/serials/${serialId}`;
  const data ={
    title,
    content
  };
  const configuration = {
    withCredentials: true
  };
  const submissionResult = await axios.post(uri, data, configuration);
  return submissionResult;
};

export default handleSerialPartSubmission;
