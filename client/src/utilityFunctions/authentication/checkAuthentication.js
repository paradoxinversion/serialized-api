import axiosInstance from "../../axiosInstance";
const checkAuthentication = async () => {
  const result = await axiosInstance.get("/users/auth", {
    withCredentials: true
  });
  if (result.data.isAuthenticated) {
    return {
      isAuthenticated: true,
      user: result.data.user
    };
  } else {
    return {
      isAuthenticated: false,
      user: null
    };
  }
};

export default checkAuthentication;
