import axiosInstance from "../../axiosInstance";
/**
 * Toggles the liked state of the specified entity type
 * @param {*} reportDetails
 */
const getReports = async () => {
  try {
    const configuration = {
      withCredentials: true
    };
    const reportsResponse = await axiosInstance.get(`/report`, configuration);
    return reportsResponse;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
export default getReports;
