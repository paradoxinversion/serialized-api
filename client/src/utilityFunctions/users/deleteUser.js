import axiosInstance from "../../axiosInstance";
const deleteUser = async userToDelete => {
  try {
    const deletionResult = await axiosInstance.delete(
      "/users",

      { data: { userToDelete }, withCredentials: true }
    );
    return deletionResult;
  } catch (e) {
    console.error("Something went wrong: \n ", e);
  }
};

export default deleteUser;
