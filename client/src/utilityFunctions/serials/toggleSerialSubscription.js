import axios from "axios";

/**
  Toggle whether or not an authenticated user is subscribed to a serial.
**/
const toggleSerialSubscription = async(serialId) => {
  try{
    return await axios.get(`/serial-subscriptions/${serialId}`, {
      withCredentials: true
    });
  } catch (e){
    console.log(e);
    throw e;
  }
}

export default toggleSerialSubscription;
