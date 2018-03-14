import axios from "axios";

const getSerialPart = async (serialId, partId) => {
  const uri = `/serials/${serialId}/${partId}`;
  const configuration = { withCredentials: true };
  const serialPartData = await axios.get(uri, configuration);
  return { part: serialPartData.data.part };
};

export default getSerialPart;
