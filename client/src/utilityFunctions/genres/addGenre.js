import axiosInstance from "../../axiosInstance";
const addGenre = async (name, description) => {
  const newGenre = await axiosInstance.post("/genre", {
    name,
    description
  });
  return newGenre;
};

export default addGenre;
