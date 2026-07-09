import api from "../utils/axios";

const signUpUser = async ({ phoneNumber, password, confirmPassword }) => {
  try {
    const res = await api.post("/users/signup", {
      phoneNumber,
      password,
      confirmPassword,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    // throw new Error(err.response.data);
  }
};

export default signUpUser;
