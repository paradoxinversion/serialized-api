import axiosInstance from "../../axiosInstance";
const handleProfileSubmit = async (biography) => {
  await axiosInstance.put("/users", { biography }, {withCredentials: true});
};

export default handleProfileSubmit;
