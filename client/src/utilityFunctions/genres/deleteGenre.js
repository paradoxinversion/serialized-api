import axiosInstance from "../../axiosInstance";
const deleteGenre = async name => {
  const deletedGenre = await axiosInstance.delete("/genre", {
    name
  });
  return deletedGenre;
};

export default deleteGenre;
