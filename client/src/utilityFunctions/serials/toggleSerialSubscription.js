import axiosInstance from "../../axiosInstance"
/**
  Toggle whether or not an authenticated user is subscribed to a serial.
**/
const toggleSerialSubscription = async(serialId) => {
  try{
    return await axiosInstance.get(`/serial-subscriptions/${serialId}`, {
      withCredentials: true
    });
  } catch (e){
    console.log(e);
    throw e;
  }
}

export default toggleSerialSubscription;
