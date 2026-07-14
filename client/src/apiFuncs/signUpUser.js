import api from "../utils/axios";

const signUpUser = async ({ name, phoneNumber, password, confirmPassword }) => {
  try {
    const res = await api.post("/users/signup", {
      name,
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
