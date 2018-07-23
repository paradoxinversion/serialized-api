import axiosInstance from "../../axiosInstance";
const updateGenre = async (name, description, id) => {
  const deletedGenre = await axiosInstance.put("/genre", {
    name,
    description,
    id
  });
  return deletedGenre;
};

export default updateGenre;
