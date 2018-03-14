import axios from "axios";

const getUserSerialSubscriptions = async () => {
  const subscriptions = await axios.get(`/serial-subscriptions`,{
    withCredentials: true
  });
  return subscriptions.data;
};

export default getUserSerialSubscriptions;
