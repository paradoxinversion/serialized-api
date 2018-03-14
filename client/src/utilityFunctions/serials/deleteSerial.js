import axios from "axios";

const deleteSerial = async (serialId) => {
  await axios.delete(`/serials?serialId=${serialId}`, {
    withCredentials: true
  });
};


export default deleteSerial;
