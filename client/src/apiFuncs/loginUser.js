import api from "../utils/axios";

const loginUser = async ({ phoneNumber, password }) => {
  try {
    const res = await api.post("/users/login", {
      phoneNumber,
      password,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default loginUser;
