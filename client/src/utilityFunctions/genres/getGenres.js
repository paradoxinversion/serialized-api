import axiosInstance from "../../axiosInstance";
const getGenres = async () => {
  const genres = await axiosInstance.get("/genre");
  return genres;
};

export default getGenres;
