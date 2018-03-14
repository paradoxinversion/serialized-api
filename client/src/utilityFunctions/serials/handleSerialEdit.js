import axios from "axios";

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
  const serialEditResponse = await axios.put(uri, data, configuration);
  return serialEditResponse;
};

export default handleSerialEdit;
