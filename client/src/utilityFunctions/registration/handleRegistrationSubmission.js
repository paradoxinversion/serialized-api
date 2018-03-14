import axios from "axios";

const handleRegistrationSubmission = async (email, username, firstName, lastName, birthdate, password) => {
  const newUser = await axios.post("/users",
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
