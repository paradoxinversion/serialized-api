import axiosInstance from "../../axiosInstance";
const getSerialPart = async (serialId, partId) => {
  const uri = `/serials/${serialId}/${partId}`;
  const configuration = { withCredentials: true };
  const serialPartData = await axiosInstance.get(uri, configuration);
  return { part: serialPartData.data.part };
};

export default getSerialPart;
