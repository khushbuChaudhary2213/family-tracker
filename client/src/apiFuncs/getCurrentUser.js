import api from "../utils/axios";

const getCurrentUser = async () => {
  try {
    const res = await api.get("/users/me");
    // console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    // throw new Error(err);
  }
};

export default getCurrentUser;
