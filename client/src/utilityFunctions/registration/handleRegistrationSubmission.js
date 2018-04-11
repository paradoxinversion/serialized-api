import axiosInstance from "../../axiosInstance";
const handleRegistrationSubmission = async (email, username, firstName, lastName, birthdate, password) => {
  const newUser = await axiosInstance.post("/users",
    {
      email,
      username,
      firstName,
      lastName,
      birthdate,
      password
    });
  return newUser;
};

export default handleRegistrationSubmission;
