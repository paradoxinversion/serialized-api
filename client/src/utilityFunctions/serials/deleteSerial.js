import axiosInstance from "../../axiosInstance";

const deleteSerial = async (serialId) => {
  await axiosInstance.delete(`/serials?serialId=${serialId}`, {
    withCredentials: true
  });
};


export default deleteSerial;
