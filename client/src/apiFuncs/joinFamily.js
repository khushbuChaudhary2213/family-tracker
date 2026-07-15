import api from "../utils/axios";

const joinFamily = async (inviteCode) => {
  try {
    // Hits POST /api/v1/family/joinFamily/:inviteCode
    const res = await api.post(`/family/joinFamily/${inviteCode}`);
    return res.data;
  } catch (err) {
    console.error("Error in joinFamily API execution:", err);
    throw err;
  }
};

export default joinFamily;
