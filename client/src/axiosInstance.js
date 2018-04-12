import axios from "axios";
const baseURL = (window.location.host.includes("localhost")) ? "http://localhost:3001/api/v1" : "http://serialized.herokuapp.com/api/v1";
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true
});

export default axiosInstance;