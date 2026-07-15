import api from "../utils/axios";

const createFamily = async (familyName) => {
  try {
    const res = await api.post("/family/createFamily", { familyName });
    // console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default createFamily;
