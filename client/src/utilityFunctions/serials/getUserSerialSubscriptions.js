
import axiosInstance from "../../axiosInstance"
// Returns all of the client's serial subscriptions
const getUserSerialSubscriptions = async () => {
  const subscriptions = await axiosInstance.get(`/serial-subscriptions`,{
    withCredentials: true
  });
  return subscriptions.data;
};

export default getUserSerialSubscriptions;
