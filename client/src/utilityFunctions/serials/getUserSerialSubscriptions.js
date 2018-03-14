import axios from "axios";

// Returns all of the client's serial subscriptions
const getUserSerialSubscriptions = async () => {
  const subscriptions = await axios.get(`/serial-subscriptions`,{
    withCredentials: true
  });
  return subscriptions.data;
};

export default getUserSerialSubscriptions;
