
import axiosInstance from "../../axiosInstance"
const handleSerialSubmit = async (title, synopsis, genre, nsfw) => {
  const uri = `/serials`;
  const data = {
    title,
    synopsis,
    genre,
    nsfw
  };
  const configuration = {
    withCredentials: true
  };
  await axiosInstance.post(uri, data, configuration);
};

export default handleSerialSubmit;
