import axiosInstance from "../../axiosInstance"
/**
  Get the serial matching the serialId and all parts created for it.
**/
const getSerialAndPartData = async (serialId) => {
  try{
    const result = await axiosInstance.get(`/serials/${serialId}`, {
      withCredentials: true
    });
    return {
      currentSerial: result.data.serial,
      serialParts: result.data.serialParts
    };
  } catch (e) {
    throw e;
  }

};

export default getSerialAndPartData;
