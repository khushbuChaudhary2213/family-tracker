import api from "../utils/axios";

export default async function fetchFamily() {
  try {
    const res = await api.get("/family/me");
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
