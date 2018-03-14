import axios from "axios";

const handleProfileSubmit = async (biography) => {
  await axios.put("/users", { biography }, {withCredentials: true});
};

export default handleProfileSubmit;
