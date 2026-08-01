import api from "../utils/axios";

const signUpUser = async ({
  name,
  email,
  phoneNumber,
  password,
  confirmPassword,
}) => {
  try {
    const res = await api.post("/users/signup", {
      name,
      email,
      phoneNumber,
      password,
      confirmPassword,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default signUpUser;
