import axios from "axios";

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
  await axios.post(uri, data, configuration);
};

export default handleSerialSubmit;
