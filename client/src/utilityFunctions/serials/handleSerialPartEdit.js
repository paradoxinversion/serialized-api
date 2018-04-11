
import axiosInstance from "../../axiosInstance";
const handleSerialPartEdit = async (serialId, partId, title, content) => {
  const uri = `/serials/${serialId}/?partId=${partId}`;
  const data = {
    title,
    content
  };
  const configuration = {
    withCredentials: true
  };
  const editResponse = await axiosInstance.put(uri, data, configuration);
  return editResponse;
};

export default handleSerialPartEdit;
