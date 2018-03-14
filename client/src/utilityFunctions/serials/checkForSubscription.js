import axios from "axios";

const checkForSubscription = async (serialId) =>{
  const result = await axios.get(`/serial-subscriptions/${serialId}/check`);
  if (result.data && !result.data.error){
    return {
      isSubscribed: true
    };
  } else{
    return {
      isSubscribed: false
    };
  }
};
export default checkForSubscription;
