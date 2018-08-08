import axiosInstance from "../../axiosInstance";
/**
 * Toggles the liked state of the specified entity type
 * @param {*} reportDetails
 */
const sendReport = async reportDetails => {
  try {
    const reportResponse = await axiosInstance.post(`/report`, {
      reportDetails
    });
    return reportResponse;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
export default sendReport;
