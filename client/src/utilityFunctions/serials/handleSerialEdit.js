import axios from "axios";
import axiosInstance from "../../axiosInstance";
const handleSerialEdit = async (serialId, title, synopsis, genre, nsfw) => {
  const uri = `/serials?serialId=${serialId}`;
  const data = {
    title,
    synopsis,
    genre,
    nsfw
  };
  const configuration = {
    withCredentials: true
  };
  const serialEditResponse = await axiosInstance.put(uri, data, configuration);
  return serialEditResponse;
};

export default handleSerialEdit;
