import axios from "axios";
const baseURL = (window.location.host === "localhost:3001") ? "http://localhost:3001/api/v1" : "http://serialized.herokuapp.com/api/v1";
const axiosInstance = axios.create({
  baseURL
});

export default axiosInstance;